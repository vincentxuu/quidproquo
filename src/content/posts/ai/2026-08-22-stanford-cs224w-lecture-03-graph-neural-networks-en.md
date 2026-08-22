---
title: "Stanford CS224W Lecture 3: Graph Neural Networks: A First Complete Message-Passing Model"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 4
tldr: "A slide-grounded reconstruction of Fall 2025 Lecture 3, covering From fixed embeddings to deep encoders, The message-passing framework, Aggregation and update while documenting the classroom material unavailable to self-learners."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 3, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-03-graph-neural-networks)

This is **Lecture 3 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-09-30. This reconstruction uses the [course schedule](https://web.stanford.edu/class/cs224w/) and the [lecture slides](https://web.stanford.edu/class/cs224w/slides/03-GNN1.pdf); the slides credit Jure Leskovec and the course team.

## Materials and gaps

Public materials include 03-GNN1.pdf and the readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. From fixed embeddings to deep encoders

The previous lecture directly learned one vector per node, leaving no parameter for a node unseen during training. A GNN instead learns a shared function that builds representations from features and neighborhoods, enabling inductive inference.

### 2. The message-passing framework

One message-passing layer first aggregates neighbor messages with a permutation-invariant function, then combines the result with the node's current state. After K layers, a representation can receive information from at most a K-hop neighborhood.

### 3. Aggregation and update

GCN mixes neighbors through normalized adjacency, while GraphSAGE separates a neighbor aggregator from the center-node representation before combining them. Their contrast shows that normalization, self-loops, and aggregation are part of the model definition.

### 4. GCN and GraphSAGE

Node tasks read node states directly; edge tasks combine endpoint states; graph tasks apply a sum, mean, or another readout over the graph. A graph readout must also be invariant to node ordering.

### 5. Node-, edge-, and graph-level outputs

Hand-calculate one layer on a three-node graph and verify tensor shapes and normalization before scaling up. This catches missing self-loops and reversed edge directions faster than a large training run.

## Slide-by-slide expansion

### From node lookup to a shared function

A GNN consumes initial features and graph structure and applies shared aggregation and update functions. Parameter count does not scale with node count, and unseen nodes can be embedded when features and neighborhoods are available.

### The computational graph is not the raw graph

Expanding K layers around a target creates a K-hop computational graph. Neighbors first aggregate their own neighbors, and fanout grows quickly. Drawing this expansion clarifies duplicated nodes, direction, and sampling cost.

### Aggregation is a set function

Neighbor order is arbitrary. Mean, sum, and max preserve different information, while the combine step decides whether a node retains its own features. Omitting the center state can collapse nodes with identical neighborhoods.

### GCN normalization

GCN commonly adds self-loops and applies symmetric degree normalization. This controls scale across degrees. Duplicate self-loops and accidental symmetrization of directed graphs are common semantic bugs.

### The GraphSAGE inductive recipe

GraphSAGE samples neighborhoods, aggregates them, combines the result with the center state, and applies a shared transformation. Sampling makes mini-batches feasible but trades memory against estimator quality.

### Supervised and unsupervised objectives

Cross-entropy on labeled nodes and graph-based contrastive objectives preserve different information. State whether features and edges from validation/test nodes are visible under the transductive or inductive protocol.

### Edge and graph prediction

Edge decoders combine endpoint embeddings; graph tasks apply a permutation-invariant readout. Batched graphs require membership indices so nodes from different graphs are not pooled together.

### Receptive field and depth

K layers permit K-hop information flow, but deeper networks face smoothing, squashing, and optimization limits. Choose depth from a hypothesis about necessary path length.

### A minimal calculation

Hand-compute one mean-aggregation layer on a three-node chain with self-loops, permute node IDs, and add an isolated node. Only then reproduce it in PyG and check edge direction, self-loops, aggregation mode, and multiplication order.

## Complete GNN experiment audit

### 1. Fix node-axis and edge-direction conventions

The first axis of the node-state matrix must consistently identify nodes. When sparse adjacency multiplies dense features, the source/target convention in the edge index determines whether messages propagate along incoming or outgoing edges. Verify the convention on a tiny directed graph before training.

### 2. Handle isolated nodes explicitly

An isolated node has an empty neighborhood and may receive a zero message. A self-loop, residual path, or explicit empty-set rule determines whether its own features survive. State that rule instead of letting a library default silently decide it.

### 3. Neighbor averaging embeds a homophily assumption

Averaging is helpful when linked nodes tend to share useful signals, but real edges may connect different classes or roles. Bucket results by neighborhood homophily and compare against a feature-only baseline so that propagation gains are not assumed from aggregate accuracy alone.

### 4. Full-batch versus sampled computation

Small graphs can use full-batch propagation. On large graphs, start from seed nodes and sample neighbors layer by layer; fanout then controls both memory and the effective computation graph. Report fanouts and whether evaluation uses sampling or full neighborhoods.

### 5. Error analysis across graph regimes

Bucket errors by degree, isolation, label frequency, and neighborhood homophily. Track pairwise cosine similarity between node embeddings as depth grows to detect representation collapse rather than attributing every failure to the classifier head.

### 6. A message-passing indistinguishability test

If two nodes receive the same multiset at every layer and start from the same state, a standard shared-update GNN produces the same representation. Keep such a pair as a regression test; an unexpected difference signals extra IDs, positional features, asymmetric preprocessing, or a convention bug.

### Final acceptance exercise

Use three counterexamples: permuted node IDs, equal-feature nodes with different degrees, and a held-out edge connecting two groups. Save every layer's node states. Early representation failures point to propagation; correct states with wrong logits point to heads, labels, masks, or loss.

## Where this lecture leads

The concepts from Lecture 3 are composed in later lectures. Keep one small graph, a notation sheet, and a baseline. For every new model, identify whether it changes the data, message, aggregation, update, objective, or evaluation.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 3 official slides](https://web.stanford.edu/class/cs224w/slides/03-GNN1.pdf)
