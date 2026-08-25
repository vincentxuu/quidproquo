---
title: "AI Engineer 面試日練 — 2026-08-26：ML System Design"
date: 2026-08-26
category: daily
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今日練 ML system design：feature store 的 online/offline 雙軌設計、training-serving skew、二階段推薦架構，以及怎麼設計一場真的能看出模型效果的 A/B test。"
tldr: "ML system design 面試考的是把商業目標翻譯成完整的機器學習系統，不是背 buzzword。今天聚焦四塊高頻考點：feature store 的 online/offline 雙軌與 point-in-time correctness、線上推論的延遲預算與 shadow mode、A/B test 該用什麼隨機化單位與怎麼分辨 novelty effect，以及用 PSI 偵測 data drift 和 concept drift 的差別。"
series:
  name: "AI Engineer 面試日練"
  order: 7
---

## 今日主題

ML System Design 跟一般軟體 system design 最大的不同，是多了訓練資料怎麼來、feature 在訓練和線上推論時是不是同一套邏輯、模型上線後怎麼知道它「悄悄變差」這三層，光講得出 API gateway、load balancer、cache 這些通用元件是不夠的。面試官在意的是你能不能把一個商業問題（例如「提升推薦點擊率」）拆成明確的 ML 目標、資料管線、serving 架構跟監控策略,而且每個技術選擇都能連回最前面那個商業指標。

今天練的是 Google、Meta、Uber、Airbnb 這類公司在 ML system design 輪最常考的形式：從 feature store 到 A/B test 到 drift 監控，走完一次完整的生產閉環。

## 核心概念速記

### Feature Store：Online / Offline 雙軌與 Training-Serving Skew

Feature store 分兩個平面：offline store（Hive、BigQuery、Snowflake 之類的資料倉儲）存歷史 feature，強調 point-in-time correctness——訓練時只能用「當下這筆 label 產生那個時間點之前」存在的資料，不然就是 leakage；online store（Redis、DynamoDB 之類的低延遲 KV store）在推論當下用 < 10ms p99 把 feature 吐出來。兩邊如果各自寫一套計算邏輯，就會出現 training-serving skew：模型訓練時看到的 feature 分布跟線上推論時看到的不一樣，準確率會無聲無息地掉下去。面試時的加分句是「feature 的計算邏輯要共用一份程式碼，不管走 offline 批次還是 online 即時路徑」。

### 線上推論的延遲預算與 Shadow Mode

Ranking 類模型的即時推論延遲預算通常抓 10–50ms，複雜 ensemble 可以到 200ms，拆解起來大概是 feature 抓取 < 5ms、模型 forward pass < 10ms。要壓進這個預算，常見手法是模型量化（INT8）、匯出 ONNX 再用 TensorRT 跑、非即時場景改批次推論。新模型上線前的標準做法是 shadow mode：讓新模型跟正式模型一起跑,但只把正式模型的結果回給使用者,拿兩邊的預測分布做比較,先抓出 serving 端的問題（延遲、crash、feature 缺漏）,再進到真正會影響使用者的 A/B test。

### A/B Test 怎麼設計才不會誤判

ML 模型的 A/B test 跟 UI 改版的 A/B test 不一樣，模型對下游指標的影響需要更長時間才會顯現。隨機化單位要選對：會隨時間學習使用者偏好的個人化模型，該用 user-level 隨機化；stateless 的 ranking 模型可以用 query-level，但這樣會低估 novelty effect。Novelty effect 是指使用者剛看到新模型的前幾天互動模式會不一樣（可能更好奇、也可能更抗拒），至少要跑兩週才能把「新奇感」跟「穩態表現」分開。指標要先分層：primary metric（真正要優化的商業結果）、guardrail metrics（engagement、latency、revenue，不能因為 primary metric 漲就犧牲這些）、diagnostic metrics（CTR、NDCG 這類模型專屬訊號）,三層在實驗開始前就要定義好,不要等資料出來才決定要看哪個數字。

### Data Drift vs Concept Drift：兩種不同的「模型變差」

Data drift 是輸入的分布變了（例如使用者年齡結構改變),concept drift 是輸入和輸出之間的關係變了（例如疫情前後,使用者對「居家」相關商品的購買行為徹底不同）,兩者都是無聲的失敗模式,不會噴 error,只會讓業務指標慢慢往下掉。常見量化工具是 PSI（Population Stability Index）：`PSI = Σ(實際佔比 − 預期佔比) × ln(實際佔比 / 預期佔比)`,PSI 超過 0.25 通常視為顯著漂移,該觸發重新訓練。除了 feature 本身的分布,預測分數的分布也要監控——score distribution 突然位移,往往比 ground truth label（通常有延遲）更早示警。

## 今日練習題

### 題目

設計一個電商網站的商品推薦系統的 feature store 與線上推論路徑，並說明你會怎麼幫這個推薦模型設計 A/B test 來驗證新版本是否真的該上線。

**來源**：自擬（綜合 Meta／Uber／Airbnb 的 ML system design 常見考法，屬於 MLSD 最高頻的「recommendation + feature store」組合題）　**難度**：進階　**環節**：onsite（ML system design round，45–60 分鐘）

### 拆解思路

1. **先釐清問題**：這題範圍很大,一定要先問清楚——推薦的場景是首頁還是商品詳情頁的「相關商品」？延遲預算多少（通常 < 100ms）？要優化的商業指標是點擊率、加購率還是 GMV？有沒有既有的 feature pipeline 可以沿用？
2. **建立框架**：用「資料 → feature → 模型 → serving → 評估 → 監控」的順序往下講,先講清楚 label 怎麼定義（點擊？加購？購買？時間窗多長？),再進 feature,不要一開始就跳去講模型架構。
3. **深入核心**：這題的關鍵權衡在兩個地方——一是 online/offline feature store 怎麼保證一致（前面講的 training-serving skew）,二是二階段架構（先用輕量模型從幾萬個候選商品裡 retrieval 出幾百個,再用重模型對這幾百個做精排 ranking),因為線上直接對全量商品跑重模型會爆掉延遲預算。
4. **收尾**：用 A/B test 收尾,講清楚隨機化單位（這題偏向 user-level,因為推薦有個人化學習效果）、guardrail metrics（不能為了拉高點擊率犧牲頁面載入速度或多樣性）,以及上線前你會先跑 shadow mode 驗證 serving 穩定,再進 canary（1–5% 流量）,最後才是全量 A/B test。

### 範例回答（面試時可以這樣講）

> **先講清楚評估這題的框架**：「我會把這題拆成資料與 feature、模型與 serving 架構、評估與監控三層。假設場景是商品詳情頁的『相關商品』推薦，延遲預算抓 100ms，優化指標是點擊率同時把加購率當 guardrail。」
>
> **feature store 與 serving 架構**：「Feature 分 online 跟 offline 兩個 store：offline 用 BigQuery 存使用者歷史行為與商品屬性,做 point-in-time join 產生訓練資料；online 用 Redis 存最新的使用者 embedding 跟商品 embedding,推論時 < 10ms 內抓出來。因為候選商品可能有幾萬個,直接對全部跑精排模型會超出延遲預算,所以我會設計兩階段：先用輕量的 embedding 相似度做 retrieval,抓出 top 500,再用一個 gradient boosting 或小型 transformer 做精排,對這 500 個重新排序。」
>
> **A/B test 與監控**：「上線前先跑一週 shadow mode，比較新模型跟正式模型的預測分布有沒有明顯位移，確認 serving 沒有 bug 之後才進 canary，先給 2% 流量觀察延遲跟錯誤率。正式 A/B test 用 user-level 隨機化，跑滿兩週分開 novelty effect 跟穩態表現，主指標是點擊率，guardrail 是加購率跟頁面延遲 p99。上線後持續用 PSI 監控 feature 分布跟預測分布，超過閾值就觸發重新訓練的告警。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚延遲預算、要優化的商業指標、label 定義 | |
| 講出 online/offline feature store 怎麼保持一致（training-serving skew） | |
| 因為候選集太大,設計了二階段 retrieval + ranking 架構 | |
| A/B test 講出隨機化單位的選擇理由,以及 novelty effect 要跑多久才能分開 | |
| 有講 guardrail metrics,不是只看單一 primary metric | |
| 加分項：上線流程有 shadow mode → canary → 全量 A/B test 的漸進式驗證 | |
| 加分項：監控用 PSI 一類的量化指標分辨 data drift / concept drift | |

## 延伸閱讀

- [ML System Design Interview Guide 2026 — CalibreOS](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — 完整涵蓋 MLSD 框架的九步驟，A/B testing 跟 monitoring 兩節寫得特別扎實，是這篇文章的主要參考來源之一。
- [System Design: ML Training and Serving Pipeline — techinterview.org](https://www.techinterview.org/post/3233466263/system-design-ml-pipeline/) — 把 feature store、training pipeline、serving pipeline 三段用具體的程式碼片段串起來，適合拿來對照自己畫的架構圖。

## 參考資料

- [ML System Design Interview Guide 2026 — CalibreOS](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — 對應「A/B Test 怎麼設計才不會誤判」「Data Drift vs Concept Drift」兩節。
- [System Design: ML Training and Serving Pipeline — techinterview.org](https://www.techinterview.org/post/3233466263/system-design-ml-pipeline/) — 對應「Feature Store：Online / Offline 雙軌」「線上推論的延遲預算與 Shadow Mode」兩節。
- [Feature Store & Model Serving — System Design Space](https://system-design.space/en/chapter/feature-store-model-serving/) — 補充 point-in-time correctness 與 feature contract 的討論。
