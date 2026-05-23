# claim-extraction Specification

## Purpose
TBD - created by archiving change agent-evidence. Update Purpose after archive.
## Requirements
### Requirement: Triggered on text-returning syscalls

Claim extraction SHALL be triggered automatically whenever a kernel syscall whose declared output schema contains text fields completes successfully. The set of triggering syscalls SHALL include at minimum `search.external`, `search.docs`, `fetch.url`, and `read.file`; the set SHALL be configurable per kernel deployment via `AGENT_EVIDENCE_EXTRACTION_SYSCALLS`. Syscalls returning no text fields SHALL NOT trigger extraction.

#### Scenario: search.external triggers extraction

- **WHEN** a `search.external` syscall returns `{ results: [{ url, snippet }] }` for flow run `R`
- **THEN** the kernel SHALL enqueue a claim-extraction job referencing the syscall's `agent_tool_calls.id` and `flow_run_id=R`

#### Scenario: Non-text syscall does not trigger

- **WHEN** a `metrics.increment` syscall completes
- **THEN** the kernel SHALL NOT enqueue a claim-extraction job

### Requirement: Multi-signal extraction with entity-match dedup

The extractor SHALL produce claim candidates from each retrieved text via two parallel signals: semantic chunking (sentence-level segments grouped by topical similarity) and noun/verb-phrase candidate generation. Candidates from multiple sources within the same `flow_run_id` SHALL be deduplicated by entity-overlap matching — two candidates whose extracted entity sets have Jaccard similarity `≥ 0.7` and whose normalized predicate strings match SHALL be merged into a single `evidence_claims` row whose citation set is the union of contributing excerpts.

#### Scenario: Two sources yielding same claim merged

- **WHEN** source `S1` yields candidate "Vectorize supports cosine similarity" and source `S2` yields candidate "Cosine similarity is supported by Vectorize" in run `R`
- **THEN** the kernel SHALL emit a single `evidence_claims` row and SHALL insert two `evidence_citations` rows linking that claim to one excerpt from `S1` and one from `S2`

#### Scenario: Different entities not merged

- **WHEN** candidate A is "Vectorize supports cosine similarity" and candidate B is "Pinecone supports cosine similarity"
- **THEN** the kernel SHALL emit two distinct `evidence_claims` rows because the entity sets `{Vectorize}` and `{Pinecone}` have Jaccard similarity below `0.7`

### Requirement: Confidence scoring formula

Each `evidence_claims.confidence` value SHALL be computed as a weighted sum of four signals: source count (number of distinct supporting sources, normalized via `min(n/3, 1)`), freshness (mean `evidence_sources.freshness_score` of cited sources), reputation (mean `evidence_domain_reputation.trust_score` of cited domains at extraction time), and agent self-rating (the producing agent's declared certainty in `[0, 1]`). Default weights SHALL be `0.35` (source count), `0.20` (freshness), `0.25` (reputation), `0.20` (self-rating). Weights SHALL be overridable via the flow definition's `evidence_policy.confidence_weights` field.

#### Scenario: Confidence increases with second corroborating source

- **WHEN** a claim is initially supported by 1 source yielding `confidence=0.45`, and a second matching extraction adds a corroborating source
- **THEN** the kernel SHALL recompute `confidence` using the updated source count and SHALL update the row to a strictly greater value

#### Scenario: Custom weights honored

- **WHEN** a flow declares `evidence_policy.confidence_weights = { source_count: 1.0, freshness: 0, reputation: 0, self_rating: 0 }`
- **THEN** the kernel SHALL compute `confidence = min(n/3, 1)` and SHALL ignore freshness, reputation, and self-rating signals

### Requirement: Async non-blocking extraction

Claim-extraction jobs SHALL execute asynchronously via the Cloudflare Queues binding `Q_AGENT_EVIDENCE` (or an in-Worker `waitUntil` fallback when the binding is absent). The triggering syscall SHALL return its result to the calling agent immediately, before any extraction work begins. The kernel SHALL NOT block the syscall return on extraction completion.

#### Scenario: Syscall returns before extraction completes

- **WHEN** a `search.external` syscall takes 200ms to fetch and extraction would take 1500ms
- **THEN** the calling agent SHALL receive the syscall result within ~200ms; the extraction job SHALL still be pending on `Q_AGENT_EVIDENCE` at that moment

#### Scenario: Queue binding absent falls back to waitUntil

- **WHEN** the `Q_AGENT_EVIDENCE` binding is not configured
- **THEN** the kernel SHALL schedule extraction via `ctx.waitUntil(extract(...))` and the syscall SHALL still return immediately

### Requirement: Configurable extraction strategies

Each flow MAY declare an `evidence_policy.extraction_strategy` value: `noun_verb_phrase` (default — regex/POS-driven candidate generation) or `nli` (advanced — NLI-model-driven entailment extraction). The kernel SHALL select the strategy per `flow_run_id` based on the flow definition; absent strategies SHALL default to `noun_verb_phrase`. The `nli` strategy SHALL be gated by `AGENT_EVIDENCE_NLI_STRATEGY` and SHALL fall back to `noun_verb_phrase` when the flag is off.

#### Scenario: Default strategy applied when unspecified

- **WHEN** a flow definition does not declare `evidence_policy.extraction_strategy`
- **THEN** the kernel SHALL use the `noun_verb_phrase` strategy for every extraction in that run

#### Scenario: NLI flag off forces fallback

- **WHEN** a flow declares `evidence_policy.extraction_strategy='nli'` and `AGENT_EVIDENCE_NLI_STRATEGY=false`
- **THEN** the kernel SHALL execute extraction using `noun_verb_phrase` and SHALL emit a lifecycle event with `kind='extraction_strategy_downgraded'`

### Requirement: Failure isolation

A claim-extraction job that throws SHALL log a `claim_extraction_failed` lifecycle event including the syscall id, exception class, and message, and SHALL NOT transition the originating flow run to `failed`. The kernel SHALL apply a per-job retry policy of up to 2 retries with exponential backoff (`100ms`, `400ms`); after retry exhaustion the job SHALL be discarded.

#### Scenario: Extraction failure does not fail the flow

- **WHEN** an extraction job throws on every attempt for a `search.external` syscall in run `R`
- **THEN** after 3 total attempts the kernel SHALL log `claim_extraction_failed` with attempt count 3, SHALL discard the job, and `flow_runs.status` for `R` SHALL be unaffected by the failure

#### Scenario: Retry succeeds on second attempt

- **WHEN** an extraction job throws once then succeeds
- **THEN** the kernel SHALL insert the resulting claims into `evidence_claims` and SHALL emit no `claim_extraction_failed` event

### Requirement: Excerpt span linkage

Every `evidence_claims` row produced by the extractor SHALL link to at least one `evidence_excerpts` row, and each linking excerpt SHALL carry the character-offset span (`offset`, `length`) of the text region from which the claim was derived. Inserts of claims without at least one excerpt link SHALL be rejected with `ClaimExcerptMissing`.

#### Scenario: Claim links to excerpt with offset span

- **WHEN** the extractor identifies a claim at characters 240-360 of source `S`
- **THEN** the kernel SHALL insert an `evidence_excerpts` row with `source_id=S`, `offset=240`, `length=120`, and an `evidence_citations` row linking the new claim to that excerpt

#### Scenario: Claim without excerpt rejected

- **WHEN** an internal caller attempts to insert an `evidence_claims` row with no corresponding `evidence_citations` row
- **THEN** the kernel SHALL throw `ClaimExcerptMissing` and SHALL NOT write the claim

