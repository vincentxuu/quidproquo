---
title: "Stanford CS161 Lecture 10: Why Two DFS Passes Find Strongly Connected Components"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, graph-algorithms, strongly-connected-components]
lang: en
type: deep-dive
description: "A lecture-by-lecture reading of Stanford CS161 Winter 2026 Lecture 10: SCCs, the condensation DAG, transpose graphs, finish times, the two-pass algorithm, and its linear-time proof."
tldr: "Contracting each SCC always produces a DAG; first-pass DFS finish times order those components, and a second pass on the transposed orientation discovers exactly one SCC per DFS tree in O(n+m)."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 11
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-10-strongly-connected-components)

This is article 11 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 10**. The official title is **Strongly Connected Components**. Moses Charikar taught it on February 9, 2026.

I used the [official Lecture 10 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-10-strongly-connected-components), the public notes, and the public slides. The slides run the original graph first and reverse it second; the notes use the equivalent reverse-first orientation. I show both but keep the full proof in the notes orientation so that the passes never get mixed. I did not use the Canvas-only recording, and I do not present the inherited `winter2025-extra` notebook as newly authored Winter 2026 material.

Lecture 9 established that DFS from any vertex of an undirected component reaches the whole component. Directed graphs are harder. Reachability from u to v does not imply a return path. One DFS produces a reachable set, not mutual reachability. Lecture 10 contracts SCCs into a DAG and uses finish times to decide where a second DFS can start without escaping into another unprocessed component.

## Directed graphs need two notions of connectivity

In an undirected graph, define `u~v` when a path connects them. The relation is reflexive, symmetric, and transitive. Each equivalence class is a connected component.

Directions split the concept:

- A **strongly connected component** is a maximal set S such that every `u,v∈S` have both u→v and v→u paths.
- A **weakly connected component** is a connected component after replacing every directed edge by an undirected one.

Maximality matters. An arbitrary mutually reachable subset is not necessarily an SCC. Three vertices on a directed cycle contain mutually reachable pairs, but the SCC is the entire three-vertex set.

A tempting error is to run DFS from one source and call the reachable set an SCC. If SCC `A` points to SCC `B`, DFS from A reaches both even though B cannot return to A. Reachability supplies only one direction.

## Contract every SCC into one node

Replace each SCC `C₁,…,Cₖ` by a meta-node. Add an edge between distinct meta-nodes whenever an original edge crosses their components. The result is the SCC graph or condensation graph.

The condensation graph must be a DAG. If distinct SCCs formed a directed cycle, paths inside the SCCs plus the crossing edges would make every vertex on that cycle mutually reachable. Those components should have been one SCC, a contradiction.

This is the lecture's simplifying view. The original graph may be complicated, but its SCC-level structure is acyclic. If a second DFS always starts in a sink component of the remaining DAG, it cannot leave that SCC. Strong connectivity also guarantees that it reaches the entire SCC.

The remaining question is how to discover that order without knowing the SCCs in advance. First-pass finish times do it.

## Two equivalent orientations

The transpose `G^T` retains all vertices and reverses every `(u,v)` to `(v,u)`. Transposition preserves the SCC partition: mutual paths remain mutual after every path reverses.

The official materials present two forms.

### Notes form: `G^T → G`

1. Run a full DFS forest on `G^T` in arbitrary vertex order and record `f(v)`.
2. Return to G and choose unvisited DFS sources in decreasing `f(v)`.
3. Every second-pass DFS tree—vertices sharing one leader—is one SCC.

### Slides and CLRS form: `G → G^T`

1. Run DFS on G in arbitrary order and record finish times.
2. Reverse all edges.
3. Run DFS on `G^T` in decreasing first-pass finish order; each tree is an SCC.

Both are correct because G and `G^T` have the same SCCs. The dangerous mistake is not choosing one form; it is taking the first pass from the slides and copying a proof whose edge directions assume the notes form. The proof below fixes the notes orientation.

## A three-component example

Suppose the condensation graph is

```text
C1 → C2 → C3
```

In G, C3 is a sink. In `G^T`:

```text
C3 → C2 → C1
```

Run the first forest on `G^T`. Regardless of the exact starting vertex, the finish ordering places the sink side of the original graph early in the second-pass priority. Return to G and start at the largest remaining finish time. Its SCC has no path into an unprocessed SCC, so DFS stays inside it. Remove that component; the remaining condensation DAG has a new sink.

The notes trace nine vertices. The first pass assigns `f=1,…,9`; the second pass creates three trees with leaders 9, 6, and 4. Neighbor tie-breaking changes individual times but not the final partition.

## The key lemma: finish times order components

Use the notes orientation. Suppose G's condensation graph has edge `C₁→C₂`. The first pass runs on `G^T`. Define a component's finish value as the maximum vertex finish time inside it. The claim is

```text
max_{v∈C₁} f(v) < max_{v∈C₂} f(v)
```

In `G^T`, the crossing edge is `C₂→C₁`. Consider the first vertex of `C₁∪C₂` reached by DFS-loop.

### C₁ is reached first

There can be no path from C₁ to C₂ in `G^T`; combined with `C₂→C₁`, it would create a condensation cycle. DFS finishes C₁ without entering C₂. C₂ is explored later and receives the larger maximum finish time.

### C₂ is reached first

From C₂, DFS can enter C₁ through the reversed crossing edge, while strong connectivity covers each component internally. The call explores both before its start vertex in C₂ finishes. A C₂ vertex therefore has a finish time larger than every C₁ vertex.

Both cases yield the strict inequality. Neighbor order changes the numbers, not the component-level direction.

## Why one second-pass tree is exactly one SCC

Run the second pass on G in decreasing finish order. Maintain by induction that the already explored set S is a union of complete SCCs.

Let v be the next source and C its SCC. No vertex of C is in S. Mutual reachability means the DFS from v reaches all of C, so it explores at least C.

Now show that it reaches no other unprocessed SCC. If C has an outgoing edge to `C'`, the key lemma says `C'` contains a vertex with larger finish time than any in C. Decreasing order processed `C'` earlier. By the induction hypothesis, all of `C'` lies in S. Every outgoing edge of C therefore stays in C or enters an already marked component. The new DFS cannot escape into another unprocessed SCC.

It explores at least C and at most C, hence exactly C. Add C to S and continue. This proof needs both global facts: the condensation graph is acyclic and the finish-time lemma orders crossing edges.

## Pseudocode and leader bookkeeping

```text
SCC(G):
  GT = transpose(G)
  f = DFS-Forest(GT, arbitrary order)
  clear visited
  for v in vertices ordered by decreasing f(v):
    if v is unvisited:
      leader = v
      DFS(G, v), assigning this leader
  group vertices by leader
```

A leader is simply the root label of one second-pass tree. The algorithm does not know the SCC boundary beforehand; DFS naturally assigns one leader to the entire tree. An implementation may use a numeric component ID instead.

Transposing adjacency lists takes `O(n+m)`. Each full DFS forest costs `O(n+m)`. Finish times are unique integers generated by DFS, so an implementation can push vertices by completion and pop them instead of comparison-sorting. Total time is `O(n+m)`. Space is `O(n+m)` for representations, visited state, times, and the recursion or explicit stack.

## Common implementation and proof errors

The second pass must use decreasing first-pass finish times. Arbitrary order may start in a non-sink component and merge several SCCs into one tree.

The two passes cannot use the same graph orientation. `G→G^T` and `G^T→G` both work, but one transpose is essential and the lemma must match the chosen direction.

The condensation is a DAG; an SCC itself need not be a single cycle. It may contain many cycles and branches.

Weak connectivity ignores edge directions and cannot substitute for strong connectivity. Vertices may share a weak component without any mutual paths.

Finally, recursive depth can reach n. The asymptotic total remains linear, but a language call stack may overflow. Iterative DFS changes the engineering, not the proof.

## Where Lecture 10 sits in the course

Lecture 9 built DFS forests and finish-time intervals. Lecture 10 does not invent a new traversal; it places the same metadata on a transpose and combines it with the SCC DAG. This is a recurring design move: reveal a simpler hidden structure, then reuse a known primitive.

Lecture 11 turns to weighted shortest paths. SCC decomposition is not itself a shortest-path algorithm, but its proof prepares the same style of reasoning: a short algorithm whose correctness depends on a global invariant. Dijkstra's finalized set will have that shape.

## Beyond the lecture

To verify both official forms, draw one graph with three SCCs and run `G→G^T` and `G^T→G`. Record finish order and second-pass trees. Vertex times may differ, while the component partition must agree.

An implementation can return both a component ID per vertex and the condensation DAG. Convert every original edge `(u,v)` to `(comp[u],comp[v])`, then remove self-loops and duplicates. This is an extension exercise from this article, not an additional Winter 2026 requirement.

## References

- [Stanford CS161 Winter 2026 — Lecture 10 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-10-strongly-connected-components)
- [Lecture 10 notes: Strongly Connected Components](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-notes.pdf)
- [Lecture 10 slides: Finding Strongly Connected Components](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-slides.pdf)
- [Lecture 10 metadata and resource list (official component)](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture10.md)
