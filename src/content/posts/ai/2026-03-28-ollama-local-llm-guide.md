---
title: "Ollama 完整指南：一行指令在本地跑 LLM"
date: 2026-03-28
category: ai
tags: [ollama, llm, local-inference, llama-cpp, self-hosted, openai-compatible]
lang: zh-TW
tldr: "Ollama 把 llama.cpp 包裝成 Docker 風格的 CLI + REST API，一行指令就能在本地跑 LLM。這篇從核心概念、安裝、API、硬體需求到 Modelfile 自訂，完整介紹這個工具適合什麼、不適合什麼。"
description: "Ollama 完整介紹：安裝設定、CLI 指令、REST API 與 OpenAI 相容端點、硬體需求、Modelfile 自訂、生態系統整合，以及與 llama.cpp、LM Studio、vLLM 的比較。"
draft: false
---

想在本地跑 LLM，最常遇到的問題是：模型格式要轉換、GPU 記憶體要手動分配、量化參數要自己選。Ollama 把這些全部封裝起來，讓你用一行指令就能下載並啟動模型。這篇完整介紹 Ollama 的設計、使用方式、和實際上的限制。

---

## Ollama 是什麼

Ollama 是一個開源平台（MIT 授權），用於在本地機器上運行大型語言模型。底層是 llama.cpp 推理引擎，上層包了一套 Docker 風格的 CLI 和 REST API。

核心設計哲學：**像管理容器一樣管理模型**。模型權重、設定和運行環境打包成一個叫 Modelfile 的單元，模型層像容器映像一樣快取，共享層不需重複下載。

```bash
# 這一行做了三件事：下載模型、配置 GPU、啟動互動對話
ollama run llama3.2
```

截至 2026 Q1，每月下載量達 5200 萬次。GitHub 上超過 10 萬顆星。

---

## 核心能力一覽

Ollama 不只是一個 CLI 工具，它是一個完整的本地 LLM 運行平台：

- **一行指令管理模型** — `ollama run`、`ollama pull`、`ollama rm`
- **自動 GPU 偵測** — NVIDIA CUDA、AMD ROCm、Apple Metal 全自動
- **自動 VRAM 管理** — 多模型同時載入，超過 VRAM 自動溢出到 RAM
- **OpenAI 相容 API** — `localhost:11434/v1/` 可直接替換 OpenAI endpoint
- **Modelfile 系統** — 類似 Dockerfile 的設定檔
- **多模態** — 支援視覺模型（Gemma 3、Llama 3.2 Vision、LLaVA）
- **結構化輸出** — JSON Schema 約束回應格式
- **工具呼叫** — function calling 支援
- **Embedding** — 內建 embedding 端點

---

## 支援的模型

完整清單在 [ollama.com/library](https://ollama.com/library)，這裡列主要的：

**通用對話**：Llama 3.1/3.2/4（Meta）、Mistral/Mixtral（Mistral AI）、Qwen 2.5/3（Alibaba）、Gemma 2/3（Google）、Phi-3/4（Microsoft）、GPT-OSS（OpenAI 開源模型）

**推理**：DeepSeek R1、DeepSeek-v3.1（多種蒸餾大小）

**程式碼**：Qwen 2.5-Coder、CodeLlama、Qwen3-Coder

**視覺**：Gemma 3（官方推薦）、Llama 3.2 Vision、LLaVA

**Embedding**：embeddinggemma、qwen3-embedding、all-minilm（官方推薦三選一）

不在官方 library 裡的模型，只要是 GGUF 格式就能手動匯入。

---

## 近期新功能（2025-2026）

Ollama 在過去一年加了幾個值得注意的功能：

### 思考/推理模式

支援 Qwen 3、DeepSeek R1、DeepSeek-v3.1、GPT-OSS 等模型的 thinking 模式。回應會分成兩個欄位：`thinking`（推理過程）和 `content`（最終答案），你可以選擇顯示或隱藏推理鏈。

```bash
# 啟用 thinking（相容模型預設開啟）
ollama run deepseek-r1 --think "strawberry 有幾個 r？"

# 隱藏推理過程，只看答案
ollama run deepseek-r1 --hidethinking "解釋量子糾纏"

# 互動模式中切換
>>> /set think
>>> /set nothink
```

GPT-OSS 比較特別，thinking 不是 boolean 而是分 level（low/medium/high）：

```bash
ollama run gpt-oss --think=low "簡單問題"
```

API 層面，在 chat 或 generate 請求加 `think: true`，回應的 `message.thinking` 就會帶推理內容。

### Tool Calling（三種模式）

Ollama 的 tool calling 不只是單次呼叫，支援三種模式：

1. **Single** — 模型呼叫一個工具，你執行後把結果餵回去
2. **Parallel** — 模型同時呼叫多個工具，你全部執行完一起回傳
3. **Agent Loop** — 多輪迴圈，模型自己決定什麼時候呼叫工具、什麼時候停止

Python SDK 可以直接把 function 物件傳給 `tools` 參數，自動解析成 schema。JavaScript 則需要手動定義 JSON Schema。

### 結構化輸出（JSON Schema）

不只是 `format: "json"` 回傳任意 JSON，現在可以用完整的 JSON Schema 約束回應格式：

```python
from ollama import chat
from pydantic import BaseModel

class Country(BaseModel):
    name: str
    capital: str
    languages: list[str]

response = chat(
    model='llama3.2',
    messages=[{'role': 'user', 'content': '介紹台灣'}],
    format=Country.model_json_schema(),
)
country = Country.model_validate_json(response.message.content)
```

JavaScript 端用 Zod + `zodToJsonSchema()` 達成同樣效果。Vision 模型也支援結構化輸出，可以用 schema 約束圖片描述的欄位。

### Web 搜尋（雲端功能）

注意：這不是本地功能，需要 Ollama 帳號和 API key（從 [ollama.com/settings/keys](https://ollama.com/settings/keys) 取得）。

提供兩個雲端 API：
- `POST https://ollama.com/api/web_search` — 搜尋查詢，回傳標題 + URL + 摘要
- `POST https://ollama.com/api/web_fetch` — 抓取特定 URL 的完整內容

```python
import ollama
response = ollama.web_search("Ollama 最新版本")
```

搭配 Qwen 3 等模型，可以建構搜尋 agent：模型自主決定何時搜尋、何時抓取、何時回答。官方建議用 32K+ context 的模型跑搜尋 agent。也可以透過 MCP Server 整合到 Cline、Codex 等工具。

### Ollama Cloud

2025 年 9 月上線的雲端託管服務：

- **Pro**：$20/月
- **Max**：$100/月

適合不想管硬體但又想用 Ollama 生態系統的人。Cloud 模型以完整 context 容量運行。不過目前缺乏公開的 rate limit、per-token 計費、和企業 SLA 文件，還在早期階段。

### TUI 互動介面 + AI 工具啟動器（0.18.3）

這是最大的定位轉變。從 0.18 開始，直接在終端機輸入 `ollama`（不帶任何參數）會進入一個互動式 TUI 選單：

```
Ollama 0.18.3

▸ Run a model
    Start an interactive chat with a model

  Launch Claude Code
    Anthropic's coding tool with subagents

  Launch Codex
    OpenAI's open-source coding agent

  Launch OpenClaw
    Personal AI with 100+ skills

  Launch Visual Studio Code
    Microsoft's open-source AI code editor

  Launch Cline (not installed)
    Install with: npm install -g cline

↑/↓ navigate • enter launch • → configure • esc quit
```

Ollama 不再只是「本地 LLM runner」，而是變成了一個 **AI 開發工具的統一入口**。官方文件列出 18 個整合工具：Claude Code、Codex、Cline、OpenClaw、VS Code、JetBrains、Xcode、Zed、Roo Code、OpenCode、Droid、Pi、Goose、Marimo、n8n、NemoClaw、Onyx 等。沒安裝的工具會顯示安裝指令。

這個設計很聰明——Ollama 已經是開發者跑本地 LLM 的預設選擇，把自己變成 AI 工具的 launcher 等於是在搶佔開發者工作流的入口位置。

---

## 安裝

### macOS

```bash
# 或從 ollama.com/download 下載 .dmg
brew install ollama
```

Apple Silicon 自動啟用 Metal GPU 加速，不需額外設定。

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

自動安裝 binary 並設定 systemd service。

### Windows

```bash
winget install Ollama.Ollama
```

### Docker

```bash
# CPU
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# NVIDIA GPU
docker run -d --gpus all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# AMD GPU
docker run -d --device /dev/kfd --device /dev/dri \
  -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
```

macOS Docker Desktop 不支援 GPU passthrough，跑 Docker 版會退回 CPU，建議直接在本機安裝。

---

## 環境變數與進階設定

Ollama 的行為幾乎全靠環境變數控制。這些是你遲早會用到的：

### 核心設定

| 變數 | 用途 | 預設值 |
|------|------|--------|
| `OLLAMA_HOST` | 綁定位址和 port | `127.0.0.1:11434` |
| `OLLAMA_MODELS` | 模型儲存路徑 | `~/.ollama/models`（macOS）、`/usr/share/ollama/.ollama/models`（Linux） |
| `OLLAMA_ORIGINS` | CORS 允許的來源 | `127.0.0.1`, `0.0.0.0` |
| `OLLAMA_NO_CLOUD` | 停用雲端功能 | 未設定 |
| `HTTPS_PROXY` | 下載模型時的代理 | 未設定 |

### 效能調校

| 變數 | 用途 | 預設值 |
|------|------|--------|
| `OLLAMA_CONTEXT_LENGTH` | 全域 context window 大小 | 依 VRAM 自動決定 |
| `OLLAMA_NUM_PARALLEL` | 每個模型的最大並行請求數 | `1` |
| `OLLAMA_MAX_LOADED_MODELS` | 同時載入記憶體的模型數 | GPU 數量 × 3（或 CPU 模式 3） |
| `OLLAMA_MAX_QUEUE` | 請求佇列上限，超過回 503 | `512` |
| `OLLAMA_KEEP_ALIVE` | 模型閒置後保留在記憶體的時間 | `5m` |
| `OLLAMA_FLASH_ATTENTION` | 啟用 Flash Attention（省記憶體） | 未啟用 |
| `OLLAMA_KV_CACHE_TYPE` | KV Cache 量化類型 | `f16`（可選 `q8_0` 半記憶體、`q4_0` 四分之一） |

`OLLAMA_KEEP_ALIVE` 支援多種格式：`"10m"`、`"24h"`、`0`（用完立刻卸載）、負數（永不卸載）。`OLLAMA_NUM_PARALLEL` 的記憶體開銷 = 並行數 × context length，設太高會爆記憶體。

### 各平台設定方式

```bash
# macOS — 用 launchctl 設定，重啟 app 生效
launchctl setenv OLLAMA_CONTEXT_LENGTH 64000

# Linux — 編輯 systemd service
sudo systemctl edit ollama.service
# 加入 [Service] 區塊下：
# Environment="OLLAMA_CONTEXT_LENGTH=64000"
sudo systemctl daemon-reload && sudo systemctl restart ollama

# Windows — 系統設定 → 環境變數，重啟 app
```

---

## CLI 指令

日常會用到的指令：

```bash
ollama serve                          # 啟動 server（port 11434）
ollama run llama3.2                   # 下載 + 啟動互動對話
ollama run llama3.2 "解釋 TCP 三次握手"  # 單次提問
ollama pull qwen2.5:14b               # 只下載，不啟動
ollama list                           # 列出已下載的模型
ollama ps                             # 看哪些模型正在記憶體裡
ollama show llama3.2                  # 模型資訊（架構、量化、授權）
ollama rm mistral                     # 刪除模型
ollama stop llama3.2                  # 從記憶體卸載
```

互動模式裡可以即時調參數：

```
>>> /set parameter temperature 0.8
>>> /set system "你是一個資深後端工程師"
>>> /set think                          # 啟用推理模式
>>> /set nothink                        # 關閉推理模式
>>> /show info
>>> /bye
```

---

## API

Ollama 在 `localhost:11434` 提供兩套 API。

### 原生 API

```bash
# 多輪對話
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "什麼是 RAG？"}],
  "stream": false
}'

# 生成 embedding
curl http://localhost:11434/api/embed -d '{
  "model": "nomic-embed-text",
  "input": "Ollama 是一個本地 LLM 平台"
}'
```

其他端點：`/api/generate`（文字生成）、`/api/tags`（列出模型）、`/api/pull`（下載模型）、`/api/show`（模型資訊）、`/api/ps`（運行中模型）。

### API 回應的效能指標

每個 API 回應都帶效能數據（單位：奈秒）：

```json
{
  "total_duration": 5589157167,
  "load_duration": 3013701500,
  "prompt_eval_count": 46,
  "prompt_eval_duration": 1160282000,
  "eval_count": 113,
  "eval_duration": 1325948000
}
```

算 token 生成速度：`eval_count / eval_duration × 10⁹` = tokens/sec。上面的例子是 `113 / 1.326 ≈ 85 tok/s`。這個數字對判斷你的硬體瓶頸很有用——如果 `load_duration` 佔大頭，說明模型常被卸載重載，考慮調高 `OLLAMA_KEEP_ALIVE`。

### 進階參數：options 物件

`/api/chat` 和 `/api/generate` 都支援 `options` 物件，可以在每次請求層級覆蓋模型參數：

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "寫一首詩"}],
  "stream": false,
  "options": {
    "temperature": 1.2,
    "top_p": 0.95,
    "num_ctx": 8192,
    "seed": 42,
    "repeat_penalty": 1.2
  },
  "keep_alive": "30m"
}'
```

`seed` 搭配相同的 `temperature` 可以得到可重現的輸出，對測試和除錯很有用。

### OpenAI 相容端點

這是 Ollama 最實用的功能之一。任何使用 OpenAI SDK 的程式碼，只要改 `base_url` 就能切換到本地模型：

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1/",
    api_key="ollama",  # 任意字串，Ollama 不驗證
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "用 Python 寫一個 binary search"}],
)
print(response.choices[0].message.content)
```

支援的端點：`/v1/chat/completions`、`/v1/completions`、`/v1/embeddings`、`/v1/models`。streaming、function calling、structured output 都有支援。

---

## 硬體需求

### 記憶體對照表（4-bit 量化）

| 模型大小 | 所需 RAM/VRAM |
|----------|--------------|
| 7B | ~4-5 GB |
| 13B | ~8-9 GB |
| 30B | ~16-20 GB |
| 70B | ~40+ GB |

預留 2-3 GB 給 OS。量化等級越高（Q8、FP16），記憶體需求翻 2-4 倍。

### GPU 支援

**NVIDIA**（最完整）：CUDA compute capability 5.0+，RTX 4090（24 GB）是消費級首選，RTX 4060（8 GB）是預算選擇。

**AMD**：Linux 上透過 ROCm 支援，Windows 實驗性。RX 7900 XTX（24 GB）不錯，但部分顯卡可能需要 `HSA_OVERRIDE_GFX_VERSION` 環境變數。

**Apple Silicon**：Metal API 自動啟用。統一記憶體架構的優勢是所有系統 RAM 都可供 GPU 使用，M 系列晶片配 32 GB+ 記憶體跑本地 LLM 體驗很好。

### Context Length 與 VRAM 的關係

Ollama 根據 VRAM 自動決定 context window 大小：

| 可用 VRAM | 預設 context length |
|-----------|-------------------|
| < 24 GB | 4,000 tokens |
| 24-48 GB | 32,000 tokens |
| > 48 GB | 256,000 tokens |

Web search、agent 任務、coding tool 這類場景，官方建議至少 64,000 tokens。手動設定：

```bash
# 全域設定
OLLAMA_CONTEXT_LENGTH=64000 ollama serve

# 單次請求層級（透過 options.num_ctx）
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3",
  "messages": [...],
  "options": {"num_ctx": 64000}
}'
```

context length 加倍，KV cache 記憶體就加倍。搭配 `OLLAMA_KV_CACHE_TYPE=q8_0` 可以用一半的記憶體跑同樣的 context，代價是精度略降。`q4_0` 更省（四分之一），但品質影響更明顯。

### VRAM 不夠時

Ollama 自動把部分層溢出到系統 RAM。好處是不會崩潰，壞處是速度降 5-30 倍。

```bash
# 確認 GPU/CPU 分配狀態
ollama ps
# NAME       SIZE    PROCESSOR    CONTEXT
# llama3.2   4.9 GB  100% GPU     8192
```

`PROCESSOR` 欄顯示 `100% GPU` 是理想狀態。如果看到 `50% GPU / 50% CPU`，代表模型部分在 CPU 上跑，效能會大幅下降。解法：換更小的模型、降低 context length、啟用 KV cache 量化、或升級硬體。

---

## Modelfile 自訂

Modelfile 是 Ollama 的殺手級功能之一。語法類似 Dockerfile：

```dockerfile
FROM llama3.2

PARAMETER temperature 0.7
PARAMETER num_ctx 8192
PARAMETER top_p 0.9

SYSTEM """你是一個資深軟體工程師。回答時總是附上程式碼範例，並逐步解釋你的推理過程。"""
```

```bash
# 建立自訂模型
ollama create my-code-assistant -f ./Modelfile

# 使用
ollama run my-code-assistant

# 查看任何模型的 Modelfile
ollama show --modelfile llama3.2
```

### 全部指令

| 指令 | 用途 |
|------|------|
| `FROM` | 基礎模型（必填）。可以是模型名稱、本地 GGUF 路徑、safetensors 目錄 |
| `SYSTEM` | 系統提示，注入到 template 的 `{{ .System }}` |
| `PARAMETER` | 推理參數（見下方完整列表） |
| `TEMPLATE` | 自訂 prompt 模板（Go template 語法，變數：`{{ .System }}`、`{{ .Prompt }}`、`{{ .Response }}`） |
| `ADAPTER` | 套用 LoRA adapter（safetensors 目錄或 GGUF 檔案） |
| `MESSAGE` | 預填對話歷史，指定 role（system/user/assistant）引導模型行為 |
| `LICENSE` | 宣告授權條款 |
| `REQUIRES` | 指定最低 Ollama 版本（例如 `REQUIRES 0.14.0`） |

### 完整參數表

| 參數 | 說明 | 預設值 |
|------|------|--------|
| `temperature` | 創意度，越高越隨機 | 0.8 |
| `num_ctx` | Context window 大小（tokens） | 2048 |
| `num_predict` | 最大生成 token 數（-1 = 無限） | -1 |
| `top_k` | 限制候選 token 數，越小越確定 | 40 |
| `top_p` | Nucleus sampling 閾值 | 0.9 |
| `min_p` | 最低機率門檻 | 0.0 |
| `repeat_penalty` | 重複懲罰 | 1.1 |
| `repeat_last_n` | 重複偵測的回看範圍 | 64 |
| `seed` | 隨機種子（搭配固定 temperature 可重現輸出） | 0 |
| `stop` | 停止序列（可重複多次設定多個） | — |

### 進階範例：用 MESSAGE 預填對話

```dockerfile
FROM llama3.2
SYSTEM """你是台灣的法律顧問，專精勞基法。用繁體中文回答。"""
PARAMETER temperature 0.3
PARAMETER num_ctx 8192

# 用 MESSAGE 預填 few-shot 範例
MESSAGE user 「加班費怎麼算？」
MESSAGE assistant 「根據勞基法第 24 條，延長工時前 2 小時按平日每小時工資加給 1/3，再延長 2 小時加給 2/3。」
```

Modelfile 讓你可以為不同用途建立不同的模型配置——一個專門寫程式的、一個專門做翻譯的、一個專門做 RAG 的——不需要重新下載模型權重，只是在同一個基礎模型上套不同設定。

---

## 匯入自訂模型

不在 Ollama library 的模型，有三種方式匯入：

### GGUF 檔案（最常見）

HuggingFace 上大量社群量化的 GGUF 可以直接用：

```dockerfile
# Modelfile
FROM ./my-model-q4_K_M.gguf
SYSTEM "你的系統提示"
```

```bash
ollama create my-model -f Modelfile
ollama run my-model
```

### Safetensors（完整模型或 adapter）

直接匯入完整模型：

```dockerfile
FROM /path/to/safetensors/directory
```

或匯入 LoRA adapter（用 Unsloth、MLX 等工具微調後的產物）：

```dockerfile
FROM llama3.2
ADAPTER /path/to/adapter/directory
```

重點：`FROM` 的基礎模型必須和你訓練 adapter 時用的一模一樣，否則結果會很奇怪。

### 量化

匯入 FP16/FP32 模型時可以順便量化：

```bash
ollama create --quantize q4_K_M my-model -f Modelfile
```

支援的量化類型：`q4_K_S`、`q4_K_M`（推薦，品質和大小平衡好）、`q8_0`。

### 分享模型

```bash
ollama cp my-model myuser/my-model
ollama push myuser/my-model
# 別人就可以 ollama run myuser/my-model
```

---

## 與其他方案比較

| | Ollama | llama.cpp | LM Studio | vLLM |
|---|---|---|---|---|
| 介面 | CLI + REST API | 純 CLI | GUI + API | Server API |
| 安裝 | 一行指令 | 需編譯 | 安裝包 | pip install |
| 開源 | MIT | MIT | 否（免費） | Apache 2.0 |
| 適合 | 開發者、API 整合 | 極致效能控制 | 初學者、GUI 偏好 | 生產高吞吐量 |
| GPU 管理 | 自動 | 完全手動 | GUI 控制 | 自動最佳化 |

**怎麼選？**

- 想要最快上手 + API 驅動開發 → **Ollama**
- 想要 GUI 點點就能用 → **LM Studio**
- 需要最大效能控制和自訂 → **llama.cpp**
- 要上生產環境、高並發 → **vLLM**

Ollama 和 LM Studio 底層都是 llama.cpp。Ollama 贏在自動 VRAM 管理和開發者友善的 API，LM Studio 贏在 UI 和模型發現體驗。

---

## 生態系統

Ollama 官方文件列出 18 個整合工具，加上社群生態已經相當完整：

| 類型 | 工具 |
|------|------|
| Web UI | OpenWebUI（最像 ChatGPT 的本地介面） |
| AI Coding | Claude Code、Codex、Cline、Roo Code、OpenCode、Droid、Pi、Goose |
| IDE | VS Code、JetBrains、Xcode、Zed |
| 自動化 | n8n、Marimo |
| 個人助理 | OpenClaw、NemoClaw、Onyx |
| RAG 框架 | LangChain、LlamaIndex |

常見搭配：Ollama + OpenWebUI 做本地聊天介面，Ollama + LangChain 做本地 RAG，Ollama + Claude Code/Codex 用本地模型做 coding agent。0.18 版的 TUI launcher 讓這些工具的切換變得更無縫。

---

## 限制和注意事項

### 不是生產環境方案

Ollama 的設計目標是本地開發和實驗，不是生產部署。沒有內建的負載均衡、水平擴展、可觀測性。請求排隊是靜默的——不會拒絕請求，只是延遲越來越高，你看不到警告。

### 安全性是個大問題

預設沒有任何認證。如果你把 `OLLAMA_HOST` 設成 `0.0.0.0`，API 就對所有人開放。2026 年 1 月有報告指出 175,000 個暴露的 Ollama 伺服器被利用。任何非 localhost 部署都要加反向代理 + 認證。

### 模型品質的天花板

本地跑的開源模型，在複雜推理任務上通常還是比不上 Claude 或 GPT-4o 等雲端 API。7B 模型適合簡單任務，70B 才接近雲端品質，但硬體要求也跟著上去。

### 其他限制

- 無法選擇特定量化方法（Ollama 自動決定）
- 模型以專有 blob 格式儲存，不便跨工具共享（不像直接用 GGUF）
- 只做推理，不做微調（但可以套用 LoRA adapter）
- 沒有內建 GUI，要搭配 OpenWebUI 等第三方前端
- AMD GPU 支援不如 NVIDIA 成熟

---

## 除錯與排障

### Log 在哪裡

```bash
# macOS
cat ~/.ollama/logs/server.log

# Linux（systemd）
journalctl -u ollama --no-pager --follow

# Docker
docker logs ollama

# Windows
# %LOCALAPPDATA%\Ollama（server log）
# %HOMEPATH%\.ollama（模型和設定）
```

Windows 啟用 debug 模式：`$env:OLLAMA_DEBUG="1"` 再啟動。

### GPU 沒被偵測到

**NVIDIA**：確認 `nvidia-smi` 能跑。Docker 裡用 `docker run --gpus all ubuntu nvidia-smi` 測試。如果 UVM driver 沒載入：`sudo nvidia-modprobe -u`。進階診斷：`CUDA_ERROR_LEVEL=50`。

**AMD**：用戶必須在 `video` 和 `render` 群組裡才能存取 `/dev/kfd`。Docker 容器裡需要手動 `--group-add` 對應的 GID。ROCm 版本太舊（v6 以下）可能導致 timeout，升到 v7。

### 常見問題

**模型跑著跑著變慢**：`ollama ps` 檢查 `PROCESSOR` 欄。如果從 `100% GPU` 變成 `GPU/CPU` 混合，代表記憶體不夠開始溢出。降低 `num_ctx` 或換更小的模型。

**CPU fallback 但不想要**：強制指定 LLM library：`OLLAMA_LLM_LIBRARY="cpu_avx2" ollama serve`。選項優先級：`cpu_avx2` > `cpu_avx` > `cpu`（最相容，macOS Rosetta 也能跑）。

**Docker 裡 GPU 不工作**：檢查 `/etc/docker/daemon.json`，確認有 `"exec-opts": ["native.cgroupdriver=cgroupfs"]`。

**`/tmp` 掛載為 noexec**：設定 `OLLAMA_TMPDIR` 指向其他目錄。

**安裝特定版本**：

```bash
curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.5.7 sh
```

---

## 整體來說

Ollama 的核心取捨很明確：**用一層抽象換取開發者體驗**。你放棄了 llama.cpp 的極致控制，換來一行指令就能跑模型 + OpenAI 相容 API + 自動 GPU 管理。

從 2025 到 2026，Ollama 的定位已經從「本地 LLM runner」擴展成「AI 開發者的統一入口」。thinking mode、tool calling agent loop、structured output、web search、TUI launcher——這些功能加起來，讓它從一個單純的推理工具變成了一個開發平台。

適合的場景：本地開發和測試 LLM 應用、省 API 費用的原型開發、隱私敏感的離線使用、搭配 RAG 框架做實驗、匯入自訂微調模型做推理。

不適合的場景：高並發生產環境（用 vLLM）、需要極致效能調整（用 llama.cpp）、非技術用戶（用 LM Studio）。

如果你是開發者，想在本地跑 LLM 做開發測試，Ollama 目前是最低摩擦力的選擇。
