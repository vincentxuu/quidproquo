---
title: "Security Alert｜One Line in a Git Config Can Make Claude Code, Codex, Cursor and Four Other AI Coding Agents Run Arbitrary Code — GitSpawn Leaves Four Tools Still Unpatched"
date: 2026-09-03
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Manifold Security disclosed GitSpawn: AI coding agents call git on startup to gather project context, but never strip the repository's own git config first — letting a malicious repo run arbitrary commands as the user, before any trust dialog is accepted. goose, Codex, and one Claude Code path are patched; Hermes Agent, Qwen Code, Grok Build, and a second Claude Code path remain exploitable."
tldr: "Security firm Manifold Security published research on September 1 called GitSpawn: seven CLI AI coding agents (goose, Codex CLI/Desktop, Claude Code, Hermes Agent, Qwen Code, Grok Build) call git status, git diff, and similar commands on startup or session creation to gather project context, without first stripping the repository's own .git/config — and the value of a git setting like core.fsmonitor is itself a command to execute. Receiving a directory that still has its .git folder intact (a zip, a shared drive, a USB stick — not a git clone) is enough: the moment an agent opens it, it runs the repo's chosen command as the user, outside the sandbox, before any trust dialog or approval prompt. goose (CVE-2026-72718, CVSS 7.0), Codex (three CVEs OpenAI published the same day), and Claude Code's core.fsmonitor path are patched; but a second Claude Code path reached through claude ultrareview, plus Hermes Agent, Qwen Code, and Grok Build, were still exploitable when Manifold retested them on September 1. No known in-the-wild exploitation so far. Defense: inspect .git/config before opening unfamiliar directories, and disable core.fsmonitor globally."
series:
  name: "AI Security Alert"
  order: 20
---

> 🌏 [中文版](/posts/daily/2026-09-03-security-gitspawn-git-config-rce)

## Incident Overview

Security research firm Manifold Security published a report on September 1 disclosing an attack pattern it calls GitSpawn, affecting seven command-line AI coding agents at once: goose, Codex CLI/Desktop, Claude Code, Hermes Agent, Qwen Code, and Grok Build, on top of Cursor CLI, which Manifold had already disclosed the same class of issue in three weeks earlier. These agents call commands like `git status` and `git diff` on startup or when creating a session, to figure out the current branch and which files changed — gathering project context. The problem is they never strip the repository's own git configuration before making that call. A git setting like `core.fsmonitor` is itself a command that git executes when read, and it runs under the user's privileges, outside the sandbox, before any trust dialog or approval prompt ever appears. The attacker doesn't need to trick anyone into clicking or approving anything — they only need the victim to open a directory that still has its `.git` folder intact, delivered as a shared zip file, shared drive, sync folder, or USB stick rather than through `git clone`. The moment the AI agent starts up in that directory, it walks straight into the trap. OpenAI published three CVEs of its own for Codex the same day, credited to three unrelated research teams that reported the same class independently. The Hacker News has since covered the findings.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Arbitrary command execution via malicious Git configuration (GitSpawn — sandbox bypass / trust-boundary failure) |
| Scope | goose (<1.44.0), Codex CLI (0.102.0–0.130.0), Codex Desktop (specific macOS/Windows version ranges), Claude Code (core.fsmonitor path confirmed on 2.1.193, fixed in 2.1.196; a second path via `claude ultrareview` confirmed live on 2.1.252, against current release 2.1.258), Hermes Agent (0.18.2, 0.21.0 — unpatched), Qwen Code (0.19.6, 0.22.3 — unpatched), Grok Build (0.2.93, 1.0.13 — unpatched), Cursor CLI (previously disclosed and patched) |
| Severity | High (arbitrary command execution as the user, before any approval step; no known in-the-wild exploitation so far, and the trigger requires receiving a repo as files with `.git` intact — an ordinary `git clone` does not trigger it) |
| CVE | CVE-2026-72718 (goose, GitHub Advisory GHSA-r5pp-p5r8-466r, CVSS 4.0 base score 7.0), CVE-2026-19592 (OpenAI Codex, part of a batch of three CVEs), CVE-2026-71963 (Hermes Agent, assigned by VulnCheck, not yet found in MITRE's public CVE List as of September 2); goose is currently the only case with a published CVSS score |
| Source | [Manifold Security (original GitSpawn disclosure)](https://www.manifold.security/blog/ai-coding-agents-git-hijack), [The Hacker News](https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html), [GitHub Security Advisory GHSA-r5pp-p5r8-466r (goose)](https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r) |

## Attack Surface Analysis

GitSpawn's root cause isn't the model or a prompt going wrong — it's the plumbing underneath, the code that runs at session startup so an agent can figure out where it is. As Manifold put it: "The vulnerability is not in the model, or in anything new. It is in the ordinary plumbing underneath, the subprocess an agent spawns at session startup to work out where it is." `core.fsmonitor` is a git performance setting for large repositories: instead of scanning every file, git asks a helper program what changed, and that helper program is whatever the repository's own `.git/config` says it is. Any git operation that refreshes the index — including the most innocuous `git status` or `git diff` — triggers that helper to run. All an attacker has to do is write a malicious command into `.git/config`'s `core.fsmonitor` key, then hand the whole directory to a victim (not via `git clone`, but as files). The moment the victim's AI coding agent starts up and calls `git status` to gather context, the command runs with the victim's privileges — no model call required, no tool approval needed, and before the workspace-trust dialog is even accepted. On Claude Code and Hermes Agent, the payload fires before the trust dialog is accepted; on Qwen Code, before the user has authenticated; on Grok Build, on the first keystroke.

This isn't entirely new. Security firm Sonar reported the same sink back in April and noted that Anthropic had already moved Claude Code's startup sequence once to close it off, while also identifying the same trust-dialog bypass pattern in VS Code (CVE-2021-43891) and JetBrains IDEs (CVE-2022-24346). But Manifold's retest found the same startup behavior reappearing in Claude Code 2.1.193 (shipped June 25, 2026). And a second path, reached through `claude ultrareview`, was confirmed live by Manifold on 2.1.252 as of September 1 — against the current public release, 2.1.258, with no source confirming whether a later release has closed it. The lesson: fixing one instance of this pattern doesn't mean it won't resurface through a different path, because the underlying habit — spawning a git subprocess for context on startup — is shared across the whole tool category, not confined to one function's edge case.

Mapped against OWASP's categories, GitSpawn hits both the classic LLM Top 10's **Excessive Agency** (the agent already has the ability to execute arbitrary local commands before the user has approved any trust step) and, more precisely, **Insufficient Sandboxing / Tool Misuse** as named by the OWASP Agentic Security Initiative — the approval mechanism and sandbox design assumed every command execution path would pass through some approval gate, but never accounted for the git subprocess the agent spawns in the background purely to gather context, a path that bypasses the entire trust model.

## Defense

**Immediate actions**
- Before opening any directory received as files (an unzipped archive, a shared drive, a sync folder, a USB stick) with an AI coding agent, inspect its `.git/config` for `core.fsmonitor`, `core.hooksPath`, `attr.tree`, and any accompanying clean/process filter
- Run `git config --get core.fsmonitor` on any repository received as files
- Run `git config --global --list | grep fsmonitor` to audit your own global configuration
- Run `git config --global core.fsmonitor false` to disable the setting globally as a default line of defense
- Inventory the CLI AI coding agent versions your team runs against Manifold's affected-version list: upgrade goose to 1.44.0+, Codex CLI to 0.131.0+ (current release is 0.152.1), and Claude Code to at least 2.1.196, while checking whether the vendor's advisory covers the `claude ultrareview` path
- Hermes Agent, Qwen Code, and Grok Build remain unpatched as of this writing — if your team uses them, avoid opening directories of unknown provenance received as files rather than via `git clone` until a fix ships

**Long-term architecture**
- If you're building an agent or tool chain that calls git, always append a flag like `-c core.fsmonitor=false` on startup context calls to explicitly strip potentially malicious settings, rather than relying on defaults — this is exactly the fix Manifold recommends to vendors
- Bring code paths that execute before a trust dialog into your security review scope — don't limit review to tool calls that happen after user approval; that's precisely the blind spot several agents shared here
- Evaluate watchlist B7 companies like Invariant Labs and Zenity, which focus on agent/tool-chain security posture, to pen-test the sandbox boundaries and approval flows of any CLI agent you build or integrate internally, rather than trusting a vendor's default security claims
- Establish an internal policy requiring third-party or client projects received as files (rather than through version control) to go through a git-config health check with `git config --get` before any AI agent is allowed to open them

## Impact

Manifold says it found this pattern "in more agents than we name here," beyond the seven it details in this report. As for patch status: goose, Codex (CLI and Desktop), and Claude Code's `core.fsmonitor` path are fixed; Hermes Agent (which was run unattended by an attacker in an intrusion against a Thai government network in July), Qwen Code, Grok Build, and the second Claude Code path reached via `claude ultrareview` were all still executing repository-supplied commands as of Manifold's retest on September 1. The Hacker News checked the U.S. CISA Known Exploited Vulnerabilities catalog on September 2 (version 2026.09.01, 1,687 entries) and found none of the relevant CVEs listed — there's no evidence this technique has been used in a real attack so far.

This matters for any workflow that hands an unfamiliar project directory to an AI coding agent — consultants receiving client codebases, cross-team collaboration that shares code without version control, or any habit of handing off projects via shared drive rather than git. Because the trigger requires receiving the repo as files with `.git` intact, an ordinary `git clone` doesn't trigger it — which makes the delivery method itself a meaningful line of defense.

## Today's Takeaway

When thinking about AI coding agent security risks, the instinct is to picture a malicious prompt tricking the agent into doing something bad. GitSpawn doesn't touch the model at all — it exploits the git command an agent quietly calls in the background just to figure out which project it's in, a path that exists purely for performance and context-gathering and that its designers never treated as something needing trust-boundary coverage. The reminder here: an agent's attack surface isn't limited to "what gets past the prompt" and "what gets past tool approval" — any subprocess an agent spawns in the background for its own convenience can be a side channel that bypasses the approval mechanism entirely.

## References

- [GitSpawn: A Single Flaw Lets Untrusted Repos Run Code in Claude Code, Codex, Cursor, and Grok — Manifold Security](https://www.manifold.security/blog/ai-coding-agents-git-hijack)
- [Malicious .git Configs Can Make Claude, Codex, Cursor, and Other AI Agents Run Attacker Code — The Hacker News](https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html)
- [GHSA-r5pp-p5r8-466r: goose git subprocess arbitrary command execution — GitHub Security Advisory](https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r)
