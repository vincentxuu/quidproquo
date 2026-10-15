---
title: "Framework Update: Pydantic AI v2.56.0"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.56.0 adds SmolSandbox for running harness capabilities in a local microVM, Postgres-backed PGTaskDurability and layered Skills; BrowserUse now defaults to the host model and its telemetry is opt-in"
tldr: "Pydantic AI v2.56.0: `SmolSandbox` runs harness capabilities in a local smolvm microVM; `PGTaskDurability` provides durable execution on pgtask, alongside a Render Workflows integration; `Skills` can layer project and personal libraries; Python 3.15 and Gemini 4 Argon are supported, with the Google providers' default timeout raised to 20 minutes. Compatibility note: `BrowserUse` now runs on the host model by default and browser-use telemetry is opt-in; `MCPToolset(http_client=...)` now applies auth and no longer closes the user-supplied client."
series:
  name: "AI Framework Changelog"
  order: 42
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.56.0 |
| Previous | v2.55.0 |
| Released | 2026-10-14 (23:35 UTC on 10-13) |
| Release Notes | [v2.56.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.6k |

## Why This Release Matters

The previous release added the `Conversation` object and Postgres step/media stores; this one fills in the execution environment: harness capabilities can be locked inside a local microVM, and durable execution gains Postgres and Render options. Teams that want Pydantic AI agents in production without committing to a specific workflow engine now have more choices.

## Key Changes

- **SmolSandbox**: a new workspace that runs harness capabilities inside a local smolvm microVM → an isolation option for letting agents run commands without touching the host, and without a cloud service
- **PGTaskDurability**: durable execution built on pgtask → teams already on Postgres can skip standing up an engine like Temporal
- **Render Workflows integration**: Render Workflows added as a durable execution engine → agents deployed on Render can use the platform's workflows directly
- **Layered Skills**: `Skills` can stack project and personal libraries, name each skill directory, and render a skill as a host command → shared team skills and personal skills can be managed separately
- **Models and runtime**: support for Gemini 4 Argon (`gemini-4-argon`) with long decode past the per-request output cap; the Google providers' default timeout is now 20 minutes; Python 3.15 support; `ZaiProvider` accepts `base_url`
- **Harness `Coder` capability**: `WarnNearLimits` removed
- **Notable fixes**: `MCPToolset(http_client=...)` now applies `auth` to requests and no longer closes the user-supplied client; a 200 response with a `text/plain` body from OpenAI Responses, Anthropic or Groq now raises `ModelAPIError`; Exa 402 errors are raised instead of retried

## Breaking Changes

The release notes don't flag breaking changes, but there is one compatibility note:

- `BrowserUse` now runs on the host model by default, and browser-use telemetry is opt-in
  - Affected: projects relying on BrowserUse using a different model, or on browser-use sending telemetry by default
- `WarnNearLimits` removed from the `Coder` capability
  - Affected: harness setups that relied on near-limit warnings

## Migration Guide

### Upgrading from v2.55.0 to v2.56.0

```bash
pip install --upgrade "pydantic-ai==2.56.0"
```

After upgrading, check two things: wherever you use `BrowserUse`, confirm that running on the host model gives the cost and behavior you expect, and turn telemetry on yourself if you need it; wherever you pass `MCPToolset(http_client=...)` with your own auth, make sure auth isn't applied twice and that you now close the client yourself.

## Compared With Other Frameworks

This release's microVM sandbox and the sandbox provider contract in same-day [Mastra 1.77.0](/posts/daily/2026-10-15-framework-mastra-1.77.0-en) tackle the same problem: the environment where agents run code has to be swappable and isolated. The difference is that Pydantic AI starts with a local microVM while Mastra starts with a provider abstraction over Docker and E2B.

## Today's Takeaway

I assumed durable execution meant pairing with a standalone engine like Temporal. Pydantic AI adding a Postgres step store and then PGTaskDurability made me realize that for most teams, running durability on the Postgres they already have may be more practical than adopting a new engine.

## References

- [Pydantic AI v2.56.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [SmolSandbox PR #10148 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10148)
- [PGTaskDurability PR #10174 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10174)
