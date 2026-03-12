---
title: "HyDE：用假設答案提升向量搜尋的 Recall"
date: 2026-03-12
category: ai
tags: [rag, hyde, embedding, vector-search, query-enhancement]
lang: zh-TW
tldr: "用 LLM 先生成一份「理想答案」，再把這份假設文件 embed 去搜尋，比直接搜尋查詢本身效果更好。"
description: "HyDE（Hypothetical Document Embeddings）的設計原理、適用場景，以及在實際 RAG 系統中的效益。"
draft: false
---

向量搜尋有個根本的不對稱問題：**使用者的查詢和資料庫中的文件，語言模式差距很大**。

使用者問：「龍洞哪條路線適合第一次戶外攀岩？」
資料庫裡的文件是：「龍洞北壁，5.9，運動攀登，路線保護良好，落點清晰，適合新手進行戶外攀岩入門。」

查詢是問句，文件是描述句，兩者的 embedding 在向量空間裡距離比較遠，搜尋命中率不理想。

HyDE（Hypothetical Document Embeddings）的解法是：**先用 LLM 把查詢轉成一份「假設的理想答案文件」，再用這份文件去搜尋**。假設文件和真實資料庫文件的語言模式更接近，embedding 距離更小，搜尋效果更好。

## 運作原理

```
User Query → LLM → Hypothetical Document → Embedding → Vector Search
                                                              ↓
                                                    Real Documents in DB
```

LLM 生成的假設文件不需要準確，它只是一個語義橋樑。就算內容有誤，只要語言模式（詞彙、結構、語氣）接近資料庫中的文件，embedding 就能找到更相關的結果。

## Prompt 設計

```
請根據以下攀岩問題，生成一份假設的理想答案文件（100字以內）。
不需要準確，只需要語言風格接近攀岩路線描述。

問題：{query}
假設答案文件：
```

100 字的限制很重要——太長會讓 embedding 被無關語義稀釋，太短又捕捉不到足夠的語義特徵。

## 觸發條件

HyDE 不是每次查詢都執行，只在 `queryType === 'complex'` 時觸發。原因是：

- **Simple 查詢**（如「龍洞有幾條路線？」）：語義清晰，不需要假設文件
- **General Knowledge 查詢**（如「前臂訓練方法」）：走 LLM 直接回答，不需要 RAG
- **SQL 查詢**（如「我今年完攀幾條？」）：走結構化查詢，不需要 embedding
- **Complex 查詢**（如「適合中級攀岩者的龍洞路線推薦」）：語義模糊、多條件，HyDE 效益最高

## 並行執行

HyDE 的 LLM 呼叫和查詢本身的 embedding 計算是**並行進行**的，不會增加串行延遲：

```typescript
const [queryEmbedding, hydeEmbedding] = await Promise.all([
  embed(query),
  generateHyDEAndEmbed(query), // LLM 生成 + embed
]);

// 兩個 embedding 各自搜尋，結果用 RRF 融合
const [queryResults, hydeResults] = await Promise.all([
  searchVectorize(queryEmbedding, filter, topK),
  searchVectorize(hydeEmbedding, filter, topK),
]);
```

最終送進 RRF 時，HyDE 搜尋結果作為獨立一路，與其他搜尋路徑（BM25、Multi-Query）並排融合。

## 為什麼有效

原始查詢的向量代表的是「問題的語義」，而理想文件的向量代表的是「答案的語義」。資料庫裡存的文件更接近「答案的語義」，所以用假設文件搜尋命中率自然更高。

論文原始設計（Gao et al., 2022）是完全取代 query embedding，但在實際系統中，**兩者並用後 RRF 融合**的效果比單用任何一個都好：query embedding 保留了原始意圖，HyDE embedding 增加了語義覆蓋。

## 限制

- 多一次 LLM 呼叫，有延遲成本（雖然並行，還是消耗 token）
- 生成的假設文件若與領域差距太大，可能引入噪音
- 對短查詢（3-5 個字）效益有限，語義已經很清晰

整體來說，對複雜、模糊的自然語言查詢，HyDE 是低成本高效益的 recall 提升手段。
