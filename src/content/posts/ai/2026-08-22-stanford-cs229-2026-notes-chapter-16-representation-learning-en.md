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

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This article reads Chapter 16, printed pages 196–201, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a guide to the notes, not a reconstruction of a particular quarter's recordings. It preserves the central objectives, evaluation logic, and system dependencies without claiming to reproduce every proof.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from Stanford Online's public CS229 Spring 2026 recordings; their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=_kREM2UAiJ8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning
```

```youtube
url: https://www.youtube.com/watch?v=lNTajqxxOn4
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 13: LLMs, Next-Word Prediction Loss
```

Original videos: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning](https://www.youtube.com/watch?v=_kREM2UAiJ8), [Stanford CS229 Machine Learning | Spring 2026 | Lecture 13: LLMs, Next-Word Prediction Loss](https://www.youtube.com/watch?v=lNTajqxxOn4)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both transcripts were read, and what was checked is how the video topics relate to this chapter. Lecture 12 (about 76 minutes) opens by saying it will finish diffusion before moving to foundation models: roughly the first 45% is the diffusion wrap-up, and from about 47% it covers pre-training, embeddings, zero-shot/few-shot use, fine-tuning and LoRA, matching only the chapter's first section on reusing representations. Lecture 13 (about 61 minutes) is the real match for this chapter: it goes from supervised pre-training and contrastive learning (the positive/negative-sample loss) to semantic search (embedding similarity, nearest neighbors) and, from about 87%, retrieval-augmented generation (putting retrieved documents into the LLM's context without changing its parameters, and the trade-offs). However, Lecture 13's YouTube title is "LLMs, Next-Word Prediction Loss" while its transcript never mentions next-token, autoregressive or transformer, so the title does not match the content. Only Lecture 12 was embedded before, and Lecture 13 has been added.

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

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 1 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. Only Lecture 12 (first half is the diffusion wrap-up) was embedded; Lecture 13 was added because its transcript is contrastive learning, semantic search and RAG, matching the chapter (its YouTube title "LLMs, Next-Word Prediction Loss" does not match its content).

## References

- [CS229 Lecture Notes Chapter 16: Representation Learning, Retrieval, and RAG (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=197)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
