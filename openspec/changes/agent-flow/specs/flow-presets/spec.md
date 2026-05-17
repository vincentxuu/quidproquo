## ADDED Requirements

### Requirement: Preset schema

A `FlowPreset` SHALL conform to the shape `{ id: string, name: string, base_flow_id: string, base_version: number, overrides: PresetOverrides }`, where `PresetOverrides` is `{ steps?: Record<string, { params?: object, retry?: RetryPolicy, timeout?: number }>, retry?: RetryPolicy, timeout?: number }`. Presets MUST NOT declare added or removed `steps` or `edges`; only declared step ids in the base flow MAY appear under `overrides.steps`. Unknown step ids SHALL be rejected at save time with `PresetUnknownStepError`.

#### Scenario: Valid preset accepted

- **WHEN** a preset declares `overrides.steps.plan.retry = { max: 3, backoff: 'exponential', delay_ms: 500 }` and `plan` is a declared step id in `base_flow_id` at `base_version`
- **THEN** the runtime SHALL persist the preset and `flow_presets` SHALL contain a row with the declared override

#### Scenario: Unknown step id rejected

- **WHEN** a preset declares `overrides.steps.ghost.params = {...}` and the base flow has no step with id `ghost`
- **THEN** the runtime SHALL throw `PresetUnknownStepError` referencing the offending step id and the `(base_flow_id, base_version)` pair

### Requirement: Override resolution

At run time, before compilation, the runtime SHALL render the effective flow by deep-merging `preset.overrides` onto the immutable base flow definition. Step-level overrides SHALL merge by `step.id`; top-level `retry` and `timeout` overrides on the preset SHALL replace the base flow's defaults. The resulting effective flow SHALL be passed unchanged to `compile(flow)`; the base flow definition row SHALL NOT be mutated.

#### Scenario: Step retry overridden

- **WHEN** the base flow declares step `search` with `retry: { max: 1 }` and the active preset declares `overrides.steps.search.retry = { max: 5, backoff: 'exponential', delay_ms: 200 }`
- **THEN** the effective flow passed to `compile` SHALL contain `steps.search.retry.max = 5` and the base flow row SHALL remain unchanged

#### Scenario: Agent params overridden

- **WHEN** the base flow declares an `agent` step with `params: { model: 'haiku' }` and the preset declares `overrides.steps.plan.params = { model: 'opus' }`
- **THEN** the kernel sub-run dispatched for step `plan` SHALL receive `model: 'opus'` and SHALL NOT receive `model: 'haiku'`

### Requirement: Preset persistence

Presets SHALL be stored in a `flow_presets` D1 table keyed by `id`, with foreign-key columns `base_flow_id` and `base_version` referencing `flow_versions`. One base flow MAY have many presets. Deleting a `flow_versions` row SHALL be rejected while at least one `flow_presets` row references it, raising `PresetReferenceConstraintError`.

#### Scenario: Multiple presets share base flow

- **WHEN** three presets are created for the same `(base_flow_id, base_version)` pair
- **THEN** `flow_presets` SHALL contain exactly three rows all referencing the same `(base_flow_id, base_version)` pair

#### Scenario: Base version delete blocked by preset

- **WHEN** an admin attempts to delete a `flow_versions` row that is referenced by an existing `flow_presets` row
- **THEN** the runtime SHALL reject with `PresetReferenceConstraintError` and SHALL NOT delete the row

### Requirement: Override boundary

Presets MUST NOT change the base flow's `id`, `version`, `inputs`, `steps[].id`, `steps[].type`, or `edges`. The runtime SHALL validate this boundary at run time before rendering the effective flow and SHALL throw `PresetInvalidOverride` if any forbidden field appears anywhere under `overrides`.

#### Scenario: Adding a step rejected

- **WHEN** a preset's `overrides.steps` includes an entry whose key does not match any base flow `steps[].id` and that entry declares a `type` field
- **THEN** the runtime SHALL throw `PresetInvalidOverride` referencing the attempted step addition

#### Scenario: Removing a step rejected

- **WHEN** a preset includes a sentinel `overrides.steps.<id> = null` intended to remove a base step
- **THEN** the runtime SHALL throw `PresetInvalidOverride` referencing the removal attempt and the run SHALL NOT proceed to compilation

#### Scenario: Changing step type rejected

- **WHEN** a preset declares `overrides.steps.plan = { type: 'tool_group' }` while the base step `plan` has `type: 'agent'`
- **THEN** the runtime SHALL throw `PresetInvalidOverride` referencing `plan.type`

### Requirement: Flow run records preset id

`flow_runs` SHALL declare a nullable column `preset_id` that records which preset was active when the run was dispatched. Runs dispatched without a preset SHALL store `preset_id = NULL` and SHALL execute the base flow's declared defaults. The `preset_id` value SHALL be sufficient to deterministically reproduce the effective flow used at run time (combined with `flow_id` and `flow_version`).

#### Scenario: Run with preset records id

- **WHEN** a flow run is dispatched with active preset `deep_research_enterprise`
- **THEN** the inserted `flow_runs` row SHALL have `preset_id = 'deep_research_enterprise'` alongside the recorded `flow_id` and `flow_version`

#### Scenario: Run without preset stores null

- **WHEN** a flow run is dispatched with no preset
- **THEN** the inserted `flow_runs` row SHALL have `preset_id = NULL` and the runtime SHALL use the base flow's declared defaults during compilation
