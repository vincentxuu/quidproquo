---
title: "OMP bash tokenized approval: why allow must cover the whole line while deny/prompt match per segment — the design cost of bash.patterns glob"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, bash, approval, security, shell, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 5
tldr: "omp's bash approval engine tokenizes commands into segments via a shared shell tokenizer (split on `;`, `&&`, `||`, `|`, `&`, newline, subshell). deny/prompt rules match glob against each segment individually — any hit triggers. allow rules require whole-line match AND no shell control syntax, preventing `cd x && rm -rf /` from slipping through. CRITICAL_BASH_PATTERNS hardcodes 45 dangerous command regexes (`rm -rf /`, `chmod -R 777 /`, `curl | bash`, `kill -9 1`, etc.) that fire before user patterns and cannot be disabled. Design tradeoff: allow is strict for safety, deny/prompt permissive for catch-all."
description: "Deep dive into bash.ts: bashApprovalRuleMatches, commandSegmentMatchesBashApprovalPattern, bashCommandSegments, CRITICAL_BASH_PATTERNS. Breaking down how the shell tokenizer segments commands, glob-to-regex conversion, semantic differences between allow/deny/prompt modes, critical keyword regex design philosophy, and why this beats naive string matching."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 5. Previous post dissected the [three-layer approval & fail-closed](/posts/tech/2026-08-31-omp-approval-three-layers-en); this one zooms into how bash turns "command string" into "approvable segments" and why allow/deny/prompt three modes treat segments differently.

---

## TL;DR

- **bashCommandSegments** (lines 268-272): shared `tokenizeShellSegments` splits on `;`, `&&`, `||`, `|`, `&`, newline, subshell — each segment = independent shell command
- **deny/prompt matching** (lines 276-282): glob→regex, tests whole line then each segment; **any segment hit triggers**
- **allow matching** (lines 288-294): **must match whole line** AND `hasBashApprovalShellControl` confirms **no shell control syntax** (`&&`, `||`, `|`, `&`, `;`, newline, subshell)
- **CRITICAL_BASH_PATTERNS** (lines 172-217): 45 hardcoded dangerous command regexes (`rm -rf /`, `chmod -R 777 /`, `curl | bash`, `kill -9 1`, etc.) — fire before user patterns, cannot be disabled
- **bash.patterns config**: user-defined glob patterns + approval (allow/deny/prompt), supports `*` wildcard

---

## Context

You configure `tools.approval.bash: allow`, expecting all bash to auto-run. But `cd /tmp && rm -rf /` **still prompts for approval**.

Why? Because omp's bash approval isn't naive "whole-line string match" — it **tokenizes into segments** and judges each segment differently per mode.

---

## Core Mechanism: Three-Layer Matching Pipeline

### 1. Segmentation: `bashCommandSegments` (lines 268-272)

```typescript
function bashCommandSegments(command: string): string[] {
  return tokenizeShellSegments(command)
    .map(segment => segment.join(" "))
    .filter(segment => segment.length > 0);
}
```

`tokenizeShellSegments` (from `pi-shell` crate / `pi-utils`) is a **shared shell tokenizer** that correctly handles:

| Delimiter | Meaning |
|---|---|
| `;` | Sequential |
| `&&` | Run next on success |
| `||` | Run next on failure |
| `|` | Pipe |
| `&` | Background |
| newline | Line break |
| `(` `)` | Subshell |

**Key**: It handles quotes, escapes, here-docs — **never mis-splits inside strings**.

Example:
```bash
cd /tmp && rm -rf / ; echo "done"
```
Segments:
1. `cd /tmp && rm -rf /`
2. `echo "done"`

The `&&` inside segment 1 is a control operator *within* the segment, not a delimiter between segments (tokenizer already grouped it).

---

### 2. deny/prompt: Per-Segment Match (lines 276-282)

```typescript
function commandSegmentMatchesBashApprovalPattern(command, pattern) {
  const regex = bashApprovalPatternToRegExp(pattern);
  const normalizedCommand = normalizeBashApprovalPattern(command);
  if (normalizedCommand.length === 0) return false;
  if (regex.test(normalizedCommand)) return true;  // whole line
  return bashCommandSegments(command).some(segment => regex.test(segment));  // per segment
}
```

**Logic**: try whole line first, then each segment. **Any segment hit → trigger**.

Why? `deny`/`prompt` semantics: **"I see danger, I block"**. Danger hiding after `&&`, in a pipe, or in a subshell — if any segment matches, whole line blocked.

Example:
- Pattern: `rm -rf *`
- Command: `cd /tmp && rm -rf /`
- Whole line no match, but segment 2 `rm -rf /` matches → **deny/prompt fires**

---

### 3. allow: Whole Line + No Shell Control (lines 288-294)

```typescript
function bashApprovalRuleMatches(command, rule) {
  if (rule.approval === "allow") {
    if (hasBashApprovalShellControl(command)) return false;  // has control syntax → reject allow
    return commandMatchesBashApprovalPattern(command, rule.match);  // whole line match
  }
  return commandSegmentMatchesBashApprovalPattern(command, rule.match);  // deny/prompt uses segments
}
```

**Two conditions for allow**:

1. **Whole line matches** pattern
2. **No shell control syntax** (`hasBashApprovalShellControl`)

```typescript
function hasBashApprovalShellControl(command: string): boolean {
  return /[;&|()]|&&|\|\|/.test(command);  // simplified
}
```

**Why so strict?**

`allow` = "I vouch this **entire line** is safe". But `cd /tmp && rm -rf /`:
- Segment 1: `cd /tmp` — safe
- Segment 2: `rm -rf /` — dangerous

If `allow` only matched segment 1, the malicious part slips through. So **allow must cover whole line**, and **whole line must contain zero control operators** — otherwise can't guarantee later segments are safe.

---

## CRITICAL_BASH_PATTERNS: Hardcoded Last Defense (lines 172-217)

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

**Properties**:

| Property | Description |
|---|---|
| **Fires before user patterns** | Checked in `getBashApprovalPatternRules` prior to user rules |
| **Non-disablable** | User config cannot turn these off |
| **7 categories** | Recursive destruction, fork bomb, disk destruction, remote-fetch-execute, process control, system config destruction, network exfil |
| **Regex not glob** | Expresses complex patterns glob can't (e.g., `rm` option order variations) |

---

## Glob-to-Regex Conversion (lines 230-236)

```typescript
function bashApprovalPatternToRegExp(pattern: string): RegExp {
  const escaped = normalizeBashApprovalPattern(pattern)
    .split("*")
    .map(part => part.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&"))
    .join(".*");
  return new RegExp(`^${escaped}$`, "u");
}
```

- `*` → `.*` (any string)
- Other meta chars → escaped
- Full-string match (`^...$`)

User config example:
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

## Complete Decision Flow

```
User enters command
    │
    ├─► 1. CRITICAL_BASH_PATTERNS check (45 regexes)
    │       Hit → DENY/PROMPT (uncrossable)
    │
    ├─► 2. bash.patterns rules (user-defined)
    │       allow rule: hasShellControl? → no → whole line match? → yes → ALLOW
    │       deny/prompt rule: whole line or any segment match? → yes → DENY/PROMPT
    │
    └─► 3. No rule matched → falls back to generic three-layer approval (approval.ts resolveApproval)
            Based on tool tier (bash defaults exec) + mode
```

---

## Design Tradeoffs & Philosophy

| Dimension | allow | deny/prompt |
|---|---|---|
| **Semantics** | "I vouch entire line safe" | "I see danger, I block" |
| **Match scope** | Whole line | Whole line + each segment |
| **Shell control** | Forbidden (reject if `&&` etc present) | Not checked (danger may hide in segment) |
| **Error bias** | False negative (miss safe cmd) | False positive (over-block safe cmd) |
| **Design lean** | Rather not allow than wrongly allow | Rather over-block than miss danger |

**Why not simple substring check?**

- `rm -rf /` must match `rm -rf -- /`, `rm --recursive --force /`, `rm -rf -v /`, etc.
- Option order varies, short/long mixed, other options insertable
- Glob only does prefix/suffix/middle wildcard; **regex needed for "options any order, but must have `-rf` and target `/`"**

---

## Lessons Learned

1. **Shell commands aren't strings** — `&&`, `||`, `|`, `&`, `;`, subshell change execution semantics. Approval must understand shell grammar, not treat as plain text
2. **Allow is harder than deny** — Allow must prove "entire line safe"; deny only needs "one spot dangerous". Hence allow stricter (whole line + no control syntax)
3. **Shared tokenizer is key** — `tokenizeShellSegments` used in bash execution, approval, rendering — single source of truth for segmentation
4. **Hardcoded keyword regexes are the floor** — User patterns are "bonus"; CRITICAL_BASH_PATTERNS are "baseline", unconfigurable
5. **Glob-to-regex needs care** — `*` → `.*` but must escape other meta chars first, else `rm *` matches `rm -rf` (unescaped `-`)

---

## References

- `packages/coding-agent/src/tools/bash.ts` — `bashApprovalRuleMatches` (288-294), `commandSegmentMatchesBashApprovalPattern` (276-282), `bashCommandSegments` (268-272), `bashApprovalPatternToRegExp` (230-236), `CRITICAL_BASH_PATTERNS` (172-217), `hasBashApprovalShellControl`
- `packages/coding-agent/src/tools/approval.ts` — how `resolveApproval` invokes bash approval
- `docs/approval-mode.md` — official approval mode docs

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 5. Previous: [three-layer approval & fail-closed](/posts/tech/2026-08-31-omp-approval-three-layers-en). Next: hashline edit & noop-loop-guard (forthcoming)*