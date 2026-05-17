## Context

After `agent-flow` (#3) ships and stabilizes in production, the platform has two parallel orchestrators that do overlapping work:

1. **Pipeline runner** (`src/lib/pipelines/runner.ts`, ~1400 lines). A linear ETL substrate that runs 13 curated blog-ops jobs (`content-ops`, `post-quality`, `embed-sync`, `crawl-sync`, `translation`, `research-brief`, `youtube-brief`, `freshness-review`, `glossary-gap`, `series-suggestions`, `knowledge-graph-prototype`, `metadata-suggestions`, `internal-links`). The dispatcher is an `if (definition.id === 'X')` switchboard (`runner.ts:121-187`); each pipeline gets a bespoke per-id function. Lifecycle rows live in `admin_jobs` / `admin_job_steps` / `admin_job_artifacts`. Retry / timeout / external-call budget live in `definition.budget` (`runner.ts:1253-1318`).
2. **Flow runtime** (`src/lib/agent-flow/`). A YAML-DSL orchestrator with conditional edges, parallel, loop, sub-flow, presets, human approval. Lifecycle rows live in `flow_runs` / `flow_step_runs` / `flow_run_state`. Provably a superset of pipeline semantics (`agent-flow` design D2 ships 9 step types — `agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`, `sub_flow`, `parallel`, `loop` — all the shapes the pipeline runner already produces, plus more).

Maintaining both has compounding cost: two lifecycle tables to query for "what jobs ran today?", two retry/timeout codepaths to keep in sync, two admin endpoint trees to maintain (`/api/admin/pipelines/*` and `/api/admin/flows/*`), two mental models for new contributors. Every new feature (cancellation, approval gates, cost telemetry) has to land twice or be wired into one and silently miss the other.

**Why now.** `agent-flow` has the DSL, the kernel link, the persistence schema, and the admin endpoints. The pipelines are linear chains today (no edge logic, no parallel, no sub-flow); each is mechanically expressible as a flow YAML. Bridging tool-call conventions is already done — `src/lib/pipelines/tool-registry.ts` is an adapter onto `agent-foundation`'s central registry, the same registry `agent-flow` uses. The barrier was waiting for `agent-flow` to prove out; that gate is cleared.

**Stakeholders.**
- **Admin operator** — sees pipeline runs in the same console as flow runs; one query, one filter, one cost view.
- **Platform engineer** — deletes ~1500 lines of pipeline-specific runtime; new pipelines author as YAML in `flows/pipelines/<id>.yaml` instead of as `runner.ts` switchboard cases.
- **Cron infrastructure** — same cron expressions fire the same workflows; no schedule changes, no missed runs.

**Constraints.**

1. **No business-logic changes.** Each pipeline's modules (`src/lib/pipelines/modules/*.ts` — `runPostQualityCheck`, `runResearchBrief`, `runYouTubeBrief`, etc.) are kept verbatim; only the orchestration shell changes. A ported flow that produces a different artifact than the legacy pipeline on the same input is a port bug, not an upgrade.
2. **Data preservation.** Every column in `admin_jobs` / `admin_job_steps` / `admin_job_artifacts` has a documented home in `flow_runs` / `flow_step_runs` / `flow_run_state`; lost history is irrecoverable.
3. **Cron unattended-failure budget = zero.** Pipelines run on cron (`scheduled.ts:24-37` lists `series-suggestions` Sunday 04:00 UTC and `knowledge-graph-prototype` Sunday 05:00 UTC; `crawl-sync` and `embed-sync` fire via separate triggers). A subtle drift in a port that fails only on cron, between Sunday 04:00 and the next admin login Monday morning, must be caught by parity tests in CI, not by an alert at 06:00.
4. **URL stability.** Existing scripts and bookmarks that hit `POST /api/admin/pipelines/:id/run` keep working unchanged.

## Goals / Non-Goals

**Goals**
- Port every entry in `src/lib/pipelines/registry.ts` (13 pipelines as of this writing) to a flow YAML under `flows/pipelines/<id>.yaml`, with structural equivalence to the legacy stages.
- Migrate `admin_jobs` / `admin_job_steps` / `admin_job_artifacts` history into `flow_runs` / `flow_step_runs` / `flow_run_state` with a `parent_kind='pipeline'` marker preserving every column.
- Redirect `/api/admin/pipelines/*` to `/api/admin/flows/*` with payload translation; existing URLs keep returning 200 with equivalent shape.
- Run both runners side-by-side for 4 weeks (dual-path); flip cron to the flow path; deprecate the pipeline runner for another 4 weeks; delete it.
- Drop `admin_jobs` and friends via migration after 90 days of zero writes.
- Per-pipeline parity test in CI: same input → structurally equivalent artifact between legacy `runPipeline` and the ported flow.

**Non-Goals**
- Adding flow features (conditional edges, parallel, sub-flow) to ported pipelines — that is a per-pipeline follow-up after this change, not a port.
- Changing any pipeline's prompts, module code, or business logic.
- Redesigning the cron schedule.
- Removing `src/lib/pipelines/tool-registry.ts` — already an adapter onto the central registry; survival is decided after observing whether any external caller depends on its pipeline-shape view (Open Question Q3).
- New admin UI — `agent-flow`'s admin surface already covers run inspection; pipeline-specific UI deprecates as the legacy endpoints do.

## Decisions

### D1: Faithful-port policy — no business-logic changes during migration

**Decision.** Every ported flow is a one-to-one rewrite of the legacy pipeline's stage sequence as a linear flow with no edge conditions, no parallel, no loop. The flow YAML for `freshness-review` has exactly two `tool_group` / `transform` steps because the legacy pipeline has exactly two stages (`runner.ts:920-956`). No "while we're here" improvements.

**Why.** The change is already medium-high risk (R1) because pipelines run unattended via cron. Adding business-logic changes during the port multiplies the surface for drift. The "make it work the same" goal is testable (parity test, D8); "make it better" is unbounded.

**Alternatives considered.**
- *Refactor while porting* (e.g. fan out `read_post_content` calls in parallel via `parallel` step). Rejected — turns a port into a redesign; if the parallel version differs from the linear version, root cause is ambiguous (port bug vs concurrency bug).
- *Skip pipelines that "feel weird" to port and leave them on the runner*. Rejected — the goal is one orchestrator; partial ports leave the cost untouched.

**Rationale.** A pure port is reviewable as a structural diff; a port-plus-improvement is two diffs that have to land together and unwind together if anything breaks.

### D2: Mapping table — exact flow YAML shape for every pipeline

**Decision.** Each pipeline in `src/lib/pipelines/registry.ts` maps to one flow YAML file. The shape is mechanical: each `stages[i]` becomes one step; `tools` referenced via `tool_group` (deterministic modules) or `agent` step (LLM-wrapped stages); guards become flow `pre_run` / `post_run` validators reusing `src/lib/pipelines/guards/*.ts` until those move to `agent-policy`. The table below is the authoritative mapping; the parity test (D8) walks it row by row.

| Pipeline id | Stage count | Flow YAML path | Step types used | Expected artifact(s) |
|---|---|---|---|---|
| `content-ops` | 2 | `flows/pipelines/content-ops.yaml` | `tool_group` × 2 | `json_report` (content ops report) |
| `post-quality` | 4 | `flows/pipelines/post-quality.yaml` | `tool_group` × 2, `agent` × 1 (LLM review), `artifact` | `json_report` (quality), `json_report` (evaluation) |
| `embed-sync` | 2 | `flows/pipelines/embed-sync.yaml` | `tool_group` × 2 | `json_report` (embed result) |
| `crawl-sync` | 2 | `flows/pipelines/crawl-sync.yaml` | `tool_group` × 2 | `json_report` (crawl record) |
| `translation` | 9 | `flows/pipelines/translation.yaml` | `tool_group`, `agent` (translate / cultural / native), `tool_group` × 2, `human_approval`, `artifact` × 2 | `markdown_draft`, `json_report` |
| `research-brief` | 6 | `flows/pipelines/research-brief.yaml` | `agent` × 1, `tool_group` × 2, `human_approval`, `artifact` × 2 | `markdown_draft`, `json_report` |
| `youtube-brief` | 6 | `flows/pipelines/youtube-brief.yaml` | `tool_group` × 3, `human_approval`, `artifact` × 2 | `markdown_draft`, `json_report` |
| `freshness-review` | 2 | `flows/pipelines/freshness-review.yaml` | `tool_group` × 2 | `json_report` |
| `glossary-gap` | 2 | `flows/pipelines/glossary-gap.yaml` | `tool_group` × 2 | `json_report` |
| `series-suggestions` | 2 | `flows/pipelines/series-suggestions.yaml` | `tool_group` × 2 | `json_report` |
| `knowledge-graph-prototype` | 2 | `flows/pipelines/knowledge-graph-prototype.yaml` | `tool_group` × 2 | `json_report` |
| `metadata-suggestions` | 3 | `flows/pipelines/metadata-suggestions.yaml` | `tool_group` × 2, `agent` × 1 | `json_report` × 2 |
| `internal-links` | 4 | `flows/pipelines/internal-links.yaml` | `tool_group` × 3, `agent` × 1 | `json_report` × 2 |

The `human_approval` step type maps to legacy `human_review` stages; the legacy stages were no-op (just status records), so the ported approval gate auto-resolves on a `pass_when` JSON Logic check against `state.<previous_step>.requiresHumanInput` until a human-in-the-loop UI lands in `agent-console`.

**Rationale.** A table is reviewable; a prose paragraph per pipeline is not. The parity test in D8 reads this table as data.

### D3: `admin_jobs → flow_runs` data migration strategy

**Decision.** One-shot migration in `0019_admin_jobs_to_flow_runs.sql`, run after the ported flows are live and the dual-path window opens (Migration Plan Step 3). Strategy:

- For each `admin_jobs` row: insert a corresponding `flow_runs` row with `flow_id = 'pipeline-' || pipeline_id`, `flow_version = 0` (the reserved version for migrated history), `trigger` mapped from `requested_by` (`'admin:%'` → `manual`, `'cron:%'` → `cron`, else `api`), `inputs_json = admin_jobs.input_json`, `started_at = admin_jobs.started_at`, `finished_at = admin_jobs.finished_at`, `error_json = admin_jobs.error_summary`, plus `parent_kind='pipeline'` and `parent_external_id=admin_jobs.id` so admin queries can filter migrated pipeline history and round-trip back to the original id. The `pipeline-` prefix is canonical for migrated/ported pipeline flows; new non-pipeline flows must not use that prefix.
- For each `admin_job_steps` row: insert a `flow_step_runs` row keyed by the new `flow_run_id`, mapping `stage_id → step_id`, `kind → step_type` (with `module`/`api`/`llm`/`human_review` mapped to `tool_group`/`tool_group`/`agent`/`human_approval`), `output_summary → output_json`, `guard_results → output_json.guard_results`.
- For each `admin_job_artifacts` row: insert a corresponding row into the artifact store (placeholder `agent_run_events` row with `kind='artifact'` until `agent-artifact` lands, matching `agent-flow` D2).
- Columns added: `ALTER TABLE flow_runs ADD COLUMN parent_kind TEXT DEFAULT 'flow'`; `ALTER TABLE flow_runs ADD COLUMN parent_external_id TEXT`.
- Migration is idempotent (re-run safe via `INSERT OR IGNORE` on `flow_run_id` derived from `admin_jobs.id`).
- A rollback script (`0019_admin_jobs_to_flow_runs_rollback.sql`) is shipped alongside, deleting rows where `parent_kind='pipeline'` — used only if the migration is found to corrupt data; once the 4-week dual path is over, rollback is no longer offered.

**Alternatives considered.**
- *Incremental migration triggered per-row on read.* Rejected — leaves the join condition forever in admin endpoints (R4); the goal is one table.
- *Skip migration; keep `admin_jobs` read-only.* Rejected — the admin console then queries two tables for "show me all jobs from this month"; the union query grows over time.
- *Move columns 1:1, no `parent_kind` marker.* Rejected — operators need to distinguish "this is a flow run from the new runtime" vs "this is migrated pipeline history that may have gaps" when debugging.

**Rationale.** One-shot beats incremental for a finite history (admin_jobs has hundreds of rows, not millions). `parent_kind` is a 1-character query filter that prevents history from contaminating live metrics.

### D4: Admin endpoint redirector — `POST /api/admin/pipelines/:id/run` → flow runtime

**Decision.** `src/pages/api/admin/pipelines.ts` and `src/pages/api/admin/pipelines/scheduled.ts` keep their URLs. Their POST handlers stop calling `runPipeline` and instead call `runFlow` from `agent-flow`'s runtime with a translated payload. Payload translation:

```typescript
// before (current)
runPipeline(db, { pipelineId: body.pipelineId, input: body.input ?? {}, requestedBy: 'admin' })

// after (redirector)
runFlow(db, {
  flowId: body.pipelineId,            // pipeline ids and flow ids are 1:1 by D2 mapping
  inputs: body.input ?? {},
  trigger: source === 'cron' ? 'cron' : 'manual',
  triggeredBy: source === 'cron' ? `cron:${body.cron ?? 'scheduled'}` : 'admin',
})
```

Response shape is preserved: the legacy `{ ok: true, jobId, status }` shape is reconstructed from the `flow_run_id` and `status` returned by `runFlow` (`jobId = flow_run_id`, status mapping `done → succeeded`, `paused → waiting_review`, `failed → failed`, `cancelled → cancelled`). GET on `/api/admin/pipelines` returns the same listing shape, sourced from `flow_definitions` filtered by the D2 mapping table (or equivalently: read from `flows/pipelines/*.yaml` at startup), so admin UIs that haven't yet been re-pointed still render.

**Alternatives considered.**
- *Delete `/api/admin/pipelines/*` and rely on callers to switch to `/api/admin/flows/*`.* Rejected — breaks every script and bookmark; URL stability is a stated constraint.
- *Permanent dual endpoints with both runtimes live.* Rejected — that is precisely the duplication this change deletes.
- *302 HTTP redirect to `/api/admin/flows/<id>/run`.* Rejected — 302 doesn't carry POST bodies through every HTTP client; in-handler call to `runFlow` avoids the redirect entirely.

**Rationale.** Thin redirector preserves URL contract while collapsing the runtime to one. Payload translation is ~20 lines per endpoint.

### D5: Cron behavior — same cron expressions fire the same flows

**Decision.** No `wrangler.jsonc` cron schedule changes. The cron-trigger handler that today calls `POST /api/admin/pipelines/scheduled` with `{ pipelineId: 'series-suggestions' }` continues to call the same URL with the same body; the redirector (D4) routes the call into the flow runtime. The `requested_by` value (`cron:0 4 * * SUN`) is preserved as `trigger='cron'` + `triggered_by='cron:0 4 * * SUN'` on the flow run row.

Cron-fired flows are flagged `durable: false` (matching legacy in-Worker behavior); the `series-suggestions` and `knowledge-graph-prototype` jobs both complete inside the legacy `budget.maxRuntimeMs` (240 s and 240 s respectively), well under Worker CPU/wall-clock limits. If any cron-fired flow approaches those limits during dual-path validation (Step 3 of Migration Plan), opt-in `durable: true` lands per-pipeline; not in this change.

**Alternatives considered.**
- *Move cron triggers from URL POST to direct in-Worker `runFlow` call.* Rejected — same effect, but increases blast radius (cron handler now imports the flow runtime instead of one fetch); URL-mediated calls keep the cron handler dumb.
- *Add a `flow-cron` table to replace cron triggers.* Rejected — out of scope; Cloudflare cron triggers work; replacing them is unrelated.

**Rationale.** The cron schedule is the most operationally sensitive surface; leaving it untouched is the lowest-risk option.

### D6: Grace period — 4-week dual-path, 4-week deprecated, then delete

**Decision.** Three-phase rollout, gated by feature flags from `src/lib/config/flags.ts`:

| Phase | Duration | Pipeline runner state | Flow runner state | Gate |
|---|---|---|---|---|
| Dual-path | 4 weeks | Live, default for `/api/admin/pipelines/*` | Live, called by parity test on every legacy run | `AGENT_PIPELINES_UNIFY_REDIRECT=false` (default) |
| Redirector live | 4 weeks | Deprecated; admin endpoints call flow runtime; pipeline runner reachable only via direct import (no callers in tree) | Live, sole runtime | `AGENT_PIPELINES_UNIFY_REDIRECT=true` |
| Deletion | one-shot PR after week 8 | Files deleted | Live | flag removed |

During the dual-path phase, every admin-triggered pipeline run silently double-executes: the legacy runner returns the response to the caller, and a background `ctx.waitUntil(runFlow(...))` triggers the flow runtime path with the same input. The two runs' outputs feed the parity-drift metric (D8). Cron-triggered runs follow the same pattern, but only the legacy result is observed by downstream consumers; the flow run is observed by the parity dashboard only.

**Alternatives considered.**
- *Two-week single grace period, no dual-path.* Rejected — pipelines run unattended on weekly crons; two weeks gives one chance to observe each cron-only pipeline. Four weeks gives at least four observations per weekly cron.
- *Indefinite dual-path "just in case".* Rejected — the cost is exactly the duplication this change deletes; sunsetting on a clock forces commitment.
- *Flag-gate per-pipeline instead of globally.* Considered, deferred — adds 13 flag entries; global flag is simpler. If a specific pipeline causes drift, that pipeline reverts to the runner by toggling its flow YAML's `migration_status: rollback` field, which the redirector reads.

**Rationale.** Four+four+one matches the agent-os pattern (R8) for deprecation cycles; cron observation budget is the binding constraint.

### D7: `admin_jobs` table sunset — drop migration gated on 90 days of zero writes

**Decision.** After the redirector goes live (Phase 2 of D6), no new rows land in `admin_jobs`. A monitoring query (`SELECT COUNT(*) FROM admin_jobs WHERE created_at > datetime('now', '-1 day')`) is added to the existing admin dashboard. After 90 days of consecutive zero results, a drop migration `0020_drop_admin_jobs.sql` lands:

```sql
DROP TABLE admin_job_artifacts;
DROP TABLE admin_job_steps;
DROP TABLE admin_jobs;
```

The 90-day window covers: (a) any forgotten direct caller (a script that imports `runPipeline`, bypassing the URL), (b) any scheduled job that fires less than monthly, (c) operator's monthly review cadence.

The migration is reversible only by restoring from the most recent D1 backup; a final logical export (`wrangler d1 export DB --table admin_jobs` and friends) is captured to R2 before the drop, retention 180 days.

**Alternatives considered.**
- *Keep `admin_jobs` forever for read-only history.* Rejected — schema-on-D1 cost is small but real; preserved history lives in `flow_runs` after D3.
- *Drop immediately after migration.* Rejected — no safety margin for the rare direct importer.

**Rationale.** 90 days of evidence > opinion; the export-to-R2 is cheap insurance.

### D8: Test strategy — per-pipeline parity test in CI

**Decision.** New vitest suite `src/lib/agent-pipelines-unify/__tests__/parity.test.ts`. For each row in the D2 mapping table:

1. Seed a deterministic input (committed under `src/lib/agent-pipelines-unify/__tests__/fixtures/<pipeline-id>.input.json`).
2. Run legacy `runPipeline(db, request)` against a freshly-migrated D1 in-memory instance; collect the `admin_jobs` + `admin_job_steps` + `admin_job_artifacts` rows.
3. Run new `runFlow(db, flowRequest)` against the same fresh D1; collect the `flow_runs` + `flow_step_runs` + artifact rows.
4. Assert structural equivalence: same step count, same step ids in same order, same final status, same artifact types in same order, deep-equal of artifact payloads modulo timestamps and UUIDs.

Equivalence helpers normalize away non-deterministic fields (UUIDs become `<UUID>`, timestamps become `<TS>`, `duration_ms` becomes `<DURATION>`); the parity assertion runs against the normalized form. LLM-driven stages (`agent` step type, e.g. `quality-evaluation`) are stubbed via a `MockModelProvider` that returns the fixture-committed output so parity is fully deterministic.

Test runs on every PR in `pnpm test`; a failure fails CI. A `pnpm parity` script runs just this suite for fast local iteration during a port.

**Alternatives considered.**
- *Production shadow comparison only, no unit-level parity test.* Rejected — production shadow catches drift after merge; CI parity catches it before. Both ship (D6 dual-path is the shadow).
- *Snapshot tests against committed JSON.* Considered, used internally — the artifact-payload deep-equal step uses vitest's snapshot mechanism; the structural-equivalence step is explicit assertions, not snapshots, so a diff is readable in PRs.

**Rationale.** Parity per pipeline is the only objective measure of a faithful port. Snapshotting alone over-fits to current output (any acceptable change requires snapshot updates); structural equivalence catches the categorical breakages (step count change, status drift) and lets artifact deep-equal own the fine-grained check.

## Risks / Trade-offs

### R1: Subtle drift in a faithful port slips past structural tests
**Risk.** A ported flow's stage produces output that differs from the legacy pipeline in a way that passes structural equivalence (same shape, same step count) but means something different downstream — e.g. `qualityEvaluation.decision` flips from `approve` to `request_changes` because the prompt context differs by one whitespace character.
**Mitigation.** Parity test (D8) does deep-equal on artifact payloads, not just structure; a one-character drift fails the test. LLM-driven steps are stubbed via `MockModelProvider`, so the comparison is on deterministic post-processing. Dual-path window (D6 Phase 1) is the production safety net for anything CI missed.

### R2: Cron unattended failure between flag flip and Monday morning
**Risk.** The redirector goes live (D6 Phase 2 enables `AGENT_PIPELINES_UNIFY_REDIRECT=true`) on a Friday; the Sunday 04:00 UTC `series-suggestions` cron fires through the flow runtime for the first time; it fails silently because of a port bug no parity test caught; operator notices Monday at 09:00.
**Mitigation.** (a) Flag flip is never on a Friday — a Migration Plan checklist item; preferred flip is Tuesday so a full week's crons run before any weekend. (b) Dual-path (D6 Phase 1) has already run the flow version of every cron at least four times; the flow runner is not first-firing on Phase 2. (c) Cron-triggered flow runs emit a structured log line that the alerting layer (`src/lib/observability/`) inspects; a `failed` status from a cron flow triggers a Telegram alert.

### R3: Data loss during `admin_jobs → flow_runs` migration
**Risk.** A column mapping bug drops `failure_reason` or `retry_count`; once the source table is dropped (D7), the history is gone.
**Mitigation.** Migration is idempotent (`INSERT OR IGNORE` keyed on derived id); pre-drop logical export to R2 with 180-day retention (D7). The migration ships with a row-count + checksum assertion: post-migration `COUNT(flow_runs WHERE parent_kind='pipeline') == COUNT(admin_jobs)` and a per-column null-rate check (e.g. `failure_reason` null rate in `flow_runs` matches `admin_jobs`). Drop migration (D7) is gated on the assertion query result, not a calendar.

### R4: Endpoint URL break despite the redirector
**Risk.** A caller hits `/api/admin/pipelines/scheduled` with a `Content-Type: text/plain` body or some other variant the redirector's payload parser doesn't replicate; the legacy runner tolerated it (because `request.json().catch(() => ({}))`), the new path doesn't.
**Mitigation.** Redirector reuses the exact same parsing logic from the legacy handler (`request.json().catch(() => ({}))`) — the parser is moved verbatim, not rewritten. Contract test in CI: replay a captured set of real-world admin requests (from production logs, sanitized) against the redirector; assert response shape unchanged.

### R5: Tool-registry adapter dependency
**Risk.** `src/lib/pipelines/tool-registry.ts` is imported by the admin pipelines endpoint to power `listTools()`. Deleting the runner without addressing the registry breaks the GET handler that returns the tool list.
**Mitigation.** `tool-registry.ts` is already a thin adapter over `agent-foundation`'s central registry; the redirector swaps `listTools()` from `src/lib/pipelines/tool-registry.ts` to the equivalent from `agent-foundation` and the file becomes unimported. Deletion of `tool-registry.ts` follows the same 4+4 grace as the rest of `src/lib/pipelines/`. Open Question Q1 covers whether any external (non-tree) caller depends on its specific shape.

## Migration Plan

Each step is a single PR, gated by a feature flag, with documented rollback.

**Step 1 — Author ported flow YAMLs + parity test scaffolding.**
- One PR per pipeline (13 PRs total, can land in parallel after the scaffold lands)
- First PR introduces the parity test suite (`src/lib/agent-pipelines-unify/__tests__/parity.test.ts`) skeleton + fixture directory + `MockModelProvider` for LLM steps
- Subsequent PRs each land one `flows/pipelines/<id>.yaml` + one fixture + the parity test row for that pipeline
- No runtime change; no admin endpoint change; legacy pipeline runner unaffected
- **Rollback.** Delete the YAML file and fixture; CI reverts to passing without that row

**Step 2 — Land the dual-path execution hook.**
- Add `ctx.waitUntil(runFlow(...))` shadow execution inside `runPipeline`, behind flag `AGENT_PIPELINES_UNIFY_SHADOW=false`
- Default off — flipping to true in production triggers shadow execution of every pipeline run; output is logged to a new `pipeline_flow_parity_drift` table (a 3-column scratch table: `pipeline_id`, `drift_kind`, `created_at`) for monitoring
- **Rollback.** Set flag false; shadow stops; no production-path impact

**Step 3 — Open the 4-week dual-path window.**
- Enable `AGENT_PIPELINES_UNIFY_SHADOW=true` in production
- Add the `pipeline_flow_parity_drift` count to the daily admin dashboard
- Goal: 28 consecutive days of zero drift events (or, for any drift event, root-caused fix lands and timer resets)
- **Rollback.** Disable the shadow flag; investigation reopens against whatever pipeline drifted

**Step 4 — Land the redirector.**
- Ship the redirector code in `src/pages/api/admin/pipelines.ts` and `src/pages/api/admin/pipelines/scheduled.ts`, gated by `AGENT_PIPELINES_UNIFY_REDIRECT=false`
- When false, the handler still calls `runPipeline`; when true, it calls `runFlow`
- Contract test (R4 mitigation) is added in the same PR
- **Rollback.** Set flag false; admin endpoints return to legacy runner

**Step 5 — Run the data migration, then flip the redirector flag.**
- Run `0019_admin_jobs_to_flow_runs.sql` (D3) against production D1 via `wrangler d1 migrations apply` after a manual export-to-R2 of `admin_jobs` / `admin_job_steps` / `admin_job_artifacts`
- Verify the admin read-side union shows the same job ids before and after migration; only then set `AGENT_PIPELINES_UNIFY_REDIRECT=true` on a Tuesday (R2 mitigation)
- Monitor cron runs for one full week; verify zero `failed` status on the flow-runtime side of cron flows
- **Rollback.** Set flag false; runs revert to legacy; migrated rows can be deleted via `0019_admin_jobs_to_flow_runs_rollback.sql` (no data loss because the rollback only removes the migration's inserts, originals untouched in `admin_jobs`)

**Step 6 — Delete the pipeline runtime.**
- After 4 weeks of redirector-live and zero rollback events: delete `src/lib/pipelines/runner.ts`, `src/lib/pipelines/registry.ts`, `src/lib/pipelines/job-store.ts`, the modules they uniquely import that aren't reused elsewhere (most `src/lib/pipelines/modules/*` stay because the flow steps call them), and `src/lib/pipelines/guards/*` if `agent-policy` has subsumed them by that point
- Remove the `AGENT_PIPELINES_UNIFY_REDIRECT` and `AGENT_PIPELINES_UNIFY_SHADOW` flags from `src/lib/config/flags.ts`
- After 90 days of zero `admin_jobs` writes (D7), ship `0020_drop_admin_jobs.sql`
- **Rollback.** Revert the deletion PR — restores files from git; no D1 state is involved at this point

**Pre-merge verification per step (matches agent-os Step 5).**
- `pnpm lint` — oxlint clean
- `pnpm build` — astro check + production build
- `pnpm test` — parity suite + existing tests pass
- `pnpm check:references` — internal cross-references unchanged
- Manual smoke per step: hit one admin endpoint at least once before merge

## Open Questions

### Q1: Which pipeline is the riskiest port?

**Discussion.** Candidates by complexity / risk-class / external-call count:
- `translation` — 9 stages, `risk: 'high'`, writes markdown, 3 LLM agents (translate / cultural / native), 1 human-review gate; longest legacy `maxRuntimeMs` (1_200_000 ms = 20 minutes). Highest blast radius if drift.
- `research-brief` — 6 stages, `risk: 'high'`, writes markdown, 1 LLM agent that fans out internally to multiple `runResearchBrief` stages.
- `crawl-sync` — only 2 stages and `risk: 'medium'`, but uses `CRAWL_SECRET` for auth and emits target-error counts; secret handling at the redirector boundary needs care.

**Default if probe inconclusive.** Port `translation` last; port `freshness-review` first (smallest, runs on weekly cron in production so dual-path observation is genuine but stakes are low — a missed freshness scan is recoverable next week). The order is recorded in the Migration Plan's Step 1 PR backlog.

### Q2: Should `admin_jobs` reads also redirect, or only writes?

**Discussion.** D4 covers write-path redirector (`POST` endpoints). The admin GET endpoints (`GET /api/admin/pipelines` returning `listJobs(db, 10)`) currently read from `admin_jobs`. Once D6 Phase 2 lands, new rows go only to `flow_runs`, so the GET would silently stop showing recent jobs. Options: (a) GET also redirects, reading from `flow_runs WHERE parent_kind IN ('pipeline','flow')`; (b) GET dual-reads during Phase 2 (UNION over both tables); (c) GET keeps its shape but sources from `flow_runs` only (after the D3 migration that backfills history).

**Decision.** Option (b) during the transition — GET dual-reads via `flow_runs WHERE parent_kind='pipeline'` UNION `admin_jobs`, deduped by `parent_external_id`. This is deliberately a little more code because it protects the UI during the whole migration / rollback window. After the `admin_jobs` drop migration lands, the read path simplifies to `flow_runs` only.

### Q3: Archive strategy for old `admin_jobs` data — beyond the pre-drop export?

**Discussion.** D7 commits to a logical export to R2 (180-day retention) immediately before the table drop. Open question: do we need a longer-term archive (e.g. cold storage in R2 with 5-year retention) for compliance / audit-trail purposes, given that some pipelines (`translation`, `research-brief`) produced markdown drafts that became published posts? The drafts themselves are in git; the *job that produced them* is the audit trail.

**Default if probe inconclusive.** No long-term archive. The 180-day export is sufficient: (a) published posts live in git with full history; (b) `flow_runs` rows for the same jobs (post-migration) carry the same lifecycle metadata; (c) the `admin_jobs` rows duplicate information already present elsewhere. Re-open if a compliance requirement surfaces during the 4-week dual-path window.
