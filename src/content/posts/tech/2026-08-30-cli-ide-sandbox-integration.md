---
title: "CLI agent 與 IDE 沙箱整合"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, cli-agent, ide, opencode, codex, cursor, local-sandbox, ai-agent]
lang: zh-TW
tldr: "沙箱系列的本地產品篇（order 6）。OpenCode、Codex CLI、Cursor 等 CLI agent 與 IDE 的本地沙箱怎麼設定、隔離邊界在哪、常見陷阱與安全最佳實踐。"
description: "CLI agent 與 IDE 沙箱整合：OpenCode、Codex CLI、Cursor 本地沙箱設定、隔離邊界、權限管理、常見陷阱與安全實踐。"
series:
  name: "沙箱系列"
  order: 6
draft: false
---

> :globe: [English version](/posts/tech/2026-08-30-cli-ide-sandbox-integration-en)

## 本文定位

這篇是沙箱系列的「本地產品篇」（order 6）。它不講單一供應商的技術細節（Claude Code 在 order 5），而是聚焦 **CLI agent 與 IDE 的本地沙箱整合**：

1. **OpenCode、Codex CLI、Cursor 等 CLI agent 的本地沙箱怎麼設定？**
2. **隔離邊界在哪？** —— 檔案系統、網路、子行程、憑證。
3. **常見陷阱有哪些？** —— Docker socket、SSH 金鑰、Git hook、環境變數。
4. **安全最佳實踐是什麼？**

---

## CLI agent 與 IDE 沙箱的現狀

現代 CLI agent（OpenCode、Codex CLI、Antigravity CLI、Kiro）與 IDE agent（Cursor、Windsurf、Copilot 在本地模式）都需要執行使用者程式碼。它們的沙箱模式大致分為三類：

| 模式 | 代表工具 | 隔離強度 | 適用場景 |
|------|----------|----------|----------|
| 無沙箱 | 早期 Copilot、部分 IDE 外掛 | 弱 | 僅讀取、不執行程式碼 |
| 只有權限規則 | OpenCode | 弱 | 放行的指令擁有完整帳號權限 |
| 本地 OS 沙箱 | Codex CLI、Cursor、Claude Code | 中 | 本地開發、程式碼生成與執行 |
| 容器/VM 沙箱 | 某些企業版 IDE | 強 | 多租戶、不信任程式碼 |

本文聚焦 **本地 OS 沙箱**，因為這是目前大多數 CLI agent 與 IDE 採用的模式。

---

## OpenCode：只有權限規則，沒有 OS 沙箱

OpenCode 目前沒有內建的 OS 層沙箱。它的[權限系統](https://opencode.ai/docs/permissions)決定 agent 能不能做某個動作，例如執行 shell 指令前要不要問、哪些 Git 指令直接放行；指令一旦放行，就以你的帳號權限在本機執行，看得到你看得到的一切。本系列〈[沙箱與遠端執行](/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution)〉也查到，repo 裡的 `packages/containers/` 是 CI 用的映像，不是執行期隔離。

### 關鍵設定

```jsonc
// opencode.jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [
    { "action": "shell", "resource": "*", "effect": "ask" },
    { "action": "shell", "resource": "git status *", "effect": "allow" },
    { "action": "shell", "resource": "git push *", "effect": "deny" },
    { "action": "external_directory", "resource": "*", "effect": "ask" }
  ]
}
```

### 隔離邊界

| 層級 | 限制內容 | 說明 |
|------|----------|------|
| 動作 | 依規則 allow／ask／deny | 只管 agent 要不要做，不管放行後碰到什麼 |
| 專案外路徑 | `external_directory` 預設放行 | 要詢問得自己加規則 |
| 檔案系統、網路、行程 | 無 OS 層限制 | 放行的指令擁有你的完整帳號權限 |

要在 OpenCode 上得到真正的隔離，得把它整個跑進容器、VM 或遠端沙箱。

---

## Codex CLI 本地沙箱設定

Codex CLI 用各平台原生機制做 OS 層沙箱：macOS 用 Seatbelt，Linux 與 WSL2 用 bubblewrap，PowerShell 下用原生 Windows 沙箱。

### 基本用法

```bash
# 預設：可讀檔、工作目錄內可寫、可跑一般指令，網路預設關
codex --sandbox workspace-write

# 只讀，不改檔也不執行指令（除非核准）
codex -s read-only

# 指定工作目錄，並額外開放一個可寫目錄
codex -C ./workspace --add-dir ../shared

# 完全不套沙箱，只在已經隔離的環境（容器、VM）裡用
codex --sandbox danger-full-access
```

要依網域放行網路，得在 `config.toml` 開實驗性的 `features.network_proxy`（預設關），而且它只過濾沙箱內指令的流量，不管 web search、MCP 等其他工具。

### 常見陷阱

1. **Docker socket 未封鎖**：如果 Codex CLI 可以存取 `/var/run/docker.sock`，它可以啟動新容器，繞過沙箱限制。
2. **SSH 金鑰外洩**：`~/.ssh/id_rsa` 預設可讀，需要顯式封鎖。
3. **環境變數繼承**：AWS 憑證、API 金鑰可能透過環境變數傳入沙箱。

---

## Cursor 本地沙箱設定

Cursor 的沙箱只管 agent 的終端機指令，設定入口在 `Settings > Agents > Approvals & Execution`。Auto-review 模式會盡量把 shell 指令放進沙箱跑，沙箱跑不了的才交給分類器審查；分類器本身不是安全邊界。

### 設定檔

沙箱能碰到什麼寫在 `~/.cursor/sandbox.json`（全機）或專案的 `.cursor/sandbox.json`（優先）：

```json
{
  "type": "workspace_readwrite",
  "readBoundary": "workspace",
  "additionalReadonlyPaths": ["~/.config/tool"],
  "networkPolicy": {
    "default": "deny",
    "allow": ["registry.npmjs.org", "*.github.com"]
  }
}
```

預設是工作目錄可讀寫、網路預設拒絕；私有網段與雲端 metadata 端點（`169.254.169.254`）一律擋。`.git/hooks/**`、`.git/config`、`.vscode/**`、`.cursor/*.json` 等路徑永遠寫保護，`sandbox.json` 改不掉。讀取範圍預設是整台機器（System），設成 Workspace 才會在讀專案外檔案前先問。

### 常見問題

- **Git hook 被執行**：agent 修改程式碼後，Git hook 可能自動執行，導致惡意程式碼在沙箱外運行。CVE-2026-26268（寫入 `.git` 設定逃出沙箱，2.5 版修補）正是這類漏洞，現在 `.git/hooks` 已列為寫保護。
- **工作目錄逃逸**：agent 透過 `../` 路徑訪問工作空間外檔案。

---

## 跨工具的常見陷阱

### 陷阱 1：Docker socket 未封鎖

如果 agent 可以存取 Docker socket，它可以啟動新容器，繞過所有沙箱限制。

**防禦**：
```
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly
```
不要將 Docker socket 掛載到沙箱內。

### 陷阱 2：SSH 金鑰與雲端憑證

`~/.ssh/id_rsa`、`~/.aws/credentials`、`~/.env` 預設可讀。

**防禦**：
- 使用 `denyRead` 封鎖敏感路徑
- 使用短效憑證代理，而非長期金鑰
- 環境變數不應傳入沙箱

### 陷阱 3：Git hook 自動執行

Agent 修改程式碼後，Git hook（pre-commit、post-commit）可能自動執行。

**防禦**：
- 在沙箱內禁用 Git hook
- 或將 Git hook 設為唯讀

### 陷阱 4：環境變數繼承

`OPENAI_API_KEY`、`ANTHROPIC_API_KEY` 等環境變數可能傳入沙箱，agent 可以竊取並外洩。

**防禦**：
- 不將完整 API 金鑰傳入沙箱環境
- 使用憑證代理（credential broker）按需注入

---

## 安全最佳實踐清單

| 項目 | 建議 | 優先級 |
|------|------|--------|
| 封鎖 Docker socket | 不將 Docker socket 掛載到沙箱 | 高 |
| 封鎖敏感路徑 | denyRead `~/.ssh`, `~/.aws`, `~/.env` | 高 |
| 網路 allowlist | 預設無出網，僅允許必要域名 | 高 |
| 限制行程數 | PID 上限、記憶體上限 | 中 |
| 禁用 Git hook | 沙箱內不執行 Git hook | 中 |
| 短效憑證 | 使用憑證代理，不傳長期金鑰 | 中 |
| 審計日誌 | 記錄所有檔案與網路操作 | 中 |

---

## 讀完本文你應該理解

1. CLI agent 與 IDE 的三種沙箱模式與適用場景。
2. OpenCode 的權限規則，以及 Codex CLI、Cursor 的本地沙箱設定方式。
3. 五個常見陷阱：Docker socket、SSH 金鑰、環境變數、Git hook、工作目錄逃逸。
4. 五個安全最佳實踐：封鎖 Docker socket、敏感路徑、網路 allowlist、行程限制、短效憑證。
5. 沙箱不是「有沒有」的問題，而是「設得多緊」的選擇題。

---

## 更新紀錄

- 2026-11-23：OpenCode 改正為沒有 OS 沙箱、只有權限規則，設定範例改為官方的 `opencode.jsonc` `permissions`；Codex CLI 旗標改為實際的 `--sandbox read-only|workspace-write|danger-full-access`、`-C`、`--add-dir`；Cursor 改為 `sandbox.json` 與 `Settings > Agents > Approvals & Execution`，補寫保護路徑；Cursor CVE 的編號改為與連結一致的 CVE-2026-26268。

## 參考資料

- [OpenCode Permissions](https://opencode.ai/docs/permissions)
- [Codex Sandboxing](https://developers.openai.com/codex/sandboxing) 與 [Codex CLI reference](https://developers.openai.com/codex/cli/reference)
- [Cursor Run Modes](https://cursor.com/docs/agent/run-modes) 與 [sandbox.json reference](https://cursor.com/docs/reference/sandbox)
- [CVE-2026-26268: Cursor sandbox escape via .git configuration](https://www.sentinelone.com/vulnerability-database/cve-2026-26268)
- [CVE-2026-25725: Claude Code Bubblewrap Sandbox Escape](https://cymulate.com/blog/the-race-to-ship-ai-tools-left-security-behind-part-1-sandbox-escape)
- [本站：Claude Code 沙箱怎麼運作（order 5）](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
