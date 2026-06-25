---
title: "Claude Code DevContainer & Sandboxing：在隔離環境中安全使用 AI"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, devcontainer, sandboxing, docker, security, dx]
lang: zh-TW
tldr: "DevContainer 讓 Claude Code 跑在標準化的容器環境中——依賴、工具、設定全部一致。Sandboxing 限制 Bash 指令的檔案系統和網路存取。兩者搭配是 YOLO 模式最安全的用法。"
description: "介紹 Claude Code 的 DevContainer 支援和 Sandboxing 機制：devcontainer.json 設定、在 GitHub Codespaces 中使用、Sandbox 的檔案系統和網路限制、與 bypassPermissions 模式的搭配，以及企業環境中的安全部署策略。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 25
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/devcontainer.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/sandboxing.md -->

## 預計大綱

### DevContainer 是什麼
- 標準化的容器開發環境
- devcontainer.json 定義環境
- 依賴、工具、設定一致性
- 適合團隊、CI/CD、遠端開發

### 在 DevContainer 中使用 Claude Code
- devcontainer.json 設定範例
- GitHub Codespaces 整合
- 本地 VS Code + Docker
- 特殊考量：PATH、auth、MCP servers

### Sandboxing 機制
- Bash 指令的隔離執行
- 檔案系統限制：只能存取工作目錄
- 網路限制：`--network none`
- `--sandbox` / `--no-sandbox` flag

### 安全等級組合
| 組合 | 安全性 | 便利性 |
|------|--------|--------|
| default mode | ★★★★★ | ★★ |
| auto mode | ★★★★ | ★★★★ |
| bypass + sandbox | ★★★ | ★★★★ |
| bypass + Docker --network none | ★★★★ | ★★★ |
| bypass 裸跑 | ★ | ★★★★★ |

### 企業部署策略
- Server-managed settings 強制 sandbox
- 禁用 bypassPermissions
- 統一 DevContainer 環境
- 網路隔離策略

## 參考資料

- [Claude Code Development Containers — 官方文件](https://docs.anthropic.com/en/docs/claude-code/devcontainer) — Anthropic 官方 devcontainer 設定說明，含防火牆規則與 VS Code 整合
- [Claude Code Sandboxing — 官方設定文件](https://docs.anthropic.com/en/docs/claude-code/settings#sandbox-settings) — settings.json 中 sandbox 完整欄位說明，含 filesystem 與 network 限制選項
- [VS Code Dev Containers 官方文件](https://code.visualstudio.com/docs/devcontainers/containers) — VS Code Dev Containers extension 使用指南
- [devcontainer.json 規格參考](https://containers.dev/implementors/json_reference/) — Dev Container 規格的官方 JSON reference
- [GitHub Codespaces 快速入門](https://docs.github.com/en/codespaces/getting-started/quickstart) — 在 GitHub Codespaces 中使用 devcontainer 的官方教學
- [Claude Code 權限模式說明](https://docs.anthropic.com/en/docs/claude-code/permissions) — bypassPermissions 與各種權限模式的完整比較
- [Claude Code 企業網路設定](https://docs.anthropic.com/en/docs/claude-code/network-configuration) — 企業環境的網路設定與代理伺服器配置指南
