---
title: "pi-mono Deep Dive 5: Session Tree — Append-only JSONL, Branching Without History Mutation, Compaction Logic Full Analysis"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, session-management, append-only, branching, compaction]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 5
tldr: "SessionManager core: JSONL append-only storage, id/parentId tree formation, branch() moves leaf pointer without mutating history, buildSessionContext() handles compaction entries, createBranchedSession() forks to new file. Complete Entry types: message, thinking_level_change, model_change, compaction, branch_summary, custom, custom_message, label, session_info. Migration v1→v2→v3 details."
description: "Deep dive into pi-coding-agent SessionManager: tree-structured session persistence and in-memory operations. Covers JSONL format, complete Entry type definitions, tree traversal algorithms, Branch/Reset/Fork operations, Compaction-aware context building, Label bookmark system, Session Info and Custom Entries, file I/O optimizations (Header Scan Limit, Streaming Parse), multi-session discovery and listing. For engineers researching Agent session management and append-only data structures."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-session-tree)

## TL;DR

- **Storage Format**: JSONL (one Entry per line), `~/.pi/agent/sessions/--cwd--/`, filename `ISO8601_sessionId.jsonl`
- **Tree Structure**: Each Entry has `id`, `parentId`; append creates child of current leaf
- **Branch**: `branch(id)` only moves `leafId` pointer, history completely unchanged
- **Compaction**: `compaction` entry with `firstKeptEntryId`, `tokensBefore`; `buildContextEntries()` skips summarized segment
- **Fork**: `createBranchedSession(leafId)` copies root→leaf path to new file, cross-project capable
- **Migration**: v1 (no id) → v2 (add id/parentId) → v3 (hookMessage→custom)

---

## Why Append-only Tree?

| Need | Traditional Linear History | Append-only Tree |
|---|---|---|
| Replay & Edit | ❌ Only truncate tail | ✅ Jump to any node, continue |
| Experimental Attempts | ❌ Pollutes mainline | ✅ `/branch` creates parallel timeline |
| Compaction | ❌ Loses detail | ✅ Keeps summary + key segments |
| Fork to New Project | ❌ Copy entire file | ✅ Copy only needed path |
| Bookmarks/Labels | ❌ External | ✅ `label` entry built-in |

---

## JSONL File Format

### Directory Structure

```
~/.pi/agent/sessions/
└── --Users-xiaoxu-Projects-myproject--/
    ├── 2026-08-31T10-30-00_a1b2c3d4.jsonl
    └── 2026-08-30T14-22-11_e5f6g7h8.jsonl
```

- Dir name: `--` + `cwd` with separators→`-` + `--`
- Filename: `timestamp_sessionId.jsonl` (timestamp `:` → `-`)

### Entry Common Fields

```typescript
// packages/coding-agent/src/core/session-manager.ts
export interface SessionEntryBase {
  type: string;
  id: string;           // 8-char hex (UUID first 8, retry on collision)
  parentId: string | null;  // Parent node id, root = null
  timestamp: string;    // ISO8601
}
```

### All Entry Types

```typescript
// 1. Session Header (first line of file)
export interface SessionHeader {
  type: "session";
  version?: number;     // v1 lacks this
  id: string;           // session id
  timestamp: string;
  cwd: string;
  parentSession?: string;  // fork source
}

// 2. Regular Message
export interface SessionMessageEntry extends SessionEntryBase {
  type: "message";
  message: AgentMessage;  // user/assistant/toolResult
}

// 3. Thinking Level Change
export interface ThinkingLevelChangeEntry extends SessionEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;  // "off" | "low" | "medium" | "high"
}

// 4. Model Switch Record
export interface ModelChangeEntry extends SessionEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}

// 5. Compaction Summary Point
export interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;              // Summary text
  firstKeptEntryId: string;     // Kept segment start entry id
  tokensBefore: number;         // Tokens before compression
  details?: T;                  // Extension-specific data
  usage?: Usage;                // LLM usage for summary generation
  fromHook?: boolean;           // Extension-generated vs built-in
}

// 6. Branch Summary (abandoned path summary on branch)
export interface BranchSummaryEntry<T = unknown> extends SessionEntryBase {
  type: "branch_summary";
  fromId: string;               // Discarded path leaf id
  summary: string;
  details?: T;
  usage?: Usage;
  fromHook?: boolean;
}

// 7. Extension Internal State (NOT in LLM Context)
export interface CustomEntry<T = unknown> extends SessionEntryBase {
  type: "custom";
  customType: string;           // Extension identifier
  data?: T;
}

// 8. Extension Injected Message (IN LLM Context)
export interface CustomMessageEntry<T = unknown> extends SessionEntryBase {
  type: "custom_message";
  customType: string;
  content: string | ContentBlock[];
  details?: T;
  display: boolean;             // Whether TUI shows it
}

// 9. Label Bookmark
export interface LabelEntry extends SessionEntryBase {
  type: "label";
  targetId: string;             // Marked entry id
  label: string | undefined;    // undefined = remove label
}

// 10. Session Info (Display Name)
export interface SessionInfoEntry extends SessionEntryBase {
  type: "session_info";
  name?: string;                // Empty string = clear name
}
```

---

## Core Tree Traversal Algorithms

### 1. Build Index

```typescript
function buildEntryIndex(entries: SessionEntry[], byId?: Map<string, SessionEntry>): Map<string, SessionEntry> {
  if (byId) return byId;
  const index = new Map<string, SessionEntry>();
  for (const entry of entries) {
    index.set(entry.id, entry);
  }
  return index;
}
```

### 2. Leaf to Root Path (`buildSessionPath`)

```typescript
function buildSessionPath(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>,
): SessionEntry[] {
  const index = buildEntryIndex(entries, byId);
  let leaf: SessionEntry | undefined;
  if (leafId === null) return [];
  if (leafId) leaf = index.get(leafId);
  leaf ??= entries[entries.length - 1];  // Default latest entry
  if (!leaf) return [];

  const path: SessionEntry[] = [];
  let current: SessionEntry | undefined = leaf;
  while (current) {
    path.push(current);
    current = current.parentId ? index.get(current.parentId) : undefined;
  }
  path.reverse();  // Root → Leaf order
  return path;
}
```

### 3. Get Session Context Settings (Thinking Level, Model)

```typescript
function getSessionContextSettings(path: SessionEntry[]): Pick<SessionContext, "thinkingLevel" | "model"> {
  let thinkingLevel = "off";
  let model: { provider: string; modelId: string } | null = null;

  for (const entry of path) {
    if (entry.type === "thinking_level_change") {
      thinkingLevel = entry.thinkingLevel;
    } else if (entry.type === "model_change") {
      model = { provider: entry.provider, modelId: entry.modelId };
    } else if (entry.type === "message" && entry.message.role === "assistant") {
      model = { provider: entry.message.provider, modelId: entry.message.model };
    }
  }
  return { thinkingLevel, model };
}
```

### 4. Entry → Context Messages (`sessionEntryToContextMessages`)

```typescript
export function sessionEntryToContextMessages(entry: SessionEntry): AgentMessage[] {
  if (entry.type === "message") {
    const message = entry.message;
    // Defensive: old versions may have null content
    if ((message.role === "user" || message.role === "assistant" || message.role === "toolResult") && message.content == null) {
      return [{ ...message, content: [] }];
    }
    return [message];
  }
  if (entry.type === "custom_message") {
    return [createCustomMessage(entry.customType, entry.content ?? [], entry.display, entry.details, entry.timestamp)];
  }
  if (entry.type === "branch_summary" && entry.summary) {
    return [createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp)];
  }
  if (entry.type === "compaction") {
    return [createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp)];
  }
  // custom, label, session_info, thinking_level_change, model_change → no context
  return [];
}
```

### 5. Compaction-Aware Context Entries (Core Logic)

```typescript
export function buildContextEntries(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>,
): SessionEntry[] {
  const path = buildSessionPath(entries, leafId, byId);
  let compaction: CompactionEntry | null = null;

  // Find latest compaction entry
  for (const entry of path) {
    if (entry.type === "compaction") {
      compaction = entry;
    }
  }

  if (!compaction) return path;  // No compaction, return full path

  const compactionIdx = path.findIndex((entry) => entry.id === compaction.id);
  if (compactionIdx < 0) return path;

  // Build: [compaction] + [entries after firstKeptEntryId] + [entries after compaction]
  const contextEntries: SessionEntry[] = [compaction];
  let foundFirstKept = false;
  for (let i = 0; i < compactionIdx; i++) {
    const entry = path[i];
    if (entry.id === compaction.firstKeptEntryId) {
      foundFirstKept = true;
    }
    if (foundFirstKept) {
      contextEntries.push(entry);
    }
  }
  contextEntries.push(...path.slice(compactionIdx + 1));
  return contextEntries;
}
```

**Illustration**:
```
Path: [msg1] → [msg2] → [msg3] → [compaction: firstKept=msg3] → [msg4] → [msg5] → [msg6]
                                    ↑
Context: [compaction] → [msg3] → [msg4] → [msg5] → [msg6]
         (msg1, msg2 summarized, no longer in LLM)
```

### 6. Complete Session Context

```typescript
export function buildSessionContext(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>,
): SessionContext {
  const path = buildSessionPath(entries, leafId, byId);
  const { thinkingLevel, model } = getSessionContextSettings(path);
  const messages = buildContextEntries(entries, leafId, byId).flatMap(sessionEntryToContextMessages);
  return { messages, thinkingLevel, model };
}
```

---

## SessionManager Class Core Operations

### Initialization & Persistence

```typescript
export class SessionManager {
  private sessionId: string = "";
  private sessionFile: string | undefined;
  private sessionDir: string;
  private cwd: string;
  private persist: boolean;
  private flushed: boolean = false;  // Whether written to file
  private fileEntries: FileEntry[] = [];
  private byId: Map<string, SessionEntry> = new Map();
  private labelsById: Map<string, string> = new Map();
  private labelTimestampsById: Map<string, string> = new Map();
  private leafId: string | null = null;

  // Create new Session
  newSession(options?: NewSessionOptions): string | undefined {
    this.sessionId = options?.id ?? createSessionId();
    const timestamp = new Date().toISOString();
    const header: SessionHeader = {
      type: "session",
      version: CURRENT_SESSION_VERSION,  // 3
      id: this.sessionId,
      timestamp,
      cwd: this.cwd,
      parentSession: options?.parentSession,
    };
    this.fileEntries = [header];
    this.byId.clear();
    this.labelsById.clear();
    this.labelTimestampsById.clear();
    this.leafId = null;
    this.flushed = false;

    if (this.persist) {
      const fileTimestamp = timestamp.replace(/[:.]/g, "-");
      this.sessionFile = join(this.getSessionDir(), `${fileTimestamp}_${this.sessionId}.jsonl`);
    }
    return this.sessionFile;
  }

  // Open existing Session file
  static open(path: string, sessionDir?: string, cwdOverride?: string): SessionManager {
    // Read header, load entries, Migration, build index
  }
}
```

### Append Operations (All Create Child of Current Leaf)

```typescript
// Generic append
private _appendEntry(entry: SessionEntry): void {
  this.fileEntries.push(entry);
  this.byId.set(entry.id, entry);
  this.leafId = entry.id;
  this._persist(entry);
}

// Concrete methods
appendMessage(message: Message | CustomMessage | BashExecutionMessage): string {
  const entry: SessionMessageEntry = {
    type: "message",
    id: generateId(this.byId),
    parentId: this.leafId,
    timestamp: new Date().toISOString(),
    message,
  };
  this._appendEntry(entry);
  return entry.id;
}

appendThinkingLevelChange(thinkingLevel: string): string { ... }
appendModelChange(provider: string, modelId: string): string { ... }

appendCompaction<T>(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: T, fromHook?: boolean, usage?: Usage): string {
  const entry: CompactionEntry<T> = {
    type: "compaction",
    id: generateId(this.byId),
    parentId: this.leafId,
    timestamp: new Date().toISOString(),
    summary,
    firstKeptEntryId,
    tokensBefore,
    details,
    usage,
    fromHook,
  };
  this._appendEntry(entry);
  return entry.id;
}

appendCustomEntry(customType: string, data?: unknown): string { ... }
appendSessionInfo(name: string): string { ... }
appendCustomMessageEntry(customType: string, content: string | ContentBlock[], display: boolean, details?: unknown): string { ... }
```

### Persist Strategy: No File Until First Assistant Response

```typescript
private _persist(entry: SessionEntry): void {
  if (!this.persist || !this.sessionFile) return;

  const hasAssistant = this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant");
  if (!hasAssistant) {
    if (this.flushed) {
      appendFileSync(this.sessionFile, `${JSON.stringify(entry)}\n`);
    } else {
      this.flushed = false;  // Wait for Assistant, then write all accumulated entries at once
    }
    return;
  }

  if (!this.flushed) {
    // First Assistant: create file, write all accumulated entries
    const fd = openSync(this.sessionFile, "wx");
    try {
      for (const e of this.fileEntries) writeFileSync(fd, `${JSON.stringify(e)}\n`);
    } finally { closeSync(fd); }
    this.flushed = true;
  } else {
    appendFileSync(this.sessionFile, `${JSON.stringify(entry)}\n`);
  }
}
```

---

## Branch / Reset / Fork Core Operations

### Branch: Move Leaf Pointer

```typescript
// Start new branch from specified entry
branch(branchFromId: string): void {
  if (!this.byId.has(branchFromId)) throw new Error(`Entry ${branchFromId} not found`);
  this.leafId = branchFromId;  // Only move pointer, no entry modified
}

// Branch with Summary (record abandoned path)
branchWithSummary(
  branchFromId: string | null,
  summary: string,
  details?: unknown,
  fromHook?: boolean,
  usage?: Usage,
): string {
  if (branchFromId !== null && !this.byId.has(branchFromId)) throw new Error(`Entry ${branchFromId} not found`);
  const fromId = this.leafId ?? "root";
  this.leafId = branchFromId;
  const entry: BranchSummaryEntry = {
    type: "branch_summary",
    id: generateId(this.byId),
    parentId: branchFromId,
    timestamp: new Date().toISOString(),
    fromId,
    summary,
    details,
    usage,
    fromHook,
  };
  this._appendEntry(entry);
  return entry.id;
}

// Reset to Root (parentId = null)
resetLeaf(): void {
  this.leafId = null;
}
```

### Fork: Copy Path to New File

```typescript
createBranchedSession(leafId: string): string | undefined {
  const path = this.getBranch(leafId);  // Root → Leaf path
  if (path.length === 0) throw new Error(`Entry ${leafId} not found`);

  // Filter LabelEntry, relink parentId
  const pathWithoutLabels: SessionEntry[] = [];
  let pathParentId: string | null = null;
  for (const entry of path) {
    if (entry.type === "label") continue;
    pathWithoutLabels.push({ ...entry, parentId: pathParentId });
    pathParentId = entry.id;
  }

  // New Session Header
  const newSessionId = createSessionId();
  const timestamp = new Date().toISOString();
  const header: SessionHeader = {
    type: "session",
    version: CURRENT_SESSION_VERSION,
    id: newSessionId,
    timestamp,
    cwd: this.cwd,
    parentSession: this.persist ? this.sessionFile : undefined,  // Record source
  };

  // Collect Labels on path
  const pathEntryIds = new Set(pathWithoutLabels.map((e) => e.id));
  const labelsToWrite: Array<{ targetId: string; label: string; timestamp: string }> = [];
  for (const [targetId, label] of this.labelsById) {
    if (pathEntryIds.has(targetId)) {
      labelsToWrite.push({ targetId, label, timestamp: this.labelTimestampsById.get(targetId)! });
    }
  }

  if (this.persist) {
    // Build Label Entries (append at path end)
    const lastEntryId = pathWithoutLabels[pathWithoutLabels.length - 1]?.id || null;
    let parentId = lastEntryId;
    const labelEntries: LabelEntry[] = [];
    for (const { targetId, label, timestamp: labelTimestamp } of labelsToWrite) {
      const labelEntry: LabelEntry = {
        type: "label",
        id: generateId(new Set(pathEntryIds)),
        parentId,
        timestamp: labelTimestamp,
        targetId,
        label,
      };
      pathEntryIds.add(labelEntry.id);
      labelEntries.push(labelEntry);
      parentId = labelEntry.id;
    }

    this.fileEntries = [header, ...pathWithoutLabels, ...labelEntries];
    this.sessionId = newSessionId;
    this.sessionFile = newSessionFile;
    this._buildIndex();

    // Write immediately only if has Assistant
    const hasAssistant = this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant");
    if (hasAssistant) { this._rewriteFile(); this.flushed = true; }
    else { this.flushed = false; }

    return newSessionFile;
  }
  // In-memory mode...
}
```

---

## Read Optimizations: Header Scan Limit & Streaming Parse

### Header Bounded Scan (Avoid Reading Large Files)

```typescript
const MAX_SESSION_HEADER_SCAN_BYTES = 1024 * 1024;  // 1MB

function readSessionHeader(filePath: string): SessionHeader | null {
  const fd = openSync(filePath, "r");
  try {
    const decoder = new StringDecoder("utf8");
    const buffer = Buffer.allocUnsafe(4096);
    const lineChunks: string[] = [];
    let scannedBytes = 0;

    while (scannedBytes < MAX_SESSION_HEADER_SCAN_BYTES) {
      const readLength = Math.min(buffer.length, MAX_SESSION_HEADER_SCAN_BYTES - scannedBytes);
      const bytesRead = readSync(fd, buffer, 0, readLength, null);
      if (bytesRead === 0) {
        lineChunks.push(decoder.end());
        return parseSessionHeaderCandidate(lineChunks.join("")) ?? null;
      }
      scannedBytes += bytesRead;
      // ... Parse line by line, return on first valid session header
    }
    throw new SessionHeaderScanLimitError(filePath);
  } finally { closeSync(fd); }
}
```

### Streaming Parse Large Files (`loadEntriesFromFile`)

```typescript
export function loadEntriesFromFile(filePath: string): FileEntry[] {
  const fd = openSync(filePath, "r");
  try {
    const decoder = new StringDecoder("utf8");
    const buffer = Buffer.allocUnsafe(1024 * 1024);  // 1MB buffer
    const entries: FileEntry[] = [];
    let pending = "";

    while (true) {
      const bytesRead = readSync(fd, buffer, 0, buffer.length, null);
      if (bytesRead === 0) break;
      pending += decoder.write(buffer.subarray(0, bytesRead));

      let lineStart = 0;
      let newlineIndex = pending.indexOf("\n", lineStart);
      while (newlineIndex !== -1) {
        const entry = parseSessionEntryLine(pending.slice(lineStart, newlineIndex));
        if (entry) entries.push(entry);
        lineStart = newlineIndex + 1;
        newlineIndex = pending.indexOf("\n", lineStart);
      }
      pending = pending.slice(lineStart);
    }
    pending += decoder.end();
    const finalEntry = parseSessionEntryLine(pending);
    if (finalEntry) entries.push(finalEntry);

    // Validate Header
    if (entries.length === 0) return entries;
    const header = entries[0];
    if (header.type !== "session" || typeof header.id !== "string") return [];

    return entries;
  } finally { closeSync(fd); }
}
```

---

## Migration: v1 → v2 → v3

### v1 → v2: Add id/parentId Tree Structure

```typescript
function migrateV1ToV2(entries: FileEntry[]): void {
  const ids = new Set<string>();
  let prevId: string | null = null;

  for (const entry of entries) {
    if (entry.type === "session") { entry.version = 2; continue; }

    entry.id = generateId(ids);
    entry.parentId = prevId;
    prevId = entry.id;

    // Compaction: firstKeptEntryIndex → firstKeptEntryId
    if (entry.type === "compaction") {
      const comp = entry as CompactionEntry & { firstKeptEntryIndex?: number };
      if (typeof comp.firstKeptEntryIndex === "number") {
        const targetEntry = entries[comp.firstKeptEntryIndex];
        if (targetEntry && targetEntry.type !== "session") {
          comp.firstKeptEntryId = targetEntry.id;
        }
        delete comp.firstKeptEntryIndex;
      }
    }
  }
}
```

### v2 → v3: `hookMessage` role → `custom`

```typescript
function migrateV2ToV3(entries: FileEntry[]): void {
  for (const entry of entries) {
    if (entry.type === "session") { entry.version = 3; continue; }
    if (entry.type === "message") {
      const msgEntry = entry as SessionMessageEntry;
      if (msgEntry.message && (msgEntry.message as { role: string }).role === "hookMessage") {
        (msgEntry.message as { role: string }).role = "custom";
      }
    }
  }
}
```

---

## Session Discovery & Listing

### Find Most Recent Session

```typescript
export function findMostRecentSession(sessionDir: string, cwd?: string): string | null {
  const files = readdirSync(sessionDir)
    .filter((f) => f.endsWith(".jsonl"))
    .map((f) => join(sessionDir, f))
    .map((path) => ({ path, header: readSessionHeaderForDiscovery(path) }))
    .filter((file): file is { path: string; header: SessionHeader } =>
      file.header !== null &&
      (!cwd || sessionCwdMatches(getSessionHeaderCwd(file.header), cwd))
    )
    .map(({ path }) => ({ path, mtime: statSync(path).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return files[0]?.path || null;
}
```

### Concurrent Session Info Loading (for Listing)

```typescript
const MAX_CONCURRENT_SESSION_INFO_LOADS = 10;

async function buildSessionInfosWithConcurrency(
  files: string[],
  onLoaded: () => void,
): Promise<(SessionInfo | null)[]> {
  const results: (SessionInfo | null)[] = new Array(files.length).fill(null);
  const inFlight = new Set<Promise<void>>();
  let nextIndex = 0;

  const startNext = () => {
    const index = nextIndex++;
    const file = files[index];
    if (!file) return;
    let task = buildSessionInfo(file)
      .then((info) => { results[index] = info; })
      .catch(() => { results[index] = null; })
      .finally(() => { inFlight.delete(task); onLoaded(); });
    inFlight.add(task);
  };

  while (nextIndex < files.length || inFlight.size > 0) {
    while (nextIndex < files.length && inFlight.size < MAX_CONCURRENT_SESSION_INFO_LOADS) {
      startNext();
    }
    if (inFlight.size > 0) await Promise.race(inFlight);
  }
  return results;
}
```

---

## References

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/session-manager.ts](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/session-manager.ts)
- [Pi Official Docs: Session Management](https://pi.dev/docs/latest/sessions)
- [JSON Lines Format Specification](https://jsonlines.org/)
- [Append-only Data Structure Design Patterns](https://martinfowler.com/bliki/AppendOnly.html)
- [UUID v7 Time-ordered Properties](https://github.com/uuid/uuidv7)

---

## Next Up

> **Part 6: Tool System — Definition, Execution, Parallel/Sequential, Before/After Hooks**
>
> How are 8 core tools defined? `ToolDefinition` vs `AgentTool` difference? `createToolDefinition`/`createTool` Factory pattern? How does `executionMode: "parallel" | "sequential"` decide? How do `beforeToolCall`/`afterToolCall` intercept and modify? How does `withFileMutationQueue` serialize file writes? `truncateHead/Line/Tail` output truncation strategies?