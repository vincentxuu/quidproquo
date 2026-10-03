---
title: "Security Alert | Loom for AWS Auth Bypass + Double SSRF — an Agent Control Plane with No Identity Provider Is Wide Open"
date: 2026-10-04
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "AWS published two security bulletins patching an authentication bypass and two SSRF flaws in Loom for AWS, its open-source AI agent orchestration platform, plus a command injection bug in SageMaker Unified Studio — the worst scoring a perfect CVSS 10.0."
tldr: "On October 2, AWS disclosed CVE-2026-103956/103957/103958 (Loom for AWS) and CVE-2026-104019 (SageMaker Unified Studio). The worst bug: with no identity provider configured, any network client could seize full admin control over the agent control plane. Two SSRF bugs let authenticated users with mcp:write or a2a:write scope force Loom's MCP tool-server or A2A connections to reach the container's internal credential endpoint. No exploitation reported; fixed in 1.7.0. Mitigations: upgrade now, restrict the write scopes, rotate every credential the flaws could have touched."
series:
  name: "AI Security Alert"
  order: 45
---

> 🌏 [中文版](/posts/daily/2026-10-04-security-loom-aws-auth-bypass-ssrf)

## What Happened

On October 2, 2026, AWS published two security bulletins patching three flaws in Loom for AWS — its open-source AI agent orchestration platform — plus a command injection bug in Amazon SageMaker Unified Studio. The most severe (CVSSv4 10.0) hits deployments with no identity provider configured: any network client could obtain full administrative control over the agent control plane, including reading stored integration credentials and rewriting the IAM role policies attached to managed agent roles. The other two are server-side request forgery (SSRF) flaws that let an authenticated user holding the `mcp:write` or `a2a:write` scope redirect Loom's MCP tool-server or A2A remote-agent connection logic to arbitrary internal network locations, including the container's credential-vending endpoint. AWS has not reported any in-the-wild exploitation. Version 1.7.0 fixes all three (CVE-2026-103956 was already addressed in 1.6.1).

**Key Facts**

| Item | Value |
|---|---|
| Type | Authentication bypass + SSRF (AI agent control-plane takeover) |
| Affected | Loom for AWS < 1.7.0 (AWS Labs open-source AI agent orchestration platform); multiple Amazon SageMaker Distribution versions (SageMaker Unified Studio) |
| Severity | Critical (CVE-2026-103956, CVSSv4 10.0) |
| CVE | CVE-2026-103956, CVE-2026-103957, CVE-2026-103958, CVE-2026-104019 |
| Sources | [AWS Security Bulletin 2026-124-AWS](https://aws.amazon.com/security/security-bulletins/2026-124-aws/), [gbhackers.com](https://gbhackers.com/aws-ai-agent-vulnerabilities/), [securityonline.info](https://securityonline.info/loom-for-aws-sagemaker-flaws/), [NVD CVE-2026-103956](https://nvd.nist.gov/vuln/detail/CVE-2026-103956) |

## Attack Surface

CVE-2026-103956 combines insecure default initialization (CWE-1188) with missing authentication for a critical function (CWE-306). When a Loom deployment has no Cognito user pool or external identity provider configured, the platform treats that state as local-dev mode — but never extends the assumption to "loopback access only." Expose the deployment to the network and the door is effectively unlocked: any request to the application API gets super-admin authority over the agent control plane, enough to register malicious tool servers, read stored third-party integration credentials, and rewrite IAM policies on managed agent roles. One missing setup step turns into full control over whatever cloud resources those roles can reach.

The other two bugs require an attacker who is already an authenticated user with `mcp:write` or `a2a:write` scope, but the impact is just as serious. CVE-2026-103957 abuses OAuth2 discovery handling: an attacker configures a malicious well-known discovery URL, causing the backend to send OAuth2 client secrets or another user's access token to a third-party-controlled endpoint. The 1.6.1 release blocked the path to internal addresses but didn't fully close the token-disclosure issue — that took until 1.7.0. CVE-2026-103958 is a more direct SSRF: Loom's MCP tool-server and A2A remote-agent connection handling didn't restrict connection destinations, letting an attacker point requests at the container's internal credential-vending endpoint and read back the response — which yields temporary AWS credentials usable against whatever the associated IAM role can reach.

Mapped to the OWASP LLM / Agentic Top 10, CVE-2026-103956 is **identity and privilege abuse**: an agent control plane is inherently a high-privilege subject, and leaving it open by default hands admin rights to anyone. The two SSRF bugs are **excessive agency plus unsafe tool/connection boundaries** — mechanisms like MCP tool servers and A2A exist specifically to let agents talk to each other and call external tools, so once connection destinations aren't constrained, they're a built-in SSRF amplifier. The attacker just swaps "external service" for "the internal credential endpoint."

## Defenses

Immediate: upgrade and tighten scopes. Longer term: treat the agent control plane as a high-privilege admin surface and put every outbound agent connection behind egress controls.

**Do now**
- Check your Loom deployment version; upgrade to `v1.7.0` if below it (1.6.1 only stops the CVE-2026-103956 path — 1.7.0 is required to fully fix all three)
- Before upgrading: confirm a Cognito user pool or external identity provider is configured, and that `LOOM_ALLOW_UNAUTHENTICATED_LOCAL_DEV` is not set in any production environment
- Restrict `mcp:write` and `a2a:write` scope (the `g-admins-super`, `g-admins-mcp`, `g-admins-a2a`, `g-admins-demo` groups) to trusted administrators only, to reduce the chance of triggering the SSRF bugs
- SageMaker Unified Studio users: restart affected Studio Spaces to pick up the globally deployed patched images

**Longer term**
- After upgrading, rotate every OAuth2 client secret used for MCP/A2A integrations, revoke and reissue any access tokens active during the exposure window, and — if container role credentials may have been read — rotate the IAM role's session credentials and review CloudTrail
- Treat the agent control plane as a high-privilege management interface: never assume internal-network deployment is equivalent to secure, and authentication should be on by default, not opt-in
- Put any mechanism that lets an agent initiate outbound connections (MCP tool servers, A2A remote agents, webhook callbacks) behind egress allowlisting so connection destinations can't be steered to internal addresses by a user; watchlist-tracked MCP runtime-governance and traffic-auditing tools such as Netzilo and Invariant Labs address exactly this "tool call boundary" problem

## Blast Radius

AWS states in both bulletins that no exploitation has been observed; all four CVEs are currently flagged "Not exploited." But Loom is open source, and AWS specifically calls out that "any forked or derivative code" needs the same patch — a notice that usually means other cloud vendors or companies have already forked Loom into internal tooling, where patches propagate more slowly than the upstream release. CVE-2026-103956 deserves particular attention: skip the identity-provider setup step during deployment and the entire agent control plane — and every cloud resource it can reach — is exposed to anyone who can route to that network address. That's exactly the kind of step that gets skipped in "ship it first, harden it later" internal tooling rollouts.

## Today's Takeaway

The single thread tying these three Loom bugs together matters more than any individual technical detail: an AI agent orchestration platform turned mechanisms built for agent-to-agent communication — MCP tool servers, A2A remote-agent connections — into outbound connection entry points a user could steer. The "trust between agents" assumption baked into agent communication protocols becomes an SSRF attack surface the moment user-controllable input (a discovery URL, a connection target) gets mixed in. It's the same logic as classic web SSRF — just running on an agent orchestration platform instead of a web app.

## References

- [AWS Security Bulletin 2026-124-AWS — CVE-2026-103956, CVE-2026-103957, and CVE-2026-103958: Issues in Loom for AWS](https://aws.amazon.com/security/security-bulletins/2026-124-aws/)
- [AWS Security Bulletin 2026-125-AWS — SageMaker Distribution command injection](https://aws.amazon.com/security/security-bulletins/2026-125-aws/)
- [gbhackers.com — AWS AI Agent Vulnerabilities Let Attackers Bypass Authentication and Steal Credentials](https://gbhackers.com/aws-ai-agent-vulnerabilities/)
- [securityonline.info — AWS Fixes Loom for AWS Admin Takeover and SageMaker Unified Studio Code Execution Flaws](https://securityonline.info/loom-for-aws-sagemaker-flaws/)
- [NVD — CVE-2026-103956](https://nvd.nist.gov/vuln/detail/CVE-2026-103956)
- [Loom for AWS v1.7.0 release](https://github.com/awslabs/loom/releases/tag/v1.7.0)
