---
title: "AI Engineer 面試日練 — 2026-09-09：ML System Design"
date: 2026-09-09
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今日練 ML System Design 面試最愛考的『從資料到監控』全鏈路：feature store 的 offline/online 一致性、candidate generation 到 re-ranking 的三段式 serving、A/B testing 與 shadow deployment、data drift 監控，以及 retraining cadence 怎麼接成一個 data flywheel。"
tldr: "這輪 ML System Design 聚焦 2026 年面試官最看重的『不是模型，是全鏈路』：feature store 怎麼在 offline 訓練與 online 推論之間保持同一份特徵定義（training-serving skew）、推薦系統的 candidate generation → ranking → re-ranking 三段式 serving 架構、模型上線怎麼用 A/B testing 和 shadow deployment 降風險、data drift 與 model degradation 的監控設計，以及 retraining cadence 如何接成一個能自我強化的 data flywheel。練習題是一道 OpenAI 的『設計即時推薦系統』進階題，練的是怎麼在 clarifying questions 之後，用七大元件框架把答案講成一條完整的資料到監控的鏈路。"
series:
  name: "AI Engineer 面試日練"
  order: 21
---

> 🌏 [English version](/en/posts/daily/2026-09-09-ai-interview-daily-en)

## 今日主題

今天輪到 ML System Design。這一輪跟 coding round 最大的差別是：面試官不是在看你會不會寫模型，而是在看你能不能把「資料怎麼流進來、特徵怎麼算、模型怎麼上線、上線後怎麼知道它還健康」講成一條完整的鏈路。2026 年的 ML system design 面試已經很少單獨問「怎麼訓練一個模型」，取而代之的是「設計一個服務 5000 萬 DAU 的推薦系統」這種開放題,考的是你能不能在 45 分鐘內把資料 pipeline、feature store、serving、monitoring、retraining 全部串起來,還能講出每一層的 trade-off。這種題型會出現在 onsite 的核心環節,也是區分「會調參的工程師」跟「能上生產環境的工程師」的分水嶺。

## 核心概念速記

### Feature Store 的 offline/online 一致性

Feature store 存在的理由不是「方便查特徵」,而是要讓訓練時看到的特徵定義跟推論時完全一致——這叫 training-serving skew,是生產環境 ML 系統最常見卻最難抓的 bug 來源。offline store（通常是 Spark/Hive 批次算出來,存進資料湖)負責產生訓練資料,online store（Redis 或類似的低延遲 KV)負責即時查詢,兩者必須共用同一份特徵定義與同一套 point-in-time correctness 邏輯,否則模型上線後的表現會跟離線評估對不上。

### Candidate generation → ranking → re-ranking 三段式 serving

面對百萬到千萬級的 item pool,沒有系統會對每個 item 都跑一次完整模型——標準做法是分三段收斂:candidate generation 用便宜的方法(embedding 相似度、規則過濾)先從百萬級縮到幾百到幾千個候選,ranking 用較重的模型對候選排序,re-ranking 再加上多樣性、商業規則、去重等後處理。這個三段式架構直接決定了你的 latency budget 怎麼分配——面試官會很在意你能不能講出每一段各佔多少毫秒。

### A/B testing 與 shadow deployment

新模型上線前,先跑 shadow deployment——讓新模型跟現行模型並行推論,但只有現行模型的結果會真的回傳給使用者,藉此比較兩者的輸出分佈跟延遲,而不承擔任何風險。確認穩定後才進入 A/B testing,用一小部分流量的線上指標(點擊率、轉換率、留存)驗證新模型是否真的比舊模型好——離線的 AUC 或 NDCG 進步不代表線上指標會進步,這是面試官很愛追問的點。

### Data drift 與 model degradation 監控

模型上線後最大的風險不是當機,是「悄悄變差」——輸入資料的分佈隨時間偏移(data drift)或者特徵與標籤之間的關係改變(concept drift),模型準確度會在你沒發現的情況下持續下滑。監控設計要同時看兩層:特徵分佈的統計指標(例如 PSI、KL divergence)跟線上業務指標的滑動平均,兩者都要設好 alert threshold,而不是只看模型的離線評估分數。

### Retraining cadence 與 data flywheel

retraining 的頻率不是越高越好——要在「資料新鮮度帶來的效益」跟「retraining 的運算成本與上線風險」之間找平衡點。好的系統會把使用者的互動回饋(點擊、購買、negative feedback)重新餵回訓練資料,形成一個資料越多、模型越準、使用者體驗越好、產生更多資料的 data flywheel,這也是面試官判斷你有沒有「生產環境思維」的關鍵指標之一。

## 今日練習題

### 題目

設計一個服務消費性產品(feed、商品、影片)即時推薦的端到端機器學習系統,系統必須應付高讀取流量以及不斷變化的內容與使用者行為。給定假設(可在面試中與面試官一起調整):流量約 10k QPS,p95 延遲需求 ≤150ms;商品庫存約 1000 萬筆,每天有新增與下架;回饋訊號包含點擊、按讚、購買等隱性與顯性訊號;隱私面需考量使用者同意、PII 最小化與被遺忘權。請說明並論證以下六個部分的設計:(1) 資料收集與事件 pipeline,(2) 特徵工程與 feature store(offline/online),(3) 模型訓練、標籤與 retraining 策略,(4) 線上 serving 架構(candidate generation、ranking、re-ranking),(5) 監控、告警與實驗設計,(6) 可擴展性、可靠性與成本考量。

**來源**：OpenAI（Software Engineer，Technical Screen，經 PracHub 整理）　**難度**：進階　**環節**：technical screen / onsite system design

### 拆解思路

1. **先釐清問題**：先確認核心使用情境是什麼(feed 排序?搜尋後推薦?),讀寫比例大概多少,10k QPS 是尖峰還是均值,p95 150ms 是端到端還是只算 serving 這一段,資料保留期限跟法規要求(GDPR 被遺忘權會不會影響 feature store 設計)。
2. **建立框架**：用「資料 → 特徵 → 訓練 → serving → 監控 → retraining」六段式框架逐一展開,先畫出整體資料流,再回頭深挖面試官感興趣的那一段——這樣即使被打斷去深挖某個環節,你手上還有一張完整的地圖可以回來。
3. **深入核心**：這題最關鍵的 trade-off 在 serving architecture——1000 萬商品不可能對每筆都跑重模型,candidate generation(embedding 檢索,收斂到幾百到幾千個)加 ranking(較重模型精排)的兩段式架構,才撐得住 150ms 的延遲預算;同時要講清楚 offline feature store(訓練用)跟 online feature store(推論用)怎麼保持特徵定義一致,避免 training-serving skew。
4. **收尾**：用「這個設計在 10 倍流量下第一個會壞在哪、怎麼優雅降級」跟「上線後要看哪些 metrics/alert 才能證明系統健康」收尾——這正是原題附的追問方向,提前講到會讓面試官覺得你想在他前面。

### 範例回答（面試時可以這樣講）

> **問題框定**：在動手畫架構之前,我想先確認幾個假設——這是一個 feed 類推薦場景,讀多寫少,10k QPS 是尖峰流量,p95 150ms 是從 API gateway 到回傳結果的端到端延遲。基於這個規模,我會把系統拆成離線(訓練)跟線上(serving)兩條路徑,共用同一個 feature store 定義,避免 training-serving skew。
>
> **核心架構**：資料面,使用者行為透過 Kafka 進事件流,分兩路處理——batch job(Spark)算 offline 特徵存進資料湖,供訓練用;stream job 算 online 特徵寫進 Redis,供推論即時查詢,兩邊共用同一套特徵定義程式碼,避免兩邊算出不同的答案。serving 面,1000 萬商品不可能全部跑重模型,所以用兩段式——candidate generation 用 embedding 相似度檢索,把候選收斂到幾百筆內,再用 ranking 模型精排,latency budget 大概是檢索 30ms、精排 60ms、其餘留給網路跟後處理。
>
> **監控與退化**：上線前先跑 shadow deployment 比對新舊模型的輸出分佈與延遲,穩定後才進 A/B test,看線上點擊率跟轉換率而不只是離線 AUC。監控上我會同時盯特徵分佈的 PSI 跟線上業務指標的滑動平均,設好 alert;10 倍流量下,candidate generation 這層最先撐不住,所以我會設計快取熱門候選跟降級成規則排序的 fallback,寧可精準度略降,也不要整個 serving 掛掉。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 明確講出 clarifying questions（QPS、latency、資料規模、隱私限制） | |
| offline/online feature store 怎麼保持一致（training-serving skew） | |
| serving 分幾段（candidate generation / ranking / re-ranking）與各段延遲預算 | |
| 上線策略：shadow deployment 或 A/B testing，而非直接全量上線 | |
| 監控設計：data drift／model degradation 的具體指標與 alert | |
| 加分項：10 倍流量下第一個瓶頸在哪、怎麼優雅降級 | |

## 延伸閱讀

- [Feature Store & Model Serving — System Design Space](https://system-design.space/en/chapter/feature-store-model-serving) — 專講 feature store 怎麼在 training 與 serving 之間保持「同一份特徵定義」，把 point-in-time correctness 跟 training-serving skew 講得比大部分面試教材都細。
- [How to Prepare for an AI/ML System Design Interview (2026 Roadmap)](https://www.designgurus.io/blog/prepare-for-ai-ml-system-design-interview-2026) — 提出每個 ML system design 回答都該覆蓋的七大元件框架，適合拿來對照自己的答案有沒有漏掉環節。

## 參考資料

- [Design an End-to-End ML System — PracHub](https://prachub.com/interview-questions/design-an-end-to-end-ml-system) — 今日練習題的原始題目、假設與追問方向來源（OpenAI，Software Engineer，Technical Screen）。
- [ML System Design Interview Questions (2026) — PracHub](https://prachub.com/topic/machine-learning-interview/ml-system-design) — 核心概念速記中 feature store、A/B testing、monitoring 常見考點分類的來源。
- [System Design Interview Prep 2026: Machine Learning & GenAI Guide — Fonzi](https://fonzi.ai/blog/system-design-interview) — 佐證 2026 年 ML system design 面試已轉向「feature store + serving + GenAI 堆疊」綜合題型的觀察。
