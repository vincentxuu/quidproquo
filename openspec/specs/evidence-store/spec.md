# evidence-store Specification

## Purpose
TBD - created by archiving change agent-evidence. Update Purpose after archive.
## Requirements
### Requirement: Five entity types keyed by flow run

The evidence store SHALL persist exactly five entity types — `Source`, `Excerpt`, `Claim`, `Citation`, `Conflict` — and every row of every entity SHALL carry a non-null `flow_run_id` foreign key into `agent-flow.flow_runs`. The five entities SHALL live in dedicated D1 tables `evidence_sources`, `evidence_excerpts`, `evidence_claims`, `evidence_citations`, `evidence_conflicts`. Each table SHALL include `id` (ULID), `flow_run_id`, `created_at`, and the entity-specific columns defined below.

Per-entity schema fields:

- `evidence_sources`: `url`, `content_hash` (sha256 of normalized body), `retrieved_at`, `freshness_score` (0-1), `domain`, `mime_type`
- `evidence_excerpts`: `source_id`, `offset` (char), `length` (char), `text`, `context_before`, `context_after`, `body_r2_key?` (offload)
- `evidence_claims`: `text` (assertion), `producer_agent_id`, `producer_step_id`, `confidence` (0-1), `polarity` (`asserts` | `refutes`)
- `evidence_citations`: `claim_id`, `excerpt_id`, `provenance_tool_call_id` (FK into `agent_tool_calls`)
- `evidence_conflicts`: `claim_a_id`, `claim_b_id`, `confidence_delta` (signed float), `detected_at`, `resolution` (`unresolved` | `accepted_a` | `accepted_b` | `dismissed`)

#### Scenario: Source row stored with content hash

- **WHEN** the kernel records a new retrieval result with URL `https://example.com/x` and body bytes `B`
- **THEN** the kernel SHALL insert an `evidence_sources` row whose `content_hash = sha256(normalize(B))`, `flow_run_id` equals the active run, and `retrieved_at` equals the syscall completion time

#### Scenario: Excerpt persisted with offset/length

- **WHEN** an excerpt is recorded from offset 120 length 480 of `source_id=S`
- **THEN** the kernel SHALL insert an `evidence_excerpts` row with `source_id=S`, `offset=120`, `length=480`, and a non-null `flow_run_id`

#### Scenario: Claim records producer step

- **WHEN** the `search` step (`step_id=search`) of agent `research` produces a claim during `flow_run_id=R`
- **THEN** the kernel SHALL insert an `evidence_claims` row with `flow_run_id=R`, `producer_agent_id='research'`, `producer_step_id='search'`, and a non-null `confidence`

#### Scenario: Citation links claim to excerpt with provenance

- **WHEN** a citation is created linking `claim_id=C` to `excerpt_id=E` produced by `agent_tool_calls.id=T`
- **THEN** the kernel SHALL insert an `evidence_citations` row with `claim_id=C`, `excerpt_id=E`, and `provenance_tool_call_id=T`

#### Scenario: Conflict records two contradicting claims

- **WHEN** two claims `C1` (`confidence=0.8`) and `C2` (`confidence=0.5`) are detected as contradicting in the same run
- **THEN** the kernel SHALL insert an `evidence_conflicts` row with `claim_a_id=C1`, `claim_b_id=C2`, `confidence_delta=0.3`, and `resolution='unresolved'`

### Requirement: Provenance to agent_tool_calls

Every entity row SHALL persist provenance identifying the `agent_tool_calls` row that produced it. `evidence_sources`, `evidence_excerpts`, and `evidence_claims` SHALL carry a non-null `producer_tool_call_id` column; `evidence_citations` SHALL carry `provenance_tool_call_id`. Inserts without a resolvable tool-call id SHALL be rejected with `EvidenceProvenanceMissing`.

#### Scenario: Insert without provenance rejected

- **WHEN** an internal caller attempts to insert an `evidence_claims` row with `producer_tool_call_id=NULL`
- **THEN** the kernel SHALL throw `EvidenceProvenanceMissing` and SHALL NOT write the row

#### Scenario: Full provenance chain reconstructable

- **WHEN** an auditor queries citation `Ci`
- **THEN** joining `evidence_citations → evidence_claims.producer_tool_call_id → agent_tool_calls` SHALL return the original syscall that produced the underlying claim

### Requirement: D1 backing with FTS on claim text

The five evidence tables SHALL live in the `DB_AGENT` D1 binding. `evidence_claims.text` SHALL be mirrored into a virtual FTS5 table `evidence_claims_fts(text, claim_id UNINDEXED)` updated by D1 triggers on insert / update / delete of `evidence_claims`. Claim search SHALL be served by an FTS5 `MATCH` query against `evidence_claims_fts`.

#### Scenario: FTS row populated on claim insert

- **WHEN** a row is inserted into `evidence_claims` with `text='vectorize supports cosine similarity'`
- **THEN** an FTS5 trigger SHALL insert a corresponding `evidence_claims_fts` row whose `MATCH 'cosine'` returns the new `claim_id`

#### Scenario: FTS lookup returns ranked claims

- **WHEN** an agent calls `evidence.searchClaims({ query: 'cosine', k: 5 })` in flow run `R`
- **THEN** the kernel SHALL issue an FTS5 `MATCH` against `evidence_claims_fts` filtered by `flow_run_id=R` and SHALL return at most 5 claims ordered by `bm25` ascending

### Requirement: R2 blob offload for large excerpts

When an excerpt body exceeds the configurable `inline_max_bytes` (default 256KB), the kernel SHALL offload the body to the shared `R2_AGENT_MEMORY` bucket under an `evidence/` key prefix and store only the R2 key in `evidence_excerpts.body_r2_key`. This behavior SHALL be gated by `AGENT_EVIDENCE_R2`.

#### Scenario: Large excerpt offloaded with R2 enabled

- **WHEN** `AGENT_EVIDENCE_R2=true` and an excerpt body is 400KB
- **THEN** the kernel SHALL upload the body to R2 with key `evidence/{flow_run_id}/{excerpt_id}`, set `evidence_excerpts.body_r2_key` to that key, and leave `text` empty

#### Scenario: Large excerpt rejected with R2 disabled

- **WHEN** `AGENT_EVIDENCE_R2=false` and an excerpt body is 400KB
- **THEN** the kernel SHALL throw `EvidenceExcerptTooLarge` with the configured limit in the message and SHALL NOT insert the row

### Requirement: Source URL deduplication by content hash

Before inserting an `evidence_sources` row, the kernel SHALL look up any existing source within the same `flow_run_id` whose `content_hash` matches the candidate. If a match exists, the kernel SHALL return the existing `source_id` and SHALL NOT insert a duplicate row. URL alone SHALL NOT be sufficient for deduplication; only `content_hash` equality counts.

#### Scenario: Identical content reuses existing source

- **WHEN** the kernel records a retrieval whose `content_hash` matches an existing `evidence_sources` row in the same run
- **THEN** the kernel SHALL return the existing `source_id` and SHALL NOT insert a new row

#### Scenario: Same URL with changed content inserts new source

- **WHEN** a URL `U` is retrieved twice in the same run and the second body has a different `content_hash`
- **THEN** the kernel SHALL insert a second `evidence_sources` row with the new hash, leaving the first row intact

### Requirement: Per-domain reputation snapshot

The kernel SHALL maintain an `evidence_domain_reputation` table with columns `domain`, `trust_score` (0-1), `approve_count`, `reject_count`, `snapshot_at`. On every human approval or rejection of an artifact whose evidence cites domain `D`, the kernel SHALL update the corresponding row by incrementing the appropriate counter and recomputing `trust_score` as `approve_count / (approve_count + reject_count)`. Each update SHALL write a new snapshot row preserving history.

#### Scenario: Approval increments approve_count

- **WHEN** a human approves an artifact citing domain `example.com` and the prior row has `approve_count=4`, `reject_count=1`
- **THEN** the kernel SHALL insert a new snapshot with `approve_count=5`, `reject_count=1`, `trust_score=0.833...`, and a fresh `snapshot_at`

#### Scenario: Reputation read returns latest snapshot

- **WHEN** a caller invokes `evidence.getDomainReputation('example.com')`
- **THEN** the kernel SHALL return the row with the highest `snapshot_at` for that domain

### Requirement: Citation linkage rule

Every `evidence_citations` row SHALL link exactly one `claim_id` to exactly one `excerpt_id`, and the referenced excerpt SHALL itself reference a non-null `source_id`. The kernel SHALL enforce that a claim referenced by any citation SHALL have at least one valid citation chain `claim → ≥1 excerpt → 1 source` before the claim is considered "cited"; uncited claims SHALL be reported by `evidence-verification`.

#### Scenario: Citation requires excerpt with source

- **WHEN** an internal caller attempts to insert an `evidence_citations` row whose `excerpt_id` references an excerpt with `source_id=NULL`
- **THEN** the kernel SHALL throw `EvidenceCitationInvalid` and SHALL NOT write the citation

#### Scenario: Cited claim has full chain

- **WHEN** claim `C` has a citation linking it to excerpt `E` whose `source_id=S`
- **THEN** `evidence.isCited(C)` SHALL return `true` and `evidence.getCitationChain(C)` SHALL return `[{ claim: C, excerpt: E, source: S }]`

### Requirement: Conflict linkage rule

Every `evidence_conflicts` row SHALL reference exactly two distinct `evidence_claims.id` values via `claim_a_id` and `claim_b_id` from the same `flow_run_id`. `confidence_delta` SHALL equal `claims[claim_a].confidence - claims[claim_b].confidence` at conflict-detection time. The kernel SHALL reject inserts where `claim_a_id = claim_b_id` or where the two claims belong to different flow runs.

#### Scenario: Self-conflict rejected

- **WHEN** an internal caller attempts to insert an `evidence_conflicts` row with `claim_a_id = claim_b_id`
- **THEN** the kernel SHALL throw `EvidenceConflictInvalid` and SHALL NOT write the row

#### Scenario: Cross-run conflict rejected

- **WHEN** claims `C1` (run `R1`) and `C2` (run `R2`) are submitted as a conflict
- **THEN** the kernel SHALL throw `EvidenceConflictInvalid` referencing the mismatched `flow_run_id` values

