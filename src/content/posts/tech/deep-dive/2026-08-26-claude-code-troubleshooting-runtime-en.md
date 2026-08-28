---
title: "Claude Code Runtime Troubleshooting Guide: CPU/Memory, Session Hangs, Auto-Compact Thrashing, Tables, Search Failures"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, ripgrep]
lang: en
tldr: "Five classes of runtime fixes: diagnose high memory with /compact plus /heapdump; recover a hung session with Ctrl+C and claude --resume; write large tables to files instead of forcing terminal output; escape autocompact thrashing by reading files in chunks or running /compact with a focus; fix broken search by installing system ripgrep and setting USE_BUILTIN_RIPGREP=0."
description: "A step-by-step troubleshooting guide for Claude Code runtime issues: diagnosing high CPU and memory usage, recovering frozen sessions, handling large table output, escaping auto-compaction thrashing loops, and fixing search when the bundled ripgrep won't run."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 34
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime)

Installation works, login works — now the problems happen mid-session: fans spinning, a frozen screen, context compaction failing, search not finding a file that clearly exists. Following the official [troubleshooting](https://code.claude.com/docs/en/troubleshooting) docs' classification, this article turns the five runtime problem classes into steps you can follow, with symptoms, diagnostic commands, and fixes. For install or login failures, start with [the previous article](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install); settings-not-applying and hooks-not-firing belong in the [configuration debugging article](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config).

## High CPU or memory usage

Symptoms: Claude Code consumes significant resources when processing large codebases, responses get slow. The official sequence:

1. **Run `/compact` regularly** to shrink the context. If it returns `Not enough messages to compact.`, the conversation has too few turns to summarize — that can happen even with a full context when a single large paste filled it.
2. **Close and restart between major tasks**. Every new session starts with a clean context window; don't drag residue from the last task along.
3. **Add large build directories to `.gitignore`** to shrink what gets scanned.
4. **Restart with `claude --safe-mode`** as an A/B test: it disables all customizations (plugins, MCP servers, hooks) for the session. If usage drops, one of them is the culprit — then narrow down which.

If memory stays high after all that, use the hidden `/heapdump` command (it doesn't appear in the command menu; type it in full). It writes two files to `~/Desktop`: a `<session-id>.heapsnapshot` JS heap snapshot and a `<session-id>-diagnostics.json` memory breakdown. On Linux without a Desktop folder, the files are written to your home directory. The command also prints a summary in the conversation: resident set size, JS heap, array buffers, unaccounted native memory, plus any leak indicators it detected. Two ways forward:

- **Report it**: open a [GitHub issue](https://github.com/anthropics/claude-code/issues) and attach only `-diagnostics.json`, which carries no conversation content or credentials.
- **Investigate yourself**: if the summary says most memory is in the JS heap, load the `.heapsnapshot` in Chrome DevTools under Memory → Load and sort by retained size to see what's holding it. If the summary says most memory is native, the snapshot will not show it; include the summary's leak indicators in your report instead.

One warning: the `.heapsnapshot` contains **every string in the process**, including your full conversation and credentials. Never attach it to a public issue or share it around.

## Session hangs

Symptoms: Claude Code seems unresponsive, spinner going nowhere. Recovery:

1. Press `Ctrl+C` to attempt to cancel the current operation.
2. Still unresponsive? Close the terminal and restart.

Restarting does **not** lose your conversation — in the same directory, run:

```bash
claude --resume
```

and pick the session from the list. The real cost of a hang is just the operation that was in flight, not your whole work session.

A related symptom: garbled or box-drawing text in an editor's integrated terminal (VS Code, Cursor, and others). The terminal's GPU renderer is usually the cause — run `/terminal-setup` inside Claude Code to set `terminal.integrated.gpuAcceleration` to `"off"`.

## Large tables stall or get cut off

Symptoms: Claude Code displays only the first 200 rows of a very large Markdown table, followed by `... N more rows not shown`; or an older session with a huge table stalls while rendering after resume. This is a terminal display issue, not data loss: the full table remains in the conversation, and `/copy` copies every row.

In practice, do not force hundreds of rows through the terminal. Ask Claude to write the table to a file, or rerun the task with tighter filters so the terminal only shows the rows you need to inspect. The official docs note that before v2.1.208, resuming a session that contained a very large table could stall while re-rendering it; for that kind of old session, use `claude --resume` to pick another session or start fresh, then write large outputs to files.

## Auto-compaction thrashing

Symptoms: you see `Autocompact is thrashing: the context refilled to the limit...`. Here's the mechanism: automatic compaction succeeded, but some oversized file content or tool output immediately refilled the context window several times in a row. Claude Code detects this loop and stops retrying, to avoid burning API calls on something making no progress.

The official escape order, least destructive first:

1. **Ask Claude to read the oversized file in chunks** — a specific line range or function name, instead of "read the whole file".
2. **Run `/compact` with a focus** that drops the large output, for example `/compact keep only the plan and the diff`.
3. **Move the large-file work to a subagent** so it runs in a separate context window; the main conversation only receives the conclusion.
4. If the earlier conversation is no longer needed, just `/clear`.

Prevention is simpler than recovery: when you know a task involves big files, read them by line range from the start instead of waiting for thrashing.

## Search can't find things that exist

Symptoms: the Search tool, `@file` mentions, custom agents, or custom skills miss files you know are there. The bundled `ripgrep` binary may not run on your system. Fix: install your platform's ripgrep package and tell Claude Code to use it instead.

```bash
brew install ripgrep        # macOS
sudo apt install ripgrep    # Ubuntu/Debian
```

Then set `USE_BUILTIN_RIPGREP=0` — either in your shell environment or in settings.json:

```json
{
  "env": {
    "USE_BUILTIN_RIPGREP": "0"
  }
}
```

Verify the switch took effect: run `claude doctor` in your terminal and check that the Search line shows your system ripgrep's path instead of `OK (bundled)`.

WSL users face a different variant: projects on the Windows filesystem (`/mnt/c/`) pay cross-filesystem disk-read penalties, so search still functions but returns fewer results than on a native filesystem — and `claude doctor` shows Search as OK in this case. Fixes in priority order: move the project to the Linux filesystem (`/home/`), make searches more specific (name directories or file types), or switch to native Windows.

## Other symptoms: route them right

The official troubleshooting page is itself a routing page. When your symptom isn't one of the five above, follow its table:

| Symptom | Go to |
|---------|-------|
| `command not found`, PATH issues, TLS errors | Official [troubleshoot-install page](https://code.claude.com/docs/en/troubleshoot-install) plus [the previous article](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install) |
| Update or install download drops, login loops, OAuth, 403, cloud provider credentials | Official [troubleshoot-install page](https://code.claude.com/docs/en/troubleshoot-install) |
| `API Error: 5xx`, `529 Overloaded`, `429` | Official [Error reference](https://code.claude.com/docs/en/errors) |
| `model not found`, request validation, `Claude Code process exited with code N` | Official [Error reference](https://code.claude.com/docs/en/errors) |
| Settings not applying, hooks not firing, MCP servers not loading | Debug your configuration page plus this series' [H8 configuration debugging article](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config) |
| Session starts in auto mode, or Claude edits files and runs commands without asking | Official Permission modes page |
| VS Code / JetBrains integration problems | Each integration's documentation page |

Not sure which applies? Run `/doctor` inside a Claude Code session first — it checks your installation, settings, extensions, and context usage automatically, and proposes fixes it can apply after you confirm. If `claude` cannot start at all, run `claude doctor` from your shell for read-only diagnostics. Add `/mcp` to check MCP server status. If nothing resolves it, report from inside a session with `/feedback`.

Other articles in the series: [How Claude Code works](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) and [Explore the .claude directory](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory).

## References

- [Troubleshooting — Claude Code Docs](https://code.claude.com/docs/en/troubleshooting) — primary source: the performance-and-stability sections, thrashing recovery steps, ripgrep fix, and the full symptom routing table
- [Troubleshoot installation and login — Claude Code Docs](https://code.claude.com/docs/en/troubleshoot-install) — the official counterpart for install-layer problems, the other end of the routing table
- [Advanced setup — Claude Code Docs](https://code.claude.com/docs/en/setup) — ripgrep dependency details and extra requirements on Alpine and musl systems
- [Terminal configuration — Claude Code Docs](https://code.claude.com/docs/en/terminal-config) — settings written by `/terminal-setup` for integrated terminals

## Update log

- 2026-08-29: Aligned with the current official troubleshooting runtime categories, adding large tables, the Linux `/heapdump` output location, and the split between `/doctor` and `claude doctor`.
- 2026-08-26: Initial version, based on the August 2026 official troubleshooting docs.
