---
title: "AI Engineer 面試日練 — 2026-10-28：ML System Design"
date: 2026-10-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三主題 ML System Design：從 Spector AI 的真實面試題出發，練習怎麼把 feature store 拆成 offline／online 兩個子系統，並在新鮮度跟基礎設施成本之間做取捨。"
tldr: "今天的核心是 feature store 的兩層架構——offline store 當訓練用的真相來源，強調 point-in-time correctness；online store 用低延遲資料庫服務線上推論——以及連接兩者的 materialization 怎麼決定 freshness 的上限。練習題取自 Spector AI 的真實 MLE 面試：「從零設計一個 feature store，新鮮度跟基礎設施成本怎麼取捨」，關鍵不是背出 offline／online 兩個名詞，是能示範一套「先看特徵變動速度，再決定走批次、串流還是 request-time 計算」的分級邏輯。"
series:
  name: "AI Engineer 面試日練"
  order: 70
---

> 🌏 [English version](/posts/daily/2026-10-28-ai-interview-daily-en)

## 今日主題

今天繼續練 ML System Design，但換一個切角：不是從頭設計整個預測系統，而是深入系統裡最容易被輕輕帶過、卻最常被深挖的一塊基礎設施——feature store。考官喜歡問這題，是因為它同時考資料工程跟線上服務兩種能力，而且答案裡藏著一個經典 trade-off：新鮮度（freshness）跟基礎設施成本（infrastructure cost）永遠在互相拉扯。

這個環節常出現在 ML Engineer 的 onsite，尤其是本身產品就重度依賴即時特徵（推薦、詐欺偵測、個人化）的公司。考官真正在意的往往不是你記不記得 Feast 或哪個向量資料庫的名字，而是你有沒有先搞清楚「這批特徵多久變一次」，再決定要用多貴的架構去追新鮮度。

## 核心概念速記

```diagram
title: Feature store 的 offline／online 兩層架構
desc: 特徵來源同時寫入 offline store，也可能跳過同步直接寫進 online store；offline store 定期 materialize 到 online store，這個同步週期決定新鮮度上限，快變動特徵則用串流直寫繞過它。
caption: 簡化示意：省略 schema registry 跟特徵計算邏輯共用層。
---
<svg viewBox="0 0 640 404">
  <path class="dg-line" d="M320 76 V104"/>
  <path class="dg-line" d="M320 104 H188 Q180 104 180 112 V120" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M320 104 H432 Q440 104 440 112 V120" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent dg-line--dashed" d="M260 152 H360" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M180 184 V260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 184 V260" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="240" y="20" width="160" height="56" rx="6"/>
  <text class="dg-label" x="320" y="40" text-anchor="middle" dominant-baseline="central">特徵來源</text>
  <text class="dg-sub" x="320" y="58" text-anchor="middle" dominant-baseline="central">使用者行為與交易</text>

  <rect class="dg-box dg-box--store" x="100" y="120" width="160" height="64" rx="6"/>
  <text class="dg-label" x="180" y="144" text-anchor="middle" dominant-baseline="central">Offline Store</text>
  <text class="dg-sub" x="180" y="164" text-anchor="middle" dominant-baseline="central">資料倉儲／DuckDB</text>

  <rect class="dg-box dg-box--store" x="360" y="120" width="160" height="64" rx="6"/>
  <text class="dg-label" x="440" y="144" text-anchor="middle" dominant-baseline="central">Online Store</text>
  <text class="dg-sub" x="440" y="164" text-anchor="middle" dominant-baseline="central">低延遲記憶體儲存</text>

  <rect class="dg-box" x="100" y="260" width="160" height="56" rx="6"/>
  <text class="dg-label" x="180" y="280" text-anchor="middle" dominant-baseline="central">模型訓練</text>
  <text class="dg-sub" x="180" y="298" text-anchor="middle" dominant-baseline="central">point-in-time</text>

  <rect class="dg-box" x="360" y="260" width="160" height="64" rx="6"/>
  <text class="dg-label" x="440" y="284" text-anchor="middle" dominant-baseline="central">線上推論</text>
  <text class="dg-sub" x="440" y="304" text-anchor="middle" dominant-baseline="central">毫秒級特徵查詢</text>

  <text class="dg-edge" x="376" y="94" text-anchor="middle" dominant-baseline="central">串流直寫</text>
  <text class="dg-edge" x="310" y="140" text-anchor="middle" dominant-baseline="central">批次同步</text>
  <text class="dg-edge" x="170" y="222" text-anchor="end" dominant-baseline="central">as-of join</text>
  <text class="dg-edge" x="450" y="222" text-anchor="start" dominant-baseline="central">低延遲查詢</text>

  <line class="dg-rule" x1="20" y1="352" x2="620" y2="352"/>
  <text class="dg-tag" x="20" y="376" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--store" x="76" y="368" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="376" dominant-baseline="central">資料儲存層</text>
  <line class="dg-line dg-line--dashed" x1="220" y1="376" x2="236" y2="376"/>
  <text class="dg-small" x="244" y="376" dominant-baseline="central">非同步／串流路徑</text>
  <line class="dg-line dg-line--accent dg-line--dashed" x1="420" y1="376" x2="436" y2="376"/>
  <text class="dg-small" x="444" y="376" dominant-baseline="central">決定新鮮度上限</text>
</svg>
```

### 1. Offline store 跟 online store 是兩個目的完全不同的子系統

Offline store 是訓練用的真相來源，扛的是歷史資料的大規模掃描，通常接在資料倉儲或資料湖上（BigQuery、Snowflake，或是資料量在幾百 GB 到幾 TB 之間時用 DuckDB 這類嵌入式分析引擎）。Online store 是推論用的即時查詢層，要求每秒撐起成千上萬次隨機讀取、延遲壓在毫秒級，通常用 Redis 或相容的記憶體內資料庫（如 Dragonfly）。這兩層不是同一套基礎設施的兩個模式，是完全不同的效能剖面，面試時先把這個分工講清楚，考官才會相信你接下來的架構選擇有道理。

### 2. Point-in-time correctness：用 event_timestamp 擋掉訓練資料洩漏

單純把「使用者現在的特徵」拿去配「使用者過去的標籤」會造成 leakage——模型等於偷看了未來。Feature store 的解法是每筆特徵記錄都帶一個 event_timestamp，訓練時用 as-of join：給定某個時間點，只能拿「那個時間點當下已經存在」的特徵值去配對應的標籤，而不是直接拿最新值。這個機制是 feature store 跟一般快取最大的差別，也是面試官最喜歡追問的細節之一。

### 3. Materialization 是連接兩層的橋，也是 freshness 落差的來源

Materialization 是把 offline store 裡最新算好的特徵值，定期同步進 online store 的過程。這個同步週期本身就定義了系統的新鮮度上限：如果 materialization 每小時跑一次，online store 裡的特徵值就永遠可能落後現實最多一小時。很多候選人會漏講這一步，直接跳到「線上查詢很快」，但考官要聽到的是「查詢快」跟「資料新不新」是兩件獨立的事。

### 4. 新鮮度分級：不是所有特徵都要追到秒級

把所有特徵都做成即時串流會把基礎設施成本推到不必要的高度。正確的做法是按「特徵變動速度」分級：慢變動的特徵（使用者年齡、商品分類）用天級批次 materialize 即可；中速變動的特徵（過去七天的瀏覽次數）用小時級批次或簡單的串流聚合；真正需要秒級新鮮度的特徵（這次 session 剛剛的點擊、這筆交易當下的裝置資訊）才值得投資 CDC 或串流 pipeline，甚至在 request-time 當場計算。把這個分級邏輯講出來，比單純說「我會用 Kafka 做即時特徵」更接近考官想聽的答案。

```diagram
title: 特徵新鮮度分級：三層對應三種架構
desc: 特徵依變動速度分成三層，慢變動用天級批次 materialize，中速變動用小時級批次，快變動才值得投資串流或 request-time 即時計算；往上一層，新鮮度跟基礎設施成本一起升高。
caption: 簡化示意：實際分級邊界依業務對新鮮度的敏感度調整，不是固定三段。
---
<svg viewBox="0 0 640 304">
  <path class="dg-axis" d="M36 280V20" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="52" y="20" dominant-baseline="central">成本與新鮮度：高</text>
  <text class="dg-tag" x="52" y="280" dominant-baseline="central">成本與新鮮度：低</text>

  <rect class="dg-box dg-box--accent" x="72" y="36" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="60" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="64" dominant-baseline="central">快變動特徵</text>
  <text class="dg-sub" x="124" y="84" dominant-baseline="central">session 點擊、裝置指紋</text>
  <text class="dg-sub" x="604" y="72" text-anchor="end" dominant-baseline="central">串流／request-time 直算</text>

  <rect class="dg-box" x="72" y="116" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="140" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="144" dominant-baseline="central">中速變動特徵</text>
  <text class="dg-sub" x="124" y="164" dominant-baseline="central">過去七天瀏覽次數</text>
  <text class="dg-sub" x="604" y="152" text-anchor="end" dominant-baseline="central">小時級批次 materialize</text>

  <rect class="dg-box" x="72" y="196" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="220" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="224" dominant-baseline="central">慢變動特徵</text>
  <text class="dg-sub" x="124" y="244" dominant-baseline="central">使用者年齡、商品類別</text>
  <text class="dg-sub" x="604" y="232" text-anchor="end" dominant-baseline="central">天級批次 materialize</text>
</svg>
```

## 今日練習題

### 題目

公司要從零開始設計一個 feature store，服務內部多個模型團隊（推薦、風控、個人化）共用。請說明你會怎麼設計 offline／online 兩層架構，以及在新鮮度跟基礎設施成本之間你會做哪些具體取捨。

**來源**：Spector AI 真實 MLE 面試題（knok.work 面試指南收錄，2026-10-27 更新）　**難度**：進階　**環節**：onsite ML system design

### 拆解思路

1. **先釐清問題**：先問這個 feature store 要服務哪些模型、各自的 serving 延遲預算是多少毫秒；再問現有基礎設施——公司已經有資料倉儲嗎？有沒有串流管線（Kafka 之類）？團隊規模夠不夠維運額外的即時系統？這些答案直接決定你後面能不能講串流特徵。
2. **建立框架**：先畫兩層骨架——offline store（訓練用，強調 point-in-time correctness）跟 online store（serving 用，強調低延遲），中間用 materialization 橋接。接著疊上「特徵分級」這一層，把特徵按變動速度分成慢／中／快三級，分別對應批次、串流、request-time 三種計算策略。
3. **深入核心**：技術上最關鍵的 trade-off 是「追新鮮度的邊際成本遠不是線性的」——從天級批次升到小時級批次,成本增加有限;但從小時級批次升到秒級串流,要多維護一整套 CDC 或 streaming 基礎設施,還要處理串流系統本身的容錯跟回補(backfill)問題。第二個 trade-off 是 point-in-time correctness 的工程成本——as-of join 在資料量大時很貴,需要在離線批次系統裡做好索引跟分區,不是隨手一個 SQL JOIN 就能解決。
4. **收尾**：給出具體分級決策,而不是用單一架構打包全部特徵。比如「使用者 profile 這類慢變動特徵用天級批次跑進 Redis-compatible 的 in-memory store;過去七天行為聚合用小時級批次;但風控模型需要的『這筆交易當下的裝置指紋』,我會放在 request-time 當場算,不經過 materialization,因為那類特徵本質上就是這次請求才存在的資料」,用具體分級跟數字收尾,讓考官感覺你真的想過成本曲線,不是背出 offline／online 兩個名詞就結束。

### 範例回答（面試時可以這樣講）

> 我會先確認有哪些模型要用這個 feature store、各自的延遲預算,還有公司現有的資料基礎設施——如果已經有資料倉儲跟排程系統,offline store 這一層就不用重新發明。**架構上**我會分兩層:offline store 接在資料倉儲上(資料量在 TB 級以內的話,DuckDB 這類嵌入式分析引擎其實夠用,不用一開始就上大型分散式查詢引擎),作為訓練用的真相來源,每筆特徵都帶 event_timestamp,訓練時用 as-of join 避免偷看未來的資料;online store 用 Redis 相容的記憶體內資料庫,扛線上推論的隨機讀取,壓在個位數毫秒的延遲。
>
> **新鮮度的部分是這題真正的重點**:我不會把所有特徵都做成即時串流,因為那會讓維運成本跟容錯複雜度一次性跳一大階。我會先按變動速度分級——使用者的靜態 profile 用天級批次 materialize;中速變動的行為聚合用小時級批次;只有真正需要秒級新鮮度、且業務價值撐得起那套維運成本的特徵(像風控模型要的即時裝置特徵),才投資串流 pipeline,甚至直接在 request-time 當場算,完全不經過 materialization。**收尾**我會提到 materialization 的排程週期本身就是新鮮度的硬上限,如果業務發現某個特徵的新鮮度不夠,第一步永遠是先問「這個特徵真的需要多新鮮」,而不是預設把整套系統升級成串流架構。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 區分 offline store（訓練、point-in-time correctness）跟 online store（serving、低延遲）各自的設計目的 | |
| 說明 materialization 是連接兩者的機制，也是新鮮度上限的來源 | |
| 提到 point-in-time correctness／event_timestamp 怎麼避免訓練資料洩漏 | |
| 按特徵變動速度分級，不是所有特徵都套用同一套新鮮度策略 | |
| 給出具體的基礎設施選型（批次倉儲、串流管線、記憶體內資料庫）跟對應成本量級 | |
| 加分項：提到用現有的 Redis 相容記憶體內資料庫同時扛 feature serving 跟一般快取，降低維運複雜度 | |

## 延伸閱讀

- [Building a Feature Store with Feast, DuckDB, and Dragonfly](https://dragonflydb.io/blog/building-a-feature-store-with-feast-duckdb-and-dragonfly) — 用 Feast 實際接 DuckDB（offline）跟 Dragonfly（online）的完整程式碼範例，含 event_timestamp 跟 materialization 的實作細節
- [Machine Learning Engineer Onsite Interview: Round by Round](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — MLE onsite 全流程拆解，ML system design 回合的八步框架在這篇有完整表格
- [spector-ai Machine Learning Engineer Interview: Questions & Prep](https://knok.work/blog/spector-ai-machine-learning-engineer-interview.html) — 今日練習題的原始來源，另收錄多道 AI 公司常問的 production ML 問題

## 參考資料

- [spector-ai Machine Learning Engineer Interview: Questions & Prep](https://knok.work/blog/spector-ai-machine-learning-engineer-interview.html) — 今日練習題「從零設計 feature store，新鮮度跟成本怎麼取捨」的原始來源
- [Building a Feature Store with Feast, DuckDB, and Dragonfly](https://dragonflydb.io/blog/building-a-feature-store-with-feast-duckdb-and-dragonfly) — 「offline／online store 分工」「point-in-time correctness」「materialization」三個核心概念的技術細節來源
- [Machine Learning Engineer Onsite Interview: Round by Round](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — ML system design 回合結構與時間分配的背景補充
