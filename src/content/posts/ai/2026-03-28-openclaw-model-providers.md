---
title: "OpenClaw 的模型需求與供應商生態"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, anthropic, openai, gemini, model-failover, tool-use]
lang: zh-TW
tldr: "OpenClaw 支援 35+ 模型供應商，最低需求是模型支援 tool use + streaming，內建 auth 輪替和 model failover 機制。"
description: "OpenClaw 對 LLM 的功能性需求、三大供應商設定方式、Auth 輪替與模型容錯機制。"
draft: false
---

OpenClaw 是模型無關（model-agnostic）的 AI 閘道器，支援 35+ 供應商。但不是隨便接一個模型就能用——它對模型有明確的功能性需求。這篇整理 OpenClaw 的模型需求、主要供應商的設定方式，以及出錯時的容錯機制。

## 模型的功能性需求

OpenClaw 的 agent 運作建立在這幾個能力上：

**Tool Use（必要）** — 模型必須支援 function calling。這是 OpenClaw agent 的運作基礎，沒有 tool use 就無法執行任何工具。

**Streaming（必要）** — 支援串流輸出，用於即時回覆和分塊傳送到聊天平台。

**Extended Thinking（選配）** — 深度推理能力。Claude 4.6 原生支援，失敗時自動降級為普通模式。

**Schema 相容性** — 不同供應商的 tool schema 格式不同。OpenClaw 內建 normalizer 處理 Gemini 和 OpenAI 的 schema 差異，不需要手動處理。

文件原文的建議：_"use the strongest latest-generation model available"_。如果用本地模型（Ollama、vLLM、SGLang），要確保模型支援 tool calling。

## 設定方式

所有模型統一用 `provider/model` 格式，設定在 `~/.openclaw/openclaw.json`：

```json5
{
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-opus-4-6" }
    }
  }
}
```

## 支援的供應商

| 類別 | 供應商 |
|---|---|
| 頂級商用 | Anthropic (Claude)、OpenAI (GPT)、Google (Gemini) |
| 中國廠商 | DeepSeek、Qwen/阿里雲、GLM (智譜)、MiniMax、Moonshot (Kimi)、Qianfan (百度)、Volcengine (豆包)、Xiaomi |
| 推理加速 | Groq (LPU)、Together AI |
| 本地部署 | Ollama、vLLM、SGLang |
| 代理閘道 | OpenRouter、LiteLLM、Vercel AI Gateway、Cloudflare AI Gateway |
| 其他 | xAI、Mistral、NVIDIA、Hugging Face、Venice、Amazon Bedrock、GitHub Copilot |
| 語音轉錄 | Deepgram |

## 三大供應商設定細節

### Anthropic (Claude)

三種認證方式擇一：API Key、Claude CLI、Setup-Token。

```bash
openclaw onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

| 項目 | 說明 |
|---|---|
| 推薦模型 | `anthropic/claude-opus-4-6` |
| Thinking 模式 | Claude 4.6 預設 `adaptive` |
| Fast 模式 | API Key 限定，映射到 `service_tier: "auto"` |
| Prompt 快取 | `none` / `short`（5 min）/ `long`（1 hr），API Key 預設 `short` |
| 1M Context | Beta，需設定 `params.context1m: true` |

限制：CLI 模式不支援 tool use 和 streaming。Setup-Token 不支援 fast mode。

### OpenAI (GPT)

兩種認證方式：API Key 或 Codex 訂閱（OAuth）。

```json5
{
  agents: { defaults: { model: { primary: "openai/gpt-5.4" } } }
}
```

| 項目 | 說明 |
|---|---|
| 推薦模型 | `openai/gpt-5.4`、`openai/gpt-5.4-pro` |
| 傳輸協定 | 自動（WebSocket 優先，SSE fallback）|
| Fast 模式 | `reasoning.effort = "low"` + `text.verbosity = "low"` |
| 自動壓縮 | context window 70% 時觸發 server-side compaction |

Codex 訂閱用戶還能用 `openai-codex/gpt-5.3-codex-spark`。

### Google (Gemini)

API Key 認證為主。

```bash
openclaw onboard --auth-choice google-api-key
```

| 項目 | 說明 |
|---|---|
| 推薦模型 | `google/gemini-3.1-pro-preview` |
| 特殊能力 | 圖片生成、圖片/音訊/影片理解、Web 搜尋（Grounding）|
| Thinking | Gemini 3.1+ 支援推理模式 |

## 模型容錯機制

OpenClaw 內建兩階段容錯：

```
Stage 1: 同供應商內輪替 Auth Profile（round-robin）
         ↓ 全部用完
Stage 2: 切換到 fallback model
```

設定 fallback：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.4", "google/gemini-3.1-pro-preview"]
      }
    }
  }
}
```

### Cooldown 機制

| 錯誤類型 | 冷卻遞增 |
|---|---|
| 一般失敗 | 1 min → 5 min → 25 min → 1 hr（上限）|
| 帳單/額度失敗 | 5 hr → 10 hr → 20 hr → 24 hr（上限）|

### 多帳號輪替

可以設定多組 API Key，失敗時自動換下一組。Auth profile 存在 `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`。預設排序是 OAuth 優先於 API Key，同類型內按「最舊優先」。

### Session 黏著

選定 auth profile 後，整個 session 期間保持不變，維持 provider cache 效率。只有在 session reset、compaction、或 cooldown 觸發時才會切換。

### Thinking 降級

如果 extended thinking 呼叫失敗，自動降級為普通模式，不中斷對話。

## 整體來說

OpenClaw 對模型的底線是 **tool use + streaming**。在這之上，它用 auth 輪替、model fallback、thinking 降級三層機制確保服務不中斷。如果你有多個供應商的 API Key，設好 fallbacks 就能得到很高的可用性。本地模型也能接，但要確認 tool calling 支援。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/providers/index.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/index.md) — 供應商目錄總覽
- [docs/providers/models.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/models.md) — 模型設定快速指南
- [docs/providers/anthropic.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/anthropic.md) — Anthropic (Claude) 設定
- [docs/providers/openai.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/openai.md) — OpenAI (GPT) 設定
- [docs/providers/google.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/google.md) — Google (Gemini) 設定
- [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/models.md) — 模型核心概念
- [docs/concepts/model-providers.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-providers.md) — 模型供應商概念
- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) — 模型容錯機制
- [docs/pi.md](https://github.com/openclaw/openclaw/blob/main/docs/pi.md) — Pi 嵌入式整合架構（Tool Use / Schema 需求）
