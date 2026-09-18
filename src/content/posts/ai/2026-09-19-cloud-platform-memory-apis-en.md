---
title: "Five Clouds, Five Memory APIs: How OpenAI, Anthropic, Google, AWS, and Microsoft Let Agents Remember"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, platform-api, openai, anthropic, google-cloud, aws-bedrock, microsoft-foundry, context-engineering]
series:
  name: "AI Agent 記憶工程"
  order: 4
lang: en
tldr: "All five major cloud platforms shipped agent memory APIs in 2025–2026, but their design philosophies diverge sharply: OpenAI writes memory as files, Anthropic mounts memory as a directory, Google uses vectors with topic classification, AWS combines events with pluggable strategy pipelines, and Microsoft abstracts memory behind context providers. Pricing ranges from free to $0.75/1K records/month; tenant isolation spans from 'your app handles it' to IAM as a first-class citizen."
description: "Breaking down the agent memory API design, capabilities, and pricing of OpenAI Agents SDK, Anthropic Memory Tool and Managed Agents, Google Memory Bank, AWS AgentCore Memory, and Microsoft MAF and Foundry."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-cloud-platform-memory-apis)

You want to add memory to your agent without building the plumbing from scratch. All five major cloud platforms shipped memory-related APIs between 2025 and 2026, but "memory" looks different in each one — some give you a filesystem for the agent to read and write, some auto-extract facts into vector stores, and some hand you a session object and leave the rest to you.

This post tears open each platform's developer memory API. Consumer-side memory features (ChatGPT's Memory, Claude.ai's Memory) get only a brief mention — those are product features, not APIs you can call.

If you're not yet clear on the difference between working, episodic, semantic, and procedural memory, start with [Four Types of Memory and Six Design Axes](/posts/ai/2026-09-19-agent-memory-taxonomy) in this series.

## OpenAI: Memory as Files

OpenAI's memory design has a clear evolution arc: from Responses API conversation state, to Agents SDK session management, to sandbox memory's "distill lessons into files."

**Responses API state and compaction.** The foundation is `previous_response_id` chaining — each request carries the prior response's ID and the API auto-prepends the history. The catch: all prior input tokens are re-billed. Client-side compaction (`POST /responses/compact`) shipped 2025-12-11, server-side compaction (`context_management: [{type: "compaction", compact_threshold: N}]`) followed 2026-02-10, and GPT-5.4 on 2026-03-05 brought native compaction support alongside a 1M context window. Per the [official docs](https://developers.openai.com/api/docs/guides/compaction), `store` defaults to true, Responses are retained for 30 days, and ZDR scenarios use `store=false`.

**Agents SDK Sessions.** Per the [official docs](https://openai.github.io/openai-agents-python/sessions/), a Session is a "transcript warehouse": the runner prepends history before execution and stores new items after. Built-in backends include `SQLiteSession`, `OpenAIConversationsSession` (server-side `conversation_id`), `OpenAIResponsesCompactionSession` (auto/manual compaction), plus community-maintained Redis, SQLAlchemy, MongoDB, Dapr, and `EncryptedSession` (encryption + TTL). Forgetting is limited to TTL or `clear_session`; multi-tenancy relies on `session_id` conventions with no built-in ACL.

**Sandbox memory: distilling lessons into files.** Per the [2026-04-15 announcement](https://openai.com/index/the-next-evolution-of-the-agents-sdk) and [official docs](https://openai.github.io/openai-agents-python/sandbox/memory/), sandbox memory in `openai-agents>=0.14.0` is OpenAI's clearest statement on memory design: memory is files in the sandbox workspace. The layout is fixed — `memories/memory_summary.md` (injected at run start), `MEMORY.md` (index), `rollout_summaries/`, `raw_memories/`, `skills/`. Writes happen in two stages after a run completes (extraction → consolidation), controlled by `MemoryGenerateConfig`; reads use progressive disclosure. Grouping hierarchy: conversation → session → group → run. Persistence is delegated to sandbox-mounted storage (S3 / GCS / Azure Blob / R2).

Notably, this file layout is identical to Codex's Memories — OpenAI pushed "files as memory" from product into the SDK. As the [OpenAI cookbook (2026-05-01)](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction) puts it: "compaction keeps this run going, memory gives the next run a starting point, human-reviewed memos are the source of truth."

**Consumer-side note.** ChatGPT Memory has two layers: Saved memories (explicit or model-initiated discrete facts) plus Chat-history reference. [Dreaming](https://openai.com/index/chatgpt-memory-dreaming) (2026-06-04) added background cross-conversation consolidation with an editable memory summary page; internal evaluation showed factual recall improving from 67.9% to 82.8%. These are consumer features — no developer API currently exposes Dreaming directly.

## Anthropic: Memory as a Mounted Directory

Anthropic's memory API has three layers: context editing at the bottom, memory tool in the middle, and Managed Agents memory stores at the top. The design philosophy is "memory is client-side file operations" — the platform doesn't extract for you; Claude decides what to store and how.

**Context editing and compaction.** Per the [official docs](https://platform.claude.com/docs/en/build-with-claude/context-editing), context editing (beta `context-management-2025-06-27`) provides two clearers: `clear_tool_uses_20250919` (triggers at 100k tokens, retains the 3 most recent, supports `exclude_tools`) and `clear_thinking_20251015`. Server-side execution reports `applied_edits`. When paired with the memory tool, Claude receives a system-level warning to "save to memory first" before clearing.

Compaction (beta `compact-2026-01-12`) triggers when `input_tokens` hits the default 150,000 (configurable down to 50,000), outputting a `compaction` block that replaces all prior content. Per the [official docs](https://platform.claude.com/docs/en/build-with-claude/compaction), client-side SDK compaction is now deprecated.

**Memory tool.** Per the [official docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool), the memory tool is a client-side tool definition (`{"type": "memory_20250818", "name": "memory"}`, Claude 4+). Claude issues `view / create / str_replace / insert / delete / rename` commands against a `/memories` directory, which **your application** executes — Anthropic never touches your storage. Auto-injected system instructions tell Claude to "check the memory directory before doing anything, and assume you may be interrupted at any time." The SDK provides `BetaLocalFilesystemMemoryTool` and `BetaAbstractMemoryTool` helpers.

The key design choice: storage, tenant isolation, and TTL are entirely the application's responsibility. The API itself doesn't manage any of it. You must guard against path traversal. Because it's client-side, ZDR scenarios work (though Covered Models still require 30-day retention, per the [data retention policy](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)).

**Managed Agents memory stores.** Per the [2026-04-23 announcement](https://claude.com/blog/claude-managed-agents-memory) and [official docs](https://platform.claude.com/docs/en/managed-agents/memory), beta `agent-memory-2026-07-22`. A memory store is a workspace-level collection of text files, mounted via `resources[]` at session creation (up to 8 per session) to `/mnt/memory/<slug>/`, where the agent reads and writes using standard file tools. `access` is either read_write or read_only. Each store can carry ≤4,096 characters of `instructions`.

Limits: individual entries ≤100 kB, ≤2,000 entries per store. Versions are immutable, retained for 30 days, with redact but no restore. Cross-agent sharing: mount one store to multiple sessions using read_only + read_write combinations.

**Dreaming.** Per the [2026-05-19 research preview](https://claude.com/blog/new-in-claude-managed-agents), Managed Agents Dreaming schedules background reviews of sessions and stores, producing consolidated new stores that can be auto-applied or human-reviewed.

Pricing: tokens plus $0.08/session-hour, no separate memory SKU. Not eligible for ZDR or HIPAA BAA.

## Google: Vectors with Topic Classification

Google's memory API takes the "platform extracts, classifies, and retrieves for you" fully managed approach — the philosophical opposite of Anthropic's client-side design.

**Vertex AI Agent Engine Memory Bank.** Per the [official docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview), Preview launched 2025-07-08, GA (Sessions + Memory Bank) 2025-12-16, billing started 2026-01-28. Writes go through LLM extraction (`generate_memories`) plus consolidation; reads use `retrieve_memories` (similarity search or full-scope retrieval). `scope` is a dict for partitioning.

Three managed topic categories are built in: `USER_PERSONAL_INFO`, `USER_PREFERENCES`, `KEY_CONVERSATION_DETAILS`, plus custom topics. Supports revisions. Tenant isolation uses IAM Conditions; compliance covers VPC-SC, CMEK, data residency, and HIPAA.

Pricing has had two generations: from 2026-01-28 to 2026-08-31, it was $0.25/1K memories/month for storage plus $0.50/1K retrievals (LLM costs separate). Per the [pricing effective 2026-09-01](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing), it shifted to Agent Storage at $0.30/GiB-month, reads at every 3M operations counting as 1 Agent Compute vCPU-hr ($0.085), writes at every 1M operations counting as 1 vCPU-hr ($0.085), with generation and embedding tokens billed per model SKU.

**ADK memory services.** Per the [official docs](https://adk.dev/sessions/memory/), the Agent Development Kit offers three memory services: `InMemoryMemoryService` (development), `VertexAiMemoryBankService` (backed by Memory Bank), and `VertexAiRagMemoryService` (backed by RAG Engine). At the tools level, `load_memory` (on-demand) and `preload_memory` (automatic) are available.

**Consumer-side note.** Gemini app has Saved info (explicit) and Memory of past chats (Personal Intelligence, requires Keep Activity, 18+). The Gemini API's Interactions API (2026-06 GA, `previous_interaction_id`, paid retention 7–55 days) is conversation state, not long-term memory.

## AWS: Events Plus Strategy Pipelines

AWS AgentCore Memory has the most granular conceptual split among the five — short-term through events, long-term through pluggable strategies, tenant isolation through namespaces.

**Short-term: Events.** Per the [official docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html), Preview 2025-07-16, GA 2025-10-13 (9 regions). `CreateEvent` is keyed by `actorId` + `sessionId`. The minimum `eventExpiryDuration` contradicts itself across official docs — the [CreateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html) Valid Range says 3–365 days, while the [UpdateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateMemory.html) field description says "between 7 and 365 days" (same-page Valid Range still says 3). Additionally, expiry is set at write time and won't retroactively apply to existing events (per the [developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-create-a-memory-store.html)).

**Long-term: Strategies.** Up to 6 strategies per store: semantic, user preference, summary, and episodic (from 2025-12, including reflection). Each strategy has a built-in prompt that can be overridden, or you can go self-managed. Writes flow through an async pipeline (extraction → consolidation); reads use `RetrieveMemoryRecords` for semantic retrieval.

**Namespaces and isolation.** Namespace template `{actorId}/{sessionId}/{memoryStrategyId}` plus up to 5 custom keys. Tenant isolation uses IAM condition keys. All data encrypted, CMK optional.

**Pricing.** Per the [official pricing page](https://aws.amazon.com/bedrock/agentcore/pricing): events $0.25/1K, long-term storage — built-in strategies $0.75/1K records/month, override or self-managed $0.25/1K records/month, retrieval $0.50/1K queries.

## Microsoft: The Context Provider Abstraction

Microsoft's memory design splits into two tracks: the open-source Microsoft Agent Framework (MAF) and the managed Azure AI Foundry Agent Service.

**MAF context providers.** Per the [official docs](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/context-providers), memory uses a **context provider** abstraction. In C#: `AIContextProvider.ProvideAIContextAsync / StoreAIContextAsync`; in Python: `before_run / after_run`. Built-in providers include `InMemoryHistoryProvider` and `FileMemoryProvider` (`file_memory_*` tools, default path `{cwd}/agent-file-memory`, per-user scope across sessions). The integration ecosystem is rich — Cosmos DB, Mem0, Neo4j, Redis, and Azure AI Search all have official or community providers.

MAF's design philosophy is "memory is a pluggable context provider" — the framework doesn't lock you into a storage backend. You can plug Mem0 or Redis in as your memory layer.

**Foundry Agent Service Memory.** Per the [official docs](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory) and [Build 2026 blog post](https://devblogs.microsoft.com/foundry/memory-build2026), public preview, API `2025-11-15-preview`. Three memory toggles: `user_profile_enabled`, `chat_summary_enabled`, and `procedural_memory_enabled` (from 2026-06; reportedly +5% on STATE-Bench / Tau-Bench). `default_ttl_seconds` controls expiry. Writes flow through extraction → consolidation → retrieval. Scope uses `{{$userId}}` or Entra `tid_oid` for isolation. Quotas: 100 scopes/store, 10,000 memories/scope. The Portal has a CRUD UI. No separate memory SKU.

Microsoft is the only one among the five that explicitly makes procedural memory a first-class toggle — every other platform's procedural memory is tucked into files or skills.

## Capability Matrix

Developer APIs only (excludes consumer products). Comparison dimensions are based on the six design axes from order 1 in this series.

| Dimension | OpenAI SDK sandbox | Anthropic Managed Agents | Google Memory Bank | AWS AgentCore | Microsoft Foundry |
|---|---|---|---|---|---|
| **Storage format** | Files (Markdown) | Files (text in stores) | Vectors + LLM consolidation | Events + vectors | Extraction → consolidation → vectors |
| **Write timing** | Two-stage after run | Agent file tools + Dreaming | Explicit `generate` (async) | Async strategies | Async pipeline |
| **Read method** | Summary injection + agent reads | Mounted directory, agent reads | Semantic retrieval / preload | Semantic retrieval | Retrieval |
| **Cross-session** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Cross-agent sharing** | group id | Multi-session mount to same store | scope | namespace | scope |
| **Forgetting** | None built-in | Versions retained 30 days | TTL (unconfirmed) | Event expiry 3–365 days | `default_ttl_seconds` |
| **Tenant isolation** | App-managed | Workspace | scope + IAM Conditions | namespace + IAM condition key | Entra `tid_oid` |
| **Visible / editable** | Files | API / redact | Console UI | API | Portal CRUD |
| **Compliance** | ZDR (`store=false`) | No ZDR/HIPAA | VPC-SC / CMEK / HIPAA | CMK / encryption | Entra / Azure Policy |
| **Pricing** | Included in sandbox | $0.08/session-hr | $0.30/GiB-mo + read/write per vCPU-hr | $0.25–0.75/1K records/mo + $0.50/1K retrievals | No separate SKU |

## Which One to Pick

No single platform dominates across the board. The choice depends on which cloud your agent architecture already lives on and how much control you need.

**You want to own the format and storage of memory** → Anthropic memory tool or OpenAI sandbox memory. Both treat memory as files — human-readable, editable, git-friendly. Anthropic goes further: the API is entirely client-side, never touching your storage.

**You want fully managed, don't want to handle storage** → Google Memory Bank or AWS AgentCore. Both offer complete extraction → consolidation → retrieval pipelines. Google's managed topics fit consumer personalization scenarios; AWS's pluggable strategies suit use cases mixing multiple memory types.

**You're already in the Azure ecosystem and need Entra integration** → Microsoft Foundry. Three memory toggles are the most intuitive, and procedural memory is the only first-class citizen.

**You don't want to be locked to any platform** → MAF's context provider abstraction, backed by an open-source memory framework (Mem0, LangGraph Store, Zep). The next post covers open-source options in detail.

## The Big Picture

The five platforms diverge on a fundamental question: **who extracts memories, where do they live, and in what format.**

OpenAI and Anthropic chose "files as memory" — human-readable, version-controllable, prompt-cache-friendly. Google and AWS chose "fully managed" — auto-extraction, vector retrieval, built-in tenant isolation and compliance. Microsoft plays both sides — MAF is open and pluggable, Foundry provides managed hosting.

The 2026 trend is convergence: OpenAI sandbox memory's two-stage write is effectively auto-extraction, just with results stored as files rather than vectors; Google and AWS are exposing more customizable prompts. But the core tradeoff won't disappear — do you want "I can see what my memory looks like" or "I don't want to manage how memory is stored."

Next: Open-source Memory Framework Selection — choices free from platform lock-in.

## References

- [OpenAI — Agents SDK Sessions docs](https://openai.github.io/openai-agents-python/sessions/)
- [OpenAI — Agents SDK Sandbox Memory docs](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [OpenAI — Responses API Compaction docs](https://developers.openai.com/api/docs/guides/compaction)
- [OpenAI — The next evolution of the Agents SDK (2026-04-15)](https://openai.com/index/the-next-evolution-of-the-agents-sdk)
- [OpenAI — Building reliable agents: memory & compaction (cookbook, 2026-05-01)](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [OpenAI — Dreaming: Better memory for ChatGPT (2026-06-04)](https://openai.com/index/chatgpt-memory-dreaming)
- [Anthropic — Memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Anthropic — Context editing docs](https://platform.claude.com/docs/en/build-with-claude/context-editing)
- [Anthropic — Compaction docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
- [Anthropic — Managed Agents Memory docs](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic — Claude Managed Agents memory announcement (2026-04-23)](https://claude.com/blog/claude-managed-agents-memory)
- [Anthropic — API data retention policy](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [Google — Vertex AI Agent Engine Memory Bank overview](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview)
- [Google — ADK Memory docs](https://adk.dev/sessions/memory/)
- [Google — Gemini Enterprise Agent Platform pricing (effective 2026-09-01)](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing)
- [AWS — AgentCore Memory developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [AWS — AgentCore pricing](https://aws.amazon.com/bedrock/agentcore/pricing)
- [AWS — CreateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html)
- [Microsoft — Agent Framework Context providers](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/context-providers)
- [Microsoft — Foundry Agent Service: What is memory](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)
- [Microsoft — Memory at Build 2026](https://devblogs.microsoft.com/foundry/memory-build2026)
- In-series: [Four Types of Memory and Six Design Axes](/posts/ai/2026-09-19-agent-memory-taxonomy)
- In-series: Open-source Memory Framework Selection (series order 5, forthcoming)
