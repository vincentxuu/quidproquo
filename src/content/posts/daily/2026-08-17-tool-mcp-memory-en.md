---
title: "Tool Pick | mcp-memory — Long-Term Agent Memory Using Google's OKF Standard"
date: 2026-08-17
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that stores Agent memory as Google Open Knowledge Format (OKF) Markdown files with local SQLite FTS5 indexing for cross-session millisecond retrieval — no cloud account or API key required"
tldr: "mcp-memory is an MCP server that persists Agent long-term memory as Markdown files conforming to Google's OKF v0.2 spec, with SQLite FTS5 full-text search indexing. Install: git clone then run `python3 setup.py`. It solves the problem of Agents losing all context on every new session, and memory formats being incompatible across different Agent tools."
series:
  name: "AI Tool of the Day"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-17-tool-mcp-memory)

## Tool Info

| Field | Value |
|---|---|
| Name | mcp-memory |
| Type | MCP server |
| GitHub | [fellowgeek/mcp-memory](https://github.com/fellowgeek/mcp-memory) |
| Stars | 175 (published 2026-08-13, hit Hacker News front page within 4 days) |
| Language | Python |
| License | MIT |
| Install | `git clone https://github.com/fellowgeek/mcp-memory && cd mcp-memory && python3 setup.py` |

## What Problem Does It Solve

Have you ever spent a whole session getting an Agent to understand your project architecture, your coding style preferences, and the progress on that bug you're tracking — only to start a new conversation the next day and find it's a blank slate again? Or maybe you're using Claude Code, Cursor, and Codex simultaneously, each with its own siloed "memory" (Claude's `CLAUDE.md` is plain text, Cursor has its own rules file), with no way to share a single long-term memory across tools.

mcp-memory's approach is to define "memory" as a standardized format rather than a proprietary feature of any single tool. It adopts Google Cloud Platform's [Open Knowledge Format (OKF v0.2)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) — each memory entry is a Markdown file with YAML frontmatter (`type`, `key`, `namespace`, `tags`, `status`, `generated`, `verified`, etc.), stored in a `memory/` folder in your project. Humans can open and read the files directly, and Git can diff them. A separate SQLite FTS5 index (`.mcp_memory/memories.db`) enables millisecond full-text search by keyword or tag, instead of scanning all Markdown files on every query.

Good fit for: developers maintaining a long-lived project who want the Agent to remember architecture decisions and personal preferences; people using multiple MCP-compatible Agents (Claude Desktop, Cursor, Antigravity, Windsurf, Codex) who want them to share a single memory store instead of each maintaining its own; and teams that care about memory being Git-versionable, human-readable, and not locked into any vendor's format.

## Getting Started

### Installation

```bash
# Requires Python 3
git clone https://github.com/fellowgeek/mcp-memory
cd mcp-memory
python3 setup.py
```

`setup.py` is an interactive wizard that auto-detects and registers the server in your installed Claude Desktop, Cursor, Antigravity, Windsurf, or Codex config files. You can also manually add the `run.sh` path to your MCP client config. The entire process requires no account registration, no API key — all data stays local.

### Basic Usage

The Agent gets 5 MCP tools:

- `memory_store` — create or update a memory entry in OKF v0.2 format
- `memory_retrieve` — fetch a specific memory by key + namespace
- `memory_search` — search memories by keyword, tag, or namespace
- `memory_get_last` — read the last working progress checkpoint
- `memory_update_last` — update the current progress checkpoint

A stored memory looks like this (`memory/user/preferences/coding_style.md`):

```markdown
---
type: Agent Memory
title: Coding Style
key: user/preferences/coding_style
namespace: default
tags:
  - preferences
  - style
status: stable
generated:
  by: mcp-memory/0.2.0
  at: '2026-08-12T19:23:35Z'
created_at: '2026-08-12T19:23:35Z'
updated_at: '2026-08-12T19:23:35Z'
---

User prefers functional programming style with explicit type annotations.
```

### Advanced Usage

Use `namespace` for context isolation — separating "user preferences" from "project architecture" memories. You can also use environment variables to customize storage locations (e.g., sharing a single memory store across multiple projects, or moving the SQLite index to a different disk):

```bash
export MCP_MEMORY_PROJECT_ROOT=/path/to/project
export MCP_MEMORY_DIR=memory                  # OKF Markdown storage folder
export MCP_MEMORY_DB_PATH=.mcp_memory/memories.db  # SQLite index location
```

## Comparison with Existing Tools

| | mcp-memory | Mem0 | Manually maintaining CLAUDE.md |
|---|---|---|---|
| Local execution, no API key | ✅ | ❌ (requires cloud account) | ✅ |
| Standardized format (cross-Agent compatible) | ✅ (OKF v0.2) | ❌ (proprietary schema) | ❌ (plain text, no schema) |
| Full-text search | ✅ SQLite FTS5 | ✅ vector search | ❌ Agent reads entire file |
| Human-readable, Git-diffable | ✅ (Markdown) | ❌ (stored in vector DB) | ✅ |
| Session checkpoint (tracking "where I left off") | ✅ | Requires custom design | Requires manual maintenance |
| Cost | Free | $19–249/mo | Free |

## Caveats

- **This project was published just 4 days ago**: most of the 175 stars came from a single Hacker News spike, and long-term maintenance remains to be seen. Read through `db.py` and `memory_server.py` source code before adopting in production.
- **OKF itself is still early-stage (v0.2)**: this is a recently published standard from Google Cloud Platform, and the schema may change. mcp-memory currently tracks `SPEC.md` / `OKF_RULES.md`, but if the upstream spec revises, this server will need to follow suit to avoid producing incompatible memory files.
- **No `memory_delete` tool**: you can only create, update, search, and read checkpoints. Removing a memory entry requires manually deleting the Markdown file under `memory/` and rebuilding the SQLite index — cleaning up erroneous memories is inconvenient for now.

## Takeaway

I used to think "Agent memory" was a problem everyone solved their own way — Mem0 uses a vector database, Claude uses a 200-line-capped Markdown file, LangMem is tied to the LangChain ecosystem. But mcp-memory reminded me that people are already pushing for an open standard for the memory format itself (OKF), trying to let different Agent toolchains share a single memory store instead of each inventing their own format — much like how every browser had its own markup before the web standards movement. Standardization is still very early, but the direction itself is worth watching.

## References

- [fellowgeek/mcp-memory — GitHub](https://github.com/fellowgeek/mcp-memory)
- [Open Knowledge Format v0.2 SPEC — GoogleCloudPlatform/knowledge-catalog](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Show HN: MCP Memory – Fast Agent Memory Using Google's OKF and SQLite FTS5 — Hacker News](https://news.ycombinator.com/item?id=49286073)
