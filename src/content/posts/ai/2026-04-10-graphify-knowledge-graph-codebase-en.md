---
title: "Graphify: Turn Code and Documents into a Queryable Knowledge Graph"
date: 2026-04-10
type: guide
category: ai
tags: [graphify, knowledge-graph, tree-sitter, ast, code-understanding, claude-code, mcp]
lang: en
tldr: "Graphify uses tree-sitter AST to extract code structure, then applies LLM semantic analysis to documents and images, compressing an entire project into a queryable knowledge graph. It claims to save 71.5x tokens per query compared to reading raw files."
description: "Graphify's design philosophy, dual-stage processing architecture, relationship classification system, output artifacts, and how it integrates with AI coding assistants like Claude Code, Codex, and Cursor."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-10-graphify-knowledge-graph-codebase)

AI coding assistants keep getting more powerful, but one fundamental problem remains: once a project gets large enough, the context window runs out. Feeding the entire codebase in is impractical, but cherry-picking a few files risks missing critical relationships.

Graphify's approach is to add a layer in between — converting code, documents, papers, and images into a knowledge graph, so AI assistants query the graph instead of reading raw files.

## Dual-Stage Processing: AST First, LLM for Semantics

Graphify's core design splits extraction into two stages, each handling what it does best.

**Stage One: Deterministic AST Extraction**

Uses tree-sitter to parse code, extracting classes, functions, imports, call graphs, and docstrings, with support for 20+ languages. This stage runs entirely locally with no API calls needed.

```
source code → tree-sitter AST → structured nodes and edges
```

**Stage Two: LLM Semantic Analysis**

Claude subagents process documents, papers, and images in parallel, identifying conceptual relationships and design intent. Results are merged into a NetworkX graph.

The benefit of this layered approach: code structure extraction is deterministic, reproducible, and token-free; only unstructured content requires LLM involvement. Compared to pure LLM extraction, it's both cheaper and more stable.

Comparison with the traditional "feed everything to the LLM" approach:

| | Graphify Dual-Stage | Pure LLM Extraction |
|---|---|---|
| Code structure | tree-sitter, deterministic | LLM inference, may miss things |
| Cost | Only docs/images use API | Everything requires API |
| Reproducibility | AST results are stable | May differ each time |
| Semantic understanding | Yes, supplemented in stage two | Yes |

## Relationship Classification System

Every edge in the graph isn't just "A connects to B" — it also carries a confidence label:

- **EXTRACTED** (confidence: 1.0): Definite relationships extracted directly from source code, such as imports and function calls
- **INFERRED** (confidence: 0.0–1.0): Reasonable relationships inferred by the LLM, with numerical confidence scores
- **AMBIGUOUS**: Uncertain relationships, flagged for human review

The system also tracks specific comment patterns — `# NOTE:`, `# IMPORTANT:`, `# HACK:`, `# WHY:` — creating `rationale_for` nodes that capture the "why" behind design decisions in the graph.

This design is highly practical. When querying results, you know which relationships are solid, which are inferred, and which need human confirmation — you won't mistake LLM guesses for facts.

## Output Artifacts

Running `/graphify .` once produces four things in the `graphify-out/` directory:

```
graphify-out/
├── graph.json         # Persistent knowledge graph, usable across sessions
├── graph.html         # Interactive visualization with community detection and clickable nodes
├── GRAPH_REPORT.md    # One-page summary: god nodes, unexpected connections, suggested queries
└── cache/             # SHA256 index supporting incremental updates
```

**graph.html** renders with vis.js, supports community detection (Leiden algorithm), and lets you filter by community and click nodes to expand relationships. No additional installation needed — just open it in a browser.

**GRAPH_REPORT.md** is a quick-scan summary for humans, listing god nodes (the most connected core nodes) in the graph and suggested query statements. Someone new to a project can read this report to quickly grasp the architecture's key hubs.

## Incremental Updates and Caching

Uses SHA256 hashes to track each file. The `--update` mode only reprocesses changed files and merges results into the existing graph.

```bash
# Initial build
/graphify ./raw

# Subsequent runs only process changed files
/graphify ./raw --update
```

For large projects this is essential — you won't have to rebuild the entire graph just because one file changed.

## Integrating with AI Coding Assistants

Graphify supports integration with 10+ AI assistants, including Claude Code, Codex, OpenCode, Cursor, Gemini CLI, GitHub Copilot CLI, Aider, and more. Integration methods vary by platform:

```bash
# Claude Code
graphify claude install

# Cursor
graphify cursor install

# Generic Git hook (auto-rebuild on commit / branch switch)
graphify hook install
```

Once installed, AI assistants automatically query the knowledge graph when working on problems instead of reading raw files directly.

**Watch mode** keeps things in sync during development:

```bash
/graphify ./raw --watch
```

**Wiki mode** produces Wikipedia-style markdown articles, one per community and god node, with an `index.md` entry point:

```bash
/graphify ./raw --wiki
```

**MCP Server** exposes the graph as MCP tools, supporting operations like `query_graph`, `get_node`, `get_neighbors`, and `shortest_path`:

```bash
python -m graphify.serve graphify-out/graph.json
```

## Overall Architecture

```
Source Project
  │
  ├─ Code files ────→ [tree-sitter AST] ──→ Structured nodes ─┐
  │                     (local, no API)                         │
  ├─ Docs/papers ───→ [Claude subagent] ──→ Semantic edges ───┤
  │                     (parallel processing)                   │
  └─ Images/diagrams →[Claude subagent] ──→ Concept nodes ────┤
                                                                ↓
                                                          [NetworkX graph]
                                                          [Leiden community detection]
                                                                ↓
                                                ┌───────────────┼───────────────┐
                                                ↓               ↓               ↓
                                          graph.json      graph.html    GRAPH_REPORT.md
                                                ↓
                                    ┌───────────┼───────────┐
                                    ↓           ↓           ↓
                                MCP Server   Wiki mode   AI assistant queries
```

## Privacy Model

Code files are processed entirely locally via tree-sitter — source code never leaves your machine. Only documents, papers, and images are sent to model APIs through your own API key (Anthropic API for Claude, OpenAI API for Codex). No telemetry, no usage tracking.

This trade-off makes sense — code is the most sensitive part, handled with deterministic tools; documents and images inherently require semantic understanding, so sending them to an API is necessary.

## When It Fits and When It Doesn't

**Good fit**:
- Medium to large projects with many files and complex cross-module relationships
- Mixed content (code + papers + design documents + architecture diagrams)
- Team onboarding, where newcomers need to quickly understand the architecture
- Already using AI assistants like Claude Code / Cursor / Codex

**Not ideal for**:
- Small projects (a few dozen files) where reading source code directly is faster
- Pure-code projects without documentation, where the semantic layer adds limited value
- Scenarios with extremely strict privacy requirements where even documents can't be sent to an API

## Overall Takeaway

Graphify addresses the context bottleneck of AI coding assistants: instead of stuffing raw files into the context window, it first compresses them into a structured knowledge graph, letting AI query the graph for relationships.

The dual-stage processing is its smartest design choice — if deterministic tools can handle it, don't use an LLM, saving costs while maintaining stability. The relationship classification system lets you know which connections are definite and which are inferred. Compared to an IDE's symbol index, it adds a semantic layer and cross-modal support; compared to pure LLM analysis, it has deterministic AST as its foundation.

Installation is a single line: `pip install graphify && graphify install`. For anyone already using AI assistants to write code, it's worth spending ten minutes to try it out.

## References

- [Graphify - GitHub](https://github.com/safishamsi/graphify)
- [tree-sitter - GitHub](https://github.com/tree-sitter/tree-sitter)
- [NetworkX - Official Documentation](https://networkx.org/)
- [graspologic (Leiden Community Detection) - GitHub](https://github.com/microsoft/graspologic)
- [vis.js - Official Website](https://visjs.org/)
- [Model Context Protocol (MCP) - Official Documentation](https://modelcontextprotocol.io/)
