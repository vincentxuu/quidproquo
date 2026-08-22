---
title: "Stanford CS103 Lecture 11: Generalized Pigeonhole, Ramsey Theory, and Average Load"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, graph-theory, pigeonhole-principle, ramsey-theory]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 13
tldr: "Use the generalized pigeonhole principle to force a monochromatic triangle at a six-person party, then solve a movie-preference puzzle through average load and contradiction."
description: "A deck-faithful guide to Stanford CS103 Graph Theory Part Three: generalized pigeonhole, Ramsey theory, Sim, and average-load proofs."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-12-graphs-3)

This is article 13 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **Spring 2026 Lecture 11 (April 24, 2026)**, officially titled **Graph Theory, Part Three**. Rather than introducing another catalog of graph definitions, the lecture turns a tiny counting fact into a proof engine: force local structure with the generalized pigeonhole principle, then drive it to the target with a case split or contradiction.

The course team is Cynthia Bailey Lee and Alex Aiken. The public page does not identify a per-meeting speaker, so this article does not guess one. The reconstruction below follows the complete public deck; spoken material restricted to Canvas or Panopto is outside its scope.

## Connecting adjacency and reachability to this lecture

The previous lecture defined adjacent nodes as nodes joined by an edge and reachable nodes as nodes connected by a path. Those notions remain the substrate, but the proof question changes: when edges, colors, or preferences are assigned among finitely many categories, what structure becomes unavoidable?

The hard part is usually modeling rather than arithmetic. A valid application must identify the objects, bins, assignment rule, and the translation from a forced load back to the original question. Without those pieces, “by pigeonhole” is a slogan, not a proof.

## The ordinary pigeonhole principle forces a collision

If `m` objects are distributed into `n` bins and `m > n`, at least one bin contains two or more objects. The principle requires neither an even distribution nor knowledge of which bin collides; it gives an existential guarantee.

A useful application template is objects, bins, assignment, forced conclusion. Thirteen people assigned to twelve birth-month bins force two people into one month. If the property changes to exact birthdays, the bins change, and so does the available conclusion.

## The generalized version controls crowded and sparse bins

If `m` objects are distributed among `n > 0` bins, some bin contains at least `⌈m/n⌉` objects and some bin contains at most `⌊m/n⌋`. With eleven objects and five bins, one load is at least three and one is at most two.

This does not say every load lies between two and three; `7,1,1,1,1` satisfies both guarantees. If every load `xᵢ` were below `m/n`, then `m=x₁+⋯+xₙ<n(m/n)=m`, an impossibility. Integrality converts the real average into a ceiling. The sparse-bin statement follows from the symmetric sum argument and a floor.

## Turning a six-person party into a coloring of K₆

At a party of six, every pair are either friends or strangers. Represent people by nodes, color a pair blue when they are friends and red when they are strangers. Since every pair has a relation, the underlying graph is the complete graph `K₆`. Three mutual friends form a blue `K₃`; three mutual strangers form a red `K₃`.

The claim is therefore equivalent to saying that every red-blue edge-coloring of `K₆` contains a monochromatic triangle. Pigeonhole is not applied directly to the six people. It is applied to the five edges incident to a fixed node; that is where `⌈5/2⌉=3` appears.

## Forcing three same-colored edges at one node

Choose any node `x`. It has five incident edges and only two possible color bins. The generalized pigeonhole principle forces at least three edges of one color.

This is only a monochromatic star, not yet a triangle. Let three same-colored edges lead to `r,s,t`. The proof must now inspect the three outer edges `{r,s}`, `{r,t}`, and `{s,t}`. Whether any outer edge repeats the center color determines the final case split.

## “Without loss of generality” requires symmetry

The deck assumes the three edges are blue without loss of generality. This does not mean discarding an inconvenient case. Red and blue play perfectly symmetric roles in both hypothesis and conclusion; if the forced edges are red, swapping the color names reproduces the same argument.

Every WLOG step needs such a symmetry operation. If two cases have different assumptions or goals, one cannot simply be omitted. Here exchanging red and blue preserves `K₆`, the definition of a monochromatic triangle, and the desired disjunction.

## The complete case split for a monochromatic triangle

Choose `x`. Among its five incident edges, at least three share a color. WLOG let `xr,xs,xt` be blue. If any of `{r,s}`, `{r,t}`, or `{s,t}` is blue, that edge and the two blue edges back to `x` form a blue `K₃`. Otherwise none is blue. Since every edge is red or blue, all three are red, so `r,s,t` form a red `K₃`.

Both cases construct the required witness. The proof first uses pigeonhole to force local homogeneity, then excluded middle to separate “at least one matching outer edge” from “all outer edges have the other color.” Declaring a triangle immediately after finding three incident edges would confuse a star with a triangle.

## Ramsey theory: large systems cannot avoid all structure

The result is a special case of Ramsey theory. For each natural number `s`, there is a number `R(s)` such that below it some red-blue coloring of `Kₙ` avoids every monochromatic `Kₛ`, while at or above it every coloring contains one.

This lecture proves that six nodes suffice to force a monochromatic triangle, establishing the upper-bound direction `R(3)≤6`. Exact equality also needs a coloring of `K₅` with no monochromatic triangle. The general Ramsey theorem is introduced, not proved in full. The deck's philosophical reading—that sufficiently large disorder must contain organized substructure—is intuition, not a replacement for the quantified theorem.

## The game of Sim turns the theorem into a no-draw guarantee

Sim begins with six disconnected points. One player draws red edges, the other blue edges, and the first player to complete a triangle in their own color loses. If all edges were eventually drawn, the board would be a red-blue coloring of `K₆`; the theorem says it must contain a monochromatic triangle. The game therefore cannot reach a completely filled board with no loser.

This proves there is no draw. It does not itself produce an optimal strategy or identify which player can force a win. An existence guarantee about terminal structure and a strategy respecting move order are different results.

## Above-average and below-average loads occur together

The deck next gives another pigeonhole-type result: among `m` objects in `n` bins, a load greater than `m/n` exists if and only if a load less than `m/n` exists. The total load is fixed at `m`; if one bin exceeds the average and none falls below it, the sum would exceed `m`. The reverse direction is symmetric.

A particularly useful lemma follows: if no bin is above `m/n`, no bin is below `m/n`, so every bin equals the average. This upgrades a one-sided upper bound into exact equality and powers the movie puzzle.

## Proving the average-load lemma by contradiction

Let bin `i` have load `xᵢ`. Assume no bin exceeds `m/n`, yet some bin is below it. WLOG rename that bin as bin one, so `x₁<m/n`, while every remaining `xᵢ≤m/n`. Then

`m=x₁+x₂+⋯+xₙ<m/n+x₂+⋯+xₙ≤m/n+⋯+m/n=m`.

This yields `m<m`, a contradiction. Renaming is legitimate because bin indices carry no extra structure. The first strict inequality comes from the one below-average bin; the remaining bounds are non-strict. Replacing every sign with `≤` would end at the harmless statement `m≤m` and would not prove the lemma.

## Modeling the movie puzzle with balls and bins

There are `n>0` people. Ninety percent enjoyed *CODA*, eighty percent *Nomadland*, seventy percent *Parasite*, and sixty percent *Knives Out*. Nobody enjoyed all four. The question asks how many enjoyed at least one of *CODA* and *Parasite*.

Make each person a bin and each person-movie enjoyment event a ball placed into that person's bin. The total number of balls is `0.9n+0.8n+0.7n+0.6n=3n`. There are `n` bins, so average load is three. Nobody liked all four, so no bin exceeds three. By the average-load lemma no bin is below three either; every person enjoyed exactly three movies.

Making the four movies the bins would merely restate their audience counts and would not constrain each person's total. Because the target is a claim about every person, people must be the bins and preference events the balls.

## Exact load three makes the answer everyone

Anyone who enjoyed exactly three of four movies can omit at most one. If someone enjoyed neither *CODA* nor *Parasite*, they could enjoy at most the other two, giving load at most two, contradicting exact load three.

Thus every person enjoyed at least one of the two films, so the answer is all `n` people, or `|C∪P|=n`. The question is not asking for the intersection, and simply adding ninety and seventy percent does not prove the result. The percentage sum establishes total ball count; the no-four condition and average-load lemma turn that global count into a per-person conclusion.

## Common mistakes and repairs

Average three alone does not make every load three; `4,3,2` is a counterexample. The no-load-above-three condition is essential. In the party proof, the five incident edges—not the six nodes—are partitioned by color. Three same-colored incident edges form a star, so the outer edges still need examination.

WLOG must be backed by a color swap or relabeling. `R(3)≤6` is not yet an exact value, and Sim's no-draw theorem is not a winning strategy. Each repair comes from restoring the quantifiers: what is guaranteed for every arrangement, and what witness is merely asserted to exist?

## Executable self-check

1. Distribute seventeen objects among six bins; compute the forced maximum and minimum thresholds and build distributions attaining them.
2. Rewrite the `K₆` proof and label its objects, bins, WLOG symmetry, and final two cases.
3. State the missing lower-bound construction needed for `R(3)=6`.
4. Reprove the average-load lemma and identify the source of strict inequality.
5. Remove the no-one-liked-all-four condition and construct average load three with someone of load two.

These tasks test whether pigeonhole has become a modeling and proof tool rather than a memorized slogan.

## Further directions and course boundaries

The slides list Sperner's lemma, the mountain-climbing theorem, Brouwer's fixed-point theorem, Mirsky's theorem, and the fact that every positive integer has a nonzero multiple written only with zeros and ones. They are a sampler of pigeonhole-style reach, not results proved individually in this lecture.

The deck also points toward Math 107, Math 108, CS161, and CS224W. The next lecture begins mathematical induction, moving from forced collisions in finite distributions to the propagation of claims across discrete steps.

## Material gaps and reading boundary

The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/Lecture%20Slides.pdf) are public and support the agenda, full proofs, Sim, and movie puzzle. Recordings and transcripts are restricted to Canvas/Panopto, so this article does not infer poll results, spoken remarks, or student questions. The general Ramsey theorem and further results remain at the introductory depth of the deck.

## Update log

- 2026-08-22: Rebuilt the bilingual article from the complete official deck, covering generalized pigeonhole, friends and strangers, Ramsey theory, Sim, and the movie-preference puzzle.

## References

- [Stanford CS103 Spring 2026 Lecture 11: Graphs, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/)
- [Official Lecture 11 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs on Discrete Structures](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs_on_discrete_structures)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
