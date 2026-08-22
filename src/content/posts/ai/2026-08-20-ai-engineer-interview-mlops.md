---
title: "MLOps & Deployment 面試攻略：從 CI/CD 到模型監控"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, mlops, deployment, monitoring]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 MLOps 環節——ML pipeline 的 CI/CD、model registry、A/B testing、scaling 與生產監控。"
tldr: "MLOps 面試考的是你有沒有把模型推上生產的經驗。高頻考點：ML pipeline 的 CI/CD（跟軟體 CI/CD 有什麼不同）、model registry 與版本管理、A/B testing 的設計與陷阱、inference 的 scaling 策略（水平擴展、模型壓縮、caching），以及生產環境的 monitoring 與 alerting 設計。"
series:
  name: "AI Engineer 面試準備"
  order: 9
---

## 為什麼 MLOps 是 Senior 必考題

Junior AI Engineer 面試可以靠模型知識過關，Senior 不行。面試官想知道的是：你有沒有把模型從 notebook 推到生產環境的完整經驗？當模型在線上出問題時，你怎麼發現、怎麼診斷、怎麼修？

MLOps 題目通常不會單獨出一輪，而是穿插在 system design 或 ML deep dive 裡。面試官問完「你怎麼設計這個推薦系統的 serving 架構」之後，下一個問題就是「上線之後你怎麼知道模型退化了」。如果你在這個環節答不出具體做法，前面的架構設計就會被打折扣。

## ML CI/CD：跟軟體 CI/CD 差在哪

軟體 CI/CD 跑的是程式碼測試——單元測試、整合測試、部署。ML CI/CD 多了兩個維度：**資料驗證**和**模型驗證**。

**資料驗證**在 pipeline 的最前端。每次新資料進來，你需要檢查：schema 有沒有變（欄位多了或少了）、分佈有沒有偏移（某個 feature 的均值突然飄了 3 個標準差）、null rate 有沒有異常。工具上常見的選擇是 Great Expectations 或 TensorFlow Data Validation。面試時不需要記住工具名，但要能說出你會檢查什麼。

**模型驗證**在訓練完成之後、部署之前。除了離線指標（AUC、F1）要高於基準線，還要做 inference latency 測試（新模型的 p99 有沒有超過 SLA）、prediction distribution 比較（新模型的輸出分佈跟舊模型差多少），以及 sanity check（餵幾個已知答案的 case，確認模型沒有學壞）。

面試時可以這樣組織：「我的 ML CI/CD pipeline 有三道閘門——資料品質閘門、模型品質閘門、和 serving 閘門。任何一道沒過都不會自動部署。」

## Model Registry：不只是存模型

Model registry 是 ML 版本管理的核心。面試官問這個的時候，他不是在問你用過什麼工具（MLflow、Weights & Biases、Vertex AI），而是在問你怎麼保證 reproducibility。

一個好的 registry 至少要追蹤四樣東西：

| 追蹤項目 | 為什麼重要 |
|---------|-----------|
| 模型 artifact（權重、config） | 能回滾到任何一個歷史版本 |
| 訓練資料的 snapshot 或版本 ID | 知道這個模型是用什麼資料訓練的 |
| 訓練程式碼的 commit hash | 能重現訓練過程 |
| 超參數和 metrics | 知道為什麼選了這個版本 |

面試時特別值得提的是 **lineage tracking**：從預測結果反向追蹤到模型版本、訓練資料、feature pipeline 程式碼。當線上出問題時，這條鏈是你定位根因的唯一路徑。

## A/B Testing：ML 模型的特殊挑戰

ML 的 A/B testing 和一般的產品 A/B test 有三個關鍵差異：

**延遲反饋。** 推薦系統的效果可能要幾天甚至幾週才能反映在留存率上。這意味著你不能只跑三天就下結論。面試時要能說出：「這個模型影響的是長期留存，我會設計至少兩週的實驗週期，並設定 guardrail metrics（如 crash rate、latency p99）來確保短期不出問題。」

**多模型交互。** 生產環境通常同時有多個模型在運行（推薦、排序、過濾）。改動一個模型可能影響另一個模型的輸入分佈。面試官可能會問：「如果你同時 A/B test 兩個模型，怎麼避免交互效應？」答案是分層實驗（layer-based experimentation）——每個模型的實驗在不同的流量分層上跑，互不干擾。

**Novelty effect。** 新模型上線初期，使用者可能因為新鮮感而產生更高的互動率，幾天後回落。這不代表模型變差了，而是 novelty effect 消退。解法：觀察更長的實驗週期，或比較「新模型上線超過 7 天的使用者」和「對照組」。

## Scaling：讓推論跑得又快又便宜

Inference 的 scaling 有兩個方向：讓每次推論更快（垂直優化），或讓系統能處理更多並發（水平擴展）。

**垂直優化**的常見手段：

- **Quantization**：把 FP32 權重壓到 INT8 或 INT4。通常可以減少 2-4 倍記憶體和加速 1.5-3 倍，品質損失可控。面試時提到 post-training quantization（PTQ）和 quantization-aware training（QAT）的差異會加分。
- **Distillation**：用大模型的輸出訓練一個小模型。小模型上線，大模型退居離線。適合 latency 預算極緊的場景。
- **Dynamic batching**：把短時間內到達的請求攢成一批一起推論。GPU 利用率從 10% 拉到 80%，throughput 大幅提升，但個別請求的 latency 會微增。

**水平擴展**的關鍵決策：

- **Auto-scaling 的指標選擇**：不要只看 CPU/GPU utilization，要看 request queue depth 和 p99 latency。前者反映即將發生的問題，後者反映已經發生的問題。
- **Model serving framework**：面試不考你背工具名，但知道 TorchServe、Triton Inference Server、vLLM 各自的定位是加分的。Triton 適合多模型異構推論，vLLM 專攻 LLM 的 KV cache 管理和 continuous batching。

## Production Monitoring：三層監控加 Retraining 觸發器

ML 系統的監控必須分層。面試時可以用這個三層框架：

**第一層：基礎設施。** latency、throughput、error rate、GPU 記憶體使用率。這層跟軟體監控一樣。

**第二層：資料與模型。** 這是 ML 特有的。監控 input feature 的分佈偏移（data drift）、模型預測的分佈偏移（prediction drift）、以及 ground truth 可用時的模型品質指標。Data drift 用統計檢定（KS test、PSI）量化，設定閾值觸發告警。

**第三層：商業指標。** CTR、conversion rate、revenue per session。這層是最終的 north star，但通常有延遲——等到商業指標掉了才發現問題，通常已經晚了。所以第二層的及時告警很關鍵。

**Retraining 觸發器**是面試的高頻追問。兩種做法：

- **定期重訓**：每週或每月用最新資料重訓一次。簡單可靠，適合資料分佈變化緩慢的場景。
- **觸發式重訓**：當 data drift 指標或模型品質指標超過閾值時自動觸發。反應更快，但需要更成熟的 pipeline 基礎設施。

面試時推薦的答法：「我會先用定期重訓作為 baseline，然後加上 drift-triggered 重訓作為補充。兩者並行——定期重訓保底，觸發式重訓抓突發。」

## 面試常見題型

| 題型 | 考什麼 | 怎麼答 |
|------|--------|--------|
| 你的模型上線後 accuracy 掉了 5%，怎麼排查？ | 系統化除錯能力 | 三步走：先看資料有沒有變（drift check）、再看 feature pipeline 有沒有壞（null rate、schema change）、最後看模型本身（prediction distribution） |
| 設計一個自動 retraining pipeline | 端到端工程能力 | 畫出 data trigger → validation → training → evaluation → registry → canary deploy 的流程 |
| 你會怎麼做 ML 的 canary deployment？ | 部署策略 | 先 shadow 觀察預測分佈、再 canary 5% 看商業指標、設定自動 rollback 條件 |
| 怎麼確保訓練的 reproducibility？ | Registry 與版本管理 | 追蹤四件事：model artifact、data version、code commit、hyperparams |

## 面試模擬題

### 題目

「你的推薦模型上線兩週後，A/B test 顯示新模型的 CTR 提升了 3%，但 revenue per session 下降了 1.5%。你會怎麼決定要不要全量上線？」

**來源**：Meta MLE 面試（改編）　**難度**：進階　**環節**：onsite system design / execution

### 拆解思路

1. **先釐清問題**：3% CTR 提升和 1.5% revenue 下降的統計顯著性如何？A/B test 跑了多久？有沒有 novelty effect？流量分配是多少？
2. **建立框架**：這是一個 metric trade-off 問題——兩個重要指標方向相反。需要回到商業目標判斷哪個更重要，而不是純看數字。
3. **深入核心**：CTR 提升但 revenue 下降的常見原因是模型開始推薦更多低價但好點擊的商品（clickbait-y items），這代表模型的 objective function 和商業目標有 misalignment。
4. **收尾**：不要只給 go/no-go 結論——提出進一步分析的方案和如何修正模型 objective。

### 範例回答（面試時可以這樣講）

> **先確認數據可信度。** 我不會直接做決定，先確認三件事：第一，兩個指標的 p-value 和 confidence interval——3% CTR 可能顯著但 1.5% revenue 可能在 noise range。第二，看 time series 趨勢——前幾天的 CTR 提升是不是特別高然後收斂（novelty effect）。第三，確認沒有 sample ratio mismatch。
>
> **深入分析根因。** 如果兩個指標的變動都是 statistically significant，我需要理解為什麼 CTR 上去了但 revenue 下來了。最常見的原因是 **objective-business misalignment**——模型被訓練去 maximize click probability，它學到了推薦「容易點但不會買」的商品。我會看 distribution shift：新模型推薦的商品平均單價是不是比 baseline 低？高價商品的曝光率是不是下降了？如果是，這代表 loss function 需要調整——把 revenue signal 加進 training objective，或者加一個 exposure fairness constraint 確保高價商品不會被系統性壓制。
>
> **決定與下一步。** 在這種情況下我的建議是 **不全量上線**，但也不是直接 rollback。保留 A/B test 繼續觀察 4 週（排除 novelty effect），同時平行訓練一個用 revenue-weighted CTR 作為 objective 的新模型版本。如果 4 週後 revenue 仍在跌，rollback 並換上新版本測試。同時和 business team 對齊——如果他們說「我們這季的 OKR 是 engagement 不是 revenue」，那 3% CTR 提升本身就是一個正面結果，但要確保大家理解 revenue 的代價。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 統計顯著性檢查（p-value、confidence interval） | |
| Novelty effect 排除 | |
| 根因分析（objective-business misalignment） | |
| 商品單價 distribution shift 檢查 | |
| 不是 go/no-go 二選一，而是有條件的決定 | |
| 提出修正方案（revenue-weighted objective） | |
| 加分：和 business team 對齊 OKR 優先序 | |

## 參考資料

- [Google — MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) — ML CI/CD 三層成熟度模型的原始定義，涵蓋資料驗證、模型驗證、pipeline 自動化
- [Chip Huyen — Designing Machine Learning Systems, Ch. 9-11](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — 生產環境的 monitoring、data distribution shift、continual learning 的系統化框架
- [Made With ML — MLOps Course](https://madewithml.com/) — 開源 MLOps 課程，從 testing 到 monitoring 的完整實作指南
- [MLflow Documentation](https://mlflow.org/docs/latest/index.html) — Model registry 與 experiment tracking 的實作參考，MLOps 面試中 model versioning 的常見工具
- [Evidently AI — ML Monitoring](https://www.evidentlyai.com/) — Data drift 與 model degradation 監控的開源工具，MLOps deployment 面試中 production monitoring 的實務參考
