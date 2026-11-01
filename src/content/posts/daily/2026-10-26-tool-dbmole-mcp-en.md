---
title: "Tool Pick｜dbmole-mcp — An MCP Server That Lets Agents Manage Their Own PostgreSQL/MySQL Connections"
date: 2026-10-26
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A newly released MCP server lets agents add and edit PostgreSQL/MySQL connections at runtime through tool calls — with built-in SSH tunneling, TLS verification, and enforced read-only mode, no client config editing required"
tldr: "dbmole-mcp is a PostgreSQL/MySQL MCP server that lets an agent manage its own connections. Install: `claude mcp add dbmole -- npx -y dbmole-mcp`. It solves the problem that most database MCP servers hard-code connections in a client config file an agent can't touch — adding or changing one means editing JSON by hand and restarting the client."
series:
  name: "AI Tool of the Day"
  order: 65
---

> 🌏 [中文版](/posts/daily/2026-10-26-tool-dbmole-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | dbmole-mcp |
| Type | MCP server (stdio) |
| GitHub | [ed-smartass/dbmole-mcp](https://github.com/ed-smartass/dbmole-mcp) |
| Stars | 1 (the GitHub mirror was created on 2026-10-25; the npm package is already at 0.2.0, so it clearly had a life on the author's own git server before going public) |
| Language | TypeScript (Node.js ≥ 22) |
| License | MIT |
| Install | `claude mcp add dbmole -- npx -y dbmole-mcp` |

## What Problem It Solves

You ask an agent to check a table on staging, and most database MCP servers keep connection strings hard-coded in the client config — adding a new one means editing JSON by hand, typing in a password, and restarting the client. Switch to a different bastion host or a different read-only account, and you do it all again. The agent has no way to help, because "configure a connection" was never an MCP tool to begin with — it was always something you did yourself, by hand.

dbmole-mcp turns connection management itself into an MCP tool. Tell the agent "connect to the staging replica behind bastion.example.com, read-only," and it calls `add_connection`, which writes the entry into a `.dbmole.json` in the project directory (or the global `~/.config/dbmole/connections.json`). Both files are re-read on every tool call, so an edit you make by hand, or one made from another session, takes effect on the very next call — no restart needed. A connection can carry an SSH tunnel (password, key, or agent auth, with the host key checked against `known_hosts` or a fingerprint you pin), and TLS with full certificate and hostname verification. `readonly: true` is enforced at the database-session level rather than by a SQL parser looking for keywords — PostgreSQL wraps the call in `BEGIN READ ONLY`, MySQL sets `SET SESSION TRANSACTION READ ONLY`. Every call also resets the session cleanly afterward (rolling back any open transaction, clearing temp tables and session variables), so nothing from one call carries into the next.

Good fit: an agent that needs to move between environments constantly — local, staging, a read-only production replica behind a bastion — without you editing a config file every time it switches. Also worth a look if you're thinking about how much control to hand an agent in the first place: dbmole-mcp lays connection management fully open as a tool surface, and its docs are unusually direct about the risk that comes with it (see Things to Watch For below).

```diagram
title: Read-only enforcement and session reset in execute_sql
desc: Every query first checks whether the connection is read-only; whatever happens next, the session is reset when the call finishes so nothing carries over to the next call.
caption: Simplified; connection resolution (project file overrides the global store) and SSH tunnel setup are omitted.
step: Agent calls execute_sql with a connection name and SQL
step: This connection is marked readonly
step: Not read-only, proceed directly
step: Wrap the call in BEGIN READ ONLY / SET SESSION TRANSACTION READ ONLY, then execute
step: Success returns the result; failure returns an error — either way the session gets reset
---
<svg viewBox="0 0 640 576">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 112V144" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M376 192H428" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 236V268" data-step="3"/>
  <path class="dg-line" d="M520 216V260Q520 268 512 268H288" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 272V292" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 348V372" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M376 416H428" marker-end="url(#arrow-accent)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="196" y="60" width="168" height="52" rx="6"/>
    <text class="dg-label" x="280" y="80" text-anchor="middle" dominant-baseline="central">Call execute_sql</text>
    <text class="dg-sub" x="280" y="98" text-anchor="middle" dominant-baseline="central">connection name + SQL</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 148L376 192L280 236L184 192Z"/>
    <text class="dg-label" x="280" y="182" text-anchor="middle" dominant-baseline="central">Is it readonly?</text>
    <text class="dg-sub" x="280" y="204" text-anchor="middle" dominant-baseline="central">this connection</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="432" y="168" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="188" text-anchor="middle" dominant-baseline="central">Wrap in READ ONLY</text>
    <text class="dg-sub" x="520" y="206" text-anchor="middle" dominant-baseline="central">enforced at session level</text>
  </g>

  <circle class="dg-dot" cx="280" cy="270" r="4" data-step="2 3"/>

  <g data-step="4">
    <rect class="dg-box" x="192" y="292" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="312" text-anchor="middle" dominant-baseline="central">Execute the statement</text>
    <text class="dg-sub" x="280" y="332" text-anchor="middle" dominant-baseline="central">capped by rowLimit / 40KB</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
    <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">Did it succeed?</text>
    <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">execute_sql reports</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="432" y="392" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="416" text-anchor="middle" dominant-baseline="central">Return the result</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="192" y="492" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="512" text-anchor="middle" dominant-baseline="central">Return an error</text>
    <text class="dg-sub" x="280" y="532" text-anchor="middle" dominant-baseline="central">session resets either way</text>
  </g>

  <text class="dg-edge" x="402" y="180" text-anchor="middle" dominant-baseline="central" data-step="2">yes</text>
  <text class="dg-edge" x="290" y="256" text-anchor="start" dominant-baseline="central" data-step="3">no</text>
  <text class="dg-edge dg-text--accent" x="402" y="404" text-anchor="middle" dominant-baseline="central" data-step="5">yes</text>
  <text class="dg-edge dg-text--warn" x="290" y="480" text-anchor="start" dominant-baseline="central" data-step="5">no</text>
</svg>
```

## Quick Start

### Install

```bash
# Requires Node.js 22+; the server needs no connections configured to start
claude mcp add dbmole -- npx -y dbmole-mcp

# Also supports Codex, Cursor (one-click deeplink), VS Code, Claude Desktop (.mcpb file)
# and Docker — see the README's "Install" section for each
```

### Basic Usage

Tell the agent, for example:

> Add a read-only postgres connection called `shop` to this project: host 10.0.0.12,
> database shop, user reporter, through SSH to deploy@bastion.example.com using my SSH agent.
> Then show me the five largest tables.

The agent calls `add_connection`, then `test_connection`, `list_tables`, and `execute_sql` in turn:

```json
{
  "name": "shop",
  "type": "postgres",
  "host": "10.0.0.12",
  "user": "reporter",
  "database": "shop",
  "readonly": true,
  "ssh": { "host": "bastion.example.com", "user": "deploy", "agent": true },
  "scope": "project"
}
```

### Advanced Usage

```bash
# Pin the SSH host key so future connections skip known_hosts entirely
ssh-keyscan -p 22 bastion.example.com 2>/dev/null | ssh-keygen -lf -
# 256 SHA256:EXAMPLE... bastion.example.com (ED25519)
# Give the agent that SHA256:... value and ask it to call update_connection with ssh.hostKey
```

```json
// When a project and global connection share a name, the project one wins —
// list_connections flags which entry gets shadowed
{
  "connections": [
    { "name": "shop", "type": "postgres", "host": "127.0.0.1", "user": "dev", "database": "shop" }
  ]
}
```

## How It Compares

| | dbmole-mcp | DBHub | Postgres MCP Pro | mcp-server-mysql | MCP Toolbox |
|---|---|---|---|---|---|
| PostgreSQL | ✅ | ✅ | ✅ | ❌ | ✅ |
| MySQL | ✅ | ✅ | ❌ | ✅ | ✅ |
| Other databases | ❌ | ✅ | ❌ | ❌ | ✅ |
| Built-in SSH tunnel | ✅ | ✅ | — | ✅ | ❌ |
| Agent adds/edits connections via tools | ✅ | ❌ (maintainer has said it's not planned) | ❌ | ❌ | ❌ |
| Index tuning | ❌ | — | ✅ | — | — |
| Health checks | ❌ | ✅ | ✅ | — | ✅ (prebuilt PostgreSQL tools) |

(Table adapted from dbmole-mcp's own README comparison, checked October 2026; other projects may have shipped updates since — check their own docs.)

## Things to Watch For

- **readonly is not a security boundary.** The agent can call `update_connection` and turn it off itself — the README says so directly. For an actual guarantee, the database account itself needs no write, file, or administrative privileges.
- **Real gaps exist in what readonly protects.** PostgreSQL's `COPY ... TO PROGRAM` / `lo_export`, writes through `dblink`, DML on temporary tables, and administrative statements like `pg_terminate_backend` / `SET GLOBAL` / `KILL` all fall outside what a "read-only transaction" covers.
- **Connection files store plaintext credentials** (mode `0600`, same as `~/.pgpass`). Keep `.dbmole.json` out of version control. Worse: in a repo you've just cloned and haven't reviewed, if it already ships a `.dbmole.json`, dbmole trusts it as-is and may shadow your global connection, redirecting queries to a different host entirely — run `list_connections` before working in an unfamiliar repo.
- **While an SSH tunnel is open, any local process can connect through it** on `127.0.0.1` with no extra authentication, including other users on a shared host. The database's own credentials are the last line of defense there.

## Today's Takeaway

Most database MCP servers leave "how to configure a connection" outside the tool surface entirely, treating it as something the user is expected to handle beforehand. dbmole-mcp moves it inside the MCP tool layer — which removes the config-file-editing, client-restarting steps, but also turns connection management itself into a new attack surface. Whoever can call `update_connection`, or hand you a repo to clone that ships a malicious connection file, effectively gets access to the credentials — a completely different concern from read-only enforcement at the SQL layer. The maintainer lays out this threat model plainly in SECURITY.md, and that kind of candor — writing the convenience and the risk into the same document — isn't common among comparable tools.

## References

- [ed-smartass/dbmole-mcp — GitHub](https://github.com/ed-smartass/dbmole-mcp)
- [dbmole-mcp SECURITY.md](https://github.com/ed-smartass/dbmole-mcp/blob/main/SECURITY.md)
- [dbmole-mcp CHANGELOG.md](https://github.com/ed-smartass/dbmole-mcp/blob/main/CHANGELOG.md)
- [dbmole-mcp — npm](https://www.npmjs.com/package/dbmole-mcp)
- [ed-smartass/esmole-mcp — the same author's Elasticsearch counterpart](https://github.com/ed-smartass/esmole-mcp)
- [bytebase/dbhub — GitHub (comparison target)](https://github.com/bytebase/dbhub)
- [crystaldba/postgres-mcp — GitHub (comparison target)](https://github.com/crystaldba/postgres-mcp)
