---
title: "定價追蹤｜Claude Fable 5.2 取代 5.1，API 價格砍兩成"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 於 2026-11-09 推出 Claude Fable 5.2，取代 Fable 5.1，input/output/cache/batch 全線費率同步降 20%，是 Anthropic 近期最大幅度的旗艦模型降價"
tldr: "Claude Fable 5.2 於 2026-11-09 上線取代 Fable 5.1，input 從 $10 降到 $8/1M tokens、output 從 $50 降到 $40/1M tokens，降幅都是 20%，cache read 和 batch 費率也同步砍兩成。舊的 Fable 5.1 model ID 仍可呼叫但維持原價，要拿到新價必須手動把 model ID 換成 claude-fable-5-2。"
series:
  name: "AI Pricing Watch"
  order: 34
---

> 🌏 [English version](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut-en)

## 變更摘要

Anthropic 在 2026-11-09 發布 [Claude Fable 5.2 與 Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)，取代上線僅兩個月的 Fable 5.1。這次升級的重點不是新增能力，是價格——input 從 $10 降到 $8/1M tokens、output 從 $50 降到 $40/1M tokens，降幅整齊地都是 20%，連 cache read 和 Batch API 費率也同步砍兩成。這是 Anthropic 旗艦模型世代交替時少見的「全線費率同步下修」，而且舊的 `claude-fable-5-1` model ID 並未退役、也沒有自動轉導——沒有手動換 model ID 的呼叫方會繼續用舊價付費,降價不會自動發生在你身上。

## 前後對照

| 項目 | 舊（Claude Fable 5.1） | 新（Claude Fable 5.2） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-11-09 |
| Output | $50.00/1M tokens | $40.00/1M tokens | ↓20% | 2026-11-09 |
| Cache Read | $0.25/1M tokens（input 的 2.5%） | $0.20/1M tokens（input 的 2.5%） | ↓20% | 2026-11-09 |
| Batch API Input | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2026-11-09 |
| Batch API Output | $25.00/1M tokens | $20.00/1M tokens | ↓20% | 2026-11-09 |

(Fable 系列的 cache read 倍率在 5.1 就已經從一般模型的 10% 降到 2.5%，這次 5.2 延續同一個倍率，只是套用在更低的 base 價上；Fast mode 同樣是標準價的 2 倍，Fable 5.2 fast mode 為 $16/$80。)

## 成本試算

**場景**：一個每天跑 500 個高複雜度 agentic 任務的團隊，用 Fable 做 orchestrator（平均每個任務 20,000 input tokens + 5,000 output tokens）

| | Fable 5.1（舊） | Fable 5.2（新） | 月省 |
|---|---|---|---|
| Input 成本/月（300M tokens） | $3,000 | $2,400 | $600 |
| Output 成本/月（75M tokens） | $3,750 | $3,000 | $750 |
| **合計** | **$6,750/月** | **$5,400/月** | **$1,350（↓20%）** |

因為 input 和 output 的降幅剛好都是 20%,這個試算不受 input/output 比例影響——不管你的任務是 input 重還是 output 重,換到 Fable 5.2 一律省兩成,不像多數降價公告 input/output 降幅不對稱、需要先算自己的 token 比例才知道實際省多少。

## 對開發者/企業的影響

### 誰最受益

把 Fable 當 orchestrator 用的團隊最直接受益——Anthropic 在發布文中明確把 Fable 5.2 定位成「規劃工作、把簡單任務分給更小模型」的角色,這類架構通常跑量大、呼叫頻率高,20% 的全線降價會直接反映在月帳單上。另外,原本因為 Fable 5.1 跟 GPT-6 Astra 同價（$10/$50）而猶豫要不要用在重度推理場景的團隊,現在價差拉開,值得重新評估。

### 競爭格局影響

降價後的高階模型價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Astra | $10.00 | $50.00 | 目前最貴的前緣模型 |
| Claude Fable 5.1（已被取代，舊呼叫方仍付此價） | $10.00 | $50.00 | 停產前與 GPT-6 Astra 同價 |
| **Claude Fable 5.2（新）** | **$8.00** | **$40.00** | 本次降價，首次與 GPT-6 Astra 拉開 20% 價差 |
| Claude Opus 5.5 | $4.00 | $20.00 | 正好是 Fable 5.2 的一半 |
| Gemini 4 Argon（2026-12-01 起恢復原價） | $4.00 | $20.00 | 11/30 前促銷價 $2/$10 |
| GPT-6.1 Sol | $2.00 | $10.00 | — |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |

這次降價讓 Fable 5.2 不再是「最貴旗艦模型」的並列第一,跟 GPT-6 Astra 之間出現 20% 的明確價差,也讓 Claude 自家產品線的價格階梯更連貫——Fable 5.2（$8/$40）正好是 Opus 5.5（$4/$20）的 2 倍,跟上一代 Fable 5.1 相對 Opus 5.5 原本 2.5 倍的落差相比更對稱。

### 行動建議

- 如果你的程式碼裡 model ID 寫死 `claude-fable-5-1`：這次降價不會自動發生在你身上，官方沒有把舊 ID 轉導到新模型，需要手動改成 `claude-fable-5-2` 才能拿到新價
- 如果你在用 Fable 跑 Batch 任務：Batch 費率同步降到 $4/$20，疊加原本就有的 50% off，實際單價是標準價的一半再乘 0.8
- 如果你之前因為 Fable 5.1 跟 GPT-6 Astra 同價而選了 Astra：現在 Fable 5.2 便宜 20%，值得重新跑一次 eval 比較
- 如果你是用 Fable 當 advisor（讓 Haiku/Sonnet/Opus 遇到難題時諮詢 Fable）：呼叫頻率通常不高，20% 降價的絕對金額有限，優先順序可以排在遷移 orchestrator 用途之後

## 今日收穫

這次降價最值得記住的不是「降了多少」,而是「降價不會自動發生」——Anthropic 沒有把舊的 `claude-fable-5-1` 轉導到新模型,兩個 model ID 會一直並存,各自維持自己的價格。這跟我們之前報導過的幾次「模型退役＝自動變便宜」的案例剛好相反:那幾次是官方把流量導向更便宜的替代模型,呼叫方什麼都不用做就降價;這次呼叫方如果不主動改 model ID 字串,就會一直用舊價付費,新模型再便宜都跟你無關。追蹤定價變動不能只看「降了多少」,還要查「要不要自己動手才拿得到」。

## 參考資料

- [Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2（官方發布文，2026-11-09）](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Anthropic: Claude Fable 5.2 Overview（官方模型頁，含完整費率）](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic: Models overview（官方模型總覽，Fable 5.1／5.2 新舊費率對照）](https://platform.claude.com/docs/en/models/overview)
- [Anthropic: Pricing（官方定價頁，cache／batch／fast mode 費率公式）](https://platform.claude.com/docs/en/about-claude/pricing)
- [VentureBeat: Anthropic releases Claude Fable 5.2 and Mythos 5.2, pairing new record-high benchmarks with 20% API cost reduction](https://venturebeat.com/technology/anthropic-releases-claude-fable-5-2-and-mythos-5-2-pairing-new-record-high-benchmarks-with-20-api-cost-reduction)
- [mlq.ai: Anthropic launches Claude Fable 5.2 and Mythos 5.2 with a 20% price cut as its IPO nears](https://mlq.ai/news/anthropic-launches-claude-fable-5-2-and-mythos-5-2-with-a-20-price-cut-as-its-ipo-nears/)
