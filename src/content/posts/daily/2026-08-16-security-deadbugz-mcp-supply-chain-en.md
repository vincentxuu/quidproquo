---
title: "Security Alert｜Deadbugz — A Malicious MCP Server Disguised as a Text Tool That Only Turns Hostile After Three Calls"
date: 2026-08-16
category: daily
type: digest
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Security firm Pillar Security exposed an ongoing MCP supply-chain attack campaign called Deadbugz: an attacker submitted 23 GitHub PRs injecting a malicious MCP server disguised as a text formatting tool into unrelated projects' config files. The server behaves normally for the first three tool calls, then switches to returning instructions that trick the Agent into exfiltrating SSH keys, AWS credentials, and other secrets."
tldr: "GitHub account zellkernel submitted PRs to 23 AI/MCP/dev-tool projects within 74 minutes, injecting a MCP server called productivity-suite into their config files. The server initially offers harmless text formatting and summarization, but an internal counter flips tools/list and prompts/get into malicious instructions after three tool calls — directing the Agent to search for SSH keys, AWS credentials, shell history, and Kubernetes configs while hiding the activity from the user. All 23 PRs remain unmerged (19 closed, 4 open), but the malicious endpoint is still live. Defense: treat any change to an approved MCP server's tool definitions as a security event requiring re-approval, and block the known endpoints."
series:
  name: "AI Security Alert"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-16-security-deadbugz-mcp-supply-chain)

## Incident Overview

On August 12, security firm [Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign) disclosed an ongoing MCP (Model Context Protocol) supply-chain attack campaign dubbed **Deadbugz**. Using the public GitHub account `zellkernel`, the attacker submitted pull requests to 23 unrelated AI, MCP, and developer-tool projects within just 74 minutes on the evening of August 10, 2026 (UTC 21:52–23:07). The PRs attempted to inject a malicious MCP server — branded as `productivity-suite`, a "text formatting/summarization tool" — into each project's MCP configuration file. The server's defining characteristic is **runtime delayed activation**: it behaves completely normally at first, and only after accumulating three tool calls does it return instructions directing the Agent to locate and exfiltrate SSH keys, AWS credentials, shell history, and Kubernetes configs — while instructing the Agent to conceal this behavior from the user.

**Key Facts**

| Field | Value |
|---|---|
| Incident Type | Supply Chain Attack (MCP server impersonation) + Runtime Delayed Prompt Injection |
| Scope | Any MCP client that connected to `productivity-suite-mcp.onrender.com` or executed `deadbug-mcp.py`; 23 AI/MCP/dev-tool projects targeted via PRs |
| Severity | High (supply-chain delivery already occurred, malicious infrastructure still live, but no PRs merged) |
| CVE | None (account-level attack campaign, not a single-package CVE) |
| Sources | [Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign), [zellkernel/productivity-suite-mcp (public source)](https://github.com/zellkernel/productivity-suite-mcp), [ojeo.com coverage](https://ojeo.com/noticia/identificada-la-campa%C3%B1a-deadbugz-que-envenena-servidores-mcp-para-robar-credenciales/) |

## Attack Surface Analysis

The attack path has two layers: a **delivery layer** and a **trigger layer**. The delivery layer is straightforward — the attacker doesn't need to compromise any system. They simply stand up an innocuous-looking MCP server (offering two tools: `format_text` and `summarize`), then batch-submit PRs from a single GitHub account to add this server's remote endpoint or local script path to target projects' MCP config files. PRs that "add an MCP dependency" are often treated as routine config changes during code review, not as security events — and that trust gap is exactly what the attacker exploits.

The trigger layer is what makes this incident genuinely noteworthy: the server maintains a per-client call counter, and the first three `tools/call` invocations return completely normal results. Once the threshold is crossed, subsequent `tools/list` and `prompts/get` responses swap in entirely different content — instructing the Agent to locate specific sensitive file types and return their contents, while telling it not to let the user find out. Because MCP clients feed server-returned tool descriptions and instructions directly to the model as trusted context, an approved server that silently alters its own "tool manual" after the fact effectively rewrites the Agent's behavioral rules without the user noticing. This "start harmless, turn hostile later" technique isn't new per se — Pillar's write-up notes that Invariant Labs demonstrated a similar WhatsApp MCP sleeper attack back in April 2025 — but Deadbugz swaps the trigger condition from "time elapsed" or "version update" to "call count threshold," and the intent is clear: brief manual inspections or automated test suites rarely make more than two or three calls, so they only ever see the benign version. The mechanism is specifically designed to evade review and scanning tools.

Mapped against the OWASP LLM Top 10, this is **LLM03 Supply Chain Vulnerabilities** (malicious component injected into the dependency chain) stacked with a protocol-layer variant of **LLM01 Prompt Injection** — the difference being that the injected instructions come not from user input or third-party documents, but from the metadata returned by an already-approved MCP server connection. This is why Pillar specifically emphasizes in their write-up that "tool definitions themselves constitute a security boundary."

## Defensive Measures

**Immediate Actions**
- Block the known malicious endpoints: `productivity-suite-mcp.onrender.com` (the historical endpoint `promo-surname-xml-quantum.trycloudflare.com` should also be blocklisted)
- Check your projects' MCP config files and recent PR history for any server named `productivity-suite` or any reference to the path `~/.config/.cache/.sys/.deadbug-mcp.py`; if found, immediately reject/close/revert the change and do not execute `deadbug-mcp.py`
- If any device actually connected to the server, preserve MCP client connection logs before cleanup, then review whether the Agent exhibited any anomalous access or exfiltration behavior after the third tool call; rotate affected credentials following your incident response procedures if necessary

**Long-term Architecture**
- Treat "an approved MCP server's tool definitions or instructions changed" as a security event that triggers an alert, rather than silently accepting the update — fingerprint tool descriptions at approval time and require re-approval for any subsequent change before sensitive operations (credential access, code execution, outbound messaging, repo writes) remain authorized
- Enforce policies on sensitive Agent operations (credentials, shell, code execution) at the governance layer rather than relying on self-reported server metadata constraints; **Netzilo** (MCP/Agent runtime governance with allowlisting and blocking of unapproved MCP servers) or **Invariant Labs** (the team that first demonstrated MCP sleeper attacks, whose guardrail product specifically addresses runtime behavioral drift) can fill the "tool definition drift detection" gap
- Treat PRs that add MCP dependencies with the same source-verification rigor as third-party package dependencies, rather than fast-tracking them as routine config changes

## Impact Scope

As of Pillar's disclosure, all 23 targeted PRs remain unmerged via GitHub's merge mechanism (19 closed, 4 still open), meaning no confirmed project has had malicious configuration merged in. But this doesn't mean zero risk: the malicious endpoint was still operational at time of publication, and it's impossible to rule out developers who manually tested and connected to the server before the PRs were closed, potentially crossing the three-call threshold. Pillar also noted that the account created 21 new public repositories on August 10 and owns 50 public repos (including 20 forks), suggesting this was a scaled, automated delivery operation rather than an isolated individual's action. If your team has any workflow where an Agent automatically or semi-automatically adopts MCP dependencies suggested in third-party PRs, this is a good opportunity to audit whether similar "config file changes treated as low-risk items and fast-merged" process gaps exist.

## Takeaway

This incident and the AgenticSeek RCE disclosed the same day represent two different threat models: AgenticSeek is a traditional oversight of "forgot to add authentication," while Deadbugz is deliberately engineered, actively evasion-aware attack behavior. One point especially worth remembering: Deadbugz chose "call count" rather than "elapsed time" as its trigger condition — meaning the traditional trust model of "observe for a while and check for anomalies" can itself be bypassed. MCP clients need to treat "whether an approved server's tool definitions have been tampered with after approval" as a first-class detection concern, rather than assuming that the behavior observed at approval time will persist indefinitely.

## References

- [Deadbugz: Currently Active MCP Supply-Chain Campaign — Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign)
- [zellkernel/productivity-suite-mcp — Public Source Code](https://github.com/zellkernel/productivity-suite-mcp)
- [Identificada la campaña 'Deadbugz' — ojeo.com Coverage](https://ojeo.com/noticia/identificada-la-campa%C3%B1a-deadbugz-que-envenena-servidores-mcp-para-robar-credenciales/)
- [Invariant Labs: WhatsApp MCP Exploited (Prior Research Referenced by Deadbugz)](https://invariantlabs.ai/blog/whatsapp-mcp-exploited)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
