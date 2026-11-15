---
title: "Security Alert | Docker Sandboxes Symlink Escape Lets AI Coding Agents Reach Your SSH Keys and Cloud Credentials (CVE-2026-103916)"
date: 2026-11-05
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "AI supply chain security firm Endor Labs disclosed a CVSS 8.2 Docker Sandboxes flaw on Nov 3: the sbx cp command never checks the workspace allowlist, letting a sandboxed agent use a symlink to reach host files. Docker's real fix shipped Nov 3 as v0.51.0."
tldr: "On Nov 3, Endor Labs disclosed CVE-2026-103916 (CVSS 8.2): Docker Sandboxes' sbx cp command never checks the workspace allowlist. Planting a symlink inside an approved workspace is enough to make a host-side copy read sensitive files like ~/.ssh or ~/.aws, or write attacker-controlled content to any host path. Claude Code, Codex, and Gemini CLI can all run on this sandbox. The Oct 13 patch was incomplete; the real fix landed Nov 3 as v0.51.0 — upgrade now."
series:
  name: "AI Security Alert"
  order: 72
---

> 🌏 [中文版](/posts/daily/2026-11-05-security-docker-sandboxes-symlink-escape)

## What Happened

On November 3, AI supply chain security firm Endor Labs disclosed CVE-2026-103916, a vulnerability in Docker Sandboxes — the `sbx` CLI-driven microVM sandboxes used to isolate AI coding agents like Claude Code, Codex, and Gemini CLI. The flaw lives in `sbx cp`, the command that copies files between a sandbox and the host: it never checks the workspace allowlist the user approved ahead of time. If the agent inside the sandbox plants a symlink pointing anywhere on the host inside an already-approved workspace, any later `sbx cp` the operator runs on the host can end up reading sensitive host files into the sandbox, or writing sandbox-controlled content to an arbitrary host path. Docker originally scheduled a fix for October 13 in v0.48.0, but that patch turned out to be incomplete — the real fix shipped November 3 as v0.51.0. CVSS 3.1 scores it 8.2 (High). There's no evidence of in-the-wild exploitation yet, but the full technical write-up and a reproducible PoC are already public.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Sandbox boundary escape (CWE-59, Improper Link Resolution Before File Access — symlink following) |
| Scope | Docker Sandboxes (`sbx` CLI); any workflow that moves files with `sbx cp` before the patch. Affected agent platforms include Claude Code, Codex, Gemini CLI, and anything else running on Docker Sandboxes |
| Severity | High (CVSS 3.1: 8.2; CVSS 4.0: 7.3) |
| CVE | CVE-2026-103916 |
| Fixed version | Docker Sandboxes ≥ v0.51.0 (the Oct 13 v0.48.0 patch did not actually fix it) |
| Sources | [Endor Labs research](https://www.endorlabs.com/learn/docker-sandboxes-vulnerability-lets-ai-agents-access-sensitive-files-outside-their-sandbox-cve-2026-103916), [Rapid7 Vulnerability Database](https://www.rapid7.com/db/vulnerabilities/cve-2026-103916), [CVE Record](https://www.cve.org/CVERecord?id=CVE-2026-103916) |

## Attack Surface

Docker Sandboxes' security model relies on an allowlist: developers explicitly approve a handful of folders — usually the project workspace — to be mounted into the sandbox's microVM over virtio-fs. In theory, the agent can only touch what's on that list. The catch is that `sbx cp` runs on an entirely separate path: it's ordinary host-side file I/O performed by the CLI process with the operator's full permissions, and it never consults the allowlist at all. The actual bug is in how that command resolves symlinks. Endor Labs identified four positions where a symlink can sit in a copy path — the last component and the parent component on both the destination and the source side. The command's only symlink guard, the `-L` flag, covers exactly one of those four positions (the last component of the copy-in source); the other three are followed by default, no flag required. Because the workspace is mounted read-write into the sandbox, the agent can freely replace any subdirectory inside it with a symlink pointing anywhere on the host. Planting the link does nothing by itself — inside the guest the link dangles, since the target doesn't exist in the guest's view. It only takes effect once the operator runs a `sbx cp` on the host against what looks like an ordinary workspace path.

Endor Labs demonstrated both directions. For the write primitive, the sandbox plants a symlink pointing at `~/.ssh` inside the workspace; the operator copies out what looks like a log file, and the content lands inside `~/.ssh/notes.txt` instead. For the read primitive, the sandbox places the symlink at a parent-directory position; the operator copies in what looks like an ordinary workspace file, and a host file such as `~/.aws/credentials` ends up copied whole into the sandbox. Both moves use the exact command pattern `sbx cp --help` teaches as its example, and in normal agentic workflows the copy command is often one the agent itself suggests — the operator may just be pasting a line the agent proposed, with no way to tell the destination has been swapped out from under them. A successful copy prints nothing, unlike `sbx mount`, which at least echoes the resolved path; a human watching over the operator's shoulder has nothing to notice.

```diagram
title: Docker Sandboxes sbx cp Symlink Escape Chain (CVE-2026-103916)
desc: An agent inside the sandbox swaps a workspace subdirectory for a symlink, tricking the operator's host-side sbx cp into reading or writing files outside the sandbox
caption: Steps 1-6 were all reproduced by Endor Labs; the -L flag only guards one of the four symlink positions
step: Untrusted content (a web page, a dependency) instructs the sandboxed agent to plant a symlink inside the workspace
step: The agent swaps a workspace subdirectory for a symlink pointing at the host's ~/.ssh or ~/.aws (harmless inside the guest, where the link just dangles)
step: The agent suggests the operator run an sbx cp command that looks like it's just moving a log file or build artifact
step: The operator trusts the suggestion and runs sbx cp on the host
step: sbx cp resolves the path on the host side and follows the symlink; the allowlist is never consulted
step: A sensitive host file gets copied into the sandbox, or sandbox content gets written to an arbitrary host path (e.g. ~/.ssh/authorized_keys)
---
<svg viewBox="0 0 640 460">
  <line class="dg-rule" x1="140" y1="72" x2="140" y2="440"/>
  <line class="dg-rule" x1="500" y1="72" x2="500" y2="440"/>

  <g data-step="1">
    <path class="dg-line dg-line--dashed" d="M144 112H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="100" text-anchor="middle" dominant-baseline="central">untrusted content with instructions</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M144 160H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="148" text-anchor="middle" dominant-baseline="central">ln -s workspace/dir -&gt; host path</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M496 208H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="196" text-anchor="middle" dominant-baseline="central">suggests running sbx cp</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M144 256H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="244" text-anchor="middle" dominant-baseline="central">operator runs sbx cp</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M144 304H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="292" text-anchor="middle" dominant-baseline="central">follows symlink, skips allowlist</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent" d="M504 352H532Q540 352 540 360V368Q540 376 532 376H508" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="552" y="364" dominant-baseline="central">reads/writes host file</text>
  </g>

  <rect class="dg-box" x="496" y="100" width="8" height="280" rx="2" data-step="1 2 3 4 5 6"/>

  <rect class="dg-box" x="60" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="140" y="48" text-anchor="middle" dominant-baseline="central">Agent in sandbox</text>

  <rect class="dg-box" x="408" y="24" width="184" height="48" rx="6"/>
  <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">Operator's host</text>
  <text class="dg-sub" x="500" y="60" text-anchor="middle" dominant-baseline="central">sbx cp</text>
</svg>
```

Mapped to the OWASP LLM Top 10: the trigger for this chain is **LLM01 Prompt Injection** — untrusted content (a web page, a dependency, a document) instructs the agent to plant the symlink. But the actual root cause is **LLM08 Excessive Agency**: under the reasonable grant of "read-write access to the approved workspace," the agent ends up able to manipulate a file channel the sandbox's security model never accounted for, giving it effective reach far beyond what the allowlist was meant to grant.

## Defense

**Immediate actions**
- Check your Docker Sandboxes version: `sbx --version`. Anything before v0.51.0 is affected — the Oct 13 v0.48.0 patch did not actually fix this
- Upgrade to v0.51.0 immediately
- Until you upgrade, treat `sbx cp` like a command written by an untrusted party: verify the resolved path with `realpath` before copying in either direction, and be especially cautious with copy commands the agent itself suggests

**Longer-term architecture**
- Audit any sandbox design that relies on "allowlist as the trust boundary" to confirm the allowlist actually covers every path in and out — the bug here isn't in the virtio-fs shared filesystem itself, but in a parallel copy channel that was never checked at all. The same researcher found the identical pattern — a second, unguarded channel — earlier this year in the brig sandbox project
- Bring file-moving helper commands into the same runtime monitoring you apply to agent execution, rather than trusting the sandbox boundary alone. Tools like Zenity for agent runtime security can log what paths an agent's actions actually touch, giving you an after-the-fact trail for copies like this
- Prefer tooling that echoes the resolved path on success, the way Docker's own `sbx mount` does — a copy operation that produces zero output is itself a design choice worth retiring

## Impact

Endor Labs hasn't disclosed how many environments run Docker Sandboxes, but any developer machine that has run `sbx run claude`, `sbx run codex`, or similar commands on a version below v0.51.0 and used `sbx cp` to move files at any point is, in principle, exposed. The write primitive can place arbitrary attacker-chosen content into any existing path under the operator's entire home directory, which can turn into code execution the next time the operator does something as ordinary as opening a shell — rewriting `~/.ssh/authorized_keys`, a `~/.gitconfig` pager setting, or a git hook script. Endor Labs laid out this escalation path as reasoning rather than demonstrating it directly. The read primitive is somewhat weaker, since the operator has to type a filename that actually exists, but because the copy command is often one the agent itself proposes, guessing a target like `~/.aws/credentials` or `~/.ssh/id_ed25519` isn't much of an obstacle. There's no public evidence of in-the-wild exploitation so far, but the technical details, CVSS score, and reproduction steps are all public, which keeps the bar for scanning and exploitation low.

## Today's Takeaway

This incident is a reminder that the real risk in a sandbox's security model often isn't in the boundary everyone audits carefully — here, the virtio-fs mount and its allowlist — but in a side channel that looks like "the operator's own action" and therefore gets left out of the threat model entirely. The copy command runs on the host, with the operator's permissions, and it's easy to design security around the assumption that "the human chose to copy this, so it must be fine" while forgetting the agent can set the trap well before the operator's hand ever touches the keyboard. The same researcher found the same pattern in a different sandbox product, brig, which suggests this isn't a Docker-specific oversight so much as a structural blind spot — the primary shared channel gets scrutinized heavily, while a secondary file-moving channel gets none at all. It's worth pulling that question out and checking it on its own whenever auditing any agent sandbox.

## References

- [Endor Labs — Docker Sandboxes vulnerability lets AI agents access sensitive files outside their sandbox (CVE-2026-103916)](https://www.endorlabs.com/learn/docker-sandboxes-vulnerability-lets-ai-agents-access-sensitive-files-outside-their-sandbox-cve-2026-103916)
- [Rapid7 Vulnerability Database — CVE-2026-103916](https://www.rapid7.com/db/vulnerabilities/cve-2026-103916)
- [CVE Record — CVE-2026-103916](https://www.cve.org/CVERecord?id=CVE-2026-103916)
- [Endor Labs — Project Mount: Symlink Traversal in Brig (the same researcher's earlier finding of the same bug class)](https://www.endorlabs.com/learn/project-mount-symlink-traversal-in-brig-how-a-sandbox-reaches-host-directories-it-was-never-given)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
