---
title: "Three Systems at the Math Olympiad: Where Verification Comes From | Stanford CS329A Lecture 16"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 13
description: "Using the AlphaGeometry2 and AlphaProof papers and Google DeepMind's IMO 2025 announcement, compare what each of three systems relies on to verify an answer, and what was swapped out between the 2024 silver and the 2025 gold."
tldr: "AlphaGeometry2 relies on a symbolic engine and AlphaProof on Lean, for a combined 28 points in 2024; in 2025 Gemini Deep Think scored 35 points in natural language, with verification done by human graders."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-cs329a-session-16-superhuman-math-reasoning)

The International Mathematical Olympiad (IMO) sets six problems a year, each worth 7 points, for a maximum of 42. It attracts AI research because whether a proof is correct has a clear standard. Session 16 of [CS329A](https://cs329a.stanford.edu/) Autumn 2025 was a guest lecture by Thang Luong of Google DeepMind, titled "Towards AI Superhuman Reasoning: AlphaProof, AlphaGeometry & Gemini IMO Gold Medal." After reading this guide you should be able to say who or what decides correctness in each of the three systems, and see which part changed between 2024 and 2025. Prerequisite: a rough idea of search trees and reinforcement learning. You do not need to know Lean.

Read [Lecture 3 on verification](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification-en) first. That lecture asks what to do when the verifier is unreliable; the first two systems here show how far you can go when the verifier is nearly perfect.

**Video status: No recording or slides are public for this session.** On 2026-10-13 I checked the Stanford Online playlist, the official schedule and its edit history, both instructors' channels, and the speaker's personal site; none has material for this session. This guide uses the public documents of the three systems named in the title instead: the AlphaGeometry2 paper (the speaker is a co-author), the AlphaProof paper in Nature, and the official IMO 2025 announcement co-signed by the speaker. It does not represent what was said in the session.

## AlphaGeometry2: a language model proposes, a symbolic engine proves

The hard part of a geometry problem is often adding an auxiliary line or point yourself. [AlphaGeometry2](https://arxiv.org/abs/2502.03544) splits the work in two. A language model proposes auxiliary constructions. A symbolic engine, DDAR, follows a fixed set of deduction rules and keeps deriving new facts from known ones until no more can be derived. If the goal shows up among the derived facts, the problem is proved.

The symbolic engine decides correctness. However odd the proposed auxiliary point, the proof holds if the engine reaches the goal; if it does not, the proposal is discarded. The training data comes from the same engine: start from random diagrams, deduce all facts, and trace back to extract problems and proofs, with no human problems as seeds.

The paper reports several figures. After the domain language was extended, the share of IMO 2000–2024 geometry problems it can express rose from 66% to 88%; the overall solve rate rose from 54% in the previous version to 84%. There is also a number for how much search matters: with greedy decoding and no tree search, the models solve only 2 of the 26 problems that require auxiliary constructions.

## AlphaProof: reinforcement learning inside Lean

[AlphaProof](https://www.nature.com/articles/s41586-025-09833-y) handles the non-geometry problems. It writes each problem in [Lean](https://lean-lang.org/), a formal language in which every proof step is checked by the system. That gives reinforcement learning a reward that cannot be fooled: a proof that passes has passed.

Training has two layers. The main RL phase follows the AlphaZero approach and learns general proof strategies from roughly 80 million auto-formalized problems. For especially hard problems, it runs a further round of test-time RL at inference: it generates many variants of the target problem, such as simplifications and generalizations, and keeps training on them so the model adapts to that one problem.

The IMO 2024 result has to be read with its conditions. Of the six problems, the geometry problem P4 went to AlphaGeometry2; the other five were formalized in Lean by hand by experts. AlphaProof solved P1, P2, and P6, each taking two to three days of test-time RL; the two combinatorics problems, P3 and P5, were not solved. The total was four problems and 28 points, within the silver-medal range and one point below the gold threshold. The paper notes that P6 was solved by only five human contestants that year.

## Gemini Deep Think: natural language, four and a half hours

The [official IMO 2025 announcement](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/) describes a different approach. An advanced version of Gemini Deep Think read the official problem statements directly and wrote proofs in natural language, all within the 4.5-hour competition limit, with no one translating problems into a formal language. It solved five of the six problems for 35 points, reaching the gold-medal standard.

The announcement lists three technical points. Deep Think uses parallel thinking, exploring and combining several candidate solutions at once instead of following a single chain of thought. The model was additionally trained with new reinforcement learning techniques that use more multi-step reasoning, problem-solving, and theorem-proving data. The system was also given a curated corpus of high-quality solutions, and its instructions included general hints on approaching IMO problems.

The source of verification changed. There is no Lean and no symbolic engine; the answers were graded by IMO coordinators using the same criteria as for students. A note in the announcement states that the IMO confirmed the submitted answers are complete and correct, and that this review does not extend to validating the system, the processes, or the underlying model.

## A worked example: how AlphaGeometry2 proves a point lies on a circle

This example comes from the AlphaGeometry2 paper's explanation of "double points."

Conditions: lines a and b meet at point X, and the goal is to prove that X lies on circle ω. The paper says a direct proof is hard and that a reformulation can be much easier, because angle relations on the circle become usable.

The reasoning takes four steps. First, the language model proposes an auxiliary point X′, defined as the intersection of line a and circle ω; at this stage nothing says X′ and X are the same point. Second, the symbolic engine proves that X′ also lies on line b. X′ is on the circle by definition, so this step can use angle relations on the circle. The paper prints this step as "prove that X lies on b," but X lies on b by definition; read in context this is a typo for X′, and this guide writes X′. Third, X and X′ both lie on a and on b, and two lines meet in only one point, so X and X′ are the same point. Fourth, X′ is on ω, therefore X is on ω.

Result: the original statement is proved.

What it means: the division of labor is clear. The idea of adding X′ comes from the language model, and no rule guarantees it will be useful. Every inference in steps two through four is checked by the engine against its rules. If the language model proposes a useless point, the engine fails to reach the goal and that attempt is discarded; no incorrect proof results.

## The three systems in one table

The table below is this guide's summary of the three documents.

| | AlphaGeometry2 | AlphaProof | Gemini Deep Think |
|---|---|---|---|
| Problem form | Geometry-specific language | Lean | Natural language |
| Who decides correctness | Symbolic engine | Lean checker | Human graders |
| What happens at inference | Several search trees sharing facts | Tree search plus test-time RL | Parallel thinking |
| Public IMO result | 2024, P4 | 2024, P1, P2, P6 | 2025, five problems |

You can check the scores yourself. In 2024, four problems at 7 points each give 4×7=28; in 2025, five problems give 5×7=35; the maximum is 6×7=42. One more problem was solved between the two years, but the bigger difference is in the conditions: 2024 needed manual translation and days of compute; 2025 read the problems directly and finished within the competition limit.

What the table means: the gain in capability and the change in verification happened together. Every step of the first two systems is machine-checked, so search and RL can be scaled up safely. The third system removes the machine check and gains generality without formalization; the cost is that correctness rests on trained reliability and on human grading afterward. The announcement also says work on the formal systems continues, and expects agents that combine natural language with formal verification.

## Variation check, with answers

You want a model to prove an inequality. You have no one to formalize it in Lean, but you need high confidence that the answer is right. Which route? **Answer: generate the proof in natural language first, then hand the key steps to an independent check.** The pure natural-language route is fast but has no machine guarantee; full formalization is the most reliable but costs more than you have. A workable compromise is to run numerical checks on the steps that can be tested numerically and have a second model or a person review the rest step by step. This answer is this guide's inference, not a conclusion from the three documents.

A common misreading takes "gold medal" to mean mathematical reasoning is solved. All three documents state clear boundaries: two combinatorics problems went unsolved in 2024, one problem went unsolved in 2025, and the IMO's confirmation covers the answers only. Something to do tonight: pick a derivation task you want to hand to a model and write down who or what can decide it is right, whether a program, a formal system, or a person, before deciding how freely to let it search.

## English reading and expression

Sentences written for this guide: *In AlphaProof, Lean checks every step, so the reward cannot be gamed.* *The 2025 system worked in natural language and was graded by human coordinators.* Practice comparing the 2024 and 2025 verification methods in two sentences. This is reading and expression practice, with no original audio to shadow.

## References

- [CS329A Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [Gold-medalist Performance in Solving Olympiad Geometry with AlphaGeometry2](https://arxiv.org/abs/2502.03544)
- [Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof, Nature 2025)](https://www.nature.com/articles/s41586-025-09833-y)
- [Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the International Mathematical Olympiad (Google DeepMind, 2025-07-21)](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/)
- [Lean official site](https://lean-lang.org/)
