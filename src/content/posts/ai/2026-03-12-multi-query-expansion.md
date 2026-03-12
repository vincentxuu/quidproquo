---
title: "Multi-Query Expansion：一個問題，多個角度搜尋"
date: 2026-03-12
category: ai
tags: [rag, multi-query, query-expansion, recall, rrf]
lang: zh-TW
tldr: "複雜查詢只用一個向量搜尋容易漏掉相關文件，讓 LLM 改寫成 3-5 個子查詢並行搜尋，召回率顯著提升。"
description: "Multi-Query Expansion 的設計原理：用 LLM 從多個角度改寫查詢，各自搜尋後 RRF 融合，解決單路搜尋的 recall 問題。"
draft: false
---

向量搜尋的結果受限於查詢本身的表達方式。同一個需求，不同措辭的 embedding 可能差距很大，導致遺漏相關文件。

「龍洞適合初學者的路線」這個查詢，向量搜尋只從這個角度出發。但資料庫裡的相關文件可能用「龍洞入門路線」、「龍洞 5.8-5.9」、「龍洞新手友善」、「龍洞保護點密集」等不同描述方式。單一查詢向量只能碰到其中幾個方向，其他方向的文件就漏掉了。

Multi-Query Expansion 的解法很直接：**用 LLM 把原始查詢改寫成多個不同角度的子查詢，各自搜尋，最後融合結果**。

## 改寫策略

```
原始查詢：「龍洞適合初學者的路線推薦」

改寫為：
  1. 「龍洞難度 5.8 到 5.9 的運動攀登路線」        ← 量化難度
  2. 「龍洞新手友善、保護點密集的路線」              ← 安全特性
  3. 「龍洞入門級路線，適合第一次戶外攀岩」          ← 情境描述
  4. 「龍洞 beginner-friendly sport climbing routes」 ← 英文版本
```

每個子查詢從不同語義角度出發，覆蓋資料庫中可能的文件描述方式。

## Prompt 設計

```
你是一個攀岩知識助理。根據以下查詢，從不同角度生成 3-5 個相關子查詢。
子查詢應使用不同的詞彙和表達方式，以提升搜尋的召回率。
每個子查詢一行，只輸出子查詢，不要其他說明。

原始查詢：{query}
```

輸出解析：按行分割，過濾空行，限制最多 5 個（避免過度擴展增加延遲）。

## 執行流程

```
Original Query
     ↓
[LLM: Multi-Query Generator]
     ↓
[Q1, Q2, Q3, Q4] ← 子查詢列表
     ↓
[Embedding Q1] [Embedding Q2] [Embedding Q3] [Embedding Q4]  ← 並行
     ↓              ↓              ↓              ↓
[Search Q1]    [Search Q2]    [Search Q3]    [Search Q4]    ← 並行
     ↓              ↓              ↓              ↓
                  [RRF Fusion]
                     ↓
               Merged Candidates
```

Embedding 和搜尋都是並行執行的，LLM 改寫這步是串行的（因為需要等結果），但已在整體 pipeline 的並行框架下執行（與 HyDE 的 LLM 呼叫並行）。

## 觸發條件

和 HyDE 一樣，只在 `queryType === 'complex'` 時觸發。Simple 查詢語義清晰，不需要額外擴展；SQL 查詢走另一條路。

複雜查詢的特徵：
- 包含多個條件（難度 + 地點 + 類型）
- 語義模糊或多義（「好玩的路線」）
- 需要比較或推薦（「最適合 xxx 的」）

## 與 HyDE 的差異

| | HyDE | Multi-Query |
|---|------|-------------|
| 改寫策略 | 生成理想答案文件 | 生成多個查詢角度 |
| 語義覆蓋 | 查詢 → 答案語義橋接 | 同一需求的多角度表達 |
| 適合場景 | 查詢 vs 文件語言模式差距大 | 需求可以從多個維度描述 |
| 融合方式 | 與原始 query 結果 RRF | 多個子查詢結果 RRF |

實際系統中兩者同時執行，在 RRF 時都作為獨立搜尋路徑：

```
RRF inputs = [
  queryVector results,      // 原始查詢
  hydeVector results,       // HyDE 假設文件
  subQuery1 results,        // Multi-query 子查詢 1
  subQuery2 results,        // Multi-query 子查詢 2
  subQuery3 results,        // Multi-query 子查詢 3
  bm25 results,             // 關鍵字搜尋
]
```

六路結果融合，每個文件的 RRF 分數累加。出現在越多路中排名越高的文件，融合分數越高，這正是我們想要的結果。

## 成本考量

Multi-Query 的主要成本是：
1. **LLM 改寫**：一次額外的 LLM 呼叫（輕量模型即可，改寫不需要大模型）
2. **多路 Embedding**：N 個子查詢各需一次 embedding
3. **多路搜尋**：N 路並行向量搜尋

在攀岩社群這個場景，complex 查詢通常是使用者最需要高品質結果的場景，這個成本是值得的。對 simple 查詢跳過，也避免了不必要的浪費。

## 整體來說

Multi-Query Expansion 本質上是在用 LLM 的語言能力來彌補向量搜尋的覆蓋盲點。單一查詢的 recall 受限於使用者的表達方式，多角度改寫打破這個限制。配合 RRF 融合，不同角度都命中的文件會排名更高，結果品質也更好。
