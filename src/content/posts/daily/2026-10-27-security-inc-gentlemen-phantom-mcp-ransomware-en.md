---
title: "Security Alert | INC/Gentlemen Ransomware Expose a Complete AI Co-Operator Record — 8,257 Messages, 32 MCP Servers, 62 Victim Organizations"
date: 2026-10-27
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "SOCRadar tracked down seven exposed C2 servers and fully reconstructed the AI operations infrastructure shared by INC and Gentlemen ransomware affiliates: OpenCode plus a Phantom framework wired to 32 MCP servers, spanning reconnaissance through extortion across 62 victim organizations."
tldr: "SOCRadar published a report on October 20 revealing that a shared operator behind the INC and Gentlemen ransomware brands exposed seven servers through an OPSEC failure. Inside: 8,257 AI chat messages across 133 OpenCode sessions, a custom Phantom autonomous red-team framework wired to 32 MCP servers, 46 pre-packaged INC encryptor builds, and complete case files for 62 victim organizations. The operators gained mass access through edge-device CVEs — FortiClient EMS (CVE-2026-35616), SimpleHelp (CVE-2024-57727), and cPanel (CVE-2026-41940) — then let AI plan reconnaissance, generate commands, triage stolen data, and draft extortion letters under a strict 'human approves every step' model. Defense: audit any internet-facing EMS/RMM/VPN management interface, and treat MCP tool-execution surfaces like `exec_in_session` as a high-risk channel that needs access control and audit logging, not just a developer convenience."
series:
  name: "AI Security Alert"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-10-27-security-inc-gentlemen-phantom-mcp-ransomware)

## Incident Overview

Threat intelligence firm SOCRadar's Threat Research Unit (STRU) published a report on October 20, 2026 describing how it traced a single exposed command-and-control server with an open directory (`45.227.254[.]43`) to six more servers, fully reconstructing how a shared operator behind **INC Ransomware** and **The Gentlemen Ransomware** ran AI through the entire intrusion lifecycle. The exposed material included 8,257 AI chat messages across 133 OpenCode sessions, the source and binaries for a self-built "autonomous red-team kill chain framework" called Phantom, a toolkit wired to 32 MCP servers, 46 INC encryptor builds already customized and packaged for six victims, and complete case files for 62 victim organizations. This is the most detailed public reconstruction yet of how AI agents are actually operated inside a real ransomware campaign — and the evidence goes well beyond a single anecdote, because the operators' own AI session memory became the forensic trail that let defenders rebuild the whole attack chain.

**Key Facts**

| Field | Value |
|---|---|
| Incident type | AI agents operated across the full ransomware kill chain (recon → intrusion → lateral movement → extortion), chained together through MCP tools |
| Scope | 62 named victim organizations (36 in the US); industrial/manufacturing/energy (16.1%) and healthcare/pharma (14.5%) hit hardest; initial access concentrated on FortiClient EMS, SimpleHelp, and cPanel edge devices |
| Severity | Critical |
| CVE | CVE-2026-35616 (FortiClient EMS auth bypass), CVE-2024-57727 (SimpleHelp path traversal), CVE-2026-41940 (cPanel/WHM auth bypass) |
| Sources | [SOCRadar's original report](https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/), [hackread.com](https://hackread.com/inc-the-gentlemen-ransomware-affiliates-ai-messages/) |

## Attack Surface Analysis

```diagram
title: Timeline of the AI co-operation exposed by SOCRadar
desc: From the OPSEC failure that exposed the servers, to the encryptors actually landing, to the full report going public — a 25-day span.
caption: Time is measured from 2026-09-25 (when STRU discovered the exposure) as T+0. The report also notes related Ghost C2 deployment activity dating back to mid-July 2026, which falls outside this chart's scale and is not plotted to scale.
---
<svg viewBox="0 0 640 220">
  <path class="dg-axis" d="M40 124H600"/>
  <path class="dg-axis" d="M64 124V130M234 124V130M404 124V130"/>
  <text class="dg-small" x="64" y="144" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="234" y="144" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="404" y="144" text-anchor="middle" dominant-baseline="central">20</text>
  <text class="dg-small" x="618" y="124" dominant-baseline="central">days</text>

  <g>
    <line class="dg-rule" x1="64" y1="76" x2="64" y2="118"/>
    <circle class="dg-dot" cx="64" cy="124" r="4"/>
    <text class="dg-label" x="64" y="40" text-anchor="middle" dominant-baseline="central">OPSEC failure exposes servers</text>
    <text class="dg-sub" x="64" y="62" text-anchor="middle" dominant-baseline="central">09-25・all 7 servers found</text>
  </g>
  <g>
    <line class="dg-rule" x1="158" y1="130" x2="158" y2="172"/>
    <circle class="dg-dot" cx="158" cy="124" r="4"/>
    <text class="dg-label" x="158" y="186" text-anchor="middle" dominant-baseline="central">Encryptors packed, live hit confirmed</text>
    <text class="dg-sub" x="158" y="208" text-anchor="middle" dominant-baseline="central">09-30/10-01・46 INC builds staged</text>
  </g>
  <g>
    <line class="dg-rule" x1="489" y1="76" x2="489" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="489" cy="124" r="6"/>
    <text class="dg-label" x="489" y="40" text-anchor="middle" dominant-baseline="central">SOCRadar publishes report</text>
    <text class="dg-sub" x="489" y="62" text-anchor="middle" dominant-baseline="central">10-20・62 victims exposed</text>
  </g>
</svg>
```

The exposed operation breaks down into three layers worth looking at separately.

**Layer one is the entry point.** The operators used no novel technique at all — just known edge-device CVEs exploited at scale. Their own knowledge base records show they scanned 2,236 targets, created 108 admin accounts, and touched 4,140 managed endpoints through FortiClient EMS (CVE-2026-35616); scanned 4,922 SimpleHelp servers and extracted 427 admin passwords across 242 distinct IPs (CVE-2024-57727); and claimed to breach 49-plus small hosting providers through cPanel/WHM (CVE-2026-41940), using those providers as a springboard into the mail and web servers they host. These numbers come from the attackers' own records — SOCRadar explicitly flags them as "not independently verified" — but the scale alone makes the point: edge devices remain the cheapest way in.

**Layer two is how AI got wired into the whole chain.** The operators used OpenCode, an AI coding interface, as their operations console, connected to commercial models hosted on OpenRouter (Claude Opus 4.6, Kimi K3 — nothing underground), plus a homebrew "WormGPT" persona prompt and a persistent knowledge base. What actually turned the AI into something that could act was **Phantom** — a modular framework with 18 skill modules, its own routing engine, and an autopilot orchestrator — which used 32 MCP servers to wire the AI into every tool from reconnaissance to ransom negotiation, including a dedicated "ransom-ops" server for pricing and negotiation. The report uses the term "exec_in_session" to describe this operational abuse of an MCP tool-execution surface: the AI wasn't sitting on the sidelines offering advice — it was directly calling through MCP to run reconnaissance commands, triage stolen credentials, and draft extortion letters.

**Layer three is why a human stayed in the loop.** The 8,257 messages show that every case opened with a victim-specific master prompt, and the AI waited for operator approval before every step; one instruction spelled it out: "coordinate every action with me." More tellingly, when a commercial model refused a request, the operator's response wasn't to switch to an uncensored model — it was to rewrite the request as an "Authorized Red Team Assessment Request" template, talking its way past the safety guardrail rather than bypassing the model itself. That means "WormGPT" was just marketing dressed over a persona prompt; what ran underneath was an ordinary commercial LLM the whole time — the chokepoint for guardrail bypass was never on the model provider's side, it was in how the application layer packaged the request.

Mapped to the OWASP LLM Top 10, this is a textbook case of **LLM06: Excessive Agency**: wiring 32 MCP servers into an AI goes far beyond what "writing code" requires — direct command execution, operating penetration tools, drafting extortion documents — and "a human approves every step" flips from a safety control into a liability shield in a criminal context: the operator knew exactly what they were doing, and the AI just automated the reconnaissance, triage, and drafting work that used to take the most human hours, at a much faster pace. This also echoes CloudSEK's early-October disclosure of a separate Gentlemen affiliate, Azazel, who registered a reverse shell as an MCP tool inside an AI coding assistant to drive attacks directly. Both incidents point at the same pattern: **once an MCP tool-execution surface is wired to a tool with real system access, the security boundary is no longer the model's conversational guardrail — it's who can register a tool, and what that tool can do.**

## Defense

**Immediate actions**
- Audit any internet-facing FortiClient EMS, SimpleHelp, or cPanel/WHM management interface: confirm patches for CVE-2026-35616, CVE-2024-57727, and CVE-2026-41940 are applied, remove direct network exposure of management interfaces, and check EMS for unknown admin accounts or tampered VPN connection scripts
- Inventory which AI coding assistants inside your organization (OpenCode, Claude Code, Cursor, etc.) have MCP servers configured, and verify the actual permission scope of every MCP tool one by one — any tool that can run shell commands, open a reverse connection, or access credentials should never be wired up without access control and audit logging
- If any MSP/RMM platform (SimpleHelp, MeshCentral, N-central, etc.) serves external customers, enforce MFA and IP allowlisting, and require upstream MSPs to apply the same controls — in this incident, a stolen MSP technician credential was equivalent to unlocking every client that technician managed
- Make backups immutable or air-gapped, and isolate and patch backup consoles like Veeam — the records show the operators routinely stopped backup and database services and deleted shadow copies before encrypting

**Long-term architecture**
- Treat "who can register an MCP tool inside the enterprise, and what can that tool do" as a formal governance question, not something left to individual dev teams to decide on their own; the watchlist's Netzilo, which focuses on cross-platform agent runtime governance including a kill switch, is built around exactly this: unapproved MCP servers simply can't get wired in
- Add behavioral monitoring for internal AI agent usage patterns; the watchlist's Zenity, which focuses on enterprise agent behavior monitoring, is aimed at exactly this gap — catching anomalous tool-call patterns (a burst of scan-style commands, a reverse-shell tool getting registered) outside normal development use
- The biggest irony here is that the operators' own AI memory became the evidence trail against them. Defenders can flip that same property around: keeping complete, centrally-audited tool-call logs on a legitimate agent platform means that if an internal account is hijacked to run an agent, anomalous MCP call patterns will surface faster than traditional endpoint logs would catch it

## Impact

SOCRadar's grading shows that among the 62 named organizations, 4 reached public extortion (L5), 4 reached encryption or extortion stage (L4), 14 suffered domain-level compromise (L3), 28 had only a foothold (L2), and 12 were still at the reconnaissance stage (L1). The 46 packaged INC encryptors map to six victims and were originally scheduled for deployment on October 1, 2026 — a chat log confirms the timing with "tomorrow at 6 Moscow time, right?" — and a September 30 SimpleHelp screenshot confirms at least one victim's workstation was actually encrypted, though the report doesn't confirm whether all six attempts landed. For any team already running AI coding assistants with MCP servers in day-to-day development, the lesson here isn't "AI can turn evil on its own" — it's that once MCP wires an AI into a tool with real destructive power, that tool behaves like any other privileged access: if it's compromised, the damage scales with the tool's permission scope, and enterprises are usually slower than attackers to realize just how far that scope reaches.

## Takeaway

Previous reporting on "AI being used in ransomware" mostly stopped at single-episode incidents — like the lone affiliate CloudSEK exposed in early October registering a reverse shell through MCP. SOCRadar's 8,257 messages are the first time we get to see what "AI as co-operator" actually looks like in a real criminal operation — not an autonomous sci-fi intrusion, but a fairly conservative operating model: a human approves every step, and AI handles automating the reconnaissance, triage, and drafting work that used to eat the most human hours. What surprised me most is that "WormGPT" was just a persona prompt — the underlying models were all ordinary commercial LLMs the whole time. That means the moment a guardrail gets bypassed, the problem was never on the model vendor's side — it's how the application layer packages the request. That's a warning for any team wiring tool permissions into an agent: the guardrail isn't there to stop a "malicious model," it's there to stop a "maliciously packaged request" — and the latter can always be retried with different phrasing.

## References

- [INC and The Gentlemen Ransomware: Exposed AI Infrastructure - SOCRadar](https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/)
- [INC and The Gentlemen Ransomware Affiliates Expose 8,257 AI Messages - hackread.com](https://hackread.com/inc-the-gentlemen-ransomware-affiliates-ai-messages/)
- [Caught in 4K: The Gentlemen Files - CloudSEK](https://www.cloudsek.com/blog/caught-in-4k-the-gentlemen-files)
- [MITRE ATT&CK G1032 (GOLD IONIC / INC Ransomware)](https://attack.mitre.org/groups/G1032/)
- [SimpleHelp Path Traversal CVE-2024-57727 - NVD](https://nvd.nist.gov/vuln/detail/cve-2024-57727)
- [FortiClient EMS Vulnerability CVE-2026-35616 - NVD](https://nvd.nist.gov/vuln/detail/cve-2026-35616)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk/llm06-excessive-agency/)
