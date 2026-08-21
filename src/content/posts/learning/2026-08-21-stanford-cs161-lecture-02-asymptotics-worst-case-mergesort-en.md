---
title: "Stanford CS161 Lecture 2: From an InsertionSort Proof to MergeSort's n log n"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, asymptotic-analysis, mergesort]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 3
tldr: "Lecture 2 turns 'fast' into a worst-case bound that can be proved. A loop invariant establishes InsertionSort's correctness while its worst case is n²; a recursion invariant and O(n) work per level give MergeSort O(n log n)."
description: "A reading of Stanford CS161 Winter 2026 Lecture 2: InsertionSort, worst-case analysis, the definitions of O/Ω/Θ, MergeSort correctness, recursion trees, and gaps between pseudocode and implementation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-02-asymptotics-worst-case-mergesort)

This is post 3 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 2**. Ellen Vitercik taught it on January 7, 2026, under the official title [Asymptotics, Worst-Case Analysis, and MergeSort](https://stanford-cs161.github.io/winter2026/lectures/#lecture-2-asymptotics-worst-case-analysis-and-mergesort). I used the public pre-lecture exercise, eleven-page notes, 82-slide deck, and the two-page rigorous InsertionSort handout. The Canvas recording requires Stanford access and was not a source. I also did not use the notebook or concept checks to fill the article.

Lecture 1 used Karatsuba to argue that growth tells us more about an algorithm than one timing measurement. Lecture 2 splits that intuition into two checkable questions: **Does the algorithm actually return the right answer? Does it perform well for every input?** Sorting supplies a shared language. InsertionSort is easy to trace, while MergeSort ties together divide and conquer, inductive correctness, and recursive runtime.

## What InsertionSort preserves

Given an array `A`, InsertionSort starts at the second element. Each round stores the current element, shifts larger elements in the left prefix one position to the right, and inserts the current element into the gap:

```text
InsertionSort(A):
  for i = 1 ... n-1:
    current = A[i]
    j = i-1
    while j >= 0 and A[j] > current:
      A[j+1] = A[j]
      j = j-1
    A[j+1] = current
```

For `[6,4,3,8,5]`, processing 4 creates the sorted prefix `[4,6]`; processing 3 gives `[3,4,6]`; 8 stays in place; and 5 moves past 8 and 6 before stopping after 4. This resembles arranging a hand of cards, but intuition is not a proof. The code has nested loops, changing indices, and overwrites. To prove that it neither loses an element nor leaves a pair out of order, we need a claim that survives every round.

That claim is a **loop invariant**: after outer-loop iteration `i`, the prefix `A[:i+1]` is sorted. It does not say that the whole array is always sorted. It says that the processed prefix grows by one element at a time.

## Proving correctness by induction

The official notes and handout divide the proof into four parts.

**Inductive hypothesis:** after outer-loop iteration `i`, `A[:i+1]` is sorted.

**Base case:** initially `A[:1]` contains one element, so it is sorted. The slides treat this as the completion of iteration zero.

**Inductive step:** assume `A[:i]` was sorted after the previous round. The inner loop shifts every element larger than `current` to the right until it reaches the last position whose value does not exceed `current`. Because the old prefix was sorted, everything to the left of the insertion point is at most `current`, and everything to the right is greater. The other elements move as a block and keep their relative order. The new prefix `A[:i+1]` is therefore sorted and contains the same elements.

**Conclusion:** after the final round, `A[:n]` is sorted, and `A[:n]` is the whole array.

The notes and handout use slightly different `<` and `≤` descriptions for the insertion point, while the code shifts only when `A[j] > current`. With duplicate values, this detail affects stability and the formal choice of insertion point. A proof cannot mix the variants. Under the published pseudocode, equal elements are not crossed, so their original relative order can be preserved.

## Worst-case analysis as an adversarial game

InsertionSort moves almost nothing on an already sorted array. On a reverse-sorted array, every new element travels all the way to the left. Which input should define the runtime? CS161 uses worst-case analysis: publish the algorithm and a bound `T(n)`, then let an adversary choose any input of size `n`. The guarantee holds only if the algorithm finishes within the bound regardless of that choice.

This is a strong promise. It does not require us to guess which arrays are common in practice. If a domain provides a reliable input distribution, average-case analysis may be useful, but then the conclusion depends on that distribution. Lecture 2 keeps that possibility in a note and first establishes a distribution-free guarantee.

During iteration `i`, InsertionSort may inspect and move about `i` elements. Summing the worst case over all iterations gives:

```text
1 + 2 + ... + (n-1) = n(n-1)/2
```

The worst-case runtime is therefore `O(n²)`. The `O` is an upper bound. To claim `Θ(n²)`, we also need a matching lower bound. A reverse-sorted array can force every iteration to traverse its full prefix, which supplies that tight example, though the lecture mainly uses the upper bound in its comparison with MergeSort.

## What O, Ω, and Θ promise

Let `T(n)` be the runtime on inputs of size `n`, and let `f(n)` be a comparison function.

`T(n)=O(f(n))` means that constants `c>0` and `n₀` exist such that every `n≥n₀` satisfies:

```text
0 ≤ T(n) ≤ c f(n)
```

This is an asymptotic upper bound. `T(n)=Ω(f(n))` reverses the relevant inequality: beyond some threshold, `T(n)` is at least `c f(n)`. It is an asymptotic lower bound. `T(n)=Θ(f(n))` means that both bounds hold, so the functions grow at the same order.

The symbols are easily blurred by saying a runtime “is” Big-O. If `T(n)=n`, it is also `O(n²)` and `O(n³)`. Only `Θ(n)` is the tight order-level description. Big-O is not an exact class and says nothing by itself about average-case behavior.

The notes use two exercises to make the quantifiers concrete. Any degree-`k` polynomial that is eventually nonnegative is `O(n^k)`: take the largest coefficient magnitude and upper-bound every lower-degree term by a constant multiple of `n^k`. In the other direction, assuming `n^k=O(n^{k-1})` would imply `n≤c` for every sufficiently large `n`, contradicting the fact that `c` is fixed.

## MergeSort: two genuinely smaller sorting problems

MergeSort has a short divide-and-conquer structure:

```text
MergeSort(A):
  if len(A) <= 1: return A
  L = MergeSort(first half of A)
  R = MergeSort(second half of A)
  return Merge(L, R)
```

The essential work sits in `Merge`. Its inputs are two sorted arrays. Two indices point to the smallest remaining values. Compare the front values, append the smaller one, and advance that side. When one side is exhausted, append the remainder of the other.

The official notes deliberately show an **incomplete** Merge pseudocode fragment. It handles the ordinary comparison but asks what happens when `L` or `R` reaches its end. Copying it directly into a program would access an invalid position. A complete algorithm needs exhaustion branches or sentinel values. The gap demonstrates how CS161 uses pseudocode: it prioritizes the algorithmic structure and may omit language-level boundary handling.

## MergeSort correctness has two layers

The outer proof uses a **recursion invariant**: whenever `MergeSort` returns, it returns a sorted array containing exactly the input elements.

The base case is an array of length zero or one, which is already sorted. For the inductive step, assume shorter inputs are sorted correctly. Both halves are shorter than the original, so the recursive calls return sorted `L` and `R`. One subclaim remains: `Merge` combines two sorted arrays into a sorted array without losing an element.

For `Merge`, use another loop invariant: the output `S` contains the smallest `k` elements from the two inputs and is sorted. At each step, compare `L[i]` and `R[j]`. Because both inputs are sorted, the smaller front value is the smallest value not yet emitted. Appending it preserves the invariant. At termination, every element has been emitted exactly once.

The Winter 2026 notes give the outer proof structure and refer readers to CLRS for a fully rigorous treatment of Merge. The paragraph above expands the subclaim using the logic the notes identify; it should not be misreported as a line-by-line proof that appeared in the lecture materials.

## Why the recursion tree costs n log n

Let `T(n)` be MergeSort's worst-case time on `n` elements. Two recursive calls handle half the input, and merging and splitting take linear work:

```text
T(n) ≤ 2T(n/2) + 11n
```

The `11` is a deliberately loose operation-count bound in the notes, not a universal MergeSort constant. It packages length lookup, slice creation, comparisons, assignments, and index increments under one maximum unit cost. Its linear dependence on `n` matters; the number 11 does not.

At level `i` of the recursion tree there are `2^i` problems, each of size `n/2^i`. The nonrecursive work per node is at most `11n/2^i`, so the entire level costs:

```text
2^i × 11n/2^i = 11n
```

Each lower level doubles the number of problems and halves each problem's size. Those effects cancel. Halving from `n` to 1 takes `log₂n` steps, giving `log₂n+1` levels including the root. Therefore:

```text
T(n) ≤ 11n(log₂n+1)
     = O(n log n)
```

If `n` is not a power of two, the halves use floors and ceilings. The notes justify the clean tree by padding to the next power of two with infinite sentinel values. The padded length is less than `2n`, so the asymptotic order does not change. This shows why the analysis can ignore an uneven tree; it does not give an implementation permission to ignore odd lengths.

## Time and space are separate claims

In the notes' clear pseudocode, Python slices copy the two halves and `Merge` creates a new output. Those allocations can still fit within `O(n)` work per level, so the time bound survives. They do not make the extra-space cost `O(1)`. A typical array MergeSort uses linear auxiliary space plus an `O(log n)` recursion depth. Allocation strategy changes constants and peak lifetimes, and space is not the main proof target of this lecture.

InsertionSort, by contrast, can shift elements inside the original array and use constant extra space. Better asymptotic time is not automatically better on every resource axis. Lecture 2 establishes the time-growth verdict for large, general inputs. Choosing an implementation may still depend on whether data is nearly sorted, memory is constrained, stability is required, or the data lives in an array or linked structure.

## The easiest wrong conclusions to carry forward

The first mistake is treating the best case as the guarantee. InsertionSort can be fast on sorted data while retaining a quadratic worst case on reverse order.

The second is treating Big-O as equality. `O(n²)` states an upper bound; it does not rule out linear behavior and does not supply a lower bound.

The third is proving only that an output is sorted without proving it contains the same elements. An empty output is sorted too. InsertionSort's shifts and Merge's one-by-one emission must preserve the permutation property as well as order.

The fourth is copying incomplete pseudocode. Lecture notation highlights concepts, while production code must handle exhausted arrays, odd lengths, duplicate values, and index boundaries.

## Where Lecture 2 sits in the eighteen-lecture path

Lecture 2 establishes the proof grammar used throughout CS161. Iterative algorithms receive loop invariants; recursive algorithms receive recursion invariants. Runtime claims first specify a worst case and then use asymptotic notation to distinguish upper and lower bounds. Selection, graph algorithms, dynamic programming, and greedy algorithms will change the objects but keep using this language.

The lecture also leaves a precise next question. Why does `T(n)=2T(n/2)+O(n)` systematically become `O(n log n)`? Here we drew the whole tree. Lecture 3 compresses the calculation into the Master Theorem and uses substitution for recurrences outside that template.

To test yourself, trace InsertionSort on a five-element array and write the invariant after every round. Then draw the three-level MergeSort tree for eight elements, labeling the number of problems, the size of each problem, and the total work per level. If both diagrams persuade someone without using the word “obvious,” you have answered the lecture's two questions: is it correct, and is it fast enough?

The same three questions apply to every new algorithm: what invariant does it preserve, is its guarantee worst-case, average-case, or expected, and do its upper and lower bounds use the same model? Answering all three is closer to this lecture's purpose than memorizing one Big-O label.

## Beyond the lecture

InsertionSort often performs well on small or nearly sorted arrays, while MergeSort executes essentially the same recursive structure even when the input is ordered. Practical sorting systems therefore often use hybrid strategies and switch to insertion sorting for small subarrays. Lecture 2 does not prescribe a threshold or describe a specific standard-library implementation. Any threshold belongs to a benchmark for a particular language, element type, and machine.

A second extension is to finish the Merge proof yourself. Before each iteration, state three facts: `S` is sorted, `S` contains exactly the consumed portions of both inputs, and the smaller front item is the next global minimum. This exercise is closer to the proof skill used throughout the course than memorizing the phrase `n log n`.

## References

- [Stanford CS161 Winter 2026 Lecture 2](https://stanford-cs161.github.io/winter2026/lectures/#lecture-2-asymptotics-worst-case-analysis-and-mergesort)
- [Lecture 2 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-pre.pdf)
- [Lecture 2 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture2-notes.pdf)
- [Lecture 2 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture2.pdf)
- [Rigorous Analysis of InsertionSort handout](https://stanford-cs161.github.io/winter2026/assets/files/CS161Lecture02_handout.pdf)
