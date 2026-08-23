---
title: "Stanford CS224W Lecture 18: Deep Generative Models for Graphs: GraphRNN and Goal-Directed Molecular Generation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 19
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 18, covering The graph-generation problem and representation, Evaluating generation quality, GraphRNN's autoregressive factorization while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 18, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-18-graph-generative-models)

This is **Lecture 18 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-12-02. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and the [official Lecture 18 deck](https://web.stanford.edu/class/cs224w/slides/18-deep-generation.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. The graph-generation problem and representation

Graph generation learns a distribution over graphs rather than labels on one fixed graph. Output size varies, nodes have no natural order, and many adjacency permutations describe the same graph, complicating likelihoods and generation sequences.

### 2. Evaluating generation quality

Evaluation should combine validity, uniqueness, novelty, structural distribution matching, and application-specific properties. Attractive samples alone hide mode collapse and duplication.

### 3. GraphRNN's autoregressive factorization

GraphRNN factorizes a graph into a node sequence and edge sequences connecting each new node to previous nodes, using hierarchical recurrent generation. Node ordering still affects the sequence and is part of the method.

### 4. Molecular graphs and validity constraints

Molecular graphs add valence and chemical-validity constraints. An arbitrary edge can immediately create an invalid molecule, so action spaces, masks, and environment checks must enforce legal operations together.

### 5. GCPN's reinforcement-learning objective

GCPN treats molecule construction as a policy whose reward combines target properties, validity, and constraints. Reward design determines which loopholes the model exploits, so report components and generation failures separately.

## Complete graph-generation agenda

### Problem definition

Graph generation learns a distribution over variable-size graphs. Node order is not graph semantics even though sequence likelihood depends on ordering.

### Representation choices

Adjacency matrices, edge lists, and node-by-node generation create different permutation, output-size, and error-accumulation tradeoffs.

### Autoregressive factorization

Teacher forcing trains on correct prefixes, while inference consumes the generator's own samples and accumulates mistakes.

### GraphRNN hierarchy

GraphRNN uses a graph-level RNN for node state and an edge-level RNN for each new node's connections. BFS-like ordering narrows sequences but remains part of the protocol.

### Likelihood and sampling

Likelihood does not guarantee valid or diverse samples. Temperature, top-k policy, and termination thresholds must remain fixed in comparisons.

### Distributional evaluation

Degree, clustering, motifs, and path lengths complement validity, uniqueness, novelty, and memorization checks.

### Molecular graphs

Molecular actions use typed atoms and bonds under valence constraints. Hard masks improve validity without proving property quality or synthesizability.

### GCPN

GCPN encodes a partial molecule and learns graph-construction actions with a reward combining target properties, validity, and constraints.

### Reward hacking

A learned property reward can be exploited. Report every component and re-evaluate with an independent predictor or oracle.

### Conditional generation

Property, size, or scaffold conditions require both condition satisfaction and diversity tests, including matched-size controls.

### Scaling and reproducibility

Save ordering, vocabulary, maximum size, teacher forcing, sampling seed, temperature, validity rules, and reward-model version.

### Acceptance

Test paths, cycles, and stars before molecules; test ordering sensitivity, preserve actions and masks, and compare with nearest training examples.

## Implementation, failure modes, and acceptance

### Permutation likelihood

A graph has many node orderings. State the canonical, BFS, or random policy and whether evaluation considers multiple orderings.

### Validity stages

Report parse, graph, domain, and task validity separately, and distinguish hard masks from repair.

### Mode collapse

Uniqueness can hide a few narrow modes. Compare joint motif, size, and property distributions.

### Novelty

Use isomorphism-aware canonical hashes; a reordered graph is not novel.

### RL evaluation

A GCPN reward curve is not final quality. Use an independent evaluator and expose objective components.

### Acceptance trace

Save every action, mask, log-probability, validity decision, and reward to locate the first illegal action.

## Self-study checkpoint

Decompose the pipeline into graph construction, retrieval or sampling, encoder, prediction head, and evaluation. Replace one component at a time and retain cost and failure traces so any improvement remains attributable.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 18 official slides](https://web.stanford.edu/class/cs224w/slides/18-deep-generation.pdf)
