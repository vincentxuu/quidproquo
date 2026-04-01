---
title: "Claude Code：Anthropic 終端機 AI Coding Agent 完整介紹"
date: 2026-03-31
category: tech
tags: [claude-code, anthropic, ai-tools, cli, coding-agent]
lang: zh-TW
tldr: "Claude Code 是 Anthropic 的 agentic coding 工具，跑在終端機、IDE、Slack、GitHub 和 Web 上。核心擴充機制有六層：CLAUDE.md（永駐 context）、Skills（按需工作流程）、Hooks（確定性自動化）、Subagents（隔離委派）、MCP（外部工具連接）、Agent Teams（多 agent 協作）。"
description: "Claude Code 的安裝方式、核心功能、六層擴充機制、運行模式、定價、與其他 AI coding agent 的定位差異，以及本站相關深度指南索引。"
draft: false
---

Claude Code 是 Anthropic 推出的 agentic coding 工具。它能理解你的 codebase，透過自然語言指令執行日常任務、解釋複雜程式碼、處理 git workflow。可以在終端機、IDE（VS Code / JetBrains）、Slack、GitHub、或 Web 上使用。

## 安裝

```bash
# 推薦方式（macOS / Linux）
curl -fsSL https://claude.ai/install.sh | bash

# Windows
winget install Anthropic.ClaudeCode
```

npm 安裝已標記為 deprecated，建議用原生安裝器。安裝後用 Claude 帳號登入即可使用。

**系統需求：** macOS 13.0+ / Windows 10+ / 主流 Linux 發行版。

## 核心能力

| 能力 | 說明 |
|---|---|
| 程式碼讀寫 | 讀取、編輯、建立檔案，理解整個專案結構 |
| Shell 執行 | 在終端機中執行任意指令（build、test、lint 等） |
| Git 工作流程 | commit、branch、PR、merge，全程自然語言操作 |
| Extended Thinking | 預設開啟，遇到複雜問題先推理再動手 |
| Auto Mode | 長時間自主執行的安全替代方案（取代 `--dangerously-skip-permissions`） |
| Headless Mode | `claude -p` 程式化執行，可嵌入 CI/CD 或腳本 |

## 六層擴充機制

Claude Code 的擴充系統是它與其他 coding agent 最大的差異。每一層解決不同問題：

### 1. CLAUDE.md — 永駐 Context

```
# CLAUDE.md（放在專案根目錄）
這是一個 Astro + React 專案
用 pnpm 管理套件
測試用 vitest
commit message 用繁體中文
```

每次啟動 session 自動載入，不需要每次重複說明專案慣例。

### 2. Skills — 按需工作流程

`.md` 檔案放在 `~/.claude/skills/`，寫 markdown 就好，不需要 SDK。

- **Reference Skill**：提供知識（如 API 風格指南），Claude 在整個 session 中參考
- **Action Skill**：觸發動作（如 `/deploy`），Claude 按步驟執行
- 支援自動偵測啟動——不一定要用 slash command

### 3. Hooks — 確定性自動化

在 `settings.json` 設定，綁定生命週期事件（tool call 前後、session 開始結束等）。

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "edit",
      "command": "npx biome check --fix $CLAUDE_FILE_PATH"
    }]
  }
}
```

Hook 保證執行，不受模型行為影響。適合 lint、format、安全檢查等必須每次跑的操作。

### 4. Subagents — 隔離委派

主 agent 拆分任務，啟動子 agent 平行執行。每個 subagent 有獨立的 context window，不繼承對話歷史。只有結論回到主 context，不會膨脹 token 用量。

### 5. MCP — 外部工具連接

Model Context Protocol 讓 Claude 連上你的工具鏈：資料庫、GitHub、Sentry、Figma、Slack——3,000+ 整合。一個 MCP server 就是一個即時可用的工具。

### 6. Agent Teams — 多 Agent 協作

2026 年 2 月隨 Opus 4.6 發佈。多個獨立 Claude session 互相傳訊、分工、平行作業。與 subagent 的差異：subagent 是上下級的委派關係，Agent Teams 是平級的協作關係。

### 擴充機制總覽

| 層 | 解決什麼問題 | 何時載入 |
|---|---|---|
| CLAUDE.md | 專案慣例、永駐指令 | Session 啟動時自動載入 |
| Skills | 可重用的工作流程 | 按需載入或自動偵測 |
| Hooks | 必須執行的自動化 | 事件觸發時確定性執行 |
| Subagents | 隔離與平行化 | 主 agent 判斷需要時啟動 |
| MCP | 外部系統連接 | 設定後常駐可用 |
| Agent Teams | 多 agent 協作 | 手動啟動 |
| Plugins | 打包分發以上所有機制 | 安裝後按各自規則載入 |

## 運行環境

| 環境 | 說明 |
|---|---|
| 終端機 | 原生 CLI，核心體驗 |
| VS Code | 原生擴充套件，視覺化 diff |
| JetBrains | 原生擴充套件 |
| Web | claude.ai/code |
| Slack | 團隊對話中直接啟動開發任務 |
| GitHub | 在 PR / Issue 中 @claude 觸發 |

## 更新頻道

| 頻道 | 說明 |
|---|---|
| `latest` | 預設，新功能第一時間推送 |
| `stable` | 約延遲一週，跳過有重大 regression 的版本 |

## 定價

需要 Claude Pro 或 Max 訂閱（或 API 付費）。以 Claude Sonnet 4.6 為例：

| | 價格 |
|---|---|
| Input | $3.00 / 1M tokens |
| Output | $15.00 / 1M tokens |

## 與其他 Coding Agent 的定位差異

| | Claude Code | Codex CLI | Gemini CLI | OpenCode | Pi |
|---|---|---|---|---|---|
| 廠商 | Anthropic | OpenAI | Google | SST（開源社群） | badlogic（開源社群） |
| 擴充層數 | 6 層 | Skills + MCP | MCP | 雙 Agent | Extension |
| 開源 | ❌ | ✅ | ✅（Apache 2.0） | ✅ | ✅ |
| 免費方案 | ❌（需訂閱） | 部分免費 | 1,000 次/天 | 完全免費 | 完全免費 |
| 核心優勢 | 擴充生態最完整 | OpenAI 模型整合 | 免費 + 1M context | 75+ 模型自由度 | 極簡 + 低 token |
| IDE 整合 | VS Code + JetBrains | VS Code | VS Code | TUI | TUI |

Claude Code 的核心優勢在於六層擴充機制帶來的客製化深度——從個人開發者到企業團隊，都能逐層疊加所需的自動化和整合。缺點是不開源且需要付費。

## 本站相關深度指南

本站已有 20+ 篇 Claude Code 專題文章，以下是按主題分類的索引：

**擴充機制：**
- [Hooks 完整指南](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide/)
- [Skill 完整指南](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide/)
- [Sub-agents 完整指南](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution/)
- [MCP Server 整合](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration/)
- [Agent Teams 指南](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide/)
- [Plugins & Marketplaces](/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide/)
- [三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md/)

**設定與環境：**
- [settings.json 設定大全](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide/)
- [CLAUDE.md 與 agents.md 指南](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide/)
- [Context Window 管理](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management/)
- [DevContainer & Sandboxing](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing/)
- [Permission Modes 全解析](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions/)

**整合與自動化：**
- [CI/CD × GitHub Actions](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions/)
- [Headless Mode](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide/)
- [Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide/)
- [Slack 整合](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration/)
- [Chrome 整合](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration/)
- [Scheduled Tasks](/posts/tech/deep-dive/2026-03-27-claude-code-scheduled-tasks-guide/)
- [Checkpointing](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide/)

**其他：**
- [Spinner Verbs 完整清單](/posts/tech/2026-03-30-claude-code-spinner-verbs/)
- [除錯與疑難排解合集](/posts/tech/2026-03-28-claude-code-troubleshooting-collection/)
- [/loop 排程功能](/posts/tech/2026-03-16-claude-code-loop-scheduling/)
- [Skill vs Subagent 比較](/posts/ai/2026-03-30-skill-vs-subagent-comparison/)

## 參考資源

- [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code)
- [Claude Code 官方文件](https://code.claude.com/docs/en/setup)
- [Claude Code 產品頁](https://claude.com/product/claude-code)
- [功能總覽](https://code.claude.com/docs/en/features-overview)
- [npm - @anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)
