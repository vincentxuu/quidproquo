---
title: "Security Alert | Three Client-Side Bugs in the Official MCP Inspector — a Malicious Server Could Escape Its Sandbox, Bypass CSP, or Freeze the UI (Fixed in v2.14.0)"
date: 2026-11-07
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "@modelcontextprotocol/inspector v2.14.0 fixes three privately reported vulnerabilities: a connected malicious MCP server could escape its approved App sandbox, use a javascript: URL or HTML injection to bypass review and CSP, or crash the UI with a malicious regex."
tldr: "The official MCP Inspector (@modelcontextprotocol/inspector) shipped v2.14.0 on Nov 4, fixing three privately reported bugs — GHSA-h9j8, GHSA-rwv7, GHSA-2fw8. A connected malicious MCP server could keep talking to Inspector after its App sandbox frame navigated away, open a javascript: URL or inject HTML to slip past review and CSP, or freeze the UI with a crafted regex in a tool's output schema. Affected versions are v2.0.0–2.13.0, with the ReDoS issue also reaching the legacy v1 line up to 1.0.3 — upgrade to v2.14.0 now (v1 users to 1.0.4)."
series:
  name: "AI Security Alert"
  order: 73
---

> 🌏 [中文版](/posts/daily/2026-11-07-security-mcp-inspector-client-vulnerabilities)

## What happened

`@modelcontextprotocol/inspector`, the standard client developers use to poke at any MCP server's tools, resources, and prompts, shipped v2.14.0 on November 4 with fixes for three vulnerabilities. All three came in through private reports handled via GitHub Security Advisory forks, and all three share the same theme: Inspector is supposed to treat a connected MCP server as untrusted input, but three separate client-side code paths quietly skipped that assumption. The practical result: if a developer points Inspector at a malicious or compromised MCP server, that server can break out of its approved App sandbox, run arbitrary JavaScript in Inspector's own browser origin, bypass the CSP meant to contain an HTML preview, or freeze the whole UI with a carefully crafted regular expression. There's no public evidence any of this has been exploited in the wild — all three were disclosed responsibly before going public — but the technical detail and reproduction steps are fully written up in their respective GHSA advisories.

**Key facts**

| Item | Detail |
|---|---|
| Type | Client-side trust-boundary failure (malicious MCP server attacking the developer's MCP client tooling) |
| Scope | `@modelcontextprotocol/inspector` v2 line, 2.0.0–2.13.0; the ReDoS issue also reaches the deprecated v1 line up to 1.0.3 |
| Severity | High (combined assessment across all three; see attack surface breakdown below) |
| CVE | None (tracked as three GHSAs: GHSA-h9j8-vj8g-v3gg, GHSA-rwv7-mh2c-ff2p, GHSA-2fw8-7jmw-r937) |
| Fixed in | v2 line ≥ 2.14.0; v1 line's ReDoS fix is 1.0.4 (the other two were not backported to v1) |
| Sources | [Official 2.14.0 release notes](https://github.com/modelcontextprotocol/inspector/releases/tag/2.14.0), [GHSA-h9j8-vj8g-v3gg](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-h9j8-vj8g-v3gg), [GHSA-rwv7-mh2c-ff2p](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-rwv7-mh2c-ff2p), [GHSA-2fw8-7jmw-r937](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-2fw8-7jmw-r937), [Penligent's technical write-up](https://www.penligent.ai/hackinglabs/mcp-inspector-security-update/) |

## Attack surface

Getting into position is easy for an attacker, because that's literally what Inspector is for: developers connect it to a server they haven't decided to trust yet, whether that's something they're still auditing themselves, a third-party package pulled from an MCP registry to try out, or a previously-trusted server whose release pipeline got poisoned by a supply-chain attack. The moment a developer connects Inspector to a source like that, the server gets a shot at three independent code paths at once.

The first is the Apps tab's sandboxed iframe (GHSA-h9j8-vj8g-v3gg). Inspector renders a server's App content inside an iframe sandboxed according to an approved CSP, but the original implementation never checked whether that frame had navigated away to a different document. The relay kept forwarding messages — including tool call results — to whatever document now occupied the frame, so a reviewer who thought the approved CSP still governed the interaction was wrong the moment navigation happened. The second is a cluster of input-handling bugs (GHSA-rwv7-mh2c-ff2p). A `server.json` import spliced server-supplied `runtimeArguments` straight into the launch command (`npx`, `uvx`, `docker run`) without filtering, while the review UI showed only a benign-looking package name — never the resolved command that was actually about to run, decoupling what a reviewer approves from what executes. The URL elicitation modal passed a server-supplied URL straight to `window.open()` without checking its scheme, so a `javascript:` or `data:` URL would run: clicking "Open in Browser" meant executing an attacker's JavaScript inside Inspector's own origin, with access to cookies and session data. And the HTML preview's CSP injector found `<head>` with a plain string match instead of parsing the document, so a crafted `<!-- <head> --> ` comment could steer the CSP meta tag into the comment instead of the real document head, leaving the actual preview free to run unrestricted inline scripts. The third is tool-output schema validation (GHSA-2fw8-7jmw-r937): a connected server can plant a malicious regex in a tool's declared output schema, and when Inspector later validates that tool's real output against it, the match can blow up into catastrophic backtracking — a classic ReDoS that freezes the UI. No code execution required, just a connection to a hostile server and one tool call.

All three trace back to the same structural gap: the codebase already had the right pattern somewhere else — an `isHttpUrl()` allowlist used elsewhere, proper HTML parsing instead of regex matching — it just wasn't applied consistently to every path that takes server-supplied input. Mapped to the OWASP LLM Top 10, this lands squarely on **LLM05 Supply Chain Vulnerabilities**: any MCP server a developer connects to is, by definition, a supply-chain dependency, and this incident shows the tool meant to audit that dependency is itself part of the attack surface. It also echoes **LLM07 Insecure Plugin Design** — MCP servers act as plugins, and a client should treat every URL, HTML blob, or schema a plugin supplies as untrusted input, not as something a review screen's summary can vouch for.

```diagram
title: Three Inspector trust boundaries a malicious MCP server can attack
desc: A malicious or compromised MCP server connected to Inspector can reach the developer's local environment through three independent client-side trust-boundary failures
caption: GHSA-h9j8-vj8g-v3gg / GHSA-rwv7-mh2c-ff2p / GHSA-2fw8-7jmw-r937, all fixed in v2.14.0 (the ReDoS issue also backported to v1.0.4)
---
<svg viewBox="0 0 680 360">
  <path class="dg-line dg-line--warn" d="M224,180 H232 Q240,180 240,172 V80 Q240,72 248,72 H256" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M224,180 H256" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M224,180 H232 Q240,180 240,188 V280 Q240,288 248,288 H256" marker-end="url(#arrow-warn)"/>

  <path class="dg-line" d="M456,72 H468 Q476,72 476,80 V172 Q476,180 484,180 H496" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456,180 H496" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456,288 H468 Q476,288 476,280 V188 Q476,180 484,180 H496" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--warn" x="16" y="148" width="208" height="64" rx="6"/>
  <text class="dg-label" x="120" y="172" text-anchor="middle" dominant-baseline="central">Malicious MCP server</text>
  <text class="dg-sub" x="120" y="192" text-anchor="middle" dominant-baseline="central">connected to Inspector</text>

  <rect class="dg-box" x="256" y="40" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="64" text-anchor="middle" dominant-baseline="central">Apps tab sandbox</text>
  <text class="dg-sub" x="356" y="84" text-anchor="middle" dominant-baseline="central">escapes, still relays</text>

  <rect class="dg-box" x="256" y="148" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="172" text-anchor="middle" dominant-baseline="central">Import / URL / preview</text>
  <text class="dg-sub" x="356" y="192" text-anchor="middle" dominant-baseline="central">bypasses CSP, hides args</text>

  <rect class="dg-box" x="256" y="256" width="200" height="64" rx="6"/>
  <text class="dg-label" x="356" y="280" text-anchor="middle" dominant-baseline="central">Output schema check</text>
  <text class="dg-sub" x="356" y="300" text-anchor="middle" dominant-baseline="central">malicious regex freezes UI</text>

  <rect class="dg-box" x="496" y="148" width="160" height="64" rx="6"/>
  <text class="dg-label" x="576" y="172" text-anchor="middle" dominant-baseline="central">Developer's machine</text>
  <text class="dg-sub" x="576" y="192" text-anchor="middle" dominant-baseline="central">browser and local process</text>
</svg>
```

## How to defend

**Do now**
- Upgrade `@modelcontextprotocol/inspector` to ≥ 2.14.0: `npx @modelcontextprotocol/inspector@latest`. If you're still on the deprecated v1 line, move to at least `1.0.4` — but v1 only backported the ReDoS fix, not the other two, so plan to move to v2.
- Don't assume the whole team is patched just because a terminal shows a new version number. Check the process or container actually serving the tool: `npm ls @modelcontextprotocol/inspector --depth=0`, `npm ls -g @modelcontextprotocol/inspector --depth=0`, or `mcp-inspector --version`, and confirm the old process has been restarted or rebuilt, with the browser reloaded afterward.
- Before upgrading, inventory which not-fully-trusted MCP servers you've connected Inspector to recently — a colleague's shared example server, an unaudited third-party package, a `server.json` test-installed from a public registry. If you have, review what the Apps tab rendered and what got imported or launched during that session, and rotate any credentials that session could have reached.

**Long term**
- Treat "pointing Inspector at a server you don't yet trust" as the risky operation it is: do it in a disposable container with no local mounts and no production credentials, not on a dev machine carrying real keys.
- Treat a `server.json` import with the same scrutiny as installing a new npm package: run it through an allowlist and behavior scan — Snyk's Agent Scan (formerly Invariant Labs) or Netzilo's MCP server runtime governance are both options — rather than trusting the package name a review screen shows. GHSA-rwv7 is a direct demonstration that the displayed name and the executed command can diverge.
- Add continuing regression tests for any client code that parses third-party URLs, HTML, or regular expressions, rather than treating one fix as permanent coverage. Penligent's write-up lists the sandbox-navigation smoke test and pattern-validator tests the project itself added — a reasonable template to copy.

## Impact

Anyone running `@modelcontextprotocol/inspector` in the 2.0.0–2.13.0 range (or the legacy v1 line up to 1.0.3) is in scope. Because Inspector is the de facto standard tool for debugging and auditing MCP servers, the installed base is large — nearly everyone building or reviewing MCP servers has it. But actual exposure is narrower: it requires having connected Inspector to a malicious or already-compromised server and interacted with it — rendering an App, importing a `server.json`, opening an elicitation URL, or calling a tool. All three bugs were privately reported and fixed through GHSA's private-fork process before disclosure, and there's no evidence of in-the-wild exploitation. But the PoCs are fully documented in the advisories, and the bar isn't high — especially for the URL elicitation bug, which could be packaged inside an MCP server that otherwise looks like an ordinary tool and quietly harvest Inspector's browser-origin cookies and session data without the developer noticing anything.

## Takeaway

This incident is a reminder that the MCP ecosystem's usual threat model runs backward from where it should in one specific case: most conversations about MCP security focus on a malicious client abusing a server, or a malicious server abusing the agent that's connected to it, and rarely count the tool a developer uses to evaluate a server as part of the attack surface. But that's exactly what Inspector is for — poking at a server before you've decided to trust it — which means, by definition, every server it connects to should be assumed hostile. These three bugs show that even an officially maintained tool treated as a security baseline didn't apply that assumption consistently on every input path. The gap between what a review screen shows and what actually executes is worth checking specifically in any tool — MCP or not — that exists to let a human approve something before it runs.

## References

- [modelcontextprotocol/inspector — Release 2.14.0](https://github.com/modelcontextprotocol/inspector/releases/tag/2.14.0)
- [GHSA-h9j8-vj8g-v3gg — App sandbox iframe can be navigated out of its policy](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-h9j8-vj8g-v3gg)
- [GHSA-rwv7-mh2c-ff2p — server.json import, URL elicitation, and HTML preview CSP injection](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-rwv7-mh2c-ff2p)
- [GHSA-2fw8-7jmw-r937 — ReDoS in tool output schema validation](https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-2fw8-7jmw-r937)
- [Penligent — MCP Inspector 2.14.0: Security Fixes and Version Checks](https://www.penligent.ai/hackinglabs/mcp-inspector-security-update/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
