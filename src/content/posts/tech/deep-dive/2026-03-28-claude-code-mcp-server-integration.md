---
title: "Claude Code × MCP Server：讓 AI 連上你的所有工具"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, mcp, mcp-server, ai-agent, integration, dx]
lang: zh-TW
tldr: "MCP（Model Context Protocol）讓 Claude Code 透過標準協議連上外部工具——GitHub、Slack、資料庫、自製 API 都行。本文介紹 MCP 的運作原理、如何設定 server、實際串接案例，以及安全考量。"
description: "從 MCP 協議基礎開始，介紹如何在 Claude Code 中設定和使用 MCP Server，包含官方與社群 server 的比較、自製 server 的開發方式、以及在自動化流程中整合 MCP 的實際案例。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 10
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en)

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

## 參考資料

- [Claude Code MCP 整合 — 官方文件](https://docs.anthropic.com/en/docs/claude-code/mcp) — 從安裝到管理 MCP server 的完整官方指南，含 stdio/HTTP transport
- [Model Context Protocol 官方介紹](https://modelcontextprotocol.io/introduction) — MCP 協議的設計理念、架構與使用情境
- [MCP 規格文件](https://spec.modelcontextprotocol.io/) — MCP 協議的完整技術規格，含 tool、resource、prompt 定義
- [MCP TypeScript SDK — GitHub](https://github.com/modelcontextprotocol/typescript-sdk) — 官方 TypeScript SDK，用於建立 MCP server
- [MCP Python SDK — GitHub](https://github.com/modelcontextprotocol/python-sdk) — 官方 Python SDK，用於建立 MCP server
- [Awesome MCP Servers — GitHub](https://github.com/punkpeye/awesome-mcp-servers) — 社群整理的 MCP server 清單，含 GitHub、Slack、資料庫等整合
- [Claude Code Managed MCP Configuration](https://docs.anthropic.com/en/docs/claude-code/mcp#managed-mcp-configuration) — 企業環境集中管理 MCP server 的官方設定方式
- [MCP Inspector — 除錯工具](https://modelcontextprotocol.io/docs/tools/inspector) — MCP server 的官方除錯工具
