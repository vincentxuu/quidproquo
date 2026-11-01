---
title: "AI Security Alert: Trojanized Claude Code Extension on Cursor Marketplace Planted SSH Backdoors"
date: 2026-10-31
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Cursor's VS Code extension marketplace distributed a backdoored Anthropic.claude-code 2.1.313 on October 29, exposing up to 5,000 users to an attempted SSH backdoor"
tldr: "Attackers published a tampered build of the official anthropic.claude-code extension — version 2.1.313 — under its legitimate publisher ID on the Cursor Marketplace, inserting a roughly 66-line malicious loader ahead of the real extension code. The payload planted an SSH key, tried to open a reverse tunnel, and beaconed host details home, but a coding bug in the malware broke the SSH-enable step on most macOS and Windows hosts. Cursor pulled the package, took the attacker's server offline, and published remediation scripts; the real fix isn't trusting a matching publisher ID — it's hash-pinning extension versions and limiting what they can reach."
series:
  name: "AI Security Alert"
  order: 68
---

> 🌏 [中文版](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor)

## What happened

In the early hours of October 29, 2026 (2:27 a.m. to 1:35 p.m. Pacific, roughly 11 hours), Cursor's VS Code extension marketplace served a package under the legitimate identifier `anthropic.claude-code`, version 2.1.313 — but Anthropic never shipped it. Its `extension.js` had a roughly 66-line malicious loader spliced in ahead of the real extension code. That loader tried to plant an SSH backdoor on the victim's machine, open a reverse connection, and beacon host details to a server the attacker controlled. Cursor says at most 5,000 users installed or updated to this version during the exposure window.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Supply chain attack (IDE extension marketplace compromise) |
| Scope | Users who installed or updated `anthropic.claude-code` to 2.1.313 via the Cursor VS Code extension marketplace between 2:27 a.m.–1:35 p.m. PT on 2026-10-29 (the official builds on Open VSX and the Microsoft VS Code Marketplace were not affected) |
| Severity | High (assessment from security firm Rescana; no official CVE or CVSS score has been assigned) |
| CVE | None |
| Sources | [The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html), [BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-claude-code-extension-on-cursor-planted-ssh-backdoors/), [Cursor's official notice](https://cursor.com/blog/claude-code-extension-security-notice) |

## Attack surface analysis

The attackers didn't bother spoofing a lookalike package name. They published the tampered build under Anthropic's own extension identifier, `anthropic.claude-code`, sidestepping the one trust signal most users actually check — "does the publisher ID match." OpenSourceMalware co-founder Jenn Gile's analysis found the malicious code was a 66-line loader inserted at the very start of the legitimate `extension.js`, with the real extension's functionality left untouched. The loader runs automatically the moment the extension activates — no extra interaction required from the user.

```diagram
title: Attack chain — trojanized Claude Code extension on the Cursor Marketplace
desc: The attacker published a tampered build under a legitimate extension ID; the victim host installed it and planted an SSH key plus persistence locally, but the SSH-enable step failed on most hosts due to a bug in the malware
caption: Compiled from Cursor's official notice and analysis by OpenSourceMalware and Phorion
step: The attacker uses the legitimate anthropic.claude-code identifier to publish tampered version 2.1.313 on the Cursor Marketplace
step: A user installs or auto-updates to this version via the Cursor Marketplace
step: The victim host loads the 66-line malicious loader spliced into extension.js
step: The loader plants the attacker's SSH key on the victim host and sets up a LaunchAgent / scheduled task for persistence
step: The victim host tries to enable local SSH and open a reverse tunnel, but a bug in the code makes this fail on most macOS/Windows hosts
step: The victim host still beacons host details to the attacker's server over HTTP POST
---
<svg viewBox="0 0 760 480">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="452"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="452"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="452"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">publish v2.1.313</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M320 176H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="164" text-anchor="middle" dominant-baseline="central">install / update</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M548 232H576Q584 232 584 240V248Q584 256 576 256H552" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="596" y="244" text-anchor="start" dominant-baseline="central">load malware</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M548 296H576Q584 296 584 304V312Q584 320 576 320H552" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="596" y="308" text-anchor="start" dominant-baseline="central">add key + persist</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M540 360H100" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="432" y="348" text-anchor="middle" dominant-baseline="central">try reverse tunnel</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--dashed" d="M540 416H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="404" text-anchor="middle" dominant-baseline="central">beacon host info</text>
  </g>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Attacker</text>
  <rect class="dg-box" x="220" y="24" width="200" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Cursor Marketplace</text>
  <rect class="dg-box dg-box--accent" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Victim host</text>
</svg>
```

Once loaded, the payload worked in three layers. First it collected host and environment data: hostname, username, OS and architecture, home and working directories, the global Git email (`git config --global user.email`), the public IP, and the names (not values) of up to 40 environment variables matching KEY, TOKEN, SECRET, PASS, AWS, or GCP. Next it wrote the attacker's SSH public key — labeled `svc-telemetry` to look harmless — into `~/.ssh/authorized_keys`, and tried to enable the local SSH service and open a reverse tunnel to `134.209.82.225`. Finally it set up persistence: a macOS LaunchAgent (`com.apple.sysmond`), or on Windows a scheduled task named `SysMon` (attempting to run as SYSTEM, with a Startup-script fallback), retrying the tunnel connection roughly every 60 seconds and POSTing host details in cleartext HTTP to `134.209.82.225:8099/beacon`.

Per Cursor's own analysis and a teardown by security research firm Phorion, actually enabling local SSH requires admin rights the malware doesn't have on most hosts, and the code has bugs that make the step fail outright: on macOS, it checks the SSH service's status with `systemsetup -getremotelogin` without elevated privileges, which returns a permissions error rather than "Off" — so the activation branch never runs; on Windows, it tries to drive PowerShell through `/bin/sh`, a Unix shell that doesn't exist on a standard Windows install, so that path fails too. Either way, the SSH key, the persistence mechanism, and the host-info beacon still complete successfully.

This maps to **OWASP LLM Top 10: LLM05 Supply Chain Vulnerabilities**. The attack surface here isn't the model or a prompt — it's the distribution channel for an AI coding agent. An IDE extension runs with the user's full privileges, and once the publishing pipeline for a marketplace itself is breached, "the extension ID matches the legitimate publisher" — the one signal most users can actually check — stops meaning anything. The Hacker News also noted this happened a little over a week after attackers tampered with release binaries of OVHcloud's official CLI (which we [covered here](/posts/daily/2026-10-06-security-glassworm-vscode-theme-supply-chain) under the GlassWorm operation) — a sign that developer tooling's publishing pipelines keep being a live target.

## Defense

**Immediate actions**
- Check whether you're affected: on macOS, run `grep -qs svc-telemetry ~/.ssh/authorized_keys`; on Windows, check in PowerShell whether `$HOME\.ssh\authorized_keys` or `C:\ProgramData\ssh\administrators_authorized_keys` contains `svc-telemetry` (Cursor's notice has the full commands)
- If it's present, run Cursor's published [remediate-macos.sh](https://cursor.com/static/security/claude-code-extension/remediate-macos.sh) or [remediate-windows.ps1](https://cursor.com/static/security/claude-code-extension/remediate-windows.ps1) to remove the SSH key, the persistence mechanism, and any running tunnel process — uninstalling the extension alone isn't enough, since the payload drops standalone persistence scripts that keep running
- Decide whether affected hosts need to be rebuilt, and rotate any credentials or sessions reachable from them; environment-variable values weren't exfiltrated directly, but if the attacker gained access through the backdoor, they could still have been read later
- Pause auto-updates for Cursor Marketplace extensions and verify the VSIX SHA-256 hash against Cursor's published advisory before updating manually

**Longer-term architecture**
- Treat IDE extensions like any other software supply-chain dependency: pin versions, verify hashes, and don't rely on "the extension ID matches the publisher name" as the sole trust signal
- Consider AI/ML supply-chain scanning tools like Protect AI, extending coverage beyond models and packages to the extensions and tooling that AI coding agents themselves run on
- Apply least-privilege and network egress restrictions to environments running AI coding agents — for example, limiting the ability to open outbound SSH reverse tunnels — so that even a backdoored extension has a bounded blast radius

## Impact

Cursor says at most 5,000 users installed or updated to the malicious version during the roughly 11-hour exposure window, and the company says it will contact affected users directly. Because the local-SSH-enable step failed on most hosts, the share of users where the attacker actually gained remote access is likely far smaller than the exposure count — but the SSH key plant, the persistence mechanism, and the host-info beacon aren't limited by that bug, meaning those hosts still carry an attacker-usable artifact. Cursor has pulled the malicious version, rebuilt the marketplace, rotated its keys, and worked with the hosting provider to take the attacker's server at `134.209.82.225` offline, cutting off the reverse connection and the beacon channel; how the attacker obtained the publishing access needed to tamper with a package under this legitimate identifier remains publicly unexplained.

If your team uses the Claude Code extension through Cursor and has auto-update turned on, you were exposed during this window. Even if the SSH backdoor itself failed to activate on your platform, it's worth running through Cursor's checklist to confirm there's no leftover key or persistence entry — the traces this kind of attack leaves behind don't disappear just because the core payload malfunctioned.

## Today's takeaway

This incident breaks a common assumption: that a matching extension ID and publisher name means the content is trustworthy. In reality the publishing pipeline itself can be breached, and the one signal a user can actually verify — "the publisher ID is correct" — stops working entirely in that scenario. What actually stops this class of attack isn't trusting publisher identity, it's hash verification and behavioral monitoring at runtime — which is also why the payload's own bugs, breaking SSH activation on most platforms, ended up being the only line of defense that actually held.

## References

- [Official Claude Code Extension on Cursor Marketplace Trojanized with Persistent SSH Backdoor — The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html)
- [Malicious Claude Code extension on Cursor planted SSH backdoors — BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-claude-code-extension-on-cursor-planted-ssh-backdoors/)
- [Security notice — malicious version of Anthropic.claude-code (2.1.313) — Cursor](https://cursor.com/blog/claude-code-extension-security-notice)
- [Official Claude Code Extension Compromise: Security Advisory — Phorion](https://phorion.io/blog/offical-claude-code-vsx-compromise/)
- [Trojanized Claude Code extension plants persistent SSH backdoor — OpenSourceMalware](https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor)
