## ADDED Requirements

### Requirement: Flow selector landing page

The console SHALL serve `/admin/console` as the flow selector entry point. The page SHALL list every flow whose latest `flow_versions` row is published, alongside any presets declared on the flow definition. Each list item SHALL render the flow `name`, `description`, latest `version`, owning category, and a "Launch" affordance.

#### Scenario: Lists published flows

- **WHEN** an admin opens `/admin/console` and the `flow_definitions` table contains three published flows
- **THEN** the page SHALL render exactly three flow cards in `name` ascending order and each card SHALL display the latest `version` from `flow_definitions.latest_version`

### Requirement: Filter by category, status, and cost

The flow selector SHALL expose filters for `category`, lifecycle `status` (`draft` | `published` | `archived`), and estimated `cost` band (`<$0.10`, `$0.10–$1`, `>$1`). Filter state MUST be reflected in the URL query string so the view is deep-linkable. Applying multiple filters SHALL combine them with logical AND.

#### Scenario: Combined filters narrow the list

- **WHEN** an admin selects category `research` and cost band `<$0.10`
- **THEN** the page SHALL request `/admin/console?category=research&cost=lt_0_10` and SHALL render only flows whose `category='research'` and whose `estimated_cost_usd < 0.10`

### Requirement: Input form rendered from flow inputs schema

When an admin clicks a flow card, the console SHALL render an input form derived from the flow's `inputs: FlowInput[]` schema (see `agent-flow/flow-definition`). The form SHALL render one field per `FlowInput`, MUST mark `required: true` fields with a visible required indicator, and SHALL apply the declared `default` as the initial field value. Field types `string`, `number`, `boolean`, `object`, and `array` SHALL each map to a matching widget.

#### Scenario: Form mirrors input schema

- **WHEN** a flow declares `inputs: [{ name: 'topic', type: 'string', required: true }, { name: 'depth', type: 'number', required: false, default: 2 }]`
- **THEN** the form SHALL render a required text input labelled `topic` and a numeric input labelled `depth` pre-filled with value `2`

### Requirement: Strategy summary preview before launch

Before dispatching a run, the console SHALL display a strategy summary panel showing the resolved provider routing order (from `provider-routing.config`), the estimated cost in USD, the estimated duration in seconds, and the id of the policy that will be bound (from `policy-definition`). Estimates SHALL be fetched from a server endpoint that joins flow metadata with the active policy.

#### Scenario: Preview shows estimates and active policy

- **WHEN** an admin fills the input form for a flow bound to `research-standard` policy
- **THEN** the preview panel SHALL display the provider order from the active routing config, the policy id `research-standard`, a non-null `estimated_cost_usd`, and a non-null `estimated_duration_seconds`

### Requirement: Launch dispatches run via flow API

The "Launch" button SHALL POST the validated input payload to the existing flow-run dispatch API. On success the console SHALL receive a `flow_run_id` and SHALL redirect the admin to `/admin/console/runs/{flow_run_id}`. On failure the console SHALL surface the API error message inline above the launch button without losing form state.

#### Scenario: Successful launch redirects to run page

- **WHEN** an admin clicks "Launch" with valid inputs and the API responds with `{ flow_run_id: 'R123' }`
- **THEN** the browser SHALL navigate to `/admin/console/runs/R123` and the input form state SHALL be cleared from local memory

#### Scenario: Launch failure preserves form

- **WHEN** the API responds with HTTP 400 `{ error: 'FlowInputValidationError', field: 'topic' }`
- **THEN** the console SHALL render the error message adjacent to the `topic` field and SHALL keep all other field values intact
