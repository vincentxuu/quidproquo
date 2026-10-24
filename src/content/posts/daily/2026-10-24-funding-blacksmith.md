---
title: "融資速報｜Blacksmith 完成 $66M Series C（CI 基礎設施在兩個月內估值翻倍到 $1B）"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, funding, daily, blacksmith, ci-infrastructure]
lang: zh-TW
description: "CI 雲端平台 Blacksmith 完成 $66M Series C，由 Sequoia Capital 領投，估值兩個月內從 $550M 跳到 $1B，反映 AI coding agent 把瓶頸從「寫代碼」推到「驗證代碼」"
tldr: "Blacksmith 完成 $66M Series C，由 Sequoia Capital 領投，估值 $1B，距離上一輪僅兩個月。這筆錢的信號：當 Cursor、Claude、Codex 讓寫代碼變得「極其容易」，瓶頸轉移到驗證代碼的 CI 層——Blacksmith 的 ARR 一年內成長 17 倍，CI job 量暴增 18 倍，證明這個新瓶頸正在快速被定價。"
series:
  name: "AI Agent Funding"
  order: 104
---

> 🌏 [English version](/posts/daily/2026-10-24-funding-blacksmith-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Blacksmith Software（美國，舊金山） |
| 輪次 | Series C |
| 金額 | $66M |
| 領投 | Sequoia Capital |
| 跟投 | Peak XV Partners、Y Combinator、GV |
| 估值 | $1B（Series B 時為 $550M，僅 2 個月內 1.8x 增長） |
| 累計融資 | $125M |
| 成立年份 | 2024 |
| 員工數 | ~40 人（計劃年底前擴編至 75 人） |

## 這家公司做什麼

Blacksmith 是做 CI（持續整合）雲端平台的公司——幫企業更有效率地建置與測試程式碼，特別是愈來愈大比例由 AI 寫出來的程式碼。

它自建伺服器打造專屬的全球 CI 雲，取代企業過去直接向 AWS、Azure、GCP 租用算力跑 CI job 的做法，並自動化掉過去每次測試前的大量手動設置工作。公司主打讓 CI「less painful」——企業把 CI 工作負載交給 Blacksmith，執行速度比自己架設更快，且零維運負擔。

目前客戶超過 10,000 家（8 月時約 5,000 家，2 個月內翻倍），包括 Mercury、Granola、LangChain、Supabase，部分最大客戶年付費超過百萬美元，整體營收已達「數千萬美元」規模。

## 這筆融資的信號

### 對 Agent 生態的意義

Blacksmith CEO Aditya Jayaprakash 的說法點出核心邏輯：「在 AI coding assistant 出現前，開發者大約一半時間寫程式、一半時間等建置與測試跑完。但 Cursor、Claude、Codex 讓寫程式變得『極其容易』之後，瓶頸轉移到第二塊——我要怎麼驗證這堆程式碼？」這代表 coding agent 生態正在分裂成兩層：寫程式的 agent 層（Cursor、Cognition、Windsurf 等）與驗證程式碼的基礎設施層（Blacksmith），後者是前者爆發式成長後才顯現的新瓶頸。Anthropic 自己也證實了這個現象——其 CI workload 過去 6 個月成長超過 25 倍，直接源自 Claude 接手大部分程式撰寫工作。

### 投資人在賭什麼

這輪最值得注意的細節是領投方換人——Series B 由 Peak XV Partners 領投（估值 $550M），這次 Sequoia Capital（美國母公司）親自領投，Peak XV 降級為跟投方之一。這通常代表上一輪的市場驗證（估值 9 個月內從 $60M 衝到 $550M）已經讓更大型的基金願意用更高倍數進場卡位。Sequoia 的邏輯延續它在開發者工具領域一貫的「基礎設施層先卡位」打法：賭的不是某個 coding agent 會贏，而是不管誰贏，驗證層都需要有人做。

### 值得觀察的數字

- 估值軌跡：$60M（Series A，2025 年 9 月）→ $550M（Series B，2026 年 8 月，11 個月內 9.2x）→ $1B（Series C，2026 年 10 月，僅 2 個月後再 1.8x）——估值加速度本身在上升，不是線性成長
- CI job 量：從年初約 500 萬個/週，成長到 10 月約 9,000 萬個/週，18 倍成長發生在不到 10 個月內
- 客戶數：8 月約 5,000 家 → 10 月超過 10,000 家，2 個月內翻倍，但 ARR 成長 17 倍——代表既有客戶的用量成長速度比新客戶增加的速度更快

## Watchlist 狀態

Blacksmith 尚未在 watchlist 中。建議新增至 coding agent 相鄰的基礎設施分類（非 agent 本身，而是 agent 寫出的程式碼的驗證層），追蹤重點：CI 工作負載是否持續跟隨前沿模型發布節奏暴增（如 Claude Fable 5 上線當天 CI 量單日跳增超過 40%），以及 AI 模型廠商是否會自己做這塊、威脅 Blacksmith 的定位。

## 今日收穫

這輪募資最反直覺的地方不是金額，而是估值翻倍的速度比產品迭代速度快得多——Blacksmith 兩個月內估值從 $550M 衝到 $1B，不是因為做出了什麼新功能，而是整個市場突然看懂了「coding agent 寫代碼的速度已經超過人類驗證代碼的能力」這件事有多嚴重。當瓶頸轉移的訊號（Anthropic CI workload 暴增 25 倍）比產品路線圖更能說服投資人，代表這輪 AI 基礎設施的競賽裡，「誰先把瓶頸的名字喊出來」本身就是一種先發優勢。

## 參考資料

- [Blacksmith hits unicorn valuation after Sequoia leads Series C](https://techcrunch.com/2026/10/21/blacksmith-hits-unicorn-valuation-after-sequoia-leads-series-c/)
- [Code testing startup Blacksmith becomes a unicorn after raising $66M in Series C funding](https://siliconangle.com/2026/10/21/code-testing-startup-blacksmith-becomes-a-unicorn-after-raising-66m-in-series-c-funding/)
- [Blacksmith Raises Sequoia-Led Series C at $1 Billion Valuation to Scale Code Validation](https://www.prnewswire.com/news-releases/blacksmith-raises-sequoia-led-series-c-at-1-billion-valuation-to-scale-code-validation-302915140.html)
