---
title: "Claude Code Hooks 完整指南：用事件驅動控制 AI 的每一步"
date: 2026-03-27
category: tech
tags: [claude-code, hooks, ai-agent, automation, dx, event-driven]
lang: zh-TW
tldr: "Hook 是 Claude Code 的事件系統。在 AI 執行工具前後、送出 prompt 時、結束任務時自動觸發 shell command、HTTP 請求或 LLM 判斷。用來擋住危險操作、自動審核、注入上下文、記錄 audit log。"
description: "深入介紹 Claude Code Hook 的事件生命週期、四種 handler 類型、matcher 語法、進階模式（權限控制、動態環境變數、Stop 攔截），以及實際應用場景與設計取捨。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 5
---

Claude Code 的 Hook 是一套事件驅動系統。在 AI 的操作生命週期中，每個關鍵節點都會發出事件——你可以在這些節點掛上自動執行的動作：擋住危險指令、注入額外上下文、記錄操作日誌、甚至自動審批安全操作。

跟 git hook 或 CI webhook 類似的概念，但作用對象是 AI agent。

## 事件生命週期

一個 Claude Code session 的事件流長這樣：

```
SessionStart
    ↓
UserPromptSubmit（使用者送出訊息）
    ↓
┌─ Agentic Loop ──────────────────┐
│  PreToolUse → 執行工具 → PostToolUse │
│  PreToolUse → 執行工具 → PostToolUse │
│  ...（重複直到任務完成）              │
└──────────────────────────────────┘
    ↓
Stop（Claude 結束回應）
    ↓
SessionEnd
```

每個事件都可以掛 hook。最常用的是 `PreToolUse`（工具執行前）和 `Stop`（任務結束時）。

### 完整事件清單

| 事件 | 觸發時機 | 能擋住嗎 |
|------|---------|---------|
| `SessionStart` | session 啟動或恢復 | 否 |
| `UserPromptSubmit` | 使用者送出 prompt | 能 |
| `PreToolUse` | 工具執行前 | 能 |
| `PostToolUse` | 工具執行後（成功） | 能 |
| `PostToolUseFailure` | 工具執行失敗 | 否（已經失敗了） |
| `PermissionRequest` | 權限對話框即將顯示 | 能（自動審批或拒絕） |
| `Stop` | Claude 結束回應 | 能（強制繼續） |
| `StopFailure` | API 錯誤導致結束 | 否（觀察用） |
| `SubagentStart` / `SubagentStop` | subagent 啟動/結束 | 能 |
| `TaskCreated` / `TaskCompleted` | 任務建立/完成 | 能 |
| `Notification` | 通知事件 | 否 |
| `FileChanged` | 檔案變更 | 否 |
| `CwdChanged` | 工作目錄變更 | 否 |
| `ConfigChange` | 設定檔變更 | 能 |
| `PreCompact` / `PostCompact` | context 壓縮前後 | 否 |
| `SessionEnd` | session 結束 | 否（觀察用） |

## 設定方式

Hook 定義在 settings.json 裡，三層巢狀結構：事件 → matcher → handler。

```jsonc
// ~/.claude/settings.json（全域）
// 或 .claude/settings.json（專案）
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/check-command.sh"
          }
        ]
      }
    ]
  }
}
```

### 設定檔位置與優先順序

| 位置 | 範圍 | 可共享 |
|------|------|-------|
| `~/.claude/settings.json` | 全域（所有專案） | 否 |
| `.claude/settings.json` | 單一專案 | 是（commit 到 repo） |
| `.claude/settings.local.json` | 單一專案（個人） | 否（gitignored） |
| Managed policy settings | 組織層級 | 是（管理員控制） |
| Plugin `hooks/hooks.json` | 啟用 plugin 時 | 是 |
| Skill/Agent frontmatter | 元件生命週期內 | 是 |

### Matcher 語法

`matcher` 是 regex，決定 hook 什麼時候觸發。

```jsonc
"matcher": "Bash"              // 只在 Bash 工具觸發
"matcher": "Edit|Write"        // Edit 或 Write 時觸發
"matcher": "Bash(git commit*)" // Bash 且指令是 git commit 開頭
"matcher": "mcp__github__.*"   // GitHub MCP server 的所有工具
"matcher": ""                  // 所有情況都觸發
```

不同事件的 matcher 匹配對象不同：

| 事件 | 匹配對象 | 範例 |
|------|---------|------|
| `PreToolUse` / `PostToolUse` | 工具名稱 | `Bash`、`Edit`、`mcp__memory__.*` |
| `SessionStart` | 啟動來源 | `startup`、`resume`、`compact` |
| `StopFailure` | 錯誤類型 | `rate_limit`、`server_error` |
| `FileChanged` | 檔案名稱 | `.envrc`、`package.json` |
| `Notification` | 通知類型 | `permission_prompt`、`idle_prompt` |

## 四種 Handler 類型

### 1. Command（最常用）

執行 shell command，透過 stdin 接收 JSON 輸入，stdout 輸出 JSON 結果。

```json
{
  "type": "command",
  "command": "./.claude/hooks/lint-check.sh",
  "timeout": 600
}
```

**Exit code 決定行為**：

| Exit Code | 意義 | 行為 |
|-----------|------|------|
| 0 | 成功 | 解析 stdout 的 JSON |
| 2 | 阻擋 | 忽略 stdout，stderr 回饋給 Claude |
| 其他 | 非阻擋錯誤 | stderr 在 verbose 模式顯示 |

### 2. HTTP

發 HTTP POST 到指定 endpoint，適合串接外部服務。

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/validate",
  "timeout": 30,
  "headers": {
    "Authorization": "Bearer $MY_TOKEN"
  },
  "allowedEnvVars": ["MY_TOKEN"]
}
```

環境變數需要在 `allowedEnvVars` 明確列出才會被替換，安全考量。

### 3. Prompt

用 LLM 判斷。適合需要語意理解的場景（例如判斷指令是否安全）。

```json
{
  "type": "prompt",
  "prompt": "這個操作是否安全？$ARGUMENTS",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

### 4. Agent

用完整的 agent 處理，有更多工具和上下文。成本最高，適合複雜判斷。

```json
{
  "type": "agent",
  "prompt": "驗證這個條件：$ARGUMENTS",
  "timeout": 60
}
```

## 實際應用場景

### 場景 1：Commit 前跑 lint + typecheck

最基礎的用法，在 Claude 執行 `git commit` 前自動檢查。

```jsonc
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [{
          "type": "command",
          "command": "cd $CLAUDE_WORKING_DIRECTORY && pnpm run lint && pnpm run typecheck"
        }]
      }
    ]
  }
}
```

lint 或 typecheck 失敗 → exit code 非 0 → 阻擋 commit。Claude 會看到錯誤訊息，但 command hook **不能讓 Claude 自動修**（那是 Skill 的工作）。

### 場景 2：擋住危險指令

用腳本解析指令內容，攔截 `rm -rf`、`DROP TABLE` 等危險操作。

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh
COMMAND=$(jq -r '.tool_input.command' < /dev/stdin)

if echo "$COMMAND" | grep -qE 'rm -rf|DROP TABLE|--force'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Destructive command blocked by hook"
    }
  }'
else
  exit 0
fi
```

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "./.claude/hooks/block-dangerous.sh"
      }]
    }]
  }
}
```

### 場景 3：自動審批安全指令

每次 Claude 要跑 `npm test` 都要你點確認很煩。用 hook 自動放行已知安全的指令。

```bash
#!/bin/bash
# .claude/hooks/auto-approve.sh
COMMAND=$(jq -r '.tool_input.command' < /dev/stdin)

if [[ "$COMMAND" =~ ^(npm test|pnpm run lint|git status|git log) ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "Safe read-only command"
    }
  }'
else
  exit 0  # 不判斷，讓正常流程處理
fi
```

### 場景 4：Stop 攔截——測試沒過不准停

Claude 說「完成了」但測試沒過？用 Stop hook 強制它繼續。

```bash
#!/bin/bash
# .claude/hooks/must-pass-tests.sh
INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active')

# 防止無限迴圈：如果已經被攔截過一次，放行
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

if ! npm test 2>&1; then
  jq -n '{
    decision: "block",
    reason: "Tests failed. Fix the failures before stopping."
  }'
else
  exit 0
fi
```

`stop_hook_active` 是關鍵——第二次觸發時它會是 `true`，避免 Claude 陷入無限迴圈。

### 場景 5：Audit Log

所有 Claude 的操作都記錄下來，用於事後審計。

```bash
#!/bin/bash
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name')
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

echo "{\"ts\": \"$TIMESTAMP\", \"event\": \"$EVENT\", \"tool\": \"$TOOL\"}" \
  >> ~/.claude/audit.log
exit 0
```

搭配 `"async": true` 跑在背景，不影響 Claude 的回應速度。

### 場景 6：Session 啟動時注入環境變數

```bash
#!/bin/bash
# SessionStart hook：載入 .envrc
if [ -n "$CLAUDE_ENV_FILE" ] && [ -f .envrc ]; then
  eval "$(direnv export bash)"
  direnv export bash >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

`CLAUDE_ENV_FILE` 是 Claude Code 提供的特殊變數。寫入這個檔案的環境變數會在整個 session 中生效。

### 場景 7：Claude 結束時發通知

```jsonc
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Done\" with title \"Claude Code\"'"
      }]
    }]
  }
}
```

## Hook 的輸入與輸出

每個 hook 透過 stdin（command）或 POST body（HTTP）收到 JSON，格式因事件而異。

### PreToolUse 的輸入

```json
{
  "session_id": "abc123",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test",
    "description": "Run tests"
  }
}
```

### PreToolUse 的輸出（可選）

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Safe command",
    "updatedInput": {
      "command": "npm test -- --verbose"
    },
    "additionalContext": "This project uses Jest"
  }
}
```

注意 `updatedInput`——你可以**修改** Claude 即將執行的工具輸入。例如自動加上 `--verbose` flag，或把相對路徑改成絕對路徑。

### UserPromptSubmit 的輸出

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Current branch: main, last commit: abc1234"
  }
}
```

`additionalContext` 會被注入到 Claude 的上下文中。可以用來在每次使用者送 prompt 時自動補充資訊（例如 git 狀態、目前 branch）。

## Skill 和 Agent 裡的 Hook

Hook 不只能定義在 settings.json。Skill 和 Agent 的 frontmatter 裡也能定義，作用範圍限定在元件的生命週期內。

```yaml
---
name: secure-operations
description: 執行需要安全檢查的操作
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

這個 hook 只在 `secure-operations` skill 被載入時才生效。

## 跟 Skill 的分工

這個問題在[三層品質防線](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)裡有詳細討論，這裡簡要重提：

| 特性 | Hook | Skill |
|------|------|-------|
| 觸發方式 | 自動（事件驅動） | 手動（`/name`）或指令檔指示 |
| 能力 | shell command / HTTP / LLM | Claude 的完整能力 |
| 能修 code 嗎 | 不能 | 能 |
| 能互動嗎 | 不能（除了 prompt type） | 能 |
| 適合場景 | 擋、記錄、注入 | 修、生成、互動 |

**Hook 是被動安全網，Skill 是主動工作流程。** Hook 負責「不讓壞事發生」，Skill 負責「把事情做好」。

## 設計原則

**Hook 要快。** 特別是 `SessionStart` 和 `PreToolUse`，每次都會跑。如果 hook 很慢，Claude 的回應也會變慢。重度操作用 `"async": true` 跑在背景。

**不要在 stderr 暴露敏感資訊。** Exit code 2 的 stderr 會被回饋給 Claude。如果你的檢查腳本涉及 API key 或內部路徑，要注意不要讓這些出現在 stderr。

**用 `stop_hook_active` 防止無限迴圈。** Stop hook 攔截 Claude 後，Claude 會繼續工作然後再次觸發 Stop。如果不檢查 `stop_hook_active`，就會無限循環。

**Command hook 的 stdout 只能是 JSON。** Shell profile 印出的歡迎訊息、`echo` debug 訊息都會破壞 JSON 解析。確保 stdout 只有你的 JSON output。

**Managed policy hook 不能被覆蓋。** 組織管理員透過 policy settings 設定的 hook，使用者和專案層級都無法停用。這是企業安全的保證。

## 整體來說

Hook 是 Claude Code 最底層的控制機制。它不聰明（不會理解程式碼），但很可靠（機制層面保證執行）。

大多數人只需要兩三個 hook：commit 前跑檢查、擋住危險指令、結束時發通知。從這些開始，遇到具體需求再加。不要過度設計——能用簡單的 exit code 解決的事，不需要動用 prompt 或 agent type。

最強大的用法是跟 Skill 組合。Hook 擋住問題，Skill 修復問題，指令檔串起流程。三層各司其職，AI 就有了一套完整的品質保證系統。

---

## 參考資料

- [Claude Code Hooks 官方文件](https://code.claude.com/docs/en/hooks)
- [Claude Code Skills 官方文件](https://code.claude.com/docs/en/skills)
- [Claude Code Permissions 官方文件](https://code.claude.com/docs/en/permissions)
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
- [Claude Code Skill 完整指南](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
