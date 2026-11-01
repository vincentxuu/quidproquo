---
title: "Before Building Agents, Learn How Models Read and Write | Stanford CS329Z Lecture 2"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 3
tldr: "Lecture 02 runs from decoding, attention and linear attention through the training pipeline, KV cache, test-time scaling, structured output and context engineering. The assigned Anthropic guide on context engineering asks what the model should see at each step."
description: "A page-linked guide to the 176 slides of CS329Z Lecture 02, LLMs for Builders, from decoding and attention to structured output and context engineering, plus a digest of Anthropic's context engineering guide."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 2 (Sep 28, LLMs for Builders) is a crash course in model internals for agent builders: how decoding picks tokens, how attention reads earlier text, why context length has a cost, and why structured output is a contract between components. Every engineering trade-off later in the course comes back to these limits.

The assigned readings are Vaswani et al. on the Transformer, Katharopoulos et al. on linear attention, and Anthropic's [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). This post digests the last one; the mechanisms of the first two are covered in the slide guide. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 02 slide guide

<div class="slide-reader" data-slide-reader data-pages="176" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf">
<p>176 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–23: From probability distributions to decoding

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=1" data-slide-page="1">Slides 1–23</a>

The opening locates this course at the application layer, then asks what a model actually produces. A sequence probability decomposes into conditional next-token probabilities. The animated “The class was about…” example shows multiple possible continuations; decoding chooses among them. Greedy selection takes the most likely token, top-k and top-p restrict sampling candidates, and beam search retains alternative sequences.

For an agent, this affects the stability of tool selection and arguments. Lower temperature can reduce sampling variation; it cannot validate arguments. Repeat the same input with a fixed tool schema and record wrong-tool choices separately from malformed output.

### Pages 24–62: How a Transformer reads earlier tokens

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=24" data-slide-page="24">Slides 24–62</a>

A sequence of animated diagrams builds a decoder-only Transformer: token and position embeddings, attention and feed-forward layers, then an LM head that predicts the next token. Queries and keys determine attention weights; those weights mix values. A causal mask excludes future tokens during training, and multiple heads operate in different representation subspaces.

Follow the changing arrows rather than treating every animation frame as a separate concept. When a model generates tool arguments, tool definitions and user constraints must be present in the context it can access. The architecture provides a route to that information, without guaranteeing correct use.

### Pages 63–91: Linear attention trades stored detail for efficiency

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=63" data-slide-page="63">Slides 63–91</a>

Full softmax attention retains keys and values for earlier positions. Linear attention updates a compressed state and lets new tokens interact with that state. The slides animate state retention and replacement, compare scaling behavior, then discuss long-context limitations and hybrid architectures.

A long advertised window does not establish reliable access to every detail. As an original exercise, move the same constraint to the beginning, middle, and end of a long document in your working language. Compare answer correctness and latency before choosing a model for that workload.

### Pages 92–118: Training stages shape what the model has learned

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=92" data-slide-page="92">Slides 92–118</a>

Starting with next-token cross-entropy, the lecture moves through pretraining data cleaning, deduplication and mixing; domain-focused midtraining; and instruction and preference post-training. Human preference labels can be unreliable or conflicting. Verifiable rewards use tests, proofs, or environment state, but the verifier still needs to represent actual task success. SWE-smith supplies the agent-training example.

Fluent writing and successful execution in your tool environment require separate acceptance checks. Give the model a failed tool result and inspect whether it changes arguments, changes strategy, or requests assistance.

### Pages 119–137: Prefill, decode, and the KV cache

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=119" data-slide-page="119">Slides 119–137</a>

Prefill processes the input; decode generates output step by step. Retained keys and values form the KV cache, allowing later generation to reuse earlier computation. This motivates measuring time to first token, output speed, and total duration separately. Speculative decoding uses a smaller draft model to propose continuations for a target model to verify.

For a multi-turn agent, inspect oversized tool results and repeatedly rewritten stable prefixes. These slides explain the mechanism; provider-specific cache eligibility and pricing require separate documentation. A KV cache, an application answer cache, and stored user memory serve different purposes.

### Pages 138–148: Extra inference compute needs a selection method

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=138" data-slide-page="138">Slides 138–148</a>

The lecture compares longer reasoning with repeated sampling. More candidates can increase the chance of finding a good answer, but a verifier or aggregation method must select it. Self-consistency uses agreement across reasoning paths and can still inherit shared errors. The jacket-price example asks readers to check the base of each percentage change rather than the length of the explanation.

An original exercise is to divide the same budget between one longer attempt and several shorter attempts. Keep the scoring rule fixed and measure success, cost, and latency together.

### Pages 149–159: Structured output supplies a component contract

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=149" data-slide-page="149">Slides 149–159</a>

Compound systems need a field-level contract between components. This section introduces constrained decoding, DSPy signatures, and tool calls. Restricting allowed tokens helps maintain structure; schema validity does not establish factual correctness or authorization.

In an original email example, extracting a valid meeting intent from “Thursday works” still leaves the date, time zone, and recipient unresolved. Validate structure, then meaning and required information, before dispatching execution.

### Pages 160–176: Context engineering preserves decision-relevant information

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=160" data-slide-page="160">Slides 160–176</a>

The final section treats system instructions, history, memories, tool results, and attachments as one context budget. It covers avoiding bloat, retrieving on demand, preserving reusable prefixes, comparing choices with evaluations, and retaining critical constraints through compaction. Recursive LMs introduce another approach to operating on externally held material. The summary leads into RAG.

Preserve the complete event record, then construct a shorter model input. Check that goals, unfinished work, and user prohibitions survive. This gives token reduction a concrete acceptance condition and connects to the Anthropic context-engineering reading below.

## Reading | Anthropic: what should the model see at each step?

[Required reading](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### TL;DR

Context engineering manages instructions, tools, history, and evidence together, using retrieval, compaction, and isolation to retain useful signals.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | First-party engineering guidance on long-running tasks, tool design, and context strategies. |
| Boundary | Strategies trade information loss against retrieval and coordination costs; the article provides no guaranteed effect size. |
| Reading value | Useful for designing context and tool inputs in long tasks. |

### Background

A long-running task accumulates observations each turn, moving the design problem beyond the wording of one prompt. Capacity alone does not establish correct use of every passage.

### Intermediate guide

**Further reading: context is a budget, not a bucket**

Anthropic's [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) widens the unit of design beyond prompt wording. Every inference sees a finite state assembled from system instructions, tool definitions, external data, message history, and tool results; the goal is the smallest set of high-signal tokens that still produces the desired behavior. Static context should stay crisp: tools with clear, non-overlapping contracts and token-efficient outputs, plus a few diverse canonical examples rather than an edge-case catalog.

Dynamic context should arrive just in time. Keep lightweight references such as paths, saved queries, and URLs, then progressively disclose only what the next decision needs. Long tasks add three distinct controls: compaction for an overgrown trace, structured notes for durable state outside the window, and subagents for isolating deep exploration. None is free: compaction can erase details whose value appears later, while autonomous retrieval adds latency and can send the agent down dead ends. This is first-party applied guidance, not a benchmark paper; it supplies a design checklist rather than a promised accuracy gain.

The connection to Lecture 3 is operational. In its RAG exercise, do not stop at “retrieve top-k and paste it.” Hold the retriever fixed, vary top-k, chunk length, tool-result shape, and history pruning, then measure answer quality, tokens, and latency. A second variant can expose only source identifiers first and let the agent fetch full passages on demand.

### Deeper points

Define non-discardable fields before summarizing: constraints, progress, unresolved issues, and source pointers. A subtask summary should allow evidence recovery.

### Reviewer in one sentence

It turns context selection into state design with costs and acceptance conditions.

### Your take-away

With model and questions fixed, compare full-history replay, summaries, and on-demand retrieval, including compliance with earlier constraints.

## Where it sits in the course

Lecture 2 treats the model as a component with costs and limits, which every later design assumes. [Lecture 3](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en) moves to RAG: knowledge the model lacks has to be retrieved into context. Lecture 6's context-management patterns extend this lecture's context engineering to long-running agents.

## Course material for this lecture

- Official slides (PDF): [LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)
- Assigned readings: Vaswani et al., "Attention Is All You Need"; Katharopoulos et al., "Transformers are RNNs"; Rajasekaran et al., "Effective Context Engineering for AI Agents" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 2 (Mon Sep 28), previously part of the "Week 2: workflows, agents, and a first hand-built RAG" guide; earlier entries below predate the split.
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Added a workflow/agent comparison and RAG architecture diagram to visualize existing explanations; no factual refresh.
- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.
- 2026-09-12: Added substantive guided readings of Effective Context Engineering and ColBERT.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 1: Compound AI systems](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems-en), [Lecture 3: RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Lecture slides: [LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Anthropic, Effective Context Engineering for AI Agents (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
