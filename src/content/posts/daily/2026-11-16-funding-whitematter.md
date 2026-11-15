---
title: "融資速報｜WhiteMatter Series A $20M（Blumberg Capital 領投，前身 QuilrAI）"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, funding, daily, whitematter, agent-security]
lang: zh-TW
description: "企業 AI agent 治理公司 WhiteMatter（前身 QuilrAI）完成 $20M Series A，由 Blumberg Capital 領投，用「每個 agent 配一個守衛 agent」的架構搶佔已經擠滿玩家的 agent 安全市場"
tldr: "WhiteMatter（前身 QuilrAI）完成 $20M Series A，由 Blumberg Capital 領投，Crew Capital、Sprout & Oak 跟投。這筆錢代表的訊號：agent 安全市場的玩家還在用「改名重新出發＋秀規模數字」搶位置，WhiteMatter 的賭注是用 agent 治理 agent，而不是外部監控事後補救。"
series:
  name: "AI Agent Funding"
  order: 138
---

> 🌏 [English version](/posts/daily/2026-11-16-funding-whitematter-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | WhiteMatter（美國，舊金山／奧斯汀；前身 QuilrAI） |
| 輪次 | Series A |
| 金額 | $20M |
| 領投 | Blumberg Capital |
| 跟投 | Crew Capital、Sprout & Oak（既有投資人） |
| 估值 | 未揭露 |
| 累計融資 | 未完整揭露（已知至少 $20M，含更早期種子輪但金額未公布） |
| 成立年份 | 2024 年（原名 QuilrAI） |
| 員工數 | ~80 人，計劃 12 個月內成長 50%（Business Insider 報導） |

## 這家公司做什麼

WhiteMatter 是做企業 AI agent 治理與安全的公司——主張傳統企業安全架構是為「人」和「可預期的軟體」設計的,管不住會自己做決定、跨系統移動、甚至衍生新 agent 的自主行為者。

產品架構是幫企業部署的每一個 AI agent,配一個對應的「Guardian agent」,在 agent 真正執行動作之前先做政策檢查,涵蓋端點、瀏覽器、SaaS、雲端、程式碼等所有 agent 可能出現的位置。這和多數同業「從外部監控、事後偵測並升級風險」的做法不同——WhiteMatter 把管控點放在部署前的治理與驗證,而不是只靠執行時的事後攔截。Guardian agent 不消耗客戶自己的 token,而是跑在 WhiteMatter 自建的模型與 GPU 上,收費方式是依「受管理 agent 數」(agents under management, AUM)計價的固定費率。

目前客戶包括 Sentara Health、Alter Domus、New American Funding、Concentrix 等多家 Fortune 500 企業。公司自報 2026 年客戶數成長三倍、過去半年營收成長五倍、淨營收留存率約 200%、零客戶流失;目前管理超過 225 萬個 agent、累計治理超過 1,160 億次 AI 互動,預估年底前管理的 agent 數會超過 550 萬——這些都是公司自報數字,未經第三方驗證。

## 這筆融資的信號

### 對 Agent 生態的意義

這是 2026 年下半年 agent 安全領域又一筆 Series A(同期還有 Bay 的 $50M、Rein Security 的 $25M、Zenity 的 $125M),顯示資本仍持續湧入這個已經擠滿玩家的子領域。WhiteMatter 自己列出的直接對手包括 Onyx Security、Zenity、Noma——意味著未來一年的競爭重點不是「要不要做 agent 安全」,而是「用什麼架構做」:事後監控、執行時攔截,還是像 WhiteMatter 一樣把治理往部署前推。資金計劃用在研發、go-to-market 擴編,以及高階主管團隊的大幅投資。

### 投資人在賭什麼

Blumberg Capital 合夥人 Pramod Gosavi 把這輪投資類比成過去每一波企業運算都會長出自己的安全層——從網路、到雲端、到身分治理,現在輪到 agent。他押注的邏輯是企業裡的 agent 數量很快會超過員工數,需要一個原生為 agent 設計、而非改造現有工具的治理層,而這個規模單靠人工安全團隊管不來。這跟 Lightspeed 投 ZenGuard 的邏輯類似(把 agent 安全視為下一代的基礎設施層),但 WhiteMatter 把賭注押在「用 agent 管 agent」這個更激進的架構選擇上。

### 值得觀察的數字

```diagram
title: Agent 安全領域近期 Series A/B 募資規模對照
desc: WhiteMatter 的 $20M Series A，在近期幾筆 agent 安全募資案裡屬於偏小規模，低於 Rein Security、Bay、Zenity。
caption: 數字來自各公司公開募資公告（Zenity Series C $125M、Bay 合併 Series A+種子輪 $50M、Rein Security Series A $25M、WhiteMatter Series A $20M）。換算：基線 x = 160，每 $1M 約 2.93 單位（同 Bay 文章換算基準），橫軸從 0 起。
---
<svg viewBox="0 0 640 300">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">募資規模（$M）</text>
  <line class="dg-grid" x1="307" y1="40" x2="307" y2="256"/>
  <line class="dg-grid" x1="453" y1="40" x2="453" y2="256"/>
  <text class="dg-small" x="307" y="270" text-anchor="middle">50</text>
  <text class="dg-small" x="453" y="270" text-anchor="middle">100</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="160" y="46" width="366" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="102" width="147" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="158" width="73" height="28"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="160" y="214" width="59" height="28"/>
  <line class="dg-axis" x1="160" y1="40" x2="160" y2="256"/>

  <text class="dg-sub" x="534" y="60" dominant-baseline="central">$125M</text>
  <text class="dg-sub" x="315" y="116" dominant-baseline="central">$50M</text>
  <text class="dg-sub" x="241" y="172" dominant-baseline="central">$25M</text>
  <text class="dg-label dg-text--accent" x="227" y="228" dominant-baseline="central">$20M</text>

  <text class="dg-sub" x="148" y="60" text-anchor="end" dominant-baseline="central">Zenity</text>
  <text class="dg-sub" x="148" y="116" text-anchor="end" dominant-baseline="central">Bay</text>
  <text class="dg-sub" x="148" y="172" text-anchor="end" dominant-baseline="central">Rein Security</text>
  <text class="dg-label dg-text--accent" x="148" y="228" text-anchor="end" dominant-baseline="central">WhiteMatter</text>
</svg>
```

- 決策延遲 2.24 毫秒、每分鐘可處理 7,800 個動作、100 萬次測試中零重複執行——這幾個效能數字是公司用來說明「治理層不會拖慢 agent」的核心論點,但同樣未經第三方驗證。
- 過去 9 個月替客戶節省超過 11 兆 token,這個數字如果成立,代表治理層本身也在做流量與成本優化,而不只是安全攔截。
- $20M Series A 比同期 Bay 的 $50M(含種子輪)、Zenity 的 $125M 小一截,顯示 WhiteMatter 的資本效率路線或投資人信心程度與同業有落差,值得後續輪次再觀察。

## Watchlist 狀態

WhiteMatter 尚未在 watchlist 中。建議加入 section B7(Agent 安全 / 治理 / 資安技術,與 Zenity 同組),追蹤重點：Guardian agent 治理架構、$20M Series A、Blumberg Capital 領投,直接對手 Onyx Security、Zenity、Noma。

## 今日收穫

這是本週第三家揭露「改名重新出發」敘事的 agent 安全新創(QuilrAI → WhiteMatter),搭配規模數字(225 萬 agent、1,160 億次互動)做融資公告——這個模式本身說明一件事:在擠滿同質玩家的子領域,敘事包裝和規模數字正在變成跟技術架構一樣重要的募資籌碼。

## 參考資料

- [WhiteMatter Raises $20M Series A to Close the Growing Gap Between AI Autonomy and Enterprise Governance](https://www.prnewswire.com/news-releases/whitematter-raises-20m-series-a-to-close-the-growing-gap-between-ai-autonomy-and-enterprise-governance-302934477.html)
- [This startup raised $20 million to keep AI agents in line with more AI agents. Read the pitch deck.](https://www.businessinsider.com/whitematter-startup-ai-agent-cybersecurity-funding-pitch-deck-2026-11)
- [WhiteMatter Raises $20 Million in Series A Funding - SecurityWeek](https://www.securityweek.com/whitematter-raises-20-million-in-series-a-funding/)
