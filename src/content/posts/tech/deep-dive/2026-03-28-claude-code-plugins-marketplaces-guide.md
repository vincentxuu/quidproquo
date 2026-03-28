---
title: "Claude Code Plugins & Marketplaces：打包分發你的 AI 工作流程"
date: 2026-03-28
category: tech
tags: [claude-code, plugins, marketplace, skills, agents, hooks, dx]
lang: zh-TW
tldr: "Plugin 把 skills、agents、hooks、MCP servers 打包成一個可安裝的單位。透過 Marketplace 分發給團隊或社群。從 .claude/ 單檔設定到 plugin 只需要搬目錄加 manifest。"
description: "完整介紹 Claude Code 的 Plugin 系統：plugin 結構（manifest + skills + agents + hooks + MCP）、建立與測試方式、從 standalone 設定遷移到 plugin、Plugin Marketplace 的建立與分發，以及 LSP server 整合。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 12
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/plugins.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/plugin-marketplaces.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/discover-plugins.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/plugins-reference.md -->

## 預計大綱

### Plugin 是什麼
- 把 skills、agents、hooks、MCP servers 打包成可安裝的單位
- Standalone (.claude/) vs Plugin 的差異
- 命名空間：`/plugin-name:skill-name` 避免衝突
- 什麼時候該用 plugin vs standalone

### Plugin 結構
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # manifest
├── commands/                 # slash commands
├── skills/                   # Agent Skills (SKILL.md)
├── agents/                   # 自訂 sub-agents
├── hooks/
│   └── hooks.json           # event handlers
├── .mcp.json                # MCP server configs
├── .lsp.json                # LSP server configs
└── settings.json            # 預設設定
```

### 建立第一個 Plugin
- plugin.json manifest 格式
- 加入 skill
- 用 `--plugin-dir` 本地測試
- `/reload-plugins` 熱載入

### 進階 Plugin 功能
- 加入 Agent Skills
- 加入 LSP servers（語言伺服器）
- 加入預設 settings（如 agent 設定）
- 加入 hooks
- MCP server 整合

### 從 Standalone 遷移到 Plugin
- 搬 commands、agents、skills 目錄
- 遷移 hooks 到 hooks/hooks.json
- 測試驗證

### Plugin Marketplace
- 什麼是 Marketplace：一個包含多個 plugin 的 GitHub repo
- 建立自己的 Marketplace
- 安裝與管理 plugin：`/plugin install`
- 團隊級別的 marketplace 設定
- 提交到官方 Marketplace

### 安全考量
- Plugin agents 不支援 hooks、mcpServers、permissionMode
- Marketplace 的信任模型
- 團隊管理設定

### 實際案例
- 團隊共用的 code review plugin
- 專案模板 plugin（含 CLAUDE.md + skills + hooks）
- 語言特定的 LSP plugin
