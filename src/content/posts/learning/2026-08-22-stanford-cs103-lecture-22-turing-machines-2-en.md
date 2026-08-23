---
title: "Stanford CS103 Lecture 21: Turing Machines, Part II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 23
tldr: "This lecture connects the sample tm looks back from the end to beyond pairwise marking, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to the sample tm looks back from the end, beyond pairwise marking, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-22-turing-machines-2)

This is article 23 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 21, Spring 2026 (2026-05-18)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Turing Machines, Part II**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## The sample TM looks back from the end

The recap machine first requires a, scans right to Blank, moves left twice, and requires b. It recognizes strings over {a,b} of length at least two that begin with a and end with b, regex `a(a∪b)*b`. Epsilon and one-letter a reject; `ab`, `aab`, and `abb` accept. The trace exercises bidirectional head motion and sequential If semantics.

## Beyond pairwise marking

The deck lists TMs for a^n b^n, equal a/b counts, sorting, Fibonacci membership, unary conversion, and tautonyms. Tape can encode numbers, arrays, strings, and control data. Computational power compares whether models can faithfully simulate each computation, not whether speed or program size matches.

## Ideal computers and mutual simulation

An idealized computer is conventional except it never exhausts RAM or disk. It simulates a TM with a growable tape structure, integer head index, and program counter, interpreting one instruction per step. A TM simulates high-level variables, arrays, loops, functions, and classes using tape encodings and routines. The result may be enormous and slow but preserves behavior.

## Data types do not add computability

Pictures are arrays of colors, videos sequences of pictures, music encoded waveforms, and neural inference matrix/nonlinear operations. Any finite encoding can be serialized to tape. This is a claim about representability and computability, not practical efficiency.

## The Church–Turing Thesis is not a theorem

The thesis claims every feasible method of computation is equivalent to or weaker than a TM. “Feasible method” is informal, so this is a falsifiable scientific hypothesis, not a theorem from formal axioms. Model-to-model simulation is formal; extending the claim to every meaningful physical computation is the thesis. Accepting it lets later proofs alternate between TM code and pseudocode.

## Hailstone exposes a third outcome

Starting at positive n, stop at 1; halve even n; replace odd n by 3n+1. The deck's unary TM rejects epsilon and repeatedly transforms tape length accordingly, accepting at length one. Whether every positive input terminates is the Collatz conjecture. If a sequence never reaches one, the TM runs forever.

Unlike finite automata, TMs do not halt merely because input was read. Waiting cannot distinguish “will halt later” from “never halts.”

## Accept, reject, loop, and halt

M accepts w by Return True, rejects by Return False, and loops if neither occurs. It halts iff it accepts or rejects. Therefore “does not accept” means reject or loop; “does not reject” means accept or loop. Only for an always-halting machine does not-accept equal reject.

## Recognizers and recognizable languages

M recognizes L when for every w, w is in L iff M accepts w. Members must eventually accept. Nonmembers may reject or loop. A recognizer has no false positives but may never answer on a negative input. Languages with recognizers form RE. The hailstone TM recognizes exactly unary inputs whose sequence terminates, whether or not it is a decider.

## Three cubes and fair enumeration

For L3={a^n | some integers x,y,z satisfy x^3+y^3+z^3=n}, enumerate increasing finite cubes [-max,max]^3. Every existing witness appears at finite max and causes acceptance. If none exists, search runs forever. Increasing boxes are fair; an infinite inner loop at one x would starve other triples. This proves recognizability only.

## Deciders and decidable languages

A decider recognizes L and halts on every input. Members accept and nonmembers reject, always in finite time. Languages with deciders form R. No uniform time bound is required, but every individual run must terminate. This stronger solution notion produces a yes/no answer for unknown membership.

## Three squares admit finite search

For L2 defined by x^2+y^2+z^2=n, absolute values need not exceed sqrt(n); the deck's wider finite range 0 through n suffices because signs do not change squares. Exhaust all finite triples, accept a witness, otherwise reject. Cubes allow cancellation between large positive and negative terms, so the same simple bound is unavailable.

## R is contained in RE

Every decider is a recognizer, so R subset RE. The major open-at-this-point question is whether R=RE: does eventual confirmation of every yes instance imply a total yes/no algorithm? The containment chain is regular subset CFL subset R subset RE subset all languages; which containments are strict needs later theorems.

## Common quantifier mistakes

Looping on a nonmember is allowed for a recognizer; looping on a member violates it. A while-loop does not prove a particular run loops. No false positives is insufficient without eventual acceptance of every member. A decider proof needs both correctness and termination. Replacing “not accept” with “reject” silently assumes halting.

## Executable self-check

Trace the sample TM on epsilon, a, b, ab, aab, aba, and abb. Build a truth table for accept/reject/loop versus halt, not-accept, and not-reject. For cubes explain why any witness is eventually reached and why absence supplies no stopping point; for squares state a finite bound. Finally compare a recognizer-only pseudocode and a decider line by line against their quantified definitions.

## Material limits

The public deck explicitly supports the sections on the sample tm looks back from the end and beyond pairwise marking. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked the sample tm looks back from the end against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 21: Turing Machines, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/)
- [Official Lecture 21 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/21/Lecture%20Slides.pdf)
- [Stanford Encyclopedia of Philosophy: The Church-Turing Thesis](https://plato.stanford.edu/entries/church-turing/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
