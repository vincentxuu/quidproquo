---
title: "MMR + 熱門度加權：讓推薦結果既相關又多樣"
date: 2026-03-12
category: ai
tags: [rag, mmr, diversity, reranking, popularity, recommendation]
lang: zh-TW
tldr: "只看相關性會讓結果都是同一條路線的不同描述，MMR 在相關性和多樣性之間取平衡，再疊加熱門度讓結果更實用。"
description: "MMR（Maximal Marginal Relevance）的演算法原理、λ 參數調整、熱門度加權的設計，以及在攀岩推薦場景的應用。"
draft: false
---

Cross-Encoder Reranking 之後，排名第 1 到第 5 的文件可能都是關於同一條路線的描述——從不同文件來源重複提到龍洞某條 5.11a 的路線。這些文件對查詢都很相關，但作為 context 送進 LLM 是一種浪費：重複的資訊不會讓回答更好，反而佔用 context 視窗。

MMR（Maximal Marginal Relevance）解決的是這個問題：**在相關性和多樣性之間取平衡，避免把相似的文件都選進去**。

## MMR 演算法

MMR 是個貪心選擇演算法。每次從候選集選一個文件加入已選集，選擇標準：

```
MMR(d) = λ × relevance(d, query) - (1 - λ) × max_sim(d, already_selected)
```

- `relevance(d, query)`：文件對查詢的相關性（Cross-Encoder 分數）
- `max_sim(d, already_selected)`：文件與已選文件中最相似者的相似度
- `λ`：相關性的權重（0 → 完全多樣，1 → 完全相關）

**第一個文件**：直接選相關性最高的，沒有「已選集」做比較。

**第二個文件**：在剩餘候選中找 MMR 分數最高的。與已選文件高度相似的候選，`max_sim` 項很大，MMR 分數被壓低。

**依此類推**，直到選夠 `top_k` 個或候選耗盡。

## 相似度計算

文件間的相似度不用 embedding cosine（太耗計算），而是基於 metadata 的結構化相似度：

```typescript
function documentSimilarity(a: Document, b: Document): number {
  let score = 0;

  // 同一岩場 → 高相似
  if (a.crag_id && a.crag_id === b.crag_id) score += 0.4;

  // 難度接近（數值差 < 5）→ 相似
  if (Math.abs(a.grade_numeric - b.grade_numeric) < 5) score += 0.3;

  // 同一攀岩類型
  if (a.route_type === b.route_type) score += 0.2;

  // 同一文件類型（route / crag / video）
  if (a.type === b.type) score += 0.1;

  return score;
}
```

這個 metadata-based 相似度計算便宜很多，對攀岩內容也很直觀：來自同一岩場的文件，最可能在內容上重複。

## λ 參數的意義

λ 決定推薦的「個性」：

| λ 值 | 效果 | 適合場景 |
|------|------|---------|
| 0.9 | 幾乎完全按相關性 | 使用者問明確問題 |
| 0.7 | 相關性優先，保留一定多樣性 | 一般推薦（預設） |
| 0.5 | 相關性與多樣性各半 | 探索型查詢 |
| 0.3 | 多樣性優先 | 「給我驚喜」場景 |

系統的預設值是 0.7，可以通過 `ai_config` 動態調整，不需要重新部署。

## 熱門度加權

MMR 之後再做一次熱門度加權排序：

```typescript
const finalScore = mmrScore + popularityWeight * popularityScore;
```

`popularityScore` 根據路線/岩場的點擊率、評分、評論數計算。熱門度加權的邏輯很簡單：當兩個文件 MMR 分數接近時，讓社群認可度高的排前面，推薦出來的路線更可能讓使用者滿意。

這也解決了一個 embedding 的盲點：一條新路線（資訊完整，評分高）和一條熱門老路線的 embedding 距離可能差不多，但使用者更可能喜歡有口碑的。

## 整體選取流程

```
Cross-Encoder 排序後候選
        ↓
[MMR 貪心選取] ← λ=0.7
        ↓
MMR 選取結果（Top-K 個）
        ↓
[熱門度加權排序]
        ↓
最終文件集 → LLM 生成 context
```

## 整體來說

MMR 在 RAG 系統中經常被低估。把 Top-10 相關文件直接送進 LLM，和 MMR 選出 10 個多樣的相關文件，前者的 context 往往有很多重複資訊，後者能讓 LLM 看到問題的不同面向，回答更全面。

加上熱門度加權，推薦結果既有語義相關性（向量搜尋 + 重排序），又有社群驗證（熱門度），是一個在算法嚴謹性和使用者體驗之間找到平衡的設計。
