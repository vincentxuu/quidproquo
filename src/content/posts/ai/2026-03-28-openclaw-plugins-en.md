---
title: "The OpenClaw Plugin System: Treat Installs Like Running Code, and a Cold Check Proves Nothing About Runtime"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, plugins, clawhub, install-policy, supply-chain, plugin-sdk]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 28
tldr: "The official framing is to treat plugin installs like running code — ClawHub and the bundled catalog are trusted sources, while arbitrary npm, git, and local paths require --force in noninteractive installs. And verification means inspect --runtime, because a bare inspect is only a cold manifest check."
description: "Installing and managing OpenClaw plugins: the five install sources and bare-spec resolution, the security.installPolicy operator gate, how allow/deny lists interact, version compatibility fallback, and proving a plugin actually loaded."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-plugins)

Plugins extend OpenClaw with channels, model providers, agent harnesses, tools, skills, speech, realtime transcription, media understanding and generation, web fetch, web search, and other runtime capabilities.

Rather than enumerating what exists (that lives in the [inventory](https://docs.openclaw.ai/plugins/plugin-inventory)), this article covers **the security and verification model around installing** — which is where the real design lives.

## The framing: treat installs like running code

Quoting upstream:

> **Treat plugin installs like running code.** Prefer pinned versions for reproducible production installs. ClawHub packages and OpenClaw's bundled/official catalog are trusted sources. **New arbitrary npm, git, local path/archive, `npm-pack:`, or marketplace sources require `--force` in noninteractive installs after you review and trust the source.**

That sentence splits sources into two trust tiers and **puts the friction on the untrusted tier** — neither blocking everything nor waving everything through.

## Five install sources

| Source | When | Form |
|---|---|---|
| ClawHub | You want OpenClaw-native discovery, scans, version metadata, install hints | `clawhub:<package>` |
| npm | You need the npm registry or dist-tag workflows | `npm:<package>` |
| git | You need a branch, tag, or commit | `git:github.com/<owner>/<repo>@<ref>` |
| local path | You are developing or testing locally | `--link ./my-plugin` |
| marketplace | You are installing a Claude-compatible marketplace plugin | `--marketplace <...>` |

**Bare package specs have special compatibility behavior**, and this is easy to trip on:

- A bare name **matching a bundled plugin id** uses **that bundled source**
- A bare name matching an **official external plugin id** uses the official package catalog
- Any other bare spec **installs through npm** during the launch cutover
- **Raw `@openclaw/*` specs matching bundled plugins also resolve to the bundled copy** before the npm fallback

So to say "I specifically want the external npm package, not the bundled copy," write `npm:@openclaw/<name>@<version>`. For deterministic source selection, always prefix.

## Version compatibility falls back on its own

A genuinely useful behavior: **for npm installs, unpinned specs and `@latest` choose the newest stable package advertising compatibility with this OpenClaw build.**

If npm's current latest declares a newer `openclaw.compat.pluginApi` or `openclaw.install.minHostVersion` than this build supports, **OpenClaw scans older stable versions and installs the newest one that fits.**

But **exact versions and explicit channel tags like `@beta` stay pinned and fail when incompatible** — an explicit request is honored, the same instinct as `host=sandbox` failing closed in the exec article.

## The operator install-policy gate

`security.installPolicy` runs a trusted local policy command before a plugin install or update proceeds. It receives metadata plus the staged source path and can **allow, warn, or block**, and it **covers both CLI and Gateway-backed install/update paths.**

Warning handling is designed carefully:

- **The CLI** can acknowledge interactively — you type the target name using the same copy as suspicious ClawHub releases, and **policy is then re-evaluated**
- Noninteractive direct CLI commands can pass `--acknowledge-install-policy-warning`, which **approves every warning for that invocation, while each warning is still re-evaluated before the install continues**
- **The Control UI** shows the structured warning with an **Install anyway** action that behaves the same way
- **Other Gateway-backed and automatic installs remain blocked** when they have no operator-confirmation flow

Three things that do **not** substitute for it: **`--force` does not approve a policy warning**, the deprecated `--dangerously-force-unsafe-install` does not either, and **plugin `before_install` hooks run later** (as the agent-loop article noted: operator-owned install decisions belong in `security.installPolicy`, not `before_install`).

## How allow and deny lists interact

If `plugins.allow` is set, **an installed plugin id must be in that list before the plugin can load.**

There is a considerate behavior here: **`openclaw plugins install` adds the installed id to an existing `plugins.allow` list and removes that id from `plugins.deny`**, so an explicit install can actually load after a restart.

(The trap from the browser article is the other face of this mechanism: without `browser` in `plugins.allow`, the entire browser CLI and tool disappear.)

## After installing: restart, then prove it loaded

**Installing, updating, or uninstalling plugin code requires a Gateway restart.** A managed Gateway with config reload enabled detects the changed install record and restarts automatically; otherwise:

```bash
openclaw gateway restart
```

The verification step is stated explicitly upstream, and it is worth copying:

```bash
openclaw plugins inspect <plugin-id> --runtime --json
```

> Use `--runtime` to **prove** registered tools, hooks, services, Gateway methods, or plugin-owned CLI commands. **Plain `inspect` is a cold manifest and registry check only.**

This is exactly the principle from the MCP article — "saving a definition proves nothing about reachability, the probe does." **Existence in config is not existence at runtime.** A system that keeps repeating this in its docs has usually been bitten by it.

## The big picture

The plugin system's design axis is **supply-chain trust tiers plus runtime verification.**

Trust tiers: ClawHub and the official catalog are trusted, other sources require an explicit statement (`--force`), and `security.installPolicy` lets an organization add its own gate on top — a gate that **`--force` cannot bypass.**

Runtime verification: restart after installing, then prove it with `inspect --runtime`. Do not trust the cold check.

If you take one line, take **"treat plugin installs like running code"** — because that is precisely what they are.

## Changelog

- 2026-08-18: Substantially revised against the current official docs, refocusing from plugin architecture and SDK overview onto **the install security and verification model**. Added: the official "treat installs like running code" framing and trust tiering (arbitrary npm/git/local/marketplace sources requiring `--force` noninteractively), **the five install sources and bare-spec resolution** (including `@openclaw/*` resolving to the bundled copy and needing an `npm:` prefix for the external package), **automatic version-compatibility fallback** (unpinned specs scanning older stable versions, exact versions and `@beta` staying pinned and failing on incompatibility), **the `security.installPolicy` operator gate** (covering CLI and Gateway paths, interactive and noninteractive acknowledgement, and the fact that neither `--force` nor the deprecated unsafe-install flag approves a warning while `before_install` runs later), how `plugins.allow`/`deny` interact with the install command, and that **`inspect --runtime` is what proves runtime loading while a bare inspect is only a cold check**.

## References

This article draws on the following official OpenClaw documentation:

- [Plugins](https://docs.openclaw.ai/tools/plugin) — install sources, the policy gate, runtime verification
- [Manage plugins](https://docs.openclaw.ai/plugins/manage-plugins) — command examples
- [Plugin inventory](https://docs.openclaw.ai/plugins/plugin-inventory) — bundled, official external, and source-only plugins
- [Plugin SDK](https://docs.openclaw.ai/plugins/sdk-overview), [Build plugins](https://docs.openclaw.ai/plugins/building-plugins) — the authoring side
- [ClawHub](https://docs.openclaw.ai/clawhub) — community plugin discovery
