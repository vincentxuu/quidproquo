---
title: "CS146S Week 9: One Person Wiring Up MCP Is Fine; Three Hundred Need a Gate"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - mcp
  - ai-agent
  - orchestration
  - pricing
  - developer-experience
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 10
tldr: "How an individual connects tools is a preference; how an organization does it is governance — who can touch what data, where keys live, whose budget it lands on. Anthropic's published record of ten internal teams contains a good indicator: security engineering accounts for 50% of all custom slash commands in the entire monorepo. Adoption doesn't spread evenly; it takes off first in teams that already build their own tools."
description: "Stanford CS146S Fall 2026 Week 9, 'Building an AI-Native Team': MCP portals and centralized permissioned tool access, LLM gateways and model routing, the three sources of agent cost, and what ten Anthropic teams actually reported."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-ai-native-team)

This is the tenth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 9 of Fall 2026.

Three topics: MCP portals and centralized, permissioned tool access; LLM gateways, model routing, and cost optimization; org-wide adoption patterns. The session is "Coding agents in big teams."

This week handles what the first eight sidestepped: **what happens when the user is a company rather than a person.**

## Where "everyone wires their own" breaks

One engineer connecting five MCP servers on their laptop is fine. Three hundred engineers each doing it grows five problems at once:

- **Permissions**: who can read the production database through an agent? Nobody knows, because the config lives on three hundred laptops
- **Keys**: API keys sit in individual config files, and rotating one means notifying the whole company
- **Audit**: after an incident, you can't answer "what did the agent touch that day"
- **Duplication**: the same internal service gets wrapped in seven MCP servers whose behavior drifts apart
- **Cost**: the bill is one number and can't be attributed to a team or a task

None of these is AI-specific — they are the API governance problems of the 2010s. The difference is speed: an agent can generate a month of human call volume in a day.

## What the centralized layer manages

The course calls it a portal. Whether it's a portal, a gateway, or a registry, the responsibilities are fixed:

| Responsibility | Concretely |
|---|---|
| Catalog | Which servers exist internally, and who maintains them |
| Authorization | Which teams/roles can use which tools on which servers |
| Credential custody | Keys live in the portal, not on individual machines |
| Audit | Every tool call logged with who, when, and what |
| Versioning | Server upgrades don't require everyone to reconfigure |

MCP shipped a [public registry preview](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) in September 2025, which handles the "how do I find a server" half; an internal portal handles the "who may use it" half.

Anthropic's own Data Infrastructure team, in its [internal usage record](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf), gives exactly this reasoning:

> They recommend using MCP servers rather than the BigQuery CLI to maintain better security control over what Claude Code can access, especially for handling sensitive data that requires logging or has potential privacy concerns.

**They chose MCP over a CLI for control and logging, not convenience.** For an individual the CLI is faster; for an organization the loggable path is the only viable one.

## Too many tools is itself a cost

Centralization creates a new problem: eighty servers and six hundred tools on the portal, and every agent loading all those definitions at startup.

Anthropic measured this in [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp): at scale, presenting tools as code APIs on a filesystem so the agent loads them on demand "reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%."

So a portal design carries an easily missed requirement: **it must let agents load only the tools they need**, rather than pushing the whole catalog. Search-based tool discovery — search first, then load definitions — is far more practical than bulk loading. It's the same mechanism as [Week 3's three-level progressive disclosure](/posts/ai/2026-08-16-cs146s-agent-skills-en), one layer up.

## LLM gateways and model routing

A gateway is the model-call counterpart, with a similar list: single entry point, keys off devices, quotas and rate limits, per-team attribution, and observability (latency, errors, token distribution).

Model routing is a capability layered on the gateway — different tasks to different models. A reasonable split:

- Mechanical, verifiable tasks (format conversion, scaffolding) → cheap fast models
- Tasks requiring cross-file reasoning → frontier models
- High-volume batch work → cheap models plus deterministic validation loops as the gate

**But routing has an overlooked prerequisite**: you must be able to measure whether the cheap model is good enough for that task. Routing without evaluation returns the savings as debugging time — which is why the course puts [Week 5's validation loops](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en) first.

Agent token cost comes from three places; identify yours before optimizing:

1. **Tool definitions** — resent every turn, costlier the more tools you have
2. **Intermediate results** — tool output passes through context, and large files pass twice
3. **Retries** — failed paths bill the same, and are usually the longest ones

The third is the most overlooked: **worse feedback loops mean more retries, which means higher cost**. Compressing CI from ten minutes to five seconds isn't just ergonomics — it shows up on the invoice.

## What org adoption actually looks like

Anthropic published a record of how ten internal teams use Claude Code, covering data infrastructure, product development, security engineering, inference, data science, API, growth marketing, product design, RL engineering, and legal. A few figures (all **self-reported**, with no external verification):

- Security engineering "uses 50% of all custom slash command implementations in the entire monorepo"
- On features like Vim mode, product development reports "roughly 70% of the final implementation came from Claude's autonomous work"
- The inference team's incident triage went from "10-15 minutes of manual code scanning" to about 5 minutes
- Growth marketing's ad copy production went from 2 hours to 15 minutes

The most useful part isn't the multipliers — it's that **the distribution is extremely uneven**. One team accounting for half the company's custom commands tells you adoption doesn't diffuse evenly: it takes off first in teams that already build their own tooling, and everyone else waits for that tooling to be abstracted into something shareable.

Which suggests a very practical strategy for whoever is driving adoption: **skip the company-wide training, find the team already building its own tools, and turn what they built into shared assets.**

The practices that recur throughout the document line up with earlier weeks:

- "Create self-sufficient loops" — have Claude verify its own work by running builds, tests, and lints ([Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en))
- The better documented your CLAUDE.md, the better it performs ([Week 4](/posts/ai/2026-08-16-cs146s-agent-customization-en))
- Break complex workflows into specialized sub-agents rather than one prompt, which debugs better ([Week 4](/posts/ai/2026-08-16-cs146s-agent-customization-en))

And one refreshingly honest one: the inference team treats it like a "slot machine" — commit your state, let it run for 30 minutes, then **either accept the result or start fresh** rather than wrestling with corrections. That is the most usable rule I've seen for when to abandon an agent run.

## Three antipatterns

- **Buying a gateway before deciding what to govern.** Tooling doesn't fix "nobody knows who should have which permissions"
- **Optimizing cost before building evaluation.** The savings come back as debugging time
- **Using a company-wide average as your metric.** As in [Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en), "what fraction of teams cleared the bar" beats "average score"

## What will go stale

- Anthropic's internal usage figures are self-reported, single point in time, single company
- The MCP registry and enterprise portal product landscape moves fast; this post covers responsibilities, not products
- Model pricing and capability tiers reshuffle every few months, so routing strategy needs re-validation

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 9 topics and session
- [How Anthropic Uses Claude Code](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf) — Anthropic, ten internal teams, assigned in Fall 2025 Week 4
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) — Anthropic Engineering, on tool definition cost and the fix
- [MCP Registry preview](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) — assigned in Fall 2025 Week 2
- [MCP Server Authentication](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication) — Cloudflare, authorization design for remote MCP servers, assigned in Fall 2025 Week 2
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, on feedback loop quality and retry cost
