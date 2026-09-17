---
title: "Tool Pick | codebase-memory-mcp — Turn a Repo Into a Knowledge Graph Your Agent Can Query Once Instead of Grepping"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that parses a codebase into a persistent knowledge graph with tree-sitter — call graph, HTTP routes, cross-service links — so an agent replaces repeated grep with one structured query, cutting token use by 99% in the project's own benchmark"
tldr: "codebase-memory-mcp is an MCP server that indexes a codebase into a knowledge graph, exposing 15 tools for indexing, structured querying, and change-impact analysis. Install: a one-line curl script, then restart your agent and say 'index this project.' It fixes the token blowup and missing cross-file call tracking that come from making an agent grep and read files one by one."
series:
  name: "AI Tool of the Day"
  order: 33
---

> 🌏 [中文版](/posts/daily/2026-09-18-tool-codebase-memory-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | codebase-memory-mcp |
| Type | MCP server |
| GitHub | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) |
| Stars | 43,600+ (at time of writing, up from ~23,000 a week earlier) |
| Language | Go (cgo bindings into the tree-sitter C library) |
| License | MIT |
| Install | `curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh \| bash` |

## What Problem It Solves

Ask an agent working in a ten-thousand-file monorepo "who calls this function" or "what breaks if I change this," and without a structured index its only tools are grep and reading files one at a time. It has to guess at filenames by keyword, open a pile of files to cross-check call relationships, and can easily burn hundreds of thousands of tokens doing it — and even then the call graph it reconstructs isn't guaranteed complete, especially for cross-service calls over HTTP or gRPC, which text search alone can't really recover.

codebase-memory-mcp turns "build an index, then query it" into a single zero-dependency native binary. It parses 158 languages' ASTs with tree-sitter, layers a lightweight custom semantic type resolver (what the README calls Hybrid LSP, behaviorally aligned with tsserver, pyright, gopls and the like) on top for 12 languages including Python, TypeScript/JavaScript, Go, Java, and Rust, and assembles it all into a persistent knowledge graph — functions, classes, call chains, HTTP routes, and cross-service links are all nodes and edges in that graph. From there the agent stops grepping blind and instead calls structured query tools like `trace_path`, `search_graph`, and `detect_changes` to get an answer directly. A background watcher re-indexes incrementally as git changes land, and the index itself can be compressed into a single file and committed to the repo, so teammates who clone it skip a full re-index.

Good fit: large monorepos or microservice architectures where an agent needs to trace cross-file and cross-service call relationships; teams that want to share one index across multiple agent sessions instead of re-indexing repeatedly; or workflows where you want the agent to run `detect_changes` before a commit to see which functions and downstream services a diff touches.

## Quick Start

### Install

```bash
# One-line install for macOS / Linux
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# Or via a package manager, then update through that same manager
npm install -g codebase-memory-mcp
# or
pip install codebase-memory-mcp
```

After install, restart your coding agent (Claude Code, Codex, OpenCode, etc.) and tell it "index this project" to kick off indexing.

### Basic Usage

You don't write query syntax yourself — the agent picks the tool:

```
You: "what calls ProcessOrder?"

Agent calls: trace_path(function_name="ProcessOrder", direction="inbound")

codebase-memory-mcp: runs the graph query, returns a structured call chain

Agent: explains the call chain back to you in plain language
```

Of the 15 MCP tools, the ones you'll reach for most:

- `index_repository` / `index_status` — build the index, check indexing progress
- `search_graph` — structural search (regex name matching, BM25 full-text, or semantic vector search, alone or combined)
- `trace_path` — BFS traversal of the call graph, depth 1–5
- `get_architecture` — one call returns language breakdown, packages, entry points, routes, and hotspots
- `detect_changes` — maps a git diff to the functions it touches, with a risk classification

### Advanced Usage

Share one index across a team instead of everyone re-indexing from scratch:

```bash
# Indexing writes .codebase-memory/graph.db.zst — a zstd-compressed graph snapshot
# Commit it, and teammates who clone the repo only run an incremental index on top

# Auto-index whenever a new session starts
codebase-memory-mcp config set auto_index true
```

## Comparison With Existing Approaches

| | codebase-memory-mcp | Manual grep/read exploration | Single-language LSP integration (an agent calling tsserver/pyright directly) |
|---|---|---|---|
| One query interface across languages | ✅ (158 languages, one set of MCP tools) | ✅ (but you design the search strategy yourself) | ❌ (a different LSP per language) |
| Cross-service call chains (HTTP/gRPC/pub-sub) | ✅ | ❌ | ❌ |
| Token cost | Low (project benchmark: 99.2% reduction) | High, scales with repo size | Medium — still needs multiple tool calls to assemble an answer |
| Index can be committed and shared by a team | ✅ | N/A | ❌ |
| No API key, fully local | ✅ | ✅ | Depends on the LSP implementation |
| Setup/operational complexity | Requires understanding the shared daemon | None (zero build step) | Per-language LSP server configuration |

## Caveats

- **Windows Defender can false-positive.** Release binaries occasionally get flagged as `Trojan:Script/Wacatac.B!ml`. The author documents this in SECURITY.md as a known false positive shared with well-known tools like `gh` and llama.cpp, and links multi-engine scan results you can check yourself — verify the checksum before relying on this in production.
- **A coordination daemon runs in the background, shared across tools.** Claude Code, Codex, OpenCode, and any other configured client on the same machine and account share one daemon that manages indexing and the file watcher. Closing one agent session doesn't necessarily stop the daemon — read the README's Session Coordination Daemon section before your first run so an active indexing process doesn't look like a stuck one.
- **Semantic search and cross-service links are confidence-scored, not guaranteed correct.** Semantic search is ranked by a bundled embedding model, and cross-service HTTP/gRPC links are matched by confidence score rather than guaranteed at the type level. The README ships `docs/MEASURING_SAVINGS.md` for measuring accuracy and token savings on your own workload rather than taking the headline benchmark numbers at face value.

## Today's Takeaway

Tools like this point at a shift in what an MCP server is for: less "wrap an API," more "pre-index an entire data shape — here, code structure — into local, persistent state," so an agent answers with one structured query instead of piecing something together across many tool calls. A zero-dependency single binary that can also produce an index artifact you commit to the repo turns "what the agent understands about this codebase" into something versioned alongside the code and shared with the team, rather than a temporary memory each session has to rebuild from scratch.

## References

- [DeusData/codebase-memory-mcp GitHub repo](https://github.com/DeusData/codebase-memory-mcp): full README, covering install methods, the 15 MCP tools, performance benchmarks, the Session Coordination Daemon mechanism, and the Windows Defender false-positive note — the primary source for this article's technical detail.
- [SkillsLLM listing](https://skillsllm.com/skill/codebase-memory-mcp): GitHub star count (43,600+) and description, used to cross-check figures not in the README itself.
- [LobeHub MCP Marketplace listing](https://lobehub.com/mcp/deusdata-codebase-memory-mcp): lists the manual `CGO_ENABLED=1 go build` build command, used to confirm the project's primary language is Go with cgo bindings into tree-sitter.
- [arXiv:2603.27277 — Codebase-Memory: Tree-Sitter-Based Knowledge Graphs for LLM Code Exploration via MCP](https://arxiv.org/abs/2603.27277): the preprint behind this project's design and benchmark methodology, evaluated across 31 real-world repositories (83% answer quality, 10× fewer tokens, 2.1× fewer tool calls).
