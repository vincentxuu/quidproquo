---
title: "Stanford CS161 Lecture 17: Gale–Shapley and Revocable Greedy Choices"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, stable-matching, gale-shapley, deferred-acceptance]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 18
tldr: "Deferred Acceptance permits tentative choices to be revoked. Monotone proposals prove O(n²) termination and stability, with an outcome favoring the proposing side."
description: "Stanford CS161 Winter 2026 Lecture 17: stable matching, blocking pairs, Gale–Shapley, correctness, doctor-optimality, and incentives."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-17-stable-matching-gale-shapley)

This is article eighteen in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Winter 2026 Lecture 17**, taught by Ellen Vitercik on March 9, 2026: *Stable Matchings and Gale-Shapley*.

I read the public [notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture17-notes.pdf), [slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture17.pdf), and [official component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture17.md). I did not watch the Canvas recording.

## Stability is not universal happiness

The model has `n` doctors and `n` one-position hospitals, each with complete strict rankings. A blocking pair strictly prefers each other to their assigned partners. A matching is stable when none exists. Stability neither maximizes total score nor gives everyone a first choice; it prevents a mutually preferred deviation. Ties, couples, incomplete lists, and the full real NRMP model are outside the formal treatment.

The Alice/Bob/Charlie and X/Y/Z example has two stable matchings, while `(Alice-Z),(Bob-X),(Charlie-Y)` is unstable because Alice and X block it. Stable outcomes need not be unique.

## Deferred Acceptance

A free doctor proposes to the highest-ranked hospital not yet tried. A hospital tentatively holds the better of its current doctor and the proposer, releasing the other. Rejections are permanent for doctors; acceptances are tentative.

With inverse rank table `H[h][d]`, comparisons take constant time. `NIL` must behave as rank infinity, an implementation detail not explicit in the pseudocode.

## Termination, completeness, and stability

Once a hospital receives a proposal, it never becomes empty and its held doctor only improves. A doctor cannot exhaust every hospital: then all `n` hospitals would have been and remain occupied by only the other `n-1` doctors. Each doctor proposes at most `n` times, so there are at most `n²` iterations and the final matching is complete.

If `(d,h)` blocked the result, `d` must earlier have proposed to `h`. The hospital rejected `d` immediately or later replaced them, and its tentative partner only improves. It therefore cannot prefer `d` to its final partner, a contradiction.

## The three claims are not interchangeable

Termination alone does not prove completeness, and completeness does not prove stability. Proposal indices yield finitely many steps. A hospital never becomes empty after its first proposal; with a pigeonhole contradiction, this prevents a doctor from exhausting every hospital. Only then does proposal history rule out blocking pairs.

In a three-by-three run, Alice and Bob may both propose to X; X holds the preferred proposer and releases the other. Charlie may later trigger another replacement. A blocking-looking pair midway is not a counterexample because the matching remains tentative. Stability concerns the final output, and every rejection records the monotone evidence used in the contradiction.

The `O(n²)` bound requires a matching representation: every pair sees at most one proposal, a next-choice index selects the next hospital, inverse rankings compare in constant time, and a queue tracks free doctors. Repeated scans can exceed the bound.

## Doctor-optimal, not best for both sides

Let `h*(d)` be the best hospital doctor `d` can receive in any stable matching. The notes consider the first rejection by such a hospital and show that the rejecting doctor would either block a supposedly stable matching or must already have suffered an earlier such rejection. Hence no such first rejection exists: the doctor-proposing result is doctor-optimal. The slides also call it hospital-worst. Reversing the proposing side reverses the bias. Doctor-optimal quantifies over every doctor and every other stable matching, not merely average rank; hospital-worst is likewise relative to stable matchings, not all conceivable pairings. The lecture does not formalize the full stable lattice.

## Incentive boundaries

The notes state that a doctor cannot improve under true preferences by misreporting, but the formal proof is outside the notes and referred to Dubins–Freedman. They explicitly reject a naive proof that directly applies doctor-optimality, because stability after a lie is defined relative to reported preferences. Hospitals do not share the guarantee; the material gives a manipulation example. This article does not invent the omitted proof or generalize one-sided strategy-proofness to everyone.

## Source limits and course position

Temporary matches are revocable; only doctor-proposing yields doctor-optimality; stability is not welfare maximization; and real-market complications are not formalized. Lecture 14's greedy decisions were permanent, Lecture 15's safe edges stayed selected, while this lecture permits reversals and proves progress through opposite monotonicities on the two sides.

## Boundaries of the institutional guarantees

The motivation separates two risks: participants may misreport, or they may bypass the mechanism through a blocking pair. Stability addresses the second. The doctor-side incentive theorem addresses part of the first under the simplified model. Neither guarantee implies the other, and one-sided truthfulness does not establish truthfulness for hospitals or coalitions.

## Checking the output pair by pair

The notes give an equivalent stability test. For every doctor `i` and hospital `j`, at least one holds: they are matched; `j` prefers its current doctor; or `i` prefers the current hospital. This form is directly testable by enumerating `n²` pairs and consulting inverse ranks. If all three fail, the pair itself is a witness of instability.

It also exposes the proof's direction. If `(i,j)` blocked, doctor proposal order says `i` previously reached `j`; hospital holding order says that from then on `j` could only improve beyond `i`. Each monotonicity defeats one side of the blocking-pair definition. Allowing doctors to propose backward or hospitals to downgrade would break the chain.

Naive greedy fails when a first acceptance is treated as permanent. “Deferred” means commitment waits until termination: the process retains the best proposal so far, not an irreversible final choice. This contrasts with Lecture 15's permanently safe edge and explains why their invariants cannot be exchanged.

The pigeonhole proof of completeness relies on equal side sizes and complete preference lists. With incomplete lists, exhausting all acceptable hospitals is not contradictory; with capacities, the same `n-1` versus `n` count does not directly apply. The notes describe fake participants and split positions as reductions to the basic model, but a fake match must still be interpreted as unmatched.

Choosing an arbitrary free doctor does not change the guarantees. Proposal traces may differ, but termination, stability, and doctor-optimality use each doctor's preference order and monotone improvement at hospitals, not a fixed schedule. Tests therefore should not require one unique intermediate trace.

## Beyond the lecture

Small-instance tests can enumerate all matchings, verify completeness and absence of blocking pairs, and compare all stable outcomes to check proposing-side optimality. Real markets with capacities, ties, or couples need stronger models; these are engineering and research directions, not claims from this lecture.

## References

- [Lecture 17 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-17-stable-matchings-and-gale-shapley)
- [Lecture 17 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture17-notes.pdf)
- [Lecture 17 slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture17.pdf)
- [Official component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture17.md)
