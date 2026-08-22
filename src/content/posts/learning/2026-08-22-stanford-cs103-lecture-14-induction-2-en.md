---
title: "Stanford CS103 Lecture 13: Mathematical Induction, Part II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 15
tldr: "This lecture connects starting from ordinary induction to induction may start later, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to starting from ordinary induction, induction may start later, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-14-induction-2)

This is article 15 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 13, Spring 2026 (2026-04-29)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/13/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/13/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Mathematical Induction, Part II**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Starting from ordinary induction

For a predicate P, ordinary induction proves every P(n) from P(0) and the universally quantified step P(k) implies P(k+1). The deck recalls the powers-of-two identity by defining P(n) as the statement that the sum from i=0 through n-1 of 2^i equals 2^n-1. The empty sum establishes P(0). Under P(k), appending 2^k changes 2^k-1 into 2^(k+1)-1. This recap preserves the three obligations used throughout the lecture: define the predicate, identify exactly where the hypothesis is used, and invoke the induction principle only after base and step are complete.

## Induction may start later

If a theorem concerns only n at least m, prove P(m), then for arbitrary k at least m prove P(k) implies P(k+1). The conclusion covers exactly n at least m. Beginning at m does not prove earlier cases, and adding P(0) through P(m-1) is needless and may even be false. The base must match the theorem's domain.

## Larger steps require every residue chain

A step can be P(k) implies P(k+3), but one base then reaches only one residue modulo three. Starting at 6 reaches 6, 9, 12, and so on, never 7 or 8. To cover every n at least 6, bases 6, 7, and 8 start the three residue chains. Multiple bases must be sufficient without being redundant. A mechanical audit is to list each base and repeatedly add the step size; any hole in the target interval exposes an incomplete proof.

## Subdividing a square

The deck asks for which n a square can be subdivided into exactly n smaller, nonoverlapping squares that stay within and cover the original. One square is immediate; two and three are impossible. The four original corners must each be covered by a corner of a smaller square. With fewer than four pieces, pigeonhole reasoning forces a piece to cover two original corners, which makes a legal square tiling with the remaining pieces impossible. The slides then exhibit constructions for 4 through 12.

The crucial local replacement is this: take any square in an existing n-piece subdivision and split it into four equal squares. One piece disappears and four appear, a net gain of three. Thus P(n) implies P(n+3), where P(n) says that such a subdivision exists.

## Proof that every n at least 6 is possible

The displayed 6-, 7-, and 8-piece subdivisions are the three base cases. For arbitrary k at least 6, assume a k-piece subdivision exists. Quarter any one piece. The replacement remains inside the original, its pieces do not overlap, and it preserves complete coverage. There are (k-1)+4=k+3 pieces, establishing P(k+3). The bases launch the three modulo-three chains, so every n at least 6 is reached.

This is not a +1 step. Claiming P(k+1) would contradict the construction's count. Using only base 6 would prove only multiples of three. Writing out reachable indices catches both errors.

## Complete induction

Complete (strong) induction proves P(k+1) under the assumptions P(0), P(1), ..., P(k), after establishing the base. If the domain begins at 1, the hypothesis begins at P(1). It differs from ordinary induction in the information available during the step, not in the eventual universal conclusion.

The quantifiers matter. First choose an arbitrary k; then assume all cases in the stated range for that fixed k. P(k+1) itself and larger cases are unavailable. Complete induction licenses all strictly smaller cases, not arbitrary assumptions. It is natural when an object of size k+1 decomposes into a subobject of unpredictable smaller size.

## Eating a chocolate bar

The example is a 1 by n bar eaten left to right. Each bite removes one or more squares from the left. Bite-size sequences distinguish eating methods. For n=1,2,3,4 the counts are 1,2,4,8, suggesting 2^(n-1).

Let P(n) state that a 1 by n bar has exactly 2^(n-1) eating methods. At n=1, the entire bar must be eaten in one bite, so the count is 1=2^0. For arbitrary k at least 1, assume P(1) through P(k). A k+1 bar can be eaten whole in one way. Otherwise its first bite has size r between 1 and k, leaving k+1-r squares. This remainder lies between 1 and k, so the corresponding complete-induction hypothesis gives 2^(k-r) continuations.

The first-bite cases are disjoint and exhaustive. Their total is

1 + sum from r=1 to k of 2^(k-r)
= 1 + (2^(k-1)+...+2^0)
= 1 + (2^k-1)
= 2^k,

which is P(k+1). Ordinary P(k) alone would not cover a first bite of two, three, or more squares, because those choices leave k-1, k-2, and other smaller bars.

## A direct counting cross-check

There are n-1 gaps between adjacent squares. At each gap, independently choose whether the current bite ends there. Subsets of gaps therefore correspond bijectively to eating methods, again giving 2^(n-1). This shorter counting proof checks the answer; it does not invalidate the induction proof. The deck uses the problem to expose the exact situation where the inductive step needs many smaller cases.

## Ordinary and complete induction are equivalent

Complete induction appears stronger, but the principles are equivalent. To simulate it with ordinary induction, define Q(n)=P(0) and P(1) and ... and P(n). Q(k) packages every smaller hypothesis. Use the complete-induction step to obtain P(k+1), then append it to obtain Q(k+1). Conversely, a complete hypothesis already contains P(k), so it can perform any ordinary induction step.

Choose the version matching the construction: ordinary induction when size always decreases by one, complete induction when it can decrease to any smaller size, and multiple bases when a larger step creates separate residue chains.

## Executable proof audit

Write the full predicate and domain. Circle the smallest target and verify the base matches it. Write the quantified step, such as “for every k at least 6, P(k) implies P(k+3).” Generate four reachable values from every base and inspect the target for holes. Every time the hypothesis is invoked, annotate its index and confirm it is in the available range.

For the square problem, 14 belongs to the chain 8, 11, 14. For a four-square chocolate bar, the whole-bar case contributes 1; first bites of 1, 2, and 3 leave 3-, 2-, and 1-square bars, contributing 4, 2, and 1. The total 1+4+2+1=8 detects omissions or double-counting in the classification.

## Material limits

The public deck explicitly supports the sections on starting from ordinary induction and induction may start later. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked starting from ordinary induction against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 13: Mathematical Induction, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/13/)
- [Official Lecture 13 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/13/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
