---
title: "Claude Code settings.json 設定大全：打造你的專屬開發環境"
date: 2026-03-28
category: tech
tags: [claude-code, configuration, settings, dx, hooks, permissions]
lang: zh-TW
tldr: "settings.json 是 Claude Code 所有行為的控制中心。Hook、權限、模型選擇、MCP server、工具黑名單全部在這裡設定。本文整理所有可用欄位、全域 vs 專案層級的差異，以及常見設定組合。"
description: "完整整理 Claude Code settings.json 的所有設定欄位、全域與專案層級的繼承規則、settings.local.json 的用途，以及針對不同開發場景的推薦設定組合。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 4
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### settings.json 在哪裡
- `~/.claude/settings.json`（全域）
- `.claude/settings.json`（專案）
- `.claude/settings.local.json`（本地，不進 git）
- 三者的合併規則

### 完整欄位清單
- hooks：事件驅動自動化
- permissions：工具權限控制
- allowedTools / disallowedTools
- model：預設模型選擇
- mcpServers：MCP server 設定
- env：環境變數注入

### 全域 vs 專案設定的設計策略
- 什麼適合放全域（個人偏好、通用 hooks）
- 什麼適合放專案（團隊規範、專案特定工具）
- settings.local.json 的使用時機

### 常見設定組合
- 安全開發組合：Hook 擋危險指令 + disallowedTools
- 自動化組合：commit hook + format hook + lint hook
- 團隊協作組合：統一 model + 共用 MCP server

### 除錯技巧
- 設定不生效的常見原因
- 如何確認哪個層級的設定被載入
- JSON 語法錯誤的排查

## 參考資料

- [Claude Code Settings — 官方完整文件](https://docs.anthropic.com/en/docs/claude-code/settings) — settings.json 所有欄位的完整說明，含全域、專案、本地三層設定
- [Claude Code Permissions — 官方文件](https://docs.anthropic.com/en/docs/claude-code/permissions) — 權限規則語法、allow/deny 設定與工具特定規則
- [Claude Code Hooks — 官方文件](https://docs.anthropic.com/en/docs/claude-code/hooks) — 自動化 hook 的事件類型、設定格式與實際案例
- [Claude Code Environment Variables Reference](https://docs.anthropic.com/en/docs/claude-code/environment-variables) — 所有可用環境變數的完整清單
- [Claude Code MCP Configuration](https://docs.anthropic.com/en/docs/claude-code/mcp#mcp-installation-scopes) — mcpServers 在不同 scope 的設定位置與格式
- [JSON Schema for Claude Code Settings](https://json.schemastore.org/claude-code-settings.json) — settings.json 的官方 JSON Schema，可在 VS Code 中啟用自動補全
- [Claude Code Managed Settings — 企業部署](https://docs.anthropic.com/en/docs/claude-code/settings#settings-precedence) — managed-settings.json 的優先層級與企業級設定方式
