---
title: "Tool Pick | claude-scope — Search Your Claude Code Conversation History with Guaranteed Freshness"
date: 2026-08-21
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A native Claude Code plugin that indexes session logs into SQLite FTS5 and runs an incremental sync before every search, so even your in-progress conversation is searchable"
tldr: "claude-scope is a Claude Code plugin that provides SQLite FTS5 full-text search over your session history. Install: claude plugin marketplace add waazy-w/claude-scope. It solves the dilemma of 'index-based tools go stale, grep-based tools rescan hundreds of MB every time' by using byte-offset incremental sync — each search only reads newly appended bytes, so even text you typed a minute ago is already searchable."
series:
  name: "AI Tool of the Day"
  order: 6
---

> 🌏 [中文版](/posts/daily/2026-08-21-tool-claude-scope)

## Tool Info

| Field | Value |
|---|---|
| Name | claude-scope |
| Type | Claude Code plugin / CLI (local full-text search) |
| GitHub | [waazy-w/claude-scope](https://github.com/waazy-w/claude-scope) |
| Stars | 3 (created 2026-08-20) |
| Language | Python |
| License | MIT |
| Install | `claude plugin marketplace add waazy-w/claude-scope` |

## What Problem Does It Solve

You know the feeling: two weeks ago you discussed a bug fix with Claude Code, and now the same issue is back — but you can't remember which project or session it was in. Claude Code's conversation logs sit in a pile of `.jsonl` files under `~/.claude/projects/`, and digging through them manually is painful.

Existing search approaches fall into two camps, each with a drawback. **Index-based tools** scan once to build an index and query fast afterward, but the index falls behind — text you just typed won't show up until the next rebuild. **grep-based tools** are always current, but rescan the entire history on every query (easily hundreds of MB), which is slow. claude-scope takes a third path: it tracks a byte offset per log file and **runs an incremental sync before every search**, reading only the bytes appended since last time — typically a millisecond-scale operation. The result is that text you typed one minute ago in **the session that's still running** is immediately searchable.

It turns "guaranteed freshness" into an explicit contract: every set of search results is prefixed with `[index fresh]` or `[index refreshed: +N messages]`, and if sync fails it prints a loud WARNING telling you how stale the results are — no silent staleness. Ideal scenarios: recovering an old solution, finding a past decision discussion, or using `claude --resume` to jump right back into that session.

## Getting Started

### Installation

```bash
# Install from GitHub (this repo doubles as the plugin marketplace)
claude plugin marketplace add waazy-w/claude-scope
claude plugin install claude-scope@claude-scope
```

Requirements: Python 3.9+ (the `python3` that ships with macOS/Linux is fine), and the stdlib `sqlite3` must have FTS5 compiled in — virtually all environments do. No other dependencies, no Node, no daemon, no network access.

### Basic Usage

Use slash commands directly inside Claude Code:

```bash
/claude-scope:scope database migration                 # bare words = search
/claude-scope:scope search "fts5 tokenizer" --current  # search current project (cwd) only
/claude-scope:scope search "error" --role user         # search only your own messages
/claude-scope:scope search "auth" --since 2026-07-01 --until 2026-08-01
/claude-scope:scope sessions --project myapp           # list recent session titles
/claude-scope:scope stats                              # index statistics
```

Query syntax: bare words are ANDed together. If your query looks like FTS5 syntax (quotes, `OR`, `NEAR`, `NOT`, parentheses, `*`), it's tried as native FTS5 first; if that fails, it falls back to term-by-term matching.

### Advanced Usage

You can also use it directly from the shell without Claude, handy for scripting:

```bash
python3 /path/to/claude-scope/scripts/scope.py search "query"
python3 /path/to/claude-scope/scripts/scope.py index    # manual incremental index
```

To warm the index on every session start (a watcher without a daemon), enable the bundled example hook:

```bash
mkdir -p hooks && cp hooks.examples/hooks.json hooks/hooks.json
```

## Comparison with Existing Tools

claude-scope is positioned squarely against the pain points of the two existing approaches:

| | claude-scope | Index-based tools | grep / ripgrep direct scan |
|---|---|---|---|
| Results always current | ✅ (incremental sync before every search) | ❌ (waits for next rebuild) | ✅ |
| Query speed | ✅ (reads only new bytes) | ✅ | ❌ (rescans everything each time) |
| Staleness is explicit | ✅ (`[index refreshed]` / WARNING) | ❌ (silent) | — |
| No extra process / no network | ✅ (native plugin, Python stdlib) | Depends | ✅ |
| Consistent output across CLI and IDE | ✅ | Depends | ✅ |

It also handles two details most indexers miss: partially written lines (Claude Code still typing) are held back until complete, preventing duplicates or missing entries; and queued prompts recorded as `attachment` rather than `user` are indexed, while background task notifications sharing the same record type are filtered out — so searching "things I said" doesn't get polluted with agent noise.

## Caveats

- **Subagent sidechain logs are not indexed in v1** — if you use subagents heavily, those conversations won't be searchable.
- **Format stability risk**: the official docs note that session `.jsonl` is an internal format subject to change with Claude Code updates. claude-scope uses defensive parsing (unknown line types are skipped, truncated/malformed lines are tolerated), but a future Claude Code update may still require a matching update.
- **Index location**: defaults to `~/.claude/plugin-data/claude-scope/scope.db` (or under `$CLAUDE_PLUGIN_DATA`), overridable with `CLAUDE_SCOPE_DATA`. If corrupted, just delete the `.db` file — it rebuilds automatically on next use; upgrades that change indexing rules also trigger an automatic rebuild.

## Takeaway

"Guaranteed freshness" sounds like marketing copy, but claude-scope breaks it down into a concrete engineering contract: per-file byte offset + incremental sync before every query + explicit sync-status labeling. It's really an old technique — incremental indexing — applied to a new context. Unlike traditional indexers that treat "build index" and "query" as two separate operations, it folds the sync into a pre-query step, leveraging the fact that append-only logs only grow forward to keep sync cost at the millisecond level. I used to think conversation history search was an either-or between fast and fresh. Turns out, when the underlying data is append-only, it was never an either-or to begin with.

## References

- [waazy-w/claude-scope — GitHub](https://github.com/waazy-w/claude-scope): features, installation, license (MIT), requirements (Python 3.9+ / SQLite FTS5), freshness contract, and limitations are all from the official README.
- [SQLite FTS5 Extension — Official Docs](https://www.sqlite.org/fts5.html): the underlying engine claude-scope uses for full-text search.
