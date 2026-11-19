---
title: "Benchmark 異動｜Gemini 4 Neon 首秀：Arena Agent 空降第三，Artificial Analysis Coding Agent Index 登頂"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, benchmark, daily, gemini, arena]
lang: zh-TW
description: "Google 11-18 發布的 Gemini 4 Neon 首次上榜就擠進 Arena Agent 排行榜前三，跟原本第二的 Claude Opus 5.5 統計上打平；在 Artificial Analysis 的 Coding Agent Index 上以些微差距登頂，但官方追蹤的 CursorBench 4.0 仍是 Gemini 4 Carbon 第一，Neon 尚未納入"
tldr: "Gemini 4 Neon（11-18 發布，$3/$15 定價）首次上榜即拿下 Arena Agent 排行榜第三（18.41%），跟第二名 Claude Opus 5.5（18.63%）的信賴區間完全重疊、統計上打平；在 Artificial Analysis Coding Agent Index 上以 59 分些微超過 Claude Code 搭 Fable 5.2／Opus 5.5 的 58 分登頂；但官方追蹤的 CursorBench 4.0 排行榜仍是 Gemini 4 Carbon 第一（60.4%），Neon 尚未被納入，Google 自稱的 CursorBench 4.1 65.4% 數字仍待獨立驗證。"
series:
  name: "AI Benchmark Watch"
  order: 11
---

> 🌏 [English version](/posts/daily/2026-11-20-benchmark-gemini-4-neon-en)

## 異動摘要

Google 11-18 發布的 Gemini 4 Neon，首次上榜就擠進 Arena Agent 排行榜前三，把原本排第三的 Gemini 4 Carbon 擠到第四；跟現在排第二的 Claude Opus 5.5 之間的差距只有 0.22 個百分點，兩者信賴區間完全重疊，統計上是平手。同一批資料顯示，Neon 在 Artificial Analysis 的 Coding Agent Index 上登頂，但差距同樣極小；在官方追蹤的 CursorBench 4.0 排行榜上，Neon 則還沒被納入，冠軍仍是 Gemini 4 Carbon。三個榜單合在一起看，是一次典型的「新模型全面衝榜,但沒有一個榜贏得乾淨」。

## 排名變化

### Arena Agent 排行榜 — 2026-11-18（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 11-15 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Fable 5.2（Max） | 27.42% | [24.46%, 30.38%] | 28.61%（1） | — |
| 🥈 | Claude Opus 5.5（Max） | 18.63% | [16.60%, 20.65%] | 18.19%（2） | — |
| 🥉 | Gemini 4 Neon（High） | 18.41% | [15.90%, 20.93%] | 新上榜 | 🆕 |
| 4 | Gemini 4 Carbon（High） | 16.10% | [15.41%, 16.79%] | 16.45%（3） | ↓1 |
| 5 | Claude Sonnet 5.5（Max） | 15.56% | [12.66%, 18.46%] | 15.29%（4） | ↓1 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-11-18 · 抓取日期：2026-11-20 · 11-15 數字取自前次 routine 內部快照記錄

### Gemini 4 Neon 首秀戰績 — 跨榜單對照（2026-11-20 彙整）

| 榜單 | Neon 名次 | Neon 分數 | 冠軍 | 冠軍分數 | 資料性質 |
|---|---|---|---|---|---|
| Arena Agent Index | 🥉 第三（與第二統計打平） | 18.41% | Claude Fable 5.2（Max） | 27.42% | 官方第三方（Arena 自家盲測投票） |
| Vals Index | 🥈 第二 | 70.87% | Claude Fable 5.2 | 71.31% | 官方第三方（私有測試集） |
| Artificial Analysis Coding Agent Index | 🥇 第一 | 59 分 | （Neon 本身） | 59 分 | 官方第三方，但本站本次未能直接擷取原始頁面，數字轉引自 [officechai.com](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/) |
| CursorBench（官方追蹤 4.0 版） | 未上榜 | — | Gemini 4 Carbon（High） | 60.4% | 官方第三方，Neon 尚未被 BenchLM 納入 |
| CursorBench 4.1（Google 自稱） | 🥇 第一（自稱） | 65.4% | — | — | ⚠️ 廠商自測，CursorBench 官方版本（4.0）尚未獨立驗證此數字 |

SWE-bench Verified 前五名分數與名次跟上次完全相同（79.2／79.2／78.8／77.4／76.8，前二名並列、第五名三方並列），未異動。CursorBench 4.0（[BenchLM 彙整](https://benchlm.ai/benchmarks/cursorbench)，資料日期 2026-11-19）前三名與上次相同（Gemini 4 Carbon 60.4%／Claude Fable 5.2 60.0%／Claude Opus 5.5 57.8%），Gemini 4 Neon 尚未出現在這份 21 模型的榜單裡。Artificial Analysis 的 `/agents/coding-agents` 頁面本次用 `render=always` 重新嘗試，仍只回圖表區塊標題、沒有可擷取的數值表格（JS 渲染圖表非表格），維持既有已知阻塞。

## 分析：這次洗牌代表什麼

### 技術面

Gemini 4 Neon 是 Google 的「快速推理」模型，定位介於 Gemini 4 Carbon 與 Gemini 4 Hydrogen 之間，11-18 以 $3/$15 的定價發布，比 Carbon 便宜但比 Hydrogen（$1.50/$7.50）貴。有意思的是它不是靠「比 Carbon 更強」取勝，而是在幾乎所有榜單上都緊貼在 Fable 5.2 或 Opus 5.5 之後，同時保持比對手更低的成本與更快的速度——[officechai 的報導](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/)指出，Neon 在 Vals Index 上的單次測試成本是 $7.40，不到 Opus 5.5 的三分之一，跑完一次測試只要約 31 分鐘，比 Sonnet 5.5 的 90 分鐘快三倍。Artificial Analysis 另外測出 Neon 的輸出速度約 110 token/秒，比 Carbon 的 57 token/秒快將近一倍。這跟本系列幾篇前文記錄的「新模型靠規模或訓練方法硬碰硬」不同，Neon 的故事更接近「用更低的成本逼近頂端」。

### 方法論面

⚠️ 必須分層看待這次的數字：Arena Agent 和 Vals Index 都是 Arena／Vals 自己的獨立盲測，可信度較高；但 Neon 的樣本量（session_count 5,696）明顯小於第二名 Opus 5.5（14,920），信賴區間也因此是前五名裡最寬的（[15.90%, 20.93%]，寬 5.03 個百分點），完全涵蓋住 Opus 5.5 的區間——兩者的名次差統計上分不出來，跟官方報導用「第二／第三」描述的印象不同，實際上是三方（Opus、Neon）統計打平，只是點估計上 Opus 小贏 0.22 個百分點。Artificial Analysis Coding Agent Index 的 59 分 vs. 58 分同樣屬於極小差距，而且本站這次仍無法直接擷取 AA 官網的原始數值表格（JS 圖表阻塞依舊存在），只能轉引第三方報導，可信度要打折扣。最該提防的是 CursorBench 4.1 的 65.4%：這是 **Google 自己的 benchmark 表格**，不是 Cursor 官方或 BenchLM 的獨立測試結果；BenchLM 目前追蹤的仍是 CursorBench 4.0，Neon 根本還沒被納入,所以這個 65.4% 目前只是廠商自測、尚未經過外部覆核。

### 產業面

把五個榜單放在一起看，最值得記的不是「Neon 贏了幾個第一」,而是它在**沒有一個榜單贏得乾淨**的情況下，靠低成本、高速度在多個榜單同時排進前二。對正在評估模型組合的團隊,這種「樣樣接近頂端、沒有明顯短板」的定位,可能比單一榜單的冠軍更有實際參考價值——尤其是當第一名（Fable 5.2 或 Carbon）的使用成本遠高於它的時候。但這也是個提醒：當同一個模型在五個榜單上分別被稱為「第二」「第三」「登頂」,讀者很容易被最亮眼的那個數字（CursorBench 4.1 的 65.4%）牽著走,而那恰好是唯一一個未經獨立驗證的數字。追蹤新模型上榜時,「廠商自己公布的哪個數字」和「獨立第三方測出的哪個數字」要分開記,不能因為同一篇報導裡混著寫就一視同仁。

## 今日收穫

之前幾篇記錄的新模型上榜,通常是在單一榜單上空降到明確的名次;這次 Neon 同時出現在五個榜單上,但沒有一個名次是乾淨的——不是信賴區間重疊到分不出來,就是數字只是廠商自測或轉引自二手報導。這提醒我「多榜單同步報喜」本身就該提高警覺:當一家公司同時在五個地方宣稱自己名次很高,正是最需要逐個查證資料性質的時候,而不是因為數量多就直接採信。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Gemini 4 Neon Places Second On Vals Index And Arena Agent Index Ahead Of Opus 5.5, Tops Cursor Bench Outright — OfficeChai](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [CursorBench Leaderboard & Scores — BenchLM](https://benchlm.ai/benchmarks/cursorbench)
- [AI Coding Agent Benchmarks & Leaderboard — Artificial Analysis](https://artificialanalysis.ai/agents/coding-agents)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Benchmark 異動｜Arena Agent 與 CursorBench 同週洗牌](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2)
