---
title: "Xinference：一個平台管 LLM、Embedding、語音與圖像模型的自架推論伺服器"
date: 2026-08-24
category: tech
type: deep-dive
tags: [xinference, llm-inference, self-hosting, vllm, sglang, model-serving, gpu, openai-api]
lang: zh-TW
tldr: "Xinference 把 vLLM、SGLang、llama.cpp、Transformers、MLX 五種後端包在同一個管理層，用 Web UI 和 OpenAI 相容 API 統一管理 LLM、embedding、rerank、語音和圖像模型，適合需要多類型模型共存的自架部署；但管理層的解析邏輯也讓攻擊面比純 serving engine 大（CVE-2026-61539 是案例）。"
description: "深入介紹 Xinference（Xorbits Inference）的架構設計：多後端引擎選擇、內建模型倉庫、supervisor-worker 分散式部署、API 相容層，以及和 vLLM、Ollama、Triton 的定位差異。"
series:
  name: "AI 時代的技術選擇"
  order: 128
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-24-xinference-model-platform-en)

[Xinference](https://inference.readthedocs.io/)（Xorbits Inference）是開源的模型推論管理平台，[GitHub 上約 9,500 stars](https://github.com/xorbitsai/inference)，Apache-2.0 授權。它的定位不是取代 vLLM 或 SGLang——而是把它們和 Transformers、llama.cpp、MLX 一起包在同一個管理層裡，用 Web UI、CLI 和 OpenAI 相容 API 統一管理 LLM、embedding、rerank、語音、圖像等不同類型的模型。

如果你讀過[自架推論伺服器選型指南](/posts/tech/2026-08-24-self-hosted-inference-server-guide)，Xinference 就是那篇三層架構裡「模型管理平台」這一層的代表之一。這篇深入它的設計、部署方式、邊界和安全考量。

## 核心設計：管理層，不是推論引擎

Xinference 自己不做推論計算。它的工作是：

1. 讓你從內建模型倉庫或自訂 registry 選一個模型
2. 自動選擇或由你指定一個後端引擎來跑這個模型
3. 用統一的 API 和 Web UI 管理模型的生命週期（啟動、監控、停止）

這和 [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) 的差異很根本：vLLM 是服務引擎，核心問題是「多個請求同時來時怎麼排程 KV cache」；Xinference 是管理平台，核心問題是「多種模型怎麼在同一個服務裡共存」。

## 五個後端引擎

從 v0.11.0 開始，啟動 LLM 時必須指定推論引擎。[官方文件](https://inference.readthedocs.io/en/latest/getting_started/using_xinference.html)的推薦邏輯：

- **Linux + NVIDIA GPU**：優先 [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) 或 [SGLang](/posts/tech/2026-08-22-sglang-inference-server)，吞吐量最好
- **Linux + 資源有限**：[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)，量化選項多
- **Mac（Apple Silicon）**：MLX 效能最好；次選 llama.cpp
- **其他情況**：Transformers，支援的模型最廣

安裝時用 pip extras 選擇後端：

```bash
pip install "xinference[vllm]"      # vLLM
pip install "xinference[sglang]"    # SGLang
pip install "xinference[llama_cpp]" # llama.cpp (xllamacpp)
pip install "xinference[mlx]"       # MLX
pip install "xinference[all]"       # 全裝（不含 SGLang，因依賴衝突）
```

注意 `[all]` 不包含 SGLang——[官方說明](https://inference.readthedocs.io/en/latest/getting_started/installation.html)指出 vLLM 和 SGLang 的套件依賴有衝突，需要分開安裝。llama.cpp 後端從 v1.6.0 起改用 Xinference 團隊自行開發的 [xllamacpp](https://github.com/xorbitsai/xllamacpp)，不再使用 `llama-cpp-python`。v3.0 起，啟用 per-model 虛擬環境後，xllamacpp 會自動偵測 CUDA 版本並選擇對應的 GPU wheel。

查詢某個模型支援哪些引擎和格式：

```bash
xinference engine -e http://localhost:9997 --model-name qwen2.5-instruct
xinference engine -e http://localhost:9997 --model-name qwen2.5-instruct --model-engine vllm
```

## 支援的模型類型

Xinference 和 [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 最大的差異在這裡。Ollama 專注 LLM（以及有限的多模態），Xinference 支援的模型類型更廣：

| 類型 | 用途 | 範例模型 |
|---|---|---|
| LLM | 文字生成、對話、工具呼叫 | Qwen2.5、Llama 3、DeepSeek-V3 |
| Embedding | 文字向量化（RAG 的 retrieval 階段） | bge-m3、e5-mistral |
| Rerank | 重排序（RAG 的 reranking 階段） | bge-reranker-v2-m3 |
| 語音 | 語音轉文字（STT）、文字轉語音（TTS） | Whisper、CosyVoice |
| 圖像 | 文生圖、圖生圖 | Stable Diffusion、FLUX |
| 多模態 | 圖文理解 | Qwen-VL、LLaVA |

這意味著你可以在同一個 Xinference 實例上同時跑 RAG pipeline 的 embedding + rerank + LLM，不用為每種模型各搭一套服務。

## 內建模型倉庫

Xinference 內建了[模型倉庫](https://inference.readthedocs.io/en/latest/models/builtin/)，涵蓋主流開源模型。在 Web UI 上可以瀏覽、搜尋、點選啟動，不需要手動下載模型檔案或轉換格式。第一次啟動模型時，Xinference 會自動從 HuggingFace（或 ModelScope，透過環境變數 `XINFERENCE_MODEL_SRC=modelscope` 切換）下載並快取。

也支援[自訂模型](https://inference.readthedocs.io/en/latest/models/custom.html)：自行指定模型權重路徑和設定，把不在內建倉庫裡的模型註冊進 Xinference。

## 分散式部署：supervisor-worker

單機部署只需要一行：

```bash
xinference-local --host 0.0.0.0 --port 9997
```

多機部署用 supervisor-worker 架構。Supervisor 負責接收請求和排程，worker 跨機器分配 GPU 資源：

```bash
# 機器 A：啟動 supervisor
xinference-supervisor -H 0.0.0.0

# 機器 B、C：啟動 worker，連到 supervisor
xinference-worker -e "http://<supervisor_ip>:9997" -H 0.0.0.0
```

Worker 啟動後自動向 supervisor 註冊，supervisor 根據各 worker 的可用資源分配模型。這比 vLLM 的 tensor parallelism（切分單一模型跨 GPU）解決的是不同層級的問題：Xinference 的分散式是「不同模型放在不同機器」，不是「一個大模型切成多份」——後者由底層的 vLLM 或 SGLang 後端自己處理。

## API 相容層

Xinference 提供 OpenAI 相容 API，可以用 OpenAI 的 Python SDK 直接連：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:9997/v1", api_key="not used")
response = client.chat.completions.create(
    model="qwen2.5-instruct",
    messages=[{"role": "user", "content": "Hello"}]
)
```

支援的 OpenAI API 端點包括 Chat Completions、Completions、Embeddings、Images 等。也支援 [Function Calling](https://inference.readthedocs.io/en/latest/models/model_abilities/tools.html)（工具呼叫），以及和 LangChain、LlamaIndex、Dify 的整合。

v3.0.0（2026 年 7 月）新增了 MCP server 支援，讓 Xinference 可以作為 MCP 工具被 Agent 框架呼叫。

## 和同類工具的定位差異

### vs Ollama

[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 和 Xinference 都是管理平台，但目標使用者不同。Ollama 追求的是「三分鐘在本機跑起一個 LLM」，介面是 CLI，預設綁定 localhost，沒有 Web UI（第三方有），模型類型以 LLM 和基本多模態為主。Xinference 追求的是「一個平台管理所有模型類型」，有 Web UI、支援多後端引擎切換、支援分散式部署。

選 Ollama 的理由：個人開發、只需要跑 LLM、不想裝 Python 環境。
選 Xinference 的理由：需要同時管理 embedding + rerank + LLM + 語音、需要 Web UI 給非工程師操作、需要多機部署。

### vs vLLM / SGLang

[vLLM](/posts/ai/2026-03-14-vllm-inference-engine) 和 [SGLang](/posts/tech/2026-08-22-sglang-inference-server) 是服務引擎——它們是 Xinference 的「內臟」而不是競爭者。你可以用 Xinference 啟動一個模型、指定 vLLM 作為後端，此時實際的推論排程（PagedAttention、continuous batching）都是 vLLM 在做。

如果你只需要跑一個 LLM，直接用 vLLM 或 SGLang 比透過 Xinference 多一層抽象更簡單。Xinference 的價值在於當你需要管理多個不同類型的模型時，它省下的是「為每種模型各搭一套 API server」的工作量。

### vs Triton Inference Server

[Triton](/posts/tech/2026-08-22-triton-inference-server) 和 Xinference 都做「多模型管理」，但抽象層不同。Triton 更底層：你要自己準備模型檔案、寫 config.pbtxt、定義 ensemble DAG。Xinference 更高層：內建模型倉庫、Web UI 點選啟動、自動處理格式轉換。

選 Triton 的理由：已有 GPU 平台維運能力、模型格式多樣（ONNX、TensorRT、PyTorch）、需要 ensemble pipeline。
選 Xinference 的理由：希望快速上手、主要跑開源 LLM 和 embedding、團隊沒有 Triton 經驗。

## 安全考量

Xinference 的安全邊界比純服務引擎更需要注意，因為管理層有更多解析邏輯。

**預設不開身份驗證**。和 vLLM 一樣，`xinference-local` 啟動後 API endpoint 預設對外可達且不需要身份驗證。如果部署在內部網路或公網上，任何能連上的人都能啟動模型、呼叫推論、甚至停止正在運行的模型。部署時要在前面放反向代理，加上 TLS 和身份驗證。

**模型輸出解析是攻擊面**。[CVE-2026-61539](/posts/daily/2026-08-24-security-xinference-eval-injection-rce)（CVSS 10.0）就是管理層特有的問題：Xinference 在解析 Llama3 工具呼叫輸出時，對模型產生的字串呼叫 `eval(model_output, {}, {})`。攻擊者透過 prompt injection 讓模型吐出惡意 Python 表達式，就能在伺服器行程裡執行任意指令。已在 2.7.0 修補，官方用 `json.loads()` 和 `ast.literal_eval()` 取代 `eval()`。

這個漏洞不是 vLLM 或 SGLang 的問題——它們只負責推論排程，不做工具呼叫輸出解析。**管理平台因為在推論結果和使用者之間多了一層後處理，每一條解析路徑都是潛在的攻擊面**。部署 Xinference 或任何類似平台時：

- 版本追蹤：`pip show xinference` 確認版本，< 2.7.0 立即升級
- 網路隔離：推論 API endpoint 不要直接暴露到公網
- 最小權限：推論伺服器行程用低權限身份執行，容器化部署限制檔案系統和網路存取

## 適合什麼團隊

**適合**：需要在同一個平台上管理 LLM + embedding + rerank + 語音 + 圖像，希望有 Web UI 讓 PM 或研究員自行試用模型，或是需要在不同硬體（NVIDIA GPU、Mac、CPU）上靈活切換後端引擎的團隊。

**不適合**：只跑一個 LLM 生產服務（直接用 vLLM 更簡單）；需要非 LLM 模型的複雜 pipeline 和 ensemble（Triton 的 DAG 更適合）；只在自己電腦上試用（Ollama 三分鐘就好）。

和所有管理平台一樣，先確認你真的需要這一層抽象。如果你不確定，從 vLLM 或 Ollama 開始，碰到「管理多個模型很麻煩」的問題時再考慮 Xinference。

## 參考資料

- [Xinference 官方文件](https://inference.readthedocs.io/)
- [Xinference GitHub（Apache-2.0）](https://github.com/xorbitsai/inference)
- [Xinference Installation Guide](https://inference.readthedocs.io/en/latest/getting_started/installation.html)
- [Xinference Backends](https://inference.readthedocs.io/en/latest/user_guide/backends.html)
- [Xinference Built-in Models](https://inference.readthedocs.io/en/latest/models/builtin/)
- [xllamacpp — Xinference 團隊的 llama.cpp Python binding](https://github.com/xorbitsai/xllamacpp)
- [CVE-2026-61539 — Remote code execution via unsafe eval() in Llama3 tool-call parsing](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m)
- 站內相關：[自架推論伺服器選型指南](/posts/tech/2026-08-24-self-hosted-inference-server-guide)、[vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)、[SGLang](/posts/tech/2026-08-22-sglang-inference-server)、[Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server)、[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)、[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)、[Xinference CVE-2026-61539 資安警報](/posts/daily/2026-08-24-security-xinference-eval-injection-rce)
