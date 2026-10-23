---
title: "Framework Update: CrewAI 1.15.29"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: en
description: "CrewAI 1.15.29 promotes its core execution engine, AgentExecutor, to a stable API, and adds Azure DocumentDB vector integration plus several eval improvements"
tldr: "Three things in CrewAI 1.15.29: (1) `AgentExecutor` graduates out of experimental status to a stable API; (2) a new Azure DocumentDB vector search integration, plus `crewai eval` gains evaluation export and a single command to run the whole crew for a verdict; (3) the CLI picks up platform application search and an organization picker at login. No breaking changes — just upgrade."
series:
  name: "AI Framework Changelog"
  order: 51
---

> 🌏 [中文版](/posts/daily/2026-10-24-framework-crewai-1.15.29)

## Release Info

| Item | Value |
|---|---|
| Framework | CrewAI |
| Version | v1.15.29 |
| Previous version | v1.15.28 |
| Release date | 2026-10-23 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 59,888 |

## Why this release matters

[The last release covered here (1.15.22)](/posts/daily/2026-09-18-framework-crewai-1.15.22-en) was about a user-facing feature, `llm_overlay`; the 1.15.23–1.15.28 releases in between were mostly bug fixes, and 1.15.29 surfaces a deeper signal instead: `AgentExecutor`, crewAI's core task-execution loop, formally drops its experimental label and becomes a stable API. Carrying that label meant the interface could change shape at any point; graduating it means production deployments can now depend on it without worrying about a rewrite in the next release. The same release adds a native Azure DocumentDB vector store, so teams on Azure no longer need a separate vector database for memory or RAG, and `crewai eval` gains the ability to export evaluation results and run an entire crew for a verdict in one command — turning evaluation from a hand-rolled script into a built-in workflow.

## Key Changes

- **`AgentExecutor` graduates to a stable API**: crewAI's core task-execution loop drops its experimental label → production deployments can rely on its interface without worrying about a breaking redesign down the line
- **LiteLLM-compatible kwargs**: model call parameters can be passed straight through in LiteLLM-compatible form → less wrapper code to translate parameters for different model providers
- **Azure DocumentDB vector search integration**: a new native vector store backend → teams on Azure no longer need a separate vector database for memory or RAG
- **Three improvements to `crewai eval`**: it keeps the evaluation's full data in the project, runs the whole crew to get a verdict from one command, and can export evaluations as files → evaluation moves from a hand-rolled script to a built-in workflow
- **CLI operations for platform integrations**: adds platform application search, action-picker search, and an organization picker at login → far less manual digging through settings when managing several CrewAI Platform integrations
- **Offline job routing and a guardrail evaluation runner**: guardrail evaluations can run without a connection to CrewAI Platform → local development and CI can validate guardrail logic directly
- **`call:` tool runs integration app actions directly** → no need to wrap a platform action in a custom tool first
- **A read-only notebook text loader and a standard-library jsonl loader** → two more dependency-free ways to load data

## Breaking Changes

None in this release.

## Migration Guide

Just upgrade — no code changes needed:

```bash
pip install --upgrade crewai==1.15.29
```

## How it compares to other frameworks

Promoting `AgentExecutor` out of experimental status signals that crewAI's role-based multi-agent execution loop has reached a stable point developers can depend on. Where LangGraph keeps refining the fine-grained node/edge API at the graph level, crewAI's signal here is that its core engine is mature enough that attention is shifting to operational concerns — eval, platform integrations, vector backends. For teams already running crewAI in production, it's one more sign they can upgrade without worrying the underlying execution logic will be rewritten out from under them.

## Today's Takeaway

I used to assume a framework's "new features" always show up in the user-facing API layer. Seeing that this release's headline change was removing an experimental label from the core execution engine made it clear that stability signals sometimes hide in an unassuming changelog line rather than a flashy feature announcement — "this thing finally calls itself stable" is itself worth noting.

## References

- [CrewAI 1.15.29 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [CrewAI 1.15.22 — previous framework update](/posts/daily/2026-09-18-framework-crewai-1.15.22-en)
- [Full Changelog: 1.15.28...1.15.29](https://github.com/crewAIInc/crewAI/compare/1.15.28...1.15.29)
