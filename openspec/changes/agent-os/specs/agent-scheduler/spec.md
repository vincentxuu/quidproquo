## ADDED Requirements

### Requirement: Agent registration

The kernel SHALL accept agent definitions declared via `defineAgent({...})` and SHALL maintain a process registry of all registered agents, keyed by `agent_id`. Registration is idempotent within a single deploy; the registry is rebuilt on every Worker boot from the code-declared definitions.

#### Scenario: Successful registration

- **WHEN** a module exports an agent via `defineAgent({ id: 'research', version: 2, ... })` and the kernel boots
- **THEN** the registry SHALL contain `research` with version `2` and the kernel SHALL upsert a row into `agent_processes` with the current `tool_call_limit`, `timeout_seconds`, `schedule`, and `updated_at = now()`

#### Scenario: Duplicate id rejected

- **WHEN** two modules attempt to register the same `agent_id`
- **THEN** the kernel SHALL throw `AgentRegistrationError` at boot and refuse to start the Worker

### Requirement: Run lifecycle state machine

Every agent invocation SHALL be represented by a row in `agent_runs` whose `status` follows the state machine `pending → running → (paused → running)* → done | failed | cancelled`. Transitions are kernel-managed; agent code MUST NOT write `status` directly.

#### Scenario: Successful manual run

- **WHEN** an admin invokes `POST /api/admin/agents/research/run` with a valid input
- **THEN** the kernel SHALL insert a row with `status='pending'`, transition to `running` on dispatch, and transition to `done` after `run()` resolves successfully

#### Scenario: Run failure

- **WHEN** an agent's `run()` throws an unhandled error
- **THEN** the kernel SHALL transition the run to `failed`, write `error_json = { message, stack }`, and emit an `agent_run_events` row with `kind='failed'`

#### Scenario: Pause and resume on approval

- **WHEN** a syscall requires approval and a pending `agent_approval_requests` row is created
- **THEN** the kernel SHALL transition the run to `paused`; when the approval row's `status` becomes `approved`, the kernel SHALL resume the run by transitioning to `running` and resolving the awaited syscall

### Requirement: Three trigger surfaces

The scheduler SHALL accept agent runs from exactly three trigger sources, each producing a row in `agent_runs` with the corresponding `trigger` value: `manual` (HTTP API), `cron` (Cloudflare Cron Triggers), `queue` (Cloudflare Queues consumer). Agent-spawned sub-runs use `trigger='sub-agent'` and SHALL record `parent_run_id`.

#### Scenario: Cron-triggered run

- **WHEN** the Cloudflare cron handler fires and the current time matches an agent's `schedule`
- **THEN** the kernel SHALL insert a run with `trigger='cron'` and `scope.userId = 'system'`

#### Scenario: Queue-triggered run

- **WHEN** a message arrives on the `AGENT_QUEUE` binding and `AGENT_OS_SCHEDULER_QUEUES=true`
- **THEN** the kernel SHALL insert a run with `trigger='queue'` and pass the message body as `input_json`

#### Scenario: Queues disabled by flag

- **WHEN** a queue message arrives and `AGENT_OS_SCHEDULER_QUEUES=false`
- **THEN** the kernel SHALL not consume the message and SHALL log a `denied: queues disabled` event without inserting any run

### Requirement: Per-agent timeout enforcement

The scheduler SHALL kill a run that exceeds `agent_processes.timeout_seconds`, transitioning it to `failed` with `error_json.reason='timeout'`.

#### Scenario: Run exceeds timeout

- **WHEN** an agent's `run()` is still pending after `timeout_seconds`
- **THEN** the kernel SHALL set `cancel_signal=1`, transition status to `failed` after the AbortSignal fires, and write `error_json.reason='timeout'`

### Requirement: Cooperative cancellation

The kernel SHALL provide an `AbortSignal` to each agent via `SyscallContext.signal`, backed by `agent_runs.cancel_signal` mirrored to KV key `agent:cancel:{runId}` with 10-minute TTL. Cancellation SHALL fire on the next syscall boundary after the flag is set.

#### Scenario: Cancel request from admin

- **WHEN** an admin calls `POST /api/admin/agents/runs/:runId/cancel`
- **THEN** the kernel SHALL write `cancel_signal=1` to D1 and the KV key, and the next syscall in the running agent SHALL throw `AgentCancelled` causing the run to transition to `cancelled`

#### Scenario: Cancellation on terminal status

- **WHEN** a cancel request arrives for a run already in `done`, `failed`, or `cancelled`
- **THEN** the kernel SHALL reject the request with HTTP 409 and SHALL NOT modify any state

### Requirement: Per-agent concurrency cap

The scheduler SHALL track the number of `running` + `paused` runs per `agent_id` and SHALL reject new dispatches that would exceed `agent_processes.max_concurrent` (default 1).

#### Scenario: Concurrency cap reached

- **WHEN** an agent has `max_concurrent=1` and one run is already `running`
- **THEN** a new manual invocation SHALL return HTTP 429 with body `{error: 'concurrency_exceeded'}` and SHALL NOT insert a run row
