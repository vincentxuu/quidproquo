---
title: "knowledge-pipeline：六層管線幫你的 RAG 做品質管控"
date: 2026-04-18
category: ai
tags: [rag, knowledge-management, pipeline, embedding, bge-m3, sqlite, quality-control]
lang: zh-TW
tldr: "一個六層確定性管線，從 URL 擷取到向量嵌入全自動處理，透過八維度評分系統在資料進 RAG 之前就篩掉垃圾。"
description: "knowledge-pipeline 介紹：六層處理架構、八維度 LLM 評分、混合向量檢索、極簡技術棧，以及它適合與不適合的場景。"
draft: false
---

RAG 系統的輸出品質，很大一部分取決於輸入品質。但多數人花大量時間調 prompt、換 embedding model、試不同的 chunk 策略，卻忽略了一個更根本的問題：**餵進去的資料本身就是垃圾**。knowledge-pipeline 就是針對這個問題設計的——在資料進入向量資料庫之前，先用一條六層管線做品質管控。

## 設計哲學：Stop Feeding Your RAG Garbage

這個專案的核心主張很直接：與其在檢索端做各種花式修補（reranking、query expansion、self-reflection），不如在資料入庫前就把爛東西擋掉。

這不是說檢索端的優化不重要，而是兩者解決的問題不同。再好的 reranker 也救不了一個充滿低品質內容的知識庫。knowledge-pipeline 處理的是「資料入庫前」這段被多數 RAG 架構忽略的環節。

跟常見的做法比較：

- **手動篩選**：品質可控，但不可規模化，1000 筆以上就撐不住
- **直接全部丟進向量 DB**：快，但檢索品質會隨資料量增加而惡化
- **knowledge-pipeline**：自動化篩選 + 評分，可規模化且品質可追蹤

## 六層管線架構

整個系統是線性的六層處理流程，每層獨立運作，可以單獨跑、跳過或替換：

```
URL 輸入
  │
  ▼
┌──────────┐
│ 1. Ingest │  從多個來源匯入 URL
└────┬─────┘
     ▼
┌──────────┐
│ 2. Enrich │  抽取網頁內容、產生摘要
└────┬─────┘
     ▼
┌──────────┐
│ 3. Score  │  八維度 LLM 評分（0-100）
└────┬─────┘
     ▼
┌──────────┐
│ 4. Route  │  依評分分類到不同目的地
└────┬─────┘
     ▼
┌──────────┐
│ 5. Embed  │  混合向量嵌入（dense + sparse）
└────┬─────┘
     ▼
┌──────────┐
│ 6. Serve  │  HTTP API / MCP 提供查詢
└──────────┘
```

這個設計的好處是**每層都可以獨立除錯**。Enrich 出問題就修 Enrich，不用從頭跑整條管線。SQLite 作為單一持久層貫穿所有階段，任何中間狀態都可以直接用 SQL 查。

## 八維度評分系統

Score 層是整個管線最核心的部分。每則內容透過 LLM 從八個面向打分：

| 維度 | 評估的是什麼 |
|------|-------------|
| Knowledge Density | 每單位篇幅包含多少有用資訊 |
| Novelty | 跟已知知識的重疊程度 |
| Evidence Quality | 有沒有數據、引用、實驗佐證 |
| Actionability | 讀完能不能直接拿來用 |
| Risk | 資訊過時或錯誤的可能性 |
| Time Horizon | 這則知識的保鮮期多長 |
| Emotional Content | 情緒成分佔比（高情緒通常低知識密度） |
| Source Credibility | 來源的可信程度 |

八個維度合成為一個 0–100 的 signal score。這個分數決定了下一層 Route 怎麼處理這則內容。

## 智慧路由

Route 層根據評分結果，自動把內容分流到五個目的地：

- **Writing**：高知識密度、高新穎性，適合寫成文章的素材
- **Research**：有潛力但需要進一步調查的內容
- **Validation**：證據品質不足，需要交叉驗證
- **Action**：高可行動性，可以直接執行
- **Archive**：低分內容，存檔但不進入主要知識庫

這比「全部丟進同一個 collection」精細得多。Agent 查詢時可以指定只搜 Writing 或 Research，不會被 Archive 等級的內容污染結果。

## 混合檢索

Embed 層使用 BAAI/bge-m3 同時產生 dense 和 sparse 向量，查詢時以 70/30 權重融合：

- **Dense（70%）**：捕捉語意相似度，「機器學習」和「ML」會被關聯
- **Sparse（30%）**：精確詞彙匹配，適合專有名詞和技術術語

可選用 BAAI/bge-reranker-v2-m3 做二階段重排序，進一步提升精準度。這個混合策略跟純 dense 或純 sparse 相比，在技術文件類的檢索上通常有明顯提升。

## 技術棧

整個專案的技術選型非常克制：

- **Python 3.12+**：核心語言
- **SQLite**：唯一的儲存層，不需要額外資料庫
- **numpy + FlagEmbedding**：僅有的兩個非標準庫依賴
- **Python HTTPServer**：內建的 HTTP 伺服器，不依賴 Flask/FastAPI
- **任何 OpenAI 相容 LLM**：Ollama、OpenAI、Anthropic 皆可

這代表部署門檻很低——不需要 Redis、PostgreSQL、向量資料庫，一台機器裝好 Python 就能跑。但也意味著不適合高併發場景，Python 內建 HTTPServer 不是為生產級流量設計的。

## 適合誰用

**適合：**
- 個人知識管理者，想要自動化地整理 1000+ 筆收藏
- RAG 開發者，想在資料入庫前加一層品質篩選
- 有本地 LLM（Ollama）的開發者，可以完全離線運作

**不太適合：**
- 需要即時處理的場景（管線是批次導向的）
- 沒有技術背景的使用者（需要自己架設）
- 超大規模部署（SQLite + Python HTTPServer 的天花板）

## 整體來說

knowledge-pipeline 解決的是 RAG 系統中常被忽略的「資料品質」問題。六層管線的設計讓每個環節可以獨立調整，八維度評分讓品質判斷有跡可循而非黑箱。技術棧極簡是優點也是限制——容易上手，但要用在生產環境需要自己補強基礎設施。

這個專案源自作者管理 1,600+ 筆知識條目的實戰經驗，不是紙上談兵的架構設計。對正在建構個人知識庫或 RAG 系統的開發者來說，即使不直接使用，六層管線和八維度評分的設計思路也值得參考。

## 參考資料

- [knowledge-pipeline GitHub](https://github.com/MakiDevelop/knowledge-pipeline)
- [BAAI/bge-m3 - Hugging Face](https://huggingface.co/BAAI/bge-m3)
- [BAAI/bge-reranker-v2-m3 - Hugging Face](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [Hybrid Search：BM25 + Vector + RRF 的混合檢索策略](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [BGE-M3：多語言多粒度的 Embedding 選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
