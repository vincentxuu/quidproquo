---
title: "AI Engineer 面試日練 — 2026-11-25：ML System Design"
date: 2026-11-25
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三主題 ML System Design：把 feed ranking 新模型上線的 A/B 測試設計拆成樣本量、SRM、CUPED、peeking、interference 與 guardrail 非劣性檢定，並說明離線指標變好為什麼不等於線上會贏。"
tldr: "今天的核心是新排序模型上線前，A/B 測試要先守住三件事：樣本量用雙比例檢定算清楚（基線 CTR 2.0%、相對提升 5%，每組約 42 萬人）、分流不能有 SRM、決策不能靠偷看。CUPED 用實驗前的同一個指標當共變量，把變異數乘上 (1−ρ²)；guardrail 用非劣性檢定，證明沒有退步超過容忍值才放量。練習題的陷阱是只講統計公式，漏掉離線與線上指標的落差，以及雙邊市場裡對照組被實驗組影響的 interference。"
series:
  name: "AI Engineer 面試日練"
  order: 98
---

> :globe: [English version](/posts/daily/2026-11-25-ai-interview-daily-en)

## 今日主題

星期三固定練 ML System Design。前幾週練過 feature store、模型服務與監控，今天收在系統的最後一哩：新模型離線評估變好之後，怎麼用線上 A/B 測試證明它真的有效、而且沒有傷到別的東西。這類題目在面試裡常被當成「模型上線流程」的收尾問題。陷阱不在背公式，而在知道哪些環節會讓測試結果不可信：離線指標不代表線上結果、分流壞掉、中途偷看數據、對照組被實驗組影響。

## 核心概念速記

### 離線變好、線上沒贏：先分清楚四種落差

Pinterest 工程團隊在 2026 年 2 月公開了一次診斷經驗：新的 L1 轉換率模型離線 LogMAE 降了約 20% 到 45%，線上 CPA 卻持平或略差。他們把原因歸成幾類。第一，特徵在訓練時有、serving 時缺。第二，兩塔模型的 embedding 版本在線上不同步（version skew）。第三，漏斗對齊問題：前段模型變好，但下游已接近上限，整體不動。第四，離線指標（LogMAE、校準）和線上指標（CPA，受出價、預算與拍賣機制影響）本來就不是同一件事。面試時先講這四類，再說「所以離線指標是必要條件，不是充分條件」，比直接說「做 A/B 測試」有深度。

### 樣本量：雙比例檢定先把數字算出來

原題設定基線 CTR 2.0%，預期相對提升 5%（絕對值 2.0% 到 2.1%），雙尾 α=0.05、檢定力 90%。每組樣本量 n = (z₁₋α/₂ + z₁₋β)² × [p₁(1−p₁) + p₂(1−p₂)] / (p₂−p₁)²。代入 z 值 1.960 與 1.282，約為每組 42.2 萬人、兩組共約 84.4 萬人。再除以 0.95 補 5% 的無效流量，除以 0.99 預留 1% 的 SRM 緩衝，總量約 89.7 萬人。這是我依題目假設自己算的數字，面試時要能現場列出公式與每一步。若每天有 100 萬名新的合格使用者，數字上一天就夠，但仍要考慮星期效應與新奇效應，實務上通常會跑滿完整週期，這是設計建議，不是公式推出來的結論。

### SRM：先檢查分流，再看任何指標

SRM（sample ratio mismatch）是實際分到各組的人數比例，和設計好的比例有顯著落差。Fabijan 等人在 KDD 2019 的論文舉了一個例子：預期 50/50，實際 821,588 對 815,482（約 50.2/49.8），這個差距隨機發生的機率小於五十萬分之一，檢查可用卡方檢定。同一篇論文指出，Microsoft 內部約 6% 的實驗有 SRM。論文的根因分類包含 bot 移除、錯誤的 join、延遲到達的 log 等，也就是原題裡「5% 無效流量」會直接牽動的環節。SRM 一旦出現，後面所有指標都不能直接信，先找根因再重跑。

### Peeking：每天看 p 值就不再是 5% 的偽陽性率

傳統 p 值假設樣本量事先決定。Johari、Pekelis 與 Walsh 的論文指出，使用者若持續監看實驗、自己決定何時停止，這類推論就「完全不可靠」。解法有兩條：事先規劃好 α-spending（原題提到 Pocock 與 O'Brien-Fleming，經由 Lan-DeMets 實作），讓中途可以提早停止而不膨脹第一類錯誤；或使用論文提出的 always valid p-value 與信賴區間，隨時看都有效。面試回答要說清楚的是「提早停止是設計出來的，不是看到顯著就停」。

### CUPED：用實驗前的資料把變異數壓下來

CUPED 由 Microsoft 的 Deng、Xu、Kohavi、Walker 在 WSDM 2013 提出，本質是 control variates：調整後估計量 Ŷ_cv = Ȳ − θX̄ + θE(X)，最佳 θ = cov(Y,X)/var(X)，調整後變異數是原本的 (1−ρ²) 倍，ρ 是 Y 與 X 的相關係數。共變量必須不受實驗處理影響，所以用實驗前的資料最安全。論文在 Bing 上把變異數降低約 50%，等於用一半的使用者或一半的時間拿到同樣的檢定力。論文還發現，單一共變量下，用實驗前同一個指標（例如實驗前每人查詢數）的效果比其他選項好，而且實驗前的期間越長，降低的比例越高。套用到本題，共變量就是每位使用者實驗前一段期間的 CTR。驗證時看 ρ 有多大，並確認實驗組與對照組的共變量平均沒有差異（那正好是 SRM 與分流是否正確的另一個訊號）。

### Interference 與 guardrail：對照組不是乾淨的，退步要證明沒有

Blake 與 Coey 分析線上市場裡的行銷活動實驗，指出改變實驗組的需求會影響對照組能取得的供給（general equilibrium effects），忽略這個干擾會讓活動成效的估計高出約兩倍。feed 排序若牽涉共享的創作者、廣告主或庫存，也要懷疑同樣的問題，可行的做法包括以群組或地理區域分流、保留 holdout。至於 guardrail，Spotify 工程團隊的做法是對退步用非劣性檢定：先定出容忍的退步幅度（non-inferiority margin），要有證據顯示指標沒有退步超過這個幅度，才算過關；他們也指出，同時要求所有 guardrail 都過關，會讓整體檢定力下降，設計時要把這點算進樣本量。

```flow-diagram
{
  "title": "新排序模型 A/B 測試設計六步",
  "lang": "zh-TW",
  "width": 560,
  "height": 700,
  "nodes": [
    {"id": "metric", "label": "定義主指標與 guardrail", "x": 280, "y": 40, "w": 260},
    {"id": "size", "label": "算樣本量與天數", "x": 280, "y": 150, "w": 260},
    {"id": "split", "label": "隨機分流，先檢查 SRM", "x": 280, "y": 260, "w": 260, "tone": "accent"},
    {"id": "run", "label": "跑滿週期，序貫監控", "x": 280, "y": 370, "w": 260},
    {"id": "analyze", "label": "CUPED 分析主指標\nguardrail 非劣性檢定", "x": 280, "y": 480, "w": 260},
    {"id": "decide", "label": "決策：放量、延長或回滾", "x": 280, "y": 600, "w": 260, "tone": "accent"}
  ],
  "edges": [
    {"from": "metric", "to": "size", "step": 1, "label": "決定最小要偵測的效果"},
    {"from": "size", "to": "split", "step": 2, "label": "加上無效流量緩衝"},
    {"from": "split", "to": "run", "step": 3, "label": "SRM 過了才往下"},
    {"from": "run", "to": "analyze", "step": 4, "label": "只在規劃好的時點看"},
    {"from": "analyze", "to": "decide", "step": 5, "label": "主指標贏且 guardrail 過關"}
  ],
  "steps": [
    "先決定主指標（例如 CTR）、要偵測的最小效果與 guardrail 指標的容忍幅度。",
    "用雙比例檢定算每組樣本量，再依無效流量與 SRM 緩衝放大，換算出至少要跑幾天。",
    "使用者層級隨機分流後，第一件事是用卡方檢定檢查各組人數比例，SRM 沒過就不要看任何指標。",
    "跑滿完整週期，只在事先規劃好的時點用 α-spending 做中途檢查，不要每天看 p 值就停。",
    "用實驗前的使用者 CTR 做 CUPED 降低變異數，並用非劣性檢定確認 guardrail 沒有退步超過容忍幅度。"
  ],
  "caption": "本文整理的設計流程示意，各步驟的依據見前文對應段落。"
}
```

## 今日練習題

### 題目

你要把 feed 的排序模型換成新模型。基線 CTR 是 2.0%，預期相對提升 5%，要 90% 檢定力、α=0.05，使用者層級 50/50 分流。請設計這個 A/B 測試：算樣本量與最短天數、規劃 guardrail 與中途監控、說明 CUPED 與干擾問題，並說明測試後怎麼決定放量。

**來源**：Snowflake 面試題「Design an A/B test for ML model launch」（PracHub 整理，題目標記為 Data Scientist／Technical Screen；改寫為 ML 系統設計情境）　**難度**：進階　**環節**：technical screen／system design

### 拆解思路

1. **先釐清問題**：CTR 的定義是什麼（每位使用者有沒有點擊過，還是曝光層級）？分流單位是使用者嗎？每天的 100 萬是新的不重複使用者，還是同一批人重複出現？有沒有創作者或廣告主這類共享資源，會讓兩組互相影響？
2. **建立框架**：用「先證明測得準，再證明有效，最後證明沒傷到別的」三層來組織：測量可信度（樣本量、SRM、無效流量）、效果推論（CUPED、序貫監控）、風險控制（guardrail、放量）。
3. **深入核心**：最關鍵的取捨是速度對嚴謹。提早停止省時間，但必須用 α-spending 或 always valid 推論；CUPED 省樣本，但共變量必須是實驗前資料；guardrail 要在樣本量裡預留檢定力。
4. **收尾**：用一句決策規則作結：主指標有證據變好、所有 guardrail 證明未退步超過容忍幅度、SRM 通過，才逐步放量，並保留 holdout 觀察長期效果。

### 範例回答（面試時可以這樣講）

> **先確認測得準**：我先用雙比例檢定算樣本量。2.0% 到 2.1%、雙尾 α=0.05、檢定力 90%，每組約 42 萬人，兩組約 84 萬。再除以 0.95 補無效流量、除以 0.99 預留 SRM 緩衝，大約要 90 萬人。數字上一天流量就夠，但我仍會跑滿至少一個完整週期，避開星期效應與新奇效應。分流後第一件事是卡方檢定看各組人數比例，SRM 沒過就先找原因，不看任何指標。
>
> **再證明有效**：中途監控我會用事先規劃的 α-spending，例如 O'Brien-Fleming，只在固定時點檢查，不是每天看 p 值。分析時用 CUPED，共變量取每位使用者實驗前一段期間的 CTR，因為論文顯示同一個指標的實驗前版本是最好的單一共變量，而且不會被處理影響。我會看 ρ 估計能降多少變異數，並確認兩組的共變量平均沒有差異。
>
> **最後確認沒傷到別的**：bounce rate、當機率、p95 延遲、每位使用者營收都設容忍幅度，用非劣性檢定證明沒有退步超過幅度。若 feed 的內容或創作者資源是共享的，我會懷疑對照組被干擾，必要時改用群組或地理分流，或保留一個 holdout。測試後我會檢查實際達到的檢定力、不同族群的效果差異，再分階段放量。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 雙比例檢定公式與代入的數字，並補上無效流量與 SRM 緩衝 | |
| 先做 SRM 檢查，再看任何指標 | |
| 序貫監控（α-spending 或 always valid），說清楚為什麼不能偷看 | |
| CUPED 的共變量必須是實驗前資料，並說明如何驗證 | |
| guardrail 用非劣性檢定，並預先定義容忍幅度 | |
| 加分：離線指標與線上指標的落差、雙邊市場的 interference | |

## 延伸閱讀

- [Bridging the Gap: Diagnosing Online-Offline Discrepancy in Pinterest's L1 Conversion Models — Pinterest Engineering](https://medium.com/pinterest-engineering/bridging-the-gap-diagnosing-online-offline-discrepancy-in-pinterests-l1-conversion-models-1320faaaeefe) — 一個真實的離線變好、線上沒贏的診斷案例，適合拿來練習面試時的根因拆解。
- [Risk-Aware Product Decisions in A/B Tests with Multiple Metrics — Spotify Engineering](https://engineering.atspotify.com/2024/03/risk-aware-product-decisions-in-a-b-tests-with-multiple-metrics) — 講清楚成功指標與 guardrail 該用什麼檢定、決策規則怎麼控制錯誤率。

## 參考資料

- [Design an A/B test for ML model launch — PracHub（Snowflake）](https://prachub.com/interview-questions/design-an-a-b-test-for-ml-model-launch) — 本篇練習題的原始題目與假設（基線 CTR 2.0%、相對提升 5%、90% 檢定力、5% 無效流量、1% SRM）。
- [Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data — Deng, Xu, Kohavi, Walker（WSDM 2013）](https://www.exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf) — 對應 CUPED 的公式、(1−ρ²) 變異數縮減、Bing 約 50% 與共變量選擇。
- [Diagnosing Sample Ratio Mismatch in Online Controlled Experiments — Fabijan et al.（KDD 2019）](https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf) — 對應 SRM 的定義、50.2/49.8 例子、約 6% 實驗出現 SRM 與根因分類。
- [Always Valid Inference: Bringing Sequential Analysis to A/B Testing — Johari, Pekelis, Walsh（arXiv:1512.04922）](https://arxiv.org/abs/1512.04922) — 對應持續監看會讓一般 p 值失效，以及 always valid 推論。
- [Why Marketplace Experimentation Is Harder than it Seems — Blake, Coey（EC 2014）](https://dl.acm.org/doi/10.1145/2600057.2602837) — 對應雙邊市場的 test-control interference 與估計偏高約兩倍。
- [Risk-Aware Product Decisions in A/B Tests with Multiple Metrics — Spotify Engineering](https://engineering.atspotify.com/2024/03/risk-aware-product-decisions-in-a-b-tests-with-multiple-metrics) — 對應 guardrail 的非劣性檢定與多個 guardrail 同時過關的檢定力問題。
- [Bridging the Gap: Diagnosing Online-Offline Discrepancy in Pinterest's L1 Conversion Models — Pinterest Engineering](https://medium.com/pinterest-engineering/bridging-the-gap-diagnosing-online-offline-discrepancy-in-pinterests-l1-conversion-models-1320faaaeefe) — 對應離線與線上指標落差的四類原因。
