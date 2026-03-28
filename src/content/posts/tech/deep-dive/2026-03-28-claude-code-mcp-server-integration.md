---
title: "Claude Code × MCP Server：讓 AI 連上你的所有工具"
date: 2026-03-28
category: tech
tags: [claude-code, mcp, mcp-server, ai-agent, integration, dx]
lang: zh-TW
tldr: "MCP（Model Context Protocol）讓 Claude Code 透過標準協議連上外部工具——GitHub、Slack、資料庫、自製 API 都行。本文介紹 MCP 的運作原理、如何設定 server、實際串接案例，以及安全考量。"
description: "從 MCP 協議基礎開始，介紹如何在 Claude Code 中設定和使用 MCP Server，包含官方與社群 server 的比較、自製 server 的開發方式、以及在自動化流程中整合 MCP 的實際案例。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 9
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### MCP 是什麼
- Model Context Protocol 簡介
- 為什麼需要標準化的工具連接協議
- MCP vs 直接呼叫 API 的差異

### 在 Claude Code 中設定 MCP Server
- settings.json 中的 mcpServers 欄位
- stdio vs HTTP transport
- 環境變數與認證設定

### 官方與社群 MCP Server
- GitHub MCP Server
- Slack MCP Server
- Filesystem / Database server
- 社群生態系統概覽

### 自製 MCP Server
- 什麼時候需要自製
- 用 TypeScript/Python 建立 MCP server
- Tool 定義與 schema 設計
- 測試與除錯

### 實際整合案例
- Claude Code + GitHub MCP：自動管理 issues 和 PR
- Claude Code + Slack MCP：每日摘要自動推送
- Claude Code + 自製 API MCP：串接內部系統

### 安全考量
- MCP server 的信任模型
- --dangerously-skip-permissions 對 MCP 的影響
- 最小權限原則的實踐
