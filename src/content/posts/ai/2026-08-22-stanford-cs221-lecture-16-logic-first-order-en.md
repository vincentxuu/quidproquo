---
title: "CS221 Lecture 16: Logic II: Quantifiers Beyond Individual Propositions"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 17
tldr: "Lecture 16 compresses knowledge across objects with predicates, quantifiers, and functions, then derives conclusions through substitution, unification, and definite-clause forward inference while exposing termination and completeness limits."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 16: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-16-logic-first-order)

This article covers **Stanford CS221, Autumn 2025, Lecture 16**, taught by Percy Liang on 2025-11-12. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the main artifact is the executable [first_order_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=first_order_logic). Rather than turning the slides into a generic introduction to first-order logic, this article follows the call sequence of `first_order_logic.py`: what each stage is trying to solve, what each example represents, and which boundaries the source code deliberately leaves visible.

> Material gap: The official lecture artifact, executable material, and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable. This article does not fill those gaps with material from another offering.

## TL;DR

Propositional logic treats an entire sentence as a truth-valued symbol. That is useful for composing a fixed, finite collection of propositions with connectives, but it has no natural way to express a rule about “all students” or “some person.” Lecture 16’s first-order logic (FOL) separates two layers: terms denote objects in a domain, while formulas denote truth values. Constants, variables, and functions build terms; predicates, connectives, and quantifiers build formulas.

The extra structure has a cost. A FOL model is not merely a truth assignment for proposition symbols. It must specify a domain and an interpretation: which objects constants denote, how functions map objects to objects, and which tuples satisfy each predicate. Under unique-names and domain-closure assumptions, part of FOL can be propositionalized and handled with propositional model checking. Without those assumptions, function terms may grow without bound. For definite clauses, modus ponens with substitution and unification is sound, but the source explicitly says it is not complete; a resolution rule is needed for completeness.

## 1. Logic has three separate commitments

The lecture begins with a compact definition: logic is a language for representing knowledge and reasoning about it. To define a logic, we need to specify at least three layers: syntax, semantics, and inference rules.

Syntax asks which formulas are valid. In propositional logic, `Rain` and `Wet` are proposition symbols, and `∧`, `∨`, `¬`, `→`, and `↔` can combine them recursively. For example, `Rain ∧ ¬Wet` is a formula. Its symbols have no internal Alice, course, or number structure.

Semantics asks what valid formulas mean. A propositional model assigns truth values to proposition symbols. If `Rain = True` and `Wet = False`, then `Rain ∧ ¬Wet` is true in that model. An interpretation function maps a formula and a model to True or False; we can also write `M(f)` for the set of models that satisfy a formula `f`.

A knowledge base (KB) is a set of formulas that we know. The source uses `Rain` and `Rain → Wet` as a KB and asks about `Wet`. If adding `Wet` leaves the model set unchanged, the KB entails `Wet`; if adding it produces the empty set, the result is a contradiction; if it produces a nonempty set different from the old one, it is a contingency. A KB is satisfiable exactly when it has at least one model, or `M(KB) ≠ ∅`. Entailment, contradiction, and contingency can therefore be reduced to satisfiability checks.

Inference rules answer how to derive new valid formulas from existing ones. The basic example is modus ponens: from `p` and `p → q`, derive `q`. Syntactically, if a set of rules produces `f`, we write `KB ⊢ f`; semantically, if every model satisfying KB also satisfies `f`, we write `KB ⊧ f`. The ideal is soundness—nothing derived is false—and completeness—nothing entailed is missed. The FOL inference section returns to both properties.

## 2. Where propositional logic becomes clumsy

The source intentionally represents several sentences in an awkward form. “Alice and Bob both know arithmetic” becomes two independent propositions:

```text
AliceKnowsArithmetic ∧ BobKnowsArithmetic
```

“All students know arithmetic,” if we only mention Alice and Bob, becomes:

```text
(AliceIsStudent → AliceKnowsArithmetic)
∧ (BobIsStudent → BobKnowsArithmetic)
```

But that is not a representation of “all”; it is an expansion for the names currently listed. The sharper example is: “Every even integer greater than 2 is the sum of two prime numbers.” Propositional logic has no natural place for arbitrary integers, addition, evenness, or primality, and no quantifier that says which objects must be considered. The source writes `???` at this point. The marker identifies an expressivity gap; it is not suggesting that adding more proposition names solves it.

The problem is not that propositional logic lacks enough connectives. A symbol such as `AliceKnowsArithmetic` has internal roles—`alice`, `Knows`, and `arithmetic`—but propositional logic treats the whole name as an indivisible atom. The other missing piece is variables and quantifiers: “all” needs a rule that ranges over objects, not a list that must be enumerated in advance and can never grow.

## 3. FOL syntax: terms and formulas are different types

FOL’s first change is a type distinction: formulas denote truth values, while terms denote objects. This boundary is the central syntactic rule of the lecture.

### Objects, constants, variables, and functions

For simplicity, the source declares one sort, `Object`. `alice`, `bob`, `arithmetic`, `phoenix`, `cs221`, `logic`, and `two` are constant symbols of that sort; `x`, `y`, and `z` are variables. These names are symbols, not Python strings that already identify objects.

Functions take objects and return objects. The source defines `father: Object → Object` and `add: Object × Object → Object`. Thus `father(alice)` and `add(x, y)` are terms: the first can denote Alice’s father, and the second can denote an object resulting from adding two objects. Because the source uses one generic `Object` sort, `add` is not constrained here to be arithmetic addition over an integer type. The meanings of “even integer” and “prime” are supplied by predicates and an interpretation.

### Predicates, connectives, and quantifiers

A predicate takes terms and returns a truth value. `Student` is unary and `Knows` is binary, so `Student(x)` and `Knows(x, arithmetic)` are atomic formulas. The zero-arity `Snowing` behaves like a propositional symbol: it can be viewed as a predicate with no arguments.

Connectives still apply to formulas, for example:

```text
Student(x) → Knows(x, arithmetic)
```

Quantifiers also apply only to formulas. `∀x. Student(x) → Knows(x, arithmetic)` says that for every domain object `x`, if it is a student then it knows arithmetic. `∃x. Student(x) ∧ Knows(x, arithmetic)` says that at least one object satisfies both conditions. Here `x` is bound by the quantifier; it is not the name of one fixed object.

The source lists several non-formulas on purpose: `father(x)` is a term, not a formula; `Knows(Student, arithmetic)` treats a predicate symbol as a term; and `Foo(Knows(alice, arithmetic))` passes a formula where a function expects an object. The lowercase/uppercase convention reinforces the same distinction: lowercase examples denote terms, while uppercase predicate applications denote formulas. If these categories are blurred, interpretation and substitution no longer have clear input types.

## 4. Quantifiers, scope, and translation traps

A quantifier governs the formula that follows it. Seeing “every” or “some” is not enough; we have to determine exactly which expression is in scope. The natural-language section makes the distinction concrete.

“Alice and Bob both know arithmetic” has no quantifier:

```text
Knows(alice, arithmetic) ∧ Knows(bob, arithmetic)
```

“All students know arithmetic” usually pairs a universal quantifier with implication:

```text
∀x. Student(x) → Knows(x, arithmetic)
```

“Some student knows arithmetic” usually pairs an existential quantifier with conjunction:

```text
∃x. Student(x) ∧ Knows(x, arithmetic)
```

These are not arbitrary translation slogans. A universal statement must say what follows when an object is a student; otherwise it incorrectly constrains every object in the domain to be a student. An existential statement needs a witness that satisfies both the identity condition and the property, which is exactly what the conjunction requires.

The source marks two “probably wrong” formulations. `∀x. Student(x) ∧ Knows(x, arithmetic)` means that every object is a student and every object knows arithmetic, which is much stronger than “all students know.” `∃x. Student(x) → Knows(x, arithmetic)` instead has the direction of “there is an object that is not a student or knows arithmetic”; it does not guarantee that the witness is a student. These are scope and connective errors, not minor solver details.

Consider “There is some course that every student has taken”:

```text
∃x. Course(x) ∧ ∀y. Student(y) → Takes(y, x)
```

The outer `x` is the course witness; the inner `y` ranges over students. For “Every even integer greater than 2 is the sum of two prime numbers,” the source writes:

```text
∀x. (Even(x) ∧ GreaterThan(x, two))
    → ∃y, z. Prime(y) ∧ Prime(z) ∧ add(y, z) == x
```

The existence of `y` and `z` is required separately for each qualifying `x`. Moving the existential outside would incorrectly make all such `x` share one pair of primes. Finally, the course-knowledge example is:

```text
∀x, y, z.
  (Student(x) ∧ Takes(x, y) ∧ Course(y)
   ∧ Covers(y, z) ∧ Concept(z)) → Knows(x, z)
```

All three variables have the whole implication in scope. The representation preserves the relationship “a student takes a course, the course covers a concept, and the student therefore knows the concept,” instead of inventing a proposition for every student-course pair.

## 5. A complete KB query

The motivating example builds this KB:

```text
Student(alice)
From(alice, phoenix)
Hot(phoenix) ∧ City(phoenix)
∀x. Student(x) → Person(x)
∀x. City(x) → Place(x)
Snowing → Cold
```

It then asks, “Is it snowing?” `ask(kb, Snowing)` does not treat missing evidence as False. It performs two satisfiability checks. First it adds `Not(Snowing)`. If that makes the KB unsatisfiable, every model satisfying the KB must make Snowing true, so it returns `Yes`. If not, it adds `Snowing`; if that is unsatisfiable, it returns `No`. If neither side creates a contradiction, it returns `I don't know`.

The example then adds:

```text
∀x, y.
  (Person(x) ∧ From(x, y) ∧ Hot(y) ∧ Place(y) ∧ Snowing)
  → ¬Happy(x)
```

This connects Alice, Phoenix, personhood, placehood, and Snowing, but the rule’s existence alone does not entail that it is snowing. Finally, adding `Happy(alice)` can conflict with the conclusion that follows when the Snowing condition holds. `ask` still answers by testing the KB with the query and with its negation, rather than by assigning a default value to an unsupported proposition. The example is FOL inference in a compact form: facts, rules, and a query are assembled into a KB, then a solver tests the relevant entailment directions.

## 6. Semantics: a model is more than truth slots

If FOL atomic formulas are assigned truth values independently like propositional symbols, two problems appear. First, functions generate infinitely many syntactically different terms: `father(alice)`, `father(father(alice))`, `father(father(father(alice)))`, and so on. There can therefore be infinitely many atomic formulas. Assigning a truth value to each one is a poor model representation.

Second, different pieces of syntax may denote the same object. `father(alice)` could be `bob`, but if both are treated as independent atomic strings, a model could make `Knows(father(alice), arithmetic)` true and `Knows(bob, arithmetic)` false without reflecting that they denote the same object.

The source solves this with a layer of indirection. First define a domain such as `o1`, `o2`, and `o3`. Then define an interpretation function for primitive symbols:

```text
constants:
  alice      ↦ o1
  bob        ↦ o2
  arithmetic ↦ o3

functions:
  father(o1) ↦ o2

predicates:
  Student(o1) = True
  Knows(o1, o3) = True
  Knows(o2, o3) = True
```

The model `w` is therefore `(domain, interpretation)`, not an arbitrary truth table. The interpretation function `ℐ(f, w)` recursively evaluates any formula: it first evaluates the objects denoted by terms, then evaluates predicates, connectives, or quantifiers.

The quantifier implementation directly mirrors the semantics. For `∀x. Knows(x, arithmetic)`, `interpret_formula` binds `x` to every object in the domain in turn and returns True only if every body is true. For `∃x. ...`, it returns True as soon as one object makes the body true. This is the executable form of scope: recursive calls carry a substitution that records the current variable binding. The source only supports one variable per quantifier and comments that nested-quantifier variable handling is incomplete. That is a boundary of this material, not a reason to silently expand it into a complete FOL interpreter.

## 7. Propositionalization: when the old method can return

Because FOL is more expressive than propositional logic, a FOL knowledge base cannot generally be expanded into a finite set of propositions. The source gives a conditional escape hatch: if the model satisfies unique names and domain closure, the relevant KB can be propositionalized.

Unique names means that each object corresponds to at most one constant. Domain closure means that each object corresponds to at least one constant. The source’s diagram marks models that violate these assumptions and makes clear that they are restrictions on the model, not universal truths of FOL. Under both assumptions, facts and rules about `alice` and `bob` can be expanded into propositions such as `StudentAlice`, `StudentBob`, `KnowsAliceArithmetic`, and `KnowsBobArithmetic`:

```text
StudentAlice
StudentBob
(StudentAlice → KnowsAliceArithmetic)
∧ (StudentBob → KnowsBobArithmetic)
StudentAlice ∧ KnowsAliceArithmetic
∨ StudentBob ∧ KnowsBobArithmetic
```

This is ordinary propositional logic again, so model checking from the previous lecture applies. In this regime, FOL is syntactic sugar for propositional logic: the expressivity is the same under the assumptions, but terms, variables, and quantifiers make the rules easier to write and read. The next question is deliberately left open: without unique names or domain closure, does this finite expansion still work? The source does not pretend that every FOL model can simply be enumerated.

## 8. Definite clauses, substitution, and unification

The source now avoids treating inference as a black-box solver and defines a formula shape for modus ponens: a definite clause.

```text
∀x₁ ... xₙ. (a₁ ∧ ... ∧ aₖ) → b
```

Here `x₁ ... xₙ` are variables, and `a₁ ... aₖ` and `b` are atomic formulas. The example is:

```text
∀x, y, z.
  (Takes(x, y) ∧ Covers(y, z)) → Knows(x, z)
```

`Or(Student(alice), Student(bob))` and `∃x. Student(x) ∧ Knows(x, arithmetic)` are not definite clauses. The source’s intuition is that disjunction is absent, and existential formulas are not directly allowed in this rule form.

First try exact-match modus ponens. The KB contains:

```text
Takes(alice, cs221)
Covers(cs221, logic)
∀x, y, z. (Takes(x, y) ∧ Covers(y, z)) → Knows(x, z)
```

We want `Knows(alice, logic)`. But the fact has the syntax `Takes(alice, cs221)`, while the rule premise is `Takes(x, y)`. They are not exactly equal, so direct matching cannot apply the rule.

### Substitution

Substitution searches a formula for variables and replaces them. Applying `{x ↦ alice, y ↦ cs221}` to `Knows(x, y)` gives `Knows(alice, cs221)`. Applying `{x ↦ alice, y ↦ z}` to `Student(x) ∧ Knows(x, y)` gives `Student(alice) ∧ Knows(alice, z)`. The operation recursively visits formula arguments; when it finds a variable in the substitution, it replaces it, otherwise it preserves the declaration and rebuilds the expression.

### Unification

Unification finds a substitution that makes two formulas equal. `Knows(x, y)` and `Knows(alice, bob)` can use `x ↦ alice, y ↦ bob`. `Knows(alice, y)` and `Knows(x, z)` can bind variables consistently. `Knows(alice, y)` and `Knows(bob, z)` fail because constants in the same outer argument position disagree.

Unifying the two rule premises,

```text
Takes(alice, cs221) ∧ Covers(cs221, logic)
```

with

```text
Takes(x, y) ∧ Covers(y, z)
```

produces `θ = {x ↦ alice, y ↦ cs221, z ↦ logic}`. Applying θ to the conclusion `Knows(x, z)` yields `Knows(alice, logic)`. This is the source’s “modus ponens with substitution and unification”: find a substitution that equalizes the premises, then apply the same substitution to the conclusion.

The simplified `is_variable` function hardcodes the names `x`, `y`, and `z` as variables. The source comments that, in `Takes(alice, x)`, this representation alone may not distinguish a constant from a variable by declaration. Again, the inference algorithm depends on its input representation. If the representation does not preserve the distinction, the unifier needs an extra convention.

## 9. Expressivity, computability, and limits

This lecture does not present a complete decidability theorem. Instead, it makes “more expressive” operational through assumptions and complexity. When there are no functions, each modus ponens application produces an atomic formula; the source gives the complexity scale as `num-constant-symbols^(maximum-predicate-arity)`. The number of constants and the maximum predicate arity therefore control the number of ground atomic formulas that may be enumerated.

With functions, terms can keep expanding: `father(alice)`, `father(father(alice))`, and further applications. There may be infinitely many candidate atoms, so inference is no longer merely filling finite predicate argument slots with finite constants. This does not claim that every particular input must run forever; the source says complexity can possibly be infinite. Termination and computational cost require additional restrictions and cannot be inferred from the existence of a solver.

The properties of modus ponens must also be separated. For the definite clauses it supports, the source marks it sound: if `KB ⊢ f`, then `KB ⊧ f`. It is not complete: some formulas satisfy `KB ⊧ f` even though this rule does not derive `KB ⊢ f`. “Everything it derives is correct” is not the same as “it derives every correct consequence.” The source says a resolution rule is needed for completeness; this lecture’s code does not implement resolution, so that statement must remain a stated direction rather than a demonstrated algorithm.

The whole lecture therefore presents a matched gain and cost. Objects and predicates preserve internal sentence structure. Functions build richer terms. Variables and quantifiers let rules range over individuals. Models use domains and interpretations to keep denotation coherent. Propositionalization borrows propositional tools under explicit assumptions. Substitution, unification, and modus ponens provide an inference path for definite clauses. But increasing expressivity also requires us to account for model space, term generation, and inference completeness.

## 10. A reading checklist for the executable lecture

First ask whether a name is an object term, a function term, a predicate, or a formula; do not let `father(x)` and `Student(x)` collapse into “some expression.” When you see `∀` or `∃`, mark its scope and check that implication or conjunction is on the intended side. When inspecting a model, look for its domain and the interpretations of constants, functions, and predicates—not an arbitrary truth table. For propositionalization, record unique names and domain closure; for modus ponens, record the definite-clause restriction; with functions, record the possibility of infinitely many terms. Finally, keep soundness and completeness separate: the former means “does not derive falsehood,” while the latter means “does not miss entailments.”

This is why the lecture is more than a vocabulary list. The source carries the same examples through sentences, syntax, models, queries, and inference rules. The important thing to follow is each change of representation and each assumption introduced by that change. The public Canvas interactions, assignment solutions, and hidden tests remain unavailable; this article preserves that gap instead of turning guesses into course conclusions.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: first_order_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=first_order_logic)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
