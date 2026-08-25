---
title: "Stanford CS103 Lecture 10: Walks, Graph Complements, and the Pigeonhole Principle"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, graph-theory, pigeonhole-principle, discrete-mathematics]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 12
tldr: "Starting with walks, paths, cycles, and components, this lecture proves that a graph or its complement is connected and develops the pigeonhole principle through degrees and monochromatic triangles."
description: "A deck-faithful guide to Stanford CS103 Graph Theory Part Two: reachability, graph complements, pigeonhole arguments, and an introduction to Ramsey theory."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-11-graphs-2)

This is article 12 in the [Stanford CS103 Guide](/series/stanford-cs103), corresponding to **Spring 2026 Lecture 10 (April 22, 2026)**. Its official title is **Graph Theory, Part Two**, and its agenda moves through walks, paths, and reachability; graph complements; and the pigeonhole principle. The public page names Cynthia Bailey Lee and Alex Aiken as the course team but does not identify a speaker for each meeting, so this guide does not guess one.

The preceding lecture defined a graph as `G = (V, E)`, where `V` is a node set and each member of `E` is an unordered pair of distinct nodes. This lecture asks dynamic questions: what counts as moving through a graph, when can one node reach another, what happens when all nonedges become edges, and how can “more objects than places” force a mathematical structure?

## Adjacency is the basis of every movement definition

If `{u, v} ∈ E`, nodes `u` and `v` are adjacent. This recap becomes the local test for every sequence that follows: instead of judging the whole drawing at once, check whether each consecutive pair of nodes has an edge.

The deck first uses a three-letter-word graph and then a western US city-and-road graph. Geometric proximity in the picture does not create adjacency; only membership in `E` does. Two cities may look close on a map but need not be adjacent in the abstract graph. Formalization turns that visual intuition into a testable condition.

## A walk is a movement sequence that permits repetition

A walk in `G = (V, E)` is a sequence of one or more nodes `v₁, v₂, …, vₙ` in which every two consecutive nodes are adjacent. Its length is `n - 1`, because length counts traversed edges rather than listed nodes. A valid sequence visiting eleven cities therefore has length ten.

Nodes and edges may repeat, so a walk may advance, backtrack, and revisit a location. A sequence containing just one node is also a length-zero walk. There is no consecutive pair to violate the adjacency requirement, so the requirement is vacuously true. This is a deliberate consequence of the definition, not a loophole.

## Closed walks, paths, and cycles are different objects

A closed walk starts and ends at the same node. By the course convention, it cannot have length zero, so a one-node “staycation” is not a closed walk. A path is a walk that repeats no node. A cycle is a closed walk that repeats no nodes or edges except for its identical first and last node.

These restrictions become stronger, but they do not form a simplistic chain: an ordinary path has different endpoints, while a cycle must return to its start. To classify a sequence, first check consecutive adjacency, then endpoints, then repeated nodes and edges. Judging whether a picture merely looks circular can miss a repeated interior node.

The deck also lists useful facts that may be taken as given: a walk from `u` to `v` exists exactly when a path does, and every cycle has length at least three and contains at least three nodes. The first fact is intuitive: whenever a walk repeats a node, remove the detour between two occurrences and continue until no node repeats.

## Reachability turns paths into a relation between nodes

A node `v` is reachable from `u` if there is a path from `u` to `v`. In an undirected graph, reversing a path is still a path, so reachability is symmetric. The deck's road-closure example emphasizes that reachability is not visual closeness: one must actually produce a sequence satisfying the path definition.

A graph is connected if every pair of distinct nodes is mutually reachable. A proof of connectedness cannot show only a few representative routes; it must handle arbitrary `u ≠ v`. A counterexample needs only one pair with no path. This difference in quantifiers drives the complement proof.

## A connected component is a maximal mutually reachable group

A connected component is a maximal set of mutually reachable nodes. Here maximal means that no other node can be added while preserving pairwise reachability, not that this component must have maximum size among all components.

Every node belongs to exactly one connected component, and a graph is connected exactly when it has one component. We can therefore view a disconnected graph as separate regions. Nodes in different components cannot be adjacent: if they had an edge, that edge itself would be a path and the regions would have to be one component.

## A graph complement turns every nonedge into an edge

For an undirected graph `G = (V, E)`, its complement is `Gᶜ = (V, Eᶜ)`, where

`Eᶜ = {{u, v} | u ∈ V, v ∈ V, u ≠ v, and {u, v} ∉ E}`.

Thus every pair of distinct nodes is adjacent in exactly one of `G` and `Gᶜ`. Taking a complement does not complement the node set, add self-loops, or remove isolated nodes. It flips membership for all possible two-element unordered pairs over the same `V`.

## Theorem: at least one of G and Gᶜ is connected

To prove `G is connected ∨ Gᶜ is connected`, the deck rewrites the disjunction as a useful implication. If `G` is connected, the claim is done. Otherwise, prove `Gᶜ` connected. In short, prove `G disconnected → Gᶜ connected`.

Assume `G` is disconnected and choose arbitrary distinct nodes `u, v`. If they lie in different components, `{u, v} ∉ E`, so `{u, v} ∈ Eᶜ`; the one-edge path `u, v` works. If they lie in the same component, choose a node `z` from another component, which exists because `G` is disconnected. Both pairs `u,z` and `z,v` cross components, so both are edges of `Gᶜ`. The sequence `u,z,v` is a length-two path.

The cases cover every distinct `u, v`, proving `Gᶜ` connected. The reusable idea is a construction: use one hop when the original endpoints are in different regions, and bridge through a third node when they are in the same region. Drawing one example complement would not suffice because the theorem quantifies over every graph and every node pair.

## The pigeonhole principle forces a collision

The pigeonhole principle says that if `m` objects are distributed among `n` bins and `m > n`, some bin contains at least two objects. In an application, the essential work is not naming the theorem; it is identifying the objects, bins, and assignment rule.

For example, San Francisco has more residents than possible calendar birthdays, so some residents share a birthday. If the requested value included a birth second, however, the bins would be different. The theorem operates on the mapping we define and cannot repair an underspecified model.

## The finite-set formulation exposes the contradiction

In set language, if finite sets `A` and `B` satisfy `|A| > |B|`, there is no injective function `f: A → B`. The elements of `A` are objects, the elements of `B` are bins, and injectivity says that each bin receives at most one object.

For a contradiction proof, assume such an injection exists. Since each `b ∈ B` has at most one preimage, `A` can have no more elements than `B`, giving `|A| ≤ |B|` against the premise. This formulation connects the physical bin metaphor to functions and can be reused directly in finite-cardinality arguments.

## Equal degrees require excluding two incompatible extremes

In a simple undirected graph, the degree of a node `v` is the number of nodes adjacent to it. With `n ≥ 2` nodes, the apparent degree options are `0, 1, …, n - 1`: exactly `n` choices, so at first there is no collision between `n` nodes and `n` bins.

The key is that degrees zero and `n - 1` cannot both occur. If `u` has degree zero, it is adjacent to nobody. If another node `v` has degree `n - 1`, it must be adjacent to every other node, including `u`, a contradiction. Therefore the realized degree values are drawn either from `0..n-2` or from `1..n-1`, only `n - 1` values. Assign each of the `n` nodes to its degree bin, and two nodes must share a degree.

The deck also gives a contradiction proof. If all node degrees were distinct, `n` nodes using `n` candidate values would use every value exactly once, including both zero and `n - 1`, which is impossible. The first proof more explicitly shows how to repair the choice of bins.

## The generalized pigeonhole principle quantifies crowding

If `m` objects are distributed among `n > 0` bins, the generalized principle guarantees that some bin has at least `⌈m/n⌉` objects and some bin has at most `⌊m/n⌋`. The maximum load cannot be below the rounded-up average, and the minimum load cannot exceed the rounded-down average.

For the first claim, suppose every bin has fewer than `m/n` objects. Let `xᵢ` be the number in bin `i`. Then `m = x₁ + ⋯ + xₙ < m/n + ⋯ + m/n = m`, producing the impossible statement `m < m`. Since every `xᵢ` is an integer, at least `m/n` means at least `⌈m/n⌉`. The ceiling simply translates a real-valued average into an integer threshold.

## Friends and strangers: R(3) ≤ 6

At a party of six people, each pair are either friends or strangers. Model the people as a complete graph `K₆`, color friendship edges blue and stranger edges red, and the claim becomes: every such coloring contains a monochromatic triangle.

Choose any node `x`. It has five incident edges in only two colors, so the generalized pigeonhole principle guarantees at least `⌈5/2⌉ = 3` of one color. Without loss of generality, let the edges from `x` to `r,s,t` be blue. If any of `{r,s}`, `{r,t}`, or `{s,t}` is blue, it joins two edges back to `x` to form a blue triangle. Otherwise all three are red and form a red triangle on `r,s,t`.

The proof splits cleanly: first use pigeonhole to force structure, then ask whether at least one internal edge is blue. Either answer constructs the required witness.

## Ramsey's theorem says large-scale disorder cannot be complete

The deck places the previous result in Ramsey theory. For each natural number `n`, there is an `R(n)` such that every red-blue edge coloring of a clique with at least `R(n)` nodes contains a red `n`-clique or blue `n`-clique, while below `R(n)` there is a coloring avoiding both.

This lecture establishes `R(3) ≤ 6`. This proof alone is not a proof of the general Ramsey theorem, nor does an upper bound by itself establish minimality. The broader viewpoint is that a sufficiently large system must contain some regular substructure even when its local arrangement looks disordered.

## Turn the definitions and proofs into executable checks

Use this sequence to test your understanding:

1. Given a node sequence, write down each required edge, decide whether it is a walk, then separately test closed walk, path, and cycle.
2. Given a disconnected graph, label its components and construct complement paths for one same-component pair and one cross-component pair.
3. For a pigeonhole problem, name the objects, bins, and assignment before choosing the ordinary or generalized theorem.
4. In the equal-degree theorem, do not merely assert that there are `n - 1` degree values; explain why zero and `n - 1` cannot coexist.
5. In the six-person proof, say that pigeonhole applies to five incident edges placed into two color bins, not directly to six nodes.

The common core is quantifiers and witnesses: connectedness requires arbitrary node pairs, existence of a path requires constructing one, and pigeonhole applications require an explicit assignment.

## Further examples and the boundary of this lecture

The final slides list Sperner's lemma, the mountain-climbing theorem, Brouwer's fixed-point theorem, Mirsky's theorem, and the fact that every positive integer has a nonzero multiple written only with zeroes and ones. They illustrate the reach of pigeonhole-style reasoning; they are not presented as results proved in this lecture.

The deck also points interested readers toward Math 107 on graph theory and Math 108 on combinatorics. The immediate goal remains operational: use the definitions, reproduce the two-case complement proof, and model problems correctly as objects and bins rather than memorize every extension.

## Source limits and reading boundary

The [official lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/) and [complete slide deck](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/Lecture%20Slides.pdf) are public and support the agenda, definitions, and full proofs summarized here. The recording and transcript are restricted to Canvas/Panopto, so this article does not reconstruct spoken transitions, student questions, or live poll results, and it does not present extension theorems as if the class proved them.

## Update log

- 2026-08-22: Rebuilt the bilingual article item by item from the complete official deck, covering walks, reachability, graph complements, the pigeonhole principle, and Ramsey theory.

## References

- [Stanford CS103 Spring 2026 Lecture 10: Graphs, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/)
- [Official Lecture 10 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/10/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs on Discrete Structures](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs_on_discrete_structures)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
