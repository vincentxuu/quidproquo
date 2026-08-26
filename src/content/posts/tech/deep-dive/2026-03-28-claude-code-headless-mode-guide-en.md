---
title: "Headless and the Agent SDK: From claude -p to Programmatic Agents"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, headless, agent-sdk, cli, automation, scripting]
lang: en
tldr: "claude -p turns Claude Code from an interactive terminal session into a command you can embed in scripts and CI: pipe data in, get structured JSON out with --output-format json, skip all auto-loading with --bare. This post focuses on CLI usage, then covers the four signals that mean it's time to switch to the Python or TypeScript Agent SDK."
description: "A deep dive into Claude Code headless mode: claude -p basics, the three output formats (text/json/stream-json), --bare and common flag combinations, CI usage, and when to graduate from CLI to the Agent SDK."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 18
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide)

The [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) established that Claude Code is, at its core, an agentic loop. Normally you sit in a terminal and push that loop forward by hand — but plenty of situations don't need you in the seat: batch-fixing lint errors, reviewing every PR in CI, feeding a build log to get a plain-language explanation. Those scenarios use the same tools and the same loop with the interactive layer removed: add a `-p` flag, and Claude Code goes from conversation partner to a component in a Unix pipeline.

Official docs now frame this path as the **entry point to the Agent SDK**: `claude -p` is where you start, and when your needs outgrow it you move up to the Python or TypeScript SDK. The bulk of this post is about the CLI — most automation needs end right there — before covering when it's time to leave.

## How headless differs from interactive mode

The difference is the interface, not the capability. `claude -p "prompt"` runs and exits: no TUI, no waiting for input; exit code 0 on success, non-zero on failure, so shell scripts can branch on `$?`. It can do everything interactive mode can — read files, run commands, connect MCP servers — because underneath it's the same loop.

Two behavioral differences matter:

- **Permission defaults to Manual.** A `-p` session never shows permission prompts, and the built-in starting permission mode is Manual on every plan, so unapproved actions are simply blocked. To let it act freely you must authorize explicitly via `--allowedTools` or `--permission-mode`.
- **It won't load things you didn't ask for** — if you tell it not to. That's `--bare`, next section.

## Basic usage and output formats

The simplest invocation:

```bash
claude -p "What does the auth module do?"
```

Non-interactive mode also reads stdin, so it composes like any other command-line tool:

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

Piped stdin is capped at 10MB; for larger input, write it to a file and reference the path.

`--output-format` offers three choices:

| Format | Contents | Good for |
|--------|----------|----------|
| `text` (default) | Plain text | Humans, or downstream consumers that just need prose |
| `json` | One JSON object: `result`, `session_id`, usage/cost metadata | Scripts parsing results or tracking spend |
| `stream-json` | One JSON event per line | Real-time token processing or step monitoring |

The `json` response includes `total_cost_usd` plus a per-model cost breakdown — note these are client-side estimates that may differ from your actual bill, but they let scripts track spend per invocation. To force structured output, add `--json-schema`:

```bash
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

The result lands in the `structured_output` field, and an invalid schema exits with an error rather than silently returning unstructured text. Pair with jq to pull fields:

```bash
claude -p "Summarize this project" --output-format json | jq -r '.result'
```

For real-time streaming use `stream-json` with both `--verbose` and `--include-partial-messages`:

```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```

Each line is an event; the last line is a `result` message carrying the final response and cost. Filtering for text deltas with jq gives you a continuous token stream:

```bash
claude -p "Write a poem" --output-format stream-json --verbose --include-partial-messages | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

## Common flag combinations

**`--bare`: the recommended mode for scripts and CI.** A regular `-p` run loads hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory, and CLAUDE.md exactly like an interactive session would. On your own machine that's a feature; on a CI runner it's an uncontrolled variable. `--bare` skips all of it, starts faster, and behaves identically on every machine:

```bash
claude --bare -p "Summarize README.md" --allowedTools "Read"
```

The tradeoff is supplying context yourself: system prompt additions via `--append-system-prompt`, settings via `--settings`, MCP servers via `--mcp-config`, subagents via `--agents <json>`. Bare mode also skips OAuth login entirely — set `ANTHROPIC_API_KEY`. The docs are explicit: `--bare` is the recommended mode for scripted and SDK calls and will become the default for `-p` in a future release.

**`--allowedTools`: precise authorization.** Let specific tools run without prompting, using rule syntax with prefix matching — `Bash(git diff *)` allows any command starting with `git diff` (the space before the asterisk is part of the syntax):

```bash
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

Instead of listing tools one by one, set a baseline with `--permission-mode`: `acceptEdits` auto-approves file edits, `dontAsk` permits only allow-list rules and the read-only command set (good for locked-down CI), and `auto` hands most actions to a background classifier for review.

**`--max-turns`: a circuit breaker.** Caps the number of agentic turns and errors out when the limit is hit; no limit by default. When running untrusted tasks in batches, this is the fuse that keeps an agent from looping forever on your budget:

```bash
claude -p --max-turns 10 "Fix all ESLint errors in src/"
```

**`--continue` and `--resume`: conversations across invocations.** Headless isn't limited to one-shot calls:

```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

`--continue` picks up the most recent conversation, `--resume` takes a session ID, and since v2.1.223 both commands can run from different directories. This already brushes against "multi-turn state management" — more on that below.

## Into scripts and CI

Put together, headless's natural home is build scripts and CI pipelines. The docs' example pipes a diff against main into Claude as a typo linter:

```json
{
  "scripts": {
    "lint:claude": "git diff main | claude -p \"you are a typo linter. for each typo in this diff, report filename:line on one line and the issue on the next. return nothing else.\""
  }
}
```

Piping the diff instead of letting Claude run git itself removes even the Bash permission requirement. Full GitHub Actions integration — including `claude setup-token` for long-lived tokens and annotations written back to the PR — is covered in [the GitHub Actions post](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions); scheduled runs (cron + `claude -p`) are covered in [the scheduled-tasks guide](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide).

A few CI-specific details: a run killed by SIGTERM exits with code 143 and records no result for the turn in progress — watch for this if your process supervisor judges success by exit code. Background Bash tasks started during the run (dev servers, watch builds) are terminated about five seconds after the result returns. And the `mcp_server_errors` / `plugin_errors` fields in the `system/init` event let CI fail loudly when a server never actually loaded.

## When to leave the CLI for the Agent SDK

The CLI does more than most people assume — don't rush the upgrade. But the official docs draw a clear line: the SDK ships only as Python and TypeScript packages, and for other languages the recommended way to drive the same agent loop is running the CLI as a subprocess. Conversely, if your host environment happens to be Python or TypeScript, four signals say it's time:

1. **Multi-turn session management.** `--resume` plus shell variables survives two or three turns; maintaining hundreds of long-lived sessions in an application, with forking and resumption on demand, is what the SDK's Sessions API was designed for.
2. **Real-time streaming.** The CLI's `stream-json` means "you parse NDJSON yourself"; the SDK provides native callbacks and message objects, so token events flow straight into your program.
3. **Type-safe structured output.** `--json-schema` returns JSON you parse and validate yourself; the SDK returns native objects with full types under TypeScript.
4. **In-process custom tools and hooks.** Attaching your own callback to tool approval, or registering your own functions as tools the loop calls directly, are first-class in the SDK; from the CLI you can only approximate them from outside with `--mcp-config` and `--agents <json>`.

One-sentence heuristic: **if a script consumes the result, stay on the CLI; if your code hosts the agent, move to the SDK.**

## Going deeper

The Agent SDK could fill its own series, so this post stops here. To dig further, go straight to the official chapters:

- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) — capability summary and how the Agent SDK compares to the CLI, Client SDK, and Managed Agents
- [Python SDK](https://code.claude.com/docs/en/agent-sdk/python) and [TypeScript SDK](https://code.claude.com/docs/en/agent-sdk/typescript) — full API references
- [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart) — your first bug-finding-and-fixing SDK agent

## References

- [Run Claude Code programmatically (Headless) — Claude Code Docs](https://code.claude.com/docs/en/headless) — Official home of `claude -p`: basic usage, bare mode, structured output, streaming, continue conversations, SIGTERM behavior
- [CLI reference — Claude Code Docs](https://code.claude.com/docs/en/cli-reference) — Complete list of `-p`-related flags: `--output-format`, `--json-schema`, `--max-turns`, `--include-partial-messages`, `--input-format`, and more
- [Agent SDK overview — Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview) — SDK positioning, comparison with CLI / Client SDK / Managed Agents, and the official recommendation to drive the CLI via subprocess from other languages

## Update Log

- 2026-08-26: Initial version, based on August 2026 official documentation (headless, cli-reference, agent-sdk overview).
