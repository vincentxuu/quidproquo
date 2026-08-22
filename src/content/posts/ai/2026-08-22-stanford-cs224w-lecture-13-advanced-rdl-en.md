---
title: "Stanford CS224W Lecture 13: Advanced Architectures in RDL: RelGNN and the Relational Graph Transformer"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 14
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 13, covering The multi-relational bottleneck, RelGNN composite message passing, Relation-specific aggregation while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 13, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-13-advanced-rdl)

This is **Lecture 13 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-11-06. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/13-Advanced_topics_RDL.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. The multi-relational bottleneck

A database graph combines entity types, relation types, column types, and timestamps. One homogeneous operator mixes distinct semantics, while fully independent parameters for every relation explode in count and suffer from sparsity.

### 2. RelGNN composite message passing

RelGNN's composite message passing combines reusable operations for within-relation aggregation and across-relation composition. The objective is to share enough parameters without erasing relational differences.

### 3. Relation-specific aggregation

Relation-specific aggregation must handle extreme degree imbalance: one entity may have one edge while another has thousands of transactions. Normalization and sampling policy are therefore part of model semantics.

### 4. The Relational Graph Transformer

A Relational Graph Transformer uses typed attention over source, relation, and target interactions and can incorporate time and column encodings. Scalable systems apply attention inside sampled relational neighborhoods rather than requiring global attention.

### 5. Efficiency, sampling, and ablation

Hold splits, samplers, hidden size, and compute budget constant, then ablate relation type, temporal encoding, and attention separately. Otherwise architecture gains cannot be distinguished from extra computation.

## Deep lecture agenda

### The multi-relation bottleneck
Database relations differ greatly in frequency and semantics. Collapsing them loses meaning, while independent full parameters overfit rare relations and scale poorly.

### Composite message passing
RelGNN aggregates neighbors within each relation, then combines relation-level messages. This separates within-relation multiplicity from competition across relations.

### Relation aggregation
Sum, mean, attention, and gates encode different frequency assumptions. A frequent relation can dominate raw sums, while normalization may erase useful counts.

### Parameter sharing
Shared bases or relation embeddings trade specialization for statistical strength. State which weights are global, typed, or relation-specific.

### Relational Graph Transformer
Typed attention conditions on source, relation, destination, and possibly time. Global capacity still needs typed masks, sampling, and cutoff-safe structure.

### Column encoding
Numerical, categorical, text, and timestamp columns need suitable encoders. Fit vocabularies and normalization only on training data and preserve missingness rules.

### Temporal encoding
Absolute time, recency, and intervals differ semantically. Form every temporal message relative to the prediction cutoff.

### Sampling interaction
Sampling precedes relation aggregation, so fanouts alter relation proportions and attention normalization. Ablate sampler and architecture jointly.

### Efficiency
Typed projections and temporal sampling add memory and preprocessing. Report sampled edges, throughput, peak memory, and per-relation quality.

### Acceptance
Hand-check a two-relation database with unequal scales, then ablate sharing, temporal encoding, and sampling under a fixed budget.

## Implementation, evaluation, and acceptance

### Auditing the bottleneck
Log sampled counts and message norms per relation. Macro-per-relation metrics reveal models that effectively use only the largest table.

### Auditing composite messages
Save each relation aggregate before second-stage combination. Row permutation within a relation should not change it; relabeling relations generally should.

### Columns and time
Record encoder versions, vocabularies, normalization, missing-value rules, and cutoff-relative timestamps as model artifacts.

### Sampler interaction
Compare full and sampled neighborhoods on the same small seeds to separate architectural gains from changed exposure.

### Cost
Report parameters, preprocessing, throughput, inference latency, and memory alongside quality.

### Acceptance test
Inject a rare predictive relation and frequent irrelevant one, then vary fanout and sharing to locate when the rare signal disappears.

## Self-study checkpoint

Write down the prediction unit, information cutoff time, negative set, and metric before running a model. Graph leakage often travels through another relation or a future edge and is invisible in a successful program run.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 13 official slides](https://web.stanford.edu/class/cs224w/slides/13-Advanced_topics_RDL.pdf)
