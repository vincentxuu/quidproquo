---
title: "Benchmark 異動｜CursorBench 轉正 4.1：Gemini 4 Neon 拿下官方榜認證第一，Carbon 退居第二"
date: 2026-11-22
category: daily
type: digest
tags: [ai-agent, benchmark, daily, gemini, cursorbench]
lang: zh-TW
description: "BenchLM 追蹤的 CursorBench 官方榜 11-20 從 4.0 版轉正到 4.1 版，Gemini 4 Neon 以 65.4%（Extra High）登頂，官方認證坐實了兩天前還只是廠商自測的同一個數字，原本的冠軍 Gemini 4 Carbon 退居第二（61.5%）"
tldr: "CursorBench 官方追蹤榜 11-20 從 4.0 轉正到 4.1 版，Gemini 4 Neon 以 65.4%（Extra High）登頂，取代原冠軍 Gemini 4 Carbon（61.5%）；這個 65.4% 兩天前（11-20 本系列報導）還只是 Google 自己宣稱、未經覆核的數字，現在已經是 BenchLM／Cursor 官方榜上的獨立認證結果。SWE-bench Verified、Arena Agent、Artificial Analysis Coding Agent Index 三個榜單均無異動。"
series:
  name: "AI Benchmark Watch"
  order: 12
---

> :globe: [English version](/posts/daily/2026-11-22-benchmark-cursorbench-4-1-neon-en)

## 異動摘要

本系列 11-20 的報導曾記錄 Gemini 4 Neon 自稱在 CursorBench 4.1 拿到 65.4%，但當時 BenchLM 官方追蹤的仍是 CursorBench 4.0，Neon 根本沒上榜，那個數字只是廠商自測、未經獨立驗證。今天的掃描發現：BenchLM 在 11-20 已把官方「current」版本從 4.0 切到 4.1，Neon 的 65.4% 現在是官方榜上的獨立認證結果，原冠軍 Gemini 4 Carbon 從 4.0 版的 60.4% 降為 4.1 版官方第二（61.5%）。SWE-bench Verified、Arena Agent、Artificial Analysis Coding Agent Index 三個常態追蹤榜單均與前次快照逐位元相同，無異動。

## 排名變化

### CursorBench 4.1（BenchLM 官方追蹤榜）— 2026-11-22

| 排名 | 模型 | 分數 | CursorBench 4.0 排名（參考，版本不同不可直接比較） | 變化 |
|---|---|---|---|---|
| 1 | Gemini 4 Neon（Extra High） | 65.4% | 未上榜 | NEW｜轉正為官方認證 |
| 2 | Gemini 4 Carbon（High） | 61.5% | 1（60.4%） | ↓1 |
| 3 | Gemini 4 Hydrogen（High） | 61.4% | 5（54.3%） | ↑2 |
| 4 | Claude Fable 5.2 | 61.3% | 2（60.0%） | ↓2 |
| 5 | Claude Opus 5.5 | 58.1% | 3（57.8%） | ↓2 |

來源：[CursorBench — BenchLM](https://benchlm.ai/benchmarks/cursorbench) · CursorBench 4.1 於 2026-11-18 發布、BenchLM 11-20 轉為官方 current 版本 · 快照日期：2026-11-22 · 4.0 與 4.1 任務集不同，分數不可直接比較，僅供參考名次移動方向

其餘三個常態追蹤榜單無異動：SWE-bench Verified 前 5 名分數與名次（79.2％／79.2％／78.8％／77.4％／76.8％，前二名並列、第五名三方並列）與前次快照逐位元相同；Arena Agent 排行榜官方發布日期仍是 2026-11-18，前 5 名（Claude Fable 5.2 27.42%／Claude Opus 5.5 18.63%／Gemini 4 Neon 18.41%／Gemini 4 Carbon 16.10%／Claude Sonnet 5.5 15.56%）逐位元相同；Artificial Analysis Coding Agent Index（經 orcarouter.ai／trendingtopics.eu／dev.to／Google 官方部落格四篇報導交叉比對，官網數值表格仍因 JS 渲染無法直接擷取）維持 Gemini 4 Neon 第一（58.6～59 分）、Claude Fable 5.2／Opus 5.5（Claude Code）並列第二（58 分）、Gemini 4 Carbon 第三（54～55 分），與前次快照同一順位、分差在四捨五入誤差內，非顯著變動。

## 分析：這次洗牌代表什麼

### 技術面

CursorBench 4.1 修改了 4.0 版的「指令遵循」題目並拉長了 agent 的執行時間上限，是任務集本身的升級，不是同一套題目重新跑分。Gemini 4 Neon 在新版任務集上的名次移動，技術上更適合理解成「新題目下的首次定錨」而不是「打敗了 Carbon」——根據 [Cursor 官方公告](https://x.com/cursor_ai/status/2123198346802450926)，Neon 在預設的 High 效力層級拿 63.7%，比上一代 Gemini 4 Hydrogen 的 57.3% 高 6.4 個百分點；BenchLM 榜上顯示的 65.4% 則是 Neon 的 Extra High 效力層級，照慣例取每個模型已公布的最高效力層級上榜。[kingy.ai 的拆解](https://kingy.ai/blog/gemini-4-neon/)顯示 Neon 四個效力層級的成本與分數呈清楚的邊際遞減：Low 45.5%／$1.26、Medium 57.7%／$3.07、High 63.7%／$6.54、Extra High 65.4%／$10.67——最後一級多花 63% 的成本只多拿 1.7 個百分點。

### 方法論面

這次異動最值得記錄的不是分數本身，而是「驗證狀態」的轉變：11-20 報導時明確標注 CursorBench 4.1 的 65.4% 是「Google 自己的 benchmark 表格,不是 Cursor 官方或 BenchLM 的獨立測試結果」；今天同一個數字已經出現在 BenchLM 的官方 CursorBench 4.1 榜上，等於是被基準擁有者自己收錄、轉正成官方認證數字。但要注意轉正的是「這個分數被官方榜承認」，不是「這個分數可以跨版本比較」——BenchLM 自己在版本比較表裡也特別註明 4.0 與 4.1「分數不可比較,只看名次移動方向較公平」，所以「Carbon 從 60.4% 掉到 61.5%」不是退步，是換了一套更難（或至少不同）的題目後的新基準點。[AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-neon-beats-carbon-on-coding-tasks-while-costing-23-less) 與 [TestingCatalog](https://www.testingcatalog.com/google-launches-gemini-4-neon-on-gemini-antigravity-and-apis/) 等多篇獨立報導都引用了同一組 63.7%／65.4% 數字，彼此交叉確認，可信度比 11-20 時單憑 Google 自己公告要高得多。

### 產業面

對照 11-20 的報導，這次的意義在於「驗證時間差」本身：一個廠商自己公布的 benchmark 數字，從發布到被基準擁有者收錄進官方榜，中間隔了整整兩天——這段空窗期正是讀者最容易被誤導的時候，因為當時唯一能查到的來源就是廠商自己。對正在追蹤 coding agent 選型的團隊，這次事件提供了一個具體的時間基準：遇到廠商自測的新分數，等 2–3 天看是否被獨立榜單收錄，通常就能把「廠商話術」和「可驗證結果」分開。同時，Neon 在新版 4.1 榜上從缺席直接空降第一，而不是沿用 11-20 時 Arena／AA 榜上「緊貼第二、第三」的曖昧名次，這也呼應了 Cursor 公告強調的「cost-performance frontier」定位——在 CursorBench 這個 Cursor 自家、最貼近真實使用情境的榜單上，Neon 的表現比在 Arena 或 AA 的通用排名更突出。

## 今日收穫

11-20 的報導教訓是「廠商自己同時在五個榜單喊第一時要分開查證」；這次事後追蹤給了更具體的操作方法：同一個數字如果兩天內從「廠商自測」變成「基準擁有者官方收錄」，這個轉變本身就是訊號，值得單獨記一筆，而不是只更新一次分數就結束。追蹤 benchmark 異動時，「這個數字現在被誰認證」比「這個數字是多少」更該優先確認。

## 參考資料

- [CursorBench — BenchLM](https://benchlm.ai/benchmarks/cursorbench)
- [CursorBench — Cursor 官方頁面](https://cursor.com/cursorbench)
- [Cursor 官方公告 — X](https://x.com/cursor_ai/status/2123198346802450926)
- [Gemini 4 Neon benchmarks, specs, pricing and comparisons — kingy.ai](https://kingy.ai/blog/gemini-4-neon/)
- [Google launches Gemini 4 Neon on Gemini Antigravity and APIs — TestingCatalog](https://www.testingcatalog.com/google-launches-gemini-4-neon-on-gemini-antigravity-and-apis/)
- [Google's Gemini 4 Neon Beats Carbon on Coding Tasks While Costing 23% Less — AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-neon-beats-carbon-on-coding-tasks-while-costing-23-less)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [AI Coding Agent Benchmarks & Leaderboard — Artificial Analysis](https://artificialanalysis.ai/agents/coding-agents)
- [Benchmark 異動｜Gemini 4 Neon 首秀：Arena Agent 空降第三，Artificial Analysis Coding Agent Index 登頂](/posts/daily/2026-11-20-benchmark-gemini-4-neon)
