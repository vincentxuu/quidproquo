---
title: "Don't Let the Score Fool You: Write the Full Evaluation as a 4-Tuple | Stanford CS329Z Lecture 13"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 14
tldr: "Per the schedule, Lecture 13 covers why evals are hard, the request / environment / stopping criteria / scorer 4-tuple, properties of good benchmarks, realistic scaffolding and reliability. The readings are the agentic benchmark best-practice checklist, Press's benchmark guide and tinyBenchmarks."
description: "A preview of Stanford CS329Z Lecture 13, Evaluation Fundamentals & Benchmark Design: the 4-tuple framework for an evaluation specification, plus digests of the agentic benchmark checklist, Press's benchmark guide and tinyBenchmarks."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 13 (Nov 4, Evaluation Fundamentals & Benchmark Design) splits an evaluation into a 4-tuple. The request is what you ask for; the environment is the world the agent can act in; stopping criteria decide when it is done; the scorer decides how well it did. Drop any one and the score does not hold. The midpoint demo video is due at 11:59 p.m. the same day (it is not presented in class), and the midway report is due Friday.

Take fixing a bug. The request is "fix this issue", the environment is the codebase plus a terminal, the stopping criterion is submitting a patch, and the scorer runs the tests. The assigned reading, Zhu et al.'s [agentic benchmark best practices](https://arxiv.org/abs/2507.02825), shows how easily scorers go wrong; the additional readings, Press's benchmark guide and tinyBenchmarks, cover writing the 4-tuple clearly and how few items are enough. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

```diagram
title: Four fields define an evaluation
desc: Request, environment, stopping criteria and scorer jointly specify a bug-fix evaluation.
caption: The grouped fields define one specification, not execution order; stopping and success are separate.
---
<svg viewBox="0 0 440 456"><rect class="dg-zone dg-zone--solid" x="8" y="8" width="424" height="440" rx="6"/><text class="dg-heading" x="220" y="40" text-anchor="middle" dominant-baseline="central">One evaluation specification</text><rect class="dg-box" x="32" y="72" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="96" text-anchor="middle" dominant-baseline="central">Request</text><text class="dg-sub" x="220" y="124" text-anchor="middle" dominant-baseline="central">Fix this issue</text><rect class="dg-box" x="32" y="164" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="188" text-anchor="middle" dominant-baseline="central">Environment</text><text class="dg-sub" x="220" y="216" text-anchor="middle" dominant-baseline="central">Repo + terminal</text><rect class="dg-box" x="32" y="256" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">Stopping criteria</text><text class="dg-sub" x="220" y="308" text-anchor="middle" dominant-baseline="central">Submit a patch</text><rect class="dg-box dg-box--accent" x="32" y="348" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="372" text-anchor="middle" dominant-baseline="central">Scorer</text><text class="dg-sub" x="220" y="400" text-anchor="middle" dominant-baseline="central">Run tests to grade</text></svg>
```

## Specify the task before trusting the score

This lecture writes the scorer in full and ties it back to Lecture 12's data quality. The [official schedule](https://cs329z.stanford.edu/) lists data selection on November 2 and benchmark design on November 4. As of October 23, 2026, no public slides are linked. This section prepares the questions from assigned readings without inventing future lecture content. Start with a reproducible task, rather than a leaderboard rank.

### Request and environment: identical wording can describe different tasks

“Find why delivery was delayed” means something different when the agent can read an entire archive versus selected search results. Fix the email snapshot, tools, permissions, and initial state alongside the request. Otherwise, a higher score may merely reflect easier access to evidence. [Press's benchmark guide](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/) makes these conditions explicit with a four-tuple.

### Stopping criteria and scorer: stopping is not success

Stopping may mean producing an answer, exhausting a budget, or declaring failure. Separately, the scorer checks the cause, verifies citations, and detects a change from “possible” to “decided.” An empty response must not earn full credit simply because it contains no false statement. Correct formatting also does not establish completion. The [ABC paper](https://arxiv.org/html/2507.02825) provides a systematic way to inspect such specification gaps.

### Test the grader with counterexamples

Write empty answers, copied source text, correct citations with wrong conclusions, and correct conclusions with nonexistent citations. If all pass, repair the grader first. Ask humans to explain disputed cases and update the rubric; [EvalGen](https://arxiv.org/html/2404.12272) explains why criteria evolve after people see actual outputs. Relabel under the revised criteria before comparing scores.

**Check:** success falls after repairing a scorer. Has the agent regressed? **Answer criteria:** not necessarily. Regrade the old and new systems with the same scorer, then verify that the revised rule captures the intended task.

## Reading 1 | Agentic Benchmark Checklist

Source: [Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825)

### TL;DR

ABC organizes outcome- and task-validity checks from cases, literature, and benchmark-building experience, with a CVE-Bench application.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can task and scorer flaws distort benchmark scores? |
| Evidence and scope | The empty-response38% and CVE-Bench33-point changes are benchmark-specific cases, not a universal error magnitude. |

### Domain background

Agent benchmarks include environments, tasks, and scoring code; a flaw in any layer can invalidate a score.

### Intermediate guide

**Method.** Inspect task construction, environments, and scorers using a checklist and trivial agents that exploit specification gaps.

The Zhu et al. paper is blunt: many agentic benchmarks carry flaws in task setup or reward design. Two named cases: [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) ships too few test cases, and [TAU-bench](https://arxiv.org/abs/2406.12045) counts empty responses as successes — a trivial no-op agent scores 38% on the airline subset. Flaws like these can under- or over-estimate agents by up to a factor of two.

The authors' answer is the [Agentic Benchmark Checklist (ABC)](https://arxiv.org/abs/2507.02825). It distills building experience, a literature survey, and previously reported failures into one checklist. Run it over an existing benchmark and the numbers really move: one pass over the intricate [CVE-Bench](https://arxiv.org/abs/2503.17332) cut performance overestimation by 33 percentage points.

**Evidence and result.** ABC identifies issues such as successful empty responses and inadequate tests, showing that scorer validity requires independent inspection.

### Deeper points

- Outcome validity concerns whether scores reflect success; task validity concerns whether tasks measure the claimed capability.
- Both overestimation and underestimation occur; lower scores after a scorer fix do not imply an agent regression.

### Reviewer’s one-line verdict

Treat the benchmark itself as software that needs testing.

### Your take-away

Attack your scorer with empty answers, wrong evidence, and partial completions before trusting its scores.

## Reading 2 | How to Build Good Language Modeling Benchmarks

Source: [How to Build Good Language Modeling Benchmarks](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/)

### TL;DR

The guide defines tasks through request, environment, stopping criteria, and scorer, connecting task design to scores.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can benchmarks be natural, evaluable, and challenging? |
| Evidence and scope | This is a design guide; using a four-tuple does not guarantee freedom from contamination or scorer bugs. |

### Domain background

Inputs and answers omit the world an agent can access, its budget, and stop rules, making nominally identical evaluations incomparable.

### Intermediate guide

**Method.** Specify a four-tuple, then inspect whether the task is natural, automatically verifiable, and challenging for the target system.

**Evidence and result.** The guide gives task-specification conditions for discussing naturalness, evaluability, and difficulty beyond dataset size.

### Deeper points

- Stopping defines when execution ends; a scorer defines quality, allowing timeout and failure to be represented separately.
- Permissions and available tools change difficulty and should be versioned with the request.

### Reviewer’s one-line verdict

The four-tuple makes hidden task assumptions discussable.

### Your take-away

Specify one complete four-tuple and ask someone else to replay and score it from that specification.

## Reading 3 | tinyBenchmarks

Source: [tinyBenchmarks](https://arxiv.org/abs/2402.14992)

### TL;DR

The authors combine example selection and statistical estimation to predict full-benchmark accuracy from curated subsets.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can a small set estimate performance when a full benchmark is expensive? |
| Evidence and scope | The roughly100-example MMLU result depends on selection and model distribution; arbitrary subsets need not preserve rankings. |

### Domain background

Full evaluations are costly and examples overlap in information; reduction must handle representation and estimation error.

### Intermediate guide

**Method.** Select representative examples from existing model responses and use estimation to recover information about unrun items.

**Evidence and result.** On MMLU and other evaluations, selected examples estimate full performance; savings depend on representation and estimators rather than arbitrary deletion.

### Deeper points

- Report estimation error separately from model gaps; rankings are weak when gaps fall inside error.
- A subset may stop representing new model populations and require recalibration.

### Reviewer’s one-line verdict

A small benchmark earns trust through calibration, not smallness.

### Your take-away

Calibrate subset error against full evaluation, use small runs for iteration, and retain a fuller final check.

## What to do: write your 4-tuple for HW2

**What to do**: warm up for HW2 by writing the 4-tuple for your own agent. State the request in one sentence, list the tools and data the environment exposes, spell out what counts as done, and draft the simplest scorer you can defend. Then interrogate it with Zhu et al.'s cases: would your scorer pass an empty response? That page drafts the evaluation section of your midway report.

## Where it sits in the course

Lecture 13 writes the evaluation specification in full; next week, [Lecture 14](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en) handles asking a model to judge when there is no reference answer. HW2 asks for benchmark tasks built on the 4-tuple, and this lecture's checklist works as a self-review.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Assigned reading: Zhu et al., "Establishing Best Practices for Building Rigorous Agentic Benchmarks" (digested here)
- Additional readings: Press, "How to Build Good Language Modeling Benchmarks" (digested here); Polo et al., "tinyBenchmarks" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 13 (Wed Nov 4), previously part of the "Week 7: don't let the score fool you, then scale the data" guide; earlier entries below predate the split.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: the midpoint demo became a recorded video (due Wed Nov 4 at 11:59 p.m., no in-class presentation); rewrote the opening and course-position passages to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 12: Data Selection & Quality](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en), [Lecture 14: LLM-as-Judge & Evaluation Infrastructure](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272), [Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)
