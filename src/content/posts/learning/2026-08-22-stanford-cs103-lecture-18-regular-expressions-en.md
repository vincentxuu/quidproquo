---
title: "Stanford CS103 Lecture 17: Regular Expressions"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 19
tldr: "This lecture connects from closure properties to a language syntax to regex is mathematics, not one library, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to from closure properties to a language syntax, regex is mathematics, not one library, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-18-regular-expressions)

This is article 19 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 17, Spring 2026 (2026-05-08)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Regular Expressions**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## From closure properties to a language syntax

For strings w,x, wx is concatenation; for languages, L1L2={wx | w in L1 and x in L2}. With L1={a,ba,bb} and L2={aa,bb}, the six results are `aaa`, `abb`, `baaa`, `babb`, `bbaa`, and `bbbb`. This is ordered concatenation, not union or Cartesian product.

For L={aa,b}, L^0={epsilon}, while L^2 contains `aaaa`, `aab`, `baa`, and `bb`. Kleene closure collects L^n for all natural n. Previous closure results guarantee complement, union, intersection, concatenation, and star preserve regularity. Regex turns those operations into syntax.

## Regex is mathematics, not one library

A regular expression describes a language by a pattern and supports validation, grep, flex, and compilers. CS103 uses the theoretical core, not every Python or JavaScript extension. Backreferences, for example, need not preserve regularity. Regex builds bottom-up: atomic regular languages are structural-induction bases and operators are constructors.

## Three atomic regular expressions

Empty-set regex denotes the empty language; each a in Sigma denotes singleton {a}; epsilon denotes {epsilon}. Empty language contains no string and does not match epsilon. Epsilon's language contains one zero-length string. Character regex a matches only the one-character string a.

## Three constructors and parentheses

From R1 and R2 form concatenation R1R2, union R1 union R2, and Kleene star R1-star; parentheses control grouping. Semantically, L(R1R2)=L(R1)L(R2), L(R1 union R2)=L(R1) union L(R2), and L(R-star)=L(R)-star. Regex is syntax; L(R) is a string set. A string belongs to L(R), not literally to the expression.

## Precedence: star, concatenation, union

From highest to lowest: parentheses, star, concatenation, union. Thus `ab*c∪d` parses as `((a(b*))c)∪d`. `trick∪treat` denotes two strings. In `booo*`, star applies only to the last o. `candy!(candy!)*` means one or more copies; parentheses are required to repeat the whole block.

## Design one: containing substring aa

Over Sigma={a,b}, strings containing `aa` are `(a∪b)*aa(a∪b)*`, or Sigma-star aa Sigma-star. The stars absorb arbitrary prefix and suffix. Multiple decompositions are harmless because membership is existential. Using Sigma-star a Sigma-star a Sigma-star would allow separated a's and is too broad.

## Design two: length exactly four

Every position can be any symbol, so the regex is Sigma Sigma Sigma Sigma, abbreviated Sigma^4. It matches all sixteen four-character strings and no other length. Superscript four means four concatenated copies, not cardinality or Kleene star. Define R^0=epsilon.

## Design three: at most one a

The pattern is `b*(a∪epsilon)b*`, abbreviated `b*a?b*`, where R? means R union epsilon. It includes strings with zero a, one a, and epsilon. Sigma-star a Sigma-star requires at least one and permits many; b-star a-star b-star also permits many a's. Counterexamples diagnose candidates more reliably than visual similarity.

## The email example is a composition exercise

The deck abstracts every letter as `a` over {a,dot,@}; it does not claim full Internet email validation. A nonempty text segment is a-plus. Dot-separated local segments are `a+(.a+)*`. The domain needs at least two nonempty segments: `a+(.a+)+`. Together:

`a+(.a+)*@a+(.a+)+`.

This excludes leading or repeated dots, empty segments, missing @, and a dotless domain. R+ means RR-star, one or more, unlike star's zero or more.

## Regex to NFA by structural induction

If R is a regex, L(R) is regular. Atomic NFAs handle empty set, epsilon, and each character. Inductive constructions implement union by epsilon dispatch, concatenation by epsilon links from first accepts to second start, and star with a new accepting start plus repeat links. Thompson's algorithm systematizes these constructions, after which subset construction can produce a DFA.

## Regular language to regex by generalized NFA

Conversely every regular language has a regex. Begin with an NFA and temporarily allow arbitrary regex edge labels, a generalized NFA. Add a clean start with epsilon into the old start and a unique accept reached by epsilon from old accepting states.

Eliminate an intermediate state k. For every remaining pair i,j, replace label Rij with

Rij union Rik(Rkk)\*Rkj.

The second term enters k, loops there any number of times, and leaves; union preserves direct paths. Missing edges mean empty-set and parallel edges combine by union. The deck's R11/R12/R21/R22 example updates the q2 loop to R22 union R21(R11)\*R12. Continue until only clean start and accept remain; their label describes every accepting path. Regex, NFA, and DFA languages are therefore exactly the regular languages.

## Common semantic mistakes

Star always includes zero repetitions and therefore epsilon; plus requires at least one. Union is language OR, not interleaving. Concatenation preserves order but may admit several splits. Dot in the deck email alphabet is literal, not the wildcard of many libraries; Sigma denotes an arbitrary character.

Correctness needs two directions: every match satisfies the specification, and every specified string has a decomposition matching the expression. Positive examples alone cannot detect overmatching.

## Executable self-check

Draw the syntax tree for `ab*c∪d` and list matches of length at most four. Write separate regexes for exactly one a and at most one a; test epsilon, b, a, aa, and bab. Replace each plus in the email pattern by star and find a newly admitted bad string. Finally eliminate one state of a three-state generalized NFA using Rij union Rik(Rkk)\*Rkj, checking direct paths, arbitrary loops, and paths through the removed state.

## Material limits

The public deck explicitly supports the sections on from closure properties to a language syntax and regex is mathematics, not one library. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked from closure properties to a language syntax against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 17: Regular Expressions](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/)
- [Official Lecture 17 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/17/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154: Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
