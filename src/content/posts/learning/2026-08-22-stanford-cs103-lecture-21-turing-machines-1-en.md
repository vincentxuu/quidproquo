---
title: "Stanford CS103 Lecture 20: Turing Machines, Part I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 22
tldr: "This lecture connects why the model changes after cfgs to long addition and local access, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to why the model changes after cfgs, long addition and local access, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-21-turing-machines-1)

This is article 22 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 20, Spring 2026 (2026-05-15)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Turing Machines, Part I**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Why the model changes after CFGs

Finite automata recognize exactly regular languages, while a^n b^n needs unbounded counting. CFGs generate recursive languages but do not directly model a general device executing an algorithm with working memory. A Turing machine separates finite control from tape that can grow with the computation.

## Long addition and local access

The deck performs long addition digit by digit. Scratch space grows with the numbers, yet each step needs only current digits, carry, and local output. A TM arranges memory as cells and sees one through its head. Infinite tape means no fixed a priori bound, not infinite work in one step.

## Historical and classroom models

Turing's 1936 a-machine motivates the name, but CS103's instruction syntax is a later presentation closer to Post/Wang-style machines. The preserved core is finite rules controlling a head that reads, writes, and moves over unbounded tape. The lecture's pseudocode should not be attributed verbatim to Turing's paper.

## Tape, head, blank, and initial configuration

Unused tape cells contain Blank. Input is written contiguously among blanks and cannot itself contain Blank. The head begins over the first input character; for epsilon it points at a blank. A configuration consists of the next instruction, head position, and tape contents. Any finite run visits only finitely many cells.

## What the first program checks

The program accepts Blank at a pair boundary, rejects b in the first position, marks the first symbol x, moves right, requires b, marks it, moves right, and loops. It recognizes `(ab)*`: epsilon, `ab`, and `abab` accept; `a`, `aba`, `abb`, and `aa` reject for missing or mismatched pair symbols. Marker x is a work symbol outside the input alphabet.

## Labels and sequential execution

Execution begins after `Start:`. Labels have no operational effect; Goto changes the next line. Otherwise execution falls through sequentially. `If 'b' Return False` does nothing when the cell is not b and then proceeds to Write; it is not a block with indentation semantics.

## If and If Not

`If symbol command` executes the command only on equality; `If Not symbol command` executes on inequality. A failed condition simply advances. Blank also counts as “not b,” which makes odd-length input reject while waiting for a pair mate. Conditions neither move nor write unless their command does so.

## Write, Move, Goto, and Return

Write overwrites the current cell without moving. Move changes the head by one cell without writing. Goto changes the program counter. Return True/False halts immediately; falling off the program bottom acts as Return False. A trace should separately record code line, head index, and finite nonblank tape window.

## Tracing the first program

On `abab`, the first loop marks positions 0 and 1, the second marks 2 and 3, and the head then sees Blank at position 4 and accepts. On `abb`, the third symbol is b at a new pair start and rejects. On `aa`, the second symbol fails the b requirement. These examples test distinct failure modes.

## Repeated scanning and marking

The deck constructs a TM for strings over {a,b} with equal counts. Repeatedly find the leftmost unmarked character. If it is a, mark it x and scan right for an unmarked b; if it is b, symmetrically seek a. Mark the mate, run GoHome left to Blank and one step right, then repeat. Start skips x and accepts when only markers remain. If a matching symbol cannot be found before Blank, reject.

This handles arbitrary order, including `abab`, `bbaa`, and `abba`, unlike a^n b^n. Tape mutation records which characters have been paired.

## Pairing invariant and termination

Whenever control returns to Start, marked cells contain equal numbers of original a's and b's, and unmarked cells preserve their original symbols. Every successful outer iteration marks one of each. Seeing Blank at Start means all symbols are paired. If counts differ, some search reaches Blank without a mate.

Each successful iteration marks two new cells of finite input, so the program halts after at most |w|/2 pairings plus a failing or accepting scan. Epsilon accepts immediately because both counts are zero. Correctness requires soundness, completeness, and termination.

## Composing Turing-machine routines

GoHome is a reusable routine: move left to Blank, then right to the first input cell. FoundA and FoundB are mirror blocks. Treat labels as routines with preconditions and postconditions before expanding instructions; this avoids head-position errors and makes larger machines compositional.

## The sorting idea

The deck proposes another route: sort all a's before b's, then check a^n b^n. Its animation uses local swaps and illustrates that multiple TM algorithms can recognize one language. The deck does not finish a specific sorting implementation, so only the design idea is attributed here.

## TM versus finite automata

DFA/NFA input is read-only and effectively one-way; their extra memory is finite state. A TM moves both directions, overwrites cells, and can use arbitrarily many surrounding blanks. Each step remains local and finite, and a TM may run forever. The next lecture uses that possibility to distinguish decidability from recognizability.

## Executable self-check

Trace epsilon, `ab`, `abab`, `a`, `abb`, and `aa` through the first program, recording line, head, and tape. Prove both directions for `(ab)*`. Then trace pairing blocks on `abba` and `aab`, recording each marked original symbol and GoHome. Delete GoHome's final Move Right and explain why stopping on the left Blank causes premature acceptance.

## Material limits

The public deck explicitly supports the sections on why the model changes after cfgs and long addition and local access. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked why the model changes after cfgs against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 20: Turing Machines, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/)
- [Official Lecture 20 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
