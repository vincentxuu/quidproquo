---
title: "Framework Update: Pydantic AI v2.52.0"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.52 patches a security issue in web_fetch (deeply nested HTML can exhaust CPU/memory), unifies every harness capability (Coder/Shell/FileSystem) behind a single Workspace interface shared by local execution and four sandbox backends, and ships the first pydantic-clai2 CLI"
tldr: "Three things in Pydantic AI v2.52.0: (1) security — GHSA-v36g-jcw9-x7cw (moderate): attacker-controlled HTML with deeply nested elements fed into the local web_fetch tool could exhaust CPU/memory; provider-native web fetching is unaffected; patched in both 2.52.0 (v2) and 1.107.7 (v1); (2) a new Workspace abstraction — Coder/Shell/FileSystem and the rest of the harness now go through ctx.workspace, sharing one API across local execution and four sandbox backends (SSHWorkspace, BubblewrapSandbox, E2BSandbox, SpritesSandbox), with ModalSandboxSession renamed to ModalSandboxBackend; (3) pydantic-ai-harness jumps from 0.36.0 to 0.52.0 and now ships with every release, alongside the first pydantic-clai2 (`uvx pydantic-clai2`) CLI release, bundled with plugins like github, slack, notion, and logfire_mcp."
series:
  name: "AI Framework Changelog"
  order: 29
---

> 🌏 [中文版](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.52.0 |
| Previous | v2.51.0 |
| Released | 2026-09-29 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.52.0) |
| Security Advisory | [GHSA-v36g-jcw9-x7cw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-v36g-jcw9-x7cw) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.3k |

## Why this release matters

Two things landed together here. First, a security fix: the local `web_fetch` tool's HTML parser could be pushed to exhaust CPU and memory by feeding it attacker-controlled pages with deeply nested elements — a classic algorithmic-complexity DoS. Provider-native web fetching (parsed server-side by the provider) is unaffected; only Pydantic AI's own local parser was exposed. The advisory rates it moderate, and both 2.52.0 (v2) and 1.107.7 (v1) are patched. Second, an architectural shift: `Coder`, `Shell`, and `FileSystem` used to each bind to their own execution environment — local, or a one-off Modal sandbox integration written separately. 2.52.0 pulls them all behind `ctx.workspace`, so local execution and four sandbox backends (SSHWorkspace, BubblewrapSandbox, E2BSandbox, and Fly.io's SpritesSandbox) share the same interface — tool code no longer needs a separate implementation per backend. `pydantic-ai-harness` also moved into the main repo and now ships with every release, and the first `pydantic-clai2` CLI landed alongside it — a sign that Pydantic AI is pushing beyond "library" territory toward "ships a CLI agent you can run directly," the same product shape as Claude Code or Codex CLI.

## What changed

- **Workspace abstraction (`ctx.workspace`)**: unifies file and command operations behind one API that runs locally or switches to a sandbox backend through the same calls, with durable-execution support → write tool logic once, swap execution environments without touching it
- **Four new sandbox backends**: `SSHWorkspace`, `BubblewrapSandbox`, `E2BSandbox`, and `SpritesSandbox` (running on Fly.io Sprites) all implement the same Workspace interface, covering deployment shapes from self-managed machines to hosted sandboxes
- **`ModalSandboxBackend` replaces `ModalSandboxSession`**: `ModalSandbox` used to ship its own tools; now `Coder`/`Shell`/`FileSystem` run in the sandbox through a Modal workspace, bringing it in line with the other three sandbox backends
- **`pydantic-ai-harness` folded into the main repo, versioned with the core package**: jumps from its independently maintained 0.36.0 straight to 0.52.0, tracking the main release number
- **First `pydantic-clai2` release**: launch with `uvx pydantic-clai2`; ships with built-in plugins — github, slack, notion, logfire_mcp, google_workspace, day_ai, ordinal, pylon — each with its own `/keys` or browser-login settings menu
- **`SubAgents` no longer load agent files by default; `inherit_tools` is deprecated**: a sub-agent's tools and settings now have to come from an explicit source instead of implicit inheritance
- **`AnthropicModel`'s default `max_tokens`**: first raised from 4096 to 16384 (for Claude Sonnet 4.5 and later), then changed again to default to the model's own maximum output, streaming such requests behind the scenes

## Breaking Changes

- `ModalSandboxSession` is renamed to `ModalSandboxBackend`:
  - Before: import/construct `ModalSandboxSession` directly
  - After: use `ModalSandboxBackend`, matching the behavior of the other three Workspace backends
  - Affected: projects using `ModalSandbox` to run Coder/Shell/FileSystem tools
- Behavior changes outside a strict API break (no signature changes, but defaults shift): `SubAgents` no longer load agent files by default (configurations relying on that default now need to pass settings explicitly); `AnthropicModel`'s `max_tokens` default changed twice in this release, shifting where long replies get truncated and how streaming kicks in

## Migration Guide

### Upgrading from 2.51.0 to 2.52.0

```bash
pip install --upgrade pydantic-ai==2.52.0
```

```python
# Before (2.51.0 and earlier, Modal sandbox)
from pydantic_ai.sandbox.modal import ModalSandboxSession
sandbox = ModalSandboxSession(app_name="my-agent")

# After (2.52.0, unified Workspace interface)
from pydantic_ai.sandbox.modal import ModalSandboxBackend
workspace = ModalSandboxBackend(app_name="my-agent")
agent = Agent(model, workspace=workspace)  # Coder/Shell/FileSystem now go through ctx.workspace
```

Projects not using the Modal sandbox have no code-level breaking change, but if `SubAgents` relied on the old default of inheriting agent files or tools, sub-agents will lose that implicit configuration unless it's now set explicitly. The `web_fetch` fix requires no code change — upgrading is enough to patch the vulnerability.

## How this compares to other frameworks

Pulling the execution environment behind a unified interface is a pattern showing up across the framework landscape this quarter — LangGraph did it for memory backends with native checkpointing; Pydantic AI just did it for sandbox backends with Workspace. Both moves absorb infrastructure that used to be the integrator's problem into the framework itself. But Pydantic AI took it a step further: `pydantic-clai2` ships as a CLI already loaded with plugins (github, slack, notion, logfire_mcp), not a bundled example tool — it's aiming at the same territory as Claude Code or Codex CLI, a framework that is itself a daily-usable agent product. Teams already treating Pydantic AI as a library and maintaining their own CLI wrapper on top should watch whether functionality keeps consolidating into `pydantic-clai2`, and whether adopting the official CLI directly beats maintaining that wrapper layer.

## Today's takeaway

I used to assume sandbox integrations would each expose their own dedicated API — Modal, E2B, SSH — with tool code branching on which one was in play. Seeing them all collapse behind a single `ctx.workspace` interface made the distinction clearer: differences between sandbox backends should stop at "how it's launched." They shouldn't leak into "how a tool calls the filesystem or shell." The former is a deployment decision; the latter is agent logic — conflating them locks the same tool code to one specific execution environment.

## References

- [Pydantic AI v2.52.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.52.0)
- [Security Advisory GHSA-v36g-jcw9-x7cw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-v36g-jcw9-x7cw)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.46.0 — previous framework update](/en/posts/daily/2026-09-21-framework-pydantic-ai-2.46.0-en)
- [PR #6492: Add the Workspace abstraction (`ctx.workspace`)](https://github.com/pydantic/pydantic-ai/pull/6492)
- [PR #8867: ModalSandboxBackend replaces ModalSandboxSession](https://github.com/pydantic/pydantic-ai/pull/8867)
- [PR #8869: Add SpritesSandbox (Fly.io)](https://github.com/pydantic/pydantic-ai/pull/8869)
- [PR #8868: Add E2BSandbox](https://github.com/pydantic/pydantic-ai/pull/8868)
- [PR #8956: Add SSHWorkspace and BubblewrapSandbox](https://github.com/pydantic/pydantic-ai/pull/8956)
- [PR #9023: SubAgents no longer load agent files by default](https://github.com/pydantic/pydantic-ai/pull/9023)
- [PR #8984: Patch the web_fetch deeply-nested-HTML DoS](https://github.com/pydantic/pydantic-ai/pull/8984)
- [Full Changelog: v2.51.0...v2.52.0](https://github.com/pydantic/pydantic-ai/compare/v2.51.0...v2.52.0)
