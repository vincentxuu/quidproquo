---
title: "(Finale) Open Problems and Demo Day: Computer Use, Web Agents, and Pre-Launch Checks | Stanford CS329Z Lecture 19"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 20
tldr: "Per the schedule, Lecture 19 closes the course with multimodal agents, web and computer-use agents, science agents, long-running architectures, production and observability (tracing, monitoring, cost management), and open problems in reliability, scalability and interpretability. The additional readings are OSWorld and WebShop; the final Demo Day falls in exam week, Dec 7–11."
description: "A preview of Stanford CS329Z Lecture 19, Frontiers & Open Problems: digests of OSWorld and WebShop, a pre-Demo Day checklist, and a retrospective of every lecture in the series."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

The last lecture (Dec 2, Frontiers & Open Problems) has no assigned main reading. The schedule lays out multimodal agents, web and computer-use agents, science agents, long-running architectures, and production tracing, monitoring and cost management, then closes with open problems in reliability, scalability and interpretability. The final report and system demo fall in exam week, Dec 7–11, with time and place still to be announced; project topics are self-chosen under the current official requirements and tie back to the course's core themes.

The additional readings are Xie et al.'s [OSWorld](https://arxiv.org/abs/2404.07972) and Yao et al.'s [WebShop](https://arxiv.org/abs/2207.01206). This post digests both, followed by a pre-Demo Day checklist and a retrospective of the whole series. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

## Reading 1 | OSWorld

Source: [OSWorld](https://arxiv.org/abs/2404.07972)

### TL;DR

OSWorld supplies reproducible computer tasks and execution-based checking of environmental outcomes rather than only textual answers.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can computer-use agents be evaluated in real operating systems? |
| Evidence and scope | The 12.24% result concerns the original paper's best tested model, not today's computer-use ceiling. |

### Domain background

Computer tasks span application state; final text cannot establish completed files, settings, or workflows.

### Intermediate guide

**Method.** Supply natural-language tasks in resettable OS environments, allow model actions, and check outcomes using executable tests.

**Evidence and result.** The original study identifies GUI grounding and operational knowledge as bottlenecks; its12.24% result retains model and environment conditions.

### Deeper points

- Intermediate screens in cross-application tasks do not establish a correct final state; inspect actual outcomes.
- Initialization must be reproducible or previous windows and files alter task difficulty.

### Reviewer’s one-line verdict

Verify computer actions against the environment.

### Your take-away

Verify GUI tasks from actual files or application state and record the initial environment.

## Reading 2 | WebShop

Source: [WebShop](https://arxiv.org/abs/2207.01206)

### TL;DR

WebShop evaluates search and choice from natural-language shopping requests in a simulated store, connecting language to web actions.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can conditions in shopping requests be grounded in product selection? |
| Evidence and scope | The 29% is the original study's best-model task success; a simulated store is not live commerce or current capability. |

### Domain background

Shopping requires mapping language constraints to web choices; similar products need not satisfy all constraints.

### Intermediate guide

**Method.** Models search, inspect attributes, and choose products from instructions; the environment checks products against user constraints.

**Evidence and result.** The original best model's29% success versus 59% for human experts shows a gap in grounding shopping constraints through sequential actions.

### Deeper points

- Search and choice can be learned separately, but final acceptance must check product conditions rather than keywords alone.
- Simulation fixes some real-web variability, so success does not establish live-transaction reliability.

### Reviewer’s one-line verdict

Choosing correctly requires checking each constraint.

### Your take-away

Verify product attributes and user constraints instead of equating clicks or fluent text with choosing correctly.

## What to do: the Demo Day checklist

**What to do**: turn tracing fully on and keep one replayable trace per rehearsal. Watch three things in monitoring: error rate, latency, and token spend. Put a hard cap on cost with automatic cutoff past the limit. Keep high-risk tools off by default and enable them by hand only for the live demo. Finally, prepare one failure case — a failure mode from your midway report, told well, persuades better than successes alone.

## Series retrospective: one post per lecture

- [Course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- [Lecture 1: Compound AI systems](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems-en): Compound AI systems: how models, data and tools fit together
- [Lecture 2: LLMs for Builders](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders-en): Before Building Agents, Learn How Models Read and Write
- [Lecture 3: RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en): Hand-Build Your First RAG: From Chunking to Agent-Decided Retrieval
- [Lecture 4: Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en): Plug Tools In: Function Calling, MCP, and Tool Failures
- [Lecture 5: Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks-en): Take Frameworks Apart: DSPy, LangGraph, and the Harness Gap
- [Lecture 6: Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en): Tell Workflows from Agents, Then Learn to Think While Acting
- [Lecture 7: Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en): Make Agents Remember What Matters: MemGPT, Letta, Mem0, and Generative Agents
- [Lecture 8: Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en): Go Solo or Call a Meeting: Division of Labor, Communication, and Failure in Multi-Agent Systems
- [Lecture 9: Optimization](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization-en): Change the Prompt, the Weights, or Think Longer: Three Axes of Agent Optimization
- [Lecture 10: Terminal-Bench guest lecture](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en): After the Agent Says Done, Verify It: The Terminal-Bench Guest Lecture
- [Lecture 11: Data for Agentic Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents-en): What Data Do Agents Need? Traces, Demonstrations, Feedback, and the Data Flywheel
- [Lecture 12: Data Selection & Quality](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en): More Data Is Not Always Better: Selection, Validation, and Quality
- [Lecture 13: Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks-en): Don't Let the Score Fool You: Write the Full Evaluation as a 4-Tuple
- [Lecture 14: LLM-as-Judge & Evaluation Infrastructure](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en): Let a Model Judge: Grader Choice, Judge Bias, and Calibration
- [Lecture 15: Agent Safety & Guardrails](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety-en): Put Guardrails on the Agent: Privacy, Prompt Injection, Sandboxes, and Permissions
- Lecture 16 (Nov 16): guest lecture, topic to be announced; added once published.
- [Lecture 17: Coding & Software Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents-en): For a Coding Agent, Build a Good IDE First
- [Lecture 18: Proactive Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en): From Waiting for Instructions to Acting First: Proactive Agents and General User Models
- [Lecture 19: Frontiers & Open Problems](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day-en): (Finale) Open Problems and Demo Day: Computer Use, Web Agents, and Pre-Launch Checks
- Nov 23 and Nov 25: Thanksgiving recess, no class.

## Where it sits in the course

Lecture 19 closes the course: from Lecture 1's compound systems through tools, loops, memory, division of labor, optimization, data, evaluation and safety, back to how far agents get on real computers and websites. The series retrospective below doubles as a map for final review.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Additional readings: Xie et al., "OSWorld: Benchmarking Multimodal Agents in Real Computer Environments" (digested here); Yao et al., "WebShop" (digested here)
- Finals: Final Report Due & Final System Demo, Dec 7–11, time TBA
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 19 (Wed Dec 2), previously part of the "Week 11: from waiting for instructions to acting first" guide; earlier entries below predate the split.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-12: Made the Week 10 Thanksgiving recess explicit in the series map and course-material checklist so the Week 9-to-11 jump no longer looks like a missing post.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 18: Proactive Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
