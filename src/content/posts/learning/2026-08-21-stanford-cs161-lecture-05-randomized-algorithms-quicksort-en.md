---
title: "Stanford CS161 Lecture 5: Proving Randomized QuickSort's Expected Time"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, quicksort, randomized-algorithms]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 6
tldr: "Randomized QuickSort has O(n log n) expected time on every fixed input but Θ(n²) worst-case time. The valid proof does not substitute expected subproblem sizes into a recurrence; it computes the probability that each pair is compared."
description: "A guide to Stanford CS161 Winter 2026 Lecture 5: Las Vegas algorithms, QuickSort, the invalid average-split argument, indicator variables, linearity of expectation, and in-place partitioning."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-05-randomized-algorithms-quicksort)

This is post 6 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 5**. Moses Charikar taught the lecture on January 21, 2026. Its official title is [Randomized Algorithms and QuickSort](https://stanford-cs161.github.io/winter2026/lectures/#lecture-5-randomized-algorithms-and-quicksort). This article uses the pre-lecture exercise, notes, and slides. I did not use the Canvas recording or claim to have read the notebook.

Lecture 4's Select partitions around a pivot and recurses only on the side containing the answer. QuickSort keeps the same structure but sorts both sides. That small change makes pivot quality more consequential: near-halves give `O(n log n)`, while repeated `0` versus `n-1` splits give `Θ(n²)`. Lecture 5 asks for more than the intuition that random pivots are usually decent. For any fixed input, taking expectation only over the algorithm's coins, how can we rigorously prove `O(n log n)`?

## What a randomized guarantee guarantees

A randomized algorithm makes random choices during execution, so runtime becomes a random variable even on one fixed input. The lecture uses the **Las Vegas algorithm** category: the output is always correct, while runtime depends on randomness—“always works, probably fast.” Randomized QuickSort is Las Vegas. A bad pivot makes it slower, not wrong.

Three quantities must remain distinct:

1. **Expected runtime:** an adversary first fixes the input; expectation is only over the algorithm's random choices.
2. **Worst-input expected runtime:** take that expectation for every fixed input, then maximize over inputs. The QuickSort proof gives `O(n log n)` for every fixed permutation.
3. **Worst-case runtime:** even the random outcomes are chosen adversarially. Randomized QuickSort remains `Θ(n²)` if every pivot is extreme.

Expected analysis is not average-case input analysis. It need not assume real inputs are uniformly random. Even an intentionally arranged input receives the expected guarantee because the pivots, not the input order, provide the randomness.

## BogoSort: having an expectation is not enough

BogoSort repeatedly chooses a uniform random permutation and tests whether it is sorted. For `n` distinct elements, the unique sorted permutation appears with probability `1/n!` each round, so the expected number of rounds is `n!`. A shuffle and check costs `O(n)`, giving expected time

```text
O(n · n!).
```

Its worst-case runtime is infinite: some random outcome sequences never produce sorted order. BogoSort is a calibration device, not an implementation. It forces every complexity statement to say “expected” or “worst case” and to identify what randomness the expectation covers.

## QuickSort's partition-and-recurse skeleton

Assume distinct elements for now:

```text
QuickSort(A):
  if |A| <= 1: return A
  uniformly choose pivot x from A
  L = [a in A where a < x]
  R = [a in A where a > x]
  return QuickSort(L) ++ [x] ++ QuickSort(R)
```

Correctness should be separated from pivot quality. Strong induction on length supplies the proof: arrays of size at most one are sorted; in the inductive step, both shorter recursive results are sorted, every element of `L` is below `x`, and every element of `R` is above `x`, so their concatenation is sorted. The official notes leave the formal proof as an exercise, so this is a proof skeleton completed from their hint, not a claim that the notes spell it out.

Pivot choice does not affect this correctness argument, but it shapes the recursion tree. Always choosing the minimum creates partition costs `n-1,n-2,...,1`, totaling `Θ(n²)`. An exact median at every level would give `O(log n)` depth and `O(n)` partition work per level, hence `O(n log n)`, but finding an exact median is not free. A random pivot is attractive because it is simple and achieves expected `O(n log n)`.

## A plausible but invalid proof

The random pivot's rank is uniform, so

```text
E[|L|] = E[|R|] = (n-1)/2.
```

It is tempting to substitute `(n-1)/2` into the recurrence, write `E[T(n)]≈2E[T(n/2)]+O(n)`, and invoke the Master Theorem. But runtime is a nonlinear function of subproblem size, and in general

```text
E[f(X)] != f(E[X]).
```

The slides expose the error with SlowSort. Imagine choosing the pivot uniformly from only the minimum and maximum. The expected left and right sizes are still `(n-1)/2`, apparently an average split in half. Yet every actual call has one side of size `n-1` and one empty side. With probability one, the algorithm follows a long chain and takes `Θ(n²)`.

The lesson extends beyond QuickSort: knowing a random variable's mean does not license plugging that mean into an arbitrary cost function. We need a representation through which expectation can legally pass, or a recurrence that averages the recursive cost itself over all outcomes.

In short, average input size is not a proxy for average work; expectation must be taken over the actual cost random variable.

## Ask which pair is compared

Name the elements by sorted rank:

```text
z_1 < z_2 < ... < z_n.
```

Define the indicator `X_{i,j}` to be 1 if `z_i` and `z_j` are ever compared directly, and 0 otherwise. A pair can be compared at most once: comparison occurs when one member becomes a pivot, after which that pivot belongs to no recursive subproblem.

When do `z_i` and `z_j` meet? Consider only the contiguous rank interval `{z_i,...,z_j}`. If its first pivot is an interior element, that pivot separates the endpoints into different subproblems forever. If the first pivot is `z_i` or `z_j`, the endpoints are compared. Each of the `j-i+1` elements is equally likely to be first, so

```text
P[X_{i,j}=1] = E[X_{i,j}] = 2/(j-i+1).
```

For example, five elements lie from `z_2` through `z_6`. They are compared exactly when either endpoint is the first pivot among those five, for probability `2/5`.

## Linearity of expectation decomposes the global cost

Let the total number of comparisons be

```text
C = Σ_{1≤i<j≤n} X_{i,j}.
```

Linearity gives `E[ΣX]=ΣE[X]` without requiring independence. That matters because one pivot plainly affects many pairs at once; no false independence assumption is needed.

```text
E[C]
  = Σ_{i<j} 2/(j-i+1)
  = Σ_i Σ_{k=2}^{n-i+1} 2/k
  ≤ 2n Σ_{k=2}^{n} 1/k
  ≤ 2n ln n
  = O(n log n).
```

The harmonic sum contributes `log n`, and the possible starting ranks contribute `n`. This proof never claims every partition is balanced. It permits bad pivots while exactly accounting for how likely each rank pair is to meet before an interior pivot separates it.

## From comparisons to total runtime

We still need to connect `E[C]` to program cost. A partition on `k` elements compares the pivot with the other `k-1` elements and performs `O(k)` scanning or swapping work. Across nontrivial calls, partition work is bounded by a constant times the comparison count; there are at most `n` singleton base calls. Thus total time is

```text
O(C+n),
```

and taking expectation yields `O(n log n)`. This holds for every fixed input of distinct values. It is not merely a result for random input permutations, nor is it automatically a high-probability statement. The lecture proves an expectation bound only.

The notes give an alternative route. If `T(n)` is expected comparisons and the pivot rank is uniform,

```text
T(n) = n-1 + (2/n) Σ_{i=1}^{n-1} T(i).
```

Strong induction guesses `T(i)≤2i ln i`; an integral bound on an increasing sum, using `∫2x ln x dx=x²ln x-x²/2+C`, closes it. Unlike the invalid proof, this recurrence averages the recursive costs over every possible rank instead of replacing the rank with its average.

## In-place partitioning and implementation boundaries

The conceptual pseudocode allocates `L` and `R`, which is easy to reason about but needs extra storage. The slides illustrate in-place partitioning: swap the random pivot to the end, scan the remaining values with a boundary, move each smaller value into the left region, then place the pivot at the boundary and recurse on the two segments. This removes separate `L` and `R` allocations, though stack usage still depends on split shapes.

QuickSort is usually unstable because swaps can change equal-key order. The analysis also assumed distinct elements. With many duplicates, a two-way partition can split poorly; implementations often use three regions `<`, `=`, and `>`. Such variants do not change this lecture's conceptual purpose, but we should not pretend that the materials prove every version identically.

The slides contrast QuickSort—easy in-place partitioning, good expected time, quadratic worst case—with MergeSort—deterministic `O(n log n)` worst-case time and natural stability, but typically extra merge space for arrays. This is a design tradeoff, not a universal speed ranking. Claims about what a language's current standard-library sort uses are version-sensitive, so this article does not preserve classroom examples as timeless facts.

## Where this lecture fits in the course

Lectures 4 and 5 share pivots, partitioning, and recursion but require different analyses. Select follows one side and combines a deterministic balance lemma with median of medians for worst-case linear time. QuickSort follows both sides and combines random pivots with pairwise probability for expected `n log n`. Similar code shapes do not imply identical recurrences or guarantee types.

This lecture also turns indicators and linearity of expectation into algorithm-analysis tools. Whenever the target is a total count of events, define one 0/1 variable per local event and write the total as their sum. The power lies not in independence but in expectation commuting with addition.

A useful paper exercise fixes `z_1,...,z_6` and lists which first pivots make `z_2,z_6` meet or separate. Then compare adjacent pairs with distant pairs. If you can explain why an interior pivot permanently separates the endpoints, you understand the proof rather than merely memorizing `2/(j-i+1)`.

## Beyond the lecture

Expected time does not say how likely runtime is to exceed a latency threshold. Systems that care about tail latency can study high-probability bounds or use a hybrid that limits recursion depth and switches to a worst-case `O(n log n)` sorter. Winter 2026 Lecture 5 does not prove those results, so they belong outside the lecture reconstruction.

Randomness also has engineering assumptions: pivot selection should be sufficiently uniform, and random generation has a cost. Against an adversary that can observe or predict the random source, “random pivot” may not provide the intended defense. Before applying the theorem, restate its input adversary, randomness source, and cost model.

## References

- [Stanford CS161 Winter 2026 Lecture 5](https://stanford-cs161.github.io/winter2026/lectures/#lecture-5-randomized-algorithms-and-quicksort)
- [Lecture 5 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-pre.pdf)
- [Lecture 5 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-notes.pdf)
- [Lecture 5 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-slides.pdf)
