---
title: "能在手機上跑的小模型：2026 年的選擇與限制"
date: 2026-03-31
category: ai
tags: [on-device-ai, small-models, mobile, quantization, llama, gemma, phi, qwen]
lang: zh-TW
tldr: "3B 以下的量化模型已經能在主流手機上跑到 30+ tokens/sec，但 RAM、散熱和 context window 仍然是硬限制。選模型要看你的語言需求和裝置條件。"
description: "盤點 2026 年能在手機上執行的小型 LLM，包含 Gemma 3、Llama 3.2、Phi-4-mini、Qwen 2.5 等，以及量化格式、推論框架和實際限制。"
draft: false
---

手機上跑 LLM 不再是 demo 等級的事了。2026 年，1B–4B 參數的模型經過量化後，能在一般手機上做到可用的推論速度。這篇整理目前主要的模型選項、推論框架和實際限制，幫你判斷哪個組合適合你的場景。

## 模型選項

### Gemma 3（Google）

1B 和 4B 兩個行動端版本。1B 量化後不到 1GB，4B 約 2.5GB。Google 專門為 on-device 設計，透過 MediaPipe 直接支援 Android 和 iOS。4B 版本支援多模態（圖片輸入）。多語言表現不錯，繁中品質在小模型裡算好的。

### Llama 3.2（Meta）

1B 和 3B。1B 量化後約 0.7GB，3B 約 1.8GB。Meta 官方透過 ExecuTorch 支援 Android/iOS 部署，iPhone 16 Pro 上 1B 模型跑到約 50 tokens/sec。英文表現強，但中文能力相對弱。

### Phi-4-mini（Microsoft）

約 3.8B 參數，量化後 2.2GB。推理能力在同級距模型裡突出，常在 benchmark 上打贏更大的模型。ONNX Runtime 有最佳化路徑。適合需要邏輯推理的場景。

### Qwen 2.5（阿里巴巴）

0.5B / 1.5B / 3B 三個尺寸。0.5B 量化後不到 400MB——目前最小的實用選項。中日韓語言表現特別好，如果你的應用場景是繁中，Qwen 值得優先測試。

### SmolLM2（Hugging Face）

135M / 360M / 1.7B。極端輕量，360M 幾乎什麼裝置都跑得動。能力有限，但適合簡單分類、關鍵字提取這類輕任務。

## 推論框架

模型本身只是權重檔案，要在手機上跑還需要推論框架。

| 框架 | 平台 | 特色 |
|------|------|------|
| MediaPipe LLM Inference | Android / iOS | Google 官方，支援 Gemma、Llama、Phi，GPU 加速，最容易上手 |
| llama.cpp（GGUF） | 全平台 | 最通用，社群大，幾乎所有模型都有 GGUF 格式 |
| MLC LLM | Android / iOS | 編譯成原生 GPU shader（Vulkan/Metal），速度通常最快 |
| ExecuTorch | Android / iOS | Meta 官方，Llama 的最佳路徑，支援 CoreML 和 XNNPACK |
| Core ML | iOS | Apple 原生，在 Apple Silicon 上效能最好，但只能用在 Apple 生態 |
| ONNX Runtime Mobile | 全平台 | Microsoft 主推，Phi 模型的最佳化路徑 |

如果沒有特殊需求，llama.cpp + GGUF 是最安全的起點——模型選擇最多、社群資源最豐富。

## 量化：怎麼把模型塞進手機

原始的 FP16 模型太大，手機跑不動。量化是把權重從 16-bit 壓到 4-bit 甚至 2-bit 的過程。

**GGUF**（llama.cpp 格式）是目前行動端最主流的量化格式。常見的量化等級：

- **Q4_K_M**：4-bit，品質和大小的最佳平衡點，大多數場景用這個
- **Q3_K_S**：3-bit，再小一點，品質稍降
- **Q2_K**：2-bit，極限壓縮，品質犧牲明顯，只適合 demo

一個粗略的換算：**1B 參數 ≈ Q4 量化後 0.6–0.7GB**。

其他量化方式（AWQ、GPTQ）主要用在 server 端，行動端大多還是轉成 GGUF 來用。

## 實際限制

在手機上跑 LLM 聽起來很酷，但硬體限制很現實：

**RAM 是最大瓶頸**。模型要整個載入記憶體。4GB RAM 的手機只能穩定跑 1B 模型，8GB 的可以處理 3–4B。模型佔的記憶體以外，還要留給 OS 和其他 app。

**Context window 受限**。KV cache 吃記憶體，實際上手機端大多只能用 2K–4K tokens 的 context。有些模型號稱支援 8K 以上，但記憶體開銷會讓其他東西被 kill 掉。

**散熱會降速**。持續推論超過 30 秒，手機開始熱節流，速度可能掉 30–50%。這代表長文生成的體驗不會太好。

**電量消耗**。一次長對話大約吃 5–10% 電量。不是不能接受，但使用者會注意到。

## 實際場景

考慮到這些限制，目前 on-device LLM 比較適合：

- **離線摘要**：在沒網路的地方幫文章、email 做重點整理
- **智慧回覆**：短文本生成，像 Smart Reply 那種 1–2 句話的回應
- **隱私敏感處理**：醫療筆記、法律文件等不想送到雲端的內容
- **離線翻譯**：搭配 Qwen 這類多語言模型，基本翻譯可以離線做

不太適合的：長文生成、複雜多輪對話、需要大 context 的 RAG——這些還是留給雲端。

## 選模型的決策流程

```
你的主要語言是什麼？
├── 中文（繁/簡）→ Qwen 2.5 或 Gemma 3
├── 英文為主   → Llama 3.2 或 Phi-4-mini
└── 多語言     → Gemma 3

你的裝置 RAM？
├── 4GB  → 只考慮 1B 以下（Qwen 0.5B、SmolLM2）
├── 6GB  → 1B–1.5B 安全區
├── 8GB+ → 3B–4B 都可以

你需要什麼能力？
├── 簡單分類/提取 → SmolLM2 360M 就夠
├── 摘要/回覆     → 1B–3B
└── 推理/分析     → Phi-4-mini 或 Gemma 3 4B
```

## 整體來說

2026 年的 on-device LLM 已經從「技術 demo」進入「特定場景可用」的階段。關鍵的取捨是：你願意犧牲多少品質來換取離線能力和隱私。對大多數應用來說，最務實的策略是 on-device 處理簡單任務（分類、短回覆、隱私資料），複雜的留給雲端——混合架構比全押任何一邊都合理。
