---
title: "MLX 是什麼：Apple Silicon 上的陣列框架、mlx-lm 與跟 llama.cpp 怎麼選"
date: 2026-11-22
category: ai
type: deep-dive
tags: [mlx, apple-silicon, local-llm, llm-inference, quantization, hugging-face]
lang: zh-TW
tldr: "MLX 是 Apple 機器學習研究團隊開源（MIT）的陣列框架，截至 2026 年 11 月約 2.9 萬顆星、最新版 0.32.4。在 Mac 上跑 LLM 用的是上層的 mlx-lm：pip install mlx-lm 之後一行 mlx_lm.chat 就能聊，mlx-community 在 Hugging Face 上有約 5,800 個已轉好的模型。"
description: "介紹 Apple 的 MLX 框架：統一記憶體、惰性求值的設計、mlx-lm 的 generate / chat / server / convert 指令、mlx-community 模型與學習式量化，以及在 Mac 上什麼時候該選 MLX、什麼時候留在 llama.cpp / GGUF。"
draft: false
series:
  name: "本機跑模型"
  order: 1
glossary:
  - term: "統一記憶體"
    aliases: ["unified memory", "UMA"]
    definition: "Apple silicon 的 CPU 與 GPU 共用同一塊記憶體，資料不需要在兩者之間複製。"
    context: "MLX 的陣列直接放在統一記憶體裡，運算時才指定用 CPU 還是 GPU。"
    links:
      - label: "MLX docs: Unified Memory"
        url: "https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html"
  - term: "惰性求值"
    aliases: ["lazy evaluation", "lazy computation"]
    definition: "寫下運算時只記錄計算圖，等真正需要結果（呼叫 eval 或印出數值）才執行。"
    context: "MLX 靠惰性求值讓模型先建好結構、載入 fp16 權重時不必先配置一份 fp32。"
    links:
      - label: "MLX docs: Lazy Evaluation"
        url: "https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html"
  - term: "wired memory"
    aliases: ["固定記憶體", "iogpu.wired_limit_mb"]
    definition: "macOS 不會換出到 swap 的記憶體。GPU 能用的 wired 上限由系統參數 iogpu.wired_limit_mb 控制。"
    context: "模型接近整台機器的記憶體大小時，mlx-lm 會嘗試把權重 wire 住，上限不夠就會變慢。"
---

> :globe: [English version](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en)

用過 [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 或 [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) 的 Mac 使用者，大概都在 Hugging Face 上看過一堆名字結尾是 `-4bit`、放在 `mlx-community` 底下的模型，也聽過「Mac 上用 MLX 比較快」。這篇講清楚 [MLX](https://github.com/ml-explore/mlx) 到底是什麼、它跟 GGUF 那條路差在哪，以及今晚怎麼在自己的 Mac 上把一個模型跑起來。

這是「本機跑模型」系列第一篇。後面三篇看建在 MLX 之上的推論伺服器 [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server)，以及另起爐灶、用 C++ 和自寫 Metal kernel 的 [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)，最後一篇用四個熱門開放模型[對照各工具在 32GB Mac 上怎麼跑](/posts/ai/2026-11-22-run-open-models-on-32gb-mac)。

## MLX 是什麼

MLX 是 Apple 機器學習研究團隊開源的陣列框架，MIT 授權。README 第一句寫得很清楚：「MLX is an array framework for machine learning on Apple silicon」。它的定位比較像 NumPy 加上 PyTorch 的一部分，不是一個「跑模型的 App」：

- **Python API 貼著 NumPy**，另有 C++、[C](https://github.com/ml-explore/mlx-c)、[Swift](https://github.com/ml-explore/mlx-swift) 介面；`mlx.nn`、`mlx.optimizers` 的寫法貼著 PyTorch
- **可組合的函式轉換**：自動微分、自動向量化、計算圖最佳化
- **動態建圖**：輸入形狀改變不會觸發緩慢的重新編譯
- **多裝置**：目前支援 CPU 與 GPU；macOS 以外還有 Linux 的 CUDA 後端與純 CPU 版本

截至 2026 年 11 月，[ml-explore/mlx](https://github.com/ml-explore/mlx) 有約 2.9 萬顆星，最新版是 10 月中發佈的 [v0.32.4](https://pypi.org/project/mlx/)。

真正讓 Mac 使用者跑 LLM 的是建在它上面的 [mlx-lm](https://github.com/ml-explore/mlx-lm)（約 7,700 顆星，最新 v0.32.2）。整個生態大概長這樣：

```text
 mlx_lm CLI / Python     LM Studio          Ollama 0.19+
                         (mlx-engine)       (自家 MLX 引擎)
        │                     │                  │
        └──── mlx-lm（文字）／mlx-vlm（視覺）      │
                       │                         │
                       └────────── MLX ──────────┘
                                    │
                            Metal GPU ／ CPU
                                    │
                         Apple silicon 統一記憶體
```

模型權重則來自 Hugging Face 的 [mlx-community](https://huggingface.co/mlx-community) 組織，截至本文撰寫時該組織列出約 5,866 個模型，其中很多是同一個模型的 4-bit、6-bit、8-bit 等不同量化版本。

## 兩個設計：統一記憶體與惰性求值

### 統一記憶體：陣列不用「搬到 GPU」

PyTorch 的習慣是 `tensor.to("cuda")`，資料要先搬到裝置上。Apple silicon 的 CPU 與 GPU 本來就共用同一塊記憶體，MLX 把這件事做成程式設計模型：[官方文件](https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html)說建立陣列時不指定位置，而是在**執行運算時**指定裝置：

```python
import mlx.core as mx

a = mx.random.normal((100,))
b = mx.random.normal((100,))

mx.add(a, b, stream=mx.cpu)  # 同一份 a、b
mx.add(a, b, stream=mx.gpu)  # 不用複製就能給 GPU 用
```

兩個運算之間有相依時，排程器會自動插入同步。文件裡的例子是把大矩陣乘法丟 GPU、一串小運算丟 CPU，在 M1 Max 上從全 GPU 的 2.8 毫秒降到約 1.4 毫秒。

這裡要分清楚增量：**統一記憶體是硬體特性**，llama.cpp 的 Metal 後端一樣吃得到「不用經過 PCIe 複製」的好處。MLX 多做的是讓你寫程式時不用管資料在哪，CPU、GPU 可以拿同一份陣列交錯工作。

### 惰性求值：寫下運算不等於執行

在 MLX 裡寫 `c = a + b`，[不會馬上算](https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html)，只會記錄一張計算圖，直到呼叫 `mx.eval()` 或需要印出數值才執行。對跑 LLM 的人最有感的好處是記憶體：

```python
model = Model()                                # 還沒配置任何記憶體
model.load_weights("weights_fp16.safetensors") # 直接以 fp16 落地
```

如果是立即執行，`Model()` 會先用 fp32 初始化全部權重，再被 fp16 覆蓋；惰性求值下峰值記憶體只有一半。代價是自己寫訓練迴圈時要想清楚何時 `eval`：每一步都 eval 會被固定開銷拖慢，圖累積太大又吃記憶體。只用 mlx-lm 跑推論的話，這些它都幫你處理掉了。

## 今晚就跑：mlx-lm 五個指令

**前置條件**（依 [MLX 安裝文件](https://ml-explore.github.io/mlx/build/html/install.html) 與 PyPI）：Apple silicon Mac、macOS 14 以上、**原生 arm64 的** Python。MLX 本身要 Python 3.10+，mlx-lm 要 3.11+。最常見的坑是用到 Rosetta 跑的 x86 Python，pip 會說找不到相符的版本。先確認：

```bash
python3 -c "import platform; print(platform.processor())"   # 要印出 arm
```

### 1. 安裝

```bash
python3 -m venv ~/.venvs/mlx && source ~/.venvs/mlx/bin/activate
pip install mlx-lm
```

不想管 venv 的話，Homebrew 也有包好的版本：`brew install mlx-lm`（目前同樣是 0.32.2）。

### 2. 聊天

```bash
mlx_lm.chat
```

不帶參數時預設下載 `mlx-community/Llama-3.2-3B-Instruct-4bit`，一個 3B 的 4-bit 小模型，適合先確認環境能動。想換模型就加 `--model`：

```bash
mlx_lm.chat --model mlx-community/Qwen3-4B-Instruct-2507-4bit
```

模型會下載到 Hugging Face 的快取目錄（`~/.cache/huggingface/hub`），跟 `transformers` 共用。

### 3. 單次生成

```bash
mlx_lm.generate --model mlx-community/Qwen3-4B-Instruct-2507-4bit \
  --prompt "用三句話解釋什麼是統一記憶體" --max-tokens 256
```

結束時會印出 prompt 與生成的 tokens-per-sec 和峰值記憶體，這就是你這台機器的實測數字。

### 4. 開成 OpenAI 相容 API

```bash
mlx_lm.server --model mlx-community/Qwen3-4B-Instruct-2507-4bit
```

依 [SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)，預設聽 `127.0.0.1:8080`，提供 `/v1/chat/completions`、`/v1/completions`、`/v1/models`：

```bash
curl localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say this is a test!"}],"temperature":0.7}'
```

任何吃 OpenAI base URL 的工具（編輯器外掛、agent 框架）把 base URL 設成 `http://localhost:8080/v1` 就能接。伺服器會把可批次的請求併在一起解碼，預設同時解碼 32 個、同時處理 8 個 prompt（`--decode-concurrency`、`--prompt-concurrency`）。但官方文件明講它「not recommended for production as it only implements basic security checks」，別直接開在公開網路上。需要更完整的服務層，就是系列下一篇 [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server) 要處理的事。

### 5. 管理磁碟

模型一個動輒好幾 GB，試完記得清：

```bash
mlx_lm.manage --scan                                   # 列出已下載的模型
mlx_lm.manage --delete --pattern mlx-community/Llama-3.2-3B-Instruct-4bit
```

### 大模型會變慢：wired memory 上限

模型大小接近機器總記憶體時，mlx-lm 會在 macOS 15 以上嘗試把模型與快取的記憶體 wire 住。如果看到 `[WARNING] Generating with a model that requires ...`，README 的建議是調高系統上限，N 要大於模型的 MB 數、小於整台機器的記憶體：

```bash
sudo sysctl iogpu.wired_limit_mb=N
```

設太高會讓 macOS 和其他程式沒記憶體可用，N 不要貼著整台機器的上限設。

## 量化：從 `-q` 到學習式量化

如果想要的模型在 mlx-community 上還沒有現成版本，可以自己轉。最簡單的是一行 4-bit 量化：

```bash
mlx_lm.convert --model mistralai/Mistral-7B-Instruct-v0.3 -q
```

輸出放在 `mlx_model/`，格式是 safetensors 加上設定檔，不是 GGUF。加 `--upload-repo` 可以直接推上 Hugging Face。不想在本機轉的話，mlx-community 也有一個 [mlx-my-repo](https://huggingface.co/spaces/mlx-community/mlx-my-repo) Space 可以線上轉。

量化會掉多少品質？mlx-lm 的 [BENCHMARKS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/BENCHMARKS.md) 有一組官方數字，測的是 Qwen3-4B-Instruct-2507、機器是 64 GB 的 M4 Max。重點是 4-bit 用不到原本四成的記憶體，生成速度約為 2.6 倍，MMLU Pro 掉了約 3 分：

| 精度 | MMLU Pro | 生成 tok/s | 記憶體 |
|---|---|---|---|
| bf16 | 64.05 | 52.47 | 9.02 GB |
| 8-bit | 63.85 | 86.91 | 5.25 GB |
| 4-bit | 60.72 | 134.52 | 3.35 GB |

量化原理可以回頭看[這篇量化入門](/posts/ai/2026-08-26-understanding-ai-models-quantization)。

想把掉的那幾分撿回來，mlx-lm 另外提供四種用校準資料的[學習式量化](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LEARNED_QUANTS.md)：DWQ（用原模型當老師蒸餾）、AWQ、動態量化（敏感的層給較高位元）、GPTQ。文件說動態量化最快，DWQ 較慢但通常效果較好。要先 `pip install "mlx-lm[train]"`，再跑例如：

```bash
mlx_lm.dynamic_quant --model Qwen/Qwen3-0.6B
```

在 mlx-community 看到名字帶 `DWQ` 的模型，就是用這套做出來的。

## 生態：誰在用 MLX

MLX 已經不只是 mlx-lm 一個入口：

- **[LM Studio](https://github.com/lmstudio-ai/mlx-engine)**：0.3.4 之後的 Mac 版內建 `mlx-engine`，底層就是 mlx-lm，圖形介面裡可以直接選 MLX 格式的模型。
- **[Ollama](https://ollama.com/blog/mlx)**：0.19 起在 Apple silicon 上預覽改建在 MLX 之上的引擎；2026 年 6 月的[更新](https://ollama.com/blog/mlx-performance)說透過 MLX 的 JIT 融合 kernel，輸出速度再快最多 20%，用 `ollama run gemma4:12b-mlx` 這類帶 `-mlx` 的標籤就會走 MLX 引擎。
- **[mlx-vlm](https://github.com/Neywa-Labs/mlx-vlm)**：視覺語言模型的推論與微調，mlx-lm 不涵蓋圖片輸入時用它。
- **微調**：mlx-lm 內建 [LoRA 與全參數微調](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md)，量化模型也能做 LoRA。

硬體方面，Apple 在 [M5 的 MLX 文章](https://machinelearning.apple.com/research/exploring-llms-mlx-m5)裡說，MLX 透過 Metal 4 的 TensorOps 使用 M5 GPU 內的 Neural Accelerators，首字延遲（TTFT）相較 M4 最多快 4 倍，前提是 macOS 26.2 以上。生成速度受記憶體頻寬限制，同一篇測到的提升只有兩成左右。換句話說，**prompt 長的工作（agent、RAG）在 M5 上收益最大**，純聊天的感受差距小得多。

## MLX 還是 llama.cpp / GGUF：怎麼選

先講結論：如果你已經用 Ollama，最新版在 Mac 上本來就可能在跑 MLX 了，不一定要自己裝。要自己挑底層時，可以這樣分：

| 情境 | 選 | 理由 |
|---|---|---|
| 只有 Mac，想要 Python 能直接改、能微調 | [MLX / mlx-lm](https://github.com/ml-explore/mlx-lm) | 同一個套件就有推論、量化、LoRA，原始碼是 Python 好讀好改 |
| 新架構剛發佈，想第一時間試 | 兩邊都看 | mlx-lm 直接讀 Hugging Face 原始權重轉換；llama.cpp 要等 GGUF 轉換器支援，兩邊誰先跟上看模型 |
| 同一個模型要跑在 Mac、Linux、Windows | [llama.cpp](https://github.com/ggml-org/llama.cpp) / GGUF | 一個 GGUF 檔各平台通用；MLX 雖然有 Linux CUDA 後端，主場仍是 Apple silicon |
| 記憶體很緊，想細調每層量化 | llama.cpp / GGUF | K-quant、IQ 系列選擇多，還能把部分層丟 CPU |
| 要長期對外服務、權限控管 | 都不要直接用內建 server | 兩者的內建伺服器都偏開發用，前面要再擋一層 |

速度這件事不要聽別人的百分比，自己的機器量一次最準：

```bash
mlx_lm.benchmark --model mlx-community/Qwen3-4B-Instruct-2507-4bit -p 2048 -g 128
llama-bench -m qwen3-4b-instruct-2507-q4_k_m.gguf -p 2048 -n 128
```

兩邊都用 2048 tokens 的 prompt、生成 128 tokens，比較 prompt 處理和生成速度兩欄。量化位元數要對齊（MLX 4-bit 對 Q4 系列），不然比的是量化而不是引擎。

## 限制與要注意的地方

- **格式不互通**：MLX 用 safetensors 加 MLX 專屬的量化參數，不能直接讀 GGUF 量化檔。反方向只有 `mlx_lm.fuse --export-gguf` 能匯出 fp16 的 GGUF，而且只支援 llama、mixtral、mistral 三種架構。
- **需要 Python 環境**：比起 llama.cpp 的單一執行檔或 Ollama 的安裝檔，多了一層 Python 版本與 venv 要管理。
- **KV cache 量化與批次互斥**：`mlx_lm.server --kv-bits 4` 可以省長上下文的記憶體，但文件說開了之後伺服器一次只處理一個請求。
- **`trust_remote_code`**：部分模型的 tokenizer 需要 `--trust-remote-code`，等於執行模型作者的程式碼，來路不明的模型別隨手加。
- **它首先是研究框架**：README 說 MLX 是「designed by machine learning researchers for machine learning researchers」。API 演進快，小版本之間也可能有行為變化，寫成產品時要釘版本。

今晚能做的一件事：`pip install mlx-lm`，跑 `mlx_lm.chat`，再用 `mlx_lm.generate` 看看你的 Mac 跑 4-bit 4B 模型每秒能生成幾個 token。有了這個數字，再來看系列下一篇的 [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server) 怎麼把它變成能同時服務多個 agent 的伺服器，以及第三篇 [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine) 怎麼繞過 MLX 自己寫 Metal kernel。挑硬體的話，可以參考[本地推論硬體指南](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)。

## 參考資料

- [ml-explore/mlx — GitHub](https://github.com/ml-explore/mlx)
- [MLX 文件：Build and Install](https://ml-explore.github.io/mlx/build/html/install.html)
- [MLX 文件：Unified Memory](https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html)
- [MLX 文件：Lazy Evaluation](https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html)
- [mlx — PyPI](https://pypi.org/project/mlx/)
- [ml-explore/mlx-lm — GitHub](https://github.com/ml-explore/mlx-lm)
- [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)
- [mlx-lm BENCHMARKS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/BENCHMARKS.md)
- [mlx-lm LEARNED_QUANTS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LEARNED_QUANTS.md)
- [mlx-community — Hugging Face](https://huggingface.co/mlx-community)
- [Exploring LLMs with MLX and the Neural Accelerators in the M5 GPU — Apple Machine Learning Research](https://machinelearning.apple.com/research/exploring-llms-mlx-m5)
- [Ollama is now powered by MLX on Apple Silicon in preview — Ollama Blog](https://ollama.com/blog/mlx)
- [Ollama's highest performance on Apple Silicon yet with MLX — Ollama Blog](https://ollama.com/blog/mlx-performance)
- [lmstudio-ai/mlx-engine — GitHub](https://github.com/lmstudio-ai/mlx-engine)
- [llama.cpp 本地 LLM 推論深入介紹](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)
- [Ollama 本地 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)
