---
title: "Stanford CS103 Lecture 5: First-Order Logic II—Nested Quantifiers, Negation, and Uniqueness"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, first-order-logic]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 7
tldr: "Translate natural language one layer at a time: identify universal and existential forms, then handle quantifier order, negation, restricted quantifiers, and uniqueness."
description: "A deck-aligned guide to nested quantifiers, set translations, quantifier negation, restricted quantifiers, and uniqueness in Stanford CS103 First-Order Logic Part II."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-06-first-order-logic-2)

This is article 7 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 5, Spring 2026 (2026-04-10)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page has no per-meeting speaker field, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The previous lecture introduced predicates, functions, and quantifiers. This lecture starts doing serious translation. The difficulty is not the symbols themselves. A natural-language sentence often hides scope, dependencies, exceptions, and uniqueness at once. The safest method preserves the sentence's skeleton and replaces it one layer at a time instead of attempting the whole formula in one leap.

## The four Aristotelian forms

For predicates `A(x)` and `B(x)`, the deck asks students to memorize four patterns. “All As are Bs” is `∀x. (A(x) → B(x))`. “Some As are Bs” is `∃x. (A(x) ∧ B(x))`. “No As are Bs” is `∀x. (A(x) → ¬B(x))`. “Some As are not Bs” is `∃x. (A(x) ∧ ¬B(x))`.

A universal statement uses an implication because it imposes the B requirement only on objects that are As. For a non-A object the antecedent is false, so the implication is automatically true. An existential statement uses a conjunction because one witness must be both an A and a B. Writing `∃x. (A(x) → B(x))` is generally too weak: any non-A object can satisfy the implication.

This pairing is not cosmetic. Universal restrictions are encoded with implication; existential restrictions are encoded with conjunction. The same backbone reappears in the person, set, negation, and uniqueness examples.

## Translating “every person loves someone else” layer by layer

Given `Person(p)` and `Loves(x,y)`, first rewrite the sentence as “for every person p, there is another person q whom p loves.” Then formalize each layer:

```text
∀p. (Person(p) →
  ∃q. (Person(q) ∧ p ≠ q ∧ Loves(p, q))
)
```

The outer phrase says “every person,” so it uses `∀` and an implication. The inner phrase says “some person,” so it uses `∃` and a conjunction. The condition `p ≠ q` is essential: without it, self-love could satisfy “someone,” but it would not express “someone else.” Finally, argument order matters. `Loves(p,q)` says p loves q.

Layered translation leaves useful debugging points. A student can separately inspect the outer quantifier, person restriction, inequality, and direction of the relation rather than staring at one opaque formula.

## “Everyone loves someone” is not “someone is loved by everyone”

“There is a person whom everyone else loves” becomes:

```text
∃p. (Person(p) ∧
  ∀q. (Person(q) ∧ p ≠ q → Loves(q, p))
)
```

This formula first fixes the person p who is loved, then requires every other person q to love p. The earlier statement permits each person to love a different target, with nobody universally loved. This statement demands a common target, but that target need not love anyone.

The slides draw models for each claim and a model where both hold. A practical way to read relational formulas is to draw people as nodes and love as directed edges. A model satisfying one formula but not the other proves that the formulas are not equivalent.

## Conjoining two complete claims

To say both “everyone loves someone else” and “someone is loved by everyone else,” conjoin the two complete formulas with `∧`. Each side retains its own quantifiers and parentheses. Reusing the variable name `p` on both sides does not identify the people: each quantifier binds occurrences only inside its own scope. Renaming one variable to `r` may improve readability without changing meaning.

Variable names carry no meaning by themselves; scope does. Parentheses therefore are not typographic decoration. They determine where a variable is bound and whether a connective joins small clauses or complete propositions. A useful check is to verify that every variable occurrence falls within the scope of its intended quantifier and that no accidental free variable remains.

## Quantifier order encodes dependency

`∀x. ∃y. P(x,y)` says that after any x is selected, some y can be selected so that P holds. The choice of y may vary with x. In contrast, `∃x. ∀y. P(x,y)` fixes one x that must work for every y, which is usually much stronger.

For love, `∀p∃q Loves(p,q)` permits Alice to love Bob, Bob to love Carol, and Carol to love Alice. `∃q∀p Loves(p,q)` demands a common target. Quantifiers of the same type can often be exchanged, but mixed universal and existential quantifiers cannot generally be swapped.

Read the quantifiers as moves in a game. Who chooses first, and may the later choice depend on the earlier one? In `∀x∃y`, y can respond to x. In `∃y∀x`, y must be committed in advance. That dependency is the exact semantic difference.

## First-order logic does not supply set operations for free

The deck gives only `Set(S)` and membership `x ∈ y`, then asks for “the empty set exists.” An unavailable empty-set constant cannot simply be inserted. Instead describe a set with no elements:

```text
∃S. (Set(S) ∧ ¬∃x. x ∈ S)
```

Equivalently, write `∃S. (Set(S) ∧ ∀x. x ∉ S)`. The first says no object belongs to S; the second says every object fails to belong to S. They are equivalent because `¬∃x P(x) ≡ ∀x ¬P(x)`.

The example also exposes a boundary of a formal language. A formula may use only the symbols explicitly supplied. A familiar mathematical object or operation must be described from the available predicates if the language does not name it.

## The four-row quantifier-negation table

The deck organizes the central equivalences as follows:

```text
¬∀x. P(x)   ≡   ∃x. ¬P(x)
¬∃x. P(x)   ≡   ∀x. ¬P(x)
¬∀x. ¬P(x)  ≡   ∃x. P(x)
¬∃x. ¬P(x)  ≡   ∀x. P(x)
```

To refute “every choice works,” one counterexample suffices. To refute “some choice works,” every choice must fail. Mechanically, push a negation across one quantifier, exchange `∀` and `∃`, and continue inward. Conceptually, this is the duality between witnesses and counterexamples: an existential is established by a witness, while a universal is destroyed by a counterexample.

A common error changes the quantifier but forgets to negate the predicate. `¬∀x P(x)` is not `∃x P(x)`; the latter can be true at the same time as the original statement. The correct result requires an x for which P fails.

## Fully negating “everyone loves someone”

The slides negate `∀x. ∃y. Loves(x,y)` one layer at a time:

```text
¬∀x. ∃y. Loves(x, y)
≡ ∃x. ¬∃y. Loves(x, y)
≡ ∃x. ∀y. ¬Loves(x, y)
```

The result says “there is someone who does not love anyone,” not “everyone has someone they do not love.” Negating the outer universal produces one counterexample x. Negating the inner existential says that this x fails to love every y. Each crossing flips one quantifier until the negation reaches an atomic predicate.

Check the result on a three-person model. If Alice loves nobody, the original universal is false and Alice witnesses the negation. If everybody loves at least one person, no witness for the negation exists. Concrete models often reveal an ordering mistake faster than another attempt to recall a mnemonic.

## Negating connectives while preserving the standard forms

The deck recommends `¬(p ∧ q) ≡ (p → ¬q)` and `¬(p → q) ≡ (p ∧ ¬q)`. They let a negated formula retain the normal shape: implications under universal quantifiers and conjunctions under existential quantifiers.

“There is a cute puppy” is `∃x. (Puppy(x) ∧ Cute(x))`. Its negation becomes:

```text
∀x. ¬(Puppy(x) ∧ Cute(x))
≡ ∀x. (Puppy(x) → ¬Cute(x))
```

This says no puppy is cute. The incorrect `∀x. (Puppy(x) ∧ ¬Cute(x))` says every object in the domain is a non-cute puppy, a much stronger claim. After symbolic manipulation, translate the answer back into ordinary language to make sure its meaning has not expanded.

## Negating the existence of an empty set

The deck also carries the earlier set formula through a full negation:

```text
¬∃S. (Set(S) ∧ ∀x. ¬(x ∈ S))
≡ ∀S. ¬(Set(S) ∧ ∀x. ¬(x ∈ S))
≡ ∀S. (Set(S) → ¬∀x. ¬(x ∈ S))
≡ ∀S. (Set(S) → ∃x. x ∈ S)
```

The result says every set contains at least one element. The double negation disappears, and the outer conjunction becomes an implication so that the formula does not require every object in the domain to be a set. On paper, make one local equivalence change per line. Skipping directly to the result makes a missed quantifier flip or negation hard to diagnose.

## Restricted quantifiers are fixed abbreviations

CS103 permits `∀x ∈ S. P(x)` and `∃x ∈ S. P(x)`. The first abbreviates `∀x. (x ∈ S → P(x))` and is vacuously true when S is empty. The second abbreviates `∃x. (x ∈ S ∧ P(x))` and is false when S is empty. Once again, universal restriction uses implication and existential restriction uses conjunction.

The slides explicitly permit these two syntactic forms but reject invented variants such as `∀x with P(x)`, `∀y such that ...`, or `∃P(x)`. A restricted quantifier is agreed-upon syntactic sugar, not a license to attach arbitrary English to a quantifier. Other restrictions should be written with ordinary quantifiers and connectives.

## Uniqueness combines existence and at most one

Using `WayToFindOut(w)`, “there is only one way to find out” can be written:

```text
∃w. (WayToFindOut(w) ∧
  ∀x. (WayToFindOut(x) → x = w)
)
```

The first conjunct provides at least one witness w. The universal clause requires every object with the property to equal w. An equivalent inner clause is `∀x. (x ≠ w → ¬WayToFindOut(x))`.

Saying that any two P-objects are equal guarantees only “at most one” and remains true when no P-object exists. Writing only `∃w P(w)` guarantees “at least one.” Exactly one needs both obligations. Mathematics often uses `∃!x.P(x)`, but the deck asks students not to use it in CS103 so that existence and uniqueness are explicitly expanded into ordinary `∀` and `∃` clauses.

## An executable translation workflow

For a new sentence, first list the domain and allowed predicates, functions, and constants. Rewrite the claim into controlled phrases beginning “for every” and “there exists.” Place quantifiers from the outside inward and mark their scope. Encode universal restrictions with implication and existential restrictions with conjunction. Add inequalities and uniqueness clauses implied by words such as “other” and “only.” Finally, read the formula back word by word and test one satisfying model and one countermodel.

For negation, place `¬` outside the complete formula, push it through one quantifier at a time while flipping that quantifier, use propositional equivalences on connectives, eliminate double negations, and translate the result back. Do not also reorder quantifiers during this process, and do not move a quantifier without a valid equivalence.

## Common errors and self-tests

Four mistakes recur. Replacing `∀x(A→B)` with `∀x(A∧B)` incorrectly makes every object an A. Replacing `∃x(A∧B)` with `∃x(A→B)` permits a non-A witness. Swapping `∀` and `∃` changes a witness chosen per input into a single global witness. Reversing relation arguments changes who acts on whom.

Three exercises expose those errors. Translate “every student reads some book” and “some book is read by every student,” then draw a model showing they differ. Negate `∀x. (Cat(x) → ∃y. Loves(x,y))` until negations appear only before atomic predicates. Express “exactly one x satisfies P” using only `∀` and `∃`. A strong answer can be read back layer by layer and explains what happens for an empty restricted set.

## Material limits

The complete public deck supports the four forms, the two love examples, quantifier ordering, the empty-set translation, the negation table, restricted quantifiers, and uniqueness, so this lecture passes the material-fidelity gate. The slides do not preserve every spoken transition, student question, or improvised example. The workflow in this article is a study framework organized from the visible slide sequence, not a purported transcript. The next-time slide previews functions, first-order definitions, and proofs with definitions; those topics are not pulled forward here.

## Update log

- 2026-08-22: Rebuilt both language versions from the complete official First-Order Logic, Part II deck, restoring nested quantifiers, negation, restricted quantifiers, and uniqueness.

## References

- [Stanford CS103 Spring 2026 Lecture 5: First-Order Logic, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/)
- [Official Lecture 5 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/05/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 2](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps2/)
