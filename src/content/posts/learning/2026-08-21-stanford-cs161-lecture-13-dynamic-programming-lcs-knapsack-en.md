---
title: "Stanford CS161 Lecture 13: Designing Dynamic Programs for LCS, Knapsack, and Independent Set"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, dynamic-programming, lcs, knapsack]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 14
tldr: "Lecture 13 turns dynamic programming into five steps: choose a state, derive transitions, fill the table, reconstruct a solution, and then improve the implementation. LCS takes O(mn), both knapsack variants take O(nW) pseudo-polynomial time, and maximum-weight independent set on a tree takes O(|V|)."
description: "A complete reading of Stanford CS161 Winter 2026 Lecture 13: the two-dimensional LCS table and reconstruction, why unbounded and 0-1 knapsack need different states, and the linear-time dynamic program for maximum-weight independent set on trees."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-13-dynamic-programming-lcs-knapsack)

This is article fourteen in [Reading Stanford CS161](/en/series/stanford-cs161). It covers **Stanford CS161, Winter 2026, Lecture 13**, taught by Ellen Vitercik on February 23, 2026. The official title is *More Dynamic Programming: LCS, Knapsack, Independent Set*.

This article uses only the public [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture13-notes.pdf), [slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture13.pdf), and [official lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture13.md). The course page also lists a Canvas recording that requires Stanford access. I did not watch it and do not treat it as a source. The slide deck has 116 pages, many of which reveal the same table one cell at a time, so this article follows the complete derivations rather than treating slide count as content depth.

Lecture 12 introduced the language of dynamic programming through Bellman–Ford and Floyd–Warshall. Lecture 13 immediately applies that language to three problems that look unrelated: strings, capacity-constrained selection, and trees. The actual lesson is not three formulas. It is how to determine exactly what a subproblem must remember. Leave one condition out of a state and an algorithm may reuse an item illegally. Choose the state well and a problem that is NP-hard on general graphs becomes linear on trees.

## The lecture's five-step dynamic programming recipe

The notes open with five steps for designing a dynamic program. They also provide the organizing spine for the lecture:

1. **Identify optimal substructure.** Can an optimal solution be decomposed into optimal solutions to smaller problems?
2. **Write a recurrence for the optimal value.** Explain how the large problem depends on smaller ones before writing loops.
3. **Compute the optimal value.** Exploit overlapping subproblems, compute each state once, and fill states in dependency order.
4. **Recover an optimal solution.** The optimal value is not always the requested object. Preserve decisions or trace backward through the table.
5. **Improve the implementation.** Check whether the algorithm stores unnecessary states, whether space can be compressed, and whether the filling order is sensible.

CS161 emphasizes the first three steps, shows a few examples of reconstruction, and only gestures toward implementation optimization. That boundary matters. Dynamic programming is not “draw a table whenever a problem looks recursive.” First prove the recurrence. The table merely prevents repeated work; it does not make an incorrect recurrence correct.

The three examples increase the state-design burden in stages. LCS remembers two prefix lengths. Unbounded knapsack remembers only capacity. Zero-one knapsack must also remember which items are still available. Independent set on a tree needs two values that distinguish whether the root of a subtree may be selected.

## LCS: two prefixes define one subproblem

Let `X=x₁x₂…x_m` and `Y=y₁y₂…y_n`. A **subsequence** may delete symbols but must preserve the relative order of the symbols that remain. It need not be contiguous. A Longest Common Subsequence, or LCS, is a longest sequence that is a subsequence of both inputs.

The notes use `abracadabra` and `bxqrabry`, for which one LCS is `brabr`. The slides motivate the problem with DNA, the Unix `diff` command, and version-control merging. Those applications explain why the problem is useful. The algorithm itself works on pairs of prefixes.

Define

```text
C[i,j] = the length of an LCS of X[1:i] and Y[1:j]
```

Now inspect only the final symbols of the two prefixes.

### The final symbols are equal

If `X[i]=Y[j]`, that common symbol can be appended to an LCS of the two shorter prefixes:

```text
C[i,j] = C[i-1,j-1] + 1
```

Why shorten both inputs rather than just one? The common final symbol has been selected into the common subsequence, so both inputs must move past it. If the preceding sequence were not optimal for `X[1:i-1]` and `Y[1:j-1]`, replacing it with a longer common subsequence would improve the original answer, contradicting optimality.

### The final symbols are different

If `X[i]≠Y[j]`, those two symbols cannot both be the final symbol of a common subsequence. At least one of them is absent from some optimal solution:

```text
C[i,j] = max(C[i-1,j], C[i,j-1])
```

“At least one” is not exclusive. Both final symbols may be absent. Taking the maximum still covers that case. The base case is that every sequence has LCS length zero with the empty sequence:

```text
C[i,j] = 0                              if i = 0 or j = 0
C[i,j] = C[i-1,j-1] + 1                if X[i] = Y[j]
C[i,j] = max(C[i-1,j], C[i,j-1])       otherwise
```

## From recurrence to table, then back to a sequence

Initialize row zero and column zero to zero. Fill entries in the order `i=1…m`, `j=1…n`. Each entry depends only on its left, upper, and upper-left neighbors, all of which are ready when the entry is reached.

```text
lenLCS(X, Y):
    create an (m+1) × (n+1) table C initialized to 0
    for i = 1 ... m:
        for j = 1 ... n:
            if X[i] = Y[j]:
                C[i,j] = C[i-1,j-1] + 1
            else:
                C[i,j] = max(C[i-1,j], C[i,j-1])
    return C[m,n]
```

This returns only the length. To recover an actual LCS, start at `(m,n)` and walk backward:

- If `X[i]=Y[j]`, prepend that symbol to the answer and set `i←i-1`, `j←j-1`.
- Otherwise, if `C[i,j]=C[i,j-1]`, move left by setting `j←j-1`.
- In the remaining case, move upward by setting `i←i-1`.

If moving left and moving up both preserve the same value, either direction is valid. That means the LCS need not be unique; it does not mean the algorithm is undecided. The slides fill the table for `X=ACGGA` and `Y=ACTG` cell by cell, then mark one backward path from the bottom-right corner. That path is the lecture's most concrete demonstration of step four, solution recovery.

The table has `(m+1)(n+1)` entries and each entry uses a constant number of comparisons and additions. The time is `O(mn)` and the full table takes `O(mn)` space. Reconstruction decreases `i+j` by at least one per step and therefore takes at most `O(m+n)`, which does not change the total time. If only the length is needed, the next row depends only on the current and preceding rows. The slides note that space can therefore be compressed to two rows, or `O(n)` when `n` denotes the shorter input length.

The notes do not present a line-by-line induction proof for the recurrence. They leave it as an exercise and point to CLRS. The lecture provides the optimal-substructure argument through the two final-symbol cases. Saying that the lecture fully proves the LCS recurrence would claim more than the public material contains.

## Unbounded knapsack: capacity is the only required dimension

There are `n` item types. Item `i` has positive weight `w_i` and value `v_i`, and the knapsack has capacity `W`. In the unbounded version, any number of copies of each item may be selected. The objective is to maximize total value without exceeding the capacity.

Let `K[x]` be the maximum value that fits in capacity `x`. Suppose an optimal solution contains item `i`. After removing that copy, the remaining selection must be optimal for capacity `x-w_i`. Otherwise, replace the remainder with a better selection and put item `i` back; that would improve the alleged optimum.

Thus,

```text
K[x] = max_{i : w_i ≤ x} (K[x-w_i] + v_i)
K[0] = 0
```

The bottom-up implementation fills capacities in increasing order:

```text
UnboundedKnapsack(W, w, v):
    K[0] = 0
    for x = 1 ... W:
        K[x] = 0
        for i = 1 ... n:
            if w[i] ≤ x:
                K[x] = max(K[x], K[x-w[i]] + v[i])
    return K[W]
```

The notes give four `(weight,value)` pairs: `(6,25)`, `(3,13)`, `(4,15)`, and `(2,8)`, with capacity 10. Two copies of the weight-three item and two copies of the weight-two item use all ten units of capacity and have value 42. The slides use a different main value table but also obtain 42. They additionally fill a capacity-four example with items `(1,1)`, `(2,4)`, and `(3,6)`, producing `K=[0,1,4,6,8]`. The final value 8 comes from two copies of `(2,4)`, directly illustrating why the version is unbounded.

To return items rather than only a value, the slides add `ITEMS[x]`. Whenever item `i` improves `K[x]`, they copy `ITEMS[x-w_i]` and add `i`. This is intuitive, but an implementation that literally copies an entire set on every update need not retain the simple `O(nW)` cost. A leaner implementation stores only the final chosen item and reconstructs afterward. That modification is an implementation extension, not part of the lecture's formal runtime analysis.

Computing the value table takes `O(nW)` time and `O(W)` space. This is not polynomial in the ordinary bit-length sense. The number `W` occupies only `log W` input bits, while the algorithm performs `W` capacity iterations. The notes call this **pseudo-polynomial** and state that Knapsack is NP-hard. Two nested loops do not justify saying that knapsack has a polynomial-time algorithm. The relevant question is whether the bound is polynomial in numeric values or in the number of bits used to encode them.

## Zero-one knapsack: the state must also record which items are legal

In zero-one knapsack, each item may be selected at most once. Reusing `K[x]` creates a problem: a transition `K[x-w_i]+v_i` may start from a solution that already contains item `i`, silently turning zero-one knapsack back into the unbounded version. The missing information is not capacity. It is the set of items allowed in the subproblem.

Define

```text
K[x,j] = the maximum value with capacity x using only items 1...j
```

An optimal solution has exactly two cases:

1. It excludes item `j`, giving value `K[x,j-1]`.
2. It includes item `j`, provided `w_j≤x`. The remainder may use only the first `j-1` items and has value `K[x-w_j,j-1]+v_j`.

Therefore,

```text
K[x,j] = K[x,j-1]                                      if w_j > x
K[x,j] = max(K[x,j-1], K[x-w_j,j-1] + v_j)             otherwise
```

Initialize `K[x,0]=0` and `K[0,j]=0`, increase `j` one item at a time, and return `K[W,n]`. There are `nW` states and constant work per state, so both time and the direct two-dimensional space are `O(nW)`. The time remains pseudo-polynomial.

In the notes' four-item example, the best zero-one solution changes to A plus C, with weight `6+4=10` and value `25+15=40`. In the slides' five-item example, the optimum has total weight 9 and value 35. The distinction between the two knapsack variants is not that one recurrence contains a `max` and the other does not. It is whether the selected subproblem can legally be combined with the current decision. The `j-1` index enforces that legality.

The lecture does not formally develop a one-dimensional zero-one implementation. If the table is compressed in an implementation, capacities must be updated from large to small so that item `j` reads values from before that item was used. Updating from small to large reintroduces unbounded reuse. That technique belongs in the extension section rather than being presented as slide content.

## Maximum-weight independent set on a tree: one extra condition avoids jumping to grandchildren

In an undirected graph `G=(V,E)`, an independent set is a set of vertices with no edge between any selected pair. Each vertex `u` has weight `w_u`. Maximum Weight Independent Set, or MWIS, maximizes the sum of selected weights. The problem is NP-hard on general graphs. On a tree, the lecture solves it in `O(|V|)`.

Choose any root `r` and let `T_u` be the subtree rooted at `u`. The natural cases are:

- Exclude `u`: every child subtree may use its own optimum.
- Include `u`: none of its children may be included, so selection resumes below them.

If `A(u)` alone denotes the optimum for `T_u`, the second case repeatedly jumps to grandchildren and asks for constrained variants of the same subtrees. The notes therefore define

```text
A(u) = maximum independent-set weight in T_u
B(u) = maximum independent-set weight in T_u with u removed
```

For each child `v`, excluding `u` permits `A(v)`. Including `u` forbids `v`, so it permits `B(v)`. This gives

```text
B(u) = Σ_{v child of u} A(v)
A(u) = max(Σ A(v), w_u + Σ B(v))
```

Run a post-order traversal. At a leaf, set `A(u)=w_u` and `B(u)=0`. At an internal vertex, solve every child first and then evaluate the two sums. Return `A(r)`. Different child subtrees have no edges between them, so their independent solutions can be added safely. The “include or exclude `u`” cases exhaust all possibilities. Those two facts are the core correctness argument.

Each vertex is processed once and each parent-child edge participates in a constant number of sums. The time is `O(|V|)`, the tables take `O(|V|)` space, and a recursive implementation's call stack is bounded by the tree height. The notes and slides mainly return the optimal weight; they do not provide full pseudocode for reconstructing the selected vertex set.

There is also a terminology trap inside the official material. The notes formally define **maximum weight independent set**, while several slides say `maximal independent set`. Maximum means globally best by weight. Maximal merely means no additional vertex can be inserted and can be far from optimum. This article follows the formal problem and recurrence rather than the slide typo.

## The common question: does the state remember enough?

The lecture's four formulations can be summarized as follows:

| Problem | State | Why less information fails | Time | Space in the direct version |
|---|---|---|---:|---:|
| LCS | `C[i,j]` | Both prefixes change | `O(mn)` | `O(mn)` |
| Unbounded Knapsack | `K[x]` | Items may repeat, so capacity suffices | `O(nW)` | `O(W)` |
| 0-1 Knapsack | `K[x,j]` | Each item must be prevented from repeating | `O(nW)` | `O(nW)` |
| Tree MWIS | `A(u),B(u)` | The subtree root must be allowed or forbidden | `O(|V|)` | `O(|V|)` |

A state that is too large wastes time and space. A state that is too small allows transitions to combine illegal partial solutions. Before drawing a matrix, define each state in one complete sentence. Every index change in the recurrence should then have a reason in that sentence.

The lecture also separates computing an optimal value from recovering an optimal object. LCS explicitly traces back through the table. The slides show an auxiliary item structure for knapsack. Tree MWIS omits full reconstruction. Whenever pseudocode returns `C`, `K[W]`, or `A(r)`, check whether the problem asks for a number or for the actual sequence, item collection, or vertex set. A correct recurrence can still return the wrong form of answer.

## The easiest mistakes to make

First, a subsequence is not a substring. LCS may skip symbols but may not reorder them. Second, equal final symbols move diagonally in the LCS table; unequal symbols trigger the upper-versus-left comparison. The notes' reconstruction prose contains one typo that initializes `i=m,j=m`; the pseudocode correctly uses `i=m,j=n`, because the two input lengths need not match.

Third, label `O(nW)` as pseudo-polynomial. With binary encoding, `W` may be exponential in the input length. Fourth, do not omit `j-1` from the zero-one state; doing so may use the same item repeatedly. Fifth, the tree MWIS linear bound depends on the input actually being a tree. On a general graph, child subproblems can have edges between them, so separately optimal solutions cannot be combined safely.

Finally, table orientation is not mathematical content. One line of the notes describes an `n+1 × m+1` array while indexing it as `C[i,j]` for `i≤m,j≤n`. An implementation only needs dimensions and indices to agree. Dependency order is not interchangeable: every state read by a transition must already have been computed.

## Where this lecture sits in the eighteen-lecture sequence

Lecture 12 used shortest paths to introduce recurrences, overlapping subproblems, and tabulation. Lecture 13 carries the same method across strings, knapsacks, and trees, showing that dynamic programming is not another name for a particular graph algorithm. It also prepares the transition to Lecture 14. If a recurrence appears to compare several choices but one can prove that a single local choice always preserves an optimum, dynamic programming can collapse into a greedy algorithm.

The stopping point is therefore not memorizing four recurrences. It is being able to answer three questions on a new problem: What exactly does my state mean? Into which exhaustive cases does an optimal solution split at its final decision? In what order can I compute states so that every dependency is ready? Once those sentences are sound, filling the table is usually the mechanical part.

## Beyond the lecture

The following implementation ideas are not part of the formal Winter 2026 Lecture 13 presentation.

LCS length needs only two rows. Recovering a sequence with less than the full `mn` table requires a more advanced divide-and-conquer reconstruction method. Zero-one knapsack can be compressed to one dimension, but `x` must run from `W` downward. Unbounded knapsack normally runs capacity upward because reuse within the same pass is legal. What looks like a small loop-direction detail controls whether transitions read a newly written value or a value from the preceding item stage.

To reconstruct vertices for tree MWIS, store whether `A(u)` came from including or excluding `u`, then traverse downward from the root. Ties may be resolved arbitrarily or preserved to enumerate multiple optima. These additions do not change the lecture's correctness argument, but they complete step four of the recipe: returning the actual solution.

## References

- [Stanford CS161 Winter 2026 Lecture 13 official page](https://stanford-cs161.github.io/winter2026/lectures/#lecture-13-more-dynamic-programming-lcs-knapsack-independent-set)
- [Lecture 13 notes — More Dynamic Programming](https://stanford-cs161.github.io/winter2026/assets/files/lecture13-notes.pdf)
- [Lecture 13 slides — More Dynamic Programming](https://stanford-cs161.github.io/winter2026/assets/files/Lecture13.pdf)
- [Lecture 13 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture13.md)
