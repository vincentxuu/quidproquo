---
title: "Security Alert | AI Agent Sandbox SDK Tensorlake Hit by Shai-Hulud Worm Supply Chain Attack"
date: 2026-10-10
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Tensorlake's official npm SDK for its AI agent sandbox service was hijacked to deliver a Shai-Hulud worm variant that steals GitHub/npm/AWS/Vault credentials and Claude/Cursor/Kiro configuration, then plants .claude/settings.json for persistence."
tldr: "Attackers altered the tensorlakeai/tensorlake main branch on 2026-10-07 and published malicious version 0.5.144. Its preinstall hook runs a Bun-based credential-stealing worm targeting GitHub, npm, AWS, Vault, SSH, and AI coding tool configs (Claude, Cursor, Kiro, Windsurf, Zed), then writes .claude/settings.json and .vscode/tasks.json to re-trigger when the project is reopened. Socket, Sonatype, StepSecurity, and Endor Labs independently confirmed the details; npm pulled the release. Defense: isolate the host and kill the 'hostage token' monitor first — revoking the stolen GitHub token before that wipes the home directory — then rotate every reachable credential."
series:
  name: "AI Security Alert"
  order: 50
---

> 🌏 [中文版](/posts/daily/2026-10-10-security-tensorlake-npm-shai-hulud-supply-chain)

## What happened

Tensorlake runs AI agent sandbox and serverless execution infrastructure, and its official TypeScript SDK, `tensorlake`, sees roughly 12,000 weekly npm downloads and more than 100,000 lifetime installs. In the early hours of October 7, 2026, attackers pushed malicious code to the `tensorlakeai/tensorlake` main branch under a maintainer's identity. A day later, the repository's own release workflow published the poisoned build as version `0.5.144` to npm. That release bundles a new Shai-Hulud worm variant that harvests credentials from developer machines and CI environments during installation, and it specifically goes after configuration and auth data for AI coding tools — Claude Code, Cursor, Kiro, Windsurf, and Zed. Socket, Sonatype, StepSecurity, Endor Labs, Aikido, and OX Security each analyzed the sample and converged on the same findings. npm has since pulled the version, and Tensorlake reverted the malicious commits in GitHub PR #1016.

**Key facts**

| Field | Value |
|---|---|
| Incident type | Supply chain attack (npm package tampering / self-propagating worm) |
| Scope | Dev machines, CI environments, and connected GitHub/cloud accounts that installed `tensorlake@0.5.144` |
| Severity | High |
| CVE | None (npm pulled the release directly; no CVE assigned) |
| Sources | [The Hacker News](https://thehackernews.com/2026/10/tensorlake-npm-package-compromised-to.html), [Sonatype](https://www.sonatype.com/blog/hijacked-tensorlake-npm-turned-install-into-credential-risk), [Endor Labs](https://www.endorlabs.com/learn/tensorlake-npm-package-compromised-by-shai-hulud-in-latest-software-supply-chain-attack), [Aikido](https://www.aikido.dev/blog/tensorlake-npm-package-compromised) |

## Attack surface

The attack chain has three steps. First, the attacker obtained maintainer-level push access to `tensorlakeai/tensorlake` (the exact method hasn't been disclosed, but leaked maintainer credentials or a publish token are the usual culprits) and pushed the malicious files straight to the main branch. Second, the same account manually triggered the repo's own `publish_npm.yaml` workflow, so the poisoned build shipped through the project's normal, properly signed release pipeline — leaving users with no provenance signal to flag as suspicious. Third, a `preinstall` hook in `package.json` runs before any application code even loads: `npm install` automatically executes `lib/setup.mjs`, which pulls in the Bun runtime to load an obfuscated ~856KB payload (`lib/Math_Symbol.js`). That payload harvests local files, CI environment variables, and Kubernetes/Vault secrets, exfiltrating over HTTPS first, falling back to an Ethereum contract to resolve a backup C2 address, and finally staging stolen data in a public GitHub repo if both fail.

What makes this one squarely an AI infrastructure incident is the target list: it explicitly names Claude, Cursor, Kiro, Windsurf, and Zed MCP configuration and auth files, and it writes `.claude/settings.json` and `.vscode/tasks.json` into any repository it can reach. That turns a one-time package compromise into a cross-tool persistence mechanism — the next time a victim opens that project in Claude Code or VS Code, the planted configuration can fire again. Mapped to the OWASP LLM Top 10, this is **LLM05 Supply Chain Vulnerabilities** (trusting a properly signed, normally published release instead of detecting anomalous behavior), compounded by **LLM06 Excessive Agency** — AI coding agents default to trusting whatever configuration sits in a project directory, turning the ordinary act of opening a project into an attack surface.

## Defenses

The order of operations matters most for immediate response. Multiple researchers flagged a "hostage token" mechanism: a PowerShell monitor repeatedly polls the stolen GitHub token, and if it detects the token has been revoked, it wipes the user's home directory. So never revoke credentials first — isolate the infected machine from the network, locate and kill that persistence monitor, confirm it's gone, and only then rotate credentials.

For the longer term, this incident reinforces that pinning versions beats trusting signatures: Endor Labs recommends blocking `0.5.144` outright, pinning back to the last known-clean `0.5.143`, and clearing any cached or lockfile references to the poisoned version so CI doesn't reinstall it. Beyond that, package installs should run through supply-chain scanning before install — tools like Socket, Sonatype, and Endor Labs can catch this class of payload pre-install — and teams should consider **Protect AI** from the watchlist for malicious-package detection purpose-built for AI/ML development toolchains. The compromised asset here is literally an AI agent sandbox SDK, so generic SCA tooling aimed only at application code tends to miss this AI-specific theft target list.

**Immediate actions**
- Check whether `tensorlake@0.5.144` was ever installed: `npm ls tensorlake 2>/dev/null`, and search lockfiles/package caches for leftover references to that version
- If it was installed: **isolate the machine from the network first**, find and remove the GitHub-token-polling persistence monitor, confirm removal, then rotate every reachable credential (npm, GitHub, AWS, Vault, SSH, cloud keys)
- Check any repository touched by the affected machine for planted `.claude/settings.json` or `.vscode/tasks.json` files, remove them, and audit git history
- Review GitHub account activity for an unfamiliar public repo named something like "Shai-Hulud: Here We Go Again"

**Longer-term architecture**
- Pin package installs to verified versions instead of floating tags, and run supply-chain scanners like Socket or Sonatype before `npm install`
- Consider adopting Protect AI for malicious-package and model supply-chain detection specific to AI/ML development toolchains
- Treat project-level configuration changes for AI coding agents (Claude Code, Cursor, etc.) as a sensitive event, and monitor for unexpected writes to `.claude/settings.json` or `.vscode/tasks.json` in CI or locally

## Impact

`tensorlake` has over 100,000 lifetime installs and roughly 12,000 weekly downloads, but every security firm that examined the code — including Sonatype, which did the deepest static review — explicitly states they have **not confirmed** that any stolen data was actually published or that any downstream system or repository was actually compromised further. What's confirmed is the malware's capability and design, not a verified scope of real-world damage. npm has pulled the version and Tensorlake reverted the malicious commits, but removing the package doesn't revoke any credentials it may have already read — anyone who installed it still needs to verify whether the hook actually ran.

If your team runs AI agent development workflows that dynamically pull in sandbox or tooling SDKs, this incident shows the attack surface has moved past "steal an API key" to "steal AI coding tool configuration and plant a persistent backdoor in your repository." It's worth auditing every CI pipeline that integrates an AI agent sandbox service to confirm package installs are version-pinned and run through supply-chain scanning.

## Today's takeaway

The notable part here isn't "another npm package got poisoned" — that attack chain is already routine in 2026 — it's that the attacker used `.claude/settings.json` as a cross-tool persistence vehicle. Stealing credentials is a one-time win, but writing into a file that AI coding agents automatically read turns the victim's own everyday habit — opening a project — into the switch that re-triggers the attack. That should shift how defense gets framed too: it's not enough to check "did this install go wrong," you also need to check "did something quietly drop a file into my repo that runs automatically the moment I open it."

## References

- [Tensorlake npm Package Compromised to Deliver Shai-Hulud Credential-Stealing Worm — The Hacker News](https://thehackernews.com/2026/10/tensorlake-npm-package-compromised-to.html)
- [Hijacked TensorLake npm Turned Install Into Credential Risk — Sonatype](https://www.sonatype.com/blog/hijacked-tensorlake-npm-turned-install-into-credential-risk)
- [Tensorlake npm package compromised by Shai-Hulud in latest software supply chain attack — Endor Labs](https://www.endorlabs.com/learn/tensorlake-npm-package-compromised-by-shai-hulud-in-latest-software-supply-chain-attack)
- [tensorlake NPM package compromised with Shai Hulud worm — Aikido](https://www.aikido.dev/blog/tensorlake-npm-package-compromised)
