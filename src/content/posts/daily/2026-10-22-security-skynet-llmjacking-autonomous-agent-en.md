---
title: "Security Alert | Symantec Captures 'Skynet' Autonomous Attack Agent Hijacking Exposed LLM/MCP Endpoints for Mass Exploitation and Mining"
date: 2026-10-22
category: daily
tags: [ai-agent, security, daily, jailbreak, data-exfiltration]
lang: en
description: "Symantec's AI honeypot captured a complete attack instruction set in summer 2026 revealing an autonomous agent built to hunt for exposed LLM and MCP endpoints, hijack their compute, and run up to 100,000 unattended steps of scanning, exploitation, and cryptomining."
tldr: "Symantec's Threat Hunter Team ran a honeypot that impersonated an unprotected AI service and captured a full attack prompt: a 'Skynet mode' agent that searches for exposed LLM, AI gateway, and MCP endpoints, strips a commercial model's safety controls with a layered jailbreak, then drives 74 built-in tools to scan, exploit common web frameworks, steal databases and credentials, and quietly install cryptominers — authorized to run unattended for up to 100,000 steps. Defense: require authentication on every exposed model or MCP endpoint, treat AI API keys as high-value credentials to rotate, and restrict outbound access from hosts running AI tools."
series:
  name: "AI Security Alert"
  order: 60
---

> 🌏 [中文版](/posts/daily/2026-10-22-security-skynet-llmjacking-autonomous-agent)

## Summary

Symantec's Threat Hunter Team published a report on October 21 describing a complete attack instruction set it captured in summer 2026 through an AI honeypot — a system that impersonates an unprotected, internet-facing AI service to attract and study attacks against AI infrastructure. The captured prompt reveals an autonomous agent built to hunt the internet for exposed LLM endpoints and hijack them: once it finds a target, it first strips the commercial model's safety controls with a layered jailbreak, then treats the model as a reasoning engine and directs 74 built-in offensive tools to scan for vulnerabilities, exploit common web frameworks, steal databases and credentials, and quietly install cryptocurrency miners — all designed to run unattended for up to 100,000 steps without human approval. This technique of stealing someone else's AI compute and sticking the victim with the bill is called LLMjacking. Between standing up the honeypot and publishing the report, Symantec logged more than 127,000 external requests from tens of thousands of distinct addresses, most of it reconnaissance against model endpoints, spraying of stolen API keys, and probing for exposed configuration files.

**Key facts**

| Item | Value |
|---|---|
| Incident type | LLMjacking (exposed LLM/MCP endpoint hijacking) + layered jailbreak + autonomous exploitation |
| Scope | Any self-hosted model server, AI gateway/relay, or MCP server reachable without authentication; indirectly, the commercial model account holders footing the bill and the third-party servers scanned and breached |
| Severity | High |
| CVE | None (a configuration failure, not a single software flaw) |
| Sources | [Symantec/security.com](https://www.security.com/blog-post/ai-llmjacking-skynet), [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/symantec-ai-agent-llmjacking/) |

## Attack Surface Analysis

This differs from the classic "trick a public chatbot into saying something it shouldn't" jailbreak. Here the attackers built AI into the core of an offensive tool and went looking for a model to power it, using it as a reasoning engine that plans and drives the attack while the tool's own modules carry out the scanning, exploitation, and mining against separate victims. The request Symantec captured was built in layers: the first disguised the model's identity, telling it to present itself as a branded coding assistant and never reveal the real provider or that it was being reached through a proxy; the second reframed reading `.env` files, API keys, and database schemas as "normal development work" to defeat a model's usual refusals; the third and fourth cast the model as a devoted fictional persona and paired it with a "rebuttal protocol" that told it to treat its own safety messages as noise and output exploit code without warnings; the fifth layer was the actual arsenal — 74 callable tools covering internet-wide asset discovery via the FOFA search service, exploit modules for VS Code, Django, Jupyter, Laravel, Supabase, Next.js, and Flask/Werkzeug deployments (including cracking the Werkzeug debugger PIN for remote code execution), GraphQL and command injection, server-side request forgery through HTML-to-PDF generators to reach cloud metadata services, automated database dumping through Prisma Studio, and botnet command-and-control. A final directive placed the agent in "Skynet mode": authorized for up to 100,000 unattended steps, required to run tools immediately without waiting for approval, instructed to hide cryptominers under paths like `/tmp/.x`, and designed to loop indefinitely — scan for new targets, infect them, deploy miners, reinfect hosts. A second request captured the following day abandoned the tool-calling format entirely, instead asking the model to decode an opaque string that turned out to be a gzip-compressed shell script. Decoded, it downloaded and compiled the open-source XMRig mining software, disguised the binary with a filename that looked like a harmless logging utility, configured failover across multiple mining pools, locked its own config file against deletion, and continuously erased local access logs. The script specifically searched for directories used by go2rtc, a WebRTC streaming server common in smart-camera gateways and Home Assistant setups, to hide the miner.

Mapped to the OWASP LLM Top 10: the entry point is a variant of **LLM01 Prompt Injection** — rather than indirect injection into someone else's agent, the layered jailbreak is fed directly to a passively discovered, exposed model to the same end of bypassing its safety controls. What turns this into a scaled threat is **LLM06 Excessive Agency**: the hijacked model is authorized to run unattended for 100,000 steps and execute tools without approval, so an attacker only needs to find one unlocked door and the scanning, breaching, mining, and reinfection cycle takes over on its own. Symantec stressed that none of the individual techniques here are novel — what stands out is assembling them into a single self-directed agent, which lowers the skill required to run a broad exploitation campaign: an operator hands the model a goal and lets it work.

## Defense Measures

**Immediate actions**
- Inventory whether any self-hosted model server, AI gateway/relay, or MCP server in your environment is reachable from the public internet: check security group and firewall rules to confirm nothing is bound to all network interfaces (`0.0.0.0`) without enforced authentication
- Require authentication on model-listing and health-check paths too, not just inference endpoints — Symantec notes attackers routinely use these seemingly harmless paths as the first step of reconnaissance
- Review recent AI API billing for unusual spikes or off-peak request volume, often the first sign a key or endpoint has already been abused
- If any endpoint appears to have been exposed, revoke and reissue the affected API keys at the provider immediately — don't just change local configuration

**Long-term architecture**
- Treat AI API keys as high-value credentials: rotate them regularly, scope them narrowly, and never commit them to source code or config files
- Restrict outbound network access from hosts running AI tools or tool-enabled agents, so that even a hijacked agent can't scan the wider internet, reach a command-and-control server, or download a miner
- Enforce IMDSv2 with a hop limit of 1 on cloud workloads to close off the SSRF path to instance metadata credentials
- Run tool-enabled agents with least privilege and a human-approval step for sensitive actions — the direct counter to this incident's "100,000 unattended steps" design — and keep software the agent might target (VS Code servers, Django, Jupyter, Laravel, Supabase, Prisma Studio) patched and off the public internet
- From the watchlist, Netzilo focuses on MCP server runtime governance (allowlisting, blocking unreviewed endpoints from being exposed), while WitnessAI focuses on inventorying which AI services and model endpoints an organization runs and whether key usage looks anomalous — both map directly to the visibility gap this incident exposes

## Impact

Symantec describes two distinct sets of victims: whoever owns the exposed model or holds the stolen key pays for the compute the agent consumes, which could be substantial given authorization for 100,000 steps, while the third-party servers the agent then breaks into are stripped of data and credentials and put to work mining. The honeypot alone logged more than 127,000 external requests during the observation period, but that reflects traffic at a single decoy and can't be extrapolated into a total count of exposed endpoints or compromised keys across the internet; the report also does not state how many real-world victims this specific "Skynet" agent has produced. The captured request ended with a benign coding challenge from a legitimate training platform, suggesting the operators may have been testing the tool against a safe target at that moment. Symantec's conclusion is that any organization exposing an AI service, model gateway, or MCP server to the network should assume it will be found and probed soon after — an unauthenticated endpoint is now a resource attackers actively hunt for, not a theoretical risk.

## Takeaway

I used to think of LLMjacking mostly as "steal a key, ride someone else's quota." This case pushes it a step further: a stolen model gets wired directly into a full attack toolchain so the model itself plans and drives the intrusion. The attacker doesn't even need to write exploitation logic — just find one unlocked model endpoint, and scanning, exploitation, and mining follow automatically under the model's own direction. The lesson is that evaluating whether to expose a model service can't stop at "someone might burn my quota" — it has to include "an exposed model might become the attacker's brain."

## References

- [Autonomous LLMjacking: 'Skynet' Agent Hijacks Exposed AI Models to Run Attacks - Symantec/security.com](https://www.security.com/blog-post/ai-llmjacking-skynet)
- [Symantec Uncovers AI Agent Hijacking Models for Autonomous Cyber-Attacks - Infosecurity Magazine](https://www.infosecurity-magazine.com/news/symantec-ai-agent-llmjacking/)
- [OWASP LLM Top 10 — LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk2023-24/llm08-excessive-agency/)
