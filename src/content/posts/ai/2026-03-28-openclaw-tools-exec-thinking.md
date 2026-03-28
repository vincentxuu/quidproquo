---
title: "OpenClaw 工具篇（三）：Exec 工具、Thinking 層級與 Slash Commands"
date: 2026-03-28
category: ai
tags: [openclaw, exec, thinking, slash-commands, fast-mode, verbose, reasoning]
lang: zh-TW
tldr: "Exec 支援前景/背景/PTY 執行 + 三種安全等級（deny/allowlist/full），Thinking 有 7 個層級（off 到 adaptive），Slash Commands 分指令和 directive 兩類。"
description: "OpenClaw 的 Exec 工具（安全模型、approval、safe bins）、Thinking 層級控制、Fast Mode、以及 Slash Commands 系統。"
draft: false
---

這篇講 OpenClaw 最底層的執行工具（Exec）、推理控制（Thinking）、和使用者互動介面（Slash Commands）。

## Exec 工具

在 workspace 裡執行 shell 指令。支援前景和背景執行。

### 參數

| 參數 | 預設 | 說明 |
|---|---|---|
| `command` | （必要）| 要執行的指令 |
| `workdir` | cwd | 工作目錄 |
| `yieldMs` | 10000 | 超過此時間自動轉背��� |
| `background` | false | 立即背景執行 |
| `timeout` | 1800s | 逾時終止 |
| `pty` | false | 偽終端模式（PTY） |
| `host` | sandbox | `sandbox` / `gateway` / `node` |
| `security` | deny（sandbox）| `deny` / `allowlist` / `full` |
| `ask` | on-miss | `off` / `on-miss` / `always` |
| `elevated` | false | 在 gateway 主機上執行 |

### 三個執行位置

| Host | 說明 |
|---|---|
| `sandbox` | 沙箱容器內（預設） |
| `gateway` | Gateway 主機上 |
| `node` | 配對的 node 裝置上 |

**重要：** 沙箱預設關閉。如果沙箱關閉但 `host=sandbox`，exec 會 **fail closed**，不是靜默跑在主機上。

### 安全模型

**Allowlist + Safe Bins：**
- Allowlist 只比對**已解析的 binary 路徑**（不是 basename）
- Chaining（`;`、`&&`、`||`）在 allowlist 模式下只允許所有 segment 都在 allowlist 內
- Redirections 不支援

**Safe Bins：** 小型、stdin-only 的串流過濾器。

```json5
{
  tools: {
    exec: {
      safeBins: ["cat", "sort", "head", "tail", "wc"],
      safeBinTrustedDirs: ["/bin", "/usr/bin"],
      safeBinProfiles: {
        sort: { maxPositional: 1, deniedFlags: ["-o"] }
      }
    }
  }
}
```

**不要**把直譯器（python3、node、bash）加到 `safeBins`。用明確的 allowlist entries + approval prompts。

**Strict Inline Eval：** `strictInlineEval: true` 讓 `python -c`、`node -e` 等 inline eval 永遠需要 approval。

### Exec Approvals

沙箱 agent 在 gateway/node 上執行時可以要求逐次 approval：

1. Exec 工具回傳 `status: "approval-pending"` + approval id
2. 使用者核准或拒絕
3. Gateway 發出 system event（`Exec finished` / `Exec denied`）

```bash
/approve <id> allow-once    # 單次允許
/approve <id> allow-always  # 永遠允許
/approve <id> deny          # 拒絕
```

### PATH 處理

| Host | PATH 行為 |
|---|---|
| gateway | 合併 login shell PATH，拒絕 `env.PATH` 覆寫 |
| sandbox | `sh -lc` 後 prepend `env.PATH`，`pathPrepend` 也適用 |
| node | 拒絕 `env.PATH` 覆寫，用 node 主機環境 |

Host 執行拒絕 `LD_*`/`DYLD_*` loader 覆寫，防止 binary hijacking。

### Session 覆寫（/exec）

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

只對授權發送者有效，更新 session 狀態，不寫入 config。

### apply_patch

Exec 的子工具，用於結構化多檔案編輯。預設對 OpenAI/Codex 模型啟用。

```json5
{
  tools: {
    exec: {
      applyPatch: { workspaceOnly: true, allowModels: ["gpt-5.2"] }
    }
  }
}
```

## Thinking 層級

控制模型的推理深度。

### 7 個層級

| 層級 | 別名 | 說明 |
|---|---|---|
| `off` | — | 不推�� |
| `minimal` | think | 最小推理 |
| `low` | think hard | 低推理 |
| `medium` | think harder | 中等推理 |
| `high` | ultrathink | 最大推理預算 |
| `xhigh` | ultrathink+ | GPT-5.2 + Codex 限定 |
| `adaptive` | — | Provider 管理的自適應推理（Anthropic Claude 4.6） |

### 設定方式

**Inline directive：** 只影響該則訊息
```
/think:high 請分析這段程式碼
```

**Session default：** 發送只有 directive 的訊息
```
/think:medium
```

### 解析順序

1. Inline directive
2. Session override
3. Per-agent default（`agents.list[].thinkingDefault`）
4. Global default（`agents.defaults.thinkingDefault`）
5. Fallback：Anthropic Claude 4.6 → `adaptive`，其他推理模型 → `low`，否則 → `off`

### Provider 特殊行為

| Provider | 行為 |
|---|---|
| Anthropic Claude 4.6 | 預設 `adaptive` |
| Z.AI | 只支援 on/off |
| Moonshot | 只支援 enabled/disabled |

## Fast Mode（/fast）

降低延遲的快速模式。

| Provider | Fast Mode 行為 |
|---|---|
| OpenAI | `service_tier=priority` + 低推理 + 低 verbosity |
| OpenAI Codex | 同上 |
| Anthropic（API key）| `service_tier=auto` |

```
/fast on
/fast off
```

## Verbose 與 Reasoning

**Verbose（/verbose）：** 顯示工具呼叫詳情。

| 層級 | 行為 |
|---|---|
| `off`（預設）| 只顯示失敗摘要 |
| `on` | 每個工具呼叫一個 bubble |
| `full` | 工具呼叫 + 完成後的輸出 |

**Reasoning（/reasoning）：** 顯示推理過程。

| 層級 | 行為 |
|---|---|
| `off`（預設）| 不顯示 |
| `on` | 以獨立訊息顯示 `Reasoning:` |
| `stream` | Telegram 限定，串流推理到 draft bubble |

## Slash Commands 系統

### 兩種類型

**Commands：** 獨立的 `/...` 訊息。
**Directives：** `/think`、`/fast`、`/verbose`、`/reasoning`、`/elevated`、`/exec`、`/model`、`/queue`。

Directive 在一般訊息中是 inline hint（不持久化），在 directive-only 訊息中持久化到 session。

### 設定

```json5
{
  commands: {
    native: "auto",        // 註冊原生 commands（Discord/Telegram）
    nativeSkills: "auto",  // 註冊 skill commands
    text: true,            // 解析 /... 文字
    bash: false,           // 啟用 ! <cmd>
    config: false,         // 啟用 /config
    mcp: false,            // 啟用 /mcp
    plugins: false,        // 啟用 /plugins
  }
}
```

### 常用指令

| 指令 | 功能 |
|---|---|
| `/help` | 說明 |
| `/status` | 目前狀態 + provider 用量 |
| `/tools` | 目前可用工具 |
| `/context` | Context 使用情況 |
| `/btw <question>` | 臨時側問（不影響 session context） |
| `/export-session` | 匯出 session 為 HTML |
| `/subagents list` | 列出子 agent |
| `/focus <target>` | Discord thread 綁定 |

## 整體來說

Exec 是 OpenClaw 最強大也最危險的工具——三層安全控制（host、security、ask）確保它不會失控。Thinking 讓你根據任務複雜度調整推理深度。Slash Commands 是使用者與 Gateway 互動的主要介面。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/tools/exec.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/exec.md) — Exec 工具
- [docs/tools/exec-approvals.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/exec-approvals.md) — Exec Approvals
- [docs/tools/thinking.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/thinking.md) — Thinking 層級
- [docs/tools/slash-commands.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/slash-commands.md) — Slash Commands
- [docs/tools/elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/elevated.md) — Elevated Mode
- [docs/tools/btw.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/btw.md) — BTW 側問
