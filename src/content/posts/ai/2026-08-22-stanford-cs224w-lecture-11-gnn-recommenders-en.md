---
title: "Stanford CS224W Lecture 11: GNNs for Recommender Systems: From Collaborative Filtering to LightGCN"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 12
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 11, covering Graph formulation of recommendation, The matrix-factorization baseline, Message passing in NGCF while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 11, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-11-gnn-recommenders)

This is **Lecture 11 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-28. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/11-recsys.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. Graph formulation of recommendation

Recommendation data naturally forms a user–item bipartite graph: interactions are edges, and ratings, clicks, or purchases may become edge signals. The usual task ranks unseen items for a user rather than classifying one edge in isolation.

### 2. The matrix-factorization baseline

Matrix factorization learns one vector per user and item and scores preference with an inner product. It remains an essential baseline because many graph recommenders ultimately use the same scoring function.

### 3. Message passing in NGCF

NGCF propagates user and item embeddings along interaction edges, adding higher-order collaborative signals. Each layer reaches another hop but also adds transformations, nonlinearities, and training cost.

### 4. LightGCN's simplification

LightGCN removes feature transformations and activations, retaining normalized neighborhood aggregation and combining embeddings across layers. The simplification suggests neighborhood propagation may matter more than the full generic GNN toolkit for recommendation.

### 5. Large-scale sampling and ranking evaluation

Large graphs require neighbor or edge mini-batch sampling, often with pairwise ranking loss. Fix the candidate set, negative-sampling protocol, and temporal split before comparing Recall@K or NDCG.

## Deep lecture agenda

### Bipartite graph formulation

User-item interactions form a bipartite graph whose edges cross node types. A click or purchase is observed positive feedback, while no interaction is not automatically negative; define the observation window, candidate catalog, and ranking time before constructing examples.

### Matrix factorization

MF learns user and item vectors and scores affinity by their inner product. It is a zero-hop ID-embedding baseline: strong for collaborative signal but unable to propagate multi-hop structure directly, and highly sensitive to biases, regularization, and negative sampling.

### The BPR objective

Bayesian Personalized Ranking asks an observed item for a user to outrank a sampled unobserved item. The sampler defines task difficulty, so uniform, popularity-based, and exposure-aware negatives are not interchangeable implementation details.

### NGCF propagation

NGCF exchanges embeddings across user-item edges and adds transformations, nonlinearities, and element-wise interactions. More layers expose higher-order collaborative connectivity but also add noise and cost, which requires a depth ablation.

### LightGCN simplification

LightGCN removes feature transformations and activations, retains normalized neighborhood aggregation, and combines embeddings across layers. Its hypothesis is that ID propagation is the essential collaborative-filtering component and generic GNN nonlinearities may only add parameters and overfitting.

### Normalization

User activity and item popularity create highly skewed degrees. Symmetric normalization scales an edge by both endpoints; replacing it with mean or raw sum changes popularity bias, so report results by activity and popularity bucket.

### Layer combination

Using only the last layer risks over-smoothing. Combining layer 0 through K preserves direct ID preference together with different-hop signals; whether layer 0 is included must be reported because it is the MF-like component.

### Large-scale sampling

Web-scale graphs require neighbor sampling, walk sampling, or partitioned training. Keep propagation sampling separate from the candidate sampler used by the ranking loss and evaluation, since they approximate different distributions.

### Evaluation

Recall@K measures whether relevant items enter the top K, while NDCG@K weights their positions. Ranking against sampled negatives is easier than all-item ranking, and temporal splits better approximate serving than random interaction splits; protocols are not directly comparable.

### Cold start and acceptance

A pure-ID LightGCN has no embedding for a new user or item. Side features create a different, potentially inductive model. Compare popularity, MF, NGCF, and LightGCN with identical dimension, BPR sampler, candidates, time split, and budget, then report warm/cold and popular/long-tail buckets.

## Implementation, evaluation, and acceptance

### Exposure bias

An unobserved item may simply never have been shown. Uniform catalog negatives are often much easier than candidates produced by a real retrieval stage, so disclose exposure assumptions and add popularity-matched negatives as a sensitivity test.

### Edge weights and interaction types

Views, cart additions, and purchases may be separate relations or one weighted edge. The latter assumes behaviors differ only in strength; the former learns separate transformations. When actions form one event chain, remove all future-linked actions together across a time split.

### Serving

LightGCN embeddings can be precomputed and served through approximate inner-product retrieval. Refresh cadence controls graph staleness, while per-query multi-hop propagation has a different latency profile; report embedding refresh, index build, and online scoring costs.

### Diversity

Optimizing relevance alone may concentrate recommendations on popular items. Coverage, novelty, diversity, and business constraints are outside a single Recall@K. Claims from the deck's collaborative-ranking setting must remain “predicts held-out interactions,” not overall product quality.

### Leakage tests

Duplicate user interactions, adjacent session events, and updated item metadata can cross a split. Sort by timestamp, remove information after the validation or test event, and compute degree features only from the training window.

### Acceptance

On a three-user, four-item graph, hand-compute one LightGCN layer and one BPR pair. Remove a test edge and recompute to prove it never entered the embedding; the implementation must match this trace before scaling up.

## Self-study checkpoint

The final report should include both all-item and sampled ranking. If only sampled evaluation is feasible, freeze the negatives and state the candidate count. Also report layer-0-only, each individual propagation layer, and their combination. If layer 0 wins, LightGCN has effectively reduced to matrix factorization and the conclusion should favor the simpler baseline.

Build a popularity stress test with a few dominant training items and both popular and long-tail positives at test time. Compare MF and LightGCN under several negative samplers, inspect whether embedding norm tracks degree, shift all interactions forward in time to test future-data guards, and measure retrieval latency, index freshness, and new-item fallback on a fixed candidate set. Save one complete ranking trace from history and sampled neighborhood through layer embeddings, scores, and filtering.

Finally, constrain the interpretation to the interaction semantics. Predicting clicks is not satisfaction, and predicting purchases is not long-term value. Content, prices, or business rules require separate feature-availability and intervention-bias analysis; offline link prediction alone is not a causal recommendation claim.

Write down the prediction unit, information cutoff time, negative set, and metric before running a model. Graph leakage often travels through another relation or a future edge and is invisible in a successful program run.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 11 official slides](https://web.stanford.edu/class/cs224w/slides/11-recsys.pdf)
