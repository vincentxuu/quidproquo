---
title: "RAG 可觀測性工具全景：2026 年的選擇"
date: 2026-03-12
category: ai
tags: [rag, observability, langfuse, phoenix, langsmith, tracing, monitoring]
lang: zh-TW
tldr: "自己寫 trace 夠用，但開源工具讓你少做很多事。Langfuse、Phoenix、LangSmith 各有定位，選哪個取決於你對自架、開源、整合複雜度的取捨。"
description: "2026 年 RAG 可觀測性工具的比較：Langfuse、Phoenix（Arize）、LangSmith、Helicone，各自的強項、弱點，以及如何選擇。"
draft: false
---

RAG 系統的可觀測性需求很明確：trace 每次查詢的執行過程、記錄 LLM 的輸入輸出、評估回答品質、找出問題集中在哪個步驟。

可以自己實作（上一篇講了 pipeline trace 的設計），也可以用現有工具。工具的好處是開箱即用的 UI、內建的評估功能、團隊協作支援；代價是多了一個外部依賴。

2026 年主流的選擇：

## Langfuse

**定位**：LLM 應用的開源 Observability 平台，最受歡迎的自架選項。

**核心功能**：
- Trace 視圖：完整的 LLM 呼叫樹（輸入、輸出、延遲、token 數）
- Session 管理：把多輪對話串成一個 session
- 評估框架：自定義 scorer，支援 LLM-as-Judge 整合
- Dataset 管理：收集真實查詢做 regression test
- Prompt 管理：版本化 prompt，追蹤哪個 prompt 版本效果最好

**SDK 整合**：

```typescript
import Langfuse from "langfuse";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: "https://cloud.langfuse.com", // 或自架
});

// 在 RAG pipeline 裡記錄 trace
const trace = langfuse.trace({
  name: "rag-query",
  input: { query },
  userId: userId,
});

const retrievalSpan = trace.span({
  name: "hybrid-search",
  input: { filter, topK },
});

// ... 搜尋執行 ...

retrievalSpan.end({
  output: { candidateCount: results.length },
  metadata: { cragTriggered: false },
});

const generationSpan = trace.span({
  name: "llm-generation",
  input: { messages },
});

// ... 生成執行 ...

generationSpan.end({
  output: { response: answer },
  usage: { promptTokens, completionTokens },
});

trace.update({ output: { answer, sources } });
await langfuse.flushAsync();
```

**強項**：
- 開源可自架（EU 資料合規）
- 評估功能完整（human annotation + LLM judge）
- Prompt 版本管理是同類工具裡最完整的

**弱項**：
- 自架有維護成本（需要 PostgreSQL + Redis）
- Dashboard 的客製化彈性有限

**適合**：需要資料留在自己基礎設施、重視 prompt 版本管理的團隊。

---

## Phoenix（Arize AI）

**定位**：開源的 AI Observability，特別強調評估和 dataset curation。

**核心功能**：
- Trace 視圖（類似 Langfuse）
- 內建 RAG 評估指標：Hallucination、QA Correctness、Relevance
- 嵌入向量視覺化：把 embedding 用 UMAP 投影到 2D，看 cluster 結構
- Experiment 框架：A/B 比較不同 pipeline 配置

**最獨特的功能**：**Embedding 視覺化**

```python
import phoenix as px

# 把查詢的 embedding 投影到 2D，可視化查詢分布
px.launch_app(trace_dataset)
```

可以看到哪些查詢在向量空間裡聚在一起，哪些查詢是孤立的（可能是 embedding 品質差或資料庫缺乏相關內容）。這個視覺化對發現 RAG 的系統性盲點很有幫助。

**強項**：
- 完全開源（Apache 2.0）
- Embedding 視覺化是獨特賣點
- 與 LlamaIndex、LangChain 的整合最順

**弱項**：
- 主要是 Python 生態，TypeScript SDK 功能較少
- 相較 Langfuse，Prompt 管理功能較弱

**適合**：Python 技術棧、需要深入分析 embedding 品質的場景。

---

## LangSmith

**定位**：LangChain 官方的 Observability 平台，與 LangChain / LangGraph 深度整合。

**核心功能**：
- 自動 tracing（使用 LangChain 時幾乎零設定）
- Playground：在 UI 上直接調試 prompt
- Annotation Queue：人工標記隊列，適合小團隊做 human eval
- Dataset + Evaluation：系統化的回歸測試框架

**整合方式**：

```typescript
// 如果用 LangChain，只需要設環境變數
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_API_KEY = "...";

// 所有 LangChain 呼叫自動 trace，不需要其他程式碼
const chain = new RetrievalQAChain({ ... });
await chain.call({ query });
```

**強項**：
- 使用 LangChain 時設定最簡單
- Dataset 管理和評估框架很完整
- Playground 對 prompt engineering 很方便

**弱項**：
- 閉源，資料在 LangChain 的伺服器
- 不用 LangChain 的話，SDK 整合複雜度增加
- 相對貴（企業版）

**適合**：LangChain 技術棧、需要完整評估框架的團隊。

---

## Helicone

**定位**：LLM API 的 proxy 層 observability，最輕量的選擇。

**核心功能**：
- 作為 LLM API 的代理，自動捕捉所有呼叫
- 成本追蹤（按模型、用戶、時間段）
- Rate limiting 和快取（在 proxy 層）
- 請求重放

**整合方式**：

```typescript
// 只需要改 baseURL，不需要修改其他程式碼
const openai = new OpenAI({
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});
```

**強項**：
- 最低整合成本（改一行 baseURL）
- 成本分析是同類工具中最詳細的
- 支援 OpenAI、Anthropic、Gemini、自架模型

**弱項**：
- RAG 層面的 trace 看不到（只看到 LLM 呼叫，不知道前面的搜尋發生了什麼）
- 評估功能基本
- 資料在 Helicone 伺服器

**適合**：只需要監控 LLM 成本和基礎使用量、不需要深入 RAG trace 的場景。

---

## 比較總結

| | Langfuse | Phoenix | LangSmith | Helicone |
|---|---------|---------|----------|---------|
| 開源 | ✅ | ✅ | ❌ | ❌ |
| 自架 | ✅ | ✅ | ❌ | ❌ |
| RAG Trace 深度 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Embedding 視覺化 | ❌ | ✅ | ❌ | ❌ |
| Prompt 管理 | ⭐⭐⭐ | ⭐ | ⭐⭐ | ❌ |
| 評估框架 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| TypeScript SDK | ✅ | 🟡 | ✅ | ✅ |
| 整合複雜度 | 中 | 中 | 低（LangChain）/ 高（其他） | 最低 |

## 如何選

**自架 + 完整功能** → Langfuse。目前最成熟的開源選項，評估框架完整，Prompt 版本管理是加分項。

**需要 Embedding 視覺化** → Phoenix。Embedding 的 cluster 分析是獨特功能，其他工具沒有。

**用 LangChain 技術棧** → LangSmith。零設定成本，Playground 方便迭代 prompt。

**只需要成本監控，不想改程式碼** → Helicone。改一行 baseURL，立刻有成本報表。

**自己寫 trace** → 適合有特殊需求或想完整控制 trace 資料結構的場景。成本是要自己維護 UI 和查詢介面，但完全客製化。

NobodyClimb 的系統選擇了自訂 trace，主要原因是部署在 Cloudflare Workers（不能輕易跑外部 SDK 的 flush 機制），且 trace 資料需要和業務資料（攀岩路線、用戶資料）緊密整合。但如果是重新開始且沒有平台限制，Langfuse 會是第一個試的選項。
