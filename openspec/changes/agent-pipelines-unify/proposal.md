> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until `agent-flow` has shipped and proven stable in production.

## Why

The existing pipeline layer (`src/lib/pipelines/{runner,registry,job-store,tool-registry}.ts`) is a linear ETL orchestrator for curated blog-ops jobs. Once `agent-flow` ships, it functionally subsumes pipelines — flow supports everything pipeline does plus conditional edges, parallel, loop, sub-flow, presets, human approval. Keeping two parallel orchestrators long-term is wasteful: duplicate runner logic, duplicate lifecycle tables (`admin_jobs` vs `flow_runs`), divergent tool-call conventions despite the shared central registry.

This change ports every existing pipeline definition into a flow YAML, reconciles the lifecycle tables, and deletes `src/lib/pipelines/runner.ts` after a grace period. Result: one orchestrator, one job table, one set of admin endpoints, one mental model.

## What Changes

- **Port each pipeline definition** in `src/lib/pipelines/definitions/*.ts` to a flow YAML under `flows/pipelines/<id>.yaml`. Initial scope covers everything in production: `freshness-review`, `youtube-brief`, `research-brief`, and any others present at migration time. Each ported flow is a linear chain (no new edge conditions added — purely a faithful port).
- **Migrate `admin_jobs` rows into `flow_runs`** with `parent_kind='pipeline'` to preserve history. Subsequent invocations write only to `flow_runs`.
- **Deprecate `src/lib/pipelines/runner.ts`** — mark the export as deprecated, route any remaining caller (the admin pipelines endpoint) through the flow runtime.
- **Replace admin pipeline endpoints** (`src/pages/api/admin/pipelines.ts`, `src/pages/api/admin/pipelines/scheduled.ts`) with thin redirectors to the flow equivalents (`/api/admin/flows/...`). Existing URLs remain valid; payloads are translated.
- **Remove `src/lib/pipelines/{runner,registry,job-store}.ts`** after a 4-week grace period during which both paths coexist. `tool-registry.ts` (already an adapter from `agent-foundation`) can stay if any external caller still depends on the pipeline-shape view.
- **Sunset `admin_jobs` table** — keep the table for read-only history; new rows go to `flow_runs` only. After 90 days of zero writes, the table is dropped via a migration.

## Capabilities

### New Capabilities

- `pipeline-flow-port`: Mechanism for porting a pipeline definition to a flow YAML; per-pipeline parity tests asserting flow run output equals legacy pipeline run output on the same input.
- `pipeline-runtime-deprecation`: Safe removal of `src/lib/pipelines/runner.ts` and adjacent files; staged via deprecation warnings, then runtime redirects, then deletion after grace period.
- `pipeline-jobs-reconciliation`: Migration from `admin_jobs` to `flow_runs` with history preservation; admin job-list endpoint reads from both during transition; eventually `admin_jobs` dropped via migration.

## Dependencies

- `agent-flow` (the new orchestrator must exist, be stable, and have proven the YAML DSL handles every pipeline shape in production)

## Impact

- **Modified**: `src/lib/pipelines/runner.ts` → deprecated → removed; `src/lib/pipelines/definitions/*.ts` → ported to YAML; `src/pages/api/admin/pipelines.ts` + `scheduled.ts` → redirect to flow endpoints
- **New**: `flows/pipelines/*.yaml` (one per ported pipeline)
- **D1 migrations**: one for `admin_jobs → flow_runs` data migration (preserving history); one later for `DROP TABLE admin_jobs` (gated on 90-day zero-write proof)
- **Tests**: parity test per pipeline asserting legacy vs flow output equivalence; integration test that admin pipelines URLs still respond identically after redirector lands
- **Risk**: medium-high — existing pipelines run unattended via cron; a port that subtly drifts could fail a production cron without obvious signal. Mitigated by (a) per-pipeline parity tests in CI, (b) running both paths in parallel for 4 weeks before flipping the cron, (c) keeping the old runner as a fallback for an additional 4 weeks
- **Risk**: data preservation in `admin_jobs → flow_runs` migration must keep every column; lost history would be irrecoverable

## Out of Scope

- Any changes to pipeline business logic; this is a pure orchestration migration
- Adding flow features (conditional edges, parallel, etc.) to existing pipelines — that's a follow-up, not a port
- Cron schedule changes — the same crons continue to fire the same flows that the pipelines used to

## References

- `/Users/xiaoxu/Projects/quidproquo/openspec/changes/agent-flow/proposal.md` — the orchestrator this change migrates onto
- `/Users/xiaoxu/Projects/quidproquo/src/lib/pipelines/` — source code being deprecated
