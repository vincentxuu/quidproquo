## Context

A grep across `src/pages/api/admin/**`, `src/lib/auth/**`, `src/lib/pipelines/**`, and `src/lib/rag/tools/**` surfaced 10 cross-cutting concerns currently duplicated or scattered:

| # | Concern | Where today | Count |
|---|---|---|---|
| 1 | `interface Env` (Cloudflare bindings) | `src/pages/api/admin/{status,pipelines,settings/index,traces/retention,providers,rag,rag-eval,stats/export,pipelines/scheduled,...}.ts` | 20+ files |
| 2 | `isAdmin(cookies)` helper | inlined in 5+ admin endpoints (e.g. `status.ts`, `settings/index.ts`) | 5+ |
| 3 | `json(data, status?)` / `unauthorized()` response wrappers | 6+ endpoints | 6+ |
| 4 | `ensureSettingsTable()` + inline `CREATE TABLE IF NOT EXISTS admin_settings` | `providers.ts`, `settings/index.ts` and one variant for `settings` table | 3 |
| 5 | Inline `CREATE TABLE IF NOT EXISTS` for non-settings tables (`providers`, `agent_skills`, `deep_research_*`, `rag_*`) | 6 admin endpoints | 6 |
| 6 | Two parallel tool registries — pipeline-only `src/lib/pipelines/tool-registry.ts` and direct-import RAG tools in `src/lib/rag/tools/*` | split | 2 layers |
| 7 | Session-OR-`X-Crawl-Secret` auth pattern | only in `pages/api/admin/pipelines/scheduled.ts` | 1 (but `agent-os` will need it) |
| 8 | Feature-flag mechanism | none — `wrangler.jsonc` only declares `LLM_PROVIDER`; no central reader | 0 |
| 9 | Date / ISO8601 helpers (`new Date().toISOString().split('T')[0]`, `datetime('now')`, midnight TTL math) | 8+ files | 8+ |
| 10 | Settings keys (`CATALOG_KEY`, `PROVIDER_KEY_PREFIX`, `AGENT_SKILLS_LIBRARY_KEY`, `RETENTION_KEYS`) | scattered across `providers.ts`, `agent-skills/index.ts`, `traces/retention.ts` | 4 modules |

`agent-os` (change #1) will add 6 kernel modules + 7 D1 tables and consume every one of these surfaces. Without consolidation it would either (a) import from each scattered location — locking the kernel to today's bad shape — or (b) introduce a third parallel pattern — worsening duplication. Both are wrong.

**Stakeholders.** Solo developer. Surfaces touched: every admin endpoint (~20 files), the pipeline runner, the RAG agent set, and the cron triggers. Every downstream `agent-*` change reuses these modules.

**Constraints.**
1. **Zero behavior change** — every existing endpoint, test, and feature returns the same responses after merge; only file locations and import paths shift, plus a settings-reconciliation migration.
2. **Reversible** — every step is gated by either (a) a feature-flag default-off, (b) an import alias, or (c) a migration with documented rollback SQL.
3. **Preserve all rows** — the settings consolidation migration must reconcile two divergent table schemas (`settings` vs `admin_settings`) without dropping data; row-count assertions in the migration.
4. **Bounded blast radius** — the inline-`CREATE TABLE` audit is documentation-only in this change; actual migration work is deferred to keep merge-conflict risk manageable.

## Goals / Non-Goals

**Goals**
- Central `Env` type at `src/lib/config/env.ts` covering all current + reserved Cloudflare bindings; remove 20+ local re-declarations
- Feature-flag module at `src/lib/config/flags.ts` (env-var-backed, structured object) ready for `agent-os` to register entries
- Shared MCP-compatible tool registry at `src/lib/tools/{registry,types,cost}.ts`; pipeline-registry becomes an adapter
- Move `external-search` and `get-post-detail` to `src/lib/tools/definitions/`; keep RAG-specific tools in place
- Admin auth helper `requireAdmin(cookies)` extracted to `src/lib/auth/admin.ts`
- Scheduled (cron) auth helper extracted to `src/lib/auth/scheduled-auth.ts`
- JSON response helpers (`json`, `unauthorized`, `forbidden`, `badRequest`) at `src/lib/api/response.ts`
- Date / ISO8601 utilities at `src/lib/utils/dates.ts`
- Settings-store consolidation: single canonical `admin_settings` table + typed `src/lib/db/settings-store.ts`; migration `0010_admin_settings_consolidation.sql`
- Schema audit document at `docs/schema-audit.md` listing every inline-`CREATE TABLE` with recommendation

**Non-Goals** (per proposal §"Out of Scope")
- Migrating inline-created tables (`providers`, `agent_skills`, `deep_research_*`, etc.) into proper migrations — audit only
- Provider secret resolver refactor — deferred to `agent-providers`
- Cron schedule metadata centralization — deferred to `agent-os` scheduler
- KV rate-limit helper extraction — already adequate in `src/lib/auth/rate-limit.ts`
- Moving `src/lib/rag/agents/*`, `src/lib/rag/graph.ts`, or `state.ts` — RAG-specific, kernel migration handles those imports later
- D1-backed feature-flag runtime overrides — env vars + redeploy are sufficient at solo-dev scale

## Decisions

### D1: Single `Env` type at `src/lib/config/env.ts`

**Decision.** Create one `Env` interface declaring every current and reserved Cloudflare binding. Every endpoint and library imports from this file; per-module local re-declarations are removed.

```typescript
// src/lib/config/env.ts
export interface Env {
  DB: D1Database
  SESSION: KVNamespace
  RATE: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
  VECTORIZE_INDEX: VectorizeIndex
  AI: Ai
  R2_IMAGES: R2Bucket
  CRAWL_SECRET?: string
  ADMIN_PASSWORD?: string
  LLM_PROVIDER?: string
  // Reserved for agent-os (default undefined until that change lands)
  AGENT_QUEUE?: Queue
  R2_AGENT_MEMORY?: R2Bucket
}

// Convenience accessor that hides the `env as unknown as Env` dance
import { env as workerEnv } from 'cloudflare:workers'
export function getEnv(): Env {
  return workerEnv as unknown as Env
}
```

**Alternatives considered.**
- *Keep per-module narrow `Env` types* — rejected: 20+ files drift independently; adding a new binding requires editing every file
- *Generate `Env` from `wrangler.jsonc`* — rejected: build-time codegen adds a script + a stale-output risk; `wrangler.jsonc` is small enough that manual sync is fine
- *Cloudflare's auto-generated `worker-configuration.d.ts`* — rejected: that file is regenerated by wrangler and includes only declared bindings; reserved-but-not-yet-bound entries (e.g. `AGENT_QUEUE`) would not appear, defeating the "future-proof" point

**Rationale.** Single source of truth eliminates drift. Reserved-binding fields are optional so the type compiles before `agent-os` adds those bindings to wrangler. `getEnv()` hides the `as unknown as` cast — every caller becomes one line.

### D2: Feature-flag module — env-var-backed, structured object, no D1 overrides in v1

**Decision.** `src/lib/config/flags.ts` exports a single `flags` object built from `cloudflare:workers` env vars. `agent-foundation` ships the reader; first entries are added by `agent-os`.

```typescript
// src/lib/config/flags.ts
import { getEnv } from './env'

function boolEnv(name: string, fallback: boolean): boolean {
  const raw = (getEnv() as unknown as Record<string, unknown>)[name]
  if (typeof raw === 'boolean') return raw
  if (typeof raw === 'string') return raw === 'true' || raw === '1'
  return fallback
}

export const flags = {
  // populated by downstream changes; foundation only ships the module
} as const

export const flagsInternal = { boolEnv } // exposed for downstream registration files
```

`agent-os` will add the `agentOs.*` block; `agent-providers` will add `agentProviders.*`; etc. Each change owns its own flag namespace.

**Alternatives considered.**
- *Flat string keys (e.g. `isFlagEnabled('agentOs.enabled')`)* — rejected: loses TypeScript autocomplete; typo-prone
- *D1-backed runtime overrides* — rejected for v1: solo-developer, env-var-plus-redeploy is fast enough; adds a table, an admin endpoint, and a cache-invalidation story for no observed need
- *Per-flag separate files* — rejected: hurts discoverability; a single object is one open-file-to-see-everything

**Rationale.** Object shape preserves autocomplete and groups related flags. `boolEnv` is the single parser so flag-string semantics ("true" / "1" / boolean) stay consistent. Deferring D1 overrides matches "feature flags are mandatory; runtime control is not".

### D3: Central tool registry — MCP-compatible primary, pipeline shape as adapter

**Decision.** The central registry stores MCP-compatible `ToolDefinition` records (name, description, JSON Schema for input/output, optional `costModel`). The existing pipeline-registry shape `{id, title, kind, runtime, description, ...}` is preserved by re-exporting an adapter view:

```typescript
// src/lib/tools/types.ts
import type { JSONSchema7 } from 'json-schema'
import type { CostModel } from './cost'

export interface ToolDefinition<TIn = unknown, TOut = unknown> {
  name: string                      // e.g. "search.external", "post.get-detail"
  description: string
  inputSchema: JSONSchema7
  outputSchema: JSONSchema7
  handler: (input: TIn) => Promise<TOut>
  costModel?: CostModel
  // Pipeline-registry metadata (kept for backward compat; pipeline adapter reads these)
  pipeline?: {
    id: string                      // legacy "snake_case" id
    title: string                   // human-facing label
    kind: 'cloud_read' | 'cloud_write' | 'module' | 'api' | 'artifact'
    runtime: 'worker' | 'node' | 'both'
    writesMarkdown?: boolean
    overwritesExisting?: boolean
    requiresExternalAccess?: boolean
  }
}
```

```typescript
// src/lib/pipelines/tool-registry.ts (becomes an adapter)
import { listTools as listCentral } from '../tools/registry'
import type { ToolDefinition as PipelineToolDefinition } from './types'

export function listTools(): PipelineToolDefinition[] {
  return listCentral()
    .filter((t) => t.pipeline)
    .map((t) => ({ id: t.pipeline!.id, title: t.pipeline!.title, ...t.pipeline! }))
}
```

**Alternatives considered.**
- *Keep pipeline shape primary, MCP as adapter view* — rejected: pipeline registry was a stopgap for the pipeline runner only; new convention is MCP because `agent-os`, external MCP servers, and Anthropic's tool-use API all assume that shape
- *Maintain both registries independently* — rejected: defeats the consolidation goal; tools added to one will silently miss the other
- *Drop pipeline shape entirely* — rejected: pipeline runner still uses `kind` and `runtime` for guard checks; preserving those fields under `pipeline.*` is cheap

**Rationale.** MCP is the industry contract for tool definitions; pipeline shape was an internal stopgap. Making MCP primary and pipeline a derived view means new tools follow the new convention while pipeline guard checks keep working unchanged.

### D4: `CostModel` at `src/lib/tools/cost.ts`, not under `tools/types.ts`

**Decision.** Place the discriminated union at its own path so non-tool consumers (observability dashboards, settings UI, kernel telemetry) can depend on it without pulling in the registry types graph.

```typescript
// src/lib/tools/cost.ts
export type CostModel =
  | { kind: 'token'; inputPerKToken: number; outputPerKToken: number }
  | { kind: 'request'; perCallUsd: number }
  | { kind: 'custom'; estimate: (input: unknown, output: unknown) => number }

export function computeCost(
  model: CostModel | undefined,
  metrics: { tokensIn?: number; tokensOut?: number; input?: unknown; output?: unknown }
): number {
  if (!model) return 0
  switch (model.kind) {
    case 'token': return ((metrics.tokensIn ?? 0) / 1000) * model.inputPerKToken
                       + ((metrics.tokensOut ?? 0) / 1000) * model.outputPerKToken
    case 'request': return model.perCallUsd
    case 'custom': return model.estimate(metrics.input, metrics.output)
  }
}
```

**Alternatives considered.**
- *Inline `CostModel` into `tools/types.ts`* — rejected: forces dashboard code to depend on JSONSchema + handler types; circular-import risk once kernel telemetry consumes both
- *Defer to `agent-providers`* — rejected: `agent-os` Decision D12 already commits to writing `cost_usd`; the type has to land here

**Rationale.** Splitting keeps the dependency graph shallow; `cost.ts` has zero dependencies. `computeCost` is the only function the kernel needs to call; no provider math leaks into agent code.

### D5: Tool move policy — what moves, what stays

**Decision.** A tool moves to `src/lib/tools/definitions/` only if it is cross-cutting (used by both pipelines and RAG, or planned to be used by `agent-os`). RAG-specific retrieval over our own indexes stays in `src/lib/rag/tools/`.

| Tool | Current path | Move? | Reason |
|---|---|---|---|
| `external-search` | `src/lib/rag/tools/external-search.ts` | **move** → `src/lib/tools/definitions/external-search.ts` | Generic web search; `agent-os.research` will reuse |
| `get-post-detail` | `src/lib/rag/tools/get-post-detail.ts` | **move** → `src/lib/tools/definitions/get-post-detail.ts` | Reads `posts` table; useful to any agent |
| `hybrid-search` | `src/lib/rag/tools/hybrid-search.ts` | stay | Utility composition over RAG retrieval; not a standalone tool |
| `search-abstract-index` | `src/lib/rag/tools/search-abstract-index.ts` | stay | RAG-specific abstract index |
| `search-docs` | `src/lib/rag/tools/search-docs.ts` | stay | RAG-specific doc chunks |
| `search-posts` | `src/lib/rag/tools/search-posts.ts` | stay | RAG-specific post chunks |
| `pageindex` | `src/lib/rag/tools/pageindex.ts` | stay | RAG-specific pageindex |

**Move criterion (canonical).** A tool moves if **both** are true:
1. Its inputs/outputs do not reference RAG-specific types (`SearchResult`, `Chunk`, `Doc`)
2. At least one non-RAG caller already exists or is planned in an `agent-*` proposal

**Alternatives considered.**
- *Move all RAG tools* — rejected: they depend on RAG state types; moving creates a tangled import that flips the dependency direction
- *Move nothing in this change* — rejected: leaves the central registry empty on day 1; downstream changes would have nothing to point at

**Rationale.** Two clear movers, five clear stays — boundary is explicit. The criterion lets future tools self-classify.

### D6: Settings consolidation — `admin_settings` is canonical; reconcile `settings` table; idempotent migration

**Decision.** Migration `0010_admin_settings_consolidation.sql` reconciles the two table names into one canonical `admin_settings` table. The migration is idempotent (safe to re-run) and reversible (down-SQL committed alongside).

```sql
-- 0010_admin_settings_consolidation.sql

-- Canonical table (matches existing admin_settings shape used by settings/index.ts)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Migrate any rows from the legacy `settings` table if it exists; preserve on conflict
INSERT OR IGNORE INTO admin_settings (key, value, updated_at)
SELECT key, value, COALESCE(updated_at, datetime('now'))
FROM settings
WHERE EXISTS (SELECT name FROM sqlite_master WHERE type='table' AND name='settings');

-- Row-count assertion: post-migration admin_settings must have >= count(settings) + count(admin_settings_pre)
-- (recorded in docs/schema-audit.md; verified manually before drop)

-- Drop legacy table only after manual verification — left commented; second migration removes it
-- DROP TABLE IF EXISTS settings;
```

The legacy `settings` table is **not dropped** in this migration. A follow-up `0010b` migration drops it after a one-week soak period in production. This separates "migrate data" from "destroy data" — two migrations, two rollback boundaries.

**Alternatives considered.**
- *Single migration that also drops `settings`* — rejected: irreversible step coupled to a data move; if a row was missed, the only recovery is a D1 backup restore
- *Rename `admin_settings` to `settings`* — rejected: `admin_settings` is the more accurate name (admin-only writes) and the existing `settings/index.ts` already uses it; renaming the canonical table touches more code than the alternative
- *Wait until `agent-os` to consolidate* — rejected: `agent-os` adds 7 tables; bundling makes its migration much riskier

**Rationale.** `INSERT OR IGNORE` makes the data move idempotent; the dynamic existence check (`WHERE EXISTS ...`) makes the migration safe on fresh databases that never had a `settings` table. Splitting the drop into a follow-up migration preserves a rollback window.

### D7: `requireAdmin` signature — returns a discriminated union, not throwing

**Decision.** `requireAdmin(cookies): Promise<{ ok: true } | { ok: false; response: Response }>`. Callers branch on `ok` and return `auth.response` on failure. The success branch intentionally does **not** include `userId` in this change because today's `verifySession(token): Promise<boolean>` does not expose a user identity.

```typescript
// src/lib/auth/admin.ts
import type { APIContext } from 'astro'
import { verifySession } from './session'
import { unauthorized } from '../api/response'

export async function requireAdmin(
  cookies: APIContext['cookies']
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const token = cookies.get('session')?.value
  if (token && (await verifySession(token))) return { ok: true }
  return { ok: false, response: unauthorized() }
}
```

Usage:
```typescript
const auth = await requireAdmin(cookies)
if (!auth.ok) return auth.response
// ... handler continues
```

**Alternatives considered.**
- *Throw a custom `UnauthorizedError`* — rejected: would force every admin route to wrap in `try/catch` purely for control flow; idiomatic Astro returns `Response`
- *`requireAdmin(cookies): Promise<boolean>` plus separate `unauthorized()` call* — rejected: callers re-implement the early-return; current duplication shows this pattern is forgotten
- *Return only `Response | null`* — rejected: `null` carries no type info; `{ ok: true }` leaves room to extend with `userId` when sessions become per-user (currently `verifySession` returns boolean only)
- *Return `{ ok: true; userId: string }` immediately* — rejected for this change: adding user identity would force a behavior-bearing session refactor into a foundation change that is supposed to remain behavior-neutral.

**Rationale.** A pure discriminated union lets callers do one branch and early-return the exact shared 401 response; the type system enforces the failure branch without relying on `instanceof Response` across runtimes.

### D8: `requireScheduledAuth` returns `'admin' | 'cron' | null`

**Decision.** Match the existing `PipelineRequestSource` shape from `pipelines/scheduled.ts` so the existing endpoint can switch to the helper with zero call-site changes.

```typescript
// src/lib/auth/scheduled-auth.ts
import type { APIContext } from 'astro'
import { verifySession } from './session'
import { getEnv } from '../config/env'

export type ScheduledSource = 'admin' | 'cron'

export async function requireScheduledAuth(
  cookies: APIContext['cookies'],
  request: Request
): Promise<ScheduledSource | null> {
  const token = cookies.get('session')?.value
  if (token && (await verifySession(token))) return 'admin'

  const secret = getEnv().CRAWL_SECRET
  if (!secret) return null

  const provided = request.headers.get('X-Crawl-Secret')
  return provided === secret ? 'cron' : null
}
```

**Alternatives considered.**
- *Return a `Response` like `requireAdmin`* — rejected: callers need to distinguish admin from cron for downstream `requestedBy` strings; a `Response` collapses that information
- *Two separate functions (`isAdmin` + `isCron`)* — rejected: the OR semantic ("either gate") is the whole point; splitting forces every caller to re-implement the OR

**Rationale.** Mirrors the existing `PipelineRequestSource` exactly; the existing `scheduled.ts` becomes a 3-line handler that calls the helper, branches on `null`, and uses the returned source string.

### D9: Response helpers — minimal `json(data, status?)`, no typed wrappers

**Decision.** `src/lib/api/response.ts` exports `json`, `unauthorized`, `forbidden`, `badRequest`, `notFound`, `serverError`. No `successResponse<T>` / `errorResponse<E>` generic wrappers.

```typescript
// src/lib/api/response.ts
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
export const unauthorized = () => json({ error: 'unauthorized' }, 401)
export const forbidden = () => json({ error: 'forbidden' }, 403)
export const badRequest = (message: string) => json({ error: message }, 400)
export const notFound = (resource = 'resource') => json({ error: `${resource} not found` }, 404)
export const serverError = (message = 'internal error') => json({ error: message }, 500)
```

**Alternatives considered.**
- *Typed `successResponse<T>(data: T)` + `errorResponse(code, message)`* — rejected: would force a discriminated response envelope (`{ ok, data }` vs `{ ok, error }`) that the existing endpoints do not use; behavior-change, not refactor
- *Hono-style `c.json()`* — rejected: requires adopting a framework; out of scope
- *`Response.json()` (web standard)* — rejected: not available in the Workers runtime version pinned in `wrangler.jsonc`; checked compatibility in the audit

**Rationale.** Match exactly what every existing endpoint does today, so call-site diffs are import-only. Generic wrappers can come later if a typed-response convention emerges.

### D10: Date utilities — exactly five functions, no library

**Decision.** `src/lib/utils/dates.ts` exports five functions covering 100% of observed ad-hoc usages. No date library (no date-fns, no dayjs).

```typescript
// src/lib/utils/dates.ts
export function nowMs(): number { return Date.now() }
export function nowIso(): string { return new Date().toISOString() }
export function toIsoDay(date: Date | number = nowMs()): string {
  const d = typeof date === 'number' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}
export function toIsoDate(date: Date | number = nowMs()): string {
  return (typeof date === 'number' ? new Date(date) : date).toISOString()
}
export function secondsUntilMidnight(now: Date | number = nowMs()): number {
  const d = typeof now === 'number' ? new Date(now) : now
  const tomorrow = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))
  return Math.floor((tomorrow.getTime() - d.getTime()) / 1000)
}
```

**Alternatives considered.**
- *Adopt date-fns* — rejected: 50KB+ bundle for five one-liners; Workers bundle size matters
- *Inline everywhere* — current state; this is what we are removing
- *Class-based (e.g. `Clock.now()`)* — rejected: function exports are simpler; mockability is achieved via vitest module mocks

**Rationale.** Five functions cover every ad-hoc usage found in the grep. `nowMs` and `nowIso` wrap `Date.now()` / `new Date().toISOString()` specifically for **test mockability** (vitest can mock module exports but cannot easily mock `Date.now()` globally without polluting other tests).

### D11: Schema audit — `docs/schema-audit.md` documents only; no migrations

**Decision.** Produce a markdown document with one section per inline-created table. Each section follows a fixed format:

```markdown
## Table: providers

**Created in:** `src/pages/api/admin/providers.ts:ensureProvidersTable()`
**Columns (current):** id TEXT PK, label TEXT, base_url TEXT, ...
**Used by:** `providers.ts`, `providers/sync/[provider].ts`
**Recommendation:** Migrate to `migrations/00XX_providers.sql` as part of `agent-providers` change
**Owner of next migration:** `agent-providers` change
**Risk if left as-is:** schema drift between local dev (no inline table) and prod (table exists from first write)
```

The audit covers (from grep): `providers`, `agent_skills_library_entries`, `agent_skills_library`, `deep_research_*` tables (when created outside `0009`), and any `rag_*` tables created inline.

**Explicit boundary.** This change writes the document; it does **not** write any migration for these tables. Each table's migration is owned by the corresponding follow-up change.

**Alternatives considered.**
- *Migrate all inline tables now* — rejected: would balloon this change to 10+ migrations and 30+ touched files; "zero behavior change" is impossible to verify across that surface
- *Skip the audit, fix as discovered* — rejected: drift would persist invisibly; the audit's value is "we have a complete list before any of them break"

**Rationale.** Documenting now prevents future drift without paying the migration cost. The fixed format makes follow-up migration writers' jobs mechanical.

### D12: Test strategy — parity tests for moved code, unit tests for new central modules

**Decision.** Two patterns, matching existing `src/lib/auth/{session,rate-limit}.test.ts`:

1. **Parity tests** for tools that move (`external-search`, `get-post-detail`): vitest test imports both the old path and the new path, calls each on the same fixture input, asserts deep equality. Old path stays as a one-line re-export pointing at the new path so the test compiles; old path is deleted in a follow-up after the soak period.

2. **Unit tests** for new central modules: `requireAdmin` (mock cookies + session KV), `requireScheduledAuth` (mock cookies + env + headers), `json/unauthorized/badRequest` (call + assert status/body), `toIsoDay/secondsUntilMidnight` (deterministic inputs), `computeCost` (each `kind` variant), `boolEnv` (string/boolean/missing).

3. **Settings-store CRUD test**: writes, reads back, asserts; runs against an in-memory D1 mock matching the existing vitest pattern.

**Alternatives considered.**
- *Skip parity tests, trust the type system* — rejected: type system does not catch behavioral drift (e.g. different default arg)
- *End-to-end tests via Miniflare* — rejected: matches `agent-os` Resolution Q5 — no Miniflare in this change; not the established pattern

**Rationale.** Parity tests are cheap insurance for the riskiest piece (moves). Unit tests for new modules establish a baseline; downstream changes extend the suite.

## Risks / Trade-offs

### R1: Settings migration must preserve all rows + reconcile schema divergence
**Risk.** `settings` and `admin_settings` could have overlapping keys with different values; naive `INSERT OR IGNORE` keeps the `admin_settings` value, potentially losing newer data from `settings`.
**Mitigation.** Pre-migration: dump both tables to JSON via `wrangler d1 execute` and diff. If overlapping keys differ, manual reconciliation entry-by-entry. Migration includes row-count assertions in `docs/schema-audit.md`. Local dry-run + production backup before applying.

### R2: Tool move could break direct importers if path-change ripple isn't complete
**Risk.** A file imports `from '../../rag/tools/external-search'` and gets missed in the grep pass; build breaks at deploy.
**Mitigation.** Old paths remain as one-line re-exports until the second wave (D12). `pnpm build` + `pnpm lint` + `pnpm check:references` run on every step. CI catches missed imports before merge.

### R3: Pipeline registry adapter could drop fields if MCP shape isn't strictly a superset
**Risk.** Pipeline guard checks rely on `kind`, `runtime`, `writesMarkdown`, `requiresExternalAccess`. If the adapter forgets a field, pipeline runs that depend on it silently change behavior.
**Mitigation.** Adapter test: load all pipeline definitions, run `validateToolAllowlist` via both old direct-registry and new adapter, assert identical `GuardResult[]` output. Behavior-equivalence is verifiable.

### R4: Touching ~25 files for `Env` consolidation has high merge-conflict risk vs concurrent work
**Risk.** This change runs through many files; any in-flight branch touching admin endpoints will conflict.
**Mitigation.** Land in a single merge window; freeze admin-endpoint work for the duration. Do the `Env` consolidation as the **last** step in the change so its conflict-prone diff sits on top of all other smaller diffs.

### R5: Schema audit could surface tables we don't actually want to migrate
**Risk.** A transient feature-flag table or short-lived prototype table gets flagged for migration, creating make-work.
**Mitigation.** Each audit entry's "Recommendation" field is one of `migrate-now`, `migrate-with-<change>`, or `keep-inline (documented)`. The audit explicitly allows "keep inline" with a one-line justification. **Audit-only boundary** — the audit recommends, it does not bind.

### R6: Hidden import paths via barrel files or re-exports may go untouched
**Risk.** A module re-exports from `rag/tools/index.ts` (if it exists) or via a relative path that the grep regex missed.
**Mitigation.** Grep on three patterns: `from.*rag/tools/external-search`, `import.*external-search`, and bare module-name searches. Run TypeScript compile (`astro check`) before merging — unresolved imports fail the build.

## Migration Plan

**Step 1 — Central infrastructure (no existing-file changes).** Create new files only:
- `src/lib/config/{env.ts, flags.ts, settings-keys.ts}`
- `src/lib/tools/{registry.ts, types.ts, cost.ts}` and `src/lib/tools/definitions/` empty directory
- `src/lib/auth/{admin.ts, scheduled-auth.ts}`
- `src/lib/api/response.ts`
- `src/lib/utils/dates.ts`
- `src/lib/db/settings-store.ts`
- Unit tests for each
- **No existing endpoints touched** — verifies new modules in isolation

**Rollback.** Delete the new files.

**Step 2 — Migrate callers per concern, smallest blast radius first.** Order:
1. `requireAdmin` adoption (5 endpoints) — smallest, single import + 4-line diff per file
2. `json` / `unauthorized` adoption (6 endpoints) — single import + remove local helpers
3. Date utilities adoption (8 files) — single import + replace ad-hoc usage
4. `requireScheduledAuth` (1 file — `pipelines/scheduled.ts`)
5. Settings-store adoption — `settings/index.ts`, `providers.ts` switch from `ensureSettingsTable()` + raw SQL to `settingsStore.get/set/list`
6. Tool moves — `external-search` and `get-post-detail` move to `src/lib/tools/definitions/`; old paths become re-exports; central registry registers them; pipeline-registry rewritten as adapter
7. **Last:** `Env` consolidation — sweep all 20+ files replacing local interfaces with `import type { Env } from '../config/env'`

**Rollback per step.** Each step is one commit; `git revert <sha>` undoes it. Steps are ordered so reverting step N does not cascade into N+1.

**Step 3 — Settings reconciliation migration.**
1. Local dry-run: apply `0010_admin_settings_consolidation.sql` to local D1; verify row counts
2. Production backup: `wrangler d1 export DB --output backup-pre-0010.sql`
3. Apply: `wrangler d1 migrations apply DB --remote`
4. Verify: row-count assertion + sample read of every consolidated key

**Rollback.** Restore from `backup-pre-0010.sql`. Since the legacy `settings` table is **not** dropped in `0010`, restore is additive — no data destruction occurred.

**Step 4 — Schema audit.** Produce `docs/schema-audit.md`. Pure documentation step; no code or schema changes.

**Rollback.** Delete the file.

**Step 5 — Verification.**
- `pnpm lint`
- `pnpm build` (includes `astro check`)
- `pnpm test` — existing tests pass unchanged; new central-module tests pass
- `pnpm check:references` — internal cross-references unchanged
- Manual smoke: hit every admin endpoint in local dev; verify identical response bodies and status codes vs main branch

**Rollback for the whole change.** Revert the merge commit; restore the D1 backup taken in Step 3. Since every step preserved old paths as re-exports, no downstream code breaks during the revert.

## Open Questions

These must be resolved before `tasks.md` is written. Each has a probe action and a default if the probe is inconclusive.

### Q1: Does `src/lib/auth/session.ts` already export `verifySession`?

**Probed (confirmed by reading the file).** Yes. `session.ts` exports `generateToken`, `hashToken`, `createSession`, `verifySession(token): Promise<boolean>`, `deleteSession`. `verifySession` checks `session:{hash}` in the `SESSION` KV. **`requireAdmin` will compose `verifySession`; no change to `session.ts` needed in this change.** No per-user `userId` exists today — `requireAdmin` returns `{ ok: true }` without a `userId` field. (When sessions become per-user in a future change, add `userId` to the discriminated union without breaking callers.)

### Q2: What's the `CRAWL_SECRET` env var binding pattern today?

**Probed (confirmed by reading `pipelines/scheduled.ts`).** `CRAWL_SECRET` is read via `(env as unknown as Env).CRAWL_SECRET` where `Env` is locally redeclared with `CRAWL_SECRET?: string`. The header name is `X-Crawl-Secret`. **`requireScheduledAuth` uses the same env var name and the same header name — preserves zero-behavior-change.** Add `CRAWL_SECRET?: string` to the central `Env` type.

### Q3: Should the new `admin_settings` table use the existing schema verbatim or normalize key naming?

**Probed (confirmed by reading `settings/index.ts` and `providers.ts`).** Existing `admin_settings` schema is `(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT (datetime('now')))`. Keys observed: `rate_limit_per_minute`, `rag_cache_ttl_seconds`, `pipeline_max_retries`, `deep_research_storage_mode`, `providers:catalog`, `agent_skills:library`, retention keys. **Decision: use the existing schema verbatim.** Key naming normalization (e.g. namespace separator `:` vs `_`) is a behavior change — out of scope. `src/lib/config/settings-keys.ts` collects the existing strings as constants; the keys themselves do not change.

### Q4: Date utility — `nowMs()` vs `Date.now()`? Justify the wrapper.

**Justification (decision logged in D10).** `nowMs()` exists for **vitest mockability**. Vitest can mock module exports via `vi.mock('../utils/dates', () => ({ nowMs: () => 1700000000000 }))` cleanly; mocking `Date.now()` globally requires `vi.useFakeTimers()` which leaks into other tests in the same file. The wrapper is one line and the cost is negligible; the benefit is deterministic time in tests for any module that imports `nowMs`. Same reasoning for `nowIso`. Code that does not need test-time determinism may continue using `Date.now()` directly; the new utilities are not enforced via lint rule in this change.
