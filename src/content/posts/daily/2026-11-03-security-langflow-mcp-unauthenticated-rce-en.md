---
title: "AI Security Alert: Two Unauthenticated Critical Flaws in Langflow's MCP Endpoint — IBM Says the Same Path Reaches RCE"
date: 2026-11-03
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "IBM disclosed two CVSS 9.8 unauthenticated flaws in Langflow OSS on Oct 28: CVE-2026-93680 (auth bypass) and CVE-2026-110186, which IBM says lets the same MCP tool-enumeration path reach arbitrary code execution. A public Metasploit module already exists; only 1.13.0 fixes it."
tldr: "IBM disclosed on October 28 that every release of Langflow OSS from 1.0.0 through 1.12.8 carries two CVSS 9.8 unauthenticated flaws. CVE-2026-93680 lets anyone open an MCP session and list a server's tools with no account at all; IBM says the same path (CVE-2026-110186) can be extended to arbitrary code execution. Rapid7 has already published a Metasploit module that demonstrates the tool-enumeration step, but no public PoC for full RCE has surfaced yet. The only fix is upgrading to 1.13.0 (released October 22) — there is no workaround."
series:
  name: "AI Security Alert"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-11-03-security-langflow-mcp-unauthenticated-rce)

## Summary

IBM published a security bulletin on October 28 (updated the next day) stating that every release of Langflow OSS — the open-source platform for building AI agents and workflows — from 1.0.0 through 1.12.8 carries two CVSS 9.8 unauthenticated flaws: CVE-2026-93680, an authentication bypass, and CVE-2026-110186, arbitrary code execution. Neither requires any account to trigger over the network. The entry point is Langflow's exposed Model Context Protocol (MCP) endpoint: an attacker with no credentials at all can open an MCP session and list every tool the server exposes. IBM's bulletin states that the same path can be extended into full unauthenticated remote code execution. Rapid7 has already published a Metasploit module that demonstrates the "list tools with no credentials" step — but the module itself doesn't run any commands, and no public data has shown a complete RCE demonstration yet. The only fix is upgrading to 1.13.0, released October 22; IBM explicitly says there is no interim workaround.

**At a glance**

| Item | Detail |
|---|---|
| Incident type | Unauthenticated access → MCP tool enumeration → arbitrary code execution |
| Scope | Langflow OSS 1.0.0–1.12.8 (all versions); public Metasploit module tested on 1.8.4, scoped by its author to 1.5.0–1.11.4 |
| Severity | Critical (CVE-2026-93680 and CVE-2026-110186 both CVSS 9.8; also CVE-2026-110193 at 8.8 for low-privilege accounts and CVE-2026-110192 at 6.5) |
| CVE | CVE-2026-93680, CVE-2026-110186, CVE-2026-110193, CVE-2026-110192 |
| Fixed in | Langflow OSS ≥ 1.13.0 (no workaround) |
| Sources | [IBM Security Bulletin](https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2), [The Hacker News](https://thehackernews.com/2026/11/critical-langflow-flaws-could-let.html), [Aviatrix Threat Research](https://aviatrix.ai/threat-research-center/critical-langflow-flaws-unauthenticated-rce-cve-2026-93680-cve-2026-110186-2026), [Tuskira](https://www.tuskira.ai/advisories/cve-2026-93680) |

## Attack surface analysis

The four CVEs are four facets of the same exposed surface. CVE-2026-93680 (CWE-287, Improper Authentication) lets an attacker with no account reach the `/api/v1/mcp/sse` SSE endpoint and open an MCP session — this is exactly what Rapid7's Metasploit module does: connect without credentials, establish a session, and enumerate the server's tools and metadata. That step is already public and reproducible. IBM's bulletin pushes the chain one step further: CVE-2026-110186 (CWE-94, Improper Control of Generation of Code) describes the same MCP tool-enumeration flow being extended into unauthenticated arbitrary code execution. But public data — including that same Metasploit module — stops at enumeration; no public PoC for the full RCE step has appeared yet. Two other, account-gated flaws round out the bulletin: CVE-2026-110193 (CVSS 8.8) lets a low-privileged account make Langflow's Agentic Assistant generate and submit component code that runs OS commands on the server, and CVE-2026-110192 (CVSS 6.5) is an information disclosure from insufficiently protected credentials. Compounding all of this is `LANGFLOW_AUTO_LOGIN`, a setting enabled by default in 1.12.8 that logs anyone who connects in as a superuser with no password at all — IBM describes one of the flaws as "an incomplete remediation of an auto-login security control." Version 1.13.0 turns that default off.

```diagram
title: Langflow MCP endpoint unauthenticated attack chain (CVE-2026-93680 → CVE-2026-110186)
desc: An unauthenticated attacker opens an MCP session on Langflow to list its tools; IBM's bulletin says the same path can be extended to server-side arbitrary code execution
caption: Steps 1-4 are already demonstrated by a public Metasploit module; steps 5-6 describe the extended risk IBM's bulletin documents, with no public full PoC yet
step: The attacker sends a GET request to /api/v1/mcp/sse with no credentials at all
step: Langflow responds 200 and opens an MCP session (CVE-2026-93680: authentication bypass)
step: Using the session_id it just received, the attacker calls the MCP endpoint to list every available tool
step: Langflow returns the full tool list and server metadata
step: The attacker picks a tool and sends a call crafted to trigger code generation
step: Langflow locally executes the attacker-controlled command (CVE-2026-110186: IBM says this path can reach unauthenticated RCE; no public full demonstration has surfaced yet)
---
<svg viewBox="0 0 640 440">
  <line class="dg-rule" x1="140" y1="72" x2="140" y2="420"/>
  <line class="dg-rule" x1="500" y1="72" x2="500" y2="420"/>

  <g data-step="1">
    <path class="dg-line" d="M144 120H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="108" text-anchor="middle" dominant-baseline="central">GET /mcp/sse</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M496 168H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="156" text-anchor="middle" dominant-baseline="central">session opened</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M144 216H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="204" text-anchor="middle" dominant-baseline="central">list tools</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--dashed" d="M496 264H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="252" text-anchor="middle" dominant-baseline="central">tools returned</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M144 312H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="300" text-anchor="middle" dominant-baseline="central">call tool</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent" d="M504 360H532Q540 360 540 368V376Q540 384 532 384H508" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="552" y="372" dominant-baseline="central">run code</text>
  </g>

  <rect class="dg-box" x="496" y="108" width="8" height="288" rx="2" data-step="1 2 3 4 5 6"/>

  <rect class="dg-box" x="60" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="140" y="40" text-anchor="middle" dominant-baseline="central">Attacker</text>
  <text class="dg-sub" x="140" y="60" text-anchor="middle" dominant-baseline="central">no account</text>

  <rect class="dg-box" x="420" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">Langflow</text>
  <text class="dg-sub" x="500" y="60" text-anchor="middle" dominant-baseline="central">MCP endpoint</text>
</svg>
```

Mapped to the OWASP LLM Top 10: the CVE-2026-93680 / CVE-2026-110186 chain falls under **LLM07 Insecure Plugin Design** — MCP tools are effectively plugins, and the endpoint can be enumerated and invoked with no verification at all. CVE-2026-110193, where the Agentic Assistant generates code that runs OS commands on its own, falls under **LLM08 Excessive Agency** — the agent was granted more execution power than its task actually required.

## Defensive guidance

**Immediate actions**
- Check your deployed Langflow version: `pip show langflow`, or check the Docker image tag — anything from 1.0.0 through 1.12.8 is affected
- Upgrade immediately to `langflow==1.13.0` (PyPI) or `langflowai/langflow:1.13.0` (Docker). Back up the database, secret key, and uploaded files first; if you use `LANGFLOW_AUTO_LOGIN`, prepare your existing account for password sign-in per the official upgrade guide before upgrading. If you can't sign in afterward, don't delete and reinstall — the documentation warns this permanently wipes your flows
- Until you can upgrade, the only mitigation is network-level: put Langflow behind a VPN or SSO, block inbound access to port 7860 and `/api/v1/mcp/` at the edge, and confirm `LANGFLOW_AUTO_LOGIN` hasn't been left on by accident — none of this is a fix, only exposure reduction

**Long-term architecture**
- MCP servers shouldn't be reachable from any network-accessible source by default. Audit whether other internal services also expose MCP endpoints with no authentication in front of them — this root cause isn't unique to Langflow; it's a common exposure pattern for MCP interfaces generally
- Consider a cross-platform agent runtime governance tool like Netzilo to set allowlists and access boundaries around any service that exposes an MCP endpoint, rather than relying on each service to authenticate itself correctly
- Audit "auto-login" or "dev mode" style settings on agent platforms to confirm they haven't been carried into production by default — these settings usually exist for local development convenience and get shipped unchanged to cloud deployments

## Impact

IBM's bulletin doesn't estimate how many Langflow deployments are affected, but the flaw set spans every release from the platform's first stable version to its most recent — meaning any deployment that hasn't upgraded to 1.13.0 is exposed. As of CISA's Known Exploited Vulnerabilities (KEV) catalog update on October 30, none of these CVEs are listed yet — unlike another Langflow flaw this series covered on October 15, CVE-2026-105740, where a honeypot had already logged over 1,600 attack attempts by the time it was reported. There's no public evidence of in-the-wild exploitation for this set yet. But the Metasploit module is already public, which means the bar for scanning and initial exploitation is already low, and Langflow's repeated appearances on CISA's KEV list over the past several months show the platform is a persistent target. If you're running any version of Langflow and it's connected to a corporate network or exposed externally, upgrading now should be the top priority.

## Today's takeaway

This incident sharpened something about the attack surface MCP itself introduces: a traditional unauthenticated API endpoint typically leaks data or enables denial of service, but an MCP endpoint leaks "everything this server can do for you" — a complete tool catalog that doubles as a map for further attacks. The fact that CVE-2026-93680 and CVE-2026-110186 were split into two separate CVEs is also a reminder that the same MCP exposure can simultaneously be an information-disclosure bug and a code-execution bug with very different severities — auditing this kind of flaw shouldn't underestimate its real ceiling just because the public PoC only reaches the enumeration step.

## References

- [IBM Security Bulletin — Langflow OSS is affected by multiple vulnerabilities](https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2)
- [The Hacker News — Critical Langflow Flaws Could Let Unauthenticated Attackers Run Code on Servers](https://thehackernews.com/2026/11/critical-langflow-flaws-could-let.html)
- [Aviatrix Threat Research — Two Critical Unauthenticated RCE Flaws in Langflow Put AI Agent Infrastructure at Immediate Risk](https://aviatrix.ai/threat-research-center/critical-langflow-flaws-unauthenticated-rce-cve-2026-93680-cve-2026-110186-2026)
- [Tuskira — CVE-2026-93680 Langflow: is it reachable in your environment?](https://www.tuskira.ai/advisories/cve-2026-93680)
- [Rescana — Langflow OSS CVE-2026-93680 and CVE-2026-110186: Two Unauthenticated Critical Flaws](https://www.rescana.com/post/langflow-oss-cve-2026-93680-110186-unauthenticated-critical-prepare-now)
- [Rapid7 Metasploit Framework — langflow_auth_bypass_cve_2026_93680 module](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/gather/langflow_auth_bypass_cve_2026_93680.rb)
- [CVE Record — CVE-2026-93680](https://www.cve.org/CVERecord?id=CVE-2026-93680)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
