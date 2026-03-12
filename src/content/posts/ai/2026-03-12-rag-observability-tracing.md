---
title: "RAG Observability：黑盒子變透明的 17 步追蹤"
date: 2026-03-12
category: ai
tags: [rag, observability, tracing, debugging, pipeline, monitoring]
lang: zh-TW
tldr: "RAG 系統最難的不是建起來，是搞清楚為什麼這次回答不好。Pipeline Tracing 把每個步驟的決策和數據記下來，讓除錯有跡可循。"
description: "RAG Pipeline 的可觀測性設計：17 步追蹤的資料結構、記錄什麼資訊、如何用 trace 定位問題，以及管理員後台的 trace 視圖設計。"
draft: false
---

RAG 系統上線後，使用者回報「這個回答不對」，你要怎麼查？

如果沒有可觀測性，只能猜：是向量搜尋找錯文件？是 LLM 幻覺？是過濾條件太嚴導致零結果？是 Reranker 把好文件排到後面？每個環節都可能出問題，但你不知道是哪個。

RAG Tracing 解決這個問題：**把 pipeline 每個步驟的輸入、輸出、決策記下來，出問題時可以一步一步還原執行過程**。

## 追蹤的資料結構

```typescript
interface PipelineTrace {
  queryId: string;
  totalDurationMs: number;

  cache: {
    hit: boolean;
    similarity?: number;  // 命中時的相似度
  };

  toolSelection: {
    queryType: string;
    reasoning: string;           // LLM 分類的理由
    sqlTemplateId?: string;
    usedFallback: boolean;       // 是否用了 regex fallback
    durationMs: number;
  };

  hyde: {
    skipped: boolean;
    generatedDoc?: string;       // 生成的假設文件（用於除錯）
    durationMs?: number;
  };

  multiQuery: {
    skipped: boolean;
    subQueries?: string[];       // 生成的子查詢清單
    durationMs?: number;
  };

  filterBuild: {
    extractedFilters: VectorFilter;
    usedNlp: boolean;
    nlpMethod?: string;          // LLM / regex / none
  };

  retrieval: {
    vectorCandidates: number;    // 向量搜尋命中數
    bm25Candidates: number;      // BM25 命中數
    rrfMerged: number;           // RRF 融合後數量
    cragTriggered: boolean;      // 是否觸發了放寬重試
    relaxedFilter?: VectorFilter;
    durationMs: number;
  };

  crossEncoder: {
    skipped: boolean;
    inputCount?: number;
    outputCount?: number;        // threshold 過濾後剩幾個
    threshold?: number;
    durationMs?: number;
  };

  mmr: {
    lambda: number;
    inputCount: number;
    outputCount: number;
    durationMs: number;
  };

  generation: {
    model: string;               // 用了哪個 LLM
    promptTokens: number;
    completionTokens: number;
    injectedDocuments: string[]; // 注入了哪些文件的 ID
    durationMs: number;
  };

  judge: {
    groundedness: number;
    quality: number;
    reasoning: string;           // Judge 的評分理由
    durationMs: number;
  };

  selfReflection: {
    triggered: boolean;
    accepted?: boolean;          // 重生成後是否採用了新回答
    originalGroundedness?: number;
    regenGroundedness?: number;
  };
}
```

## 記錄什麼、為什麼

關鍵在記錄的不只是「做了什麼」，還有「為什麼這樣做」：

**toolSelection.reasoning**：LLM 分類查詢時說的理由（「這個查詢包含計數意圖，適合 SQL 模板」）。光看分類結果不夠，理由能幫助判斷分類是否合理。

**toolSelection.usedFallback**：如果 LLM 超時導致降級用 regex 分類，這裡會是 true。低品質的查詢分類往往是 regex fallback 引起的。

**retrieval.cragTriggered**：是否因為零結果而放寬過濾重試。這個信號說明查詢的過濾條件可能太嚴，或者資料庫缺乏這類內容。

**generation.injectedDocuments**：LLM 實際看到了哪些文件。如果回答有問題，可以對照這些文件，確認是文件本身有問題，還是 LLM 曲解了文件內容。

**selfReflection.accepted**：重生成後有沒有採用新回答。如果採用了但 groundedness 仍然低，說明問題出在 context 不足，不是生成策略。

## 時間分解

```typescript
interface TokenBreakdown {
  embeddingMs: number;      // embedding 計算時間
  retrievalMs: number;      // 搜尋 + RRF 時間
  rerankingMs: number;      // Cross-encoder 時間
  generationMs: number;     // LLM 生成時間
  judgeMs: number;          // Judge 評分時間
  overheadMs: number;       // 其他（路由、DB 寫入等）
  totalMs: number;
}
```

時間分解讓優化有方向：如果大部分時間在 `generationMs`，換輕量模型或縮短 context；如果在 `rerankingMs`，考慮減少候選數；如果在 `embeddingMs`，檢查並行化是否有問題。

## 存儲設計

Trace 以 JSON 格式存在 `pipeline_trace` 表：

```sql
CREATE TABLE pipeline_trace (
  id          TEXT PRIMARY KEY,
  query_log_id TEXT NOT NULL,  -- 關聯到 ai_query_logs
  trace_data  TEXT NOT NULL,   -- JSON 格式的完整 trace
  created_at  INTEGER NOT NULL
);
```

選 JSON 而非正規化表的原因：trace 結構會隨著 pipeline 演進而改變，用 JSON 不需要 migration。後台查詢時直接解析 JSON 欄位。

查詢量大時，只保留最近 30 天的 trace，超過的定期清理：

```sql
DELETE FROM pipeline_trace
WHERE created_at < unixepoch() - 30 * 86400;
```

## 管理員後台的 Trace 視圖

後台 AI Log 頁面把 trace 資料渲染成時間軸視圖：

```
查詢：龍洞有哪些 5.11 的路線？        總耗時：6.2s

[快取]           未命中                            0ms
[查詢分類]       complex（信心 0.92）            380ms
[HyDE]           生成假設文件（89字）             820ms
[Multi-Query]    生成 3 個子查詢                  610ms
[過濾建立]       crag_id=longtung, grade≥110     45ms
[混合搜尋]       向量 18 個 + BM25 12 個 → RRF 22 個  340ms
[Cross-Encoder]  22 → 8（threshold 0.5）         290ms
[MMR]            8 → 5（λ=0.7）                   12ms
[LLM 生成]       Gemma-3-12b，1240 tokens        3,840ms
[Judge]          groundedness 0.87, quality 3     510ms
[Self-Reflection] 未觸發（quality > 2）             0ms
[輸出防護]       通過                              8ms
```

每個步驟可以展開看詳細資料（生成的假設文件內容、子查詢清單、注入的文件清單）。

## 用 Trace 定位問題的思路

**問題：回答不相關**
1. 看 `toolSelection.queryType`：分類對不對？
2. 看 `filterBuild.extractedFilters`：過濾條件對不對？
3. 看 `retrieval.vectorCandidates` + `bm25Candidates`：有沒有找到東西？
4. 看 `generation.injectedDocuments`：LLM 看到的文件是不是正確的？

**問題：回答是幻覺**
1. 看 `judge.groundedness`：是不是低於 0.6？
2. 看 `generation.injectedDocuments`：這些文件有沒有相關內容？
3. 看 `retrieval.cragTriggered`：是不是 CRAG 放寬了，帶進不相關文件？

**問題：回答很慢**
1. 看 `tokenBreakdown`：哪個步驟最耗時？
2. 看 `judge.durationMs`：Judge 是否拖慢了主路徑？（Judge 應該異步）
3. 看 `generation.promptTokens`：context 是不是太長了？

## 整體來說

可觀測性是 RAG 系統從「能跑」到「可運營」的關鍵差距。沒有 trace，每次出問題都要靠猜；有了 trace，問題基本上都能定位到具體步驟。

設計 trace 的時候，記錄「決策理由」比記錄「執行結果」更有價值。結果很多時候看答案就知道了，理由才是除錯的關鍵——LLM 為什麼這樣分類？CRAG 為什麼觸發？Self-Reflection 為什麼沒採用新回答？這些問題的答案都在 trace 裡。
