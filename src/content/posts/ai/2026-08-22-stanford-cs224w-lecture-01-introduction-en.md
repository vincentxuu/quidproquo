---
title: "Stanford CS224W Lecture 1: Introduction: Why Relational Data Needs Graph Machine Learning"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 2
tldr: "A slide-grounded reconstruction of Fall 2025 Lecture 1, covering Course map and tools, A common language for graph data, Hand-designed features and representation learning while documenting the classroom material unavailable to self-learners."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 1, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-01-introduction)

This is **Lecture 1 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-09-23. This reconstruction uses the [course schedule](https://web.stanford.edu/class/cs224w/) and the [lecture slides](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf); the slides credit Jure Leskovec and the course team.

## Materials and gaps

Public materials include 01-intro.pdf and the readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Course map and tools

The slides first expose the entire course: node embeddings, GNNs, graph transformers, knowledge graphs, graph generation, relational deep learning, and GNN+LLM. The unifying question is whether relationships between data points carry predictive signal.

### 2. A common language for graph data

A graph consists of nodes and edges. It may be directed or undirected, weighted or unweighted, and may attach features to both nodes and edges. Social systems, molecules, citation networks, and relational databases can all be expressed in this vocabulary.

### 3. Hand-designed features and representation learning

A traditional pipeline designs features such as degree and clustering coefficient before fitting a predictor. Representation learning instead learns vectors from neighborhoods and structure. That shift is the spine of the course.

### 4. Node-, edge-, and graph-level tasks

The task scale determines the output: node classification, link prediction, and graph classification require different readouts. Writing down the prediction unit before choosing a model prevents basic splitting and evaluation mistakes.

### 5. A route through the lecture

For self-study, choose one tiny graph and write each node's degree, neighborhood, and one prediction target. Reuse it as a sanity check for embeddings and message passing in later lectures.

## Slide-by-slide expansion

### A graph is a modeling decision

The deck connects social, information, technological, and biological networks. Nodes may be people, pages, proteins, or drugs; edges may encode interaction, hyperlinks, or physical binding. The useful question is whether relationships change the prediction. Write a graph-construction contract before selecting a model: node meaning, edge existence, direction, weight, and what is observable at prediction time.

### Graph variants and representation

Directed and undirected edges have different semantics; weighted edges may encode frequency, distance, or trust; multirelational graphs cannot safely collapse relation types; dynamic graphs require timestamps to prevent future leakage. Adjacency matrices expose linear algebra, while edge lists preserve sparsity. Large real graphs should not be represented as dense n-by-n arrays.

### Task scale determines labels and splits

Node, edge, and graph tasks require more than different heads. Node prediction may use masks, link prediction must remove held-out edges from training structure, and graph classification splits whole graphs. Define the prediction unit before constructing a split.

### Hand-designed features remain baselines

Degree, clustering coefficients, centrality, motifs, and graphlets remain informative. Representation learning changes how features are obtained, not the need for a credible baseline. A GNN that fails to beat a degree-based predictor has not demonstrated complex relational reasoning.

### Encoder, decoder, and objective

Read the course as three blocks: an encoder maps graph objects to vectors, a decoder turns vectors into scores, and an objective defines success. Changing negative sampling or loss can change the learned geometry even when the encoder architecture is unchanged.

### Permutation is a hard constraint

Renumbering nodes does not change a graph. Graph outputs should be invariant, while node outputs should be equivariant. Sum, mean, max, and graph readouts are designed around this requirement.

### Where the tools fit

The slides list PyTorch Geometric, GraphGym, SNAP.PY, and NetworkX. Use a tiny hand-computed graph before trusting a library. Differences usually expose self-loop, direction, normalization, or batching assumptions.

### A repeatable minimal experiment

Build a four-node path with constant features. Predict degree, endpoint status, and graph connectivity; then permute node IDs. Node outputs should permute and the graph output should remain unchanged. Reuse this test throughout the series.

## Case studies and a complete modeling audit

### 1. Social-network adoption

For adoption prediction, follow edges are directed, while interaction edges carry time and frequency. Collapsing them into one undirected binary edge discards all three signals. Cut the graph at prediction time, compare attributes and degree first, then add neighbor behavior.

### 2. Molecular graphs

Atoms are nodes and bonds are typed edges; readout must ignore atom ordering, arbitrary edge augmentation can violate valence, and random splits over related scaffolds can make testing unrealistically easy.

### 3. Knowledge graphs

A person—born_in—city triple is directed and typed, while an unrecorded triple is not necessarily false. TransE, R-GCN, and inductive KG models build on this directed, typed, incomplete setting.

### 4. The dependency chain

Embeddings define geometry; GNNs replace lookup with shared encoders; later lectures expose components, limits, transformers, heterogeneous graphs, RDL, LLMs, agents, and generation.

### 5. Evidence boundary

Slides establish formulas, examples, and agenda, not live questions or Canvas demonstrations. Worked examples here are explicit reconstructions.

### Final acceptance exercise

Write a graph problem specification with examples, schema, feature availability, prediction unit, split, baseline, and metric. Run edge ablation and node-permutation tests.

## Where this lecture leads

The concepts from Lecture 1 are composed in later lectures. Keep one small graph, a notation sheet, and a baseline. For every new model, identify whether it changes the data, message, aggregation, update, objective, or evaluation.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 1 official slides](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf)
