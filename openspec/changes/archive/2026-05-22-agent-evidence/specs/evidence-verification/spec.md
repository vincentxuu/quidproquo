## ADDED Requirements

### Requirement: Quality-policy enforcement boundary

The kernel SHALL expose `verifyFlowRun({ flow_run_id, policy }): VerificationResult` where `VerificationResult` is `{ pass: boolean, violations: Violation[] }` and `Violation` is `{ rule: string, message: string, details_json: object }`. The function SHALL be the single boundary at which quality policies are enforced against an evidence-store snapshot; agents and flows SHALL NOT bypass this boundary by reading evidence tables directly to "self-verify".

#### Scenario: Pass returns empty violations

- **WHEN** `verifyFlowRun({ flow_run_id: R, policy: P })` runs against a flow whose evidence satisfies every clause of `P`
- **THEN** the call SHALL return `{ pass: true, violations: [] }`

#### Scenario: Fail returns one violation per failing rule

- **WHEN** `policy` requires both `min_sources=3` and `citation_required=true` and the run satisfies neither
- **THEN** the call SHALL return `{ pass: false, violations: [...] }` containing exactly one entry per failing rule with distinct `rule` values

### Requirement: Enforced policy fields

`verifyFlowRun` SHALL enforce at minimum these four policy fields when present on `policy`: `min_sources: number` (every claim cited in the run output SHALL link to ≥ that many distinct sources), `citation_required: boolean` (every claim cited in the run output SHALL have a valid `claim → ≥1 excerpt → 1 source` chain when `true`), `conflict_check: boolean` (no unresolved `evidence_conflicts` row SHALL exist for the run when `true`), `stale_source_check: { max_age_seconds: number }` (every cited source SHALL have `now() - retrieved_at ≤ max_age_seconds`).

#### Scenario: min_sources violation produces typed violation

- **WHEN** `policy.min_sources=3` and a cited claim is supported by only 2 distinct sources
- **THEN** the result SHALL include a violation with `rule='min_sources'`, `details_json.claim_id` set, and `details_json.actual=2`, `details_json.required=3`

#### Scenario: citation_required violation when claim uncited

- **WHEN** `policy.citation_required=true` and an output-referenced claim has zero citations
- **THEN** the result SHALL include a violation with `rule='citation_required'` and `details_json.claim_id` set

#### Scenario: conflict_check violation when unresolved conflict exists

- **WHEN** `policy.conflict_check=true` and the run has an `evidence_conflicts` row with `resolution='unresolved'`
- **THEN** the result SHALL include a violation with `rule='conflict_check'` and `details_json.conflict_id` set

#### Scenario: stale_source_check violation when source too old

- **WHEN** `policy.stale_source_check.max_age_seconds=86400` and a cited source's `retrieved_at` is 200000s old
- **THEN** the result SHALL include a violation with `rule='stale_source_check'`, `details_json.source_id` set, and `details_json.age_seconds=200000`

### Requirement: Failed verification transitions run to failed

When `verifyFlowRun` returns `pass=false` for a run not yet in a terminal status, the kernel SHALL transition `flow_runs.status` from `running` (or `done`) to `failed` and SHALL set `flow_runs.error_json = { reason: 'quality_policy_violation', violations: [...] }` carrying the full violations list. The transition SHALL emit a `flow_run_failed` lifecycle event with the same `error_json` payload.

#### Scenario: Failed verification fails the run

- **WHEN** `verifyFlowRun({ flow_run_id: R, policy: P })` returns `{ pass: false, violations: [V] }` and `flow_runs.status` for `R` is `running`
- **THEN** the kernel SHALL set `flow_runs.status='failed'` and `flow_runs.error_json={ reason: 'quality_policy_violation', violations: [V] }`

#### Scenario: Already-failed run not re-failed

- **WHEN** `verifyFlowRun` returns `pass=false` for a run already in `failed`
- **THEN** the kernel SHALL NOT mutate `flow_runs.status` or `error_json` and SHALL still persist the verification audit row

### Requirement: Conflict surfaces approval gate

When `conflict_check=true` produces a violation, the kernel SHALL additionally request a human-approvable gate via `agent-access` by opening an `agent_access_requests` row with `kind='evidence_conflict_review'`, `resource_json={ flow_run_id, conflict_id }`, and `requested_by='evidence-verification'`. The flow run SHALL transition to `awaiting_approval` instead of `failed` while the gate is open; on approval the kernel SHALL re-run `verifyFlowRun`, and on rejection the kernel SHALL transition the run to `failed` with `reason='quality_policy_violation'`.

#### Scenario: Conflict opens access request

- **WHEN** `conflict_check=true` and an unresolved conflict `K` exists in run `R`
- **THEN** the kernel SHALL insert an `agent_access_requests` row with `kind='evidence_conflict_review'` and `resource_json={ flow_run_id: R, conflict_id: K }`, and `flow_runs.status` for `R` SHALL be `awaiting_approval`

#### Scenario: Approval re-runs verification

- **WHEN** a human approves the access request for conflict `K` in run `R`
- **THEN** the kernel SHALL re-invoke `verifyFlowRun({ flow_run_id: R, policy: P })` and SHALL transition `R` according to the new result

### Requirement: Stale source check uses retrieved_at

The `stale_source_check` rule SHALL compare `now() - evidence_sources.retrieved_at` against the policy's `max_age_seconds` for every distinct source cited by a claim in the run output. Sources not cited SHALL NOT cause violations. The comparison SHALL use the kernel's UTC clock at the moment `verifyFlowRun` is called.

#### Scenario: Uncited stale source does not trigger violation

- **WHEN** `policy.stale_source_check.max_age_seconds=86400`, source `S1` is cited and 200000s old, source `S2` is uncited and 500000s old
- **THEN** the result SHALL include exactly one `stale_source_check` violation referencing `S1` and SHALL NOT reference `S2`

#### Scenario: Fresh cited source produces no violation

- **WHEN** every cited source has `now() - retrieved_at < max_age_seconds`
- **THEN** the result SHALL contain zero `stale_source_check` violations

### Requirement: Idempotency given identical evidence state

`verifyFlowRun` SHALL be a pure function of `(flow_run_id, policy, evidence-store snapshot)`. Two invocations with identical arguments and an unchanged evidence-store state SHALL return byte-equal `VerificationResult` objects (after deterministic ordering of `violations` by `rule` then `details_json.claim_id`). Repeated invocations SHALL NOT mutate evidence tables; they SHALL only append a fresh row to `evidence_verifications`.

#### Scenario: Second call returns identical result

- **WHEN** `verifyFlowRun({ flow_run_id: R, policy: P })` is invoked twice in succession with no intervening mutation of evidence tables
- **THEN** both calls SHALL return byte-equal `VerificationResult` objects after deterministic ordering of `violations`

#### Scenario: Repeated calls do not mutate evidence

- **WHEN** `verifyFlowRun` is invoked twice
- **THEN** the row counts of `evidence_sources`, `evidence_excerpts`, `evidence_claims`, `evidence_citations`, `evidence_conflicts` SHALL be unchanged across the two invocations

### Requirement: Audit persistence

Every invocation of `verifyFlowRun` SHALL append a row to `evidence_verifications` capturing `id` (ULID), `flow_run_id`, `policy_json`, `pass`, `violations_json`, `evaluated_at`. The row SHALL be written before the function returns so that crash mid-verification leaves either zero or one durable audit record per call.

#### Scenario: Verification result persisted

- **WHEN** `verifyFlowRun({ flow_run_id: R, policy: P })` returns `{ pass: true, violations: [] }`
- **THEN** an `evidence_verifications` row SHALL exist with `flow_run_id=R`, `policy_json=P`, `pass=true`, `violations_json=[]`, and a non-null `evaluated_at`

#### Scenario: Failed verification also audited

- **WHEN** `verifyFlowRun` returns `{ pass: false, violations: [V] }`
- **THEN** an `evidence_verifications` row SHALL exist with `pass=false` and `violations_json` containing `V`
