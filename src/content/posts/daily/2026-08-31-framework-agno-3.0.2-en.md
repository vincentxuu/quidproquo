---
title: "Framework Update | Agno 3.0.2"
date: 2026-08-31
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.0.2 lets Agents, Teams, Workflows, and Toolkits publish themselves as named MCP tools, while quietly flipping the metadata resolution order — a patch release that actually changes behavior contracts"
tldr: "Agno 3.0.2 highlights: (1) Agents/Teams/Workflows/Toolkits can now be published directly as individually named MCP tools via MCPConfig.tools or component.as_tool(), instead of wrapping everything in run_agent(agent_id=...); (2) three behavior changes that don't bump the major version but will bite you: metadata resolution order flips (call-site now wins over component), MCPConfig rejects unknown fields at construction, and BaseRemote.acancel_run gains a required auth_token parameter; (3) four new integrations — Synthorai model provider, WaveSpeed image/video generation, Serply search, and AtomicMail inbox — plus a naming cleanup around mcp=/MCPConfig/default_tools (old names stay as aliases until 3.1)."
series:
  name: "AI Framework Changelog"
  order: 11
---

> 🌏 [中文版](/posts/daily/2026-08-31-framework-agno-3.0.2)

## Version Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.0.2 |
| Previous | v3.0.1 |
| Release Date | 2026-08-30 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.2) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 41.9k |

## Why This Release Matters

The version number only ticked one patch (3.0.0 → 3.0.2), but this release changes the direction of how Agno talks to the MCP ecosystem. Until now, Agno's MCP support was essentially one-directional: an Agent connects to an MCP server and pulls in external tools. 3.0.2 flips that — an Agent, Team, Workflow, or even a whole Toolkit can now become a named MCP tool of its own, published so that other MCP clients (another Agno deployment, or an MCP-aware assistant like Claude) can call it directly. Previously, achieving something similar meant hand-rolling a generic entrypoint like `run_agent(agent_id="chief")`; now `MCPConfig(tools=[researcher_agent])` or `component.as_tool(name="research")` turns an internal component into an independently addressable, externally callable tool. At the same time, the release notes bury a handful of changes that don't move the version number but do change existing behavior — most notably a flip in metadata resolution order. Changes that keep the same function signature but return a different value are exactly the kind that quietly produce data inconsistencies after an upgrade, so this is worth reading closely before you bump the dependency.

## Key Changes

- **Agents/Teams/Workflows published as MCP tools**: `MCPConfig.tools` now accepts `Agent`, `Team`, `Workflow` instances, remote proxies, or component factories, publishing each as its own named MCP tool (e.g. `chief`) instead of routing everything through `run_agent(agent_id="chief")` → `component.as_tool(name=..., description=...)` lets you choose the published name and description; `continue_run`/`cancel_run` register alongside exposed components too, so a run paused on a confirmation step stays resumable over MCP
- **Toolkits published one MCP tool per method**: `MCPConfig.tools` now also accepts a whole `Toolkit`, publishing one MCP tool per registered method (previously raised `TypeError`), narrowed by that toolkit's own `enable_*`/`include_tools`/`exclude_tools` filters → framework-internal parameters (`RunContext`, `Agent`, `Team`, `_agno_*` channels) are hidden from the client-facing schema and filled in server-side, and a `ToolResult` renders as the matching MCP content block (text, image, audio, embedded resources for video/files, `resource_link` for URL-only artifacts)
- **MCP tool titles and behavior annotations**: `as_tool()` and `@tool`/`Function` gain `title` and `annotations` parameters that AgentOS publishes over MCP for exposed components and its eight built-in tools; exposed components default to asserting `readOnlyHint: False`, `destructiveHint: True`, `openWorldHint: True` (overridable), but an unknown annotation key now raises instead of silently passing through
- **Context provider `query_timeout` and `write_tools`**: every context provider can now take a per-call wall-clock timeout that yields an error chunk instead of hanging the run (needs Python 3.11+), and the five write-capable providers accept `write_tools` to swap in a custom write sub-agent toolset
- **Four new integrations**: a Synthorai model provider (OpenAI-compatible endpoint), WaveSpeed image/video generation tools, a Serply search toolkit (Google Web/News/Scholar), and an AtomicMail toolkit that gives an Agent its own inbox via proof-of-work signup with no domain setup or human verification

## Breaking Changes

- **Run metadata resolution order flipped**: `metadata` now resolves as component → session → call-site, so a `metadata=` passed to `run()` wins over `agent.metadata` — the opposite of the previous behavior where the component value won. A run also no longer writes session metadata back onto the shared component, so code that used to read `agent.metadata` after a run to observe session-level values now sees only the constructor value
  - Impact: any code relying on the old metadata precedence, or on reading `agent.metadata` post-run to see session values; note this session-layer behavior only applies where the dispatch path pre-reads the session — `Team.arun` and the async-DB agent/workflow paths still resolve from component and call-site alone
- **`MCPConfig` rejects unknown fields**: `MCPConfig`/`MCPServerConfig` now raise at construction on unrecognized keyword arguments instead of silently ignoring them
  - Impact: a typo such as `tool=` instead of `tools=` used to silently boot a config serving the wrong tool surface; it now fails loudly at startup
- **`BaseRemote.acancel_run` gains a required parameter**: the abstract method now takes an `auth_token` parameter, passed by keyword from the cancel entry points
  - Impact: any third-party code with a custom `BaseRemote` subclass needs to update its method signature to stay compatible
- **MCP naming cleanup (old names alias until 3.1)**: `AgentOS(mcp=...)`, `MCPConfig`, and `default_tools` are the new spellings for `mcp_server=`, `MCPServerConfig`, and `enable_builtin_tools`. The old names still work as aliases, targeted for removal in 3.1; passing both spellings with different values now raises
- **Reasoning detection now asks the provider first**: native reasoning detection queries the provider before falling back to model-id matching, so a `Gemini` or `Claude` model configured for thinking gets reclassified as non-reasoning if the provider reports thinking unsupported; id-based fallback rules changed too (e.g. `gpt-5` variants match on OpenAI/Azure, while Groq/Ollama match `gpt-oss` and `qwen3`)

## Migration Guide

### Upgrading from 3.0.0/3.0.1 to 3.0.2

```bash
pip install --upgrade agno==3.0.2
```

Switch to the new MCP naming (the old names still work but will be removed in 3.1):

```python
# Old (3.0.1 and earlier, still works but deprecated)
os = AgentOS(
    mcp_server=MCPServerConfig(
        enable_builtin_tools=True,
        tools=[my_toolkit],
    ),
)

# New (3.0.2)
os = AgentOS(
    mcp=MCPConfig(
        default_tools=True,
        tools=[my_toolkit, research_agent, review_team],
    ),
)
```

Publish an existing Agent or Team as a named MCP tool:

```python
research_specialist = researcher.as_tool(
    name="research",
    description="Research a question on the web and report the findings",
)

os = AgentOS(mcp=MCPConfig(tools=[research_specialist]))
```

If your project has a custom `BaseRemote` subclass, add the new `auth_token` parameter:

```python
# Old
async def acancel_run(self, run_id: str) -> None: ...

# New (3.0.2)
async def acancel_run(self, run_id: str, auth_token: str | None = None) -> None: ...
```

If your code reads `agent.metadata` after a run to observe session-level values written during that run, that pattern no longer holds under 3.0.2 — read from the run result or the session object directly instead.

## How It Compares to Other Frameworks

Among the frameworks tracked this week, AG2 v1.0.3 moved its entire MCP client surface to the MCP 2.0 protocol — a protocol-version upgrade. Agno 3.0.2 works a different axis: it doesn't touch the protocol version, but fills in whether a framework's own components (Agent/Team/Workflow/Toolkit) can be exposed as MCP tools in the first place. Read together, they're two cuts of the same trend: MCP is growing from "how an Agent consumes external tools" into a two-way interface — "how an Agent gets consumed as a tool by someone else" — and the framework layer's job is expanding from "be an MCP client" to "also be an MCP server."

## Today's Takeaway

I used to think MCP integration was a one-directional feature for a framework — one more way for an Agent to reach external tools. Watching Agno publish its Agents/Teams/Toolkits as individually named MCP tools made it click that MCP is closer to an "interface protocol" than a "tool-ingestion protocol": once a framework wraps its own components as MCP tools, your whole Agent system becomes a service that something else — another Agent, another tool chain — can consume. That means judging how complete a framework's MCP support is should include not just how many external MCP servers it can connect to, but whether it can publish its own components out as well.

## References

- [Agno v3.0.2 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.2)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.1 — GitHub Release (previous version)](https://github.com/agno-agi/agno/releases/tag/v3.0.1)
- [AG2 v1.0.3 — GitHub Release (concurrent MCP 2.0 migration, for comparison)](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)
