---
title: "定價追蹤｜OpenAI 新增 Ultrafast 速度層級，Pro 200 方案用量砍半"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 在 DevDay 2026 為 GPT-6 Astra API 新增貴 6 倍的 Ultrafast 速度層級，同時把 ChatGPT Pro 200 的 Codex／Work 用量上限砍半，改推 $500 的 Pro 500 方案"
tldr: "OpenAI 於 2026-09-29 DevDay 為 GPT-6 Astra API 新增 Ultrafast 速度層級：input/output 漲到 Standard 的 6 倍（短 context $60/$300 per 1M tokens），換取 API 最高 6 倍、Codex 最高 8 倍的生成速度；同時 ChatGPT Pro 200 的 Codex／Work 用量上限從 20x Plus 砍到 10x Plus，既有訂閱戶延至 2026-10-29 才降級並獲發 2026-12-31 到期的 $2,500 usage credit；新方案 Pro 500（$500/月、25x Plus）成為唯一內建 Ultrafast 的訂閱層級。"
series:
  name: "AI Pricing Watch"
  order: 14
---

> 🌏 [English version](/en/posts/daily/2026-10-02-pricing-openai-ultrafast-pro-200-allowance-cut-en)

## 變更摘要

OpenAI 在 DevDay 2026 上同時做了兩件方向相反的定價動作：一邊幫 GPT-6.1 Sol 用五分之一的成本追平旗艦表現（見 [09-30 模型卡](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)），一邊卻幫旗艦 GPT-6 Astra 開了一個貴六倍的「用錢買速度」層級 Ultrafast。同一場發表會上，ChatGPT Pro 200 訂閱的 Codex／Work 用量上限直接砍半，新推出的 Pro 500（$500/月）才內建這個新速度層級。這代表 OpenAI 正在把「多快」拆成一個可以獨立計價的維度，不再只靠「多聰明」和「多便宜」兩軸競爭——對重度使用 Codex 的團隊來說，這次改版實質上是把舊 Pro 200 的部分用量轉嫁到新的高價層級。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-6 Astra API Input（短 context） | 無此層級（Fast 層級 $20.00/1M） | Ultrafast $60.00/1M tokens | 新增層級，為 Standard 的 6 倍 | 2026-09-29 |
| GPT-6 Astra API Output（短 context） | 無此層級（Fast 層級 $100.00/1M） | Ultrafast $300.00/1M tokens | 新增層級，為 Standard 的 6 倍 | 2026-09-29 |
| GPT-6.1 Sol API Input（短 context） | 無 Fast 層級（僅 Standard $2.00/1M） | Fast $4.00/1M tokens | 新增層級，為 Standard 的 2 倍 | 2026-09-29 |
| GPT-6.1 Sol API Output（短 context） | 無 Fast 層級（僅 Standard $10.00/1M） | Fast $20.00/1M tokens | 新增層級，為 Standard 的 2 倍 | 2026-09-29 |
| ChatGPT Pro 200：Codex／ChatGPT Work 用量上限 | 20x Plus 用量 | 10x Plus 用量 | ↓50% | 既有戶 2026-10-30 起降級；新訂閱即日生效 |
| ChatGPT Pro 500（新方案） | 不存在 | $500/月，25x Plus 用量＋內建 Ultrafast | 新增方案 | 2026-09-29 |

Astra 的 Ultrafast 號稱 API 最高 6 倍、Codex 最高 8 倍（300 tokens/秒）生成速度，用量先扣訂閱內建額度，額度用完才扣 credit 餘額；GPT-6.1 Sol 的 Ultrafast OpenAI 官方說「即將推出」，目前只開放 Astra。

## 成本試算

**場景**：一個每天在 GPT-6 Astra 上跑 agentic coding 任務的團隊，透過 API 處理 500 萬 input tokens + 200 萬 output tokens（短 context），把流量全部從 Standard 切到 Ultrafast。

| | Standard | Ultrafast | 月增 |
|---|---|---|---|
| Input 成本/月 | $1,500 | $9,000 | $7,500 |
| Output 成本/月 | $3,000 | $18,000 | $15,000 |
| **合計** | **$4,500/月** | **$27,000/月（↑500%）** | **$22,500** |

500% 的漲幅換來的是速度，不是品質——OpenAI 的公告裡沒有提到 Ultrafast 在任何 benchmark 上分數更高，純粹是同一個模型跑得更快。換算成訂閱方案的用量單位也能看出同樣的落差：Pro 200 的 20x Plus 用量以 Plus 的 $20/月為基準約值 $400，砍到 10x 後約值 $200——既有訂閱戶實質上少了一半的月度額度，OpenAI 用一次性的 $2,500 credit 補償，但這筆 credit 只夠蓋約 12 個月的差額，卻只給 3 個月就到期。

## 對開發者/企業的影響

### 誰最受益

Ultrafast 的目標使用者是對延遲極度敏感、而且確定速度本身能換成業務價值的場景——例如面向使用者的即時程式碼補全、需要在對話中即時完成多輪工具呼叫的互動式 agent。這類場景多付 5 倍的錢換 6-8 倍的速度是合理交易。但大多數背景批次、非同步的 agent 工作（程式碼審查、測試產生、文件整理）本來就不需要即時回應，硬是切到 Ultrafast 只是白白多付 500% 的成本。

### 競爭格局影響

「用錢買速度」不是 OpenAI 首創——Google 的 Gemini API 已有 Priority 層級（約 1.8 倍 Standard 價格換優先處理），但 OpenAI 這次的加價幅度明顯更陡：

| 廠商／層級 | 加價倍數 | 換取 |
|---|---|---|
| Google Gemini Priority | 1.8x | 優先處理，非保證更快 |
| OpenAI GPT-6 Astra Fast（既有） | 2x | 最高 2.5x 速度 |
| **OpenAI GPT-6 Astra Ultrafast（新）** | **6x** | **API 最高 6x、Codex 最高 8x（300 tokens/秒）** |

OpenAI 把速度分成三個價位帶（Standard／Fast／Ultrafast）而不是兩個，等於把「速度」切得更細、議價空間也更大——這對正在比較各家定價表的團隊來說，意味著未來看牌價不能只看 input/output 單價，還要看清楚這是哪個速度層級的價格。

### 行動建議

- 如果你用 Astra 跑的是背景批次任務：留在 Standard 就好，Ultrafast 對你沒有任何好處，純粹是多付錢
- 如果你是即時互動場景且延遲是硬指標：先用小流量實測 Ultrafast 的實際加速幅度是否達到官方宣稱的 6-8 倍，再決定要不要把整條 pipeline 切過去，避免為了理論上限多付了 500% 卻沒拿到對應效果
- 如果你是既有 Pro 200 訂閱戶：10/29 前用掉現有額度規劃好的工作量，10/30 降級後立刻用掉那筆到 12/31 到期的 $2,500 credit，別讓它過期浪費
- 如果你在考慮升級 Pro 500：先算清楚你實際需要多少 Ultrafast 用量——多數團隊直接在 API 上按需使用 Ultrafast，仍會比固定月付 $500 訂閱划算

## 時效提醒

⏰ **既有 Pro 200 用量上限保留到**：2026-10-29。10/30 起既有訂閱戶的 Codex／ChatGPT Work 用量上限從 20x Plus 降到新上限（10x Plus）。
⏰ **一次性 $2,500 usage credit 到期日**：2026-12-31。降級後發放的 credit 若未用完，過期即失效，不會展延。

## 今日收穫

大家在討論 GPT-6.1 Sol 用五分之一成本追平旗艦表現時，容易忽略同一場發表會也在幫旗艦模型開了一個貴六倍的「用錢買速度」層級——這代表 OpenAI 正在把「多快」變成第三個可以獨立計價的維度，跟「多聰明」「多便宜」並列。對 Agent 開發者來說，往後比較定價表，除了 input/output 單價，還要多確認一欄「這個速度要加價多少」，否則很容易把 Fast 或 Ultrafast 的試算結果誤認成 Standard 的正常成本。

## 參考資料

- [OpenAI：DevDay 2026 Recap](https://openai.com/index/devday-2026-recap)
- [OpenAI API：Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI Help Center：About ChatGPT Pro tiers](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)
- [TheNextWeb：OpenAI halves Pro 200 usage and launches a $500 ChatGPT plan at DevDay](https://thenextweb.com/news/openai-devday-pro-200-usage-cut-pro-500-plan)
- [VentureBeat：OpenAI's GPT-6.1 Sol offers Astra-like performance at 1/5th price. A new Ultrafast tier clocks at 300 tokens per second.](https://venturebeat.com/technology/openais-gpt-6-1-sol-offers-astra-like-performance-at-1-5th-price-a-new-ultrafast-tier-clocks-at-300-tokens-per-second)
