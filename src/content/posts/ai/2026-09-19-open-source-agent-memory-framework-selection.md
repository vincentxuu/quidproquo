---
title: "開源 Agent 記憶框架選型：七家拆解與決策指南"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, mem0, zep, graphiti, letta, langgraph, llamaindex, open-source]
series:
  name: "AI Agent 記憶工程"
  order: 5
lang: zh-TW
tldr: "七套開源記憶框架分佈在「向量抽取」到「檔案系統」的光譜上：Mem0 一行 add() 自動抽取、Graphiti 用 bi-temporal 知識圖保留矛盾歷史、Letta 讓 agent 自己編輯釘在 system prompt 的 blocks、LangGraph 用 namespace Store 做跨 agent 共享、LlamaIndex 靠 block 優先級控制截斷順序、Cognee 走三種儲存混合管線、Supermemory 強調時態向量圖引擎。這篇整理各自的儲存形式、寫入與遺忘機制、租戶隔離、benchmark 數字，再按四種常見場景給選型建議。"
description: "比較 Mem0、Zep/Graphiti、Letta、LangGraph、LlamaIndex Memory、Cognee、Supermemory 七套開源 agent 記憶框架的設計取捨，含能力矩陣、設計哲學光譜定位與四種場景選型決策樹。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection-en)

你的 agent 需要跨 session 的長期記憶，但不想被某朵雲綁死。2026 年的開源選擇比兩年前多了很多——也亂了很多。這篇把七套主要框架按同一組判準拆開比較，最後依四種常見場景給選型建議。

如果你還不確定「記憶」在 agent 系統裡指什麼，建議先看本系列的 order 1：四種記憶與六個設計軸。如果你想知道各家雲平台的託管方案（Anthropic memory tool、OpenAI sandbox memory、Vertex AI Memory Bank、AWS AgentCore、Microsoft Foundry），那是本系列 order 4：五朵雲的記憶 API。

## 設計哲學光譜上的定位

開始比較之前，先看這七家落在哪裡。依 [Anthropic 的 harness 系列文](https://www.anthropic.com/engineering/harness-design-long-running-apps) 和 [LangChain 的 context engineering 文](https://blog.langchain.com/context-engineering-for-agents/) 建立的光譜：

```
檔案即記憶（人可讀、git 可管）                    全自動抽取的向量 / 圖記憶
◄────────────────────────────────────────────────────────────────────────►
        Letta MemFS          LangGraph Store    LlamaIndex     Mem0    Supermemory     Graphiti    Cognee
        (git-backed)         (namespace KV)     (blocks+SQL)   (向量)  (時態向量圖)     (bi-temporal KG)  (三儲存混合)
```

越左邊，人越看得懂、改得動；越右邊，自動化程度越高但中間態越不透明。沒有哪邊「比較好」——取決於你的場景需要人審核還是全自動。

## Mem0：一行 `add()` 的自動抽取

[Mem0](https://mem0.ai)（Apache-2.0，v2.0.19，2026-08-24）是目前整合最廣的開源記憶層。依 Mem0 [ECAI 2025 論文](https://arxiv.org/abs/2504.19413)，核心流程是：對話進來 → LLM 抽取值得保留的事實 → 存進向量 store → 下次用語意 + BM25 + entity 混合檢索取回。

**儲存**：向量為主。2026 版改為單趟 ADD-only 抽取（[OSS v2→v3 遷移文件](https://docs.mem0.ai/migration/oss-v2-to-v3)），graph memory 已從開源版移除，改為 Platform 內建。

**寫入**：`add(messages, user_id=..., agent_id=..., infer=True)` 一行搞定，LLM 自動決定抽什麼。

**遺忘**：`update` / `delete`、`expiration_date`；recency decay 只影響檢索排名，不會自動刪除。沒有 Ebbinghaus 式衰減。

**租戶隔離**：`user_id` / `agent_id` / `app_id` 是應用端慣例，**沒有內建 ACL**。Platform 版另有 org / project 層級，SOC 2 Type I、HIPAA-ready。

**Benchmark**：論文 LoCoMo 66.9（Mem0）/ 68.4（Mem0-g）vs full-context 72.9；2026 研究頁自報 LoCoMo 92.5、LongMemEval 94.4（vendor 自報，judge 與 backbone 不同，不能直接比較）。

**整合生態**：OpenMemory MCP、AWS AgentCore 整合、LangGraph / LlamaIndex adapter、Claude Code / Cursor / Codex plugins。$24M 募資（2025-10-28）。

適合快速在現有 agent 上加「記得使用者偏好」功能。不適合需要時間推理或矛盾歷史的場景。完整拆解見本系列 [order 6：Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory)。

## Zep / Graphiti：時間是一等公民

[Graphiti](https://github.com/getzep/graphiti)（Apache-2.0，v0.29.3，2026-07-27）是開源引擎；Zep Cloud 是基於它的商業服務（SOC 2 Type II、HIPAA）。Zep Community Edition 已於 2025-04-02 停止。

**儲存**：**bi-temporal 知識圖**——每條 edge 有 `created_at` / `expired_at` / `valid_at` / `invalid_at`。矛盾的事實不會被覆蓋或刪除，而是被標記為「在某個時間點失效」。依 [Graphiti 論文](https://arxiv.org/abs/2501.13956)，這讓系統能回答「他上個月住哪」這類時間限定的問題。

**寫入**：Zep Cloud 自動 ingest thread 訊息（<10 秒延遲）；Graphiti 開源版需顯式 `add_episode` / `add_triplet`。

**讀取**：`thread.get_user_context` 回傳 Context Block（USER_SUMMARY + 帶日期區間的 FACTS），P95 延遲 <200 ms。Graphiti 另有 hybrid search。

**遺忘**：時間維度失效，不是物理刪除——這是跟 Mem0 最大的設計差異。想查「什麼時候開始不對」的場景，Graphiti 保留了證據。

**租戶**：account → projects → users / graphs；Graphiti `group_id` 由應用端強制。

**Benchmark**：論文 DMR 94.8% vs MemGPT 93.4%；LongMemEval 最高 +18.5%、延遲 −90%；行銷頁 LoCoMo 94.7（vendor 自報）。

適合需要「時間推理」的場景：客服歷史、醫療記錄、合約變更追蹤。不適合只需要簡單偏好記錄的輕量場景。完整拆解見站內 [Zep 介紹](/posts/ai/2026-08-22-zep-agent-memory)。

## Letta：agent 自己管自己的記憶

[Letta](https://github.com/letta-ai/letta)（Apache-2.0，v0.16.8，2026-05-14）從 [MemGPT 論文](https://arxiv.org/abs/2310.08560) 演化而來，核心理念是把記憶管理做成 agent 自己的工具——模型用 `memory_replace` / `memory_insert` / `memory_rethink` 主動編輯釘在 system prompt 裡的 core memory blocks。

**第一代**（MemGPT 時期）：core blocks（常駐 system prompt）+ archival（pgvector 長期）+ recall（對話歷史）。

**第二代**（2026-03-16 [「Letta's Next Phase」](https://www.letta.com/blog)）：Letta Code 成旗艦產品。legacy memory tools 被 **git-backed Context Repositories / MemFS**（2026-02-12）取代。sleep-time compute 演化為 **Dreaming** 背景反思 subagent。

**跨 agent**：共享 blocks、Conversations API（2026-01-21）、共享 archive。這是少數原生支援多 agent 記憶共享的框架。

**遺忘**：block 編輯（agent 自己改）、compaction、git revert。git-backed 意味著記憶有完整版本歷史。

**Benchmark**（vendor 自報）：Letta Filesystem 74.0% LoCoMo（GPT-4o-mini）vs Mem0 68.5%。

**定價**：Free / Pro $20 / API $20 + $0.10 per active agent。

適合需要 agent 自主管理記憶、且希望記憶進 git 可審可回溯的場景。學習曲線比 Mem0 陡——你需要理解 blocks / archival / recall 的分工。完整拆解見站內 [Letta 介紹](/posts/ai/2026-08-22-letta-memgpt-agent-memory)。

## LangGraph / LangMem：框架原生的記憶層

[LangGraph](https://docs.langchain.com/oss/python/langgraph/persistence)（MIT，v1.2.11，2026-08-11）是 LangChain 生態的 agent orchestration 層，記憶不是獨立產品而是框架的一部分。

**短期**：**checkpointer**（thread state）。後端可選 InMemory / Sqlite / Postgres / MongoDB / Redis（Redis 原生 TTL）。每次 graph 執行完自動快照。

**長期**：**Store**（namespace tuple 的 put / get / search / delete）。`IndexConfig` 開啟語意檢索。Platform 版有 TTL 設定。

**記憶類型**：依 [LangChain 2024-10 部落格](https://blog.langchain.com/memory-for-agents/) 文件化為 semantic / episodic / procedural，並區分 hot-path（同步、在 graph 節點裡寫）與 background（非同步、用 `ReflectionExecutor`）寫入。

**LangMem**（MIT）：manage / search tools、memory managers、prompt optimizer。最後功能版 0.0.30（2025-10-27），實質進入維護模式。

**LangChain 1.x middleware**：`SummarizationMiddleware`、`ContextEditingMiddleware(ClearToolUsesEdit)`、`FilesystemMiddleware` + `CompositeBackend`（`/memories/` → StoreBackend）。

**LangSmith Fleet**（2026-01-13 GA）：記憶 = `memories/` 資料夾檔案，**每次更新須使用者核准**——這是 2026 年「寫入權交還人」趨勢的代表。

適合已在用 LangGraph 的團隊——不用額外引入 infra，checkpointer + Store 就夠。不適合 LangChain 生態以外的專案（鎖定程度高）。

## LlamaIndex Memory：block 優先級控制截斷

[LlamaIndex](https://github.com/run-llama/llama_index)（MIT，llama-index-core 0.14.24，2026-08-19）的 Memory 模組在 2025-05-08 改版。

**核心機制**：`Memory` 物件管理 `token_limit`（預設 30,000）、`chat_history_token_ratio`（0.7）、`token_flush_size`（3,000）。超額時最舊訊息以 `token_flush_size` 批次歸檔到各 block 的 `aput()`，讀取時 `get()` 把 blocks prepend 回 context。

**Blocks**（可組合）：
- `StaticMemoryBlock`：固定文字，永不截斷
- `FactExtractionMemoryBlock(max_facts=50)`：LLM 抽取事實，超過就 condense
- `VectorMemoryBlock(similarity_top_k=2)`：向量檢索
- **priority 0** 的 block 永不被截斷——這是控制「什麼一定要記住」的機制

**租戶**：只有 `session_id`，沒有 user / org 維度。

**整合**：2026 新增 `llama-index-memory-mem0`（1.0.0）和 `llama-index-memory-bedrock-agentcore`（2026-02-06），讓 Mem0 和 AgentCore 當 block 後端。

適合已在用 LlamaIndex 的 RAG 專案、想漸進加入記憶功能。租戶隔離弱——B2B 多租戶場景需要自己在 block 層加 user / org 維度。

## Cognee：三種儲存的混合管線

[Cognee](https://github.com/topoteretes/cognee)（Apache-2.0，v1.5.3，2026-08-23）是資料到 AI 記憶的 pipeline，用三種儲存混合：relational（LanceDB 預設）+ vector + graph（Kuzu 預設，可換 Neo4j / FalkorDB）。$7.5M seed（2026-02-19）。

**API**：`remember()` = add → cognify → improve；`recall()` / `search(SearchType)` 讀取；`forget()` 刪除。

**遺忘**：`forget()`、prune、feedback weights。沒有時間衰減。

**租戶**：users / tenants / roles，每 dataset 獨立 DB。比 Mem0 和 LlamaIndex 的隔離更完整。

**Benchmark**：HotPotQA F1 0.84（vendor 自報）；獨立評測 MemoryAgentBench 約 31–42，表現普通。

適合需要把非結構化文件轉成可查詢知識圖的場景（例如企業知識庫）。API 比 Mem0 複雜，pipeline 可客製但學習曲線高。完整拆解見站內 [Cognee 介紹](/posts/ai/2026-08-22-cognee-memory-engine)。

## Supermemory：時態向量圖引擎

[Supermemory](https://github.com/supermemoryai/supermemory)（MIT，server 0.0.8，2026-08-17）自稱「Temporal Vector-Graph Engine」，混合 chunks + memories（fact graph）+ profile 三層。$3M 募資（2025-10-06）。

**寫入**：`/v3/documents`、`/v4/memories`、SDK 自動擷取。Memory Router proxy（狀態不明——文件提到但社群反映不穩定）。

**遺忘**：比多數框架完整——`expiry`、矛盾版本化、`forgetAfter`、forget-matching、Memory Review。

**租戶**：`containerTag` 隔離。

**Benchmark**（vendor 自報，有爭議）：LongMemEval-S 84.6%（gpt-5）。

專案還早期，API 頻繁變動（v3 → v4 短時間內就換了）。適合願意承受早期風險、想要時態記憶但不想自己建圖的場景。

## 2026 新進者速覽

這些框架或新或小，但各有獨特的設計點：

| 名稱 | 授權 | 特點 | Benchmark（自報） |
|---|---|---|---|
| [Hindsight](https://arxiv.org/abs/2512.12818)（Vectorize） | MIT | 記憶從經驗中學習 | LongMemEval 91.4%、LoCoMo 89.61% |
| [EverMemOS](https://arxiv.org/abs/2601.02163)（EverMind） | — | MemCell → MemScene 分層，ACL 2026 | LoCoMo 93.05% |
| [MemOS](https://arxiv.org/abs/2507.03724)（MemTensor） | — | MemCube 抽象統一參數/激活/明文記憶 | LoCoMo +38.97% vs OpenAI memory |
| Mastra Observational Memory | — | 觀察式記憶 | LongMemEval ~95% |
| [OpenViking](https://github.com/nicepkg/OpenViking)（Volcengine） | AGPL | `viking://` 虛擬檔案系統，三層載入 | LoCoMo 80–83% |
| Memori（GibsonAI） | — | SQL-native 記憶 | — |
| Honcho（Plastic Labs） | AGPL | — | — |
| Redis Agent Memory Server | — | Redis 原生記憶服務 | — |

以上 benchmark 數字一律視為 vendor 自報。依 [Penfield Labs 2026-04 稽核](https://arxiv.org/abs/2507.05257)，LoCoMo 有 6.4% 答案本身是錯的、LLM judge 接受了 63% 的錯答，不同 backbone 分數差距可達 40 分。

## 能力矩陣（僅開源框架）

| 能力 | Mem0 | Zep/Graphiti | Letta | LangGraph | LlamaIndex | Cognee | Supermemory |
|---|---|---|---|---|---|---|---|
| 儲存形式 | 向量（graph 限平台） | bi-temporal KG | KV blocks + vector + git | KV store + vector index | SQL + facts + vector | relational + vector + graph | temporal vector-graph |
| 寫入時機 | `add()` 自動抽取 | 自動 ingest / 顯式 | agent 自我編輯 | 顯式 put / 背景 | 溢位 flush | 顯式 `remember()` | SDK 自動擷取 |
| 遺忘 | expiration + 排名 decay | 時間失效（保留歷史） | 編輯 / revert / git | TTL | FIFO + condense | forget / prune | expiry + 矛盾版本化 |
| 跨 agent | agent_id 共享 | graph 層 | shared blocks | namespace | 否 | dataset 層 | containerTag |
| 租戶隔離 | key 慣例（無 ACL） | project / group_id | identities | namespace | session_id | users / tenants / roles | containerTag |
| 使用者可見 | dashboard（Platform） | API | ADE / git | 無內建 UI | 無 | API | API |
| 成熟度 | 高（$24M、廣泛整合） | 中高（商業版穩定） | 中（轉型中） | 高（LangChain 生態） | 中（記憶模組較新） | 中（1.0 於 2026-06） | 低（早期） |

## 四種場景的選型建議

### 場景一：B2C 個人化（記住使用者偏好）

需求：快速加記憶、API 簡單、不需要複雜的時間推理。

**首選 Mem0**。一行 `add()` 就能開始，`user_id` 分區夠用。如果你已在用 LlamaIndex，`llama-index-memory-mem0` adapter 是最低侵入的接法。

注意：Mem0 的租戶隔離是應用端慣例，沒有內建 ACL。如果你的 B2C 場景涉及多租戶（例如 SaaS），需要自己在應用層加權限檢查。

### 場景二：B2B 多租戶（企業客戶各自獨立）

需求：嚴格的資料隔離、可審計、合規。

**首選 Cognee**（內建 users / tenants / roles + 每 dataset 獨立 DB）或 **Zep Cloud**（SOC 2 Type II、HIPAA、account → projects 層級）。Graphiti 開源版的 `group_id` 也行，但隔離邏輯由應用端負責。

避免只靠 Mem0 的 key 慣例或 LlamaIndex 的 `session_id`——這些在多租戶場景下太薄。

### 場景三：Coding agent plugin（給 Claude Code / Cursor / Codex 加記憶）

需求：本機執行、檔案式記憶、與 MCP 整合。

**首選 OpenViking**（`viking://` 虛擬檔案系統，支援 Claude Code / Cursor）或 **Mem0 OpenMemory MCP**（hosted）。Letta Code（v0.31.0）也支援但定位不同——它是完整的 agent runtime，不只是記憶外掛。

本系列 [order 7：OpenViking](/posts/ai/2026-08-22-openviking-agent-memory) 有完整拆解。

### 場景四：自建 agent 平台（需要完整記憶管理）

需求：短期 + 長期記憶、跨 agent 共享、記憶生命週期管理。

如果已在 LangChain 生態：**LangGraph checkpointer + Store** 是最自然的選擇，不用額外 infra。

如果不在 LangChain 生態：**Letta** 提供最完整的記憶生命週期（blocks + archival + recall + git-backed + Dreaming），但學習曲線最陡。

如果需要時間推理：**Graphiti** 的 bi-temporal 設計是獨一無二的——其他框架的「遺忘」是刪除或覆蓋，Graphiti 是標記失效並保留歷史。

## 不必自建向量/圖記憶層

2026 年的一個反直覺趨勢：大廠（OpenAI、Anthropic、Letta、LangChain）不約而同選擇 **Markdown 檔案 + 索引 + progressive disclosure** 作為記憶的承載形式（詳見本系列 order 9：2026 記憶系統往哪走）。向量/圖記憶沒有消失，但退居「可插拔後端」。如果你的場景不需要時間推理或複雜的知識圖，檔案 + 索引可能就夠了。

接下來兩篇分別拆解光譜兩端的代表方案——[Mem0（向量抽取派）](/posts/ai/2026-08-22-mem0-agent-memory) 和 [OpenViking（檔案系統派）](/posts/ai/2026-08-22-openviking-agent-memory)。

## 參考資料

- [Mem0 官方文件](https://docs.mem0.ai)
- [Mem0 GitHub](https://github.com/mem0ai/mem0)
- [Mem0 ECAI 2025 論文](https://arxiv.org/abs/2504.19413)
- [Mem0 OSS v2→v3 遷移文件](https://docs.mem0.ai/migration/oss-v2-to-v3)
- [Graphiti GitHub](https://github.com/getzep/graphiti)
- [Zep 官方文件](https://help.getzep.com)
- [Graphiti 論文](https://arxiv.org/abs/2501.13956)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [MemGPT 論文](https://arxiv.org/abs/2310.08560)
- [Letta 部落格：Next Phase](https://www.letta.com/blog)
- [LangGraph Persistence 官方文件](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangChain — Memory for agents](https://blog.langchain.com/memory-for-agents/)
- [LangChain — Context engineering for agents](https://blog.langchain.com/context-engineering-for-agents/)
- [LlamaIndex GitHub](https://github.com/run-llama/llama_index)
- [Cognee GitHub](https://github.com/topoteretes/cognee)
- [Supermemory GitHub](https://github.com/supermemoryai/supermemory)
- [Hindsight 論文](https://arxiv.org/abs/2512.12818)
- [EverMemOS 論文](https://arxiv.org/abs/2601.02163)
- [MemOS 論文](https://arxiv.org/abs/2507.03724)
- [MemoryAgentBench 論文](https://arxiv.org/abs/2507.05257)
- [Anthropic — Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- 站內：[Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory)
- 站內：[OpenViking 介紹](/posts/ai/2026-08-22-openviking-agent-memory)
- 站內：[Zep 介紹](/posts/ai/2026-08-22-zep-agent-memory)
- 站內：[Letta 介紹](/posts/ai/2026-08-22-letta-memgpt-agent-memory)
- 站內：[Cognee 介紹](/posts/ai/2026-08-22-cognee-memory-engine)
- 站內：[Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化](/posts/ai/2026-03-19-agent-memory-systems)
