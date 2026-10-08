---
title: "Tool Pick｜postgres2mcp — turn a Postgres connection into a governed MCP server"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hosted, open-source MCP server that wraps a Postgres connection with parametrized-SQL custom tools and per-API-key permissions, solving the all-or-nothing access problem when several agents share one database"
tldr: "postgres2mcp is a self-hosted MCP server that wraps a Postgres connection with a governance layer. Install: curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | bash. It solves the problem of multiple agents or third parties needing the same database, where the only options used to be full read-only access or none at all."
series:
  name: "AI Tool of the Day"
  order: 49
---

> 🌏 [中文版](/posts/daily/2026-10-09-tool-postgres2mcp)

## Tool info

| Item | Value |
|---|---|
| Name | postgres2mcp |
| Type | MCP server (Postgres access governance layer) |
| GitHub | [Railcode-HQ/postgres2mcp](https://github.com/Railcode-HQ/postgres2mcp) |
| Stars | 5 (created 2026-10-06, an official Railcode project) |
| Language | TypeScript (Bun + Effect) |
| License | MIT |
| Install | `curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh \| bash` |

## What problem it solves

Your first instinct when letting an agent query a database is usually to open a read-only Postgres role and connect a generic `mcp-postgres`-style wrapper to it. That works fine with one agent and one trust level. It breaks down the moment you have several: your own team on one key, a support agent on another, and a third-party service that integrates with your product on a third. Postgres roles are a database-level concept — they were never meant to express "this particular client may only call these three tools." In practice you end up either opening read access to everyone or to no one, and the fine-grained middle ground — "this key can query the orders table, that key can't even see the schema" — means writing your own application-layer proxy.

postgres2mcp packages that proxy as a ready-to-run, self-hosted service. Point it at a Postgres connection string and you immediately get an MCP server with the usual built-ins: schema introspection, read-only queries. The real difference is that you define your own tools from parametrized SQL — a `fetch_users_by_org(organization_id)`, say — and issue a separate API key per client, each scoped to its own set of tools. Database-level permissions (can this role write?) and MCP-level permissions (can this key call this tool?) become two independent things to manage, and a built-in dashboard logs who called what and when.

It fits teams running several agents or outside services against the same Postgres database, each needing a different slice of access — or teams on the receiving end, asked to let someone else's service "just connect to our database," who want an auditable layer they control instead of handing over blanket trust. If you're the only one running a single agent against your own dev database, this governance layer is overkill; a plain read-only role in front of any MCP wrapper gets you there faster.

## Getting started

### Install

```bash
# Needs Docker + Compose v2; the script checks and can install Docker for you
curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | bash

# Non-interactive, with a connection string and a domain up front
curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | \
  bash -s -- --yes --database-url 'postgres://user:pass@host:5432/db' --domain mcp.example.com
```

The installer prints a link carrying a one-time setup token; open it to create the first admin account. Without a domain it serves plain HTTP on `localhost:3333`, fine for local or internal testing.

### Basic usage

Create an API key in the dashboard, scope it to the tools it should see, and drop the resulting config into your agent:

```json
{
  "mcpServers": {
    "postgres2mcp": {
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer <your API key>" }
    }
  }
}
```

The built-in tools — `list_tables`, `describe_table`, `query` (run inside a read-only transaction) — cover schema discovery and querying out of the box.

### Advanced usage

Define a semantic, parametrized tool instead of letting a client run arbitrary SQL:

```sql
-- created from the dashboard or over MCP
SELECT name, email, date_joined, organization_id
FROM users
WHERE organization_id = :organization_id
```

Save it as `fetch_users_by_org`, hand it to one API key, and withhold `execute_sql` from that same key — it can now call exactly this one tool and see nothing else:

```bash
# On the database side, give postgres2mcp its own read-only role
psql -c "CREATE ROLE mcp LOGIN PASSWORD '...';"
psql -c "GRANT pg_read_all_data TO mcp;"
psql -c "ALTER ROLE mcp SET statement_timeout = '15s';"
```

## How it compares

| | postgres2mcp | A manual read-only Postgres role | A generic mcp-postgres wrapper |
|---|---|---|---|
| Per-API-key tool scoping | ✅ | ❌ (roles live at the database level, not per client) | ❌ usually one shared tool set for every client |
| Custom tools from parametrized SQL | ✅ dashboard or MCP | ❌ | Needs custom code |
| Built-in audit log and usage analytics | ✅ | ❌ query `pg_stat_statements` yourself | Depends on the implementation, usually absent |
| Self-hosted in under 10 minutes, HTTPS included | ✅ one install script | — | Depends on the project |
| Open source, deliberately kept small to audit | ✅ MIT | — | Depends on the project |

## Things to watch

- **"Read-only" is not a hard guarantee by default.** `ALTER ROLE ... SET default_transaction_read_only = on` only sets a default for new connections — a client holding `execute_sql` can in principle run `SET default_transaction_read_only = off` itself. The README says so directly: the real read-only guarantee comes from database-side `GRANT`s, not this flag. Set up a dedicated database role per `docs/deployment.md` before shipping.
- **Still early.** It's at 0.4.0, built on an Effect 4.0 release candidate, and its `@modelcontextprotocol/sdk` dependency is moving fast too. Watch the repo's commit history before relying on it in production.
- **No HTTPS without a domain.** Install without `--domain` and you get plain HTTP on localhost or your internal network — admin password and sessions travel unencrypted. For anything public, run the installer with a domain for its built-in Let's Encrypt flow, or put your own reverse proxy in front.

## Today's takeaway

Most "wire a database up to an agent" MCP servers default to all-or-nothing: either the whole database is read-only and open to any client that connects, or it's closed entirely. postgres2mcp separates "which tool can this key call" from "what can this database role do" into two independent layers of governance — which means one database can serve several agents at different trust levels without opening a separate database role for each one.

## References

- [Railcode-HQ/postgres2mcp — GitHub](https://github.com/Railcode-HQ/postgres2mcp)
- [postgres2mcp — deployment docs (database role setup, the limits of the read-only guarantee)](https://github.com/Railcode-HQ/postgres2mcp/blob/main/docs/deployment.md)
- [postgres2mcp — install.sh source](https://github.com/Railcode-HQ/postgres2mcp/blob/main/install.sh)
- [Railcode](https://railcode.dev)
- [Model Context Protocol specification](https://modelcontextprotocol.io)
