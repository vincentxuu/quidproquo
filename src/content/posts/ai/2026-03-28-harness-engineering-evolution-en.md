---
title: "From Prompt to Harness: The Three Evolutions of AI Engineering"
date: 2026-03-28
type: guide
category: ai
tags: [harness-engineering, prompt-engineering, context-engineering, ai-agent, agentic-ai]
lang: en
tldr: "AI engineering has gone through three phases: Prompt Engineering (write better instructions) → Context Engineering (feed the right information) → Harness Engineering (design the entire working environment). Each evolution doesn't replace the previous one — it operates at a higher level of abstraction."
description: "A guide to Epsilla's 'The Third Evolution' article, tracing the evolution of AI interaction from prompt engineering to context engineering to harness engineering, and why the focus in 2026 is on designing agent execution environments rather than tweaking prompts."
draft: false
series:
  name: "AI Agent 實戰"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-03-28-harness-engineering-evolution)

In March 2026, Epsilla published [The Third Evolution: Why Harness Engineering Replaced Prompting in 2026](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents), organizing the past four years of AI engineering evolution into three clear phases. If you've been following AI engineering developments but feel things are getting increasingly fragmented, this article helps you connect the dots.

---

## Three Phases

### Phase 1: Prompt Engineering (2022-2024)

The focus was on **writing a good instruction**.

The core question of this phase was: how do you phrase things to get the best response from the model? Chain-of-thought, few-shot examples, role prompting — every technique revolved around the same thing: using the most precise language to guide the model in a single call.

The limitations were obvious: the amount of information you can pack into a single prompt is finite, and the model is only called once.

### Phase 2: Context Engineering (2025)

The focus shifted from "how to ask" to **"what information to feed"**.

Andrej Karpathy's definition captures it best: Context engineering is the art of "filling exactly the right information, at exactly the right time, into the context window."

The engineering focus of this phase was RAG, memory systems, tool definitions, conversation management — no longer just tweaking prompts, but designing the entire information flow to ensure the model has sufficient and relevant context for every decision.

But context engineering still focused on a **single decision point**: providing the best input for the model's next step.

### Phase 3: Harness Engineering (2026)

The focus moves up another level: designing **the entire working environment and rule system**.

Harness engineering doesn't just manage context for a single decision — it manages the agent's entire lifecycle: startup rituals, tool constraints, feedback loops, quality gates, cross-session state. The question it addresses is: when an agent works continuously for hours, how do you ensure it doesn't drift, degrade, or repeat the same mistakes?

The relationship between the three isn't replacement, but layered accumulation:

```
Harness Engineering    ← Manages the entire execution environment and lifecycle
  └─ Context Engineering  ← Manages information input for each step
       └─ Prompt Engineering  ← Manages the wording of a single instruction
```

---

## Why Do We Need a Harness?

Epsilla cites a shared observation from Anthropic and OpenAI: **models cannot reliably evaluate their own work.**

This isn't because models are dumb — it's a structural problem. When you let an agent be both the player and the referee, it tends to go easy on itself. External constraints aren't optional; they're necessary.

The core argument is a counterintuitive statement:

> Constraining an agent's solution space with rules, feedback loops, and linters actually improves its productivity and reliability.

More freedom doesn't mean better performance. Appropriate constraints free the agent from wasting compute on "should I do this?" so it can focus on "how do I do this well?"

---

## Key Design Principles of a Harness

Epsilla outlines several rules:

**1. The repository is the agent's single source of truth**

Don't assume external knowledge. Everything the agent needs should exist in the repo. This aligns with [Anthropic's `claude-progress.txt` approach](/posts/ai/2026-03-28-anthropic-harness-design) — write state to the filesystem instead of relying on the model's memory.

**2. Code should be agent-readable, not just human-readable**

Clear, consistent structure with thorough comments — because the agent doesn't have the tacit knowledge in your head. It can only see what's been written down.

**3. Enforce architectural constraints with linters, not prompt requests**

You don't "ask" an agent to follow the rules — you "make it impossible" to violate them. Prompts are suggestions; linters are law.

**4. Grant autonomy progressively**

Don't let the agent do everything from the start. Set up stages and gates, and only unlock the next step after validation at each stage.

---

## Generator-Evaluator: The Core Architectural Pattern

Like [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design), Epsilla also emphasizes that the GAN-inspired dual-agent architecture is the core component of a harness:

- **Generator**: Responsible for producing output
- **Evaluator**: Independently verifies results and feeds them back to the generator

This pattern matters because it addresses the fundamental problem of unreliable model self-evaluation. It's not about making the model smarter — it's about using architecture to compensate for this structural flaw.

---

## The Big Picture

The greatest value of this article is stringing together scattered concepts into a clear evolutionary arc. If you've ever felt like "I haven't even figured out prompt engineering, and now there's context engineering, and now harness engineering" — they're not competing trends that replace each other. They're progressively higher levels of abstraction along the same path.

Each layer solves a different problem:
- **Prompt**: The model doesn't understand what I want → rephrase it
- **Context**: The model lacks background information → supply relevant knowledge
- **Harness**: The model goes off the rails during long tasks → design constraints and feedback systems

The focus in 2026 isn't writing better prompts — it's building better environments.

---

## Further Reading

- [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design) — A guide to Anthropic's two harness design articles
- [Phil Schmid: Why Agent Harness Is the Most Important Thing in 2026](/posts/ai/2026-03-28-phil-schmid-agent-harness) — Understanding the harness's role through the CPU/OS/App analogy
- [Google's Eight Multi-Agent Design Patterns](/posts/ai/2026-03-28-google-multi-agent-patterns) — Complete taxonomy of patterns including Generator-Critic
- [The Three Core Pillars of AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Theoretical framework for agent architecture
- [The Third Evolution — Epsilla Original](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents)

## References

- [The Third Evolution: Why Harness Engineering Replaced Prompting in 2026](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents) — Epsilla's original article with the full thesis on three evolutionary phases
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's agent design philosophy and the core principle of "find the simplest solution"
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Practical harness engineering cases and the dual-agent architecture
- [The Importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026) — Phil Schmid's thesis on the harness as an AI operating system
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv paper, an academic survey of LLM agent architectures
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP, the tool standardization protocol for the harness engineering era
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — A representative framework for implementing harness orchestration layers
