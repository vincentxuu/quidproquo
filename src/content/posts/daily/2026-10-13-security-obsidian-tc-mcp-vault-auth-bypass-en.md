---
title: "Security Alert | Three Flaws in an Obsidian MCP Server — Cross-Vault Takeover and a DNS-Rebinding Bypass"
date: 2026-10-13
category: daily
tags: [ai-agent, security, daily, prompt-injection, privilege-escalation]
lang: en
description: "obsidian-tc, a multi-vault MCP server for Obsidian, shipped three disclosed flaws: one rated CVSS 9.9 lets any valid token read, write, or delete a different vault, and another lets a malicious web page hijack a local vault via DNS rebinding"
tldr: "obsidian-tc — a 163-tool, multi-vault-native MCP server for Obsidian — shipped three GitHub Security Advisories on the same day: CVE-2026-77366 (CVSS 9.9), where tokens aren't bound to a vault so any valid token can read, write, or delete a different configured vault; CVE-2026-77363 (CVSS 8.8), where the Streamable HTTP transport skips Origin/DNS-rebinding checks, so under the documented loopback default (auth.mode: none) a malicious web page can grab full vault access; and CVE-2026-77364 (CVSS 6.5), an information disclosure bug. All three are fixed in 1.3.1. Defense: upgrade now, stop using auth.mode none, and verify tokens actually carry a vault claim."
series:
  name: "AI Security Alert"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-13-security-obsidian-tc-mcp-vault-auth-bypass)

## What happened

`obsidian-tc` (Obsidian Turbocharged) bills itself as a "governed, agent-ready" MCP server for Obsidian: 163 tools across 31 domains, built from the ground up to serve multiple vaults, letting agents like Claude Code or Cursor read and write a user's notes directly. On 2026-10-12, maintainer The-40-Thieves published three GitHub Security Advisories in one day, each assigned a new CVE: CVE-2026-77366 (CVSS 9.9, Critical), CVE-2026-77363 (CVSS 8.8, High), and CVE-2026-77364 (CVSS 6.5, Medium). The most severe lets any legitimate user's token read, write, or delete someone else's vault. The second is a familiar failure mode for local MCP servers — DNS rebinding — where a malicious web page alone can grab full vault access in the background. All three are fixed in version 1.3.1.

**Key facts**

| Field | Value |
|---|---|
| Attack type | Privilege escalation + access control bypass (MCP server) |
| Scope | Every `obsidian-tc` install below 1.3.1 — npm package, Docker image, `.mcpb` bundle, and standalone binaries alike |
| Severity | Critical (CVE-2026-77366, CVSS 9.9) + High (CVE-2026-77363, CVSS 8.8) |
| CVE | CVE-2026-77366, CVE-2026-77363, CVE-2026-77364 |
| Sources | [GitHub Security Advisory GHSA-pqh8-4pj7-32xx](https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-pqh8-4pj7-32xx), [Strix CVE-2026-77366](https://www.strix.ai/cve/CVE-2026-77366), [Strix CVE-2026-77363](https://www.strix.ai/cve/CVE-2026-77363) |

## Attack surface

The two main flaws are two faces of the same root problem: **the server treated "a request that looks legitimate" as proof of authorization, instead of actually verifying identity and scope server-side.**

CVE-2026-77366 (CVSS 9.9) sits in the tool-dispatch layer. When the server receives a tool call, it reads the caller-supplied `input.vault` field to decide which vault to operate on — but never checks that value against the vault the calling token was actually issued for, because the JWT carries no `vault` claim at all, and the folder-level access control list is shared globally across every vault. In practice, anyone holding any valid token — even one meant to be scoped to their own, single vault — can simply change the `input.vault` parameter and land on a different vault configured on the same server, then read, write, or delete it. This is a textbook **IDOR / confused deputy**: the server trusted the scope the caller claimed rather than the scope the server itself had bound to that caller.

CVE-2026-77363 (CVSS 8.8) is an older, more familiar attack surface. The Streamable HTTP transport was built without `enableDnsRebindingProtection`, `allowedHosts`, or `allowedOrigins`, and never validates the `Origin` header. The documented loopback default is `auth.mode: "none"` — the assumption being "only the local machine can reach this, so why bother." DNS rebinding exists precisely to break that assumption: a malicious web page first points its domain at a legitimate external IP to pass the browser's same-origin check, then swaps the DNS record to `127.0.0.1` once the page has loaded, so the browser still believes it's talking to the same origin while its requests are actually landing on the local `http://127.0.0.1/mcp` endpoint. Because the server never validates Origin or Host, it treats the request as a legitimate local call and hands back caller identity `http-local` with scope `["*"]` — full read/write access to the vault. The user did nothing except leave a browser tab open.

Together, the two map onto **OWASP LLM Top 10's LLM06 Excessive Agency** and a variant of **LLM02 Insecure Output Handling**: the MCP server treated "running locally" and "holding a token" as sufficient proof of trust, without ever verifying which resource a given token actually maps to, or whether a request genuinely came from a trusted client. It's also worth noting this isn't the first time DNS rebinding has hit a local MCP server — Anthropic's own Git MCP server was flagged for a similar class of issue (CVE-2025-68143/68144/68145) — suggesting this is a recurring pitfall across the whole MCP ecosystem's rollout of the Streamable HTTP transport, not a one-off mistake specific to `obsidian-tc`.

## Defense

**Immediate**
- Check whether you're running an affected version — `npm ls -g obsidian-tc`, or check the version baked into your Docker image / `.mcpb` bundle — and upgrade to `>= 1.3.1`
- Until you upgrade: **stop using `auth.mode: "none"`**, switch to JWT authentication, and don't bind the HTTP transport to a loopback interface that's reachable from a browser
- If a single `obsidian-tc` instance serves multiple vaults, re-verify every token's vault binding after upgrading — don't assume old tokens are automatically safe

**Longer term**
- Any local MCP server has to assume the network around it is hostile. Host/Origin validation isn't "only needed in the cloud" — localhost needs it too
- For multi-tenant MCP servers (multi-vault included), scope has to be bound to the token itself (a JWT claim), never self-reported by the caller — this is the basic "never trust client input" principle extended into the agent-tooling layer
- Consider runtime governance tools like Netzilo's MCP server allowlisting, or runtime detection tools from Lakera or Invariant Labs, to watch for cross-tenant access patterns in MCP calls

## Impact

`obsidian-tc` targets developers and heavy note-takers who wire a personal knowledge base directly into long-running agents like Claude Code or Cursor. The maintainer hasn't published install numbers, but the package ships through four separate channels — npm, a Docker image, an `.mcpb` bundle, and standalone binaries — which makes it hard to guarantee every install path gets patched by any single takedown. All three CVEs were fixed in 1.3.1, and the maintainer published all three advisories the same day, suggesting proactive disclosure rather than researchers forcing the issue into the open; there's no evidence yet of in-the-wild exploitation.

If your agent pipeline touches any local MCP server — not just `obsidian-tc` — the takeaway is the same: **"only the local machine can reach this" has never been a real security boundary**, especially while a user's browser is open to the rest of the internet. In any multi-vault or multi-tenant setup, scope has to be anchored to a server-side identity source, never to a caller-supplied parameter.

## Takeaway

Most MCP security coverage lately has focused on malicious tools or poisoned supply chains. This one is a reminder of something more basic: even when the tool itself is clean and the user installed the official package, a broken access-control layer on the server side is just as exploitable. And DNS rebinding against local services has now shown up at least twice in the MCP ecosystem — once against Anthropic's own Git MCP server, now against `obsidian-tc` — which suggests the "local equals trusted" mental model hasn't actually been retired yet.

## References

- [GitHub Security Advisory GHSA-pqh8-4pj7-32xx — HTTP transport lacks Origin/DNS-rebinding protection](https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-pqh8-4pj7-32xx)
- [Strix — CVE-2026-77366: obsidian-tc Incorrect Authorization (CVSS 9.9)](https://www.strix.ai/cve/CVE-2026-77366)
- [Strix — CVE-2026-77363: obsidian-tc Vulnerability (CVSS 8.8)](https://www.strix.ai/cve/CVE-2026-77363)
- [Strix — CVE-2026-77364: obsidian-tc Information Disclosure (CVSS 6.5)](https://www.strix.ai/cve/CVE-2026-77364)
- [GitHub — The-40-Thieves/obsidian-tc](https://github.com/the-40-thieves/obsidian-tc)
- [Rafter — DNS Rebinding and Localhost MCP: Your Dev Server is a Target](https://rafter.so/blog/mcp-dns-rebinding-localhost)
