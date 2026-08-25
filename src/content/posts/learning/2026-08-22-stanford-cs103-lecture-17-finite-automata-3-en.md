---
title: "Stanford CS103 Lecture 16: Finite Automata, Part III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 18
tldr: "This lecture connects the automata ladder measures power with languages to dfa transition tables, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to the automata ladder measures power with languages, dfa transition tables, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-17-finite-automata-3)

This is article 18 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 16, Spring 2026 (2026-05-06)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Finite Automata, Part III**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## The automata ladder measures power with languages

The deck orients the remaining course as DFA, NFA, PDA (studied through equivalent CFGs), and Turing machine. At each level, a language impossible below must motivate greater memory. NFAs appear to add perfect guessing, but this lecture proves that they recognize exactly the DFA languages.

## DFA transition tables

A table has current states as rows, alphabet symbols as columns, and successor states as cells. The first marked row is the start; stars mark accepting states. Because a DFA transition is total, blanks are illegal. In the deck's four-state example, missing outgoing edges from q3 are completed as 0- and 1-loops, making q3 a sink. Tables expose missing or duplicate transitions and prepare for subset rows.

## Every DFA is already an NFA

An NFA permits zero, one, or many successors and epsilon moves. A DFA is the special case with exactly one successor and no need for extras. Thus every DFA-recognizable language immediately has an NFA using the same graph. The surprising reverse requires a general construction from an arbitrary NFA.

## Massive parallelism

After reading prefix x, track every state the NFA could occupy, a subset of its state set S. On the next character, union all matching destinations and take epsilon closure. A dead branch disappears; an empty set stays empty. At input end, accept if the subset contains an original accepting state. This uses deterministic memory to encode all nondeterministic guesses.

## The subset construction algorithm

The DFA start state is the epsilon closure of the NFA start. Each DFA state is a subset of S. From subset T on symbol a, union all a-successors and take epsilon closure. Mark a subset accepting exactly when it intersects the NFA accepting set. Expand reachable subsets until no new row appears.

Keep the empty subset as a sink. An n-state NFA has at most 2^n subsets, so the equivalent DFA may be exponentially larger; unreachable subsets need not be included. Existence of the conversion does not promise similar size.

## Why the languages are equal

Maintain the invariant that after every prefix x, the DFA subset equals all NFA states reachable after x. It holds for epsilon by the start closure. If it holds for x, the construction's union and closure make it hold after xa. At the end, the NFA has an accepting path exactly when the subset intersects its accepting set, exactly when the DFA state is marked accepting. Thus both accept every w identically, proving NFA- and DFA-recognizable languages coincide.

## Closure under union

Given NFAs for regular L1 and L2, add a new start with epsilon edges to both starts and retain both accepting sets. The new NFA accepts exactly when w belongs to at least one language. Nondeterministic existential acceptance matches union's “or,” and subset construction supplies a DFA if needed.

## Closure under intersection

Build a product DFA with states S1 x S2, paired start, and transition delta((p,q),a)=(delta1(p,a),delta2(q,a)). Mark a pair accepting only when both components accept. Its invariant tracks where both machines are after the same prefix, so its language is L1 intersection L2. Alternatively use De Morgan with complement and union closure.

## Language concatenation

L1L2={xy | x in L1 and y in L2}. It concatenates one word from each language; the split may not be unique. The deck's small grammar languages illustrate building `TheNounVerbTheNoun` from two components.

Connect every accepting state of an NFA for L1 by epsilon to the start of an NFA for L2, and keep only L2's accepting states. A branch guesses a split where L1 has accepted and runs L2 on the remainder. A successful path exists exactly when a valid decomposition exists. Epsilon membership in either language is handled automatically.

## Language powers and Kleene closure

Define L^0={epsilon} and L^(n+1)=L^nL. For L={aa,b}, L^2 contains `aaaa`, `aab`, `baa`, and `bb`. L^0 is not the empty language; epsilon is the concatenation identity.

Kleene closure L-star is the union over all natural n of L^n, all concatenations of zero or more L-words, so it always includes epsilon. Finite-union closure alone cannot justify this infinite union. Instead add a new start/accept state, epsilon into the L-machine, and epsilon from each old accepting state back to its start. The NFA can stop after zero repetitions or any complete repetition, proving regularity.

## The closure toolbox and limits

Regular languages are closed under complement, union, intersection, concatenation, and Kleene star. Each proof constructs a machine from existing machines. Failure to imagine a construction does not prove nonregularity. Alphabets must agree; missing symbols can be routed to sinks before products or complements.

## Executable self-check

Convert a three-state NFA by listing the start closure and completing subset rows for 0 and 1 until stable. Mark subsets intersecting the accepting set and trace three words in both machines. Then product an ends-in-0 DFA with an even-number-of-1s DFA, labeling the four Boolean state meanings. Finally list L^0, L^1, and L^2 for L={aa,b}, checking why epsilon appears at power zero.

## Material limits

The public deck explicitly supports the sections on the automata ladder measures power with languages and dfa transition tables. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked the automata ladder measures power with languages against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 16: Finite Automata, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/)
- [Official Lecture 16 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
