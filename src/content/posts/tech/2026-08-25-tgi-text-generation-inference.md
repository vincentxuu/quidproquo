---
title: "TGI：HuggingFace 的 LLM 推論伺服器，以及它為什麼進入維護模式"
date: 2026-08-25
category: tech
type: deep-dive
tags: [tgi, huggingface, llm-serving, inference, gpu, self-hosted]
lang: zh-TW
tldr: "Text Generation Inference（TGI）是 HuggingFace 自家的 LLM 推論伺服器，用 Rust + Python 實作，率先在開源推論引擎裡引入 continuous batching 與 Flash Attention。2026 年 3 月 GitHub 倉庫歸檔進入維護模式，官方建議遷移到 vLLM 或 SGLang。了解 TGI 仍然重要：它定義了後繼引擎的架構基線，而且許多 HuggingFace Inference Endpoint 上的既有服務仍在跑它。"
description: "介紹 TGI 的核心架構（Rust router、continuous batching、Flash/Paged Attention）、部署方式、API、量化支援、硬體相容性、效能定位，以及它進入維護模式的原因和遷移路徑。"
series:
  name: "自架推論服務"
  order: 6
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-25-tgi-text-generation-inference-en)

Text Generation Inference（TGI）是 HuggingFace 開發的 LLM 推論伺服器。2023 年開源時，它是第一個把 continuous batching、Flash Attention 和 token streaming 打包成「Docker 啟動就能用」的生產級方案，HuggingChat 和 OpenAssistant 都用它跑推論。

2026 年 3 月 21 日，HuggingFace 將 TGI 的 GitHub 倉庫[歸檔為唯讀](https://github.com/huggingface/text-generation-inference)，正式進入維護模式——只接受小 bug 修復和文件更新，不再支援新模型架構。官方建議遷移到 [vLLM](https://github.com/vllm-project/vllm) 或 [SGLang](https://github.com/sgl-project/sglang)。

這篇介紹 TGI 的架構、能力和限制，並說明為什麼了解它仍然重要。

---

## 架構：Rust Router + Python Model Server

TGI 的設計分成兩層：

```
客戶端請求
    ↓
┌──────────────────────┐
│  Rust Router          │  ← HTTP/gRPC 入口、請求排隊、
│  (token streaming)    │    continuous batching、SSE 串流
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Python Model Server  │  ← 模型載入、Flash Attention、
│  (transformers 架構)  │    量化、tensor parallelism
└──────────────────────┘
```

**Rust Router** 處理 HTTP 連線管理、請求排隊和 Server-Sent Events（SSE）串流輸出。用 Rust 而非 Python 做 I/O 層的好處是低延遲和高連線並行。

**Python Model Server** 負責模型載入和實際推論。它直接依賴 HuggingFace `transformers` 的模型架構定義，這讓它可以快速支援 HuggingFace Hub 上的新模型——但也意味著核心模型程式碼和 `transformers` 的版本緊密耦合。

這個架構有一個重要影響：TGI 是最早確立「推論引擎應該直接使用 `transformers` 模型架構」的開源專案。vLLM 和 SGLang 後來都採用了類似的方法，而不是各自從頭定義模型。HuggingFace 在歸檔公告裡把這稱為 TGI 最大的遺產。

---

## 核心推論最佳化

### Continuous Batching

TGI 不等一整批請求到齊才開始推論。新請求隨時可以插入正在跑的 batch，已完成的請求隨時可以移出。這讓 GPU 利用率遠高於靜態 batching，尤其在請求到達時間不均勻、輸出長度差異大的生產環境。

### Flash Attention 與 Paged Attention

TGI 率先在生產推論引擎裡整合 [Flash Attention](https://github.com/Dao-AILab/flash-attention)（減少 attention 的記憶體與計算）和 [Paged Attention](https://arxiv.org/abs/2309.06180)（把 KV cache 切成分頁，減少碎片化浪費）。這兩項技術後來成為所有主流推論引擎的標配。

### 推測式解碼（Speculative Decoding）

用一個小模型快速生成候選 token，再由大模型一次驗證。官方宣稱延遲改善約 2 倍。實際效果取決於小模型和大模型的對齊程度——如果候選被頻繁拒絕，開銷反而增加。

### 結構化輸出（Guidance）

透過 grammar-based constraint 強制模型輸出符合 JSON Schema 的格式，支援 function calling 和 tool use。這是 TGI 較早支援的功能，後來 vLLM 和 SGLang 也各自實作了結構化輸出。

---

## 量化支援

TGI 支援多種量化方法，讓大模型能在較小的 GPU 上運行：

| 方法 | 位元 | 說明 |
|------|------|------|
| bitsandbytes | 4-bit / 8-bit | HuggingFace 生態最常用的量化庫 |
| GPTQ | 4-bit | 後訓練量化，需要校準資料集 |
| AWQ | 4-bit | Activation-aware 量化，保留重要權重精度 |
| EETQ | 8-bit | 快速 int8 量化 |
| Marlin | 4-bit | 針對 NVIDIA GPU 最佳化的 GPTQ kernel |
| fp8 | 8-bit | FP8 格式，H100 原生支援 |

量化選擇的取捨和其他引擎一樣：bit 數越低，模型越小、推論越快，但輸出品質會下降。GPTQ 和 AWQ 需要預量化的模型權重，bitsandbytes 可以即時量化。

---

## 部署

### Docker（推薦）

最簡單的啟動方式：

```bash
docker run --gpus all --shm-size 1g -p 8080:80 \
  ghcr.io/huggingface/text-generation-inference:3.3.5 \
  --model-id meta-llama/Llama-3.1-8B-Instruct
```

`--shm-size 1g` 是必要的——TGI 用共享記憶體做 tensor parallelism，不設會崩。

多 GPU tensor parallelism：

```bash
docker run --gpus all --shm-size 1g -p 8080:80 \
  ghcr.io/huggingface/text-generation-inference:3.3.5 \
  --model-id meta-llama/Llama-3.1-70B-Instruct \
  --num-shard 4
```

### 本地安裝

需要 Rust toolchain、Python 3.9+ 和 Protocol Buffers：

```bash
# 安裝 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安裝 TGI
pip install text-generation-inference

# 啟動
text-generation-launcher --model-id meta-llama/Llama-3.1-8B-Instruct
```

本地安裝需要處理 CUDA 版本、protobuf 編譯等依賴問題，Docker 通常省事很多。

### HuggingFace Inference Endpoints

TGI 是 HuggingFace 託管推論服務的預設後端。在 HuggingFace Hub 上點「Deploy → Inference Endpoint」，底層就是跑 TGI。不過 HuggingFace 已經開始提供 vLLM 作為替代後端選項。

---

## API

### 原生 API

```bash
# 文字生成
curl http://localhost:8080/generate \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "inputs": "用三點解釋什麼是 KV cache",
    "parameters": {
      "max_new_tokens": 200,
      "temperature": 0.7
    }
  }'

# 串流輸出
curl http://localhost:8080/generate_stream \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "inputs": "寫一首短詩",
    "parameters": {"max_new_tokens": 100}
  }'
```

### OpenAI 相容 API

TGI 提供 Messages API，相容 OpenAI Chat Completion 格式：

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed",
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "什麼是 continuous batching？"}],
    temperature=0.3,
)
print(response.choices[0].message.content)
```

### 監控

TGI 內建 Prometheus metrics endpoint 和 OpenTelemetry 分散式追蹤。生產部署可以直接接 Grafana 看請求延遲、佇列長度、GPU 使用率。

---

## 硬體支援

TGI 是這個系列裡硬體覆蓋最廣的引擎之一：

| 硬體 | 支援狀態 |
|------|---------|
| NVIDIA GPU（CUDA） | 完整支援，效能最佳 |
| AMD Instinct（MI210、MI250） | 支援 |
| AWS Inferentia | 支援 |
| Intel GPU | 支援 |
| Habana Gaudi | 支援 |
| Google TPU | 支援 |
| CPU | 部分支援（效能差） |

不過進入維護模式後，這些硬體後端不會再收到新的最佳化。新硬體（如 AMD MI300X、NVIDIA B100/B200）的支援不會被加入 TGI。

---

## 效能定位：為什麼被超越

TGI 在 2023–2024 年是開源推論引擎的領先者。到 2025 年，vLLM 和 SGLang 在吞吐和延遲上已經明顯超前：

| 引擎 | LLaMA-2-7B 吞吐（100 並行） |
|------|----------------------------|
| vLLM | ~15,243 tok/s |
| TGI | ~4,156 tok/s |

3.67 倍的差距來自幾個因素：

1. **PagedAttention 深度整合**：vLLM 從第一天就圍繞 PagedAttention 設計整個排程器；TGI 是後來嫁接的
2. **Continuous batching 排程器**：vLLM 和 SGLang 的排程器經過更多迭代最佳化
3. **社群規模**：vLLM 的 contributor 數量和迭代速度遠超 TGI，新的最佳化技術（chunked prefill、prefix caching）更早進入 vLLM

HuggingFace 自己也認清了這一點。2025 年底他們嘗試讓 TGI 支援 [多後端](https://huggingface.co/blog/tgi-multi-backend)——把 vLLM 和 TensorRT-LLM 當作 TGI 的推論後端，TGI 只保留 router 層。但最終 HuggingFace 選擇直接推薦遷移到 vLLM/SGLang，而不是繼續維護自己的 router。

---

## 為什麼仍然值得了解

TGI 已歸檔，但了解它仍然重要，原因有三：

### 1. 既有部署仍在運行

大量 HuggingFace Inference Endpoint 和企業內部部署仍在跑 TGI。如果你接手一個正在跑的推論服務，它很可能就是 TGI。知道它的 API 格式、設定方式和除錯方法，是維運的基本功。

### 2. 它定義了後繼引擎的架構基線

Continuous batching、Flash Attention 整合、OpenAI 相容 API、結構化輸出、token streaming——這些今天被視為「推論引擎標配」的功能，TGI 是第一個把它們打包在一起的開源專案。讀 vLLM 或 SGLang 的文件時，你會發現很多概念可以直接對應到 TGI 先做出來的東西。

### 3. HuggingFace 生態整合

TGI 是和 HuggingFace Hub 整合最深的推論引擎。模型直接從 Hub 下載、Inference Endpoints 一鍵部署、transformers 模型架構直接複用。如果你的工作流高度依賴 HuggingFace 生態，即使遷移到 vLLM，很多概念和工作流程是從 TGI 延續過來的。

---

## 遷移路徑

HuggingFace 官方推薦的遷移目標：

| 需求 | 目標引擎 |
|------|---------|
| 通用 LLM serving、多硬體支援 | vLLM |
| 共同前綴重用、高吞吐結構化輸出 | SGLang |
| 本地開發、消費級硬體 | llama.cpp 或 MLX |
| NVIDIA 硬體極致效能 | TensorRT-LLM |

遷移的主要工作：

1. **API 相容**：TGI 的原生 API（`/generate`、`/generate_stream`）和 vLLM/SGLang 不同，但 OpenAI 相容端點格式一致——如果你的 client 已經在用 `/v1/chat/completions`，切換後端只需要改 `base_url`
2. **量化格式**：GPTQ 和 AWQ 模型可以直接在 vLLM 裡用；bitsandbytes 量化需要確認目標引擎的支援狀態
3. **Docker 映像**：換一個映像名和啟動參數；`--model-id` 在 vLLM 裡叫 `--model`
4. **監控**：Prometheus metrics 的 metric 名稱不同，Grafana dashboard 需要更新

---

## 和同系列引擎的邊界

- **vLLM**：TGI 的直接後繼。吞吐更高、社群更大、模型支援更新更快。除非有特殊原因（既有 TGI 部署尚未遷移），新專案應該選 vLLM。
- **SGLang**：如果工作負載有大量共同前綴（多輪對話、固定 system prompt），RadixAttention 的效能優勢可能超過 vLLM。
- **Triton Inference Server**：不是 LLM 專用引擎，是多框架模型伺服器。如果你同時要服務 LLM 和傳統 ML 模型，Triton 才是對的層。
- **Ray Serve**：處理服務編排和叢集資源，和推論引擎是不同層。可以用 Ray Serve 編排 vLLM 或 SGLang。

---

## 整體來說

TGI 的歷史角色很明確：它是第一個把 LLM 推論的關鍵最佳化（continuous batching、Flash Attention、Paged Attention）包裝成生產可用的開源伺服器的專案。這些技術和設計決策被 vLLM 和 SGLang 繼承並超越。

如果你今天要部署新的推論服務，不應該選 TGI。但如果你在維護既有的 TGI 部署、在讀推論引擎的文件、或想理解為什麼 vLLM 要那樣設計，TGI 是故事的起點。

## 參考資料

- [TGI GitHub 倉庫（歸檔）](https://github.com/huggingface/text-generation-inference) — 原始碼，2026-03-21 歸檔為唯讀
- [TGI 官方文件](https://huggingface.co/docs/text-generation-inference/index) — 安裝、設定、API 與模型支援
- [HuggingFace Blog: TGI Multi-Backend](https://huggingface.co/blog/tgi-multi-backend) — TGI 嘗試整合 vLLM/TRT-LLM 後端的技術細節
- [Flash Attention](https://github.com/Dao-AILab/flash-attention) — Dao et al. 的高效 attention 實作
- [vLLM: PagedAttention](https://arxiv.org/abs/2309.06180) — Kwon et al., TGI 後來整合的分頁 KV cache
- [本站：vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine) — 系列第 1 篇，PagedAttention 與 continuous batching
- [本站：SGLang 自架推論](/posts/tech/2026-08-22-sglang-inference-server) — 系列第 3 篇，RadixAttention 與共同前綴重用
