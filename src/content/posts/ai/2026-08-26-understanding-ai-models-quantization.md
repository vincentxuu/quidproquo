---
title: "量化與推論最佳化：讓 70B 模型跑在你的筆電上"
date: 2026-08-26
category: ai
type: deep-dive
tags: [quantization, gguf, kv-cache, inference, vram, ollama, llama-cpp, ai-model]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 14
tldr: "70B 模型原本需要 140GB VRAM，但量化到 4-bit 只需要 ~35GB，再用 llama.cpp 的部分卸載就能在消費級硬體上跑。GGUF 格式的命名規則（Q4_K_M、Q5_K_S）告訴你精度和大小的取捨。KV cache 是長對話變慢的主因。"
description: "模型量化與推論最佳化入門：FP16 到 INT4 的精度取捨、GGUF 格式命名怎麼讀、KV cache 為什麼吃記憶體、以及不同 VRAM 能跑什麼規模的模型。"
draft: false
glossary:
  - term: "Quantization"
    def: "量化——降低模型權重的數值精度（如 FP16→INT4）來減少記憶體用量和加速推論，代價是微小的品質損失"
  - term: "GGUF"
    def: "llama.cpp 使用的量化模型格式，檔名中的 Q4/Q5/Q8 表示量化位元數，K_M/K_S 表示量化策略"
  - term: "KV Cache"
    def: "推論時暫存每個 token 的 Key 和 Value 向量，避免重複計算——對話越長，佔用的 VRAM 越多"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-quantization-en)

你想在自己的筆電上跑 Llama 3 70B。打開規格一看：700 億個參數，每個參數用 FP16（16-bit 浮點數）儲存，需要 **140GB VRAM**。你的 GPU 有 8GB。

差了 17 倍。怎麼辦？

## 為什麼模型這麼大

在[訓練](/posts/ai/2026-08-26-understanding-ai-models-training-stages)那篇我們知道，模型就是一大堆數字（權重）。每個權重在訓練時用 FP16 或 BF16 儲存——也就是每個數字佔 2 bytes。

簡單的算術：

```
參數量 × 每個參數的 bytes = 模型大小
70B × 2 bytes = 140GB
```

這 140GB 必須全部載入記憶體（VRAM 或 RAM）才能開始推論。NVIDIA 最貴的消費級 GPU（RTX 4090）也只有 24GB VRAM。就算你願意花十萬台幣，一張卡也塞不下。

## 量化：用精度換空間

量化（Quantization）的核心想法很簡單：**降低每個數字的精度**。

想像你在做日常計算。圓周率是 3.14159265...，但大部分時候你寫 3.14 就夠了。你損失了一點精度，但省了很多位數。

量化做的就是這件事：把原本用 16-bit 儲存的權重，壓縮到 8-bit、4-bit、甚至 2-bit。

### 精度等級一覽

| 格式 | 每個權重 | 70B 模型大小 | 相對於 FP16 |
|------|---------|------------|------------|
| FP16 (16-bit) | 2 bytes | ~140 GB | 100% |
| INT8 (8-bit) | 1 byte | ~70 GB | 50% |
| INT4 (4-bit) | 0.5 byte | ~35 GB | 25% |
| INT2 (2-bit) | 0.25 byte | ~17.5 GB | 12.5% |

4-bit 量化讓 70B 模型從 140GB 縮到 35GB——這已經在兩張 RTX 4090（48GB）的範圍內了。如果用 CPU offloading（把一部分層放到系統記憶體），一張 24GB 的 GPU 加上足夠的 RAM 也能勉強跑。

### 品質損失有多大？

量化不是免費的。你在用精度換空間，自然會損失一些品質。但現代量化技術（GPTQ、AWQ、GGUF 的 K-quant）很聰明——它們不是均勻地砍精度，而是讓重要的權重保留較高精度，不重要的才壓得更狠。

實際的品質損失：

- **8-bit（Q8）**：幾乎感覺不到差異。Benchmark 分數通常掉不到 1%
- **4-bit（Q4_K_M）**：多數任務表現良好，偶爾在需要精確數學計算的題目上會出錯。日常對話、寫作、程式碼生成都很堪用
- **2-bit（Q2_K）**：品質明顯下降，只適合實驗用途

## GGUF 格式：量化模型的標準包裝

當你到 Hugging Face 上找量化模型，會看到一堆 `.gguf` 檔案，名字像密碼：

```
llama-3-70b-instruct-Q4_K_M.gguf
llama-3-70b-instruct-Q5_K_S.gguf
llama-3-70b-instruct-Q8_0.gguf
```

GGUF 是 llama.cpp 定義的格式，已經成為本機跑模型的事實標準。檔名裡的代碼告訴你兩件事：

### 命名規則拆解

**Q + 數字** = 量化位元數
- Q2 = 2-bit、Q3 = 3-bit、Q4 = 4-bit、Q5 = 5-bit、Q8 = 8-bit

**底線後的字母** = 量化策略
- `K` = K-quant（更聰明的分群量化，品質比舊方法好）
- `_M` = Medium（在大小和品質間取得平衡）
- `_S` = Small（更小的檔案，品質稍差）
- `_L` = Large（更大的檔案，品質更好）
- `_0` = 基礎量化（沒有 K-quant 最佳化）

### 怎麼選？

| 如果你要... | 選這個 |
|------------|-------|
| 最佳品質，不在乎大小 | Q8_0 |
| 品質和大小的最佳平衡 | Q4_K_M |
| 盡量小，品質還能接受 | Q4_K_S |
| 極限壓縮，實驗用 | Q2_K |

**Q4_K_M 是最常用的選擇**。對大多數使用場景來說，它的品質損失小到幾乎感覺不到，但檔案大小只有 FP16 的四分之一。

## KV Cache：長對話的隱形殺手

量化解決了「模型本身太大」的問題，但推論時還有另一個記憶體大戶：**KV cache**。

回想 [Transformer 架構](/posts/ai/2026-08-26-understanding-ai-models-transformer)那篇，注意力機制需要計算每個 token 和所有先前 token 的關係。如果每生成一個新 token 都重新算一遍之前所有 token 的 Key 和 Value，那推論速度會隨著對話長度呈平方增長——慢到沒辦法用。

解法是 **KV cache**：把每一層、每個 token 的 Key 和 Value 向量快取起來。生成下一個 token 時，只需要算新 token 的 Q，然後跟快取裡的 K、V 做注意力計算。

### 問題在哪？

KV cache 的大小 = 層數 × 注意力頭數 × 每頭維度 × 序列長度 × 2（K 和 V 各一份）

具體來說，以 Llama 3 70B 為例：

- 80 層 × 8 個 KV 頭 × 128 維 × 8192 tokens × 2（K+V） × 2 bytes（FP16）
- ≈ **20GB**

也就是說，一個 8K 上下文的對話，光 KV cache 就要佔 20GB。這就是為什麼長對話會越來越慢、最終 OOM（記憶體不足）的根本原因。

### 緩解方法

- **KV cache 量化**：把 KV cache 也壓到 INT8 或 INT4，能省一半到四分之三的記憶體
- **滑動視窗注意力**（Sliding Window Attention）：只保留最近 N 個 token 的 KV cache，超出的丟掉
- **GQA / MQA**：Grouped / Multi-Query Attention，減少 KV 頭的數量（Llama 3 就用了 GQA，KV 頭從 64 降到 8）

## 實戰對照表：你的硬體能跑什麼

| VRAM | 可以跑的模型（Q4_K_M 量化） | 注意事項 |
|------|--------------------------|---------|
| 8 GB | 7B-8B 參數（Llama 3.1 8B、Qwen 2.5 7B） | 長對話會受 KV cache 限制 |
| 12 GB | 13B-14B 參數（Qwen 2.5 14B） | 舒適運行 7B/8B |
| 16 GB | 14B（舒適）、嘗試 32B（可能需要部分 CPU offload） | 性價比甜蜜點 |
| 24 GB | 32B-34B（舒適）、70B（重度 CPU offload，速度慢） | RTX 4090 / 3090 |
| 48 GB+ | 70B（舒適）、嘗試更大模型 | 雙 GPU 或專業卡 |
| 純 CPU | 7B（慢但能用）、13B（很慢） | 需要充足 RAM，速度是 GPU 的 1/10~1/20 |

> 這些數字是估算，實際用量取決於上下文長度、KV cache 設定、量化方式等因素。

## 工具：三種跑法

本機跑模型已經有成熟的工具鏈。這裡列三個主要選項：

- **Ollama**：最簡單。`ollama run llama3.1:8b` 一行指令就能跑，自動下載模型、管理量化版本。適合想快速試用的人
- **llama.cpp**：最靈活。支援 GGUF 格式、CPU/GPU 混合推論、KV cache 量化、各種進階參數。效能最佳化做得最深。Ollama 的底層就是它
- **vLLM**：面向 production。支援 continuous batching、PagedAttention（更高效的 KV cache 管理）、OpenAI 相容 API。適合需要同時服務多人的部署場景

詳細的自架部署教學會在本系列後續的自架指南中介紹。

## 這篇的心智模型

```
FP16 模型太大 → 量化到 4-bit，大小剩 1/4
GGUF Q4_K_M → 品質和大小的甜蜜點
KV cache → 對話越長吃越多記憶體
你的 VRAM → 決定你能跑多大的模型
```

下次你在 Hugging Face 上看到 `Q4_K_M.gguf`，你就知道：這是一個用 4-bit K-quant Medium 策略量化過的模型，大小大約是原始模型的四分之一，品質幾乎沒有感知得到的損失。

## 參考資料

- [llama.cpp — GGUF 格式規格與 K-quant 量化說明](https://github.com/ggerganov/llama.cpp)
- [Hugging Face — Quantization 技術文件](https://huggingface.co/docs/transformers/quantization)
- [The Case for 4-bit Precision（GPTQ 論文）](https://arxiv.org/abs/2210.17323)
- [AWQ: Activation-aware Weight Quantization](https://arxiv.org/abs/2306.00978)
- [vLLM: Efficient Memory Management for LLM Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [Ollama — 本機跑大型語言模型的最簡單方式](https://ollama.com/)
