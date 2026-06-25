---
title: "code-review-graph: Using a Knowledge Graph to Cut AI Code Review Token Usage by 8x"
date: 2026-04-02
type: guide
category: tech
tags: [code-review, knowledge-graph, tree-sitter, mcp, ai-tools]
lang: en
tldr: "code-review-graph uses Tree-sitter to parse your codebase and build a persistent knowledge graph, tracks the blast radius of changes, and feeds only truly relevant context to the AI — claiming an average 8.2x reduction in token usage."
description: "A look at code-review-graph's core concept, architecture, tech stack, performance numbers, and the scenarios where it does and doesn't make sense."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-02-code-review-graph-knowledge-graph-ai-review)

What's the biggest waste in AI code review? Feeding the entire repo to an LLM every single time. You change one function, and the AI has to read hundreds of files just to give you feedback. That's exactly what code-review-graph sets out to fix — by building a structural map of your codebase so that, when a change happens, only the genuinely affected parts get extracted.

## Core Concept: Code as a Graph

The traditional AI code review flow is: "what files changed → dump them all into the LLM." code-review-graph adds a layer in between: it first uses Tree-sitter to parse the entire codebase into an AST, extracting functions, classes, and imports as nodes, and call relationships, inheritance, and test coverage as edges. This forms a NetworkX graph that gets persisted to SQLite.

The graph is persistent. The first build requires a full scan, but after that, Watchdog monitors for file changes and only re-parses modified files — incremental updates are claimed to complete in under 2 seconds.

The key difference from plain text search (grep) or simple AST analysis is that the graph can trace cross-file dependency chains. A calls B, B inherits C, C's tests live in D — change C and you immediately know A, B, and D are all potentially affected.

## Architecture

```
Code change
    │
    ▼
Tree-sitter AST parsing (19 languages supported)
    │
    ▼
Node extraction (functions, classes, imports)
Edge extraction (calls, inheritance, test coverage)
    │
    ▼
NetworkX graph ──→ SQLite persistence
    │
    ▼
Watchdog monitoring ──→ Incremental updates (< 2s)
    │
    ▼
Change impact analysis (Blast Radius)
    │
    ▼
MCP tools ──→ Claude Code / Cursor / Windsurf / Zed
```

Key modules:

| Module | Purpose |
|---|---|
| `parser.py` | Tree-sitter multi-language parsing; extracts AST nodes and edges |
| `graph.py` | NetworkX graph data structure |
| `incremental.py` | Incremental update engine |
| `changes.py` | Blast radius calculation and risk scoring |
| `communities.py` | Graph community clustering (identifies related code groups) |
| `flows.py` | Execution flow tracing, ranked by risk level |
| `search.py` | Semantic search (optional embeddings) |
| `visualization.py` | D3.js interactive visualization |

## Tech Stack

- **Python 3.10+** (82.5%) + **TypeScript** (17.3%, VSCode extension)
- **Tree-sitter** + tree-sitter-language-pack: the de facto standard for multi-language AST parsing
- **NetworkX**: Python graph computation, with optional igraph for community detection
- **SQLite**: persistent graph storage with zero deployment overhead
- **FastMCP**: MCP protocol implementation, enabling AI tools to call graph functions directly
- **Watchdog**: filesystem monitoring
- Optional: sentence-transformers / Google Generative AI / Ollama for embedding-based search

Choosing SQLite + NetworkX over something like Neo4j is clearly a deliberate decision to lower the deployment bar. For most codebases, this trade-off is sensible — the scale of a code graph rarely justifies a dedicated graph database.

## Performance Numbers

Official benchmarks across 6 real-world repos:

- **Average 8.2x token reduction**: the amount of context the AI receives drops dramatically
- **100% recall**: every genuinely affected file gets detected
- **F1 = 0.54**: precision is modest; the system tends to over-predict

The combination of 100% recall and low F1 means: it won't miss files that matter, but it will pull in some irrelevant ones. For code review, that trade-off is acceptable — missing an important file is far more costly than reading a few extra ones.

## MCP Integration

This is the killer feature. Through the MCP protocol, Claude Code, Cursor, Windsurf, Zed, Continue, and OpenCode can all call graph tools directly. The AI no longer has to decide which files to read on its own — the graph tells it outright: "this change affects these functions and files."

The project also ships a VSCode extension that lets you view the graph visualization and impact analysis directly inside the IDE.

## When It Makes Sense (and When It Doesn't)

**Good fit:**
- Medium-to-large codebases with complex cross-file dependencies
- Teams doing frequent AI-assisted code reviews
- Scenarios where controlling LLM token costs matters

**Poor fit:**
- Small projects or single-file changes — the graph maintenance overhead can exceed the cost of just reading the files directly
- Situations requiring high-precision impact analysis (F1 of only 0.54)
- Teams that don't use AI code review tools — without an AI consumer, the graph has nowhere to add value

## Overall

code-review-graph addresses a genuine pain point: wasted context in AI code review. By combining Tree-sitter with a knowledge graph, it shrinks "what the AI sees" from "the entire repo" down to "the parts that actually matter." The 8.2x token savings is meaningful at scale.

That said, the precision (F1 0.54) shows there's still room to improve. Over-prediction means the AI still receives some irrelevant context — it's just far better than brute-forcing the whole thing. The overhead on small changes is also worth watching — this extra layer isn't the right fit for every situation.

The core trade-off is clear: you pay an upfront cost to maintain a persistent graph, and you collect savings on every subsequent review. The larger the repo and the more frequent the reviews, the better that deal becomes.

## References

- [code-review-graph GitHub](https://github.com/tirth8205/code-review-graph)
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/)
- [NetworkX](https://networkx.org/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [FastMCP](https://github.com/jlowin/fastmcp)
