---
title: "定價追蹤｜GPT-5.6 Sol 雙平台打對折，OpenRouter 與 Cloudflare 同步降價至 9/18"
date: 2026-08-22
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenRouter 與 Cloudflare AI Gateway 幾乎同時對 OpenAI GPT-5.6 Sol 祭出 50% 折扣（$5/$30 降到 $2.50/$15，每百萬 tokens），只適用非 BYOK 流量，促銷到 2026-09-18 為止"
tldr: "GPT-5.6 Sol 標準費率透過 OpenRouter 與 Cloudflare AI Gateway 都從 $5.00/$30.00 降到 $2.50/$15.00（每百萬 tokens input/output，↓50%），Flex 最低到 $1.25/$7.50，促銷跑到 2026-09-18。折扣只適用兩平台的代管計費（Unified Billing／非 BYOK）流量，OpenAI 自家 API 直接叫用價格不變。"
series:
  name: "AI Pricing Watch"
  order: 3
---

> 🌏 [English version](/en/posts/daily/2026-08-22-pricing-gpt-5-6-sol-openrouter-cloudflare-discount-en)

## 變更摘要

過去三天內，兩個獨立的推理路由平台——OpenRouter 與 Cloudflare AI Gateway——幾乎同步對 OpenAI 旗艦模型 GPT-5.6 Sol 祭出五折優惠，把標準費率從 $5.00/$30.00 砍到 $2.50/$15.00（每百萬 tokens input/output），Flex 層甚至低到 $1.25/$7.50。這不是 OpenAI 自己降價——直接呼叫 OpenAI API 的價格仍是 $5/$30 沒變——而是兩個中間層平台各自貼錢促銷，且時間點高度重疊（OpenRouter 8/17 宣布、Cloudflare 8/20 跟進），促銷都設在 9/18 到期。折扣只適用平台代管計費（非 BYOK）流量，值得注意的是 OpenRouter 這次降價恰好卡在 Stripe 以逾 70 億美元收購 OpenRouter 的交易期間，時機本身就是一個訊號。

## 前後對照

| 項目 | 舊價（OpenAI 標準費率） | 新價（OpenRouter／Cloudflare，非 BYOK） | 變化 | 生效日 | 到期日 |
|---|---|---|---|---|---|
| GPT-5.6 Sol Input（標準） | $5.00/1M tokens | $2.50/1M tokens | ↓50% | 2026-08-17（OpenRouter）／8-20（Cloudflare） | 2026-09-18 |
| GPT-5.6 Sol Output（標準） | $30.00/1M tokens | $15.00/1M tokens | ↓50% | 同上 | 2026-09-18 |
| Cache Read | $0.50/1M tokens | $0.25/1M tokens | ↓50% | 同上 | 2026-09-18 |
| Flex／Batch Input | $2.50/1M tokens | $1.25/1M tokens | ↓50% | 2026-08-17（OpenRouter） | 2026-09-18 |
| Flex／Batch Output | $15.00/1M tokens | $7.50/1M tokens | ↓50% | 2026-08-17（OpenRouter） | 2026-09-18 |

OpenAI 自家開發者平台（developers.openai.com）的 GPT-5.6 Sol 標準費率在同一時間仍是 $5.00/$30.00，未受影響——這次降價完全發生在兩個第三方路由層。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），改走 OpenRouter 或 Cloudflare AI Gateway 的 Unified Billing 呼叫 GPT-5.6 Sol 標準層。

| | 舊定價（$5/$30） | 新定價（$2.50/$15，促銷期） | 月省 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $2,250 | $1,125 | $1,125 |
| Output 成本/月（150M tokens） | $4,500 | $2,250 | $2,250 |
| **合計** | **$6,750/月** | **$3,375/月** | **$3,375（↓50%）** |

## 對開發者/企業的影響

### 誰最受益

透過 OpenRouter 或 Cloudflare AI Gateway 呼叫 Sol、且用的是平台代管計費（而非自帶 OpenAI API Key）的團隊受益最直接——尤其是本來因為 Sol 定價太高，只能把重活丟給 Terra／Luna 的團隊，現在有一個月的窗口可以用旗艦模型的推理品質，付中階模型的價格。Batch／Flex 大量批次任務（資料標註、離線摘要）受益最大，因為 Flex 層本來就是半價，再疊加促銷後等於原價的四分之一（$1.25/$7.50 對比原本標準價 $5/$30）。

### 競爭格局影響

促銷期間主要模型 Output 定價排名（USD/1M tokens，僅列標準層）：

| 模型 | Output | 備註 |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 7/30 永久降價 |
| Grok 4.6 | $6.00 | — |
| Claude Sonnet 5 | $10.00 | 8/10 已轉永久價 |
| **GPT-5.6 Sol（OpenRouter／Cloudflare 促銷）** | **$15.00** | 只到 9/18，且限非 BYOK 流量 |
| GPT-5.6 Terra | $12.00 | 促銷期間反而比 Sol 貴，排名被打亂 |
| GPT-5.6 Sol（OpenAI 直接呼叫／BYOK） | $30.00 | 標準價未變 |

促銷期間出現一個罕見的錯位：中階的 GPT-5.6 Terra（$12.00）比打折後的旗艦 Sol（$15.00）貴不了多少，但兩者的推理能力有明顯落差，等於促銷窗口內 Sol 的性價比暫時超車自家的 Terra——這只會發生在平台促銷，不會發生在 OpenAI 自家定價表上。

### 行動建議

- 如果你已經用 OpenRouter 或 Cloudflare AI Gateway 呼叫 Sol，且沒有自帶 Key：確認帳務走的是平台代管計費（Unified Billing／非 BYOK），折扣是自動套用，不用改程式碼。
- 如果你目前用 BYOK 或直接呼叫 OpenAI API：這次五折與你無關，價格仍是 $5/$30；若想拿到折扣，需要評估切到平台代管計費是否划算（會失去自帶 Key 的彈性與直接議價空間）。
- 如果你有大量 Batch／Flex 工作負載：現在是鎖量的時機——$1.25/$7.50 這個價位只到 9/18，之後打回 $2.50/$15（Flex 標準半價），規劃批次任務時把這個窗口算進去。

## 時效提醒

⏰ **促銷到期日**：2026-09-18。到期後 OpenRouter／Cloudflare 上的 GPT-5.6 Sol 費率預期打回標準價（Input $5.00、Output $30.00、Flex $2.50/$15.00），OpenAI 自家 API 費率則從未變動。

## 今日收穫

這則新聞真正有意思的地方不是「降價」本身，而是降價發生的位置——不是模型供應商（OpenAI）的定價表，而是兩個互相獨立的推理路由平台，在三天內做出幾乎一樣的動作。過去追蹤定價只要盯供應商官網就好；現在同一個模型可以在供應商、雲端閘道、路由市集上分別掛出不同價格，而且會隨時間各自變動。這代表「這個模型多少錢」已經不是一個問題，而是「透過哪條路徑呼叫」的問題——維護成本比較模型的團隊，現在得把呼叫路徑也當成一個要追蹤的變數。

## 參考資料

- [GPT-5.6 Sol - API Pricing & Benchmarks | OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
- [OpenRouter Halves Price on OpenAI's GPT-5.6 Sol Through September 18 — AI Insiders](https://aiinsiders.net/article/openrouter-halves-price-on-openais-gpt-56-sol-through)
- [Unified Billing Discount for GPT-5.6 Sol Model — Cloudflare AI Gateway Changelog](https://cloudninjas.ca/ai/unified-billing-discount-for-gpt-5-6-sol-model/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
