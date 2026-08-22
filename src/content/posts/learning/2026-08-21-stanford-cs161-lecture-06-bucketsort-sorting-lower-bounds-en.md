---
title: "Stanford CS161 Lecture 6: Sorting Lower Bounds and Linear-Time Radix Sort"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, sorting, radix-sort]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 7
tldr: "The Ω(n log n) lower bound applies to comparison sorting. When integer keys can index buckets directly, stable Counting Sort can power Radix Sort and achieve O(n) under conditions such as M≤n^c."
description: "A guide to Stanford CS161 Winter 2026 Lecture 6: comparison decision-tree lower bounds, Counting Sort, stability, LSD Radix Sort, and the radix/digit tradeoff."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-06-bucketsort-sorting-lower-bounds)

This is post 7 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 6**. Moses Charikar taught it on January 26, 2026. The official component calls it [BucketSort and Lower Bounds for Sorting](https://stanford-cs161.github.io/winter2026/lectures/#lecture-6-bucketsort-and-lower-bounds-for-sorting). The notes say *Sorting Lower Bounds, Counting Sort, and Radix Sort*, while the slides say *Sorting lower bounds and O(n)-time sorting*. I preserve the page's BucketSort label while noting that the concrete bucket algorithm in the materials is called Counting Sort. Sources used here are the pre-lecture exercise, notes, and slides; I did not use the Canvas recording.

The first five lectures obtained ordering information through comparisons. MergeSort already has worst-case `O(n log n)` time, so can sorting reach `O(n)`? The answer begins with a different question: **what may the algorithm do with a key?** Lecture 6 first proves `Ω(n log n)` in the comparison model, then leaves that model by reading integer keys directly in Counting Sort and Radix Sort. There is no contradiction.

## Lower bounds depend on a computational model

Comparison-based sorting can learn order only by comparing two elements. It cannot use a key as an array index, inspect a digit, or distribute objects through arithmetic on key values. However complicated the algorithm is, it distinguishes input orders through comparison answers.

The lower-bound statement therefore needs its model: every deterministic comparison sorter has some input requiring `Ω(n log n)` comparisons. It does not say every possible sorting method in every model needs that time. Once finite-range keys may be read directly, the information interface changes and the bound no longer applies as stated.

## Draw comparison sorting as a decision tree

Fix a deterministic comparison algorithm and `n` distinct objects. Represent every possible execution as a binary decision tree:

- An internal node is a yes/no comparison such as “is `a_i<a_j`?”
- Its branches are the two answers.
- A leaf is the final permutation claimed by the algorithm.
- A particular input follows one root-to-leaf path, whose length is its comparison count.

There are `n!` relative orders of `n` distinct objects. A correct algorithm must distinguish them, so its tree needs at least `n!` output leaves. A binary tree of maximum depth `h` has at most `2^h` leaves, hence

```text
2^h ≥ n!
h ≥ log₂(n!).
```

Stirling's asymptotic estimate gives

```text
log(n!) = Θ(n log n).
```

Even a rougher inequality suffices: `n! ≥ (n/2)^(n/2)`, so `log₂(n!) ≥ (n/2)log₂(n/2)=Ω(n log n)`. Some path—and therefore some input—requires that many comparisons. MergeSort's worst-case `O(n log n)` matches the model lower bound and is asymptotically optimal among comparison sorters. This says nothing about smallest constants or universal practical superiority.

The slides also state that randomized comparison sorting has an expected `Ω(n log n)` lower bound, but explicitly omit its proof. The deterministic leaf-count argument cannot simply be relabeled as a randomized proof: a randomized algorithm behaves like a distribution over deterministic trees and needs an additional argument. This article preserves the classroom result without inventing a missing proof.

## Birthday months reveal an exit

The pre-lecture exercise sorts students by birth month. With only twelve keys, repeated student-to-student comparisons are unnecessary. Create twelve buckets, scan the students into their months, then concatenate January through December. Reading the month directly already leaves the pure comparison model.

That is how to read a lower bound correctly. The new algorithm has not refuted the theorem; it uses an operation the theorem forbids. Finite integer keys provide extra structure, paid for through bucket count and key representation in the time and space analysis.

## Counting Sort: map keys directly to buckets

Suppose `n` objects have keys in `{0,...,r-1}`. The lecture's Counting Sort is

```text
CountingSort(A, key, r):
  create FIFO buckets B[0], ..., B[r-1]
  for x in A, in input order:
    append x to B[key(x)]
  return B[0] ++ B[1] ++ ... ++ B[r-1]
```

Some textbooks reserve “Counting Sort” for an array implementation using counts and prefix sums. This lecture uses FIFO linked-list buckets to express the same finite-key grouping idea. The component's BucketSort title and the notes' Counting Sort procedure are different naming levels, not evidence for silently rewriting the source terminology.

Correctness is direct. If `key(x)<key(y)`, `x`'s bucket is emitted first. Equal-key objects enter one bucket; appending at the tail in input order preserves their relative order, so the algorithm is **stable**.

Creating `r` buckets costs `O(r)`, distributing `n` objects costs `O(n)`, and scanning or joining the buckets costs `O(n+r)`. Total time is

```text
O(n+r),
```

and space also depends on `n+r`. If `r=O(n)`, this is linear. If ten objects have keys ranging to a billion, allocating a billion buckets is unreasonable. Counting Sort exchanges comparisons for initialization and storage tied to the key universe.

## Stability is not decoration

For one Counting Sort pass, arbitrary order among equal keys may be acceptable. Radix Sort performs several passes, however, and a later high-digit pass must preserve the low-digit ordering established earlier. Stability becomes a correctness condition.

If two numbers share a tens digit but have different ones digits, the first pass orders them. On the tens pass they enter the same bucket; arbitrary reordering would destroy that result. FIFO append preserves it. Replacing append with push-to-front would still group one pass by key but would be unstable and would invalidate this lecture's LSD Radix Sort proof.

## Radix Sort: begin with the least significant digit

Treat each nonnegative integer as a `d`-digit base-`r` number, padding shorter values with leading zeros. LSD Radix Sort applies stable Counting Sort to the least significant digit, then the next digit, through the most significant:

```text
for position = 0 to d-1:
  stable-CountingSort(A, digit(position), r)
```

The slides use

```text
21, 345, 13, 101, 50, 234, 1.
```

After padding to three digits and sorting by ones, tens, then hundreds, the result is

```text
1, 13, 21, 50, 101, 234, 345.
```

The first pass guarantees only ones-digit order. The second groups by tens while stability retains the ones order inside equal tens; the third completes numeric order.

Why not reverse the loop and start with the most significant digit? A later whole-array low-digit sort can move values across previously established high-digit groups. MSD Radix Sort exists, but it uses a different structure, such as recursion within each high-digit bucket. It is not obtained merely by reversing this LSD loop.

## The inductive correctness proof

Claim: after pass `k`, the array is sorted by the value represented by its lowest `k` digits.

For `k=0` the claim is vacuous, or use `k=1` from Counting Sort correctness. In the inductive step, consider two numbers. If digit `k` differs, the current buckets order them. If digit `k` is equal, the stable inner sort preserves their incoming order, which by induction is already correct on the lower `k-1` digits. Thus the result is sorted on the lowest `k` digits. At `k=d`, all digits participate and the entire numeric order is correct.

The proof identifies two necessities: process digits LSD-first and use a stable inner sorter. Memorizing that Radix Sort is linear without these invariants gives no explanation of why it works.

## The tradeoff among `r`, `d`, and maximum key `M`

Each Counting Sort pass costs `O(n+r)`, and there are `d` passes:

```text
T(n)=O(d(n+r)).
```

For maximum key `M`, base `r` requires

```text
d = floor(log_r M)+1.
```

The `+1` matters: when `M<r`, `log_r M<1`, but data still needs one digit and one pass. A larger radix reduces digits while increasing buckets per pass; a smaller radix uses fewer buckets but more passes.

The slides reinterpret the decimal example in base 100: fewer passes, but 100 buckets. Choosing `r=n` balances scanning the input with bucket initialization and yields

```text
O(n(floor(log_n M)+1)).
```

If `M≤n^c` for constant `c`, then `log_n M≤c`, the pass count is constant, and runtime is `O(n)`. That is the precise condition behind this lecture's linear-time sorting. If `M=2^n`, then `log_n M=n/log₂n`, giving approximately

```text
O(n²/log n).
```

It can be worse than `n log n`; key size is not a disposable footnote. The cost of extracting a digit or computing a bucket index also depends on a word-operation model. Arbitrary-precision keys may require accounting for representation costs.

## No lower bound was broken; the interface changed

The decision-tree proof says that binary comparison answers need `Ω(n log n)` depth to distinguish `n!` orders. Counting Sort reads a key and selects one of `r` locations; Radix Sort directly indexes by digits. They operate through a richer interface and do not beat the bound within its own model.

Nor is non-comparison sorting automatically faster. A huge key range, many digits, or expensive bucket initialization can make `O(d(n+r))` lose to a comparison sorter. Algorithm choice should ask whether keys are finite integers, how `M` scales with `n`, whether memory holds `r` buckets, and whether stability is required.

The lecture also assumes fixed-length, nonnegative base-`r` representations. Signed integers, variable-length strings, and composite keys admit radix techniques, but signs, terminators, and lexicographic rules need extra design. Winter 2026 Lecture 6 does not develop those cases, so they are not folded into the classroom algorithm here.

## Where this lecture fits in the course

Lecture 6 moves asymptotic analysis to the level of models. Earlier lectures asked how fast one algorithm runs; here the course asks how fast an entire algorithm class could possibly run, then shows what changes when permitted operations change. Lower and upper bounds are comparable only under the same problem, model, and guarantee.

For a paper check, run `21,345,13,101,50,234,1` through every pass and draw arrows between equal-digit values to track their prior order. Then deliberately make the buckets push to the front and locate the first failure. Stability becomes a mechanical condition in the inductive proof rather than a vocabulary term.

## Beyond the lecture

A formal randomized comparison lower bound must reason about a distribution over deterministic trees, often through distributional arguments. The official slides state but omit the proof. Any full addition should use a separate primary source and be marked as extension rather than quietly renaming deterministic leaf counting.

Production radix implementations often use fixed machine words, array counting, and alternating buffers instead of linked-list buckets. Those choices can improve cache locality and constants without changing the central tradeoff: each pass touches `n` items, the radix controls bucket work, and word width controls pass count. The formula `d(n+r)` is an evaluation framework, not a substitute for measurement.

## References

- [Stanford CS161 Winter 2026 Lecture 6](https://stanford-cs161.github.io/winter2026/lectures/#lecture-6-bucketsort-and-lower-bounds-for-sorting)
- [Lecture 6 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-pre.pdf)
- [Lecture 6 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-notes.pdf)
- [Lecture 6 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-slides.pdf)
