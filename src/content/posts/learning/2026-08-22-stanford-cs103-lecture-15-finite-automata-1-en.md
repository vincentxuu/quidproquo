---
title: "Stanford CS103 Lecture 14: Finite Automata, Part I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 16
tldr: "This lecture connects why begin with a weak computer to from device behavior to a state machine, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to why begin with a weak computer, from device behavior to a state machine, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-15-finite-automata-1)

This is article 16 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 14, Spring 2026 (2026-05-01)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Finite Automata, Part I**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Why begin with a weak computer

Computability theory asks what problems computers can solve. Real machines change over time and are too complicated to support a fresh circuit-level proof for every claim. An automaton is a mathematical abstraction of a computing device, just as a graph abstracts a social or transportation network. The model should capture a large class of devices while remaining simple enough for rigorous proofs.

The deck contrasts calculators and desktops along two axes: memory capacity and whether the algorithm is fixed or reprogrammable. This unit first isolates fixed finite memory. An abacus stores data in wood and has its algorithm supplied by a person; an electronic calculator stores both differently. Their physical materials do not matter to the abstraction of finitely many configurations.

## From device behavior to a state machine

The devices receive discrete inputs sequentially. Each input changes the configuration, and after input ends the final configuration yields YES or NO. A finite automaton represents possible memory configurations as states and changes caused by symbols as labeled transitions.

A state summarizes everything about the consumed prefix that can still affect the future. A start arrow marks the unique initial state; a double circle marks an accepting state. Run the machine from the start, left to right, consuming exactly one character per transition. Only after every character is consumed does the final state decide acceptance. Passing through an accepting state early does not halt the run.

The deck animates `ababba` through a four-state machine. A reliable trace records the current state and unread suffix after every step. Repeated characters cannot be skipped, and the final symbol cannot substitute for the full run. Such a machine computes a predicate with fixed finite memory independent of input length.

## The types of alphabet, character, and string

An alphabet Sigma is a finite, nonempty set of symbols called characters. A string over Sigma is a finite sequence of those characters. For Sigma={a,b}, `a` and `abbababba` are strings. Quotation marks are presentation, not part of the mathematical object.

The empty string epsilon has no characters and length zero. It is not a character named epsilon or the empty set. If Sigma={a,b}, then a is in Sigma and epsilon is not in Sigma. Yet epsilon is a finite sequence over Sigma, so epsilon is in Sigma-star.

Keep the types separate: “in” is membership; epsilon is a string; Sigma is a set of characters; Sigma-star is a set of strings. `ab` is normally not in Sigma but is in Sigma-star. `{ab}` is a one-element language, not a string.

## A language is a set of strings

Sigma-star is the set of all strings over Sigma, and a language L over Sigma is any subset of Sigma-star. Over {a,b,c}, the palindrome language contains epsilon, the one-letter strings, `aa`, `bb`, `cc`, `aba`, and so on. A language may contain infinitely many elements even though each element is a finite string.

The hierarchy is fixed: languages are sets of strings; strings are finite sequences of characters; alphabets are finite nonempty sets of characters. Use membership to ask whether `abba` is in a language, and subset to ask whether the language lies inside {a,b}-star. Swapping those relations is a type error.

## The language of an automaton

For an automaton A over Sigma,

L(A) = { w in Sigma-star | A accepts w }.

L(A) is a set, not one run's Boolean answer. The definition first types w and then filters by acceptance. Showing two machines have the same language requires agreement on every string, not a few examples.

The deck's two-state D processes {a,b}. State q0 means the current prefix does not end in a; q1 means it does. Reading a moves to q1, reading b moves to q0, and q1 accepts. Therefore L(D) is exactly the strings ending in a. Epsilon has no last symbol and leaves the machine at the nonaccepting start. `a` accepts, `ab` rejects, and `bba` accepts. The transition structure must preserve the proposed state meaning.

## Diagram shorthand and small traces

An edge labeled `a,b` means either symbol follows that edge; it does not consume two characters together. A self-loop still consumes one character. The start arrow consumes nothing, and a double circle only marks acceptance. The deck's small diagrams separate tracing from describing the entire accepted set.

A machine whose start alone is accepting and that cannot return may accept only epsilon. Another may require a sufficiently long prefix before reaching an accepting state, with `0,1` edges indicating that a position is symbol-independent. Always test epsilon first, then representative strings of lengths one through three, and write an invariant for each state.

The `0110` and `000` animations show that the same symbol can lead somewhere different from different states. State and symbol jointly determine the successor. A missing edge or two same-labeled outgoing edges signals that the picture does not yet satisfy the DFA rules.

## Why determinism needs a complete specification

An informal diagram leaves two questions: what if no edge matches, and what if several edges match? Proofs about what automata can do require one defined behavior on every input.

A DFA is a deterministic finite automaton relative to an alphabet Sigma. Every state has exactly one outgoing transition for every symbol of Sigma. It has one start state and zero or more accepting states. “Exactly one” excludes both gaps and ambiguity, giving every input a unique run.

To audit a proposed DFA over {0,1}, make a row for each state and columns 0 and 1. Every cell must contain exactly one destination. An edge labeled `0,1` fills both cells; two 0-edges duplicate a cell; no 1-edge leaves a hole. Then verify exactly one start arrow. The number of accepting states does not affect determinism.

## The five-tuple and transition function

A diagram can be represented by D=(Q,Sigma,delta,q0,F). Q is a finite state set, Sigma a finite nonempty alphabet, delta:Q x Sigma -> Q a total function, q0 in Q the start state, and F a subset of Q the accepting states. The graphical exactly-one-edge rule is precisely the statement that delta is a total function.

Extend transitions to strings by delta-star(q,epsilon)=q and delta-star(q,xa)=delta(delta-star(q,x),a). The DFA accepts w exactly when delta-star(q0,w) is in F. This formalizes left-to-right tracing and handles epsilon without a special guess.

## Designing states as future-relevant summaries

To recognize strings ending in a, remember only whether the last character was a, not the whole prefix. More generally, two consumed prefixes may share a state when every possible future suffix leads to the same acceptance outcome. A state stores a finite summary sufficient for future decisions.

For practice, even parity of 1s needs even and odd states. Reading 0 preserves the state and reading 1 toggles it; even is both start and accepting because epsilon contains zero 1s. This applies the deck's state-as-memory principle without attributing a new theorem to the lecture.

## Executable self-check

With Sigma={a,b}, type-check: a in Sigma, ab in Sigma-star, epsilon in Sigma-star, and {a,ab} subset Sigma-star. Replace one membership sign with subset and explain the mismatch between the operand types.

For the ends-in-a machine, trace epsilon, a, b, aa, ab, ba, and bb, writing the state after each symbol. State the invariant for both states and compare the table with L(D). Finally audit a candidate DFA state by state and symbol by symbol. Visual symmetry or merely counting total edges does not establish determinism.

## Material limits

The public deck explicitly supports the sections on why begin with a weak computer and from device behavior to a state machine. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked why begin with a weak computer against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 14: Finite Automata, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/)
- [Official Lecture 14 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
