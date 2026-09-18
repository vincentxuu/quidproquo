---
title: "Multi-Agent Orchestration Patterns: Scripted, Model-Driven, or Hybrid — How to Choose"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, orchestration, agent, langgraph, crewai, anthropic, openai, agent-cli]
lang: en
tldr: "Multi-agent orchestration splits into three camps: scripted determinism (LangGraph, Claude Code Workflow) is predictable but rigid, model-driven (Codex, Devin) is flexible but unpredictable, and hybrid (Windsurf 2.0) acts as a command center integrating multiple agents. The choice depends on how much predictability you need."
description: "Part 3 of the Multi-Agent Systems in Practice series. Compares scripted, model-driven, and hybrid orchestration philosophies from LangGraph to Devin, with a decision tree for choosing."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 3
---

You've decided to have multiple agents collaborate. The next question is: **who decides what happens next?**

Do you write a script that precisely controls every step? Let the LLM decide on its own whether to spawn sub-agents? Or skip orchestration altogether and act as a command center, letting each agent do its thing?

This choice determines your system's predictability, cost controllability, and development complexity.

## Three Orchestration Philosophies

```
Deterministic Script ◄─────────────────────────────────────► Model-driven Autonomy

LangGraph    Claude Code    CrewAI    Cursor    Codex    Devin    AutoGen
  Graph FSM   Workflow      Roles+    /multitask  Manager   Fusion   GroupChat
              JS Script     Delegate            /Worker   lead     Free dialog
                                                         /sidekick
```

### The Scripted Camp: Developer Controls the Flow

**Representatives**: LangGraph, Claude Code Dynamic Workflow

The core idea is to treat multi-agent orchestration as **infrastructure**, not improvisational theater for LLMs.

[LangGraph](https://langchain-ai.github.io/langgraph/) uses a graph state machine: you define State (data snapshots), Node (what each agent does), and Edge (routing conditions). Each node is a discrete LLM call, and the graph topology determines the maximum number of calls and cost. According to [LangChain's benchmark](https://www.langchain.com/blog/benchmarking-multi-agent-architectures), explicit graph structures make costs the most predictable.

[Claude Code Workflow](https://code.claude.com/docs/en/workflows) uses JavaScript scripts: `pipeline()` for sequential processing, `parallel()` for barrier synchronization, `agent({schema})` for structured output. Intermediate results live in JS variables rather than LLM context, so there's no context bloat. Plus, `budget.remaining()` lets scripts query the remaining token budget directly and decide whether to keep spawning.

**Strengths**: Predictable, resumable, auditable, cost-controllable
**Weaknesses**: Rigid — scripts don't adapt when encountering unexpected situations

Best for: CI/CD flows, code review pipelines, batch data processing — anything where you can define the steps upfront.

### The Model-Driven Camp: LLM Decides Autonomously

**Representatives**: Codex Manager/Worker, Devin Fusion, AutoGen GroupChat

The core idea is to **let the LLM decide when it needs help**. Developers provide tools (spawn, send_message, wait); the LLM decides whether to use them.

[Codex](https://openai.com/index/codex-now-generally-available/)'s Manager agent decides each turn whether to `spawn_agent` and when to `wait_agent` for results. Six primitives (spawn / send_message / followup_task / wait / list / close) form the manager's toolbox.

[Devin Fusion](https://cognition.com/blog/devin-fusion) goes further: the lead model autonomously decides which tasks to hand off to a cheaper sidekick model, each with independent toolsets and context.

The now-maintenance-mode AutoGen GroupChat is the most extreme example — multiple agents freely chat in a group, a selector determines who speaks, and conversation history serves as state. Maximum flexibility, but this also led to [community-reported 40% budget overruns](https://github.com/microsoft/autogen/discussions/7066).

**Strengths**: Flexible, handles unexpected situations, fast to develop
**Weaknesses**: Unpredictable — the same prompt may spawn different numbers of agents each time, with high cost variance

Best for: Exploratory research, open-ended problems, tasks requiring agent "judgment" rather than "execution."

### The Hybrid Camp: IDE as Command Center

**Representatives**: Windsurf 2.0, VS Code Agent Sessions

The core idea is to **not build your own orchestration, but integrate multiple agents**.

[Windsurf 2.0](https://devin.ai/blog/windsurf-2-0)'s Agent Command Center is a Kanban-style dashboard — Cascade (local agent) handles real-time completions and context-aware debugging, while long-running tasks are handed off to Devin (cloud VM) with one click. VS Code 1.109 lets you mix Copilot + Claude + Codex in the same IDE.

This isn't "orchestration" in the traditional sense — it's more like **dispatch**. Each agent maintains its own subagent architecture and cost controls; the IDE just assigns tasks and aggregates results.

**Strengths**: No vendor lock-in, agents complement each other's strengths
**Weaknesses**: No shared context, cross-agent result integration is manual

Best for: Teams where different members prefer different tools, or where different tasks suit different agents.

## How to Choose

The key question isn't "which framework is better" but "how much predictability do you need":

| Ask Yourself | If Yes | Recommendation |
|---|---|---|
| Will this process run repeatedly? | Yes (CI, batch, review pipeline) | Scripted |
| Can you define all steps upfront? | Yes | Scripted |
| Is the task open-ended? | Yes (research, exploration, debugging) | Model-driven |
| Is cost variance zero-tolerance? | Yes | Scripted (graph structure caps max LLM calls) |
| Do you need to mix agents from different vendors? | Yes | Hybrid |

In practice, most teams go with a **scripted + model-driven hybrid** — the outer layer uses scripts to control the overall flow (analyze first, then implement, then review), while each step internally lets the LLM act autonomously. Claude Code itself follows this pattern: Workflow is the script layer, and the LLM within each `agent()` call is the autonomous layer.

## Orchestration Is Not a One-Time Choice

It's worth noting that according to [Google Research](https://arxiv.org/abs/2512.08296) (a systematic experiment with 180 agent configurations), independent multi-agents (each running without coordination) amplified errors by 17.2×, while centralized coordination brought it down to 4.4×.

This means: **the more model-driven a system is, the more it needs some form of centralized supervision**. Pure autonomy ≠ good; disciplined autonomy is what works.

As system complexity grows, many teams gradually migrate from model-driven toward scripted — not because scripts are inherently better, but because when things go wrong, you need a deterministic flow you can replay and debug.

## The Bottom Line

Choosing an orchestration pattern is fundamentally a **predictability vs. flexibility** tradeoff. The scripted camp sacrifices flexibility for control, model-driven sacrifices control for flexibility, and hybrid sacrifices integration effort for vendor diversity.

No single pattern fits every scenario. But if you're just getting started with multi-agent systems, start with the scripted camp — at least you'll know what the system will do and how much it'll cost. Once you have enough observability data on costs and behavior, gradually loosen the controls.

## References

- [Anthropic — Claude Code Workflows](https://code.claude.com/docs/en/workflows)
- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [OpenAI — Codex GA announcement](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony open-source orchestration layer](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [Cognition — Devin Fusion architecture](https://cognition.com/blog/devin-fusion)
- [Windsurf — Agent Command Center (2.0)](https://devin.ai/blog/windsurf-2-0)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Microsoft — AutoGen entering maintenance mode](https://github.com/microsoft/autogen/discussions/7066)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
