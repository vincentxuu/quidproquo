---
title: "Security Alert｜Postgres MCP Server's Restricted Mode Bypassed to Read Arbitrary Host Files — CVE-2026-85620 (CVSS 9.2), Vendor Security Contact Dead for Three Months, Still Unpatched"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "postgres-mcp (Postgres MCP Pro on PyPI) has a restricted-mode bypass that lets an attacker invoke pg_read_file and similar functions through a FROM clause to read arbitrary host files; no official patch exists as of this writing."
tldr: "Independent researcher George Chen reported a restricted-mode bypass in postgres-mcp (Postgres MCP Pro, a PyPI package by crystaldba) on June 6, 2026: the SQL safety layer only validates functions called directly in a SELECT list, not functions used as a table source in a FROM clause — so dangerous functions like pg_read_file bypass the allowlist entirely and read arbitrary host files, and because these functions are read-only by Postgres's own classification, the read-only-transaction safeguard doesn't stop them either. CVE-2026-85620 was formally published on September 4, rated 9.2 (Critical) under CVSS v4.0. The vendor's security contact email has long been dead and no GitHub Security Advisory was ever enabled — three months after the report, there's still no patched release. Defense: check immediately whether your connecting database role can read server files, and pause routing untrusted input into the execute_sql tool."
series:
  name: "AI Security Alert"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-09-06-security-postgres-mcp-restricted-mode-bypass)

## Incident Overview

Independent researcher George Chen found a restricted (read-only) mode bypass in `postgres-mcp` (Postgres MCP Pro on PyPI, built by crystaldba, which lets AI agents query and manage PostgreSQL databases through the Model Context Protocol): an attacker can move a function that would normally be blocked from a SQL SELECT list into a FROM clause instead, where it's treated as a table source, bypassing the function allowlist check entirely and reading arbitrary files accessible to the database server process. The flaw is now tracked as CVE-2026-85620, rated 9.2 (Critical) under CVSS v4.0. The timeline is itself notable: the researcher reported it publicly via a GitHub issue on June 6, 2026, but the vendor's security email had long since stopped working and GitHub Security Advisories were never enabled for the repo, so the CVE wasn't formally published until September 4 — and as of this writing (early September), there is still no official patched release.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | MCP server access-control bypass (CWE-863 Incorrect Authorization) leading to arbitrary file read |
| Scope | PyPI package `postgres-mcp` (Postgres MCP Pro), all released versions 0 through 0.3.0; risk is highest when the connecting PostgreSQL role has `pg_read_server_files` privilege or is a superuser (a common default) |
| Severity | Critical (CVSS v4.0 9.2, CVSS v3.1 8.6; exploitable without ever passing through restricted mode's own intended controls; no official patch as of this writing) |
| CVE | CVE-2026-85620 |
| Source | [GitHub Issue #178 (original disclosure)](https://github.com/crystaldba/postgres-mcp/issues/178), [IONIX Threat Center](https://www.ionix.io/threat-center/cve-2026-85620), [VulnCheck Advisory](https://www.vulncheck.com/advisories/postgres-mcp-pro-0.3.0-restricted-mode-bypass-via-from-clause-function), [AI Stack Current news report](https://aistackcurrent.com/news/postgres-mcp-pro-cve-2026-85620-restricted-mode-bypass) |

## Attack Surface Analysis

`postgres-mcp`'s SQL safety layer (`safe_sql.py`) decides whether a query is safe by inspecting its abstract syntax tree (AST) node types: a function called directly parses as a `FuncCall` node, and the code checks that node's function name against an allowlist. But a function used as a table source inside a `FROM` clause parses as a different node type — `RangeFunction` — which is on the list of permitted node types, yet the code never goes back and checks the function name it wraps. In other words, the exact same function is blocked when written in a SELECT list but passes through untouched when written in a FROM clause, including host-file-reading functions like `pg_read_file`, directory-listing `pg_ls_dir`, and binary-file-reading `pg_read_binary_file`.

The second reason this works is that restricted mode's other layer of defense — wrapping execution in a read-only transaction — doesn't cover this class of function at all. The design logic is "queries run inside a read-only transaction, so writes get rejected by the database" — but to PostgreSQL, `pg_read_file` and its relatives are read operations, so the read-only guard never even looks at them. Two independent layers of defense (the AST function allowlist and the read-only transaction) each happen to have a blind spot that lines up on exactly the same class of function, so stacking them doesn't close the gap. Just as important is the entry point: the SQL fed into the `execute_sql` tool is typically generated by the LLM agent itself, based on user requests or content it reads indirectly — if a webpage or document the agent processes carries an indirect prompt injection, an attacker doesn't need to connect to the MCP server directly at all; influencing what the agent reads is enough to potentially steer it into emitting a query that falls into this FROM-clause bypass.

Mapped against the OWASP LLM Top 10, this hits two categories at once: **LLM06 Excessive Agency** — connecting a database to an agent commonly means using a superuser role or one with `pg_read_server_files`, far beyond what's actually needed for an agent to query application data, so the moment the application-layer restricted mode has a gap, the underlying role's full privilege is exposed with nothing held back; and **LLM01 Prompt Injection** — because the SQL the `execute_sql` tool receives is LLM-generated content, and LLM output is steerable by injected instructions, restricted mode is effectively trying to use application-layer logic alone to guard an entry point an attacker can indirectly manipulate, which is an inherently fragile line of defense.

## Defense

The thing to do right now is to push the defense boundary back down to database role privilege — regardless of whether the application-layer restricted mode has a flaw, if the connecting role simply can't read server files, this attack path is closed. Longer term, treat "AST node-type allowlisting" — a design that judges safety by syntactic position — as a red flag: any MCP server that feeds LLM-generated content into a real system should assume the application-layer check will eventually be bypassed, and use a least-privilege database role as the actual last line of defense. Watchlist B7 companies focused on agent/tool-chain security auditing are well suited to this kind of pre-deployment review.

**Immediate actions**
- Audit whether your organization runs `postgres-mcp` (the PyPI package); if so, check immediately whether the PostgreSQL role the MCP server connects with has `pg_read_server_files` privilege or is itself a superuser — even without an application-layer fix, dropping that privilege means a triggered bypass still can't read anything
- If role privileges can't be adjusted immediately, consider pausing any path that routes untrusted input (agent-generated queries, or content potentially influenced by prompt injection) into the `execute_sql` tool until a real patch exists
- Monitor database query logs for `pg_read_file`, `pg_ls_dir`, `pg_read_binary_file`, or `pg_stat_file` invoked via a `FROM` clause rather than a normal SELECT list
- Track the [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp) project, and once a patched release ships, verify the FROM-clause bypass is actually closed rather than just bumping the version number

**Long-term architecture**
- No "application-layer security mode" should ever be the only line of defense — least-privilege database connection roles are the boundary that holds regardless of whether the application logic has a bug
- Audit every MCP server in your organization that feeds agent-generated SQL, shell commands, or file paths into a real system, and check whether their input validation has the same blind spot of only checking one syntactic position
- Establish a pre-launch checklist for internal MCP servers that explicitly requires any "safe mode" mechanism to cover every syntactic variant that achieves the same effect, not just the most obvious form of the attack
- Evaluate watchlist B7 companies Invariant Labs or Protect AI's MCP/agent tool-chain security scanning capabilities for automated audits of input validation and database role privilege across internally deployed MCP servers

## Impact

The timeline here is itself a warning sign: the researcher publicly reported this via a GitHub issue on June 6 (the vendor's security email `info@crystaldba.ai` had long since stopped delivering, and GitHub Security Advisories were never enabled, leaving public disclosure as the only option), yet the CVE wasn't formally numbered and published until September 4 — nearly three months during which the technical details sat fully public on GitHub with no formal CVE tracking or patch pressure behind them. As of this writing, the `crystaldba/postgres-mcp` repository still has no patched release. According to an [industry report cited by cryptorank.io](https://cryptorank.io/news/feed/4624f-postgres-mcp-pro-restricted-mode-bypass-exposes-the-gap-in-ai-database-security) (⚠️ single source, scale figures unverified elsewhere), the broader MCP ecosystem now has more than 10,000 publicly reachable servers and close to a hundred million monthly SDK downloads — this incident is one concrete instance of the broader pattern where AI-database middleware security models are lagging adoption speed.

If your agent system connects `postgres-mcp` to a production database and the connecting role's privileges haven't been trimmed to the minimum necessary, this incident means the protection restricted mode was supposed to provide is currently nonexistent. Because the vulnerability details and a fully reproducible technical writeup have been public for over three months, anyone aware of the weakness can apply it directly without further research.

## Today's Takeaway

Seeing names like "restricted mode" or "read-only mode" used to make me assume they covered the full scope implied by "read-only equals safe" — but this incident is a reminder that a read-only transaction only guarantees "no writes," not "everything read stays within the expected scope." A function like `pg_read_file` is a read operation to the database, but a file read to the underlying system. An application-layer security mode can only ever guard against the attack surface it was designed with in mind; the boundary that actually holds is the least privilege of the underlying resource itself — in this case, the database role.

## References

- [\[Security\] Restricted (read-only) mode bypass: arbitrary server-side file read via FROM-clause function — GitHub Issue #178](https://github.com/crystaldba/postgres-mcp/issues/178)
- [CVE-2026-85620 – Restricted-Mode Bypass / Arbitrary File Read – Postgres MCP Pro ≤ 0.3.0 — IONIX Threat Center](https://www.ionix.io/threat-center/cve-2026-85620)
- [Postgres MCP Pro 0.3.0 Restricted-Mode Bypass via FROM-Clause Function — VulnCheck Advisory](https://www.vulncheck.com/advisories/postgres-mcp-pro-0.3.0-restricted-mode-bypass-via-from-clause-function)
- [CVE-2026-85620 bypasses Postgres MCP Pro restricted mode and can expose host files — AI Stack Current](https://aistackcurrent.com/news/postgres-mcp-pro-cve-2026-85620-restricted-mode-bypass)
- [CVE Record: CVE-2026-85620 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-85620)
