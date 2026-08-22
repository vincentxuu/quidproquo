---
title: "Stanford CS103 Lecture 8: Cardinality by Bijections and Cantor's Diagonal Argument"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 10
tldr: "Two sets have equal cardinality when a bijection pairs their elements; Cantor's diagonal set defeats every function from S to its power set by constructing a value it misses."
description: "A deck-aligned guide to Stanford CS103 Spring 2026 Lecture 8 on bijections, equal cardinality, equinumerous intervals, and Cantor's theorem."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-09-cardinality)

This is article 10 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 8, Spring 2026 (2026-04-17)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official title is **Set Theory Revisited**, but the deck has a sharper through-line. It combines injections and surjections into bijections, uses bijections to define equal cardinality, and gives the formal proof of Cantor's theorem previewed on the first day. The purpose is not to force finite counting onto infinite sets. It is to state exactly what evidence makes two collections “the same size.”

## Today's route: from bijections to Cantor's theorem

The deck names three stages: bijections, the formal definition of cardinality, and Cantor's theorem. They form one dependency chain. A bijection supplies perfect pairing; pairing defines equinumerosity without an integer count; that definition translates Cantor's theorem into nonexistence of a certain bijection.

Quantifiers set the difficulty. To prove `|S|=|T|`, one bijection suffices. To prove `|S|≠|T|`, every bijection must be ruled out. One bad matching therefore cannot establish unequal size. The slides also announce a first midterm covering Problem Sets 1 and 2 with proof questions. The practical lesson is to know the well-definedness, injectivity, and surjectivity templates, not just final statements.

## Bijections: injective and surjective at once

If `f:A→B` is injective, each codomain element has at most one domain element mapped to it. If it is surjective, each codomain element has at least one. A bijection has both properties, so every `B` element corresponds to exactly one `A` element.

Formally, a bijection is a function that is both injective and surjective. Its picture has neither collisions nor omissions, but a proof must still discharge both quantified obligations. Failure of one function is also different from nonexistence of every bijection: the former rejects one candidate, while only the latter establishes unequal cardinality.

## The new definition of equal cardinality

For finite sets, `|S|` is the number of elements. Two finite sets may both count to the integer `2`, after which ordinary integer equality applies. Infinite sets cannot first be reduced to finite integers, and treating “infinity” as one ordinary value would erase distinctions.

CS103 defines

```text
|S| = |T|  iff  there exists a bijection f : S → T.
```

Equal size is now structural: can the elements be paired with no repetition and no omission? The definition works for finite and infinite sets. Its existential quantifier matters. A noninjective or nonsurjective diagram does not prove inequality because another function may work; equality needs only one candidate followed by a full bijection proof.

## Equinumerous intervals: `[0,1]` and `[0,2]`

The closed interval `[a,b]` is `{x∈ℝ | a≤x≤b}`; `(a,b)` excludes endpoints. The slides compare `[0,1]` and `[0,2]`. The second has twice the length, yet the sets can have equal cardinality. Consider

```text
f : [0,1] → [0,2]
f(x) = 2x.
```

The function stretches endpoints and intermediate reals proportionally. Its graph suggests the answer, but the proof has three obligations: outputs stay in the codomain, no collision occurs, and no codomain value is missed. This separates geometric measure from cardinality. Length measures occupied real line; cardinality measures perfect pairing. Different answers are not contradictory.

## First obligation: the function is well-defined

Choose arbitrary `x∈[0,1]`. From `0≤x≤1`, obtain `0≤2x≤2`, hence `f(x)=2x∈[0,2]`. The rule truly defines a function with the stated domain and codomain.

The deck notes a convention: function proofs explicitly check domain/codomain restrictions, while determinism may be immediate from an explicit formula. This does not make uniqueness optional; the uniqueness of `2x` is simply undisputed. If a legal input lands outside `B`, then `f:A→B` has not yet been established, regardless of later algebra.

## Second obligation: ASSUME and WTS for injectivity

Choose arbitrary `x₁,x₂∈[0,1]`, assume `f(x₁)=f(x₂)`, and show `x₁=x₂`. Substitution gives `2x₁=2x₂`; division by two proves the target.

The ASSUME line is equality of outputs, not an assumption that the function is injective. The WTS line is equality of inputs. Assuming `x₁=x₂` instead proves only the easy direction shared by every function. The symbolic definition `∀x₁∀x₂(f(x₁)=f(x₂)→x₁=x₂)` mechanically recovers the correct proof skeleton.

## Third obligation: surjectivity needs a reverse-engineered witness

Choose arbitrary `y∈[0,2]`. We need `x∈[0,1]` with `f(x)=y`. Solving `2x=y` suggests `x=y/2`. From `0≤y≤2`, infer `0≤y/2≤1`, so the witness is legal; then `f(x)=2(y/2)=y`.

With all three obligations complete, `f` is a bijection and `|[0,1]|=|[0,2]|`. A reusable method is to solve the output equation for a preimage and then verify the candidate lies in the domain. Merely saying every output “clearly” has a preimage omits both obligations.

## Cardinal equality must be proved to behave like equality

Because `|A|=|B|` was newly defined through bijections, familiar equality laws cannot simply be borrowed. Reflexivity follows from the identity `f(x)=x:A→A`. It is well-defined because `x∈A`; injective because equal images give equal inputs; and surjective because for any `y` one chooses `x=y`.

For transitivity, if `|A|=|B|` and `|B|=|C|`, there are bijections `f:A→B` and `g:B→C`. Their composition `g∘f:A→C` is bijective, so `|A|=|C|`. Once proved, these may be taken as given. Before then, behavior of equality on integers does not automatically transfer to a new definition of cardinal equality.

## Cantor's theorem must rule out every bijection

The first lecture previewed that `℘(S)` is larger than `S`. This lecture formally proves

```text
If S is a set, then |S| ≠ |℘(S)|.
```

This means no bijection `S→℘(S)` exists. The map `f(x)={x}` is injective but misses the empty set and nonsingleton subsets. Yet that does not prove the theorem: it defeats one `f` only. Negating existence requires choosing arbitrary `f:S→℘(S)` and proving it fails regardless of its form.

## Proof roadmap: attack surjectivity of an arbitrary function

The slides compare three plans. Defeating a specially designed function is too weak. Showing every arbitrary function is noninjective cannot work because `x↦{x}` is injective. The viable route chooses arbitrary `f:S→℘(S)` and shows it is not surjective.

Choose arbitrary `S`, then arbitrary `f`; construct a member of `℘(S)` outside the range; infer that `f` is nonsurjective and nonbijective; finally use arbitrariness to eliminate all bijections. The challenge is finding a missed output without knowing `f`. Cantor reads each `f(x)` and flips membership along the diagonal.

## Constructing the diagonal set `D`

For arbitrary `f:S→℘(S)`, define

```text
D = { x ∈ S | x ∉ f(x) }.
```

The set contains exactly those elements absent from their own image sets. Since it selects only elements of `S`, `D⊆S`, hence `D∈℘(S)`: it is a legal codomain target that a surjection must hit.

For every `x`, membership of `x` in `D` is opposite membership in `f(x)`. If `x∈f(x)`, then `x∉D`; if `x∉f(x)`, then `x∈D`. Thus `D` differs from each `f(x)` at least at `x`. A different `f` may produce a different `D`; the strength is that each function manufactures its own missed value.

## Why `D` cannot equal any `f(y)`

Suppose some `y∈S` has `f(y)=D`. Definition gives

```text
y ∈ D  iff  y ∉ f(y).
```

Substitution yields `y∈D iff y∉D`, which is impossible. Therefore no `y` maps to `D`. The codomain contains `D` but it has no preimage, so `f` is not surjective. Since `f` was arbitrary, every `S→℘(S)` function fails; there is no bijection, and `|S|≠|℘(S)|`.

The inner contradiction proves that `D` is outside the range. The outer arbitrary choice quantifies over all functions. Collapsing them into “obviously D is missing” would hide both the contradiction and its quantifier scope.

## Three levels that are easy to confuse

First, `x∈S`, whereas `f(x)∈℘(S)` means `f(x)⊆S`. The expression `x∈f(x)` is legal because `f(x)` is itself a subset, not an object of the same type as `x`. Second, `D` depends on `f`; it is not one fixed subset missed by all functions. Third, the long formal proof establishes `|S|≠|℘(S)|`. The stronger “smaller than” wording also needs an injection, and `x↦{x}` supplies that side.

Another frequent mistake is inferring unequal cardinality from one nonbijection. To negate an existential, take an arbitrary candidate and provide a uniform reason it fails. Diagonalization is not merely a diagonal line in a picture; it flips “does the xth output contain x?” to guarantee a new object differs from the xth output.

The argument can also be pictured as a membership table. Each row is a domain element `x`, and that row records the members of `f(x)`. The set `D` reads the xth diagonal entry and flips its truth value. Because the diagonal entry differs, `D` cannot equal the xth row. The table is intuition only; the set-builder definition, not an assumed finite table, makes the proof general.

Nothing assumes that `S` is finite, countable, or naturally ordered. The same `x` is used as a chosen domain element and as the element whose membership is inspected; it does not mean all elements were numbered. For `S=∅`, the sole function into `℘(∅)={∅}` has empty range, while the definition produces `D=∅`, precisely the missed value. The edge case needs no special repair.

## An executable self-check

1. Design a linear bijection `f:[2,5]→[0,1]` and prove all three obligations.
2. Explain why one failed `S→T` function cannot prove `|S|≠|T|`.
3. For `S={a,b}`, list any `f:S→℘(S)`, compute `D`, and compare it with every image.
4. Mark the arbitrary choice, contradiction, and non-surjective-to-non-bijective steps in Cantor's proof.
5. Explain why unequal interval lengths and equal cardinalities do not conflict.

If task three is only visual, rewrite it as `x∈D iff x∉f(x)`. If task one omits proof that the reverse-engineered witness lies in the domain, its surjectivity proof is incomplete. Quantifiers, assumptions, targets, and witnesses are more reliable than memorized prose.

A useful reverse diagnostic is to begin `|A|=|B|` with “I need to provide a bijection,” and `|A|≠|B|` with “I need to eliminate all bijections.” Only then choose construction, reverse-engineered witness, or a uniform defect for an arbitrary candidate. This prevents algebra from starting before the quantifier obligation is understood.

## Material limits and next lecture

The public deck contains the bijection definition, full interval proof, reflexivity and transitivity of cardinal equality, and Cantor roadmap, diagonal set, and formal proof. It supports the full chain here. Slides are not a recording and do not preserve spoken transitions, poll results, student questions, or improvised examples; none are reconstructed as instructor statements.

The next lecture turns to graphs, building higher-level properties from vertices and edges. The methodological continuity is clear: this lecture builds “same size” from sets and functions; the next builds connectivity and other structures from graph primitives.

## Update log

- 2026-08-22: Rebuilt the article from the complete official deck, covering bijections, equinumerous intervals, cardinal equality, and Cantor's diagonal argument; synchronized the Chinese article and research checklist.

## References

- [Stanford CS103 Spring 2026 Lecture 8: Set Theory Revisited](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/)
- [Official Lecture 8 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/08/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
