# Tasks — agent-policy

Implementation plan for the agent-policy change. 9 phases, ~98 tasks, strict order. Builds the Policy registry (Budget / Provider / Quality / Security / Human / Retry), policy binding at run-time, live enforcement, approval-gate wiring, and reference policies on top of the kernel + Flow runtime + Provider router + Evidence verifier.

## Pre-requisite

- `agent-foundation` (change #0) shipped — central `Env`, `flags`, `json/unauthorized/badRequest`, `nowMs/nowIso`, `requireAdmin`, `settings-store`
- `agent-os` (change #1) shipped — kernel; this change uses `defineAgent`, `syscall`, `agent-access` (for human approval gates per design D9), `agent-storage` (D1 + R2 backend pattern), the scheduler kill path per agent-os D6 (`CancelSignalBackend`), and `EventLogBackend` for violation telemetry
- `agent-flow` (change #2) shipped — `flow_runs` and `flow_step_runs` tables; policies attach to flow runs via `policy_bindings.flow_run_id`. The reference `deep-research` flow exists at `flows/deep-research.yaml` and is the dogfood target in Phase 9
- `agent-providers` (change #3) shipped — provider router exposes `routeRequest({allowlist, fallbackChain})`; policy enforcement passes the resolved policy's provider rules into this call
- `agent-evidence` (change #4) shipped — `verifyFlowRun(flowRunId, policy)` and `evidence_conflicts` already wired; quality policies delegate to this module, and conflict-triggered approval gates reuse the agent-access approval queue

## Flag state by phase

| Phase | `AGENT_POLICY_ENABLED` | `AGENT_POLICY_BUDGET_ENFORCE` | `AGENT_POLICY_PROVIDER_ENFORCE` | `AGENT_POLICY_QUALITY_ENFORCE` | `AGENT_POLICY_SECURITY_ENFORCE` | `AGENT_POLICY_HUMAN_GATES` | per-flow `policy` opt-in |
|---|---|---|---|---|---|---|---|
| 1 | `false` | `false` | `false` | `false` | `false` | `false` | n/a |
| 2 | `false` | `false` | `false` | `false` | `false` | `false` | n/a |
| 3 | `true` (admin read-only smoke; flip back to `false` after 3.x verify) | `true` | `false` | `false` | `false` | `false` | none |
| 4 | `true` | `true` | `true` | `false` | `false` | `false` | none |
| 5 | `true` | `true` | `true` | `true` | `false` | `false` | none |
| 6 | `true` | `true` | `true` | `true` | `true` | `false` | none |
| 7 | `true` | `true` | `true` | `true` | `true` | `true` | none |
| 8 | `true` | `true` | `true` | `true` | `true` | `true` | none |
| 9 | `true` | `true` | `true` | `true` | `true` | `true` | `deep-research` only |

---

## Phase 1 — Schema + central module skeleton (no behavior change)

**Goal**: Land migration `0015_agent_policy.sql` with the 3 tables, stand up the central module `src/lib/agent-policy/` with backend interfaces and the 4 enforcement seams (definition / enforcement / approval-gates / inheritance), wire feature flags. Nothing enforces or binds yet — every public function is a stub returning `undefined` or a permissive pass-through so `AGENT_POLICY_ENABLED=false` is the kill switch.

**Files touched**: ~16 new (migration, 4 module skeletons + types + errors, storage interfaces, in-memory backend, flag entry, schema introspection test), ~3 modified (`wrangler.jsonc`, `src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-policy` green (skeleton tests only); `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0015_agent_policy.sql` cleanly and `sqlite_master` shows the 3 tables; `AGENT_POLICY_ENABLED=false` so no enforcement fires from any flow run or syscall

### 1.1 Wrangler + flags

- [ ] 1.1.1 Add `AGENT_POLICY_ENABLED`, `AGENT_POLICY_BUDGET_ENFORCE`, `AGENT_POLICY_PROVIDER_ENFORCE`, `AGENT_POLICY_QUALITY_ENFORCE`, `AGENT_POLICY_SECURITY_ENFORCE`, `AGENT_POLICY_HUMAN_GATES` to `wrangler.jsonc` `vars` block all defaulting to `"false"`; extend central `Env` type with the six fields; register the `agentPolicy` sub-block in `src/lib/config/flags.ts`
  - **Files**: `wrangler.jsonc` (modify — `vars` block), `src/lib/config/env.ts` (modify — append six fields), `src/lib/config/flags.ts` (modify — append `agentPolicy` sub-object)
  - **Pattern (design D11)**: mirrors agent-os Phase 1.1 and agent-evidence Phase 1.1 sub-block shape; one umbrella flag plus per-category sub-flags so each enforcement seam can be flipped independently during rollout
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert `flags.agentPolicy.enabled === false` when env empty and `=== true` when `AGENT_POLICY_ENABLED='true'`; per-category sub-flags toggle independently

### 1.2 D1 migration `0015_agent_policy.sql`

- [ ] 1.2.1 Create migration with `policy_definitions` table — `(policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_key TEXT NOT NULL UNIQUE, version INTEGER NOT NULL DEFAULT 1, label TEXT NOT NULL, category_json TEXT NOT NULL, created_by TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, archived_at INTEGER)`. `category_json` stores the 6-category typed body. Match `migrations/0013_agent_flow.sql` / `0014_agent_evidence.sql` style: `CREATE TABLE IF NOT EXISTS`, no `CHECK` constraints, TEXT enums with `--` comment, `INTEGER NOT NULL` epoch ms via `nowMs()`
  - **Files**: `migrations/0015_agent_policy.sql` (create)
  - **Pattern (design D1)**: `migrations/0013_agent_flow.sql` sibling style; one row per logical policy, immutable via version bump on edit
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0015_agent_policy.sql` exits 0; re-running is a no-op; `sqlite_master` returns the table

- [ ] 1.2.2 In the same migration add `policy_bindings` table — `(binding_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_id INTEGER NOT NULL REFERENCES policy_definitions(policy_id), flow_run_id INTEGER REFERENCES flow_runs(flow_run_id), flow_definition_id INTEGER REFERENCES flow_definitions(flow_definition_id), agent_id TEXT, scope TEXT NOT NULL, frozen_effective_json TEXT, created_at INTEGER NOT NULL)`. `scope ∈ {'run','flow_definition','agent','global'}` — comment lists allowed values. `frozen_effective_json` captures the resolved policy at flow-run creation (Phase 2 freeze rule). One row per binding, multiple bindings per `policy_id` allowed
  - **Files**: `migrations/0015_agent_policy.sql` (modify — append)
  - **Pattern (design D6, inheritance resolution)**: bindings table is the join between a policy and the unit it applies to (run / flow def / agent / global); freeze column avoids re-resolving inheritance every check
  - **Verify**: introspection test 1.5.1 asserts the 4 FK columns + the `scope` enum + `frozen_effective_json` column

- [ ] 1.2.3 In the same migration add `policy_violations` table — `(violation_id INTEGER PRIMARY KEY AUTOINCREMENT, flow_run_id INTEGER REFERENCES flow_runs(flow_run_id), agent_run_id INTEGER REFERENCES agent_runs(run_id), policy_id INTEGER NOT NULL REFERENCES policy_definitions(policy_id), category TEXT NOT NULL, rule_key TEXT NOT NULL, severity TEXT NOT NULL, observed_value_json TEXT NOT NULL, limit_value_json TEXT NOT NULL, action_taken TEXT NOT NULL, partial_output_ref TEXT, created_at INTEGER NOT NULL)`. `category ∈ {'budget','provider','quality','security','human','retry'}`; `severity ∈ {'warn','block','kill'}`; `action_taken ∈ {'logged','blocked','run_killed','approval_gated','request_retried','request_failed'}`
  - **Files**: `migrations/0015_agent_policy.sql` (modify — append)
  - **Pattern (design D12)**: violation telemetry mirrors agent-os `agent_run_events` denorm style; `partial_output_ref` points at an R2 key when the run was killed with partial output preserved
  - **Verify**: introspection test asserts category/severity/action enums and FK columns

- [ ] 1.2.4 Add indexes — `CREATE INDEX IF NOT EXISTS idx_policy_bindings_flow_run ON policy_bindings(flow_run_id)`, `idx_policy_bindings_policy ON policy_bindings(policy_id)`, `idx_policy_violations_flow_run ON policy_violations(flow_run_id)`, `idx_policy_violations_category ON policy_violations(category, created_at)`
  - **Files**: `migrations/0015_agent_policy.sql` (modify — append)
  - **Pattern (design D1)**: agent-os index style; covers the two hot read paths (resolve bindings for a run, list violations by category for the runbook dashboards)
  - **Verify**: `SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_policy_%'` returns 4 names

### 1.3 Backend interfaces (per agent-os Resolution Q5 adapter pattern)

- [ ] 1.3.1 Define backend interfaces every module depends on under `src/lib/agent-policy/storage/types.ts` — required: `PolicyDefinitionBackend`, `PolicyBindingBackend`, `PolicyViolationBackend` (3 interfaces). Mirror agent-os/agent-evidence split — one interface per concern
  - **Files**: `src/lib/agent-policy/storage/types.ts` (create)
  - **Pattern (design D2)**: agent-os `src/lib/agent-os/storage/types.ts`; one binding per concern
  - **Verify**: `pnpm tsc --noEmit` passes; file exports exactly 3 interfaces named above

- [ ] 1.3.2 Skeleton D1 backends — one file per interface under `src/lib/agent-policy/storage/d1/` with method stubs throwing `PolicyNotImplemented`. Phase 2 fills them in
  - **Files**: `src/lib/agent-policy/storage/d1/{definition,binding,violation}.ts` (create — 3 files)
  - **Pattern (design D2)**: agent-os Phase 1.3.2 stub style; signatures match interfaces from 1.3.1
  - **Verify**: `pnpm tsc --noEmit` passes; each backend exports a class whose method names match the interface exactly

- [ ] 1.3.3 In-memory test backend for every interface in 1.3.1 (3 classes) in a single file for easy import from module tests
  - **Files**: `src/lib/agent-policy/storage/test/in-memory.ts` (create)
  - **Pattern (design D2)**: agent-os `storage/test/in-memory.ts` `makeKV` style — hand-rolled, no Miniflare
  - **Verify**: imported by skeleton module tests in 1.4; `pnpm vitest run src/lib/agent-policy/storage` is green

### 1.4 Central module skeleton — `src/lib/agent-policy/`

- [ ] 1.4.1 Build `index.ts` — entrypoint that exports `createPolicy(env, backends)` returning `{ definition, enforcement, approvalGates, inheritance }`. Returns no-op stubs when `flags.agentPolicy.enabled === false` so callers can be unconditional
  - **Files**: `src/lib/agent-policy/index.ts`, `src/lib/agent-policy/errors.ts` (create — `PolicyNotImplemented`, `PolicyDefinitionInvalid`, `PolicyBudgetExceeded`, `PolicyProviderNotAllowed`, `PolicyQualityViolation`, `PolicySecurityViolation`, `PolicyApprovalRequired`, `PolicyApprovalRejected`, `PolicyApprovalExpired`, `PolicyRetryExhausted`, `PolicyInheritanceCycle`, `PolicyBindingConflict`, `PolicyFlagDisabled`)
  - **Pattern (design D1)**: agent-os `kernel.ts` four-module entry shape; agent-evidence `index.ts` boot wiring
  - **Verify**: `src/lib/agent-policy/index.test.ts` asserts (a) flag-off `createPolicy` returns objects whose every method resolves `undefined` or pass-through, (b) flag-on returns instances backed by `backends`

- [ ] 1.4.2 Skeleton `definition.ts` exporting `PolicyDefinitionRegistry` class with stubbed `register(definition)`, `getByKey(policyKey, version?)`, `list({category?, scope?})`, `archive(policyKey)` methods throwing `PolicyNotImplemented`
  - **Files**: `src/lib/agent-policy/definition.ts` (create)
  - **Pattern (design D1)**: facade class wrapping the storage backends; mirrors `EvidenceStore` skeleton shape
  - **Verify**: `pnpm tsc --noEmit` passes; signature matches the public API admin CRUD endpoints will call in Phase 2

- [ ] 1.4.3 Skeleton `enforcement.ts` exporting `PolicyEnforcer` class with stubbed `checkBudget(runId, ctx)`, `checkProvider(req, policy)`, `checkQuality(flowRunId, policy)`, `checkSecurity(payload, policy)`, `checkRetry(stepCtx, policy)` methods returning `{passed: true}` permissive default
  - **Files**: `src/lib/agent-policy/enforcement.ts` (create)
  - **Pattern (design D3, D4, D5, D6, D8)**: one method per enforcement seam; each replaced incrementally Phase 3–8
  - **Verify**: `pnpm tsc --noEmit` passes; permissive default lets the flow runtime call these unconditionally

- [ ] 1.4.4 Skeleton `approval-gates.ts` exporting `PolicyApprovalGates` class with stubbed `requestGate({runId, mode, riskScore, payload})`, `awaitDecision(approvalId)`, `applyEditOnApproval(approvalId, editedPayload)` methods
  - **Files**: `src/lib/agent-policy/approval-gates.ts` (create)
  - **Pattern (design D9)**: wraps agent-os `agent-access.requestApproval` with per-step / batch / edit-on-approval semantics; mirrors evidence conflict-gate wrapper
  - **Verify**: `pnpm tsc --noEmit` passes

- [ ] 1.4.5 Skeleton `inheritance.ts` exporting `PolicyInheritance` class with stubbed `resolve({runScope, flowDefId, agentId})` returning `{effective: EffectivePolicy, sourceChain: BindingSource[]}` — for now returns an empty effective policy + empty chain
  - **Files**: `src/lib/agent-policy/inheritance.ts` (create)
  - **Pattern (design D6)**: explicit resolution order (global → agent → flow_definition → run); cycle detection deferred to Phase 2
  - **Verify**: `pnpm tsc --noEmit` passes

### 1.5 Phase 1 gate

- [ ] 1.5.1 Schema introspection test confirms migration 0015 produced the expected 3 tables, 4 indexes, and all FK + enum columns from 1.2.1–1.2.4
  - **Files**: `src/lib/agent-policy/storage/migration-0014.test.ts` (create)
  - **Pattern (design D1)**: agent-evidence Phase 1.5.1 introspection style
  - **Verify**: test asserts `policy_definitions`, `policy_bindings`, `policy_violations` tables exist with declared columns; 4 `idx_policy_*` indexes present

---

## Phase 2 — Definition + binding (CRUD + inheritance freeze)

**Goal**: Implement production D1 backends, flesh out `PolicyDefinitionRegistry` and `PolicyInheritance` so policies can be authored, persisted, bound to flow definitions / runs / agents, and resolved deterministically. At flow-run creation, the effective policy is frozen into `policy_bindings.frozen_effective_json` so subsequent enforcement is a single read. CRUD ships behind admin endpoints; nothing enforces yet.

**Files touched**: ~12 new (3 D1 backend impls, typed schema, inheritance resolver, freeze helper, 3 admin endpoints, tests), ~1 modified (`src/lib/agent-flow/runtime/run.ts` calls `bindPolicyToFlowRun` at run start)
**Verification**: admin can POST `/api/admin/policies` to create a `research-quick` policy and `POST .../bindings` to bind it; starting a flow run with that flow_definition produces a `policy_bindings` row with non-null `frozen_effective_json` matching the resolved inheritance chain

### 2.1 Typed schema for 6 categories

- [ ] 2.1.1 Define `PolicyBody` discriminated type in `src/lib/agent-policy/schema/body.ts` with one optional sub-object per category — `budget?: BudgetPolicy`, `provider?: ProviderPolicy`, `quality?: QualityPolicy` (re-export from agent-evidence to keep types in sync), `security?: SecurityPolicy`, `human?: HumanPolicy`, `retry?: RetryPolicy`. Each sub-type exported from its own file under `src/lib/agent-policy/schema/categories/`
  - **Files**: `src/lib/agent-policy/schema/body.ts` (create), `src/lib/agent-policy/schema/categories/{budget,provider,quality,security,human,retry}.ts` (create — 6 files; `quality.ts` re-exports `QualityPolicy` from agent-evidence)
  - **Pattern (design D3)**: typed-schema-first; each category file owns its rule keys and defaults; mirrors agent-flow's verifier-type-per-file shape
  - **Verify**: `pnpm tsc --noEmit` passes; `src/lib/agent-policy/schema/body.test.ts` asserts a full fixture policy parses with all 6 categories populated

- [ ] 2.1.2 Define each category's rule keys per proposal — `BudgetPolicy`: `{max_cost_usd?, max_tokens?, max_iterations?, max_parallel_units?, max_runtime_seconds?}`; `ProviderPolicy`: `{allowlist?: string[], denylist?: string[], fallback_chain?: string[], region?: string, data_residency?: 'us'|'eu'|'apac'|'any'}`; `QualityPolicy`: re-export from agent-evidence `{citation_required?, min_sources?, stale_source_max_days?, conflict_check?, min_confidence?, enforcement?: 'block'|'warn'}`; `SecurityPolicy`: `{sensitive_data_redaction?: {patterns: RedactionPattern[], action: 'redact'|'block'|'log'}, tool_allowlist?: string[], least_privilege_scope?: boolean}`; `HumanPolicy`: `{approval_required_before_external_write?: boolean, approval_required_before_actions?: string[], risk_threshold?: number, mode?: 'per_step'|'batch'|'edit_on_approval', batch_window_seconds?: number, ttl_seconds?: number}`; `RetryPolicy`: `{max_attempts?: number, backoff?: 'fixed'|'exponential'|'jitter', backoff_base_ms?: number, fallback_provider?: string, on_exhaustion?: 'skip'|'fail'}`
  - **Files**: `src/lib/agent-policy/schema/categories/*.ts` (extend each file with the documented shape + JSDoc comment per rule key)
  - **Pattern (design D3)**: declarative rule keys; defaults documented inline; rule keys mirror proposal §"What Changes"
  - **Verify**: `src/lib/agent-policy/schema/categories/budget.test.ts` (and 5 siblings) parse a fixture and assert the typed shape; `pnpm tsc --noEmit` passes

- [ ] 2.1.3 Build `src/lib/agent-policy/schema/validate.ts` — `validatePolicyBody(body): {valid: boolean, errors: string[]}` performs structural validation (e.g. `max_cost_usd > 0`, `risk_threshold ∈ [0,1]`, `fallback_chain` entries exist as known providers via cross-check against the provider registry from agent-providers when available — soft-warn when registry not loaded)
  - **Files**: `src/lib/agent-policy/schema/validate.ts` (create)
  - **Pattern (design D3)**: pluggable validators per category; cross-module cross-checks soft-fail when peer module is absent (e.g. unit test mode)
  - **Verify**: validate test covers (a) all defaults pass, (b) negative `max_cost_usd` fails, (c) `risk_threshold = 2.0` fails, (d) unknown provider in `fallback_chain` warns but does not fail

### 2.2 D1 backend implementations

- [ ] 2.2.1 Implement `PolicyDefinitionBackend` — `insert({policy_key, version, label, body, created_by})` returns `policy_id`; `getByKey(policy_key, version?)` returns latest version when omitted; `list({category?, archived?})`; `archive(policy_key)` sets `archived_at = nowMs()`; `bumpVersion(policy_key, newBody)` creates a NEW row with `version + 1` (immutable history per design D1)
  - **Files**: `src/lib/agent-policy/storage/d1/definition.ts` (replace stub)
  - **Pattern (design D1)**: immutable-by-version; old policy bindings continue to resolve to the version they were frozen against
  - **Verify**: `src/lib/agent-policy/storage/d1/definition.test.ts` covers round-trip, version bump produces 2 rows, archive sets timestamp, `getByKey('foo')` returns the highest non-archived version

- [ ] 2.2.2 Implement `PolicyBindingBackend` — `insert({policy_id, scope, flow_run_id?, flow_definition_id?, agent_id?, frozen_effective_json?})` returns `binding_id`; `getByFlowRun(flowRunId)` returns the run-frozen binding; `listByFlowDefinition(flowDefId)`; `listByAgent(agentId)`; `listGlobal()`. Insert enforces scope/FK consistency: `scope='run'` requires `flow_run_id`, `scope='flow_definition'` requires `flow_definition_id`, `scope='agent'` requires `agent_id`, `scope='global'` requires all three NULL
  - **Files**: `src/lib/agent-policy/storage/d1/binding.ts` (replace stub)
  - **Pattern (design D6)**: scope-keyed lookup; FK consistency enforced at the backend layer (D1 cannot do conditional FKs)
  - **Verify**: binding test asserts scope/FK consistency throws `PolicyBindingConflict` on mismatch; round-trip works for all 4 scopes

- [ ] 2.2.3 Implement `PolicyViolationBackend` — `insert({flow_run_id?, agent_run_id?, policy_id, category, rule_key, severity, observed_value, limit_value, action_taken, partial_output_ref?})` returns `violation_id`; `listForFlowRun(flowRunId)`; `listByCategory(category, {since?, limit?})`. Violations are append-only — no update method (history preserved per design D12)
  - **Files**: `src/lib/agent-policy/storage/d1/violation.ts` (replace stub)
  - **Pattern (design D12)**: append-only telemetry; mirrors `agent_run_events` immutability
  - **Verify**: round-trip; `listByCategory('budget', {since: now - 86400000})` returns recent violations only

### 2.3 PolicyDefinitionRegistry impl

- [ ] 2.3.1 Replace `src/lib/agent-policy/definition.ts` stubs with the real impl that delegates to the backends from 2.2. Methods: `register(definition)` validates via `validatePolicyBody` then inserts (throws `PolicyDefinitionInvalid` on validation failure); `getByKey(policyKey, version?)`; `list(filters)`; `archive(policyKey)`; `bumpVersion(policyKey, newBody)`
  - **Files**: `src/lib/agent-policy/definition.ts` (replace skeleton)
  - **Pattern (design D1)**: facade delegating to backends; validation at the gate
  - **Verify**: `src/lib/agent-policy/definition.test.ts` covers all 5 methods via in-memory backend; invalid body throws

### 2.4 Inheritance resolver

- [ ] 2.4.1 Replace `src/lib/agent-policy/inheritance.ts` skeleton — `resolve({flowRunId, flowDefId, agentId})` queries bindings at each scope in resolution order: `global` → `agent` → `flow_definition` → `run`. For each scope, fetches the bound `policy_definitions.category_json` and shallow-merges into `effective`. Later scopes override earlier scopes per rule key (e.g. flow-definition-level `max_cost_usd=10` overrides agent-level `max_cost_usd=5`). Returns `{effective: PolicyBody, sourceChain: [{scope, policy_key, version}]}`. Cycle detection: if a binding references a policy that was already merged at a deeper scope, throw `PolicyInheritanceCycle`
  - **Files**: `src/lib/agent-policy/inheritance.ts` (replace skeleton)
  - **Pattern (design D6)**: explicit resolution order documented in `design.md`; deeper-scope-wins; merge is shallow per rule key (not deep — a `budget` block at run-scope fully replaces an agent-scope `budget` block, no partial merge to avoid confusion)
  - **Verify**: `src/lib/agent-policy/inheritance.test.ts` covers (a) single global binding → effective matches global, (b) global + run binding → run wins per overlapping rule key, (c) cycle → `PolicyInheritanceCycle`, (d) `sourceChain` records the actual scopes that contributed each rule key

### 2.5 Freeze at flow-run creation

- [ ] 2.5.1 Build `bindPolicyToFlowRun(flowRunId, {flowDefId, agentId})` in `src/lib/agent-policy/bind.ts` — called by agent-flow runtime at run start (Phase 2.5.2 wires the call). Steps: (1) call `inheritance.resolve(...)`, (2) if any binding exists at any scope, insert a `policy_bindings` row with `scope='run'`, `flow_run_id=flowRunId`, `frozen_effective_json = JSON.stringify(effective)`, (3) return the binding id. If no binding exists at any scope, return `null` (run proceeds unpoliced)
  - **Files**: `src/lib/agent-policy/bind.ts` (create)
  - **Pattern (design D6)**: freeze-at-creation avoids re-resolving inheritance on every enforcement check; if a policy version changes mid-run, the frozen copy keeps the run reproducible
  - **Verify**: `src/lib/agent-policy/bind.test.ts` covers (a) flow with global + flow-definition binding → freeze captures the merged effective, (b) no bindings → returns null, (c) frozen json round-trips through `JSON.parse` to the resolved effective

- [ ] 2.5.2 Wire `bindPolicyToFlowRun` into `src/lib/agent-flow/runtime/run.ts` immediately after the `flow_runs` row is inserted. Gate behind `flags.agentPolicy.enabled` — when off, skip the call entirely. Flow run does NOT fail if binding throws (logged + run proceeds unpoliced + violation row recorded with `category='budget'` `rule_key='binding_failed'` for ops visibility)
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify — add the call site)
  - **Pattern (design D6)**: side-effecting integration; non-blocking on binding errors to preserve flow runtime availability
  - **Verify**: integration test asserts (a) flag-off skips the call, (b) flag-on with no bindings is a no-op + no violation row, (c) flag-on with a binding inserts the `policy_bindings` row

### 2.6 CRUD admin endpoints

- [ ] 2.6.1 `POST /api/admin/policies` — create a new policy definition; body `{policy_key, label, body}`; returns `{policy_id, version: 1}`. `PUT /api/admin/policies/:policyKey` — bumps version with a new body. `DELETE /api/admin/policies/:policyKey` — archive. `GET /api/admin/policies` — list with `?category=` filter. `GET /api/admin/policies/:policyKey?version=` — fetch one
  - **Files**: `src/pages/api/admin/policies/index.ts` (create — GET list + POST create), `src/pages/api/admin/policies/[policyKey].ts` (create — GET one + PUT + DELETE), `src/pages/api/admin/policies/_guard.ts` (create — `ensureAgentPolicyEnabled()` returning 503 when flag off, mirrors agent-os Phase 1.5.8 + agent-evidence Phase 7.1.2)
  - **Pattern (design D13)**: admin CRUD shape mirrors agent-os/agent-evidence admin endpoints; gated by `requireAdmin` from agent-foundation
  - **Verify**: `curl -b 'session=...' .../api/admin/policies` returns `{policies:[]}`; POST + GET round-trips; flag-off returns 503

- [ ] 2.6.2 `POST /api/admin/policies/:policyKey/bindings` — body `{scope, flow_run_id?, flow_definition_id?, agent_id?}`; calls `PolicyDefinitionRegistry.getByKey` then `PolicyBindingBackend.insert`. Returns `{binding_id}`. `GET /api/admin/policies/:policyKey/bindings` — list bindings for a policy
  - **Files**: `src/pages/api/admin/policies/[policyKey]/bindings/index.ts` (create)
  - **Pattern (design D13)**: binding management ships in the same surface as definitions; scope/FK consistency enforced at the backend layer surfaces here as HTTP 400 via the `PolicyBindingConflict` mapper
  - **Verify**: round-trip via curl; mismatched scope/FK returns 400

- [ ] 2.6.3 `GET /api/admin/policies/runs/:flowRunId/effective` — returns the frozen effective policy bound to a flow run, plus the resolved `sourceChain`. Used by the operator to debug why a run was killed
  - **Files**: `src/pages/api/admin/policies/runs/[flowRunId]/effective.ts` (create)
  - **Pattern (design D6, D13)**: read-only inspection endpoint; mirrors agent-evidence Phase 7.1 provenance endpoint
  - **Verify**: 404 for unbound run; 200 with `{effective, sourceChain}` for a bound run

---

## Phase 3 — Budget enforcement (live, scheduler kill path)

**Goal**: Wire the budget category live — token / cost / iteration / runtime ceilings monitored continuously during a flow run. When any ceiling is reached, the scheduler kill path from agent-os D6 is invoked (`CancelSignalBackend.signal(runId)`) and the run is marked `failed` with `reason='budget_exceeded'`. Partial output is preserved as an R2 blob and referenced from the violation row.

**Files touched**: ~8 new (budget tracker, ceiling checks per rule, scheduler kill wiring, partial-output preserver, tests), ~2 modified (`src/lib/agent-flow/runtime/run.ts` + `src/lib/agent-policy/enforcement.ts`)
**Verification**: integration test runs a flow bound to a `{budget: {max_cost_usd: 0.001}}` policy + a mock provider that returns one `$0.005` request — flow run ends with `status='failed'`, `error_json.kind='budget_exceeded'`, `policy_violations` row with `category='budget'`, `rule_key='max_cost_usd'`, `action_taken='run_killed'`, `partial_output_ref` populated

### 3.1 Budget tracker

- [ ] 3.1.1 Build `src/lib/agent-policy/enforcement/budget/tracker.ts` — `BudgetTracker` class instantiated per flow run, exposes `recordTokenSpend(in, out, costUsd)`, `recordIteration()`, `recordParallelUnit(delta)`, `tickRuntime()`, and `check(policy): {breached: boolean, ruleKey?: string, observed?: number, limit?: number}`. State held in-memory keyed by `flow_run_id`; persisted to D1 via `RunStoreBackend` accumulator columns every N events (debounced) so a Worker restart can resume from approximate state
  - **Files**: `src/lib/agent-policy/enforcement/budget/tracker.ts` (create)
  - **Pattern (design D3)**: per-run accumulator; debounced D1 persistence per agent-os Phase 1.4.5 context-pruner style; in-memory hot path for low latency on every syscall
  - **Verify**: `src/lib/agent-policy/enforcement/budget/tracker.test.ts` covers (a) `recordTokenSpend(100, 50, 0.001)` followed by `check({budget: {max_cost_usd: 0.0005}})` → breached with `ruleKey='max_cost_usd'`, observed=0.001, limit=0.0005, (b) iteration count breach, (c) runtime breach via `tickRuntime()` advancing the clock past `max_runtime_seconds`, (d) parallel unit breach

- [ ] 3.1.2 Per-rule ceiling check modules — `max-cost-usd.ts`, `max-tokens.ts`, `max-iterations.ts`, `max-parallel-units.ts`, `max-runtime-seconds.ts`. Each exports `check(observed, limit): {breached: boolean}`
  - **Files**: `src/lib/agent-policy/enforcement/budget/{max-cost-usd,max-tokens,max-iterations,max-parallel-units,max-runtime-seconds}.ts` (create — 5 files)
  - **Pattern (design D3)**: one rule per file for testability; mirrors agent-evidence Phase 6.1.2 check-per-file style
  - **Verify**: `src/lib/agent-policy/enforcement/budget/max-cost-usd.test.ts` (and 4 siblings) cover pass + breach per rule

### 3.2 Kill path integration

- [ ] 3.2.1 Build `src/lib/agent-policy/enforcement/kill-switch.ts` — `killFlowRun({flowRunId, reason, violationId, partialOutputRef?}, kernel)` calls `kernel.cancelSignal.signal(flowRunId)` (KV cancel signal per agent-os D7) AND updates `flow_runs.status='failed'` + `error_json={kind: reason, violationId, partialOutputRef}` via `FlowRunStoreBackend.markFailed`. Idempotent — calling twice is a no-op
  - **Files**: `src/lib/agent-policy/enforcement/kill-switch.ts` (create)
  - **Pattern (design D3 + agent-os D6 scheduler kill path)**: budget policy is the trigger; kill-switch is a thin wrapper around the scheduler's existing cancel signal mechanism — does NOT introduce a new termination path
  - **Verify**: `src/lib/agent-policy/enforcement/kill-switch.test.ts` asserts (a) `CancelSignalBackend.signal` called once with the runId, (b) `flow_runs` row updated, (c) second call is no-op

- [ ] 3.2.2 Build `src/lib/agent-policy/enforcement/partial-output.ts` — `preservePartialOutput(flowRunId, partialOutput, kernel)` writes `partial-outputs/{flowRunId}.json` to R2 (using the kernel's `BlobBackend`) and returns the R2 key for `policy_violations.partial_output_ref`. Gated by `flags.agentPolicy.enabled` AND `flags.agentOs.memory.r2` — when R2 is off, partial output is dropped + a warning logged
  - **Files**: `src/lib/agent-policy/enforcement/partial-output.ts` (create)
  - **Pattern (design D3)**: partial-output preservation per proposal — "failed run with reason `budget_exceeded`" includes the in-progress output for operator inspection
  - **Verify**: test asserts (a) R2 put called with correct key when flag on, (b) drop + warn when off

### 3.3 Enforcer wiring

- [ ] 3.3.1 Replace `enforcement.checkBudget(runId, ctx)` stub in `src/lib/agent-policy/enforcement.ts` — loads frozen policy via `PolicyBindingBackend.getByFlowRun(runId)`, asks `BudgetTracker.check(policy.budget)`, on breach: (1) preserve partial output via 3.2.2, (2) insert `policy_violations` row with `action_taken='run_killed'` and the partial-output R2 key, (3) invoke `killFlowRun` from 3.2.1. Returns `{passed: !breached, ruleKey?, observed?, limit?}`
  - **Files**: `src/lib/agent-policy/enforcement.ts` (modify — replace `checkBudget`)
  - **Pattern (design D3)**: single dispatch point; orchestrates tracker check → violation log → kill
  - **Verify**: `src/lib/agent-policy/enforcement.test.ts` covers the full breach lifecycle end-to-end in-memory

- [ ] 3.3.2 Wire `checkBudget` into the flow runtime — `src/lib/agent-flow/runtime/run.ts` calls `enforcement.checkBudget(flowRunId, ctx)` after every step completion (cheap check, in-memory fast path), AND after every `syscall` invocation via a kernel hook (`kernel.on('syscall:complete', ...)` exposed by agent-os). Gated by `flags.agentPolicy.enabled` AND `flags.agentPolicy.budgetEnforce`
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify — add post-step check), `src/lib/agent-policy/listener.ts` (create — kernel syscall-completion hook installer that increments `BudgetTracker` from `agent_tool_calls` cost columns)
  - **Pattern (design D3)**: hot-path check at every event boundary; defense in depth — multiple check sites catch breaches sooner
  - **Verify**: integration test seeds a `max_iterations=2` budget, runs a 3-step flow, asserts step 3 never starts and the run is killed at step 2 completion

### 3.4 Phase 3 gate

- [ ] 3.4.1 End-to-end test — bind a `{budget: {max_cost_usd: 0.001}}` policy to a flow, mock the provider to return `$0.005` on the first request, run the flow, assert `flow_runs.status='failed'`, `error_json.kind='budget_exceeded'`, `policy_violations` row with `action_taken='run_killed'`, `partial_output_ref` is a non-empty R2 key, AND `wrangler r2 object get` retrieves the partial output. Flip `AGENT_POLICY_BUDGET_ENFORCE=true` locally only for this test; revert
  - **Files**: `src/lib/agent-policy/enforcement/budget/budget.integration.test.ts` (create)
  - **Pattern (design D3)**: full lifecycle gate; mirrors agent-evidence Phase 5.4.1 conflict end-to-end
  - **Verify**: test runs <3s; assertions hold; flip flag back to `false` after

---

## Phase 4 — Provider enforcement (allowlist + fallback)

**Goal**: When a syscall routes through `agent-providers`, the provider router consults the frozen `policy.provider` and (a) rejects providers not in `allowlist` / present in `denylist`, (b) consults `fallback_chain` order when the primary fails, (c) enforces `region` / `data_residency` against the provider registry's declared region. Violations are logged (warn) or block depending on severity.

**Files touched**: ~6 new (provider checker, region matcher, router-integration glue, tests), ~1 modified (`src/lib/agent-providers/router.ts` accepts a `policy` parameter)
**Verification**: integration test bound to `{provider: {allowlist: ['cloudflare'], denylist: ['openai']}}` policy + a syscall that requests `openai` → router throws `PolicyProviderNotAllowed`, `policy_violations` row with `category='provider'`, `rule_key='allowlist'`, `action_taken='blocked'`

### 4.1 Provider checker

- [ ] 4.1.1 Build `src/lib/agent-policy/enforcement/provider/check.ts` — `checkProvider(requestedProvider, policy.provider, registry): {allowed: boolean, reason?: 'not_in_allowlist'|'in_denylist'|'region_mismatch'|'residency_mismatch'}`. Order: denylist → allowlist → region → residency. Returns the first failing reason for actionable error messages
  - **Files**: `src/lib/agent-policy/enforcement/provider/check.ts` (create)
  - **Pattern (design D4)**: ordered check chain; mirrors agent-evidence Phase 5.1 rule-detector composition
  - **Verify**: `src/lib/agent-policy/enforcement/provider/check.test.ts` covers each reason path

- [ ] 4.1.2 Build `src/lib/agent-policy/enforcement/provider/region-matcher.ts` — `matchesRegion(providerRegion, policyRegion): boolean` with wildcard support (`'us-*'` matches `'us-east-1'`)
  - **Files**: `src/lib/agent-policy/enforcement/provider/region-matcher.ts` (create)
  - **Pattern (design D4)**: simple glob match; v2 hook for CIDR-style if needed
  - **Verify**: test covers exact match, wildcard match, mismatch, missing-region (returns `true` for unspecified — permissive when policy didn't declare a region)

### 4.2 Router integration

- [ ] 4.2.1 Extend `routeRequest({...})` in `src/lib/agent-providers/router.ts` to accept an optional `policy?: ProviderPolicy` parameter. When provided, calls `checkProvider(primary, policy, registry)` before dispatch — on `allowed:false`, walks `policy.fallback_chain` in order, calls `checkProvider` on each, picks the first allowed. If no fallback allowed, throws `PolicyProviderNotAllowed` (re-exported from `src/lib/agent-policy/errors.ts`)
  - **Files**: `src/lib/agent-providers/router.ts` (modify — extend signature, add policy-gated dispatch)
  - **Pattern (design D4)**: policy is an optional input to the router (preserves existing callers); when present, dispatch is policy-aware
  - **Verify**: extend `src/lib/agent-providers/router.test.ts` to cover (a) policy-omitted preserves legacy behavior, (b) policy with allowlist denies primary + picks fallback, (c) policy with empty fallback chain throws

- [ ] 4.2.2 Build `src/lib/agent-policy/enforcement/provider/wire.ts` — `wireProviderEnforcement(kernel, policy)` installs a syscall pre-hook (per agent-os `kernel.on('syscall:before', ...)` if exposed; if not, modify the kernel `syscall` helper to accept an optional `policyHook`). Hook reads the frozen policy via `PolicyBindingBackend.getByFlowRun(runId)`, extracts `policy.provider`, and passes it to `routeRequest`. Gated by `flags.agentPolicy.providerEnforce`
  - **Files**: `src/lib/agent-policy/enforcement/provider/wire.ts` (create); optionally `src/lib/agent-os/tools/syscall.ts` (modify — add optional policyHook param if not already there)
  - **Pattern (design D4)**: cross-module wiring; agent-policy is the source of truth, agent-providers + agent-os are consumers
  - **Verify**: integration test asserts policy.provider is consulted at syscall time without modifying agent code

### 4.3 Violation logging + fallback success path

- [ ] 4.3.1 Replace `enforcement.checkProvider(req, policy)` stub — when fallback succeeds, log a `policy_violations` row with `severity='warn'` and `action_taken='request_retried'`; when no fallback works, log `severity='block'` and `action_taken='blocked'`. Both cases include `observed_value_json={requested, denied_by}` and `limit_value_json={allowlist, denylist}`
  - **Files**: `src/lib/agent-policy/enforcement.ts` (modify — replace `checkProvider`)
  - **Pattern (design D4, D12)**: violations are first-class telemetry; warn vs block distinction surfaces in the runbook dashboard
  - **Verify**: provider integration test asserts both warn-then-success and block-on-exhaustion paths log distinct violation rows

### 4.4 Phase 4 gate

- [ ] 4.4.1 End-to-end test — bind `{provider: {allowlist: ['cloudflare'], fallback_chain: ['cloudflare','workersai']}}`, attempt a syscall requesting `openai`, assert `PolicyProviderNotAllowed` thrown, warn-level violation logged with the fallback walk recorded. Flip `AGENT_POLICY_PROVIDER_ENFORCE=true` locally only; revert after
  - **Files**: `src/lib/agent-policy/enforcement/provider/provider.integration.test.ts` (create)
  - **Pattern (design D4)**: full lifecycle gate; mirrors Phase 3.4.1
  - **Verify**: test runs <2s; assertions hold

---

## Phase 5 — Quality enforcement (delegate to agent-evidence)

**Goal**: At flow-run completion, `enforcement.checkQuality(flowRunId, policy.quality)` calls `agent-evidence.verifyFlowRun(flowRunId, policy.quality)` and, on `passed:false`, fails the run with `error_json.kind='quality_policy_violation'`. Respects `policy.quality.enforcement: 'block' | 'warn'` per agent-evidence Phase 6.3.2.

**Files touched**: ~3 new (quality delegator, runtime hook, test), ~1 modified (`src/lib/agent-policy/enforcement.ts`)
**Verification**: integration test with `{quality: {citation_required: true, min_sources: 3, enforcement: 'block'}}` and a flow that produces 1 source → run ends `failed`, `error_json.kind='quality_policy_violation'`, `policy_violations` row with `category='quality'`, `rule_key='min_sources'`

### 5.1 Quality delegator

- [ ] 5.1.1 Replace `enforcement.checkQuality(flowRunId, policy.quality)` stub — calls `evidence.verification.verifyFlowRun(flowRunId, policy.quality)`. On `passed:false`:
  - For each gap, insert a `policy_violations` row with `category='quality'`, `rule_key=gap.rule_key` (extracted from gap message), `severity = policy.quality.enforcement === 'block' ? 'block' : 'warn'`, `action_taken = policy.quality.enforcement === 'block' ? 'blocked' : 'logged'`
  - When `enforcement='block'`, return `{passed:false, action: 'fail_run', reason: 'quality_policy_violation', gaps}`; the runtime hook below fails the flow run
  - When `enforcement='warn'`, return `{passed:true, warnings: gaps}` so the run completes; gaps surface in the operator dashboard
  - **Files**: `src/lib/agent-policy/enforcement.ts` (modify — replace `checkQuality`)
  - **Pattern (design D5 + agent-evidence Phase 6)**: cross-change delegation; agent-evidence does the inspection, agent-policy decides the consequence
  - **Verify**: `src/lib/agent-policy/enforcement.test.ts` extended — `block` enforcement returns failure, `warn` returns warnings

### 5.2 Runtime hook

- [ ] 5.2.1 Wire `checkQuality` into `src/lib/agent-flow/runtime/run.ts` at flow-run completion (the same callsite where the final `verifier:policy` step is checked per agent-evidence Phase 8.1.2). When `action: 'fail_run'`, set `flow_runs.status='failed'` + `error_json={kind: 'quality_policy_violation', gaps}` via `FlowRunStoreBackend.markFailed`. Gated by `flags.agentPolicy.qualityEnforce`
  - **Files**: `src/lib/agent-flow/runtime/run.ts` (modify — add post-run quality check)
  - **Pattern (design D5)**: completion-time check; runs after all steps but before status flips to `done`
  - **Verify**: integration test asserts (a) flag-off skips, (b) flag-on + `block` flips run to failed with the documented error_json, (c) `warn` lets run complete with warnings in the response

### 5.3 Phase 5 gate

- [ ] 5.3.1 End-to-end test — bind `{quality: {citation_required: true, min_sources: 3, enforcement: 'block'}}`, run a `deep-research` flow that only retrieves 1 source, assert run fails with `kind='quality_policy_violation'` + `policy_violations` row. Flip `AGENT_POLICY_QUALITY_ENFORCE=true` locally only; revert
  - **Files**: `src/lib/agent-policy/enforcement/quality/quality.integration.test.ts` (create)
  - **Pattern (design D5)**: full lifecycle gate; reuses evidence fixtures from agent-evidence Phase 8
  - **Verify**: test runs <3s; assertions hold

---

## Phase 6 — Security enforcement (sensitive-data + tool allowlist + redaction logging)

**Goal**: Scan syscall inputs/outputs for sensitive data patterns (regex + named-entity heuristics for emails / phone / API keys / SSN-shaped strings). Intersect agent's declared `syscalls` grant with policy's `security.tool_allowlist`. Redaction logging writes the redacted payload to `policy_violations.observed_value_json` for audit. Block-on-violation gated by severity.

**Files touched**: ~9 new (sensitive scanner + 5 pattern modules, tool intersector, security wire, tests), ~1 modified (`src/lib/agent-policy/enforcement.ts`)
**Verification**: integration test bound to `{security: {sensitive_data_redaction: {patterns: [{kind: 'email'}], action: 'redact'}, tool_allowlist: ['search.posts']}}` on a syscall whose output contains an email → output mutated to `[REDACTED]`, violation row logged; syscall request for `search.external` blocked

### 6.1 Sensitive-data scanner

- [ ] 6.1.1 Build `src/lib/agent-policy/enforcement/security/patterns/{email,phone,api-key,ssn,credit-card}.ts` — each exports `scan(text): Match[]` with regex + minimal entity heuristics. Conservative (low false-positive) by default; `api-key` matches `[A-Za-z0-9_-]{32,}` after a `'key':` / `'token':` / `'Authorization: Bearer '` prefix only
  - **Files**: `src/lib/agent-policy/enforcement/security/patterns/*.ts` (create — 5 files)
  - **Pattern (design D6)**: pluggable patterns; conservative defaults; agent-evidence Phase 5.1 rule-per-file shape
  - **Verify**: per-pattern tests cover positive + negative cases; combined test asserts no cross-pattern overlap

- [ ] 6.1.2 Build `src/lib/agent-policy/enforcement/security/scanner.ts` — `scan(text, patternKinds): Match[]` dispatches to declared patterns; `redact(text, matches): {redacted: string, redactionMap: {[id]: original}}` produces redacted text and a map for audit reconstruction (kept in-memory only — never persisted)
  - **Files**: `src/lib/agent-policy/enforcement/security/scanner.ts` (create)
  - **Pattern (design D6)**: scanner is pure — IO happens in the wire module
  - **Verify**: scanner test covers (a) multiple pattern kinds in one input, (b) redact preserves length-equivalent placeholder per match, (c) redactionMap round-trips

### 6.2 Tool allowlist intersection

- [ ] 6.2.1 Build `src/lib/agent-policy/enforcement/security/tool-allowlist.ts` — `intersectGrants(agentSyscalls, policyToolAllowlist): {effective: string[], denied: string[]}`. If `policyToolAllowlist` is undefined, returns the agent's grant unchanged. Otherwise returns the intersection + the list of denied tools for violation logging
  - **Files**: `src/lib/agent-policy/enforcement/security/tool-allowlist.ts` (create)
  - **Pattern (design D6)**: defense in depth; agent-os's grant check is the inner ring, policy's allowlist is the outer ring
  - **Verify**: intersection test covers (a) policy unset → agent grant unchanged, (b) intersection subset, (c) policy allows tool not granted to agent → kernel still denies (kernel grant is authoritative; policy only narrows)

### 6.3 Wire + enforcement

- [ ] 6.3.1 Build `src/lib/agent-policy/enforcement/security/wire.ts` — `wireSecurityEnforcement(kernel, policy)` installs two hooks: (a) `syscall:before` — runs `intersectGrants` and throws `PolicySecurityViolation` if requested syscall is denied; (b) `syscall:after` — runs `scanner.scan` on the syscall output (and input on `'block'` action), applies `redact` if `action==='redact'`, throws if `action==='block'`. Both hooks log `policy_violations` rows
  - **Files**: `src/lib/agent-policy/enforcement/security/wire.ts` (create)
  - **Pattern (design D6)**: hook-based wiring; agent-policy is the cross-cutting concern installer
  - **Verify**: wire integration test covers all 3 actions (`redact` mutates output, `block` throws, `log` only logs)

- [ ] 6.3.2 Replace `enforcement.checkSecurity(payload, policy)` stub — used by the runtime hook above and exposed for explicit calls (e.g. from a verifier step). Returns `{passed: boolean, redacted?: string, violations: Violation[]}`. Gated by `flags.agentPolicy.securityEnforce`
  - **Files**: `src/lib/agent-policy/enforcement.ts` (modify — replace `checkSecurity`)
  - **Pattern (design D6)**: single dispatch point
  - **Verify**: enforcement test covers explicit-call shape

### 6.4 Phase 6 gate

- [ ] 6.4.1 End-to-end test — bind `{security: {sensitive_data_redaction: {patterns: [{kind: 'email'}], action: 'redact'}, tool_allowlist: ['search.posts']}}`, run a flow whose `search.posts` output contains `'user@example.com'` → output mutated to `'[REDACTED_EMAIL_1]'`, `policy_violations` row with `category='security'`, `rule_key='sensitive_data_redaction.email'`, `action_taken='logged'` (redact action is logged not blocked). Also assert a syscall to `search.external` from the same agent throws `PolicySecurityViolation` with `action_taken='blocked'`
  - **Files**: `src/lib/agent-policy/enforcement/security/security.integration.test.ts` (create)
  - **Pattern (design D6)**: full lifecycle gate
  - **Verify**: test runs <3s; assertions hold; flip `AGENT_POLICY_SECURITY_ENFORCE=true` locally only, revert

---

## Phase 7 — Human approval gates (per-step / batch / edit-on-approval)

**Goal**: Wire the `human` policy category into the kernel's `agent-access` approval mechanism per agent-os D9. Three modes:
- `per_step` — approval requested before each step matching `approval_required_before_actions[]`
- `batch` — approvals accumulate within a `batch_window_seconds` window, one consolidated approval covers all
- `edit_on_approval` — reviewer can supply an edited payload that replaces the agent's pending output before continue
Risk threshold: if `policy.human.risk_threshold` is set and the syscall has a `riskScore` field >= threshold, a gate fires regardless of `approval_required_before_actions`. Conflict-triggered gates (from agent-evidence Phase 5.3) integrate symmetrically.

**Files touched**: ~10 new (gate orchestrator, 3 mode handlers, risk scorer, batch window state, edit applier, conflict integration, tests), ~1 modified (`src/lib/agent-policy/approval-gates.ts`)
**Verification**: integration test in each mode produces an `agent_approval_requests` row with `reason='policy_human_gate'`; per-step mode pauses the step; batch mode accumulates 3 syscalls into 1 approval; edit-on-approval mode applies the reviewer's edited payload to the resumed run; conflict from agent-evidence routes through the same wrapper

### 7.1 Mode handlers

- [ ] 7.1.1 Build `src/lib/agent-policy/enforcement/human/modes/per-step.ts` — `requestPerStep({runId, stepId, action, kernel, ttlSeconds}): Promise<{decision, editedPayload?}>` calls `kernel.access.requestApproval({runId, reason: 'policy_human_gate', context: {mode: 'per_step', stepId, action}, ttlSeconds})`, awaits resolution
  - **Files**: `src/lib/agent-policy/enforcement/human/modes/per-step.ts` (create)
  - **Pattern (design D9)**: thin wrapper around agent-access; one approval per step
  - **Verify**: test asserts request created with `reason='policy_human_gate'` + context fields; awaited promise resolves to decision

- [ ] 7.1.2 Build `src/lib/agent-policy/enforcement/human/modes/batch.ts` — maintains a per-run batch window keyed by `flow_run_id`. `requestBatch({runId, stepId, action, kernel, windowSeconds, ttlSeconds})` adds the action to the current window's pending list; if window not yet open, opens it via `setTimeout(windowSeconds * 1000)`; when window closes, creates ONE approval request with `context: {mode: 'batch', actions: [...]}`. All requesting promises resolve with the single batch decision
  - **Files**: `src/lib/agent-policy/enforcement/human/modes/batch.ts` (create)
  - **Pattern (design D9)**: in-memory window state; resilient to Worker restart only at the cost of dropping pending actions (documented in runbook)
  - **Verify**: batch test asserts 3 calls within window produce 1 approval; window expiry triggers the consolidated request

- [ ] 7.1.3 Build `src/lib/agent-policy/enforcement/human/modes/edit-on-approval.ts` — `requestEditOnApproval({runId, stepId, action, payload, kernel, ttlSeconds})` is `per_step` + `context: {mode: 'edit_on_approval', currentPayload: payload}`. On resolution with `decision='approve'` + `editedPayload`, returns `{decision, editedPayload}`. The caller is responsible for substituting `editedPayload` into the resumed step
  - **Files**: `src/lib/agent-policy/enforcement/human/modes/edit-on-approval.ts` (create)
  - **Pattern (design D9)**: reviewer edits the payload before continue; requires agent-access approval resolution to accept an optional `editedPayload` field (add if not present)
  - **Verify**: test asserts editedPayload round-trips through the approval

### 7.2 Risk scorer

- [ ] 7.2.1 Build `src/lib/agent-policy/enforcement/human/risk.ts` — `scoreRisk({syscallName, input, agentId}): number` returns a 0–1 risk score. v1 heuristics: irreversible syscalls (per agent-os `irreversible.ts`) → 0.9; outbound network syscalls → 0.5; memory write syscalls → 0.3; pure read syscalls → 0.0. Custom risk hooks per syscall registered via a registry
  - **Files**: `src/lib/agent-policy/enforcement/human/risk.ts` (create)
  - **Pattern (design D9)**: pluggable risk scoring; v2 hook for model-based risk estimation
  - **Verify**: risk test covers each heuristic class; custom hook test asserts override path

### 7.3 Approval-gate orchestrator

- [ ] 7.3.1 Replace `approval-gates.ts` skeleton — `requestGate({runId, syscallName, input, action, agentId, policy.human, kernel}): Promise<{proceed: boolean, editedInput?}>`:
  - Compute `riskScore = scoreRisk({syscallName, input, agentId})`
  - If `riskScore < (policy.human.risk_threshold ?? 1.0)` AND `action ∉ (policy.human.approval_required_before_actions ?? [])` AND NOT (`policy.human.approval_required_before_external_write && isExternalWrite(syscallName)`), return `{proceed: true}` immediately
  - Otherwise dispatch to the mode handler from 7.1 per `policy.human.mode ?? 'per_step'`
  - On `decision='reject'`, throw `PolicyApprovalRejected` + log violation `category='human'`, `action_taken='blocked'`
  - On `decision='approve'` (with optional `editedInput`), return `{proceed: true, editedInput}` + log violation with `severity='warn'`, `action_taken='approval_gated'`
  - **Files**: `src/lib/agent-policy/approval-gates.ts` (replace skeleton)
  - **Pattern (design D9)**: orchestrator selects mode; emits violation rows for audit even on approve (records that a gate fired)
  - **Verify**: approval-gates test covers all 3 modes + risk-threshold path + reject path

### 7.4 Wire into syscall path

- [ ] 7.4.1 Wire `approval-gates.requestGate` into the kernel `syscall` helper via a pre-hook. When `flags.agentPolicy.humanGates === true` AND `policy.human` is set, call `requestGate` BEFORE the syscall dispatches; if `proceed:false`, throw; if `editedInput`, dispatch with the edited input
  - **Files**: `src/lib/agent-policy/enforcement/human/wire.ts` (create — installs the hook)
  - **Pattern (design D9)**: agent-policy installs the cross-cutting hook; agent-os does not learn about policy
  - **Verify**: integration test asserts gate fires before dispatch; edited input is used by handler

### 7.5 Conflict-triggered gates integrate symmetrically

- [ ] 7.5.1 Update `src/lib/agent-evidence/conflict.ts` `proposeReviewApproval` (shipped in agent-evidence Phase 5.3.1) to route through `approval-gates.requestGate({mode: 'per_step', action: 'evidence_conflict_review', ...})` when `flags.agentPolicy.humanGates` is on AND a `human` policy is bound to the flow run. When off, falls back to direct `kernel.access.requestApproval` per its existing behavior (so agent-evidence remains usable standalone)
  - **Files**: `src/lib/agent-evidence/conflict.ts` (modify — add policy-aware branch); document the cross-change integration in `src/lib/agent-evidence/conflict.ts` JSDoc
  - **Pattern (design D9)**: agent-policy is the consolidation point for all human-in-the-loop interactions; agent-evidence delegates upward when policy is present
  - **Verify**: integration test asserts (a) `humanGates` off + conflict → legacy direct approval, (b) `humanGates` on + conflict + `human` policy bound → routes through `requestGate` with `action='evidence_conflict_review'`, `policy_violations` row logged

### 7.6 Phase 7 gate

- [ ] 7.6.1 End-to-end tests — one per mode + one for risk-threshold + one for conflict integration (5 tests). Flip `AGENT_POLICY_HUMAN_GATES=true` locally only; revert
  - **Files**: `src/lib/agent-policy/enforcement/human/human.integration.test.ts` (create)
  - **Pattern (design D9)**: full lifecycle gate
  - **Verify**: all 5 paths covered; tests run <5s total

---

## Phase 8 — Retry policy (per-step overlay)

**Goal**: Layer `policy.retry` (max_attempts / backoff / fallback_provider / on_exhaustion) on top of the flow runtime's existing retry behavior. Policy is the override — when present, replaces the step-level retry config; when absent, runtime defaults apply. On exhaustion, `on_exhaustion='skip'` lets the run continue (step marked failed but flow proceeds), `'fail'` fails the run.

**Files touched**: ~5 new (retry overlay, backoff strategies, exhaustion handler, test), ~1 modified (`src/lib/agent-flow/runtime/retry.ts` accepts an optional policy)
**Verification**: integration test bound to `{retry: {max_attempts: 2, backoff: 'fixed', backoff_base_ms: 100, on_exhaustion: 'skip'}}` on a step that always fails → 2 attempts (not the default 3), step marked failed, flow run continues to next step

### 8.1 Backoff strategies

- [ ] 8.1.1 Build `src/lib/agent-policy/enforcement/retry/backoff/{fixed,exponential,jitter}.ts` — each exports `nextDelayMs(attempt, baseMs): number`. `fixed`: returns `baseMs`. `exponential`: returns `baseMs * 2^(attempt-1)`. `jitter`: exponential + random `[0, baseMs]` jitter
  - **Files**: `src/lib/agent-policy/enforcement/retry/backoff/*.ts` (create — 3 files)
  - **Pattern (design D8)**: one strategy per file; pure functions; deterministic except for jitter
  - **Verify**: per-strategy test asserts known outputs for attempts 1..5

### 8.2 Retry overlay

- [ ] 8.2.1 Build `src/lib/agent-policy/enforcement/retry/overlay.ts` — `overlayRetry(stepRetryConfig, policyRetry): RetryConfig` shallow-merges with `policyRetry` winning on overlapping keys. If `policyRetry` is undefined, returns `stepRetryConfig` unchanged
  - **Files**: `src/lib/agent-policy/enforcement/retry/overlay.ts` (create)
  - **Pattern (design D8)**: same shallow-merge semantics as inheritance resolver from Phase 2.4
  - **Verify**: overlay test covers (a) policy unset → step config unchanged, (b) policy `max_attempts=2` overrides step's `3`, (c) policy unset key inherits step value

### 8.3 Exhaustion handler

- [ ] 8.3.1 Build `src/lib/agent-policy/enforcement/retry/exhaustion.ts` — `handleExhaustion({flowRunId, stepRunId, error, policyRetry}, runtime)`. When `policyRetry.on_exhaustion === 'skip'`, mark step `failed` but return `{continue: true}` so the runtime advances to the next step. When `'fail'` (default), return `{continue: false}` and the runtime fails the run. Log `policy_violations` row with `category='retry'`, `rule_key='max_attempts_exhausted'`, `action_taken = on_exhaustion === 'skip' ? 'logged' : 'run_killed'`
  - **Files**: `src/lib/agent-policy/enforcement/retry/exhaustion.ts` (create)
  - **Pattern (design D8)**: exhaustion is a first-class outcome with two policy-driven branches
  - **Verify**: exhaustion test covers both branches; violation row logged in each

### 8.4 Runtime integration

- [ ] 8.4.1 Modify `src/lib/agent-flow/runtime/retry.ts` (or its current equivalent in agent-flow) to (a) call `overlayRetry(step.retry, frozenPolicy.retry)` to compute effective config, (b) consult the resolved backoff strategy module from 8.1, (c) on exhaustion, dispatch to `handleExhaustion` from 8.3. Gated by `flags.agentPolicy.enabled` only (no per-category flag — retry overlay is low-risk)
  - **Files**: `src/lib/agent-flow/runtime/retry.ts` (modify); if agent-flow doesn't have a dedicated retry module yet, create `src/lib/agent-policy/enforcement/retry/wire.ts` (create) that wraps the runtime's existing retry callsite
  - **Pattern (design D8)**: agent-policy is the consolidation point; agent-flow's retry remains the runtime engine
  - **Verify**: integration test asserts overlay applied; exhaustion branch chosen per policy

- [ ] 8.4.2 If `policy.retry.fallback_provider` is set, on exhaustion BEFORE giving up, request one final retry routing the syscall through the named fallback provider (uses `routeRequest({primary: fallback_provider})` from agent-providers). On fallback success, complete the step. On fallback failure, proceed to `handleExhaustion`
  - **Files**: `src/lib/agent-policy/enforcement/retry/fallback-provider.ts` (create)
  - **Pattern (design D8)**: provider-aware retry; bridges retry policy with provider policy
  - **Verify**: fallback test asserts (a) successful fallback completes the step, (b) failed fallback triggers exhaustion

### 8.5 Phase 8 gate

- [ ] 8.5.1 End-to-end test — bind `{retry: {max_attempts: 2, backoff: 'fixed', backoff_base_ms: 50, on_exhaustion: 'skip'}}`, run a 2-step flow where step 1 always fails → 2 attempts observed (timing assertion ±100ms), step marked failed, step 2 executes, flow `status='done'`. Second test: `on_exhaustion='fail'` → run fails after exhaustion
  - **Files**: `src/lib/agent-policy/enforcement/retry/retry.integration.test.ts` (create)
  - **Pattern (design D8)**: full lifecycle gate
  - **Verify**: both branches covered; tests run <2s

---

## Phase 9 — Reference policies + dogfood

**Goal**: Ship the three reference policies (`research-quick`, `research-standard`, `research-enterprise`) per proposal §"Ship reference policies"; dogfood by running `deep-research` flow under each policy variant; observe violation rate per category over 1 week; archive the OpenSpec change once the dashboard is green.

**Files touched**: ~6 new (3 reference policy seed files, runbook, health snippet, admin policy-list extension), ~1 modified (`flows/deep-research.yaml` adds `policy_binding: research-standard`)
**Verification**: 7-day dashboard green — `policy_violations` per category at expected rates (budget rare, provider rare, quality occasional, security rare, human gates occasional in `research-enterprise`); `openspec validate agent-policy --strict` passes; `openspec archive agent-policy` succeeds

### 9.1 Reference policy seed files

- [ ] 9.1.1 Build `src/lib/agent-policy/reference/research-quick.ts` — minimal policy for prototyping: `{budget: {max_cost_usd: 0.05, max_iterations: 3, max_runtime_seconds: 60}, provider: {allowlist: ['workersai','cloudflare']}, quality: {min_sources: 1, enforcement: 'warn'}, retry: {max_attempts: 1, on_exhaustion: 'skip'}}`. No `human` policy (no approval gates for quick experimentation)
  - **Files**: `src/lib/agent-policy/reference/research-quick.ts` (create)
  - **Pattern (design D10, proposal §"Ship reference policies")**: low-cost / fast-fail policy; matches Gateway Console plan §5.1 preset
  - **Verify**: reference test asserts schema validates + loads cleanly

- [ ] 9.1.2 Build `src/lib/agent-policy/reference/research-standard.ts` — production default: `{budget: {max_cost_usd: 1.00, max_iterations: 10, max_runtime_seconds: 600, max_parallel_units: 3}, provider: {allowlist: ['openai','anthropic','cloudflare','workersai'], fallback_chain: ['anthropic','openai','workersai']}, quality: {citation_required: true, min_sources: 3, stale_source_max_days: 365, conflict_check: true, enforcement: 'warn'}, security: {sensitive_data_redaction: {patterns: [{kind:'email'},{kind:'api-key'}], action: 'redact'}}, human: {approval_required_before_external_write: true, risk_threshold: 0.8, mode: 'per_step', ttl_seconds: 86400}, retry: {max_attempts: 3, backoff: 'exponential', backoff_base_ms: 500, on_exhaustion: 'fail'}}`
  - **Files**: `src/lib/agent-policy/reference/research-standard.ts` (create)
  - **Pattern (design D10)**: balanced policy; the default `deep-research` flow binds to this in 9.2
  - **Verify**: reference test asserts schema validates

- [ ] 9.1.3 Build `src/lib/agent-policy/reference/research-enterprise.ts` — strict compliance: `{budget: {max_cost_usd: 5.00, max_iterations: 20, max_runtime_seconds: 1800, max_parallel_units: 2}, provider: {allowlist: ['anthropic','openai'], denylist: ['workersai'], region: 'us-*', data_residency: 'us'}, quality: {citation_required: true, min_sources: 5, stale_source_max_days: 180, conflict_check: true, min_confidence: 0.7, enforcement: 'block'}, security: {sensitive_data_redaction: {patterns: [{kind:'email'},{kind:'phone'},{kind:'ssn'},{kind:'api-key'},{kind:'credit-card'}], action: 'block'}, tool_allowlist: ['search.posts','search.docs','search.external','post.get-detail'], least_privilege_scope: true}, human: {approval_required_before_external_write: true, approval_required_before_actions: ['send_email','publish','external_post'], risk_threshold: 0.5, mode: 'edit_on_approval', ttl_seconds: 172800}, retry: {max_attempts: 2, backoff: 'exponential', backoff_base_ms: 1000, on_exhaustion: 'fail'}}`
  - **Files**: `src/lib/agent-policy/reference/research-enterprise.ts` (create)
  - **Pattern (design D10)**: strictest policy; matches KPMG agentic-AI risk guidance posture
  - **Verify**: reference test asserts schema validates

- [ ] 9.1.4 Build `src/lib/agent-policy/reference/seed.ts` — `seedReferencePolicies(env, registry)` registers all 3 via `registry.register` if they don't already exist; idempotent. Called once at first admin endpoint hit OR via `POST /api/admin/policies/seed-reference` (preferred for explicit control)
  - **Files**: `src/lib/agent-policy/reference/seed.ts` (create), `src/pages/api/admin/policies/seed-reference.ts` (create)
  - **Pattern (design D10)**: explicit seed step; never auto-runs to avoid surprising operators
  - **Verify**: seed test asserts (a) first call inserts 3 rows, (b) second call is a no-op

### 9.2 Per-flow opt-in for deep-research

- [ ] 9.2.1 Extend agent-flow's flow definition AST (`src/lib/agent-flow/dsl/ast.ts`) to include an optional `policy_binding?: string` field (matches a `policy_definitions.policy_key`); extend the schema validator. When set, `bindPolicyToFlowRun` from Phase 2.5.1 resolves this as a `scope='flow_definition'` binding at run start
  - **Files**: `src/lib/agent-flow/dsl/ast.ts` (modify — add field), `src/lib/agent-flow/dsl/validate.ts` (modify)
  - **Pattern (design D6, agent-evidence Phase 8.1.1)**: per-flow opt-in via annotation; mirrors evidence's `evidence` annotation pattern
  - **Verify**: re-running agent-flow's DSL parser test still passes; new test asserts `definition.policy_binding === 'research-standard'` parses

- [ ] 9.2.2 Add `policy_binding: research-standard` to `flows/deep-research.yaml`
  - **Files**: `flows/deep-research.yaml` (modify — add the annotation)
  - **Pattern (design D10)**: production binds to `research-standard` by default
  - **Verify**: integration test runs a `deep-research` flow and asserts `policy_bindings` row exists with `frozen_effective_json` matching `research-standard` shape

### 9.3 7-day dogfood watch

- [ ] 9.3.1 Author `docs/agent-policy-runbook.md` with sections: "Inspect a flow run's frozen policy", "List recent violations by category", "Override a binding for one run (emergency)", "Rotate a reference policy to a new version", "Rollback (`AGENT_POLICY_ENABLED=false`)", "Investigate a `budget_exceeded` kill (recover partial output from R2)", "Approve a pending human gate", "Tune `research-standard` after dogfood signals". Include verbatim SQL recipes per agent-os Phase 6.2.2 style
  - **Files**: `docs/agent-policy-runbook.md` (create)
  - **Pattern**: agent-os Phase 6.2 + agent-evidence Phase 8.3.1 runbook structure
  - **Verify**: `grep -c "^## " docs/agent-policy-runbook.md` shows ≥8 sections

- [ ] 9.3.2 Daily dogfood snapshot — for 7 consecutive days save to `.omc/research/agent-policy-dogfood-day-{1..7}.md`:
  ```sql
  SELECT category, COUNT(*), SUM(CASE WHEN severity='block' THEN 1 ELSE 0 END) AS blocked, SUM(CASE WHEN severity='warn' THEN 1 ELSE 0 END) AS warned, SUM(CASE WHEN action_taken='run_killed' THEN 1 ELSE 0 END) AS killed FROM policy_violations WHERE created_at > unixepoch()*1000 - 86400000 GROUP BY category;
  SELECT pd.policy_key, COUNT(DISTINCT pb.flow_run_id) AS runs, COUNT(pv.violation_id) AS violations FROM policy_bindings pb JOIN policy_definitions pd ON pb.policy_id = pd.policy_id LEFT JOIN policy_violations pv ON pv.flow_run_id = pb.flow_run_id WHERE pb.created_at > unixepoch()*1000 - 86400000 GROUP BY pd.policy_key;
  SELECT pv.rule_key, COUNT(*) FROM policy_violations pv WHERE pv.category='human' AND pv.created_at > unixepoch()*1000 - 86400000 GROUP BY pv.rule_key;
  ```
  - **Files**: `.omc/research/agent-policy-dogfood-day-{1..7}.md` (create — 7 files)
  - **Pattern (design D12)**: agent-os Phase 6.3.1 + agent-evidence Phase 8.3.2 dashboard watch
  - **Verify**: 7 snapshot files exist; gate to advance: zero unintended `run_killed`, human-gate approval rate >70%, quality-warn rate <50% (signal that `research-standard` thresholds are tuned)

- [ ] 9.3.3 If any day shows red (high false-positive blocks, unintended kills, gate fatigue >5 pending >24h), open a follow-up issue tagged `agent-policy-tuning` capturing the failure mode; pause archive and decide whether to tune reference policies or rollback per-category enforcement flags
  - **Files**: (no new files — GitHub issue via `gh issue create`)
  - **Pattern (design D12, agent-evidence Phase 8.3.3)**: dogfood-driven tuning loop
  - **Verify**: issue filed and linked from `progress.txt` if applicable

### 9.4 Final cleanup + archive

- [ ] 9.4.1 Run the full quality suite — `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build`; capture output to `.omc/research/agent-policy-phase9-suite.log`; fix any drift
  - **Files**: (verification gate)
  - **Pattern**: agent-os Phase 6.3.2 / agent-evidence Phase 8.4.1 zero-regression gate
  - **Verify**: each command exits 0

- [ ] 9.4.2 Run `openspec validate agent-policy --strict` and reconcile any drift between proposal / tasks / specs and shipped behavior; confirm the three capability specs (`policy-definition`, `policy-enforcement`, `policy-approval-gates`) are present under `openspec/changes/agent-policy/specs/`
  - **Files**: (verification gate)
  - **Pattern**: agent-evidence Phase 8.4.2 strict-validate
  - **Verify**: command exits 0 with no warnings

- [ ] 9.4.3 Append to `progress.txt`: `agent-policy: complete — 6 categories enforced live; 3 reference policies (research-quick/standard/enterprise) shipped; deep-research dogfooded under research-standard with citation_required+min_sources=3; budget kill-switch verified end-to-end; archived YYYY-MM-DD`
  - **Files**: `progress.txt` (modify — append)
  - **Pattern**: project convention
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill

- [ ] 9.4.4 Run `openspec archive agent-policy` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-policy/` and fold delta specs into main specs
  - **Files**: (archive op)
  - **Pattern**: agent-os Phase 6.3.5 / agent-evidence Phase 8.4.4 archive flow
  - **Verify**: change appears under archive dir; main specs include the three policy capabilities

- [ ] 9.4.5 Open follow-up issues for deferred items: (a) ML-based risk scorer (v1 uses heuristics in Phase 7.2.1), (b) NLP-based sensitive-data scanner upgrade (v1 uses regex in Phase 6.1.1), (c) Durable Object backing for batch-window state (v1 uses in-memory state per Phase 7.1.2, lost on Worker restart), (d) policy preview / dry-run mode that simulates enforcement without writing violations, (e) reference policy auto-tuning loop driven by `policy_violations` aggregates
  - **Files**: (GitHub issues via `gh issue create`)
  - **Pattern**: agent-os Phase 6.3.6 / agent-evidence Phase 8.4.5 followups
  - **Verify**: 5 issues filed and linked from `progress.txt`
