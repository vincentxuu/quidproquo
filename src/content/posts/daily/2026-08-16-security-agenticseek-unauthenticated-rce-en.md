---
title: "Security Alert | AgenticSeek Unauthenticated RCE — 26K-Star Open-Source Agent Project's /query Endpoint Allows Arbitrary Shell Execution"
date: 2026-08-16
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Open-source local AI Agent project AgenticSeek found to have a POST /query API endpoint requiring no authentication that triggers arbitrary shell command execution, CVSS 9.3, patched but default network exposure settings still require manual hardening"
tldr: "AgenticSeek (a 26K-star local AI Agent project on GitHub) has its backend bound to 0.0.0.0:7777 by default with CORS wide open. Anyone who can reach that port can send unauthenticated requests to the /query endpoint, which drives the Agent's BashInterpreter to run arbitrary commands via shell=True, safety=False — full host-level RCE (CVE-2026-72776, CVSS 9.3). The project has patched the issue (defaulting to loopback binding and allowlist CORS), but unpatched deployments remain exposed."
series:
  name: "AI Security Alert"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-security-agenticseek-unauthenticated-rce)

## Incident Overview

Open-source local AI Agent project [AgenticSeek](https://github.com/Fosowl/agenticSeek) — marketed as "a local Manus AI alternative that doesn't cost $200/month in API fees," with 26K stars on GitHub — has been found to contain an unauthenticated remote code execution (RCE) vulnerability. The issue lies in the backend's `POST /query` API endpoint: it has zero authentication, binds to `0.0.0.0:7777` by default (exposing it to external networks), and sets CORS to allow all origins (`allow_origins=["*"]`). Anyone who can reach this port can send a crafted query that drives the Agent's built-in `BashInterpreter` to execute arbitrary shell commands via `subprocess.Popen(shell=True, safety=False)`, bypassing the incomplete command blocklist and gaining full host-level control.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Missing Authentication → Remote Code Execution |
| Affected Scope | AgenticSeek ≤ 2.41.1 (commit fc242c7 and earlier, unpatched deployments) |
| Severity | Critical (CVSS v4 9.3 / CVSS v3.1 9.8) |
| CVE | CVE-2026-72776 (CWE-306 Missing Authentication for Critical Function) |
| Sources | [GitHub Advisory Database](https://github.com/advisories/ghsa-wrjr-rgfw-cm84), [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-72776), [VulnCheck](https://www.vulncheck.com/advisories/agenticseek-unauthenticated-rce-via-query-api-endpoint) |

## Attack Surface Analysis

The attack path is straightforward, requiring no prior privileges or user interaction: an attacker only needs network connectivity to the target host's port 7777 (same subnet, or the service exposed to the public internet) to send HTTP requests directly to `POST /query`. This endpoint was designed to pass natural language queries to a coder agent that can generate and execute shell commands to fulfill tasks — the problem is that this "execute arbitrary commands" capability sits behind a network interface with zero authentication.

The root cause operates at two levels. First, an **architectural trust boundary failure** — the Agent's code execution capability was treated as an "internal function" and mounted directly on an externally-facing API with no mechanism to verify the caller's identity. Second, a **defense-in-depth failure** — even though a command blocklist attempts to filter dangerous operations, the `subprocess.Popen(..., shell=True, safety=False)` combination is fundamentally resistant to complete blocklist-based prevention of bypass techniques. The default Docker Compose port mapping amplifies this to "exposed out of the box."

Mapped against the OWASP LLM Top 10, this is **LLM06 Excessive Agency** (the Agent was granted execution privileges far beyond what its context warrants) stacked on top of classic web security's **Missing Authentication**. This illustrates a recurring pattern: AI Agent security failures often aren't about "the LLM being tricked" — they happen when LLM capabilities (especially code execution) are mounted onto traditional web service frameworks without applying the most basic network exposure and authentication principles.

## Defensive Measures

**Immediate Actions**
- Check whether you have AgenticSeek deployed: verify the version is ≤ 2.41.1, or the commit predates patch commit [`f1eb2cf`](https://github.com/Fosowl/agenticSeek/commit/f1eb2cfc721f8a21dd16a8b048a9ca89f3259f6f)
- Check immediately whether port 7777 is exposed to external networks or the public internet: `curl http://<your-server-IP>:7777/health` (if reachable from an external host, you're exposed)
- If you cannot upgrade immediately, use firewall rules to restrict `/query` to loopback or trusted IPs, and disable or rewrite `BashInterpreter` to remove `shell=True`

**Long-Term Architecture**
- Upgrade to the patched version: the new version defaults `BACKEND_HOST` to `127.0.0.1` (localhost only), switches CORS to a configurable allowlist (defaulting to `http://localhost:3000`), and requires explicit opt-in for external exposure with a security warning printed
- Any service that lets an Agent execute shell commands or code must be treated as equivalent to "exposing RCE" — apply the same network isolation standards as databases, SSH, and other sensitive services, and never rely on application-layer blocklists as the sole defense
- If your team needs centralized network exposure auditing and access governance across multiple self-hosted Agent services, tools like **Netzilo** (MCP/Agent runtime governance with allowlist configuration) or **WitnessAI** can close the "insecure by default" architectural gap

## Impact Scope

Public records currently show no confirmed large-scale exploitation in the wild (not listed in NVD's KEV, EPSS at approximately 0.84%, indicating a moderate-to-low short-term exploitation probability). However, the exploitation threshold is extremely low — no authentication required, no user interaction needed, just network reachability. AgenticSeek is a growing open-source project (nearly 27K stars, approximately 1,000+ weekly download growth), commonly deployed by individual developers or small teams using Docker Compose for one-click setup. This usage profile is precisely the demographic most likely to run with "defaults = exposed," especially when hosting on cloud VMs without additional firewall rules. Patches have been released in PRs #508 and #534. If you or your team run any local AI Agent service (not just AgenticSeek), this is a good opportunity to audit whether you have similar architectures — "an endpoint where the Agent can execute code, exposed naked on the network."

## Takeaway

This incident didn't involve any prompt injection or jailbreak techniques — it was purely a classic web security mistake of "forgetting to add authentication." But because the backend hosts an Agent capable of executing arbitrary shell commands, the same old mistake escalates from "data leak" to "host-level RCE." This is a reminder that when assessing the security of Agent projects, you can't focus solely on prompt injection defenses — you also need to go back and verify that every exposed API endpoint properly separates "LLM execution capabilities" from "network access control."

## References

- [GHSA-wrjr-rgfw-cm84 — GitHub Advisory Database](https://github.com/advisories/ghsa-wrjr-rgfw-cm84)
- [CVE-2026-72776 — NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-72776)
- [AgenticSeek Unauthenticated RCE via /query API Endpoint — VulnCheck](https://www.vulncheck.com/advisories/agenticseek-unauthenticated-rce-via-query-api-endpoint)
- [Harden default network exposure of the unauthenticated backend — Fosowl/agenticSeek PR #508](https://github.com/Fosowl/agenticSeek/pull/508)
- [Patch commit f1eb2cf — Fosowl/agenticSeek](https://github.com/Fosowl/agenticSeek/commit/f1eb2cfc721f8a21dd16a8b048a9ca89f3259f6f)
