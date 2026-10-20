---
title: "定價追蹤｜Google 補上 Gemini 4 Argon 促銷到期日：11/30 起漲 100%，Flash 系列 12/31 同步漲價"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google 官方定價頁首次公布 Gemini 4 Argon 促銷期到期日（2026/11/30），結束後 input/output 雙雙漲 100%；Gemini 3.8 Flash 與前代 Flash 同步在 2026/12/31 後漲價，兩者漲幅都是 100%"
tldr: "Google 在官方定價頁補上先前缺失的促銷到期日：Gemini 4 Argon 促銷價 input $2.00／output $10.00（USD/1M tokens）維持到 2026-11-30，12/1 起雙漲 100% 至 $4.00／$20.00；Gemini 3.8 Flash 與前一代 Flash 促銷價 $0.75／$3.75 維持到 2026-12-31，2027-01-1 起同樣雙漲 100% 至 $1.50／$7.50。我們在 10/4 的報導中指出 Argon 促銷「沒給到期日」，這次官方頁面更新補齊了日期，確認漲幅維持 100% 不變。"
series:
  name: "AI Pricing Watch"
  order: 24
---

> 🌏 [English version](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline-en)

## 變更摘要

Google 在官方 [Gemini Developer API 定價頁](https://ai.google.dev/gemini-api/docs/pricing)補上了先前缺失的關鍵資訊：促銷到期日。我們在 [10/4 的報導](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)指出，Gemini 4 Argon 上市時只公告「促銷期結束後」價格倍增，卻沒給任何到期日，讓想拿 Argon 做成本規劃的團隊等於在賭一個沒有倒數計時的優惠期。兩週後，Google 把日期寫清楚了：Argon 促銷價維持到 2026 年 11 月 30 日，12/1 起 input 從 $2.00 漲到 $4.00、output 從 $10.00 漲到 $20.00，漲幅精準落在先前公告的 100%。同一次更新也把 Gemini 3.8 Flash 與前一代 Flash 的促銷到期日定在 2026 年 12 月 31 日，2027 年 1/1 起同樣雙漲 100%。兩個不同世代的 Flash 模型促銷價和到期日完全相同，值得留意是否為同一波漲價政策的統一套用。

## 前後對照

| 項目 | 促銷價（現在） | 標準價（到期後） | 變化 | 生效日 |
|---|---|---|---|---|
| Gemini 4 Argon Input | $2.00/1M tokens | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Output | $10.00/1M tokens | $20.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Context Caching | $0.10/1M tokens | $0.20/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Batch Input | $1.00/1M tokens | $2.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Batch Output | $5.00/1M tokens | $10.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 3.8 Flash Input | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash Output | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash Context Caching | $0.075/1M tokens | $0.15/1M tokens | ↑100% | 2027-01-01 |
| 前代 Flash Input | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| 前代 Flash Output | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），分別用 Gemini 4 Argon 和 Gemini 3.8 Flash 跑。

| | Argon 促銷價/月 | Argon 標準價/月（12/1 起） | 月增 |
|---|---|---|---|
| Input 成本 | $900 | $1,800 | $900 |
| Output 成本 | $1,500 | $3,000 | $1,500 |
| **合計** | **$2,400** | **$4,800** | **$2,400（↑100%）** |

| | Flash 促銷價/月 | Flash 標準價/月（1/1 起） | 月增 |
|---|---|---|---|
| Input 成本 | $337.5 | $675 | $337.5 |
| Output 成本 | $562.5 | $1,125 | $562.5 |
| **合計** | **$900** | **$1,800** | **$900（↑100%）** |

## 對開發者/企業的影響

### 誰最受益

這次不是降價，沒有人「受益」——但提前知道到期日的團隊受益最大。10 月就把到期日排進預算的人，可以在 11/30 和 12/31 前做完壓力測試，決定要不要在漲價前鎖定長期合約或 Provisioned Throughput，而不是等到 12 月帳單跳 100% 才回頭查原因。

### 競爭格局影響

漲價後的 Gemini 主要模型定價（input / output，USD/1M tokens）：

| 模型 | 促銷價 | 標準價 | 備註 |
|---|---|---|---|
| Gemini 3.8 Flash / 前代 Flash | $0.75 / $3.75 | $1.50 / $7.50 | 2027-01-01 起 |
| Gemini 4 Argon | $2.00 / $10.00 | $4.00 / $20.00 | 2026-12-01 起 |

即使漲價後，Argon 標準價（$4/$20）仍落在 Claude Sonnet 5（$4/$10）和 GPT-5（$4/$16）之間的 input 定價帶，但 output 比兩者都貴——Google 把 Argon 定位在「不是最便宜，但吃下促銷期的使用者會先習慣這個價格」。

### 行動建議

- 如果你在 Fairwind Program 或信任夥伴管道已經在用 Argon：現在用的成本試算要重跑一次，11/30 之後直接乘以 2，別等帳單才發現。
- 如果你用 Gemini 3.8 Flash 或前代 Flash 跑高流量的輕量任務：12/31 前是鎖定用量評估的最後窗口，之後兩個世代的 Flash 都漲到一樣的價格，等於「新舊同價」，沒有理由繼續留在前代。
- 如果你的工作流可以忍受延遲換便宜：Batch API 漲價後 Argon 仍是 $2/$10，只有 Flash 一半定價帶的水準，大量離線任務可以考慮全面改走 Batch。

## 時效提醒

⏰ **Gemini 4 Argon 促銷到期日**：2026-11-30。12/1 起恢復標準價 $4.00/$20.00（USD/1M tokens）。
⏰ **Gemini 3.8 Flash／前代 Flash 促銷到期日**：2026-12-31。2027-01-01 起恢復標準價 $1.50/$7.50（USD/1M tokens）。

## 今日收穫

10/4 報導 Argon 定價時，最大的疑點是「促銷期沒有到期日」——這種模糊性本身就是一種定價策略：讓開發者先用低價黏住，卻不給明確的預算規劃依據。兩週後 Google 補上日期，證實漲幅確實是先前註腳寫的 100%，但這中間的空窗期，正好是讓團隊先把用量養大、之後漲價時沉沒成本已經夠高、不會輕易換模型的時間差。追蹤「促銷到期日何時公布」本身，可能比追蹤「漲了多少」更能看出廠商的定價節奏。

## 參考資料

- [Gemini Developer API Pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Google AI Studio Pricing (2026): Free, Paid Plans & Gemini API Costs](https://www.nocode.mba/articles/google-ai-studio-pricing)
- [Gemini Pricing 2026: Plans, API & Workspace Cost Guide](https://felloai.com/gemini-pricing/)
- [10/4 定價追蹤：Gemini 4 Argon 促銷價 $2/$10，promo 結束後倍增到 $4/$20，但 Google 沒給到期日](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)
