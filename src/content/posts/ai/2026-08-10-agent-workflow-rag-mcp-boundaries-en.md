---
title: "Drawing the Lines: Agent, Workflow, RAG, and MCP"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, llm, mcp, rag, agentic-ai]
lang: en
series:
  name: "Agent 生產線"
  order: 1
tldr: "The line between workflow and agent is who decides the steps — the developer at design time, or the model at run time. By that definition most LLM systems in production today are workflows. Plus a usable test for choosing between RAG and an agent."
description: "Separating four commonly conflated concepts: Anthropic's workflow/agent distinction, the five orchestration patterns, the agent loop's four output branches and three guardrail families, and how to decide between RAG and an agent."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)

This opens the "Agent 生產線" series. The material comes from reading roughly sixty agent-related articles published by [ByteByteGo](https://blog.bytebytego.com/) across 2025–2026, then going back to nineteen of the primary sources they cite. This first part separates four terms that get used interchangeably — because every engineering trade-off in the remaining six parts rests on these lines.

## What an agent is: LLM + tools + memory + loop

The cleanest definition splits an agent into four things: an LLM that reasons, a set of tools that act on the world, memory that persists across turns, and a loop that runs the three of them repeatedly.

The ByteByteAI video has the most useful analogy: the LLM is a brain. It can reason, but it **cannot open a browser, send an email, or query a database**. The agent is the software layer that gives that brain hands and eyes. The key line — "**an agent is not a new kind of model; it is the software that orchestrates this system**" — sets the stance for the whole series.

The loop itself has four steps: **perceive → reason → act → observe**. Observe is a first-class citizen, not a closing formality. [The Agent Loop](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering) makes the point sharply: remove observe and the loop degenerates into a chain, where the model advances on what it *expects* to happen rather than what actually happened.

Each turn, the model's output takes one of four branches (a split borrowed from the OpenAI Agents SDK):

| Branch | Meaning |
|---|---|
| final answer | Done, hand back the result |
| tool call | I need to do something to the world |
| handoff | This belongs to another agent |
| continued thought | Not finished thinking, go around again |

Guardrails are classified by **position**, not by content: **input** (before the first turn, often a small model as gatekeeper), **tool** (one before and one after every tool call), and **output** (after the loop, before the user sees anything). This split matters later, because an agent's real exposure is almost entirely in that middle family.

One component that routinely goes missing is the **exit condition**. EP215's five-part anatomy (Brain / Planning / Tools / Memory / Loop) omits it, and a commenter's criticism lands: "knowing when to stop is much harder than knowing what to do next." Part 4 shows Stripe turning that into a hard ceiling.

## Workflow vs agent: who decides the steps

This is the line most often erased by marketing language. [Anthropic's definition in *Building Effective Agents*](https://www.anthropic.com/engineering/building-effective-agents) is precise:

> Workflows are systems where LLMs and tools are orchestrated through **predefined code paths**. Agents are systems where LLMs **dynamically direct their own processes and tool usage**.

The difference is not "does it use an LLM" or "is it complicated." It is **who decides the steps and the path**: the developer at design time makes it a workflow; the model at run time makes it an agent.

By that standard, The Agent Loop delivers a correction to the industry's vocabulary: **most LLM systems running in production today are workflows, not agents.** That is not an insult — Part 2 shows that leaning toward the workflow end is exactly what production systems consistently do.

Both share the same building block, what Anthropic calls the **augmented LLM**: one model plus retrieval, tools and memory. Anthropic's own advice is more conservative than most write-ups:

> For many applications, optimizing single LLM calls with retrieval and in-context examples is usually enough.

### Five workflow orchestration patterns

Anthropic's five, all cut along a consistent axis:

1. **Prompt chaining** — fixed sequential steps, each output feeding the next
2. **Routing** — classify first, then send to a specialized path
3. **Parallelization** — two variants: sectioning (independent subtasks at once) and voting (the same task several times for consensus)
4. **Orchestrator-workers** — a lead dynamically decomposes, dispatches, and merges
5. **Evaluator-optimizer** — one generates, one scores, iterate

> ⚠️ A different article also offers "five patterns" (Reflection / Tool Use / ReAct / Planning / Multi-Agent), but along **a completely different axis, with no cited source, and it lists Tool Use — a capability — alongside orchestration patterns**. The two never cross-reference each other. Use the one with a source.

## Agent, RAG, MCP: three questions, not three competitors

These three land in the same comparison table constantly, but they answer questions at different layers.

| | Governs | Key limit |
|---|---|---|
| **MCP** | How an LLM *uses* tools — a standard interface for discovery, invocation, structured returns | **Does not decide what to do** |
| **RAG** | What the model *knows* at run time. Model frozen, no retraining | **Takes no action; only improves answers** |
| **Agent** | *Doing things*: observe → reason → decide → act → repeat | More tokens, harder to debug |

The operational test is one sentence: **if the answer is in a document, use RAG; if the answer requires acting on another system, use an agent.** MCP is the underlying interface either might use — not a substitute for either.

The test looks trivial, but a large share of over-engineering comes from skipping it: wrapping a retrieval problem in a multi-agent system, paying for more tokens and harder debugging, and getting no action capability in return.

## Compounding error: why "a few more steps" isn't linear

The last intuition to establish is compounding error. A 95% per-step success rate sounds high, but:

- 10 steps → 0.95¹⁰ ≈ **60%**
- 20 steps → 0.95²⁰ ≈ **36%**

This explains something widely misread: **coding agents work better than open-ended agents not because code is easier, but because test feedback raises per-step reliability — which shortens the chain that has to be entirely correct.** That observation is the shared motivation behind everything that follows. "Give the deterministic parts back to code," the subject of Part 2, is fundamentally a way of shortening that chain.

## The series

1. **Drawing the Lines: Agent, Workflow, RAG, and MCP** (this post)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
7. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [ByteByteGo — The Agent Loop: How AI Goes From Answering Questions to Doing Things](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering)
- [ByteByteGo — EP215: The Anatomy of an AI Agent](https://blog.bytebytego.com/p/ep215-the-anatomy-of-an-ai-agent)
- [ByteByteGo — EP202: MCP vs RAG vs AI Agents](https://blog.bytebytego.com/p/ep202-mcp-vs-rag-vs-ai-agents)
- [ByteByteGo — EP216: RAGs vs Agents](https://blog.bytebytego.com/p/ep216-rags-vs-agents)
- [ByteByteGo — EP218: The Typical AI Agent Stack, Explained](https://blog.bytebytego.com/p/ep218-the-typical-ai-agent-stack)
- [ByteByteGo — Top AI Agentic Workflow Patterns](https://blog.bytebytego.com/p/top-ai-agentic-workflow-patterns)
- [YouTube — What Are AI Agents & How Do They Work? (ByteByteAI)](https://www.youtube.com/watch?v=oP6DS_x5K0Y)
