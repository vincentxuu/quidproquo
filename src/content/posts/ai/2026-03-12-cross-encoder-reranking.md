---
title: "Cross-Encoder Reranking：讓最相關的文件排到前面"
date: 2026-03-12
category: ai
tags: [rag, reranking, cross-encoder, bge-reranker, retrieval]
lang: zh-TW
tldr: "向量搜尋的相似度分數不等於相關性，Cross-Encoder 用成對比較重新排序，把真正相關的文件推上來。"
description: "Cross-Encoder Reranking 的設計原理、BGE Reranker 的使用、threshold 設定策略，以及與 Bi-Encoder 向量搜尋的互補關係。"
draft: false
---

向量搜尋（Bi-Encoder）快速高效，但有個根本限制：**查詢和文件是獨立編碼的，沒有互相交叉注意**。

Bi-Encoder 把查詢和文件各自轉成向量，用 cosine similarity 衡量距離。這個過程中，查詢的每個 token 看不到文件的內容，文件的每個 token 也看不到查詢。這樣的架構適合大規模 ANN（近似最近鄰）搜尋，但相關性評分不夠精確。

Cross-Encoder 的設計不同：**把查詢和文件一起送進 Transformer，讓它們互相 cross-attention**，輸出一個真正衡量「這個文件回答這個查詢的能力」的相關性分數。

## 架構差異

```
Bi-Encoder（向量搜尋）：
Query → [Encoder] → q_vector
Doc   → [Encoder] → d_vector
Score = cosine(q_vector, d_vector)

Cross-Encoder（重排序）：
[Query; Doc] → [Transformer] → relevance_score
```

Cross-Encoder 的計算複雜度是 O(n)，對所有候選文件逐一計算，所以不適合在大規模索引上使用。但在已經縮小到幾十個候選的情況下，計算量完全可控，精度大幅提升。

## 兩階段架構

這是業界的標準組合：

```
Phase 1: Recall（Bi-Encoder）
  全索引 → Top-100 候選（快速）

Phase 2: Precision（Cross-Encoder）
  Top-100 → Top-10 精排（精準）
```

系統中的實際配置：

- **輸入**：RRF 融合後的候選（通常 20-30 個）
- **模型**：`@cf/baai/bge-reranker-base`
- **輸出**：每個文件的相關性分數（0.0 – 1.0）

## Threshold 過濾

重排序後不是直接取 Top-K，而是先用 threshold 過濾低相關的文件：

```typescript
const threshold = config.reranker_relevance_threshold ?? 0.5;
const minKeep = config.reranker_min_keep ?? 3;

const filtered = reranked.filter(doc => doc.score >= threshold);

// 安全網：即使全部低於 threshold，至少保留 minKeep 個
const final = filtered.length >= minKeep
  ? filtered
  : reranked.slice(0, minKeep);
```

`min_keep` 是個重要的安全設計：如果所有候選都分數很低，過濾掉後 LLM 就沒有 context，只能用通用知識回答（容易幻覺）。所以至少保留幾個，讓後面的 LLM-as-Judge 來決定這個回答要不要加免責聲明。

## 跳過條件

候選文件 ≤ 1 時跳過重排序——只有一個候選沒有重排的意義，省下一次 API 呼叫。

```typescript
skipWhen: (ctx) => ctx.candidateMatches.length <= 1
```

## BGE Reranker 的選擇

`bge-reranker-base` 是 BAAI 出品的 Cross-Encoder，同一個家族的 BGE-M3 也是這個系統的 Embedding 模型。同系列模型在向量空間的理解上更協調，同時也是 Cloudflare Workers AI 上有提供的選項。

如果對精度要求更高，可以換 `bge-reranker-large`，但延遲和成本會上升。

## 對系統的影響

Reranking 對最終結果品質的影響集中在幾種場景：

**效益最大**：
- 多路搜尋（HyDE + Multi-Query + BM25）帶來大量候選，品質參差不齊
- 查詢意圖複雜，簡單的 cosine similarity 排序容易偏掉

**效益較小**：
- 候選本來就少（< 5 個）
- Simple 查詢語義清晰，第一輪搜尋結果本來就不差

整體來說，Reranking 是 RAG pipeline 中 precision 提升最直接的環節，成本也在可接受範圍內（對 30 個候選做 cross-attention 比一次 LLM 生成便宜很多）。
