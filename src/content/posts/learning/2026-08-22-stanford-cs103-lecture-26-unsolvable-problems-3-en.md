---
title: "Stanford CS103 Lecture 25: Unsolvable Problems, Part III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 27
tldr: "This lecture connects the lava diagram's two classification tasks to the deck's operational reading of rice's theorem, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to the lava diagram's two classification tasks, the deck's operational reading of rice's theorem, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-26-unsolvable-problems-3)

This is article 27 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 25, Spring 2026 (2026-05-27)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Unsolvable Problems, Part III**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## The Lava Diagram's two classification tasks

The previous lectures placed \(A_{\mathrm{TM}}\) and HALT in \(RE\setminus R\): each has a recognizer but no decider. This wrap-up separates two questions. How can we identify a machine-code language outside R? Rice's theorem is a quick filter. How can we show a language is outside RE entirely? We must rule out recognizers and verifiers or use an explicit diagonal contradiction.

The containment picture is Regular ⊆ CFL ⊆ R ⊊ RE ⊊ All Languages. Rice's theorem only establishes “outside R”; it does not promise membership in RE. Undecidable and unrecognizable are not synonyms.

## The deck's operational reading of Rice's theorem

A language of TM encodings that nontrivially filters machines by their language or runtime behavior is undecidable. The deck includes properties of M on w, properties of a single M's behavior or language, and comparisons between two machines' languages or behaviors. Examples include “M accepts at least one string,” “M's language is finite,” and “M loops on w.”

Use a three-part audit: does the input contain a valid TM encoding; does the property depend on acceptance, rejection, looping, or the recognized language; and is the property nontrivial, meaning some TM has it and some TM lacks it? Only when all three answers are yes does the theorem apply. It packages the repeated trickster construction into a general result.

## Caveat one: syntax is outside Rice's scope

Merely looking like \(\langle M\rangle\) is insufficient. A question about source text can usually be decided by scanning without running M. For example,

\[
L_1=\{\langle M,w\rangle\mid \langle M\rangle\text{ contains more a's than }w\}
\]

and “the length of \(\langle M\rangle\) is odd” are decidable after parsing and counting. They concern representations, not semantic behavior.

Many code strings can implement the same computation. A semantic property gives the same answer for every machine recognizing the same language; a syntax property can change under state renaming or insertion of unreachable code.

## Caveat two: the property must actually filter

If a criterion is true of every TM, the language is all valid encodings—the deck abbreviates this as \(\Sigma^\*\)—and parsing decides it. “M has at least one state” is an example. If it is true of no TM, the language is empty and therefore regular. There is no difficult decision when there is no genuine yes/no boundary.

By contrast, “M recognizes \(\varnothing\)” is a nontrivial language property: some machines do and others do not, so Rice's theorem makes it undecidable. On exercises, produce one positive and one negative witness instead of answering “undecidable” merely because angle brackets appear.

## What Rice's theorem does and does not say

The conclusion is only nonmembership in R. A semantic property may lie in \(RE\setminus R\), or it may be outside RE. “M accepts at least one string” is recognizable by dovetailing all inputs until an acceptance appears. Equality of two recognized languages is listed by the deck as unrecognizable.

Lava Diagram placement is therefore a two-stage job. Rice rules out R. Then either construct a recognizer or verifier to prove RE membership, or use complement or diagonal reasoning to prove non-RE. Undecidable does not automatically mean the outer All Languages region.

## Counting why languages outside RE are abundant

A TM is a finite code string. Interpret malformed strings as an always-reject machine, and the number of TMs is \(|\Sigma^\*|\), a countable infinity. A language is an arbitrary subset of \(\Sigma^\*\), so there are \(|\mathcal P(\Sigma^\*)|\) languages. Cantor's theorem gives

\[
|\Sigma^\*|<|\mathcal P(\Sigma^\*)|.
\]

Each TM recognizes at most one language, so there are far too few machines to recognize all languages. Unrecognizable problems are not isolated exceptions; uncountably many exist. This counting proof is existential rather than explicit. The later language \(L_D\) supplies a named witness.

## The verifier meaning of unrecognizable

If \(L\notin RE\), no M has \(\mathcal L(M)=L\). By the previous lecture's equivalence, L also has no verifier. There is no general finite-certificate system under which every member w has some c accepted by a total checker.

Failure to imagine a certificate is intuition, not proof; a clever encoding may exist. Still, negative claims reveal the obstacle. A step count n can prove M accepts because a finite simulation witnesses acceptance. It cannot prove that M never accepts: observing n steps says nothing about the infinite future.

## Complements of undecidable RE languages lie outside RE

Let L be recognizable but undecidable. If \(\overline L\) were recognizable too, run the two recognizers in parallel. Every input belongs to exactly one side, so one simulation eventually accepts; answer membership according to which one does. This would decide L, a contradiction. Thus \(\overline L\notin RE\).

Consequently \(\overline{A_{\mathrm{TM}}}\) and \(\overline{HALT}\) are outside RE. A positive HALT certificate can say “accept or reject at step n.” Non-halting has no symmetric step-count certificate. The diagram places ATM and HALT inside RE and their complements in the outer region.

## Examples: language equality and at least five loops

The deck lists

\[
EQ_{\mathrm{TM}}=\{\langle M_1,M_2\rangle\mid \mathcal L(M_1)=\mathcal L(M_2)\}
\]

and \(\{\langle M\rangle\mid M\text{ loops on at least five strings}\}\) as non-RE examples. Equality must exclude every possible distinguishing string. Looping on five inputs must certify that five executions never terminate. Finite observation cannot directly establish either negative requirement.

Contrast “M accepts at least five strings,” which is recognizable. A certificate can be

\[
\langle w_1,n_1,\ldots,w_5,n_5\rangle,
\]

with five distinct strings and an acceptance step bound for each. A verifier checks distinctness and performs five bounded simulations. Replacing accepts with loops destroys the value of \(n_i\): it cannot certify what happens after step \(n_i\).

## The diagonal language LD

Define

\[
L_D=\{\langle M\rangle\mid M\text{ does not accept }\langle M\rangle\}
=\{\langle M\rangle\mid \langle M\rangle\notin\mathcal L(M)\}.
\]

The second line must contain \(\notin\); it is the set-language translation of “does not accept.” The definition flips each machine's behavior on its own encoding along the diagonal.

Suppose a recognizer \(M_D\) recognized \(L_D\), and ask whether it accepts \(\langle M_D\rangle\). If it accepts, recognizer correctness puts the encoding in \(L_D\), whose definition says it does not accept itself—a contradiction. If it does not accept, the definition puts the encoding in \(L_D\), so the recognizer must accept—another contradiction. No case works; hence \(L_D\notin RE\).

## The iff structure of the gardener story

The town's sole gardener mows exactly the lawns of residents who do not mow their own lawns, and the gardener is a resident. Let G mean that the gardener mows their own lawn. Applying the rule to that resident gives \(G\leftrightarrow\neg G\). True forces false, and false forces true.

The task is not to pick the more plausible answer; the specified gardener cannot exist. Likewise, the essential property “recognizes LD” defeats itself on the recognizer's own encoding, continuing the course's self-defeating-object theme.

## Common classification errors and self-test

Do not reduce Rice's theorem to “contains a TM encoding, therefore undecidable”; distinguish syntax from semantics. Do not omit nontriviality: all-or-none properties are regular. Do not equate undecidable with non-RE; ATM and HALT refute that. Do not use “I cannot think of a certificate” as proof. Do not drop the not-in sign from the second definition of \(L_D\), which would create the self-acceptance language instead.

Classify four examples: odd code length, recognizes the empty language, accepts at least five strings, and loops on at least five strings. First apply Rice's three-part audit, then ask whether a finite certificate exists. Finally expand both branches of the \(M_D\) contradiction and use parallel recognizers to reprove why the complement of an undecidable RE language is not in RE.

## Material limits

The public deck explicitly supports the sections on the lava diagram's two classification tasks and the deck's operational reading of rice's theorem. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked the lava diagram's two classification tasks against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 25: Unsolvable Problems, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/)
- [Official Lecture 25 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/Lecture%20Slides.pdf)
- [MIT OpenCourseWare: Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford Encyclopedia of Philosophy: Computability and Complexity](https://plato.stanford.edu/entries/computability/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
