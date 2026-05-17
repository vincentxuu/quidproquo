## ADDED Requirements

### Requirement: Evidence browser page

The console SHALL serve `/admin/console/runs/[id]/evidence` as the evidence browser. The page SHALL load every `Source`, `Excerpt`, `Claim`, `Citation`, and `Conflict` row whose `flow_run_id` equals the path id (see `agent-evidence/evidence-store`). Entities SHALL be grouped in a left-rail nav with counts per kind, and the right pane SHALL default to a paginated claim list ordered by `confidence` descending.

#### Scenario: Browser lists claims for run

- **WHEN** an admin opens `/admin/console/runs/R1/evidence` and `evidence_claims` contains 12 rows with `flow_run_id='R1'`
- **THEN** the right pane SHALL render the 12 claims paginated 25 per page in `confidence` descending order, and the left rail SHALL display `Claims (12)`

### Requirement: Click claim navigates to excerpts and source

Clicking a claim row SHALL open a detail drawer that lists every excerpt linked through `evidence_citations` (`claim_id → excerpt_id → source_id`) and SHALL render the resolved source URL, domain, and `retrieved_at` for each linked excerpt. Selecting an excerpt SHALL highlight the matching `offset`/`length` span inside the source body preview.

#### Scenario: Drawer renders full citation chain

- **WHEN** an admin clicks a claim `C1` with one citation linking to excerpt `E1` whose `source_id=S1`
- **THEN** the drawer SHALL render excerpt `E1` text, source URL from `evidence_sources.url` for `S1`, and SHALL highlight the substring at `offset` length `length` inside the source body preview

### Requirement: Inline source preview pane

The drawer SHALL include a source preview pane that fetches the source body. When `evidence_excerpts.body_r2_key` is set, the preview SHALL stream the body from R2 via a signed server endpoint; otherwise it SHALL render the inline `text` field. The preview MUST display `context_before` and `context_after` around the highlighted excerpt.

#### Scenario: R2-offloaded body streams in preview

- **WHEN** an admin opens an excerpt whose `body_r2_key='evidence/R1/E1'` is non-null
- **THEN** the console SHALL request `/api/admin/console/runs/R1/excerpts/E1/body`, the server SHALL stream the R2 object, and the preview SHALL render the body with the excerpt span highlighted

### Requirement: Conflict comparison view

When the left rail shows `Conflicts (n>0)`, selecting it SHALL render a side-by-side comparison for each `evidence_conflicts` row, showing `claim_a` (text, confidence, citations) on the left and `claim_b` on the right, with `confidence_delta` displayed between them. The view MUST expose a "Resolve" control that POSTs the `resolution` decision (`accepted_a` | `accepted_b` | `dismissed`).

#### Scenario: Conflict view supports resolve action

- **WHEN** an admin opens a conflict between claims `C1` and `C2` and clicks "Accept A"
- **THEN** the page SHALL POST `resolution='accepted_a'` to the resolution endpoint and SHALL update the conflict row badge from `unresolved` to `accepted_a` on success

### Requirement: Full-text search over claims

The page SHALL provide a search box that issues queries against the `evidence_claims_fts` virtual table (per `evidence-store`) filtered by the current `flow_run_id`. Matching claims SHALL be returned ordered by `bm25` ascending and SHALL be rendered in the right pane in place of the default list. Clearing the search SHALL restore the default confidence-ordered list.

#### Scenario: FTS query filters list

- **WHEN** an admin types `cosine similarity` in the search box for run `R1`
- **THEN** the console SHALL call the evidence search endpoint with `query='cosine similarity'` and `flow_run_id='R1'`, and SHALL render only the claims returned by the FTS5 `MATCH` ordered by `bm25` ascending

### Requirement: Confidence score visualization

Every rendered claim row SHALL display its `confidence` value (0–1) as both a numeric badge (two decimal places) and a visual bar. The bar fill SHALL be colour-coded — `<0.4` red, `0.4–0.7` amber, `>0.7` green. Uncited claims (per `evidence.isCited` returning `false`) SHALL render an "uncited" tag next to the confidence badge.

#### Scenario: Uncited claim shows visual marker

- **WHEN** a claim has `confidence=0.55` and no `evidence_citations` row references it
- **THEN** the row SHALL render an amber confidence bar at 55% fill, the numeric badge `0.55`, and an "uncited" tag
