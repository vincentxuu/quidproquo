---
title: "Framework Update: Microsoft Agent Framework python-1.19.0"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, framework, daily, microsoft-agent-framework]
lang: en
description: "Microsoft Agent Framework 1.19.0 ships four BREAKING changes in one release while adding MongoDB, Azure DocumentDB, and Cosmos DB vector store connectors"
tldr: "Three things worth knowing about Microsoft Agent Framework python-1.19.0: (1) four BREAKING changes land together, covering HTTP cookie persistence, MCP skill archive format, MCP session scoping, and Redis history key scoping; (2) a new generic vector store provider protocol ships with three new connectors at once — MongoDB (alpha), Azure DocumentDB (alpha), and Azure Cosmos DB NoSQL; (3) built-in orchestration workflows now have stable names and registered checkpoint types, so the built-in sequential/concurrent/handoff/group-chat patterns can be restored after a restart, not just custom workflows."
series:
  name: "AI Framework Changelog"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-09-20-framework-microsoft-agent-framework-1.19.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Microsoft Agent Framework |
| Version | python-1.19.0 |
| Previous version | python-1.18.0 |
| Release date | 2026-09-18 |
| Release Notes | [GitHub Release](https://github.com/microsoft/agent-framework/releases/tag/python-1.19.0) |
| GitHub | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| Stars | 13.6k |

## Why this release matters

Microsoft Agent Framework (MAF — the official Python/.NET agent framework that merged the Semantic Kernel and AutoGen lineages) is doing two different things in the same release: tightening security boundaries (four BREAKING changes touching HTTP clients, MCP skill packaging, MCP sessions, and Redis history keys) while expanding the production data layer (three new enterprise-grade vector store connectors at once). For teams already running MAF, this isn't a "just upgrade for new features" release — it's "check the four BREAKING changes before you upgrade." For teams still evaluating MAF, this release is a concrete example of what "production-grade" means for this framework: rather than chasing feature completeness first, it nails down easy-to-overlook boundaries like HTTP client cookie behavior and MCP session scoping.

## Key changes

- **Generic vector store provider protocol**: `agent-framework-core` adds a shared vector store protocol so different database connectors plug into the same interface → three new connectors ship on top of it: MongoDB (alpha), Azure DocumentDB (alpha), and Azure Cosmos DB NoSQL (stable) — teams on Azure now have more vector store options to plug in directly
- **Stable names and registered checkpoint types for built-in orchestration workflows**: `agent-framework-orchestrations` gives the built-in sequential, concurrent, handoff, and group-chat patterns fixed names and registers their checkpoint types for restoration → long-running built-in workflows can now be interrupted and correctly restored, a guarantee previously limited to custom workflows
- **Per-tool `AgentModeProvider` exposure control**: exposure of the agent mode provider can now be controlled per tool → finer-grained control over how a tool behaves across different execution modes
- **Optional sequential function-call execution**: `agent-framework-core` adds an option to run multiple function calls sequentially instead of concurrently → a direct usability fix for tool chains with strict ordering requirements, such as ones sharing an external resource
- **Configurable CodeAct tool parameter schema descriptions**: the CodeAct tool in `agent-framework-hyperlight` and `agent-framework-monty` can now describe its parameter schema compactly or as full JSON → deployments sensitive to prompt length can shrink the tool description footprint in the system prompt

## Breaking Changes

- HTTP cookie persistence is now an explicit opt-in:
  - Old behavior: internally created MCP, A2A, and AG-UI HTTP clients implicitly retained response cookies
  - New behavior: framework-owned HTTP clients reject response-cookie persistence by default; caller-supplied clients are unaffected
  - Impact: integrations relying on the framework's built-in HTTP client implicitly maintaining session cookies (for example, cookie-based auth against some MCP/A2A backends)
- MCP skill archives are limited to ZIP, and the MCP sampling callback is deprecated:
  - Old behavior: archive entries referenced from `skill://index.json` accepted ZIP, TAR, and TAR.GZ
  - New behavior: only ZIP is accepted; TAR/TAR.GZ payloads are detected, reported as unsupported, and skipped during discovery instead of being unpacked
  - Impact: projects packaging skills as TAR or TAR.GZ need to repackage as ZIP; the MCP sampling callback also enters deprecation
- Provider-backed MCP sessions are now scoped per invocation:
  - Old behavior: `agent-framework-declarative`'s provider-backed MCP sessions weren't isolated per call
  - New behavior: each invocation gets its own session scope
  - Impact: declarative agent setups using provider-backed MCP that relied on state shared across invocations via the session
- Redis history storage keys are now scoped by provider and session identity (a beta-stage breaking change):
  - Old behavior: `agent-framework-redis` history storage keys weren't strictly isolated by provider/session identity
  - New behavior: keys are scoped by provider and session identity to avoid collisions across providers or sessions
  - Impact: deployments storing chat history in Redis will see the key namespace change after upgrading and should check whether existing keys need migration or cleanup

## Migration Guide

### Upgrading from python-1.18.0 to python-1.19.0

```bash
pip install --upgrade agent-framework agent-framework-core
```

```python
# If you rely on the framework's built-in HTTP client retaining response cookies
# (e.g. cookie-based session auth), starting in 1.19.0 you need to construct
# and pass in your own HTTP client with cookie retention configured explicitly,
# rather than relying on the framework-owned client's old implicit behavior

# If you package MCP skills as TAR / TAR.GZ
# Before: skill://index.json points at a .tar or .tar.gz
# After: repackage as .zip and update the path in index.json
```

After upgrading, run existing tests against three scenarios: (1) any manually constructed MCP/A2A/AG-UI HTTP client that relies on cookie persistence; (2) MCP skill assets packaged as TAR/TAR.GZ; (3) Redis-backed chat history deployments, to confirm whether existing keys need migration or cleanup. Everything else added in this release (vector store connectors, orchestration checkpointing, CodeAct schema options) is purely additive and doesn't touch existing code paths.

## Comparison with other frameworks

The generic vector store provider protocol MAF adds here follows a path similar to LangChain's earlier unification of its `VectorStore` interface — settle on a shared interface first, then let each database connector plug into it, rather than every provider shipping its own API shape. The difference is in which connectors MAF chose to add: MongoDB, Azure DocumentDB, and Azure Cosmos DB all skew toward Azure and enterprise databases, a different direction from CrewAI's and LangGraph's current connector choices (which lean toward open-source vector databases like Qdrant and Pinecone) — consistent with MAF's positioning as production-grade and enterprise-deployment-first. Two of this release's four BREAKING changes are about session/identity scoping (MCP session scoping, Redis key scoping), a different category of problem from the `web_fetch` security patches Pydantic AI shipped the same week, but they point at the same underlying trend: how agent frameworks handle boundaries around state shared across invocations and users is becoming a common pain point every framework is now patching.

## Today's takeaway

I used to think of Microsoft Agent Framework as a relatively young framework still racing to add features. Seeing it flag four explicit BREAKING changes in a single minor release — instead of quietly changing old behavior — changed that read: a framework's maturity signal isn't just "how many features does it have," it's also "does it dare to label breaking changes clearly in the changelog." Proactively calling out details as easy to overlook as cookie persistence or MCP session scoping as BREAKING is itself a form of accountability to users, and it's more trustworthy than a silent fix with no announcement.

## References

- [Microsoft Agent Framework python-1.19.0 Release Notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.19.0)
- [Microsoft Agent Framework GitHub](https://github.com/microsoft/agent-framework)
- [PR #8371: Make HTTP cookie persistence explicit](https://github.com/microsoft/agent-framework/pull/8371)
- [PR #8290: Limit MCP skill archives to the ZIP format](https://github.com/microsoft/agent-framework/pull/8290)
- [Full Changelog: python-1.18.0...python-1.19.0](https://github.com/microsoft/agent-framework/compare/python-1.18.0...python-1.19.0)
