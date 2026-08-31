---
title: "pi-mono 深度導讀 5：Session Tree——Append-only JSONL、Branching 不改歷史、Compaction 邏輯完整解析"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, session-management, append-only, branching, compaction]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 5
tldr: "SessionManager 核心：JSONL append-only 儲存、id/parentId 形成樹、branch() 移動 leaf pointer 不改歷史、buildSessionContext() 處理 compaction entry、createBranchedSession() fork 新檔案。完整 Entry 類型：message、thinking_level_change、model_change、compaction、branch_summary、custom、custom_message、label、session_info。Migration v1→v2→v3 細節。"
description: "深入 pi-coding-agent SessionManager：樹狀會話結構的持久化與記憶體操作。涵蓋 JSONL 格式、Entry 類型完整定義、樹遍歷算法、Branch/Reset/Fork 操作、Compaction 感知的上下文構建、Label 書籤系統、Session 資訊與自定義 Entry、檔案讀寫優化（Header Scan Limit、Streaming Parse）、多 Session 發現與列表。適合研究 Agent 會話管理、Append-only 資料結構的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-session-tree-en)

## TL;DR

- **儲存格式**：JSONL（每行一 Entry）、`~/.pi/agent/sessions/--cwd--/`、檔名 `ISO8601_sessionId.jsonl`
- **樹結構**：每 Entry 有 `id`、`parentId`，append 時建立 current leaf 的 child
- **Branch**：`branch(id)` 只移動 `leafId` 指標，歷史完全不變
- **Compaction**：`compaction` entry 含 `firstKeptEntryId`、`tokensBefore`，`buildContextEntries()` 跳過被摘要區段
- **Fork**：`createBranchedSession(leafId)` 複製 root→leaf 路徑到新檔案，可跨專案
- **Migration**：v1（無 id）→v2（加 id/parentId）→v3（hookMessage→custom）

---

## 為什麼用 Append-only Tree？

| 需求 | 傳統線性歷史 | Append-only Tree |
|---|---|---|
| 回溯修改 | ❌ 只能刪除尾部 | ✅ 跳回任意節點續接 |
| 實驗性嘗試 | ❌ 污染主線 | ✅ `/branch` 建立平行時間線 |
| Compaction | ❌ 丟失細節 | ✅ 保留摘要 + 關鍵片段 |
| Fork 到新專案 | ❌ 複製整個檔 | ✅ 只複製需要的路徑 |
| 書籤/標籤 | ❌ 外掛 | ✅ `label` entry 內建 |

---

## JSONL 檔案格式

### 目錄結構

```
~/.pi/agent/sessions/
└── --Users-xiaoxu-Projects-myproject--/
    ├── 2026-08-31T10-30-00_a1b2c3d4.jsonl
    └── 2026-08-30T14-22-11_e5f6g7h8.jsonl
```

- 目錄名：`--` + `cwd` 路徑分隔符換成 `-` + `--`
- 檔名：`timestamp_sessionId.jsonl`（timestamp 含 `:` 換成 `-`）

### Entry 通用欄位

```typescript
// packages/coding-agent/src/core/session-manager.ts
export interface SessionEntryBase {
  type: string;
  id: string;           // 8 字元 hex（UUID 前 8 碼，碰撞重試）
  parentId: string | null;  // 父節點 id，root 為 null
  timestamp: string;    // ISO8601
}
```

### 所有 Entry 類型

```typescript
// 1. Session Header（檔案第一行）
export interface SessionHeader {
  type: "session";
  version?: number;     // v1 無此欄位
  id: string;           // session id
  timestamp: string;
  cwd: string;
  parentSession?: string;  // fork 來源
}

// 2. 一般訊息
export interface SessionMessageEntry extends SessionEntryBase {
  type: "message";
  message: AgentMessage;  // user/assistant/toolResult
}

// 3. Thinking Level 變更
export interface ThinkingLevelChangeEntry extends SessionEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;  // "off" | "low" | "medium" | "high"
}

// 4. 模型切換記錄
export interface ModelChangeEntry extends SessionEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}

// 5. Compaction 摘要點
export interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;              // 摘要文字
  firstKeptEntryId: string;     // 保留區段起始 entry id
  tokensBefore: number;         // 壓縮前 token 數
  details?: T;                  // Extension 專用資料
  usage?: Usage;                // 生成摘要的 LLM usage
  fromHook?: boolean;           // Extension 產生 vs 內建
}

// 6. Branch Summary（分支時的舊路徑摘要）
export interface BranchSummaryEntry<T = unknown> extends SessionEntryBase {
  type: "branch_summary";
  fromId: string;               // 被捨棄路徑的 leaf id
  summary: string;
  details?: T;
  usage?: Usage;
  fromHook?: boolean;
}

// 7. Extension 內部狀態（不進 LLM Context）
export interface CustomEntry<T = unknown> extends SessionEntryBase {
  type: "custom";
  customType: string;           // Extension 識別碼
  data?: T;
}

// 8. Extension 注入訊息（進 LLM Context）
export interface CustomMessageEntry<T = unknown> extends SessionEntryBase {
  type: "custom_message";
  customType: string;
  content: string | ContentBlock[];
  details?: T;
  display: boolean;             // TUI 是否顯示
}

// 9. Label 書籤
export interface LabelEntry extends SessionEntryBase {
  type: "label";
  targetId: string;             // 被標記的 entry id
  label: string | undefined;    // undefined = 刪除標籤
}

// 10. Session 資訊（顯示名稱）
export interface SessionInfoEntry extends SessionEntryBase {
  type: "session_info";
  name?: string;                // 空字串 = 清除名稱
}
```

---

## 樹遍歷核心算法

### 1. 建立索引

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

### 2. 從 Leaf 走到 Root（`buildSessionPath`）

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
  leaf ??= entries[entries.length - 1];  // 預設最新 entry
  if (!leaf) return [];

  const path: SessionEntry[] = [];
  let current: SessionEntry | undefined = leaf;
  while (current) {
    path.push(current);
    current = current.parentId ? index.get(current.parentId) : undefined;
  }
  path.reverse();  // Root → Leaf 順序
  return path;
}
```

### 3. 取得 Session Context 設定（Thinking Level、Model）

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

### 4. Entry → Context Messages（`sessionEntryToContextMessages`）

```typescript
export function sessionEntryToContextMessages(entry: SessionEntry): AgentMessage[] {
  if (entry.type === "message") {
    const message = entry.message;
    // 防禦性：舊版本可能 content 為 null
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
  // custom、label、session_info、thinking_level_change、model_change → 不進 context
  return [];
}
```

### 5. Compaction 感知的 Context Entries（核心邏輯）

```typescript
export function buildContextEntries(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>,
): SessionEntry[] {
  const path = buildSessionPath(entries, leafId, byId);
  let compaction: CompactionEntry | null = null;

  // 找最新的 compaction entry
  for (const entry of path) {
    if (entry.type === "compaction") {
      compaction = entry;
    }
  }

  if (!compaction) return path;  // 無 compaction，直接回傳完整路徑

  const compactionIdx = path.findIndex((entry) => entry.id === compaction.id);
  if (compactionIdx < 0) return path;

  // 構建：[compaction] + [firstKeptEntryId 之後的 entries] + [compaction 之後的 entries]
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

**圖解**：
```
Path: [msg1] → [msg2] → [msg3] → [compaction: firstKept=msg3] → [msg4] → [msg5] → [msg6]
                                    ↑
Context: [compaction] → [msg3] → [msg4] → [msg5] → [msg6]
         (msg1, msg2 被摘要，不再進 LLM)
```

### 6. 完整 Session Context

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

## SessionManager 類別核心操作

### 初始化與持久化

```typescript
export class SessionManager {
  private sessionId: string = "";
  private sessionFile: string | undefined;
  private sessionDir: string;
  private cwd: string;
  private persist: boolean;
  private flushed: boolean = false;  // 是否已寫入檔案
  private fileEntries: FileEntry[] = [];
  private byId: Map<string, SessionEntry> = new Map();
  private labelsById: Map<string, string> = new Map();
  private labelTimestampsById: Map<string, string> = new Map();
  private leafId: string | null = null;

  // 建立新 Session
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

  // 開啟現有 Session 檔案
  static open(path: string, sessionDir?: string, cwdOverride?: string): SessionManager {
    // 讀取 header、載入 entries、Migration、建立索引
  }
}
```

### Append 操作（所有都建立 child of current leaf）

```typescript
// 通用 append
private _appendEntry(entry: SessionEntry): void {
  this.fileEntries.push(entry);
  this.byId.set(entry.id, entry);
  this.leafId = entry.id;
  this._persist(entry);
}

// 具體方法
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

### Persist 策略：首次 Assistant 回應前不建檔

```typescript
private _persist(entry: SessionEntry): void {
  if (!this.persist || !this.sessionFile) return;

  const hasAssistant = this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant");
  if (!hasAssistant) {
    if (this.flushed) {
      appendFileSync(this.sessionFile, `${JSON.stringify(entry)}\n`);
    } else {
      this.flushed = false;  // 等 Assistant 到來時一次寫入所有 entries
    }
    return;
  }

  if (!this.flushed) {
    // 首次有 Assistant：建檔、寫入所有累積 entries
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

## Branch / Reset / Fork 核心操作

### Branch：移動 Leaf Pointer

```typescript
// 從指定 entry 開始新分支
branch(branchFromId: string): void {
  if (!this.byId.has(branchFromId)) throw new Error(`Entry ${branchFromId} not found`);
  this.leafId = branchFromId;  // 只移動指標，不修改任何 entry
}

// 帶摘要的 Branch（記錄被捨棄路徑）
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

// 重置到 Root（parentId = null）
resetLeaf(): void {
  this.leafId = null;
}
```

### Fork：複製路徑到新檔案

```typescript
createBranchedSession(leafId: string): string | undefined {
  const path = this.getBranch(leafId);  // Root → Leaf 路徑
  if (path.length === 0) throw new Error(`Entry ${leafId} not found`);

  // 過濾 LabelEntry，重新鏈接 parentId
  const pathWithoutLabels: SessionEntry[] = [];
  let pathParentId: string | null = null;
  for (const entry of path) {
    if (entry.type === "label") continue;
    pathWithoutLabels.push({ ...entry, parentId: pathParentId });
    pathParentId = entry.id;
  }

  // 新 Session Header
  const newSessionId = createSessionId();
  const timestamp = new Date().toISOString();
  const header: SessionHeader = {
    type: "session",
    version: CURRENT_SESSION_VERSION,
    id: newSessionId,
    timestamp,
    cwd: this.cwd,
    parentSession: this.persist ? this.sessionFile : undefined,  // 記錄來源
  };

  // 收集路徑上的 Labels
  const pathEntryIds = new Set(pathWithoutLabels.map((e) => e.id));
  const labelsToWrite: Array<{ targetId: string; label: string; timestamp: string }> = [];
  for (const [targetId, label] of this.labelsById) {
    if (pathEntryIds.has(targetId)) {
      labelsToWrite.push({ targetId, label, timestamp: this.labelTimestampsById.get(targetId)! });
    }
  }

  if (this.persist) {
    // 建立 Label Entries（插在路徑末端）
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

    // 有 Assistant 才立即寫檔
    const hasAssistant = this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant");
    if (hasAssistant) { this._rewriteFile(); this.flushed = true; }
    else { this.flushed = false; }

    return newSessionFile;
  }
  // In-memory 模式...
}
```

---

## 讀取優化：Header Scan Limit & Streaming Parse

### Header Bounded Scan（避免大檔案讀太久）

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
      // ... 逐行解析，找到第一個有效 session header 即返回
    }
    throw new SessionHeaderScanLimitError(filePath);
  } finally { closeSync(fd); }
}
```

### Streaming Parse 大檔案（`loadEntriesFromFile`）

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

    // 驗證 Header
    if (entries.length === 0) return entries;
    const header = entries[0];
    if (header.type !== "session" || typeof header.id !== "string") return [];

    return entries;
  } finally { closeSync(fd); }
}
```

---

## Migration：v1 → v2 → v3

### v1 → v2：加入 id/parentId 樹結構

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

### v2 → v3：`hookMessage` role → `custom`

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

## Session 發現與列表

### 尋找最近 Session

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

### 併發載入 Session 資訊（列表用）

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

## 參考資料

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/session-manager.ts](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/session-manager.ts)
- [Pi 官方文件：Session 管理](https://pi.dev/docs/latest/sessions)
- [JSON Lines 格式規範](https://jsonlines.org/)
- [Append-only 資料結構設計模式](https://martinfowler.com/bliki/AppendOnly.html)
- [UUID v7 時間排序特性](https://github.com/uuid/uuidv7)

---

## 下一篇預告

> **第 6 篇：Tool System——定義、執行、Parallel/Sequential、Before/After Hooks**
>
> 8 個核心工具怎麼定義？`ToolDefinition` vs `AgentTool` 差異？`createToolDefinition`/`createTool` Factory 模式？`executionMode: "parallel" | "sequential"` 如何決定？`beforeToolCall`/`afterToolCall` 如何攔截修改？`withFileMutationQueue` 如何序列化檔案寫入？`truncateHead/Line/Tail` 輸出截斷策略？