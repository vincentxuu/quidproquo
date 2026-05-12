# 站長端 Episodic Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin-only episodic memory system that stores writing preferences, reusable writing templates, recent task context, and manual memory corrections for content pipelines.

**Architecture:** Keep Markdown posts as source of truth and store only admin memory state in D1. Expose a Worker-safe service layer under `src/lib/admin-memory/`, admin API routes under `src/pages/api/admin/memory/`, and an admin console page under `src/pages/admin/memory.astro`. Content pipelines consume memory through a context builder, but memory never directly overwrites published Markdown.

**Tech Stack:** Astro 6 SSR, Cloudflare Workers, D1, TypeScript, pnpm, oxlint, existing admin session auth in `src/lib/auth/session.ts`.

---

## Scope

### In scope

- Store站長寫作偏好：語氣、段落長度、偏好結構、常用禁忌。
- Store常用範本：post outline、translation review checklist、research brief format、social snippet pattern。
- Track近期連續任務脈絡：本週主題、未完成草稿、待補資料、最近 pipeline handoff。
- Support manual correction：站長可新增、停用、修正、刪除錯誤記憶，並留下 correction audit trail。
- Make memory usable by content pipelines through an explicit, bounded context builder.

### Out of scope for MVP

- Public user personalization.
- Cross-device reader memory.
- Vector embeddings for memory retrieval.
- Fully autonomous memory creation from every admin action.
- Direct modification of `src/content/posts/**/*.md` from the admin UI.
- LLM-based preference inference without review.

## Product model

```text
Admin Memory
  -> Preferences: stable writing preferences and constraints
  -> Templates: reusable content structures
  -> Task Context: recent writing/pipeline state
  -> Corrections: explicit user fixes to prior memory

Content Pipeline
  -> Build request context
  -> Load bounded memory pack
  -> Run deterministic / LLM stages
  -> Produce draft/report/artifact
  -> Never mutate memory unless admin confirms
```

## Data model

### `admin_memories`

Stores current memory items.

```sql
CREATE TABLE IF NOT EXISTS admin_memories (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'manual',
  confidence TEXT NOT NULL DEFAULT 'confirmed',
  tags_json TEXT NOT NULL DEFAULT '[]',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT
);
```

Allowed values:

```ts
export type AdminMemoryKind = 'preference' | 'template' | 'task_context' | 'correction'
export type AdminMemoryStatus = 'active' | 'archived' | 'rejected'
export type AdminMemorySource = 'manual' | 'pipeline_suggestion'
export type AdminMemoryConfidence = 'confirmed' | 'suggested' | 'corrected'
```

### `admin_memory_events`

Stores append-only history for correction and audit.

```sql
CREATE TABLE IF NOT EXISTS admin_memory_events (
  id TEXT PRIMARY KEY,
  memory_id TEXT,
  event_type TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  reason TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (memory_id) REFERENCES admin_memories(id)
);
```

Allowed event types:

```ts
export type AdminMemoryEventType = 'created' | 'updated' | 'archived' | 'rejected' | 'corrected' | 'used'
```

### Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_admin_memories_kind_status ON admin_memories(kind, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memories_updated ON admin_memories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memory_events_memory ON admin_memory_events(memory_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memory_events_created ON admin_memory_events(created_at DESC);
```

## File structure

- Create: `migrations/0008_admin_memory.sql`
  - Adds D1 tables and indexes.
- Create: `src/lib/admin-memory/types.ts`
  - Shared types for rows, inputs, filters, and memory packs.
- Create: `src/lib/admin-memory/store.ts`
  - D1 CRUD and event logging.
- Create: `src/lib/admin-memory/context.ts`
  - Builds bounded memory packs for pipelines.
- Create: `src/lib/admin-memory/store.test.ts`
  - Unit tests for serialization, filtering, and mutation helpers using a fake D1 adapter.
- Create: `src/lib/admin-memory/context.test.ts`
  - Unit tests for memory pack selection and redaction boundaries.
- Create: `src/pages/api/admin/memory/index.ts`
  - Authenticated list/create endpoint.
- Create: `src/pages/api/admin/memory/[id].ts`
  - Authenticated update/archive endpoint.
- Create: `src/pages/api/admin/memory/[id]/events.ts`
  - Authenticated event list endpoint.
- Create: `src/pages/admin/memory.astro`
  - Admin UI for listing, creating, editing, archiving, and correcting memory.
- Modify: `src/layouts/AdminLayout.astro`
  - Add navigation link to the memory page if admin nav lives here.
- Modify: `src/lib/pipelines/context-builder.ts`
  - Add optional memory pack loading for content pipelines.
- Modify: `src/lib/pipelines/types.ts`
  - Add memory pack field to pipeline context types if needed by existing context builder shape.
- Modify: `docs/ai-agent-content-system.md`
  - Add a short section linking Content Agent Harness to Admin Memory.

---

## Task 1: Add D1 schema

**Files:**

- Create: `migrations/0008_admin_memory.sql`

- [ ] **Step 1: Create migration**

Create `migrations/0008_admin_memory.sql`:

```sql
-- Admin episodic memory for writing preferences, templates, task context, and corrections.

CREATE TABLE IF NOT EXISTS admin_memories (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'manual',
  confidence TEXT NOT NULL DEFAULT 'confirmed',
  tags_json TEXT NOT NULL DEFAULT '[]',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_memory_events (
  id TEXT PRIMARY KEY,
  memory_id TEXT,
  event_type TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  reason TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (memory_id) REFERENCES admin_memories(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_memories_kind_status ON admin_memories(kind, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memories_updated ON admin_memories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memory_events_memory ON admin_memory_events(memory_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_memory_events_created ON admin_memory_events(created_at DESC);
```

- [ ] **Step 2: Verify migration is discoverable**

Run:

```bash
ls migrations/0008_admin_memory.sql
```

Expected:

```text
migrations/0008_admin_memory.sql
```

- [ ] **Step 3: Commit**

Use the repository commit convention and the `format-commit` skill before committing.

```bash
git add migrations/0008_admin_memory.sql
git commit
```

---

## Task 2: Define admin memory types

**Files:**

- Create: `src/lib/admin-memory/types.ts`

- [ ] **Step 1: Write types**

Create `src/lib/admin-memory/types.ts`:

```ts
export type AdminMemoryKind = 'preference' | 'template' | 'task_context' | 'correction'
export type AdminMemoryStatus = 'active' | 'archived' | 'rejected'
export type AdminMemorySource = 'manual' | 'pipeline_suggestion'
export type AdminMemoryConfidence = 'confirmed' | 'suggested' | 'corrected'
export type AdminMemoryEventType = 'created' | 'updated' | 'archived' | 'rejected' | 'corrected' | 'used'

export interface AdminMemoryRow {
  id: string
  kind: AdminMemoryKind
  title: string
  content: string
  status: AdminMemoryStatus
  source: AdminMemorySource
  confidence: AdminMemoryConfidence
  tags_json: string
  metadata_json: string
  created_by: string | null
  created_at: string
  updated_at: string
  last_used_at: string | null
}

export interface AdminMemory {
  id: string
  kind: AdminMemoryKind
  title: string
  content: string
  status: AdminMemoryStatus
  source: AdminMemorySource
  confidence: AdminMemoryConfidence
  tags: string[]
  metadata: Record<string, unknown>
  createdBy: string | null
  createdAt: string
  updatedAt: string
  lastUsedAt: string | null
}

export interface AdminMemoryEventRow {
  id: string
  memory_id: string | null
  event_type: AdminMemoryEventType
  before_json: string | null
  after_json: string | null
  reason: string | null
  created_by: string | null
  created_at: string
}

export interface AdminMemoryEvent {
  id: string
  memoryId: string | null
  eventType: AdminMemoryEventType
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  reason: string | null
  createdBy: string | null
  createdAt: string
}

export interface CreateAdminMemoryInput {
  kind: AdminMemoryKind
  title: string
  content: string
  tags?: string[]
  metadata?: Record<string, unknown>
  source?: AdminMemorySource
  confidence?: AdminMemoryConfidence
  createdBy?: string
}

export interface UpdateAdminMemoryInput {
  title?: string
  content?: string
  status?: AdminMemoryStatus
  tags?: string[]
  metadata?: Record<string, unknown>
  confidence?: AdminMemoryConfidence
  reason?: string
  updatedBy?: string
}

export interface AdminMemoryFilter {
  kind?: AdminMemoryKind
  status?: AdminMemoryStatus
  limit?: number
}

export interface AdminMemoryPack {
  preferences: AdminMemory[]
  templates: AdminMemory[]
  taskContext: AdminMemory[]
  corrections: AdminMemory[]
  rendered: string
}
```

- [ ] **Step 2: Add type-only import check**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: TypeScript exits successfully, or reports only unrelated existing project errors. If unrelated errors appear, note them in the task handoff and continue only if this file is not implicated.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-memory/types.ts
git commit
```

---

## Task 3: Implement D1 store

**Files:**

- Create: `src/lib/admin-memory/store.ts`
- Create: `src/lib/admin-memory/store.test.ts`

- [ ] **Step 1: Write mapping tests**

Create `src/lib/admin-memory/store.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { mapMemoryEventRow, mapMemoryRow, normalizeMemoryLimit } from './store'

const row = {
  id: 'memory-1',
  kind: 'preference',
  title: 'Short paragraphs',
  content: 'Prefer short paragraphs with one idea each.',
  status: 'active',
  source: 'manual',
  confidence: 'confirmed',
  tags_json: '["style"]',
  metadata_json: '{"scope":"posts"}',
  created_by: 'admin',
  created_at: '2026-05-13T00:00:00.000Z',
  updated_at: '2026-05-13T00:00:00.000Z',
  last_used_at: null,
} as const

describe('admin memory store helpers', () => {
  it('maps memory rows into API-safe objects', () => {
    expect(mapMemoryRow(row)).toEqual({
      id: 'memory-1',
      kind: 'preference',
      title: 'Short paragraphs',
      content: 'Prefer short paragraphs with one idea each.',
      status: 'active',
      source: 'manual',
      confidence: 'confirmed',
      tags: ['style'],
      metadata: { scope: 'posts' },
      createdBy: 'admin',
      createdAt: '2026-05-13T00:00:00.000Z',
      updatedAt: '2026-05-13T00:00:00.000Z',
      lastUsedAt: null,
    })
  })

  it('falls back to empty tags and metadata for invalid JSON', () => {
    expect(mapMemoryRow({ ...row, tags_json: 'bad', metadata_json: 'bad' }).tags).toEqual([])
    expect(mapMemoryRow({ ...row, tags_json: 'bad', metadata_json: 'bad' }).metadata).toEqual({})
  })

  it('normalizes list limits', () => {
    expect(normalizeMemoryLimit(undefined)).toBe(50)
    expect(normalizeMemoryLimit(0)).toBe(1)
    expect(normalizeMemoryLimit(500)).toBe(100)
  })

  it('maps event rows into parsed events', () => {
    expect(mapMemoryEventRow({
      id: 'event-1',
      memory_id: 'memory-1',
      event_type: 'corrected',
      before_json: '{"title":"Old"}',
      after_json: '{"title":"New"}',
      reason: 'Manual fix',
      created_by: 'admin',
      created_at: '2026-05-13T00:00:00.000Z',
    })).toEqual({
      id: 'event-1',
      memoryId: 'memory-1',
      eventType: 'corrected',
      before: { title: 'Old' },
      after: { title: 'New' },
      reason: 'Manual fix',
      createdBy: 'admin',
      createdAt: '2026-05-13T00:00:00.000Z',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/admin-memory/store.test.ts
```

Expected: FAIL because `src/lib/admin-memory/store.ts` does not exist.

- [ ] **Step 3: Implement store**

Create `src/lib/admin-memory/store.ts`:

```ts
import type {
  AdminMemory,
  AdminMemoryEvent,
  AdminMemoryEventRow,
  AdminMemoryEventType,
  AdminMemoryFilter,
  AdminMemoryRow,
  CreateAdminMemoryInput,
  UpdateAdminMemoryInput,
} from './types'

export function normalizeMemoryLimit(limit: number | undefined): number {
  return Math.min(Math.max(limit ?? 50, 1), 100)
}

export function mapMemoryRow(row: AdminMemoryRow): AdminMemory {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    content: row.content,
    status: row.status,
    source: row.source,
    confidence: row.confidence,
    tags: parseArray(row.tags_json),
    metadata: parseObject(row.metadata_json),
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastUsedAt: row.last_used_at,
  }
}

export function mapMemoryEventRow(row: AdminMemoryEventRow): AdminMemoryEvent {
  return {
    id: row.id,
    memoryId: row.memory_id,
    eventType: row.event_type,
    before: row.before_json ? parseObject(row.before_json) : null,
    after: row.after_json ? parseObject(row.after_json) : null,
    reason: row.reason,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

export async function listAdminMemories(db: D1Database, filter: AdminMemoryFilter = {}): Promise<AdminMemory[]> {
  const limit = normalizeMemoryLimit(filter.limit)
  const status = filter.status ?? 'active'

  if (filter.kind) {
    const result = await db.prepare(
      `SELECT id, kind, title, content, status, source, confidence, tags_json, metadata_json,
              created_by, created_at, updated_at, last_used_at
       FROM admin_memories
       WHERE kind = ? AND status = ?
       ORDER BY updated_at DESC
       LIMIT ?`,
    ).bind(filter.kind, status, limit).all<AdminMemoryRow>()
    return result.results.map(mapMemoryRow)
  }

  const result = await db.prepare(
    `SELECT id, kind, title, content, status, source, confidence, tags_json, metadata_json,
            created_by, created_at, updated_at, last_used_at
     FROM admin_memories
     WHERE status = ?
     ORDER BY updated_at DESC
     LIMIT ?`,
  ).bind(status, limit).all<AdminMemoryRow>()
  return result.results.map(mapMemoryRow)
}

export async function getAdminMemory(db: D1Database, id: string): Promise<AdminMemory | null> {
  const row = await db.prepare(
    `SELECT id, kind, title, content, status, source, confidence, tags_json, metadata_json,
            created_by, created_at, updated_at, last_used_at
     FROM admin_memories
     WHERE id = ?`,
  ).bind(id).first<AdminMemoryRow>()
  return row ? mapMemoryRow(row) : null
}

export async function createAdminMemory(db: D1Database, input: CreateAdminMemoryInput): Promise<AdminMemory> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO admin_memories (id, kind, title, content, source, confidence, tags_json, metadata_json, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    id,
    input.kind,
    input.title,
    input.content,
    input.source ?? 'manual',
    input.confidence ?? 'confirmed',
    JSON.stringify(input.tags ?? []),
    JSON.stringify(input.metadata ?? {}),
    input.createdBy ?? null,
  ).run()

  const memory = await getAdminMemory(db, id)
  if (!memory) throw new Error('Created memory was not found')
  await createMemoryEvent(db, id, 'created', null, memory, null, input.createdBy)
  return memory
}

export async function updateAdminMemory(db: D1Database, id: string, input: UpdateAdminMemoryInput): Promise<AdminMemory> {
  const before = await getAdminMemory(db, id)
  if (!before) throw new Error('Memory not found')

  const next = {
    title: input.title ?? before.title,
    content: input.content ?? before.content,
    status: input.status ?? before.status,
    confidence: input.confidence ?? before.confidence,
    tags: input.tags ?? before.tags,
    metadata: input.metadata ?? before.metadata,
  }

  await db.prepare(
    `UPDATE admin_memories
     SET title = ?, content = ?, status = ?, confidence = ?, tags_json = ?, metadata_json = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).bind(
    next.title,
    next.content,
    next.status,
    next.confidence,
    JSON.stringify(next.tags),
    JSON.stringify(next.metadata),
    id,
  ).run()

  const after = await getAdminMemory(db, id)
  if (!after) throw new Error('Updated memory was not found')
  const eventType: AdminMemoryEventType = input.reason ? 'corrected' : next.status === 'archived' ? 'archived' : 'updated'
  await createMemoryEvent(db, id, eventType, before, after, input.reason ?? null, input.updatedBy)
  return after
}

export async function listMemoryEvents(db: D1Database, memoryId: string, limit = 50): Promise<AdminMemoryEvent[]> {
  const result = await db.prepare(
    `SELECT id, memory_id, event_type, before_json, after_json, reason, created_by, created_at
     FROM admin_memory_events
     WHERE memory_id = ?
     ORDER BY created_at DESC
     LIMIT ?`,
  ).bind(memoryId, normalizeMemoryLimit(limit)).all<AdminMemoryEventRow>()
  return result.results.map(mapMemoryEventRow)
}

export async function createMemoryEvent(
  db: D1Database,
  memoryId: string | null,
  eventType: AdminMemoryEventType,
  before: unknown,
  after: unknown,
  reason: string | null,
  createdBy?: string,
): Promise<void> {
  await db.prepare(
    `INSERT INTO admin_memory_events (id, memory_id, event_type, before_json, after_json, reason, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    memoryId,
    eventType,
    before ? JSON.stringify(before) : null,
    after ? JSON.stringify(after) : null,
    reason,
    createdBy ?? null,
  ).run()
}

export async function markMemoriesUsed(db: D1Database, memoryIds: string[], createdBy = 'pipeline'): Promise<void> {
  for (const id of memoryIds) {
    await db.prepare(`UPDATE admin_memories SET last_used_at = datetime('now') WHERE id = ?`).bind(id).run()
    await createMemoryEvent(db, id, 'used', null, { id }, null, createdBy)
  }
}

function parseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function parseObject(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/admin-memory/store.test.ts
```

Expected: PASS.

- [ ] **Step 5: Run lint for changed source**

Run:

```bash
pnpm lint
```

Expected: no new warnings from `src/lib/admin-memory/store.ts`. Existing warnings may remain in unrelated files listed by the command.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin-memory/store.ts src/lib/admin-memory/store.test.ts
git commit
```

---

## Task 4: Build bounded memory context

**Files:**

- Create: `src/lib/admin-memory/context.ts`
- Create: `src/lib/admin-memory/context.test.ts`

- [ ] **Step 1: Write context tests**

Create `src/lib/admin-memory/context.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { AdminMemory } from './types'
import { renderMemoryPack, selectMemoryPack } from './context'

function memory(overrides: Partial<AdminMemory>): AdminMemory {
  return {
    id: overrides.id ?? 'memory-1',
    kind: overrides.kind ?? 'preference',
    title: overrides.title ?? 'Tone',
    content: overrides.content ?? 'Use a direct, practical tone.',
    status: overrides.status ?? 'active',
    source: overrides.source ?? 'manual',
    confidence: overrides.confidence ?? 'confirmed',
    tags: overrides.tags ?? ['writing'],
    metadata: overrides.metadata ?? {},
    createdBy: overrides.createdBy ?? 'admin',
    createdAt: overrides.createdAt ?? '2026-05-13T00:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-05-13T00:00:00.000Z',
    lastUsedAt: overrides.lastUsedAt ?? null,
  }
}

describe('admin memory context', () => {
  it('groups active memories by kind', () => {
    const pack = selectMemoryPack([
      memory({ id: 'p1', kind: 'preference' }),
      memory({ id: 't1', kind: 'template' }),
      memory({ id: 'c1', kind: 'task_context' }),
      memory({ id: 'x1', kind: 'correction' }),
      memory({ id: 'archived', status: 'archived' }),
    ])

    expect(pack.preferences.map(item => item.id)).toEqual(['p1'])
    expect(pack.templates.map(item => item.id)).toEqual(['t1'])
    expect(pack.taskContext.map(item => item.id)).toEqual(['c1'])
    expect(pack.corrections.map(item => item.id)).toEqual(['x1'])
  })

  it('limits each group to a small bounded set', () => {
    const pack = selectMemoryPack(Array.from({ length: 8 }, (_, index) => memory({ id: `p${index}` })), { perKindLimit: 3 })
    expect(pack.preferences).toHaveLength(3)
  })

  it('renders a compact prompt-safe memory pack', () => {
    const rendered = renderMemoryPack(selectMemoryPack([
      memory({ kind: 'preference', title: 'Tone', content: 'Use a direct tone.' }),
      memory({ kind: 'template', title: 'Guide outline', content: 'Problem → steps → verification.' }),
    ]))

    expect(rendered).toContain('Writing Preferences')
    expect(rendered).toContain('Tone: Use a direct tone.')
    expect(rendered).toContain('Reusable Templates')
    expect(rendered).toContain('Guide outline: Problem → steps → verification.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/admin-memory/context.test.ts
```

Expected: FAIL because `src/lib/admin-memory/context.ts` does not exist.

- [ ] **Step 3: Implement context builder**

Create `src/lib/admin-memory/context.ts`:

```ts
import { listAdminMemories, markMemoriesUsed } from './store'
import type { AdminMemory, AdminMemoryPack } from './types'

interface MemoryPackOptions {
  perKindLimit?: number
}

export function selectMemoryPack(memories: AdminMemory[], options: MemoryPackOptions = {}): AdminMemoryPack {
  const perKindLimit = options.perKindLimit ?? 5
  const active = memories.filter(memory => memory.status === 'active')
  const pack = {
    preferences: active.filter(memory => memory.kind === 'preference').slice(0, perKindLimit),
    templates: active.filter(memory => memory.kind === 'template').slice(0, perKindLimit),
    taskContext: active.filter(memory => memory.kind === 'task_context').slice(0, perKindLimit),
    corrections: active.filter(memory => memory.kind === 'correction').slice(0, perKindLimit),
    rendered: '',
  }
  return { ...pack, rendered: renderMemoryPack(pack) }
}

export function renderMemoryPack(pack: Omit<AdminMemoryPack, 'rendered'>): string {
  return [
    renderSection('Writing Preferences', pack.preferences),
    renderSection('Reusable Templates', pack.templates),
    renderSection('Recent Task Context', pack.taskContext),
    renderSection('Manual Corrections', pack.corrections),
  ].filter(Boolean).join('\n\n')
}

export async function buildAdminMemoryPack(db: D1Database, options: MemoryPackOptions = {}): Promise<AdminMemoryPack> {
  const memories = await listAdminMemories(db, { status: 'active', limit: 100 })
  const pack = selectMemoryPack(memories, options)
  const usedIds = [
    ...pack.preferences,
    ...pack.templates,
    ...pack.taskContext,
    ...pack.corrections,
  ].map(memory => memory.id)
  if (usedIds.length) await markMemoriesUsed(db, usedIds)
  return pack
}

function renderSection(title: string, memories: AdminMemory[]): string {
  if (!memories.length) return ''
  const lines = memories.map(memory => `- ${memory.title}: ${memory.content}`)
  return [`## ${title}`, ...lines].join('\n')
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/admin-memory/context.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin-memory/context.ts src/lib/admin-memory/context.test.ts
git commit
```

---

## Task 5: Add authenticated memory APIs

**Files:**

- Create: `src/pages/api/admin/memory/index.ts`
- Create: `src/pages/api/admin/memory/[id].ts`
- Create: `src/pages/api/admin/memory/[id]/events.ts`

- [ ] **Step 1: Create list/create endpoint**

Create `src/pages/api/admin/memory/index.ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { createAdminMemory, listAdminMemories } from '../../../../lib/admin-memory/store'
import type { AdminMemoryKind, AdminMemoryStatus } from '../../../../lib/admin-memory/types'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const db = (env as unknown as Env).DB
  const kind = url.searchParams.get('kind') as AdminMemoryKind | null
  const status = url.searchParams.get('status') as AdminMemoryStatus | null
  const memories = await listAdminMemories(db, {
    kind: kind ?? undefined,
    status: status ?? 'active',
    limit: Number(url.searchParams.get('limit') ?? 50),
  })
  return json({ memories })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as Record<string, unknown>

  if (!isString(body.kind) || !isString(body.title) || !isString(body.content)) {
    return json({ error: 'kind, title, and content are required' }, 400)
  }

  const memory = await createAdminMemory(db, {
    kind: body.kind as AdminMemoryKind,
    title: body.title,
    content: body.content,
    tags: Array.isArray(body.tags) ? body.tags.filter(isString) : [],
    metadata: isRecord(body.metadata) ? body.metadata : {},
    createdBy: 'admin',
  })

  return json({ memory }, 201)
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
```

- [ ] **Step 2: Create update/archive endpoint**

Create `src/pages/api/admin/memory/[id].ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../../lib/auth/session'
import { getAdminMemory, updateAdminMemory } from '../../../../../lib/admin-memory/store'
import type { AdminMemoryStatus } from '../../../../../lib/admin-memory/types'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'id is required' }, 400)
  const memory = await getAdminMemory((env as unknown as Env).DB, id)
  return memory ? json({ memory }) : json({ error: 'not found' }, 404)
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'id is required' }, 400)

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const memory = await updateAdminMemory((env as unknown as Env).DB, id, {
    title: isString(body.title) ? body.title : undefined,
    content: isString(body.content) ? body.content : undefined,
    status: isStatus(body.status) ? body.status : undefined,
    tags: Array.isArray(body.tags) ? body.tags.filter(isString) : undefined,
    metadata: isRecord(body.metadata) ? body.metadata : undefined,
    reason: isString(body.reason) ? body.reason : undefined,
    updatedBy: 'admin',
  })

  return json({ memory })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStatus(value: unknown): value is AdminMemoryStatus {
  return value === 'active' || value === 'archived' || value === 'rejected'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
```

- [ ] **Step 3: Create events endpoint**

Create `src/pages/api/admin/memory/[id]/events.ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../../../lib/auth/session'
import { listMemoryEvents } from '../../../../../../lib/admin-memory/store'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'id is required' }, 400)
  const events = await listMemoryEvents((env as unknown as Env).DB, id)
  return json({ events })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

- [ ] **Step 4: Run type check**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: no errors in `src/pages/api/admin/memory/`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/api/admin/memory src/lib/admin-memory
git commit
```

---

## Task 6: Add admin memory UI

**Files:**

- Create: `src/pages/admin/memory.astro`
- Modify: `src/layouts/AdminLayout.astro`

- [ ] **Step 1: Inspect admin layout navigation**

Run:

```bash
grep -n "content-pipelines\|admin-nav\|href=\"/admin" src/layouts/AdminLayout.astro src/pages/admin/*.astro
```

Expected: output showing where existing admin navigation links are defined.

- [ ] **Step 2: Create memory page**

Create `src/pages/admin/memory.astro`:

```astro
---
export const prerender = false;
import AdminLayout from '../../layouts/AdminLayout.astro';
---

<AdminLayout title="Admin Memory">
  <p class="page-desc">站長端 episodic memory：寫作偏好、常用範本、近期任務脈絡與手動修正。</p>

  <section class="admin-panel">
    <h2>Add Memory</h2>
    <form id="memory-form" class="memory-form">
      <label>
        Type
        <select name="kind">
          <option value="preference">Writing preference</option>
          <option value="template">Reusable template</option>
          <option value="task_context">Recent task context</option>
          <option value="correction">Manual correction</option>
        </select>
      </label>
      <label>
        Title
        <input name="title" required placeholder="Short paragraphs" />
      </label>
      <label>
        Content
        <textarea name="content" required rows="5" placeholder="Prefer short paragraphs with one idea each."></textarea>
      </label>
      <label>
        Tags
        <input name="tags" placeholder="style, posts" />
      </label>
      <button type="submit">Save memory</button>
    </form>
  </section>

  <section class="admin-panel">
    <div class="panel-title">
      <h2>Active Memories</h2>
      <button id="refresh" type="button">Refresh</button>
    </div>
    <div id="memory-list">Loading...</div>
  </section>

  <section class="admin-panel">
    <h2>Events</h2>
    <pre id="events-output">Select a memory to view events.</pre>
  </section>
</AdminLayout>

<script is:inline>
  const form = document.getElementById('memory-form');
  const list = document.getElementById('memory-list');
  const refresh = document.getElementById('refresh');
  const eventsOutput = document.getElementById('events-output');

  async function loadMemories() {
    const res = await fetch('/api/admin/memory');
    if (!res.ok) {
      list.textContent = 'Unable to load memory.';
      return;
    }
    const data = await res.json();
    renderMemories(data.memories ?? []);
  }

  function renderMemories(memories) {
    list.replaceChildren();
    if (!memories.length) {
      list.textContent = 'No active memories.';
      return;
    }

    for (const memory of memories) {
      const card = document.createElement('article');
      card.className = 'memory-card';

      const title = document.createElement('h3');
      title.textContent = memory.title;

      const meta = document.createElement('div');
      meta.className = 'memory-meta';
      meta.textContent = `${memory.kind} · ${memory.confidence} · ${memory.tags.join(', ') || 'no tags'}`;

      const content = document.createElement('p');
      content.textContent = memory.content;

      const actions = document.createElement('div');
      actions.className = 'memory-actions';

      const events = document.createElement('button');
      events.type = 'button';
      events.textContent = 'Events';
      events.addEventListener('click', () => loadEvents(memory.id));

      const archive = document.createElement('button');
      archive.type = 'button';
      archive.textContent = 'Archive';
      archive.addEventListener('click', () => archiveMemory(memory.id));

      actions.append(events, archive);
      card.append(title, meta, content, actions);
      list.append(card);
    }
  }

  async function loadEvents(id) {
    const res = await fetch(`/api/admin/memory/${encodeURIComponent(id)}/events`);
    const data = await res.json();
    eventsOutput.textContent = JSON.stringify(data, null, 2);
  }

  async function archiveMemory(id) {
    const res = await fetch(`/api/admin/memory/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'archived', reason: 'Archived from admin memory UI' }),
    });
    if (!res.ok) {
      eventsOutput.textContent = JSON.stringify(await res.json(), null, 2);
      return;
    }
    await loadMemories();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const tags = String(data.get('tags') || '').split(',').map(tag => tag.trim()).filter(Boolean);
    const res = await fetch('/api/admin/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: data.get('kind'),
        title: data.get('title'),
        content: data.get('content'),
        tags,
      }),
    });
    eventsOutput.textContent = JSON.stringify(await res.json(), null, 2);
    form.reset();
    await loadMemories();
  });

  refresh.addEventListener('click', loadMemories);
  loadMemories();
</script>

<style>
  .page-desc {
    color: var(--admin-text-muted, #888);
    margin-bottom: 1.5rem;
  }

  .admin-panel {
    border: 1px solid var(--admin-border, #2a2a2a);
    border-radius: 8px;
    padding: 1.25rem;
    margin: 1rem 0;
    background: var(--admin-surface, #1a1a1a);
  }

  .panel-title,
  .memory-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .memory-form {
    display: grid;
    gap: 1rem;
    max-width: 720px;
  }

  .memory-form label {
    display: grid;
    gap: 0.35rem;
  }

  .memory-form input,
  .memory-form select,
  .memory-form textarea {
    border: 1px solid var(--admin-border, #2a2a2a);
    border-radius: 6px;
    padding: 0.65rem;
    color: var(--admin-text, #f2f2f2);
    background: var(--admin-bg, #0f0f0f);
  }

  .memory-card {
    border: 1px solid var(--admin-border, #2a2a2a);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: var(--admin-bg, #0f0f0f);
  }

  .memory-card h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  .memory-meta {
    color: var(--admin-text-muted, #888);
    font-size: 0.85rem;
  }

  #events-output {
    overflow: auto;
    max-height: 360px;
  }
</style>
```

- [ ] **Step 3: Add nav link**

If `src/layouts/AdminLayout.astro` contains the admin navigation, add this link beside the other admin links:

```astro
<a href="/admin/memory">Memory</a>
```

If navigation is in a different admin component found in Step 1, add the same link there.

- [ ] **Step 4: Run Astro check**

Run:

```bash
pnpm exec astro check
```

Expected: no errors from `src/pages/admin/memory.astro`.

- [ ] **Step 5: Manual UI smoke test**

Run:

```bash
pnpm dev
```

Open `/admin/memory` in a browser while authenticated. Verify:

1. Page loads.
2. Creating a preference adds a card.
3. Events button shows a `created` event.
4. Archive removes the card from active list.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/memory.astro src/layouts/AdminLayout.astro
git commit
```

---

## Task 7: Integrate memory pack with content pipelines

**Files:**

- Modify: `src/lib/pipelines/context-builder.ts`
- Modify: `src/lib/pipelines/types.ts`
- Test: existing or new context builder test, depending on current test layout

- [ ] **Step 1: Inspect context builder shape**

Run:

```bash
grep -n "interface\|type\|function\|build" src/lib/pipelines/context-builder.ts src/lib/pipelines/types.ts
```

Expected: output showing the context object returned to pipeline stages.

- [ ] **Step 2: Add memory pack to pipeline context type**

If `src/lib/pipelines/types.ts` owns the pipeline context type, add:

```ts
import type { AdminMemoryPack } from '../admin-memory/types'

export interface PipelineContext {
  memoryPack?: AdminMemoryPack
}
```

If a context type already exists, add only this property to the existing interface:

```ts
memoryPack?: AdminMemoryPack
```

- [ ] **Step 3: Load memory pack in context builder**

In `src/lib/pipelines/context-builder.ts`, import the builder:

```ts
import { buildAdminMemoryPack } from '../admin-memory/context'
```

Then add the memory pack only when a pipeline explicitly opts in through input:

```ts
const includeAdminMemory = input.includeAdminMemory === true
const memoryPack = includeAdminMemory ? await buildAdminMemoryPack(db) : undefined
```

Return `memoryPack` on the context object passed to stages. Keep the opt-in explicit so existing pipelines do not change behavior.

- [ ] **Step 4: Add pipeline input where useful**

For content-writing pipelines in `src/lib/pipelines/registry.ts`, add an optional boolean input:

```ts
{
  id: 'includeAdminMemory',
  label: 'Include admin writing memory',
  type: 'boolean',
  required: false,
  defaultValue: false,
}
```

Do not add this input to non-writing maintenance pipelines such as deterministic content ops unless the pipeline uses writing style or templates.

- [ ] **Step 5: Run targeted tests**

Run:

```bash
pnpm test src/lib/admin-memory/context.test.ts src/lib/admin-memory/store.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run lint**

Run:

```bash
pnpm lint
```

Expected: no new warnings from the modified pipeline files. Existing unrelated warnings may still appear.

- [ ] **Step 7: Commit**

```bash
git add src/lib/pipelines/context-builder.ts src/lib/pipelines/types.ts src/lib/pipelines/registry.ts src/lib/admin-memory
git commit
```

---

## Task 8: Document operating rules

**Files:**

- Modify: `docs/ai-agent-content-system.md`
- Modify: `docs/admin-episodic-memory.md`

- [ ] **Step 1: Add architecture note to Content Agent Harness doc**

Append this section to `docs/ai-agent-content-system.md`:

```markdown
## Admin Episodic Memory

Content pipelines may optionally include a bounded admin memory pack. The pack contains confirmed writing preferences, reusable templates, recent task context, and manual corrections from `admin_memories`.

Rules:

- Memory is admin-only and never public user personalization.
- Pipelines must opt in with `includeAdminMemory`.
- Memory can shape drafts, summaries, and review reports, but it must not directly overwrite Markdown source files.
- Pipeline-suggested memories start as `suggested` and require manual confirmation before use.
- Manual corrections take precedence over older conflicting preferences.
```

- [ ] **Step 2: Add post-implementation status note to this plan**

After implementation, update this file’s header status line:

```markdown
> Status: Implemented in D1/admin UI; pending production migration verification.
```

Use the exact status that matches verification evidence.

- [ ] **Step 3: Commit**

```bash
git add docs/ai-agent-content-system.md docs/admin-episodic-memory.md
git commit
```

---

## Verification checklist

Run these before declaring implementation complete:

```bash
pnpm test src/lib/admin-memory/store.test.ts src/lib/admin-memory/context.test.ts
pnpm lint
pnpm exec astro check
pnpm build
```

Expected:

- Admin memory tests pass.
- No new lint warnings from new or modified memory files.
- Astro check does not report errors in memory routes/pages.
- Build succeeds.
- If existing unrelated warnings or errors remain, list exact files and messages in the handoff.

Manual browser verification:

```text
/admin/memory
  -> create preference
  -> create template
  -> view events
  -> archive memory
  -> refresh and confirm archived item is hidden from active list
```

Pipeline verification:

```text
/admin/content-pipelines
  -> run a writing pipeline with includeAdminMemory disabled
  -> confirm output is unchanged from current behavior
  -> run the same pipeline with includeAdminMemory enabled
  -> confirm job artifacts or stage logs show memory pack was included
```

## Rollback plan

- Revert code files from `src/lib/admin-memory/`, `src/pages/api/admin/memory/`, and `src/pages/admin/memory.astro`.
- Remove the admin navigation link.
- Disable pipeline memory opt-in by removing `includeAdminMemory` inputs from `src/lib/pipelines/registry.ts`.
- Leave the D1 migration in place if already applied; archive all rows with:

```sql
UPDATE admin_memories SET status = 'archived', updated_at = datetime('now');
```

This preserves audit history and avoids destructive data loss.

## Self-review

- Spec coverage: Preferences, templates, recent task context, and manual correction are covered by the `kind` model, admin UI, API, D1 tables, event trail, and context builder.
- Placeholder scan: The plan avoids open-ended placeholders and gives concrete file paths, SQL, TypeScript, Astro UI, commands, and expected results.
- Type consistency: `AdminMemoryKind`, `AdminMemoryStatus`, `AdminMemorySource`, `AdminMemoryConfidence`, and `AdminMemoryPack` are used consistently across store, context, API, and pipeline integration tasks.
