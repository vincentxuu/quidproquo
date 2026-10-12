---
title: "Robust Verification: Checking Steps Before Trusting an Answer | Stanford CS329A Lecture 3"
date: 2026-10-11
category: ai
type: guide
tags: [cs329a, ai-agent, ai-course, evaluation, reasoning, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 3
description: "Robust Verification: Checking Steps Before Trusting an Answer through assigned reading, a worked example, and variations with answers."
tldr: "A correct final answer does not validate its derivation; step feedback locates errors, but verifiers still need checking."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification)

**Video status: Videos included.** This guide follows Lecture 3 of the [official Stanford CS329A Autumn 2025 schedule](https://cs329a.stanford.edu/), using the Stanford Online recording transcript and the assigned reading. The transcript was retrieved through a subtitle service; automatic versus manual provenance is unverified. This is not a complete transcript or a listening report.

If you need the course context first, start with the [series overview](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en).

## A correct answer can contain invalid reasoning

Reaching the expected number does not prove that every step is valid. If you want a reusable solution that also handles variations, you need to locate where errors begin. This lecture is for readers familiar with multiple-candidate generation who are designing verification rules. Training a reward model is not a prerequisite.

The assigned [Let's Verify Step by Step](https://arxiv.org/html/2305.20050v1) compares outcome and process supervision. This guide compares the transcript with its problem definition and methods and focuses on the feedback distinction, without reproducing training. The paper trains reward models to score candidates while keeping its generator fixed; it does not update that generator with reinforcement learning. Writing more reasoning and training a verifier on step labels are different operations.

## From one verifier to a combination

The transcript moves from outcome scoring in [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168) to step scoring. [Math-Shepherd](https://arxiv.org/abs/2312.08935) derives step labels from whether sampled continuations reach the correct answer. This estimates reachability rather than establishing logical validity of every step. On hard problems, a limited sample budget can miss a correct continuation and mislabel a useful step.

[Weaver](https://arxiv.org/abs/2506.18203) combines imperfect verifiers. Its considerations include filtering low-quality members, handling score scales, and estimating aggregation weights. Duplicating an identical model does not automatically provide independent evidence. The example below practices the step-level criterion so you know what a verifier needs to recognize.


## Two kinds of feedback

Outcome supervision labels the final result. Process supervision provides feedback on intermediate steps. Final answers can be easier to collect; step labels require a person or another credible mechanism to judge transitions.

Outcome feedback resembles knowing whether a journey reached its destination. Process feedback identifies the wrong turn. Two errors may cancel and still produce the right endpoint. More precise feedback helps diagnosis, but the verifier can still make mistakes.

## Worked example: cancelling errors

This is an original teaching example. Three boxes contain four pens each, and two pens are given away. The correct calculation is `3 × 4 - 2 = 10`.

Candidate A says: “There are `3 × 4 = 14` pens; after giving away two, `14 - 2 = 10` remain.” Its final answer is correct, but both arithmetic statements are false. Candidate B says: “There are `3 × 4 = 12` pens; `12 - 2 = 10` remain.” Both steps are valid.

A final-answer rule accepts both candidates. Step checking rejects A at its first multiplication. Define the next-step criterion carefully too: `14 - 2 = 10` is locally false. If A instead wrote `14 - 2 = 12`, that subtraction would be locally valid, but it would inherit the wrong upstream input. Local validity and validity of the complete derivation are separate questions.

An original manual checklist can record the facts used, whether the operation is valid, and whether it depends on an earlier error. This is a teaching diagnostic, not the paper's annotation protocol. It makes process verification tangible without requiring a trained scorer.

## Rules must handle counterexamples

A rule that rewards length, confident wording, or tidy formatting can be satisfied without fixing reasoning. Preserve an error location and explanation rather than only a score.

Step checking also does not reveal the model's actual internal thought process. It evaluates an observable written solution. That solution can be checked externally without claiming access to hidden computations.

Scope matters. Arithmetic can be recomputed; an open-ended design may lack a unique answer. Before verifying that a proposal is “better,” define comparable conditions such as latency, cost, or user requirements. Smaller steps do not resolve an undefined criterion.

## Variation and answer

Use five boxes, four pens per box, and give away three. A candidate writes `5 × 4 = 23`, then `23 - 3 = 17`. Is the final answer correct? Yes: the true calculation is `20 - 3 = 17`. Is the reasoning acceptable? No: both equalities are false, and the first error is the multiplication.

Another candidate says there are 20 pens, so 18 remain. The error is the final subtraction or missing subtraction step: giving away three leaves 17. Request a checkable intermediate calculation if none is provided; do not silently repair the candidate's derivation.

## A verification exercise for today

Prepare five worked solutions, including one with a correct answer and incorrect steps. Score only endpoints first, then recompute every step. Record which candidates each rule accepts. Success means locating the earliest invalid statement and separating final-answer correctness from derivation validity. Only then decide whether collecting step labels is worth the cost.

## Recording and English practice

```youtube
url: https://www.youtube.com/watch?v=p7TdPUcPoik
title: Stanford CS329A Lecture 3
captions: en
```

The official recording is linked here for continuous viewing. The retrieved transcript supports the conceptual guide, but three synchronized caption segments, audio checks, and player checks remain pending. Caption visibility in the player has not been verified. This page does not reproduce the full transcript or provide checked spoken quotations or timestamps. You can read the assigned paper and explain the example inputs and success criteria in your own English; that is an original expression exercise.

## References

- [Stanford CS329A Autumn 2025: official schedule](https://cs329a.stanford.edu/)
- [Let's Verify Step by Step](https://arxiv.org/html/2305.20050v1)
- [Stanford Online: CS329A Part 3](https://www.youtube.com/watch?v=p7TdPUcPoik)
- [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168)
- [Math-Shepherd](https://arxiv.org/abs/2312.08935)
- [Weaver](https://arxiv.org/abs/2506.18203)
