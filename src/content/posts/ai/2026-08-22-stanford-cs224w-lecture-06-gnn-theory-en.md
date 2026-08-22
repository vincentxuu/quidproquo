---
title: "Stanford CS224W Lecture 6: Theory of GNNs: The WL Test, GIN, and Expressive Limits"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 7
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 6, covering What distinguishability means, The Weisfeiler–Lehman test, An upper bound for message passing while documenting unavailable classroom material."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 6, based only on that offering's official slides rather than the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-06-gnn-theory)

This is **Lecture 6 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-10-09. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and [official slides](https://web.stanford.edu/class/cs224w/slides/06-theory.pdf); the slides credit Jure Leskovec, Charilaos Kanatsoulis, and the course team.

## Materials and gaps

Public materials include the slides and optional readings listed on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable, so this article does not reconstruct them. The public 2021 videos are not evidence for a 2025 lecture.

## Complete lecture agenda

### 1. What distinguishability means

The theoretical question is not merely whether a model fits, but whether two different local structures must receive the same representation. Once they collapse to one vector, no downstream prediction head can recover the distinction.

### 2. The Weisfeiler–Lehman test

The one-dimensional WL test repeatedly hashes a node's current color together with the multiset of neighbor colors. Different color histograms certify different graphs, but matching histograms do not prove isomorphism.

### 3. An upper bound for message passing

Standard message-passing GNNs are no more discriminative than one-dimensional WL. A non-injective aggregator can be strictly weaker: mean loses multiplicity, while max discards most frequency information.

### 4. GIN and injective aggregation

GIN combines sum aggregation with an MLP to approximate an injective map over bounded multisets. It approaches the theoretical ceiling but does not distinguish graphs that WL itself cannot separate.

### 5. Over-smoothing and depth limits

More layers expand the receptive field but can also make node states increasingly similar. Track validation metrics and distances between node embeddings rather than assuming deeper is always stronger.

## Deep theory agenda

### The distinguishability problem

For a node encoder, expressivity asks whether distinct rooted neighborhoods map to distinct representations; for a graph encoder, it asks whether node encoding plus readout separates distinct graphs. This is not simply a question of parameter count. If the first aggregation maps two different multisets to the same value, no deeper MLP can recover the discarded multiplicity or structure.

### Graph isomorphism and WL

Graphs that differ only by a node permutation are isomorphic and should receive the same graph-classification output. Exhaustively checking all \(n!\) permutations is impractical. WL color refinement is efficient but incomplete: initialize node colors, then repeatedly encode each node's own color and the multiset of neighbor colors. Different color histograms prove the graphs differ; equal histograms mean only that WL failed to separate them, not that they are isomorphic.

### Aligning WL with message passing

A message-passing layer likewise maps a center state and neighbor multiset to a new state. With identical initial features and identical incoming multisets at every round, a shared update produces identical embeddings. Thus ordinary neighborhood aggregation has a one-dimensional-WL upper bound, and a non-injective aggregator can be weaker still.

### What mean and max discard

Mean cannot distinguish multisets with the same proportions but different sizes—for example, one neighbor from two identical copies. Max retains only the largest value in each coordinate, losing multiplicity and every non-maximal element. Sum has a better chance of retaining counts on bounded multisets when paired with a suitable element mapping, but it is not automatically injective without that transform.

### The GIN update

GIN sums neighbor states, adds the center state scaled by \(1+\epsilon\), and applies an MLP. Epsilon may be fixed or learned so that the center remains distinguishable from its neighbors. The goal is an approximately injective multiset update that reaches the one-dimensional-WL ceiling—not a solution for regular graphs or other pairs that WL cannot distinguish.

### Graph readout

Node-level power does not automatically become graph-level power. Mean readout may collapse graphs of different sizes that share a node-state distribution, whereas sum can retain counts. GIN commonly combines node summaries from several layers because each layer represents a different hop scale. The encoder, chosen layers, and readout jointly determine graph distinguishability.

### Over-smoothing

Repeated propagation can make node states converge until mostly low-frequency graph signal remains. This training and representation dynamic differs from a WL expressivity bound: an architecture may be able to separate two inputs in principle while its trained embeddings fail to preserve the difference. Useful diagnostics include pairwise cosine similarity, class separation, and depth ablations, not training loss alone.

### Over-squashing

Information from exponentially many distant nodes may be compressed into one fixed-width vector. Even when K layers make a dependency reachable, a narrow graph bottleneck can still impede information and gradients. Width, rewiring, global attention, and positional signals address different mechanisms; first diagnose dependency distance and graph bottlenecks before choosing one.

### Using theoretical counterexamples

Counterexamples belong in tests, not only proofs. Construct tiny graphs that WL cannot distinguish or that mean aggregation collapses, give nodes identical features, and print every layer's embeddings. If a library model unexpectedly separates them, check for node IDs, random features, positional encodings, or normalization differences: any of these changes the theoretical setting.

### Acceptance protocol

Deliver an expressivity audit stating the initial-feature assumption, whether aggregation is injective, how the center state is retained, depth, readout, theoretical ceiling, and one counterexample. Under equal parameter budgets, compare mean, max, and sum-plus-MLP across several seeds and graph sizes. Keep the conclusion within the tested distribution; “reaches the WL ceiling” never means “identifies every graph.”

## Implementation and evidence boundaries

### Initial-feature assumptions

WL/GNN comparisons must state initial colors or features. IDs, degrees, and random features may break symmetries before the architecture acts.

### Local versus global limits

Finite-depth GNNs may fail before WL stabilizes. Separate receptive-field limits, aggregator collisions, and WL counterexamples.

### Existence versus optimization

An injective function may exist without SGD finding it at finite width and precision. Controlled counting tasks separate training failure from architectural impossibility.

### Complexity

GIN remains sparse-message-passing scale, while higher-order tuple models grow much faster. Expressivity must be compared with computational cost.

### Claim boundary

Under stated initialization and injective aggregation/readout assumptions, GIN reaches one-dimensional WL power. It does not solve graph isomorphism universally.

### Final theoretical acceptance test

Build four controlled pairs: multisets that mean collapses but sum separates; long paths whose difference lies beyond the chosen depth; graphs WL can separate but training fails to learn; and regular graphs that one-dimensional WL itself cannot separate. Save initial colors, WL colors at every round, GNN embeddings at every layer, and the final graph readout. This separates aggregator collision, receptive-field limits, optimization failure, and the theorem's ceiling. Add width, depth, and seed ablations, and attach every conclusion to its assumptions about initial features, precision, readout, and graph family.

## Self-study checkpoint

Run one additional precision check with integer features designed to produce nearby sums. Compare the same sum-plus-MLP computation in float32 and float64, and record whether normalization makes distinct neighborhoods difficult to separate. This does not refute WL theory; it exposes the gap between exact injectivity and finite precision or width. For counting tasks, test count range and out-of-distribution graph sizes, and report “theoretically distinguishable” separately from “distinguished by this training run.”

Take one minimal graph or set of triples and write down the input, invariances retained by the model, output, and evaluation. If two examples that should differ remain identical at every step, you have located an expressive gap in the encoder.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 6 official slides](https://web.stanford.edu/class/cs224w/slides/06-theory.pdf)
