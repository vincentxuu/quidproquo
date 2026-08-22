---
title: "Representation Learning: Contrastive Learning, Retrieval, and RAG"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, representation-learning, retrieval, rag]
lang: en
tldr: "Chapter 16 connects representation learning to systems: contrastive objectives shape an embedding space, semantic retrieval finds neighbors in it, and RAG passes retrieved context to a generator."
description: "A reading of Chapter 16 in the 2026 CS229 notes: how contrastive objectives form representations and how those representations support retrieval and RAG."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 17
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-16-representation-learning)

This article reads Chapter 16, printed pages 196–201, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a guide to the notes, not a reconstruction of a particular quarter's recordings. It preserves the central objectives, evaluation logic, and system dependencies without claiming to reproduce every proof.

## Why representations transfer

In supervised pretraining, one can train a classifier, discard its final layer, and use the penultimate activations as \(\phi(x)\). The hope is that earlier layers capture reusable structure while the last layer only implements the original task boundary.

Without labels, contrastive learning creates two augmented views of the same example as a positive pair and treats views of other examples as negatives. For query \(q\), positive key \(k^+\), and negatives \(k_j\), a softmax-style loss is

\[
-\log\frac{\exp(q^\top k^+/\tau)}{\exp(q^\top k^+/\tau)+\sum_j\exp(q^\top k_j/\tau)}.
\]

Temperature \(\tau\) controls how sharply score differences matter. The loss pulls positives together and pushes negatives apart, but the augmentations ultimately decide which invariances the representation learns.

## From vectors to semantic retrieval

Documents and queries are encoded as vectors. With normalized vectors, their inner product is cosine similarity. Document vectors can be precomputed, but exhaustive search still costs roughly \(O(Nm)\) for \(N\) documents of dimension \(m\). Approximate nearest-neighbor systems trade some recall for latency and memory through graph indexes, quantization, or inverted partitions.

Recall@\(k\) asks whether relevant material appeared in the first \(k\) results. NDCG also rewards correct ordering:

\[
\mathrm{DCG}@k=\sum_{j=1}^{k}\frac{\mathrm{rel}_j}{\log_2(j+1)},\qquad
\mathrm{NDCG}@k=\frac{\mathrm{DCG}@k}{\mathrm{IDCG}@k}.
\]

The metric must match the product: finding any one useful source differs from ranking several graded sources correctly.

## RAG is retrieval-conditioned generation

RAG retrieves a top-\(k\) set \(\hat R(q)\), then generates

\[
y\sim p_\psi\bigl(y\mid q,\hat R(q)\bigr).
\]

Its operational benefit is that knowledge can change with the corpus rather than requiring a weight update, while generation can be grounded in supplied text. It is not a correctness guarantee. Missing evidence cannot inform the answer, and an irrelevant passage may still be used fluently.

## Assumptions and failure modes

- Poor augmentations teach the wrong invariances.
- Random negatives may be semantically related false negatives.
- ANN latency, memory, and recall must be tuned together.
- RAG is bounded by chunking, embeddings, indexing, ranking, and generation.
- NDCG requires trustworthy relevance labels; otherwise it measures annotation bias too.

## Connection to adjacent chapters

Chapter 15 explained how to adapt a pretrained foundation model. This chapter supplies the representation and retrieval layer. Chapter 17's language models can produce embeddings and also serve as the generator in a RAG pipeline.

## Exercise

Design a 100-query retrieval evaluation set. Define Recall@5 and NDCG@5, then plan three ablations: change the embedding model, increase ANN search depth, and add a reranker. State which stage each change targets and what cost it may add.

## References

- [CS229 Lecture Notes Chapter 16: Representation Learning, Retrieval, and RAG (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=197)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
