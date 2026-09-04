---
title: "Tool Pick | KRU — Let Your Agent Use a Password Without Ever Seeing It"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A local MCP credential vault that lets agents log in, connect over SSH, and call authenticated APIs with saved passwords, API keys, and SSH keys — without the plaintext ever entering model context"
tldr: "KRU is a local-first MCP credential manager that lets agents like Codex, Claude Code, and Cursor log in, connect, and call APIs using saved passwords, API keys, SSH keys, and TOTP codes — without the plaintext secret coming back into the conversation. Install: download the portable build from GitHub Releases. It addresses the problem of an agent stalling on a login page or SSH password prompt, leaving you to either take over manually or paste the secret straight into the chat."
series:
  name: "AI Tool of the Day"
  order: 21
---

> 🌏 [中文版](/posts/daily/2026-09-05-tool-kru)

## Tool Info

| Field | Value |
|---|---|
| Name | KRU |
| Type | Local MCP server + credential vault (desktop app) |
| GitHub | [omaekumiko2-create/kru](https://github.com/omaekumiko2-create/kru) |
| Stars | 126 |
| Language | Rust (Tauri) |
| License | MIT |
| Install | Download the portable build for your platform from [GitHub Releases](https://github.com/omaekumiko2-create/kru/releases/latest) |

## What Problem It Solves

Have you had an agent running a deploy or scraping task, only to have it stall halfway through on a login page, an SSH password prompt, or an API call that needs a key? At that point you usually have two options: take over and type the password yourself, breaking your flow, or paste the plaintext password into the conversation so the agent can keep going — which means a real secret now sits in model context, and if you're using a third-party client or model endpoint, that plaintext may well end up in someone else's logs or training pool.

KRU is a local `stdio` MCP server that first stores your passwords, API keys, SSH private keys, and TOTP seeds in a locally encrypted vault (XChaCha20-Poly1305), then lets the agent operate by item name instead of by the secret itself. The agent calls a tool like `credential_fill` and says "log in using the Production Server item," and KRU fills the browser field, runs the SSH command, or assembles the authenticated HTTP request locally — the value itself defaults to "Hidden," meaning the tool can use it but it never appears in what gets returned to the model. Visibility is a per-field switch (username, password, key, TOTP, custom field), not an all-or-nothing toggle on the whole item.

Good fit for: deploy scripts that need to SSH into production, agents calling a service that requires an API key, browser automation that hits a login form, or any repetitive authentication step where you don't want plaintext secrets going into the conversation history.

## Quick Start

### Install

```bash
# Download the portable build (recommended)
# Windows / macOS / Linux → .zip / .app / .tar.gz respectively
# https://github.com/omaekumiko2-create/kru/releases/latest

# Or build from source (requires Rust 1.88+, Node.js 22+, Tauri 2 prerequisites)
git clone https://github.com/omaekumiko2-create/kru
cd kru
npm install
npm run build
npm run portable
```

### Basic Usage

Open the KRU desktop app, go to Settings → Agent connection and pick your client (Codex, Claude Code, Cursor, OpenCode, and OpenClaw can be auto-detected and configured), save an item (say, named "Production Server"), then just tell your agent:

```text
Use "Production Server" in KRU MCP to deploy the current build and verify the service.
```

The MCP tools the agent actually calls underneath:

```text
items_search(query?)   → find usable items, their fields, and available actions
credential_fill        → fill one field's value into the currently focused input
ssh_run / ssh_upload / ssh_download → run commands or transfer files using a saved password/key
http_send              → send an authenticated HTTP request using saved credentials
terminal_run           → run a one-shot local command, with {{kru:field name}} for hidden values
```

### Advanced Usage

```json
// Manual stdio MCP config if your client isn't auto-detected
{
  "mcpServers": {
    "kru": {
      "command": "/absolute/path/to/kru",
      "args": ["mcp", "stdio"]
    }
  }
}
```

Or print a ready-made config:

```bash
kru config stdio-json
kru config stdio-toml
```

## Comparison with Existing Tools

| | KRU | Pasting the password into chat | System/browser password manager (e.g. 1Password CLI) | Environment variables / .env |
|---|---|---|---|---|
| Plaintext never enters model context | ✅ | ❌ | Partial (`op run` still injects the value into process env) | ✅ |
| Agent decides which credential to use, autonomously | ✅ (matched by item name and action) | ✅ | ❌ (you inject it manually first) | ❌ (you inject it manually first) |
| Supports SSH / SFTP / HTTP auth as distinct actions | ✅ | — | Partial | ❌ |
| Requires a cloud account or subscription | ❌ | — | Depends on plan | ❌ |
| Per-field (not per-item) visibility control | ✅ | ❌ | ❌ | ❌ |

## Things to Watch Out For

- **Not a sandbox**: the README is explicit — KRU doesn't judge whether an agent's command is safe, and it doesn't defend against a malicious agent or an already-compromised machine or browser. It only guarantees the plaintext doesn't come back into the conversation, not that whatever the agent does with it is what you wanted.
- **SSH host fingerprints aren't verified**: KRU supports password and private-key auth, but doesn't pin or compare SSH host fingerprints — you need to handle man-in-the-middle risk separately.
- **The Visible switch really does leak plaintext**: fields default to Hidden, but you can flip one to Visible so its value returns to the model — once flipped, it's no different from pasting the password directly; it's just a switch you have to remember to turn back off.
- **Still a very young project**: created on 2026-08-24, at 126 stars and 6 forks, and the author says in the launch post they've only been using it themselves for a week or two — the interface and MCP tool surface may still change.

## Today's Takeaway

The default instinct for "agents shouldn't touch passwords" is to cut the whole line — never let the agent near any credential, keep every step manual. KRU's approach instead splits "can it be used" from "can the plaintext be seen" into two independent switches: the agent can trigger a real login, SSH session, or API call, but the plaintext exists only briefly, locally, inside KRU itself — from the model's perspective the whole thing reads as "this got done for me," not "here is the password." That per-field visibility design fits how authentication actually needs to work day to day — "let it be used, but don't let it be seen" — better than a plain all-or-nothing credential access model does.

## References

- [KRU GitHub repo](https://github.com/omaekumiko2-create/kru): README, install instructions, MCP tool list, security model, license (MIT), and star/fork counts all sourced from the official repo and the GitHub API.
- [KRU SECURITY.md](https://github.com/omaekumiko2-create/kru/blob/main/SECURITY.md): the full security model and threat boundary.
- [Author's launch post (Reddit r/mcp)](https://www.reddit.com/r/mcp/comments/1w1bt12/i_built_a_tiny_local_mcp_server_that_lets_ai/): motivation and background for the project.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
