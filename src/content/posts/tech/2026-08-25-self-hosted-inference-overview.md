---
title: "自架推論服務導讀：什麼時候值得自己跑模型"
date: 2026-08-25
type: guide
category: tech
tags: [self-hosted, llm-inference, vllm, sglang, tensorrt-llm, triton, ray-serve, gpu]
lang: zh-TW
tldr: "自架推論的關鍵不在引擎多快，而在你的 GPU 使用率：一張打滿的 A100 約 $0.70 / 百萬輸出 token，使用率掉到一成就變 $7，比多數雲端 API 貴。這篇是系列導讀，把七套工具分成三層，幫你判斷該選哪一層。"
description: "自架推論服務系列總覽：從雲端 API 到自架的決策門檻、LLM 執行引擎（vLLM、SGLang、TensorRT-LLM）、模型伺服平台（Triton）、分散式編排（Ray Serve）的三層架構，以及 TGI 封存後的遷移方向。"
series:
  name: "自架推論服務"
  order: 0
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-25-self-hosted-inference-overview-en)

這個系列介紹七套自架推論工具。但在選工具之前，先回答一個更根本的問題：**你真的需要自己跑模型嗎？**

---

## 什麼是自架推論

自架推論（self-hosted inference）指的是在你控制的硬體上運行 LLM，而不是透過雲端 API 呼叫別人的模型。硬體可以是自有 GPU 伺服器、租用的雲端 GPU 實例（A100、H100）、或者辦公室裡的工作站。

你拿到的是完整的控制權：模型版本、推論參數、資料流向、延遲、成本結構——全部由你決定。代價是你也要負責 GPU 管理、模型部署、監控、擴縮和故障處理。

---

## 什麼時候該自架

不是每個用 LLM 的團隊都需要自架。三個常見的觸發條件：

### 1. 成本門檻

自架推論的成本結構和雲端 API 完全不同。API 按 token 計費，用多少付多少；自架是固定的 GPU 租金，不管你用不用都在跑。

關鍵指標是 **GPU 使用率**。以 [vLLM 自架決策](/posts/ai/2026-08-21-vllm-self-host-decision/)裡的換算為例：

| GPU 使用率 | 每百萬輸出 token 成本（A100） |
|-----------|------------------------------|
| 100% | ~$0.70 |
| 50% | ~$1.40 |
| 10% | ~$7.00 |

多數雲端 API 的定價在 $1–$15 / 百萬輸出 token。你的 GPU 使用率要穩定在 50% 以上，自架才開始省錢。使用率低於 20%，自架幾乎一定比 API 貴。

**結論**：只有持續、高量的推論負載（例如每天數百萬次呼叫）才能撐起自架的固定成本。

### 2. 資料主權

模型輸入包含客戶個資、醫療紀錄、法律文件、內部程式碼——任何不想經過第三方 API 的資料。自架讓資料從頭到尾不離開你的網路。

### 3. 客製化需求

你需要微調模型、控制 KV cache 策略、跑自訂的前後處理 pipeline、或者部署尚未被雲端 API 支援的模型。自架是唯一的選項。

---

## 決策流程

```
你的 LLM 需求
    │
    ▼
資料可以離開你的網路嗎？
    │
    ├── 可以 → 每月推論量大嗎？（GPU 使用率能穩定 > 50%）
    │              │
    │              ├── 不大 → 雲端 API（OpenAI、Anthropic、Google）
    │              │
    │              └── 很大 → 需要客製化 pipeline 嗎？
    │                          │
    │                          ├── 不需要 → 託管推論（HuggingFace Endpoints、Baseten、Modal）
    │                          │
    │                          └── 需要 → 自架推論 ↓
    │
    └── 不可以 → 自架推論 ↓

自架推論：選哪一層？
    │
    ├── 只需要跑一個 LLM，OpenAI 相容 API → LLM 執行引擎（vLLM / SGLang）
    │
    ├── NVIDIA GPU + 追求極致吞吐量 → TensorRT-LLM
    │
    ├── 多種模型（LLM + CV + embedding）統一服務 → Triton Inference Server
    │
    └── 複雜 pipeline + 自動擴縮 + 多節點 → Ray Serve
```

---

## 三層架構

自架推論的工具不是平行替代關係，而是**分層堆疊**的。理解這一點可以避免很多選型錯誤。

### 第一層：LLM 執行引擎

負責最底層的事：把模型載入 GPU、管理 KV cache、做 continuous batching、回傳生成的 token。

| 引擎 | 核心技術 | 硬體 | 適合 |
|------|---------|------|------|
| [vLLM](/posts/ai/2026-03-14-vllm-inference-engine/) | PagedAttention | NVIDIA、AMD | 通用首選，生態系最大 |
| [SGLang](/posts/tech/2026-08-22-sglang-inference-server/) | RadixAttention | NVIDIA、AMD | 共同前綴多的場景（structured output、few-shot） |
| [TensorRT-LLM](/posts/tech/2026-08-25-tensorrt-llm-inference/) | TensorRT 編譯最佳化 | 僅 NVIDIA | 追求極致吞吐量，願意花 28 分鐘編譯 |

vLLM 是目前的事實標準（89K+ GitHub stars）。SGLang 在 RadixAttention 共用前綴 KV cache 的場景下有優勢。TensorRT-LLM 在 NVIDIA GPU 上可以比 vLLM 快 15–30%，但只支援 NVIDIA、需要預編譯、彈性較低。

三者都提供 OpenAI 相容 API，可以直接替換雲端 API 的 client。

### 第二層：模型伺服平台

在執行引擎之上，負責模型生命週期管理、版本控制、多模型路由、ensemble pipeline。

| 平台 | 核心能力 | 適合 |
|------|---------|------|
| [NVIDIA Triton](/posts/tech/2026-08-22-triton-inference-server/) | model repository、動態批次、ensemble | 異質模型平台（LLM + CV + 傳統 ML） |

Triton 不是 LLM 專用——它用統一的 HTTP/gRPC 介面服務 TensorRT、ONNX、PyTorch 等各種後端。如果你只跑一個 LLM，直接用 vLLM 就好，不需要 Triton。Triton 的價值在於你有十幾個不同框架的模型需要統一管理。

Triton 可以把 vLLM 或 TensorRT-LLM 當作後端使用。

### 第三層：分散式編排

負責服務圖組合、跨節點排程、自動擴縮。

| 框架 | 核心能力 | 適合 |
|------|---------|------|
| [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference/) | Python 服務圖、GPU replica 排程、autoscaling | 複雜 pipeline（前處理 → 模型 A → 模型 B → 後處理） |

Ray Serve 不取代 vLLM 或 SGLang——它用 vLLM 當 deployment 裡的 worker，自己負責編排。如果你只跑一個模型配一台機器，Ray Serve 是過度工程。它的甜蜜點是多模型、多節點、需要自動擴縮的生產環境。

### 已封存：TGI

| 工具 | 狀態 |
|------|------|
| [TGI](/posts/tech/2026-08-25-tgi-text-generation-inference/) | 2026 年 3 月封存，維護模式 |

HuggingFace 的 Text Generation Inference 是這波最佳化推論引擎的先驅。它率先採用 Flash Attention 和 continuous batching，證明了這些技術在生產環境的可行性。但 HuggingFace 在 2025 年底宣布停止新功能開發，2026 年 3 月正式封存 GitHub repo。

官方建議遷移到 vLLM 或 SGLang。如果你目前還在用 TGI，遷移的急迫性取決於你是否需要新模型架構的支援——TGI 不會再加入新模型。

---

## 各層怎麼組合

常見的部署模式：

**最簡單**：vLLM 單機 → OpenAI 相容 API → 你的應用

**中等複雜**：Triton → vLLM 後端 + embedding 模型 + reranker → 統一 API

**完整 pipeline**：Ray Serve → 多節點 → vLLM workers + 前後處理 deployments → autoscaling

越往右邊複雜度越高，但能處理的規模和場景也越多。從最簡單的開始，有需要時再加層。

---

## 系列文章索引

| Order | 文章 | 一句話 |
|-------|------|--------|
| 0 | 本篇導讀 | 三層架構與選型決策 |
| 1 | [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine/) | PagedAttention、continuous batching、prefix caching |
| 2 | [vLLM 自架決策](/posts/ai/2026-08-21-vllm-self-host-decision/) | GPU 使用率決定成本，什麼時候自架是過度工程 |
| 3 | [SGLang](/posts/tech/2026-08-22-sglang-inference-server/) | RadixAttention 重用共同前綴 KV cache |
| 4 | [NVIDIA Triton](/posts/tech/2026-08-22-triton-inference-server/) | 多框架模型統一服務、動態批次、ensemble |
| 5 | [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference/) | Python 服務圖、GPU 排程、自動擴縮 |
| 6 | [TGI](/posts/tech/2026-08-25-tgi-text-generation-inference/) | HuggingFace 推論伺服器，已封存 |
| 7 | [TensorRT-LLM](/posts/tech/2026-08-25-tensorrt-llm-inference/) | NVIDIA GPU 專用最佳化，編譯換吞吐量 |

---

## 整體來說

自架推論不是「更好」的選擇，是「特定條件下更划算」的選擇。那個條件通常是：高使用率 + 資料主權 + 客製化需求，三個至少要中一個。

如果你只中「想省錢」，先算 GPU 使用率。算完可能會發現雲端 API 其實更便宜。

如果你決定自架，從 vLLM 開始。它是目前的預設選擇，生態系最大，踩坑的人最多，踩過的坑也最多。有特殊需求時再往其他工具移動。


## 參考資料

- [vLLM Documentation](https://docs.vllm.ai/)
- [SGLang Documentation](https://sgl-project.github.io/)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [Text Generation Inference Documentation](https://huggingface.co/docs/text-generation-inference/)
- [Ray Serve Documentation](https://docs.ray.io/en/latest/serve/)
- [NVIDIA Triton Inference Server](https://developer.nvidia.com/triton-inference-server)
