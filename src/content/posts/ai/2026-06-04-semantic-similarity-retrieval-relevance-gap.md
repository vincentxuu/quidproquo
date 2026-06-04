---
title: "語意相似 ≠ 檢索相關：embedding 檢索系統性失靈的情境、偵測與補救"
date: 2026-06-04
category: ai
type: deep-dive
tags: [retrieval, embedding, rag, vector-search, llm]
lang: zh-TW
tldr: "Cosine similarity 和 relevance 在一整類情境系統性背離：否定詞（NevIR 上多數 IR 模型 ≤ 隨機）、精確識別碼、數值門檻、邏輯組合（SoTA 模型在 LIMIT 上 recall@100 < 20）——其中一部分是單向量範式的理論上限，換大模型無解。補救順序：hybrid BM25 → reranker（Anthropic 實測 −67%）→ 上游 metadata 路由 → 領域微調 / multi-vector。"
description: "整理 dense retrieval 中語意相似度與檢索相關性的落差：LIMIT 的維度上限理論、granularity dilemma、十種高風險 query 情境 checklist、無 ground truth 時的自動偵測方法，以及由便宜到根治的七種補救手段。"
draft: false
glossary:
  - term: "LIMIT"
    definition: "Google DeepMind 的理論與 benchmark（arXiv:2508.21038），證明單向量 embedding 能表示的相關文件組合數受維度上限約束——某些組合在數學上排不出來，SoTA 模型 recall@100 不到 20。"
    context: "本文用 LIMIT 說明哪些檢索失靈是單向量範式的理論上限、換大模型無解。"
  - term: "CapRetrieval"
    definition: "WeChat AI 提出的中文細粒度檢索 benchmark（arXiv:2506.08592），指出 encoder 同時要對齊整段語意又要凸顯細粒度實體，兩者互相拉扯。"
    context: "本文用它說明 granularity dilemma：整段語意對了、細節卻被平均掉。"
---

Dense retrieval 的默認假設是「語意越像 = 越相關」。但 **similarity 是模型對整段語意的幾何近似，relevance 是使用者當下任務定義的「對不對」**——兩者在多數一般 query 上吻合，卻在一整類情境系統性背離。更麻煩的是，這不全是模型不夠好：有一部分是**單向量範式的理論上限**，換更大的 embedding 模型、換 provider 都無解。這篇整理落差的根本機制、最容易出事的十種情境、沒有 ground truth 時怎麼偵測，以及由便宜到根治的補救順序。

## 為什麼 cosine similarity ≠ relevance

**維度上限（理論）**。Google DeepMind 的 LIMIT 論文（arXiv:2508.21038）證明：單向量能表示的 top-k 文件「組合數」受 embedding 維度 d 限制——文件夠多時，必然存在某些相關組合是該維度的向量**數學上排不出來**的，即使直接拿 test set 自由優化向量也會在某個臨界點崩掉。實證更難看：LIMIT 的任務極簡單（「誰喜歡蘋果?」這種組合 query），**SoTA MTEB 模型的 recall@100 卻不到 20**。

**Granularity dilemma**。WeChat AI 的 CapRetrieval（arXiv:2506.08592）指出 encoder 同時要對齊整段語意、又要凸顯細粒度實體，兩者互相拉扯——整段語意對了，「圖片裡有沒有貓」這種細節被平均掉。

**Cosine 值本身不可靠**。Steck et al.（Netflix，arXiv:2403.05440）論證學習出來的 embedding 有 rescaling 自由度，cosine 值可能是任意的、依正則化而變——不能當成校準過的相關性分數（單一團隊的理論論證，但業界廣泛引用）。

**OOD 泛化弱**。Findings of EMNLP 2022 的 SPAR 論文（arXiv:2110.06918）實證 dense retriever 出了訓練分布就退化，training-free 的 BM25 反而更穩。加上 embedding 用對比學習與 paraphrase 訓練，天生擅長同義改寫、天生不擅長 lexical 精確、否定與數值。

## 落差最大的十種情境（checklist）

按「embedding 越會錯」排序：

1. **否定 / 反義**：「不含糖的飲料」vs「含糖飲料」向量幾乎一樣。NevIR（EACL 2024，arXiv:2305.07614）顯示**多數 IR 模型在否定對上的表現不高於隨機**，後續復現（arXiv:2502.13506）確認此結果。
2. **精確識別碼**：合約編號、SKU、發票號——語意上「都是一串編號」，使用者要的是 exact match。
3. **公司專有縮寫 / 行話**：預訓練語料沒見過的內部 acronym，embedding 無法對應到展開詞。
4. **數值大小 / 門檻**：「金額 > 100 萬」。embedding 不表示數量級與比較。
5. **時間謂詞**：「最新版本」「2020 之後申請的」。embedding 不編碼時間順序。
6. **多義詞**：`pool`（游泳池 / 再保險分攤）、`claim`——專業義可能排在隨機句之後。
7. **細粒度實體 / 事件**：整段語意對但細節對不上（CapRetrieval 的主題）。
8. **組合 / 邏輯型 relevance**：「同時滿足 A 且非 B」——LIMIT 證明的維度上限正是在這裡爆掉。
9. **多跳推理 / 聚合計數**：「簽約的人的主管是誰」——單次相似度查不到，需要分解或 SQL。
10. **跨語言**：中英混查需要多語模型。

共通訊號：**query 短、要求精確、relevance 由「任務規則」而非「語意像不像」定義**時，落差最大。

## 沒有 ground truth 時怎麼偵測

線上沒有標準答案，靠代理訊號：

- **Retriever vs cross-encoder 背離**：top-k 用便宜 bi-encoder 取回，再用 cross-encoder 重打分——兩者排序嚴重不一致，就代表 embedding 召回不可信。注意 reranker 分數適合排序、不一定是好的絕對相關性分數。
- **LLM-as-judge context relevance**：RAG triad（context relevance / groundedness / answer relevance）的第一項，逐筆讓 LLM 判「取回的 chunk 跟 query 相關嗎」，線上抽樣跑。
- **Score 分布訊號**：top-1 分數絕對值偏低、或 top-1 到 top-k 分數擠在一起（margin 小）→ 低信心、可能整批不相關（業界實務，缺公開 benchmark，當輔助訊號）。
- **Lexical 對照差**：同一 query 同時跑 BM25——如果 BM25 取回的高 lexical-overlap 文件不在 dense top-k，多半是 exact-match / 識別碼類漏召回。
- **離線對抗探針**：拿 LIMIT、NevIR、CapRetrieval 這類「最小對抗單元」週期性壓測你的 retriever，量它在否定、組合、細粒度上的退化幅度。

## 補救：由便宜到根治

1. **Hybrid（BM25 + dense 融合）**：補回 lexical 精確匹配與識別碼。Anthropic 的 [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 用 contextual embedding + contextual BM25，檢索失敗率 **−49%**。做法見站內 [hybrid search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 與 [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval)。
2. **加 reranker（cross-encoder）**：Anthropic 同實驗再疊 reranking，失敗率 **−67%**（top-20）。cross-encoder 也是 LIMIT 論文點名能繞過單向量維度上限的方法之一。站內：[cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking)。
3. **Multi-vector（ColBERT 類 late interaction）**：表達力高於單向量，LIMIT 上表現遠優於 dense。站內：[ColBERT late interaction](/posts/ai/2026-03-12-colbert-late-interaction)。
4. **Query 改寫 / 分解 / HyDE**：多輪對話先改寫成 self-contained query；多跳先分解。站內：[HyDE](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)。
5. **上游結構化過濾（被低估但常最有效）**：時間、數值、類別當 **metadata filter**；專有名詞與識別碼走關鍵字精確比對——別塞給向量。企業場景可靠度的主要來源是強上游過濾，不是在弱召回上疊 reranker。
6. **領域內 fine-tune embedding**：對 OOD 與細粒度問題，CapRetrieval 用資料生成策略微調後表現最佳。
7. **路由（router）**：依 query 類型分流——識別碼 → keyword、數值時間 → SQL / filter、語意問答 → dense + rerank、聚合計數 → aggregation pipeline。站內：[query 分類與自適應路由](/posts/ai/2026-03-12-query-classification-adaptive-routing)。

## 整體來說

一句話版本：**落差在「relevance 由規則而非語意定義」時最大**——否定、精確識別碼、數值時間、邏輯組合——而且其中組合型有理論上限，換大模型無解。偵測靠 cross-encoder 背離、LLM-judge context relevance、對抗探針三件套；補救順序 hybrid → rerank → 上游 metadata 路由 → 微調 / multi-vector。

設計含義：別把 embedding 當萬用檢索器。它是「語意像不像」的專家，不是「對不對」的仲裁者——把規則型 relevance 交給規則型工具（BM25、filter、SQL），讓向量只做它擅長的事。

## 參考資料

- [On the Theoretical Limitations of Embedding-Based Retrieval / LIMIT（arXiv:2508.21038）](https://arxiv.org/abs/2508.21038)
- [Dense Retrievers Can Fail on Simple Queries / CapRetrieval（arXiv:2506.08592）](https://arxiv.org/abs/2506.08592)
- [NevIR: Negation in Neural Information Retrieval（arXiv:2305.07614）](https://arxiv.org/abs/2305.07614)
- [Reproducing NevIR（arXiv:2502.13506）](https://arxiv.org/abs/2502.13506)
- [Salient Phrase Aware Dense Retrieval: Can a Dense Retriever Imitate a Sparse One?（arXiv:2110.06918）](https://arxiv.org/abs/2110.06918)
- [Is Cosine-Similarity of Embeddings Really About Similarity?（arXiv:2403.05440）](https://arxiv.org/abs/2403.05440)
- [Anthropic — Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
