---
title: "融資速報｜Duvo Series A $32M（企業 Agent 執行層）"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, funding, daily, duvo, enterprise-automation]
lang: zh-TW
description: "Duvo 完成 $32M Series A，由 Balderton Capital 領投，把零售/CPG 企業的人與 AI agent 放進同一套「執行作業系統」裡"
tldr: "Duvo 完成 $32M Series A，由 Balderton Capital 領投，Rohlik 創辦人 Tomáš Čupr 二次創業，累計融資 $48M。這筆錢的信號：企業不缺 agent demo，缺的是讓 agent 長期活在既有系統裡的執行層，而這正是 Gartner 預測 40% agentic AI 專案會被砍掉的那個環節。"
series:
  name: "AI Agent Funding"
  order: 95
---

> 🌏 [English version](/posts/daily/2026-10-19-funding-duvo-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Duvo（美國／歐洲，由捷克團隊創立） |
| 輪次 | Series A |
| 金額 | $32M |
| 領投 | Balderton Capital |
| 跟投 | Index Ventures、Northzone、Credo Ventures（均為既有投資人） |
| 估值 | 未揭露 |
| 累計融資 | $48M（前一輪 2025 年 12 月 $15M Seed，由 Index Ventures 領投） |
| 成立年份 | 2025 |
| 員工數 | ~70 人（tech.eu 訪談；公司官方新聞稿寫約 60 人） |

## 這家公司做什麼

Duvo 是做「企業作業執行層」的公司——它不是又一個會聊天的 agent，而是讓員工和 AI agent 在同一套系統裡一起把公司的日常作業流程跑起來，取代原本散落在 ERP、供應商入口網站、Excel 和 email 之間、靠人工搬資料銜接的灰色地帶。

核心產品是 Duvo Clarity：先用 AI 訪談、螢幕錄影和既有文件去理解一個流程「實際上」怎麼跑（包含那些只存在員工腦中、沒寫進任何 SOP 的例外處理），再由 agent 把這個流程對應到自動化步驟，決定哪些步驟能直接執行、哪些需要人核准。Duvo 的 agent 透過既有 API（如果有）或直接操作員工平常用的畫面（如果沒有 API）去執行這些步驟，讓一家企業不需要大規模系統整合專案，幾週內就能讓第一個流程上線。公司定位是「model-agnostic」：底層 AI 模型可以換，企業也能選擇在自己的雲端或地端跑開源權重模型，滿足資安或主權需求，並拿到 SOC 2 Type II、ISO 27001、ISO 42001 認證。

目前客戶包括英國超市 Morrisons、保健零售商 Holland & Barrett、服飾品牌 Boden、歐洲最大美妝電商 Notino，以及電商平台 Allegro。公司稱已為客戶釋放超過 $100M 的價值，其中 Notino 把每年約 $45M 的供應商獎金對帳流程從 70 天縮短到 15 天，所需的專家工時從每週期約 120 小時降到不到 10 小時。創辦人 Tomáš Čupr 同時是歐洲線上生鮮零售商 Rohlik Group（估值約 $2B）的創辦人兼集團 CEO，Duvo 正是從他在 Rohlik 導入自動化時踩的坑裡長出來的獨立公司。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪的關鍵字不是「更聰明的 agent」，是「agent 能不能活下來」。Duvo 新聞稿直接引用 Gartner 的預測：到 2029 年企業在業務編排與自動化技術上的支出會超過 $21B，但同時超過 40% 的 agentic AI 專案會在 2027 年底前被取消，理由是成本飆升、商業價值不明確、風險控制不足。Duvo 的打法是把自己定位成「讓每個流程用同一套連線、同一套核准規則、同一份結果紀錄」的執行層，而不是每個部門各自養一批孤立的 agent 專案——這等於是在賭「agent 整合層」會比「agent 本身」更稀缺。這輪的 $32M 主要用於美國市場擴張，起點是零售與消費品（CPG），由前 Kmart 總裁、Accenture 董事總經理 Spencer Insolia 帶隊，並新增前 ALDI SÜD Holding CEO Christoph Schwaiger 擔任高級顧問。

### 投資人在賭什麼

Balderton Capital 過去投過 Darktrace（資安 AI）、Revolut、GoCardless，在企業 AI 這一層也投了 Writer——而 Writer 正好也在本站的 watchlist A2（AI 模型/平台公司）。領投合夥人 Rob Moffat 的說法是「讓 AI agent 在企業裡穩定運作仍然極度困難」，他看重的是 Čupr「曾經創辦三家公司、包括 Rohlik」這種實際營運背景，而不是單純的技術履歷——這與 Duvo 自己的論點一致：這個市場的瓶頸不在模型能力，在有沒有人真的懂企業作業流程裡那些沒寫下來的例外狀況。Duvo 也和 Deloitte Central Europe 建立了聯盟關係，讓顧問公司用 Duvo Clarity 幫客戶先盤點哪些流程值得自動化，這是把自己嵌進顧問業導流管道的打法，與 UiPath 當年靠系統整合商鋪貨的路徑類似。

### 值得觀察的數字

- 累計融資 $48M，對比上一輪（2025 年 12 月 $15M Seed）在 10 個月內疊加超過 3 倍資本，顯示投資人對「agent 執行層」敘事的加碼速度
- 單一客戶 Notino 的供應商獎金對帳流程：70 天→15 天，120 小時→10 小時，這是目前這輪融資公告裡最具體、可驗證的生產力數字
- 全公司釋放超過 $100M 客戶價值，對比 ~70 名員工，平均每人對應超過 $1.4M 的客戶端價值——這個比例本身就是 Čupr「拉高每個員工的 GDP」說法的量化版本

## Watchlist 狀態

Duvo 尚未在 watchlist 中。建議加入 section D10（企業 AI 平台），與 Moveworks、Glean、ServiceNow、UiPath 同組比較，追蹤重點：Agent + RPA 整合的「企業執行層」定位，$32M Series A，Balderton Capital 領投，Rohlik 創辦人二次創業背景。

## 今日收穫

多數 agent 融資故事還在用「這個 agent 能取代幾個人」當單位，Duvo 的創辦人直接說這是錯的衡量標準——他改用「每個員工的 GDP」:不是用更少的人做一樣的事,而是讓現有的人做到原本沒有時間做的事(像是把庫存風險檢查從「每天抽查 8 個」變成「全天候檢查所有訊號」)。這個框架之所以值得記下來，是因為它同時解釋了 Duvo 為什麼能繞開「取代員工 = 內部政治阻力」的陷阱，也呼應了 Gartner 那組 40% 專案會被砍掉的數字背後的真正原因：多數 agentic AI 專案失敗，不是模型不夠強，是沒人把「這個 agent 到底創造了什麼」講清楚給付錢的人。

## 參考資料

- [Duvo Raises $32 Million Series A to Become the One Platform Enterprises Run Their Operations On](https://www.prnewswire.com/news-releases/duvo-raises-32-million-series-a-to-become-the-one-platform-enterprises-run-their-operations-on-302908575.html)
- [From Rohlik to enterprise AI: Tomáš Čupr's Duvo raises $32M Series A](https://tech.eu/2026/10/14/from-rohlik-to-enterprise-ai-tomas-cuprs-duvo-raises-32m-series-a/)
- [Duvo raises $15M to give retailers AI staff that cuts manual work by 40%](https://tech.eu/2025/12/02/duvo-raises-15m-to-give-retailers-ai-staff-that-cuts-manual-work-by-40/)
- [Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
