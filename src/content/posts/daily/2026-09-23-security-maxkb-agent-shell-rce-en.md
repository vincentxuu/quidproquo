---
title: "Security Alert | MaxKB AI Agents Get a Root Shell Bundled In for Free — CVSS 10.0 Turns Prompt Injection Straight Into RCE"
date: 2026-09-23
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "MaxKB, an open-source enterprise AI agent platform, ships CVE-2026-77521: attaching any tool, MCP tool, skill, or sub-application to an assistant automatically grants it an unapproved, root-privileged shell execute tool — turning indirect prompt injection directly into command execution"
tldr: "Lasso Security found that any MaxKB assistant with a tool, MCP tool, skill, or sub-application attached gets a SandboxShellBackend that bundles in a shell execute tool — one MaxKB never excludes from the tool list and never adds to the human-approval list, so it runs with zero oversight. That leaves the shell tool wide open to anything the agent reads: support tickets, RAG-ingested documents. Public or embedded anonymous assistants need no privileges at all to trigger it, earning a perfect CVSS 10.0. Patched in v2.10.5-lts; no evidence of in-the-wild exploitation."
series:
  name: "AI Security Alert"
  order: 36
---

> 🌏 [中文版](/posts/daily/2026-09-23-security-maxkb-agent-shell-rce)

## Summary

Security firm Lasso Security disclosed a critical vulnerability in MaxKB, the open-source enterprise AI assistant/agent platform maintained by 1Panel-dev. Attaching a tool, MCP tool, skill, or sub-application to any assistant causes MaxKB — via the `deepagents` library — to automatically build a `SandboxShellBackend`, which bundles in an `execute` tool capable of running arbitrary shell commands. That tool is never excluded from the assistant's available tools, and it's never added to the list of actions requiring human approval. The result: any untrusted text the agent reads — a support ticket, an uploaded document, RAG-retrieved content — can trigger command execution through indirect prompt injection, with no user interaction and no privileges required. The flaw is tracked as CVE-2026-77521 and documented in a GitHub Security Advisory (GHSA-f36j-f34j-h3rx) with a perfect CVSS 3.1 score of 10.0, Critical. It's patched in 2.10.5-lts, and there's no evidence of exploitation in the wild.

**Key facts**

| Item | Value |
|---|---|
| Attack type | Prompt injection leading to command execution |
| Scope | MaxKB ≤ 2.10.3-lts, any assistant with a tool, MCP tool, skill, or sub-application attached; public or embedded anonymous assistants are highest-risk |
| Severity | Critical (CVSS 3.1: 10.0, `AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H`) |
| CVE | CVE-2026-77521 (GHSA-f36j-f34j-h3rx) |
| Sources | [GitHub Security Advisory](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx), [GBHackers](https://gbhackers.com/critical-maxkb-ai-agent-flaw/), [VulDB](https://vuldb.com/cve/CVE-2026-77521) |

## Attack Surface Analysis

The attack starts at MaxKB's tool-attachment mechanism. Whenever an operator gives an assistant any kind of tool capability — a tool, an MCP tool, a skill, or a sub-application — the underlying `create_deep_agent` call from `deepagents` builds a `SandboxShellBackend`. Alongside whatever functionality the operator intended, that backend quietly ships an `execute` tool that can run arbitrary shell commands, plus filesystem tools. MaxKB never excludes `execute` from the tool list, and never adds it to `interrupt_on` — the list of actions requiring human approval before execution, which only covers `write_file`, `read_file`, and `edit_file`. The single most dangerous action, `execute`, was left off. An attacker doesn't need to bypass any approval flow: they just need the agent to encounter injected text while processing content — hidden in a support ticket or a RAG-ingested document — and once the model decides to call the tool, the command runs.

A second layer compounds the problem in the execution environment itself. On source deployments, `MAXKB_SANDBOX` — the flag controlling whether a sandbox is enabled — defaults to off, so commands run directly on the host with the application's own privileges, via something like a `shell=True` invocation. Even the official container image, which sets `MAXKB_SANDBOX=1`, builds the full command as a shell string and executes it through a root shell before dropping privileges — so shell metacharacters let a command escape the intended lower-privileged wrapper. And since the official image itself runs as root (UID 0, no `USER` directive), an escape lands directly at root. Mapped to the OWASP LLM Top 10, this hits both **LLM01 Prompt Injection** (untrusted content is the trigger for the entire chain) and **LLM06 Excessive Agency** (a chat assistant has no business need for an unapproved, root-capable shell, but the architecture grants it by default).

## Defense Playbook

This case reinforces a recurring pattern: agent frameworks that bundle tool capabilities together for convenience tend to quietly widen the attack surface in places operators never notice — you think you attached one MCP tool, and you actually got a hidden shell-execution capability along with it.

**Immediate actions**
- Upgrade to MaxKB **2.10.5-lts** or later
- If you can't upgrade immediately: audit every assistant with a tool, MCP tool, skill, or sub-application attached, and remove those capabilities where not essential; confirm `MAXKB_SANDBOX` is enabled on source deployments (the vendor notes this alone isn't sufficient given the container-wrapper flaw)
- Prioritize any public or embedded (anonymously accessible) assistants first — they're the highest-risk deployment under the CVSS 10.0 scenario

**Long-term architecture**
- Any automatically bundled tool capability should default to an allowlist, not a denylist — newly introduced shell or filesystem tools should be excluded by default and require an explicit opt-in, rather than shipping open and relying on someone to remember to exclude them later
- Treat the "requires human approval" action list (like MaxKB's `interrupt_on`) as part of your security boundary and audit it regularly, to confirm it covers every high-risk operation, not just common read/write actions
- Evaluate watchlist B7 tools like Protect AI or Prompt Security, which scan an agent's tool chain and dependencies before deployment and can flag "what permissions did this tool bundle in that you didn't expect"

## Impact Scope

Lasso Security reported this through coordinated disclosure. The GHSA advisory states their proof of concept ran only against a self-built test deployment, not any third-party production system, and no source indicates the flaw has been exploited in the wild. But because MaxKB is open-source and self-hostable, any publicly deployed, anonymously accessible assistant with tool capabilities attached theoretically falls into the CVSS 10.0 scenario — no privileges or user interaction required. That means pre-patch exposure depends on how many deployments are publicly reachable, not on an attacker obtaining any account.

If your team runs a similar "attach a tool, get a bundled execution environment for free" agent framework, this is worth a moment to check whether the same hidden path — a tool attachment quietly bundling in unexpected privileges — exists in your own system, especially for any assistant that processes untrusted input: support tickets, uploaded documents, or scraped web content.

## Today's Takeaway

The most important thing to remember about this vulnerability isn't the CVSS 10.0 score — it's the root cause: no single tool was implemented wrong. The framework's design quietly bundled in a shell execution capability nobody asked for the moment you attached any tool, and it never wired that capability into even the most basic safeguard, human approval. When evaluating the security of an agent framework, it's not enough to ask "is the tool I explicitly enabled safe" — you also have to ask "what did the framework quietly enable behind it."

## References

- [GitHub Security Advisory GHSA-f36j-f34j-h3rx: Prompt-injectable agent can lead to command execution](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx)
- [GBHackers: Critical MaxKB AI Agent Flaw](https://gbhackers.com/critical-maxkb-ai-agent-flaw/)
- [VulDB: CVE-2026-77521](https://vuldb.com/cve/CVE-2026-77521)
- [Strix.ai CVE Advisory: CVE-2026-77521](https://www.strix.ai/cve/CVE-2026-77521)
