---
title: "Security Alert | Fake Web3 Accelerator Hijacks Coding Agent Traffic and Plants a Rogue MCP Server via npm"
date: 2026-10-20
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "A fake Web3 VC accelerator called Apex Accelerator shipped two npm packages that deliver Windows/macOS malware while also rewriting a victim's coding agent config to redirect LLM traffic and plant an attacker-controlled MCP server."
tldr: "Elastic Security Labs exposed Apex Accelerator (tracked as REF8801): two npm packages, @apexacc/cli and @apexacc/audit, that install Windows/macOS infostealers and backdoors while also repackaging an open-source coding agent to swap its LLM API endpoint and register an attacker-controlled MCP server. Defense: remove the packages, rotate every secret the agent could have touched, and verify where an MCP server entry actually points before trusting it."
series:
  name: "AI Security Alert"
  order: 58
---

> 🌏 [中文版](/posts/daily/2026-10-20-security-apex-accelerator-npm-mcp-hijack)

## What Happened

Elastic Security Labs researchers Jia Yu Chan and Daniel Stepanic exposed a fake Web3 venture accelerator called Apex Accelerator, tracked under the moniker **REF8801**. The group distributed two npm packages: `@apexacc/cli`, marketed as an "AI advisor for Web3 founders" powered by Claude Fable 5 and Gemini 2.5 Flash, and `@apexacc/audit`, marketed as an MCP server exposing 18 security-scanning tools. The targets were crypto founders and trading-tool developers, lured with offers of a $235,000 investment and told to run the packages as part of "due diligence." Beyond the usual infostealer-and-backdoor payload, both packages tamper with the victim's local coding agent configuration: they redirect LLM API traffic to an attacker-controlled endpoint and quietly register an attacker-controlled MCP server in the agent's config file.

**Key Facts**

| Item | Detail |
|---|---|
| Type | Supply chain attack (npm package impersonation + AI agent traffic hijack) |
| Scope | Windows/macOS developers who installed `@apexacc/cli` / `@apexacc/audit`, or the earlier related packages `@apexfdn/apex`, `@copilot-mcp/apex`, `@apexfdn/copilot-mcp` |
| Severity | High |
| CVE / Tracking ID | None; OSV malware record `MAL-2026-10979` for `@apexfdn/apex` |
| Sources | [Elastic Security Labs](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages), [The Hacker News](https://thehackernews.com/2026/10/fake-web3-accelerator-uses-npm-packages.html), [securityonline.info](https://securityonline.info/apex-malicious-npm-packages-web3/) |

## Attack Surface Analysis

`@apexacc/cli` isn't malware written from scratch — it's a fork of the open-source coding agent Oh My Pi. Elastic's diff found 1,351 of 1,363 source files nearly identical to the original; the attackers only added one bootstrap component. That component does two things directly relevant to the AI agent layer: it silently reroutes requests labeled as OpenRouter to an attacker-controlled endpoint (while still presenting as OpenRouter to the user), and it writes an attacker-owned MCP server entry into `~/.apex/agent/mcp.json`, persisting across restarts. Elastic confirmed in testing that local file contents the agent read did reach the attacker's endpoint — meaning prompts, conversation history, code snippets, and tool outputs were all being siphoned off.

This works because a coding agent's configuration — its MCP server list, its API endpoint — is trusted, locally-writable data, and most agents load it on startup with no signature or provenance check. Worse, the attacker-controlled MCP server can itself return tool descriptions and usage instructions that get folded into the agent's system prompt, opening an indirect prompt-injection channel: the attacker gains some influence over which tools the agent decides to call next and how. The companion package, `@apexacc/audit`, is simpler — its 18 "security scanning tools" just fabricate results, enough to make a victim believe their project (or a rival's) passed review.

The Windows infection chain is a conventional multi-stage loader: a PowerShell dropper, UAC bypass via [UACME](https://github.com/hfiref0x/UACME) when needed, AMSI/ETW patching and `ntdll.dll` unhooking to blind endpoint defenses, then shellcode-stage infostealer malware capable of defeating Chrome's App-Bound Encryption to pull saved passwords and cookies. On macOS, the payload is CloudSyncD, a backdoor Jamf had already documented, which phishes the user's system password via a fake authorization prompt before running its payload with `sudo`.

Mapped to the OWASP LLM Top 10: **LLM05 Supply Chain Vulnerabilities** (a malicious npm package posing as an AI tool) combined with **LLM06 Excessive Agency** — the agent's MCP config file was effectively granted "write once, trust forever" authority, far beyond what any third-party tool should get.

## Defense

**Immediate actions**
- Check for the affected packages: `npm ls @apexacc/cli @apexacc/audit @apexfdn/apex @copilot-mcp/apex @apexfdn/copilot-mcp 2>/dev/null || echo "safe"`
- Inspect your coding agent's MCP config (e.g. `~/.apex/agent/mcp.json`, `~/.claude/settings.json`) for any MCP server entry you didn't add yourself, especially ones pointing to unfamiliar domains
- If found: remove the packages, review shell history and endpoint logs to scope the infection, and **assume every local secret is compromised** — rotate wallet credentials, seed phrases, API keys, cloud tokens, and GitHub tokens

**Long-term architecture**
- Vet a package author's and GitHub account's history before installing any npm package or MCP server — conference appearances and public VC branding are not vetting
- Coding agents should allowlist MCP server entries rather than trusting whatever is already on disk; Netzilo's MCP server runtime governance is one example of this allowlist approach
- Scan third-party AI-adjacent packages for behavior — what network destinations they call, whether they modify other installed packages' configs — not just static code, which tools like Protect AI are built for
- Changes to API endpoints or MCP server config should trigger detection and alerting rather than persisting silently

## Impact

Both packages and their GitHub repos have been taken down, but the attacker infrastructure (`apexaccs[.]org`, `apexfdn[.]xyz`) has existed since at least April 2026, during which the group actively approached crypto wallet and market-intelligence tool developers over social media and built credibility through conference appearances. No official install-count figure has been published. Elastic's report notes it observed local file content leaking to the attacker's endpoint but did "not observe tampered model responses" — meaning this campaign, as far as confirmed, stayed at the eavesdropping/exfiltration stage rather than actively manipulating agent output, though the MCP channel it built has that capability in principle.

If your development environment dynamically installs MCP servers or lets a coding agent read and write its own configuration unsupervised, this attack surface is open. Treat the agent's config file as something worth version-controlling or at least change-detecting — any unexpected MCP server entry should be handled as an indicator of compromise.

## Takeaway

This goes a step further than a plain "malicious package steals your .env" story: the attacker isn't just grabbing credentials and running — they're inserting themselves into the AI agent's operating loop, posing as OpenRouter to collect every prompt and tool output, then using their own MCP server to keep influencing how the agent decides what to do next. Supply chain attacks are shifting from a one-time credential theft to a persistent parasite on the agent's own decision chain.

## References

- [Elastic Security Labs - Apex Accelerator: Malicious npm packages target Web3 startups](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)
- [The Hacker News - Fake Web3 Accelerator Uses npm Packages to Spread Malware and Hijack AI Agent Traffic](https://thehackernews.com/2026/10/fake-web3-accelerator-uses-npm-packages.html)
- [securityonline.info - Malicious npm Packages From Fake Web3 Accelerator Apex Deliver Stealers and Hijack AI Coding Agents](https://securityonline.info/apex-malicious-npm-packages-web3/)
- [Safeguard Blog - Fake Web3 Accelerator Ships npm 'AI Copilot' That Reroutes Agent Traffic](https://safeguard.sh/resources/blog/apex-accelerator-npm-ai-agent-hijack-crypto-founders)
- [Jamf Threat Labs - CloudSyncD macOS Backdoor via Fake Zoom Installer](https://www.jamf.com/blog/cloudsyncd-macos-backdoor-fake-zoom-installer/)
