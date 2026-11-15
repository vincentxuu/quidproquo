---
title: "定價追蹤｜OpenAI 12/11 停用 GPT-5／o3 全系列：旗艦與 Pro 降價 85%+，mini／nano 卻漲 100%-300%"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 官方 deprecations 頁面列出 gpt-5、gpt-5-mini、gpt-5-nano、gpt-5-pro、o3、o3-pro 將於 2026-12-11 停用，分別轉接 GPT-6.1/GPT-6 系列；牌價顯示旗艦與 Pro 層大降，但 mini／nano 層的建議替代模型反而漲價"
tldr: "OpenAI 將於 2026-12-11 停用 gpt-5、gpt-5-mini、gpt-5-nano、gpt-5-pro、o3、o3-pro，改用 GPT-6.1／GPT-6 系列接替。官方費率顯示 gpt-5→gpt-6.1-sol、gpt-5-pro／o3-pro→gpt-6.1-sol（pro 模式）降價 60%-92%，但 gpt-5-mini→gpt-6.1-terra 的 input 漲 300%、output 漲 150%，「換代」在 mini 層其實是漲價。"
series:
  name: "AI Pricing Watch"
  order: 37
---

> 🌏 [English version](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en)

## 變更摘要

OpenAI 的官方 deprecations 頁面把 2026 年 6 月 11 日就發出的停用通知，排進了確定的停用日：2026-12-11，`gpt-5`、`gpt-5-mini`、`gpt-5-nano`、`gpt-5-pro`、`o3`、`o3-pro` 六個模型全數下架，距今 6 個月的最低通知期剛好用滿。這不是單一模型退役，是 GPT-5 和 o3 兩條產品線同時收尾。官方把每個模型都指定了接替對象——`gpt-5`／`o3` 轉去 `gpt-6.1-sol`，`gpt-5-mini` 轉去 `gpt-6.1-terra`，`gpt-5-nano` 轉去 `gpt-6-luna`，`gpt-5-pro`／`o3-pro` 則是轉去 `gpt-6.1-sol` 搭配 Responses API 的 `reasoning.mode: pro` 參數，而不是獨立的 Pro 模型。把六組新舊費率對齊之後，會看到一個不對稱的結果：旗艦層（`gpt-5`→`gpt-6.1-sol`）和 Pro 層（`gpt-5-pro`／`o3-pro`→同樣是 `gpt-6.1-sol`）的牌價大跌，但 mini 層（`gpt-5-mini`→`gpt-6.1-terra`）的牌價反而大漲——同一次換代公告，對不同預算層的開發者是完全相反的消息。

## 前後對照

| 項目 | 舊（2026-12-11 前） | 新（建議替代模型） | 變化 | 生效日 |
|---|---|---|---|---|
| gpt-5 Input | $1.25/1M tokens | gpt-6.1-sol：$2.00/1M tokens | ↑60% | 2026-12-11 |
| gpt-5 Output | $10.00/1M tokens | gpt-6.1-sol：$10.00/1M tokens | 持平 | 2026-12-11 |
| gpt-5-mini Input | $0.25/1M tokens | gpt-6.1-terra：$1.00/1M tokens | ↑300% | 2026-12-11 |
| gpt-5-mini Output | $2.00/1M tokens | gpt-6.1-terra：$5.00/1M tokens | ↑150% | 2026-12-11 |
| gpt-5-nano Input | $0.05/1M tokens | gpt-6-luna：$0.10/1M tokens | ↑100% | 2026-12-11 |
| gpt-5-nano Output | $0.40/1M tokens | gpt-6-luna：$0.50/1M tokens | ↑25% | 2026-12-11 |
| gpt-5-pro Input | $15.00/1M tokens | gpt-6.1-sol（`reasoning.mode: pro`）：$2.00/1M tokens | ↓87% | 2026-12-11 |
| gpt-5-pro Output | $120.00/1M tokens | gpt-6.1-sol（`reasoning.mode: pro`）：$10.00/1M tokens | ↓92% | 2026-12-11 |
| o3 Input | $2.00/1M tokens | gpt-6.1-sol：$2.00/1M tokens | 持平 | 2026-12-11 |
| o3 Output | $8.00/1M tokens | gpt-6.1-sol：$10.00/1M tokens | ↑25% | 2026-12-11 |
| o3-pro Input | $20.00/1M tokens | gpt-6.1-sol（`reasoning.mode: pro`）：$2.00/1M tokens | ↓90% | 2026-12-11 |
| o3-pro Output | $80.00/1M tokens | gpt-6.1-sol（`reasoning.mode: pro`）：$10.00/1M tokens | ↓87.5% | 2026-12-11 |

Pro 層的降幅是牌價比較，不是帳單保證——`reasoning.mode: pro` 把過去獨立計價的 Pro 模型，改成同一個模型多消耗的思考 token，若遷移後的任務需要更長的推理鏈，實際花費的 token 數可能比舊模型多，單純比「每百萬 token 多少錢」會低估真實成本，要先用自己的任務跑過才能確認省了多少。

## 成本試算

**場景**：一個用 `gpt-5-mini` 做大量文本分類與擷取的 Agent，每天處理 50,000 次請求（平均每次 800 input tokens + 200 output tokens），以 30 天計。

| | gpt-5-mini（現行） | gpt-6.1-terra（12/11 起接替） | 月差 |
|---|---|---|---|
| Input 成本/月（1,200M tokens） | $300.00 | $1,200.00 | +$900.00（↑300%） |
| Output 成本/月（300M tokens） | $600.00 | $1,500.00 | +$900.00（↑150%） |
| **合計** | **$900.00** | **$2,700.00** | **+$1,800.00（↑200%）** |

這個規模的分類／擷取工作負載正是 mini 層最常見的用法，單月帳單直接變成三倍。相對地，若同一團隊同時也用 `gpt-5-pro` 跑少量但長推理的任務（例如每天 500 次、平均 3,000 input + 2,000 output tokens），換成 `gpt-6.1-sol`（pro 模式）牌價計算的月成本會從 $367.50 降到 $90.00，降幅 75%——同一家公司、同一次公告，兩種用量模式算出完全相反的結論。

## 對開發者/企業的影響

### 誰最受益

把 `gpt-5-pro` 或 `o3-pro` 用在深度推理、長報告生成的團隊受益最大——牌價直接砍 85% 以上，而且是官方主動把「Pro」從獨立模型變成一個參數，不用另外申請權限。相對地，用 `gpt-5-mini` 做高頻、低成本任務（分類、路由、摘要抽取）的團隊是這次公告裡唯一的受害者，而這恰好是 mini 層最大宗的使用場景。

### 競爭格局影響

12/11 之後的主要「省錢層」模型價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna／Claude Haiku 5.5（起） | $0.10 | $0.50 | gpt-5-nano 的接替，與 Haiku 5.5 最低階打平 |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | 未受這次公告影響 |
| **GPT-6.1 Terra（12/11 起）** | **$1.00** | **$5.00** | gpt-5-mini 的接替，漲價後已經脫離「mini／nano 級」價位 |
| GPT-6.1 Sol／Claude Sonnet 5.5 | $2.00 | $10.00 | gpt-5／o3 的接替，與 Sonnet 5.5 同價 |

漲價後的 `gpt-6.1-terra`（$1.00/$5.00）已經比 `gemini-3.5-flash-lite`（$0.30/$2.50）貴 3 倍以上，過去用 `gpt-5-mini` 卡在「比 nano 貴一點、換取更好品質」價位的團隊，現在要直接面對一個跟中階模型只差一半的費率，原本的性價比定位被打掉了。

### 行動建議

- 如果你在用 `gpt-5-mini` 做高量、低單價的任務：先用自己的資料跑一次 `gpt-6-luna`（nano 接替，只小漲）和 `gemini-3.5-flash-lite` 的品質評測，不要預設直接遷到官方指定的 `gpt-6.1-terra`——官方的「建議替代」是對齊能力定位，不是對齊價格
- 如果你在用 `gpt-5-pro` 或 `o3-pro`：12/11 前先用小流量測 `reasoning.mode: pro`，確認同一個任務實際耗用的思考 token 量，不要只看牌價降幅就假設帳單會降 85%
- 如果你在用 `gpt-5` 或 `o3` 一般模型：遷到 `gpt-6.1-sol` 基本是中性偏漲（input 多付一些，output 大致持平），可以同時評估遷移成本是否值得，或考慮 `gpt-6.1-terra` 作為部分任務的降級選項（即使它也漲價了，仍比 sol 便宜一半）

## 時效提醒（如有促銷/sunset）

⚠️ **停用日期**：2026-12-11。`gpt-5`、`gpt-5-mini`、`gpt-5-nano`、`gpt-5-pro`、`o3`、`o3-pro` 及其所有快照版本（含用這些模型微調的版本）將全數停止接受請求。遷移指南：[GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-migration-quickstart)。

## 今日收穫

「官方指定的建議替代模型」常被當成「價格也差不多」的隱含保證，但這次公告戳破了這個假設——同一份停用公告裡，旗艦和 Pro 層降價 60%-92%，mini 層卻漲價 150%-300%，六個模型只用一張表列出，沒有特別標示哪些是漲、哪些是降。追蹤定價變動時，「被指定的替代模型」只告訴你官方認為能力相近，不代表費率也相近，尤其是在低價位層，廠商更容易把舊的超低價位模型下架、改用一個名義上對應但實際上貴更多的新模型頂替，這種漲價比旗艦層的漲價更容易被忽略，因為帳單總額看起來還是「便宜的那一層」。

## 參考資料

- [OpenAI: Deprecations（官方頁，`gpt-5`／`gpt-5-mini`／`gpt-5-nano`／`gpt-5-pro`／`o3`／`o3-pro` 2026-12-11 停用日與建議替代模型）](https://developers.openai.com/api/docs/deprecations)
- [OpenAI: API Pricing（官方定價頁，`gpt-6.1-sol`／`gpt-6.1-terra`／`gpt-6-luna` 現行費率與 `gpt-5`／`o3` 系列舊費率對照）](https://developers.openai.com/api/docs/pricing)
- [Anthropic: Models overview（官方模型總覽，Claude Haiku 5.5／Sonnet 5.5 現行費率，供競爭格局對照）](https://platform.claude.com/docs/en/models/overview)
- [本系列 11/04：Gemini 2.5 Pro／Flash 補上 Developer API 停用日](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)
- [tokencost.app: LLM API Price Changes, November 2026: The Dec 1 Cliff（2026-11-14，獨立報導同一批 OpenAI 12 月停用時程）](https://tokencost.app/blog/llm-api-price-changes-november-2026)
