---
title: "From N-grams and Word Representations to Text Classification | Berkeley CS288 Spring 2026 Topic Guide"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, language-model, text-classification]
lang: en
type: guide
difficulty: 進階
tldr: "The first four units make text countable, representable, and classifiable; A1 then moves from n-grams and perceptrons to an NBOW MLP."
description: "A guide to CS288 Spring 2026 Introduction, n-gram LM, Word Representation, Text Classification, and Assignment 1."
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 1 }
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-foundations)

The first four sets of [official slides](https://cal-cs288.github.io/sp26/) ask one question: how does text become a computational object and then a learnable prediction problem? The sequence is Introduction, n-gram Language Models, Word Representation, and Text Classification.

## N-grams make language modeling explicit

An n-gram approximates the full history with bounded context. Training becomes counting and smoothing; evaluation becomes held-out likelihood or perplexity. Its value is not a claim that it beats Transformers, but that it exposes data splits, unknown words, and probability normalization.

## Representations move from identity to learned geometry

One-hot vectors preserve identity. Distributed representations let related words share statistical strength. Ask what objective learned a representation, what distance means, and how unknown words are handled. A compelling nearest-neighbor example is not proof of complete semantics.

## Classification puts a boundary on top

A perceptron's mistake-driven updates leave weights and features visible. An NBOW MLP adds embeddings, nonlinear capacity, and batching. Comparing them helps separate gains from representation, capacity, optimization, and computation.

## A1 tests the whole block

[Assignment 1](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf) trains n-gram and neural n-gram LMs on WikiText-102, then implements perceptron and NBOW MLP classifiers for SST-2 and 20 Newsgroups. The [starter repository](https://github.com/akshat57/cs288-sp26-a1) is public, while labels, submission limits, and parts of grading are not.

For self-study, preserve the data splits and tests, then compare model, features, parameter count, development accuracy, and inference time per thousand examples. Do not publish solutions.

## How counts become probabilities

This is an invented teaching example, not an official assignment solution.

In invented training data, “I” is followed by “drink” three times and “eat” once. Without smoothing, P(drink|I)=3/4 and P(eat|I)=1/4, summing to one. The denominator counts occurrences of “I” as a preceding token, not all corpus tokens.

**Check and answer:** What is the unsmoothed probability of an unseen continuation “sleep”? Zero. This motivates smoothing; test data must not be used to repair training counts.

## Continue from representation to one classification

This is another invented toy example. Separate one-hot encodings for “good” and “great” have inner product zero: the representation alone expresses no similarity. Suppose learned two-dimensional vectors are `[1,0]` and `[0.8,0.2]`; their inner product is `0.8`. This computes specified vectors, not a claim that all embeddings behave this way.

Pass a document representation to a linear classifier. For x=`[1,0]`, weights w=`[2,-1]`, and bias=`-0.5`, score=`w·x+b=1.5`. Under our stated rule that scores above zero predict the positive class, this document is positive. Features, model, and decision rule are now explicit.

**Check:** For document vector `[0,1]`, score is `-1.5`, predicting negative. Updating a misclassified weight also requires the true label; nearby vectors alone cannot establish classification quality.

## Changelog

- 2026-10-11: Added an invented example, worked calculation or reasoning, and a comprehension check with an answer.

## References

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 1 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf)
- [Assignment 1 starter repository](https://github.com/akshat57/cs288-sp26-a1)

