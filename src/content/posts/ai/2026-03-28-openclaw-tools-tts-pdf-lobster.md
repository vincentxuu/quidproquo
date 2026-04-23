---
title: "OpenClaw 工具篇（四）：TTS、PDF、Lobster 與 MCP"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, tts, pdf, lobster, mcp, media, elevenlabs, openai-tts]
lang: zh-TW
tldr: "TTS 支援 ElevenLabs/Microsoft/OpenAI 三家，PDF 有 native 和 extraction 兩種模式，Lobster 是確定性工作流 runtime，MCP 支援外部工具擴展。"
description: "OpenClaw 的 TTS 語音合成、PDF 分析、Lobster 工作流引擎、MCP Server 整合、以及媒體處理工具。"
draft: false
---

這篇講 OpenClaw 的輔助工具：語音合成、文件分析、確定性工作流、和外部工具整合。

## Text-to-Speech（TTS）

把 agent 回覆轉成語音。預設關閉。

### 三個 Provider

| Provider | 需要 API Key | 說明 |
|---|---|---|
| ElevenLabs | ✅（`ELEVENLABS_API_KEY`）| 高品質語音 |
| OpenAI | ✅（`OPENAI_API_KEY`）| OpenAI TTS API |
| Microsoft | ❌ | 用 Edge 的 neural TTS，免費 |

### Auto-TTS 模式

| 模式 | 行為 |
|---|---|
| `off`（預設）| 關閉 |
| `always` | 所有回覆轉語音 |
| `inbound` | 收到語音訊息後才轉 |
| `tagged` | 回覆中有 `[[tts]]` 標記時才轉 |

### 設定

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs"
    }
  }
}
```

### 跳過條件

- 回覆已包含媒體
- 文字少於 10 字元
- 超長文字（可啟用自動摘要後再轉語音）

### Slash Commands

```
/tts status               # 查看狀態
/tts provider openai      # 切換 provider
/tts limit 2000           # 設定字元上限
```

設定存在本地（per-session），不是全域。

## PDF 工具

分析 PDF 文件並回傳文字內容。

### 兩種模式

| 模式 | 行為 | 支援 |
|---|---|---|
| Native | 直接送 PDF bytes 給 provider API | Anthropic、Google |
| Extraction fallback | 先提取文字，文字不足時 render 頁面圖片 | 其他 provider |

### 輸入方式

- 本地檔案路徑（支援 `~` 展開）
- File URL
- HTTP/HTTPS URL（沙箱模式下遠端 URL 被封鎖）

### 參數

| 參數 | 說明 |
|---|---|
| `pdf` | 單一 PDF |
| `pdfs` | 多個 PDF（最多 10 個） |
| `prompt` | 分析指令（預設：Analyze this PDF document） |

### 限制

- 檔案大小預設 10 MB
- Extraction fallback 最多 20 頁
- Native 模式不支援 page 篩選

## Lobster：確定性工作流 Runtime

Lobster 讓 OpenClaw 執行多步驟工具序列，作為確定性操作。

### 解決的問題

LLM 驅動的工作流有個問題：多次工具呼叫的 token 成本和協調開銷很高。Lobster 把多個工具呼叫合併成一個結構化操作。

### 三個核心優勢

| 優勢 | 說明 |
|---|---|
| 合併執行 | 一次 Lobster 呼叫取代多次工具呼叫 |
| 內建 Approval | 副作用前暫停，等人類授權 |
| 可恢復狀態 | 暫停的工作流回傳 token，可以不重跑就繼續 |

### 設計理念

Lobster 用 DSL 而不是任意程式碼——確定性 + 可審計。Pipeline 是資料，容易 log、diff、replay、review。

### 實作模式

```bash
inbox list --json | inbox categorize --json | inbox apply --json
```

Chain 小型 CLI 指令，中間用 approval step 管控。

### 安全機制

- Timeout 強制
- 輸出大小限制
- 固定的 executable 命名
- Sandbox 感知
- 不直接處理機密或網路呼叫

## MCP Server 整合

OpenClaw 支援 MCP（Model Context Protocol）Server，擴展 agent 的工具集。

### 設定

```json5
{
  mcp: {
    servers: {
      "my-server": {
        command: "npx",
        args: ["-y", "@my-mcp/server"],
        env: { API_KEY: "..." }
      }
    }
  }
}
```

### 管理指令

```
/mcp list                  # 列出 MCP server
/mcp status                # 查看狀態
```

MCP 讓 OpenClaw 可以連接外部工具生態——資料庫、API、自訂服務等。

## 媒體處理

### 圖片

- `image` 工具：圖片分析（需要 `imageModel`）
- `image_generate` 工具：圖片生成/編輯（需要 `imageGenerationModel`）
- 支援 OpenAI、Google、fal 等 provider

### 媒體附件

入站媒體自動複製到沙箱 workspace（`media/inbound/*`）。支援的格式取決於頻道。

## 其他工具

| 工具 | 說明 |
|---|---|
| `message` | 發送訊息到目前頻道 |
| `memory_search` | 語意搜尋 memory |
| `memory_get` | 讀取特定 memory 檔案 |
| `cron` | 排程任務 |
| `gateway` | Gateway 管理 |
| `nodes` | Node 裝置控制 |
| `canvas` | 畫布工具 |

## 整體來說

OpenClaw 的工具集覆蓋了從語音到文件、從確定性工作流到外部 MCP 擴展。TTS 讓 agent 會「說話」，Lobster 讓複雜工作流可預測且可審計，MCP 打開了無限的工具擴展空間。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/tools/tts.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/tts.md) — TTS 語音合成
- [docs/tools/pdf.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/pdf.md) — PDF 工具
- [docs/tools/lobster.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/lobster.md) — Lobster 工作流
- [docs/tools/mcp.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/mcp.md) — MCP Server 整合
- [docs/tools/media.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/media.md) — 媒體處理
- [docs/tools/image.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/image.md) — 圖片工具
