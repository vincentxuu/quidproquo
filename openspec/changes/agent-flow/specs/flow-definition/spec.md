## ADDED Requirements

### Requirement: Flow DSL schema

A flow definition SHALL be expressible as YAML or JSON conforming to a single TypeScript-validated schema. The top-level schema MUST require the fields `id: string`, `version: number`, `name: string`, `inputs: FlowInput[]`, `steps: FlowStep[]`, `edges: FlowEdge[]`, and `artifacts: FlowArtifact[]`, and SHALL accept the optional fields `description?: string`, `retry?: RetryPolicy`, and `timeout?: number`. Definitions missing any required field SHALL be rejected at parse time with a `FlowSchemaError` carrying the missing field name.

#### Scenario: Minimal valid flow parses

- **WHEN** `parseFlow(yaml)` is invoked with a document containing `id`, `version: 1`, `name`, empty `inputs`, one `steps` entry, empty `edges`, and empty `artifacts`
- **THEN** the call SHALL return `{ flow, errors: [] }` and `flow.id` SHALL equal the declared id

#### Scenario: Missing required field rejected

- **WHEN** `parseFlow(yaml)` is invoked with a document that omits `steps`
- **THEN** the call SHALL return `errors` containing a `FlowSchemaError` whose message references the missing `steps` field

### Requirement: Step types

A `FlowStep` SHALL declare a `type` whose value is exactly one of the nine supported step kinds: `agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`, `sub_flow`, `parallel`, `loop`. Any other value SHALL be rejected at parse time with a `FlowUnknownStepTypeError`.

#### Scenario: Each supported type accepted

- **WHEN** a flow declares one step per supported `type` value
- **THEN** the parser SHALL accept all nine steps and the resulting `flow.steps` array SHALL preserve the declared order

#### Scenario: Unknown type rejected

- **WHEN** a flow declares a step with `type: 'webhook'`
- **THEN** the parser SHALL return a `FlowUnknownStepTypeError` referencing the offending step `id` and the literal `'webhook'`

### Requirement: Edge schema with JSON Logic conditions

A `FlowEdge` SHALL declare `from: string`, `to: string`, and an optional `condition?: JsonLogic`. References that do not match a declared `steps[].id` SHALL be rejected at parse time with a `FlowEdgeReferenceError`. When `condition` is present it MUST be a valid JSON Logic expression per design D3; otherwise it SHALL be rejected with `FlowEdgeConditionError`.

#### Scenario: Edge references unknown step

- **WHEN** a flow declares an edge with `from: 'plan'` and `to: 'missing_step'` and no `steps[].id` equals `'missing_step'`
- **THEN** the parser SHALL return a `FlowEdgeReferenceError` identifying both the edge and the unresolved id

#### Scenario: Malformed JSON Logic rejected

- **WHEN** an edge declares `condition: { ">": "not-an-array" }`
- **THEN** the parser SHALL return a `FlowEdgeConditionError` referencing the edge `from`/`to` pair

### Requirement: Typed input schema

Each `FlowInput` SHALL declare `name: string`, `type: 'string' | 'number' | 'boolean' | 'object' | 'array'`, `required: boolean`, and the optional fields `default?: unknown` and `validation?: JSONSchema7`. When a flow run is started, the runtime SHALL reject inputs whose runtime shape does not satisfy the declared `type` or the optional `validation` schema, raising `FlowInputValidationError` before any step executes.

#### Scenario: Run rejected for type mismatch

- **WHEN** a flow declares `inputs: [{ name: 'topic', type: 'string', required: true }]` and the run is started with `{ topic: 42 }`
- **THEN** the runtime SHALL throw `FlowInputValidationError` and SHALL NOT create a `flow_runs` row in `running` state

#### Scenario: Default applied when input omitted

- **WHEN** a flow declares `inputs: [{ name: 'depth', type: 'number', required: false, default: 2 }]` and the run is started without `depth`
- **THEN** the runtime SHALL inject `state.depth = 2` before the first step executes

### Requirement: Flow versioning

Every flow definition SHALL declare an integer `version`. Persistence SHALL append a new row to `flow_versions` for each new `version` of the same `id`; prior versions SHALL remain queryable. New versions are opt-in — existing flow runs SHALL continue to bind to the version recorded on `flow_runs.flow_version` at dispatch time.

#### Scenario: New version creates new row

- **WHEN** an admin saves a flow with `id: 'deep_research'` already at version `1` and the new definition declares `version: 2`
- **THEN** the runtime SHALL insert a new `flow_versions` row with `version = 2` and SHALL NOT modify the existing `version = 1` row

#### Scenario: Existing runs pin to original version

- **WHEN** a flow run was dispatched against `version: 1` and an admin later publishes `version: 2`
- **THEN** the in-flight run SHALL continue to execute the `version: 1` definition recorded on `flow_runs.flow_version`

### Requirement: Loop step bounds

A `loop` step SHALL declare `max_iterations: number` and at least one of `condition: JsonLogic` or `over: string` (a state path referencing an array). A `loop` step missing `max_iterations`, or missing both `condition` and `over`, SHALL be rejected at compile time with a `FlowLoopBoundsError`.

#### Scenario: Loop without max_iterations rejected

- **WHEN** a flow declares `{ type: 'loop', id: 'l', condition: {...} }` with no `max_iterations`
- **THEN** the compiler SHALL throw `FlowLoopBoundsError` referencing step `l`

#### Scenario: Loop without condition and without over rejected

- **WHEN** a flow declares `{ type: 'loop', id: 'l', max_iterations: 5 }` with neither `condition` nor `over`
- **THEN** the compiler SHALL throw `FlowLoopBoundsError` referencing step `l`

### Requirement: Sub-flow DAG enforcement

The transitive `sub_flow` reference graph across all stored flow versions SHALL form a directed acyclic graph (DAG). The parser SHALL traverse `sub_flow` step `flow_id` references and SHALL reject any save that would introduce a cycle, raising `FlowSubFlowCycleError` with the cycle path.

#### Scenario: Direct self-reference rejected

- **WHEN** a flow `A` declares a `sub_flow` step whose `flow_id` is `A`
- **THEN** the save SHALL throw `FlowSubFlowCycleError` with cycle path `['A', 'A']`

#### Scenario: Transitive cycle rejected

- **WHEN** flow `A` calls `B` and a save attempts to make flow `B` call `A`
- **THEN** the save SHALL throw `FlowSubFlowCycleError` with cycle path `['B', 'A', 'B']`

### Requirement: Parse and validate API

`parseFlow(input: string, format?: 'yaml' | 'json'): { flow: Flow | null, errors: ValidationError[] }` SHALL be the single entry point for parsing flow definitions. Each `ValidationError` SHALL carry a human-readable `message`, a `code`, and a source location `{ line, column }` pointing to the offending YAML/JSON token. When `errors.length > 0` the returned `flow` MUST be `null`.

#### Scenario: Error carries source location

- **WHEN** `parseFlow(yaml)` fails because line 12 declares a step with an unknown `type`
- **THEN** the returned error SHALL include `{ line: 12, column: <n> }` referencing the offending node

#### Scenario: Successful parse returns non-null flow

- **WHEN** `parseFlow(yaml)` is invoked with a fully valid document
- **THEN** the result SHALL satisfy `errors.length === 0` and `flow !== null`

### Requirement: Definition persistence

Flow definitions SHALL be persisted in two D1 tables: `flow_definitions` (one row per `id`, holding the latest `version` pointer) and `flow_versions` (one row per `(id, version)` pair, holding the immutable YAML source plus parsed JSON). Publishing a new version SHALL insert a new `flow_versions` row and update the pointer in `flow_definitions`; existing rows MUST NOT be mutated in place.

#### Scenario: Publish writes immutable version row

- **WHEN** an admin publishes flow `deep_research` at `version: 3`
- **THEN** the runtime SHALL insert a new `flow_versions` row with the YAML source and parsed JSON, and SHALL update `flow_definitions.latest_version = 3` for `id = 'deep_research'`

#### Scenario: Re-publishing same version rejected

- **WHEN** an admin attempts to publish flow `deep_research` at `version: 3` and a `flow_versions` row already exists for `(deep_research, 3)`
- **THEN** the runtime SHALL reject with `FlowVersionConflictError` and SHALL NOT modify either table
