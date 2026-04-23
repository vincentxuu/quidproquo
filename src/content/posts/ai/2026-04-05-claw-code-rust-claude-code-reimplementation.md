---
title: "Claw Code：用 Rust 重寫 Claude Code 的開源 CLI Agent"
date: 2026-04-05
type: project
category: ai
tags: [agent-cli, claude-code, claw-code, rust, open-source, multi-agent, mcp]
lang: zh-TW
tldr: "Claw Code 是用 Rust 從零重寫的 Claude Code CLI 替代品，48K 行程式碼、40 個工具、MIT 授權。最驚人的是整個專案在 5 天內由多個 AI Agent 協作完成，上線不到一週就突破 170K stars。"
description: "介紹 Claw Code 的架構設計、工具系統、與 Claude Code 的功能對齊策略，以及它作為多 Agent 協作產物的特殊意義。"
draft: false
---

Claude Code 是 Anthropic 的官方 CLI Agent 工具，但它不開源。Claw Code 做了一件大膽的事：**用 Rust 從零重寫一個功能對齊的替代品**，而且整個開發過程本身就是多 AI Agent 協作的公開實驗。

## 專案定位

Claw Code 不是 Claude Code 的 fork，也不是薄薄的 API wrapper。它是一個完整的 Rust 重寫，目標是達到 Claude Code 的功能對齊（feature parity），同時提供 Rust 帶來的效能與安全性保證。

幾個關鍵事實：

| 項目 | 內容 |
|------|------|
| 語言 | Rust（edition 2021） |
| 程式碼量 | ~48,600 行 Rust + 2,568 行測試 |
| 工具數 | 40 個 tool specs |
| 預設模型 | claude-opus-4-6 |
| 授權 | MIT |
| 開發時間 | 5 天（2026-03-31 ~ 2026-04-04） |

值得強調的是：Claw Code **不隸屬於 Anthropic**，專案文件明確聲明這一點。

## 架構設計

Claw Code 採用 Cargo workspace 結構，拆成 9 個 crate，各自負責一個清楚的職責：

| Crate | 職責 |
|-------|------|
| `api` | Provider client、SSE 串流、API Key + OAuth 認證 |
| `commands` | Slash command 註冊與渲染 |
| `compat-harness` | 從上游 TypeScript 原始碼萃取 tool/prompt manifest |
| `mock-anthropic-service` | 確定性的本地 mock 服務，用於 parity 測試 |
| `plugins` | 外掛安裝、啟用、停用管理 |
| `runtime` | Session 管理、Config 載入、權限系統、MCP client、system prompt 組裝 |
| `rusty-claude-cli` | 主要 CLI binary（`claw`）、REPL、串流顯示 |
| `telemetry` | Session tracing 與使用量遙測 |
| `tools` | 所有內建工具（Bash、Read、Write、Edit、Glob、Grep、Agent 等） |

整個 workspace 強制 `unsafe_code = "forbid"` 和嚴格的 Clippy lint——這在一個 48K 行的 Rust 專案中是相當有紀律的做法。

## 工具系統

Claw Code 暴露了 40 個工具規格，幾乎覆蓋了 Claude Code 的完整工具表面：

**核心工具：**
- Bash 執行、檔案讀寫編輯
- Glob 搜尋、Grep 內容搜尋
- Web search / fetch

**進階工具：**
- Sub-agent 啟動（Task、Team）
- Cron 排程任務
- LSP 整合
- MCP server 生命週期管理
- Notebook 編輯
- Todo 追蹤

**與 Claude Code 的對齊策略：**

`compat-harness` crate 是一個特別值得注意的設計。它直接解析 Claude Code 上游的 TypeScript 原始碼，萃取出 tool spec 和 prompt manifest，用來確保 Claw Code 的工具行為與原版保持一致。搭配 `mock-anthropic-service` 提供的 10 個確定性測試場景，形成了一套系統化的 parity 驗證機制。

## 功能亮點

### 互動式 REPL + 一次性 prompt

```bash
# 互動模式
./target/debug/claw

# 一次性 prompt
./target/debug/claw prompt "summarize this repository"
```

### 認證雙軌

```bash
# API Key
export ANTHROPIC_API_KEY="sk-ant-..."

# OAuth 登入
./target/debug/claw login
```

### 權限分級

| 模式 | 說明 |
|------|------|
| Read-only | 只能讀取檔案和搜尋 |
| Workspace-write | 可在工作目錄內寫入 |
| Full-access | 完整權限，包含 bash 執行 |

### Session 持久化

Session 以 JSONL 格式儲存，支援中斷後恢復。這和 Claude Code 的行為一致——你可以關掉終端機，下次用 `claw resume` 接續。

### Config 層級合併

支援 user → project → local 三層 config，合併邏輯和 Claude Code 的 settings 結構類似。同時支援 `CLAUDE.md` / 專案記憶檔案。

## 安裝與使用

```bash
# 建置
cd rust
cargo build --workspace

# 健康檢查
./target/debug/claw doctor

# 測試
cargo test --workspace

# Mock parity 測試
./scripts/run_mock_parity_harness.sh
```

目前沒有預編譯的 binary 發佈，需要自行從原始碼建置。

## 多 Agent 協作的產物

Claw Code 最特別的地方不只是它做了什麼，而是**它怎麼被做出來的**。

整個專案在 5 天內由多個 AI coding agent 協作完成，人類透過 Discord 下達指令而非傳統的 pair programming。開發過程使用了三個協調工具：

| 工具 | 角色 |
|------|------|
| **clawhip** | 事件/通知路由器，監聽 git commits、tmux sessions、GitHub issues |
| **oh-my-codex (OmX)** | 將指令轉化為結構化多 Agent 執行的工作流層 |
| **oh-my-openagent (OmO)** | 多 Agent 協調——規劃、交接、review 迴圈 |

3 位作者、292 次 commits、5 天——這個速度本身就是對「AI Agent 能不能寫 production-quality 的軟體」這個問題的一次公開回答。

## 與 Claude Code 的比較

| 面向 | Claude Code | Claw Code |
|------|------------|-----------|
| 語言 | TypeScript / Node.js | Rust |
| 授權 | 專有 | MIT |
| 模型支援 | Claude 系列 | Claude 系列（相同） |
| 工具數量 | ~40+ | 40 |
| MCP 支援 | 原生 | 有（lifecycle + inspection） |
| 外掛系統 | 有 | 有 |
| 安裝方式 | npm | cargo build |
| 效能 | Node.js 層級 | Rust 原生效能 |

功能面幾乎對齊，主要差異在語言生態系和授權模式。Claw Code 的 Rust 實作在啟動速度和記憶體使用上有天然優勢，但 Claude Code 作為官方工具有更完整的模型整合和持續更新保證。

## 專案現況

| 指標 | 數值 |
|------|------|
| GitHub Stars | ~170K |
| Forks | ~103K |
| Open Issues | 1,413 |
| 授權 | MIT |
| 組織 | UltraWorkers |
| 社群 | Discord（discord.gg/5TUQKqFWd） |

170K stars 在不到一週內——專案自稱「史上最快突破 100K stars 的 repo」。即使考慮到可能的社群效應放大，這個數字仍然反映了市場對開源 Claude Code 替代品的強烈需求。

## 適用場景

**適合的情境：**

- 想要開源、可審計的 Claude Code 替代品
- 偏好 Rust 生態系的開發者
- 需要自訂或擴充 Agent 工具行為
- 想在受控環境中部署 Claude Agent（容器化支援已文件化）

**不太適合的情境：**

- 需要官方支援和保證的企業用戶
- 不想自行建置和維護的使用者
- 需要非 Claude 模型的場景

## 參考資料

- [Claw Code GitHub Repository](https://github.com/ultraworkers/claw-code)
- [oh-my-codex GitHub Repository](https://github.com/Yeachan-Heo/oh-my-codex)
- [Claude Code 完整方案分析](/posts/ai/2026-04-02-agent-cli-claude-code)
- [oh-my-codex 工作流增強層介紹](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
