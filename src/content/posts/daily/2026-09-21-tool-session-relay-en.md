---
title: "Tool Pick｜SessionRelay — Carrying AI Coding Session Memory Across Tools and Across People"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A local-first, MIT-licensed MCP server that unifies conversation history from Claude Code, Codex, Qoder, and ZCode into one queryable database, and can be packaged into a handoff bundle so the next person's AI gets the context instantly"
tldr: "SessionRelay is a local-first memory layer for AI coding sessions, exposed through an MCP server so an agent can query full conversation history across tools and sessions. Install: npx @ewanjasper/sessionrelay init. It solves the problem of decisions and context vanishing the moment you switch AI tools, start a new session, or hand a project to someone else."
series:
  name: "AI Tool of the Day"
  order: 35
---

> 🌏 [中文版](/posts/daily/2026-09-21-tool-session-relay)

## Tool Info

| Item | Value |
|---|---|
| Name | SessionRelay |
| Type | MCP server |
| GitHub | [EwanJasper/SessionRelay](https://github.com/EwanJasper/SessionRelay) |
| Stars | 2 (new project, created 2026-08-28) |
| Language | TypeScript |
| License | MIT |
| Install | `npx @ewanjasper/sessionrelay init` |

## What Problem It Solves

You spend three days hashing out a design with an AI, spread across several fresh sessions, and at some point you switch from Claude Code to Codex or another tool mid-project. Open a new session and ask "what did we decide about the database last week?" and the agent has no idea — it only sees the current session's context. The reasoning trail, the options you rejected, and the reasons behind the final call all disappear the moment a window closes. Hand the project to a teammate, and they're often stuck reading commit messages and guessing at intent, because the AI can't help them either.

SessionRelay runs as a local daemon that passively watches the conversation history left behind by Claude Code, Codex, Qoder, and ZCode (Trae is only partially covered, since its AI replies are end-to-end encrypted and only the user's side of the conversation is capturable), and writes everything into one local SQLite database. ZCode physically deletes old messages when it compresses context, which is exactly why SessionRelay's daemon syncs every 30 seconds — miss that window and the original text is gone for good. Each session goes through a two-stage state machine, `active → pending_end → confirmed`, before it's finalized and mined for decisions, topics, and summaries; a confirmed session that receives new messages still rolls back and re-extracts automatically, so memory doesn't fragment into stale pieces. Once any MCP-compatible agent connects, it can call 16 tools such as `search_sessions`, `get_decisions`, and `get_file_history` to query that history directly, and every result is required to carry provenance — session ID, source agent, date, message sequence — rather than a fuzzy compressed summary. When it's time to hand off, you export a `.hop` bundle (an open, MIT-licensed format with per-file SHA-256 verification, secret redaction on by default, and quarantined imports), and after the next person runs `srelay import`, their AI can immediately answer "why did we pick PostgreSQL?"

Good fit: long-running projects developed across many disconnected sessions; teams that switch between Claude Code, Codex, and similar tools but don't want to lose continuity; project handoffs or onboarding, where you want the AI to walk the next person through the decisions that got made.

## Getting Started

### Install

```bash
# Requires Node >= 22

# Option 1: global npm install (recommended)
npm install -g @ewanjasper/sessionrelay

# Option 2: try it with no install
npx @ewanjasper/sessionrelay init

# Option 3: from source
git clone https://github.com/EwanJasper/SessionRelay.git
cd SessionRelay && npm install && npm run build && npm link
```

### Basic Usage

```bash
cd your-project
srelay init                    # initialize + backfill the last 30 days
srelay sync --backfill all     # or backfill the entire history

srelay search "database choice" --json  # full-text search (jieba tokenizer + FTS5)
srelay decisions                        # list all confirmed decisions, with provenance
srelay history src/db/                  # which sessions discussed this file
srelay watch --install-service          # run the daemon persistently

# Connect to Claude Code
claude mcp add sessionrelay --scope user -- srelay serve
```

### Advanced Usage

```json
// .mcp.json: a config that works across any MCP client, bypassing PATH / cwd detection issues
{
  "mcpServers": {
    "sessionrelay": {
      "command": "node",
      "args": ["/your/install/path/SessionRelay/dist/srelay.js", "serve"],
      "env": { "SRELAY_PROJECT_ROOT": "/your/project/path" }
    }
  }
}
```

Once connected, start a new conversation and ask the AI "why did we decide to use PostgreSQL?" The correct behavior is for it to call `get_decisions` or `search_sessions` and answer with provenance attached; if it says it doesn't know, the MCP connection isn't working — run `srelay doctor` to check.

## Comparison With Existing Tools

| | SessionRelay | claude-mem | Mem0 |
|---|---|---|---|
| Storage granularity | Full sessions, original text is retrievable | AI-compressed observation fragments | Vectorized fact/preference fragments |
| Local-first, no cloud dependency | ✅ | Depends on the configured storage backend | Defaults to a cloud API; self-hosting needs a separate embedder and vector store |
| Works across agent tools | ✅ five source adapters (Claude Code / Codex / Qoder / ZCode / Trae partial), plus a custom adapter SDK | Built primarily for Claude Code, with support claimed for tools like Codex and Gemini | Requires wiring `memory.add()` / `memory.search()` into each agent yourself |
| Chinese full-text search | ✅ jieba tokenizer + SQLite FTS5, with optional local semantic search | Depends on summarization quality; no Chinese-specific tokenizer | Depends on the embedding model; no Chinese-specific tokenizer |
| Team handoff export bundle | ✅ `.hop` protocol, SHA-256 verification + secret redaction by default | No equivalent mechanism | No equivalent mechanism |
| Delete permission | Only the human user can run `forget`; MCP tools have no delete capability | No documented permission separation | Controlled by whatever the calling application implements |

## Caveats

- **Rule-based extraction is roughly 60–70% accurate**: decisions and topics are pulled out with rules, not a second LLM summarization pass, so accuracy is limited. The README is upfront about this and relies on the provenance block to let you jump back and verify each item against the original text.
- **The daemon is required, not optional**: the README states that ZCode physically deletes old messages during context compression (one real test saw 3,976 messages deleted out of a 500-turn session after compaction). Without `srelay watch` running, anything deleted before your next manual sync is gone for good.
- **The project is very new**: created on 2026-08-28, currently at 2 stars and 0 forks with 0 open issues — meaning it hasn't been broadly used or battle-tested yet. Try it on a non-critical project first, and watch for breaking changes in future releases.

## Today's Takeaway

Most "AI memory" tools solve for stuffing old conversation into the next context window. SessionRelay solves a less-discussed problem: how memory hands off between people. The `.hop` bundle turns memory into a file format that can be redacted, verified, and audited, instead of living inside one tool's private database — which is the first time "letting AI do the handoff" has felt like a normal engineering artifact you can version and review, rather than something locked inside a vendor's app.

## References

- [EwanJasper/SessionRelay — GitHub](https://github.com/EwanJasper/SessionRelay)
- [SessionRelay GitHub API metadata (license/stars/created date)](https://api.github.com/repos/EwanJasper/SessionRelay)
- [@ewanjasper/sessionrelay — npm registry](https://www.npmjs.com/package/@ewanjasper/sessionrelay)
- [thedotmack/claude-mem — GitHub](https://github.com/thedotmack/claude-mem)
- [mem0ai/mem0 — GitHub](https://github.com/mem0ai/mem0)
- [Mem0 Open Source Overview (embedder/vector store setup)](https://docs.mem0.ai/open-source/overview)
