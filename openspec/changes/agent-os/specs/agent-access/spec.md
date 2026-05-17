## ADDED Requirements

### Requirement: Declarative grants in agent definition

Each agent SHALL declare its permissions at definition time via `defineAgent({ syscalls, memoryScopes, secrets, outboundDomains, irreversibleActionsRequireApproval, approvalTtlSeconds? })`. These declarations are the single source of truth; the kernel mirrors them into `agent_permissions` on each boot.

#### Scenario: Grants mirrored on boot

- **WHEN** the Worker boots and the registry contains an agent with `syscalls: ['memory.read', 'search.external']` and `memoryScopes: ['agent', 'session']`
- **THEN** the kernel SHALL upsert the `agent_permissions` row for that agent with the declared arrays and `updated_at = now()`

#### Scenario: Grant change requires version bump

- **WHEN** an agent's declared `syscalls` array changes between deploys
- **THEN** the agent definition's `version` field MUST be incremented; the kernel SHALL refuse to boot with a `PermissionsChangedWithoutVersionBump` error if the row in `agent_permissions` has the same `version` but a different grants hash

### Requirement: Runtime denial logging

Every permission denial — unknown syscall, syscall not in grants, outbound domain not granted, cross-scope memory access, tool-call ceiling exceeded — SHALL produce an `agent_run_events` row with `kind='denied'` and `payload_json.reason` set to a stable string identifying the denial reason.

#### Scenario: Cross-scope memory access denied

- **WHEN** an agent attempts to read memory in a scope its `memoryScopes` does not include
- **THEN** the kernel SHALL emit an event with `kind='denied'`, `payload_json={reason:'cross_scope_memory', requested:'org:1|user:other|...'}` and throw `AgentAccessDenied`

### Requirement: Irreversible action approval gate

When a syscall is registered with `requiresApproval: true` or when the calling agent has `irreversibleActionsRequireApproval: true` and the syscall is in the kernel's reserved irreversible-action list, the kernel SHALL pause the run and insert an `agent_approval_requests` row before invoking the handler.

#### Scenario: Approval requested for slack.post

- **WHEN** an agent with `irreversibleActionsRequireApproval: true` calls `syscall('slack.post', ...)` (registered as irreversible)
- **THEN** the kernel SHALL insert an `agent_approval_requests` row with `status='pending'`, transition the run to `paused`, and the syscall promise SHALL remain unresolved

#### Scenario: Approval bypass for non-irreversible syscall

- **WHEN** the same agent calls `syscall('search.external', ...)` (not in the irreversible list)
- **THEN** the kernel SHALL invoke the handler immediately without inserting an approval row

### Requirement: Approval resolution

Pending `agent_approval_requests` rows SHALL be resolvable via `POST /api/admin/agents/approvals/:approvalId/approve` and `.../reject`. On approval the paused run resumes and the syscall handler is invoked. On rejection the syscall promise rejects with `AgentApprovalRejected` and the run continues (the agent decides whether to fail or recover).

#### Scenario: Admin approves

- **WHEN** an admin calls `POST /api/admin/agents/approvals/abc/approve`
- **THEN** the kernel SHALL update the row to `status='approved'`, record `resolved_by` and `resolved_at`, transition the run to `running`, and invoke the originally-blocked syscall handler

#### Scenario: Admin rejects

- **WHEN** an admin calls `POST /api/admin/agents/approvals/abc/reject`
- **THEN** the kernel SHALL update the row to `status='rejected'` and the awaited syscall promise SHALL reject with `AgentApprovalRejected`

### Requirement: Approval expiry

Approval requests SHALL have a TTL — `approvalTtlSeconds` from the agent definition, defaulting to `86400` (24h). A daily cron sweep (`0 3 * * *`) SHALL expire pending requests past their TTL by setting `status='expired'`; the awaited syscall SHALL reject with `AgentApprovalExpired` and the run SHALL transition to `failed` with `error_json.reason='approval_expired'`.

#### Scenario: Approval expires after 24h

- **WHEN** an approval request is created with the default 24h TTL and remains `pending` 25 hours later when the daily cron runs
- **THEN** the cron SHALL set `status='expired'`, the run SHALL transition to `failed`, and the run's `error_json` SHALL contain `{reason: 'approval_expired', approvalId}`

#### Scenario: Per-agent TTL override

- **WHEN** an agent declares `approvalTtlSeconds: 3600` (1h)
- **THEN** approvals for that agent's runs SHALL expire after 1 hour instead of 24

### Requirement: Reserved system user id

The string `'system'` is a reserved user id used by non-user-driven runs (cron, queue). The admin authentication layer SHALL reject any attempt to authenticate as `'system'`. Memory written under `user_id='system'` SHALL be readable only by agents that explicitly include `'system'` in their `memoryScopes` user dimension.

#### Scenario: Login attempt as system rejected

- **WHEN** any auth flow receives a credential identifying the user as `'system'`
- **THEN** the auth layer SHALL respond with HTTP 403 and SHALL NOT issue a session
