---
title: "Berkeley CS288 Part 5: Inference-time Compute, Reasoning, and Embodied Agents"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, ai-agent, reasoning, multimodal-ai, llm]
lang: en
type: guide
difficulty: 深度
tldr: "Units 15–18 place NLP models inside perception, reasoning, tool, and environment loops; the question shifts from next-token prediction to allocating inference compute and validating multi-step action."
description: "A guide to CS288 Embodied Perception, Inference-time Compute, Agent Reasoning, and Embodied Agents, with explicit public-material boundaries."
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 5 }
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-agents)

[Units 15–18](https://cal-cs288.github.io/sp26/) place language models in a longer decision loop: Embodied Perception, Inference-time Compute, Agent Reasoning, and Embodied Agents. Inputs may include visual or environmental state; outputs may be tool calls or actions rather than text.

## Inference-time compute is resource allocation

More test-time computation can mean more candidates, longer reasoning traces, search, verification, or revision. The useful comparison asks whether added compute improves verifiable outcomes under a fixed task and budget. Longer output alone is not deeper reasoning.

Choose one primary budget—tokens, wall-clock time, model calls, or money—and retain each observation, action, tool result, and final answer. Without traces, model, tool, and environment failures collapse into one label.

## Reasoning agents add state and tools

Single-turn QA evaluates an answer. Agent evaluation also needs task completion, wasted steps, tool failures, cost, and safety constraints. Hold tool availability, permissions, initial state, and stopping conditions constant before comparing agents.

## Embodiment propagates errors

Embodied perception constructs state from observations; an embodied agent converts a language-level plan into action. Perception errors propagate through planning and execution. Preserve replayable observation-action logs and place human gates before high-impact actions.

The [official schedule](https://cal-cs288.github.io/sp26/) also includes guest sessions on computer-use agent safety, memory, continual learning, and speech. [Course Info](https://cal-cs288.github.io/sp26/course_info/) limits recordings to enrolled students and Cal-affiliated auditors, while the schedule provides no anonymous slides for some sessions. This series records their place in the curriculum without reconstructing them.

## Finish with a staged project

The [Course Project](https://cal-cs288.github.io/sp26/project/) requires an abstract, midpoint report, presentation, and final report. A self-study project should keep the same checkpoints: define the question and baseline, submit a midpoint failure analysis, and only then consolidate results. Team matching, staff feedback, and course compute credits are not public, so arrange peer review and a compute ceiling yourself.

## References

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Course project](https://cal-cs288.github.io/sp26/project/)
- [Course information and recording access](https://cal-cs288.github.io/sp26/course_info/)
