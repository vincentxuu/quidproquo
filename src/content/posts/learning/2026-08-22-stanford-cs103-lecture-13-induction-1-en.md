---
title: "Stanford CS103 Lecture 12: Induction, Counterfeit Coins, and Invariants"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, mathematical-induction]
lang: en
series:
  name: "Reading Stanford CS103"
  order: 14
tldr: "Induction is not a list of checked examples: establish a true starting point, prove that an arbitrary true case transmits truth to the next case, and invoke the induction principle."
description: "A deck-aligned guide to Stanford CS103 Lecture 12 covering induction, sums of powers of two, counterfeit coins, a missing-base-case error, and the MU puzzle invariant."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-13-induction-1)

This is article 14 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 12, Spring 2026 (2026-04-27)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not identify a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/12/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/12/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Mathematical Induction, Part I**. The deck begins with a room doing the wave, states the induction principle, develops a formal proof through a sum of powers of two, turns the counterfeit-coin problem into a recursive strategy, and finishes with a false proof and the MU puzzle to show why a base case and an invariant matter. These are not disconnected examples. Each asks how one property can be transmitted reliably from a current state to a next state.

## The wave: induction's two gears

Imagine a row of people doing the wave. The first person raises their arms. After that, each person raises their arms when the preceding person does. If both facts are reliable, the wave travels through the entire row. The first fact supplies a starting point; the second supplies a transmission rule. Neither suffices alone. With no starter, the rule is never triggered. If the rule can break, the later people are not covered.

Let `P(n)` mean that position `n` has some property. If `P(0)` is true and, for every `k ∈ ℕ`, `P(k) → P(k+1)`, then `∀n ∈ ℕ. P(n)`. Combine `P(0)` with the second statement at `k=0` to get `P(1)`, then use it at `k=1` to get `P(2)`, and continue. The deck's frame-by-frame arrows are not asking us to perform infinitely many manual checks. They visualize one chain created by a starting point and a uniform transmission rule.

## The three-part induction proof

The induction principle is a rule of inference; an induction proof is the writing pattern used to invoke it. CS103 separates that pattern into three obligations:

1. **Base case:** prove `P(0)`.
2. **Inductive step:** choose an arbitrary `k ∈ ℕ`, assume `P(k)`, and prove `P(k+1)`.
3. **Conclusion:** conclude by induction that `P(n)` holds for every `n ∈ ℕ`.

The second part is usually a direct proof of a universal implication. The value `k` must be arbitrary, not a convenient example. The statement `P(k)` is the inductive hypothesis and is available only while proving `P(k+1)`. It does not assume the whole theorem in advance, and it does not assume the target in a circle. Writing the exact contents of `P(n)` first is the best defense against both confusions.

## Define P(n) before calculating

The first complete theorem in the deck says that the sum of the first `n` powers of two is `2^n-1`. Including the empty sum, define

```text
P(n): 2^0 + 2^1 + ... + 2^(n-1) = 2^n - 1.
```

This definition fixes both the base case and the next target. The statement `P(0)` says that the sum of the first zero terms equals `2^0-1`; both sides are zero. The statement `P(k+1)` adds the new final term `2^k`. Without a precise index range, it is easy to write the last term as `2^n`, or to switch silently to a base case at `n=1`.

The values `1, 1+2, 1+2+4, ...` produce `1, 3, 7, 15, 31`. This pattern is useful for guessing the formula, but it is not a proof. Agreement on finitely many inputs says only that the conjecture has not yet met a counterexample. Induction explains why one mechanism covers every natural-number input.

## Complete proof: the first n powers of two

**Theorem.** For every `n ∈ ℕ`, the sum of the first `n` powers of two is `2^n-1`.

**Base case.** When `n=0`, the sum of the first zero terms is zero, and `2^0-1=0`. Thus `P(0)` is true.

**Inductive step.** Choose an arbitrary `k ∈ ℕ` and assume

```text
2^0 + 2^1 + ... + 2^(k-1) = 2^k - 1.    (1)
```

We must prove `P(k+1)`. Split the first `k+1` terms into the first `k` terms and one new term:

```text
2^0 + ... + 2^(k-1) + 2^k
= (2^0 + ... + 2^(k-1)) + 2^k
= (2^k - 1) + 2^k                    by (1)
= 2 · 2^k - 1
= 2^(k+1) - 1.
```

Therefore `P(k+1)` holds. By mathematical induction, the claim holds for every natural number. The actual bridge is the use of `(1)`: the inductive hypothesis replaces the old complicated block with a closed expression, and the new term advances that expression to the next index.

## The quantifiers are not optional

The inductive step proves `∀k ∈ ℕ. (P(k) → P(k+1))`. Its standard opening is therefore “choose an arbitrary `k ∈ ℕ` and assume `P(k)`,” and its endpoint is “therefore `P(k+1)`.” If a proof says only “assume it holds for `k`” without making `k` arbitrary, the reader cannot rule out reliance on a special case. If algebra appears without identifying the line that uses `P(k)`, the most important bridge is hidden.

The base case is an ordinary proposition `P(0)` and may be proved by any valid technique. The same is true inside the inductive step. Its outer form is a direct proof of a universal implication, but it may contain cases, contraposition, or contradiction. The powers-of-two example needs only algebra. The MU puzzle later needs cases and preliminary lemmas.

## A binary-integer aside

The deck notes that `1+2+4+...+2^31=2^32-1`, which explains the largest value of a 32-bit unsigned integer. Each bit represents one power of two; when all bits are `1`, the represented value is the sum of the first 32 powers. This is an application of the proved formula, not another rule of induction.

The more reusable lesson is a problem-solving cue. When an object grows by adding `2^k`, look for a relation that updates the answer at `k` into the answer at `k+1`. Induction does not apply merely because a formula contains `n`; it applies naturally when a claim has a clear start and a stable one-step update.

## Three and nine counterfeit coins

Suppose three apparently identical coins contain exactly one heavier counterfeit. Compare two coins on a balance. If one side is heavier, that coin is counterfeit. If the scale balances, the third coin is counterfeit. One weighing locates the answer among three coins.

For nine coins, divide them into three groups of three and weigh two groups. If the scale is uneven, the counterfeit belongs to the heavier group. If it balances, the counterfeit belongs to the unweighed group. The first weighing reduces nine candidates to three, and the second applies the procedure above. The important observation is not the particular nine-coin diagram; it is that each weighing reduces the problem to one-third its size.

One coin takes zero weighings, three take one, and nine take two. This suggests that `3^n` coins require `n` weighings. Here the inductive hypothesis is not an equation. It says that a strategy exists that completes a task within a resource bound.

## Inductive proof of the coin theorem

Let `P(n)` mean: if exactly one coin among `3^n` coins is heavier, it can be found in `n` weighings.

**Base case.** Since `3^0=1`, a group has one coin. No weighing is required to identify it, so `P(0)` holds.

**Inductive step.** Choose an arbitrary `k ∈ ℕ` and assume that the heavier coin among `3^k` coins can be found within `k` weighings. Now begin with `3^(k+1)=3·3^k` coins. Divide them evenly into three groups of `3^k`, then weigh two groups. Whether the scale tilts or balances, one weighing identifies the group containing the counterfeit. What remains is a problem of exactly the same kind on `3^k` coins. The inductive hypothesis solves it in `k` additional weighings. The total is `1+k=k+1`, so `P(k+1)` holds. By induction, the theorem holds for every natural number.

## An inductive hypothesis can be an algorithm

The coin proof shows that `P(k)` need not be an algebraic expression. It may assert that an object exists, a game can be completed, or an algorithm has a resource bound. Invoking `P(k)` does not magically produce the final answer. It supplies a procedure already guaranteed to handle a smaller instance.

The inductive step consequently resembles a recursive-algorithm correctness proof: perform one unit of work, reduce the input to a suitable subproblem, then invoke the guarantee for that subproblem. If the groups do not have exactly `3^k` coins, or if the first weighing cannot select exactly one group that contains the counterfeit, the inductive hypothesis does not apply. The proof must account for the subproblem's size, preconditions, and resource cost.

## How not to induct: no base case

The slides deliberately “prove” a false formula: the sum of the first `n` powers of two is `2^n`. If we assume the false `P(k)`, adding `2^k` really does produce `2^(k+1)`. In other words, the implication `P(k) → P(k+1)` can be perfectly valid while `P(0)` is false: the empty sum is zero, not `2^0=1`.

Without a true starting point, the transmission rule says only, “if the false formula happened to hold somewhere, it would keep holding.” It supplies no index at which the formula actually holds. When auditing an induction proof, substitute the full sentence into `P(0)` rather than checking only whether the author wrote the words “base case.”

## The MU puzzle's four rewriting rules

The final example is the MU puzzle from *Gödel, Escher, Bach*. Starting with `MI`, the goal is to produce `MU` using four operations:

1. Duplicate the entire substring after `M`, such as `MI → MII`.
2. Replace an occurrence of `III` with `U`.
3. Append `U` if the string ends in `I`.
4. Delete an occurrence of `UU`.

Blind search creates many strings but does not reveal whether a path is merely undiscovered or impossible. The deck instead tracks the number of `I` characters. The initial `MI` contains one `I`, not a multiple of three. The target `MU` contains zero, a multiple of three. The question becomes whether any rule can change “not a multiple of three” into “a multiple of three.”

## Two modulo-three lemmas

First, if an integer `r` is not a multiple of three, neither is `r-3`. Prove the contrapositive: if `r-3=3q`, then `r=3(q+1)`, so `r` is a multiple of three.

Second, if `r` is not a multiple of three, neither is `2r`. The remainder of `r` modulo three is one or two. If `r=3q+1`, then `2r=6q+2`, with remainder two. If `r=3q+2`, then `2r=6q+4=3(2q+1)+1`, with remainder one.

These lemmas match the rules that change the number of `I` characters. Duplication changes `r` to `2r`; replacing `III` with `U` changes it to `r-3`. Appending `U` and deleting `UU` manipulate only `U`, so the count remains `r`.

## Induction over every operation sequence

Let `P(n)` mean: “after any sequence of `n` legal moves, the number of `I` characters is not a multiple of three.” The word “any” matters. The goal is to exclude every possible solution, not just analyze one attempted path.

**Base case.** After zero moves the string is `MI`, with one `I`, so `P(0)` holds.

**Inductive step.** Choose arbitrary `k` and assume that after any `k` moves the count `r` is not a multiple of three. Consider any sequence of `k+1` moves and inspect its last move. Duplication produces `2r`, which remains a nonmultiple by the second lemma. Replacing `III` with `U` produces `r-3`, which remains a nonmultiple by the first lemma. Appending `U` or deleting `UU` preserves `r`. Every legal final move preserves the property, so `P(k+1)` holds. By induction, no finite number of moves can make the count a multiple of three.

## From an invariant to impossibility

Assume for contradiction that the puzzle has a solution, so a legal sequence transforms `MI` into `MU`. The target contains zero `I` characters, and zero is a multiple of three. But the preceding induction proves that the count after every finite sequence is not a multiple of three. This is a contradiction, so `MI` cannot be transformed into `MU`.

The deck connects this structure to a **loop invariant**. If a property holds before execution and every action preserves it, the property remains true after any finite series of actions. Algorithm proofs use the same arrangement for loops: initialization corresponds to the base case, preservation to the inductive step, and the invariant combines with the exit condition at termination.

## An executable induction checklist

1. Is `P(n)` a proposition with explicit quantifiers, indices, and preconditions?
2. Is the starting index really zero, and is the expanded `P(0)` true?
3. Does the inductive step choose arbitrary `k` rather than check a specific number?
4. Does it assume only `P(k)` and explicitly state the target `P(k+1)`?
5. When the hypothesis is invoked, does the subproblem satisfy all its preconditions?
6. If several next actions are legal, does the proof cover every case?
7. Does the conclusion explicitly invoke induction for all natural numbers?

A practical debugging method is to expand the base case, hypothesis, and target as full sentences. In the powers-of-two proof, this exposes empty-sum and exponent off-by-one errors. In the coin problem, it exposes incorrect group sizes. In the MU puzzle, it exposes the quantifier difference between one path and all paths.

## Material limits

The complete public deck supports the wave, the induction principle, both full demonstrations, the false proof, the MU puzzle, and the loop-invariant connection. It also lists entertaining variants of the coin problem without developing their solutions in the deck, so this article does not fill them in on the course's behalf. Recordings, student responses, and spoken transitions are not public and are not reconstructed as instructor statements.

The next lecture is previewed as covering later starting points, larger steps, and complete induction. Those variations belong to official Lecture 13, the next article in this series, and are not folded into this lecture.

## Update log

- 2026-08-22: Rebuilt the lost body from the complete official Lecture 12 deck, restoring the powers-of-two proof, counterfeit-coin strategy, false induction, and MU puzzle invariant.

## References

- [Stanford CS103 Spring 2026 Lecture 12: Mathematical Induction, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/12/)
- [Official Lecture 12 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/12/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 4](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps4/)
