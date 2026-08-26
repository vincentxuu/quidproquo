---
title: "定價追蹤｜OpenAI 親自出手，GPT-5.6 Sol 官方標準價砍 20-33%"
date: 2026-08-23
category: daily
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 8/21 直接調降旗艦模型 GPT-5.6 Sol 的官方標準費率，input 從 $5 降到 $4（↓20%）、output 從 $30 降到 $20（↓33%），促銷期至少到 2026-11-21，這次不是平台代打折，是廠商自己動手"
tldr: "OpenAI 官方將 GPT-5.6 Sol 標準費率從 $5.00/$30.00 降到 $4.00/$20.00（每百萬 tokens input/output，input ↓20%、output ↓33%），2026-08-21 生效，促銷期至少到 11/21。這是 OpenAI 自己動手降價，不是 OpenRouter／Cloudflare 那種平台促銷（見前篇），且兩者現在疊加——OpenRouter 的 50% 折扣已改套用在新的 $4/$20 基準價上，變成 $2.00/$10.00。"
series:
  name: "AI Pricing Watch"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-23-pricing-openai-gpt-5-6-sol-official-price-cut-en)

## 變更摘要

昨天才記錄過 OpenRouter 與 Cloudflare AI Gateway 對 GPT-5.6 Sol 祭出平台端五折促銷、而 OpenAI 自家標準費率當時仍是 $5/$30 未動；結果就在同一天（8/21），OpenAI 自己也出手了——官方將 Sol 的標準費率從 $5.00/$30.00 砍到 $4.00/$20.00，input 降 20%、output 降 33%，這是 OpenAI 自己的定價表變動，不是中間層平台貼錢促銷。Reuters 引述 OpenAI 說法，直指這次降價是為了應付來自 Anthropic 與中國模型的競爭壓力。降價後，先前已經在跑的 OpenRouter 五折折扣自動疊加在新的官方價格上，讓透過 OpenRouter 呼叫 Sol 的實際價格進一步降到 $2.00/$10.00。

## 前後對照

| 項目 | 舊（OpenAI 官方標準價） | 新（OpenAI 官方標準價） | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-5.6 Sol Input（短文本） | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2026-08-21 |
| GPT-5.6 Sol Output（短文本） | $30.00/1M tokens | $20.00/1M tokens | ↓33% | 2026-08-21 |
| Cached Input（短文本） | $0.50/1M tokens | $0.40/1M tokens | ↓20% | 2026-08-21 |
| Cache Writes（短文本） | $6.25/1M tokens | $5.00/1M tokens | ↓20% | 2026-08-21 |
| Input（長文本，>272K tokens） | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-08-21 |
| Output（長文本，>272K tokens） | $45.00/1M tokens | $30.00/1M tokens | ↓33% | 2026-08-21 |

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），直接呼叫 OpenAI API（非 BYOK、非平台代管折扣）。

| | 舊定價（$5/$30） | 新定價（$4/$20） | 月省 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $2,250 | $1,800 | $450 |
| Output 成本/月（150M tokens） | $4,500 | $3,000 | $1,500 |
| **合計** | **$6,750/月** | **$4,800/月** | **$1,950（↓29%）** |

## 對開發者/企業的影響

### 誰最受益

直接呼叫 OpenAI API（沒有透過 OpenRouter／Cloudflare 這類第三方閘道）的團隊，這次是第一次真正拿到官方標準價的降幅——昨天的平台促銷只惠及走 Unified Billing／非 BYOK 流量的使用者，這次官方降價則是全體開發者都吃得到，不需要換計費路徑。Output 密集的 Agent 工作負載受益最明顯，因為 output 降幅（33%）大於 input（20%），這跟 7/30 Terra／Luna 的降價邏輯一致——OpenAI 持續把降幅往 output 端集中。

### 競爭格局影響

降價後的主要模型 Output 定價排名（USD/1M tokens，標準層）：

| 模型 | Output | 備註 |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 7/30 永久降價 |
| Claude Sonnet 5 | $10.00 | 促銷價跑到 8/31，9/1 起回到 $15.00 |
| **GPT-5.6 Terra** | **$12.00** | 7/30 降價後的現價 |
| **GPT-5.6 Sol（新價）** | **$20.00** | 8/21 官方降價 |
| Claude Opus 5 | $25.00 | — |
| Claude Fable 5 | $50.00 | Anthropic 最貴的旗艦層 |

這次降價把 Sol 與 Terra 的 output 價差從 2.5 倍（$30 對 $12）壓縮到不到 1.7 倍（$20 對 $12），旗艦與中階模型的定價區隔明顯變窄。同時 Sol 現在的 output 價位落在 Anthropic 兩個模型（Opus 5 的 $25 和 Sonnet 5 的 $10）中間，直接卡進 Anthropic 的定價區間——這正是 Reuters 報導中 OpenAI 承認的「應對 Anthropic 與中國模型競爭」的具體動作。

### 行動建議

- 如果你直接呼叫 OpenAI API 跑 Sol：不用改任何程式碼，8/21 起帳單自動套用新價，先重新跑一次月度成本試算，預期看到 output 端省最多。
- 如果你已經在用 OpenRouter／Cloudflare AI Gateway 的促銷折扣：確認你看到的即時報價是否已經反映新的官方基準價——OpenRouter 目前顯示的 5 折後價格已經是 $2.00/$10.00（原本促銷期的 $2.50/$15.00 現在等於打了雙重折扣）。
- 如果你先前因為 Sol 太貴而只用 Terra：現在 Sol 與 Terra 的價差縮小到 1.7 倍左右，值得重新評估用 Sol 換取推理能力提升是否划算，尤其是這次促銷期至少跑到 11/21，有近三個月的窗口可以驗證。

## 時效提醒

⏰ **促銷到期日**：OpenAI 官方註明「至少到 2026-11-21」（8/21 起算約三個月），屆時 Sol 標準價可能回到 $5.00/$30.00，或延長促銷——目前官方頁面只承諾下限日期，沒有承諾到期後的確切走向，建議 11 月前重新確認。

## 今日收穫

過去一週先是第三方閘道（OpenRouter、Cloudflare）繞過 OpenAI 對 Sol 打折，現在 OpenAI 自己也降了官方價——這說明「中間層先降價試水溫、廠商後跟進」不是巧合，而是價格訊號的傳導鏈：閘道商的折扣曝露了市場對 Sol 定價的實際承受度，OpenAI 觀察到之後直接把降幅寫進自己的定價表。對追蹤定價的人來說，這代表閘道層的促銷動作本身就是預測官方定價變動的領先指標，值得比照著看，而不是當成獨立事件各自記一篇。

## 參考資料

- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [Changelog | OpenAI API](https://developers.openai.com/api/docs/changelog)
- [OpenAI cuts developer pricing for frontier GPT-5.6 Sol model by more than 20% — Reuters](https://www.reuters.com/technology/openai-cuts-developer-pricing-frontier-gpt-56-sol-model-by-more-than-20-2026-08-21)
- [Amazon Bedrock announces reduced pricing for OpenAI GPT-5.6 Sol — AWS](https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-openai-gpt-56-sol-reduced-pricing)
- [GPT-5.6 Sol - API Pricing & Benchmarks | OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
