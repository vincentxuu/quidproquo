---
title: "TensorRT-LLM：編譯換效能的 NVIDIA 專用 LLM 推論引擎"
date: 2026-08-25
category: tech
type: deep-dive
tags: [tensorrt-llm, nvidia, llm-inference, gpu, self-hosted, cuda]
lang: zh-TW
tldr: "TensorRT-LLM 是 NVIDIA 的開源 LLM 推論庫（Apache 2.0），用離線編譯把模型權重與計算圖轉成最佳化的 TensorRT engine，再用自訂 CUDA kernel、in-flight batching 與多種平行化壓出硬體極限。代價是只支援 NVIDIA GPU、編譯要數十分鐘、換模型或量化就要重新 build。"
description: "介紹 TensorRT-LLM 的 build → runtime 兩階段架構、核心最佳化（FP8/FP4、in-flight batching、speculative decoding、多維平行化）、CLI 工具、與 Triton Inference Server 的搭配方式，以及它和 vLLM、SGLang 的選型取捨。"
series:
  name: "自架推論服務"
  order: 7
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-25-tensorrt-llm-inference-en)

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) 是 NVIDIA 為大型語言模型推論設計的開源庫。和 vLLM、SGLang 的最大差異在於它有一個明確的「編譯」步驟：先把模型權重和計算圖離線轉換成 TensorRT engine，runtime 再用這個 engine 做推論。

這個兩階段設計讓 TensorRT-LLM 能在 NVIDIA GPU 上榨出最高效能——H100 上通常比 vLLM 快 15–30%，某些情境可達 2–4 倍。但代價也很明確：只支援 NVIDIA GPU、編譯一次通常要 20–30 分鐘、每換一次模型或量化設定就要重新 build。

## 兩階段架構：Build → Runtime

### Build 階段

Build 是 TensorRT-LLM 的核心設計。你提供 HuggingFace 權重或 checkpoint，TensorRT-LLM 做以下事情：

1. 載入模型定義（PyTorch-native 架構描述）
2. 套用量化（FP8、FP4、INT4 AWQ 等）
3. 把計算圖送進 TensorRT 編譯器，做 kernel fusion、記憶體排程、層級最佳化
4. 輸出一個或多個 `.engine` 檔案，綁定特定 GPU 架構

```bash
# 用 CLI 一步完成 build + 啟動
trtllm-serve \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --backend tensorrt \
  --tp 2
```

`trtllm-serve` 會自動下載權重、build engine、啟動 OpenAI 相容 API server。第一次跑的編譯時間取決於模型大小和 GPU：7B 約 10–15 分鐘，70B 約 30–60 分鐘。之後可以用快取的 engine 跳過 build。

手動 build 給你更多控制：

```python
from tensorrt_llm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    tensor_parallel_size=2,
    quantization="fp8",
)
```

### Runtime 階段

engine 編譯完成後，推論由 C++ runtime 接管。核心能力：

- **In-flight batching**：不同於 vLLM 的 continuous batching 按 iteration 排程，TensorRT-LLM 可以在一個 batch 的 forward pass 完成前就插入新請求。這在混合長短 prompt 時能進一步壓低 GPU 閒置
- **KV cache 管理**：支援 paged attention，也支援 KV cache 量化（FP8、INT8）來延伸可用 context
- **多種解碼策略**：greedy、beam search、top-k/top-p sampling、speculative decoding

## 核心最佳化

### 量化

| 格式 | 精度 | 適合場景 |
|------|------|---------|
| FP16 / BF16 | 基準 | 品質要求最高、記憶體夠用 |
| FP8 | 接近 FP16 | H100/H200/L40S 的甜蜜點 |
| FP4 | 略有損失 | 記憶體極度受限 |
| INT4 AWQ | 有損但可控 | 大模型塞進小 GPU |

FP8 是目前效能與品質最平衡的選項。H100 的 FP8 tensor core 吞吐是 FP16 的兩倍，TensorRT-LLM 能自動校準並套用。

### 平行化

| 維度 | 作用 |
|------|------|
| Tensor Parallel | 把單層權重切分到多張 GPU |
| Pipeline Parallel | 把不同層分配到不同 GPU |
| Expert Parallel | MoE 模型的專家路由平行化 |
| Context Parallel | 長序列的 attention 切分 |

多維平行化可以疊加。實務上 tensor parallel 最常用，pipeline parallel 在跨節點場景或極大模型時才值得引入（它會增加氣泡）。

### Speculative Decoding

用一個小模型（draft model）預測多個 token，大模型一次驗證。官方宣稱可達 3 倍吞吐提升。適合 draft 模型與目標模型 vocabulary 相同且準確率夠高的場景。

### Prefill-Decode 分離

把 prefill（處理 prompt）和 decode（生成 token）拆到不同 GPU 群組。prefill 是 compute-bound，decode 是 memory-bound，分開排程讓兩邊的 GPU 都能跑在最佳負載。這在大規模部署時有意義，單機通常不需要。

## CLI 工具

TensorRT-LLM 提供三個主要 CLI：

```bash
# 一站式：build + serve OpenAI API
trtllm-serve --model meta-llama/Llama-3.1-8B-Instruct

# 效能壓測
trtllm-bench \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --input-length 512 \
  --output-length 256 \
  --concurrency 32

# 模型評估（accuracy）
trtllm-eval \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --tasks gsm8k,mmlu
```

`trtllm-bench` 對選型很有用：它能測出你的硬體、模型、量化與平行化設定的組合在特定負載下的實際 throughput 和 latency，而不是用別人的 benchmark。

## 和 Triton Inference Server 的搭配

TensorRT-LLM 是推論引擎，Triton 是模型伺服器。兩者的關係類似 vLLM 之於 Ray Serve：

- **TensorRT-LLM** 負責 GPU kernel、batching、KV cache、解碼
- **Triton** 負責 HTTP/gRPC API、model repository、版本管理、ensemble、監控

NVIDIA 提供 [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)，讓你把 TensorRT-LLM engine 當 Triton 的一個 backend 掛載。這讓 TensorRT-LLM 的 LLM 推論和 Triton 上的其他模型（embedding、reranker、前後處理）共存在同一個平台。

不過 `trtllm-serve` 已經內建 OpenAI 相容 API。如果不需要 Triton 的 model repository 和 ensemble，直接用 `trtllm-serve` 更簡單。

## 硬體需求

**只支援 NVIDIA GPU**。這是最明確的選型限制。

| 項目 | 需求 |
|------|------|
| GPU | NVIDIA H100、H200、L40、L4、RTX 40/50 系列 |
| CUDA | 13.2.1+ |
| Python | 3.10+ |
| PyTorch | 2.1.2+ |
| 記憶體 | 至少能放下量化後的模型權重 + KV cache |

消費級 GPU：RTX 4090（24 GB）可以跑 7B FP8 或 14B INT4。RTX 4060（8 GB）只能跑很小的模型。

資料中心 GPU：H100（80 GB）是 TensorRT-LLM 效能最高的平台，搭配 NVLink 和 NVSwitch 做多 GPU 時 AllReduce 速度可達 3 倍。

## 和 vLLM、SGLang 怎麼選

| | TensorRT-LLM | vLLM | SGLang |
|---|---|---|---|
| 硬體 | NVIDIA only | NVIDIA、AMD、CPU | NVIDIA、AMD |
| 編譯步驟 | 需要（10–60 分鐘） | 不需要 | 不需要 |
| 典型效能差距 | 基準 | 慢 15–30% | 接近 vLLM |
| 模型切換 | 要重新 build | 即時載入 | 即時載入 |
| 社群生態 | NVIDIA 主導 | 最大開源社群 | 學術 + 社群 |
| API | OpenAI 相容 | OpenAI 相容 | OpenAI 相容 |
| 量化 | FP8/FP4/INT4 最完整 | FP8/GPTQ/AWQ | FP8/GPTQ/AWQ |

### 編譯成本什麼時候值得

TensorRT-LLM 的效能優勢來自離線編譯——它有更多時間做 kernel fusion 和記憶體排程。但這也意味著：

- 模型固定、長期服務同一個模型：值得。編譯一次的成本會被無數次推論攤平
- 頻繁換模型或實驗不同量化：不值得。每次都要等 build
- 非 NVIDIA 硬體：不可能。沒有替代方案
- 對延遲極度敏感（如 trading）：值得。30% 的延遲差距在某些場景是決定性的
- 團隊沒有 CUDA 除錯能力：要三思。engine build 失敗的錯誤訊息不像 Python 那麼友善

簡單的決策規則：如果你的推論服務會跑在同一個模型上超過一週，而且硬體是 NVIDIA，至少用 `trtllm-bench` 跑一次壓測。15–30% 的效能差距在 GPU 租金上可能是真金白銀。

## 參考資料

- [TensorRT-LLM GitHub Repository](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)
- [NVIDIA TensorRT Developer Guide](https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/)
- [本站：vLLM 自架推論的成本門檻](/posts/ai/2026-08-21-vllm-self-host-decision)
- [本站：NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server)
- [本站：SGLang 自架推論服務](/posts/tech/2026-08-22-sglang-inference-server)
