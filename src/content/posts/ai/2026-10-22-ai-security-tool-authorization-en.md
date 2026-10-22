---
title: "An available tool does not authorize this invocation"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, authorization]
lang: en
description: "Use an executable export fixture to examine caller binding, arguments, expiry, and approval replay."
tldr: "Bind a ticket export to its caller, resource, action, destination, and approval. Test substituted arguments, revocation, expiry, and replay."
difficulty: 進階
draft: true
series:
  name: "AI Security in Practice"
  order: 12
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-tool-authorization)

The assistant has an `export_ticket` tool. Alice approved one call, but the model changes the destination or substitutes Bob's N-2 for N-1. The tool name looks unchanged; the action is different.

This lesson asks whether **this caller may perform this action on this resource with these arguments, this time**. Read [identity and authorization](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en) and [injection defenses](/posts/ai/2026-10-22-ai-security-injection-defenses-en) first.

## A tool name hides many decisions

A tool accepting arbitrary ticket IDs and URLs has broad authority. Listing it does not authorize every invocation. [OWASP's MCP guidance](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) assesses operations by effects rather than relying only on read/write labels. Reads may disclose sensitive data; exports introduce another recipient.

Our example permits Alice to export her N-1 to a configured report inbox. Bob's N-2 and Carol's S-1 are outside her access. The destination is server policy, not a URL the model considers internal-looking.

| Value | Trusted source | Model authority |
|---|---|---|
| Caller and tenant | Verified authentication context | Cannot switch identities |
| Owner and tenant of ticket | Backend storage | Cannot redefine ownership |
| Tool arguments | Model proposal, server validation | May propose, not authorize |
| Approval | Protected record of a specific action | An attachment cannot grant it |

## Run the checks

Download [the fixture](/examples/ai-security/defense-demo.py). With Python 3.11 or newer:

```bash
python3 defense-demo.py tool
```

Expected final line:

```text
PASS: 17 deterministic checks; mode=tool; no LLM or network exercised
```

`normal_export` returns `export_recorded`; reusing its approval returns `approval_replay`. A changed destination yields `forbidden_destination`. Same-tenant non-owner and cross-tenant requests yield `forbidden_resource`. These are synthetic effects; no export is sent. Malformed null, list, string, and integer calls, a numeric destination, and an invalid approval are rejected without crashing the validator.

`wrong_user` is especially useful: Bob owns N-2 but cannot use Alice's approval. `changed_approved_arguments` pairs an otherwise legal N-1 request with an approval hash for N-2. It returns `approval_mismatch`, exercising argument binding rather than relying on resource denial alone.

## Bind approval to the whole action

The fixture canonicalizes complete arguments and hashes them. An approval contains caller, argument hash, expiry, and a one-use ID. Execution checks current access, destination, approval, expiry, and replay before consuming the ID.

```text
Authenticated caller → argument validation → current policy
→ specific approval → expiry/replay check → effect record
```

A hash compares arguments; it does not authenticate approval. The Python dictionary represents trusted server storage. A client-supplied dictionary with the same fields is not consent. Production needs protected server records or fully verified signed credentials. Render the approval view from the same canonical action used at execution.

Include every effect-changing field: recipient, selected columns, format, volume, environment, and relevant document version. Approval for one record must not authorize an entire paginated collection.

## Handle revocation and retries

`revoked_after_approval` denies access lost between approval and execution. `expired` denies an old approval. Approval is not a permanent policy exemption.

The in-memory `used` set demonstrates replay rejection, not distributed atomicity. A deployed service needs transactional coordination or an idempotent workflow that records attempts and outcomes. Consuming approval before a failed send needs recovery; a successful send followed by a failed result write must not silently cause another send.

Record operation ID, approval ID, and a side-effect receipt. Distinguish not started, failed, completed, and unknown. Do not put tokens, approval credentials, or ticket text in ordinary logs.

## Connect real services

Supply identity in a trusted adapter, without exposing `user_id` as a model argument. Prefer a configured recipient ID resolved by the backend to an arbitrary URL.

For remote services, validate token audience and delegated scope too. [MCP's authorization security requirements](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations) require tokens issued for that server. Correct audience still does not authorize Alice to export S-1: authentication, delegation, and object policy are distinct checks.

Use your controlled test receiver. Complete a legitimate export, then vary resource, recipient, caller, time, and approval ID independently. An all-deny system may simply be broken.

## Check your understanding

1. Can the model change a recipient after “export N-1” was approved?
2. Can Bob reuse Alice's approval for his own N-2?
3. Does an in-memory replay check establish safe distributed retries?

Answers: no, recipients must be bound too; no, approvals bind caller and action; and no, concurrency and failure cases require separate verification.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-mcp-trust-en).

## References

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
