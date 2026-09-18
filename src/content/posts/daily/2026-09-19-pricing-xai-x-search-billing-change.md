---
title: "定價追蹤｜xAI 9/21 把 X Search 計價改成「按抓到的貼文數」，不再是每次呼叫固定價"
date: 2026-09-19
category: daily
lang: zh-TW
type: digest
tags: [ai-agent, pricing, daily, xai]
description: "xAI 宣布 2026-09-21 起，Grok API 的 X Search 工具從「每千次呼叫 $5」改成「每千則抓到的貼文 $5 + 每千個抓到的 user profile $10」，thread 裡的 parent／quoted post 也算，重度使用者帳單可能不降反升"
tldr: "xAI 官方定價文件公告：2026-09-21 12:00 PT 起，Grok API 的 x_search 工具計價從「每千次呼叫 $5」改成「每千則抓到的貼文 $5、每千個抓到的 user profile $10」，thread 裡回傳的 parent／quoted post 也算進貼文數。web_search、code_execution 等其他工具價格不變，仍是每千次呼叫 $5。對每次查詢只回傳少量結果的用法影響不大，但對會拉出完整討論串（thread）、平均每次查詢回傳數十則貼文的社群監控類 Agent，帳單可能不降反升。"
series:
  name: "AI Pricing Watch"
  order: 10
---

> 🌏 [English version](/en/posts/daily/2026-09-19-pricing-xai-x-search-billing-change-en)

## 變更摘要

xAI 在自家 API 定價文件的 Tools Pricing 區塊加了一條警告：2026-09-21 中午 12 點（太平洋時間）起，Grok API 的 `x_search` 工具（用來搜尋 X 上的貼文、user profile 和討論串）不再用「每千次呼叫 $5」計價，改成「每千則抓到的貼文 $5、每千個抓到的 user profile $10」，而且一次查詢如果連帶抓出討論串裡的 parent post、quoted post，這些也算進貼文數。這不是模型 token 降價或漲價，是工具呼叫計價機制本身的重新設計——從「按查詢次數收費」換成「按查詢結果的資料量收費」。同一份文件裡的 `web_search`、`code_execution` 等其他工具維持每千次呼叫 $5 不變，只有 `x_search` 被改了計價方式，等於 xAI 把「一次 X Search 可能挖出一整串討論」這件事的成本，從自己吸收改成轉嫁給開發者。

## 前後對照

| 項目 | 舊 | 新 | 生效日 |
|---|---|---|---|
| X Search（`x_search`）計價方式 | 每 1,000 次工具呼叫 $5（不論回傳幾則結果） | 每 1,000 則抓到的貼文 $5 + 每 1,000 個抓到的 user profile $10 | 2026-09-21 12:00 PT |
| 計入範圍 | 呼叫次數 | 搜尋或討論串抓取回傳的每一則貼文（含 parent／quoted post）、user search 回傳的每一個 profile | 2026-09-21 12:00 PT |
| Web Search（`web_search`） | 每 1,000 次呼叫 $5 | 不變，$5 | — |
| Code Execution（`code_execution`） | 每 1,000 次呼叫 $5 | 不變，$5 | — |
| File Attachments（`attachment_search`） | 每 1,000 次呼叫 $10 | 不變，$10 | — |

## 成本試算

**場景**：一個做 X（Twitter）品牌輿情監控的 Agent，每天執行 2,000 次 `x_search` 查詢，平均每次查詢連帶回傳 15 則貼文（含討論串裡的 parent／quoted post）與 1 個 user profile 結果——這是輿情監控類查詢常見的模式，因為要看清一則貼文的討論脈絡通常得把整串 thread 抓出來。

| | 舊計價（每千次呼叫 $5） | 新計價（每千貼文 $5 + 每千 profile $10） | 差額 |
|---|---|---|---|
| 每日查詢／結果量 | 2,000 次呼叫 | 30,000 則貼文 + 2,000 個 profile | — |
| 每日成本 | $10.00 | $150.00 + $20.00 = $170.00 | +$160.00/日 |
| **每月成本（×30）** | **$300.00** | **$5,100.00** | **+$4,800.00（↑1,600%）** |

這個倍數對「平均每次查詢回傳結果數」極度敏感：如果查詢多半只回傳 3-5 則貼文、不特別去抓討論串，新舊計價的差距會小很多，甚至可能持平；但只要應用場景需要把完整討論串（thread）都抓出來分析，貼文數很容易一次衝到兩位數以上，帳單就會被結果量而不是查詢次數放大。

## 對開發者/企業的影響

### 誰最受益、誰受衝擊最大

受衝擊最大的是社群輿情監控、trend 分析這類會用 `x_search` 抓討論串脈絡的 Agent——查詢次數不變，但只要 thread 裡的 parent／quoted post 一起被算進帳單，成本就會被「討論串多長」而不是「查了幾次」決定。相對地，如果應用場景是單純確認「某個帳號最近有沒有發文」「某個關鍵字有沒有人提到」這種輕量查詢，每次回傳結果數本來就少，改用新計價反而可能比舊制的固定 $5/千次更便宜。

### 定價邏輯的轉向：從「查詢次數」到「資料量」

這次改動代表的訊號比金額本身更值得記一筆：xAI 把 `x_search` 從「跟查詢行為綁定收費」換成「跟查詢挖出多少資料綁定收費」，這跟多數 AI 廠商的搜尋工具維持「每次呼叫固定價」的做法方向不同（xAI 自家的 `web_search`、`code_execution` 這次都沒有跟著改）。對開發者來說，這意味著「省錢」的槓桿從「少打 API」變成「少要資料」——同一份工具，接下來得開始像管理 token 用量一樣管理「這次查詢真的需要抓多少則貼文、多少個 profile」。

### 行動建議

- 若你的 Agent 用 `x_search` 抓完整討論串（thread）：9/21 前檢查現有呼叫是否真的需要 parent／quoted post 一起回傳，能只抓核心貼文就不要連帶抓整串，直接影響新計價下的帳單。
- 若你只是做單次貼文/帳號的輕量查詢：先用現有流量估一次「新舊計價哪個貴」，很可能新制對你反而更便宜，不用急著改架構。
- 若你在跑量大的社群監控服務：建議先用 9/21 前的流量模式試算一次月費差距（用上面的公式：貼文數 ÷ 1,000 × $5 + profile 數 ÷ 1,000 × $10），抓出風險後再決定要不要調整查詢策略或加上結果數上限。

## 時效提醒

⏰ **生效日期**：2026-09-21 12:00 PT。之後 `x_search` 一律照新計價（每千則貼文 $5、每千個 profile $10）結算，`web_search`、`code_execution` 等其他工具價格不變。

## 今日收穫

過去追蹤 AI API 定價變動，預設「計價方式改變」多半發生在模型 token 價格上，但這次 xAI 改的是工具呼叫的計價維度本身——從「查了幾次」換成「查到多少資料」。這種改法比單純漲價更難用一句話說清楚划不划算，因為同一個功能對不同用法可以同時是降價和漲價：查詢次數不變時，帳單走向完全取決於「每次查詢平均回傳多少筆結果」這個過去不會出現在帳單上的變數，也代表這類「按資料量計價」的工具往後得像管 token 用量一樣去管「查詢粒度」。

## 參考資料

- [Pricing | xAI Docs（Tools Pricing／X Search 計價公告原文）](https://docs.x.ai/developers/pricing)
- [Grok Pricing in 2026: API Costs and Calculator | Cognee](https://www.cognee.ai/grok-api-pricing)
- [Grok API: Pricing, Models, Features & How to Use? | Supergok](https://supergok.com/grok-api/)
