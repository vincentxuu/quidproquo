---
title: "融資速報｜LanceDB Series B $57.5M（Bessemer／Innovation Endeavors 領投）"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, funding, daily, lancedb, vector-database]
lang: zh-TW
description: "多模態 AI 訓練資料平台 LanceDB 完成 $57.5M Series B，由 Bessemer Venture Partners 與 Innovation Endeavors 領投，客戶含 Netflix、Microsoft AI、Runway，未揭露估值"
tldr: "LanceDB 完成 $57.5M Series B，由 Bessemer Venture Partners 與 Innovation Endeavors 領投，累計融資來到 $98.5M，未揭露估值。這筆錢代表的訊號：當 agent 與多模態模型的訓練規模暴增，餵資料給 GPU 的「data layer」本身開始變成值得單獨投資的基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 141
---

> :globe: [English version](/posts/daily/2026-11-18-funding-lancedb-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | LanceDB（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $57.5M |
| 領投 | Bessemer Venture Partners、Innovation Endeavors |
| 跟投 | Theory Ventures、Dimension、Swift Ventures、CRV、Y Combinator |
| 估值 | 未揭露 |
| 累計融資 | $98.5M（Series A 時約 $41M，2025 年 6 月） |
| 成立年份 | 2022 年 |
| 員工數 | 約 35 人（Y Combinator 公司檔案，募資前統計） |

## 這家公司做什麼

LanceDB 是做多模態 AI 訓練資料平台的公司——核心主張是現在的模型訓練卡在「資料散落在不同系統裡」，研究團隊光是把一次訓練所需的影像、影片、感測器資料兜齊,就要耗掉好幾週到好幾個月。

技術建立在自家開源格式 Lance 上:傳統分析格式針對整表讀寫優化,Lance 則支援對單筆紀錄的高速檢索與修改,同時把結構化欄位和影像、影片等大型檔案放在同一張表裡。LanceDB 在這個格式上蓋了一層多模態 lakehouse,資料留在客戶自己的雲端儲存裡不用搬移,系統可以單表撐住數百 PB 資料、單表超過 400 億個向量,每秒處理超過 13 萬次請求、P95 延遲低於 210 毫秒。

目前客戶包括 Netflix(拿它建內容生產的媒體資料湖)、Microsoft AI(用它作為訓練數十億筆影像與程式碼資料的 data layer)、Runway、Luma AI 與 Midjourney。Runway CTO Kamil Sindi 提到團隊 2024 年開始用 Lance 格式,是當時唯一能同時處理非結構化資料、欄位增補、分散式讀取與 ad-hoc SQL 查詢的方案,之後進一步升級成 LanceDB Enterprise 客戶。

## 這筆融資的信號

### 對 Agent 生態的意義

LanceDB 官方部落格這次特別點名「agent」:新一輪資金要支援的場景之一,是讓研究者與他們的 agent 能在同一個系統裡管理訓練資料、context、log 與 rollout,並行跑大量 agentic 實驗而不污染共用資料集。這代表「資料層」正在從單純的模型訓練基礎設施,延伸成 agent 大規模平行實驗時需要的記憶體與追蹤層——CrewAI 已經拿 LanceDB 取代原本的雙系統記憶體架構,目前支撐它 1,200 萬次月下載、超過 20 億次 agent 執行。

### 投資人在賭什麼

領投方 Bessemer Venture Partners 的邏輯很直接:合夥人 Mike Droesch 把創辦人 Chang She 與 Lei Xu 定位成「做了近二十年核心資料基礎設施」的團隊(Chang She 是 pandas 的原始作者之一),押注的是「訓練多模態資料」會是 AI 基礎設施下一個必須單獨解決的層,就像當年向量資料庫從「資料庫的一個功能」獨立成一個類別。LanceDB 沒有揭露這輪估值,但從 Netflix、Microsoft AI、NVIDIA Cosmos 這類客戶的採用深度來看,投資人賭的不是「哪家公司最會行銷」,而是哪家公司已經卡進大型 AI 實驗室的訓練 pipeline 裡,轉換成本夠高。

### 值得觀察的數字

```diagram
title: LanceDB 從 Series A 到 Series B 的成長幅度
desc: 累計融資倍數不到 2.5 倍，但營收成長超過 10 倍、開源下載成長 6 倍——募資規模遠遠跟不上採用速度。
caption: 數字來自 LanceDB 官方部落格（2026-11-17）。
---
<svg viewBox="0 0 640 280">
  <text class="dg-small" x="24" y="24" dominant-baseline="central">Series A（2025-06）→ Series B（2026-11）成長倍數</text>
  <line class="dg-grid" x1="24" y1="44" x2="24" y2="256"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="24" y="56" width="58" height="36"/>
    <text class="dg-sub" x="90" y="74" dominant-baseline="central">累計融資：2.4x（$41M → $98.5M）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="24" y="112" width="240" height="36"/>
    <text class="dg-label dg-text--accent" x="272" y="130" dominant-baseline="central">年營收：10x+（公司自報）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="24" y="168" width="144" height="36"/>
    <text class="dg-label dg-text--accent" x="176" y="186" dominant-baseline="central">開源下載累計：6x（120M+ 次）</text>
  </g>

  <line class="dg-axis" x1="24" y1="44" x2="24" y2="256"/>
</svg>
```

- 累計融資只成長 2.4 倍,但年營收成長超過 10 倍、開源下載量成長 6 倍——成長曲線明顯比募資曲線更陡,顯示這輪募資偏向「補基礎設施缺口」而非「燒錢換成長」。
- 單表能撐超過 400 億個向量、每秒 13 萬次請求,這兩個數字是公司自報的系統規格,沒有第三方 benchmark 可對照,但符合 Netflix、Microsoft AI 這類大型客戶的採用規模量級。
- 這輪沒有揭露估值,是目前整理到的融資速報裡少數「估值不透明」的案例,與同期多數 AI agent 公司高調公布估值倍數的作法形成對比。

## Watchlist 狀態

LanceDB 已在 watchlist section C3(向量資料庫),追蹤重點更新為:從向量檢索延伸成多模態訓練資料 lakehouse,並開始明確把「agent 平行實驗的資料隔離」列為產品場景之一。

## 今日收穫

多數 AI agent 融資新聞都在比估值倍數,但 LanceDB 這輪反過來——不揭露估值,只攤開營收與下載量的成長曲線。當一家基礎設施公司的客戶名單已經是 Netflix、Microsoft AI、NVIDIA 等級,「要不要秀估值」本身也變成一種訊號:產品力夠硬時,估值反而不是說服投資人或市場的必要籌碼。

## 參考資料

- [LanceDB Raises $57.5M as AI Research Outgrows the Modern Data Stack](https://www.lancedb.com/blog/lancedb-series-b-funding)
- [LanceDB raises $57.5M to accelerate AI model training with multimodal data platform - SiliconANGLE](https://siliconangle.com/2026/11/17/lancedb-raises-57-5m-to-accelerate-ai-model-training-with-multimodal-data-platform/)
- [LanceDB raises nearly $58 million to manage AI training data for Microsoft, Netflix and Runway - MLQ.ai](https://mlq.ai/news/lancedb-raises-nearly-58-million-to-manage-ai-training-data-for-microsoft-netflix-and-runway/)
