---
title: "Stanford CS103 Lecture 4: Objects, Quantifiers, and Types in First-Order Logic"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, first-order-logic]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 6
tldr: "This lecture extends propositional logic into a language about objects: distinguish constants, predicates, functions, and propositions, then express some and every with existential and universal quantifiers."
description: "A deck-aligned guide to constants, predicates, functions, equality, quantifiers, scope, precedence, and English-to-FOL translation in Stanford CS103 Spring 2026 Lecture 4."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-05-first-order-logic-1)

This is article 6 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 4, Spring 2026 (2026-04-08)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

Propositional logic treats a whole statement as true or false and combines statements with `¬`, `∧`, `∨`, `→`, and `↔`. This lecture opens that black box. Which objects does a sentence discuss? Which property applies to which object? How do “some” and “every” enter a formula? The main difficulty is not the larger alphabet. Every syntactic component has a fixed input and output type.

## From Propositional Logic to Objects

A propositional variable can represent one truth value but cannot preserve the internal structure of who likes whom. First-order logic (FOL) adds three kinds of tools. Predicates describe properties and relations among objects, functions map objects to objects, and quantifiers let one formula range over possible objects.

The deck uses `Likes(You, Eggs) ∧ Likes(You, Tomato) → Likes(You, Shakshuka)`. Names such as `You` and `Eggs` denote objects. `Likes` consumes objects and produces a truth value. The outer `∧` and `→` remain ordinary propositional connectives. FOL therefore retains propositional logic and supplies an internal language that can produce propositions.

## Constant Symbols Denote Objects

Names such as `You`, `Me`, `Havana`, and `137` are constant symbols. They are not propositional variables because they are not themselves true or false. Under an interpretation, each denotes an object in the domain. Numbers are not magically built into generic FOL; they can be interpreted as designated objects just like other names.

One object may have several names. `MorningStar = EveningStar` and `TomMarvoloRiddle = LordVoldemort` say that two symbols denote the same object. Having the same spelling, having the same name, and denoting the same object are separate questions. A formula depends on the interpretation assigned to its symbols.

## Predicates Turn Objects into Propositions

A predicate accepts objects and returns a proposition. `Cute(Quokka)`, `ArgueIncessantly(Democrats, Republicans)`, and `x < 8` each have a truth value. Binary predicates are sometimes written in infix notation, so `<` and `=` appear between their arguments even though their semantic role is still predicate application.

Each predicate has a fixed arity. If `Likes` is binary, `Likes(You)` is not an unresolved claim; it is malformed because an argument is missing. CS103 problems normally provide a vocabulary listing each predicate, its meaning, and its arity. Writing that interface down before translating is safer than inventing notation from English words as you go.

Only the result of predicate application can feed a connective. `Cute(a) → (Dikdik(a) ∨ Kitty(a) ∨ Puppy(a))` is well-formed. `Venus → TheSun` is not, because both sides are objects. That is a type error, not a false astronomical proposition.

## Equality Is a Special Binary Predicate

FOL includes the special predicate `=` to ask whether two objects are equal. It lives at a different type level from `→`: equality consumes objects and returns a proposition, while implication consumes propositions and returns a proposition. Equivalence between propositions must be written with `↔`, not `=`.

The deck's movie example is:

```text
FavoriteMovieOf(You) ≠ FavoriteMovieOf(Date) ∧
StarOf(FavoriteMovieOf(You)) = StarOf(FavoriteMovieOf(Date))
```

The two favorite movies differ, yet their stars are the same. The example also previews that functions can be nested inside predicate arguments.

## Functions Turn Objects into Objects

A function accepts objects and returns one object, as in `ColorOf(Money)`, `MedianOf(x, y, z)`, and `FavoriteMovieOf(You)`. In `StarOf(FavoriteMovieOf(You))`, the inner call returns a movie and the outer call returns that movie's star. The output type of each stage fits the next stage's input.

A function result does not itself have a truth value, so it cannot directly combine with `¬` or `∧`. Conversely, `StarOf(IsRed(Sun) ∧ IsGreen(Mars))` is malformed: the parenthesized expression is a proposition, but `StarOf` expects an object. To ask whether a function result has a property, apply a predicate to that result.

## Type-Check the Formula

The deck summarizes the system in a type-checking table. Connectives operate on propositions and produce a proposition. Predicates operate on objects and produce a proposition. Functions operate on objects and produce an object. For a long formula, label every subexpression from the inside out.

Consider `StarOf(FavoriteMovieOf(You)) = StarOf(FavoriteMovieOf(Date))`. Constants are objects. Both `FavoriteMovieOf` calls return objects. Both `StarOf` calls still return objects. Equality finally turns the pair into a proposition. If any output fails to match the next input, the formula is not well-formed. This resembles static type checking in a programming language.

## The Existential Quantifier: Find at Least One Witness

`∃x. φ(x)` says that some choice of `x` makes `φ(x)` true. `∃x. (Even(x) ∧ Prime(x))` needs one object that is both even and prime. `∃x. (TallerThan(x, me) ∧ LighterThan(x, me))` requires the same witness to satisfy both conditions.

Alice cannot establish the first conjunct while Bob establishes the second and thereby prove `∃x. (P(x) ∧ Q(x))`. One candidate must make the whole body true. A single successful candidate makes the existential true; it is false only when every candidate fails.

Quantifiers can appear inside larger propositions, as in `(∃w. Will(w)) → (∃x. Way(x))`. Evaluate the two existential subformulas and then apply the implication truth table. The two quantifiers do not share an object merely because they occur in one formula.

## Existentials in an Empty Domain

If the domain is empty, `∃x. Smiling(x)` is false. The reason is not that every object fails to smile. There is no object available as a witness. An existential is not true because no counterexample was found; it must have a positive example.

That boundary matches the proof obligation. To prove `∃x. P(x)`, one normally chooses a specific object and verifies `P` for it. General discussion without a witness does not establish existence.

## Variable Scope and Renaming

Every quantifier has an introduced variable and a quantified statement. In `(∃x. Loves(You, x)) ∧ (∃y. Loves(y, You))`, each variable lives only in its own side. Renaming the right-hand `y` to `x` preserves the meaning: those two occurrences of `x` belong to separate local scopes.

Identical local names do not force identical witnesses. To require one person to participate in both relations, place both conjuncts under one quantifier: `∃x. (Loves(You, x) ∧ Loves(x, You))`. When reading a formula, mark the parentheses controlled by each quantifier instead of tracking letters alone.

## The Quantifier-Precedence Trap

In the deck's syntax, quantifiers have precedence immediately below negation. Thus `∃x. P(x) ∧ R(x) ∧ Q(x)` parses as `(∃x. P(x)) ∧ (R(x) ∧ Q(x))`, not as the commonly intended `∃x. (P(x) ∧ R(x) ∧ Q(x))`.

In the mistaken parse, `x` in the second half lies outside the quantifier and is free. If the goal is a complete sentence, the expression is not valid. A practical rule is to add parentheses whenever a quantified body contains more than one atomic formula. Parentheses delimit a variable's lifetime; they are not decoration.

## The Universal Quantifier: Survive Every Choice

`∀x. φ(x)` says that `φ(x)` is true for every object in the domain. `∀p. (Puppy(p) → Cute(p))` says every puppy is cute. One puppy that is not cute refutes it. Inspecting several positive examples does not prove the universal because other candidates remain unchecked.

The earlier number-theory claim becomes `∀n. (n ∈ ℕ → (Even(n) ↔ Even(n²)))`. The outer quantifier ranges over every object, while the implication filters attention to natural numbers. For a non-natural object the antecedent is false, so the formula does not incorrectly demand the parity conclusion. This is the standard pattern for restricting a domain with a condition.

## Empty Domains and Vacuous Truth

In an empty domain, `∀x. Smiling(x)` is vacuously true. A universal is false only if there is a counterexample—an object that makes its body false. An empty domain contains no objects and therefore cannot contain a counterexample.

This contrasts exactly with existence: the empty domain makes `∃x. P(x)` false and `∀x. P(x)` true. It does not attribute properties to nonexistent objects. It follows the verification conditions for the two quantifiers. Similarly, if no object satisfies an implication's antecedent, no object violates the rule.

## Translating Some: Existential Usually Pairs with Conjunction

“Some smiling person wears a hat” translates as:

```text
∃x. (Smiling(x) ∧ WearingHat(x))
```

The same person must be smiling and wearing a hat. The tempting `∃x. (Smiling(x) → WearingHat(x))` is too weak. Any nonsmiling person makes that implication true and can serve as a witness even when no smiling person wears a hat.

The general pattern is “Some P is a Q” as `∃x. (P(x) ∧ Q(x))`. Conjunction forces the witness to have both the classifying property `P` and the target property `Q`. When English says some, a, or there exists, ask which conditions the exhibited object must satisfy simultaneously.

## Translating Every: Universal Usually Pairs with Implication

“Every smiling person wears a hat” translates as:

```text
∀x. (Smiling(x) → WearingHat(x))
```

It constrains only smiling people. The incorrect `∀x. (Smiling(x) ∧ WearingHat(x))` requires every object in the domain to smile and wear a hat, including objects the English sentence never intended to discuss.

The general pattern is “All P's are Q's” as `∀x. (P(x) → Q(x))`. A counterexample has `P` but lacks `Q`. Implication lets non-`P` objects pass automatically and concentrates the real check on members of class `P`.

## Treat FOL as a Mathematical Programming Language

The deck recommends treating FOL as a mathematical programming language. Translation is not word substitution. It is assembling a small set of constructs into the intended behavior: fix the vocabulary and arities, check the types, scope, and precedence, and then test the formula on tiny worlds.

For `∃x. (P(x) ∧ Q(x))`, test a common witness, an object with only `P`, one with only `Q`, separate objects satisfying the two properties, and an empty domain. For `∀x. (P(x) → Q(x))`, test a world where all `P`s are `Q`s, one containing `P ∧ ¬Q`, one containing only irrelevant non-`P` objects, and an empty domain. A candidate translation is wrong if any test world gives a truth value that differs from the English.

FOL also supports earlier proof techniques. To negate an English statement, translate it, negate the formula mechanically, and translate back. For a contrapositive, identify the antecedent and consequent before swapping and negating them. The next lecture continues with quantifier ordering, negation, and uniqueness. This lecture first establishes the type system and the two basic quantifiers.

## Material Limits

The complete deck supports the sequence from object language through the two quantifiers, scope, precedence, empty-domain semantics, and translation patterns. Slides are not a recording and do not preserve spoken transitions, student responses, or improvisation. This guide attributes only deck-supported definitions, formulas, and examples to the course; its connective prose is not an instructor transcript.

## Update Log

- 2026-08-22: Rebuilt the lost bilingual body item by item from the official Lecture 4 deck, corrected topic metadata, and restored constants, predicates, functions, quantifiers, scope, precedence, and translation examples.

## References

- [Stanford CS103 Spring 2026 Lecture 4: First-Order Logic, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/)
- [Official Lecture 4 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/04/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 2](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps2/)
