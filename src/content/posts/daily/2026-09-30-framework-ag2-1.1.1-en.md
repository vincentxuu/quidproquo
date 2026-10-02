---
title: "Framework Update: AG2 v1.1.1"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: en
description: "AG2 v1.1.1 looks like a bugfix release by its version number, but it ships one breaking change (Bedrock moves to a native async client) plus two security fixes (restricted shell stops parsing shell syntax, same-named tools stop shadowing each other)"
tldr: "Three things in AG2 v1.1.1: (1) breaking — BedrockConfig switches from thread-wrapped boto3 to native async aiobotocore, and passing a boto3.Session now fails outright; (2) security — restricted shell mode parses a command into argv exactly once and runs that argv, so pipes, redirects, and globs can no longer smuggle a second command past the allowlist; (3) security — when multiple tools share a name, only one now resolves per turn, with code-declared tools taking priority over MCP or client tools. The version bump is a patch (1.1.0 → 1.1.1); the content is not."
series:
  name: "AI Framework Changelog"
  order: 28
---

> 🌏 [中文版](/posts/daily/2026-09-30-framework-ag2-1.1.1)

## Release Info

| Item | Value |
|---|---|
| Framework | AG2 (formerly the AutoGen community fork) |
| Version | v1.1.1 |
| Previous | v1.1.0 |
| Released | 2026-09-29 |
| Release Notes | [GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.1.1) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.0k |

## Why this release matters

The version number is usually the first filter when screening framework releases: a major bump might carry breaking changes, a patch is presumably just bug fixes. AG2 v1.1.1 is the counterexample — 1.1.0 to 1.1.1 is a patch number, but the release notes open with a `Breaking:` heading, followed immediately by a `Security` section. Bedrock calls move from "wrap synchronous boto3 in a thread" to a native async client (aiobotocore) — not a performance tweak, a full swap of how the client is built, and passing the old `boto3.Session` now fails immediately. The same release closes two security gaps: restricted-mode shell tools used to let pipes or globs smuggle in a second command; now a command is parsed into argv exactly once and run as that argv, nothing more. And when several tools shared a name, approving one used to implicitly approve its namesakes too; now each name resolves to exactly one tool. Put together, these three changes are a reminder that skipping a changelog just because it's a patch number is itself a risk.

## What changed

- **Bedrock moves to a native async client (Breaking)**: `BedrockConfig` no longer wraps synchronous boto3 in a thread per call — it now uses native async aiobotocore, and every Converse request is type-checked against the service's own stubs → projects passing `session=` need to switch to `aiobotocore.session.AioSession`, and the `bedrock` extra now installs `aiobotocore>=3.9.1,<4` instead of boto3
- **Restricted shell parses argv exactly once**: with `allowed=[...]` or `readonly=True` set, `SandboxShellTool`/`ShellAdapter` split the command into argv, check that argv, and run exactly it — nothing expands afterward → pipes, redirects, command chaining, globs, `~`, and variables are all unavailable in restricted mode, with shell syntax rejected with a clear error; the built-in `readonly=True` allowlist also shrank — commands like `find`, `file`, `sort`, `uniq`, and `git ...` are no longer built in and must be added to `allowed` explicitly
- **Same-named tools resolve to exactly one**: a model call used to reach every tool sharing a name, so approving one didn't bind its namesake → now code-declared tools override each other by declaration order (the later one wins), tools discovered at runtime (MCP) and client tools rank below code-declared ones, and a colliding MCP tool is dropped with a warning suggesting `tool_name_prefix`
- **Human input over AG-UI**: a tool inside a served agent can call `context.input()` to ask a human a question; the question reaches the AG-UI client as that run's interrupt outcome, and the answer comes back in the next run's `resume` → no need to hand-wire a separate side channel for human-in-the-loop
- **MCP conversations survive long turns**: `SessionStore`'s idle expiry and LRU overflow no longer drop a conversation while a turn is still running on it

## Breaking Changes

- `BedrockConfig(session=...)` now requires an `aiobotocore.session.AioSession`:
  - Before: `BedrockConfig(model=MODEL_ID, session=boto3.Session(profile_name="prod"))` → fails on the first call with `AttributeError: 'Session' object has no attribute 'create_client'`
  - After: `BedrockConfig(model=MODEL_ID, session=AioSession(profile="prod"))` (`from aiobotocore.session import AioSession`)
- The `bedrock` extra now installs `aiobotocore>=3.9.1,<4` instead of `boto3` — if your application also installs boto3 directly, pick a botocore version compatible with both pins
- Affected: projects calling Amazon Bedrock through `BedrockConfig` that manage their own boto3 session; projects not using Bedrock are unaffected

## Migration Guide

### Upgrading from 1.1.0 to 1.1.1

```bash
pip install --upgrade ag2==1.1.1
```

```python
# Before (1.1.0 and earlier)
import boto3
config = BedrockConfig(model=MODEL_ID, session=boto3.Session(profile_name="prod"))

# After (1.1.1)
from aiobotocore.session import AioSession
config = BedrockConfig(model=MODEL_ID, session=AioSession(profile="prod"))
```

Projects that don't use `BedrockConfig` have no code-level breaking change, but if you use `allowed=[...]` or `readonly=True` to restrict shell tools, re-check any pipe, redirect, or glob syntax you relied on — this is stricter runtime behavior, not a changed API signature, so a type checker won't catch it.

## How this compares to other frameworks

Hardening the boundary around what an agent's execution environment can do isn't unique to AG2 right now — CrewAI pinned its SSRF checks to every redirect hop a few months back to stop redirect-based bypasses. AG2's move here applies the same instinct to shell tools (argv-only parsing) and tool identity resolution (same-named tools no longer shadow each other): both changes replace "block after the fact" with "validate up front, then leave no room to expand." Against the watchlist's tracking focus on AG2's A2A support, this release isn't a protocol advance — it's a tightening of the trust boundary around the existing tool-calling layer. For teams already running AG2 in production, especially ones using Bedrock or restricted shell execution, this release should rank above "patch number, can wait."

## Today's takeaway

I used to screen framework releases by version number first — major gets a close read, patch usually gets skipped. AG2 v1.1.1 is a reminder that this framework doesn't strictly follow semantic versioning: a patch number can carry a full breaking change in how a client is built, plus two security fixes. Version number is a decent probabilistic filter, not a guarantee — and security fixes in particular often ship under a deliberately small version bump precisely because the maintainers don't want to wait for the next minor or major to get a fix out.

## References

- [AG2 v1.1.1 — GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.1.1)
- [ag2ai/ag2 — GitHub](https://github.com/ag2ai/ag2)
- [AG2 v1.0.2 — previous framework update](/posts/daily/2026-08-17-framework-ag2-1.0.2)
- [PR #3271: Bedrock moves to native aiobotocore async client (source of the breaking change)](https://github.com/ag2ai/ag2/pull/3271)
- [PR #3248: Human input over AG-UI (`context.input()`)](https://github.com/ag2ai/ag2/pull/3248)
- [PR #3288: MCP session store no longer drops a conversation mid-turn](https://github.com/ag2ai/ag2/pull/3288)
- [PR #3311: MCP conversations stay alive while any turn is running](https://github.com/ag2ai/ag2/pull/3311)
- [PR #3299: MCPServerTool sends exactly one Authorization header per provider](https://github.com/ag2ai/ag2/pull/3299)
