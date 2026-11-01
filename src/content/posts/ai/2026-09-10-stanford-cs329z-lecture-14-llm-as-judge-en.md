---
title: "Let a Model Judge: Grader Choice, Judge Bias, and Calibration | Stanford CS329Z Lecture 14"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 15
tldr: "Per the schedule, Lecture 14 covers the three grader types, judge prompt design, known biases, pairwise versus pointwise evaluation, non-determinism metrics such as pass@k and pass^k, harness design and Anthropic's eight-step roadmap. The readings run from Demystifying Evals and MT-Bench to AutoMetrics and AutoLibra."
description: "A preview of Stanford CS329Z Lecture 14, LLM-as-Judge & Evaluation Infrastructure: digests of Demystifying Evals, MT-Bench, AutoMetrics and AutoLibra on judge formats, biases and calibration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Open-ended answers have no reference answer, and that is where Lecture 14 (Nov 9, LLM-as-Judge & Evaluation Infrastructure) begins. Traditional multiple-choice benchmarks such as [MMLU](https://arxiv.org/abs/2009.03300) measure whether knowledge is right or wrong. Two answers can both be correct while only one is useful, and traditional benchmarks cannot see that gap.

Human grading is the gold standard, but it is slow and expensive; you cannot recruit dozens of graduate students again every time the prompt changes. The fix is to have a strong model judge, an approach validated in the [MT-Bench paper](https://arxiv.org/abs/2306.05685), and Anthropic's [evals guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) places it within full agent evaluation. The assigned readings also include Ryan et al.'s AutoMetrics, with AutoLibra as an additional reading; this post digests all four. Judges make mistakes too, so the lecture is as much about checking the judge as about using one. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

## Check the evidence before choosing who grades

The [official schedule](https://cs329z.stanford.edu/) puts judges and evaluation infrastructure on Nov 9. As of 2026-10-29 no public slides exist for this lecture, so this section previews it from the assigned readings. A Chinese-language support assistant can sound natural and still get a refund status wrong, and a single total score should not hide that difference.

### Match each requirement to observable evidence

A refund can be checked against transaction state; a clear explanation needs a rubric and language judgment. Choose graders after identifying the evidence. [Anthropic's evaluation guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) combines code, model, and human graders in a harness and distinguishes occasional success from repeated reliability. At least one success across several attempts does not promise success on every use.

### Give the judge its own test set

Preserve human-labeled examples, including concise correct answers, verbose wrong answers, and unsupported claims. Fix the rubric, inspect disagreements, and swap pairwise answer order to diagnose position effects. The [MT-Bench paper](https://arxiv.org/html/2306.05685) studies position and verbosity biases. Swapping order diagnoses a problem; it does not guarantee its removal. Recalibrate when the judge, prompt, or rubric changes.

## Reading 1 | Demystifying Evals for AI Agents

Source: [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

### TL;DR

The guide separates tasks, trials, graders, and harnesses and combines code, model, and human checks while distinguishing occasional success from repeated reliability.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams building repeatable acceptance checks for their first tool-using agent. |
| Read first | The task/trial/grader/harness definitions, then the distinction between outcomes and trajectories. |
| Adoption cost | Clean environments, failure cases, and human calibration need maintenance; changing the judge prompt is only one part. |

### Domain background

A single-answer benchmark can often grade the final text. An agent may edit files, change database state, and repair earlier mistakes through later actions. A reply saying “done” can conceal an unchanged environment, while an untidy trajectory can still achieve the goal. Evaluation therefore needs an explicit starting state, permitted actions, and observable completion conditions.

### Intermediate guide

**Problem.** When a task permits several valid solutions, how can evaluation establish completion without rejecting a trajectory that differs from the reference?

**Method and observations.**

Anthropic sorts graders into three kinds. Code-based graders check deterministic evidence: string matching, unit tests, static analysis, tool-call records. Model-based graders check open-ended quality: rubric scoring, natural-language assertions, pairwise comparison, reference-based grading, multi-judge consensus. Humans serve as the gold standard: expert review, crowdsourcing, spot-check sampling.

The selection rule is pragmatic: wherever a deterministic check works, use it. Reserve model judges for places only they can reach, and reserve humans for calibrating model judges plus periodic sampling. One support task can carry all three grader types: whether the ticket landed resolved in the database, whether the key tools were called by the book, and whether the tone showed empathy. The first two are code-based; only the last one calls a model.

| Grader | Main evidence | Support example above | Human role |
|---|---|---|---|
| Code-based | State, tests, tool logs | Ticket state and tool use | Decide what to check |
| Model-based | Answer and rubric | Empathetic tone | Calibrate and sample |
| Human | Expert or user judgment | Calibration of model judges | Supply alignment evidence |

Note the conclusion early: the judge is just one cell in the model-based column, not the whole eval. The wrong grader choice is beyond any judge's rescue.

**Reading the result.** This is engineering guidance; pass@k and pass^k answer different questions and cannot be interchanged as reliability claims.

### Deeper points

- **Separate transcripts from outcomes.** A trace explains what the agent attempted; environmental state establishes whether the goal was achieved. Matching one ideal tool sequence can reject valid alternative solutions.

- **Resetting the environment is part of the experiment.** Files or account state left by a previous trial can create false successes. Starting conditions and tool versions need to be traceable for each run.

- **Retry metrics imply different uses.** pass@k asks whether at least one attempt succeeds; pass^k asks whether every attempt in the group succeeds. A retryable search assistant and an executor expected to work every time need different summaries.

### Reviewer’s one-line verdict

Read this before building the first eval: it prevents a judge score from becoming a substitute for acceptance evidence, although it supplies no universal reliability threshold.

### Your take-away

Choose a task that changes external state, fix its initial data, and save the final reply, tool trace, and state snapshot separately. Have each grader identify its success or failure evidence, then repeat the task to check consistency.

## Reading 2 | MT-Bench and Chatbot Arena

Source: [MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)

### TL;DR

The study compares pairwise, single-answer, and reference-guided grading and investigates position, verbosity, and self-preference biases.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams comparing many open-ended answers with access to a small expert-labeled sample. |
| Read first | Judge formats, followed by position/verbosity tests and the exclusions in expert comparisons. |
| Insufficient alone | Preference ranking cannot establish verifiable correctness or authorize high-consequence actions. |

### Domain background

Open-ended assistant answers rarely have a single reference string: completeness, presentation, and preference all affect judgment. Human pairwise comparison is useful but costly. MT-Bench studies judges on controlled multi-turn questions, while Chatbot Arena collects blind preferences from real users. These are complementary forms of evidence; chat preferences do not define correctness for every professional task.

### Intermediate guide

**Problem.** After delegating human preference judgments to a model, which differences reflect answer quality and which reflect the judge’s presentation preferences?

**Method and observations.**

Judge shapes come in three. Pairwise judging places two answers side by side and picks the winner without scoring. Pointwise judging scores a single answer directly, also called single-answer grading. Reference-guided judging treats math and reasoning questions specially: attach the reference solution, then judge.

The tradeoff sits between cost and sensitivity. Pairwise judging is sensitive, while its grading workload grows quadratically with the number of contestants. Pointwise judging scales well, while absolute scores drift with the judge model. MT-Bench validation shows [GPT-4](https://arxiv.org/abs/2303.08774) pointwise and pairwise results agreeing closely, with a fairly stable internal rubric.

Math questions are the judge's weak spot: solving a problem does not imply grading one. Wrong answers drag the judge along, and even basic questions can get misjudged. Two mitigations help: let the judge solve the question independently before grading, or attach the reference answer outright. With the reference attached, the failure rate falls to roughly fifteen percent.

The first bad habit is position bias: a standing preference for whichever answer comes first. The fix is judging twice with positions swapped, counting a win only when an answer wins both rounds, and calling the rest ties. Double the grading cost buys one trustworthy outcome.

The second is verbosity bias: long, watery answers get favored. The paper tests it with a "repetitive list" attack: rephrase an answer's list and paste it back in, adding zero new information. Weaker judges fall for it nearly every time, while GPT-4 falls for it under one time in ten.

The third is self-enhancement: the suspicion that judges prefer their own outputs. Evidence here is thin, with [Claude](https://www.anthropic.com/claude) showing the largest apparent self-love and GPT-3.5 showing none. The paper closes honestly: inconclusive, pending cleaner controlled experiments.

Calibration is where trust comes from. The baseline is votes from fifty-eight experts. In the S2 setting excluding ties, GPT-4 agrees with the human majority eighty-five percent of the time, while experts agree with each other eighty-one percent of the time. This supports preference alignment in that setting without establishing that a model can replace experts in arbitrary domains.

**Reading the result.** The85% versus81% comparison uses S2 without ties;58 experts and23 repetitive-list cases do not cover every domain.

### Deeper points

- **Swapping order measures judge stability.** If the same two answers exchange places and the winner changes, presentation is affecting the verdict. Recording a tie reduces this bias while leaving fewer decisive comparisons.

- **Reference answers change the information available.** Better mathematical grading with a supplied solution supports reference-guided evaluation; it does not establish independent verification of unfamiliar reasoning.

- **Agreement depends on the comparison set.** S2 excludes ties, unlike many ambiguous production reviews. Self-preference findings also remain confounded by differences in answer quality.

### Reviewer’s one-line verdict

The paper makes model judging an engineering option worth testing; reproduce its bias tests before treating expert agreement as certification for a new domain.

### Your take-away

Collect a small set of answer pairs with human verdicts for your task. Test original order, reversed order, and a padded version that adds no information. Use verdict reversals to revise the rubric and keep the original labels for later judge-version comparisons.

## Reading 3 | AutoMetrics

Source: [AutoMetrics](https://arxiv.org/abs/2512.17267)

### TL;DR

AutoMetrics selects existing and generated candidate metrics and learns an interpretable scoring combination from sparse human feedback.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Product teams with sparse human ratings and frequent iterations on subjective quality. |
| Read first | Generate/retrieve/regress/report, then results by backbone and dataset. |
| Adoption condition | Human signals, candidate metrics, and held-out validation must represent the same task and user population. |

### Domain background

Users may leave ratings, thumbs-up signals, or behavioral feedback without explaining which qualities mattered. A hand-written rubric can miss those qualities, while a large reward model needs more data. AutoMetrics treats scarce human signals as a learning target and searches for a combination of candidate metrics that predicts them.

### Intermediate guide

**Problem.** When feedback contains a score but no explanation, can inexpensive candidate measures be combined into an evaluator that better predicts user judgments?

**Method and observations.**

[Ryan et al.’s AutoMetrics](https://arxiv.org/abs/2512.17267) separates generation, retrieval, regression, and reporting. First author Michael Ryan also teaches the course. Candidates come from generated single-criterion, rubric, and example-based judges and from relevant entries in MetricBank’s collection of 48 existing metrics. Each Metric Card documents intended use, implementation, and limitations for retrieval and review.

Candidate scores are standardized before Partial Least Squares (PLS) regression fits the human signal. The method first weights a larger candidate pool, selects important metrics, and refits on the reduced set; the report exposes the combination, weights, and correlations. This addresses sparse labels with correlated predictors while making the main scoring criteria inspectable. [Section 3 of the full paper](https://arxiv.org/pdf/2512.17267v1.pdf) describes these steps: generating a rubric alone is not the method.

Across five tasks, the reported maximum relative improvement in Kendall correlation with human judgments over LLM-as-a-judge is 33.4%, not an equal percentage-point gain in answer accuracy. The method uses fewer than a hundred feedback points, and specific system-optimization experiments compare proxy and verifiable rewards. Results vary by backbone and dataset; a deployment still needs its own held-out human labels.

### Deeper points

- **Retrieve candidates before learning their weights.** Metric Card retrieval filters evaluation cost; regression determines which combination predicts human signals. Retrieval rank is not a learned importance weight.

- **Correlation is only one validity check.** The paper also tests sensitivity to degraded quality and stability under inconsequential edits. Ranking existing labels well does not by itself show detection of new failures.

- **Interpretable coefficients have limits.** Candidate metrics can be strongly correlated. PLS accommodates that small-data setting without turning a coefficient into a causal account of user preference.

### Reviewer’s one-line verdict

The useful shift is to treat the evaluator as a learned system that needs validation; automatic weighting still depends on representative human feedback.

### Your take-away

Split scarce feedback into fitting and held-out sets. Compare a single judge with the composite metric on held-out rankings, then test harmless paraphrases and removal of essential content: scores should remain stable for the former and fall for the latter.

## Reading 4 | AutoLibra

Source: [AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn)

### TL;DR

AutoLibra turns open-ended trajectory feedback into reusable behavioral metrics and checks their alignment with human concerns.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams with textual trajectories and concrete feedback but no reusable behavioral metrics. |
| Read first | Feedback grounding and metric definitions, then the exact coverage/redundancy calculations. |
| Compared with AutoMetrics | AutoLibra asks which behaviors deserve evaluation; AutoMetrics learns how metric combinations align with human signals. |

### Domain background

Users can often say “stop clicking the disabled button” or “you made too many decisions for me” more easily than they can design a scoring framework. These comments concern process behavior that task success can hide. AutoLibra induces evaluation dimensions from such feedback so observations scattered across trajectories can accumulate into reusable criteria.

### Intermediate guide

**Problem.** How can a complaint about one execution become a reusable behavioral criterion without losing what the user meant?

**Method and observations.**

[The full AutoLibra paper](https://arxiv.org/html/2505.02820v3) pushes the question one step earlier. Task success is blunt: an agent can finish while repeatedly ignoring constraints, or behave well until failing at the final step. AutoLibra grounds open-ended human feedback in concrete trajectory behavior, clusters similar positive and negative behavior into metrics with definitions and examples, then asks an LLM judge to score new trajectories `+1`, `-1`, or `N/A`. Coverage checks how much human feedback is represented; redundancy measures detected traits absent from that feedback. The method compares metric sets using these two criteria.

The metrics can become improvement targets. Across collaborative, social, web, and text-game environments, the best reported coverage varies from roughly sixty to nearly ninety percent; metric-guided prompt iteration and trajectory selection also improve success on specific benchmarks. Those results are not general guarantees. The study covers text-based observations and actions, most new labels come from the authors rather than diverse end users, and bias in the extraction model can harden into the rubric. MT-Bench and AutoMetrics ask whether a judge is reliable; AutoLibra asks whether users' actual concerns made it onto the exam.

**Reading the result.** The study uses textual environments and limited annotators; induced metrics can inherit model and annotation bias.

### Deeper points

- **Grounding determines whether feedback was understood.** “Too autonomous” needs to point to a decision taken without confirmation. Turning the abstract phrase directly into a metric preserves its ambiguity.

- **Redundancy has a specific definition.** It is the share of detected traits not mentioned in human feedback, rather than merely overlap between synonymous metrics. Extra traits may be irrelevant judgments or behavior the human omitted; inspect them before deciding which.

- **Feedback providers determine the optimization target.** Authors supplied most newly annotated data, and observations/actions are textual. Induced criteria do not automatically represent every user role or visual interface.

### Reviewer’s one-line verdict

This is better grounded than asking a model to invent a list of ideal agent traits, but its representation of product users still depends on who supplied feedback and how accurately it was grounded.

### Your take-away

Collect complaints paired with actual trajectories. Mark the relevant action and desired alternative for each comment. Hold out feedback from induction, test whether the new metrics cover it, and manually inspect extra traits reported by the evaluator.

## What to do: ship a working judge score

**What to do**: add a judge-based eval to your own agent. Pick twenty real tasks from bug reports, check correctness deterministically, and write one natural-language assertion each for tone and completeness for a model to judge; run it weekly to catch regressions. Calibrate the judge first against outputs humans have already graded, swap pairwise answer order to test position effects, and only then put the judge score in your report.

## Where it sits in the course

Lecture 14 lets scores judge quality; [Lecture 15](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety-en) answers a different question: why an agent that passes evaluation can still cause harm in deployment. HW2 requires at least one LLM-as-judge, and this lecture's calibration steps apply directly.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Assigned readings: Grace et al., "Demystifying Evals for AI Agents" (digested here); Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (digested here); Ryan et al., "AutoMetrics" (digested here)
- Additional reading: Zhu et al., "AutoLibra" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 14 (Mon Nov 9), previously part of the "Week 8: let a model judge, then put guardrails on the agent" guide; earlier entries below predate the split.
- 2026-10-23: Expanded all ten readings with distinct background, editorial judgments, mechanisms, and exercises; checked the full AutoMetrics pipeline and AutoLibra redundancy definition.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-12: Added substantive guides to AutoLibra, CDI, prompt injection, and RSP, including the historical-version boundary for RSP.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 13: Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks-en), [Lecture 15: Agent Safety & Guardrails](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Grace et al., Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685), [Ryan et al., AutoMetrics](https://arxiv.org/abs/2512.17267), [Zhu et al., AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn)
