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

llama.cpp 由 Georgi Gerganov 在 2023 年 3 月發起，最初只是為了在 MacBook 上跑 LLaMA。截至 2026 年 3 月已有 **100K+ GitHub stars、1,039+ contributors、4,828+ commits**。2026 年 2 月，Gerganov 和 ggml.ai 團隊正式加入 Hugging Face，專案從 `ggerganov/llama.cpp` 搬到 `ggml-org/llama.cpp`。

核心設計決策：**不依賴 Python、不依賴 PyTorch、不依賴 CUDA**，用純 C/C++ 從頭實作張量運算。

底層是 **GGML**（Georgi Gerganov Machine Learning），一個極輕量的張量庫：

- 16 種量化資料型別
- 計算圖模型（DAG），定義一次、多次執行
- context-based 連續記憶體分配，對 cache 友好
- 可插拔後端架構（runtime 自動偵測最佳硬體）
- 零執行時期依賴，編譯後是單一 binary

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

GGUF 在 2023 年 8 月取代了早期的 GGML 格式，關鍵改進：

- **單檔自包含**：metadata、tokenizer、模型權重全部在一個檔案裡
- **Memory-mappable**：tensor 資料可以透過 mmap 直接存取，不需要載入整個檔案到記憶體，大幅加快載入速度
- **混合量化**：同一個檔案內不同 tensor 可以用不同量化格式
- **支援 50+ 模型架構**：LLaMA、Mistral、Qwen、Gemma、DeepSeek、Phi 等

HuggingFace 上幾乎所有社群量化模型都以 GGUF 發佈，已成為本地 LLM 的事實標準格式。

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

- **Q** 系列（Q4_0、Q4_1、Q5_0、Q5_1、Q8_0）：基礎量化，逐 block 對稱或非對稱量化，統一 scale。Q4_0 每 32 個 float 存一個 fp16 scale + 32 個 4-bit 整數；Q4_1 額外存一個 offset（`w = d * q + m`），精度略高
- **K** 系列（Q3_K_S、Q4_K_M、Q5_K_M、Q6_K）：K-quant，**對不同 tensor 類型用不同精度**——敏感的層（attention projection、output）用更多 bits，FFN 等層壓更低。S/M/L 後綴控制壓縮程度：**S**（Small）更激進、**M**（Medium）平衡、**L**（Large）更保守
- **IQ** 系列（IQ1_S、IQ2_XXS、IQ3_M、IQ4_NL）：importance-weighted quantization，用校準數據集計算 importance matrix，搭配 lattice codebook 做向量量化。同 bit 下品質比 K 系列更好，但量化過程慢且需要校準數據

### 格式對照表

| 格式 | bits/weight | 7B 模型大小 | PPL 增量 | 適合場景 |
|------|------------|-----------|---------|---------|
| Q2_K | ~3.2 | ~2.95 GB | 高 | 極端記憶體限制 |
| IQ3_M | ~3.8 | ~3.52 GB | 低 | 記憶體吃緊但想要更好品質 |
| Q4_0 | ~4.5 | ~3.83 GB | +0.2499 | 舊版基準，不推薦 |
| Q4_K_S | ~4.7 | ~4.36 GB | +0.1149 | 記憶體有限但想要 K-quant |
| **Q4_K_M** | **~4.9** | **~4.58 GB** | **+0.0535** | **多數人的最佳選擇** |
| Q5_K_M | ~5.7 | ~5.33 GB | 極低 | 品質優先 |
| Q6_K | ~6.6 | ~6.14 GB | 近零 | 記憶體夠就用這個 |
| Q8_0 | ~8.5 | ~7.95 GB | ≈ 0 | 品質要求最高 |
| F16 | 16 | ~14.96 GB | 基準 | 參考用 |

注意 Q4_K_M 的 PPL 增量只有 +0.0535，而舊版 Q4_0 是 +0.2499——**同樣 4-bit，K-quant 的品質好了一個數量級**。

**怎麼選？** 記憶體夠就 Q6_K，一般用 Q4_K_M，極端省記憶體用 IQ3_M。另一個經驗法則：**大模型低量化通常打敗小模型高量化**——14B Q4_K_M 通常比 7B Q8_0 更聰明。

### IQ 格式：極端壓縮的選擇

IQ（importance quantization）格式的兩個核心創新：

1. **Importance matrix（imatrix）**：跑校準數據集計算哪些權重對輸出影響最大，壓縮時優先保留這些權重
2. **Lattice codebook**：用最佳化的向量量化碼本取代簡單的線性量化，同 bit 下表達能力更強

| 格式 | bits/weight | 7B 模型大小 | 特點 |
|------|------------|-----------|------|
| IQ1_S | ~1.87 | ~1.87 GB | 極端壓縮，品質大幅下降 |
| IQ2_XXS | ~2.4 | ~2.23 GB | 超低 bit，需要 imatrix |
| IQ3_M | ~3.8 | ~3.52 GB | 同 bit 下品質優於 Q3_K |
| IQ4_XS | ~4.3 | — | importance-weighted 4-bit |
| IQ4_NL | ~4.5 | — | 非線性 4-bit 量化 |

另外還有 **TQ（Ternary Quantization）** 格式：TQ1_0（1.69 bpw）和 TQ2_0（2.06 bpw），只用 -1/0/+1 三個值表示權重，是目前最極端的壓縮方式。

IQ 格式的量化需要先用 `llama-imatrix` 產生校準數據，跳過這步 `llama-quantize` 會警告。解碼速度比 K 系列略慢，目前在 CPU 和 Metal 上支援最好。

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

### 效能的關鍵：記憶體頻寬

LLM text generation 是**記憶體頻寬瓶頸**，不是算力瓶頸——GPU 大部分時間在等資料從記憶體搬過來，不是在算。這解釋了一個反直覺的現象：

| 硬體 | 記憶體頻寬 | 8B Q4_K_M decode | 備註 |
|------|-----------|-----------------|------|
| M3 Pro 36GB | 150 GB/s | ~20 tok/s | Metal |
| M2 Pro 32GB | 200 GB/s | ~38-48 tok/s | 頻寬比 M3 Pro 高！ |
| M4 Max 128GB | 546 GB/s | ~70-80 tok/s | Metal |
| RTX 4090 24GB | ~1 TB/s | ~120-150 tok/s | CUDA |
| RTX 3060 12GB | 360 GB/s | ~35 tok/s | CUDA |
| i9-13900K (CPU) | ~90 GB/s | ~12 tok/s | AVX2 |

M2 Pro 比 M3 Pro **記憶體頻寬更高**（200 vs 150 GB/s），所以在 decode 速度上反而更快。RTX 4090 在模型完全塞進 VRAM 時無敵，但 70B 模型超出 24GB 就必須 offload 到 CPU，速度斷崖式下降——這時 128GB 的 M4 Max 反而更快，因為統一記憶體不需要搬資料。

**Apple Silicon 的優勢是容量，NVIDIA 的優勢是頻寬。**

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

- `POST /v1/chat/completions` — 對話（OpenAI 相容）
- `POST /v1/completions` — 文字生成
- `POST /v1/embeddings` — Embedding
- `POST /v1/messages` — **Anthropic Messages API 相容**
- `POST /reranking` — 文件重排序
- `GET /health` — 健康檢查
- `GET /metrics` — Prometheus 指標
- 內建 Web UI（瀏覽器開 `http://localhost:8080`）

支援 function calling、structured output（JSON Schema）、vision 輸入、reasoning/thinking mode、LoRA 動態載入、SSL/TLS 和 API key 認證。任何支援 OpenAI 或 Anthropic API 的工具都能直接對接。

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

LLM decode 是記憶體頻寬瓶頸——一次算 N 個 token 的時間跟算 1 個差不多。Speculative decoding 利用這點：用便宜的方式快速猜多個候選 token，再用大模型一次驗證。

llama.cpp 支援多種 speculation 方法：

| 方法 | 原理 | 加速幅度 |
|------|------|---------|
| **Draft model** | 小模型（如 1B）產生 draft，大模型驗證 | 1.8-2x，最高 3x |
| **ngram-simple** | 在已生成的 token 歷史中比對 n-gram，用後續 token 當 draft | 低開銷 |
| **ngram-mod** | hash-based n-gram 統計，跨 server slot 共享，~16MB 記憶體 | 低開銷 |

```bash
# Draft model 方式
llama-server \
  -m large-model.gguf \
  -md draft-model.gguf \
  -ngl 99 -ngld 99 \
  --draft-max 16 \
  --spec-type draft

# N-gram 方式（不需要額外模型）
llama-server \
  -m model.gguf -ngl 99 \
  --spec-type ngram-mod \
  --spec-ngram-size-n 12
```

Draft model 的最佳搭配：同家族的大小模型（如 Llama 3.1 8B + 1B），詞彙表必須一致。0.5-1B 的 draft model 效果最好，太大反而划不來。**程式碼生成**因為重複模式多，是 speculative decoding 收益最大的場景。

### Grammar-Constrained Sampling

用 BNF 語法限制模型輸出格式，100% 保證符合結構：

```bash
llama-cli -m model.gguf --grammar 'root ::= "{" "\"name\":" [^}]+ "}"' -p "Generate a JSON"
```

比 JSON mode 更強——你可以定義任意語法規則，確保輸出是合法的 JSON、SQL、或任何自訂格式。

### Flash Attention

Flash Attention 在 llama.cpp 中**已預設啟用**。如果需要關閉可用 `-fa off`。

效果實測（M3 Max, Llama 3 8B, ~26K tokens）：
- 無 FA：首 token 80s，生成 11 tok/s
- 有 FA：首 token 72s，生成 32 tok/s — **生成速度約 3 倍**

主要幫助在 prefill 階段（處理長 input），context 越長效果越明顯。少數模型在特定 GPU 上可能有品質差異，但 llama.cpp 會自動 fallback 處理不支援的情況。

### 多模態推論

2025 年 4 月加入的 **libmtmd** 統一了多模態支援。支援 LLaVA、Gemma 3、Qwen2-VL、MobileVLM 等視覺語言模型，也開始支援音訊輸入：

```bash
llama-mtmd-cli -m model.gguf --mmproj mmproj.gguf -p "Describe this image" --image photo.jpg
```

llama-server 也內建多模態支援，可以透過 OpenAI 相容 API 傳圖片。

## 從 HuggingFace 取得模型

最簡單的方式是用 llama.cpp 內建的 HuggingFace 整合，一行搞定：

```bash
# 直接從 HuggingFace 下載並執行
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF --conversation
```

或手動下載社群量化好的 GGUF：

```bash
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

- **vs Ollama**：Ollama 底層就是 llama.cpp，加了一層 Go 封裝。直接用 llama.cpp 比 Ollama **快 13-80%**（視場景），但 Ollama 的開發者體驗更好
- **Mac 用戶**：llama.cpp（Metal）和 MLX 都是好選擇。MLX 在 Apple Silicon 上快 30-50%，但 llama.cpp 的生態和模型選擇更大
- **NVIDIA 用戶**：生產用 vLLM（多用戶 throughput 高 35 倍），本地用 llama.cpp 或 ExLlamaV2
- **跨平台**：llama.cpp 是唯一一個 CPU/Metal/CUDA/Vulkan/ROCm 全部支援的

## Mac 快速上手

```bash
# 1. 編譯（Metal 自動啟用）
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build    # Metal 在 macOS 上預設啟用
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

2026 年的 llama.cpp 已經不只是「在 CPU 上跑 LLaMA」。它是一個成熟的多後端推論引擎，支援 50+ 模型架構，100K+ GitHub stars，ggml.ai 團隊加入 Hugging Face 後發展更快——MCP client 支援、Anthropic API 相容、音訊輸入、autoparser structured output 都是近期新增的。

如果你已經在用 Ollama 而且滿意，不需要換。但如果你想更深入理解本地推論的每一個環節，或者需要 Ollama 不支援的功能（speculative decoding、grammar sampling、自訂量化），llama.cpp 就是下一站。

## 參考資料

- [llama.cpp GitHub repo](https://github.com/ggml-org/llama.cpp)
- [ggml.ai 加入 Hugging Face 公告](https://huggingface.co/blog/ggml-joins-hf)
- [GGUF 格式規格](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)
- [HuggingFace GGUF 模型搜尋](https://huggingface.co/models?library=gguf)
- [量化格式選擇研究（2026 年 1 月論文）](https://arxiv.org/html/2601.14277v1)
- [Ollama 完整指南：一行指令在本地跑 LLM](/posts/ai/ollama-local-llm-guide)
- [vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/vllm-inference-engine)
- [TurboQuant+ — KV Cache 兩階段量化壓縮](/posts/ai/turboquant-plus-kv-cache-compression)
