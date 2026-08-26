---
title: "Security Alert | Flowise Custom MCP Node Command Injection — Fourth RCE CVE in One Year (CVE-2026-73601)"
date: 2026-08-18
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: en
description: "Open-source AI Agent builder Flowise has a new command injection vulnerability CVE-2026-73601 in its Custom MCP node. Authenticated users can achieve host-level arbitrary command execution via environment variables and working directory tricks in stdio mode — the fourth RCE reported against the same feature in one year."
tldr: "Security firm elttam discovered that when Flowise's Custom MCP node runs with CUSTOM_MCP_PROTOCOL=stdio (the default), authenticated users can abuse PYTHONWARNINGS/BROWSER environment variables or exploit the StdioClientTransport's root cwd to bypass existing command and path validation, achieving arbitrary command execution on the host. Rated CVSS v4.0 9.0 Critical, patched in 3.1.3 (CVE-2026-73601). This is the fourth publicly reported RCE against the same Custom MCP feature within one year, highlighting that a 'whitelist commands, blacklist arguments' validation architecture is virtually guaranteed to be bypassed when users can define their own stdio MCP servers. Key mitigations: upgrade, switch CUSTOM_MCP_PROTOCOL to sse, and stop relying on deny-list validation for env/command — an approach that never eliminates the attack surface itself."
series:
  name: "AI Security Alert"
  order: 4
---

> 🌏 [中文版](/posts/daily/2026-08-18-security-flowise-custom-mcp-command-injection)

## Incident Overview

Security research firm elttam disclosed a command injection vulnerability in the Custom MCP node of Flowise, the open-source AI Agent/workflow builder platform, tracked as **CVE-2026-73601**. When deployed with the default `CUSTOM_MCP_PROTOCOL=stdio` setting, authenticated users can manipulate environment variables and paths in the MCP server configuration to bypass Flowise's existing command and argument validation, executing arbitrary OS commands on the host running Flowise. The GitHub Security Advisory (GHSA-g98q-rm45-q9h8) was published in late July; the CVE was officially registered in NVD and CVE.org on August 13, with the fix released in version 3.1.3. This is the fourth publicly reported RCE-class vulnerability in Flowise's Custom MCP feature within the past year.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Command Injection (CWE-95, achieving host-level RCE via Custom MCP node) |
| Affected Scope | Flowise (FlowiseAI/Flowise) < 3.1.3, with Custom MCP node configured as `CUSTOM_MCP_PROTOCOL=stdio` (the default) |
| Severity | Critical (CVSS v4.0 9.0) |
| CVE | CVE-2026-73601 |
| Sources | [GitHub Security Advisory GHSA-g98q-rm45-q9h8](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8), [NVD / CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-73601), [VulnCheck Advisory](https://www.vulncheck.com/advisories/flowise-before-remote-code-execution-via-custom-mcp), [Halo Security Advisory](https://cve.halosecurity.com/cve-advisory/cve-2026-73601-flowise-remote-code-execution-via-custom-mcp-node) |

## Attack Surface Analysis

Flowise's Custom MCP node lets users connect to custom MCP servers. Under the hood, it uses `@modelcontextprotocol/sdk`'s `StdioClientTransport` to spawn the server as a child process. The Flowise team was already aware that "letting users define which local process to launch" is inherently dangerous, so they added a `validateMCPServerConfig` layer: only `node`, `npx`, `python`, `python3`, and `docker` are allowed as commands, with blacklist checks on arguments and environment variables. CVE-2026-73601 proves this defense is insufficient:

- Attackers can abuse the `PYTHONWARNINGS` and `BROWSER` environment variables — neither on the dangerous-variable blocklist — in combination to trigger arbitrary command execution when a `python3` process starts;
- An alternative path exploits the fact that `StdioClientTransport` launches child processes with a working directory fixed at `/`, combined with the `node` command reading `/proc/self/environ`, bypassing the check designed to block absolute-path file access, then injecting executable code by overwriting the `HOME` environment variable.

The common root cause across both paths is that the validation logic stops at "is the command name on the whitelist" and "can we block known dangerous arguments," without addressing indirect execution paths that emerge from the combination of command + environment variables + working directory. This is the structural weakness of deny-list (blacklist) input validation: it catches known attack techniques but cannot anticipate the next combination no one has thought of yet. And this is not the first time Flowise has stumbled on the same pattern in the same feature: CVE-2025-59528 (`Function()` dynamic evaluation), CVE-2025-71336 (`x-request-from: internal` bypass for unauthenticated access), and CVE-2026-40933 (another command injection path) all hit the Custom MCP/MCP-related code. CVE-2026-73601 is the fourth public RCE report against this attack surface.

Mapped to the OWASP LLM Top 10, this falls under **LLM06 Excessive Agency** (the Custom MCP node is granted the ability to "launch arbitrary local processes," far exceeding the minimum privilege needed to "connect to an external tool") combined with a variant of **LLM05 Supply Chain Vulnerabilities** — user-controllable MCP server configuration is essentially untrusted input fed directly into the execution layer. This also echoes OX Security's systematic research on "MCP STDIO Command Injection" published earlier this year: whenever a platform allows users to define the command/args/env for a stdio-type MCP server, this class of vulnerability is a predictable, recurring problem — not a one-off implementation oversight.

## Defensive Measures

**Immediate Actions**
- Check your Flowise version: confirm whether it is < 3.1.3 (`docker exec <container> npm ls flowise` or check the image tag used for deployment); upgrade immediately if below 3.1.3
- If upgrading is not immediately possible, switch the `CUSTOM_MCP_PROTOCOL` environment variable from `stdio` to `sse` — this is the officially recommended safer default and shuts down the entire attack path
- Inventory all Flowise instances with Custom MCP nodes enabled, prioritizing network-reachable deployments (especially those with management interfaces accessible from the internet)

**Long-term Architecture**
- Do not use deny-list validation on user-controllable command/args/env — blacklists can only block known techniques; whitelisting the entire MCP server definition (not just the command name) is the sustainable approach
- Run Custom MCP and any "user-defined stdio child process" features inside an isolated sandbox or container, restricting filesystem access and outbound connections (egress allowlist), so that even a validation bypass does not yield host-level execution privileges
- Adopt tools from watchlist B7 focused on MCP/Agent runtime governance (such as **Invariant Labs**' MCP scanning and visibility tools, **Lasso Security**'s Agent runtime monitoring) to detect anomalous MCP tool call patterns, covering the detection gap during the window when "patches are always one step behind"

## Impact Assessment

Flowise is a widely popular open-source low-code AI Agent/workflow builder, commonly deployed in enterprise development environments or customer-facing services; its technology was also acquired and integrated by Workday. With four independent CVEs against the Custom MCP feature in the past year, the message is clear: the attack surface of "letting users define stdio MCP servers" deserves far more scrutiny than any single bug — each patch precisely plugs the previously reported technique, but as long as the attack surface (user-controllable command/args/env combinations) is not fundamentally reduced, a fifth bypass would not be surprising. Public information does not indicate this vulnerability was exploited in the wild before disclosure; it was reported through coordinated disclosure and patched before public release. If your Agent system has any feature that allows users to define the launch command for stdio-type MCP servers (not limited to Flowise), both bypass paths disclosed here are worth auditing against your own validation logic for the same deny-list pattern.

## Takeaway

Previous security alerts have mostly covered "platform X has vulnerability Y," but the Flowise Custom MCP attack surface producing four independent CVEs in one year makes the cognitive gap much sharper: when a feature's essence is "let users define what process to launch on the host, with what arguments and environment variables," patch-by-patch deny-list fixes are destined to be a race of who discovers the next environment variable combination first — not a genuine closure of risk. When evaluating the MCP integration security of any Agent platform, the question worth asking is not "has this known vulnerability been patched" but rather "has the attack surface itself been reduced, or did they just add another entry to the blacklist."

## References

- [Flowise RCE via Custom MCP Config Node — GitHub Security Advisory GHSA-g98q-rm45-q9h8](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)
- [CVE Record: CVE-2026-73601 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-73601)
- [Flowise before 3.1.3 Remote Code Execution via Custom MCP — VulnCheck Advisory](https://www.vulncheck.com/advisories/flowise-before-remote-code-execution-via-custom-mcp)
- [CVE-2026-73601: Flowise Remote Code Execution via Custom MCP Node — Halo Security](https://cve.halosecurity.com/cve-advisory/cve-2026-73601-flowise-remote-code-execution-via-custom-mcp-node)
- [MCP Supply Chain Advisory: RCE Vulnerabilities Across the AI Ecosystem — OX Security](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/)
