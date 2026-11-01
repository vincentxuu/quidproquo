---
title: "More Data Is Not Always Better: Selection, Validation, and Quality | Stanford CS329Z Lecture 12"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 13
tldr: "Per the schedule, Lecture 12 covers finding maximally informative data, filtering and selection, tiny-but-targeted benchmarks, annotation practice, quality assessment and building datasets from agent traces. SWE-smith shows how to scale software-engineering task data, Who Validates the Validators covers aligning LLM grading with humans, and LIMA shows what a small high-quality dataset can do."
description: "A preview of Stanford CS329Z Lecture 12, Data Selection & Quality, built from the schedule and assigned readings: digests of SWE-smith, Who Validates the Validators, and LIMA on data scale, quality and validator alignment."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 12 (Nov 2, Data Selection & Quality) follows the previous lecture's data flywheel with the next question: once data is coming in, what is worth keeping? The schedule lists finding maximally informative data, filtering and selection strategies, tiny-but-targeted benchmarks, annotation practice, quality assessment, and building datasets from agent traces.

The assigned readings are Yang et al.'s [SWE-smith](https://arxiv.org/abs/2504.21798) and Shankar et al.'s [Who Validates the Validators?](https://arxiv.org/abs/2404.12272), with Zhou et al.'s LIMA as an additional reading. This post digests all three: SWE-smith on scaling task data, the validator study on aligning LLM-assisted grading with humans, and LIMA on how far a small high-quality dataset can go. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

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

This lecture's other anchor reading changes the protagonist: [Shankar et al. ask how LLM-assisted grading aligns with humans](https://arxiv.org/abs/2404.12272) (UIST 2024). Human grading is expensive and code-based grading is narrow, so everyone uses LLMs as judges — but judge models inherit every flaw of the models they grade and need validating in turn. Their answer is EvalGen, mixed-initiative: the system drafts criteria and implementations (Python functions or grader prompts) while asking humans to grade a small sample of outputs, then picks the implementation that best matches human grades.

The finding worth remembering is criteria drift: you need criteria to grade outputs, but grading outputs is how you discover what the criteria should be. Some criteria even depend on the outputs observed rather than existing a priori — a direct hit on the assumption that evaluation stands independent of observation. Read this before writing any LLM-as-judge for HW2.

**Evidence and result.** The study observes criteria revisions after outputs are inspected and demonstrates interactive support for developing aligned validators.

### Deeper points

- A criterion is the intended quality; a validator is its code or prompt implementation.
- Disputed cases may reveal unresolved value choices rather than mere annotation noise.

### Reviewer’s one-line verdict

Calibrate evaluators before using them to optimize the system.

### Your take-away

Version rubric changes, regrade fixed examples, and preserve reasons for human-model disagreement.

## Reading 3 | LIMA

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

## Where it sits in the course

Lecture 12 decides what data to keep; [Lecture 13](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks-en) writes the evaluation specification in full. The midpoint demo video is due Wednesday evening of the same week and the midway report on Friday, and the report has to explain where the data came from.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Assigned readings: Yang et al., "SWE-smith: Scaling Data for Software Engineering Agents" (digested here); Shankar et al., "Who Validates the Validators?" (digested here)
- Additional reading: Zhou et al., "LIMA: Less Is More for Alignment" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 12 (Mon Nov 2), previously part of the "Week 7: don't let the score fool you, then scale the data" guide; earlier entries below predate the split.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: the midpoint demo became a recorded video (due Wed Nov 4 at 11:59 p.m., no in-class presentation); rewrote the opening and course-position passages to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 11: Data for Agentic Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents-en), [Lecture 13: Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798), [Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272)
