---
title: "Take Frameworks Apart: DSPy, LangGraph, and the Harness Gap | Stanford CS329Z Lecture 5"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 6
tldr: "Lecture 05 frames agent engineering through data, systems and evaluation, demos DSPy and LangGraph, then compares open-source harnesses, Temporal's durable orchestration and observability tools. The assigned DSPy paper turns prompt templates into programs optimized against a metric."
description: "A page-linked guide to the CS329Z Lecture 05 Frameworks & Orchestration slides, a digest of the DSPy paper, and an optional exercise comparing a hand-built pipeline with a DSPy version."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 5 (Oct 7, Frameworks & Orchestration) looks at frameworks just as students start hand-building HW1: DSPy's signatures, modules and optimizers; LangGraph's state, nodes and edges; then a tour of open-source harnesses such as mini-SWE-agent, OpenHands and Pi, Temporal's durable orchestration, and observability tooling. The project proposal is due Friday, Oct 9.

The assigned readings are Khattab et al.'s [DSPy](https://arxiv.org/abs/2310.03714), the LangGraph docs and Arena's HarnessTax. This post digests DSPy: prompt templates graduate from handcraft into compilable, optimizable programs. Hand-building while reading framework papers is the tension of this lecture. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 05 slide guide

<div class="slide-reader" data-slide-reader data-pages="132" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf">
<p>132 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–18: Engineering combines data, systems, and evaluation

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=1" data-slide-page="1">Slides 1–18</a>

The opening compares hand-written backprop with PyTorch: abstractions save work, while underlying behavior still matters. Data, system/model, and evaluation/metric form three pillars. Frameworks then occupy positions across models, workflows, and agents; observability and reliable execution form additional layers.

Identify the missing layer before choosing a framework: model interface, composable workflow, agent harness, or recoverable execution. A broad feature list does not establish that a tool addresses your failure mode.

### Pages 19–51: DSPy exposes contracts, composition, and measured optimization

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=19" data-slide-page="19">Slides 19–51</a>

A signature declares inputs and outputs, a module fulfills that contract, and an optimizer improves the program against data and a metric. Many pages are backup screenshots for a live demo: inconsistent fields lead into composition, datasets, scoring, optimization, and agent modules.

Use pages 22 and 51 as structural anchors before inspecting the code screenshots. The paper digest below uses the original paper’s term teleprompter; the lecture uses optimizer. You still own the dataset, metric, and held-out test split.

### Pages 52–77: LangGraph makes shared state and control flow explicit

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=52" data-slide-page="52">Slides 52–77</a>

State is the shared workspace, nodes are functions that read and update it, and edges define what runs next. Conditional edges branch from results. The slides build start/end nodes and a workflow, then an LLM/tool loop. Model decisions still operate inside a programmed graph and state representation.

As an original exercise, separate email retrieval, drafting, and confirmation into nodes. Make “do not send before confirmation” an inspectable state condition. Compare abstractions according to control needs rather than assuming one-to-one feature equivalence with DSPy.

### Pages 78–89: Harnesses choose tools, history, and execution behavior

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=78" data-slide-page="78">Slides 78–89</a>

Mini-SWE-agent, OpenHands, Pi, and OpenClaw illustrate choices in tools, linear/event/tree history, independent subprocesses versus persistent terminals, and scheduled memory work. These are lecture snapshots; use them to identify design dimensions rather than current product specifications.

These choices show up in scores. [Page 86](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=86) cites an arena.ai comparison on Terminal-Bench 2: the same Claude Haiku 4.5 succeeds 31.1% of the time in Codex and 47.8% in Pi. Hold the harness fixed before comparing models, or you cannot tell where an improvement came from. [Pages 87–88](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=87) go further with Meta-Harness, where an agent reads earlier candidates' code, traces, and scores, proposes a new harness, and evaluates it, treating the harness itself as the object of optimization. Lecture 09 returns to this idea.

A persistent shell can retain a directory and environment variables; independent subprocesses cannot be assumed to do so. Two commands with a state dependency provide a simple check of the harness’s actual execution model.

### Pages 90–122: Durable orchestration and telemetry support recovery

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=90" data-slide-page="90">Slides 90–122</a>

[Pages 92–93](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=92) first explain why this layer is needed: agents now work for long stretches, and a crash or API timeout halfway through wastes every completed step, while missing logs leave nothing to debug. These are old software-engineering lessons that carry over to agents. Temporal separates workflows from fallible activities, with a server retaining execution history, queues, and state while workers perform tasks. Backup demo pages cover retries and server-managed timing. MLflow, LangSmith, and Langfuse appear as observability tools for investigating calls and state.

Retries still require side-effect design. In an original email example, a service may accept a message while its response is lost. Repeating the operation can send twice. Record operation identity and outcome before deciding whether a retry is safe; durable orchestration does not automatically make arbitrary external effects occur once.

### Pages 123–132: Use traces and domain tasks to justify complexity

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=123" data-slide-page="123">Slides 123–132</a>

The conclusion frames engineering as build, run, evaluate, and improve: start simple, expose failures, set timeouts, retries and budgets, and compare representative and edge cases. A generic coding benchmark may not represent a domain assistant.

A Traditional Chinese workplace assistant needs questions in that language, internal terminology, permission differences, and realistic tool failures. Preserve baseline traces and outcomes when changing frameworks, then report which failures improved and at what latency cost.

## Reading | DSPy: improve multi-stage programs with data and metrics

[Required reading](https://arxiv.org/abs/2310.03714)

### TL;DR

Signatures define inputs and outputs, modules compose calls, and optimizers use data and metrics to select demonstrations or other parameters across a pipeline.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | ICLR 2024 experiments in math and multi-hop QA compare few-shot, bootstrapped, and ensemble configurations. |
| Boundary | Historical scores depend on models and splits; compilation uses model calls and can optimize the wrong objective if the metric is flawed. |
| Reading value | Useful once data and metrics exist for improving a multi-stage program. |

### Background

Hand-written prompts mix task intent, examples, formatting, and execution. DSPy separates these concerns so programs can be improved against data.

### Intermediate guide

**DSPy: declarative modules and measured optimization**

The DSPy paper opens with a provocation: today's LM pipelines are hard-coded prompt templates, long strings accumulated through trial and error. It wants a systematic method instead: abstract pipelines as text-transformation graphs, with LMs invoked through **declarative modules**. Three moving parts: a signature declares inputs and outputs in natural language (e.g. `user_question -> search_query`) without saying how to coax the model; a module implements a signature with learnable parameters — the built-in ChainOfThought just prepends a rationale field and delegates to Predict, sketched in about a dozen lines; a teleprompter optimizes by filling each module with bootstrapped demonstrations. Modules carry parameters and teach themselves — generating and collecting demonstrations, composing prompting, finetuning, augmentation, and reasoning techniques.

In practice you write a signature plus a target metric, and the compiler tunes in three stages: generate candidate demonstrations (run the pipeline, keep traces that pass the metric), pick demonstration sets with random search or Optuna, and optionally rewrite program structure (e.g. ensembling compiled copies behind a majority vote). The paper reports results under its own models, data, and evaluation settings: a few lines of DSPy lift GPT-3.5 to 82% accuracy on [GSM8K](https://arxiv.org/abs/2110.14168); the two-hop retrieval program's ensemble answers 45.6% of the [HotPotQA](https://arxiv.org/abs/1809.09600) test set (that cell covers half the test set, per the paper's cost note); and a 770M-parameter T5 program distilled using 200 labeled inputs and 800 unlabeled questions scores 39.3% answer exact match on dev. Small models with good systems beating big models with bad ones — [Lecture 1](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems-en)'s thesis with reproducible numbers.

| Layer | What you describe | What it contributes |
|---|---|---|
| Signature | Input and output fields | Declares the transformation needed |
| Module | An implementation of the signature | Arranges model calls and parameters |
| Teleprompter / optimizer | Training inputs and a validation metric | Selects demonstrations to improve the pipeline |

### Deeper points

Keep final test examples outside compilation. Inspect module and end-to-end errors, and check whether demonstrations leak answers.

### Reviewer in one sentence

It supplies an optimizable program abstraction whose gains depend on data and metrics.

### Your take-away

Replace one query-generation stage in a separate experiment, evaluating held-out quality and cost; keep it separate from the framework-free HW1 submission.

## Frameworks choose an abstraction level

This lecture's title names it: what frameworks abstract versus what you built from scratch. LangChain, LangGraph, and LlamaIndex each pick a different abstraction altitude; DSPy picks "you don't even hand-write prompts." The brake pedal from Anthropic's Building Effective Agents (a [Lecture 6](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en) reading) still applies: frameworks save startup time and charge debugging visibility. Because HW1 bans frameworks, you hand-build every part first; this lecture then asks the reverse question: same agent, scratch versus DSPy builds — what did the framework hide, and what did it decide for you?

## What to do: swap one stage of your hand-built pipeline into DSPy

**What to do**: this is an optional exercise, not homework — HW1 itself bans frameworks, so don't submit the DSPy version. Take your hand-built RAG from [Lecture 3](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en) (or the email retrieval pipeline you're starting for HW1), lift exactly one stage (say query generation) into a DSPy signature, compile against twenty questions with accuracy as the metric, and compare against the hand-built score plus your time spent. The score gap matters less than three written lines: what decision the framework made for you, which decision you disagree with, and when you would switch back. Those three lines help you read this lecture — and can seed the methods paragraph of Friday's proposal.

## Where it sits in the course

Lecture 5 shows which decisions a framework makes for you; HW1 makes you build each part by hand first. [Lecture 6](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en) returns to design patterns: the composable skeletons available to workflows and agents. DSPy's optimizers return in Lecture 9.

## Course material for this lecture

- Official slides (PDF): [Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- Assigned readings: Khattab et al., "DSPy" (digested here); LangChain, "LangGraph Overview"; Arena.ai, "HarnessTax"
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 5 (Wed Oct 7), previously part of the "Week 3: plug tools in, take frameworks apart" guide; earlier entries below predate the split.
- 2026-10-29: Rechecked every section's page range against the Lecture 04/05 PDFs; added the three-level tool-failure taxonomy and τ-bench version history (L04 pp. 64–67), the same-model harness gap and Meta-Harness (L05 pp. 86–88), and the motivation for durable orchestration (L05 pp. 92–93).
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Added an MCP connection diagram and DSPy layer comparison to visualize existing explanations; no factual refresh.
- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 4: Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en), [Lecture 6: Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Lecture slides: [Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
