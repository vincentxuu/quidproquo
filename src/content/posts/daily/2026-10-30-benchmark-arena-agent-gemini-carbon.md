---
title: "Benchmark 異動｜Arena Agent 排行榜：卡七天的批次終於推進，Gemini 4 Carbon 首秀空降第二，Sonnet 5.5 退到第三"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena, gemini]
lang: zh-TW
description: "Arena Agent 排行榜官方發布日期從卡住七天的 10-23 推進到 10-28：Google 10-28 剛發布、目前只開放給 cyber defender 測試的 Gemini 4 Carbon（High）首次上榜直接空降第二，16.04%，把 Claude Sonnet 5.5（Max）從第二擠到第三"
tldr: "Arena Agent 排行榜新批次（官方發布日期 2026-10-28，結束連續七天卡在 10-23 同批）：第一名 Claude Opus 5.5（Max）不變，20.94%；Google 10-28 剛發布、目前只開放給 cyber defender 的 Gemini 4 Carbon（High）首次上榜即拿下第二，16.04%，把原本第二的 Claude Sonnet 5.5（Max）擠到第三（13.99%→13.84%）；GPT-6 Astra（Max）掉幅最大，從第三跌到第五（13.96%→12.96%），被 Claude Fable 5.1（Max）反超（13.94%→13.35%，名次不變仍第四，但分數排序已經換位）。Carbon 的 95% CI 下界（15.04%）仍高於 Sonnet 的點估計（13.84%），是這批次裡少數站得住的名次差。"
series:
  name: "AI Benchmark Watch"
  order: 9
---

> 🌏 [English version](/posts/daily/2026-10-30-benchmark-arena-agent-gemini-carbon-en)


## 異動摘要

Arena Agent 排行榜官方發布日期從 2026-10-23 推進到 2026-10-28——連續卡在同一批次七天之後的第一次更新。新批次最大的變化不是第一名（Claude Opus 5.5（Max）繼續穩坐），是 Google 10-28 當天剛發布、目前只開放給少數 cyber defender 測試的 Gemini 4 Carbon（High），首次上榜就直接拿下第二，把前次排第二的 Claude Sonnet 5.5（Max）擠到第三。原本第三的 GPT-6 Astra（Max）掉得更深，跌到第五,被名次沒變但分數降幅較小的 Claude Fable 5.1（Max）反超。

## 排名變化

### Arena Agent 排行榜 — 2026-10-28（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 10-23 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5（Max） | 20.94% | [18.79%, 23.09%] | 20.77%（1） | — |
| 🥈 | Gemini 4 Carbon（High） | 16.04% | [15.04%, 17.04%] | 新上榜 | 🆕 |
| 🥉 | Claude Sonnet 5.5（Max） | 13.84% | [11.19%, 16.49%] | 13.99%（2） | ↓1 |
| 4 | Claude Fable 5.1（Max） | 13.35% | [11.46%, 15.25%] | 13.94%（4） | — |
| 5 | GPT-6 Astra（Max） | 12.96% | [10.94%, 14.98%] | 13.96%（3） | ↓2 |
| 6 | GPT-6.1 Sol（Max） | 12.47% | [11.39%, 13.54%] | 13.64%（5） | ↓1 |
| 7 | Gemini 4 Argon（High） | 10.73% | [9.91%, 11.54%] | 11.75%（6） | ↓1 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-10-28 · 抓取日期：2026-10-30 · 10-23 數字取自[前一篇 Benchmark 異動](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3)

SWE-bench Verified 前五名分數與名次跟上次完全相同（79.2／79.2／78.8／77.4／76.8，前二名並列、第五名三方並列），未異動。CursorBench 前五名與上次相同（Opus 5.5 Max 57.8%／Opus 5.5 Extra High 56.0%／Opus 5.5 High 56.0%／Sonnet 5.5 Max 55.5%／Sonnet 5.5 Extra High 53.1%），changelog 最後一筆仍是 10-07 定價調整。Artificial Analysis 的 `/agents/coding-agents` 頁面仍以圖表渲染、沒有可擷取的文字表格，維持既有已知阻塞（Q-023），aa_agentic_index 本次未重新驗證。

## 分析：這次洗牌代表什麼

### 技術面

Gemini 4 Carbon 是 Google DeepMind 10-28 當天才[正式發布](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)的下一代前沿模型，距離上一代 Gemini 4 Argon 上線只隔兩週。Arena 官方帳號[當天就公布](https://x.com/arena/status/2115495002998751262)它在 Agent Arena 拿下第二、Text Arena 拿下第一、WebDev Arena 拿下第四,三個榜單同時擠進各自的 Pareto frontier。首秀直接空降第二不是漸進爬升的結果,是全新模型一次性帶著高分進場——這跟之前幾篇記錄的「同一模型連續幾批小幅挪動」完全是兩種訊號型態。值得注意的是 Carbon 的樣本量（observation_count 358 萬、session_count 2.65 萬）已經超過第一名 Opus 5.5（201 萬／1.36 萬）,不是小樣本的偶然結果。

### 方法論面

⚠️ 這次的分數是 Arena 自己的 IPS（inverse propensity score）盲測投票結果，不是 Google 自己的 benchmark,可信度高於廠商自測。但 Carbon 目前[還沒有對外開放](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/)——只開放給 Google「Fairwind Program」裡的少數 cyber defender 測試者,開發者、企業、一般消費者都還拿不到。也就是說這 2.65 萬次 session 的使用者,不是一般公開使用者,樣本的組成可能跟後續公開之後的使用情境不同。信賴區間方面,Carbon 的 95% CI 下界（15.04%）仍高於 Sonnet 5.5 的點估計（13.84%）,兩者 CI 雖有重疊,但 Carbon 偏向這批次裡少數站得住腳的名次差；相對地,Sonnet 5.5、Fable 5.1、Astra 三者的 CI 幾乎完全疊在一起,第 3 到第 5 名的真實順序統計上分不出來。

### 產業面

這次最值得記的細節不是 Carbon 排到第二,是它用多低的成本做到的。Arena 官方給出 Carbon 在 Agent Arena 的 median cost per task 是 $1.80,比第一名 Claude Opus 5.5（Max）低 72%。換句話說,一個還沒對外開放、首秀即拿下統計上站得住的第二名的模型,單次任務成本只是目前第一名的不到三分之一——如果這個成本結構在公開之後維持,對正在評估模型組合的團隊會是重要訊號。另外值得留意的是榜單底層的連動效應：Carbon 插入第二名之後,不只是把它下面的模型整體往後擠一位,還讓 Astra 跌幅（-1.00pp）明顯大於 Fable 5.1 跌幅（-0.59pp）,連帶讓這兩者的相對順序也互換——單一個新模型進場,動到的不只是它自己前後的名次,還有既有模型之間的相對排序。

## 今日收穫

之前幾篇遇到的洗牌都是既有模型之間互相超車,這次是全新模型一次性插進來,而且插進來的這個模型自己還拿不到——這提醒我「排行榜上出現的名字」跟「現在能用的選項」是兩件事,尤其是像 Carbon 這種先用安全測試管道小範圍放出來、再逐步擴大的發布節奏,排行榜會比實際可用性早好幾週就反映出新的名次。追蹤這類排行榜時,光記名次變化不夠,還要記這個名次背後的模型「現在誰拿得到」。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [Gemini 4 Carbon: our next frontier model — Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Arena.ai 官方公布 Gemini 4 Carbon 三榜單排名 — X](https://x.com/arena/status/2115495002998751262)
- [Google announces Gemini 4 Carbon, its latest frontier AI model that you can't use — Ars Technica](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Benchmark 異動｜Arena Agent 排行榜：卡三天的批次終於推進，Claude Sonnet 5.5 從第五空降第二](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3)
