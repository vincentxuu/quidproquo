---
title: "Agentic Engineering: Making AI Agents Collaborate Like a Real Engineering Team"
date: 2026-04-20
type: guide
category: ai
tags: [agentic-engineering, multi-agent, langgraph, langsmith, a2a, mcp, worker-agent, leader-agent]
lang: en
tldr: "Agentic Engineering isn't about making AI write code faster — it's about making software move through the entire delivery pipeline faster, by using multi-agent collaboration to compress cross-team coordination friction."
description: "A field report from Cisco engineers: building a multi-agent system with LangGraph + LangSmith + LangMem that cut debug workflow time by 93% and accelerated development cycles by 65%. Breaking down the Worker Agent and Leader Agent architecture, plus the trade-offs between A2A, MCP, and CLI integration."
draft: false
series:
  name: "AI Agent 實戰"
  order: 6
---

> 🌏 [中文版](/posts/ai/2026-04-20-agentic-engineering-intro)

There's a problem in software development that AI coding agents have never truly solved: **cross-team coordination friction**.

Codex writes code fast, Claude Code debugs accurately, but they all live inside a single session — one engineer, one task, one window. The moment you need to cross the boundaries between dev, QA, and ops, you're back to manually passing context and coordinating progress by hand.

Two engineers at Cisco published an article in April this year describing how they approached this problem differently. They call it **Agentic Engineering**.

---

## The Core Insight

> "The biggest breakthrough isn't better tools — it's a system that can operate like a real engineering team."

This cuts to the heart of the matter. The AI engineering progress of the past few years has mostly been about making individual tools stronger — more accurate completions, smarter conversations, wider context windows. But the bottleneck in engineering delivery has never been just "writing code." It's the entire pipeline: requirements, design, development, testing, deployment, operations.

Agentic Engineering doesn't ask "How do we write code faster?" It asks: "**How do we move software through the entire delivery pipeline faster and more safely?**"

---

## Architecture: Two Roles

The system consists of two types of agents, analogous to the division of labor in a real team:

### Worker Agent (Individual Engineer)

Each Worker owns a domain (debug, development, testing, operations) and can:

1. **Interpret intent**: Receive engineering requirements in natural language and produce an execution plan
2. **Gather context**: Pull relevant information from repos, issue trackers, and log systems
3. **Execute tasks**: Call tools, invoke coding agents (Codex/Claude Code), or delegate to sub-agents
4. **Validate results**: Confirm that execution results meet expectations
5. **Report progress**: Report plans, actions, and results to the Leader Agent

Workers are loosely coupled, can scale horizontally, and can delegate subtasks to other Workers.

### Leader Agent (Project Lead)

The Leader doesn't execute tasks — it handles coordination and governance:

- **Shared prompt and workflow library**: Standardizes best practices and reduces onboarding costs
- **Unified tool gateway**: Exposes tool capabilities to Workers in a consistent and secure way
- **Long-term memory**: Accumulates knowledge across sessions and Workers
- **Global observability**: Tracks all agent decisions and execution results
- **Task routing**: Dispatches tasks to the right Worker based on intent

By separating execution (Worker) from coordination (Leader), the system maintains autonomy at the edges while preserving consistency as a whole.

---

## Technology Choices: Why the LangChain Stack?

After evaluating multiple frameworks, Cisco chose LangGraph + LangSmith + LangMem because they treat the three things most critical to production as first-class citizens:

**LangGraph** — State management and workflow orchestration
- Each Worker's workflow is a stateful graph
- Supports checkpointing and retry (no restarting from scratch on mid-run failures)
- Can pause at any node to wait for human confirmation before continuing

**LangSmith** — Global observability
- Records the complete execution trace of every agent
- Every decision has an audit trail — who did what, when, and why
- This is the foundation that makes Agentic Engineering trustworthy enough for production deployment

**LangMem** — Long-term memory
- Persists workflow history, team preferences, and past solutions across sessions
- Lets Worker Agents learn from past executions instead of starting from zero every time

---

## A Complete Execution Flow

Using the development workflow as an example, here are the four stages of Worker Agent collaboration with an IDE-based AI coding agent:

```
1. Intent Analysis
   Engineer inputs natural language requirements in the IDE
   → Worker Agent analyzes intent using LangGraph
   → Pulls repo context via MCP tools

2. Planning & Notification
   Worker produces a structured multi-step plan
   → Notifies the engineer via Slack/Teams

3. Execution & Tracking
   The plan executes step by step; the AI coding agent handles code generation
   → LangGraph checkpoint tracks execution state at each step

4. Validation & Closure
   Results are validated after execution
   → Engineer is notified; results are stored in LangMem long-term memory
```

---

## Inter-Agent Communication: A2A, MCP, or CLI?

In the article, Worker Agents communicate using the **A2A protocol** (Google's agent communication standard released in 2025). But AI coding agents like Claude Code or Codex don't natively support A2A, so Cisco built an **MCP wrapper** to bridge the gap.

Each of the three integration approaches has trade-offs:

| Approach | Communication Direction | State | Best For |
|----------|------------------------|-------|----------|
| **A2A** | Bidirectional | Stateless | Standard inter-agent collaboration |
| **MCP** | Bidirectional | Stateless | Letting coding agents call back to Workers |
| **CLI subprocess** | Unidirectional | Stateless | Fastest way to get started |

The core advantage of MCP over CLI is **communication direction**: CLI only supports Worker → Claude, while MCP lets Claude proactively call Worker tools mid-execution to report progress or request more context.

The state problem (amnesia on every call) exists with all three approaches and must be solved by injecting historical context via LangMem.

---

## Experimental Results

Cisco ran pilots on two types of internal workflows:

**Debug Workflow** (20+ cross-team triage cases)
- **93% reduction in time-to-root-cause**
- Multiple cross-team investigations completed in under 5 minutes
- 512 sessions, 70 users, **200+ person-hours saved per month**
- QA team independently confirmed: no drop in quality

**Development Workflow** (15+ cases)
- **65% reduction in execution time**
- The key gain wasn't faster code generation (coding agents are already fast) — it was **compression of downstream testing after PR merge**
- Ultimate bottleneck: **human code review**

The second data point is particularly interesting. Most of the 65% speedup came from compressing the testing process, not development itself. This validates Agentic Engineering's core claim: **the biggest leverage is in coordination overhead, not the speed of any single step.**

---

## Relationship with AI Coding Agents

A common misconception: Agentic Engineering is meant to replace Codex or Claude Code.

It's not.

The correct relationship is: **Codex/Claude Code are execution engines inside the Worker Agent**. The Worker handles intent understanding, context gathering, state tracking, and cross-team coordination — things coding agents can't do. The coding agent handles doing the concrete code tasks well — which is what it's best at.

The two operate at different levels of abstraction, complementing rather than competing with each other.

---

## The Big Picture

The core trade-off of Agentic Engineering is clear: you accept higher architectural complexity in exchange for acceleration across the entire delivery pipeline.

It's not for every team. If your delivery bottleneck is "writing code too slowly," a good coding agent is enough. If your bottleneck is "cross-team collaboration is too slow, context passing is too costly, and downstream testing takes too long," then the multi-agent architecture of Agentic Engineering truly makes sense.

Start with the smallest path: pick a real internal workflow (debug triage is a good starting point), get the Worker Agent's four nodes running end-to-end, add LangSmith tracing, and see what the numbers say.

---

## References

- [Agentic Engineering: How Swarms of AI Agents Are Redefining Software Engineering](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Building effective agents — Anthropic](https://www.anthropic.com/research/building-effective-agents)
- [Your harness, your memory — Harrison Chase](https://www.langchain.com/blog/your-harness-your-memory)
- [Continual learning for AI agents — Harrison Chase](https://www.langchain.com/blog/continual-learning-for-ai-agents)
