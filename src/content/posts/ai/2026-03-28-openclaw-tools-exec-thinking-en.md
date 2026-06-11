---
title: "OpenClaw Tools (Part 3): Exec Tool, Thinking Levels, and Slash Commands"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, exec, thinking, slash-commands, fast-mode, verbose, reasoning]
lang: en
tldr: "Exec supports foreground/background/PTY execution with three security levels (deny/allowlist/full). Thinking has 7 levels (off to adaptive). Slash Commands come in two types: commands and directives."
description: "OpenClaw's Exec tool (security model, approvals, safe bins), Thinking level controls, Fast Mode, and the Slash Commands system."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-exec-thinking)

This post covers OpenClaw's lowest-level execution tool (Exec), reasoning control (Thinking), and user interaction interface (Slash Commands).

## Exec Tool

Executes shell commands within the workspace. Supports both foreground and background execution.

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `command` | (required) | The command to execute |
| `workdir` | cwd | Working directory |
| `yieldMs` | 10000 | Automatically moves to background after this duration |
| `background` | false | Execute in background immediately |
| `timeout` | 1800s | Kill on timeout |
| `pty` | false | Pseudo-terminal mode (PTY) |
| `host` | sandbox | `sandbox` / `gateway` / `node` |
| `security` | deny (sandbox) | `deny` / `allowlist` / `full` |
| `ask` | on-miss | `off` / `on-miss` / `always` |
| `elevated` | false | Execute on the gateway host |

### Three Execution Hosts

| Host | Description |
|---|---|
| `sandbox` | Inside the sandbox container (default) |
| `gateway` | On the Gateway host |
| `node` | On the paired node device |

**Important:** The sandbox is disabled by default. If the sandbox is off but `host=sandbox`, exec will **fail closed** rather than silently running on the host machine.

### Security Model

**Allowlist + Safe Bins:**
- The allowlist matches against **resolved binary paths** only (not basenames)
- Chaining (`;`, `&&`, `||`) in allowlist mode is only allowed when all segments are on the allowlist
- Redirections are not supported

**Safe Bins:** Small, stdin-only stream filters.

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

**Do not** add interpreters (python3, node, bash) to `safeBins`. Use explicit allowlist entries + approval prompts instead.

**Strict Inline Eval:** Setting `strictInlineEval: true` forces `python -c`, `node -e`, and similar inline eval commands to always require approval.

### Exec Approvals

Sandbox agents can request per-invocation approval when executing on gateway/node:

1. The Exec tool returns `status: "approval-pending"` + an approval id
2. The user approves or denies
3. The Gateway emits a system event (`Exec finished` / `Exec denied`)

```bash
/approve <id> allow-once    # Allow once
/approve <id> allow-always  # Allow always
/approve <id> deny          # Deny
```

### PATH Handling

| Host | PATH Behavior |
|---|---|
| gateway | Merges login shell PATH; rejects `env.PATH` overrides |
| sandbox | Runs `sh -lc` then prepends `env.PATH`; `pathPrepend` also applies |
| node | Rejects `env.PATH` overrides; uses the node host's environment |

Host execution rejects `LD_*`/`DYLD_*` loader overrides to prevent binary hijacking.

### Session Overrides (/exec)

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

Only effective for authorized senders. Updates session state without writing to config.

### apply_patch

A sub-tool of Exec for structured multi-file edits. Enabled by default for OpenAI/Codex models.

```json5
{
  tools: {
    exec: {
      applyPatch: { workspaceOnly: true, allowModels: ["gpt-5.2"] }
    }
  }
}
```

## Thinking Levels

Controls the model's reasoning depth.

### 7 Levels

| Level | Alias | Description |
|---|---|---|
| `off` | — | No reasoning |
| `minimal` | think | Minimal reasoning |
| `low` | think hard | Low reasoning |
| `medium` | think harder | Medium reasoning |
| `high` | ultrathink | Maximum reasoning budget |
| `xhigh` | ultrathink+ | GPT-5.2 + Codex only |
| `adaptive` | — | Provider-managed adaptive reasoning (Anthropic Claude 4.6) |

### Configuration Methods

**Inline directive:** Affects only the current message
```
/think:high Please analyze this code
```

**Session default:** Send a message containing only the directive
```
/think:medium
```

### Resolution Order

1. Inline directive
2. Session override
3. Per-agent default (`agents.list[].thinkingDefault`)
4. Global default (`agents.defaults.thinkingDefault`)
5. Fallback: Anthropic Claude 4.6 → `adaptive`, other reasoning models → `low`, otherwise → `off`

### Provider-Specific Behavior

| Provider | Behavior |
|---|---|
| Anthropic Claude 4.6 | Defaults to `adaptive` |
| Z.AI | Only supports on/off |
| Moonshot | Only supports enabled/disabled |

## Fast Mode (/fast)

A low-latency mode for reduced response times.

| Provider | Fast Mode Behavior |
|---|---|
| OpenAI | `service_tier=priority` + low reasoning + low verbosity |
| OpenAI Codex | Same as above |
| Anthropic (API key) | `service_tier=auto` |

```
/fast on
/fast off
```

## Verbose and Reasoning

**Verbose (/verbose):** Displays tool call details.

| Level | Behavior |
|---|---|
| `off` (default) | Shows only failure summaries |
| `on` | One bubble per tool call |
| `full` | Tool calls + output after completion |

**Reasoning (/reasoning):** Displays the reasoning process.

| Level | Behavior |
|---|---|
| `off` (default) | Hidden |
| `on` | Displayed as a separate `Reasoning:` message |
| `stream` | Telegram only; streams reasoning to a draft bubble |

## Slash Commands System

### Two Types

**Commands:** Standalone `/...` messages.
**Directives:** `/think`, `/fast`, `/verbose`, `/reasoning`, `/elevated`, `/exec`, `/model`, `/queue`.

Directives in regular messages act as inline hints (not persisted). In directive-only messages, they persist to the session.

### Configuration

```json5
{
  commands: {
    native: "auto",        // Register native commands (Discord/Telegram)
    nativeSkills: "auto",  // Register skill commands
    text: true,            // Parse /... text
    bash: false,           // Enable ! <cmd>
    config: false,         // Enable /config
    mcp: false,            // Enable /mcp
    plugins: false,        // Enable /plugins
  }
}
```

### Common Commands

| Command | Function |
|---|---|
| `/help` | Help |
| `/status` | Current status + provider usage |
| `/tools` | Currently available tools |
| `/context` | Context usage info |
| `/btw <question>` | Side question (does not affect session context) |
| `/export-session` | Export session as HTML |
| `/subagents list` | List sub-agents |
| `/focus <target>` | Discord thread binding |

## Summary

Exec is OpenClaw's most powerful and most dangerous tool — three layers of security control (host, security, ask) ensure it stays under control. Thinking lets you adjust reasoning depth based on task complexity. Slash Commands are the primary interface for users to interact with the Gateway.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/tools/exec.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/exec.md) — Exec Tool
- [docs/tools/exec-approvals.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/exec-approvals.md) — Exec Approvals
- [docs/tools/thinking.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/thinking.md) — Thinking Levels
- [docs/tools/slash-commands.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/slash-commands.md) — Slash Commands
- [docs/tools/elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/elevated.md) — Elevated Mode
- [docs/tools/btw.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/btw.md) — BTW Side Questions
