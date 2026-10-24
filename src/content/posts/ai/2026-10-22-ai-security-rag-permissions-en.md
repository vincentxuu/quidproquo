---
title: "A correct RAG answer can still disclose someone else’s data"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, rag]
lang: en
description: "Test retrieval isolation, policy epochs, cache dependencies, and queries after revocation."
tldr: "Authorize every retrieval before data reaches the model. Cache hits and post-revocation responses must also respect current access to their source data."
difficulty: 進階
draft: false
series:
  name: "AI Security in Practice"
  order: 11
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-rag-permissions)

Alice asks for a refund update. The assistant accurately summarizes Bob's N-2 refund. The answer is correct, but it violates our owner-only policy. Retrieval-augmented generation supplies evidence for answers; it does not automatically authorize access to that evidence.

This lesson asks **where unauthorized data is excluded and whether old answers remain accessible after revocation**. Start with [identity and authorization](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en). No vector database or model account is required.

## Preserve permissions through chunking

A relevance-only search may return N-1, N-2, and S-1 for Alice. Asking the model to hide unauthorized passages happens after data has crossed the boundary. [Microsoft's multitenant RAG guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag) calls for filtering every retrieval before grounding data reaches the model.

A tenant-specific store separates companies but does not separate Alice from Bob inside north. Every chunk must retain a trustworthy source identity and access-control lineage. Missing ACL metadata must not silently turn a document into public data.

| Caller | Allowed model context | Excluded |
|---|---|---|
| Alice / north | N-1 | N-2, S-1 |
| Bob / north | N-2 | N-1, S-1 |
| Carol / south | S-1 | N-1, N-2 |
| Alice after N-1 revocation | None | All three |

This is a policy specification, not a question for the model to decide dynamically.

## Run the retrieval and cache fixture

Download [the defense fixture](/examples/ai-security/defense-demo.py). With Python 3.11 or newer:

```bash
python3 defense-demo.py rag
```

Expected final line:

```text
PASS: 8 deterministic checks; mode=rag; no LLM or network exercised
```

This is a function-level authorization experiment, without embeddings, similarity search, or generation. The three `*_context` cases inspect allowed source IDs. Alice gets only `['N-1']`. Testing the final answer alone would miss unauthorized data already passed to a model.

The fixture warms an answer cache for Alice and stores `dependencies: ['N-1']`. After revocation, `revoked_retrieval` returns an empty list, but `stale_cache_exists` remains true. This intentionally exposes the bad design: revoking the database read does not erase previously derived answers from memory.

## User-scoped caches still need revocation

A question-only key can serve Alice's answer to Bob. Adding tenant and user isolates callers, but Alice's own permission can still change. [OWASP's RAG cache guidance](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) calls for permission-scoped caches and invalidation when source content or access changes.

The fixture increments a policy-controlled `epoch` from 1 to 2. `epoch_miss` shows the new namespace cannot reuse the old entry. `dependency_recheck` evaluates N-1 against current policy and returns false. Neither the epoch nor the current membership state should come from the model or stale client-supplied claims.

Record every source actually supplied to generation, not only citations the model displays. An answer influenced by N-2 remains derived from N-2 even if its citation is removed. A conservative implementation rejects the whole cached answer and regenerates from authorized inputs.

## Define revocation over time

The fixture revokes permission before the next request. It does not establish instant revocation in a distributed system. Define what happens to requests starting after revocation, in-flight generation, and delayed policy replicas.

A check before retrieval and another before release narrow the window but do not make it atomic. Strict ordering requires coordination between policy changes and release admission. Already-streamed tokens cannot be recalled; a final check does not protect earlier disclosure.

If current policy cannot be obtained, stop serving restricted data instead of returning an old successful answer. Keep policy-service failures distinct from ordinary denied or empty retrievals.

## Verify the deployed path

On a self-hosted index, seed the same three identities and tickets. Exercise the real security filter, inspect authorized source IDs in model requests, and separately check answer, citation, and original-document download paths. Use synthetic data and a restricted evidence capture rather than general-purpose content logs.

Warm the cache, revoke Alice's N-1 access, and ask both the identical and a semantically similar question. The latter can reveal semantic-cache reuse that escaped exact-key invalidation. A stale failover node also violates the promised revocation behavior.

## Check your understanding

1. Does one index per company enforce owner-only access?
2. Retrieval is empty after revocation, but an old summary is returned. Which boundary failed?
3. Can N-2 be removed from dependencies because the model did not cite it?

Answers: no, Alice and Bob still need user-level filtering. The cached-answer release path failed to apply current permissions. Dependencies come from actual generation inputs, not displayed citations. Add a warm-cache, revoke, query-again case to your own system first.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-tool-authorization-en).

## References

- [Microsoft: secure multitenant RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [OWASP: RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
