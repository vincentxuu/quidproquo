---
title: "Benchmark 異動｜Arena Agent 排行榜：GPT-6 Sol 首度闖進前三，Claude Opus 5.5（Max）把分差拉開到近 4 個百分點"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, benchmark, daily, chatbot-arena, agentic-coding]
lang: zh-TW
description: "Arena 官方資料集 2026-10-12 發布：GPT-6 Sol（Max）首次擠進 Agent 排行榜前三，Claude Opus 5.5（Max）以 17.89% 把第一名的分差拉開到近 4 個百分點；上次登頂的「High」效力版本整批從榜上消失，被「Max」版本取代"
tldr: "Arena Agent 排行榜 10-12 發布：Claude Opus 5.5（Max）17.89% 登頂（前次登頂的「High」版本 14.33%，但這次整批從 52 個上榜模型中消失）；GPT-6 Sol（Max）12.60% 首次擠進前三（前次未進前 10）；Gemini 4 Argon（High）12.37% 新進前五第四；GPT-6 Astra（Max）從第二跌到第五（13.09%→12.34%）；Claude Fable 5.1 與 Claude Sonnet 5.5 雙雙跌出前五"
series:
  name: "AI Benchmark Watch"
  order: 5
---

> 🌏 [English version](/posts/daily/2026-10-14-benchmark-arena-agent-gpt-6-sol-en)

## 異動摘要

Arena（前身 LMSYS Chatbot Arena）Agent 類別排行榜最新一次官方發布（2026-10-12）同時出現兩個值得注意的變化：GPT-6 Sol（Max）首次擠進前三，是本系列追蹤以來第一次有「上一批次連前 10 都沒進」的模型直接跳進前三；Claude Opus 5.5 衛冕第一名，但掛的是「Max」效力版本，而上次登頂的「High」版本這次完全從 52 個上榜模型名單中消失。兩個變化疊在一起，比單純的名次互換更值得細看。

## 排名變化

### Arena Agent 排行榜 — 2026-10-12（官方發布）

| 排名 | 模型 | 分數 | 10-08 分數 | 變化 |
|---|---|---|---|---|
| 🥇 | Claude Opus 5.5（Max） | 17.89% | 未上榜（🆕 effort 版本） | — |
| 🥈 | GPT-6.1 Sol（Max） | 13.81% | 11.72%（5） | ↑3 |
| 🥉 | GPT-6 Sol（Max） | 12.60% | 未進前 10（🆕） | — |
| 4 | Gemini 4 Argon（High） | 12.37% | 未進前 10（🆕） | — |
| 5 | GPT-6 Astra（Max） | 12.34% | 13.09%（🥈） | ↓3 |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split，`category=overall`）· 官方發布日期：2026-10-12 · 抓取日期：2026-10-14

前次（10-08 批次）登頂的 Claude Opus 5.5（High）14.33%，這次不在前 52 名榜單的任何位置——不是掉名次，是整個「High」效力版本的資料列消失。前次第三、四名的 Claude Fable 5.1（Max，10-08 時 12.66%）與 Claude Sonnet 5.5（Max，10-08 時 11.95%）這次分別跌到第六（11.74%）與第七（10.75%），雙雙跌出前五。

## 分析：這次洗牌代表什麼

### 技術面

這批資料最顯眼的不是分數本身，而是樣本量的落差：登頂的 Claude Opus 5.5（Max）樣本數只有 5,686 次對局（觀測數 612,411 次），是前五名裡最少的，連第五名 GPT-6 Astra（Max）的 12,483 次對局都不到一半；相對地，第四名 Gemini 4 Argon（High）樣本數達 24,314 次對局，是登頂者的四倍以上卻只排第四。樣本量差這麼多還同時出現在前五名，比單純「分數比大小」更適合先問「這個排名有多穩」，而不是急著下「Opus 5.5 又贏了」的結論。

GPT-6 Sol（Max）這次直接從「上一批次連前 10 都沒進」跳進第三，是本系列四次追蹤以來第一次看到這麼大的名次跳躍，且發生在一個三週前已經發過模型卡、不是新發布的既有模型身上——比較像是這批對局的任務組合剛好吃到 GPT-6 Sol 的強項，而不是模型本身有什麼新變化。

### 方法論面

⚠️ 跟前幾篇一樣的提醒：Arena 這裡的分數是自家的相對勝率量化分數，不是傳統 Elo 積分，同一模型不同批次的分數不能直接做精確的「漲跌百分點」計算，只能看排名順序與分數量級的相對變化。

信賴區間這次又是大範圍重疊：第一名 Opus 5.5（Max）的 95% CI 是 `[13.65%, 22.13%]`，第二名 GPT-6.1 Sol（Max）是 `[11.48%, 16.15%]`，第五名 GPT-6 Astra（Max）是 `[9.88%, 14.81%]`——第一名的區間下界（13.65%）仍落在第二到第五名區間的中段，統計上無法明確分出前五名的真正勝負順序。這次還多一層要注意的地方：Claude Opus 5.5（High）整批消失，查證後沒找到 Anthropic 官方停用「High」效力層級的公告（OpenRouter 的 5.5 遷移指南與使用者討論都顯示 High 仍是可選設定），比較可能是 Arena 這批抽樣沒抓到足夠的「High」版本對局量，掉到前 52 名榜單之外，而不是產品端真的下架了這個選項——這點目前只能算是合理推測，沒有獨立來源佐證，之後若查到官方說法會再更新。

### 產業面

價格排序這次出現明顯分層：登頂的 Claude Opus 5.5（Max）是 $4/$20（per 1M tokens），第二名 GPT-6.1 Sol（Max）是 $2/$10，只要一半價格就逼近冠軍分數（13.81% vs 17.89%，差距 4.08 個百分點，但兩者 CI 大面積重疊）。GPT-6 Sol 定價同樣是 input $2.00（cached $0.20）這個價位帶，意味著這次前五名裡有三席（GPT-6.1 Sol、GPT-6 Sol、以及價格相近的 Gemini 4 Argon 促銷價 $2.00）都落在比冠軍便宜一半以上的區間——如果 CI 重疊屬實，這對正在比價的團隊是比「誰第一名」更有參考價值的訊號：便宜一半的選項，統計上可能根本沒有真的輸。

## 今日收穫

這次最意外的不是「GPT-6 Sol 衝進前三」，而是上次的冠軍「Claude Opus 5.5（High）」整批從榜上消失、卻找不到官方停用的公告。這提醒我：排行榜上「某個版本不見了」不等於「廠商下架了這個選項」，更可能只是抽樣沒抓到——下次看到類似的「榜上消失」，應該先去查官方 changelog 或定價頁，而不是直接假設產品端做了改動。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face（`lmarena-ai/leaderboard-dataset`，官方一手資料）](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena（前 LMSYS）Agent 排行榜首頁](https://arena.ai/leaderboard/agent)
- [Claude 5.5 Migration Guide — OpenRouter（確認 High 效力層級未被官方停用）](https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/claude-5-5)
- [模型卡｜Claude Opus 5.5](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)
- [模型卡｜GPT-6.1 Sol](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)
- [模型卡｜GPT-6 Sol／Luna](/posts/daily/2026-09-25-model-openai-gpt-6-sol-luna)
- [模型卡｜Gemini 4 Argon](/posts/daily/2026-10-05-model-google-gemini-4-argon)
- [模型卡｜GPT-6 Astra](/posts/daily/2026-09-06-model-openai-gpt-6-astra)
- [上一篇｜Benchmark 異動：Arena Agent 排行榜 Claude Opus 5.5 登頂（10-08 批次）](/posts/daily/2026-10-10-benchmark-arena-agent-opus-5-5)
- [更早一篇｜Benchmark 異動：Arena Agent 排行榜 09-29 上線的 Sonnet 5.5 空降第三](/posts/daily/2026-10-04-benchmark-arena-agent-sonnet-5-5)
