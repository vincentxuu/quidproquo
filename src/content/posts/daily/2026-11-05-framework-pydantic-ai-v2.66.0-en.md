---
title: "Framework Update: Pydantic AI v2.66.0"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai, security]
lang: en
description: "Pydantic AI v2.66.0 fixes 9 security advisories in one release, and several of the high-severity ones share the same root cause: expanding data before checking its size or checking a domain against a blocklist"
tldr: "Pydantic AI v2.66.0 discloses 9 GHSA advisories at once, several high severity, with a shared root cause: code expands or parses data before checking a size limit or a domain blocklist, instead of checking first. It also adds OpenSandbox and RenderSandbox for self-hosted agent workspaces, plus Azure Durable Task support for the harness."
series:
  name: "AI Framework Changelog"
  order: 62
---

> 🌏 [中文版](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.66.0 |
| Previous version | v2.65.0 |
| Release date | 2026-11-04 |
| Release Notes | [v2.66.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.66.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## Why this version matters

The headline here isn't a feature — it's 9 security advisories ([GHSA](https://github.com/pydantic/pydantic-ai/security/advisories)) disclosed in one release, several marked high. Pull the nine apart and most of them boil down to the same mistake: code expands, parses, or looks something up before it checks a size limit or a domain blocklist. A deeply nested JSON document gets re-indented before the download-size limit is applied ([GHSA-m5vj-8mcw-82qx](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx)). A small but self-referencing tool schema gets its `$defs`/`$ref` inlined before it reaches the model ([GHSA-7494-925c-rrxv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-7494-925c-rrxv), [GHSA-484x-x9m4-62cj](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-484x-x9m4-62cj)). A domain denylist on `allowed_domains` resolves DNS before deciding whether to block the hostname ([GHSA-5ppx-9jq6-6pmw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5ppx-9jq6-6pmw)). Whenever an attacker can influence what reaches these code paths — an AG-UI endpoint, a tool result, a URL an agent is told to fetch — a few hundred characters of crafted input can tie up the event loop for minutes or longer. That's a resource-exhaustion (ReDoS / memory-blowup) class of bug, a different failure mode from the usual "prompt injection tricks the model" story. A second cluster is about data boundaries: a tool result serialized to look like one of the framework's file types gets reconstructed and trusted as a real file on reload, which could make the application fetch an internal URL or read an `s3://` object it shouldn't ([GHSA-4cj4-hgwf-4hc4](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4)); Tencent Cloud's metadata address was missing from the cloud-metadata blocklist ([GHSA-5fj9-5pjw-vpwc](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5fj9-5pjw-vpwc)); and OpenTelemetry embedding spans recorded whatever secrets were passed through `extra_headers`/`extra_body` ([GHSA-jp94-mmr3-2pvv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-jp94-mmr3-2pvv)). The same release also ships the feature work these fixes sit alongside: `OpenSandbox` and `RenderSandbox` for self-hosted or Render-hosted agent workspaces, and Azure Durable Task as a persistence backend for the harness.

## Key Changes

- **9 security advisories fixed in one batch**: [GHSA-m5vj-8mcw-82qx](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx) (high, deeply nested JSON expanded before the size limit is checked), [GHSA-mfx5-pc32-32m8](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mfx5-pc32-32m8) (high, the harness secret-redaction `private_key` pattern backtracks exponentially on crafted text), [GHSA-5fj9-5pjw-vpwc](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5fj9-5pjw-vpwc) (medium, Tencent Cloud's metadata address missing from the cloud-metadata blocklist), [GHSA-jp94-mmr3-2pvv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-jp94-mmr3-2pvv) (medium, embedding tracing recorded secret settings), [GHSA-7494-925c-rrxv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-7494-925c-rrxv) / [GHSA-484x-x9m4-62cj](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-484x-x9m4-62cj) (medium, repeated `$ref` expansion in tool schemas grows exponentially), [GHSA-r879-rxgj-3g75](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-r879-rxgj-3g75) (medium, Vercel AI / AG-UI adapters load a message in time that grows with the square of its part count), [GHSA-4cj4-hgwf-4hc4](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4) (medium, a tool result disguised as a file object gets trusted as a real file on reload), [GHSA-5ppx-9jq6-6pmw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5ppx-9jq6-6pmw) (low, a domain blocklist resolves DNS before deciding to block), [GHSA-mgmv-r532-pg36](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mgmv-r532-pg36) (medium, an MCP server's URL-derived ID could leak a path secret to the frontend) → most share the same "expand or resolve first, check second" ordering bug, concentrated in paths that touch externally influenced content: AG-UI/Vercel AI endpoints, message-history replay, and `allowed_domains` restrictions
- **OpenSandbox / RenderSandbox**: `OpenSandbox` lets an agent workspace be self-hosted; `RenderSandbox` runs the workspace directly on Render's sandbox service → one less reason to lock an isolated execution environment to a single cloud provider
- **Azure Durable Task persistence**: `pydantic_ai_harness` adds Azure Durable Task as a durability backend → long-running agents on Azure get native persistence instead of wiring up a separate workflow engine
- **Pixeltable tools and memory storage**: the harness adds a Pixeltable integration usable both as a tool and as memory storage → a local-vector-database option for memory that doesn't need a separate API key
- **include_instructions for the MCP capability**: a new `include_instructions` setting can keep an MCP server's instructions out of the agent's own instructions → connecting several MCP servers no longer floods the system prompt with each one's bundled instructions

## Breaking Changes

There are no API-signature breaking changes in this release, but two of the security fixes change the behavior of existing deployments in ways worth acting on before upgrading:

- An `MCP` capability configured with only a server URL and no explicit `id` used to derive that ID from the URL's hostname and last path segment; if the path carried a secret (say, an access token), the AG-UI / Vercel AI adapters would send that ID to the frontend along with MCP Apps tool results
  - Impact: deployments that connected to MCP servers this way between v2.57.0 and v2.60.0, with a secret in the URL path, should rotate those servers' credentials now
- OpenTelemetry instrumentation enabled for embedding models used to record the `extra_headers`/`extra_body` embedding settings in the trace
  - Impact: deployments that instrument embedding models and pass secrets through those settings should restrict access to historical traces and rotate the credentials they exposed

## Migration Guide

### Upgrading from 2.65.0 to 2.66.0

```bash
pip install --upgrade pydantic-ai==2.66.0
```

The upgrade itself needs no code changes; the two items above are cleanup for data that was already exposed, not a compatibility break:

```python
# If an MCP server was ever connected via a URL path that carried a secret,
# rotate that server's credentials — then upgrade to v2.66.0
# (the ID-derivation bug itself was already fixed in v2.60.0; this is just the cleanup)

# If OpenTelemetry instrumentation was enabled for an embedding model and secrets
# were passed through extra_headers/extra_body, restrict access to existing traces
# and rotate those credentials
```

Everything else (`OpenSandbox`, `RenderSandbox`, Azure Durable Task, Pixeltable, `include_instructions`) is additive — code that doesn't use these features keeps working unchanged.

## Comparison with other frameworks

Yesterday (2026-11-04) this series covered Pydantic AI v2.65.0's `ConversationStore` persistence layer; today it's the same framework's security disclosure batch, and the cadence itself is worth noting. Few agent frameworks disclose this many independently numbered GHSAs at once — most security fixes get buried in ordinary bug-fix language instead. Haystack v2.31.1, released the same day, is a good contrast: its release notes are two lines about bumping dependency versions, with no corresponding public GHSA entries. Pydantic AI routes every vulnerability through a formal security-advisory process instead, which gives users something auditable — exactly what got fixed, and whether they're affected — but it also means reading the version number alone (2.65.0 → 2.66.0, which looks like an ordinary minor bump) would badly understate how urgent this upgrade is.

## Today's Takeaway

I used to assume agent-framework security problems lived almost entirely at the "should the model's output be trusted" decision point. Looking at this batch of advisories, the detail that stands out is how much damage a plain implementation-ordering mistake can do on its own: a deeply nested JSON document expanded before the size cap is checked, a domain blocklist that resolves DNS before deciding whether to block. None of that depends on the model being fooled — it's purely a case of "check" being written after "expand" in the code. Resource-exhaustion bugs like these don't need the model at all; they just need attacker-influenced input to reach the wrong order of operations.

## References

- [Pydantic AI v2.66.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.66.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.65.0...v2.66.0](https://github.com/pydantic/pydantic-ai/compare/v2.65.0...v2.66.0)
- [GHSA-m5vj-8mcw-82qx: WebFetch / web_fetch_tool expands JSON before checking the size limit](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx)
- [GHSA-4cj4-hgwf-4hc4: message-history replay trusts a disguised file object](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4)
- [GHSA-mgmv-r532-pg36: an MCP server's URL-derived ID could leak a path secret](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mgmv-r532-pg36)
- [Yesterday's coverage: Pydantic AI v2.65.0 (ConversationStore)](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0-en)
