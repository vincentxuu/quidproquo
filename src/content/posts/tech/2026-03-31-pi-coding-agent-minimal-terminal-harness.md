---
title: "Pi Coding Agent：極簡主義的開源終端機 Coding Harness"
date: 2026-03-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, ollama, openclaw]
lang: zh-TW
tldr: "Pi 是 Mario Zechner 用 TypeScript 打造的極簡 coding agent，只有 4 個核心工具（read、write、edit、bash）和 300 字 system prompt。透過 Extensions、Skills、Prompt Templates 擴充，跑在 Bun runtime 上。Ollama 已內建 `ollama launch pi` 一鍵啟動。"
description: "Pi Coding Agent 的設計哲學、架構、核心功能、擴充機制、與 OpenClaw 的關係，以及與其他 coding agent 的差異。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en)

Pi 是由 Mario Zechner（GitHub: badlogic）打造的開源 coding agent，核心理念是「極簡但可擴充」。整個系統約 4,000 行 TypeScript，只附帶 4 個工具和 300 字的 system prompt——剩下的都讓使用者自己決定。

## 安裝

```bash
# 透過 Ollama 一鍵啟動
ollama launch pi

# npm 安裝
npm install -g @mariozechner/pi-coding-agent
```

跑在 Bun runtime 上，啟動速度快。

## 設計哲學

Pi 刻意不做的事情跟它做的事情一樣重要：

### 只有 4 個核心工具

| 工具 | 功能 |
|---|---|
| `read` | 讀取檔案 |
| `write` | 寫入檔案 |
| `edit` | 編輯檔案 |
| `bash` | 執行 shell 指令 |

沒有內建 sub-agents、沒有 plan mode、沒有 MCP——但這些都可以透過 Extensions 自己加。

### 300 字 System Prompt

大多數 coding agent 的 system prompt 動輒數千字。Pi 只用 300 字，讓 prompt cache 命中率最高、token 消耗最低。

## 核心功能

| 功能 | 說明 |
|---|---|
| 4 種運行模式 | Interactive（互動）、Print/JSON（輸出）、RPC（程序整合）、SDK（嵌入應用） |
| Compaction | 接近 context limit 時自動摘要舊訊息，可透過 Extension 自訂摘要策略 |
| Skills | 按需載入的能力包（指令 + 工具），不會佔用 prompt cache |
| Dynamic Context | Extension 可在每個 turn 前注入訊息、過濾歷史、實作 RAG 或長期記憶 |
| 多供應商 | Anthropic、OpenAI、Google、Azure、Bedrock、Mistral、Groq、Cerebras、xAI、Hugging Face 等 |
| 模型切換 | Session 中途可切換模型 |

## 擴充機制

Pi 的擴充系統是 TypeScript 模組，能存取：

- **工具**：新增自訂工具
- **指令**：新增自訂指令
- **鍵盤快捷鍵**：綁定自訂操作
- **事件**：監聽 agent 生命週期事件
- **TUI**：完整存取終端機 UI

透過 Extension，你可以自己實作 sub-agents、plan mode、權限控管、沙盒、MCP 整合等。Pi 的態度是：與其內建所有功能然後讓你關掉不要的，不如讓你只載入你需要的。

## TUI 引擎

Pi 的 TUI 底層是 `@mariozechner/pi-tui`，特色包括：

- 無閃爍差分渲染
- CSI 2026 同步輸出
- 括號貼上處理
- 行內圖片支援（Kitty / iTerm2 協定）
- 自動完成與 overlay 對話框

## 與 OpenClaw 的關係

| 層 | 負責者 | 功能 |
|---|---|---|
| Gateway | OpenClaw | 頻道管理、路由、認證、排程 |
| Agent Runtime | Pi | 推理、工具執行、context 管理 |
| Session | 共管 | OpenClaw 擁有 session，Pi 執行 agent loop |
| Memory | Pi | Markdown 檔案、vector search |

Pi 是 OpenClaw 的 AI 核心引擎。OpenClaw 負責外層（頻道、安全、排程），Pi 負責內層（推理、執行、記憶）。Pi 的設定透過 OpenClaw 的 `agents.defaults` 和 `agents.list[]` 傳遞。

但 Pi 也可以完全獨立使用，不需要 OpenClaw。

## 資源需求

Pi 可以跑在非常小的模型上：

| 場景 | 模型 |
|---|---|
| 輕量使用 | Qwen3:1.7b（本地） |
| 一般開發 | Claude Sonnet、GPT-4o |
| 複雜任務 | Claude Opus、GPT-5 |

相比 OpenClaw 需要至少 64K context window，Pi 的彈性大得多。

## 與其他 Coding Agent 的比較

| | Pi | Claude Code | Codex CLI | OpenCode |
|---|---|---|---|---|
| 語言 | TypeScript | TypeScript | Rust | Go |
| 核心工具 | 4 個 | 多個 | 多個 | 多個 |
| 設計哲學 | 極簡可擴充 | 功能完整 | OpenAI 生態整合 | 模型自由度 |
| 內建 sub-agents | ❌（Extension 可加） | ✅ | ✅ | ✅ |
| 內建 MCP | ❌（Extension 可加） | ✅ | ✅ | ❌ |
| 最小可用模型 | 1.7B | 需大型模型 | 需 OpenAI 模型 | 彈性 |

## 典型使用場景

1. **極簡開發**：只需要基本的讀寫編輯能力，不想要複雜功能
2. **自訂 agent**：用 Extension 系統打造完全客製化的 coding workflow
3. **本地小模型**：接 Ollama 跑 1.7B 模型，在低資源環境下工作
4. **嵌入應用**：用 SDK 模式把 Pi 嵌入自己的產品
5. **OpenClaw 核心**：作為 OpenClaw Gateway 的 agent runtime

## 與其他工具的定位差異

Pi 的核心優勢：極簡設計帶來的低 token 消耗和高 prompt cache 命中率、TypeScript Extension 的無限擴充性、以及對小模型的友善支援。適合喜歡「自己動手」、想要完全掌控 agent 行為的開發者。

## 參考資源

- [GitHub - badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [npm - @mariozechner/pi-coding-agent](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)
- [Pi 開發心得（作者部落格）](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Ollama 發佈 Pi 整合](https://www.sci-tech-today.com/news/ollama-pi-coding-agent-launch-openclaw-customization/)
- [shittycodingagent.ai](https://shittycodingagent.ai/)

## 參考資料

- [Pi Coding Agent GitHub：badlogic/pi-mono 極簡開源終端機 coding harness](https://github.com/badlogic/pi-mono)
- [Claude Code GitHub：anthropics/claude-code（Pi 比較對象參考）](https://github.com/anthropics/claude-code)
- [Pi Coding Agent 作者部落格：pi-mono 設計哲學與 TUI 引擎開發心得](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [npm - @mariozechner/pi-coding-agent（Pi Coding Agent 安裝來源）](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)
