## ADDED Requirements

### Requirement: External-write approval gate

When `EffectivePolicy.human.approval_required_before_external_write` is `true`, the kernel SHALL intercept every syscall in the reserved irreversible-action list (the same list consulted by `agent-access` for `irreversibleActionsRequireApproval`). For each such call the kernel SHALL insert an `agent_approval_requests` row with `status='pending'` and `kind='policy_external_write'`, transition the owning flow run to `awaiting_approval`, and leave the syscall promise unresolved until resolution. On approval the handler SHALL be invoked; on rejection the syscall SHALL reject with `PolicyApprovalRejected`.

#### Scenario: External write gated before invocation

- **WHEN** `EffectivePolicy.human.approval_required_before_external_write=true` and an agent calls `syscall('slack.post', ...)` (in the irreversible list)
- **THEN** the kernel SHALL insert an `agent_approval_requests` row with `kind='policy_external_write'`, the flow run SHALL transition to `awaiting_approval`, and the handler SHALL NOT be invoked until the approval is resolved

### Requirement: Action-provider approval gate

When `EffectivePolicy.human.approval_required_before_actions` is `true`, the kernel SHALL gate every action-provider call (Slack/Notion/GitHub/email/any provider category whose `ProviderDefinition.kind === 'action'`) regardless of whether the underlying syscall is in the irreversible-action list. The gate SHALL use the same `agent_approval_requests` mechanism with `kind='policy_action'`. This requirement is independent of `approval_required_before_external_write`; either flag alone is sufficient to gate the affected calls.

#### Scenario: Notion write gated by action flag

- **WHEN** `EffectivePolicy.human.approval_required_before_actions=true` and an agent calls `syscall('notion.createPage', ...)` whose provider has `kind: 'action'`
- **THEN** the kernel SHALL open an `agent_approval_requests` row with `kind='policy_action'` and the call SHALL block on approval

#### Scenario: Read-only provider call not gated

- **WHEN** the same policy is in force and the agent calls `syscall('search.query', ...)` whose provider has `kind: 'search'`
- **THEN** the kernel SHALL NOT open an approval row and the call SHALL proceed immediately

### Requirement: Risk-threshold-based approval

`EffectivePolicy.human.risk_threshold` MAY be one of `'low'|'medium'|'high'|'critical'`. For every gated-candidate syscall, the kernel SHALL compute a per-call risk score by combining the syscall's static `riskLevel` (declared on the syscall definition, defaulting to `'low'`) and any runtime risk signals provided by the calling agent. When the computed risk meets or exceeds the configured threshold, the kernel SHALL open an `agent_approval_requests` row with `kind='policy_risk_threshold'`. Risk below threshold SHALL NOT trigger a gate even when other approval flags would otherwise allow proceeding.

#### Scenario: Risk meets threshold opens gate

- **WHEN** `EffectivePolicy.human.risk_threshold='high'` and a syscall's computed risk is `'critical'`
- **THEN** the kernel SHALL open an `agent_approval_requests` row with `kind='policy_risk_threshold'` and the call SHALL block on approval

#### Scenario: Risk below threshold proceeds

- **WHEN** `EffectivePolicy.human.risk_threshold='high'` and a syscall's computed risk is `'medium'`
- **THEN** the kernel SHALL NOT open an approval row on risk grounds and the call SHALL proceed (subject to other gates)

### Requirement: Batch approval window

When `EffectivePolicy.human.batch_approval_window` is a positive integer `N`, a single human approval SHALL cover the next `N` gated calls within the same flow run rather than requiring per-step approval. The kernel SHALL persist the remaining count on the originating approval row (`details_json.remaining_uses`) and SHALL decrement it on each consumed call; when the count reaches zero a fresh approval row SHALL be required for the next gated call. When `batch_approval_window` is absent or `1`, the default per-step semantics SHALL apply.

#### Scenario: One approval covers N=3 subsequent calls

- **WHEN** `EffectivePolicy.human.batch_approval_window=3` and the first gated call is approved
- **THEN** the next two gated calls in the same flow run SHALL proceed without opening new approval rows, the originating row's `details_json.remaining_uses` SHALL decrement to `0`, and the fourth gated call SHALL open a fresh approval row

### Requirement: Edit-on-approval mutation

When a reviewer resolves an `agent_approval_requests` row via `POST /api/admin/agents/approvals/:approvalId/approve` with a non-empty `modified_params_json` body field, the kernel SHALL pass `modified_params_json` to the originally-blocked syscall handler in place of the original `params`. The kernel SHALL persist both the original `params` and the `modified_params_json` on the approval row for audit. When `modified_params_json` is absent the original `params` SHALL be used unchanged.

#### Scenario: Reviewer edits Slack message body before approval

- **WHEN** an agent calls `syscall('slack.post', { channel:'#x', text:'Hello' })`, the call is gated, and a reviewer approves with `modified_params_json: { channel:'#x', text:'Hello (revised)' }`
- **THEN** the slack handler SHALL receive `{ channel:'#x', text:'Hello (revised)' }`, the original `text:'Hello'` SHALL remain stored on the approval row, and the agent SHALL observe the handler's return value as if the modified params had been the original call

### Requirement: Conflict-triggered approval gate

When `EffectivePolicy.quality.conflict_check='surface'` and `agent-evidence` `verifyFlowRun` produces a `conflict_check` violation, the kernel SHALL open an `agent_approval_requests` row with `kind='policy_conflict_review'` (mirroring the `agent_access_requests` flow described in `agent-evidence`) and SHALL transition the flow run to `awaiting_approval` instead of `failed`. On approval the kernel SHALL re-invoke `verifyFlowRun` and transition the run according to the new result; on rejection the run SHALL transition to `failed` with `error_json.reason='quality_policy_violation'`.

#### Scenario: Surfaceable conflict opens approval

- **WHEN** `EffectivePolicy.quality.conflict_check='surface'` and an unresolved evidence conflict exists at end of run
- **THEN** the kernel SHALL open an `agent_approval_requests` row with `kind='policy_conflict_review'` and the flow run SHALL transition to `awaiting_approval` (not `failed`)

#### Scenario: conflict_check='fail' skips the gate

- **WHEN** `EffectivePolicy.quality.conflict_check='fail'` and the same unresolved conflict exists
- **THEN** the kernel SHALL NOT open an approval row, the run SHALL transition directly to `failed`, and `error_json.reason` SHALL equal `'quality_policy_violation'`

### Requirement: Approval timeout fails the flow run

All policy-opened `agent_approval_requests` rows SHALL inherit the existing `agent-access` TTL semantics via `expires_at`. When the daily cron sweep marks a policy-opened approval as `status='expired'`, the kernel SHALL transition the owning flow run from `awaiting_approval` to `failed` and SHALL set `flow_runs.error_json = { reason: 'approval_timeout', approval_id, kind }`. The blocked syscall promise SHALL reject with `PolicyApprovalExpired`.

#### Scenario: Expired approval fails the flow run

- **WHEN** an approval row opened by `policy-approval-gates` reaches `expires_at` and the cron sweep marks it `status='expired'`
- **THEN** the owning flow run SHALL transition from `awaiting_approval` to `failed`, `flow_runs.error_json.reason` SHALL equal `'approval_timeout'`, and the blocked syscall promise SHALL reject with `PolicyApprovalExpired`
