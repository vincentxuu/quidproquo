> **Status: Fully planned change #0** — zero-behavior-change refactor that establishes the shared substrate consumed by every `agent-*` change. Proposal, design, specs, and tasks are present; this change should be implemented first and kept behavior-neutral.

## Why

A codebase scan surfaced **10 cross-cutting concerns currently scattered or duplicated**: `Env` type re-declared in 8+ files, admin auth helper copy-pasted across 5 endpoints, JSON response wrappers in 6 places, settings tables (`settings` vs `admin_settings`) with divergent schemas managed by 3 separate `ensureSettingsTable()` implementations, inline `CREATE TABLE IF NOT EXISTS` in 6 admin endpoints, no central feature-flag mechanism, two parallel tool registries (RAG direct-import + pipeline registry), and date/ISO8601 formatting reinvented in 8+ files.

`agent-os` will add 6 kernel modules + 7 new D1 tables on top of this. Without consolidating first, the kernel either (a) imports from each scattered location (lock-in to current bad shape), or (b) creates a third parallel pattern (worsens duplication). Both are wrong.

This change is a **pure refactor**: every existing endpoint, test, and feature behaves identically after merge. The only changes are file locations, import paths, and the addition of a settings-consolidation migration. No new features ship in `agent-foundation`.

## What Changes

- **Central `Env` type** — single `src/lib/config/env.ts` covering all current + planned Cloudflare bindings (`DB`, `SESSION`, `RATE`, `DEEP_RESEARCH_KV`, `VECTORIZE_INDEX`, `AI`, `R2_IMAGES`, `CRAWL_SECRET`, plus reserved `AGENT_QUEUE` and `R2_AGENT_MEMORY` for agent-os). 8+ local re-declarations removed.
- **Feature flag module** — new `src/lib/config/flags.ts` reading from Wrangler env vars. Foundation only ships the module + typed reader; first flag entries are added by `agent-os`.
- **Shared tool registry** — new `src/lib/tools/{registry,types,cost}.ts` defining the MCP-compatible `ToolDefinition` shape and `CostModel` discriminated union. RAG tools that are not RAG-specific move to `src/lib/tools/definitions/`: `external-search.ts`, `get-post-detail.ts`. RAG-specific tools (`hybrid-search`, `search-abstract-index`, `search-docs`, `pageindex`, `search-posts`) stay in `src/lib/rag/tools/`. `src/lib/pipelines/tool-registry.ts` becomes a thin adapter pointing at the central registry.
- **Admin auth helper** — `requireAdmin(cookies)` extracted from 5+ duplicates to `src/lib/auth/admin.ts`. It returns a discriminated union (`{ ok: true } | { ok: false; response }`) so callers can early-return the exact 401 response without re-creating response literals.
- **Scheduled (cron) auth helper** — extract the session-OR-`X-Crawl-Secret` pattern from `src/pages/api/admin/pipelines/scheduled.ts` into `src/lib/auth/scheduled-auth.ts` so `agent-os` can reuse it.
- **JSON response helpers** — `json(data, status)`, `unauthorized()`, `forbidden()`, etc. extracted to `src/lib/api/response.ts`. 6+ duplicates removed.
- **Date / ISO8601 utilities** — `toIsoDate()`, `toIsoDay()`, `secondsUntilMidnight()`, `nowMs()`, `nowIso()` extracted to `src/lib/utils/dates.ts`. 8+ ad-hoc usages replaced.
- **Settings store consolidation** — single `src/lib/db/settings-store.ts` with typed CRUD over the canonical `admin_settings` table; migration `0010_admin_settings_consolidation.sql` reconciles the `settings` vs `admin_settings` divergence and preserves all existing rows. The stale `settings` table is **not dropped in 0010**; a follow-up `0010b_drop_legacy_settings.sql` drops it only after a one-week production soak with zero legacy reads/writes. 3 `ensureSettingsTable()` duplicates removed; `CATALOG_KEY`, `PROVIDER_KEY_PREFIX`, `AGENT_SKILLS_LIBRARY_KEY`, `RETENTION_KEYS` consolidated into `src/lib/config/settings-keys.ts`.
- **Inline `CREATE TABLE IF NOT EXISTS` audit + plan** — produce `docs/schema-audit.md` enumerating every inline-created table (`providers`, `agent-skills`, `deep-research`, etc.), its actual columns, where it's created, and whether/how to migrate it. **Migration of these tables is OUT of scope for this change** (deferred to follow-up PRs to keep `agent-foundation` blast radius bounded); the audit itself prevents future drift.
- **No new behavior** — no new endpoints, no new bindings, no schema additions beyond the settings reconciliation migration. Tests pass on identical assertions.

## Capabilities

### New Capabilities

- `shared-config`: Central `Env` type, feature-flag reader, settings key constants. The "what does this Worker have access to" layer.
- `shared-tools`: MCP-compatible tool registry, `ToolDefinition` and `CostModel` types, first batch of cross-cutting tools moved out of `src/lib/rag/tools/`.
- `shared-admin-helpers`: `requireAdmin`, scheduled auth helper, JSON response wrappers. The boilerplate every admin/cron endpoint repeats today.
- `shared-utils`: Date/ISO8601 utilities and settings store consolidation. Heterogeneous low-level helpers grouped by "every admin endpoint needs at least one of these".
- `db-schema-audit`: A documented inventory of inline `CREATE TABLE` statements with a migration recommendation per table; foundation for future schema consolidation work.

## Dependencies

(none — this is change #0)

## Impact

- **New files**: `src/lib/config/{env,flags,settings-keys}.ts`, `src/lib/tools/{registry,types,cost,definitions/}`, `src/lib/auth/{admin,scheduled-auth}.ts`, `src/lib/api/response.ts`, `src/lib/utils/dates.ts`, `src/lib/db/settings-store.ts`, `docs/schema-audit.md`
- **Modified files**: ~25 endpoints + library files updating import paths; `src/lib/pipelines/tool-registry.ts` becomes adapter; ~2 RAG tool files moved
- **D1**: one migration `0010_admin_settings_consolidation.sql` that reconciles `settings` and `admin_settings` into a single canonical table and preserves all existing data
- **Wrangler**: no binding changes in this change (`AGENT_QUEUE` and `R2_AGENT_MEMORY` come with `agent-os`)
- **Tests**: existing tests pass unchanged (zero behavior change); add minimal tests for new central helpers (`requireAdmin`, `json`, date utilities, settings store CRUD)
- **Risk**: medium — the settings consolidation migration is the highest-risk piece (must be reversible + must preserve all rows). Mitigated by: dry-run on local D1 first; explicit row-count assertions in migration; manual D1 snapshot before applying to production
- **Risk (low)**: tool registry adapter pattern in `src/lib/pipelines/tool-registry.ts` could surface edge cases where pipeline-specific tool semantics differ from the new central shape; mitigated by audit pass before the adapter is wired

## Out of Scope

- Migration of inline-`CREATE TABLE` tables into proper migrations (audit only — see Why)
- Provider secret resolver refactor (deferred to `agent-providers`)
- Cron schedule metadata centralization (deferred to `agent-os` scheduler)
- KV rate-limit helper extraction (already adequately centralized in `src/lib/auth/rate-limit.ts`)
- Any move of `src/lib/rag/agents/*` (kept in place; `agent-os` migration handles imports during agent migration)
- Any move of `src/lib/rag/graph.ts` or `state.ts` (RAG-specific, stays put)

## References

- Codebase inventory + cross-cutting scan reports (in conversation history; not committed)
- Project rule from `CLAUDE.md`: "Feature flags are mandatory for all advanced/experimental techniques"
