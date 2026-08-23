---
title: "Stanford CS224W Lecture 4: A General Perspective on GNNs: Turning a Model into Design Components"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 5
tldr: "A slide-grounded reconstruction of Fall 2025 Lecture 4, covering The GNN design space, Message, aggregation, and update, GraphSAGE while documenting the classroom material unavailable to self-learners."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 4, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-04-general-gnn-perspective)

This is **Lecture 4 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-02. This reconstruction uses the [course schedule](https://web.stanford.edu/class/cs224w/) and the [lecture slides](https://web.stanford.edu/class/cs224w/slides/04-GNN2.pdf); the slides credit Jure Leskovec and the course team.

## Materials and gaps

Public materials include 04-GNN2.pdf and the readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. The GNN design space

This lecture stops treating a GNN as one formula and decomposes it into message, aggregation, update, layer connectivity, and readout. The decomposition makes model comparisons precise and reveals what a modification actually changes.

### 2. Message, aggregation, and update

Aggregation must ignore neighbor ordering; sum, mean, and max preserve different information. The update may concatenate center and neighbor states and may add residual connections, normalization, and nonlinearities.

### 3. GraphSAGE

GraphSAGE neighbor sampling enables mini-batch training without expanding the entire graph. The cost is an estimate of the full neighborhood, so sample size controls both computation and message quality.

### 4. Graph Attention Networks

GAT learns weights over neighbors, but those weights are still normalized within a local neighborhood. Attention alone does not solve long-range information flow or the difficulties of very deep GNNs.

### 5. Sampling, depth, and efficiency

Create a component table for experiments: aggregator, depth, hidden dimension, normalization, dropout, sampling, and readout. Change one axis at a time so results remain attributable.

## Slide-by-slide expansion

### Replace model-name lists with a design space

The deck decomposes a layer into message, aggregation, and update, then a network into preprocessing, stacked layers, skip connections, postprocessing, and a head. GCN, GraphSAGE, and GAT become configurations rather than isolated formulas.

### Information available to a message

Messages may use sender, receiver, edge features, and relation types. Ignoring time, distance, or bond attributes can delete task signal. Directed graphs also require a decision about incoming and outgoing parameter sharing.

### Aggregation and expressivity

Sum, mean, max, and attention are permutation invariant but preserve different statistics. Attention is a learned weighted sum, not automatically an injective multiset function. This leads directly to the WL/GIN analysis in Lecture 6.

### Update, residual, and normalization

Updates may add, concatenate, or recurrently combine center and neighbor states. Residual connections preserve shorter-hop information. Batch, layer, and graph normalization use different statistical units and belong in the reported model definition.

### GAT attention

GAT transforms node states, scores existing edges, normalizes scores within each neighborhood, and performs weighted aggregation. Multi-head outputs may be concatenated or averaged. Local masked attention is not global Transformer attention, and weights are not automatically causal explanations.

### Both sides of GraphSAGE sampling

Fixed fanout controls computation around seed nodes but creates a stochastic neighborhood estimate. Report fanout, replacement, direction, and train/inference sampling policies.

### Layer connectivity matters

Plain stacks, residual paths, dense connections, and Jumping Knowledge retain different hop scales. Reading only the final layer can discard useful local information, especially on heterophilous graphs.

### The GraphGym experimental view

GraphGym makes architecture and training axes explicit. Hold data and compute budget fixed, change one axis, and save configuration, seeds, best epoch, and validation curves.

### A reproducible component table

Document message inputs, aggregator, combine rule, depth, residuals, normalization, dropout, fanout, and readout. Change only mean aggregation to attention in the next run; use multiple seeds before attributing an effect.

## Design-space audit details

### 1. Pre-processing and post-processing MLPs serve different roles

A pre-processing MLP projects raw features before information travels through the graph. A post-processing MLP adds node-wise capacity after propagation. Reporting only “two MLP layers” hides where the capacity sits and whether it can affect messages.

### 2. Edge features can enter in more than one place

An edge attribute may be part of the message, part of the attention score, or both. These choices change what information is transmitted and which neighbors are weighted. An ablation must identify the insertion point rather than merely say that edge features were enabled.

### 3. Dropout variants remove different objects

Feature dropout masks coordinates, attention dropout masks or perturbs coefficients, edge dropout changes graph structure, and layer dropout removes an entire transformation path. Equal rates do not make them equivalent regularizers, so configs and conclusions must name the object being dropped.

### 4. Define fairness in model comparisons

One can hold parameter count, training time, or peak memory fixed, but usually not all three. Choose the resource constraint before comparing aggregators and disclose the other two measurements so an accuracy gain is not detached from its computational price.

### 5. Graph experiments contain several random processes

Splits, neighbor sampling, initialization, and dropout each introduce randomness. Save the split identity and seeds, then report a distribution across runs. A single seed cannot establish that a design-space choice is robust.

### 6. Translate every config into six sentences

State the initial information, which edges carry it, what each message contains, how messages are aggregated, whether the center state is retained, and at what unit the loss is computed. This verbal expansion catches hidden architectural differences more reliably than model names.

### Final acceptance exercise

Run a 2-by-2 grid: mean versus attention and plain versus residual, holding all other settings fixed. Report parameters, time, memory, and validation distributions. Test edge-feature ablation and node permutation. Interaction effects should not be rewritten as universal superiority.

## Where this lecture leads

The concepts from Lecture 4 are composed in later lectures. Keep one small graph, a notation sheet, and a baseline. For every new model, identify whether it changes the data, message, aggregation, update, objective, or evaluation.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 4 official slides](https://web.stanford.edu/class/cs224w/slides/04-GNN2.pdf)
