---
title: "融資速報｜Traversal Series B $120M（AI SRE 搶救生產事故，Kleiner Perkins/Redpoint/Khosla 聯合領投）"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, funding, daily, traversal, ai-sre]
lang: zh-TW
description: "AI SRE 新創 Traversal 完成 $120M Series B，估值來到 $1B，用因果推論 agent 找生產環境事故的真正根因"
tldr: "Traversal 完成 $120M Series B，由 Kleiner Perkins、Redpoint Ventures、Khosla Ventures 聯合領投，估值達 $1B。這筆錢的信號：AI Agent 正從「寫程式碼」延伸到「讓程式碼在生產環境自己活下去」。"
series:
  name: "AI Agent Funding"
  order: 123
---

> 🌏 [English version](/posts/daily/2026-11-05-funding-traversal-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Traversal（美國，紐約） |
| 輪次 | Series B |
| 金額 | $120M |
| 領投 | Kleiner Perkins、Redpoint Ventures、Khosla Ventures（三方共同領投） |
| 跟投 | Sequoia Capital、Battery Ventures（既有投資人加碼） |
| 估值 | $1B |
| 累計融資 | $168M（$48M 種子+A 輪 + $120M 本輪） |
| 成立年份 | 2023 |
| 員工數 | 未揭露（官網列出來自 Perplexity、Meta、Datadog、ServiceNow、Citadel 等公司的工程與產品背景） |

## 這家公司做什麼

Traversal 是一家做「AI 站點可靠性工程師（AI SRE）」的公司——企業生產環境出事故時，它派一群 LLM agent 平行調查,幫忙把一堆互相牽連的異常訊號裡，揪出真正的根本原因。

核心技術是「生產世界模型（Production World Model）+ 因果搜尋引擎（Causal Search Engine）」：先把系統的依賴關係、歷史事故持續建模，事故發生時再用因果推論方法，把「哪些異常只是連帶反應、哪些才是真正的病灶」分開，而不是像傳統 dashboard 把所有告警一次丟給工程師。產品線延伸成三層——Traversal 做根因分析，Traversal Workers 主動在告警前就先去調查，Traversal MCP 把生產環境的即時證據接給寫程式碼的 coding agent，讓修 bug 這一步也能用上事故現場的資訊。

四位創辦人 Anish Agarwal、Raaz Dwivedi、Ahmed Lone、Raj Agrawal 都出身學術界（因果機器學習、強化學習），2023 年在哥倫比亞大學課後夜聊中開始做這件事，2025 年 6 月才正式出 stealth。客戶包括 Nubank、Harvey、PepsiCo、American Express、Blackstone、DigitalOcean。官方公告指出,每月調查量在 2026 年內成長超過百倍（513 次 → 近 73,000 次），其中約三分之二的用途已經不是單純事後根因分析,而是延伸到警報分類、發布風險評估、CMDB 驗證、資安與日常生產問題。

## 這筆融資的信號

### 對 Agent 生態的意義

$120M 這輪的訊號是：AI 寫程式碼的速度已經快到讓「維運」變成新瓶頸——工程師省下來的時間,有一部分被倒回去花在監控、排查生產事故上。Traversal 的打法是把 agent 從「被動等告警」往前推到「主動調查」，再往後接到「把生產現場的證據回饋給寫 code 的 agent」，試圖把 SDLC（軟體開發生命週期）從「寫完就丟給維運」改成一個 agent 到底的閉環。

```diagram
title: Traversal 的 AI SRE 閉環
desc: 生產事故發生後，causal search 找出真正根因，Traversal Workers 主動調查產生證據，Traversal MCP 把證據回饋給寫程式碼的 coding agent，減少下一次事故發生的機會。
caption: 簡化示意：實際產品線三者可並行運作，不是嚴格的單向順序。
step: 生產環境出現異常訊號或事故
step: Production World Model + Causal Search Engine 從眾多異常裡找出真正根因
step: Traversal Workers 主動調查，產出修復與預防建議
step: Traversal MCP 把生產環境證據餵給 coding agent，用在下一次寫程式碼時
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">生產事故</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">異常訊號出現</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">因果搜尋</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">找出真正根因</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">主動調查</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">Traversal Workers</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">回饋給 coding agent</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">Traversal MCP</text>
  </g>
</svg>
```

### 投資人在賭什麼

三家領投 VC 的押注邏輯略有不同:Khosla 和 Kleiner Perkins 都是 Traversal 種子輪／A 輪的既有投資人,這輪屬於「加碼確信」；Sequoia 跟 Battery 則是「雙倍下注」——Sequoia 兩年前就投過 Traversal 的種子輪，這次連 Series B 也沒缺席。同賽道的 Resolve AI（前 Splunk 高層創立）今年也拿到 Lightspeed 領投的 $125M Series A，估值同樣是 $1B，顯示 VC 認為「AI SRE」已經是獨立成形的新賽道，而不是觀測性（observability）廠商的附加功能——Datadog、Dynatrace、Grafana Labs 等既有觀測性大廠也在往同方向加功能,形成新創與老牌同場加速卡位的局面。

### 值得觀察的數字

- 月調查量從 513 次衝到近 73,000 次,一年內成長超過百倍,是這輪最關鍵的使用量證據
- $120M 在美國企業軟體 Series B 交易裡位居史上前 4%(約第 96 百分位),反映投資人對「AI 做維運工作、不只是寫程式碼」的高度期待
- 本輪規模是公司出 stealth 時種子+A 輪合計 $48M 的 2.5 倍,15 個月內估值從未公開到 $1B

## Watchlist 狀態

Traversal 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性/評估），但需註記:現有 B6 名單（Arize AI、Braintrust、Langfuse、AgentOps 等）多數做的是「可觀測性資料層」——收集、視覺化 trace 與 log；Traversal 做的是再上一層的「自動化根因分析 agent」，跟 Resolve AI、Dash0 屬於同一個新興的「AI SRE」子類,建議未來若同類公司持續出現,可考慮從 B6 獨立拆出。

## 今日收穫

Traversal 的三層產品線(根因分析 → 主動調查 → 回饋給 coding agent)揭露了一個容易被忽略的事實:當 AI 寫程式碼的速度變快,「維運」不會自動跟著變輕鬆,反而會變成新的瓶頸——因為沒人有空去理解 AI 寫出來的程式碼在生產環境裡到底怎麼互相影響。Traversal 的賭法是讓「理解生產環境」本身也變成一個可以外包給 agent 的工作。

## 參考資料

- [Traversal Raises $120M to Close the Outer Loop with a Superintelligent AI SRE](https://www.traversal.com/blog/traversal-series-b-120-million-ai-sre)
- [Traversal raises $120M at $1B valuation to automate incident response](https://dealroom.co/news/169321-traversal-raises-120m-at-1b-valuation-to-automate-incident-response)
- [Traversal Raises $120M Series B at $1B Valuation to Expand AI SRE](https://www.unite.ai/traversal-raises-120m-series-b-at-1b-valuation-to-expand-ai-sre/)
