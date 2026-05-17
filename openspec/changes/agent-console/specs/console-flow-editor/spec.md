## ADDED Requirements

### Requirement: Visual DAG editor page

The console SHALL serve `/admin/console/flows/[id]/edit` as the visual flow editor. The page SHALL load the latest `flow_versions` row for `id` and SHALL render the parsed flow as a node-edge graph using the flow's `steps` as nodes and `edges` as directed connections (see `agent-flow/flow-definition`).

#### Scenario: Editor renders existing flow as DAG

- **WHEN** an admin opens `/admin/console/flows/deep_research/edit` and the latest version declares 4 steps and 3 edges
- **THEN** the editor SHALL render exactly 4 nodes (one per `steps[].id`) and 3 directed edges matching the `from`/`to` pairs

### Requirement: YAML round-trip with DSL

The editor SHALL load the persisted YAML source, parse it through `parseFlow` (per `flow-definition`), render the resulting graph, and on save SHALL serialize the graph back to YAML that re-parses byte-equivalent to the visual state. The editor MUST preserve unknown comments, key order, and quoting style across the round trip.

#### Scenario: Load-edit-save round trip

- **WHEN** an admin opens a flow whose YAML declares 3 steps, adds a fourth step via the visual editor, and clicks "Save"
- **THEN** the serialized YAML SHALL contain all 4 steps, the original 3 steps' field order SHALL be preserved, and `parseFlow(saved)` SHALL return a `flow` whose `steps.length === 4` with no validation errors

### Requirement: Drag/drop nodes and edge creation

The editor SHALL support drag-and-drop of step nodes onto the canvas from a step-type palette covering all nine supported types (`agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`, `sub_flow`, `parallel`, `loop`). Dragging from one node's output port to another node's input port SHALL create a new `FlowEdge`. The editor MUST expose an inline condition editor for adding optional JSON Logic to an edge.

#### Scenario: Drag edge creates connection

- **WHEN** an admin drags from node `plan`'s output port to node `search`'s input port
- **THEN** the editor SHALL insert a new edge `{ from: 'plan', to: 'search' }` into the in-memory graph and SHALL render the directed edge between the two nodes

### Requirement: Side-by-side YAML and visual views

The editor SHALL provide a toggleable split view: visual graph on one side, raw YAML text on the other, with a vertical splitter the admin can drag. Edits in either pane SHALL stay synchronized — visual changes SHALL update the YAML text on every commit, and parseable YAML edits SHALL update the visual graph after a debounce of 500ms.

#### Scenario: YAML edit reflects in graph

- **WHEN** an admin types a new valid `steps` entry into the YAML pane and waits past the debounce
- **THEN** within 1 second a new node matching the typed step SHALL appear on the visual canvas without losing the cursor position in the YAML editor

### Requirement: Validation errors highlighted on graph

When `parseFlow` returns a non-empty `errors` array (e.g. `FlowEdgeReferenceError`, `FlowUnknownStepTypeError`, `FlowLoopBoundsError`), the editor SHALL highlight the offending nodes or edges in red and SHALL render the error message in a hover tooltip plus an issue panel listing every error with its `{ line, column }` location.

#### Scenario: Unknown step type marks node and panel

- **WHEN** an admin edits the YAML to declare a step with `type: 'webhook'` (not in the nine-kind enum)
- **THEN** the affected node SHALL render with a red error border, the issue panel SHALL list one entry referencing the step id and the literal `'webhook'`, and the "Save" button SHALL be disabled

### Requirement: Save creates a new flow version

The "Save" button SHALL submit the current YAML to the flow persistence API. The API SHALL append a new row to `flow_versions` with an auto-incremented `version` (per `flow-definition`'s versioning rule), update `flow_definitions.latest_version`, and return the new `version`. The editor SHALL refuse to save when the issue panel contains any errors.

#### Scenario: Save publishes incremented version

- **WHEN** an admin saves a valid edit to a flow currently at version `3`
- **THEN** the API SHALL insert a `flow_versions` row with `version=4`, SHALL update `flow_definitions.latest_version=4`, and the editor SHALL display a "Saved as version 4" confirmation
