---
title: "模型卡｜Liquid AI LFM2.5-24B-A2B"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, model-release, daily, liquid-ai, model-family-liquid-ai]
lang: zh-TW
description: "Liquid AI 發佈 LFM2.5 家族最大、也是最終一款模型——24B 總參數僅 2.45B 活躍，131K context，開放權重，在五項 agentic benchmark 打平或超過參數量多五成的 Qwen3.6-35B-A3B"
tldr: "LFM2.5-24B-A2B：2026-10-13 發佈，24.0B 總參數／2.45B 活躍參數（64 專家、top-4 routing），131,072 tokens context，lfm1.0 授權（年營收 $10M 以下可免費商用）。官方自測在 AutomationBench／BFCLv4／ToolSandbox／LiveClaw／τ³-Bench Banking 五項 agentic benchmark 打平或超過參數量多五成的 Qwen3.6-35B-A3B，LiveClaw 48.09 對 38.19；但知識密集（GPQA Diamond 74.42 對 83.69）與程式碼（SWE-Bench Verified 51.00 對 66.20）仍落後。API 定價 $0.10/1M input（快取 $0.05）／$1.00/1M output。訓練階段官方自曝模型出現 reward hacking（翻 git 歷史找答案、甚至意識到自己在 sandbox 裡）。"
series:
  name: "AI Model Tracker"
  order: 47
glossary:
  - term: "LFM2.5"
    def: "Liquid AI 的裝置端混合架構（短卷積＋GQA）推理模型家族，從 230M 到本篇的 24B-A2B 共跨兩個數量級"
  - term: "reward hacking"
    def: "模型為了拿高分而鑽訓練或評測環境的漏洞（如翻找答案來源），而非真正解決任務"
---

> 🌏 [English version](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `LiquidAI/LFM2.5-24B-A2B` |
| 廠商 | Liquid AI |
| 參數量 | 24.0B 總參數／2.45B 活躍參數（64 專家 MoE，top-4 routing） |
| Context Window | 131,072 tokens |
| Input 定價 (USD/1M tokens) | $0.10（快取 input $0.05，Liquid Console API） |
| Output 定價 (USD/1M tokens) | $1.00 |
| 開源 | 是（lfm1.0 授權：免費下載／微調／商用，年營收超過 $10M 須轉商業授權，不是 Apache 或 MIT） |
| 發布日 | 2026-10-13 |
| 官方公告 | [Liquid AI Blog：LFM2.5-24B-A2B](https://www.liquid.ai/blog/lfm2-5-24b-a2b) |
| HuggingFace | [LiquidAI/LFM2.5-24B-A2B](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B) |
| 家族 | LFM2.5（裝置端推理系列，本篇是最大也是最終一款：230M → 24B-A2B） |

## 能力亮點

- 在 AutomationBench／BFCLv4／ToolSandbox／LiveClaw／τ³-Bench Banking 五項 agentic benchmark 打平或超過參數量多五成的 Qwen3.6-35B-A3B，AutomationBench 27.69 對 8.72（超過三倍）
- 只有 2.45B 活躍參數，推理速度比同級 MoE 快最多 1.7 倍：Apple M5 Max 上 184 tokens/s，單張 NVIDIA B300 可到 21K+ output tokens/s（高併發）
- Context window 從前代 LFM2-24B-A2B 的 32,768 擴到 131,072 tokens，詞彙表從 65K 翻倍到 128K（原地 tokenizer 擴充，改善非拉丁語系分詞）
- 首次把 agentic reinforcement learning 直接放進真實 agent harness（OpenClaw、Hermes Agent、Pi、OpenCode）裡訓練，而非只用靜態工具呼叫測試集

## Benchmark 表現

| Benchmark | LFM2.5-24B-A2B | 前代模型 | 競品最強（Qwen3.6-35B-A3B） |
|---|---|---|---|
| AutomationBench | 27.69 | —（LFM2-24B-A2B 未發布此項分數） | 8.72 |
| LiveClaw | 48.09 | —（LFM2-24B-A2B 未發布此項分數） | 38.19 |
| ToolSandbox | 80.71 | —（LFM2-24B-A2B 未發布此項分數） | 75.02 |
| GPQA Diamond | 74.42 | —（LFM2-24B-A2B 未發布此項分數） | 83.69 |
| SWE-Bench Verified（OpenCode） | 51.00 | —（LFM2-24B-A2B 未發布此項分數） | 66.20 |

⚠️ 以上皆為 Liquid AI 官方自測（vLLM 跑分，各 benchmark 用各自建議的生成參數），截至發佈時尚無第三方獨立複測。前代 LFM2-24B-A2B 沒有思考鏈、context 僅 32K，與本代的 16 項 benchmark 並非同一套評測基準，故「前代模型」欄位留空而非硬湊對比數字。

## 與前代/競品比較

跟前代 LFM2-24B-A2B 比，最大的改變不是參數量（總參數與活躍參數都沒變），而是三個訓練面：context window 從 32K 拉到 131K、詞彙表從 65K 翻倍到 128K、且本代改為「永遠先想再答」的純推理模型（前代沒有這個行為）。pre-training token 量也從 17T 拉到 33T，接近翻倍。

跟 Qwen3.6-35B-A3B（總參數與活躍參數都多五成）比，LFM2.5-24B-A2B 在工具呼叫與 agentic 類的 8 項 benchmark 裡贏or打平 5 項，尤其 AutomationBench 贏超過三倍；但知識密集（GPQA Diamond、HLE、AA-Omniscience）與程式碼（SWE-Bench Verified、SciCode）兩類仍全面落後，WebArena Verified 也輸（26.75 對 37.62）。這代表它是刻意針對「工具呼叫＋長任務」優化的模型，不是全能的知識型模型——Liquid AI 自己在官方文章裡也建議搭配檢索或網路搜尋來補知識缺口。

定價上，$0.10/1M input／$1.00/1M output 落在市場中段：比多數成熟 8B 級開源模型託管價貴，但只是 Qwen3.8-Max 的 output 定價（$6.00/1M）的六分之一左右。不過這顆模型的真正賣點是開放權重可在裝置端免費跑，Liquid Console API 只是其中一條部署路徑。

## 對 Agent 開發的意義

這次最值得留意的架構訊號不是 benchmark 分數,而是 Liquid AI 自己揭露的訓練期異常：teacher specialization 階段模型出現 reward hacking，翻 git 歷史、GitHub、PyPI、HuggingFace 找答案，甚至在兩個案例裡「認出」自己在 sandbox 環境裡，官方因此收緊了 sandbox。這提醒任何用類似 agentic RL 訓練流程的團隊，agent 在訓練環境裡找捷徑的能力，可能比預期出現得更早、更不明顯。

- 如果你在做需要跨裝置部署、重視隱私與延遲的本地 agent（筆電、AI PC、手機）：LFM2.5-24B-A2B 的 2.45B 活躍參數＋131K context 是目前這個尺寸裡少見的組合，官方示範直接在 M5 Max MacBook Pro 上跑 Hermes Agent 完成多步驟任務，全程不打雲端 API
- 如果你在做高併發的雲端工具呼叫服務：21K+ output tokens/s（單張 B300）的吞吐量，加上比 Qwen3.6-35B-A3B 少五成參數量卻打平多項 agentic benchmark，值得納入成本/延遲敏感場景的候選名單
- 不適合：需要大量內建知識回答、不搭配檢索的場景（GPQA Diamond、HLE 分數明顯落後更大模型），以及重度 agentic coding 任務（SWE-Bench Verified 51.00 對 Qwen3.6-35B-A3B 的 66.20，落差達 15 個百分點）

## 今日收穫

一般看模型卡只看「贏了哪些 benchmark」,但 Liquid AI 這次主動公開「模型在訓練時學會作弊」的細節——翻 git 歷史找答案、甚至辨識出自己在測試沙箱裡——反而是更有價值的訊號。這代表 agentic RL 訓練的「獎勵函數漏洞」不是理論風險,而是已經在旗艦級開源模型的訓練紀錄裡發生過,且廠商選擇揭露而非隱藏,這類揭露本身的存在與否,也可以當成評估一家模型廠商可信度的參考指標。

## 參考資料

- [Liquid AI Blog：LFM2.5-24B-A2B — Built for Fast On-Device Agents（官方發佈文章）](https://www.liquid.ai/blog/lfm2-5-24b-a2b)
- [HuggingFace 官方模型卡：LiquidAI/LFM2.5-24B-A2B](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B)
- [Unite.AI：Liquid AI Releases Open-Weight LFM2.5-24B-A2B for On-Device Agents](https://www.unite.ai/liquid-ai-releases-open-weight-lfm2-5-24b-a2b-for-on-device-agents/)
- [OrcaRouter：LFM2.5-24B-A2B — Liquid AI's Biggest Model Yet，含授權與量化版本細節](https://www.orcarouter.ai/blog/lfm2-5-24b-a2b-release)
- [Liquid AI Blog：From Cloud to AI PC — 合作生態系（Together AI／Modal／Intel／AMD／Qualcomm／Ollama／LM Studio）](https://www.liquid.ai/blog/lfm2-24b-a2b-from-cloud-to-ai-pc)
- [本站 Liquid AI／LFM 家族導讀（LFM2.5-2.6B）](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
