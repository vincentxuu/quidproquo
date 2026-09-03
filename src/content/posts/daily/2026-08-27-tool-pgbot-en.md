---
title: "Tool Pick | pgbot — Read-Only Postgres Access for AI Agents to Instantly Spot What's Wrong"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "pgbot is a read-only, statically compiled Go binary that reads Postgres's own statistics views to produce a findings-first health report, and it can run as an MCP server so AI agents can call it directly — no monitoring platform to deploy"
tldr: "pgbot is a read-only Postgres health-check CLI; run `pgbot mcp` and it becomes an MCP server agents can call directly. Install: `curl -fsSL https://pgbot.dev/install | sh`. It solves the problem of piecing together root causes across multiple monitoring dashboards when a database slows down, while an agent only ever sees fragments of that picture."
series:
  name: "AI Tool of the Day"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-08-27-tool-pgbot)

## Tool Info

| Field | Value |
|---|---|
| Name | pgbot |
| Type | CLI + MCP server (PostgreSQL read-only diagnostics tool) |
| GitHub | [pgrundev/pgbot](https://github.com/pgrundev/pgbot) |
| Stars | 757 |
| Language | Go |
| License | Apache-2.0 |
| Install | `curl -fsSL https://pgbot.dev/install \| sh` |

## What Problem It Solves

When a database slows down, you usually need several tools to piece together the full picture: query `pg_stat_statements` for slow queries, manually calculate dead-tuple ratios to see if autovacuum is falling behind, then check `\d+` again to see whether an index is actually being used. If an AI agent sits behind that diagnosis, it's worse — the agent has to compose its own SQL and decide on its own which numbers count as abnormal, with nobody telling it whether the database is healthy overall.

pgbot is a read-only, statically compiled Go binary that reads Postgres's own built-in statistics views (`pg_stat_statements`, `pg_stat_user_tables`, `pg_locks`, `pg_stat_replication`, and more). Running `pgbot inspect` once produces a findings-first health report: issues are graded CRITICAL / WARNING / NOTE first, then the checks that came back clean are listed too, so you know what's actually healthy, not just what's broken. From the third run onward, it compares against a locally stored baseline and tells you directly which query got slower or which table started doing sequential scans, instead of dumping raw numbers for you to compare yourself. The real payoff is `pgbot mcp`: the same findings are exposed over the Model Context Protocol, so an agent can call read-only tools like `inspect`, `unused_indexes`, `suggest_indexes`, and `explain_plan` and get back a versioned, PII-free JSON contract instead of a freshly composed SQL result — and the connection string and literal query values never get sent to the model.

Good fit for: troubleshooting a database you don't know well on someone else's behalf, blocking risky schema changes on a migration PR in CI (`--fail-on` works directly as an exit-code gate), or teams that want a coding agent to check a database's health report before touching anything.

## Quick Start

### Installation

```bash
# Install script (includes cosign signature and checksum verification)
curl -fsSL https://pgbot.dev/install | sh

# Or use a package manager
brew install pgrundev/tap/pgbot        # Homebrew
npx @pgbot/cli inspect "$DATABASE_URL" # npx, no install needed
go install github.com/pgrundev/pgbot/cmd/pgbot@latest
```

Needs a read-only account with just the `pg_monitor` role (`pgbot init` generates the corresponding create SQL, but won't run it for you).

### Basic Usage

```bash
export DATABASE_URL="postgres://pgbot_ro@host:5432/db"

pgbot inspect              # Health score + CRITICAL/WARNING/NOTE graded report
pgbot indexes              # Find zero-scan indexes that still take up space
pgbot vacuum                # Per-table dead-tuple ratio, whether autovacuum is keeping up
pgbot ask "why is it slow?" # A conversational layer on top of the same deterministic findings
```

### Advanced Usage

```bash
# Run as an MCP server so agents can call it directly
pgbot mcp
```

```json
{
  "mcpServers": {
    "pgbot": {
      "command": "pgbot",
      "args": ["mcp"],
      "env": { "DATABASE_URL": "postgres://pgbot_ro@host:5432/db" }
    }
  }
}
```

Beyond `inspect`, `unused_indexes`, `suggest_indexes` (needs the hypopg extension), `explain_plan`, `schema_of`, and `compare_to_baseline` are all exposed as MCP tools — all read-only. For CI, use `--format=sarif --fail-on=critical` to feed results into the GitHub Security tab, or `--fail-on-new base.json` to block a PR only on issues newly introduced by that migration.

## Comparison With Existing Tools

pgbot's own README is upfront about its positioning: it's a point-in-time diagnostic you run on demand, not a replacement for an always-on monitoring platform.

| | pgbot | pganalyze | pgwatch |
|---|---|---|---|
| Deployment | Single static binary, no service | SaaS, requires a collector agent | Self-hosted, requires a collector + time-series database |
| Requires an external account | ❌ | ✅ (SaaS) | ❌ |
| Long-term trends / dashboard / alerting | ❌ (only compares against a local baseline) | ✅ | ✅ |
| Native MCP server | ✅ | ❌ | ❌ |
| CI gate (exit code / SARIF) | ✅ | ❌ | ❌ |
| License | Open source, Apache-2.0 | Commercial SaaS | Open source, Apache-2.0 |

## Caveats

- **Status: beta**: The README itself flags `--json` as the versioned contract (currently 1.2.0), but the human-readable terminal output isn't a stable interface — automation should parse `--json`, not the text report.
- **`advise` (index suggestions) needs the hypopg extension and Postgres 16+**: versions 14-15 get only "best-effort" support, and some collectors silently skip rather than error out on those versions.
- **`ask` / `explain` need an external model key**: these two commands require `OPENAI_API_KEY` or `GEMINI_API_KEY` to work; every other command (including `inspect` and `mcp`) is fully deterministic, needs no key, and never sends data off the machine.
- **Watch out for replicas when reading "zero-scan" indexes**: the `indexes` command's own output notes that scan counts are per-node — an index that looks unused on the primary might still be in use on a replica, so don't drop an index based on primary-node numbers alone.

## Takeaway

The instinctive way to let an agent operate on a database has been to give it an MCP server that can run SQL and let the agent judge whether the query results look right. pgbot flips that: the deterministic logic — what counts as a finding, how severity gets graded — is hard-coded in Go, and the agent's job is only to interpret it, not to produce the numbers. That division of labor — the tool computes, the model explains — is a better fit for production than handing an agent a raw database connection, and it's much easier to audit exactly what the agent saw.

## References

- [pgrundev/pgbot GitHub repo](https://github.com/pgrundev/pgbot): README, command list, MCP tools documentation, license (Apache-2.0), and star count — all from the official repo.
- [pgbot.dev official site](https://pgbot.dev/): quickstart, installation methods, MCP configuration example.
- [pgbot.dev launches open-source Postgres intelligence tool for AI agents and developers — LavX News](https://news.lavx.hu/article/pgbot-dev-launches-open-source-postgres-intelligence-tool-for-ai-agents-and-developers): launch coverage, including installation and MCP integration details (published 2026-08-25).
