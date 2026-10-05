---
title: "Security Alert | GlassWorm Returns: Fake VS Code Themes on Marketplace and Open VSX Turn Dev Machines into AI Agent Credential Leaks"
date: 2026-10-06
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Socket.dev uncovered a cluster of malicious VS Code theme extensions linked to GlassWorm, spanning the Visual Studio Marketplace and Open VSX, with at least two confirmed malicious versions and tens of thousands of downloads — an attack surface that reaches straight into developers' AI coding agent credentials."
tldr: "Socket Threat Research found six VS Code theme extensions tied to a GlassWorm-associated cluster (Coca-Cola Christmas, Aurora Borealis Studio Theme, Cosmic Nebula Themes, and others). Two are confirmed malicious — Aurora Nocturne Night Theme and Cosmic Nebula Themes — with the latter's loader sharing the same Solana dead-drop address, AES key, and execution model as GlassWorm, the campaign CrowdStrike, Google, and Shadowserver disrupted together in May. The two confirmed malicious versions have more than 8,000 combined Marketplace installs, with cluster-linked Open VSX listings adding tens of thousands more downloads. Defense: inventory installed theme extensions and match IOCs now; longer term, scan extension runtime behavior (file access, network calls, process launches) instead of trusting the source repository alone."
series:
  name: "AI Security Alert"
  order: 47
---

> 🌏 [中文版](/posts/daily/2026-10-06-security-glassworm-vscode-theme-supply-chain)

## What happened

Socket.dev's threat research team published a report on October 2 describing an ongoing cluster of malicious VS Code theme extensions distributed across both the Visual Studio Marketplace and the Open VSX Registry. Every extension in the cluster advertises itself as a simple color theme, but at least two versions — "Aurora Nocturne Night Theme," once published under the `microsoftvs.microsoftvs` identity to impersonate Microsoft, and "Cosmic Nebula Themes" — hide a loader that downloads and runs attacker-controlled code. The technical fingerprint of the latter matches GlassWorm, the supply-chain campaign that CrowdStrike, Google, and the Shadowserver Foundation jointly disrupted this past May. Anyone who installs these themes is a potential victim, and developer machines are exactly where AI coding agents — Copilot, Cursor, Claude Code — keep their API keys and cloud credentials.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Supply chain attack (IDE extension impersonation / brandjacking) |
| Scope | Developers who installed Aurora Nocturne Night Theme, Cosmic Nebula Themes, or other cluster-linked VS Code themes; cluster-linked extensions have tens of thousands of combined downloads |
| Severity | High |
| CVE | None (malware identification, not a software vulnerability) |
| Sources | [Socket.dev original research](https://socket.dev/blog/glassworm-vscode-themes), [Cyber Security News](https://cybersecuritynews.com/glassworm-supply-chain-attack), [GBHackers](https://gbhackers.com/glassworm-supply-chain), [Cyber Press](https://cyberpress.org/container-image-scanning-by-use-case) |

## Attack surface

The operation starts with brandjacking and name-squatting to earn a developer's first glance of trust: `Coca-Cola Christmas` borrows one of the world's most recognizable brand names outright, and `Aurora Borealis Studio Theme` mimics an existing legitimate theme of nearly the same name, both presented and described like any ordinary color theme. Socket also traced a December 14, 2025 DEV Community article — published by an account created the very same day — that promotes several of these extensions as "independent recommendations" and funnels readers toward installing them from Open VSX. Socket assesses it as the campaign's own promotional infrastructure rather than a genuine third-party review.

Technically, the malicious themes violate the basic assumption that "a theme only changes how things look." VS Code's extension permission model has no fine-grained controls: once an extension activates (`activationEvents: ["*"]`), it gets a full Node.js runtime — `require`, `fs`, `child_process`, and even the sandbox built with `vm.createContext` still exposes `require`, `Buffer`, and `process` to whatever code is fetched remotely. `Cosmic Nebula Themes`' `app.js` decrypts an embedded JavaScript stage with AES-256-CBC and runs it immediately through `eval()`, using Solana blockchain transaction memos as a dead-drop to dynamically resolve the next download location. That means the operators can rotate infrastructure at will without republishing the extension, and without leaving behind a single fixed IP or domain that defenders can block outright. The loader also checks for Russian-language and timezone settings and exits early — a common "avoid the home turf" anti-analysis trick.

Mapped to the OWASP LLM Top 10, the root cause sits squarely in **LLM05 Supply Chain Vulnerabilities**: developers trust Marketplace review and the public source repository, but Socket found that the published `app.js` doesn't match what's in the public repo at all — inspecting GitHub alone reveals nothing. Layered on top is something close to **LLM06 Excessive Agency**: VS Code's extension execution model is effectively "full permissions, no sandbox," so a color theme can do exactly what a full Node.js program can. And sitting right there on the same unisolated machine are the API keys, `.env` files, and cloud credentials that Claude Code, Cursor, and GitHub Copilot all depend on — all within easy reach the moment malicious code lands.

## Defense

**Immediate actions**
- Inventory personal and shared team environments for Aurora Nocturne Night Theme (`microsoftvs.microsoftvs`), Cosmic Nebula Themes (`cosmic-themes.theme-cosmic-nebula`), or any of the cluster-linked extensions named above, and remove them immediately if found
- If either confirmed malicious version was ever installed: check for `%TEMP%\temp_batch.cmd` and any connections to `fingercakes4sale[.]store`. Either hit means treat the host as compromised and rotate every AI agent API key on that machine (ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.), along with Git/SSH credentials and cloud access keys
- Re-review the execution privileges "theme" extensions actually require — a color theme has no legitimate need for network access or process execution, and any that do should be treated as high-risk and removed on sight

**Long-term architecture**
- Build continuous runtime scanning for installed extensions — checking `package.json` activation events, bundled JavaScript, network calls, and process invocations against what the extension actually claims to do — rather than a one-time install-time review. GlassWorm's playbook is exactly this: ship a clean version to pass review, then add the malicious logic later through runtime decryption
- Borrow the model Protect AI's huntr platform applies to continuous scanning of the AI/ML package ecosystem, and extend supply-chain security scanning to developer tooling ecosystems like IDE extensions and MCP servers, not just direct npm/PyPI dependencies
- Stop treating a public source repository as a guarantee that "what's published matches what's in the repo." Add a repo-vs-published-artifact diff check to CI/CD to catch exactly this kind of gap — a clean-looking repository hiding malicious code in what actually ships

## Impact

Of the two confirmed malicious versions, `Aurora Nocturne Night Theme` and `Aurora Borealis Studio Theme` together passed 8,000 Visual Studio Marketplace installs, while cluster-linked Open VSX listings (including roughly 10,000 for `Charcoal Mint` alone) add tens of thousands more downloads. How many of those installs actually resulted in compromise can't be inferred from download counts alone — Socket explicitly says the totals "do not establish how many users were compromised." Microsoft removed the reported Marketplace extensions quickly after Socket's disclosure, but a Marketplace takedown doesn't clean up malicious code already running on machines that installed it, or recover credentials already stolen — the same lesson repeated across many prior npm/PyPI supply-chain incidents.

For any team running AI coding agents on developer machines, the real takeaway is that the IDE extension ecosystem faces the exact same trust-model weakness as the MCP server and npm package ecosystems — and developer machines are where AI agent credentials concentrate the most. If a team's AI agent governance only covers an MCP server allowlist and never touches the IDE extension layer, this attack surface stays wide open.

## Today's takeaway

This incident reinforces a specific lesson: a clean public repository says nothing about what's actually installed. Socket's analysis repeatedly stresses that reading `Cosmic Nebula Themes`' GitHub source reveals nothing about its real malicious behavior, because the decryption and execution both happen at runtime. That shifts the center of gravity for security review from "audit the source code" to "diff the published artifact against the source repo" — a gap that teams focused only on auditing MCP server tool definitions, while rarely inspecting what IDE extensions actually execute, are prone to miss.

## References

- [GlassWorm Supply Chain Attack Hides Malware Inside VS Code Color Themes — Socket.dev](https://socket.dev/blog/glassworm-vscode-themes)
- [GlassWorm Supply Chain Attack Uses Fake VS Code Themes to Deliver Hidden Malware — Cyber Security News](https://cybersecuritynews.com/glassworm-supply-chain-attack)
- [GlassWorm Supply Chain Attack Hides Malware Inside VS Code Color Themes — GBHackers](https://gbhackers.com/glassworm-supply-chain)
- [Malicious VS Code Themes Hide GlassWorm Malware Targeting Developers — Cyber Press](https://cyberpress.org/container-image-scanning-by-use-case)
- [Inside CrowdStrike's Takedown of a Developer-Targeting Botnet — CrowdStrike](https://www.crowdstrike.com/en-us/blog/inside-crowdstrike-takedown-of-a-developer-targeting-botnet)
