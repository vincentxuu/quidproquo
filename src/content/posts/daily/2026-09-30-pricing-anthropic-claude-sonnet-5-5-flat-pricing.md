---
title: "定價追蹤｜Claude Sonnet 5.5 API 定價原封不動，Anthropic 靠「更少 token」宣稱省 30%"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 官方定價頁與發表頁雙重確認：Claude Sonnet 5.5 的 API 單價與 Sonnet 5 完全相同（$2/$10 per 1M tokens），宣傳的『成本降 30%』來自效率而非降價"
tldr: "Claude Sonnet 5.5 於 2026-09-29 發表，API 定價與前代 Sonnet 5 完全相同：input $2.00、output $10.00、cache read $0.20（皆為 USD/1M tokens），單價變化是 0%。Anthropic 宣傳的『成本降最多 30%』來自同任務所需 token 數變少、工具呼叫次數變少，不是調降單價——這代表實際省多少完全取決於你的工作負載能不能吃到這個效率提升，不是保證值。"
series:
  name: "AI Pricing Watch"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing-en)

## 變更摘要

Anthropic 在 2026-09-29 發表 Claude Sonnet 5.5，官方頁面標題寫著「costs up to 30% less for most work」，乍看像一次降價公告。但對照官方定價頁會發現：input、output、cache read 三項單價跟 Sonnet 5 一字不差，都是 $2.00／$10.00／$0.20 per 1M tokens。這次不是降價，是「同價格、換更省 token 的模型」——30% 的成本下降是效率提升換來的，不是帳單上的單價數字變小，兩者對預算規劃的意義完全不同。

## 前後對照

| 項目 | Sonnet 5 | Sonnet 5.5 | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $2.00/1M tokens | $2.00/1M tokens | 0% | 2026-09-29 |
| Output | $10.00/1M tokens | $10.00/1M tokens | 0% | 2026-09-29 |
| Cache Read | $0.20/1M tokens | $0.20/1M tokens | 0% | 2026-09-29 |
| Cache Write（5m） | $2.50/1M tokens | $2.50/1M tokens | 0% | 2026-09-29 |
| Batch Input | $1.00/1M tokens | $1.00/1M tokens | 0% | 2026-09-29 |
| Batch Output | $5.00/1M tokens | $5.00/1M tokens | 0% | 2026-09-29 |

單價全數持平，這本身就是值得記錄的訊號：Anthropic 選擇把 Sonnet 5.5 定位成「用同一個價格帶做更多事」，而不是像 GPT-6 Sol／Luna 那樣直接砍價競爭（見 [09-28 定價追蹤](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)）。

## 成本試算

官方沒有給單一的「省 30%」換算公式，而是分場景舉例。取官方頁面引用 Slack 的實測數字最具體：「幾乎所有 offline Slackbot evals 都比 Sonnet 5 表現更好，步驟更少、output token 少了約 14%」。

**場景**：一個每天處理 10,000 則任務的 Slackbot 型 Agent（平均每則 1,500 input tokens + 800 output tokens），從 Sonnet 5 換成 Sonnet 5.5，output token 用量比照 Slack 案例減少 14%。

| | Sonnet 5 | Sonnet 5.5 | 月省 |
|---|---|---|---|
| Input 成本/月（同用量） | $900 | $900 | $0 |
| Output 成本/月 | $2,400 | $2,064 | $336 |
| **合計** | **$3,300/月** | **$2,964/月** | **$336（↓10.2%）** |

這個保守估計只有 10.2%，離官方標題的「最多 30%」有明顯落差。差距來自官方的 30% 數字是特定 benchmark、特定 effort 設定下的上限：例如 FrontierCode 在 High effort 下，Sonnet 5.5 用約十五分之一的單任務成本拿到比 Sonnet 5 高 10 分的分數；Terminal-Bench 4.0 在 Claude Code 預設的 Medium effort 下，Sonnet 5.5 用不到十分之一的成本就超越 Sonnet 5 的最佳分數。這些是「用更低 effort 設定達到更高分數」的極端案例，不是所有工作負載的平均值——重度依賴長 context、高 effort 設定的任務，實際省下的比例會遠低於 30%。

## 對開發者/企業的影響

### 誰最受益

任務型態偏向「大量重複、可用低 effort 設定完成」的場景受益最大——分類、格式化文件／簡報、例行程式除錯。這類任務原本就不需要 Sonnet 5 的高 effort 設定，換成 Sonnet 5.5 後用更低 effort 就能達到相同或更好品質，同時吃到 token 數減少的雙重效果。反過來，本來就需要 Sonnet 5 高 effort、長 context 的複雜任務，換模型後省下的比例會小很多，甚至可能因為要驗證輸出品質而增加人力成本。

### 競爭格局影響

主要模型目前的定價排名（input／output，USD/1M tokens，標準短 context 價）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | 最便宜的高能力模型（見 09-28 定價追蹤） |
| Claude Haiku 4.5 | $0.80 | $4.00 | Anthropic 目前最便宜的一般用模型 |
| GPT-6 Sol | $2.00 | $10.00 | 09-22 上線後與 Sonnet 系列同價 |
| **Claude Sonnet 5.5（新）** | **$2.00** | **$10.00** | 與 GPT-6 Sol 單價完全打平，比拚的是「同價格誰更省 token」 |
| Claude Opus 5.5 | $4.00 | $20.00 | 09-22 上線，比前代 Opus 5 降 20%（見 [09-25 模型卡](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)） |

Sonnet 5.5 上線後，Anthropic 和 OpenAI 在同一個 $2/$10 價位帶正面對決：GPT-6 Sol 靠的是比前代促銷價再砍 50%，Sonnet 5.5 靠的是同價格但宣稱更少 token 完成同任務。兩種策略殊途同歸，都是把「單任務總成本」而非「單價」當成競爭指標——這代表接下來比較模型該看的數字，會愈來愈少是牌價表上的 $/1M tokens，愈來愈多是「這個任務實際燒了多少 token」。

### 行動建議

- 如果你在用 Sonnet 5 跑客服／文件生成類任務：直接測試切到 Sonnet 5.5，同價格下大機率省 token，遷移成本低（API 相容，只是 model ID 換成 `claude-sonnet-5-5`）
- 如果你的任務本來就用 Sonnet 5 的高 effort／長 context 設定：先用自己的任務跑對照組，不要直接假設能省到官方標題講的 30%，實測後的落差可能比想像大
- 如果你在比較 Sonnet 5.5 跟 GPT-6 Sol：兩者單價完全相同（$2/$10），選型應該回到 benchmark 表現與你任務型態的契合度，價格已經不是決定因素
- 若團隊原本把「thinking 關閉」當成省成本手段：Sonnet 5.5 改用新的 `between_tools` 設定取代舊的關閉開關，升級前先看官方 migration guide，避免相容性斷裂

## 今日收穫

看到「costs up to 30% less」這種標題，直覺會先去查定價頁有沒有調價——這次查完發現單價一分錢都沒變，30% 完全來自「同任務用更少 token」。這提醒一件事：廠商講的「降價」不等於「調降牌價」，效率提升換算出來的成本下降同樣可以包裝成降價新聞，但兩者對長期預算規劃的可靠度完全不同——調降牌價是保證生效的常數，效率提升的省幅會隨任務類型大幅浮動，甚至在某些場景下趨近於零。

## 參考資料

- [Anthropic：Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)
- [Claude Platform Docs：Model pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [VentureBeat：Anthropic launches Claude Sonnet 5.5 with 30% cost reduction per-task due to faster speeds and fewer tool calls](https://venturebeat.com/technology/anthropic-launches-claude-sonnet-5-5-with-30-cost-reduction-per-task-due-to-faster-speeds-and-fewer-tool-calls)
