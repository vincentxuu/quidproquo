## ADDED Requirements

### Requirement: Nine typed artifact kinds

The artifact registry SHALL recognize exactly nine artifact kinds: `markdown_report`, `evidence_bundle`, `notion_page`, `slack_draft`, `github_issue`, `github_pr_review`, `csv_spreadsheet`, `pdf_export`, and `pptx_export`. Any attempt to register or validate an artifact under a kind outside this enum SHALL be rejected with `ArtifactKindUnknown`. The enum SHALL be exposed as a TypeScript union type `ArtifactKind` and as a runtime-readable constant `ARTIFACT_KINDS` so other capabilities (`artifact-versioning`, `artifact-regeneration`, `artifact-exporters`) can switch over it exhaustively.

#### Scenario: Registered kind resolves

- **WHEN** a caller invokes `registry.get('markdown_report')` after the kernel has booted
- **THEN** the call SHALL return a non-null `ArtifactDefinition` whose `kind` equals `'markdown_report'`

#### Scenario: Unknown kind rejected

- **WHEN** a caller invokes `registry.validate('blog_post', body)` for a kind not in the nine-kind enum
- **THEN** the kernel SHALL throw `ArtifactKindUnknown` whose message references the offending kind and the registry SHALL NOT consult any handler

### Requirement: Registration via defineArtifact

Artifact kinds SHALL be registered through `defineArtifact({ kind, schema, defaultExporters?, sectioning? })`. `schema` SHALL be a Zod schema validating the body shape for that kind. `defaultExporters` SHALL be an optional array of exporter destination names that the artifact may be sent to without further wiring. `sectioning` SHALL declare whether the artifact body is `'sectioned'` (array of `Section` objects per the section-metadata requirement) or `'monolithic'` (a single opaque body). Re-registering the same `kind` SHALL throw `ArtifactKindAlreadyRegistered`.

#### Scenario: defineArtifact persists definition

- **WHEN** the kernel calls `defineArtifact({ kind: 'markdown_report', schema: MarkdownReportSchema, sectioning: 'sectioned' })`
- **THEN** the registry SHALL store the definition and a subsequent `registry.get('markdown_report')` SHALL return the same `schema` reference and `sectioning='sectioned'`

#### Scenario: Duplicate registration rejected

- **WHEN** `defineArtifact({ kind: 'markdown_report', ... })` is invoked a second time within the same boot
- **THEN** the kernel SHALL throw `ArtifactKindAlreadyRegistered` and SHALL NOT mutate the existing definition

### Requirement: Per-kind schema validation

The registry SHALL validate every artifact body against the Zod schema registered for its kind before any version row is persisted. Validation SHALL run inside `registry.validate(kind, body)` and SHALL be invoked by `artifact-versioning` prior to write. Validation failure SHALL throw `ArtifactBodyInvalid` carrying the underlying Zod issue list.

#### Scenario: Matching kind passes validation

- **WHEN** `registry.validate('csv_spreadsheet', { headers: ['a','b'], rows: [['1','2']] })` runs against a schema requiring `headers: string[]` and `rows: string[][]`
- **THEN** the call SHALL return without throwing and the returned value SHALL deep-equal the input body

#### Scenario: Mismatched body rejected

- **WHEN** `registry.validate('csv_spreadsheet', { headers: 'a,b', rows: 'x' })` runs against the same schema
- **THEN** the kernel SHALL throw `ArtifactBodyInvalid` whose `cause.issues` references both the `headers` and `rows` paths

### Requirement: Section-level traceability metadata

Sectioned artifact bodies SHALL be an ordered array of `Section` objects where each `Section` SHALL include `id` (ULID, unique within the artifact body), `heading` (string, human-readable), `flow_step_id?` (nullable foreign key into `flow_step_runs.step_id` per `agent-flow`), and `claim_ids: string[]` (array of foreign keys into `evidence_claims.id` per `agent-evidence`). The registry SHALL reject sectioned bodies whose section `id` values are not globally unique inside that body with `ArtifactSectionIdDuplicate`.

#### Scenario: Section metadata round-trips

- **WHEN** a sectioned `markdown_report` is validated with sections `[{ id: 'S1', heading: 'Intro', flow_step_id: 'plan', claim_ids: ['C1','C2'] }]`
- **THEN** `registry.validate` SHALL return the same array unchanged and the persisted body SHALL preserve `flow_step_id='plan'` and `claim_ids=['C1','C2']` for `id='S1'`

#### Scenario: Duplicate section id rejected

- **WHEN** a sectioned body declares two sections both with `id='S1'`
- **THEN** the kernel SHALL throw `ArtifactSectionIdDuplicate` referencing the duplicated id and SHALL NOT proceed to write

### Requirement: Registry exposes get / list / validate

The registry SHALL expose three read-side functions: `get(kind: ArtifactKind): ArtifactDefinition`, `list(): ArtifactDefinition[]`, and `validate(kind: ArtifactKind, body: unknown): ValidatedBody`. `list()` SHALL return all currently registered definitions in registration order; `get()` SHALL throw `ArtifactKindUnknown` for unregistered kinds; `validate()` SHALL combine the unknown-kind check with the schema check defined above.

#### Scenario: list returns every registered kind

- **WHEN** the kernel has registered all nine kinds via `defineArtifact`
- **THEN** `registry.list()` SHALL return an array of length 9 whose `kind` fields equal the nine-kind enum

#### Scenario: get on unregistered kind throws

- **WHEN** a caller invokes `registry.get('notion_page')` before that kind has been registered
- **THEN** the kernel SHALL throw `ArtifactKindUnknown` and SHALL NOT return a partial definition

### Requirement: Monolithic kinds bypass sectioning

Artifact kinds whose `sectioning='monolithic'` SHALL NOT carry section arrays; their bodies SHALL be opaque to `artifact-regeneration` (regenerate-from-step replaces the entire body for monolithic kinds). The registry SHALL enforce that `csv_spreadsheet`, `pdf_export`, and `pptx_export` are always registered as `monolithic` and that `markdown_report`, `evidence_bundle`, `notion_page`, `github_issue`, `github_pr_review`, and `slack_draft` are always registered as `sectioned`.

#### Scenario: Monolithic kind rejects section array

- **WHEN** a caller validates a `csv_spreadsheet` body whose root value contains a `sections` array
- **THEN** the kernel SHALL throw `ArtifactBodyInvalid` referencing the unexpected `sections` key

#### Scenario: Sectioned kind requires sections key

- **WHEN** a caller validates a `markdown_report` body that omits the `sections` array
- **THEN** the kernel SHALL throw `ArtifactBodyInvalid` referencing the missing `sections` key

### Requirement: Default exporter binding

When `defaultExporters` is declared for a kind, the registry SHALL ensure every named destination is resolvable in `artifact-exporters` at boot time. If any named destination is unknown the kernel SHALL throw `ArtifactDefaultExporterUnknown` and SHALL refuse to complete boot.

#### Scenario: Default exporter resolves on boot

- **WHEN** the kernel boots with `defineArtifact({ kind: 'github_issue', defaultExporters: ['github_issue'] })` and an exporter named `'github_issue'` is registered
- **THEN** boot SHALL complete and `registry.get('github_issue').defaultExporters` SHALL include `'github_issue'`

#### Scenario: Unknown default exporter blocks boot

- **WHEN** `defineArtifact({ kind: 'github_issue', defaultExporters: ['nonexistent_destination'] })` is invoked during boot
- **THEN** the kernel SHALL throw `ArtifactDefaultExporterUnknown` referencing the missing destination and the Worker SHALL NOT finish booting
