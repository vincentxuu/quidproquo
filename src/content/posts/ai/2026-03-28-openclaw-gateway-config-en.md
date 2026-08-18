---
title: "OpenClaw Gateway, Part 1: Strict Validation Will Refuse to Boot — and the Guards That Stop You From Yourself"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, configuration, json5, hot-reload, validation]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 26
tldr: "OpenClaw validates config strictly — one unknown key, a wrong type, or an invalid value and the Gateway refuses to start. It keeps a last-known-good copy, but neither startup nor hot reload restores it automatically; only doctor --fix does."
description: "A guide to OpenClaw Gateway configuration: JSON5 and strict validation, which commands still work when validation fails, last-known-good and .rejected files, the three anti-clobber conditions, hybrid hot reload, and the two-bucket rule."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-gateway-config)

The Gateway reads an **optional JSON5 config** from `~/.openclaw/openclaw.json`, falling back to safe defaults when the file is missing.

This article is not a field list (that lives in the [configuration reference](https://docs.openclaw.ai/gateway/configuration-reference), and it is long). It is about **how the config system behaves** — especially when it stops you.

## Strict validation: an unknown key means no boot

The first thing to know:

> OpenClaw only accepts configurations that **fully match the schema**. Unknown keys, malformed types, or invalid values cause the Gateway to **refuse to start**.

The only root-level exception is `$schema` (a string), so editors can attach JSON Schema metadata.

**When validation fails, only diagnostic commands work**: `openclaw doctor`, `openclaw logs`, `openclaw health`, `openclaw status`. The repair is `openclaw doctor --fix` (`--repair` is the same flag; `--yes` skips prompts).

The stance is clear: **better to not boot at all than to run with config you believe is active but is actually being ignored.** A mistyped key that silently does nothing is the nastiest failure mode a config system has.

## last-known-good will not rescue you automatically

The Gateway keeps a **trusted last-known-good copy** after each successful startup. With one crucial limitation:

**Neither startup nor hot reload restores it automatically — only `openclaw doctor --fix` does.**

On validation failure the Gateway either fails to start or skips that reload while the running process keeps the last accepted config. A rejected write is also saved as **`.rejected.<timestamp>`** for inspection — so you do not lose what you just typed and can diff it against the schema.

There is also a promotion rule: **a candidate containing a redacted secret placeholder** (`***`, `[redacted]`) **is never promoted to last-known-good.** That avoids the very hard-to-debug disaster of enshrining a redacted config as your baseline.

## Anti-clobber: three shapes that get blocked

The Gateway blocks writes that look like accidental clobbers, unless the write explicitly allows destructive changes:

- **Dropping `gateway.mode`**
- **Losing the `meta` block**
- **Shrinking the file by more than half**

All three are the classic disaster shapes of programmatic config editing — read, modify slightly, write back, and lose most of the content somewhere in between. Using size plus the presence of key fields as a heuristic is crude but effective.

## File-level caveats

**The active config path must be a regular file.** OpenClaw-owned writes are **atomic** (rename onto the path), so **a symlinked `openclaw.json` gets its target replaced rather than written through** — avoid symlinked config layouts.

If you keep config outside the default state directory, point `OPENCLAW_CONFIG_PATH` at the real file.

There is also a startup guard on the CLI side: **the Gateway refuses to start unless `gateway.mode=local` is set.** `--allow-unconfigured` bypasses the guard for ad-hoc or dev runs without writing or repairing config. A config file that exists but lacks `gateway.mode` is treated as damaged — **the Gateway will not guess `local` for you.**

## Hot reload: hybrid is the default

`gateway.reload.mode` takes three values, defaulting to `hybrid`:

| Mode | Behavior |
|---|---|
| `off` | No config reload |
| `hybrid` (default) | Hot-apply when safe, restart when required |

Reload watches **the active config file path** (resolved from profile/state defaults, or `OPENCLAW_CONFIG_PATH` when set). After the first successful load the running process serves an **in-memory snapshot of the active config**, and a successful reload **swaps that snapshot atomically**.

Settings like `messages` take effect after saving without a restart; you only need to restart when reload is disabled.

## The two-bucket rule

To orient yourself in a long field list, remember this split:

- **Root siblings**: infrastructure and cross-agent defaults
- **`agents.defaults`**: agent-loop behavior
- **`agents.entries`**: may override either bucket wherever the schema supports a per-agent override

## Four ways to edit

```bash
openclaw onboard        # full onboarding
openclaw configure      # config wizard
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
```

The Control UI's **Config** tab **renders a form from the live config schema**, including field `title`/`description` metadata plus plugin and channel schemas when available, with a **Raw JSON** editor as the escape hatch.

Settings are now tiered: **common fields first, advanced ones collapsed into an "Advanced (N)" group.** The tiering comes from `uiHints` in the schema — `advanced: false` marks common, `true` marks advanced, a leaf inherits its nearest ancestor's tier, and **paths with no declared ancestor default to advanced.** Note this affects **presentation only** — not validation, defaults, reload behavior, or whether a key can be set.

For agents and tooling there is also `config.schema.lookup`, which fetches one path-scoped schema node plus child summaries for drill-down UIs. The docs explicitly recommend that **agents consult it for field-level documentation before editing config** rather than editing from memory.

## The big picture

This config system has two personalities: **zero tolerance for error** (off-schema means no boot) and **considerable protection against accidents** (last-known-good, `.rejected` backups, anti-clobber heuristics).

In practice that means two habits: when the Gateway will not start after a config change, **run `openclaw doctor` for the exact issue before reaching for `--fix`** rather than rewriting from scratch; and **do not manage `openclaw.json` through a symlink**, because atomic writes will replace your link target wholesale.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **strict validation refusing to boot** (unknown keys, bad types, invalid values, with `$schema` the only root exception) and the four diagnostic commands that still work, the fact that last-known-good is **not** auto-restored on startup or reload (only `doctor --fix`), rejected writes saved as `.rejected.<timestamp>`, candidates containing redacted placeholders never being promoted, the three anti-clobber shapes (dropping `gateway.mode`, losing `meta`, shrinking by more than half), the regular-file requirement and how atomic writes replace a symlink target, the `gateway.mode=local` startup guard, hybrid reload's atomic snapshot swap, the two-bucket rule, and the Control UI's schema-generated form with `uiHints` common/advanced tiering.

## References

This article draws on the following official OpenClaw documentation:

- [Configuration](https://docs.openclaw.ai/gateway/configuration) — JSON5, strict validation, editing, the two-bucket rule
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference) — the full field map
- [Configuration examples](https://docs.openclaw.ai/gateway/configuration-examples) — copy-paste configs
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — reload modes and operator commands
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway) — the `gateway.mode=local` guard and `--allow-unconfigured`
