---
title: "Stanford CS224W Lecture 8: Graph Transformers: Connecting Attention to Graph Structure"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 9
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 8, covering Self-attention and message passing, The scope of graph attention, Positional and structural encodings while documenting unavailable classroom material."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 8, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-08-graph-transformers)

This is **Lecture 8 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-16. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/08-graph-transformer1.pdf); the slides credit Jure Leskovec, Charilaos Kanatsoulis, and the course team.

## Materials and gaps

Public materials include the slides and optional readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Self-attention and message passing

A Transformer normally treats its input as a token set with positional information, while a graph has no natural sequence order. A Graph Transformer must therefore decide which nodes may attend and how topology enters the model.

### 2. The scope of graph attention

Masking attention to adjacency edges yields a learned message-passing aggregator. Global attention sends information across long distances directly, but raises computation and the risk of ignoring useful locality.

### 3. Positional and structural encodings

Positional encodings restore structural information about a node. Options include shortest-path distance, degree, random-walk statistics, and spectral features; each preserves a different set of invariances.

### 4. Laplacian eigenvectors

Laplacian eigenvectors provide global coordinates, but an eigenvector's sign is arbitrary and repeated eigenvalues admit arbitrary bases. Treating these coordinates as ordinary features can make a model sensitive to equivalent representations.

### 5. Local-global hybrids

Practical systems often combine local message passing with global attention. Compare no positional encoding, local-only, global-only, and hybrid variants so any gain can be attributed.

## Deep Graph Transformer agenda

### Why an ordinary Transformer is insufficient

A vanilla Transformer treats nodes as an unordered complete set and has no graph relation unless structure is injected. Permutation equivariance alone does not tell the model which pairs are adjacent, distant, or connected by a typed path.

### Attention as message passing

Attention sends value vectors with data-dependent weights and aggregates them by a weighted sum. On a graph, the allowed sender-receiver pairs and structural bias determine the message-passing graph.

### Local versus global attention

Local attention follows edges and scales with sparse neighborhoods; global attention connects every pair and can express long-range interactions at quadratic cost. Hybrid layers trade reach for memory rather than making one scope universally superior.

### Structural encoding

Shortest-path distance, degree, edge paths, and random-walk statistics can enter node features or attention logits. Their computation and invariances must match the prediction snapshot to avoid leaking held-out structure.

### Laplacian positional encoding

Eigenvectors of the graph Laplacian give smooth global coordinates ordered by eigenvalue. Disconnected components and repeated eigenvalues make the coordinate system non-unique, so raw coordinates need invariant or augmentation-aware handling.

### Sign and basis invariance

An eigenvector and its negative are equally valid, while repeated eigenspaces admit rotations. Random sign flips address only the first ambiguity; a robust model must not attach meaning to an arbitrary basis inside a repeated eigenspace.

### Graphormer-style biases

Pairwise distance and edge-path summaries can bias attention before softmax, making graph relations affect who attends to whom. A bias changes preference but does not remove a pair, unlike a hard mask.

### Tokens and virtual nodes

A graph token or virtual node provides a global communication hub and a graph-level readout. It also shortens every path, so gains must be separated from added parameters and changed connectivity.

### Scaling

Full attention uses quadratic pair storage, while sparse masks, sampling, clustering, or low-rank approximations change the effective model. Report preprocessing, peak memory, and latency by graph size alongside predictive metrics.

### Acceptance protocol

Run node-permutation tests, sign/basis perturbations, local-versus-global ablations, and graph-size scaling. Preserve the exact bias, mask, positional preprocessing, and snapshot used for every result.

## Implementation and evidence boundaries

### Bias versus mask

A mask removes node pairs; a bias changes their scores. Disconnected pairs and distance cutoffs therefore require explicit policies.

### Edge-path encoding

Multiple shortest paths create tie-breaking choices. Report path selection, edge direction, and aggregation.

### Split-safe precomputation

Spectral, shortest-path, and random-walk encodings must be computed on the training graph or time-correct snapshot.

### Numerical stability

Repeated eigenvalues, disconnected components, padding, ordering, and tolerances affect batched spectral features.

### Acceptance outputs

Report invariance tests, positional ablations, preprocessing, memory, and latency across graph sizes, not accuracy alone.

### Final Transformer acceptance

On a tiny graph, manually compute one attention row with and without structural bias and confirm masked pairs receive no probability. Then permute nodes and flip spectral signs; outputs should transform consistently before the model is trusted on a large benchmark.

## Self-study checkpoint

Take one minimal graph or set of triples and write down the input, invariances retained by the model, output, and evaluation. If two examples that should differ remain identical at every step, you have located an expressive gap in the encoder.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 8 official slides](https://web.stanford.edu/class/cs224w/slides/08-graph-transformer1.pdf)
