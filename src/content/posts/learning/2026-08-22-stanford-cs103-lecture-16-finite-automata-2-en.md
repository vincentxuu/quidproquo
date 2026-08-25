---
title: "Stanford CS103 Lecture 15: Finite Automata, Part II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 17
tldr: "This lecture connects the dfa definition connects the first half of cs103 to regular means that some dfa exists, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to the dfa definition connects the first half of cs103, regular means that some dfa exists, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-16-finite-automata-2)

This is article 17 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 15, Spring 2026 (2026-05-04)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Finite Automata, Part II**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## The DFA definition connects the first half of CS103

A DFA over alphabet Sigma consists of a state set S, one start state s0 in S, an accepting subset A of S, and a transition function delta:S x Sigma -> S. The start requirement makes S nonempty; A may be empty or all of S. If S has q0,q1,q2 and Sigma={0,1}, the domain has six ordered pairs. Every pair has exactly one output, formalizing determinism.

The language remains L(D)={w in Sigma-star | D accepts w}. Keep the types distinct: s0 is a state, A a state subset, and delta(q,a) a state rather than a Boolean. Acceptance is tested only after the whole string is processed.

## Regular means that some DFA exists

A language L is regular if some DFA D has L(D)=L; D recognizes L. This existential definition requires a machine and an exact-language argument. Accepting selected positive examples is insufficient. A state invariant should prove both directions: members of L finish accepting, and every accepted string belongs to L.

## Complement uses a fixed universe

For L subset Sigma-star, its complement is Sigma-star minus L. It is not the collection of all nonstrings, and changing the alphabet changes the universe. The deck uses strings over {a,b} containing substring `aa`; its complement contains exactly the strings over that same alphabet without `aa`.

For a complete DFA, swap accepting and nonaccepting states. Every string has one run ending in exactly one class, so the new machine accepts exactly what the old rejects. Regular languages are closed under complement. If L were nonregular but its complement regular, closure would make the double complement L regular, a contradiction. Thus nonregular languages are also closed under complement.

## From DFA to NFA

An NFA is a nondeterministic finite automaton. At each point it has finitely many choices, possibly none. A state may have zero, one, or several outgoing transitions for the same symbol. A path with no matching edge dies, while other paths continue.

Acceptance is existential: an NFA accepts if some sequence of choices consumes all input and finishes accepting. Not every branch must succeed, and the machine does not randomly select just one. Rejection requires every possible branch to fail.

The deck's bit-string NFA traces `01011`. At a 1, q0 may keep following the main path or guess that this is a significant late 1 and branch to q1. Early guesses may die; one successful guess suffices. Nondeterminism means considering all finite choices, not prophetic guessing.

## The NFA transition type

For one state, write delta:S x Sigma -> P(S): an output can be empty, singleton, or contain several states. For a current set of states, the lifted transition has type P(S) x Sigma -> P(S) and unions all successors. Do not confuse these two levels.

The powerset view makes execution concrete. Maintain all states reachable after the consumed prefix. Begin with the start state (plus epsilon closure below), take the union of matching destinations on each symbol, and accept after input ends if the set intersects the accepting set.

## A dead path is not rejection

In the deck's simpler NFA, q0 can continue on `0,1` or branch on 1 toward q1, then use another 1 to reach q2. If a branch in q1 sees a 0 without an edge, that branch dies. The whole machine rejects only if all paths die or none finishes accepting.

Three common errors follow: declaring rejection after seeing one dead path; accepting as soon as a branch visits an accepting state before input ends; and treating the machine as forced to choose one edge. The set-of-states trace avoids all three.

## Epsilon transitions consume no input

An NFA may take any finite number of epsilon transitions at any time without consuming a character, or take none. Epsilon is an edge label here, not an input character.

Before reading a symbol, take the epsilon closure of the current set; move on the real symbol; then close again. If an epsilon path leads from the start to an accepting state, the machine may accept epsilon. An epsilon edge is optional, so forcing it can discard a valid path.

The deck's upper a-path and lower b-path are joined with epsilon edges while tracing `baabb`. It asks for both accepting and nonaccepting state sequences to reinforce the quantifier: a failed path does not refute acceptance, while one successful path witnesses it.

## Viewing an NFA as a DFA over subsets

Tracking possible-state sets yields a DFA whose states are reachable subsets of S. A symbol maps a subset to the union of successors, with epsilon closure; a subset accepts if it contains an NFA accepting state. With n NFA states there are at most 2^n subsets, though only reachable ones are needed. The empty subset is a valid dead state.

This subset construction explains why nondeterminism gives convenient, compact designs without adding recognizable languages. Its apparent choices can be simulated deterministically by tracking all choices together.

## NFA design by epsilon dispatch

The deck designs L={w in {0,1}-star | w ends in 010 or 101}. Split it into L1 ending in `010` and L2 ending in `101`. Each branch loops over an arbitrary prefix, guesses where the final pattern begins, and checks its three symbols. It accepts only if the check ends exactly with the input.

Add a single start state with epsilon edges to the two submachines. The result recognizes L1 union L2: membership in either language supplies an accepting branch; if neither condition holds, all branches fail. The deck generalizes the recipe: decompose into simple languages, build their machines, and dispatch from one start. All branches must share the same alphabet.

## Comparing the acceptance quantifiers

A DFA has one run, so it accepts when that run ends accepting. An NFA has a set of runs, so it accepts when at least one ends accepting. The language is still the set of accepted strings; only run structure and quantification changed.

Consequently, simply flipping an NFA's accepting circles does not complement it. Old rejection means every path rejects, while the flipped NFA needs only one formerly rejecting path. Convert to a complete subset DFA before swapping acceptance.

## Executable self-check

For S={q0,q1,q2} and Sigma={0,1}, list all six pairs in S x Sigma and fill one destination per DFA table cell. Change one cell to two destinations and explain the NFA choice. Then trace `01011` with sets, taking epsilon closure before and after each symbol. Finally test an ends-in-`010` or `101` NFA on `010`, `11010`, `1010`, and epsilon, recording an accepting witness or why all branches fail.

## Material limits

The public deck explicitly supports the sections on the dfa definition connects the first half of cs103 and regular means that some dfa exists. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked the dfa definition connects the first half of cs103 against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 15: Finite Automata, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/)
- [Official Lecture 15 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
