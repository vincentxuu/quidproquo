---
title: "模型卡｜Reflection Beam 1.0"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, reflection-ai, model-family-beam]
lang: zh-TW
description: "Reflection AI 發佈首個開放權重模型 Beam——501B/23B MoE、Apache 2.0、1M context，SWE-bench Verified 81.6%，訴求「西方開放權重前沿」"
tldr: "Reflection Beam 1.0：501.3B 總參數／23.4B 啟用 MoE，2026-10-05 預告、10-16 正式開放權重（Apache 2.0），1M context；SWE-bench Verified 81.6%（BF16）、Terminal-Bench 2.1 80.1%、AIME 2026 97.7%；Together AI 代管定價 input $0.40／output $1.20（每百萬 token，快取 input $0.04）；官方定位為對標 GLM 5.2／逼近 Qwen 3.8 Max 的西方開放權重 agentic coding 模型，但原始能力仍落後 Kimi K3，優勢在推理 token 效率。"
series:
  name: "AI Model Tracker"
  order: 50
glossary:
  - term: "Beam"
    def: "Reflection AI 發布的開放權重模型家族，首款模型為 501B 總參數／23B 啟用的 MoE，2026 年 10 月以 Apache 2.0 授權開放"
  - term: "Reflection AI"
    def: "美國 AI 新創，先前以強化學習代理（agentic coding）研究聞名，Beam 是其首個開放權重模型系列"
---

> 🌏 [English version](/posts/daily/2026-10-18-model-reflection-beam-1-0-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `reflection/Beam-1.0-501B-A23B` |
| 廠商 | Reflection AI |
| 參數量 | 501.3B 總參數／23.4B 啟用（MoE，256 專家，52 層：3 dense + 49 MoE） |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $0.40（Together AI 代管，快取 input $0.04） |
| Output 定價 (USD/1M tokens) | $1.20（Together AI 代管） |
| 開源 | 是（Apache 2.0） |
| 發布日 | 2026-10-16（權重／模型卡／安全報告正式釋出；10-05 為早鳥預告） |
| 官方公告 | [Reflection AI Blog：Introducing Beam](https://reflection.ai/blog/introducing-beam) |
| HuggingFace | [reflection/Beam-1.0-501B-A23B](https://huggingface.co/reflection/Beam-1.0-501B-A23B) |
| 家族 | Beam（Reflection AI 首個模型家族；官方表示會持續推出規模更大的後續模型） |

## 能力亮點

- 501.3B／23.4B 的稀疏 MoE 架構（256 專家、Gated GQA＋滑動窗口注意力），搭配 1M context，官方強調這是為 agentic coding 設計、文字輸入輸出為主的模型
- 官方宣稱在同等解題品質下，比同級開放模型少用約 3 倍的推理 token，換算下來每 GPU-hour 吞吐量更高
- 預訓練 23.8 兆 token，RL 階段動用 10,500 張 NVIDIA GB300 跑滿 4 週、產出超過 1 億次 rollout，官方稱是目前已知開放實驗室中規模最大的 RL 訓練之一
- 同時釋出 BF16／FP8／NVFP4 三種數值精度，並附帶推測性解碼 drafter 模型，官方宣稱是目前開放權重中少數原生支援三種精度部署的模型之一

## Benchmark 表現

| Benchmark | Beam (BF16) | 首代模型 | 競品最強（官方早鳥比較圖） |
|---|---|---|---|
| SWE-bench Verified | 81.6% | 無前代可比 | Inkling 77.6%、Nemotron 3 Ultra 70.7%（GLM/Kimi/Qwen 系列未在此項公布分數） |
| Terminal-Bench v2.1 | 80.1% | 無前代可比 | DeepSeek V4.1 Flash 90.6%、Kimi K3 88.3%、GLM 5.3 88.2% |
| SWE-bench Pro v1 | 66.1% | 無前代可比 | Qwen 3.8 Max 67.7%、GLM 5.2 62.1% |
| AIME 2026 | 97.7% | 無前代可比 | ⚠️ 官方未提供同題庫競品分數 |

⚠️ 以上均為 Reflection 官方自測；「競品最強」欄取自官方 10/5 早鳥發表部落格內的比較圖（評測設定與 10/16 正式模型卡略有差異，分數僅供參考，非獨立複現）。FP8／NVFP4 版本在 SWE-bench Verified 分別為 80.2%／80.7%，與 BF16 差距在 1.5 個百分點內。

## 與前代/競品比較

Beam 是 Reflection AI 的第一個開放權重模型，沒有「前代」可比，但官方把它直接擺進和中國開放權重旗艦的擂台：官方部落格自陳「與 GLM 5.2 相當、逼近 Qwen 3.8 Max」，但在原始能力上仍輸給 Kimi K3——Terminal-Bench v2.1 上 Kimi K3（88.3%）、DeepSeek V4.1 Flash（90.6%）都明顯高於 Beam 的 80.1%。

Beam 真正的賣點不是贏分數，而是效率：23.4B 啟用參數對比 501.3B 總參數（啟用率僅 4.7%），加上官方宣稱的「3 倍推理 token 效率」，讓它在 SWE-bench Verified 上用遠少於 Qwen 3.8 Max（2.4T 參數級）的推理成本就拿下 81.6%。Together AI 代管定價 input $0.40／output $1.20（每百萬 token）也落在中低價位，但這僅反映 23.4B 啟用參數的計算量，不代表 501.3B 完整權重的儲存與部署成本——NVFP4 四位元權重仍需約 251GB 顯存容量。

## 對 Agent 開發的意義

Beam 的意義更多在「誰能用」而不是「誰最強」：它是目前少數在 Apache 2.0 下開放超過 500B 參數等級的美系模型，而且官方同步開源了自家的 coding agent 環境 Mirror CLI，並相容 Claude Code、OpenCode、Pi、Hermes 等既有 agentic harness，加上原生 MCP 工具呼叫與 1M context。

- 如果你在做 agentic coding 工具且不想被單一閉源 API 綁定：Beam＋Apache 2.0 權重給了一條可以自行部署、微調、蒸餾的路，不用在「用 Qwen/GLM/Kimi」和「用 Claude/GPT」之間二選一
- 如果你在做需要長時間多步驟工具呼叫的 agent（長時間 debug、repo 級重構）：1M context＋token 效率的組合，理論上能把同一條長任務的推理成本壓低，值得拿來做概念驗證
- 不適合：非英語為主的場景（官方明講以英文對齊為主）、極低延遲的單輪問答（Beam 的優勢在長任務的 token 效率，不是單次回應速度）、沒有能力自建推論基礎設施的團隊（即使 4-bit 量化，約 251GB 的權重仍是一個不小的部署門檻）

## 今日收穫

Beam 的官方敘事把「開放權重前沿」重新定義成兩條賽道：中國實驗室在拚原始分數上限（Kimi K3、GLM 5.3），Reflection 選擇在「同樣解題品質、更少 token」上競爭。這提醒我們評估開放模型時，光看 benchmark 排行榜會漏掉一個關鍵變數——啟用參數與推理 token 數才是決定真實推論成本的因素，而不是總參數量或單一分數高低。

## 參考資料

- [Reflection AI Blog：Introducing Beam](https://reflection.ai/blog/introducing-beam)
- [Reflection Beam Model Card（Hugging Face）](https://huggingface.co/reflection/Beam-1.0-501B-A23B)
- [Together AI：Reflection Beam API 定價與文件](https://www.together.ai/models/reflection-beam)
- [Data Studios：Reflection Beam 501B Open-Weight Coding Model: Benchmarks and Costs](https://www.datastudios.org/post/reflection-beam-501b-23b-open-weights-1m-context-coding-benchmarks)
