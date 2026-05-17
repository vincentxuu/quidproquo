## ADDED Requirements

### Requirement: Pluggable exporter interface

The exporter layer SHALL expose `defineExporter({ destination, kinds, handler, requiresApproval? })` as the single registration entry point. `destination` SHALL be a unique string identifier for that exporter (e.g. `'notion'`, `'slack'`). `kinds` SHALL be a non-empty array of `ArtifactKind` values the exporter accepts. `handler` SHALL be an async function with signature `(version: ArtifactVersion, context: ExportContext) => Promise<ExportResult>`. `requiresApproval` SHALL be a boolean (default `false`) that gates the export behind `agent-access` approval. Re-registering the same `destination` SHALL throw `ArtifactExporterAlreadyRegistered`.

#### Scenario: defineExporter persists registration

- **WHEN** the kernel calls `defineExporter({ destination: 'file', kinds: ['markdown_report'], handler: fileHandler })`
- **THEN** the registry SHALL store the exporter and `exporters.get('file')` SHALL return a record whose `handler` is the same reference and `requiresApproval=false`

#### Scenario: Duplicate destination rejected

- **WHEN** `defineExporter({ destination: 'file', ... })` is invoked a second time within the same boot
- **THEN** the kernel SHALL throw `ArtifactExporterAlreadyRegistered` and SHALL NOT replace the existing registration

### Requirement: Nine bundled exporters

The kernel SHALL register exactly nine bundled exporters covering nine destinations: `file` (local filesystem / R2), `notion` (Notion page), `slack` (Slack message), `github_issue` (GitHub issue), `github_pr_review` (GitHub PR review comment), `csv_file` (CSV writer), `pdf_file` (PDF generator), `pptx_file` (PPTX generator), and `email` (SMTP / provider). Each exporter SHALL declare the artifact kinds it accepts; calling an exporter with a non-accepted kind SHALL throw `ArtifactExporterKindMismatch`.

#### Scenario: file exporter writes locally

- **WHEN** `exporters.run('file', version)` is invoked with a `markdown_report` version whose body is `"# Hello"`
- **THEN** the handler SHALL write the body to a local destination resolved from `context.path`, SHALL return `{ status: 'done', external_id: <path> }`, and the `artifact_exports` row SHALL record `status='done'`

#### Scenario: Mismatched kind rejected

- **WHEN** `exporters.run('csv_file', version)` is invoked with a `markdown_report` version whose kind is not in the `csv_file` exporter's `kinds` array
- **THEN** the kernel SHALL throw `ArtifactExporterKindMismatch` referencing both the destination and the artifact kind and SHALL NOT invoke the handler

### Requirement: External writes gated by agent-access approval

Exporters whose `requiresApproval=true` (Notion, Slack, GitHub issue, GitHub PR review, email — every destination that performs an externally-visible side effect) SHALL pause before invoking their `handler` and SHALL insert a row into the kernel `agent_approval_requests` table per the `agent-access` capability. The exporter SHALL await resolution; on `approved` it SHALL invoke the `handler`; on `rejected` it SHALL skip the export and persist `artifact_exports.status='skipped'` with `skip_reason='approval_rejected'`. The `file`, `csv_file`, `pdf_file`, and `pptx_file` exporters (purely local writes) SHALL default to `requiresApproval=false`.

#### Scenario: Notion exporter waits for approval

- **WHEN** `exporters.run('notion', version)` is invoked and the Notion exporter is registered with `requiresApproval=true`
- **THEN** the kernel SHALL insert an `agent_approval_requests` row with `status='pending'` and SHALL NOT invoke the underlying Notion API until the approval is resolved

#### Scenario: Approval denied skips export

- **WHEN** the pending approval row for a Notion export is resolved with `status='rejected'`
- **THEN** the exporter SHALL NOT call the Notion API, SHALL persist `artifact_exports.status='skipped'` with `skip_reason='approval_rejected'`, and the returned `ExportResult` SHALL have `status='skipped'`

### Requirement: Retry policy on external failure

Every external-write exporter (Notion, Slack, GitHub issue, GitHub PR review, email) SHALL retry transient handler failures with exponential backoff: default `max_retries=3`, `initial_delay_ms=500`, `backoff_factor=2`. Each retry attempt SHALL increment `artifact_exports.retry_count`. After exhaustion the exporter SHALL persist `status='failed'` with `error_json` capturing the last error. Local exporters (`file`, `csv_file`, `pdf_file`, `pptx_file`) SHALL NOT retry; their failures SHALL persist `status='failed'` on the first error.

#### Scenario: Transient failure retried then succeeds

- **WHEN** a Slack export handler throws on attempts 1 and 2 then succeeds on attempt 3
- **THEN** the `artifact_exports` row SHALL have `status='done'` and `retry_count=2`

#### Scenario: Retry exhaustion marks failed

- **WHEN** a Slack export handler throws on every attempt up to and including the third retry
- **THEN** the `artifact_exports` row SHALL have `status='failed'`, `retry_count=3`, and `error_json` containing the last thrown error message

### Requirement: artifact_exports persistence row

Every export attempt SHALL persist a row into the D1 table `artifact_exports` with columns `id` (ULID), `artifact_version_id` (FK), `destination` (string), `status` (enum `pending | done | failed | skipped`), `external_id?` (nullable string identifying the remote object: Notion page id, Slack ts, GitHub issue url, file path, etc.), `retry_count` (int, default 0), `skip_reason?` (nullable), `error_json?` (nullable), `requested_at`, `resolved_at?`. Inserts SHALL occur before the handler is invoked (with `status='pending'`); updates SHALL transition the row to one of the terminal statuses.

#### Scenario: Pending row created before handler call

- **WHEN** `exporters.run('file', version)` begins
- **THEN** the kernel SHALL insert an `artifact_exports` row with `status='pending'`, `retry_count=0`, and a non-null `requested_at` before invoking the file handler

#### Scenario: Terminal status persists external_id

- **WHEN** the Notion exporter completes successfully and the Notion API returns page id `notion_abc`
- **THEN** the `artifact_exports` row SHALL transition to `status='done'` with `external_id='notion_abc'` and a non-null `resolved_at`

### Requirement: Provider dependency on agent-providers

The Notion, Slack, GitHub issue, GitHub PR review, and email exporters SHALL invoke external services exclusively through the `agent-providers` Knowledge / Action provider interfaces (no direct `fetch` to vendor endpoints from the exporter handler). The exporter SHALL resolve its provider by name from the kernel provider registry; if the provider is not registered the exporter SHALL throw `ArtifactExporterProviderMissing`.

#### Scenario: Notion exporter routes through provider

- **WHEN** the Notion exporter handler runs after approval
- **THEN** the handler SHALL invoke `providers.get('notion').createPage(...)` and SHALL NOT issue any direct `fetch` call to `api.notion.com`

#### Scenario: Missing provider rejects export

- **WHEN** the GitHub issue exporter handler runs and `providers.get('github')` returns undefined
- **THEN** the kernel SHALL throw `ArtifactExporterProviderMissing` referencing `'github'` and the `artifact_exports` row SHALL transition to `status='failed'`

### Requirement: Idempotent re-export

Before invoking the handler the exporter SHALL check `artifact_exports` for a prior row with the same `(artifact_version_id, destination)` pair whose `status='done'` and whose `external_id` is non-null. If found, the exporter SHALL return the existing `ExportResult` (`status='done'`, prior `external_id`) without invoking the handler and SHALL NOT insert a duplicate row.

#### Scenario: Re-running same export returns cached result

- **WHEN** `exporters.run('notion', version)` is invoked and a prior `artifact_exports` row already records `status='done'` with `external_id='notion_abc'` for `(version.id, 'notion')`
- **THEN** the exporter SHALL return `{ status: 'done', external_id: 'notion_abc' }`, SHALL NOT call the Notion provider, and SHALL NOT insert a new `artifact_exports` row

#### Scenario: Failed prior attempt does not block retry

- **WHEN** `exporters.run('notion', version)` is invoked and the prior `artifact_exports` row for `(version.id, 'notion')` has `status='failed'`
- **THEN** the idempotency check SHALL NOT short-circuit and the exporter SHALL proceed to insert a new `pending` row and re-invoke the handler

### Requirement: External_id format per destination

The exporter SHALL persist `external_id` in a stable format per destination so downstream consumers can resolve it without ambiguity: `file` → absolute path or R2 key; `notion` → Notion page id; `slack` → channel id concatenated with `':'` and message ts (e.g. `'C123:1700000000.000100'`); `github_issue` → full HTTPS issue url; `github_pr_review` → full HTTPS review url; `csv_file` / `pdf_file` / `pptx_file` → absolute path or R2 key; `email` → message-id header value.

#### Scenario: Slack external_id concatenates channel and ts

- **WHEN** the Slack exporter posts to channel `'C123'` and the API returns ts `'1700000000.000100'`
- **THEN** the `artifact_exports.external_id` SHALL equal `'C123:1700000000.000100'`

#### Scenario: GitHub issue external_id is full url

- **WHEN** the GitHub issue exporter creates issue number 42 in repo `owner/repo`
- **THEN** the `artifact_exports.external_id` SHALL equal `'https://github.com/owner/repo/issues/42'`
