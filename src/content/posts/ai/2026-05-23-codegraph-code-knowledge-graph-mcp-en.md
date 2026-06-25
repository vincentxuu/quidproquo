---
title: "CodeGraph: Local Code Knowledge Graph, and the Truth About 'Walking the Graph to Save Money'"
date: 2026-05-23
category: ai
type: deep-dive
tags: [codegraph, mcp, knowledge-graph, tree-sitter, context-engineering, claude-code]
lang: en
tldr: "CodeGraph uses tree-sitter to extract a codebase into a local SQLite/FTS5 knowledge graph, letting AI coding agents query the graph instead of scanning files. The official end-to-end benchmark (7 repos, median of 4 runs) averages 35% cost savings and 70% fewer tool calls -- but only if the agent actually walks the graph. Delegating exploration to a file-reading subagent that ignores CodeGraph turns it into pure overhead."
description: "Breaking down CodeGraph (colbymchenry/codegraph): its knowledge graph architecture, the heavy/light division across 9 MCP tools, the honest evolution of its benchmark methodology, and the tradeoffs versus LSP/Serena and embedding-based RAG-on-code."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp)

Every time you ask Claude Code, Cursor, or Codex to "understand" a codebase, it has to scan files with grep, glob, and Read -- every tool call burns tokens, every file eats into the context window, and once you close the session, all that expensive "understanding" evaporates. Next time, you pay the exploration tax from scratch. [CodeGraph](https://github.com/colbymchenry/codegraph) (`colbymchenry/codegraph`, npm `@colbymchenry/codegraph`, approximately 18.3k stars as of 2026-05-23, version 0.7.9) front-loads and persists this work: it uses tree-sitter to extract source code into a local knowledge graph, so an agent can get "entry points + related symbols + code snippets + relationships" in a single graph query. This article covers three things -- its architecture, the design of its 9 MCP tools, and the most valuable lesson it teaches: **the honest retreat of its benchmark numbers, and the counterintuitive premise that "it only saves money when the agent actually walks the graph."**

## What Problem It Solves

CodeGraph's core claim is straightforward: replace "scanning files from scratch every time" with "a pre-built, persistently queryable structural graph." The official README states it plainly:

> When Claude Code explores a codebase, it spawns Explore agents that scan files with grep, glob, and Read — consuming tokens on every tool call. CodeGraph gives those agents a pre-indexed knowledge graph — symbol relationships, call graphs, and code structure. Agents query the graph instantly instead of scanning files.

One marketing term needs clarification: CodeGraph's title says "Semantic Code Intelligence," but "semantic" here means **structure-aware**, not vector embeddings. The project's own `CLAUDE.md` is explicit: "Extraction is deterministic — derived from AST, not LLM-summarized." No embeddings, no vector DB, no LLM summaries -- everything is deterministic AST extraction + SQLite full-text indexing. This tradeoff determines all of its subsequent strengths and weaknesses.

## How the Knowledge Graph Is Built

The entire pipeline runs in four steps, all locally, with data stored in `.codegraph/codegraph.db` inside the project:

1. **Extraction**: tree-sitter parses source code into an AST; language-specific queries extract **nodes** (functions, classes, methods) and **edges** (calls, imports, extends, implements).
2. **Storage**: nodes/edges/files go into SQLite with **FTS5** full-text search.
3. **Resolution**: after extraction, references are resolved -- function calls linked to definitions, imports linked to source files, class inheritance chains, and framework-specific patterns.
4. **Auto-Sync**: the MCP server uses native OS file events (FSEvents / inotify / ReadDirectoryChangesW) to watch the project, with **2-second debounce** for incremental sync. The graph updates in real time as you code, with zero configuration.

```
Source code ──tree-sitter──▶ AST ──language query──▶ nodes + edges
                                                        │
                                                        ▼
                                        SQLite (.codegraph/codegraph.db) + FTS5
                                                        │
                              ┌─────────────────────────┼──────────────────────────┐
                              ▼                          ▼                          ▼
                        reference                  OS file-event             MCP server
                        resolution                 auto-sync (2s)          (9 query tools)
```

It supports 19+ languages (TypeScript, JavaScript, Python, Go, Rust, Java, C#, PHP, Ruby, C/C++, Swift, Kotlin, Scala, Dart, Svelte, Vue, Liquid, Pascal/Delphi, etc.) and provides "route awareness" for 14 web frameworks: it detects Django `path()`, Flask `@app.route`, FastAPI `@router.get`, Express `app.get`, Spring `@GetMapping`, and other route files, emitting `route` nodes connected to handlers via `references` edges. When you query a controller's callers, you can directly see which URL patterns bind to it.

A noteworthy design evolution: early versions had `.codegraph/config.json` (where you could adjust `languages`, `exclude`, `maxFileSize`, etc.), but recently (PR #283/#285) **the entire config interface was removed**, replaced with "if the file extension matches a supported language, it gets indexed; `.gitignore` is the single source of truth." `maxFileSize` (1 MB) is also hardcoded as a constant. This deliberately reduces footguns -- one fewer thing to misconfigure. The tradeoff: committed but non-gitignored `vendor/` or `dist/` directories will now be indexed too.

## 9 MCP Tools: Heavy vs. Light Division of Labor

When running as an MCP server, CodeGraph exposes 9 tools:

| Tool | Purpose | Weight |
|---|---|---|
| `codegraph_search` | Find symbols by name | Light |
| `codegraph_callers` | Find who calls a function | Light |
| `codegraph_callees` | Find what a function calls | Light |
| `codegraph_impact` | Find what code is affected by changing a symbol | Light |
| `codegraph_node` | Get details of a single symbol (optionally with source code) | Light |
| `codegraph_files` | Get the indexed file structure | Light |
| `codegraph_status` | Check index health and statistics | Light |
| `codegraph_context` | Build relevant code context for a task | **Heavy** |
| `codegraph_explore` | Return source code + relationship graph for multiple related symbols at once | **Heavy** |

The last two are the key ones. `context` and `explore` return large amounts of source code, suitable for feeding exploration context in one shot; the other seven are lightweight indicator queries. The installer writes instructions into `~/.claude/CLAUDE.md` that enforce this division firmly:

> NEVER call `codegraph_explore` or `codegraph_context` directly in the main session. These tools return large amounts of source code that fills up main session context. Instead, ALWAYS spawn an Explore agent for any exploration question (...). The main session may only use these lightweight tools directly (...): `codegraph_search` / `codegraph_callers` / `codegraph_callees` / `codegraph_impact` / `codegraph_node`.

In other words: exploration questions ("How does X work?") always go to an Explore subagent, which uses `codegraph_explore` to ingest source code into its own context; the main conversation only uses lightweight tools for "pinpoint queries before making changes." The purpose of this design is to protect the main session's context window from being flooded by heavy tools' large source code payloads -- this is a classic technique from [context engineering](/posts/ai/2026-05-19-claude-file-handling-three-layers).

## Benchmark: The Honest Retreat from "94%" to "~35%"

The most noteworthy thing about CodeGraph isn't the tool itself, but the evolution of its benchmark methodology.

**Early versions** (README and the author's [Medium post](https://medium.com/@me_82386/i-cut-my-claude-code-api-costs-by-40-with-one-tool-12cf4306a1ab)) ran a "single Explore agent" micro-benchmark: running with and without CodeGraph once each on the VS Code codebase, yielding "~94% fewer tool calls, ~82% faster." The README tagline once read "94% fewer tool calls · 77% faster." The problem: that "94%" measured a single subagent's tool call count, not the savings on your bill.

**The current README** uses a more restrained end-to-end design. The methodology is worth quoting in full:

> Each arm is `claude -p` (Claude Opus 4.7, Claude Code v2.1.145) run headlessly against the repo with `--strict-mcp-config`: WITH = CodeGraph's MCP server enabled, WITHOUT = an empty MCP config. (...) Same question per repo, 4 runs per arm, median reported. Cost = the run's `total_cost_usd`; (...) Tool calls = every tool invocation, including those inside any sub-agents the model spawns.

Several key points: `--strict-mcp-config` ensures the WITHOUT group truly has empty MCP (both sides keep built-in Read/Grep/Bash); same question per group, 4 runs with **median** reported; cost taken directly from `total_cost_usd`; and tool call counts **include all calls inside subagents**. Across 7 repos in 7 languages, the average results are **35% cheaper, 59% fewer tokens, 49% faster, 70% fewer tool calls**.

| Codebase | Language / Scale | Cost | Tokens | Tool calls (WITH -> WITHOUT) |
|---|---|---|---|---|
| Tokio | Rust / ~700 | 52% cheaper | 81% fewer | 9 -> 75 |
| Excalidraw | TS / ~600 | 47% cheaper | 73% fewer | 12 -> 83 |
| VS Code | TS / ~10k | 35% cheaper | 73% fewer | 7 -> 23 |
| Django | Python / ~2.7k | 34% cheaper | 64% fewer | 9 -> 48 |
| Gin | Go / ~150 | 22% cheaper | 23% fewer | 7 -> 8 |
| OkHttp | Java / ~640 | 17% cheaper | 41% fewer | 5 -> 14 |

The retreat from "94%" to "~35%" doesn't mean the tool got worse -- it means the measurement got honest: the micro-benchmark measured how many grep calls a single exploration subagent saved; the end-to-end measurement captures the entire task's (including all subagents) median `total_cost_usd`. The lesson for readers is direct -- **when reading a benchmark, first check which layer it's measuring**. To be fair, the current data still comes from a single first-party source with no independent third-party replication; gains also clearly scale with repo size (Tokio saves 52%, but the ~150-file Gin saves only 22%, with tool calls barely different).

## The Core Tension: It Only Saves Money When "Walking the Graph Directly"

There are two statements in the README that appear to contradict each other. Understanding how they reconcile is key to truly understanding this tool.

The "Why CodeGraph wins" section reveals the premise:

> CodeGraph only helps when queried directly, so its instructions steer agents to answer directly rather than delegate exploration to file-reading sub-agents — otherwise a sub-agent reads files regardless and CodeGraph becomes overhead.

But the installer instructions say "NEVER call explore/context in the main session; ALWAYS spawn an Explore agent." One says don't delegate, the other says you must spawn a subagent. What gives?

The reconciliation lies in "whether the subagent actually walks the graph":
- Heavy tools (`explore`/`context`) return large amounts of source code -> should be sent to an Explore subagent **that uses CodeGraph**, with the subagent's prompt explicitly requiring "use `codegraph_explore` as the primary tool; don't re-read files it already returned."
- Lightweight tools (`search`/`callers`/`impact`/`node`) -> stay in the main session for pinpoint queries.
- The true anti-pattern is: delegating exploration to a **generic subagent that ignores CodeGraph and only uses grep/read** -- it scans files as usual, and CodeGraph is purely an extra layer of overhead.

So whether you save money doesn't depend on "whether CodeGraph is installed," but on "whether the agent's tool orchestration actually walks the graph." This aligns with the conclusion from [MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface): whether a tool is positioned correctly matters more than the tool itself.

## Compared to Alternatives

**vs Native grep/Read**: This is CodeGraph's entire value proposition. On large repos, agents can answer using a few graph queries with often **zero file reads**; the native approach burns budget on discovery (find/ls/grep) before it even starts reading the right files. But on small repos, native search is already cheap -- ManoMano's [Project AEGIS](https://medium.com/manomano-tech/project-aegis-benchmarking-ai-agents-and-why-serena-is-our-new-must-have-311673db35dd) running Serena reached the same directional conclusion: "For quick exploration, vanilla Claude works; heavy tools are actually 4x more expensive and 60% slower." Tool ROI strongly correlates with task scale.

**vs LSP (Serena)**: This is the most frequently asked reader question: "How is it different from LSP?" [Serena](https://github.com/oraios/serena) (21k+ stars) uses Language Server Protocol for **real-time, type-aware** queries -- it can do precise rename, cross-file references, and symbol editing. The cost is that each language needs its corresponding language server installed (a heavy burden in CI/container environments), and each query re-invokes the LSP without storing relationships. CodeGraph is a **pre-computed, persisted** AST graph + FTS5: queries are fast, self-contained, and cross-language in a single graph, but reference resolution depth (aliases, inheritance, type narrowing) falls short of a live language server. In one sentence: choose LSP/Serena for large-scale, type-precise refactoring; choose the graph for fast exploration + low-cost Q&A.

**vs Embedding RAG-on-code**: Tools like Codanna that generate embeddings from doc comments for concept search, or [Graphify](/posts/ai/2026-04-10-graphify-knowledge-graph-codebase) (tree-sitter AST + LLM semantic analysis, claiming 71.5x token savings) covered on this site. CodeGraph avoids vectors and LLM summaries entirely, trading determinism and zero API cost for the inability to do "conceptually similar" search (asking "find validation logic" won't automatically match code that doesn't contain the keyword). In this space, similar MCPs (GitNexus, code-graph-rag-mcp, code-review-graph) all claim "8-120x token savings"; CodeGraph differentiates with "public, end-to-end, challengeable benchmarks" + high-frequency iteration + multi-agent support. Someone has even rewritten it in Rust as `codemap`.

## Limitations and Known Issues

- **WASM fallback is slow**: When the native `better-sqlite3` backend can't be installed, it falls back to WASM, which is 5-10x slower. Its journal mode also makes the writer block the reader -- MCP queries may throw `database is locked` during indexing. Check `codegraph status` for the `Backend:` line; if it says `wasm`, install build tools and run `npm rebuild better-sqlite3`.
- **Low ROI on small projects**: For repos with ~150 files, native grep is already cheap enough that adding another layer isn't worth it.
- **`.gitignore` as single source of truth**: Committed `vendor/` or `dist/` directories will be indexed, potentially causing bloat or noise; files >1 MB are skipped outright (hardcoded constant, not configurable).
- **Reference depth**: AST + framework heuristics mean dynamic dispatch, aliases, and cross-language boundaries may be missed.
- **"Semantic" is a marketing term**: It's actually a structural graph + FTS5 literal search, not vector semantics.
- **Benchmark is first-party only**: Numbers shift with 0.7.x's high-frequency releases, and third-party replication is still lacking.

## Overall Takeaway

CodeGraph bets that a "**deterministic, local, pre-indexed structural graph**" beats both "scanning files on the fly" and "vector RAG": trading zero cost, reproducibility, and a single cross-language graph for "no conceptual similarity understanding, less reference depth than LSP." Its most valuable lesson is actually a transferable principle -- voluntarily downgrading eye-catching micro-benchmark numbers (94%) to honest end-to-end medians (~35%), and making explicit the true prerequisite for cost savings: the agent must actually walk the graph directly, not hand the work off to a file-reading subagent.

For readers of this site, there's also a point of comparison: quidproquo's own search uses the Cloudflare Vectorize (vector embedding) semantic path, while CodeGraph uses the FTS5 + structural graph deterministic path -- the former understands "similarity," the latter understands "relationships," and neither wins across the board. This echoes the site's consistent feature-flag philosophy: embeddings, graphs, and full-text search each have their place. Rather than betting on a single path, make each independently toggleable and let benchmarks decide which one actually saves money.

## References

- [CodeGraph -- GitHub repo](https://github.com/colbymchenry/codegraph)
- [CodeGraph -- npm `@colbymchenry/codegraph`](https://www.npmjs.com/package/@colbymchenry/codegraph)
- [Colby McHenry: I Cut Claude Code Exploration Time and Costs by 90% (author's original post, early micro-benchmark)](https://medium.com/@me_82386/i-cut-my-claude-code-api-costs-by-40-with-one-tool-12cf4306a1ab)
- [Graham Brooks: Building a Code Knowledge Graph for AI Agents (codemap, Rust reimplementation)](https://www.grahambrooks.com/post/building-a-code-knowledge-graph-for-ai-agents)
- [Serena -- GitHub repo (LSP-based comparison)](https://github.com/oraios/serena)
- [Codanna Discussion #30: Differences with Serena?](https://github.com/bartolli/codanna/discussions/30)
- [Project AEGIS -- Benchmarking AI Agents (ManoMano, independent benchmark)](https://medium.com/manomano-tech/project-aegis-benchmarking-ai-agents-and-why-serena-is-our-new-must-have-311673db35dd)
- On this site: [Graphify: Turn Code and Documentation into a Queryable Knowledge Graph](/posts/ai/2026-04-10-graphify-knowledge-graph-codebase)
- On this site: [MCP (Model Context Protocol): The Standardized Protocol for AI Agent Tool Calls](/posts/ai/2026-03-22-mcp-model-context-protocol)
- On this site: [MCP vs CLI vs API: The Real Boundaries of Agent Tool Interfaces](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)
- On this site: [GraphRAG: Making Knowledge into Graphs for LLM Relationship-Based Reasoning](/posts/ai/2026-03-12-graph-rag)
