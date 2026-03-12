---
title: "ColBERT：向量搜尋的第三條路"
date: 2026-03-12
category: ai
tags: [rag, colbert, late-interaction, retrieval, reranking]
lang: zh-TW
tldr: "Bi-Encoder 太粗糙，Cross-Encoder 太慢，ColBERT 的 Late Interaction 在兩者之間找到平衡：token 級別的相互比較，但可以預先計算文件向量。"
description: "ColBERT Late Interaction 的設計原理：與 Bi-Encoder、Cross-Encoder 的比較，MaxSim 計算方式，以及在 RAG 系統中的應用場景。"
draft: false
---

向量搜尋的架構可以分三類，理解三者的取捨，才能選到最適合的方案。

**Bi-Encoder**（雙塔模型）：查詢和文件分別 embed 成單一向量，cosine similarity 評分。速度快，可以做 ANN 搜尋，但查詢和文件的 token 之間沒有互動，精度有限。

**Cross-Encoder**（交叉注意力）：查詢和文件一起送進 Transformer，token 互相 attention，精度最高。但每對 (query, doc) 都要跑一次，O(n) 計算，不適合在大索引上用，只能做精排。

**ColBERT（Late Interaction）**：介於兩者之間。查詢和文件**分別 embed，但保留每個 token 的向量**，而不是壓縮成單一向量。相關性計算時，對每個查詢 token 找文件中最相似的 token（MaxSim），加總得到分數。

## MaxSim 計算

```
Query tokens:    [q1, q2, q3, q4]       → 4 個向量
Document tokens: [d1, d2, d3, ..., d20] → 20 個向量

Score(query, doc) = Σᵢ max_j sim(qᵢ, dⱼ)

q1 和文件中所有 token 比較 → 取最高分
q2 和文件中所有 token 比較 → 取最高分
q3 和文件中所有 token 比較 → 取最高分
q4 和文件中所有 token 比較 → 取最高分
總分 = 四個最高分相加
```

這個設計保留了 token 級別的細粒度比較（接近 Cross-Encoder），同時因為文件向量可以**預先計算存好**，不需要在查詢時重新跑整個 Transformer（比 Cross-Encoder 快很多）。

## 與 Bi-Encoder、Cross-Encoder 的比較

| | Bi-Encoder | ColBERT | Cross-Encoder |
|---|-----------|---------|--------------|
| 查詢向量 | 1 個 | N_q 個（每 token） | N/A |
| 文件向量 | 1 個 | N_d 個（每 token） | N/A（整合計算） |
| 文件向量預計算 | ✅ | ✅ | ❌ |
| Token 互動 | ❌ | 部分（MaxSim） | ✅（完整 attention） |
| 索引大小 | 小 | 大（N_d 倍） | N/A |
| 搜尋速度 | 快 | 中 | 慢 |
| 精度 | 低 | 中高 | 高 |

ColBERT 的代價是索引大小：每個文件不是一個向量，而是每個 token 一個向量。一個 200 token 的文件，ColBERT 索引裡就有 200 個向量。在大規模索引時，儲存成本和搜尋時間都會顯著上升。

## ColBERTv2 的改進

原始 ColBERT 的索引太大，ColBERTv2 用 **residual compression** 大幅壓縮：

- 用 k-means 對所有 token 向量做聚類（通常 64 或 256 個中心）
- 每個向量存「最近的中心 + 殘差向量」
- 殘差用 2-bit 量化

壓縮後索引大小縮小 6-10 倍，精度損失很小。

## 在 RAG 系統中的定位

ColBERT 可以用在兩個地方：

**作為第一階段搜尋（取代 Bi-Encoder）**：精度比 Bi-Encoder 好，但索引大、速度慢，適合文件數量不超過幾十萬的場景。

**作為第二階段重排（取代 Cross-Encoder）**：比 Cross-Encoder 快（文件向量預計算），精度接近，適合候選數量較多時（幾百個）的重排。

在攀岩社群的規模（幾千到幾萬條路線），ColBERT 用作重排是合理的，索引大小可控。

## 實際使用

目前最成熟的實作是 Stanford 的 **RAGatouille** 套件：

```python
from ragatouille import RAGPretrainedModel

RAG = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

# 索引文件
RAG.index(
    collection=documents,
    index_name="climbing-routes",
)

# 搜尋
results = RAG.search(query="龍洞適合中級的路線", k=10)
```

但在 TypeScript / Cloudflare Workers 的環境，ColBERT 的支援還很有限。要用的話，需要起一個獨立的 Python 服務，增加了架構複雜度。

## 整體來說

ColBERT 是向量搜尋架構的一個有趣中間地帶，理論上很漂亮。但在實際部署時，索引大小的問題和工程生態系的不成熟（特別是 TypeScript 環境）讓它沒有 Bi-Encoder + Cross-Encoder 兩階段架構那麼實用。

對大多數 RAG 系統，現有的 Bi-Encoder 搜尋 + Cross-Encoder 重排是更成熟的選擇。ColBERT 值得關注，特別是當 ColBERTv2 的壓縮技術讓索引成本降到可接受的範圍，以及更多平台開始原生支援的時候。
