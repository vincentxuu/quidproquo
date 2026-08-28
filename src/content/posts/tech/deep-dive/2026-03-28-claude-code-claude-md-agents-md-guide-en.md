---
title: "How Claude Code Remembers Your Project: CLAUDE.md Layers, Imports, Rules, and Auto Memory"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, claude-md, auto-memory, rules, agents-md]
lang: en
tldr: "Every Claude Code session starts with a clean context window. Three memory mechanisms carry knowledge across sessions: CLAUDE.md files loaded every session, .claude/rules/ files that load conditionally via paths frontmatter, and auto memory Claude writes itself. All CLAUDE.md layers are concatenated into context — not inherited by override. This guide covers layer behavior, @path imports, monorepo strategies with nested CLAUDE.md, and sharing one instruction file across tools via @AGENTS.md."
description: "A deep dive into Claude Code's memory design: how the four CLAUDE.md layers concatenate into context, import syntax, conditional loading with .claude/rules/, how auto memory works, and monorepo strategies with nested CLAUDE.md files."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 9
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide)

Every time you start Claude Code, you get a fresh context window — everything it learned last session is forgotten by default. The [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) mentioned CLAUDE.md and auto memory in its access-scope list, and the [.claude directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en) walked through where each file lives. This post focuses on the more fundamental question: **how the memory system itself is designed** — what gets remembered, who writes it down, and how it stacks at load time.

## Three kinds of memory: yours, conditional, and self-written

The official docs split cross-session knowledge into two categories: CLAUDE.md (instructions you write) and auto memory (notes Claude writes itself). Add `.claude/rules/`, and in practice there are three:

| Memory | Who writes it | When it loads | Good for |
|--------|---------------|---------------|----------|
| `CLAUDE.md` | You | Start of every session | Build commands, conventions, "always do X" |
| `.claude/rules/*.md` | You | Only when touching matching files, if it has `paths:` | Rules meaningful only for specific file types |
| Auto memory | Claude | Index loads every session | Your preferences, corrections you've given it |

The key distinction is **enforcement**: all three are context, not enforced configuration. Claude reads them and tries to comply, but nothing guarantees it — if lint must run before every commit, write a hook, not a CLAUDE.md entry.

Auto memory is on by default. Claude stores what it learns under `~/.claude/projects/<project>/memory/`: `MEMORY.md` is an index, of which only the first 200 lines or 25KB load at session start; details go into topic files (`user_role.md`, `feedback_testing.md`) read on demand. It records four things — your role and preferences, corrections you've given, project context not derivable from code, and where external resources live — and skips anything derivable from the codebase like architecture or file paths. Use `/memory` to browse, edit, delete, or turn the whole thing off.

## Layers and concatenation: everything enters context, nothing overrides

CLAUDE.md has four levels, listed here in load order from broadest to narrowest:

1. **Managed policy**: deployed to the whole machine by IT (on macOS, `/Library/Application Support/ClaudeCode/`). Organization-wide rules individuals cannot exclude.
2. **User**: `~/.claude/CLAUDE.md` — your personal preferences across all projects.
3. **Project**: `./CLAUDE.md` or `./.claude/CLAUDE.md` at the repo root — team-shared, version controlled.
4. **Local**: `./CLAUDE.local.md` — your private notes for this project; add it to `.gitignore` yourself.

The most commonly misunderstood point: **these layers are concatenated into context — child layers do not override parent ones**. Your personal preferences and team standards are simultaneously present, ordered from the filesystem root down to your launch directory: instructions closer to your working directory are read later, and within each directory `CLAUDE.local.md` comes after `CLAUDE.md`. Conflicts are therefore never resolved automatically — when two files give different guidance for the same behavior, Claude may pick one arbitrarily. The official advice is to periodically prune outdated or contradictory entries.

Another frequently missed behavior: CLAUDE.md files from ancestor directories and your working directory load at launch, but **subdirectory files do not** — they load only when Claude actually reads files there. That is exactly the foundation of the monorepo strategy below.

## Imports: pulling files in with @path

Writing `@path/to/file` inside a CLAUDE.md expands that file into context at launch:

```markdown
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

A few rules: relative paths resolve against **the file containing the import**, not the working directory; imports can recurse up to four hops deep; a path wrapped in backticks (`` `@README` ``) is not parsed — use that to mention a filename without importing it. Note that imports are an organizational tool, not a token-saving one — imported files still load in full at launch.

## What goes where

One question decides everything: **would you repeat this to Claude in every session?**

- Yes, and the whole team needs it → project `CLAUDE.md`
- Yes, but only you need it → `~/.claude/CLAUDE.md` or `CLAUDE.local.md`
- Meaningful only when touching certain files → `.claude/rules/` with `paths:` frontmatter
- Multi-step procedures needed only for specific tasks → skills (load on demand)
- Must be guaranteed → hooks

There are concrete size numbers: keep each CLAUDE.md under 200 lines per the official guidance, and files over 4 MiB are skipped entirely. Longer files reduce adherence — they burn context in every session. As you approach the limit, split content into path-scoped rules.

## Monorepos: nested CLAUDE.md

The common failure mode in large repos is one root CLAUDE.md trying to cover every subsystem — ending up either too bloated to read or too generic to help. The official approach is a two-level split:

- Root `CLAUDE.md`: repository-wide rules (commit format, don't touch generated files)
- Per-subdirectory `CLAUDE.md`: conventions specific to that area's stack

Starting from `packages/api/`, the root file plus the api directory's file load while `packages/web/`'s does not; starting from the root, each package's file waits until Claude reads there. If some packages' CLAUDE.md files are irrelevant to you forever (other teams', legacy), exclude them by path with `claudeMdExcludes` — managed policy files excepted. One asymmetry worth knowing: settings.json does not follow this hierarchical logic — it loads only from your launch directory and is not inherited from parents, unlike CLAUDE.md.

## AGENTS.md: coexisting across tools

AGENTS.md is a cross-tool instruction-file standard shared by many coding agents, but Claude Code **reads CLAUDE.md, not AGENTS.md**. To make both tools see the same content, the docs offer two routes:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

After importing, you can append Claude-specific instructions below; if you don't need any, just symlink instead (`ln -s AGENTS.md CLAUDE.md`). Creating symlinks on Windows requires Administrator privileges, so the docs recommend imports there. We tried both approaches — details and trade-offs live in our separate post, [Keeping CLAUDE.md and AGENTS.md in sync with a symlink](/posts/tech/2026-04-05-symlink-agents-md-claude-md-en); I won't repeat them here.

## Lessons learned

The division of labor in this memory system is clean: **CLAUDE.md handles what must be known every session, rules handle what matters only when touched, and auto memory handles what you'd rather not re-explain**. All three are suggestions, not commands — commands belong to hooks and settings. The design's origin is context economy: the 200-line cap, path-scoped loading, and MEMORY.md's first-200-lines limit all serve the same goal — every session starts with just enough memory, no more.

## References

- [How Claude remembers your project (Memory) — Claude Code Docs](https://code.claude.com/docs/en/memory) — Official reference for CLAUDE.md layers, concatenation order, import syntax, `.claude/rules/`, and auto memory
- [Set up Claude Code in a monorepo or large codebase — Claude Code Docs](https://code.claude.com/docs/en/large-codebases) — Official guide to nested CLAUDE.md splits, `claudeMdExcludes`, and per-directory skills
- [Claude Code settings — Claude Code Docs](https://code.claude.com/docs/en/settings) — Official reference for settings-file scopes, source behavior, and project/local/user/managed settings
- [Automate actions with hooks — Claude Code Docs](https://code.claude.com/docs/en/hooks-guide) — Official guide to hooks as deterministic automation and enforcement points

## Changelog

- 2026-08-26: Rewritten from the CLAUDE.md+AGENTS.md outline with a refocused memory-system angle, based on the August 2026 official docs.
