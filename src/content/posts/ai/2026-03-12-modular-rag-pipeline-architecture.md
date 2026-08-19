---
title: "Modular RAG Pipeline：把 RAG 設計成可組合的 DAG"
date: 2026-03-12
updated: 2026-08-19
type: deep-dive
category: ai
tags: [rag, pipeline, architecture, modular, dag, cloudflare-workers]
lang: zh-TW
tldr: "RAG 不是固定的三步流程，而是一組可以動態啟用、跳過、重排的步驟。Pipeline as Code 讓系統在不重新部署的情況下調整行為。"
description: "Modular RAG Pipeline 的架構設計：Step Registry、skipWhen 條件路由、動態配置、PipelineContext 狀態管理，以及在 Cloudflare Workers 上的實作考量。"
draft: false
series:
  name: "RAG 技法大全"
  order: 4
---

> 🌏 [English version](/posts/ai/2026-03-12-modular-rag-pipeline-architecture-en)

很多 RAG 系統是這樣設計的：一個大函數，裡面依序執行查詢解析、向量搜尋、重排序、生成，中間夾一堆 if-else。這樣的設計在系統簡單時沒問題，但當步驟越來越多（HyDE、Multi-Query、CRAG、Self-Reflection...），這個大函數就變成了一個難以維護的泥球。

Modular Pipeline 的設計把每個 RAG 步驟拆成獨立模組，用一個 Pipeline Engine 統一調度。核心想法借鑒了有向無環圖（DAG）的概念：**步驟是節點，依賴關係是邊，引擎負責按順序執行並傳遞狀態**。

## Step 的結構

每個 pipeline step 是一個實作固定介面的物件：

```typescript
interface PipelineStep {
  name: string;
  skipWhen?: (ctx: PipelineContext) => boolean;
  timeout?: number;  // 毫秒，獨立超時
  execute: (ctx: PipelineContext, env: Env) => Promise<void>;
}
```

一個實際的 step：

```typescript
const hydeStep: PipelineStep = {
  name: "hyde",
  skipWhen: (ctx) => ctx.queryType !== "complex",
  timeout: 3000,
  execute: async (ctx, env) => {
    const hypoDoc = await generateHypotheticalDoc(ctx.query, env);
    ctx.hydeEmbedding = await embed(hypoDoc, env);
    ctx.trace.hyde = { generated: hypoDoc, durationMs: /* ... */ };
  },
};
```

`skipWhen` 是這個設計的關鍵：步驟自己決定要不要執行，不需要在 Engine 裡寫一堆分支邏輯。Query Classification 的結果（`ctx.queryType`）讓各步驟自動走正確的路徑。

## Step Registry

所有步驟在啟動時向 Registry 登記，Engine 從 Registry 取得有序的步驟清單：

```typescript
const registry = new PipelineStepRegistry();

registry.register(semanticCacheStep);    // 1
registry.register(quotaCheckStep);       // 2
registry.register(toolSelectionStep);    // 3
registry.register(textToSqlStep);        // 4
registry.register(hydeStep);             // 5
registry.register(multiQueryStep);       // 6
registry.register(filterBuildStep);      // 7
registry.register(embeddingStep);        // 8
registry.register(hybridSearchStep);     // 9
registry.register(crossEncoderStep);     // 10
registry.register(mmrStep);              // 11
registry.register(popularityRerankStep); // 12
registry.register(llmGenerationStep);    // 13
registry.register(judgeStep);            // 14
registry.register(selfReflectionStep);   // 15
registry.register(guardrailsOutputStep); // 16
registry.register(memoryExtractionStep); // 17
```

新增一個步驟只需要寫新的 step 物件，在 Registry 裡加一行，不需要修改 Engine 本身。

## Pipeline Engine

Engine 的核心邏輯非常簡單：

```typescript
class PipelineEngine {
  async run(ctx: PipelineContext, env: Env): Promise<void> {
    const steps = this.registry.getSteps();

    for (const step of steps) {
      // 動態配置：管理員可以從後台停用某個步驟
      const isEnabled = ctx.config.steps[step.name]?.enabled ?? true;
      if (!isEnabled) continue;

      // skipWhen：步驟自己決定要不要跑
      if (step.skipWhen?.(ctx)) continue;

      // 帶超時的執行
      await withTimeout(
        step.execute(ctx, env),
        step.timeout ?? ctx.config.defaultStepTimeout
      );
    }
  }
}
```

實際上加了超時處理、錯誤隔離（某個步驟失敗不應該讓整個 pipeline 崩）、trace 記錄等，但核心邏輯就是這個循環。

## PipelineContext：單一狀態物件

所有步驟共享同一個 `PipelineContext`，步驟之間通過修改 context 傳遞資訊：

```typescript
interface PipelineContext {
  // 輸入
  query: string;
  userId?: string;
  config: AIConfig;

  // 查詢分析結果
  queryType: "simple" | "complex" | "sql" | "hybrid" | "general-knowledge" | "clarification-needed";
  sqlTemplateId?: string;

  // 向量搜尋相關
  queryEmbedding?: number[];
  hydeEmbedding?: number[];
  expandedQueries?: string[];
  vectorFilter?: VectorFilter;

  // 搜尋結果
  candidateMatches: SearchResult[];

  // 生成相關
  context: string;        // 整理好的 context 字串
  messages: Message[];    // LLM 的 messages 陣列
  response?: AIResponse;

  // 品質評估
  judgeResult?: JudgeResult;

  // 可觀測性
  trace: PipelineTrace;
  tokenBreakdown: TokenBreakdown;

  // 配額
  quotaDeducted: boolean;
  cragRetryCount: number;
}
```

單一狀態物件讓調試變得直觀：出問題時，印出整個 context 就能看到每個步驟做了什麼。也讓測試更容易：可以預設一個 context 狀態，直接測試某個步驟的行為。

## 動態配置

步驟的啟用狀態和各種閾值存在資料庫的 `ai_config` 表，Admin UI 可以即時調整：

```json
{
  "steps": {
    "hyde": { "enabled": true },
    "multi_query": { "enabled": true },
    "cross_encoder": { "enabled": true },
    "self_reflection": { "enabled": false }  // 臨時關閉
  },
  "reranker_relevance_threshold": 0.5,
  "mmr_lambda": 0.7,
  "rag_strategy": "plan-execute"
}
```

這讓系統可以在不重新部署的情況下：
- 關閉某個有問題的步驟（線上 hotfix）
- 調整閾值參數（A/B 測試）
- 切換 RAG 策略（baseline / plan-execute / agentic）

## Cloudflare Workers 的限制

在 Cloudflare Workers 上跑 Pipeline，有幾個需要注意的點：

**CPU 時間限制**：Workers 計的是 CPU 時間而不是 wall-clock time。長時間等待 I/O（LLM API 呼叫）不消耗 CPU，但 embedding 計算和大量字串處理會。實際的上限值和方案差異會變，設計前直接看[官方 Limits 文件](https://developers.cloudflare.com/workers/platform/limits/)，不要照抄任何文章裡寫死的秒數。

**並行的正確姿勢**：多個步驟的 I/O 要用 `Promise.all()` 並行，不能用 `await` 串行等：

```typescript
// 正確：並行執行
const [queryEmbedding, hydeDoc] = await Promise.all([
  embed(query, env),
  generateHyDE(query, env),
]);

// 錯誤：串行，浪費時間
const queryEmbedding = await embed(query, env);
const hydeDoc = await generateHyDE(query, env);
```

**`ctx.waitUntil()` 的用途**：非關鍵路徑的工作（記憶提取、Contextual Retrieval 更新）用 `waitUntil()` 在回應返回後繼續執行，不阻塞使用者。注意這裡的 `ctx` 是 Workers runtime 的 execution context，和上面 pipeline 自己的 `PipelineContext` 是兩個不同的東西，同名很容易在 code review 時看混（[Workers Context API](https://developers.cloudflare.com/workers/runtime-apis/context/)）。

## 這個設計撐不住的地方

前面的 Engine 是一個**單向的 for 迴圈**：步驟跑完就往前走，回不去。但 `PipelineContext` 裡有 `cragRetryCount` 這種欄位，代表實務上會需要「檢索品質不夠 → 回頭重跑檢索」。單向迴圈表達不了這件事，你只能在某個步驟內部自己開一個小迴圈，或者讓整條 pipeline 重跑一次。這是這個架構第一個會撞到的牆。

再往下一階，是把控制權整個交給模型的 Agentic 做法：不預先排步驟順序，由 LLM 在 runtime 決定要呼叫哪些模組、要不要再迭代。前面的 Registry + skipWhen 其實是它的「靜態版本」——同一批模組，差別只在誰決定順序。

要不要跨過去，有幾個已經被量到的代價可以參考。ACL 2026 一份比較 Enhanced RAG（就是這篇講的固定 pipeline）與 Agentic RAG 的實驗發現，Agentic 需要的 input／output token 依資料集而異（FIQA 2.7×／1.7×、CQADupStack-En 3.9×／2.0×），端到端延遲 1.5 倍，跨資料集成本最多到 3.6 倍。品質上也不是全贏：Agentic 在意圖理解和查詢改寫上比較強，但挑文件不如固定的 reranking 步驟；作者的建議是把兩者混用，而不是整條換掉。

另外，模型驅動的迴圈會帶進靜態 pipeline 沒有的失效模式。2026 年一篇 Agentic RAG 的 SoK 論文把這種迴圈形式化成有限步長的 POMDP，並點名幻覺沿迴圈累積、記憶污染、檢索目標偏移、工具呼叫連鎖失效等風險——這些都不是「單次回答對不對」的評測能抓到的，你要評的是整條軌跡。

所以本篇的 trace 設計不是加分項而是前提：**能不能觀測整條執行軌跡，決定了你有沒有資格把控制權交出去。**

## 整體來說

Modular Pipeline 解決的是 RAG 系統的**可維護性**問題。步驟越加越多時，模組化比大函數好維護；動態配置比重新部署調整參數更靈活；skipWhen 比滿屏 if-else 更清晰。

這個架構的核心取捨：多了一層抽象（Pipeline Engine、Step Registry），換來了可測試性、可配置性、可觀測性。對一個持續演進的 RAG 系統，這個取捨是值得的。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks (2024)](https://arxiv.org/abs/2407.21059)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [Is Agentic RAG worth it? An experimental comparison of RAG approaches (ACL 2026 Industry Track)](https://arxiv.org/abs/2601.07711)
- [SoK: Agentic Retrieval-Augmented Generation (RAG): Taxonomy, Architectures, Evaluation, and Research Directions (2026)](https://arxiv.org/abs/2603.07379)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
