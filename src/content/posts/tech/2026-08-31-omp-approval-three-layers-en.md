---
title: "OMP three-layer approval & fail-closed: why undeclared custom tools become exec, and what yolo still blocks"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, approval, security, agent-loop, coding-agent, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 4
tldr: "omp's resolveApproval resolves in three layers: tool declaration → user override → mode tier. Undeclared or malformed approvals default to exec (fail-closed). Tool declares tier + optional policy/override/reason/policyKey; user overrides via tools.approval.<tool>; mode (always-ask/write/yolo) sets auto-allow tier ceiling. Iron laws: tool-side deny and user-side deny can never be crossed by mode; yolo ignores override: true but still honors policy: deny|allow|prompt. bash tokenizes approval: allow must cover whole line, deny/prompt match per segment. Same tool switches read/write via policyKey. checkpoint/rewind are paired sisters. subagent runs headless yolo; parent task is the only auth boundary."
description: "Deep dive into approval.ts resolveApproval three-layer decision logic, bash's tokenized approval design, per-argument read/write tier switching, checkpoint/rewind paired registration, subagent headless yolo auth boundary, and why this beats a simple allow/deny list."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 4. Previous posts dissected the [agent loop double while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en), [append-only context](/posts/tech/2026-08-31-omp-append-only-context-en), and [four compaction strategies](/posts/tech/2026-08-31-omp-four-compaction-strategies-en); this one examines "can this tool run?" — the approval decision pipeline.

---

## TL;DR

- **Three-layer resolution order** (`resolveApproval`, lines 120-219):
  1. **Tool declaration layer**: each tool declares `approval` (tier or function), optional `policy: allow|deny|prompt`, `override: true`, `reason`, `policyKey`. Missing/malformed → defaults to `exec` (fail-closed)
  2. **User override layer**: `tools.approval.<tool>: allow|deny|prompt`; `<policyKey>` falls back to tool name (e.g., `xd://` device dispatch uses `write`)
  3. **Mode layer** (`APPROVAL_MODE_MAX_TIER`, lines 37-41): `always-ask` auto-allows `read`; `write` auto-allows `read+write`; `yolo` auto-allows all. **In yolo**, `override: true` doesn't force prompt, but `policy: deny|allow|prompt` still takes effect

- **Iron laws**: tool-side `deny` and user-side `deny` can never be crossed by mode; `formatApprovalDetails` truncates execution details to 2,000 chars for prompt; MCP tools default `write`; unknown custom tools default `exec`; subagent runs headless yolo — parent `task` approval is the only auth boundary

- **Bash's tokenized approval**: `allow` must cover entire line, `deny/prompt` match per segment (`&&`, `;`, `|`, `&`, newline, subshell); shell control syntax blocks `allow` but not `deny/prompt`

- **Same tool switches read/write**: `lsp`/`dap`/`computer`/`write(xd://)` use `policyKey` to map args to user override

---

## Context

You write a custom tool but forget the `approval` field. When the model calls it, **how does omp decide whether to let it run?**

Or: you launch with `--yolo`, expecting everything auto-approves. But a tool internally declares `policy: "deny"` — **does it still get blocked?**

This is what omp's approval system solves: **three layers, fail-closed defaults, mode ≠ "allow all"**.

---

## Problem

A simple allow/deny list isn't enough. Reality is messier:

1. **Tool authors** want to declare "this tool needs approval by default, but certain args don't" (e.g., `write`'s `xd://` device dispatch)
2. **Users** want to override specific tools (e.g., `tools.approval.bash: allow`)
3. **Modes** provide coarse tiers (always-ask/write/yolo), but can't replace fine-grained control
4. **Safety**: unknown tools, malformed configs, missing fields — must **default deny/prompt** (fail-closed), never silently allow

omp's answer: **three stacked layers, fixed priority, deny always wins**.

---

## Solution: Precise Three-Layer Division

### Layer 1: Tool Declaration (`getToolDecision`, lines 80-98)

```typescript
// lines 80-98
function getToolDecision(tool, args) {
  const approval = tool.approval;
  const decision = typeof approval === "function" ? approval(args) : approval;
  return normalizeDecision(decision);
}

function normalizeDecision(value) {
  if (isToolTier(value)) {
    return { tier: value, override: false }; // simple tier: read/write/exec
  }
  if (isObject(value)) {
    // object form: { tier, policy, override, reason, policyKey }
    const tier = isToolTier(record.tier) ? record.tier : "exec"; // default exec!
    const reason = record.reason;
    const policy = normalizePolicy(record.policy); // allow/deny/prompt
    const policyKey = record.policyKey;
    return { tier, override: record.override === true, policy, reason, policyKey };
  }
  return { tier: "exec", override: false }; // default exec!
}
```

**Key mappings**:

| Declaration form | Parsed result |
|---|---|
| String `"read"`/`"write"`/`"exec"` | `{ tier, override: false }` |
| Object `{ tier: "write", policy: "deny" }` | `{ tier, policy, override, reason, policyKey }` |
| Function `args => ({ tier: "write", policy: "allow" })` | Dynamic per `args` |
| **Undeclared / malformed / non-object non-string** | **`{ tier: "exec", override: false }`** ← **fail-closed** |

**Why default `exec`?** `exec` is highest-risk tier (executes code, shell, browser, spawns agent). Any tool that doesn't declare "I'm safe" is assumed **most dangerous**. Safer than defaulting `read` and patching holes later.

### Layer 2: User Override (lines 127-134)

```typescript
const policyKey = decision.policyKey ?? tool.name;
const userPolicy = userConfig[policyKey] ? normalizePolicy(userConfig[policyKey]) : undefined;
const fallbackPolicy = (policyKey !== tool.name && !userPolicy && userConfig[tool.name])
  ? normalizePolicy(userConfig[tool.name]) : undefined;
const effectiveUserPolicy = userPolicy ?? fallbackPolicy;
```

- `policyKey`: tool can customize "which user config key applies". Defaults to tool name; `xd://` dispatch uses `policyKey: "write"` so user's `tools.approval.write` works
- **Fallback**: if `policyKey` has no user setting, fall back to `tools.approval.<tool.name>`
- **Effective policy** = `userPolicy` (priority) or `fallbackPolicy`

### Layer 3: Mode Tier Ceiling (`modeApprovesTier`, lines 100-102)

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

| Mode | Auto-allows tier | Prompts for tier |
|---|---|---|
| `always-ask` | `read` | `write`, `exec` |
| `write` | `read`, `write` | `exec` |
| `yolo` | `read`, `write`, `exec` | (none) |

**Note**: mode only decides "which tiers auto-allow". Concrete `deny`/`prompt` still from layers 1-2.

---

## Full Resolution Flow (`resolveApproval`, lines 120-219)

```typescript
export function resolveApproval(tool, args, mode, userConfig) {
  const decision = getToolDecision(tool, args);          // Layer 1
  const policyKey = decision.policyKey ?? tool.name;
  const effectiveUserPolicy = ...;                        // Layer 2

  // 1. Tool-side deny: highest priority, uncrossable
  if (decision.policy === "deny") return { policy: "deny", source: "tool", ... };

  // 2. User-side deny: second priority, uncrossable
  if (effectiveUserPolicy === "deny") return { policy: "deny", source: "user", ... };

  // 3. Yolo special handling
  if (mode === "yolo") {
    if (decision.policy) {                                // tool has policy (allow/deny/prompt)
      return { policy: decision.policy, source: "tool", ... };
    }
    // tool has no policy → check user policy, else allow
    return { policy: effectiveUserPolicy ?? "allow", source: effectiveUserPolicy ? "user" : "mode", ... };
  }

  // 4. Tool-side override=true: tool forces decision (but deny caught at step 1)
  if (decision.override) {
    return { policy: decision.policy === "allow" ? "allow" : "prompt", override: true, source: "tool", ... };
  }

  // 5. Tool-side allow/prompt: tool explicitly declared
  if (decision.policy === "allow" || decision.policy === "prompt") {
    return { policy: decision.policy, source: "tool", ... };
  }

  // 6. User-side allow/prompt: user override
  if (effectiveUserPolicy) {
    return { policy: effectiveUserPolicy, source: "user", ... };
  }

  // 7. Mode-based: only if above undecided
  if (modeApprovesTier(mode, decision.tier)) {
    return { policy: "allow", source: "mode" };
  }

  // 8. Default: prompt
  return { policy: "prompt", source: "mode", ... };
}
```

**Decision flowchart**:

```
Tool declares deny  ──► DENY (uncrossable)
    │
    ├─ Tool declares allow/prompt/override ──► use that policy
    │
    └─ Tool has no policy
         │
         ├─ User deny ──► DENY (uncrossable)
         │
         ├─ User allow/prompt ──► use that policy
         │
         └─ User has no policy
              │
              ├─ yolo mode ──► ALLOW (but tool-side policy still applies!)
              │
              └─ non-yolo ──► tier <= mode ceiling? → ALLOW : PROMPT
```

---

## Key Design Details

### 1. `policyKey`: Same Tool Switches read/write

`lsp`, `dap`, `computer`, `write(xd://)` decide tier from `args`, use `policyKey` to hook user override:

```typescript
// lsp/servers.ts LSP_READONLY_ACTIONS
approval(args) {
  if (LSP_READONLY_ACTIONS.has(args.action)) return "read";
  return { tier: "write", policyKey: "lsp" }; // uses tools.approval.lsp
}
```

**Effect**: user sets `tools.approval.lsp: allow` → all LSP actions (incl. write tier) allow; `deny` → all blocked. No per-action config needed.

### 2. Bash's Tokenized Approval (`bash.ts` lines 288-294)

```typescript
function bashApprovalRuleMatches(command, rule) {
  if (rule.approval === "allow") {
    if (hasBashApprovalShellControl(command)) return false; // shell control syntax → no allow
    return commandMatchesBashApprovalPattern(command, rule.match); // whole line match
  }
  // deny/prompt: per-segment match
  return commandSegmentMatchesBashApprovalPattern(command, rule.match);
}

function commandSegmentMatchesBashApprovalPattern(command, pattern) {
  const regex = bashApprovalPatternToRegExp(pattern);
  if (regex.test(normalizedCommand)) return true;
  return bashCommandSegments(command).some(segment => regex.test(segment));
}
```

**Why `allow` can't cross `&&` `;`?**

- `allow` = "I vouch this entire line is safe". But `cd x && rm -rf /` — `cd x` safe, second part not. If `allow` only matched first segment, **malicious part slips through**.
- So `allow` requires **whole-line match** AND **no shell control syntax** (`&&`, `||`, `|`, `&`, `;`, newline, subshell).
- `deny`/`prompt` = "I see danger, I block". Per-segment check; `cd x && rm -rf /` → `rm -rf /` triggers deny → **whole line blocked**.

**`CRITICAL_BASH_PATTERNS`** (lines 172-217): hardcoded dangerous command regexes (`rm -rf /`, `chmod -R 777 /`, `curl | bash`, `kill -9 1`, `shutdown`, `nc -e`, etc.) — **always** trigger deny/prompt regardless of user patterns (checked before pattern rules).

### 3. `formatApprovalDetails`: Show Execution Details to User

```typescript
// lines 267-288
export function formatApprovalPrompt(tool, args, reason) {
  const lines = [`Allow tool: ${tool.name}`];
  if (tool.name.startsWith("mcp__") && tool.approval === undefined) {
    lines.push("Origin: MCP server tool");
  }
  if (reason) lines.push(`Reason: ${reason}`);
  const details = tool.formatApprovalDetails?.(args);
  if (details) lines.push(details); // truncated to 2000 chars
  return lines.join("\n");
}
```

Each tool provides `formatApprovalDetails(args)` returning what to show (bash shows command, edit shows file path + diff). Default truncates at 2000 chars to avoid prompt bloat.

### 4. MCP Tools Default `write`; Unknown Custom Tools Default `exec`

- MCP server tools: declare `approval: "write"` (read/write, no exec)
- User custom tools without `approval`: `normalizeDecision` returns `{ tier: "exec" }` → **fail-closed**

### 5. checkpoint / rewind: Paired Sister Tools

```typescript
// tools/index.ts createDefaultTools()
if (tool.name === "checkpoint") tool.approval = "read";
if (tool.name === "rewind") tool.approval = "read";
// registration: forced pairing
```

`checkpoint` writes session marker, `rewind` jumps back. **Both must exist** — using one alone breaks session tree consistency. Registration enforces pairing.

### 6. Subagent: Headless yolo, Parent `task` Is Only Auth Boundary

```typescript
// task/spawn-policy.ts, task/index.ts
// subagent defaults headless yolo
// parent `task` approval = only auth boundary
// subagent's internal user `prompt` rejects call, doesn't silently allow
// tools.approval.eval not covered by bash.patterns; must set separately to block shell in eval
```

- Subagent runs isolated session, defaults `--yolo` (headless)
- Parent `task` tool approval = sole authorization; subagent's internal approvals **don't** silently escalate
- `eval` tool's internal shell needs separate `tools.approval.eval`, not covered by `bash.patterns`

---

## Lessons Learned

1. **Three layers aren't redundant** — tool declaration (semantics), user override (preference), mode (coarse tier ceiling) each own a concern; stacking completes the picture
2. **Fail-closed is the only safe default** — undeclared = `exec`, malformed = `exec`, unknown tool = `exec`. Better over-block than under-block
3. **Deny always wins** — tool-side deny, user-side deny can never be crossed by mode, override, yolo. This is the security baseline
4. **`policyKey` solves "same tool, different args, different approval"** — no need to split into multiple tools; one tool decides tier + policyKey dynamically
5. **Bash's `allow` whole-line match prevents `cd x && rm -rf /`** — shell control syntax check centralized in `hasBashApprovalShellControl`
6. **yolo ≠ ignore all policies** — tool-side `policy: deny|prompt`, user-side `deny|prompt` still apply in yolo; only `override: true` is ignored in yolo (doesn't force prompt)

---

## References

- `packages/coding-agent/src/tools/approval.ts` — `resolveApproval` (120-219), `getToolDecision` (80-98), `modeApprovesTier` (100-102), `APPROVAL_MODE_MAX_TIER` (37-41), `formatApprovalPrompt` (267-288), `CRITICAL_BASH_PATTERNS` (172-217)
- `packages/coding-agent/src/tools/bash.ts` — `bashApprovalRuleMatches` (288-294), `commandSegmentMatchesBashApprovalPattern` (276-282), `bashCommandSegments` (268-272), `CRITICAL_BASH_PATTERNS`
- `packages/coding-agent/src/tools/checkpoint.ts` — `CheckpointTool`, `RewindTool` paired registration
- `packages/coding-agent/src/tools/task/spawn-policy.ts` / `task/index.ts` — subagent headless yolo, parent auth boundary
- `docs/approval-mode.md` — official approval mode docs
- `packages/agent/src/types.ts` — `AgentTool.approval` (834), `ToolApproval` (729-742), `ToolTier` (706)

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 4. Previous: [four compaction strategies](/posts/tech/2026-08-31-omp-four-compaction-strategies-en). Next: bash tokenized approval details (forthcoming)*