---
title: "工具推薦｜AgentConfig Doctor — 在 commit 前掃出 agent 設定檔裡的金鑰、危險指令與過寬權限"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "本機執行的 CLI，掃描 Claude Code、Cursor、VS Code 的 MCP 與權限設定，抓出外洩金鑰、curl | sh 這類危險指令、整個檔案系統的存取權，以及跟基準比對多出來的 MCP server"
tldr: "AgentConfig Doctor 是一個 agent 設定檔的靜態掃描器。安裝：目前從原始碼 `npm ci && npm run build`（npm 版尚未發布）。解決了 `.mcp.json`、`.claude/settings.json` 這類檔案沒人審、出事也看不出被改過的問題。"
series:
  name: "AI Tool of the Day"
  order: 55
---

> 🌏 [English version](/posts/daily/2026-10-15-tool-agentconfig-doctor-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | AgentConfig Doctor |
| 類型 | CLI（設定檔安全掃描器） |
| GitHub | [vasikmansuri/agentconfig-doctor](https://github.com/vasikmansuri/agentconfig-doctor) |
| Stars | 3（2026-10-14 建立） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `git clone` 後 `npm ci && npm run build`（npm 發布後可用 `npx agentconfig-doctor scan`） |

## 解決什麼問題

專案裡的 `.mcp.json`、`.claude/settings.json`、`.cursor/mcp.json` 決定了 coding agent 能啟動哪些 MCP server、能跑哪些指令、能碰哪些目錄。這些檔案常常跟著 repo 一起 commit，卻很少有人在 code review 時認真看。今天的 [Visual Studio Copilot 資安警報](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce)就是例子：被劫持的 agent 只要能改 `.mcp.json`，就能替自己加上一個會執行任意指令的 server。

AgentConfig Doctor 做的是靜態掃描：讀這些設定檔，依 11 條規則找出外洩的金鑰（GitHub、AWS、Anthropic、OpenAI 等格式）、下載後直接執行的指令、授權整個檔案系統或 `~/.ssh` 的參數、未鎖版本的 `npx` 套件、`enableAllProjectMcpServers` 搭配本機 server 這種危險組合，以及肉眼看不到的雙向 Unicode 字元。它不需要 AI API、不用帳號、不送遙測，也不會執行它掃到的指令。

最有用的是基準比對：先把現在接受的狀態存成 baseline，之後每次掃描只對新問題報錯，並列出權限變化，例如新增的 allow 規則、多出來的 MCP server 或 hook。適合放進 PR 的 CI，也適合接手別人的 repo 時先掃一次。

## 快速上手

### 安裝

```bash
# 需要 Node.js 22.12 以上；npm 版尚未發布，先從原始碼建置
git clone https://github.com/vasikmansuri/agentconfig-doctor.git
cd agentconfig-doctor
npm ci
npm run build
```

### 基本用法

```bash
node dist/cli.js scan /path/to/your/project              # 掃整個專案
node dist/cli.js scan ./my-project --fail-on medium      # medium 以上就回非 0
node dist/cli.js check-mcp ./my-project/.cursor/mcp.json # 只驗證 MCP 設定
node dist/cli.js scan ./my-project --format json --output report.json
node dist/cli.js rules                                   # 列出所有規則
```

### 進階用法

```bash
# 建立基準，之後只看新問題與權限變化（ACD009）
node dist/cli.js baseline create
git add .agentconfig-doctor-baseline.json
node dist/cli.js scan --baseline .agentconfig-doctor-baseline.json
```

README 也附了只需要 `contents: read`、不用任何 secret 的 GitHub Actions 範例，npm 版發布後即可直接用。

## 與現有工具的比較

| | AgentConfig Doctor | 通用 secret scanner（gitleaks 等） | 手動 code review |
|---|---|---|---|
| 抓外洩金鑰 | ✅ | ✅ | 看人 |
| 認得 MCP／agent 設定結構（server、hook、allow 規則） | ✅ | ❌ | 看人 |
| 抓危險組合（如自動啟用所有專案 MCP server） | ✅ | ❌ | 容易漏 |
| 跟基準比對權限變化 | ✅ | ❌ | ❌ |
| 不執行被掃描的內容、可在 fork PR 上跑 | ✅ | ✅ | — |

## 注意事項

- **非常新**：2026-10-14 才建立、3 顆星、0.1.0 pre-release，npm 版還沒發布。拿來當額外一道檢查可以，不要當成唯一的防線。
- **規則是靜態、字面比對**：作者自己寫明會有誤判（例如文件裡引用的 `curl | sh`），也抓不到混淆過的指令、路徑引用的腳本或套件內容。掃描乾淨不代表安全。
- **涵蓋範圍有限**：只認 Claude Code、Cursor、VS Code 的設定檔與 `CLAUDE.md`／`AGENTS.md`。Visual Studio 的 `settings.VisualStudio.json` 不在支援清單，家目錄下的設定要手動傳路徑才會掃。

## 今日收穫

之前以為 agent 設定檔的風險主要是金鑰外洩，看完規則表才發現更常見的是「組合」問題：每個設定單獨看都合理，合在一起卻讓本機 server 不經確認就啟動。這類問題 secret scanner 看不到，只能靠認得 agent 設定結構的工具或人。

## 參考資料

- [AgentConfig Doctor (vasikmansuri/agentconfig-doctor) — GitHub](https://github.com/vasikmansuri/agentconfig-doctor)
- [資安警報｜Visual Studio 與 SSMS 的 Copilot 多一個點就能改自己設定](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce)
- [Claude Code settings — Anthropic Docs](https://code.claude.com/docs/en/settings)
