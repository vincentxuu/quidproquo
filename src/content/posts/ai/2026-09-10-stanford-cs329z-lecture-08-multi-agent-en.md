---
title: "Go Solo or Call a Meeting: Division of Labor, Communication, and Failure in Multi-Agent Systems | Stanford CS329Z Lecture 8"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 9
tldr: "Lecture 08 first asks whether a single agent is enough, then compares orchestrator, swarm and hybrid patterns, communication through handoffs, message boards and A2A, and coordination infrastructure such as task ledgers, shared memory and worktree isolation, before tracing why multi-agent systems fail. The readings run from AutoGen to MAST, the single-agent counterargument and DyLAN."
description: "A page-linked guide to the CS329Z Lecture 08 Multi-Agent Systems slides, digests of AutoGen, the MAST failure taxonomy, the single-agent counterargument and DyLAN, and a two-agent email example for checking a division of labor."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

When one model cannot solve a problem, the instinct is to bring in more models and split the work: one writes code, one runs it, one looks for mistakes, like a meeting. Anyone who has sat through meetings knows they have costs: who speaks first, who writes the conclusion, who owns the error. Models in a meeting are no different, and their mistakes are quieter: an upstream agent's hallucination becomes a fact the downstream agent trusts.

Lecture 8 (Oct 19, Multi-Agent Systems) assigns Wu et al.'s [AutoGen](https://arxiv.org/abs/2308.08155), Cemri et al.'s MAST failure taxonomy, and Kim et al.'s work on scaling agent systems. This post digests AutoGen and MAST, plus the single-agent counterargument and DyLAN. The prerequisites are [Lecture 6's loop](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en) and [Lecture 7's memory tiers](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en). The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 08 slide guide: design the team, then inspect its failures

<div class="slide-reader" data-slide-reader data-pages="92" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf">
<p>Lecture 08: 92 PDF pages. Use the links below to compare the source.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf" target="_blank" rel="noopener noreferrer">Original PDF</a></p>
</div>

### Pages 1–15 — Decide whether work is separable before adding agents

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=1" data-slide-page="1">PDF pages 1–15</a>

The opening places models, workflows, agents, and multi-agent systems on a complexity spectrum. Parallelism and role separation bring messaging, integration, and error-propagation costs. Ask whether this task can actually be decomposed. In the email example, a single message and simple question may benefit from a shorter single-agent evidence path.

### Pages 16–29 — Four orchestration patterns: follow information flow

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=16" data-slide-page="16">PDF pages 16–29</a>

Independent agents aggregate at the end; centralized orchestration delegates and integrates; decentralized agents collaborate directly; hybrid systems mix global direction with local communication. DyLAN illustrates dynamic participation. Independent source retrieval may parallelize, while final wording still needs a single integrator. Choose based on dependencies and cost.

### Pages 30–49 — Communication includes control ownership

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=30" data-slide-page="30">PDF pages 30–49</a>

AutoGen connects roles through conversation. A handoff transfers subsequent control; an agent used as a tool returns bounded work to its caller. Message boards share artifacts, while A2A introduces capability descriptions and cross-agent communication. Reliable transport does not guarantee faithful evidence: dropping “possible” from an email summary remains an error.

### Pages 50–68 — Coordination makes commitments inspectable

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=50" data-slide-page="50">PDF pages 50–68</a>

Task ledgers record objectives, assignments, progress, and open questions. Shared memory preserves experience; worktrees isolate edits. Role division, resource division, and negotiation address dependencies. Two agents reading the same conversation can still change incompatible interfaces. Establish owners and handoff contracts, then verify integration after merging.

### Pages 69–82 — Agreement does not replace external verification

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=69" data-slide-page="69">PDF pages 69–82</a>

Failures span system design, inter-agent interaction, and verification. Coordination problems, conformity, and incompatible goals explain why local success may not produce global success. Read each chart with its dataset and experimental conditions, rather than generalizing one study to all multi-agent work. Return to original observations, shared interfaces, and end-to-end outcomes.

### Pages 83–92 — Engineering case study: autonomy needs useful feedback

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=83" data-slide-page="83">PDF pages 83–92</a>

The case connects specialist roles, Git-synchronized task state, and worktrees. Tests, error summaries, searchable logs, and progress reports must help agents identify the next step. Weak tests let multiple agents efficiently pursue the wrong objective. **Check:** all branches pass their local tests; may the result be released? **Answer criteria:** integrated checks in a common environment and acceptance against the original requirement remain necessary.

## From conversation to coordination: Lecture 08's three layers

[Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf) separates orchestration, communication, and coordination. Orchestration divides work; communication moves information; coordination manages dependencies, commitments, and shared resources. Being able to exchange messages establishes only the second layer.

| Pattern | Intermediate information | A useful condition to test | Main cost |
|---|---|---|---|
| Independent | Separate work, final aggregation | Independent sources or candidate solutions | Cannot use intermediate findings from peers |
| Centralized | Orchestrator delegates and collects | One owner must integrate results | Central bottleneck |
| Decentralized | Direct peer exchange | Broad exploration and self-selected tasks | Commitments and conflicts become harder to track |
| Hybrid | Central integration, limited peer exchange | Global goals with local dependencies | Rules for direct coordination are necessary |

Communication also distinguishes handoff from agent-as-tool. A handoff transfers control to a specialist who owns subsequent steps. An agent-as-tool handles a bounded request and returns a result while its caller retains control. This determines who owns the final answer; counting model calls does not tell you that.

Coordination needs inspectable state. A task ledger records goals, ownership, dependencies, progress, and blockers. Shared memory preserves experience across tasks. Worktree isolation gives coding agents separate checkouts and branches. Isolation reduces interference during execution; completed changes still need conflict resolution and tests of the combined result. Separate green tests do not establish successful integration.

**Check your understanding:** two agents read the same chat but implement incompatible versions of one interface. Why can integration still fail? **Answer criterion:** distinguish the information channel from resource ownership and interface commitments. Add explicit owners in the ledger, an interface agreement, isolated workspaces, and integration checks.

The lecture groups failures around system design, inter-agent behavior, and verification, and also warns about conformity and incompatible goals. Agreement does not establish stronger evidence; individual success does not establish a shared outcome. A reviewer should inspect original tool results and tests instead of endorsing another agent's summary alone.

## Worked example: two agents organize email

This is an original teaching example. Its numbers are illustrative, not official homework results. The task is to answer, “Which emails support delaying delivery this week?” Claims must be traceable to original messages. A retrieval agent finds evidence; a synthesis agent writes the answer. If the retrieval summary turns “might delay” into “delay confirmed,” fluent synthesis only propagates the error.

Define a handoff contract: every claim includes an email ID, source text, and uncertainty. The task ledger records who completed retrieval and whether counterevidence remains missing. The synthesizer may not promote a tentative claim to a confirmed fact. Final verification checks citations and wording against original emails.

```diagram
title: Evidence survives the handoff
desc: Retrieval passes source evidence and uncertainty to synthesis, then verification checks original emails.
caption: Original teaching example; arrows show artifact flow.
---
<svg viewBox="0 0 440 440">
<path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 200V240" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 312V352" marker-end="url(#arrow)"/>
<rect class="dg-box" x="40" y="16" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="52" text-anchor="middle" dominant-baseline="central">Retrieve original emails</text>
<rect class="dg-box dg-box--accent" x="40" y="128" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="164" text-anchor="middle" dominant-baseline="central">Handoff: ID, text, uncertainty</text>
<rect class="dg-box" x="40" y="240" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="276" text-anchor="middle" dominant-baseline="central">Synthesize within evidence</text>
<rect class="dg-box" x="40" y="352" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="388" text-anchor="middle" dominant-baseline="central">Verify against original emails</text>
</svg>
```

Suppose a frozen baseline succeeds on twelve of twenty held-out questions. Inspecting separate development examples reveals that most failures discard uncertainty at the handoff. First change the handoff prompt and add one successful demonstration. A rerun on the held-out set succeeds on sixteen questions: success increases from 60% to 80%, or twenty percentage points. This is a comparison on illustrative data; a small sample does not guarantee the same future gain. Once those questions have been repeatedly used to choose versions, reserve another unseen set for final acceptance.

Next examine cost and remaining traces. If the search tool never returned the relevant email, another reviewer cannot invent missing evidence: inspect queries and indexing first. If a correct candidate exists but selection fails, test more candidates with a verifier. Splitting agents, editing prompts, and training weights should each target an identified bottleneck through a controlled comparison.

**Synthesis check:** after expanding to three agents, each reports success but the final answer remains wrong. What should you check before adding agents? **Answer criterion:** compare the end-to-end answer with original emails and locate the handoff where information changed. Inspect the ledger, contract, and evaluator. Expand only after identifying a separable bottleneck and measuring benefits against coordination costs. A failure alone cannot establish a need for fine-tuning.

## Reading 1 | AutoGen

Source: [AutoGen](https://arxiv.org/abs/2308.08155)

### TL;DR

Conversable agents unify messaging and replies; conversation programming defines computation and control while admitting humans and tools.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can roles exchange feedback without a bespoke controller for every application? |
| Evidence and scope | This is the paper-era framework; ALFWorld results concern its environment and models, not universal multi-agent superiority. |

### Domain background

Multi-role applications need rules for delegation, tool execution, and termination; role names alone establish none.

### Intermediate guide

**Method.** Define each role's model, human, and tool capabilities, then register replies; messages and termination conditions advance the workflow.

AutoGen rests on two abstractions, and the [open-source implementation](https://github.com/microsoft/autogen) is there to play with. First, conversable agents: every agent receives messages, acts, and replies, with back ends drawn from LLMs, humans, tools, or mixes. The two built-ins do most of the work: AssistantAgent (the LLM engine that thinks and writes) and UserProxyAgent (the proxy for people and tools that runs code, returns results, and fetches a human when needed).

Second, conversation programming: complex flows are written as conversations between agents rather than pipelines. Computation (what to do on receiving a message) and control flow (who gets the next message, when to stop) both revolve around the dialogue. The machinery is a unified send/receive plus generate_reply, with auto-reply on top: an agent that receives a message replies automatically unless a termination condition fires.

Control comes in two flavors, code and natural language mixed. Natural-language control lives in the system message — fix errors and resubmit, reply TERMINATE when done. Programmatic control lives in Python — max reply rounds, tool-execution logic. The two convert into each other: one LLM call inside code switches to natural language, one LLM-proposed function call switches back.

One memorable application is [ALFWorld](https://arxiv.org/abs/2010.03768): when a two-agent setup stalled in repetitive error loops, adding one grounding agent that supplied commonsense knowledge lifted success rates by 15% on average. The value of a team is not headcount — it is someone covering the job everybody ignores.

**What to do**: do not split yet. Run your HW1 email assistant over twenty questions and sort failures into two piles: one wrong step, everything after it wrong. Only when the same division boundary keeps reappearing (say code-writing and code-checking contaminating each other) do you cut along it into a second agent. Splits need failure evidence, not a pretty org chart.

This lecture's title names it directly: coordination and error propagation. Team architectures pay three bills. The first is handoff: agents pass not just answers but where things stand and why. Drop that context and the downstream agent repeats the mistake.

The second is error amplification: in a pipeline nobody checks, every extra stop is another chance to treat hallucination as fact. AutoGen rebuilds [OptiGuide](https://arxiv.org/abs/2307.03875) — originally a supply-chain Q&A system — as a multi-agent team: a Commander coordinating a Writer and a Safeguard, keeping checking independent of producing. Neither people nor models check their own work well.

The third is the process itself: who picks the next speaker. AutoGen's built-in GroupChatManager selects the next speaker dynamically with a role-play style prompt, then broadcasts the message to everyone, fitting collaboration with no fixed order. The price is debuggability: you must first reconstruct why it was someone's turn. Human involvement is cost design too: UserProxyAgent's human_input_mode ranges from asking every round to letting people skip. The paper's discussion section openly calls the automation-versus-human-control balance an open problem.

**What to do**: HW1 bans frameworks, so write AutoGen's rules into your own loop: a TERMINATE condition, a maximum round count, and one role that only checks and never acts (borrow the Safeguard). When the checker is unsure, have it stop and ask a person — exactly the human in the loop HW1 requires. Run ten hard questions and log how often the checker intercepts, how often it false-alarms, and how often it hands off to a human. That interception log is ready-made material for the report's coordination-cost section.

**Evidence and result.** Six applications demonstrate that the conversation abstraction supports different workflows, providing evidence about composability and tested task performance.

### Deeper points

- Natural-language control shapes replies while code can fix round limits, execution, and stopping checks.
- Selecting a next speaker does not establish adequate evidence or a correct answer.

### Reviewer’s one-line verdict

It makes collaboration programmable as conversation, while leaving its benefits to measurement.

### Your take-away

Write the handoff fields and stop conditions for two roles, then verify each handoff against original observations.

## Reading 2 | MAST: Why Multi-Agent Systems Fail

Source: [MAST: Why Multi-Agent Systems Fail](https://arxiv.org/abs/2503.13657)

### TL;DR

MAST-Data collects over 1,600 annotated traces across seven frameworks and categorizes system-design, alignment, and verification failures.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can multi-agent failures be organized into actionable categories? |
| Evidence and scope | The taxonomy describes observed failures, rather than a universal causal ranking of architectures. |

### Domain background

A final answer alone rarely distinguishes task design, information handoff, and verification failures.

### Intermediate guide

**Method.** Analyze traces manually to develop categories, then extend annotation across more frameworks and tasks.

**Evidence and result.** The study produces a failure taxonomy that separates superficially similar errors by the responsible layer.

### Deeper points

- One trace can contain multiple failures; the earliest fault may differ from the final scored failure.
- LLM-assisted annotation expands coverage while still requiring human checks and consistent definitions.

### Reviewer’s one-line verdict

A failure taxonomy narrows an investigation without replacing replayable evidence.

### Your take-away

Label your failed traces as design, handoff, or verification problems, then address one category first.

## Reading 3 | Do Not Sleep on Single-Agent Systems

Source: [Do Not Sleep on Single-Agent Systems](https://openhands.dev/blog/dont-sleep-on-single-agent-systems)

### TL;DR

Drawing on OpenHands, the author argues for a strong single agent with general tools and sufficient context before splitting roles.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Do extra roles make work a single agent could already do harder to maintain? |
| Evidence and scope | This is an engineering argument and experience report, not a controlled study of every workload. |

### Domain background

Role splitting creates messaging and state boundaries that may be costly for tightly coupled work.

### Intermediate guide

**Method.** Give one role general tools and sufficient observations, then look for independent, recurring subtask bottlenecks.

**Evidence and result.** The article motivates testing a single-agent baseline without claiming a universal controlled proof of single-agent superiority.

### Deeper points

- Cross-agent summaries compress information and may lose evidence while saving context.
- Fixed role pipelines can constrain exploration order, while general tools leave some choices with one decision-maker.

### Reviewer’s one-line verdict

A strong single-agent baseline reveals what a team actually adds.

### Your take-away

Keep a single-agent baseline and measure coordination benefits and costs on the same tasks.

## Reading 4 | DyLAN

Source: [DyLAN](https://arxiv.org/abs/2310.02170)

### TL;DR

DyLAN selects a team and uses a dynamic interaction network instead of fixing identical participation for every task.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can participation itself become an optimization variable? |
| Evidence and scope | The authors report up to 25% accuracy improvement on selected MMLU subjects; retain subject, model, and baseline conditions. |

### Domain background

Fixed teams pay for the same roles and rounds on every task, even when some members add no new information.

### Intermediate guide

**Method.** Estimate useful team compositions, adjust participation from intermediate messages, and produce an answer from the resulting network.

**Evidence and result.** Experiments show that team selection affects some subjects, so participation need not be a fixed configuration.

### Deeper points

- Dynamic networks need contribution and stopping judgments or may remove roles whose useful evidence arrives later.
- Team selection and communication topology are separate design variables and should be compared separately.

### Reviewer’s one-line verdict

Participation is optimizable, with task-dependent benefits.

### Your take-away

Compare fixed and dynamic teams and record which roles contribute useful information on which tasks.

## Where it sits in the course

Lecture 8 decides whether to divide the work; [Lecture 9](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization-en) then asks, solo or not, whether effort should go into prompts, weights or inference compute. HW1 is due Oct 30, so this is the last full week before submission.

## Course material for this lecture

- Official slides (PDF): [Multi-Agent Systems — Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)
- Assigned readings: Wu et al., "AutoGen" (digested here); Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (digested here); Kim et al., "Towards a Science of Scaling Agent Systems"
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 8 (Mon Oct 19), previously part of the "Week 5: go solo or call a meeting" guide; earlier entries below predate the split.
- 2026-10-23: Added Lecture 08–09 material on coordination, worktrees, weight optimization and evaluation-based choices; added an original worked example, diagram and answer criteria.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, the goal is a framework-free full harness); rewrote the ten-day "Closing HW1" plan and the HW1 hooks in each "What to do" note
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 7: Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en), [Lecture 9: Optimization](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Slides: [Lecture 08: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155)
- Tools: [AutoGen](https://github.com/microsoft/autogen)
