---
title: "OMP session 持久化、fork 與 tree：entry 模型、父子鏈、/tree 導航、navigateTree 怎麼把 leaf 切回舊分支"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, session, persistence, tree-navigation, fork, checkpoint, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 9
tldr: "omp 用 append-only JSONL 存 session，entry 帶 id/parentId 組成 tree，leaf pointer 決定 active path。/tree 用 TreeSelectorComponent 導航，navigateTree() 切 leaf 時可選擇摘要被離開的分支（branch_summary）、自動處理 checkpoint/rewind、支援 Claude/Codex foreign session import。fork 複製整個 session 檔並繼承 providerPromptCacheKey，resume/switchSession 以 captureState/rollback 保證原子切換。"
description: "深入 omp session 核心：SessionEntry 模型與父子鏈如何構成 tree、SessionEntryIndex 如何維護 O(1) 查詢、/tree 與 navigateTree 的葉節點切換邏輯、branch_summary 如何保留分支脈絡、checkpoint/rewind 的特殊 entry 角色、foreign session import 流程、三層 storage 抽象（indexed/history/artifact）的分工。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 9 篇。前幾篇拆了 [agent loop 雙層迴圈](/posts/tech/2026-08-31-omp-agent-loop-double-while)、[append-only context](/posts/tech/2026-08-31-omp-append-only-context)、[四種 compaction 策略](/posts/tech/2026-08-31-omp-four-compaction-strategies)、[審批三層](/posts/tech/2026-08-31-omp-approval-three-layers)、[bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval)，這篇看 **session 怎麼存在檔案、怎麼分支、怎麼在 tree 裡導航、怎麼 fork/resume**。

---

## TL;DR

| 概念 | 核心機制 | 關鍵檔案 |
|---|---|---|
| **Session Entry 模型** | `type`、`id`、`parentId`、`timestamp` + payload；header 是第一行 `type: "session"` | `session-entries.ts` |
| **父子鏈 → Tree** | 每次 append `parentId = 當前 leafId`，新 entry 成為新 leaf；`SessionEntryIndex` 維護 `entriesById`、`children` map、`leafId` | `session-manager.ts#SessionEntryIndex` |
| **`/tree` 導航** | `TreeSelectorComponent` 渲染 tree，選入口呼叫 `navigateTree(targetId, { summarize, customInstructions })` | `tree-selector.ts`、`agent-session.ts#navigateTree` |
| **navigateTree 切 leaf** | 依選擇類型決定新 leaf：user message → `parentId`；ask tool result → 重答；其他 → `targetId`；可選 `branchWithSummary` | `agent-session.ts#navigateTree`、`session-manager.ts#branchWithSummary` |
| **Checkpoint/Rewind** | 以 `custom_message` (`rewind-report`、`checkpoint-active-reminder`) 持久化，`checkpoint-entries.ts` 解析還原 | `checkpoint-entries.ts` |
| **Foreign Session Import** | `/resume @claude`、`@codex` → picker → 轉換 JSONL → 新 OMP session identity | `foreign-session-import.ts`、`session-operations-export-share-fork-resume.md` |
| **Fork** | 複製 JSONL + artifacts 目錄，新 header `parentSession`、`providerPromptCacheKey` 繼承 | `session-manager.ts#fork`、`agent-session.ts#fork` |
| **Storage 三層** | `FileSessionStorage`（本地）、`IndexedSessionStorage`（本地索引 + 遠端有序發布）、`MemorySessionStorage`（非持久/測試） | `session-storage.ts`、`indexed-session-storage.ts` |

---

## 情境

coding agent 跑幾小時，對話幾百輪。你想：
1. **回到 20 輪前那個決定點**，試另一種寫法，但**不想丟掉現在這條分支的檔案操作紀錄**
2. **把整個 session 複製一份**給同事、或開新分支繼續跑，保留 prompt cache identity
3. **匯入 Claude Code / Codex 的對話歷史**，在 omp 裡繼續跑
4. **關掉終端機明天再開**，session 完整保留、能 `--continue` 接著跑

這些都是 **session persistence + tree navigation + fork/resume** 解決的問題。

omp 的設計核心：**append-only JSONL + id/parentId tree + mutable leaf pointer**。所有操作（append、branch、fork、navigate、compact、shake）最終都落在這個資料結構上。

---

## Session Entry 模型：`type`、`id`、`parentId`、`timestamp`

**檔案**：`packages/coding-agent/src/session/session-entries.ts`

每個 entry 共享基底：

```typescript
// session-entries.ts#SessionEntryBase
export interface SessionEntryBase {
  type: string;
  id: string;           // 8-char 隨機 id（generateId）
  parentId: string | null;  // 父節點，null = root
  timestamp: string;    // ISO 8601
}
```

### Header（第一行，`type: "session"`）

```typescript
// session-entries.ts#SessionHeader
export interface SessionHeader {
  type: "session";
  version: 3;                    // 目前版本
  id: string;                    // session id（UUIDv7）
  timestamp: string;             // 建立時間
  cwd: string;                   // 工作目錄
  title?: string;                // 可選標題
  titleSource?: "auto" | "user";
  additionalDirectories?: string[];  // multi-root workspace
  previousSessionFiles?: string[];   // move 歷史
  providerPromptCacheKey?: string;   // fork 繼承用
  parentSession?: string;            // fork lineage
}
```

### 主要 Entry Types（聯合型別 `SessionEntry`）

| Type | 用途 | 關鍵欄位 |
|---|---|---|
| `message` | user/assistant/toolResult | `message: AgentMessage` |
| `compaction` | context 壓縮摘要 | `summary`、`firstKeptEntryId`、`tokensBefore`、`preserveData` |
| `branch_summary` | `/tree` 切分支時的針對性摘要 | `fromId`、`summary`、`details.readFiles/modifiedFiles` |
| `reset_boundary` | `/clear` 邊界標記 | 無 payload |
| `custom` | extension 內部狀態（不進 LLM context） | `customType`、`data` |
| `custom_message` | extension 注入 LLM context 的訊息 | `customType`、`content`、`display`、`attribution` |
| `label` | `/tree` 標籤書籤 | `targetId`、`label` |
| `title_change` | 重命名審計 | `title`、`source`、`previousTitle` |
| `credential_pin` | OAuth 帳號綁定（prompt cache 復用） | `provider`、`hash` |
| `session_init` | subagent 啟動上下文快照 | `systemPrompt`、`task`、`tools`、`agent`… |
| `mode_change` | plan mode 等模式切換 | `mode`、`data` |

**關鍵設計**：`parentId` 指向**邏輯父節點**，不是檔案順序。append 時 `parentId = 當前 leafId`，所以**檔案順序 ≠ tree 順序**——tree 要用 `SessionEntryIndex` 重建。

---

## 父子鏈如何構成 Tree：`SessionEntryIndex`

**檔案**：`packages/coding-agent/src/session/session-manager.ts#SessionEntryIndex`

`SessionManager` 內部持有一個 `SessionEntryIndex`，每次 `insert(entry)` 時：

```typescript
// session-manager.ts#SessionEntryIndex.insert
insert(entry: SessionEntry): void {
  this.#entriesById.set(entry.id, entry);      // O(1) id 查詢
  this.#leaf = entry.id;                        // 新 entry 成為 leaf

  // 父→子鄰接表
  const bucket = this.#children.get(entry.parentId);
  if (bucket) bucket.push(entry);
  else this.#children.set(entry.parentId, [entry]);

  // label 解析
  if (entry.type === "label") {
    if (entry.label) this.#labels.set(entry.targetId, entry.label);
    else this.#labels.delete(entry.targetId);
  }
  // usage 統計...
}
```

### 關鍵查詢方法

| 方法 | 用途 | 複雜度 |
|---|---|---|
| `get(id)` | id 取 entry | O(1) |
| `leafId()` / `leafEntry()` | 目前 active leaf | O(1) |
| `childrenOf(parentId)` | 取直系子節點 | O(children) |
| `pathTo(id?)` | **root→leaf 路徑**（walk parentId 反轉） | O(depth) |
| `tree(entries)` | 完整樹結構（給 `/tree` UI） | O(n) |
| `labelFor(id)` | 解析後的 label | O(1) |

### `pathTo()`：context rebuild 的骨幹

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

`buildSessionContext()`（`session-context.ts`）就是對 `pathTo(leafId)` 跑一遍，處理 compaction、reset_boundary、branch_summary、dangling tool calls 等邊界條件。

### `tree()`：給 `/tree` UI 用的完整樹

```typescript
// session-manager.ts#SessionEntryIndex.tree
tree(entries: readonly SessionEntry[]): SessionTreeNode[] {
  const nodes = new Map<string, SessionTreeNode>();
  const roots: SessionTreeNode[] = [];

  // 1. 建節點
  for (const entry of entries) {
    nodes.set(entry.id, { entry, children: [], label: this.#labels.get(entry.id) });
  }

  // 2. 掛父子關係
  for (const entry of entries) {
    const node = nodes.get(entry.id)!;
    const parentId = entry.parentId;
    if (parentId === null || parentId === entry.id) {
      roots.push(node);  // 多根共用 virtual root
      continue;
    }
    const parent = nodes.get(parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);  // 缺親節點 → 當根
  }

  // 3. 子節點按 timestamp 排序
  const stack = [...roots];
  while (stack.length > 0) {
    const node = stack.pop()!;
    node.children.sort(orderedByTimestamp);
    stack.push(...node.children);
  }
  return roots;
}
```

**輸出**：`SessionTreeNode[]`（`entry` + `children` + `label`），`TreeSelectorComponent` 直接渲染。

---

## `/tree` 指令：`TreeSelectorComponent`、`getBranch`、`navigateTree`

**檔案**：`packages/coding-agent/src/modes/components/tree-selector.ts`、`packages/coding-agent/src/session/agent-session.ts#navigateTree`、`packages/coding-agent/src/session/session-manager.ts#getBranch`

### 開啟方式

- `/tree` slash command
- 雙 ESC（`doubleEscapeAction = "tree"`，預設）
- `/branch` 當 `doubleEscapeAction = "tree"` 時

### Tree UI 模型

- 以 `session-manager.ts#SessionEntryIndex.tree()` 產出的 `SessionTreeNode[]` 渲染
- **Active branch（root→leaf 路徑）標 `•`**，優先顯示
- Label 顯示為 `[label]`
- 可搜尋（fuzzy match、AND semantics）、可篩選（`default`/`no-tools`/`user-only`/`labeled-only`/`all`）

### 選擇後的決策樹（`navigateTree` 核心邏輯）

```text
selected node
   │
   ├─ current leaf（且非 ask result）? ──> 關閉（no-op）
   │
   ├─ ask tool result? ──> 重新詢問（re-answer），舊答案保留為 sibling branch
   │
   ├─ user message 或普通 custom_message? ──> leaf := parentId（或 root）
   │                                              + 只在 editor 空時 prefill 文字/圖片
   │
   └─ 其他（assistant、toolResult、compaction、branch_summary…）? ──> leaf := selected node id
                                                                     + 不 prefill
```

**程式碼**：`packages/coding-agent/src/session/agent-session.ts#navigateTree`（約 150 行）

```typescript
// 簡化版流程
async navigateTree(targetId: string, options?: { summarize?: boolean; customInstructions?: string }) {
  // 1. flush pending bash、驗證 target
  // 2. 收集 abandoned branch（old leaf → common ancestor）
  // 3. emit session_before_tree（可被 extension 取消或提供 summary）
  // 4. 若需摘要且無 hook 提供 → 呼叫 generateBranchSummary()
  // 5. 套用：branchWithSummary / branch / resetLeaf
  // 6. rebuild model context、checkpoint/rewind/advisor/todo/provider session state
  // 7. emit session_tree、若 handler 追加 entry 再 rebuild 一次
}
```

### `getBranch()`：取得目前 active path

```typescript
// session-manager.ts#getBranch
getBranch(): SessionEntry[] {
  return this.#index.pathTo(this.#index.leafId());
}
```

這是 `buildSessionContext`、compaction、prune、shake 都會用的「目前對話主線」。

---

## navigateTree：Leaf 切換、可選 Summary、Branch Summary 生成

### 切換類型對照

| 選擇目標 | 新 Leaf | Prefill Editor | 用途 |
|---|---|---|---|
| **User message** | `parentId`（根則 `null`） | ✅ 文字+圖片 | 從某個提問重來，編輯再送 |
| **Custom_message (非 skill-prompt)** | `parentId` | ✅ 同上 | 同理 |
| **Skill-prompt custom_message** | `targetId` | ❌ | 像普通節點 |
| **Ask tool result** | 重開問答 UI | ❌ | 重新回答，舊答案變 sibling |
| **其他** | `targetId` | ❌ | 純導航、觀察 context |

### Summary-on-Switch 流程

受 `branchSummary.enabled` 控制（預設 `false`）：

1. 普通 `Enter` → 三選一：`No summary` / `Summarize` / `Summarize with custom prompt`
2. `Shift+Enter` → 直接 `Summarize`（跳過 prompt）
3. Escape → 回 tree selector
4. Custom prompt 取消 → 回 summary 選擇
5. 摘要中可 `Esc` 中止 → tree selector 重開，**不移動 leaf**

**摘要生成**（`agent-session.ts#navigateTree` → `session-manager.ts#branchWithSummary`）：

```typescript
// session-manager.ts#branchWithSummary
async branchWithSummary(targetId: string, summary: string, details?: BranchSummaryDetails) {
  // 1. 移動 leaf 到 targetId
  this.#setLeaf(targetId);
  // 2. 追加 branch_summary entry（parentId = targetId）
  const entry: BranchSummaryEntry = {
    type: "branch_summary",
    id: generateId(this.#index),
    parentId: targetId,
    timestamp: nowIso(),
    fromId: this.#index.leafId() === targetId ? "root" : this.#index.leafId()!,  // 實際是 old leaf
    summary,
    details,
    fromExtension: false,
  };
  this.#recordEntry(entry);  // 寫檔、更新 index
}
```

**BranchSummaryEntry** 落盤後，下次 navigate 回這個 leaf 時，`buildSessionContext` 會把它轉成 `BranchSummaryMessage` 注入 context，agent 知道「喔，這分支我改過 `foo.ts`、讀過 `bar.ts`」。

---

## Checkpoint / Rewind Entry 的特殊角色

**檔案**：`packages/coding-agent/src/session/checkpoint-entries.ts`

checkpoint/rewind 是 **tool 執行結果**，但為了在 session 重建時能復原狀態，持久化為特殊的 `custom_message`：

| 操作 | Persisted Entry Type | 關鍵欄位 |
|---|---|---|
| `checkpoint` 成功 | `message` (toolResult) | `semanticToolResult()` 偵測 |
| `rewind` 完成 | `custom_message` (`rewind-report`) | `details: { startedAt, rewoundAt, report }` |
| checkpoint active 提醒 | `custom_message` (`checkpoint-active-reminder`) | 暫時性、不進 LLM context |

### 解析工具

```typescript
// checkpoint-entries.ts
export function isSuccessfulCheckpointEntry(entry: SessionEntry): boolean
export function checkpointStartedAtFromEntry(entry: SessionEntry): string | undefined
export function completedRewindFromEntry(entry: SessionEntry): CompletedRewindState | undefined
```

`AgentSession` 載入時會掃描這些 entry 重建 `#checkpointState`、`#lastCompletedRewind`，讓 `/rewind`、`/checkpoint` 指令在 resume 後仍可運作。

---

## Foreign Session Import：Claude / Codex Session 導入

**檔案**：`packages/coding-agent/src/session/foreign-session-import.ts`、`docs/session-operations-export-share-fork-resume.md#interactive-resume-value`

### 流程

1. `/resume @claude` 或 `/resume @codex` → 開啟 foreign session picker
2. 使用者選一個 `.jsonl` / 目錄
3. `ForeignSessionImporter` 解析對方格式 → 轉換為 OMP `SessionEntry[]`
4. **建立新 OMP session identity**（新 id、新 timestamp、新檔案）
5. 寫入轉換後的 entries，切換到新 session

### 關鍵轉換點

- **Claude Code**：`~/.claude/projects/**/*.jsonl`，格式不同（無 parentId tree），需線性化重建
- **Codex**：`~/.codex/sessions/**/*.jsonl`，類似處理
- **不保留原 session id**——避免 prompt cache key 衝突，改用 `parentSession` 記錄來源
- **Provider prompt cache key 不繼承**（除非完全相同路由），避免汙染

---

## Fork：複製整個 Session、繼承 Prompt Cache Key

**檔案**：`packages/coding-agent/src/session/session-manager.ts#fork`、`packages/coding-agent/src/session/agent-session.ts#fork`

### Interactive `/fork`

```typescript
// session-manager.ts#fork
fork(): SessionManager | undefined {
  if (!this.#persist || !this.#sessionFile) return undefined;

  const newSessionId = mintSessionId();
  const newTimestamp = nowIso();
  const newFile = path.join(this.#sessionDir, `${fileSafeTimestamp(newTimestamp)}_${newSessionId}.jsonl`);

  // 新 header：新 id、新 timestamp、同 cwd、parentSession = old id
  const newHeader: SessionHeader = {
    ...this.#header,
    id: newSessionId,
    timestamp: newTimestamp,
    parentSession: this.#sessionId,
    providerPromptCacheKey: this.#header.providerPromptCacheKey ?? this.#sessionId,
  };

  // 複製所有非 header entries（append-only 所以直接複製）
  // 寫新檔、建立新 SessionManager
  // 複製 artifacts 目錄（best-effort）
}
```

### CLI `--fork <id|path>`

啟動階段解析，`SessionManager.forkFrom(path, cwd, sessionDir)`，行為一致。

### 關鍵點

| 特性 | 說明 |
|---|---|
| **新 session file** | 完整複製 entries，新 header |
| **`parentSession`** | 記錄來源 session id（lineage） |
| **`providerPromptCacheKey`** | 繼承舊 header 的 key，或 fallback 到舊 session id；`--prompt-cache-key` 可手動 pin |
| **Artifacts** | 目錄整個複製（`copySessionArtifacts`） |
| **Non-persistent** | `fork()` 回傳 `undefined`，UI 提示失敗 |

---

## Session Storage 三層：Indexed / History / Artifact

**檔案**：`packages/coding-agent/src/session/session-storage.ts`、`packages/coding-agent/src/session/indexed-session-storage.ts`、`packages/coding-agent/src/session/history-storage.ts`、`packages/coding-agent/src/session/artifacts.ts`

### 1. `SessionStorage` 抽象介面

```typescript
// session-storage.ts#SessionStorage
interface SessionStorage {
  // 同步：目錄/存在性/寫入/stat/list
  ensureDirSync(dir: string): void;
  existsSync(path: string): boolean;
  writeTextSync(path: string, content: string): void;
  readTextSync(path: string): string;
  statSync(path: string): Stats;
  listSync(dir: string): string[];
  // 非同步：read、sliced read、write、atomic write、rename、unlink
  // artifact-aware deletion、title update、writer create、backend drain
}
```

### 2. 三種實作

| 實作 | 用途 | 持久化 |
|---|---|---|
| `FileSessionStorage` | 真實本地檔案 | ✅ |
| `MemorySessionStorage` | In-memory map/chunk，**非持久 session**、**測試** | ❌ |
| `IndexedSessionStorage` | **共享本地索引 + 有序遠端發布**（Redis/SQL-backed） | ✅（雙寫） |

### 3. `IndexedSessionStorage`：本地索引 + 遠端有序發布

```typescript
// indexed-session-storage.ts
// - 本地 SQLite 索引：session_id、cwd、mtime、leafId、entry count...
// - 遠端：Redis/S3 等，依 timestamp 總序發布
// - 讀取：優先本地索引，缺則遠端回填
// - 寫入：本地同步寫入 + 非同步推送遠端
```

### 4. `HistoryStorage`：Prompt 歷史（獨立子系統）

```typescript
// history-storage.ts
// DB: ~/.omp/agent/history.db
// Table: history(id, prompt, created_at, cwd, session_id)
// FTS5: history_fts（trigger 同步）
// 批次寫入（~100ms delay）、連續重複 prompt 去重
// **用途**：prompt recall/search UI，**不是** session replay
```

### 5. Artifacts：Session-scoped 檔案空間

```typescript
// artifacts.ts
// 每個 session 擁有 <session-file>.jsonl 同名目錄（不含 .jsonl）
// AgentSession.allocateArtifactPath() / saveArtifact() / getArtifactPath()
// Fork 時整目錄複製（copySessionArtifacts）
// Subagent session 寫在父 session artifacts 目錄下：<parent>/<agentId>.jsonl
```

---

## Session Switch / Resume：Capture State + Atomic Transition

**檔案**：`packages/coding-agent/src/session/agent-session.ts#switchSession`、`packages/coding-agent/src/session/session-manager.ts#setSessionFile`

### `switchSession` 核心流程（簡化）

```typescript
// agent-session.ts#switchSession
async switchSession(sessionPath: string): Promise<boolean> {
  // 1. emit session_before_switch (cancellable)
  // 2. 斷開 agent 訂閱、abort in-flight、捕獲 rollback state：
  //    - sessionManager state
  //    - agent messages + queues
  //    - model/thinking/service tier
  //    - tools/prompts
  //    - provider/cache ids
  //    - memory promotion
  //    - checkpoint/rewind state
  // 3. 清 queues、drain advisor recorders
  // 4. sessionManager.setSessionFile(sessionPath)
  //    - 載入新檔、migrate、resolve blob refs、rebuild index
  //    - 更新 provider cache/session ids、memory keys、rehydrate checkpoint
  // 5. emit session_switch
  // 6. 替換 agent messages、重置 advisor、同步 todos
  // 7. 關閉舊 provider sessions（不同檔）或重放改變的 messages（同檔）
  // 8. 恢復模型、thinking、service tier
  // 9. 不同 transcript → reset memory；conversation rewrite → clear tool state
  // 10. 重連 agent events、run reconciler（plan mode 等）、refresh workspace prompt
  // 11. 回傳 true/false（false = hook cancel 或 cwd policy reject）
}
```

### 關鍵保證

- **Atomic**：任何步驟失敗 → 完整 rollback 到 captured state
- **Cross-project**：錄製的 cwd 不存在 → 詢問 re-root（`moveTo`）；存在 → 直接 open，後續切換 process cwd
- **Terminal breadcrumb**：`~/.omp/agent/terminal-sessions/<terminal-id>` 記錄 cwd + session file + `fresh` 標記，`--continue` 用

---

## 學到的事

1. **Append-only JSONL + id/parentId tree 是 session 模型的最小完整集**——所有複雜操作（branch、fork、navigate、compact、shake、rewind）都在這個資料結構上疊加語意，不需要額外的 migration schema
2. **Leaf pointer 是唯一 mutable state**——tree 本身不可變，切分支只是移動指標，這讓 `/tree` 導航、`/fork` 複製、resume 重建都極簡單可靠
3. **`SessionEntryIndex` 是效能關鍵**——O(1) id 查詢、O(children) 子節點、O(depth) pathTo，支援即時 tree UI 與 context rebuild
4. **Branch summary 解決「tree 導航失憶」**——coding agent 特有：切分支不只換 context，還要保留「剛剛在另一條分支改了哪些檔、跑了哪些工具」
5. **Foreign session import 不保留原 id**——避免 prompt cache 汙染，用 `parentSession` 記 lineage；這是「相容但不混淆」的務實取捨
6. **Fork 繼承 `providerPromptCacheKey`**——OpenAI Responses / Anthropic prompt cache 是 session-scoped，fork 要繼承才能省錢；但 `--model` 等參數改變時啟動會自動 drop
7. **Storage 分層隔離關注點**——File（本地）、Indexed（分散式索引+遠端）、Memory（測試/臨時），HistoryStorage 獨立做 prompt search，Artifacts 獨立做檔案空間
8. **Switch/Resume 用 capture+rollback 保證原子性**——幾十行 state capture、幾十行 restore，中間任何失敗都能完整復原，這才是 production-grade 的 session 切換

---

## 參考資料

- `packages/coding-agent/src/session/session-entries.ts` — `SessionEntryBase`、`SessionHeader`、所有 entry type 定義、`SessionTreeNode`
- `packages/coding-agent/src/session/session-manager.ts` — `SessionEntryIndex`（insert/pathTo/tree/leafId/getBranch）、`fork`、`setSessionFile`、`captureState`/`restoreState`、`switchSession` 配合
- `packages/coding-agent/src/session/agent-session.ts` — `navigateTree`、`fork`、`switchSession`、`freshSession`、`resetSessionContext`
- `packages/coding-agent/src/session/session-context.ts` — `buildSessionContext`（pathTo + compaction/reset/branch summary 處理）
- `packages/coding-agent/src/session/checkpoint-entries.ts` — `isSuccessfulCheckpointEntry`、`completedRewindFromEntry`、`checkpointStartedAtFromEntry`
- `packages/coding-agent/src/session/foreign-session-import.ts` — `ForeignSessionImporter`、Claude/Codex 格式轉換
- `packages/coding-agent/src/session/session-storage.ts` — `SessionStorage` 介面、`FileSessionStorage`、`MemorySessionStorage`
- `packages/coding-agent/src/session/indexed-session-storage.ts` — `IndexedSessionStorage`（本地索引 + 遠端有序發布）
- `packages/coding-agent/src/session/history-storage.ts` — `HistoryStorage`（SQLite + FTS5 prompt history）
- `packages/coding-agent/src/session/artifacts.ts` — `ArtifactManager`、`allocateArtifactPath`、`copySessionArtifacts`
- `packages/coding-agent/src/modes/components/tree-selector.ts` — `TreeSelectorComponent`（渲染、搜尋、篩選、鍵盤導航）
- `docs/session.md` — 官方 session 文檔（格式、版本、tree 語意、載入行為、persistence guarantees）
- `docs/tree.md` — `/tree` 指令完整參考（UI、鍵盤、篩選、選擇決策樹、label、workflow）
- `docs/session-operations-export-share-fork-resume.md` — export/share/fresh/clear/fork/resume/continue 操作矩陣與流程

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 9 篇。上一篇：[bash tokenized approval](/posts/tech/2026-08-31-omp-bash-tokenized-approval)。下一篇：待定*