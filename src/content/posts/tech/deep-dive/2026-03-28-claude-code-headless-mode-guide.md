---
title: "Claude Code Headless Mode：用 claude -p 程式化執行 AI 開發任務"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, headless, agent-sdk, cli, automation, scripting, ci-cd, dx]
lang: zh-TW
tldr: "claude -p 是 Claude Code 的程式化執行模式。一行指令跑完任務、pipe 資料進去、拿 JSON 結構化輸出。搭配 --bare 跳過所有自動載入，適合 CI/CD 和腳本。也可以用 --json-schema 強制輸出符合 schema 的結構化資料。"
description: "完整介紹 Claude Code 的 Headless Mode（claude -p）：基本用法、--bare 快速模式、structured output、streaming、auto-approve tools、continue conversations，以及與 Agent SDK（Python/TypeScript）的關係。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 2
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/headless.md -->

## 預計大綱

### Headless Mode 是什麼
- `claude -p "prompt"` 非互動式執行
- Agent SDK 的 CLI 入口
- 適合腳本、CI/CD、pipe 資料

### 基本用法
```bash
claude -p "What does the auth module do?"
claude -p "Fix TypeScript errors in src/auth.ts" --allowedTools "Read,Edit,Bash(tsc:*)"
```

### --bare 快速模式
- 跳過 hooks、skills、plugins、MCP servers、CLAUDE.md 載入
- 比標準模式啟動更快
- CI/CD 推薦使用
- 手動指定需要的 context：
  - `--append-system-prompt`
  - `--settings <file>`
  - `--mcp-config <file>`
  - `--agents <json>`

### Structured Output
```bash
# JSON 輸出（含 session ID、metadata）
claude -p "Summarize this project" --output-format json

# 指定 JSON Schema
claude -p "Extract function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}'
```

### Streaming
```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```
- `stream-json`：每行一個 JSON event
- 搭配 jq 過濾 text delta

### Auto-approve Tools
```bash
claude -p "Run tests and fix failures" --allowedTools "Bash,Read,Edit"
```
- Permission rule syntax：`Bash(git diff *)`（空格+星號=前綴匹配）

### Continue Conversations
```bash
# 繼續最近的對話
claude -p "Now focus on database queries" --continue

# 繼續特定 session
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

### 實際案例
- 批次修 lint 錯誤
- Git commit with AI message
- PR diff → security review
- 搭配 shell loop 批次處理

### 與 Agent SDK 的關係
- CLI 是 Agent SDK 的入口之一
- Python / TypeScript SDK 提供更多控制
- 結構化 output、tool approval callbacks、native message objects

## 參考資料

- [Claude Code CLI Reference — 官方文件](https://docs.anthropic.com/en/docs/claude-code/cli-reference) — claude -p、--bare、--output-format 等所有 CLI flags 的完整說明
- [Claude Code Programmatic Usage — 官方文件](https://docs.anthropic.com/en/docs/claude-code/programmatic-usage) — Headless mode 與 Agent SDK 整合的官方指南
- [Claude Code GitHub Actions — 官方文件](https://docs.anthropic.com/en/docs/claude-code/github-actions) — 在 CI/CD 環境中使用 claude -p 的實際範例
- [Claude Code Common Workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows) — 批次處理、pipe 資料、腳本自動化的實際案例
- [Anthropic Agent SDK — 官方文件](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/sdk) — Python 與 TypeScript SDK 的完整 API 參考
- [Claude Code Permission Rule Syntax](https://docs.anthropic.com/en/docs/claude-code/permissions#permission-rule-syntax) — --allowedTools 的規則語法，包含 Bash 前綴匹配
- [jq 官方文件](https://jqlang.org/manual/) — 搭配 stream-json 輸出做資料過濾的工具參考
