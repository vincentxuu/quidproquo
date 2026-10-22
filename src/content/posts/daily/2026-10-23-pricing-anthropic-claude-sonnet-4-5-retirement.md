---
title: "定價追蹤｜Claude Sonnet 4.5 將於 11/30 退役，官方替代降價 33% 但帳單省不到那麼多"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 將於 2026-11-30 退役 Claude Sonnet 4.5（claude-sonnet-4-5-20250929），建議遷移至定價降 33% 的 Claude Sonnet 5.5，但新 tokenizer 讓實際省幅縮水到約 13%"
tldr: "Claude Sonnet 4.5 於 2026-11-30 從 Claude API、Claude Platform on AWS、Microsoft Foundry 退役，無寬限期；官方建議替代 Claude Sonnet 5.5 單價降 33%（input $3→$2、output $15→$10），但 Sonnet 5.5 的新 tokenizer 讓同樣文字多產生約 30% token，實際帳單省幅通常落在 10-15%，不是牌面的 33%。"
series:
  name: "AI Pricing Watch"
  order: 27
---

> 🌏 [English version](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en)

## 變更摘要

Anthropic 在 2026-09-30 公告、11/30 正式生效：Claude Sonnet 4.5（`claude-sonnet-4-5-20250929`）將從 Claude API、Claude Platform on AWS、Microsoft Foundry 退役，之後的請求直接失敗，沒有寬限期。官方建議的替代模型是 Claude Sonnet 5.5，單價比 Sonnet 4.5 便宜 33%（input $3→$2、output $15→$10／1M tokens）。乍看是「被迫遷移還倒賺」，但 Sonnet 5.5 用的新 tokenizer 會讓同樣內容多產生約 30% token，牌價降幅和實際帳單降幅因此是兩個不同的數字——這跟 09-30 Sonnet 5.5 剛上市時「單價不變、靠省 token 宣稱降成本」的現象,剛好是同一枚硬幣的另一面。

## 前後對照

| 項目 | 舊（Sonnet 4.5） | 新（Sonnet 5.5） | 變化 | 退役日 |
|---|---|---|---|---|
| Input | $3.00/1M tokens | $2.00/1M tokens | ↓33% | 2026-11-30 |
| Output | $15.00/1M tokens | $10.00/1M tokens | ↓33% | 2026-11-30 |
| Cache Read | $0.30/1M tokens | $0.10/1M tokens | ↓67% | 2026-11-30 |
| Cache Write（1h） | $6.00/1M tokens | $4.00/1M tokens | ↓33% | 2026-11-30 |
| Batch Input | $1.50/1M tokens | $1.00/1M tokens | ↓33% | 2026-11-30 |
| Batch Output | $7.50/1M tokens | $5.00/1M tokens | ↓33% | 2026-11-30 |

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），目前還在用 `claude-sonnet-4-5-20250929` 跑生產，11/30 前必須遷移。月用量約 450M input tokens、150M output tokens。

Anthropic 的 migration guide 指出，Sonnet 5.5 的新 tokenizer 對同樣文字會多產生約 30% token，所以這裡用「單價降 33%、token 數增加 30%」的保守估計，而不是直接套用牌價降幅：

| | 舊定價（Sonnet 4.5） | 新定價（Sonnet 5.5，計入 token 增量） | 月省 |
|---|---|---|---|
| Input 成本/月 | $1,350 | $1,170 | $180 |
| Output 成本/月 | $2,250 | $1,950 | $300 |
| **合計** | **$3,600/月** | **$3,120/月** | **$480（↓13.3%）** |

如果假設 token 數不變（純粹套牌價），同一個場景會省到 $1,200（↓33.3%）——這也是為什麼只看「input 降 33%、output 降 33%」這兩個數字去估預算，實際帳單出來後很容易覺得「怎麼沒省那麼多」。

## 對開發者/企業的影響

### 誰最受益

所有還在呼叫 Sonnet 4.5 的團隊都被迫在 11/30 前做出選擇，其中高 output 比例的 Agent 工作負載受益最明顯——output 單價降幅和 input 一樣是 33%，但 output 通常佔 Agent 總成本更大比重。不過這次「被迫遷移」本身不等於「保證省錢」：如果你的任務高度依賴 assistant prefill、固定的 `temperature`／`thinking budget` 設定，遷移的工程成本可能先於省下的帳單出現。

### 競爭格局影響

目前幾個主要模型的定價排名（input／output，USD/1M tokens，標準短 context 價）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | 最便宜的高能力模型（見 [09-28 定價追蹤](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)） |
| Claude Haiku 4.5 | $1.00 | $5.00 | Anthropic 目前最便宜的一般用模型 |
| GPT-6 Sol | $2.00 | $10.00 | — |
| **Claude Sonnet 5.5（官方建議替代）** | **$2.00** | **$10.00** | 跟 GPT-6 Sol 同價，比被退役的 Sonnet 4.5 便宜 33% |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 跟 Sonnet 4.5 同價、同 tokenizer，可當暫時過渡，但不是官方推薦的長期替代 |
| Claude Sonnet 4.5（退役中） | $3.00 | $15.00 | 2026-11-30 起 API 呼叫全部失敗 |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

Sonnet 5.5 退役後接手的定位，跟 GPT-6 Sol 卡在完全相同的 $2/$10 價位帶——這代表 Anthropic 這次遷移同時也是一次對 OpenAI 的價格卡位，被退役模型的使用者會被自然推去跟 GPT-6 Sol 正面比較。

### 行動建議

- 如果你還在呼叫 `claude-sonnet-4-5-20250929` 或別名 `claude-sonnet-4-5`：現在就排遷移，11/30 之後的請求沒有寬限期，直接失敗。
- 遷移前先用 Anthropic 的 token counting endpoint 量自己實際的 prompt，不要直接套「省 33%」的牌價估計——新 tokenizer 讓同樣文字多出約 30% token，保守估計實際省幅落在 10-15%。
- 換模型不是只改 model ID：Sonnet 5.5 對 assistant prefill、`thinking` 的 `budget_tokens`、`temperature`／`top_p`／`top_k`、強制 tool use 都會回 400 error，migration guide 列的這幾項要先改完再上線。
- 不想立刻改程式碼、只想先避免斷線：可以先搬到 Claude Sonnet 4.6（同價 $3/$15、同 tokenizer），但它不是官方推薦的長期替代，退役日目前也只訂到「不早於 2027-02-17」，等於把遷移往後延，不是解決問題。
- Amazon Bedrock／Google Cloud 使用者：這次 11/30 的期限只管 Claude API、Claude Platform on AWS、Microsoft Foundry 三個 Anthropic 自家平台，Bedrock 和 Vertex AI 各自訂時程，先查各自的 model table，不要假設跟 11/30 同步。

## 時效提醒（如有促銷/sunset）

⚠️ **停用日期**：2026-11-30。`claude-sonnet-4-5-20250929`（含別名 `claude-sonnet-4-5`）在 Claude API、Claude Platform on AWS、Microsoft Foundry 上停止回應請求，無寬限期。Amazon Bedrock 與 Google Cloud 各自訂時程，需另查對應 model table。遷移指南：[Claude Sonnet 5.5 Migration Guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide)。

## 今日收穫

模型退役公告常被當成「維運待辦」處理，容易忽略它同時也是一次定價事件——這次官方替代模型牌價降 33%，看起來像純粹的好消息，但 tokenizer 改變吃掉了一大半的降幅，實際帳單省幅可能只有牌價降幅的三分之一到一半。這跟 [09-30 Sonnet 5.5 上市時](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)「單價不變、靠省 token 宣稱降成本」的現象，剛好是同一枚硬幣的兩面：定價數字和帳單數字之間，永遠隔著一個會變動的 token 用量，兩次都是同一個教訓從不同方向重複出現。

## 參考資料

- [Claude Platform Docs：Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Claude Platform Docs：Model pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [AionX：Claude Sonnet 4.5 Retirement: Migrate by Nov 30](https://aionx.co/claude-ai-reviews/claude-sonnet-4-5-retirement/)
