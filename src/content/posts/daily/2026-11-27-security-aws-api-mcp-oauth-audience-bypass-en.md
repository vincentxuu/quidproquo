---
title: "Security Alert | AWS API MCP Server's OAuth Bug Let Tokens Issued to Other Apps Borrow Your AWS Credentials"
date: 2026-11-27
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "AWS confirmed its API MCP Server skipped the audience check on OAuth tokens, so a token issued to a different application in the same tenant was accepted and could be used to make AWS API calls with the host's own credentials."
tldr: "CVE-2026-115413: AWS API MCP Server versions 1.3.0 through 1.5.x, when run in streamable-http mode with OAuth, checked a token's signature, issuer, and expiry but never its audience claim — so a token minted for a completely different app in the same tenant was accepted too. Fixed in 1.6.0, which now requires AUTH_AUDIENCE or AUTH_CLIENT_ID. The bug surfaced as one of a batch of MCP-related flaws that security firm Alt Security says it found in three days using an AI tool — only 5 of which have gone through full disclosure and gotten a CVE so far."
series:
  name: "AI Security Alert"
  order: 88
---

> :globe: [中文版](/posts/daily/2026-11-27-security-aws-api-mcp-oauth-audience-bypass)

## Incident Overview

On October 27, 2026, AWS published an official security bulletin confirming an OAuth token validation flaw in its open-source AWS API MCP Server — a Model Context Protocol server that lets AI assistants call AWS CLI/API operations — tracked as CVE-2026-115413. The issue only affects deployments configured for the `streamable-http` transport with OAuth authentication. When validating an incoming bearer token, the server checked the signature, the issuer, and the expiry — but never the token's audience claim, which is supposed to record which application the token was actually issued for. The flaw was reported by Yuval Elbar, a researcher at the cybersecurity firm Alt Security, through a coordinated disclosure process. It's one of the few cases from a much larger sweep that Alt Security ran across the MCP ecosystem to have gone all the way through disclosure and received a CVE: according to an exclusive report by *Newsweek* on November 25, Alt Security used an AI-powered scanning tool called "Peter" to turn up dozens of MCP-related flaws in just three days, and only five of those have been made public so far — the rest are still awaiting fixes from their respective vendors.

**Key Facts**

| Item | Value |
|---|---|
| Incident type | Broken Authentication / missing token audience validation (MCP OAuth) |
| Scope | `awslabs.aws-api-mcp-server` versions >=1.3.0 and <1.6.0, only when deployed with `streamable-http` transport + OAuth authentication |
| Severity | High (AWS rates it "Important") |
| CVE | [CVE-2026-115413](https://www.cve.org/CVERecord?id=CVE-2026-115413) |
| Sources | [AWS Security Bulletin 2026-152-AWS](https://aws.amazon.com/security/security-bulletins/2026-152-aws/), [GitHub Security Advisory GHSA-4prq-p2x5-w9fh](https://github.com/awslabs/mcp/security/advisories/GHSA-4prq-p2x5-w9fh), [Newsweek](https://www.newsweek.com/anthropic-ethical-hackers-exposed-security-flaws-12768208) |

## Attack Surface Analysis

The AWS API MCP Server can be configured to run over `streamable-http` and require callers to present an OAuth bearer token, which the server then validates against an identity provider the operator has nominated — say, a particular Amazon Cognito user pool. The problem is the validation logic only checked three things: whether the token's signature was correct, who issued it, and whether it had expired. It skipped the one check OAuth specifically exists to make possible: the `aud` (audience) claim, which records which application a given token was actually minted for.

```diagram
title: Borrowing another app's OAuth token to call the AWS API
desc: App B presents the MCP Server with a legitimate token its identity provider issued to itself. The MCP Server checks only signature, issuer, and expiry — not audience — so it accepts this "someone else's" token and goes on to call the AWS API using the credentials configured on the host.
---
<svg viewBox="0 0 640 352">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="336"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="336"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="336"/>

  <g>
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">call MCP tool</text>
  </g>
  <g>
    <path class="dg-line" d="M324 168H352Q360 168 360 176V184Q360 192 352 192H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="372" y="180" text-anchor="start" dominant-baseline="central">skips audience check</text>
  </g>
  <g>
    <path class="dg-line" d="M324 216H536" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="430" y="204" text-anchor="middle" dominant-baseline="central">call AWS API</text>
  </g>
  <g>
    <path class="dg-line dg-line--dashed" d="M540 264H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="252" text-anchor="middle" dominant-baseline="central">200 response</text>
  </g>
  <g>
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 312H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="300" text-anchor="middle" dominant-baseline="central">200 (succeeds too)</text>
  </g>

  <rect class="dg-box" x="540" y="204" width="8" height="72" rx="2"/>
  <rect class="dg-box dg-box--accent" x="316" y="108" width="8" height="216" rx="2"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">App B</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">MCP Server</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">AWS API</text>
</svg>
```

The practical consequence: if an attacker — or really any local caller — gets hold of a legitimate token that the same identity provider issued to a *different* application in the same tenant (say, a second app client registered under the same Cognito user pool), the AWS API MCP Server would accept it anyway. The server itself doesn't leak any new credentials in the process — it still makes AWS API calls using whatever AWS credentials the operator configured on the host, not the caller's own identity — but that means anyone who can get hold of a "neighboring" token effectively inherits the full set of permissions behind that host credential, and can run any AWS API operation it's authorized for.

This is a classic confused-deputy bug: the MCP server treats "this token is cryptographically valid" as equivalent to "this caller is authorized to use me," and the root cause is simply not enforcing the audience check that the MCP specification itself already calls for. Both the [MCP Authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) and the [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet) list "validate that every access token's audience is this MCP server" as a baseline requirement. Mapped to the OWASP LLM Top 10, this falls under **LLM06: Excessive Agency** — the MCP server acts on a caller's behalf using a high-privilege host credential, and any gap in identity verification immediately widens the blast radius to everything that credential can do.

## Mitigation

**Immediate actions**
- Check whether you're running `awslabs.aws-api-mcp-server` configured for `streamable-http` + OAuth: `pip show awslabs.aws-api-mcp-server`, or review the transport/auth settings in your MCP client configuration
- Upgrade to [1.6.0 or later](https://pypi.org/project/awslabs.aws-api-mcp-server/1.6.0/) immediately, and set `AUTH_AUDIENCE` as the new version requires (or `AUTH_CLIENT_ID` for identity providers, such as Cognito, whose access tokens carry no audience claim)
- If you can't upgrade right away: switch back to the default `stdio` transport instead of `streamable-http` — this sidesteps the issue, at the cost of losing remote access

**Long-term architecture**
- Treat audience validation as a non-negotiable requirement whenever you integrate OAuth with any MCP server, whether self-built or third-party — checking signature, issuer, and expiry alone is not enough
- Apply least privilege to whatever AWS credentials you configure on an MCP server's host — the real ceiling on damage from a bug like this is exactly what that credential can do, so the narrower its scope, the lower the worst case when audit logic fails
- Consider a tool like Zenity for AI agent identity and access governance, so OAuth configuration across your organization's MCP servers — scopes, audiences, token lifetimes — gets checked continuously against least-privilege policy, instead of relying on catching up after the next security bulletin

## Impact

There's no evidence so far that this vulnerability was actually exploited — it was reported through a coordinated disclosure process, and AWS published the bulletin on October 27 alongside the fixed 1.6.0 release, following the standard "patch first, disclose after" sequence. What's more worth paying attention to is the backdrop: according to Alt Security's disclosure, this is just one case out of a much larger set the firm's AI tool turned up across MCP-related software, and it's one of only five that have gone all the way through coordinated disclosure to a public CVE. The researchers say there are reportedly dozens more sitting with various vendors, still privately reported and still unpatched. For anyone running an MCP server wired up to an OAuth identity provider, the real takeaway isn't "fix this one CVE" — it's that the industry's OAuth integrations around MCP, broadly, still aren't getting this right.

## Today's Takeaway

The technical mechanics here aren't complicated — a single JWT claim went unchecked — but the context around it is worth remembering: a security firm used an AI tool to find dozens of MCP-related vulnerabilities in three days, and only five of those have gone all the way through disclosure and gotten a CVE. That suggests the real inventory of "known but unpatched" issues sitting in the MCP ecosystem right now is probably much larger than any single day's security alert can convey — and getting audience validation right is becoming a priority on both sides of an AI-accelerated arms race.

## References

- [AWS Security Bulletin 2026-152-AWS — CVE-2026-115413: AWS API MCP Server OAuth token audience validation bypass](https://aws.amazon.com/security/security-bulletins/2026-152-aws/)
- [GitHub Security Advisory GHSA-4prq-p2x5-w9fh — AWS API MCP Server OAuth Token Audience Validation Bypass](https://github.com/awslabs/mcp/security/advisories/GHSA-4prq-p2x5-w9fh)
- [CVE-2026-115413 — CVE.org Record](https://www.cve.org/CVERecord?id=CVE-2026-115413)
- [Newsweek — Ethical Hackers Uncover Security Flaws in AI Tools Using Anthropic-Pioneered Protocol](https://www.newsweek.com/anthropic-ethical-hackers-exposed-security-flaws-12768208)
- [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet)
