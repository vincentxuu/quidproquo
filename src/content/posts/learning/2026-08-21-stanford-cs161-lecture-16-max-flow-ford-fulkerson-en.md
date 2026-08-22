---
title: "Stanford CS161 Lecture 16: Ford–Fulkerson, Residual Networks, and Max-Flow Min-Cut"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, max-flow, ford-fulkerson, min-cut]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 17
tldr: "Ford–Fulkerson augments through a residual network. When no path remains, residual reachability yields a cut equal to the flow, certifying max flow, min cut, and their equality."
description: "A complete guide to Stanford CS161 Winter 2026 Lecture 16: flows, cuts, residual graphs, Ford–Fulkerson, correctness, runtimes, and bipartite matching."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-16-max-flow-ford-fulkerson)

This is article seventeen in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Winter 2026 Lecture 16**, taught by Moses Charikar on March 4, 2026. The component calls it *Max-Flow and the Ford-Fulkerson Algorithm*; the notes use *Max Flow, Min Cut and Ford-Fulkerson*.

I used the public [notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-notes.pdf), [slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-slides.pdf), and [official component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture16.md). I did not watch the Canvas recording or use the linked historical paper and concept checks.

Lecture 15 used cuts to select safe greedy edges. Here a directed `s-t` cut gives an upper bound. Ford–Fulkerson builds a flow while updating a residual graph; when no residual path remains, reachability produces an equal-valued cut. The result and its certificate arrive together.

## Flows and cuts

The input is a directed graph with nonnegative capacities, source `s`, and sink `t`. A flow obeys `0≤f(u,v)≤c(u,v)` and conservation at every vertex except `s,t`. Its value is source net outflow, `|f|=Σ_x f(s,x)-Σ_y f(y,s)`.

An `s-t` cut partitions vertices into `S,T`, with `s∈S,t∈T`, and counts only original edges directed `S→T`: `c(S,T)=Σ_{x∈S,y∈T}c(x,y)`. Summing net outflow over `S` cancels internal edges, leaving forward flow minus backward flow, so every flow satisfies `|f|≤c(S,T)`. An equal-valued flow and cut certify each other's optimality.

## Residual graphs allow regret

For an original edge, forward residual capacity is `c(u,v)-f(u,v)`; its reverse residual capacity is `f(u,v)`. A reverse residual edge is not new transport capacity: it is permission to undo previous flow. Positive residual edges form `G_f`. An augmenting path is an `s→t` path in `G_f`, and its bottleneck is the minimum residual capacity on that path.

Augment by adding the bottleneck on forward edges and subtracting it when traversing reverse edges. Capacity remains valid, internal conservation cancels along the path, and flow value increases by the positive bottleneck.

## Ford–Fulkerson

```text
f = zero flow
while G_f contains an s-to-t path P:
    F = minimum residual capacity on P
    augment f by F along P
return f
```

DFS, BFS, or another rule may choose the path. The framework does not fix that choice, which affects termination and runtime but not correctness once it terminates.

The notes begin one example at flow value 16. The residual path `s→a→c→b→t` has bottleneck 2, raising the value to 18; the cut `{s,a,c}` versus `{b,t}` also has capacity 18. The slides separately show how reverse edges repair an earlier choice.

## Why termination proves optimality

First, every flow is bounded by every cut. Second, augmentation preserves feasibility and strictly raises value. Third, when no residual `s→t` path exists, let `S` contain vertices reachable from `s`. Every original `S→T` edge is saturated, or its endpoint would be reachable; every original `T→S` edge has zero flow, or its reverse would make a residual `S→T` edge. Therefore `|f|=c(S,T)`, proving max-flow equals min-cut.

## Path rules and runtimes

With integer capacities, arbitrary paths increase value by at least one, giving at most `|f*|` augmentations and `O(|f*|m)` time. This is pseudo-polynomial. Rational capacities can be scaled, but the scale enters runtime; with irrational capacities, arbitrary choices need not terminate. “Correct if it terminates” and “efficiently guaranteed to terminate” are distinct claims.

The notes also analyze fattest paths, giving `O(m(m+n)log|f*|)` for integer capacities, and shortest augmenting paths, giving at most `mn/2` iterations and `O((m+n)mn)`. Section 7 explicitly says these details were not discussed in class. It also conflates the names Edmonds–Karp and Dinic; standard terminology distinguishes them, so this article does not repeat that identification.

## Bipartite matching reduction

Direct all bipartite edges left-to-right, add unit edges from a source to every left vertex and from every right vertex to a sink, and give all capacities one. A matching yields an integer flow. Conversely, a value-`n` integer flow selects exactly one middle edge per vertex, producing a perfect matching. Ford–Fulkerson preserves integrality because it starts at zero and uses integer bottlenecks.

The slides extend the picture to capacitated assignments such as students and ice cream or swag, but do not give that general setting the same complete theorem proof as the balanced unit-capacity case.

## Source boundaries and common mistakes

Cut capacity counts only `S→T`; reverse residual edges undo flow; maximality requires reachability in the full residual graph; and correctness, termination, and efficiency must be separated. Super-sources and super-sinks are a notes remark, but implementations should replace “infinity” with a justified finite bound or symbolic handling.

The linked historical paper and concept checks were outside this reading. The perfect-matching proof covers the balanced unit-capacity model, while general assignment is an illustrative extension.

## Correctness, termination, and efficiency are three claims

The flow-versus-cut inequality and the terminal reachable cut prove that **if the method stops with no augmenting path, its output is optimal**. Integer capacities separately guarantee that every augmentation raises value by at least one, so finite `|f*|` implies termination under arbitrary path choices. Whether `O(|f*|m)` is efficient is a third question: `|f*|` can be large relative to input bit length, hence the pseudo-polynomial classification.

The residual graph serves execution and proof. During execution it represents both forward augmentation and regret through reverse edges. At termination its reachability partition turns “no improving path” into an equal-valued cut certificate. Inspecting only unused forward edges in the original graph breaks both roles.

## Beyond the lecture

Implementations can store reverse-edge indices and parent edges for path reconstruction, use sufficiently wide integers, and test capacity, conservation, value, and equality with the terminal reachable cut. Antiparallel original edges require explicit identities rather than the notes' simplified residual formula. These are engineering recommendations, not new lecture theorems.

## References

- [Stanford CS161 Winter 2026 — Lecture 16 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-16-max-flow-and-the-ford-fulkerson-algorithm)
- [Lecture 16 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-notes.pdf)
- [Lecture 16 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-slides.pdf)
- [Lecture 16 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture16.md)
