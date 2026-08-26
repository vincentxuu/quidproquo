---
title: "Security Alert｜Omnigent Agent Bundle Upload Vulnerabilities — Three Critical CVEs Let Authenticated Users Own the Runner Host"
date: 2026-08-23
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: en
description: "Open-source AI agent meta-harness Omnigent (GitHub 9,100+ stars, wraps Claude Code / Codex / Cursor) disclosed three critical vulnerabilities — any authenticated user with basic session-edit permissions can upload a crafted agent bundle to achieve RCE or arbitrary file access on the runner host"
tldr: "Omnigent is an open-source meta-harness that unifies management of Claude Code, Codex, Cursor, and other coding agents. On 8/21, three CVEs were disclosed: CVE-2026-62674 (CVSS 9.0, upload a forged shared agent bundle embedding a stdio MCP server to achieve runner RCE), CVE-2026-62675 (uploaded bundle declares a Python callable tool that the runner executes directly), and CVE-2026-62677 (unvalidated os_env.cwd in the bundle lets the agent read/write the entire runner filesystem and leak credentials from environment variables). All three share the same root cause: the agent bundle upload path over-trusts tenant-supplied content. Patched in 0.3.0 — any multi-user or self-hosted Omnigent deployment should upgrade immediately."
series:
  name: "AI Security Alert"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-08-23-security-omnigent-agent-bundle-rce)

## Incident Overview

The open-source project [Omnigent](https://github.com/omnigent-ai/omnigent) positions itself as a "meta-harness" — an AI agent orchestration framework that lets users wrap, schedule, and manage Claude Code, Codex, Cursor, OpenCode, and other coding agents from a single server, with multi-user session sharing, policy enforcement, and sandbox controls. The project was created just over two months ago (June 11, 2026) and has already surpassed 9,100 GitHub stars, growing extremely fast. On August 21, 2026, Omnigent officially disclosed three critical vulnerabilities (CVE-2026-62674, CVE-2026-62675, CVE-2026-62677), all centered on the same problem: the agent bundle upload endpoint over-trusts "tenant-uploaded content," allowing any authenticated user with basic session-edit permissions to execute arbitrary commands on the shared or self-hosted runner host, read/write its entire filesystem, or steal credentials from the runner environment.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Broken Access Control → Remote Code Execution / Privilege Escalation (AI Agent Framework) |
| Scope | Omnigent < 0.3.0 multi-user / self-hosted deployments (server mode) |
| Severity | Critical (CVE-2026-62674 CVSS 9.0) |
| CVEs | CVE-2026-62674, CVE-2026-62675, CVE-2026-62677 |
| Sources | [GitHub Security Advisory GHSA-jrrm-9hc7-2v3h](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-jrrm-9hc7-2v3h), [GHSA-756x-9hf6-q4h4](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-756x-9hf6-q4h4), [GHSA-p8rw-8qj3-hf33](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-p8rw-8qj3-hf33), [The Hacker Wire](https://www.thehackerwire.com/omnigent-critical-command-injection-via-shared-agent-bundle-cve-2026-62674/), [CVE.report](https://cve.report/software/omnigent-ai/omnigent) |

## Attack Surface Analysis

All three vulnerabilities share the same entry point: `POST /v1/sessions` or `PUT /sessions/{session_id}/agent` allows users to upload a complete agent bundle — a configuration file describing the agent's behavior, tools, and execution environment — but the server-side validation of this "user-supplied" config is insufficient.

**CVE-2026-62674**: The `PUT /sessions/{session_id}/agent` endpoint correctly checks the caller's `LEVEL_EDIT` permission on the session, but fails to verify whether the target is a shared/template agent with `session_id` set to `None`. An attacker only needs edit permission on their own session to send this request and replace a company-wide shared template agent wholesale, injecting a `stdio` MCP server into it. When any other user (including unrelated colleagues) creates a new session using the tampered shared agent, Omnigent's `tools/mcp.py` launches the attacker-specified command with the runner process's privileges — effectively trading "regular user edit permission" for "runner host command execution."

**CVE-2026-62675**: This one doesn't involve shared agents — it's about the user's own uploaded bundle. The server validates the bundle format but doesn't block tool declarations with `type: function` + `callable:`. This Python callable tool feature was designed for trusted local developers, but the upload path accepts it from tenant bundles too. Once invoked, the runner imports and executes the Python callable pointing to dangerous calls like `subprocess.check_output`, running arbitrary local commands on the shared host.

**CVE-2026-62677**: The most fundamental issue — the `os_env.cwd` field in the bundle has zero validation, no normalization, and no boundary checks. An attacker can set it to `/` or any other user's home directory. If `OMNIGENT_RUNNER_WORKSPACE` isn't set at deployment time (which only happens automatically for pure CLI/host-launched sessions), the agent's file read/write and shell tools treat the entire host filesystem as in-bounds. The attacker can run `sys_os_shell("env")` to dump all environment variables inherited by the runner process — which typically include API keys and cloud credentials.

Mapped to the OWASP LLM Top 10, all three fall at the intersection of **LLM06 Excessive Agency** (the agent has far more privileges on the runner host than it should) and classic **Broken Access Control** (the server doesn't separately validate "data uploaded by tenants" from "behavior that only operators should configure"). The problem isn't prompt injection tricking the model — it's the backend API itself drawing the trust boundary wrong for "user-controllable configuration files."

## Defensive Measures

**Immediate Actions**
- Check if you're running Omnigent in server mode with multi-user access: `omnigent --version` — upgrade immediately if below 0.3.0
- If upgrading isn't possible right away, temporarily disable shared/template agent rebinding, or restrict which accounts have `LEVEL_EDIT` permissions
- Verify that `OMNIGENT_RUNNER_WORKSPACE` is set in your deployment (unset deployments are fully exposed to CVE-2026-62677)
- Assume all credentials accessible to the runner process (cloud keys, database passwords, internal service tokens) in affected deployments have been compromised — rotate everything

**Long-term Architecture**
- For any system where "users can upload configuration files that drive agent behavior," treat uploaded content as untrusted input rather than just blocking certain fields at the UI layer — the common lesson from all three CVEs is that multiple server-side validation paths (regular sessions, shared agents, cwd boundaries) operated independently without a unified trust boundary check
- Multi-user agent runner hosts should enable sandboxing by default (don't let `sandbox.type: none` take effect for tenant-uploaded bundles) and enforce workspace boundaries — don't rely on "the deployer remembers to set an environment variable" as a defense
- Adopt tools like Invariant Labs' agent security formal verification watchlist, or Netzilo's cross-platform agent runtime governance for kill switches, to reduce the blast radius of any single framework vulnerability

## Impact Assessment

Omnigent has accumulated over 9,100 stars in just over two months — among the fastest-growing projects in its category — and explicitly markets itself as "unified wrapping for Claude Code / Codex / Cursor." This means the affected population extends beyond Omnigent's own users to every team running existing coding agents on shared or self-hosted servers through it. All three vulnerabilities are patched in 0.3.0. The official advisory doesn't mention any known exploitation in the wild, and no public PoC exists yet. However, given the low attack barrier (only a regular account with session-edit permission, no admin required) and the impact being full runner host RCE or arbitrary file access, any deployment still running an older version with multi-user access should be treated as high-risk and upgraded as a priority.

If your team uses a similar meta-harness or self-hosted agent platform with shared runners, this incident is a reminder: "user-uploadable configuration files" in the agent ecosystem are becoming a new attack surface, no less important than traditional file upload vulnerabilities.

## Takeaway

AI agent security discussions usually focus on prompt injection — tricking the model into doing harmful things. These three Omnigent vulnerabilities don't touch the model at all. They're purely about the "allow users to upload structured configuration files" feature having incomplete permission checks: the most basic principle in traditional web security — "never trust user input" — gets overlooked all over again once the input wears the disguise of an agent bundle. The more an agent framework makes "describe behavior via config files" its selling point, the more it needs to treat those config files as untrusted input, with the same vigilance applied to file uploads and deserialization.

## References

- [GitHub Security Advisory GHSA-jrrm-9hc7-2v3h (CVE-2026-62674)](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-jrrm-9hc7-2v3h)
- [GitHub Security Advisory GHSA-756x-9hf6-q4h4 (CVE-2026-62675)](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-756x-9hf6-q4h4)
- [GitHub Security Advisory GHSA-p8rw-8qj3-hf33 (CVE-2026-62677)](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-p8rw-8qj3-hf33)
- [The Hacker Wire: Omnigent Critical Command Injection via Shared Agent Bundle](https://www.thehackerwire.com/omnigent-critical-command-injection-via-shared-agent-bundle-cve-2026-62674/)
- [CVE.report: Omnigent vulnerabilities](https://cve.report/software/omnigent-ai/omnigent)
- [Omnigent GitHub repository](https://github.com/omnigent-ai/omnigent)
