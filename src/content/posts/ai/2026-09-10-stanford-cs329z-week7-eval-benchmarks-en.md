---
title: "Score Honestly, Scale Data — Midterm Checkpoint | Stanford CS329Z Week 7"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 8
tldr: "Week 7 is midterm checkpoint week: data selection on Monday, evaluation and benchmark design on Wednesday. Zhu et al. teach you not to be fooled by your own scores, SWE-smith scales software-engineering tasks to 50,000 instances, and you close by drafting a first 4-tuple for HW2."
description: "A guided reading of the Stanford CS329Z Week 7 anchors: the agentic benchmark best-practices checklist, human alignment of LLM judges, the SWE-smith data-scaling pipeline, and the course's 4-tuple evaluation frame."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Week 7 is midterm checkpoint week. Monday (Nov 2) covers data selection and quality, Wednesday (Nov 4) covers evaluation fundamentals and benchmark design. That same week the recorded midpoint demo video is due Wednesday at 11:59 p.m. (no in-class presentation) and the midway report is due Friday. Data and scores sharing one week is no coincidence: the demo video argues with numbers, the report accounts for where the data came from.

A framework first, for newcomers. The course defines an agent evaluation as a 4-tuple: the request states the task, the environment is the world the agent can act in, the stopping criteria say when it is done, and the scorer decides the grade. Drop any one of the four and the number means nothing.

Take bug-fixing as the running example. The request is "fix this issue," the environment is the repo plus a terminal, the stopping criterion is submitting a patch, and the scorer runs the tests. The three anchor readings divide the labor: [Zhu et al.'s best practices](https://arxiv.org/abs/2507.02825) show how easily scorers go wrong, [Shankar et al.'s validators study](https://arxiv.org/abs/2404.12272) shows how to align LLM-assisted grading with humans, and [Yang et al.'s SWE-smith](https://arxiv.org/abs/2504.21798) shows how to scale up task data.

```diagram
title: Four fields define an evaluation
desc: Request, environment, stopping criteria and scorer jointly specify a bug-fix evaluation.
caption: The grouped fields define one specification, not execution order; stopping and success are separate.
---
<svg viewBox="0 0 440 456"><rect class="dg-zone dg-zone--solid" x="8" y="8" width="424" height="440" rx="6"/><text class="dg-heading" x="220" y="40" text-anchor="middle" dominant-baseline="central">One evaluation specification</text><rect class="dg-box" x="32" y="72" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="96" text-anchor="middle" dominant-baseline="central">Request</text><text class="dg-sub" x="220" y="124" text-anchor="middle" dominant-baseline="central">Fix this issue</text><rect class="dg-box" x="32" y="164" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="188" text-anchor="middle" dominant-baseline="central">Environment</text><text class="dg-sub" x="220" y="216" text-anchor="middle" dominant-baseline="central">Repo + terminal</text><rect class="dg-box" x="32" y="256" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">Stopping criteria</text><text class="dg-sub" x="220" y="308" text-anchor="middle" dominant-baseline="central">Submit a patch</text><rect class="dg-box dg-box--accent" x="32" y="348" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="372" text-anchor="middle" dominant-baseline="central">Scorer</text><text class="dg-sub" x="220" y="400" text-anchor="middle" dominant-baseline="central">Run tests to grade</text></svg>
```

## Specify the task before trusting the score

This week connects data quality to scoring. The [official schedule](https://cs329z.stanford.edu/) lists data selection on November 2 and benchmark design on November 4. As of October 23, 2026, no public slides are linked. This section prepares the questions from assigned readings without inventing future lecture content. Start with a reproducible task, rather than a leaderboard rank.

### Request and environment: identical wording can describe different tasks

“Find why delivery was delayed” means something different when the agent can read an entire archive versus selected search results. Fix the email snapshot, tools, permissions, and initial state alongside the request. Otherwise, a higher score may merely reflect easier access to evidence. [Press's benchmark guide](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/) makes these conditions explicit with a four-tuple.

### Stopping criteria and scorer: stopping is not success

Stopping may mean producing an answer, exhausting a budget, or declaring failure. Separately, the scorer checks the cause, verifies citations, and detects a change from “possible” to “decided.” An empty response must not earn full credit simply because it contains no false statement. Correct formatting also does not establish completion. The [ABC paper](https://arxiv.org/html/2507.02825) provides a systematic way to inspect such specification gaps.

### Test the grader with counterexamples

Write empty answers, copied source text, correct citations with wrong conclusions, and correct conclusions with nonexistent citations. If all pass, repair the grader first. Ask humans to explain disputed cases and update the rubric; [EvalGen](https://arxiv.org/html/2404.12272) explains why criteria evolve after people see actual outputs. Relabel under the revised criteria before comparing scores.

**Check:** success falls after repairing a scorer. Has the agent regressed? **Answer criteria:** not necessarily. Regrade the old and new systems with the same scorer, then verify that the revised rule captures the intended task.



## Reading 1 | SWE-smith

Source: [SWE-smith](https://arxiv.org/abs/2504.21798)

### TL;DR

The pipeline builds execution environments and synthesizes changes that fail existing tests, yielding verifiable tasks and trajectories.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can software-agent training tasks scale beyond manual curation? |
| Evidence and scope | The 50k tasks, 128 repositories, and 40.2% Pass@1 describe the authors' historical dataset and model, not a current ranking. |

### Domain background

Issue curation, environment setup, and test validation constrain training-data scale; generating task text alone is insufficient.

### Intermediate guide

**Method.** Select repositories and install environments, generate candidate bugs with multiple strategies, filter using tests, and collect solution trajectories.

Now the data side. [SWE-smith](https://arxiv.org/abs/2504.21798) starts from a concrete pain: some early software-engineering training sets had limited repository coverage and labor-intensive curation. This is not a claim that every dataset currently falls below one repository-count limit. The inversion: given any Python codebase, build its execution environment, then automatically synthesize task instances that break its existing tests.

The dataset built this way spans 128 GitHub repositories. It totals 50,000 instances. SWE-agent-LM-32B, trained on it, reached 40.2% Pass@1 on SWE-bench Verified, the best among open models at the time.

**Evidence and result.** The pipeline creates over50k tasks and supports a trained software agent; task generation and model evaluation are distinct stages.

### Deeper points

- Failing tests provide executable signal but do not make every destructive change a useful bug.
- Setup and validation costs affect repository inclusion, so repository count does not establish full real-world coverage.

### Reviewer’s one-line verdict

Executable validation makes synthetic tasks more inspectable training material.

### Your take-away

Verify that tests catch task failures before scaling data; check transfer on independent repositories or tasks.

## Reading 2 | Who Validates the Validators?

Source: [Who Validates the Validators?](https://arxiv.org/abs/2404.12272)

### TL;DR

EvalGen proposes criteria and implementations, gathers human labels, and selects validators aligned with those judgments.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can graders follow human criteria that evolve after seeing outputs? |
| Evidence and scope | Criteria drift changes the standard itself; scores from different rubrics are not directly comparable trends. |

### Domain background

Open-ended quality lacks one canonical answer; people often discover missing criteria only after seeing outputs.

### Intermediate guide

**Method.** People define or select criteria, the system proposes validators, and human-labeled outputs guide implementation selection.

Monday's third anchor changes the protagonist: [Shankar et al. ask how LLM-assisted grading aligns with humans](https://arxiv.org/abs/2404.12272) (UIST 2024). Human grading is expensive and code-based grading is narrow, so everyone uses LLMs as judges — but judge models inherit every flaw of the models they grade and need validating in turn. Their answer is EvalGen, mixed-initiative: the system drafts criteria and implementations (Python functions or grader prompts) while asking humans to grade a small sample of outputs, then picks the implementation that best matches human grades.

The finding worth remembering is criteria drift: you need criteria to grade outputs, but grading outputs is how you discover what the criteria should be. Some criteria even depend on the outputs observed rather than existing a priori — a direct hit on the assumption that evaluation stands independent of observation. Read this before writing any LLM-as-judge for HW2.

**Evidence and result.** The study observes criteria revisions after outputs are inspected and demonstrates interactive support for developing aligned validators.

### Deeper points

- A criterion is the intended quality; a validator is its code or prompt implementation.
- Disputed cases may reveal unresolved value choices rather than mere annotation noise.

### Reviewer’s one-line verdict

Calibrate evaluators before using them to optimize the system.

### Your take-away

Version rubric changes, regrade fixed examples, and preserve reasons for human-model disagreement.

## Reading 3 | Agentic Benchmark Checklist

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

## Reading 4 | LIMA

Source: [LIMA](https://arxiv.org/abs/2305.11206)

### TL;DR

LIMA uses 1,000 curated demonstrations for supervised fine-tuning and studies alignment quality rather than volume alone.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can a small curated set teach response behavior to a pretrained model? |
| Evidence and scope | The 43% combines ties and preferences against GPT-4 in a specific human study; it is not universal superiority. |

### Domain background

Pretraining capability and instruction alignment are different stages; small datasets study the latter without creating knowledge from nothing.

### Intermediate guide

**Method.** Fine-tune a pretrained model on curated prompt-response examples and compare human preferences on unseen questions.

**Evidence and result.** A controlled human-preference evaluation finds competitive replies after small curated SFT, motivating the authors' alignment-as-format hypothesis.

### Deeper points

- The hypothesis depends on a strong pretrained base; removing that capability does not preserve the few-example result.
- Combined ties and wins are neither a standalone win rate nor factual accuracy.

### Reviewer’s one-line verdict

Curated demonstrations do not establish that every task needs little data.

### Your take-away

Curate demonstrations for actual failures before testing the value of adding more examples.

## Reading 5 | How to Build Good Language Modeling Benchmarks

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

## Reading 6 | tinyBenchmarks

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

After Week 7 comes judgment: Wednesday's demo video argues with scores, Friday's report accounts for data and method. [Week 6](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en) covered the data flywheel; Week 7 supplies the other half — scores that don't fool you. Write the 4-tuple now and half of HW2's task definition is done.

## This week's course materials

- Monday Nov 2, Data Selection & Quality: anchors SWE-smith and Who Validates the Validators? (covered above). Further reading: [Zhou et al., LIMA](https://arxiv.org/abs/2305.11206) fine-tunes on only 1,000 carefully curated prompts and responses with the standard supervised loss, no reinforcement learning. In a controlled human study, 43% of its responses match or beat GPT-4. The moral: pretraining supplies the knowledge, alignment wants a few excellent demonstrations.
- Wednesday Nov 4, Evaluation Fundamentals & Benchmark Design: anchor Zhu et al.'s best practices (covered above). Further reading: [Press on building good LM benchmarks](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/) asks for natural, automatically evaluable, and challenging tasks, and warns against letting one LM be both solver and judge. His closing defines a task as a request–environment–stopping-criteria–scorer 4-tuple — the source of this week's frame. Further reading: [Polo et al., tinyBenchmarks](https://arxiv.org/abs/2402.14992) shows MMLU's 14,000 examples need not all run. The authors estimate full MMLU performance using about 100 selected examples. This depends on their selection and estimation procedure; arbitrary 100-example subsets do not guarantee the same ranking. Evaluation buys representativeness, not volume.

## Update log

- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.

- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: the midpoint demo became a recorded video (due Wed Nov 4 at 11:59 p.m., no in-class presentation); rewrote the opening and course-position passages to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## References

- On this site: [Week 6: the data flywheel](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798), [Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272), [Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)
