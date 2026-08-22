---
title: "Stanford CS224W Lecture 10: Knowledge Graphs: Modeling Relations with TransE, ComplEx, and RotatE"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 11
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 10, covering Knowledge graphs and completion, Triple scoring, TransE and relation patterns while documenting unavailable classroom material."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 10, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-10-knowledge-graphs)

This is **Lecture 10 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-23. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/10-kg.pdf); the slides credit Jure Leskovec, Charilaos Kanatsoulis, and the course team.

## Materials and gaps

Public materials include the slides and optional readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Knowledge graphs and completion

A knowledge graph records facts as `(head, relation, tail)` triples. Knowledge graph completion ranks a missing head, relation, or tail; it should not assume every unrecorded triple is false.

### 2. Triple scoring

Embedding models learn vectors for entities and relations and use a scoring function to measure triple compatibility. Training raises scores for observed positives and creates negatives by corrupting a head or tail.

### 3. TransE and relation patterns

TransE represents a relation as a translation, asking head plus relation to approach tail. Its geometry is intuitive but limited for one-to-many, symmetric, and compositional relations.

### 4. DistMult, ComplEx, and RotatE

DistMult uses a bilinear product and is inherently symmetric in head and tail. ComplEx introduces complex-valued embeddings to model asymmetry. RotatE treats relations as rotations in the complex plane and can represent symmetry, antisymmetry, inversion, and composition patterns.

### 5. Negative sampling and filtered evaluation

Evaluation commonly reports mean reciprocal rank and Hits@K under a filtered protocol that removes other known true triples. Verify that negative sampling does not label known facts as negatives before comparing models.

## Deep knowledge-graph agenda

### Open-world triple data

An absent triple is generally unknown, not false. Training therefore constructs negatives under assumptions, and evaluation must distinguish missing knowledge from verified contradictions.

### Scoring framework

A knowledge-graph embedding model assigns a score to \((h,r,t)\), then ranks corrupted heads or tails. Score direction, candidate filtering, loss, and constraints must be aligned before comparing model families.

### TransE

TransE models a relation as a translation, seeking \(h+r\approx t\). It is intuitive for compositional paths but struggles when one head maps to many valid tails that cannot all occupy the same point.

### DistMult

DistMult uses a diagonal bilinear score and is efficient, but its score is symmetric in head and tail. It therefore cannot faithfully represent antisymmetric relations without help from data artifacts.

### ComplEx

ComplEx moves embeddings into the complex domain and uses conjugation to break head-tail symmetry. The additional degrees of freedom represent asymmetric relations while retaining a compact bilinear computation.

### RotatE

RotatE represents relations as rotations in complex space. Rotation composition and inversion naturally model several relation patterns, subject to modulus constraints and the chosen distance score.

### Negative sampling

Corrupting a head or tail may accidentally create another true triple. Typed candidates are harder and more realistic than arbitrary entities, but they define a different training distribution and must be documented.

### Filtered evaluation

When ranking a corrupted candidate, filtered metrics remove other known true triples so the model is not penalized for ranking a valid fact above the held-out one. The filter set and candidate vocabulary must use an explicit protocol.

### Leakage and inverse edges

Random triple splits can place an inverse or duplicate fact in training, making the test answer nearly explicit. Group related triples or split by time/entity when the intended claim requires genuine generalization.

### Acceptance protocol

Evaluate MRR and Hits@K with raw and filtered diagnostics, relation-cardinality buckets, and type-constrained candidates. Keep tiny symmetry, inverse, composition, and one-to-many examples to verify each scoring function's claimed behavior.

## Implementation and evidence boundaries

### Embedding constraints

Norm constraints, margins, score direction, and regularization affect optimization and must be aligned in comparisons.

### Type-constrained candidates

Typed corruption creates harder, more realistic negatives but changes the ranking candidate universe.

### Relation cardinality

Break results into one-to-one, one-to-many, many-to-one, and many-to-many relations.

### Calibration

Ranking scores are not probabilities. Thresholded fact acceptance needs separate calibration and precision-recall validation.

### Inductive boundary

Classic entity/relation lookup models are transductive. Filtered MRR on a seen vocabulary does not establish zero-shot generalization.

### Final KG acceptance

Manually score a small set of triples under each decoder, including an antisymmetric pair and a one-to-many relation. Confirm target filtering and inverse-edge grouping, then attach every result to its entity vocabulary, candidate universe, and split rule.

## Self-study checkpoint

Take one minimal graph or set of triples and write down the input, invariances retained by the model, output, and evaluation. If two examples that should differ remain identical at every step, you have located an expressive gap in the encoder.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 10 official slides](https://web.stanford.edu/class/cs224w/slides/10-kg.pdf)
