---
title: "模型卡｜Muse Spark 1.2"
date: 2026-08-24
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta]
lang: zh-TW
description: "Meta 發佈 Muse Spark 1.2 與首款程式碼 agent Muse Code——1M context、定價維持 $1.25/$4.25 不變，GDPval-AA v2 Elo 大跳 260 分"
tldr: "Muse Spark 1.2：1M context window、input $1.25/output $4.25 per 1M tokens（與 1.1 相同）、AA Intelligence Index 57、GDPval-AA v2 Elo 大跳 260 分到 1631（全場第 5），搭配首款程式碼 agent Muse Code 主打長時間多 agent 協作"
series:
  name: "AI Model Tracker"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-24-model-meta-muse-spark-1-2-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `muse-spark-1.2`（標準）／`muse-spark-1.2-contributor`（訓練用途） |
| 廠商 | Meta（Meta Superintelligence Labs） |
| 參數量 | 未公開 |
| Context Window | 1,048,576 tokens（約 1M） |
| Input 定價 (USD/1M tokens) | $1.25（標準）／$0.10（contributor，Meta 可用於訓練） |
| Output 定價 (USD/1M tokens) | $4.25（標準）／$0.20（contributor） |
| 開源 | 否 |
| 發布日 | 2026-08-05 |
| 官方公告 | [Meta AI Developer Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-code/) |

## 能力亮點

- 首度搭配 Meta 自家程式碼 agent「Muse Code」發佈（beta），主打長時間多 agent 協作：每個子 agent 產生的過程、工具呼叫、steer/cancel 動作都可觀察、可重播
- GDPval-AA v2（知識工作評測）Elo 大跳 260 分到 1631，是 Artificial Analysis 目前所有已測模型中排名第 5，超越 Claude Opus 4.8 Max 的 1588
- Terminal-Bench v2.1 從前代 1.1 的 78% 提升到 80%，τ³-Banking（agentic 工具使用）從 25% 提升到 27%
- 全程無 long-context 加價：無論 context window 用到多滿，計費費率不變；prompt cache 自動啟用且無額外開通步驟

## Benchmark 表現

| Benchmark | 分數 | 前代 (Muse Spark 1.1) | 競品最強 |
|---|---|---|---|
| AA Intelligence Index | 57 | 51 | Claude Opus 5 Max 63.05 |
| GDPval-AA v2 (Elo) | 1631 | 1371 | Claude Opus 4.8 Max 1588 |
| Terminal-Bench v2.1 | 80% | 78% | 未提供精確可比數字 |
| τ³-Banking | 27% | 25% | 未提供精確可比數字 |

⚠️ AA Intelligence Index、GDPval-AA v2 分數來自第三方 Artificial Analysis 的獨立測試（Meta 於正式發布前提供存取），Terminal-Bench v2.1、τ³-Banking 分數則出自 Meta 官方公告，尚待第三方複現確認。

## 與前代/競品比較

跟 Muse Spark 1.1 比，最大進步在知識工作型 agent 任務：GDPval-AA v2 Elo 從約 1371 跳到 1631，漲了 260 分——這是一個測試模型用 shell 存取與網頁瀏覽在真實知識工作任務（如準備簡報、分析報告）上表現的指標，也是 Artificial Analysis 眼中「最能代表通用 agentic 表現」的評測。Terminal-Bench 與 τ³-Banking 則只小幅進步 2 個百分點，代表這一代的訓練重心明顯偏向知識工作場景而非純 coding。

跟競品比，Muse Spark 1.2 的 AA Intelligence Index（57）仍落後 Claude Opus 5 Max（63.05）、GPT-5.6 Sol Max（60.93）、Kimi K3 Max（59.70），跟 Qwen3.8 Max（58.08）接近但略低。不過看每個 Intelligence Index 任務的成本，Muse Spark 1.2 只要 $0.40，是 56 分以上模型中最便宜的一個——同分數帶最接近的 GPT-5.6 Terra Max（$0.51）貴 22%。

定價維持 $1.25/$4.25 不變，跟 Muse Spark 1.1 完全相同，等於在性能提升前提下隱性降價。但實測發現，因為 1.2 回答變長（同一 benchmark 的 output token 用量多了 78%），跑完整套 Intelligence Index 的實際花費反而漲了 36.6%——rate card 沒變，帳單卻變了。

## 對 Agent 開發的意義

這次真正的架構訊號是 Muse Code：Meta 第一次把「模型」和「跑這個模型的 agent 產品」一起發佈，而不是只丟一個 API 端點。Muse Code 主打多 agent 協作下的可觀察性——每個子 agent 產生的軌跡、每次工具呼叫、每次 steer/cancel 都能重播，這對除錯多 agent 系統很關鍵。

- 如果你在做知識工作型 agent（報告生成、資料分析、簡報製作）：GDPval-AA v2 Elo 大幅提升是個訊號，值得評估用它取代目前的 pipeline，尤其是預算敏感的場景——它是同分數帶最便宜的選項
- 如果你在做多 agent 系統且苦於除錯：Muse Code 的事件日誌（每個子 agent、每次工具呼叫都可重播）解決了多 agent 系統「出錯了但看不出哪一步」的常見痛點，值得拿來參考其可觀察性設計
- 不適合：純硬核 coding 場景，Terminal-Bench v2.1 只小幅進步 2pp，跟 GPT-5.6 Sol Max、Claude Opus 5 Max 這類專攻 coding 的模型相比競爭力有限；也要注意實際帳單可能因回答變長而上漲，即使 rate card 沒變

## 今日收穫

Muse Spark 1.2 的 rate card 跟前代一字不差，但因為模型回答變長了 78%，跑同一套 benchmark 的實際花費漲了 36.6%——這提醒我們「定價沒變」不等於「成本沒變」，評估模型升級時要看實測 token 用量，不能只比對 per-token 費率。

## 參考資料

- [Meet Muse Spark 1.2 and Muse Code, the first coding agent from Meta — Meta AI Developer Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-code/)
- [Muse Spark 1.2 — Meta for Developers](https://developer.meta.com/ai/models/muse-spark/)
- [Muse Spark 1.2: Improved Agentic Performance at Higher Cost per Task — Artificial Analysis](https://artificialanalysis.ai/articles/muse-spark-1-2)
- [Muse Spark 1.2 (xhigh) — Intelligence, Performance & Price Analysis — Artificial Analysis](https://artificialanalysis.ai/models/muse-spark-1-2)
- [Meta Muse Spark 1.2 pricing: the rate card that never changed — eesel AI](https://www.eesel.ai/blog/meta-muse-spark-12-pricing)
