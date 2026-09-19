---
title: "Security Alert | Plugin4Shell — a Zero-Click Plugin Supply-Chain RCE Hits Claude Code, Codex, Copilot, and Gemini CLI"
date: 2026-09-20
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "AIR Security disclosed Plugin4Shell: a SHA-pinning bypass in the plugin systems of four major AI coding agents (Claude Code, Codex, GitHub Copilot, Gemini CLI) that lets an attacker silently swap an installed plugin for malicious code and achieve RCE with zero user interaction. GitHub Copilot remains unpatched."
tldr: "All four major AI coding agents check out the plugin commit their marketplace pinned, but none of them verify the checkout actually landed there — an attacker who controls the upstream repo can create a Git branch whose name collides with the pinned SHA, making the pin meaningless the next time the agent auto-updates the plugin in the background, for zero-click RCE. Claude Code (2.1.179) and Codex (0.146.0) are patched; GitHub Copilot has no fix yet; Gemini CLI won't be patched since it's being deprecated. The same research line previously found 925 already-hijacked plugins affecting 134,000 agents in the wild via a technique called SkillJacking, proving the underlying takeover step is not hypothetical."
series:
  name: "AI Security Alert"
  order: 33
---

> 🌏 [中文版](/posts/daily/2026-09-20-security-plugin4shell-ai-coding-agent-rce)

## What Happened

Security startup AIR Security recently published research disclosing a supply-chain vulnerability spanning four major AI coding agents — Claude Code, OpenAI Codex, GitHub Copilot, and Gemini CLI — which they named Plugin4Shell. It's the industry's first supply-chain flaw to target the plugin distribution layer rather than the model or the agent itself: all four agents pin an installed plugin to a reviewed Git commit, with the promise that whatever happens upstream afterward, users keep running the exact version that was reviewed. AIR found that every implementation only verifies that a checkout of the pinned commit was *attempted* — none of them verify that the working tree actually *landed* on that commit afterward. That gap lets an attacker neutralize the pin using an obscure Git edge case, and because Claude Code and Codex auto-update installed plugins in the background by default, the entire attack requires no user action at all. AIR had already laid the groundwork with two earlier pieces of research: one where they published a malicious skill of their own that went viral and seized control of over 26,000 agents, and a follow-up called SkillJacking that found 925 already-hijacked plugins still in active use, affecting 134,000 agents — proof that supply-chain takeovers here aren't theoretical, they're already happening in the wild.

**Key Facts**

| Item | Value |
|---|---|
| Type | Supply Chain Attack (plugin SHA-pinning bypass, zero-click RCE) |
| Scope | The plugin/marketplace installation mechanism of Claude Code, OpenAI Codex, GitHub Copilot, and Gemini CLI |
| Severity | Critical (zero-click, full RCE, all four major agents affected) |
| CVE | None assigned — AIR Security named it "Plugin4Shell" and coordinated fixes directly with vendors |
| Sources | [AIR Security original research](https://www.air.security/blog-posts/plugin4shell), [CSO Online](https://www.csoonline.com/article/4223909/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems-2.html), [Help Net Security](https://www.helpnetsecurity.com/2026/09/18/plugin4shell-ai-coding-agents-vulnerability/) |

## Attack Surface Analysis

There are two attack paths, and neither requires the attacker to control the marketplace itself. The first is "plant a benign plugin, then swap it": the attacker contributes a genuinely harmless plugin, gets it through review, and later alters the upstream repository so a later checkout pulls malicious code. The second is "hijack an existing plugin's repository": the attacker takes over the repo behind a plugin someone else wrote that the marketplace already trusts, then forces every installed copy to update to a malicious version on its next auto-update — a takeover step AIR's earlier SkillJacking research already demonstrated happens for real.

The technical core is a Git edge case. Claude Code, Codex, and GitHub Copilot all `git clone` the plugin repo and then `git checkout <40-hex pinned commit>`; Gemini CLI instead `git fetch`es the pinned commit and runs `git checkout FETCH_HEAD`. Once an attacker controls the upstream repo, they can create a branch whose name is exactly that 40-hex pinned value (or literally named `FETCH_HEAD`) and set it as the repository's default branch. When a name collides between a ref and a commit id, Git prefers the ref, printing only an easily-missed "refname is ambiguous" warning before checking out the malicious branch anyway. The agent reports a successful install at the pinned commit while the actual working tree holds attacker-controlled code. Because Claude Code and Codex re-run this same checkout logic in the background to refresh installed plugins, an attacker only needs the marketplace to bump the pin forward once (to a version that's itself still benign) before later swapping the branch that collides with the *new* pin — silently replacing an already-trusted, already-installed plugin with malware, with no install step, no prompt, nothing for the user to notice.

The root cause is a "verify the action happened, not the result" logic flaw. SHA pinning's whole security promise is that whatever lands in the working tree equals the exact commit that was reviewed, but none of the four agents ran a follow-up check — something as simple as `git rev-parse HEAD` compared against the pinned SHA — after the checkout. AIR points out this can only be fixed agent-side, since pin resolution happens entirely on the client; no amount of marketplace-side review can guarantee it. Against the OWASP LLM Top 10, this falls under **LLM05 Supply Chain Vulnerabilities** — an integrity-verification failure in the plugin distribution chain — layered on a classic software-supply-chain TOCTOU (time-of-check to time-of-use) bug: one version gets reviewed, a different version gets executed, and the gap between them is the vulnerability.

## Defense

**Immediate actions**
- Confirm Claude Code is at version 2.1.179+ and Codex is at 0.146.0+; both fix this issue
- GitHub Copilot has no official patch yet — if your team leans heavily on its plugin ecosystem, consider disabling plugin auto-updates temporarily and manually reviewing every plugin version change
- If you still run Gemini CLI, Google has confirmed no fix is coming since the product is being deprecated; plan a migration to Antigravity, which has no marketplace plugin SHA-pinning mechanism and isn't reachable by this attack
- Inventory every third-party agent plugin currently installed, and check whether any plugin's upstream repo is hosted on a platform that allows branch names shaped like 40-hex hashes (Bitbucket and self-hosted Git servers do; GitHub itself rejects such branch names, which is comparatively safer)

**Long-term architecture**
- Treat agent plugin/skill ecosystems as a formal software supply chain to govern, not an "install and forget" convenience layer; maintain an internal allowlist and periodically re-check whether an installed plugin's upstream repo ownership has changed
- Evaluate watchlist company Protect AI's AI supply-chain scanning capabilities for continuous monitoring of the source repos behind agent plugins/skills, to catch RepoJacking or maintainer-account takeovers early
- For any agent with access to source code, credentials, cloud resources, or CI/CD permissions, treat plugin trust as equivalent to the agent's own permission scope — a compromised plugin is effectively a compromised agent, not a minor add-on issue

## Impact

Plugin4Shell itself has no known in-the-wild exploitation case yet — AIR Security ran a responsible-disclosure process, coordinating fixes with all four vendors before publishing details. The timeline shows discovery in May 2026, disclosure in June, Claude Code patched mid-June, Codex patched in August, and the full public research report only landing in mid-September. But both halves of the attack chain have already been proven independently: AIR's earlier "Story of Skills" experiment showed a malicious plugin really can spread through a marketplace and seize tens of thousands of agents, and the SkillJacking research found 925 real, already-hijacked plugins affecting 134,000 agents. Plugin4Shell fills in the missing piece — even when a plugin is reviewed and pinned exactly the way the security model recommends, that safeguard itself can be silently defeated.

GitHub Copilot is currently the only one of the four with no patch timeline, which means any team still running Copilot's plugin ecosystem remains exposed until Microsoft ships a fix. If your team uses these agents to reach source code, credentials, cloud environments, or CI/CD tooling, and plugin installs go through a marketplace's trust chain, this event shows that following the officially recommended review process is not, by itself, a guarantee that the version you installed is the version that was reviewed.

## Today's Takeaway

What stands out most here is that SHA pinning — locking a dependency to a specific commit — is often treated as the final line of defense in software supply-chain security, but Plugin4Shell shows that a pin's trustworthiness depends entirely on who verifies the checkout's *result*, not on whether the pin value itself was written correctly. Four different companies, four different codebases, all made the same omission (verify the action, not the outcome) — and a design flaw that recurs identically across unrelated vendors is usually a sign of a shared blind spot in how the whole industry models the threat, not a one-off implementation slip.

## References

- [AIR Security: Plugin4Shell — Zero Click RCE Vulnerability found in top 4 most popular coding agents](https://www.air.security/blog-posts/plugin4shell)
- [CSO Online: A zero-click RCE flaw in AI coding agents could have exposed enterprise systems](https://www.csoonline.com/article/4223909/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems-2.html)
- [Help Net Security: Zero-click RCE vulnerability hit four major AI coding agents, two remain unpatched](https://www.helpnetsecurity.com/2026/09/18/plugin4shell-ai-coding-agents-vulnerability/)
- [InfoWorld: A zero-click RCE flaw in AI coding agents could have exposed enterprise systems](https://www.infoworld.com/article/4223907/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems.html)
- [Forkast: Plugin4Shell Bypasses SHA Pinning Across All Four Major AI Coding Agents](https://forkast.news/plugin4shell-bypasses-sha-pinning-across-all-four-major-ai-coding-agents/)
