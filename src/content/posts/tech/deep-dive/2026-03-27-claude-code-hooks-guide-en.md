---
title: "Claude Code Hooks: A Complete Guide to Event-Driven AI Control"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, hooks, ai-agent, automation, dx, event-driven]
lang: en
tldr: "Hooks are Claude Code's event system. They trigger shell commands, HTTP requests, MCP tools, or LLM evaluations automatically before/after tool execution, when a prompt is submitted, or when a task ends. Use them to block dangerous operations, run automated reviews, inject context, or write audit logs."
description: "A deep dive into Claude Code Hook event lifecycles, the five handler types, matcher and if syntax, exit code semantics, async/HTTP/prompt/MCP tool hooks, real-world use cases, and design trade-offs."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 12
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
| `PermissionRequest` | Permission dialog about to appear | JSON can auto-approve or deny (exit 2 has no effect) |
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

The table above covers the core events at the time this post was written. As of August 2026, the official reference has grown to around thirty events: newer additions include `Setup` (one-time preparation for CI/scripts), `UserPromptExpansion` (when a slash command expands), `PermissionDenied` (after auto mode denies a tool call), `PostToolBatch` (after a batch of parallel tool calls), `TeammateIdle`, `InstructionsLoaded`, `WorktreeCreate`/`WorktreeRemove`, `Elicitation`/`ElicitationResult` (MCP elicitation), `DirectoryAdded`, and `MessageDisplay`. The [official hooks reference](https://code.claude.com/docs/en/hooks) is the authoritative list.

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
| Skill/Agent frontmatter | Skills: the rest of the session after invocation; Subagents: while running | Yes |

For where these files sit in the `.claude` directory hierarchy, see [A Complete Tour of the .claude Directory](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en).

### Matcher Syntax

The `matcher` determines when a hook fires, evaluated against a field carried by the event (the tool name for tool events). Evaluation rules: if it contains only letters, digits, `_`, `-`, whitespace, `,`, and `|`, it's matched as an exact string (or a list separated by `|` or `,`; comma support arrived in v2.1.191); any other character switches it to an unanchored JavaScript regex.

```jsonc
"matcher": "Bash"            // Only triggers on the Bash tool (exact match)
"matcher": "Edit|Write"      // Triggers on Edit or Write
"matcher": "^Edit$"          // Regex form; unanchored "Edit.*" would also hit NotebookEdit
"matcher": "mcp__github__.*" // All tools from the GitHub MCP server; the .* is required,
                             // otherwise the whole string is compared exactly and matches nothing
"matcher": ""                // Triggers in all cases
```

Note: the matcher only matches tool names — you **cannot** write `"Bash(git commit*)"` here. That's permission-rule syntax, which belongs in the handler-level `if` field (see "What hooks look like as of August 2026" below).

What the matcher targets differs by event:

| Event | Matches Against | Examples |
|-------|----------------|---------|
| `PreToolUse` / `PostToolUse` | Tool name | `Bash`, `Edit`, `mcp__memory__.*` |
| `SessionStart` | Start source | `startup`, `resume`, `clear`, `compact`, `fork` |
| `StopFailure` | Error type | `rate_limit`, `server_error` |
| `FileChanged` | File name | `.envrc`, `package.json` |
| `Notification` | Notification type | `permission_prompt`, `idle_prompt` |

## Handler Types

There are now five handler types: `command`, `http`, `prompt`, `agent`, plus the newer `mcp_tool` (covered in "What hooks look like as of August 2026" below). This section covers the original four.

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
| 0 | Success, no decision | Stdout starting with `{` is parsed as JSON; anything else is treated as plain text. **This does not approve the call** — the tool goes through the normal permission flow |
| 2 | Block | Blocks the action; a JSON `allow` cannot override it. The message prefers the JSON reason, otherwise stderr is fed back to Claude (some events only show it to the user) |
| Other | Non-blocking error | Doesn't block. If stdout is schema-valid JSON, the exit code is ignored and the JSON decides; otherwise it's a non-blocking error with stderr visible only in debug/verbose mode |

For per-event details, see the exit code section in "What hooks look like as of August 2026" below.

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
          "command": "cd ${CLAUDE_PROJECT_DIR} && pnpm run lint && pnpm run typecheck"
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

`stop_hook_active` is the key — on the second trigger it will be `true`, preventing Claude from getting stuck in an infinite loop. Claude Code also has its own safety net: after 8 consecutive blocks it overrides the hook and ends the turn, so a hook can't lock up the session.

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

This hook is registered when the `secure-operations` skill is invoked and stays active for the rest of the session (not just the skill's own turn). To run it only once, set `once: true` on the handler. Hooks in a subagent's frontmatter are only active while that subagent runs.

## Division of Responsibility with Skills

This topic is covered in depth in [The Three-Piece Toolkit: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md-en), and skill design itself is covered in [the Skills deep dive](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide-en). Here's a quick summary:

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

## What Hooks Look Like as of August 2026

Hooks have grown another layer since this post was published. Below is the increment, filled in from the [official hooks reference](https://code.claude.com/docs/en/hooks); anything the docs don't cover is not extrapolated here.

### Five handler types now

`type` now has five values: `command`, `http`, `mcp_tool`, `prompt`, and `agent`. All handlers share these fields:

| Field | Description |
|-------|-------------|
| `if` | A permission-rule filter (e.g. `"Bash(git *)"` or `"Edit(*.ts)"`), only evaluated on tool events. Accepts exactly one rule — no `&&`, `||`, or list syntax |
| `timeout` | Seconds. Defaults: 600 for command/http/mcp_tool, 30 for prompt, 60 for agent |
| `statusMessage` | Custom spinner message while the hook runs |
| `once` | If `true`, runs once per session (only honored in skill frontmatter) |

Command hooks additionally support `args` (when set, the command spawns directly as an executable with no shell involved — exec form) and `shell` (`"bash"` or `"powershell"`). All matching hooks for an event run in parallel; when several return decisions, the most restrictive wins (deny > defer > ask > allow), and `additionalContext` from every hook is kept.

### Full exit code semantics

| Exit Code | Behavior |
|-----------|----------|
| 0 | Success. Stdout not starting with `{` is treated as plain text — for `UserPromptSubmit`, `UserPromptExpansion`, and `SessionStart` that text goes into Claude's context; for every other event it goes only to the debug log |
| 2 | Blocking error. The only exit code that blocks on its own, and no JSON output can override it. What "block" means varies by event: `PreToolUse` blocks the tool call, `Stop` forces continuation, `ConfigChange` stops the config change from taking effect — but `PermissionRequest` ignores exit 2 entirely (use the JSON `decision.behavior`), `PostToolUse` only shows stderr to Claude (the tool already ran), and observation-only events (`SessionEnd`, `Notification`, etc.) ignore it completely |
| Other | Non-blocking error. Exception: if stdout is schema-valid JSON, the exit code is ignored and the JSON decides. So **if a hook needs to block something, exit 2 is the only option** — the conventional exit 1 is just a non-blocking error on most events, and the action proceeds |

One more trap worth knowing: a hook that hits its timeout is canceled and renders no decision — on `PreToolUse`, a stalled hook does not act as a gate, and the tool call proceeds through the normal permission flow.

### Async hooks: run in the background without blocking the loop

Add `"async": true` to a command hook and Claude Code starts the process, then immediately continues working:

- When the background process exits, its `additionalContext` and `systemMessage` are delivered to Claude on the **next conversation turn**; if the session is idle, delivery waits until the next interaction
- Since the action has already happened, async hooks cannot block anything: `decision`, `permissionDecision`, and `continue` all have no effect
- To run in the background but still wake Claude on failure, use `"asyncRewake": true`: an exit code 2 is delivered immediately as a system reminder, even while the session is idle
- Each firing spawns a separate background process — repeated firings of the same async hook are not deduplicated

### HTTP hooks: how responses count

An HTTP hook sends the event's JSON as a POST body. The response is scored differently from a command hook's exit codes:

- **2xx + JSON object body**: parsed with the same JSON output schema as command hooks — to block, return a 2xx with the appropriate decision fields
- **2xx + empty body**: equivalent to exit 0 with no output
- **Non-2xx status or connection failure**: non-blocking error; execution continues
- **Timeout**: canceled, no decision

The key point: an HTTP hook **cannot signal a block through status codes alone**, and plain-text response bodies never reach Claude's context.

### Prompt hooks: let an LLM answer ok/false

A prompt hook is single-turn LLM evaluation (a fast model by default). The model must respond with this JSON:

```json
{
  "ok": true,
  "reason": "explanation",
  "impossible": false
}
```

What `ok: false` does depends on the event: on `Stop`/`SubagentStop` the reason is fed back to Claude as its next instruction (unless the model also sets `impossible: true`, in which case the stop is allowed); on `PreToolUse` the turn ends by default, and `continueOnBlock: true` instead returns the reason as a tool error so Claude can adjust and continue. For finer control (allow/deny/ask, rewriting input), use a command hook's JSON output.

### MCP tool hooks: outsource the check to a connected MCP server

```json
{
  "type": "mcp_tool",
  "server": "my_server",
  "tool": "security_scan",
  "input": { "file_path": "${tool_input.file_path}" }
}
```

Calls a tool on an already-connected MCP server; the tool's text output is parsed under the same rules as command-hook stdout. The `input` strings support `${path}` substitution from the event's JSON. The server must already be connected — the hook never triggers an OAuth or connection flow; a missing connection or an `isError: true` tool result becomes a non-blocking error. `SessionStart` and `Setup` typically fire before MCP servers finish connecting, so hooks on those events should expect a "not connected" error on first run.

Also note that not every event accepts all five handler types: the thirteen tool and turn events (`PreToolUse`, `Stop`, `UserPromptSubmit`, etc.) accept all five; observation-style events (`Notification`, `FileChanged`, etc.) don't support prompt/agent; and `SessionStart` and `Setup` accept only command and mcp_tool.

## Summary

Hooks are Claude Code's lowest-level control mechanism. They're not smart (they don't understand your code), but they're reliable (the mechanism guarantees execution) — at their core they attach your actions at specific points of the [agentic loop](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en), which the series entry post breaks down in full.

Most people only need two or three hooks: run checks before commits, block dangerous commands, and send a notification when done. Start there, and add more as specific needs arise. Don't over-engineer — if a simple exit code solves the problem, there's no need to reach for a prompt or agent type.

The most powerful pattern is combining Hooks with Skills. Hooks catch problems, Skills fix problems, and instruction files wire the workflow together. With each layer doing its job, the AI gains a complete quality assurance system.

---

## References

- [Claude Code Hooks reference](https://code.claude.com/docs/en/hooks) — the authoritative source for event lists, config schema, exit code semantics, and async/HTTP/prompt/MCP tool hooks
- [Automate actions with hooks (official guide)](https://code.claude.com/docs/en/hooks-guide) — quickstart and common use-case examples
- [Claude Code Skills Official Documentation](https://code.claude.com/docs/en/skills)
- [Claude Code Permissions Official Documentation](https://code.claude.com/docs/en/permissions)
- [How Claude Code Works: The Agentic Loop, Built-in Tools, and Two Safety Rails (series entry)](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en)
- [A Complete Tour of the .claude Directory](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en)
- [The Three-Piece Toolkit in Claude Code: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md-en)
- [Claude Code Skill Design: A Complete Guide](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide-en)

## Update Log

- 2026-08-26: Added schema / exit code / async / HTTP / prompt / MCP tool hook coverage from the hooks reference.
