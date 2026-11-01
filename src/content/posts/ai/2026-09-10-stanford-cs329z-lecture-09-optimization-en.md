---
title: "Change the Prompt, the Weights, or Think Longer: Three Axes of Agent Optimization | Stanford CS329Z Lecture 9"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 10
tldr: "Lecture 09 asks when optimization pays off, then compares context optimization (bootstrapped few-shot, MIPROv2, OPRO, TextGrad, GEPA), weight optimization (SFT, PPO, GRPO, on-policy distillation), and agents as optimizers. The readings cover test-time compute, GEPA, BetterTogether and MIPRO, ending with three things to do before HW1 is due."
description: "A page-linked guide to the CS329Z Lecture 09 Optimization slides, digests of test-time compute, GEPA, BetterTogether and MIPRO, when to change prompts versus weights, and how to spend the last days before HW1."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 9 (Oct 21, Optimization) changes the question: solo or multi-agent, a system can improve in three places. Change the prompt (the instructions), change the weights (the brain), or add inference compute (think longer). The slides first ask when optimization is worth it, then compare context optimization, weight optimization, and approaches such as the Darwin Gödel Machine that make the agent its own optimizer.

The assigned readings are Agrawal et al.'s [GEPA](https://arxiv.org/abs/2507.19457), Opsahl-Ong et al.'s MIPRO, and DeepSeekMath. This post digests GEPA and MIPRO, plus Snell et al.'s [test-time compute paper](https://arxiv.org/abs/2408.03314) and BetterTogether. The timing is practical: [HW1 is due Oct 30](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), and this post helps decide which axis gets the remaining effort. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 09 slide guide: optimize what the evidence identifies

<div class="slide-reader" data-slide-reader data-pages="125" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf">
<p>Lecture 09: 125 PDF pages.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf" target="_blank" rel="noopener noreferrer">Original PDF</a></p>
</div>

### Pages 1–11 — Optimization needs three pillars

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=1" data-slide-page="1">PDF pages 1–11</a>

Data, an executable system, and evaluation must exist together. Turn reliability, domain requirements, or cost into a measurable objective before searching prompts. A style-only metric can reward fluent mistakes. Demonstrations and feedback matter when textual instructions alone do not specify behavior reliably.

### Pages 12–22 — Few-shot optimization selects examples and ordering

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=12" data-slide-page="12">PDF pages 12–22</a>

The slides use ordering sensitivity to show that identical examples can produce different outcomes. STaR and DSPy bootstrapping build material from successful reasoning or task traces. Generate candidates, then select with a metric; not every generated trace deserves to become a demonstration.

### Pages 23–69 — Reflective search: MIPROv2 through GEPA

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=23" data-slide-page="23">PDF pages 23–69</a>

MIPROv2 has three stages behind its long animation: bootstrap successful demonstrations, propose instructions grounded in the program and data, and search instruction/demo combinations. Minibatches provide cheaper feedback with periodic fuller evaluation. TextGrad propagates textual feedback; GEPA reflects on traces and retains complementary candidates. A result chart is not a universal guarantee for every workload.

### Pages 70–104 — Weights: distinguish trajectory generation from feedback

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=70" data-slide-page="70">PDF pages 70–104</a>

SFT trains on teacher-completed task trajectories. RL lets the student interact and updates from outcome rewards. PPO and GRPO illustrate value-based versus group-relative feedback. On-policy distillation supplies teacher distributions along student-generated paths. **Check:** only offline successful teacher traces are available, with no environment interaction. Which route is directly supported? **Answer criteria:** SFT; RL requires interaction and rewards that have not been established.

### Pages 105–116 — Agents can optimize harnesses, with trustworthy evaluation

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=105" data-slide-page="105">PDF pages 105–116</a>

Darwin Gödel Machine, Meta-Harness, and auto-research connect modifications, experiments, and retention of useful versions. Changing system code is distinct from updating model weights. This guide recommends protecting acceptance conditions from the optimizer and preserving settings and failures so search does not merely select flattering scores.

### Pages 117–125 — Choose from constraints rather than slogans

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=117" data-slide-page="117">PDF pages 117–125</a>

BetterTogether shows that prompt and weight optimization can alternate. API-only access, changing tasks, or expensive interaction may favor a context-first experiment. Strong teachers, cheaper students, or excessive context can motivate weights. Data, compute, model access, and trustworthy acceptance jointly determine feasibility. An undiagnosed failure does not prove that fine-tuning is needed.

## Let data choose the intervention: Lecture 09

[Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf) begins with three requirements: data, an executable system, and evaluation with metrics. An optimizer cannot clarify an undefined notion of success. Track cost and latency alongside success rate. Separate development examples from held-out acceptance examples so that learning a familiar question set is not mistaken for generalization.

Context optimization includes more than editing a system instruction. Few-shot methods collect successful trajectories and search for useful combinations. MIPROv2 proposes both instructions and demonstrations, using minibatch evaluations to guide search. Reflective methods examine traces and feedback to propose changes. Saving only final scores loses the tool evidence that could identify which module needs revision.

| Available conditions | Intervention to test first | What to establish |
|---|---|---|
| API-only models, frequent task changes, expensive interaction | Context / prompt optimization | Evaluation covers real failures |
| A capable teacher and a cheaper target student | SFT / distillation | Quality and diversity of teacher trajectories |
| Student interaction and verifiable task completion | RL | Rewards reflect actual completion |
| Retries help some questions and a verifier is reliable | More inference compute | Benefit justifies cost and latency |

This table is a starting point synthesized from the lecture, not an exclusive menu. BetterTogether illustrates alternating prompts, weights, then prompts again. The lecture also considers agents that modify harnesses, run experiments, and retain improvements. More autonomous exploration makes evaluator integrity more important: keep acceptance checks outside the optimizer's editable scope and reserve unseen examples.

## Reading 1 | Scaling Test-Time Compute

Source: [Scaling Test-Time Compute](https://arxiv.org/abs/2408.03314)

### TL;DR

The study connects proposers and verifiers and compares search with revisions by task difficulty, model capability, and budget.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Should a fixed inference budget fund search or sequential revision? |
| Evidence and scope | Evidence comes from math problems and specific verifiers; equal benefits on enterprise email tasks are not established. |

### Domain background

Inference can produce more candidates or revise one answer repeatedly; similar resources can yield different failure modes.

### Intermediate guide

**Method.** Compare parallel candidates, sequential revisions, and verifier search under equal inference budgets and analyze by difficulty.

Snell et al. guard the inference-compute axis. They split test-time compute into two moves: searching against a process verifier, and letting the model iteratively revise its own answers. The paper studies how the usefulness of revision and search changes with task difficulty and compute budget. Its experiments on [MATH](https://arxiv.org/abs/2103.03874) motivate allocating compute selectively; they do not prove that an email assistant's persistent failures require new weights. Missing retrieval results, invalid tools, or a misleading evaluator can produce the same symptom. Read the trace before choosing an optimization axis.

**Evidence and result.** Search and revision show different returns by problem difficulty, supporting conditional rather than uniform compute allocation.

### Deeper points

- The proposer changes candidate distributions; the verifier selects among them, creating distinct bottlenecks.
- A biased verifier can make extra search select high-scoring mistakes more often.

### Reviewer’s one-line verdict

Extra inference is useful when the system can identify better attempts.

### Your take-away

Fix tasks and a cost ceiling; compare candidate search with revisions and inspect the failure types.

## Reading 2 | GEPA

Source: [GEPA](https://arxiv.org/abs/2507.19457)

### TL;DR

GEPA reads execution traces and feedback, proposes reflective prompt changes, and retains complementary Pareto candidates.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can an optimizer identify which module prompt needs work beyond an aggregate score? |
| Evidence and scope | Comparisons depend on tasks, models, and rollout budgets; the title does not guarantee superiority in every deployment. |

### Domain background

Compound systems can fail in retrieval, tools, or summaries; aggregate scores show outcomes while traces preserve clues.

### Intermediate guide

**Method.** Select a candidate, run a batch, reflect on traces, propose prompt changes, and evaluate whether to retain or merge them.

GEPA guards the prompt axis. It watches trajectories a system produces (reasoning, tool calls, tool outputs), reflects in natural language on what broke and which prompt line to change, then merges complementary lessons from its Pareto frontier of attempts. Its [open-source implementation](https://github.com/gepa-ai/gepa) makes the loop concrete: propose a prompt change, run it, inspect feedback, and retain useful candidates. Lecture 09 places GEPA alongside MIPROv2 and TextGrad, not as a guarantee that any particular prompt search wins on your workload.

**Evidence and result.** Across compound-system setups, the paper compares optimizers and budgets and shows how trace feedback can provide richer revision clues than a scalar reward.

### Deeper points

- Reflection needs the observations leading to failure; a final binary outcome loses module attribution.
- Pareto candidates preserve strengths across cases instead of prematurely discarding complementary strategies by one mean score.

### Reviewer’s one-line verdict

Reflection matters when feedback leads to an actionable change.

### Your take-away

Keep tool arguments and observations so reflection can identify a module; verify changes on held-out cases.

## Reading 3 | BetterTogether

Source: [BetterTogether](https://aclanthology.org/2024.emnlp-main.597/)

### TL;DR

BetterTogether alternates prompt optimization and fine-tuning, using the improved system to support the next stage.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can prompt and weight optimization change one another's best starting point? |
| Evidence and scope | Results concern the paper's QA and reasoning setups; alternation is not automatically cheaper or better. |

### Domain background

Prompts change output distributions, while fine-tuning changes responses to instructions; the two can interact.

### Intermediate guide

**Method.** Alternate training-data generation, fine-tuning, and prompt search on an evaluable program while preserving stage comparisons.

**Evidence and result.** In the paper's multihop QA and math settings, combined strategies outperform the compared prompt-only or weight-only setups.

### Deeper points

- Fine-tuning can change the best prompt, so the old prompt need not remain optimal for new weights.
- Successful traces may lack diversity; repeated self-teaching should check for distribution narrowing.

### Reviewer’s one-line verdict

Optimization order is itself a system-design decision.

### Your take-away

Preserve stage versions and cost; test whether the combination beats optimizing either component alone.

## Reading 4 | MIPRO

Source: [MIPRO](https://arxiv.org/abs/2406.11695)

### TL;DR

MIPRO grounds candidates in programs, data, and successful traces, then uses surrogate evaluation to search combinations.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How should instructions and demonstrations be selected across a multistage program? |
| Evidence and scope | The paper reports up to about 13% accuracy improvement in its setups, not a separate 13% gain for every module. |

### Domain background

Instructions interact across program stages, so local optima need not produce the best end-to-end system.

### Intermediate guide

**Method.** Bootstrap demonstrations, propose instructions, then use surrogate search over instruction-demonstration combinations.

**Evidence and result.** The paper reports beating compared optimizers on five of seven multistage programs, with gains varying by program and search.

### Deeper points

- Candidate instructions use program, data, and successful-trace context rather than blind rewriting.
- Minibatches reduce search cost, while selected candidates still need fuller evaluation.

### Reviewer’s one-line verdict

Joint search evaluates instructions and demonstrations together and depends on trustworthy metrics.

### Your take-away

Version module instructions and demonstrations together and retain end-to-end scores to inspect cross-module effects.

## Closing HW1: three things before submission

First, freeze the skeleton. Once [Lectures 6](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en) and [7](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en) fixed the [ReAct](https://arxiv.org/abs/2210.03629) loop's shape and the memory tiers, stop touching them — a frozen runnable version is your control group. Second, complete the harness: HW1 wants more than a pipeline that searches email — it wants tools, a terminal, memory, and a human in the loop. Fill whichever piece is missing first, and after each one rerun the same email question set against the frozen version. Third, write three lines of error analysis: which kinds of questions fail most, whether failures land in retrieval or reasoning, and where the human checkpoint caught a mistake.

**What to do**: budget the remaining time in proportion to what is missing: freeze the skeleton, complete the harness piece by piece with comparisons, and reserve time for error analysis and cleanup. Move one axis per day: prompts today, compute tomorrow, splitting agents only the day after. Failures from mixed tuning cannot be written up.

## Where it sits in the course

Lecture 9 lets evidence choose the layer to optimize, and that evidence comes from evaluation and data. Next week, [Lecture 10](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en) has the Terminal-Bench authors on writing verifiable evaluation tasks, and Lecture 11 covers the data agents need.

## Course material for this lecture

- Official slides (PDF): [Optimization — Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- Assigned readings: Agrawal et al., "GEPA" (digested here); Opsahl-Ong et al., "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs" (digested here); Shao et al., "DeepSeekMath"
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 9 (Wed Oct 21), previously part of the "Week 5: go solo or call a meeting" guide; earlier entries below predate the split.
- 2026-10-23: Added Lecture 08–09 material on coordination, worktrees, weight optimization and evaluation-based choices; added an original worked example, diagram and answer criteria.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, the goal is a framework-free full harness); rewrote the ten-day "Closing HW1" plan and the HW1 hooks in each "What to do" note
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 8: Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en), [Lecture 10: Terminal-Bench guest lecture](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Slides: [Lecture 09: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314), [Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- Tools: [GEPA](https://github.com/gepa-ai/gepa)
