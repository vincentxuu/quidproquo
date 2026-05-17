## ADDED Requirements

### Requirement: Grace-period deprecation warning

During the 4-week grace period after the flow ports land, `src/lib/pipelines/runner.ts` SHALL emit a single deprecation warning on every invocation. The warning MUST include the pipeline id, the equivalent flow path, and a removal date. The warning SHALL be routed through the existing logger (not raw `console.warn`) so it surfaces in Workers logs and admin UI traces.

The runner MUST continue to execute correctly during the grace period — the warning is observational only and SHALL NOT change run behavior, status, or artifacts.

#### Scenario: Warning emitted on every legacy run

- **WHEN** any caller invokes `runner.runPipeline(id, input)` during the grace period
- **THEN** the logger SHALL receive one `deprecated: pipelines.runner` event with fields `{ pipelineId, flowPath, removalDate }` and the run SHALL complete with unchanged output

#### Scenario: Warning does not alter run output

- **WHEN** the parity test compares pre-deprecation output to post-deprecation output for the same input
- **THEN** outputs SHALL be byte-identical except for the new log line

### Requirement: Admin endpoint redirects to flow equivalent

`POST /api/admin/pipelines/:id/run` and `POST /api/admin/pipelines/scheduled` SHALL act as thin redirectors that translate the legacy pipeline payload into the flow runtime's input shape and forward to the corresponding `/api/admin/flows/...` endpoint (per design D4 in the proposal). Response status, body schema, and HTTP semantics SHALL remain unchanged so existing admin UI and curl callers keep working.

The redirector MUST preserve all auth, request id, and admin-scope checks.

#### Scenario: Redirect translates payload

- **WHEN** an admin issues `POST /api/admin/pipelines/research-brief/run` with body `{ inputs: { topic: 'x' } }`
- **THEN** the handler SHALL invoke the flow runtime for `flows/pipelines/research-brief.yaml` with the translated input and SHALL return a response with the same status code and body schema the legacy runner produced

#### Scenario: Auth checks still enforced

- **WHEN** an unauthenticated request hits the legacy URL
- **THEN** the redirector SHALL return HTTP 401 before any forwarding occurs

### Requirement: Cron triggers continue firing without modification

Cron entries in `wrangler.jsonc` that currently invoke pipeline routes SHALL keep firing without configuration changes. Because the redirectors preserve URLs and payloads, the cron handler SHALL route through the flow runtime transparently and produce equivalent `flow_runs` rows with `trigger='cron'`.

#### Scenario: Cron fires flow run successfully

- **WHEN** the Cloudflare cron handler fires a pipeline URL during the grace period
- **THEN** a row SHALL appear in `flow_runs` with `parent_kind='pipeline'`, `trigger='cron'`, and terminal status `done` on success — without any change to `wrangler.jsonc`

### Requirement: Runner removal after grace period

After the 4-week grace period expires, `src/lib/pipelines/runner.ts`, `src/lib/pipelines/registry.ts`, and `src/lib/pipelines/job-store.ts` SHALL be deleted. `src/lib/pipelines/tool-registry.ts` MAY remain as an adapter shape if external callers still depend on it; otherwise it SHALL also be deleted. Any remaining import of the deleted modules SHALL fail at build time (TypeScript `Cannot find module`) so dead callers are caught before deploy.

#### Scenario: Removal breaks unused legacy import

- **WHEN** the cleanup commit lands and a stale import like `import { runPipeline } from '@/lib/pipelines/runner'` exists anywhere in `src/`
- **THEN** `pnpm build` SHALL fail with a TypeScript module resolution error and the PR check SHALL block merge

#### Scenario: Files actually deleted

- **WHEN** a reviewer runs `git ls-files src/lib/pipelines/` after the cleanup PR merges
- **THEN** `runner.ts`, `registry.ts`, and `job-store.ts` SHALL NOT appear in the output
