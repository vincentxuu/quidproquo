---
title: "pplx-embed——Perplexity 的嵌入模型家族：v2-context、late interaction 與 v1 怎麼選"
date: 2026-10-09
category: tech
type: deep-dive
tags: [llm, embeddings, perplexity, pplx-embed, rag, open-weights, model-family-pplx-embed, model-selection]
lang: zh-TW
tldr: "pplx-embed 是 Perplexity 的嵌入模型家族。目前的主力是 2026 年 10 月底釋出、11 月上 API 的 pplx-embed-v2-context（0.6B／9B）：文字與圖片共用一個向量空間，可整份文件一個向量，也可每個 chunk 一個看過全文的向量，API 每百萬 token $0.02／$0.12。v2-late 是多向量的另一條線，只有權重；v1 仍在 API 上，但官方已宣布 2027 年內逐步停用。"
description: "Perplexity pplx-embed 模型家族介紹：2026-02 到 2026-11 的演化時間線、v2-context 正式版的訓練方式與官方評測、v2-late 多向量線的定位、v1 的停用時程、API 定價與授權，以及依文件型態與預算的選型矩陣。"
series:
  name: "AI 模型家族"
  order: 25
draft: false
---

> :globe: [English version](/posts/tech/2026-10-09-ai-model-family-pplx-embed-en)

Perplexity 在 2026 年 10 月下旬放出 [pplx-embed-v2-context](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b) 的正式版權重（0.6B 與 9B），11 月接著上 [Embeddings API](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings)，取代 9 月底的 9B 預覽版。它一個模型就涵蓋文字與圖片、整份文件與帶全文脈絡的 chunk，API 文件也把它列為新使用者的預設，2 月的 [pplx-embed-v1](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval) 則排定 2027 年內逐步停用。另一條 10 月 7 日釋出的 [pplx-embed-v2-late](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector) 走多向量路線，解決的是不同問題。這篇是「AI 模型家族」系列的第二十五篇，回答一個問題：你的文件該用哪一個。

怎麼讀文中引用的跑分，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。想看模型在整體版圖的位置，見[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。其中 v2-late 的細節另有一篇：[pplx-embed-v2-late 導讀](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| pplx-embed-v2-context（0.6B／9B） | 主力：文字與圖片檢索，整份文件或帶全文的 chunk | 0.6B 輸出 1024 維（API 可選 512）；9B 輸出 2048 維、可截成 1024；兩者在 1024 維共用向量空間 | API；9B 權重 MIT，0.6B 模型卡未標授權 |
| pplx-embed-v2-late（0.6B／9B） | 多向量／頁面圖片檢索 | 每個 token 一個 128 維向量；MaxSim | MIT 權重；API 文件未列 |
| pplx-embed-v1、pplx-embed-context-v1（0.6B／4B） | 舊版 API，2027 年內逐步停用 | 純文字；dense 與 context 分開兩個模型 | MIT 權重；API 仍可用 |

### v2-context 一個模型做三件事

v1 時代要分 dense（`pplx-embed-v1`）與上下文（`pplx-embed-context-v1`）兩個模型，v2-context 把它們併成一個，再加上圖片：

| | v2-context 的用法 | 輸出 |
|---|---|---|
| 整份文件或短文字 | 每個字串當一份文件，`input_type: "document"` | 每份一個向量 |
| 長文件切 chunk | 同一份文件的 chunk 照順序放成一個陣列 | 每個 chunk 一個向量，算的時候看過整份文件 |
| 頁面截圖、掃描件、照片 | base64 圖片，`num_chunks` 指定切成幾條橫帶（1、2、4、8、16 或 32） | 每張圖一個向量，或每條橫帶一個 |
| 查詢 | `input_type: "query"`，跟文件用同一個模型 | 每個查詢一個向量 |

API 規格：每份文件或文字最長 32,768 token，單次請求最多 512 份、16,000 個 chunk、120,000 token；圖片請求最多 96 張、20 MB，文字與圖片不能混在同一個請求。向量是 INT8 或 binary。

## 家族演化

### 家族演化時間線

| 時間 | 型號 | 改變了什麼選型 |
|---|---|---|
| 2026-02-11 | 技術報告 | [arXiv:2602.11151](https://arxiv.org/abs/2602.11151) 先於模型發表 |
| 2026-02-26 | pplx-embed-v1、pplx-embed-context-v1 | 0.6B 與 4B 各兩個，共四個型號；MIT 授權、同步上架 API，是當時唯一能走 API 的一代 |
| 2026-09-30 | pplx-embed-v2-context-9b-preview | 9B 上下文嵌入預覽版，與 turbopuffer 合作；只有權重，介面可能不向後相容，只適合評測 |
| 2026-10-07 | pplx-embed-v2-late-0.6b／9b | 多向量、文字加圖片；權重 MIT，多了一條不用 OCR 搜 PDF 頁面的路 |
| 2026-10-21／10-28 | pplx-embed-v2-context-0.6b／9b 正式版 | 權重上 Hugging Face，底模換成 v2-late，支援圖片；技術報告 [arXiv:2610.38854](https://arxiv.org/abs/2610.38854) |
| 2026-11 | v2-context 上 API；v1 排定停用 | API 文件把 v2 列為新使用者預設，v1「2027 年內逐步停用」，選型主力從 v1 換成 v2-context |

v1 當年的賣點是「INT8 下打平」：官方報告 4B INT8 在 MTEB(Multilingual, v2) 檢索拿 69.66%，和 Qwen3-Embedding-4B 的 69.60% 幾乎相同，但儲存比 FP32 小 4 倍；context-v1-4B 在 ConTEB 拿 81.96%。這些是 v1 發表文的數字，評測條件和下面 v2-context 的表不同，不能直接拿來比。

## 架構與訓練取捨

### v2-context：從 late 骨幹微調，學「答案加佐證」

context 這條線處理的是 chunking 的老問題：段落被切出來以後，指涉、標題、定義都掉了。做法是 late chunking，整份文件一次過模型，之後才在 chunk 範圍內做池化，每個 chunk 向量都看過全文。chunk 之間用學出來的 `<|chunk_sep|>` token 分隔，chunk 與查詢向量都是 token 向量的平均。

v2 的改動在訓練監督。傳統做法用 LLM 標一個「金標準段落」，其他段落全當負例，連提供佐證的段落也算。v2-context 改用 Perplexity 自家的查詢感知上下文壓縮模型當老師：它對文件每個 token 給相關性分數，再聚合成 chunk 分數，讓嵌入模型學到「答案段落加佐證段落」。因為分數是逐 token 的，換一種切法不用重新標註。[技術報告](https://arxiv.org/abs/2610.38854)的消融實驗顯示，拿掉這個蒸餾損失，Q2D-Chunk 平均掉 15.2 分、ConTEB 掉 14.6 分。

正式版和預覽版的差別在骨幹與尺寸。Hugging Face 上兩個正式版的 `base_model` 分別是 v2-late-9b 與 v2-late-0.6b，也就是 vision-language 骨幹，所以能吃圖片；兩者都用 LoRA 微調，發佈的是同一次訓練多個 checkpoint 平均的 model soup。9B 輸出 2048 維 INT8，用 Matryoshka 損失讓前 1024 維也能單獨用；0.6B 是對準 9B 的 1024 維前綴訓練的，所以能用 9B 建索引、0.6B 查詢。文字訓練資料約 440 個公開與內部資料集、50 多種語言，9B 約 5,700 萬組查詢—文件對；報告寫明沒有用到 ConTEB、context-bench 或 Q2D-Chunk 的資料訓練。

另一個跟 v1 相反的取捨：**v2 有前綴**。v1 刻意不用 instruction 前綴，理由是索引與查詢的前綴不一致會悄悄拖垮檢索；v2-context 則用不同前綴訓練查詢與文件，模型卡要求查詢用 `encode_queries`、文件用 `encode`，API 則強制帶 `input_type`，沒帶直接回 HTTP 400。等於把「前綴用錯」這個風險交給 API 介面擋。

### v2-late：每個 token 一個向量，也能搜圖片

v2-late 的架構與評測在[專篇](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)裡有完整分析，這裡只放它在家族裡的位置。它是家族裡唯一用多向量的：基底換成 Qwen3.5，先訓練 18B teacher，再蒸餾成 9B 與 0.6B，並讓兩個尺寸共用同一個向量空間，所以能用 9B 建索引、0.6B 查詢。訓練資料 1.86 億個查詢—文件對，來自 594 個資料集、46 種語言。v2-context 正式版就是從它微調出來的。

### v1 留下的設計

v1 從 Qwen3（0.6B 與 4B）出發，拿掉因果遮罩，用擴散去噪目標在約 2,500 億 token、30 種語言上繼續預訓練，把 decoder 改成雙向 encoder，再做對比學習。量化是訓練的一部分：訓練期間就用 straight-through 估計讓向量以 INT8 運作。這個「原生 INT8」的設計延續到 v2-context。

## 評測與競品比較

以下全是 Perplexity 在 v2-context [技術報告](https://arxiv.org/abs/2610.38854)裡自報的正式版數字。三個基準測的東西不同，各自在表內比較，不合成一張排名。

### context-bench：找答案、找佐證、分辨相似文件

turbopuffer 持有的非公開基準，2,099 個查詢、38,894 份長文件、21 個領域，Perplexity 的模型由 turbopuffer 盲測。在 K=10、單位是 %：

| 模型 | Answer@10 | 佐證召回@10（文件內） | Document@10 |
|---|---|---|---|
| pplx-embed-v2-context-9b | **45.5** | **40.6** | **61.6** |
| voyage-context-4 | 31.1 | 35.6 | 51.6 |
| pplx-embed-context-v1-4b | 26.4 | 36.4 | 58.1 |
| pplx-embed-v2-context-0.6b | 21.9 | 23.8 | 39.0 |

9B 領先，但 0.6B 在這個基準落後 v1 的 context-4B，報告也直說 0.6B 在這裡不如較大的上下文模型。絕對值不高，代表這個基準對所有模型都難；外人無法自己複現。

### Q2D-Chunk：真實搜尋流量

Perplexity 從自家搜尋紀錄建的新基準（6,069 個基本查詢、10 種語言、26 個領域），已公開成 [Hugging Face 排行榜](https://huggingface.co/spaces/perplexity-ai/q2d-chunk-leaderboard)。主指標是 Answer@10（基本查詢，128 token chunk）：v2-context-9b 86.4%、voyage-context-4 83.9%、v2-context-0.6b 83.1%、context-v1-4b 74.9%。佐證召回這一項則是非上下文的 Nemotron-3-Embed-8B 最高，報告推測是佐證段落和查詢字面重疊多。

### ConTEB：公開的上下文檢索基準

八個任務平均 nDCG@10：v2-context-9b 83.4%、context-v1-4b 82.1%、v2-context-0.6b 80.7%、voyage-context-4 80.4%。9B 在八項裡贏五項；context-v1 用過 ConTEB 訓練集，在 Insurance 與 NarrativeQA 仍較高，COVID-QA 則是 Nemotron-3-Embed-8B 最高（這個任務偏字面匹配，上下文幫助有限）。

### 圖片與儲存

報告說 v2-context 在 ViDoRe-V3 與 MIRACL-Vision 上是 dense 檢索器裡的最佳結果，ViDoRe-V3 上 9B 每張圖切兩條、用 1024 維時，超過 Nemotron-3.5-8B，索引小 4 倍。要更高的頁面圖片準確度，多向量的 v2-late 仍是另一個選項，代價是索引大得多。

儲存方面，v2-context 一個 chunk 一個向量，向量數和一般 chunk 索引一樣；9B 截成 1024 維 INT8 時每個向量 1 KB。報告的實驗是：切細一點再截到 1024 維，在同樣索引大小下通常比較好。

## 授權、價格與部署

### API 價格

取自 [Perplexity Embeddings 文件](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings)，每百萬 token（資料日期 2026-11-23）：

| 型號 | 文字 | 圖片 | 狀態 |
|---|---|---|---|
| pplx-embed-v2-context-0.6b | $0.02 | $0.40 | 官方建議的預設，吞吐量高、延遲低 |
| pplx-embed-v2-context-9b | $0.12 | $0.42 | 要檢索品質時選 |
| pplx-embed-v1-0.6b | $0.004 | — | 2027 年內逐步停用 |
| pplx-embed-v1-4b | $0.03 | — | 2027 年內逐步停用 |
| pplx-embed-context-v1-0.6b | $0.008 | — | 2027 年內逐步停用 |
| pplx-embed-context-v1-4b | $0.05 | — | 2027 年內逐步停用 |

v2-context 走 `POST /v1/embeddings`；v1 的 context 型號走另一個端點 `POST /v1/contextualizedembeddings`。圖片的 token 數依圖片大小與 `num_chunks` 而定，以回應的 `usage.prompt_tokens` 為準。v1 官方的說法是「2027 年內逐步停用，新使用者用 v2、既有使用者鼓勵遷移」，文件沒有給確切停用日期。v2-late 目前不在 API 文件的模型表裡，只能自架。

### 權重授權

- **v2-context-9b**：Hugging Face 模型卡標 MIT。
- **v2-context-0.6b**：模型卡的 metadata 沒有授權欄，repo 裡也沒有 LICENSE 檔。商用自架前要先向 Perplexity 確認，或改走 API。
- **v2-late 0.6B／9B、v1 全系列、9B 預覽版**：Hugging Face 標 MIT。

自架 v2-context 需要 `transformers>=5.4.0` 與 `trust_remote_code=True`，建議另裝 `flash-linear-attention` 與 `causal-conv1d` 走快速的 linear attention 路徑。

## Agent 使用與選型

### 選型矩陣

| 你的情況 | 建議 | 理由 |
|---|---|---|
| 新專案，一般語意搜尋或 RAG，要走 API | v2-context-0.6b | 官方預設，$0.02，文字與 chunk 兩種用法都有 |
| 長文件被切 chunk 後找不到，文件有大量指涉與定義 | v2-context-9b 的 chunk 模式 | context-bench 與 Q2D-Chunk 都是 9B 最好；0.6B 在 context-bench 落後明顯 |
| 要同時找到答案與佐證段落，給 agent 或人驗證 | v2-context-9b | 這是它的訓練目標；但主要基準之一非公開 |
| 文件是帶表格圖表的 PDF 或截圖 | 先試 v2-context 的圖片輸入，再評測 v2-late | v2-context 是單向量、索引小；v2-late 多向量更細，但索引隨 token 數成長 |
| 大量文件建一次索引、查詢要快 | 9B 建索引（1024 維），0.6B 查詢 | 兩者在 1024 維共用向量空間 |
| 已經用 v1 上線 | 排時間遷到 v2-context | v1 在 2027 年內逐步停用；換模型要重建索引，v1 與 v2 的向量不能混用 |
| 自架商用、法務要明確授權 | v2-context-9b 或 v2-late | 0.6B 的 v2-context 模型卡未標授權 |

站內其他選型參考：[BGE-M3 嵌入模型選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)、[ColPali 視覺文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval)。

### v2-context 使用注意

來自[模型卡](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b)與 [API 文件](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings)：

- 查詢要用 `encode_queries`（API 是 `input_type: "query"`），文件 chunk 用 `encode`（API 是 `"document"`）；用錯會「悄悄降低檢索品質」。標題、摘要、FAQ 這類要被索引的短文字也算文件。
- chunk 模式下同一份文件的 chunk 不能重疊，要照原文順序放。
- 向量是未正規化的 INT8，要用餘弦相似度，或開 `normalize_embeddings=True` 後用內積。
- 9B 要截成 1024 維時，先取前 1024 維再正規化；只有 1024 與 2048 兩種維度有訓練過。
- 9B 預覽版的向量不要和正式版混用：預覽版模型卡就提醒過權重與介面可能不向後相容。

## 限制與取捨

### 整體來說

pplx-embed 這個名字下現在是兩種賭注：v2-context 賭「一個單向量模型就夠，只要 chunk 帶全文、而且學佐證不只學答案」，連圖片都用同一套切塊思路；v2-late 賭「索引貴一點，換更細的 token 級比對」。v1 的「原生 INT8」被 v2 繼承，「不用前綴」則被 v2 推翻、改由 API 強制 `input_type` 擋錯。

限制有三個。第一，最醒目的數字都是 Perplexity 自報，context-bench 外人拿不到；Q2D-Chunk 雖然公開成排行榜，資料仍來自 Perplexity 自家搜尋流量。第二，0.6B 便宜又是 API 預設，但在 context-bench 這類需要長距離脈絡的題目上明顯落後 9B，chunk 檢索要先用自己的文件比過。第三，v1 停用只給了「2027 年內」，沒有確切日期，已經上線的人要自己排遷移，且換模型等於重建整個索引。

## 更新紀錄

- 2026-11-23：依換代規則改寫。v2-context 正式版（0.6B 於 2026-10-21、9B 於 2026-10-28 上 Hugging Face，11 月上 API）成為主力：矩陣、架構、評測、價格與選型改寫成 v2-context，評測換成技術報告 arXiv:2610.38854 的正式版數字。v1 的價格保留並標注官方「2027 年內逐步停用」，v1 的評測表與訓練細節縮成家族演化與架構段的一段文字。原文「dense 單向量的 v2 還沒出」已不適用（v2-context 也提供整份文件一個向量的用法）；原文說預覽版「模型卡沒有明寫授權」，Hugging Face 上該模型卡的 metadata 標的是 MIT，已更正。補上 v2-context-0.6b 模型卡未標授權。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [Perplexity API 文件：Embeddings（v2 與 v1 模型、價格、輸入限制、v1 停用說明）](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings)
- [Perplexity API Changelog（2026-11：v2-context 上 API）](https://docs.perplexity.ai/docs/resources/changelog)
- [技術報告：Contextual Embeddings Beyond the Gold Chunk（arXiv:2610.38854）](https://arxiv.org/abs/2610.38854)
- [Hugging Face：perplexity-ai/pplx-embed-v2-context-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b)
- [Hugging Face：perplexity-ai/pplx-embed-v2-context-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-0.6b)
- [Hugging Face：Q2D-Chunk 排行榜](https://huggingface.co/spaces/perplexity-ai/q2d-chunk-leaderboard)
- [Perplexity 社群公告：Introducing pplx-embed-v2-context（2026-11-03）](https://community.perplexity.ai/t/introducing-pplx-embed-v2-context-open-weight-vision-language-embedding-models-in-9b-and-0-6b/6466)
- [Perplexity：pplx-embed 發表文（2026-02-26）](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval)
- [Perplexity：Contextual embedding beyond the gold passage（2026-09-30）](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage)
- [Perplexity：Multimodal embeddings beyond a single vector（2026-10-07）](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector)
- [技術報告：Diffusion-Pretrained Dense and Contextual Embeddings（arXiv:2602.11151）](https://arxiv.org/abs/2602.11151)
- [Hugging Face：perplexity-ai/pplx-embed-v1-4b](https://huggingface.co/perplexity-ai/pplx-embed-v1-4b)
- [Hugging Face：perplexity-ai/pplx-embed-v2-context-9b-preview](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview)
- [Hugging Face：perplexity-ai/pplx-embed-v2-late-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-0.6b)
- [Hugging Face：perplexity-ai/pplx-embed-v2-late-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-9b)
- [pplx-embed-v2-late 導讀（站內）](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction)
