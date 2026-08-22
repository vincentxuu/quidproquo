---
title: "Stanford CS161 Lecture 1: Why Algorithm Analysis Starts with Karatsuba Multiplication"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, divide-and-conquer, karatsuba]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 2
tldr: "Splitting two n-digit integers in half still creates four recursive products and leaves the runtime at n². Karatsuba reconstructs the cross term with (a+b)(c+d)-ac-bd, cuts the branching factor to three, and reaches roughly n^1.585."
description: "A step-by-step reading of Stanford CS161 Winter 2026 Lecture 1: the course's three goals, the motivation for asymptotic analysis, divide-and-conquer multiplication, Karatsuba's identity, recursion trees, and the limits of the analysis."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-01-why-algorithm-analysis)

This is post 2 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 1**. Ellen Vitercik taught the lecture on January 5, 2026, under the official title [Why are you here?](https://stanford-cs161.github.io/winter2026/lectures/#lecture-1-why-are-you-here). The public materials include notes, a 70-slide deck, and links to a notebook and concept checks. This article uses the notes and slides. The recording is available only through Canvas, so I did not use it as a source.

The first lecture does not begin by asking students to memorize a definition of an algorithm. It picks a task everyone already knows: integer multiplication. Grade-school multiplication gives the correct product, but knowing how to compute an answer and knowing how the work scales are different skills. The lecture uses this one example to connect all three course goals: design a different algorithm, analyze its growth, and communicate the reason clearly enough for someone else to check.

## Three goals, one argument

The slides name the goals as **Design, Analysis, and Communication**. Karatsuba multiplication exercises all three at once:

- Design: split a large multiplication into smaller ones and find a way to remove one recursive product.
- Analysis: do not rely on a few timing measurements; relate the amount of work to the input size.
- Communication: define every symbol, identify the algebraic identity, and state which costs the model ignores.

That combination is the substantial answer to “Why are you here?” Algorithms are not merely a bag of programming tricks. Scheduling in operating systems, shortest paths in networks, geometric search in machine learning, and number-theoretic work in cryptography all return to the same questions. Can the problem be decomposed? How much information must an algorithm inspect? Does a natural method duplicate work?

The slides also trace the word “algorithm” to al-Khwarizmi and positional numeral systems. That history is not decorative. A representation is a data structure. Roman numerals make arithmetic awkward; decimal positional notation makes it natural to split a number into high and low halves. Algorithms depend both on a sequence of steps and on how the input is represented.

## Why milliseconds do not settle the comparison

Suppose one multiplication program takes six milliseconds on a laptop and another takes ten. That does not establish that the first *algorithm* is better. The measurement mixes the language, implementation, processor, cache behavior, and test data. A new machine can change the ranking.

CS161 asks a more durable question: how does the work change when an input grows from `n` digits to `2n` digits? Grade-school multiplication pairs every digit of the first number with every digit of the second. With `n` digits on each side, there are about `n²` digit pairs. Carries and additions add work, but the overall growth remains quadratic.

Lecture 1 uses only an informal version of big-O: it describes how runtime stretches with input size once the input is large. Lecture 2 supplies the formal definition. For now, the key fact is that constant factors cannot erase a difference in growth rates. An `n^1.6` implementation may start more slowly, but for sufficiently large `n` it will overtake an `n²` implementation.

That does not make constants irrelevant. A user will notice a browser that runs seven times more slowly. The course is isolating a different question: how the strategy itself responds to scale. A benchmark says how this implementation behaves today. Asymptotic analysis says which strategy is likely to break first as the problem grows.

## First attempt at divide and conquer: decomposed, not improved

Divide and conquer follows a familiar rhythm: split a problem into smaller instances of the same kind, solve them recursively, then combine the answers. Let `x` and `y` be `n`-digit integers, and assume for now that `n` is even. Split each integer into high and low halves:

```text
x = 10^(n/2) a + b
y = 10^(n/2) c + d
```

Expanding the product gives:

```text
xy = 10^n ac + 10^(n/2)(ad + bc) + bd
```

For `1234 × 5678`, take `a=12`, `b=34`, `c=56`, and `d=78`. One four-digit multiplication becomes four two-digit products: `12×56`, `12×78`, `34×56`, and `34×78`, followed by shifts and additions.

This is divide and conquer, but it is not faster. Recursing to single-digit problems gives 16 one-digit products for four-digit inputs and 64 for eight-digit inputs. In general, after halving the problem `log₂n` times, the number of leaves is:

```text
4^(log₂ n) = n^(log₂ 4) = n²
```

The runtime recurrence is:

```text
T(n) = 4T(n/2) + O(n)
```

The four recursive products contribute `4T(n/2)`; splitting, adding, and combining contribute `O(n)`. Lecture 1 looks first at the number of leaves. Lecture 3 will solve recurrences of this form systematically. The lesson is not that divide and conquer is always fast. The number of subproblems matters. If the tree merely rearranges every digit pair used by grade-school multiplication, it has not removed any work.

## The multiplication Karatsuba actually removes

The expanded product needs `ac`, `bd`, and the sum `ad+bc`. The direct method computes `ad` and `bc` separately, for four recursive products in total. Karatsuba notices that the final answer needs only their **sum**, not the two values independently.

Compute three products:

```text
z1 = ac
z2 = bd
z3 = (a+b)(c+d)
```

Since:

```text
z3 = ac + ad + bc + bd
```

we can recover the cross term:

```text
ad + bc = z3 - z1 - z2
```

The final combination is:

```text
xy = 10^n z1 + 10^(n/2)(z3-z1-z2) + z2
```

Run the `1234 × 5678` example by hand:

```text
z1 = 12×56 = 672
z2 = 34×78 = 2652
z3 = 46×134 = 6164
cross = 6164-672-2652 = 2840

xy = 672×10000 + 2840×100 + 2652
   = 7,006,652
```

The same calculation explains correctness. Karatsuba does not guess the missing term; it reconstructs the ordinary four-term expansion with an algebraic identity. If the recursive calls correctly return the three smaller products, the combination equals `xy`. The official materials do not turn this into a full recursive induction proof, so this article keeps the proof claim at the same scope: the algebra and the recursive assumption, not a formal proof that the lecture did not provide.

## What changes when four branches become three

Karatsuba gives the recurrence:

```text
T(n) = 3T(n/2) + O(n)
```

Ignoring the linear work at each level for a moment, after `log₂n` halvings the number of single-digit products is:

```text
3^(log₂ n)
= n^(log₂ 3)
≈ n^1.585
```

This is why the slides often write `n^1.6`: it is a readable approximate upper bound, not the exact exponent. The improvement over `n²` is not a fixed number of saved operations. Every internal node in the recursion tree loses one child, and the savings compound at every level.

The public lecture materials do not establish a formal space model. A direct implementation may allocate slices and intermediate big integers and use a recursive call stack. An indexed implementation can reuse storage and change those constants. The lecture therefore supports the time-growth conclusion, not a precise space bound for an unspecified implementation.

## Why the notebook experiment cannot replace the theory

The official course page links a Karatsuba notebook. Its current target lives in the Winter 2025 auxiliary repository rather than inside the Winter 2026 notes. The notebook fully implements three versions: digit-by-digit grade-school multiplication, the first divide-and-conquer method with four half-size products, and Karatsuba with only three. It checks `1234567×654321` against Python's built-in result, then times several digit lengths and plots them.

The experiment reconnects a recurrence to running code, but it deliberately exposes measurement limits. The four-branch implementation behaves oddly near powers of two, and finite plots do not always make the asymptotic winner obvious. The notebook itself therefore turns back to mathematical analysis to understand large `n`. Measurements include Python list operations, conversion to digit arrays, padding, recursion overhead, and hardware noise; none is identical to counting recursive digit multiplications.

Its computational rules are narrower than ordinary Python arithmetic: built-in multiplication is allowed only for single digits, while large additions are allowed. That restriction demonstrates why a cost model cannot be omitted. The lecture's `O(n²)` versus `O(n^{log₂3})` comparison tracks dominant work in a digit-operation model. It does not claim every notebook line has unit cost or that Karatsuba wins on every small input.

The three implementations also form a useful controlled experiment. Divide-and-conquer I and Karatsuba both split, pad, recurse, and recombine; their central difference is four versus three recursive products per node. Comparing Karatsuba only with a system multiplication routine in another representation would leave algorithmic and engineering effects entangled. Reading the two recursive functions side by side narrows the causal change to exchanging extra additions for one recursive multiplication.

The notebook nevertheless checks correctness on only one illustrated example, and its own comment warns that real testing should be more thorough. Negative values, leading zeros, odd-length splits, many random cases, and boundaries around a cutoff need separate tests. One match with Python raises confidence but cannot replace induction over all inputs. Conversely, an algebraic proof cannot detect an indexing bug in a Python implementation. Experiments check implementations; proofs check algorithms; their failure modes differ.

A sound reading order is therefore to use the implementations to see work being rearranged, use recurrences to explain the long-run curve, and use benchmarks to locate a crossover in a specific environment. Measurement tests whether code grows as the derivation suggests; theory explains why three recursive branches eventually beat four. They complement rather than substitute for one another.

## What the analysis deliberately leaves open

Lecture 1 repeatedly signals that its analysis is loose. Those warnings set up the next lectures:

- `a+b` can have one more digit than `a`, so a recursive input need not be exactly `n/2` digits.
- The derivation assumes that `n` is a power of two. Other lengths can be padded, but code still has to handle odd splits.
- Decimal shifts, splitting, addition, and subtraction are treated as linear work without fixing every primitive operation.
- Counting leaves temporarily ignores work at higher levels. Later recurrence tools justify why it does not change the leading order.
- The pseudocode in the slides is a design sketch, not a complete executable implementation.

The common mistake is to see `3T(n/2)` and declare that every cost is automatically `n^1.585`. The defensible statement is conditional: when big integers are represented by `n` digits and additions, subtractions, and splits have linear upper bounds, solving `3T(n/2)+O(n)` gives this asymptotic result.

Another mistake is to claim that Karatsuba is faster for every input size. Better asymptotic growth does not guarantee better measurements on small inputs. Extra additions, allocations, and recursive calls carry constant costs. The lecture establishes the large-scale growth advantage; it does not prescribe a universal crossover threshold for every implementation.

## Why the lecture ends with multiplication history

The notes close with Toom–Cook, Schönhage–Strassen, Fürer, and Harvey–van der Hoeven's `O(n log n)` multiplication result. These names are not an exam checklist. They unsettle the intuition that a grade-school problem must have been fully solved long ago. Faster hardware is not the only route to progress; reorganizing information can change the growth rate itself.

The course describes `O(n log n)` as conjecturally optimal but does not prove that claim or require students to learn the later multiplication algorithms. This article therefore keeps the list in its role as the lecture's closing perspective. A current assessment of multiplication lower bounds or implementations would require separate primary-source research; an introductory history slide is not a research survey.

## Where Lecture 1 sits in the eighteen-lecture path

Lecture 1 builds a habit of distrusting surface intuition. An algorithm may produce the correct answer and still waste work. A problem may be split recursively without becoming faster. A timing graph may look persuasive without surviving a change of machine.

Lecture 2 formalizes the terms that this lecture leaves loose: Big-O, Big-Omega, Big-Theta, worst-case analysis, and correctness proofs for InsertionSort and MergeSort. Lecture 3 then solves the recurrences left here. Karatsuba is not an isolated trick; it is the shared test case for the next two lectures.

You can test your understanding without writing code. Work through the three products for `1234×5678`, then answer two questions on paper: why does the subtraction reconstruct the cross term, and why does a four-branch tree have `n²` leaves while a three-branch tree has `n^{log₂3}`? If a reader who has not seen the slides can follow both answers, you have practiced design, analysis, and communication together.

## Beyond the lecture

Practical Karatsuba implementations usually do not recurse all the way to one-digit inputs. They switch back to grade-school multiplication below a threshold. This is a hybrid engineering strategy: use the better asymptotic order on large inputs and avoid recursive overhead on small ones. The Winter 2026 public materials do not prescribe a threshold, and neither does this article. The right crossover depends on the integer representation, language, and hardware and should be benchmarked there.

A useful experiment is to record two measurements separately: the number of single-digit products and wall-clock time. The first should resemble the recursion-tree prediction. The second also includes interpreter overhead, allocation, and cache behavior. Looking at both shows exactly what the analytical model explains and what it leaves outside its boundary.

## References

- [Stanford CS161 Winter 2026 Lecture 1: Why are you here?](https://stanford-cs161.github.io/winter2026/lectures/#lecture-1-why-are-you-here)
- [Lecture 1 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture1-notes.pdf)
- [Lecture 1 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture1.pdf)
- [Official linked Karatsuba notebook source](https://github.com/stanford-cs161/winter2025-extra/blob/main/notebooks/lecture1_karatsuba/lecture1_karatsuba.ipynb)
