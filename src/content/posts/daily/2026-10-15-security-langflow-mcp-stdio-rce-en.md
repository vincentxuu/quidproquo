---
title: "Security Alert | Any Logged-In Langflow User Can Take Over the Whole Server — CVE-2026-105740 Under Active Mass Exploitation"
date: 2026-10-15
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Langflow's MCP stdio config API accepts an OS command from any logged-in account with zero validation; attackers have been mass-scanning for it since mid-September, with over 1,600 attempts recorded so far"
tldr: "CVE-2026-105740 (CVSS 9.9): in Langflow before 1.9.0, any logged-in account — including non-admins — can write an arbitrary OS command through the MCP stdio server config API, which auto-executes the moment anyone fetches the server list. That turns an ordinary authenticated user into full server-level RCE. Security firm Previdian's honeypots recorded 1,600+ attempts and 28 distinct source IPs since Sept 19, with volume spiking from Oct 11; the same attack infrastructure is also hitting Flowise and older Langflow CVEs. Fix: upgrade to 1.9.0+ immediately, disable `LANGFLOW_AUTO_LOGIN`, and never expose Langflow directly to untrusted networks."
series:
  name: "AI Security Alert"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-15-security-langflow-mcp-stdio-rce)

## What happened

Langflow is an open-source platform, owned by IBM/DataStax, for building AI agents and workflows. Any logged-in Langflow user — including non-admin accounts — can get server-side arbitrary code execution simply by adding an MCP server with a "Stdio" transport. The flaw sits in the config API: it takes the user-supplied `command` field and passes it straight into `bash -c "exec {command}"`, with no validation, no allowlist, and no sandboxing. Worse, the attacker doesn't even need to trigger execution themselves — the command fires automatically the next time *anyone* (any user, or an admin) loads the MCP server list. Security firm Previdian's honeypot sensors have been recording live exploitation attempts since September 19; volume spiked sharply from October 11, and by October 15 the running total topped 1,600 attempts. This is an active, escalating mass-scanning campaign, not a theoretical bug.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | OS command injection → authenticated remote code execution |
| Scope | Langflow versions before 1.9.0 (any deployment with MCP stdio server config enabled) |
| Severity | Critical (CVSS 9.9, confirmed active exploitation in the wild) |
| CVE | CVE-2026-105740 |
| Fixed in | Langflow >= 1.9.0 |
| Sources | [GitHub Security Advisory GHSA-7w94-79vh-5mr2](https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2), [The Hacker News](https://thehackernews.com/2026/10/langflows-critical-authenticated-rce.html), [Previdian telemetry page](https://previdian.com/CVE-2026-105740) |

## Attack surface analysis

The attack path is blunt and doesn't need to get past any model guardrails at all — it's a plain web API command-injection bug. Step one, the attacker needs any logged-in account; a self-registered, non-admin user is enough. Step two, they send a `POST /api/v2/mcp/servers/{server_name}` request whose `command` field holds an arbitrary shell command (a reverse-shell payload, for instance), and the `env` field can carry custom environment variables too. The API accepts and stores it without inspecting the content at all. Step three, the moment anyone — the attacker, another user, or an admin browsing the MCP settings page — triggers `GET /api/v2/mcp/servers?action_count=true`, the backend drops the stored `command` string straight into `bash -c "exec {command}"`, and the attacker's listener gets a connection.

The root cause is that the server never validates user input before acting on it, and never restricts which commands can run — no allowlist, no blocklist. The only check in the code path, `_validate_node_installation`, merely confirms that Node.js is installed when the command string contains `npx`; that's not a security control. The `env` field is merged directly into the subprocess environment, opening two more paths: `LD_PRELOAD` injection for malicious shared libraries, and `PATH` override to hijack which binaries get resolved. The persistence angle is particularly nasty: unlike custom component code, which shows up in the flow editor, MCP server configs live in project settings and are invisible during a normal code review — and because the payload re-fires every time the server list is loaded, it behaves like a self-resurrecting backdoor. Mapped to the OWASP LLM Top 10, this hits both **LLM05 Supply Chain Vulnerabilities** (an unpatched flaw in a widely deployed open-source agent platform) and **LLM06 Excessive Agency** (an ordinary non-admin account gets server-side execution privileges far beyond what "configuring a tool integration" should require).

Notably, this isn't the only time Langflow's MCP stdio config has been blown open this way. Just last month Langflow patched a closely related flaw, CVE-2026-105697 (also CVSS 9.9), and the attack IPs Previdian observed (e.g. `192.255.229.92`) are simultaneously hitting Flowise's CVE-2026-69255 and older Langflow CVEs — CVE-2026-55255, CVE-2026-9198, CVE-2026-0768. That points to a single, as-yet-unidentified actor systematically sweeping the entire AI-workflow-platform ecosystem for known holes, not a one-off incident.

## Defense

**Do now**
- Check the running Langflow version (`pip show langflow`, or the Docker image tag). Anything below 1.9.0 should be treated as already exposed — upgrade immediately.
- If you can't upgrade right away, set `LANGFLOW_AUTO_LOGIN=false` and make sure Langflow isn't directly reachable from untrusted networks.
- Review the existing MCP server list (Settings → MCP Servers) for any stdio entry your team doesn't remember adding, paying close attention to the `command` and `env` fields.
- Audit access logs for `/api/v2/mcp/servers/`, especially write requests from non-admin accounts, and watch for anomalous `/api/v1/auto_login` attempts.

**Longer-term architecture**
- Anywhere user input can end up as a server-side shell command, validate at the input boundary with an allowlist, not a blocklist — and don't settle for an indirect check like "it only matters if the command contains npx."
- Run AI agent/workflow platforms that spawn external processes, like Langflow, under a least-privilege execution account, so that even a successful RCE only reaches a limited blast radius.
- Consider Netzilo's MCP server runtime governance for allowlisting and runtime scope checks, or an agent-tool-supply-chain auditing product like Noma Security or Lasso Security, to catch unapproved command patterns at the point MCP configs are written.

## Impact

Previdian's honeypot telemetry shows exploitation attempts starting September 19 — well before the CVE was publicly disclosed on October 5. Daily volume jumped to 333 attempts on October 11, and 66 new attempts were still logged on October 15 as of writing, for a cumulative total above 1,600 across 28 distinct IPs in 16 countries. Observed attacker behavior includes: checking the Langflow version, attempting `/api/v1/auto_login` (which returned 403 in the honeypot since it was disabled), then authenticating with common username/password combinations and immediately hitting the MCP config endpoint. Captured payloads include attempts to exfiltrate environment variables such as `LANGFLOW_SECRET_KEY` and `LANGFLOW_SUPERUSER_PASSWORD` to an attacker-controlled host, Docker commands probing the host's `/etc/passwd`, and basic execution probes like `id` and `whoami`. No public victim list has surfaced yet, but the campaign has moved from passive scanning to active, escalating exploitation — any internet-facing Langflow deployment should assume it's currently being swept by the same automated script.

If your team runs Langflow for internal or external agent applications, this isn't a theoretical risk — the attack infrastructure is already in place, and the same actor is systematically sweeping multiple known holes across the Langflow/Flowise ecosystem. Leaving it unpatched means handing full server execution privileges to anyone who can register an account.

## Today's takeaway

This incident shares a lesson with the recent obsidian-tc vulnerability: the MCP protocol turns "adding a tool integration" into an inherently high-privilege operation, but a lot of implementations don't design their access controls as if it were one. When an apparently read-only action — fetching a list — quietly triggers code execution behind the scenes, a side-effect-free-looking operation has been silently upgraded into a remote-code-execution trigger. That kind of interface-level gap is much harder to catch in code review than a simple missing validation line.

## References

- [GitHub Security Advisory GHSA-7w94-79vh-5mr2 — Authenticated RCE via MCP Stdio transport](https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2)
- [The Hacker News — Langflow's Critical Authenticated RCE Flaw Targeted in 1,423 Honeypot Exploit Attempts](https://thehackernews.com/2026/10/langflows-critical-authenticated-rce.html)
- [Previdian — CVE-2026-105740 exploitation intelligence](https://previdian.com/CVE-2026-105740)
- [CVE.org — CVE-2026-105740 Record](https://www.cve.org/CVERecord?id=CVE-2026-105740)
- [GitHub Security Advisory GHSA-w794-rj3p-xv45 — last month's related Langflow MCP CVE-2026-105697](https://github.com/langflow-ai/langflow/security/advisories/GHSA-w794-rj3p-xv45)
