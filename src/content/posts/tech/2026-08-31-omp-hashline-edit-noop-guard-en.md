---
title: "OMP hashline edit & noop-loop-guard: Why file edits must be hash-anchored, and how 182/205 byte-identical no-op retries were tamed"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, hashline, edit-tool, noop-loop-guard, coding-agent, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 6
tldr: "OMP replaces traditional line-number patches with hashline: 4-hex content hash + N* syntactic block locators eliminate whitespace drift. noop-loop-guard tracks per-session, per-canonical-path, per-input-hash consecutive no-ops; after 3 (NOOP_HARD_LIMIT) it throws a ToolError so the agent loop sees a tool failure — breaking the model's 182/205 retry loop from issue #2081 where soft hints were completely ignored."
description: "Deep dive into hashline format design, Patcher.prepare/commit two-phase, tree-sitter block-resolver for deterministic syntactic spans, noop-loop-guard's per-session counter with hard limit (NOOP_HARD_LIMIT=3), and why this combo beats traditional unified-diff + line-number approaches for handling model retry behavior."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, part 6. Previous parts covered the [agent loop double-while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en), [append-only context](/posts/tech/2026-08-31-omp-append-only-context-en), [four compaction strategies](/posts/tech/2026-08-31-omp-four-compaction-strategies-en), [three-layer approval](/posts/tech/2026-08-31-omp-approval-three-layers-en), and [bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval-en). This episode examines the file editing subsystem.

---

## TL;DR

- **hashline format**: `[path#HASH]` header + `PUT N*:` / `CUT N*` / `PUT >N*:` block-level ops. **Anchors are content hash + syntactic block (`N*`), not line numbers**. Eliminates whitespace drift, line-number staleness, and merge-conflict line invalidation.
- **`executeHashlineSingle`** (`execute.ts#executeHashlineSingle`): `Patcher.prepare` (read-only parse, fail-fast) → `Patcher.commit` (actual writes). Multi-section prepares all first, then commits sequentially; single-section fast path merges both.
- **block-resolver** (`block-resolver.ts#nativeBlockResolver`): tree-sitter parses language, returns actual `start–end` line span of the syntactic block starting at line `N`. Same content + same line = same span — **deterministic, memoizable**.
- **noop-loop-guard** (`noop-loop-guard.ts`): per-session, per-canonical-path, per-input-hash counter. **3 consecutive** (`NOOP_HARD_LIMIT`) byte-identical no-ops → throw `ToolError`, so the agent loop sees a **tool failure** instead of a soft text hint.
- **issue #2081 real data**: same file, same payload, **205 calls with 182 byte-identical no-ops**. Soft hint ("re-read the file") was completely ineffective; hard limit broke the cycle.

---

## Context

You're building a coding agent's edit tool. The model wants to edit line 42 of `src/foo.ts` and sends you a patch.

**Pain points of traditional unified diff / line-number approaches**:

1. **Line number drift**: Model reads stale file version (or coworker just edited) → line numbers mismatch → patch fails or edits wrong location
2. **Whitespace wars**: `tabs vs spaces`, trailing newline, CRLF/LF, auto-formatter runs → semantically identical content differs byte-wise → patch rejected
3. **Anchor ambiguity**: Model writes "insert near line 40" → at apply time, is it 39, 40, or 41?
4. **Multi-file atomicity**: One patch touches three files; second fails after first already landed → inconsistent state

hashline's answer: **Don't trust line numbers. Trust content hash + syntactic structure.**

---

## Problem

### 1. How to locate "where to edit" without line numbers?

Unified diff uses `@@ -42,7 +42,7 @@`. But:

- Formatter runs → all line numbers scrambled
- Model's snapshot is 5 minutes old → line numbers expired
- Same logical block (e.g., a function) spans 20 lines in one version, 30 in another

### 2. Model behavior when hitting no-op

When a patch parses cleanly, applies cleanly, **but body rows are byte-identical to targeted lines** (zero change):

- Model receives "parsed and applied cleanly, but produced no change"
- Model **misinterprets** this as "anchor wrong" → **expands payload, adds more context lines, or tries different anchor**
- Reality: file **already is the target state**, or anchor is wrong elsewhere (e.g., off-by-one)
- Result: **infinite retry of the exact same bytes** until user manually aborts

Issue #2081 recorded: same file, same payload, **205 calls with 182 byte-identical no-ops**. Soft hint did nothing.

---

## Attempts (visible in comments & git history)

### hashline format evolution

Early OMP (Pi era) used `apply_patch` format (unified-diff-like). Key commits migrating to hashline:

1. **Content hash tag**: `[path#HASH]` header, `HASH` = 4-hex fingerprint of normalized whole-file text (`format.ts#computeFileHash`). Read returns tag; edit sends tag → **optimistic lock**, external modifications cause immediate reject
2. **Block locator `N*`**: `PUT 42*:` means "replace the entire syntactic block starting at line 42". `block-resolver.ts#nativeBlockResolver` uses tree-sitter to resolve actual `start–end`. Same file + same version + same line = same span — **deterministic**
3. **Gap locators `<N` / `>N`**: `PUT >42:` inserts **after** line 42. No block structure needed, just line-number gap
4. **Register / clipboard**: `CUT 10.15 @foo` → `PUT >20 @foo` moves code across files

### noop-loop-guard evolution

`noop-loop-guard.ts` comments (lines 6–14) document plainly:

> A hashline patch can apply cleanly yet produce no change when the body rows are already byte-identical to the targeted lines. [...] in the wild some models ignore the hint and keep re-issuing the same bytes (issue #2081 captured 182 such repeats in 205 calls before the user aborted).

Evolution steps:

1. **Soft hint only** (early): no-op returns text "re-read the file before issuing another edit". Model ignored it.
2. **Per-session guard + input hash**: `recordNoopEdit(session, canonicalPath, inputHash)`. `inputHash = Bun.hash(rawPatchInput).toString(16)` (`noop-loop-guard.ts#hashPatchInput`). **Same payload = same hash**; different payload (even one space) = new hash → counter reset, fresh chance.
3. **Hard limit = 3** (`NOOP_HARD_LIMIT`): 3 consecutive same-hash no-ops → `escalate: true` → `executeHashlineSingle` throws `ToolError` (`execute.ts:239` / `execute.ts:282`). Agent loop sees **tool failure**, forced to change strategy (typically re-`read`).

---

## Solution: hashline + noop-loop-guard combo

### 1. hashline format at a glance

```
[src/foo.ts#1A2B]
PUT 42*:
+export function foo() {
+  return 42;
+}
PUT >50:
+// new helper
+export function bar() { return 1; }
CUT 60.65 @moved
```

- `[path#HASH]`: optimistic lock. `HASH` = `xxHash32(normalizedText) & 0xffff` as 4 hex (`format.ts#computeFileHash`)
- `PUT 42*:` block replacement. `42*` = syntactic block start line. `block-resolver` resolves actual span (e.g., 42–55)
- `PUT >50:` gap insert after line 50
- `CUT 60.65 @moved`: cut lines 60–65 into named register `@moved`
- Body rows: `+new line` literal insert. `-old line` only appears in unified-diff contamination; parser rejects or converts

### 2. `executeHashlineSingle` flow

```typescript
// execute.ts#executeHashlineSingle
async function executeHashlineSingle(options) {
  // 1. Parse patch sections
  const patch = Patch.parse(input, { cwd: session.cwd });
  
  // 2. Build filesystem + patcher
  const fs = new HashlineFilesystem({...});
  const patcher = new Patcher({ fs, snapshots, blockResolver: nativeBlockResolver, ... });
  
  // 3. Single-section fast path
  if (patch.sections.length === 1) {
    const prepared = await patcher.prepare(patch.sections[0], clipboard); // read-only, fail-fast
    const result = await patcher.commit(prepared); // actual write
    
    if (result.op === "noop") {
      const { count, escalate } = recordNoopEdit(session, result.canonicalPath, inputHash);
      if (escalate) throw new ToolError(noChangeLoopDiagnostic(...)); // HARD LIMIT
      return renderSection(result, ...); // soft hint
    }
    resetNoopEdit(session, result.canonicalPath); // success → reset counter
    return renderSection(result, ...);
  }
  
  // 4. Multi-section: prepare ALL first (fail fast), then commit sequentially
  const prepared = await Promise.all(patch.sections.map(s => patcher.prepare(s, clipboard)));
  assertUniqueCanonicalPaths(prepared); // same file can't be split across sections
  
  for (const [i, entry] of prepared.entries()) {
    if (entry.isNoop) { /* record + throw ToolError */ }
    const result = await patcher.commit(entry);
    if (result.op === "noop") { /* record + throw ToolError */ }
    resetNoopEdit(session, result.canonicalPath);
    // ...
  }
}
```

**Key design choices**:

- **Prepare/Commit separation**: `prepare` only reads files, resolves blocks, validates anchors, computes all edits — **zero disk writes**. Any section fails (anchor missing, block unresolvable, hash mismatch) → entire patch rejected, **zero partial writes**.
- **Multi-section atomic-ish**: prepare all first, then commit in order. Mid-batch failure leaves earlier sections on disk (non-atomic), but clipboard state syncs to landed prefix (`sectionStates[i]` fork → `commitClipboard`), so `CUT` → `PUT @reg` never loses data.
- **LSP batch flush only on last section**: reduces diagnostic round-trips.

### 3. Block Resolver: tree-sitter for deterministic spans

```typescript
// block-resolver.ts#nativeBlockResolver
export const nativeBlockResolver: BlockResolver = ({ path, text, line }) => {
  const key = `${Bun.hash(text).toString(36)}:${text.length}:${line}:${path}`;
  const cached = resolutionCache.get(key);
  if (cached !== undefined) return cached;
  
  const range = blockRangeAt({ code: text, path, line }); // pi-natives: tree-sitter
  const result = range ? { start: range.startLine, end: range.endLine } : null;
  
  // FIFO-bounded memo (512 entries)
  if (resolutionCache.size >= 512) resolutionCache.delete(resolutionCache.keys().next().value);
  resolutionCache.set(key, result);
  return result;
};
```

- **Input**: `path` (infers language), `text` (full file), `line` (anchor line, 1-indexed)
- **Output**: `{ start, end }` or `null` (unsupported language, syntax error, OOB, line not a block opener)
- **Memo key**: `hash(text) + length + line + path`. **Same content + same line = same span** — streaming preview re-resolving identical content is near-instant
- **Languages supported**: TypeScript, Python, Rust, Go, JS/JSX, TSX, JSON, Markdown — any with tree-sitter grammar

**Why not LSP `documentSymbol`?** Tree-sitter is synchronous, local, zero RPC latency, no language server startup. LSP reserved for diagnostics.

### 4. Noop Loop Guard: from soft hint to hard error

```typescript
// noop-loop-guard.ts#recordNoopEdit
export function recordNoopEdit(session, canonicalPath, inputHash): NoopRecordResult {
  const guard = getNoopLoopGuard(session); // lazy init on session
  const prev = guard.entries.get(canonicalPath);
  const count = prev && prev.hash === inputHash ? prev.count + 1 : 1;
  guard.entries.set(canonicalPath, { hash: inputHash, count });
  return { count, escalate: count >= NOOP_HARD_LIMIT }; // NOOP_HARD_LIMIT = 3
}

export function resetNoopEdit(session, canonicalPath): void {
  const guard = session.noopLoopGuard;
  if (!guard) return;
  guard.entries.delete(canonicalPath);
}
```

**State machine**:

| State | Trigger | Action |
|-------|---------|--------|
| First no-op | `count=1`, `escalate=false` | Return soft hint text |
| 2nd same-hash no-op | `count=2`, `escalate=false` | Return soft hint text |
| **3rd same-hash no-op** | `count=3`, `escalate=true` | **Throw `ToolError`**, agent loop sees failure |
| Non-no-op commit | `resetNoopEdit` | Delete entry; next no-op starts at 1 |
| Different-hash no-op | `prev.hash !== inputHash` | `count=1` reset (model made progress) |

**Why key on `inputHash` not file content hash?**

> `inputHash` is intentionally derived from the raw model-authored bytes rather than from file content: when the model emits a different payload (even whitespace-only) that's progress and earns a fresh soft hint, but re-issuing the same bytes after being warned is what we want to break. (`noop-loop-guard.ts:66-69`)

If model **modifies payload** (even just adds a space, changes indent) → treated as "attempting correction" → fresh chance. Only **re-emitting identical bytes** accumulates count.

### 5. Real data: issue #2081

```
Same file, same payload, same session:
- Total calls: 205
- Byte-identical no-ops: 182
- Actual changes: 0
- User finally manually aborted

With noop-loop-guard (NOOP_HARD_LIMIT=3):
- 1st no-op → soft hint
- 2nd no-op → soft hint  
- 3rd no-op → ToolError ("STOP. Edits to foo.ts have been a byte-identical no-op 3 times in a row...")
- Agent loop receives tool failure → forces model to re-read or change strategy
```

---

## Why this way: design trade-offs

### Why `NOOP_HARD_LIMIT = 3` so small?

Comments (`noop-loop-guard.ts:34-40`):

> Picked deliberately small so the soft hint still fires once or twice before we escalate — the model deserves a chance to recover, but a tight bound is what actually breaks loops in practice.

- 1 is too strict: false positives on normal "first try missed, second try adjusted anchor"
- Too large (e.g., 10): issue #2081 proves model retries 182 times unchanged
- **3 is empirical**: 2 grace attempts, 3rd hard stop. Proven to break most loops.

### Why `ToolError` not continued text hint?

`execute.ts:74-79` comments:

> Thrown as a ToolError so the agent loop sees a tool *failure* — empirically far more effective at breaking a no-op edit loop than the soft hint alone.

Agent loop handles `ToolError`: records failure, bubbles up, may trigger retry policy, or shows model "tool failed" instead of "tool succeeded but no change". The latter misleads model into thinking "tool works, I just need bigger payload".

### Why three-level isolation: per-session, per-canonical-path, per-input-hash?

- **Per-session**: independent agent runs (different user conversations) don't interfere
- **Per-canonical-path**: stuck on `a.ts` shouldn't affect `b.ts` counter (test `does not accumulate across distinct canonical paths` verifies)
- **Per-input-hash**: model changed payload = progress = reset counter. Only "stubbornly repeating same bytes" counts

### How hashline avoids whitespace wars?

1. **Header hash tag**: `[path#HASH]` forces model to edit against **exact content**. External formatter runs → hash changes → next edit mismatches immediately → forces re-read
2. **Block locator `N*`**: targets syntactic block (function, class, if statement), **ignores intra-line indent, blank lines, comments**. Same logical block in formatted/unformatted versions has different spans, but `N*` resolves correctly in both
3. **Body rows only match `+TEXT`**: parser only sees `+`-prefixed lines, ignores indent differences, trailing space. `apply` uses exact byte comparison for no-op detection
4. **Normalized file hash**: `computeFileHash` first `normalizeFileHashText` stripping per-line trailing `[ \t\r]` (`format.ts:108-110`), so CRLF/LF, trailing space don't invalidate tag

---

## Lessons learned

1. **Anchors must bind to content structure, not line numbers**. `N*` + content hash solves "file modified externally", "formatter ran", "model read stale version" simultaneously.
2. **Prepare/Commit separation is basic hygiene for edit tools**. Any patch format should "read all, validate all, compute all edits" — confirm zero conflicts before any disk write. OMP's `Patcher.prepare`/`commit` is textbook implementation.
3. **Models ignore soft hints**. Issue #2081 is proof: 182/205 retries completely ignored "re-read the file". **Must escalate no-op to tool failure** for agent loop to switch strategy.
4. **Hard limit must be small and precise**. `NOOP_HARD_LIMIT=3` looks aggressive, but "giving chances" here is harmful — model tries more, payload grows, context gets expensive.
5. **Input hash = fingerprint of model intent**. Hashing raw patch bytes (not file content) precisely captures "model repeating same mistake" vs "model trying new payload".
6. **Tree-sitter block resolution beats LSP for edit positioning**. Synchronous, local, deterministic, memoizable. LSP stays for diagnostics.
7. **Tests must cover cross-session, cross-path, cross-hash isolation**. `hashline-loop-guard.test.ts`'s 5 tests (soft hint escalation, hard escalate, cross-path isolation, success commit reset, cross-session isolation) fully verify the guard's state machine.

---

## References

- `packages/coding-agent/src/edit/hashline/execute.ts` — `executeHashlineSingle` (203–292), `noChangeDiagnostic` (58–71), `noChangeLoopDiagnostic` (81–89), `renderSection` (148–201)
- `packages/coding-agent/src/edit/hashline/noop-loop-guard.ts` — `recordNoopEdit` (71–81), `resetNoopEdit` (87–91), `hashPatchInput` (97–98), `NOOP_HARD_LIMIT` (40)
- `packages/coding-agent/src/edit/hashline/block-resolver.ts` — `nativeBlockResolver` (21–32)
- `packages/coding-agent/src/edit/hashline/format.ts` — `computeFileHash` (117–121), `formatHashlineHeader` (133–135), `HL_BLOCK_SUFFIX` (30–31)
- `packages/hashline/src/parser.ts` — `Executor` state machine, block op lowering (683–699)
- `packages/hashline/src/types.ts` — `BlockResolution` (175–184), `BlockResolver` (201)
- `packages/coding-agent/test/core/hashline-loop-guard.test.ts` — 5 guard behavior tests
- Issue #2081 — 182/205 byte-identical no-op empirical record

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, episode 6. Previous: [bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval-en). Next: TBD.*