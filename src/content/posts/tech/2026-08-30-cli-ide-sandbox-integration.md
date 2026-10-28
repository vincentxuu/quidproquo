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

> 🌏 [English version](/posts/tech/2026-08-30-cli-ide-sandbox-integration-en)

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
| 本地 OS 沙箱 | OpenCode、Codex CLI、Cursor | 中 | 本地開發、程式碼生成與執行 |
| 容器/VM 沙箱 | 某些企業版 IDE | 強 | 多租戶、不信任程式碼 |

本文聚焦 **本地 OS 沙箱**，因為這是目前大多數 CLI agent 與 IDE 採用的模式。

---

## OpenCode 本地沙箱設定

OpenCode 使用本地 OS 原語（macOS Seatbelt、Linux bubblewrap/Landlock）對每條 Bash 指令強制同一套邊界。

### 關鍵設定

```json
// ~/.opencode/settings.json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["./", "./src", "./tmp"],
      "denyRead": ["~/.ssh", "~/.aws", "~/.env", "/etc/passwd"]
    },
    "network": {
      "allowedDomains": ["api.opencode.dev", "github.com"],
      "strictAllowlist": true
    },
    "process": {
      "maxProcesses": 64,
      "maxMemoryMB": 512
    }
  }
}
```

### 隔離邊界

| 層級 | 限制內容 | 說明 |
|------|----------|------|
| 檔案系統 | 寫入限工作目錄 + session temp | 防止寫入系統檔案 |
| 檔案系統 | 讀取預設整機可讀，但可用 denyRead 封鎖 | 需要主動設定 |
| 網路 | 預設零網域，需主動 allowlist | 防止橫向移動 |
| 行程 | PID 上限、記憶體上限 | 防止 fork bomb |
| 能力 | Drop SYS_ADMIN 等高危能力 | 防止權限提權 |

---

## Codex CLI 本地沙箱設定

Codex CLI 使用容器或本地 OS 沙箱，視平台而定。

### 基本用法

```bash
# 啟用沙箱模式
codex --sandbox enabled

# 指定工作目錄
codex --sandbox-workdir ./workspace

# 限制網路
codex --sandbox-network allowlist github.com,api.openai.com
```

### 常見陷阱

1. **Docker socket 未封鎖**：如果 Codex CLI 可以存取 `/var/run/docker.sock`，它可以啟動新容器，繞過沙箱限制。
2. **SSH 金鑰外洩**：`~/.ssh/id_rsa` 預設可讀，需要顯式封鎖。
3. **環境變數繼承**：AWS 憑證、API 金鑰可能透過環境變數傳入沙箱。

---

## Cursor 本地沙箱設定

Cursor 的沙箱模式主要針對其 agent 模式（Composer、Chat）。

### 設定入口

Cursor 的沙箱設定在 `Settings > Features > Agent > Sandbox`：

```json
{
  "agent.sandbox.enabled": true,
  "agent.sandbox.docker.enabled": false,
  "agent.sandbox.local.enabled": true,
  "agent.sandbox.local.readOnlyPaths": [
    "~/.ssh",
    "~/.aws",
    "~/.config/git/credentials"
  ],
  "agent.sandbox.local.writePaths": [
    "${workspaceFolder}"
  ]
}
```

### 常見問題

- **Git hook 被執行**：agent 修改程式碼後，Git hook 可能自動執行，導致惡意程式碼在沙箱外運行。CVE-2026-50548 正是這類漏洞。
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
2. OpenCode、Codex CLI、Cursor 的本地沙箱設定方式。
3. 五個常見陷阱：Docker socket、SSH 金鑰、環境變數、Git hook、工作目錄逃逸。
4. 五個安全最佳實踐：封鎖 Docker socket、敏感路徑、網路 allowlist、行程限制、短效憑證。
5. 沙箱不是「有沒有」的問題，而是「設得多緊」的選擇題。

---

## 參考資料

- [OpenCode Documentation](https://opencode.dev/)
- [Codex CLI Documentation](https://platform.openai.com/docs/codex)
- [Cursor Documentation](https://cursor.sh/docs)
- [CVE-2026-50548: Cursor Code Editor RCE Vulnerability](https://www.sentinelone.com/vulnerability-database/cve-2026-26268)
- [CVE-2026-25725: Claude Code Bubblewrap Sandbox Escape](https://cymulate.com/blog/the-race-to-ship-ai-tools-left-security-behind-part-1-sandbox-escape)
- [本站：Claude Code 沙箱怎麼運作（order 5）](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
