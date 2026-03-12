---
title: "Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區"
date: 2026-03-12
category: ai
tags: [rag, hybrid-search, bm25, vector-search, rrf, embedding]
lang: zh-TW
tldr: "向量搜尋抓語義，BM25 抓關鍵字，兩者用 RRF 融合才能同時照顧模糊查詢和精確術語。"
description: "深入介紹 Hybrid Search 的設計原理：BM25 全文搜尋、向量搜尋、RRF 融合演算法，以及在攀岩社群平台的實際應用。"
draft: false
---

向量搜尋（Vector Search）已經是 RAG 系統的標配，但只用它有個根本問題：**對精確關鍵字的掌握能力不如 BM25**。

「龍洞 5.11a」這種查詢，向量搜尋可能因為語義泛化把 5.10d 的結果也拉進來，但 BM25 能精確命中包含「龍洞」和「5.11a」的文件。反過來，「適合初學者、風景好的岩場」這種模糊查詢，BM25 找不到關鍵字，向量搜尋卻能抓到語義相近的結果。

Hybrid Search 的核心思路就是：**讓兩種搜尋各做自己擅長的事，然後融合結果**。

## BM25（全文搜尋）

BM25 是 TF-IDF 的進化版，計算查詢詞在文件中出現的頻率與稀有度。核心公式：

```
BM25(d, q) = Σ IDF(t) × (tf(t,d) × (k1+1)) / (tf(t,d) + k1 × (1 - b + b × |d|/avgdl))
```

- **IDF**：詞越罕見，分數越高
- **TF saturation**：詞出現次數多了之後邊際效益遞減（`k1` 控制）
- **文件長度正規化**：避免長文件佔便宜（`b` 控制）

在 NobodyClimb 系統裡，使用 Cloudflare D1 的 **FTS5 全文索引**實作 BM25：

```sql
CREATE VIRTUAL TABLE ai_documents_fts USING fts5(
  id UNINDEXED,
  content,
  title,
  metadata,
  tokenize='unicode61'
);
```

FTS5 內建 BM25 評分，`unicode61` tokenizer 支援多語言中文分詞。攀岩術語、路線名稱、岩場地名都能精確命中。

## 向量搜尋（Semantic Search）

向量搜尋把查詢和文件都轉成高維向量，用 cosine similarity 衡量語義相近度。

模型選用 `@cf/baai/bge-m3`（1024 維），多語言訓練，繁體中文表現優異。一個攀岩相關的查詢「哪裡可以練習抱石」，能找到包含「boulder problem」、「抱石區」、「bouldering」等不同說法的文件。

搜尋流程：

```
Query → Embedding（BGE-M3）→ 向量 → Vectorize（cosine search）→ Top-K 候選
```

Cloudflare Vectorize 管理向量索引，支援 `namespace` 區隔和 metadata 過濾，避免全表掃描。

## 並行執行，多路搜尋

Hybrid Search 的實作是**並行啟動多路搜尋**，同時送出：

```typescript
const [vectorResults, bm25Results] = await Promise.all([
  searchVectorize(queryVector, filter, topK),
  searchBM25(query, filter, topK),
]);
```

每路各取 Top-K（通常是 20），最後送進 RRF 融合。

## RRF（Reciprocal Rank Fusion）

RRF 是融合多路排序結果的經典演算法，不依賴分數的絕對值，只看**名次**：

```
RRF_score(d) = Σ 1 / (K + rank_i(d) + 1)
```

- `K`：平滑參數（通常設 60），避免名次極端時分數暴增
- `rank_i(d)`：文件 d 在第 i 路結果中的名次
- 文件在多路中都出現，分數會疊加

這個設計的好處是**模型無關**：不需要 normalize 不同來源的分數（BM25 和 cosine similarity 的量綱完全不同），直接用名次融合。

```typescript
function rrf(results: SearchResult[][], k = 60): RankedResult[] {
  const scores = new Map<string, number>();

  for (const resultSet of results) {
    resultSet.forEach((doc, index) => {
      const prev = scores.get(doc.id) ?? 0;
      scores.set(doc.id, prev + 1 / (k + index + 1));
    });
  }

  return [...scores.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({ id, score }));
}
```

## Metadata 過濾

搜尋前先根據查詢語義提取 metadata filter，縮小搜尋範圍：

| 欄位 | 說明 | 範例 |
|------|------|------|
| `grade_numeric` | 難度數值（5.10a → 100） | `{ gte: 90, lte: 110 }` |
| `crag_id` / `area_id` | 岩場 / 區域 | `{ eq: "longtung" }` |
| `route_type` | 類型（運攀、傳攀、抱石） | `{ eq: "sport" }` |
| `type` | 文件類型（route / crag / video） | `{ eq: "route" }` |

Filter 同時套用到向量搜尋（Vectorize 原生支援）和 BM25（WHERE clause），保持兩路的結果集一致。

## 降級策略

Embedding API 偶爾超時（Cloudflare Workers AI 的限制），所以系統有降級設計：

- Embedding 超時或失敗 → **僅使用 BM25 結果**，不中斷服務
- BM25 失敗（罕見）→ 僅使用向量搜尋結果

這確保了即使其中一路失敗，查詢仍然能返回結果。

## 整體架構

```
User Query
    ↓
[Filter Extraction] ← NLP 提取 grade / location / type
    ↓
    ├→ [BGE-M3 Embedding] → [Vectorize] → Vector Results
    │
    └→ [D1 FTS5 BM25]                 → BM25 Results

                         ↓ 兩路並行
                       [RRF Fusion]
                         ↓
                   Merged Candidates
                         ↓
               [Cross-Encoder Reranking]
```

## 整體來說

Hybrid Search 的本質是**召回率與精確度的互補**。向量搜尋提供語義覆蓋，BM25 提供關鍵字精準，RRF 以名次為基礎中立融合。這套組合在攀岩這種有大量專業術語（路線等級、岩場地名、技術術語）同時又需要語義理解（「適合初學者」、「風景優美」）的場景下，效果明顯優於任何單一搜尋方式。

工程成本也不高：BM25 用 SQLite FTS5 就能搞定，不需要額外服務。真正的挑戰在 filter 提取的準確度，這部分依賴前一步的 NLP 解析品質。
