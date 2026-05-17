## ADDED Requirements

### Requirement: Typed policy schema across six categories

The runtime SHALL define a top-level `Policy` type `{ id: string, name: string, version: number, budget?: BudgetPolicy, provider?: ProviderPolicy, quality?: QualityPolicy, security?: SecurityPolicy, human?: HumanPolicy, retry?: RetryPolicy }`. Each category sub-type SHALL be a closed object: `BudgetPolicy = { max_cost_usd?: number, max_tokens?: number, max_iterations?: number, max_parallel_units?: number, max_runtime_seconds?: number }`; `ProviderPolicy = { allowlist?: string[], denylist?: string[], fallback_chains?: Record<string,string[]>, allowed_regions?: string[] }`; `QualityPolicy = { min_sources?: number, citation_required?: boolean, conflict_check?: 'fail'|'surface'|'ignore', stale_source_check?: { max_age_seconds: number } }`; `SecurityPolicy = { sensitive_patterns?: string[], tool_allowlist?: string[], least_privilege_scope?: boolean }`; `HumanPolicy = { approval_required_before_external_write?: boolean, approval_required_before_actions?: boolean, risk_threshold?: 'low'|'medium'|'high'|'critical', batch_approval_window?: number }`; `RetryPolicy = { max?: number, backoff?: 'fixed'|'exponential', delay_ms?: number, fallback_provider?: string, on_exhaustion?: 'skip'|'fail' }`. Unknown top-level categories or unknown fields within categories SHALL be rejected at validation time.

#### Scenario: All six categories accepted on a single policy

- **WHEN** a policy is defined containing all of `budget`, `provider`, `quality`, `security`, `human`, and `retry` with valid field shapes
- **THEN** the validator SHALL accept the definition and persist it without dropping any category

### Requirement: JSON-Schema validation at definition time

`definePolicy(policy: Policy): PolicyRecord` SHALL run JSON-Schema validation against every category sub-schema before persisting. The validator SHALL reject unknown fields (`additionalProperties: false` semantics), SHALL reject negative numeric ceilings on `BudgetPolicy.max_cost_usd`, `max_tokens`, `max_iterations`, `max_parallel_units`, `max_runtime_seconds`, and SHALL reject zero on fields that semantically require positive values (`min_sources`, `batch_approval_window`, `retry.max`). Validation failures SHALL throw `PolicyValidationError` whose message lists the offending field path and the violated rule.

#### Scenario: Unknown field rejected

- **WHEN** `definePolicy({ id: 'p1', name: 'p1', version: 1, budget: { max_cost_usd: 5, bogus_field: 1 } })` is invoked
- **THEN** the call SHALL throw `PolicyValidationError` whose message references the path `budget.bogus_field`

#### Scenario: Negative budget rejected

- **WHEN** `definePolicy({ id: 'p1', name: 'p1', version: 1, budget: { max_cost_usd: -1 } })` is invoked
- **THEN** the call SHALL throw `PolicyValidationError` referencing `budget.max_cost_usd` and the negative-value rule

### Requirement: Persistence in policy_definitions with version-as-row

Validated policies SHALL be persisted to a `policy_definitions` D1 table keyed by composite `(id, version)`. A new `definePolicy` call with the same `id` and an incremented `version` SHALL insert a new row and SHALL NOT overwrite the prior row. The table SHALL store `id`, `version`, `name`, `policy_json` (the full normalized policy), `created_at`, and `created_by`.

#### Scenario: Version bump creates new row

- **WHEN** `definePolicy({ id: 'research-standard', version: 1, ... })` is followed by `definePolicy({ id: 'research-standard', version: 2, ... })`
- **THEN** the `policy_definitions` table SHALL contain two rows `(research-standard, 1)` and `(research-standard, 2)` and both SHALL be readable by version

#### Scenario: Same version rejected as duplicate

- **WHEN** `definePolicy({ id: 'research-standard', version: 1, ... })` is invoked twice with no version change
- **THEN** the second call SHALL throw `PolicyDuplicateVersionError` and the table SHALL still contain exactly one row for `(research-standard, 1)`

### Requirement: Run-time policy binding

The runtime SHALL expose `bindPolicyToFlowRun({ flow_run_id: string, policy_id?: string, policy_version?: number, policy_inline?: Policy }): EffectivePolicy`. Exactly one of `policy_id` or `policy_inline` MUST be supplied; supplying both or neither SHALL throw `PolicyBindError`. On success the runtime SHALL materialize the resolved `EffectivePolicy`, freeze it (deep-immutable), and persist a `flow_run_policies` row binding the `flow_run_id` to the resolved `policy_json`. Subsequent mutations of the underlying `policy_definitions` row SHALL NOT affect the bound run.

#### Scenario: Bind by id materializes immutable snapshot

- **WHEN** `bindPolicyToFlowRun({ flow_run_id: 'R1', policy_id: 'research-standard', policy_version: 1 })` is invoked
- **THEN** a `flow_run_policies` row SHALL exist with `flow_run_id='R1'` and `policy_json` byte-equal to the policy at definition time, and the returned `EffectivePolicy` SHALL be deep-frozen

#### Scenario: Mutating definition does not leak into bound run

- **WHEN** `definePolicy({ id: 'p', version: 2, ... })` runs after a flow run is already bound to `(p, 1)`
- **THEN** reads of the bound run's `EffectivePolicy` SHALL still reflect version 1 and SHALL NOT see version 2 fields

### Requirement: Inheritance and override resolution

When `policy_inline` is supplied alongside a flow-definition default policy reference, the runtime SHALL resolve the effective policy by deep-merging in explicit precedence order: **base policy** (flow-definition default) → **flow override** (declared on the flow's `policy_overrides` field) → **run override** (`policy_inline` on the bind call). Per-field merge SHALL apply at the leaf level; later layers SHALL replace earlier layers field-by-field, and array-valued fields (e.g. `allowlist`) SHALL be replaced wholesale, not concatenated. The final merged result SHALL itself be re-validated against the JSON Schema before being frozen.

#### Scenario: Run override beats flow override beats base

- **WHEN** base declares `budget.max_cost_usd=10`, flow override declares `budget.max_cost_usd=5`, run override declares `budget.max_cost_usd=2`
- **THEN** the resolved `EffectivePolicy.budget.max_cost_usd` SHALL equal `2`

#### Scenario: Array fields replaced wholesale, not concatenated

- **WHEN** base declares `provider.allowlist=['openai','anthropic']` and run override declares `provider.allowlist=['gemini']`
- **THEN** the resolved `EffectivePolicy.provider.allowlist` SHALL equal `['gemini']` and SHALL NOT contain `'openai'` or `'anthropic'`

### Requirement: Reference policies shipped with the runtime

The runtime SHALL ship three reference policies that are auto-seeded into `policy_definitions` on first boot: `research-quick` (loose ceilings, no approval, single source allowed), `research-standard` (medium ceilings, citation_required, conflict_check='surface'), `research-enterprise` (tight ceilings, citation_required, conflict_check='fail', min_sources>=3, approval_required_before_external_write=true, region allowlist enforced). All three SHALL be invokable by id without further definition.

#### Scenario: Reference policies seeded on first boot

- **WHEN** the kernel boots against an empty `policy_definitions` table
- **THEN** after boot the table SHALL contain at least the rows `(research-quick, 1)`, `(research-standard, 1)`, `(research-enterprise, 1)` with their canonical field values

#### Scenario: Reference policy bound by id

- **WHEN** `bindPolicyToFlowRun({ flow_run_id: 'R2', policy_id: 'research-enterprise', policy_version: 1 })` is invoked
- **THEN** the bind SHALL succeed and the resolved `EffectivePolicy` SHALL include `human.approval_required_before_external_write=true` and `quality.min_sources>=3`

### Requirement: Effective policy frozen and queryable

After binding, the runtime SHALL expose `getEffectivePolicy(flow_run_id: string): EffectivePolicy` returning the persisted policy snapshot. The returned object SHALL be deep-frozen so that downstream enforcement layers cannot mutate it. The function SHALL throw `PolicyNotBoundError` when no `flow_run_policies` row exists for the given run.

#### Scenario: getEffectivePolicy returns frozen snapshot

- **WHEN** `getEffectivePolicy('R1')` is invoked after a successful bind
- **THEN** the returned object SHALL be deep-frozen (writes throw in strict mode) and SHALL be byte-equal to the persisted `flow_run_policies.policy_json` for `R1`

#### Scenario: Unbound run rejected

- **WHEN** `getEffectivePolicy('R_unbound')` is invoked for a flow run with no `flow_run_policies` row
- **THEN** the call SHALL throw `PolicyNotBoundError` referencing the `flow_run_id`
