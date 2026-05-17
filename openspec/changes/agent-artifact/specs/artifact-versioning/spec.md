## ADDED Requirements

### Requirement: D1 tables artifact_definitions and artifact_versions

The versioning store SHALL live in two D1 tables in the `DB_AGENT` binding. `artifact_definitions` SHALL include `id` (ULID), `flow_id` (FK into `agent-flow.flows`), `artifact_kind` (one of the nine kinds), `inputs_hash` (sha256 over the canonical input set), `created_at`, with a unique constraint on `(flow_id, inputs_hash, artifact_kind)`. `artifact_versions` SHALL include `id` (ULID, exposed as `version_id`), `artifact_definition_id` (FK into `artifact_definitions.id`), `parent_version_id` (nullable FK into `artifact_versions.id`), `flow_run_id` (FK into `agent-flow.flow_runs`), `artifact_kind` (denormalized for query), `status` (enum below), `body_inline?` (TEXT JSON), `body_r2_key?` (string), `created_at`.

#### Scenario: New artifact creates definition row

- **WHEN** the runtime persists the first artifact for `flow_id='F'`, `inputs_hash='H'`, kind `'markdown_report'`
- **THEN** the kernel SHALL insert one `artifact_definitions` row with `(flow_id='F', inputs_hash='H', artifact_kind='markdown_report')` and one `artifact_versions` row whose `artifact_definition_id` references it

#### Scenario: Unique constraint enforced

- **WHEN** a caller attempts to insert a second `artifact_definitions` row with the same `(flow_id, inputs_hash, artifact_kind)` triple
- **THEN** the D1 unique constraint SHALL reject the insert and the kernel SHALL reuse the existing definition id when persisting the new version

### Requirement: Version chain per (flow_id, inputs_hash)

For each `(flow_id, inputs_hash, artifact_kind)` triple the kernel SHALL maintain a single-rooted version chain via `artifact_versions.parent_version_id`. A new flow run targeting the same triple SHALL insert a new `artifact_versions` row whose `parent_version_id` points to the most recent version of the chain (resolved by `MAX(created_at)` within the definition). The first version of any chain SHALL have `parent_version_id IS NULL`.

#### Scenario: New version chains to parent

- **WHEN** the runtime persists a second version for an existing definition whose latest version id is `V1`
- **THEN** the kernel SHALL insert `artifact_versions` row with `parent_version_id=V1`, `artifact_definition_id` equal to the existing definition, and `flow_run_id` equal to the new run

#### Scenario: First version has null parent

- **WHEN** the runtime persists the very first version for a freshly created definition
- **THEN** the kernel SHALL insert `artifact_versions` row with `parent_version_id IS NULL`

### Requirement: Status enum

`artifact_versions.status` SHALL be one of exactly four values: `draft`, `approved`, `rejected`, `published`. New versions SHALL default to `status='draft'`. Transitions SHALL be restricted: `draft → approved`, `draft → rejected`, `approved → published`, `approved → rejected`. Any other transition SHALL be rejected with `ArtifactStatusTransitionInvalid`.

#### Scenario: Default status is draft

- **WHEN** a new `artifact_versions` row is inserted without an explicit `status`
- **THEN** the persisted row SHALL have `status='draft'`

#### Scenario: Illegal transition rejected

- **WHEN** a caller attempts to transition a version from `published` back to `draft`
- **THEN** the kernel SHALL throw `ArtifactStatusTransitionInvalid` and SHALL NOT mutate the row

### Requirement: Inline body up to 256KB else R2 offload

When the serialized artifact body is at most `inline_max_bytes` (default 256KB) the kernel SHALL persist it into `artifact_versions.body_inline` as a JSON string and SHALL leave `body_r2_key` null. When the body exceeds the limit the kernel SHALL upload the body to R2 (`R2_AGENT_MEMORY` bucket) under key `artifact/{flow_run_id}/{artifact_definition_id}/{version_id}/body.<ext>` (extension chosen per kind: `md`, `json`, `csv`, `pdf`, `pptx`, otherwise `bin`), SHALL set `body_r2_key` to that key, and SHALL leave `body_inline` null. The threshold and R2 reuse SHALL be gated by `AGENT_ARTIFACT_R2`.

#### Scenario: Small body stored inline

- **WHEN** a 4KB `markdown_report` body is persisted
- **THEN** the resulting `artifact_versions` row SHALL have `body_inline` set to the JSON string and `body_r2_key IS NULL`

#### Scenario: Large body stored in R2

- **WHEN** `AGENT_ARTIFACT_R2=true` and a 400KB `markdown_report` body is persisted for `flow_run_id='R'`, `artifact_definition_id='D'`, `version_id='V'`
- **THEN** the kernel SHALL PUT the body to R2 key `artifact/R/D/V/body.md`, the row SHALL have `body_r2_key='artifact/R/D/V/body.md'`, and `body_inline IS NULL`

#### Scenario: Large body rejected when R2 disabled

- **WHEN** `AGENT_ARTIFACT_R2=false` and a 400KB body is persisted
- **THEN** the kernel SHALL throw `ArtifactBodyTooLarge` referencing the configured limit and SHALL NOT insert the version row

### Requirement: Line-level diff between two versions

The kernel SHALL expose `diffVersions(versionA: string, versionB: string): DiffResult` returning an array of `DiffLine` objects with shape `{ kind: 'equal' | 'added' | 'removed', line: string, a_line_no?: number, b_line_no?: number }`. The diff SHALL operate on the canonical-serialization of each body (markdown text for `markdown_report`, JSON.stringify with sorted keys for structured kinds). Both versions SHALL belong to the same `artifact_definition_id`; cross-definition diff requests SHALL be rejected with `ArtifactDiffCrossDefinition`.

#### Scenario: Diff returns line-level changes

- **WHEN** version `V1` body is `"a\nb\nc"` and version `V2` body is `"a\nB\nc"` for the same definition
- **THEN** `diffVersions('V1','V2')` SHALL return at least one line with `kind='removed'` and `line='b'` and one with `kind='added'` and `line='B'`

#### Scenario: Cross-definition diff rejected

- **WHEN** `diffVersions(V1, V2)` is called and `V1.artifact_definition_id !== V2.artifact_definition_id`
- **THEN** the kernel SHALL throw `ArtifactDiffCrossDefinition` and SHALL NOT load the bodies

### Requirement: Section-level partial approval

For `sectioned` artifact kinds the kernel SHALL persist per-section approval status in an `artifact_section_status` table keyed by `(artifact_version_id, section_id)` with columns `status` (enum `pending | approved | rejected`), `resolved_by?`, `resolved_at?`. When every section of a version reaches `approved` the version-level `status` SHALL auto-transition from `draft` to `approved`. When any section is `rejected` the version-level `status` SHALL transition to `rejected`. Monolithic kinds SHALL NOT write rows into this table.

#### Scenario: All sections approved auto-approves version

- **WHEN** a `markdown_report` version `V` has three sections and the third section transitions from `pending` to `approved`
- **THEN** the kernel SHALL detect that every section is `approved` and SHALL transition `artifact_versions.status` for `V` from `draft` to `approved`

#### Scenario: Single section rejected rejects version

- **WHEN** a `markdown_report` version `V` has three `pending` sections and one section transitions to `rejected`
- **THEN** the kernel SHALL transition `artifact_versions.status` for `V` from `draft` to `rejected` immediately

### Requirement: Version chain query

The kernel SHALL expose `getVersionChain(flow_id: string, inputs_hash: string, artifact_kind: ArtifactKind): Version[]` returning the chain ordered from root to head (oldest first). When no definition matches the call SHALL return an empty array.

#### Scenario: Chain ordered oldest first

- **WHEN** a chain exists with versions `V1 → V2 → V3` for the queried triple
- **THEN** `getVersionChain(...)` SHALL return `[V1, V2, V3]` in that order

#### Scenario: Missing definition returns empty

- **WHEN** no `artifact_definitions` row matches the queried `(flow_id, inputs_hash, artifact_kind)` triple
- **THEN** `getVersionChain(...)` SHALL return `[]` and SHALL NOT throw

### Requirement: Inputs hash canonicalization

`inputs_hash` SHALL be computed as `sha256(canonicalJson(inputs))` where `canonicalJson` sorts object keys lexicographically and uses compact separators. The same logical input set SHALL produce identical `inputs_hash` regardless of key insertion order. The kernel SHALL expose `computeInputsHash(inputs: unknown): string` for callers.

#### Scenario: Key order irrelevant

- **WHEN** `computeInputsHash({ a: 1, b: 2 })` and `computeInputsHash({ b: 2, a: 1 })` are both invoked
- **THEN** both calls SHALL return the same hex string

#### Scenario: Different values produce different hash

- **WHEN** `computeInputsHash({ a: 1 })` and `computeInputsHash({ a: 2 })` are invoked
- **THEN** the two return values SHALL differ
