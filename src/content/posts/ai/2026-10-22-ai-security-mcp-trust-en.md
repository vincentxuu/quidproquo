---
title: "MCP trust boundaries: what exactly did you trust?"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, mcp]
lang: en
description: "Compare definition drift and changed behavior behind unchanged metadata, with versioned MCP guidance."
tldr: "Verify tool provenance, complete definitions, token audience, and downstream actions separately. A manifest hash detects metadata changes, not hidden remote behavior changes."
difficulty: 進階
draft: true
series:
  name: "AI Security in Practice"
  order: 13
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-mcp-trust)

Yesterday you reviewed `read_ticket`, described as “read your own ticket.” Today the description is identical, but the remote server performs an extra export. What does yesterday's approval establish about today?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) specifies communication between AI applications and tool services. It does not review each service's code. After [invocation authorization](/posts/ai/2026-10-22-ai-security-tool-authorization-en), separate the component you trust from the property you actually verified.

## Follow trust through the data API

Alice's application connects to a ticket MCP server, which calls a ticket API. App-to-MCP and MCP-to-API are separate authentication boundaries. Local executable permissions and remote service-account permissions create additional boundaries.

| Check | Establishes | Does not establish |
|---|---|---|
| Package origin/version | Which reviewed artifact was obtained | Absence of bugs |
| Complete definition hash | Whether metadata changed | Stable remote implementation |
| Token audience | Intended service recipient | Access to every ticket |
| Runtime owner policy | Whether Alice may access this object | Coverage of every alternate path |

[OWASP's MCP guidance](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) explicitly limits definition hashes to metadata changes. Annotations such as `readOnlyHint` are hints, not enforcement.

## Reproduce the unchanged-manifest counterexample

Download [the fixture](/examples/ai-security/defense-demo.py). With Python 3.11 or newer:

```bash
python3 defense-demo.py mcp
```

Expected final line:

```text
PASS: 6 deterministic checks; mode=mcp; no LLM or network exercised
```

`same_manifest` is true. Changing only `annotations.readOnlyHint` makes `annotation_drift` false. Hashing descriptions alone misses schema and annotation changes that can influence approval behavior.

`unchanged_manifest_new_behavior` is true too: the controlled behavior fixture produces an unexpected export marker while metadata still matches. True means the counterexample occurred, not that the server is safe. No actual MCP transport or OAuth flow runs here; the fixture isolates what each check can observe.

## Keep tokens bound to their recipients

Audience identifies a token's intended recipient. [The MCP 2026-07-28 authorization security requirements](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations) require servers to accept tokens issued for themselves. Upstream API requests use a separate token issued by that upstream authorization server; passing the incoming MCP token through is forbidden.

`expected_audience` matches `ticket-mcp`; `wrong_audience_rejected` rejects `other-mcp`. These are policy fixtures over already-verified claims, not signature, issuer, time, scope, or revocation validation. Simply decoding a JWT is insufficient.

Correct audience still does not let Alice read S-1. A server using a global administrator credential may become a deputy for unauthorized access. Preserve the authenticated caller through the backend object-policy check.

## Pin the protocol revision

The earlier identity lesson cited security guidance for 2025-11-25. This lesson uses 2026-07-28 transport and authorization pages. [The transport overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) distinguishes earlier connection-scoped sessions and initialization from the newer per-request metadata model, with compatibility rules for older peers.

Do not describe a legacy session flow as universal current behavior. Record client/server/SDK versions and the negotiated revision, then test the route actually used. A connection or session identifier does not replace authorization of protected actions.

## Turn installation and updates into checks

A local server is executable code. Using stdio changes communication, not filesystem, network, or credential access. Review exact startup commands, package origin, locked version, and required capabilities. Retrieved web content must not silently install executables.

A local lockfile cannot pin a remote service's behavior. Monitor complete tool definitions, separate credentials by server, restrict downstream APIs and destinations, and continuously replay owner and cross-tenant cases with synthetic accounts. Changed definitions need review; unchanged definitions still need execution boundaries.

For cloud deployment, test OAuth discovery destinations, redirects, service identity, and egress restrictions. TLS does not authorize cloud-metadata access or cross-tenant reads.

## Check your understanding

1. Does a matching manifest hash prove no new remote side effects?
2. Can a valid `ticket-mcp` token be passed directly to the ticket API?
3. Can a read-only annotation replace runtime policy?

All three answers are no. Use behavior and capability boundaries, an appropriate upstream credential, and independent object/action checks respectively. Fill in the four-row trust table for each server you currently use.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-output-handling-en).

## References

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
- [MCP 2026-07-28: Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
