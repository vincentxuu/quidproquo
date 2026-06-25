---
title: "Claude for Financial Services: Dissecting Anthropic's Multi-Agent Reference Implementation"
date: 2026-05-09
category: ai
tags: [claude, agents, mcp, rag, langgraph, multi-agent]
lang: en
tldr: "Anthropic open-sourced 12 financial-industry Agents and 11 MCP connectors. The real takeaway isn't the Agents themselves but the layered design of 'one prompt, two runtimes' and 'pure-file extensibility.'"
description: "A teardown of the anthropics/financial-services repo's dual-deployment model, Named Agent decomposition logic, and MCP connector swap philosophy, compared against quidproquo's LangGraph planner-research-writer-critic architecture, with actionable design trade-offs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-claude-for-financial-services)

Anthropic released [`anthropics/financial-services`](https://github.com/anthropics/financial-services) in early 2026: a collection of Agent reference implementations purpose-built for investment banking, research, private equity, wealth management, and fund administration. 17K stars, 12 Named Agents, 11 data-vendor MCP connectors, all documentation in markdown/YAML with no build step.

Treating it as a "finance industry demo" misses the point. What's really worth reading in this repo is its **layered design** -- the same prompt runs on two runtimes, Agents are assembled from files, and connectors are swappable. Any team building RAG or multi-agent systems can steal structural decisions from here.

## Dual Deployment: One Prompt, Two Runtimes

The repo's first key design is "runtime decoupled from prompt."

```
plugins/
├── agent-plugins/           # Prompts + skills for 12 Named Agents
├── vertical-plugins/        # Skill bundles packaged by vertical
└── managed-agent-cookbooks/ # Headless deployment recipes
```

The same Pitch Agent can be deployed two ways:

- **Cowork Plugin**: Users paste the GitHub URL in Claude Web UI's Settings → Plugins for interactive, conversational use
- **Managed Agents API**: Runs headless via `POST /v1/agents`, with `scripts/deploy-managed-agent.sh` for one-click deployment to a backend service

Both modes **share the same system prompt and skill definitions**. You choose the runtime environment, not rewrite the Agent.

The trade-off is clear: they separate "the Agent's personality and capabilities" (prompt + tools) from "how the Agent executes" (interactive vs. batch, stateful vs. stateless). By contrast, most teams write one prompt for the chat endpoint and another for batch jobs, and the two gradually drift apart until no one dares touch either.

The takeaway for RAG systems: your `chat.ts` SSE endpoint and any future `POST /api/agent/run` batch endpoint should share the same graph definition. The only difference should be the streaming output transport, not the agent logic itself.

## 12 Named Agents: Workflow as the Unit of Decomposition

The repo organizes Agents into four business categories, but the more noteworthy detail is the granularity -- each Agent is an **end-to-end workflow**, not a single skill.

| Category | Agents |
|----------|--------|
| Coverage & Advisory | Pitch Agent, Meeting Prep |
| Research & Modeling | Market Researcher, Earnings Reviewer, Model Builder |
| Fund Admin & Finance Ops | Valuation Reviewer, GL Reconciler, Month-End Closer, Statement Auditor |
| Ops & Onboarding | KYC Screener |

For example, `GL Reconciler` (general ledger reconciliation) isn't "a tool that compares numbers." It's an Agent covering the entire flow of "pull data → classify discrepancies → flag anomalies → produce a reconciliation report." Each Named Agent maps to an analyst's job responsibility, not a single function.

Compare this with the common approach of splitting Agents into **skill units** like `summarizer`, `extractor`, `reranker`. Anthropic chose **responsibility units** instead. Skill units are suited for building libraries that other Agents compose; responsibility units are suited for delivering directly to business users. Both decompositions are valid, but they target different audiences.

If you're designing a multi-agent system, this is the first decision to make: are your Agents "components for other Agents to use" or "colleagues for humans to work with"?

## 11 MCP Connectors: A Swappable Data Layer

The other key to the architecture is that **MCP (Model Context Protocol) connectors are fully pluggable**.

- **Market data**: Daloopa, FactSet, S&P Global, LSEG, Morningstar
- **Research**: Moody's, PitchBook, MT Newswires, Aiera
- **Infrastructure**: Egnyte (document storage), Chronograph (PE portfolio tracking)

The design philosophy is stated in the README: "Swap the connector to point at your own data source and you can customize without changing the Agent itself."

This maps directly to the retriever abstraction in RAG systems. Your `searchBlogPosts` / `searchDocs` / `getPostDetail` tools should be **replaceable bindings**, not hard-coded dependencies inside the Agent. When you eventually swap Vectorize for pgvector, or move from static markdown to the Notion API, the ideal state is changing only the tool implementation, not the graph.

In practice it's hard to achieve perfect cleanliness, but this repo demonstrates: as long as Agents describe "what kind of data I need" in markdown/YAML rather than "which SDK to call," the cost of swapping stays very low.

## Pure-File Extensibility: An Engineering Philosophy With No Build Step

The entire repo is written in markdown + YAML. Agent definitions are markdown, skill manifests are YAML, deploy scripts are single-line bash. No TypeScript, no webpack, no schema validation library.

```
plugins/agent-plugins/pitch-agent/
├── system.md          # Agent prompt
├── skills/            # Callable skill manifests
└── manifest.yaml      # Plugin metadata
```

The logic behind this choice: **Agent behavior is prompt engineering, not traditional engineering.** You don't need a type system to guarantee prompt correctness. What you need is a low-barrier, diffable, PR-friendly format that lets non-engineers contribute.

The cost is no static checks at runtime -- a wrong prompt is only caught when you run it. But for systems where "behavior is interpreted by an LLM," over-engineering becomes an obstacle. Anthropic clearly bet on "lowering the contribution barrier."

## Comparison With quidproquo's LangGraph Multi-Agent

My own RAG system uses LangGraph to wire up a `planner → research → normalize_results → writer → critic → related` graph, with each node as an agent function. After reading `financial-services`, three areas are worth revisiting.

**First, graph structure should be independent of transport.** Currently my `src/pages/api/chat.ts` calls the graph directly and streams via SSE -- graph logic and streaming are coupled. If I later need batch evaluation or cron jobs, I'd be forced to duplicate. The graph should be extracted so the chat endpoint only handles stream wrapping.

**Second, the critic's responsibility decomposition can go further.** My current `critic-routing.ts` only decides "whether to retry," but Anthropic's `Statement Auditor` is a **full audit Agent** that outputs a structured list of issues. Upgrading the critic from a "routing function" to an "auditor agent" could make the system more explainable -- but the trade-off is an extra LLM call, which depends on the latency budget.

**Third, retrievers should map to the MCP connector model.** My current `searchBlogPosts` / `searchDocs` are hard-coded D1 + Vectorize calls. Switching to an MCP-style interface means that adding external data sources in the future (e.g., other blogs, Hacker News, paper databases) is just adding a connector -- no graph changes needed.

## Overall Architecture (Comparison Diagram)

```
┌─────────────────────────────────────────────────────────┐
│  anthropics/financial-services                          │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ Cowork Plugin│    │ Managed API  │   ← Runtime layer │
│  └──────┬───────┘    └──────┬───────┘                  │
│         └──────┬─────────────┘                          │
│                ▼                                        │
│      ┌──────────────────┐                              │
│      │ Agent Definition │   ← Prompt + Skill (markdown)│
│      └────────┬─────────┘                              │
│               ▼                                        │
│      ┌──────────────────┐                              │
│      │   MCP Connectors │   ← Data layer (swappable)   │
│      └──────────────────┘                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  quidproquo RAG (comparison)                            │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ /api/chat SSE│    │ (future) batch│  ← Runtime layer │
│  └──────┬───────┘    └──────┬───────┘                  │
│         └──────┬─────────────┘                          │
│                ▼                                        │
│      ┌──────────────────────────┐                      │
│      │ LangGraph                │                      │
│      │ planner→research→writer  │   ← Graph definition │
│      │ →critic→related          │                      │
│      └──────────┬───────────────┘                      │
│                 ▼                                      │
│      ┌──────────────────────────┐                      │
│      │ search-posts/docs/detail │   ← Data layer       │
│      └──────────────────────────┘     (to be swapped)  │
└─────────────────────────────────────────────────────────┘
```

## The Big Picture

`anthropics/financial-services` isn't a demo of "how great Claude is in finance." It's Anthropic's concrete position on "what enterprise-grade Agent systems should look like":

- **Agents are workflows, not skills** -- decomposed by business responsibility
- **Prompts are decoupled from runtime** -- Cowork and API share the same definitions
- **The data layer must be swappable** -- MCP connectors are a mandatory design choice
- **Lowering the contribution barrier takes priority over type safety** -- pure files, no build step

For teams building RAG or multi-agent systems, what's most worth stealing isn't the financial prompts themselves but this **layered thinking**. Next time you design a graph, ask first: is the runtime coupled to the graph? Are retrievers hard-coded? Are these Agents meant for humans or for other Agents?

Answer these questions clearly before you start writing code.

## References

- [anthropics/financial-services GitHub repo](https://github.com/anthropics/financial-services)
- [Claude Managed Agents API](https://docs.claude.com/en/api/agents)
- [Model Context Protocol (MCP) official docs](https://modelcontextprotocol.io/)
- [Claude Cowork Plugins introduction](https://www.anthropic.com/news/claude-for-financial-services)
- [LangGraph official docs](https://langchain-ai.github.io/langgraph/)
- [On-site: Plan-and-Execute RAG](/posts/plan-and-execute-rag)
- [On-site: Agentic RAG with ReAct Loop](/posts/agentic-rag-react-loop)
- [On-site: Modular RAG Pipeline Architecture](/posts/modular-rag-pipeline-architecture)
