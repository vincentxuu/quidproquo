---
title: "當 Vector Search 把名字當難度搜：RAG 系統的 Attribute Conflation 問題"
date: 2026-03-28
category: tech
tags: [rag, vector-search, embedding, cloudflare-workers, recommendation-system]
lang: zh-TW
tldr: "查詢「美人照鏡 5.11b，推薦類似難度路線」，結果回來的全是名字像的路線而不是難度像的。根因是 dense embedding 把多個屬性壓進同一個向量，名稱的稀有性壓過了難度信號。解法：metadata pre-filter + query rewriting + score fusion 三層防線。"
description: "當 embedding 混淆了「名稱相似」和「屬性相似」，RAG 推薦系統會給出完全錯誤的結果。這篇整理了 attribute conflation 的根因分析、學術界的解法（ColBERT、Field-Aware Embedding、RAG-Fusion），以及在 Cloudflare Workers 上可落地的分層檢索架構。"
draft: false
type: deep-dive
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation-en)

這篇記錄一個在攀岩路線推薦系統上撞到的 retrieval 問題：使用者說「我完攀了美人照鏡 5.11b，推薦我類似難度的路線」，系統回了一堆名字跟「美人照鏡」沾邊的路線，難度完全不對。

看完這篇你會知道為什麼 dense embedding 在多欄位實體搜尋上會出包、學術界有哪些解法、以及在 Cloudflare Workers 這種受限環境下怎麼用最小成本修好它。

## 問題長什麼樣

系統背景：Cloudflare Workers 上跑 Hono，用 `@cf/baai/bge-m3` 做 embedding（1024 維），Cloudflare Vectorize 做向量搜尋，加上 BM25 做 hybrid search。

一條攀岩路線有多個結構化欄位：

```
路線名稱：美人照鏡
難度等級：5.11b
岩場：龍洞
路線類型：Sport
岩質：砂岩
```

這些欄位被拼接成一段文字後 embed 進 Vectorize。使用者查「推薦類似 5.11b 難度的路線」，期望拿到 5.11a ~ 5.11c 的路線。實際結果？排名前幾的都是名字裡有「鏡」「美人」之類字的路線，難度從 5.8 到 5.12 都有。

問題核心：**embedding 模型無法區分使用者關注的是哪個屬性**。

## 根因：Attribute Conflation

Dense embedding 模型（bge-m3、text-embedding-3-small 這些）的設計目標是捕捉**整體語意相似度**。把多個獨立屬性塞進同一個向量，模型會自己決定各屬性的權重——而這個決定往往是錯的。

三個原因：

**1. 詞彙稀有性偏差（Lexical Rarity Bias）**

「美人照鏡」是專有名詞，在 embedding 空間裡的區辨力極高。「5.11b」是半結構化的等級標記，在攀岩文本中出現頻率遠高於特定路線名。模型自然會把更多注意力放在稀有詞上。

**2. 單向量瓶頸（Single-Vector Bottleneck）**

一條路線的所有屬性壓縮成一個 1024 維向量，資訊必然損失。名稱和難度在向量空間中無法被獨立操作——你沒辦法說「忽略名稱維度，只比較難度維度」。

**3. 訓練分佈偏差**

通用語言模型在預訓練時，「名稱→名稱」的共現模式遠多於「難度→難度」的結構化比對。模型天生更擅長名稱匹配。

BM25 也救不了。「美人照鏡」的 TF-IDF 分數本來就高，在 hybrid search 裡兩個信號互相強化，結果更偏。

## 學術界怎麼解

整理了幾個主流方向。

### Metadata Filtering

最直覺的做法：結構化屬性不走 embedding，改用 metadata filter。

```
查詢 → 提取 grade=5.11b
     → metadata filter: grade IN ['5.11a', '5.11b', '5.11c']
     → 在過濾後的子集中做 vector search
```

Pinecone 的文件直接寫了：「對於精確匹配的屬性（如分類、等級），優先使用 metadata filter 而非依賴 embedding 相似度」。Weaviate 的 hybrid search 也是 filter-first 架構。Cloudflare Vectorize 同樣支援。

好處是實作成本最低，壞處是你得先有辦法從自然語言裡把結構化條件挖出來。

### 結構化查詢分解（Structured Query Decomposition）

用 LLM 或規則引擎把查詢拆成結構化意圖：

```json
{
  "intent": "recommendation",
  "reference_route": "美人照鏡",
  "reference_grade": "5.11b",
  "criteria": "similar_grade",
  "grade_filter": ["5.11a", "5.11b", "5.11c", "5.11d"],
  "semantic_query": "推薦攀岩路線"
}
```

LangChain 的 Self-Query Retriever、LlamaIndex 的 Query Pipeline、Microsoft 的 GraphRAG 都走這個路線。在 Cloudflare Workers 上不能用這些重框架，但可以規則引擎 + LLM 兩階段：先用 regex 抓已知模式（`5.\d+[a-d]`、`V\d+`），抓不到的再丟 LLM。

### Multi-Field Embedding

為不同欄位建獨立 embedding，查詢時根據意圖選用：

```
route_vectors = {
  "name_vector":    embed("美人照鏡"),
  "desc_vector":    embed("龍洞經典路線..."),
  "composite_vector": embed("美人照鏡 5.11b Sport 龍洞 砂岩")
}
```

ColBERT 用 late interaction 機制，為每個 token 保留獨立向量，查詢時逐 token 比對，從根本上解決單向量瓶頸。Qdrant 和 Milvus 已支援同一 collection 存多個 named vectors。

另一招是 **Field-Aware Embedding**——給欄位加 prefix：

```
embed("grade: 5.11b")        // 而不是 embed("5.11b")
embed("route_name: 美人照鏡")  // 而不是 embed("美人照鏡")
```

E5 和 bge 系列的 instruction-tuned 版本天然支援這種用法，prefix 提示模型「這段文字的語意角色是什麼」。

### Query Rewriting + Multi-Query

在檢索前重寫查詢，把會干擾 embedding 的結構化成分移除：

```
原始：「我完攀了美人照鏡 5.11b，推薦我類似難度的路線」
重寫：「推薦類似風格的攀岩路線」  ← 拿去 embed
提取：{ grade_range: ["5.11a", "5.11c"] }  ← 拿去 filter
```

更進階的做法是 **RAG-Fusion**：生成多個查詢變體，分別檢索，用 Reciprocal Rank Fusion 合併結果。或者 **Query2Doc**：讓 LLM 先生成一份假設性文件，再用這份文件去檢索。

### Learned Sparse Retrieval

bge-m3 本身支援 dense、sparse（learned sparse）、ColBERT 三種模式。Sparse 模式可以讓模型學習為 token 賦予適當權重，例如讓「5.11b」在難度搜尋中拿到更高權重。但在 Cloudflare Workers 上，Workers AI 只暴露 dense embedding 接口，sparse 和 ColBERT 模式用不了。

## 落地方案：分層檢索架構

考量 Cloudflare Workers 的限制，用四層防線：

```
┌─────────────────────────────────────────────┐
│  Query Understanding                          │
│  extractGradeFilter / extractLocationFilter   │
│  + analyzeQueryIntent (意圖權重)              │
├─────────────────────────────────────────────┤
│  Metadata Pre-filtering                       │
│  Vectorize filter: grade IN [5.11a..5.11c]   │
├─────────────────────────────────────────────┤
│  Query Rewriting                              │
│  移除結構化 token → 乾淨語意 embedding        │
├─────────────────────────────────────────────┤
│  Score Fusion                                 │
│  α·vector + β·gradeProximity + γ·bm25        │
│  + δ·locationBoost                            │
└─────────────────────────────────────────────┘
```

### P0：Metadata Pre-filtering

成本最低、效果最好的一刀。在 Vectorize query 加上 grade filter：

```typescript
const results = await vectorize.query(queryVector, {
  topK: 20,
  filter: {
    grade: { $in: getGradeRange("5.11b", range = 2) }
    // ["5.11a", "5.11b", "5.11c"]
  }
});
```

只要路線的 metadata 有 grade 欄位，這一步就能立即解決核心問題。

### P1：Query Rewriting

把查詢中的結構化成分剝離後再 embed：

```typescript
const cleanedQuery = removeStructuredTokens(query, {
  grade,
  routeName,
});
const queryVector = await embed(cleanedQuery);
// "推薦攀岩路線" 而不是 "我完攀了美人照鏡 5.11b 推薦類似難度路線"
```

Embedding 少了名稱的干擾，向量搜尋的結果會更聚焦在風格、類型等語意層面。

### P2：Score Fusion

最終排序用加權分數：

```typescript
finalScore =
  α * vectorSimilarity + // 語意相似度（風格、描述）
  β * gradeProximity + // 難度接近度（確定性計算）
  γ * bm25Score + // 詞彙匹配
  δ * locationBoost; // 地點加分
```

其中 `gradeProximity` 是確定性函數，不經過 embedding：

```typescript
function gradeProximity(
  queryGrade: string,
  routeGrade: string
): number {
  const distance = Math.abs(
    gradeToNumeric(queryGrade) - gradeToNumeric(routeGrade)
  );
  return Math.max(0, 1 - distance * 0.2); // 每差一級扣 0.2
}
```

### P3：Intent Weight Analysis

根據查詢意圖動態調整 alpha/beta/gamma/delta 的權重。「推薦類似難度」→ beta 拉高；「推薦龍洞的路線」→ delta 拉高。這層依賴比較準確的 intent classification，是最後做的。

## 整體來說

核心取捨是：**哪些維度該走 embedding，哪些不該**。

Dense embedding 擅長捕捉模糊的語意相似——「風格類似」、「描述相近」這類人類也說不清楚的東西。但對於有明確數值或分類的欄位（難度等級、地點、路線類型），讓 embedding 去處理就是在自找麻煩。

正確的做法是把結構化屬性從 embedding 中抽離，用確定性邏輯處理。Metadata filter 是最便宜的第一刀，query rewriting 是第二刀，score fusion 是安全網。這三層加起來，在 Cloudflare Workers 的受限環境下已經夠用。

長期來看，field-aware embedding（加 prefix）和 multi-index strategy 是更乾淨的架構，但前提是先把基本的 metadata filtering 做好。

---

## 參考資料

- [ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT](https://arxiv.org/abs/2004.12832) — Khattab & Zaharia, SIGIR 2020
- [BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation](https://arxiv.org/abs/2402.03216) — Chen et al., ACL 2024
- [Text Embeddings by Weakly-Supervised Contrastive Pre-training (E5)](https://arxiv.org/abs/2212.03533) — Wang et al., 2023
- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks](https://arxiv.org/abs/1908.10084) — Reimers & Gurevych, EMNLP 2019
- [RAG-Fusion: a New Take on Retrieval-Augmented Generation](https://arxiv.org/abs/2402.03367) — Raudaschl, 2023
- [Active Retrieval Augmented Generation (FLARE)](https://arxiv.org/abs/2305.06983) — Jiang et al., EMNLP 2023
- [Query2Doc: Query Expansion with Large Language Models](https://arxiv.org/abs/2303.07678) — Wang et al., EMNLP 2023
- [Query Rewriting in Retrieval-Augmented Large Language Models](https://arxiv.org/abs/2305.14283) — Ma et al., EMNLP 2023
- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (Microsoft GraphRAG), 2024
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al., 2024
- [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking](https://arxiv.org/abs/2107.05720) — Formal et al., SIGIR 2021
- [Sparse, Dense, and Attentional Representations for Text Retrieval](https://arxiv.org/abs/2005.00181) — Luan et al., TACL 2021
- [Pinecone Metadata Filtering Best Practices](https://docs.pinecone.io/docs/metadata-filtering)
- [Weaviate Hybrid Search Architecture](https://weaviate.io/developers/weaviate/search/hybrid)
- [LangChain Self-Query Retriever](https://python.langchain.com/docs/modules/data_connection/retrievers/self_query/)
