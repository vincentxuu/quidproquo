---
title: "Benchmark 異動｜Arena Agent 與 CursorBench 同週洗牌：Fable 5.2 稱霸 Arena，Carbon 反超搶下 CursorBench 冠軍"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena, cursorbench]
lang: zh-TW
description: "Claude Fable 5.2 首次上榜就拿下 Arena Agent 排行榜第一，大幅拉開跟第二名 Claude Opus 5.5 的差距；但在同一週改版的 CursorBench 上，冠軍卻是 Gemini 4 Carbon，Fable 5.2（Max）只排第三"
tldr: "Arena Agent 排行榜（官方發布日期 2026-11-11，推進自卡住七天的 11-04 批次）：Claude Fable 5.2（Max）首次上榜直接登頂，30.35%，95% 信賴區間下界 26.42% 仍高於原冠軍 Claude Opus 5.5（Max）的區間上界 21.54%，名次差站得住；GPT-6 Astra（Max）掉出前五。同一週 CursorBench 4.0 改版，冠軍卻是 Gemini 4 Carbon（High）60.4%，只贏 Fable 5.2（Max）（60.0%）0.4 個百分點（官方未公布信賴區間），且 Fable 5.2（Max）單次任務成本 32.79 美元，是 Carbon（High）的 3.6 倍。"
series:
  name: "AI Benchmark Watch"
  order: 10
---

> 🌏 [English version](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2-en)

## 異動摘要

本週兩個最常被引用的 coding agent 排行榜同時改版，卻給出兩個不同的冠軍。Arena Agent 排行榜官方發布日期從卡住七天的 2026-11-04 推進到 2026-11-11：Anthropic 11-09 剛發布的 Claude Fable 5.2（Max）首次上榜就直接登頂，30.35%，把原本第一的 Claude Opus 5.5（Max）擠到第二，分差大到兩者的 95% 信賴區間完全不重疊——這個名次差統計上站得住，跟這個系列之前幾篇「名次差其實分不出來」的狀況不同。但同一週改版的 CursorBench 4.0 上，拿下冠軍的卻是 Google 的 Gemini 4 Carbon（High），60.4%，Fable 5.2（Max）只排第三，60.0%，只輸 0.4 個百分點。

## 排名變化

### Arena Agent 排行榜 — 2026-11-11（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 11-04 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Fable 5.2（Max） | 30.35% | [26.42%, 34.28%] | 新上榜 | 🆕 |
| 🥈 | Claude Opus 5.5（Max） | 19.52% | [17.49%, 21.54%] | 20.14%（1） | ↓1 |
| 🥉 | Gemini 4 Carbon（High） | 16.98% | [16.29%, 17.66%] | 16.72%（2） | ↓1 |
| 4 | Claude Sonnet 5.5（Max） | 15.95% | [13.13%, 18.77%] | 15.42%（3） | ↓1 |
| 5 | Claude Fable 5.1（Max） | 14.82% | [12.76%, 16.88%] | 13.86%（5） | — |
| 6 | GPT-6 Astra（Max） | 14.54% | [12.52%, 16.55%] | 14.70%（4） | ↓2 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-11-11 · 抓取日期：2026-11-13 · 11-04 批次數字為前次 routine 內部快照記錄（當時與前批次相同、未達發文門檻，未曾另外成文）

### CursorBench 4.0 — 2026-11-13（抓取當日）

| 排名 | 模型 | 分數 | 單次任務成本 | 輸出 token 中位數 | 11-08 分數（名次） | 變化 |
|---|---|---|---|---|---|---|
| 🥇 | Gemini 4 Carbon（High） | 60.4% | $9.22 | 39,960 | 新上榜 | 🆕 |
| 🥈 | Gemini 4 Carbon（Medium） | 60.1% | $8.49 | 37,067 | 新上榜 | 🆕 |
| 🥉 | Claude Fable 5.2（Max） | 60.0% | $32.79 | 352,794 | 新上榜 | 🆕 |
| 4 | Gemini 4 Carbon（Low） | 58.6% | $11.89 | 42,663 | 新上榜 | 🆕 |
| 5 | Claude Opus 5.5（Max） | 57.8% | $13.43 | 218,363 | 57.8%（1） | ↓4 |

來源：[CursorBench](https://cursor.com/cursorbench) · 抓取日期：2026-11-13 · 11-08 數字取自前次內部快照記錄（當時前五名皆為 Opus 5.5／Sonnet 5.5 各效力等級，Changelog 最後一筆仍是 10-07 定價調整）

SWE-bench Verified 前五名分數與名次跟上次完全相同（79.2／79.2／78.8／77.4／76.8，前二名並列、第五名三方並列），未異動。Artificial Analysis 的 `/agents/coding-agents` 頁面仍以圖表渲染、沒有可擷取的文字表格，維持既有已知阻塞，aa_agentic_index 本次未重新驗證；`morphllm.com/leaderboard` 這次直接回 404（先前是 429），持續無法存取。

## 分析：這次洗牌代表什麼

### 技術面

這次兩個榜單的洗牌背後是同一波模型發布潮：Anthropic 11-09 發布 [Claude Fable 5.2 與 Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)，Google 的 Gemini 4 Carbon 則在 10-28 預覽後於本週擴大開放。Arena 官方帳號[公布](https://x.com/arena/status/2120568144687460434)：Fable 5.2（Max）在 Agent Arena 拿下第一，相對改善幅度（net improvement）達 +30.4%，約是第二名 Opus 5.5 的 1.6 倍，樣本來自 4.7k 筆真實 agentic 任務對話——這跟本站直接從 Hugging Face 資料集抓到的 session_count（4,731）完全吻合。但有意思的是，Anthropic 自己[把 Fable 5.2 定位](https://www.anthropic.com/claude/fable)成「最艱難、最開放式的技術工作」，一般程式開發任務仍建議從 Opus 5.5 開始；CursorBench 4.0 評的恰好是「真實 Cursor 編輯器裡的多檔案任務」這種日常開發情境，Fable 5.2（Max）在這個場景裡就只排到第三，被更便宜的 Gemini 4 Carbon 反超。同一個模型在「廣泛 agentic 任務偏好」和「IDE 內多檔案編輯」兩種評測裡名次完全不同，這點本身就是技術訊號：模型的強弱不是單一數字，要看評測測的是什麼類型的任務。

### 方法論面

Arena Agent 這次的分數可信度值得特別記錄：Fable 5.2 的樣本量（session_count 4,731）其實是目前前六名裡最小的（Opus 5.5 有 14,549、Carbon 有 60,568、Sonnet 5.5 有 8,750），信賴區間也因此是六者裡最寬的（[26.42%, 34.28%]，寬 7.86 個百分點）。但即使區間最寬，它的下界（26.42%）仍遠高於第二名 Opus 5.5 的區間上界（21.54%），兩者完全不重疊——這跟本系列之前好幾篇「第一到第五名信賴區間互相疊在一起、名次分不出來」的情況不一樣，這次的第一名變動統計上是站得住的。⚠️ CursorBench 則是另一個故事：這是 Cursor 自家跑的評測（雖然評的是各家模型，不只是自己的產品），官方沒有公布信賴區間或重跑變異量，第一名（60.4%）跟第三名（60.0%）只差 0.4 個百分點，每個模型的任務樣本量也只有 67 到 218 筆——業界報導（如 [AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price)）也點出「這個 0.4 分差距不足以確立決定性的準確度優勢」。換句話說，CursorBench 上的「冠軍」比 Arena Agent 上的「冠軍」弱得多。

### 產業面

最值得留意的不是名次，是成本結構的落差。CursorBench 上，Fable 5.2（Max）單次任務成本 $32.79（用掉 352,794 個輸出 token，是前五名裡最高的），Gemini 4 Carbon（High）只要 $9.22 就拿到幾乎打平（甚至略高）的分數——同等（或更好）的 IDE 編輯任務表現，成本只要前者的 28%。多篇報導（[the-decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)、[Hermes AI](https://hermes-ai.net/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price/)）都把焦點放在這個成本效益，而不是那 0.4 個百分點的分差，而且 Carbon 目前的報價有一部分是到 11 月底的促銷價，12 月起會調漲。但反過來看 Arena Agent，Fable 5.2 不只是贏，是帶著統計上站得住的巨大差距贏（30.35% 比 19.52%，將近 1.6 倍）——這意味著對需要處理複雜、開放式 agentic 任務的團隊，Fable 5.2 的溢價可能值得，但對以 IDE 內多檔案編輯為主的日常開發工作，Carbon 的價格優勢可能才是決定因素。這是今年罕見的一週：兩個最常被引用的 coding agent 排行榜，對同一波新模型給出完全不同的冠軍。

## 今日收穫

之前幾篇記錄的洗牌，通常是同一個排行榜裡的名次換手，這次是兩個獨立排行榜在同一週對「誰是最強 coding agent」給出兩個不同答案——而且兩個答案都有數據支撐，不是誰的方法論明顯更爛。這提醒我「某模型登上某排行榜第一」這句話從來不是可以直接拿來類推的，一定要接著問「是哪個排行榜，測的是哪種任務分佈」，因為任務分佈本身就決定了誰會贏。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena.ai 官方公布 Fable 5.2 在 Agent Arena 的排名與相對改善幅度 — X](https://x.com/arena/status/2120568144687460434)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Introducing Claude Fable 5.2 and Claude Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Claude Fable 5.2 — Anthropic](https://www.anthropic.com/claude/fable)
- [Google's Gemini 4 Carbon Tops Cursor's Coding Benchmark at Half the Price — AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price)
- [Gemini 4 Carbon arrives just in time to feel like yesterday's news — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
