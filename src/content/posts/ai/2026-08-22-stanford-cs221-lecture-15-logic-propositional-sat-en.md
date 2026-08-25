---
title: "CS221 Lecture 15: Logic I: Models, Entailment, and SAT"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 16
tldr: "Lecture 15 separates propositional syntax from semantics: model checking defines entailment through satisfying assignments, SAT finds witnesses, and inference rules must be judged for both soundness and completeness."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 15: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-15-logic-propositional-sat)

This article covers **Stanford CS221, Autumn 2025, Lecture 15**, taught by Percy Liang on 2025-11-10. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is the executable lecture's [`propositional_logic.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=propositional_logic). Rather than flattening “logic” into a glossary, this reading follows the source in execution order and connects each definition, example, and reduction.

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Why logic: the lecture's starting problem

The lecture begins with AI's basic loop—perceive, reason, act, and learn. The previous lecture covered probabilistic reasoning with Bayesian networks; this one turns to logical reasoning, first propositional logic and later first-order logic. The change is not a rejection of probability. AI also needs a language in which knowledge and rules can be stated explicitly and conclusions can be derived from them.

The source opens with a problem that can be solved without enumerating possibilities: if `A + B = 10` and `A - B = 4`, what is `A`? A person normally manipulates the symbols algebraically instead of trying every possible pair of values. That is the intuition for symbolic or logical reasoning: place a problem in a structured language and exploit its structure.

Logic was a dominant AI paradigm before the 1990s, but the lecture names two limits: it is deterministic rather than probabilistic, and rule-based rather than data-driven. Its continuing strength is expressivity: a formula can represent substantial knowledge compactly, although compact representation will not guarantee cheap computation.

Think of logic as a language whose goals are to represent knowledge and reason with it. Natural language is slippery: “a dime is better than a nickel” and “a nickel is better than a penny” support one intuitive transitive conclusion, but “a penny is better than nothing” and “nothing is better than world peace” do not safely support the analogous conclusion without a formal relation.

The course distinguishes informal natural languages from formal ones: English or German can state the same idea; programming languages use forms such as Python's `def even(x): return x % 2 == 0`; logical languages use first-order `∀x. Even(x) → Divides(x, 2)` or description-logic `Even ⊑ ∀ Divides.2`. The official source also places `Divides(x, 2)` beside prose saying “Two divides x/even”; this article preserves that notation/prose ambiguity and does not silently correct the artifact. Each formal language defines well-formed expressions and interpretation.

A logic has three ingredients:

- **Syntax** defines the set of valid formulas.
- **Semantics** defines their meaning and when they are true.
- **Inference rules** define how to derive new valid formulas from existing ones.

Syntax and semantics must remain separate. `2 + 3` and `3 + 2` differ syntactically but can mean 5; `3 / 2` has the same syntax but can mean 1 in Python 2.7 and 1.5 in Python 3. Models and interpretation assign meaning, inference rules operate on structure, and soundness/completeness later relate the two.

## Propositional syntax: define what can be written

Propositional logic is the simplest logic in the lecture. Its atomic formulas are propositional symbols such as `P`, `Q`, `Rain`, and `Wet`. At this stage they are names. The source does not assume that Rain is actually true in the world or add a causal story to Wet.

The language then provides five connectives: `∧`, `∨`, `¬`, `→`, and `↔`. If `f` and `g` are already propositional formulas, then `¬f`, `f ∧ g`, `f ∨ g`, `f → g`, and `f ↔ g` are also formulas. Nothing else is a formula. That final sentence matters: syntax is not a license to accept any string containing familiar symbols.

Using `Rain` and `Wet`, the source constructs `¬Rain`, `Rain ∧ Wet`, `Rain ∨ Wet`, `Rain → Wet`, and `Rain ↔ Wet`. It then gives `P`, `¬P`, `¬P ∨ Q`, and `P → (Q ∨ ¬P)` as examples. These are tree-shaped objects, not merely lines of text. In `P → (Q ∨ ¬P)`, parentheses preserve the consequent's structure as a disjunction.

The source marks `P ¬Q`, `P + Q`, and `P(A) ∨ Q(B)` as non-formulas: they lack a legal connective, import arithmetic, or import predicate-and-argument notation not defined here. We know the syntax, but not yet the meaning.

## Semantics: models, interpretation, and models of a formula

A formula by itself is only syntax. To give it a truth value, propositional logic uses a model `w`, representing a state of the world. A model assigns `true` or `false` to every propositional symbol. With only `A`, `B`, and `C`, there are `2^3 = 8` possible models, from `{A: False, B: False, C: False}` through `{A: True, B: True, C: True}`. These are eight complete assumptions about the state, not eight preferred answers.

The interpretation function `ℐ` connects syntax to semantics. Given a formula `f` and a model `w`, it returns `true` or `false`: is `f` true in `w`? For an atomic formula it looks up `w[f]`. For `¬g` it returns `not ℐ(g,w)`; for `g ∧ h`, both subformulas must be true; for `g ∨ h`, at least one must be true; for `g → h`, the implementation is `not ℐ(g,w) or ℐ(h,w)`; and for `g ↔ h`, it compares the two truth values.

The official code implements `I(f, w)` by recursively walking a Z3 formula. Its example is `f = (¬A ∧ B) ↔ C` under `A=True, B=True, C=False`. Interpretation does not guess from the English reading. It evaluates from the tree: `¬A` is false, `¬A ∧ B` is false, and `C` is also false. The two sides of the biconditional therefore have equal truth values, so the whole formula is true. The example shows how syntax determines the computation of a truth value once a model is supplied.

The **models** of a formula `f`, written `M(f)`, are all models `w` for which `ℐ(f,w)=true`. The source's `get_models` enumerates every Boolean combination for the requested symbols, constructs a dictionary for each one, and keeps it when `I` accepts it. For `Rain ∨ Wet`, the result contains assignments where at least one is true. For `Rain ∧ Wet`, it keeps only assignments where both are true.

This is the central compression idea of propositional logic: a small formula can compactly represent a potentially large set of models. Writing `Rain ∨ Wet` avoids listing every matching world. But the most direct model-checking implementation may still have to consider those assignments one by one. Compact representation and cheap computation are different promises.

## Knowledge bases: collecting what is known

A knowledge base, or KB, is a set of formulas. The source suggests thinking of it as a set of facts that grows over time. The models `M(KB)` are the models satisfying every formula in the KB—the worlds still possible given what is known.

Take `KB = [Rain, Rain → Wet]`. Its models are the intersection of `M(Rain)` and `M(Rain → Wet)`. Semantically, a KB is equivalent to the conjunction of its formulas: `to_formula(kb)` produces `Rain ∧ (Rain → Wet)`, and finding the models of that formula produces the same result as intersecting the two model lists.

Adding a formula can only shrink or preserve the set of possible worlds. Formally, `KB ⊆ (KB ∪ {f})`, so `M(KB ∪ {f}) ⊆ M(KB)`. As knowledge increases, the candidate worlds do not multiply. The set may remain unchanged, become smaller, or become empty. This set relationship is the shared foundation for entailment, contradiction, and contingency.

## Entailment, contradiction, and contingency

Compare `M(KB ∪ {f})` with `M(KB)`. What effect does adding `f` have?

**Entailment** is written `KB ⊧ f`. It means `M(KB ∪ {f}) = M(KB)`. Adding `f` removes no model, so every model of the KB already makes `f` true. The source checks `entails([Rain, Rain → Wet], Rain)`, which is true because Rain is already in the KB. This is stronger than seeing Rain in one example: it is a claim about every world compatible with the KB.

**Contradiction** means `M(KB ∪ {f}) = ∅`. No model can satisfy the KB and `f` together, so `f` is incompatible with the current knowledge. `[Rain, Wet]` plus `¬Wet` is the source's example. This does not mean that `f` is false in every conceivable world; it means that it cannot coexist with this KB.

**Contingency** means `∅ ≠ M(KB ∪ {f}) ≠ M(KB)`. Some models survive and some are eliminated. `[Rain]` plus `Wet` is contingent in the source: worlds where it rains and is wet remain, but Rain alone did not entail Wet.

These cases can be read as three amounts of information. Entailment adds no information, contradiction leaves no compatible world, and contingency narrows the possibilities without eliminating them all. There is also a useful equivalence: KB contradicts `f` if and only if `KB ⊧ ¬f`. If every KB model makes `¬f` true, no model can survive adding `f`.

## Ask and Tell: operating on a KB

Once we have a KB, two direct operations are `Ask[f]` and `Tell[f]`. `Ask` queries the KB, but the lecture emphasizes that its answer is ternary rather than simply yes/no. If the KB entails `f`, the answer is **Yes**. If it contradicts `f`, the answer is **No**. If `f` is contingent, the answer is **I don't know**.

The three source examples are: with `KB=[Rain,Wet]`, ask `Rain ∨ Wet` and get Yes; with `KB=[Wet, ¬Rain]`, ask `Rain` and get No; with `KB=[Rain]`, ask `Wet` and get I don't know. The last answer is easy to get wrong if one imports an everyday causal assumption. This propositional KB does not contain `Rain → Wet`, so the reasoner may use only the formulas it was given.

`Tell` adds a statement to the KB, again with three possible reactions. If the new formula is already entailed, return **I already knew that** and leave the KB unchanged. If it causes a contradiction, return **I don't buy that** and keep the original KB. If it is contingent, return **I learned something new** and add it. The source demonstrates all three: `Tell[Wet]` to `[Rain, Rain → Wet]` was already known; `Tell[¬Rain]` to `[Rain,Wet]` was rejected; and `Tell[¬Wet]` to `[Rain]` added a compatible new constraint.

Ask and Tell are therefore not a separate mysterious reasoning system. They compare the old model set with the model set after adding `f`, then translate the set relationship into a conversational response. The direct implementation also exposes the cost: `M(KB)` and `M(KB ∪ {f})` can be exponentially large.

## The connection to Bayesian networks

The lecture briefly returns to Bayesian networks. A Bayesian network assigns a probability to every assignment of a set of variables; propositional logic only asks whether an assignment is a model. The vocabulary maps as follows: random variables correspond to propositional symbols, and assignments correspond to models. In probabilistic inference, evidence corresponds to the KB and a query corresponds to what we ask.

`P(Rain | Wet = 1)` can therefore be compared conceptually with “Tell[Wet]; Ask[Rain],” but the answer types differ. Propositional logic permits arbitrary formulas as evidence and query, such as `(Rain ∧ Wet) ∨ (Rain ∧ ¬Snow)`. The comparison in the source is not a claim that the two formalisms are identical; it shows how the same assignments can be filtered by truth or weighted by probability.

Given a joint distribution `P`, sum the probabilities of all worlds satisfying the KB: `P(KB) = Σ_{w ∈ M(KB)} P(W = w)`. Similarly, `P(KB ∪ {f})` sums the worlds satisfying both constraints, and `P(f | KB) = P(KB ∪ {f}) / P(KB)`. This yields a number between 0 and 1, generalizing the logical responses Yes, No, and I don't know. The important distinction remains: logic supplies constraints and truth, while the Bayesian network supplies weights over assignments.

## Satisfiability: reducing inference to one core question

So far Ask and Tell were implemented through entailment, contradiction, and contingency. If we explicitly enumerate every model, the model set can grow exponentially. The lecture therefore reduces the three-way reasoning problem to one operation: a KB is **satisfiable** exactly when `M(KB) ≠ ∅`, meaning at least one world satisfies every formula.

First check `KB ∪ {f}`. If it is unsatisfiable, then the KB contradicts `f`. If it is satisfiable, that result alone cannot distinguish entailment from contingency: at least one compatible world exists, but we do not know whether every original world satisfies `f`.

Use the earlier equivalence. Check `KB ∪ {¬f}`. If it is unsatisfiable, no model of the KB can make `¬f` true, so `KB ⊧ f`. If it is satisfiable, there is a KB model with `f` false; together with the first satisfiable check, that gives contingency. Two calls are necessary because one satisfiability check returns one bit of information while Ask/Tell must separate three outcomes.

The task is called **model checking**: input a KB and output whether it is satisfiable. The code gives the smallest Z3 workflow. Create a `Solver`, call `solver.add(f)` for each formula in `[Rain, Wet]`, and call `solver.check()`. If the result is `sat`, `solver.model()` returns some model in `M(KB)`. That model is a witness that at least one assignment works; it is not the complete model set and is not necessarily unique.

The lecture names the SAT algorithms under the solver: the **DPLL algorithm (exhaustive search)** and **conflict-driven clause learning (CDCL)**. The source only places these names under SAT solvers; it does not implement branching, unit propagation, backtracking, or clause learning in `propositional_logic.py`. I therefore do not present those details as if they were developed in this lecture. The core SAT contract remains: determine whether there exists an assignment satisfying all constraints.

## From model checking back to human-style inference

Up to this point, semantics drove Ask and Tell: enumerate models or delegate the question to a solver. But the opening algebra example reminds us that humans usually manipulate symbols rather than listing all assignments. This motivates inference rules.

The source's minimal inference example is: `Rain`; `Rain → Wet`; therefore `Wet`. In general this is modus ponens, `p, p → q ⊢ q`. An inference rule has premises `f_1, ..., f_n` and a conclusion `g`. Rules operate on the syntax of formulas, not directly on the semantic model set.

Forward inference takes a set of rules and an initial KB. Repeatedly choose formulas `f_1, ..., f_n` in the KB. If a matching rule `f_1, ..., f_n ⊢ g` exists, add `g` to the KB. Stop when there are no more changes. If `f` is eventually added, the source says that the KB derives or proves `f`, written `KB ⊢ f`.

For Rain and Wet, Rain is initially known and the implication supplies the matching rule, so Wet is added. The source also shows what cannot be derived from this material: `¬Wet` and `Rain → Slippery` do not follow. What a forward reasoner can produce depends on the premises and rules, not on whether a sentence sounds plausible.

## Soundness and completeness

There are now two related sets. The syntactic set is `{f: KB ⊢ f}`, the formulas the inference procedure actually derives. The semantic set is `{f: KB ⊧ f}`, the formulas true in every model of the KB. The first is a procedural result; the second is the definition of entailment.

**Soundness** says `{f: KB ⊢ f} ⊆ {f: KB ⊧ f}`. Every formula produced by the rules is genuinely entailed by the KB. The rules produce “nothing but the truth.” **Completeness** says `{f: KB ⊧ f} ⊆ {f: KB ⊢ f}`. Every formula entailed by the KB can be derived by the rules, so the system captures “the whole truth.”

The ideal is equality: everything derived is true, and everything true in the semantic sense is derivable. This is why the lecture puts syntax, semantics, and inference rules together. Model checking and SAT answer entailment from the model side; forward inference produces proofs from the symbol side; soundness and completeness describe the relationship between those routes.

## What the public source does not add

The public source has a clear chain: motivation through reasoning; the three ingredients of a formal language; propositional syntax and its five connectives; semantics through `I`, `get_models`, and KBs; entailment, contradiction, contingency, Ask/Tell; the Bayesian-network comparison; satisfiability and Z3 model checking; then modus ponens, forward inference, soundness, and completeness.

It does not provide Canvas interactions, assignment solutions, hidden tests, or a CNF-conversion implementation in `propositional_logic.py`. It also does not walk through unit propagation, backtracking, DPLL branching, or CDCL learning. Those topics should not be filled in from another offering or from intuition. The computational limit already present in this lecture is enough to state precisely: formulas can be compact representations, while direct model enumeration can be exponential; SAT solvers make the existence of at least one satisfying assignment the central computational question.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: propositional_logic](https://stanford-cs221.github.io/autumn2025-lectures/?trace=propositional_logic)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
