---
title: "AI Engineer 面試日練 — 2026-10-14：ML System Design"
date: 2026-10-14
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三輪到 ML System Design——feature store 的 point-in-time correctness 怎麼避免 training-serving skew、serving 端怎麼切延遲預算做 fallback、data drift 跟 concept drift 的偵測與應對差在哪，加一題 Amazon MLE 面試真實風格的點時間特徵正確性題目。"
tldr: "今天的 ML System Design 輪練涵蓋四個核心概念：feature store 要同時記錄 event time 跟 available time 兩個時間戳才能保證 point-in-time correctness，只過濾 event time 還是會洩漏未來資訊；serving 端要把延遲預算拆成明確的子預算（lookup、scoring、回應），並且版本化 model／feature schema／fallback 三者綁在一起；data drift（輸入分布變了）跟 concept drift（輸入輸出關係變了）偵測方式不同，前者從特徵分布就看得出來，後者通常要等標籤到位；監控要分三層——operational（延遲/錯誤率）、data（特徵分布/缺失率）、model（預測分布/實際準確度），標籤延遲長的場景要靠前兩層當早期預警。練習題改編自 Amazon MLE 面試準備指南裡的真實情境：一筆特徵在被使用當下，必須同時滿足『事件發生時間』與『系統可取用時間』都不晚於預測當下，才算是 point-in-time correct，練習怎麼在系統設計面試裡講清楚這個判準。"
series:
  name: "AI Engineer 面試日練"
  order: 56
---

> 🌏 [English version](/posts/daily/2026-10-14-ai-interview-daily-en)

## 今日主題

星期三輪到 ML System Design，這個環節考的不是模型本身多厲害，而是你能不能把「資料怎麼流、特徵怎麼來、模型怎麼服務、系統怎麼監控」講成一條完整的管線，並且在每個環節都能指出可能出錯的地方。今天選的四個概念圍繞一個核心問題：離線看起來很漂亮的模型，為什麼一上線就變差？答案通常藏在 feature store 的時間戳處理、serving 端的延遲預算分配、drift 偵測的時機差異，以及監控要看哪三層指標裡。練習題則是把「point-in-time correctness」這個常被簡化成一句話帶過的概念，拆成面試官真正想聽到的判準。

## 核心概念速記

### Point-in-Time Correctness：event time 跟 available time 都要檢查，少一個就會洩漏

Feature store 要保證訓練資料跟線上服務看到的特徵邏輯一致，最容易被忽略的細節是：每個特徵版本要同時記錄「事件實際發生的時間」（event time）跟「系統真正可以取用這筆資料的時間」（available time）。只過濾 event time 還是會洩漏——假設預測發生在時間 100，有一筆事件發生在時間 90 但延遲到時間 105 才進到系統，這筆資料在時間 100 當下根本不存在，如果訓練資料只用「event time ≤ 100」去篩，就會把這筆其實還沒進系統的資料算進去，造成離線評估看起來比線上服務更準。正確做法是兩個時間戳都要晚於或等於預測時間點才算可用，而且離線重建歷史特徵的邏輯，必須跟線上查詢的語意完全一致，不然就是另一種形式的 training-serving skew。

### Serving 延遲預算：先切子預算，model／feature schema／fallback 要綁版本

面試官問「設計一個 100ms 內回應的 ranking 服務」時，想聽到的不是「用更快的模型」,而是你怎麼把預算拆解成子項目——例如 request 處理、feature lookup、model scoring、response 組裝各分配多少毫秒，加上一段安全餘裕，讓每個環節都有明確的失敗邊界可以追蹤。拆完預算之後，下一步是把 model 版本、feature schema 版本、transformation 邏輯綁在一起部署，一旦 feature 查詢逾時或 schema 不匹配，系統要有明確定義的 fallback（通常是退回上一個相容版本或簡化版 baseline），而且這個 fallback 的曝光也要被記錄下來，不然下游做評估時會搞不清楚哪些預測其實是用了退化路徑產生的。

### Data Drift vs Concept Drift：前者看特徵分布就能抓，後者通常要等標籤到位

這兩種 drift 常被面試官放在一起問，但偵測時機完全不同。Data drift 是輸入分布本身變了（例如使用者結構轉移、出現新的裝置類型），這種變化可以直接從特徵分布的統計量（例如 population stability index）即時偵測，不需要等真實標籤。Concept drift 則是輸入跟輸出之間的關係本身改變了（例如詐騙手法演化，同樣的特徵組合現在代表不同的風險），這種變化通常要等到標籤回收之後，比對模型預測準確度是否真的下降才能確認。實務上的策略是：偵測到 data drift 先別急著重訓，要先確認這個分布變化是否真的影響了模型表現；concept drift 一旦確認，則需要用新資料重訓，必要時提高近期樣本的權重。

### 監控三層：operational／data／model，標籤延遲長就靠前兩層當早期預警

生產環境的模型監控要拆成三層，而不是只看一個「準確率」指標。Operational 層看延遲、錯誤率、吞吐量，這層的異常通常代表系統本身出問題，跟模型好壞無關。Data 層看輸入特徵分布跟訓練時的基準分布有沒有偏移、缺失率有沒有異常升高，這層不需要標籤就能即時算。Model 層看預測分布本身有沒有改變，以及（當標籤到位後）實際的準確度指標。當業務場景的標籤延遲很長（例如信用風險模型可能要 60 天才能確認是否違約）,前兩層就是上線後最早能看到的警訊，面試時提到這一點通常是加分——代表你真的想過「標籤還沒回來之前，我要怎麼知道模型已經出問題」這個實務痛點。

## 今日練習題

### 題目

設計一個音樂推薦服務的點擊預測特徵管線。要求：訓練用的離線特徵，必須跟線上服務當下真正能查到的特徵完全一致，不能洩漏任何「預測當下系統還查不到」的資訊。請說明你會怎麼判斷一筆特徵版本在某個預測時間點是否「可用」，以及這個判準如果做錯了會造成什麼後果。

**來源**：PracHub「Amazon Machine Learning Engineer Interview Guide 2026」的 point-in-time feature correctness 案例改編　**難度**：中等　**環節**：ML system design / applied ML

### 拆解思路

1. **先釐清問題**：面試時該先問——這個特徵管線是批次訓練用，還是也要支援線上即時查詢？不同特徵的更新頻率是否不同（例如使用者長期偏好 vs 近期行為）？標籤本身有沒有延遲窗口（例如點擊要等多久才能確認不是點擊）？
2. **建立框架**：把每個特徵版本的生命週期拆成兩個時間戳——event time（資料代表的事件實際發生的時間）跟 available time（這筆資料真正寫入、可以被查詢系統取用的時間）。一筆特徵在預測時間點 t 可用的充分必要條件，是這兩個時間戳都必須小於等於 t。
3. **深入核心**：技術上最關鍵的 trade-off 是——只檢查 event time 看起來邏輯正確（「這件事在預測當下已經發生」），但忽略了資料從發生到真正寫入系統之間通常有延遲（ingestion lag），如果訓練資料只用 event time 篩選，會把當時系統其實還查不到的資料也算進訓練集，導致離線評估的指標系統性地偏好離線版本，一上線就會打回原形。要同時檢查兩個時間戳，才能讓離線重建的訓練資料跟線上查詢在語意上完全對等。
4. **收尾**：往生產環境延伸——這個判準不是查一次就結束，特徵定義、transformation 版本都要跟著每筆預測記錄一起存下來，這樣之後做離線重現或除錯時，才能準確還原「這筆預測當下系統到底看到了什麼」，而不是用今天的資料狀態回頭猜測。

### 範例回答（面試時可以這樣講）

> Point-in-time correctness 的核心判準很簡單但很容易漏掉一半：一筆特徵在某個預測時間點可不可以用，要同時檢查兩個時間戳——這個資料代表的事件本身是什麼時候發生的，還有這筆資料是什麼時候真正寫進系統、可以被查詢到的。**先講為什麼只看一個時間戳不夠**：如果只過濾「事件發生時間早於預測時間」，看起來邏輯沒問題，但資料從產生到真正被系統寫入、索引完成，中間一定有延遲，這段延遲在離線訓練時很容易被忽略，因為我們是用今天完整的資料庫去重建過去的特徵，手上其實已經有「未來才會進系統」的資料了。
>
> **接著講判準怎麼落地**：我會幫每個特徵版本記錄 event time 跟 available time 兩個欄位，離線重建訓練資料時，兩個時間戳都必須小於等於當時的預測時間點，才算這筆特徵在那個當下可用；任何只滿足其中一個條件的資料都要排除。這個邏輯要跟線上查詢系統共用同一套實作，而不是離線一套、線上另一套各自寫，不然就算判準定義對了，兩邊實作不一致還是會產生 skew。
>
> **最後講這個設計對後續除錯跟監控的意義**：我會把每次預測當下用到的特徵版本跟 transformation 版本一起記錄下來，這樣之後如果線上表現跟離線不一致，可以直接回放當時系統實際看到的輸入，而不是用現在的資料狀態去猜測當時發生了什麼——這對後面要做 shadow deployment 或離線重現問題都是必要的基礎建設，也是很多團隊上線後才發現自己漏掉的一塊。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚為什麼只過濾 event time 不夠，還要看 available time | |
| 有指出離線訓練資料跟線上查詢必須共用同一套特徵邏輯 | |
| 有提到每次預測要記錄特徵與 transformation 版本以利回放除錯 | |
| 有延伸講到這個設計跟後續 drift 監控、shadow deployment 的關聯 | |
| 有舉出判準做錯的具體後果（離線指標系統性偏好、上線後打回原形） | |
| 加分項：有提到不同特徵更新頻率不同時，判準要怎麼統一處理 | |

## 延伸閱讀

- [Amazon Machine Learning Engineer Interview Guide 2026 | PracHub](https://prachub.com/interview-guide/amazon-machine-learning-engineer-interview-guide) — 用一個完整的音樂推薦點擊預測案例，走過 point-in-time 特徵判準、延遲預算拆分到 canary rollback 決策的全流程，練習題的主要素材來源。
- [Machine Learning Engineer Interview Questions and Answers | InterviewPlan AI](https://interviewplan.ai/interview-questions/machine-learning-engineer) — 收錄 training-serving skew、drift 偵測、CI/CD for ML 等九道常見系統設計題的範例回答，適合拿來對照今天四個核心概念的講法。
- [System Design Interview Questions (Updated 2026) | PracHub](https://prachub.com/categories/system-design) — 分類齊全的系統設計題庫，含 ML-specific 的 serving 與 pipeline 題型，可以用來延伸練習今天沒涵蓋到的設計場景。

## 參考資料

- [Amazon Machine Learning Engineer Interview Guide 2026 | PracHub](https://prachub.com/interview-guide/amazon-machine-learning-engineer-interview-guide) — 核心概念「Point-in-Time Correctness」與今日練習題的主要佐證來源，含 event time / available time 的判準說明與延遲預算、canary 決策案例。
- [Machine Learning Engineer Interview Questions and Answers | InterviewPlan AI](https://interviewplan.ai/interview-questions/machine-learning-engineer) — 核心概念「監控三層」與「Data Drift vs Concept Drift」段落的佐證來源，含 operational/data/model 三層監控與 PSI 偵測的說明。
- [Databricks Feature Store | Databricks on AWS](https://docs.databricks.com/aws/en/machine-learning/feature-store) — 核心概念「Serving 延遲預算」段落中 feature serving 架構與 training/serving skew 消除機制的補充來源。
