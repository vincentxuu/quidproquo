---
title: "Anthropic's Harness Design: Making AI Agents Work Like Engineers"
date: 2026-03-28
type: guide
category: ai
tags: [harness-design, ai-agent, anthropic, claude, multi-agent, long-running-agents, agent-sdk]
lang: en
tldr: "The same model produces dramatically different results under different harness designs. Anthropic uses a dual-agent architecture, cross-session state files, and a GAN-inspired generator-evaluator loop to let Claude autonomously complete hours-long software development tasks."
description: "A guided reading of two Anthropic engineering blog posts on harness design, breaking down the architecture for long-running AI agents: dual-agent architecture, claude-progress.txt state transfer, GAN-inspired generation-evaluation loops, and how model improvements reshape framework design."
draft: false
series:
  name: "AI Agent 實戰"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-03-28-anthropic-harness-design)

Anthropic's engineering team published two articles on harness design between late 2025 and early 2026: [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps). Together, they represent the most complete publicly available field report on "how to keep an AI agent working continuously for hours."

This post is a guided reading that breaks down the core ideas from both articles. If you've read [The Three Core Pillars of AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action), these two articles serve as a practical case study of that theoretical framework — how Anthropic solves context fragmentation, cognitive loops, and action verification in real agent systems.

---

## What Is a Harness?

A harness is the execution framework wrapped around an LLM — it determines when the model gets called, what prompt it receives, how its output is handled, and what tools it works with. Think of it as the model's "working environment."

Anthropic's core argument is straightforward: **the same model, under different harness designs, produces dramatically different results.** The ceiling on model capability is often not the model itself, but how you design its execution framework.

This aligns with the philosophy they previously laid out in [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents): find the simplest solution first, and only add complexity when necessary.

---

## The Problem: The Context Window Is Fragmented

Long-running agents face a fundamental challenge — the context window is finite, and complex projects cannot be completed within a single window.

This is the same point made in [the Context article](/posts/ai/2026-03-17-ai-agents-context-cognition-action): an LLM's context window is like RAM — when the conversation ends, everything resets to zero. Anthropic faces the extreme version of this problem — it's not about a single conversation losing memory, but an agent that needs to run for hours across dozens of sessions.

Every time a new session starts, the agent knows **nothing** about previous work. It's like shift changes at a factory: the previous shift leaves, and the new person stares at a pile of code with no idea what's been done or what to do next.

Even a top-tier model like Opus 4.5 struggles when run directly:

- **Greedy completion attempts**: Tries to one-shot the entire application, running out of context with features half-finished
- **No record-keeping**: The next session can't pick up where things left off and has to re-understand the entire codebase

---

## Solution 1: Dual-Agent Architecture

Anthropic's first breakthrough was splitting the work into two roles.

### Initializer Agent

Runs only on the first execution, responsible for setting up the entire working environment:

- Generates `feature_list.json` — 200+ fine-grained features, all marked as `failing`
- Initializes a git repo and creates the initial commit
- Creates `claude-progress.txt` as a progress log
- Generates `init.sh` startup script

Using JSON instead of Markdown for the feature list is a deliberate choice — models are less likely to corrupt JSON's structure.

### Coding Agent

Each session does one thing: **incrementally complete one feature, leaving clear artifacts for the next session.**

Every startup follows a fixed ritual:

1. Run `pwd` to confirm the working directory
2. Read git log and `claude-progress.txt`
3. Pick the highest-priority incomplete feature
4. Run `init.sh` to start the dev server
5. Run a smoke test to confirm the environment is healthy
6. Only then start writing new features

The design logic behind this ritual: **make the agent figure out where it is before it starts doing anything.**

---

## Key Mechanism: `claude-progress.txt`

This is the most elegant part of the entire architecture.

`claude-progress.txt` combined with git history lets each new session's agent understand within seconds: where things stand, which features are done, which aren't, and what problems the last session encountered.

It's not high-tech — it's just a plain text file. But it solves the most critical problem for long-running agents: **cross-session state transfer.** In the language of the three pillars, this is the lowest-cost implementation of episodic memory — no vector database needed, no Mem0, just a text file.

---

## Solution 2: GAN-Inspired Generator-Evaluator Loop

The second article goes further, introducing an architecture inspired by GANs (Generative Adversarial Networks).

### Why Is This Needed?

Without external feedback, Claude tends to produce "safe but mediocre" results — frontend designs that are technically functional but visually unremarkable. Models naturally play it safe, gravitating toward the most common layouts.

### How Does It Work?

Split generation and evaluation into two independent agents:

- **Generator Agent**: Responsible for writing code and designing the frontend
- **Evaluator Agent**: An independent, strict reviewer that scores output against four criteria

The key insight: **tuning an independent evaluator to be rigorously critical is far easier than getting a generator to self-critique.** With external feedback, the generator has concrete targets to iterate toward. This is essentially the Self-Reflection mechanism described in [the Cognition article](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — except Anthropic outsources the reflection capability to another agent rather than having the same agent reflect on itself.

Combined with Playwright for automated end-to-end testing, the entire system can iterate autonomously for hours — generator produces, evaluator rejects, generator revises, until the standards are met.

---

## How Model Improvements Change Harness Design

There's a particularly noteworthy observation here.

The first article used Sonnet 4.5, and they discovered that the model exhibited "context anxiety" in long contexts — quality would noticeably degrade as context grew longer. So they added a **context reset** mechanism to the architecture, periodically clearing and starting fresh.

By the second article, after upgrading to Opus 4.5, this problem disappeared on its own. The model itself could stably handle long contexts, so context reset was removed entirely, replaced by a single continuous session with Claude Agent SDK's automatic compaction handling context growth.

Anthropic drew an important principle from this:

> Every component of a harness encodes an assumption about something "the model can't do." These assumptions are worth continuously stress-testing — because they might be wrong, or they might become obsolete as models improve.

In other words, a good harness isn't something you write once and leave alone. When the model upgrades, the harness should simplify accordingly.

---

## Open Questions

Anthropic themselves acknowledge areas where they don't yet have definitive answers:

- **Single generalist agent vs. multiple specialized agents**: Is one agent that does everything better, or is it better to split testing, QA, and code cleanup across different specialized agents?
- **Cost trade-offs**: Structured harnesses increase token consumption and latency — when is it worth it, and when isn't it?

---

## Overall Takeaway

The greatest value of these two articles isn't in the specific architectures (dual agents, progress files, etc.), but in the thinking approach behind them:

1. **The ceiling on model capability is often a harness design problem, not a model problem.**
2. **Every harness component is an assumption — keep validating whether those assumptions still hold.**
3. **As models improve, the interesting harness combination space doesn't shrink — it shifts.** The AI engineer's job is to continuously find the next novel combination.

If you're building any long-running agent system, these two articles are worth reading repeatedly. Not to copy the architecture, but to learn this methodology of "first observe where the model fails, then patch it with the minimal framework."

---

## Further Reading

**Anthropic Original Articles and Foundations**
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's starting point for agent design philosophy, 6 composable patterns
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — The first original article covered in this post
- [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — The second original article covered in this post
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic's agent evaluation methodology, directly related to evaluator agent design

**Harness Engineering Trends**
- [From Prompt to Harness: Three Evolutionary Stages of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) — The evolution across three eras: Prompt, Context, and Harness
- [Phil Schmid: Why Agent Harness Is the Most Important Thing in 2026](/posts/ai/2026-03-28-phil-schmid-agent-harness) — Why the harness is the key factor determining agent success or failure
- [Google's Eight Multi-Agent Design Patterns](/posts/ai/2026-03-28-google-multi-agent-patterns) — Google's 8 multi-agent design patterns, useful for comparison with Anthropic's approach

**Related Posts on This Site**
- [The Three Core Pillars of AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — The theoretical framework for understanding agent architecture; this post serves as its practical counterpart

## References

- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Anthropic engineering blog original, dual-agent architecture and claude-progress.txt design
- [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Anthropic engineering blog original, GAN-inspired Generator-Evaluator loop in practice
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic agent design philosophy, the starting point for six composable patterns
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic agent evaluation methodology, directly related to evaluator agent design
- [Claude Code Overview](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — Claude Agent SDK official documentation, the concrete implementation foundation for understanding harnesses
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv paper, a comprehensive academic survey of LLM agent systems
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP official documentation, understanding the agent tool standardization protocol
