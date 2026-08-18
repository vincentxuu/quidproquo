---
title: "SPLADE：比 BM25 更聰明的稀疏向量搜尋"
date: 2026-03-12
type: guide
category: ai
tags: [rag, splade, sparse-vector, bm25, retrieval, hybrid-search]
lang: zh-TW
tldr: "BM25 只認識查詢裡出現的詞，SPLADE 能推斷相關詞彙並加入搜尋，在保持關鍵字搜尋精確性的同時獲得部分語義能力。"
description: "SPLADE 稀疏向量搜尋的原理：與 BM25 的差異、與 Dense Vector 的互補關係，以及在 Hybrid Search 中的定位。"
draft: false
series:
  name: "RAG 技法大全"
  order: 12
---

> 🌏 [English version](/posts/ai/2026-03-12-splade-sparse-vectors-en)

向量搜尋（Dense）抓語義，BM25（Sparse）抓關鍵字，Hybrid Search 兩者都用。但 BM25 有個根本限制：它只認識查詢裡**出現過的詞**。

查詢「攀岩新手」，BM25 找的是包含「攀岩」和「新手」這兩個詞的文件。但包含「入門」、「初學者」、「beginner」的文件，BM25 完全看不到。這個問題在向量搜尋那邊靠語義空間解決了，但在關鍵字那邊就是個缺口。

SPLADE（Sparse Lexical and Expansion model）是介於 BM25 和 Dense 向量之間的技術：**用神經網路為查詢和文件生成稀疏向量，向量維度對應詞彙表，但模型會推斷相關詞彙給予非零權重**。

## 運作原理

傳統 BM25 的向量：
```
查詢「攀岩新手」 → [0, 0, ..., 1.2, 0, ..., 0.8, 0, ...]
                                   ↑ 攀岩             ↑ 新手
```
只有出現的詞有非零值。

SPLADE 的向量：
```
查詢「攀岩新手」 → [0, 0, ..., 1.2, 0, ..., 0.8, 0.6, 0.4, 0.3, ...]
                                   ↑ 攀岩      ↑ 新手 ↑ 初學 ↑ 入門 ↑ beginner
```
模型推斷出語義相關的詞彙，給予較低但非零的權重。

這樣的稀疏向量可以用傳統的倒排索引（inverted index）高效搜尋，不需要像 Dense 向量那樣做 ANN（近似最近鄰），但查詢覆蓋範圍比 BM25 大。

## SPLADE vs BM25 vs Dense

| | BM25 | SPLADE | Dense（BGE-M3） |
|---|------|--------|----------------|
| 向量類型 | 稀疏 | 稀疏 | 稠密 |
| 詞彙擴展 | ❌ | ✅ | N/A |
| 語義理解 | ❌ | 部分 | ✅ |
| 精確匹配 | ✅ | ✅ | 弱 |
| 索引大小 | 小 | 小～中 | 大 |
| 搜尋速度 | 快 | 快 | 慢（ANN） |
| 多語言 | 需要分詞器 | 依訓練資料 | ✅ |

SPLADE 的定位是「進化版 BM25」，而不是「簡化版 Dense 搜尋」。它保留了稀疏向量的速度優勢，加入了部分語義擴展能力。

生態系這幾年補起來了：Sentence Transformers 從 v5 起有 `SparseEncoder` 這個一等公民的 API，能直接載入、訓練、評估 SPLADE 系模型；主流向量資料庫（Qdrant、OpenSearch、Elasticsearch⋯⋯）也大多支援稀疏向量欄位。哪家支援到什麼程度變動很快，選型前直接看各家當下的文件比看任何比較表可靠。入門可從 [Sentence Transformers 的 Sparse Encoder 文件](https://sbert.net/docs/sparse_encoder/usage/usage.html)與 [Training Sparse Embedding Models](https://huggingface.co/blog/train-sparse-encoder) 開始。

## 授權是先要看的一關

這點比技術細節更常擋住專案：**Naver 官方的 SPLADE checkpoint（`naver/splade-v3`、`naver/splade-cocondenser-ensembledistil` 等）採 CC-BY-NC-SA 4.0，禁止商業使用**，其中 `splade-v3` 在 Hugging Face 上還是 gated（要先同意條款）。如果你要做的是商業產品，這條就直接判死刑。

想要能商用的稀疏神經檢索，目前比較實際的方向是 OpenSearch 的 neural sparse 系列（Apache-2.0），或直接用 BGE-M3 的稀疏輸出（見下一節）。挑模型時**先看 license 欄位再看分數**。

## 在 Hybrid Search 中的角色

目前 NobodyClimb 的 Hybrid Search 是 Dense（BGE-M3）+ BM25（D1 FTS5）兩路。加入 SPLADE 可以變成三路：

```
Dense（BGE-M3）  → 語義相關性
SPLADE          → 關鍵字 + 詞彙擴展
BM25            → 精確關鍵字

三路 RRF 融合 → 更全面的召回
```

SPLADE 填補的是 Dense 和 BM25 之間的空間：BM25 找不到的近義詞，Dense 有時候又太模糊，SPLADE 在中間這個區域表現更好。

## 實際限制

**語言支援**：SPLADE 的詞彙擴展依賴訓練資料，而 Naver 的官方 checkpoint 是英文為主，沒有繁中版本。

對中文場景，比較務實的替代路線是 **BGE-M3 的稀疏（lexical weights）輸出**：M3-Embedding 這個模型本身就設計成同一次前向可以同時產出 dense、sparse、multi-vector 三種表示，涵蓋 100 多種語言，而且權重是 MIT。也就是說，你不見得需要「一個中文 SPLADE」，可以直接把已經在用的 BGE-M3 多輸出一路稀疏向量來當第三路。代價是要自己跑模型並自己維護倒排索引——後面那句才是真正的工程成本。

**平台支援**：Cloudflare Workers AI 的託管模型清單目前沒有 SPLADE 系模型（BGE-M3 的 Workers AI endpoint 也只給 dense 向量）。要在 Workers 上用稀疏神經檢索，就得呼叫外部服務，多一次跨網路往返的延遲與成本。清單會變，以[官方模型清單](https://developers.cloudflare.com/workers-ai/models/)為準。

**複雜度換算**：加第三路搜尋的邊際效益，要跟 BM25 + Dense 已經涵蓋的範圍對比。如果 Dense 搜尋的語義覆蓋已經夠好，SPLADE 的提升可能有限。

## 什麼時候值得導入

**值得嘗試的情況**：
- 查詢裡大量使用縮寫、別稱、俚語（攀岩術語有很多這類情況）
- Dense 搜尋在專業術語上表現不穩定
- BM25 的 recall 明顯不足

**可以暫時不用的情況**：
- 已有 Contextual Retrieval 讓文件語義更豐富
- 有 Multi-Query 擴展彌補了詞彙覆蓋不足的問題
- 平台不原生支援，需要額外的網路呼叫

## 整體來說

SPLADE 是 BM25 的有力進化，但不是每個系統都需要它。Dense + BM25 + Multi-Query 的組合在很多場景已經夠好。SPLADE 的價值在於它補了一個特定的空缺：術語近義詞和縮寫擴展，而且用稀疏向量實作所以速度快。

如果你的 RAG 系統在「找不到用不同說法表達同一概念的文件」這個問題上反覆出現，SPLADE 值得認真評估。

---

## 參考資料

- [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking (Formal et al., SIGIR 2021)](https://arxiv.org/abs/2107.05720)
- [SPLADE v2: Sparse Lexical and Expansion Model for Information Retrieval (2021)](https://arxiv.org/abs/2109.10086)
- [SPLADE-v3: New baselines for SPLADE (Lassance et al., 2024)](https://arxiv.org/abs/2403.06789)
- [M3-Embedding（BGE-M3）：Multi-Linguality, Multi-Functionality, Multi-Granularity Text Embeddings](https://arxiv.org/abs/2402.03216)
- [Sentence Transformers：Sparse Encoder 使用文件](https://sbert.net/docs/sparse_encoder/usage/usage.html)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
