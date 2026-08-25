---
title: "Stanford CS103 Lecture 0: From Set Language to Cantor's Diagonal"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 2
tldr: "Starting with elements, subsets, and power sets, this lecture culminates in Cantor's diagonal proof that no set is as large as its own power set."
description: "A deck-aligned guide to Stanford CS103 Lecture 0: set notation, set-builder notation, subsets, power sets, cardinality, and Cantor's theorem."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-01-introduction-set-theory)

This is article 2 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 0, Spring 2026 (2026-03-30)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Introduction, Set Theory**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Three questions set the course's direction

The deck frames CS103 through three questions. Which problems can computers solve leads to computability theory. Why are some problems harder than others leads to complexity theory. How can we be certain of those answers requires discrete mathematics. These are not independent units: proving that a machine cannot do something requires precise definitions of problem, machine, and proof.

Term-specific logistics include the course site, grading, weekly problem sets, participation, CS103ACE, and Problem Set 0. PS0 checks the Qt setup, Honor Code, and exam availability. Those dates and percentages describe Spring 2026 only; they document the deck agenda rather than prescribe future offerings.

## Sets are unordered, distinct, and nestable

A set is an unordered collection of distinct objects. Thus \(\{1,2,3\}=\{3,1,2\}\), because order contributes nothing, and \(\{1,1,2\}=\{1,2\}\), because repetition does not create another copy. A model that preserves order or multiplicity would need a sequence or multiset instead.

Sets may themselves be elements. The set \(\{1,\{2,3\}\}\) has two elements: the number 1 and the set \(\{2,3\}\). The numbers 2 and 3 are not direct elements of the outer set. Reading only the commas at the outermost brace level prevents accidental flattening.

Two sets are equal exactly when their contents agree. The executable test is two-directional: every element of A belongs to B and every element of B belongs to A. Later this becomes \(A\subseteq B\land B\subseteq A\).

## Membership and the singleton trap

The notation \(x\in S\) says x is an element of S, while \(x\notin S\) says it is not. The empty set \(\varnothing\) has no elements. The singleton \(\{\varnothing\}\) has one element, namely the empty set. Therefore \(\varnothing\ne\{\varnothing\}\), even though \(\varnothing\in\{\varnothing\}\).

Likewise, the number 1 and the set \(\{1\}\) have different types, and in general x is not \(\{x\}\). An extra pair of braces is not typography; it constructs a new set. Before comparing two expressions, label each as an element or a set.

For \(A=\{1,\{1\},\varnothing\}\), the claims \(1\in A\), \(\{1\}\in A\), and \(\varnothing\in A\) are true, while \(\{\varnothing\}\in A\) is false. The final query asks for a wrapped singleton, not for the empty-set element already present.

## Infinite sets and the course convention for naturals

The naturals are \(\mathbb N=\{0,1,2,\ldots\}\); this course explicitly includes zero. The integers are \(\mathbb Z=\{\ldots,-2,-1,0,1,2,\ldots\}\), with Z coming from the German Zahlen. The reals form \(\mathbb R\), containing values such as \(e,\pi\), and 4.

A domain is not optional context. “The even numbers” differs over naturals, integers, and reals. Later predicates, functions, and languages will repeatedly require the universe of legal inputs to be fixed first.

## Reading set-builder notation field by field

\[
\{n\mid n\in\mathbb N\text{ and }n\text{ is even}\}
\]

means the set of all n satisfying the condition on the right. The expression to collect is left of the bar. On the right, \(n\in\mathbb N\) supplies a type and evenness supplies the filter. This is a membership specification, not an imperative program.

The reals below 137 can be written \(\{x\in\mathbb R\mid x<137\}\), and the negative integers as \(\{z\in\mathbb Z\mid z<0\}\). Changing the latter domain to \(\mathbb N\) produces the empty set under the course convention. Test every translation with one candidate member and one nonmember.

## A subset is not an element

The relation \(A\subseteq B\) means every element of A is in B. It compares two sets. Membership compares one object with a set. For \(B=\{1,2,3\}\), both \(\{1,2\}\subseteq B\) and \(1\in B\) are true, but \(\{1,2\}\in B\) is false because B directly contains numbers rather than sets.

The empty set is a subset of every set. A counterexample to \(\varnothing\subseteq B\) would require an x in the empty set that is absent from B, but no such witness exists; the universal condition is vacuously true. By contrast, \(\varnothing\in B\) depends on whether B directly lists the empty set.

For \(A=\{1,2\}\) and \(B=\{2,1,1\}\), ignoring order and repetition gives both \(A\subseteq B\) and \(B\subseteq A\), so A=B. Proving only one direction establishes containment, not equality.

## Power sets contain subsets, not the original elements

The definition is \(\mathcal P(S)=\{T\mid T\subseteq S\}\). For \(S=\{a,b\}\), independently choosing whether to include a and b gives

\[
\mathcal P(S)=\{\varnothing,\{a\},\{b\},\{a,b\}\}.
\]

Thus \(a\notin\mathcal P(S)\), while \(\{a\}\in\mathcal P(S)\). The empty set and S itself always occur because both are subsets. If \(S=\varnothing\), its sole subset is empty, so \(\mathcal P(\varnothing)=\{\varnothing\}\), not \(\varnothing\).

For \(S=\{\varnothing\}\), there is one element and hence two subsets: \(\varnothing\) and \(\{\varnothing\}\). Therefore \(\mathcal P(S)=\{\varnothing,\{\varnothing\}\}\). This example tests three brace levels: an element, its singleton, and the outer power set.

If finite S has n elements, its power set has \(2^n\) elements, because each element supplies an independent include-or-exclude choice. The four subsets for n=2 and the one subset for n=0 confirm the formula.

## Cardinality and the pairing test for equal size

The notation \(|S|\) denotes cardinality. Finite sets can be counted directly. For infinite sets, “same size” is tested by a bijection: every object on each side is paired exactly once, with no omission.

The deck attempts to pair S with \(\mathcal P(S)\). Finite examples make the power set larger. Could an infinite S nevertheless pair with its power set because both are infinite? Cantor's theorem says no, regardless of S's contents.

## Cantor's diagonal starts from a supposedly complete table

Assume a surjection \(f:S\to\mathcal P(S)\). Every subset of S must appear as f(x) on some row. Label rows and columns with elements of S, and mark whether column y belongs to the subset f(x) on row x. A diagonal entry answers whether \(x\in f(x)\).

Define

\[
D=\{x\in S\mid x\notin f(x)\}.
\]

D flips every diagonal answer. If \(x\in f(x)\), exclude x; if \(x\notin f(x)\), include it. Since D is a subset of S, \(D\in\mathcal P(S)\). Surjectivity would provide some d with \(f(d)=D\).

Substituting d into the definition gives

\[
d\in D\iff d\notin f(d)\iff d\notin D,
\]

which is impossible. No surjection, and therefore no bijection, exists from S to its power set. Hence \(|S|<|\mathcal P(S)|\).

## Quantifiers and types at every diagonal step

The assumption is existential: suppose some surjective f exists. To refute it, the construction must defeat any candidate f. D depends on f because it is the missing subset tailored to that purportedly complete table. Also, f(x) has type “subset of S,” not “element of S,” making \(x\in f(x)\) well typed. D collects elements of S, so D itself is indeed a subset.

The element d comes specifically from surjectivity: because D lies in the codomain, there must exist \(d\in S\) with f(d)=D. More globally, D differs from each row f(x) at coordinate x. Therefore no row can equal D, contradicting the claim that every subset appears.

## Executable self-test

Let \(S=\{1,\{2\},\varnothing\}\). Decide \(1\in S\), \(\{2\}\in S\), \(2\in S\), \(\varnothing\subseteq S\), and \(\{\varnothing\}\subseteq S\). Before answering, label the left side of each relation as an object or set and inspect only direct outer elements.

Then list all eight members of \(\mathcal P(\{a,b,c\})\): the empty set, three singletons, three two-element sets, and the original set. Finally draw any three-row f-table, construct D by flipping its diagonal, and identify the coordinate at which D differs from each row. The proof is complete when you can say: D is a subset and should be in the codomain, yet it equals no listed row.

## Material limits

The public deck fully displays the set-notation examples, subset and power-set exercises, and Cantor diagonal argument, so those agenda items can be reconstructed. Recordings, transcripts, and student questions are unavailable; connective explanations here are not presented as instructor quotations.

## Update log

- 2026-08-22: Rebuilt the set-theory article from the official deck, restored the quantifier and type checks in Cantor's diagonal, and removed a dead handout link.

## References

- [Stanford CS103 Spring 2026 Lecture 0: Introduction, Set Theory](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/)
- [Official Lecture 0 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/00/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/syllabus)
- [CS103 Spring 2026 Problem Set 0](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps0/)
