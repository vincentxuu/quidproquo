---
title: "vLLM — 從 PagedAttention 到生產級 LLM 推論引擎"
date: 2026-03-14
category: ai
tags: [vllm, llm-inference, pagedattention, model-serving, gpu]
lang: zh-TW
tldr: "vLLM 用 PagedAttention 解決 KV cache 記憶體浪費問題，搭配 continuous batching 和 prefix caching，成為目前最主流的開源 LLM 推論引擎。"
description: "介紹 vLLM 的核心技術（PagedAttention、continuous batching、prefix caching）、與其他推論引擎的比較、基本使用方式，以及 2026 年的最新發展。"
draft: false
---

vLLM 是目前最主流的開源 LLM 推論引擎。它解決的核心問題很明確：**讓 GPU 在服務 LLM 時不要浪費記憶體和算力**。這篇會介紹它的關鍵技術、跟其他方案的比較、怎麼用，以及 2026 年的最新進展。

## PagedAttention：作業系統的老把戲

vLLM 最核心的創新是 **PagedAttention**，靈感來自作業系統的虛擬記憶體分頁機制。

傳統 LLM serving 會為每個 request 的 KV cache 分配一整段連續 GPU 記憶體。問題是：你不知道 response 會多長，只能預先分配最大長度。結果就是 60-80% 的記憶體被浪費在 fragmentation 上。

PagedAttention 的做法：

- 把 KV cache 切成固定大小的 **block**（預設 16 tokens/block）
- 每個 request 維護一張 **block table**，把邏輯 block 對應到散落在 GPU 記憶體各處的實體位置
- 模型以為自己在讀連續記憶體，實際上是透過 block table 做間接定址

效果：記憶體浪費從 60-80% 降到 **4% 以下**。而且因為 block 可以共享，多個 request 如果有相同的 prefix（像 system prompt），只需要存一份。

```
Request A: [Block 1] → [Block 4] → [Block 7]
Request B: [Block 1] → [Block 3] → [Block 9]
                ↑
        共享同一個 system prompt block
```

## Continuous Batching：不等人的排程

傳統 static batching 要等一整批 request 都跑完才處理下一批。問題是：有的 request 生成 10 個 token 就結束，有的要生成 500 個，短的 request 只能乾等。

vLLM 用 **continuous batching**（也叫 iteration-level batching）：

- 每次 forward pass 都可以插入新 request
- 完成的 request 立刻移出 batch
- GPU 利用率維持接近 100%

這在高併發場景下效果特別明顯——不會因為一個長 request 卡住整個 batch。

## Prefix Caching：免費的快取

V1 引擎把 prefix caching **預設開啟且零額外開銷**。即使 cache hit rate 是 0%，throughput 下降不到 1%。

適合的場景：

- **多輪對話**：system prompt 只需要算一次
- **RAG 工作流**：重複的 context 直接命中快取
- **批次處理**：相同 prefix 的 request 共享計算結果

## 跟其他推論引擎比較

| | vLLM | SGLang | TensorRT-LLM | llama.cpp |
|---|---|---|---|---|
| 定位 | 生產級 GPU serving | 生產級 GPU serving | NVIDIA 極致效能 | 本地 / 邊緣 / CPU |
| 易用性 | 高 | 高 | 低（需手動調優） | 非常高 |
| 硬體支援 | NVIDIA, AMD, Intel, TPU | NVIDIA, AMD | 僅 NVIDIA | CPU, Apple Silicon, GPU |
| Throughput | 非常高 | 非常高 | 最高（NVIDIA 上） | 中等 |
| 社群 | 最大（74.7k stars） | 快速成長中 | 企業支持 | 非常大 |

幾個重點：

- **SGLang** 是 vLLM 目前最接近的競爭者。SGLang 的 RadixAttention 在多輪對話場景有 10-20% 優勢，但 vLLM V1 的 prefix caching 已經大幅縮小差距。
- **TensorRT-LLM** 在 NVIDIA 硬體上的單一 request 延遲最低，但設定複雜度高很多，而且只支援 NVIDIA。
- **Hugging Face TGI** 已在 2025 年 12 月進入維護模式，官方建議改用 vLLM 或 SGLang。
- **llama.cpp / Ollama** 適合本地開發；常見的 2026 pipeline 是 Ollama 開發、vLLM 上線。

## 基本使用方式

### 離線推論（Python API）

```python
from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct")

sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.8,
    max_tokens=512
)

outputs = llm.generate(
    ["Explain quantum computing in simple terms."],
    sampling_params
)

for output in outputs:
    print(output.outputs[0].text)
```

### OpenAI 相容 API Server

啟動 server：

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

用 OpenAI SDK 呼叫：

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:8000/v1",
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[
        {"role": "user", "content": "What is PagedAttention?"}
    ]
)
print(response.choices[0].message.content)
```

這是 vLLM 最殺的功能之一——你的程式碼幾乎不用改，把 `base_url` 換掉就能從 OpenAI 切到自架模型。

### 多 GPU 推論

```bash
vllm serve meta-llama/Llama-3.3-70B-Instruct --tensor-parallel-size 4
```

70B 模型跑 4 張 GPU，一行搞定。

## 2026 年的 vLLM

### V1 引擎（v0.8.0 起預設）

V1 是完整的架構重寫：

- **多進程架構**：scheduler 和 EngineCore 跑在獨立 process，tokenization / detokenization / server 各自獨立，完全非阻塞
- **統一排程**：移除 prefill / decode 的階段區分，所有 token 統一處理
- **Persistent batch**：input tensor 透過 NumPy 快取並增量更新，不再每次用 Python 重建

V1 在 Llama 3.1 8B 和 3.3 70B 上比 V0 **throughput 提升最高 1.7 倍**。

### Speculative Decoding

EAGLE speculative decoding 支援 CUDA graph、多 GPU、甚至多模態模型。團隊還推出了 [Speculators](https://github.com/vllm-project/speculators) 函式庫，統一 speculative decoding 演算法的建構、評估和儲存。

### 多模態支援

vLLM 已經不只是文字推論引擎。支援 LLaVA、Qwen-VL、DeepSeek-VL2、InternVL 等視覺語言模型，以及 Qwen3-ASR 等語音模型。多模態預處理從 GPU 分離出來，不影響推論效能。

### 結構化輸出

支援 JSON schema、regex、context-free grammar 約束生成，而且能跟 speculative decoding 搭配使用。

## 整體來說

vLLM 的核心取捨是：**用工程複雜度換取記憶體效率和吞吐量**。PagedAttention 增加了一層間接定址的開銷，但換來的記憶體利用率提升遠超過這個成本。

適合的場景：需要高併發、多用戶的 LLM 服務，特別是有 GPU 的生產環境。如果你只是本地跑個模型聊天，Ollama 更簡單；如果你在 NVIDIA 硬體上追求極致延遲且願意花時間調優，TensorRT-LLM 可能更快。但對大多數團隊來說，vLLM 是 2026 年自架 LLM 的預設選擇。

背景：vLLM 由 UC Berkeley Sky Computing Lab 的 Woosuk Kwon 等人在 2023 年創建，目前由 PyTorch Foundation 管理。團隊成立了 Inferact 公司，拿到 a16z 和 Lightspeed 領投的 1.5 億美元種子輪，估值 8 億美元。GitHub 上有 74,700+ stars、2,000+ contributors。

---

## 參考資料

- [Efficient Memory Management for Large Language Model Serving with PagedAttention (arXiv:2309.06180)](https://arxiv.org/abs/2309.06180)
- [vLLM 官方文件](https://docs.vllm.ai/en/latest/)
- [vLLM GitHub Repository](https://github.com/vllm-project/vllm)
- [vLLM V1 Alpha Release Blog](https://vllm.ai/blog/v1-alpha-release)
- [vLLM Performance Dashboard](https://docs.vllm.ai/en/latest/benchmarking/dashboard/)
- [Speculators Library](https://github.com/vllm-project/speculators)
- [LLM Inference Servers Compared — vLLM vs TGI vs SGLang vs Triton (PremAI, 2026)](https://blog.premai.io/llm-inference-servers-compared-vllm-vs-tgi-vs-sglang-vs-triton-2026/)
- [Ollama vs vLLM: Deep Dive Performance Benchmarking (Red Hat)](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking)
