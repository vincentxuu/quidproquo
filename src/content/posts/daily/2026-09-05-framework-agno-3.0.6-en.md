---
title: "Framework Update | Agno 3.0.6"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.0.6 lets an MCP server run stateless so any replica can answer any request, and follows the MCP 2026-07-28 spec's sessionless negotiation"
tldr: "Agno 3.0.6 highlights: (1) `MCPConfig(stateless=True)` serves `/mcp` without session tracking so any replica can answer any request, removing the need for session affinity in multi-instance deployments (at the cost of server-initiated notifications and SSE resumability); (2) `MCPTools(protocol_mode=\"auto\")` negotiates the newest MCP protocol era both sides support, including the sessionless capability from the 2026-07-28 spec, while the default `\"legacy\"` mode keeps today's behavior unchanged; (3) adds an AgentOS MCP Server Card (`GET /mcp/server-card`), `.zip`/`.eml` file uploads, `AuthorizationConfig.excluded_route_paths`, and fixes for Anthropic thinking-block replay, Gemini image MIME types, and more. No breaking changes in this release."
series:
  name: "AI Framework Changelog"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-09-05-framework-agno-3.0.6)

## Version Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.0.6 |
| Previous | v3.0.5 |
| Release Date | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.6) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.0k |

## Why This Release Matters

[The previous entry (3.0.5)](/en/posts/daily/2026-09-02-framework-agno-3.0.5-en) fixed Knowledge ingestion's data-integrity contract. 3.0.6 goes back to fix the deployment model of MCP serving itself. Until now, MCP servers — including Agno's own AgentOS MCP endpoint — defaulted to session-based: once a client connects, its session state is pinned to a specific process, so scaling to multiple replicas meant either routing every request from the same client to the same machine via session affinity, or building your own session-sharing layer. 3.0.6 adds `MCPConfig(stateless=True)`, which serves `/mcp` without tracking session state at all — any replica can answer any request. That means horizontally scaling an MCP server can finally look like any stateless HTTP API behind a load balancer, with no sticky routing required. The same release also teaches `MCPTools` to negotiate the MCP protocol version (`protocol_mode="auto"`), following the sessionless negotiation capability added in this year's 2026-07-28 spec, connecting the client-side and server-side statelessness together.

## Key Changes

- **Stateless MCP serving**: `MCPConfig(stateless=True)` serves `/mcp` without session tracking, so any replica can answer any request and multi-instance deployments no longer need session affinity → the cost is losing server-initiated notifications and SSE resumability, so it's off by default — deployments that need horizontal scaling can weigh the tradeoff and opt in
- **`MCPTools(protocol_mode=...)` protocol negotiation**: defaults to `"legacy"`, preserving today's session-based behavior unchanged; `"auto"` negotiates the newest protocol era both sides support (sessionless capability comes from the MCP `2026-07-28` spec) → existing servers are unaffected and still accept the legacy handshake; MCP clients are now built internally on `fastmcp.Client`
- **AgentOS MCP Server Card**: a new `GET /mcp/server-card` endpoint lists the currently served tools and carries a configurable name, version, and instructions → lets a client self-discover what an AgentOS instance offers
- **`.zip`/`.eml` file uploads**: AgentOS now supports uploading and unpacking these archive formats
- **`AuthorizationConfig.excluded_route_paths`**: marks specific custom routes as public without disabling auth globally
- **Bedrock custom async client**: models and embedders can now be passed a caller-supplied async client
- **Several stability fixes**: Anthropic now replays prior assistant turns verbatim so thinking blocks stop getting rejected; Gemini resolves the actual image MIME type instead of hard-coding `image/jpeg`; `RecursiveChunking` no longer emits duplicate trailing chunks; AG-UI now sends wire fields instead of the whole `RunContext` to remote entities and exposes streamed run errors

## Breaking Changes

No breaking changes in this release. Both `stateless=True` and `protocol_mode="auto"` are opt-in — the defaults preserve today's session-based behavior.

Upgrade directly, no code changes required.

## Migration Guide

```bash
pip install --upgrade agno==3.0.6
```

To let AgentOS's MCP endpoint support multi-replica deployment, enable stateless serving:

```python
from agno.os.mcp import MCPConfig

mcp_config = MCPConfig(stateless=True)
# /mcp can now sit behind a plain load balancer, no session affinity needed
# Tradeoff: no server-initiated notifications or SSE resumability
```

To let the MCP client auto-negotiate the newest protocol version:

```python
from agno.tools.mcp import MCPTools

mcp_tools = MCPTools(
    url="https://example.com/mcp",
    protocol_mode="auto",  # defaults to "legacy"
)
```

## How It Compares to Other Frameworks

The MCP spec only formalized sessionless negotiation earlier this year (2026-07-28), and Agno 3.0.6 implements it on both the client and server side almost immediately — consistent with Agno treating "absorb the newest MCP ecosystem capabilities fast" as a core selling point, in line with its #1 Agentic Index ranking and multi-model-flexibility positioning. By comparison, LangGraph and CrewAI don't yet support MCP protocol version negotiation at this level of granularity, giving Agno a temporary lead on the path to MCP-native production deployment.

## Today's Takeaway

I used to assume MCP servers inherently needed session affinity to scale horizontally. Seeing Agno add `stateless=True` at the protocol level made it clear that session-based design was just an early implementation default, not a hard constraint of the protocol — as long as you're willing to give up features like server-initiated notifications that need a long-lived connection state, an MCP server can scale just as easily as a plain stateless REST API. Evaluating an Agent framework's MCP support should look beyond how many tools it wires up, to whether it has designed multi-replica deployment into the protocol layer itself.

## References

- [Agno v3.0.6 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.6)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.5 — GitHub Release (previous version)](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [MCP 2026-07-28 — Specification Release](https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28)
- [Agno 3.0.5 — previous framework update](/en/posts/daily/2026-09-02-framework-agno-3.0.5-en)
