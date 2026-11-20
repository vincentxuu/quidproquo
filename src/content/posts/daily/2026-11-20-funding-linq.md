---
title: "融資速報｜Linq 新一輪 $90M（a16z 領投，Ben Horowitz 進董事會）"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, funding, daily, linq, agent-infrastructure]
lang: zh-TW
description: "AI agent 通訊基礎設施商 Linq 完成 $90M 新一輪融資，Andreessen Horowitz 領投，Ben Horowitz 親自進董事會，累計處理訊息數突破 10 億則"
tldr: "Linq 完成 $90M 新一輪融資，由 Andreessen Horowitz 領投，外部報導推估估值達 $1B（公司未確認）。這筆錢代表 agent 基礎設施的競爭正往底層通訊管道（訊息、語音、電腦操作）蔓延。"
series:
  name: "AI Agent Funding"
  order: 145
---

> :globe: [English version](/posts/daily/2026-11-20-funding-linq-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Linq（美國，舊金山） |
| 輪次 | 新一輪融資（Dealroom 等媒體推估為 Series B，公司官方新聞稿未標示輪次名稱） |
| 金額 | $90M |
| 領投 | Andreessen Horowitz |
| 跟投 | TQ Ventures、Mucker Capital、Abstract、Anthos、Left Lane Capital |
| 估值 | 外部推估 $1B（Dealroom 報導，:warning: 公司未確認） |
| 累計融資 | 官方未揭露精確總額；2026 年 2 月 Series A $20M（TQ Ventures 領投）＋本輪 $90M，媒體估計總額逾 $120M |
| 成立年份 | 未揭露（創辦人為前 Shipt 高層） |
| 員工數 | 未揭露 |

## 這家公司做什麼

Linq 是做 AI agent 通訊基礎設施的公司——幫開發者打造能用「人類慣用的工具」完成人類工作的 agent，讓 agent 透過 iMessage、RCS、SMS 與語音直接跟使用者對話、動手把事情做完。

公司最早是數位名片與 CRM 自動化平台，後來轉向 AI agent 的通訊基礎設施層，目前產品涵蓋三塊：Messaging（已處理超過 10 億則訊息，是 DoorDash 等上百家企業的訊息供應商）、Computer use（讓 agent 取得實體運算基礎設施、操作軟體完成任務）、HD Calling for Agents（替 agent 加上語音通話能力）。Linq 也是 Apple Messaging Service Provider，這讓它成為少數能讓企業在 iMessage 這個管道上部署客服 agent 的基礎設施商。

目前客戶包括 DoorDash、Town、Tomo 等上百家企業，DoorDash 用 Linq 讓顧客在同一則訊息串裡找餐點、組購物車、結帳。公司未公開收入數字，但以「10 億則訊息」的量級推算，使用規模已達一定門檻。在 agent 基礎設施這個子領域，Linq 跟 E2B、Modal 等沙箱運算基礎設施商的方向不同——它專注的是 agent 與人類溝通的介面層，而不是 agent 的程式執行環境。

## 這筆融資的信號

### 對 Agent 生態的意義

資金將用於持續投資訊息基礎設施，並透過自有軟體、硬體基礎設施與策略夥伴關係擴大產品線。這代表「agent 基礎設施」這個賽道正在往更底層、更具通路壟斷性的通訊管道蔓延——重點不只是誰能呼叫哪個模型，而是誰能讓 agent 像人一樣發短訊、打電話、操作螢幕,完成原本要靠人類介面才能做的事。

### 投資人在賭什麼

Andreessen Horowitz 合夥人 Ben Horowitz 親自進董事會，他的說法是「agent 要像人一樣溝通、也要像人一樣把事情做完」，這跟 a16z 過去押注 agent 基礎設施的邏輯一致（它同時也是 Boltz 的早期投資人之一）。9 個月內單輪募資規模從 $20M 放大到 $90M，顯示投資人認為通訊層的 agent 基礎設施已經從「概念驗證」走到「規模化擴張」階段。

```diagram
title: Linq 兩輪募資規模對比
desc: Linq 在 2026 年 2 月的 Series A 為 $20M，到 2026 年 11 月新一輪已放大到 $90M，9 個月內成長 4.5 倍。
caption: 9 個月內單輪募資規模放大 4.5 倍。換算：k≈3.5px/$M，條寬依金額等比例繪製。數字來自 Linq 官方新聞稿（PRNewswire，2026-11-19）與 FinSMEs。
---
<svg viewBox="0 0 640 200">
  <text class="dg-small" x="40" y="24" dominant-baseline="central">單輪募資金額（$M）</text>
  <line class="dg-grid" x1="40" y1="40" x2="40" y2="160"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="52" width="70" height="36"/>
    <text class="dg-sub" x="118" y="70" dominant-baseline="central">Series A $20M（2026-02）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="40" y="108" width="315" height="36"/>
    <text class="dg-label dg-text--accent" x="363" y="126" dominant-baseline="central">新一輪 $90M（2026-11）</text>
  </g>

  <line class="dg-axis" x1="40" y1="40" x2="40" y2="160"/>
</svg>
```

### 值得觀察的數字

- 累計處理超過 10 億則訊息，是目前 agent 通訊基礎設施賽道裡最大的量化指標之一。
- 9 個月內單輪募資規模放大 4.5 倍（$20M → $90M），資金集中在「驗證後加速」階段，不是早期探索。
- Dealroom 報導的 $1B 估值未經 Linq 證實，若屬實代表公司在不到一年內從 Series A 走到準獨角獸，但這個數字本身是外部推估，需要標註為未確認。

## Watchlist 狀態

Linq 尚未在 watchlist 中。建議加入 section C4（Computer use / agent 與人類互動基礎設施）或新增「agent 通訊基礎設施」子類，追蹤重點：messaging、computer use、語音通話三合一的 agent 基礎設施，a16z 領投，累計處理訊息數突破 10 億則。

## 今日收穫

這輪募資讓人意外的不是金額，而是 Linq 從「數位名片工具」轉型成 agent 通訊基礎設施商的路徑——它提醒我們在 agent 基礎設施這場競賽裡，誰先掌握人類早已習慣的溝通管道（iMessage、電話），可能比誰的模型更聰明更關鍵。

## 參考資料

- [Linq Raises $90 Million in New Funding Led by Andreessen Horowitz to Build the Infrastructure Platform for AI Agents - PR Newswire](https://www.prnewswire.com/news-releases/linq-raises-90-million-in-new-funding-led-by-andreessen-horowitz-to-build-the-infrastructure-platform-for-ai-agents-302944728.html)
- [Linq Raises $90M in Funding - FinSMEs](https://www.finsmes.com/2026/11/linq-raises-90m-in-funding.html)
