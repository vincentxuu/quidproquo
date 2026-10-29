---
title: "Make Agents Remember What Matters: MemGPT, Letta, Mem0, and Generative Agents | Stanford CS329Z Lecture 7"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 8
tldr: "Lecture 07 sorts agent memory into working, episodic, semantic and procedural types, compares skill libraries, MemGPT-style tiers, reflective consolidation and memory maintenance, and covers memory benchmarks plus forgetting, privacy and over-personalization. The readings run from MemGPT's virtual memory to Letta, Mem0 and Generative Agents."
description: "A page-linked guide to the CS329Z Lecture 07 Agent Memory Architectures slides, digests of MemGPT, Letta, Mem0 and Generative Agents, and a worked example that tests whether a summary preserves an earlier constraint."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 7 (Oct 14, Agent Memory Architectures) asks how an agent keeps the state that matters when context is finite and sessions reset. The slides sort memory into four types, compare four architecture patterns, and close with memory benchmarks and open problems in forgetting, privacy and over-personalization.

The assigned readings are Sumers et al.'s CoALA, Packer et al.'s [MemGPT](https://arxiv.org/abs/2310.08560), and Park et al.'s [Generative Agents](https://arxiv.org/abs/2304.03442). This post digests MemGPT and Generative Agents, plus two implementations, Letta and Mem0. MemGPT brings an operating system's memory hierarchy into the LLM and pages between the finite window and external storage through function calls. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 07 slide guide

<div class="slide-reader" data-slide-reader data-pages="103" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf">
<p>103 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–13: Memory preserves constraints, procedures, and progress

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=1" data-slide-page="1">Slides 1–13</a>

The opening inbox example preserves the constraint “suggest, then wait before acting.” Without memory, long tasks lose procedures, user knowledge, or progress. Memory supports personalization, learning from experience, and continuation across sessions; remembering a name tests only a small part of that behavior.

Resume the email task in another session and check which messages were inspected, which actions remain unapproved, and whether the user requested advice or execution. The original quote example below develops this constraint-preservation problem.

### Pages 14–22: Memory type and storage location are separate dimensions

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=14" data-slide-page="14">Slides 14–22</a>

Working memory is the current context; episodic memory records trajectories; semantic memory stores facts and preferences; procedural memory stores how to perform tasks. Parametric versus context memory supplies another axis: knowledge learned in weights differs from externally retrieved material.

A language preference is semantic memory, a reusable quote-processing procedure is procedural memory, and the full prior conversation is episodic evidence. Identify the needed information before choosing storage.

### Pages 23–29: Decide what, when, and how

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=23" data-slide-page="23">Slides 23–29</a>

What covers facts, procedures, and progress; when covers on-demand tools, events, and background workers; how selects filesystems, databases, or knowledge graphs. Files provide hierarchy and shell search, databases support vector and metadata queries, and graphs represent relationships.

For an original continuation-memory exercise, store provenance, time, unfinished work, and constraints before choosing retrieval. A bare conclusion makes later revision difficult when its evidence becomes stale.

### Pages 30–41: Turn experience into reusable procedures

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=30" data-slide-page="30">Slides 30–41</a>

Voyager retains reusable skills; AWM induces workflows from trajectories and supplies them to later tasks; skill files hold procedures for on-demand reading. Each must extract reusable behavior without freezing accidental conditions from one success.

The lecture flags dynamic environments as a limitation. Change a tool name or page structure and inspect whether the agent treats its stored procedure as something to verify and update.

### Pages 42–49: Tiered memory manages a limited working context

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=42" data-slide-page="42">Slides 42–49</a>

MemGPT gives the model tools to write, replace, and search memory tiers. Working context is already visible; recall and archival storage require retrieval. MemoryOS illustrates short-, medium-, and long-term persona tiers. These systems manage visible information rather than physically enlarging a model’s context window without limit.

Trace an updated preference through the diagram: where does the old value remain, when does the new value enter context, and what resolves the conflict? The MemGPT paper digest below retains its control-flow and experimental detail.

### Pages 50–66: Reflective consolidation and background maintenance

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=50" data-slide-page="50">Slides 50–66</a>

Reflexion and Generative Agents illustrate higher-level reflection over events. Maintenance then handles relationships and change over time. Sleep-time compute prepares outside the live interaction, A-Mem links notes through memory management, and Mem0 uses ADD, UPDATE, DELETE, and NOOP decisions.

In an original example, “prefer mornings” changes to “afternoons only this month.” Store the new statement’s time and scope rather than permanently deleting the older preference or inserting both without qualification.

### Pages 67–94: Evaluate recall and constrained task completion separately

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=67" data-slide-page="67">Slides 67–94</a>

The desiderata are realism, long context, challenge, and verifiability. LoCoMo emphasizes long conversations; PersonaMem includes evolving preferences; LongMemEval-v2 recalls agent-trajectory details; MemoryArena tests multi-stage task completion. Read each result alongside its data, question format, and base model. The slides explicitly note model differences in a filesystem-versus-retrieval comparison.

Correct retrieval can still be misused, and task failures can arise from planning or tools. Score retrieval correctness separately from whether the final action respects constraints, including updated preferences.

### Pages 95–103: Forgetting, trust, and over-personalization remain open

<a href="https://web.stanford.edu/class/cs329z/slides/lecture07.pdf#page=95" data-slide-page="95">Slides 95–103</a>

Future relevance is unknown at write time, so retaining everything and deleting too early both carry costs. Poisoned memory, unnecessary disclosure, and excessive personalization create additional failure modes. The summary connects types, architectures, and evaluation before moving to multi-agent systems.

Test an unrelated programming question when private schedule information exists in memory: does the answer avoid using it? Also test whether corrections and deletion requests affect later retrieval. Appropriate non-use belongs in memory acceptance criteria.

## Reading | MemGPT: a memory hierarchy for finite context

[Required reading](https://arxiv.org/abs/2310.08560)

### TL;DR

MemGPT separates working context, conversational recall, and archival storage, using model-invoked tools and events to manage a finite window.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | ICLR 2024 research on multi-session dialogue, document QA, and nested key-value retrieval. |
| Boundary | The comparisons concern memory management with differing visible information, not an increase in the underlying model’s capabilities or unlimited task reliability. |
| Reading value | Useful for designing recoverable cross-session memory and control flow. |

### Background

A fixed window cannot hold all history, while one summary can omit later-relevant detail. MemGPT retains external information and pages it into a limited working context.

### Intermediate guide

**MemGPT: when memory runs short, borrow from the OS**

If ReAct answers "how to move," MemGPT answers "how to remember." The motive is practical: transformer attention costs grow quadratically with length, and stretching context windows is both expensive and unreliable (models lose track of the middle). MemGPT takes another road: treat the context window as main memory, external stores as disk, and let the model serve as its own memory manager, paging information in and out through function calls.

The architecture has two tiers. Main context holds three prompt sections: read-only system instructions, a writable working context for load-bearing facts like user preferences and persona, and a FIFO message queue. External memory is two databases: recall storage with the full conversation history, archival storage with arbitrarily long outside documents. Near capacity (the paper's example warning line sits at 70% of the window), the system raises a "memory pressure" warning first so the model decides what deserves working context; only at the hard limit does the queue flush half its messages, leaving a recursive summary behind. Control flow runs on events and interrupts — user messages, system warnings, timers — and function chaining lets the model finish multi-step retrieval before replying.

Each experiment targets one pain point. In multi-session dialogue, baseline GPT-4 — shown only a lossy summary of previous sessions — manages only 32.1% accuracy on deep memory retrieval. The same underlying model wired through MemGPT, which pages through the full history, reaches 92.5%. In document QA, fixed-window baselines must truncate as documents grow and accuracy slides with it, while MemGPT pages through archival storage nearly unaffected. Another experiment tests nested key-value retrieval, where each value may be the next lookup's key across several hops: the GPT-4 baseline hits zero accuracy by three nesting levels, and MemGPT remains effective in the tested settings.

**What to do**: As an optional memory-design exercise, split your agent's memory into two ledgers — working context holds only what would break the next move if lost (user goals, confirmed constraints), everything else lives in external storage behind retrieval. Then write one eviction rule: past how many queued messages you summarize, and that summaries keep facts, not small talk. Document the rule and its rationale, then test whether user constraints survive. This is a suggested exercise, not an official grading rule.

### Deeper points

A hierarchy cannot repair a wrong retrieval or a lost constraint by itself. Separate original records, current facts, and tentative conclusions, and test conflicting versions.

### Reviewer in one sentence

Its core contribution is executable control flow for bringing external memory back into use.

### Your take-away

After filling the window, ask about an early constraint and require source recovery; track retrieval effort and final constraint compliance.

## Reading | Letta: build memory from explicit context components

[Additional reading](https://www.letta.com/blog/agent-memory)

### TL;DR

Letta explains message buffers, core, recall, and archival memory, including model-controlled writes and background consolidation.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | Vendor engineering article describing concepts and its architecture, not an independent performance comparison. |
| Boundary | Product APIs can change; a memory hierarchy does not imply automatic reliability, permanent retention, or uniform privacy guarantees. |
| Reading value | Useful for turning memory research into manageable context components. |

### Background

After MemGPT’s control-flow design, builders must still choose what stays visible, what is retrieved, and who can edit it. Letta makes those context components explicit.

### Intermediate guide

**Problem and method.** The article treats memory as context engineering: usable information depends on the tokens in the current input. A message buffer holds recent conversation; core blocks pin user, organization, or task information; recall preserves history; archival storage holds external knowledge. Storage and timely use remain separate steps.

**Control.** Agents can edit writable blocks through tools and retrieve external material. Sleep-time agents can reorganize memory outside the live interaction, changing later context. Unread files do not automatically participate in reasoning.

**Result and interpretation.** This is an implementation perspective useful for asking who owns a block, what happens when it fills, and how corrections propagate. It does not establish a storage-backend performance winner.

### Deeper points

Pinned core blocks continuously consume context; external storage adds retrieval decisions. Background consolidation also needs provenance and version handling when users update the same facts.

### Reviewer in one sentence

Use it as architecture vocabulary and an implementation checklist, then evaluate on your own tasks.

### Your take-away

Trace a preference from its original message into a core block, through correction and deletion, inspecting model input after each step.

## Reading | Mem0: extract, update, and retrieve long-term facts

[Additional reading](https://arxiv.org/abs/2504.19413)

### TL;DR

Mem0 extracts candidate memories, compares them with existing entries, and adds, updates, deletes, or leaves them unchanged; a graph variant represents entity relationships.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | 2025 research preprint comparing memory systems, RAG, and full context on LoCoMo conversational QA, with answer, latency, and token metrics. |
| Boundary | The 26% is a relative LLM-judge improvement over the paper’s OpenAI baseline, not percentage points; cost comparisons use full context as a different baseline. |
| Reading value | Useful for fact updates, retrieval, and cost tradeoffs in conversation. |

### Background

Conversation logs include repeated and irrelevant material. Mem0 builds a retrievable fact layer and explicitly decides whether new information revises an older entry.

### Intermediate guide

**Problem and method.** Extraction uses recent messages and a conversation summary to propose salient facts. An update stage retrieves related memories and chooses ADD, UPDATE, DELETE, or NOOP. The graph variant additionally represents entities and relationships.

**Results.** On LoCoMo, the paper analyzes single-hop, temporal, multi-hop, and open-domain questions. Its abstract reports a 26% relative LLM-as-a-Judge improvement over its OpenAI baseline. Against full context, it separately reports 91% lower p95 latency and over 90% token-cost savings. These use different baselines and depend on the paper’s models and implementation.

**Interpretation.** Extracted facts can avoid replaying much history, but omitting “this month only” still produces a wrong memory. Preserve time and provenance and test whether corrections affect subsequent answers.

### Deeper points

Graphs add relational representation and maintenance cost. Better conversational-memory QA does not establish reliable permissions or progress tracking in long-running tool tasks.

### Reviewer in one sentence

Its useful contribution is an explicit update pipeline, with benchmark claims tied to their baselines and graders.

### Your take-away

Create successive preference and deadline corrections, inspect retrieval after update/deletion, and test appropriate non-use on unrelated tasks.

## Reading | Generative Agents: turn observations into reflection and plans

[Additional reading](https://arxiv.org/abs/2304.03442)

### TL;DR

Agents retain a natural-language memory stream, retrieve by relevance, recency, and importance, and form reflections and plans to support coherent simulated behavior.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | UIST 2023 research with 25 agents in Smallville, human believability assessments, and architecture ablations. |
| Boundary | The target is believable behavior, not a validated model of society or proof of task reliability, safety, or economic prediction. |
| Reading value | Useful for understanding memory, reflection, and planning in persistent simulation. |

### Background

A single persona prompt struggles to maintain goals and relationships across events. This architecture joins memory, reflection, and planning in an ongoing social simulation.

### Intermediate guide

**Problem and method.** A memory stream records observations. Retrieval combines recency, importance, and relevance to the current need. Sufficiently important accumulated events trigger higher-level reflections; planning turns goals into schedules that can be revised from observations.

**Example and result.** Smallville contains 25 agents. A seeded desire to organize a Valentine’s Day party illustrates information spreading, invitations, and coordinated attendance. Formal evaluation separately compares believability of agent responses and ablates observation, reflection, and planning.

**Interpretation.** Components contribute under the simulation’s evaluation; this does not make every component indispensable for every agent. A workplace assistant can borrow the experience-to-plan mechanism while using task-specific acceptance checks.

### Deeper points

Reflections are inferred memories and can be wrong. Repeated retrieval can reinforce an error, so preserve distinctions between observations and inferences and retain source events.

### Reviewer in one sentence

Learn the memory-to-planning data flow; an engaging simulation does not replace task evaluation.

### Your take-away

Trace one observation, one reflection, and the resulting plan in a small scenario, then introduce conflicting evidence and inspect revision.

## Original worked example: can a summary preserve a prior constraint?

This is an original teaching example, not a lecturer's account or an official assignment solution. An email assistant receives: “Compare supplier quotes. Draft only; wait for my approval before sending.” After reading several emails, its window gets crowded. In the next conversation the user says: “Change the budget to eighty thousand and continue the comparison.”

Append both requests and tool results to the event log so original evidence stays recoverable. Keep the comparison goal, the new budget, the draft-only constraint, the approval requirement, and unfinished suppliers in working memory. Store email bodies separately with source IDs. A summary carries progress forward; old verbose observations can be masked. Retrieve relevant quotes when comparing them instead of replaying the entire archive every turn.

```diagram
title: History is not the current input
desc: A context manager selects from logs and memory while preserving recoverable evidence.
caption: Simplified architecture for this example; writes and maintenance omitted.
---
<svg viewBox="0 0 440 360">
  <path class="dg-line" d="M112 80V112Q112 120 120 120H172V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M328 80V112Q328 120 320 120H268V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 224V276" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="16" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="112" y="40" text-anchor="middle" dominant-baseline="central">Event log</text>
  <text class="dg-sub" x="112" y="60" text-anchor="middle" dominant-baseline="central">Requests and results</text>
  <rect class="dg-box" x="232" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="328" y="40" text-anchor="middle" dominant-baseline="central">Memory store</text>
  <text class="dg-sub" x="328" y="60" text-anchor="middle" dominant-baseline="central">Facts, skills, sources</text>
  <rect class="dg-box dg-box--accent" x="80" y="160" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="184" text-anchor="middle" dominant-baseline="central">Context manager</text>
  <text class="dg-sub" x="220" y="204" text-anchor="middle" dominant-baseline="central">Select, summarize, retrieve</text>
  <rect class="dg-box" x="80" y="280" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="304" text-anchor="middle" dominant-baseline="central">Model input</text>
  <text class="dg-sub" x="220" y="324" text-anchor="middle" dominant-baseline="central">Goal, limits, evidence</text>
</svg>
```

Across sessions, semantic memory can replace the old budget with the new one while the episodic log preserves the change. The sending procedure checks approval before execution. The assistant may complete a comparison draft, but “continue” does not authorize sending. Memory earns its value through the next correct action, rather than the volume stored.

**Variation and answer criteria**: a summary says only “quotes reviewed; continue comparing” and drops “draft only.” Does it pass? No. A passing system preserves or retrieves that constraint, updates the budget, cites quote sources, and stops at a draft. Additional tests can cover changing preferences, abstaining when evidence is absent, and maintaining memory after a deletion request. These are suggested tests for this example, not official HW1 grading rules.

## Evaluate whether memory is used correctly

Lecture 07 asks for realistic, long-context, challenging, and verifiable evaluations. LoCoMo tests capabilities over long conversations; PersonaMem adds evolving preferences; LongMemEval-v2 asks about agent trajectory details; MemoryArena moves toward actual task completion. Retrieval hits alone are insufficient: the slides note that a model can receive the right memory and still misuse it, while a complex task failure cannot always be attributed entirely to memory.

For the worked example, separately record whether the constraint was stored, retrieved, and obeyed. Sending the email fails the task even if retrieval succeeded. The slides also raise uncertain future relevance, poisoned memories, privacy and user control, and over-personalization. Concrete engineering questions follow: can evidence be traced, can old preferences be updated, can users delete memories, and can irrelevant memories be ignored?

## Where it sits in the course

Lecture 7 adds the memory layer of the HW1 harness. The next week turns to division of labor and improvement: [Lecture 8](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en) asks whether to split work across agents, with shared memory as part of the coordination layer.

## Course material for this lecture

- Official slides (PDF): [Agent Memory Architectures — Lecture 07](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)
- Assigned readings: Sumers et al., "Cognitive Architectures for Language Agents"; Packer et al., "MemGPT" (digested here); Park et al., "Generative Agents" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 7 (Wed Oct 14), previously part of the "Week 4: reason while acting, then remember" guide; earlier entries below predate the split.
- 2026-10-29: Rechecked every section's page range against the Lecture 06/07 PDFs; the Pi case now lists the features the slides say it deliberately omits and its permission model (L06 pp. 78, 82).
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Expanded from the full Lecture 06/07 slides with design patterns, context management, memory architectures, evaluation, and an original worked example.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, memory and human-in-the-loop are explicit requirements); rewrote the opening, the ReAct/MemGPT "What to do" notes, and the course-position section to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 6: Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en), [Lecture 8: Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560)
