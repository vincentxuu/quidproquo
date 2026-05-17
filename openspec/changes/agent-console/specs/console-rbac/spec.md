## ADDED Requirements

### Requirement: Users, roles, and permissions persisted in D1

The console SHALL persist RBAC state in three D1 tables: `console_users` (`id`, `email`, `display_name`, `created_at`, `disabled_at?`), `console_roles` (`id`, `name`, `description`, `created_at`), and `console_role_assignments` (`user_id`, `role_id`, `assigned_at`, `assigned_by`). All foreign keys SHALL be enforced and disabled users SHALL be filtered out of any permission check.

#### Scenario: Disabled user has no effective roles

- **WHEN** a user `U1` has `console_role_assignments` for role `editor` and is then assigned `disabled_at` non-null
- **THEN** any permission check for `U1` SHALL behave as if no roles are assigned and SHALL deny actions that require `editor`

### Requirement: Per-flow, per-policy, and per-provider permissions

The runtime SHALL define permission scopes `flow:{flowId}:{action}`, `policy:{policyId}:{action}`, and `provider:{providerId}:{action}` where `action ∈ { 'view', 'edit', 'run', 'approve', 'export' }`. Permissions SHALL be assigned to roles via a `console_role_permissions` table keyed by `(role_id, scope)`. Permission checks MUST be performed server-side before any state-changing API responds.

#### Scenario: Per-flow run permission denies cross-flow launch

- **WHEN** a user holds role `analyst` granting `flow:research:run` only, and attempts to launch flow `monitoring`
- **THEN** the launch API SHALL respond with HTTP 403 `{ error: 'permission_denied', scope: 'flow:monitoring:run' }` and SHALL NOT insert a `flow_runs` row

### Requirement: Role assignment UI

The console SHALL serve `/admin/console/rbac` rendering a user list with role chips, a role editor allowing per-role permission scope assignment, and an "Assign role" action on each user row. All mutations SHALL POST to `/api/admin/console/rbac/*` endpoints and SHALL be reflected in the live view on success.

#### Scenario: Assign role updates user row

- **WHEN** an admin opens `/admin/console/rbac`, clicks "Assign role" on user `U1`, and selects `editor`
- **THEN** the API SHALL insert a `console_role_assignments` row for `(U1, editor)` and the user row SHALL render an `editor` chip without a page reload

### Requirement: Audit log of who-did-what

Every RBAC change and every permission-gated action (run launch, approval, export, policy bind, role assignment) SHALL be recorded in a `console_audit_log` table with columns `id` (ULID), `actor_user_id`, `action`, `target_kind`, `target_id`, `payload_json`, `at`. The console SHALL render this log at `/admin/console/rbac/audit`, filterable by actor, action, and date range.

#### Scenario: Action writes audit row

- **WHEN** user `U1` approves artifact `A1`
- **THEN** the kernel SHALL insert a `console_audit_log` row with `actor_user_id='U1'`, `action='artifact.approve'`, `target_kind='artifact'`, `target_id='A1'`, and a non-null `at` timestamp

### Requirement: Integration with existing admin auth

The RBAC layer SHALL extend the existing `requireAdmin` middleware rather than replacing it. Requests that fail the existing admin auth SHALL continue to return HTTP 401 unchanged; requests that pass admin auth but lack a console permission SHALL return HTTP 403 with the missing scope name. Pre-RBAC admin endpoints SHALL continue to function for users assigned the seeded `superadmin` role, which carries the wildcard scope `*`.

#### Scenario: Existing admin auth still gates the door

- **WHEN** a request arrives without a valid admin session and targets a console RBAC endpoint
- **THEN** the response SHALL be HTTP 401 from the existing `requireAdmin` middleware and SHALL NOT reach the permission check

#### Scenario: Superadmin retains legacy access

- **WHEN** a user assigned the seeded `superadmin` role calls any console API
- **THEN** the permission check SHALL match the wildcard `*` scope and SHALL allow the action regardless of finer-grained scopes
