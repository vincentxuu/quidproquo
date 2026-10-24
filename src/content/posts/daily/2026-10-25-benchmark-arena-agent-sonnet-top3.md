---
title: "Benchmark 異動｜Arena Agent 排行榜：卡三天的批次終於推進，Claude Sonnet 5.5 從第五空降第二，把 Fable 5.1 擠出前三"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: zh-TW
description: "Arena Agent 排行榜官方發布日期從卡住三天的 10-20 推進到 10-23：Claude Sonnet 5.5（Max）分數從 12.67% 升到 13.99%，名次從第五衝進第二，把原本排第三的 Claude Fable 5.1（Max）擠出前三"
tldr: "Arena Agent 排行榜新批次（官方發布日期 2026-10-23，結束連續三天卡在 10-20 同批）：第一名 Claude Opus 5.5（Max）不變，20.77%；Claude Sonnet 5.5（Max）從第五名 12.67% 衝到第二名 13.99%（+1.32pp），把原本第三的 Claude Fable 5.1（Max）擠出前三（14.17%→13.94%，掉到第四）；GPT-6 Astra（Max）從第二掉到第三（14.70%→13.96%）。第 2 到第 5 名分差只剩 0.35 個百分點，95% 信賴區間全部重疊，但 Sonnet 5.5 用五分之一的 API 價格追平同家族的 Fable 5.1，這個方向比名次本身更值得記。"
series:
  name: "AI Benchmark Watch"
  order: 8
---

> 🌏 [English version](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3-en)

## 異動摘要

Arena Agent 排行榜官方發布日期從 2026-10-20 推進到 2026-10-23——這是連續卡在同一批次三天之後的第一次更新。新批次裡最大的變化不是第一名（Claude Opus 5.5（Max）繼續穩坐），是原本排第五的 Claude Sonnet 5.5（Max）直接跳到第二，把前次排第三的 Claude Fable 5.1（Max）擠出前三。第 2 到第 5 名現在擠在 13.64%–13.99% 之間，分差不到 0.4 個百分點。

## 排名變化

### Arena Agent 排行榜 — 2026-10-23（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 10-20 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5（Max） | 20.77% | [18.39%, 23.15%] | 20.92%（1） | — |
| 🥈 | Claude Sonnet 5.5（Max） | 13.99% | [10.95%, 17.02%] | 12.67%（5） | ↑3 |
| 🥉 | GPT-6 Astra（Max） | 13.96% | [11.88%, 16.04%] | 14.70%（2） | ↓1 |
| 4 | Claude Fable 5.1（Max） | 13.94% | [12.01%, 15.88%] | 14.17%（3） | ↓1 |
| 5 | GPT-6.1 Sol（Max） | 13.64% | [12.01%, 15.27%] | 13.55%（4） | ↓1 |
| 6 | Gemini 4 Argon（High） | 11.75% | [10.84%, 12.66%] | — | — |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-10-23 · 抓取日期：2026-10-25 · 10-20 數字取自[前一篇 Benchmark 異動](/posts/daily/2026-10-18-benchmark-arena-agent-astra)後續追蹤快照

SWE-bench Verified 前五名分數與名次跟上次完全相同（79.2／79.2／78.8／77.4／76.8，前二名並列、第五名三方並列），未異動。CursorBench 前五名與 10-24 相同（Opus 5.5 Max 57.8%／Opus 5.5 Extra High 56.0%／Opus 5.5 High 56.0%／Sonnet 5.5 Max 55.5%／Sonnet 5.5 Extra High 53.1%），changelog 最後一筆仍是 10-07 定價調整。MorphLLM Leaderboard（`morphllm.com/leaderboard`）仍回傳 429 Vercel Security Checkpoint；Artificial Analysis 的 `/agents/coding-agents` 頁面仍以圖表渲染、沒有可擷取的文字表格——兩者維持既有已知阻塞（Q-023），本次未發現新路徑。

## 分析：這次洗牌代表什麼

### 技術面

Sonnet 5.5（Max）這次不是從鄰近名次小幅爬升，是直接跨過三個名次（第五→第二），同時把 GPT-6 Astra、Claude Fable 5.1、GPT-6.1 Sol 三個模型各往下擠一名。對照上次（10-16 批次）Astra 的爬升是花四個批次、單向累積到位，這次 Sonnet 的跳幅發生在單一批次之內——批次之間剛好卡了三天沒有新資料，無法判斷這個跳幅是三天內累積的漸進變化，還是這一批次本身的抽樣波動。

### 方法論面

⚠️ Arena 的分數是 IPS（inverse propensity score）量化分數，不是 Elo，批次之間的漲跌只能看順序與量級，不建議直接相減解讀成「進步了多少」。這次第 2 到第 5 名的 95% 信賴區間全部重疊——Sonnet 5.5 的 [10.95%, 17.02%] 和 GPT-6.1 Sol 的 [12.01%, 15.27%] 幾乎完全疊在一起，統計上無法確定這四個名次的真實順序。值得留意的是 Sonnet 5.5 的 CI 區間（寬度 6.07pp）明顯比其他三者（寬度約 3.3–3.9pp）更寬，代表它的樣本量或評分變異比同一批次的其他模型更大，這也是為什麼單批次的大幅名次跳動在它身上更容易出現——沒有找到 Anthropic 或 Arena 官方對這次變動的說明。

### 產業面

這次排名互換裡最值得記的不是 Sonnet 5.5 超過了 GPT-6 Astra 和 Fable 5.1 的分數本身,是它追平這兩者用了多低的成本。Claude Sonnet 5.5 的 API 價格是 $2／$10（每百萬 token，輸入／輸出），而同家族的 Claude Fable 5.1 是 $10／$50——五倍價差。這一批次裡 Sonnet 5.5（13.99%）已經和 Fable 5.1（13.94%）在統計上分不出高下，Fable 5.1 原本作為「旗艦」的定位,在 Agent 任務的排行榜分數上已經沒有展現出對應的五倍溢價。對要選模型的團隊來說,如果任務本身不特別需要 Fable 5.1 的額外能力,這次排行榜給的訊號是:用五分之一的價格拿到統計上相當的 Agent 表現,現在又多了一筆數據支持。

## 今日收穫

之前幾篇把「連續幾批維持同一位置才值得解釋」當成判斷原則,這次遇到的情況反而是原則的邊界案例:批次本身卡了三天沒更新,新批次一來就是大跳動,沒有「連續幾批」的軌跡可以參照,只能看單一批次的跳幅夠不夠大。我目前沒有辦法區分「批次間隔變長導致波動被放大」跟「這批次本身就是真實的排名變化」,只能先記下批次發布的時間間隔本身,也是判斷訊號可信度的一個變數——不只是名次和分數要追蹤,發布頻率的中斷與恢復本身也是訊號。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Claude API Pricing — benchlm.ai](https://benchlm.ai/anthropic/api-pricing)
- [Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Benchmark 異動｜Arena Agent 排行榜：GPT-6 Astra 四批之後首次擠進前三](/posts/daily/2026-10-18-benchmark-arena-agent-astra)
