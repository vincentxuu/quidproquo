---
title: "OpenClaw 更多供應商：DeepSeek、Groq、Ollama、OpenRouter、Bedrock..."
date: 2026-03-28
category: ai
tags: [openclaw, deepseek, groq, ollama, openrouter, vllm, bedrock, sglang, mistral]
lang: zh-TW
tldr: "除了 Anthropic/OpenAI/Google 三大家，OpenClaw 還支援 30+ 供應商，從 DeepSeek 到本地 Ollama 都有。"
description: "OpenClaw 的 30+ 模型供應商設定指南：DeepSeek、Groq、Ollama、vLLM、OpenRouter、Amazon Bedrock 與更多。"
draft: false
---

上一篇模型文章講了 Anthropic、OpenAI、Google 三大供應商。但 OpenClaw 支援 35+ 家，這篇補上其餘的——從高性價比的 DeepSeek、超快推理的 Groq、到本地部署的 Ollama 和 vLLM。

## 統一設定格式

所有供應商都遵循相同的模式：

```json5
{
  env: { PROVIDER_API_KEY: "your-key" },
  agents: {
    defaults: {
      model: { primary: "provider/model-name" }
    }
  }
}
```

大部分供應商可以用 `openclaw onboard` 互動式設定。

## 高性價比：DeepSeek

中國 AI 公司，OpenAI 相容 API，價格極低。

```bash
openclaw onboard --auth-choice deepseek-api-key
```

| 模型 | 用途 | Context |
|---|---|---|
| `deepseek-chat` (V3.2) | 通用對話 | 128K |
| `deepseek-reasoner` (V3.2) | 推理 / chain-of-thought | 128K |

設定環境變數 `DEEPSEEK_API_KEY`。如果 Gateway 跑在 daemon，確保 key 在 `~/.openclaw/.env` 裡。

## 超快推理：Groq

Groq 用自研的 LPU 硬體跑開源模型，推理速度極快。

```json5
{
  env: { GROQ_API_KEY: "gsk_..." },
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" }
    }
  }
}
```

常用模型：

| 模型 | 特點 |
|---|---|
| Llama 3.3 70B Versatile | 能力廣、context 長 |
| Llama 3.1 8B Instant | 速度導向 |
| Gemma 2 9B | 輕量 |
| Mixtral 8x7B | MoE 架構，複雜推理 |

額外功能：Groq 的 Whisper 可以做快速語音轉錄，設定為 media-understanding provider 即可。

## 本地模型：Ollama

在自己的機器上跑開源模型，零成本。

```bash
# 裝 Ollama
# 拉模型
ollama pull glm-4.7-flash

# OpenClaw 設定
openclaw onboard  # 選 Ollama
```

OpenClaw 會自動發現本機的 Ollama 模型。也支援雲端模型（`kimi-k2.5:cloud`、`minimax-m2.5:cloud` 等）。

**重要警告：不要用 `/v1` OpenAI 相容 URL。** 這會破壞 tool calling，模型會把 tool JSON 當純文字輸出。用原生 Ollama API URL：`http://host:11434`（不加 `/v1`）。

最簡設定：設 `OLLAMA_API_KEY=ollama-local`，OpenClaw 自動 discovery。

## 本地模型：vLLM

用 OpenAI 相容 HTTP API 服務開源和自訂模型。

```bash
# 啟動 vLLM server
# 設定
export VLLM_API_KEY="vllm-local"
```

```json5
{
  agents: {
    defaults: {
      model: { primary: "vllm/your-model-id" }
    }
  }
}
```

跟 Ollama 一樣支援自動 discovery——設了 `VLLM_API_KEY` 但沒設 provider config，OpenClaw 會查詢 `GET http://127.0.0.1:8000/v1/models`。

手動設定可以指定 `contextWindow`、`maxTokens` 等參數。

## 本地模型：SGLang

另一個本地模型 runtime，文件在 `docs/providers/sglang.md`，設定方式類似 vLLM。

## 統一閘道：OpenRouter

一個 API key 存取多家模型。模型格式：`openrouter/<provider>/<model>`。

```bash
openclaw onboard --auth-choice apiKey --token-provider openrouter --token "$OPENROUTER_API_KEY"
```

```json5
{
  agents: {
    defaults: {
      model: { primary: "openrouter/anthropic/claude-sonnet-4-6" }
    }
  }
}
```

適合想用單一帳單存取多家模型的人。OpenRouter 會自動注入 Anthropic 模型的 cache control。

## 企業雲：Amazon Bedrock

不用 API key，走 AWS SDK 的 default credential chain。

```json5
{
  models: {
    providers: {
      "amazon-bedrock": {
        api: "bedrock-converse-stream"
        // 不需要 apiKey，用 AWS credentials
      }
    }
  }
}
```

認證優先順序：`AWS_BEARER_TOKEN_BEDROCK` → 標準 AWS credentials → profiles → SDK chain。

支援自動 discovery——有 AWS credentials 就會自動列出可用的 Bedrock 模型（用 `bedrock:ListFoundationModels`，快取 1 小時）。

EC2 上用 instance role 時，設 `AWS_PROFILE=default` 告訴 OpenClaw 有 credentials 可用。

需要的 IAM 權限：`bedrock:InvokeModel`、`bedrock:InvokeModelWithResponseStream`、`bedrock:ListFoundationModels`。

## 其他供應商速覽

每家都有獨立的文件，這裡列出重點：

| 供應商 | Provider ID | 認證方式 | 特點 |
|---|---|---|---|
| Mistral | `mistral` | API Key | 歐洲公司，多語言強 |
| xAI | `xai` | API Key | Grok 模型 |
| NVIDIA | `nvidia` | API Key | NIM 推理服務 |
| Hugging Face | `huggingface` | API Key | Inference API |
| Together AI | `together` | API Key | 多模型推理平台 |
| Qwen / 阿里雲 | `qwen_modelstudio` | API Key | 通義千問系列 |
| GLM (智譜) | `glm` | API Key | GLM 系列 |
| MiniMax | `minimax` | API Key | 中國 AI |
| Moonshot (Kimi) | `moonshot` | API Key | Kimi 系列，含 Kimi Coding |
| Qianfan (百度) | `qianfan` | API Key | 文心一言 |
| Volcengine (豆包) | `volcengine` | API Key | 字節跳動 |
| Xiaomi | `xiaomi` | API Key | 小米 AI |
| Venice | `venice` | API Key | 隱私導向 |
| GitHub Copilot | `github-copilot` | OAuth | 用 Copilot 訂閱 |
| LiteLLM | `litellm` | 自訂 | 統一 proxy gateway |
| Vercel AI Gateway | — | 自訂 | Vercel 代理 |
| Cloudflare AI Gateway | — | 自訂 | Cloudflare 代理 |

## 代理閘道的用法

LiteLLM、Vercel AI Gateway、Cloudflare AI Gateway 不是模型供應商，而是**代理層**——你把它們擺在 OpenClaw 和實際供應商之間，做統一計費、rate limiting、或路由。

## 語音轉錄：Deepgram

不是語言模型，而是語音轉錄服務。設定為 transcription provider 後，語音訊息會自動轉成文字。

## 社群工具：Claude Max API Proxy

社群維護的 proxy，用 Claude 訂閱憑證存取 API。**使用前要確認是否符合 Anthropic 的使用條款。**

## 整體來說

OpenClaw 的供應商生態分四層：

1. **頂級商用**（Anthropic / OpenAI / Google）— 最強能力，最貴
2. **高性價比**（DeepSeek / Groq / Mistral）— 便宜或免費額度，能力不差
3. **本地部署**（Ollama / vLLM / SGLang）— 零成本，但需要自己的硬體
4. **代理閘道**（OpenRouter / LiteLLM）— 一個 key 存取多家

可以在 `model.fallbacks` 裡混搭不同層，例如主用 Claude、fallback 到 DeepSeek、再 fallback 到本地 Ollama。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/providers/index.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/index.md) — 供應商目錄
- [docs/providers/deepseek.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/deepseek.md) — DeepSeek
- [docs/providers/groq.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/groq.md) — Groq
- [docs/providers/ollama.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/ollama.md) — Ollama
- [docs/providers/vllm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/vllm.md) — vLLM
- [docs/providers/sglang.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/sglang.md) — SGLang
- [docs/providers/openrouter.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/openrouter.md) — OpenRouter
- [docs/providers/bedrock.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/bedrock.md) — Amazon Bedrock
- [docs/providers/mistral.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/mistral.md) — Mistral
- [docs/providers/xai.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/xai.md) — xAI
- [docs/providers/nvidia.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/nvidia.md) — NVIDIA
- [docs/providers/huggingface.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/huggingface.md) — Hugging Face
- [docs/providers/together.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/together.md) — Together AI
- [docs/providers/qwen_modelstudio.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/qwen_modelstudio.md) — Qwen
- [docs/providers/glm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/glm.md) — GLM
- [docs/providers/minimax.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/minimax.md) — MiniMax
- [docs/providers/moonshot.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/moonshot.md) — Moonshot
- [docs/providers/qianfan.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/qianfan.md) — Qianfan
- [docs/providers/volcengine.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/volcengine.md) — Volcengine
- [docs/providers/xiaomi.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/xiaomi.md) — Xiaomi
- [docs/providers/venice.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/venice.md) — Venice
- [docs/providers/github-copilot.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/github-copilot.md) — GitHub Copilot
- [docs/providers/litellm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/litellm.md) — LiteLLM
- [docs/providers/vercel-ai-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/vercel-ai-gateway.md) — Vercel AI Gateway
- [docs/providers/cloudflare-ai-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/cloudflare-ai-gateway.md) — Cloudflare AI Gateway
- [docs/providers/deepgram.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/deepgram.md) — Deepgram
- [docs/providers/claude-max-api-proxy.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/claude-max-api-proxy.md) — Claude Max API Proxy
