# quidproquo Deep Research Agent 架構走讀

日期：2026-08-26
來源：全部為本專案程式碼（src/lib/agent-os, src/lib/rag, src/lib/agent-policy, src/lib/agent-flow, src/pages/api/admin/deep-research）
讀取程度：四個平行 fork 各讀 9–19 個檔案，覆蓋所有核心模組

## 子問題

1. Agent OS kernel 的介面與 syscall 機制
2. Research agent 管線（planner → research → critic → writer）的資料流
3. Policy schema 的三級約束（quick / standard / enterprise）
4. Agent-flow DSL 與 durable runtime
5. Admin API 與儲存
6. 多源搜尋整合

## 架構總覽

這不是一個「skill」，是一個**四層 production agent 系統**：

```
┌─────────────────────────────────────────────────────┐
│  Admin API（report CRUD, retention, agent-skills）    │  ← 管理介面
├─────────────────────────────────────────────────────┤
│  Agent-flow（DSL → DAG → BFS runtime → durable）     │  ← 編排層
├─────────────────────────────────────────────────────┤
│  Research Pipeline（planner→research→writer→critic）  │  ← 業務邏輯
├─────────────────────────────────────────────────────┤
│  Agent OS（kernel, syscall, policy, memory, storage） │  ← 基礎設施
└─────────────────────────────────────────────────────┘
     ↕              ↕             ↕            ↕
   D1(SQLite)   Vectorize      KV           R2
```

## 1. Agent OS 層

### Kernel

`createKernel(env)` 是唯一進入點，組裝：
- **Storage backends**：D1（process registry, event log, tool call log, permissions, approval, memory, run store）、KV（cancel signals）、R2（blob，大於 256KB 的 memory 溢出）、Vectorize（向量索引）、Workers AI（embedding）、in-memory test stubs
- **Access manager**：權限檢查 + approval workflow
- **Syscall helper**：執行 tool call，帶 policy enforcement
- **Scheduler**：cron-driven agent 觸發
- **Provider registry**：LLM、search、reader 提供者

暴露 `defineAgent()`、`syscall()`、`listAgents()`、`scheduler`、raw `storage`/`access`。

### defineAgent

`AgentDefinition` 宣告：`id`、`version`、`syscalls`（允許的 tool 名稱）、`memoryScopes`、`secrets`、`outboundDomains`、`toolCallLimit`、`timeoutSeconds`、`maxConcurrent`、`approvalTtlSeconds`、`irreversibleActionsRequireApproval`、`run(input, context)`。

註冊時 kernel 在 D1 持久化 process record，並鏡像權限。**如果權限改了但 version 沒 bump，會拋 `PermissionsChangedWithoutVersionBump`**。

### State Machine

六態：`pending → running → paused → done/failed/cancelled`。Terminal states（done, failed, cancelled）不允許再轉移。`paused` 用於等待人工審批。

### Memory

四種記憶：`working`、`episodic`、`semantic`、`procedural`，以 `org|user|agent|session` 為 scope key。

**Recall** 走三路並行融合（`Promise.allSettled`）：
1. **Semantic** — embed query → Vectorize top-20
2. **Keyword** — D1 全文檢索
3. **Entity** — D1 entity match

結果用 **Reciprocal Rank Fusion**（RRF, k=60）合併，tie-break 依 importance → recency。

**Write** 會 embed body 並 upsert 到 Vectorize。大 body（>256KB）溢出到 R2 blob。

### Tool System

`defineSyscall()` 建立帶型別的工具：`name`、`description`、`inputSchema`、`outputSchema`、`costModel`（free/per-call/per-token）、`outboundDomains`、`requiresApproval`、`handler`。

執行順序：permission check → tool-call limit → input validation → outbound domain check → approval gate → execute → log event + cost to D1。

## 2. Research Agent 管線

### 整體流程

```
planner → research → normalizeResults → writer → validation → critic
                                                                 │
                                             shouldRetry? ───────┤
                                             yes (iter < 3)      │ no (iter ≥ 3)
                                                   │              │
                                             research (retry     fallbackNode
                                             with critic.gaps)   (prepend ⚠️ warning)
                                                   ...loop...

                                             relatedPosts (after final)
```

### 各 agent 職責

| Agent | 做什麼 | 關鍵細節 |
|---|---|---|
| **Planner** | 分類 intent（7 類：factual/summary/code/comparison/exploratory/recommendation/off-topic）、判斷 complexity、拆 subtasks | LLM 分類 |
| **Research** | 多源 fan-out 搜尋 | 走 abstract index、blog posts、docs、external web（13 providers）、PageIndex。用 HyDE 和 multi-query rewriting 生成查詢變體。**重試時注入 critic 的 gaps 作為額外搜尋詞** |
| **NormalizeResults** | 重新排序搜尋結果 | comparableRankingScore → query token overlap（0.7 relevance + 0.3 overlap）→ MMR 多樣性。判斷 `needs_web_search` |
| **Writer** | 產出有引用的 Markdown | inline `[label](source_url)` citation。低信心加 disclaimer。zh-TW/en 語言正規化 |
| **Validation** | 結構檢查 | balanced code fences、Markdown links/images、Mermaid block 合法性、**source URL allowlisting**（每個引用 URL 必須出現在 search_results 中） |
| **Critic** | 評判 grounding 品質 | 輸出 confidence、answer_relevance、intent_alignment、drift_detected、ungrounded_claims、gaps |
| **Critic Routing** | 決定重試或降級 | 重試條件：`confidence < 0.6 OR answer_relevance < 0.75 OR intent_alignment < 0.75 OR drift_detected OR ungrounded_claims.length > 0` AND `iteration < 3` |
| **Fallback** | 降級輸出 | 強制 confidence ≤ 0.3, relevance/alignment ≤ 0.5, prepend ⚠️ warning |
| **RelatedPosts** | 推薦相關文章 | Vectorize 搜尋 top 3，排除已引用的 slug |

### 關鍵設計決定

**Critic feedback 是確定性改寫**：critic 的 `gaps` 直接注入下一輪 research agent 的搜尋詞，不只是重新生成。這讓重試有方向性——不是重來一遍希望不同，而是填補具體的缺口。

**雙執行路徑**：每個 agent 同時有 legacy node function（直接呼叫 `invokeModel`）和 `defineAgent` 註冊（走 kernel syscall，帶 audit + policy）。共用同一組 `build*Update` 函式確保狀態變更一致。

**Source URL allowlisting**：validation 階段檢查 writer 引用的每個 URL 必須來自 search_results，不能幻覺出來源。這是一個硬性 grounding 機制。

## 3. Policy Schema

### 六個維度

| 維度 | 控制什麼 |
|---|---|
| **Budget** | `max_cost_usd`、`max_tokens`、`max_iterations`、`max_parallel_units`、`max_runtime_seconds` |
| **Provider** | allowlist/denylist、fallback_chain、region、data_residency（us/eu/apac/any） |
| **Quality** | `citation_required`、`min_sources`、`stale_source_max_days`、`conflict_check`、`min_confidence`、enforcement（warn/block） |
| **Security** | 5 種 PII pattern scanner（email, phone, api-key, ssn, credit-card）、tool_allowlist、least_privilege_scope |
| **Human** | approval_required_before_external_write、risk_threshold、mode（per_step/batch/edit_on_approval）、TTL |
| **Retry** | max_attempts、backoff（fixed/exponential/jitter）、fallback_provider、on_exhaustion（skip/fail） |

### 三級比較

| | Quick | Standard | Enterprise |
|---|---|---|---|
| **Budget** | $0.05, 3 iters, 60s | $1.00, 10 iters, 600s, 3 parallel | $5.00, 20 iters, 1800s, 2 parallel |
| **Providers** | workersai/cloudflare only | anthropic/openai/cloudflare/workersai | anthropic/openai only; workersai **denied**; US residency |
| **Quality** | 1 source, warn | 3 sources, citations, conflict check, warn | 5 sources, citations, conflict check, 0.7 confidence, **block** |
| **Security** | none | email+api-key redaction | all 5 patterns, **block**; tool allowlist; least privilege |
| **Human** | none | per-step, external write approval | edit-on-approval, risk threshold 0.5, 48h TTL |
| **Retry** | 1 attempt, skip | 3 attempts, exponential, fail | 2 attempts, exponential, fail |

### 機制細節

- **Budget tracker**：累積 tokens（in+out）、cost USD、iterations、parallel units、wall-clock。每個 flow step 後 `tracker.check(policy)` 比對五項限制，任一超標就停
- **Kill switch**：寫 cancel signal 到 KV + 更新 D1 `flow_runs` 為 failed，idempotent
- **Security scanner**：5 種 pattern scanner，回傳 offset-sorted matches。`redact()` 從後往前替換為 `[REDACTED_KIND_N]`，保留 redaction map 供稽核
- **Risk scoring**：啟發式——不可逆操作（fs/db write/delete, email, slack）→ 0.9；outbound（http, search, webhook）→ 0.5；memory write → 0.3；其他 → 0.0

## 4. Agent-flow DSL 與 Durable Runtime

### 9 種步驟類型

`agent`、`tool_group`、`transform`、`verifier`、`artifact`、`human_approval`、`sub_flow`、`parallel`、`loop`

`parallel` 和 `loop` 接受巢狀步驟（遞迴 validation）。

### YAML ↔ DAG

Flow 可用 YAML 撰寫 → `loadFlow()` → `validateFlowSchema()` → `compile()` 產生 `ExecutionGraph`（`Map<stepId, ExecutionNode>`，含 predecessor/successor、adjacency、entry/terminal steps）。`dag-to-yaml.ts` 可反向轉回。Store 持久化 `definition_yaml`。

### Runtime 執行

`runFlowInWorker`：BFS topological order。每步：等所有 predecessors 完成 → `beginStep`（D1 row）→ `executeStep`（按 step type dispatch）→ `endStep` → budget check → enqueue successors。任一步失敗整個 flow 失敗。所有步驟後如果 `evidence.enabled` 且沒有明確 `verifier:policy` step，跑隱式 evidence verifier。

### Durable Execution

由 `AGENT_FLOW_DURABLE_EXECUTION` flag 開關。走 Cloudflare Workflows binding（`AGENT_FLOW_WORKFLOWS.create()`），傳 flow ID 和 input，立即回 `{ flowRunId, status: 'queued' }`。Workflow runtime 處理 retries 和 crash recovery。

### State 持久化

`FlowState` = in-memory `Record<string, unknown>`，以 `flowRunId` 為 key。`writeBatch()` 用 D1 `json_set` 原子 upsert 到 `flow_run_state`。

## 5. Admin API

| Endpoint | Method | 功能 |
|---|---|---|
| `/api/admin/deep-research/` | GET | 列出 reports（分頁、篩選 provider/model/status/q） |
| | DELETE | 批量刪除（by reportId/provider/model/status/olderThanDays） |
| `/api/admin/deep-research/retention` | POST | Retention 清理（olderThanDays 1–3650，支援 dryRun） |
| `/api/admin/deep-research/agent-skills/` | GET/POST | 讀寫 `AGENT_SKILLS_LIBRARY_KEY`（skill manifest） |

Report table schema：`report_id`(PK)、`brief`、`provider`、`model`、`status`、`final_report`、`summary`、budget fields、profile columns（token/search/source/result/search_tool profiles, enable_flags）。

## 6. 搜尋工具整合

### 五個搜尋源

| Source | 機制 | 關鍵細節 |
|---|---|---|
| `search.posts` | **Hybrid**：D1 FTS5 BM25 + Vectorize | RRF 融合；precision queries（≥5 BM25 hits）short-circuit vector；以 slug 去重 |
| `search.docs` | **Hybrid**：同上，對 `doc_chunks` table | 可按 `source_name` 篩選 |
| `search.abstract-index` | **Vector-only**：獨立 `VECTORIZE_ABSTRACT` 索引 | 回傳 post-level 摘要，分數加權 0.5× 避免壓過 hybrid 共識 |
| `search.external` | **13 providers** | Jina、Cloudflare Browser Rendering、Tavily、Firecrawl、Exa、Brave、Linkup、Bocha、BrightData、Serper、SerpAPI，加內部 posts/docs 通道。`routeWithFallback` + per-provider budget splitting + URL dedup + 8s timeout |
| `search.pageindex` | **Neighborhood expansion** | 給一個 seed result，取同文件 ±maxSteps 相鄰 chunk。不是獨立搜尋，是加深既有命中 |

### Model Routing

per-stage provider overrides via `RagRuntimeConfig.stageOverrides`。支援 Groq（default: llama-3.3-70b）、OpenAI、Google/Gemini、Cloudflare Workers AI、OpenRouter、Nvidia、Cerebras、Ollama。明確 fallback chain（不是 SDK retry）。

## 事實交叉表

| 事實 | 來源 1（fork 結果） | 來源 2（程式碼直讀） | 狀態 |
|---|---|---|---|
| Kernel 暴露 defineAgent + syscall | agent-os fork | kernel.ts 已讀 | ✅ |
| Research pipeline 最多重試 3 次 | research-agents fork: `MAX_DRAFT_ATTEMPTS = 3` | critic-routing.ts 已讀 | ✅ |
| Critic gaps 注入下一輪搜尋 | research-agents fork | research.ts 已讀 | ✅ |
| Policy 三級：quick $0.05 / standard $1.00 / enterprise $5.00 | policy fork | reference/*.ts 已讀 | ✅ |
| External search 13 providers | api-tools fork | external-search.ts 已讀 | ✅ |
| Durable execution 走 Cloudflare Workflows | policy-flow fork | durable.ts 已讀 | ✅ |
| Memory RRF k=60 | agent-os fork | memory-fusion.ts 已讀 | ✅ |
| Abstract index 分數加權 0.5× | api-tools fork | hybrid-search.ts 已讀 | ✅ |
| Source URL allowlisting in validation | research-agents fork | validation.ts 已讀 | ✅ |

## 讀取程度盤點

| 模組 | 檔案數 | 讀取狀態 | 阻礙 |
|---|---|---|---|
| agent-os | 35 | ✅ 核心 11 檔完整讀取 | storage 實作未逐一展開 |
| rag/agents | 16 | ✅ 全部讀取 | — |
| agent-policy | 57 | ✅ 核心 10 檔 + schema + reference | enforcement 子模組未全讀 |
| agent-flow | 46 | ✅ 核心 10 檔 + DSL + runtime | 測試檔未讀 |
| admin API | 3 | ✅ 全部讀取 | — |
| rag/tools | 8 | ✅ 全部讀取 | — |

## 萃取：對 deep research 系列文的意義

### 這個 agent 在解什麼問題

跟 GPT Researcher / STORM 解同一個問題——多輪搜尋 + 交叉驗證 + 有引用的報告——但它是**嵌在一個完整 agent OS 裡的**，不是一個 standalone script。

### 關鍵設計決定（跟業界方案的對照）

| 設計決定 | quidproquo 做法 | 業界常見做法 | 取捨 |
|---|---|---|---|
| **架構路線** | 編排式（prompt-driven LLM 跑迴圈） | 同 GPT Researcher/STORM；RL 端到端是另一條路（Tongyi） | 編排式可控、可觀測，但吃 token |
| **Critic loop** | 確定性改寫（gaps → 搜尋詞），最多 3 輪 | GPT Researcher 沒有 critic loop；STORM 用 multi-perspective 但不重試 | **差異化設計**——critic 不只打分，直接改下一輪搜尋方向 |
| **Source validation** | URL allowlisting（writer 引用的 URL 必須來自 search_results） | 多數不做硬性檢查 | 防幻覺引用，但限制了 writer 的自由度 |
| **Policy 分層** | 三級（quick/standard/enterprise），含 budget + security + human gate | 開源專案通常沒有 policy 概念 | 適合 multi-tenant production，但增加複雜度 |
| **記憶** | 四類記憶 + RRF 融合 | 大多數 research agent 無跨 session 記憶 | 長期學習能力，但增加系統複雜度 |
| **搜尋** | 5 源 hybrid（BM25 + vector + abstract + 13 external + pageindex） | GPT Researcher: web only; STORM: web + wiki | 最豐富的搜尋源 fan-out |
| **Durable execution** | Cloudflare Workflows（flag-gated） | 少見；GPT Researcher 無 durable | 長時間研究不怕 crash |
| **雙執行路徑** | legacy node + defineAgent/kernel | 通常只有一條 | 遷移過渡期設計 |

### 適合系列文的切角

1. **跟業界產品/專案的具體對比**——不是空談架構，而是「我遇到了什麼問題、做了什麼選擇、業界怎麼做同一個問題」
2. **Policy-as-code 在 research agent 的角色**——這是開源專案幾乎沒有的東西
3. **Critic loop 的確定性改寫 vs 重新生成**——直接改搜尋詞 vs 重跑同樣的 query 希望不同
4. **Source URL allowlisting 作為 anti-hallucination 機制**——簡單但有效
5. **Multi-source fan-out 的實戰教訓**——13 個 external provider 的 fallback、budget splitting、timeout

## 草稿骨架

「自建實戰」篇的可能結構：

1. **為什麼要自建** — 商業產品的限制（source 不可控、成本、隱私）vs 開源的限制（沒 policy、沒 durable、搜尋源少）
2. **四層架構** — Agent OS → Research Pipeline → Agent-flow → Admin API
3. **三個關鍵設計決定的故事** — critic loop、source URL allowlisting、policy 分層
4. **搜尋源整合的實戰教訓** — 13 provider fallback、hybrid search 的 RRF 調校
5. **跟 GPT Researcher / STORM 的具體對比** — 不是功能表，是設計取捨
6. **還沒解決的問題** — evaluation gap、RL 路線沒走、long-context fidelity
