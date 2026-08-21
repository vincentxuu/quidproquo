---
title: "Stanford CS161 Lecture 9: Graph Representations, DFS, BFS, and Proofs About Search Order"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, graph-algorithms, graph-traversal]
lang: en
type: deep-dive
description: "A lecture-by-lecture reading of Stanford CS161 Winter 2026 Lecture 9: adjacency lists and matrices, DFS timestamps, topological sorting, BFS layers, unweighted shortest paths, and bipartite testing."
tldr: "DFS and BFS both scan an adjacency-list graph in O(n+m); DFS finish times produce a topological order for a DAG, while BFS layers equal exact unweighted shortest-path distances."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 10
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-09-graphs-bfs-dfs)

This is article 10 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 9**. The official title is **Graphs and BFS and DFS**. Ellen Vitercik taught it on February 4, 2026.

I used the [official Lecture 9 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-9-graphs-and-bfs-and-dfs), the public notes, and the public slides. The notes develop graph representation, DFS, and BFS. The slides also apply DFS to topological sorting and BFS to bipartiteness. Both applications belong to the lecture agenda even though the notes do not develop them. The official Colab link inherits `winter2025-extra`; I do not use it as evidence of newly authored Winter 2026 material. I did not use the Canvas-only recording.

The point is not to memorize two traversal procedures. Search order leaves different evidence behind. DFS discovery and finish times encode a nested structure. BFS layers encode exact distances measured in edges. The same `O(n+m)` scanning skeleton solves different problems because its frontier discipline and bookkeeping differ.

## First decide how the graph lives in memory

Write a graph as `G=(V,E)`, with `n=|V|` and `m=|E|`. An undirected edge works in both directions. A directed edge `(u,v)` points only from u to v. Sparse graphs have edge counts near `Θ(n)`; dense graphs can approach `Θ(n²)`.

Two standard representations make different operations cheap:

| Representation | Space | Test `(u,v)` | Enumerate u's neighbors |
| --- | ---: | ---: | ---: |
| Adjacency matrix | `Θ(n²)` | `Θ(1)` | `Θ(n)` |
| Adjacency list | `Θ(n+m)` | worst-case `Θ(deg(u))` | `Θ(deg(u))` |

A matrix stores an `n×n` binary table. A list stores a neighbor list for each vertex. Directed implementations often keep outgoing and incoming lists separately because an algorithm may need one direction only.

The later `O(n+m)` DFS and BFS bounds assume adjacency lists. With a matrix, visiting a vertex scans a full row; even a sparse graph then costs `Θ(n²)`. A running time belongs to the representation as well as the pseudocode.

## DFS: go deep, then backtrack

Depth-first search starts at source `s` and follows an unexplored neighbor as far as possible before returning. The slides use a labyrinth with chalk and string. The pseudocode uses three colors:

- White: undiscovered.
- Gray: discovered and still active on the recursion stack.
- Black: finished; every outgoing neighbor has been considered.

Each vertex also stores parent `p(v)`, discovery time `d(v)`, and finish time `f(v)`:

```text
DFS(s, t):
  color(s) = gray
  d(s) = t; t++
  for v in out-neighbors(s):
    if color(v) == white:
      p(v) = s
      t = DFS(v, t); t++
  f(s) = t
  color(s) = black
  return t
```

One source reaches only its reachable vertices. To cover a disconnected graph, an outer loop starts a new DFS tree at every still-white vertex. The collection is a DFS forest. In an undirected graph, each tree corresponds to one connected component.

### A timestamp example

Suppose traversal descends `a→b→c→d`, finishes d, and backtracks. A second component is `e→f`. One valid timing is:

```text
a: (1,8)   b: (2,7)   c: (3,6)   d: (4,5)
e: (9,12)  f: (10,11)
```

A descendant's interval nests inside its ancestor's. The timestamps are not decoration: finish times support topological sorting here and become central to strongly connected components in Lecture 10.

## Why DFS costs O(n+m)

Each vertex changes from white to gray once and later to black, so there are at most n visits. Scanning u's adjacency list examines each directed edge `(u,v)` once. An undirected edge appears once at each endpoint, so it is scanned at most twice. Constant work per visit and per scan yields `O(n+m)`.

The same accounting helps establish coverage. For any vertex reachable from the source, choose a path to it. When DFS processes each discovered vertex on that path, it examines the next edge. An undiscovered endpoint becomes a recursive call; a discovered endpoint is already part of the traversal. DFS also moves only along real edges, so it cannot reach an unreachable vertex.

## Slide application one: topological sorting

Package dependencies and course prerequisites ask for an order in which every edge `A→B` places A before B. This is a topological order, guaranteed to exist only for a directed acyclic graph.

The algorithm is short:

1. Run a full DFS forest on the DAG and record finish times.
2. Output vertices in decreasing finish-time order.

Correctness rests on: for every DAG edge `A→B`, `f(B)<f(A)`.

- If B is a DFS descendant of A, recursion must finish B before returning to A.
- If B is not a descendant of A, A cannot be a descendant of B; the tree path from B to A plus edge `A→B` would form a cycle. B must therefore have finished before DFS started A.

In both cases, B finishes first, so decreasing finish time places A first. A cyclic graph still has finish times, but they do not become a valid topological order because the proof used acyclicity.

## BFS: advance the frontier layer by layer

Breadth-first search finishes every vertex one edge from the source before vertices two edges away. Define `L_i` as layer i:

```text
L₀ = {s}
```

While processing `L_i`, scan every neighbor of every u in that layer. The first time x appears, mark it visited, set `p(x)=u`, and insert it into `L_{i+1}`. A queue implements the same rule: pop the earliest discovered vertex from the front and append new neighbors at the back. Iterative DFS uses a stack instead. FIFO versus LIFO is the decisive structural difference.

In an unweighted graph, path length is the number of edges. BFS therefore computes more than reachability: it finds the source distance of every reachable vertex. Parent pointers form a BFS tree and reconstruct a shortest path by walking backward from the target.

## Why BFS layers equal shortest distances

The proposition is

```text
L_i = {x | dist(s,x)=i}
```

Use strong induction. `L₀={s}` is the base case. Assume every layer through i is correct.

First, a vertex placed into `L_{i+1}` is neither too far nor too close. It was found through an edge from some `x∈L_i`, so a path of length i+1 exists. It did not appear in an earlier layer, which by the induction hypothesis rules out distance at most i. Its distance is exactly i+1.

Second, no vertex at true distance i+1 is missed. Take a shortest path to y and let x precede y. The prefix to x is also shortest and has length i, so `x∈L_i`. Scanning x examines `(x,y)`. If y is unvisited, BFS inserts it into `L_{i+1}`; if already visited, another vertex from the same layer inserted it.

Both containments hold. The proof also exposes the limit: weighted edges do not all add one unit, so BFS cannot directly solve weighted shortest paths.

## Slide application two: testing bipartiteness

A bipartite graph admits two colors such that every edge joins different colors. The slides model two fish tanks: an edge connects fish that fight, and the task is to split them without placing a fighting pair together.

Run BFS in every component. Color even layers one color and odd layers the other. If an edge joins equal colors, report non-bipartite. If every edge crosses colors, the produced coloring is itself a certificate.

Why does one equal-color edge rule out every coloring rather than merely exposing a poor attempt? Let equal-color neighbors be u and v. Their paths through the BFS tree to their common ancestry have equal parity. Add edge `(u,v)` and the result is an odd cycle. No odd cycle admits a valid two-coloring: alternating colors around an odd number of edges returns to the start with the wrong color.

## The shared skeleton and the different invariants

| Aspect | DFS | BFS |
| --- | --- | --- |
| Frontier | Stack or recursion | Queue or explicit layers |
| Priority | Newest discovery first | Earliest discovery first |
| Main structure | DFS tree, discovery and finish times | BFS tree, distance layers |
| Lecture applications | Topological sorting | Unweighted shortest paths, bipartiteness |
| Adjacency-list time | `O(n+m)` | `O(n+m)` |

Both discover reachable vertices and undirected connected components. Neither is simply “faster.” Their order creates different invariants. Replacing the DFS stack with a queue changes the behavior and proof, not just the name.

## Limits that are easy to misuse

One source does not cover the entire graph. Disconnected graphs require an outer loop. In a directed graph, reachability from s to v does not imply a path back.

The `O(n+m)` bound assumes adjacency lists. Matrices scan n potential neighbors for every vertex, a sensible choice for some dense graphs but wasted work for sparse ones.

BFS shortest paths require unweighted or equal-weight edges. Nonnegative unequal weights call for Dijkstra in Lecture 11; negative edges require a different algorithm.

One slide abbreviates BFS on a connected graph as `O(m)`. The general statement is `O(n+m)`. Only an undirected connected graph, where `m≥n-1`, lets m absorb n.

Topological sorting requires a DAG, and bipartite testing must cover every component. These are correctness premises, not implementation footnotes.

## Where Lecture 9 sits in the course

Lecture 9 is the transition from sorting and data structures to graph algorithms. It establishes representation and traversal primitives. The next lectures repeatedly extend them: Lecture 10 uses DFS finish times for SCC decomposition, Lecture 11 generalizes unweighted BFS distances to weighted paths, and Lecture 12 uses dynamic programming for negative weights and all-pairs distances.

The durable lesson is a proof pattern: state what the traversal metadata means, count each vertex and edge to derive time, and express search order as an invariant that induction can use.

## Beyond the lecture

Take one small graph and trace it three ways. Run DFS under two neighbor orders and compare timestamps. Sort a DAG by decreasing finish time and inspect every edge. Then run BFS, write every `L_i`, and reconstruct a shortest path through parents. Neighbor order changes the trees but not the three core conclusions.

For a stronger bipartite implementation, return more than a boolean. On an equal-color edge, follow parent pointers to a common ancestor and emit the odd cycle. On success, return the coloring. A certificate makes correctness observable. These are practice suggestions, not added Winter 2026 requirements.

## References

- [Stanford CS161 Winter 2026 — Lecture 9 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-9-graphs-and-bfs-and-dfs)
- [Lecture 9 notes: Graphs, DFS, and BFS](https://stanford-cs161.github.io/winter2026/assets/files/lecture9-notes.pdf)
- [Lecture 9 slides: Graphs, BFS and DFS](https://stanford-cs161.github.io/winter2026/assets/files/Lecture9.pdf)
- [Lecture 9 metadata and resource list (official component)](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture9.md)
