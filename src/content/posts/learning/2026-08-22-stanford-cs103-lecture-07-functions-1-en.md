---
title: "Stanford CS103 Lecture 6: Functions I, from Definitions to Injection and Surjection Proofs"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, functions]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 8
tldr: "A function is more than a formula: domain, codomain, totality, and determinism are essential, while the quantifiers defining involutions, injections, and surjections dictate their proofs."
description: "A deck-aligned guide to Stanford CS103 Spring 2026 Functions, Part I: formal definitions, piecewise rules, involutions, injections, surjections, and proofs."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-07-functions-1)

This is article 8 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 6, Spring 2026 (2026-04-13)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not identify the speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/06/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/06/Lecture%20Slides.pdf) are public; Canvas/Panopto recordings and transcripts were not used.

The official title is **Functions, Part I**. It rebuilds familiar functions as objects checkable with sets and first-order logic. “Is this a function?”, “Is it injective?”, and “Is it surjective?” become quantified claims that can be negated and proved instead of answered by visual intuition.

## 1. The proof-technique table returns

The deck revisits the proof-technique table. To prove `∀x. A`, let the reader choose arbitrary `x` and prove `A`. To prove `∃x. A`, provide and verify a witness. For `A → B`, assume `A` and derive `B`. Prove both conjuncts and both directions of a biconditional. Simplify a negation before selecting the matching technique.

This is not disposable machinery from earlier lectures. Function properties are first-order definitions, so their proof shapes are encoded in quantifiers. A universal asks the reader to choose; an existential asks the writer for a witness. Every proof below follows “read the formula, then arrange the prose.”

## 2. A function is a deterministic mapping

Algebra presents `f(x)=x⁴-5x²+4`; programming presents a procedure receiving arguments and returning a result. Both capture input and output, but CS103 requires **determinism**: the same input always gives the same output. A randomized C++ routine can be a valid program without being a mathematical function here.

Determinism does not require distinct inputs to have distinct outputs. `f(1)=0` and `f(2)=0` are allowed. It forbids assigning unequal outputs to the same input. This separates the function requirement from injectivity.

## 3. Domain and codomain are part of a function's identity

A function has a domain of legal inputs and a codomain in which outputs lie. Write `f : A → B`. Every element of `A` receives an output in `B`; not every element of `B` must be produced.

Thus codomain is not attained range. Absolute value can be `f : ℝ → ℝ`: every result is real, though negatives are missed. Without its type, the formula does not reveal whether missed negatives belong to the intended codomain. Changing domain or codomain can change the function and its injection or surjection status.

## 4. The two official rules for functions

The deck formalizes `f : A → B` as:

```text
∀a ∈ A. ∃b ∈ B. f(a) = b
∀a₁,a₂ ∈ A. (a₁ = a₂ → f(a₁) = f(a₂))
```

Every legal input has a legal output, and equal inputs have equal outputs. An empty domain violates neither universal because no counterexample exists. With actual elements, every one must be evaluable with a determinate codomain value.

The second rule prevents one input from splitting into inconsistent answers; it does not compare distinct inputs. Injectivity later reverses the implication's usable direction.

## 5. Defining a function takes three components

A definition supplies domain, codomain, and evaluation rule. A diagram draws sets and arrows; algebra may state `f : ℤ → ℤ` and `f(x)=x²+3x-15`. The type determines what the rule accepts and where results land.

In a diagram, no outgoing arrow means incomplete definition; two different outgoing targets violate determinism. Several inputs reaching one output still form a function, though perhaps not an injection. An unhit codomain point also permits a function, though perhaps not a surjection.

## 6. Piecewise seams require two checks

The deck's absolute-value-style rule returns `n` for nonnegative `n` and `-n` for nonpositive `n`. Zero meets both conditions, so branches must agree there. Conflicting overlap breaks determinism; an uncovered domain point breaks totality.

For `f(x)=(x+2)/(x+1)`, `f : ℕ → ℝ` is valid, while `f : ℝ → ℝ` fails at `x=-1`. Restrict the domain to `ℝ \ {-1}` or consistently define the exception rather than ignoring it.

## 7. Involutions: doing twice returns to the start

If `f : A → A` and `∀x ∈ A. f(f(x))=x`, then `f` is an involution. The first output must be legal input to the second application. Flipping a switch twice, double negation, `-(-x)=x`, and `(A △ B) △ B=A` share this structure.

Identity and negation are involutions. `1/x` on `ℝ → ℝ` is not even a function because of zero; on `ℝ\{0} → ℝ\{0}`, it is an involution. Sending even `n` to `n+1` and odd `n` to `n-1` swaps neighboring pairs, so two applications return the original.

## 8. Proving a piecewise involution by cases

For the adjacent-swapping `f : ℤ → ℤ`, choose arbitrary `n` and prove `f(f(n))=n`. Since the rule branches on parity, use exhaustive cases.

If `n` is even, `f(n)=n+1` is odd, so `f(f(n))=(n+1)-1=n`. If `n` is odd, `f(n)=n-1` is even, so `f(f(n))=(n-1)+1=n`. The cases cover every integer. The slides call the parity transitions lemmas: helper theorems, not silent intuitive jumps.

## 9. A counterexample refutes involution

Negate the definition:

```text
¬∀x ∈ A. f(f(x)) = x ≡ ∃x ∈ A. f(f(x)) ≠ x.
```

For `f : ℕ → ℕ, f(n)=n²`, choose `n=2`; `f(f(2))=16≠2`. One failure suffices. Zero and one surviving repeated squaring verify only two inputs, not the universal. Proving involution needs an arbitrary-input argument; disproving it needs one verified counterexample.

## 10. Two equivalent readings of injectivity

`f : A → B` is injective when

```text
∀x₁,x₂ ∈ A. (x₁ ≠ x₂ → f(x₁) ≠ f(x₂)).
```

The contrapositive is `f(x₁)=f(x₂) → x₁=x₂`, often algebraically easier. Determinism says equal input implies equal output; injection says equal output implies equal input. Confusing these directions is a central error.

## 11. Proving a linear function is injective

For `f : ℕ → ℕ, f(n)=2n+7`, choose arbitrary `x₁,x₂` and assume `f(x₁)=f(x₂)`. Then `2x₁+7=2x₂+7`, hence `x₁=x₂`. This proves the equal-output implication.

Good style states arbitrary choices, the assumed antecedent, and the consequent. Logic plans the proof; readable prose communicates it. The other injectivity form works, but equality is usually more direct here.

## 12. Negating injectivity means finding a collision

For `f : ℤ → ℕ, f(x)=x⁴`, choose `1` and `-1`. The inputs differ while `f(1)=f(-1)=1`, so `f` is not injective.

This is a collision. A proof must verify both distinct inputs and equal outputs. Either fact alone omits part of the negated definition.

## 13. Surjectivity gives every codomain point a preimage

`f : A → B` is surjective when `∀b ∈ B. ∃a ∈ A. f(a)=b`. The reader first chooses target `b`; the writer then constructs `a` depending on it. Reversing quantifiers asks one fixed input to produce every target.

Surjectivity depends on codomain. `f(n)=2n` from naturals to naturals misses odds; with even naturals as codomain it may be onto. Every right-side diagram point needs an incoming arrow, but targets may share inputs, so surjection does not imply injection.

## 14. Witness strategies for surjection and non-surjection

For `f : ℝ → ℝ, f(x)=2x`, choose arbitrary target `y`, then `x=y/2`; this legal input satisfies `f(x)=y`. A construction, not visual confidence, proves coverage.

For `g : ℕ → ℕ, g(n)=2n`, negation is `∃b.∀a.g(a)≠b`. Choose `b=137`. Every `2a` is even while 137 is odd. The missed target and all-input argument mirror the existential-universal order.

## 15. Generate the proof procedure from the definition

For involution, choose an input and show two applications return it; refute with one that does not. For injection, derive input equality from output equality; refute with a collision. For surjection, choose a target and construct a preimage; refute with a target no input reaches.

Before writing, state `A → B`, copy the quantified definition, push negation to atoms, and let outer quantifiers determine choices. This turns “how do I start?” into reliable planning and connects logic directly to functions.

## 16. Common mistakes and self-practice

Common errors are omitting domain or codomain, confusing codomain with range, missing piecewise gaps or overlaps, mistaking determinism for injection, using a target-independent surjection witness, and generalizing from samples.

Compare reciprocal on `ℝ → ℝ` and `ℝ\{0} → ℝ\{0}`. Prove `x ↦ x+5` on integers injective and surjective. Find a collision for integer squaring and test surjectivity. Design a finite involution and verify it pointwise. Write quantifiers first; if prose choices differ, fix the mismatch.

## Material limits

The complete deck supports the function rules, definition methods, piecewise functions, involutions, injections, surjections, and five main proof examples. Slides omit spoken transitions and discussion. This article does not attribute editorial connective material to instructors or use restricted solutions.

## Update log

- 2026-08-22: Rebuilt the body, metadata, proof examples, and material boundary from the official Functions, Part I deck.

## References

- [Stanford CS103 Spring 2026 Lecture 6: Functions, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/06/)
- [Official Lecture 6 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/06/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
