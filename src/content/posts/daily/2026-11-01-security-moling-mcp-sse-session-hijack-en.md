---
title: "AI Security Alert: MoLing MCP Server's Unauthenticated SSE Mode Leaks Sessions via Wildcard CORS"
date: 2026-11-01
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "MoLing, a computer-use MCP server, runs its /sse and /message endpoints with no auth in SSE mode, and the underlying mcp-go library hardcodes a wildcard CORS header — any web page can steal a session and call its file/command tools. CVSS 9.6."
tldr: "CVE-2026-62863: MoLing (a file-ops and browser-control MCP server) ships /sse and /message endpoints with zero authentication when started in SSE mode (`-l` flag), and its mcp-go dependency sets Access-Control-Allow-Origin: * on every response. Any page the victim visits can open an EventSource to /sse, read the leaked sessionId, and replay it against /message to invoke whatever MCP tools are configured — file read/write, shell commands, or browser control. Binding to 127.0.0.1 doesn't help, since the attack runs from the victim's own browser. Fixed in v0.5.0 with bearer-token auth and a CORS-stripping middleware."
series:
  name: "AI Security Alert"
  order: 69
---

> 🌏 [中文版](/posts/daily/2026-11-01-security-moling-mcp-sse-session-hijack)

## Summary

MoLing is a dependency-free, locally-run MCP server written in Go that bills itself as a personal office assistant: it reads and writes files, runs shell commands, and drives a browser, all through direct OS APIs. Security researchers Songwu, Zeyu Luo, Dr. CAO Yinfeng, and Kevin found that when a user starts MoLing in SSE (Server-Sent Events) mode with the `-l` flag, its `/sse` and `/message` HTTP endpoints accept requests from anyone — no authentication at all — and the underlying `mcp-go` library adds `Access-Control-Allow-Origin: *` to every response, tearing down the browser's same-origin protections in the process. If the victim simply visits a malicious page while MoLing is running, that page can silently grab a one-time `sessionId` and use it to issue arbitrary MCP tool calls. GitHub assigned CVE-2026-62863, rated 9.6 Critical on CVSS 3.1.

**Key facts**

| Field | Value |
|---|---|
| Incident type | Privilege Escalation / Session Hijack (missing auth + CORS misconfiguration in an MCP server) |
| Scope | `gojue/moling` versions before 0.5.0, run with the `-l` (SSE mode) flag |
| Severity | Critical (CVSS 3.1 9.6, `AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:L`) |
| CVE | [CVE-2026-62863](https://www.cve.org/CVERecord?id=CVE-2026-62863) (CWE-306 missing authentication, CWE-942 overly permissive cross-domain policy) |
| Sources | [GitHub Security Advisory GHSA-qpgh-hp5g-4vwp](https://github.com/gojue/moling/security/advisories/GHSA-qpgh-hp5g-4vwp), [OpenCVE](https://app.opencve.io/cve/CVE-2026-62863), [TheHackerWire](https://www.thehackerwire.com/cve-2026-62863-moling-mcp-server-unauthenticated-cross-origin-session-hijack-to-arbitrary-command-execution/) |

## Attack surface

The entire attack happens inside the victim's own browser — the attacker never has to touch the victim's machine directly. The victim starts MoLing in SSE mode (`moling -l 127.0.0.1:6789`), then browses to a page the attacker controls (or one that's been compromised to serve malicious script). That page quietly opens `new EventSource('http://127.0.0.1:6789/sse')` in the background. Because MoLing's response carries `Access-Control-Allow-Origin: *`, the browser lets the cross-origin page read a connection it should have blocked under the same-origin policy. MoLing broadcasts a `sessionId` over the `endpoint` event when the connection opens; the attacker's page reads that value and immediately replays it against `/message?sessionId=<stolen value>`, impersonating the victim to call whatever MCP tools are configured — file I/O, shell execution, or browser automation.

```diagram
title: MoLing's SSE session-theft attack chain
desc: A malicious page reads MoLing's sessionId through the wildcard CORS header, then replays it to call MCP tools
step: Malicious page opens a cross-origin EventSource connection to MoLing
step: MoLing's wildcard CORS lets the read through; the sessionId leaks to the page
step: The page replays the stolen sessionId against the /message tool endpoint
step: MoLing executes the tool call and returns the result to the page
caption: Precondition — the victim already started MoLing in SSE mode with -l, and has the malicious page open in a browser tab
---
<svg viewBox="0 0 400 320">
  <line class="dg-rule" x1="84" y1="72" x2="84" y2="284"/>
  <line class="dg-rule" x1="304" y1="72" x2="304" y2="284"/>

  <g data-step="1">
    <path class="dg-line" d="M84 120H296" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="192" y="108" text-anchor="middle" dominant-baseline="central">GET /sse</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M300 164H88" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="192" y="152" text-anchor="middle" dominant-baseline="central">sessionId leak</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M84 208H296" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="192" y="196" text-anchor="middle" dominant-baseline="central">POST /message</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M300 252H88" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="192" y="240" text-anchor="middle" dominant-baseline="central">tool result</text>
  </g>

  <rect class="dg-box" x="300" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="300" y="196" width="8" height="68" rx="2" data-step="3 4"/>

  <rect class="dg-box" x="12" y="24" width="144" height="48" rx="6"/>
  <text class="dg-label" x="84" y="42" text-anchor="middle" dominant-baseline="central">Malicious page</text>
  <text class="dg-sub" x="84" y="60" text-anchor="middle" dominant-baseline="central">attacker-controlled</text>
  <rect class="dg-box" x="232" y="24" width="144" height="48" rx="6"/>
  <text class="dg-label" x="304" y="42" text-anchor="middle" dominant-baseline="central">MoLing</text>
  <text class="dg-sub" x="304" y="60" text-anchor="middle" dominant-baseline="central">SSE mode, no auth</text>
</svg>
```

Two problems stack on top of each other here. First, `/sse` and `/message` have no authentication mechanism at all (CWE-306, missing authentication for a critical function). Second, the `mcp-go` library hardcodes `Access-Control-Allow-Origin: *` on SSE responses (CWE-942, overly permissive cross-domain policy), which strips away the browser-side defense that would otherwise have blocked cross-site reads. GitHub's advisory flags a common wrong assumption here: binding the listener to `127.0.0.1` doesn't help, because the connection is initiated by the victim's own browser from localhost — loopback binding is irrelevant to whether this attack works.

This maps to **OWASP LLM06, Excessive Agency**: once an MCP tool is granted filesystem and command-execution capability, anyone who can impersonate the session gets the same privileges, and MoLing's auth layer never separated "who can call a tool" from "what the tool is allowed to do." Zoom out, and it's also another case of a downstream project inheriting a dangerous default (wildcard CORS) straight from an upstream library — the same systemic gap that recent MCP ecosystem surveys have flagged, with one finding 91.8% of tested public servers running with no OAuth at all.

## Defense

**Do now**
- Upgrade `gojue/moling` to v0.5.0 or later. The new version adds `sseSecurityMiddleware`, which requires every request to carry `Authorization: Bearer <token>` or a `?token=` query parameter, checked with `crypto/subtle.ConstantTimeCompare` to avoid timing attacks
- If you can't upgrade yet: don't run MoLing with `-l` (SSE mode) on a machine that might browse untrusted sites, and consider pausing SSE exposure entirely in the meantime
- Audit every MCP server you run over SSE/HTTP for the same `Access-Control-Allow-Origin: *` response header — this isn't unique to MoLing, it's a default baked into the `mcp-go` library that any project built on it should re-check

**Longer term**
- MCP server auth shouldn't depend on an assumption about what sites the user might browse. Any MCP server that accepts HTTP/SSE connections should require a token or stronger auth by default, not bolt it on after a disclosure
- Apply least-privilege scoping to MCP tools that can touch the filesystem or run commands, so a single hijacked session doesn't translate into full host access
- Add routine MCP server scanning to your pipeline — Snyk's [Agent Scan](https://github.com/snyk/agent-scan) (formerly Invariant Labs) and Cisco's [mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner) both check for tool poisoning, over-broad permissions, and SSRF; CORS misconfiguration belongs in that same routine-audit bucket

## Impact

No public PoC has shown up in open research repositories yet, and both TheHackerWire and CISA's enrichment list it as unexploited in the wild, with an EPSS score under 1% — this is still at the disclosure stage, not an active-attack stage. But the attack complexity is low (no privileges required, just a browser visit), and because MoLing is specifically a local office-assistant tool with filesystem and command-execution capability, a single visit to the wrong page can mean local files leaked or arbitrary commands run.

If your agent stack runs any MCP server over HTTP/SSE, treat this as a prompt to go check: look for `Access-Control-Allow-Origin: *` in the response headers, confirm there's an enforced auth layer, and don't assume "only bound to localhost" means safe.

## Takeaway

I'd always treated "bound to 127.0.0.1" as the last line of defense for a local service — this is the first time it clicked that when the attack rides in through the victim's own browser, that line does nothing at all, because the browser is already standing on the localhost side of the fence. The CORS header is the actual switch that decides who gets to read the response. Worth remembering when auditing local MCP servers: "is a port exposed" and "is CORS configured correctly" are two separate questions, not one.

## References

- [GitHub Security Advisory GHSA-qpgh-hp5g-4vwp — MoLing SSE auth bypass and CORS wildcard](https://github.com/gojue/moling/security/advisories/GHSA-qpgh-hp5g-4vwp)
- [CVE-2026-62863 — OpenCVE full record (CVSS, CWE, fixed version)](https://app.opencve.io/cve/CVE-2026-62863)
- [CVE-2026-62863: MoLing MCP Server Unauthenticated Cross-Origin Session Hijack to Arbitrary Command Execution — TheHackerWire](https://www.thehackerwire.com/cve-2026-62863-moling-mcp-server-unauthenticated-cross-origin-session-hijack-to-arbitrary-command-execution/)
- [Fix PR #48 (adds token auth and CORS-stripping middleware)](https://github.com/gojue/moling/pull/48)
- [v0.5.0 release notes](https://github.com/gojue/moling/releases/tag/v0.5.0)
- [gojue/moling project page](https://github.com/gojue/moling)
- [Snyk Agent Scan (formerly Invariant Labs' mcp-scan)](https://github.com/snyk/agent-scan)
- [Cisco mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner)
