---
title: "融資速報｜Pulley A＋B 輪合計 $64M（Jump Capital／CRV 領投）"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, funding, daily, pulley, proptech-ai]
lang: zh-TW
description: "建築許可審批 AI agent 公司 Pulley 同時公布 $23M Series A 與 $41M Series B，合計 $64M，客戶含 Amazon、Meta、Starbucks"
tldr: "Pulley 同時公布 Series A 與 Series B，合計募得 $64M，由 Jump Capital 與 CRV／Susa Ventures 領投，年度經常性收入年增 5 倍。這筆錢代表 AI agent 正打入高度監管的實體審批領域，靠的是 AI 加人工專家協作，而不是全自動化。"
series:
  name: "AI Agent Funding"
  order: 147
---

> 🌏 [English version](/posts/daily/2026-11-20-funding-pulley-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Pulley（美國） |
| 輪次 | Series A＋Series B（同時公布） |
| 金額 | $64M（$23M Series A ＋ $41M Series B） |
| 領投 | Series B：Jump Capital；Series A：CRV、Susa Ventures |
| 跟投 | Catalyst Investors（Series B） |
| 估值 | 未揭露 |
| 累計融資 | 官方未提供精確累計數字；已知含 2023 年 $4.4M 種子輪＋本次 $64M |
| 成立年份 | 約 2020 年（PitchBook） |
| 員工數 | 約 80 人，其中 75 人為持照許可專家（TrueUp 估計；公司自稱團隊含 75 名 licensed experts） |

## 這家公司做什麼

Pulley 是做建築開發許可（permitting）AI 自動化的公司——用 AI agent 搭配持照專家團隊，幫企業把蓋房子、開店、建工廠前要跑的審批流程，從動輒數月甚至數年壓縮到幾天。

核心產品是「AI 原生許可服務」，結合深度許可法規知識與專屬法規情報，已覆蓋全美 50 州、超過 2000 個城市與郡的私人審查項目（可直接代替地方政府核准建築圖審查）。平台讓 75 名持照專家與 AI agent 協作：AI agent 處理法規比對、審批策略草擬、建築圖審查初篩，專家負責最終判斷並跟地方政府協調——客戶典型只需經過一輪地方政府意見回覆，其中逾 40% 案件完全沒有被要求補件。

目前客戶包括 Amazon、Starbucks、JLL、Equinix、Meta 等大型零售、餐飲、銀行、製造業與雲端業者，已協助省下 11,750 週的專案等待時間，涵蓋總值 $210 億的商業建案。年度經常性收入（ARR）年增 5 倍。

## 這筆融資的信號

### 對 Agent 生態的意義

Pulley 這輪的重點是把 AI agent 用在一個此前幾乎沒人用 AI 碰過的領域——實體世界的法規審批，而且不是取代人，是讓 AI agent 跟持照專家協作分工。資金將用於擴大許可服務，並推出新產品幫客戶在「選地點、決定蓋什麼、怎麼通過審批」這幾個更早期的決策環節也導入 AI。

### 投資人在賭什麼

Jump Capital 合夥人 Sach Chitnis 的邏輯是 Pulley 把「長期破碎、仰賴人力」的工作變成可規模化的科技產品，而且情報層會隨案件愈多愈聰明——這跟許多 agent 基礎設施投資人看中的「數據複利」邏輯一致。CRV、Susa Ventures 從更早的種子輪就跟到現在，代表這類垂直深度行業 know-how 加 AI 的公司，早期投資人傾向持續加碼，而不是被後期大型基金取代。

```diagram
title: Pulley 客戶審查意見年減 65%
desc: 用同一批客戶的建案審查意見次數比較，2026 年比 2025 年同期減少 65%，是少數有具體量化證據支持「模型隨使用量變聰明」的 agent 垂直應用案例。
caption: 示意比例取自 Pulley 官方新聞稿（Business Wire，2026-11-18）自報數字,未經第三方審計。基線 100% 代表 2025 年同期審查意見次數。
---
<svg viewBox="0 0 640 180">
  <text class="dg-small" x="40" y="24" dominant-baseline="central">建案審查意見次數（以 2025 年同期＝100%）</text>
  <line class="dg-grid" x1="40" y1="40" x2="40" y2="140"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="52" width="400" height="36"/>
    <text class="dg-sub" x="448" y="70" dominant-baseline="central">2025 年同期 100%</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="40" y="108" width="140" height="36"/>
    <text class="dg-label dg-text--accent" x="188" y="126" dominant-baseline="central">2026 年 35%（减少 65%）</text>
  </g>

  <line class="dg-axis" x1="40" y1="40" x2="40" y2="140"/>
</svg>
```

### 值得觀察的數字

- 專案審查意見比去年同期減少 65%，是少數有明確「模型隨使用量變聰明」量化證據的 agent 垂直應用案例。
- ARR 年增 5 倍，但公司未揭露具體金額，也未提供估值，透明度低於同天公布的其他融資案。
- $64M 這輪由 Series A（$23M）和 Series B（$41M）「同時」公布，暗示 Pulley 可能先完成一輪較小規模的過渡輪，近期才補上大規模資金，實際時間線官方未說明。

## Watchlist 狀態

Pulley 尚未在 watchlist 中。建議加入新 section（垂直產業 AI agent／Proptech），追蹤重點：建築許可審批 agent、$64M A＋B 輪、客戶含 Amazon／Meta 等大型企業。

## 今日收穫

Pulley 沒有把自己包裝成「取代人力的 agent」，而是強調「AI agent 跟持照專家協作」——這提醒我們，在很多高度監管、需要法律責任歸屬的實體世界領域，目前能落地的 agent 應用可能不是全自動化，而是「AI 做大量初篩、人做最終決定」的分工模式，這種模式的護城河可能更深，因為它同時需要 AI 能力和真正的領域專家網路。

## 參考資料

- [Pulley Raises $64M to Accelerate Every Phase of Real Estate Development - Business Wire](https://www.financialcontent.com/article/bizwire-2026-11-18-pulley-raises-64m-to-accelerate-every-phase-of-real-estate-development)
- [Series A funding has skyrocketed in 2026. Founders aren't getting more chances - Fortune](https://fortune.com/2026/11/19/series-a-funding-skyrocketed-2026-founders-arent-getting-more-chances/)
