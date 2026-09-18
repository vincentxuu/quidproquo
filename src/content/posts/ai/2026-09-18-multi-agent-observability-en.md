---
title: "Multi-Agent Observability: Where the Money Goes and Which Agent Broke Things"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, observability, agent, langsmith, sentry, tracing, cost-optimization]
lang: en
tldr: "The most common debug nightmare in multi-agent systems is 'the answer is wrong, but I don't know which agent did it.' Three layers of observability are essential: per-agent token metering, execution traces, and real-time cost dashboards."
description: "Part 6 of the Multi-Agent Systems in Practice series. From LangSmith to Sentry, covering observability layering, token tracking implementation, common debug scenarios, and tool selection for multi-agent systems."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 6
---

The most frustrating debugging experience in a multi-agent system goes like this: a user reports "the answer is wrong," you open the logs, see 5 agents running 12 steps with input/output at each step — and you have absolutely no idea where things went wrong.

Debugging a single-agent system is linear: check the prompt → check the response → find the issue. Debugging a multi-agent system is tree-shaped: which agent received bad information? Did the orchestrator dispatch incorrectly, or did the worker execute poorly? Did result compression drop critical details?

This article covers the layered architecture and tool choices for multi-agent observability.

## Three Layers of Observability

### Layer 1: Per-Agent Token Metering

The most basic requirement — how many tokens each agent consumed and how much it cost.

According to [LangSmith](https://smith.langchain.com/)'s tracing architecture, each LangGraph node is a discrete LLM call that can individually record input/output tokens, latency, and model name. This lets you spot the cost hog at a glance.

Claude Code Workflow's `budget.remaining()` takes a different approach — instead of reviewing reports after the fact, the orchestration script knows the remaining budget in real time during execution. According to the [Claude Code docs](https://code.claude.com/docs/en/workflows), scripts can decide whether to continue spawning based on the remaining budget.

**Minimum standard**: after each agent completes, log `{agent_id, input_tokens, output_tokens, model, duration_ms}`. Without this layer, you can't even do basic attribution when bills spike.

### Layer 2: Execution Traces

Record the full path of the entire multi-agent execution — who called whom, what was passed, what was returned, how long it took.

The core structure of a trace is a tree:

```
Trace (corresponds to one user message)
├─ Step 1: Entry Agent (input: user question)
│  ├─ Step 2: Delegate → Worker A (task: "query database")
│  │  └─ Step 3: Tool Call → SQL query (result: 15 rows)
│  ├─ Step 4: Delegate → Worker B (task: "search knowledge base")
│  │  └─ Step 5: Tool Call → RAG retrieval (result: 3 chunks)
│  └─ Step 6: Synthesize (input: A+B results, output: final response)
```

Each step should record:
- **Attribution**: which agent, which node
- **Input/Output**: content passed in and returned (summaries are fine, no need for full tokens)
- **Token consumption**: input_tokens, output_tokens, cache-related
- **Duration**: duration_ms
- **Status**: completed / failed / timeout
- **interaction_type**: handoff / delegate / spawn

[LangSmith](https://smith.langchain.com/) and [Arize Phoenix](https://phoenix.arize.com/) are the most commonly used LLM tracing tools, both supporting nested spans to represent multi-agent tree structures.

### Layer 3: Real-Time Cost Dashboard

The first two layers are post-hoc analysis. Layer 3 is real-time — letting you see the spend while agents are still running.

This is especially important in multi-agent systems because costs are non-linear. A single agent's cost scales roughly with response length, but multi-agent costs depend on how many agents were spawned, how long each ran, and whether there was nested spawning. You might see only 5K tokens in the first 30 seconds, then at second 31, five agents spawn in parallel and token consumption jumps to 50K.

The minimal version of a real-time dashboard: a WebSocket endpoint where each agent pushes `{step, tokens, cost}` after completing a step. The frontend accumulates and displays. No fancy charts needed — numbers ticking upward is enough.

## Common Debug Scenarios

### "The answer is wrong, and I don't know whose fault it is"

Open the execution trace and work backwards from the final response:
1. What was the Synthesize step's input? → If the input was already wrong, the problem is in an upstream worker
2. Which worker's output is problematic? → Check that worker's input and tool call results
3. Did the orchestrator dispatch incorrectly? → Check the orchestrator's delegate decisions

The tree structure of traces lets you do binary search — no need to step through everything.

### "The bill suddenly spiked"

Check per-agent token metering:
1. Sort all agents by total_tokens → find the big spenders
2. Was the big spender making too many tool calls? Or was the context too long (fork bloat)?
3. Was one agent running in a loop? Or were too many parallel agents spawned?

### "One agent is taking forever"

Sort by duration_ms:
1. Is the LLM response slow (model side)? Or is the tool call slow (external API)?
2. Is it waiting for another agent's result (mailbox blocking)?
3. Did it hit a rate limit and get throttled?

## Tool Selection

| Tool | Best for | Key feature |
|---|---|---|
| [LangSmith](https://smith.langchain.com/) | LangGraph / LangChain ecosystem | Native nested spans, playground replay |
| [Arize Phoenix](https://phoenix.arize.com/) | Any framework (OpenTelemetry) | Open source, embedding drift detection |
| [Sentry](https://sentry.io/) | Teams already using Sentry | AI module with token tracking, integrated with error monitoring |
| Custom trace table | Full control needed | Data in your own DB, can correlate with business logic |

If you use LangGraph, LangSmith is near-zero effort to integrate. If you're outside the LangChain ecosystem, OpenTelemetry-based solutions (Phoenix, custom) are more flexible. Sentry's advantage is having errors and traces in the same UI — no context-switching.

## Overall

The core principle of multi-agent observability is that **each agent is an independent unit of tracing**. Don't treat the entire multi-agent execution as a black box — record each agent's input, output, token consumption, and duration, then connect them in a tree structure.

Each layer answers a different question:
- Token metering: how much was spent, and on whom
- Execution trace: which step went wrong
- Real-time dashboard: how fast are we burning right now

A multi-agent system without observability is like microservices without APM — it runs, but when things break, you're in for a painful time.

## References

- [LangSmith — Tracing & Observability](https://smith.langchain.com/)
- [Arize Phoenix — Open-source LLM Observability](https://phoenix.arize.com/)
- [Sentry — AI Monitoring](https://sentry.io/for/ai/)
- [Claude Code — Dynamic Workflows (budget.remaining)](https://code.claude.com/docs/en/workflows)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenTelemetry — Semantic Conventions for LLM](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
