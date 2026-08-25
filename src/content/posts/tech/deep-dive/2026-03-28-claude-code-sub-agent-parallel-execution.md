---
title: "Claude Code Sub-agents 完整指南：自訂 AI 子代理與平行執行"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, sub-agent, parallel-execution, worktree, ai-agent, dx, plugins]
lang: zh-TW
tldr: "Sub-agent 是在獨立 context window 中執行的專業 AI 助手。用 markdown 檔案定義 system prompt、工具權限、模型選擇，Claude 自動在適當時機委派任務。內建 Explore、Plan、general-purpose 三種，也可以自訂。搭配 persistent memory 跨 session 累積知識。"
description: "深入介紹 Claude Code 的 Sub-agent 系統：內建子代理類型、自訂子代理的完整設定（frontmatter 欄位、工具控制、MCP 整合、hooks、persistent memory）、前台 vs 背景執行、與 Agent Teams 的比較，以及實際案例。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 11
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/sub-agents.md -->

## 預計大綱

### Sub-agent 是什麼
- 在獨立 context window 中執行的專業 AI 助手
- 有自己的 system prompt、工具權限、模型設定
- Claude 自動根據 description 委派任務
- 保護主對話的 context window 不被塞滿

### 內建 Sub-agents
| 類型 | 模型 | 工具 | 用途 |
|------|------|------|------|
| **Explore** | Haiku（快速） | 唯讀 | 搜尋、分析 codebase |
| **Plan** | 繼承主對話 | 唯讀 | Plan mode 時的研究 |
| **General-purpose** | 繼承主對話 | 全部 | 複雜多步驟任務 |
| **Bash** | 繼承 | 終端指令 | 獨立 context 中跑指令 |
| **Claude Code Guide** | Haiku | — | 回答 Claude Code 問題 |

### 建立自訂 Sub-agent

#### 用 /agents 互動介面
- `/agents` 建立、編輯、刪除
- 選擇 scope：Personal vs Project
- 用 Claude 自動產生設定

#### 手動寫 Markdown 檔案
```markdown
---
name: code-reviewer
description: Expert code review specialist
tools: Read, Glob, Grep, Bash
model: sonnet
---
你是一個資深 code reviewer...
```

#### Scope 與優先序
| 位置 | Scope | 優先序 |
|------|-------|--------|
| `--agents` CLI flag | 當前 session | 最高 |
| `.claude/agents/` | 當前專案 | 2 |
| `~/.claude/agents/` | 所有專案 | 3 |
| Plugin 的 agents/ | Plugin 啟用處 | 最低 |

### 完整設定欄位（Frontmatter）
- `name`、`description`（必填）
- `tools` / `disallowedTools`：工具控制
- `model`：sonnet / opus / haiku / inherit / 完整 model ID
- `permissionMode`：default / acceptEdits / dontAsk / bypassPermissions / plan
- `maxTurns`：最大 agentic 回合數
- `skills`：預載入的 skills
- `mcpServers`：MCP server 設定（inline 或引用）
- `hooks`：lifecycle hooks
- `memory`：persistent memory scope（user / project / local）
- `background`：是否背景執行
- `effort`：effort level
- `isolation`：worktree 隔離

### Persistent Memory
- `memory: user` → `~/.claude/agent-memory/<name>/`
- `memory: project` → `.claude/agent-memory/<name>/`
- `memory: local` → `.claude/agent-memory-local/<name>/`
- 跨 session 累積知識：codebase patterns、debug insights
- MEMORY.md 自動管理

### 工具與權限控制
- `tools` allowlist vs `disallowedTools` denylist
- `Agent(worker, researcher)` 限制可 spawn 的子代理
- MCP servers scoped to sub-agent
- PreToolUse hooks 做條件驗證

### 前台 vs 背景執行
- 前台：阻塞主對話直到完成
- 背景：並行執行，Ctrl+B 轉背景
- 背景模式的權限預批准機制

### 呼叫方式
- 自然語言：Claude 根據 description 自動委派
- @-mention：保證使用特定 sub-agent
- `--agent <name>`：整個 session 以 sub-agent 身份運行
- 設定 `"agent": "name"` 作為專案預設

### 與 Agent Teams 的比較
| | Sub-agents | Agent Teams |
|---|---|---|
| Context | 獨立，結果回傳呼叫者 | 完全獨立 |
| 溝通 | 只能回報給主代理 | 互相直接溝通 |
| 適合 | 專注任務，只需結果 | 需要協作的複雜工作 |
| Token 成本 | 較低 | 較高 |

### 實際案例
- Code Reviewer：唯讀子代理，checklist 式審查
- Debugger：可編輯，root cause → fix → verify 流程
- Data Scientist：SQL 分析專家
- DB Reader：搭配 PreToolUse hook 限制唯讀查詢

## 參考資料

- [Claude Code Create Custom Subagents — 官方文件](https://docs.anthropic.com/en/docs/claude-code/sub-agents) — Sub-agent 的完整設定說明，含 frontmatter 欄位、工具控制、persistent memory
- [Claude Code Run Agent Teams — 官方文件](https://docs.anthropic.com/en/docs/claude-code/agent-teams) — Agent Teams 與 Sub-agents 的差異，以及多代理並行架構
- [Claude Code Hooks — 官方文件](https://docs.anthropic.com/en/docs/claude-code/hooks) — PreToolUse/PostToolUse hooks 用於條件驗證的完整說明
- [Claude Code Programmatic Usage & SDK](https://docs.anthropic.com/en/docs/claude-code/programmatic-usage) — 用 SDK 控制 sub-agent 並行執行的方式
- [Claude Code MCP Scoped to Subagent](https://docs.anthropic.com/en/docs/claude-code/sub-agents#scope-mcp-servers-to-a-subagent) — 將 MCP server 範圍限定在特定 sub-agent 的設定方式
- [Claude Code Settings — Subagent Configuration](https://docs.anthropic.com/en/docs/claude-code/settings#subagent-configuration) — 在 settings.json 中配置 sub-agent 的相關欄位
- [Anthropic 官方部落格 — Multi-agent frameworks](https://www.anthropic.com/research/building-effective-agents) — 多代理系統的設計模式與最佳實踐研究
