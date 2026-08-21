---
title: "Stanford CS161 Lecture 4: How Median of Medians Guarantees Linear-Time Selection"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, selection, median-of-medians]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 5
tldr: "Selection does not require sorting. Median of medians groups elements by five, selects the median of the group medians as a pivot, and guarantees that the larger recursive side has at most 7n/10+5 elements; substitution proves O(n) worst-case time."
description: "A reading of Stanford CS161 Winter 2026 Lecture 4: kth selection, pivots, median of medians, the balance lemma, its linear recurrence, and a strong-induction correctness proof."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-04-median-selection)

This is post 5 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 4**. Moses Charikar taught it on January 14, 2026. Its official title is [Median and Selection](https://stanford-cs161.github.io/winter2026/lectures/#lecture-4-median-and-selection). I used the one-page pre-lecture exercise, nine-page notes, and 66-slide deck. I did not use the Canvas recording, notebook, or concept checks as sources.

Selection takes an array `A` of `n` numbers and an integer `k∈{1,...,n}` and returns the kth smallest value. The direct solution sorts with MergeSort and reads position `k`, taking `O(n log n)`. But if we need one rank, must we discover the complete order of every other element? Lecture 4 says no: deterministic worst-case selection can run in `O(n)`.

## The minimum already exposes an Ω(n) lower bound

When `k=1`, selection means finding the minimum. A linear scan maintains the smallest value seen and costs `O(n)`. This is optimal. If a deterministic algorithm never inspects some `A[i]`, change that position to a value below its output. The execution remains identical and returns the old answer, which is now wrong. A correct algorithm must let every element be ruled out, giving an `Ω(n)` lower bound.

General selection inherits the linear information requirement. The question becomes whether an algorithm can meet the lower bound, not merely beat sorting by a small factor.

## The Select skeleton: partition, then recurse on one side

Assume distinct elements and use one-indexed `k`:

```text
Select(A, k):
  if |A| = 1: return A[1]
  p = ChoosePivot(A)
  L = {x in A | x < p}
  R = {x in A | x > p}
  if |L| = k-1: return p
  if |L| > k-1: return Select(L, k)
  return Select(R, k-|L|-1)
```

The pivot `p` partitions the array into smaller and larger sides. Unlike QuickSort, Select recurses only into the side containing the answer. If the left side has `k-1` elements, `p` is the kth smallest. If the left side is too large, the rank remains `k`. If the answer lies on the right, its new rank subtracts every left-side element and the pivot itself.

For `[6,4,8,9,5,2,1]`, find the third smallest with `p=5`. The left side is `{4,2,1}`, whose size exceeds `k-1=2`, so the answer is the third smallest on the left: 4. If the original query asked for the sixth smallest, the algorithm would enter `{6,8,9}` with new rank `6-3-1=2`.

## The pivot affects speed, not correctness

Use strong induction: for every distinct-element array of length `n` and valid `k`, `Select(A,k)` returns the kth smallest value.

The base case `n=1` has one valid rank. For the inductive step, split on `|L|`. If `|L|=k-1`, exactly `k-1` elements are smaller than `p`. If `|L|>k-1`, the kth smallest remains in the shorter array `L`, so the inductive hypothesis applies. If `|L|<k-1`, the answer lies in `R` at rank `k-|L|-1`, which remains valid for the shorter right array.

No case requires the pivot to be near the median. **Every pivot is correct; a good pivot is fast.** Correctness and runtime rely on different properties and should be proved separately.

## Worst, ideal, and random pivots

If every pivot is the minimum or maximum, each step removes one element. Partitioning is linear, so:

```text
T(n)=T(n-1)+Θ(n)=Θ(n²)
```

If every pivot were the true median, the larger side would have at most half the elements:

```text
T(n)≤T(n/2)+cn
```

Expanding gives `cn+cn/2+cn/4+...<2cn`, or `O(n)`. But obtaining the median for free is circular: finding it is the selection problem.

A uniformly random pivot also gives `O(n)` expected time and usually small practical constants. The notes state this result without proving it in this lecture. The course wants a deterministic worst-case guarantee, so it needs a pivot that can be found in linear time and is merely close enough to the median.

## The five steps of median of medians

The Blum–Floyd–Pratt–Rivest–Tarjan construction is:

1. Split `A` into `ceil(n/5)` groups of at most five.
2. Sort each group and take its median. Each group has constant size, so the total is `O(n)`.
3. Put the group medians into a set `C`.
4. Recursively select the median `p` of `C`.
5. Partition the original array around `p` and recurse only into the answer's side.

It does not first solve the original median problem. It selects the median of roughly `n/5` representatives. This surrogate is cheaper than the true median but provably avoids the extremes.

## Why the larger side has at most 7n/10+5 elements

Because `p` is the median of the group medians, about half the groups have medians below `p`. In every complete five-element group whose median is below `p`, at least three elements are below `p`: the group median and its two smaller values. After allowing for the group containing `p` and an incomplete final group, the notes show that `p` exceeds at least:

```text
3(ceil(g/2)-2),  g=ceil(n/5)
```

elements. The argument is symmetric above `p`. Therefore:

```text
|L| ≤ 7n/10 + 5
|R| ≤ 7n/10 + 5
```

This is not an exact 30/70 split. It is a worst-case upper bound with a remainder correction. The algorithm needs only to discard a fixed fraction, not to find the exact median.

The “thirty percent discarded” count has two layers. Among `g=ceil(n/5)` groups, because `p` is the median of group medians, at least roughly `g/2` medians are no greater than `p`. In every complete five-element group, at least three elements lie at or below its median. Ignoring exceptions gives `(g/2)·3≈3n/10`. The proof's `-2` conservatively removes the pivot's group and a possibly incomplete tail group; expanding the ceiling absorbs the residue into `+5`.

Group size five is not merely convenient for a diagram. Groups of three would guarantee only about `n/3` on each side, making the recursive fractions approach `1/3+2/3=1` with no slack for linear work. Groups of five use about `n/5` to choose the representative pivot and at most `7n/10` for the answer side. Their sum `9/10<1` is exactly the gap substitution uses to pay for the current level's `cn`.

For a concrete picture, take 25 distinct values in five groups. The median of the five group medians is `p`. At least two complete groups have medians strictly below `p`, each certifying three elements on that side; the greater side is symmetric. Actual elimination is often larger, but the proof counts only what every arrangement guarantees. A worst-case proof promises only what an adversary cannot remove.

## Why the recurrence is linear

Selecting the median of the group medians recursively handles about `n/5` elements. After partitioning, the larger answer-side call has at most `7n/10+5`. Grouping, constant-size sorting, and scanning are linear:

```text
T(n) ≤ T(n/5+1) + T(7n/10+5) + cn
```

The Master Theorem does not apply because the two child sizes differ. The notes first simplify the constants:

```text
T(n) ≤ T(n/5)+T(7n/10)+cn
```

Guess `T(n)≤dn`. Under the inductive hypothesis:

```text
T(n) ≤ dn/5 + 7dn/10 + cn
     = (9d/10+c)n
```

Choosing `d≥10c` makes the expression at most `dn`, proving `O(n)` for the simplified recurrence. The exact `+1,+5` version needs an adjusted base threshold, a shifted function, or a stronger proposition. The slides flag that technical issue without making its complete algebra the main line. This article does not present the simplified proof as if it had handled every rounding constant.

The recursive calls have different jobs. `T(n/5+1)` **chooses the pivot**; `T(7n/10+5)` **finds the original answer**. Unlike MergeSort, they do not produce two half-answers to merge. Omitting the first makes median of medians free, while recursing on both partition sides turns selection into a sorting-like problem.

The exact constants show why rigor needs care. Substituting `T(m)≤dm` directly into the recurrence with `+1,+5` creates roughly `6d` of fixed residue, which coefficient comparison does not erase. One repair proves the claim only beyond a threshold `n₀` with extra slack; another guesses `T(n)≤dn-e` or shifts the input. The lecture asks for this proof direction, not for pretending the simplified recurrence is exact.

Finally, the linear bound and correctness remain independent proof chains. A mistaken balance lemma can make Select slow without making arbitrary-pivot Select return the wrong rank. Conversely, a beautiful split cannot save code that forgets to subtract `|L|+1` when recursing right. Keeping “ordering proves the answer” separate from “elimination proves time” prevents assumptions from leaking across claims.

That separation also suggests layered implementation tests. First enumerate small arrays and ranks and check every result against the `k`th value after full sorting. Then separately record recursive sizes and verify the median-of-medians elimination guarantee. Correct outputs do not prove worst-case linear time, and attractive split ratios do not prove correct rank updates.

Space depends on the partition implementation. The notes' pseudocode creates `L` and `R`, naturally using linear extra storage. In-place partitioning can reduce allocation, but median-of-medians still manages groups and recursion. The official guarantee in this lecture is about time, not a precise space bound for an unspecified implementation.

## Three common errors

First, forgetting to subtract the pivot in the right-side rank. The expression is `k-|L|-1`, not `k-|L|`.

Second, charging each five-element sort as though its size grew with `n`. Each group always has at most five elements, so its cost is constant and the total over all groups is linear.

Third, reporting `7n/10+5` as an exact 70/30 split. It is a bound on either side, and the `+5` accounts for edge groups.

The lecture also assumes distinct elements. With duplicates, a robust implementation uses a three-way partition into `<p`, `=p`, and `>p` and checks whether `k` falls inside the equal block. The notes say the idea generalizes but do not present the complete version, so this article keeps duplicate handling outside the published pseudocode.

## Where Lecture 4 sits in the eighteen-lecture path

Lecture 4 accomplishes two things. It gives the course's first surprising algorithm that meets a linear lower bound, and it immediately demonstrates the Master Theorem's boundary by requiring substitution for unequal child sizes.

Lecture 5 preserves pivots and partitioning but changes “recurse on one side” into “sort both sides,” producing QuickSort. Median of medians offers a deterministic worst-case guarantee; a random pivot introduces expected runtime. Reading the lectures together separates correctness, pivot quality, and randomness into three distinct questions.

For a self-test, take 25 distinct values, group them by five, circle every group median, then circle the median of those medians. Do not sort the entire input. Count only the elements guaranteed to lie on each side. If you can derive the 30-percent elimination from “half the groups, three values per group,” the balance lemma has become an argument rather than a memorized `7/10`.

## Beyond the lecture

Production implementations often prefer random pivots because the code is short and constants are low. Deterministic selection matters when adversarial inputs or latency tails matter more than average throughput. State the threat model first: can an attacker arrange inputs, and is a rare quadratic path acceptable? Then choose the pivot strategy.

Also compare the value of the outputs. If a program will ask for many different ranks, paying `n log n` once to sort may be amortized over later constant-time queries. If it needs one median, linear selection realizes its full advantage. Complexity belongs to the whole workload, not merely to a function name.

## References

- [Stanford CS161 Winter 2026 Lecture 4](https://stanford-cs161.github.io/winter2026/lectures/#lecture-4-median-and-selection)
- [Lecture 4 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-pre.pdf)
- [Lecture 4 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-notes.pdf)
- [Lecture 4 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-slides.pdf)
