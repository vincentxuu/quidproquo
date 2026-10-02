---
title: "Reading NTU ADL 2025 Fall: BERT and Its Family — From the Polysemy Problem to XLNet, RoBERTa, and mBERT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, bert, pretraining, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 6
tldr: "A static word vector gives \"apple\" one embedding, whether it means the fruit or the company. The BERT lecture in ADL Fall 2025 starts from that polysemy problem. TagLM feeds language-model features into a tagger, ELMo builds contextual embeddings from a deep bidirectional LSTM, and BERT swaps the LSTM for a Transformer, pre-trained with Masked LM and Next Sentence Prediction; downstream, you add a classifier or tagger on the top layer and fine-tune. The optional BERT Variants slides go one ring further out: Transformer-XL for longer context, XLNet's permutation LM to get both AR and AE benefits, RoBERTa's better data and training recipe, SpanBERT's span masking, and mBERT and XLM for many languages. This is the direct prerequisite for HW1, which uses bert-base-chinese for extractive QA."
description: "Guide 6 in the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series, based on 250908_BERT.pdf (22 pages), the BERT Variants slides (f113 path, 32 pages), and videos 5.2–5.6: polysemy, TagLM, ELMo, BERT's MLM, NSP, input representation, and fine-tuning, ERNIE, Transformer-XL, XLNet, RoBERTa, SpanBERT, Multilingual BERT, and XLM."
draft: false
glossary:
  - term: "Masked Language Model"
    aliases: ["MLM"]
    definition: "A pre-training objective that hides a random subset of input tokens and asks the model to recover them from context on both sides."
    context: "The ADL slides say BERT masks 15% of tokens: too few makes training expensive, too many leaves too little context."
  - term: "Permutation Language Model"
    definition: "XLNet's pre-training objective: autoregressive prediction over all possible factorization orders. Only the prediction order changes; positional encodings stay put, so an autoregressive model sees bidirectional context."
    context: "BERT Variants slides, pages 15–16."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-bert-family)

**This guide covers the 9/08 week of [NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/).** It is part 6 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The previous post, [Tokenization and BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en), explained where BERT's subword inputs come from, and [Attention and Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) covered its backbone. This one answers: **the same word means different things in different sentences, so how does a model produce a representation that reads the context?**

Official materials used:

- Slides [250908_BERT.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf) (22 pages, subtitled Bidirectional Encoder Representations from Transformers)
- Optional slides, BERT Variants. The course page links to `f114-adl/doc/240918_BERTVariants.pdf`, which returned 404 on 2026-09-30. This guide uses the same-named file at [f113-adl/doc/240918_BERTVariants.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf) (32 pages, dated 2024/09/18)
- Videos (lectures in Mandarin): [5.2 BERT](https://youtu.be/pSQM-HNHA64) (57:29), [5.3 BERT Variants](https://youtu.be/sqldA6AgV7s) (4:09), [5.4 XLNet](https://youtu.be/Q-bIzFhVweA) (34:06), [5.5 RoBERTa & SpanBERT](https://youtu.be/u6USoD6mRR4) (22:20), [5.6 Multilingual BERT & XLM](https://youtu.be/NAFu7xQKbRE) (12:48)

Access level follows the series rating of **A2**. The slides and videos for this lecture are public. The matching assignment, HW1, is submitted through Kaggle and NTU COOL, so outside readers can only practice from the spec (see [the next post](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en)).

## The starting point: word vectors ignore polysemy

Page 3 opens with two sentences: "An apple a day, keeps the doctor away" and "Smartphone companies including apple, …". The two apples mean different things, but word vectors like word2vec and GloVe give each word **one** vector. The slide names two problems:

- **Multiple senses** (polysemy): "rock" can be a stone or a music genre.
- **Multiple aspects**: one vector has to hold both semantic and syntactic information.

Page 4 already points at the fix. The RNN language model from [part 3](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) produces a hidden state at every position, and that hidden state is a word representation that has seen the preceding text. The slide's note: this LM produces contextual word representations at each position.

## From TagLM to ELMo: language models as features

The slides take two steps.

**TagLM ("Pre-ELMo")**: [Peters et al. 2017](https://arxiv.org/abs/1705.00108) train a language model on large unannotated text, then concatenate its embeddings with ordinary word embeddings and feed both to a sequence tagger (the example is NER: New York → B-LOC E-LOC). The slide calls this self-supervised learning, because the labels come from the text itself.

**ELMo**: [Peters et al. 2018](https://arxiv.org/abs/1802.05365) go one layer deeper. Page 6 lists two ideas:

1. Learn word vectors from long contexts instead of a fixed context window.
2. Train a deep LM and use **all of its layers** for prediction, not just the top one.

ELMo and BERT are both Sesame Street characters, hence page 2 and the video's Mandarin subtitle, "the attack of the Sesame Street giants."

## BERT: swap the LSTM for a Transformer

Page 7 sums up [BERT (Devlin et al. 2019)](https://arxiv.org/abs/1810.04805) in one line: still contextual word representations learned from long contexts, but **with a Transformer instead of an LSTM**. That creates a problem. A Transformer encoder's self-attention sees both sides at once, so a plain next-word objective would let the model peek at the answer. BERT uses two new objectives instead.

### Objective 1: Masked Language Model

Page 8's motivation: "language understanding is bidirectional while LM only uses left or right context." So BERT does not predict the next word. It **randomly masks 15% of tokens** and asks the model to recover them from both sides. The slide's reason for 15% is practical:

- Too little masking: each sentence gives little training signal, so training gets expensive.
- Too much masking: not enough context is left to guess from.

### Objective 2: Next Sentence Prediction

Pages 10–11: tasks like question answering and natural language inference depend on the relationship **between two sentences**, which single-sentence MLM cannot teach. NSP gives the model two sentences and asks whether the second really follows the first.

### Input representation

Page 12: the input embedding at each position is the sum of three vectors:

- a token embedding (word level, i.e. the subword units from the previous post)
- a segment embedding (sentence level, marking whether the token belongs to sentence A or B)
- a position embedding

### Training data and two sizes

Page 13: training data is Wikipedia plus BookCorpus. The two models are BERT-Base (12 layers, 768 hidden, 12 heads) and BERT-Large (24 layers, 1024 hidden, 16 heads).

## Fine-tuning: add one classifier on top

Page 14's idea is simple: **for each target task, learn a classifier or tagger on the top layer** and fine-tune the whole BERT with it. Sentence classification uses the `[CLS]` position, sequence tagging uses each token's output, and extractive QA predicts the answer's start and end over the paragraph tokens, which is exactly HW1's span selection.

A few pages of results make the case:

- Page 16 shows the original paper's GLUE results.
- Page 17 compares CoNLL 2003 NER results, from TagLM and ELMo through BERT-Base, BERT-Large, and Flair.
- Page 18: bigger models do better. That observation returns as scaling laws in [part 8](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en).

Pages 19–20 show the other option: skip fine-tuning and use pre-trained BERT as a contextual-embedding extractor, feeding layer outputs to a task-specific model, as ELMo did.

## A note for Chinese: ERNIE

Page 21 matters for Chinese text. BERT models local co-occurrence between tokens, but Chinese characters get masked **independently**: 哈爾濱 (Harbin) becomes 哈, 爾, and 濱 handled separately. [ERNIE (Baidu, 2019)](https://arxiv.org/abs/1904.09223) masks whole semantic units or entities instead, bringing knowledge into pre-training. For HW1, that is one reason to try a different Chinese pre-trained model, and report question Q2 asks you to compare exactly that.

The last slide gives two starting points: [google-research/bert](https://github.com/google-research/bert) and [huggingface/transformers](https://github.com/huggingface/transformers).

## Optional material: the BERT family

This sits in the "optional supplement" row under 9/08 on the course page, with the Fall 2024 BERT Variants slides and videos 5.3–5.6. Page 3 splits the family two ways: **better performance** (RoBERTa, SpanBERT, XLNet) and **multilingual** (Multilingual BERT, XLM).

### Transformer-XL: longer context first

Pages 4–10 cover [Transformer-XL (Dai et al. 2019)](https://arxiv.org/abs/1901.02860), which has no dedicated video. The problem is context fragmentation: a Transformer handles fixed-length segments, so it cannot learn dependencies longer than that, and the segments ignore sentence boundaries. Two fixes:

- **Segment-level recurrence**: hidden states from the previous segment are fixed, cached, and reused for the next one, which multiplies the longest dependency length by N (N is network depth).
- **Relative positional encoding**: when states are reused, absolute positions become `[0,1,2,3,0,1,2,3]` and no longer line up, so positions become relative.

### XLNet: AR and AE together

[XLNet (Yang et al. 2019)](https://arxiv.org/abs/1906.08237) is video 5.4. The slides split pre-training into two camps:

- **Autoregressive (AR)**: like GPT, predict token by token from preceding or following context.
- **Autoencoding (AE)**: like BERT's MLM, reconstruct the original from a corrupted input.

Page 14 names AE's two problems:

1. **Independence assumption**: when two tokens in a sentence are masked, BERT predicts them as if they were independent.
2. **Input noise**: pre-training sees `[MASK]`, fine-tuning does not.

XLNet's permutation language model does AR prediction over all possible factorization orders (a length-T sequence has T! of them). In practice it **permutes only the prediction order and keeps positional encodings**, implemented with attention masks. To know which position to predict without seeing its content, it adds two-stream self-attention (a content stream and a query stream). Page 19's summary: AR removes the independence assumption, and dropping `[MASK]` removes the pretrain-finetune mismatch.

### RoBERTa and SpanBERT: train better, mask smarter

[RoBERTa (Liu et al. 2019)](https://arxiv.org/abs/1907.11692) keeps the architecture and changes the training (pages 21–22):

- **Dynamic masking**: 10 different masks over 40 epochs, where BERT fixed its masks during preprocessing.
- **Optimization**: peak learning rate and warmup steps tuned separately, batch size raised to 8K.
- **Data**: full-length sequences only, and BookCorpus plus English Wikipedia (16G) extended with CC-News, OpenWebText, and Stories.

[SpanBERT (Joshi et al. 2019)](https://arxiv.org/abs/1907.10529) changes the objective (page 25):

- **Span masking**: mask random contiguous spans instead of scattered tokens.
- **Single-sentence training**: one contiguous segment per example instead of two, which drops NSP.
- **Span boundary objective**: predict the whole masked span from the representations at its boundaries only.

The concluding slide says SpanBERT helps most on QA, NLI, and coreference. For a span-answer task like HW1, remember this one.

### Multilingual BERT and XLM: one model, many languages

- **Multilingual BERT**: trained on Wikipedia in the top 104 languages. Page 28 puts the Chinese and English Wikipedia entries for *Detective Conan* side by side: articles already mix in text from other languages (code-mixing), which helps align words across languages.
- **XLM**: [Lample and Conneau 2019](https://arxiv.org/abs/1901.07291) add a translation LM on top of masked LM. The concluding slide tags it for zero-shot scenarios, and page 31 shows cross-lingual classification results.

## What you can do after reading

- Explain why static word vectors fail on polysemy and how ELMo and BERT each fix it.
- Explain BERT's MLM, NSP, three input embeddings, and the classifier-on-top fine-tuning recipe.
- When you see RoBERTa, SpanBERT, XLNet, or mBERT, know whether it changed the training recipe, the masking objective, the pre-training paradigm, or language coverage.

**Try this**: open the [Hugging Face Model Hub search for Chinese models](https://huggingface.co/models?search=chinese) (the link HW1's slides give). Pick `bert-base-chinese` and one Chinese RoBERTa or whole-word-masking model, and write down which part of the family map each one changes. HW1's report question Q2 asks for exactly this comparison.

## What this guide can and cannot confirm

Confirmed: every slide title and bullet in the 22-page BERT deck and the 32-page BERT Variants deck; video titles and lengths (checked against the playlist and YouTube oEmbed); every paper title above (checked on arXiv).

Not confirmed: the videos were not transcribed, so the instructor's spoken examples and comments are not included. The BERT Variants slides are the Fall 2024 version because the Fall 2025 link is broken; the playlist does not say whether videos 5.3–5.6 were re-recorded in 2025. Result figures (GLUE, NER) are described by title and comparison only; take numbers from the original papers.

Further reading on this site: [CS224N Lecture 7: Pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en) covers the three pre-training architectures from another angle, and [CS224U's contextual-representation model families](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en) walks through BERT, RoBERTa, ELECTRA, and others.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Tokenization and BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en) | Next: [HW1 Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en)

## References

- [NTU Yun-Nung Chen, Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250908_BERT.pdf (BERT: Bidirectional Encoder Representations from Transformers)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)
- [240918_BERTVariants.pdf (BERT Variants, f113 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [2025 Fall NTU CSIE ADL playlist (lectures in Mandarin)](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- Videos: [5.2 BERT](https://youtu.be/pSQM-HNHA64), [5.3 BERT Variants](https://youtu.be/sqldA6AgV7s), [5.4 XLNet](https://youtu.be/Q-bIzFhVweA), [5.5 RoBERTa & SpanBERT](https://youtu.be/u6USoD6mRR4), [5.6 Multilingual BERT & XLM](https://youtu.be/NAFu7xQKbRE)
- [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding (arXiv 1810.04805)](https://arxiv.org/abs/1810.04805)
- [Deep contextualized word representations (ELMo, arXiv 1802.05365)](https://arxiv.org/abs/1802.05365)
- [Semi-supervised sequence tagging with bidirectional language models (TagLM, arXiv 1705.00108)](https://arxiv.org/abs/1705.00108)
- [ERNIE: Enhanced Representation through Knowledge Integration (arXiv 1904.09223)](https://arxiv.org/abs/1904.09223)
- [Transformer-XL (arXiv 1901.02860)](https://arxiv.org/abs/1901.02860)
- [XLNet (arXiv 1906.08237)](https://arxiv.org/abs/1906.08237)
- [RoBERTa (arXiv 1907.11692)](https://arxiv.org/abs/1907.11692)
- [SpanBERT (arXiv 1907.10529)](https://arxiv.org/abs/1907.10529)
- [Cross-lingual Language Model Pretraining (XLM, arXiv 1901.07291)](https://arxiv.org/abs/1901.07291)
- [google-research/bert](https://github.com/google-research/bert)
