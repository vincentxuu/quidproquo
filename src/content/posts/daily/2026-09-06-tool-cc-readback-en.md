---
title: "Tool Pick | cc-readback — Let Claude Desktop Read Your Claude Code Work History"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A local, read-only MCP server that lets Claude Desktop read, search, and summarize your Claude Code session history, with built-in redaction of common secrets and an audit trail"
tldr: "cc-readback is a local, read-only MCP server that lets Claude Desktop read, search, and summarize your Claude Code session history stored under ~/.claude, automatically redacting common credentials like AWS, GitHub, and OpenAI keys. Install: `npm install -g cc-readback && cc-readback install all`. It addresses the problem of wanting Claude Desktop to recap what yesterday's Claude Code sessions did and where they got stuck, without having to scroll back through terminal history yourself."
series:
  name: "AI Tool of the Day"
  order: 22
---

> 🌏 [中文版](/posts/daily/2026-09-06-tool-cc-readback)

## Tool Info

| Field | Value |
|---|---|
| Name | cc-readback |
| Type | Local MCP server |
| GitHub | [affirmitv/cc-readback](https://github.com/affirmitv/cc-readback) |
| Stars | 17 |
| Language | TypeScript |
| License | MIT |
| Install | `npm install -g cc-readback && cc-readback install all` |

## What Problem It Solves

Have you ever wanted to ask Claude Desktop "what did I actually do in Claude Code yesterday, and where did it get stuck," only to end up scrolling back through terminal history yourself, or digging through session folders one at a time? Claude Code stores every conversation locally under `~/.claude`, but that history only lives in the terminal — switch over to Claude Desktop and you're starting from zero, having to retype yesterday's context from scratch.

cc-readback is a local, read-only MCP server that reads session files directly from `~/.claude`, letting Claude Desktop answer questions like "which sessions exist for this project," "what did a given session do and which files did it touch," or "which conversation last week discussed X" — and summarizes the answers as briefings, timelines, and search results. It deliberately restricts what it parses: raw tool-result bodies, thinking blocks, pasted content, and attachments are never read; only prompt-, decision-, and file-change-level summary information is processed, and before anything is returned it's run through built-in patterns that redact credentials for AWS, GitHub, OpenAI, Anthropic, Slack, Stripe, Supabase, GCP, JWTs, and private keys.

Good fit for: anyone running multiple Claude Code sessions across different projects each day who wants a quick "what got done, what's still pending" overview inside Claude Desktop; needing to trace back which conversation last touched a given file; or wanting a read-only, audited, instantly-toggleable way to let another client see Claude Code's working memory instead of pasting an entire session's contents into a new conversation.

## Quick Start

### Install

```bash
# Option 1: global npm install (recommended)
npm install -g cc-readback
cc-readback install all

# Option 2: build from source
git clone https://github.com/affirmitv/cc-readback
cd cc-readback
npm install && npm run build
node dist/cli.js install all

# Option 3: one-click Claude Desktop install
# Download the .mcpb from GitHub Releases and open it via
# Claude Desktop → Settings → Extensions

# After installing, fully quit and reopen Claude Desktop (Cmd-Q, then relaunch)
```

### Basic Usage

The tools exposed to the agent (selected):

```text
briefing              → What did my sessions do recently, and what's still pending?
list_projects         → Which projects have Claude Code history?
list_sessions         → List sessions in a project, with titles and branches
get_session_digest    → Summarize a session: prompts, answers, files touched, decisions
get_session_timeline  → Replay a session turn by turn
search_sessions       → When did we change X? Which conversation discussed Y?
get_recent_prompts    → What have I been asking Claude Code lately?
get_file_changes      → Which sessions touched this file?
get_memory            → What does this project's auto-memory say?
get_status            → Index health, redaction counts, what is and isn't shared
```

Just ask Claude Desktop directly:

```text
What did my Claude Code sessions do today, and is anything still pending?
```

### Advanced Usage

```bash
# Pause/resume reading without uninstalling
cc-readback off
cc-readback on

# Fully remove
cc-readback uninstall all
```

## Comparison with Existing Tools

| | cc-readback | Manually scrolling terminal history | Pasting entire session contents into a new chat | Claude Code's built-in --resume |
|---|---|---|---|---|
| Query history without leaving Claude Desktop | ✅ | ❌ | Partial (manual copy first) | ❌ |
| Automatically redacts common credentials | ✅ | — | ❌ | — |
| Read-only — can't write, delete, or run shell commands | ✅ | — | — | ❌ (resume keeps executing) |
| Instantly toggleable, with an audit trail | ✅ | — | — | — |
| Supports keyword search across sessions | ✅ | ❌ | ❌ | ❌ |

## Things to Watch Out For

- **No raw output**: it can't surface raw command output or build logs, and it can't read subagent transcripts — none of that is parsed, only summary-level information.
- **A time window applies**: it can only see sessions within Claude Code's `cleanupPeriodDays` setting (30 days by default) — anything older has already been cleaned up by Claude Code itself.
- **It trusts the local filesystem**: fully read-only and offline, but that means it trusts whatever access controls already exist on `~/.claude` — if that directory has already been read or written by something malicious, redaction won't undo that.
- **Still a young project**: 17 stars, so the interface and MCP tool surface may still change.

## Today's Takeaway

The default way to let another client read Claude Code's history is to copy-paste an entire session, dragging along tool results, attachments, and pasted content into the new conversation's context. cc-readback instead builds a translation layer first — from "everything that happened on this machine" down to "decisions and file changes safe to share" — doing the scope-of-access, parseable-record-type, and credential-redaction work all in that one layer. Rather than "share the whole session," it gets closer to "share only the part I actually want you to see."

## References

- [cc-readback GitHub repo](https://github.com/affirmitv/cc-readback): README, install instructions, MCP tool list, security model, license (MIT), and star count are all from the official repo and the GitHub API.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
