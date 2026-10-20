---
title: "Benchmark 異動｜Arena Agent 排行榜：GPT-6 Astra 四批之後首次擠進前三，GPT-6.1 Sol 三連霸第二後跌到第四"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: zh-TW
description: "Arena Agent 排行榜 10-16 批次：GPT-6 Astra（Max）14.13% 結束連續三批卡在第 4／5 名，首次擠進前三；穩坐第二三批的 GPT-6.1 Sol（Max）掉到第四，分數跟著從 14.78% 降到 13.60%"
tldr: "Arena Agent 排行榜 10-16 發布：Claude Opus 5.5（Max）18.88% 續居第一；GPT-6 Astra（Max）14.13% 從連續三批卡在第 4／5 名首次擠進第二；GPT-6.1 Sol（Max）結束連續三批的第二名，掉到第四（14.78%→13.60%）。前六名 95% 信賴區間仍大面積重疊，但 Astra 連續四批分數單向上升、Sol 結束長達三批的穩定期，這種多批次的位置變化比單批次的名次跳動更值得記一筆。"
series:
  name: "AI Benchmark Watch"
  order: 7
---

> 🌏 [English version](/posts/daily/2026-10-18-benchmark-arena-agent-astra-en)

## 異動摘要

Arena Agent 類別排行榜 2026-10-16 發布新一批資料：GPT-6 Astra（Max）14.13% 首次擠進前三，結束連續三批（10-12、10-13、10-14）卡在第 4 或第 5 名的局面。被它擠下去的是連續三批穩坐第二的 GPT-6.1 Sol（Max）——分數從上一批的 14.78% 降到 13.60%，掉到第四。第一名 Claude Opus 5.5（Max）不變，分數還進一步拉開到 18.88%。跟前兩次（10-13→10-14 的第 4／5 名互換）不同，這次是跨越三個批次的穩定位置被打破，不是單批次內的隨機擺動。

## 排名變化

### Arena Agent 排行榜 — 2026-10-16（官方發布）

| 排名 | 模型 | 分數 | 95% CI | 10-14 分數（名次） | 變化 |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5（Max） | 18.88% | [16.14%, 21.61%] | 17.18%（1） | — |
| 🥈 | GPT-6 Astra（Max） | 14.13% | [11.83%, 16.43%] | 13.69%（5） | ↑3 |
| 🥉 | Claude Fable 5.1（Max） | 14.03% | [12.04%, 16.03%] | 14.12%（3） | — |
| 4 | GPT-6.1 Sol（Max） | 13.60% | [11.70%, 15.51%] | 14.78%（2） | ↓2 |
| 5 | Gemini 4 Argon（High） | 13.23% | [11.90%, 14.56%] | 13.73%（4） | ↓1 |
| 6 | Claude Sonnet 5.5（Max） | 12.99% | [9.86%, 16.11%] | — | 新進前 10 |
| 7 | GPT-6 Sol（Max） | 10.31% | [8.21%, 12.41%] | — | — |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-10-16 · 抓取日期：2026-10-18 · 10-14 數字取自[前一篇 Benchmark 異動](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1)與對照快照

SWE-bench Verified 前五名分數與名次跟上一次完全相同（79.2／79.2／78.8／77.4／76.8，前二名二者並列、第五名三方並列），沒有異動。MorphLLM Leaderboard（`morphllm.com/leaderboard`）仍回傳 429 Vercel Security Checkpoint；Artificial Analysis 的 Agentic 評測頁已從舊網址（`/models/capabilities/agentic`）搬到 `/agents/coding-agents`，但資料仍以圖表渲染、沒有可擷取的文字表格——兩者維持 Q-023 既有已知阻塞，本次未發現新路徑。

## 分析：這次洗牌代表什麼

### 技術面

這次的關鍵不是單一批次的名次跳動，是兩個模型各自走完一條完整的多批次軌跡後才交會。GPT-6 Astra（Max）從 10-12 到 10-16 四個批次的分數是 12.34%→13.69%→13.69%→14.13%，單向不降，花了三批才從第 4／5 名爬到第二。GPT-6.1 Sol（Max）則是先在 10-12 到 10-14 的三個批次穩定站上第二（13.81%→15.05%→14.78%），這批突然掉到 13.60%、第四名。兩條軌跡一升一降，在 10-16 這批交叉。

### 方法論面

⚠️ Arena 的分數是 IPS（inverse propensity score）量化分數，不是 Elo，批次之間的漲跌只能看順序與量級，不能直接相減解讀成「進步了多少」。

信賴區間仍然重疊：GPT-6 Astra 的 [11.83%, 16.43%] 和 GPT-6.1 Sol 的 [11.70%, 15.51%] 幾乎完全疊在一起，統計上分不出這兩名的先後順序。但這次值得記的不是這一批的順序，是「連續三批穩定在同一位置」這個模式本身被打破了——10-15 那篇文章學到的教訓是「單批次內的名次跳動不用解釋，連續幾批維持同一位置才值得解釋」，這次正好是後者：Sol 的三批穩定期結束了，Astra 的三批卡關期也結束了,方向正好相反。沒有找到 OpenAI 或 Arena 官方對這次變動的說明，社群對 GPT-6.1 Sol 的定位一直是「Astra Lite」——用更低成本逼近 Astra 的分數，這次排名互換不代表這個定位變了，更可能是兩者原本就在重疊區間裡的正常波動，只是這次波動的方向剛好持續了足夠久。

### 產業面

這次排名互換後，兩者的任務成本差距比分數差距更值得注意。GPT-6 Astra（Max）每個任務平均耗用 30K tokens，GPT-6.1 Sol（Max）是 30.9K——用量幾乎相同，但 Astra 的 API 價格是 $10／$50（每百萬 token，輸入／輸出），Sol 只要 $2／$10，五倍價差直接反映到任務成本上：Astra 平均每個任務 $3.53，Sol 只要 $0.71。換來的分數差距是 14.13% 對 13.60%，0.53 個百分點，而且還落在重疊的信賴區間裡。對要選模型的團隊來說，這次排名互換沒有改變原本的結論：如果任務本身用不到 Astra 的額外能力，Sol 用五分之一的成本拿到統計上分不出高下的分數，仍然是更合理的預設選擇。

## 今日收穫

10-15 那篇文章把「連續幾批都維持同一位置才值得解釋」當成一個判斷原則寫下來，這次剛好遇到一個完整案例：不是單批次雜訊，是兩個模型各自走完三批的穩定期後才交叉。但把這個原則用上之後，也發現它的限制——「穩定了三批」跟「穩定了三十批」在統計上該有不同的可信度，我目前還沒有一個明確的批次數門檻，只能先老實記下「這次是多批次模式、不是單批次雜訊」，門檻本身留給之後更多批次資料出現後再校準。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Introducing GPT-6.1 Sol — OpenAI](https://openai.com/index/introducing-gpt-6-1-sol/)
- [GPT-6 Astra — OpenAI](https://openai.com/index/gpt-6-astra/)
- [Benchmark 異動｜Arena Agent 排行榜：Claude Fable 5.1 回到第三（10-13 批次）](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1)
