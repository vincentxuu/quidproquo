---
title: "定價追蹤｜Claude Max／Team 訂閱戶每月免費拿 API 額度，上限 $100–$500"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 10/7 起讓 Claude Max／Team 訂閱戶每月免費領 Claude API 額度——Max 5x $100、Max 20x $200、Team 依席位加總最高 $500，取代 6 月停用的 Agent SDK 額度方案"
tldr: "Anthropic 2026-10-07 起分批開放：Max 5x 訂閱戶每月 $100、Max 20x 每月 $200、Team 方案依 Standard/Premium 席位加總（每月最高 $500）的 Claude API 額度，可用在 Claude API、Managed Agents、Agent SDK 與 Playground，但不能用在 Claude Code 或訂閱本身的超額用量，每月歸零不累積。這取代了今年 6 月上線、現已停用的 Agent SDK 額度方案。"
series:
  name: "AI Pricing Watch"
  order: 20
---

> 🌏 [English version](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits-en)

## 變更摘要

Anthropic 在發表 Claude Haiku 5.5 的同一篇公告裡，順帶宣布一件對 Agent 開發者更實際的事：Claude Max 與 Team 訂閱戶從 2026-10-07 這週起，每月可以免費領到一筆 Claude API 額度——不用額外綁信用卡，連到 Claude Console 組織就能直接拿去呼叫 API、Managed Agents 或 Agent SDK。這不是單一模型調價，而是訂閱制跟 API 計費這兩條原本完全分開的帳本，第一次被官方主動搭橋。對照 OpenAI 明講 ChatGPT Plus／Pro 訂閱完全不含 API 存取、得另外開帳號付費，Anthropic 這次等於把訂閱費的一部分折算成可拿去蓋應用的開發額度。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Max 5x 訂閱戶 API 額度 | 無（6 月版 Agent SDK 額度方案已停用） | $100/月 | 新增 | 2026-10-07 起分批開放 |
| Max 20x 訂閱戶 API 額度 | 無 | $200/月 | 新增 | 2026-10-07 起分批開放 |
| Team 方案 API 額度（依席位加總） | 無 | Standard 席位 $20／席、Premium 席位 $100／席，合計上限 $500/月 | 新增 | 2026-10-07 起分批開放 |
| 使用範圍 | — | Claude API、Managed Agents、Agent SDK、Playground；不含 Claude Code 與 app 內超額用量 | — | 同上 |
| 額度結轉 | — | 每個計費週期結算歸零，不累積到下月 | — | 同上 |

## 成本試算

**場景**：一個 5 人小團隊用 Claude Team 方案（3 個 Standard 席位＋2 個 Premium 席位，官方範例配置），額度池為 $260/月，拿來跑一個用 Claude Sonnet 5.5（$2/1M input、$10/1M output）呼叫的客服草稿產生器，平均每次請求 2,000 input tokens＋500 output tokens。

| | 自己付費購買額度 | 用訂閱贈送的免費額度 | 月省 |
|---|---|---|---|
| 每次請求成本 | $0.009 | $0.009 | — |
| $260 額度可覆蓋請求數 | 需另外購買 $260 額度 | 約 28,800 次請求（$260 ÷ $0.009） | 省下 $260 的自費額度購買支出 |
| 當月團隊 API 帳單（以此用量估算） | $260（全額自費） | $0（全部由訂閱額度吸收） | $260（↓100%，額度用完前） |

若改用更便宜的 Haiku 5.5（$0.10/$0.50，100K tokens 以內），同樣的 2,000＋500 tokens 請求成本降到約 $0.00045，$260 額度可覆蓋近 57 萬次請求——對剛起步、呼叫量還不大的 Agent 專案，等於訂閱費本身就先把開發期的 API 帳單包掉了。

## 對開發者/企業的影響

### 誰最受益

已經在付 Claude Max 或 Team 訂閱費、但 API 呼叫量還不大的開發者與小團隊受益最明確——額度足夠覆蓋原型開發、內部工具、低流量 Agent 的日常測試，不用再另外決定「要不要為了寫個小工具去開一個 API 帳號」。已經有大量生產流量的團隊則影響有限，因為額度每月最高只有 $500，對正式環境的帳單只是零頭。

### 競爭格局影響

把幾家主要訂閱制跟 API 的綁定程度攤開比較：

| 廠商 | 訂閱方案 | 是否含 API 額度 |
|---|---|---|
| **Anthropic（新制）** | **Claude Max 5x／20x／Team** | **含，$100–$500/月** |
| OpenAI | ChatGPT Plus／Pro | 不含，官方文件明寫兩者帳務完全分開 |
| OpenAI（學生方案） | ChatGPT Plus 學生優惠 | 另外加贈 $100 Codex 額度，非常態方案 |
| Google | Google AI Pro／Ultra | 官方未公開常態 API 額度搭售 |

目前只有 Anthropic 把「訂閱戶」跟「API 開發者」這兩個身份正式打通，OpenAI 的 ChatGPT 訂閱與 API 計費仍是兩套獨立帳務系統。這對想留住「既是重度使用者、又想自己動手做 Agent」這群人特別有吸引力，等於用既有訂閱費降低了第一次嘗試開發的門檻。

### 行動建議

- 如果你已經是 Claude Max 或 Team 訂閱戶：先去 claude.ai 的 Settings → Billing（Team 則是 Organization settings → Billing）確認方案已滿 7 天，把 Claude Console 組織連結起來，額度就會自動入帳
- 如果你在跑的是 Claude Code 工作流：這筆額度幫不上忙，Claude Code 本身的用量仍吃你方案原本的限額，額度只覆蓋你自己用 API key 呼叫的部分
- 如果你是 Team 方案管理者：額度池大小隨目前席位數計算，加減席位會改變下個計費週期的額度，規劃團隊人力時可以把這筆隱藏福利一起算進去
- 額度每月歸零不累積，與其囤著不用，不如拿來跑一個小規模的 Agent 原型或做模型選型測試，用完也不心疼

## 時效提醒（API sunset）

⚠️ **舊方案已停用**：2026 年 6 月上線的 Agent SDK 月付額度方案，官方 FAQ 已明確表示「該額度已不再提供」，現行的 Claude API 額度（涵蓋 Claude API、Managed Agents、Agent SDK、Playground）是新的替代方案，兩者不可疊加或並存。

## 今日收穫

同一篇公告裡，Haiku 5.5 的降價數字搶走了大部分版面，但「訂閱費送 API 額度」這件事對 Agent 開發者的實際影響可能更大——它改變的不是某個模型的單價，而是「要不要自己開發票帳號」這個進入門檻本身。當訂閱制產品開始主動把自己的付費使用者導向 API 生態，看的已經不只是誰的 token 比較便宜，而是誰能用既有的訂閱關係留住下一批開發者。

## 參考資料

- [Anthropic：Introducing Claude Haiku 5.5（官方公告，含 API 額度段落）](https://www.anthropic.com/claude-haiku-5-5)
- [Claude Help Center：Monthly API credits for Max and Team plans](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans)
- [Claude Platform Docs：API credits for subscribers](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)
- [mixed-news.com：Claude Max and Team plans now include API credits you cannot spend on Claude Code](https://mixed-news.com/en/claude-max-team-monthly-api-credits-not-claude-code)
- [aionx.co：ChatGPT Plus 與 OpenAI API 帳務完全分離的官方說明](https://aionx.co/chatgpt-reviews/chatgpt-plus-api-access)
