---
title: "AI Engineer 面試日練 — 2026-11-04：ML System Design"
date: 2026-11-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三主題 ML System Design：從 Reddit 真實 MLE onsite 面試題出發，練習怎麼把留言可能性預測系統拆成 serving-path 延遲預算、候選清單批次打分，跟上線後的部署安全網。"
tldr: "今天的核心是把 ML 系統設計的重點從選模型移到怎麼讓模型活在 production 裡：serving-path 拆成 feature retrieval、preprocessing、inference、postprocessing 幾段並訂出延遲預算，用批次打分一次處理整個候選清單省掉重複計算，再靠 canary／shadow deployment 跟分清楚 data drift／concept drift／infra failure 三種監控類別守住上線後的品質。練習題取自 Reddit MLE onsite 真實面試題——設計留言可能性預測系統，重點放在 feature serving 跟 model serving——陷阱是把答案講成「把模型放進 API 後面」就結束，沒碰延遲預算、skew 偵測跟 rollback。"
series:
  name: "AI Engineer 面試日練"
  order: 77
---

> 🌏 [English version](/posts/daily/2026-11-04-ai-interview-daily-en)

## 今日主題

星期三固定練 ML System Design，今天換一個切角：不是從零設計整套推薦系統，而是聚焦在考官最常深挖、也最容易被候選人輕輕帶過的一段——模型怎麼真正活在 production 裡。多數人準備 ML system design 的方式是背「資料→特徵→模型→評估」這條標準流程，但面試官往往在聽完模型選型後才開始認真發問：這個特徵從哪裡來、多快能查到、整個候選清單要怎麼在延遲預算內打完分、模型壞掉或慢下來的時候系統怎麼反應。

這類題目考的不是你能不能畫出 feature store 跟 model server 兩個方框，是你知不知道把模型放進 API 後面之後，還有多少工程決策決定它能不能在真實流量下活下來——這正是 ML Engineer onsite 裡「ML system design」環節的核心。

## 核心概念速記

### Serving-path 拆解與延遲預算：把一個請求拆成能分別量測的幾段

一個排序請求要在延遲預算內做完好幾件事：request handling、feature retrieval、preprocessing、inference、postprocessing，最後還要有 fallback 行為。強答案會先講出一個明確的端到端預算（例如總共 100ms，其中 20–40ms 留給模型推論本身），再把剩下的預算分給其他幾段，並且對每一段分別量 p50、p95、p99——因為拖垮整個請求的往往不是平均延遲,是某一段在尾端（tail latency）炸開。沒有先講預算就直接畫架構圖,是這題最常見的失分點。

```flow-diagram
{
  "title": "排序請求的 Serving-path 拆解",
  "lang": "zh-TW",
  "width": 520,
  "height": 680,
  "nodes": [
    {"id": "input", "label": "Ranking 請求進來\n使用者＋候選貼文清單", "x": 260, "y": 50, "w": 220},
    {"id": "feature", "label": "Feature retrieval\nonline store 一次查完整清單", "x": 260, "y": 190, "w": 220},
    {"id": "preprocess", "label": "Preprocessing\n套用與訓練一致的特徵轉換", "x": 260, "y": 330, "w": 220},
    {"id": "inference", "label": "Inference\n版本化 ranker 批次打分", "x": 260, "y": 470, "w": 220, "tone": "accent"},
    {"id": "output", "label": "Postprocessing 與回傳\n業務規則、逾時走 fallback", "x": 260, "y": 610, "w": 220}
  ],
  "edges": [
    {"from": "input", "to": "feature", "step": 1, "label": "批次取特徵"},
    {"from": "feature", "to": "preprocess", "step": 2, "label": "對齊訓練轉換"},
    {"from": "preprocess", "to": "inference", "step": 3, "label": "批次打分"},
    {"from": "inference", "to": "output", "step": 4, "label": "套規則或 fallback"}
  ],
  "steps": [
    "Feature retrieval 從低延遲 online store 一次抓完整個候選清單所需要的特徵，而不是逐個貼文重複查詢使用者特徵——這是壓低 p99 延遲的關鍵，也是這題常被追問的細節。",
    "Preprocessing 套用跟訓練時完全一致的特徵轉換（例如同一個 log-transform），這一步沒對齊好就是 training-serving skew 最常見的來源。",
    "Inference 用版本化的 ranker 一次批次打分整個候選清單，模型版本跟特徵 schema 綁在一起部署，不能各自升版。",
    "Postprocessing 套業務規則（多樣性、安全過濾）後回傳；任何一段逾時或缺值，都走預先定義好的 fallback（預設值或簡化模型），而不是讓整個請求失敗。"
  ],
  "caption": "簡化示意：省略前端的 candidate generation 階段與獨立的 shadow／canary 部署路徑，端到端延遲預算（例如 100ms）由各段分攤。"
}
```

### Candidate Generation 跟 Ranking 要分兩階段，不要整份語料庫跑一次深度模型

單一請求常常要同時幫很多個候選項目打分（例如一個使用者的個人化 feed 裡有上百篇候選貼文）。正確作法是把「用便宜方法先篩出候選集合」跟「用較貴的模型對有限候選排序」拆成兩個階段——先用訂閱關係、協同過濾、embedding 近鄰搜尋或熱門內容抓出幾百到幾千個候選,再讓較重的 ranker 只對這個有限集合打分,不要讓深度模型掃過整個語料庫。這個兩階段架構同時省了延遲跟運算成本,面試官聽到候選人直接說「對每個候選分別呼叫一次模型」,通常就知道對方沒想過請求層級的共用計算怎麼省。

### Training-Serving Skew：靠集中定義跟 shadow 比對抓出來，不是靠信任

Training-serving skew 發生在訓練跟推論用了不一樣的特徵轉換——最常見的例子是訓練時用了 log-transform 過的計數,但 production 送進去的是原始計數。防範的方法是把特徵定義集中管理成單一來源(一份轉換邏輯餵兩邊),並且定期做 shadow comparison——拿線上實際送進模型的特徵值,跟離線用同一套邏輯重算出來的值做比對,距離拉大就代表兩邊已經走歧路。只說「我會確保特徵一致」而不講怎麼偵測不一致,是這塊常見的空話。

### 部署安全網：Canary、Shadow Deployment，跟分清楚三種監控類別

新模型上線前,shadow deployment 讓模型接收真實流量但不影響任何決策輸出,用來比對分數分布、特徵可得性、延遲跟跟現有模型的分歧程度;確認沒問題後再用 canary 流量逐步曝光,搭配版本化模型與快速 rollback。上線後的監控要分清楚三種完全不同的失效模式——data drift(輸入分布變了)、concept drift(輸入跟輸出的關係變了)、跟基礎設施故障(逾時、thrown error、容量不足)——因為這三種問題的處理方式完全不同,混在一起討論會讓考官覺得你沒有真正想過「模型退化」具體長什麼樣子。alerting 的門檻也要設在「可以行動的程度」,不是每一個小幅度的分布變化都要觸發警報。

## 今日練習題

### 題目

設計一個留言可能性預測系統：在一個貼文屬於不同社群的大型討論平台上,給定一個使用者跟一篇貼文,估計這個使用者會對這篇貼文留言的機率。請涵蓋問題框架、訓練資料、特徵與模型選型,但預期大部分討論時間會放在 feature serving 跟 model serving——每個模型需要的特徵怎麼被計算、儲存跟在請求時間取得,以及模型怎麼部署並在請求的延遲預算內完成打分。

**來源**：Reddit Machine Learning Engineer 面試真題（整理自 PracHub 面試題庫，2026-09-07 收錄）　**難度**：中等　**環節**：onsite ML system design

### 拆解思路

1. **先釐清問題**：這題範圍故意留白,值得主動問清楚——這個分數最終用在哪裡(個人化 feed 排序、單一社群內排序,還是通知推送的篩選),直接決定候選數量跟延遲預算;「留言」算不算只限頂層留言還是整個討論串的回覆,觀察時間窗多長;現有基礎設施有沒有 event stream、feature store、model-serving 平台。這些答案會決定你後面能講多細。
2. **建立框架**：先定義一個精確的 label(事件、時間窗、曝光來源),處理 position bias 跟 class imbalance,確保輸出機率有校準過;接著把特徵依「所屬實體」跟「新鮮度」分組——慢變動特徵走批次、中速變動走串流聚合、真正需要秒級新鮮度的才投資即時計算——同時餵給低延遲的 online store 跟 point-in-time correct 的 offline store。
3. **深入核心**：這題的深度幾乎全部落在 serving 這兩端——training-serving consistency 要靠共用特徵定義或記錄 serving 當下用的特徵值來偵測 skew;model-serving 路徑要講清楚延遲預算、批次打分整個候選清單、模型跟特徵 schema 綁在一起版本化部署、安全的 rollout(canary／shadow)、逾時與缺值的 fallback;監控要覆蓋特徵新鮮度、預測校準、跟防止系統獎勵低品質互動的 guardrail。
4. **收尾**：把整題收斂成一句判斷準則——「這題考的不是你會不會選模型，是你有沒有把『模型要怎麼在真實流量下活下來』的每一段都量化出來並想過失效模式」，再補一句延伸：「trending 貼文的留言數每秒變好幾次,又同時被大量併發請求讀取,這種熱點怎麼在不壓垂 online store 的前提下保持新鮮,是這題最後通常會被追問的細節」。

### 範例回答（面試時可以這樣講）

> **先把問題框架定清楚**：我會先確認這個分數用在個人化 feed 排序還是單一社群排序，這決定候選數量跟延遲預算；label 我會定義成「貼文曝光後某個時間窗內的頂層留言」，並處理 position bias 跟 class imbalance，輸出保持機率校準而不是只排序用的分數。特徵我會依新鮮度分組：使用者跟社群的靜態屬性走天級批次，近期互動聚合走串流，貼文剛發布幾分鐘內的即時訊號才在 request-time 算，同時餵給低延遲 online store 跟 point-in-time correct 的 offline store。
>
> **Serving 是這題真正的重點**：一個請求會對同一個使用者的整批候選貼文打分，我會確保 feature retrieval 一次抓完整個候選清單需要的特徵，而不是逐篇重複查使用者特徵；preprocessing 套用跟訓練完全一致的轉換邏輯，並定期做 shadow comparison 比對線上實際特徵值跟離線重算值，抓 training-serving skew。Inference 端用版本化的 ranker 批次打分，模型版本跟特徵 schema 綁在一起部署，新版本先跑 shadow 流量比對分數分布，確認沒有問題才用 canary 逐步曝光。
>
> **收尾**我會補監控跟容錯：特徵新鮮度、預測校準、跟三種分開看的失效模式——資料分布變了、輸入輸出關係變了、還是基礎設施本身出問題——各自要有不同的應對；任何一段逾時或缺值都走預先定義的 fallback，不讓整個排序請求失敗。如果有更多時間，我會特別處理 trending 貼文：留言數每秒變化又被大量併發請求讀取，這種熱點需要額外的快取或近似更新策略，不能每次都直接打 online store。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有精確定義 label（事件、時間窗、曝光來源），並處理 position bias／class imbalance 跟輸出校準 | |
| 有把特徵依實體跟新鮮度分組，對應批次／串流／request-time 三種 pipeline | |
| 有講 serving-path 的延遲預算拆解（feature retrieval／preprocessing／inference／postprocessing 各自要量 p99） | |
| 有提到批次打分整個候選清單，而不是逐個候選重複計算 | |
| 有講 training-serving skew 怎麼偵測（集中特徵定義或 shadow comparison），以及 canary／shadow deployment 的安全 rollout | |
| 加分：有區分 data drift／concept drift／infra failure 三種監控類別，並處理熱點（trending 貼文）新鮮度問題 | |

## 延伸閱讀

- [ML Model Serving Architecture — Tech Interview Concept](https://prachub.com/concepts/ml-model-serving-architecture) — 把 serving-path 拆解、candidate generation／ranking 兩階段、canary／shadow deployment 跟三種監控類別寫成完整的面試概念筆記，含常見失分模式
- [Machine Learning System Design in a Hurry — Hello Interview](https://www.hellointerview.com/learn/ml-system-design/in-a-hurry/introduction) — 把 ML system design 面試分成 Product、Infra、Model 三種題型的速查指南，適合用來判斷今天這題屬於哪一種

## 參考資料

- [Design a Comment-Likelihood Prediction System with a Focus on Feature and Model Serving — PracHub (Reddit, Machine Learning Engineer)](https://prachub.com/interview-questions/design-a-comment-likelihood-prediction-system-with-a-focus-on-feature-and-model-serving) — 本篇練習題的原始問法來源，列為 Reddit MLE onsite 真實面試題
- [Reddit Machine Learning Engineer Interview Experience — Onsite with a Cat/Dog Comment-Tree Filter and a Comment-Likelihood ML Design — PracHub](https://prachub.com/interview-experiences/reddit-machine-learning-engineer-interview-experience-onsite-with-a-cat-dog-comment-tree-filter-and-a-comment-likelihood-ml-design) — 這道練習題出現的完整面試情境紀錄
- [ML Model Serving Architecture — Tech Interview Concept — PracHub](https://prachub.com/concepts/ml-model-serving-architecture) — 對應「Serving-path 拆解」「Candidate Generation 跟 Ranking 兩階段」「部署安全網」三節的概念來源
- [What Is a Feature Store? — Chalk](https://chalk.ai/blog/what-is-a-feature-store) — 對應「Training-Serving Skew」一節的定義與偵測方式來源
