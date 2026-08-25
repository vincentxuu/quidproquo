---
title: "CS224N Lecture 2: How word2vec Turns Meaning into Vectors"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, nlp, word2vec, embeddings, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 3
tldr: "Lecture 2 moves from word2vec's prediction task, objective, and gradients to count-based vectors and evaluation. Meaning becomes a high-dimensional position learned from context, not a label retrieved from a dictionary."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 2: word2vec, negative sampling, co-occurrence matrices, and embedding evaluation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-word-vectors)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 2 on January 8, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf) covers word2vec, objective-function gradients, optimization basics, count-based representations, and evaluation, after brief course logistics. Its concrete goal is to understand word meaning as a high-dimensional real vector and to read embedding papers.

## From dictionary nodes to positions in context

Lexical resources such as [WordNet](https://wordnet.princeton.edu/) organize words into synonym sets and hypernym relations. Their structure is explicit, but they require manual maintenance, miss new uses, and do not naturally quantify degrees of similarity. Distributional representation begins elsewhere: words occurring in similar contexts should receive similar representations.

[word2vec](https://arxiv.org/abs/1301.3781) assigns vectors to words and predicts surrounding words from a center word. A sliding window supplies center–context pairs; training adjusts the vectors so observed pairs receive higher probability. “Meaning” becomes geometry that a learning objective can manipulate.

## What the objective and gradient do

The slides develop the skip-gram softmax objective. A center vector is scored against possible outside-word vectors and normalized into probabilities. Negative log likelihood penalizes the model when the observed context is not ranked highly. The gradient has a useful intuition: predicted distribution minus observed distribution. Overpredicted candidates move away; the observed context moves closer.

A full softmax scans the vocabulary for every pair. The official reading list therefore introduces negative sampling: combine each observed pair with a small number of negative examples and replace multiclass prediction with several binary decisions. This changes the training objective, so it is more than a harmless numerical shortcut.

## Prediction is not the only road: count first

The agenda then returns to co-occurrence matrices. One can count word–word or word–document events across a corpus and compress the matrix with a method such as SVD. Predictive methods update parameters example by example; count-based methods begin with global statistics. [GloVe](https://aclanthology.org/D14-1162/) connects the two by learning from ratios of word-pair co-occurrences.

Both routes share the distributional assumption that corpus neighborhoods carry semantics. They also share limitations: rare words have little evidence, one vector conflates multiple senses, and stereotyped relationships in the corpus remain in the geometry.

## Evaluation: a neat analogy is not downstream success

The slides distinguish intrinsic and extrinsic evaluation. Intrinsic tests directly measure similarity, analogies, or an intermediate property; they are cheap and inspectable. Extrinsic tests insert the representation into a real task and measure system performance, which is closer to use but makes component-level attribution difficult.

When reading an embedding result, ask whether the benchmark evaluates the vector itself or a system containing many other decisions. A high score on one benchmark does not prove that a vector captures “meaning itself.”

## How skip-gram creates training pairs

A context window turns a sentence into center–outside pairs. Window size, distance weighting, subsampling, punctuation, tokenization, dimensions, negative samples, and training steps all affect geometry. One static vector also merges senses, weighting them by corpus frequency.

## From scores to softmax

For center (c) and outside word (o):

\[
P(o\mid c)=\frac{\exp(u_o^T v_c)}{\sum_{w\in V}\exp(u_w^T v_c)}.
\]

The loss forces the observed context to outrank the vocabulary. Its gradient has the expected-minus-observed form reused throughout classifiers and language models.

## Negative sampling

The [negative sampling paper](https://arxiv.org/abs/1310.4546) replaces a vocabulary-wide softmax with one positive and (K) noise pairs. The noise distribution is part of the method. A sampled negative is not an antonym; it is merely unobserved in that training window.

## Count vectors, PMI, and SVD

Count methods build a target-by-context matrix, correct raw frequency with PMI/PPMI, and compress it with truncated SVD. GloVe instead learns dot products from weighted log co-occurrence counts. Both routes compress distributional evidence.

## What embedding geometry cannot prove

Neighbors and analogies depend on preprocessing and frequency. Hubness and projection artifacts can make plots misleading. Corpus associations also preserve social bias; removing one linear direction does not prove downstream harms disappeared.

## A lecture-aligned notebook exercise

The public Assignment 1 notebook supports co-occurrence, SVD, similarity, and bias experiments. Change one setting at a time and record neighbors for fixed queries. Compare an intrinsic score with a fixed downstream classifier, then inspect a polysemous word to see how one vector compromises between senses.

## Static vectors and modern embedding tables

A Transformer still begins with a token embedding table, but contextual layers turn each occurrence into a different hidden state. Comparing “embeddings” therefore requires layer, pooling, normalization, and subword-to-word alignment. Input-table neighbors can reflect spelling and frequency rather than sentence meaning.

## How to read an embedding paper

Identify the representation unit, objective and negative evidence, corpus and preprocessing, and intrinsic versus downstream evaluation. Check dimensions, extra data, tuning, and OOV policy. Rewrite each metric as the concrete question it asks rather than circling the largest number.

## The boundary of the distributional hypothesis

Corpus context supports relatedness, not every semantic relation. Antonyms often share syntactic frames and become neighbors. Similarity, relatedness, substitutability, and entailment are different targets; one cosine score cannot represent them all.

## Material gap

Winter 2026 recordings are not public. This account uses the Lecture 2 deck and the core papers on the official reading list. Classroom demonstrations, spoken derivations, and questions cannot be verified and are not reconstructed.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 2 Word Vectors slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf)
- [WordNet](https://wordnet.princeton.edu/)
- [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)
- [GloVe: Global Vectors for Word Representation](https://aclanthology.org/D14-1162/)
