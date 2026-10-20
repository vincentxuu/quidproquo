---
title: "在 Google Colab 免費 T4 上試跑 vLLM：十五分鐘看懂推論引擎在做什麼"
date: 2026-10-20
category: ai
type: guide
tags: [vllm, llm-inference, colab, model-serving, openai-compatible, gpu]
lang: zh-TW
tldr: "Mac 沒有 NVIDIA 卡跑不了 vLLM，Colab 免費 T4（compute capability 7.5，剛好達 vLLM 最低門檻）可以。用 vllm serve 把 0.6B 的 Qwen3 開成 OpenAI 相容 API，再同時打 8 個請求、看 /metrics，就能親眼看到 continuous batching。"
description: "用 Google Colab 免費 GPU 試跑 vLLM 的實作指南：Colab 是什麼與限制、vLLM 在系統裡的位置、安裝與啟動、用 curl 和 OpenAI SDK 呼叫、併發請求與 Prometheus 指標，以及 --api-key 不保護 /metrics 的資安提醒。"
draft: false
series:
  name: "自架推論服務"
  order: 8
---

🌏 [English version](/posts/ai/2026-10-20-vllm-colab-quickstart-en)

vLLM 是目前自架 LLM 服務最常見的推論引擎，但它主要為 NVIDIA GPU 而寫，筆電（尤其 Mac）幾乎沒辦法體驗。這篇用 Google Colab 免費借到的 T4 GPU，從 `pip install` 到同時打 8 個請求，十五分鐘內把 vLLM 跑起來，親眼看它「把模型變成 API」和「同時服務很多人」這兩件事。

如果你還不熟 vLLM 的原理，可以先讀 [vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)；這篇只講動手。

## 先搞懂兩個東西

### vLLM 在系統裡的位置

模型本身只是一包權重檔，放著不會回答問題。vLLM 是把權重載進 GPU、開成 HTTP 服務的伺服器程式。用 Web 後端來類比：

| Web 後端 | LLM 服務 |
|---|---|
| Django / FastAPI 程式碼 | 模型權重 |
| gunicorn / uvicorn | **vLLM** |
| `POST /api/...` | `POST /v1/chat/completions`（OpenAI 相容格式） |

因為 API 跟 OpenAI 同格式，原本呼叫 OpenAI 的程式只要換 `base_url` 就能改打自己的 vLLM。它被當成「生產級」的理由主要有三個：

- **PagedAttention**：模型生成時要記住前文（KV cache），vLLM 像作業系統管記憶體分頁一樣切塊管理，同一張卡能塞更多同時進行的對話。
- **Continuous batching**：新請求不用等上一批跑完，可以隨時插進正在算的批次。
- **多卡平行**：模型太大一張卡放不下時，用 `--tensor-parallel-size` 切到多張卡。

同一層還有 SGLang、TensorRT-LLM；Ollama、LM Studio 則偏個人與本機使用。各自的定位可以看 [自架推論伺服器怎麼選](/posts/tech/2026-08-24-self-hosted-inference-server-guide)。

### Colab 是什麼、為什麼能免費

依 [Colab 官方 FAQ](https://research.google.com/colaboratory/faq.html)：

> Colab is a hosted Jupyter Notebook service that requires no setup to use and provides free of charge access to computing resources, including GPUs and TPUs.

也就是開在瀏覽器裡的 Jupyter Notebook，程式跑在 Google 的機器上。Google 沒有公開說明為什麼免費，但從產品設計看得出幾個動機：用免費版帶出 Colab Pro 等付費方案、讓使用者把資料留在 Google Drive、日後把運算需求導向 Google Cloud。

免費的代價寫在同一份 FAQ 裡，動手前一定要知道：

> Colab resources are not guaranteed and not unlimited, and usage limits sometimes fluctuate.

> In the version of Colab that is free of charge notebooks can run for at most 12 hours, depending on availability and your usage patterns.

實際影響是：尖峰時段可能借不到 GPU、閒置會被收回、執行階段一重置，裝的套件和下載的模型全部消失。它是個人 Google 服務，**不要放公司或客戶資料**；拿公開模型做實驗沒問題。

## 為什麼是 T4、為什麼是 Qwen3-0.6B

[vLLM 的 GPU 安裝文件](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/)寫的硬體門檻：

> GPU: compute capability 7.5 or higher (e.g., T4, RTX20xx, A100, L4, H100, B200, etc.)

T4 是 7.5，剛好壓線。代價是 T4 不支援 bfloat16，而多數新模型的權重是 bfloat16；舊版 vLLM 遇到這種情況會直接報錯（`Bfloat16 is only supported on GPUs with compute capability of at least 8.0`，見 [vllm#1157](https://github.com/vllm-project/vllm/issues/1157)），所以下面的指令一律明確加 `--dtype half`。

模型選 [Qwen/Qwen3-0.6B](https://huggingface.co/Qwen/Qwen3-0.6B)：模型卡寫明 0.6B 參數、32,768 context，T4 的 16 GB 記憶體放得下，下載也快。它預設會「思考」（先輸出推理過程再給答案），剛好可以順便看 vLLM 的 reasoning parser 怎麼把兩段拆開。

## 動手：從零到第一個回覆

### 步驟 1：開 Colab、換成 GPU

1. 打開 <https://colab.research.google.com>，用 Google 帳號登入，新增筆記本。
2. 選單「執行階段 → 變更執行階段類型」，硬體加速器選 **T4 GPU**，儲存。
3. 第一個儲存格確認有拿到卡：

```bash
!nvidia-smi
```

預期看到一張 `Tesla T4`、約 15 GB 記憶體。如果出現 `command not found` 或沒有 GPU，代表沒借到，晚點再試或換付費方案。

### 步驟 2：安裝 vLLM

```bash
!pip install -q vllm
!python -c "import vllm; print(vllm.__version__)"
```

安裝要幾分鐘，因為會一併拉 PyTorch 與 CUDA 相關套件。查證當天（2026-10-20）[GitHub releases](https://github.com/vllm-project/vllm/releases) 上的最新版是 v0.32.0（10-18 發布），前兩版是 v0.31.0（10-05）與 v0.30.0（09-22），約兩週一版。

裝完如果 Colab 提示要「重新啟動工作階段」，照做再往下。

### 步驟 3：在背景啟動服務

Colab 的儲存格會等指令結束，而 `vllm serve` 是常駐服務，所以要丟到背景、把 log 寫進檔案：

```bash
!nohup vllm serve Qwen/Qwen3-0.6B \
    --dtype half \
    --max-model-len 4096 \
    --reasoning-parser qwen3 \
    > vllm.log 2>&1 &
```

- `--dtype half`：T4 不支援 bfloat16，改用 float16。
- `--max-model-len 4096`：限制單次對話長度，KV cache 預留的空間小，啟動快、也比較不會爆記憶體。
- `--reasoning-parser qwen3`：依 [vLLM Reasoning Outputs 文件](https://docs.vllm.ai/en/latest/features/reasoning_outputs/)，Qwen3 對應的 parser 名稱就是 `qwen3`，回應會把思考過程放在獨立的 `reasoning` 欄位。

等它就緒（第一次要下載權重）：

```bash
!for i in $(seq 1 60); do curl -sf localhost:8000/health && echo "ready" && break; sleep 5; done
!tail -n 20 vllm.log
```

看到 `ready` 就成功。等了五分鐘還沒好，先看 `vllm.log` 的最後幾行，最常見的是記憶體不足（把 `--max-model-len` 再調小）或 dtype 錯誤。

### 步驟 4：用 OpenAI 格式打它

先列出模型，確認 API 活著：

```bash
!curl -s localhost:8000/v1/models
```

再問一題：

```bash
!curl -s localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "Qwen/Qwen3-0.6B", "messages": [{"role": "user", "content": "用一句話解釋什麼是 KV cache"}], "max_tokens": 512}'
```

回應的 JSON 長得跟 OpenAI 一樣：`choices[0].message.content` 是答案，`reasoning` 是模型的思考過程，`usage` 記錄輸入與輸出 token 數。

用 OpenAI 官方 SDK 也行，只要換 `base_url`。不想看思考過程，就照官方文件的寫法在請求裡關掉：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
resp = client.chat.completions.create(
    model="Qwen/Qwen3-0.6B",
    messages=[{"role": "user", "content": "台北有什麼適合雨天的景點？列三個"}],
    max_tokens=512,
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(resp.choices[0].message.content)
```

到這裡你已經有一個跟 OpenAI 同格式、跑在自己 GPU 上的 LLM API。

## 進階：親眼看 continuous batching

vLLM 真正厲害的是「同時服務很多人」。同時送 8 個請求，記下總時間：

```python
import asyncio, time
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

async def ask(i):
    r = await client.chat.completions.create(
        model="Qwen/Qwen3-0.6B",
        messages=[{"role": "user", "content": f"寫一段 100 字的短文，主題編號 {i}"}],
        max_tokens=256,
        extra_body={"chat_template_kwargs": {"enable_thinking": False}},
    )
    return r.usage.completion_tokens

start = time.time()
tokens = await asyncio.gather(*(ask(i) for i in range(8)))
elapsed = time.time() - start
print(f"8 個請求共 {sum(tokens)} tokens，耗時 {elapsed:.1f}s，約 {sum(tokens)/elapsed:.0f} tok/s")
```

Colab 的儲存格本身就跑在 event loop 裡，所以可以直接 `await`。再把 `range(8)` 改成 `range(1)` 跑一次比較：8 個請求的總時間通常遠少於單個請求的 8 倍，因為它們被併進同一批一起算。這就是 continuous batching 的效果。

一邊跑一邊看指標：

```bash
!curl -s localhost:8000/metrics | grep -E "^vllm:(num_requests_running|num_requests_waiting|kv_cache_usage_perc|generation_tokens_total)"
```

依 [vLLM Metrics 文件](https://docs.vllm.ai/en/latest/design/metrics/)，這幾個指標分別是：

| 指標 | 意思 |
|---|---|
| `vllm:num_requests_running` | 正在算的請求數 |
| `vllm:num_requests_waiting` | 排隊中的請求數 |
| `vllm:kv_cache_usage_perc` | KV cache 用了多少比例 |
| `vllm:generation_tokens_total` | 累計生成的 token 數 |
| `vllm:time_to_first_token_seconds` | 首字延遲的分布 |

正式環境就是拿這些指標接 Prometheus／Grafana 看容量：`waiting` 一直大於 0、`kv_cache_usage_perc` 長時間接近 1，就代表卡不夠用了。

## 資安提醒：`--api-key` 不是全包

在 Colab 裡服務只聽 `localhost`，外面打不進來，所以上面沒設金鑰。但如果你之後把 vLLM 開在真正的伺服器上，要知道 [vLLM Security 文件](https://docs.vllm.ai/en/latest/usage/security/)寫得很清楚：

> The --api-key flag (or VLLM_API_KEY environment variable) provides authentication for vLLM's HTTP server, but only for endpoints under the /v1, /v2, /inference, and /cohere path prefixes. Many other sensitive endpoints are exposed on the same HTTP server without any authentication enforcement.

不受保護的包括 `/metrics`、`/health`、`/version`、`/tokenize`，以及 `/pause`、`/abort_requests` 這類操作端點。所以對外服務時一定要放在反向代理或閘道後面，由它負責認證與路由，不要只靠 `--api-key`。

## Mac 上的替代方案

想在自己的 Mac 上有同樣的體驗，用 Ollama 或 LM Studio 比較實際：一鍵安裝、能用 Apple Silicon 加速，也提供 OpenAI 相容 API。它們不是 vLLM，沒有同等級的併發能力，但「模型跑成服務、用 `/v1/chat/completions` 呼叫」的概念完全一樣。安裝與用法見 [Ollama 完整指南](/posts/ai/2026-03-14-ollama-local-llm-guide)。

## 整體來說

Colab 加 T4 能讓你在不花錢、不買卡的情況下，把 vLLM 的三件事看清楚：它是一個 OpenAI 相容的伺服器、它能把多個請求併進同一批、它用 Prometheus 指標告訴你容量還剩多少。T4 太舊、模型太小，看不到大模型、多卡的表現，那需要真正的資料中心 GPU。

接下來可以做的：

- 想看課堂上怎麼講部署：[台大深度學習之應用 助教課](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)從 Colab 一路講到用 vLLM 部署。
- 想評估要不要自架：[自架推論伺服器怎麼選](/posts/tech/2026-08-24-self-hosted-inference-server-guide)。
- 換一個稍大的模型（例如 1.5B～4B），觀察 `kv_cache_usage_perc` 和 tok/s 怎麼變。

## 參考資料

- [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)
- [vLLM 文件：GPU 安裝](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/)
- [vLLM 文件：Quickstart](https://docs.vllm.ai/en/latest/getting_started/quickstart/)
- [vLLM 文件：Reasoning Outputs](https://docs.vllm.ai/en/latest/features/reasoning_outputs/)
- [vLLM 文件：Metrics](https://docs.vllm.ai/en/latest/design/metrics/)
- [vLLM 文件：Security](https://docs.vllm.ai/en/latest/usage/security/)
- [vLLM GitHub Releases](https://github.com/vllm-project/vllm/releases)
- [vLLM issue #1157：T4 不支援 bfloat16](https://github.com/vllm-project/vllm/issues/1157)
- [Qwen/Qwen3-0.6B 模型卡](https://huggingface.co/Qwen/Qwen3-0.6B)
- [vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)
- [自架推論伺服器怎麼選：從 Ollama 到 Xinference](/posts/tech/2026-08-24-self-hosted-inference-server-guide)
- [從 PyTorch、Hugging Face 到 LoRA、量化與 vLLM 部署｜台大 ADL 助教課](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)
- [Ollama 完整指南：一行指令在本地跑 LLM](/posts/ai/2026-03-14-ollama-local-llm-guide)
