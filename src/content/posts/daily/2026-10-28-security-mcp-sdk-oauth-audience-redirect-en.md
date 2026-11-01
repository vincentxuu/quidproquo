---
title: "Security Alert: Four MCP SDK Advisories Land the Same Day — Upgrading Doesn't Close the Token Bug"
date: 2026-10-28
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "The GitHub Advisory Database published four security advisories for the official MCP SDKs on the same day. The fix for the most serious one — an OAuth token audience check — ships turned off by default, so upgrading the package version alone doesn't actually close the hole."
tldr: "The official Python SDK (mcp) and TypeScript SDK (@modelcontextprotocol/sdk) for the Model Context Protocol had four security advisories published on GitHub's Advisory Database on October 27, 2026: CVE-2026-116684 (server-side OAuth bearer tokens aren't checked against their audience claim, CVSS 6.8), CVE-2026-116685 (the client follows cross-origin redirects and forwards credentials along with them, CVSS 5.9), CVE-2026-116686 (the client fetches untrusted $ref URLs while validating tool output schemas, an SSRF/DoS path, CVSS 6.5), and GHSA-f897-62hf-6gxq (the TypeScript server has no request-size limit, CVSS 7.5, no CVE assigned). Fixed releases shipped months earlier — Python on September 7, TypeScript on October 2 — but the most important fix, the audience check, is opt-in and off by default. Bumping the package version does not turn it on."
series:
  name: "AI Security Alert"
  order: 66
---

> 🌏 [中文版](/posts/daily/2026-10-28-security-mcp-sdk-oauth-audience-redirect)

## What happened

On October 27, 2026, the GitHub Advisory Database published four security advisories for the official Model Context Protocol (MCP) SDKs on the same day: three against the Python SDK (the `mcp` package on PyPI) and one additional advisory with no assigned CVE against the TypeScript SDK (`@modelcontextprotocol/sdk` on npm); a related TypeScript flaw had already gone public a week earlier. The most serious is a server-side bug where bearer tokens aren't checked against their OAuth audience (`aud`) claim — anyone running an MCP server that shares an OAuth authorization server with other internal services is exposed. Fixed releases had actually shipped months before the advisories went public (Python on September 7, TypeScript on October 2), but the audience check that fixes the most serious flaw ships as an opt-in setting that's off by default. Bumping your package version alone does not close this hole, which is the part of this story worth writing down. None of the four advisories reports evidence of exploitation in the wild.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | MCP official SDK authorization bypass (OAuth token confusion) + cross-origin redirect credential leak + client-side SSRF |
| Scope | PyPI `mcp` 1.8.0–1.29.1 and 2.0.0–2.1.1; npm `@modelcontextprotocol/sdk` < 1.32.0 and corresponding 2.x packages |
| Severity | Medium–High (CVSS 5.9–7.5 depending on the specific flaw) |
| CVE | CVE-2026-116684, CVE-2026-116685, CVE-2026-116686 (Python); CVE-2026-111769, CVE-2026-111771 (TypeScript, disclosed a week earlier); GHSA-f897-62hf-6gxq (TypeScript, no CVE) |
| Sources | [GitHub Advisory GHSA-w4fh-qvv9-3v23](https://github.com/advisories/GHSA-w4fh-qvv9-3v23), [GitHub Advisory GHSA-5h93-6whr-6q8j](https://github.com/advisories/GHSA-5h93-6whr-6q8j), [NVD CVE-2026-116684](https://nvd.nist.gov/vuln/detail/CVE-2026-116684), [Yaami Labs analysis](https://yaamlabs.com/blog/mcp-sdk-token-audience-cves) |

## Attack surface

CVE-2026-116684, the headline flaw, shows up in an architecture that's common at larger organizations: one OAuth authorization server (an Entra ID, Okta, or Keycloak tenant) issues tokens to several internal services at once, and each token carries an `aud` (audience) claim naming which service it was issued for. Per spec, a resource server should refuse any token whose audience isn't itself, even if the signature checks out. The Python SDK's server-side bearer authentication (`AuthSettings` with a `token_verifier`) never performed that check, and neither did the TypeScript SDK's `requireBearerAuth()` or `verifyBearerToken()`. If a developer's own `verify_token()` only checked the signature and expiry, a token meant only for, say, a CRM API could be handed straight to the MCP server and get in — the equivalent of flashing another department's badge and having the door open anyway.

CVE-2026-116685 sits on the client side. The Python SDK's Streamable HTTP and SSE transports used to follow HTTP redirects to any origin. If a trusted MCP endpoint ever redirected cross-origin — a stale domain that lapsed and got squatted, a misconfigured proxy rule, or redirect logic an attacker could influence — custom auth headers like `X-API-Key` traveled with the request, and on 307/308 redirects the request body went too. CVE-2026-116686 is a client-side schema issue: when a server declares an `outputSchema` for a tool, the client validated results using `jsonschema`'s default resolver, which fetches any `$ref` it can't resolve locally. A malicious server only needs to point that reference at an `http://`, `https://`, or `file://` location, and the client fetches it on every call — an SSRF path with no timeout, so one slow target can hang every session in the process.

Mapped to the OWASP LLM Top 10: **LLM05 Supply Chain Vulnerabilities** (the official SDK is scattered across container images and vendored tooling, and a fix existing in the changelog doesn't mean a dependency scanner marks every copy as resolved) plus **LLM06 Excessive Agency** (an MCP server hands out access to tools that touch the filesystem, databases, and cloud APIs to anyone holding a correctly signed token, regardless of who it was actually issued for).

```diagram
title: The token-confusion chain behind CVE-2026-116684
desc: A token issued to Service A by a shared OAuth authorization server gets handed straight to an MCP server that never checks its audience claim
---
<svg viewBox="0 0 680 420">
  <path class="dg-line" d="M340 76V100" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 156V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 236V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M340 316V340" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="140" y="20" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="39" text-anchor="middle" dominant-baseline="central">OAuth authorization server</text>
  <text class="dg-sub" x="340" y="59" text-anchor="middle" dominant-baseline="central">serves both Service A and MCP Server B</text>

  <rect class="dg-box" x="140" y="100" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="128" text-anchor="middle" dominant-baseline="central">issues a token with aud = Service A</text>

  <rect class="dg-box" x="140" y="180" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="208" text-anchor="middle" dominant-baseline="central">holder sends the same token to MCP Server B</text>

  <rect class="dg-box" x="140" y="260" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="279" text-anchor="middle" dominant-baseline="central">SDK checks only signature and expiry</text>
  <text class="dg-sub" x="340" y="299" text-anchor="middle" dominant-baseline="central">never verifies aud matches itself</text>

  <rect class="dg-box dg-box--warn" x="140" y="340" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="359" text-anchor="middle" dominant-baseline="central">access granted</text>
  <text class="dg-sub" x="340" y="379" text-anchor="middle" dominant-baseline="central">attacker now holds MCP Server B's tool access</text>
</svg>
```

## Mitigations

**Do now**
- Inventory every copy of the SDK: `pip show mcp` or `uv pip list | grep mcp`; for Node projects run `npm ls @modelcontextprotocol/sdk @modelcontextprotocol/server @modelcontextprotocol/client` — check container images and anything vendored into other agent tooling, not just the main repo
- Upgrade: Python `mcp` ≥ 1.30.0 or ≥ 2.2.0; TypeScript 1.x `@modelcontextprotocol/sdk` ≥ 1.32.0; TypeScript 2.x needs `@modelcontextprotocol/server`, `client`, `node`, `hono`, and `express` each updated individually
- **Then take the extra step**: in Python, set `AuthSettings.validate_token_resource = True`, set `resource_server_url`, and have `verify_token()` return the token's audience. In TypeScript, pass `expectedResource` to `requireBearerAuth()`. This check is opt-in — flip both sides together, because setting only `resource_server_url` without `validate_token_resource` turns every request into a 401
- If you can't upgrade right away: manually reject tokens whose `aud` doesn't include your service inside your own `verify_token()`/`verifyAccessToken()`, and supply your own `httpx` client with `follow_redirects` kept at `False` on the client side

**Longer term**
- Add a standing CI test: send a token with the wrong audience and assert a 401 — so a later refactor can't silently turn this opt-in check back off without anyone noticing
- Don't treat a dependency scanner marking a version "fixed" as the end of the audit; this incident's lesson is that a version past the fix line can still ship with the actual protection turned off, so check the configuration too
- Use Snyk's Agent Scan (formerly Invariant Labs) to inventory MCP SDK versions and tool chains across projects, paired with WitnessAI for enterprise agent traffic visibility, watching for the same token being replayed against different MCP endpoints

## Impact

Python's fix shipped on September 7 and TypeScript's on October 2, but the CVEs didn't land in the database until October 27 — nearly two months where an ordinary dependency scanner, which matches against the CVE database rather than release notes, wouldn't have flagged anything. Worse, if your environment happened to upgrade to the fixed version during that window, you're still exposed to the same bug, because the audience check defaults to off — the version number just looks safe. None of the advisories reports exploitation in the wild, and an attacker still needs to get hold of a legitimately issued token for some other service first, which isn't a trivial bar. But that bar is easy to clear inside any organization that already shares one OAuth authorization server across internal services, which is a common setup. If your MCP server sits behind enterprise SSO and relies on the official SDK's default verification logic, this is worth checking today.

## Today's gap

The usual habit is "dependency scanner is green, so we're safe." This incident breaks that assumption whenever a fix ships opt-in: the version number can be past the fix line while the actual protection is still switched off, and a scanner has no visibility into that setting — it only reads the version. It's a reminder that auditing a security update means asking not just "did we upgrade" but "did we actually turn the fix on."

## References

- [GitHub Advisory GHSA-w4fh-qvv9-3v23 — Model Context Protocol Python SDK: Server bearer authentication accepts tokens issued for a different resource](https://github.com/advisories/GHSA-w4fh-qvv9-3v23)
- [GitHub Advisory GHSA-5h93-6whr-6q8j — HTTP client transports followed cross-origin redirects carrying custom headers and bodies](https://github.com/advisories/GHSA-5h93-6whr-6q8j)
- [GitHub Advisory GHSA-f897-62hf-6gxq — TypeScript MCP server has no request size/batch limits](https://github.com/advisories/GHSA-f897-62hf-6gxq)
- [NVD — CVE-2026-116684](https://nvd.nist.gov/vuln/detail/CVE-2026-116684)
- [Yaami Labs — MCP SDK fixes: the token audience check ships switched off](https://yaamlabs.com/blog/mcp-sdk-token-audience-cves)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
