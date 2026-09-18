---
title: "五朵雲的記憶 API：OpenAI、Anthropic、Google、AWS、Microsoft 怎麼讓 Agent 記住事情"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, platform-api, openai, anthropic, google-cloud, aws-bedrock, microsoft-foundry, context-engineering]
series:
  name: "AI Agent 記憶工程"
  order: 4
lang: zh-TW
tldr: "五家雲平台都在 2025–2026 年推出 agent 記憶 API，但設計哲學分歧明顯：OpenAI 把記憶寫成檔案、Anthropic 把記憶掛載成目錄、Google 用向量加主題分類、AWS 用事件加策略管線、Microsoft 用 context provider 抽象。定價從免費到 $0.75/千筆/月不等，租戶隔離從「應用端自己來」到「IAM 一等公民」都有。"
description: "拆解 OpenAI Agents SDK、Anthropic Memory Tool 與 Managed Agents、Google Memory Bank、AWS AgentCore Memory、Microsoft MAF 與 Foundry 五家雲平台的 agent 記憶 API 設計、能力與定價。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-cloud-platform-memory-apis-en)

你要在自己的 agent 裡加記憶，不想從零造輪子。五家主要雲平台在 2025–2026 年都推出了記憶相關的 API，但「記憶」在每家手上長得不一樣——有的給你一個檔案系統讓 agent 自己讀寫，有的幫你自動抽取事實再用向量檢索，有的只給你一個 session 物件讓你自己決定怎麼存。

這篇把五家的開發者記憶 API 拆開來看。消費端的記憶功能（ChatGPT 的 Memory、Claude.ai 的 Memory）只簡要帶過——那些是產品功能，不是你能呼叫的 API。

如果你還不清楚 working / episodic / semantic / procedural 這四種記憶的差別，先看本系列的〈[四種記憶與六個設計軸](/posts/ai/2026-09-19-agent-memory-taxonomy)〉。

## OpenAI：檔案即記憶

OpenAI 的記憶設計有一條清楚的演化線：從 Responses API 的對話狀態，到 Agents SDK 的 session 管理，再到 sandbox memory 的「把教訓寫成檔案」。

**Responses API 狀態與 compaction。** 最基礎的一層是 `previous_response_id` 串接——每次請求帶上前一筆的 ID，API 自動把歷史 prepend 進去。問題是先前的 input tokens 全部重新計費。2025-12-11 推出 client-side compaction（`POST /responses/compact`），2026-02-10 升級為伺服端 compaction（`context_management: [{type: "compaction", compact_threshold: N}]`），GPT-5.4 在 2026-03-05 隨 1M context 提供原生支援。依[官方文件](https://developers.openai.com/api/docs/guides/compaction)，`store` 預設 true，Response 保存 30 天，ZDR 場景用 `store=false`。

**Agents SDK Sessions。** 依[官方文件](https://openai.github.io/openai-agents-python/sessions/)，Session 是「逐字稿倉庫」：runner 執行前 prepend 歷史、執行後存新 item。內建多種後端——`SQLiteSession`、`OpenAIConversationsSession`（伺服端 `conversation_id`）、`OpenAIResponsesCompactionSession`（自動/手動 compaction），以及社群維護的 Redis、SQLAlchemy、MongoDB、Dapr、`EncryptedSession`（加密 + TTL）。遺忘只有 TTL 或 `clear_session`；多租戶靠 `session_id` 慣例，無內建 ACL。

**Sandbox memory：把教訓蒸餾成檔案。** 依 [2026-04-15 公告](https://openai.com/index/the-next-evolution-of-the-agents-sdk)與[官方文件](https://openai.github.io/openai-agents-python/sandbox/memory/)，`openai-agents>=0.14.0` 引入的 sandbox memory 是 OpenAI 記憶設計最清楚的表態：記憶就是 sandbox 工作區裡的檔案。布局固定——`memories/memory_summary.md`（run 開始注入）、`MEMORY.md`（索引）、`rollout_summaries/`、`raw_memories/`、`skills/`。寫入在 run 結束後分兩階段（抽取 → 整併），由 `MemoryGenerateConfig` 控制；讀取走 progressive disclosure。分組層級：conversation → session → group → run。持久化交給 sandbox 掛載儲存（S3 / GCS / Azure Blob / R2）。

值得注意的是，這套檔案布局跟 Codex 的 Memories 完全一樣——OpenAI 把「檔案即記憶」從產品推到了 SDK。依 [OpenAI cookbook（2026-05-01）](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)的一句話總結：「compaction 幫這次 run 繼續，memory 幫下次 run 有起點，人審過的 memo 才是 source of truth。」

**消費端帶過。** ChatGPT Memory 分兩層：Saved memories（顯式或模型主動存的離散事實）加 Chat-history reference。2026-06-04 的 [Dreaming](https://openai.com/index/chatgpt-memory-dreaming) 加入背景跨對話整併與可編輯的 memory summary 頁，官方評測事實回憶從 67.9% 提升到 82.8%。但這些是消費端功能，開發者 API 目前沒有直接呼叫 Dreaming 的介面。

## Anthropic：記憶是掛載的目錄

Anthropic 的記憶 API 分三層：底層的 context editing、中層的 memory tool、頂層的 Managed Agents memory store。設計哲學是「記憶是 client-side 的檔案操作」——不是平台幫你抽取，是 Claude 自己決定要存什麼、怎麼存。

**Context editing 與 compaction。** 依[官方文件](https://platform.claude.com/docs/en/build-with-claude/context-editing)，context editing（beta `context-management-2025-06-27`）提供兩種清除器：`clear_tool_uses_20250919`（觸發閾值 100k tokens、保留最近 3 個、可用 `exclude_tools` 排除特定工具）和 `clear_thinking_20251015`。伺服端執行並回報 `applied_edits`。搭配 memory tool 使用時，Claude 會在清除前收到「先存進記憶」的系統警示。

Compaction（beta `compact-2026-01-12`）在 `input_tokens` 達到預設 150,000（最低可設 50,000）時觸發，輸出 `compaction` block 取代先前所有內容。依[官方文件](https://platform.claude.com/docs/en/build-with-claude/compaction)，client-side SDK compaction 已被標記為 deprecated。

**Memory tool。** 依[官方文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)，memory tool 是一個 client-side 的工具定義（`{"type": "memory_20250818", "name": "memory"}`，Claude 4+）。Claude 對 `/memories` 目錄下發出 `view / create / str_replace / insert / delete / rename` 指令，由**應用端**執行——Anthropic 不碰你的儲存。自動注入的系統指示要求 Claude「做任何事前先看記憶目錄，並假設隨時會被中斷」。SDK 提供 `BetaLocalFilesystemMemoryTool` 和 `BetaAbstractMemoryTool` 兩個 helper。

關鍵設計選擇：儲存、租戶隔離、TTL 全部是應用端責任，API 本身不管。必須防 path traversal。因為是 client-side，ZDR 場景可用（但 Covered Models 仍需 30 天保留，依 [API 資料保留政策](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)）。

**Managed Agents memory stores。** 依 [2026-04-23 公告](https://claude.com/blog/claude-managed-agents-memory)與[官方文件](https://platform.claude.com/docs/en/managed-agents/memory)，beta `agent-memory-2026-07-22`。memory store 是 workspace 層級的文字文件集合，session 建立時以 `resources[]` 掛載（每 session 最多 8 個）到 `/mnt/memory/<slug>/`，agent 用標準檔案工具讀寫。`access` 分 read_write 和 read_only。每個 store 可附 ≤4,096 字元的 `instructions`。

上限：單筆 ≤100 kB、每 store ≤2,000 筆。版本不可變、保留 30 天，有 redact 但無 restore。跨 agent 共享的做法：一個 store 掛到多個 session，搭配 read_only + read_write 的組合。

**Dreaming。** 依 [2026-05-19 research preview](https://claude.com/blog/new-in-claude-managed-agents) 公告，Managed Agents 的 Dreaming 是排程回顧 session 與 store，產出整理過的新 store，可自動套用或人工審核。

定價：tokens 加 $0.08/session-hour，無獨立記憶 SKU。不適用 ZDR 或 HIPAA BAA。

## Google：向量加主題分類

Google 的記憶 API 走的是「平台幫你抽取、分類、檢索」的全託管路線，跟 Anthropic 的 client-side 哲學完全相反。

**Vertex AI Agent Engine Memory Bank。** 依[官方文件](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview)，Preview 2025-07-08，GA（Sessions + Memory Bank）2025-12-16，2026-01-28 起計費。寫入走 LLM 抽取（`generate_memories`）加整併；讀取走 `retrieve_memories`（相似度搜尋或整個 scope）。`scope` 用 dict 做分區。

內建 managed topics 三類：`USER_PERSONAL_INFO`、`USER_PREFERENCES`、`KEY_CONVERSATION_DETAILS`，外加自訂主題。支援 revisions。租戶隔離用 IAM Conditions，合規支援 VPC-SC、CMEK、data residency、HIPAA。

定價有兩代：2026-01-28 至 2026-08-31 是每月儲存 $0.25/千筆 + 檢索 $0.50/千次（LLM 費用另計）。依 [2026-09-01 起的新定價](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing)，改為 Agent Storage $0.30/GiB-月，讀取每 300 萬次計 1 Agent Compute vCPU-hr（$0.085），寫入每 100 萬次計 1 vCPU-hr（$0.085），生成與 embedding 的 tokens 按各模型 SKU 另計。

**ADK memory services。** 依[官方文件](https://adk.dev/sessions/memory/)，Agent Development Kit 提供三種 memory service：`InMemoryMemoryService`（開發用）、`VertexAiMemoryBankService`（接 Memory Bank）、`VertexAiRagMemoryService`（接 RAG Engine）。tools 層面有 `load_memory`（按需）和 `preload_memory`（自動）。

**消費端帶過。** Gemini app 有 Saved info（顯式）和 Memory of past chats（Personal Intelligence，需 Keep Activity 開啟）。Gemini API 的 Interactions API（2026-06 GA，`previous_interaction_id`，付費保留 7–55 天）是對話狀態而非長期記憶。

## AWS：事件加策略管線

AWS 的 AgentCore Memory 是五家中概念拆分最細的——短期靠 events，長期靠可插拔的 strategies，租戶隔離靠 namespaces。

**短期：Events。** 依[官方文件](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)，Preview 2025-07-16，GA 2025-10-13（9 個 region）。`CreateEvent` 以 `actorId` + `sessionId` 定位。`eventExpiryDuration` 的下限在官方文件裡互相衝突——[CreateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html) 的 Valid Range 是 3–365 天，但 [UpdateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateMemory.html) 的欄位說明寫「between 7 and 365 days」（同頁 Valid Range 仍是 3）。此外，過期時間在寫入當下套用，事後改設定不回溯（依[開發者指南](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-create-a-memory-store.html)）。

**長期：Strategies。** 每個 store 最多 6 個 strategy：semantic、user preference、summary、episodic（2025-12 起，含 reflection）。每種 strategy 有內建 prompt 可覆寫，或走 self-managed 自己處理。寫入走非同步管線（抽取 → 整併），讀取用 `RetrieveMemoryRecords` 做語意檢索。

**Namespaces 與隔離。** namespace 模板 `{actorId}/{sessionId}/{memoryStrategyId}` 加上最多 5 個自訂 key。租戶隔離用 IAM condition key。一律加密，可選 CMK。

**定價。** 依[官方定價頁](https://aws.amazon.com/bedrock/agentcore/pricing)：events $0.25/千筆，長期儲存——內建 strategy $0.75/千筆/月、override 或 self-managed $0.25/千筆/月，檢索 $0.50/千次。

## Microsoft：Context Provider 抽象

Microsoft 的記憶設計分兩條線：開源的 Microsoft Agent Framework（MAF）和託管的 Azure AI Foundry Agent Service。

**MAF context providers。** 依[官方文件](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/context-providers)，記憶走 **context provider** 抽象。C# 是 `AIContextProvider.ProvideAIContextAsync / StoreAIContextAsync`，Python 是 `before_run / after_run`。內建 `InMemoryHistoryProvider` 和 `FileMemoryProvider`（`file_memory_*` 工具、預設路徑 `{cwd}/agent-file-memory`、per-user scope 跨 session）。整合生態豐富——Cosmos DB、Mem0、Neo4j、Redis、Azure AI Search 都有官方或社群 provider。

MAF 的設計哲學是「記憶是可插拔的 context provider」——框架不鎖定儲存後端，你可以把 Mem0 或 Redis 當成記憶層插進來。

**Foundry Agent Service Memory。** 依[官方文件](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)與 [Build 2026 部落格](https://devblogs.microsoft.com/foundry/memory-build2026)，public preview，API `2025-11-15-preview`。三種記憶開關：`user_profile_enabled`、`chat_summary_enabled`、`procedural_memory_enabled`（2026-06 起；官方稱 STATE-Bench / Tau-Bench 約 +5%）。`default_ttl_seconds` 控制過期。寫入走抽取 → 整併 → 檢索管線。scope 用 `{{$userId}}` 或 Entra `tid_oid` 隔離。配額：100 scopes/store、10,000 memories/scope。Portal 有 CRUD UI。無獨立 SKU。

Microsoft 是五家中唯一明確把 procedural memory 做成一等開關的——其他家的 procedural memory 都藏在檔案或 skill 裡。

## 能力矩陣

以下只列開發者 API（不含消費端產品），比較維度基於本系列 order 1 的六個設計軸。

| 維度 | OpenAI SDK sandbox | Anthropic Managed Agents | Google Memory Bank | AWS AgentCore | Microsoft Foundry |
|---|---|---|---|---|---|
| **儲存形式** | 檔案（Markdown） | 檔案（store 內文字文件） | 向量 + LLM 整併 | events + 向量 | 抽取 → 整併 → 向量 |
| **寫入時機** | run 結束後兩階段 | agent 用檔案工具 + Dreaming | 顯式 `generate`（非同步） | 非同步 strategy | 非同步管線 |
| **讀取方式** | 摘要注入 + agent 主動讀 | 掛載目錄，agent 主動讀 | 語意檢索 / preload | 語意檢索 | 檢索 |
| **跨 session** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **跨 agent 共享** | group id | 多 session 掛載同 store | scope | namespace | scope |
| **遺忘機制** | 無內建 | 版本保留 30 天 | TTL（待確認） | 事件過期 3–365 天 | `default_ttl_seconds` |
| **租戶隔離** | 應用端自管 | workspace | scope + IAM Conditions | namespace + IAM condition key | Entra `tid_oid` |
| **可見可編輯** | 檔案 | API / redact | Console UI | API | Portal CRUD |
| **合規** | ZDR（`store=false`） | 不適用 ZDR/HIPAA | VPC-SC / CMEK / HIPAA | CMK / 加密 | Entra / Azure Policy |
| **定價** | 含在 sandbox 費用 | $0.08/session-hr | $0.30/GiB-月 + 讀寫按 vCPU-hr | $0.25–0.75/千筆/月 + $0.50/千次檢索 | 無獨立 SKU |

## 選哪家

沒有一家是全面領先的。選擇取決於你的 agent 架構已經在哪朵雲上，以及你需要多少控制權。

**你想自己掌控記憶的格式和儲存** → Anthropic memory tool 或 OpenAI sandbox memory。兩家都是「記憶就是檔案」，你看得到、改得動、進得了 git。Anthropic 更極端——API 完全 client-side，連儲存都不碰。

**你想平台全託管、不想管儲存** → Google Memory Bank 或 AWS AgentCore。兩家都有完整的抽取 → 整併 → 檢索管線。Google 的 managed topics 適合消費端個人化場景；AWS 的 strategy 可插拔性更強，適合需要混用多種記憶策略的場景。

**你已經在 Azure 生態、需要跟 Entra 整合** → Microsoft Foundry。三種記憶開關最直覺，procedural memory 是唯一的一等公民。

**你不想被任何一家鎖定** → MAF 的 context provider 抽象，搭配開源記憶框架（Mem0、LangGraph Store、Zep）當後端。下一篇會詳細比較開源選項。

## 整體來說

五家的分歧在於一個根本問題：**記憶該由誰抽取、存在哪裡、格式是什麼。**

OpenAI 和 Anthropic 選了「檔案即記憶」——人可讀、可版本控制、與 prompt cache 相容。Google 和 AWS 選了「平台全託管」——自動抽取、向量檢索、有內建的租戶隔離和合規。Microsoft 兩邊都做——MAF 開放插拔，Foundry 提供託管。

2026 年的趨勢是這兩派在靠近：OpenAI sandbox memory 的兩階段寫入其實就是自動抽取，只是結果存成檔案而非向量；Google 和 AWS 開始暴露更多自訂 prompt 的介面。但核心取捨不會消失——你要「我看得到記憶長什麼樣」還是「我不想管記憶怎麼存」。

下一篇：〈開源記憶框架選型〉——不被平台綁定的選擇。

## 參考資料

- [OpenAI — Agents SDK Sessions 官方文件](https://openai.github.io/openai-agents-python/sessions/)
- [OpenAI — Agents SDK Sandbox Memory 官方文件](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [OpenAI — Responses API Compaction 官方文件](https://developers.openai.com/api/docs/guides/compaction)
- [OpenAI — The next evolution of the Agents SDK（2026-04-15）](https://openai.com/index/the-next-evolution-of-the-agents-sdk)
- [OpenAI — Building reliable agents: memory & compaction（cookbook，2026-05-01）](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [OpenAI — Dreaming: Better memory for ChatGPT（2026-06-04）](https://openai.com/index/chatgpt-memory-dreaming)
- [Anthropic — Memory tool 官方文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Anthropic — Context editing 官方文件](https://platform.claude.com/docs/en/build-with-claude/context-editing)
- [Anthropic — Compaction 官方文件](https://platform.claude.com/docs/en/build-with-claude/compaction)
- [Anthropic — Managed Agents Memory 官方文件](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic — Claude Managed Agents memory 公告（2026-04-23）](https://claude.com/blog/claude-managed-agents-memory)
- [Anthropic — API 資料保留政策](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [Google — Vertex AI Agent Engine Memory Bank 概觀](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview)
- [Google — ADK Memory 官方文件](https://adk.dev/sessions/memory/)
- [Google — Gemini Enterprise Agent Platform 定價（2026-09-01 起）](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing)
- [AWS — AgentCore Memory 開發者指南](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [AWS — AgentCore 定價](https://aws.amazon.com/bedrock/agentcore/pricing)
- [AWS — CreateMemory API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html)
- [Microsoft — Agent Framework Context providers](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/context-providers)
- [Microsoft — Foundry Agent Service: What is memory](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory)
- [Microsoft — Memory at Build 2026](https://devblogs.microsoft.com/foundry/memory-build2026)
- 站內系列：[四種記憶與六個設計軸](/posts/ai/2026-09-19-agent-memory-taxonomy)
- 站內系列：開源記憶框架選型（同系列 order 5，待發佈）
