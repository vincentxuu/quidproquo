---
title: "The .claude Directory, Explained: settings, rules, skills, and auto memory"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, claude-directory, settings-json, auto-memory, anthropic]
lang: en
tldr: "Claude Code splits its configuration across the project `.claude/` folder and your home directory — 20+ file locations. Only two mental models matter: settings merge across layers and are enforced; CLAUDE.md and rules concatenate into context as guidance. And every file is committed, gitignored, or Claude-written."
description: "A per-file tour of both directory layers: CLAUDE.md, settings.json, rules, skills, commands, agents, workflows, and auto memory — who writes them, what to commit, what overrides what."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 2
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)

Two weeks into using Claude Code, you notice strange files appearing in your project root and home directory: `.claude/settings.local.json`, `~/.claude.json`, a pile of markdown under `~/.claude/projects/` that you do not remember writing. This post maps the locations from Anthropic's docs that you usually need to reason about — who creates each one, whether it should be committed, and what overrides what. Application data such as plugin caches, transcripts, snapshots, and debug logs are scoped to short notes rather than a complete inventory. It is the most useful follow-up to [the agentic loop post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en), because every extension mechanism covered later in this series drops its files somewhere on this map.

## Two mental models first

The whole system runs on two rules:

**Enforced configuration vs guidance.** Permissions and hooks in `settings.json` are **enforced** — they apply whether or not Claude understands them. CLAUDE.md and rules are **guidance** — concatenated into context for the model to read; it may or may not follow. Behavior you need guaranteed goes in settings or hooks. Background knowledge goes in CLAUDE.md.

**Settings use precedence and merges; CLAUDE.md concatenates.** The common settings-file stack is managed, command line, project local, shared project, then user. List-type keys like `permissions.allow` usually merge across scopes; scalar keys like `model` usually come from the higher-precedence source. But environment variables are resolved per key, and some model-list settings do not merge like ordinary arrays. CLAUDE.md files are all loaded into context together — not inherited-and-overridden. Global and project content coexist; conflicts are resolved by how you word the instructions.

## The project layer

### Three files at the root

- **`CLAUDE.md` / `.claude/CLAUDE.md`** (committed): project instructions loaded at the start of every session. Official advice: target under 200 lines — longer files still load in full but adherence drops. Content that only matters for specific tasks belongs in a skill or a path-scoped rule instead. Edit it from within a session with `/memory`.
- **`CLAUDE.local.md`** (gitignored): your private instructions for this project, loaded alongside CLAUDE.md; useful for sandbox URLs, preferred test data, and other personal context that should not be committed.
- **`.mcp.json`** (committed, lives at the project root — *not* inside `.claude/`): team-shared MCP servers. Reference secrets as `${ENV_VAR}` so tokens never land in the file.
- **`.worktreeinclude`**: lists gitignored files (typically `.env`) to copy into new worktrees, using `.gitignore` syntax.

### Inside `.claude/`

| File / folder | Identity | Purpose |
|---|---|---|
| `settings.json` | committed | Enforced config: permissions, hooks, statusLine, model, env |
| `settings.local.json` | gitignored | Your personal overrides for this project; highest of the user-editable files |
| `rules/` | committed | Topic-split instruction files; with a `paths:` frontmatter they load only when matching files enter context |
| `skills/` | committed | One folder + SKILL.md each, bundling reference docs and scripts |
| `commands/` | committed | Single-file prompts; now the same mechanism as skills — skill wins on name conflicts |
| `agents/` | committed | Subagent definitions with their own context windows and `tools:` allowlists |
| `workflows/` | committed | Dynamic workflow scripts saved from `/workflows` |
| `agent-memory/` | committed | MEMORY.md for subagents that set `memory: project` |

Common misunderstandings:

- **`settings.local.json` does not need manual `.gitignore` entries** — when Claude Code first saves a setting there, it adds the ignore rule to your global git excludes automatically. To share that rule with teammates, still add it to the project `.gitignore` yourself.
- **The value of rules is conditional loading.** A rule without `paths:` loads every session like CLAUDE.md; a rule with `paths:` globs only enters context when Claude reads a matching file. Test conventions only relevant to test files should not tax every session. When CLAUDE.md approaches 200 lines, start splitting into rules.
- **Write skills, not commands, for anything new.** Commands remain supported, but skills can bundle supporting files, and Claude knows the skill directory path so it can read bundled checklists and scripts on demand.
- `agent-memory/` is only created for subagents with a `memory:` frontmatter field; `memory: local` writes to `.claude/agent-memory-local/` (not version-controlled), and cross-project memory goes to `~/.claude/agent-memory/`.

## The home layer

Two entry points confuse people here: `~/.claude.json` (a single file) and `~/.claude/` (the folder).

**`~/.claude.json` is application state, not a settings file.** Theme preference, OAuth session, per-project trust decisions, your personal MCP servers, and IDE toggles live there. Manage it through `/config`; don't hand-edit. Note the MCP scope split: team-shared servers go in project `.mcp.json`, personal cross-project ones go here (`claude mcp add --scope user`).

**`~/.claude/` is your global config folder**, nearly a mirror of the project `.claude/`, except nothing in it is ever committed:

| File / folder | Purpose |
|---|---|
| `CLAUDE.md` | Personal preferences, loaded alongside the project's CLAUDE.md; project instructions are read later, but conflicting rules still need explicit priority |
| `settings.json` | Defaults for all projects; project-level keys override these |
| `keybindings.json` | Custom shortcuts, hot-reloaded; Ctrl+C/Ctrl+D/Ctrl+M/Caps Lock are reserved |
| `themes/` | Custom color themes created via `/theme` |
| `projects/<project>/memory/` | **Auto memory**, detailed below |
| Plus `rules/`, `skills/`, `commands/`, `output-styles/`, `agents/`, `workflows/` | Global versions, available in every project |

### Auto memory: Claude's notes to itself

`~/.claude/projects/<project>/memory/` is the zone you do not have to write yourself — Claude maintains it while working. It is for repeated preferences, corrections you confirm, project decisions that cannot be inferred from code or git history, and external references such as where to find an issue tracker or dashboard. The official docs say Claude skips information it can derive from the codebase, including architecture, file paths, and debugging fixes. `MEMORY.md` is the index; the first 200 lines or 25KB load at each session start. Longer topics get split into topic files that are read back only when a related task comes up. On by default; toggle with `/memory`. These are plain markdown — edit or delete freely, though Claude will keep updating them afterward.

## Quick diagnosis

When a setting doesn't seem to take effect: run `/memory` to see what CLAUDE.md loaded, `/doctor` for a full setup checkup, and `/context` to see what is consuming space. The full troubleshooting flow belongs to cluster H.

## Takeaways

Deciding where something goes takes three questions: **guaranteed** behavior or **background knowledge**? (settings/hooks vs CLAUDE.md/rules) Shared with the team or just you? (committed files vs `local`/home directory) Loaded **every session** or **on demand**? (CLAUDE.md vs rules/skills). Twenty-plus locations are really three binary choices combined.

## References

- [Explore the .claude directory — Claude Code Docs](https://code.claude.com/docs/en/claude-directory) — official per-file tour; primary source for the two-layer structure, identity badges, and precedence rules
- [Memory — Claude Code Docs](https://code.claude.com/docs/en/memory) — official reference for CLAUDE.md, `.claude/CLAUDE.md`, `CLAUDE.local.md`, rules, and auto memory
- [Settings — Claude Code Docs](https://code.claude.com/docs/en/settings) — settings file scopes, precedence, environment-variable caveats, and list merge behavior
- [Skills — Claude Code Docs](https://code.claude.com/docs/en/skills) — official reference for skills, commands, name conflicts, and on-demand loading
- [Worktrees — Claude Code Docs](https://code.claude.com/docs/en/worktrees) — official reference for `.worktreeinclude` and worktree isolation
- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — official docs for `/doctor`, `/hooks`, `/mcp` diagnostics

## Changelog

- 2026-08-26: Initial version, written against the August 2026 docs (commands and skills are now one mechanism).
