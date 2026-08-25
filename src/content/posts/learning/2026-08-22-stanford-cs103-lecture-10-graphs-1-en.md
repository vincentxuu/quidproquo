---
title: "Stanford CS103 Lecture 9: Graphs, Part I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 11
tldr: "This lecture moves from the formal definitions of graphs and digraphs to independent sets, vertex covers, and their complement relationship."
description: "A deck-aligned guide to graphs, digraphs, independent sets, vertex covers, and the complement equivalence theorem."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-10-graphs-1)

This is article 11 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 9, Spring 2026 (2026-04-20)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/09/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/09/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Graphs, Part I**. The lecture abstracts a graph from “objects and their relationships,” then uses two placement problems to motivate vertex covers and independent sets. Its central result is an iff theorem: a set `C` is a vertex cover exactly when its complement `V − C` is an independent set.

## Graphs compress domain stories into relationship structures

Highway maps, chemical bonds, and social relationships come from different domains, yet share one skeleton: a collection of objects and links between them. Graph theory deliberately discards the objects' physical nature and the links' domain-specific meaning, retaining only which objects are connected. That is not indifference to reality; it is a decision about which information the current argument needs.

A graph contains nodes (also called vertices) and edges (the slides also mention arcs). Dots and lines are merely a representation; the mathematical object is not the picture. A vertex might be a city, molecule, word, or job, while an edge might represent a road, bond, one-step transformation, or conflict. When reasoning depends only on connectivity, the same definitions work across these domains.

The semantics must still be fixed before abstraction. What counts as a vertex? Under exactly what condition is an edge added? If “knows” and “trusts” are both vaguely treated as a link, the resulting graph may answer no precise question. Formalization does not choose the semantics for us; it makes us choose them before set-theoretic reasoning begins.

## Formal definitions of undirected and directed graphs

An undirected graph is an ordered pair `G = (V, E)`. Here `V` is a set of vertices, and `E` is a set of edges, each an unordered two-element set `{u, v}` drawn from `V`. Since sets are unordered, `{u, v} = {v, u}`. An edge therefore has no preferred start or endpoint. A bidirectional road is a natural example.

A directed graph, or digraph, is also `G = (V, E)`, but each edge is an ordered pair `(u, v)` of vertices. In general `(u, v)` differs from `(v, u)`. It can represent page `u` linking to page `v`, account `u` following account `v`, or state `u` transitioning to state `v`. Direction is part of the edge object, not decoration on a drawing.

Do not conflate the two levels of order. The outer `G = (V, E)` is ordered so that the vertex set and edge set have distinct roles; the inner undirected edge `{u, v}` is unordered. When reading a formal definition, check at every level whether the delimiters mean an ordered pair or a set. A one-character difference changes the legal inputs.

## Validity checks beat guessing from a picture

To decide whether `G = (V, E)` is a valid undirected graph, inspect every edge: is it a set of exactly two distinct vertices? Do both endpoints belong to `V`? Has an ordered pair `(u, v)` been used where an unordered edge is required? Has a singleton or three-element set been placed in `E`? A drawing that looks network-like does not make its set representation valid.

For a digraph, each edge must instead be an ordered pair in `V × V`. Vertices can be almost any mathematical objects, but an edge cannot point to something outside `V`. This type-checking habit continues into automata: first establish that an object satisfies the definition, then reason about its properties.

The same graph can be drawn with vertices rearranged, curved edges, or crossing line segments. If `V` and `E` do not change, neither does the graph. A crossing is not a new vertex unless it appears in `V`. Proofs must follow sets and quantifiers rather than layout.

## Self-loops expose the difference between edge types

An edge from a vertex to itself is a self-loop. Under this lecture's undirected-graph definition, an edge is a set `{a, b}` containing two distinct elements. The expression `{v, v}` collapses to the singleton `{v}` and therefore fails the definition. Undirected graphs generally exclude self-loops here as a consequence of the definition, not an extra rule to memorize.

Directed edges are ordered pairs, and `(v, v)` is a valid member of `V × V`. Digraphs therefore generally allow self-loops unless a problem says otherwise. This example trains us to derive consequences from the data type instead of assuming that anything drawable must be legal.

The slides also establish a convention: unless otherwise specified, “graph” means “undirected graph.” A problem that merely says graph should not be given directions silently; it will say directed graph or digraph when direction matters. This keeps terms such as edge, cover, and adjacent unambiguous.

## Vertex covers: choose at least one endpoint of every edge

The first motivating story places park rangers at trail junctions so that a hiker anywhere on a trail can see a ranger at an endpoint. The abstraction is “choose at least one endpoint of every edge.” For `G = (V, E)`, a vertex cover is a set `C ⊆ V` satisfying

```text
∀u ∈ V. ∀v ∈ V. ({u, v} ∈ E → (u ∈ C ∨ v ∈ C)).
```

The disjunction `∨` matters: at least one endpoint is in `C`, and both may be. A cover does not choose exactly one endpoint and need not contain every vertex. An isolated vertex creates no covering obligation. Also, `C = V` is always a vertex cover, though usually not a small one.

The implication matters too. The obligation applies only when `{u, v} ∈ E`; a pair that is not an edge makes the antecedent false. A direct verification procedure scans `E` and checks that no edge has both endpoints in `V − C`.

## Independent sets: chosen vertices are pairwise nonadjacent

The second story places California condor nests. Since condors are territorial, two mutually visible candidate sites cannot both be chosen. The abstraction selects vertices with no edge between any two chosen ones. A set `I ⊆ V` is independent when

```text
∀x ∈ I. ∀y ∈ I. {x, y} ∉ E.
```

Independent does not mean disconnected from the whole graph. A vertex in `I` may have many neighbors in `V − I`; only edges internal to `I` are forbidden. The empty set and every singleton are automatically independent because they cannot contain two adjacent chosen vertices. Being independent is also different from being a largest independent set.

One can check every pair inside `I`, or scan all edges and ensure no edge has both endpoints in `I`. The second wording is already close to the failure condition for a vertex cover, making the complement relationship visible.

## Complements connect the two placement problems

The theorem says: let `G = (V, E)` be a graph and `C ⊆ V`. Then `C` is a vertex cover of `G` if and only if `V − C` is an independent set of `G`.

Partition the vertices into `C` and the outside set `V − C`. If `C` covers every edge, no edge can have both endpoints outside, so the outside set has no internal edge. Conversely, if outside vertices are pairwise nonadjacent, an edge cannot have both endpoints outside, so every edge has at least one endpoint in `C`.

An iff theorem cannot rest on this picture alone. A formal proof needs two directions. The slides prove the first direction as a direct lemma and prove the contrapositive of the other as a second lemma. This revisits universal and existential quantifiers, negation, arbitrary choice, and witnesses.

## First direction: a vertex cover has an independent complement

Assume `C` is a vertex cover and prove `V − C` is independent. Choose arbitrary `x, y ∈ V − C`; the goal is `{x, y} ∉ E`. Membership in the complement gives `x ∉ C` and `y ∉ C`.

Suppose for contradiction that `{x, y} ∈ E`. Since `C` is a vertex cover, this edge has at least one endpoint in `C`, so `x ∈ C ∨ y ∈ C`. That contradicts `x ∉ C ∧ y ∉ C`. Hence `{x, y} ∉ E`. Since `x` and `y` were arbitrary, the complement contains no adjacent pair and is independent.

The order of variable introduction is instructive. The assumption that `C` is a cover is a universal statement; it does not invite us to invent an edge immediately. It waits to be instantiated once a candidate edge appears. The goal is universal, so we first ask the reader for arbitrary `x` and `y`. Expanding assume/prove columns reveals that these goal variables, not new declarations of `G` and `C`, are what should be introduced.

## Second direction: use a counterexample edge in the contrapositive

To prove “if `V − C` is independent, then `C` is a cover,” the slides prove its contrapositive: if `C` is not a cover, then `V − C` is not independent. This formulation turns the witness created by negation directly into the required answer.

The negation of vertex cover is not merely “some vertex was not chosen.” It says that there are `x, y ∈ V` such that `{x, y} ∈ E`, `x ∉ C`, and `y ∉ C`. Thus `x, y ∈ V − C`, while their edge remains in `E`. The complement contains an adjacent pair and is therefore not independent.

Here the assumption is existential, so its witnesses `x` and `y` should be introduced immediately. The goal “not independent” also asks for an adjacent pair in the complement, and those same witnesses work. The proof creates no new object; it moves the counterexample edge supplied by the assumption into the form required by the goal.

## Negating the definition is the key to the second direction

Negating the cover definition step by step prevents intuitive mistakes:

```text
¬∀u ∈ V. ∀v ∈ V. ({u,v} ∈ E → (u ∈ C ∨ v ∈ C))
≡ ∃u ∈ V. ∃v ∈ V. ({u,v} ∈ E ∧ u ∉ C ∧ v ∉ C).
```

The universal quantifiers become existential, `¬(P → Q)` becomes `P ∧ ¬Q`, and De Morgan's law negates the endpoint disjunction. The result is not a vague statement that coverage failed; it is actionable evidence consisting of an edge and two endpoints outside `C`.

Likewise, the negation of independence says that two vertices in the set exist with an edge between them. The two negated definitions describe the same bad configuration under different set names. Once natural language has been converted into this precise negation, the proof skeleton is largely determined.

## Why the iff proof consists of these two lemmas

Let `A` mean “`C` is a vertex cover” and `B` mean “`V − C` is independent.” Lemma 1 proves `A → B`. Lemma 2 proves `¬A → ¬B`, which is the contrapositive of `B → A`. Together they establish both directions of `A ↔ B`.

A common failure is to prove the first direction twice in different words, never deriving cover from an independent complement. Writing `A → B` and `B → A` at the top of a draft makes completeness easy to audit. When using a contrapositive, label which direction it replaces.

A diagram establishes intuition but not generality. The theorem quantifies over all graphs and all `C ⊆ V`. A proof must take arbitrary objects and derive the result from definitions, not merely verify a marked example.

## Large independent sets and small vertex covers are one choice

Given an independent set `I`, its complement `V − I` is a vertex cover; given a cover `C`, its complement is independent. In a finite graph, `|I| + |C| = |V|`. Maximizing `I` is therefore equivalent to minimizing its complementary `C`.

Distinguish large from largest and small from smallest. Every independent set corresponds to a cover, but only a maximum independent set complements a minimum cover. A maximal independent set, one to which no vertex can locally be added, need not be globally maximum. These optimization terms are not hypotheses of the theorem, but matter when interpreting algorithmic tasks.

The deck connects efficient maximum-IS or minimum-VC search to later complexity theory, using polynomial time `O(n^k)` as the target meaning of efficient. The point here is not to solve the open problem prematurely. It is to see how a structural theorem converts problems: solve either side, take a complement, and obtain the other.

## A small executable example

Let `V = {a,b,c,d}` and `E = {{a,b},{b,c},{c,d}}`, a four-vertex path. Choose `C = {b,c}`. Every edge touches `b` or `c`, so `C` is a cover. Its complement `{a,d}` contains no edge and is independent.

If instead `C = {b}`, edge `{c,d}` has both endpoints outside `C`, so `C` is not a cover. The complement `{a,c,d}` indeed contains `{c,d}` and is not independent. That one failed edge is simultaneously the witness for both negated definitions, exactly as in Lemma 2.

For a reverse exercise, take `I = {a,c}`. Since `{a,c}` is not in `E`, it is independent, and its complement `{b,d}` covers all three edges. Do not rely only on circling a picture: check each edge for a cover endpoint or each internal pair for the absence of an edge.

## Common mistakes and a self-check

First, do not confuse an edge cover with a vertex cover. This lecture's `C` contains vertices and must touch every edge. Second, independent does not mean “has no incident edges”; it only forbids edges internal to the chosen set. Third, an iff proof needs both directions, or an explicit contrapositive replacing one direction.

Fourth, the negation of cover is not merely `u ∉ C ∨ v ∉ C`. One selected endpoint already covers an edge, so a true counterexample needs `u ∉ C ∧ v ∉ C`. Fifth, `{u,v}` is not an ordered pair: for an undirected edge, reversing its written order does not create another edge.

Use four questions before proving anything: what are the element types of `V` and `E`? Is the candidate set a subset of `V`? Which quantifiers appear after expanding the target definition? If the claim fails, is the smallest witness a vertex, an edge, or a pair of sets? Answering these is more reliable than chasing a drawing.

## Material limits

The public slides support the formal definitions, two application stories, complement theorem, and both lemmas in this article. They also contain midterm administration and live polls; this guide retains only the material needed for the graph-theory argument and does not present dated exam logistics as current advice.

Recordings, transcripts, and classroom discussion are not public, so this article does not reconstruct spoken analogies, student answers, or derivations absent from the deck. Paths, trails, local area networks, and trees are next-lecture topics and are not expanded here.

## Update log

- 2026-08-22: Rebuilt the article from the official Graphs, Part I deck, restoring the formal definitions, complement iff theorem, and both proof directions.

## References

- [Stanford CS103 Spring 2026 Lecture 9: Graphs, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/09/)
- [Official Lecture 9 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/09/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs on Discrete Structures](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs_on_discrete_structures)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
