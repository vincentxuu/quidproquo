---
title: "Claude Code settings.json Complete Guide: Five Scopes, Merge Rules, and the Keys That Matter"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, configuration, settings, permissions]
lang: en
tldr: "Claude Code reads settings from five levels — managed settings, CLI flags, project local, shared project, and user — where plain values are overridden by higher levels while list keys like permissions.allow merge across scopes. This guide covers each file's role, the allow/deny/ask rule syntax, and how to verify your settings with /status and claude doctor."
description: "A reference for Claude Code settings.json: the five scopes and their precedence stack, how list keys merge across files, a permissions.allow/deny/ask example, common keys like model/env/hooks/statusLine, and how to debug settings that don't apply."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 6
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide)

The [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) mentioned that trusted commands can be whitelisted in `.claude/settings.json`; the [.claude directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en) covered the rest of the folder. This post finishes the story of the main character itself: settings.json is the control center for Claude Code behavior — default model, permission rules, hooks, status line, environment variables all come from here. Understanding it comes down to two questions: **which layer does a file live in**, and **when two layers set the same key, who wins**.

## Five scopes, one per audience

The official docs arrange settings sources into a precedence stack, highest on top:

| Level | File | Who it affects |
|-------|------|----------------|
| Managed | `managed-settings.json`, MDM, or the claude.ai console | Every machine your organization deploys to; nothing local overrides it |
| Command line | `claude --settings '<json>'` | That session only |
| Project local | `.claude/settings.local.json` | Your personal preferences in this one project |
| Shared project | `.claude/settings.json` | Everyone in the project, once committed |
| User | `~/.claude/settings.json` | You, in every project on this machine |

A few rules of thumb: personal preferences (theme, editor mode, your own permission rules) go in the user file; team-wide permissions, hooks, and env go in the shared project file and get committed; when you want to differ from your team in one project (they standardized on Sonnet, you want Opus), put it in the local file and nobody else's session changes.

You don't need to gitignore the local file yourself — the first time Claude Code writes it, it adds the path to your global git excludes. Also, choosing "Yes, and don't ask again" on a permission prompt saves an allow rule into exactly that local file.

The managed tier at the top comes from your organization: a `managed-settings.json` in a system directory, an MDM policy, or server-managed settings from the claude.ai admin console. It overrides everything below — even `--settings` can't move it.

## When two layers set the same key

One-sentence rule: **plain-value keys, the higher level wins**. Your team sets `"spinnerTipsEnabled": true` in `.claude/settings.json` and you set `false` at user level? You'll see tips in that project, because shared project outranks user. Take it back by writing `false` again in that project's `.claude/settings.local.json` — local outranks shared project and affects only you.

But **list keys don't override; they merge across scopes**. If `permissions.allow` has entries at both user and project level, all of them apply together — so your organization's allow rules apply alongside yours. That's expected behavior, not a bug. A few exceptions follow their own rules: `fallbackModel` is an ordered chain and `availableModels`, once defined by managed settings, applies as-is — neither merges.

One more source of confusion: environment variables like `ANTHROPIC_MODEL` aren't a level in this stack. For each variable/key pair, which one wins is decided individually — check the env-vars reference.

## The three permissions lists

The old `allowedTools`/`disallowedTools` keys have been replaced; rules now live under `permissions`, an object with `allow`, `ask`, and `deny` lists plus helpers like `defaultMode` and `additionalDirectories`. A typical personal file:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

Three things worth knowing. First, the `$schema` line gives you autocomplete and inline validation in VS Code. Second, in a committed settings file, `deny` and `ask` rules take effect immediately, but `allow` rules only apply after each teammate trusts the folder — so a cloned repo can't hand out execution permissions right away. Third, when you pick "don't ask again" on a prompt, that rule lands only in your local file, and an allow rule there doesn't outrank an `ask` rule from the project or a managed file.

## Common keys at a glance

The settings reference indexes over a hundred keys; these are the ones you'll actually touch day to day:

| Key | What it does |
|-----|--------------|
| `model` | Default model for new sessions; switch mid-session with `/model` |
| `permissions` | The three lists above plus `defaultMode` |
| `env` | Environment variables injected into every session and its subprocesses |
| `hooks` | Event-driven automation — run your scripts before tool calls and more |
| `statusLine` | Render the line below the prompt with your own command |
| `outputStyle` | Swap system-prompt style; takes effect after `/clear` or a restart |
| `alwaysThinkingEnabled` | Turn extended thinking on by default |

Two common misconceptions to clear up: MCP server configuration is **not** in settings.json — project scope uses `.mcp.json`, user and local scope use `~/.claude.json`. And `~/.claude.json` itself is a fifth file that Claude Code manages for you, holding sign-in state and global config keys; you rarely need to edit it by hand.

## Verifying your settings took effect

After changing a setting, don't guess — ask Claude Code:

1. **`/status`**: the Status tab has a `Setting sources` line listing every file loaded for this session (User settings, Project local settings, ...). Note it tells you which files were read, not which file supplied each key.
2. **`claude doctor`**: lists rejected entries. JSON typos and misspelled keys show up here.
3. **Watch the startup dialog**: settings files are strict JSON — `//` comments and trailing commas are syntax errors. A broken whole file is a Settings Error; individual bad entries are a Settings Warning, where the bad entries are skipped and the rest stays in effect.

One convenience: most edits (including permissions and hooks) hot-reload on save — no restart needed for a running session. Exceptions are `model`, `effortLevel`, and `outputStyle`, which are read at session start.

## Lessons

The settings system is remarkably consistent: **the level decides who overrides whom; the value type decides whether things merge**. Organization security policy goes in managed, personal preferences in user, team conventions in shared project, personal exceptions in local — one model scaling from enterprise governance down to individual habits. Next time a setting "doesn't work", run `/status` first to see what loaded, then check whether a higher level also sets the same key. Nine times out of ten those two steps settle it.

## References

- [Claude Code settings — Official Docs](https://code.claude.com/docs/en/settings.md) — the five scopes, the precedence stack, list-merge rules, managed-settings exceptions, Settings Error types, and verifying with `/status`
- [Claude Code settings reference — Official Docs](https://code.claude.com/docs/en/settings-reference.md) — index of every settings key with its scope, type, and example

## Changelog

- 2026-08-26: Rewritten against the latest official documentation.
