---
title: "Stanford CS161 Lecture 12: Dynamic Programming with Bellman–Ford and Floyd–Warshall"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, dynamic-programming, shortest-path]
lang: en
type: deep-dive
description: "A close reading of Stanford CS161 Winter 2026 Lecture 12: Bellman–Ford as a layered dynamic program and Floyd–Warshall for all-pairs shortest paths."
tldr: "Dynamic programming starts by defining subproblems, derives a recurrence from optimal substructure, and evaluates states in dependency order; Bellman–Ford layers by edge count, while Floyd–Warshall layers by allowed intermediate vertices."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 13
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-12-dynamic-programming-shortest-paths)

This is article 13 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 12**. The official title is **Dynamic Programming: Bellman-Ford and Floyd-Warshall**. Ellen Vitercik taught it on February 18, 2026.

This article follows the [official Lecture 12 page](https://stanford-cs161.github.io/winter2026/lectures/#lecture-12-dynamic-programming-bellman-ford-and-floyd-warshall), public notes, and the public slide PDF. It does not use the Canvas-only recording. Lecture 11 compared Dijkstra and Bellman–Ford through relaxation and weight assumptions. This lecture deliberately revisits Bellman–Ford, now emphasizing states, recurrences, and evaluation order before extending the same method to all-pairs shortest paths.

## Bellman–Ford is already a DP table

Let `G=(V,E)` be a weighted directed graph, with `n=|V|`, `m=|E|`, and source s. Define

```text
d^(k)[v] = minimum cost of an s-to-v path using at most k edges.
```

The state definition matters more than the code because both the recurrence and proof follow from it. With no edges allowed,

```text
d^(0)[s] = 0
d^(0)[v] = infinity, v != s.
```

An optimal path admitted at layer k has only two possibilities. It may already use at most k−1 edges, contributing `d^(k-1)[v]`. Otherwise, remove its final edge `(u,v)`; the prefix is an s-to-u path with at most k−1 edges. Hence

```text
d^(k)[v] = min(
  d^(k-1)[v],
  min over (u,v) in E of d^(k-1)[u] + w(u,v)
).
```

An implementation copies the previous array and scans every edge:

```text
previous[s] = 0; previous[v != s] = infinity

for k = 1 to n - 1:
    current = copy(previous)
    for each edge (u, v):
        current[v] = min(current[v], previous[u] + w(u, v))
    previous = current
```

The right-hand side intentionally reads only the previous layer. In-place repeated relaxation can reach the same final result, but the layered version has a clean state meaning and induction proof. The base case is exact. At layer k, an optimal path either belonged to the earlier layer or ends with some `(u,v)`. Its prefix must be optimal under the smaller edge budget; replacing a nonoptimal prefix would improve the whole path.

If no source-reachable negative cycle exists, a shortest path can be chosen simple: a repeated vertex forms a nonnegative cycle that can be removed without increasing cost. A simple path uses at most `n-1` edges, so `d^(n-1)` contains all shortest distances. There are n−1 rounds of m edges, giving `O(nm)` time. Because a layer depends only on its predecessor, two length-n arrays give `O(n)` distance storage.

One additional round detects a source-reachable negative cycle: if any value can still decrease, such a cycle exists. The reachability qualifier is essential. Bellman–Ford does not report a negative cycle that s cannot reach. Once a reachable negative cycle exists, repeated trips around it drive costs downward without bound, so affected finite shortest distances are not well-defined.

## What makes a method dynamic programming?

The slides extract two properties from Bellman–Ford. **Optimal substructure** means an optimal solution can be composed from optimal solutions to smaller subproblems. **Overlapping subproblems** means several larger states repeatedly need the same smaller states. A valid recurrence can exist without much overlap, but the table earns its efficiency by computing each state once and reusing it.

The lecture's recipe has three steps:

1. Define subproblems precisely and justify how an optimal solution decomposes into them.
2. Write the recurrence and base cases, covering every mutually exclusive form an optimum can take.
3. Fill states in an order whose dependencies are already available, or use memoized recursion that expands a state only once.

Writing a plausible-looking recurrence is not step one. Bellman–Ford's k limits the number of edges. Floyd–Warshall's k will limit which vertex labels may appear internally. The tables look similarly layered, but their meanings and proofs are different.

## Fibonacci: why repeated subproblems explode

The slides use Fibonacci as the smallest illustration:

```text
Fib(n) = Fib(n-1) + Fib(n-2)
Fib(0) = 0, Fib(1) = 1.
```

Direct recursion recomputes many identical states across the two subtrees, including `Fib(n-2)` and `Fib(n-3)`. Its call tree grows exponentially. A short recurrence is therefore not automatically an efficient algorithm. Bottom-up tabulation begins at the base cases:

```text
F[0] = 0; F[1] = 1
for i = 2 to n:
    F[i] = F[i-1] + F[i-2]
```

Each index receives constant work once, for `O(n)` time and `O(n)` table space. If only the final number is needed, the last two entries suffice for constant auxiliary space, though the official deck uses an array to make tabulation visible.

Top-down memoization keeps the recursive shape. `Fib(i)` first checks the memo and expands only an absent state. The two styles are equivalent in computable states and asymptotic time, but not identical engineering choices: top-down may visit only demanded states yet incurs calls and stack depth; bottom-up avoids recursion depth but may fill unused cells. The course's point is to make dependencies explicit, not to prescribe one style universally.

## From SSSP to APSP

Floyd–Warshall solves all-pairs shortest paths (APSP): find a distance for every ordered pair `(u,v)`, rather than fixing one source. It permits negative edges but still assumes no negative cycles; otherwise affected pairs have costs that can decrease without bound.

Number the vertices `1,2,...,n` and define

```text
D^(k)[u,v] = minimum cost of a u-to-v path whose intermediate
             vertices all belong to {1,...,k}.
```

The endpoints u and v are not restricted. An intermediate vertex is internal to the path. At `k=0`, no intermediate vertex is allowed:

```text
D^(0)[u,u] = 0
D^(0)[u,v] = w(u,v)  if (u,v) is an edge
D^(0)[u,v] = infinity otherwise.
```

With parallel edges, initialization takes their minimum weight. Layer k asks whether an optimal u-to-v path uses vertex k internally. If not, its value is `D^(k-1)[u,v]`. If it does, then in the absence of negative cycles we may choose a simple optimal path, so k need not repeat. Split at k into u-to-k and k-to-v paths, each with internal vertices from `{1,...,k-1}`:

```text
D^(k)[u,v] = min(
  D^(k-1)[u,v],
  D^(k-1)[u,k] + D^(k-1)[k,v]
).
```

Every entry on the right belongs to layer k−1. Replacing it casually with `D^(k)[u,k] + D^(k)[k,v]` loses the clean previous-layer recurrence used by the lecture's proof. An in-place implementation needs a separate argument that its update order is safe.

## Correctness of Floyd–Warshall

Induct on k. At `k=0`, a u-to-v path without intermediate vertices is either the empty path when u=v or one direct edge, exactly matching initialization. Assume layer k−1 has the stated meaning and consider an optimum P for layer k:

- If P does not contain k internally, all its intermediate vertices lie in `{1,...,k-1}`, so the first term represents it.
- If P contains k, split P at k. The u-to-k and k-to-v portions have internal vertices only in `{1,...,k-1}`. By optimal substructure, each portion can use the corresponding optimal state, producing the second term.

The recurrence takes the better of these exhaustive cases and therefore has exactly the state's meaning. At `k=n`, every vertex may be intermediate, so `D^(n)` covers all pairs.

This proof uses the existence of a simple optimal path. With a negative cycle, repeated traversal can prevent a minimum from existing, and the one-time split at k no longer describes a well-defined shortest path. Floyd–Warshall can nevertheless detect the condition. If some `D^(n)[v,v] < 0`, there is a negative-cost closed walk from v to itself, which contains a negative cycle. Conversely, a negative cycle makes a diagonal entry for a vertex on that cycle negative.

## Complexity, space, and choice boundaries

Floyd–Warshall has n layers, n² ordered pairs per layer, and constant work per cell, for `O(n^3)` time. The conceptual table has n³ cells, but only the preceding layer is needed, so two `n x n` matrices use `O(n²)` space. Reconstructing paths requires an additional predecessor or split-point matrix; distances alone do not reveal the actual paths.

This does not make Floyd–Warshall the universal APSP choice. With nonnegative weights, running Dijkstra from every source can cost `O(nm+n² log n)` with a suitable priority queue and is often better on sparse graphs. Floyd–Warshall offers a compact recurrence, cubic dense-graph behavior, and support for negative edges. Bellman–Ford remains single-source, costs `O(nm)`, and detects source-reachable negative cycles. Before choosing among them, distinguish single-source from all-pairs, sparse from dense, negative edges from negative cycles, and distance computation from path reconstruction.

## Why the same idea does not solve longest simple path

The official notes use longest simple path as a warning: a recurrence's shape does not establish optimal substructure. If the overall longest simple s-to-t path passes through k, one cannot independently select the longest simple s-to-k and k-to-t paths and concatenate them. The two pieces may reuse a vertex, making their concatenation non-simple. A locally longest prefix may also consume a vertex required later.

Shortest-path decomposition works because optimal pieces can be reassembled feasibly and, without negative cycles, a simple representative exists. Longest simple path lacks the same closure property. The notes further state that general longest path is NP-hard. This is not a new algorithmic objective for the lecture; it is a model-checking counterexample: prove subproblems compose legally before caching them.

## This lecture's place in the course

Lecture 11 centered on greedy finalization. Dijkstra selects the smallest current estimate permanently and needs nonnegative edge weights; Bellman–Ford avoids that greedy commitment and scans edges in rounds. Lecture 12 reinterprets those rounds as DP layers, making “at most k edges” the proof invariant. It then changes the layer index to “which intermediate vertices are permitted,” yielding Floyd–Warshall.

The transferable skill is not memorizing two formulas. For a new optimization problem, ask: what does every state dimension restrict? What exhaustive cases describe the optimum's last step or key split? Can optimal pieces be reassembled without breaking feasibility? Do states overlap enough to reward caching? What evaluation order satisfies all dependencies? When those answers are precise, the implementation is usually a translation of the proof.

## Beyond the lecture

The notes quote Richard Bellman's recollection about the name “dynamic programming”: in a political environment, he chose words that sounded difficult to oppose for multistage decision processes. The history explains the unusual label, but it is not an algorithmic definition. States, recurrences, overlap, and evaluation order remain the useful criteria.

The slides also mention asymptotically faster APSP research. That material is not required knowledge for this lecture and does not diminish Floyd–Warshall's role as the canonical DP example, so this article does not mix research bounds into the course guarantee.

## References

- [Stanford CS161 Winter 2026 — Lecture 12: Dynamic Programming: Bellman-Ford and Floyd-Warshall](https://stanford-cs161.github.io/winter2026/lectures/#lecture-12-dynamic-programming-bellman-ford-and-floyd-warshall)
- [Lecture 12 notes (PDF)](https://stanford-cs161.github.io/winter2026/assets/files/lecture12-notes.pdf)
- [Lecture 12 slides (PDF)](https://stanford-cs161.github.io/winter2026/assets/files/Lecture12.pdf)
- [Lecture 12 metadata and resource list (official component)](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture12.md)
