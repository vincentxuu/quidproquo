---
title: "Stanford CS224W Lecture 2: Node Embeddings: From Random Walks to node2vec"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 3
tldr: "A slide-grounded reconstruction of Fall 2025 Lecture 2, covering Encoder-decoder view, Similarity and the objective, Random walks while documenting the classroom material unavailable to self-learners."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 2, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-02-node-embeddings)

This is **Lecture 2 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-09-25. This reconstruction uses the [course schedule](https://web.stanford.edu/class/cs224w/) and the [lecture slides](https://web.stanford.edu/class/cs224w/slides/02-nodeemb.pdf); the slides credit Jure Leskovec and the course team.

## Materials and gaps

Public materials include 02-nodeemb.pdf and the readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Encoder-decoder view

A node embedding maps every node to a low-dimensional vector and asks graph-near nodes to remain near in vector space. The central choice is not dimensionality reduction itself, but the definition of proximity.

### 2. Similarity and the objective

An encoder produces node vectors; a decoder, often based on an inner product, reconstructs similarity. The objective pulls observed contexts together and needs negative examples to prevent every vector from collapsing to the same point.

### 3. Random walks

DeepWalk generates node sequences with truncated random walks and applies a skip-gram objective. It therefore learns walk co-occurrence rather than only one-hop adjacency.

### 4. DeepWalk and node2vec

node2vec adds return and in-out parameters to bias the next step between BFS-like and DFS-like exploration. These choices express different inductive biases for community proximity and structural roles.

### 5. Negative sampling and matrix-factorization view

Before implementation, fix the similarity definition, walk length, walks per node, and negative-sampling rule. Validate on link prediction or a downstream classifier rather than trusting a two-dimensional plot.

## Slide-by-slide expansion

### Make the unsupervised target explicit

The encoder maps node u to z_u and the decoder scores z_u with z_v. The central decision is similarity: adjacency, shared neighbors, random-walk co-occurrence, and structural role define different geometries.

### Why full softmax is expensive

Normalizing a context probability over every node is prohibitive on a large graph. Negative sampling replaces it with discrimination between observed pairs and sampled non-pairs. The negative distribution changes the learned task and is not an implementation footnote.

### Random walks sample proximity

Walk length, walks per node, and context window determine which high-order neighborhoods become training pairs. Very long walks approach stationary behavior; oversized windows blur local distinctions.

### The DeepWalk pipeline

DeepWalk samples uniform walks, builds skip-gram windows, and learns embeddings before a downstream classifier or link scorer. Fix downstream splits and tuning when comparing embeddings.

### node2vec parameters p and q

A second-order walk remembers the previous node. The return parameter controls immediate backtracking and the in-out parameter trades BFS-like local exploration against DFS-like outward exploration. Homophily and structural-equivalence tasks favor different settings.

### The matrix-factorization view

The official reading connects walk co-occurrence objectives to factorization of a shifted proximity statistic. Walk policy, window, and negative distribution therefore determine an implicit matrix. Truncated SVD is a useful baseline.

### The transductive boundary

DeepWalk and node2vec normally learn one parameter row per training node ID. A new node has no vector without retraining or an additional mapping, motivating the shared neighborhood encoders in Lecture 3.

### Evaluation beyond t-SNE

Two-dimensional projections distort distance. Evaluate node classification, leakage-safe link prediction, or clustering against random, degree, spectral, and matrix-factorization baselines.

### A hand exercise

Use a triangle with a two-node tail. Tabulate walk co-occurrence from a triangle node and the tail endpoint under return-heavy and outward-heavy policies. The counts predict the embedding geometry before training.

## Formula and experiment audit

### 1. Pair direction changes the meaning on directed graphs

For a directed graph, a source–context pair is ordered. Reversing it changes whether the objective represents following outgoing links, explaining incoming links, or a deliberately symmetrized relation. The walk convention and the decoder's argument order therefore belong in the experiment specification.

### 2. Stationary distributions favor high-degree nodes

Ordinary random walks do not sample nodes uniformly. High-degree or otherwise frequently visited nodes appear as contexts more often, so the learned objective partially reflects popularity. Report the context-frequency distribution and distinguish a useful graph prior from sampling bias.

### 3. Link prediction requires a training-only walk graph

Remove positive test edges before generating walks, then construct every context pair from the training graph alone. Otherwise the embedding process has already observed the edge later presented as held out. Negative examples and connectivity repairs must follow the same split boundary.

### 4. Minimum reproducibility record for node2vec

Record embedding dimension, walk length, walks per node, context window, p, q, number and distribution of negatives, epochs, optimizer, and seed. Also state whether the graph is directed or weighted and how isolated nodes are handled; omitting any of these can materially change the sampled corpus or objective.

### 5. Strengths and costs

Node2vec needs no node attributes and is simple and effective on a fixed graph. Its cost is transductivity: every node ID owns parameters, new nodes have no embedding without additional work, and the unsupervised walk objective is separate from downstream supervision. Those constraints matter when comparing it with a shared inductive encoder.

### Final acceptance exercise

Use one graph with dense communities and another with disconnected but isomorphic stars. Sweep p and q under fixed settings and compare cosine distributions for community and structural-role pairs. Add new nodes to expose the lookup model's transductive boundary and retraining cost.

## Where this lecture leads

The concepts from Lecture 2 are composed in later lectures. Keep one small graph, a notation sheet, and a baseline. For every new model, identify whether it changes the data, message, aggregation, update, objective, or evaluation.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 2 official slides](https://web.stanford.edu/class/cs224w/slides/02-nodeemb.pdf)
