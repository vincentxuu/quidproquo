---
title: "OpenClaw Agent Runtime：Workspace、System Prompt 與 Bootstrap"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, agent, workspace, system-prompt, bootstrap, soul-md, agents-md]
lang: zh-TW
tldr: "OpenClaw 的 agent 有自己的「家」（Workspace），靠 AGENTS.md、SOUL.md 等 bootstrap 檔案定義人格和行為，System Prompt 每次動態組裝。"
description: "OpenClaw Agent 的 Workspace 結構、Bootstrap 檔案、System Prompt 組裝方式與自訂指南。"
draft: false
---

每個 OpenClaw agent 都有一個「家」——Workspace。裡面的 Markdown 檔案定義了 agent 是誰、怎麼說話、該做什麼。這篇講 Workspace 結構、Bootstrap 檔案的角色、和 System Prompt 是怎麼動態組裝的。

## Workspace

Workspace 是 agent 的唯一工作目錄，所有 file tool 的操作都在這裡。預設位置是 `~/.openclaw/workspace`。

**Workspace 不是 `~/.openclaw/`。** `~/.openclaw/` 放設定、憑證、session 歷史，Workspace 只放 agent 的「人格檔」和工作檔。

如果設了 `OPENCLAW_PROFILE`（不是 `default`），路徑變成 `~/.openclaw/workspace-<profile>`。

### 核心檔案

| 檔案 | 角色 |
|---|---|
| `AGENTS.md` | 操作指令，每次 session 開始時注入 |
| `SOUL.md` | 人格、語氣、邊界 |
| `USER.md` | 使用者資訊和稱呼偏好 |
| `IDENTITY.md` | Agent 名字、vibe、emoji |
| `TOOLS.md` | 工具使用慣例（指引用，不強制）|
| `HEARTBEAT.md` | 心跳執行的 checklist（選配）|
| `BOOT.md` | Gateway 重啟時的 startup checklist（選配）|
| `BOOTSTRAP.md` | 一次性初始化儀式，完成後刪除 |
| `MEMORY.md` | 長期記憶（選配，只在私人 session 載入）|
| `memory/YYYY-MM-DD.md` | 每日記憶 log |

### 不該放在 Workspace 的東西

設定檔、憑證、OAuth token、session transcript——這些都該在 `~/.openclaw/`。

### 備份策略

文件建議把 Workspace 當私人記憶，用 private Git repo 管理：

```bash
cd ~/.openclaw/workspace
git init && git add . && git commit -m "Initial workspace"
git remote add origin <private-repo-url> && git push -u origin main
```

永遠不要 commit secrets，用 `.gitignore` 排除。

### 遷移

Clone repo 到新機器的 `~/.openclaw/workspace`，跑 `openclaw setup` 補上缺少的檔案，session 另外遷移。

## Bootstrap 注入

每次新 session 的第一個 turn，這 8 個檔案會被注入到 context：

```
AGENTS.md → SOUL.md → TOOLS.md → IDENTITY.md → USER.md
→ HEARTBEAT.md → BOOTSTRAP.md → MEMORY.md
```

限制：
- 單檔上限 **20,000 字元**
- 總注入量上限 **150,000 字元**
- 超過的會被截斷，缺少的會標記一行 marker

不想建立 bootstrap 檔案的話：

```json5
{ agent: { skipBootstrap: true } }
```

## System Prompt 組裝

OpenClaw 不用靜態 system prompt，而是每次 agent 執行時動態組裝。跟 Pi（底層 coding agent）的預設 prompt 不同。

### 組成區塊

| 區塊 | 內容 |
|---|---|
| Tooling | 可用工具清單和簡述 |
| Safety | 安全護欄（advisory，不是強制的）|
| Skills | 按需載入的 skill 指令 |
| Self-Update | `config.apply` 和 `update.run` 指引 |
| Workspace | 工作目錄路徑 |
| Documentation | 本地文件路徑和使用指引 |
| Workspace Files | Bootstrap 檔案包含標記 |
| Sandbox | 沙箱啟用時的 runtime 細節 |
| Date & Time | UTC + 使用者時區 |
| Reply Tags | 支援的 provider 的語法 |
| Heartbeats | 心跳行為規格 |
| Runtime | Host、OS、Node 版本、模型、repo root、thinking level |
| Reasoning | 目前的可見性設定 |

**重要：** System prompt 裡的安全護欄是 **advisory**（引導模型行為）。真正的硬限制靠 tool policy、exec approvals、sandboxing。

### 三種模式

| 模式 | 用途 | 包含 |
|---|---|---|
| Full（預設）| 主要 agent 執行 | 所有區塊 |
| Minimal | Sub-agent | 排除 Skills、Memory、Self-Update、Heartbeat |
| None | 最精簡 | 只有 base identity line |

### 可設定項

```json5
{
  agents: {
    defaults: {
      userTimezone: "Asia/Taipei",
      timeFormat: "24",                    // auto | 12 | 24
      bootstrapMaxChars: 20000,           // 單檔上限
      bootstrapTotalMaxChars: 150000,      // 總量上限
    }
  }
}
```

## Skills 載入

Skills 從三個層級載入，高優先順序覆蓋低的：

1. **Workspace skills** — `<workspace>/skills`（最高）
2. **Project agent skills** — `<workspace>/.agents/skills`
3. **Personal agent skills** — `~/.agents/skills`
4. **Managed skills** — `~/.openclaw/skills`
5. **Bundled skills** — 安裝時附帶
6. **Extra dirs** — `skills.load.extraDirs`

多 agent 設定下，每個 agent 的 workspace 有自己的 skills。`~/.openclaw/skills` 是共用的。

## 整體來說

Workspace 是 agent 的人格和記憶所在地。改 `AGENTS.md` 就改了 agent 的行為，改 `SOUL.md` 就改了它的語氣。System Prompt 是動態組裝的，不需要手動維護——你只需要管理 Workspace 裡的 Markdown 檔案。

這套設計讓「自訂 agent」變成「寫 Markdown」的事。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/concepts/agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent.md) — Agent Runtime 總覽
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) — Workspace 結構
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/system-prompt.md) — System Prompt 組裝
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md) — Skills 載入機制
- [docs/reference/AGENTS.default.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/AGENTS.default.md) — AGENTS.md 預設模板
