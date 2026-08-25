---
title: "Delegated Authorization for AI Agents: Do Not Hand User Tokens to the Model"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ai-agent, authorization, oauth, security, identity, authzen]
lang: en
tldr: "An agent should execute one task with a short-lived, audience- and permission-restricted credential while preserving user and agent identities, execution-time authorization, confirmation, and audit lineage."
description: "Designing authorization for agents acting on behalf of users with OAuth Token Exchange, Resource Indicators, RAR, DPoP, and AuthZEN."
series:
  name: "Technology Choices in the AI Era"
  order: 49
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-agent-delegated-authorization)

When an agent sends mail, pays, or changes production “on behalf of a user,” authentication is only the start. The system must retain who delegated, which agent or client executes, which action is allowed on which resource, for how long, and whether new confirmation is required.

The most dangerous shortcut puts a session cookie, API key, or OAuth refresh token in a prompt. Model input, traces, tool logs, and third-party connectors expand exposure. One broad, long-lived token cannot express “allow exactly this refund once.”

## Compile delegation into a least-privilege credential

```text
user session / consent
          ↓
    token broker / STS
          ↓  short-lived, audience/action/resource restricted
 agent orchestrator ──→ tool API PEP ──→ execution
                         ↓
                    PDP decision
                         ↓
                    immutable audit
```

[OAuth Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html) defines token exchange and representations such as subject and actor; it does not create a complete delegation policy by itself. [Resource Indicators](https://www.rfc-editor.org/rfc/rfc8707.html) restrict where a token is intended to be used, while scopes restrict what it can do. [Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396.html) can express finer actions and resources through `authorization_details`.

Before each tool call, a broker issues a short-lived token and keeps the original refresh token away from the orchestrator. Bind the token to audience, scope or action, subject, agent/client identity, tenant, expiry, and a delegation ID. Where practical, [DPoP](https://www.rfc-editor.org/rfc/rfc9449.html) sender-constrains it to a key, reducing replay after theft.

## Re-evaluate authorization at execution

Prompt text and tool names are untrusted intent, not authorization. Each API acts as a policy enforcement point (PEP): validate the token, then ask a policy decision point (PDP) about subject, resource, action, and context. [AuthZEN Authorization API 1.0](https://openid.github.io/authzen/) standardizes this PEP/PDP decision interface, but it is a general authorization API rather than an agent framework.

Context can include tenant, transaction amount, sensitivity, time, and risk. Recomputing policy immediately before execution catches a removed member, changed owner, exhausted budget, or revoked delegation.

## Confirmation, revocation, and audit are product surfaces

Listing drafts may run automatically. Sending mail, deleting data, payments, and production changes should show the exact diff, target, and impact before obtaining a one-time confirmation. Bind that confirmation to a concrete action digest so generic consent cannot authorize a different action later.

Record the human subject, agent/client, delegation chain, policy and version, resource, decision, tool-input digest, and result. Redact sensitive content and never log tokens. Add expiry, revocation, per-action or monetary budgets, tool allowlists, and an emergency kill switch.

A service account with strict tenant filters may suffice for low-sensitivity internal reads. Cross-user resources, external OAuth, or irreversible actions justify a token broker and centralized policy. Test by tampering with prompts, replaying tokens, changing audiences, and removing memberships; enforcement belongs at the API, not in a model's promise.

## References

- [OAuth 2.0 Security Best Current Practice (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OAuth 2.0 Token Exchange (RFC 8693)](https://www.rfc-editor.org/rfc/rfc8693.html)
- [OAuth 2.0 Resource Indicators (RFC 8707)](https://www.rfc-editor.org/rfc/rfc8707.html)
- [OAuth 2.0 Rich Authorization Requests (RFC 9396)](https://www.rfc-editor.org/rfc/rfc9396.html)
- [OAuth 2.0 Demonstrating Proof of Possession (RFC 9449)](https://www.rfc-editor.org/rfc/rfc9449.html)
- [AuthZEN Authorization API 1.0](https://openid.github.io/authzen/)
