---
title: "Stanford CS229 Lecture 15: How Self-Supervised Learning Creates Labels from Data"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, self-supervised-learning, language-models]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 16
tldr: "Self-supervised learning hides, alters, or pairs parts of the data to create pretext tasks. Word2vec, GPT, and BERT use nearby words, next words, and masked words to learn transferable representations."
description: "A reading of Stanford CS229 Spring 2021 Lecture 15: pretext tasks, word2vec, GPT, BERT, and limitations involving bias, factual recall, and symbolic reasoning."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-15-self-supervised-learning)

This is post 16 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 15**. The syllabus dates it May 17, 2021 and gives the official title **Self-supervised learning (Language Models & Image Models)**. This article uses the Spring 2021 *Self-Supervised Learning* slides. The Canvas recording was not used.

Self-supervised learning does not eliminate supervision. It avoids per-example human labels by hiding or altering part of an input and asking a model to recover, identify, or predict it. This designed pretext task supplies a learning signal, and the resulting representation is transferred to a downstream task.

## A pretext task determines what the model must learn

An image can be rotated and classified by angle, or augmented twice so that two views of the same image should have similar representations. Text already provides sequence and context, making nearby words, the next word, or a masked word natural targets.

A pretext task is useful when solving it requires information that downstream tasks also need. Rotation prediction may require object orientation; next-word prediction may require syntax, semantics, and long-range context. If a shortcut solves the task, the representation may not contain the intended information.

## Word2vec learns static vectors from local co-occurrence

CBOW predicts a center word from its context. Skip-gram predicts nearby words from the center. In skip-gram, the probability of context word `wₒ` given center word `wᵢ` has a softmax form:

```text
p(wₒ | wᵢ) = exp(uₒᵀvᵢ) / Σ_w exp(u_wᵀvᵢ)
```

A large inner product means that two words tend to occur in predictive contexts. Maximizing the log likelihood of observed window pairs pulls mutually predictive words closer. Sparse one-hot representations become dense vectors with geometry that cosine similarity can inspect.

The limitation is that each word still gets one vector. The noun and verb senses of `ship` share a representation; a later model must recover the particular meaning from context.

## GPT pretrains the entire model on next-word prediction

An autoregressive language model factors sequence probability with the chain rule:

```text
p(w₁, …, w_T) = Π_t p(w_t | w₁, …, w_{t-1})
```

GPT trains a Transformer decoder to maximize these conditional probabilities. Unlike word embeddings that initialize only an input layer, it pretrains a full contextual model and later adds a task layer for fine-tuning. Its left-only conditioning supports generation but yields a directional representation.

Every position in ordinary text automatically becomes a training example. That is the formula's practical force: a corpus supplies both inputs and targets without a separate annotation table.

## BERT hides the answer to use both sides

A bidirectional model could cheat if it saw the target token while predicting it. Masked language modeling selects some tokens, replaces them with `[MASK]`, random words, or their originals, and computes cross-entropy only on selected positions:

```text
L_MLM = - Σ_{t ∈ M} log p(w_t | corrupted sequence)
```

BERT uses a Transformer encoder, so a masked position can draw on left and right context. The slides describe its masking recipe and its central tradeoff: masking more tokens removes useful context, while masking fewer produces fewer prediction targets per sequence.

## Three successes do not close the problem

Lecture 15 groups open limits into three areas:

- **Bias:** representations absorb stereotypes in training data and can transfer them downstream.
- **Factual knowledge:** outputs may have the right semantic type but the wrong fact, especially for rare, unseen, or rephrased information.
- **Symbolic reasoning:** apparent success on age, size, negation, or frequency questions may rely on familiar patterns rather than compositional rules.

Pretext loss measures the pretext task, not a universal notion of understanding. Better downstream benchmark results also do not establish that a model reasons in the intended way.

## Where Lecture 15 sits in the eighteen-lecture path

Lecture 14's weak supervision still relies on human-authored labeling functions. Lecture 15 creates targets from data itself. Both respond to expensive labels, but self-supervision shifts the problem from combining noisy sources to designing tasks that produce transferable representations.

Lecture 16 widens the lens to the full ML project lifecycle. The question becomes not how to write a pretraining objective, but whether data, specifications, splits, monitoring, and iteration make the model useful.

## Beyond the lecture

Do not evaluate a new pretext task only by its own loss. List the information that downstream representations should preserve, then add a probing or downstream test that does not share the pretraining shortcut. If pretext performance rises without downstream gains, reconsider whether the learning signal matches the goal.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 15 Self-Supervised Learning slides](https://cs229.stanford.edu/notes2021spring/notes2021spring/cs229_lecture_selfsupervision_final.pdf)
