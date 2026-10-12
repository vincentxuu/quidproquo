---
title: "Code Generation and Agents: A Reliable Test–Repair Loop | CMU 10-423 Lecture 23"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 31
description: "Code Generation and Agents: A Reliable Test–Repair Loop | CMU 10-423 Lecture 23"
draft: false
---

> [繁體中文版](/posts/ai/2026-09-30-cmu10423-code-generation-agents)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 23 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

Plausible Python is not necessarily correct code. Passing one test is not completion of a repository repair. Lecture 23 extends code generation into LLM/VLM agents that act, observe tool results, revise, and decide when to stop.

Prerequisites are [sampling](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en) and [candidate verification](/posts/ai/2026-09-30-cmu10423-reasoning-models-en). Our task is a teaching example, not an official assignment solution.

## Execute the specification

String similarity cannot establish functional correctness: different programs may be equivalent, while one symbol can break a boundary case. HumanEval tests functions through execution, subject to test coverage and environment assumptions.

Define `clamp(x,lo,hi)` with lo≤hi. Values below lo return lo, above hi return hi, and others remain unchanged. A first candidate, `return min(x,hi)`, passes x=3 and x=8 for bounds0,5, but returns−2 for x=−2. Syntax is valid; the lower-bound requirement is missing.

Repair to `return max(lo,min(x,hi))`. Tests produce−2→0,3→3,8→5, with endpoints0→0 and 5→5. When lo=hi=2, every x returns2. Explicit expected values show which behavior was repaired.

## What pass@k estimates

Sample n programs for one task, of which c pass. Choosing k without replacement fails completely with probability `C(n−c,k)/C(n,k)`, giving estimator `pass@k=1−C(n−c,k)/C(n,k)` for n≥k. If fewer than k candidates fail, the numerator is zero.

For illustrative n=5,c=2: pass@1=.4, pass@2=`1−3/10=.7`, pass@3=`1−1/10=.9`. This estimates the chance that a candidate set contains a passing program. It does not show independent generation or 90% product completion.

Containing a correct candidate is not selecting it. Without a reliable test or selector, the agent may return a failing program. Larger k also costs generation and validation resources. Variation n=4,c=1,k=2 gives `1−3/6=.5`; simply manipulating pass@1 is not the combinatorial estimator.

## A stoppable tool loop

The teaching agent reads requirements and files, proposes a narrow change, runs tests, observes the lower-bound failure, repairs the function, and reruns relevant tests. Tool results are observations, not editable success claims. Exit0 with zero collected tests is not meaningful validation. Missing dependencies indicate an environment blocker rather than a function failure.

Stop when relevant tests pass with traceable evidence; investigate repeated identical failures without new information; report incomplete work when budget or required information is exhausted. Record changes, commands, results, and the final file. Endless retries are not autonomous completion.

SWE-bench involves repository issues, environments, and cross-file changes, so its task and scoring differ from single-function HumanEval. ReAct's thought/action/observation structure describes interaction; a narrative saying “tests passed” cannot replace execution evidence.

## Beyond functional correctness

Authority must match the task: editing a local function does not authorize email, deletion, or production changes. External documents and errors can carry prompt injection and cannot elevate tool permissions. VLM interface actions likewise require checking current state and actual outcomes.

Final variation: after repairing the lower bound, the agent adds automatic swapping for lo>hi. Is that required? No: the specification assumed ordered bounds, so the new behavior is a scope choice that must be explicit. Passing the stated tests does not prove correctness for NaN, all types, or every Python input. Code, candidate selection, tool workflow, and authority need separate validation.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 23 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf)
- [HumanEval / pass@k](https://arxiv.org/abs/2107.03374)
- [SWE-bench](https://arxiv.org/abs/2310.06770)
- [ReAct](https://arxiv.org/abs/2210.03629)
