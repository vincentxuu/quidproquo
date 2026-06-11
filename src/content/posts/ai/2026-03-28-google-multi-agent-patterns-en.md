---
title: "Google's Eight Multi-Agent Design Patterns"
date: 2026-03-28
type: guide
category: ai
tags: [multi-agent, design-patterns, google, agent-architecture, generator-critic, orchestration]
lang: en
tldr: "Google outlined eight multi-agent design patterns: from the simplest Sequential Pipeline to the composable Composite Pattern. More complexity isn't always better — picking the right pattern matters more than stacking agents."
description: "A walkthrough of the eight multi-agent design patterns published by Google, covering Sequential Pipeline, Coordinator, Parallel Fan-Out, Hierarchical Decomposition, Generator & Critic, Iterative Refinement, Human in the Loop, and Composite Pattern, with use-case analysis and trade-off discussion for each."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-google-multi-agent-patterns)

In early 2026, Google published a [multi-agent design pattern guide](https://docs.google.com/architecture/choose-design-pattern-agentic-ai-system) through the Cloud Architecture Center, and Sergio De Simone at InfoQ wrote an excellent [summary article](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/). The eight patterns are arranged from simple to complex, each solving a different class of problem.

This post breaks down all eight patterns and draws comparisons with [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design).

---

## 1. Sequential Pipeline

The simplest pattern. Agents process tasks in a fixed order — the output of one becomes the input of the next.

```
Agent A → Agent B → Agent C → Result
```

**Good for**: Tasks with fixed, well-defined steps, such as "translate → proofread → typeset."

**Limitation**: If any step gets stuck, the entire chain stalls. No flexibility.

---

## 2. Coordinator / Dispatcher

An evolution of the Sequential Pipeline. A coordinator agent receives requests and decides which specialized agent should handle them.

```
           ┌→ Agent A (technical issues)
Request → Coordinator ─┼→ Agent B (billing issues)
           └→ Agent C (general inquiries)
```

**Good for**: Customer service routing, task classification.

**Connection to Anthropic**: Anthropic's Initializer Agent partially plays a coordinator role — it assesses the current state and decides what to do next.

---

## 3. Parallel Fan-Out / Gather

Multiple agents process different aspects simultaneously, and a synthesizer aggregates the results.

```
           ┌→ Style Agent      ─┐
Request → ──┼→ Security Agent    ─┼→ Synthesizer → Result
           └→ Performance Agent ─┘
```

**Good for**: Tasks requiring multi-angle analysis, such as PR review (checking style, security, and performance simultaneously).

**Key trade-off**: Fast (parallel processing), but the synthesizer's aggregation quality determines the final result. Agents don't share intermediate state with each other.

---

## 4. Hierarchical Decomposition

A high-level agent breaks a complex goal into subtasks and delegates them to lower-level agents, which can further decompose their own subtasks.

```
High-level Agent
  ├→ Subtask Agent 1
  │    ├→ Sub-subtask 1a
  │    └→ Sub-subtask 1b
  └→ Subtask Agent 2
```

**Good for**: Large, complex tasks, such as "build a complete web app."

**Connection to Anthropic**: Anthropic's Initializer Agent breaks a high-level goal into 200+ features — a textbook example of hierarchical decomposition. The difference is that Anthropic decomposes upfront (all at once during init) rather than dynamically.

---

## 5. Generator & Critic

One agent generates output; another evaluates it.

```
Generator → Output → Critic → Pass?
                      │        ↓ Yes → Result
                      └─ No → Feedback → Generator (redo)
```

**This is the core pattern of Anthropic's harness design.** Anthropic uses a GAN analogy; Google names it Generator & Critic — the essence is the same.

**Why it works**: Separating generation from evaluation avoids the problem of models being too lenient when self-evaluating. The evaluator can incorporate automated testing tools (Playwright, Puppeteer) for objective verification, not just language-based judgment.

---

## 6. Iterative Refinement

An extension of Generator & Critic. A Refiner agent is added, and the critic and refiner alternate to progressively improve quality.

```
Generator → Critic → Refiner → Critic → Refiner → ... → Result
```

**Good for**: Tasks with extremely high quality requirements, such as frontend design or copywriting.

**Trade-off**: Better quality, but token consumption and latency grow linearly. You need convergence criteria (e.g., a maximum of N rounds); otherwise it can loop indefinitely.

---

## 7. Human in the Loop

For irreversible or high-risk operations, execution pauses to wait for human confirmation.

```
Agent → Ready to execute → ⏸️ Human review → ✅ Continue / ❌ Abort
```

**Good for**: Financial transactions, code deployments, publishing public content.

**Connection to the [Three Pillars article](/posts/ai/2026-03-17-ai-agents-context-cognition-action)**: The Action layer risk management (human-in-the-loop, reversibility check) discussed in that article is exactly this pattern.

---

## 8. Composite Pattern

Combine any of the above patterns together. Real-world agent systems are almost always composites.

```
Coordinator → Routing
  ├→ Parallel Fan-Out (multi-angle analysis)
  │    └→ Generator & Critic (quality loop)
  └→ Human in the Loop (high-risk confirmation)
```

**Anthropic's full harness is a composite**: Hierarchical Decomposition (breaking down features) + Sequential Pipeline (executing one by one) + Generator & Critic (generate-evaluate loop) + automated testing (replacing part of human-in-the-loop).

---

## How to Choose?

| Your Situation | Recommended Pattern |
|---------|---------|
| Fixed process, clear steps | Sequential Pipeline |
| Diverse request types, need routing | Coordinator |
| Need multi-angle simultaneous analysis | Parallel Fan-Out |
| Task is large and complex | Hierarchical Decomposition |
| Quality is the top priority | Generator & Critic / Iterative Refinement |
| Involves irreversible operations | Human in the Loop |
| All of the above | Composite |

Google and Anthropic share a common recommendation: **start with the simplest pattern and only upgrade complexity when specific failure modes emerge.** The coordination cost of multiple agents is real — over-engineering is just as harmful as under-engineering.

---

## The Big Picture

These eight patterns aren't a theoretical checklist — they're a practical toolbox. After reading through them, go back and look at [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design), and you'll find that their architecture can be precisely described using these patterns. Theory and practice converge here.

The most important takeaway: **more agents isn't always better — choosing the right pattern is what matters.** A well-designed two-agent system (Generator + Critic) can outperform a poorly designed five-agent system.

---

## Further Reading

- [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design) — The composite pattern in practice
- [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) — Why multi-agent became necessary
- [Phil Schmid: Why Agent Harness Is the Most Important Thing in 2026](/posts/ai/2026-03-28-phil-schmid-agent-harness) — Harness as infrastructure
- [The Three Core Pillars of AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Agent architecture theoretical framework
- [Google's Eight Essential Multi-Agent Design Patterns — InfoQ original](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/)
- [Choose a Design Pattern for Your Agentic AI System — Google Cloud](https://docs.google.com/architecture/choose-design-pattern-agentic-ai-system)

## References

- [Google's Eight Essential Multi-Agent Design Patterns — InfoQ](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/) — InfoQ's coverage summarizing Google's eight multi-agent patterns
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's agent design philosophy, providing a comparative perspective
- [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Anthropic's real-world Composite Pattern example
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv paper, academic survey of LLM agent systems including multi-agent architecture discussion
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — A mainstream framework for implementing orchestrator-workers and sequential pipeline patterns
- [CrewAI GitHub Repository](https://github.com/crewAIInc/crewAI) — A framework implementing multi-agent design patterns through role-based collaboration
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP protocol, infrastructure for standardizing tools across agents
