# Tasks — agent-foundation

Implementation plan for the agent-foundation change. Zero-behavior-change refactor; 5 phases, ~76 tasks. This is change #0 — every downstream `agent-*` change imports from the modules created here.

## Pre-requisite

(none — this is change #0)

## Invariant: zero behavior change

- Each phase ends with `pnpm lint && pnpm exec astro check && pnpm vitest run` green
- No new env vars set to non-default values (no `wrangler.jsonc` `vars` mutations in this change)
- Existing endpoints respond identically — per-phase curl smoke per migrated endpoint shape (200/401/400/500 status + JSON envelope unchanged)
- Migrations are reversible: every D1 schema mutation in Phase 3 ships with a documented down-migration recipe in the runbook
- Direct file-content reverts forbidden without explicit user confirmation (per repo `CLAUDE.md`)

## Phase 1 — Land new central modules (no movement)

**Goal**: Create every new central file under `src/lib/{config,tools,auth,api,utils,db}/`. Nothing imports from them yet — existing endpoints still hold their local re-declarations. This phase is additive only and reversible by deleting the new files.

**Files touched**: ~13 new, 0 modified
**Verification**: `pnpm tsc --noEmit && pnpm vitest run src/lib/{config,tools,auth,api,utils,db}` green; `grep -r "from '.*/lib/config/env'" src/` returns zero hits (no migrations yet)

### 1.1 Env type

- [x] 1.1.1 Create central `Env` interface covering all current Cloudflare bindings (`DB`, `SESSION`, `RATE`, `DEEP_RESEARCH_KV`, `VECTORIZE_INDEX`, `VECTORIZE_ABSTRACT`, `AI`, `R2_IMAGES`, `CRAWL_SECRET`) plus reserved-for-`agent-os` placeholders (`AGENT_QUEUE?: Queue<unknown>`, `R2_AGENT_MEMORY?: R2Bucket`) marked optional so this change does not require a `wrangler.jsonc` mutation
  - **Files**: `src/lib/config/env.ts` (create)
  - **Pattern**: union of the 30+ local `interface Env { ... }` re-declarations found across `src/pages/api/**/*.ts` and `src/lib/rag/**/*.ts` (see Phase 2.1 caller list); follows the broadest existing example `src/pages/api/admin/status.ts:7-12`
  - **Verify**: `pnpm tsc --noEmit` passes; `grep -c "export interface Env" src/lib/config/env.ts` returns `1`

### 1.2 Feature-flag reader

- [x] 1.2.1 Create typed flag reader skeleton — `flags.ts` exports `readFlags(env: Env): Flags` and `interface Flags {}` (empty for now; `agent-os` populates the `agentOs` sub-object in its Phase 1). Reader pattern: each boolean flag reads `env.<KEY>` and compares strict-equals to `'true'` (Wrangler string vars)
  - **Files**: `src/lib/config/flags.ts` (create)
  - **Pattern**: project rule from `CLAUDE.md` — "Feature flags are mandatory for all advanced/experimental techniques"; sibling helper to `src/lib/config/env.ts`
  - **Verify**: `pnpm tsc --noEmit` passes; `src/lib/config/flags.test.ts` asserts `readFlags({} as Env)` returns `{}` without throwing

### 1.3 Settings key constants

- [x] 1.3.1 Create central key registry collecting every literal currently used as a `settings` / `admin_settings` row key. Required exports: `CATALOG_KEY = 'provider_model_catalog'`, `PROVIDER_KEY_PREFIX = 'provider_key:'`, `AGENT_SKILLS_LIBRARY_KEY = 'agent_skills'`, `LEGACY_AGENT_SKILLS_LIBRARY_KEY = 'deep_research_agent_skills'`, `RETENTION_KEYS` (the 7-tuple from `traces/retention.ts:34-42`), `MANAGED_RAG_KEYS` (the 30-key array from `rag.ts:12-42`), `SETTINGS_DEFAULTS` (defaults map from `settings/index.ts:61-69`)
  - **Files**: `src/lib/config/settings-keys.ts` (create)
  - **Pattern**: `src/pages/api/admin/providers.ts:58` (`CATALOG_KEY`), `src/pages/api/admin/agent-skills/index.ts:11-12`, `src/pages/api/admin/traces/retention.ts:34-42`
  - **Verify**: `src/lib/config/settings-keys.test.ts` asserts the exported `RETENTION_KEYS` tuple deep-equals the literal currently at `traces/retention.ts:34-42`

### 1.4 Cost-model types

- [x] 1.4.1 Create `CostModel` discriminated union (`{ kind: 'token', inputPerKToken: number, outputPerKToken: number } | { kind: 'request', perCallUsd: number } | { kind: 'free' }`) — type-only, no runtime; used by `agent-os` syscall registry and by Phase 2's adapter
  - **Files**: `src/lib/tools/cost.ts` (create)
  - **Pattern**: proposal §"Shared tool registry"; design Resolution Q2 in `agent-os/design.md`
  - **Verify**: `pnpm tsc --noEmit` passes; file is `export type`-only — no runtime exports

### 1.5 Tool registry + types

- [x] 1.5.1 Define `ToolDefinition` MCP-compatible shape (`{ name: string, description: string, inputSchema: JsonSchema, outputSchema?: JsonSchema, cost: CostModel, outboundDomains?: string[], requiresApproval?: boolean }`); re-export `CostModel` from `./cost`. Type-only — `agent-os` ships the `defineSyscall` helper that consumes it
  - **Files**: `src/lib/tools/types.ts` (create)
  - **Pattern**: proposal §"Shared tool registry"; existing legacy shape at `src/lib/pipelines/tool-registry.ts:3-76` (kept for the adapter pattern in 2.9)
  - **Verify**: `pnpm tsc --noEmit` passes; type does not import any runtime symbol
- [x] 1.5.2 Create central registry runtime — `register(def: ToolDefinition): void`, `list(): ToolDefinition[]`, `get(name: string): ToolDefinition | undefined`, `clear(): void` (test helper). Module-scoped `Map<string, ToolDefinition>` keyed by `name`
  - **Files**: `src/lib/tools/registry.ts` (create), `src/lib/tools/definitions/` (create empty directory with `.gitkeep`)
  - **Pattern**: `src/lib/pipelines/tool-registry.ts:78-83` (legacy `listTools`/`getToolDefinition` semantics; new module is the central one, legacy becomes the adapter in 2.9)
  - **Verify**: `src/lib/tools/registry.test.ts` covers register-then-get round-trip, duplicate-name throws, `clear()` empties

### 1.6 Admin auth helper

- [x] 1.6.1 Extract `requireAdmin(cookies): Promise<RequireAdminResult>` to a central module, where `RequireAdminResult = { ok: true } | { ok: false; response: Response }`. Wrap existing `verifySession` from `src/lib/auth/session.ts`; valid sessions return `{ ok: true }`, while missing / invalid sessions return `{ ok: false, response: unauthorized() }`. Do **not** add a throwing variant in this change; all admin endpoints use the same branch-and-return shape. This matches `shared-admin-helpers/spec.md` and the current `verifySession(token): Promise<boolean>` contract, which has no user id.
  - **Files**: `src/lib/auth/admin.ts` (create)
  - **Pattern**: `src/pages/api/admin/status.ts:105-108`, `src/pages/api/admin/pipelines.ts:71-74`, `src/pages/api/admin/settings/index.ts:174-177`, `src/pages/api/admin/agent-skills/index.ts:76-79` (all 29 duplicates listed in 2.2)
  - **Verify**: `src/lib/auth/admin.test.ts` covers (a) no cookie → `{ ok:false, response.status:401 }`, (b) invalid token → `{ ok:false, response.status:401 }`, (c) valid token → `{ ok:true }`; uses `makeKV`-style stub from `src/lib/auth/rate-limit.test.ts:4-10`

### 1.7 Scheduled (cron) auth helper

- [x] 1.7.1 Extract `getRequestSource(cookies, request, env): Promise<'admin' | 'cron' | undefined>` covering the session-OR-`X-Crawl-Secret` dual-auth pattern currently inlined at `src/pages/api/admin/pipelines/scheduled.ts:46-57` and the partial copy at `src/pages/api/admin/traces/retention.ts:320-327`. Export a thin `requireScheduledAuth(cookies, request, env): Promise<'admin' | 'cron'>` that throws `UnauthorizedError` on `undefined`
  - **Files**: `src/lib/auth/scheduled-auth.ts` (create)
  - **Pattern**: `src/pages/api/admin/pipelines/scheduled.ts:46-57` (canonical source); `src/pages/api/admin/traces/retention.ts:320-327` (partial duplicate to consolidate)
  - **Verify**: `src/lib/auth/scheduled-auth.test.ts` covers each of the 3 branches (valid session → `'admin'`, valid `X-Crawl-Secret` header → `'cron'`, neither → `undefined`); env injected as `{ CRAWL_SECRET: 'test' }` stub

### 1.8 JSON response helpers

- [x] 1.8.1 Create `json(data: unknown, status = 200): Response`, `unauthorized(): Response`, `forbidden(): Response`, `badRequest(message?: string): Response`, `notFound(message?: string): Response`, `serverError(message?: string): Response` — all setting `Content-Type: application/json`. Match the existing widest signature found at `src/pages/api/admin/pipelines.ts:80-85` (`json(data, status = 200)`)
  - **Files**: `src/lib/api/response.ts` (create)
  - **Pattern**: `src/pages/api/admin/pipelines.ts:76-85`, `src/pages/api/admin/settings/index.ts:179-185`, `src/pages/api/admin/status.ts:110-116`, `src/pages/api/admin/providers.ts:297-306` (all 31 duplicates listed in 2.3)
  - **Verify**: `src/lib/api/response.test.ts` asserts each helper returns the documented status code and a parseable JSON body with `Content-Type: application/json`

### 1.9 Date utilities

- [x] 1.9.1 Create `nowMs(): number`, `nowIso(): string`, `toIsoDate(ms: number): string`, `toIsoDay(date?: Date | number): string` (returns `YYYY-MM-DD`), `secondsUntilMidnight(now?: number): number` — covers every `new Date(...).toISOString()` and `new Date().toISOString().split('T')[0]` usage in admin endpoints (per grep at `src/pages/api/admin/{rag-eval,traces/retention,agent-skills/index,stats/export,deep-research/index}.ts`)
  - **Files**: `src/lib/utils/dates.ts` (create)
  - **Pattern**: `src/pages/api/admin/traces/retention.ts:82,151`, `src/pages/api/admin/rag-eval.ts:34,40`, `src/pages/api/admin/stats/export.ts:24,34,43,51,59`, `src/pages/api/admin/agent-skills/index.ts:62`, `src/pages/api/admin/deep-research/index.ts:148`
  - **Verify**: `src/lib/utils/dates.test.ts` covers each helper with a fixed `Date.now()` stub (via `vi.useFakeTimers`); `toIsoDay(0)` returns `'1970-01-01'`, `nowIso()` returns ISO 8601 with `Z` suffix

### 1.10 Settings store

- [x] 1.10.1 Create the consolidated settings CRUD module bound to the canonical `admin_settings` table. Required API: `ensureSettingsTable(db): Promise<void>` (idempotent `CREATE TABLE IF NOT EXISTS`), `getSetting(db, key): Promise<{ value: string; updated_at: string | null } | undefined>`, `setSetting(db, key, value): Promise<void>` (upsert), `getSettings(db, keys[]): Promise<Map<string, string>>` (batched), `deleteSetting(db, key): Promise<void>`, `listSettings(db, prefix?: string): Promise<Array<{ key, value, updated_at }>>`. All read paths swallow "table missing" errors and return empty (preserves current behavior of `settings/index.ts:49-51`)
  - **Files**: `src/lib/db/settings-store.ts` (create)
  - **Pattern**: `src/pages/api/admin/providers.ts:267-275` (`ensureSettingsTable` — `settings` table variant), `src/pages/api/admin/agent-skills/index.ts:66-74` (`ensureAdminSettingsTable` — `admin_settings` variant), `src/pages/api/admin/settings/index.ts:147-153` (inline `CREATE TABLE`), `src/pages/api/admin/rag.ts:192-198` (inline `CREATE TABLE` for `settings`); module standardizes on `admin_settings` per proposal §"Settings store consolidation"
  - **Verify**: `src/lib/db/settings-store.test.ts` covers (a) `ensureSettingsTable` is idempotent across 3 calls, (b) `setSetting` then `getSetting` round-trips, (c) `getSetting` on missing table returns `undefined` not throws, (d) `getSettings(['k1','k2','k3'])` issues exactly 1 D1 query (spy on `db.prepare`)

### 1.11 Tests for each new central module

- [x] 1.11.1 Verify every new module has a co-located test file from 1.1–1.10; run `pnpm vitest run src/lib/{config,tools,auth,api,utils,db}` and confirm green
  - **Files**: (no new files — gate task; tests already created in tasks 1.2–1.10)
  - **Pattern**: `src/lib/auth/rate-limit.test.ts` (existing test shape and `makeKV` stub at lines 4-10)
  - **Verify**: `pnpm vitest run src/lib/{config,tools,auth,api,utils,db} 2>&1 | grep -E '(Test Files|Tests)'` shows ≥9 test files passing, 0 failed

---

## Phase 2 — Migrate callers (smallest blast radius first)

**Goal**: Replace local duplicates with imports from the Phase-1 central modules. One concern per task; each task is independently revertible. Local declarations are deleted only after import + test pass.

**Files touched**: ~35 modified, 2 moved (`external-search.ts`, `get-post-detail.ts` from `src/lib/rag/tools/` to `src/lib/tools/definitions/`)
**Verification**: per-task `pnpm lint && pnpm vitest run` green; per-phase `pnpm exec astro check` green; per-endpoint curl smoke confirms identical response envelope

### 2.1 Env type migrations

- [x] 2.1.1 Replace local `interface Env { ... }` re-declarations across admin API endpoints with `import type { Env } from '../../../lib/config/env'`. Delete the local declaration; replace `(env as unknown as Env)` casts unchanged (they still type-check against the central shape)
  - **Files** (modify each): `src/pages/api/admin/status.ts:7-12`, `src/pages/api/admin/pipelines.ts:11-14`, `src/pages/api/admin/rag.ts:8-10`, `src/pages/api/admin/settings/index.ts:7-11`, `src/pages/api/admin/providers.ts:20-22`, `src/pages/api/admin/traces/[id].ts:8`, `src/pages/api/admin/traces/retention.ts:7-10`, `src/pages/api/admin/traces/index.ts:8`, `src/pages/api/admin/providers/sync/[provider].ts:7`, `src/pages/api/admin/deep-research/index.ts:7-9`, `src/pages/api/admin/deep-research/retention.ts:7`, `src/pages/api/admin/agent-skills/index.ts:7-9`, `src/pages/api/admin/content/{inventory,overview}.ts:7`, `src/pages/api/admin/pipelines/run.ts:8`, `src/pages/api/admin/pipelines/scheduled.ts:8-11`, `src/pages/api/admin/jobs/index.ts:9`, `src/pages/api/admin/jobs/[id].ts:18`, `src/pages/api/admin/stats/{glossary,pipelines,rag,content,knowledge,export}.ts:7`
  - **Pattern**: import path adjusts per file depth (`../../../../lib/config/env` for `src/pages/api/admin/**/*.ts` 4 levels deep)
  - **Verify**: `grep -rn "^interface Env" src/pages/api/admin/` returns 0 lines; `pnpm exec astro check` green; `curl -b 'session=...' http://localhost:4321/api/admin/status` returns identical JSON envelope as before
- [x] 2.1.2 Migrate non-admin pages/api callers and library files: `src/pages/api/search.ts:12`, `src/pages/api/chat.ts:13`, `src/pages/api/deep-research.ts:16`, `src/pages/api/deep-research/[reportId].ts:5`, plus library re-declarations in `src/lib/embed/pipeline.ts:6`, `src/lib/rag/tools/{search-abstract-index,search-docs,pageindex,search-posts,get-post-detail}.ts`, `src/lib/rag/nodes/related-posts.ts:4`, `src/lib/rag/agents/related-posts.ts:4`, `src/lib/rag/engines/llamaindex/{d1-docstore,retriever,vectorize-store,index}.ts`
  - **Files**: 13 files modified — replace local `interface Env { ... }` with `import type { Env } from '<path>/lib/config/env'`
  - **Pattern**: same as 2.1.1; for library files use a narrowing `Pick<Env, 'DB' | 'AI' | ...>` if the local interface only declared a subset, to avoid widening their type contract
  - **Verify**: `grep -rn "^interface Env" src/` returns 0 lines (only `export interface Env` in `src/lib/config/env.ts` remains); `pnpm vitest run` green

### 2.2 Admin auth helper migrations

- [x] 2.2.1 Replace all `async function isAdmin(cookies)` local definitions with `import { requireAdmin } from '<path>/lib/auth/admin'`. Update call sites from `if (!(await isAdmin(cookies))) return unauthorized()` to `const auth = await requireAdmin(cookies); if (!auth.ok) return auth.response`. Delete the local function body and the `verifySession` import where it becomes unused. Response body and status remain byte-for-byte identical because `requireAdmin` uses the shared `unauthorized()` helper.
  - **Files** (modify each, deleting the local `isAdmin` definition): `src/pages/api/admin/{providers,rag,pipelines,status,settings/index,stats/glossary,rag-eval,rag-smoke,stats/rag,traces/index,traces/[id],content/inventory,deep-research/index,content/links,agent-skills/index,content/issues,pipelines/run,content/freshness,stats/pipelines,jobs/[id],stats/content,jobs/index,stats/quality,content/drafts,stats/knowledge,stats/export,content/overview,deep-research/retention,providers/sync/[provider]}.ts` (29 files total — full list per `grep -l "async function isAdmin" src/pages/api/admin/`)
  - **Pattern**: `src/pages/api/admin/status.ts:105-108` (canonical local form); central helper at `src/lib/auth/admin.ts` (created in 1.6.1)
  - **Verify**: `grep -rn "async function isAdmin" src/pages/api/` returns 0 lines; `curl` smoke on `/api/admin/status`, `/api/admin/pipelines`, `/api/admin/settings`, `/api/admin/providers` returns identical 401 (no cookie) and 200 (with valid session) as before

### 2.3 JSON response helper migrations

- [x] 2.3.1 Replace local `function json(...)` and `function unauthorized()` (and the `function badRequest(...)` at `pipelines/scheduled.ts:69-71`) with `import { json, unauthorized, badRequest } from '<path>/lib/api/response'`. Some files use `json(data)` (no status arg) and others `json(data, status = 200)` — central helper supports both. Delete inline `return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, ... })` literals
  - **Files** (modify each): the 31 callers listed by `grep -l "function json(data" src/pages/api/`, namely the 29 admin endpoints from 2.2.1 plus `src/pages/api/search.ts`, `src/pages/api/crawl/sync.ts`, `src/pages/api/glossary/explain.ts`
  - **Pattern**: `src/pages/api/admin/pipelines.ts:80-85` (widest existing signature); `src/pages/api/admin/settings/index.ts:139-142` for `badRequest`-shaped 400 with custom message
  - **Verify**: `grep -rn "^function json\|^function unauthorized\|^function badRequest" src/pages/api/` returns 0 lines; `curl http://localhost:4321/api/admin/status` (no cookie) returns 401 with body `{"error":"unauthorized"}` byte-for-byte unchanged

### 2.4 Date utility migrations

- [x] 2.4.1 Replace ad-hoc `new Date().toISOString()` / `new Date(now).toISOString()` / `new Date().toISOString().split('T')[0]` with `nowIso()` / `toIsoDate(now)` / `toIsoDay()` imported from `src/lib/utils/dates`. The 8 hit-locations (per `grep -rn "new Date()\.toISOString()\|new Date(now)\.toISOString()" src/pages/api/admin/`):
  - `src/pages/api/admin/traces/retention.ts:82` (`new Date(now).toISOString()` → `toIsoDate(now)`)
  - `src/pages/api/admin/traces/retention.ts:151` (`new Date().toISOString()` → `nowIso()`)
  - `src/pages/api/admin/rag-eval.ts:34,40` (both → `nowIso()`)
  - `src/pages/api/admin/agent-skills/index.ts:62` (→ `nowIso()`)
  - `src/pages/api/admin/stats/export.ts:24,34,43,51,59` (5 hits, all `…toISOString().split('T')[0]` → `toIsoDay()`)
  - `src/pages/api/admin/deep-research/index.ts:148` (`new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString()` → `toIsoDate(nowMs() - olderThanDays * 86_400_000)`)
  - **Files**: 5 files modified
  - **Pattern**: `src/lib/utils/dates.ts` exports from 1.9.1
  - **Verify**: `grep -rn "new Date().toISOString()\|new Date(now).toISOString()" src/pages/api/admin/` returns 0 lines; `pnpm vitest run` green; CSV-export smoke: `curl /api/admin/stats/export?days=30` body byte-equal to a baseline captured before the change (date column unchanged because `toIsoDay()` is timezone-equivalent to `toISOString().split('T')[0]`)

### 2.5 Scheduled auth helper migration

- [x] 2.5.1 Replace the inline `getRequestSource` helper in `pipelines/scheduled.ts` with the central one. Also replace `isAuthorized` at `traces/retention.ts:320-327` with `requireScheduledAuth` (semantics identical: session OR `X-Crawl-Secret` header)
  - **Files**: `src/pages/api/admin/pipelines/scheduled.ts` (delete `getRequestSource` at 46-57, import + call central helper); `src/pages/api/admin/traces/retention.ts` (delete `isAuthorized` at 320-327, replace `if (!await isAuthorized(cookies, request)) return unauthorized()` with the central helper)
  - **Pattern**: `src/lib/auth/scheduled-auth.ts` (created in 1.7.1)
  - **Verify**: `grep -rn "X-Crawl-Secret" src/pages/api/admin/` returns 0 lines (header literal now lives only inside the central helper); `curl -X POST -H 'X-Crawl-Secret: $CRAWL_SECRET' /api/admin/pipelines/scheduled -d '{"pipelineId":"series-suggestions"}'` returns identical `{ok:true,...}` envelope; cookie-only path returns identical 200

### 2.6 Settings key constants migrations

- [x] 2.6.1 Replace `const CATALOG_KEY = 'provider_model_catalog'` in `providers.ts:58` with `import { CATALOG_KEY } from '../../../lib/config/settings-keys'`; same for `PROVIDER_KEY_PREFIX` (already imported from `provider-key-store` in `providers.ts:14` — verify provenance and keep one source of truth in `settings-keys`); replace `AGENT_SKILLS_LIBRARY_KEY` + `LEGACY_AGENT_SKILLS_LIBRARY_KEY` at `agent-skills/index.ts:11-12`; replace `RETENTION_KEYS` at `traces/retention.ts:34-42`; replace `MANAGED_KEYS` at `rag.ts:12-42` (rename central export to `MANAGED_RAG_KEYS` to avoid the generic name)
  - **Files**: `src/pages/api/admin/providers.ts:58` (modify), `src/pages/api/admin/agent-skills/index.ts:11-12` (modify), `src/pages/api/admin/traces/retention.ts:34-42` (modify), `src/pages/api/admin/rag.ts:12-42` (modify), `src/lib/rag/provider-key-store.ts` (re-export `PROVIDER_KEY_PREFIX` from `settings-keys` to keep its existing call sites unchanged)
  - **Pattern**: `src/lib/config/settings-keys.ts` (created in 1.3.1)
  - **Verify**: `grep -rn "'provider_model_catalog'\|'agent_skills'\|'deep_research_agent_skills'" src/pages/` returns 0 lines (only `settings-keys.ts` and its tests contain the literals); `pnpm vitest run` green; `curl /api/admin/providers` returns identical catalog JSON

### 2.7 Settings store migrations

- [x] 2.7.1 Replace the 3 `ensureSettingsTable` duplicates and inline `CREATE TABLE IF NOT EXISTS admin_settings/settings` statements with calls to `ensureSettingsTable` + `setSetting` / `getSettings` from `src/lib/db/settings-store`. **Out of scope**: changing which physical table each endpoint reads from (that is Phase 3's migration); for now `providers.ts` and `rag.ts` continue to read/write `settings`, while `settings/index.ts` and `agent-skills/index.ts` continue to read/write `admin_settings` — the central store accepts a `tableName` parameter (defaulting to `admin_settings`) until Phase 3 collapses them
  - **Files**: `src/pages/api/admin/providers.ts:267-275` (delete `ensureSettingsTable` body, import central; thread temporary `{ tableName: 'settings' }` through `saveProviderSecret`/`deleteProviderSecret`/`saveCatalog`), `src/pages/api/admin/agent-skills/index.ts:66-74` (delete `ensureAdminSettingsTable`, import central with default `admin_settings`), `src/pages/api/admin/settings/index.ts:147-153` (delete inline `CREATE TABLE`, import central), `src/pages/api/admin/rag.ts:192-198` (delete inline `CREATE TABLE`, thread temporary `{ tableName: 'settings' }`)
  - **Pattern**: `src/lib/db/settings-store.ts` (created in 1.10.1)
  - **Verify**: `grep -rn "CREATE TABLE IF NOT EXISTS \(admin_\)\?settings" src/pages/` returns 0 lines; `grep -rn "async function ensureSettingsTable\|async function ensureAdminSettingsTable" src/pages/` returns 0 lines; temporary `{ tableName: 'settings' }` call sites are listed in `.omc/research/0010_legacy_settings_soak.md`; `curl -X PUT -b 'session=...' /api/admin/settings -d '{"rate_limit":{"per_minute":120}}'` returns `{"success":true,"updated":["rate_limit_per_minute"]}` and the row is persisted (smoke: `wrangler d1 execute quidproquo-db --local --command="SELECT value FROM admin_settings WHERE key='rate_limit_per_minute'"` returns `120`)

### 2.8 Tool moves (`external-search`, `get-post-detail`)

- [x] 2.8.1 Move `src/lib/rag/tools/external-search.ts` → `src/lib/tools/definitions/external-search.ts` (the file is RAG-agnostic per proposal §"Shared tool registry"); update internal relative imports inside the moved file (e.g. `../providers` → `../../rag/providers`); leave the public function names unchanged
  - **Files**: `src/lib/rag/tools/external-search.ts` (move), `src/lib/tools/definitions/external-search.ts` (create — moved content with adjusted imports)
  - **Pattern**: proposal §"Shared tool registry — RAG tools that are not RAG-specific move to `src/lib/tools/definitions/`"
  - **Verify**: `git mv` preserved history (`git log --follow src/lib/tools/definitions/external-search.ts` shows the prior commits); `pnpm tsc --noEmit` green
- [x] 2.8.2 Add a re-export shim at the old path so existing direct importers keep working without touching every caller
  - **Files**: `src/lib/rag/tools/external-search.ts` (create — 1-line shim: `export * from '../../tools/definitions/external-search'`)
  - **Pattern**: backward-compat re-export — same shape as the `provider-key-store` re-export proposed in 2.6.1
  - **Verify**: `grep -rn "from.*rag/tools/external-search" src/` continues to resolve cleanly (`pnpm tsc --noEmit` green); `pnpm vitest run src/lib/rag` green
- [x] 2.8.3 Same move for `get-post-detail.ts`: `src/lib/rag/tools/get-post-detail.ts` → `src/lib/tools/definitions/get-post-detail.ts`; add re-export shim at old path. Internal `interface Env` re-declaration at line 5 is replaced via 2.1.2 in the same pass
  - **Files**: `src/lib/rag/tools/get-post-detail.ts` (move), `src/lib/tools/definitions/get-post-detail.ts` (create), `src/lib/rag/tools/get-post-detail.ts` (re-create as shim)
  - **Pattern**: same as 2.8.1–2.8.2
  - **Verify**: `git log --follow src/lib/tools/definitions/get-post-detail.ts` shows prior history; `pnpm vitest run` green; any RAG agent that imported `getPostDetail` from the old path still resolves through the shim

### 2.9 Pipeline tool-registry adapter

- [x] 2.9.1 Convert `src/lib/pipelines/tool-registry.ts` from owner-of-state to adapter: keep the existing `toolDefinitions` array literal (the 10 pipeline-flavored entries at lines 3-76 with their legacy `{id, title, kind, runtime, description}` shape) as **pipeline-only declarations**; have `listTools()` return `[...toolDefinitions, ...adaptCentralRegistry()]`. `adaptCentralRegistry()` reads from `src/lib/tools/registry.list()` and maps each `ToolDefinition` to the legacy `{id: name, title: name, kind: 'api', runtime: 'worker', description}` shape (`kind` derived by the heuristic in `agent-os` tasks.md 2.3.1; for `agent-foundation` the central registry is empty, so this is a no-op pass-through that just verifies the adapter compiles)
  - **Files**: `src/lib/pipelines/tool-registry.ts` (modify lines 78-83 to add `adaptCentralRegistry()` + concat)
  - **Pattern**: design Resolution Q5 (adapter pattern); proposal §"Shared tool registry — `src/lib/pipelines/tool-registry.ts` becomes a thin adapter pointing at the central registry"
  - **Verify**: `src/lib/pipelines/tool-registry.test.ts` (create — 3 cases): (a) with empty central registry, `listTools()` returns exactly the 10 pipeline-only definitions byte-equal to the pre-refactor output, (b) after `registry.register({ name: 'test.tool', ... })`, `listTools()` returns 11 entries with the central one mapped to legacy shape, (c) `validateToolAllowlist` still passes for every existing pipeline definition in `src/lib/pipelines/definitions/*.ts`; `pnpm vitest run src/lib/pipelines` green

---

## Phase 3 — Settings reconciliation migration

**Goal**: Collapse the `settings` vs `admin_settings` divergence into a single canonical `admin_settings` table without losing a single row. Highest-risk part of this change — dry-run + production backup gates required.

**Files touched**: 1 new migration file, runbook entry
**Verification**: row-count assertion (sum across both tables before == row count of canonical table after, modulo documented dedupe collisions); endpoint smoke confirms every previously-readable key remains readable

### 3.1 Create migration `0010_admin_settings_consolidation.sql`

- [x] 3.1.1 Write a forward-only migration that (a) ensures `admin_settings` exists with the canonical schema (`key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT (datetime('now'))`), (b) copies every row from `settings` into `admin_settings` via `INSERT OR IGNORE INTO admin_settings (key, value, updated_at) SELECT key, value, COALESCE(updated_at, datetime('now')) FROM settings` (preserves `admin_settings` values when both tables hold the same key — `admin_settings` wins), (c) verifies the copy with two `SELECT COUNT(*)` statements emitted as `-- ASSERT: ...` comments so the runbook script can parse them, and (d) leaves `settings` in place as read-only legacy data for a one-week production soak. Use the migration file shape from `migrations/0009_deep_research_reports.sql` (comment header, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` for `(updated_at DESC)`)
  - **Files**: `migrations/0010_admin_settings_consolidation.sql` (create)
  - **Pattern**: `migrations/0009_deep_research_reports.sql:1-32` (file shape, comment style, `IF NOT EXISTS` everywhere); proposal §"Settings store consolidation"
  - **Verify**: file parses with `sqlite3 :memory: ".read migrations/0010_admin_settings_consolidation.sql"`; running it twice in a row is a no-op (idempotent); `-- ASSERT:` comments are present for both row counts
- [x] 3.1.2 Write a documented down-migration recipe at the bottom of the migration file as a comment block (not executed): `-- DOWN: DELETE FROM admin_settings WHERE key IN (SELECT key FROM settings) AND key NOT IN (<keys-known-to-preexist-in-admin_settings>);` plus operator instructions to restore from the pre-0010 export if collision provenance is unclear. Because `settings` is not dropped in 0010, rollback is data-preserving.
  - **Files**: `migrations/0010_admin_settings_consolidation.sql` (modify — append comment)
  - **Pattern**: project convention — migrations are forward-only, but every risky migration in this codebase documents how to manually reverse it
  - **Verify**: comment is present; the recipe is verbatim executable in `wrangler d1 execute --command='...'`
- [x] 3.1.3 Author follow-up migration `0010b_drop_legacy_settings.sql` but do not apply it until the soak gate passes. The migration contains `DROP TABLE IF EXISTS settings` plus a preflight note requiring `.omc/research/0010_legacy_settings_soak.md` to show one week of zero `{ tableName: 'settings' }` call sites and zero legacy writes. Stored under `migrations/gated/` so Wrangler does not auto-apply destructive cleanup during 0010.
  - **Files**: `migrations/0010b_drop_legacy_settings.sql` (create)
  - **Pattern**: split data-copy from destructive cleanup; design D6
  - **Verify**: migration file exists but is explicitly marked "apply after soak only"; `rg "tableName: 'settings'" src/` returns 0 before applying 0010b

### 3.2 Local dry-run with row-count assertions

- [x] 3.2.1 On local D1: seed both tables with distinct + overlapping keys (`wrangler d1 execute quidproquo-db --local --command="INSERT INTO settings (key,value) VALUES ('only_in_settings','a'),('shared_key','from_settings'); INSERT INTO admin_settings (key,value) VALUES ('only_in_admin','b'),('shared_key','from_admin')"`), capture pre-counts, apply migration, capture post-counts, assert `count(admin_settings_after) == count(admin_settings_before) + count(settings_before) - count(shared_keys)` AND `SELECT value FROM admin_settings WHERE key='shared_key'` returns `'from_admin'` (admin wins per 3.1.1.b)
  - **Files**: (no new files — `.omc/research/0010_dry_run.md` may record the assertions)
  - **Pattern**: proposal §"Settings consolidation migration … explicit row-count assertions in migration"
  - **Verify**: `wrangler d1 migrations apply quidproquo-db --local` exits 0; row-count assertion script (`pnpm exec node scripts/verify-0010-dry-run.mjs` — created as part of this task if needed, or run inline) prints `PASS`; `SELECT name FROM sqlite_master WHERE type='table' AND name='settings'` still returns the legacy table after 0010; every existing local admin endpoint still returns 200 with non-empty config after the migration
- [x] 3.2.2 Run the full local test suite + endpoint smoke after the dry-run: `pnpm vitest run && pnpm exec astro check && curl -b 'session=...' http://localhost:4321/api/admin/settings | jq '.config.rate_limit.per_minute'` returns a non-null number
  - **Files**: (no new files — verification gate only)
  - **Pattern**: zero-behavior-change invariant
  - **Verify**: command emits the expected number; lint/check/test all green

### 3.3 Production backup + apply

- [x] 3.3.1 Capture production backup of both tables before applying: `wrangler d1 export quidproquo-db --output /tmp/quidproquo-pre-0010.sql --remote --table=settings --table=admin_settings`; record SHA256 of the dump in `.omc/research/0010_prod_backup.md` alongside the apply timestamp
  - **Files**: `.omc/research/0010_prod_backup.md` (create — captures backup path, SHA256, apply timestamp)
  - **Pattern**: proposal §"Risk: medium — mitigated by … manual D1 snapshot before applying to production"
  - **Verify**: backup file exists, SHA256 recorded, `wc -l /tmp/quidproquo-pre-0010.sql` shows >0 lines for both tables
- [x] 3.3.2 Apply migration to production: `wrangler d1 migrations apply quidproquo-db --remote`; run the same row-count assertion against the remote DB (`wrangler d1 execute quidproquo-db --remote --command="SELECT COUNT(*) FROM admin_settings"` → compare to pre-migration sum-with-dedupe captured in 3.3.1)
  - **Files**: (no new files — production apply)
  - **Pattern**: 3.2.1 row-count math, executed against `--remote`
  - **Verify**: post-count matches pre-count math within 0 rows; `curl https://quidproquo.cc/api/admin/settings` returns 200 with the same `config.rate_limit.per_minute` as pre-migration (smoke captured in 3.3.1); record `applied at: <iso>, post_count: N` in `.omc/research/0010_prod_backup.md`

---

## Phase 4 — Schema audit

**Goal**: Produce a documented inventory of every inline `CREATE TABLE IF NOT EXISTS` in the codebase so future work can migrate them properly. **Audit is the deliverable — no tables are migrated in this phase** (per proposal §"Out of Scope").

**Files touched**: 1 new doc
**Verification**: doc exists, covers ≥6 tables, each entry has file:line + columns + recommendation + blast-radius rating

### 4.1 Create `docs/schema-audit.md`

- [x] 4.1.1 Create the audit document with one section per inline-created table. Required tables (≥6): `admin_settings` (created inline at `settings/index.ts:147-153`, `agent-skills/index.ts:66-74`), `settings` (created at `providers.ts:267-275`, `rag.ts:192-198` — note: copied by migration 0010 and dropped only by gated follow-up migration 0010b), `deep_research_reports` (created at `deep-research/index.ts:259-283`), and at minimum 3 more discovered via `grep -rn "CREATE TABLE IF NOT EXISTS" src/`. Each entry must include: header `### <table_name>`, bullet for each `file:line` creation site, columns table (name / type / nullable / default), recommendation (one of `migrate-to-proper-migration`, `keep-inline-acceptable`, `consolidate-with-X`), blast-radius rating (`low` / `medium` / `high`) with a one-sentence justification
  - **Files**: `docs/schema-audit.md` (create)
  - **Pattern**: proposal §"Inline `CREATE TABLE IF NOT EXISTS` audit + plan — enumerating every inline-created table, its actual columns, where it's created, and whether/how to migrate it"
  - **Verify**: `wc -l docs/schema-audit.md` shows ≥80 lines; `grep -c "^### " docs/schema-audit.md` returns ≥6 (one heading per table); `grep -c "^- file:" docs/schema-audit.md` returns ≥6 (one creation site per table minimum); every section contains the three required sub-headings (`Columns`, `Recommendation`, `Blast radius`)
- [x] 4.1.2 Cross-check audit completeness against codebase: `grep -rn "CREATE TABLE IF NOT EXISTS" src/ migrations/` produces N raw hits; audit must reference every unique table name in those hits (multiple `IF NOT EXISTS` for the same table count as one entry with multiple `file:line` bullets)
  - **Files**: `docs/schema-audit.md` (modify if any table is missing)
  - **Pattern**: completeness gate, same as `pnpm check:references`
  - **Verify**: `comm -23 <(grep -roh 'CREATE TABLE IF NOT EXISTS \w*' src/ migrations/ | awk '{print $NF}' | sort -u) <(grep -oE '^### \w+' docs/schema-audit.md | awk '{print $2}' | sort -u)` returns empty (every grep-discovered table appears in the audit)

---

## Phase 5 — Verification & validate

**Goal**: Prove zero behavior change end-to-end and archive the foundation work.

**Files touched**: `progress.txt` only
**Verification**: full suite green; all greps zero; OpenSpec strict-validate passes

### 5.1 Full test/lint/check suite

- [x] 5.1.1 Run `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build` — all must complete without errors. `pnpm build` includes OG image generation and cron stubs and is the closest local proxy for `pnpm deploy`
  - **Files**: (no new files — verification gate)
  - **Pattern**: zero-behavior-change invariant
  - **Verify**: each command exits 0; capture output to `.omc/research/agent-foundation-phase5-suite.log`

### 5.2 Curl smoke per migrated endpoint

- [x] 5.2.1 Boot dev server (`pnpm dev`) and run a smoke script hitting each migrated endpoint, comparing response envelopes against pre-refactor baselines captured before Phase 2 started. Endpoints: `GET /api/admin/status`, `GET /api/admin/pipelines`, `GET /api/admin/settings`, `PUT /api/admin/settings` (with safe no-op body), `GET /api/admin/providers`, `GET /api/admin/agent-skills`, `GET /api/admin/deep-research`, `GET /api/admin/stats/export?days=30`, `POST /api/admin/pipelines/scheduled` (with `X-Crawl-Secret`), `POST /api/admin/traces/retention -d '{"dryRun":true}'`
  - **Files**: `scripts/smoke-agent-foundation.sh` (create — 10-curl smoke script that requires `SESSION_COOKIE` and `CRAWL_SECRET` env vars and prints `PASS/FAIL` per endpoint)
  - **Pattern**: zero-behavior-change invariant; existing smoke style used in `scripts/`
  - **Verify**: every endpoint returns 200 (or 401 for unauthenticated probes) with a JSON body whose top-level keys match the pre-refactor baseline; script exits 0

### 5.3 grep audit (no local declarations remaining)

- [x] 5.3.1 Run the deduplication audit grep set and assert each returns 0 lines:
  - `grep -rn "^interface Env" src/ | grep -v 'src/lib/config/env.ts'` (no remaining local Env)
  - `grep -rn "^async function isAdmin\|^function isAdmin" src/pages/` (no remaining local isAdmin)
  - `grep -rn "^function json\|^function unauthorized\|^function badRequest" src/pages/` (no remaining response helpers)
  - `grep -rn "CREATE TABLE IF NOT EXISTS \(admin_\)\?settings" src/pages/` (no remaining inline settings-table creates — they live in `src/lib/db/settings-store.ts` and `migrations/0010_*.sql` only)
  - `grep -rn "new Date().toISOString()" src/pages/api/admin/` (no remaining ad-hoc ISO formatting)
  - `grep -rn "X-Crawl-Secret" src/pages/api/` (no remaining inline scheduled-auth header literal)
  - **Files**: (no new files — verification gate)
  - **Pattern**: proposal §"What Changes" — every duplicate count claimed (8+, 5+, 6+, 8+, 3) must trend to 0
  - **Verify**: each command returns empty; captured to `.omc/research/agent-foundation-grep-audit.log`

### 5.4 `openspec validate agent-foundation --strict`

- [x] 5.4.1 Run `openspec validate agent-foundation --strict` and fix any drift between proposal/tasks/specs and shipped behavior. Foundation does not introduce new spec capabilities beyond the names listed in proposal §"Capabilities" (`shared-config`, `shared-tools`, `shared-admin-helpers`, `shared-utils`, `db-schema-audit`); confirm each has a spec file in `openspec/changes/agent-foundation/specs/` or is acknowledged as "no spec needed — pure refactor" in the design doc
  - **Files**: (verification gate; spec files created earlier in the OpenSpec authoring flow are merely re-validated here)
  - **Pattern**: OpenSpec strict-validate flow
  - **Verify**: command exits 0 with no warnings

### 5.5 Update `progress.txt`

- [x] 5.5.1 Append to `progress.txt` at repo root: `agent-foundation: complete — 10 cross-cutting concerns centralized, settings tables reconciled (migration 0010 applied YYYY-MM-DD, 0010b gated on soak), schema audit shipped in docs/schema-audit.md; ready for agent-os Phase 1`
  - **Files**: `progress.txt` (modify — append one line)
  - **Pattern**: project convention from `CLAUDE.md` — "`progress.txt` at the repo root is the lightweight session memory. Update it when task status materially changes."
  - **Verify**: `tail -1 progress.txt` matches the appended string; commit via the `format-commit` skill per `CLAUDE.md`
