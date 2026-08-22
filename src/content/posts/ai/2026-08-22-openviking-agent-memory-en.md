---
title: "OpenViking: Agent Memory as a Virtual Filesystem"
date: 2026-08-22
category: ai
type: deep-dive
tags: [agent-memory, openviking, virtual-filesystem, context-engineering, mcp, open-source]
lang: en
tldr: "Volcano Engine's open-source OpenViking stores agent memory, knowledge, and skills as a viking:// virtual filesystem — browsable with ls, tree, and find. Three-tier loading (L0/L1/L2) averages just 550 tokens per retrieval, boosting LoCoMo memory accuracy from 24–57% to 80–83%."
description: "OpenViking replaces black-box vector stores with a virtual filesystem for agent memory, featuring three-tier on-demand loading and support for Claude Code, Cursor, and other coding agents."
draft: false
glossary:
  - term: "LoCoMo"
    definition: "Long Context Memory 的縮寫，用來評估 LLM 在多輪長對話後能否正確回憶使用者提過的事實。"
    definition_en: "Short for Long Context Memory, a benchmark that evaluates whether LLMs can correctly recall user-mentioned facts after long multi-turn conversations."
  - term: "tau2-bench"
    aliases: ["τ2-bench"]
    definition: "用模擬的客服場景（零售、航空）測試 agent 能否在多輪互動中完成任務的基準測試。"
    definition_en: "A benchmark that tests whether agents can complete tasks across multi-turn interactions in simulated customer service scenarios (retail, airline)."
---

> 🌏 [中文版](/posts/ai/2026-08-22-openviking-agent-memory)

The most common failure mode in AI agents: misremembering facts, pulling in stale context, forgetting what matters. The root cause isn't model capability — it's that the memory infrastructure is too crude. Vector databases return whatever they return, and you can't even see what the agent has actually stored.

Volcano Engine's open-source [OpenViking](https://github.com/volcengine/OpenViking) takes a different metaphor: agent memory as a virtual filesystem. The protocol is `viking://`, and you can run `ls`, `tree`, `find` in your terminal to browse what the agent remembers. The academic foundation is the [VikingMem](https://arxiv.org/abs/2605.29640) paper (Jiajie Fu et al.), accepted at VLDB 2026.

## The Problem with Vector Databases

Most agent memory solutions center on a vector database: embed the conversation at session end, retrieve the nearest chunks by cosine similarity next time.

Three structural problems:

**No observability.** Vector space is high-dimensional and invisible to humans. You can't `ls` the agent's memory or `grep` whether a specific fact was stored. Debugging means asking a question and seeing if the answer is correct — essentially a blind test.

**Full-context loading.** Traditional RAG retrieves chunks indiscriminately. A 100-token summary that's enough to assess relevance consumes the same context window as a full document that needs line-by-line reading.

**No structure.** Hierarchical relationships between memories (which project does this document belong to, whose preference is this) are flattened in vector space. Retrieval relies solely on semantic similarity, not structural navigation.

## OpenViking's Filesystem Metaphor

OpenViking organizes all agent context — memory, knowledge, skills — into a virtual directory tree, addressed by `viking://` URIs:

```
viking://
├── resources/          # Objective knowledge: docs, code, web pages
│   └── my_project/
│       ├── docs/
│       └── src/
└── user/{user_id}/
    ├── memories/       # User-level memories
    │   └── preferences/
    ├── resources/      # User-added data
    ├── skills/         # Learned skills
    └── peers/          # Other agents' info
```

Three public scopes, each with a clear purpose: `resources` for objective knowledge (documentation, code, external data), `user` for user-level memory (session history, preferences, identity), `agent` for skills, tools, and endpoints.

The key design: every directory carries `.abstract` and `.overview` metadata files. The agent doesn't need to "open" an entire directory to know what's inside — reading the summary is enough to decide whether to drill deeper.

## Three-Tier Loading: L0 / L1 / L2

This is OpenViking's most important engineering decision. Content is processed into three summary tiers, and the agent loads only the depth the task requires:

| Tier | Name | Size | Purpose |
|---|---|---|---|
| L0 | Abstract | ~100 tokens | Vector search, quick filtering — "Is this directory relevant to my question?" |
| L1 | Overview | ~2k tokens | Rerank, structural navigation — "What are the key points? Worth going deeper?" |
| L2 | Detail | Full content | On-demand loading — read full text only when confirmed necessary |

According to [OpenViking's README](https://github.com/volcengine/OpenViking), average retrieval uses about 550 tokens. Full-content loading would be an order of magnitude higher.

The retrieval pipeline is two-stage: first, LLM-based intent analysis generates typed queries; then a hierarchical retriever descends the directory tree recursively — using a priority queue to decide which subdirectories are worth expanding — followed by rerank. The storage layer splits into two: content (RAGFS, rewritten in Rust) and vector index.

## Memory Self-Evolution

OpenViking isn't just a static filesystem. When a session "commits," the system asynchronously extracts structured memories. Built-in memory types include:

- **profile / identity**: who the user is, background
- **preferences**: settings and preferences
- **entities / events**: entities and events mentioned in conversation
- **experiences / cases**: task completion experiences and cases
- **trajectories**: behavioral trajectories
- **skills / tools**: learned skills and tool usage

These memories are automatically filed under the corresponding directories in `viking://user/`, and auto-recalled on the next session startup.

## Benchmark Results

Per the [OpenViking README](https://github.com/volcengine/OpenViking), v0.3.22 benchmark results:

**LoCoMo (user memory accuracy):**

| Agent | Native Accuracy | + OpenViking | Token Reduction | Latency Reduction |
|---|---|---|---|---|
| OpenClaw | 24.20% | 82.08% | 91.0% | 66.10% |
| Hermes | 33.38% | 82.86% | 84.9% | 58.45% |
| Claude Code | 57.21% | 80.32% | 34.3% | 65.55% |

Claude Code's native accuracy is already decent (57.21%), but OpenViking still pushes it to 80.32% while cutting token consumption by 34.3%. The improvement for OpenClaw and Hermes is even more dramatic — accuracy more than doubled.

**tau2-bench (multi-turn task success):**
- Retail scenario: +6.87 percentage points
- Airline scenario: +11.87 percentage points

Tests used Doubao 2.0 Pro as VLM and Doubao-embedding-vision-251215 for embeddings. These are Volcano Engine's own models — performance on other models may vary, though the three-tier loading architecture is model-agnostic by design.

## Coding Agent Integrations

OpenViking currently supports:

- **Claude Code**: via openviking-memory plugin, auto-recall on session startup
- **Cursor**: MCP server + hooks
- **Codex / OpenCode**: direct integration
- **TRAE / TraeCode CLI 2.0**: shared installation script
- **OpenClaw / Hermes**: native support

It provides a native [MCP](https://modelcontextprotocol.io/) server, so any MCP-compatible client can use it directly.

CLI operations look like this:

```bash
# Add a resource
ov add-resource https://github.com/volcengine/OpenViking

# Browse memory
ov ls viking://resources/
ov tree viking://resources/volcengine -L 2

# Semantic search
ov find "what is openviking"

# Search within a specific scope
ov grep "openviking" --uri viking://resources/volcengine/OpenViking/docs/en
```

## Overall

OpenViking addresses a specific problem: agent memory shouldn't be a black box. The filesystem metaphor makes memory observable (`ls` to see), controllable (`rm` to delete), and debuggable (`tree` to understand structure). Three-tier loading is a practical engineering design — not every retrieval needs the full context.

The main project is AGPLv3-licensed — commercial derivatives must be open-sourced. However, the CLI crate (`crates/ov_cli`) and examples are Apache 2.0, freely usable in commercial settings. Installation requires Python 3.10+ (`pip install openviking`), and `openviking-server init` provides an interactive configuration wizard supporting Volcengine, OpenAI, Kimi, GLM, and Ollama as embedding providers.

Notable limitations: benchmarks used Volcano Engine's own models (Doubao), and third-party validation on other models is still pending. AGPLv3 licensing creates friction for enterprise integration — using it as a CLI tool (Apache 2.0) is fine, but integrating it into your own service requires evaluating license obligations.

31,700+ stars on GitHub, actively maintained, and worth watching.

## References

- [OpenViking GitHub Repository](https://github.com/volcengine/OpenViking)
- [VikingMem: A Memory Base Management System for Stateful LLM-based Applications](https://arxiv.org/abs/2605.29640) (arXiv:2605.29640, VLDB 2026)
- [MCP (Model Context Protocol) Documentation](https://modelcontextprotocol.io/)
