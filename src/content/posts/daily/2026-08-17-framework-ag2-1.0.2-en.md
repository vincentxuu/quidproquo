---
title: "Framework Update | AG2 v1.0.2"
date: 2026-08-17
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: en
description: "AG2 v1.0.2 lets agents bi-directionally expose themselves as ACP services, switches A2A agent cards to signature verification, and adds gRPC TLS transport — a release focused on hardening cross-agent interop security"
tldr: "AG2 v1.0.2 highlights: (1) AG2 agents can now be exposed as ACP agents, serving remote clients over HTTP/WebSocket; (2) A2A agent cards switch from plaintext to signed-and-verified, plus gRPC TLS transport; (3) LiveAgent adds ElevenLabs as a voice provider, and community extensions (Tenki sandbox, TealTiger governance middleware) land for the first time. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-17-framework-ag2-1.0.2)

## Version Info

| Item | Value |
|---|---|
| Framework | AG2 (community fork of AutoGen) |
| Version | v1.0.2 |
| Previous | v1.0.1 |
| Released | 2026-08-16 |
| Release Notes | [GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.0.2) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 4.9k |

## Why This Release Matters

The focus of this release isn't piling on new features — it's upgrading "multiple agent systems calling each other" from "it works" to "it works securely." The previous release (v1.0.1) had just pinned the mcp dependency to `<2` in response to MCP v2.0 breaking changes. This release follows up by closing two security gaps in A2A (Agent-to-Agent) communication: agent cards move from plaintext to signature verification, and the transport layer gains gRPC TLS. At the same time, AG2 agents can now bi-directionally expose themselves as ACP (Agent Client Protocol) services, letting external clients (e.g. IDEs or other agent frameworks) drive them via HTTP/WebSocket — not just the other way around. Cross-referencing the watchlist item tracking AG2's "A2A support," this is the next step on that line.

## Notable Changes

- **Bi-directional ACP support**: AG2 agents can be exposed as ACP agents, letting remote clients drive them over HTTP or WebSocket; ACP protocol upgraded to 0.12 with Kilo Code support and model selection added -> Previously AG2 mostly "actively" called external tools/agents; now it can also be passively invoked as a service by other systems
- **A2A agent card signing and verification**: Outgoing agent cards are signed; incoming agent cards are verified for origin -> Prevents malicious or forged agent cards from being trusted
- **A2A gRPC TLS transport**: Agent-to-agent communication gains a gRPC TLS transport layer -> Cross-network agent calls can be encrypted without wrapping your own proxy
- **A2A user-defined extensions**: Users can define custom A2A extensions -> Attach custom fields/behavior on top of the standard protocol
- **LiveAgent adds ElevenLabs voice provider**: Another provider option for real-time voice interaction
- **First community extensions**: Tenki (isolated execution sandbox), TealTiger (deterministic governance middleware)
- **Developer tooling**: Agent composition exposed as a read-only public property, middleware gains `describe()` for introspection, tool types consolidated into `ag2.tools.types`

## Breaking Changes

None in this release.

## Migration Guide

Upgrade directly — no code changes required:

```bash
pip install --upgrade ag2==1.0.2
```

To start using new features, here's an example:

```python
# Expose an existing AG2 agent as an ACP service for remote clients
from ag2.acp import ACPServer

server = ACPServer(agent=my_agent, transport="websocket")
server.serve()
```

## Cross-Framework Observations

A2A interop security is something multiple frameworks are actively backfilling. LangGraph and CrewAI currently rely on external gateways to handle cross-framework agent authentication, while AG2 now bakes signature verification directly into the framework layer. Combined with the bi-directional ACP support added in the same release, AG2 simultaneously acts as an "A2A participant" and an "ACP-driven endpoint" — further ahead on the protocol interop front than most peers.

## Takeaway

When following A2A (Agent-to-Agent) updates, it's easy to focus only on "can they talk to each other." This release highlights that "agent card signing and verification" is the real gate to production readiness — an agent card is essentially an identity credential, and without signature verification, anyone can forge an agent to impersonate their way into your multi-agent system.

## References

- [AG2 v1.0.2 — GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.0.2)
- [ag2ai/ag2 — GitHub](https://github.com/ag2ai/ag2)
