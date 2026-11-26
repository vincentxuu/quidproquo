---
title: "Security Alert | The Official MCP Git Server's Read-Only Tools Let a Repo's Own .git/config Trigger RCE (GHSA-6hqx-gqrx-c5r2)"
date: 2026-11-15
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: en
description: "The official Model Context Protocol reference server mcp-server-git let an untrusted repository's own .git/config run a program with the server's privileges whenever an agent called a read-only tool like git_status. Fixed in v2.4.0."
tldr: "A HackerOne researcher found that the official mcp-server-git ran a program named in an untrusted repository's own .git/config (via core.fsmonitor, diff.external and similar keys) with the MCP server's privileges, triggered by calling read-only tools like git_status or git_diff_unstaged. Rated High at CVSS 4.0 7.0 and fixed in v2.4.0 on 2026-11-11 (GHSA-6hqx-gqrx-c5r2). It belongs to the GitSpawn vulnerability class already assigned CVEs in other coding agents; mcp-server-git was the last official reference server to get the same fix. Pin the three fixed reference-server packages explicitly — a CalVer-to-SemVer version jump means your package manager may silently leave you on the vulnerable release."
series:
  name: "AI Security Alert"
  order: 78
---

> :globe: [中文版](/posts/daily/2026-11-15-security-mcp-git-server-gitconfig-rce)

## What happened

`modelcontextprotocol/servers`, the official Model Context Protocol reference-server project maintained under Anthropic, shipped v2.4.0 on November 11, 2026, fixing six security issues. The most severe, rated High, was in `mcp-server-git`: calling the seemingly read-only `git_status` tool against an untrusted repository let that repository's own `.git/config` name a program, which then ran directly with the MCP server process's privileges — no approval prompt, and outside any sandbox that governs the model's own command execution. The issue was responsibly disclosed through the HackerOne Anthropic bug-bounty program and is tracked as `GHSA-6hqx-gqrx-c5r2`. The same release also closed a medium-severity `--repository` confinement bypass (`GHSA-q74p-4wrc-q7w6`). This is the second security release for the same set of reference servers in under three weeks, and there is no public report of either flaw being exploited in the wild.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Insecure Plugin Design — Git configuration injection leading to arbitrary code execution (CWE-94) |
| Scope | `mcp-server-git` ≤ 2026.11.4 (fixed in 2026.11.11); the same release also fixed `@modelcontextprotocol/server-filesystem` (< 2.3.0, including date versions 2025.1.14–2026.8.31) and `mcp-server-fetch` (≤ 2026.11.4) |
| Severity | High, CVSS 4.0 7.0 (`GHSA-6hqx-gqrx-c5r2`); the companion `--repository` confinement bypass is Medium (`GHSA-q74p-4wrc-q7w6`) |
| CVE | No separate CVE; tracked as GitHub Security Advisories `GHSA-6hqx-gqrx-c5r2` and `GHSA-q74p-4wrc-q7w6` |
| Sources | [GitHub Security Advisory GHSA-6hqx-gqrx-c5r2](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2), [modelcontextprotocol/servers v2.4.0 release notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0), [dev.to technical writeup](https://dev.to/piekwerk/a-repos-gitconfig-could-run-programs-through-mcps-git-server-6-fixes-in-v240-and-4-checks-344g) |

## Attack surface

The setup is simple: an attacker writes a command-bearing key into a git repository's `.git/config` — `core.fsmonitor` (which git runs on every index refresh) or `diff.external` (which runs when producing a diff) — and the command can be inlined directly in the config value (`core.fsmonitor = sh -c '...'`), with no separate payload file needed. The victim's agent only has to open that repository through `mcp-server-git` and call a tool that sounds completely harmless, such as `git_status` or `git_diff_unstaged`. Git reads and honors the repository's own `.git/config` before doing anything else, and `mcp-server-git`'s only configuration override when it shells out to the system `git` binary is `core.quotepath=false` — everything else passes through untouched. The attacker's chosen program then runs with the MCP server process's privileges, including whatever environment variables it holds, such as credentials passed in through the client's `env` block.

The root cause is that "read-only" is a label the MCP tool description applies, not a fact about the operating system underneath. `mcp-server-git` wraps `git_status` as a read-only tool, but what actually runs is the full `git` binary, which carries its own, far looser trust model: it reads and executes hooks, filter and merge drivers, and signing programs that the repository itself declares. The attacker-controlled input (the repository) is also the security policy for that input (the repository's own `.git/config`) — a "content is configuration" structure that explains why this bug isn't confined to one MCP server. The Cloud Security Alliance named this whole class **GitSpawn** back in September 2026 and has already tied it to patched CVEs in other git-shelling coding agents: GitHub Copilot CLI (`CVE-2026-45033`, CVSS 8.5), Goose (`CVE-2026-72718`, CVSS 7.0), and Hermes Agent (`CVE-2026-71963`, CVSS 8.6). `mcp-server-git` was the last of the official reference servers to ship the same fix.

Mapped to the OWASP LLM Top 10, this lands primarily under **LLM07 Insecure Plugin Design** — the tool's real side effects exceed what it advertises to the model and the user ("checking status" becomes "running an arbitrary program") — and secondarily under **LLM05 Supply Chain Vulnerabilities**, since `mcp-server-git` is an official reference implementation that a huge number of agent configs trust without re-review; a single flaw here undermines the assumption that "the official server has already been vetted." One delivery limit is worth noting: a plain `git clone` does not copy a repository's server-side `.git/config`, and GitHub's source ZIP downloads exclude the `.git` directory, so neither channel alone carries the payload. What does carry it: archives, CI artifacts, backups, vendored dependency trees checked into a project, or an agent workspace copied rather than cloned.

## Defenses

**Immediate actions**
- Explicitly upgrade `mcp-server-git` and `mcp-server-fetch` and **pin the version by hand** to `2026.11.11`, and `@modelcontextprotocol/server-filesystem` to `2.3.0` — these three packages just moved from CalVer (date versions like `2026.11.4`) to SemVer (like `2.3.0`), and package managers rank `2.3.0` below every `2025.x`/`2026.x` version, treating it as a downgrade rather than offering it as an update. A config pinned to a date version will not pick up the fix on its own
- Audit every MCP client config (`~/.claude.json`, `~/.claude/`, `~/.cursor/`, `~/.codex/`) for lingering references to old versions of these three packages
- Before letting an agent call any git-related tool against an untrusted repository, confirm the git binary in that environment is ≥ 2.31 — the fix relies on `GIT_CONFIG_COUNT` overrides, which older git versions ignore, so the server now refuses to run rather than silently losing the protection

**Long-term architecture**
- Don't treat "read-only" in an MCP tool's description as a security boundary. Any MCP server that shells out to an external program — git, pandoc, imagemagick, whatever — should run in a container or under a restricted account, and should never hold environment variables with sensitive credentials
- Avoid version-unpinned startup patterns like bare `npx -y` or `uvx` — this incident is a direct illustration of how trusting a package manager's default resolution order can leave you on a vulnerable release
- Tools like watchlist B7's Netzilo, which do MCP server runtime governance and allowlisting, can block outdated or unreviewed MCP server versions at the configuration layer, instead of relying on every individual user to remember to check version numbers

```diagram
title: How a "read-only" call gets turned into RCE by .git/config
desc: An attacker-prepared git repository carries configuration that names a program to run; when mcp-server-git shells out to system git for a call that looks read-only, that configuration is read and applied as-is.
caption: Simplified, based on the official GHSA-6hqx-gqrx-c5r2 report and the modelcontextprotocol/servers v2.4.0 fix notes.
step: Attacker writes core.fsmonitor or diff.external in the repo's .git/config, pointing at a script
step: The repository reaches the victim with its .git directory intact (an archive, CI artifact, vendored dependency, or a copied — not cloned — workspace)
step: The agent calls a tool that looks read-only through mcp-server-git (git_status, git_diff_unstaged)
step: mcp-server-git's only override is core.quotepath — git still reads and applies the repo's own .git/config
step: The program named in the config runs with the MCP server's privileges — no approval, no sandbox involved, fixed on 2026-11-11
---
<svg viewBox="0 0 712 460">
  <path class="dg-line" d="M320 26V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 104V126" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 182V204" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 260V282" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M320 338V360" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="320" cy="20" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="100" y="48" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Repo's .git/config names a program to run</text>
    <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">core.fsmonitor or diff.external points at a script</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="100" y="126" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="146" text-anchor="middle" dominant-baseline="central">Repo reaches the victim with .git intact</text>
    <text class="dg-sub" x="320" y="166" text-anchor="middle" dominant-baseline="central">Archive, CI artifact, vendored dep, or copied workspace</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="100" y="204" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="224" text-anchor="middle" dominant-baseline="central">Agent calls a tool that looks read-only</text>
    <text class="dg-sub" x="320" y="244" text-anchor="middle" dominant-baseline="central">git_status, git_diff_unstaged</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="100" y="282" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="302" text-anchor="middle" dominant-baseline="central">mcp-server-git only overrides core.quotepath</text>
    <text class="dg-sub" x="320" y="322" text-anchor="middle" dominant-baseline="central">Git still reads and applies the repo's own .git/config</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="100" y="360" width="440" height="64" rx="6"/>
    <text class="dg-label" x="320" y="384" text-anchor="middle" dominant-baseline="central">Named program runs with the server's privileges</text>
    <text class="dg-sub" x="320" y="404" text-anchor="middle" dominant-baseline="central">No approval, no sandbox — fixed on 2026-11-11</text>
  </g>
</svg>
```

## Impact

This is the second security release for the same set of reference servers in under three weeks (the previous one, on October 25, fixed eight issues), a sign of how much scrutiny this package group — trusted directly by millions of agent configs — is now getting. None of the six issues received a separate CVE; they're tracked only as GitHub Security Advisories, so a vulnerability scanner that only flags CVEs won't catch this batch. There's no public report of `GHSA-6hqx-gqrx-c5r2` being exploited before disclosure — the researcher reported it through the HackerOne Anthropic bug-bounty program, and full details went public only after the fix shipped. The real risk is how easy the exposure test is: if any MCP client config references one of these three packages and the version actually running falls in the affected range, you're exposed — and the CalVer-to-SemVer version jump described above means a lot of configs that assume they're auto-updating are quietly stuck on a vulnerable release.

If your agent system handles git repositories supplied by someone else — a code-review assistant, an autonomous bug-fixing agent, or any CI pipeline that clones a third-party dependency to analyze it — this attack surface is open by default. The repository's author is the attacker; they don't need to convince anyone of anything extra. One `git_status` call is enough.

## Takeaway

I used to treat "read-only tools" as inherently safer in an agent's permission model. This incident is a reminder that when an MCP tool is just a wrapper around an external program, "read-only" is a claim made by that wrapper — not by the program underneath. What actually sets the security boundary is whether that external program has its own, broader trust model, the way git reads and runs whatever its own `.git/config` names. What you're trusting is never just the MCP server's own code; it's the full behavior of every external program it calls — and GitSpawn, this vulnerability class, has now shown up in at least four different agent tools.

## References

- [GitHub Security Advisory GHSA-6hqx-gqrx-c5r2 — mcp-server-git arbitrary command execution](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2)
- [GitHub Security Advisory GHSA-q74p-4wrc-q7w6 — mcp-server-git --repository confinement bypass](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-q74p-4wrc-q7w6)
- [modelcontextprotocol/servers v2.4.0 release notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0)
- [dev.to (Piekwerk) — A repo's .git/config could run programs through MCP's git server](https://dev.to/piekwerk/a-repos-gitconfig-could-run-programs-through-mcps-git-server-6-fixes-in-v240-and-4-checks-344g)
- [GHSA-9ccr-r5hg-74gf / CVE-2026-45033 — the same class of core.fsmonitor flaw in GitHub Copilot CLI](https://github.com/advisories/GHSA-9ccr-r5hg-74gf)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
