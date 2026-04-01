---
title: "llama.cpp — 從純 C++ 到消費級硬體上的 LLM 推論引擎"
date: 2026-04-01
category: ai
tags: [llama-cpp, gguf, quantization, llm-inference, apple-silicon, metal, cuda, local-llm]
lang: zh-TW
tldr: "llama.cpp 是目前最廣泛使用的本地 LLM 推論引擎，用純 C/C++ 實作，支援 CPU、Metal、CUDA、Vulkan 等多後端，搭配 GGUF 量化格式讓消費級硬體能跑數十億參數的模型。"
description: "深入介紹 llama.cpp 的核心架構（GGML 張量庫、GGUF 格式）、量化格式完整解析（Q/K/IQ 系列）、硬體後端、CLI 工具、server mode、speculative decoding，以及與 MLX、vLLM、ExLlamaV2 的比較。"
draft: false
---

Ollama 一行指令就能跑模型，背後做事的就是 llama.cpp。如果你用過 Ollama 覺得不夠透明、想要更多控制權——自己選量化格式、調 GPU 層數、跑 speculative decoding、或直接用 OpenAI 相容 API 做開發——llama.cpp 是你要往下挖的那一層。

這篇介紹 llama.cpp 的核心架構、量化格式的選擇邏輯、各硬體後端的差異、實際使用方式，以及它在 2026 年的位置。

## 核心架構：GGML + GGUF

llama.cpp 由 Georgi Gerganov 在 2023 年 3 月發起，最初只是為了在 MacBook 上跑 LLaMA。核心設計決策：**不依賴 Python、不依賴 PyTorch、不依賴 CUDA**，用純 C/C++ 從頭實作張量運算。

底層是 **GGML**（Georgi Gerganov Machine Learning），一個極輕量的張量庫：

- 16 種量化資料型別
- 自動 operator fusion
- 零執行時期依賴（不需要 Python、不需要 pip install）
- 編譯後是單一 binary

模型以 **GGUF**（GGML Unified Format）格式儲存。這是一個自描述的二進位格式：

```
GGUF 檔案結構：
┌─────────────────────────┐
│ Magic Number (GGUF)     │
│ Version                 │
│ Metadata (key-value)    │  ← 模型架構、量化類型、tokenizer、context length...
│ Tensor Info             │  ← 每個 tensor 的名稱、形狀、偏移量
│ Tensor Data             │  ← 實際的量化權重
└─────────────────────────┘
```

GGUF 取代了早期的 GGML 格式，最大的改進是**單檔自包含**——所有 metadata、tokenizer、模型權重都在一個檔案裡，不需要額外的 config.json 或 tokenizer.model。HuggingFace 上幾乎所有社群量化模型都以 GGUF 發佈。

## 量化格式完整解析

這是 llama.cpp 最需要理解的部分。量化格式決定了模型大小、推論速度和輸出品質之間的取捨。

### 命名規則

```
Q4_K_M
│ │ │
│ │ └── Size：S(mall) / M(edium) / L(arge)
│ └──── K：K-quant，使用 k-means 分群的進階量化
└────── 4：每個權重用 4 bits
```

- **Q** 系列（Q4_0、Q4_1、Q5_0、Q5_1、Q8_0）：基礎量化，逐 block 統一 scale
- **K** 系列（Q3_K_S、Q4_K_M、Q5_K_M、Q6_K）：K-quant，對不同層用不同精度，重要的層（attention）用更多 bits
- **IQ** 系列（IQ1_S、IQ2_XXS、IQ3_M、IQ4_NL）：importance-weighted quantization，根據 Hessian 矩陣判斷每個權重的重要性，精度更高但量化速度更慢

### 格式對照表

| 格式 | bits/weight | 7B 模型大小 | 品質 | 速度 | 適合場景 |
|------|------------|-----------|------|------|---------|
| Q2_K | 2.6 | ~2.8 GB | 差 | 最快 | 極端記憶體限制 |
| IQ3_M | 3.4 | ~3.5 GB | 堪用 | 快 | 記憶體吃緊但想要更好品質 |
| Q4_0 | 4.5 | ~3.8 GB | 可用 | 快 | 基準量化 |
| **Q4_K_M** | **4.8** | **~4.1 GB** | **好** | **快** | **多數人的最佳選擇** |
| Q5_K_M | 5.7 | ~4.8 GB | 很好 | 中等 | 品質優先 |
| Q6_K | 6.6 | ~5.5 GB | 接近 fp16 | 中等 | 記憶體夠就用這個 |
| Q8_0 | 8.5 | ~7.2 GB | ≈ fp16 | 較慢 | 品質要求最高 |
| F16 | 16 | ~13.5 GB | 原始品質 | 最慢 | 基準測試 |

**怎麼選？** 記憶體夠就 Q6_K，一般用 Q4_K_M，極端省記憶體用 IQ3_M。Q4_K_M 是社群公認的甜蜜點——4-bit 量化搭配 K-quant 的分層精度分配，品質損失很小。

### IQ 格式：極端壓縮的選擇

IQ（importance quantization）格式使用校準數據集計算每個權重的 Hessian 矩陣，根據重要性分配精度。IQ2_XXS 可以把 7B 模型壓到 ~2 GB，品質比同 bit 的 Q 系列好，但量化過程慢很多（需要跑校準），而且目前只支援 CPU 和 Metal。

## 硬體後端

llama.cpp 的跨平台能力是它最大的競爭優勢。

### Apple Metal

Mac 用戶的首選後端。Apple Silicon 的統一記憶體架構讓 CPU 和 GPU 共享同一塊記憶體，不需要額外的資料搬移。

```bash
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j
```

`-ngl 99` 把所有層都放到 GPU。Metal 後端在 M 系列晶片上效率很高，因為不像 NVIDIA 那樣有 PCIe 頻寬瓶頸。

### NVIDIA CUDA

效能最高的後端，特別是在高階消費卡（RTX 4090、5090）上。

```bash
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j
```

支援 Flash Attention（`-fa` 參數）、tensor parallelism 跨多 GPU。VRAM 是硬限制——超出的部分會回到 CPU，速度斷崖式下降。

### Vulkan

跨平台 GPU 後端，支援 NVIDIA、AMD、Intel 顯卡。效能比原生 CUDA/Metal 略低（約 80-90%），但勝在通用性。

```bash
cmake -B build -DGGML_VULKAN=ON
```

AMD 用戶如果 ROCm 設定太麻煩，Vulkan 是更簡單的替代方案。

### CPU

沒有 GPU 也能跑，只是慢。支援 AVX2/AVX-512（x86）和 ARM NEON（Apple Silicon、樹莓派）。IQ 格式在 CPU 上有特殊優化，某些情況下比 Q 格式更快。

### 後端效能概覽

以 Llama 3.1 8B Q4_K_M 為例的大致數據：

| 硬體 | Decode 速度 | 備註 |
|------|------------|------|
| M3 Pro 36GB | ~35 tok/s | Metal，全 GPU offload |
| M4 Max 128GB | ~55 tok/s | Metal |
| RTX 4090 24GB | ~90 tok/s | CUDA |
| RTX 3060 12GB | ~35 tok/s | CUDA |
| i9-13900K (CPU) | ~12 tok/s | AVX2 |

數據僅供參考，實際速度受模型架構、context length、batch size 影響。

## CLI 工具

llama.cpp 編譯後產出幾個關鍵 binary：

### llama-cli：互動式推論

```bash
# 基本使用
llama-cli -m model.gguf -p "Explain quantum computing" -n 256

# 完整參數範例
llama-cli \
  -m llama-3.1-8b-q4_k_m.gguf \
  -ngl 99 \          # GPU offload 層數
  -c 8192 \          # context length
  -t 8 \             # CPU threads
  -fa \              # Flash Attention
  --temp 0.7 \       # temperature
  --top-p 0.9 \      # nucleus sampling
  -p "Write a haiku about coding"
```

加 `-i` 進入互動模式，加 `--conversation` 啟用多輪對話。

### llama-server：OpenAI 相容 API

```bash
llama-server \
  -m model.gguf \
  -ngl 99 \
  -c 8192 \
  --port 8080 \
  --host 0.0.0.0 \
  -np 4              # 4 個並行 slot
```

啟動後提供：

- `POST /v1/chat/completions` — 對話
- `POST /v1/completions` — 文字生成
- `POST /v1/embeddings` — Embedding
- `GET /health` — 健康檢查
- 內建 Web UI（瀏覽器開 `http://localhost:8080`）

任何支援 OpenAI API 的工具都能直接對接，改 `base_url` 就好。

### llama-quantize：模型量化

```bash
# 把 fp16 模型量化成 Q4_K_M
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M

# IQ 格式需要校準數據
llama-quantize --imatrix imatrix.dat model-f16.gguf model-iq3_m.gguf IQ3_M
```

IQ 格式的校準數據可以用 `llama-imatrix` 工具產生——餵一段代表性文本，計算每個權重的 importance。

### llama-bench：效能測試

```bash
llama-bench -m model.gguf -ngl 99 -t 8
```

輸出 prompt processing（prefill）和 token generation（decode）的速度，方便比較不同量化格式和硬體配置。

## 進階功能

### Speculative Decoding

用一個小模型（draft model）快速產生候選 token，再用大模型一次驗證多個 token。命中率高時可以加速 1.5-2x。

```bash
llama-speculative \
  -m large-model.gguf \
  -md draft-model.gguf \
  -ngl 99 \
  -ngld 99 \
  --draft-max 8 \     # 每次 draft 最多 8 個 token
  -p "Your prompt"
```

最佳搭配：同家族的大小模型（如 Llama 3.1 70B + 8B）。draft model 的詞彙表必須和 target model 一致。

### Grammar-Constrained Sampling

用 BNF 語法限制模型輸出格式，100% 保證符合結構：

```bash
llama-cli -m model.gguf --grammar 'root ::= "{" "\"name\":" [^}]+ "}"' -p "Generate a JSON"
```

比 JSON mode 更強——你可以定義任意語法規則，確保輸出是合法的 JSON、SQL、或任何自訂格式。

### Flash Attention

```bash
llama-cli -m model.gguf -fa -c 32768
```

`-fa` 啟用 Flash Attention，大幅降低長 context 的記憶體用量（從 O(n²) 降到 O(n)）。在 Metal 和 CUDA 後端都有支援。長 context 場景（>8K tokens）強烈建議開啟。

### 多模態推論

支援 LLaVA、Gemma 3 等視覺語言模型：

```bash
llama-cli -m llava-model.gguf --mmproj mmproj.gguf -p "Describe this image" --image photo.jpg
```

需要額外的 vision encoder 檔案（`--mmproj`）。

## 從 HuggingFace 取得模型

最簡單的方式是直接下載社群量化好的 GGUF：

```bash
# 用 huggingface-cli
pip install huggingface_hub
huggingface-cli download bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \
  --include "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models
```

如果要自己從 safetensors 轉換：

```bash
# 轉成 fp16 GGUF
python convert_hf_to_gguf.py /path/to/hf-model --outfile model-f16.gguf

# 再量化
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M
```

HuggingFace 上搜 `GGUF` 標籤就能找到大量現成的量化模型，常見的量化者有 bartowski、TheBloke、mradermacher。

## Python Bindings

不想用 CLI 的話，`llama-cpp-python` 提供 Python 介面：

```python
from llama_cpp import Llama

llm = Llama(
    model_path="model-q4_k_m.gguf",
    n_gpu_layers=-1,    # 全部 offload 到 GPU
    n_ctx=8192,
    flash_attn=True,
)

output = llm.create_chat_completion(
    messages=[{"role": "user", "content": "什麼是 KV cache？"}],
    temperature=0.7,
)
print(output["choices"][0]["message"]["content"])
```

也提供 OpenAI 相容的 server：

```bash
pip install 'llama-cpp-python[server]'
python -m llama_cpp.server --model model.gguf --n_gpu_layers -1
```

## 跟其他推論引擎比較

| | llama.cpp | MLX | vLLM | ExLlamaV2 |
|---|---|---|---|---|
| 語言 | C/C++ | Python (Apple) | Python | Python/CUDA |
| 硬體 | CPU, Metal, CUDA, Vulkan, ROCm | 僅 Apple Silicon | 主要 GPU (NVIDIA/AMD/Intel) | 僅 NVIDIA |
| 量化格式 | GGUF (Q/K/IQ) | MLX 4-bit | AWQ, GPTQ, fp8 | EXL2 |
| 定位 | 跨平台本地推論 | Apple 生態最佳化 | 生產級高吞吐 | NVIDIA 極致速度 |
| Server mode | 有（OpenAI 相容） | 社群方案 | 原生 | 有（tabbyAPI） |
| 模型來源 | HuggingFace GGUF | HuggingFace MLX | HuggingFace 原始 | HuggingFace EXL2 |

幾個選擇要點：

- **Mac 用戶**：llama.cpp（Metal）和 MLX 都是好選擇。llama.cpp 的生態更大、模型更多；MLX 在 Apple Silicon 上某些情況更快，但模型選擇較少
- **NVIDIA 用戶**：生產用 vLLM，本地玩 llama.cpp 或 ExLlamaV2（EXL2 格式在同 bit 下品質略優於 GGUF）
- **跨平台**：llama.cpp 是唯一一個 CPU/Metal/CUDA/Vulkan/ROCm 全部支援的

## Mac 快速上手

```bash
# 1. 編譯（Metal 自動啟用）
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j

# 或用 Homebrew
brew install llama.cpp

# 2. 下載模型
huggingface-cli download bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \
  --include "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models

# 3. 跑起來
llama-cli \
  -m models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -ngl 99 -c 8192 -fa \
  --conversation

# 4. 或開 server
llama-server \
  -m models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -ngl 99 -c 8192 -fa \
  --port 8080
```

M3 Pro 36GB 的建議：8B 用 Q6_K（~5.5 GB），14B 用 Q4_K_M（~8.5 GB），32B 用 Q4_K_M（~20 GB）。剩餘記憶體留給 KV cache 和系統。

## 整體來說

llama.cpp 是本地 LLM 推論的基礎設施。Ollama、LM Studio、GPT4All 底層都是它。直接用 llama.cpp 的好處是：完全控制量化格式選擇、GPU offload 策略、context length 分配、sampling 參數——這些在 Ollama 裡都被自動化了，方便但不透明。

2026 年的 llama.cpp 已經不只是「在 CPU 上跑 LLaMA」。它是一個成熟的多後端推論引擎，支援幾乎所有主流架構（Llama、Mistral、Qwen、Gemma、Phi、DeepSeek...），社群活躍度極高（75K+ stars），每週都有新的優化合入。

如果你已經在用 Ollama 而且滿意，不需要換。但如果你想更深入理解本地推論的每一個環節，或者需要 Ollama 不支援的功能（speculative decoding、grammar sampling、自訂量化），llama.cpp 就是下一站。

## 參考資料

- [llama.cpp GitHub repo](https://github.com/ggerganov/llama.cpp)
- [GGUF 格式規格](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)
- [HuggingFace GGUF 模型搜尋](https://huggingface.co/models?library=gguf)
- [Ollama 完整指南：一行指令在本地跑 LLM](/posts/ai/ollama-local-llm-guide)
- [vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/vllm-inference-engine)
- [TurboQuant+ — KV Cache 兩階段量化壓縮](/posts/ai/turboquant-plus-kv-cache-compression)
