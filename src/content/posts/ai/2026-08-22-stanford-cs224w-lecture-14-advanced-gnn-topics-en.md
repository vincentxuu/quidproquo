---
title: "Stanford CS224W Lecture 14: Advanced Topics in GNNs: In-Context Learning and Uncertainty on Graphs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 15
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 14, covering The goal of relational foundation models, Zero-shot relational transfer, PRODIGY's prompt graph while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 14, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-14-advanced-gnn-topics)

This is **Lecture 14 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-11-11. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/14-advanced_gnns.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. The goal of relational foundation models

This lecture shifts from training a model for one graph to asking whether one model can transfer across datasets, schemas, and tasks. Unlike text, relational datasets do not share a natural token vocabulary, and node and column semantics vary.

### 2. Zero-shot relational transfer

A Relational Transformer seeks a general architecture for tables and relations without hand-designing each schema. Zero-shot claims require evaluation on unseen databases and tasks, not merely a held-out split of one dataset.

### 3. PRODIGY's prompt graph

PRODIGY builds a prompt graph from demonstrations and a query so a graph model can perform in-context learning. The prompt's connectivity is itself an input design that determines which labeled examples and relations are visible.

### 4. Conformal prediction on graphs

Point predictions do not reveal when a model is unreliable. Conformalized GNNs use calibration residuals to form prediction sets or intervals, seeking coverage under stated assumptions rather than correctness for every sample.

### 5. Coverage, efficiency, and limits

Graph dependence can violate ordinary exchangeability assumptions, and foundation models may face schema shift. Report accuracy, coverage, set size, inference cost, and unseen-schema performance together.

## Deep lecture agenda

### The cross-database objective
A relational foundation model should transfer across renamed, differently organized schemas. It must learn structural and semantic regularities rather than database IDs.

### Relational Transformers
Typed attention represents rows, columns, relations, and context in one architecture. Broad pretraining does not guarantee transfer under schema or temporal shift.

### Task specification
Specify prediction entity, cutoff, label semantics, and support examples. The prompt must define the task without exposing target labels.

### The PRODIGY prompt graph
PRODIGY encodes demonstrations and query as a prompt graph for task-conditioned message passing. Prompt nodes and edges define the available in-context evidence.

### In-context evaluation
Hold out tasks or databases during pretraining and fix the support budget. Random rows from a familiar schema are not zero-shot transfer.

### Why uncertainty matters
Rare structures, sparse support, and shift create failures a point score cannot express. The system may need to abstain.

### Conformal prediction
Calibration nonconformity scores yield sets or intervals with target marginal coverage under exchangeability. Calibration and test splits must follow the declared protocol.

### Graph dependence
Linked examples are dependent, so naive exchangeability may fail. Calibration units or graph blocks must reflect that dependence.

### Shift
Schema, population, time, and task shifts can break transfer and calibration. Report coverage and set size per shift regime.

### Acceptance
Evaluate held-out databases with prompt ablations and permutation tests; report accuracy, coverage, set size, subgroup behavior, and abstention cost.

## Implementation, evaluation, and acceptance

### Distinguish settings
Separate fine-tuning, in-context new tasks, new-schema transfer, and full zero-shot evaluation.

### Prompt leakage
Support examples, graph edges, or text may reveal labels or post-cutoff facts. Audit every path from prompt to target.

### Permutation
Rename schema and entity IDs and reorder demonstrations while preserving semantics. Outputs should remain consistent unless names are explicitly meaningful.

### Coverage audit
Measure coverage by degree, class, schema, time, and support size; averages can hide severe rare-case undercoverage.

### Abstention cost
More abstention improves safety but reduces utility. Pair coverage with set size, retained accuracy, and deferral cost.

### Acceptance test
Use a renamed held-out schema with a shifted subgroup and verify task invariance and calibration separately.

## Self-study checkpoint

Write down the prediction unit, information cutoff time, negative set, and metric before running a model. Graph leakage often travels through another relation or a future edge and is invisible in a successful program run.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 14 official slides](https://web.stanford.edu/class/cs224w/slides/14-advanced_gnns.pdf)
