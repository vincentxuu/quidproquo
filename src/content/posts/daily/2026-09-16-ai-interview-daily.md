---
title: "AI Engineer 面試日練 — 2026-09-16：ML System Design"
date: 2026-09-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "今天練 ML System Design 面試的六階段框架——問題定義、資料與特徵、模型選型、離線與線上評估、上線服務、監控與迭代——搭配一題「設計影片推薦系統」的完整拆解。"
tldr: "今天的 ML System Design 輪練涵蓋面試官實際在評估的六個維度(問題定義、資料/特徵、模型選型、評估、上線服務、監控迭代)、feature store 解決的 training/serving skew 問題、real-time 與 batch inference 的延遲取捨、data drift 與 model drift 的監控機制,以及離線指標與線上 A/B 測試該怎麼配合。練習題是設計一個影片推薦系統,面試官想看你能不能把候選生成、排序模型、上線服務、監控串成一條完整、講得出取捨理由的技術鏈,而不是只背某個公司的架構圖。"
series:
  name: "AI Engineer 面試日練"
  order: 28
---

> 🌏 [English version](/en/posts/daily/2026-09-16-ai-interview-daily-en)

## 今日主題

星期三輪到 ML System Design,這是 2026 年成長最快的面試環節之一——Google、Meta、Amazon、Netflix 幾乎每個中大型公司的 ML/AI Engineer 職缺都會排這一輪。跟傳統系統設計不同,這裡考的不是負載平衡跟資料庫分片,而是「能不能把一個模糊的商業問題(降低流失率、提升互動)拆解成一個端到端可執行的 ML 系統」。今天練的內容對應面試中最常見的走法:面試官給一個產品場景,看你能不能把問題定義、資料、模型、上線、監控串成一條完整的推理鏈,而不是背誦某個特定架構的細節。

## 核心概念速記

### 面試官實際在評估的六個維度

ML system design 題目表面上五花八門(推薦系統、詐欺偵測、廣告點擊預測),但拆開來看,面試官都在檢查同一組能力:問題定義(能不能把「提升互動」翻成清楚的 ML objective)、資料與特徵(哪裡拿資料、怎麼標記、什麼特徵有預測力)、模型選型(在延遲與可解釋性限制下選模型,並講出取捨)、評估(離線指標跟線上指標怎麼對應)、上線服務(即時或批次推論、API 設計、擴展性)、監控與迭代(data drift、model decay、重訓練頻率)。把這六個維度當成骨架背下來,幾乎任何題目都能套用,不用死記 30 種架構。

### Feature store 解決的問題

面試被問到 feature store,重點不是要你畫出它的內部架構,而是要你講清楚它解決什麼問題:training/serving skew(訓練時用的特徵計算邏輯跟線上服務時不一致,導致模型上線後表現跟離線評估差很多)跟特徵重複開發(同一個特徵被不同團隊重算好幾次,定義還可能不一致)。只要能講出這兩點,加上批次特徵(離線算好存起來)跟即時特徵(線上臨時計算)的差別,就足以應付大多數 Data Scientist 職等的追問;真正要往 MLOps/ML Platform 深度的架構細節,通常是有相關經驗的人才會被進一步挖。

### Serving layer:real-time 與 batch 的取捨

上線服務的核心問題永遠是「這個場景能不能忍受多久的延遲」。批次推論(定期跑一批預測存起來,請求來時直接查表)適合推薦系統的候選生成、風險評分這類不需要即時反應個別行為的場景,成本低、好維運;即時推論(請求進來才跑模型)適合詐欺偵測、動態定價這類需要反映當下輸入的場景,但要處理延遲預算、模型壓縮、快取策略。很多實際系統是混合式:批次算好候選集,即時只做輕量排序或重排,兼顧成本與反應速度。

### 監控與迭代:data drift 跟 model drift 不是同一件事

Data drift 是輸入資料的分布隨時間改變(使用者行為改變、季節性、新產品上線),model drift(或叫 concept drift)是輸入跟輸出之間的關係改變(同樣的特徵,現在對應到不同的正確答案)。兩者都會讓模型悄悄變差,但成因跟對策不同——data drift 通常靠監控特徵分布的統計量(如 PSI、KL divergence)偵測,concept drift 則要靠線上指標(轉換率、點擊率)的持續下滑來發現,對策是設定重訓練頻率跟自動化的 rollback 機制,一旦新模型上線後線上指標惡化就能快速退回舊版本。

### 離線指標與線上 A/B 測試怎麼配合

離線指標(AUC、precision/recall、NDCG)跑得快、成本低,但跟業務真正關心的指標(營收、留存、互動時長)之間永遠有落差,這個落差就是為什麼一定要上線 A/B 測試才能確認模型真的「好」。面試時常被問「離線指標漂亮但線上沒有提升怎麼辦」,核心答案是離線指標可能對應到錯誤的 proxy(例如優化點擊率卻犧牲了長期留存),要回頭檢查離線指標跟北極星指標的相關性夠不夠強,而不是只調模型參數。

## 今日練習題

### 題目

設計一個影片推薦系統(例如首頁「為你推薦」清單),使用者規模是千萬級,影片庫有數百萬支。系統要即時回應使用者的瀏覽行為,同時兼顧多樣性、避免同質內容洗版。

**來源**：改編自 ByteByteGo《Machine Learning System Design Interview》影片推薦系統章節、Javarevisited〈How to Prepare for an ML System Design Interviews in 2026〉整理的框架　**難度**：進階　**環節**：onsite / system design

### 拆解思路

1. **先釐清問題**：先確認商業目標是什麼——是最大化總觀看時長、次日回訪率,還是要兼顧內容多樣性(避免推薦氣泡)?再問規模跟延遲限制:首頁載入的延遲預算大概多少毫秒、候選影片庫有多大、使用者行為資料的即時性要求(上一部影片看完馬上要反映,還是可以有幾分鐘延遲)。這些答案會直接決定架構要多重。
2. **建立框架**：用業界標準的兩階段(或三階段)漏斗架構——候選生成(candidate generation)從數百萬支影片中快速篩出幾百到幾千支候選,用 embedding + 近似最近鄰(ANN)或協同過濾;排序(ranking)用一個更重的模型(通常是 gradient boosting 或深度學習排序模型)對候選集打分,加入更多特徵(使用者歷史、影片元資料、當下情境);如果要處理多樣性,再加一層重排(re-ranking),用規則或 MMR 這類演算法打散同質內容。
3. **深入核心**：面試官最想聽到的是候選生成跟排序模型之間的取捨——候選生成必須極快(毫秒級篩出候選),所以只能用輕量的相似度計算,精度換速度;排序模型可以慢一點但要更準,因為只跑在幾百個候選上。訓練時要注意 training/serving skew:候選生成的 embedding 如果離線批次算好(存進 feature store),要確保跟線上查詢時用的向量版本一致,不然會出現離線評估很好、線上效果卻掉的情況。另外要講清楚冷啟動(新使用者、新影片沒有歷史行為)怎麼處理,通常靠內容特徵(標籤、類別)搭配探索性推薦(explore/exploit)補足。
4. **收尾**：講監控與驗證計畫——除了觀看時長、CTR 這類線上指標,還要監控推薦的多樣性指標(避免使用者的推薦清單長期收斂到單一類型)跟候選生成/排序模型的 data drift。上線流程用 A/B 測試分流驗證,並保留能快速 rollback 的機制,因為推薦系統的改動很容易在離線指標上看起來變好、但線上因為 proxy 指標沒對齊業務目標而效果打折。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我會先確認這個推薦系統的北極星指標是總觀看時長還是次日回訪率,以及首頁載入的延遲預算——這決定候選生成階段能用多重的模型。假設是千萬級使用者、數百萬支影片庫,延遲預算在 200 毫秒內,我會採用業界常見的兩階段漏斗架構,而不是對整個影片庫跑一次重排序模型。
>
> **架構層面**:候選生成階段用雙塔(two-tower)模型把使用者跟影片各自編碼成 embedding,離線用近似最近鄰索引(如 FAISS)快速從數百萬支影片中篩出幾百支候選,這一步犧牲一點精度換取速度;排序階段用梯度提升樹或深度排序模型,加入更豐富的特徵(使用者近期行為序列、影片元資料、當下裝置與時段)對候選重新打分,因為只跑在幾百筆上,可以用更重的模型。如果產品端在意多樣性,我會在排序之後加一層輕量重排,用 MMR 之類的方法確保清單不會被單一類型洗版。整條 pipeline 會透過 feature store 確保離線訓練跟線上服務用的是同一份特徵定義,避免 training/serving skew。
>
> **監控與收尾**:上線前用 A/B 測試分流,同時追蹤觀看時長、次日回訪率這些業務指標,跟多樣性、候選生成延遲這些系統指標。上線後持續監控特徵分布(data drift)跟線上指標的變化(model drift),一旦效果下滑就能透過保留的舊版本快速 rollback。冷啟動使用者或新影片沒有足夠行為資料時,會混入基於內容特徵的候選,搭配一定比例的探索性推薦,逐步收集資料再收斂到個人化推薦。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先問清楚北極星指標(觀看時長/回訪率)跟延遲預算,而不是直接畫架構 | |
| 提出候選生成 + 排序(+ 重排)的多階段漏斗架構 | |
| 講清楚候選生成「快但粗」跟排序「慢但準」的取捨理由 | |
| 提到 feature store 避免 training/serving skew | |
| 有處理冷啟動(新使用者/新影片)的方案 | |
| 加分項:監控計畫(data drift、多樣性指標、A/B 測試、rollback) | |

## 延伸閱讀

- [Machine Learning System Design Interview — ByteByteGo](https://bytebytego.com/courses/machine-learning-system-design-interview/video-recommendation-system?fpr=javarevisited) — 影片推薦系統章節的完整架構拆解,今天練習題的主要參考框架。
- [Machine Learning System Design — Educative.io](https://www.educative.io/courses/machine-learning-system-design?affiliate_id=5073518643380224) — 文字互動式課程,結構跟今天的六階段框架一致,適合考前快速複習。
- [ml-system-design — analyticsbot (GitHub)](https://github.com/analyticsbot/ml-system-design) — 免費的 ML System Design 準備清單,涵蓋需求澄清到風險限制的完整流程,附推薦系統、排序、內容審核等案例。

## 參考資料

- [How to Prepare for an ML System Design Interviews in 2026? — Javarevisited](https://javarevisited.substack.com/p/how-to-prepare-for-an-ml-system-design) — 今日六階段框架、feature store 說明、serving/monitoring 段落的主要來源。
- [Machine Learning System Design Interview — ByteByteGo](https://bytebytego.com/courses/machine-learning-system-design-interview/video-recommendation-system?fpr=javarevisited) — 今日練習題「影片推薦系統」的架構參考來源。
