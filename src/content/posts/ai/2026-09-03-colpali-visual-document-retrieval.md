---
title: "ColPali：跳過 OCR，直接用圖片做文件檢索"
date: 2026-09-03
type: deep-dive
category: ai
tags: [colpali, visual-rag, late-interaction, document-retrieval, multi-vector, rag]
lang: zh-TW
tldr: "ColPali 把 PDF 每頁渲染成圖片，用 vision-language model 產生 patch-level multi-vector embedding，用 MaxSim 做 late interaction 檢索。表格密集的金融 PDF 上 recall 從 62% 跳到 84%，完全跳過 OCR 和 chunking。代價是儲存量 ~100 倍、需要 GPU、BM25 不可用。"
description: "ColPali 的設計原理：從 OCR pipeline 的結構性失敗出發，解釋 patch-level multi-vector embedding 與 MaxSim late interaction 的運作方式，比較 ColPali / ColQwen2.5 / ColSmol 模型家族，以及 ViDoRe benchmark 的評測結果。"
draft: false
series:
  name: "RAG 技法大全"
  order: 49
---

> 🌏 [English version](/en/posts/ai/2026-09-03-colpali-visual-document-retrieval-en)

傳統 RAG pipeline 處理文件的路徑是 OCR → 文字擷取 → chunking → embedding。這條路徑在純文字文件上運作良好，但在表格、圖表、複雜版面的 PDF 上，每一步都在丟失資訊。ColPali 提出一個根本不同的做法：跳過整條文字管線，直接把頁面當圖片處理。

## OCR Pipeline 的結構性失敗

文字擷取管線的問題不是某一步做得不好，而是錯誤會逐步累積：

**OCR 階段**：掃描品質差、多欄排版、表格儲存格內的小字，都會產生辨識錯誤。依 [arXiv:2410.21169](https://arxiv.org/abs/2410.21169) 的調查，即使是最先進的 OCR 引擎，在複雜版面上的字元錯誤率仍在 2-5%。

**版面分析**：表格邊界偵測、多欄拆分、圖文混排區域分割——每個都是獨立的機器學習問題，各自有各自的失敗模式。一個表格被錯誤拆成兩段，後續所有處理都會連帶出錯。

**Chunking**：即使文字擷取完美，固定大小的 chunking 仍然會把表格切碎。後續 chunk 失去表頭，embedding 品質下降，語意檢索就會偶發漏掉關鍵列。依 [arXiv:2605.00318](https://arxiv.org/abs/2605.00318) 的評測，表格切碎是 RAG 系統在結構化文件上最常見的失敗原因。

ColPali 的思路是：**與其修補每一步，不如跳過整條管線**。

## ColPali 的設計

ColPali（Faysse et al., ICLR 2025）把 [ColBERT](/posts/ai/2026-03-12-colbert-late-interaction) 的 late interaction 機制從文字 token 搬到了圖片 patch 上。

### 流程

```
傳統 pipeline:
  PDF → OCR → 文字 → Chunking → Embedding（單向量）→ 檢索

ColPali:
  PDF → 頁面渲染成圖片 → VLM patch embedding（多向量）→ 檢索
```

1. **頁面渲染**：PDF 每頁渲染成 448×448 像素的圖片
2. **Patch Embedding**：用 vision-language model（VLM）的 ViT encoder 處理圖片，產生 1,030 個 patch token，每個 patch 經線性投影到 128 維向量
3. **MaxSim 檢索**：查詢文字同樣產生 token-level 向量，用 MaxSim（每個 query token 對所有 document patch 取最大相似度，加總）計算相關性

### MaxSim：跟 ColBERT 一模一樣的計算

```
ColBERT:
  Query text tokens   ⟷ MaxSim ⟷  Document text tokens
  [q1, q2, q3]              [d1, d2, ..., d200]

ColPali:
  Query text tokens   ⟷ MaxSim ⟷  Document image patches
  [q1, q2, q3]              [p1, p2, ..., p1030]

Score = Σᵢ max_j sim(qᵢ, pⱼ)
```

差別只在文件端：ColBERT 每個 token 一個向量，ColPali 每個 image patch 一個向量。查詢端都是文字 token。MaxSim 的計算方式完全相同——每個查詢 token 在文件的所有表示中找最相似的那個，加總得到相關性分數。

這個設計讓 ColPali 能做到**跨模態的細粒度匹配**：query 裡的「B1 規範」這幾個字元，可以直接跟表格圖片中對應儲存格區域的 patch 匹配上，不需要先把表格轉成文字。

## 模型家族

ColPali 不是一個模型，而是一個架構。隨著底層 VLM 演進，已經產生一個模型家族：

| 模型 | 底層 VLM | 參數量 | Patch 數/頁 | ViDoRe V1 nDCG@5 |
|---|---|---|---|---|
| ColPali v1.3 | PaliGemma-3B | 3B | 1,024 | ~81 |
| ColQwen2.5 v0.2 | Qwen2-VL-3B | 3B | 動態（PatchMerger） | ~84 |
| ColSmol-500M | SmolVLM | 500M | ~832 | ~74 |

依 [colpali GitHub](https://github.com/illuin-tech/colpali) 的說明：

- **ColPali v1.3** 是原始版本，固定 32×32 grid，每頁 1,024 個 patch
- **ColQwen2.5** 用 Qwen2-VL 取代 PaliGemma，支援動態解析度，目前效果最好
- **ColSmol-500M** 是輕量版，參數量只有 1/6，可以在消費級 GPU 甚至 Apple Silicon 上跑

2026 年的最新發展：**colpali-engine 套件已被標記為 deprecated**，官方推薦遷移到 Sentence Transformers v6 的 `MultiVectorEncoder`。API 變得更簡潔：

```python
from sentence_transformers import MultiVectorEncoder

model = MultiVectorEncoder("vidore/colqwen2-v1.0")

query_embeddings = model.encode_query(queries)
document_embeddings = model.encode_document(images)
scores = model.similarity(query_embeddings, document_embeddings)
```

## ViDoRe Benchmark：專門評測視覺文件檢索

ColPali 團隊同時建立了 ViDoRe（Vision Document Retrieval）benchmark，分三個版本逐步提高難度：

| 版本 | 範圍 | 重點 |
|---|---|---|
| V1 | 技術 PDF + 簡報，10 個子任務 | 科學和產業文件，in-domain 評測 |
| V2（[arXiv:2505.17166](https://arxiv.org/abs/2505.17166)） | 零樣本跨領域，多語言查詢 | 更真實的使用情境，查詢不依賴文件內容 |
| V3（[arXiv:2601.08620](https://arxiv.org/abs/2601.08620)） | 多跳推理、開放式問題、非文字查詢 | 真實世界的複雜檢索場景 |

V1 上頂級模型已接近飽和（nDCG@5 > 90），但到了 V3，**即使最好的 late-interaction 模型也低於 65% nDCG@10**——特別是多跳、開放式和非文字查詢仍然很難。依 [Emergent Mind 的整理](https://www.emergentmind.com/topics/vidore-benchmarks)，在 V1 上表現優異的模型到 V2/V3 會明顯掉分，顯示泛化能力仍有缺口。

這個 benchmark 本身的意義不亞於模型：它把「文件檢索」的評測標準從純文字拉到了視覺層面。

## 效能與代價

### 效能優勢

Particula 的評測數據最直觀：金融 PDF（大量表格和圖表）上，傳統 dense retrieval recall 62%，ColQwen 達到 84%。差距最大的場景正是結構化版面——表格結構被 100% 保留，不像 text chunking 會切碎。

依 [arXiv:2602.12510](https://arxiv.org/abs/2602.12510)（Visual RAG Toolkit），用 2-stage retrieval（先粗篩再 MaxSim 精排），ColPali 和 ColQwen2.5 都能達到 ~4× QPS 提升，同時 nDCG@5 和 nDCG@10 幾乎無損（±0.01）。

### 代價

| 維度 | ColBERT（文字） | ColPali（視覺） | 影響 |
|---|---|---|---|
| 向量數/文件 | ~200（每 token） | ~1,030（每 patch） | 儲存 ~5× |
| 向量維度 | 128 | 128 | 相同 |
| 索引大小 vs Bi-Encoder | ~200× | ~1,030× | 明顯更大 |
| 全文搜尋（BM25） | ✅ 可用 | ❌ 無文字 | 混合檢索不可用 |
| 推論硬體 | CPU 可跑 | 需要 GPU | 基礎設施成本 |
| Ingestion 速度 | 快 | 慢（VLM 推論） | 大量文件入庫耗時 |

最大的限制不是效能，而是**架構相容性**：ColPali 完全跳過文字擷取，意味著 BM25 全文搜尋不可用。在混合檢索（BM25 + 向量）已是標準做法的 RAG 系統中，引入 ColPali 等於放棄半條檢索管線。

生產環境的解法是**混合架構**：對文字為主的文件走傳統管線，對表格/圖表密集的文件走 ColPali。依 Spheron 的實作指南，Qdrant 已支援 multi-vector collection 的 MaxSim 計算，Vespa 也支援 phased retrieval 來擴展到大規模語料。

## 跟既有 RAG 技法的定位

ColPali 不是要取代整個 RAG pipeline，而是填補一個特定空缺：

```
文件類型光譜：

純文字文件 ─────────────────────── 表格/圖表密集 PDF
    │                                      │
    ├─ 傳統 chunking + embedding           ├─ ColPali
    ├─ Contextual Retrieval                ├─ ColQwen2.5
    ├─ Hybrid Search (BM25 + 向量)         │
    ├─ Reranking                           │
    └─ Header Propagation (表頭修補)        └─ 完全跳過文字
```

- 如果文件以文字為主，表格只是偶爾出現 → [Header Propagation](/posts/ai/2026-03-12-chunking-strategies) + [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) 就夠了
- 如果文件大量是表格、圖表、掃描件 → ColPali 是目前效果最好的方案
- 混合語料（兩者都有）→ 按文件類型路由到不同管線

## 後續發展

ColPali 的影響不只在模型本身，而是打開了一條新的研究方向：

**Vision-Guided Chunking**（[arXiv:2506.16035](https://arxiv.org/abs/2506.16035)）：不完全跳過文字，而是用視覺資訊引導 chunking 邊界——讓模型看到頁面圖片來決定該在哪裡切。這是 ColPali「全視覺」和傳統「全文字」之間的折衷。

**ViDoRe V3 的挑戰**：即使 ColPali 家族在 V1 上接近飽和，V3 揭示了多跳推理和跨頁面關聯仍然是未解問題。late-interaction 在單頁檢索上很強，但跨頁面的全域推理需要不同的架構。

**Sentence Transformers 統一生態**：colpali-engine 併入 Sentence Transformers v6 的 `MultiVectorEncoder`，讓 ColBERT（文字）和 ColPali（視覺）共用同一套 API 和基礎設施。這降低了採用門檻——不需要學新框架，已經用 Sentence Transformers 的團隊可以直接加入視覺檢索能力。

## 整體來說

ColPali 示範了一個優雅的概念延伸：ColBERT 證明了 late interaction + MaxSim 在文字檢索上的價值，ColPali 把同一個機制原封不動搬到圖片 patch 上，就解決了 OCR pipeline 的結構性問題。概念簡單，效果顯著。

但「簡單」不等於「通用」。ColPali 目前最適合的場景是表格/圖表密集的 PDF 語料庫——金融報告、法規文件、技術規格書。在這些場景，它的 recall 優勢（+22 個百分點）值得付出儲存和 GPU 的代價。對文字為主的文件，傳統管線加上表頭修補和 Contextual Retrieval 仍然是更經濟的選擇。

未來最可能的走向不是「ColPali 取代一切」，而是**按文件類型路由到最適合的檢索管線**——這跟 RAG 領域的整體趨勢（adaptive retrieval、query routing）完全一致。

## 參考資料

- [ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)](https://arxiv.org/abs/2407.01449)
- [ViDoRe Benchmark V2: Raising the Bar for Visual Retrieval (arXiv:2505.17166)](https://arxiv.org/abs/2505.17166)
- [ViDoRe V3: A Comprehensive Evaluation of RAG in Complex Real-World Scenarios (arXiv:2601.08620)](https://arxiv.org/abs/2601.08620)
- [Visual RAG Toolkit: Scaling Multi-Vector Visual Retrieval (arXiv:2602.12510)](https://arxiv.org/abs/2602.12510)
- [Vision-Guided Chunking: Enhancing RAG with Multimodal Document Understanding (arXiv:2506.16035)](https://arxiv.org/abs/2506.16035)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects (arXiv:2410.21169)](https://arxiv.org/abs/2410.21169)
- [Structure-Aware Chunking for Tabular Data in RAG (arXiv:2605.00318)](https://arxiv.org/abs/2605.00318)
- [ColPali GitHub — illuin-tech/colpali](https://github.com/illuin-tech/colpali)
- [Sentence Transformers v6 MultiVectorEncoder — Hugging Face Blog](https://huggingface.co/blog/multi-vector-encoder)
- [Visual RAG vs OCR: ColPali for PDF Tables and Charts — Particula](https://particula.tech/blog/visual-rag-vs-ocr-colpali-pdf-tables-charts)
- [An Overview of Late Interaction Retrieval Models — Weaviate](https://weaviate.io/blog/late-interaction-overview)
- [ColBERT：向量搜尋的第三條路](/posts/ai/2026-03-12-colbert-late-interaction)
- [Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)
- [Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」](/posts/ai/2026-03-12-contextual-retrieval)
