---
title: "Security Alert | AI Memory Framework MemOS Hit by Supply Chain Attack — npm/PyPI Packages Shipped a Credential Stealer That Reads Your Prompts"
date: 2026-09-25
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "MemTensor's AI agent memory framework MemOS had its npm OpenClaw plugin and PyPI package compromised: malicious versions silently launch a Go credential stealer called sckit on agent startup and on every memory-recall event — and the npm version hands it the user's prompt text"
tldr: "Attackers stole MemTensor's GitHub Actions publish tokens and pushed malicious releases of the npm package @memtensor/memos-cloud-openclaw-plugin (0.1.21/0.1.23/0.1.25) and the PyPI package MemoryOS (2.0.34). The npm plugin launches a Go-based stealer called sckit when the OpenClaw agent gateway starts and again on every memory-recall event — passing the current user prompt to the malicious binary. The PyPI package triggers on a bare `import memos` via a hooked logging initializer. sckit harvests npm/PyPI/GitHub/GitLab/AWS/Vault/SSH credentials and exfiltrates to a C2 under skyleen[.]fr, with built-in code to re-publish itself into other packages and GitHub Actions workflows. Socket, StepSecurity, SafeDep, and Aikido independently confirmed the compromise. Fix: pin to a clean version, rotate every credential the affected host could reach, and block the C2 domain."
series:
  name: "AI Security Alert"
  order: 37
---

> 🌏 [中文版](/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain)

## Summary

MemOS, the open-source AI agent memory framework maintained by MemTensor, was hit by a supply chain attack on September 23, 2026. Attackers stole the project's own GitHub Actions publish tokens, then pushed malicious releases straight to the npm package `@memtensor/memos-cloud-openclaw-plugin` (the memory-access plugin for OpenClaw agents) and the PyPI package `MemoryOS`. Both bundled a cross-platform Go credential stealer named `sckit`, which launches automatically the moment the package loads — the npm version even forwards the current user prompt to the malicious binary. Four independent security firms — Socket, StepSecurity, SafeDep, and Aikido — analyzed and cross-confirmed the same compromise. The malicious versions have since been pulled from both registries, but before takedown, npm had one of them tagged `latest`, meaning a default install pulled the compromised build.

**Key facts**

| Item | Value |
|---|---|
| Incident type | AI agent supply chain attack (CI/CD publish-token theft + malicious package injection) |
| Scope | npm `@memtensor/memos-cloud-openclaw-plugin` 0.1.21/0.1.23/0.1.25; PyPI `MemoryOS` 2.0.34; any OpenClaw/Clawdbot/Moltbot agent environment, dev machine, or CI runner that loaded these versions |
| Severity | High (credential theft + user prompt exfiltration + self-propagation capability) |
| CVE | None (a compromised package release, not a traditional software flaw — no CVE has been assigned) |
| Sources | [The Hacker News](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html), [Socket](https://socket.dev/blog/memtensor-compromise), [StepSecurity](https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes), [SafeDep](https://safedep.io/memtensor-sckit-worm-npm-pypi/) |

## Attack Surface Analysis

The entry point wasn't a code flaw in the packages themselves — it was MemTensor's own release pipeline. SafeDep's analysis found that attackers pushed specific commits to MemTensor's GitHub repositories that caused the project's own release workflow to hand over its npm and PyPI publish tokens. With those tokens in hand, the attackers published three malicious npm releases (0.1.21, 0.1.23, 0.1.25) within a two-hour window on the morning of September 23, interleaving two decoy releases (0.1.22, 0.1.24) that changed nothing but the version string, before tagging the malicious 0.1.25 as `latest`. On PyPI, a single malicious release, 2.0.34, went up directly — ballooning from a normal 951 KB to 19 MB, the extra weight coming from six bundled `sckit` binaries covering Linux, macOS, and Windows on both x64 and arm64.

The trigger mechanism targets the AI agent's execution path itself, not just an install script. The npm plugin runs `sckit` once when the OpenClaw agent gateway starts, and again on **every memory-recall event** — this second run passes the current user prompt text to the malicious binary via the environment variable `SCKIT_EVENT_TEXT`. The PyPI package is more subtle: attackers hooked `configure_logging()` inside `memos/log.py`, a function that 149 modules in the package call at import time — so a bare `import memos` is enough to trigger the payload, with no explicit API call needed. sckit itself scans `$HOME` for credential files (`.npmrc`, `.vault-token`, `id_ecdsa`, `credentials.db`, and more) and environment variables that look like tokens or API keys, exfiltrating them to command-and-control servers under `skyleen[.]fr`. It also carries code to repackage itself into other npm and Python packages and GitHub Actions workflows — worm-like self-propagation potential. Mapped to the OWASP LLM Top 10, this incident hits both **LLM05 Supply Chain Vulnerabilities** (the release pipeline itself was compromised, not something a code review would have caught) and **LLM06 Excessive Agency** (an internal agent event — memory recall — was turned into an exfiltration trigger for user input, far beyond what a "memory plugin" should ever touch).

## Defense

The core lesson here: the AI agent supply chain attack surface now extends to the release pipeline itself. No amount of source-code review catches a malicious release if the CI/CD publish token can simply be stolen and used to push straight to `latest`. And because agent memory and tool plugins sit directly on the path that handles user input, a compromised plugin doesn't just leak credentials — it can leak the conversation itself.

**Immediate actions**
- Search every project's lockfiles (`package-lock.json`, `requirements.txt`, `poetry.lock`, `uv.lock`) and SBOMs for references to `@memtensor/memos-cloud-openclaw-plugin` (0.1.21/0.1.23/0.1.25) or `MemoryOS` (2.0.34)
- If any of those versions were installed, treat that host as compromised — including dev machines, CI runners, or containers that only ran tests. Kill any running `sckit` process and delete the package directories plus `~/.openclaw/.cache/runtime/` and `~/.memos/.cache/runtime/`
- Rotate every credential reachable from that host's environment: npm/PyPI tokens, GitHub/GitLab tokens, AWS keys, Vault tokens, SSH keys, Hugging Face/Slack/Stripe/SendGrid keys, and anything in `.env` files
- Search DNS/proxy/egress logs since September 23, 2026 for connections to `skyleen[.]fr` and its subdomains, and block them
- If the affected host held npm or PyPI publish tokens, check your own packages' recent releases for anything you didn't publish

**Long-term architecture**
- Treat CI/CD publish tokens as high-value assets in their own right: move to npm/PyPI's short-lived OIDC trusted publishing instead of long-lived tokens, so a stolen token can't be reused indefinitely
- For any agent memory or tool plugin that touches user input, make "can this plugin see prompt content" an explicit permission question at install time, not an assumed default
- Consider a supply-chain scanner from the watchlist, such as Protect AI, for ML/AI package dependencies, or agent-runtime governance from Netzilo to allowlist which agent plugins can load at all — so an unreviewed memory or tool plugin can't get loaded automatically

## Impact

Socket's analysis is explicit: any host that merely **loaded or imported** the malicious version should be treated as compromised — no active exploitation is required. That means exposure isn't limited to production environments actively using MemOS's memory features; it also covers CI jobs that installed the package just to run tests, or a developer machine that ran a plain `npm install`. The malicious releases have since been removed from both npm and PyPI, but exactly how the attackers obtained the GitHub Actions publish token — and whether it would have been visible to code review — is still under analysis by Socket. As of this writing, no public source has identified any package beyond MemTensor's own affected by the same compromise.

If your agent stack integrates MemOS, OpenClaw, Clawdbot, or Moltbot, or any third-party plugin that touches user prompts during a memory-recall event, this is worth an audit: are plugin updates pinned to a specific version, does your CI pull `latest` unconditionally, and if a plugin were compromised, does your architecture limit exposure to just credentials — or does it also expose the user's raw prompt content?

## Today's Takeaway

This incident welds together two things that are usually discussed separately: supply chain attacks and AI-agent-specific risk. The attackers didn't just pick a popular package at random — they picked a plugin sitting directly on the memory-recall path, so the malicious code could legitimately claim the user's prompt content as part of its "haul." The takeaway for evaluating agent-related dependencies: don't just ask whether a package has known vulnerabilities — ask what it can reach on the agent's execution path. Once the answer is "the user's own input," a supply chain compromise stops being just a credential leak.

## References

- [The Hacker News: Compromised MemTensor Packages Deliver sckit Credential Stealer via npm and PyPI](https://thehackernews.com/2026/09/compromised-memtensor-packages-deliver.html)
- [Socket: MemTensor npm and PyPI Packages Compromised in Credential-Stealing Supply Chain Attack](https://socket.dev/blog/memtensor-compromise)
- [StepSecurity: Sckit Supply Chain Worm Hits MemTensor npm & PyPI scopes](https://www.stepsecurity.io/blog/sckit-supply-chain-worm-hits-memtensor-npm-pypi-scopes)
- [SafeDep: MemTensor sckit worm on npm and PyPI](https://safedep.io/memtensor-sckit-worm-npm-pypi/)
