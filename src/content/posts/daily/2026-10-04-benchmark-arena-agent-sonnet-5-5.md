---
title: "Benchmark 異動｜Arena Agent 排行榜：發布僅 3 天的 Claude Sonnet 5.5 直接空降第三，GPT-6 Astra 被擠到第四"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, benchmark, daily, chatbot-arena, agentic-coding]
lang: zh-TW
description: "Arena 官方資料集最新一次發布（2026-10-02）：剛於 09-29 上線的 Claude Sonnet 5.5（Max）直接空降 Agent 排行榜第三名，把原本第三的 GPT-6 Astra（Max）擠到第四，Arena 官方帳號也同步在 X 上公告這次空降"
tldr: "Arena Agent 排行榜 10-02 發布：Claude Fable 5.1（Max）14.31% 蟬聯第一、Claude Opus 5.5（High）13.82% 第二、09-29 才上線的 Claude Sonnet 5.5（Max）12.52% 直接空降第三，GPT-6 Astra（Max）分數微升到 12.27% 卻被擠到第四；Arena 官方 X 帳號同步公告 Sonnet 5.5 比前代 Sonnet 5（目前排第 13）跳了 8.1 個百分點；但四家排名的信賴區間彼此重疊，單次快照看不出真正的勝負"
series:
  name: "AI Benchmark Watch"
  order: 3
---

> 🌏 [English version](/en/posts/daily/2026-10-04-benchmark-arena-agent-sonnet-5-5-en)

## 異動摘要

Arena（前身 LMSYS Chatbot Arena）Agent 類別排行榜最新一次官方發布（2026-10-02）出現新面孔：9 月 29 日才上線的 Claude Sonnet 5.5（Max）以 12.52% 直接空降第三名，把兩天前（09-30 發布）還排第三的 GPT-6 Astra（Max）擠到第四——GPT-6 Astra 自己的分數其實還微幅上升（12.18%→12.27%），純粹是被新模型超車。Arena 官方帳號同步在 X 上公告這次空降，且另一個獨立的 Code Arena WebDev 排行榜也顯示 Sonnet 5.5 同樣擠進前三，兩個不同榜單的方向一致。

## 排名變化

### Arena Agent 排行榜 — 2026-10-02（官方發布）

| 排名 | 模型 | 分數 | 09-30 分數 | 變化 |
|---|---|---|---|---|
| 🥇 | Claude Fable 5.1（Max） | 14.31% | 14.55% | ↓0.24pp |
| 🥈 | Claude Opus 5.5（High） | 13.82% | 13.78% | — |
| 🥉 | Claude Sonnet 5.5（Max） | 12.52% | 新上榜 | 🆕 |
| 4 | GPT-6 Astra（Max） | 12.27% | 12.18%（🥉） | ↓1 |
| 5 | GPT-6.1 Sol（Max） | 11.23% | 新上榜 | 🆕 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`full` split，`category=overall`）· 官方發布日期：2026-10-02 · 抓取日期：2026-10-04

值得一提：原本排第 4 的 GPT-6 Sol（Max）這次掉到第 6（10.65%→9.71%），同一天被自家新款 GPT-6.1 Sol（Max）頂替上第 5——OpenAI 這邊也在同步換血，不是只有 Anthropic 這側有新模型上場。

## 分析：這次洗牌代表什麼

### 技術面

Claude Sonnet 5.5 於 2026-09-29 發表（見本站[定價追蹤](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)），到 10-02 的 Arena 官方發布只隔 3 天就擠進 Agent 類別前三——比起 Opus 5.5 當初從發布（09-22）到進前三（09-27）花的 5 天還要快。Arena 官方帳號[在 X 上的公告](https://x.com/arena/status/2106105400487821764)給出另一個對照角度：Sonnet 5.5 的「net improvement」比前代 Sonnet 5（High）足足跳了 8.1 個百分點，而 Sonnet 5（High）目前還排在第 13 名——同一個模型世代之間的跳躍幅度，比起同期發布的 Opus 5.5 相對 Opus 5 的進步更顯著。

### 方法論面

⚠️ 跟上一篇一樣的提醒：這裡的分數是 Arena 自家的相對勝率量化分數，不是傳統 Elo 積分，同一模型不同天的分數不能直接做精確的「漲跌百分點」計算，只能看排名順序與分數量級。

這次更值得注意的是信賴區間：Sonnet 5.5（Max）的 95% CI 是 `[9.43%, 15.61%]`，跟第一名 Fable 5.1 的 CI `[12.42%, 16.21%]`、第二名 Opus 5.5 的 CI `[11.65%, 15.99%]`、第四名 GPT-6 Astra 的 CI `[10.04%, 14.50%]` 幾乎完全重疊——四個名次的區間互相交疊，意味著單一快照看不出真正的勝負順序，只能說這四個模型目前處於同一個統計上無法明確分出高下的集團。Sonnet 5.5 的樣本數（483,211 次觀測、5,219 個對話）也是四者裡最少的，是剛上線模型的典型特徵，排名還會隨樣本數增加而浮動——Opus 5.5 上線首週就曾在 11.84%～13.78% 之間劇烈調整（見[上一篇](/posts/daily/2026-10-02-benchmark-arena-agent)），Sonnet 5.5 很可能重演同樣的過程。

### 產業面

這次換血對選型決策最直接的意義，是把「效能接近就該選貴的」這個直覺打了折扣：Sonnet 5.5（Max）定價跟前代 Sonnet 5 完全持平（$2/$10 per 1M tokens），只比 Opus 5.5（$4/$20）貴一半，但 Agent 類別分數只落後 Opus 5.5 約 1.3 個百分點（12.52% vs 13.82%），而且兩者的信賴區間重疊。對正在評估「要不要為了多那一點點效能多付一倍價錢」的團隊，這組數據至少值得先用自己的任務組合實測，而不是直接假設「Opus 系列永遠划算」。同時 OpenAI 這邊 GPT-6.1 Sol 同期悄悄換代、把舊款 GPT-6 Sol 擠到第 6，顯示 $2/$10 這個價位帶的競爭還在持續加溫（呼應[09-30 定價追蹤](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)提到的「單價打平、比拚 token 效率」趨勢）。

## 今日收穫

過去看 Agent 排行榜習慣用「Max/High/旗艦款一定贏」的心智模型做第一層篩選，但這次 Sonnet 5.5（Max）用跟前代持平的價格，三天內就擠進跟兩個旗艦款統計上分不出勝負的集團——「哪個 effort/tier 標籤」正在變得比「哪個產品線」更能預測實際排名。評估要不要升級時，先查清楚同價位有沒有效率更高的選項，可能比直接往上換旗艦款更划算。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face（`lmarena-ai/leaderboard-dataset`，官方一手資料）](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena 官方 X 公告：Claude Sonnet 5.5 空降 Agent Arena 第三名](https://x.com/arena/status/2106105400487821764)
- [Arena（前 LMSYS）Agent 排行榜首頁](https://arena.ai/leaderboard/agent)
- [Anthropic：Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)
- [上一篇｜Benchmark 異動：Arena Agent 排行榜 09-30 發布](/posts/daily/2026-10-02-benchmark-arena-agent)
- [定價追蹤｜Claude Sonnet 5.5 API 定價原封不動](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)
- [模型卡｜Claude Opus 5.5](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)
- [Claude Sonnet 5.5 Code Arena Debut Lands Two Points Behind GPT-6 Astra — 獨立 WebDev 子榜對照](https://www.remio.ai/post/claude-sonnet-5-5-code-arena-debut-lands-two-points-behind-gpt-6-astra)
