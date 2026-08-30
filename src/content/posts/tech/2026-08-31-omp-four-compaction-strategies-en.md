---
title: "OMP four compaction strategies: context-full / snapcompact / branch summary / shake — what each solves and how they switch"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, compaction, context-management, agent-loop, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 3
tldr: "omp doesn't have just one compaction: context-full uses LLM summarization with iterative windows and budget halving retries; snapcompact skips the LLM entirely, rendering history as dense PNG bitmaps for vision models to read — solving no-API-key, low-latency, vision-model-cheaper scenarios; branch summary summarizes the abandoned branch during `/tree` navigation so file ops aren't lost; shake mechanically replaces tool-result text and large fenced/XML blocks with placeholders — an emergency hatch when summary is too heavy and prune isn't enough. Four strategies, distinct failure modes, orchestrated by session maintenance or manual triggers."
description: "Deep dive into omp's four compaction mechanisms: context-full (compaction.ts), snapcompact (snapcompact.ts), branch summary (branch-summarization.ts), shake (shake.ts). Breaking down each one's trigger conditions, failure modes, switching logic, and why four instead of one."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 3. Previous posts dissected the [agent loop double while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en) and [append-only context](/posts/tech/2026-08-31-omp-append-only-context-en); this one examines "what happens when conversation gets too long" — four different mechanisms with distinct jobs.

---

## TL;DR

| Strategy | Core Mechanism | Trigger | Solves What Failure Mode |
|---|---|---|---|
| **context-full** | LLM text summarization, iterative windows (`planSummaryWindows`), budget-halving retries on failure | Auto: context exceeds threshold; Manual: `/compact` | Token explosion, needs semantic-faithful summary |
| **snapcompact** | No LLM call — renders history as PNG bitmaps, vision model reads images | Auto: context blows, prefers low-latency/no-API-key; Manual: `/compact --snap` | No API key, vision models cheaper, need ultra-low latency |
| **branch summary** | On `/tree` leaf switch, LLM summarizes the abandoned branch | Interactive: when navigating to new leaf via `/tree` | Tree navigation loses file ops/decision context of departed branch |
| **shake** | Purely mechanical: tool-result text and fenced/XML blocks → short placeholders; preserves non-text content | Manual: `/shake`; Auto: rescue (dead-end recovery) | Summary too heavy, prune insufficient, emergency space reclamation |

---

## Context

A coding agent runs long. Turn 50: user asks a simple question, but model must swallow 100k tokens of history first. Cost explodes, latency spikes, or context window exceeded → hard error.

**One compaction strategy isn't enough** because failure modes differ:

- Sometimes you need **semantic fidelity** (preserve decision rationale) → needs LLM summary
- Sometimes **zero API key**, or **ultra-low latency** → can't call LLM
- Sometimes user switches branches in `/tree` and **must not lose file ops from the departed branch** → needs targeted summary
- Sometimes summary still too big, prune can't cut enough → needs **mechanical hard cut** as emergency

omp's answer: four strategies, each owns a failure mode, orchestrated by `SessionMaintenance` automatically or user manually.

---

## Strategy 1: context-full — LLM Text Summarization (Default Fallback)

**Files**: `packages/agent/src/compaction/compaction.ts`, `compaction-v2-streaming.ts`

### Core Flow

```typescript
// compaction.ts generateSummary()
async function generateSummary(
  messages: AgentMessage[],
  model: Model,
  apiKey: ApiKey,
  options: SummaryOptions
): Promise<CompactionResult> {
  // 1. Compute available token budget
  // 2. Too many messages? → planSummaryWindows splits into iterative windows
  // 3. Each window calls LLM (compactionSummaryPrompt / compactionUpdateSummaryPrompt)
  // 4. On failure: halve maxTokens and retry (max 3 attempts)
  // 5. Returns summary + shortSummary + details(file ops) + preserveData
}
```

### Key Designs

| Mechanism | Description |
|---|---|
| **Iterative windowing** (`planSummaryWindows`) | History too long for single LLM call → split into windows; each window's summary feeds the next → "summary of summaries" |
| **Budget-adaptive retry** | LLM response exceeds token limit → auto-halve `maxTokens` and retry (max 3×) |
| **shortSummary** | One-liner for UI display, separate from full summary |
| **details / preserveData** | `details.readFiles`, `details.modifiedFiles` track file ops; `preserveData` for provider-native compaction |
| **Handoff document** (`handoffDocumentPrompt`) | Structured handoff for subagents / new sessions, richer than summary |

### Two Implementation Paths

1. **Standard compaction** (`compaction.ts`): builds prompt, calls LLM, parses response
2. **Compaction v2 streaming** (`compaction-v2-streaming.ts`): uses provider native `compaction` API (OpenAI Codex, Anthropic, etc.) — fewer tokens, faster

**Trigger**: `SessionMaintenance` detects `tokensBefore > threshold` → schedules compaction; or user runs `/compact`.

---

## Strategy 2: snapcompact — Compress Conversation to PNG, Vision Model Reads

**Files**: `packages/snapcompact/src/snapcompact.ts`, `crates/pi-natives/src/snapcompact.rs`

### Core Concept

> Skip LLM summarization. Instead, **render history text as dense bitmap images (PNG)**, feed to vision model.

```typescript
// snapcompact.ts compact()
export async function compact(
  messages: AgentMessage[],
  model: Model,
  options: SnapcompactOptions
): Promise<SnapcompactResult> {
  // 1. Pick shape (per provider: Anthropic 11on16-bw / Google 8on22-bw / OpenAI 8on22-bw)
  // 2. serializeConversationForSummary() → plain text
  // 3. renderMany() → multiple PNG frames (native: crates/pi-natives)
  // 4. Build ImageContent array, return preserveData
  // 5. On next context rebuild, frames attached to compaction summary message
}
```

### Why Per-Provider Shapes?

| Provider | Shape | Reason |
|---|---|---|
| **Anthropic** | `11on16-bw` | Opus 4.7+ native hi-res (2576px edge, 4784 visual-token cap); tracking keeps code line numbers readable |
| **Google** | `8on22-bw` @2048 | Gemini 3.x fixed `media_resolution` budget (1120 tokens/image); 22px leading = clearer glyphs |
| **OpenAI** | `8on22-bw` | Patch billing (32px × 1.2); resolution doesn't improve chars/$, 1568px sufficient |
| **Unknown** | `8on22-bw` | Conservative default |

Shapes derived from **real benchmarks** (`research/toolbench.py`, actual search/read/find output + structured QA), not theory.

### Why It Exists

- **Fully local, zero API key, zero LLM latency** — PNG render takes tens of ms
- **Vision model reads images cheaper than LLM reads text** (some providers bill vision tokens lower)
- **Fits "offline / edge / no-network" scenarios**

**Trigger**: user prefers `snapcompact` mode, or auto-fallback when context-full fails.

---

## Strategy 3: Branch Summary — Targeted Summary on `/tree` Navigation

**File**: `packages/agent/src/compaction/branch-summarization.ts`

### Core Flow

```typescript
// branch-summarization.ts collectEntriesForBranchSummary()
export function collectEntriesForBranchSummary(
  session: ReadonlySessionManager,
  oldLeafId: string | null,
  targetId: string
): CollectEntriesResult {
  // 1. Find common ancestor (deepest node on both paths)
  // 2. Walk from oldLeaf back to common ancestor, collect all entries
  // 3. Does NOT stop at compaction boundaries — those summaries become context
}
```

```typescript
// generateBranchSummary()
export async function generateBranchSummary(
  preparation: BranchPreparation,
  options: GenerateBranchSummaryOptions
): Promise<BranchSummaryResult> {
  // Calls LLM with branchSummaryPrompt + branchSummaryPreamble
  // Returns summary + readFiles + modifiedFiles
}
```

### Why It's Needed

User switches from branch A to branch B in `/tree`. **Branch A's file reads/writes, tool calls, decision trail** — if dropped raw, switching back leaves agent amnesiac: "what did I do on branch A? which files did I touch?"

**BranchSummaryEntry** (`entries.ts`) stores:
- `summary`: LLM-generated summary
- `details.readFiles` / `details.modifiedFiles`: file op inventory
- `fromId`: starting entry of summarized span

Next time user navigates back to this leaf, summary injects into context — agent knows "oh, on this branch I edited `foo.ts`, read `bar.ts`".

### vs context-full

| | context-full | branch summary |
|---|---|---|
| **Scope** | Entire mainline history | **Single branch segment** (old leaf → common ancestor) |
| **Trigger** | Auto/manual, token-pressure driven | Interactive, on `/tree` navigation |
| **Purpose** | Compress mainline, reclaim space | **Preserve branch context**, don't lose file list |

---

## Strategy 4: Shake — Purely Mechanical Hard Cut (Emergency Hatch)

**File**: `packages/agent/src/compaction/shake.ts`

### Core Mechanism

```typescript
// shake.ts collectShakeRegions()
export function collectShakeRegions(
  entries: SessionEntry[],
  config: ShakeConfig,
  tokenizer: Tokenizer
): ShakeRegion[] {
  // 1. Protect recent protectTokens (default 16k, aggressive 4k, rescue 0)
  // 2. Scan tool-results: text > fenceMinTokens AND not in protectedTools → mark shakable
  // 3. Scan fenced code blocks / top-level XML → mark shakable
  // 4. Compute token savings; below minSavings → no-op
}
```

```typescript
// Actual shake: replace original text with placeholder
// "```rust\n...500 lines...\n```" → "[shaken: 500 lines of rust code]"
// toolResult long text → "[shaken: bash output, 12000 tokens]"
```

### Three Configs

| Config | protectTokens | minSavings | protectedTools | Purpose |
|---|---|---|---|---|
| `DEFAULT_SHAKE_CONFIG` | 16,000 | 4,000 | skill, artifact recovery | **Auto shake** (session maintenance) |
| `AGGRESSIVE_SHAKE_CONFIG` | 4,000 | 0 | skill | **Manual `/shake`** — user wants max space |
| `RESCUE_SHAKE_CONFIG` | 0 | 0 | skill + artifact recovery | **Dead-end recovery** — can drop even newest oversized result |

### Why Not Just Compaction?

- **Compaction calls LLM** — latency, cost, can fail
- **Shake is fully local, deterministic, zero-failure** — just swaps big text for short placeholders
- **Preserves non-text content** (images, structured data) — unlike compaction which might summarize away key info
- **Doesn't mutate session structure** — entries stay, parent chain intact, only content shrinks

**Triggers**:
- Auto: `SessionMaintenance` detects oversized context, compaction unsuitable/failed
- Manual: user runs `/shake` (aggressive)
- Emergency: `RESCUE` mode (agent stuck on oversized tool result)

---

## Division of Labor & Switching Logic

### SessionMaintenance Auto-Orchestration (`session-maintenance.ts`)

```typescript
// Simplified logic
async function maybeCompact(session: AgentSession): Promise<void> {
  const usage = estimateContextUsage(session);
  
  if (usage > COMPACTION_THRESHOLD) {
    // 1. Try provider-native compaction v2 first (fastest, cheapest)
    if (shouldUseCompactionV2Streaming(model)) {
      await requestCompactionV2Streaming(...);
      return;
    }
    // 2. Try OpenAI remote compaction
    if (shouldUseOpenAiRemoteCompaction(model)) {
      await requestOpenAiRemoteCompaction(...);
      return;
    }
    // 3. Fallback: context-full (standard LLM summary)
    await compactContext(session, model, apiKey);
    return;
  }
  
  // Shake: context still large but below compaction threshold, or compaction failed
  if (usage > SHAKE_THRESHOLD) {
    await shakeSession(session, DEFAULT_SHAKE_CONFIG);
  }
}
```

### Manual Commands Mapping

| Command | Strategy | Config |
|---|---|---|
| `/compact` | context-full | Standard |
| `/compact --snap` | snapcompact | Vision model |
| `/compact --v2` | compaction v2 streaming | Provider-native |
| `/shake` | shake | `AGGRESSIVE_SHAKE_CONFIG` |
| `/tree` switch | branch summary | Auto |

### Failure Mode Decision Matrix

| Failure Mode | Try First | On Failure | Last Resort |
|---|---|---|---|
| Token explosion, need semantic fidelity | context-full (v2) | snapcompact | shake (aggressive) |
| No API key / offline | snapcompact | — | shake |
| `/tree` branch switch loses context | branch summary | — | — |
| Compaction fails / too slow | shake (auto) | snapcompact | — |
| Dead-end (oversized result blocks) | shake (rescue) | — | — |

---

## Lessons Learned

1. **Compaction isn't one algorithm** — different failure modes need different tools: semantic fidelity → LLM; speed/offline → vision; branch nav → targeted summary; emergency → mechanical hard cut
2. **Provider-native compaction (v2) first** — OpenAI Codex, Anthropic native APIs cheaper tokens, faster, more reliable; omp prioritizes them, falls back to own implementation
3. **Snapcompact shapes are benchmarked, not guessed** — `11on16-bw` vs `8on22-bw` difference measured in f1 score (.806 vs .755), real money tested
4. **Branch summary solves "tree navigation amnesia"** — coding agent specific UX problem; chatbots without session trees don't need this
5. **Shake is "emergency kit", not daily bread** — auto shake conservative (protect 16k), manual aggressive, rescue drops even newest; three configs precisely map three scenarios

---

## References

- `packages/agent/src/compaction/compaction.ts` — `generateSummary`, `planSummaryWindows`, handoff document
- `packages/agent/src/compaction/compaction-v2-streaming.ts` — `requestCompactionV2Streaming`, `shouldUseCompactionV2Streaming`
- `packages/snapcompact/src/snapcompact.ts` — `compact`, `renderMany`, `SHAPE_VARIANTS`, provider-aware frame shapes
- `packages/agent/src/compaction/branch-summarization.ts` — `collectEntriesForBranchSummary`, `generateBranchSummary`
- `packages/agent/src/compaction/shake.ts` — `collectShakeRegions`, three `ShakeConfig`s, placeholder replacement
- `packages/agent/src/compaction/utils.ts` — `serializeConversationForSummary`, `extractFileOpsFromMessage`
- `packages/coding-agent/src/session/session-maintenance.ts` — auto compaction/shake orchestration
- `docs/compaction.md` — official docs overview

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 3. Previous: [append-only context](/posts/tech/2026-08-31-omp-append-only-context-en). Next: Approval three layers and fail-closed (forthcoming)*