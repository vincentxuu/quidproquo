---
title: "Cross-Encoder Reranking：讓最相關的文件排到前面"
date: 2026-03-12
updated: 2026-09-03
type: guide
category: ai
tags: [rag, reranking, cross-encoder, bge-reranker, retrieval]
lang: zh-TW
tldr: "向量搜尋的相似度分數不等於相關性，Cross-Encoder 用成對比較重新排序，把真正相關的文件推上來。"
description: "Cross-Encoder Reranking 的設計原理、BGE Reranker 的使用、threshold 設定策略，以及與 Bi-Encoder 向量搜尋的互補關係。"
draft: false
series:
  name: "RAG 技法大全"
  order: 19
---

> 🌏 [English version](/posts/ai/2026-03-12-cross-encoder-reranking-en)

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

Cross-Encoder 要對每一個 (query, doc) 配對各跑一次完整的 Transformer forward pass，成本隨候選數線性成長（O(n) 次推論），而且無法像向量那樣預先算好存起來，所以不適合在大規模索引上使用。但在已經縮小到幾十個候選的情況下，計算量完全可控，精度大幅提升。

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
- **模型**：Cloudflare Workers AI 上的 BGE reranker（`@cf/baai/bge-reranker-base`）
- **輸出**：每個文件的相關性分數

分數這件事要講清楚，因為它直接決定 threshold 怎麼設。**Cross-Encoder 的原始輸出是 logit，不是機率，理論上沒有上下界**——BAAI 自己的 model card 就寫「reranker 用 cross-entropy loss 訓練，相關性分數不侷限在特定範圍」，原始分數是可能為負的。Workers AI 的 rerank 回傳的是經過 sigmoid 映射到 [0, 1] 的分數，所以在這個平台上你拿到的確實是 0–1 的值。

但 sigmoid 只是把 logit 壓進區間，不代表它是校準過的機率：logit = 0 剛好對應 0.5，所以「不相關」的文件常常落在 0.5 附近而不是 0。這是為什麼下面那個 0.5 的 threshold 只是一個起手值。

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

這個 `0.5` 不是普世常數，**換一個 reranker 就必須重新校準**：有的服務回傳原始 logit、有的回傳 sigmoid 後的值、有的回傳在候選集內部做過 softmax 的相對分數，同一個數字在不同模型代表的相關性完全不同。連 Cohere 的文件都特別提醒，即使分數已經正規化到 [0, 1]，也不能把 0.9 解讀成「比 0.45 相關兩倍」。實務做法是拿自己的一批標註查詢跑一次，看分數分布再決定切在哪。

`min_keep` 是個重要的安全設計：如果所有候選都分數很低，過濾掉後 LLM 就沒有 context，只能用通用知識回答（容易幻覺）。所以至少保留幾個，讓後面的 LLM-as-Judge 來決定這個回答要不要加免責聲明。

## 跳過條件

候選文件 ≤ 1 時跳過重排序——只有一個候選沒有重排的意義，省下一次 API 呼叫。

```typescript
skipWhen: (ctx) => ctx.candidateMatches.length <= 1
```

## BGE Reranker 的選擇

選它的理由要說實話。**「跟 Embedding 用同一個家族所以向量空間更協調」是講不通的**——Cross-Encoder 根本不產生 embedding，它吃 (query, doc) 直接吐一個分數，跟 Bi-Encoder 之間不存在共用的向量空間。真正的理由是工程面的：它是這個平台上唯一內建的 reranker，走同一個 AI binding、不用多接一家廠商、不用多管一組 API key，延遲也留在同一張網內。

如果要換更強的模型，實際的取捨大致是三條路：

- **留在同一個平台**：撰文當下 Workers AI 的模型目錄裡只有 `bge-reranker-base` 這一個 reranker，所以「換大一號」在這裡不是換個字串就好——`bge-reranker-large` 得自己託管。另外 BAAI 的 v1 系列（base / large）只針對中英文訓練，若你的內容是多語系，官方已經把人導向較新的多語系 reranker。
- **改用 hosted reranker API**：Cohere、Jina、Voyage、Mixedbread 等都有 rerank 端點。這一塊的版本號、模型名與計價變動非常頻繁（例如 Cohere 的 rerank 已經走過 3.0 → 3.5 → 4.0 好幾代、還分 fast / pro），任何寫死在文章裡的型號和單價都會很快過期，實際規格請直接看官方文件。
- **自己託管 Cross-Encoder**：精度和成本都自己控，代價是要自己扛 GPU 與擴容。

決策上真正該量的是三件事：這顆模型支不支援你的語言、單次請求能吃多長的文件（超過就會被截斷，長文件的相關性判斷會失真）、以及你能容忍多少毫秒的額外延遲。這三項在官方文件上都查得到，也都會隨版本改變，所以每次要換模型時重查一次，比記住某個型號有用。

## 2025 進展：從 Pointwise 到 Listwise（jina-reranker-v3 / v3.5）

既有基線仍是典型的兩階段範式：Bi-Encoder 先做大規模召回（例如 top-50）、Cross-Encoder 再對候選做精排（例如 top-5）；上述 Top-100→Top-10 與 RRF 後 20–30 取精排的配置，只是這個範式在本站規模下的具體參數。

2025 年值得關注的新分支是 **listwise reranker**。Jina 在 2025-09-29 發表 **jina-reranker-v3**、2026-07-20 再發 **v3.5**，兩者皆為 **0.6B** 參數的 listwise 架構：論文自報 BEIR 上 nDCG@10 從 **61.94 提升至 63.20**，作者稱已相當於 4B 參數等級模型的表現；半結構化（表格、JSON）場景相對提升約 **+9.6**。

關鍵差異在注意力機制。傳統 Cross-Encoder 是 pointwise 的 `[Query; Doc_i] → score`，每對候選獨立打分；listwise 則把 **query 與多個候選文件放進同一個上下文窗口**，以 **causal attention** 讓模型在一次前向中同時看到所有候選、輸出每個候選在「這個候選集內」的相對相關性，並以末 token 讀出分數。這讓模型能做**跨文檔比較**（例如「哪一份更完整回答了問題」而非各自獨立給分），在**半結構化文件與需要比較多份候選優劣**的查詢上特別有優勢。

v3.5 的工程改動是**混合注意力**：以 3 個滑動窗口注意力搭配 2 個全域注意力層，在保留跨文檔比較能力的同時把延遲進一步壓低，論文稱相較 v3 延遲降低約 **1.56×**，更適合 20–150 候選的批量重排。

取捨與落地提醒：

- **不要照抄榜單數字**。61.94→63.20 與 4B 相當的說法來自作者自家在 BEIR/MIRACL/RTEB 的報告，未與 Cohere / Voyage / bge-reranker-v2 等做同表對照，也未在你的領域資料上驗證過。
- **務必在自家標註集上對照驗證**：拿一批已標註的查詢跑一次，看分數分布再決定 threshold 與是否汰換現有 BGE reranker；榜單領先不代表在你的資料上也會領先。
- 若候選本來就少（< 5）或查詢語義清晰，listwise 的增益有限；候選多、且含表格或半結構化欄位時較值得試。

## 對系統的影響

Reranking 對最終結果品質的影響集中在幾種場景：

**效益最大**：
- 多路搜尋（HyDE + Multi-Query + BM25）帶來大量候選，品質參差不齊
- 查詢意圖複雜，簡單的 cosine similarity 排序容易偏掉
- **結構化文件（表格、財報）**：2026 年一份針對金融文件的 benchmark 顯示，在 BM25 → hybrid → contextual → corrective 的完整 pipeline 中，reranking 是 single most impactful component，MRR@3 提升 **+17.2 個百分點**——這個數字高於 query expansion、hybrid search、甚至 corrective retrieval 各自的增益

**效益較小**：
- 候選本來就少（< 5 個）
- Simple 查詢語義清晰，第一輪搜尋結果本來就不差

整體來說，Reranking 是 RAG pipeline 中 precision 提升最直接的環節，成本也在可接受範圍內（對 30 個候選做 cross-attention 比一次 LLM 生成便宜很多）。

---

## 更新紀錄

- 2026-09-03：補充金融文件 benchmark 數據（arXiv:2604.01733），reranking 在表格密集文件中 MRR@3 +17.2pp
- 2026-08-25：增補 2025 進展（jina-reranker-v3 / v3.5，0.6B listwise、BEIR 61.94→63.20、半結構化 +9.6、混合注意力），說明 listwise 同窗 causal attention 與適用情境，提醒需以自家標註集對照驗證
- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (2019)](https://arxiv.org/abs/1908.10084)
- [Cross-Encoders — Sentence Transformers 官方文件](https://www.sbert.net/examples/cross_encoder/applications/README.html)
- [BAAI/bge-reranker-base — Hugging Face](https://huggingface.co/BAAI/bge-reranker-base)
- [Workers AI 模型目錄（查目前有哪些 reranker）](https://developers.cloudflare.com/workers-ai/models/)
- [Cohere Reranking Best Practices（hosted reranker 的分數解讀說明）](https://docs.cohere.com/docs/reranking-best-practices)
- [A Survey on RAG — Retrieval-Augmented Generation for Large Language Models (2023)](https://arxiv.org/abs/2312.10997)
- [jina-reranker-v3: Last but Not Late Interaction for Document Reranking (2025-09-29)](https://arxiv.org/abs/2509.25085)
- [jina-reranker-v3.5: Efficient Listwise Reranker with Hybrid Attention and Self-Distillation (2026-07-20)](https://arxiv.org/abs/2607.18152)
- [From BM25 to Corrective RAG: Benchmarking Retrieval Strategies for Financial RAG (2026)](https://arxiv.org/abs/2604.01733)
