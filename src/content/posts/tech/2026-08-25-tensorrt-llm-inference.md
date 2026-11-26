---
title: "TensorRT-LLM：NVIDIA 專用的 LLM 推論引擎，以及它為什麼拿掉了編譯步驟"
date: 2026-08-25
category: tech
type: deep-dive
tags: [tensorrt-llm, nvidia, llm-inference, gpu, self-hosted, cuda]
lang: zh-TW
tldr: "TensorRT-LLM 是 NVIDIA 的開源 LLM 推論庫（Apache 2.0），靠自家 CUDA kernel、FP8／NVFP4 量化、in-flight batching 與多種平行化在 NVIDIA GPU 上壓出硬體極限。它過去要先把模型離線編譯成 TensorRT engine；1.0 起 PyTorch 架構成為預設，2026-11 的 1.3 版正式移除 TensorRT 後端，現在跟 vLLM 一樣直接載入 Hugging Face 權重。不變的限制是只支援 NVIDIA GPU。"
description: "介紹 TensorRT-LLM 從「build → runtime」兩階段到單一 PyTorch 後端的轉變、核心最佳化（FP8／NVFP4、in-flight batching、speculative decoding、多維平行化、prefill-decode 分離）、CLI 工具、與 Triton Inference Server 的搭配方式，以及它和 vLLM、SGLang 的選型取捨。"
series:
  name: "自架推論服務"
  order: 7
draft: false
---

> :globe: [English version](/posts/tech/2026-08-25-tensorrt-llm-inference-en)

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) 是 NVIDIA 為大型語言模型推論設計的開源庫。它和 vLLM、SGLang 的最大差異一直是「只為 NVIDIA GPU 而寫」：kernel、量化格式與平行化策略都跟著 NVIDIA 每一代硬體走，H100 上通常比 vLLM 快 15–30%，某些情境可達 2–4 倍。

它過去還有第二個差異：一個明確的「編譯」步驟，先把模型權重和計算圖離線轉成 TensorRT engine，runtime 再用這個 engine 推論。這個設計在 2026-11-20 發布的 1.3.0 版走入歷史——TensorRT 後端被整個移除，PyTorch 成為唯一的執行後端。這篇先講這個轉變，再看它現在的能力與選型取捨。

## 從兩階段到單一 PyTorch 後端

### 舊設計：Build → Runtime

早期的 TensorRT-LLM 要先 build：載入模型定義、套用量化、把計算圖送進 TensorRT 編譯器做 kernel fusion 與記憶體排程，最後輸出綁定特定 GPU 架構的 `.engine` 檔。編譯一次要幾十分鐘，每換一次模型、量化設定或 GPU 就要重來。換到的是當時最高的吞吐量，代價是彈性。

### 1.0 到 1.3：編譯步驟被拿掉

2025-09 的 1.0 版把以 PyTorch 為基礎的架構定為穩定的預設體驗，TensorRT engine 變成選項。2026-11 的 1.3.0 版更進一步，release notes 把它列為破壞性變更：

- TensorRT 後端移除，PyTorch 是唯一後端
- `trtllm-build`、`trtllm-refit`、各模型的 `convert_checkpoint.py` 一併移除，Hugging Face checkpoint 直接載入
- 舊的 C++ Executor 與 runtime API 移除
- TensorRT、ModelOpt、ONNX 不再是安裝依賴

為什麼拿掉？官方的[遷移指南](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/legacy/tensorrt-backend-removal.md)只寫了「改什麼」。從結果看得出取捨：效能的主要來源早就是 NVIDIA 手寫的 attention、GEMM 與 MoE kernel，這些在 PyTorch 架構裡照樣能用；而編譯步驟讓每一次換模型都要等，新模型也要先寫轉換腳本才能跑。拿掉之後，新模型能更快支援，使用方式也和 vLLM、SGLang 對齊。

### 現在怎麼用

```bash
# 直接載入 Hugging Face 模型，啟動 OpenAI 相容 API server
trtllm-serve Qwen/Qwen3.5-9B

# 要更快可以用 NVIDIA 預先量化好的 checkpoint（GPU 需支援 FP8）
trtllm-serve nvidia/Qwen3-8B-FP8
```

Python 的 LLM API 也一樣，不必指定 backend：

```python
from tensorrt_llm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen3.5-9B",
    tensor_parallel_size=2,
)
outputs = llm.generate(["用三點解釋 KV cache"], SamplingParams(max_tokens=256))
print(outputs[0].outputs[0].text)
```

還在用舊流程的人要注意：`LLM(backend="tensorrt")` 會直接報錯，`--backend tensorrt` 要拿掉，`trtllm-serve` 的 `--backend` 參數本身也已標為 deprecated。舊的 `.engine` 檔不能再用，改指向原始的 Hugging Face checkpoint。

## Runtime 的核心能力

- **In-flight batching**：請求可以在 batch 執行中途加入或離開，混合長短 prompt 時能壓低 GPU 閒置，概念上等同 vLLM 的 continuous batching
- **KV cache 管理**：paged KV cache 與前綴重用；1.3 起多數模型預設使用新版 KV Cache Manager V2，另有 FP8／NVFP4 KV cache 與 KV cache 壓縮來延伸可用 context
- **解碼策略**：greedy、beam search、top-k／top-p sampling、speculative decoding
- **API**：OpenAI 相容的 `/v1/chat/completions`，1.3 另外加上 Anthropic Messages API（`/v1/messages`）與 gRPC server

## 核心最佳化

### 量化

| 格式 | 精度 | 適合場景 |
|------|------|---------|
| FP16 / BF16 | 基準 | 品質要求最高、記憶體夠用 |
| FP8 | 接近 FP16 | Hopper（H100／H200）與 Ada（L40S）的甜蜜點 |
| NVFP4 | 略有損失 | Blackwell 原生支援；1.3 起也能以 weight-only 方式跑在 Hopper 與 Ada |
| MXFP8 | 接近 FP8 | 1.3 新增，已有 MXFP8 發布的模型（如 MiniMax-M3）直接用 |
| INT4 AWQ | 有損但可控 | 大模型塞進小 GPU |

量化現在多半透過預先量化好的 checkpoint 取得，例如 Hugging Face 上 NVIDIA 用 Model Optimizer 產生的 FP8／NVFP4 版本。H100 的 FP8 tensor core 吞吐是 FP16 的兩倍，FP8 仍是效能與品質最平衡的選項；Blackwell 上則看 NVFP4。

### 平行化

| 維度 | 作用 |
|------|------|
| Tensor Parallel | 把單層權重切分到多張 GPU |
| Pipeline Parallel | 把不同層分配到不同 GPU |
| Expert Parallel | MoE 模型的專家路由平行化 |
| Context Parallel | 長序列的 attention 切分 |

多維平行化可以疊加。實務上 tensor parallel 最常用，pipeline parallel 在跨節點場景或極大模型時才值得引入（它會增加氣泡）。

### Speculative Decoding

先猜多個 token，再由目標模型一次驗證。1.3 版移除了「另外掛一個小模型當 draft」的雙模型實作，只保留 EAGLE3、MTP 這類把草稿頭接在目標模型上的單模型做法，並新增 DSpark、DFlash 等 drafter。效果取決於猜中率，1.3 也加入「猜中率太低就自動關掉」的機制，避免拖慢。

### Prefill-Decode 分離

把 prefill（處理 prompt）和 decode（生成 token）拆到不同 GPU 群組。prefill 是 compute-bound，decode 是 memory-bound，分開排程讓兩邊的 GPU 都能跑在最佳負載。這在大規模部署時有意義，單機通常不需要。

## CLI 工具

TensorRT-LLM 提供三個主要 CLI：

```bash
# 啟動 OpenAI 相容 API
trtllm-serve Qwen/Qwen3.5-9B

# 效能壓測：先產生合成資料集，再跑 throughput
trtllm-bench --model Qwen/Qwen3.5-9B prepare-dataset \
  --output /tmp/synthetic_512_256.txt \
  token-norm-dist --input-mean 512 --output-mean 256 \
  --input-stdev 0 --output-stdev 0 --num-requests 1000
trtllm-bench --model Qwen/Qwen3.5-9B throughput \
  --dataset /tmp/synthetic_512_256.txt

# 準確度評估（官方定位為開發用，不建議用在正式環境）
trtllm-eval --model Qwen/Qwen3.5-9B gsm8k
```

`trtllm-bench` 對選型很有用：它能測出你的硬體、模型、量化與平行化設定的組合在特定負載下的實際 throughput 和 latency，而不是用別人的 benchmark。

## 和 Triton Inference Server 的搭配

TensorRT-LLM 是推論引擎，Triton 是模型伺服器。兩者的關係類似 vLLM 之於 Ray Serve：

- **TensorRT-LLM** 負責 GPU kernel、batching、KV cache、解碼
- **Triton** 負責 HTTP/gRPC API、model repository、版本管理、ensemble、監控

NVIDIA 提供 [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)，讓 TensorRT-LLM 和 Triton 上的其他模型（embedding、reranker、前後處理）共存在同一個平台。1.3 起這個 backend 只剩走 LLM API 的 `llmapi` 模型，舊的 TensorRT-engine 模型設定已移除，升級時 model repository 要跟著改。

如果不需要 Triton 的 model repository 和 ensemble，直接用 `trtllm-serve` 更簡單。

## 硬體需求

**只支援 NVIDIA GPU**。這是最明確的選型限制。

| 項目 | 需求（1.3.0） |
|------|------|
| GPU | Hopper（H100、H200）、Blackwell（B200、GB300、RTX 50 系列）、Ada（L40S、L4、RTX 40 系列）等；1.3 加入 Rubin 預覽 |
| CUDA | 13.4.1 |
| Python | 3.10、3.12 |
| PyTorch | 2.14.0 |
| 記憶體 | 至少能放下量化後的模型權重 + KV cache |

消費級 GPU：RTX 4090（24 GB）可以跑 7B FP8 或 14B INT4。RTX 4060（8 GB）只能跑很小的模型。

資料中心 GPU：H100／H200 仍是最常見的部署平台；Blackwell（B200、GB300）有原生 NVFP4，是新版大多數效能最佳化優先落地的地方。多 GPU 時搭配 NVLink 和 NVSwitch，AllReduce 速度可達 3 倍。

## 和 vLLM、SGLang 怎麼選

| | TensorRT-LLM | vLLM | SGLang |
|---|---|---|---|
| 硬體 | NVIDIA only | NVIDIA、AMD、Intel、TPU 等 | NVIDIA、AMD、TPU、Apple Silicon 等 |
| 編譯步驟 | 不需要（1.3 起移除） | 不需要 | 不需要 |
| 典型效能差距 | 基準 | 慢 15–30% | 接近 vLLM |
| 模型切換 | 直接載入 HF checkpoint | 直接載入 | 直接載入 |
| 社群生態 | NVIDIA 主導 | 最大開源社群 | 學術 + 社群 |
| API | OpenAI 相容、Anthropic Messages | OpenAI 相容 | OpenAI 相容 |
| 量化 | FP8／NVFP4／MXFP8／INT4 最完整 | FP8／NVFP4／GPTQ／AWQ | FP8／NVFP4／GPTQ／AWQ |

### 什麼時候值得選 TensorRT-LLM

拿掉編譯步驟之後，「要不要等 build」不再是判準，剩下的是硬體與效能：

- 全部是 NVIDIA GPU、長期服務少數幾個模型：值得壓測。15–30% 的差距會在每個月的 GPU 帳單上反映出來
- 跑在 Blackwell、想用 NVFP4：1.3 版的效能最佳化大多針對 Blackwell 與 Rubin，值得列入比較
- 有 AMD、TPU 或混合硬體：不可能，選 vLLM 或 SGLang
- 對延遲極度敏感（如 trading）：值得。30% 的延遲差距在某些場景是決定性的
- 還在跑 1.3 之前的 TensorRT engine 流程：升級要把 engine、`trtllm-build` 腳本與 Triton 的 model repository 一起改掉，先在測試環境走一次

簡單的決策規則：如果你的推論服務會跑在同一個模型上超過一週，而且硬體是 NVIDIA，至少用 `trtllm-bench` 跑一次壓測，跟 vLLM 在同一組請求上比。

## 更新紀錄

- 2026-11-23：TensorRT-LLM 1.3.0（2026-11-20）移除 TensorRT 後端，改寫標題、tldr 與「兩階段架構」一節，說明編譯步驟拿掉的經過與現在的用法；runtime、speculative decoding、Triton 搭配、硬體需求（CUDA 13.4.1、PyTorch 2.14.0、Python 3.10／3.12）與比較表依 1.3 更新；範例模型換成 Qwen3.5-9B。

## 參考資料

- [TensorRT-LLM GitHub Repository](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM v1.3.0 Release Notes](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.3.0) — TensorRT 後端移除、依賴版本、新功能
- [TensorRT-LLM 1.0 Release Notes](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0) — PyTorch 架構成為預設
- [Migration Guide: TensorRT Backend Removed](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/legacy/tensorrt-backend-removal.md)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [TensorRT-LLM Quick Start Guide](https://nvidia.github.io/TensorRT-LLM/quick-start-guide.html)
- [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)
- [本站：vLLM 自架推論的成本門檻](/posts/ai/2026-08-21-vllm-self-host-decision)
- [本站：NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server)
- [本站：SGLang 自架推論服務](/posts/tech/2026-08-22-sglang-inference-server)
