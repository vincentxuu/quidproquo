---
title: "OMP 審批三層與 fail-closed：為什麼未宣告 approval 的自訂工具會被當 exec？yolo 模式底下哪些仍不能跨越？"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, approval, security, agent-loop, coding-agent, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 4
tldr: "omp 的審批解析器 resolveApproval 按「工具宣告 → 使用者覆寫 → 模式門檻」三層決策。未宣告 approval、或格式錯誤的工具，預設降級為 exec（fail-closed）。三層分工：工具自己宣告 tier + 可選 policy/override/reason；使用者用 tools.approval.<tool> 覆寫；模式（always-ask/write/yolo）決定自動通過哪些 tier。關鍵鐵律：tool-side deny 與 user-side deny 永遠不可被模式跨越；yolo 中 override: true 不會強迫 prompt，但 policy: deny 仍生效。"
description: "深入 approval.ts 的 resolveApproval 三層決策邏輯、bash 的 token 化審批設計、同一工具在 read/write 間切換審批的機制、checkpoint/rewind 的互含姊妹工具設計、subagent headless yolo 的授權邊界，以及為什麼這樣切比單純 allow/deny 清單更安全。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 4 篇。前三篇拆了 [agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while)、[append-only context](/posts/tech/2026-08-31-omp-append-only-context)、[四種 compaction 策略](/posts/tech/2026-08-31-omp-four-compaction-strategies)，這篇看「工具能不能跑」的決策邏輯。

---

## TL;DR

- **三層決策順序**（`resolveApproval`，line 120-219）：
  1. **工具宣告層**：每工具自己宣告 `approval`（tier 或 function），可帶 `policy: allow|deny|prompt`、`override: true`、`reason`、`policyKey`。未宣告/格式錯 → 全部 `exec`（fail-closed）
  2. **使用者層**：`tools.approval.<tool>: allow|deny|prompt` 覆寫；`<policyKey>` 沒值時 fallback 回工具本體名（如 `xd://` 裝置派工用）
  3. **模式層**（`APPROVAL_MODE_MAX_TIER`，line 37-41）：`always-ask` 只放 `read`；`write` 放 `read+write`；`yolo` 全放。**yolo 中** `override: true` 不會強迫 prompt，但 `policy: deny|allow|prompt` 仍生效

- **鐵律**：tool-side `deny` 與 user-side `deny` 都不可被模式跨越；`formatApprovalDetails` 把執行內容截到 2,000 字塞進 prompt；MCP 工具預設 `write`、未知自訂工具預設 `exec`；subagent 跑 headless yolo，父層 `task` 通過是唯一授權邊界

- **bash 的 token 化審批**：`allow` 必須覆蓋整行、`deny/prompt` 對 `&&` `;` 分段逐一比對；shell control syntax（`&&` `||` `|` `&` `;` newline、subshell）會阻擋 `allow` 但不阻擋 `deny/prompt`

- **同一工具切換審批**：`lsp`/`dap`/`computer`/`write(xd://)` 用參數化 `policyKey` 把參數映射到使用者覆寫

---

## 情境

你寫了一個自訂工具，忘記加 `approval` 欄位。模型呼叫這個工具時，**omp 會怎麼決定「讓不讓跑」？**

再比如：你用 `--yolo` 啟動，以為所有工具都會自動通過。但某個工具內部宣告了 `policy: "deny"`——**它還是會被擋下來嗎？**

這就是 omp 審批系統要解決的問題：**三層決策、fail-closed 預設、模式不等於「全通」**。

---

## 問題

單純的 allow/deny 清單不夠，因為現實情況複雜：

1. **工具作者**想宣告「這工具預設需要審批、但某些參數下不需要」（如 `write` 的 `xd://` 裝置派工）
2. **使用者**想覆寫特定工具的行為（如 `tools.approval.bash: allow`）
3. **模式**提供粗略分級（always-ask/write/yolo），但不能完全取代細粒度控制
4. **安全性**：未知工具、格式錯誤、缺欄位——都要**預設拒絕/提示**（fail-closed），不能偷偷放行

omp 的解法：**三層疊加，優先級固定，deny 永遠贏**。

---

## 解法：三層決策的精確分工

### 第一層：工具宣告層（`getToolDecision`，line 80-98）

```typescript
// line 80-98
function getToolDecision(tool, args) {
  const approval = tool.approval;
  const decision = typeof approval === "function" ? approval(args) : approval;
  return normalizeDecision(decision);
}

function normalizeDecision(value) {
  if (isToolTier(value)) {
    return { tier: value, override: false }; // 簡單 tier：read/write/exec
  }
  if (isObject(value)) {
    // 物件形式：{ tier, policy, override, reason, policyKey }
    const tier = isToolTier(record.tier) ? record.tier : "exec"; // 預設 exec！
    const reason = record.reason;
    const policy = normalizePolicy(record.policy); // allow/deny/prompt
    const policyKey = record.policyKey;
    return { tier, override: record.override === true, policy, reason, policyKey };
  }
  return { tier: "exec", override: false }; // 預設 exec！
}
```

**關鍵點**：

| 宣告形式 | 解析結果 |
|---|---|
| 字串 `"read"`/`"write"`/`"exec"` | `{ tier, override: false }` |
| 物件 `{ tier: "write", policy: "deny" }` | `{ tier, policy, override, reason, policyKey }` |
| 函式 `args => ({ tier: "write", policy: "allow" })` | 依 `args` 動態決定 |
| **未宣告 / 格式錯 / 非物件非字串** | **`{ tier: "exec", override: false }`** ← **fail-closed** |

**為什麼預設 `exec`？** 因為 `exec` 是最高風險 tier（執行程式碼、shell、瀏覽器、spawn agent）。任何工具若不宣告「我安全」，系統假設它**最危險**。這比預設 `read` 再事後補洞安全得多。

### 第二層：使用者覆寫層（line 127-134）

```typescript
const policyKey = decision.policyKey ?? tool.name;
const userPolicy = userConfig[policyKey] ? normalizePolicy(userConfig[policyKey]) : undefined;
const fallbackPolicy = (policyKey !== tool.name && !userPolicy && userConfig[tool.name])
  ? normalizePolicy(userConfig[tool.name]) : undefined;
const effectiveUserPolicy = userPolicy ?? fallbackPolicy;
```

- `policyKey`：工具可自訂「使用者覆寫用哪個 key」。預設用工具名；`xd://` 裝置派工用 `policyKey: "write"`，讓使用者的 `tools.approval.write` 生效
- **Fallback**：若 `policyKey` 沒對應的使用者設定，退回檢查 `tools.approval.<tool.name>`
- **生效優先級**：`effectiveUserPolicy` = `userPolicy`（優先）或 `fallbackPolicy`

### 第三層：模式層（`modeApprovesTier`，line 100-102）

```typescript
const APPROVAL_MODE_MAX_TIER: Record<ApprovalMode, ToolTier> = {
  "always-ask": "read",
  write: "write",
  yolo: "exec",
};

function modeApprovesTier(mode, tier) {
  return TIER_RANK[tier] <= TIER_RANK[APPROVAL_MODE_MAX_TIER[mode]];
}
```

| 模式 | 自動通過的 tier | 需 prompt 的 tier |
|---|---|---|
| `always-ask` | `read` | `write`, `exec` |
| `write` | `read`, `write` | `exec` |
| `yolo` | `read`, `write`, `exec` | （無） |

**注意**：模式只決定「自動通過哪些 tier」。具體的 `deny`/`prompt` 仍由前兩層決定。

---

## 完整解析流程（`resolveApproval`，line 120-219）

```typescript
export function resolveApproval(tool, args, mode, userConfig) {
  const decision = getToolDecision(tool, args);          // 第 1 層
  const policyKey = decision.policyKey ?? tool.name;
  const effectiveUserPolicy = ...;                        // 第 2 層

  // 1. Tool-side deny：最高優先級，不可被覆寫
  if (decision.policy === "deny") return { policy: "deny", source: "tool", ... };

  // 2. User-side deny：第二優先級，不可被覆寫
  if (effectiveUserPolicy === "deny") return { policy: "deny", source: "user", ... };

  // 3. Yolo 模式特殊處理
  if (mode === "yolo") {
    if (decision.policy) {                                // tool 有 policy（allow/deny/prompt）
      return { policy: decision.policy, source: "tool", ... };
    }
    // tool 無 policy → 看 user policy，否則 allow
    return { policy: effectiveUserPolicy ?? "allow", source: effectiveUserPolicy ? "user" : "mode", ... };
  }

  // 4. Tool-side override=true：工具強制決定（但 deny 已在步驟 1 攔截）
  if (decision.override) {
    return { policy: decision.policy === "allow" ? "allow" : "prompt", override: true, source: "tool", ... };
  }

  // 5. Tool-side allow/prompt：工具明確宣告
  if (decision.policy === "allow" || decision.policy === "prompt") {
    return { policy: decision.policy, source: "tool", ... };
  }

  // 6. User-side allow/prompt：使用者覆寫
  if (effectiveUserPolicy) {
    return { policy: effectiveUserPolicy, source: "user", ... };
  }

  // 7. Mode-based：以上都沒決定，才看模式門檻
  if (modeApprovesTier(mode, decision.tier)) {
    return { policy: "allow", source: "mode" };
  }

  // 8. 預設：prompt
  return { policy: "prompt", source: "mode", ... };
}
```

**決策流程圖**：

```
工具宣告 deny  ──► DENY（不可跨越）
    │
    ├─ 工具宣告 allow/prompt/override ──► 用該政策
    │
    └─ 工具無政策
         │
         ├─ 使用者 deny ──► DENY（不可跨越）
         │
         ├─ 使用者 allow/prompt ──► 用該政策
         │
         └─ 使用者無政策
              │
              ├─ yolo 模式 ──► ALLOW（但 tool-side policy 仍生效！）
              │
              └─ 非 yolo ──► tier <= mode 門檻？→ ALLOW : PROMPT
```

---

## 關鍵設計細節

### 1. `policyKey`：同一工具在 read/write 間切換

`lsp`、`dap`、`computer`、`write(xd://)` 等工具，依 `args` 決定 tier，並用 `policyKey` 接到使用者覆寫：

```typescript
// lsp/servers.ts LSP_READONLY_ACTIONS
approval(args) {
  if (LSP_READONLY_ACTIONS.has(args.action)) return "read";
  return { tier: "write", policyKey: "lsp" }; // 用 tools.approval.lsp 覆寫
}
```

**效果**：使用者設 `tools.approval.lsp: allow`，所有 LSP 動作（含 write tier）都通過；設 `deny` 全擋。不需要為每個 action 設定。

### 2. bash 的 token 化審批（`bash.ts` line 288-294）

```typescript
function bashApprovalRuleMatches(command, rule) {
  if (rule.approval === "allow") {
    if (hasBashApprovalShellControl(command)) return false; // 有 shell control syntax → 不 allow
    return commandMatchesBashApprovalPattern(command, rule.match); // 整行匹配
  }
  // deny/prompt：分段匹配
  return commandSegmentMatchesBashApprovalPattern(command, rule.match);
}

function commandSegmentMatchesBashApprovalPattern(command, pattern) {
  const regex = bashApprovalPatternToRegExp(pattern);
  if (regex.test(normalizedCommand)) return true;
  return bashCommandSegments(command).some(segment => regex.test(segment));
}
```

**為什麼 `allow` 不准穿越 `&&` `;`？**

- `allow` =「我保證這整行安全」。但 `cd x && rm -rf /` 中，`cd x` 安全、後面不安全。若 `allow` 只匹配前段，**惡意段會溜過去**。
- 所以 `allow` 必須**整行匹配**且**無 shell control syntax**（`&&` `||` `|` `&` `;` newline、subshell）。
- `deny`/`prompt` =「我看見危險就擋」。分段檢查、`cd x && rm -rf /` 中 `rm -rf /` 觸發 deny，**整行擋下**。

**`CRITICAL_BASH_PATTERNS`**（line 172-217）：硬編碼的危險命令正則（`rm -rf /`、`chmod -R 777 /`、`curl | bash`、`kill -9 1`、`shutdown`、`nc -e` 等），無論使用者設什麼，**永遠觸發 deny/prompt**（在 pattern rules 之前先檢查）。

### 3. `formatApprovalDetails`：把執行內容塞給使用者看

```typescript
// line 267-288
export function formatApprovalPrompt(tool, args, reason) {
  const lines = [`Allow tool: ${tool.name}`];
  if (tool.name.startsWith("mcp__") && tool.approval === undefined) {
    lines.push("Origin: MCP server tool");
  }
  if (reason) lines.push(`Reason: ${reason}`);
  const details = tool.formatApprovalDetails?.(args);
  if (details) lines.push(details); // 截到 2000 字
  return lines.join("\n");
}
```

每個工具可自訂 `formatApprovalDetails(args)`，回傳要顯示給使用者的細節（如 bash 顯示命令、edit 顯示檔案路徑、diff）。預設截 2000 字，避免塞爆 prompt。

### 4. MCP 工具預設 `write`、未知自訂工具預設 `exec`

- MCP 伺服器工具：宣告 `approval: "write"`（可讀可改不可執行）
- 使用者自訂工具若未宣告 `approval`：`normalizeDecision` 回傳 `{ tier: "exec" }` → **fail-closed**

### 5. checkpoint / rewind：互含姊妹工具

```typescript
// tools/index.ts createDefaultTools()
if (tool.name === "checkpoint") {
  tool.approval = "read"; // 只讀 tier
}
if (tool.name === "rewind") {
  tool.approval = "read";
}
// 註冊邏輯：強制互含
```

`checkpoint` 寫入 session 標記、`rewind` 切回標記。**兩者必須同時存在**，否則單獨用會破壞 session tree 一致性。註冊時強制互含，避免使用者只裝一個導致錯誤。

### 6. subagent：headless yolo，父層 `task` 是唯一授權邊界

```typescript
// task/spawn-policy.ts, task/index.ts
// subagent 預設 headless yolo
// 父層 `task` 工具通過 = 唯一授權邊界
// subagent 內的 user `prompt` 會 reject call 而非偷偷放行
// tools.approval.eval 不被 bash.patterns 蓋到，要在 eval 內擋 shell 必須另外設
```

- subagent 跑在隔離 session，預設 `--yolo`（headless）
- 父層通過 `task` tool 就是授權；subagent 內部的審批**不會**偷偷升級
- `eval` 工具內的 shell 需單獨設 `tools.approval.eval`，不受 `bash.patterns` 影響

---

## 學到的事

1. **三層不是重複**——工具宣告（語意）、使用者覆寫（偏好）、模式（粗略分級）各有語意，疊加才完整
2. **Fail-closed 是唯一安全的預設**——未宣告 = `exec`、格式錯 = `exec`、未知工具 = `exec`。寧可多擋、不可少擋
3. **Deny 永遠贏**——tool-side deny、user-side deny 都不可被模式、override、yolo 跨越。這是安全基線
4. **`policyKey` 解決「同工具不同參數不同審批」**——不需要拆成多個工具，一個工具內部動態決定 tier + policyKey
5. **bash 的 `allow` 整行匹配是為了防 `cd x && rm -rf /`**——shell control syntax 檢查在同一處（`hasBashApprovalShellControl`），邏輯集中
6. **yolo ≠ 無視所有政策**——tool-side `policy: deny|prompt`、user-side `deny|prompt` 在 yolo 仍生效；只有 `override: true` 在 yolo 被忽略（不強迫 prompt）

---

## 參考資料

- `packages/coding-agent/src/tools/approval.ts` — `resolveApproval`（120-219）、`getToolDecision`（80-98）、`modeApprovesTier`（100-102）、`APPROVAL_MODE_MAX_TIER`（37-41）、`formatApprovalPrompt`（267-288）、`CRITICAL_BASH_PATTERNS`（172-217）
- `packages/coding-agent/src/tools/bash.ts` — `bashApprovalRuleMatches`（288-294）、`commandSegmentMatchesBashApprovalPattern`（276-282）、`bashCommandSegments`（268-272）、`CRITICAL_BASH_PATTERNS`
- `packages/coding-agent/src/tools/checkpoint.ts` — `CheckpointTool`、`RewindTool` 互含註冊
- `packages/coding-agent/src/tools/task/spawn-policy.ts` / `task/index.ts` — subagent headless yolo、父層授權邊界
- `docs/approval-mode.md` — 官方審批模式文檔
- `packages/agent/src/types.ts` — `AgentTool.approval`（834）、`ToolApproval`（729-742）、`ToolTier`（706）

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 4 篇。上一篇：[四種 compaction 策略](/posts/tech/2026-08-31-omp-four-compaction-strategies)。下一篇：bash 的 token 化審批細節（待發布）*