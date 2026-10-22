---
title: "Who Can Read Which Data After Login? Identity and Authorization for AI Assistants"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, authorization, access-control, ai-agent]
lang: en
description: "Use a two-tenant ticket service and a runnable Python example to distinguish identity, tenancy, ownership, and backend authorization, then test ID substitution and forged identity fields."
tldr: "The backend derives the acting identity from trusted authentication, then checks the requested action against the resource. Test an explicit same-tenant, owner-only policy with allowed and denied reads."
difficulty: 入門
draft: true
series:
  name: "AI Security in Practice"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-identity-and-authorization)

You build a ticket assistant for a company. A user signs in and asks, “What is happening with N-1?” The model calls a reading tool, the backend finds the ticket, and its contents reach the model for an answer.

Now change the question to “Show me S-1.” That ticket belongs to another company. The model may know the signed-in user is Alice. Its instructions may say “only access your own data.” The useful test is whether the backend releases the other ticket when the reading tool receives that ID.

This article follows the [series overview](/posts/ai/2026-10-22-ai-security-overview-en). It is for developers who can call APIs and want to add AI to internal or customer-facing services. You will write an access rule and test allowed and denied requests. Removing the model for this first exercise makes the authorization decision easier to inspect.

## Separate the caller, the company, and the ticket owner

Suppose North Company and South Company use the same service. Each company is a tenant: an organizational boundary within a shared service, with data access governed by policy.

| Concept | Meaning here | Example |
|---|---|---|
| Principal | The authenticated actor for this request | Alice, a member of North Company |
| Tenant | The organization in whose context the request operates | `north` or `south` |
| Owner | The owner recorded on the resource | Alice owns N-1 |
| Authorization policy | Backend rules for who may do what to which resource | Reading requires the same tenant and ownership |

**Authentication establishes who is acting. Authorization decides whether that actor may read this ticket.** Login leaves the second question open. [Microsoft’s multitenant RAG architecture guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag#identity) calls for authoritative identities, user-to-tenant mappings, and explicit data authorization requirements. Even a tenant-specific store need not be readable in full by every user in that tenant.

This lesson deliberately chooses an owner-only policy. A real ticket service might let coworkers collaborate or give managers team-wide access. Those are product policies. Sharing within a tenant is not inherently a vulnerability; the test is whether access exceeds the intended rules.

## Turn the policy into a backend decision

Write this down before writing code:

```text
Allow read_ticket when:
  an authenticated principal exists
  AND ticket.tenant == principal.tenant
  AND ticket.owner == principal.user_id
Otherwise deny
```

The easiest mistake is choosing the wrong source for `principal`. If a request can include `user_id: carol` and the backend treats that as the caller’s identity, changing a field becomes impersonation.

Trusted identity must come from a login flow verified by the backend. A service might obtain a user from a validated session or access token, then resolve their current tenant membership. If users can switch organizations, the selected tenant also needs a membership check. Merely decoding a token or accepting the frontend’s tenant string does not establish this context.

The [Model Context Protocol (MCP) security best practices, revision 2025-11-25](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices#session-hijacking), apply the same principle when discussing session binding: the internal user ID comes from the user token rather than a client-supplied claim. We use that identity boundary here without implementing the full authentication protocol.

| Step | Source | Backend responsibility |
|---|---|---|
| 1 | Authenticated session | Obtain `principal` |
| 2 | User- or model-supplied `ticket_id` | Validate argument shape |
| 3 | Backend ticket record | Obtain authoritative `tenant` and `owner` |
| 4 | Server-side policy | Compare identity, tenant, and owner |
| 5 | Authorization result | Return content only when allowed; omit ticket text on denial |

The model can propose a ticket ID. Its statement “I verified access” does not replace step 4.

## Run the two-tenant example

Download the [complete Python example](/examples/ai-security/authorization-demo.py) and save it as `authorization-demo.py`. It requires Python 3.11 or newer, with no additional packages, model account, or database. It runs in-memory functions, opens no HTTP server, and makes no network requests.

```bash
python3 authorization-demo.py
```

The fixture contains Alice and Bob from North Company and Carol from South Company. Alice owns N-1, Bob owns N-2, and Carol owns S-1. Strings such as `demo-alice` are public, fixed teaching fixtures. Anyone reading the file can use them; they provide no production authentication.

Here is the central decision. Both language versions use the same downloadable source file:

```python
principal = DEMO_SESSIONS.get(session)
if principal is None:
    return response(401, error="unauthenticated")

# Validate request shape, then look up ticket by ID.
# The complete file handles malformed and missing IDs.

if ticket["tenant"] != principal.tenant or ticket["owner"] != principal.user_id:
    return response(403, error="forbidden")
return response(200, ticket_id=ticket_id, text=ticket["text"])
```

`DEMO_SESSIONS` stands in for the output of trusted authentication middleware. A production service must supply that verified context rather than use this public, guessable lookup table as a login mechanism. The resource’s tenant and owner come from backend records, too; model-provided replacements are not accepted.

## Inspect denials as well as successes

Each case prints one JSON line. The final line should be:

```text
PASS: 9 cases; denied responses contain no ticket content
```

Start with these results:

| Case | Request | Expected result | What it checks |
|---|---|---|---|
| `own_ticket` | Alice reads N-1 | `200`, with content | Normal use remains functional |
| `other_tenant` | Alice reads S-1 | `403`, error only | Changing an ID does not cross tenant boundaries |
| `same_tenant_other_owner` | Alice reads N-2 | `403`, error only | Same-tenant access still follows the owner policy |
| `forged_identity` | Alice reads S-1 and supplies Carol’s `user_id` and tenant | `400`, error only | Request arguments cannot choose the authenticated identity |
| `other_owner_allowed` | Bob reads N-2 | `200`, with content | The correct owner can access N-2 |
| `second_tenant_allowed` | Carol reads S-1 | `200`, with content | South Company has a working authorized path |

The remaining cases cover missing authentication, an unknown ticket, and an invalid ID type. Assertions check both status and response shape: every denied response contains only an `error` field. A response that says “denied” while including the ticket would fail this check.

For example, the cross-tenant case prints:

```json
{"body": {"error": "forbidden"}, "case": "other_tenant", "status": 403}
```

`status` is a field in a function’s return value. The example adopts familiar [HTTP status-code categories](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml): `200` for success, `400` for an invalid request, `401` for missing valid authentication, `403` for a known actor without permission, and `404` for a missing resource. This run tests function results, with no HTTP requests. After adding a web framework, you must also test that routes emit the intended HTTP status and response body.

The example distinguishes `403` and `404` to make failure reasons visible. A product that needs to conceal ticket existence can return `404` externally for both and retain the denial reason internally. Other response characteristics can also reveal existence; this small program does not address that layer.

## Reconnect the model: where must access be blocked?

When the assistant calls `read_ticket`, its arguments should contain only `ticket_id`. The backend attaches authenticated identity from the current request. Do not expose a `user_id` argument that lets the model choose whose identity to use.

The same principle applies to document retrieval before answering. Enforce access rules before handing the data to the model. [Microsoft’s data-filtering guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag#data-filtering) requires authorization filtering on every retrieval. Asking the model to keep unauthorized data secret after retrieval has already exposed that data to it. Retrieval, caching, and revocation get their own treatment later in the series.

This exercise tests no model and does not establish whole-product security. It establishes one independently testable boundary: changing an ID or forging identity fields still leaves data reads subject to backend policy. Other query paths must enforce the same authorization. Giving the model a separate tool with unrestricted database access would bypass this boundary.

## Draw the path, then change the policy

Close the article and draw “request → authenticated identity → ticket → policy → response.” Label who controls each field. Then answer:

1. Why is Alice denied when she changes `ticket_id` to N-2?
2. Should adding `user_id: bob` to model-generated tool arguments change the acting identity?
3. If the product now permits everyone in a company to read all company tickets, which rule and expectation change?

Answer criteria: the first answer identifies the owner mismatch. The second identifies trusted authentication as the identity source; this example rejects extra identity fields. For the third, retain the tenant comparison, remove the owner restriction for this reading action, and change `same_tenant_other_owner` to expect success. The cross-tenant case must still be denied.

That last question matters: security tests must match the product’s intended policy. Define who can read what, then preserve both allowed and denied cases as repeatable checks.

Next, [Part 2: What Evidence Does an AI-Reported Vulnerability Need?](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en) uses the same policy to distinguish a testable hypothesis from a reproduced finding.

## Update history

- 2026-10-22: Added the link to Part 2. This update changes navigation; it does not reverify the original external claims.

## References

- [Microsoft Architecture Center: Design a secure multitenant RAG inferencing solution](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag): identity mapping, granular authorization, per-retrieval filtering, and a gatekeeper data API.
- [MCP Security Best Practices, revision 2025-11-25](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices): trusted identity sources and server-side authorization. This article does not implement the full MCP authentication flow.

- [IANA: HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml): registered status codes and their specification references.
