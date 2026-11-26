---
title: "融資速報｜Sierra Series F $1.75B，估值半年翻倍衝上 $30B"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, funding, daily, sierra, cx-agent]
lang: zh-TW
description: "客服 AI Agent 公司 Sierra 完成 $1.75B Series F，由 Greenoaks 與 Lightspeed 領投，估值半年內從 $15.8B 翻倍到 $30B，年化營收突破 $400M"
tldr: "Sierra 完成 $1.75B Series F，由 Greenoaks、Lightspeed 領投，估值半年翻倍到 $30B，ARR 已破 $400M。這筆錢代表的信號是：客服 Agent 的頭部效應正在加速拉開，Sierra 的成長速度已經超越多數同賽道對手。"
series:
  name: "AI Agent Funding"
  order: 153
---

> :globe: [English version](/posts/daily/2026-11-24-funding-sierra-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Sierra（美國，舊金山） |
| 輪次 | Series F |
| 金額 | $1.75B |
| 領投 | Greenoaks Capital、Lightspeed Venture Partners |
| 跟投 | Benchmark、Sequoia、GV、Tiger Global（既有投資人回投） |
| 估值 | $30B（2026/5 為 $15.8B，半年翻倍；2025/9 為 $10B） |
| 累計融資 | 約 $3.34B |
| 成立年份 | 2024 |
| 員工數 | ~1,300 人（TipRanks，截至 2026/11/23） |

## 這家公司做什麼

Sierra 是幫企業打造客服 AI Agent 的平台公司，由前 Salesforce 共同 CEO Bret Taylor 和前 Google 高管 Clay Bavor 在 2024 年初創立。

核心產品讓企業自己設計、部署客服 Agent，處理電話與訊息客服，串接企業既有系統代替人類完成任務（退款、改約、理賠等）。Sierra 用 OpenAI、Anthropic、Meta 等多個生成式 AI 模型組成的「constellation」架構互相檢查結果、降低幻覺，也讓企業能客製化 Agent 的「人格」符合品牌調性。定價模式是按結果收費（解決一個問題、完成一筆理賠），不是按席位或 token 計費——這個模式現在也被 Zendesk 跟進。

目前客戶包含近半數 Fortune 50 企業，包括 BNY、HSBC、Singtel、Wells Fargo、JPMorganChase、Pearson、Next、Cox Automotive，以及 SoFi、Ramp、Brex。保險公司 Guardian 把一年 100 萬筆牙科理賠電話交給 Sierra 處理，Agent 現在也能透過 Stripe 直接受理信用卡付款。ARR 在 10 月突破 $400M，從公司成立到現在只花了兩年半。

```diagram
title: Sierra 估值四輪變化：$4.5B → $30B
desc: Sierra 的估值從 2024 年 10 月的 $4.5B，兩年內漲到 2026 年 11 月的 $30B，最新一輪半年內就翻倍。
caption: 資料來源：TechCrunch（2024/10、2025/9、2026/11 報導）、TheNextWeb（2026/11 報導，披露 2026/5 估值 $15.8B）。換算：基線 y=300，每 $1B 對應 7.5 單位，縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">估值（$B）</text>
  <line class="dg-grid" x1="72" y1="75" x2="612" y2="75"/>
  <line class="dg-grid" x1="72" y1="188" x2="612" y2="188"/>
  <text class="dg-small" x="64" y="75" text-anchor="end" dominant-baseline="central">30</text>
  <text class="dg-small" x="64" y="188" text-anchor="end" dominant-baseline="central">15</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="148" y="266" width="64" height="34"/>
    <rect class="dg-bar dg-bar--soft" x="256" y="225" width="64" height="75"/>
    <rect class="dg-bar dg-bar--soft" x="364" y="181" width="64" height="119"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="472" y="75" width="64" height="225"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="180" y="256" text-anchor="middle" dominant-baseline="central">4.5</text>
  <text class="dg-sub" x="288" y="215" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-sub" x="396" y="171" text-anchor="middle" dominant-baseline="central">15.8</text>
  <text class="dg-label dg-text--accent" x="504" y="65" text-anchor="middle" dominant-baseline="central">30</text>

  <text class="dg-sub" x="180" y="320" text-anchor="middle" dominant-baseline="central">2024/10</text>
  <text class="dg-sub" x="288" y="320" text-anchor="middle" dominant-baseline="central">2025/9</text>
  <text class="dg-sub" x="396" y="320" text-anchor="middle" dominant-baseline="central">2026/5</text>
  <text class="dg-label dg-text--accent" x="504" y="320" text-anchor="middle" dominant-baseline="central">2026/11</text>
</svg>
```

## 這筆融資的信號

### 對 Agent 生態的意義

這輪資金將用來擴充技術堆疊，讓客服 Agent 疊更多層次的服務能力，並加速招募銷售團隊搶快簽下企業合約。更值得注意的是 Sierra 正在和 Meta、Stripe、Walmart 一起定義 Agent 間溝通的協定，這代表客服 Agent 的競爭已經不只是「誰的模型準」，而是誰能先把「Agent 跟企業系統對話的標準」訂下來，卡住生態位。

### 投資人在賭什麼

領投的 Greenoaks 和 Lightspeed，加上回投的 Benchmark、Sequoia、GV、Tiger Global，幾乎是矽谷早期投資 AI 的全明星陣容連續加碼同一家公司四輪以上——Greenoaks 從 2024 年 10 月那輪就開始領投，一路加碼到現在，說明的是「押對賽道後持續加倉」而非到處撒錢賭風口。這輪估值 $30B 剛好卡在 Anthropic 上市後第一週，共同創辦人 Bret Taylor（同時也是 OpenAI 董事會主席）在部落格裡直接點名 Anthropic 的 IPO 作為 AI 不是泡沫的證據——這輪募資本身也像是在幫整個產業的敘事背書。

### 值得觀察的數字

- 估值半年翻倍：2026/5 的 $15.8B → 2026/11 的 $30B，比前一段（2025/9 到 2026/5，從 $10B 到 $15.8B，漲 58%）的速度更快。
- ARR $400M 對應 $30B 估值，約 75 倍營收倍數，遠高於同賽道 ElevenLabs（$22B）、Decagon（$4.5B）等競品的量級，顯示市場把 Sierra 定義成「客服 Agent 的頭部贏家」而非眾多玩家之一。
- 累計融資兩年半內從 2024/2 的 $110M 種子輪衝到 $3.34B，四輪估值全部上修，沒有一輪下修。

## Watchlist 狀態

Sierra AI 已在 watchlist section D1（客服/CX），原追蹤重點為「Bret Taylor 的 CX 平台」與「$10B 估值」。建議更新為：估值 $30B、ARR $400M，以及正在和 Meta、Stripe、Walmart 共同制定的 Agent 通訊協定進展——後者可能比估值數字本身更值得持續追蹤。

## 今日收穫

多數客服 Agent 新創還在拼「準確率」跟「客製化」，Sierra 已經在打下一場仗——定義 Agent 彼此對話、跟企業系統對話的協定標準。先把協定訂下來，之後所有照著協定走的 Agent 都要經過你的地盤，這比單純賣一個客服機器人的護城河深得多。

## 參考資料

- [Sierra doubles valuation to $30B within six months as demand for AI in CX takes off](https://techcrunch.com/2026/11/23/sierra-doubles-valuation-to-30b-within-six-months-as-demand-for-ai-in-cx-takes-off/)
- [Sierra raises $1.75B at a $30B valuation for AI customer service agents](https://thenextweb.com/news/sierra-1-75b-series-f-30b-valuation-ai-agents)
- [Bret Taylor's Sierra raises $350M at a $10B valuation](https://techcrunch.com/2025/09/04/bret-taylors-sierra-raises-350m-at-a-10b-valuation)
- [Bret Taylor's customer service AI startup just raised $175M](https://techcrunch.com/2024/10/28/bret-taylors-customer-service-ai-startup-just-raised-175m)
