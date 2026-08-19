---
title: "RAG 的三個世代：從 Naive 到 Modular"
date: 2026-03-12
updated: 2026-08-19
type: deep-dive
category: ai
tags: [rag, naive-rag, advanced-rag, modular-rag, architecture, evolution]
lang: zh-TW
tldr: "Naive RAG 夠用但有很多問題，Advanced RAG 針對性修補，Modular RAG 重新架構讓系統可組合、可配置。了解三個世代，才能理解現代 RAG 系統為什麼長這樣。"
description: "RAG 系統三個世代的演進：Naive RAG 的問題、Advanced RAG 的修補策略、Modular RAG 的架構重設計，以及各世代的適用場景。"
draft: false
series:
  name: "RAG 技法大全"
  order: 2
---

> 🌏 [English version](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution-en)

RAG 系統在 2023-2026 年間快速演進，從最初的三步流程發展成複雜的模組化管線。了解這個演進路徑，有助於理解每個技術選擇背後解決的是什麼問題。

## Naive RAG（第一世代）

最基本的 RAG 流程：

```
1. 索引：文件 → 切塊 → Embedding → 向量資料庫
2. 搜尋：查詢 → Embedding → 向量搜尋 → Top-K 文件
3. 生成：查詢 + Top-K 文件 → LLM → 回答
```

實作簡單，在 2023 年初幾乎所有 RAG 教學都是這個結構。LangChain 早期版本就是一個包裝好的 Naive RAG。

**Naive RAG 的問題**：

**召回問題（Retrieval）**：
- 查詢和文件的語言模式不一致（問句 vs 陳述句）
- 一個向量代表整段文字，語義資訊被壓縮太多
- 多義詞和術語容易混淆

**精度問題（Precision）**：
- Top-K 裡有不相關的文件，LLM 被噪音干擾
- 重複的文件佔用 context 視窗
- 沒有根據相關性重排

**生成問題（Generation）**：
- Context 太長或太短
- LLM 不知道文件的相對可信度
- 沒有機制判斷回答品質

這些問題在簡單場景不明顯，但在複雜的垂直領域（攀岩、醫療、法律）會嚴重影響品質。

---

## Advanced RAG（第二世代）

針對 Naive RAG 的問題，在三個階段各加入改進：

**Pre-retrieval（搜尋前）**：改善查詢本身
- **HyDE**：把問句轉成假設答案文件，橋接語言模式差距
- **Multi-Query Expansion**：一個問題生成多個角度，提升 recall
- **Query Rewriting**：把口語化查詢改寫成更適合搜尋的形式

**Retrieval（搜尋中）**：改善搜尋品質
- **Hybrid Search**：BM25 + 向量搜尋，互補覆蓋
- **Metadata Filtering**：限縮搜尋範圍，提升精確度
- **Contextual Retrieval**：索引時注入上下文，解決 chunk 孤島

**Post-retrieval（搜尋後）**：改善送給 LLM 的 context
- **Cross-Encoder Reranking**：精排，排除不相關文件
- **MMR**：多樣性選取，避免重複
- **Context Compression**：壓縮 context，保留關鍵資訊

Advanced RAG 是在原有三步流程上加補丁。每個補丁解決一個具體問題，但整體設計仍然是線性的、固定的流程。

---

## Modular RAG（第三世代）

Advanced RAG 的問題：不同查詢需要不同的處理路徑，但固定的流程無法根據查詢類型動態調整。

Modular RAG 的重設計：

**核心概念**：把 RAG 的各個功能做成獨立模組，用 Pipeline Engine 動態組合。

```
不是：Query → Step1 → Step2 → ... → StepN → Answer

而是：Query
         ↓
    [Query Classification] → 決定路由
         ↓
    動態選擇並執行相關模組：
    - Simple 查詢：skip 大部分模組
    - Complex 查詢：全套模組
    - SQL 查詢：走 Text-to-SQL 路徑
    - Agentic 查詢：進入 ReAct 迴圈
```

**三大特性**：

1. **可組合（Composable）**：模組可以自由組合，新模組只需要實作固定介面
2. **可配置（Configurable）**：Admin UI 動態啟用/停用模組、調整參數
3. **可路由（Routable）**：根據查詢類型，自動選擇最優執行路徑

**新增的模組類型**：

Modular RAG 不只是重組了原有的步驟，也加入了 Advanced RAG 沒有的功能：

- **Query Router**：根據意圖選擇處理策略
- **Self-Reflection**：品質不夠好時自動重生成
- **LLM-as-Judge**：評估輸出品質
- **Agentic Loop**：LLM 主動決策是否需要更多資訊
- **Semantic Cache**：快取語義相近的查詢
- **Memory**：記住使用者偏好，個性化回答

---

## 三個世代之後：Agentic RAG

2025 年之後，隨著 LLM 的自我反思與工具呼叫能力變強，出現了一個常被單獨稱作 Agentic RAG 的做法：不再由工程師事先排好步驟順序，而是讓 LLM 當 orchestrator，自己決定要做哪些動作、什麼時候做、要不要再迭代一輪。Modular RAG 裡的「Agentic Loop」模組，在這個做法裡變成了整個系統的控制流。

嚴格說它不算第四個世代，比較像是 Modular RAG 的**控制權轉移**：模組還是那些模組，差別在於「誰決定執行順序」——從固定的 pipeline 設定，換成模型在 runtime 決定。

**代價是實打實的**。ACL 2026 一篇比較 Enhanced RAG（也就是這裡講的 Advanced/Modular）與 Agentic RAG 的實驗研究發現，Agentic 設定的 token 成本依資料集而異（FIQA 2.7 倍／1.7 倍、CQADupStack-En 3.9 倍／2.0 倍 input／output），端到端延遲 1.5 倍，跨資料集的成本最多可以到 3.6 倍。

更值得注意的是它的品質結論不是一面倒：

- Agentic 在**理解使用者意圖**和**查詢改寫**上比較強，而且不需要人工寫路由範例
- 但在**挑出最相關的文件**這件事上，Agentic 的自主選擇不如 Enhanced RAG 的 reranking
- 在定義明確、使用者行為結構化的領域，Agentic 表現好；在更廣、更雜訊的領域，固定的路由反而更可靠
- 作者的結論是：調校好的 Enhanced RAG 可以打平甚至超過 Agentic，而且更省

換句話說，「上 Agentic」不是自動變好，而是拿成本和可預測性換取彈性。實務上比較划算的組合是：用 Agentic 做意圖路由和查詢改寫，但保留固定的 reranking 步驟。

另外，把控制權交給模型會帶進一批 pipeline 時代沒有的失效模式。2026 年一篇 Agentic RAG 的 SoK 論文把這種迴圈形式化成有限步長的部分可觀察馬可夫決策過程（POMDP），並點名幾個系統性風險：幻覺會沿著迴圈累積放大、記憶被污染（memory poisoning）、檢索目標偏移、以及工具呼叫的連鎖漏洞。這些都是靜態評測抓不到的——你需要評估的是整條軌跡，不是單次回答。

---

## 三個世代的對比

| | Naive RAG | Advanced RAG | Modular RAG | Agentic RAG |
|---|-----------|-------------|-------------|-------------|
| 架構 | 線性三步 | 增強的線性流程 | 模組化 DAG | 模型驅動的迭代迴圈 |
| 誰決定執行順序 | 程式碼 | 程式碼 | 設定檔／路由規則 | LLM 在 runtime 決定 |
| 靈活性 | 低 | 中 | 高 | 最高 |
| 可預測性 | 高 | 高 | 中 | 低 |
| 可維護性 | 簡單 | 中等 | 複雜但有組織 | 難以除錯（要看軌跡） |
| 配置 | 硬編碼 | 部分可配 | 動態可配 | 由 prompt 與工具定義 |
| 適應不同查詢 | 不行 | 有限 | 完整支援 | 完整支援 |
| 執行成本 | 低 | 中 | 中 | 高（token 數倍增） |

## 選哪個世代？

**Naive RAG**：適合 PoC、內部工具、查詢類型單一的場景。快速上線，先驗證 RAG 有沒有價值再優化。

**Advanced RAG**：適合大多數生產場景。有具體的品質問題時，針對性加入對應的改進（召回差 → HyDE/Multi-Query；精度差 → Reranking；生成差 → Judge）。

**Modular RAG**：適合查詢類型多樣、需要持續演進的系統。初期工程成本高，但長期可維護性好。需要有明確的品質指標和迭代計畫，才能充分發揮模組化的優勢。

**Agentic RAG**：適合查詢型態難以事先窮舉、且願意用成本換彈性的場景。上線前先確認兩件事：一是你有辦法觀測整條決策軌跡（不只是最後那句回答），二是你算過 token 帳單——實驗證據顯示成本可能是固定 pipeline 的數倍。多數團隊比較實際的做法是混合：Agentic 負責意圖路由與查詢改寫，固定 pipeline 負責 reranking 與生成。

## 整體來說

三個世代不是「新的取代舊的」，而是**不同複雜度的解法**。Naive RAG 的核心思路在 Modular RAG 裡仍然存在，只是被更好地組織了。

理解每個世代解決了什麼問題、引入了什麼複雜度，才能在「夠用就好」和「過度工程」之間找到對的平衡點。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks (2024)](https://arxiv.org/abs/2407.21059)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG (2025)](https://arxiv.org/abs/2501.09136)
- [Is Agentic RAG worth it? An experimental comparison of RAG approaches (ACL 2026 Industry Track)](https://arxiv.org/abs/2601.07711)
- [SoK: Agentic Retrieval-Augmented Generation (RAG): Taxonomy, Architectures, Evaluation, and Research Directions (2026)](https://arxiv.org/abs/2603.07379)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
