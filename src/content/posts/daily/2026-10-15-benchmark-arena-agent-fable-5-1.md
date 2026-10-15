---
title: "Benchmark 異動｜Arena Agent 排行榜：Claude Fable 5.1 回到第三，GPT-6 Sol 一天內從第三掉到第七"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: zh-TW
description: "Arena Agent 排行榜 10-13 批次：前三名第三席再次換人，Claude Fable 5.1（Max）14.32% 回到第三，前一批剛擠進前三的 GPT-6 Sol（Max）掉到第七；前六名信賴區間全部重疊"
tldr: "Arena Agent 排行榜 10-13 發布：Claude Opus 5.5（Max）17.01% 續居第一；GPT-6.1 Sol（Max）15.05% 第二；Claude Fable 5.1（Max）從第六回到第三（11.74%→14.32%）；GPT-6 Sol（Max）從第三掉到第七（12.60%→10.51%）。三次發布、一週之內第三名換了三次，前六名的 95% 信賴區間全部重疊，名次本身不該拿來選型。"
series:
  name: "AI Benchmark Watch"
  order: 6
---

> 🌏 [English version](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1-en)

## 異動摘要

Arena Agent 類別排行榜 2026-10-13 發布新一批資料，第三名又換人：Claude Fable 5.1（Max）從上一批的第六回到第三，前一批（10-12）剛首次擠進前三的 GPT-6 Sol（Max）掉到第七。第一名 Claude Opus 5.5（Max）不變，GPT-6.1 Sol（Max）穩住第二。從 10-08、10-12 到 10-13 三次發布，第三名分別是 Fable 5.1、GPT-6 Sol、Fable 5.1，這種來回擺盪本身就是今天最值得記下的訊號。

## 排名變化

### Arena Agent 排行榜 — 2026-10-13（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 10-12 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5（Max） | 17.01% | [13.50%, 20.53%] | 17.89%（1） | — |
| 🥈 | GPT-6.1 Sol（Max） | 15.05% | [12.95%, 17.16%] | 13.81%（2） | — |
| 🥉 | Claude Fable 5.1（Max） | 14.32% | [12.28%, 16.37%] | 11.74%（6） | ↑3 |
| 4 | GPT-6 Astra（Max） | 13.69% | [11.35%, 16.03%] | 12.34%（5） | ↑1 |
| 5 | Gemini 4 Argon（High） | 13.59% | [12.01%, 15.17%] | 12.37%（4） | ↓1 |
| 6 | Claude Sonnet 5.5（Max） | 13.00% | [9.83%, 16.16%] | 10.75%（7） | ↑1 |
| 7 | GPT-6 Sol（Max） | 10.51% | [8.21%, 12.82%] | 12.60%（3） | ↓4 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-10-13 · 抓取日期：2026-10-15 · 10-12 數字取自[前一篇 Benchmark 異動](/posts/daily/2026-10-14-benchmark-arena-agent-gpt-6-sol)

SWE-bench Verified 前五名分數與名次跟上一次完全相同（79.2／79.2／78.8／77.4／76.8），沒有異動。

## 分析：這次洗牌代表什麼

### 技術面

這次前三名的分數差距比上一批小：第二名到第六名都落在 13.00% 到 15.05% 之間，差距只有 2.05 個百分點。第一名 Opus 5.5（Max）的樣本依舊最少之一，只有 6,025 次對局；排第五的 Gemini 4 Argon（High）有 26,905 次對局，是它的四倍多。樣本少的模型分數本來就容易隨批次擺動，Fable 5.1 的 16,212 次對局與 GPT-6 Sol 的 6,664 次對局，也一樣在兩天內各自上下移動了 2 個百分點以上。

### 方法論面

⚠️ Arena 的分數是相對勝率量化分數，不是 Elo，不同批次之間的「漲跌」只能看順序與量級。

更重要的是信賴區間：第二到第六名的 95% CI 下界落在 9.83% 到 12.95%、上界落在 15.17% 到 17.16%，彼此大面積重疊；連第一名的下界 13.50% 都落在第二到第六名的區間裡。統計上，這六個模型的先後順序分不出來。一週內第三名換了三次，正好說明名次是在信賴區間裡隨機擺動，不是模型在變強或變弱。

### 產業面

對要選模型的團隊來說，這張表該讀的是「哪些模型在同一個檔次」，而不是第幾名。目前同一檔次裡價格差距很大：Claude Opus 5.5 是 $4／$20（每百萬 token），GPT-6.1 Sol 是 $2／$10，Gemini 4 Argon 到 11 月 30 日前是 $2／$10、[12 月 1 日起調成 $4／$20](https://ai.google.dev/gemini-api/docs/pricing)。在分數統計上分不出高下的情況下，用自己的任務測過、再比較單位任務成本，比追排行榜名次可靠。

## 今日收穫

上一篇我把 GPT-6 Sol 擠進前三解讀成「這批任務剛好吃到它的強項」，一天後它就掉回第七。這讓我修正了讀法：在信賴區間重疊的榜上，單一批次的名次跳動不需要解釋，連續幾批都維持在同一個位置才值得解釋。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://lmarena.ai/leaderboard)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Gemini API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Benchmark 異動｜Arena Agent 排行榜 GPT-6 Sol 首進前三（10-12 批次）](/posts/daily/2026-10-14-benchmark-arena-agent-gpt-6-sol)
