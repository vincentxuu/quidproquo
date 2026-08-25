---
title: "Stanford CS103 Lecture 1: Building a First Direct Proof from Even and Odd"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 3
tldr: "The even-square and odd-sum examples show how arbitrary choices, assumptions, witnesses, and a want-to-show become a checkable direct proof."
description: "A deck-aligned guide to CS103 Mathematical Proofs: even and odd definitions, universal implications, algebraic witnesses, and proof-writing discipline."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-02-mathematical-proofs)

This is article 3 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 1, Spring 2026 (2026-04-01)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Mathematical Proofs**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## A proof is an argument a reader can execute

The deck treats a proof as an argument that convinces another reader. Knowing the intended idea is insufficient: the source of every variable, the definition behind each equality, and the match between the conclusion and the target must be replayable from the text. Proofs gain their power from generality, handling every legal input rather than several favorable examples.

Compression is appropriate only when a reader can mechanically restore what was omitted. Skipping a witness, quantifier transition, or key implication removes the very step that needs checking.

## Even and odd are existential definitions

An integer n is even iff there exists \(k\in\mathbb Z\) with \(n=2k\). It is odd iff there exists \(k\in\mathbb Z\) with \(n=2k+1\). Each assumption supplies an integer witness.

From “n is even,” write: choose \(k\in\mathbb Z\) such that n=2k. This k depends on n; it is neither arbitrary nor globally fixed. Conversely, proving an expression even requires constructing an integer s for which the expression equals 2s. Checking 8 with k=4 or 7 with k=3 verifies individual instances, not a universal theorem.

## The proof game for a universal implication

“For every integer n, if n is even, then \(n^2\) is even” has a universal quantifier outside an implication. Begin with an arbitrary integer n, assume the antecedent, then prove the consequent. Arbitrary prevents reliance on a special value; assuming evenness is licensed by the implication and is not assuming the conclusion.

Expand the want-to-show through the definition: construct \(s\in\mathbb Z\) such that \(n^2=2s\). These moves discharge \(\forall\), \(\to\), and the existential content of evenness.

## Full proof: an even integer has an even square

Choose an arbitrary even integer n. By definition, some \(k\in\mathbb Z\) satisfies n=2k. Then

\[
n^2=(2k)^2=4k^2=2(2k^2).
\]

Let \(s=2k^2\). Since integers are closed under multiplication, \(s\in\mathbb Z\). Therefore \(n^2=2s\), so \(n^2\) is even by definition.

The final sentences matter. The goal requests an integer witness, so the proof names s, checks its type, and invokes the definition. Stopping at \(4k^2\) leaves the reader to supply the required logical step.

## Witness scope and dependency

The k supplied by evenness is chosen after the arbitrary n, so it may depend on n. Choosing one k before n would reverse the quantifiers: \(\forall n\exists k\) is not \(\exists k\forall n\). The constructed s may in turn depend on k.

Whenever an existential appears, ask what the witness is, which earlier variables it may depend on, and why it belongs to the required domain.

## The target for adding two odd integers

The theorem says that for all integers m,n, if both are odd, then m+n is even. Choose arbitrary odd m,n. There are \(k,r\in\mathbb Z\) such that \(m=2k+1\) and \(n=2r+1\). Use separate names because two odd integers need not share a quotient.

Now

\[
m+n=(2k+1)+(2r+1)=2k+2r+2=2(k+r+1).
\]

Set \(s=k+r+1\). Integer closure gives \(s\in\mathbb Z\), and m+n=2s proves evenness.

## Why 7+3 is not the theorem's proof

The calculation 7+3=10 establishes one input pair. More successful examples remain finite and cannot prove a statement about every pair of odd integers. One counterexample can refute a universal claim, but finitely many positive instances cannot establish it.

Examples still reveal the pattern. Writing 7=2·3+1 and 3=2·1+1 suggests the general witness 3+1+1, which becomes \(s=k+r+1\) in the proof.

## Arbitrary choices and existential witnesses impose opposite duties

For \(\forall x\), x must remain arbitrary. For \(\exists y\), the writer must actively choose y. In the square proof, n is arbitrary, k comes from the assumption, and s is constructed by the writer. Confusing those sources causes quantifier errors.

An existential assumption permits choosing one witness with its stated properties, not extra convenient properties. An existential goal requires both naming a witness and checking every condition.

## The floor-and-ceiling example introduces cases

The deck later proves \(\lfloor n/2\rfloor+\lceil n/2\rceil=n\). For arbitrary integer n, split by parity. If n=2k, both floor and ceiling equal k and their sum is n. If n=2k+1, they equal k and k+1, again summing to n.

The cases are exhaustive because every integer is exactly even or odd. Direct proof need not be a single line of algebra; a complete case split remains direct reasoning when it covers every legal input.

## The information gap between writer and reader

The deck contrasts Proof Writer and Proof Reader. The writer knows the destination; the reader has only written sentences. An undeclared variable, unlabeled assumption, or witness not shown to be integral cannot be supplied by reader goodwill.

Audit each line: where was this symbol introduced, which premise licenses the step, does the equality preserve value, and does the final sentence match the consequent? “You know what I mean” signals a missing sentence.

## Annotating both main proofs line by line

In the even-square proof, “choose arbitrary” handles the universal quantifier, while “even integer” brings the antecedent into scope. The equation n=2k expands the definition; stating that k is integral later licenses the integral witness \(2k^2\). Algebra exposes a factor of two, and naming s finally supplies the consequent's witness.

The odd-sum proof has the same roles. m,n are arbitrary, oddness supplies assumptions, k,r are separate witnesses from those assumptions, and \(s=k+r+1\) is constructed for the goal. Setting k=r would add an unsupported condition; dropping the +1 would make the algebra off by two.

An executable audit labels lines `∀`, `assume`, `definition`, `algebra`, `witness`, or `conclusion`. A conclusion with no preceding definition or witness line identifies a concrete gap.

## A definition's direction depends on the task

The biconditional definition of evenness works both ways. From n even, obtain an integral k with n=2k. From such an equality and the type of k, conclude n even. The square proof uses the first direction at its start and the second at its end.

Oddness behaves identically. Definitions are reasoning interfaces, not static glossary entries. If a problem gives n=2x without saying x is integral, evenness does not follow: x could be one half and n could be 1. The domain condition is part of the definition.

## Executable self-test

Prove that the square of an odd integer is odd: choose arbitrary n, obtain k from oddness, expand \((2k+1)^2\), and explicitly name the odd witness. Then prove even plus odd is odd with separate witnesses for both assumptions.

Finally diagnose three drafts: one checks only n=4; one writes n=2k without saying k is integral; one stops at \(m+n=2k+2r+2\). They respectively fail the universal quantifier, witness type, and consequent definition.

As a reverse audit, expand the final claim “even” or “odd” back into its definition and confirm that the preceding line has the form \(2s\) or \(2s+1\), with s proved integral. Then hide the opening and list every assumption used in the body. An extra condition such as k=r or a fixed numeric value reveals that the draft silently narrowed the universal claim.

Finally, give the proof to someone who has not seen the prompt and ask them to reconstruct the theorem. Correctly recovering the domain, assumptions, and conclusion is a practical test that the argument is self-contained.

## Material limits

The public deck fully displays the even and odd definitions, even-square proof, odd-sum proof, and floor/ceiling case split. Recordings and transcripts are unavailable, so this article does not invent oral feedback or alternate classroom proofs.

## Update log

- 2026-08-22: Rebuilt the direct-proof article from the official deck, restoring witness scope, the odd-sum proof, and the floor/ceiling example.

## References

- [Stanford CS103 Spring 2026 Lecture 1: Mathematical Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/)
- [Official Lecture 1 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs)
- [CS103 Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/proofwriting_checklist)
- [CS103 Spring 2026 Problem Set 1](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps1/)
