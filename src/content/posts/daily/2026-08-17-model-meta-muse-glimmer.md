---
title: "模型卡｜Muse Glimmer"
date: 2026-08-17
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta]
lang: zh-TW
description: "Meta 開源 Muse Glimmer——30B 參數本地 agentic 模型，Apache 2.0 全開源，MCP Atlas 75.5 分大幅領先同級模型，DFlash 投機解碼讓 RTX 5090 解碼速度提升 3.1 倍"
tldr: "Muse Glimmer（HF：meta-models/Muse-Glimmer-30B）：29.6B 參數、131K+ context、Apache 2.0 全開源，本地部署零 token 成本；MCP Atlas 75.5 分（同級 Gemma4-31B 54.2、Qwen3.6-27B 62.5）、SWE-Bench Pro 51.2 分領先同級，但 OSWorld-Verified、TerminalBench 2.1 落後 Qwen3.6-27B；4-bit 量化後 20GB 內可跑，RTX 5090 上 DFlash 投機解碼提速 3.1 倍"
series:
  name: "AI Model Tracker"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-08-17-model-meta-muse-glimmer-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `meta-models/Muse-Glimmer-30B`（Hugging Face 開源權重，無官方託管 API ID） |
| 廠商 | Meta（Meta Superintelligence Labs） |
| 參數量 | 29.6B（含約 1.8B 視覺編碼器 ViT-G/14） |
| Context Window | 131,072+ tokens |
| Input 定價 (USD/1M tokens) | $0.00（開源權重，本地部署免費；第三方託管如 Together AI／Fireworks AI／OpenRouter 依各自費率收費） |
| Output 定價 (USD/1M tokens) | $0.00（同上，無 Meta 官方 API 定價） |
| 開源 | 是（Apache 2.0，含全精度權重、4-bit 量化版、DFlash drafter、視覺編碼器） |
| 發布日 | 2026-08-10 |
| 官方公告 | [Meta AI Research Blog](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model) |

## 能力亮點

- MCP Atlas（Public）達 75.5 分，大幅領先同尺寸的 Gemma4-31B（54.2 分）與 Qwen3.6-27B（62.5 分），顯示多工具協調、schema 精準呼叫能力在同級模型中領先
- 4-bit 量化後語言模型壓縮到 20GB 以內，可在 24GB／32GB 消費級 GPU 或 Mac 上運行，準確度衰減僅 0.2%（32GB 量級）～1.0%（24GB 量級）
- 搭配基於 DFlash 的投機解碼 drafter，RTX 5090 上解碼速度從 74.9 tok/s 提升到 233.4 tok/s（3.1 倍），Apple M5 Max 提升 1.8 倍
- 原生多模態感知編碼器支援截圖、圖表、文件理解，訓練涵蓋超過 100 種語言，並支援 low/medium/high/xhigh 四段可調推理強度

## Benchmark 表現

| Benchmark | Muse Glimmer-30B | 同級競品 Gemma4-31B | 同級競品 Qwen3.6-27B |
|---|---|---|---|
| MCP Atlas（Public，多工具協調） | 75.5 | 54.2 | 62.5 |
| SWE-Bench Pro（agentic 程式修復） | 51.2 | 36.9 | 50.2 |
| τ3-Banking（多輪任務完成） | 23.5 | 15.1 | 16.7 |
| Gaia2（通用 agent 任務） | 43.3 | 36.4 | 40.0 |
| AIME 2026（數學推理） | 94.7 | 89.2 | 94.1 |
| OSWorld-Verified（電腦操作） | 65.9 | 58.5 | **75.6** |
| TerminalBench 2.1（終端操作） | 51.7 | 43.4 | **60.7** |

⚠️ 以上為 Meta 官方公佈的內部評測結果（含跨廠商模型比較），非各廠商自行公佈的第三方複現數據；OSWorld-Verified、TerminalBench 2.1、GDPVal-AA v2（953 分，Qwen3.6-27B 為 1141 分）等項目 Qwen3.6-27B 領先。

## 與前代/競品比較

Muse Glimmer 是全新的本地 agentic 模型產品線，沒有直接的「前代」版本可比——它是從 Meta 自家較大的教師模型 Muse Spark 蒸餾而來（logit distillation + on-policy distillation + RL），刻意用能力換取可在消費級硬體上本地運行的體積與速度，定位跟雲端 API 模型完全不同。

跟同尺寸開源競品比，Muse Glimmer 在「多工具協調 + agentic 任務完成」這類項目上優勢明顯：MCP Atlas 領先 Gemma4-31B 21.3 分、領先 Qwen3.6-27B 13.0 分，τ3-Banking、Gaia2、SWE-Bench Pro 也都是三者中最高分。但在「精確操作既有環境」的任務上落後 Qwen3.6-27B：OSWorld-Verified 落後 9.7 分、TerminalBench 2.1 落後 9.0 分，顯示 Muse Glimmer 更擅長「規劃與工具呼叫」而非「精細環境操作」。

授權策略是最大差異化：Muse Glimmer 連同全精度權重、4-bit 量化版、DFlash drafter、視覺編碼器全部以 Apache 2.0 開源，本地部署零 token 成本；相較 Qwen3.6-27B 常見的 Apache 2.0／自訂授權組合，Meta 這次把推理加速元件（drafter）也一併開源，是同類釋出中較完整的一次。

## 對 Agent 開發的意義

Muse Glimmer 把「本地優先」的 agent 架構往前推了一步——過去要在無網路或高隱私要求的環境跑出接近雲端等級的 agentic 表現，選擇非常有限；MCP Atlas 75.5 分加上 4-bit 量化後 20GB 內可跑，代表消費級硬體已經能承載相當程度的多工具 agent 工作流。

- 如果你在做本地優先或隱私敏感的個人助理（如處理本地文件、螢幕截圖、無需上雲的日常工具呼叫）：Muse Glimmer 的多模態感知編碼器 + Scaffold 相容性（OpenClaw、Hermes Agent）可以直接跑在使用者的 Mac 或 PC 上，不需要 API key、沒有 per-token 成本
- 如果你在做需要大量重複工具呼叫、但單次任務不需要頂級推理深度的 agent（客服 triage、資料清洗、批次文件分類）：本地零邊際成本加上 DFlash 3.1 倍解碼加速，長時間運行的總成本會遠低於呼叫雲端 API
- 不適合：需要精確操作既有電腦環境（OSWorld-Verified 65.9 分落後 Qwen3.6-27B 近 10 分）或深度知識工作判斷（GDPVal-AA v2 落後 Qwen3.6-27B 188 分）的場景，這類任務仍建議搭配 frontier tier 雲端模型

## 今日收穫

過去預設「本地小模型」的 agentic 能力必然全面落後同代雲端/大型模型，差距只會體現在規模上。但 Muse Glimmer 的評測顯示這個落差正在變得「不均勻」：在 MCP Atlas、τ3-Banking 這類多工具協調任務上，它甚至打贏同尺寸的 Qwen3.6-27B；但在 OSWorld-Verified、TerminalBench 這類需要精確操作既有環境的任務上明顯落後。這代表本地模型的優化重點正從「整體能力追平雲端」轉向「針對特定 agent 子能力做取捨」——挑選本地模型時，需要先確認自己的 agent 場景更接近「工具協調規劃」還是「環境精細操作」。

## 參考資料

- [Introducing Muse Glimmer: An Open Agentic Model That Runs on Your Device — Meta AI Research](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model)
- [meta-models/Muse-Glimmer-30B — Hugging Face Model Card](https://huggingface.co/meta-models/Muse-Glimmer-30B)
- [Build with Muse Glimmer — Meta AI Developers Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-glimmer/)
- [Meta returns to open source with Muse Glimmer — VentureBeat](https://venturebeat.com/technology/meta-returns-to-open-source-with-muse-glimmer-an-apache-2-0-licensed-30b-parameter-ai-model-optimized-for-agents-available-now)
