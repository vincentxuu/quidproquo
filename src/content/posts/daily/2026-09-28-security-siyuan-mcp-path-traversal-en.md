---
title: "Security Alert: SiYuan's MCP File Tools Had a Path-Traversal Family — a Half-Fixed Guard Let Agents Bypass Sensitive-Path Protection"
date: 2026-09-28
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "The MCP file tools in open-source note app SiYuan checked sensitive-path protection only on a recursive operation's root path, not on every path resolved beneath it — letting an already-authenticated admin use grep, copy, or unzip through the in-app Agent or an external MCP server to read or overwrite files that direct access was supposed to block."
tldr: "SiYuan (a self-hosted personal knowledge base) versions 3.8.0–3.8.3 checked their MCP file tools' sensitive-path guard only on the allowed root of a recursive operation, not on each descendant path resolved during it. That let file.grep, file.copy, and unzip read or overwrite conf.json, TLS keys, and other files the guard was supposed to protect (CVE-2026-100633, alongside three related path-traversal CVEs disclosed the same day). Fixed in v3.8.4; the vendor's advisory scopes this to an already-authenticated administrator and does not claim arbitrary code execution."
series:
  name: "AI Security Alert"
  order: 40
---

> 🌏 [中文版](/posts/daily/2026-09-28-security-siyuan-mcp-path-traversal)

## What Happened

Open-source, self-hosted personal knowledge base SiYuan disclosed a family of MCP (Model Context Protocol) file-tool path-traversal vulnerabilities on 2026-09-26 — CVE-2026-100633, plus three related CVEs (CVE-2026-100636, CVE-2026-100637, CVE-2026-100638) published the same day. The core problem: SiYuan had already fixed one "sensitive-path guard" bypass before (GHSA-c8r8-95hg-mp34), but that fix only validated the *allowed root* of a recursive operation — it never re-applied the same check to each path resolved while walking, copying, or extracting beneath that root. The result: an already-authenticated administrator, working through SiYuan's built-in Agent or an external MCP server, could use three native tools — `file.grep`, `file.copy`, and `unzip` — to read or overwrite files that direct access, like `conf/conf.json`, TLS keys, and publish-access settings, was explicitly supposed to block. The vendor patched this in v3.8.4 and explicitly scoped the report to stay within the administrator's own privilege boundary — it does not claim a privilege escalation to OS-level access or arbitrary code execution.

**Key Facts**

| Item | Detail |
|---|---|
| Type | Privilege escalation (MCP tool authorization bypass / incomplete sensitive-path guard) |
| Scope | SiYuan (self-hosted PKM) v3.8.0–3.8.3, reachable via the in-app Agent or an external MCP server |
| Severity | High (VulnCheck scores it 8.5 under CVSS v4.0; the vendor's GitHub advisory scores the same finding as Moderate 6.5 under CVSS v3.1) |
| CVE | CVE-2026-100633 (primary); related same-day disclosures: CVE-2026-100636, CVE-2026-100637, CVE-2026-100638 |
| Sources | [GitHub Security Advisory GHSA-9g6v-r3xf-673q](https://github.com/siyuan-note/siyuan/security/advisories/GHSA-9g6v-r3xf-673q), [VulnCheck Advisory](https://www.vulncheck.com/advisories/siyuan-3.8.0-through-3.8.3-path-traversal-via-mcp-file-operations), [NVD CVE-2026-100633](https://nvd.nist.gov/vuln/detail/CVE-2026-100633) |

## Attack Surface Analysis

SiYuan's MCP file tools already had a sensitive-path guard: `resolvePath()` in `kernel/mcp/tools/file.go` calls `util.IsForbiddenAbsPath()`, which directly blocks access to `conf/conf.json`, TLS keys, `data/.siyuan/publishAccess.json`, and similar files. The gap is that three *recursive* operations validate only the caller-supplied root and never re-check the individual paths that recursion expands into:

1. **`file.grep`** recurses through a directory using a bundled library (Gulu) that offers no authorization callback — once it reaches a protected descendant file, it returns its contents to the caller directly.
2. **`file.copy`** validates only the source and destination roots. Copying a directory clones any protected files inside hidden subdirectories (like `.siyuan`) to an ordinary, unprotected path, where a normal `file.read` can then retrieve them.
3. **`unzip`** validates only the archive path and the destination root, then extracts every member without re-checking each final path — letting an archive member with an ordinary, lexically-contained name overwrite a protected configuration file.

The root cause is a pattern worth generalizing: **authorization of a container path gets treated as authorization for every path later reached beneath it.** This maps to **OWASP LLM06 (Excessive Agency)** — the Agent's tools ended up with a broader file-access scope than the sensitive-path guard was designed to allow, and it echoes a recurring root cause across the wider wave of MCP CVEs disclosed in 2026: an authorization check enforced once at the entry point, but not re-applied at every path a tool actually opens or creates. It's worth noting the finding requires the attacker to already hold an authenticated administrator credential (`PR:H`) — this is fundamentally an agent tool overstepping its intended file-access boundary, not an unauthenticated external attack.

## Defenses

**Immediate actions**
- Check your SiYuan version — anything below **v3.8.4** is exposed; upgrade to patch the missing authorization check across all three recursive operations.
- Before upgrading, restrict who can reach the MCP server and the in-app Agent interface to the administrators who actually need it, to shrink the exposure window.
- Review whether any large-scale `grep`, `copy`, or `unzip` operations were run through the Agent or MCP recently; if so, check whether `conf/conf.json`, TLS keys, or publish-access settings were read or overwritten unexpectedly, and rotate any credentials found in them.

**Longer-term architecture**
- When designing MCP tools, put the sensitive-path check at **every actual file-open/file-create call site**, not only on a recursive operation's input parameters — this is exactly the gap both this bug and its predecessor fell into.
- Give agent tools per-action capability declarations (`ToolEffects`) instead of one global "safe action" bucket. Here, `file.grep` skipped both confirmation and snapshotting purely because "grep" was globally classified as safe — a finer-grained classification would have caught this.
- Add MCP server governance as a second layer beyond fixing the tool logic itself: watchlist vendor Netzilo offers MCP server runtime governance (allowlisting, call logging), while Invariant Labs focuses on detecting anomalous MCP tool descriptions and call patterns.

## Impact

SiYuan is a self-hosted personal knowledge base; only deployments that have **enabled the in-app Agent or an external MCP server** are exposed — the vendor's hosted service and installs without Agent/MCP enabled are unaffected. There's no evidence this was exploited in the wild: it was reported through a private vulnerability-disclosure channel, backed by a fully reproducible synthetic proof-of-concept, with no public issue, pull request, or advisory details released ahead of the fix. The vendor patched it in v3.8.4 and disclosed three additional path-traversal CVEs (in the `exportBrowserHTML`, `checkoutRepo`, and `setNotebookIcon` endpoints) the same day — evidence this followed a full security review of the MCP/Agent tool surface, not a one-off finding.

If your own agent stack exposes "recursive" file tools — batch search, batch copy, archive extraction — this is a concrete checklist item: confirm every one of them re-validates the *final* resolved path, rather than trusting the root path it was called with.

## Today's Takeaway

Most MCP security stories I've covered focus on either an unauthenticated MCP server or a malicious instruction hidden in a tool description. This one is a third pattern: **authentication was correct, the tool descriptions were clean, but the recursive/batch logic inside the tool itself never carried the authorization check all the way through.** Patching a "sensitive-path guard" once doesn't mean every call path is covered — the same protective wall can have a gap in the recursion, copy, or extraction code that looks, at a glance, like nothing more than a performance shortcut.

## References

- [GitHub Security Advisory GHSA-9g6v-r3xf-673q — Incomplete fix for GHSA-c8r8-95hg-mp34](https://github.com/siyuan-note/siyuan/security/advisories/GHSA-9g6v-r3xf-673q)
- [VulnCheck Advisory: SiYuan 3.8.0 through 3.8.3 Path Traversal via MCP File Operations](https://www.vulncheck.com/advisories/siyuan-3.8.0-through-3.8.3-path-traversal-via-mcp-file-operations)
- [NVD — CVE-2026-100633](https://nvd.nist.gov/vuln/detail/CVE-2026-100633)
- [VulDB — CVE-2026-100633](https://vuldb.com/cve/CVE-2026-100633)
- [Strix.ai — CVE-2026-100636](https://www.strix.ai/cve/CVE-2026-100636)
