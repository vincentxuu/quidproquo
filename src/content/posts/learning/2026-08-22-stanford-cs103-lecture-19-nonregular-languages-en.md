---
title: "Stanford CS103 Lecture 18: Nonregular Languages"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 20
tldr: "This lecture connects four equivalent descriptions of regularity to the precise finite-memory intuition, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to four equivalent descriptions of regularity, the precise finite-memory intuition, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-19-nonregular-languages)

This is article 20 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 18, Spring 2026 (2026-05-11)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Nonregular Languages**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Four equivalent descriptions of regularity

The deck begins by equating: L is regular; some DFA recognizes L; some NFA recognizes L; and some regex denotes L. To prove regularity, one witness suffices. To prove nonregularity, all possible DFAs must be excluded. Failing to draw several machines proves nothing.

## The precise finite-memory intuition

Button interfaces, TCP state diagrams, and app lifecycles are finite-state systems. Any physical computer has finitely many bit configurations, however enormous, and could in principle be modeled with one state per configuration. Regular problems require only finitely many memory summaries. Nonregular problems require unboundedly many summaries as inputs grow.

An infinite language need not be nonregular: a-star and Sigma-star are infinite but need tiny DFAs. What matters is whether prefixes with different future behavior can safely share a state.

## The first candidate E

Let E={a^n b^n | n natural}={epsilon,ab,aabb,...}. The regex a-star b-star permits unequal counts; (ab)-star has the wrong ordering for aabb; any finite union lists only finitely many n. Informal NFA attempts face the need to remember exactly how many a's preceded the b's.

“Needs counting” is not yet a proof because parity and modular counts are regular. We must show every exact count needs a distinct memory state.

## Why a-squared and a-fourth cannot share a state

Suppose a DFA for E reaches the same state after a^2 and a^4. Append the same suffix b^4. Determinism then gives the same final state for a^2b^4 and a^4b^4, yet only the latter belongs to E. Accepting is wrong for one and rejecting is wrong for the other. More generally, distinct a^m and a^n require distinct states.

## Distinguishability and its quantifiers

Strings x and y are distinguishable relative to L when some common suffix w makes exactly one of xw and yw belong to L. The same w must be appended on the right of both. For E, a^2 and a^4 are distinguished by b^4 (or b^2). Existence of one witness is enough; not every suffix must distinguish them.

## Distinguishable strings require different DFA states

If an L-DFA reached one state after x and y, reading their common distinguishing suffix w would follow identical transitions to one final state. It would accept both or reject both, contradicting their different membership. Thus every pairwise distinguishable prefix needs a different state. This bridges language behavior to a memory lower bound.

## A distinguishing set is pairwise

S is a distinguishing set for L if every two distinct x,y in S are distinguishable. Pairwise is essential. Different pairs may use different suffixes. A proof should take arbitrary distinct elements, order their parameters if useful, construct one suffix, and show opposite membership. Then separately prove S infinite.

## The Myhill–Nerode nonregular criterion

If L has an infinite distinguishing set S, then L is nonregular. Assume an L-DFA with k states. Choose k+1 distinct strings from S. Pigeonhole forces two to reach one state, while pairwise distinguishability forces them to reach different states. Contradiction. Infinity matters because it supplies k+1 strings for any unknown finite k.

## Complete proof for E

Take S={a^n | n natural}. It is infinite by distinct lengths. For arbitrary a^m and a^n with m not equal n, append b^m. Then a^m b^m is in E and a^n b^m is not. Thus S is an infinite distinguishing set, so E is nonregular. The n=0 case includes epsilon and still works.

## The second example EQ

Over {a,b,≟}, define EQ={w≟w | w in {a,b}-star}. `ab≟ab`, `bbb≟bbb`, and `≟` belong; `ab≟ba` and `b≟` do not. A recognizer must remember the complete left half, not merely its length.

Let S={a,b}-star. It is infinite because it contains every a^n. For arbitrary distinct x,y, append suffix `≟x`. Then x≟x belongs to EQ and y≟x does not. Therefore S is an infinite distinguishing set and EQ is nonregular. Including the separator in the suffix is necessary to produce correctly shaped test strings.

## Discovering a distinguishing set

Identify what a machine would need to remember after a prefix. For E it is the a-count, suggesting all a^n. For EQ it is the whole left half, suggesting {a,b}-star. Then convert intuition into a common suffix for every distinct pair. Elements of S need not themselves belong to L; their future behavior is what matters.

## Common failed proofs

Infinity alone is insufficient. “Needs counting” ignores modular counters. Inability to draw a DFA is personal evidence, not universal proof. Infinitely many prefixes help only when pairwise distinguishable. Two different suffixes for x and y violate the definition, and proving only xw in L without yw not in L establishes no distinction.

Closure arguments also need valid direction: closure says regular inputs yield regular outputs; its converse cannot be used without a justified contrapositive and the other hypotheses.

## Executable self-check

For E, distinguish pairs (a,a^3), (epsilon,a^2), and (a^4,a^7) using b's matching the shorter prefix, writing both memberships. Assume a five-state DFA, choose six prefixes, and articulate the pigeonhole collision. For EQ, use x=`abba`, y=`abab`, suffix `≟abba`. Finally test whether S={a^n b | n natural} is convenient for E and explain where completing a valid member becomes difficult.

## Material limits

The public deck explicitly supports the sections on four equivalent descriptions of regularity and the precise finite-memory intuition. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked four equivalent descriptions of regularity against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 18: Nonregular Languages](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/)
- [Official Lecture 18 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
