## ADDED Requirements

### Requirement: Flow compilation

The runtime SHALL expose `compile(flow: Flow): ExecutionGraph` that lowers a parsed flow definition into an executable graph of kernel agent invocations. Compilation SHALL fail with `FlowCompileError` when any of the following hold: an `agent` step references an `agent_id` not present in the kernel `agent_processes` registry; a `tool_group` step references an unknown provider; or a downstream step reads a state key whose upstream producer declares an incompatible TypeScript output type.

#### Scenario: Unknown agent id fails compile

- **WHEN** a flow declares an `agent` step with `agent_id: 'nonexistent'` and the kernel registry has no such agent
- **THEN** `compile(flow)` SHALL throw `FlowCompileError` whose message references both the step `id` and the missing `agent_id`

#### Scenario: Type mismatch fails compile

- **WHEN** step `plan` declares `outputs.plan_doc: string` and downstream step `search` reads `state.plan_doc` as `number`
- **THEN** `compile(flow)` SHALL throw `FlowCompileError` referencing both step ids and the offending state key

#### Scenario: Successful compile returns graph

- **WHEN** `compile(flow)` is invoked with a flow whose every reference resolves
- **THEN** the call SHALL return an `ExecutionGraph` with one node per step and one directed edge per `FlowEdge`

### Requirement: Per-run state object

Each flow run SHALL own a `flow_run_state` D1 row holding a JSON state object scoped to that run. Steps SHALL read state via `state.<key>` and write state via declared `outputs`; writes MUST be merged into the persisted state row at each step boundary. The state object SHALL live in the per-run scratch scope of `agent-os` memory and SHALL NOT leak across runs.

#### Scenario: Step output persisted into state

- **WHEN** step `plan` declares `outputs: { plan_doc: string }` and the agent returns `{ plan_doc: 'P' }`
- **THEN** after the step completes the `flow_run_state.state_json.plan_doc` SHALL equal `'P'` and downstream reads of `state.plan_doc` SHALL return `'P'`

#### Scenario: State isolated per run

- **WHEN** two flow runs of the same flow execute concurrently
- **THEN** each run SHALL read and write its own `flow_run_state` row and SHALL NOT observe the other run's writes

### Requirement: Edge condition evaluation

After each step completes, the runtime SHALL evaluate the `condition` of every outgoing edge as a JSON Logic expression against the current `flow_run_state.state_json`. The runtime SHALL traverse edges in declaration order and SHALL dispatch the first edge whose condition evaluates truthy (or is absent). If no outgoing edge matches, the runtime SHALL mark the current branch as terminal and continue evaluating any other still-active branches.

#### Scenario: Condition selects branch

- **WHEN** step `verify` completes with `state.coverage = 0.4`, edge `verify → search` has condition `{ "<": [ {"var":"coverage"}, 0.7 ] }`, and edge `verify → write` has no condition
- **THEN** the runtime SHALL dispatch `search` and SHALL NOT dispatch `write` on this transition

#### Scenario: No matching edge ends branch

- **WHEN** step `s` completes with state that satisfies none of its outgoing edge conditions
- **THEN** the runtime SHALL log an `edge_no_match` lifecycle event and SHALL NOT fail the flow if other branches remain active

### Requirement: Parallel step

A `parallel` step SHALL declare `branches: Branch[]` and `merge_strategy: 'concat' | 'shallow_merge' | 'reject_conflicts'`. The runtime SHALL execute every branch concurrently via kernel sub-runs awaited with `Promise.all`. Branch outputs SHALL be merged into state according to the declared strategy; the `reject_conflicts` strategy SHALL throw `FlowParallelConflictError` on overlapping state keys.

#### Scenario: All branches awaited

- **WHEN** a `parallel` step declares three branches
- **THEN** the runtime SHALL dispatch all three as kernel sub-runs and SHALL NOT transition to the next step until every branch has reached a terminal status

#### Scenario: reject_conflicts throws on overlap

- **WHEN** two branches both write `state.summary` and the step declares `merge_strategy: 'reject_conflicts'`
- **THEN** the runtime SHALL throw `FlowParallelConflictError` referencing the conflicting key and the run SHALL transition to `failed`

### Requirement: Loop step

A `loop` step SHALL iterate either over an array referenced by `over: string` (a state path) or while `condition: JsonLogic` evaluates truthy. Per-iteration writes SHALL execute against an isolated child state scope; on iteration end the runtime SHALL merge the child scope back into parent state. The runtime SHALL enforce the `max_iterations` hard cap declared on the step and SHALL throw `FlowLoopExceededError` if the cap is reached without natural termination.

#### Scenario: Loop respects max_iterations cap

- **WHEN** a `loop` step declares `max_iterations: 3` and `condition: { "==": [1, 1] }`
- **THEN** the runtime SHALL execute exactly three iterations and then throw `FlowLoopExceededError`, transitioning the flow to `failed`

#### Scenario: Loop terminates naturally

- **WHEN** a `loop` step declares `over: 'state.items'` and `state.items.length === 2`
- **THEN** the runtime SHALL execute exactly two iterations and then proceed along the loop's outgoing edges

### Requirement: Step-level retry

Each step MAY declare `retry: { max: number, backoff: 'fixed' | 'exponential', delay_ms: number }` and `on_failure: 'fail' | 'skip'` (default `'fail'`). The runtime SHALL retry a failing step up to `max` times honoring the declared backoff; if all retries are exhausted, the runtime SHALL either skip the step and continue along its outgoing edges (`on_failure: 'skip'`) or transition the flow to `failed` (`on_failure: 'fail'`).

#### Scenario: Retry exhaustion fails flow

- **WHEN** a step declares `retry: { max: 2, backoff: 'fixed', delay_ms: 100 }`, `on_failure` is unset, and the step throws on every attempt
- **THEN** the runtime SHALL invoke the step three times in total (initial + 2 retries) and then transition the flow run to `failed`

#### Scenario: Skip on failure continues flow

- **WHEN** the same step declares `on_failure: 'skip'`
- **THEN** after retries are exhausted the runtime SHALL log a `step_skipped` event and SHALL proceed to the step's outgoing edges with state unchanged

### Requirement: Sub-flow execution

A `sub_flow` step SHALL declare `flow_id`, `flow_version`, `inputs_map: Record<string,string>`, and `outputs_map: Record<string,string>`. The runtime SHALL open a new flow run for the referenced sub-flow, project parent state into sub-flow inputs via `inputs_map`, await terminal status, and project sub-flow outputs back into parent state via `outputs_map`. The child run SHALL record `parent_flow_run_id`. The runtime SHALL enforce a maximum sub-flow nesting depth of 5 (default) and SHALL throw `FlowSubFlowDepthExceeded` on overflow.

#### Scenario: Inputs and outputs mapped

- **WHEN** a `sub_flow` step declares `inputs_map: { topic: 'state.topic' }` and `outputs_map: { report: 'state.subreport' }` and the sub-flow returns `{ report: 'R' }`
- **THEN** the sub-flow SHALL receive `{ topic: state.topic }` as its input and after completion the parent `state.subreport` SHALL equal `'R'`

#### Scenario: Depth limit enforced

- **WHEN** a sub-flow chain reaches nesting depth 6
- **THEN** the runtime SHALL throw `FlowSubFlowDepthExceeded` and the deepest flow run SHALL transition to `failed`

### Requirement: Durable execution gating

Flows whose definition declares `durable: true` SHALL execute via the Cloudflare Workflows binding when `AGENT_FLOW_DURABLE_EXECUTION=true`; otherwise the runtime SHALL execute the flow inline in the Worker. The choice SHALL be made by the runtime and SHALL be recorded on `flow_runs.executor: 'inline' | 'workflows'`.

#### Scenario: Durable flag enables Workflows path

- **WHEN** a flow declares `durable: true` and `AGENT_FLOW_DURABLE_EXECUTION=true`
- **THEN** the runtime SHALL dispatch the run via the Cloudflare Workflows binding and SHALL set `flow_runs.executor = 'workflows'`

#### Scenario: Durable flag inert when env flag off

- **WHEN** a flow declares `durable: true` and `AGENT_FLOW_DURABLE_EXECUTION=false`
- **THEN** the runtime SHALL execute the run inline and SHALL set `flow_runs.executor = 'inline'`

### Requirement: Lifecycle persistence

Every flow run SHALL be represented by a row in `flow_runs` whose `status` follows the state machine `pending → running → done | failed | cancelled`. Every step start and finish SHALL append a row to `flow_step_runs` capturing `step_id`, `started_at`, `ended_at`, `status`, and `error_json?`. The runtime SHALL write these rows transactionally with state mutations so that crash-replay does not lose step boundaries.

#### Scenario: Step boundary persisted

- **WHEN** a step transitions from `running` to `done`
- **THEN** the runtime SHALL write `flow_step_runs` with `status='done'` and a non-null `ended_at`, and the surrounding state mutation SHALL be committed in the same transaction

#### Scenario: Run lifecycle reaches done

- **WHEN** every step has reached a terminal status and no branches remain active
- **THEN** the runtime SHALL transition `flow_runs.status` from `running` to `done` and SHALL emit a `flow_run_completed` lifecycle event

### Requirement: Cancellation propagation

The runtime SHALL accept cancellation via `POST /api/admin/flows/runs/:flowRunId/cancel`. On receipt the runtime SHALL set `flow_runs.cancel_signal=1` and SHALL forward cancellation to every in-flight kernel sub-run via the `agent-scheduler` cooperative cancellation contract. After all kernel sub-runs reach a terminal status the flow run SHALL transition to `cancelled`.

#### Scenario: Cancel propagates to kernel sub-runs

- **WHEN** a cancel request arrives while a `parallel` step has three branches in `running`
- **THEN** the runtime SHALL set `cancel_signal=1` on each child `agent_runs` row and the next syscall in each sub-run SHALL throw `AgentCancelled`

#### Scenario: Cancel on terminal run rejected

- **WHEN** a cancel request arrives for a flow run already in `done`, `failed`, or `cancelled`
- **THEN** the runtime SHALL reject with HTTP 409 and SHALL NOT modify the run or any sub-run state
