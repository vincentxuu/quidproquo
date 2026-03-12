---
title: "CRAG：檢索失敗時，自動放寬條件重試"
date: 2026-03-12
category: ai
tags: [rag, crag, corrective-rag, retrieval, fallback]
lang: zh-TW
tldr: "過濾條件太嚴格導致零結果？CRAG 自動放寬過濾條件重試，比讓 LLM 用通用知識瞎猜好多了。"
description: "Corrective RAG（CRAG）的設計：檢測零結果、漸進式放寬過濾條件、重試搜尋，確保 RAG 系統在邊緣情況下仍有可用的 context。"
draft: false
---

RAG 系統的一個靜默失敗模式：**過濾條件過嚴，沒有候選文件通過，但 pipeline 繼續跑，LLM 只能用通用知識回答**。

使用者問「龍洞有沒有 5.14 的路線」，系統正確提取了 `crag_id = longtung` 和 `grade_numeric ≥ 140`，但龍洞根本沒有這個難度的路線，搜尋零結果。如果系統直接把空 context 送給 LLM，有兩種糟糕的結果：

1. LLM 誠實說「沒有相關資料」→ 正確但體驗差（其實應該說龍洞沒有 5.14）
2. LLM 用通用知識幻覺出一個回答 → 不準確

CRAG（Corrective RAG）的解法：**檢測到零結果時，自動放寬過濾條件重試搜尋**。

## 放寬策略

過濾條件有輕重之分。位置過濾（岩場、地區）通常是使用者的核心需求，不能隨便移除；但難度過濾、類型過濾有時是副條件，放寬它們更合理。

放寬的順序：

```
原始過濾：{ crag_id: 'longtung', grade_numeric: { gte: 140 }, route_type: 'sport' }
    ↓ 零結果
Step 1：移除 grade_numeric 過濾
    { crag_id: 'longtung', route_type: 'sport' }
    ↓ 仍然零結果
Step 2：移除 route_type 過濾
    { crag_id: 'longtung' }
    ↓ 有結果 → 繼續
```

位置過濾（`crag_id`、`area_id`、`region`）保留到最後，因為使用者問「龍洞」就是要龍洞的資訊，不能因為零結果就去找其他岩場的資料。

## 實作細節

```typescript
async function hybridSearchWithCRAG(ctx: PipelineContext): Promise<SearchResult[]> {
  let filter = buildFilter(ctx);
  let results = await hybridSearch(ctx.queryVector, filter);

  // 零結果且有可放寬的條件
  if (results.length === 0 && ctx.cragRetryCount < 1) {
    ctx.cragRetryCount++;

    // 移除難度過濾，保留位置
    const relaxedFilter = removeGradeFilter(filter);
    results = await hybridSearch(ctx.queryVector, relaxedFilter);

    // 記錄到 trace
    ctx.trace.retrieval.crag_triggered = true;
    ctx.trace.retrieval.relaxed_filter = relaxedFilter;
  }

  return results;
}
```

`cragRetryCount < 1` 確保最多重試一次。不設上限的話，理論上可以一直放寬到無過濾，但這可能帶回完全不相關的結果，反而更糟。

## 與 Agentic RAG 的差異

CRAG 是**規則型**的修正，在 pipeline 內自動執行，不需要 LLM 決策。Agentic RAG 是 LLM 主動評估是否要重新檢索並改寫查詢。兩者的定位不同：

| | CRAG | Agentic RAG |
|---|------|-------------|
| 觸發條件 | 零結果 | LLM 評估 context 不足 |
| 決策主體 | 規則 | LLM |
| 適用場景 | 過濾太嚴 | 需要多跳推理 |
| 延遲成本 | 低（多一次搜尋） | 高（多次 LLM 呼叫） |

CRAG 解決的是「根本沒東西」的問題，Agentic RAG 解決的是「有東西但不夠好」的問題。

## 為什麼是放寬而不是擴大範圍

另一個思路是「沒結果就去外部知識庫搜尋（如 Wikipedia）」。CRAG 原始論文也有這個設計（Web Search fallback）。但在攀岩社群的場景，使用者問的問題通常是關於特定岩場和路線，外部搜尋引入的通用攀岩知識反而可能誤導，不如誠實說「這個岩場沒有這個難度的路線」，輔以相近的資訊。

放寬過濾比引入外部知識在語義上更一致，結果也更可控。

## 整體來說

CRAG 是 RAG pipeline 的安全網，成本低（多一次搜尋），卻能防止系統在邊緣情況下靜默失敗。搭配 LLM-as-Judge 的 Groundedness 評分，即使放寬後取到的文件相關性較低，Judge 也會降低 groundedness 分數，讓系統加上適當的免責聲明。防禦是多層的，CRAG 是第一層。
