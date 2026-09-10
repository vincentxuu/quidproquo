---
title: "Tool Pick | skills — Ship a Package's Agent Skill So It Installs Automatically Along the Dependency Tree"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI that lets Dart/Flutter package authors ship Agent Skills with their packages, so users get them auto-installed into Claude Code, Cursor, Codex, and more with one command"
tldr: "skills is Serverpod's open-source CLI: package authors ship a skills/ directory with their Dart/Flutter package, and users run skills get to auto-install every dependency's Agent Skill into Claude Code, Cursor, Codex, and more. Install: dart pub global activate skills. It addresses the problem of AI assistants not knowing how to use a third-party package without manually pasted docs or hand-written rule files."
series:
  name: "AI Tool of the Day"
  order: 27
---

> 🌏 [中文版](/posts/daily/2026-09-11-tool-dart-skills-cli)

## Tool Info

| Field | Value |
|---|---|
| Name | skills (Dart/Flutter Skills CLI) |
| Type | CLI |
| GitHub | [serverpod/skills](https://github.com/serverpod/skills) |
| Stars | 27 |
| Language | Dart |
| License | BSD-3-Clause |
| Install | `dart pub global activate skills` |

## What Problem It Solves

Add a new Dart/Flutter package to your project, and your AI assistant usually has no idea how to use it. It guesses, falls back on stale APIs it saw during training, or outright hallucinates methods that don't exist. Your options are to copy-paste the package docs into the chat window every time, or hand-write a `.cursorrules` or `CLAUDE.md` rule file and stuff it into context. The moment the package updates, that hand-written rule file goes stale, and nobody remembers to keep it in sync.

skills lets package authors ship an Agent Skill directly with the package: put a `skills/` directory at the package root, with each subdirectory holding a `SKILL.md` written to the [Agent Skills specification](https://agentskills.io/specification). Run `skills get` at the root of your project, and the CLI walks your entire dependency tree, finds each package's `skills/` directory, auto-detects whether you're using Claude Code, Cursor, Codex, Cline, GitHub Copilot, Antigravity, or OpenCode, and installs the matching skill into that tool's expected location (`.claude/skills/`, `.cursor/skills/`, and so on). Skills track the package version — update the package and the skill updates with it. Remove the package from `pubspec.yaml`, and `skills prune` clears out the orphaned skill. Even if a package hasn't shipped a skill yet, the CLI can also pull community-maintained ones from a GitHub registry (like the official `flutter/skills`).

Good fit for: Dart/Flutter package maintainers who want their users' AI assistants to hallucinate less about their API; teams with a monorepo full of internal packages who want to install every dependency's skill in one shot; and developers who've already written skills to the Agent Skills spec but are still copy-pasting them by hand and want distribution to follow the dependency version automatically.

## Quick Start

### Install

```bash
# Activate the CLI globally
dart pub global activate skills

# Make sure ~/.pub-cache/bin is on your PATH
# (see https://dart.dev/tools/pub/cmd/pub-global#running-a-script-from-your-path)
```

### Basic Usage

```bash
# From the root of your Dart/Flutter project:
# scan the whole dependency tree and install every package's skills
skills get

# Install skills from one specific package
skills get serverpod

# List skills currently installed and tracked by the CLI
skills list

# After removing a package from pubspec.yaml, clean up its orphaned skills
skills prune
```

### Advanced Usage

```bash
# Target a specific IDE explicitly (if several are detected, all get installed by default)
skills get --ide claude

# Scaffold a new skill for your own package
skills create
# prompts for a name and description, creates skills/<package>-<name>/SKILL.md

# Remove the skills installed from one package
skills remove serverpod
```

## Comparison with Existing Tools

| | skills (Dart) | `npx skills` (skills.sh, Vercel Labs) | Hand-written CLAUDE.md / .cursorrules |
|---|---|---|---|
| Auto-discovers skills via the project's own dependency tree | ✅ | ❌ (each source named explicitly) | ❌ |
| One command installs every dependency's skills | ✅ `skills get` | Partial (run `add` per source) | ❌ |
| Auto-detects and writes to the right IDE directory | ✅ (7 tools) | ✅ | Manual |
| Cleans up skills after a dependency is removed | ✅ `skills prune` | ❌ | Manual |
| Cross-language public skill marketplace | ❌ (can pull GitHub registries, still Dart-centric) | ✅ (skills.sh indexes 70K+ public skills) | ❌ |

`npx skills` follows an npm-style package-manager model: a skill's source is any GitHub repo, and you need to know that repo's name to `add` it. `skills` (Dart) instead ties a skill to the package's own dependency relationship — as long as your project depends on the package, `skills get` pulls its skill along automatically, with no separate skill manifest to maintain.

## Things to Watch Out For

- **Dart/Flutter-only for now**: the CLI works by scanning `pubspec.yaml`'s dependency tree, so it's a no-op outside that ecosystem; package authors also have to add the `skills/` directory by hand — nothing generates it for them.
- **GitHub registries need git installed**: pulling community skills from a registry like `flutter/skills` or `serverpod/skills-registry` requires `git` on your PATH. Without it, `skills get` just prints a warning and falls back to package-bundled skills only.
- **The maintainers call this a stopgap**: the README notes the Dart team is building a similar mechanism based on Dart's own MCP server, and this package may adopt that standard or be deprecated once it ships — adopt it now with the expectation that a migration may be needed later.

## Today's Takeaway

Teaching an AI assistant how to use a package used to be the user's job — whether to write a rule file, whether to paste in docs, was a call every individual developer made on their own. skills moves that responsibility back onto the package author: the skill ships with the package version, updates with it, and gets cleaned up when the package is removed — part of the package maintenance workflow instead of a chore every consumer redoes on every new dependency.

## References

- [serverpod/skills GitHub repo](https://github.com/serverpod/skills): source for the README, install command, CLI command list, and supported-IDE table; stars (27), language (Dart), and license (BSD-3-Clause) from the GitHub API.
- [Skills CLI 1.0 — official Dart blog announcement](https://dart.dev/blog/skills-cli-1-0-bundle-and-distribute-ai-agent-skills-for-your-packages): source for the 1.0 release details and the author/consumer install flows.
- [skills | Dart package — pub.dev](https://pub.dev/packages/skills): cross-checked the package description and supported-IDE table.
- [Agent Skills: The Complete Guide to Extending AI Coding Agents — Denser.ai](https://denser.ai/blog/agent-skills-guide): source for how `npx skills`/skills.sh (Vercel Labs) works and the marketplace's scale (70K+ skills).
