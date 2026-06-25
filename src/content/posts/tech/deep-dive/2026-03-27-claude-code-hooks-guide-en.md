---
title: "Claude Code Hooks: A Complete Guide to Event-Driven AI Control"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, hooks, ai-agent, automation, dx, event-driven]
lang: en
tldr: "Hooks are Claude Code's event system. They trigger shell commands, HTTP requests, or LLM evaluations automatically before/after tool execution, when a prompt is submitted, or when a task ends. Use them to block dangerous operations, run automated reviews, inject context, or write audit logs."
description: "A deep dive into Claude Code Hook event lifecycles, the four handler types, matcher syntax, advanced patterns (permission control, dynamic env vars, Stop interception), real-world use cases, and design trade-offs."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 5
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide)

Claude Code's Hook system is an event-driven architecture. At every critical point in the AI's operation lifecycle, events are emitted — and you can attach automated actions to those points: block dangerous commands, inject additional context, log operations, or even auto-approve safe actions.

The concept is similar to git hooks or CI webhooks, but the target is an AI agent.

## Event Lifecycle

Here's what the event flow looks like in a Claude Code session:

```
SessionStart
    ↓
UserPromptSubmit (user sends a message)
    ↓
┌─ Agentic Loop ──────────────────┐
│  PreToolUse → execute tool → PostToolUse │
│  PreToolUse → execute tool → PostToolUse │
│  ... (repeats until task is complete)    │
└──────────────────────────────────┘
    ↓
Stop (Claude finishes responding)
    ↓
SessionEnd
```

Any event can have a hook attached. The most commonly used are `PreToolUse` (before a tool runs) and `Stop` (when a task ends).

### Full Event Reference

| Event | Trigger | Can Block? |
|-------|---------|-----------|
| `SessionStart` | Session starts or resumes | No |
| `UserPromptSubmit` | User submits a prompt | Yes |
| `PreToolUse` | Before a tool executes | Yes |
| `PostToolUse` | After a tool succeeds | Yes |
| `PostToolUseFailure` | After a tool fails | No (already failed) |
| `PermissionRequest` | Permission dialog about to appear | Yes (auto-approve or deny) |
| `Stop` | Claude finishes responding | Yes (force continuation) |
| `StopFailure` | API error causes stop | No (observation only) |
| `SubagentStart` / `SubagentStop` | Subagent starts/stops | Yes |
| `TaskCreated` / `TaskCompleted` | Task created/completed | Yes |
| `Notification` | Notification event | No |
| `FileChanged` | File changed | No |
| `CwdChanged` | Working directory changed | No |
| `ConfigChange` | Config file changed | Yes |
| `PreCompact` / `PostCompact` | Before/after context compaction | No |
| `SessionEnd` | Session ends | No (observation only) |

## Configuration

Hooks are defined in `settings.json` using a three-level nested structure: event → matcher → handler.

```jsonc
// ~/.claude/settings.json (global)
// or .claude/settings.json (project)
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

### Config File Locations and Priority

| Location | Scope | Shareable |
|----------|-------|-----------|
| `~/.claude/settings.json` | Global (all projects) | No |
| `.claude/settings.json` | Single project | Yes (commit to repo) |
| `.claude/settings.local.json` | Single project (personal) | No (gitignored) |
| Managed policy settings | Organization level | Yes (admin-controlled) |
| Plugin `hooks/hooks.json` | When plugin is enabled | Yes |
| Skill/Agent frontmatter | Within component lifecycle | Yes |

### Matcher Syntax

`matcher` is a regex that determines when a hook fires.

```jsonc
"matcher": "Bash"              // Only triggers on the Bash tool
"matcher": "Edit|Write"        // Triggers on Edit or Write
"matcher": "Bash(git commit*)" // Bash where the command starts with git commit
"matcher": "mcp__github__.*"   // All tools from the GitHub MCP server
"matcher": ""                  // Triggers in all cases
```

What the matcher targets differs by event:

| Event | Matches Against | Examples |
|-------|----------------|---------|
| `PreToolUse` / `PostToolUse` | Tool name | `Bash`, `Edit`, `mcp__memory__.*` |
| `SessionStart` | Start source | `startup`, `resume`, `compact` |
| `StopFailure` | Error type | `rate_limit`, `server_error` |
| `FileChanged` | File name | `.envrc`, `package.json` |
| `Notification` | Notification type | `permission_prompt`, `idle_prompt` |

## The Four Handler Types

### 1. Command (Most Common)

Runs a shell command. Receives JSON input via stdin and outputs a JSON result via stdout.

```json
{
  "type": "command",
  "command": "./.claude/hooks/lint-check.sh",
  "timeout": 600
}
```

**Exit code determines behavior:**

| Exit Code | Meaning | Behavior |
|-----------|---------|---------|
| 0 | Success | Parse JSON from stdout |
| 2 | Block | Ignore stdout; send stderr as feedback to Claude |
| Other | Non-blocking error | stderr shown in verbose mode |

### 2. HTTP

Sends an HTTP POST to a specified endpoint. Good for integrating with external services.

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

Environment variables must be explicitly listed in `allowedEnvVars` before they are substituted — a security requirement.

### 3. Prompt

Uses an LLM for evaluation. Best for scenarios requiring semantic understanding (e.g., determining whether a command is safe).

```json
{
  "type": "prompt",
  "prompt": "Is this operation safe? $ARGUMENTS",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

### 4. Agent

Uses a full agent with more tools and context. The most expensive option; suitable for complex judgments.

```json
{
  "type": "agent",
  "prompt": "Validate this condition: $ARGUMENTS",
  "timeout": 60
}
```

## Real-World Use Cases

### Case 1: Run Lint + Typecheck Before Commit

The most fundamental use case: automatically check code quality before Claude runs `git commit`.

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

If lint or typecheck fails → non-zero exit code → commit is blocked. Claude sees the error output, but a command hook **cannot make Claude auto-fix the issues** (that's a Skill's job).

### Case 2: Block Dangerous Commands

Parse the command content with a script and intercept destructive operations like `rm -rf` or `DROP TABLE`.

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

### Case 3: Auto-Approve Safe Commands

Getting a confirmation prompt every time Claude runs `npm test` gets old fast. Use a hook to automatically allow known-safe commands.

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
  exit 0  # No opinion — let the normal flow handle it
fi
```

### Case 4: Stop Interception — Don't Stop Until Tests Pass

Claude says "done" but the tests are still failing? Use a Stop hook to force it to keep going.

```bash
#!/bin/bash
# .claude/hooks/must-pass-tests.sh
INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active')

# Prevent infinite loop: if we've already intercepted once, let it through
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

`stop_hook_active` is the key — on the second trigger it will be `true`, preventing Claude from getting stuck in an infinite loop.

### Case 5: Audit Log

Record all of Claude's operations for post-hoc auditing.

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

Pair with `"async": true` to run in the background without slowing down Claude's responses.

### Case 6: Inject Environment Variables at Session Start

```bash
#!/bin/bash
# SessionStart hook: load .envrc
if [ -n "$CLAUDE_ENV_FILE" ] && [ -f .envrc ]; then
  eval "$(direnv export bash)"
  direnv export bash >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

`CLAUDE_ENV_FILE` is a special variable provided by Claude Code. Environment variables written to this file remain active throughout the entire session.

### Case 7: Send a Notification When Claude Finishes

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

## Hook Input and Output

Every hook receives JSON via stdin (for command type) or as the POST body (for HTTP type). The format varies by event.

### PreToolUse Input

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

### PreToolUse Output (Optional)

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

Note `updatedInput` — you can **modify** the tool input that Claude is about to execute. For example, automatically appending a `--verbose` flag, or converting relative paths to absolute ones.

### UserPromptSubmit Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Current branch: main, last commit: abc1234"
  }
}
```

`additionalContext` gets injected into Claude's context. This lets you automatically supply information (like git status or the current branch) every time a user sends a prompt.

## Hooks Inside Skills and Agents

Hooks aren't limited to `settings.json`. They can also be defined in a Skill or Agent's frontmatter, and their scope is limited to that component's lifecycle.

```yaml
---
name: secure-operations
description: Perform operations that require security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

This hook is only active while the `secure-operations` skill is loaded.

## Division of Responsibility with Skills

This topic is covered in depth in [The Three-Layer Quality Defense](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md), but here's a quick summary:

| Property | Hook | Skill |
|----------|------|-------|
| How it's triggered | Automatic (event-driven) | Manual (`/name`) or from an instruction file |
| Capabilities | Shell command / HTTP / LLM | Claude's full capabilities |
| Can fix code? | No | Yes |
| Can interact? | No (except prompt type) | Yes |
| Best for | Blocking, logging, injecting | Fixing, generating, interacting |

**Hooks are passive safety nets; Skills are active workflows.** Hooks are responsible for "preventing bad things from happening," while Skills are responsible for "getting things done right."

## Design Principles

**Keep hooks fast.** `SessionStart` and `PreToolUse` hooks run on every operation. If a hook is slow, Claude's responses will be too. Use `"async": true` for heavy operations so they run in the background.

**Don't expose sensitive information in stderr.** Exit code 2 sends stderr back to Claude as feedback. If your check script involves API keys or internal paths, make sure those don't end up in stderr.

**Use `stop_hook_active` to prevent infinite loops.** When a Stop hook blocks Claude, Claude continues working and triggers Stop again. Without checking `stop_hook_active`, this becomes an infinite loop.

**Command hook stdout must be pure JSON.** Welcome messages from shell profiles, `echo` debug output — all of it will break JSON parsing. Make sure stdout contains only your JSON output.

**Managed policy hooks cannot be overridden.** Hooks set by organization administrators via policy settings cannot be disabled at the user or project level. This is the guarantee for enterprise security.

## Summary

Hooks are Claude Code's lowest-level control mechanism. They're not smart (they don't understand your code), but they're reliable (the mechanism guarantees execution).

Most people only need two or three hooks: run checks before commits, block dangerous commands, and send a notification when done. Start there, and add more as specific needs arise. Don't over-engineer — if a simple exit code solves the problem, there's no need to reach for a prompt or agent type.

The most powerful pattern is combining Hooks with Skills. Hooks catch problems, Skills fix problems, and instruction files wire the workflow together. With each layer doing its job, the AI gains a complete quality assurance system.

---

## References

- [Claude Code Hooks Official Documentation](https://code.claude.com/docs/en/hooks)
- [Claude Code Skills Official Documentation](https://code.claude.com/docs/en/skills)
- [Claude Code Permissions Official Documentation](https://code.claude.com/docs/en/permissions)
- [The Three-Layer Quality Defense in Claude Code: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
- [Claude Code Skill Design: A Complete Guide](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
