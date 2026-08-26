---
title: "Tool Pick｜pbx-mcp — Let Your Agent Query Asterisk and FreeSWITCH with One Toolset"
date: 2026-08-16
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that lets AI Agents query both Asterisk and FreeSWITCH — two open-source PBX systems with completely different protocols — through a single unified tool interface, read-only by default with write tools not even registered unless explicitly enabled"
tldr: "pbx-mcp is an MCP server that wraps Asterisk (AMI) and FreeSWITCH (ESL) behind one set of MCP tools. Install: npx -y pbx-mcp. It solves the problem of memorizing two command sets when operating two PBX systems, and prevents Agents from accidentally running state-changing commands."
series:
  name: "AI Tool of the Day"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-tool-pbx-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | pbx-mcp |
| Type | MCP server |
| GitHub | [ictinnovations/pbx-mcp](https://github.com/ictinnovations/pbx-mcp) |
| Stars | 3 (published 2026-08-09) |
| Language | TypeScript |
| License | MIT |
| Install | `npx -y pbx-mcp` |

## What Problem Does It Solve

If you run both Asterisk and FreeSWITCH — the two most popular open-source PBX systems — you probably know the feeling of having to "switch brains" just to check line status. Asterisk uses AMI (Asterisk Manager Interface, a line protocol on TCP 5038 with `Key: Value` pairs), while FreeSWITCH uses ESL (Event Socket Layer, TCP 8021 with header blocks and `Content-Length`). The commands, output formats, and connection methods are completely different. If you want an AI Agent to help you check "which extensions are online" or "why did the trunk drop," you have to teach it two languages first.

pbx-mcp implements both protocol clients from scratch (not a wrapper around existing CLIs) and exposes them as a unified set of MCP tools: read-only queries like `asterisk_channels`, `asterisk_endpoints`, `freeswitch_registrations`, and `freeswitch_sofia_status`. Which system the Agent sees depends entirely on which environment variables you configure — set only Asterisk, and the Agent won't see any FreeSWITCH tools, and vice versa. More importantly, the security model: the server defaults to read-only. Write tools like `asterisk_originate` and `freeswitch_hangup` don't just get blocked at execution time — they never appear in `tools/list` at all in read-only mode. The Agent can't even see they exist unless you explicitly set `PBX_MCP_ALLOW_WRITE=true`.

Good fit for: ops teams running self-hosted VoIP/contact center phone systems who need an Agent to quickly triage "is the line down" or "SIP trunk registration status" during on-call, or developers who want to add a natural language query layer on top of existing Asterisk/FreeSWITCH deployments.

## Quick Start

### Installation

```bash
# Requires Node.js 18+
npx -y pbx-mcp

# Or install globally
npm install -g pbx-mcp

# Docker also works
docker run ghcr.io/ictinnovations/pbx-mcp
```

### Basic Usage

Add the server to your Claude Desktop (or other MCP client) config file, specifying which system(s) to connect to via environment variables — fill in one or both:

```json
{
  "mcpServers": {
    "pbx": {
      "command": "npx",
      "args": ["-y", "pbx-mcp"],
      "env": {
        "ASTERISK_AMI_HOST": "10.0.0.10",
        "ASTERISK_AMI_USERNAME": "mcp",
        "ASTERISK_AMI_PASSWORD": "your-secret",
        "FREESWITCH_ESL_HOST": "10.0.0.11",
        "FREESWITCH_ESL_PASSWORD": "your-password"
      }
    }
  }
}
```

Once configured, you can ask the Agent things like "what calls are active right now" or "is the SIP trunk down." The Agent will call read-only tools like `asterisk_channels` or `freeswitch_sofia_status` to query live system state, instead of digging through outdated ops wikis.

### Advanced Usage

Only enable write mode when you need the Agent to hang up abnormal calls or place test calls, and use the allowlist to restrict which commands are available through the CLI/API passthrough:

```bash
# Enable write tools (asterisk_originate / hangup etc. will appear in tools/list)
export PBX_MCP_ALLOW_WRITE=true

# asterisk_cli / freeswitch_api are "arbitrary command" channels
# By default only core show / pjsip show / dialplan show (Asterisk)
# and status / show / sofia (FreeSWITCH) read-only prefixes are allowed,
# matched by exact string comparison, not prefix matching —
# so "sofia" passes but "sofia profile internal restart" does not
```

## Comparison with Alternatives

| | pbx-mcp | Direct Asterisk/FreeSWITCH CLI | Custom Agent scripts calling AMI/ESL |
|---|---|---|---|
| Unified Asterisk + FreeSWITCH interface | ✅ | ❌ (separate command sets) | Must implement both yourself |
| MCP-native, no Agent code changes | ✅ | ❌ | ❌ |
| Write tools don't exist by default (not just blocked) | ✅ | — | Must implement yourself |
| Command allowlist + shell metacharacter filtering | ✅ | — | Must implement yourself |
| No extra protocol client installation needed | ✅ (built-in AMI/ESL clients) | — | Requires additional packages |

## Caveats

- **This is a brand-new project with very few stars (3)**: evaluate in a test environment first. Before production use, review the source code yourself, especially how AMI/ESL credentials are handled.
- **Use least-privilege accounts for AMI/ESL credentials**: the README recommends creating a separate read-only AMI user for pbx-mcp rather than reusing admin credentials, combined with network isolation (only the MCP server host should reach ports 5038/8021).
- **The `asterisk_cli` / `freeswitch_api` allowlist uses exact string prefix matching**: when adding custom allowlist rules, watch out for subcommands that "look safe but actually trigger state changes" — for example, `sofia` is allowed but `sofia profile internal restart` is not. When extending rules, stick with the exact-match logic rather than switching to prefix matching.

## Takeaway

I initially assumed this kind of "wrap a CLI for the Agent" MCP server would be a thin JSON shell over existing command-line tools. But pbx-mcp actually re-implements two protocol clients from the ground up (AMI's line protocol, ESL's header blocks) — and its "security" doesn't rely on prompt-level reminders telling the Agent not to run dangerous things. Instead, it architecturally ensures that dangerous tools simply don't exist in `tools/list` under read-only mode. This is a reminder: the key to MCP server security design isn't "blocking dangerous calls" — it's "never letting the Agent see dangerous tools in the first place."

## References

- [ictinnovations/pbx-mcp — GitHub](https://github.com/ictinnovations/pbx-mcp)
- [ICT Innovations Releases pbx-mcp, an Open Source MCP Server for Asterisk and FreeSWITCH — PRLog](https://www.prlog.org/13163497-ict-innovations-releases-pbx-mcp-an-open-source-mcp-server-for-asterisk-and-freeswitch.html)
- [I built an MCP server so I could stop memorising two PBX command sets — Tahir Almas, DEV Community](https://dev.to/tahiralmas/i-built-an-mcp-server-so-i-could-stop-memorising-two-pbx-command-sets-401o)
- [pbx-mcp on npm](https://www.npmjs.com/package/pbx-mcp)
