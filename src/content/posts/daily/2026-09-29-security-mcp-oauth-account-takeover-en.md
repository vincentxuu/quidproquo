---
title: "Security Alert: MCP Python SDK OAuth Account Takeover — a Check That Never Ran Is Harder to Catch Than a Check That's Wrong"
date: 2026-09-29
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Security firm Cycode disclosed that Anthropic's MCP Python SDK, versions 1.9.1–2.1.1, skips issuer validation and credential binding on its OAuth discovery fallback path — letting a malicious MCP server steal a client's secret, authorization code, and PKCE proof key to complete a full account takeover."
tldr: "When the MCP Python SDK acts as an OAuth client against an untrusted MCP server, a 404 on the modern discovery request pushes it onto a legacy fallback path that runs no issuer-identity check and no credential binding at all. An attacker only has to make their fake login configuration claim to be the victim's real identity provider, and a single login flow that looks completely normal hands over the client secret, authorization code, and PKCE proof key — full account takeover. Anthropic shipped a fix in mcp 2.2.0 / 1.30.0. Defense: upgrade, clear cached OAuth client registrations, and rotate the client secret if you may have connected to an untrusted server before patching."
series:
  name: "AI Security Alert"
  order: 41
---

> 🌏 [中文版](/posts/daily/2026-09-29-security-mcp-oauth-account-takeover)

## What happened

On 2026-09-28, security firm Cycode disclosed a high-severity OAuth flaw in Anthropic's MCP (Model Context Protocol) Python SDK: when the SDK acts as a client connecting to an MCP server and falls onto the "discovery failed, use the legacy path" branch, it skips issuer-identity validation and credential binding entirely. A malicious or compromised MCP server can exploit this gap during what looks like a completely ordinary, user-approved login flow — walking away with the client secret, the authorization code, and the PKCE proof key that's supposed to prevent exactly this kind of theft, enough for a full account takeover. The affected versions are `mcp` 1.9.1–1.29.1 (no check on any path) and 2.0.0–2.1.1 (checks missing on specific fallback paths), spanning all three OAuth providers (`OAuthClientProvider`, `ClientCredentialsOAuthProvider`, `PrivateKeyJWTOAuthProvider`). Cycode reported the issue through Anthropic's MCP security process under coordinated disclosure; the fix shipped in `mcp` 2.2.0 and 1.30.0.

**Key facts**

| Item | Value |
|---|---|
| Incident type | OAuth account takeover (unvalidated discovery fallback path) |
| Scope | `mcp` (MCP Python SDK) 1.9.1–1.29.1, 2.0.0–2.1.1, used as an HTTP client with `OAuthClientProvider` / `ClientCredentialsOAuthProvider` / `PrivateKeyJWTOAuthProvider` |
| Severity | High (interactive provider CVSS 6.5; machine-to-machine providers CVSS 7.5) |
| CVE | No public CVE identifier found (fixed directly through coordinated disclosure) |
| Sources | [Cycode](https://cycode.com/blog/mcp-python-sdk-oauth-account-takeover/), [Security Boulevard](https://securityboulevard.com/2026/09/cycode-uncovers-account-takeover-in-anthropics-mcp-python-sdk/) |

## Attack surface analysis

The MCP client's OAuth discovery has a key safeguard by design: the client first asks the server "who handles your logins," gets back a URL, fetches that URL's configuration, and checks whether the configuration's self-declared issuer matches the URL it started with — this catches a server lying about its identity provider. But when the server returns 404 to that first request (meaning it doesn't support modern discovery), the SDK falls back to an older method: asking the server itself directly for the login configuration. On that fallback path, the URL from step one was never obtained, so internally it's `None`, and the safety check is written as "validate only if we have a URL" (`if self.context.auth_server_url is not None`). No URL means the validation doesn't fail — it never runs at all.

Triggering this requires nothing from the attacker but returning 404 on the modern discovery request. The SDK then asks the attacker's server directly for login configuration and points the "login page URL" at the victim's real identity provider — Google, Okta, Azure AD, whatever it is. The user sees the genuine login page with genuine credentials and approves without hesitation. The resulting authorization code, along with the client secret and PKCE proof key the SDK bundles with it, then gets sent to whatever "token endpoint" the attacker's configuration specifies — not the real identity provider. The second safeguard, credential binding, fails to catch this because it checks against the same attacker-controlled issuer field: the attacker simply names the victim's real provider, and the check reads as a match. A third safeguard, audience binding on the authorization code, only runs on the modern discovery path too, so on the fallback path the stolen code works anywhere. Three independently designed protections all trust the same unvalidated, attacker-controlled input.

Mapped to the OWASP LLM Top 10, this sits under **LLM03 Supply Chain** (trusting an unvetted MCP server component) and extends into what Cycode frames as a general "conditional safety check" anti-pattern: a check that only runs when certain data is present, where the attacker controls whether that data exists. The missing value isn't flagged as unvalidated — it flows forward and actively satisfies the next check as if it were trusted input.

## Defense

**Immediate actions**
- Check your installed `mcp` version: `pip show mcp | grep Version`; upgrade if you're below 2.2.0 (2.x line) or 1.30.0 (1.x line)
- If you use `ClientCredentialsOAuthProvider` or `PrivateKeyJWTOAuthProvider`, explicitly pass `issuer=` (e.g. `issuer="https://auth.example.com"`) after upgrading — omitting it triggers a deprecation warning now and becomes an error in 3.0
- After upgrading, clear any OAuth client registrations cached by older SDK versions so the client re-registers with the new identity-provider label attached
- If your client may have connected to a less-than-fully-trusted MCP server before patching, assume the client secret is compromised: rotate it and revoke tokens at your identity provider

**Long-term architecture**
- Vet MCP servers before connecting (watch for typosquatting and directory impersonation); don't let an agent pick and connect to servers from an unvetted catalog on its own
- Use MCP server runtime-governance tooling like Netzilo to allowlist connectable servers, removing the attack precondition that "the user never actually chose the server"
- Use MCP-focused security scanning tools like Invariant Labs to catch protocol-level logic flaws — like a discovery fallback path that skips validation — rather than relying only on known-CVE checks
- Favor short-lived, auto-rotating OAuth client secrets; a long-lived secret that leaks means revoking one token or code doesn't actually cut off the attacker

## Impact

Cycode hasn't published numbers on real-world exploitation — this was proactively discovered and disclosed through Anthropic's coordinated security process, with a fix landing ahead of any known in-the-wild abuse. But the exposure is broad: any application using the MCP Python SDK as an HTTP client that might connect to a not-fully-controlled MCP server is in scope, especially the increasingly common patterns of agents picking and connecting to servers on their own, or installing servers from public directories — both of which strip the user of any real say in which server they're actually approving. Local (stdio) clients and clients that attach their own tokens aren't affected. If your agent pipeline can dynamically discover or install MCP servers, this is a good prompt to re-examine whether users are ever actually approving the connection target itself, not just the login page that follows it.

## Takeaway

Prior MCP incidents in this series typically failed because a check's logic was written wrong. This one is different: three independently designed safety checks were each individually correct, but all shared the same implicit assumption — "validate only if the data exists." The attacker doesn't need to beat any single check; making the validated data absent from the start makes every check pass by omission, not by verification. The lesson: reviewing an auth flow means asking not just "what does this code do on the happy path" but "on every fallback branch, does this validation still actually run."

## References

- [Cycode — Cycode Uncovers Account Takeover in Anthropic's MCP Python SDK](https://cycode.com/blog/mcp-python-sdk-oauth-account-takeover/)
- [Security Boulevard — Cycode Uncovers Account Takeover in Anthropic's MCP Python SDK](https://securityboulevard.com/2026/09/cycode-uncovers-account-takeover-in-anthropics-mcp-python-sdk/)
- [Model Context Protocol — Authorization Specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
