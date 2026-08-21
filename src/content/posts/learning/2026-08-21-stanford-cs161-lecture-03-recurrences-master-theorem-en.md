---
title: "Stanford CS161 Lecture 3: Reading a Recursion Tree Through the Master Theorem"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, recurrence, master-theorem]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 4
tldr: "For T(n)=aT(n/b)+O(n^d), the central comparison is branching growth a versus per-problem shrinkage b^d. Equality makes every level equally heavy, a<b^d makes the root dominate, and a>b^d makes the leaves dominate; outside the template, use substitution."
description: "A reading of Stanford CS161 Winter 2026 Lecture 3: recurrences, recursion trees, the three Master Theorem cases, their geometric-series intuition, substitution, and the theorem's boundary."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-03-recurrences-master-theorem)

This is post 4 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 3**. Moses Charikar taught it on January 12, 2026. Its official title is [Solving Recurrences and the Master Theorem](https://stanford-cs161.github.io/winter2026/lectures/#lecture-3-solving-recurrences-and-the-master-theorem). I read the public pre-lecture exercise, six-page notes, and 54-slide deck. I did not use the Canvas recording or claim to have read the concept checks.

One source discrepancy belongs up front. The component and slides identify the lecture as recurrences, the Master Theorem, and substitution. The notes cover exactly those subjects, but their cover says “Solving Recurrences and the Selection Problem.” Selection does not appear in the body and begins in Lecture 4. This article follows the official lecture title and the actual material rather than expanding a stale cover title into a nonexistent agenda.

Lecture 2 computed MergeSort's entire recursion tree. Lecture 3 turns that calculation into a reusable method: translate code into a recurrence, then identify which levels dominate the total work. The Master Theorem is the shortcut. Substitution is the proof route that remains when the shortcut does not fit.

## A recurrence includes more than its right-hand side

Suppose a divide-and-conquer algorithm creates `k` smaller problems of sizes `n₁,...,n_k` and performs `O(f(n))` additional work at the current level. Its worst-case time can be written as:

```text
T(n) ≤ c f(n) + Σ T(nᵢ)
```

It also needs a base case such as `T(1)=O(1)`. Without one, the recurrence does not fully define a function. Different base constants produce different exact functions. Asymptotic analysis often suppresses the base case because a fixed cost on fixed-size inputs normally does not change the growth order, not because the base case has vanished.

Equality and inequality also differ. `T(n)=2T(n/2)+n` defines a function exactly. `T(n)≤2T(n/2)+11n` supplies only an upper bound. That inequality is enough to prove an `O(...)` claim, but it does not imply that the algorithm always performs all the bounded work.

## Three old algorithms, three recurrences

Lecture 3 first retrieves examples from the previous lectures.

The direct recursive multiplication uses four half-size products plus linear addition and combination:

```text
T(n) = 4T(n/2) + O(n)
```

Karatsuba reconstructs the cross term with three products:

```text
T(n) = 3T(n/2) + O(n)
```

MergeSort recursively sorts two halves and merges them linearly:

```text
T(n) = 2T(n/2) + O(n)
```

Only the coefficients 4, 3, and 2 change, but the answers are `O(n²)`, `O(n^{log₂3})`, and `O(n log n)`. The Master Theorem explains how a small change in branching moves the dominant work to a different part of the tree.

## The Master Theorem's three parameters

The simplified theorem handles:

```text
T(n) = aT(n/b) + O(n^d)
```

- `a≥1` is the number of child problems created by one problem.
- `b>1` is the factor by which each child shrinks.
- `d` is the exponent in the nonrecursive split-and-combine work.

The result is:

```text
a = b^d  => O(n^d log n)
a < b^d  => O(n^d)
a > b^d  => O(n^(log_b a))
```

Memorizing three lines is easy. Knowing why they hold is what lets you recognize when they do not apply. The explanation lies in the total work on each recursion-tree level.

## Every level compares a with b^d

At level `j`, the tree contains `a^j` problems, each of size `n/b^j`. Counting only the nonrecursive work at a node, one problem costs at most:

```text
c(n/b^j)^d
```

The whole level therefore costs:

```text
a^j × c(n/b^j)^d
= c n^d (a/b^d)^j
```

The depth is about `log_b n`, so the total is the geometric series:

```text
c n^d Σ(j=0...log_b n) (a/b^d)^j
```

The cases now follow without rote memory.

If `a=b^d`, the ratio is one. Every level contributes `cn^d`; multiplying by about `log_b n` levels gives `O(n^d log n)`.

If `a<b^d`, the ratio is below one. Successive levels become lighter, the first level dominates the geometric sum, and the result is `O(n^d)`.

If `a>b^d`, each lower level is heavier. The leaves dominate. Their number is `a^{log_b n}=n^{log_ba}`, producing `O(n^{log_ba})`.

The slides frame this as a struggle between branching and shrinkage. `a` widens the tree. `b^d` reduces the cost of an individual problem. The winner determines where the work lives.

## Four substitutions into the theorem

For direct recursive multiplication, `a=4,b=2,d=1`, so `b^d=2` and branching wins. The third case gives:

```text
T(n)=O(n^(log₂4))=O(n²)
```

Karatsuba has `a=3,b=2,d=1`. It remains in the third case, but the leaf exponent falls:

```text
T(n)=O(n^(log₂3))≈O(n^1.585)
```

MergeSort has `a=2,b=2,d=1`, an exact balance in which every level costs linear work:

```text
T(n)=O(n log n)
```

For `T(n)=T(n/2)+O(n)`, `a=1<b^d=2`. The root's `n` term already matches the order of every lower level combined:

```text
n+n/2+n/4+... < 2n
```

The result is `O(n)`. Together, the four examples cover top-heavy, balanced, and bottom-heavy trees. They also show why `d` cannot be ignored: counting recursive calls alone omits the combine work.

## Substitution: guess, then turn the guess into a proposition

The substitution method is more general than the Master Theorem. Its workflow is:

1. Use expansion, a recursion tree, or prior insight to guess a growth function.
2. Strengthen `O(g(n))` into a proposition with a fixed constant, such as `T(n)≤Cg(n)`.
3. Check what the base case requires of the constant.
4. Assume the proposition for all smaller inputs, substitute it into the recurrence, and prove it for `n`.

The slides use:

```text
T(n)=2T(n/2)+32n,  T(2)=2
```

The Master Theorem suggests `O(n log n)`. The inductive hypothesis cannot simply say `T(n)=O(n log n)`: the hidden constant could silently change between recursive levels, leaving no algebraic statement to prove. Write instead:

```text
T(n) ≤ C n log n
```

Assuming the claim for smaller inputs:

```text
T(k)
≤ 2C(k/2)log(k/2)+32k
= Ck(log k-1)+32k
= Ck log k +(32-C)k
```

If `C≥32`, the final term is nonpositive, so the inductive step closes. The base case only requires `C≥1`; choosing `C=32` satisfies both. Only then do we invoke the Big-O definition and return to `T(n)=O(n log n)`.

## An induction can fail for two different reasons

Guess `T(n)≤dn` for `T(n)=2T(n/2)+n`. Substitution requires:

```text
n + 2d(n/2) ≤ dn
n + dn ≤ dn
```

This is impossible. Here the growth-order guess is wrong; the answer is `n log n`.

But a failed induction can also mean that the proposition is too weak. For `T(n)≤2T(n/2)+1`, the true order is linear. Guessing `T(n)≤cn` yields the impossible `cn+1≤cn`. Strengthen the statement to `T(n)≤cn-1`, however, and substitution returns exactly `cn-1`.

That distinction is central. Substitution is not pattern matching. It is the design of an inductive proposition with enough slack to absorb the recurrence's error terms. When the algebra fails, ask whether the order is wrong or the claim needs a lower-order correction.

## When the simplified theorem does not apply

The clearest boundary is unequal subproblem sizes. Lecture 4's deterministic selection algorithm will produce:

```text
T(n) ≤ T(n/5) + T(7n/10) + O(n)
```

There is no common `aT(n/b)` term. Replacing the two calls with equal calls of their average size would make the expression look neat but would alter the tree and its guarantee. This is precisely where the course prepares substitution as the right tool.

Floors, ceilings, and terms such as `n/b+1` are another technical boundary. The notes say that the theorem extends to some rounded versions but do not prove the extension here. A homework solution may explicitly assume that `n` is a power of `b` when permitted. A rigorous arbitrary-`n` proof needs monotonicity, padding, or a more general theorem; it cannot silently erase the symbols.

The notes also state a more general Master Theorem. Its third case includes a regularity condition `af(n/b)≤cf(n)` for some `c<1`, in addition to requiring `f(n)` to be polynomially larger than `n^{log_ba}`. The condition ensures regular decay. Looking only at the apparent exponent is not enough.

A mechanical preflight helps: is `a` fixed, are all subproblems the same size `n/b`, can nonrecursive work be described by one `n^d` order, and does a constant-size base case stop the recurrence? If any answer is unclear, do not choose a case yet. The Master Theorem rapidly classifies recurrences matching its shape; it does not automatically translate every recursive program.

First ensure the recurrence did not omit work. An array-slicing MergeSort may pay linear time for slicing; because merge is already linear, it can be included in `O(n)`. But if a hidden step fully sorts each subarray, `2T(n/2)+O(n)` is already a false model. Applying the theorem perfectly would only solve the wrong problem. A tool cannot repair a modeling error.

The three cases also provide a sanity check. If the leaf count `a^{log_b n}=n^{log_ba}` grows faster than accumulated local work, leaves dominate. If both match, comparable work at every level adds a `log n` tree height. If root work `n^d` grows faster, upper levels dominate. A calculated case that contradicts the recursion-tree picture should trigger a recheck of `a,b,d`, not blind trust in substitution.

The checklist preserves the recurrence's meaning and premises before calculation begins.

## Boundaries of time, space, and exact values

The Master Theorem solves the recurrence supplied to it. A recurrence about time does not automatically answer space usage. If the current-level term omits array copies, the theorem will not restore them. Writing the correct recurrence from the algorithm is often harder and more important than applying the formula.

Likewise, `O(n log n)` is not an exact operation count. Base cases, coefficients, and lower-order terms all affect measurements. The theorem discards them deliberately to compare how strategies scale. It does not claim that every input size follows the same timing curve.

## Where Lecture 3 sits in the eighteen-lecture path

Lecture 3 consolidates the first two lectures into an analysis workflow. For any recursive algorithm, identify the number of subproblems, their sizes, the current-level work, and the base case. Use the Master Theorem when the shape fits. Use substitution or rebuild the tree when it does not.

Lecture 4 immediately introduces an algorithm outside the template. Median-of-medians recursively handles a problem near `n/5` and another no larger than `7n/10`. The adjacent placement makes the theorem's value and its boundary visible together.

Do not begin your self-test by memorizing the three cases. Draw trees for `T(n)=4T(n/2)+n`, `2T(n/2)+n`, and `T(n/2)+n`, and label the total work on each level. Once you can identify “leaves, every level, root” before looking at the theorem, the formulas become compressed understanding rather than three lines of incantation.

## Beyond the lecture

For an irregular recurrence, two first moves are useful. Expand the first few levels and ask whether total level costs form a geometric pattern. Then make an upper-bound guess with an adjustable constant and, if necessary, a lower-order correction. Neither step guarantees an immediate solution, but both prevent the common mistake of searching for a formula before modeling the algorithm correctly.

The Master Theorem is not the endpoint of recurrence analysis. Tools such as Akra–Bazzi handle more general unequal-size recurrences, but they are outside Winter 2026 Lecture 3. Treat such a tool as a different theorem with different conditions, not as an informal extension of these three cases.

## References

- [Stanford CS161 Winter 2026 Lecture 3](https://stanford-cs161.github.io/winter2026/lectures/#lecture-3-solving-recurrences-and-the-master-theorem)
- [Lecture 3 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-pre.pdf)
- [Lecture 3 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-notes.pdf)
- [Lecture 3 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture3-slides.pdf)
