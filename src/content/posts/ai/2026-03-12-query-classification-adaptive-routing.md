---
title: "Query Classification：讓 RAG 知道該怎麼回答這個問題"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, query-classification, adaptive-routing, tool-selection, llm]
lang: zh-TW
tldr: "不是所有問題都需要 RAG。用 LLM 先分類查詢類型，再決定執行路徑，節省成本又提升準確度。"
description: "Query Classification 的設計：6 種查詢類型、路由策略、模型動態選擇，以及如何讓 pipeline 根據查詢自動調整執行路徑。"
draft: false
series:
  name: "RAG 技法大全"
  order: 16
---

> 🌏 [English version](/posts/ai/2026-03-12-query-classification-adaptive-routing-en)

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
| `complex` | HyDE + Multi-Query + hybrid search → reranking → MMR → 大模型生成 → Judge |
| `general-knowledge` | 跳過所有檢索 → 直接 LLM 回答 |
| `sql` | 執行 SQL 模板 → 輕量 LLM 組裝回答 → 早期 return |
| `hybrid` | SQL 取候選 → 向量補充 → 大模型推薦生成 |
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

如果是用框架而不是自己刻 pipeline，要注意 LangChain 早期教學裡的 `RouterChain` 已經被歸到 `langchain-classic`，不再是主推寫法；核心套件現在提供的是 `RunnableBranch` / `RouterRunnable` 這類分支原語，而多路由的官方建議寫法是在 LangGraph 裡用 `Command`（單一路徑）或 `Send`（並行 fan-out）——參見 [LangChain router 架構文件](https://docs.langchain.com/oss/python/langchain/multi-agent/router)。概念和本文一樣（先分類、再分派），只是分派的載體換了。

## 動態模型選擇

分類結果也決定使用哪個 LLM：

```typescript
const effectiveLlmModel =
  ["simple", "general-knowledge"].includes(queryType)
    ? MODELS.small   // 輕量、低成本，負責照抄 context 的問題
    : MODELS.large;  // 需要推理、比較、長篇組織時才用
```

具體型號不重要，也不該寫死在文章裡——這一層每隔幾個月就會被更便宜或更強的模型換掉。要記住的是取捨本身：**分類結果只是拿來決定「這題值不值得花大模型」**。simple 與 general-knowledge 的回答多半是照抄或轉述 context，小模型足夠；complex 與 hybrid 要做比較、推理、組織長篇答案，才需要大模型。在高流量場景，這個動態選擇能顯著降低 token 成本和平均延遲。

實作上把型號抽成一個設定常數（像上面的 `MODELS.small` / `MODELS.large`），換模型時只改一處。可用型號請直接查平台的模型清單，例如 [Cloudflare Workers AI models](https://developers.cloudflare.com/workers-ai/models/)。

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

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity](https://arxiv.org/abs/2403.14403)
- [SymRAG: Efficient Neuro-Symbolic Retrieval Through Adaptive Query Routing](https://arxiv.org/abs/2506.12981)
- [RAGRouter: Learning to Route Queries to Multiple Retrieval-Augmented Language Models](https://arxiv.org/abs/2505.23052)
- [Context Awareness Gate For Retrieval Augmented Generation](https://arxiv.org/abs/2411.16133)
- [Router 架構與分派原語 — LangChain 官方文件](https://docs.langchain.com/oss/python/langchain/multi-agent/router)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
