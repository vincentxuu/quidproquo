---
title: "Stanford CS224W Lecture 5: GNN Augmentation and Training: Co-designing Data, Tasks, and Models"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 6
tldr: "A slide-grounded reconstruction of Fall 2025 Lecture 5, covering Graph-data augmentation, Feature and structural augmentation, Supervision and loss while documenting the classroom material unavailable to self-learners."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 5, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-05-gnn-augmentation-training)

This is **Lecture 5 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-07. This reconstruction uses the [course schedule](https://web.stanford.edu/class/cs224w/) and the [lecture slides](https://web.stanford.edu/class/cs224w/slides/05-GNN3.pdf); the slides credit Jure Leskovec and the course team.

## Materials and gaps

Public materials include 05-GNN3.pdf and the readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Graph-data augmentation

A GNN input is not necessarily one fixed adjacency matrix. We can add node features, introduce a virtual node, sample subgraphs, or perturb edges and attributes. Every augmentation writes an assumption into the data.

### 2. Feature and structural augmentation

When features are missing, constants, degree features, or learned embeddings are options; structural augmentation can introduce long-range channels. None is a free improvement: changing task-defining edges can create incorrect supervision.

### 3. Supervision and loss

The objective must match the prediction scale. Node classification computes loss on labeled nodes, link prediction needs negative edges, and graph classification pools node states into a graph representation.

### 4. Graph classification and pooling

Pooling may be a global sum or mean, or a learned hierarchy. DiffPool jointly learns node states and soft cluster assignments, at the cost of additional parameters and computation.

### 5. Training pipeline and failure modes

A reliable pipeline separates train, validation, and test data and avoids features computed from the full graph when they leak labels. Establish a no-augmentation baseline, then add one change at a time and record random seeds.

## Slide-by-slide expansion

### Ask what is missing before augmenting

A graph model may lack node features, edge features, long-range channels, supervision, or graph-level representation. Degree features, virtual nodes, edge dropping, and subgraph sampling address different gaps and make different assumptions.

### Feature augmentation

Options include constants, degree encodings, spectral or random-walk statistics, and learned ID embeddings. Constants preserve inductive use but cannot break every symmetry; ID embeddings break symmetry but sacrifice unseen-node generalization. Compute normalization statistics from training data only.

### Structural augmentation

Self-loops retain center information, reverse edges support directed propagation, virtual nodes create global channels, and rewiring shortens paths. These change topology. Never restore a held-out link as an input augmentation or create chemically invalid molecular edges.

### Data augmentation and invariance

Edge dropping, feature masking, and subgraph sampling can regularize or create contrastive views only when label semantics are preserved. State the invariance hypothesis before applying a transformation.

### Prediction heads and supervision

Node, edge, and graph tasks require different heads and losses. Match metrics to class imbalance and ranking objectives, and choose thresholds on validation data rather than test data.

### Graph-level pooling

Sum retains graph-size signal, mean removes scale, and max records strongest activations. Hierarchical pooling learns clusters. Start with simple readouts and connect the choice to whether labels depend on counts or presence.

### The two outputs of DiffPool

DiffPool learns node representations Z and a soft assignment S, producing coarser features S-transpose Z and adjacency S-transpose A S. Check task metrics, assignment collapse, cluster count, and auxiliary regularizers.

### Correct training order

Split first, derive training-only statistics and negatives, establish a no-augmentation baseline, and add one transformation at a time. Early stopping uses validation only. Save seeds, split IDs, best epochs, metrics, and wall-clock time.

### Neighbor sampling and mini-batches

Seed-based mini-batches sample layer-wise neighborhoods. The sampler changes the observed graph distribution, and local relabeling must remain aligned with edge labels and targets.

### Debug checklist

Overfit a tiny graph, permute labels to detect leakage, disable stochastic components for a deterministic baseline, enable augmentations one by one, and visualize transformed examples to verify label preservation.

## Training and augmentation cross-audit

### 1. Record fit, apply, and randomness phases

For every transformation, state when its parameters are fit, when it is applied, and in which phase randomness is sampled. A transform learned from the whole graph can leak information even if its output looks like an ordinary input feature.

### 2. Structural features can leak held-out edges

Degree, shortest-path, and spectral features may look unsupervised but still encode test edges when computed before the split. Recompute them from the permitted training graph, or explicitly treat the task as transductive and narrow the claim.

### 3. Negative sampling is augmentation too

The negative sampler manufactures training examples and therefore defines part of the learning distribution. Record its candidate universe, degree bias, rejection rules, and ratio; an easy sampler can inflate apparent progress without improving ranking on realistic candidates.

### 4. Validation alone drives selection

Early stopping and hyperparameter selection may inspect validation performance, never the final test set. Save the chosen checkpoint and selection rule before one test evaluation so repeated test probing does not become hidden supervision.

### 5. DiffPool clusters have no fixed identity

DiffPool assignments are soft and seed-dependent. Cluster index three in one run need not represent cluster index three in another. Evaluate task performance, assignment entropy, and structural consistency without giving raw cluster IDs a stable semantic interpretation.

### 6. Preserve the complete experiment row

For each run, save the graph version, split hash, feature and structural augmentations, sampler, encoder, pooling method, loss, optimizer, seed, validation and test scores, peak memory, time, and failure note. This row is the minimum evidence needed to attribute a result to augmentation rather than an untracked pipeline change.

## Where this lecture leads

The concepts from Lecture 5 are composed in later lectures. Keep one small graph, a notation sheet, and a baseline. For every new model, identify whether it changes the data, message, aggregation, update, objective, or evaluation.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 5 official slides](https://web.stanford.edu/class/cs224w/slides/05-GNN3.pdf)
