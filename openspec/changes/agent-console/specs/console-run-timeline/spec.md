## ADDED Requirements

### Requirement: SSE-streamed run timeline page

The console SHALL serve `/admin/console/runs/[id]` as the run timeline view. The page SHALL open an EventSource connection to `/api/admin/console/runs/{id}/events` and SHALL render a chronologically ordered list of timeline entries, one per kernel event (`step_started`, `step_completed`, `syscall`, `provider_call`, `cost_increment`, `failed`, `cancelled`, `paused`). Each entry MUST display the event timestamp, kind, step id, and any associated cost delta.

#### Scenario: Timeline streams events in real time

- **WHEN** an admin opens `/admin/console/runs/R1` and the kernel emits a `step_started` event for `step_id='search'`
- **THEN** the browser SHALL receive the SSE message within 1 second and SHALL append a new timeline entry showing `kind=step_started`, `step_id=search`, and the event timestamp

### Requirement: Inline cancel action

The timeline page SHALL render a "Cancel" button when the run `status` is `running` or `paused`. Clicking the button SHALL POST to `/api/admin/agents/runs/{id}/cancel` and on HTTP 200 SHALL update the local view to show `status='cancelled'`. The button MUST be hidden for runs in terminal states (`done`, `failed`, `cancelled`).

#### Scenario: Cancel transitions running run

- **WHEN** an admin clicks "Cancel" for a `running` run and the API returns HTTP 200
- **THEN** the page SHALL hide the Cancel button and SHALL render a `cancelled` status badge without requiring a full page reload

### Requirement: Retry-step action

For any failed step row in the timeline, the page SHALL render a "Retry step" button. Clicking the button SHALL POST to `/api/admin/console/runs/{id}/steps/{step_id}/retry` and SHALL trigger a re-execution of that single step without rerunning prior steps. The retry attempt SHALL appear as a new timeline entry with a `retry_attempt` counter.

#### Scenario: Single-step retry appends new attempt

- **WHEN** step `search` failed and an admin clicks its "Retry step" button
- **THEN** the API SHALL be called and a new timeline entry with `step_id='search'`, `retry_attempt=2`, `kind='step_started'` SHALL be rendered without re-executing any other steps

### Requirement: Inline approval action

When a run is `paused` on a `human_approval` step, the timeline SHALL render an approval panel with "Approve" and "Reject" buttons plus an optional comment field. Clicking either button SHALL POST to `/api/admin/agents/approvals/{request_id}` with the chosen decision. On success the run SHALL resume and the panel SHALL be replaced with a decision audit entry.

#### Scenario: Approve resumes paused run

- **WHEN** an admin clicks "Approve" on a paused approval gate and the API returns HTTP 200
- **THEN** the timeline SHALL render a `decision: approved` audit entry, the run badge SHALL transition from `paused` to `running`, and subsequent step events SHALL stream in

### Requirement: SSE auto-reconnect

The EventSource client SHALL automatically reconnect on transport drop using exponential backoff starting at 1 second and capped at 30 seconds, retrying for up to 5 minutes before surfacing a "disconnected" banner. On reconnect, the client MUST send a `Last-Event-ID` header so the server can replay missed events from the `agent_run_events` table.

#### Scenario: Dropped connection recovers without losing events

- **WHEN** the SSE connection drops after event id `42` is received and reconnects 3 seconds later
- **THEN** the client SHALL send `Last-Event-ID: 42` and the server SHALL replay every `agent_run_events` row with `id > 42`, after which the live stream SHALL resume

### Requirement: Step expand with syscall and memory detail

Each step entry SHALL be expandable. When expanded the row SHALL display the underlying syscall list (joined from `agent_tool_calls` filtered by `step_id`) and any memory read/write operations associated with the step, each with its `tool_call_id`, latency, and provider id. Failed runs SHALL additionally render the `error_json.message` and `error_json.stack` in the expansion.

#### Scenario: Expand surfaces syscalls and failure detail

- **WHEN** an admin expands a failed `search` step whose underlying syscall threw `TimeoutError`
- **THEN** the expanded panel SHALL list every `agent_tool_calls` row for `step_id='search'` with its `provider_id` and `latency_ms`, and SHALL render `error_json.message='TimeoutError'` plus the captured `error_json.stack`
