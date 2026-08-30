---
title: "OMP append-only context: Why sync conversation by byte-stable prefix? How Anthropic/DeepSeek KV cache gets protected"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, context-management, prompt-cache, kv-cache, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 2
tldr: "omp uses StablePrefix to freeze system prompt + tool specs, AppendOnlyLog for append-only messages, and digest-based longestStablePrefix algorithm. When prune/shake/steering rewrite history, only the tail after the divergence point is resent. This maximizes Anthropic/DeepSeek prompt cache hit rate, fixing the old issue where every turn forced ~40k token re-prefill on llama.cpp (issue #3406)."
description: "Deep dive into append-only-context.ts: StablePrefix, AppendOnlyLog, syncMessages three mechanisms, fingerprint/digest/WeakMap memo with estimate version cache-coherence contract, and why this complexity beats naive append for cache efficiency."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 2. Previous post dissected the [agent loop double while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en); this one examines how context preserves the "longest unchanged byte prefix" across model calls.

---

## TL;DR

- **StablePrefix** (lines 49–91): system prompt + tool specs computed once, fingerprint-matched for reuse; only `invalidate()` on MCP reconnect forces rebuild
- **AppendOnlyLog** (lines 103–146): messages only grow via `append`/`extend`/`replaceTail`(compaction)/`truncate`; no re-serialization of past turns
- **syncMessages** (lines 226–256): three cases — normal append, compaction (clear + replay), in-place rewrite (find **longest byte-stable prefix**, truncate, append diverged tail)
- **#messageDigest + #digestMemo** (lines 306–334): deterministic digest covering all provider-serialized fields (role, content, toolCalls, tool_calls, providerPayload, etc.); WeakMap keyed by message object identity, value includes `estimate version`; in-place mutation must call `invalidateMessageCache` to bump version
- **Why this complexity**: old code `log.clear()` on any digest change → forced ~40k token re-prefill every turn on llama.cpp/local backends (issue #3406); now only divergence tail resent, provider KV cache stays warm

---

## Context

You're running a long-running coding agent conversation. Turn 10: user asks a question, model returns 2000 tokens. Turn 11: user follows up with one sentence.

**If you re-serialize the entire conversation every turn**: turn 11 sends 12,000 tokens, 10,000 of which are identical history from turns 1–10. Anthropic's prompt cache (or DeepSeek's KV cache) *could* hit on those 10,000 tokens — but if your serialization differs by even one space, one field order, one regenerated tool call ID — **cache miss**. Full 10,000 token re-prefill. More cost, more latency.

omp hit this for real (issue #3406): any prune pass, shake pass, strip-images, steering re-wrap that touched a single history message triggered `log.clear()` in the old code. Next turn: entire conversation resent. On llama.cpp-style local backends, **every turn forced ~40k token re-prefill**.

---

## Problem

Naive `append-only` isn't enough. Reality has three "non-append" operations:

1. **Compaction**: old history replaced by summary → message array shrinks
2. **Per-turn pruning / transformContext re-render / strip-images**: same message object **mutated in-place** (content truncated, images removed, XML tags injected)
3. **Steering / aside injection**: new messages inserted in the middle, shifting subsequent messages

If these all trigger "resend entire log", prompt cache dies. But if you ignore them, log drifts from what's actually sent to the provider.

**Core challenge**: balance "log must reflect latest state" with "preserve byte-stable prefix for cache hits".

---

## Attempts (visible in comments & git history)

`append-only-context.ts` comments (lines 219–224) document the evolution bluntly:

> Earlier revisions cleared the whole log on any digest change, which on llama.cpp / local backends forced a full ~40k-token re-prefill every turn that an extension, prune pass, or steering re-wrap rewrote a single message (#3406).

Old: any digest change → `log.clear()` → resend all.

New: find **longest byte-stable prefix** (`#longestStablePrefix`), truncate to divergence point, resend only tail.

Key sub-problems in this evolution:

- **What defines "byte-stable"?** Can't just compare high-level fields; provider serialization may include internal fields (`providerPayload`, `tool_calls` snake_case, etc.) — all must feed the digest
- **How to detect in-place mutation?** Message object identity stable, content changed → WeakMap memo needs version mechanism
- **How to handle compaction?** Array shrinks → no prefix alignment possible → must `clear()` and replay
- **MCP reconnect / model switch?** Prefix fingerprint changed → `invalidateForModelChange()` clears prefix + log

---

## Solution: Three Layered Mechanisms

### 1. StablePrefix: Freeze the "Unchanging Prefix"

```typescript
// lines 67-75
build(context, options): boolean {
  const snapshot = takeSnapshot(context, options);
  if (this.#snapshot && this.#snapshot.fingerprint === snapshot.fingerprint) {
    return false; // cache hit
  }
  this.#snapshot = snapshot;
  this.#version++;
  return true; // cache miss, prefix actually changed
}
```

- `takeSnapshot`: `systemPrompt` array + `normalizeTools` output + `intentTracing`/`pruneToolDescriptions` options → `JSON.stringify` → fingerprint (lines 355–373)
- Fingerprint match → return cached snapshot, **zero re-serialization of system prompt and tool specs**
- Only `invalidate()` (MCP reconnect) or genuine fingerprint change (tool add/remove, system prompt edit) triggers rebuild

**Effect**: system prompt + tool specs (typically thousands of tokens) stay **bit-identical for entire session**; provider prefix cache hits directly.

### 2. AppendOnlyLog: Append-Only Message Journal

```typescript
// lines 110-141
append(message) { this.#entries.push(message); }
extend(messages) { ... }
replaceTail(replacement) { this.#entries[this.#entries.length - 1] = replacement; } // compaction only
truncate(count) { this.#entries.length = count; } // truncate to stable prefix
```

- Only four operations: `append`, `extend`, `replaceTail` (compaction replaces last), `truncate` (drop post-divergence tail)
- **No** `splice`, `delete`, `modify` — all mutations go through `syncMessages` coordination

### 3. syncMessages: Precise Three-Way Dispatch

```typescript
// lines 226-256
syncMessages(normalizedMessages) {
  // 1. Compaction: array shrank → full replay
  if (normalizedMessages.length < this.#lastSyncCount) {
    this.log.clear(); this.#lastSyncCount = 0; this.#messageDigests = [];
    return;
  }

  // 2. In-place rewrite: find longest byte-stable prefix
  if (this.#lastSyncCount > 0) {
    const stableCount = Math.min(this.#longestStablePrefix(normalizedMessages), this.log.length);
    if (stableCount < this.#lastSyncCount) {
      this.log.truncate(stableCount);
      this.#lastSyncCount = stableCount;
      this.#messageDigests.length = stableCount;
    }
  }

  // 3. Normal append: append divergence tail
  for (let i = this.#lastSyncCount; i < normalizedMessages.length; i++) {
    this.log.append(normalizedMessages[i]);
    this.#messageDigests.push(this.#messageDigest(normalizedMessages[i]));
  }
  this.#lastSyncCount = normalizedMessages.length;
}
```

**Key details**:

- `normalizedMessages` is **provider-level** (post-`convertToLlm`), not session-level `AgentMessage`
- `#lastSyncCount` tracks "how many normalized messages synced last time"
- `#messageDigests` array parallels log, stores each message's digest
- **Compaction case** (lines 229–233): array shortened → old messages replaced by summary → **no alignment possible** → clear and replay
- **In-place rewrite case** (lines 235–247): `#longestStablePrefix` finds shared prefix length between "previously synced log" and "new normalizedMessages", `truncate` to that point, then append diverged new bytes
- **Normal append case** (lines 249–255): everything after `#lastSyncCount` is new → direct append

---

## Why This Way: Digest & Memo Cache-Coherence Contract

### #messageDigest: Deterministic, All-Fields, Provider-Aware

```typescript
// lines 311-334
#messageDigest(msg) {
  const payload = JSON.stringify({
    r: m.role ?? null,
    c: m.content ?? null,
    pp: m.providerPayload ?? null,
    tc: m.toolCalls ?? m.tool_calls ?? null,  // both camelCase and snake_case
    tcid: m.toolCallId ?? m.tool_call_id ?? null,
    tn: m.toolName ?? m.name ?? null,
    err: m.isError ?? null,
    id: m.id ?? null,
  });
  // ... DJB2-like hash
}
```

**Why all these fields?** Provider serialization may use `tool_calls` (OpenAI wire) or `toolCalls` (internal), may embed `providerPayload`, **any field change alters wire bytes** → cache miss. Digest must cover "everything provider might serialize".

### #digestMemo + estimateVersion: Solving In-Place Mutation Coherence

```typescript
// lines 200, 314-316, 332-333
#digestMemo = new WeakMap<object, { version: number; digest: number }>();

const version = messageEstimateVersion(msg as AgentMessage);
const cached = this.#digestMemo.get(m);
if (cached !== undefined && cached.version === version) return cached.digest;
// ... compute digest ...
this.#digestMemo.set(m, { version, digest: hash32 });
```

**Problem**: prune/shake/strip-images **mutate in-place** already-synced message objects (same object reference). WeakMap key = object identity. Without version check, memo forever returns **pre-mutation** digest → `#longestStablePrefix` thinks nothing changed → log not truncated → bytes sent to provider diverge from log.

**Solution**:
1. `messageEstimateVersion` (`compaction/message-cache.ts`) bumps version on in-place mutation (via symbol-keyed version tag)
2. `#messageDigest` checks memo first; `version === cached.version` required for trust; else recomputes and updates memo
3. **Owner MUST call `invalidateMessageCache`** (lines 189–198 comments emphasize) — violating this breaks the cross-module cache-coherence contract, unsupported

This is a **cross-module contract**:
- `AppendOnlyContextManager` trusts `#digestMemo` version check
- `compaction/message-cache.ts`'s `invalidateMessageCache` bumps version
- `tokenizer.ts`'s `checkTokenBudget` shares same version mechanism
- All three uphold: "message object identity stable; content change must bump version"

---

## Lessons Learned

1. **Prompt cache is hypersensitive** — one field order, one regenerated tool ID, one space → full prefix cache miss. omp puts "every field provider might serialize" into digest for **byte-level stability**
2. **Append-only ≠ "only append"** — reality has compaction, prune, steering injection. Key is **find divergence point, resend only tail**, not blindly clear all
3. **In-place mutation needs explicit version protocol** — WeakMap memo only sees identity. Any in-place change must pair with `invalidateMessageCache` version bump. Cross-module contract, not single-file solvable
4. **Fingerprint layering** — system prompt + tool specs (large, stable, expensive) → `StablePrefix.fingerprint`; messages (dynamic, small, frequent) → `#messageDigest`. Two fingerprints, different jobs, different invalidation triggers
5. **Issue #3406 is the best design doc** — comments state "old way → why it hurt → new fix" more precisely than any design doc

---

## References

- `packages/agent/src/append-only-context.ts` — `StablePrefix` (49–91), `AppendOnlyLog` (103–146), `AppendOnlyContextManager.syncMessages` (226–256), `#longestStablePrefix` (296–304), `#messageDigest` (306–334), `#digestMemo` (200, 314–333)
- `packages/agent/src/compaction/message-cache.ts` — `messageEstimateVersion`, `invalidateMessageCache` (other half of cache-coherence contract)
- `packages/agent/src/tokenizer.ts` — `checkTokenBudget`, `estimateVersion` (shares same version mechanism)
- `packages/agent/src/agent-loop.ts` — how `syncContextBeforeModelCall` invokes `build`/`syncMessages` (lines 1162–1163, 1157–1156)

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 2. Previous: [agent loop double while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en). Next: Four compaction strategies (forthcoming)*