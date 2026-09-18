---
title: "Open-Source Agent Memory Frameworks: Seven Contenders and a Selection Guide"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, mem0, zep, graphiti, letta, langgraph, llamaindex, open-source]
series:
  name: "AI Agent 記憶工程"
  order: 5
lang: en
tldr: "Seven open-source memory frameworks span the spectrum from auto-extracted vectors to human-readable files: Mem0's one-line add(), Graphiti's bi-temporal knowledge graph, Letta's agent-edited system-prompt blocks, LangGraph's namespaced Store, LlamaIndex's priority-based block truncation, Cognee's triple-store pipeline, and Supermemory's temporal vector-graph engine. This post compares their storage, write/forget mechanics, tenant isolation, and benchmark numbers, then offers selection guidance for four common scenarios."
description: "Comparing Mem0, Zep/Graphiti, Letta, LangGraph, LlamaIndex Memory, Cognee, and Supermemory on design trade-offs, with a capability matrix, design-philosophy spectrum positioning, and a four-scenario decision tree."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection)

Your agent needs long-term memory across sessions, but you don't want to be locked into a single cloud. The open-source landscape in 2026 has far more options than two years ago — and far more confusion. This post compares seven major frameworks on a consistent set of criteria, then offers selection guidance for four common scenarios.

If you're not yet sure what "memory" means in an agent system, start with this series' order 1: Four Types of Memory and Six Design Axes. If you want managed cloud offerings (Anthropic memory tool, OpenAI sandbox memory, Vertex AI Memory Bank, AWS AgentCore, Microsoft Foundry), that's order 4: Five Clouds' Memory APIs.

## Where they sit on the design-philosophy spectrum

Before comparing details, here's where each framework lands. The spectrum follows the framing from [Anthropic's harness engineering posts](https://www.anthropic.com/engineering/harness-design-long-running-apps) and [LangChain's context engineering post](https://blog.langchain.com/context-engineering-for-agents/):

```
Files as memory (human-readable, git-manageable)          Fully automated vector / graph memory
◄────────────────────────────────────────────────────────────────────────────────────────────────►
        Letta MemFS          LangGraph Store    LlamaIndex     Mem0    Supermemory     Graphiti    Cognee
        (git-backed)         (namespace KV)     (blocks+SQL)   (vector) (temporal VG)  (bi-temporal KG) (triple-store)
```

Further left means humans can read and edit the memory. Further right means higher automation but less transparency. Neither end is inherently better — it depends on whether your scenario requires human review or full automation.

## Mem0: one-line `add()` with automatic extraction

[Mem0](https://mem0.ai) (Apache-2.0, v2.0.19, 2026-08-24) is the most widely integrated open-source memory layer. Per the [ECAI 2025 paper](https://arxiv.org/abs/2504.19413), the core flow is: conversation comes in → LLM extracts facts worth keeping → stores in a vector store → next time, hybrid retrieval (semantic + BM25 + entity) with recency decay.

**Storage**: Vector-based. The 2026 version switched to single-pass ADD-only extraction ([OSS v2→v3 migration docs](https://docs.mem0.ai/migration/oss-v2-to-v3)). Graph memory was removed from the open-source SDK and moved to the hosted Platform.

**Write**: `add(messages, user_id=..., agent_id=..., infer=True)` — one line, the LLM decides what to extract.

**Forgetting**: `update` / `delete`, `expiration_date`; recency decay only affects retrieval ranking, doesn't auto-delete. No Ebbinghaus-style decay.

**Tenant isolation**: `user_id` / `agent_id` / `app_id` are application-level conventions with **no built-in ACL**. The Platform version adds org / project scopes, SOC 2 Type I, HIPAA-ready.

**Benchmarks**: Paper reports LoCoMo 66.9 (Mem0) / 68.4 (Mem0-g) vs full-context 72.9; the 2026 research page claims LoCoMo 92.5, LongMemEval 94.4 (vendor-reported — different judges and backbones, not directly comparable).

**Integration ecosystem**: OpenMemory MCP, AWS AgentCore integration, LangGraph / LlamaIndex adapters, Claude Code / Cursor / Codex plugins. $24M raised (2025-10-28).

Good fit for quickly adding "remember user preferences" to an existing agent. Not a good fit for scenarios requiring temporal reasoning or contradiction history. Full deep-dive in this series' [order 6: Mem0 Complete Guide](/posts/ai/2026-08-22-mem0-agent-memory-en).

## Zep / Graphiti: time as a first-class citizen

[Graphiti](https://github.com/getzep/graphiti) (Apache-2.0, v0.29.3, 2026-07-27) is the open-source engine; Zep Cloud is the commercial service built on it (SOC 2 Type II, HIPAA). Zep Community Edition was discontinued on 2025-04-02.

**Storage**: A **bi-temporal knowledge graph** — every edge carries `created_at` / `expired_at` / `valid_at` / `invalid_at`. Contradictory facts aren't overwritten or deleted; they're marked as invalidated at a point in time. Per the [Graphiti paper](https://arxiv.org/abs/2501.13956), this lets the system answer time-bounded questions like "where did they live last month."

**Write**: Zep Cloud auto-ingests thread messages (<10s latency); open-source Graphiti requires explicit `add_episode` / `add_triplet`.

**Read**: `thread.get_user_context` returns a Context Block (USER_SUMMARY + date-bounded FACTS), P95 latency <200 ms. Graphiti also offers hybrid search.

**Forgetting**: Temporal invalidation, not physical deletion — this is the biggest design difference from Mem0. If you need to trace "when did this become wrong," Graphiti preserves the evidence.

**Tenancy**: account → projects → users / graphs; Graphiti's `group_id` is enforced by the application layer.

**Benchmarks**: Paper reports DMR 94.8% vs MemGPT 93.4%; LongMemEval up to +18.5%, latency −90%; marketing page claims LoCoMo 94.7 (vendor-reported).

Good fit for scenarios requiring temporal reasoning: customer service history, medical records, contract change tracking. Not a good fit for lightweight preference recording. Full deep-dive available on-site: [Zep introduction](/posts/ai/2026-08-22-zep-agent-memory-en).

## Letta: the agent manages its own memory

[Letta](https://github.com/letta-ai/letta) (Apache-2.0, v0.16.8, 2026-05-14) evolved from the [MemGPT paper](https://arxiv.org/abs/2310.08560). Its core idea is making memory management a tool the agent uses itself — the model actively edits core memory blocks pinned in the system prompt via `memory_replace` / `memory_insert` / `memory_rethink`.

**First generation** (MemGPT era): core blocks (always in system prompt) + archival (pgvector for long-term) + recall (conversation history).

**Second generation** (2026-03-16, ["Letta's Next Phase"](https://www.letta.com/blog)): Letta Code became the flagship. Legacy memory tools were replaced by **git-backed Context Repositories / MemFS** (2026-02-12). Sleep-time compute evolved into **Dreaming** background reflection subagents.

**Cross-agent**: Shared blocks, Conversations API (2026-01-21), shared archive. One of the few frameworks with native multi-agent memory sharing.

**Forgetting**: Block editing (agent does it), compaction, git revert. Git-backing means memory has full version history.

**Benchmarks** (vendor-reported): Letta Filesystem 74.0% LoCoMo (GPT-4o-mini) vs Mem0 68.5%.

**Pricing**: Free / Pro $20 / API $20 + $0.10 per active agent.

Good fit for scenarios where the agent should self-manage memory and you want git-auditable, revertible history. Steeper learning curve than Mem0 — you need to understand the blocks / archival / recall division. Full deep-dive on-site: [Letta introduction](/posts/ai/2026-08-22-letta-memgpt-agent-memory-en).

## LangGraph / LangMem: framework-native memory

[LangGraph](https://docs.langchain.com/oss/python/langgraph/persistence) (MIT, v1.2.11, 2026-08-11) is LangChain's agent orchestration layer. Memory here isn't a standalone product but part of the framework.

**Short-term**: **Checkpointer** (thread state). Backends include InMemory / Sqlite / Postgres / MongoDB / Redis (Redis with native TTL). Automatically snapshots after each graph execution.

**Long-term**: **Store** (namespace-tuple-based put / get / search / delete). `IndexConfig` enables semantic retrieval. The Platform version supports TTL.

**Memory types**: Documented as semantic / episodic / procedural per the [LangChain 2024-10 blog post](https://blog.langchain.com/memory-for-agents/), distinguishing hot-path (synchronous, written inside graph nodes) from background (asynchronous, via `ReflectionExecutor`) writes.

**LangMem** (MIT): manage / search tools, memory managers, prompt optimizer. Last feature release 0.0.30 (2025-10-27), effectively in maintenance mode.

**LangChain 1.x middleware**: `SummarizationMiddleware`, `ContextEditingMiddleware(ClearToolUsesEdit)`, `FilesystemMiddleware` + `CompositeBackend` (`/memories/` → StoreBackend).

**LangSmith Fleet** (2026-01-13 GA): memory = files in a `memories/` folder, **every update requires user approval** — representative of the 2026 trend of returning write authority to humans.

Good fit for teams already using LangGraph — no extra infra needed, checkpointer + Store is sufficient. Not a good fit for projects outside the LangChain ecosystem (high lock-in).

## LlamaIndex Memory: block priority controls truncation

[LlamaIndex](https://github.com/run-llama/llama_index) (MIT, llama-index-core 0.14.24, 2026-08-19) revamped its Memory module on 2025-05-08.

**Core mechanism**: The `Memory` object manages `token_limit` (default 30,000), `chat_history_token_ratio` (0.7), and `token_flush_size` (3,000). When the budget overflows, the oldest messages are flushed in batches to each block's `aput()`; on read, `get()` prepends blocks back into context.

**Blocks** (composable):
- `StaticMemoryBlock`: fixed text, never truncated
- `FactExtractionMemoryBlock(max_facts=50)`: LLM-extracted facts, condensed when over limit
- `VectorMemoryBlock(similarity_top_k=2)`: vector retrieval
- **priority 0** blocks are never truncated — this is the mechanism for "what must always be remembered"

**Tenancy**: Only `session_id`, no user / org dimension.

**Integrations**: 2026 additions include `llama-index-memory-mem0` (1.0.0) and `llama-index-memory-bedrock-agentcore` (2026-02-06), letting Mem0 and AgentCore serve as block backends.

Good fit for existing LlamaIndex RAG projects that want to incrementally add memory. Weak tenant isolation — B2B multi-tenant scenarios need custom user / org dimensions at the block layer.

## Cognee: a triple-store pipeline

[Cognee](https://github.com/topoteretes/cognee) (Apache-2.0, v1.5.3, 2026-08-23) is a data-to-AI-memory pipeline using three storage types: relational (LanceDB default) + vector + graph (Kuzu default, swappable for Neo4j / FalkorDB). $7.5M seed (2026-02-19).

**API**: `remember()` = add → cognify → improve; `recall()` / `search(SearchType)` for reads; `forget()` for deletion.

**Forgetting**: `forget()`, prune, feedback weights. No time-based decay.

**Tenancy**: users / tenants / roles with per-dataset isolated DBs. More complete isolation than Mem0 or LlamaIndex.

**Benchmarks**: HotPotQA F1 0.84 (vendor-reported); independent MemoryAgentBench evaluation ~31–42, mediocre.

Good fit for turning unstructured documents into a queryable knowledge graph (e.g., enterprise knowledge bases). More complex API than Mem0; the pipeline is customizable but has a steep learning curve. Full deep-dive on-site: [Cognee introduction](/posts/ai/2026-08-22-cognee-memory-engine-en).

## Supermemory: temporal vector-graph engine

[Supermemory](https://github.com/supermemoryai/supermemory) (MIT, server 0.0.8, 2026-08-17) calls itself a "Temporal Vector-Graph Engine," mixing chunks + memories (fact graph) + profile. $3M raised (2025-10-06).

**Write**: `/v3/documents`, `/v4/memories`, SDK auto-extraction. Memory Router proxy (status unclear — documented but community reports instability).

**Forgetting**: More complete than most frameworks — `expiry`, contradiction versioning, `forgetAfter`, forget-matching, Memory Review.

**Tenancy**: `containerTag` isolation.

**Benchmarks** (vendor-reported, disputed): LongMemEval-S 84.6% (gpt-5).

Still early-stage; the API changes frequently (v3 → v4 in short succession). Good fit if you're willing to accept early-stage risk and want temporal memory without building your own graph.

## 2026 newcomers at a glance

These frameworks are either new or small, but each brings a unique design idea:

| Name | License | Distinguishing feature | Benchmark (self-reported) |
|---|---|---|---|
| [Hindsight](https://arxiv.org/abs/2512.12818) (Vectorize) | MIT | Memory that learns from experience | LongMemEval 91.4%, LoCoMo 89.61% |
| [EverMemOS](https://arxiv.org/abs/2601.02163) (EverMind) | — | MemCell → MemScene hierarchy, ACL 2026 | LoCoMo 93.05% |
| [MemOS](https://arxiv.org/abs/2507.03724) (MemTensor) | — | MemCube abstraction unifying parametric/activation/explicit memory | LoCoMo +38.97% vs OpenAI memory |
| Mastra Observational Memory | — | Observational memory | LongMemEval ~95% |
| [OpenViking](https://github.com/nicepkg/OpenViking) (Volcengine) | AGPL | `viking://` virtual filesystem, three-tier loading | LoCoMo 80–83% |
| Memori (GibsonAI) | — | SQL-native memory | — |
| Honcho (Plastic Labs) | AGPL | — | — |
| Redis Agent Memory Server | — | Redis-native memory service | — |

All benchmark numbers should be treated as vendor-reported. Per the [Penfield Labs 2026-04 audit](https://arxiv.org/abs/2507.05257), LoCoMo contains 6.4% incorrect ground-truth answers, the LLM judge accepts 63% of wrong answers, and scores can swing by 40 points when switching backbones.

## Capability matrix (open-source frameworks only)

| Capability | Mem0 | Zep/Graphiti | Letta | LangGraph | LlamaIndex | Cognee | Supermemory |
|---|---|---|---|---|---|---|---|
| Storage | vector (graph on Platform only) | bi-temporal KG | KV blocks + vector + git | KV store + vector index | SQL + facts + vector | relational + vector + graph | temporal vector-graph |
| Write trigger | `add()` auto-extraction | auto-ingest / explicit | agent self-editing | explicit put / background | overflow flush | explicit `remember()` | SDK auto-extraction |
| Forgetting | expiration + ranking decay | temporal invalidation (preserves history) | edit / revert / git | TTL | FIFO + condense | forget / prune | expiry + contradiction versioning |
| Cross-agent | agent_id sharing | graph layer | shared blocks | namespace | no | dataset layer | containerTag |
| Tenant isolation | key convention (no ACL) | project / group_id | identities | namespace | session_id | users / tenants / roles | containerTag |
| User visibility | dashboard (Platform) | API | ADE / git | no built-in UI | none | API | API |
| Maturity | high ($24M, wide integrations) | mid-high (commercial version stable) | mid (transitioning) | high (LangChain ecosystem) | mid (memory module newer) | mid (1.0 in 2026-06) | low (early-stage) |

## Selection guidance for four scenarios

### Scenario 1: B2C personalization (remembering user preferences)

Requirements: quick integration, simple API, no complex temporal reasoning needed.

**Go with Mem0.** One `add()` call gets you started, `user_id` scoping is sufficient. If you're already using LlamaIndex, the `llama-index-memory-mem0` adapter is the lowest-friction path.

Note: Mem0's tenant isolation is application-level convention with no built-in ACL. If your B2C scenario involves multi-tenancy (e.g., SaaS), you'll need to add permission checks at the application layer.

### Scenario 2: B2B multi-tenant (enterprise customers each isolated)

Requirements: strict data isolation, auditability, compliance.

**Go with Cognee** (built-in users / tenants / roles + per-dataset isolated DBs) or **Zep Cloud** (SOC 2 Type II, HIPAA, account → projects hierarchy). Open-source Graphiti's `group_id` also works, but isolation logic falls on the application layer.

Avoid relying solely on Mem0's key conventions or LlamaIndex's `session_id` — these are too thin for multi-tenant scenarios.

### Scenario 3: Coding agent plugin (adding memory to Claude Code / Cursor / Codex)

Requirements: local execution, file-based memory, MCP integration.

**Go with OpenViking** (`viking://` virtual filesystem, supports Claude Code / Cursor) or **Mem0 OpenMemory MCP** (hosted). Letta Code (v0.31.0) also supports this but is positioned differently — it's a full agent runtime, not just a memory plugin.

This series' [order 7: OpenViking](/posts/ai/2026-08-22-openviking-agent-memory-en) has a full deep-dive.

### Scenario 4: Building your own agent platform (full memory management needed)

Requirements: short-term + long-term memory, cross-agent sharing, memory lifecycle management.

If you're already in the LangChain ecosystem: **LangGraph checkpointer + Store** is the most natural choice, no extra infra required.

If you're outside the LangChain ecosystem: **Letta** provides the most complete memory lifecycle (blocks + archival + recall + git-backed + Dreaming), but has the steepest learning curve.

If you need temporal reasoning: **Graphiti**'s bi-temporal design is unique — other frameworks "forget" by deleting or overwriting; Graphiti invalidates and preserves history.

## You probably don't need to build your own vector/graph memory layer

A counterintuitive 2026 trend: major vendors (OpenAI, Anthropic, Letta, LangChain) have independently converged on **Markdown files + indexes + progressive disclosure** as the memory substrate (details in this series' order 9: Where Memory Systems Are Headed in 2026). Vector/graph memory hasn't disappeared, but it has retreated to "pluggable backend" status. If your scenario doesn't require temporal reasoning or complex knowledge graphs, files + indexes may be enough.

The next two posts deep-dive into representatives from each end of the spectrum — [Mem0 (vector extraction)](/posts/ai/2026-08-22-mem0-agent-memory-en) and [OpenViking (filesystem)](/posts/ai/2026-08-22-openviking-agent-memory-en).

## References

- [Mem0 official docs](https://docs.mem0.ai)
- [Mem0 GitHub](https://github.com/mem0ai/mem0)
- [Mem0 ECAI 2025 paper](https://arxiv.org/abs/2504.19413)
- [Mem0 OSS v2→v3 migration docs](https://docs.mem0.ai/migration/oss-v2-to-v3)
- [Graphiti GitHub](https://github.com/getzep/graphiti)
- [Zep official docs](https://help.getzep.com)
- [Graphiti paper](https://arxiv.org/abs/2501.13956)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [MemGPT paper](https://arxiv.org/abs/2310.08560)
- [Letta blog: Next Phase](https://www.letta.com/blog)
- [LangGraph Persistence docs](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangChain — Memory for agents](https://blog.langchain.com/memory-for-agents/)
- [LangChain — Context engineering for agents](https://blog.langchain.com/context-engineering-for-agents/)
- [LlamaIndex GitHub](https://github.com/run-llama/llama_index)
- [Cognee GitHub](https://github.com/topoteretes/cognee)
- [Supermemory GitHub](https://github.com/supermemoryai/supermemory)
- [Hindsight paper](https://arxiv.org/abs/2512.12818)
- [EverMemOS paper](https://arxiv.org/abs/2601.02163)
- [MemOS paper](https://arxiv.org/abs/2507.03724)
- [MemoryAgentBench paper](https://arxiv.org/abs/2507.05257)
- [Anthropic — Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- On-site: [Mem0 Complete Guide](/posts/ai/2026-08-22-mem0-agent-memory-en)
- On-site: [OpenViking introduction](/posts/ai/2026-08-22-openviking-agent-memory-en)
- On-site: [Zep introduction](/posts/ai/2026-08-22-zep-agent-memory-en)
- On-site: [Letta introduction](/posts/ai/2026-08-22-letta-memgpt-agent-memory-en)
- On-site: [Cognee introduction](/posts/ai/2026-08-22-cognee-memory-engine-en)
- On-site: [Agent Memory Systems: From RAG to Read-Write Memory](/posts/ai/2026-03-19-agent-memory-systems-en)
