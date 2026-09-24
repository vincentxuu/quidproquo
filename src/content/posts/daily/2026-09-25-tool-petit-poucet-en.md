---
title: "Tool Pick｜petit-poucet — One Git-Reviewable Memory Shared by Claude Code and Copilot CLI"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A Rust-built MCP server that stores an agent's rules, decisions, and verified facts as Markdown notes in a git repo, so Claude Code and GitHub Copilot CLI can share the same memory, with every change committed"
tldr: "petit-poucet is a Rust-built MCP server that stores AI coding agents' long-term memory as Markdown notes in a git repository. Install: claude plugin marketplace add https://github.com/areguig/petit-poucet, then claude plugin install petit-poucet@petit-poucet. It solves the problem of every agent tool keeping its own separate memory, so switching tools or starting a new session means repeating yourself."
series:
  name: "AI Tool of the Day"
  order: 36
---

> 🌏 [中文版](/posts/daily/2026-09-25-tool-petit-poucet)

## Tool Info

| Item | Value |
|---|---|
| Name | petit-poucet |
| Type | MCP server + Claude Code / Copilot CLI plugin |
| GitHub | [areguig/petit-poucet](https://github.com/areguig/petit-poucet) |
| Stars | 2 (created 2026-09-24, brand new) |
| Language | Rust |
| License | Apache-2.0 |
| Install | `claude plugin marketplace add https://github.com/areguig/petit-poucet && claude plugin install petit-poucet@petit-poucet` |

## What Problem It Solves

Ever told Claude Code "keep commit messages to one or two lines, no Co-Authored-By," only to have to repeat it the next day in a fresh session? Switch to GitHub Copilot CLI on the same project and that rule doesn't exist there either — you say it a third time. Every agent tool keeps its own memory format: some stuff everything into a `CLAUDE.md` file that keeps growing until it eats the context window, others bolt on a vector database that turns memory into a black box. None of them is something multiple tools can share, let alone something you can review the way you review code.

petit-poucet pulls memory out of the agent tool entirely and turns it into its own git repository: plain Markdown notes, each with YAML frontmatter (`type`, `scope`, `summary`, `created`, `tags`), stored under `~/agent-memory/` in three folders — `Preferences/` (applies everywhere), `Projects/<repo>/` (specific to one project), and `Topics/<topic>/` (not tied to any project). A small Rust-built MCP server exposes six tools — `memory_index`, `memory_search`, `memory_save`, and others — to any MCP client. A session-start hook feeds the agent a compact index of what applies to the current project, instead of dumping the whole vault into context. The vault itself is a local git repo, and every save is a commit, so `git diff` / `git log` let you inspect exactly what the agent remembered and when. That's the same direction as [okf-agent-memory](/en/posts/daily/2026-09-07-tool-okf-agent-memory-en), a tool we covered earlier that petit-poucet's README lists as one of its influences: turning "what does the agent remember" into something that can go through a PR review instead of staying locked inside a black box.

Good fit: teams that use both Claude Code and Copilot CLI (or other MCP clients) on the same set of projects and want rules and decisions written once, understood by both; anyone with a pile of hand-maintained `MEMORY.md` files or scattered notes who wants to consolidate them into one structured, Obsidian-browsable vault; or anyone who explicitly wants confirmation before an agent silently overwrites a rule they previously stated.

## Getting Started

### Install

```bash
# Needs git and curl (macOS / Linux); the plugin downloads the platform binary
# on first use and verifies its SHA-256

# Claude Code
claude plugin marketplace add https://github.com/areguig/petit-poucet
claude plugin install petit-poucet@petit-poucet

# GitHub Copilot CLI
copilot plugin marketplace add areguig/petit-poucet
copilot plugin install petit-poucet@petit-poucet
```

Start a new session after installing, and the agent notices there's no vault yet and offers to create one at `~/agent-memory` (or wherever you prefer). Both tools share the same vault.

### Basic Usage

```markdown
# The six MCP tools the agent gets
memory_index    # Lists preferences, current-project notes, and searchable topic names
memory_read     # Reads one note
memory_search   # Full-text search across preferences, the current project, and all topics
memory_save     # Creates or updates a note (auto-updates the Index, auto-commits)
memory_move     # Renames or re-scopes a note, rewriting every link that points to it
memory_delete   # Deletes a note (with a reason) and unlinks it everywhere
```

Claude Code shows a one-line summary at the start of each session, e.g.:

```
🪨 petit-poucet · 20 notes loaded (preferences + chargepath-api)
```

### Advanced Usage

```bash
# The same binary can operate on the vault directly, without going through an agent
petit-poucet check              # Validate frontmatter, summaries, scopes, links, and check for leaked secrets
petit-poucet init ~/agent-memory  # Create a new vault
petit-poucet migrate            # Upgrade a hand-maintained vault to the new format
```

Already keeping notes in `CLAUDE.md` or scattered `MEMORY.md` files? Ask the agent to run petit-poucet's built-in `migrate-memory` skill — it lists what it would move for you to confirm first, then saves it one item at a time into the new vault, leaving the old files untouched.

## Comparison With Existing Tools

| | petit-poucet | okf-agent-memory | Vector memory (Mem0 / Letta style) |
|---|---|---|---|
| Shared across agent tools | ✅ (Claude Code + Copilot CLI) | Needs manual MCP wiring; no official dual-tool integration | Depends on the framework |
| Storage location | Standalone git repo (`~/agent-memory`) | `knowledge/` folder inside the project | External vector database / service |
| Every change is a commit | ✅ | Depends on the project's own git habits | No (embeddings are a black box) |
| Confirmation required to change a stated rule | ✅ (the `feedback` type forces a confirmation prompt) | No equivalent mechanism | Usually none |
| Needs an external service or API key | No | No | Yes |
| Browsable directly in Obsidian | ✅ | Yes (plain Markdown) | No |

## Caveats

- **Brand new, only 2 stars**: created 2026-09-24, with green CI and a verifiable install flow, but the interface and MCP tool parameters could still change significantly — pin a release before relying on it.
- **The vault lives outside your project repo**: by default it's at `~/agent-memory`, not inside your project's own git repo. Across multiple machines or collaborators, you need your own sync strategy — the README explicitly says it's "never pushed," and no sync mechanism is built in.
- **Projects are identified by git remote or folder name**: change the remote URL or copy the project folder to a new path, and memory lookups may not match the original project's notes — worth double-checking manually.

## Today's Takeaway

The usual fix for "memory across multiple agent tools" is to pick one tool as the primary and make the others live with its format. petit-poucet flips that: make memory a standalone asset entirely outside any agent tool — a git repo — and let each tool read and write it through the thin MCP protocol layer. Switching tools no longer means rebuilding memory, and because the vault is just a git repo, it comes with version history and reviewability for free, with no extra auditing feature required.

## References

- [petit-poucet — GitHub repo](https://github.com/areguig/petit-poucet): README, license (Apache-2.0), language (Rust), and stars from the official repo and GitHub API.
- [petit-poucet README](https://raw.githubusercontent.com/areguig/petit-poucet/main/README.md): install steps, MCP tool list, vault structure.
- [.claude-plugin/marketplace.json](https://raw.githubusercontent.com/areguig/petit-poucet/main/.claude-plugin/marketplace.json): confirms the Claude Code plugin install path is valid.
- [okf-agent-memory tool pick](/en/posts/daily/2026-09-07-tool-okf-agent-memory-en): a Git-native memory tool in the same direction, covered earlier on this site and cited by petit-poucet's README as an influence.
- [Model Context Protocol docs](https://modelcontextprotocol.io): official MCP protocol reference.
