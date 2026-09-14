---
title: "融資速報｜Temporal Series E $550M"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, funding, daily, temporal, agent-framework]
lang: zh-TW
description: "耐久執行引擎 Temporal 完成 $550M Series E，估值來到 $12.55B，OpenAI、NVIDIA、JPMorgan Chase 都是付費客戶，賭的是「Agent 要跑得住」這件事"
tldr: "Temporal 完成 $550M Series E，由 Lightspeed 共同領投，估值從 7 個月前 Series D 的 $5B 漲到 $12.55B（2.5x）。這輪錢代表市場開始把「Durable Execution（耐久執行）」當成 Agent 生產化的必要基礎設施，而不是可有可無的工程選配。"
series:
  name: "AI Agent Funding"
  order: 34
---

> 🌏 [English version](/en/posts/daily/2026-09-15-funding-temporal-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Temporal Technologies（美國，舊金山） |
| 輪次 | Series E |
| 金額 | $550M |
| 領投 | Lightspeed（共同領投），Wellington Management、Goldman Sachs Alternatives 成長股權部門、Tiger Global 共同領投 |
| 跟投 | T. Rowe Price、SV Angel（新加入）；a16z、Sequoia Capital、Index Ventures、GIC、Sapphire Ventures、Amplify（回頭跟投） |
| 估值 | $12.55B（Series D 時為 $5B，約 2.5x 增長） |
| 累計融資 | 約 $1.3B（Series D 前揭露總額約 $754.5M + 本輪 $550M，Crunchbase 系資料未完全公開） |
| 成立年份 | 2019 年（前身 Uber 內部專案 Cadence，2017 開源） |
| 員工數 | 570 人（公司揭露，一年內翻倍） |

## 這家公司做什麼

Temporal 是做「耐久執行」（Durable Execution）引擎的公司——讓開發者寫一般的應用程式碼，不用自己手刻重試、狀態保存、故障復原這套機制，Temporal 就能保證這段邏輯不管中間發生什麼故障，都能從斷點正確接續執行，可能是幾秒鐘的任務，也可能是橫跨數週的流程。

核心產品是一套開源的工作流程編排平台，加上對應的雲端託管服務 Temporal Cloud。開發者用任何語言、任何工具寫「看起來像一般程式」的邏輯，Temporal 在背後負責跨系統的狀態保存與失敗復原——應用程式可以暫停等待人工核准好幾天，中間即使服務掛掉，重啟後也能從原本的位置接續，不需要開發者每次都手動搭建這套機制。公司把這個定位為 Agent 時代的基礎設施：客戶現在要求的是能連續跑數天、數週甚至數月的 agent，而不是幾秒鐘就結束的單次呼叫。

目前平台有超過 4,300 家付費客戶（年增 139%），named 客戶包括 OpenAI、Snap、NVIDIA、JPMorgan Chase：Snap 用它每天處理 4.14 億則 Stories，JPMorgan Chase 拿去跑受監管的正式環境流程，OpenAI 對 Temporal 的用量一年內成長 60 倍。開源安裝數超過 4,300 萬次（年增 134%），年化營收成長率超過 200%，淨留存率自 2026 年 2 月以來維持在 200% 以上。

## 這筆融資的信號

### 對 Agent 生態的意義

$550M 是目前 2026 年 Agent 基礎設施類別中數一數二的大輪，而且距離上一輪 Series D（$300M，2026 年 2 月，估值 $5B）只隔 7 個月，估值就漲了 2.5 倍。這筆錢的用途很直白：擴大全球據點、深化平台底層核心元件、補強企業客戶要求的可靠性與安全性功能。信號很清楚——當 Agent 從「跑得動 demo」進化到「企業願意把真實流程交給它跑數週」，耐久執行、狀態管理這類過去只有分散式系統工程師在乎的基礎設施，正在變成 Agent 生態必須補齊的一層,而不是各家 agent 框架各自輕描淡寫解決的小問題。

### 投資人在賭什麼

Lightspeed 這輪從跟投方升級成共同領投方，跟上一輪的 a16z 領投形成對照——代表 Temporal 已經從「早期押注分散式系統基礎設施」的階段，走到「多家頂級成長股權基金搶進」的階段：Wellington Management、Goldman Sachs Alternatives 成長股權部門、Tiger Global 這類典型的後期成長型基金加入领投，通常意味著公司已經有清楚的營收成長曲線可以驗證,而不只是概念驗證。OpenAI 的 VP of Infrastructure Venkat Venkataramani 直接在公告中背書，並提到 OpenAI 自己在建構耐久編排框架時就是用 Temporal 打底——這種「AI 實驗室自己也在用」的訊號，比任何第三方推薦都更有說服力。

### 值得觀察的數字

- 估值從 $5B（2月）→ $12.55B（9月），7 個月 2.5x——增速高於一般後期成長輪的年化倍數，反映市場對「Agent 基礎設施」類別的溢價預期
- 年化營收成長率 200%+、淨留存率 200%+，兩個數字同時維持在這個水準，代表不只是新客戶拉營收,既有客戶的用量也在同步暴增
- OpenAI 用量一年成長 60 倍,是目前公開揭露的、AI 實驗室對單一基礎設施供應商用量成長最極端的數字之一

## Watchlist 狀態

Temporal 已在 watchlist section B2，追蹤重點更新為：Series E $550M、估值 $12.55B（7 個月內從 $5B 上漲 2.5x）、Agent 長時序任務需求持續驗證 Durable Execution 的必要性。

## 今日收穫

過去把「Agent 框架」和「工作流程編排引擎」當成兩個相對獨立的類別——前者管 agent 怎麼想、後者管系統怎麼跑。但 Temporal 這輪的敘事點出一個趨勢：當 agent 的任務時間軸從秒級拉長到週級,「Agent 怎麼想」的問題會自然被「系統怎麼保證這個週級任務不會半路死掉」的問題吃掉,這也是為什麼 OpenAI 自己的耐久編排框架選擇疊在 Temporal 上,而不是重新造一個輪子。

## 參考資料

- [Temporal raises $550M at a $12.55B valuation as demand grows for reliable AI infrastructure](https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai)
- [Temporal Raises $550M Series E at $12.55B Valuation to Expand Operations](https://www.unite.ai/temporal-raises-550m-series-e-at-12-55b-valuation-to-expand-operations/)
