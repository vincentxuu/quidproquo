---
title: "Transformer, Training, and Decoding: Three Different Questions | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, transformer, self-attention, language-model, tokenization, decoding]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 40
tldr: "How the model reads a history, learns from targets, and chooses its next token are different questions. Attention mixes information; the training objective updates parameters; decoding selects output under a fixed model. Keeping them distinct prevents confusing a sampling change with a model update."
description: "How the model reads a history, learns from targets, and chooses its next token are different questions. Attention mixes information; the training objective updates parameters; decoding selects output under a fixed model. Keeping them distinct prevents confusing a sampling change with a model update."
draft: false
glossary:
  - term: "causal mask"
    aliases: ["causal attention"]
    definition: "Before the softmax in attention, set the scores for every position to the right of the query (future time steps) to negative infinity, so the model cannot see the answer while predicting the next token."
    context: "Lecture 2 of CMU 10-423 writes it as a matrix M: zeros on and below the diagonal, −∞ above it."
  - term: "ancestral sampling"
    definition: "When generating from a language model, pick each next token at random according to the model's probabilities. As long as the distribution is locally normalized, the probability of drawing a whole sequence equals its total probability, so this is an exact sampling method."
    context: "Lecture 3 of CMU 10-423 contrasts it with greedy decoding, which always takes the most likely token."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

How the model reads a history, learns from targets, and chooses its next token are different questions. Attention mixes information; the training objective updates parameters; decoding selects output under a fixed model. Keeping them distinct prevents confusing a sampling change with a model update.

## Choose a lesson

- [Causal attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en): work through its mechanism, example, and answer criteria.
- [Training and decoding](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en): work through its mechanism, example, and answer criteria.
- [Modern Transformers](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: fix next-token probabilities at A=0.6, B=0.3, C=0.1. Greedy picks A. Top-p=0.8 retains A and B, renormalizes to 2/3 and 1/3, then samples. Temperature 0.5 squares and renormalizes the original probabilities, yielding approximately 0.783, 0.196, and 0.022. None of these operations performs backpropagation or changes model weights. Attention acts earlier, when constructing representations of the history.

## Check your understanding

What does top-p=0.5 retain, and does it change the training loss?

<details>
<summary>Answer and criterion</summary>

Only A is retained because its mass already exceeds the threshold. The decoding distribution becomes A=1. With model and training data fixed, this sampling setting does not alter the original training loss, though generated outputs and their evaluation can change.

</details>

## How to use this map

Before reading the answer, identify the inputs, what changes, and the outputs. Then complete the linked lesson’s variation. If two mechanisms seem identical, trace where their conditions or data paths diverge. This page checks relationships and boundaries; it does not replace the derivations, implementations, or evaluations in the individual lessons.

The source edition is Spring 2026. Teaching examples are not official assessments or reconstructed classroom speech. Recordings remain subject to course authorization.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## Update Log

- 2026-10-11: Rebuilt the teaching scope, worked example, and self-check; retained the original URL and publication date.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L2 and L3 dates and readings
- [Lecture 2 slides: Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Lecture 3 slides: Learning Large Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [Lecture 3 slides (inked)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10](http://www.deeplearningbook.org/contents/rnn.html): L2 assigns 10.10–10.12 (LSTMs and other gated RNNs)
- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Alammar (2018), The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Graves (2014), Generating Sequences With Recurrent Neural Networks](https://arxiv.org/pdf/1308.0850.pdf)
- [Mikolov et al. (2010), Recurrent neural network based language model](https://pdfs.semanticscholar.org/bba8/a2c9b9121e7c78e91ea2a68630e77c0ad20f.pdf)
- [Radford et al. (2018), Improving Language Understanding by Generative Pre-Training (GPT-1)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Radford et al. (2019), Language Models are Unsupervised Multitask Learners (GPT-2)](https://d4mucfpksywv.cloudfront.net/better-language-models/language-models.pdf)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
