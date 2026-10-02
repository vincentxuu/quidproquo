---
title: "Benchmark 異動｜Arena Agent 排行榜：Claude Fable 5.1 蟬聯第一，新發布的 Opus 5.5 只排第二"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, benchmark, daily, chatbot-arena, agentic-coding]
lang: zh-TW
description: "Arena（前 LMSYS）Agent 排行榜官方資料本次終於能驗證：Claude Fable 5.1（Max）以 14.55% 蟬聯第一，剛發布的 Claude Opus 5.5（High）排第二，GPT-6 Astra（Max）第三"
tldr: "Arena Agent 排行榜 09-30 發布：Claude Fable 5.1（Max）14.55% 第一、Claude Opus 5.5（High）13.78% 第二、GPT-6 Astra（Max）12.18% 第三；Anthropic 官方宣稱 Opus 5.5「效能近 Fable 5.1 但省 40% 成本」，但在這個由真人投票決定的 Agent 類別裡，Opus 5.5 仍落後旗艦版約 0.8 個百分點，且第三方測算其滿力模式每題耗用 token 是 GPT-6 Astra 的 4 倍；本篇同時記錄一個方法論突破：改用 Arena 官方發布在 Hugging Face 的歷史資料集（datasets-server API），繞過一個多月來擋住 swebench.com／arena.ai 等排行榜網頁渲染的結構性故障"
series:
  name: "AI Benchmark Watch"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-10-02-benchmark-arena-agent-en)

## 異動摘要

Arena（前身 LMSYS Chatbot Arena）的 Agent 類別排行榜（真人投票評比模型完成代理任務的表現）最新一次發布（2026-09-30）顯示：Claude Fable 5.1（Max）以 14.55% 的分數蟬聯第一，9 月 22 日才發布的 Claude Opus 5.5（High）以 13.78% 排第二，GPT-6 Astra（Max）12.18% 第三。這組排名本身從 09-24 到 09-30 已經連續七天穩定（只有分差小幅浮動），但和本站上一次成功驗證的快照（陣列為 Claude Opus 5（High）/Opus 5（Max）/Fable 5（High））相比，前三名已經整組換血——這組舊快照因為工具故障被迫沿用超過一個月，今天才終於更新。

## 排名變化

### Arena Agent 排行榜 — 2026-09-30（官方發布）

| 排名 | 模型 | 分數 | 09-28 分數 | 變化 |
|---|---|---|---|---|
| 🥇 | Claude Fable 5.1（Max） | 14.55% | 14.06% | — |
| 🥈 | Claude Opus 5.5（High） | 13.78% | 11.84% | — |
| 🥉 | GPT-6 Astra（Max） | 12.18% | 10.36% | — |
| 4 | GPT-6 Sol（Max） | 10.65% | 8.80% | — |
| 5 | Claude Opus 5（High） | 8.76% | 9.47%（🥉→4→5） | ↓ |

來源：[Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)（`agent` 子集、`latest` split）· 官方發布日期：2026-09-30 · 抓取日期：2026-10-02

### 對照本站上一次成功驗證的快照

| 排名 | 模型 | 分數 |
|---|---|---|
| 🥇 | Claude Opus 5（High） | 12.99% |
| 🥈 | Claude Opus 5（Max） | 12.73% |
| 🥉 | Claude Fable 5（High） | 11.70% |

這組舊快照沒有明確日期——因為 2026-09-03 起 Groundlane 對 `swebench.com`／`arena.ai`／`morphllm.com` 三個排行榜網頁的渲染持續失敗，本站每天只能原樣沿用這組舊值（詳見下方方法論面）。根據新找到的官方資料集回溯，Claude Fable 5.1（Max）最晚在 09-24 就已經是 Agent 類別第一名，Claude Opus 5.5（High）則在發布五天後的 09-27 進入前三——也就是說，這次「換血」實際上已經發生至少一週以上，只是本站的偵測工具到今天才追上。

## 分析：這次洗牌代表什麼

### 技術面

Claude Opus 5.5 於 2026-09-22 發布時，Anthropic 官方宣稱它「效能接近 Fable 5.1，但運算成本低 40%」（[Opus 5.5 官方頁面](https://www.anthropic.com/claude/opus)）。但在這個由真人投票決定勝負的 Agent 類別裡，Opus 5.5（13.78%）仍落後旗艦版 Fable 5.1（14.55%）約 0.8 個百分點——「效能接近」在廠商自己選的測試組合上成立，但換到真人評比的代理任務場景，旗艦版仍有可辨識的差距。更值得注意的是獨立測算：Opus 5.5 在最高推理強度下每題消耗約 119,000 個 token，比前代 Opus 5 多六成，是同梯次 GPT-6 Astra 的四倍（[相關報導](https://www.youtube.com/watch?v=v96aXotv1K4)）——「成本低 40%」是牌價換算，不是任務總成本換算，兩者可能對不上。

### 方法論面

⚠️ 這裡的分數不是傳統 Elo 積分，是 Arena 自家的相對勝率量化分數：數值越高越好，但會隨對手池（哪些模型同時在榜）變化而小幅浮動，同一模型在不同天的分數不能直接拿來做百分之百精確的「漲跌百分點」計算，只能看排名順序與分數量級。

更重要的方法論紀錄：本站 `daily-digest-benchmark` routine 從 2026-09-03 起連續超過一個月，每天對 `swebench.com`／`arena.ai`／`morphllm.com` 三個排行榜網頁直接渲染擷取都失敗（分別是 `OUTPUT_LIMIT`、`js_empty_document`、Vercel 429 安全檢查頁），今天才找到繞過方法：Arena 官方在 2026-04-02 的部落格公告（[Arena Leaderboard Dataset](https://arena.ai/blog/arena-leaderboard-dataset)）其實已經把全部排行榜歷史資料發布成結構化的 Hugging Face 資料集（`lmarena-ai/leaderboard-dataset`），透過 Hugging Face 的 `datasets-server` REST API（`/rows`、`/splits`、`/size`）可以直接拿到乾淨的 JSON，完全不需要渲染網頁。這是 Arena 官方自己發布的一手資料，不是第三方聚合站轉述，可信度等同官方排行榜頁面本身。`swebench.com` 與 `morphllm.com` 目前還沒有找到類似的結構化資料出口，渲染擷取仍然失敗，所以本次只確認了 Arena Agent 這一個排行榜的異動。

### 產業面

這次排名換血最大的訊號不是「誰贏了」，而是「贏的方式變了」：Fable 5.1 從 09-24 到 09-30 的分數只小幅成長（13.44%→14.55%），但 Opus 5.5 同一段時間分數幾乎翻倍成長（09-27 的 12.15% 到 09-30 的 13.78%，期間一度降到 11.84%），顯示新發布模型在真人評比榜上的排名還在隨著樣本量增加而劇烈調整——這也是為什麼本站的篩選規則要求「分數提升需觀察到穩定趨勢」，而不是看單日快照就下結論。對正在評估要不要換到 Opus 5.5 的團隊，這組數據給出的建議是：如果任務場景偏向真人難以察覺差異的常規代理操作，Opus 5.5 的價格優勢大概率值得；但如果場景對 token 效率敏感（長任務、高並發），實測的 4 倍 token 消耗量可能吃掉牌價折扣帶來的成本優勢，需要實際跑一輪自己的任務組合再下判斷。

## 今日收穫

廠商發布新模型時常見的宣傳語「效能接近旗艦版、成本更低」，拆開來看往往是兩件事的拼接：「效能接近」通常指廠商自選的 benchmark 組合均分接近，「成本更低」通常指牌價換算。這次 Opus 5.5 vs Fable 5.1 剛好是個對照組——在真人評比的 Agent 類別上仍有可辨識的分差，而且第三方測算的實際 token 消耗量（反映真實任務成本）比牌價折扣的敘事複雜得多。評估「值不值得換模型」時，分開看「哪個維度的效能」和「哪個定義的成本」，比直接套用官方那句摘要句更可靠。

## 參考資料

- [Arena Leaderboard Dataset — Hugging Face（`lmarena-ai/leaderboard-dataset`，官方一手資料）](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard Dataset — 官方公告部落格](https://arena.ai/blog/arena-leaderboard-dataset)
- [Arena（前 LMSYS）排行榜首頁](https://arena.ai/?leaderboard)
- [Introducing Claude Opus 5.5 — Anthropic 官方頁面](https://www.anthropic.com/claude/opus)
- [模型卡｜Claude Opus 5.5](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)
- [模型卡｜Claude Fable 5.1](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1)
- [模型卡｜GPT-6 Astra](/posts/daily/2026-09-06-model-openai-gpt-6-astra)
- [Anthropic Launches Claude Opus 5.5, Igniting New AI Model War with OpenAI — 獨立測算 token 消耗量](https://www.youtube.com/watch?v=v96aXotv1K4)
