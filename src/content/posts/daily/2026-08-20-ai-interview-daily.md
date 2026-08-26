---
title: "AI Engineer 面試日練 — 2026-08-20：ML System Design"
date: 2026-08-20
category: daily
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今日練 ML 系統設計面試：feature store 架構、training-serving skew、模型上線策略與生產環境監控。"
tldr: "ML system design 面試的核心不是選哪個模型，而是怎麼讓模型在生產環境活下來。今天聚焦四個高頻考點：feature store 的 online/offline 分離、training-serving skew 的根因與防堵、模型部署策略（shadow/canary/blue-green），以及超越 HTTP error rate 的 ML-specific 監控。"
series:
  name: "AI Engineer 面試日練"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-20-ai-interview-daily-en)

## 今日主題

ML System Design 是 senior AI engineer 面試的分水嶺。它和傳統 software system design 的差別在於：你不只要設計一個能跑的系統，還要處理訓練與服務之間的一致性、模型品質隨時間退化的問題，以及離線指標和線上商業指標之間的落差。

面試官最常考的場景是推薦系統、搜尋排序、詐欺偵測和內容審查，每個場景有不同的 latency 預算和評估指標。今天不挑特定場景，而是練跨場景都會用到的四個基礎模組。

## 核心概念速記

### Training-Serving Skew

訓練時用的特徵和服務時用的特徵不一致，是生產 ML 系統最常見的 silent failure。常見原因：訓練和服務用不同的 feature pipeline 程式碼、聚合視窗不一致、或訓練時不小心用到了未來的標籤（label leakage）。解法是用同一套 feature computation 程式碼（或統一的 feature store 如 Feast、Tecton），並做 online/offline 一致性驗證。

### Feature Store 的 Online/Offline 分離

Feature store 分成 online store（低延遲 key-value lookup，服務時用）和 offline store（批次歷史 join，訓練時用）。面試時要能畫出這個雙軌架構，並解釋 point-in-time join 為什麼是必要的——沒有它，訓練資料會包含未來資訊，模型在線上的表現會比離線測試差很多。

### 模型部署策略

三種主要策略各有適用場景。Shadow deployment 把生產流量同時送給新舊模型，只記錄新模型的預測但不實際服務，適合高風險場景的初步驗證。Canary rollout 把少量流量（如 5%）導向新模型，逐步提高比例，適合大多數情境。Blue-green deployment 維持兩套完整環境，切換瞬間完成，適合需要快速 rollback 的場景。面試時能說出「我會先 shadow 兩天觀察預測分佈，再 canary 5% 一週看商業指標」就很加分。

### ML-Specific 監控

ML 系統的監控不能只看 HTTP 5xx 和 latency。你至少需要追蹤三層東西：資料層（input feature 的分佈偏移、null rate 異常）、模型層（預測分佈偏移、confidence calibration 退化）、商業層（CTR/conversion 等下游指標）。面試時提到 data drift detection 和設定 retraining trigger 的閾值邏輯，會讓面試官知道你有生產經驗。

## 今日練習題

### 題目

「設計一個 feature store pipeline，能以 sub-millisecond latency 服務即時特徵。」

**來源**：Uber MLE 面試　**難度**：進階　**環節**：onsite system design

### 拆解思路

1. **先釐清問題**：問面試官——有多少特徵？QPS 多少？特徵的更新頻率？有沒有需要即時計算的聚合特徵（如「過去 5 分鐘的交易次數」）？這些問題決定架構的複雜度。

2. **建立框架**：畫出三個部分——(a) 資料攝入層（streaming + batch），(b) feature computation 層，(c) 服務層（online store）。解釋每層的技術選型和 trade-off。

3. **深入核心**：sub-millisecond 的要求意味著你不能在請求時做即時計算。核心 trade-off 是 **freshness vs. latency**——預先計算好存入 Redis/DynamoDB 這類 KV store（快但可能過時），還是在請求時即時聚合（新但慢）。面試官想聽你怎麼拆：高頻更新的特徵用 streaming pipeline（Kafka + Flink）寫入 online store，低頻的用 batch pipeline，設定每個特徵的 freshness SLA 和 TTL。

4. **收尾**：提到一致性保障（online/offline feature parity 驗證）、監控（feature freshness 告警、null rate 監控），以及怎麼處理 online store 掛掉的 fallback 策略（降級到 batch 特徵或使用 default value）。

### 範例回答（面試時可以這樣講）

> 我會把 feature store 分成三層來設計。
>
> **第一層：資料攝入。** 即時特徵走 Kafka → Flink streaming job，計算滑動視窗聚合（例如「過去 5 分鐘的交易次數」），結果寫入 Redis cluster 作為 online store。歷史特徵走 Spark batch pipeline，每小時跑一次，寫入 S3（Parquet 格式）作為 offline store，同時 backfill 到 Redis。
>
> **第二層：服務。** Online serving 走 Redis cluster，p99 latency 在 sub-millisecond。每個特徵設定 freshness SLA 和 TTL——例如 `user_last_activity` 要求 < 1 秒、TTL 60 秒，而 `user_lifetime_value` 可以接受 1 小時延遲、TTL 24 小時。請求時 Redis 如果 miss，fallback 到預設值而不是即時計算，避免 latency spike。
>
> **第三層：一致性保障。** 訓練時用 offline store 做 point-in-time join，確保不用到未來資料。上線前跑 online/offline consistency check——對同一批 entity key 同時拉 online 和 offline 的值，比較分佈是否一致，不一致就擋住上線。
>
> 監控的部分，我會追蹤三個東西：feature freshness（每個特徵的實際延遲 vs. SLA）、null rate（突然飆高代表上游出問題）、以及 online/offline feature drift（分佈偏移超過閾值觸發告警）。
>
> 如果 Redis cluster 整個掛掉，降級策略是：用 batch pipeline 最近一次 backfill 的快照提供 stale 特徵，同時觸發告警讓 oncall 介入。寧可用舊特徵也不要讓模型拿到 null。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| Online/offline store 分離（Redis vs. S3/data lake） | |
| Streaming + batch 雙路攝入 | |
| 每個特徵的 freshness SLA 和 TTL | |
| Point-in-time join 防止 label leakage | |
| Online/offline consistency check | |
| Fallback 策略（Redis 掛掉怎麼辦） | |
| 監控：freshness、null rate、feature drift | |
| 加分：feature versioning / lineage tracking | |

## 延伸閱讀

- [CalibreOS — ML System Design Interview Guide 2026](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — 涵蓋 MLSD 面試從 problem framing 到 monitoring 的完整框架，附 Google、Meta、Uber 的真實考題
- [PracHub — Production ML Serving, Feature Stores, And Monitoring](https://prachub.com/concepts/production-ml-serving-feature-stores-and-monitoring) — 深入 feature store 的 online/offline 架構和 training-serving skew 的防堵策略
- [Exponent — Machine Learning Interview Prep 2026](https://www.tryexponent.com/blog/machine-learning-interview-guide) — ML 面試的分輪拆解指南，含 Waymo 和 Meta 的系統設計真題

## 參考資料

- [CalibreOS — ML System Design Interview Guide 2026](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — 核心概念速記中的面試高頻場景（推薦系統、詐欺偵測等）和六層架構框架
- [PracHub — Production ML Serving, Feature Stores, And Monitoring](https://prachub.com/concepts/production-ml-serving-feature-stores-and-monitoring) — feature store online/offline 分離架構、training-serving skew 的成因分析、feature freshness SLA 設計
- [Uber MLE Interview Questions 2026](https://dataford.io/interview-guides/uber/machine-learning-engineer) — 今日練習題來源：sub-millisecond feature store 設計
