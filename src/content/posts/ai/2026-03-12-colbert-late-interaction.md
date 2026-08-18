---
title: "ColBERT：向量搜尋的第三條路"
date: 2026-03-12
type: guide
category: ai
tags: [rag, colbert, late-interaction, retrieval, reranking]
lang: zh-TW
tldr: "Bi-Encoder 太粗糙，Cross-Encoder 太慢，ColBERT 的 Late Interaction 在兩者之間找到平衡：token 級別的相互比較，但可以預先計算文件向量。"
description: "ColBERT Late Interaction 的設計原理：與 Bi-Encoder、Cross-Encoder 的比較，MaxSim 計算方式，以及在 RAG 系統中的應用場景。"
draft: false
series:
  name: "RAG 技法大全"
  order: 13
---

> 🌏 [English version](/posts/ai/2026-03-12-colbert-late-interaction-en)

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

原始 ColBERT 的索引太大，ColBERTv2（NAACL 2022）用 **residual compression** 大幅壓縮：

- 用 k-means 產生一組中心點，論文的經驗法則是中心數量正比於語料中 token 向量總數的**平方根**（實作上取大於 `16 × √n` 的最近 2 的次方）——也就是幾千到幾十萬個中心，不是幾十個
- 每個向量存「最近中心的索引 + 量化後的殘差」
- 殘差的每個維度量化成 **1 或 2 bits**；以 128 維計算，一個向量約 20 或 36 bytes

論文回報的整體效果是索引空間縮小 6–10 倍，同時品質不降反升。

## 在 RAG 系統中的定位

ColBERT 可以用在兩個地方：

**作為第一階段搜尋（取代 Bi-Encoder）**：精度比 Bi-Encoder 好，但索引大、速度慢，適合文件數量不超過幾十萬的場景。

**作為第二階段重排（取代 Cross-Encoder）**：比 Cross-Encoder 快（文件向量預計算），精度接近，適合候選數量較多時（幾百個）的重排。

在攀岩社群的規模（幾千到幾萬條路線），ColBERT 用作重排是合理的，索引大小可控。

## 實際使用

先釐清一個常見誤會：**ColBERT 本身**出自 Stanford（`stanford-futuredata/ColBERT`），但曾經最多人推薦的高階封裝 **RAGatouille 是 Answer.AI（Benjamin Clavié）的專案，不是 Stanford 的**。而且 RAGatouille 的 PyPI 版本停在 2025 年上半年之後就沒再更新，新專案不建議從它開始。

現在維護最積極的是 LightOn 的 **PyLate**（建在 Sentence Transformers 之上，CIKM 2025 有對應論文），訓練、索引、重排都涵蓋：

```python
from pylate import indexes, models, retrieve

model = models.ColBERT(model_name_or_path="lightonai/GTE-ModernColBERT-v1")

index = indexes.PLAID(index_folder="pylate-index", index_name="climbing-routes")
retriever = retrieve.ColBERT(index=index)

# 索引文件（documents_ids 與 documents 一一對應）
index.add_documents(
    documents_ids=documents_ids,
    documents_embeddings=model.encode(documents, is_query=False, batch_size=32),
)

# 搜尋
scores = retriever.retrieve(
    queries_embeddings=model.encode(["龍洞適合中級的路線"], is_query=True),
    k=10,
)
```

如果只想拿 ColBERT 當重排、不想建索引，PyLate 也有 `rank.rerank()` 直接對候選集打分。

**Checkpoint 選擇**：`colbert-ir/colbertv2.0`（MIT）是經典基準；較新的 `lightonai/GTE-ModernColBERT-v1` 與 `answerdotai/answerai-colbert-small-v1` 都是 Apache-2.0，可商用。要多語言／中文的話 `jinaai/jina-colbert-v2` 是常見選擇，但它是 CC-BY-NC，**商用前務必先確認授權**。這一塊換代很快，實際挑選時直接看 Hugging Face 上各 model card 的當下狀態。

但在 TypeScript / Cloudflare Workers 的環境，ColBERT 的支援還是很有限。要用的話，需要起一個獨立的 Python 服務，增加了架構複雜度。

## 整體來說

ColBERT 是向量搜尋架構的一個有趣中間地帶，理論上很漂亮。Python 這側的生態系這兩年其實補得不錯——PyLate 有人維護，索引後端也從 PLAID 長出了 WARP、TACHIOM 等選擇，其中部分主打 CPU 上就能跑。真正還沒解的是兩件事：**索引仍然是每 token 一個向量**（壓縮只是把倍率壓下來，不是消掉），以及 **TypeScript / edge runtime 幾乎沒有原生支援**，非 Python 的技術棧要用就得多養一個服務。

對大多數 RAG 系統，現有的 Bi-Encoder 搜尋 + Cross-Encoder 重排仍是更省事的選擇。如果你本來就跑 Python、而且已經卡在 Bi-Encoder 精度不夠、Cross-Encoder 又太慢的那個縫，ColBERT 當重排是目前最值得試的一步。

---

## 參考資料

- [ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT (2020)](https://arxiv.org/abs/2004.12832)
- [ColBERTv2: Effective and Efficient Retrieval via Lightweight Late Interaction (NAACL 2022)](https://arxiv.org/abs/2112.01488)
- [PyLate：Late Interaction 模型的訓練與檢索套件（LightOn）](https://lightonai.github.io/pylate/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
