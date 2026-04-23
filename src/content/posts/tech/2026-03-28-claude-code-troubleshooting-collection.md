---
title: "Claude Code 除錯與疑難排解合集：常見問題一次解決"
date: 2026-03-28
type: debug
category: tech
tags: [claude-code, troubleshooting, debugging, dx, skills, hooks, settings]
lang: zh-TW
tldr: "整理 Claude Code 使用中最常遇到的問題：Skills 找不到、Hook 不觸發、設定不生效、權限卡住、MCP 連不上。每個問題附原因分析和解法，省下你翻文件的時間。"
description: "彙整 Claude Code 常見的疑難排解情境，包含 Skill discovery 失敗、Hook 不觸發、settings.json 設定衝突、權限模式問題、MCP server 連線失敗等，每個問題提供症狀、原因分析與解決步驟。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 27
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### Skills 相關
- Global skills 在新 session 找不到（→ 連結到 order 15 的專題文章）
- Skill 執行到一半中斷
- Skill 的步驟被 AI 跳過

### Hooks 相關
- Hook 沒有被觸發
- Hook matcher 語法錯誤
- Hook command 執行失敗但沒有阻擋
- PreToolUse vs PostToolUse 選錯時機

### 設定相關
- settings.json 語法錯誤導致全部失效
- 全域 vs 專案設定衝突
- settings.local.json 沒被讀取

### 權限相關
- --dangerously-skip-permissions 開了但工具還是被擋
- allowedTools 在 bypass 模式下的已知 bug
- 子代理權限繼承問題

### MCP Server 相關
- MCP server 連線逾時
- 認證 token 過期
- Tool schema 不符預期

### 效能相關
- Context window 用滿導致行為異常
- 大型 repo 的啟動慢問題
- Token 用量異常高的排查

## 參考資料

- [Claude Code Troubleshooting](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) — Anthropic 官方疑難排解文件，涵蓋常見安裝與執行問題
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — settings.json 完整設定參考，包含 hooks、permissions、env 等欄位說明
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — Hook 事件類型、matcher 語法與 exit code 行為的官方說明
- [Claude Code Permission Modes](https://docs.anthropic.com/en/docs/claude-code/permission-modes) — 各種權限模式（default、acceptEdits、auto、bypassPermissions）的行為差異
- [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp) — MCP server 連線設定與 tool schema 說明
- [Explore the Context Window](https://docs.anthropic.com/en/docs/claude-code/context-window) — 互動式 context 消耗模擬，理解各功能對 token 的影響
- [Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices) — 官方推薦的使用模式，含 context 管理與除錯策略
