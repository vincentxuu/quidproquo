---
title: "OpenClaw 工具篇（二）：Skills 系統與 Sub-Agent"
date: 2026-03-28
category: ai
tags: [openclaw, skills, clawhub, sub-agents, skill-md, agent-skills]
lang: zh-TW
tldr: "Skills 是 AgentSkills 相容的 SKILL.md 資料夾，有 6 層載入優先順序。ClawHub 是公開市場。Sub-agent 最多巢狀 5 層。"
description: "OpenClaw 的 Skills 系統（載入優先順序、格式、Gating、ClawHub 市場）與 Sub-Agent 機制。"
draft: false
---

OpenClaw 用 Skills 教 agent 使用工具，用 Sub-Agent 讓 agent 派生子任務。這篇講這兩個系統。

## Skills 系統

### 什麼是 Skill

每個 Skill 是一個目錄，包含一個 `SKILL.md`（帶 YAML frontmatter 和指令）。OpenClaw 在載入時根據環境、設定、binary 是否存在來過濾 skill。

### 載入優先順序（高到低）

| 順序 | 來源 | 路徑 |
|---|---|---|
| 1（最高）| Workspace skills | `<workspace>/skills` |
| 2 | Project agent skills | `<workspace>/.agents/skills` |
| 3 | Personal agent skills | `~/.agents/skills` |
| 4 | Managed/local skills | `~/.openclaw/skills` |
| 5 | Bundled skills | npm 套件或 OpenClaw.app |
| 6（最低）| Extra dirs | `skills.load.extraDirs` |

同名 skill 時，高優先順序的覆蓋低的。Plugin 的 skill 跟 `extraDirs` 同層。

### SKILL.md 格式

```markdown
---
name: image-lab
description: Generate or edit images via a provider-backed image workflow
metadata: {"openclaw": {"requires": {"bins": ["uv"], "env": ["GEMINI_API_KEY"]}}}
---

Instructions for the agent...
Use {baseDir} to reference the skill folder path.
```

### Gating（載入時過濾）

`metadata.openclaw` 控制 skill 何時可用：

| 欄位 | 作用 |
|---|---|
| `always: true` | 永遠載入 |
| `os` | 限制平台（`darwin`、`linux`、`win32`） |
| `requires.bins` | 所有 binary 必須在 PATH |
| `requires.anyBins` | 至少一個 binary 在 PATH |
| `requires.env` | 環境變數必須存在 |
| `requires.config` | config 路徑必須為 truthy |
| `primaryEnv` | 對應 `skills.entries.<name>.apiKey` |

**沙箱注意：** `requires.bins` 在主機載入時檢查。如果 agent 在沙箱裡，binary 也必須在容器內（用 `setupCommand` 安裝）。

### 進階 frontmatter

| Key | 預設 | 說明 |
|---|---|---|
| `user-invocable` | `true` | 是否作為使用者 slash command |
| `disable-model-invocation` | `false` | 排除出 model prompt |
| `command-dispatch` | — | 設 `tool` 直接呼叫工具，不經模型 |
| `command-tool` | — | `command-dispatch: tool` 時呼叫的工具名 |

### Config 覆寫

```json5
{
  skills: {
    entries: {
      "image-lab": {
        enabled: true,
        apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
        env: { GEMINI_API_KEY: "..." },
        config: { endpoint: "https://example.invalid", model: "nano-pro" }
      }
    }
  }
}
```

- `enabled: false` 停用 skill
- `env` 在 agent run 開始時注入 `process.env`，結束後恢復
- `apiKey` 支援明文或 SecretRef
- `allowBundled` 可限制哪些 bundled skill 可用

### Session Snapshot

OpenClaw 在 session 啟動時快照可用 skill，同 session 內重複使用。Skills watcher 可以在 `SKILL.md` 變更時 hot reload。

### Remote macOS Node

Linux Gateway 連著 macOS node 時，可以用 macOS-only skills（agent 透過 `nodes.run` 執行）。

### Token 成本

Skill 在 system prompt 裡的開銷：
- 基礎：195 字元（有任何 skill 時）
- 每個 skill：97 字元 + name + description + location 長度
- 粗估：每個 skill 約 24+ token

## ClawHub

OpenClaw 的公開 skill 市場，瀏覽 [clawhub.com](https://clawhub.com)。

### 常用指令

```bash
openclaw skills search <keyword>     # 搜尋
openclaw skills install <skill-slug> # 安裝到 workspace/skills
openclaw skills update --all         # 更新全部
```

### 安全模型

- 需要 GitHub 帳號且註冊超過一週才能發布
- 收到超過 3 個獨立舉報的 skill 自動隱藏
- Moderator 可以管理可見性、刪除、封禁

### 發布（clawhub CLI）

```bash
clawhub sync --all    # 掃描 + 發布更新
```

### 安全注意事項

- **第三方 skill 視為不信任程式碼——啟用前先讀**
- 不信任的輸入用沙箱執行
- Skill 目錄的 realpath 必須在設定的 root 內
- `skills.entries.*.env` 和 `apiKey` 注入主機程序，不是沙箱

## Sub-Agent

Agent 可以 spawn 子 agent 處理獨立任務。

### 基本概念

- Sub-agent 有獨立的 session、workspace、sandbox
- 最大巢狀深度 5 層（`maxSpawnDepth`）
- 父 agent 可以監控、引導（steer）、或終止子 agent

### 管理指令

```bash
/subagents list                    # 列出子 agent
/subagents kill <id>               # 終止
/subagents log <id>                # 查看日誌
/subagents send <id> <message>     # 發送訊息
/subagents steer <id> <directive>  # 引導方向
/subagents spawn <config>          # 產生新子 agent
```

### Session Tools

| 工具 | 用途 |
|---|---|
| `sessions_list` | 列出可用 session |
| `sessions_history` | 取得對話記錄 |
| `sessions_send` | 對其他 session 發訊息 |
| `sessions_spawn` | 建立隔離的子 session |

### 安全

- Sandbox 環境下，子 agent 只能看到自己和它 spawn 的 session
- 每個子 agent 有獨立的工具權限和 sandbox 設定

## 整體來說

Skills 讓 OpenClaw 的能力可以無限擴展——從社群貢獻的 ClawHub skill 到自訂的 workspace skill。Sub-agent 則讓複雜任務可以分解處理。兩者結合，一個 agent 可以派子 agent 去用特定 skill 處理子任務。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md) — Skills 系統
- [docs/tools/clawhub.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/clawhub.md) — ClawHub 市場
- [docs/tools/sub-agents.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/sub-agents.md) — Sub-Agent
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-tool.md) — Session Tools
