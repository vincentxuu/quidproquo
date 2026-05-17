## ADDED Requirements

### Requirement: Per-run context window state

The kernel SHALL maintain a per-run context object that holds the message history, step state, and intermediate outputs for the duration of a single run. Context state lives in the running Worker's memory; the durable record is the `agent_run_events` event log, from which context can be reconstructed.

#### Scenario: Fresh context per run

- **WHEN** the kernel dispatches a new run
- **THEN** it SHALL create a new context object with empty `messages`, empty `stepOutputs`, and the run's `input_json` placed at `context.input`

#### Scenario: Two concurrent runs of the same agent

- **WHEN** the same agent has two `running` runs (allowed by per-agent concurrency settings)
- **THEN** each run SHALL have an isolated context object; reads or writes by one run SHALL NOT be visible to the other

### Requirement: Structured event emission

Every step transition, syscall, memory operation, denial, approval, and lifecycle change SHALL be recorded as an `agent_run_events` row with a typed `kind` discriminator and a `payload_json`. Agent code SHALL NOT write events directly; events are emitted by the kernel and by the `ctx.emit()` helper exposed to agents.

#### Scenario: Step boundary event

- **WHEN** an agent transitions from one named step to the next via `ctx.beginStep('synthesize')`
- **THEN** the kernel SHALL emit an event with `kind='step'`, `step_id='synthesize'`, and `payload_json` containing the previous step's id and its summarized output

#### Scenario: Agent-emitted custom event

- **WHEN** an agent calls `await ctx.emit('progress', { fraction: 0.4 })`
- **THEN** the kernel SHALL write an `agent_run_events` row with `kind='progress'`, `payload_json={fraction:0.4}`, and the current `step_id`

### Requirement: Context pruning when window fills

The context manager SHALL track an approximate token count for `context.messages` and SHALL prune older messages when the count exceeds the per-agent `context_window_tokens` threshold, replacing them with a summary message. Pruning emits an event with `kind='context_pruned'`.

#### Scenario: Window exceeds threshold

- **WHEN** an agent's `context.messages` token count exceeds the configured `context_window_tokens`
- **THEN** the kernel SHALL keep the system prompt and the most recent N messages, summarize the rest into one message, and emit a `context_pruned` event recording the dropped message count and the resulting summary length

#### Scenario: Custom pruner

- **WHEN** an agent declares `contextPruner: customPruner` in its definition
- **THEN** the kernel SHALL invoke `customPruner` instead of the default summarization strategy when the threshold is exceeded

### Requirement: Handoff between steps

The context manager SHALL provide a typed handoff mechanism for passing structured state between named steps within a run, separate from the message history. Handoff state persists in memory for the run's duration and is included in the event log for replay.

#### Scenario: Step output consumed by next step

- **WHEN** step `plan` returns `{ subquestions: [...] }` via `ctx.endStep(...)` and step `search` reads `ctx.stepOutputs.plan.subquestions`
- **THEN** the value SHALL be the exact object returned by `plan`, and the kernel SHALL have written both an `endStep` event for `plan` and a `beginStep` event for `search`

### Requirement: Replay reconstruction

Given a `run_id`, the kernel SHALL reconstruct the run's full context (messages, step outputs, events) by replaying `agent_run_events` rows in `event_id` order. Replay SHALL be deterministic for runs that did not interact with external non-deterministic syscalls; non-deterministic outputs SHALL be replayed from their recorded values, not re-fetched.

#### Scenario: Replay a completed run for debugging

- **WHEN** an admin requests `GET /api/admin/agents/runs/:runId/replay`
- **THEN** the kernel SHALL stream the reconstructed context messages and step outputs in event order, marking each entry with its originating `event_id`
