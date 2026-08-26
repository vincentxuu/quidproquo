---
title: "Claude Code Permission Modes Explained: Five Modes from Default to Auto"
date: 2026-03-16
type: guide
category: tech
tags: [claude-code, ai-tools, automation, cli, permissions, auto-mode, security]
lang: en
tldr: "Claude Code has five permission modes: default (confirm each step), acceptEdits (auto-accept edits), plan (read-only planning), auto (background AI classifier review), and bypassPermissions (YOLO, skip everything). Switch with Shift+Tab or configure via settings.json. Auto mode is the sweet spot — no step-by-step confirmations, but with safety guardrails."
description: "A complete guide to Claude Code's five permission modes: default, acceptEdits, plan, auto, bypassPermissions (YOLO), and dontAsk — covering how each works, when to use it, how to configure it, and how the auto mode classifier and custom rules operate."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 8
---

🌏 [中文版](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions)

> For the proper tiered approach (each permission mode and auto mode configuration), read [Permissions and Auto Mode](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode-en); this post covers what it costs when you still decide to bypass it all.

## TL;DR

Claude Code has five permission modes, from most restrictive to most permissive: `plan` (read-only) → `default` (confirm each step) → `acceptEdits` (auto-accept edits) → `auto` (AI classifier review) → `bypassPermissions` (YOLO, skip everything). For most workflows, **auto mode** is all you need — it uses a background classifier to assess safety automatically and only blocks genuinely dangerous operations. As of week 32 of 2026, interactive sessions on Pro, Max, and Team plans start in auto mode by default.

---

## Mode Overview

| Mode | What Claude can do without asking | Best for |
|------|-------------------------------------|----------|
| `default` | Read files | First use, sensitive operations |
| `acceptEdits` | Read and write files | Fast iterative development |
| `plan` | Read files (no modifications) | Exploring codebase, planning refactors |
| `auto` | All operations (with background safety checks) | Long-running tasks, reducing prompt fatigue |
| `bypassPermissions` | All operations (no checks whatsoever) | Docker / VM isolated environments only |
| `dontAsk` | Only pre-approved tools | Locked-down environments, CI pipelines |

## Switching Modes

### During a Session

In the CLI, press **Shift+Tab** to cycle through: `default` → `acceptEdits` → `plan`. When your account meets the requirements, `auto` joins the cycle right after `plan`; `bypassPermissions` only appears after you've started with its flag, and `dontAsk` is never in the cycle — set it with `--permission-mode dontAsk`.

In VS Code and Claude Desktop, click the mode selector next to the input box.

### At Launch

```bash
claude --permission-mode plan
claude --permission-mode auto
```

### Set as Default

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

---

## Plan Mode: Think Before You Act

Plan mode restricts Claude to read-only access — it can analyze your codebase and propose solutions, but cannot modify your source code.

### Usage

```bash
# Start an entire session in plan mode
claude --permission-mode plan

# Or prefix a single request with /plan
/plan Refactor the authentication module and give me a migration plan
```

### After Planning

Once Claude presents a plan, it will ask how to proceed:
- **Yes, and use auto mode** — approve the plan and execute in auto mode immediately (falls back to auto-accepting edits when auto mode is unavailable)
- **Yes, manually approve edits** — approve, then review each edit individually
- **No, keep planning** — stay in plan mode and refine the plan

Great for getting the full picture before committing to a multi-step implementation:

```
I want to migrate the auth system from JWT to OAuth2.
Analyze the current implementation and give me a complete migration plan.
```

---

## Auto Mode: The Sweet Spot

Auto mode is the safe alternative to `bypassPermissions` (YOLO). It uses a separate **classifier model** running in the background to evaluate each operation and determine whether it is safe.

> Now available on all plans (requires Opus 4.6 / Sonnet 4.6 or later, or Fable 5). It's on by default for Team and Enterprise; admins can turn it off via `disableAutoMode` in managed settings. As of week 32 of 2026, interactive sessions on Pro, Max, and Team plans start in auto mode by default (CLI v2.1.228+; `claude -p` and Agent SDK sessions still start in default mode).

### How It Works

Each operation is evaluated in a fixed order:

1. Your allow/deny rules → pass or block immediately
2. Read-only operations and file edits within the working directory → automatically allowed
3. Everything else → sent to the classifier
4. Classifier blocks → Claude receives the reason and attempts an alternative

### What the Classifier Blocks by Default

**Blocked**:
- Download and execute code (`curl | bash`)
- Send sensitive data to external services
- Production deployments and migrations
- Bulk deletion from cloud storage
- Granting IAM / repo permissions
- Modifying shared infrastructure
- Force push, rewriting remote history
- Destructive git operations: `git reset --hard`, `git checkout -- .`, `git clean -fd`, dropping stashes (treated as discarding uncommitted changes)

**Allowed**:
- File operations within the working directory
- Installing dependencies declared in lock files
- Reading `.env` and sending credentials to the corresponding API
- Read-only HTTP requests
- Pushing to any branch of the repository you're working in (including the default branch as of v2.1.211; branches named as deploy targets like `production` or `gh-pages` are judged separately)

### Customizing Classifier Rules

If the classifier is blocking legitimate operations for your team (pushing to your org's repos, writing to your company's bucket), add `autoMode.environment` in managed settings to tell the classifier these targets are trusted.

### Fallback Behavior

If the classifier blocks 3 consecutive operations or 20 total → auto mode pauses and reverts to manual confirmation. After you confirm, the counters reset and auto mode resumes.

### Handling Sub-agents

- Before a sub-agent launches: classifier reviews the task description
- While a sub-agent runs: same block/allow rules apply
- After a sub-agent completes: classifier reviews the full operation history

---

## bypassPermissions (YOLO Mode)

`--dangerously-skip-permissions` is equivalent to `--permission-mode bypassPermissions`:

```bash
claude --dangerously-skip-permissions "Fix all lint errors"
claude --permission-mode bypassPermissions "Fix all lint errors"
```

### The Risk Calculus Has Changed

When this post was first written, manual approval was the only line of defense; auto mode is now the default for interactive sessions on Pro, Max, and Team plans, so an ordinary session already has a background classifier watching it. `bypassPermissions` therefore no longer means "a few fewer confirmations" — it means skipping that classifier entirely. What you're removing is a safety net that's on by default.

### What Gets Bypassed

- All permission prompts
- Command blocklists (`curl`, `wget`, etc. are unblocked)
- Write restrictions (not limited to the working directory)
- MCP server trust verification
- Sub-agents inherit full permissions and cannot be overridden

### A Real Incident

A developer asked Claude to clean up unused packages in their project. Claude ended up running `rm -rf tests/ patches/ plan/ ~/` — that trailing `~/` wiped the entire home directory. Research by eesel AI found that 32% of developers using YOLO mode have experienced unintended file modifications, and 9% have suffered data loss.

### Three Safety Levels

#### Level 1: Git Checkpoint

```bash
git add -A && git commit -m "Checkpoint pre-Claude"
claude --dangerously-skip-permissions "Refactor all API handlers"
# If something goes wrong
git reset --hard HEAD
```

#### Level 2: Restrict Dangerous Tools

```bash
claude --dangerously-skip-permissions \
  --disallowedTools "Bash(rm:*),Bash(curl:*),Bash(wget:*)" \
  "Refactor all API handlers"
```

#### Level 3: Docker Isolation (Safest)

```bash
docker run --rm \
  --network none \
  -v $(pwd):/workspace \
  my-dev-container \
  claude --dangerously-skip-permissions "Fix all lint errors"
```

### YOLO vs Auto Mode

| | Auto Mode | YOLO Mode |
|---|---|---|
| Safety checks | Background classifier review | None |
| Prompt injection protection | Yes (classifier is independent of main conversation) | None |
| Token consumption | Higher (classifier calls) | Standard |
| Requires | All plans (model restrictions apply) | Any plan |
| Sub-agent control | Yes (reviewed before and after spawn) | None |

**Bottom line: use auto mode when you can, and only fall back to YOLO in Docker.** If you genuinely need YOLO, run it inside a container.

---

## dontAsk Mode: Allowlist Only

`dontAsk` automatically rejects all tools that are not explicitly permitted. Ideal for CI pipelines or locked-down environments:

```bash
claude --permission-mode dontAsk
```

Pair with `settings.json` for precise control:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write(src/**)",
      "Bash(npm test)",
      "Bash(npm run lint)"
    ]
  }
}
```

---

## Fine-Grained Control with settings.json

Regardless of which mode you use, you can layer additional rules via the `permissions` config:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Read",
      "Write(src/**)",
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(tsc:*)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(production.config.*)",
      "Bash(rm *)",
      "Bash(sudo *)"
    ]
  }
}
```

This configuration can be committed to the repo so the whole team shares the same security baseline. Override personal settings with `.claude/settings.local.json`.

---

## Mode Comparison Summary

| | default | acceptEdits | auto | dontAsk | bypassPermissions |
|---|---|---|---|---|---|
| Permission prompts | Edits + commands | Commands only | None (unless fallback) | None (unallowed tools auto-rejected) | None |
| Safety checks | You review manually | You review commands | Classifier reviews | Your allowlist rules | None |
| Token consumption | Standard | Standard | Higher | Standard | Standard |

---

## References

- [Claude Code - Permission modes](https://code.claude.com/docs/en/permission-modes)
- [Claude Code - Configure auto mode](https://code.claude.com/docs/en/auto-mode-config)
- [Claude Code - Permissions](https://code.claude.com/docs/en/permissions)
- [Auto Mode Announcement](https://claude.com/blog/auto-mode)
- [claude --dangerously-skip-permissions - PromptLayer](https://blog.promptlayer.com/claude-dangerously-skip-permissions/)
- [YOLO Mode Hidden Risks | UpGuard](https://www.upguard.com/blog/yolo-mode-hidden-risks-in-claude-code-permissions/)

## Changelog

- 2026-08-26: Fact refresh — updated the risk comparison now that auto mode is the default permission mode on Pro/Max/Team, and added series cross-links.
