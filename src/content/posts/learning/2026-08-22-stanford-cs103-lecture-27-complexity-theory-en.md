---
title: "Stanford CS103 Lecture 26: Complexity Theory"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 28
tldr: "This lecture connects decidable does not mean feasible to efficiency requires choosing a resource, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to decidable does not mean feasible, efficiency requires choosing a resource, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-27-complexity-theory)

This is article 28 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 26, Spring 2026 (2026-05-29)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Complexity Theory**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Decidable does not mean feasible

The deck opens with a warning. Equivalence of two regular expressions is decidable—the course autograder can answer it exactly—yet the slides state that no algorithm solves it in \(O(2^{m+n})\), where m and n are the expression lengths. Guaranteed termination can still mean an unacceptable wait.

Computability asks which problems computers can solve; complexity asks which they can solve efficiently. R captured decidability and RE captured verifiable yes answers without time bounds. This lecture adds bounds to obtain P and NP.

## Efficiency requires choosing a resource

Efficiency might measure lines of code, recursion depth, time, memory, energy, or network communication. This lecture focuses on worst-case running time as a function of input size. Seconds on one laptop are not a mathematical definition; an asymptotic bound in \(n=|w|\) abstracts away hardware and constant factors to reveal scaling.

## Finite search looks different to the two theories

Many decidable problems enumerate a huge but finite candidate space. Decidability only needs eventual termination; complexity may reject an astronomical search. Binary choices create \(2^n\) candidates and permutations create as many as \(n!\). Brute force can be valid computability while becoming useless around input size 100.

## LIS: from enumeration to patience sorting

For Longest Increasing Subsequence, a naive algorithm checks all \(2^n\) subsequences and spends up to n work on each, taking \(O(n2^n)\). The deck compares the universe's age to roughly \(2^{89}\) nanoseconds to show why n≥100 is already impractical.

Patience sorting places each number on the first pile whose top is larger, creates a pile if none exists, and links to the previous pile. Tracing links backward from the last pile produces an LIS. With implementation tricks, the deck gives \(O(n^2)\). The speedup exploits structure, and its correctness is not obvious; efficiency never replaces proof.

## Shortest paths: permutation search versus BFS

One can enumerate node sequences by length until finding a path, taking \(O(n\cdot n!)\) on an n-node graph. The deck notes that 29! nanoseconds exceeds the universe's lifetime. It terminates, but it is not satisfactory.

Breadth-first search explores distance layers and finds an unweighted shortest path in \(O(m+n)\) for m edges and n nodes. Its invariant is that the first visit to a vertex uses the fewest edges. A vast candidate set does not imply that every candidate must be enumerated.

## Polynomial versus exponential growth

Polynomial time means \(O(n^k)\) for some constant k. Polynomials usually tolerate modest input growth, while \(2^n\) and \(n!\) explode. This is an asymptotic category, not a promise of practical speed: \(n^{100}\) or a huge constant can still be terrible.

Brute-force optimization often takes exponential time, while clever algorithms often run in \(O(n)\), \(O(n^2)\), or \(O(n^3)\). That is motivation, not a theorem about all optimization problems; LIS and shortest path show how structure can defeat enumeration.

## The Cobham–Edmonds thesis

The thesis identifies efficient decidability with a polynomial-time TM decider: time \(O(n^k)\) for some \(k\in\mathbb N\). Like the Church–Turing thesis, it is not a theorem but a modeling assumption with edge cases and controversy.

Polynomials have useful closure properties. Sums, products, and compositions remain polynomial. Sequential execution, a reasonable number of repeated calls, and feeding one algorithm's output to another do not accidentally leave the efficiency class.

## The class P

\[
P=\{L\mid \text{there is a polynomial-time decider for }L\}.
\]

Under the thesis, P contains efficiently solvable problems. Every regular language is in P via a linear-time TM; every CFL is in P through algorithms such as CYK or Earley. P is contained in R because a polynomial bound guarantees halting. Decidability alone promises some finite time, not polynomial time.

## Large search spaces and short witnesses

The deck shows paths and subsets: exponentially many objects may exist, but each object is small. A simple path has at most as many vertices as the graph; a subset has no more elements than its set. Finding one witness may be hard, while checking a supplied witness is easy.

A completed Sudoku can be checked cell by cell. A claimed increasing subsequence of length at least five can be checked for valid indices and increasing values. A Hamiltonian path candidate can be checked for every vertex exactly once and for consecutive edges. These examples add resource bounds to the verifier idea.

## Two bounds for polynomial-time verifiers

An ordinary verifier always halts and satisfies

\[
w\in L\leftrightarrow\exists c\in\Sigma^\*.V\text{ accepts }\langle w,c\rangle.
\]

A polynomial-time verifier runs in \(O(|w|^k)\), and every member has a certificate of length \(O(|w|^r)\). A fast checker is insufficient if the only certificate is exponentially long: it cannot even read that proof in polynomial time measured against the original input.

## The class NP and NP contained in R

\[
NP=\{L\mid \text{there is a polynomial-time verifier for }L\}.
\]

NP means nondeterministic polynomial time, not “non-polynomial.” Enumerating every polynomial-length certificate and running the verifier may take exponential time, but it is finite, yielding a decider. Thus NP⊆R.

The analogy is useful but limited: R uses unrestricted deciders and RE unrestricted verifiers; P uses polynomial deciders and NP polynomial verifiers. The known separation R≠RE does not imply P≠NP after time bounds are imposed.

## Why P is contained in NP

For L∈P, let M be its polynomial-time decider. Define V(w,c) to ignore c and run M(w). It is polynomial time, and every member works even with the empty certificate, so L∈NP. Therefore P⊆NP.

Whether containment is strict is unknown. A diagram may place P inside NP, but it cannot mark a proper subset without resolving the open question: \(P=NP\) or \(P\subsetneq NP\).

## The precise P versus NP question and its stakes

In verifier language: if a solution can be checked efficiently, can it also be found efficiently? Examples with efficient verification but no known efficient solutions include Steiner tree, shortest common supersequence, optimal register allocation, and job scheduling.

If P=NP, all NP problems have polynomial algorithms. If P≠NP, some NP problems do not. The deck presents this as theoretical computer science's central open question and notes the Clay Mathematics Institute's million-dollar prize. A majority opinion favoring P≠NP is not evidence of proof.

## Why undecidability techniques do not transfer directly

The R versus RE separation used universality and self-reference. It is natural to try the same diagonal strategy for P versus NP. The deck cites the Baker–Gill–Solovay theorem: a proof relying purely on those ideas cannot resolve P versus NP.

This is a barrier to the direct relativizing-style transfer, not a claim that every diagonal idea is useless. Proving “no algorithm exists” and proving “no polynomial algorithm exists” require different precision. The trickster contradiction does not automatically become a time lower bound.

## Executable self-test

For LIS and shortest path, record candidate count, work per candidate, fast bound, and correctness invariant. Decide whether \(n^{50}\), \(2^{\sqrt n}\), and \(n\log n\) fit \(O(n^k)\) for some constant k. Then specify certificates and checkers for Sudoku, an increasing subsequence of length five, and Hamiltonian path.

Finally prove P⊆NP and NP⊆R from the definitions. Explain why R≠RE does not imply P≠NP and identify exactly which direct proof strategy the Baker–Gill–Solovay barrier blocks in the deck.

## Material limits

The public deck explicitly supports the sections on decidable does not mean feasible and efficiency requires choosing a resource. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked decidable does not mean feasible against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 26: Complexity Theory](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/)
- [Official Lecture 26 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/26/Lecture%20Slides.pdf)
- [Clay Mathematics Institute: P versus NP](https://www.claymath.org/millennium/p-vs-np/)
- [Baker, Gill, and Solovay, Relativizations of the P=?NP Question](https://doi.org/10.1137/0204037)
- [MIT OpenCourseWare: Complexity Theory](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec8/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
