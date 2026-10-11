---
title: "Reading NTU ADL 2025 Fall: Three Pre-training Families and Prompt Learning — From BERT, GPT, and T5 to Prompts Only Machines Understand"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pretraining, prompt-engineering, scaling-laws, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 8
tldr: "Lecture 6 of ADL Fall 2025 sorts pre-trained models into three families: encoders (the BERT family, bidirectional context), decoders (the GPT series, good at generation), and encoder-decoders (BART and T5, pre-trained with denoising). It then names two practical obstacles of the pre-trained-model era: downstream labeled data is scarce, and models keep growing until one copy per task no longer fits. The slides' answer is prompt learning. GPT-3's in-context learning shows a model can do a task without updating parameters; hand-written hard prompts (template plus verbalizer, LM-BFF) then give way to soft prompts optimized as vectors (P-Tuning, Prefix-Tuning, Prompt Tuning); and Liu et al.'s prompting typology closes the lecture."
description: "Guide 8 in the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series, based on 250915_Pretraining.pdf (67 pages) and videos 6.1–6.6: what pre-training is and its data, the three pre-training architectures, GPT, GPT-2, and GPT-3, BART and T5 denoising, fine-tuning vs. in-context learning, scaling laws (Kaplan, Hoffmann), training cost, hard prompts and LM-BFF, P-Tuning, Prefix-Tuning, Prompt Tuning, and the prompting paradigm."
draft: false
glossary:
  - term: "Verbalizer"
    definition: "In prompt-based fine-tuning, the mapping from words the LM predicts at the [MASK] position back to task labels, e.g. yes → entailment, maybe → neutral, no → contradiction."
    context: "The ADL slides split prompt-tuning into a prompt template, a PLM, and a verbalizer."
  - term: "Soft Prompt"
    aliases: ["continuous prompt"]
    definition: "Not human-readable text but a set of embedding vectors optimized directly by gradient descent and prepended to the input to steer a frozen pre-trained model."
    context: "Video 6.5's Mandarin subtitle, roughly \"humans needn't understand it as long as the machine does,\" refers to this."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide covers the 9/15 week of [NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/).** It is part 8 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. [Part 6](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) covered BERT and its family, and [the previous post on HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) applied BERT to Chinese extractive QA. This one zooms out: **how do encoder-only, decoder-only, and encoder-decoder models differ, and why can a large enough model do a task from a prompt alone?**

Official materials used:

- Slides [250915_Pretraining.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf) (67 pages, titled Pretraining & Prompt Learning). The cover credits some slides to Mohit Iyyer (UMass) and Hung-yi Lee.
- Videos (lectures in Mandarin): [6.1 Pretraining](https://youtu.be/suX2F2TqKuE) (9:23), [6.2 Encoder-Only, Decoder-Only, Encoder-Decoder Pretraining](https://youtu.be/cnd91AbBQ74) (33:38), [6.3 Issues of PLMs](https://youtu.be/tdMuyQO6kLs) (21:39), [6.4 (Hard) Prompt-Tuning, LM-BFF](https://youtu.be/fpNxjqJjtT4) (15:55), [6.5 (Soft) Prompt-Tuning (P-Tuning, Prefix Tuning)](https://youtu.be/Wrzz7mG1ZDU) (7:13), [6.6 Prompting Paradigm](https://youtu.be/CCZfyLCNrQk) (15:43)
- Extra: [6.0 QA](https://youtu.be/-3mUrFm8lIo) (26:15) in the playlist is an in-class Q&A with no slides.

Access level follows the series rating of **A2**. The slides and videos are public, and there is no new assignment this week (HW2's topic is in [part 10](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en), with only an explainer video).

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=suX2F2TqKuE
title: 6.1
```

```youtube
url: https://www.youtube.com/watch?v=cnd91AbBQ74
title: 6.2
```

Original videos: [6.1](https://www.youtube.com/watch?v=suX2F2TqKuE)、[6.2](https://www.youtube.com/watch?v=cnd91AbBQ74)、[6.3](https://www.youtube.com/watch?v=tdMuyQO6kLs)、[6.4](https://www.youtube.com/watch?v=fpNxjqJjtT4)、[6.5](https://www.youtube.com/watch?v=Wrzz7mG1ZDU)、[6.6](https://www.youtube.com/watch?v=CCZfyLCNrQk)、[6.0 QA](https://www.youtube.com/watch?v=-3mUrFm8lIo)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Both transcripts (6.1 and 6.2) were read. 6.1: the definition of pretraining and large-scale data, BookCorpus and the "fair use vs copyright" dispute, and regulation still evolving across countries all match the article's "What pretraining is" section (the video also discusses the court rulings on Anthropic scanning purchased books and paying for pirated ones, which the article does not cover). 6.2: the encoder / decoder / encoder-decoder families, BERT's 15% masking with RoBERTa and SpanBERT, GPT-1 with about 7,000 books and 12 layers, GPT-2 and GPT-3 growth in data and size, the BART vs T5 denoising output difference, the classification fine-tuning difference, and T5 multi-task pretraining resembling today's post-training all match the corresponding sections. The article's remark that BART scores higher in most columns comes from slide 23's table (the article cites the slide); in the spoken explanation the two perform about the same. 6.3 to 6.6 and 6.0 are not embedded and were not checked.

## What pre-training is

Page 2's analogy: learn general knowledge from textbooks before being tested on a specific subject. Pre-training trains a model on a large, diverse dataset before fine-tuning it for a task. The three key steps are large-scale diverse data, self-supervised learning, and general representations; the payoff is scalability, generalizability, and transferability.

Where does the data come from? Page 3 uses BookCorpus (free books from smashwords.com). Page 4 raises the "fair use vs. copyright" question for web-scale data: regulations are still evolving and differ across countries.

## Three pre-training architectures

The table on page 5 is the lecture's map, and it keeps coming back:

| Type | Property | Examples |
|---|---|---|
| Encoder | Bidirectional context | BERT and its variants |
| Decoder | Language modeling, better for generation | GPT, GPT-2, GPT-3 |
| Encoder-Decoder | Sequence-to-sequence | Transformer, BART, T5 |

### Encoders: the BERT family

Pages 7–8 recap quickly. BERT's masked LM hides 15% of tokens; RoBERTa mainly trains BERT on more data for longer; SpanBERT masks contiguous spans, which makes a harder and more useful pre-training task. Details are in [part 6](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en).

### Why decoders are still needed

Page 9 spells out the encoder's limit: BERT and other pre-trained encoders **don't naturally generate one word at a time**. With "Vivian goes to [MASK] tasty tea," an encoder can only fill the blank, while a decoder can continue from "Vivian goes to" and write "make tasty tea."

### Decoders: the GPT series

- **GPT** ([Radford et al. 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)): a Transformer decoder pre-trained on BooksCorpus (about 7,000 books, 5GB), with 12 layers, 768-dim hidden states, 3072-dim feed-forward layers, and BPE with 40,000 merges. Downstream it uses supervised fine-tuning and keeps next-word prediction during fine-tuning.
- **GPT-2** ([Radford et al. 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)): more data (WebText from Reddit, 40GB), good for natural language generation.
- **GPT-3** ([Brown et al. 2020](https://arxiv.org/abs/2005.14165)): more data again, from Common Crawl, WebText2, Books1 and Books2, and English Wikipedia.

Page 15 lines up the generations: GPT at 117M parameters, GPT-2 at 1.5B, GPT-3 at 175B. The GPT-4 (2023) and GPT-5 (2025) rows show "?" for both parameters and data, an honest note that those figures are not public.

### Encoder-decoders: BART and T5

Page 17 explains the split: the encoder gets bidirectional context, and the decoder trains the whole model through language modeling. The pre-training objective is **span corruption (denoising)**, done during preprocessing.

Page 18 shows the difference on one sentence (Thank you for inviting me to your party last week):

- **[BART](https://arxiv.org/abs/1910.13461)**: takes the sentence with gaps and **outputs the whole original sentence**.
- **[T5](https://arxiv.org/abs/1910.10683)**: replaces the gaps with markers like `<X>` and `<Y>` and **outputs only the missing parts**: `<X> for inviting <Y> last <Z>`.

Fine-tuning for classification also differs (page 19): BART repeats the input in the decoder and predicts the label from its output, while T5 treats classification as seq2seq and generates the label text. Page 22 notes that T5's multi-task pre-training "learns multiple tasks via seq2seq," and the slide adds that this resembles today's post-training, which sets up [the next post on post-training](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en).

Page 23 compares the two: BART uses roughly twice T5's training data; BART uses learnable absolute positions and T5 relative positions; and in the slide's understanding and summarization tables, BART scores higher on most columns.

## Two obstacles of the pre-trained-model era

Video 6.3 is subtitled "the obstacles of the PLM era." Page 24 defines the standard recipe first: initialize from a pre-trained LM, then tune its parameters for the downstream task. Two problems follow.

### Obstacle 1: scarce labeled data

Page 25 lists GLUE dataset sizes, from 391K for MNLI down to 2.5K for RTE, two orders of magnitude apart. The slide's conclusion: **more practical cases are few-shot, one-shot, or even zero-shot.**

This is where GPT-3's **in-context learning** comes in (pages 26–28). Compared with fine-tuning:

- **Fine-tuning**: after pre-training, update parameters on labeled task data.
- **In-context learning**: after pre-training, **no more learning**; the input carries instructions and a few examples.

The slide uses a local example: a Taiwanese English-proficiency test's instructions for a vocabulary section plus one worked question ("the answer is D") is exactly a few-shot prompt. Zero-, one-, and few-shot differ only in how many examples you give.

### Obstacle 2: models are huge

Page 33 tabulates model sizes, from ELMo at 93M, BERT-Base at 110M, and BERT-Large at 340M, through eight GPT-3 sizes up to 175B with 96 layers. Larger models do better (pages 34–35), but they cost:

- **Training compute**: pages 37–38 cite [Sevilla et al. 2022](https://arxiv.org/abs/2202.05924) on compute trends.
- **Scaling laws**: page 39's [Kaplan et al. 2020](https://arxiv.org/abs/2001.08361) describes how model quality changes with model size N, data D, and compute C, which helps predict performance and allocate resources. Page 40's [Hoffmann et al. 2022](https://arxiv.org/abs/2203.15556) says model size and training tokens should scale **equally**. Chinchilla is smaller than other large models yet better, which the slide notes is good for fine-tuning and inference.
- **Storage**: page 41, each task needs its own copy. With an 11B-parameter model, three tasks mean three 11B copies.

Page 42 folds both obstacles into one line: **the solution is prompt learning.**

## Hard prompts: steering with natural language

Pages 45–46 contrast two setups on NLI. The usual one puts a classifier after `[CLS] premise [SEP] hypothesis [SEP]` to predict neutral, contradiction, or entailment. The prompt version rewrites the input as "Vivian likes dancing. Is it true that Vivian loves singing?" and lets the model answer maybe, no, or yes.

Pages 47–50 break prompt-tuning into three parts:

1. **Prompt template**: a manually designed natural-language input format, e.g. `Premise? [MASK], Hypothesis`.
2. **PLM**: performs language modeling (masked or autoregressive).
3. **Verbalizer**: maps vocabulary back to labels, e.g. yes → entailment, maybe → neutral, no → contradiction.

Pages 51–52: a few labeled examples are enough to fine-tune, and in zero-shot settings no parameters change at all. The slides cite [Le Scao and Rush 2021](https://arxiv.org/abs/2103.08493): under data scarcity, prompt-tuning works better because it uses and preserves pre-trained knowledge.

**LM-BFF** ([Gao et al. 2021](https://arxiv.org/abs/2012.15723), pages 53–54) adds demonstrations to the prompt and generates templates automatically; the slides show results with RoBERTa-Large.

## Soft prompts: only the machine needs to understand

Page 55 names the problems with hard prompts:

- Prompts that look reasonable to humans are not necessarily effective for LMs (the slide cites Liu et al. 2021).
- Pre-trained LMs are sensitive to the choice of prompt ([Zhao et al. 2021](https://arxiv.org/abs/2102.09690)).

So skip the words and optimize vectors:

| Method | What it does | Slide takeaway |
|---|---|---|
| [P-Tuning](https://arxiv.org/abs/2103.10385) (Liu et al. 2021) | Optimizes prompt embeddings directly instead of prompt tokens | Example: prompt search for "The capital of Britain is [MASK]" |
| [Prefix-Tuning](https://arxiv.org/abs/2101.00190) (Li and Liang 2021) | Optimizes only the prefix embeddings, at **every layer** | Better training time and space efficiency |
| [Prompt Tuning](https://arxiv.org/abs/2104.08691) (Lester et al. 2021) | Stores only a small task-specific prompt (**one layer**) per task and allows mixed-task inference on the same frozen PLM | Competitive performance, better space efficiency |

Page 59 compares fine-tuning, prefix-tuning, and hard and soft prompt-tuning on performance and space. This thread leads directly to [part 10 on PEFT](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en): adapters and LoRA answer the same question of tuning a small part instead of the whole model.

## The prompting paradigm: a map of the field

Pages 60–66 follow [Liu et al.'s 2021 survey](https://arxiv.org/abs/2107.13586) and sort prompting research along five dimensions. Video 6.6 calls it a grab bag of prompt-based research:

- **Pre-trained models**: left-to-right LMs (the GPT series), masked LMs (BERT, RoBERTa), prefix LMs (UniLM), encoder-decoders (T5, BART).
- **Prompt engineering**: shape (cloze vs. prefix), and human-designed vs. automated (discrete like LM-BFF, continuous like Prefix-Tuning).
- **Answer engineering**: answer shape (token, span, sentence) and how it is designed.
- **Multi-prompt learning**: ensembling, augmentation, composition, decomposition, sharing.
- **Training strategies**: which parameters get tuned. Promptless fine-tuning (BERT), tuning-free prompting (GPT-3), fixed-LM prompt tuning (Prefix-Tuning), fixed-prompt LM tuning (T5), and prompt plus LM tuning (P-Tuning).

The last dimension is the most useful in practice. When you meet a new method, ask first: **does it tune the model's parameters, the prompt's parameters, or neither?**

## What you can do after reading

- Given a model name, say whether it is an encoder, decoder, or encoder-decoder, and what its pre-training objective is.
- Explain how fine-tuning differs from in-context learning, and what resource question scaling laws answer.
- Tell hard prompts (template plus verbalizer, LM-BFF) from soft prompts (P-Tuning, Prefix-Tuning, Prompt Tuning) by what gets tuned and what gets stored.

**Try this**: take paragraph selection from [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) and rewrite it as a prompt. Design a template (e.g. "Question: … Paragraph: … Can this paragraph answer the question? [MASK]") and a verbalizer (yes/no), then use pages 61–66 to place your approach in each of the five dimensions.

## What this guide can and cannot confirm

Confirmed: every slide title, bullet, and table text in the 67-page deck; video titles and lengths (checked against the playlist); every arXiv paper title above (checked on arXiv).

Not confirmed: the videos were not transcribed, so the instructor's spoken examples and comments are not included. Figures in the slides (GPT-3 task results, training cost, scaling-law plots, LM-BFF and prompt-tuning results) are described by title and conclusion only; take numbers from the original papers. The slides give GPT-3's data as 45TB; this guide did not check how the original paper defines that figure before and after filtering.

Further reading on this site: [CS224N Lecture 7: Pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en) covers the same three architectures and in-context learning; [CS336 scaling-law foundations](/posts/ai/2026-08-22-cs336-scaling-laws-foundations-en) goes deeper on Kaplan and Chinchilla; and [CS224U on in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning-en) extends the story through prompt design and DSPy.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [HW1 Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) | Next: [Post-training: Instruction Tuning, RLHF, and InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed 6.1 and 6.2 match the article; noted that the BART vs T5 comparison differs slightly between the slide table and the spoken remark, and the article already cites the slide.

## References

- [NTU Yun-Nung Chen, Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250915_Pretraining.pdf (Pretraining & Prompt Learning)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)
- [2025 Fall NTU CSIE ADL playlist (lectures in Mandarin)](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- Videos: [6.1](https://youtu.be/suX2F2TqKuE), [6.2](https://youtu.be/cnd91AbBQ74), [6.3](https://youtu.be/tdMuyQO6kLs), [6.4](https://youtu.be/fpNxjqJjtT4), [6.5](https://youtu.be/Wrzz7mG1ZDU), [6.6](https://youtu.be/CCZfyLCNrQk), [6.0 QA](https://youtu.be/-3mUrFm8lIo)
- [Improving Language Understanding by Generative Pre-Training (GPT, OpenAI 2018)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Language Models are Unsupervised Multitask Learners (GPT-2, OpenAI 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners (GPT-3, arXiv 2005.14165)](https://arxiv.org/abs/2005.14165)
- [BART (arXiv 1910.13461)](https://arxiv.org/abs/1910.13461)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5, arXiv 1910.10683)](https://arxiv.org/abs/1910.10683)
- [Scaling Laws for Neural Language Models (arXiv 2001.08361)](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models (Chinchilla, arXiv 2203.15556)](https://arxiv.org/abs/2203.15556)
- [Compute Trends Across Three Eras of Machine Learning (arXiv 2202.05924)](https://arxiv.org/abs/2202.05924)
- [How Many Data Points is a Prompt Worth? (arXiv 2103.08493)](https://arxiv.org/abs/2103.08493)
- [Making Pre-trained Language Models Better Few-shot Learners (LM-BFF, arXiv 2012.15723)](https://arxiv.org/abs/2012.15723)
- [Calibrate Before Use (arXiv 2102.09690)](https://arxiv.org/abs/2102.09690)
- [GPT Understands, Too (P-Tuning, arXiv 2103.10385)](https://arxiv.org/abs/2103.10385)
- [Prefix-Tuning (arXiv 2101.00190)](https://arxiv.org/abs/2101.00190)
- [The Power of Scale for Parameter-Efficient Prompt Tuning (arXiv 2104.08691)](https://arxiv.org/abs/2104.08691)
- [Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP (arXiv 2107.13586)](https://arxiv.org/abs/2107.13586)
