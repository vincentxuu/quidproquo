---
title: "Framework Update: Pydantic AI v2.44.0"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.44 patches four security issues, including one where web_fetch processed responses in superlinear time on the event loop — a single malicious page could stall every agent in the process."
tldr: "Pydantic AI v2.44.0 in three points: (1) four security patches, the most serious being `web_fetch` running both its HTML conversion and charset decoding in superlinear time on the event loop — an attacker-chosen page can stall every agent sharing that process; (2) three compatibility notes: `RunContext.enqueue()` is now safe to call from worker threads, UI adapter requests must carry a JSON `Content-Type`, and a capability's `@durable_operation` invoked from a per-request hook now dispatches properly instead of running inline; (3) a new Vercel AI SDK/Eve migration skill, and `AgentRunResult` now settles into a stable serialized shape."
series:
  name: "AI Framework Changelog"
  order: 22
---

> 🌏 [中文版](/posts/daily/2026-09-18-framework-pydantic-ai-2.44.0)

## Release Info

| Field | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.44.0 |
| Previous | v2.43.0 |
| Released | 2026-09-17 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## Why This Release Matters

[The previous release (2.42.0)](/en/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0-en) was a small patch-up version; 2.44 is small too, but different in kind — it's a security release that fixes four separate issues, all reachable through `web_fetch_tool` or OpenTelemetry instrumentation. The standout is a moderate-severity denial-of-service: `web_fetch` ran both its HTML conversion and its charset decoding in superlinear time on the event loop, meaning an attacker only needs to get an agent's `web_fetch` tool to fetch one specially crafted page to stall every agent sharing that process. For any deployment that lets agents browse the web autonomously, this is a fix that bears directly on availability, and it deserves priority over an ordinary feature update.

## Key Changes

- **Fixed `web_fetch`'s superlinear-time processing (GHSA-fpf4-vwcp-v4hp, moderate)**: both HTML conversion and charset decoding ran in superlinear time on the event loop → a single attacker-chosen page could stall every agent in the process, the widest-reaching of the four patches
- **Fixed an IPv6 zone-identifier bypass of local-network blocks (GHSA-vmxc-h2x2-jmf3, moderate)**: with local network access opted in via `FileUrl(force_download='allow-local')` or `web_fetch_tool(allow_local_urls=True)`, the cloud-metadata and private-IP blocklists could be bypassed with an IPv6 zone identifier → both flags are off by default, but deployments that do need local network access should take note
- **Fixed domain-blocklist comparison (GHSA-22h6-qm39-v87j, low)**: `web_fetch_tool`'s domain lists were compared as written rather than in the form the resolver actually uses, so a blocked domain could be reached under a different spelling
- **Fixed instrumentation content leakage (GHSA-4x9p-g9wm-8q7f, low)**: with `InstrumentationSettings(include_content=False)`, spans still carried exceptions, error statuses, instructions, and the output template — "turning off content logging" wasn't actually turning it all off
- **`RunContext.enqueue()` is now safe to call from worker threads**: previously unsafe from a non-main thread, now fixed
- **UI adapter requests require a JSON `Content-Type`**: requests to the UI adapter now must carry the header explicitly
- **`AgentRunResult` gets a stable serialized shape**: a finished streaming result now settles into a consistent serialized form
- **New Vercel AI SDK/Eve migration skill**: helps teams migrating from those two frameworks map over the API

## Breaking Changes

None of these are formally listed as breaking changes upstream, but the Compatibility Notes flag three behavior changes:

- Every security fix here is a tightening rather than an addition — code that relied on the old, looser behavior (for example, a domain spelling that used to slip past the blocklist) will now be blocked
- A capability's `@durable_operation` invoked from a per-request hook now dispatches properly instead of silently running inline
  - Affects: projects that call a durable operation from within a per-request hook, where retry and error-handling semantics may now differ from before
- UI adapter requests missing a JSON `Content-Type` are now rejected
  - Affects: callers manually constructing requests to the UI adapter without explicitly setting `Content-Type: application/json`

## Migration Guide

### Upgrading from 2.43.x to 2.44.0

```bash
pip install --upgrade pydantic-ai==2.44.0
```

All four security fixes are patched in both `2.44.0` (v2) and `1.107.6` (v1) — no code changes needed, just bump the version. What's worth actually checking is the three compatibility notes:

```python
# If your code manually builds requests to the UI adapter, make sure it
# sets a JSON Content-Type
headers = {"Content-Type": "application/json"}  # required as of 2.44.0
```

```python
# If you call a durable operation from within a per-request hook:
# Old behavior: could run inline, silently
# New behavior: always goes through proper dispatch — verify your retry
# and error-handling logic doesn't depend on the old inline semantics
```

After upgrading, it's worth running your existing tests around `web_fetch_tool`, UI adapter requests, and OpenTelemetry instrumentation to confirm none of them hit these three compatibility changes.

## How This Compares to Other Frameworks

Where LangGraph and CrewAI are still piling on agent primitives, this release puts its full weight behind security patches and tightening boundaries — consistent with Pydantic AI's "types are the contract" stance: every entry point into the outside world (web fetch, UI adapter requests, telemetry) is expected to validate and declare explicitly rather than trust by default. A release dedicated to `web_fetch_tool` security issues isn't common among comparable frameworks, and it points to the Pydantic AI team having a real security process watching the "agent browses the web autonomously" attack surface.

## Today's Takeaway

I used to assume agent-framework security problems mostly showed up in tool execution — shell access, code interpreters, that kind of thing. Seeing `web_fetch`'s own HTML conversion and charset decoding turn into a superlinear-time DoS vector made it clear: any path that processes untrusted external content is an attack surface, not just paths that execute untrusted code. A string-decoding function that looks entirely mundane can still stall an entire process if its complexity isn't bounded.

## References

- [Pydantic AI v2.44.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.42.0 — previous framework update](/en/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0-en)
- [GHSA-fpf4-vwcp-v4hp: web_fetch superlinear time DoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-fpf4-vwcp-v4hp)
- [GHSA-vmxc-h2x2-jmf3: IPv6 zone identifier bypass](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-vmxc-h2x2-jmf3)
- [GHSA-22h6-qm39-v87j: domain blocklist comparison bypass](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-22h6-qm39-v87j)
- [GHSA-4x9p-g9wm-8q7f: instrumentation content leak](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4x9p-g9wm-8q7f)
- [Full Changelog: v2.43.0...v2.44.0](https://github.com/pydantic/pydantic-ai/compare/v2.43.0...v2.44.0)
