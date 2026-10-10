---
title: "NVIDIA Nemotron 系列：開放權重推理與多模態模型家族"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: zh-TW
tldr: "NVIDIA Nemotron 是 NVIDIA 開發的開放權重混合推理模型家族，涵蓋 Ultra（550B）、Super（120B）、Lightning（30B）、Nano（30B-A3B 多模態推理）等版本。最新版提供 1M 上下文、前沿推理與多模態能力，並以免費端點在 OpenRouter 提供。"
description: "深入介紹 NVIDIA Nemotron 系列的架構演進、各版本差異（Ultra / Super / Lightning / Nano）、開源授權、推理與多模態能力、以及如何在 OpenRouter 免費端點使用。"
draft: true
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-nemotron-en)

[NVIDIA](https://www.nvidia.com/) 的 **Nemotron** 系列是目前開放權重模型中最具規模與推理深度的之一。從 **Nemotron-3 Ultra（550B）** 到 **Nemotron-3.5 Lightning（30B）**，再到專為多模態推理設計的 **Nemotron-3 Nano Omni（30B-A3B）**，Nemotron 涵蓋了從旗艦推理到輕量代理的完整光譜。這些模型以 **混合專家（MoE）** 與 **混合 Transformer-Mamba 架構** 為核心，並在 OpenRouter 以免費模型（`:free`）形式提供，讓開發者能直接使用最強推理能力。

---

## 系列概述

| 版本 | 模型 ID（OpenRouter 免費） | 參數量 | 上下文 | 核心定位 | 訓練組織 |
|---|---|---|---|---|---|
| **Nemotron-3 Ultra** | `nvidia/nemotron-3-ultra-550b-a55b:free` | 55B active / 550B total | 1M | 最強推理與編排 | **NVIDIA** |
| **Nemotron-3 Super** | `nvidia/nemotron-3-super-120b-a12b:free` | 12B active / 120B total | 262K | 多代理複雜應用 | **NVIDIA** |
| **Nemotron-3.5 Lightning** | `nvidia/nemotron-3.5-lightning:free` | 3B active / 30B total | 1M | 高吞吐快速款 | **NVIDIA** |
| **Nemotron-3 Nano Omni** | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 30B-A3B | 256K | 多模態子代理（文字/圖像/影片） | **NVIDIA** |
| **Nemotron-3.5 Content Safety** | `nvidia/nemotron-3.5-content-safety:free` | 4B | 128K | 內容安全守門（多模態 guardrail） | **NVIDIA** |

> ⚠️ **Nemotron 3 系列的免費端點** 在 OpenRouter 以 `:free` 後綴提供。這些不是「老舊模型的免費版」，而是 **NVIDIA 最新發表的旗艦模型**，作为引流與收集使用回饋的策略。免費額度受 OpenRouter 限制（20 RPM / 日配額 50–1000 RPD），超限需付費或儲值提升配額。

---

## 架構演進：從 Transformer 到混合 Transformer-Mamba

NVIDIA 在 Nemotron 系列中採用 **混合 Transformer-Mamba 架構**，結合 Transformer 的自注意力機制與 Mamba 的狀態空間模型（SSM）效率，實現了在長上下文（1M tokens）與高參數量（550B）下的可擴展推理。

| 版本 | 架構特點 | 設計重點 |
|---|---|---|
| **Nemotron-3 Ultra** | 混合 Transformer-Mamba MoE（55B active / 550B total） | 最強推理、1M 上下文、前沿代理編排能力 |
| **Nemotron-3 Super** | 混合 Transformer-Mamba MoE（12B active / 120B total） | 多代理場景下的高效率，120B 參數但僅 12B 啟動 |
| **Nemotron-3.5 Lightning** | MoE（3B active / 30B total） | 極高吞吐量，適合大規模批次處理 |
| **Nemotron-3 Nano Omni** | 多模態 MoE（30B-A3B） | 接受文字、圖像、影片輸入，作為企業代理系統的感知子代理 |

---

## 核心能力

模型產生文字與工具呼叫請求；主程式須提供工具、執行請求、回傳結果，並管理狀態、稽核紀錄與並行工作。以下工作流描述的是圍繞模型建立的應用，單次聊天請求不會自行執行完整流程。

### 1. 前沿推理（Reasoning）
- **Nemotron-3 Ultra** 是 NVIDIA 目前開源的最強推理模型之一，專為多步邏輯推理、數學證明、複雜規劃而設計
- 1M 上下文允許一次處理整本書籍、完整研究報告、長篇法律文件
- 支援工具調用、外部知識檢索、結構化輸出

### 2. 多代理編排（Agentic Orchestration）
- **Nemotron-3 Super（120B）** 專為多代理系統設計：可用於由主程式安排多個子代理的複雜任務
- 支援多步工具鏈：搜尋 → 計算 → 驗證 → 報告生成
- 適合企業級 agent 系統、智慧客服、複雜工作流自動化

### 3. 高吞吐快速推理
- **Nemotron-3.5 Lightning（30B）** 以極小的活躍參數（3B）提供快速回應
- 適合需要大量並發請求的場景：批次文檔處理、即時分析、RAG 系統核心

### 4. 多模態感知（Multimodal Perception）
- **Nemotron-3 Nano Omni** 接受文字、圖像、影片輸入
- 設計為「企業代理系統的感知與上下文子代理」：接受多模態輸入後輸出結構化理解，供主代理進一步推理
- 適合需要視覺理解的場景：產品檢測、醫學影像分析、文件掃描理解

### 5. 內容安全守門（Content Safety）
- **Nemotron-3.5 Content Safety** 是一個 4B 參數的多模態 guardrail 模型
- 微調自 Google Gemma-3-4B，專門 moderating 輸入與輸出（文字與圖像）
- 可用於構建安全的 AI 應用：自動過濾有害內容、確保輸出合規

---

## 版本對照與選擇建議

| 需求 | 建議版本 | 免費端點 ID | 原因 |
|---|---|---|---|
| 最強推理 + 1M 上下文 | Nemotron-3 Ultra | `nemotron-3-ultra-550b-a55b:free` | 55B active，前沿推理能力 |
| 多代理編排 + 128K–262K | Nemotron-3 Super | `nemotron-3-super-120b-a12b:free` | 12B active，實用編排效能 |
| 高吞吐快速批次 | Nemotron-3.5 Lightning | `nemotron-3.5-lightning:free` | 3B active，極快 |
| 多模態子代理 + 256K | Nemotron-3 Nano Omni | `nemotron-3-nano-omni-30b-a3b-reasoning:free` | 文字/圖像/影片輸入 |
| 內容安全過濾 | Nemotron-3.5 Content Safety | `nemotron-3.5-content-safety:free` | Guardrail 專用 |

---

## 適用場景

### ✅ 推薦

| 場景 | 說明 |
|---|---|
| **複雜多步推理** | 數學證明、邏輯推導、複雜規劃、預測建模 |
| **長文檔分析** | 1M 上下文可一次處理整本書籍、長篇報告、完整法庭證據 |
| **多代理系統** | 企業級 agent 編排、智慧客服、複雜工作流 |
| **高吞吐批次處理** | 大規模文檔清洗、資料提取、報告生成 |
| **多模態感知** | 需要視覺理解的代理系統（產品檢測、醫學影像、文件掃描） |
| **內容安全過濾** | 建構安全 AI 應用，自動過濾輸入與輸出 |

### ❌ 不推薦

| 場景 | 原因 |
|---|---|
| **簡單對話/客服** | 過度設計，應選更輕量模型（如 Nemotron-3.5 Lightning 或 Gemma 4） |
| **即時低延遲聊天** | Ultra/Super 推理時間較長；Lightning 雖快但仍不如專用快速模型 |
| **純創意寫作** | 不是文學創作專用模型，風格實用與推理導向 |
| **本地小 GPU** | Ultra/Super 需要大規模 GPU（或 GPU 集群）；免費端點已由 NVIDIA 託管 |

---

## 部署與存取方式

### OpenRouter（免費）
```python
import os
import openai
client = openai.OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1"
)
# Ultra
resp = client.chat.completions.create(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    messages=[{"role":"user","content":"..."}]
)
# Super
resp = client.chat.completions.create(
    model="nvidia/nemotron-3-super-120b-a12b:free",
    messages=[{"role":"user","content":"..."}]
)
# Lightning
resp = client.chat.completions.create(
    model="nvidia/nemotron-3.5-lightning:free",
    messages=[{"role":"user","content":"..."}]
)
```
- 免費額度受 OpenRouter `:free` 政策（20 RPM / 50–1000 RPD）
- 生產存取請查閱 NVIDIA NIM 最新條款與付費供應商方案；試用額度與資格可能調整。

### NVIDIA NIM（官方平台）
- 試用額度須以 NVIDIA 帳號中顯示的最新條件為準。
- 速率限制須查閱 NVIDIA 帳號的最新條件，可能依服務與帳號而異。
- 模型最完整：Nemotron-3 Ultra、Super、Lighting、Nano、Content Safety 全部可用
- 免費 credits 用於開發/原型，不供生產 SLA
- 需 NVIDIA 帳號與 API Key

### OpenWeights / 本地部署
- NVIDIA 提供部分 Nemotron 模型的開源權重下載（依模型而定）
- GPU 資源須依權重格式、模型總大小、上下文與並行需求規劃，請查閱官方部署指引。
- 官方建議使用 **NVIDIA TensorRT-LLM** 或 **vLLM** 進行推理優化

---

## 限制與注意事項

| 限制 | 說明 |
|---|---|
| **免費端點浮動** | OpenRouter `:free` 有排隊、限流、偶發 503；判定前至少重試一輪 |
| **推理時間長** | Ultra（550B）單發可達數十秒至數分鐘；Lightning（30B）較快但仍不如專用快速模型 |
| **多模態限制** | 只有 Nano Omni 支援圖像/影片；Ultra/Super/Lightning 為文字輸入 |
| **隱私** | OpenRouter 免費端點預設可能收集 prompt；敏感資料使用 NVIDIA NIM 付費端點或啟用 ZDR |
| **資源需求高** | 本地部署 Ultra 需要大規模 GPU 集群；免費端點已由 NVIDIA 託管，無需自建 |

---

## 參考資料

- [NVIDIA Nemotron 3 Ultra 官方](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [NVIDIA NIM 模型目錄](https://build.nvidia.com/)
- [OpenRouter Nemotron 3 Ultra](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free)
- [OpenRouter Nemotron 3 Super](https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b:free)
- [OpenRouter Nemotron 3.5 Lightning](https://openrouter.ai/nvidia/nemotron-3.5-lightning:free)
- [OpenRouter Nemotron 3 Nano Omni](https://openrouter.ai/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)
- [NVIDIA NIM Pricing / Rate Limits](https://build.nvidia.com/)

---

## 同系列文章

- [OpenRouter：統一 API 與多供應商路由](/posts/ai/2026-08-22-openrouter-model-routing)
- [OpenCode 與 Zen Gateway 介紹](/posts/ai/2026-04-02-agent-cli-opencode)
- [LLM 推論服務免費額度比較（2026-05 版）](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
- [Apodex：長程研究模型](/posts/tech/2026-10-10-ai-model-family-apodex)
- [Liquid AI：緊湊推理模型](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
- [Dots Studio Dots：開放權重混合推理模型](/posts/tech/2026-10-10-ai-model-family-dots-studio)

---

*最後更新：2026-10-10。模型規格、免費額度與存取方式會隨平台政策變動，請以官方文件為準。*
