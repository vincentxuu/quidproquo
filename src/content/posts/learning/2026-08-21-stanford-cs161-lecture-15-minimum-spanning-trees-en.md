---
title: "Stanford CS161 Lecture 15: Proving Prim and Kruskal with the Cut Property"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, minimum-spanning-tree, prim, kruskal]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 16
tldr: "The heart of MST algorithms is an invariant: the selected edges remain contained in some MST. The cut property proves that every step of Prim and Kruskal is safe."
description: "A complete guide to Stanford CS161 Winter 2026 Lecture 15: MSTs, the safe-edge theorem, cut property, Prim, Kruskal, union-find, and runtimes."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-15-minimum-spanning-trees)

This is article sixteen in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 15**, taught by Moses Charikar on March 2, 2026, and titled *Minimum Spanning Trees*.

I used the public [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-notes.pdf), [slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-slides.pdf), and [official lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture15.md). Although the component still labels the resource section `coming`, both PDFs exist. I did not watch the access-controlled Canvas recording or use the prelecture, notebook, or concept-check bank.

Lecture 14 used exchange arguments to justify greedy choices. This lecture packages the same idea into a reusable theorem: find a cut that respects the edges already chosen, and a light edge crossing it is safe. Prim grows one tree while Kruskal merges a forest, but both use exactly this proof template.

## The problem and its invariant

The input is a connected undirected graph `G=(V,E)` with real edge weights. A spanning tree connects all vertices without a cycle and has `|V|-1` edges. An MST minimizes `w(T)=Σ_{e∈T}w(e)`. Repeated weights mean that neither the lightest edge nor the MST must be unique.

Both algorithms maintain an edge set `A` and the invariant that **some MST contains `A`**. Initially `A=∅`. A safe edge is one whose addition preserves that invariant. This is deliberately weaker than saying the edge belongs to every MST and is what makes ties harmless.

A cut `(S,V-S)` partitions vertices, not edges. An edge crosses it when its endpoints lie on opposite sides. The cut respects `A` if no edge in `A` crosses it. A light edge is a minimum-weight crossing edge and need not be unique.

## The safe-edge theorem

If some MST contains `A`, a cut respects `A`, and `(u,v)` is a light edge crossing that cut, then some MST contains `A∪{(u,v)}`.

Take an MST `T` containing `A`. If `(u,v)` is already in `T`, we are done. Otherwise, adding it creates one cycle. The old `u→v` path must contain another crossing edge `(x,y)`. Since the cut respects `A`, that edge is not in `A` and can be removed without breaking earlier commitments.

Because `(u,v)` is light, `w(u,v)≤w(x,y)`. Thus `T'=T-{(x,y)}+{(u,v)}` is still a spanning tree and is no more expensive than `T`. Since `T` was minimum, `T'` is also an MST and contains the enlarged set. The proof supports positive, negative, and tied weights.

The theorem does not license choosing an arbitrary globally light edge. The cut must respect the current `A`, and the edge must be light among edges crossing that particular cut.

## Prim: growing one tree

Prim chooses a root `r`. For every vertex, `key(v)` records the cheapest edge from the current tree to `v`, and `p(v)` records its tree endpoint. Set `key(r)=0`, all other keys to infinity, and place all vertices in a minimum-priority queue `Q`.

```text
Prim(G, r):
    for v in V: key[v] = ∞; parent[v] = NIL
    key[r] = 0; Q = V; A = ∅
    while Q is not empty:
        u = ExtractMin(Q)
        if parent[u] != NIL: A.add((parent[u],u))
        for neighbor v of u with v in Q:
            if w(u,v) < key[v]:
                key[v] = w(u,v); parent[v] = u
    return A
```

The extracted vertices form the growing tree. The cut `(Q,V-Q)` respects all selected edges. Each active key is the cheapest edge connecting that vertex back to the tree, so the globally minimum key identifies a light edge of the whole cut. The safe-edge theorem therefore preserves the invariant at every extraction.

In the official nine-vertex example, starting at `a`, `c` and `h` eventually tie with key 8. Either may be extracted first; tie-breaking can change the tree but not optimality. The slides contrast a spanning tree of cost 67 with an MST of cost 37, separating mere connectivity from minimum cost.

With a binary heap or red-black tree, extraction costs `O(n log n)` and up to `m` updates cost `O(m log n)`, hence `O(m log n)` for a connected graph. A Fibonacci heap gives amortized `O(m+n log n)`.

Prim's key is not a root-to-vertex distance. Dijkstra compares `dist(u)+w(u,v)`; Prim compares only `w(u,v)`. Similar queue mechanics serve different objectives.

## Kruskal: merging a forest

Kruskal sorts edges by nondecreasing weight and creates one disjoint set per vertex. It scans `(u,v)`, adding and unioning it exactly when the endpoints belong to different components. An edge within one component would create a cycle and is skipped.

```text
Kruskal(G):
    A = ∅
    for v in V: MakeSet(v)
    for (u,v) in edges sorted by nondecreasing weight:
        if Find(u) != Find(v):
            A.add((u,v)); Union(u,v)
    return A
```

The selected edges remain a forest. For the next accepted edge, take one of its components as `S`. Existing edges stay inside components, so the cut respects `A`. Since lighter usable edges were already processed, the accepted edge is light across that cut and is safe.

The nine-vertex example begins with `(g,h)`, allows arbitrary order among ties such as `(c,i)` and `(f,g)`, and skips `(i,g)` once its endpoints share a set. Sorting supplies the greedy order; union-find answers whether an edge preserves acyclicity.

General comparison sorting costs `O(m log m)`, commonly simplified to `O(m log n)` for simple graphs. Polynomially bounded integer weights permit radix sorting in `O(m)`. Optimized union-find operations cost amortized `O(α(n))`, making the nonsorting work `O((m+n)α(n))`.

## Comparing the two algorithms

| Aspect | Prim | Kruskal |
|---|---|---|
| Intermediate state | One growing tree | A forest |
| Cut used | Tree versus unextracted vertices | One component versus the rest |
| Main structure | Minimum-priority queue | Sorting plus union-find |
| Cycle prevention | Only new vertices enter | `Find(u) != Find(v)` |
| Proof | Minimum key is a light edge | Next usable sorted edge is light |

Prim is natural for adjacency-oriented or dense representations; Kruskal is direct for sparse edge lists and naturally produces a minimum spanning forest. These are implementation considerations, not different correctness principles.

The lecture assumes a connected graph. A disconnected graph has no single spanning tree; Kruskal returns one minimum tree per component. Calling that a minimum spanning forest is precise, while calling it an MST is not.

## Complexity and source boundaries

The notes also list the 1995 Karger–Klein–Tarjan randomized `O(E+V)` result and Chazelle's 2000 deterministic `O(Eα(V))` result using soft heaps. I report these as results listed by the Winter 2026 materials, not as an independently verified claim about today's fastest algorithm.

Likewise, comparison sorting is safely stated as `O(m log m)` and simplified to `O(m log n)` for simple graphs. The exact lower-bound formulation depends on the model and on the relationship between `m` and `n`.

Other common mistakes are treating a cut as an edge partition, assuming either side must be connected, assuming unique light edges, confusing Prim keys with shortest-path distances, accepting Kruskal edges that close a cycle, or treating the stale `resources coming` label as stronger evidence than the available PDFs.

## From Lecture 14 to Lecture 16

Lecture 14 introduced exchange arguments; Lecture 15 crystallizes one as the cut property and shares it across two algorithms. Lecture 16 also uses cuts, but directed `s-t` cut capacity counts only `S→T`, and a residual graph supplies an optimality certificate. The same word does not imply the same definition.

## Beyond the lecture

Practical Kruskal implementations use union by rank or size together with path compression to realize the near-`α(n)` bound. Deterministic tie-breaking also makes outputs reproducible even though it does not affect minimum cost.

Tests should check more than total weight: exactly `n-1` edges, connectivity, acyclicity, and agreement with brute-force trees on small graphs. An API should reject disconnected input or explicitly return a forest. These are engineering extensions, not additional lecture theorems.

## References

- [Stanford CS161 Winter 2026 — Lecture 15 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-15-minimum-spanning-trees)
- [Lecture 15 notes: Minimum Spanning Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-notes.pdf)
- [Lecture 15 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-slides.pdf)
- [Lecture 15 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture15.md)
