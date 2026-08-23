---
title: "Stanford CS224W Lecture 12: Relational Deep Learning: Turning Databases Directly into Prediction Graphs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 13
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 12, covering Limits of the tabular pipeline, Mapping relational databases to graphs, Temporal entity graphs while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 12, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-12-relational-deep-learning)

This is **Lecture 12 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-30. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Limits of the tabular pipeline

A traditional workflow uses SQL joins and feature engineering to compress many tables into one training table. SQL is capable, but every new task needs a new pipeline, and aggregation can discard relational structure.

### 2. Mapping relational databases to graphs

RDL maps primary-key entities to nodes, foreign keys to edges, and columns to node or edge features. One heterogeneous graph can then support multiple prediction tasks.

### 3. Temporal entity graphs

Real databases are temporal. A sample may use only edges and attributes available before prediction time; otherwise future transactions, status updates, or labels can leak through graph structure.

### 4. RelBench task abstraction

RelBench packages a database, task table, temporal split, metric, and loaders behind a common interface. Its contribution is comparable relational-learning experiments rather than bespoke, incompatible preprocessing.

### 5. The GNN training pipeline

A model commonly samples multi-table neighborhoods around seed entities and feeds them to a heterogeneous GNN and task head. Start with a simple tabular baseline to test whether gains truly come from relations.

## Deep lecture agenda

### The traditional feature pipeline
Tabular ML repeatedly joins tables and hand-builds aggregates for each task. This duplicates work and can leak future rows unless every feature is point-in-time correct.

### Database-to-graph mapping
Rows become typed nodes and foreign keys typed directed edges; an association table may instead become an event node when its attributes and timestamp matter. Keys, direction, and availability time must survive the conversion.

### The task table
A task table fixes the prediction entity, cutoff, and label. It is the contract separating the target from graph information the model may legally inspect.

### Temporal graphs
Each example may use only rows and edges available before its cutoff. One static full-history graph leaks future transactions even when labels are split correctly.

### The RelBench abstraction
RelBench packages databases, task tables, temporal splits, metrics, and loaders. Comparable results still require identical snapshots and task definitions.

### The baseline
A leakage-safe tabular aggregate model is the minimum comparison. RDL must improve under the same cutoff and budget rather than benefit from richer future information.

### Neighborhood sampling
Large entity graphs require typed, temporal sampling around seed rows. Fanout and relation balance define which database evidence reaches the encoder.

### A heterogeneous encoder
Type-specific column encoders align inputs before relation-aware message passing. Missing values, categorical vocabularies, and ID lookups determine whether new entities can be handled.

### Comparing effort
Measure feature-engineering time, preprocessing, memory, training, and reuse across tasks as well as accuracy. RDL claims include pipeline reuse, not only a metric gain.

### Acceptance
Trace one labeled row through snapshot, graph conversion, sampling, encoding, and metric. Assert every value predates the cutoff and compare it with the tabular baseline.

## Implementation, evaluation, and acceptance

### Association-table choice
Model a pure link as an edge and a timestamped attributed interaction as a node when its event identity matters. The choice changes paths and should be ablated when ambiguous.

### Entity resolution
Changing identifiers may split one entity or merge two. Save rules and effective dates so later cleanup cannot silently alter historical connectivity.

### Label lineage
Record source field, transformation, and observation window for every label. Exclude features derived from the same downstream event even when stored elsewhere.

### Snapshot reproducibility
Persist database version, extraction query, cutoff policy, graph-builder version, and split hashes. A mutable warehouse without these artifacts is not reproducible.

### Multi-task reuse
Shared graph assets are reusable only if their information boundary is valid for each task's cutoff. Task-specific leakage audits remain necessary.

### Acceptance test
Emit keys, edge times, source columns, and cutoff assertions for sampled examples. Insert a future row deliberately and verify rejection before scaling.

## Self-study checkpoint

Write down the prediction unit, information cutoff time, negative set, and metric before running a model. Graph leakage often travels through another relation or a future edge and is invisible in a successful program run.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 12 official slides](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf)
