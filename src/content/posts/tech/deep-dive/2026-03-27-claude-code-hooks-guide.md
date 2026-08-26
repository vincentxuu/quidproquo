---
title: "Claude Code Hooks 完整指南：用事件驅動控制 AI 的每一步"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, hooks, ai-agent, automation, dx, event-driven]
lang: zh-TW
tldr: "Hook 是 Claude Code 的事件系統。在 AI 執行工具前後、送出 prompt 時、結束任務時自動觸發 shell command、HTTP 請求、MCP tool 或 LLM 判斷。用來擋住危險操作、自動審核、注入上下文、記錄 audit log。"
description: "深入介紹 Claude Code Hook 的事件生命週期、五種 handler 類型、matcher 與 if 語法、exit code 語意、async／HTTP／prompt／MCP tool hooks，以及實際應用場景與設計取捨。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 12
---

🌏 [English version](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide-en)

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
| `PermissionRequest` | 權限對話框即將顯示 | JSON 可自動審批或拒絕（exit 2 不作用） |
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

上表是寫這篇時的核心事件。到 2026-08，官方 reference 的事件已經擴充到三十個上下文：新增了 `Setup`（CI／腳本的一次性準備）、`UserPromptExpansion`（slash command 展開時）、`PermissionDenied`（auto mode 拒絕工具呼叫後）、`PostToolBatch`（一批平行工具呼叫跑完）、`TeammateIdle`、`InstructionsLoaded`、`WorktreeCreate`／`WorktreeRemove`、`Elicitation`／`ElicitationResult`（MCP elicitation）、`DirectoryAdded`、`MessageDisplay` 等。完整清單以[官方 hooks reference](https://code.claude.com/docs/en/hooks) 為準。

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
| Skill/Agent frontmatter | Skill：被叫用後的整個 session；Subagent：執行期間 | 是 |

這些設定檔在 `.claude` 目錄體系裡的位置，[.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)有完整說明。

### Matcher 語法

`matcher` 決定 hook 什麼時候觸發，匹配對象是事件帶的欄位（工具事件是工具名稱）。求值規則：只含字母、數字、`_`、`-`、空白、`,`、`|` 時按精確字串比對（`|` 和 `,` 分隔多個候選，v2.1.191 起支援逗號）；含其他字元則當成 JavaScript regex（未錨定）。

```jsonc
"matcher": "Bash"         // 只在 Bash 工具觸發（精確比對）
"matcher": "Edit|Write"   // Edit 或 Write 時觸發
"matcher": "^Edit$"       // regex 寫法；不錨定的 "Edit.*" 會連 NotebookEdit 一起命中
"matcher": "mcp__github__.*" // GitHub MCP server 的所有工具；.* 不能省，
                             // 否則整串被當精確字串、一個都 match 不到
"matcher": ""             // 所有情況都觸發
```

注意：`matcher` 只匹配工具名稱，**不能**寫 `"Bash(git commit*)"` 這種帶參數的語法——那是 permission rule 語法，要放在 handler 層的 `if` 欄位（見下方〈2026-08 的 hooks 長什麼樣〉）。

不同事件的 matcher 匹配對象不同：

| 事件 | 匹配對象 | 範例 |
|------|---------|------|
| `PreToolUse` / `PostToolUse` | 工具名稱 | `Bash`、`Edit`、`mcp__memory__.*` |
| `SessionStart` | 啟動來源 | `startup`、`resume`、`clear`、`compact`、`fork` |
| `StopFailure` | 錯誤類型 | `rate_limit`、`server_error` |
| `FileChanged` | 檔案名稱 | `.envrc`、`package.json` |
| `Notification` | 通知類型 | `permission_prompt`、`idle_prompt` |

## Handler 類型

handler 現在有五種：command、http、prompt、agent，加上後來新增的 `mcp_tool`（見下方〈2026-08 的 hooks 長什麼樣〉）。這節先講最常用的前四種。

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
| 0 | 成功、無決定 | stdout 開頭是 `{` 就解析成 JSON；不是的話當純文字。**不代表放行**，工具照走正常 permission flow |
| 2 | 阻擋 | 阻擋該動作；JSON 的 allow 也覆蓋不掉它。訊息優先用 JSON 裡的 reason，否則用 stderr 回饋給 Claude（部分事件只顯示給使用者） |
| 其他 | 非阻擋錯誤 | 不擋。若 stdout 是通過 schema 驗證的 JSON，Claude Code 忽略 exit code、以 JSON 內容為準；否則視為非阻擋錯誤，stderr 只在 debug／verbose 模式可見 |

細節（含每個事件的差異）見下方〈2026-08 的 hooks 長什麼樣〉的 exit code 一節。

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
          "command": "cd ${CLAUDE_PROJECT_DIR} && pnpm run lint && pnpm run typecheck"
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

`stop_hook_active` 是關鍵——第二次觸發時它會是 `true`，避免 Claude 陷入無限迴圈。Claude Code 自己也有保險：連續攔截 8 次後會強制結束 turn，不讓 hook 把 session 鎖死。

### 場景 5：Audit Log

所有 Claude 的操作都記錄下來，用於事後稽核。

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

這個 hook 在 `secure-operations` skill 被叫用後註冊，之後整個 session 都有效（不只 skill 自己那輪）。想只跑一次，在 handler 上加 `once: true`。Subagent frontmatter 裡的 hook 則只在該 subagent 執行期間生效。

## 跟 Skill 的分工

這個問題在[三件套協作視角：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)裡有詳細討論，Skill 本身怎麼設計則見[Skills 主篇](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)，這裡簡要重提：

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

## 2026-08 的 hooks 長什麼樣

這篇發佈後 hooks 又長大了一輪。以下是依[官方 hooks reference](https://code.claude.com/docs/en/hooks) 補的增量，沒講到的不推導。

### Handler 從四種變五種

`type` 現在有 `command`、`http`、`mcp_tool`、`prompt`、`agent` 五種。所有 handler 共用這幾個欄位：

| 欄位 | 說明 |
|------|------|
| `if` | permission rule 語法的過濾條件（如 `"Bash(git *)"`、`"Edit(*.ts)"`），只在工具事件上生效。只接受單一規則，沒有 `&&` 或串列語法 |
| `timeout` | 秒數。command／http／mcp_tool 預設 600，prompt 30，agent 60 |
| `statusMessage` | hook 執行中顯示的 spinner 訊息 |
| `once` | `true` 時每個 session 只跑一次（只在 skill frontmatter 裡有效） |

Command hook 另外支援 `args`（設了就跳過 shell、直接 spawn 執行檔的 exec form）和 `shell`（`"bash"` 或 `"powershell"`）。同一事件的所有 matching hooks 平行執行；多個 hook 都回決定時取最嚴格的（deny > defer > ask > allow），`additionalContext` 則全部保留。

### Exit code 的完整語意

| Exit Code | 行為 |
|-----------|------|
| 0 | 成功。stdout 首字非 `{` 就當純文字——`UserPromptSubmit`、`UserPromptExpansion`、`SessionStart` 三個事件的純文字 stdout 會進 Claude 的 context，其他事件只進 debug log |
| 2 | 阻擋錯誤。唯一能靠 exit code 本身擋下動作的代碼，JSON 輸出覆蓋不掉。但「擋」的效果因事件而異：`PreToolUse` 擋工具呼叫、`Stop` 強制繼續、`ConfigChange` 擋設定變更生效；而 `PermissionRequest` 根本不吃 exit 2（要用 JSON 的 `decision.behavior`）、`PostToolUse` 只把 stderr 給 Claude 看（工具已經跑完了）、觀察類事件（`SessionEnd`、`Notification` 等）完全忽略 |
| 其他 | 非阻擋錯誤。例外：stdout 是通過 schema 驗證的 JSON 時，exit code 被忽略、以 JSON 為準。所以**想靠 hook 擋東西只能用 exit 2**——慣例上的 exit 1 在多數事件上只是非阻擋錯誤，動作照樣執行 |

另一個容易踩的坑：超時的 hook 直接被取消、不做任何決定——在 `PreToolUse` 上，卡死的 hook 不會充當關卡，工具呼叫照走正常 permission flow。

### Async hooks：背景跑，不擋 loop

`"async": true` 加在 command hook 上，Claude Code 啟動程序後立刻繼續工作：

- 背景跑完後，輸出的 `additionalContext` 和 `systemMessage` 在**下一輪對話**才交付給 Claude；session 閒置時就等到下次互動
- 既然動作已經發生，async hook 的 `decision`、`permissionDecision`、`continue` 全部無效——它天生不能拿來擋東西
- 想要背景跑、但失敗時要叫醒 Claude，改用 `"asyncRewake": true`：exit 2 時立即以 system reminder 餵給 Claude（含 session 閒置中）
- 每次觸發都是獨立的背景程序，同一個 async hook 連續觸發不會去重

### HTTP hooks：回應怎麼算

HTTP hook 把事件的 JSON 當 POST body 送出，回應的算法和 command hook 不同：

- **2xx + JSON object**：按 command hook 的 JSON output 同一套 schema 解析——要擋就回 2xx 帶 decision 欄位
- **2xx + 空 body**：等同 exit 0 無輸出
- **非 2xx、連線失敗**：非阻擋錯誤，繼續執行
- **超時**：取消、不做決定

重點：HTTP hook **無法用 status code 表達阻擋**，純文字回應也進不了 Claude 的 context。

### Prompt hooks：讓 LLM 回 ok/false

Prompt hook 是單輪 LLM 判斷（預設 fast model）。模型必須回這個 JSON：

```json
{
  "ok": true,
  "reason": "說明",
  "impossible": false
}
```

`ok: false` 的效果因事件而異：`Stop`／`SubagentStop` 把 reason 餵回給 Claude 繼續做（除非模型同時判斷 `impossible: true`，那就放行結束）；`PreToolUse` 預設直接結束 turn，設 `continueOnBlock: true` 才會把 reason 當 tool error 讓 Claude 調整後繼續。需要更細的控制（allow/deny/ask、改參數）還是用 command hook 的 JSON 輸出。

### MCP tool hooks：把判斷外包給已連線的 MCP server

```json
{
  "type": "mcp_tool",
  "server": "my_server",
  "tool": "security_scan",
  "input": { "file_path": "${tool_input.file_path}" }
}
```

呼叫已連線 MCP server 上的工具，tool 的文字輸出按 command hook stdout 的同一套規則解析。`input` 字串支援 `${path}` 語法從事件的 JSON 抽欄位。server 必須已經連著——hook 不會觸發 OAuth 或連線流程；沒連上或 tool 回 `isError: true` 就是非阻擋錯誤。`SessionStart` 和 `Setup` 通常比 MCP 連線先觸發，掛在這兩個事件上第一次會吃到「not connected」。

另外不是每個事件都吃五種 handler：工具與 turn 類事件（`PreToolUse`、`Stop`、`UserPromptSubmit` 等十三個）五種全收；觀察類事件（`Notification`、`FileChanged` 等）不支援 prompt／agent；`SessionStart` 和 `Setup` 只收 command 和 mcp_tool。

## 整體來說

Hook 是 Claude Code 最底層的控制機制。它不聰明（不會理解程式碼），但很可靠（機制層面保證執行）——本質上就是在 [agentic loop](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) 的特定時點插上你的動作，系列入口篇對那個 loop 有完整拆解。

大多數人只需要兩三個 hook：commit 前跑檢查、擋住危險指令、結束時發通知。從這些開始，遇到具體需求再加。不要過度設計——能用簡單的 exit code 解決的事，不需要動用 prompt 或 agent type。

最強大的用法是跟 Skill 組合。Hook 擋住問題，Skill 修復問題，指令檔串起流程。三層各司其職，AI 就有了一套完整的品質保證系統。

---

## 參考資料

- [Claude Code Hooks reference](https://code.claude.com/docs/en/hooks) — 事件清單、設定 schema、exit code 語意、async／HTTP／prompt／MCP tool hooks 的唯一規範來源
- [Automate actions with hooks（官方 guide）](https://code.claude.com/docs/en/hooks-guide) — 快速上手與常見場景範例
- [Claude Code Skills 官方文件](https://code.claude.com/docs/en/skills)
- [Claude Code Permissions 官方文件](https://code.claude.com/docs/en/permissions)
- [Claude Code 怎麼運作：agentic loop、內建工具與兩道安全防線（系列入口）](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)
- [.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)
- [三件套協作視角：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
- [Claude Code Skill 完整指南](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)

## 更新紀錄

- 2026-08-26：依 hooks reference 補 schema／exit code／async／HTTP／prompt／MCP tool hooks 增量。
