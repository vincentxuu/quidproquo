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
- **多模態** — 支援視覺模型（LLaVA、Llama 3.2 Vision）
- **結構化輸出** — JSON Schema 約束回應格式
- **工具呼叫** — function calling 支援
- **Embedding** — 內建 embedding 端點

---

## 支援的模型

完整清單在 [ollama.com/library](https://ollama.com/library)，這裡列主要的：

**通用對話**：Llama 3.1/3.2/4（Meta）、Mistral/Mixtral（Mistral AI）、Qwen 2.5/3（Alibaba）、Gemma 2/3（Google）、Phi-3/4（Microsoft）

**推理**：DeepSeek R1（多種蒸餾大小）

**程式碼**：Qwen 2.5-Coder、CodeLlama、Qwen3-Coder

**視覺**：Llama 3.2 Vision、LLaVA、Gemma 3

**Embedding**：Nomic Embed（274 MB，效能接近 OpenAI ada-002）

不在官方 library 裡的模型，只要是 GGUF 格式就能手動匯入。

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

其他端點：`/api/generate`（文字生成）、`/api/tags`（列出模型）、`/api/pull`（下載模型）。

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

### VRAM 不夠時

Ollama 自動把部分層溢出到系統 RAM。好處是不會崩潰，壞處是速度降 5-30 倍。`ollama ps` 可以看目前模型佔了多少 GPU/CPU 記憶體。

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

### 可用指令

| 指令 | 用途 |
|------|------|
| `FROM` | 基礎模型（必填） |
| `SYSTEM` | 系統提示 |
| `PARAMETER` | 推理參數（temperature、num_ctx、top_k、top_p、repeat_penalty、stop、num_predict） |
| `TEMPLATE` | 自訂 prompt 模板（Go template 語法） |
| `ADAPTER` | 套用 LoRA 微調 adapter |

Modelfile 讓你可以為不同用途建立不同的模型配置，比如一個專門寫程式的、一個專門做翻譯的、一個專門做 RAG 的。不需要重新下載模型權重，只是在同一個基礎模型上套不同設定。

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

Ollama 的 OpenAI 相容 API 讓它可以接入大量現有工具：

| 類型 | 工具 |
|------|------|
| Web UI | OpenWebUI（最像 ChatGPT 的本地介面） |
| IDE 整合 | Continue（VS Code/JetBrains）、Cline |
| CLI 工具 | aichat、oterm |
| RAG 框架 | LangChain、LlamaIndex |
| 智慧家庭 | Home Assistant |

常見搭配：Ollama + OpenWebUI 做本地聊天介面，Ollama + LangChain 做本地 RAG，Ollama + Continue 做本地 code completion。

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

## 整體來說

Ollama 的核心取捨很明確：**用一層抽象換取開發者體驗**。你放棄了 llama.cpp 的極致控制，換來一行指令就能跑模型 + OpenAI 相容 API + 自動 GPU 管理。

適合的場景：本地開發和測試 LLM 應用、省 API 費用的原型開發、隱私敏感的離線使用、搭配 RAG 框架做實驗。

不適合的場景：高並發生產環境（用 vLLM）、需要極致效能調整（用 llama.cpp）、非技術用戶（用 LM Studio）。

如果你是開發者，想在本地跑 LLM 做開發測試，Ollama 目前是最低摩擦力的選擇。
