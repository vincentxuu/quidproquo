---
title: "Tool Pick | okf-agent-memory — Store an AI Agent's Long-Term Memory as Reviewable Git Files"
date: 2026-09-07
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A Git-native long-term memory format and MCP server for AI agents, using a zero-dependency Go binary for local BM25 search instead of a vector database or an ever-growing CLAUDE.md"
tldr: "okf-agent-memory implements the Google OKF v0.2 spec as a Git-native agent memory system, with a zero-dependency Go CLI and an embedded MCP server. Install: `brew install okf-memory/tap/okf`. It addresses the problem of architectural decisions either living inside an opaque vector database, or piling up in a CLAUDE.md file that only ever grows."
series:
  name: "AI Tool of the Day"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-09-07-tool-okf-agent-memory)

## Tool Info

| Field | Value |
|---|---|
| Name | okf-agent-memory (the `okf` CLI) |
| Type | Embedded MCP server + CLI |
| GitHub | [okf-memory/okf-agent-memory](https://github.com/okf-memory/okf-agent-memory) |
| Stars | 309 |
| Language | Go |
| License | MIT |
| Install | `brew install okf-memory/tap/okf` |

## What Problem It Solves

Have you had an AI agent work through an architectural decision mid-task — reasoning through why it picked one approach over another — only to have that reasoning vanish the moment the context window closes? The next session has the agent re-guessing from the code, or you re-explaining the decision out loud. The two common fixes both cost something: wiring up a vector-database-backed memory framework (Mem0, Letta) means running and trusting another opaque service, and you can't inspect why a given result was retrieved; or you dump everything into `CLAUDE.md` / `AGENTS.md`, which only ever grows until it blows out the context window — what the README calls "memory rot."

okf-agent-memory offers a third path: define the agent's long-term memory using Google's open OKF v0.2 specification — individual Markdown files with YAML frontmatter, stored in a project's `knowledge/` folder and committed to Git alongside the source code. Search runs on pure in-memory BM25 (claimed sub-300-microsecond latency), with no embedding API calls at all; retrieval uses "progressive disclosure" — every folder has its own `index.md`, so the agent only loads the one concept it actually needs instead of dumping the whole knowledge base into context. The whole tool is a single Go binary with zero external dependencies, and its embedded MCP server exposes six tools — `search`, `show`, `create`, `update`, `relate`, `validate` — directly to clients like Claude Code and Cursor, alongside a "search before write" behavioral rule meant to cut down on the same fact getting recorded twice or contradicting itself.

Good fit for: projects developed across many sessions where you want architectural decisions, ADRs, and hard-won gotchas to persist without standing up a database; teams that want memory content reviewable with plain `git diff` / PR review instead of fully trusting whatever the agent claims; or anyone who wants the same Git-native memory structure for non-code domains — research, coaching, personal knowledge management.

## Quick Start

### Install

```bash
# macOS / Linux via Homebrew (recommended)
brew install okf-memory/tap/okf
okf version

# Or build from source (requires Go 1.22+)
git clone https://github.com/okf-memory/okf-agent-memory.git
cd okf-agent-memory
make build
# Binary lands at bin/okf
```

### Basic Usage

```bash
# Scaffold the full memory stack into an existing project
okf bootstrap /path/to/my-project --name "My Project"
# Creates:
#   knowledge/                    the OKF v0.2 memory bundle (index.md, log.md)
#   .agents/skills/okf-memory/    skill guide for AI agents to read
#   AGENTS.md                     operating rules (incl. "search before write")
#   Makefile                      shortcuts like make validate / make search

# Check for existing decisions before making a new one
okf search "auth flow" knowledge

# Record a new architectural decision
okf create decisions/auth-flow knowledge \
  --type Decision \
  --title "OAuth2 Authorization Flow" \
  --desc "Standardized on PKCE for client-side authentication."

# Before closing out a session, verify the memory bundle is conformant
okf validate knowledge --strict --drift
```

Point Claude Code or Cursor's MCP config at `okf mcp knowledge` and the agent gets six tools — `okf_search`, `okf_show`, `okf_create`, `okf_update`, `okf_relate`, `okf_validate`:

```json
{
  "mcpServers": {
    "okf-memory": {
      "command": "okf",
      "args": ["mcp", "knowledge"]
    }
  }
}
```

### Advanced Usage

```bash
# Explicitly link two concepts so the memory bundle doesn't turn into isolated notes
okf relate architecture/tooling architecture/layers knowledge \
  --desc "Tooling implements this five-layer architecture"

# Get structured JSON output for scripting a memory-health check
okf validate knowledge --strict --drift --json
```

## Comparison with Existing Tools

| | okf-agent-memory | Vector-based memory (Mem0 / Letta) | Hand-written CLAUDE.md / AGENTS.md |
|---|---|---|---|
| Storage location | Markdown files inside a Git repo | External vector database / service | Plain text file at the project root |
| Search latency | Claimed < 300 µs (local BM25) | 150ms–800ms (incl. embedding API) | No search — the whole file goes into context |
| Requires an external service or API key | No | Yes (vector DB, embedding API) | No |
| Reviewable with plain `git diff` | Yes | No (embeddings are opaque) | Yes, but with no structure |
| Trust tiers ("verified" vs. agent-generated) | Yes (`generated` / `verified`) | Usually no | No |
| Guards against unbounded growth over time | Yes (`validate --drift`) | Depends on the framework | No — this is exactly "memory rot" |

## Things to Watch Out For

- **This is a very young project**: created on 2026-09-05 and already past 300 stars within a day or two — strong interest, but the interface and MCP tool parameters may still shift. Pin a version before adopting it for real work.
- **Lexical search only, not semantic**: BM25 matches keywords, so a query phrased differently from how the memory bundle is written may not surface anything — a real trade-off versus vector-based semantic retrieval, and one you'll need a tagging/keyword convention to work around.
- **"Search before write" is a convention, not an enforced mechanism**: the rule lives in `AGENTS.md` and relies on the agent following it — if the agent skips the search step and creates a new concept anyway, you still get duplicate or contradictory records. `validate --drift` only catches description drift, not semantic duplication.

## Today's Takeaway

Most "agent memory" solutions I'd seen came down to one trade-off: either wire up a vector database and turn memory into an opaque service, or dump everything into a Markdown file that eventually explodes on its own. okf-agent-memory makes the case for a third option — define memory as a Git data format with a schema, one that CI can check for conformance. That means what an agent "remembers" can, for the first time, sit in a PR review next to the code changes it caused, instead of forcing a choice between fully trusting a black box or manually curating notes by hand.

## References

- [okf-agent-memory GitHub repo](https://github.com/okf-memory/okf-agent-memory): README, stars, language, and license (MIT) are from the official repo and the GitHub API.
- [docs/CLI.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/CLI.md): CLI command and MCP tool reference (`okf_search`, `okf_show`, etc.).
- [docs/ALTERNATIVES.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/ALTERNATIVES.md): comparison table against Mem0, Letta, and hand-written Markdown.
- [docs/GETTING_STARTED.md](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/GETTING_STARTED.md): Homebrew install steps and Claude Code / Cursor configuration examples.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
