---
title: "Stanford CS103 Lecture 7: Functions II—Surjections, Assumptions, and Composition"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 9
tldr: "This lecture uses surjections and a proof about birds to separate assuming from proving, then shows that involutions are injective and surjective and carries those ideas into function composition."
description: "A deck-aligned guide to CS103 Functions Part II: surjective proofs, quantifiers as assumptions versus goals, involutions, and composition preserving injections and surjections."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-08-functions-2)

This is article 9 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 7, Spring 2026 (2026-04-15)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

Functions Part I defined domains, codomains, involutions, and injections. Part II is not merely another vocabulary list. Its central skill is translating first-order formulas into proof actions. The same `∀` or `→` demands a different next step depending on whether it is assumed or remains to be proved. That distinction connects every example in the deck.

## 1. Recap: a function type is a proof contract

Writing `f : A → B` commits us to defining `f(a)` for every `a∈A` and making every result belong to `B`. It does not promise that all of `B` is reached. The domain specifies legal inputs; the codomain is the allowed destination set, not necessarily the actual range.

If `f:A→A` satisfies `∀x∈A. f(f(x))=x`, it is an involution. If distinct inputs have distinct outputs, it is injective. Injectivity may be written `a₁≠a₂→f(a₁)≠f(a₂)` or equivalently `f(a₁)=f(a₂)→a₁=a₂`. The useful interface depends on the information the proof supplies.

## 2. Proving injectivity: extracting Assume and WTS from quantifiers

The deck reviews `f:ℕ→ℕ`, `f(n)=2n+7`. Choose arbitrary `n₁,n₂`, assume `f(n₁)=f(n₂)`, and prove `n₁=n₂`. Substitution gives `2n₁+7=2n₂+7`, then cancellation gives the conclusion.

First-order logic designs the proof, but the final argument should be readable prose. Quantifiers tell us which arbitrary values to choose; the implication tells us which premise to assume and which conclusion to establish. Variable names must remain consistent throughout. Once those obligations are translated, a proof need not be crowded with logical notation.

## 3. Surjections: every codomain target has a preimage

A function `f:A→B` is surjective, or onto, when `∀b∈B. ∃a∈A. f(a)=b`. Injectivity forbids collisions; surjectivity forbids omissions from the codomain. The same computational rule may therefore be surjective for one declared codomain and not another.

The mountain diagram depicts coverage: every target has an incoming arrow. This differs from the basic function rule, which starts at the domain and requires exactly one output per input. Surjectivity inspects the codomain and asks for at least one source for each target. Several inputs may still share a target.

## 4. A complete surjection proof: fix an output, then build an input

For `f:ℝ→ℝ`, `f(x)=2x`, choose arbitrary `y∈ℝ`. We need `x∈ℝ` with `f(x)=y`. Solving backward gives `x=y/2`, a legal real input, and `f(y/2)=2(y/2)=y`.

The witness depends on the chosen target; one fixed input cannot cover every output. The slides progressively correct the bad candidate `x=2y`, emphasizing that witnesses must be checked. The reliable routine is to choose a target, solve for a candidate, verify its domain membership, and substitute it back. The domain check becomes essential when the input set is restricted.

## 5. Rules for proving formulas are not one universal lookup table

To prove `∀x.P(x)`, choose arbitrary `x` and establish the property. To prove `∃x.P(x)`, supply and verify a witness. An implication goal requires assuming its antecedent and proving its consequent; conjunction requires both sides; biconditional requires both directions.

That table describes goals. The operation changes when the same formula is an assumption. Mixing these two roles produces a structural error that later algebra cannot repair. Marking formulas “Assume” and “Want to Show” before manipulating symbols is often the most effective first move.

## 6. The bird theorem: let the goal choose the arbitrary object

The deck asks us to prove: if all birds can fly, then all herons can fly. With predicates this is `(∀b. Bird(b)→CanFly(b))→(∀h. Heron(h)→CanFly(h))`, together with the background fact that herons are birds.

Assume all birds fly. Since the goal concerns every heron, choose arbitrary heron `h`, not arbitrary bird `b`. From being a heron, `h` is a bird, so the assumption yields that `h` flies. Starting with an arbitrary bird proves something about that bird but never establishes that it is a heron. Variable choice follows the current goal, not left-to-right textual order.

## 7. Proving a universal versus assuming a universal

To **prove** `∀x.P(x)`, introduce a new arbitrary `x` and prove `P(x)`. To **assume** it, initially introduce nothing. Once a relevant value `z` arises elsewhere, instantiate the assumption to get `P(z)`.

In the bird proof, the conclusion's universal is a goal, so it creates arbitrary heron `h`. The premise's universal is assumed, so it does not create a separate bird. It acts like a reusable rule once `h` is recognized as a bird. The same quantifier has different operational meanings in different proof positions.

## 8. What other connectives provide when assumed

An existential assumption introduces a representative with the stated property, but grants no extra special features. A conjunction assumption provides both conjuncts. A disjunction assumption usually creates two cases; we may not select a convenient branch.

A biconditional assumption provides both implications. An implication assumption does not immediately provide its consequent: its antecedent must first be established elsewhere. Negations should be simplified before applying the table again. Every assumption grants exactly the resources promised by its logical form.

## 9. Connecting function types: why every involution is surjective

For `f:A→A`, expand the theorem as `(∀x∈A. f(f(x))=x)→(∀b∈A. ∃a∈A. f(a)=b)`. Assume the involution property, choose arbitrary `b`, and construct the existential witness.

Choose `a=f(b)`. Because `f` maps `A` to itself, `a` is legal. Then `f(a)=f(f(b))=b`. The type declaration does genuine work: it ensures the chosen witness remains inside the domain. A complete construction must justify both membership and the target equation.

## 10. Why every involution is also injective

Choose `a₁,a₂∈A` with `a₁≠a₂`. If `f(a₁)=f(a₂)`, applying `f` to both sides gives `f(f(a₁))=f(f(a₂))`; involution reduces this to `a₁=a₂`, a contradiction. Therefore the outputs differ.

Equivalently, use the equal-outputs definition of injectivity and derive equal inputs directly. Both versions instantiate the universal involution assumption only after the relevant values exist. The deck suggests repeating the proof with the alternate definition to practice changing proof interfaces without changing the theorem.

## 11. The relationship diagram: involution is a stronger condition

An involution is both injective and surjective. It is not an unrelated third label; self-reversal is strong enough to imply both properties. The converses fail in general. An injection or surjection need not undo itself, and even a bijection need not equal its own inverse.

Function types should therefore be studied through logical implications among definitions. Diagrams and small examples help discover those relationships, but the final justification must expand the target quantifiers and construct the requested objects from the assumptions.

## 12. Function composition: align the types before studying properties

For `f:A→B` and `g:B→C`, define `g∘f:A→C` by `(g∘f)(x)=g(f(x))`. Although `g` is written first, evaluation begins with `f`.

The types force that order: `f(x)` lands in `B`, the domain accepted by `g`. The composite takes the domain of `f` and codomain of `g`. If the middle types do not align, the expression is not well-defined. Expanding the circle notation into nested function calls makes both evaluation order and type checking explicit.

## 13. Injections are closed under composition

Suppose `f:A→B` and `g:B→C` are injective. Choose distinct `a₁,a₂∈A`. Injectivity of `f` gives `f(a₁)≠f(a₂)`; injectivity of `g` then gives `g(f(a₁))≠g(f(a₂))`. Thus the composite has distinct outputs.

The proof follows data flow: distinctness survives the first function and then the second. If a composite is injective, `f` must be injective, but `g` need not be injective on all of `B`; the composite may visit only `f(A)`. Domains remain part of every property claim.

## 14. Surjections are closed under composition

The extra slides give the dual theorem. Let both functions be surjective and choose arbitrary `c∈C`. Surjectivity of `g` gives `b∈B` with `g(b)=c`; surjectivity of `f` gives `a∈A` with `f(a)=b`. Hence `(g∘f)(a)=g(f(a))=g(b)=c`.

This proof walks backward from its final target, first finding an intermediate preimage and then an initial preimage. Injections propagate distinctions forward; surjections trace witnesses backward. Without either surjectivity premise, the preimage chain can break at that stage.

## 15. Common mistakes and a repair routine

Do not confuse codomain and actual range; test coverage separately. Do not merely repeat “there exists” in an existential proof; solve for a candidate and substitute it back. Before introducing a variable for a universal, check whether the formula is assumed or being proved.

Expand `g∘f` to avoid reversing evaluation order, and check the middle type. Use arrow diagrams to explore, but discharge each quantifier obligation in prose. Finally, verify every constructed witness twice: it must belong to the promised set and satisfy the promised equation.

## 16. Executable self-test

1. For `f:ℝ→ℝ, f(x)=3x-5`, produce a witness for arbitrary output `y`.
2. Explain why `n↦n+1` is not onto as `ℕ→ℕ` but is onto as `ℤ→ℤ`.
3. Outline the bird proof with programmers and CS103 students, identifying the required subset fact.
4. Reprove closure of injections using the equal-outputs definition.
5. Draw `A→B→C` and trace the two preimages backward from arbitrary `c`.

When stuck, pause the algebra. Label the current statement as an assumption or a goal, then let its outermost connective determine the next action. This prevents both choosing the wrong arbitrary object and applying an implication before its antecedent is known.

## 17. Material limits

The public deck shows the agenda, definitions, bird example, both involution theorems, composition, and the extra-slides surjection-composition proof. It does not preserve spoken transitions, poll results, or student discussion, so none are reconstructed as quotations. The self-test and error checklist are author-created exercises based on the deck, not Stanford problems or solutions.

## Update log

- 2026-08-22: Rebuilt the article from the complete official Functions Part II deck, restoring the deck-specific proofs of surjectivity, assuming versus proving, involution relationships, and composition.

## References

- [Stanford CS103 Spring 2026 Lecture 7: Functions, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/)
- [Official Lecture 7 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/07/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
