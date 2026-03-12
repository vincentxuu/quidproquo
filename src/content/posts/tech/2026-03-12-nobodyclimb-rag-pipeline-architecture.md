---
title: "NobodyClimb AI 架構：在 Cloudflare Workers 上打造 13 步 RAG Pipeline"
date: 2026-03-12
category: tech
tags: [rag, cloudflare-workers-ai, llm, pipeline, gemma, embedding, hono]
lang: zh-TW
tldr: "用 Cloudflare Workers AI（gemma-3-12b-it + bge-m3）打造可動態組裝的 RAG pipeline，13 個 step 分 5 個 phase，支援條件路由、迴圈回跳與並行分支。"
description: "NobodyClimb AI 問答系統的完整架構筆記：模型選擇、13 步 pipeline 設計、PipelineEngine 實作、條件路由、self-reflection 迴圈與 Cloudflare Workers 上的部署取捨。"
draft: false
---

NobodyClimb 是一個台灣攀岩社群平台。在加入 AI 問答功能之前，使用者要找「龍洞有哪些 5.10 的路線」這種問題，只能靠自己爬文章。現在這個問題可以直接問 AI，然後拿到附有來源連結的答案。

這篇記錄整個 AI 系統的架構設計，包括為什麼選這些模型、pipeline 怎麼設計、以及在 Cloudflare Workers 的限制下踩了哪些坑。

## 技術選型

整個後端跑在 Cloudflare Workers 上，用 Hono 框架。AI 的部分選擇繼續留在 Cloudflare 生態系，主要原因是不想另外維護 AI 推論的基礎設施。

**LLM：`@cf/google/gemma-3-12b-it`**

早期用 `llama-3.1-8b-instruct`，回答品質在中文語境下偏弱，繁體中文的指令跟隨效果也不好。換成 gemma-3-12b-it 之後明顯改善，12B 參數對這個使用場景剛好夠用。

**Embedding：`@cf/baai/bge-m3`**

1024 維向量，多語言模型，繁體中文效果是評估的幾個模型裡最好的。M3 架構同時支援 dense retrieval、sparse retrieval 和 ColBERT-style multi-vector，雖然目前只用到 dense，但為未來的 hybrid search 留了空間。

## Pipeline 架構

整個查詢流程設計成模組化的 pipeline，13 個 step 分 5 個 phase 依序執行：

```
pre-retrieval → retrieval → post-retrieval → generation → evaluation
```

```
┌─────────────────────────────────────────────────────────────────┐
│ Pre-Retrieval                                                    │
│  semantic-cache → tool-selection → hyde → multi-query           │
│  → filter-build                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Retrieval                                                        │
│  embedding → hybrid-search                                       │
├─────────────────────────────────────────────────────────────────┤
│ Post-Retrieval                                                   │
│  cross-encoder → mmr → popularity-rerank                        │
├─────────────────────────────────────────────────────────────────┤
│ Generation                                                       │
│  llm-generation                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Evaluation                                                       │
│  judge → self-reflection                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 每個 Step 的設計邏輯

**semantic-cache**：在 pipeline 最前端做語義快取檢查。如果有語義相似的歷史查詢，直接 `earlyReturn` 跳過後續所有 step，回傳快取結果。

**tool-selection**：分類查詢類型（`climbing-knowledge` / `general-knowledge`）。General knowledge 查詢（例如「攀岩鞋怎麼保養」）走 LLM 直接回答，跳過所有 RAG step，避免浪費檢索資源。

**HyDE（Hypothetical Document Embeddings）**：用 LLM 先生成一份假設性的答案文件，再用這份文件做向量搜尋。這個技巧對查詢和文件之間有語義落差的情況效果明顯，例如口語化的問法對應到正式的路線描述。

**multi-query**：把原始查詢展開成 3-5 個不同角度的子查詢，分別搜尋後取聯集，提高召回率。

**filter-build**：NLP 偵測查詢中的結構化條件（難度等級、地區、路線類型），轉成 metadata filter 傳給搜尋 step。例如「龍洞的 5.10」→ `{ location: '龍洞', grade: { min: '5.10a', max: '5.10d' } }`。

**cross-encoder**：Bi-encoder 搜尋召回的候選文件用 cross-encoder 做精排。候選數 ≤ 1 時跳過（step 內部邏輯，不走 engine 的 skipWhen）。

**MMR（Maximal Marginal Relevance）**：在相關性和多樣性之間取平衡，避免回傳內容高度相似的文件。

**judge**：LLM-as-judge 評估生成答案的品質（正確性、相關性、有根據性），結果寫入 trace 供管理員監控。

**self-reflection**：計算答案的 groundedness score，如果低於閾值（0.5）則觸發 loopBack 重新檢索。

### PipelineStep 介面

每個 step 實作同一個介面：

```typescript
interface PipelineStep {
  id: string                    // kebab-case 唯一識別碼
  name: string                  // 顯示名稱
  description: string
  phase: PipelinePhase          // pre-retrieval | retrieval | post-retrieval | generation | evaluation
  defaultEnabled: boolean
  defaultOrder: number
  requires: string[]            // 需要 ctx 提供的欄位
  provides: string[]            // 執行後寫入 ctx 的欄位
  skipWhen?: SkipCondition[]    // 條件路由
  execute(ctx: PipelineContext): Promise<PipelineContext>
}
```

Step 透過 `PipelineContext` 傳遞狀態，不直接互相依賴，方便獨立測試和動態組裝。

## 三個進階機制

### 1. Conditional Routing（skipWhen）

Engine 在呼叫 step 的 `execute()` 前評估 `skipWhen` 條件，條件成立則跳過。這讓路由邏輯集中在 engine，而不是散落在各個 step 內部。

```typescript
// tool-selection 判斷為 general-knowledge 後，後續所有 RAG step 自動跳過
skipWhen: [{ field: 'queryType', operator: 'eq', value: 'general-knowledge' }]
```

跳過的原因會寫入 `ctx.trace.pipeline_execution`，方便 debug。

### 2. Looping Pattern

`self-reflection` 偵測到回答品質不佳時，可以設定 `ctx.loopBack` 讓 engine 回跳到指定 phase 重新執行。有安全限制（`max_pipeline_loops`，預設 1），避免無限迴圈。

```
第一輪：retrieval → post-retrieval → generation → evaluation
self-reflection: groundedness = 0.3 < 0.5，設定 loopBack → retrieval

第二輪：retrieval → post-retrieval → generation → evaluation
self-reflection: groundedness = 0.7，通過，結束
```

### 3. Branching + Fusion

支援並行分支執行，用 `Promise.all()` 同時跑多條搜尋路徑，再由 fusion step 合併結果。目前主要用途是同時執行 vector search 和 BM25 full-text search，最後 RRF（Reciprocal Rank Fusion）合併排名。

## 設定與可觀測性

Pipeline 的 step 啟用/停用和排序都儲存在 D1 的 `ai_config` 表，管理員可以從 UI 動態調整，不需要重新部署。依賴驗證在儲存時做（例如停用 `embedding` 但 `hybrid-search` 還開著會被拒絕）。

每次查詢都會記錄完整的執行 trace：

```json
{
  "pipeline_execution": [
    { "id": "semantic-cache", "duration_ms": 12, "skipped": false },
    { "id": "tool-selection", "duration_ms": 340, "skipped": false },
    { "id": "hyde", "duration_ms": 890, "skipped": false },
    { "id": "hybrid-search", "duration_ms": 45, "skipped": false },
    ...
  ],
  "loop_history": [],
  "total_duration_ms": 2340
}
```

管理員後台可以查看每筆查詢的完整 17 步流程，包括每個 step 的輸入、決策依據和輸出。

## Cloudflare Workers 上的取捨

**好處**：不需要管 AI 基礎設施，gemma 和 bge-m3 都直接透過 `env.AI` binding 呼叫，跟呼叫 D1 一樣簡單。

**限制**：Workers 有 CPU 時間限制，pipeline 裡有多個 LLM 呼叫（HyDE、LLM generation、judge）。目前靠合理的 step 停用設定控制，HyDE 在 production 只在 complex 查詢啟用，judge 是非阻塞非同步寫入。

**SSE 串流**：`POST /api/v1/ai/ask?stream=true`，用 TransformStream 把 LLM 的 token 逐步推給前端。斷線時退還配額。

## 整體來說

這套架構的核心取捨是「靈活性 vs 複雜度」。Pipeline engine 加上動態設定讓不同 step 的組合可以快速實驗，但 13 個 step 的依賴圖也帶來相對高的維護成本。

適合的情境：領域知識有明確邊界（攀岩路線、岩場資訊）、需要把中文 NLP 過濾和向量搜尋結合、有足夠的 trace 基礎設施支撐持續調優。

不建議直接搬這套的情境：沒有 admin trace 基礎設施、team 不熟悉 RAG 調優、查詢類型單純（直接用簡單的 top-k + LLM generation 就夠）。
