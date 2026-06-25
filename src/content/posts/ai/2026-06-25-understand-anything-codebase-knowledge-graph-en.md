---
title: "Understand-Anything: Turn a 200k-line Codebase into a Knowledge Graph That Actually Teaches"
date: 2026-06-25
category: ai
type: deep-dive
tags: [agent-skills, claude-code, multi-agent, knowledge-graph, developer-tools, codebase-understanding]
lang: en
tldr: "An open-source Claude Code plugin with 67.9k stars. Uses Tree-sitter + 5 LLM agents to turn any codebase into an explorable knowledge graph — the goal isn't a dependency map, it's teaching you the business logic."
description: "Deep dive into Understand-Anything: multi-agent pipeline architecture, Tree-sitter + LLM division of labor, comparison with code-review-graph and Axon, and when to use (or skip) it."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-25-understand-anything-codebase-knowledge-graph)

You join a new team, clone the repo, and open the codebase — 200,000 lines, no guide, no starting point. Existing dependency graph tools tell you "this file imports that file," but not why, where a flow starts, or what business behavior breaks if you touch something. [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) is built to fill that semantic gap.

The stated goal: **Graphs that teach > graphs that impress**. It hit GitHub Trending all-language #1 in late May 2026 and currently sits at 67.9k stars.

## The Core Distinction: Structure vs. Meaning

Most codebase visualization tools give you structure — nodes are files, edges are imports. You see 23 nodes and 34 edges. Now what?

Understand-Anything aims to give you meaning:

- Is this module responsible for the **Authentication flow** or the **Payment pipeline**?
- Why does this function exist?
- If I change this, which business capabilities are affected?

That distinction drives every architectural decision in the project.

## Architecture: Tree-sitter + LLM Hybrid

[Tree-sitter](https://tree-sitter.github.io/) handles static analysis; LLMs handle semantic interpretation — each doing what it does best:

| Layer | Tool | Responsibility | Property |
|---|---|---|---|
| Static | Tree-sitter | import map, call graph, dependency edges | Deterministic — same code always yields same edges |
| Semantic | LLM (swappable with Ollama) | Natural language summaries, intent, implicit cross-module relationships | Flexible, replaceable for on-premise deployments |

This split makes the structural layer reproducible and diffable, while the semantic layer is flexible enough to swap out (enterprises can point it at Ollama to keep code on-prem).

### Multi-Agent Pipeline

The `/understand` command orchestrates 5–6 specialized agents:

```
Project-Scanner → File-Analyzer → Summarizer → Relationship-Mapper → Graph-Reviewer
                                                                              ↓
                                                              [optional] Domain-Analyzer
```

1. **Project-Scanner**: AST + regex scans all files, collects metadata (language, size, last modified). ~30 seconds for 100k lines.
2. **File-Analyzer**: Tree-sitter parses each file's structure
3. **Summarizer**: LLM generates natural language summaries per file/function
4. **Relationship-Mapper**: LLM discovers implicit cross-module relationships invisible to static analysis
5. **Graph-Reviewer**: Validates output JSON consistency and referential integrity (no dangling references in the graph)
6. **Domain-Analyzer** (optional): Maps code to business domains, producing a horizontal view (Authentication / Payment / User Lifecycle, etc.) — costs an extra 3–5 minutes of LLM calls

Approximate run times:
- Small project (10k lines): 2–3 minutes
- Medium (100k lines): 8–12 minutes
- Large (500k lines): 30–45 minutes
- Massive (1M+ lines): 1–2 hours

Incremental updates (`--auto-update`) hook into post-commit and re-analyze only changed files, usually completing in 10–30 seconds.

### Output Format

The pipeline produces two artifacts:

- `.understand-anything/knowledge-graph.json` — structured graph data
- `.understand-anything/dashboard/index.html` — interactive dashboard

**Key design decision**: outputs are committable. A new hire can open the dashboard on day one without re-running the LLM pipeline themselves.

## Feature Overview

Since v2.0, the tool supports 26+ file types — not just source code, but Dockerfiles, Terraform, SQL, and Markdown are all included in the graph.

| Command | Function |
|---|---|
| `/understand` | Main pipeline — builds the knowledge graph |
| `/understand-dashboard` | Launch the interactive visual dashboard |
| `/understand-chat` | Ask natural language questions about the codebase |
| `/understand-diff` | Analyze a diff or PR's business blast radius |
| `/understand-explain` | Explain a specific file or function |
| `/understand-onboard` | Generate a guided tour ordered by dependency depth |
| `/understand-domain` | Map to business domains (extra LLM cost) |
| `/understand-knowledge` | Analyze a Karpathy-pattern wiki, converting wikilinks to a knowledge graph |

Supported platforms: Claude Code (native), Codex, Cursor, Copilot, Gemini CLI, OpenCode, and more. Installers exist for macOS, Linux, and Windows.

## Comparison with Alternatives

The codebase understanding space saw several tools launch simultaneously around May 2026. The central tradeoff is **semantic richness vs. LLM cost**:

| Tool | Approach | Semantic summaries | Incremental updates | Local model |
|---|---|---|---|---|
| [**Understand-Anything**](https://github.com/Egonex-AI/Understand-Anything) | Tree-sitter + LLM | ✅ Rich | ✅ | ✅ Ollama |
| [code-review-graph](https://github.com/nicholasgasior/code-review-graph) | Pure tree-sitter + SQLite | ❌ | ✅ git diff | N/A |
| [CodeGraph](https://github.com/Hacker-GPT/CodeGraph) | Tree-sitter, 16+ languages | ❌ | ❌ | N/A |
| Axon | KuzuDB + 12-phase LLM | ✅ | ✅ --watch | ❌ |
| [Sourcegraph](https://sourcegraph.com/) | Enterprise search + index | Partial | ✅ | ❌ |

**The pure-static counterpoint**: `code-review-graph` claims 6.8–49x token reduction in downstream agent usage by pre-indexing structure into SQLite so agents don't have to scan files repeatedly. The tradeoff: zero semantic layer — you get structure without understanding.

Understand-Anything trades MCP server integration (it currently ships as a direct plugin, not an MCP server) for human-readable natural language explanations and an interactive dashboard.

## When to Use It (and When Not to)

**Good fit**:

- **Onboarding new team members**: A committed graph + `/understand-onboard` guided tour means a new hire can navigate the architecture on day one instead of blindly grepping
- **Understanding legacy codebases**: When the engineer who wrote it is gone and there's no documentation, LLM summaries reconstruct the semantic layer
- **Pre-PR review**: `/understand-diff` surfaces cross-module blast radius before a change lands
- **Knowledge base organization**: `/understand-knowledge` turns a Karpathy-pattern LLM wiki into a navigable graph

**Poor fit**:

- **Cost-sensitive CI pipelines**: Running the full LLM pipeline on every build is expensive; use `--auto-update` incremental mode instead
- **Deterministic audit trails**: LLM summaries aren't guaranteed to be consistent — the same code can produce slightly different descriptions across runs
- **First-time analysis of massive monorepos (1M+ lines)**: Expect 1–2 hours; not suitable for ad-hoc use

## Known Issues

From the [issues tracker](https://github.com/Egonex-AI/Understand-Anything/issues):

- **Dashboard blocks the main thread**: d3-force layout runs synchronously at ~4.3 seconds for graphs with 3k nodes; `layout.worker.ts` exists in the codebase but isn't wired up yet
- **SKILL.md agent-dispatch path mismatch**: `agents/<name>.md` references don't match the actual install path, causing the deterministic extract-structure pass to be skipped on some platforms
- **merge-batch-graphs.py occasionally drops a batch**: Not consistently reproducible, still being tracked

## Overall

Understand-Anything is betting that **what most developers need when facing an unfamiliar codebase isn't a better dependency graph — it's a guide that explains business logic**. That bet seems correct, which explains 67.9k stars in a few weeks.

The costs are transparent: you pay the LLM API bills, the initial analysis takes time, and the semantic summaries aren't deterministic. If you only need "which files depend on which files," a pure-static tool is faster and cheaper. If you need "what role does this module play in the system," Understand-Anything is the most complete open-source option available right now.

MIT license, Ollama-compatible for on-prem use, and committable outputs keep the adoption risk low. Worth a try.

## References

- [Egonex-AI/Understand-Anything — GitHub](https://github.com/Egonex-AI/Understand-Anything)
- [Understand-Anything official site](https://understand-anything.com)
- [v2.0.0 Release Notes](https://github.com/Egonex-AI/Understand-Anything/releases)
- [Trendshift — trending stats](https://trendshift.io/repositories/23482)
- [Tree-sitter documentation](https://tree-sitter.github.io/)
- [Understand Anything: Turn Any Codebase Into an Interactive Knowledge Graph — DEV Community](https://dev.to/arshtechpro/understand-anything-turn-any-codebase-into-an-interactive-knowledge-graph-37ed)
- [ddewhurst.com — Understand-Anything competitive landscape](https://ddewhurst.com/blog/understand-anything-knowledge-graph-for-your-codebase)
