---
title: "pplx-embed——Perplexity 的嵌入模型家族：單向量、上下文、late interaction 三條線怎麼選"
date: 2026-10-09
category: tech
type: deep-dive
tags: [llm, embeddings, perplexity, pplx-embed, rag, open-weights, model-family-pplx-embed, model-selection]
lang: zh-TW
tldr: "pplx-embed 是 Perplexity 2026 年 2 月起陸續釋出的嵌入模型家族，分三條線：v1 單向量（0.6B／4B，API 每百萬 token $0.004／$0.03）、context 上下文嵌入（v1 4B 與 9B 預覽版）、v2-late 多向量（0.6B／9B，可直接搜 PDF 頁面圖片）。三條線解決不同問題，不是新舊取代。"
description: "Perplexity pplx-embed 模型家族介紹：2026-02 到 2026-10 的演化時間線、單向量／上下文／late interaction 三條線的架構與訓練差異、API 定價與授權現況，以及依文件型態與預算的選型矩陣。"
series:
  name: "AI 模型家族"
  order: 25
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-09-ai-model-family-pplx-embed-en)

2026 年 10 月 7 日，Perplexity 釋出 [pplx-embed-v2-late](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector)，一週前才剛放出 [pplx-embed-v2-context-9b-preview](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage)，而最早的 [pplx-embed-v1](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval) 是 2 月的事。八個月內出了三批、七個型號，名字都叫 pplx-embed，但「v2」不是「v1」的升級版。這篇是「AI 模型家族」系列的第二十五篇，把這個家族拆成三條線，回答一個問題：你的文件該用哪一條。

怎麼讀文中引用的跑分，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。想看模型在整體版圖的位置，見[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。其中 v2-late 的細節另有一篇：[pplx-embed-v2-late 導讀](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)。

## 家族演化時間線

| 時間 | 型號 | 關鍵事實 |
|---|---|---|
| 2026-02-11 | 技術報告 | [arXiv:2602.11151](https://arxiv.org/abs/2602.11151) 先於模型發表 |
| 2026-02-26 | pplx-embed-v1、pplx-embed-context-v1 | 0.6B 與 4B 各兩個，共四個型號；MIT 授權、同步上架 API |
| 2026-09-30 | pplx-embed-v2-context-9b-preview | 9B 上下文嵌入預覽版，與 turbopuffer 合作；權重在 Hugging Face，API 尚未提供 |
| 2026-10-07 | pplx-embed-v2-late-0.6b／9b | 多向量、文字加圖片；權重 MIT，API 計畫中 |

注意 v2 目前只有 context 與 late 兩條線。dense 單向量的 v2 還沒出：官方在 late 的發表文裡寫「正在訓練下一代 dense 嵌入模型」，之後才會陸續上 API。所以今天要做一般語意搜尋，手上能用的仍是 v1。

## 三條線，三種問題

| | v1（dense） | context（v1／v2 預覽） | v2-late（late interaction） |
|---|---|---|---|
| 每個輸入的輸出 | 一個向量 | 每個 chunk 一個向量，帶全文脈絡 | 每個 token 一個 128 維向量 |
| 型號 | 0.6B（1024 維）、4B（2560 維） | v1：0.6B、4B；v2：9B（2048 維，可截成 1024） | 0.6B、9B |
| 輸入 | 文字 | 文字 | 文字、頁面圖片 |
| 量化 | INT8／binary 原生 | v1：INT8／binary；v2 預覽：INT8 | 官方未特別標示 |
| 最大長度 | 32K | v2 評測單次最長 32,768 token | 官方未公布 |
| 評分 | 餘弦相似度 | 餘弦相似度 | MaxSim |
| API（2026-10-09 查） | 有 | v1 有、v2 預覽沒有 | 沒有，計畫中 |

價格取自 [Perplexity API 文件](https://docs.perplexity.ai/docs/embeddings/quickstart)（2026-10-09 查詢），每百萬 token：

| 型號 | 價格 |
|---|---|
| pplx-embed-v1-0.6b | $0.004 |
| pplx-embed-v1-4b | $0.03 |
| pplx-embed-context-v1-0.6b | $0.008 |
| pplx-embed-context-v1-4b | $0.05 |

## v1：用擴散預訓練把 decoder 改成 encoder

v1 的起點是一個不尋常的選擇。多數強的嵌入模型建在 decoder-only 語言模型上，token 只能看到前面的字。Perplexity 的做法是從 Qwen3（0.6B 與 4B）出發，拿掉因果遮罩，用擴散去噪目標在約 2,500 億 token、30 種語言上繼續預訓練，把它改成雙向 encoder，再做對比學習。官方的消融實驗說，這讓檢索任務多了大約 1 個百分點。

後面是三段對比訓練：pair 訓練、contextual 訓練（產出 context 型號）、用難負例的 triplet 訓練；最終的 v1 是把 contextual 與 triplet 兩個 checkpoint 做球面線性插值合併出來。量化是訓練的一部分，不是事後壓縮：訓練期間就用 straight-through 估計讓向量以 INT8 運作，儲存比 FP32 小 4 倍；binary 版小 32 倍，4B 的掉分在 1.6 個百分點內，0.6B 是 2 到 4 個百分點。

另一個設計取捨：**不需要 instruction 前綴**。官方的理由是前綴雖然能帶來約 2% 到 3% 的提升，但索引與查詢的前綴不一致會悄悄拖垮檢索，所以直接放棄。

官方跑分（皆自家公布）：

| 項目 | 數字 | 對照 |
|---|---|---|
| MTEB(Multilingual, v2) 檢索，4B INT8 | 69.66% | Qwen3-Embedding-4B 69.60%、gemini-embedding-001 67.71% |
| ConTEB，context-v1-4B INT8 | 81.96% | voyage-context-3 79.45%、Anthropic Contextual 72.4% |
| PPLXQuery2Doc（3,000 萬頁），4B | Recall@1000 91.7% | Qwen3-Embedding-4B 88.6% |

MTEB 上的差距只有 0.06 個百分點，等於打平，v1 的賣點其實是「INT8 下打平，所以儲存便宜」。

## context 線：從「金標準段落」到「答案加佐證」

context 這條線處理的是 chunking 的老問題：段落被切出來以後，指涉、標題、定義都掉了。做法是 late chunking，整份文件一次過模型，之後才在 chunk 範圍內做池化，每個 chunk 向量都看過全文。

v2 預覽版的改動在訓練監督。傳統做法用 LLM 標一個「金標準段落」，其他段落全當負例，連提供佐證的段落也算。v2 預覽版改用 Perplexity 自家的查詢感知上下文壓縮模型當老師：它對文件每個 token 給相關性分數，再聚合成 chunk 分數，讓嵌入模型學到「答案段落加佐證段落」。起點是內部的 9B ColBERT 模型，用約 430 個資料集、50 多種語言訓練，發佈的是多個 checkpoint 權重平均的 model soup。

評測是這條線最需要小心讀的地方：

- 主要跑分在 turbopuffer 持有的 **context-bench**，題庫不公開，只接受提交模型由對方評測。這能避免訓練汙染，但外人無法自己復現。
- 在 context-bench 上，9B 預覽版 K=10 時答案召回 45.5%、佐證召回 40.6%，比 voyage-context-4 高 14.4 與 5.0 個百分點。絕對值不高：文件層級的 Document@10 只有 61.6%，代表這個基準對所有模型都很難。
- 在公開的 ConTEB 平均最高，但不是每項都贏：NarrativeQA 輸給 v1 的 4B，COVID-QA 輸給 Nemotron。官方也說明 COVID-QA 偏重字面匹配，上下文理解幫助有限。
- 領域文件檢索（query-to-document）的平均分略低於 voyage-context-4。
- 官方在 v2 發表文裡還提到：v1 的 context-4B 只用 ConTEB 訓練集訓練，因此在其他領域遷移較差。這句話出自 Perplexity 自己，代表 v1 context 在 ConTEB 上的 81.96% 不能直接外推到你的領域。

儲存方面有個實用數字：預覽版輸出 1024 維 INT8，每個向量 1 KB，在 chunk 檢索平均分上略高於 voyage-context-4 的 2048 維 float32（8 KB）。這只算向量本身，不含索引。

使用注意（來自[模型卡](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview)）：

- 這是預覽版，權重與介面可能不向後相容，**預覽版的向量不要和未來正式版混用**。
- 查詢要用 `encode_queries`，文件 chunk 用 `encode`；兩者前綴不同，用錯「悄悄降低檢索品質」。
- 向量是未正規化的 INT8，要用餘弦相似度比較。
- 需要 `transformers>=5.4.0` 與 `trust_remote_code=True`。
- 模型卡沒有明寫授權；二手報導說是 MIT，這點我沒有在一手頁面確認，用之前請自己看 Hugging Face 頁面的授權欄。

## v2-late：每個 token 一個向量，也能搜圖片

v2-late 的架構與評測在[專篇](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)裡有完整分析，這裡只放它在家族裡的位置。它是三條線中唯一用多向量的：基底換成 Qwen3.5，先訓練 18B teacher，再蒸餾成 9B 與 0.6B，並讓兩個尺寸共用同一個向量空間，所以能用 9B 建索引、0.6B 查詢。訓練資料 1.86 億個查詢—文件對，來自 594 個資料集、46 種語言。

要記住的取捨只有一個：它是三條線裡**儲存成本最高**的，換來的是頁面圖片檢索與 agent 場景的準確度。MADQA 92.4% 是自家測試、搭配 Gemini 3.5 Flash，細節看專篇。

## 選型矩陣

| 你的情況 | 建議 | 理由 |
|---|---|---|
| 一般語意搜尋，純文字，要立刻能用 | v1 4B；預算緊用 0.6B | 唯一有 API 的 dense 線，INT8 儲存小 |
| 長文件被切 chunk 後找不到，且文件有大量指涉與定義 | v1 context（有 API），或評測 v2 預覽版 | late chunking 保留全文脈絡；v2 預覽版不能上正式環境 |
| 要同時找到答案與佐證段落，給 agent 或人驗證 | 評測 v2-context 預覽版 | 這是它的訓練目標，但基準非公開 |
| 文件是帶表格圖表的 PDF，OCR 是瓶頸 | 評測 v2-late | 唯一可直接搜頁面圖片 |
| 儲存預算有限、向量資料庫不支援多向量 | v1 | v2-late 索引隨 token 數成長 |
| 要走 API、不想自架 | v1 或 v1 context | v2 兩條線目前都只有權重 |

站內其他選型參考：[BGE-M3 嵌入模型選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)、[ColPali 視覺文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval)。

## 整體來說

pplx-embed 這個名字下其實是三種不同的賭注：v1 賭「INT8 原生加無前綴」讓單向量夠便宜；context 賭「chunk 要帶全文、而且要學佐證不只學答案」；late 賭「索引貴一點，換 agent 與圖片檢索的準度」。三條線共通點是 Perplexity 自己的搜尋流量當作評測依據，優點是貼近真實查詢，缺點是最醒目的基準（PPLXQuery、PPLX-Q2I、context-bench）外人都拿不到。

後續要看三件事：v2 dense 什麼時候出、有沒有補上 API；context 預覽版何時轉正式版，以及 context-bench 以外有沒有第三方復現；late 技術報告發表後，92.4% 能不能被獨立重現。在那之前，要上正式環境就選有 API 與穩定版本的 v1，其他兩條線當評測候選。

## 參考資料

- [Perplexity：pplx-embed 發表文（2026-02-26）](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval)
- [Perplexity：Contextual embedding beyond the gold passage（2026-09-30）](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage)
- [Perplexity：Multimodal embeddings beyond a single vector（2026-10-07）](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector)
- [技術報告：Diffusion-Pretrained Dense and Contextual Embeddings（arXiv:2602.11151）](https://arxiv.org/abs/2602.11151)
- [Perplexity API 文件：Embeddings（模型與價格）](https://docs.perplexity.ai/docs/embeddings/quickstart)
- [Hugging Face：perplexity-ai/pplx-embed-v1-4b](https://huggingface.co/perplexity-ai/pplx-embed-v1-4b)
- [Hugging Face：perplexity-ai/pplx-embed-v2-context-9b-preview](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview)
- [Hugging Face：perplexity-ai/pplx-embed-v2-late-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-0.6b)
- [Hugging Face：perplexity-ai/pplx-embed-v2-late-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-9b)
- [pplx-embed-v2-late 導讀（站內）](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)
