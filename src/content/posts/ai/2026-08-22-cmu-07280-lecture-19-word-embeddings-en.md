---
title: "CMU 07-280 Lecture 19: Turning Next-token Prediction into Geometry"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, word-embedding, language-model]
lang: en
tldr: "Lecture 19 builds a minimal next-token model from two embedding matrices, dot-product similarity, softmax, and cross-entropy. Shared vector parameters replace the isolated count cells of an N-gram table."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 19: one-hot features, input/output embeddings, softmax, cross-entropy, and feature learning."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 19
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-19-word-embeddings)

**CMU 07-280, Spring 2026, Lecture 19** replaces a language-model count table with learnable vector geometry. The official slide cover says *NLP: Word Embeddings / Attention*. Most of the deck develops text features, two sets of token vectors, similarity, softmax, and training; attention is the doorway to the next lecture.

## Official materials and reading scope

This article fully reads the [Lecture 19 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec19_NLP_Word_Embeddings.pdf), the [Word Embeddings pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Word_Embeddings.pdf), [Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf), and its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf). The official site has no public Spring 2026 lecture recording, so this article does not infer spoken explanations from slide animations or the recitation notebook.

The recitation references a Google Drive notebook. This reading uses only the model, tasks, and results explicitly visible in the public PDFs; it does not claim to have reproduced an access-dependent formal notebook.

## The inherited problem: every N-gram context is an island

A bigram model counts `the cat` and `a cat` separately. Even if `the` and `a` behave similarly in many contexts, the table does not share evidence automatically. One-hot encoding has the same property: each token occupies an orthogonal axis. It identifies a token but expresses no similarity.

The slides first contrast one-hot and bag-of-words features. A bag of words can record occurrence or frequency and works for classification, but loses order. An embedding pursues a different objective: learn a low-dimensional dense vector so tokens can share parameters through geometry that is useful to a predictive task.

## Full conceptual path: encode, compare, normalize, learn

The lecture's minimal word-embedding LM uses two matrices. `V` maps a previous-token index to a context vector. `U` stores one output vector for every candidate next token. Given token `i`:

1. Look up `v_i`.
2. Compute all candidate scores, `s = Uv_i`.
3. Convert scores to `ŷ = softmax(s)`.
4. Sample the next token from that categorical distribution.
5. Update `U` and `V` with cross-entropy against the observed next token.

The slides call the dot product an unnormalized cosine similarity. Strictly, cosine similarity also divides by both vector norms. Here `uᵀv` is the logit, so direction and magnitude both affect the score. This distinction matters because a model can sharpen softmax by increasing vector norms.

With `|Vocab|` tokens and embedding dimension `d`, the two matrices contain approximately `2|Vocab|d` parameters. Instead of assigning one independent probability to every bigram, all transitions pass through a shared low-dimensional space.

## Reproducible derivation: how one token pair moves vectors

Suppose the vocabulary is `cat, sat, ran`. Let the context vector for `cat` be `v=[1,0]`, with output vectors

```text
u_cat = [0, 0]
u_sat = [2, 0]
u_ran = [1, 1]
```

The logits `Uv` are `[0,2,1]`. The softmax denominator is approximately `1+7.39+2.72=11.11`, giving probabilities near `[0.09,0.665,0.245]`. If the observed next token is `ran`, cross-entropy is

\[
L=-\log 0.245\approx 1.41.
\]

The gradient with respect to logits is `ŷ-y`, approximately `[0.09,0.665,-0.755]`. Gradient descent therefore lowers the relative scores of `cat` and `sat` and raises the score of `ran`. The update affects both `u_ran` and `v_cat`. Across many token pairs, positions reflect similarity useful for next-token prediction, not semantic coordinates supplied in advance.

## Recitation and homework connection

Recitation 10 trains a two-dimensional model on a *Green Eggs and Ham* corpus. It asks students to observe vector movement, generate with `argmax`, and then sample from probabilities. The official solution records a demonstration loss decreasing from `4.6891` to `2.9759` after 100 epochs and compares a much longer run. Those numbers belong to that notebook configuration and are not a general convergence guarantee.

The GPT-2 task in [Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) keeps the same outer interface: token embeddings enter the model, and output logits become a next token through softmax and sampling. Transformer blocks replace the middle component that previously saw only one vector.

## Extension: embeddings learn task structure, not natural semantics

Plotting words in two dimensions is intuitive and easy to overinterpret. Vectors are constrained only by the loss. Under next-token prediction, they retain statistical relationships useful to that objective. Change the corpus, tokenizer, or objective, and the geometry can change.

This clarifies the difference between feature engineering and feature learning. Humans choose bag-of-words coordinates. Optimization chooses embedding coordinates, but humans still choose the data, context, dimension, and loss. Feature learning delegates part of representation design; it does not eliminate design.

## An action for tonight

Build a one-step next-token model with ten tokens and two-dimensional embeddings. Hand-calculate one `Uv`, softmax, cross-entropy, and `ŷ-y`, then train the same model in code. Compare two questions: do similar context tokens become close, and does that closeness improve held-out next-token loss? Do not judge only whether the scatter plot “looks semantic.”

## References

- [CMU 07-280 Spring 2026 Lecture 19 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec19_NLP_Word_Embeddings.pdf)
- [CMU 07-280 Word Embeddings pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Word_Embeddings.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Recitation 10 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
