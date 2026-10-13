---
title: "Long-Horizon Evaluation: Completion, Correctness, and Deliverability | Stanford CS329A Lecture 17"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 14
description: "Build acceptance criteria for long-running agents using human task duration, professional artifacts, and research verifiability."
tldr: "Human task duration, artifact quality, and citation support measure different things; evaluate both execution and deliverables."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation)

**Video status: Videos included.** Lecture text is available; caption type, listening checks, and the shadowing player still require verification.

An agent runs for two hours and produces a polished report. Has it completed the work? [Stanford CS329A](https://cs329a.stanford.edu/), Autumn 2025 Lecture 17, evaluates complete tasks: sustained execution, usable artifacts, and verifiable evidence.

This guide uses the official readings, [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/html/2503.14499), [GDPval](https://arxiv.org/html/2510.04374), and [DeepScholar-Bench](https://arxiv.org/html/2508.20033), alongside the lecture's text transcript. It is for readers building tool-using agents who need concrete acceptance criteria.

For prerequisite context, first read [search and deep research](/posts/ai/2026-10-11-stanford-cs329a-lecture-08-search-deep-research-en).

## Whose time does the horizon measure?

The first paper, from [METR](https://metr.org/), uses human completion time as a task-difficulty scale and estimates model performance at a specified success rate. A 50% time horizon is the human task duration corresponding to a predicted one-half success probability. It is not the maximum time the agent can remain running or a guaranteed duration of autonomous work.

Human duration enables comparisons, but tool familiarity and task details also affect difficulty. A deployed service may require substantially higher reliability, so a 50% horizon alone cannot establish service quality.

## Why long workflows fail

Here is an original simplified example. A workflow has ten necessary steps, each independently successful with probability 0.95, without retries. Complete success is 0.95 raised to the tenth power, approximately 0.599. Averaging ten 95% rates does not give the probability that every step succeeds.

Allow one independent retry per step. Both attempts fail with probability 0.05 × 0.05 = 0.0025, giving per-step success 0.9975. Complete success becomes approximately 0.975. This illustrates recovery's value, not an empirical agent reliability estimate. Missing data and incorrect specifications usually do not disappear through identical independent retries.

## Professional artifacts and research need different measures

GDPval uses professional tasks and artifacts, primarily comparing model outputs against human baselines through expert judgments. It asks whether a document, spreadsheet, or design is usable. Artifact comparisons do not establish that an entire occupation can be replaced; jobs also involve interaction, changing requirements, and responsibility.

DeepScholar-Bench separates knowledge synthesis, retrieval quality, and verifiability. A well-formatted citation can name a nonexistent paper, or a real paper that does not support the claim. Separate finding a source from producing a supported argument to diagnose retrieval and synthesis failures.

## Worked example: accepting a supplier comparison

This is an original task. Inputs are three supplier documents. The deliverable is a comparison table and recommendation covering four necessary facts: A's monthly price, B's delivery time, C's support period, and whether tax is included. Preserve sources and mark unknown information explicitly.

One report covers the first three facts but invents tax inclusion. Only four of its six major claims are supported by cited material. Simple coverage is 3/4=75%; claim support is 4/6, approximately 67%. These are teaching criteria, not the papers' formal scores. Perfect formatting does not satisfy an acceptance rule requiring evidence for every decision-critical claim.

Do not simply choose a judge that prefers the report. Check whether the inputs contain tax information. If absent, change the claim to unknown. If present, inspect whether document reading omitted it. Evaluation should point to a concrete repair.

## Exercises and answers

With twenty independent steps at 0.95 success each and no retries, complete success is approximately 0.358. Failures accumulate. If errors are correlated, the independence model is unsuitable; estimate performance through repeated actual runs.

If all four required facts appear and all six citations refer to real sources, does the report pass? Not necessarily. Check that citations support claims, dates and units match, and the recommendation addresses the original request. Source existence is not claim support.

## Write an acceptance card today

Choose a real agent task. Record inputs, deliverable files, required information, unacceptable errors, and the desired success rate. Preserve tool logs and artifacts across repeated runs. Distinguish reading failures, reasoning errors, and missing deliverables, then choose repairs from those categories rather than report only a mean score.

## English practice: audio shadowing pending

The official video's text transcript is available for content comparison. Caption type, timestamps, listening checks, and three replayable segments remain unverified. Shadowing is pending. The calculations and supplier task are original examples, not lecturer experiment results.

## Lecture video source

[Stanford Online — Part 8](https://www.youtube.com/watch?v=8JAqLnTaZu4)

```youtube
url: https://www.youtube.com/watch?v=8JAqLnTaZu4
title: Stanford CS329A — Lecture 17
captions: en
```

## References

- [Stanford CS329A — Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/html/2503.14499)
- [GDPval](https://arxiv.org/html/2510.04374)
- [DeepScholar-Bench](https://arxiv.org/html/2508.20033)
- [Stanford Online — official lecture video](https://www.youtube.com/watch?v=8JAqLnTaZu4)
