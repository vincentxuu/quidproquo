## ADDED Requirements

### Requirement: Live budget enforcement on cost ceiling

The kernel scheduler SHALL check `agent_runs.total_cost_usd` against `EffectivePolicy.budget.max_cost_usd` after every syscall return. When the running total meets or exceeds the ceiling, the scheduler SHALL refuse to dispatch any further syscalls in the run, SHALL transition the owning `flow_runs.status` from `running` to `failed`, and SHALL set `flow_runs.error_json = { reason: 'budget_exceeded', limit: max_cost_usd, observed: total_cost_usd }`. Partial state and partial outputs SHALL be preserved on the failed run.

#### Scenario: Cost cap kills mid-run

- **WHEN** `EffectivePolicy.budget.max_cost_usd=1.00` and the third syscall pushes `agent_runs.total_cost_usd` from `0.90` to `1.05`
- **THEN** the scheduler SHALL NOT dispatch a fourth syscall, the `flow_runs.status` SHALL transition to `failed`, and `flow_runs.error_json.reason` SHALL equal `'budget_exceeded'`

#### Scenario: Partial output preserved on budget kill

- **WHEN** a budget-killed run had produced two completed step outputs before the kill
- **THEN** those two `flow_run_state.state_json` entries SHALL remain readable post-failure and SHALL NOT be rolled back

### Requirement: Token, iteration, parallelism, and runtime ceilings

The scheduler SHALL apply the same live-check pattern to the remaining budget fields: `max_tokens` against accumulated token usage on `agent_runs`; `max_iterations` against per-loop-step iteration counters; `max_parallel_units` against active sub-run counts within any `parallel` step; `max_runtime_seconds` against `now() - flow_runs.started_at`. Ceiling violation SHALL fail the run with `error_json.reason` set to one of `'token_limit_exceeded'`, `'iteration_limit_exceeded'`, `'parallelism_limit_exceeded'`, or `'runtime_limit_exceeded'` respectively.

#### Scenario: Iteration cap stops a loop step

- **WHEN** `EffectivePolicy.budget.max_iterations=5` and a `loop` step has already executed 5 iterations
- **THEN** the scheduler SHALL refuse to start iteration 6, the run SHALL fail, and `error_json.reason` SHALL equal `'iteration_limit_exceeded'`

#### Scenario: Runtime cap fails long-running flow

- **WHEN** `EffectivePolicy.budget.max_runtime_seconds=300` and the flow run has been running for 301 seconds at the next syscall return
- **THEN** the scheduler SHALL fail the run with `error_json.reason='runtime_limit_exceeded'`

### Requirement: Provider allowlist and denylist enforcement

At every `llm.*`, `search.*`, or other provider-routed syscall, the kernel SHALL pass `EffectivePolicy.provider.allowlist` and `EffectivePolicy.provider.denylist` to the `agent-providers` router. The router SHALL refuse any provider not in the allowlist (when set) or present in the denylist by throwing `ProviderNotAllowed`. The kernel SHALL surface that error to the calling agent as a typed `PolicyProviderDenied` error and SHALL emit a `policy_violations` row with `severity='fail'` and `rule='provider_allowlist'`.

#### Scenario: Non-allowlisted provider denied

- **WHEN** `EffectivePolicy.provider.allowlist=['openai']` and the router would otherwise route a `search.query` to `tavily`
- **THEN** the router SHALL throw `ProviderNotAllowed`, the kernel SHALL re-raise as `PolicyProviderDenied`, and a `policy_violations` row SHALL be written with `rule='provider_allowlist'`

#### Scenario: Denylist takes precedence over allowlist

- **WHEN** `provider.allowlist=['openai','gemini']` and `provider.denylist=['gemini']` and routing would select `gemini`
- **THEN** the router SHALL throw `ProviderNotAllowed` and SHALL NOT invoke `gemini`

### Requirement: Provider fallback chain honored per category

When `EffectivePolicy.provider.fallback_chains` declares an explicit ordered chain for a category (e.g. `search: ['exa', 'tavily', 'jina']`), the kernel SHALL pass that chain to the router as the per-call `order` and the router SHALL honor it in place of its default routing config for the duration of the syscall. Unspecified categories SHALL fall back to the router's default `routing.config.ts`.

#### Scenario: Policy chain overrides default config

- **WHEN** the router default declares `search.order=['tavily','exa','jina']` and `EffectivePolicy.provider.fallback_chains.search=['exa','tavily']`
- **THEN** the router SHALL attempt `exa` first then `tavily`, and SHALL NOT attempt `jina`

#### Scenario: Unspecified category uses default chain

- **WHEN** `EffectivePolicy.provider.fallback_chains` is `{ search: ['exa'] }` and the agent calls `llm.complete`
- **THEN** the router SHALL use its default `llm.order` from `routing.config.ts` for the `llm.complete` call

### Requirement: Quality-policy enforcement via verifyFlowRun

When a flow run reaches terminal status `done` with a non-empty `EffectivePolicy.quality` block, the kernel SHALL invoke `verifyFlowRun({ flow_run_id, policy: effective.quality })` (the `agent-evidence` boundary). On `pass=false`, the kernel SHALL transition the run from `done` to `failed` and SHALL set `flow_runs.error_json = { reason: 'quality_policy_violation', violations: [...] }`. The kernel SHALL NOT bypass `verifyFlowRun` by inspecting evidence tables directly.

#### Scenario: Quality verification fails the run

- **WHEN** a flow reaches `done`, `EffectivePolicy.quality.min_sources=3`, and `verifyFlowRun` returns `{ pass: false, violations: [{rule:'min_sources', ...}] }`
- **THEN** the kernel SHALL transition the run to `failed`, set `error_json.reason='quality_policy_violation'`, and include the violation in `error_json.violations`

#### Scenario: Empty quality block skips verification

- **WHEN** `EffectivePolicy.quality` is undefined or empty
- **THEN** the kernel SHALL NOT invoke `verifyFlowRun` and the run SHALL remain in `done`

### Requirement: Sensitive-data redaction on syscall outputs

When `EffectivePolicy.security.sensitive_patterns` is non-empty, the kernel SHALL scan every syscall output (string and stringified object form) against the configured regex set before persisting to `agent_run_events`, `flow_run_state`, or any other store. Every match SHALL be replaced with the literal `[REDACTED]`. Each redaction event SHALL append a row to `policy_violations` with `severity='warn'`, `rule='sensitive_redaction'`, and `details_json.pattern_id` set; the run SHALL continue running.

#### Scenario: Email pattern redacted in step output

- **WHEN** `security.sensitive_patterns` includes a regex matching email addresses and a step output contains `"contact alice@example.com for details"`
- **THEN** the persisted output SHALL contain `"contact [REDACTED] for details"`, the original SHALL NOT be stored anywhere, and a `policy_violations` row SHALL exist with `rule='sensitive_redaction'`

#### Scenario: Empty pattern list skips scan

- **WHEN** `EffectivePolicy.security.sensitive_patterns` is undefined or empty
- **THEN** the kernel SHALL persist syscall outputs verbatim and SHALL NOT write any `sensitive_redaction` violation rows

### Requirement: Tool allowlist intersection

The effective set of tools available to an agent during a flow run SHALL be the set intersection of (a) the agent's declared `syscalls` grants from `agent-access` and (b) `EffectivePolicy.security.tool_allowlist` (when set). The smaller set SHALL win. Calls to a tool outside the intersection SHALL throw `PolicyToolDenied`, write a `policy_violations` row with `rule='tool_allowlist'` and `severity='fail'`, and SHALL NOT invoke the handler.

#### Scenario: Tool granted to agent but not in policy

- **WHEN** the agent's grants include `['memory.read','search.external']` and `EffectivePolicy.security.tool_allowlist=['memory.read']` and the agent calls `syscall('search.external', ...)`
- **THEN** the kernel SHALL throw `PolicyToolDenied`, SHALL NOT invoke the handler, and a `policy_violations` row SHALL exist with `rule='tool_allowlist'`

#### Scenario: Tool in policy but not in agent grants

- **WHEN** `policy.security.tool_allowlist=['memory.read','search.external']` and the agent's grants omit `'search.external'` and the agent calls `syscall('search.external', ...)`
- **THEN** the kernel SHALL throw `AgentAccessDenied` (per `agent-access` semantics) and SHALL NOT invoke the handler

### Requirement: Per-step retry budget as overlay on flow-runtime retry

`EffectivePolicy.retry` SHALL act as an overlay on per-step `retry` declarations in `flow-runtime`. When both exist, the step's declared `retry.max` SHALL be capped at `EffectivePolicy.retry.max`; when only the policy declares a retry budget, it SHALL apply to every step that does not explicitly set its own `retry`. On exhaustion the runtime SHALL behave according to `EffectivePolicy.retry.on_exhaustion`: `'skip'` SHALL continue along the step's outgoing edges (`step_skipped` event), `'fail'` SHALL transition the flow run to `failed`.

#### Scenario: Policy retry cap shrinks step retry

- **WHEN** a step declares `retry.max=10` and `EffectivePolicy.retry.max=3`
- **THEN** the runtime SHALL invoke the step at most 4 times (initial + 3 retries) and SHALL apply `on_exhaustion` afterwards

#### Scenario: Retry exhausted with skip semantics

- **WHEN** `EffectivePolicy.retry.on_exhaustion='skip'`, no step-level retry override is set, and the step throws on every attempt up to `retry.max`
- **THEN** the runtime SHALL emit a `step_skipped` event, SHALL proceed along the step's outgoing edges, and SHALL NOT transition the flow to `failed`

### Requirement: policy_violations audit table

Every enforcement decision that denies, redacts, or fails on policy grounds SHALL append a row to `policy_violations { id (ULID), flow_run_id, agent_run_id?, rule, severity ('warn'|'fail'), details_json, at }`. Rows SHALL be written before any user-visible error is raised so that crash mid-enforcement leaves either zero or one audit record per decision. The kernel SHALL NOT silently drop violation logging on persistence errors; it SHALL surface them via `agent_run_events` with `kind='policy_audit_failure'`.

#### Scenario: Every denial row persisted before error raised

- **WHEN** the kernel raises `PolicyProviderDenied` for a non-allowlisted provider call
- **THEN** the `policy_violations` row for that decision SHALL exist in D1 before the error reaches the calling agent

#### Scenario: Persistence failure surfaced not swallowed

- **WHEN** writing a `policy_violations` row throws (e.g. D1 transient error)
- **THEN** the kernel SHALL emit an `agent_run_events` row with `kind='policy_audit_failure'` carrying the original violation details and SHALL still raise the user-visible policy error
