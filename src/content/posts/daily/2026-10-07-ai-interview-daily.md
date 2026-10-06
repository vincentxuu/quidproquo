---
title: "AI Engineer 面試日練 — 2026-10-07：ML System Design"
date: 2026-10-07
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三輪到 ML System Design——feature store 怎麼解決 training-serving skew、為什麼 serving pipeline 設計要從 baseline 開始談而不是直接上神經網路、PSI／KS test 怎麼抓資料飄移、shadow deployment 到 canary rollout 的漸進上線順序，加一題 A10 Networks 風格的真實面試題：設計一個即時流量特徵的 ML 推論 pipeline，要有 baseline、延遲預算、drift 監控與 rollback 路徑。"
tldr: "今天的 ML System Design 輪練涵蓋五個核心概念：feature store 如何透過共用特徵計算邏輯消除 training-serving skew、ML pipeline 設計為什麼要先定 baseline 再談複雜模型的 justification、PSI 與 KS test 兩種資料飄移偵測方法的適用情境、shadow deployment／canary rollout／rollback 的漸進上線順序，以及 A/B testing 框架在 ML 系統裡怎麼量化模型上線後的真實影響。練習題改寫自 A10 Networks Machine Learning Engineer 面試(PracHub 2026 題庫，候選人回報、非洩題)：設計一個即時流量特徵的 ML 推論 pipeline，要有 baseline 模型、延遲預算、drift 監控與 rollback 路徑，拆解思路把「先問清楚流量量級與延遲目標」到「用什麼機制讓壞模型能即時退場」串成一套完整的推理鏈。"
series:
  name: "AI Engineer 面試日練"
  order: 49
---

> 🌏 [English version](/en/posts/daily/2026-10-07-ai-interview-daily-en)

## 今日主題

星期三輪到 ML System Design，今天選的概念圍繞同一個問題：一個模型在筆記本裡準確率再高，上線前還有多少工程決策會決定它能不能活下來。Feature store 解決的是「訓練時看到的資料跟上線時看到的資料是不是同一套邏輯算出來的」；drift 偵測解決的是「上線後世界變了，模型什麼時候該被換掉」；shadow deployment 到 canary rollout 解決的是「怎麼讓壞模型在傷害使用者之前就被攔下來」。這些都是 ML system design 面試環節的標準骨架，面試官不是要你畫出最複雜的架構圖，而是要看你會不會先把流量、延遲、標籤來源這些約束問清楚，再做取捨。

## 核心概念速記

### Feature store 與 training-serving consistency

Feature store 的核心價值不是「存特徵」，而是讓訓練跟線上推論共用同一套特徵計算邏輯，避免 training-serving skew——訓練時用批次 join 算出來的特徵，跟線上用即時事件流算出來的特徵，如果邏輯不一致（例如時間窗口定義不同、空值填補方式不同），模型在離線驗證集表現很好，一上線就掉分。面試時常見的追問是「離線跟線上各自怎麼算同一個特徵」，答案要講到共用的特徵定義（同一份程式碼或同一套轉換規則）同時餵給批次訓練管線跟即時服務層，而不是兩邊各寫一次。

### 從 baseline 出發的設計哲學

ML system design 的常見陷阱是面試者一開始就跳進一個複雜的神經網路架構，卻沒有先定義延遲預算、資料量級跟標籤從哪裡來。正確的順序是先問清楚流量量級、p50/p99 延遲目標、誰消費模型輸出、label 的來源與更新頻率，然後從一個簡單 baseline（規則引擎或樹模型）開始，再論證什麼條件下才值得換成更複雜的模型——例如 baseline 的某個子群體表現持續不足，或者有足夠的標註資料支撐更大的模型。先講 baseline 再講 upgrade path，是面試官判斷「這個人是不是真的上線過模型」的分水嶺。

### PSI 與 KS test——兩種資料飄移偵測方法

Population Stability Index（PSI）把特徵分成固定區間（bin），比較訓練期與線上期在每個區間的樣本佔比差異，常用的經驗門檻是 PSI 小於 0.1 視為穩定、0.1 到 0.25 需要關注、大於 0.25 視為顯著飄移，適合監控類別型或離散化後的特徵，計算成本低、容易排程跑批次比對。Kolmogorov-Smirnov test（KS test）則是比較兩個分布的累積分布函數（CDF）之間的最大距離，給出一個統計檢定的 p-value，適合連續型特徵、需要嚴謹統計顯著性判斷的場景，但對樣本量敏感——樣本夠大時，連很小的分布變化都會被判定「顯著」，不一定代表業務意義上的飄移。面試時能分清楚兩者的適用情境，比籠統地說「我會監控 drift」更有說服力。

### Shadow deployment 到 canary rollout 的漸進上線順序

新模型上線前先做 shadow deployment：讓新模型跟舊模型同時處理線上流量，但只有舊模型的結果真的回應給使用者，新模型的輸出只拿來記錄、比對，藉此在零風險的情況下驗證新模型在真實流量分布下的行為。確認無誤後進入 canary rollout：先把一小部分流量（例如 1% 到 5%）導向新模型，持續監控關鍵指標（延遲、錯誤率、業務指標），確認穩定後才逐步擴大比例。整個過程要搭配明確的 rollback 路徑——一旦監控指標跨過預先定義的門檻，能立刻把流量切回舊模型，而不是等人工發現問題才處理。

### A/B testing 與實驗框架在 ML 系統裡的角色

模型上線後的真實影響，最終要靠 A/B testing 或更進階的多臂老虎機（multi-armed bandit）框架來量化，而不是只看離線指標。Frequentist A/B testing 需要先固定樣本量跟顯著水準，中途偷看結果會膨脹偽陽性率；Bayesian A/B testing 則是持續更新「哪個版本比較好」的信念分布，可以邊跑邊看而不需要事先鎖定樣本量，但需要選定先驗分布，解讀上也要注意「後驗機率」跟「統計顯著」不是同一件事。面試時被問到「怎麼知道新模型真的比較好」，答案要包含:用什麼指標當 north star、怎麼切流量避免污染、以及多久才能下結論。

## 今日練習題

### 題目

設計一個即時流量特徵的 ML 推論 pipeline：系統要能用一個 baseline 模型起步、符合明確的延遲預算、具備資料飄移監控機制，並在新模型表現異常時有清楚的 rollback 路徑。

**來源**：A10 Networks Machine Learning Engineer 面試(PracHub 2026 題庫整理，候選人回報，非官方洩題)　**難度**：中等　**環節**：onsite ML system design round

### 拆解思路

1. **先釐清問題**：流量量級是多少（每秒請求數）、p50/p99 延遲目標是多少毫秒、label 從哪裡來（即時回饋還是延遲標註）、模型輸出給誰消費（即時阻擋決策還是離線報表）、系統對「模型變慢或掛掉」的容忍策略是 fail open 還是 fail closed。
2. **建立框架**：把系統拆成資料流的四段——ingestion（事件怎麼進來）、feature computation（訓練與線上共用的特徵邏輯）、serving（模型怎麼回應請求）、monitoring/retraining（drift 偵測跟模型更新迴圈），每一段先講最簡單能動的版本。
3. **深入核心**：技術上最關鍵的 trade-off 有三組——baseline 先行還是直接上複雜模型(先行，用數據證明需要更複雜的模型才升級)；training-serving consistency 怎麼確保(共用特徵計算邏輯，而不是兩邊各寫一次轉換)；延遲預算怎麼達成(batching、quantization、distillation、caching 這幾個手段各自的適用情境與代價)。
4. **收尾**：把 drift 監控(PSI/KS test)、漸進上線(shadow deployment → canary rollout)跟 rollback 機制串起來講成一個完整的生命週期，並用一個具體數字收尾，例如「quantization 後 p99 延遲從 45ms 降到 12ms，同時 recall 只掉 0.3 個百分點」，讓面試官感覺到這不是紙上談兵。

### 範例回答（面試時可以這樣講）

> 我會先把問題邊界定清楚:假設每秒要處理一萬筆流量事件，p99 延遲預算是 50 毫秒，label 是延遲到達的(使用者行為要等幾分鐘到幾小時才能確認)，模型輸出直接影響即時阻擋決策，所以延遲超標時我會選擇 fail open——讓請求通過但標記成待複查，而不是整個服務卡住。
>
> **架構上**，我會從一個樹模型(例如 LightGBM)當 baseline 起步，用規則引擎處理最明確的案例、樹模型處理灰色地帶，這樣可解釋性高、延遲也容易控制在預算內。特徵計算邏輯我會寫成一份共用的轉換程式碼，同時餵給離線訓練管線跟線上即時服務層，避免訓練用批次 join 算出來的特徵跟線上用串流算出來的特徵定義不一致，這是我前一份工作踩過的坑——離線 AUC 很漂亮，上線掉了快十個百分點，追了兩天才發現是一個時間窗口的定義在兩邊不一樣。
>
> **上線跟監控**方面，新模型我會先做兩週的 shadow deployment，只記錄不影響線上決策，比對完跟 baseline 的差異分布後,用 canary 從 2% 流量開始逐步放大,同時用 PSI 監控關鍵特徵的分布飄移、門檻設在 0.25 觸發告警，一旦延遲或錯誤率跨過預設門檻就自動把流量切回舊模型，不等人工發現。如果之後要上更複雜的神經網路模型，我會先用 quantization 把 p99 延遲壓到預算內，再用 A/B testing 驗證真實業務指標的提升是不是划算的。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先問清楚流量量級、延遲目標、label 來源 | |
| 從 baseline 開始，並說明升級條件 | |
| Feature store / training-serving consistency 怎麼確保 | |
| Drift 偵測方法(PSI 或 KS test)跟門檻 | |
| Shadow deployment → canary rollout → rollback 的順序 | |
| 加分項：延遲優化手段(batching/quantization/distillation/caching)與具體數字 | |

## 延伸閱讀

- [AI Engineering Interview Questions（GitHub）](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 整理了 LLM 系統的 A/B testing、CI/CD、模型版本管理等 production ML 問題，可以把今天的傳統 ML serving 概念延伸到 LLM 場景。
- [FastPrep System Design 練習庫](https://www.fastprep.io/system-design) — 有 Netflix/Oracle 風格的「設計個人化推薦系統」等真實公司訊號的系統設計題，適合把今天的 pipeline 骨架套到更大的系統設計題上練習。

## 參考資料

- [A10 Networks Machine Learning Engineer Interview Questions & Guide 2026（PracHub）](https://prachub.com/interview-guide/a10-networks-machine-learning-engineer-interview-questions-guide-2026) — 今日練習題與 baseline/延遲預算/drift 監控/rollback 設計思路的主要來源。
- [Reddit Machine Learning Engineer Interview Questions 2026（dataford.io）](https://dataford.io/interview-guides/reddit/machine-learning-engineer) — ML System Design & Architecture 環節的候選人回報整理，對應今天「從 baseline 到複雜模型」的設計哲學。
