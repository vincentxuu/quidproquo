---
title: "HyDE：用假設答案提升向量搜尋的 Recall"
date: 2026-03-12
updated: 2026-09-03
type: guide
category: ai
tags: [rag, hyde, embedding, vector-search, query-enhancement]
lang: zh-TW
tldr: "用 LLM 先生成一份「理想答案」，再把這份假設文件 embed 去搜尋，比直接搜尋查詢本身效果更好。"
description: "HyDE（Hypothetical Document Embeddings）的設計原理、適用場景，以及在實際 RAG 系統中的效益。"
draft: false
series:
  name: "RAG 技法大全"
  order: 14
---

> 🌏 [English version](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings-en)

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

長度限制的方向很重要——太長會讓 embedding 被無關語義稀釋，太短又捕捉不到足夠的語義特徵。實際數字（這裡用 100 字）沒有通則，取決於你的 chunk 大小與 embedding 模型的有效輸入長度，得在自己的評測集上調。

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

[論文](https://arxiv.org/abs/2212.10496)的最終式（Eq. 8）其實已經把原始 query embedding 平均進去了——`v̂ = 1/(N+1)[Σf(d̂_k) + f(q)]`，並不是完全取代。在實際系統中，**兩者並用後 RRF 融合**的效果比單用任何一個都好：query embedding 保留了原始意圖，HyDE embedding 增加了語義覆蓋。

## 重要修正：HyDE 不是「一定會變好」

這點必須講清楚，因為多數 HyDE 教學都跳過了。

第一，**原論文的對照組是無監督檢索器**。HyDE 的主要成績是大幅贏過未經監督訓練的 Contriever，對上「已針對該任務微調過的檢索器」則是「表現相當（comparable）」，不是全面勝出。把 HyDE 當成「加了就贏過現有 baseline」是誤讀。

第二，也是更關鍵的：Weller 等人（EACL 2024）系統性掃過 11 種擴展方法、12 個資料集、24 個檢索模型後發現，**檢索器本身的強度與擴展帶來的增益呈明顯負相關——擴展會提升弱模型，但通常會傷害強模型**。他們的解釋是：擴展確實補了資訊（可能提升 recall），但同時引入噪音，讓最相關的那幾篇更難從候選裡分辨出來，於是多了 false positive。他們給的判準很直接：**檢索器弱、或目標語料的格式與訓練語料差異大時才用擴展；否則不要用，保持相關性訊號乾淨。**

這也是為什麼「原始 query 那一路要始終在場」很重要：就算 HyDE 那路引進噪音，也不至於把乾淨訊號整個換掉。論文本身就是這麼設計的（把 query 向量平均進去），本文的差別只在改用 RRF 在檢索結果層融合，而不是在向量層平均。但這只是止血，不是免疫——**你還是得在自己的評測集上量，確認 HyDE 那一路真的有帶來淨增益**，特別是當你已經換上較新、較強的多語言 embedding 模型之後。

第三，成本面也有人提出替代方案。ReDE-RF（2024）把「生成假設文件」改寫成「讓 LLM 判斷哪些文件相關」的相關性估計任務：LLM 只需輸出單一 token，不必生成整篇文件，也不需要具備該領域知識，論文回報在多個低資源檢索資料集上同時贏過 HyDE 並大幅降低每次查詢延遲。如果你卡在 HyDE 的 token 成本，這是值得看的方向。

第四，如果你不想全開或全關，**Adaptive HyDE** 提供了折衷路線。Mackie 等人（2025）在 JetBrains 的開發者文件檢索場景中，把 HyDE 做成條件式觸發：先用原始查詢跑一輪檢索，只有在初始結果品質不足時才啟動假設文件生成。這樣做避免了對已經能精準命中的查詢浪費 LLM 呼叫，同時在弱召回場景仍然拿到 HyDE 的增益。論文標題「Never Come Up Empty」點出了核心目標——不是提升平均分數，而是消除「完全搜不到東西」的尾部情境。如果你的系統已經有弱召回偵測機制（例如 CRAG 的 score threshold），Adaptive HyDE 可以自然疊上去。

## 限制

- 多一次 LLM 呼叫，有延遲成本（雖然並行，還是消耗 token）
- 生成的假設文件若與領域差距太大，可能引入噪音
- 對短查詢（3-5 個字）效益有限，語義已經很清晰
- 檢索器越強，擴展的邊際效益越低甚至為負（見上一節）

整體來說，對複雜、模糊的自然語言查詢，而且底層檢索器並非該領域的強模型時，HyDE 是低成本的 recall 提升手段。但它是一個**需要量測才能開啟的技巧**，不是預設就該加的標配——先跑評測，確認淨增益為正再上線。

---

## 更新紀錄

- 2026-09-03：補充 Adaptive HyDE（arXiv:2507.16754）——條件式觸發的折衷路線
- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE) (Gao et al., 2022)](https://arxiv.org/abs/2212.10496)
- [When do Generative Query and Document Expansions Fail? (Weller et al., EACL 2024)](https://arxiv.org/abs/2309.08541)
- [Zero-Shot Dense Retrieval with Embeddings from Relevance Feedback（ReDE-RF, 2024）](https://arxiv.org/abs/2410.21242)
- [Never Come Up Empty: Adaptive HyDE Retrieval for Improving LLM Developer Support (Mackie et al., 2025)](https://arxiv.org/abs/2507.16754)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
