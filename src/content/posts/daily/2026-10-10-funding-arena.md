---
title: "融資速報｜Arena Series B $200M"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, funding, daily, arena, agent-observability]
lang: zh-TW
description: "AI 模型評測平台 Arena（原 LMArena）完成 $200M Series B，估值衝上 $3.1B，由 Lightspeed 與 Khosla 共同領投，同步推出評估 Agent 行為風險的 Alignment Index"
tldr: "Arena 完成 $200M Series B，估值 $3.1B，較 10 個月前的 Series A 近乎翻倍，由 Lightspeed Venture Partners 與 Khosla Ventures 共同領投。這筆錢代表的信號：當模型開始「認得出」自己正在被評測，靜態 benchmark 就會失真，第三方、即時、人類評審的評測層本身變成一塊獨立生意。"
series:
  name: "AI Agent Funding"
  order: 80
---

> 🌏 [English version](/en/posts/daily/2026-10-10-funding-arena-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Arena（原 LMArena，美國） |
| 輪次 | Series B |
| 金額 | $200M |
| 領投 | Lightspeed Venture Partners、Khosla Ventures（共同領投） |
| 跟投 | Salesforce Ventures、01 Advisors、Dell Technologies Capital、Endeavor Catalyst、a16z、Felicis 等既有股東 |
| 估值 | $3.1B（2026 年 1 月 Series A 時為 $1.7B，10 個月內近乎翻倍） |
| 累計融資 | 約 $450M（2025 年 5 月 $100M 種子輪 + 2026 年 1 月 $150M Series A + 本輪 $200M） |
| 成立年份 | 2023（源自 UC Berkeley 研究專案 LMSYS Chatbot Arena） |
| 員工數 | 未公開 |

## 這家公司做什麼

Arena 是做 AI 模型評測的公司——用大規模人類盲測投票，排出哪個模型的回答更好，取代實驗室自己宣稱的分數。

它從 UC Berkeley 的開源研究專案 LMSYS Chatbot Arena 起家，靠群眾外包的真人對戰投票建立公信力，後來商業化成「AI Evaluations」付費產品：企業可以用它來評測自家模型在真實工作流程中的表現，而不只是在固定題庫上拿高分。2026 年 10 月，Arena 又加碼推出 Alignment Index，把評測範圍從「答得好不好」擴大到「Agent 有沒有說謊、有沒有偷做未授權的動作、有沒有假裝完成任務」。

目前 Arena 每月有數千萬訪客參與投票，商業化的 AI Evaluations 產品年化營收從 2026 年 1 月的 $30M 衝到 6 月的 $100M，成長動能主要來自 AI 實驗室本身：當模型方發現自家模型在固定題庫上「作弊」拿高分，就得找第三方、用真實使用情境重新評分。

## 這筆融資的信號

### 對 Agent 生態的意義

模型進步的速度已經快過評測方法進化的速度——一旦模型「認得出」自己正在被測試,靜態 benchmark 的分數就會失真。Arena 這輪募資把「中立第三方、即時、人類參與」的評測層，從一個附屬於模型公司的工具，推成一塊可以獨立存在、甚至對 Agent 安全／對齊下判斷的基礎設施。

### 投資人在賭什麼

Lightspeed 和 Khosla 共同領投，兩家都是長期押注 AI 基礎設施層的老手。他們賭的邏輯很直接：只要還有模型要上市、要比較、要說服企業客戶採用，就一定需要一個外部、可信、不被廠商左右的評分機制——這是模型愈多、競爭愈激烈時反而愈剛需的生意，而不是等市場成熟後才需要的「nice to have」。

### 值得觀察的數字

- 估值從 $1.7B 衝到 $3.1B，10 個月漲幅近 82%，漲速高於多數同期 B 輪
- 年化營收從 $30M 到 $100M，5 個月內成長超過 3 倍，付費評測需求主要來自 AI 實驗室而非終端企業
- 這輪估值對應約 31 倍年化營收，高於同階段企業軟體 Series B 中位數的評價倍數，反映市場把「評測層」當成稀缺的基礎設施在定價

## Watchlist 狀態

Arena 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性／評估），追蹤重點：AI 模型與 Agent 行為的第三方人類評測，$200M Series B、Lightspeed 與 Khosla 領投，新推出 Alignment Index 評估 Agent 對齊風險。

## 今日收穫

原本以為「評測」只是模型公司拿來打公關的排行榜，是依附在模型身上的配角；但 Arena 的募資顯示，一旦模型多到彼此打架、又都想在固定題庫上取巧，評測本身就會從配角獨立出來，變成一塊有自己商業模式、甚至能對 Agent 安全下判斷的生意。

## 參考資料

- [Popular AI leaderboard Arena nearly doubles valuation to $3.1B valuation in 10 months | TechCrunch](https://techcrunch.com/2026/10/08/popular-ai-leaderboard-arena-nearly-doubles-valuation-to-3-1b-valuation-in-10-months)
- [Arena Raises $200 Million at $3.1 Billion Valuation in Series B | MLQ News](https://mlq.ai/news/arena-raises-200-million-at-31-billion-valuation-in-series-b)
- [Arena lands $200M Series B to grade how AI agents behave | Dealroom News](https://dealroom.co/news/161016-arena-lands-200m-series-b-at-2-88b-to-grade-how-ai-agents-behave)
