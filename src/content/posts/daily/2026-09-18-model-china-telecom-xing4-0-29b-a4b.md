---
title: "模型卡｜Xing4.0-29B-A4B"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, china-telecom, model-family-xing]
lang: zh-TW
description: "中國電信開源 Xing4.0-29B-A4B——首個完全在華為昇騰 NPU 上從頭訓練的同量級模型，SWE-bench Verified 75.0 分逼近參數更大的 Qwen3.6-35B-A3B"
tldr: "Xing4.0-29B-A4B（China Telecom Artificial Intelligence Technology／XingChen-AGI，前身 TeleChat）：29B 總參數僅 4B 活躍、256K 原生 context（可擴展到 512K）、Apache-2.0 開源；SWE-bench Verified 75.0（同量級 Qwen3.6-35B-A3B 為 76.0、Gemma4-26B-A4B 僅 53.0）、Terminal-Bench 2.1 57.5 三者最高；首個完全基於昇騰 910C＋MindSpore 從頭訓練完成的同規模模型，訓練吞吐較未優化基線提升約 96%"
series:
  name: "AI Model Tracker"
  order: 24
glossary:
  - term: "Xing"
    def: "中國電信人工智慧科技有限公司開發的大型語言模型家族，前身為 TeleChat，Xing4.0 是最新一代"
---

> 🌏 [English version](/en/posts/daily/2026-09-18-model-china-telecom-xing4-0-29b-a4b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `XingChen-AGI/Xing4.0-29B-A4B` |
| 廠商 | 中國電信人工智慧科技有限公司（China Telecom Artificial Intelligence Technology） |
| 參數量 | 29B 稀疏 MoE（64 個路由專家＋1 個共享專家，每 token 啟用 4 個，實際活躍約 4B） |
| Context Window | 256K tokens（可擴展到 512K） |
| Input 定價 (USD/1M tokens) | 未公開（開源模型，官方未提供托管 API，需自行部署） |
| Output 定價 (USD/1M tokens) | 未公開（開源模型，官方未提供托管 API，需自行部署） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-09-17 |
| 官方公告 | [GitHub：XingChen-AGI/Xing4.0-29B-A4B](https://github.com/XingChen-AGI/Xing4.0-29B-A4B) |
| HuggingFace | [XingChen-AGI/Xing4.0-29B-A4B](https://huggingface.co/XingChen-AGI/Xing4.0-29B-A4B) |
| 家族 | Xing 系列（前身 TeleChat，前代旗艦為 2025-12 發布的 TeleChat3-105B-A4.7B-Thinking／TeleChat3-36B-Thinking） |

## 能力亮點

- SWE-bench Verified 達 75.00 分，逼近參數規模更大的 Qwen3.6-35B-A3B（76.00），大幅超越同量級的 Gemma4-26B-A4B（53.00）
- Terminal-Bench 2.1 拿下 57.50 分，同時超過 Gemma4-26B-A4B（30.00）與 Qwen3.6-35B-A3B（51.50），是官方對照表三者中最高
- 29B 總參數只需 4B 活躍即可達到上述表現，是首個完全在華為昇騰 NPU 平台（Ascend 910C 叢集＋MindSpore 框架）從頭訓練完成的同量級模型
- mHC＋MLA＋MTP 架構針對多步驟規劃與工具呼叫原生優化，官方稱透過細粒度 MoE 通訊優化、選擇性重計算等多層協同優化，訓練吞吐較未優化基線提升約 96%

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| SWE-bench Verified | 75.00 | TeleChat3 未在同一評測集公開對應分數 | Qwen3.6-35B-A3B 76.00 |
| Terminal-Bench 2.1 | 57.50 | TeleChat3 未在同一評測集公開對應分數 | Qwen3.6-35B-A3B 51.50（Gemma4-26B-A4B 僅 30.00） |
| Claw-Eval | 76.55 | TeleChat3 未在同一評測集公開對應分數 | Qwen3.6-35B-A3B 74.54 |
| DeepresearchBII | 60.80 | TeleChat3 未在同一評測集公開對應分數 | Qwen3.6-35B-A3B 59.70 |
| AIME2026 | 90.00 | TeleChat3 未在同一評測集公開對應分數 | Qwen3.6-35B-A3B 92.70（此項落後） |

⚠️ 以上均為 China Telecom 官方自測（GitHub／Hugging Face 模型卡公告），尚未見第三方獨立複現；各 benchmark 的取樣參數（temperature 0.8–1.0 不等）由官方分別設定，可能影響跨模型可比性。

## 與前代/競品比較

前代 TeleChat3 於 2025 年 12 月發布時最大規格達 105B-A4.7B-Thinking（MoE）與 36B-Thinking（dense）兩版，用華為昇騰 910B 晶片訓練；Xing4.0-29B-A4B 改用更新的昇騰 910C 叢集＋MindSpore 框架，參數規模明顯收斂到 29B（4B 活躍），但官方公告未提供與 TeleChat3 在相同評測集上的直接對比分數，無法精確量化世代進步幅度，只能確認這是「架構與硬體協同優化」路線的延續而非單純堆參數。

跟同量級競品比，Xing4.0 在 agentic／coding 類指標（SWE-bench Verified、Terminal-Bench 2.1、Claw-Eval、DeepresearchBII）全面持平或超越 Gemma4-26B-A4B，並在 Terminal-Bench 2.1、Claw-Eval 兩項也超過參數更大的 Qwen3.6-35B-A3B；但在偏純數學推理的 AIME2026（90.00 vs 92.70）與長上下文檢索 AA.LCR（61.00 vs 62.00）上略遜於 Qwen3.6-35B-A3B，顯示這次優化重心明顯偏向 agent／coding 任務而非純數學推理。

定價策略上，Xing4.0 是完全開源模型（Apache-2.0），官方未提供托管 API 或定價，需自行部署；這跟 Gemini、GPT 等閉源產品的按 token 計費模式完全不同，採用者要自行承擔推理基礎設施成本，換來的是不受單一雲端供應商綁定的部署自由度。

## 對 Agent 開發的意義

這是首個完全在華為昇騰 NPU＋MindSpore 軟體棧上從零訓練完成的量產級 Agent 模型，README 明確列出已針對 OpenCode、Claude Code、OpenClaw、Hermes 等主流 Agent 框架做格式對齊；如果你在做需要在無法使用 NVIDIA GPU 的環境下部署 Agent 系統：Xing4.0 是目前少數經過大規模驗證、在非 NVIDIA 算力上跑出主流 Agent benchmark 可比分數的選項。

29B 總參數只需 4B 活躍，配合 256K 原生上下文（可擴展到 512K），如果你在做本地或私有部署的 coding agent：硬體門檻比動輒破百 B 的 MoE 模型低很多，官方也提供 vLLM／SGLang／KTransformers 三種推理框架的部署範例（部分尚待各框架 PR 合併）。

不適合：以純數學／邏輯推理為主的場景（AIME2026 分數落後同量級競品），以及需要官方托管 API、免自行運維就想快速上線的團隊——目前只能自行部署，沒有官方計費的雲端端點，且部分推理框架的 Xing4.0 支援仍卡在 PR 審核階段（尚未合併進主分支）。

## 今日收穫

之前以為國產算力訓練大模型還停留在「能訓練但落後一代」的階段，Xing4.0 在 agentic 類 benchmark 上正面打平甚至超過用主流 GPU 訓練的同量級模型，說明昇騰＋MindSpore 這套軟體棧的成熟度已經跨過「單純能訓練」的門檻，開始能在特定任務方向上打出差異化優勢。

## 參考資料

- [Hugging Face：XingChen-AGI/Xing4.0-29B-A4B](https://huggingface.co/XingChen-AGI/Xing4.0-29B-A4B)
- [GitHub：XingChen-AGI/Xing4.0-29B-A4B（含 News、架構與評測表）](https://github.com/XingChen-AGI/Xing4.0-29B-A4B)
- [arXiv：Training Report of TeleChat3-MoE](https://arxiv.org/abs/2512.24157)
- [SCMP：China Telecom develops MoE models trained entirely on Huawei's AI chips](https://www.scmp.com/tech/big-tech/article/3340591/china-telecom-develops-countrys-first-moe-models-trained-entirely-huaweis-ai-chips)
- [AI/TLDR：Xing4.0-29B-A4B — China Telecom's agent model](https://ai-tldr.dev/releases/china-telecom-xing4-0-29b-a4b/)
