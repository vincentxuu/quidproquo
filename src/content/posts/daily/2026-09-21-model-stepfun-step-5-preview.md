---
title: "模型卡｜Step 5 Preview"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, stepfun, model-family-stepfun]
lang: zh-TW
description: "中國「AI 六小虎」之一 StepFun 發佈旗艦模型 Step 5 Preview——600B 總參數／27B 活躍參數 MoE、1M context，Artificial Analysis Intelligence Index 44 分打平 Kimi K3，單工作任務成本卻只要對手的十分之一"
tldr: "Step 5 Preview（StepFun 階躍星辰）：2026-09-20 API 上線，開源權重預計 2026-10-15 釋出；600B 總參數／27B 活躍參數稀疏 MoE、92 層窄深 Transformer、1M tokens context、支援文字＋圖片＋影片輸入；API 定價 input $1.00（cache hit $0.05）／output $2.70 per 1M tokens；Artificial Analysis Intelligence Index 獨立評測 44 分，與 Kimi K3、Grok 4.6 同級，落後 Claude Opus 5（51）與 GPT-6 Astra／Claude Fable 5.1（並列 53）；同級模型裡每工作任務成本比 Gemini 3.8 Flash 低約 42%；對 Agent 開發的意義是提供「準前沿智能＋大幅降低成本」的中階選項，適合長時間研究型 Agent 與財務分析場景"
series:
  name: "AI Model Tracker"
  order: 28
glossary:
  - term: "StepFun"
    def: "階躍星辰，2023 年 4 月成立於上海的中國大模型新創，「AI 六小虎」之一，已累計發佈 38 個基礎模型"
  - term: "Artificial Analysis Intelligence Index"
    def: "第三方評測機構 Artificial Analysis 綜合多項 benchmark 算出的模型智能分數，常用於跨廠商模型的橫向比較"
---

> 🌏 [English version](/en/posts/daily/2026-09-21-model-stepfun-step-5-preview-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `step-5-preview` |
| 廠商 | StepFun（階躍星辰） |
| 參數量 | 600B 總參數，27B 活躍參數（稀疏 MoE，每 token 約啟動 4.5% 權重） |
| Context Window | 1,000,000 tokens（最大輸出 64k tokens） |
| Input 定價 (USD/1M tokens) | $1.00（cache miss）／$0.05（cache hit） |
| Output 定價 (USD/1M tokens) | $2.70（含推理 token） |
| 開源 | 否（目前僅 API；官方宣布開源權重將於 2026-10-15 釋出） |
| 發布日 | 2026-09-20 |
| 官方公告 | [StepFun：Step 5 Preview: Advancing the Pareto Frontier](https://www.stepfun.com/step-5-preview) |
| HuggingFace | 尚未提供（權重未釋出，暫無 HuggingFace 頁面） |
| 家族 | StepFun Step 系列（Step-2 千億參數 MoE，2024-07 → Step 3.5 Flash → Step 3.7 Flash → Step 5 Preview，本次） |

## 能力亮點

- Artificial Analysis 獨立評測 Intelligence Index 44 分，與 Kimi K3、Grok 4.6（high）同級，只落後 GLM-5.3 一分，但每工作任務成本僅 $0.72，比 Gemini 3.8 Flash（high，$1.24）低約 42%
- 92 層窄深 Transformer 架構（不走加寬路線），搭配 MTP-3 投機解碼、FP8 MoE、KV-cache offload，官方稱長時序強化學習訓練端到端加速逾 3 倍
- 24 小時長時任務測試中，將 H100 上 MLA GPU kernel 優化到 508 TFLOPS，優於 Claude Opus 5 的 493 TFLOPS；另一組測試把 Qwen3-30B-A3B 的 AIME24 分數從 53.3% 自動化後訓練提升到 60%，用更少 annotator token 打平 Claude Opus 5
- 單一 Agent 動作內協調 950 次網頁抓取，完成涵蓋 1,000 個地點、25 年時間跨度的氣候研究資料彙整（30 萬筆月度紀錄、11 個變數）

## Benchmark 表現

| Benchmark | Step 5 Preview | 前代模型 | 競品最強 |
|---|---|---|---|
| Artificial Analysis Intelligence Index | 44（獨立評測） | 無直接前代（首個 Step 5 系列模型） | Claude Fable 5.1／GPT-6 Astra 並列 53 |
| DeepSWE v1.1 | 67.7% | 無直接前代 | Claude Opus 5 74.0%、GPT-6 Astra 74.1% |
| StepCodeBench（StepFun 自建） | 49.0% | 無直接前代 | Claude Opus 5 63.9% |
| FrontierFinance | 66.4% | 無直接前代 | Claude Opus 5 69.7% |
| DRACO | 83.3% | 無直接前代 | Claude Opus 5 87.6% |

⚠️ 表中 Step 5 Preview 除 Artificial Analysis Intelligence Index 外均為 StepFun 自測（跑於 `high` 推理強度，而 Claude Opus 5／GPT-6 Astra 跑於各自 `max` 強度，非同一設定的直接比較），尚待第三方覆現。Artificial Analysis Intelligence Index 為第三方獨立評測，已實測 API 輸出速度約 99.8 tokens/秒。

## 與前代/競品比較

Step 5 Preview 是 StepFun 首個掛上「Step 5」代號的旗艦模型，前代 Step 3.7 Flash／Step 3.5 Flash 屬中階模型，兩者定位不同，因此上表沒有嚴格意義的前代分數可比。跟同級競品比，Step 5 Preview 在編碼與金融類 benchmark（DeepSWE、StepCodeBench、FrontierFinance、DRACO）上全面落後 Claude Opus 5 與 GPT-6 Astra，差距約 5-14 個百分點；但在 Artificial Analysis Intelligence Index 這個涵蓋面更廣的綜合指標上只小輸 GLM-5.3 一分，且打平 Kimi K3、Grok 4.6。

真正的差異化在定價策略：StepFun 把 Step 5 Preview 定位成「Pareto frontier」打法——用遠低於前沿模型的成本，換取接近但非最頂尖的智能。Artificial Analysis 估算 Step 5 Preview 每工作任務成本僅 $0.72，是 Claude Fable 5.1（$7.63）的十分之一不到，也比 Gemini 3.8 Flash（$1.24）低 42%。代價是輸出偏冗長：同一評測跑出 1.6 億個輸出 token，遠高於中位數 9,200 萬，會侵蝕部分逐 token 定價的優勢；輸出速度（約 100 tokens/秒）也明顯慢於 Gemini 3.8 Flash 的 331 tokens/秒。

## 對 Agent 開發的意義

1M context window 加上原生支援文字／圖片／影片輸入，讓 Step 5 Preview 適合需要長時間累積上下文的 Agent 任務——官方展示的氣候研究案例，單一 Agent 動作內就協調了 950 次網頁抓取並維持狀態，這類需要「持續進度、不斷呼叫工具」的深度研究場景，長 context 直接減少了外部記憶體/RAG 層的必要性。

- 如果你在做長時研究型 Agent（deep research、多輪資料蒐集彙整）：Step 5 Preview 的 1M context 加上單動作內百次量級的工具呼叫協調能力，適合拿來取代「切片檢索＋多輪拼接」的複雜 pipeline，尤其如果任務容許稍高的延遲與輸出冗長
- 如果你在做財務分析 Agent：FrontierFinance／FinStepBench 系列 benchmark 顯示 StepFun 對金融場景有特別優化，估值、盡職調查、深度研究三類任務表現接近 Claude Opus 5，且 API 成本只是零頭
- 不適合：需要即時互動或低延遲回應的場景（輸出速度僅約 100 tokens/秒，遠慢於 Gemini 3.8 Flash 的 331 tokens/秒）；也不適合現在就要自架部署的場景，因為開源權重要等到 2026-10-15 才會釋出，目前只能透過 StepFun API 使用

## 今日收穫

Step 5 Preview 的「narrow-deep」架構選擇（92 層、不加寬）是個值得注意的反例——多數旗艦模型競賽近年偏向擴大單層寬度或增加專家數，StepFun 卻選擇堆疊層數來換取長 prefill 下的多跳推理路徑。這提醒了一件事：當大家都在同一個 benchmark 排行榜上卷分數時，「用什麼架構達到同一分數」的差異，可能比分數本身更值得追蹤——因為那決定了未來能不能在同樣的成本結構下繼續優化。

## 參考資料

- [StepFun 官方發佈頁：Step 5 Preview: Advancing the Pareto Frontier](https://www.stepfun.com/step-5-preview)
- [StepFun 官方文件：Step 5 Preview 模型規格頁](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)
- [MarkTechPost：StepFun Launches Step 5 Preview: A 600B-Total, 27B-Active MoE Model With 1M Context for Long-Horizon Agentic Work](https://www.marktechpost.com/2026/09/20/stepfun-launches-step-5-preview/)
- [OfficeChai：China's StepFun Releases Step 5 Preview, Beats Gemini 3.8 Flash On Performance And Cost](https://officechai.com/ai/chinas-stepfun-releases-step-5-preview-beats-gemini-3-8-flash-on-performance-and-cost)
- [Artificial Analysis：Step 5 Preview 模型評測頁](https://artificialanalysis.ai/models/step-5)
