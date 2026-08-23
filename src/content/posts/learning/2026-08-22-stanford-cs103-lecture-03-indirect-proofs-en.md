---
title: "Stanford CS103 Lecture 2: Negation, Contraposition, and Contradiction"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 4
tldr: "This lecture identifies exactly when an implication is false, then turns quantified negation, contraposition, and contradiction into checkable proof tools."
description: "A deck-aligned guide to implication, quantified negation, contraposition, biconditionals, and the parity and no-largest-set contradiction proofs."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-03-indirect-proofs)

This is article 4 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 2, Spring 2026 (2026-04-03)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not identify a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/02/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/02/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The previous lecture moved directly from assumptions to conclusions. This lecture asks what to do when that route is awkward: can we prove an equivalent statement instead? A safe change of direction begins by knowing exactly when the original statement is false. The deck therefore develops implication and negation before introducing contraposition and contradiction.

## An implication promises something only when its antecedent holds

An implication (P\to Q) reads “if (P) is true, then (Q) is true.” (P) is the antecedent and (Q) the consequent. The slides include “if an integer (n) is even, then (n^2) is even,” “if odd integers (m,n) are added, their sum is even,” and the deliberately outlandish “if you disprove Cantor's theorem, you receive an A+ in CS103.” The third is still an implication in form. An implication neither guarantees that its antecedent occurs nor asserts causality.

The rainbow example emphasizes direction: “if there is a rainbow, it is raining somewhere” does not reverse to “if it is raining, there is a rainbow.” No rainbow does not imply no rain. The only way (P\to Q) fails is for (P) to hold while (Q) fails. The other three truth combinations do not violate the promise “once (P), then (Q).” This failure case will become the implication's negation.

## Negation is the exact opposite truth condition

A proposition has a truth value. Its negation (lnot X) must be true exactly when (X) is false. Thus the negation of “it is snowing outside” is “it is not snowing outside,” not “it is sunny.” Rain and clouds can also occur without snow; sunshine covers only one case in which the original is false.

Test a candidate negation by asking whether it can be true together with the original and whether both can be false. For an exact negation, both answers are no. Mathematical negation reverses the whole truth condition rather than substituting an everyday antonym.

## Negating a universal statement produces one counterexample

The claim “for every x, P(x)” says every object in the domain has property (P). One exception defeats it, so

\[
\lnot(\forall x\,P(x))\equiv\exists x\,\lnot P(x).
\]

For the deck's sentence “all my friends are taller than me,” the negation is “there is a friend who is not taller than me,” not “all my friends are shorter.” The latter is too strong and misses equal height. Preserve the domain, switch “every” to “at least one,” and negate the property. Merely negating the property while retaining the universal quantifier claims that everyone fails it, much more than is needed.

## Negating an existential statement excludes every witness

The claim (exists x,P(x)) needs only one witness. To make it false, every candidate must fail:

\[
\lnot(\exists x\,P(x))\equiv\forall x\,\lnot P(x).
\]

The negation of “there is a friend who is not taller than me” becomes “every friend is not not taller than me,” or simply “every friend is taller than me.” Finding one taller friend cannot refute the existential; another friend might still witness it. The mnemonic is that negation swaps universal and existential quantifiers and negates the predicate. The semantics explain why: one counterexample defeats a universal, while every witness must be excluded to defeat an existential.

## The negation of an implication is not an implication

The deck tests a March Madness promise: if you pick a perfect bracket, you receive an A+. A perfect bracket and an A+ fulfills it. An imperfect bracket and an A+ does not violate it, since bonus grades were not forbidden. A perfect bracket and a C violates it. An imperfect bracket and a C triggers no promise.

Therefore the negation of (P\to Q) is (P\land\lnot Q), not another implication. With a surrounding universal quantifier,

\[
\lnot\bigl(\forall x(P(x)\to Q(x))\bigr)
\equiv\exists x(P(x)\land\lnot Q(x)).
\]

There is at least one input for which the antecedent holds but the promised consequent fails. The slides stress that negating “if–then” produces “and”: a counterexample must supply both an input that activates the rule and evidence of failure.

## Why the contrapositive is equivalent

The contrapositive of (P\to Q) is (lnot Q\to\lnot P). Negating the original gives (P\land\lnot Q); negating the contrapositive gives (lnot Q\land P). Since conjunction is insensitive to order, they fail in the same case and are equivalent.

The deck restates “if it is a puppy, I love it” as “if I do not love it, it is not a puppy,” and “if I store cat food inside, raccoons will not steal it” as “if raccoons stole it, I did not store it inside.” A contrapositive is not the converse (Q\to P) or inverse (lnot P\to\lnot Q); both sides must be swapped and negated.

## Full contrapositive proof: an even square has an even root

The theorem says: for every integer (n), if (n^2) is even, then (n) is even. The slides prove the contrapositive: if (n) is odd, then (n^2) is odd.

Choose arbitrary odd (n). Some integer (k) satisfies (n=2k+1). Then

\[
\begin{aligned}
n^2&=(2k+1)^2\\
&=4k^2+4k+1\\
&=2(2k^2+2k)+1.
\end{aligned}
\]

Set (m=2k^2+2k). Integer closure gives (m\in\mathbb Z), and (n^2=2m+1), exactly the definition of oddness. Thus the contrapositive, and therefore the original implication, holds.

Three interfaces matter: announce contraposition; state the actual contrapositive; and connect the algebra to an integer witness for the oddness definition. Ending with an expression of the form (2(2k^2+2k)+1) only hints at the witness unless its type is established.

## A biconditional has two proof obligations

The previous lecture directly proved that even (n) implies even (n^2); this lecture proves the reverse. Together,

\[
n\text{ is even}\iff n^2\text{ is even}.
\]

“If and only if” contains two independent implications. Proving (P\iff Q) requires both (P\to Q) and (Q\to P), possibly by different methods. Here one direction is direct and the other contrapositive. One direction alone yields only a necessary or sufficient condition, not a biconditional.

## Contradiction makes the target's negation impossible

To prove (P) by contradiction, assume (P) is false and derive an impossibility such as (1=0), simultaneous membership and nonmembership, or an integer being both odd and even. Since (lnot P) cannot hold, (P) must hold.

The slides use two doors, “(P) true” and “(P) false.” Reality must be behind one. Ruling out the second forces the first. This is not “I found no counterexample”; valid reasoning from (lnot P) must reach an explicit contradiction.

## Contradiction example one: no largest set exists

Negate the theorem by assuming a largest set (S) exists. Now consider its power set. Cantor's theorem gives

\[
|S|<|\wp(S)|.
\]

Thus (wp(S)) is larger than (S), contradicting the maximality assumption. The clash is exact: (S) was assumed no smaller than any set, yet a strictly larger set has been constructed. Therefore no largest set exists. The example also shows contradiction can be constructive: the assumed candidate (S) is transformed into a power set that necessarily outruns it.

## Contradiction example two: another route through parity

To prove the same parity implication by contradiction, negate it correctly: assume there is an integer (n) such that (n^2) is even but (n) is not even, hence is odd. Oddness gives (n=2k+1) for some integer (k), so

\[
n^2=2(2k^2+2k)+1.
\]

Thus (n^2) is odd, while the assumption says it is even. One integer cannot be both, so the negated implication is impossible.

CS103 requires three explicit parts: announce contradiction as the method; state the original claim's negation; and identify the two sides of the contradiction and what it entails. “Clearly a contradiction” leaves the central logical step implicit.

## Three methods for proving an implication

For (P\to Q), a direct proof assumes (P) and derives (Q); contraposition assumes (lnot Q) and derives (lnot P); contradiction assumes (P\land\lnot Q) and derives an impossibility. These are different entry points to one obligation.

Direct proof is natural when (P)'s definition supplies a witness for (Q). Contraposition helps when (lnot Q) has usable structure, as “not even” becomes “odd” for integers. Contradiction often suits nonexistence or maximality claims, or cases where failure yields incompatible properties. On scratch paper, write the three possible starting assumptions and choose the one that immediately opens a definition or known theorem. In the final proof, announce only the chosen method.

## Common errors and an executable self-check

Common mistakes are treating the converse as the contrapositive, negating a predicate without switching its quantifier, writing an implication as the negation of an implication, and saying “assume the opposite” without stating it.

Test four cases: negate “every student submitted” as “at least one did not”; negate “some integer has square 2” as “every integer has square unequal to 2”; negate the universal even-square implication by producing an even integer whose square is not even; and contrapose “if (ab) is odd, then (a,b) are odd” by starting from “(a) is not odd or (b) is not odd.” The last uses the negation of a conjunction, not the stronger claim that both are nonodd.

After answering, mark each quantifier, antecedent, consequent, and negation scope. For contradiction, also write the two statements expected to collide. This catches a direction error before algebra begins.

## Material limits

The complete deck supports the implication and negation rules, contrapositive proof, biconditionals, both contradiction examples, and explicit writing requirements. It does not include the recording, transcript, poll results, or student questions, so those interactions are not reconstructed. The final slides also direct students to office-hours, LaTeX, and proofwriting materials and PS1; restricted assignment solutions are not reproduced.

## Update log

- 2026-08-22: Rebuilt both language versions from the complete official deck, restoring quantified negation, contraposition, biconditionals, and both contradiction examples.

## References

- [Stanford CS103 Spring 2026 Lecture 2: Indirect Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/02/)
- [Official Lecture 2 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/02/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs)
- [CS103 Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/proofwriting_checklist)
