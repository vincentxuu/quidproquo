---
title: "Multi-Agent Communication: Handoff, Delegate, Mailbox, and the Push for Protocol Standards"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, agent, communication, handoff, mcp, a2a, anthropic, openai]
lang: en
tldr: "Agent-to-agent communication falls into three patterns: handoff (transfer control), delegate (dispatch and wait for results), and mailbox (real-time peer-to-peer messaging). Implementations vary widely, but MCP and A2A are driving protocol standardization."
description: "Part 5 of the Multi-Agent Systems in Practice series. Compares handoff, delegate, and mailbox communication patterns across Claude Code, Codex, and frameworks, plus the MCP/A2A standardization effort."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 5
---

Multi-agent collaboration is fundamentally a communication problem — who talks to whom, in what format, and who holds control after the exchange.

This post covers the three main inter-agent communication patterns, along with the emerging push for protocol standardization.

## Three Communication Patterns

### Handoff

**The source agent surrenders control entirely and goes dormant.**

Per the [OpenAI Agents SDK docs](https://developers.openai.com/api/docs/guides/agents/orchestration), handoff is the simplest pattern: Agent A decides "Agent B is better suited for this," transfers the entire conversation to B, and stops. Once B finishes, the conversation can return to A or move on to C.

In a multi-agent team context, handoffs are common in "customer service routing" scenarios — a generalist assistant receives a technical question and hands off to a specialist. LangGraph's [handoff pattern](https://langchain-ai.github.io/langgraph/) lets you define transfer conditions on graph edges.

Characteristics:
- Only one agent is active at a time
- Control is fully transferred, not "please do this one thing for me"
- Conversation history typically travels with control (similar to fork context)
- Cost is predictable — no parallel consumption

### Delegate

**The source agent dispatches a task to a target agent and waits for the result before continuing.**

Delegate is the most common pattern. Per [Anthropic's multi-agent patterns research](https://www.anthropic.com/research/multiagent-systems), the orchestrator-worker architecture revolves around delegation: the orchestrator breaks down tasks, dispatches them to workers, collects results, and synthesizes a response.

The key difference from handoff is that **the source agent retains control** — it can do other work while waiting (if parallelism is supported), or decide next steps once results arrive.

How different platforms implement it:
- **Claude Code**: Team Edge's `delegate` interaction type — the child agent executes and returns results to the parent
- **Codex**: `spawn_agent` + `wait_agent` — the manager dispatches work and can continue or wait
- **CrewAI**: The hierarchical process manager automatically delegates tasks to the best-suited agent

Delegate works well with the context_mode (fresh/fork) and result compression discussed in the previous post.

### Mailbox (Peer-to-Peer Messaging)

**Agents can send messages to each other at any time without going through a central dispatcher.**

This is the most flexible and least common pattern. It primarily appears in dynamic spawn scenarios — multiple parallel child agents need to exchange intermediate results without waiting for everyone to finish.

The typical implementation is an in-memory async queue: each agent has its own inbox, other agents can drop messages into it, and the recipient can check for new messages at any time.

Codex's six primitives include `send_message`, enabling direct communication between managers and workers. AutoGen 0.2's GroupChat is essentially a mailbox system — every agent can see all messages in the group.

Characteristics:
- Non-blocking — the sender fires and forgets, doesn't wait for a reply
- Decentralized — no orchestrator relay required
- Single-turn lifecycle — typically lives for one conversation turn and gets cleaned up afterward

### Comparing the Three Patterns

| | Handoff | Delegate | Mailbox |
|---|---|---|---|
| Control | Fully transferred | Source retains | No central control |
| Parallelism | Not supported | Supported | Supported |
| Typical use | Routing, expert transfer | Task dispatch, orchestrator-worker | Real-time coordination between parallel agents |
| Cost predictability | High | Medium | Low |
| Context sharing | Full history | Configurable (fresh/fork) | Message content only |

## Protocol Standardization: MCP and A2A

Currently, every platform's agent communication mechanism is proprietary — Claude Code's handoff/delegate doesn't interoperate with Codex's six primitives, and LangGraph's graph edges can't mix with CrewAI's processes.

Two standardization efforts are underway:

### MCP (Model Context Protocol)

Per [Anthropic's MCP documentation](https://modelcontextprotocol.io/), MCP defines a standard interface between agents and tools — tools, resources, and prompts. It solves "how agents invoke external capabilities," not "how agents talk to agents."

However, MCP indirectly affects multi-agent communication: when Agent A needs to call Agent B, B can be wrapped as an MCP tool. Per the [OpenAI Agents SDK's agents-as-tools pattern](https://developers.openai.com/api/docs/guides/agents/orchestration), one agent can be registered as another agent's tool — invoked just like any regular tool.

This isn't true agent-to-agent communication (B doesn't know A exists), but it standardizes the delegate pattern.

### A2A (Agent-to-Agent Protocol)

Per the [A2A protocol survey (arXiv 2505.02279)](https://arxiv.org/abs/2505.02279), Google's A2A protocol (proposed in 2025) specifically addresses inter-agent communication: capability discovery ("what can you do"), task delegation ("do this for me"), and state synchronization ("here's my progress").

The key difference from MCP: MCP is an agent ↔ tool interface; A2A is an agent ↔ agent interface. In MCP, the callee is a passive tool. In A2A, both parties are autonomous agents.

A2A is still in early stages with low production adoption. But it represents a direction: multi-agent systems need a universal communication protocol, otherwise switching frameworks means reimplementing all communication logic.

## Decision Tree

When choosing a communication pattern:

```
Do you need to surrender control?
  ├─ Yes → Handoff (routing scenarios)
  └─ No → Do you need real-time exchange of intermediate results?
           ├─ Yes → Mailbox (parallel coordination)
           └─ No → Delegate (orchestrator-worker)
```

**Delegate** covers most scenarios. Reserve handoff for genuine routing needs (customer service, expert escalation). Only introduce mailbox when parallel agents truly need real-time coordination — the added complexity is significant, and debugging is painful.

## The Bottom Line

The core tradeoff in inter-agent communication is **control vs. flexibility** — handoff is the most disciplined (one active agent at a time), delegate balances control with parallelism, and mailbox is the most flexible but hardest to debug.

There's no unified communication standard yet. MCP is becoming the de facto standard for agent ↔ tool interactions; A2A is attempting to become the agent ↔ agent standard but adoption remains low. In the short term, choosing a communication pattern means choosing a framework — switching frameworks means rewiring everything.

## References

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Anthropic — Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [OpenAI — Agents SDK orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)
- [OpenAI — Codex GA announcement](https://openai.com/index/codex-now-generally-available/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [CrewAI — Processes](https://docs.crewai.com/en/concepts/processes)
- [A Survey of Agent Interoperability Protocols: MCP, ACP, A2A, ANP (arXiv 2505.02279)](https://arxiv.org/abs/2505.02279)
- [A Technical Taxonomy of LLM Agent Communication (arXiv 2606.19135)](https://arxiv.org/abs/2606.19135)
