---
title: "Stanford CS103 Lecture 3: Propositional Logic, Truth Tables, and Equivalence"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 5
tldr: "Propositional logic abstracts English statements into Boolean variables, then uses truth tables to check connectives, translation direction, and equivalences."
description: "A deck-aligned guide to propositional variables, seven logical symbols, truth tables, English translation, precedence, De Morgan's laws, and implication equivalences."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-04-propositional-logic)

This is article 5 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 3, Spring 2026 (2026-04-06)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page has no per-meeting speaker field, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/03/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/03/Lecture%20Slides.pdf) are public; Canvas/Panopto recordings and transcripts were not used.

The lecture asks how to formalize definitions and reasoning used in proofs. Propositional logic compresses each complete statement into one Boolean value and studies how connectives combine those values. First-order logic, introduced next, opens statements back up to discuss objects and properties. That boundary is both propositional logic's power and its limitation.

## From English propositions to Boolean algebra

A proposition is a statement that is either true or false. Declarative English sentences can be propositions; commands and questions are not, because “close the door” and “what time is it?” do not themselves receive truth values. A propositional variable represents a whole proposition, usually with a lowercase letter such as $p,q,r,s$, and takes one of two values.

The deck compares this abstraction to moving from arithmetic to algebra. Arithmetic verifies expressions for particular numbers; algebra replaces numbers with variables to expose reusable structural rules. Similarly, replacing “integer $x$ is odd” or “you earned an A+” by $p$ lets us ignore subject matter and inspect argument form. The validity of contraposition is reusable across puppies, parity, and cat food.

## The three basic connectives: not, and, or

The slides begin with negation $¬p$, conjunction $p∧q$, and disjunction $p∨q$. Negation reverses the input. A conjunction is true only when both operands are true. A disjunction is true when at least one operand is true. This is inclusive or: the true-true row remains true, as with `||` in C-family languages and `or` in Python.

Exclusive or can be constructed rather than treated as primitive: $(p∨q)∧¬(p∧q)$ or $(p∧¬q)∨(¬p∧q)$. In both formulas, false-false and true-true produce false, while exactly one true input produces true. Writing only $p∨q$ fails on the true-true row.

The basic tables can be remembered by their exceptional rows. Conjunction has exactly one true row, and disjunction exactly one false row. Do not merge these shortcuts with implication: conjunction asks whether both facts hold, disjunction whether at least one holds, and implication whether a conditional promise has been broken.

## A truth table is a complete formula specification

A truth table gives a formula's output for every input valuation. Two variables produce four rows; $n$ independent variables produce $2^n$ rows. For a compound formula, add columns for subformulas rather than guessing the final value from English intuition.

To evaluate $(p∨q)∧¬(p∧q)$, compute $p∨q$, then $p∧q$, then its negation, and finally the outer conjunction. Truth tables also define semantic equivalence: two formulas are equivalent when their output columns match for every input row.

Use a systematic row order to avoid omissions: false-false, false-true, true-false, true-true for two variables. With three, toggle the rightmost variable each row, the middle every two rows, and the leftmost every four. Check that all inputs appear before computing each column from its direct children. For implication, mark the unique false row; for biconditional, compare whether the input columns agree. If a shortcut feels uncertain, return to the complete enumeration.

## The four implication rows and vacuous truth

The implication $p→q$ is false only when $p$ is true and $q$ false. Its rows are: false-false true, false-true true, true-false false, and true-true true. The deck again uses the promise “if you pick a perfect March Madness bracket, you receive an A+.” A nonperfect bracket does not violate the promise regardless of the grade; a perfect bracket without the A+ does.

An implication with false antecedent is vacuously true. This does not prove the consequent itself; it says that this input gives no violation of the conditional. The definition also aligns $p→q$ with $¬(p∧¬q)$ and $¬p∨q$. Changing the false-false row would break those equivalences and the counterexample structure developed in the previous lecture.

## Biconditional and the truth constants

The biconditional $p↔q$ means $(p→q)∧(q→p)$. It is true when the two operands have equal truth values: true on false-false and true-true, false on the mixed rows. Thinking of it as Boolean equality helps read its table, though proving an iff still requires both directions.

The deck adds $⊤$, always true, and $⊥$, always false. The logic of contradiction can then be written $(¬p→⊥)→p$: if assuming $p$ false forces falsity, conclude $p$.

## Operator precedence and parentheses

The listed precedence from tightest to loosest is $¬$, $∧$, $∨$, then $→$. Negation binds to what immediately follows, and conjunction and disjunction bind more tightly than implication. Thus $p∧q→r$ conventionally parses as $(p∧q)→r$.

For the deck's dense expression $¬x→y∨z→x∨y∧z$, first group $¬x$ and $y∧z$, then disjunctions, then implications. If repeated arrows or equal-precedence operators leave any doubt, add parentheses rather than guessing associativity. A reliable parser marks negation operands, groups conjunctions, groups disjunctions, and handles arrows last. Translation works in reverse: identify the sentence's main connective, then recursively translate each side.

## The seven symbols and their programming analogues

The deck's “big table” contains negation $¬$, conjunction $∧$, disjunction $∨$, implication $→$, biconditional $↔$, truth $⊤$, and falsity $⊥$. The first three resemble `!`, `&&`, and `||`; the constants resemble `true` and `false`. The slides deliberately do not pretend implication and biconditional are single common operators, pointing programming exercises to PS2.

Programming analogies help remember truth values but must not import execution semantics. Short-circuit evaluation concerns whether a right-hand function runs; propositional logic treats both operands as propositions with values. The later De Morgan code example preserves short-circuit behavior as an additional fact about that rewrite.

## Translating English begins with fixed atomic propositions

The slides define $a$ as “I will be in the path of totality” and $b$ as “I will see a total solar eclipse.” “I won't see a total solar eclipse if I'm not in the path of totality” becomes $¬a→¬b$. First identify complete atomic statements, then place connectives; do not reverse direction based on causal intuition.

The phrase “p if q” means “if q, then p,” hence $q→p$, not $p→q$. Treat the clause after `if` as the antecedent. By contrast, “p only if q” places $q$ as a necessary condition and becomes $p→q$. The deck explicitly highlights the first trap because word order alone is unreliable.

Truth semantics can verify the eclipse translation. The promise is violated only when someone is outside the path yet sees the eclipse: $¬a$ true and $¬b$ false. The mistaken reverse $¬b→¬a$ would claim that anyone who fails to see the eclipse must be outside the path, ignoring clouds or other causes.

## In propositional logic, but is still conjunction

Add $c$: “there is a total solar eclipse today.” The sentence “if I will be in the path of totality, but there is no eclipse today, I won't see a total eclipse” becomes $(a∧¬c)→¬b$. English `but` conveys contrast, yet its truth condition is conjunction.

This example tests three scopes: `but` conjoins two conditions, “no” negates only $c$, and the entire conjunction is the antecedent. Although precedence also parses $a∧¬c→¬b$ correctly, parentheses make the translation structure explicit.

## Equivalence means every row matches

Propositional equivalence means two formulas agree for every valuation. The cup example asks what disproves $p∧q$ when $p,q$ say chocolate is under cups 1 and 2: one empty cup suffices. To disprove $p∨q$, both cups must be empty. That contrast motivates the negation rules for conjunction and disjunction.

Agreement on one example does not prove equivalence. Build shared input rows, calculate both output columns, and compare all rows. One differing row refutes equivalence; proving it requires all rows or a sequence of already established equivalence transformations.

## Understanding De Morgan's laws row by row

The two laws are

\[
¬(p∧q)≡¬p∨¬q,
\qquad
¬(p∨q)≡¬p∧¬q.
\]

“Not both” means at least one fails; “not either” means both fail. When negation crosses the parentheses, swap $∧$ and $∨$ and negate each operand. The cup model checks the distinction: one empty cup refutes the conjunction, whereas both must be empty to refute the disjunction.

The slides rewrite `!(p() && q())` as `!p() || !q()`. Their truth values agree, and in this case their short-circuit behavior does too. The mathematical point is the equivalence, not a universal code-style rule.

## Two important implication equivalences

Because implication fails exactly on $p∧¬q$,

\[
p→q≡¬(p∧¬q).
\]

It follows immediately that $¬(p→q)≡p∧¬q$, matching the previous lecture's counterexample form. Applying De Morgan gives

\[
¬(p∧¬q)≡¬p∨¬¬q≡¬p∨q,
\]

so $p→q≡¬p∨q$. If $p$ is false, $¬p$ makes the disjunction true; if $p$ is true, $q$ determines it, exactly reproducing the implication table.

The derivation is auditable in three steps: replace the arrow by the negated failure case, distribute negation using De Morgan, and eliminate double negation. Each step preserves the same free variables and applies one known equivalence. This is stronger than jumping to the final expression by intuition.

## Common translation errors and an executable self-check

Common errors include treating inclusive or as exclusive, translating “p if q” in surface word order, inventing a special connective for `but`, and pushing negation inward without swapping conjunction and disjunction. Another is saying a false antecedent proves the consequent; vacuous truth belongs to the whole implication.

Build four-row tables for $p↔q$ and $(p→q)∧(q→p)$; for the two exclusive-or formulas; for $p→q$ and $¬p∨q$; and finally find a row separating $¬(p∧q)$ from the incorrect $¬p∧¬q$. Add subformula columns each time. This makes the exercise a mechanical semantic check rather than an English guess.

## Material limits

The complete public deck supports propositional variables, all seven symbols and tables, precedence, the eclipse translations, cup examples, De Morgan's laws, and implication equivalences. It includes poll and neighbor-discussion prompts but not results, recording, transcript, or student responses, so those interactions are not reconstructed. PS2 is noted only as the follow-up named by the slides; restricted solutions are not reproduced.

## Update log

- 2026-08-22: Rebuilt both language versions from the complete official deck, restoring truth tables, translation examples, precedence, and propositional equivalences.

## References

- [Stanford CS103 Spring 2026 Lecture 3: Propositional Logic](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/03/)
- [Official Lecture 3 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/03/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 2](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps2/)
