---
title: "開源 LLM 自架指南：框架怎麼選、硬體怎麼算、什麼時候比 API 划算"
date: 2026-08-26
category: ai
type: guide
tags: [self-hosting, vllm, sglang, ollama, llama-cpp, gpu, quantization, llm-inference]
lang: zh-TW
tldr: "2026 年開源模型在 coding benchmark 追平閉源，但自架不只是選模型——vLLM 適合高併發生產服務、SGLang 在前綴重用場景快 29%、Ollama 是本地開發首選、llama.cpp 吃最少資源。A100 雲端租金約 $1.4-2.2/hr，自架損益兩平點大約在每月 100M tokens。"
description: "開源 LLM 自架完整決策指南：vLLM / SGLang / Ollama / llama.cpp 框架比較、GPU 硬體需求對照表、量化格式選擇、成本損益兩平分析，以及接入 agentic coding CLI 的實際做法。"
draft: false
glossary:
  - term: "PagedAttention"
    def: "vLLM 的核心機制，把 KV cache 當作業系統的分頁來管理，減少 GPU 記憶體浪費"
  - term: "RadixAttention"
    def: "SGLang 的核心機制，用 radix tree 快取共用前綴的 KV cache，多輪對話和 RAG 場景特別有效"
  - term: "GGUF"
    def: "llama.cpp 使用的量化模型格式，支援多種量化精度，讓大模型跑在消費級硬體上"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-open-source-llm-self-hosting-guide-en)

[Ornith 35B-A3B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 在 SWE-bench 拿 79.0、[MiniMax M2.5](/posts/tech/2026-08-26-minimax-model-family) 拿 80.2%——開源模型在 coding 任務上已經追平閉源。但「模型夠強」跟「我能跑起來」之間還有一段路：選什麼框架、需要什麼 GPU、量化到什麼程度、什麼時候自架比叫 API 划算。這篇是決策指南。

站上已有 [vLLM](/posts/ai/2026-08-21-vllm-self-host-decision)、[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)、[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) 的個別深入介紹，這篇不重複它們的內容，只做跨框架的選型比較和成本計算。

## 四個框架，四種用途

| 框架 | 設計目標 | 核心機制 | 適合 | 不適合 |
|---|---|---|---|---|
| [vLLM](https://github.com/vllm-project/vllm) | 高併發生產服務 | PagedAttention + continuous batching | 多使用者同時推論、API 服務 | 本地開發、消費級 GPU |
| [SGLang](https://github.com/sgl-project/sglang) | 前綴重用場景 | RadixAttention + radix tree 前綴快取 | 多輪對話、RAG、共用 system prompt | 獨立請求為主的批次 |
| [Ollama](https://ollama.com/) | 一行指令跑模型 | 封裝 llama.cpp + Docker 風格 CLI | 本地開發、快速試模型 | 高併發生產環境 |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | 最小資源跑模型 | 純 C++ + GGUF 量化 | 消費級 GPU、CPU、手機、嵌入式 | 多使用者服務（除非搭 server mode） |

### 怎麼選

依 [beri.net 的 2026 推論框架指南](https://www.beri.net/article/vllm-vs-tensorrt-llm-vs-sglang-inference-runtime-2026)，目前的共識是「預設 vLLM，前綴重的場景換 SGLang」：

- **獨立請求、高併發** → vLLM。社群最大（89K+ GitHub stars）、模型支援最廣、除錯資源最多
- **多輪對話、RAG、共用 system prompt** → SGLang。依 [PremAI 實測](https://gpuinsights.net/vllm-vs-sglang-vs-tensorrt-llm-2026)，前綴重用場景下 SGLang 達到每秒 16,200 tokens vs vLLM 的 12,500——快 29%。獨立請求差距收窄到 [1-4%](https://www.spheron.network/blog/llm-inference-optimization-2026)
- **本地開發、試模型** → Ollama。`ollama run ornith-1.5-9b` 一行搞定，自動下載、量化、起 server
- **極端資源限制（12GB GPU、純 CPU、手機）** → llama.cpp 或 Ollama（底層也是 llama.cpp）

## 硬體需求對照表

模型跑得動不代表跑得快。以下是主流開源模型的 **最低 GPU 記憶體需求**（FP16 全精度 vs Q4 量化）：

| 模型 | 總參數 | 啟用參數 | FP16 VRAM | Q4 VRAM | 最低硬體 |
|---|---|---|---|---|---|
| Ornith 1.5-9B | 9B | 9B | ~18 GB | ~6 GB | RTX 4060 (8GB) Q4 |
| Qwen3-14B | 14B | 14B | ~28 GB | ~9 GB | RTX 4090 (24GB) Q4 |
| Ornith 1.5-35B-A3B | 35B | ~3B | ~70 GB | ~22 GB | A100 40GB Q4 / RTX 4090 Q3 |
| DeepSeek-V4-Flash | 236B | ~21B | ~472 GB | ~140 GB | 2×A100 80GB Q4 |
| Ornith 1.5-397B | 397B | — | ~794 GB | ~240 GB | 4×H100 80GB Q4 |

**MoE 模型的陷阱**：Ornith 35B-A3B 每 token 只啟用 3B 參數（推論很快），但全部 35B 參數都要載入 VRAM（記憶體需求不變）。推論速度接近 3B 模型，但 GPU 記憶體需求接近 35B 模型。

## 量化格式怎麼選

| 格式 | 生態系 | 品質損失 | 記憶體節省 | 適用場景 |
|---|---|---|---|---|
| GGUF Q4_K_M | llama.cpp / Ollama | 小（~1-2% perplexity） | ~75% | 消費級 GPU 首選 |
| GGUF Q5_K_M | llama.cpp / Ollama | 極小 | ~69% | 品質敏感但仍需省記憶體 |
| AWQ (4-bit) | vLLM / SGLang | 小 | ~75% | 生產服務，vLLM 原生支援 |
| GPTQ (4-bit) | vLLM / SGLang | 小 | ~75% | 歷史最久，社群量化模型最多 |
| FP16 | 全部 | 無 | 0% | 不缺 VRAM 時的預設 |
| FP8 | vLLM / SGLang | 極小 | ~50% | H100/H200 原生支援，生產推薦 |

經驗法則：**先從 Q4_K_M（GGUF）或 AWQ 4-bit 開始**，跑 benchmark 發現品質不夠再升。多數 coding 任務在 4-bit 量化下品質損失可忽略。

## 成本損益兩平

自架的成本不只 GPU 租金——還有工程時間、運維、閒置浪費。

### 雲端 GPU 月租（2026 年 8 月）

| GPU | 按需價格 | 月租（24/7） | 來源 |
|---|---|---|---|
| RTX 4090 | ~$0.65/hr | ~$470 | [Hyperstack](https://www.hyperstack.cloud/blog/comparison/cloud-gpu-rental-platforms) |
| A100 80GB | ~$1.4-2.2/hr | ~$1,000-1,600 | [Thunder Compute](https://www.thundercompute.com/blog/nvidia-h100-pricing)、[CloudZero](https://www.cloudzero.com/blog/h100-gpu-cost) |
| H100 SXM | ~$2.2-3.5/hr | ~$1,600-2,500 | 同上 |

### API 成本對照（每百萬輸出 token）

| 服務 | 價格 |
|---|---|
| Claude Opus 5 | ~$75 |
| GPT-5 | ~$60 |
| DeepSeek V4 Flash API | ~$2.20 |
| MiniMax M2.5 API | ~$1.20 |
| 自架 A100（高使用率） | ~$0.70 |
| 自架 A100（10% 使用率） | ~$7.00 |

依站上 [vLLM 自架決策文](/posts/ai/2026-08-21-vllm-self-host-decision)的計算，關鍵變數是 **GPU 使用率**。使用率超過 50% 時，自架幾乎一定比 API 便宜；使用率低於 10%，自架比多數 API 都貴。

**損益兩平的經驗法則**：如果你每月穩定消耗 100M+ tokens 且能維持 GPU 使用率在 30% 以上，自架開始划算。低於這個量，用 API（尤其是 DeepSeek、MiniMax 這些低價 API）更經濟。

## 接入 Agentic Coding CLI

自架的模型只要提供 OpenAI 相容的 API 端點，就能接入主流 agentic coding 工具：

```bash
# vLLM 起 server
vllm serve ornith-ai/Ornith-1.5-35B-A3B --port 8000

# Claude Code 接入
export OPENAI_API_BASE=http://localhost:8000/v1
export OPENAI_API_KEY=EMPTY

# OpenCode 接入（~/.config/opencode/opencode.json）
{
  "provider": {
    "local": {
      "npm": "@ai-sdk/openai-compatible",
      "options": { "baseURL": "http://localhost:8000/v1" },
      "models": { "ornith-35b": { "name": "Ornith-1.5-35B-A3B" } }
    }
  }
}
```

vLLM 和 SGLang 都原生支援 tool calling（function calling），這是 agentic 場景的基本需求。Ollama 也支援，但效能較低。

## 要注意的事

1. **Context length ≠ 實際可用**：模型宣稱支援 128K context，但在消費級 GPU 上可能因為 KV cache 記憶體不足而只能用到 8-16K
2. **Tool calling 品質差異大**：開源模型的 tool calling 穩定度仍不如 Claude / GPT——Ornith 和 MiniMax 在這方面做得較好，但通用開源模型（Llama、Gemma）的 tool calling 容易出格式錯誤
3. **Batching 很關鍵**：單一請求的速度差距不大，但 vLLM 的 continuous batching 在多使用者場景能把吞吐量拉高數倍。本地開發不需要這個
4. **量化不是免費的**：coding 任務對精度相對不敏感，但推理任務（數學、邏輯）在 Q3 以下會明顯退化

## 參考資料

- [vLLM GitHub](https://github.com/vllm-project/vllm)
- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [Ollama 官網](https://ollama.com/)
- [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp)
- [vLLM vs SGLang vs TensorRT-LLM 2026 指南 — beri.net](https://www.beri.net/article/vllm-vs-tensorrt-llm-vs-sglang-inference-runtime-2026)
- [SGLang vs vLLM 前綴重用吞吐量實測 — GPU Insights](https://gpuinsights.net/vllm-vs-sglang-vs-tensorrt-llm-2026)
- [SGLang 3.8% 差距分析 — Spheron](https://www.spheron.network/blog/llm-inference-optimization-2026)
- [H100 / A100 雲端租金比價 — Thunder Compute](https://www.thundercompute.com/blog/nvidia-h100-pricing)
- [GPU 租金趨勢 — Hyperstack](https://www.hyperstack.cloud/blog/comparison/cloud-gpu-rental-platforms)
- [H100 vs A100 成本效率 — CloudZero](https://www.cloudzero.com/blog/h100-gpu-cost)
- [vLLM 自架決策指南 — 站內](/posts/ai/2026-08-21-vllm-self-host-decision)
- [Ollama 完整指南 — 站內](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [llama.cpp 推論引擎介紹 — 站內](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)
- [Ornith 模型家族 — 站內](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
- [MiniMax 模型家族 — 站內](/posts/tech/2026-08-26-minimax-model-family)
