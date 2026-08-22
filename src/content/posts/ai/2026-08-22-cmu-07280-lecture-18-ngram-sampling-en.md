---
title: "CMU 07-280 Lecture 18: How N-grams Train, Sample, and Fail"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, language-model, n-gram]
lang: en
tldr: "Lecture 18 truncates the chain rule with an N-gram Markov assumption, estimates probabilities from corpus counts, and contrasts greedy, categorical, and temperature sampling. The real bottlenecks are zero probability for unseen contexts and a fixed window."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 18: N-gram factorization, count-based MLE, generation, temperature, and the transition to feature learning."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 18
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-18-ngram-sampling)

Lecture 17 chose the tokens. **CMU 07-280, Spring 2026, Lecture 18** turns a token sequence into a model that can be trained and sampled. The official inked deck is titled *NLP: N-gram LMs*. Its path runs through joint probability, a Markov approximation, corpus counts, sampling, temperature, and finally the handoff to feature learning.

## Official materials and reading scope

This article fully reads the [Lecture 18 inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec18_NLP_N-grams_inked.pdf). The uninked direct link returned 404 on August 22, 2026, while the inked deck remained anonymously accessible and complete. The official site provides no public Spring 2026 lecture recording, so this article does not invent how the instructors discussed polls or the worksheet live.

The lecture connects tokenization to the definition of a language model: a model approximates the joint probability of a token sequence in a language. It then applies the chain rule and limits context with an N-gram Markov assumption.

## The inherited problem: a table of bigram counts is not yet a full model

Listing a few unigram and bigram probabilities is insufficient. A model must assign a consistent probability to sequences of arbitrary length. The chain rule gives an exact factorization:

\[
P(w_1,\ldots,w_T)=\prod_{t=1}^{T}P(w_t\mid w_1,\ldots,w_{t-1}).
\]

The full history is almost always unique, so a finite corpus cannot estimate every conditional reliably. A bigram model assumes that the next token depends only on the preceding token:

\[
P(w_1,\ldots,w_T)\approx P(w_1)\prod_{t=2}^{T}P(w_t\mid w_{t-1}).
\]

A trigram preserves the most recent two tokens. Larger `n` gives a more specific context, but creates more combinations to estimate and therefore worse sparsity.

## Full conceptual path: from count MLE to decoding

The maximum-likelihood estimate is direct:

\[
\hat P(w\mid h)=\frac{C(h,w)}{C(h)},
\]

where `h` is a history of length `n-1`. Training becomes corpus counting. The same formula reveals the failure mode: an unseen `(h,w)` receives zero probability, and an unseen history has no useful denominator at all.

At generation time, every step produces a categorical distribution over the vocabulary. Greedy decoding always takes `argmax`; it is reproducible but can collapse into repetition or a single path. Sampling preserves diversity but can choose low-probability tokens.

Temperature rescales logits before softmax. For logits `z_i`,

\[
p_i(T)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}}.
\]

When `T<1`, the distribution sharpens; when `T>1`, it flattens. Temperature does not add knowledge. It only changes how existing probability differences affect sampling.

## Reproducible example: three behaviors from one logit vector

Suppose the next-token logits are `cat: 2`, `dog: 1`, and `moon: 0`.

At `T=1`, exponentiation gives approximately `7.39`, `2.72`, and `1`, totaling `11.11`. The probabilities are therefore about `0.665, 0.245, 0.090`. Greedy always chooses `cat`; categorical sampling selects `dog` roughly one time in four.

At `T=0.5`, dividing logits by temperature doubles them, yielding roughly `0.867, 0.117, 0.016`. At `T=2`, the distribution becomes about `0.506, 0.307, 0.186`. Low temperature magnifies the ranking gap; high temperature retains more tail choices.

Now consider an unseen pair. If the corpus never contains `purple elephant`, bigram MLE sets `P(elephant|purple)=0`. Temperature cannot recover a continuation to which the model assigned zero mass. Handling that requires smoothing, backoff, or learned representations that share statistical strength.

## Recitation and homework connection

[Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf) takes the next step. Instead of building an independent count table for every context, it learns two low-dimensional vector sets to predict the next token. Students compare cosine similarity, softmax, and greedy versus sampled generation.

The Building GPT2 portion of [Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) asks for training loss, training perplexity, and generations under different temperatures. Decoding is therefore not a side topic; it becomes the operational interface for inspecting the later model. The notebook and formal autograder remain access-limited, so the public PDF demonstrates task visibility, not a complete course environment.

## Extension: fixed context versus learned context

An N-gram defines context as the exact identity of the most recent `n-1` tokens. An embedding model lets similar tokens share parameters. Attention then assigns context-dependent weights to different positions. These are successive answers to one question: which histories are allowed to share evidence?

N-grams remain valuable because they are auditable. A probability can be traced back to a count. Their weakness is equally visible: parameter requirements grow rapidly with vocabulary and `n`, and unseen combinations have no natural generalization mechanism.

## An action for tonight

Using the corpus from Lecture 17, build unigram, bigram, and trigram counts. Generate three passages from the same prompt: greedy, sampling at `T=0.5`, and sampling at `T=2`. Record the first step at which each model encounters an unseen context, then choose whether you would smooth, back off, or shorten context. Do not stop at judging which output “sounds human.”

## References

- [CMU 07-280 Spring 2026 Lecture 18 inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec18_NLP_N-grams_inked.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Recitation 10 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
