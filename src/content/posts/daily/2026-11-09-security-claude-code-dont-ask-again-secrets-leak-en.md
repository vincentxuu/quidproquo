---
title: "Security Alert | Claude Code's \"Don't Ask Again\" Feature Writes Passwords and Keys Straight to Public GitHub Repos"
date: 2026-11-09
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "Apiiro research found that Claude Code's \"Yes, and don't ask again\" permission option saves an approved shell command verbatim into a project's .claude/settings.local.json — if the command contains a password or key, that secret gets committed to GitHub along with it. Researchers found 2,539 secrets across 1,994 public repos, affecting 63 organizations."
tldr: "Apiiro published research on Nov 5 showing that choosing \"don't ask again\" in Claude Code saves the full approved shell command — including any password or key typed into it — verbatim into a project's .claude/settings.local.json. That file regularly ends up committed to public GitHub repos; scanning over 100,000 public copies turned up 2,539 secrets across 1,994 repos and 63 organizations, with at least one confirmed still live. Fixes: rotate every exposed credential, untrack the file from git, and reference secrets as environment variables instead of typing them into commands."
series:
  name: "AI Security Alert"
  order: 75
---

> 🌏 [中文版](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak)

## What Happened

Application security firm Apiiro published research on November 5 showing that when a user picks "Yes, and don't ask again" on a shell command in Anthropic's Claude Code, the tool can save **that exact command** into the project's `.claude/settings.local.json`, to be auto-approved on future runs. The problem: if the command the user typed or approved already contained a password, API key, or token — something like `mysql -pYourPassword` — that secret gets written into the file verbatim along with the rest of the command. And that file is often committed to public GitHub repos, sometimes by Claude Code itself. Apiiro scanned 104,185 public copies of the file on GitHub and found 1,122 containing at least one secret, 1,379 secrets in total. Add older versions still sitting in git history, `.claude/settings.json` files teams share on purpose, and saved agent transcripts, and the total climbs to **2,539 secrets across 1,994 repositories and 63 organizations**. Apiiro notified one of the affected companies, which confirmed its leaked key was still live.

**Basics**

| Field | Value |
|---|---|
| Incident type | Secret exposure (design flaw in a coding agent's permission cache) |
| Scope | Public GitHub repos where Claude Code was used with "don't ask again"; 63 organizations affected |
| Severity | High |
| CVE | None (research disclosure, no CVE assigned) |
| Sources | [Apiiro research](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again), [The Hacker News](https://thehackernews.com/2026/11/claude-codes-dont-ask-again-file.html) |

## Attack Surface Analysis

The root cause is that Claude Code's permission cache only remembers *what* got approved, not *why*. The first time a user runs a command that touches sensitive data — connecting to a database, logging into a server with `sshpass`, calling a cloud API — Claude Code asks for approval. If the user picks "don't ask again," the rule it saves is sometimes a pattern like `npm test *`. But if what got approved was one specific, complete command rather than a pattern, Claude Code writes that entire command string — hardcoded password or token included — character for character into `.claude/settings.local.json`. Apiiro reproduced the same behavior with the current Opus 5.5 and Fable 5.1 models, confirming this isn't limited to older versions.

What turns this into a bigger problem is that the git-level protection is only half-built: the first time Claude Code writes this file inside a git repo, it adds the file to **that one computer's global** git exclude list — but it never writes an entry into the **project's own** `.gitignore`. That means the protection travels with "this computer, this user," not with the project. The moment the file exists on a different machine, or was already committed before the global exclude took effect, the protection does nothing — and Apiiro found that in 539 of the 1,105 repos it traced, the commit that touched this file listed Claude as a co-author, suggesting Claude Code often commits the file itself. Worse, deleting the file doesn't undo the leak: old versions persist in git history and in forks. Apiiro separately found 734 secrets across 509 repos' historical versions that no longer appear in the current copy, and 211 forks that carried the same leaked secrets forward from their originals.

```diagram
title: How an approved command leaks a password through Claude Code
desc: An approved command with a password gets saved verbatim; the global git-exclude rule only protects the one machine it was set on, so a different machine, CI, or a prior commit still exposes it to a public repo, where history and forks keep it alive.
caption: Simplified; based on Apiiro's Nov 5, 2026 research.
step: User approves a command containing a password, picking "don't ask again"
step: Decide whether what got approved was a pattern or a full command
step: A pattern gets saved as just the pattern, no password included
step: A full command gets saved verbatim, password and all, into the settings file
step: Decide whether the global exclude rule is active on this copy of the file
step: Active means temporary safety on this machine; inactive or already committed means it leaks straight to a public repo
step: Temporary safety doesn't last — a different machine or a fork leaks it just the same
step: Once leaked, history and forks keep the secret alive even after the current file is deleted
---
<svg viewBox="0 0 712 640">
  <path class="dg-line" d="M320 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 112V144" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M460 188H540" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M320 232V264" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M320 320V352" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M460 396H540" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M320 440V472" marker-end="url(#arrow-warn)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M616 428V488Q616 496 608 496H460" marker-end="url(#arrow-warn)" data-step="7"/>
  <path class="dg-line dg-line--warn" d="M320 520V552" marker-end="url(#arrow-warn)" data-step="8"/>

  <circle class="dg-dot" cx="320" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="180" y="56" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="76" text-anchor="middle" dominant-baseline="central">User approves a command</text>
    <text class="dg-sub" x="320" y="96" text-anchor="middle" dominant-baseline="central">it may contain a password</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M320 144L460 188L320 232L180 188Z"/>
    <text class="dg-label" x="320" y="180" text-anchor="middle" dominant-baseline="central">Pattern or exact?</text>
    <text class="dg-sub" x="320" y="202" text-anchor="middle" dominant-baseline="central">e.g. npm test *</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="540" y="164" width="152" height="56" rx="6"/>
    <text class="dg-label" x="616" y="184" text-anchor="middle" dominant-baseline="central">Pattern only</text>
    <text class="dg-sub" x="616" y="204" text-anchor="middle" dominant-baseline="central">no password</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="180" y="264" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="284" text-anchor="middle" dominant-baseline="central">Full command saved verbatim</text>
    <text class="dg-sub" x="320" y="304" text-anchor="middle" dominant-baseline="central">password included</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M320 352L460 396L320 440L180 396Z"/>
    <text class="dg-label" x="320" y="388" text-anchor="middle" dominant-baseline="central">Exclude rule active?</text>
    <text class="dg-sub" x="320" y="410" text-anchor="middle" dominant-baseline="central">this machine only</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="540" y="372" width="152" height="56" rx="6"/>
    <text class="dg-label" x="616" y="392" text-anchor="middle" dominant-baseline="central">Safe for now</text>
    <text class="dg-sub" x="616" y="412" text-anchor="middle" dominant-baseline="central">this machine</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="180" y="472" width="280" height="48" rx="6"/>
    <text class="dg-label" x="320" y="496" text-anchor="middle" dominant-baseline="central">Committed to a public repo</text>
  </g>

  <g data-step="8">
    <rect class="dg-box dg-box--warn" x="180" y="552" width="280" height="64" rx="6"/>
    <text class="dg-label" x="320" y="576" text-anchor="middle" dominant-baseline="central">History and forks</text>
    <text class="dg-sub" x="320" y="598" text-anchor="middle" dominant-baseline="central">still hold the leaked secret</text>
  </g>

  <text class="dg-edge" x="500" y="176" text-anchor="middle" dominant-baseline="central" data-step="3">pattern</text>
  <text class="dg-edge" x="332" y="248" text-anchor="start" dominant-baseline="central" data-step="4">full command</text>
  <text class="dg-edge" x="500" y="384" text-anchor="middle" dominant-baseline="central" data-step="6">active</text>
  <text class="dg-edge dg-text--warn" x="332" y="456" text-anchor="start" dominant-baseline="central" data-step="6">not protected</text>
  <text class="dg-edge dg-text--warn" x="626" y="464" text-anchor="start" dominant-baseline="central" data-step="7">leaks anyway</text>
</svg>
```

Mapped onto the OWASP LLM Top 10, this incident hits both **LLM02 Sensitive Information Disclosure** (secrets improperly retained and exposed) and **LLM06 Excessive Agency** (when an agent is granted the ability to auto-rerun a command, failing to separate "the command's operating pattern" from "the sensitive parameters embedded in it" hands too much autonomy to a caching mechanism that just copies whatever the user typed). Notably, Apiiro compared the documentation of 16 coding agents and found Claude Code is the only one confirmed to save the full approved command into a project file by default.

## Defenses

**Immediate actions**
- Search your GitHub organization for `.claude/settings.local.json` and `.claude/settings.json`, including each repo's git history, even where the file has since been deleted
- For any file containing a secret, **rotate first, clean up second**: assume every password, token, and key it ever held has leaked, and revoke and reissue each one
- Run `git rm --cached .claude/settings.local.json` to untrack the file, and add a repo-level `.gitignore` rule — don't rely solely on the global exclude list Claude Code writes

**Long-term architecture**
- Approve patterns rather than exact commands wherever possible (e.g. `Bash(npm run:*)`); reference passwords as environment variables (like `$DB_PASSWORD`) in commands so the cached rule only ever stores the variable name
- Treat agent config folders like `.claude/`, `.cursor/`, `.gemini/`, and saved agent transcripts as secret-bearing, the same as `.env` files, and add them to pre-commit and CI secret scanning, including git history
- Standard secret scanners often miss this pattern: Apiiro found gitleaks and TruffleHog caught only 564 and 643 of the 1,122 problem files respectively, with 215 missed by both, because passwords following `PGPASSWORD=`, `sshpass -p`, or `mysql -p` don't match typical key-format rules. To close that gap, a runtime governance platform from watchlist B7 like WitnessAI — built to continuously capture and audit what agents actually do, including shell commands and tool calls — can intercept a command before it's approved and cached, rather than relying on scanning after the commit already happened

## Impact

At the time Apiiro checked, every file containing a secret was still sitting on its repo's default branch, and half had been there for at least 217 days untouched. Most of the 63 affected organizations are software companies; researchers specifically called out two of the more severe cases: a database vendor's own admin-level cloud key, and the owner password for a medical-records database. Researchers didn't test whether the secrets still worked and didn't contact any server to verify, so the one confirmed-live key came only from a single notified company — meaning the real scale of exploitable exposure is likely harder to pin down than the "2,539" headline number suggests. Worth noting: GitHub issues reporting this same behavior date back to at least August 2025, but every related report was closed by an automated bot without any reply from Anthropic.

If you or your team use Claude Code — or any coding agent that caches and reruns approved commands — this incident means "don't ask again" itself is an attack surface worth re-evaluating. It was built to cut down on approval friction, but it can just as easily turn the secrets you habitually paste into a terminal into a leak that sits quietly in a public repo for months.

## Today's Takeaway

What makes this incident interesting is that it didn't need an attacker at all: no malware, no prompt injection, no supply-chain poisoning. A design decision made purely for convenience — caching whatever the user typed — stacked on top of a protection boundary drawn in the wrong place — tied to one user's local machine instead of the project — was enough on its own to leak secrets at scale. Compared to the deliberate attack chains covered here before, this is a reminder to ask, of any agent feature that "remembers what you approved last time": is it remembering *how* you did something, or is it also remembering *exactly what you typed* while doing it?

## References

- [Apiiro — Coding Agents Are Leaking Secrets to GitHub via "Don't Ask Again"](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again)
- [The Hacker News — Claude Code's "Don't Ask Again" File Exposes Passwords and Keys in 1,122 Public Copies on GitHub](https://thehackernews.com/2026/11/claude-codes-dont-ask-again-file.html)
- [GBHackers — Claude Code's "Don't Ask Again" Feature Exposes 2,539 Secrets Across 1,994 GitHub Repositories](https://gbhackers.com/claude-codes-dont-ask-again-feature-exposed/)
- [Claude Code docs — Permissions](https://code.claude.com/docs/en/permissions)
- [Claude Code docs — Settings](https://code.claude.com/docs/en/settings)
- [GitHub Issue #5544 (filed 2025-08-11, auto-closed)](https://github.com/anthropics/claude-code/issues/5544)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
