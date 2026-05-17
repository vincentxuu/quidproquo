## ADDED Requirements

### Requirement: Artifact viewer page

The console SHALL serve `/admin/console/runs/[id]/artifacts/[artifactId]` as the artifact viewer. The page SHALL load the latest version of the artifact body and SHALL render it using a kind-aware renderer dispatched on `ArtifactDefinition.kind` (see `agent-artifact/artifact-registry`). The page MUST display the artifact `kind`, `version`, `created_at`, and a status badge for `pending` | `approved` | `rejected` | `exported`.

#### Scenario: Renders latest version

- **WHEN** an admin opens `/admin/console/runs/R1/artifacts/A1` and artifact `A1` has 3 versions
- **THEN** the page SHALL render the body of version 3 using the renderer for its `kind`, and the header SHALL display `version=3` and the resolved approval status

### Requirement: Version history dropdown

The viewer SHALL render a version history control listing every persisted version of the artifact in descending version order. Selecting an earlier version SHALL re-render the body for that version while preserving the current URL plus a `?version=N` query parameter so the view is deep-linkable.

#### Scenario: Switching versions updates the rendered body

- **WHEN** an admin opens artifact `A1` (latest version 3) and selects version `1` from the dropdown
- **THEN** the URL SHALL update to include `?version=1`, the rendered body SHALL match the version 1 payload, and the version badge SHALL display `version=1`

### Requirement: Two-version diff view

The viewer SHALL expose a "Compare" mode that accepts two version selections and SHALL render a side-by-side diff. For `sectioned` kinds (per `artifact-registry`) the diff SHALL run per-section keyed by `section.id`; for `monolithic` kinds the diff SHALL run on the opaque body text. Added, removed, and changed regions SHALL be visually distinct.

#### Scenario: Sectioned diff aligns by section id

- **WHEN** an admin compares version `1` and version `2` of a `markdown_report` and a section with `id='S1'` exists in both with different text
- **THEN** the diff view SHALL pair `S1` from each version side-by-side and SHALL render line-level added/removed markers for the differing text

### Requirement: Approve, reject, and export actions

The viewer SHALL render "Approve", "Reject", and "Export" buttons. Approve and Reject SHALL POST to the artifact-approval endpoint and transition the artifact status accordingly. Export SHALL open a destination picker showing the artifact's `defaultExporters` plus any compatible registered exporters; selecting a destination SHALL dispatch the export and surface the resulting destination id or error.

#### Scenario: Approve flips status and records actor

- **WHEN** an admin clicks "Approve" on a `pending` artifact
- **THEN** the API SHALL be called with the actor id, the response SHALL include `status='approved'`, and the page SHALL replace the status badge with `approved` without a full reload

#### Scenario: Export dispatches to chosen destination

- **WHEN** an admin clicks "Export" on a `github_issue` artifact and selects destination `github_issue`
- **THEN** the console SHALL POST the export request, SHALL display the returned destination URL on success, and SHALL surface the error message on failure

### Requirement: Section-level approval highlighting

For `sectioned` kinds, the viewer SHALL render a per-section approval gutter showing the approval state for each section (`pending` | `approved` | `rejected`). Section approval state SHALL be sourced from the artifact-approval store keyed by `(artifactId, version, section.id)`. Clicking a gutter marker SHALL open a per-section approve/reject popover.

#### Scenario: Per-section state is rendered per row

- **WHEN** an artifact has 3 sections with section-level states `[approved, pending, rejected]`
- **THEN** the viewer SHALL render three gutter markers in section order whose colours map to `approved`, `pending`, and `rejected` respectively

### Requirement: Per-kind rendering

The viewer SHALL dispatch rendering to a kind-specific component for every kind in the nine-kind enum. `markdown_report` SHALL render through the existing Markdown renderer, `evidence_bundle` SHALL render a Source/Claim/Citation grouped view, `notion_page` SHALL render the Notion-style block tree, `slack_draft` SHALL render the Slack message preview, `github_issue` and `github_pr_review` SHALL render the GitHub form preview, `csv_spreadsheet` SHALL render an HTML table, `pdf_export` SHALL embed the PDF, and `pptx_export` SHALL render a slide thumbnail strip.

#### Scenario: Each kind uses its matching renderer

- **WHEN** an admin opens artifacts of three different kinds in succession (`markdown_report`, `csv_spreadsheet`, `pdf_export`)
- **THEN** the viewer SHALL invoke the Markdown renderer, the HTML table renderer, and the embedded PDF renderer respectively, and SHALL NOT fall back to a generic JSON dump for any of the three
