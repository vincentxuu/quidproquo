---
title: "ML System Design 面試攻略：從需求拆解到生產架構"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, system-design, mlops]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 ML 系統設計環節——從 problem framing、data pipeline、feature engineering、model serving 到 monitoring 的完整框架。"
tldr: "ML System Design 面試的核心不是選模型，而是怎麼把一個商業目標變成一個可上線、可監控、可迭代的 ML 系統。面試官想看你能不能：把業務目標翻成 ML 目標、設計 data pipeline 和 feature store、選擇合理的 serving 策略、規劃 monitoring 和 A/B testing。"
series:
  name: "AI Engineer 面試準備"
  order: 5
---

ML System Design 是 senior+ AI engineer 面試中權重最高的一輪。它和傳統 software system design 的差別不在「多了模型」，而在多了一整條從資料到模型品質退化的不確定性鏈。面試官想看的不是你能不能畫出一張架構圖，而是你在每一層做選擇時，有沒有意識到 trade-off 並能說清楚為什麼。

## 結構化答題框架：六層

拿到題目後，用這六層結構走一遍。不用每層花一樣的時間——前兩層花 5 分鐘對齊問題，中間兩層是技術核心花 15 分鐘，最後兩層花 5 分鐘收尾。面試官最常抱怨的是候選人直接跳到「我要用 Transformer」，跳過了前面的問題定義。

1. Problem Framing
2. Data Pipeline
3. Feature Engineering
4. Model Training & Selection
5. Serving
6. Monitoring & Iteration

## Problem Framing：把業務目標翻成 ML 目標

這一步最容易被低估，但它決定了後面所有設計的方向。面試官說「設計一個推薦系統」，你的第一個動作不是畫架構，而是問清楚三件事：

**業務目標是什麼？** 「提升 engagement」太模糊。是要提升點擊率、觀看時長、還是完成率？不同目標對應不同的 ML 目標函數——optimize for CTR 和 optimize for watch time 會導致完全不同的模型和特徵設計。

**成功指標怎麼定？** 離線指標（AUC、NDCG）和線上指標（CTR、revenue per session）之間有 gap。面試時能說出「我會先用 NDCG@10 做離線評估，但最終以線上 A/B test 的 session watch time 為準」，就展現了生產經驗。

**約束條件是什麼？** Latency budget（p99 < 100ms？< 500ms？）、QPS、cold start 問題、隱私限制。這些約束直接影響你的模型複雜度和 serving 策略。

## Data Pipeline：資料收集、標註、驗證

ML 系統的品質天花板是資料品質，不是模型架構。面試時提到資料面的設計，會讓面試官知道你不是只在 Jupyter notebook 裡訓練模型的人。

**資料來源**：user interaction logs（implicit feedback）、explicit ratings、third-party data。Implicit feedback 量大但 noisy（看了不代表喜歡），explicit feedback 精確但稀疏。

**標註策略**：human annotation（品質高、成本高、慢）、heuristic labeling（用規則產生弱標籤，如「使用者停留超過 30 秒 = 正樣本」）、active learning（讓模型挑最不確定的樣本送去標註）。面試時能根據場景選擇策略並解釋 trade-off，比背教科書有用得多。

**資料驗證**：schema validation（欄位類型、null rate）、distribution monitoring（特徵分佈偏移）、freshness check（資料延遲是否超過 SLA）。提到 Great Expectations 或 TFX Data Validation 這類工具會加分，但重點是你知道為什麼需要驗證。

## Feature Engineering：Feature Store 與 Online/Offline 分離

這是 ML system design 面試的高頻考點，因為它是 training-serving skew 的主要來源。

**Feature store 雙軌架構**：offline store（資料湖，批次歷史 join，訓練用）和 online store（低延遲 KV，服務用）。兩邊用同一套 feature computation 邏輯，避免 skew。

**Point-in-time join**：訓練時必須確保每個樣本只用到該時間點之前的特徵值，否則就是 label leakage。這個概念在面試中經常被追問——如果你不知道為什麼需要它，面試官會認為你沒有處理過真實訓練資料。

**Feature 分類**：

| 類型 | 範例 | 更新頻率 | 計算方式 |
|------|------|----------|----------|
| 靜態特徵 | 用戶年齡、國家 | 天/週 | Batch |
| 緩慢變化 | 用戶偏好 embedding | 小時 | Batch + backfill |
| 即時特徵 | 最近 5 分鐘點擊數 | 秒 | Streaming (Flink/Kafka) |

面試時能畫出這個分類並解釋每類的計算路徑，就已經超過大多數候選人了。

## Model Training & Selection

面試的陷阱是直接跳到最複雜的模型。正確的敘事是：baseline first, then iterate。

**Baseline**：先用最簡單的方法建立下限。推薦系統的 baseline 可以是 popularity-based ranking；詐欺偵測的 baseline 可以是 rule-based system。Baseline 的價值是讓你知道 ML 到底能帶來多少增量。

**候選模型演進**：以推薦系統為例，從 logistic regression → gradient boosted trees → two-tower neural model → 加上 cross-attention 的 deep model。每一步都要能說出「為什麼需要升級」——不是因為更複雜就更好，而是因為上一個模型在某個面向（如 cold start、長尾物品覆蓋）不夠好。

**訓練基礎設施**：model versioning（每次訓練產出一個可追溯的 artifact）、experiment tracking（MLflow、W&B）、reproducibility（固定 seed、記錄 hyperparameter）。面試時不用深入每個工具，但要能說出「我會怎麼管理多個實驗」。

## Serving：Batch vs Real-time

Serving 策略的選擇取決於 latency budget 和資料新鮮度需求。

**Batch inference**：定期跑完所有預測存起來，請求時直接查表。適合推薦系統的「你可能喜歡」區塊——每小時更新一次就夠了。優點是簡單、便宜、latency 低（查表）；缺點是無法反映即時行為。

**Real-time inference**：每個請求即時計算。適合搜尋排序、詐欺偵測這類需要即時特徵的場景。需要考慮 model serving framework（TensorFlow Serving、Triton、vLLM）、model optimization（quantization、ONNX 轉換、batching）、以及 fallback 策略（模型服務掛了怎麼辦——退回 heuristic rules、用最近的 cached 結果、或降級到更簡單的模型）。

**Two-stage retrieval + ranking**：大規模推薦系統的標準架構。第一階段用便宜的模型（如 ANN 檢索）從百萬候選中篩出幾百個，第二階段用複雜模型精排。面試時能畫出這個 funnel 並說出每一層的 latency budget 分配，是很強的加分項。

## Monitoring：Data Drift 與模型退化

ML 系統和傳統軟體最大的差別：**程式碼不變，模型也會壞**。使用者行為改變、資料分佈偏移、上游資料源出問題，都會讓模型品質無聲退化。

**三層監控**：

- **資料層**：input feature 分佈偏移（PSI、KL divergence）、null rate 異常、資料延遲
- **模型層**：預測分佈偏移、confidence calibration 退化、latency 異常
- **商業層**：CTR、conversion rate、revenue 等下游指標

**Retraining trigger**：不是固定排程（「每週重訓一次」），而是基於監控指標的 trigger——data drift 超過閾值、離線 metrics 下降超過 X%、或商業指標連續三天下降。面試時能說出這個邏輯，比說「我會用 Kubeflow 做自動 retraining」更有說服力。

**A/B Testing**：新模型上線前必須做 A/B test。要能說出 sample size 怎麼估算（power analysis）、跑多久（至少一個 business cycle，通常一到兩週）、以及怎麼處理 network effect（如果用戶之間有互動，簡單的隨機分組會有 interference）。

## 常見題型與答題節奏

| 題型 | 核心考點 | 容易忽略的面向 |
|------|----------|--------------|
| 設計推薦系統 | Two-stage retrieval, cold start, diversity | Exploration vs. exploitation, filter bubble |
| 設計詐欺偵測 | 極端 class imbalance, real-time 需求 | False positive 的商業成本, 對抗性攻擊 |
| 設計內容審查 | Multi-modal, human-in-the-loop | Latency SLA（發布前 vs 發布後審查）, 文化差異 |
| 設計搜尋排序 | Query understanding, learning to rank | Position bias, 點擊 ≠ 滿意 |

**時間分配建議**（45 分鐘面試）：

- 0-5 min：Problem framing，問 clarifying questions
- 5-10 min：Data pipeline 和 feature engineering 的高層設計
- 10-30 min：Model + serving 的技術深入，畫架構圖
- 30-40 min：Monitoring 和 iteration 策略
- 40-45 min：面試官的 follow-up 追問

最重要的一點：**面試官追問時不要防禦**。他們追問通常是在測試你的深度，不是在否定你的設計。「你說得對，這裡確實有 X 的風險，我可以用 Y 來緩解」比「不會有這個問題」強很多。

## 面試模擬題

### 題目

「設計一個即時詐欺偵測系統，要能在用戶發起交易後 200ms 內回傳風險分數。」

**來源**：Stripe MLE onsite　**難度**：進階　**環節**：onsite system design

### 拆解思路

1. **先釐清問題**：問面試官——QPS 多少？誤判（false positive）的商業成本？漏判（false negative）的商業成本？需不需要解釋風險分數的原因？歷史資料量多大？
2. **建立框架**：用六層結構——Problem Framing → Data Pipeline → Feature Engineering → Model → Serving → Monitoring。
3. **深入核心**：200ms 的延遲限制是最大的設計約束。這意味著特徵計算和模型推論都必須在線完成，不能走 batch pipeline。核心 trade-off 是 feature freshness vs. latency，以及 model complexity vs. inference speed。
4. **收尾**：強調 monitoring 的重要性——詐欺模式會不斷演化（concept drift），需要持續的 retraining 策略和 adversarial monitoring。

### 範例回答（面試時可以這樣講）

> **Problem framing。** 商業目標是「降低詐欺損失」，ML 目標是「對每筆交易預測一個 0-1 的風險分數」。閾值之上的交易走人工審核或直接攔截。關鍵指標是 precision（誤攔正常交易會流失用戶）和 recall（漏放詐欺交易是直接損失）。根據業務需求決定偏重哪邊——通常 recall 更重要，因為一筆詐欺的損失遠大於一次誤攔的體驗損失。
>
> **Data + Features。** 特徵分兩類。靜態特徵（用戶帳齡、歷史交易頻率、設備指紋）預計算好存在 feature store 的 online store（Redis），lookup 延遲 < 1ms。動態特徵（過去 5 分鐘的交易金額總和、過去 1 小時的不同 IP 數）走 Flink streaming pipeline 即時計算，寫入 Redis。每個特徵設定 freshness SLA——設備指紋可以 1 小時更新一次，但「最近 5 分鐘交易次數」必須 < 5 秒。
>
> **Model + Serving。** 第一版用 gradient boosted tree（XGBoost/LightGBM），推論延遲 < 5ms，加上特徵 lookup 總共 < 50ms，遠在 200ms 預算內。不用 deep learning 是因為 tabular data 上 GBDT 通常不比 DNN 差，而且可解釋性更好。Serving 用 model server（Triton 或自建），水平擴展。預留 fallback：model server 掛掉時用 rule-based 系統接管（簡單規則如「金額 > 10,000 就送人工」）。
>
> **Monitoring。** 詐欺模式會演化，所以 monitoring 特別重要。追蹤三層：feature drift（某個特徵的分佈突然變了）、prediction drift（風險分數的分佈偏移）、label delay（詐欺標籤通常延遲 1-30 天才確認，需要設計 delayed labeling pipeline）。Retraining 頻率先設週更，觀察 drift 程度再調整。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 把業務目標翻成 ML 目標（precision/recall trade-off） | |
| 靜態特徵 + 動態特徵的雙軌 feature 設計 | |
| 200ms 延遲預算的分配（feature lookup + inference） | |
| 模型選擇的理由（GBDT vs DNN 的 trade-off） | |
| Fallback 策略（model server 掛掉怎麼辦） | |
| Monitoring：feature drift + prediction drift + label delay | |
| 加分：提到 adversarial adaptation（詐欺者會反向學習） | |

## 參考資料

- [Chip Huyen — Designing Machine Learning Systems](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — ML 系統設計的完整框架，涵蓋 data pipeline、feature engineering、monitoring 等面試核心環節
- [CalibreOS — ML System Design Interview Guide 2026](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — 面試結構化答題框架與 Google、Meta、Uber 真實題型的拆解
- [Stanford CS 329S: Machine Learning Systems Design](https://stanford-cs329s.github.io/) — ML 系統設計課程，涵蓋本篇 problem framing 到 monitoring 的六層結構
- [Feast — Open Source Feature Store](https://feast.dev/) — feature store 的 online/offline 分離架構實作參考，面試中提到 Feast 或 Tecton 會加分
- [Made With ML — ML System Design](https://madewithml.com/) — 從 data pipeline、model serving 到 A/B testing 的端到端 ML 系統設計教程
