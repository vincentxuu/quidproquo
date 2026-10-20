---
title: "AI Engineer 面試日練 — 2026-10-21：ML System Design"
date: 2026-10-21
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今天練 ML system design 的固定八步框架，並用詐欺偵測系統當練習題，拆解 rare-event 指標跟 label delay 怎麼處理。"
tldr: "ML system design 跟一般 system design 的差別在於多一層「預測什麼、怎麼知道它有效、怎麼悄悄變差」；今天用框架＋詐欺偵測案例練習怎麼把這層講清楚。"
series:
  name: "AI Engineer 面試日練"
  order: 63
---

> 🌏 [English version](/posts/daily/2026-10-21-ai-interview-daily-en)

## 今日主題

今天練 ML System Design，面試考的不是「你會不會畫架構圖」，而是在一般 system design 的資料流之上，能不能講清楚「這個系統在預測什麼、怎麼知道預測有效、怎麼發現它悄悄變差」。一般 system design 的失敗模式是當機跟資料遺失，ML system design 的失敗模式是 silent decay——drift、feedback loop、training-serving skew 這些不會讓系統掛掉、但會讓它慢慢失準的問題。

這個環節通常出現在 ML Engineer 或 Applied Scientist 的 onsite，考官真正在意的往往不是你選哪個模型架構，而是你有沒有先把「這是不是真的需要 ML」「label 從哪裡來、有多髒」這兩件事講完，再動手畫方塊圖。

## 核心概念速記

### 1. 固定八步框架：problem → metrics → data → features → model → training → serving → monitoring

45 分鐘的回合建議這樣分配時間：問題定義（5 分鐘）、指標（4 分鐘）、資料與 label（6 分鐘）、特徵（5 分鐘）、模型（8 分鐘）、訓練與驗證（5 分鐘）、serving（6 分鐘）、monitoring（4 分鐘）。多數候選人會在模型選型上講太久，結果 serving 跟 monitoring 兩步被時間追著跑，這恰好是考官最想聽的兩步。

### 2. Offline 指標配 Online 指標，再加一個 guardrail

單講「accuracy」或「準確率」在面試裡幾乎等於零分，尤其正負樣本極度不平衡的場景（詐欺、垃圾內容）。正確的講法是三件事一起講：一個離線可算的指標（像是 precision-recall AUC、NDCG）、一個會拿去做 A/B 測試的線上指標（像是每使用者的 session 數、盜刷金額），再加至少一個不能變差的 guardrail（像是誤判率、使用者申訴量）。離線指標進步不等於可以上線，上線與否要看 A/B 測試的真實線上行為，這條規則在詐欺、推薦、排序這幾類系統都通用。

### 3. Feature store 解決 training-serving skew

Training-serving skew 是訓練時用的特徵邏輯跟線上預測當下系統實際看到的特徵邏輯不一致，這是 ML system design 最常被深挖的點。解法是把特徵計算邏輯寫成一份共用程式碼，離線訓練跟線上服務都呼叫同一份轉換邏輯，而不是兩邊各寫一次；同時把線上服務當下實際用到的特徵記錄下來、拿去訓練，而不是靠離線重建去猜當時系統看到什麼。批次特徵（慢變動、可以預先算好）跟即時特徵（使用者剛剛的行為，要即時算）分開設計，是 feature store 的標準分工。

### 4. Monitoring 看的是 drift、skew 跟 feedback loop，不是「需要時再重訓」

考官聽到「model 效果不好就重新訓練」會直接追問「你怎麼知道效果不好了」。正確答案要具體到監控什麼：特徵分佈有沒有飄移（可以用 PSI 或 KS test 這類統計檢定）、線上指標是否分 segment 掉了、以及系統是否陷入 feedback loop——只從自己展示過的項目學習，導致越推越窄。feedback loop 在推薦、排序類系統格外常見，因為系統只會記錄到自己選擇展示過的項目的使用者反應，沒展示過的項目永遠拿不到回饋訊號。

## 今日練習題

### 題目

設計一個信用卡交易的即時詐欺偵測系統：每筆交易要在授權當下被評分，系統要決定「放行」「拒絕」或「送人工覆核」。詐欺在母體中佔比極低，label（盜刷確認）通常要等幾週的申訴流程才會到位。請說明你會怎麼選指標、怎麼處理延遲到位的 label，以及線上 serving 要怎麼設計 fallback。

**來源**：改編自 CoPilot Interview「ML System Design Interview」框架文章的詐欺偵測 worked prompt（2026-10-14 發布）　**難度**：進階　**環節**：onsite ML system design

### 拆解思路

1. **先釐清問題**：先問交易量級（每秒幾筆）、授權路徑上可容忍的延遲上限是多少毫秒、人工覆核團隊的容量有多大（決定能送審多少比例）、業務對「誤判好客戶」跟「放過盜刷」兩種錯誤的容忍度是否對稱。
2. **建立框架**：把系統拆成三條線——即時評分路徑（授權當下跑）、label 回收管線（申訴跟 chargeback 陸續進來，更新訓練資料）、監控與再訓練迴圈（偵測攻擊模式改變、觸發重訓）。先講清楚這三條線怎麼互相餵資料，再深入細節。
3. **深入核心**：技術上最關鍵的 trade-off 有兩組。第一組是指標——詐欺是 rare event，準確率沒有意義，要用 precision-recall AUC 做離線評估，線上則換算成「攔下的盜刷金額」對「誤擋的好客戶交易數」。第二組是 label 的延遲與偏誤——chargeback 通常幾週後才確認，代表最近一兩週的資料在當下看起來「全部正常」，其實混著還沒被標記出來的詐欺；另外被模型直接拒絕的交易永遠拿不到真實 label（因為客戶根本沒機會完成交易），這是一種 selection bias，需要留一小部分低風險分數的交易照常放行、只是標記起來，用來校正這個偏誤。
4. **收尾**：serving 端要有明確的 fallback——如果模型逾時或掛掉，退回規則引擎而不是讓交易卡住；再把 drift 監控（分數分佈、放行率、人工覆核命中率）跟定期重訓串起來，收尾時用一個具體數字，例如「規則＋模型雙層架構把人工覆核量從每天 8,000 筆壓到 2,200 筆，盜刷偵測率維持在 91% 以上」，讓面試官感覺到這是真的想過量級的設計。

### 範例回答（面試時可以這樣講）

> 我會先確認量級跟延遲預算：假設每秒要處理幾千筆授權請求，延遲預算在幾十毫秒，人工覆核團隊一天能處理的量是有限的，所以模型的工作是把「要人工看」的交易量壓到團隊容量以內，同時盡量不誤擋好客戶。**指標上**，詐欺大概只佔整體交易的千分之幾，所以我不會用準確率，離線會用 precision-recall AUC 在固定的覆核容量下評估，線上換算成「攔下的盜刷金額」對「誤擋的好客戶交易數」這兩個業務數字，再加一個不能惡化的 guardrail——誤判申訴量。
>
> **Label 的部分是這題最容易被問倒的地方**：chargeback 要等幾週才確認，所以最近兩週的資料不能直接當成「乾淨的負樣本」，我會用一個滑動窗口，只拿確認期已經過了的資料進訓練集；另外被模型直接擋掉的交易永遠沒有真實 label，這是 selection bias，我會留一小部分低風險分數的邊界案例照常放行，只標記起來，用這批資料去校正模型對自己擋下決策的偏誤。
>
> **架構上**我會用規則引擎加樹模型的兩層設計：規則處理最明確的已知攻擊模式（像是同一張卡短時間在不同城市出現），樹模型（像 LightGBM）處理灰色地帶，兩者都可解釋、延遲也容易控制；serving 端如果模型逾時就 fail open 退回規則引擎，不讓交易整個卡住。監控上盯著分數分佈飄移、放行率跟人工覆核命中率，攻擊模式一變就觸發重訓。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 說明為什麼不能用準確率，改用 precision-recall 或業務指標 | |
| 講清楚 label delay（chargeback 延遲）會怎麼污染訓練資料 | |
| 指出被模型直接拒絕的交易有 selection bias，並提出校正方法 | |
| serving 端有明確的 fallback（模型逾時退回規則引擎） | |
| 監控具體到分數分佈飄移、放行率、人工覆核命中率 | |
| 加分項：提到用一小部分低風險交易做反事實資料收集 | |

## 延伸閱讀

- [ML System Design Interview: Framework and 3 Examples](https://copilotinterview.com/blog/ml-system-design-interview) — 8 步框架、三個 worked prompt（feed ranking／詐欺偵測／搜尋排序）跟評分 rubric 的完整對照表
- [Design a recommendation system: the ML system design interview walkthrough](https://dev.to/gowthampotureddi/design-a-recommendation-system-the-ml-system-design-interview-walkthrough-5a67) — retrieval 跟 ranking 兩階段怎麼拆、feedback loop 跟 cold start 怎麼答的完整逐步拆解
- [Top Machine Learning Interview Questions You Must Prepare In 2026](https://www.icertglobal.com/blog/machine-learning-interview-questions) — 2026 年面試重心轉向 production MLOps 跟 drift 偵測的趨勢整理

## 參考資料

- [ML System Design Interview: Framework and 3 Examples](https://copilotinterview.com/blog/ml-system-design-interview) — 今日「固定八步框架」「Offline/Online 指標」「Feature store 解決 skew」三個核心概念與詐欺偵測練習題的改編來源
- [Design a recommendation system: the ML system design interview walkthrough](https://dev.to/gowthampotureddi/design-a-recommendation-system-the-ml-system-design-interview-walkthrough-5a67) — 「Monitoring 看 drift／skew／feedback loop」概念中 feedback loop 部分的補充來源
- [Top Machine Learning Interview Questions You Must Prepare In 2026](https://www.icertglobal.com/blog/machine-learning-interview-questions) — 2026 面試趨勢（production MLOps、drift 偵測）背景補充
