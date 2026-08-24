---
title: "自架推論伺服器怎麼選：從 Ollama 到 Xinference，六套工具的定位與取捨"
date: 2026-08-24
category: tech
type: guide
tags: [llm-inference, self-hosting, vllm, sglang, ollama, xinference, triton-inference-server, ray-serve, gpu]
lang: zh-TW
tldr: "自架推論伺服器分三層：執行引擎（llama.cpp）、服務引擎（vLLM、SGLang）、模型管理平台（Ollama、Xinference、Triton）。選對層級比選對工具重要——先問你的瓶頸在排程還是在部署流程，再決定複雜度放在哪裡。"
description: "從三層架構拆解 llama.cpp、Ollama、vLLM、SGLang、Triton Inference Server、Ray Serve 與 Xinference，幫你在自架推論伺服器時快速定位需求、避開常見選錯層級的錯誤。"
series:
  name: "AI 時代的技術選擇"
  order: 127
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en)

本站已經寫了 [vLLM](/posts/ai/2026-03-14-vllm-inference-engine)、[SGLang](/posts/tech/2026-08-22-sglang-inference-server)、[Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server)、[Ray Serve](/posts/tech/2026-08-22-ray-serve-inference)、[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)、[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) 等推論工具的單篇深入介紹。這篇不重複各工具細節，而是把它們放進同一張架構圖，讓你在選型時快速定位：你的問題出在哪一層，就該從哪一層開始挑。

## 三層架構：執行、服務、管理

自架推論伺服器的工具大致落在三層。有些只做其中一層，有些跨兩層甚至三層：

```
┌─────────────────────────────────────────────────────────┐
│  模型管理平台                                            │
│  Ollama ╱ LM Studio ╱ Xinference ╱ Triton               │
│  ─ 模型下載、版本、API 路由、多模型並存、Web UI          │
├─────────────────────────────────────────────────────────┤
│  服務引擎（Serving Engine）                              │
│  vLLM ╱ SGLang ╱ Ray Serve                              │
│  ─ continuous batching、KV cache 管理、排程              │
├─────────────────────────────────────────────────────────┤
│  執行引擎（Execution Engine）                            │
│  llama.cpp ╱ Transformers ╱ TensorRT-LLM ╱ ONNX Runtime │
│  ─ 模型格式、量化、硬體 kernel                           │
└─────────────────────────────────────────────────────────┘
```

**執行引擎**負責「把模型載進記憶體、跑一次 forward pass」。llama.cpp 把 GGUF 量化模型跑在 CPU 或 Apple Silicon 上；TensorRT-LLM 把模型編譯成 NVIDIA GPU 最佳化的 kernel。這一層決定的是單次推論的速度與硬體相容性。

**服務引擎**負責「多個請求同時進來時怎麼排程」。vLLM 用 [PagedAttention](https://arxiv.org/abs/2309.06180) 把 KV cache 切成非連續區塊管理、用 continuous batching 讓不同長度的請求不必互等；SGLang 用 [RadixAttention](https://arxiv.org/abs/2312.07104) 在多輪對話間共享 prefix cache。這一層決定的是吞吐量、延遲與 GPU 記憶體利用率。[CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference) 對 prefill/decode 的拆解與 batching 的取捨有完整的理論推導。

**模型管理平台**負責「模型從哪裡來、怎麼部署、API 長什麼樣」。Ollama 包了 llama.cpp 加上模型倉庫和 CLI；Xinference 整合 vLLM、Transformers、llama.cpp 等多個後端，提供 Web UI 和 OpenAI 相容 API；Triton 用 model repository 管理多種格式的模型。這一層決定的是部署流程、模型生命週期與團隊協作的複雜度。

多數選型的錯誤不是「選錯工具」，而是「選錯層級」——吞吐量不夠的問題丟給管理平台解決，或反過來，只是想跑一個模型試用卻架了完整的 Triton。

## 六套工具的定位

### llama.cpp — 執行引擎

[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) 是用 C/C++ 寫的 LLM 推論引擎，支援 CPU、Apple Silicon（Metal）、NVIDIA（CUDA）與 AMD（ROCm），用 [GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) 格式做量化。它是 Ollama 的核心、也是 Xinference 的可選後端之一。

適合場景：本機開發測試、沒有 NVIDIA GPU 的環境（Mac、AMD、純 CPU）、嵌入式部署。如果你的硬體不是 NVIDIA 的，多數時候會從這裡開始。

不適合場景：高併發生產服務。llama.cpp 內建的 HTTP server 支援基本的 batching，但沒有 PagedAttention 或 continuous batching 等 LLM 專屬排程——吞吐量瓶頸會比 vLLM 或 SGLang 更早碰到。

### Ollama — 管理平台 + 執行引擎

[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 把 llama.cpp 包進 Docker 風格的 CLI 和模型倉庫：`ollama pull llama3` 就能下載模型，`ollama run` 啟動互動對話，背後自動處理量化格式和 GPU 偵測。

適合場景：個人開發、原型驗證、只需要 `localhost` 上跑一兩個模型的情境。它的價值在於「三分鐘內從零到一個能用的本地 LLM」。

同一層級的替代選項是 [LM Studio](https://lmstudio.ai/)——同樣底層用 llama.cpp，但提供桌面 GUI 和內建的 OpenAI 相容 local server。偏好圖形介面、或想在 GUI 裡直接切換模型和調參數的人會選它。

不適合場景：多人共用的推論服務。Ollama 和 LM Studio 的排程都是單一行程等級的，沒有 KV cache paging、沒有分散式部署，GPU 記憶體管理依賴 llama.cpp 的基本配置。當你開始需要「同時服務十個人、每秒處理五個請求」，就該往服務引擎移動。

### vLLM — 服務引擎

[vLLM](/posts/ai/2026-03-14-vllm-inference-engine) 是目前最廣泛使用的 LLM 服務引擎。核心貢獻是 [PagedAttention](https://arxiv.org/abs/2309.06180)，把 KV cache 從連續配置改成分頁管理，搭配 continuous batching，讓 GPU 記憶體利用率和吞吐量顯著提升。提供 OpenAI 相容 API，支援 tensor parallelism 跨多 GPU。

適合場景：以 NVIDIA GPU 為主的 LLM 生產服務。你有一到多張 GPU、需要穩定的 throughput 和延遲控制、模型格式是 Hugging Face 標準的 Transformers checkpoint。[vLLM 自架推論決策](/posts/ai/2026-08-21-vllm-self-host-decision)那篇有更完整的成本與硬體選型分析。

不適合場景：非 LLM 模型（影像分類、語音辨識）——vLLM 的排程和 cache 機制是為 autoregressive text generation 設計的。沒有 NVIDIA GPU 的環境也不是它的主場。

### SGLang — 服務引擎

[SGLang](/posts/tech/2026-08-22-sglang-inference-server) 和 vLLM 定位相近，核心差異在排程策略：[RadixAttention](https://arxiv.org/abs/2312.07104) 用 radix tree 管理 KV cache，讓多輪對話、多次取樣、結構化輸出這類有共享 prefix 的場景省下重複計算。

適合場景：多輪對話或同一 prompt 多次取樣（如 agent 的 tool-use loop、批次生成）、需要受限解碼（JSON mode、正規表達式約束）的場景。當你的工作負載有大量 prefix 重複時，RadixAttention 的效益比 PagedAttention 更明顯。

不適合場景：和 vLLM 一樣，只做 LLM text generation。生態系統較 vLLM 年輕，部分整合（如監控、分散式部署文件）不如 vLLM 完整。

### Triton Inference Server — 管理平台

[NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server) 用統一的 HTTP/gRPC 介面服務 TensorRT、ONNX、PyTorch、Python 等多種後端。它的核心能力是 model repository（模型版本管理）、動態批次、instance group 和 ensemble（把多模型串成 DAG）。

適合場景：異質模型的統一平台。當你的產品是影像分類 + embedding + 排序 + LLM 的組合，需要一個伺服器同時管理不同格式的模型、統一監控和批次策略。

不適合場景：只有 LLM 的部署。Triton 的動態批次不是為 autoregressive generation 設計的——它沒有 KV cache paging，LLM 場景下的吞吐量不如 vLLM 或 SGLang。用 Triton 跑純 LLM 服務，會花大量精力在 config.pbtxt 和 ensemble 設定上，卻得不到 LLM 專屬排程的效益。

### Ray Serve — 編排層

[Ray Serve](/posts/tech/2026-08-22-ray-serve-inference) 嚴格說不是推論引擎，而是基於 Ray 的模型服務框架。它處理的是「多個模型或服務之間的路由、自動擴縮、A/B testing」。

適合場景：推論流程跨越多個模型和前後處理步驟、需要動態擴縮 replicas、或要和 Ray Train/Ray Data 等 Ray 生態整合的團隊。大規模的 RL rollout 和訓練-推論混合部署也是它的強項。

不適合場景：只跑單一模型。Ray 的學習曲線和維運成本不低——叢集管理、actor 生命週期、序列化都需要團隊有 Ray 經驗。如果你的需求是「一個模型、一個 API endpoint」，vLLM 或 SGLang 直接起就好。

### Xinference — 管理平台

[Xinference](https://inference.readthedocs.io/)（Xorbits Inference）是開源模型管理平台，定位在管理平台這一層。它和 Ollama 最大的差異是支援的模型類型更廣——不只 LLM，還有 embedding、rerank、語音（Whisper、CosyVoice）、圖像生成（Stable Diffusion）——並且可以選擇 vLLM、SGLang、llama.cpp、Transformers、MLX 作為 LLM 後端，不鎖死在單一引擎上。

主要特性：

- **模型市集**：[內建模型倉庫](https://inference.readthedocs.io/en/latest/models/builtin/)，Web UI 上點選即可下載部署，不需要手動處理模型格式轉換
- **多後端切換**：同一個 LLM 可以用 vLLM 跑在 NVIDIA GPU 上，也可以切換到 llama.cpp 跑在 Mac 上
- **分散式部署**：supervisor-worker 架構，worker 可以跨機器分配 GPU 資源
- **API 相容**：提供 OpenAI 與 Anthropic 相容 API，也支援 embedding、reranking、語音、圖像生成等端點
- **v3.0.0**（2026 年 7 月）新增了 MCP server 支援

適合場景：需要在同一個平台上同時管理 LLM、embedding、rerank、語音等多類型模型，且希望有 Web UI 給非工程師操作的團隊。它替團隊省下的是「為每種模型各搭一套服務」的工作量。

不適合場景：如果你只需要跑一個 LLM，直接用 vLLM 或 SGLang 更簡單。Xinference 的價值在多模型管理，單模型場景它多出的抽象層只是增加除錯路徑。

**安全提醒**：這類管理平台因為有更多解析邏輯（工具呼叫解析、模型輸出後處理），攻擊面比純服務引擎大。[CVE-2026-61539](/posts/daily/2026-08-24-security-xinference-eval-injection-rce) 就是一個案例——Xinference 在解析 Llama3 工具呼叫輸出時用了 `eval(model_output)`，導致 CVSS 10.0 的未認證 RCE。已在 2.7.0 修補，但這提醒我們：管理平台層級越高、解析路徑越多，越要把模型輸出當成不可信輸入處理。

## 怎麼選：從問題出發

不要從工具出發，從你的問題出發：

**「我想在自己電腦上試用開源模型」**
→ [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)。三分鐘內完成。偏好圖形介面的話，[LM Studio](https://lmstudio.ai/) 提供桌面 GUI 和 OpenAI 相容 local server，底層同樣是 llama.cpp。如果想要更細的量化控制或非標準硬體，考慮 [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)。硬體規格可參考 [AI 硬體選購指南](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)。

**「我要把一個 LLM 部署成生產服務」**
→ [vLLM](/posts/ai/2026-03-14-vllm-inference-engine)。如果你的場景有大量 prefix 重複（多輪對話、agent loop），評估 [SGLang](/posts/tech/2026-08-22-sglang-inference-server)。兩者都提供 OpenAI 相容 API，切換成本低。

**「我要同時服務 LLM、embedding、語音模型」**
→ Xinference 或 [Triton](/posts/tech/2026-08-22-triton-inference-server)。差異在：Xinference 有 Web UI 和內建模型倉庫，上手快；Triton 是更底層的模型伺服器，適合已有 GPU 平台維運能力的團隊。

**「我要在多模型之間做路由、擴縮、A/B test」**
→ [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference)。它不是推論引擎，是編排層——通常搭配 vLLM 或 SGLang 作為實際的推論後端。

**「我不確定該選什麼」**
→ 從 Ollama 或 vLLM 開始。Ollama 用來驗證模型能力（這個模型回答品質夠不夠），vLLM 用來驗證服務能力（延遲和吞吐量是否滿足需求）。碰到瓶頸再往上找。

## 常見選型錯誤

**一開始就挑管理平台**。你還不確定要跑哪個模型、不知道吞吐量需求，就先架了 Xinference 或 Triton。結果花了兩天調設定，最後發現模型品質不符合需求。先用 Ollama 或 vLLM 驗證模型和服務需求，確定了再往上包。

**只比 tokens/s**。[CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference) 講得很清楚：tokens/s（throughput）只是三個指標之一，TTFT（首 token 延遲）和 inter-token latency（生成速度）代表不同的產品體驗。互動聊天在意 TTFT 和 latency，離線批次在意 throughput。同一套工具在不同 batch size 下，三個指標的取捨完全不同。

**用管理平台解決排程問題**。「vLLM 的吞吐量不夠，換 Xinference 試試」——Xinference 的 LLM 後端就是 vLLM，套了一層管理介面不會讓推論變快。排程問題要在服務引擎層解決：調 batch size、換 GPU、增加 tensor parallelism，或評估 SGLang 的 prefix caching 是否對你的工作負載有幫助。

**忽略安全**。推論伺服器預設通常不開身份驗證。Ollama 綁定 localhost 所以影響有限，但 vLLM、SGLang、Xinference 的 API endpoint 如果暴露在內部網路或公網上，任何能連上的人都能呼叫。部署時把 TLS、身份驗證和 request body 限制放在反向代理或 service mesh 層。

## 學習路徑

如果你是第一次接觸自架推論，這是本站建議的閱讀順序：

1. [CS336 Lecture 10 — LLM 推論導讀](/posts/ai/2026-08-22-cs336-inference)：理解 prefill/decode、KV cache、量化、speculative decoding、continuous batching 的原理
2. [AI 硬體選購指南](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)：確認你的硬體能跑什麼規模的模型
3. [Ollama 本機 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide) 或 [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)：在自己電腦上跑起來
4. [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine) 和 [vLLM 自架推論決策](/posts/ai/2026-08-21-vllm-self-host-decision)：準備生產部署時的服務引擎
5. [SGLang](/posts/tech/2026-08-22-sglang-inference-server)、[Triton](/posts/tech/2026-08-22-triton-inference-server)、[Ray Serve](/posts/tech/2026-08-22-ray-serve-inference)：特定需求時的進階選項

安全層面，[Xinference CVE-2026-61539 分析](/posts/daily/2026-08-24-security-xinference-eval-injection-rce)可以當案例讀——它示範了「模型輸出被當成可信輸入」在推論伺服器上會造成什麼後果。

## 參考資料

- [vLLM and PagedAttention — Efficient Memory Management for Large Language Model Serving](https://arxiv.org/abs/2309.06180)
- [SGLang — Efficiently Executing Structured Language Model Programs](https://arxiv.org/abs/2312.07104)
- [Xinference 官方文件](https://inference.readthedocs.io/)
- [Xinference GitHub](https://github.com/xorbitsai/inference)
- [NVIDIA Triton Inference Server User Guide](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/)
- [CS336 Spring 2026 Lecture 10 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py)
- [LM Studio](https://lmstudio.ai/)
- 站內系列：[vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)、[vLLM 自架推論決策](/posts/ai/2026-08-21-vllm-self-host-decision)、[SGLang](/posts/tech/2026-08-22-sglang-inference-server)、[Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server)、[Ray Serve](/posts/tech/2026-08-22-ray-serve-inference)、[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)、[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)、[AI 硬體選購指南](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)
