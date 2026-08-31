---
title: "OMP session persistence, fork & tree: entry model, parent chains, /tree navigation, how navigateTree cuts leaf back to old branches"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, session, persistence, tree-navigation, fork, checkpoint, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 9
tldr: "omp stores sessions as append-only JSONL with id/parentId forming a tree; a mutable leaf pointer selects the active path. /tree uses TreeSelectorComponent for navigation; navigateTree() switches leaf with optional branch summary, handles checkpoint/rewind, supports Claude/Codex foreign session import. Fork duplicates the session file inheriting providerPromptCacheKey. Resume/switchSession uses captureState/rollback for atomic transitions. Three-layer storage (indexed/history/artifact) separates concerns."
description: "Deep dive into omp session core: SessionEntry model and parent chains forming a tree; SessionEntryIndex maintaining O(1) lookups; /tree and navigateTree leaf switching logic; branch_summary preserving branch context; checkpoint/rewind special entries; foreign session import flow; three storage abstractions (indexed/history/artifact) division of labor."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 9. Previous posts dissected the [agent loop double while](/posts/tech/2026-08-31-omp-agent-loop-double-while-en), [append-only context](/posts/tech/2026-08-31-omp-append-only-context-en), [four compaction strategies](/posts/tech/2026-08-31-omp-four-compaction-strategies-en), [approval three layers](/posts/tech/2026-08-31-omp-approval-three-layers-en), [bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval-en). This one examines **how sessions persist to disk, how they branch, how you navigate the tree, and how fork/resume work**.

---

## TL;DR

| Concept | Core Mechanism | Key Files |
|---|---|---|
| **Session Entry Model** | `type`, `id`, `parentId`, `timestamp` + payload; header is first line `type: "session"` | `session-entries.ts` |
| **Parent Chain → Tree** | Each append sets `parentId = current leafId`; new entry becomes leaf; `SessionEntryIndex` maintains `entriesById`, `children` map, `leafId` | `session-manager.ts#SessionEntryIndex` |
| **`/tree` Navigation** | `TreeSelectorComponent` renders tree; selection calls `navigateTree(targetId, { summarize, customInstructions })` | `tree-selector.ts`, `agent-session.ts#navigateTree` |
| **navigateTree Leaf Switch** | New leaf depends on selection: user message → `parentId`; ask tool result → re-answer; others → `targetId`; optional `branchWithSummary` | `agent-session.ts#navigateTree`, `session-manager.ts#branchWithSummary` |
| **Checkpoint/Rewind** | Persisted as `custom_message` (`rewind-report`, `checkpoint-active-reminder`); parsed by `checkpoint-entries.ts` | `checkpoint-entries.ts` |
| **Foreign Session Import** | `/resume @claude`, `@codex` → picker → convert JSONL → new OMP session identity | `foreign-session-import.ts`, `session-operations-export-share-fork-resume.md` |
| **Fork** | Duplicates JSONL + artifacts dir; new header `parentSession`, `providerPromptCacheKey` inherited | `session-manager.ts#fork`, `agent-session.ts#fork` |
| **Storage Three Layers** | `FileSessionStorage` (local), `IndexedSessionStorage` (local index + ordered remote publish), `MemorySessionStorage` (ephemeral/test) | `session-storage.ts`, `indexed-session-storage.ts` |

---

## Context

A coding agent runs for hours, hundreds of turns. You want to:
1. **Jump back to a decision point 20 turns ago**, try a different approach, but **keep the file ops from the current branch**
2. **Duplicate the entire session** for a colleague or a new parallel line of work, preserving prompt cache identity
3. **Import a Claude Code / Codex conversation history** and continue in omp
4. **Close the terminal and resume tomorrow** with the full session intact via `--continue`

These are all solved by **session persistence + tree navigation + fork/resume**.

omp's design core: **append-only JSONL + id/parentId tree + mutable leaf pointer**. All operations (append, branch, fork, navigate, compact, shake) ultimately operate on this data structure.

---

## Session Entry Model: `type`, `id`, `parentId`, `timestamp`

**File**: `packages/coding-agent/src/session/session-entries.ts`

Every entry shares a base:

```typescript
// session-entries.ts#SessionEntryBase
export interface SessionEntryBase {
  type: string;
  id: string;           // 8-char random id (generateId)
  parentId: string | null;  // parent node, null = root
  timestamp: string;    // ISO 8601
}
```

### Header (first line, `type: "session"`)

```typescript
// session-entries.ts#SessionHeader
export interface SessionHeader {
  type: "session";
  version: 3;                    // current version
  id: string;                    // session id (UUIDv7)
  timestamp: string;             // creation time
  cwd: string;                   // working directory
  title?: string;                // optional title
  titleSource?: "auto" | "user";
  additionalDirectories?: string[];  // multi-root workspace
  previousSessionFiles?: string[];   // move history
  providerPromptCacheKey?: string;   // fork inheritance
  parentSession?: string;            // fork lineage
}
```

### Main Entry Types (union `SessionEntry`)

| Type | Purpose | Key Fields |
|---|---|---|
| `message` | user/assistant/toolResult | `message: AgentMessage` |
| `compaction` | context compression summary | `summary`, `firstKeptEntryId`, `tokensBefore`, `preserveData` |
| `branch_summary` | Targeted summary on `/tree` branch switch | `fromId`, `summary`, `details.readFiles/modifiedFiles` |
| `reset_boundary` | `/clear` boundary marker | no payload |
| `custom` | Extension internal state (not in LLM context) | `customType`, `data` |
| `custom_message` | Extension-injected LLM context message | `customType`, `content`, `display`, `attribution` |
| `label` | `/tree` label bookmarks | `targetId`, `label` |
| `title_change` | Rename audit trail | `title`, `source`, `previousTitle` |
| `credential_pin` | OAuth account binding (prompt cache reuse) | `provider`, `hash` |
| `session_init` | Subagent launch context snapshot | `systemPrompt`, `task`, `tools`, `agent`… |
| `mode_change` | Plan mode etc. transitions | `mode`, `data` |

**Key design**: `parentId` points to **logical parent**, not file order. On append, `parentId = current leafId`, so **file order ≠ tree order**—tree must be rebuilt via `SessionEntryIndex`.

---

## How Parent Chains Form a Tree: `SessionEntryIndex`

**File**: `packages/coding-agent/src/session/session-manager.ts#SessionEntryIndex`

`SessionManager` holds a `SessionEntryIndex`; on each `insert(entry)`:

```typescript
// session-manager.ts#SessionEntryIndex.insert
insert(entry: SessionEntry): void {
  this.#entriesById.set(entry.id, entry);      // O(1) id lookup
  this.#leaf = entry.id;                        // new entry becomes leaf

  // Parent→children adjacency
  const bucket = this.#children.get(entry.parentId);
  if (bucket) bucket.push(entry);
  else this.#children.set(entry.parentId, [entry]);

  // Label resolution
  if (entry.type === "label") {
    if (entry.label) this.#labels.set(entry.targetId, entry.label);
    else this.#labels.delete(entry.targetId);
  }
  // usage stats...
}
```

### Key Query Methods

| Method | Purpose | Complexity |
|---|---|---|
| `get(id)` | Entry by id | O(1) |
| `leafId()` / `leafEntry()` | Current active leaf | O(1) |
| `childrenOf(parentId)` | Direct children | O(children) |
| `pathTo(id?)` | **Root→leaf path** (walk parentId, reverse) | O(depth) |
| `tree(entries)` | Full tree structure (for `/tree` UI) | O(n) |
| `labelFor(id)` | Resolved label | O(1) |

### `pathTo()`: Backbone of Context Rebuild

```typescript
// session-manager.ts#SessionEntryIndex.pathTo
pathTo(id: string | null | undefined = this.#leaf): SessionEntry[] {
  const branch: SessionEntry[] = [];
  const seen = new Set<string>();
  let cursor = id ? this.#entriesById.get(id) : undefined;

  while (cursor && !seen.has(cursor.id)) {
    seen.add(cursor.id);
    branch.push(cursor);
    cursor = cursor.parentId ? this.#entriesById.get(cursor.parentId) : undefined;
  }
  branch.reverse();  // root → leaf
  return branch;
}
```

`buildSessionContext()` (`session-context.ts`) runs `pathTo(leafId)` then handles compaction, reset_boundary, branch_summary, dangling tool calls, etc.

### `tree()`: Full Tree for `/tree` UI

```typescript
// session-manager.ts#SessionEntryIndex.tree
tree(entries: readonly SessionEntry[]): SessionTreeNode[] {
  const nodes = new Map<string, SessionTreeNode>();
  const roots: SessionTreeNode[] = [];

  // 1. Create nodes
  for (const entry of entries) {
    nodes.set(entry.id, { entry, children: [], label: this.#labels.get(entry.id) });
  }

  // 2. Wire parent-child
  for (const entry of entries) {
    const node = nodes.get(entry.id)!;
    const parentId = entry.parentId;
    if (parentId === null || parentId === entry.id) {
      roots.push(node);  // Multiple roots share virtual root
      continue;
    }
    const parent = nodes.get(parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);  // Missing parent → treat as root
  }

  // 3. Sort children by timestamp
  const stack = [...roots];
  while (stack.length > 0) {
    const node = stack.pop()!;
    node.children.sort(orderedByTimestamp);
    stack.push(...node.children);
  }
  return roots;
}
```

**Output**: `SessionTreeNode[]` (`entry` + `children` + `label`), rendered directly by `TreeSelectorComponent`.

---

## `/tree` Command: `TreeSelectorComponent`, `getBranch`, `navigateTree`

**Files**: `packages/coding-agent/src/modes/components/tree-selector.ts`, `packages/coding-agent/src/session/agent-session.ts#navigateTree`, `packages/coding-agent/src/session/session-manager.ts#getBranch`

### How to Open

- `/tree` slash command
- Double ESC (`doubleEscapeAction = "tree"`, default)
- `/branch` when `doubleEscapeAction = "tree"`

### Tree UI Model

- Rendered from `SessionEntryIndex.tree()` output `SessionTreeNode[]`
- **Active branch (root→leaf path) marked with `•`**, shown first
- Labels displayed as `[label]`
- Searchable (fuzzy match, AND semantics), filterable (`default`/`no-tools`/`user-only`/`labeled-only`/`all`)

### Selection Decision Tree (`navigateTree` Core Logic)

```text
selected node
   │
   ├─ current leaf (and not ask result)? ──> Close (no-op)
   │
   ├─ ask tool result? ──> Re-answer (re-open question UI), old answer kept as sibling branch
   │
   ├─ user message or ordinary custom_message? ──> leaf := parentId (or root)
   │                                                 + prefill text/images ONLY if editor empty
   │
   └─ Other (assistant, toolResult, compaction, branch_summary…)? ──> leaf := targetId
                                                                    + no prefill
```

**Code**: `packages/coding-agent/src/session/agent-session.ts#navigateTree` (~150 lines)

```typescript
// Simplified flow
async navigateTree(targetId: string, options?: { summarize?: boolean; customInstructions?: string }) {
  // 1. Flush pending bash, validate target
  // 2. Collect abandoned branch (old leaf → common ancestor)
  // 3. Emit session_before_tree (cancellable; extension may supply summary)
  // 4. If summary requested & no hook summary → call generateBranchSummary()
  // 5. Apply: branchWithSummary / branch / resetLeaf
  // 6. Rebuild model context, checkpoint/rewind/advisor/todo/provider session state
  // 7. Emit session_tree; if handlers appended entries, rebuild again
}
```

### `getBranch()`: Get Current Active Path

```typescript
// session-manager.ts#getBranch
getBranch(): SessionEntry[] {
  return this.#index.pathTo(this.#index.leafId());
}
```

This is what `buildSessionContext`, compaction, prune, shake all use as "the current conversation mainline".

---

## navigateTree: Leaf Switching, Optional Summary, Branch Summary Generation

### Switch Type Mapping

| Selection Target | New Leaf | Prefill Editor | Use Case |
|---|---|---|---|
| **User message** | `parentId` (root → `null`) | ✅ Text + images | Restart from a prompt, edit & resend |
| **Custom_message (non skill-prompt)** | `parentId` | ✅ Same | Same idea |
| **Skill-prompt custom_message** | `targetId` | ❌ | Like ordinary node |
| **Ask tool result** | Re-open question UI | ❌ | Re-answer; old answer becomes sibling |
| **Other** | `targetId` | ❌ | Pure navigation, inspect context |

### Summary-on-Switch Flow

Controlled by `branchSummary.enabled` (default `false`):

1. Plain `Enter` → three-way: `No summary` / `Summarize` / `Summarize with custom prompt`
2. `Shift+Enter` → direct `Summarize` (skip prompt)
3. Escape → back to tree selector
4. Custom prompt cancel → back to summary choice
5. During summarization, `Esc` aborts → tree selector reopens, **leaf NOT moved**

**Summary Generation** (`agent-session.ts#navigateTree` → `session-manager.ts#branchWithSummary`):

```typescript
// session-manager.ts#branchWithSummary
async branchWithSummary(targetId: string, summary: string, details?: BranchSummaryDetails) {
  // 1. Move leaf to targetId
  this.#setLeaf(targetId);
  // 2. Append branch_summary entry (parentId = targetId)
  const entry: BranchSummaryEntry = {
    type: "branch_summary",
    id: generateId(this.#index),
    parentId: targetId,
    timestamp: nowIso(),
    fromId: this.#index.leafId() === targetId ? "root" : this.#index.leafId()!,  // actually old leaf
    summary,
    details,
    fromExtension: false,
  };
  this.#recordEntry(entry);  // Persist, update index
}
```

**BranchSummaryEntry** on disk; next time you navigate back to this leaf, `buildSessionContext` converts it to `BranchSummaryMessage` injected into context—agent knows "oh, on this branch I edited `foo.ts`, read `bar.ts`".

---

## Checkpoint / Rewind Entries: Special Roles

**File**: `packages/coding-agent/src/session/checkpoint-entries.ts`

Checkpoint/rewind are **tool execution results**, but for session rebuild to restore state, they persist as special `custom_message`:

| Operation | Persisted Entry Type | Key Fields |
|---|---|---|
| `checkpoint` success | `message` (toolResult) | Detected via `semanticToolResult()` |
| `rewind` complete | `custom_message` (`rewind-report`) | `details: { startedAt, rewoundAt, report }` |
| Checkpoint active reminder | `custom_message` (`checkpoint-active-reminder`) | Transient, not in LLM context |

### Parsing Utilities

```typescript
// checkpoint-entries.ts
export function isSuccessfulCheckpointEntry(entry: SessionEntry): boolean
export function checkpointStartedAtFromEntry(entry: SessionEntry): string | undefined
export function completedRewindFromEntry(entry: SessionEntry): CompletedRewindState | undefined
```

`AgentSession` on load scans these to rebuild `#checkpointState`, `#lastCompletedRewind`, so `/rewind`, `/checkpoint` commands work after resume.

---

## Foreign Session Import: Claude / Codex Sessions

**Files**: `packages/coding-agent/src/session/foreign-session-import.ts`, `docs/session-operations-export-share-fork-resume.md#interactive-resume-value`

### Flow

1. `/resume @claude` or `/resume @codex` → opens foreign session picker
2. User picks a `.jsonl` / directory
3. `ForeignSessionImporter` parses foreign format → converts to OMP `SessionEntry[]`
4. **Creates NEW OMP session identity** (new id, new timestamp, new file)
5. Writes converted entries, switches to new session

### Key Conversion Points

- **Claude Code**: `~/.claude/projects/**/*.jsonl`, different format (no parentId tree), linearized rebuild
- **Codex**: `~/.codex/sessions/**/*.jsonl`, similar handling
- **Original session id NOT preserved**—avoids prompt cache key collision; `parentSession` records provenance
- **Provider prompt cache key NOT inherited** (unless exact same route), avoids pollution

---

## Fork: Duplicate Entire Session, Inherit Prompt Cache Key

**Files**: `packages/coding-agent/src/session/session-manager.ts#fork`, `packages/coding-agent/src/session/agent-session.ts#fork`

### Interactive `/fork`

```typescript
// session-manager.ts#fork
fork(): SessionManager | undefined {
  if (!this.#persist || !this.#sessionFile) return undefined;

  const newSessionId = mintSessionId();
  const newTimestamp = nowIso();
  const newFile = path.join(this.#sessionDir, `${fileSafeTimestamp(newTimestamp)}_${newSessionId}.jsonl`);

  // New header: new id, new timestamp, same cwd, parentSession = old id
  const newHeader: SessionHeader = {
    ...this.#header,
    id: newSessionId,
    timestamp: newTimestamp,
    parentSession: this.#sessionId,
    providerPromptCacheKey: this.#header.providerPromptCacheKey ?? this.#sessionId,
  };

  // Copy all non-header entries (append-only so direct copy)
  // Write new file, create new SessionManager
  // Copy artifacts dir (best-effort)
}
```

### CLI `--fork <id|path>`

Resolved at startup, `SessionManager.forkFrom(path, cwd, sessionDir)`, same behavior.

### Key Properties

| Property | Description |
|---|---|
| **New session file** | Full entry copy, new header |
| **`parentSession`** | Records source session id (lineage) |
| **`providerPromptCacheKey`** | Inherits old header's key, or falls back to old session id; `--prompt-cache-key` can manually pin |
| **Artifacts** | Entire directory copied (`copySessionArtifacts`) |
| **Non-persistent** | `fork()` returns `undefined`, UI shows failure |

---

## Session Storage Three Layers: Indexed / History / Artifact

**Files**: `packages/coding-agent/src/session/session-storage.ts`, `packages/coding-agent/src/session/indexed-session-storage.ts`, `packages/coding-agent/src/session/history-storage.ts`, `packages/coding-agent/src/session/artifacts.ts`

### 1. `SessionStorage` Abstract Interface

```typescript
// session-storage.ts#SessionStorage
interface SessionStorage {
  // Sync: dir/exists/write/stat/list
  ensureDirSync(dir: string): void;
  existsSync(path: string): boolean;
  writeTextSync(path: string, content: string): void;
  readTextSync(path: string): string;
  statSync(path: string): Stats;
  listSync(dir: string): string[];
  // Async: read, sliced read, write, atomic write, rename, unlink
  // artifact-aware deletion, title update, writer create, backend drain
}
```

### 2. Three Implementations

| Implementation | Purpose | Persistent |
|---|---|---|
| `FileSessionStorage` | Real local files | ✅ |
| `MemorySessionStorage` | In-memory map/chunk, **ephemeral sessions**, **tests** | ❌ |
| `IndexedSessionStorage` | **Shared local index + ordered remote publish** (Redis/SQL-backed) | ✅ (dual-write) |

### 3. `IndexedSessionStorage`: Local Index + Ordered Remote Publish

```typescript
// indexed-session-storage.ts
// - Local SQLite index: session_id, cwd, mtime, leafId, entry count...
// - Remote: Redis/S3 etc., totally ordered by timestamp
// - Reads: prefer local index, fallback to remote backfill
// - Writes: local sync write + async push to remote
```

### 4. `HistoryStorage`: Prompt History (Separate Subsystem)

```typescript
// history-storage.ts
// DB: ~/.omp/agent/history.db
// Table: history(id, prompt, created_at, cwd, session_id)
// FTS5: history_fts (trigger sync)
// Batched writes (~100ms delay), consecutive duplicate prompt dedup
// **Purpose**: Prompt recall/search UI, **NOT** session replay
```

### 5. Artifacts: Session-Scoped File Space

```typescript
// artifacts.ts
// Each session owns <session-file>.jsonl same-name dir (minus .jsonl)
// AgentSession.allocateArtifactPath() / saveArtifact() / getArtifactPath()
// Fork copies entire dir (copySessionArtifacts)
// Subagent sessions write under parent artifacts: <parent>/<agentId>.jsonl
```

---

## Session Switch / Resume: Capture State + Atomic Transition

**Files**: `packages/coding-agent/src/session/agent-session.ts#switchSession`, `packages/coding-agent/src/session/session-manager.ts#setSessionFile`

### `switchSession` Core Flow (Simplified)

```typescript
// agent-session.ts#switchSession
async switchSession(sessionPath: string): Promise<boolean> {
  // 1. Emit session_before_switch (cancellable)
  // 2. Disconnect agent subscription, abort in-flight, capture rollback state:
  //    - sessionManager state
  //    - agent messages + queues
  //    - model/thinking/service tier
  //    - tools/prompts
  //    - provider/cache ids
  //    - memory promotion
  //    - checkpoint/rewind state
  // 3. Clear queues, drain advisor recorders
  // 4. sessionManager.setSessionFile(sessionPath)
  //    - Load new file, migrate, resolve blob refs, rebuild index
  //    - Update provider cache/session ids, memory keys, rehydrate checkpoint
  // 5. Emit session_switch
  // 6. Replace agent messages, reset advisor, sync todos
  // 7. Close old provider sessions (different file) or replay changed messages (same file)
  // 8. Restore model, thinking, service tier
  // 9. Different transcript → reset memory; conversation rewrite → clear tool state
  // 10. Reconnect agent events, run reconciler (plan mode etc.), refresh workspace prompt
  // 11. Return true/false (false = hook cancel or cwd policy reject)
}
```

### Key Guarantees

- **Atomic**: Any step fails → full rollback to captured state
- **Cross-project**: Recorded cwd missing → prompt re-root (`moveTo`); exists → direct open, later switch process cwd
- **Terminal breadcrumb**: `~/.omp/agent/terminal-sessions/<terminal-id>` stores cwd + session file + `fresh` flag, used by `--continue`

---

## Lessons Learned

1. **Append-only JSONL + id/parentId tree is the minimal complete session model**—all complex ops (branch, fork, navigate, compact, shake, rewind) layer semantics on this structure, no extra migration schema needed
2. **Leaf pointer is the ONLY mutable state**—tree itself immutable; branching just moves a pointer. This makes `/tree` nav, `/fork` copy, resume rebuild trivially simple and reliable
3. **`SessionEntryIndex` is the performance keystone**—O(1) id lookup, O(children) children, O(depth) pathTo, powering real-time tree UI and context rebuild
4. **Branch summary solves "tree navigation amnesia"**—coding agent specific: switching branches isn't just swapping context, must preserve "what files did I touch on the other branch, what tools ran"
5. **Foreign session import discards original id**—avoids prompt cache pollution; uses `parentSession` for lineage. Pragmatic "compatible but not confused" trade-off
6. **Fork inherits `providerPromptCacheKey`**—OpenAI Responses / Anthropic prompt cache is session-scoped; fork must inherit to save money. But startup auto-drops if `--model` etc. change route
7. **Storage layers separate concerns**—File (local), Indexed (distributed index + remote), Memory (test/ephemeral), HistoryStorage independent for prompt search, Artifacts independent for file space
8. **Switch/Resume uses capture+rollback for atomicity**—Dozen lines capture, dozen lines restore, any mid-flight failure fully recovers. That's production-grade session switching

---

## References

- `packages/coding-agent/src/session/session-entries.ts` — `SessionEntryBase`, `SessionHeader`, all entry types, `SessionTreeNode`
- `packages/coding-agent/src/session/session-manager.ts` — `SessionEntryIndex` (insert/pathTo/tree/leafId/getBranch), `fork`, `setSessionFile`, `captureState`/`restoreState`, `switchSession` coordination
- `packages/coding-agent/src/session/agent-session.ts` — `navigateTree`, `fork`, `switchSession`, `freshSession`, `resetSessionContext`
- `packages/coding-agent/src/session/session-context.ts` — `buildSessionContext` (pathTo + compaction/reset/branch summary handling)
- `packages/coding-agent/src/session/checkpoint-entries.ts` — `isSuccessfulCheckpointEntry`, `completedRewindFromEntry`, `checkpointStartedAtFromEntry`
- `packages/coding-agent/src/session/foreign-session-import.ts` — `ForeignSessionImporter`, Claude/Codex format conversion
- `packages/coding-agent/src/session/session-storage.ts` — `SessionStorage` interface, `FileSessionStorage`, `MemorySessionStorage`
- `packages/coding-agent/src/session/indexed-session-storage.ts` — `IndexedSessionStorage` (local index + ordered remote publish)
- `packages/coding-agent/src/session/history-storage.ts` — `HistoryStorage` (SQLite + FTS5 prompt history)
- `packages/coding-agent/src/session/artifacts.ts` — `ArtifactManager`, `allocateArtifactPath`, `copySessionArtifacts`
- `packages/coding-agent/src/modes/components/tree-selector.ts` — `TreeSelectorComponent` (render, search, filter, keyboard nav)
- `docs/session.md` — Official session docs (format, versioning, tree semantics, load behavior, persistence guarantees)
- `docs/tree.md` — `/tree` command full reference (UI, keys, filters, selection decision tree, labels, workflows)
- `docs/session-operations-export-share-fork-resume.md` — Export/share/fresh/clear/fork/resume/continue operation matrix and flows

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 9. Previous: [bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval-en). Next: TBD*