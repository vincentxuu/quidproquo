---
title: "Stanford CS224W Lecture 15: Foundation Models for Knowledge Graphs: New Entities, New Relations, and Double Equivariance"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 16
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 15, covering Limits of transductive KG embeddings, Entity-inductive link prediction, The relation graph while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 15, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-15-kg-foundation-models)

This is **Lecture 15 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-11-13. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/15-KGFoundationModels.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Limits of transductive KG embeddings

Traditional KG embeddings allocate parameters to every entity and relation, so they operate within the training vocabulary. A new graph, entity, or relation type can require retraining.

### 2. Entity-inductive link prediction

Entity-inductive methods replace entity-ID lookup with representations built from local subgraphs, relation patterns, or textual features. They can handle new nodes, but a relation lookup table still cannot handle unseen relations.

### 3. The relation graph

A relation graph turns relation types into nodes and connects them according to their roles and co-occurrence in triples. A model can then derive relation representations from structure.

### 4. Double equivariance

Double equivariance requires consistent behavior under both entity and relation permutations. It prevents specific IDs from becoming semantics and allows the same reasoning rule to move to renamed or entirely new graphs.

### 5. ULTRA, InGram, and zero-shot reasoning

ULTRA and InGram illustrate relation-level structure for unseen entities and relations. Evaluate foundation-model claims separately in transductive, entity-inductive, relation-inductive, and fully inductive settings.

## Deep lecture agenda

### The transductive ceiling
Classic KG embeddings allocate vectors to known entity and relation IDs. They cannot directly score unseen vocabularies.

### Entity-inductive prediction
Represent new entities from observed neighborhoods or attributes while relations remain known. Target entities must be absent from training parameters, not merely missing a few edges.

### Relation-inductive prediction
Unseen relations arrive with support triples. Their meaning must come from structure rather than a trained lookup vector.

### Fully inductive prediction
Both entities and relations are unseen. This stronger setting needs query-conditioned structural reasoning and disjoint vocabularies.

### The relation graph
Connect relation types by how they co-occur around entities and argument positions. This transfers structural patterns without relation names.

### Double equivariance
Predictions should transform consistently under independent renaming of entities and relations, preventing ID shortcuts.

### ULTRA-style reasoning
ULTRA builds relation representations on the relation graph, conditions on the query relation, then propagates on the entity graph.

### InGram
InGram derives inductive relation and entity representations from a support graph. Performance depends on support connectivity rather than ID memory.

### Negative transfer
Sharing hurts when relation patterns differ. Break results down by support size and similarity against a no-transfer baseline.

### Acceptance
Use entity-, relation-, and fully inductive splits, rename all IDs, vary support sparsity, and trace both propagation stages.

## Implementation, evaluation, and acceptance

### Split construction
List entity and relation vocabularies per split, including inverse aliases. Do not fit dictionaries on the full graph.

### Relation-graph roles
Encode argument-position co-occurrence explicitly and ablate each role to explain the auxiliary graph.

### Query conditioning
Query-dependent propagation changes caching and inference cost; report both.

### Support sparsity
Evaluate shrinking and disconnected support, not only averages with abundant triples.

### ID invariance
Permute entity and relation IDs independently and require consistent metrics and transformed outputs.

### Acceptance test
Score one structural query across two renamings, then remove support edges sequentially and preserve the change trace.

## Self-study checkpoint

Write down the prediction unit, information cutoff time, negative set, and metric before running a model. Graph leakage often travels through another relation or a future edge and is invisible in a successful program run.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 15 official slides](https://web.stanford.edu/class/cs224w/slides/15-KGFoundationModels.pdf)
