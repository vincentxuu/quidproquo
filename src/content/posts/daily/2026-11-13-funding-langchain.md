---
title: "融資速報｜LangChain Series C $300M（估值衝上 $3B，CapitalG 領投）"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, funding, daily, langchain, agent-framework]
lang: zh-TW
description: "Agent 框架公司 LangChain 完成 $300M Series C，估值 13 個月內從 $1.25B 跳到 $3B，CapitalG 領投，資金用於擴大 LangSmith 並擴編團隊"
tldr: "LangChain 完成 $300M Series C，由 Alphabet 旗下 CapitalG 領投，估值 13 個月內從 $1.25B 衝到 $3B，翻了 2.4 倍。這筆錢代表的訊號：資本正從「做 agent 的模型」轉向「管理 agent 的基礎設施」，LangChain 把自己定位成跨模型供應商的中立工具層。"
series:
  name: "AI Agent Funding"
  order: 131
---

> 🌏 [English version](/posts/daily/2026-11-13-funding-langchain-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | LangChain（美國，舊金山） |
| 輪次 | Series C |
| 金額 | $300M |
| 領投 | CapitalG（Alphabet 旗下獨立成長基金） |
| 跟投 | IVP、Sapphire Ventures（既有投資人）、GIC、DFJ Growth（新進） |
| 估值 | $3B（Series B 時為 $1.25B，13 個月內成長 2.4 倍） |
| 累計融資 | 至少 $425M（僅計入 2025 年 10 月 Series B $125M + 這輪 Series C $300M，不含更早期種子與 Series A 金額） |
| 成立年份 | 2022 年 10 月（開源專案起家） |
| 員工數 | 435 人（WSJ 報導），計劃一年內擴編到 850 人 |

## 這家公司做什麼

LangChain 做的是 AI agent 開發工具鏈——核心產品線包括開源框架 LangChain / LangGraph（agent 編排），以及 LangSmith，一個用來監控、評估、部署 agent 的企業平台。

創辦人 Harrison Chase 2022 年 10 月以開源專案起家，2023 年正式成立公司，拿 Sequoia、Benchmark 領投的種子輪與 Series A；2024 年推出 LangSmith，把 observability 和 evaluation 做成可收費的企業產品。目前客戶包括 Workday、Cisco、Cloudflare、Klarna、Rippling、ServiceNow 等，這些企業用 LangChain 的工具自建嵌入式 agent，不必自己重造一套 agent 基礎設施。LangSmith 過去一年的月追蹤（trace）量成長 12 倍，是這輪估值跳升的核心指標之一。

Workday 首席 AI 官 Joel Hellermark 公開表示，Workday 的 agent 平台直接建在 LangGraph 和 LangSmith 上，讓團隊省下重造 agent 基礎設施的工程資源，把力氣放在用自家資料客製模型。

## 這筆融資的信號

### 對 Agent 生態的意義

CapitalG 這輪的邏輯很直白：市場正從「做 agent 的模型」轉向「管理 agent 的基礎設施」——不管哪家模型公司在模型層贏，企業都需要一層獨立於特定供應商的工具，來 build、run、monitor 自己的 agent。LangChain 把自己定位成這層的中立選項，資金將用來擴大 LangSmith，並擴編工程、行銷、銷售團隊。

```diagram
title: LangChain 估值 13 個月內翻 2.4 倍
desc: 2025 年 10 月 Series B 到 2026 年 11 月 Series C，估值與募資規模同步放大 2.4 倍。
caption: 數字來自 LangChain 官方部落格（Series B）與 WSJ 報導（Series C，經 Dealroom、FourWeekMBA 轉引）。
step: 2025 年 10 月：Series B
step: 2026 年 11 月：Series C
---
<svg viewBox="0 0 420 160">
  <rect class="dg-box" x="20" y="52" width="160" height="64" rx="6" data-step="1"/>
  <text class="dg-label" x="100" y="76" text-anchor="middle" dominant-baseline="central" data-step="1">Series B $125M</text>
  <text class="dg-sub" x="100" y="96" text-anchor="middle" dominant-baseline="central" data-step="1">估值 $1.25B</text>

  <path class="dg-line" d="M180 84H240" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="240" y="52" width="160" height="64" rx="6" data-step="2"/>
  <text class="dg-label" x="320" y="76" text-anchor="middle" dominant-baseline="central" data-step="2">Series C $300M</text>
  <text class="dg-sub" x="320" y="96" text-anchor="middle" dominant-baseline="central" data-step="2">估值 $3B（2.4x）</text>
</svg>
```

### 投資人在賭什麼

CapitalG 合夥人 Mo Jomaa 直言這是「insanely competitive market」——OpenAI、Anthropic、Amazon、Microsoft 都在建自己的 agent 基礎設施，但「每一家都想把你鎖進自己的生態系、模型、基礎設施」。CapitalG 押的正是企業不想被任何一家模型供應商綁死，需要 LangChain 這種跨模型的中立層。這個邏輯和 Google 自家的 Gemini、Vertex AI agent 工具其實存在潛在張力，但 CapitalG 是 Alphabet 獨立運作的成長基金，下注邏輯自成一套。

### 值得觀察的數字

- 估值 13 個月內從 $1.25B 衝到 $3B，成長 2.4 倍，同期募資規模也從 $125M 成長到 $300M，同樣是 2.4 倍——估值倍數完全跟著募資規模走，顯示這階段是「募多少、值多少」的機械式估值，不是營收倍數驅動
- 員工數從 435 人計劃擴編到 850 人（WSJ 報導），一年內 headcount 要翻倍，代表資金有相當一部分要投入招聘而非純研發
- 同一週還有 Daytona（$60M@$1B，agent 測試）與 Temporal（$550M@$12.55B，workflow 平台）等鄰近領域公司完成大輪融資，顯示資本正系統性地往「agent 基礎設施」這個次領域集中，不是 LangChain 單一公司的個案

## Watchlist 狀態

已在 watchlist section B2（Agent 框架/編排），追蹤重點原為「生產最廣」「graph-based」「1.x」。建議更新追蹤重點新增：「估值 13 個月內 2.4 倍跳升、LangSmith 追蹤量年增 12 倍、員工數計劃翻倍到 850 人」，作為觀察 agent 框架競爭格局的指標。

## 今日收穫

LangChain 這輪最有意思的不是估值數字本身，而是募資規模和估值漲幅完全同步放大 2.4 倍——這代表目前 agent 基礎設施的估值邏輯還沒脫離「VC 願意給多少錢就值多少錢」的階段，真正的考驗要等 LangSmith 的企業客戶續約率和擴張率數字公開之後才會出現。

## 參考資料

- [LangChain raises $300M, tripling its valuation to $3B](https://app.dealroom.co/news/note/langchain-raises-300m-tripling-its-valuation-to-3b)
- [LangChain Valued at $3B in CapitalG-Led $300M Round, Up 2.4x](https://fourweekmba.com/ai-langchain-valued-at-3b-in-capitalg-led-300m-round-up-2-4x/)
- [LangChain | Valuation, Funding Rounds & Stock Price](https://www.caplight.com/company/langchain-1)
- [LangChain funding: Every round, investor, and valuation (2026)](https://www.revenuememo.com/p/langchain-funding)
- [LangChain raises $125M to build the platform for agent engineering](https://www.langchain.com/blog/series-b)
