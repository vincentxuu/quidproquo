---
title: "Stanford CS161 Lecture 11: Dijkstra, Bellman-Ford, and Two Orders of Relaxation"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, shortest-path, graph-algorithms]
lang: en
type: deep-dive
description: "A lecture-by-lecture reading of Stanford CS161 Winter 2026 Lecture 11: weighted SSSP, relaxation, Dijkstra correctness and priority-queue costs, Bellman-Ford, negative edges, and negative cycles."
tldr: "Dijkstra finalizes the minimum estimate and relies on nonnegative weights; Bellman-Ford repeatedly relaxes every edge, spending O(nm) to support negative edges and detect a negative cycle reachable from the source."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 12
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-11-dijkstra-bellman-ford)

This is article 12 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 11**. The official title is **Dijkstra and Bellman-Ford**. Moses Charikar taught it on February 11, 2026.

I used the [official Lecture 11 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-11-dijkstra-and-bellman-ford), the public notes, and the public slides PDF. The deck says Dijkstra occupies most of class and Bellman-Ford is a quick introduction before Lecture 12. The notes add full Bellman-Ford and amortized-analysis arguments. This article preserves that emphasis. I did not use the Canvas-only recording. The component lists `lecture11-slides.pptx`, but that asset is missing, so I do not cite it.

Lecture 9's BFS solves unweighted shortest paths because every edge increases distance by one. Weighted graphs disrupt that order: a path with fewer edges may cost more. Dijkstra and Bellman-Ford share one core operation—relaxation—but schedule it differently and therefore require different assumptions.

## Problem, notation, and relaxation

Given a weighted directed graph `G=(V,E)`, source `s`, and edge weight `w(u,v)`, single-source shortest paths asks for `dist(s,v)` for every v. A path's cost is the sum of edge weights. Every subpath of a shortest path must also be shortest; otherwise replacing a cheaper prefix would improve the whole path.

Both algorithms keep estimates:

```text
d[s] = 0
d[v] = ∞, v ≠ s
```

Relax edge `(u,v)` by

```text
d[v] = min(d[v], d[u] + w(u,v))
```

When it improves, set predecessor `π(v)=u` to reconstruct a path. A finite estimate always represents an actual source-to-v path, so

```text
d[v] ≥ dist(s,v)
```

Estimates are upper bounds that relaxation pulls downward.

## Dijkstra: finalize the minimum estimate

Dijkstra separates unfinished F from finalized D:

```text
while F is not empty:
  x = vertex in F with minimum d[x]
  for each outgoing edge (x,y):
    relax(x,y)
  move x from F to D
```

The slides use a Stanford-campus graph and a taut-string analogy: the source is fixed first, the smallest estimate rises next, and its outgoing edges pull on neighbors. The picture is intuitive, but correctness must show that no path through unfinished vertices can later improve a finalized one.

### Claim one: estimates never underestimate

Initialization is immediate. Every update to `d[v]` concatenates an existing source-to-u path with edge `(u,v)`. Any such path costs at least the shortest path. This induction does not require nonnegative weights.

### Claim two: finalization is correct

Induct on entry into D. Let x have minimum estimate in F and let P be a shortest source-to-x path. On P, choose the closest vertex z to x whose estimate is already correct; at least s qualifies.

If z=x, stop. Otherwise let z' follow z on P. The prefix of a shortest path is shortest, and weights are nonnegative:

```text
d[z] = dist(s,z) ≤ dist(s,x) ≤ d[x]
```

If `d[z]<d[x]`, z cannot remain in F because x is its minimum. It already belongs to D, so edge `(z,z')` was relaxed. That makes z' correct, contradicting the choice of z. Therefore `d[x]=dist(s,x)`.

Nonnegativity is essential. Once x is finalized, every unfinished y has `d[y]≥d[x]`; adding `w(y,x)≥0` cannot improve x. A negative edge breaks that irreversible commitment.

## A negative-edge counterexample

Consider:

```text
s --2--> x
s --5--> y --(-10)--> x
```

Dijkstra sees `d[x]=2` and `d[y]=5`, so it finalizes x. The true shortest path `s→y→x` costs `-5`. Some graphs with a negative edge may happen to produce a correct output, but the guarantee no longer holds.

A negative edge is not a negative cycle. If a source-reachable cycle has negative total weight, each extra traversal decreases cost, so affected distances have no finite minimum. Without a negative cycle, negative edges can still define valid shortest paths.

## The priority queue determines Dijkstra's cost

F needs minimum lookup, minimum removal, and key decrease. There are n minimum/removal operations and at most m decreases:

| Implementation of F | Find / remove min | Decrease key | Total |
| --- | ---: | ---: | ---: |
| Unsorted array | `O(n)` | `O(1)` | `O(n²+m)=O(n²)` |
| Red-black tree | `O(log n)` | `O(log n)` | `O((n+m)log n)` |
| Fibonacci heap | amortized `O(log n)` removal | amortized `O(1)` | amortized `O(m+n log n)` |

For sparse graphs, tree and heap implementations expose their advantage. For dense `m=Θ(n²)` graphs, the simple array's `O(n²)` can be competitive. Lecture 7's data structures directly alter this runtime.

## Notes supplement: amortized is not expected

Fibonacci-heap bounds are amortized: a sequence starting from an empty structure has bounded total cost even when one operation is expensive. The notes illustrate this with a binary counter. Incrementing `0111` flips several bits, but n increments perform only `O(n)` total flips.

The accounting method charges two credits per increment. A 1-bit stores a credit that later pays for its 1→0 carry; a new carry preserves enough credit to continue. Expensive carry chains were prepaid by earlier cheap increments.

This differs from Lecture 8's expected hashing. Expectation averages over random choices. Amortization averages total cost over an operation sequence and needs no randomness.

## Bellman-Ford: relax everything repeatedly

Bellman-Ford abandons greedy finalization. Its common form performs n−1 rounds, scanning all m edges each time:

```text
for i = 1 to n-1:
  for each edge (u,v):
    relax(u,v)
```

Scan once more. If any edge still improves, report a source-reachable negative cycle; otherwise return the distances.

To prepare dynamic programming, the slides also use arrays `d^(0),…,d^(n-1)`, where `d^(k)[v]` depends only on the previous round and means the shortest source-to-v path using at most k edges. The notes explicitly mention the difference from some in-class pseudocode. Both cost `O(nm)`, but a proof must keep one state semantics; it cannot claim a previous-round recurrence while silently using same-round updates.

## Bellman-Ford correctness

Without a source-reachable negative cycle, a shortest path can be simple. Remove a positive cycle to improve it; remove a zero cycle without changing cost. A simple path has at most n−1 edges.

Induct on k: after round k, `d^(k)[v]` is the best cost using at most k edges. Such a path either already uses at most k−1 edges, or ends with `(u,v)` after a prefix of at most k−1 edges. The recurrence takes the minimum of exactly those possibilities. At k=n−1 it covers every simple shortest path. Since estimates also remain costs of real paths, they equal the true distances.

Negative-cycle detection has a short contradiction. Suppose a reachable cycle `v₁→…→vₖ→v₁` has negative weight, but the final scan finds no relaxable edge. Every cycle edge then satisfies

```text
d[vᵢ₊₁] ≤ d[vᵢ] + w(vᵢ,vᵢ₊₁)
```

Sum the inequalities. All d terms cancel, giving `0≤Σw`, contradicting the negative cycle weight. Therefore at least one edge still improves.

Only source-reachable negative cycles obtain finite estimates and trigger this SSSP version. Detecting any negative cycle in the graph requires an additional construction, such as a super-source; that is not the default lecture algorithm.

## The real difference between the algorithms

| Aspect | Dijkstra | Bellman-Ford |
| --- | --- | --- |
| Schedule | Minimum estimate first | Every edge each round |
| Finalization | Permanent | None |
| Weight assumption | Nonnegative | Negative edges allowed |
| Negative cycles | Not handled | Detects source-reachable cycles |
| Typical time | amortized `O(m+n log n)` with Fibonacci heap | `O(nm)` |

Both rely on relaxation. Dijkstra trades a stronger premise for irreversible decisions. Bellman-Ford spends more rounds for flexibility. Calling it merely a slower Dijkstra misses its bounded-edge state and negative-cycle certificate.

## Limits that are easy to misuse

Dijkstra permits zero-weight edges; it requires nonnegative, not strictly positive, weights.

A negative edge breaks Dijkstra's proof. A negative cycle is stronger: it eliminates finite shortest distances for reachable downstream vertices.

`d[v]` is an upper bound. Reversing that inequality invalidates the correctness argument.

Fibonacci-heap bounds must retain the word amortized. They are not per-operation worst-case promises.

Finally, Lecture 11 only previews Bellman-Ford in the deck. Lecture 12 owns the full dynamic-programming state and Floyd-Warshall. The overlap is deliberate, but the two articles should not become copies.

## Where Lecture 11 sits in the course

Lecture 9's BFS is the shortest-path algorithm for unit edge costs. Lecture 11 first handles arbitrary nonnegative weights with Dijkstra, then opens the door to negative weights with Bellman-Ford. It also reconnects Lecture 7's priority queues and Lecture 8's distinction between expected and amortized guarantees.

Lecture 12 will reinterpret `d^(k)[v]` as a table of subproblem solutions. That recurrence formally introduces dynamic programming and then generalizes to all-pairs shortest paths with Floyd-Warshall.

## Beyond the lecture

Trace both algorithms on the same five-vertex graph. After each Dijkstra finalization, write why the value can no longer change. After each Bellman-Ford round, write the maximum number of edges whose paths are now covered. Add a negative edge and then a negative cycle to distinguish a failed premise from an undefined distance.

An implementation can retain predecessors as well as distances. After detecting a negative cycle, following predecessors n steps and then around the loop can produce a cycle certificate. This is a practice extension, not an additional Winter 2026 requirement.

## References

- [Stanford CS161 Winter 2026 — Lecture 11 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-11-dijkstra-and-bellman-ford)
- [Lecture 11 notes: Dijkstra and Bellman-Ford](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-notes.pdf)
- [Lecture 11 slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-slides.pdf)
- [Lecture 11 metadata and resource list (official component)](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture11.md)
