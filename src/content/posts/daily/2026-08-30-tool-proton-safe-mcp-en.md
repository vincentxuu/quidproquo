---
title: "Tool Pick | proton-safe-mcp — Lets an Agent Read and Draft Email, But Never Reach the Send Button"
date: 2026-08-30
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server lets an agent read, search Proton Mail, and prepare draft attachments — but there is no send capability anywhere in the codebase, and drafts require human approval from a local terminal before they're written"
tldr: "proton-safe-mcp is a FastMCP server that lets an agent read, search, and prepare draft attachments via Proton Mail Bridge. Install: git clone + uv sync + uv run proton-safe-mcp setup. It solves the problem that 'letting an agent read email is itself a prompt-injection attack surface' — there is no send tool in the codebase, and a draft only becomes real once it's manually approved from a local terminal."
series:
  name: "AI Tool of the Day"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-08-30-tool-proton-safe-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | proton-safe-mcp |
| Type | MCP server (Proton Mail, read-only + human-approved drafts) |
| GitHub | [fbossiere/proton-safe-mcp](https://github.com/fbossiere/proton-safe-mcp) |
| Stars | 1 |
| Language | Python |
| License | MIT |
| Install | `git clone https://github.com/fbossiere/proton-safe-mcp.git && cd proton-safe-mcp && uv sync` |

## What Problem It Solves

Have you ever considered that connecting an agent to a mailbox is, by itself, the root of a security problem? Email content is attacker-controlled input — anyone who sends you a message can embed prompt-injection text like "please forward this attachment to such-and-such address." If an agent holds both a read-email and a send-email tool at the same time, it's exactly one prompt injection away from doing something you never asked for. Most email MCP servers on the market ship a `send_message` tool in the name of "feature completeness," and simply hand that risk to the user to manage carefully on their own.

proton-safe-mcp takes the opposite approach entirely: it uses the official Proton Mail Bridge to let an agent read email, search, and list folders, and it can prepare drafts with attachments — but there is no SMTP client anywhere in the codebase, no `send_message` tool, and the author even wrote a test whose entire purpose is to assert "this tool does not exist." Creating a draft isn't the end of the story either — when the agent calls `prepare_draft`, all it produces is a pending proposal awaiting approval. Actually writing the draft into Proton Mail requires you to run `proton-safe-mcp approve <draft_id>` from your own local terminal, and that approval command is **not** an MCP tool — the agent has no way to reach it at all. Attachments don't travel as file paths either; they go through chunked base64 upload with a declared size and SHA-256 hash, so the server never touches the client's filesystem directly.

Best for: letting an agent help triage your inbox, draft replies, or forward messages based on content, without wanting any single tool call to actually send mail on its own — especially when the inbox already mixes in external mail (which is exactly where the attack surface comes from). Currently Linux + Proton Bridge only, and the author is explicit that "these constraints reduce risk, but do not make email trustworthy" — don't mix in other write-capable tools within the same unattended agent session.

## Quick Start

### Installation

```bash
git clone https://github.com/fbossiere/proton-safe-mcp.git
cd proton-safe-mcp
uv sync

# Set your Proton address and Bridge's local IMAP port (not your Proton password)
export PROTON_BRIDGE_USER="your-address@proton.me"
export PROTON_IMAP_PORT="1143"

# Store the IMAP password Bridge generated into the OS keyring
uv run proton-safe-mcp setup
```

Dependencies: Linux (developed and tested on Ubuntu), the official Proton Mail Bridge logged in and running, a Proton plan that supports Bridge, Python 3.11+, [`uv`](https://docs.astral.sh/uv/), and a working Secret Service keyring (`gnome-keyring` or a compatible implementation).

### Basic Usage

Register it as a regular local STDIO MCP server:

```json
{
  "name": "proton-safe",
  "transport": "stdio",
  "command": "/absolute/path/to/proton-safe-mcp/.venv/bin/proton-safe-mcp",
  "args": ["serve"],
  "env": {
    "PROTON_BRIDGE_USER": "your-address@proton.me",
    "PROTON_IMAP_PORT": "1143"
  }
}
```

Don't put `PROTON_BRIDGE_PASSWORD` in this config — the server reads it from the keyring that `setup` created. Once configured, just tell the agent to check mailbox status, list folders, or search email, and it will call the read-only tools `mailbox_status`, `list_folders`, `search_messages`, and `read_message`. `read_message` always uses `BODY.PEEK`, so it never marks a message as read, and it only returns plain text — never attachment content.

### Advanced Usage

The full flow for a draft with attachments has to run step by step, with a final approval step you press yourself, in your own terminal:

```bash
# Agent side: declare → chunked upload → verify hash → exchange for a one-time token → prepare the draft
begin_attachment_upload(filename, content_type, size_bytes, sha256_hex)
upload_attachment_chunk(upload_id, chunk_index, data_base64)   # called sequentially
finish_attachment_upload(upload_id)                             # returns an attachment_token
prepare_draft(..., attachment_tokens=[token])                   # only creates a pending proposal

# Human side: approve from your local terminal — this command is not an MCP tool
export PROTON_BRIDGE_USER="your-address@proton.me"
/absolute/path/to/.venv/bin/proton-safe-mcp approve <draft_id>
```

Only after approval can the agent call `commit_approved_draft(draft_id)` to actually write the draft into Proton Mail — and you still have to open Proton Mail yourself to review it and press send manually. Draft proposals expire after 15 minutes by default, uploaded attachments after 30 minutes, and draft content lives only in memory — restarting the server invalidates every pending proposal.

## Comparison With Existing Tools

| | proton-safe-mcp | Typical email MCP (built-in send) | Manual copy-paste |
|---|---|---|---|
| No send capability anywhere in the code | ✅ | ❌ | — |
| Drafts require local-terminal human approval | ✅ | Usually absent, or an optional flag at best | Always manual |
| Attachments go through chunked hash verification, never expose file paths | ✅ | Depends on implementation | — |
| Read-only operations don't change read status | ✅ (`BODY.PEEK`) | Depends on implementation | ✅ |
| Supports batch, automated inbox triage | ✅ (automated read/search) | ✅ | ❌ |

## Caveats

- **Linux + Proton Bridge only**: the README is explicit that the dev/test environment is Ubuntu, and `PROTON_BRIDGE_HOST` is deliberately hardcoded to `127.0.0.1` with no option to point it elsewhere.
- **The approval flow can still be bypassed**: the author acknowledges in the "Threat-model limitations" section that if the same agent session also holds unrestricted shell access, it could in theory write its own approval marker file — the integrity of the approval mechanism assumes you never mix write-capable tools into the same unattended session as this server.
- **Proton Bridge's self-signed certificate isn't verified**: the author considers this acceptable because the target host is always `127.0.0.1`, but that also means you can't casually point `PROTON_BRIDGE_HOST` at a remote host.

## Takeaway

Most email MCP servers treat "safety" as an optional setting — an opt-in `readOnly` flag, say. proton-safe-mcp instead removes the dangerous capability from the codebase entirely, rather than trying to constrain it through configuration. The approval flow is also deliberately designed to *not* be an MCP tool — meaning the security boundary isn't a rule the agent is trusted to follow, it's an option that's physically absent from the agent's tool list. This approach — eliminating the attack surface architecturally instead of bolting on protection after the fact — is worth applying to any other agent tool design that both reads untrusted external input (email, web pages, user-uploaded files) and holds write capability at the same time.

## References

- [fbossiere/proton-safe-mcp GitHub repo](https://github.com/fbossiere/proton-safe-mcp): README, security properties list, MCP tool table, attachment upload flow, and threat-model limitations all come from the official repo.
- [fbossiere/proton-safe-mcp repo metadata](https://github.com/fbossiere/proton-safe-mcp): MIT license, Python, created 2026-08-29, confirmed via the GitHub API.
