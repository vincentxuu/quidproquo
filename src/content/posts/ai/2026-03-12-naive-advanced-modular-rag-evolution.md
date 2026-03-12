---
title: "RAG 的三個世代：從 Naive 到 Modular"
date: 2026-03-12
category: ai
tags: [rag, naive-rag, advanced-rag, modular-rag, architecture, evolution]
lang: zh-TW
tldr: "Naive RAG 夠用但有很多問題，Advanced RAG 針對性修補，Modular RAG 重新架構讓系統可組合、可配置。了解三個世代，才能理解現代 RAG 系統為什麼長這樣。"
description: "RAG 系統三個世代的演進：Naive RAG 的問題、Advanced RAG 的修補策略、Modular RAG 的架構重設計，以及各世代的適用場景。"
draft: false
---

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

## 三個世代的對比

| | Naive RAG | Advanced RAG | Modular RAG |
|---|-----------|-------------|-------------|
| 架構 | 線性三步 | 增強的線性流程 | 模組化 DAG |
| 靈活性 | 低 | 中 | 高 |
| 可維護性 | 簡單 | 中等 | 複雜但有組織 |
| 配置 | 硬編碼 | 部分可配 | 動態可配 |
| 適應不同查詢 | 不行 | 有限 | 完整支援 |
| 工程成本 | 低 | 中 | 高 |

## 選哪個世代？

**Naive RAG**：適合 PoC、內部工具、查詢類型單一的場景。快速上線，先驗證 RAG 有沒有價值再優化。

**Advanced RAG**：適合大多數生產場景。有具體的品質問題時，針對性加入對應的改進（召回差 → HyDE/Multi-Query；精度差 → Reranking；生成差 → Judge）。

**Modular RAG**：適合查詢類型多樣、需要持續演進的系統。初期工程成本高，但長期可維護性好。需要有明確的品質指標和迭代計畫，才能充分發揮模組化的優勢。

## 整體來說

三個世代不是「新的取代舊的」，而是**不同複雜度的解法**。Naive RAG 的核心思路在 Modular RAG 裡仍然存在，只是被更好地組織了。

理解每個世代解決了什麼問題、引入了什麼複雜度，才能在「夠用就好」和「過度工程」之間找到對的平衡點。
