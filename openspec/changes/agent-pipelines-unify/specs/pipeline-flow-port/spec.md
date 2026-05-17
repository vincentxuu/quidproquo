## ADDED Requirements

### Requirement: Per-pipeline flow YAML exists

Every pipeline definition currently registered in `src/lib/pipelines/registry.ts` SHALL have a corresponding flow YAML file at `flows/pipelines/<pipeline-id>.yaml`. The initial migration scope MUST cover every id present in `pipelineDefinitions`: `content-ops`, `post-quality`, `embed-sync`, `crawl-sync`, `translation`, `research-brief`, `youtube-brief`, `glossary-gap`, `freshness-review`, `series-suggestions`, `knowledge-graph-prototype`, `metadata-suggestions`, and `internal-links`.

If a new pipeline is added under `src/lib/pipelines/definitions/` after this change lands, CI SHALL fail until a matching `flows/pipelines/<id>.yaml` exists.

#### Scenario: All current pipelines have a ported flow

- **WHEN** CI lists every id returned by `listPipelines()` and checks for a sibling YAML file at `flows/pipelines/<id>.yaml`
- **THEN** every id SHALL resolve to an existing, non-empty YAML file

#### Scenario: New pipeline added without flow fails CI

- **WHEN** a contributor adds a new entry to `pipelineDefinitions` without a matching `flows/pipelines/<id>.yaml`
- **THEN** the parity check job SHALL fail with `missing flow port for pipeline <id>` and SHALL block merge

### Requirement: Ported flow is a faithful linear port

Each ported YAML SHALL be a linear chain of nodes — one node per stage in the source pipeline, in the same order — with no edge conditions, no parallel branches, no loops, and no sub-flow nesting. Node `tool` references MUST match the source pipeline's `stages[].tool`; node `kind` MUST preserve the source `kind` (`module`, `llm`, `api`, `human_review`).

The port is mechanical: new flow-only features (conditional edges, parallel, retries beyond the source `budget.maxRetries`) MUST NOT be introduced in this change.

#### Scenario: Linear chain only

- **WHEN** a reviewer opens any file under `flows/pipelines/`
- **THEN** the YAML SHALL declare exactly N nodes for a pipeline with N stages, edges SHALL form a single linear chain, and SHALL contain no `when`, `parallel`, `loop`, or `subflow` keys

#### Scenario: Stage-to-node parity

- **WHEN** the parity check compares `pipelineDefinitions[id].stages` against `flows/pipelines/<id>.yaml` nodes
- **THEN** node ids SHALL appear in the same order as stage ids and each node's `tool` and `kind` SHALL equal the source stage's `tool` and `kind`

### Requirement: Per-pipeline parity test

For every ported pipeline a parity test SHALL exist under `tests/pipelines/parity/<id>.test.ts` that runs both the legacy `runner.ts` path and the flow runtime against a canned input fixture and asserts structurally equivalent output (same artifact ids, same artifact types, same final status, same ordered stage/node ids in the run log).

Parity tests MUST run on every PR that touches `src/lib/pipelines/**` or `flows/pipelines/**`.

#### Scenario: Parity passes for ported pipeline

- **WHEN** the parity suite runs against a canned input for any pipeline id
- **THEN** the legacy and flow outputs SHALL match on artifact ids, artifact types, terminal status, and ordered step ids

#### Scenario: Parity failure blocks merge

- **WHEN** a port introduces a stage/node mismatch and parity diff is non-empty
- **THEN** the test SHALL fail with a structured diff and the PR check SHALL be marked failing

### Requirement: Tool calls route through the central registry

Ported flows SHALL invoke tools exclusively through the central tool registry (`src/lib/agent-os/tools/` or its `agent-foundation` successor). This change MUST NOT modify any tool implementation under `src/lib/pipelines/tool-registry.ts` or its adapters; the adapter shape stays intact so both runtimes share identical tool semantics during the grace period.

#### Scenario: No new tool implementations added

- **WHEN** a reviewer diffs this change
- **THEN** no file under `src/lib/pipelines/tool-registry.ts` or tool implementation module SHALL contain a behavioral edit; only adapter wiring SHALL be permitted

### Requirement: Mapping document records every port

A `docs/pipeline-flow-mapping.md` file SHALL exist and SHALL contain one row per ported pipeline with columns: `pipeline_id`, `flow_path`, `parity_test_path`, `notes`. Entries with deferred-port status MUST explain why in the notes column.

#### Scenario: Mapping doc lists every pipeline

- **WHEN** a reader greps `docs/pipeline-flow-mapping.md` for each id from `pipelineDefinitions`
- **THEN** every id SHALL appear in exactly one row with non-empty `flow_path` and `parity_test_path`
