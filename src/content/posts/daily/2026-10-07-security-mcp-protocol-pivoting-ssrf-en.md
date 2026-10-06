---
title: "Security Alert | \"Protocol Pivoting\" Cross-Protocol Attack: The Same SSRF Bug Hit Google, JPMorgan, and the French Government's MCP Servers — US Federal Systems Still Unpatched"
date: 2026-10-07
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Independent researcher Syed Anas Mohiuddin spent five months finding the same structural SSRF flaw in MCP servers run by Google, JPMorgan Chase, France's DINUM, Weaviate, and the city of Tangerang, Indonesia, and named the cross-protocol attack pattern behind it 'Protocol Pivoting.' Six weeks after disclosure, five US federal systems — including one handling veterans' benefits — remain unpatched."
tldr: "Researcher Syed Anas Mohiuddin proved that the SSRF bug common in MCP servers isn't a one-off coding mistake but a structural flaw in the protocol itself: five unrelated organizations — Google, JPMorgan, the French government, Weaviate, and the city of Tangerang — each independently made the same mistake. He coined 'Protocol Pivoting' for the technique of smuggling malicious instructions across protocol boundaries (MCP into A2A). Google's bug (CVE-2026-14540, CVSS 8.0) is fixed, but five US federal systems under the GSA — including a veterans' benefits server — reported on September 2 are still unpatched, and one of them writes veterans' names, Social Security numbers, and birth dates into unredacted error logs. Defense: audit every MCP tool that accepts an agent-supplied URL or path parameter, add destination allowlisting and IP validation, and treat any content relayed between agents as untrusted input."
series:
  name: "AI Security Alert"
  order: 48
---

> 🌏 [中文版](/posts/daily/2026-10-07-security-mcp-protocol-pivoting-ssrf)

## What happened

Independent security researcher Syed Anas Mohiuddin — based in Chicago, founder of AI automation studio Cognivators — spent five months testing a single hypothesis: if the SSRF (server-side request forgery) bug common in MCP (Model Context Protocol) servers is a structural flaw in the protocol rather than one team's mistake, then unrelated organizations should independently rediscover the exact same bug. He found it in MCP servers run by Google, JPMorgan Chase, France's interministerial digital directorate (DINUM), vector-database company Weaviate, and the city government of Tangerang, Indonesia — all five confirmed and fixed it. He named the broader technique "Protocol Pivoting": smuggling malicious instructions across a protocol boundary — for example, from MCP into Google's Agent-to-Agent (A2A) protocol — to escalate into capabilities only reachable through the other protocol. More troubling: five US federal systems he reported on September 2, including a Department of Veterans Affairs benefits server, remain unpatched six weeks later.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Cross-protocol attack (Protocol Pivoting) / MCP server SSRF |
| Scope | Google `mcp-toolbox`, JPMorgan's `jpmorgan-payments/ai`, France's `datagouv-mcp`, Weaviate, Tangerang's `Wazuh-MCP-Server` (all fixed); five US GSA federal MCP servers — VA benefits, CMS Blue Button, regulations.gov, USASpending, CDC PLACES — still unpatched |
| Severity | High (Google: CVSS 8.0; the unpatched US federal systems carry added risk from unredacted PII) |
| CVE | CVE-2026-14540 (Google mcp-toolbox, GHSA-3x3x-8ffg-ghcv), CVE-2026-97228 (Rapid7 Bulk Export MCP, CVSS 2.7) |
| Sources | [Ars Technica](https://arstechnica.com/security/2026/10/vulnerability-in-agents-from-google-and-others-exposes-structural-flaw-in-mcp/), [Unite.AI](https://www.unite.ai/researcher-discloses-same-mcp-flaw-at-google-jpmorgan-two-governments/), [Tech Times](https://www.techtimes.com/articles/328621/20261006/six-weeks-after-google-jpmorgan-patched-mcp-flaw-us-servers-stay-exposed.htm) |

## Attack surface

Mohiuddin's proof-of-concept exploits two assumptions baked into how MCP servers are typically built. First, many MCP servers take a URL or path parameter supplied by an agent and fetch it server-side without ever validating where it actually resolves. Second, in a multi-agent deployment, every agent inside the internal network is implicitly trusted by every other one. In Google's `mcp-toolbox` (an MCP server for databases), the Go HTTP client had no `CheckRedirect` policy at all and never validated destination IP addresses — a crafted path parameter could make the toolbox follow a redirect straight to an internal service, or to a cloud metadata endpoint (`169.254.169.254` on AWS/GCP/Azure, which hands out IAM credentials to anything that can reach it). The JPMorgan, French DINUM, and Tangerang cases all follow nearly the same pattern: a tool function accepts a caller-supplied URL and fetches it server-side with no IP allowlist and no re-validation at connect time — which also means none of them were resistant to DNS rebinding, where a hostname passes an allowlist check at validation time and then resolves to an internal address the moment the connection is actually made.

"Protocol Pivoting" describes a further escalation: when a deployment uses MCP for tool calls and A2A for agent-to-agent delegation at the same time, an attacker can embed text shaped like a legitimate A2A task instruction inside content that an MCP tool returns — a document submitted for translation, a dataset submitted for analysis. The orchestrating agent relays that content to a downstream subagent as ordinary delegated work, and the subagent executes it because it trusts the orchestrator. Every node in that chain does exactly what it was built to do; the gap is that nobody is watching the handoff between protocols. Rapid7's Douglas McKee put it to Ars Technica this way: each protocol "checks its own front door while nobody watches the hallway in between." X41 D-Sec's Markus Vervier argues the technique is ultimately a subclass of indirect prompt injection — the malicious instruction is just smuggled in through a different channel.

Mapped to the OWASP LLM Top 10: **LLM01 Prompt Injection** (cross-protocol / indirect — malicious instructions smuggled through an MCP-to-A2A delegation chain), plus **LLM07 Insecure Plugin Design** (an MCP tool that never validates where its outbound request actually lands — textbook SSRF). The unpatched US federal systems additionally land on **LLM06 Sensitive Information Disclosure**, by writing full unredacted upstream API responses into error logs.

## Defense

**Immediate actions**
- Audit every MCP server tool that accepts an agent-supplied URL, path, or endpoint parameter, and confirm it validates the *resolved* destination IP — not just the input string
- Enforce an IP allowlist/blocklist on outbound requests, and re-check the destination at connect time, not just when the request is first built, to close the DNS-rebinding window
- Review delegation chains in multi-agent deployments: treat any content relayed through MCP or A2A as untrusted input by default, regardless of which internal agent handed it over — being "from another internal agent" is not a reason to trust it
- Run Mohiuddin's open-source [mcp-safeguard](https://github.com/SyedAnas01/mcp-safeguard) against existing MCP servers to screen for SSRF, excessive permissions, prompt-injection surfaces, information leakage, authentication gaps, and lifecycle bypass

**Long-term architecture**
- Model cross-protocol delegation explicitly in your threat model: when MCP handles tool calls and A2A handles inter-agent delegation, the trust boundaries of each must be evaluated separately — passing MCP validation says nothing about safety on the A2A side
- Scope credentials per agent instead of sharing one credential pool across every agent in a deployment, to limit blast radius if a single agent is compromised
- Borrow the approach watchlist company **Invariant Labs** takes to MCP server scanning and runtime protection: build tool-poisoning and cross-protocol delegation detection into CI or a runtime gateway, not just static code scanning — the malicious input arrives as a tool argument at the transport layer, a place SCA and dependency scanners never look
- Push for the MCP specification itself to adopt normative security requirements. Today's spec doesn't mandate destination-address validation or per-agent credential scoping, which is exactly why five unrelated organizations independently made the same mistake

## Impact

The five organizations that have confirmed and fixed the bug — Google, JPMorgan, France's DINUM, Weaviate, and the city of Tangerang — span a tech giant, a financial institution, a national government platform, and a local government, which is itself evidence this isn't confined to one industry or one programming language. What deserves more attention is what's still open: Mohiuddin filed five private GitHub Security Advisories with the US GSA's Technology Transformation Services on September 2 — covering a VA benefits-claims server, CMS Blue Button, regulations.gov, USASpending, and CDC PLACES — and as of October 6, six weeks later, all five remain in triage with no patch timeline. The VA case is concrete: the server logs full upstream benefits-API error responses at ERROR level without redacting any fields, and those responses can contain a veteran's name, Social Security number, date of birth, and address — **triggered by an ordinary validation failure during normal operation, no active exploit required.** If any MCP server in your own agent system takes an agent-supplied URL or path parameter and fetches it server-side, this attack surface is open right now — and patching the five known cases doesn't retire the underlying trust assumption. The next project that wires up MCP the same way inherits the same vulnerability pattern from day one.

## Today's takeaway

Most MCP security discussion I'd seen before this focused on a single agent getting prompt-injected into calling the wrong tool. This incident made clear the harder problem is the trust gap *between* protocols: MCP handles tool calls, A2A handles delegation, and each does its own security checks well — the failure is that nobody checks the seam where one hands off to the other. And five unrelated organizations independently making the exact same SSRF mistake is more alarming than "one company wrote buggy code": it means any new project built on a protocol spec that still lacks normative security requirements inherits the same vulnerability pattern from scratch, and patching individual cases will never catch up with a structural gap in the protocol itself.

## References

- [Ars Technica — Vulnerability in agents from Google and others exposes structural flaw in MCP](https://arstechnica.com/security/2026/10/vulnerability-in-agents-from-google-and-others-exposes-structural-flaw-in-mcp/)
- [Unite.AI — Researcher Discloses Same MCP Flaw at Google, JPMorgan, Two Governments](https://www.unite.ai/researcher-discloses-same-mcp-flaw-at-google-jpmorgan-two-governments/)
- [Tech Times — Six Weeks After Google and JPMorgan Patched MCP Flaw, US Servers Stay Exposed](https://www.techtimes.com/articles/328621/20261006/six-weeks-after-google-jpmorgan-patched-mcp-flaw-us-servers-stay-exposed.htm)
- [GitHub Advisory GHSA-3x3x-8ffg-ghcv (Google mcp-toolbox SSRF, CVE-2026-14540)](https://github.com/advisories/GHSA-3x3x-8ffg-ghcv)
- [Rapid7 CVE-2026-97228 (Bulk Export MCP GraphQL injection)](https://www.rapid7.com/db/vulnerabilities/cve-2026-97228/)
- [Syed Anas Mohiuddin — Protocol Pivoting, four months later (original research update)](https://anas-security-portfolio.vercel.app/protocol-pivoting-update.html)
- [mcp-safeguard (open-source MCP security scanner)](https://github.com/SyedAnas01/mcp-safeguard)
