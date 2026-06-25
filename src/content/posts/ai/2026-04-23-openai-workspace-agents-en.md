---
title: "OpenAI Workspace Agents: From Custom GPTs to a Team Automation Platform"
date: 2026-04-23
category: ai
tags: [openai, chatgpt, agent, workspace-agents, codex, enterprise-ai]
lang: en
tldr: "On 2026/4/22 OpenAI launched Workspace Agents — powered by Codex, capable of long-running cloud execution, and integrating with Slack/Salesforce/Google Drive. They are the enterprise successor to Custom GPTs."
description: "The design philosophy, core capabilities, differences from Custom GPTs, integration ecosystem, governance mechanisms, ideal use cases, and limitations of Workspace Agents."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-23-openai-workspace-agents)

On April 22, 2026, OpenAI pushed ChatGPT a major step beyond "chatbot" territory by launching **Workspace Agents** — an AI agent framework for enterprises and teams. Powered by Codex, these agents can autonomously execute tasks in the cloud over extended periods and plug directly into Slack, Salesforce, Google Drive, Microsoft 365, Notion, Atlassian, and more. OpenAI simultaneously announced that Custom GPTs will be **gradually deprecated** for enterprise plans — Business / Enterprise / Edu / Teachers users will eventually need to upgrade their existing GPTs to workspace agents.

## Design Philosophy: Not a Better Chatbot, but an AI Employee for Your Team

The mental model behind Custom GPTs was "user asks a question → GPT replies synchronously." Workspace Agents break that assumption: an agent is a **shared, cloud-native role for the team** that can be scheduled, attached to a Slack channel to receive requests, and continue working while users are offline.

This brings several structural changes:

- **Shared, not personal**: An agent is an organizational asset — one person builds it, the whole team uses and improves it together.
- **Long-running execution**: No longer a few seconds of back-and-forth, but workflows spanning minutes to hours.
- **Cross-tool orchestration**: Beyond just generating text — agents browse the web, fill out forms, edit spreadsheets, send emails, and open IT tickets.

An analogy: Custom GPTs were like Slack slash commands; Workspace Agents are more like Zapier + Slackbot + Codex combined.

## Powered by Codex

Workspace Agents are built on Codex (OpenAI's coding agent), which is a critical technical decision. Codex already excels at "executing multi-step tasks in an environment, observing results, and course-correcting" — a capability that maps perfectly onto enterprise workflows. Common capabilities include:

- Writing/replying to emails, compiling reports, drafting presentations
- Writing code, code review, refactoring, migrations (inheriting Codex's strengths)
- Browsing websites, filling out forms, scraping data
- Editing Google Sheets / Excel
- Pulling context from emails, document repositories, and CRMs

Because memory lives within the agent itself, users can correct the agent in conversation, and the agent improves over time — much closer to "training a colleague" than the one-shot instructions of Custom GPTs.

## Differences from Custom GPTs

| Dimension | Custom GPTs | Workspace Agents |
|---|---|---|
| Execution model | Synchronous reply | Long-running autonomous cloud execution |
| Collaboration | Primarily individual use | Organization-shared, team-improved |
| Tool integration | Limited actions | Native Slack / Salesforce / Drive / Notion |
| Trigger mechanism | User starts a conversation | Conversation + scheduling + passive Slack listening |
| Governance | Basic permissions | Tool/data/action permissions + human approval gates |
| Foundation | GPT | Codex |

For enterprise IT, Custom GPTs were "toys wrapped in prompts." Workspace Agents finally start to look like "auditable, governable" enterprise software.

## Governance and Approval: Human-in-the-Loop

The most notable product decision in Workspace Agents is **approval gating**. Users or admins can configure which actions the agent can perform autonomously and which require human approval first.

Typical actions requiring approval:

- Sending emails
- Editing/overwriting spreadsheets
- Creating calendar events
- Issuing purchase orders or IT tickets

One example from OpenAI's official materials is a "software procurement review agent" — it automatically triages new tool requests, checks company policies, routes to the appropriate reviewer, and opens an IT ticket upon approval. This kind of workflow previously required Workato / ServiceNow plus a bunch of glue code; now a single agent handles it.

## Deployment and Scheduling

Agents have three typical deployment modes:

```
┌─────────────────────────────────────────────────────┐
│ 1. Direct conversation in ChatGPT (synchronous)     │
│    User → agent → response                          │
│                                                     │
│ 2. Passive Slack trigger (event-driven)              │
│    Slack message → agent processes in background →   │
│    reports results                                   │
│                                                     │
│ 3. Scheduled tasks (cron-like)                       │
│    Every Monday 9am → agent pulls data → generates   │
│    weekly report → posts to #team-metrics            │
└─────────────────────────────────────────────────────┘
```

Mode 3 is particularly interesting: this kind of work previously had to be done manually or maintained by engineers writing scripts. Now it becomes "configure once, runs automatically."

## Pricing and Availability

- **Research preview**: Available to ChatGPT Business / Enterprise / Edu / Teachers.
- **Free until 2026/5/6**, after which credit-based pricing (usage-based billing) applies.
- The entry-level Business plan starts at $20 / user / month; Enterprise / Edu pricing is negotiated separately.

Credit-based pricing actually makes sense for enterprises — long-running execution, cross-tool invocations, and large-scale data processing are more fairly priced by actual workload than by flat subscription. However, it also means "an agent running overnight" could generate a substantial bill, requiring admins to set budgets.

## When to Use — and When Not To

**Good fit**:
- Highly repetitive workflows spanning multiple SaaS tools (e.g., weekly/monthly reports, approval processes)
- Roles that need memory and evolution (e.g., customer service triage, compliance checks)
- Tasks that can tolerate minute-level latency in exchange for more complete output

**Not a good fit**:
- Interactions requiring ultra-low latency (millisecond-level APIs)
- System integrations requiring deterministic output (agent decisions have inherent randomness)
- Scenarios involving highly sensitive data where regulations require data to stay on-premises (still runs on OpenAI's cloud)

## The Big Picture

The real significance of Workspace Agents isn't "yet another AI product" — it's OpenAI betting on a thesis: **the future unit of enterprise AI consumption is the "agent," not the "conversation."** The deprecation of Custom GPTs, Codex permeating down into workflows, and deep Slack/Salesforce integrations all point in the same direction.

For teams, the actionable question right now is: which repetitive tasks could be handed off to a "shared, memory-equipped, cross-tool" agent? Your answer to that question will determine how much leverage AI delivers to your organization over the next year or two.

## References

- [Introducing workspace agents in ChatGPT | OpenAI](https://openai.com/index/introducing-workspace-agents-in-chatgpt/)
- [OpenAI updates ChatGPT with Codex-powered 'workspace agents' for teams | 9to5Mac](https://9to5mac.com/2026/04/22/openai-updates-chatgpt-with-codex-powered-workspace-agents-for-teams/)
- [OpenAI unveils Workspace Agents, a successor to custom GPTs for enterprises | VentureBeat](https://venturebeat.com/orchestration/openai-unveils-workspace-agents-a-successor-to-custom-gpts-for-enterprises-that-can-plug-directly-into-slack-salesforce-and-more)
- [OpenAI launches workspace agents that turn ChatGPT into a team automation platform | The Decoder](https://the-decoder.com/openai-launches-workspace-agents-that-turn-chatgpt-from-a-chatbot-into-a-team-automation-platform/)
- [Building workspace agents in ChatGPT (cookbook) | OpenAI Developers](https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
