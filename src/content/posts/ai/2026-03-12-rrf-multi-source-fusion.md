---
title: "RRF：RAG 系統裡多路結果怎麼合併"
date: 2026-03-12
type: guide
category: ai
tags: [rag, rrf, fusion, ranking, multi-source, retrieval]
lang: zh-TW
tldr: "BM25、向量搜尋、HyDE、Multi-Query 各出一份結果，怎麼合理地合成一份？RRF 用名次而不用分數，規避了跨系統分數無法比較的根本問題。"
description: "RRF（Reciprocal Rank Fusion）的設計原理、與 Score Normalization 和 Weighted Sum 的比較，以及在 RAG 多路搜尋場景中的應用。"
draft: false
series:
  name: "RAG 技法大全"
  order: 18
---

> 🌏 [English version](/posts/ai/2026-03-12-rrf-multi-source-fusion-en)

RAG 系統越做越複雜，搜尋結果的來源也越來越多：

- 查詢本身的 embedding → 向量搜尋結果
- HyDE 假設文件的 embedding → 另一組向量搜尋結果
- Multi-Query 擴展的 3-5 個子查詢 → 各自的向量搜尋結果
- BM25 全文搜尋 → 關鍵字匹配結果

每一路都有自己的結果集和排序。問題來了：**怎麼把這六、七路結果合理地融合成一份**？

## 問題的根源：分數無法比較

最直覺的做法是把所有分數加總，按總分排名。但這有個根本問題：**不同來源的分數量綱不同**。

- 向量搜尋的 cosine similarity：範圍 0.0 – 1.0，一般命中結果集中在 0.7–0.9
- BM25 分數：範圍可能是 0–50，分布取決於文件庫大小和詞頻
- Cross-Encoder：範圍 0.0 – 1.0，但分布與向量 cosine 不同

直接相加，BM25 的數值範圍就會主導結果，向量搜尋的細微差距被淹沒。

### Score Normalization 的問題

一個改進是先做 Min-Max Normalization，把各路分數都縮放到 0-1：

```
normalized = (score - min) / (max - min)
```

然後加權相加：

```
final = w1 × normalized_vector + w2 × normalized_bm25 + ...
```

這看起來合理，但有幾個問題：

1. **Min-Max 受極值影響**：一個異常高分的文件會把其他所有文件壓縮到很低的範圍
2. **需要確定權重**：`w1`、`w2` 怎麼設？不同查詢類型的最優權重可能不同
3. **Normalization 有意義嗎**：向量分數 0.85 和 BM25 分數 0.85 代表的「好」是一樣的嗎？不一定

## RRF 的解法

RRF（Reciprocal Rank Fusion）完全放棄比較分數，只看**名次**：

```
RRF_score(d) = Σ 1 / (k + rank_r(d))
```

- `rank_r(d)`：文件 d 在第 r 路結果中的名次，**從 1 開始**（原始論文把每一路定義成 1..|D| 的排列）
- `k`：平滑參數，原始論文用 60
- 如果文件在某路沒出現，不計入這路的分數（貢獻 0）

實作時如果你的名次是 0-indexed，記得寫成 `1 / (k + rank + 1)`，才會對上論文的定義。

文件的 RRF 分數是所有路次的倒數名次之和。**名次第 1 的文件得 1/(60+1) ≈ 0.016，名次第 10 的得 1/(60+10) ≈ 0.014**，分數差距不大但有序。

### k=60 的意義

k 是個平滑係數，防止第 1 名和第 2 名之間分數差距過大：

| k | 第 1 名 | 第 10 名 | 差距 |
|---|---------|----------|------|
| 0 | 1.000 | 0.100 | 10x |
| 10 | 0.091 | 0.050 | 1.8x |
| 60 | 0.0164 | 0.0143 | 1.15x |

k=60 讓名次的影響比較「溫和」，不讓單一路的第 1 名直接碾壓所有其他路的結果。

不過 60 這個數字的來歷值得說清楚：Cormack et al. 原文的說法是「k=60 是在前導實驗中定下、後續驗證過程都沒有再改動」，並不是跨場景調校出來的最優值。它是個好用的預設，不是被證明過的最佳解。k 調小會把權重集中到前幾名（極端情況接近「只看第一名」），調大則讓名次差異更平緩；如果你明確知道某一路的品質特別好，把 k 調小反而合理。

## 為什麼名次比分數更可靠

RRF 的核心假設：**一個搜尋系統在自己的評分範圍內的排序是可信的，但分數的絕對值不可信**。

BM25 說「這個文件在關鍵字匹配上排名第 3」，這個排名是有意義的。但 BM25 說「這個文件分數 23.7」，這個數字在向量搜尋的世界裡沒有任何意義。

名次是一個通用語言，所有搜尋系統都能說同一種語言。RRF 就是利用這個通用語言做融合。

## 多路融合的實際效果

在 NobodyClimb 的搜尋場景，複雜查詢時最多有 6 路並行搜尋：

```
路 1：query embedding → 向量搜尋
路 2：HyDE embedding → 向量搜尋
路 3：sub_query_1 embedding → 向量搜尋
路 4：sub_query_2 embedding → 向量搜尋
路 5：sub_query_3 embedding → 向量搜尋
路 6：BM25 全文搜尋
```

一個文件如果在 6 路中都出現且名次都高，它的 RRF 分數遠超過只在 1-2 路出現的文件：

```
文件 A（6 路都排第 1）：6 × 1/(60+1) ≈ 0.098
文件 B（只在 1 路排第 1）：1 × 1/(60+1) ≈ 0.016
```

這個特性很直觀：**越多不同角度的搜尋都認為相關，就越可能真的相關**。

## RRF 的限制

RRF 不是萬能的，幾個已知的弱點：

**1. 忽略分數差距**

向量搜尋中第 1 名（0.95）和第 2 名（0.60）的差距很大，但在 RRF 裡，兩者只差 `1/(61) - 1/(62) ≈ 0.0003`。如果這個分數差距是有意義的訊號，RRF 會把它丟掉。

**2. 各路品質不等**

如果某一路搜尋品質很差（比如 Multi-Query 生成了一個離題的子查詢），它的結果也會參與 RRF，可能引入噪音。處理方式：在 Multi-Query 生成後做品質過濾，把太偏離原始查詢語義的子查詢丟掉，不讓它參與搜尋。

**3. 不是精度上限**

RRF 的賣點是零訓練成本，不是最強的融合精度。Bruch、Gai & Ingber（*An Analysis of Fusion Functions for Hybrid Retrieval*, TOIS 2023）系統性比較過 RRF 與「把分數正規化後做凸組合（convex combination）」，結論是凸組合在 in-domain 與 out-of-domain 都勝過 RRF，而且只需要少量樣本就能把那唯一的權重調到目標領域；同一份研究也指出 RRF 對 k 值敏感。換句話說：手上有標註資料、願意為每個領域調一次權重的話，加權融合值得試；沒有標註資料時，RRF 仍然是最省事的預設。

**4. 計算複雜度**

路數越多，需要合併的候選越多。6 路各取 Top-20，合併後有多達 120 個候選（去重後通常 30-50 個）。後續的 Cross-Encoder Reranking 要對這些候選逐一評分，候選數影響 Reranker 的延遲。

實際上，Cross-Encoder 是在 RRF 之後、只對 Top-N（例如 30 個）做精排，不需要對所有 120 個都跑。

## 整體架構中的位置

```
[多路搜尋結果]
  ├ 向量搜尋 (query)   → [d1, d3, d7, ...]
  ├ 向量搜尋 (HyDE)    → [d2, d1, d5, ...]
  ├ 向量搜尋 (sub_q1)  → [d3, d1, d9, ...]
  ├ 向量搜尋 (sub_q2)  → [d7, d4, d1, ...]
  └ BM25               → [d1, d6, d3, ...]
                          ↓
                       [RRF 融合]
                          ↓
                   Merged & Ranked List
                          ↓
                   [Cross-Encoder 精排]
                          ↓
                       Final Top-K
```

RRF 是第一次粗排（聚合多路訊號），Cross-Encoder 是第二次精排（精確相關性評分）。兩者角色不同，缺一不可。

## 整體來說

RRF 的設計哲學是**實用主義**：與其試圖把不同系統的分數「對齊」（這在數學上很難做到又有意義），不如用名次這個更可靠的訊號。實作也極其簡單，只有 k 一個參數，預設值就能上線。

代價是它把分數裡的資訊整個丟掉——這是明確的取捨，不是免費的午餐。有標註資料時，調過權重的分數融合仍然贏得了它。

這種「把複雜問題簡化到最核心」的思路，是很多好設計的共同特徵。

---

## 參考資料

- [Reciprocal Rank Fusion outperforms Condorcet and Individual Rank Learning Methods (Cormack, Clarke & Buettcher, SIGIR 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114)（[作者自存 PDF](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)）
- [An Analysis of Fusion Functions for Hybrid Retrieval (Bruch, Gai & Ingber, TOIS 2023)](https://arxiv.org/abs/2210.11934)
- [RAG-Fusion: a New Take on Retrieval-Augmented Generation](https://arxiv.org/abs/2402.03367)
- [Large-Scale Validation and Analysis of Interleaved Search Evaluation (Chapelle et al., 2012)](https://www.cs.cornell.edu/~tj/publications/chapelle_etal_12a.pdf)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
