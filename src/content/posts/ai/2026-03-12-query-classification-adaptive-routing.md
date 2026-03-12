---
title: "Query Classification：讓 RAG 知道該怎麼回答這個問題"
date: 2026-03-12
category: ai
tags: [rag, query-classification, adaptive-routing, tool-selection, llm]
lang: zh-TW
tldr: "不是所有問題都需要 RAG。用 LLM 先分類查詢類型，再決定執行路徑，節省成本又提升準確度。"
description: "Query Classification 的設計：6 種查詢類型、路由策略、模型動態選擇，以及如何讓 pipeline 根據查詢自動調整執行路徑。"
draft: false
---

RAG 系統有個常見的浪費：每個查詢都走完整的向量搜尋 + LLM 生成流程，但很多查詢其實不需要這樣。

「2+2 等於幾」不需要檢索任何文件。「龍洞有幾條路線」不需要語義搜尋，直接查資料庫就好。「攀岩是什麼」是通用知識，LLM 自己就能回答。

Query Classification 在整個 pipeline 最前面，**先判斷這個查詢的性質，再決定後續怎麼處理**。這是影響整體效能和成本最大的一個環節。

## 6 種查詢類型

```
simple             → 單一明確問題（人名、地名、定義）
complex            → 需要推理、比較、推薦的複雜查詢
general-knowledge  → 通用知識，不需要攀岩資料庫
sql                → 精確統計、計數（「我完攀幾條」）
hybrid             → SQL 取候選 + LLM 推薦（「推薦適合我程度的路線」）
clarification-needed → 意圖不明，需要使用者澄清
```

## 分類如何進行

使用 LLM Tool Calling（Function Calling）讓模型選擇正確的工具：

```typescript
const tools = [{
  name: "classify_query",
  description: "分析查詢並選擇最適合的處理策略",
  parameters: {
    query_type: {
      enum: ["simple", "complex", "general-knowledge", "sql", "hybrid", "clarification-needed"]
    },
    reasoning: "string",       // 分類理由（用於 trace）
    sql_template_id: "string", // SQL 查詢時填入
    clarification_options: [], // 澄清選項
  }
}];
```

LLM 不是用自由文字輸出，而是強制呼叫 tool，確保輸出是結構化的、可解析的。同時也讓模型說明分類理由，方便後續 trace 和除錯。

若 LLM 呼叫失敗（超時或解析失敗），降級為 regex 規則：

```typescript
// fallback regex 分類
if (/幾條|幾次|多少|count|how many/i.test(query)) return 'sql';
if (/是什麼|定義|介紹/i.test(query)) return 'simple';
// 其餘 → 'complex'
```

## 路由策略

分類結果決定 pipeline 的執行路徑：

| 類型 | 執行路徑 |
|------|---------|
| `simple` | embedding → hybrid search → 輕量 LLM 生成 |
| `complex` | HyDE + Multi-Query + hybrid search → reranking → MMR → Gemma 生成 → Judge |
| `general-knowledge` | 跳過所有檢索 → 直接 LLM 回答 |
| `sql` | 執行 SQL 模板 → 輕量 LLM 組裝回答 → 早期 return |
| `hybrid` | SQL 取候選 → 向量補充 → Gemma 推薦生成 |
| `clarification-needed` | 組裝澄清選項 → 回傳給使用者 |

Pipeline 的每個 step 都有 `skipWhen` 條件，根據 `queryType` 自動跳過不相關的步驟：

```typescript
{
  name: "hyde",
  skipWhen: (ctx) => ctx.queryType !== "complex",
  execute: async (ctx) => { /* HyDE 邏輯 */ }
},
{
  name: "text-to-sql",
  skipWhen: (ctx) => !["sql", "hybrid"].includes(ctx.queryType),
  execute: async (ctx) => { /* SQL 邏輯 */ }
}
```

這個設計讓 pipeline 保持線性結構，不需要手動寫分支邏輯，每個 step 自己管理自己的跳過條件。

## 動態模型選擇

分類結果也決定使用哪個 LLM：

```typescript
const effectiveLlmModel =
  ["simple", "general-knowledge"].includes(queryType)
    ? "llama-3.1-8b-instruct"  // 輕量，低成本
    : "gemma-3-12b-it";        // 完整，高品質
```

Simple 查詢用 8B 模型就夠了，複雜查詢才用 12B。在高流量場景，這個動態選擇能顯著降低 token 成本和平均延遲。

## clarification-needed 的處理

當查詢意圖不明確時，系統不猜測，直接回傳澄清選項：

```
Q: 推薦路線

澄清選項：
  A. 推薦龍洞的入門路線
  B. 推薦適合我目前程度的路線
  C. 推薦近期熱門路線
  D. 推薦適合多人一起去的路線
```

這比猜錯後生成不相關的答案體驗更好，也避免浪費 LLM token。

## 整體來說

Query Classification 是 adaptive RAG 的核心。不同問題有不同的最優解法，用一個固定的流程應對所有查詢是對資源的浪費。分類的好，後面所有步驟都在正確的軌道上；分類錯了，後面做再多優化也是白費。

這個環節的設計要點：
1. 用 LLM Tool Calling 確保輸出結構化
2. 一定要有 regex fallback，防止 LLM 超時拖垮整個請求
3. skipWhen 讓 pipeline 保持解耦，分類結果和步驟邏輯分離
4. 動態模型選擇是成本優化的低掛果實
