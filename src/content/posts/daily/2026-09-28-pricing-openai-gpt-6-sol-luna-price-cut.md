---
title: "定價追蹤｜OpenAI 發布 GPT-6 Sol／Luna，API 定價比 GPT-5.6 促銷價再砍 50%"
date: 2026-09-28
category: daily
lang: zh-TW
type: digest
tags: [ai-agent, pricing, daily, openai]
description: "OpenAI 官方定價頁確認：GPT-6 Sol／Luna 於 2026-09-22 上線，API 價格比 GPT-5.6 Sol／Luna 的促銷價再降 50% 起，且舊款 GPT-5.6 Sol 的促銷價本身也只保證到 2026-11-21"
tldr: "OpenAI 官方公告與定價頁確認：GPT-6 Sol input 從 $4.00 降到 $2.00/1M tokens（↓50%）、output 從 $20.00 降到 $10.00（↓50%）；GPT-6 Luna input 從 $0.20 降到 $0.10（↓50%）、output 從 $1.20 降到 $0.50（↓58%），2026-09-22 生效。降價基準是 GPT-5.6 系列的『促銷價』而非原價，而 GPT-5.6 Sol 的促銷價官方寫明只保證到 2026-11-21——這代表 GPT-6 Sol 現在的 $2/$10 才是這輪真正該拿來比較的長期基準價。"
series:
  name: "AI Pricing Watch"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut-en)

## 變更摘要

OpenAI 在 GPT-6 Astra 發布 19 天後，於 2026-09-22 補上兩個更便宜的家族成員：GPT-6 Sol 和 GPT-6 Luna。官方公告寫得很直接——這兩款不是「Astra 的縮水版」，而是用同一套訓練方法把 Astra 的能力壓進更小、更便宜的模型裡，API 價格比 GPT-5.6 Sol／Luna 的促銷價再砍 50% 起。真正值得注意的是基準：官方定價頁自己註明「GPT-5.6 Sol 的促銷價至少保證到 2026-11-21」，也就是說這次降價比的是一個本來就有到期日的臨時價，GPT-6 Sol 的 $2/$10 才是接下來要長期用的價格。

## 前後對照

| 項目 | 舊（GPT-5.6） | 新（GPT-6） | 變化 | 生效日 |
|---|---|---|---|---|
| Sol Input | $4.00/1M tokens | $2.00/1M tokens | ↓50% | 2026-09-22 |
| Sol Output | $20.00/1M tokens | $10.00/1M tokens | ↓50% | 2026-09-22 |
| Sol Cached Input | $0.40/1M tokens | $0.20/1M tokens | ↓50% | 2026-09-22 |
| Sol Batch Input | $2.00/1M tokens | $1.00/1M tokens | ↓50% | 2026-09-22 |
| Sol Batch Output | $10.00/1M tokens | $5.00/1M tokens | ↓50% | 2026-09-22 |
| Luna Input | $0.20/1M tokens | $0.10/1M tokens | ↓50% | 2026-09-22 |
| Luna Output | $1.20/1M tokens | $0.50/1M tokens | ↓58% | 2026-09-22 |
| Luna Cached Input | $0.02/1M tokens | $0.01/1M tokens | ↓50% | 2026-09-22 |

Luna 的 output 降幅（58%）比官方公告寫的「50% cheaper」更大，因為官方那句話是四捨五入的概括說法，實際定價頁的數字是 $1.20 → $0.50。Input／Cached Input 兩項才是精確的 50%。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），從 GPT-5.6 Sol 切到 GPT-6 Sol。

| | GPT-5.6 Sol | GPT-6 Sol | 月省 |
|---|---|---|---|
| Input 成本/月（15M tokens/日） | $1,800 | $900 | $900 |
| Output 成本/月（5M tokens/日） | $3,000 | $1,500 | $1,500 |
| **合計** | **$4,800/月** | **$2,400/月** | **$2,400（↓50%）** |

同樣的算法套在 Luna 上更明顯：假設一個每天跑 500,000 次意圖分類/資料清理的輕量 Agent（每次 300 input + 50 output tokens），GPT-5.6 Luna 的月成本約 $1,800，換成 GPT-6 Luna 後降到約 $825，省下 54%——這個場景 output 占比較高，所以吃到的是 Luna output 那段 58% 的降幅，而不是平均的 50%。

## 對開發者/企業的影響

### 誰最受益

高 output 比例、又不需要 Astra 級推理深度的 Agent 應用受益最大：coding agent 的長 diff 輸出、客服對話的完整回覆、分類/摘要類的批次任務，都是 output 定價敏感的場景。官方公告特別提到內部 coding agent 用量「daily token usage 中位數已超過 $600、90th percentile 超過 $7,000」——這解釋了為什麼 OpenAI 這次選擇把降價重心放在 Sol／Luna 而不是 Astra：高頻、長時間跑的 agent 工作負載，才是真正被 token 價格卡住規模的地方。

### 競爭格局影響

主要模型目前的定價排名（input／output，USD/1M tokens，皆為短context標準價）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | 降價後最便宜的 GPT-6 系列成員 |
| Claude Haiku 4.5 | $1.00 | $5.00 | 高能力模型中最便宜 |
| **GPT-6 Sol（新價）** | **$2.00** | **$10.00** | 降價後與多數同級競品拉開差距 |
| Claude Sonnet 5 | $4.00 | $10.00 | Output 與 GPT-6 Sol 持平，Input 貴一倍 |
| GPT-6 Astra | $10.00 | $50.00 | 旗艦模型，價格未變 |
| Claude Opus 5 | $15.00 | $75.00 | 最貴 |

降價後 GPT-6 Sol 的 output 價格與 Claude Sonnet 5 打平，但 input 只要 Sonnet 5 的一半——對 input 密集的場景（長 context、大量文件檢索）是明顯的價格優勢。官方公告也附了自家 benchmark 佐證：AutomationBench 上 GPT-6 Sol（xhigh）成本只要 Claude Opus 5（max）的 9%，但這類廠商自報數字通常挑對自己有利的比較條件，實際選型仍建議用自己的任務跑一次 eval。

### 行動建議

- 如果你目前用 GPT-5.6 Sol 跑生產：直接切到 GPT-6 Sol 幾乎沒有代價——同一套 API 格式、價格砍半，官方數據顯示多項 benchmark 分數也是提升的，沒有理由不遷移。
- 如果你在用 GPT-5.6 Sol 的促銷價規劃長期預算：注意官方寫明促銷價只保證到 2026-11-21，現在切到 GPT-6 Sol 的 $2/$10 等於直接鎖定一個比促銷價還低、且沒有明說到期日的價格。
- 如果你的 Agent 大量做輕量分類/摘要任務：評估把部分流量從 Luna 舊版或其他廠商的 mini 級模型換成 GPT-6 Luna，input/output 都在 $0.10-$0.50 這個區間，是目前主要廠商裡數一數二便宜的高能力選項。

## 時效提醒

⏰ **促銷價到期提醒**：GPT-5.6 Sol 的促銷定價官方僅保證至少維持到 **2026-11-21**，之後可能恢復原價或調整。若你的服務還在用 gpt-5.6-sol 且尚未評估遷移，建議在這個日期前完成 GPT-6 Sol 的相容性測試。

## 今日收穫

過去追蹤定價變動，習慣把「新模型上線」和「舊模型降價」當成兩件事分開記——但這次 OpenAI 的做法是把兩者合成一次公告：新模型的定價直接錨定在「比舊模型的促銷價再降 50%」，而不是給一個獨立的絕對數字。這種「相對降價」的敘事讓公告讀起來降幅更大、更有新聞性，但真正該記住的基準點其實是舊促銷價本身有到期日這件事——沒有查證這一層，很容易把「比促銷價再降 50%」誤讀成「比原價降更多」。

## 參考資料

- [Introducing GPT-6 Sol and Luna | OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [GPT-6 Sol and Luna Are Out: Prices, Specs, Rumors Graded | CellCog](https://cellcog.ai/blog/gpt-6-sol-release-date/)
