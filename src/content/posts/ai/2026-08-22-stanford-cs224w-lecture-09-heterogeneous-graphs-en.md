---
title: "Stanford CS224W Lecture 9: Heterogenous Graphs: Adding Node and Relation Types to Message Passing"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 10
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 9, covering Heterogeneous graph schemas, Relation-specific messages, R-GCN while documenting unavailable classroom material."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 9, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-09-heterogeneous-graphs)

This is **Lecture 9 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-21. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/09-hetero.pdf); the slides credit Jure Leskovec, Charilaos Kanatsoulis, and the course team.

## Materials and gaps

Public materials include the slides and optional readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Heterogeneous graph schemas

A heterogeneous graph has multiple node or edge types, such as author–paper–venue. Collapsing every relation into one adjacency matrix makes 'author writes paper' indistinguishable from 'paper appears at venue.'

### 2. Relation-specific messages

Message passing must account for source type, relation type, and target type. Each typed edge may receive its own transformation before the target aggregates messages across relations.

### 3. R-GCN

R-GCN assigns parameters to relations and controls their count through basis or block decomposition. It suits multi-relational graphs, but graphs with many relation types still require careful sharing.

### 4. Heterogeneous Graph Transformer

HGT introduces node and edge types into attention, messages, and updates, giving different meta-relations different projections. This changes propagation more directly than attaching one type one-hot feature.

### 5. Parameter sharing and scalability

Write the schema before modeling: node types, edge directions, reverse edges, available features, and prediction target. Split by time or target relation where appropriate to prevent future information leaking through another relation.

## A complete heterogeneous-graph modeling agenda

### The schema is the first model

Node types, edge types, directions, and feature availability define which messages can exist before a neural layer is chosen. Collapsing types may erase semantics; proliferating types may leave too little data per parameter block.

### Canonical edge types

A canonical relation is a source-type, relation, destination-type triple. The same relation name between different endpoint types is not automatically the same transformation, and reverse edges must be declared rather than silently added.

### The R-GCN update

R-GCN transforms neighbor states with relation-specific weights, normalizes messages, and combines them with a self transformation. This preserves relation semantics but makes normalization and parameter sharing part of the architecture.

### Basis decomposition

Represent each relation matrix as a learned combination of a small set of bases. This reduces parameter growth and shares statistical strength, though too few bases can force unrelated relations into the same subspace.

### HGT typed attention

HGT conditions query, key, value, and attention priors on node and relation types. The resulting weight answers which typed neighbor matters to a typed receiver, not just which adjacent node has a similar feature vector.

### Time and relative time

Temporal edges require a prediction cutoff and often a relative-time encoding. Sampling or feature construction that crosses the cutoff leaks the future even if the target edge itself is removed.

### Feature alignment

Different node types may begin with text, categories, dense vectors, or no features. Type-specific input encoders can align dimensions, but an ID lookup remains transductive and must not be described as cold-start support.

### Heterogeneous sampling

Uniform neighbor sampling can let frequent relations dominate and rare types disappear. Per-relation fanouts or typed walks change the training distribution and must be recorded with the model.

### Splits and leakage

Information may reach a test label through another relation, a reverse edge, or a future event. Split construction must remove the whole forbidden information path, not only the literal supervised edge.

### Acceptance protocol

Compare a type-collapsed baseline, relation-specific model, and shared-parameter variant under the same budget. Break metrics down by relation frequency, endpoint type, degree, and seen/unseen entities, and save the schema version.

## Implementation and evidence boundaries

### Parameter growth

One full matrix per relation scales poorly and underserves rare relations. State basis, block, or generated-weight sharing.

### Type-specific normalization

Across-relation and within-relation normalization treat high-frequency relations differently and are part of model semantics.

### Cold start

Shared type encoders can handle new attributed entities; ID and relation lookup tables cannot handle unseen vocabularies directly.

### Metric breakdown

Report micro and macro-per-relation results by degree, frequency, type, and seen/unseen status.

### Schema versioning

Save schema hashes, type vocabularies, feature-encoder versions, and explicit behavior for unseen types.

### Final schema acceptance

Trace one prediction through its typed edges, transformations, normalization, and cutoff. Then remove reverse or auxiliary relations in turn; any large change identifies a dependency that must be named in the claim and leakage audit.

## Self-study checkpoint

Take one minimal graph or set of triples and write down the input, invariances retained by the model, output, and evaluation. If two examples that should differ remain identical at every step, you have located an expressive gap in the encoder.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 9 official slides](https://web.stanford.edu/class/cs224w/slides/09-hetero.pdf)
