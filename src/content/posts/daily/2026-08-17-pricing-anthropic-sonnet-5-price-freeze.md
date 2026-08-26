---
title: "定價追蹤｜Claude Sonnet 5 漲價喊卡，$2/$10 定價變永久"
date: 2026-08-17
category: daily
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 取消原訂 2026-09-01 生效的 Claude Sonnet 5 漲價，上市促銷價 $2/$10（每百萬 tokens input/output）直接轉為永久標準價，迴避了本應到來的 50% 漲幅"
tldr: "Claude Sonnet 5 原訂 9/1 從促銷價 $2/$10 漲回標準價 $3/$15，Anthropic 8/10 在官方定價頁面宣布這次調漲「不會發生」，$2/$10 變成永久定價。以每月 30 萬則客服對話的 workload 試算，等於避開了每月 $1,200（↓33%）的成本上升，也讓 Sonnet 5 從此永久比前代 Sonnet 4.6（$3/$15）便宜。"
series:
  name: "AI Pricing Watch"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-08-17-pricing-anthropic-sonnet-5-price-freeze-en)

## 變更摘要

Claude Sonnet 5 在 6 月上市時，Anthropic 就把 $2/$10（每百萬 tokens input/output）定價明訂為「上市優惠」，白紙黑字寫明 8/31 到期、9/1 起恢復 $3/$15 標準價——剛好是前一代 Sonnet 4.6 目前所在的價位。但 Anthropic 已在官方定價頁面更新公告，這次調漲「不會發生」：優惠價直接變成永久價。這是本月一片漲價聲（DeepSeek 8/16 全面調漲、AI 需求持續吃緊供給）中少見的逆風動作——Anthropic 選擇在主力生產模型上鎖死價格，等同自砍原訂 33% 的漲幅，也讓新一代模型永久比舊一代便宜，打破「新模型理應更貴」的慣例假設。

## 前後對照

| 項目 | 促銷價（現行，已轉永久） | 原訂 9/1 起標準價（已取消） | 變化 | 對照生效日 |
|---|---|---|---|---|
| Sonnet 5 Input | $2.00/1M tokens | $3.00/1M tokens | 迴避漲幅 50% | 原訂 2026-09-01，已取消 |
| Sonnet 5 Output | $10.00/1M tokens | $15.00/1M tokens | 迴避漲幅 50% | 原訂 2026-09-01，已取消 |
| Sonnet 5 Cache Hit Input | $0.20/1M tokens（0.1x） | 官方未公告促銷後費率 | 促銷期費率確定沿用 | — |
| Sonnet 5 5m Cache Write | $2.50/1M tokens | 官方未公告促銷後費率 | 促銷期費率確定沿用 | — |

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），假設 9 月起持續使用 Sonnet 5。

| | 原訂 9/1 起（若如期漲價） | 實際（取消後，價格不變） | 省下 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $1,350 | $900 | $450 |
| Output 成本/月（150M tokens） | $2,250 | $1,500 | $750 |
| **合計** | **$3,600/月** | **$2,400/月** | **$1,200（↓33%）** |

## 對開發者/企業的影響

### 誰最受益

已經把 Sonnet 5 用在生產環境、且財務模型已經把 9 月起的 50% 漲幅算進預算的團隊最直接受益——這筆錢不用重新談判、不用調整定價模型，直接留在口袋。原本因為「9 月要漲價」而暫緩擴大部署規模的團隊，現在也少了一個觀望的理由。

### 競爭格局影響

取消漲價後的主要模型 Output 定價排名（USD/1M tokens）：

| 模型 | Output | 備註 |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 7/30 降價 80% |
| DeepSeek V4-Pro（離峰） | $1.98 | 8/16 調漲後仍是離峰最便宜 frontier 選項之一 |
| Gemini 3.7 Flash（促銷） | $3.75 | 促銷期至 2026-12-31，之後翻倍到 $7.50 |
| Claude Haiku 4.5 | $5.00 | — |
| **Claude Sonnet 5** | **$10.00** | 永久價，不再有 9/1 漲價風險 |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 4.6（前代） | $15.00 | Sonnet 5 從此永久比自己的前代便宜 33% |
| Claude Opus 5 | $25.00 | — |

漲價取消最直接改變的是 Anthropic 自家產品線的定位：Sonnet 5 原本應該在 9 月追平 Sonnet 4.6 的 $15 output 價位，現在反而永久維持比前代便宜三分之一，等於把「用新模型」和「用便宜模型」兩件事綁在一起，而不是要求客戶在兩者間取捨。

### 行動建議

- 如果你已經在生產環境用 Sonnet 5：不用做任何事，直接把 9/1 的漲價從預算行事曆上刪掉。
- 如果你還停留在 Sonnet 4.6：現在切換到 Sonnet 5 的理由更強也更持久——不只是新一代模型，還永久便宜 33%，不像之前得趕在 8/31 前決定是否要卡在促銷窗口內。
- 如果你原本因為「9 月要漲價」而暫緩規模化部署：這個阻礙已經不存在，可以把長期架構規劃直接建立在 $2/$10 這個基準上。

## 今日收穫

多數定價新聞報導的是「發生了什麼變動」，但這則新聞的本體其實是「原本排定要發生的事沒有發生」——一個已公告的漲價被取消。表面上看「什麼都沒變」，但對预算規劃來說，這和真的降價一樣重要，因為它排除了一個原本已經確定、只是還沒生效的未來成本。這種「沒有變化」的公告特別容易被忽略，因為新聞標題習慣追蹤「發生的事」，而不是「原本會發生但没發生的事」。

## 參考資料

- [Pricing | Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude Sonnet 5 Price Freeze: What It Means for Business - Enterprise DNA](https://enterprisedna.co/resources/news/anthropic-claude-sonnet-5-pricing-permanent-reversal-august-2026/)
- [LLM API Pricing 2026: Complete Guide to the Best Rates - Progressive Robot](https://www.progressiverobot.com/2026/08/13/llm-api-pricing-comparison-2026/)
