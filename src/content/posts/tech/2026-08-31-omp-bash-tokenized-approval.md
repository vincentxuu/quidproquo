---
title: "OMP bash token 化審批：為什麼 allow 必須覆蓋整行、deny/prompt 卻分段比對？bash.patterns glob 的設計成本"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, bash, approval, security, shell, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 5
tldr: "omp bash 工具的審批引擎把命令用共享 shell tokenizer 切成段（依 `;` `&&` `||` `|` `&` newline、subshell），deny/prompt 規則對**每段**分別匹配 glob，任一段命中即觸發；allow 規則要求**整行匹配**且**無 shell control syntax**，防止 `cd x && rm -rf /` 此類惡意段溜過去。CRITICAL_BASH_PATTERNS 硬編碼 45 個危險命令正則（`rm -rf /`、`chmod -R 777 /`、`curl | bash`、`kill -9 1` 等），優先於使用者 pattern 生效。設計權衡：allow 嚴格是為了安全，deny/prompt 寬鬆是為了可用性。"
description: "深入 bash.ts 的 bashApprovalRuleMatches、commandSegmentMatchesBashApprovalPattern、bashCommandSegments、CRITICAL_BASH_PATTERNS，拆解 shell tokenizer 如何切段、glob-to-regex 轉換、allow/deny/prompt 三種模式的語意差異、關鍵字正則的設計哲學，以及為什麼這樣切比單純字串匹配更安全。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 5 篇。上一篇拆了 [審批三層與 fail-closed](/posts/tech/2026-08-31-omp-approval-three-layers)，這篇專門看 bash 工具怎麼把「命令字串」轉成「可審批的段」，以及為什麼 allow/deny/prompt 三種模式要區別對待。

---

## TL;DR

- **bashCommandSegments**（line 268-272）：用共享 `tokenizeShellSegments` 把命令按 `;` `&&` `||` `|` `&` newline、subshell 切成段，每段是獨立的 shell command
- **deny/prompt 匹配**（line 276-282）：glob-to-regex 轉換，對**整行**與**每一段**分別測試，任一命中即觸發
- **allow 匹配**（line 288-294）：**必須整行匹配**，且 `hasBashApprovalShellControl` 檢查無 shell control syntax（`&&` `||` `|` `&` `;` newline、subshell）
- **CRITICAL_BASH_PATTERNS**（line 172-217）：45 個硬編碼危險命令正則，優先於使用者 pattern、無論使用者設什麼都先生效
- **bash.patterns 設定**：使用者可自訂 glob pattern + approval（allow/deny/prompt），支援 `*` 通配符

---

## 情境

你設定 `tools.approval.bash: allow`，以為所有 bash 都能自動跑。但你跑 `cd /tmp && rm -rf /` 時，**omp 仍然會跳出審批提示**。

為什麼？因為 omp 的 bash 審批不是簡單的「整行字串匹配」，而是把命令**切成段**，對每段分別判斷。

---

## 核心機制：三層匹配管線

### 1. 切段：`bashCommandSegments`（line 268-272）

```typescript
function bashCommandSegments(command: string): string[] {
  return tokenizeShellSegments(command)
    .map(segment => segment.join(" "))
    .filter(segment => segment.length > 0);
}
```

`tokenizeShellSegments`（來自 `pi-shell` crate / `pi-utils`）是**共享的 shell tokenizer**，正確處理：

| 分隔符 | 說明 |
|---|---|
| `;` | 循序執行 |
| `&&` | 成功才執行下一條 |
| `||` | 失敗才執行下一條 |
| `|` | pipe |
| `&` | 背景執行 |
| newline | 換行分隔 |
| `(` `)` | subshell |

**關鍵**：它能正確處理引號、轉義字元、here-doc 等，**不會在字串內部誤切**。

例子：
```bash
cd /tmp && rm -rf / ; echo "done"
```
切成兩段：
1. `cd /tmp && rm -rf /`
2. `echo "done"`

再進一步，`cd /tmp && rm -rf /` 內部的 `&&` 是段內的 control operator，不再切分（因為 tokenizer 已經把它識別為同一段的一部份）。

---

### 2. deny/prompt：分段匹配（line 276-282）

```typescript
function commandSegmentMatchesBashApprovalPattern(command, pattern) {
  const regex = bashApprovalPatternToRegExp(pattern);
  const normalizedCommand = normalizeBashApprovalPattern(command);
  if (normalizedCommand.length === 0) return false;
  if (regex.test(normalizedCommand)) return true;  // 整行匹配
  return bashCommandSegments(command).some(segment => regex.test(segment));  // 分段匹配
}
```

**邏輯**：先試整行，再試每一段。**任一段命中即觸發**。

為什麼？因為 `deny`/`prompt` 的語意是：**「我看見危險就擋」**。哪怕危險藏在 `&&` 後面、 `|` 管線裡、 subshell 內，只要有段匹配，整行就要被擋。

例子：
- Pattern: `rm -rf *`
- Command: `cd /tmp && rm -rf /`
- 整行不匹配，但第二段 `rm -rf /` 匹配 → **觸發 deny/prompt**

---

### 3. allow：整行匹配 + 無 shell control（line 288-294）

```typescript
function bashApprovalRuleMatches(command, rule) {
  if (rule.approval === "allow") {
    if (hasBashApprovalShellControl(command)) return false;  // 有 shell control → 拒絕 allow
    return commandMatchesBashApprovalPattern(command, rule.match);  // 整行匹配
  }
  return commandSegmentMatchesBashApprovalPattern(command, rule.match);  // deny/prompt 走分段
}
```

**兩個條件同時滿足才 allow**：

1. **整行匹配** pattern
2. **無 shell control syntax**（`hasBashApprovalShellControl`）

`hasBashApprovalShellControl` 檢查：
```typescript
function hasBashApprovalShellControl(command: string): boolean {
  return /[;&|()]|&&|\|\|/.test(command);  // 簡化版
}
```

**為什麼這麼嚴格？**

`allow` 的語意是：**「我保證這整行命令安全」**。但 `cd /tmp && rm -rf /` 中：
- 前段 `cd /tmp` 安全
- 後段 `rm -rf /` 危險

若 `allow` 只匹配前段，惡意段就溜過去了。所以 **allow 必須覆蓋整行**，且**整行不能含任何 control operator**——否則無法保證後段安全。

---

## CRITICAL_BASH_PATTERNS：硬編碼的最後防線（line 172-217）

```typescript
export const CRITICAL_BASH_PATTERNS = [
  // Recursive destruction
  /\brm\s+(?:-\S+\s+)*(?:-[a-z]*[rRfF][a-z]*|--recursive|--force)\s+(?:-\S+\s+)*\//i,
  /\brm\s+(?:-\S+\s+)*--no-preserve-root\b/i,
  /\bsudo\s+rm\b/i,
  /\bchmod\s+-R\s+[0-7]+\s+\//i,
  // Fork bomb
  /:\(\)\s*\{\s*:\s*\|\s*:/i,
  // Disk destruction
  />\s*\/dev\/sd[a-z]/i,
  /\bmkfs(\.|\b)/i,
  // Remote-fetch-then-execute
  /\b(?:curl|wget|fetch)\b[^|]*\|\s*(?:bash|sh|zsh|fish)\b/i,
  // Process control
  /\bkill\s+-9\s+1\b/,
  /(?:^|[\s;&|(])(?:shutdown|poweroff|reboot|halt)(?:\s|$|[;|&])/i,
  // Network exfil
  /\bnc\b[^|;]*\s-[a-zA-Z]*[ec][a-zA-Z]*\s/i,
] as const;
```

**特性**：

| 特性 | 說明 |
|---|---|
| **優先於使用者 pattern** | 在 `getBashApprovalPatternRules` 之前先檢查 |
| **不可關閉** | 使用者無法透過 config 禁用 |
| **涵蓋 7 大類** | 遞歸銷毀、fork bomb、磁碟銷毀、遠程抓取執行、進程控制、系統配置破壞、網路外洩 |
| **正則而非 glob** | 能表達 glob 做不到的複雜模式（如選項順序不固定的 `rm -rf /`） |

---

## glob-to-regex 轉換（line 230-236）

```typescript
function bashApprovalPatternToRegExp(pattern: string): RegExp {
  const escaped = normalizeBashApprovalPattern(pattern)
    .split("*")
    .map(part => part.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&"))
    .join(".*");
  return new RegExp(`^${escaped}$`, "u");
}
```

- `*` → `.*`（任意字串）
- 其他特殊字元 → 轉義
- 全字串匹配（`^...$`）

使用者設定範例：
```yaml
bash.patterns:
  - match: "git *"
    approval: allow
  - match: "npm run *"
    approval: allow
  - match: "*rm -rf *"
    approval: deny
```

---

## 完整決策流程

```
用戶輸入命令
    │
    ├─► 1. CRITICAL_BASH_PATTERNS 檢查（45 條正則）
    │       命中 → DENY/PROMPT（不可覆蓋）
    │
    ├─► 2. bash.patterns 規則遍歷（使用者自訂）
    │       allow 規則：hasShellControl？→ 否 → 整行匹配？→ 是 → ALLOW
    │       deny/prompt 規則：整行或任一段匹配？→ 是 → DENY/PROMPT
    │
    └─► 3. 無規則匹配 → 交給通用審批三層（approval.ts resolveApproval）
            依工具 tier (bash 預設 exec) + 模式 判斷
```

---

## 設計權衡與哲學

| 維度 | allow | deny/prompt |
|---|---|---|
| **語意** | 「我保證整行安全」 | 「我看見危險就擋」 |
| **匹配範圍** | 整行 | 整行 + 每段 |
| **Shell control** | 禁止（有 `&&` 等即拒絕） | 不檢查（危險可能藏在段裡） |
| **誤判風險** | 假陰性（漏過安全命令） | 假陽性（誤擋安全命令） |
| **設計傾向** | 寧可不 allow、不可錯 allow | 寧可誤擋、不可漏過危險 |

**為什麼不直接用字串包含檢查？**

- `rm -rf /` 要匹配 `rm -rf -- /`、`rm --recursive --force /`、`rm -rf -v /` 等變體
- 選項順序不固定、長短選項混用、中間可插其他選項
- glob 只能做前綴/後綴/中間通配，**正則才能表達「選項任意順序、但必須含 `-rf` 且目標為 `/`」**

---

## 學到的事

1. **Shell 命令不是字串**——`&&` `||` `|` `&` `;` subshell 都會改變執行語意，審批必須理解 shell grammar，不能當純文字處理
2. **Allow 比 Deny 更難**——Allow 要證明「整行無危險」，Deny 只需找到「一處危險」。所以 allow 條件更嚴（整行匹配 + 無 control syntax）
3. **共享 tokenizer 是關鍵**——`tokenizeShellSegments` 在 bash 工具執行、審批、渲染三處共用，保證切段邏輯一致（單一真相來源）
4. **硬編碼關鍵字正則是最後防線**——使用者 pattern 是「加分項」，CRITICAL_BASH_PATTERNS 是「底線」，不可被配置繞過
5. **Glob-to-regex 要小心**——`*` 轉 `.*` 但要先 escape 其他 meta 字元，否則 `rm *` 會匹配 `rm -rf`（`-` 未 escape）

---

## 參考資料

- `packages/coding-agent/src/tools/bash.ts` — `bashApprovalRuleMatches`（288-294）、`commandSegmentMatchesBashApprovalPattern`（276-282）、`bashCommandSegments`（268-272）、`bashApprovalPatternToRegExp`（230-236）、`CRITICAL_BASH_PATTERNS`（172-217）、`hasBashApprovalShellControl`
- `packages/coding-agent/src/tools/approval.ts` — `resolveApproval` 如何調用 bash 審批
- `docs/approval-mode.md` — 官方審批模式文檔

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 5 篇。上一篇：[審批三層與 fail-closed](/posts/tech/2026-08-31-omp-approval-three-layers)。下一篇：hashline edit 與 noop-loop-guard（待發布）*