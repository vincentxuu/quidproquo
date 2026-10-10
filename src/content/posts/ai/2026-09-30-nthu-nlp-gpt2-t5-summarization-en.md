---
title: "NTHU NLP Guide 11: GPT-2 vs. T5 for Chinese Summarization — Left Padding, −100, and ROUGE"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, gpt-2, hugging-face, fine-tuning, chinese-nlp, pytorch, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 11
tldr: "A guide to the GPT-2 / T5 tutorial in NTHU Prof. Hung-Yu Kao's NLP course (Fall 2025). One task, LCSTS Chinese summarization, is solved twice. Decoder-only GPT-2 is written in native PyTorch: you join article and summary into one sequence, switch to left padding, and set padding labels to −100. Encoder-decoder mT5 uses Seq2SeqTrainer: no left padding needed, and DataCollatorForSeq2Seq handles the −100 for you. Both segment with jieba and score word-level ROUGE."
description: "A guide to huggingface_tutorial_gpt2_t5.pdf, Reference/gpt2_summarization.ipynb, and t5_summarization.ipynb from NTHU Prof. Hung-Yu Kao's Natural Language Processing course (Fall 2025), recorded in Week 9 Tue.: causal LM vs. masked LM vs. seq2seq, the LCSTS dataset, the [CLS] / [SEP] / <|endoftext|> format of uer/gpt2-chinese-cluecorpussmall, left padding, −100 labels, model.generate and max_new_tokens, mT5-small preprocessing, DataCollatorForSeq2Seq and Seq2SeqTrainer, and ROUGE-1 / 2 / L with jieba word-level scoring."
draft: false
glossary:
  - term: "left padding"
    definition: "Pad shorter sequences in a batch on the left so that every sequence's last real token lines up in the same column."
    context: "A decoder-only model appends new tokens on the right, and right padding would place them after the padding. Slide 18 uses this reason to explain why GPT-2 needs left padding."
  - term: "labels = −100"
    definition: "PyTorch's CrossEntropyLoss uses −100 as its default ignore_index, and Hugging Face models follow the convention: positions labeled −100 don't count toward the loss."
    context: "The GPT-2 notebook sets padding labels to −100 by hand; for T5, DataCollatorForSeq2Seq does it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 11 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [decoding strategies and NLG evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en).

The previous part covered decoding strategies and ROUGE. This one puts both into a program that actually runs. The official materials:

- Tutorial slides [huggingface_tutorial_gpt2_t5.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_gpt2_t5.pdf) (63 pages, cover dated 2024/11/05)
- [gpt2_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/gpt2_summarization.ipynb) and [t5_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/t5_summarization.ipynb)
- The [Week 9 Tue.](https://www.youtube.com/live/zgjO_t5eu_E) recording (about 96 minutes, in Mandarin)

The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) lists this deck together with the PEFT deck in the W9 row, and doesn't say which of the two recordings is the tutorial. How I checked: at minutes 10, 40, and 75, Week 9 Tue. shows pages 9, 26, and 50 of this deck, so that one is the tutorial. In the captions of [Week 9 Thu.](https://www.youtube.com/live/zWMHxXc0QvA), the professor opens by saying "these slides are the PEFT material originally scheduled for week nine," which is the subject of [part 13](/posts/ai/2026-09-30-nthu-nlp-peft-en). The row's Topics column ("BERT and its Family") is a syllabus template, so I don't cite it.

Like the [HF BERT tutorial](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en), this tutorial is the 2024 version. It has no assignment attached; treat it as a reference implementation.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=zgjO_t5eu_E
title: Week 9 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=zWMHxXc0QvA
title: Week 9 Thu.
```

Original videos: [Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E)、[Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

## One task, two architectures

Slide 2 sets the scope: train GPT-2 and T5 with cross-entropy for **Chinese abstractive summarization**, using PyTorch, Hugging Face, and ROUGE. Slide 5 separates two kinds of summarization:

- **Extractive**: pick salient sentences from the source.
- **Abstractive**: may produce words and phrases not in the source. The slide's example rewrites "road toll stands at zero" as "slashes road toll."

The dataset is [LCSTS](https://aclanthology.org/D15-1229/) (Hu et al., EMNLP 2015), a large-scale Chinese short-text summarization dataset, loaded from [`hugcyp/LCSTS`](https://huggingface.co/datasets/hugcyp/LCSTS) on Hugging Face. Slide 30 notes that the test split has no public summaries, so both notebooks use only train and validation.

Slides 10–14 put three model types side by side. This table is the map for the whole tutorial:

| Type | Example | Training objective | Hugging Face class |
|---|---|---|---|
| Causal LM | GPT | Predict the next word | `AutoModelForCausalLM` / `GPT2LMHeadModel` |
| Masked LM | BERT | Guess masked words | `AutoModelForMaskedLM` / `BertForMaskedLM` |
| Seq2seq | T5, the original Transformer | Encoder reads the source, decoder generates the target | `AutoModelForSeq2SeqLM` / `T5ForConditionalGeneration` |

Why GPT-2? Slide 4 gives three reasons: it's the last open-source model in OpenAI's GPT series; language generation is hard and GPT-2 is a good starting point; and it's small enough for low-budget machines. The four sizes are 124M (12 layers), 345M (24), 762M (36), and 1.5B (48). The first reason is how the 2024 slides put it; OpenAI has since released the open-weight [gpt-oss](https://github.com/openai/gpt-oss). The other two still hold.

The division of labor is deliberate: **GPT-2 in native PyTorch, T5 with Hugging Face Datasets and Trainer**. Slide 22 explains that generation is complicated, so your first program should be native PyTorch where every step is visible.

## GPT-2: article and summary in one sequence

### Model and tokenizer

The model is [`uer/gpt2-chinese-cluecorpussmall`](https://huggingface.co/uer/gpt2-chinese-cluecorpussmall). Slide 25 flags an easy trap: **this Chinese GPT-2 uses BertTokenizer**. That's why you see `[CLS]`, `[SEP]`, and `[PAD]` instead of English GPT-2's tokens. The notebook adds `<|endoftext|>` as an eos token and calls `model.resize_token_embeddings(len(tokenizer))`. Slide 21 explains that growing the vocabulary appends newly initialized vectors to the end of the embedding matrix.

Because the vocabulary comes from BERT, the notebook also converts Chinese full-width punctuation to half-width, with a comment saying this keeps out-of-vocabulary tokens from turning into `[UNK]`.

### What a training example looks like

A decoder-only model has no separate encoder, so article and summary must share one sequence. `collate_fn` produces:

```text
[CLS] article [SEP] summary <|endoftext|>
```

Slide 26 cites the GPT-2 paper: English GPT-2 was induced to summarize by appending "TL;DR:" after the article. Here the hope is that the model learns `[SEP]` as the signal to start summarizing and `<|endoftext|>` as the signal to stop. The slides also note that `[CLS]` can be dropped, as long as training and inference agree.

### Left padding and −100

This is the heart of the tutorial, on slides 18–20 and 27.

**Why left padding?** Sequences in a batch differ in length and must be padded. With padding on the right, generated tokens would follow `<pad>`, which makes no sense. With padding on the left, every sequence's last real token lines up in the same column, and new tokens land in the right place. So the tokenizer is loaded with `padding_side="left"`.

**Why set padding labels to −100?** For a causal LM, the labels are basically the `input_ids` themselves; the model shifts logits and labels by one internally (slide 28 quotes the two lines in `modeling_gpt2.py`). But padding shouldn't count toward the loss. The docstring quoted on slide 20 is explicit: labels set to −100 are ignored, and loss is computed only for labels in [0, vocab_size]. The notebook does this:

```python
labels = torch.where(
    condition=complete_text.input_ids != tokenizer.pad_token_id,
    input=complete_text.input_ids,
    other=-100,
)
```

Slide 27 illustrates it: a sentence left-padded with two `[PAD]`s gets −100 in its first two label slots.

Slide 19 lists the valid combinations. For fine-tuning, "left padding + −100" (this tutorial) or "right padding + −100" both work. For inference, either use a batch size of 1 (this tutorial's validation batch size is 1) or use left padding.

One thing I noticed reading the code: only padding is masked, so the article tokens also count toward the loss. The model is learning to continue news articles as well as to summarize them. Computing loss on the summary only is a common change and makes a good exercise.

### Generation and evaluation

At inference, the model gets only `[CLS] article [SEP]` and `model.generate()` is called. Slide 37 lists two benefits: no hand-written decoding loop, and no hand-implemented decoding strategies (the greedy, beam, top-k, and top-p from the previous part).

The slides flag two arguments:

- **`max_new_tokens=200`**: without it, Hugging Face counts the input tokens toward the length limit too (slide 41).
- **`pad_token_id=tokenizer.eos_token_id`**: sequences that finish early within a batch should be padded with `<|endoftext|>`, not `[PAD]` (slide 42).

The output is split at `[SEP]` to extract the summary, spaces are removed, and it's cut at `<|endoftext|>`. During training, a quick check on the first 100 validation examples runs every 1,000 steps, and the full validation set runs at the end of each epoch. Hyperparameters: batch size 32, learning rate 1e-5, 3 epochs, AdamW.

## T5: hand it to Seq2SeqTrainer

From slide 49 the tutorial switches to T5 ([Raffel et al., JMLR 2020](https://jmlr.org/papers/v21/20-074.html)). For Chinese it uses the multilingual [`google/mt5-small`](https://huggingface.co/google/mt5-small). Slide 54 draws the contrast with GPT-2 in two Q&As:

- **Left padding?** No. A seq2seq model compresses the input with the encoder first, and the decoder generates from scratch, so input padding doesn't affect where new tokens go.
- **Add EOS yourself?** No. mT5 has `</s>` as its EOS token.

Preprocessing uses `datasets`' `map()`: the article is tokenized into `input_ids`, and the summary is tokenized with `tokenizer(text_target=..., max_length=200)` and stored in `labels`. The notebook pickles the processed data because preprocessing takes a while.

**Who sets the −100?** `DataCollatorForSeq2Seq` pads each batch dynamically and turns label padding into −100, doing roughly what the hand-written GPT-2 `collate_fn` does (slide 57). In the other direction, `compute_metrics` must turn −100 back into the pad token before decoding, since −100 isn't in the vocabulary (slide 59).

Training uses `Seq2SeqTrainingArguments` with `Seq2SeqTrainer`: learning rate 2e-5, batch size 32, 3 epochs, evaluation every 1,000 steps on a 100-example validation subset, and `predict_with_generate=True`. Slide 60 notes that decoding defaults to greedy, and that Seq2SeqTrainer supports only beam search as the alternative.

## ROUGE and Chinese word segmentation

Slides 33–34 recap ROUGE (defined in the previous part) and add two practical details:

1. Papers now report **ROUGE-F** by default, i.e. ROUGE-1F, 2F, and LF, not recall alone. Slide 34 scores "The cat sat on the mat" against "A cat was sitting on the mat": ROUGE-1 recall 4/7, precision 4/6, then their harmonic mean.
2. For Chinese, you first have to decide what a "word" is. Slide 44 compares character-level bigrams, (看, 電)(電, 視), with word-level bigrams, (看, 電視). Both notebooks segment with [jieba](https://github.com/fxsjy/jieba), join tokens with spaces, and pass them to the [`rouge`](https://github.com/pltrdy/rouge) package for word-level scores, with `avg=True` averaging over all examples.

In other words, the ROUGE number you get depends on the segmenter. Before comparing Chinese summarization scores across papers, check whether they're character-level or word-level.

## Environment

Both notebooks pin the same versions: `torch==2.3.1` (cu121), `transformers==4.37.0`, `datasets==2.21.0`, `accelerate==0.21.0`, `rouge==1.0.1`, and `jieba==0.42.1`. That's a 2024 stack; pin it today to avoid renamed Trainer arguments.

## Try it

- Before running the GPT-2 notebook, print one batch's `input_ids` and `labels` and check that the left padding lines up with −100.
- Change `padding_side` to `"right"` and the validation batch size to 4, and see where the generations break.
- Modify `collate_fn` so positions before `[SEP]` are also −100, computing loss on the summary only, and compare ROUGE.
- Swap jieba word-level ROUGE for character-level (spaces between every character), score the same outputs twice, and see how far the numbers move.

**Further reading**: [CS224N Lecture 7: pretraining, subwords, and in-context learning](/posts/ai/2026-08-22-cs224n-pretraining-en) compares encoder, encoder-decoder, and decoder pretraining; [CME295: the Transformer](/posts/ai/2026-09-29-cme295-transformer-en) fills in architecture details.

## Gaps in the materials

- Many slides show code as screenshots (for example `collate_fn`, the evaluation function, and the Trainer setup); this guide follows the matching notebook code.
- For Week 9 Tue., I only grabbed frames at three points to confirm it's the tutorial. I didn't watch it all and can't say whether the start or end contains anything else.
- The tutorial has no assignment or reference scores, and the notebooks don't save their outputs, so I can't tell you what ROUGE to expect.
- The Fall 2026 counterpart isn't public yet. Under the grading in the [global course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), Fall 2025 is A3 (enough for self-study).

**Series navigation**: previous, [Decoding strategies and NLG evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) | next, [GPT-3, InstructGPT, and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [huggingface_tutorial_gpt2_t5.pdf (GPT-2 and T5 Tutorial slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_gpt2_t5.pdf)
- [Reference/gpt2_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/gpt2_summarization.ipynb)
- [Reference/t5_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/t5_summarization.ipynb)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 9 Tue.](https://www.youtube.com/live/zgjO_t5eu_E) (in Mandarin)
- [Recording: [Fall 2025] Week 9 Thu.](https://www.youtube.com/live/zWMHxXc0QvA) (in Mandarin)
- [Hu, Chen & Zhu (2015). LCSTS: A Large Scale Chinese Short Text Summarization Dataset](https://aclanthology.org/D15-1229/)
- [Hugging Face dataset: hugcyp/LCSTS](https://huggingface.co/datasets/hugcyp/LCSTS)
- [Hugging Face model: uer/gpt2-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-chinese-cluecorpussmall)
- [Hugging Face model: google/mt5-small](https://huggingface.co/google/mt5-small)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://jmlr.org/papers/v21/20-074.html)
- [Xue et al. (2021). mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer](https://arxiv.org/abs/2010.11934)
- [Lin (2004). ROUGE: A Package for Automatic Evaluation of Summaries](https://aclanthology.org/W04-1013/)
- [pltrdy/rouge (Python ROUGE package)](https://github.com/pltrdy/rouge)
- [fxsjy/jieba (Chinese word segmentation)](https://github.com/fxsjy/jieba)
- [Hugging Face Blog: How to generate text](https://huggingface.co/blog/how-to-generate)
