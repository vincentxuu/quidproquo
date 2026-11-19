---
title: "融資速報｜Boltz Series A $110M（Bessemer 領投，累計融資 $138M）"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, funding, daily, boltz, drug-discovery-ai]
lang: zh-TW
description: "MIT 分拆藥物設計 AI 公司 Boltz 完成 $110M Series A，Bessemer Venture Partners 領投，累計融資達 $138M，已與 Pfizer、GSK 等四大藥廠合作"
tldr: "Boltz 完成 $110M Series A，由 Bessemer Venture Partners 領投，累計融資達 $138M。這筆錢代表 AI agent 正從文字與程式碼領域，擴展到需要物理世界實驗驗證的科學發現領域。"
series:
  name: "AI Agent Funding"
  order: 146
---

> 🌏 [English version](/posts/daily/2026-11-20-funding-boltz-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Boltz（MIT 分拆，研發團隊現駐倫敦 King's Cross） |
| 輪次 | Series A |
| 金額 | $110M |
| 領投 | Bessemer Venture Partners |
| 跟投 | Andreessen Horowitz、Amplify Partners、Zetta Venture Partners、Obvious Ventures（既有投資人）；Greycroft、F-Prime Capital、Hummingbird、Benchling（新加入）；Nvidia 已於年初投資 |
| 估值 | 未揭露 |
| 累計融資 | $138M（Seed $28M → Series A $110M） |
| 成立年份 | 2025 年 |
| 員工數 | 約 40 人（The Pharma Letter） |

## 這家公司做什麼

Boltz 是做 AI 分子設計模型的公司——用 AI 模型預測蛋白質與候選藥物分子如何結合、估計結合強度，並提出新的候選分子，幫藥廠和生技公司決定哪些候選藥物值得送進實驗室測試。

核心技術源自 MIT，共同創辦人在校期間發布的開源模型 Boltz-1、Boltz-2，效能可比擬 DeepMind 的 AlphaFold3，現已是許多藥物發現團隊的預設工具之一。商業模式不是自己下場做藥物研發管線，而是把運算能力包裝成「分子代幣」（molecular tokens）依使用量計價，同時提供開源模型與自家平台 API 兩條路徑。2026 年初推出的 agent 功能，讓科學家能用 agentic workflow 處理 de novo 蛋白質設計、小分子 hit discovery 這類複雜任務，再交給 wet lab 夥伴驗證。

目前已與 Pfizer、GSK、Takeda、Bristol Myers Squibb 等藥廠建立合作，其中與 Pfizer 是多年期夥伴關係，讓 Pfizer 全體科學家都能使用 Boltz Lab 與其 agent。公司稱過去一年 AI 使用量成長 50 倍，但未公開具體營收數字。

## 這筆融資的信號

### 對 Agent 生態的意義

Boltz 這輪的重點不只是分子設計模型，而是 agent 的應用邊界在擴張：AI agent 正從「文字、程式碼」領域，走向「需要物理世界實驗驗證」的科學發現領域——agent 不只是查文獻、算結構，還要能設計實驗、交給實體實驗室執行、再從結果中學習調整下一輪設計。

### 投資人在賭什麼

Bessemer 這輪領投，而 Andreessen Horowitz、Amplify Partners 等種子輪投資人全部跟進加碼，說明這群投資人看中的不是單一輪次的估值跳升，而是「開源模型建立技術標準 → 商業化平台變現」這條路徑能不能延續。Nvidia 也在今年稍早 Jensen Huang 訪英期間投資該公司，顯示算力供應商本身也在押注 AI 驅動的藥物發現會是下一個運算密集的大客戶群。

```diagram
title: Boltz 兩輪募資規模對比
desc: Boltz 在 2026 年初以 $28M 種子輪起步，不到一年後的 Series A 已達 $110M，放大近 4 倍。
caption: 不到一年內兩輪募資規模放大近 4 倍。換算：k≈3.18px/$M。數字來自 Tech.eu（2026-11-19）與歐洲生技媒體 European Biotechnology 報導彙整官方公告。
---
<svg viewBox="0 0 640 200">
  <text class="dg-small" x="40" y="24" dominant-baseline="central">單輪募資金額（$M）</text>
  <line class="dg-grid" x1="40" y1="40" x2="40" y2="160"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="52" width="89" height="36"/>
    <text class="dg-sub" x="137" y="70" dominant-baseline="central">Seed $28M（2026 年初）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="40" y="108" width="350" height="36"/>
    <text class="dg-label dg-text--accent" x="398" y="126" dominant-baseline="central">Series A $110M（2026-11）</text>
  </g>

  <line class="dg-axis" x1="40" y1="40" x2="40" y2="160"/>
</svg>
```

### 值得觀察的數字

- 不到一年內兩輪募資從 $28M 跳到 $110M，放大近 4 倍，但估值始終未揭露，跟多數同期 AI 公司大方公布估值的做法不同。
- 公司自稱 AI 使用量年增 50 倍，但沒有對應的營收或客戶數佐證，屬於單一自報指標。
- 團隊規模僅約 40 人卻已拿下 4 家前 20 大藥廠合作，人均合作密度明顯高於同業。

## Watchlist 狀態

Boltz 尚未在 watchlist 中。建議加入新 section（AI for Science / 藥物發現 agent），追蹤重點：agentic workflow 用於蛋白質設計與小分子發現、Pfizer 等藥廠深度合作、Bessemer 領投 Series A。

## 今日收穫

Boltz 的商業模式選擇值得注意——它沒有像多數 AI 藥物發現公司一樣自己下場做候選藥物管線賺取里程碑金和權利金,而是賣「算力＋模型」這種更像基礎設施商的生意。這代表在 AI 藥物發現這個領域，「誰擁有最好的模型」和「誰真正把藥做出來」正在分成兩種不同的商業模式，Boltz 賭的是前者能先規模化。

## 參考資料

- [London-based Boltz raises $110M Series A - Tech.eu](https://tech.eu/2026/11/19/london-based-boltz-raises-110m-series-a/)
- [Boltz raises $110m after 50-fold surge in AI usage - European Biotechnology](https://european-biotechnology.com/latest-news/boltz-raises-110m-after-50-fold-surge-in-ai-usage/)
