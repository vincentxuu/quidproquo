---
title: "Tool Pick | localmem-mcp — Agent Memory Without LLM Calls or Cloud Services"
date: 2026-08-24
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "localmem-mcp is a local-first MCP memory server: SQLite + on-device embedding for semantic search, recall never calls an LLM, no API key required, and 20+ coding agents can share the same memory store"
tldr: "localmem-mcp is a local-first MCP memory server that stores and searches agent memories using SQLite + on-device embedding (fastembed), with zero LLM calls on the recall path. Install: `uvx localmem-mcp` (zero-install) or `pip install localmem-mcp`. Solves the problem of existing memory tools (Mem0, Zep) requiring cloud LLM calls, API keys, and extra infrastructure (vector DB / graph DB) to function."
series:
  name: "AI Tool of the Day"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-08-24-tool-localmem-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | localmem-mcp |
| Type | MCP server (agent memory) |
| GitHub | [OpenAgentHQ/localmem-mcp](https://github.com/OpenAgentHQ/localmem-mcp) |
| Stars | 6 |
| Language | Python |
| License | MIT |
| Install | `uvx localmem-mcp` (zero-install) or `pip install localmem-mcp` |

## What Problem It Solves

You've probably hit this before: yesterday you discussed an architecture decision with your agent in Claude Code, and today in a new session the agent has no idea "why we picked SQLite over Postgres" — so you explain it all over again. Existing memory MCPs (Mem0's OpenMemory, Zep/Graphiti) do solve cross-session memory, but at a cost: every store operation calls an LLM to extract facts, every recall calls an LLM for semantic understanding, and you usually need a vector DB or graph DB (Qdrant, Neo4j) running as a sidecar, plus an API key.

localmem-mcp splits "memory" into two pieces: on write, a local embedding model (fastembed, ONNX, 384-dim) computes a vector and stores it in SQLite; on query, it runs cosine similarity + FTS5 keyword matching as a hybrid search — both computed locally, with zero LLM calls in the entire path. The whole service is one SQLite file plus an embedded embedding model. No extra databases, no cloud APIs, no per-call billing.

Good fit for: keeping project decision context across sessions on your dev machine, not wanting to spin up a Docker Compose stack just for memory, or needing multiple coding agents (Claude Code, Cursor, Codex all installed) to share the same memory without syncing cloud accounts.

## Quick Start

### Installation

```bash
# Zero-install — uvx pulls and runs it directly
claude mcp add localmem -- uvx localmem-mcp

# Or install first
pip install localmem-mcp
```

`.mcp.json` / `claude_desktop_config.json` config:

```jsonc
{
  "mcpServers": {
    "localmem": {
      "command": "uvx",
      "args": ["localmem-mcp"]
    }
  }
}
```

### Basic Usage

The agent gets four tools: `store_memory`, `search_memory`, `recall_memory`, `memory_stats`. In practice it's natural-language driven — no manual tool calls needed:

```
You: "Remember that we chose SQLite over Postgres for this project because it's a single file and simpler to deploy."
→ agent calls store_memory, saves to ~/.localmem/memories.db

(Next day, new session)
You: "What database did we pick?"
→ agent calls search_memory, finds the "SQLite" memory via semantic matching and answers
```

There's also a standalone CLI and Python library for direct access without going through an agent:

```bash
localmem-mcp add "Deploys go out on Thursdays" --tag ops
localmem-mcp search "when do we ship?"
localmem-mcp export > memories.jsonl   # bulk-export all memories
```

### Advanced Usage

Use environment variables to isolate memories per project:

```bash
export LOCALMEM_DB_PATH=~/.localmem/project-a.db
export LOCALMEM_MODEL=BAAI/bge-small-en-v1.5   # any fastembed-supported model works
```

## Comparison With Existing Tools

| | localmem-mcp | OpenMemory MCP (Mem0) | mem0-mcp-server | Zep / Graphiti |
|---|---|---|---|---|
| Cloud calls | Zero (model downloaded once on first use) | Yes — writes call LLM for fact extraction | Yes — goes through Mem0 hosted platform | Yes — LLM builds/updates knowledge graph |
| API key required | No | Needs `OPENAI_API_KEY` | Needs `MEM0_API_KEY` | Needs LLM provider key |
| Recall path calls LLM | No — pure local cosine similarity + FTS5 | Yes | Yes | Yes — graph traversal/summarization via LLM |
| Install footprint | `pip install` or `uvx`, no other services | Docker Compose (API + vector DB) | Package + Mem0 hosted account | Self-hosted graph DB + LLM, or Zep Cloud |
| Data storage | Single SQLite file | Qdrant + history DB | Mem0 hosted storage | Neo4j / FalkorDB |

(Comparison based on each project's official docs as of August 2026; check the latest README for current status.)

## Caveats

- **Not a knowledge graph**: localmem-mcp deliberately stays at the "SQLite + embedding" layer and does not do entity-relationship reasoning — that's the strength of graph DB solutions like Zep/Graphiti. If you need cross-memory relational inference, this isn't the right tool.
- **First run downloads a model**: The only network request is pulling ~90MB of embedding model weights from Hugging Face on first use; after that it's truly offline. In air-gapped environments, pre-download the model manually.
- **Early-stage project**: Created on 2026-08-14 with only 6 stars and 12 open issues. The API surface may still change — pin the PyPI version before adopting in production.

## Takeaway

Most "agent memory" tools bundle "remembering things" with "using an LLM for semantic understanding," making it seem like semantic search inherently requires a cloud LLM. localmem-mcp proves these two concerns can be separated: semantic search only needs a local embedding model to compute vectors and similarity — no need to burn LLM tokens on the query path.

## References

- [localmem-mcp GitHub repo](https://github.com/OpenAgentHQ/localmem-mcp)
- [localmem-mcp documentation](https://openagenthq.github.io/localmem-mcp/)
- [localmem-mcp on PyPI](https://pypi.org/project/localmem-mcp/)
- [localmem-mcp integrations (20+ agent configs)](https://openagenthq.github.io/localmem-mcp/integrations/)
