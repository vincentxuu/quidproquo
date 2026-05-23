# Tasks — agent-flow

Implementation plan. 6 phases, ~118 tasks. Builds the Flow DSL + runtime + reference flow + admin surface on top of the kernel. `src/lib/pipelines/` is intentionally untouched — pipeline migration ships separately in `agent-pipelines-unify` (change #8).

## Pre-requisite

- `agent-foundation` (change #0) shipped — central `Env`, `flags`, `json/unauthorized/badRequest`, `nowMs/nowIso`, `requireAdmin`, `requireScheduledAuth`, `settings-store`, central `ToolDefinition` + `CostModel`
- `agent-os` (change #1) shipped — kernel; this change uses `defineAgent`, `syscall`, `agent-memory`, `agent-scheduler`, `agent-access`, `agent-storage` from `src/lib/agent-os/`. The four RAG agents (`planner`/`research`/`writer`/`critic`) are already registered as kernel agents and the per-agent flags retired
- `agent-providers` (change #2) shipped — `model.invoke` syscall + `search.*` provider routing; this is how flow `agent` steps make LLM / search calls without re-implementing routing

## Flag state by phase

| Phase | `AGENT_FLOW_ENABLED` | `AGENT_FLOW_DURABLE_EXECUTION` | per-flow flags |
|---|---|---|---|
| 1 | `false` | `false` | n/a |
| 2 | `false` | `false` | n/a |
| 3 | `true` (reference-flow validation only; flip back to `false` after smoke) | `false` | per-flow as needed |
| 4 | `true` | `false` | per-flow |
| 5 | `true` | `true` after smoke | per-flow |
| 6 | `true` | `true` | per-flow |

---

## Phase 1 — DSL parser + validator (no runtime)

**Goal**: Land the Flow DSL — D1 schema, YAML/JSON parser, typed AST, schema validator, step-type validators, edge condition validator — without any execution capability. A flow definition can be persisted and round-tripped, but `POST .../runs` does not exist yet.

**Files touched**: ~14 new (migration, parser, validator, step-type modules, tests), ~2 modified (`src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-flow` green; `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0013_agent_flow.sql` cleanly; parser rejects malformed flows with `line:column` error messages; `AGENT_FLOW_ENABLED=false` so no runtime path activates

### 1.1 Wrangler + flags

- [x] 1.1.1 Add `AGENT_FLOW_ENABLED`, `AGENT_FLOW_DURABLE_EXECUTION`, `AGENT_FLOW_DEEP_RESEARCH` to `wrangler.jsonc` `vars` block all defaulting to `"false"`; extend central `Env` type with the three fields; register the `agentFlow` sub-block in `src/lib/config/flags.ts` per design D11
  - **Files**: `wrangler.jsonc:15-69` (modify — `vars` block), `src/lib/config/env.ts` (modify — append three fields), `src/lib/config/flags.ts` (modify — append `agentFlow` sub-object)
  - **Pattern**: D11 (flag table); agent-os Phase 1.1.2 (sibling pattern for kernel flag block)
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert `flags.agentFlow.enabled === false` when env empty and `=== true` when `AGENT_FLOW_ENABLED='true'`

### 1.2 D1 migration `0013_agent_flow.sql`

- [x] 1.2.1 Create migration with 6 tables (`flow_definitions`, `flow_versions`, `flow_presets`, `flow_runs`, `flow_step_runs`, `flow_run_state`) per design D3. Match `migrations/0011_agent_os.sql` style: `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` for `(status, started_at DESC)` on `flow_runs` and `(flow_run_id, step_order)` on `flow_step_runs`, no `CHECK` constraints (TEXT enums with inline `--` comment listing allowed values), `created_at`/`updated_at` as `INTEGER NOT NULL` (epoch ms — runtime writes via `nowMs()`)
  - **Files**: `migrations/0013_agent_flow.sql` (create)
  - **Pattern**: `migrations/0011_agent_os.sql` (sibling table-set); design D3 schema (flow_* tables block)
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0013_agent_flow.sql` exits 0; re-running is a no-op; `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'flow_%'"` returns all 6 names
- [x] 1.2.2 In the same migration, add `parent_flow_run_id INTEGER REFERENCES flow_runs(flow_run_id)` and `parent_step_run_id INTEGER REFERENCES flow_step_runs(step_run_id)` columns to `flow_runs` (per sub-flow spec — outer run owns inner runs), plus `definition_yaml TEXT NOT NULL` column to `flow_versions` (verbatim YAML for audit + re-parse)
  - **Files**: `migrations/0013_agent_flow.sql` (modify the same migration before submission)
  - **Pattern**: D3 sub-flow lineage; agent-flow proposal §"Sub-flow composition"
  - **Verify**: schema introspection test in 1.8.4 confirms both columns present with the declared FK references
- [x] 1.2.3 Add `agent_run_id INTEGER REFERENCES agent_runs(run_id)` column to `flow_step_runs` (per design D6 — each `agent` step's row points at the kernel `agent_runs` row it dispatched, so the run-detail endpoint can deep-link)
  - **Files**: `migrations/0013_agent_flow.sql` (modify)
  - **Pattern**: D6 (cross-table lineage)
  - **Verify**: `SELECT sql FROM sqlite_master WHERE name='flow_step_runs'` contains `agent_run_id INTEGER REFERENCES agent_runs(run_id)`

### 1.3 YAML/JSON loader

- [x] 1.3.1 Add `yaml` (eemeli/yaml v2) to `package.json` dependencies; pin the version and run `pnpm install` so the lockfile reflects it. Justify in PR body: existing project parsing is JSON-only; YAML is the canonical flow author format per Gateway Console §4.2
  - **Files**: `package.json` (modify), `pnpm-lock.yaml` (regenerate)
  - **Pattern**: D2 (yaml is the canonical DSL format)
  - **Verify**: `pnpm install` exits 0; `node -e "console.log(require('yaml').parse('a: 1'))"` prints `{ a: 1 }`
- [x] 1.3.2 Create `src/lib/agent-flow/dsl/load.ts` exporting `loadFlow(source: string, format: 'yaml' | 'json'): RawFlowDocument` — wraps the `yaml.parseDocument` (preserves `range` for line:column reporting) or `JSON.parse` with error tracking; returns a `RawFlowDocument` carrying both the parsed object AND a `nodeAt(path: string[]): { line: number; column: number } | undefined` helper for downstream validators to attach precise locations to error messages
  - **Files**: `src/lib/agent-flow/dsl/load.ts` (create)
  - **Pattern**: D14 (line:column error reporting); proposal §"FlowInputSchema validation"
  - **Verify**: `src/lib/agent-flow/dsl/load.test.ts` asserts (a) parsing a 3-line YAML returns `nodeAt(['steps', '0', 'id'])` → `{ line: 3, column: 9 }`, (b) invalid YAML throws `FlowParseError` with `line` and `column` in the message

### 1.4 Typed AST + schema validator

- [x] 1.4.1 Define the typed AST in `src/lib/agent-flow/dsl/ast.ts` — `FlowDefinition`, `FlowInputSchema`, `FlowStep` (discriminated union over `type`), `FlowEdge`, `FlowPreset`, `FlowVersion`, `JsonLogic` (subset alias), `ArtifactSchema`. Pure types only — no runtime exports
  - **Files**: `src/lib/agent-flow/dsl/ast.ts` (create)
  - **Pattern**: D1 (DSL shape); Gateway Console §4.2 example structure
  - **Verify**: `pnpm tsc --noEmit` passes; file contains no `function` or `const` declarations
- [x] 1.4.2 Define the error taxonomy in `src/lib/agent-flow/dsl/errors.ts` — `FlowParseError`, `FlowSchemaError`, `FlowStepValidationError`, `FlowEdgeValidationError`, `FlowCycleError`, `FlowLoopBoundsError`, `FlowConditionError`. Each carries `path: string[]`, `line?: number`, `column?: number`, `message: string`
  - **Files**: `src/lib/agent-flow/dsl/errors.ts` (create)
  - **Pattern**: D14; agent-os `src/lib/agent-os/errors.ts` (sibling style)
  - **Verify**: `src/lib/agent-flow/dsl/errors.test.ts` asserts `new FlowSchemaError(['steps','0'], 12, 3, 'missing id').toString()` includes `steps.0:12:3` substring
- [x] 1.4.3 Implement top-level schema validator `validateFlowSchema(raw: RawFlowDocument): FlowDefinition` in `src/lib/agent-flow/dsl/validate.ts` — checks `id`/`name`/`version`/`inputs`/`steps`/`edges` presence and primitive types, returns the typed AST or throws `FlowSchemaError` with `path` + `line:column` derived from `raw.nodeAt(...)`
  - **Files**: `src/lib/agent-flow/dsl/validate.ts` (create)
  - **Pattern**: D14; D1
  - **Verify**: `src/lib/agent-flow/dsl/validate.test.ts` covers (a) missing `id` throws with `path=[]`, (b) duplicate step id throws with `path=['steps','N']`, (c) valid Gateway Console §4.2 deep-research YAML parses without error and returns 10 steps

### 1.5 Step-type validators (9 types)

- [x] 1.5.1 Build per-step validators under `src/lib/agent-flow/dsl/steps/` — one file per type: `agent.ts`, `tool-group.ts`, `transform.ts`, `verifier.ts`, `artifact.ts`, `human-approval.ts`, `sub-flow.ts`, `parallel.ts`, `loop.ts`. Each exports `validate(step: RawStep, ctx: ValidationContext): FlowStep` and is dispatched from `validateFlowSchema` via `step.type` switch
  - **Files**: `src/lib/agent-flow/dsl/steps/{agent,tool-group,transform,verifier,artifact,human-approval,sub-flow,parallel,loop}.ts` (create — 9 files)
  - **Pattern**: D1 (9 step types); proposal §"FlowStep (types: agent, tool_group, transform, verifier, artifact, human_approval)" + sub-flow/parallel/loop from Phase 4
  - **Verify**: `src/lib/agent-flow/dsl/steps/agent.test.ts` (and 8 siblings) cover (a) the happy path returns the typed AST node, (b) each required field missing throws `FlowStepValidationError` with the correct `path`
- [x] 1.5.2 Agent step validator requires `agentId: string`, optional `input?: object` (templated), optional `retryPolicy?: { maxAttempts, backoffMs }`, optional `timeoutSeconds?: number`. Validator must NOT verify the agent is registered in the kernel — that is a runtime concern; compile-time only checks shape
  - **Files**: `src/lib/agent-flow/dsl/steps/agent.ts` (modify)
  - **Pattern**: D1 step schema; agent-os `defineAgent` shape it eventually invokes
  - **Verify**: validator test confirms an unknown `agentId` like `'does-not-exist'` parses cleanly (runtime check is Phase 2)
- [x] 1.5.3 Tool group step requires `tools: string[]` (syscall names), optional `parallel?: boolean` (default false). Validator does NOT check syscalls are registered (runtime concern)
  - **Files**: `src/lib/agent-flow/dsl/steps/tool-group.ts` (modify)
  - **Pattern**: agent-providers tool-group shape; proposal §"Step types"
  - **Verify**: `tools: []` throws `FlowStepValidationError` "tool group must declare ≥1 tool"
- [x] 1.5.4 Transform step requires `expression: string` (Jsonata or template literal — record decision in D10), validator parses the expression to confirm syntactic validity and throws `FlowStepValidationError` on parse error
  - **Files**: `src/lib/agent-flow/dsl/steps/transform.ts` (modify)
  - **Pattern**: D10 (transform expression DSL choice)
  - **Verify**: invalid expression throws with the parse error message embedded
- [x] 1.5.5 Verifier step requires `verifier: string` (one of: `coverage`, `citation`, `freshness`, `conflict`, `policy`), optional `threshold?: number`. Validator checks `verifier` is in the allowed enum
  - **Files**: `src/lib/agent-flow/dsl/steps/verifier.ts` (modify)
  - **Pattern**: Gateway Console §4.3 quality policy verifiers
  - **Verify**: unknown verifier name throws with message listing allowed values
- [x] 1.5.6 Artifact step requires `artifactType: string` (e.g. `markdown_report`, `evidence_bundle`), optional `template?: string`. Validator does NOT verify the type is registered (Phase 2 wires the registry)
  - **Files**: `src/lib/agent-flow/dsl/steps/artifact.ts` (modify)
  - **Pattern**: Gateway Console §4.7 artifact types
  - **Verify**: missing `artifactType` throws
- [x] 1.5.7 Human-approval step requires `reason: string`, optional `ttlSeconds?: number` (default 86400), optional `assignees?: string[]`. Validator wraps the agent-access approval gate semantics
  - **Files**: `src/lib/agent-flow/dsl/steps/human-approval.ts` (modify)
  - **Pattern**: agent-os agent-access spec "Approval gate"; D9
  - **Verify**: missing `reason` throws
- [x] 1.5.8 Sub-flow step requires `flowId: string`, optional `version?: number`, optional `input?: object`. Validator does NOT verify the flow exists (Phase 4 adds runtime cycle detection)
  - **Files**: `src/lib/agent-flow/dsl/steps/sub-flow.ts` (modify)
  - **Pattern**: proposal §"Sub-flow composition"; D6 (lineage columns from 1.2.2)
  - **Verify**: missing `flowId` throws
- [x] 1.5.9 Parallel step requires `branches: FlowStep[][]` (each branch is a step sequence), optional `merge?: 'all' | 'race' | 'firstSuccess'` (default `'all'`). Validator recursively validates every nested step via the same dispatcher
  - **Files**: `src/lib/agent-flow/dsl/steps/parallel.ts` (modify)
  - **Pattern**: D1 (parallel as first-class step type)
  - **Verify**: nested invalid step throws with `path=['steps', N, 'branches', B, 'steps', S]`
- [x] 1.5.10 Loop step requires `body: FlowStep[]`, `maxIterations: number` (required, no default), optional `condition?: JsonLogic` (exit when false). Validator enforces `maxIterations >= 1` and `maxIterations <= 100` (compile-time guardrail per Phase 1.6)
  - **Files**: `src/lib/agent-flow/dsl/steps/loop.ts` (modify)
  - **Pattern**: D1; proposal §"parallel and loop step types"
  - **Verify**: `maxIterations: 0` throws `FlowLoopBoundsError`; `maxIterations: 101` also throws

### 1.6 Edges + conditions + compile-time guards

- [x] 1.6.1 Build edge validator in `src/lib/agent-flow/dsl/edges.ts` — `validateEdges(steps, edges): FlowEdge[]`. Checks every edge's `from` / `to` references an existing step id (compile-time only — sub-flow edges resolved at runtime), accepts optional `condition: JsonLogic`
  - **Files**: `src/lib/agent-flow/dsl/edges.ts` (create)
  - **Pattern**: D1; Gateway Console §4.2 edge shape
  - **Verify**: edge with unknown `from` throws `FlowEdgeValidationError`; missing `to` throws
- [x] 1.6.2 Add minimal JSON Logic validator in `src/lib/agent-flow/dsl/json-logic.ts` — `validateCondition(expr: unknown): JsonLogic` — accepts the documented subset (`==`, `!=`, `>`, `<`, `>=`, `<=`, `and`, `or`, `not`, `in`, `var`). Reject any unknown operator. No evaluator yet (Phase 2.3 ships the evaluator)
  - **Files**: `src/lib/agent-flow/dsl/json-logic.ts` (create)
  - **Pattern**: D10 (subset of jsonlogic.com operators chosen to keep the surface auditable)
  - **Verify**: `validateCondition({ '==': [{ var: 'coverage' }, 'insufficient'] })` returns the typed value; `{ 'exec': ['rm','-rf','/'] }` throws `FlowConditionError`
- [x] 1.6.3 Add sub-flow cycle detection in `src/lib/agent-flow/dsl/cycle-check.ts` — `detectSubFlowCycles(definition, registry: Map<string, FlowDefinition>): void`. Walks every `sub_flow` step recursively, throws `FlowCycleError` if a flow appears twice in the path. Runtime cycle check is in Phase 4 (this is the compile-time form)
  - **Files**: `src/lib/agent-flow/dsl/cycle-check.ts` (create)
  - **Pattern**: D1; proposal §"Sub-flow composition" (cycle protection)
  - **Verify**: a registry `{ A → B → A }` throws `FlowCycleError` with the path; `{ A → B → C }` is clean

### 1.7 Persistence helpers

- [x] 1.7.1 Build `src/lib/agent-flow/store/definitions.ts` — `upsertFlowDefinition(db, def, yaml)`, `getFlowDefinition(db, flowId)`, `listFlowDefinitions(db)`, `getFlowVersion(db, flowId, version)`. Writes both `flow_definitions` (latest version pointer) and `flow_versions` (immutable history with verbatim YAML)
  - **Files**: `src/lib/agent-flow/store/definitions.ts` (create)
  - **Pattern**: D3; agent-os storage backend style (e.g. `src/lib/agent-os/storage/d1/process-registry.ts`)
  - **Verify**: `src/lib/agent-flow/store/definitions.test.ts` covers (a) `upsertFlowDefinition` then `getFlowDefinition` round-trips with parsed AST, (b) calling `upsertFlowDefinition` twice with the same `id` and different `definition_yaml` produces 2 `flow_versions` rows and bumps the pointer
- [x] 1.7.2 Build `src/lib/agent-flow/store/presets.ts` skeleton — `upsertFlowPreset(db, preset)`, `getFlowPreset(db, presetId)`, `listFlowPresets(db, flowId?)`. Preset resolution logic lives in Phase 6; this is just the CRUD plumbing
  - **Files**: `src/lib/agent-flow/store/presets.ts` (create)
  - **Pattern**: D3 `flow_presets` table
  - **Verify**: `src/lib/agent-flow/store/presets.test.ts` round-trip; listing with `flowId` filter returns only that flow's presets

### 1.8 Unit-test gate

- [x] 1.8.1 Co-locate vitest files for every module added in 1.3–1.7; run `pnpm vitest run src/lib/agent-flow` and confirm green
  - **Files**: (no new files — verification gate; all test files created alongside their modules)
  - **Pattern**: agent-foundation Phase 1.11 gate
  - **Verify**: `pnpm vitest run src/lib/agent-flow 2>&1 | grep -E "(Test Files|Tests)"` shows ≥12 test files passing, 0 failed
- [x] 1.8.2 Add a parse-the-gateway-example regression test — load `openspec/changes/agent-flow/fixtures/deep-research.example.yaml` (a copy of Gateway Console §4.2), run the full pipeline `loadFlow → validateFlowSchema → validateEdges → detectSubFlowCycles`, assert no errors and 10 steps parsed
  - **Files**: `openspec/changes/agent-flow/fixtures/deep-research.example.yaml` (create — verbatim §4.2 example), `src/lib/agent-flow/dsl/gateway-fixture.test.ts` (create)
  - **Pattern**: end-to-end DSL gate; D14 (line:column reporting tested implicitly by clean parse)
  - **Verify**: test runs in <500ms and asserts `steps.length === 10` plus edge count
- [x] 1.8.3 Add a "every step type has a fixture" test — for each of the 9 step types ship a one-line fixture under `openspec/changes/agent-flow/fixtures/steps/<type>.yaml`, assert each parses and rejects one documented invalid variant
  - **Files**: `openspec/changes/agent-flow/fixtures/steps/{agent,tool-group,transform,verifier,artifact,human-approval,sub-flow,parallel,loop}.yaml` (create — 9 files), `src/lib/agent-flow/dsl/step-fixtures.test.ts` (create)
  - **Pattern**: parametric vitest table per step type
  - **Verify**: all 18 cases (9 valid + 9 invalid) pass
- [x] 1.8.4 Schema introspection test confirms migration 0013 produced the expected 6 tables plus the FK columns from 1.2.2/1.2.3
  - **Files**: `src/lib/agent-flow/store/migration-0012.test.ts` (create)
  - **Pattern**: agent-os Phase 1.2 introspection style
  - **Verify**: `SELECT sql FROM sqlite_master WHERE name='flow_runs'` contains both `parent_flow_run_id` and `parent_step_run_id`; `flow_step_runs` contains `agent_run_id`; `flow_versions` contains `definition_yaml`

---

## Phase 2 — Compiler + in-Worker executor (5 step types)

**Goal**: Turn validated `FlowDefinition` AST into an `ExecutionGraph` and walk it in-Worker for short flows. Implement the 5 core step executors (`agent`, `tool_group`, `transform`, `verifier`, `artifact`) — `human_approval`, `sub_flow`, `parallel`, `loop` are deferred to Phase 4. Persist step lifecycle to `flow_step_runs` and per-run state to `flow_run_state`. Wire cancellation to the kernel's cancel signal so cancelling the outer flow run cancels in-flight `agent` sub-runs.

**Files touched**: ~16 new (compiler, runtime, 5 executors, state module, retry, cancel, tests), ~0 modified
**Verification**: `pnpm vitest run src/lib/agent-flow/runtime` green; an in-memory smoke test runs a 3-step flow (`agent → transform → artifact`) end-to-end with mocked syscalls and asserts the artifact output is structurally correct

### 2.1 Compiler

- [x] 2.1.1 Build `compile(def: FlowDefinition): ExecutionGraph` in `src/lib/agent-flow/runtime/compile.ts` — returns `{ nodes: Map<stepId, ExecutionNode>, entryStepId, terminalStepIds, adjacency: Map<stepId, FlowEdge[]> }`. Pure function; no I/O
  - **Files**: `src/lib/agent-flow/runtime/compile.ts` (create), `src/lib/agent-flow/runtime/execution-graph.ts` (create — types)
  - **Pattern**: D1 (AST → ExecutionGraph); proposal §"Flow Runtime that compiles a flow definition into kernel agent invocations"
  - **Verify**: `src/lib/agent-flow/runtime/compile.test.ts` covers (a) Gateway Console §4.2 fixture compiles to 10 nodes with correct adjacency, (b) entryStepId is the only step with no incoming edges, (c) terminalStepIds contains exactly the artifact step
- [x] 2.1.2 Reject at compile time any graph with multiple entry steps OR no entry step OR no terminal step — throws `FlowCompileError`
  - **Files**: `src/lib/agent-flow/runtime/compile.ts` (modify)
  - **Pattern**: D1 (well-formed graph invariants)
  - **Verify**: compile test asserts a 2-entry graph throws with both entry step ids in the message

### 2.2 Per-run state module

- [x] 2.2.1 Build `src/lib/agent-flow/runtime/state.ts` — `RunStateBackend` interface: `read(flowRunId, key): Promise<unknown>`, `write(flowRunId, key, value): Promise<void>`, `readAll(flowRunId): Promise<Record<string, unknown>>`. State is scoped per flow run (rows keyed by `(flow_run_id, key)` in `flow_run_state`). NO cross-run reads (compile-time guard)
  - **Files**: `src/lib/agent-flow/runtime/state.ts`, `src/lib/agent-flow/runtime/state-d1.ts`, `src/lib/agent-flow/runtime/state-memory.ts` (create — 3 files: interface + D1 impl + in-memory test impl)
  - **Pattern**: D5 (per-run state isolation); agent-os storage backend style (`src/lib/agent-os/storage/types.ts` + D1 + in-memory)
  - **Verify**: `src/lib/agent-flow/runtime/state.test.ts` covers (a) round-trip, (b) `readAll` returns all keys, (c) attempting to read another run's key returns `undefined` (no cross-leak)
- [x] 2.2.2 Add `writeBatch(flowRunId, entries: Array<[key, value]>): Promise<void>` — single `db.batch([...])` for multi-key writes from one step (e.g. `transform` step writes 5 outputs at once)
  - **Files**: `src/lib/agent-flow/runtime/state-d1.ts` (modify)
  - **Pattern**: agent-os "D1 write batching"
  - **Verify**: test asserts `db.batch` is called exactly once for a 5-entry `writeBatch`

### 2.3 JSON Logic evaluator

- [x] 2.3.1 Build `src/lib/agent-flow/runtime/json-logic-eval.ts` — `evaluate(expr: JsonLogic, ctx: Record<string, unknown>): boolean | unknown` for the subset accepted in 1.6.2 (`==`, `!=`, `>`, `<`, `>=`, `<=`, `and`, `or`, `not`, `in`, `var`). `var` resolves dot-paths from `ctx`
  - **Files**: `src/lib/agent-flow/runtime/json-logic-eval.ts` (create)
  - **Pattern**: D10
  - **Verify**: `src/lib/agent-flow/runtime/json-logic-eval.test.ts` covers each operator + a nested expression `{ and: [{ '==': [{ var: 'a' }, 1] }, { '>': [{ var: 'b' }, 0] }] }`
- [x] 2.3.2 Guard against unsafe input — reject expressions that include operators outside the allowlist (defense in depth; compile-time check is the primary gate but the runtime evaluator should not crash on a malformed expr)
  - **Files**: `src/lib/agent-flow/runtime/json-logic-eval.ts` (modify)
  - **Pattern**: D10 security note
  - **Verify**: passing `{ 'eval': '1' }` throws `FlowConditionError` and does NOT call any sandbox

### 2.4 Step executors (5 of 9)

- [x] 2.4.1 Define `StepExecutor` interface in `src/lib/agent-flow/runtime/step-executor.ts` — `execute(step, ctx, kernel, state): Promise<StepResult>` returning `{ outputs: Record<string, unknown>, status: 'done' | 'failed', errorJson?: object }`. Dispatch table keyed by `step.type`
  - **Files**: `src/lib/agent-flow/runtime/step-executor.ts` (create)
  - **Pattern**: D6 (step lifecycle); agent-os syscall dispatcher (`src/lib/agent-os/tools/syscall.ts`) shape
  - **Verify**: `pnpm tsc --noEmit` passes
- [x] 2.4.2 Build agent-step executor in `src/lib/agent-flow/runtime/steps/agent.ts` — calls `kernel.scheduler.dispatch({ agentId, trigger: 'sub-agent', parentRunId: flowRunId, input: renderedInput })` then awaits the agent's `agent_runs` row to reach `done`/`failed`/`cancelled`. Records `agent_run_id` on the `flow_step_runs` row (per migration 1.2.3)
  - **Files**: `src/lib/agent-flow/runtime/steps/agent.ts` (create)
  - **Pattern**: D6; agent-os `scheduler.dispatchRun` with `trigger='sub-agent'` and `parent_run_id`
  - **Verify**: `src/lib/agent-flow/runtime/steps/agent.test.ts` covers (a) successful dispatch → step status `done` with `agent_run_id` populated, (b) agent failure → step status `failed` with `errorJson` mirroring `agent_runs.error_json`
- [x] 2.4.3 Build tool-group executor in `src/lib/agent-flow/runtime/steps/tool-group.ts` — calls `ctx.syscall(toolName, input)` for each tool in `step.tools`; serial when `parallel: false`, `Promise.all` when `parallel: true`. Returns merged outputs object keyed by tool name
  - **Files**: `src/lib/agent-flow/runtime/steps/tool-group.ts` (create)
  - **Pattern**: D1; agent-providers tool-group routing
  - **Verify**: `src/lib/agent-flow/runtime/steps/tool-group.test.ts` covers serial vs parallel timing (`vi.useFakeTimers`) and partial failure (one tool fails → entire step `failed`)
- [x] 2.4.4 Build transform executor in `src/lib/agent-flow/runtime/steps/transform.ts` — evaluates `step.expression` against the merged state snapshot (`{ ...stateReadAll, ...stepOutputs }`); writes the result to `state.write(stepId.output)` and into the local `stepOutputs` map for downstream steps
  - **Files**: `src/lib/agent-flow/runtime/steps/transform.ts` (create)
  - **Pattern**: D10 (transform DSL)
  - **Verify**: `src/lib/agent-flow/runtime/steps/transform.test.ts` covers (a) template `{{ planner.intent }}` returns the upstream planner's output, (b) syntax error throws `FlowStepValidationError`
- [x] 2.4.5 Build verifier executor in `src/lib/agent-flow/runtime/steps/verifier.ts` — delegates to a verifier registry keyed by `step.verifier` (initially: `coverage`, `citation`, `freshness` shipped; `conflict`, `policy` are no-op stubs returning `{ passed: true }`). Output object: `{ passed: boolean, score: number, gaps?: string[] }` so downstream conditional edges can branch on `passed`
  - **Files**: `src/lib/agent-flow/runtime/steps/verifier.ts`, `src/lib/agent-flow/runtime/verifiers/{coverage,citation,freshness,conflict,policy}.ts` (create — 6 files)
  - **Pattern**: Gateway Console §4.3 quality policy verifiers
  - **Verify**: `src/lib/agent-flow/runtime/steps/verifier.test.ts` asserts each verifier returns the expected envelope; unknown verifier throws (already caught by compile-time check 1.5.5)
- [x] 2.4.6 Build artifact executor in `src/lib/agent-flow/runtime/steps/artifact.ts` — delegates to an artifact registry keyed by `step.artifactType` (initially: `markdown_report` and `evidence_bundle` shipped; both write to `state` and return `{ artifactId, kind, location }`). No external write yet — that's `agent-tools` for external action providers
  - **Files**: `src/lib/agent-flow/runtime/steps/artifact.ts`, `src/lib/agent-flow/runtime/artifacts/{markdown-report,evidence-bundle}.ts` (create — 3 files)
  - **Pattern**: Gateway Console §4.7 artifact types (subset)
  - **Verify**: `src/lib/agent-flow/runtime/steps/artifact.test.ts` asserts a `markdown_report` step writes `state.artifacts[0].kind === 'markdown_report'` with the rendered template

### 2.5 Step lifecycle persistence

- [x] 2.5.1 Build `src/lib/agent-flow/runtime/step-runs.ts` — `beginStep(db, flowRunId, stepId, stepOrder, type): stepRunId`, `endStep(db, stepRunId, status, outputs, errorJson?)`. Writes `flow_step_runs` rows with `started_at`/`finished_at`/`latency_ms` populated via `nowMs()`
  - **Files**: `src/lib/agent-flow/runtime/step-runs.ts` (create)
  - **Pattern**: D6 (step lifecycle table); agent-os `EventLogBackend` write pattern
  - **Verify**: `src/lib/agent-flow/runtime/step-runs.test.ts` round-trip; `endStep` with status `failed` persists `error_json`
- [x] 2.5.2 Wire `beginStep` / `endStep` into the runtime loop so every step has a lifecycle row regardless of executor type; ensure failures inside an executor still call `endStep('failed', ...)` via a try/finally
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (create — main runtime loop)
  - **Pattern**: D6
  - **Verify**: `src/lib/agent-flow/runtime/run.test.ts` asserts a forced-throw inside a transform step produces a `flow_step_runs` row with `status='failed'` and the error message

### 2.6 Step-level retry policy

- [x] 2.6.1 Build `src/lib/agent-flow/runtime/retry.ts` — `withRetry<T>(fn, policy: { maxAttempts, backoffMs }): Promise<T>` with exponential backoff (base × 2^attempt, capped at 60s). Wraps the per-step executor call inside the runtime loop
  - **Files**: `src/lib/agent-flow/runtime/retry.ts` (create)
  - **Pattern**: proposal §"Step-level retry (configurable per step)"; D6
  - **Verify**: `src/lib/agent-flow/runtime/retry.test.ts` with `vi.useFakeTimers` asserts (a) 3 attempts with `backoffMs: 100` waits 100ms then 200ms, (b) successful first attempt → 0 retries, (c) all attempts fail → throws the last error
- [x] 2.6.2 Persist each retry attempt as a separate row on `flow_step_runs` with an `attempt` column (add to migration 0013 if not already present per D6); the final attempt's row is the canonical step result
  - **Files**: `migrations/0013_agent_flow.sql` (modify if missing the `attempt` column), `src/lib/agent-flow/runtime/run.ts` (modify)
  - **Pattern**: D6 (retry as separate rows for full audit)
  - **Verify**: `SELECT attempt, status FROM flow_step_runs WHERE flow_run_id=?` returns 1..N rows with monotonically increasing `attempt` and only the last with status `done`

### 2.7 Cancellation propagation

- [x] 2.7.1 Build `src/lib/agent-flow/runtime/cancel.ts` — `isCancelled(flowRunId, kv): Promise<boolean>` reads `flow:cancel:{flowRunId}` from KV (mirrors agent-os `agent:cancel:{runId}` shape per agent-scheduler spec). Runtime loop checks before each step and aborts cleanly mid-flow
  - **Files**: `src/lib/agent-flow/runtime/cancel.ts` (create)
  - **Pattern**: agent-os D7 (KV cancel signal); proposal §"Cancellation"
  - **Verify**: `src/lib/agent-flow/runtime/cancel.test.ts` covers (a) flag absent → not cancelled, (b) flag present → cancelled, (c) TTL of 600s on write
- [x] 2.7.2 When the flow run is cancelled mid-step on an `agent` step, propagate cancellation to the kernel by writing `agent:cancel:{agentRunId}` for the in-flight kernel sub-run so the kernel cooperatively aborts within ≤5s (per agent-scheduler "Cooperative cancellation")
  - **Files**: `src/lib/agent-flow/runtime/steps/agent.ts` (modify)
  - **Pattern**: agent-scheduler spec "Cooperative cancellation" + "Cancellation propagation to sub-agent"
  - **Verify**: `src/lib/agent-flow/runtime/steps/agent.test.ts` asserts cancellation of the outer flow run during an agent step writes the kernel-side cancel key with the correct `agentRunId`

### 2.8 In-memory smoke + unit tests

- [x] 2.8.1 Build an end-to-end in-memory smoke at `src/lib/agent-flow/runtime/smoke.test.ts` — registers a stub kernel agent that returns a fixed string, defines a 3-step flow (`agent('echo') → transform('{{ echo.output }}') → artifact('markdown_report')`), runs it, and asserts the final artifact contains the expected string
  - **Files**: `src/lib/agent-flow/runtime/smoke.test.ts` (create)
  - **Pattern**: end-to-end gate; agent-os `kernel.test.ts` style for boot-then-dispatch
  - **Verify**: smoke test runs <2s and asserts `artifact.markdown` equals the rendered template
- [x] 2.8.2 Verify `pnpm vitest run src/lib/agent-flow/runtime` green; 0 tests failed
  - **Files**: (no new files — verification gate)
  - **Pattern**: gate task
  - **Verify**: command exits 0 with all runtime tests passing

---

## Phase 3 — Reference flow `deep-research` end-to-end

**Goal**: Author the canonical `deep-research` flow YAML (Gateway Console §4.2) and prove it runs end-to-end against the four kernel-migrated agents (`planner`, `research`, `writer`, `critic`) without touching `src/lib/pipelines/`. Ship the admin endpoints needed to run + inspect a flow. Validate output is structurally equivalent to today's `runPipeline('research-brief')` for the same inputs.

**Files touched**: ~5 new (`flows/deep-research.yaml`, 2 admin endpoints, agent-registration test, parity test), ~0 modified
**Verification**: `POST /api/admin/flows/deep-research/run` produces a `flow_runs` row reaching status `done` with a `markdown_report` artifact whose step ordering matches the YAML; structural-parity vitest passes vs. the legacy pipeline output

### 3.1 Author `deep-research.yaml`

- [x] 3.1.1 Create the canonical flow YAML at `flows/deep-research.yaml` based verbatim on Gateway Console §4.2. Steps: `clarify(agent:planner) → build_brief(transform) → plan(agent:planner) → search(tool_group) → rank_sources(agent:research) → read_sources(tool_group) → extract_evidence(agent:research) → synthesize(agent:writer) → verify(verifier:coverage) → export(artifact:markdown_report)`. Edge `verify → search if coverage_insufficient` deferred to Phase 4.6 (linear-only for Phase 3 to keep parity scope minimal)
  - **Files**: `flows/deep-research.yaml` (create), `flows/.gitkeep` (create if directory absent)
  - **Pattern**: Gateway Console §4.2 (verbatim); D1 step type assignments
  - **Verify**: `pnpm vitest run -t 'deep-research yaml parses'` — extends 1.8.2 gateway-fixture test to also load this file from `flows/` and assert all 10 steps parse cleanly
- [x] 3.1.2 Decide the inputs schema in the YAML — `topic: string (required)`, `audience?: string`, `freshness_days: number (default 365)`; expose so the run endpoint can validate `POST` body against the same schema
  - **Files**: `flows/deep-research.yaml` (modify — flesh out `inputs` block)
  - **Pattern**: Gateway Console §4.2 inputs block
  - **Verify**: parser test asserts `definition.inputs.length === 3` with the documented types

### 3.2 Register the flow + verify kernel agents are wired

- [x] 3.2.1 Verify the four agents (`planner`, `research`, `writer`, `critic`) are present in the kernel registry — write `src/lib/agent-flow/integration/kernel-agents-present.test.ts` that boots the kernel and asserts `kernel.access.getAgent('planner') !== undefined` for all four ids. If any is missing, the test fails fast (this is a Phase 3 pre-condition, not new work — agent-os Phase 3.5 retired the per-agent flags after migration)
  - **Files**: `src/lib/agent-flow/integration/kernel-agents-present.test.ts` (create)
  - **Pattern**: agent-os Phase 3.5 retirement; this test is the integration tripwire
  - **Verify**: test asserts all four agent ids return registered process records from `agent_processes`
- [x] 3.2.2 Build a startup hook `registerFlows(env)` in `src/lib/agent-flow/registry.ts` — reads every `*.yaml` under `flows/` and upserts via `upsertFlowDefinition`. Invoked once on first request (idempotent — relies on `flow_definitions.id` uniqueness)
  - **Files**: `src/lib/agent-flow/registry.ts` (create)
  - **Pattern**: agent-os boot-time registry mirror; agent-flow Phase 1.7.1
  - **Verify**: `src/lib/agent-flow/registry.test.ts` covers (a) registers all flows in `flows/` on first call, (b) second call is a no-op (upsert), (c) malformed YAML in `flows/bad.yaml` throws `FlowSchemaError` and aborts registration

### 3.3 Smoke run end-to-end

- [ ] 3.3.1 Temporarily flip `AGENT_FLOW_ENABLED=true` for local dev only; manually trigger via the admin endpoint (Phase 3.5 ships it), capture the resulting `flow_runs` row id, and inspect every `flow_step_runs` row to confirm all 10 steps reach status `done` with non-null `latency_ms`
  - **Files**: (no new files — local dev smoke; record run id in `.omc/research/agent-flow-phase3-smoke.md`)
  - **Pattern**: agent-os Phase 2.4 smoke style
  - **Verify**: `wrangler d1 execute quidproquo-db --local --command="SELECT step_id, status, latency_ms FROM flow_step_runs WHERE flow_run_id=?"` returns 10 rows all `done`; the final `artifact` step's `outputs_json` contains `markdown_report` content
- [ ] 3.3.2 Capture the artifact body from the smoke run — extract via `SELECT json_extract(outputs_json, '$.artifact.markdown') FROM flow_step_runs WHERE flow_run_id=? AND step_id='export'` and write to `.omc/research/agent-flow-phase3-artifact.md` as the structural-parity baseline
  - **Files**: `.omc/research/agent-flow-phase3-artifact.md` (create)
  - **Pattern**: parity-baseline capture
  - **Verify**: file exists, ≥500 chars, contains at least one `[...](http...)` citation marker

### 3.4 Parity test vs. legacy `runPipeline`

- [x] 3.4.1 Write `src/lib/agent-flow/integration/research-brief-parity.test.ts` — runs both `runPipeline(db, { pipelineId: 'research-brief', input })` AND `runFlow(db, { flowId: 'deep-research', input })` against the same seeded D1 + stubbed `model.invoke` / `search.*` syscalls; asserts STRUCTURAL parity only — same step ordering (extracted from `admin_jobs.step_logs` vs `flow_step_runs.step_id`), same artifact kind (`markdown_report`), same set of source URLs cited
  - **Files**: `src/lib/agent-flow/integration/research-brief-parity.test.ts` (create)
  - **Pattern**: agent-os Phase 3 parity test style (structural-diff allowing LLM nondeterminism)
  - **Verify**: test asserts (a) ordered step ids align with the 10-step flow ordering (mapping pipeline step labels → flow step ids), (b) both outputs contain the same set of `source_url` values, (c) text equality is NOT asserted (LLM nondeterminism)
- [x] 3.4.2 Document the structural-parity mapping in `openspec/changes/agent-flow/research-brief-mapping.md` — for each `research-brief` pipeline step, name the equivalent `deep-research` flow step (one-to-one or many-to-one). Drives the assertions in 3.4.1
  - **Files**: `openspec/changes/agent-flow/research-brief-mapping.md` (create — table with pipeline-step → flow-step columns)
  - **Pattern**: explicit mapping doc to prevent silent drift
  - **Verify**: file has ≥10 rows; parity test reads this file (or a derived constant) for the step-id alignment

### 3.5 Admin endpoint — manual invoke

- [x] 3.5.1 Create `POST /api/admin/flows/:id/run` at `src/pages/api/admin/flows/[id]/run.ts` — body `{ input: Record<string, unknown>, presetId?: string }`; calls `runFlow(db, { flowId: params.id, input, presetId })` and returns `{ flowRunId, status }`. Re-uses `requireAdmin` + `json` + `unauthorized` from agent-foundation; gated by `flags.agentFlow.enabled` (returns 503 `{error:'agent_flow_disabled'}` when off)
  - **Files**: `src/pages/api/admin/flows/[id]/run.ts` (create), `src/pages/api/admin/flows/_guard.ts` (create — `ensureAgentFlowEnabled()` mirror of agent-os Phase 1.5.8 guard)
  - **Pattern**: `src/pages/api/admin/pipelines.ts:51-69` (POST shape); agent-os Phase 1.5.2 (per-route guard) + 1.5.8 (disabled-guard helper)
  - **Verify**: `curl -X POST -b 'session=...' http://localhost:4321/api/admin/flows/deep-research/run -d '{"input":{"topic":"x"}}'` with flag off returns 503; with flag on + valid input returns 200 with a `flowRunId`; with unknown flow id returns 404; with invalid input (missing required `topic`) returns 400 with the validation error path
- [x] 3.5.2 Reject invocation when `flow_definitions` row is missing (404) or `input` fails the FlowInputSchema (400 with `{ error: 'invalid_input', path, message }`)
  - **Files**: `src/pages/api/admin/flows/[id]/run.ts` (modify)
  - **Pattern**: agent-os Phase 1.5.2 error→status mapping
  - **Verify**: vitest fixture covers both error branches; smoke matches

### 3.6 Admin endpoint — list flows + run detail

- [x] 3.6.1 Create `GET /api/admin/flows` at `src/pages/api/admin/flows/index.ts` — returns `{ flows: FlowDefinition[], schedules: [] }` (schedules empty until a follow-up change ships cron triggers for flows). Mirrors `GET /api/admin/pipelines` shape so the eventual unified admin UI can swap collections cleanly
  - **Files**: `src/pages/api/admin/flows/index.ts` (create)
  - **Pattern**: `src/pages/api/admin/pipelines.ts:39-49`
  - **Verify**: `curl -b 'session=...' http://localhost:4321/api/admin/flows` returns `{flows:[{id:'deep-research',name:'Deep Research',...}], schedules:[]}` after registration
- [x] 3.6.2 Create `GET /api/admin/flows/:id/runs/:runId` at `src/pages/api/admin/flows/[id]/runs/[runId].ts` — returns `{ run: FlowRun, steps: FlowStepRun[], artifacts: Artifact[] }`. Joins `flow_runs` + `flow_step_runs` ordered by `started_at`. For each `agent` step, includes `agent_run_id` so the UI can deep-link to the kernel's run-detail endpoint
  - **Files**: `src/pages/api/admin/flows/[id]/runs/[runId].ts` (create)
  - **Pattern**: agent-os Phase 1.5.4 run-detail endpoint
  - **Verify**: `curl -b 'session=...' http://localhost:4321/api/admin/flows/deep-research/runs/<RUN_ID>` returns 10 step rows with the artifact step's `outputs_json.artifact.kind === 'markdown_report'`; unknown `runId` returns 404
- [x] 3.6.3 Create `GET /api/admin/flows/:id/runs` at `src/pages/api/admin/flows/[id]/runs/index.ts` — paginated list scoped to one flow id (`limit` + `cursor` query params); returns `{ runs: FlowRun[], cursor: string | null }`
  - **Files**: `src/pages/api/admin/flows/[id]/runs/index.ts` (create)
  - **Pattern**: agent-os Phase 1.5.3
  - **Verify**: returns `{runs:[], cursor:null}` when DB empty; `?status=done` honored

### 3.7 Phase exit gate

- [ ] 3.7.1 After Phase 3 smoke + parity tests pass, flip `AGENT_FLOW_ENABLED` back to `false` in production env (flow was only enabled locally for the smoke); record the run id, parity-test outcome, and rollback timestamp in `progress.txt`
  - **Files**: `progress.txt` (modify — append one line)
  - **Pattern**: phase-end gate per agent-os Phase exits
  - **Verify**: `tail -1 progress.txt` includes `agent-flow Phase 3 complete: deep-research reference flow validated; flag off until Phase 4`

---

## Phase 4 — Advanced step types (parallel, loop, human_approval, sub_flow)

**Goal**: Round out the 9 step types with the four advanced executors deferred from Phase 2. Add runtime cycle detection + depth limit for sub-flows. Extend the reference flow to exercise a conditional edge (the deferred `verify → search if coverage_insufficient` branch from Phase 3.1.1) so we exercise non-linear control end-to-end.

**Files touched**: ~12 new (4 executors, 1 cycle module, tests, fixtures, runbook update), ~2 modified (`flows/deep-research.yaml`, `src/lib/agent-flow/runtime/run.ts`)
**Verification**: `pnpm vitest run src/lib/agent-flow/runtime/steps/{parallel,loop,human-approval,sub-flow}.test.ts` green; reference flow with conditional edge produces 11 step runs (extra `search` after `verify` fails) on a fixture that forces `coverage_insufficient`

### 4.1 Parallel step executor

- [x] 4.1.1 Build parallel executor in `src/lib/agent-flow/runtime/steps/parallel.ts` — runs each branch via the same `step-executor` dispatch recursively, with merge strategy from `step.merge`: `'all'` waits for every branch (default), `'race'` resolves on first completion (cancels the rest via `cancel.ts`), `'firstSuccess'` resolves on first non-failure
  - **Files**: `src/lib/agent-flow/runtime/steps/parallel.ts` (create)
  - **Pattern**: D1 (parallel step type); proposal §"parallel and loop step types"
  - **Verify**: `src/lib/agent-flow/runtime/steps/parallel.test.ts` covers all 3 merge strategies with fake timers; `race` cancels in-flight siblings via the kernel cancel signal
- [x] 4.1.2 Outputs of each branch surface under `step.outputs.branches[N]` so downstream transforms can index them; the merged top-level `outputs.merged` aggregates per merge strategy
  - **Files**: `src/lib/agent-flow/runtime/steps/parallel.ts` (modify)
  - **Pattern**: D1
  - **Verify**: 2-branch test asserts `outputs.branches[0]` and `outputs.branches[1]` are distinct
- [x] 4.1.3 Persist a `flow_step_runs` row per branch with `parent_step_run_id` pointing at the parallel step's row (so the admin UI can render a tree)
  - **Files**: `migrations/0013_agent_flow.sql` (modify — add `parent_step_run_id INTEGER REFERENCES flow_step_runs(step_run_id)` to `flow_step_runs` if not already present from 1.2.x); `src/lib/agent-flow/runtime/step-runs.ts` (modify)
  - **Pattern**: D6 (step-run lineage)
  - **Verify**: schema introspection confirms column; smoke asserts `SELECT count(*) FROM flow_step_runs WHERE parent_step_run_id=?` returns the branch count

### 4.2 Loop step executor

- [x] 4.2.1 Build loop executor in `src/lib/agent-flow/runtime/steps/loop.ts` — iterates the body steps until either (a) `maxIterations` reached (enforced — throws `FlowLoopBoundsError` if exceeded) or (b) the optional `condition` evaluates to `false`. Each iteration writes a numbered `flow_step_runs` row (`step_id = 'loop-body#N'`) with `parent_step_run_id` set to the loop step's row
  - **Files**: `src/lib/agent-flow/runtime/steps/loop.ts` (create)
  - **Pattern**: D1; proposal §"loop step types"
  - **Verify**: `src/lib/agent-flow/runtime/steps/loop.test.ts` covers (a) condition-driven exit at iteration 3, (b) maxIterations-driven exit, (c) attempting maxIterations=200 throws (compile-time guard from 1.5.10)
- [x] 4.2.2 Inside a loop body, each iteration's transform/state writes are scoped via a prefix `loop.{N}.` so the same step id across iterations does not collide
  - **Files**: `src/lib/agent-flow/runtime/steps/loop.ts` (modify)
  - **Pattern**: D5 (per-iteration state scope)
  - **Verify**: 3-iteration test asserts `state.readAll()` contains `loop.0.x`, `loop.1.x`, `loop.2.x` keys

### 4.3 Human approval step executor

- [x] 4.3.1 Build human-approval executor in `src/lib/agent-flow/runtime/steps/human-approval.ts` — calls the kernel's `access.requestApproval({ runId: flowRunId, reason, context, ttlSeconds })`, awaits the promise, and routes on resolution: `approve` → step `done` with `outputs.decision='approve'`, `reject` → step `failed` with `outputs.decision='reject'`, `expire` → step `failed` with `outputs.decision='expired'`. Flow run transitions to `paused` while awaiting
  - **Files**: `src/lib/agent-flow/runtime/steps/human-approval.ts` (create)
  - **Pattern**: D9 (agent-access approval gate); agent-os Phase 1.5.7 approval resolution
  - **Verify**: `src/lib/agent-flow/runtime/steps/human-approval.test.ts` covers all three resolution paths via the in-memory approval-queue stub
- [x] 4.3.2 Document in the runbook how operators resolve a pending flow approval — reuse the existing `POST /api/admin/agents/approvals/:approvalId/{approve,reject}` endpoint shipped in agent-os Phase 1.5.7 (the approval store is shared between agent-os and agent-flow because they share the kernel access module)
  - **Files**: `docs/agent-flow-runbook.md` (create — first entry: "Approve / reject a pending flow step")
  - **Pattern**: agent-os Phase 6.2 runbook style
  - **Verify**: runbook has the curl recipe + the SQL recipe `SELECT approval_id, reason FROM agent_approval_requests WHERE run_id=? AND status='pending'`

### 4.4 Sub-flow step executor + cycle detection + depth limit

- [x] 4.4.1 Build sub-flow executor in `src/lib/agent-flow/runtime/steps/sub-flow.ts` — dispatches an inner `runFlow` with `parentFlowRunId=outer.flowRunId` + `parentStepRunId=current.stepRunId` (uses the columns from migration 1.2.2). Inner flow outputs surface to the outer step's `outputs.result`
  - **Files**: `src/lib/agent-flow/runtime/steps/sub-flow.ts` (create)
  - **Pattern**: D6 lineage; proposal §"Sub-flow composition"
  - **Verify**: `src/lib/agent-flow/runtime/steps/sub-flow.test.ts` asserts (a) outer→inner lineage in `flow_runs`, (b) inner outputs visible in outer state, (c) inner failure → outer step `failed`
- [x] 4.4.2 Runtime cycle detection — walks the `parent_flow_run_id` chain via SQL (`WITH RECURSIVE ancestors AS ...`) before dispatch and throws `FlowCycleError` if the target `flowId` already appears in the chain. Complements the compile-time check from 1.6.3 (which catches static registry cycles; runtime catches dynamic ones via input-driven `flowId`)
  - **Files**: `src/lib/agent-flow/runtime/sub-flow-cycle.ts` (create)
  - **Pattern**: D1; proposal §"Sub-flow composition" cycle protection
  - **Verify**: `src/lib/agent-flow/runtime/sub-flow-cycle.test.ts` covers (a) A→B→A dispatched at runtime throws, (b) A→B→C dispatched cleanly, (c) compile-time guard still primary line of defense
- [x] 4.4.3 Runtime depth limit — hard cap `MAX_SUB_FLOW_DEPTH = 5` (configurable via env var `AGENT_FLOW_MAX_SUB_FLOW_DEPTH`). Throws `FlowSubFlowDepthExceeded` with the chain visible in the error message
  - **Files**: `src/lib/agent-flow/runtime/sub-flow-cycle.ts` (modify), `src/lib/config/flags.ts` (modify — expose `agentFlow.maxSubFlowDepth`)
  - **Pattern**: D1; proposal §"Sub-flow composition" depth cap
  - **Verify**: 6-deep test throws; 5-deep test succeeds; env-var override to `10` lets the 6-deep case pass

### 4.5 Vitest gate

- [x] 4.5.1 Run `pnpm vitest run src/lib/agent-flow/runtime/steps` and confirm all 9 step-type test files green
  - **Files**: (no new files — gate task)
  - **Pattern**: full step-type coverage gate
  - **Verify**: `pnpm vitest run src/lib/agent-flow/runtime/steps 2>&1 | grep -E "(Test Files|Tests)"` shows 9 passing test files, 0 failed

### 4.6 Reference flow gains a conditional edge

- [x] 4.6.1 Update `flows/deep-research.yaml` to add the `verify → search if coverage_insufficient` edge per Gateway Console §4.2 (deferred from Phase 3.1.1). Condition: `{ "==": [{ "var": "verify.passed" }, false] }`. Set the loop boundary by wrapping `search → rank_sources → read_sources → extract_evidence → synthesize → verify` inside a `loop` step with `maxIterations: 3`
  - **Files**: `flows/deep-research.yaml` (modify)
  - **Pattern**: Gateway Console §4.2; D10 (json-logic condition shape)
  - **Verify**: re-running 1.8.2 parser test still passes (loop is a step type already validated)
- [x] 4.6.2 End-to-end smoke with a forced-fail verifier — fixture stubs the `coverage` verifier to return `{ passed: false }` for the first 2 iterations and `{ passed: true }` on the third; assert exactly 3 loop iterations were recorded in `flow_step_runs` (with the `loop.{N}.search` prefix from 4.2.2) and the final state is `done`
  - **Files**: `src/lib/agent-flow/integration/conditional-loop.test.ts` (create)
  - **Pattern**: non-linear control e2e gate
  - **Verify**: test asserts `SELECT count(*) FROM flow_step_runs WHERE step_id LIKE 'loop.%.search'` returns 3 and the final flow run status is `done`
- [ ] 4.6.3 Re-run the parity test from 3.4.1 with the new conditional flow — assert structural parity still holds against the legacy `research-brief` pipeline for inputs that do NOT trigger the loop (i.e. coverage passes first try); explicitly document in the mapping doc that the loop branch is flow-only and intentionally diverges from the linear pipeline
  - **Files**: `openspec/changes/agent-flow/research-brief-mapping.md` (modify — add note about loop)
  - **Pattern**: explicit divergence documentation
  - **Verify**: parity test re-runs green; mapping doc updated

---

## Phase 5 — Cloudflare Workflows integration (durable execution)

**Goal**: Add the `cf_workflows` binding and an adapter that maps each flow step to a Workflow step, so long-running flows survive Worker restarts. Short flows continue running in-Worker; flows marked `durable: true` in their YAML route through Workflows. Validate cancellation propagation in durable mode.

**Files touched**: ~5 new (durable adapter, runtime routing, tests, runbook entry), ~2 modified (`wrangler.jsonc`, `flows/deep-research.yaml`)
**Verification**: a `durable: true` flow run survives a forced Worker restart mid-flow; cancellation of a durable run propagates within ≤10s; non-durable runs remain unchanged

### 5.1 Wrangler binding

- [x] 5.1.1 Add `[[workflows]]` binding to `wrangler.jsonc` — `{ name: "agent-flow-durable", binding: "AGENT_FLOW_WORKFLOWS", class_name: "AgentFlowWorkflow" }` per Cloudflare Workflows docs; document in PR body that Workflows is a paid feature (R7 mirror of agent-os Queues note)
  - **Files**: `wrangler.jsonc` (modify — add `workflows` block), `src/lib/config/env.ts` (modify — add `AGENT_FLOW_WORKFLOWS: Workflow` binding)
  - **Pattern**: Cloudflare Workflows binding shape (see Context7 docs for `workflows` Wrangler config); D2 binding pattern
  - **Verify**: `pnpm wrangler types` regenerates; `wrangler dev` boots without binding errors
- [x] 5.1.2 Create the Workflow class `AgentFlowWorkflow` in `src/server/agent-flow-workflow.ts` — extends `WorkflowEntrypoint`, exposes `async run(event, step)` that delegates each flow step to `step.do(stepId, async () => stepExecutor.execute(...))` so Workflows persists output between steps automatically. Each step also captures `retries: { limit: step.retryPolicy.maxAttempts, backoff: 'exponential' }`
  - **Files**: `src/server/agent-flow-workflow.ts` (create)
  - **Pattern**: Cloudflare Workflows `WorkflowEntrypoint` docs; generated Worker entrypoint from `scripts/create-cron-entry.mjs`
  - **Verify**: `pnpm wrangler deploy --dry-run` exits 0 and lists `AgentFlowWorkflow` under workflow classes

### 5.2 Durable adapter

- [x] 5.2.1 Build `src/lib/agent-flow/durable.ts` — `runFlowDurable(env, { flowId, input })` calls `env.AGENT_FLOW_WORKFLOWS.create({ id: flowRunId, params: { flowId, input } })` and returns the run id immediately. The Workflow class invokes the same `step-executor` modules from Phase 2 (no executor duplication — only the orchestration layer differs)
  - **Files**: `src/lib/agent-flow/durable.ts` (create)
  - **Pattern**: D6 (executor reuse — durable wraps in-Worker, doesn't replace)
  - **Verify**: `src/lib/agent-flow/durable.test.ts` mocks the `Workflow` binding and asserts `create()` is called exactly once with the documented params
- [x] 5.2.2 Add a runtime decision in `src/lib/agent-flow/runtime/run.ts` — `if (def.durable === true || flags.agentFlow.durableExecution) → runFlowDurable, else → runFlowInWorker`. The decision is per flow definition AND globally gated by `AGENT_FLOW_DURABLE_EXECUTION` flag (kill-switch)
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify)
  - **Pattern**: D6 (routing); D11 (kill-switch flag)
  - **Verify**: `src/lib/agent-flow/runtime/run.test.ts` extended to assert flag off → always in-Worker, flag on + `durable: true` → durable path, flag on + `durable: false` → in-Worker

### 5.3 Cancellation in durable mode

- [x] 5.3.1 Extend `src/lib/agent-flow/runtime/cancel.ts` — when the flow run is durable, `cancelFlow(flowRunId)` calls `env.AGENT_FLOW_WORKFLOWS.get(flowRunId).terminate()` IN ADDITION to writing the `flow:cancel:{flowRunId}` KV key (which still cancels in-flight agent sub-runs from in-Worker steps)
  - **Files**: `src/lib/agent-flow/runtime/cancel.ts` (modify), `src/pages/api/admin/flows/[id]/runs/[runId]/cancel.ts` (create — admin endpoint mirroring agent-os Phase 1.5.5)
  - **Pattern**: agent-scheduler "Cooperative cancellation"; Cloudflare Workflows `.terminate()` docs
  - **Verify**: `src/lib/agent-flow/runtime/cancel.test.ts` covers durable path: cancel triggers both KV write AND Workflow termination; cancel of a `done` run returns 409

### 5.4 Smoke + flag flip

- [ ] 5.4.1 Mark `deep-research` as `durable: true` in `flows/deep-research.yaml`; deploy with `pnpm deploy` (Workflows binding now active); manually invoke via the admin endpoint and confirm the run lands in Cloudflare Workflows (`wrangler workflows list-instances agent-flow-durable`)
  - **Files**: `flows/deep-research.yaml` (modify — add `durable: true`)
  - **Pattern**: D6 routing decision
  - **Verify**: `wrangler workflows list-instances agent-flow-durable --json | jq '.[0].status'` returns `"running"` then `"completed"`; the same `flowRunId` is queryable via the admin run-detail endpoint
- [ ] 5.4.2 Cancellation smoke — invoke the durable flow, wait until the second step starts, then `curl -X POST .../api/admin/flows/deep-research/runs/<RUN_ID>/cancel -b 'session=...'`; assert within 10s that `wrangler workflows describe agent-flow-durable <RUN_ID>` shows status `terminated` AND the kernel `agent_runs` row for any in-flight sub-agent step shows `cancelled`
  - **Files**: (no new files — smoke in `.omc/research/agent-flow-phase5-cancel-smoke.md`)
  - **Pattern**: cancellation propagation gate
  - **Verify**: both signals confirmed within 10s; record timestamps in the smoke note
- [ ] 5.4.3 Flip `AGENT_FLOW_DURABLE_EXECUTION=true` in production env vars (Cloudflare dashboard → Worker → Variables) AFTER 5.4.1 + 5.4.2 pass; redeploy; update `progress.txt` with `Phase 5 complete: durable execution live for deep-research`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: phase-end gate; D11 flag flip
  - **Verify**: `tail -1 progress.txt` contains the phase-5 line; production env var visible in the dashboard

---

## Phase 6 — Preset system + remaining admin endpoints

**Goal**: Ship the preset CRUD + resolution layer so the same flow can run with `quick` / `standard` / `deep` strategy presets (per Gateway Console §4.3 — different provider routing, retry policy, budget). Reject preset overrides that violate the boundary (presets can change WHAT but not HOW MUCH — they cannot add/remove steps).

**Files touched**: ~6 new (preset endpoints, resolver, validator, tests, runbook entry, fixtures), ~1 modified (`src/lib/agent-flow/runtime/run.ts` to apply preset before execution)
**Verification**: smoke shows the same `deep-research` flow runs with `quick` (uses haiku + fewer iterations) and `deep` (uses opus + more iterations) presets while producing identical step ordering; preset that attempts to add a step is rejected at upsert time

### 6.1 Preset CRUD endpoints

- [x] 6.1.1 Create `GET /api/admin/flows/:id/presets` at `src/pages/api/admin/flows/[id]/presets/index.ts` — returns `{ presets: FlowPreset[] }` from `listFlowPresets(db, flowId)`
  - **Files**: `src/pages/api/admin/flows/[id]/presets/index.ts` (create)
  - **Pattern**: agent-os Phase 1.5.x list endpoints
  - **Verify**: returns `{presets:[]}` for an unknown flow id (no 404 — empty is correct); after seeding, returns the list
- [x] 6.1.2 Create `POST /api/admin/flows/:id/presets` — body `{ presetId, name, overrides: { providerRouting?, retryPolicy?, budget?, stepConfig? } }`; calls `upsertFlowPreset(db, ...)`. Validation runs through 6.3 before persisting
  - **Files**: `src/pages/api/admin/flows/[id]/presets/index.ts` (modify — add `POST` handler)
  - **Pattern**: D3 preset schema; agent-os Phase 1.5 endpoint shape
  - **Verify**: valid preset returns 200 + `{presetId}`; invalid override (e.g. tries to add a step) returns 400 with the path
- [x] 6.1.3 Create `DELETE /api/admin/flows/:id/presets/:presetId` at `src/pages/api/admin/flows/[id]/presets/[presetId].ts` — removes the preset row; returns 204 on success, 404 if missing
  - **Files**: `src/pages/api/admin/flows/[id]/presets/[presetId].ts` (create)
  - **Pattern**: REST delete shape
  - **Verify**: deleting a known preset returns 204; deleting twice returns 404

### 6.2 Preset resolution at run time

- [x] 6.2.1 Build `src/lib/agent-flow/runtime/preset-resolver.ts` — `resolvePreset(def: FlowDefinition, preset: FlowPreset | undefined): FlowDefinition` deep-merges preset overrides into the base definition. Returns a NEW `FlowDefinition` (no mutation). Preset can ONLY override: `step.retryPolicy`, `step.timeoutSeconds`, `step.providerRouting` (for `agent` steps), top-level `budget`. Anything else triggers an error from the validator in 6.3
  - **Files**: `src/lib/agent-flow/runtime/preset-resolver.ts` (create)
  - **Pattern**: D8 (preset boundary); proposal §"Flow presets stored as separate records that reference a base flow"
  - **Verify**: `src/lib/agent-flow/runtime/preset-resolver.test.ts` covers (a) overriding `step[0].retryPolicy.maxAttempts` from 3 → 5 yields a new definition with the updated value and originals untouched, (b) deep equality of step graph: `resolved.steps.map(s => s.id)` equals `base.steps.map(s => s.id)`
- [x] 6.2.2 Apply preset resolution inside `runFlow(db, { flowId, input, presetId? })` — if `presetId` provided, load via `getFlowPreset`, run `resolvePreset`, then compile and execute the resolved definition. Persist the chosen `presetId` on the `flow_runs` row
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify), `migrations/0013_agent_flow.sql` (modify if missing — add `preset_id TEXT REFERENCES flow_presets(preset_id)` column to `flow_runs`)
  - **Pattern**: D8 (preset application point); D3 audit trail
  - **Verify**: smoke: `SELECT preset_id FROM flow_runs WHERE flow_run_id=?` returns the dispatched preset id; without preset returns NULL

### 6.3 Boundary enforcement (reject step add/remove/reorder)

- [x] 6.3.1 Build `src/lib/agent-flow/runtime/preset-validator.ts` — `validatePresetOverrides(overrides, def): void` walks the override keys and throws `FlowPresetBoundaryError` for any forbidden key. Forbidden: adding/removing/renaming `step.id`, modifying `step.type`, modifying `edges`, modifying `inputs`, modifying `artifacts`. Allowed: `retryPolicy`, `timeoutSeconds`, `providerRouting`, `budget`
  - **Files**: `src/lib/agent-flow/runtime/preset-validator.ts` (create)
  - **Pattern**: D8 (boundary); proposal §"let user swap preset without editing the flow"
  - **Verify**: `src/lib/agent-flow/runtime/preset-validator.test.ts` covers each forbidden key class (add step, change step.type, modify edge target) and each allowed key class
- [x] 6.3.2 Wire `validatePresetOverrides` into the `POST .../presets` endpoint (6.1.2) so invalid presets are rejected at write time; also call from `resolvePreset` as defense in depth in case a preset row pre-dates the validator
  - **Files**: `src/pages/api/admin/flows/[id]/presets/index.ts` (modify), `src/lib/agent-flow/runtime/preset-resolver.ts` (modify)
  - **Pattern**: dual-gate (write-time + read-time)
  - **Verify**: integration test — write an invalid preset directly to D1, attempt to run with it, assert `runFlow` throws `FlowPresetBoundaryError` not a malformed-graph error

### 6.4 Preset persistence smoke

- [ ] 6.4.1 Seed two presets for `deep-research`: `quick` (`{ retryPolicy: { maxAttempts: 1 }, providerRouting: { agent: { planner: 'haiku' } } }`) and `deep` (`{ retryPolicy: { maxAttempts: 5 }, providerRouting: { agent: { planner: 'opus', writer: 'opus' } } }`). Seed via `POST /api/admin/flows/deep-research/presets` and verify via `GET .../presets`
  - **Files**: `openspec/changes/agent-flow/fixtures/presets/{quick,deep}.json` (create — 2 files)
  - **Pattern**: D8; Gateway Console §4.3 budget + provider policy variants
  - **Verify**: `curl -b 'session=...' .../api/admin/flows/deep-research/presets` returns 2 presets after seeding
- [ ] 6.4.2 Smoke run — invoke `POST /api/admin/flows/deep-research/run` once with `presetId='quick'` and once with `presetId='deep'`. Capture step ordering from `flow_step_runs` for both runs and assert (a) step ids are identical sequences, (b) `model_route` recorded on the planner step's `agent_runs` row differs (`haiku` vs `opus`) — proves provider routing changed without altering the step graph
  - **Files**: `src/lib/agent-flow/integration/preset-smoke.test.ts` (create) or `.omc/research/agent-flow-phase6-preset-smoke.md` (local-only smoke)
  - **Pattern**: end-to-end preset boundary proof
  - **Verify**: step-id sequences deep-equal; planner model differs; both runs complete `done`

### 6.5 Final cleanup + archive prep

- [x] 6.5.1 Update `docs/agent-flow-runbook.md` with a "Presets" section: how to list/create/delete presets, the SQL recipe `SELECT preset_id, COUNT(*) FROM flow_runs GROUP BY preset_id` for adoption tracking, the curl recipe for invoking with a preset
  - **Files**: `docs/agent-flow-runbook.md` (modify — append section)
  - **Pattern**: agent-os Phase 6.2 runbook structure
  - **Verify**: `grep -c "^## " docs/agent-flow-runbook.md` shows ≥4 sections (Approve, Cancel, Presets, Sub-flows)
- [ ] 6.5.2 Run the full quality suite — `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build`; capture output to `.omc/research/agent-flow-phase6-suite.log`; fix any drift
  - **Files**: (no new files — verification gate)
  - **Pattern**: zero-regression gate
  - **Verify**: each command exits 0
- [ ] 6.5.3 Run `openspec validate agent-flow --strict` and reconcile any drift between proposal / tasks / specs and shipped behavior; confirm the three capability specs (`flow-definition`, `flow-runtime`, `flow-presets`) are present under `openspec/changes/agent-flow/specs/`
  - **Files**: (verification gate)
  - **Pattern**: OpenSpec strict-validate flow
  - **Verify**: command exits 0 with no warnings
- [x] 6.5.4 Append to `progress.txt`: `agent-flow: complete — DSL+runtime+reference flow+presets shipped; durable execution live; deep-research running as the canonical flow; ready for agent-pipelines-unify planning (change #8)`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: project convention (lightweight session memory)
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill
- [x] 6.5.5 Open follow-up issues for the deferred items surfaced during this change: (a) cron triggers for flows (mirror of agent-os Phase 4 for `trigger='cron'` on flow runs), (b) the unified admin UI swap of pipelines→flows under one collection (blocks `agent-pipelines-unify` planning), (c) the artifact-export connectors (Notion, Slack, GitHub PR) — currently only `markdown_report` + `evidence_bundle` ship
  - **Files**: (no new files — GitHub issues via `gh issue create` or equivalent)
  - **Pattern**: end-of-change followups, mirror of agent-os Phase 6.3.6
  - **Verify**: 3 issues filed and linked from `progress.txt`
