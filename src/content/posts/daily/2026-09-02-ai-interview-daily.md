---
title: "AI Engineer 面試日練 — 2026-09-02：ML System Design"
date: 2026-09-02
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今日練 ML System Design：feature store 怎麼解決 training-serving skew、部署策略的四種選擇（canary/shadow/A-B/blue-green），以及 drift 監控該分幾層看。"
tldr: "ML System Design 面試考的不是你會不會畫架構圖，而是你能不能把每一層的取捨講清楚。今天聚焦四個高頻考點：feature store 如何保證 training/serving 一致性、部署策略要怎麼分層選擇並設計 rollback 觸發條件、監控要拆成 system/data/model 三層並用 PSI/KS test 抓 drift，以及線上推論的 latency 預算怎麼分配。練習題是「設計一個電商即時推薦服務」，走一遍從釐清需求、估算流量、到 feature store 與部署策略的完整設計。"
series:
  name: "AI Engineer 面試日練"
  order: 14
---

> 🌏 [English version](/en/posts/daily/2026-09-02-ai-interview-daily-en)

## 今日主題

ML System Design 是 AI Engineer 面試裡最考驗「systems thinking」的一塊——題目通常從一句「設計一個推薦系統」開始，但面試官真正想看的是你會不會把資料怎麼進來、特徵怎麼算、模型怎麼上線、上線後怎麼知道它還在正常運作,這四件事串成一個完整、能自我修復的系統,而不是只講模型架構。

今天不重複「選 XGBoost 還是神經網路」這種模型選型的老問題,而是練面試官真正在意的骨架:feature store 怎麼解決 training-serving skew、部署要分幾個階段降低風險、監控要看哪三層指標。這種題型常出現在 onsite 的 ML infra system design 環節,通常給 45-60 分鐘。

## 核心概念速記

### Feature Store 解決的是「同一個特徵,兩次算出不同答案」

Training-serving skew 是 ML 系統最常見也最隱蔽的故障來源:同一個特徵,離線訓練時用一種邏輯算,線上推論時用另一種邏輯算,模型收到的輸入分佈跟訓練時看到的不一樣,預測品質就悄悄崩壞而不會報錯。Feature store 的核心價值是把特徵定義集中管理,線上（Redis/DynamoDB,低延遲）跟離線（Parquet/資料倉儲,可回溯歷史）共用同一套 transformation 邏輯與 schema,面試時要能講出「我會怎麼驗證兩邊算出來的值一致」,而不是只講「我會用一個 feature store」。

### 部署策略要分層,不是「上線」二選一

Canary(小比例流量、監控後才擴大)、Shadow mode(新模型跑在背景、只記錄不影響線上結果)、A/B testing(不同流量段跑不同模型、用業務指標判定勝負)、Blue-green(整套環境切換、可秒級回滾)四種策略解決的問題不一樣——shadow 用來驗證新模型「跑不跑得動」而不冒業務風險,canary 用來驗證「有沒有負面影響」,A/B 用來驗證「真的比較好嗎」。面試時的加分句是講出 rollback 的觸發條件是自動化的(latency 超標、關鍵指標下滑就自動退回舊模型),而不是「人工觀察覺得不對就切回去」。

### 監控要拆成三層,不能只看模型準確率

Infra 層(QPS、latency、error rate、GPU/CPU 使用率)、資料層(feature availability、ingestion lag、輸入分佈 drift)、模型層(prediction distribution、線上準確率、feedback loop 延遲)是三個獨立會壞的地方,分開監控才抓得到問題出在哪一層。Drift 偵測的具體做法是拿最新輸入分佈跟訓練時的 reference 分佈做統計檢定,常用 PSI(population stability index)或 KS test 量化偏移程度,超過門檻就觸發告警或自動 retrain——講出這兩個具體檢定方法的名字,比籠統講「監控資料漂移」更有說服力。

### Latency 預算要拆到毫秒,不能只講「要快」

一個 sub-100ms 的線上推論請求,面試時要能把預算拆給每一段:feature 查詢(Redis,1-5ms)、模型 inference(10-30ms,視模型大小)、網路來回(10-20ms)、序列化(5-10ms)。這個拆解能力展現的是你有沒有真的想過瓶頸在哪——通常不是模型本身慢,而是 feature fetch 或 serialization 這些「看起來不重要」的環節吃掉大半預算,優化方向也因此不同(model compilation vs. caching vs. 減少 payload)。

## 今日練習題

### 題目

「設計一個電商平台的即時商品推薦服務：使用者瀏覽或購買行為要能即時反映在推薦結果上,系統要支援千萬級月活使用者,推薦延遲要壓在 100 毫秒內,並且要符合 GDPR 對個人資料的限制。」

**來源**：自擬（改編自 System Design Handbook 的 ML System Design 教學範例）　**難度**：進階　**環節**：onsite system design（ML infra）

### 拆解思路

1. **先釐清問題**:不要急著畫架構圖,先問清楚功能性需求(是排序既有商品清單、還是生成個人化文案？新使用者的 cold start 怎麼處理？)跟非功能性需求(延遲門檻是多少？流量規模多大？precision 還是 recall 優先？GDPR 對資料保存跟刪除有什麼硬性限制？)。面試官故意把「要即時反映」「要合規」這兩個約束放進題目,就是要看你會不會主動把它們變成量化的設計輸入,而不是說完「收到」就跳過。

2. **建立框架**:用「先估算規模、再分層畫架構、再深挖高風險元件」這個順序組織回答。估算階段給出具體數字(例如千萬 MAU、每人每天 20 次推薦請求 → 換算成尖峰 QPS),讓面試官知道你的架構決策是有依據的,不是憑空選 tech stack。

3. **深入核心**:整個設計最關鍵的三個 trade-off 都藏在細節裡。第一,feature store 要同時撐起「線上低延遲讀取」跟「離線可回溯訓練」兩種完全不同的存取模式,online/offline 兩邊的 schema 跟 transformation 邏輯必須共用同一套定義,否則就會出現 training-serving skew。第二,部署新模型不能一步到位,要先 shadow mode 驗證系統穩定性,再 canary 驗證沒有負面影響,最後才 A/B 驗證業務指標,每一步都要有自動 rollback 的觸發條件。第三,GDPR 合規不是事後補的檢查清單,而是要影響存儲設計本身——使用者要求刪除資料時,系統要能追蹤這筆資料流過哪些 feature、哪些訓練快照,才刪得乾淨。

4. **收尾**:用一句話收斂全場——「這個系統的核心不是選哪個推薦演算法,而是讓 offline 訓練跟 online 服務共用同一套特徵定義,並且每次模型更新都經過 shadow → canary → A/B 三階段驗證,任何一階段指標異常都能自動退回上一個穩定版本」。這句話點出面試官真正在評分的是系統思維,不是模型準確率。

### 範例回答（面試時可以這樣講）

> 在開始畫架構之前,我想先確認幾個需求:推薦是針對既有商品排序,還是要即時生成個人化清單?新使用者沒有歷史行為時怎麼處理冷啟動?延遲門檻我假設是結帳頁面等級的 100 毫秒內,流量規模先假設千萬月活、每人每天約 20 次請求,換算下來尖峰大概落在幾千 QPS 這個量級。GDPR 的部分,我會假設使用者有權要求刪除個人資料,這代表我的 feature store 設計要能追蹤每一筆特徵的資料來源,刪除請求才能真正生效,而不是只刪主資料庫。
>
> 架構上我會分成三層:即時事件(點擊、購買)透過 Kafka 進來,經過 streaming 處理算出近即時特徵(例如近五分鐘瀏覽的商品類別),寫進 Redis 這種低延遲的 online feature store;同時批次流程把同樣的事件算成歷史特徵(例如使用者近三十天的品類偏好),存進可回溯查詢的 offline warehouse 供訓練使用。這兩條路徑共用同一套特徵定義,是避免 training-serving skew 最關鍵的一步——如果線上線下用不同邏輯算「近期購買次數」,模型收到的輸入分佈跟訓練時看到的就不一樣,預測品質會悄悄下降卻查不出原因。
>
> 部署新模型時我不會直接切流量,而是先跑 shadow mode 確認系統在真實流量下不會出錯,接著用 canary 把 5% 流量導過去看有沒有負面訊號,最後才用 A/B testing 拿轉換率這類業務指標判定是否全量上線,每一步都設自動化的 rollback 條件,例如 latency 超過門檻或錯誤率異常就自動切回舊模型。監控我會拆成三層來看:infra 層看 QPS 跟 latency,資料層看 feature availability 跟輸入分佈有沒有 drift(用 PSI 這類統計量化),模型層看預測分佈跟線上準確率有沒有隨時間下滑——這三層分開看,才不會把「資料管線壞了」誤判成「模型不準」。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 主動釐清功能性與非功能性需求，並給出具體數字（QPS、延遲門檻） | |
| Feature store 講出 online/offline 共用同一套 transformation 邏輯，避免 training-serving skew | |
| 部署策略分層（shadow → canary → A/B），並講出自動 rollback 觸發條件 | |
| 監控拆成 infra / 資料 / 模型三層，drift 偵測講出具體統計方法（PSI/KS test） | |
| GDPR 或資料合規影響了存儲設計本身，不是事後補的檢查清單 | |
| 加分：latency 預算拆到每一段（feature fetch / inference / 網路 / 序列化） | |

## 延伸閱讀

- [Machine Learning System Design Interview: Step-by-Step Guide 2026](https://www.systemdesignhandbook.com/guides/machine-learning-system-design-interview) — 今天整篇文章的核心參考，含完整的規模估算、架構圖與十道常見追問題目
- [ML System Design Interview Questions（PracHub，295 題、79 家公司）](https://prachub.com/topic/machine-learning-interview/ml-system-design) — 依公司篩選真實面試題，適合針對特定公司加強準備
- [Refonte Learning：Machine Learning System Design Interview](https://www.refontelearning.com/blog/machine-learning-system-design-interview) — 監控與 A/B testing 段落的另一個視角，適合搭配今天核心概念的第三點一起讀

## 參考資料

- [Machine Learning System Design Interview: Step-by-Step Guide 2026](https://www.systemdesignhandbook.com/guides/machine-learning-system-design-interview) — 核心概念速記與練習題拆解思路的主要依據，包含 feature store 架構、部署策略與監控分層的完整說明
- [ML System Design Interview Questions（PracHub）](https://prachub.com/topic/machine-learning-interview/ml-system-design) — 核心概念速記中「部署策略」段落 canary/shadow/A-B/blue-green 分類的佐證來源
- [Refonte Learning：Machine Learning System Design Interview](https://www.refontelearning.com/blog/machine-learning-system-design-interview) — 核心概念速記中「監控要拆成三層」段落的補充依據
