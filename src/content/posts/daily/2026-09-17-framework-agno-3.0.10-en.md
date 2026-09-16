---
title: "Framework Update: Agno v3.0.10"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.0.10 tightens default security boundaries in CodingTools and PublicSurface MCP: shell execution moves from opt-out to opt-in, and public MCP now defaults to localhost-only."
tldr: "Agno v3.0.10 in three points: (1) `CodingTools.run_shell` moves from enabled-by-default to requiring `enable_run_shell=True`, and restricted mode no longer routes commands through a shell at all, closing off interpreter-RCE-style shell injection; (2) `PublicSurface(authorization=True, mcp=True)` now accepts only localhost by default — non-local callers need an explicit `MCPConfig(allowed_hosts=[...])` allowlist; (3) new `AzureOpenAIResponses` model, an Elasticsearch vector database, and a `DocumentationMarkdown` transform that converts Mintlify/Fumadocs docs sites into plain Markdown."
series:
  name: "AI Framework Changelog"
  order: 20
---

> 🌏 [中文版](/posts/daily/2026-09-17-framework-agno-3.0.10)

## Release Info

| Field | Value |
|---|---|
| Framework | Agno |
| Version | `v3.0.10` |
| Previous | `v3.0.9` |
| Released | 2026-09-16 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.10) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42k |

## Why This Release Matters

Agno ships code-execution tools (`CodingTools`) and a public MCP endpoint (`PublicSurface`) as built-in, ready-to-use components — that's exactly what makes it more "batteries included" than LangGraph or CrewAI, but it also means the framework itself carries more responsibility for safe defaults. 3.0.10 is a textbook "tighten the defaults" release: `run_shell` moves from "available the moment you install it" to "must be explicitly enabled," and restricted mode goes one step further by not routing commands through a shell at all, closing off command-injection paths built from shell metacharacters like `;`, `|`, and `&&`. The public-facing MCP endpoint likewise flips from "any host can connect" to "localhost only by default." For teams already running Agno agents in production, some things that worked before this upgrade will simply stop working — because they shouldn't have been available without explicit authorization in the first place.

## Key Changes

- **`CodingTools.run_shell` disabled by default**: a new `enable_run_shell` parameter gates shell execution — it's off unless you explicitly set `True` → workflows relying on shell commands working out of the box will break on upgrade and need this flag turned back on deliberately
- **Restricted mode no longer goes through a shell**: restricted execution now invokes programs directly instead of interpreting them through a shell → even with `run_shell` enabled, this adds a layer of defense against injection attacks built from shell metacharacter chains
- **PublicSurface MCP defaults to localhost-only**: `PublicSurface(authorization=True, mcp=True)` no longer accepts arbitrary hosts → connecting non-local callers requires explicitly adding the domain to `MCPConfig(allowed_hosts=[...])`, otherwise remote requests are rejected outright
- **`AzureOpenAIResponses` model**: a new model class that talks to Azure OpenAI deployments through the Responses API → Azure deployments can use the Responses API directly instead of routing through the Chat Completions compatibility layer
- **Elasticsearch vector database**: a new `Elasticsearch` vector db supporting vector, keyword, and hybrid search → teams already running Elasticsearch for full-text search can use it directly as an agent's knowledge backend without standing up a separate vector store
- **`DocumentationMarkdown` transform**: `Knowledge.sync_pages` gained a transform that converts Mintlify- and Fumadocs-generated documentation components into plain Markdown → ingesting an entire third-party docs site into a knowledge base no longer requires writing custom cleanup logic
- **`MCPConfig` gains `root_host`/`path`/`path_aliases`**: MCP can now be served on a custom hostname or endpoint path, and `/mcp/server-card` now returns pretty-printed JSON → deployments sharing one instance across multiple tenants or products can route MCP under their own naming scheme instead of being locked to `/mcp`

## Breaking Changes

- `CodingTools()` used to allow shell execution by default → now requires `CodingTools(enable_run_shell=True)`
  - Affects: any agent workflow relying on `CodingTools` being able to run shell commands out of the box
- `PublicSurface(authorization=True, mcp=True)` now defaults to localhost-only → non-local domains must be added explicitly via `MCPConfig(allowed_hosts=[...])`
  - Affects: deployments exposing an MCP endpoint to non-localhost clients
- `RemoteAgent.role` / `RemoteTeam.role` changed from a method to a property → callers must drop the `()` and use `.role`
  - Affects: any code calling `.role()` directly; although upstream filed this under Bug Fixes, it's an API-signature change that breaks existing code on upgrade, so it's treated as breaking here

## Migration Guide

### Upgrading from 3.0.9 to 3.0.10

```bash
pip install --upgrade agno==3.0.10
```

```python
# Old (3.0.9 and earlier) — shell execution worked by default
tools = CodingTools()

# New (3.0.10) — shell execution must be explicitly enabled
tools = CodingTools(enable_run_shell=True)
```

```python
# Old — MCP accepted any host by default when exposed publicly
surface = PublicSurface(authorization=True, mcp=True)

# New — non-localhost callers need an explicit allowlist
surface = PublicSurface(
    authorization=True,
    mcp=MCPConfig(allowed_hosts=["your-domain.com"]),
)
```

```python
# Old
name = remote_agent.role()

# New
name = remote_agent.role
```

## How This Compares to Other Frameworks

The core of this release isn't a new feature — it's tightening the defaults on two high-risk capabilities: code execution and publicly exposed MCP. That's consistent with the direction of several agent security incidents covered on this site (AI agents sweeping tenant credentials, an OpenAI-agents RubyGems RCE): the problem is rarely a sophisticated attack technique, more often it's a framework's default permissions being too permissive. LangGraph and CrewAI's recent updates have stayed focused on agent primitives and role orchestration, with nothing comparable to "pull back the default permissions on a built-in tool" — largely because neither ships shell execution as a plug-and-play built-in component the way Agno does; the security burden there sits more with whatever tool implementation the developer wires up themselves.

## Today's Takeaway

I used to assume framework breaking changes were mostly about adding features or cleaning up syntax. Seeing Agno flip `run_shell`'s default from "on" to "off" made it clear: when an agent framework ships code execution as a built-in, ready-to-use component, the safe default *is* a feature responsibility. Most developers never go back to tighten permissions on their own — a framework locking the default down is far more effective than a documentation warning after the fact.

## References

- [Agno v3.0.10 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.10)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.6 — previous framework update](/en/posts/daily/2026-09-05-framework-agno-3.0.6-en)
- [PR #10210: harden CodingTools run_shell against interpreter RCE](https://github.com/agno-agi/agno/pull/10210)
- [PR #10220: run CodingTools restricted shell without a shell](https://github.com/agno-agi/agno/pull/10220)
- [PR #10083: detect public MCP access alongside JWT REST auth](https://github.com/agno-agi/agno/pull/10083)
- [PR #10090: configure MCP hostname and endpoint routing](https://github.com/agno-agi/agno/pull/10090)
