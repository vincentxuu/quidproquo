---
title: "Security Alert｜Grafana's Official MCP Server Chains Auth Bypass to SSRF — CVE-2026-19516 (CVSS 9.1), Auth Still Optional After the Patch"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Pillar Security disclosed a vulnerability chain in Grafana's official MCP server: a correctly formatted but never-issued session ID bypasses authentication, then the grafana_api_request tool's X-Grafana-URL header redirects requests to cloud metadata endpoints — affecting an image with 1.9 million Docker Hub downloads."
tldr: "Pillar Security disclosed a vulnerability chain through Grafana's official bug bounty program: before v1.1.0, mcp-grafana only checked whether a session ID was correctly formatted, never whether it had actually been issued — so an attacker could fabricate one and call tools with the full privileges of the server's configured Grafana service account. Chained with the grafana_api_request tool's caller-controlled X-Grafana-URL header, which has no destination restriction (CVE-2026-19516, CVSS 9.1), the attacker could redirect requests to internal services or cloud metadata endpoints and read the responses. Grafana shipped v1.1.0 on August 10 with optional bearer-token auth, but because it's off by default (requires the --server-auth-token flag), deployments that upgrade without enabling it remain exposed. No evidence of in-the-wild exploitation so far. Defense: upgrade immediately and manually enable the auth flag, and audit network exposure across every MCP server you run."
series:
  name: "AI Security Alert"
  order: 22
---

> 🌏 [中文版](/posts/daily/2026-09-05-security-grafana-mcp-ssrf-session-spoofing)

## Incident Overview

Security research firm Pillar Security, working through Grafana's official bug bounty program on Intigriti, disclosed a vulnerability chain in Grafana's official Model Context Protocol (MCP) server — the tool that lets AI agents query and manage Grafana dashboards, alerts, and data sources on a user's behalf — that composes into a critical-severity exploit path. The first flaw is an authentication gap: versions before v1.1.0 only checked whether a session ID matched the expected format (like `mcp-session-<uuid>`), never whether the server had actually issued that ID to a legitimate caller. An attacker could fabricate a correctly formatted, never-issued session ID and invoke tools with the full authority of the server's configured Grafana service account. The second flaw is an SSRF condition in the `grafana_api_request` tool: designed to let an agent make Grafana API calls on the user's behalf, it accepts a caller-supplied `X-Grafana-URL` header with no destination restriction at all. Chained with the authentication gap, an attacker needed no legitimate credential to have the server issue requests against internal services or cloud metadata endpoints and read back the responses. Grafana shipped a fix in v1.1.0 on August 10; the SSRF component is tracked as CVE-2026-19516, CVSS 3.1 score 9.1 (Critical). The affected `mcp-grafana` image has accumulated roughly 1.9 million Docker Hub downloads.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | MCP server authentication bypass (session spoofing) chained into server-side request forgery (SSRF) |
| Scope | Grafana's official MCP server (`mcp-grafana`), versions before v1.1.0; v1.1.0+ deployments that don't explicitly enable `--server-auth-token` remain equally exposed |
| Severity | Critical (CVE-2026-19516, CVSS 9.1; exploitable with no legitimate credential, can read responses from cloud metadata endpoints; no known in-the-wild exploitation) |
| CVE | CVE-2026-19516 (SSRF, CVSS 9.1, fixed in v1.1.0); CVE-2026-15583 (an earlier credential-exfiltration variant, CVSS 8.6, fixed in v0.17.2) |
| Source | [Pillar Security (original disclosure)](https://www.pillar.security/blog/valid-but-never-issued-session-spoofing-and-ssrf-in-grafana-mcp), [Grafana Labs official security advisory](https://grafana.com/security/security-advisories/cve-2026-19516), [Cloud Security Alliance Labs research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-grafana-mcp-ssrf-session-spoofing-20260903) |

## Attack Surface Analysis

What let this chain escalate from two narrowly-scoped flaws into a critical exploit path is that the two design failures complement each other exactly. The first failure is authentication that only looks real: before v1.1.0, the server appeared to enforce sessions but only performed a format check, never requiring that a session be issued through an actual authenticated handshake — a pattern more dangerous than having no session concept at all, because it gives operators false confidence that unauthenticated access isn't possible. Any attacker who could reach the server's network endpoint — whether it was exposed to the internet, reachable from a shared internal network, or accessible from a compromised adjacent workload — could call the standard MCP `tools/list` and `tools/call` methods with a self-generated session ID and get the server's full configured privileges in return.

The second failure sits in the `grafana_api_request` tool itself: it accepts caller-supplied values for HTTP method, path, and body, and critically, a destination override via the `X-Grafana-URL` header, with no allowlist restricting that destination to the operator's intended Grafana instance. Grafana's own advisory puts it plainly: "the caller can direct requests at internal, loopback, and link-local network services." Chained with the authentication gap, an attacker needed no legitimate credential at all to turn the MCP server into what Pillar Security calls "a readable, method-capable proxy" — and MCP servers, because they need reachability to the tools they broker, are routinely deployed inside cloud VPCs, next to CI/CD systems, or on the same network segment as internal APIs, which is exactly the network position an attacker wants to exploit. Notably, Grafana had already patched a related issue once before (CVE-2026-15583, CVSS 8.6): that fix stopped the server's own service-account credentials from being forwarded to an attacker-specified host, but it didn't restrict where the request itself could go. CVE-2026-19516 shows that closing the "credentials don't leak" gap alone doesn't close the second gap — "the request itself can still be redirected."

Mapped against the OWASP LLM Top 10, this hits **LLM06 Excessive Agency** — an MCP server acting on a user's behalf is granted privilege far broader than any single request actually needs, and once authentication is effectively absent, what an attacker gains is the entire service account's privilege rather than anything scoped down. It also fits CSA's longstanding observation about the MCP ecosystem: the MCP authorization spec itself marks OAuth 2.1 as optional rather than mandatory, and a 2025 internet-wide scan found more than 1,800 publicly reachable MCP servers accepting connections with no credential check at all. Grafana's case is a concrete instance of that same structural gap.

## Defense

The first thing to do right now is upgrade — but upgrading alone doesn't close the gap, because the patched authentication mechanism defaults to off and teams have to turn it on themselves. Longer term, destination validation and mandatory authentication need to become standard pre-launch review items for any MCP server, rather than something addressed reactively after each disclosure. Watchlist B7 companies focused on agent/tool-chain security posture can help with this kind of audit and ongoing monitoring.

**Immediate actions**
- Upgrade the Grafana MCP server to v1.1.0 or later, and verify the upgrade by checking the running server's reported version
- After upgrading, explicitly add the `--server-auth-token` flag and distribute the token only to legitimate callers — without it, an upgraded server still accepts unauthenticated requests
- Audit the network exposure of every MCP server you run, not just Grafana's, to confirm none are reachable from untrusted network segments or the public internet
- Review the new security warning logs v1.1.0 introduces for unauthenticated deployments listening beyond loopback addresses — Grafana has indicated a future release may turn this into a hard startup failure

**Long-term architecture**
- Implement destination allowlisting for any MCP tool that accepts a caller-controlled URL or host parameter, restricting outbound requests to the operator-configured target instance
- In cloud deployments, restrict or block access to cloud metadata endpoints from the network segment the MCP server runs in (e.g., enforcing IMDSv2 on AWS, or metadata-server firewalling on other clouds), so a successful SSRF still can't reach credential-issuing endpoints
- Treat "authentication optional" as a red flag during MCP server security review, and require any internally deployed MCP server to enforce mandatory, scoped authentication before it's connected to production credentials
- Evaluate watchlist B7 company Invariant Labs' MCP security scanning tools for automated audits of authentication configuration and destination validation across internal or third-party MCP server deployments; teams that need centralized governance and allowlisting for MCP server installs can also evaluate Netzilo's MCP runtime governance offering

## Impact

Pillar Security estimates the affected `mcp-grafana` image has accumulated roughly 1.9 million Docker Hub downloads, though download counts can't distinguish real production deployments from repeated CI or registry-mirror pulls, so the actual exposure can't be sized from that number alone. The patch timeline was fast: Pillar reported the findings via Intigriti on August 2, Grafana shipped the v1.1.0 fix on August 10, CVE-2026-19516 was published August 11, and the researchers were credited to Grafana's Security Hall of Fame on August 12 — six working days end to end. But in this case, "patched" and "risk resolved" are two different things: because authentication defaults to off, any deployment that upgraded without also setting the `--server-auth-token` flag remains exactly as exposed as before the patch. There's no public evidence this chain has been exploited in a real attack so far.

For any team that connects an MCP server to internal monitoring, CI/CD, or cloud control-plane credentials, this incident is a reminder that the MCP server's network position is itself an asset, and a patched version number doesn't mean the security configuration is actually in place — the auth flag and network exposure both need separate verification.

## Today's Takeaway

Seeing a CVE marked "patched" used to make me assume the risk was resolved, but this incident shows a patch can just move the security control from mandatory to optional — bumping the version number and actually closing the exposure are two steps that need to be verified separately. That also explains why the "MCP authentication is optional" problem CSA keeps tracking keeps resurfacing across different vendors' products: as long as the spec itself lists authentication as optional, any individual vendor's patch will only ever be chasing the same structural gap.

## References

- [Valid, But Never Issued: Session Spoofing and SSRF in Grafana MCP — Pillar Security](https://www.pillar.security/blog/valid-but-never-issued-session-spoofing-and-ssrf-in-grafana-mcp)
- [Grafana MCP server-side request forgery via X-Grafana-URL header (grafana_api_request) — Grafana Labs Security Advisories](https://grafana.com/security/security-advisories/cve-2026-19516)
- [Grafana MCP Server: Session Spoofing Chained to SSRF — Cloud Security Alliance Labs](https://labs.cloudsecurityalliance.org/research/csa-research-note-grafana-mcp-ssrf-session-spoofing-20260903)
- [CVE-2026-19516: mcp-grafana SSRF Vulnerability — SentinelOne Vulnerability Database](https://www.sentinelone.com/vulnerability-database/cve-2026-19516)
