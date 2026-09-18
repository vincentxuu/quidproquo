---
title: "The Multi-Agent Landscape: How Every Major Coding Agent Does Multi-Agent Collaboration in 2026"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, agent, anthropic, openai, google, antigravity, microsoft-agent-framework, langgraph, crewai, agent-cli]
lang: en
tldr: "By 2026 nearly every mainstream coding agent supports subagents. Design philosophies split three ways: deterministic scripted orchestration (Claude Code Workflow), model-driven autonomy (Codex, Devin), and IDE command-center integration (Windsurf 2.0, VS Code). This overview maps product positioning, a capability matrix, and the design-philosophy spectrum."
description: "Series overview for Multi-Agent Systems in Practice. Covers Claude Code, Codex, Antigravity (formerly Gemini CLI), Cursor, Windsurf, Devin, LangGraph, and CrewAI subagent models and orchestration approaches, with a capability matrix and design-philosophy spectrum."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 1
---

In 2026, "letting an AI agent call another AI agent for help" has gone from experimental feature to table stakes. From CLI tools to IDEs, open-source frameworks to cloud services, nearly every player offers some form of multi-agent support.

But the design philosophies vary wildly — some let you write JavaScript scripts to control every step precisely, while others let the LLM decide on its own whether to spawn a subagent. This is the series overview for Multi-Agent Systems in Practice, mapping each product's positioning and capabilities to help you decide which model fits your use case.

## CLI / Terminal Agents

### Claude Code (Anthropic)

According to the [official Anthropic documentation](https://code.claude.com/docs/en/workflows), Claude Code's multi-agent system has four layers:

1. **Subagents** — Fork (inherits full context + shares prompt cache) or Fresh (zero context, independent judgment)
2. **Skills** — Predefined prompt-template-driven tasks
3. **Agent Teams** — A small number of peer sessions negotiating in real time
4. **Dynamic Workflows** — Deterministic JS-scripted orchestration, currently the most complete multi-agent orchestration system

Workflows provide five core primitives: `pipeline()` (per-item pipeline, no barrier), `parallel()` (barrier sync), `agent({schema})` (structured output), `phase()` / `log()` (progress grouping), and `budget.remaining()` (token budget tracking). A single run supports up to 1,000 agents with 16 concurrent, and resume after interruption.

Claude Code's distinguishing feature is **supporting both scripted and model-driven modes simultaneously** — Workflows handle deterministic processes while Subagents and Agent Teams handle autonomous exploration.

### Codex CLI (OpenAI)

According to the [official Codex announcement](https://openai.com/index/codex-now-generally-available/) (GA March 2026), Codex follows a Manager / Worker model. The manager agent makes decisions and controls workers with six primitives: `spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `list_agents`, `close_agent`.

Three built-in agent types: `default`, `worker` (implementation-oriented), and `explorer` (read-only exploration). Defined in `.codex/agents/<name>.toml` or `AGENTS.md`.

[Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) is OpenAI's open-source orchestration layer that uses Linear as a control plane to map issues to Codex agents — but this is an always-on issue-driven model, not in-session multi-agent.

### Antigravity (formerly Gemini CLI, Google)

Gemini CLI was officially retired on 2026-06-18 and renamed to [Antigravity](https://github.com/google-gemini/gemini-cli/discussions/27274), rewritten in Go with new multi-agent background orchestration. The existing subagent architecture carries over the Hub-and-Spoke model: the main agent dispatches using `@agent` syntax, with built-in `@generalist`, `@cli_help`, and `@codebase_investigator` agents.

Antigravity's distinguishing feature is **compressing results before returning them to the main session**, preventing subagent output from polluting the parent context. Each subagent has its own independent context and tool set.

### Aider

Currently **no multi-agent support**. Single-agent sequential processing; its strength is being extremely lightweight and supporting nearly every LLM vendor. The community has proposed `/spawn` and `/delegate` but neither is implemented yet.

## IDE Agents

### Cursor

According to the [Cursor 3.2 changelog](https://cursor.com/changelog) (April 2026), Cursor is shifting from "editor" to "agent execution runtime":

- **Subagents** (Cursor 2.4, Jan 2026): Spawn multiple independent-context Claude instances running in parallel
- **/multitask** (Cursor 3.2): Automatically breaks large tasks into chunks and assigns them to subagents
- **Background Agents**: Run in cloud sandboxes, producing output as PRs for review

### Windsurf (Codeium → acquired by Devin)

Windsurf's strategy is **not to build its own multi-agent orchestration but to serve as a command center**:

- **Cascade**: Core agent, persistent context-aware, breaks tasks into Flows
- **Wave 13** (Dec 2025): Parallel multiple Cascade sessions (up to 5), each with git worktree isolation
- **Windsurf 2.0** (April 2026): [Agent Command Center](https://devin.ai/blog/windsurf-2-0) (Kanban-style multi-agent dashboard) + native Devin integration

Cascade handles real-time local work (low latency); long-running tasks are handed off to Devin's cloud VM with one click.

### VS Code Agent Sessions (Microsoft)

VS Code 1.109 (Feb 2026) introduced Multi-Agent Development, allowing multiple different agents to run in parallel within the same IDE — mix and match Copilot + Claude + Codex. This is an **IDE-layer** multi-agent framework, not any individual agent's subagent architecture.

## Cloud / Async Agents

### GitHub Copilot Coding Agent

Each task runs in a GitHub Actions runner sandbox: receive Issue → work autonomously → produce PR. **No native subagent support**; multi-agent capabilities come from VS Code Agent Sessions.

### Jules (Google)

Each task executes in a Google-managed independent cloud VM. Four internal stages: Planning (Gemini 2.5 Pro) → Execution → [Critique](https://jules.google/docs/changelog/2025-08-083/) (added Aug 2025) → Testing. Officially described as "internal workflow stages"; users don't directly control the orchestration.

### Devin (Cognition)

[Fusion architecture](https://cognition.com/blog/devin-fusion) (June 2026): Two parallel agents — a frontier "lead" model + a cheaper "sidekick" model, each with independent toolsets and context. Full VM with desktop, browser, and computer-use capabilities.

## Multi-Agent Development Frameworks

### LangGraph (LangChain)

[Graph state machine](https://langchain-ai.github.io/langgraph/): State (snapshot) → Node (execution) → Edge (flow). Four modes: subagents (supervisor delegation), handoffs (transfer), routers (routing), and custom workflows. According to [LangChain's official benchmark](https://www.langchain.com/blog/benchmarking-multi-agent-architectures), mixing model tiers can reduce costs.

### CrewAI

[Role-playing framework](https://docs.crewai.com/): Each Agent has a role, goal, and backstory. Two process types: sequential and hierarchical (manager auto-delegates). Fastest-growing community in 2026.

### Microsoft Agent Framework (MAF)

GA in April 2026, merging AutoGen + Semantic Kernel. AutoGen entered [maintenance mode](https://github.com/microsoft/autogen/discussions/7066). Supports sequential / concurrent / handoff / group chat / Magentic-One orchestration patterns, with graph-based workflows for explicit multi-agent orchestration.

The original AutoGen community fork [AG2](https://github.com/ag2ai/ag2) continues independent development, preserving the 0.2 API.

## Capability Matrix

| Capability | Claude Code | Codex | Cursor | Windsurf | Antigravity | Copilot | Jules | Devin |
|---|---|---|---|---|---|---|---|---|
| Subagent | Fork + Fresh | 6 primitives | /multitask | Multi Cascade | @agent | — | Internal 4-stage | Fusion |
| Scripted orchestration | JS Workflow | — | — | — | — | — | — | — |
| Model-driven | Agent Teams | Manager/Worker | Parent/Child | Cascade Flows | Hub-and-Spoke | — | Internal | Orchestrator |
| Context inheritance | Fork inherits | Independent | Independent | Cascade persistent | Compressed return | — | — | Independent |
| Structured output | `agent({schema})` | — | — | — | — | — | — | — |
| Budget tracking | `budget.remaining()` | — | — | — | — | — | — | — |
| Cloud agent | remote | Sandbox container | Background | Devin VM | — | Actions runner | Google VM | Full VM |

## Design Philosophy Spectrum

Who controls orchestration? From left (deterministic script) to right (fully model-autonomous):

```
Deterministic Script ◄──────────────────────────────────► Model-driven Autonomy

LangGraph    Claude Code    CrewAI    Cursor    Codex    Devin    AutoGen
  Graph SM    Workflow       Roles+    /multitask  Manager   Fusion   GroupChat
              JS script     Delegation            /Worker   lead/    Free chat
                                                  sidekick
```

**The scripted camp** treats orchestration as infrastructure — deterministic flow, resumable, budget-trackable. Suited for repeatable, auditable workflows.

**The model-driven camp** lets the LLM autonomously decide when to spawn and aggregate. Highly flexible but unpredictable; suited for exploratory tasks.

**The hybrid camp** (Windsurf 2.0, VS Code) doesn't build its own orchestration but serves as a "command center" integrating agents from multiple vendors.

Another trend is **internal multi-agent** — Jules's 4-stage pipeline and Devin's lead/sidekick present a single-agent interface to users while multiple specialized agents collaborate internally.

## Series Guide

This is the first article in the Multi-Agent Systems in Practice series. Subsequent articles dive deep into individual topics:

- **Cost Control**: How parallel spawning + nesting depth burns money, defense mechanisms from seven frameworks, the industry consensus of "soft landing before hard stop"
- **Orchestration Patterns**: Scripted vs model-driven vs hybrid — how to choose
- **Context Isolation and Sharing**: fork vs fresh, history truncation, result compression
- **Agent Communication**: Mailbox, handoff, delegate, and the A2A/MCP protocols
- **Observability**: How to debug multi-agent systems and know where the money goes
- **Safety and Guardrails**: Preventing prompt injection from propagating across agents, permission isolation

## References

- [Anthropic — Claude Code Workflows official docs](https://code.claude.com/docs/en/workflows)
- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Anthropic — Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [OpenAI — Codex GA official announcement](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony open-source orchestration layer](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [OpenAI — Agents SDK orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)
- [Antigravity (formerly Gemini CLI) — Retirement and migration announcement](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Antigravity — Subagents docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md)
- [Google — Jules Critique stage update](https://jules.google/docs/changelog/2025-08-083/)
- [Cognition — Devin Fusion architecture](https://cognition.com/blog/devin-fusion)
- [Cursor — Changelog](https://cursor.com/changelog)
- [Windsurf — Agent Command Center (2.0)](https://devin.ai/blog/windsurf-2-0)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [Microsoft — AutoGen enters maintenance mode](https://github.com/microsoft/autogen/discussions/7066)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [CrewAI Documentation](https://docs.crewai.com/)
- [AG2 — Community fork of AutoGen](https://github.com/ag2ai/ag2)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
- [VILA-Lab — Dive into Claude Code (arXiv 2604.14228)](https://arxiv.org/abs/2604.14228)
