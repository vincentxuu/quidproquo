## Context

The Gateway Console plan (§4.6) names **evidence/audit** the single biggest product differentiator vs generic agent platforms: every claim in a generated artifact must trace back to its source, excerpt, retrieval timestamp, and confidence score. Without this layer, the platform is "yet another report generator" — and the trend-research §6 warning about ungoverned agents lands hard.

After `agent-foundation` (#0), `agent-os` (#1), `agent-providers` (#2), and `agent-flow` (#3) land, the platform has:

- A kernel (`src/lib/agent-os/`) that mediates every tool call through `agent_tool_calls`, with per-agent permissions, memory scopes, and cancellation
- A provider router that resolves `search.external` / `model.invoke` to a concrete vendor and writes uniform call telemetry
- A flow runtime that orchestrates kernel agents and writes per-step rows into `flow_step_runs`, each carrying state snapshots and child `agent_run_id` references

What it does **not** have is a *semantic* layer above the per-call telemetry. The current `agent_tool_calls.output_json` for a Tavily search is a JSON blob of search results; nothing in the database represents "the writer used result #3 in support of the claim that GraphRAG improves recall". `agent-policy` (the next change after this one) cannot meaningfully enforce `citation_required: true` without that linkage. The admin operator cannot review "which sources backed claim X" without it. The user cannot drill down from a final paragraph to its provenance chain.

`agent-evidence` is the layer that fills the gap. It consumes the three kernel substrates already in place — `agent-memory` (Vectorize + D1 FTS5 for deduplication), `agent-tools` (every `search.*` call emits results), `agent-access` (conflict-review approval gate path) — and persists a normalized graph of Source → Excerpt → Claim → Citation with optional Conflict edges. It is **pure data + extraction**; the judgment layer (policies that fail a run on missing citations) is `agent-policy`.

**Stakeholders.**
- **Admin operator** (primary) — wants to inspect a final report and trace any paragraph back to its sources without re-running the flow
- **Quality-policy author** (secondary) — needs deterministic, queryable evidence state to enforce `min_sources`, `citation_required`, `no_stale_sources`
- **Flow author** — wants extraction to be transparent (no extra YAML per step); the kernel does the work

**Constraints.**
1. **No regression of kernel telemetry.** Every `agent_tool_calls` row that already exists keeps its shape; evidence rows reference it, never replace it
2. **Provenance chain is total.** Given a `flow_run_id`, the chain `claim → citation → excerpt → source → tool_call_id → agent_run_id → flow_step_run_id → flow_run_id` is reconstructable in one SQL query
3. **Multi-tenant scope.** Every evidence row carries the `org_id` from the originating run; no cross-org leak in retrieval
4. **Flag-gated rollout.** Umbrella `AGENT_EVIDENCE_ENABLED=false` makes the entire surface dark; per-feature flags for NLI conflicts and reputation learning

## Goals / Non-Goals

**Goals**
- Five entity types (Source, Excerpt, Claim, Citation, Conflict) with one D1 migration, one R2 bucket reuse path, one Vectorize namespace
- Multi-signal claim extraction (semantic dedup via Vectorize + entity-match for near-duplicates) triggered automatically on tool-call boundaries
- Confidence scoring with configurable weights + one feedback signal (artifact approval/rejection)
- Source reputation learning per domain, updated from the same feedback signal, with cold-start defaults
- Conflict detection via embedding distance (v1) with NLI as a flagged-off upgrade path
- Full provenance reconstruction from `flow_run_id`
- Clean interface to `agent-policy` (this change exposes read-only evidence query API; policy applies the rules)
- Conflict-review approval gate via kernel `agent-access`

**Non-Goals**
- Policy enforcement (`citation_required`, `min_sources`) — `agent-policy` (#5)
- Artifact-side rendering of evidence (footnotes, source tray UI) — `agent-artifact` (#7) + `agent-console` (#4)
- A2A or cross-organization evidence sharing
- Open-domain fact-checking via external APIs — out of scope; evidence is bounded by what flows already retrieved
- Replacing the existing post embedding pipeline; evidence vectors live in their own Vectorize namespace
- Visual evidence graph UI — lives in `agent-console`

## Decisions

### D1: Five entity types — Source, Excerpt, Claim, Citation, Conflict

**Decision.** Evidence has exactly five entity types. Each is a separate D1 table with explicit foreign keys. No JSON-blob shortcuts for cross-entity references — the relational shape is what makes the provenance chain queryable.

| Entity | Purpose | Cardinality |
|---|---|---|
| **Source** | One row per distinct origin (URL, doc id, internal post slug); deduped by `content_hash` | 1:N excerpts |
| **Excerpt** | One row per substring of a source used by an agent; stores offset + length + surrounding context | N:1 source, M:N claims via citations |
| **Claim** | One row per atomic factual assertion extracted from a step output; carries originating `agent_run_id` and `flow_step_run_id` | M:N excerpts via citations |
| **Citation** | The edge between Claim and Excerpt; carries `support_type` (supports / refutes / mentions) and the agent's self-rated certainty | N:1 claim, N:1 excerpt |
| **Conflict** | A directed edge between two contradicting claims; carries detection method (`embedding_distance` / `nli` / `manual`) and human-review status | N:2 claims |

Plus one auxiliary table: **ConfidenceSignal** — append-only ledger of every input that influenced a claim's confidence score (number of supporting excerpts, source reputation snapshots, agent self-rating, feedback events). Recomputing confidence is replaying the ledger.

**Why five and not three.** Collapsing Excerpt into Citation loses the ability to query "all excerpts ever taken from source S" cheaply. Collapsing Claim into Citation forces every citation row to repeat the claim text and originating agent — quadratic blow-up on multi-source claims. Collapsing Conflict into a `Claim.contradicts_json` blob makes pairwise queries quadratic in JSON parsing. The five-type shape mirrors the Gateway Console §4.6 model verbatim, which itself comes from the academic provenance-modeling literature; deviating from it adds reviewer cost for no gain.

**Why no AuditEvent table.** Gateway Console §4.6 lists `AuditEvent`. The kernel's `agent_run_events` already records every lifecycle transition; duplicating it under an evidence-specific name would split the audit story across two tables. Evidence rows themselves are audit data — `Source.retrieved_at`, `Claim.extracted_at`, `Citation.created_at` together give the timeline.

**Alternatives considered.**
- *Single denormalized `evidence_items` blob table* — rejected: replicates the pipeline-tool-registry mistake (one blob, no schema enforcement). Querying becomes JSON parsing
- *Triplestore (RDF / SPARQL)* — rejected: introduces a new query model and runtime; D1 is the kernel's source of truth and that's the right place
- *Graph database (Neo4j, ArangoDB)* — rejected: new infra tier, new credentials, new billing; the queries we need are 2–3 join SQL, not graph traversal

### D2: D1 schema — 6 new tables (migration `0014_agent_evidence.sql`)

```sql
-- 0014_agent_evidence.sql
-- Slots after agent-foundation 0010, agent-os 0011, agent-flow 0012, agent-providers 0013,
-- agent-policy reservations 0014, 0015 (artifacts reservation if it sneaks ahead).

CREATE TABLE evidence_sources (
  source_id TEXT PRIMARY KEY,                 -- UUID
  flow_run_id TEXT NOT NULL,                  -- denormalized for org-scoped queries
  org_id TEXT NOT NULL,                       -- multi-tenant scope
  uri TEXT NOT NULL,                          -- url | doc-store id | internal slug
  uri_kind TEXT NOT NULL CHECK (uri_kind IN ('http_url','internal_post','agent_memory','file_blob')),
  title TEXT,
  content_hash TEXT NOT NULL,                 -- sha256 of normalized full content
  domain TEXT,                                -- extracted from uri for reputation lookup
  retrieved_at INTEGER NOT NULL,              -- ms epoch
  retrieved_via_call_id INTEGER REFERENCES agent_tool_calls(call_id),
  freshness_published_at INTEGER,             -- when the source itself was published (NULL if unknown)
  body_blob_uri TEXT,                         -- R2 key if body > 256KB (D10)
  body_inline TEXT,                           -- inline body if small
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, content_hash)               -- dedup at write time
);
CREATE INDEX idx_evidence_sources_flow_run ON evidence_sources(flow_run_id);
CREATE INDEX idx_evidence_sources_org_domain ON evidence_sources(org_id, domain);

CREATE TABLE evidence_excerpts (
  excerpt_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES evidence_sources(source_id),
  flow_run_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  offset_start INTEGER NOT NULL,
  offset_end INTEGER NOT NULL,
  body_text TEXT NOT NULL,                    -- the substring; redundant w/ offsets for query speed
  surrounding_context TEXT,                   -- N chars before+after for human review
  body_blob_uri TEXT,                         -- R2 key if body_text > 256KB
  vector_id TEXT,                             -- Vectorize id for dedup / conflict detection
  extracted_at INTEGER NOT NULL,
  extracted_by_call_id INTEGER REFERENCES agent_tool_calls(call_id)
);
CREATE INDEX idx_evidence_excerpts_source ON evidence_excerpts(source_id);
CREATE INDEX idx_evidence_excerpts_flow_run ON evidence_excerpts(flow_run_id);

CREATE TABLE evidence_claims (
  claim_id TEXT PRIMARY KEY,
  flow_run_id TEXT NOT NULL,
  flow_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),
  agent_run_id TEXT REFERENCES agent_runs(run_id),
  org_id TEXT NOT NULL,
  claim_text TEXT NOT NULL,                   -- normalized atomic assertion
  claim_hash TEXT NOT NULL,                   -- sha256 of normalized text for dedup
  entities_json TEXT,                         -- extracted named entities for entity-match dedup
  vector_id TEXT,                             -- Vectorize id for semantic dedup + conflict detection
  confidence_score REAL,                      -- computed; recomputable from confidence_signals
  confidence_band TEXT CHECK (confidence_band IN ('low','medium','high','disputed')),
  extracted_at INTEGER NOT NULL,
  extracted_by_call_id INTEGER REFERENCES agent_tool_calls(call_id),
  superseded_by_claim_id TEXT,                -- when a near-duplicate is merged
  UNIQUE (org_id, flow_run_id, claim_hash)    -- per-run dedup; cross-run claims stay distinct
);
CREATE INDEX idx_evidence_claims_flow_run ON evidence_claims(flow_run_id);
CREATE INDEX idx_evidence_claims_step ON evidence_claims(flow_step_run_id);

CREATE TABLE evidence_citations (
  citation_id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES evidence_claims(claim_id),
  excerpt_id TEXT NOT NULL REFERENCES evidence_excerpts(excerpt_id),
  flow_run_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  support_type TEXT NOT NULL CHECK (support_type IN ('supports','refutes','mentions','background')),
  agent_certainty REAL,                       -- 0..1; agent's self-rating at extraction time
  created_at INTEGER NOT NULL,
  UNIQUE (claim_id, excerpt_id)               -- one edge per (claim, excerpt) pair
);
CREATE INDEX idx_evidence_citations_claim ON evidence_citations(claim_id);
CREATE INDEX idx_evidence_citations_excerpt ON evidence_citations(excerpt_id);

CREATE TABLE evidence_conflicts (
  conflict_id TEXT PRIMARY KEY,
  claim_a_id TEXT NOT NULL REFERENCES evidence_claims(claim_id),
  claim_b_id TEXT NOT NULL REFERENCES evidence_claims(claim_id),
  flow_run_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  detection_method TEXT NOT NULL CHECK (detection_method IN ('embedding_distance','nli','rule','manual')),
  confidence REAL NOT NULL,                   -- detector's confidence in the contradiction
  review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending','confirmed','dismissed','superseded')),
  approval_request_id TEXT REFERENCES agent_approval_requests(approval_id),
  detected_at INTEGER NOT NULL,
  resolved_at INTEGER,
  CHECK (claim_a_id <> claim_b_id),
  UNIQUE (flow_run_id, claim_a_id, claim_b_id)
);
CREATE INDEX idx_evidence_conflicts_flow_run ON evidence_conflicts(flow_run_id, review_status);

CREATE TABLE evidence_confidence_signals (
  signal_id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id TEXT NOT NULL REFERENCES evidence_claims(claim_id),
  flow_run_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  signal_kind TEXT NOT NULL CHECK (signal_kind IN
    ('source_count','source_freshness','source_reputation','agent_self_rating','feedback_approval','feedback_rejection')),
  signal_value REAL NOT NULL,                 -- normalized 0..1 (negative for rejection)
  weight REAL NOT NULL,                       -- as-of weight; recompute uses this
  emitted_at INTEGER NOT NULL,
  source_id TEXT REFERENCES evidence_sources(source_id),  -- when signal traces to one source
  meta_json TEXT
);
CREATE INDEX idx_evidence_confidence_signals_claim ON evidence_confidence_signals(claim_id, emitted_at);

-- Reputation table separate so cold-start defaults can be queried without scanning signals
CREATE TABLE evidence_domain_reputation (
  org_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  trust_score REAL NOT NULL DEFAULT 0.5,      -- 0..1; 0.5 cold-start neutral
  approval_count INTEGER NOT NULL DEFAULT 0,
  rejection_count INTEGER NOT NULL DEFAULT 0,
  last_updated_at INTEGER NOT NULL,
  PRIMARY KEY (org_id, domain)
);
```

**Why `flow_run_id` denormalized on every row.** The most common evidence query is "give me all entities for flow run X" (Replay & Audit, D9). Joining through claim → citation → excerpt → source on every read would dominate query cost. The denormalization is paid once at write time and read constantly. Org-scope filter (`WHERE org_id = ?`) sits on the same indexes.

**Alternatives considered.**
- *One mega `evidence_items` table with a `kind` discriminator* — rejected per D1 rationale
- *Vectorize-only for excerpts (no D1 row)* — rejected: Vectorize is for semantic queries; replay needs SQL joins
- *Store full source body inline (no R2 path)* — rejected: long-form PDFs and HTML pages routinely exceed D1's 1MB row limit; R2 offload is mandatory (D10)

### D3: Claim extraction — multi-signal, triggered on tool-call boundaries

**Decision.** Extraction is a kernel-side post-hook on `agent_tool_calls` rows that returned search results or model outputs. When a `search.external` / `search.internal` / `search.posts` call completes successfully (and `flags.agentEvidence.enabled`), the kernel enqueues an extraction task. When a `model.invoke` call completes for an agent whose `definition.evidenceExtraction = true`, the kernel does the same on the model output.

The extraction pipeline has four stages, each a pure function over the prior:

```text
ToolCallOutput
    │ stage 1: segment()                         [split into candidate spans]
    ▼
CandidateExcerpt[]   (offset, length, body, vector?)
    │ stage 2: dedupExcerpts()                  [Vectorize topK + entity-match]
    ▼
ExcerptInsert[]       (new rows + reuse-existing references)
    │ stage 3: extractClaims()                  [LLM call via syscall `claim.extract`]
    ▼
CandidateClaim[]      (text, support_type, certainty, excerpt links)
    │ stage 4: dedupClaims()                    [Vectorize topK + entity-match + hash]
    ▼
ClaimInsert[]         (new rows + citations + superseded links)
```

**Multi-signal dedup (D5 from agent-os in spirit).**
- **Semantic.** Vectorize topK=10 against the same Vectorize namespace `agent-evidence:<org_id>` returns candidate near-duplicates. Cosine distance ≤ 0.15 → treat as duplicate
- **Entity-match.** Compare `entities_json` arrays; ≥ 2 named-entity overlap is a strong duplicate signal regardless of vector distance (catches "Anthropic released Claude 4.5" vs "Anthropic shipped Claude 4.5" rewordings where the vector cosine sometimes drifts)
- **Hash.** `claim_hash = sha256(normalize(text))` — exact-match fast path

A new claim is inserted only when all three signals say "novel". A duplicate triggers a new **citation** edge into the existing claim instead, plus a `source_count` confidence signal increment.

**When extraction triggers.**
| Mode | Trigger | Why |
|---|---|---|
| **Per-step (default)** | `flow_step_runs` transitions to `done` for any step that emitted `search.*` or model output | Lowest latency to availability; mirrors the kernel's per-step persistence pattern (`agent-flow` D11) |
| **Batch** | Cron-triggered sweep of `flow_runs` where `evidence_extraction_status = 'pending'` | Backfill when per-step extraction was disabled or fails; recover from extractor outages |
| **On-demand** | `POST /api/admin/evidence/runs/:flowRunId/extract` | Re-extract with a newer model or after a bugfix |

**Extraction itself uses a syscall.** The kernel exposes `claim.extract` as a registered syscall (MCP-compatible). The default implementation is `model.invoke` with a structured-output prompt. Per-org override is possible (point at a fine-tuned model) without touching evidence code.

**Alternatives considered.**
- *Regex / sentence-splitter extraction* — rejected: too brittle for prose; misses entity references entirely
- *Always full-document extraction (no segmentation)* — rejected: long sources OOM the model context; offsets are lost
- *Extract synchronously inside the syscall return path* — rejected: blocks the agent waiting for an LLM call; extraction can take 5–30s per source. Async enqueue is the right shape

### D4: Confidence scoring — weighted-sum, ledger-replayable

**Decision.** Each claim's `confidence_score ∈ [0, 1]` is the normalized weighted sum of its `evidence_confidence_signals` rows. v1 ships with a fixed weight table that's documented to be configurable via `admin_settings` once an operator needs it.

```typescript
type SignalKind =
  | 'source_count' | 'source_freshness' | 'source_reputation'
  | 'agent_self_rating' | 'feedback_approval' | 'feedback_rejection'

const DEFAULT_WEIGHTS: Record<SignalKind, number> = {
  source_count:        0.30,   // log-scaled count of independent supporting sources
  source_freshness:    0.15,   // 1.0 if all sources < 90 days old, decays exponentially
  source_reputation:   0.20,   // mean of supporting sources' domain trust_score
  agent_self_rating:   0.15,   // certainty the agent reported at extraction
  feedback_approval:   0.10,   // sum of positive feedback signals, capped
  feedback_rejection: -0.10,   // sum of negative feedback signals, capped
}

function computeConfidence(signals: ConfidenceSignal[], weights = DEFAULT_WEIGHTS): number {
  const sum = signals.reduce((acc, s) => acc + s.signal_value * (weights[s.signal_kind] ?? 0), 0)
  return Math.max(0, Math.min(1, sum))   // clamp to [0,1]
}
```

The score is materialized on `evidence_claims.confidence_score` after every signal write (recomputed from the ledger; one D1 batch). The `confidence_band` is derived: `score >= 0.75 → 'high'`, `>= 0.5 → 'medium'`, `>= 0.25 → 'low'`, `< 0.25 → 'disputed'`. Any unresolved conflict on a claim overrides the band to `'disputed'` regardless of score.

**v1 starts with one feedback signal.** The artifact approval/rejection event from `agent-artifact` (#7, when it lands; until then, a manual endpoint) emits `feedback_approval` or `feedback_rejection` signals on every claim cited in the approved/rejected artifact. Reputation learning (D5) hangs off the same event.

**Why a ledger and not just a column.** Replayability — when weights change, every claim's score recomputes deterministically by replaying its signals. Stores observability data ("this claim's confidence was driven mostly by reputation, not source count") for free. The materialized column is cache, the ledger is truth.

**Alternatives considered.**
- *Bayesian network over signals* — rejected for v1: harder to explain to the operator, harder to debug, and the marginal gain over weighted-sum is unproven for this domain
- *Per-claim hand-tuned formula* — rejected: defeats the point of having a confidence layer
- *Drop confidence entirely; just show source count* — rejected: source count alone treats a Wikipedia link and a Reddit post as equivalent; reputation is the differentiator

### D5: Source reputation — per-domain trust score, learned from feedback

**Decision.** `evidence_domain_reputation` carries a `trust_score ∈ [0, 1]` per `(org_id, domain)`. Cold start: every new domain begins at `0.5` (neutral). Each feedback signal updates the score via simple Bayesian update:

```typescript
// On approval signal for claim C: every supporting source's domain gets +1 approval
// On rejection: same domains get +1 rejection
function updateTrust(
  prior: { approvals: number; rejections: number },
  event: 'approval' | 'rejection'
): number {
  const a = prior.approvals + (event === 'approval' ? 1 : 0)
  const r = prior.rejections + (event === 'rejection' ? 1 : 0)
  // Beta(α=1+a, β=1+r) posterior mean = (1+a) / (2+a+r)
  return (1 + a) / (2 + a + r)
}
```

This gives Laplace-smoothed convergence: a domain with 10 approvals and 0 rejections sits at ~0.92; with 10 rejections and 0 approvals, ~0.08. Cold-start neutral (0.5) requires no manual seeding.

**Bootstrap option.** Operators may seed initial scores via `admin_settings` key `evidence_reputation_seed_json`: `{"docs.anthropic.com": 0.9, "reddit.com": 0.3}`. The seed is loaded on first read of a domain; subsequent feedback writes the learned score.

**Per-org scope.** Reputation is per `org_id` — one org's "docs.cloudflare.com is gold" doesn't leak to another. v1 is single-org; the schema is multi-tenant from day one to avoid migration debt.

**Alternatives considered.**
- *Global reputation across all orgs* — rejected: violates the multi-tenant scope principle (constraint #3)
- *Reputation per (domain, topic)* — rejected for v1: requires topic classification which adds another extraction layer; revisit if domain-level reputation proves too coarse
- *Manual-only reputation (no learning)* — rejected: defeats the "improves over time" property called out in the proposal
- *External reputation feed (e.g. trust services)* — rejected: introduces a runtime dependency for what is essentially a feedback loop the system can run itself

### D6: Conflict detection — embedding-distance v1, NLI v2 (flagged)

**Decision.** v1 detects conflicts via the same Vectorize namespace already populated for claim dedup: for every newly-inserted claim, query topK=20 against the org's claim vectors. Pairs at **moderate cosine distance** (0.30–0.55 — close enough to be on-topic, far enough to not be a duplicate) are candidates. A rule-based filter applied to candidate pairs surfaces likely contradictions:

1. **Negation rule.** Both claims share ≥ 2 entities and one contains a negation token (`not`, `never`, `no`, `without`) absent from the other → contradiction candidate
2. **Numeric mismatch rule.** Both claims share ≥ 1 entity and contain a number; numbers differ by > 10% → contradiction candidate
3. **Polarity rule.** Both claims share entities and contain antonymic adjectives from a small lexicon (released/cancelled, faster/slower, increased/decreased) → contradiction candidate

Candidates passing any rule become `evidence_conflicts` rows with `detection_method='embedding_distance'` and `confidence` set to the rule's calibrated value (0.6–0.85). Candidates failing all rules are dropped — pure cosine distance is too noisy to surface to humans.

**NLI as flagged upgrade.** When `flags.agentEvidence.nliConflicts` is enabled, candidate pairs are additionally passed to a Workers AI NLI model (`@cf/google/gemma-...` or a small zero-shot NLI). NLI verdict `contradiction` writes a row with `detection_method='nli'` and the model's confidence. The two detection methods can co-exist on the same pair (audit trail of all detectors that flagged it).

**When to surface to human.** A conflict with `confidence >= 0.7` and either claim having `confidence_band in ('medium','high')` triggers an approval request via the kernel's `agent_approval_requests` mechanism (D12 below). Lower-confidence detections are visible in the run detail but don't block.

**Alternatives considered.**
- *NLI-only from v1* — rejected: Workers AI inference cost per pair × N² pairs per run is steep; embedding distance + rules filters 95% of pairs cheaply
- *No detection, manual flagging only* — rejected: defeats the differentiator; if the system can't find its own contradictions, the human can't either at scale
- *External NLI service (e.g. fact-check API)* — rejected: same external-dependency objection as D5

### D7: Provider call → evidence linkage

**Decision.** Every `agent_tool_calls` row that produced search results or model output gets a corresponding evidence extraction task. The linkage is tracked at two levels:

1. **Source.** `evidence_sources.retrieved_via_call_id` points back to the originating tool call. One search call producing 10 results writes 10 source rows (post-dedup) all pointing at the same `call_id`
2. **Excerpt.** `evidence_excerpts.extracted_by_call_id` records the *extraction* call (the `claim.extract` syscall invocation), distinct from the original `search.*` call that fetched the content
3. **Claim.** `evidence_claims.extracted_by_call_id` records the extraction call; the chain back to the search call is `claim → citation → excerpt → source.retrieved_via_call_id`

**What's stored vs reconstructable.**

| Stored explicitly | Reconstructable via join |
|---|---|
| `Source.retrieved_via_call_id` | `Claim → first Citation → Excerpt → Source` |
| `Excerpt.extracted_by_call_id` | `Source.flow_run_id`, `Excerpt.flow_run_id`, `Claim.flow_run_id` (denormalized for speed; same value when chain is consistent) |
| `Claim.extracted_by_call_id` | `flow_step_run_id` from `agent_tool_calls.flow_step_run_id` (agent-flow D11 added this column) |
| `Claim.agent_run_id` | `agent_tool_calls → agent_runs.agent_id` for the originating model call |

Storage is **denormalized on the hot read path** (Replay & Audit, D9 — one query, no joins to render a run-detail page) and **normalized for the truth path** (data integrity rests on the FKs, not the denormalized copies).

**Alternatives considered.**
- *Only store the claim → call linkage; reconstruct everything else* — rejected: drilling from a source row "where was this used?" becomes an O(N) scan
- *Event-sourcing pattern (write all linkages to an event log, derive tables)* — rejected for v1: D1 tables-as-truth matches the rest of the platform; deferring derived-state complexity

### D8: Quality policy enforcement boundary

**Decision.** `agent-evidence` stores data and extracts entities. **It does not enforce policy.** The enforcement boundary lives in `agent-policy` (#5), which queries this change's read-only API.

```typescript
// src/lib/agent-evidence/api.ts  (exported for agent-policy)
export interface EvidenceQueryAPI {
  // Per-flow-run rollups, used by policy rules like citation_required / min_sources
  getRunSummary(flowRunId: string): Promise<{
    sourceCount: number
    claimCount: number
    uncitedClaims: { claimId: string; text: string }[]   // claims with zero supporting citations
    staleSources: { sourceId: string; ageDays: number }[] // sources older than threshold
    unresolvedConflicts: { conflictId: string; claimAId: string; claimBId: string }[]
    confidenceDistribution: Record<'low'|'medium'|'high'|'disputed', number>
  }>

  // Per-claim drill-down for policy rules that operate at claim level
  getClaim(claimId: string): Promise<EvidenceClaim>
  getClaimCitations(claimId: string): Promise<EvidenceCitation[]>

  // Conflict review surface
  listPendingConflicts(orgId: string): Promise<EvidenceConflict[]>
}
```

`agent-policy` declares rules like:

```yaml
- rule: citation_required
  appliesTo: [final_claims]
  failWhen: { ">": [{ var: "evidence.uncitedClaims.length" }, 0] }
```

Policy fetches the run summary, evaluates the JSON Logic rule (matching `agent-flow` D3 edge condition language for consistency), and decides pass/fail. **Evidence has no opinion** on what's acceptable; that's the judgment layer.

**Alternatives considered.**
- *Embed policy directly in evidence* — rejected: tangles two changes that have different release schedules; ratification of `citation_required` semantics belongs in the policy spec, not the data spec
- *Evidence exposes "is acceptable?" boolean* — rejected: same problem; smuggles judgment into the data layer

### D9: Replay & Audit — full provenance from `flow_run_id`

**Decision.** One SQL query reconstructs the full provenance chain for a flow run, returning a graph payload the admin console renders directly. Read-side denormalization (D2) makes this single-query, not N+1.

```sql
-- Single query for the run-detail evidence panel
SELECT
  c.claim_id, c.claim_text, c.confidence_score, c.confidence_band,
  cit.citation_id, cit.support_type, cit.agent_certainty,
  e.excerpt_id, e.body_text, e.surrounding_context, e.offset_start, e.offset_end,
  s.source_id, s.uri, s.uri_kind, s.title, s.domain, s.retrieved_at, s.freshness_published_at,
  s.retrieved_via_call_id,
  atc.syscall_name, atc.started_at AS retrieval_call_at,
  flr.step_id AS retrieved_in_step
FROM evidence_claims c
LEFT JOIN evidence_citations cit ON cit.claim_id = c.claim_id
LEFT JOIN evidence_excerpts  e   ON e.excerpt_id = cit.excerpt_id
LEFT JOIN evidence_sources   s   ON s.source_id  = e.source_id
LEFT JOIN agent_tool_calls   atc ON atc.call_id  = s.retrieved_via_call_id
LEFT JOIN flow_step_runs     flr ON flr.step_run_id = c.flow_step_run_id
WHERE c.flow_run_id = ? AND c.org_id = ?
ORDER BY c.extracted_at, cit.created_at;
```

Add per-claim aggregations (citation count, conflict status, confidence breakdown) via a second simple query against `evidence_confidence_signals` and `evidence_conflicts` keyed by the same `flow_run_id`.

**Bundle export.** `GET /api/admin/evidence/runs/:flowRunId/bundle` returns a structured JSON blob (the "Evidence Bundle" called out in the proposal) suitable for ingest into `agent-artifact`:

```json
{
  "flow_run_id": "...",
  "generated_at": "2026-05-17T...",
  "sources": [...],
  "excerpts": [...],
  "claims": [{ "claim_id": "...", "confidence": 0.82, "citations": [...], "conflicts": [...] }],
  "conflicts": [...],
  "reputation_snapshot": { "docs.anthropic.com": 0.91, ... }
}
```

**Alternatives considered.**
- *Reconstruct on-demand from `agent_tool_calls` only* — rejected: extraction is too expensive to redo for every read; the materialized rows are the cache
- *Streaming graph traversal API* — rejected for v1: simple SQL is good enough until run size exceeds ~10MB JSON; revisit for very large runs

### D10: R2 for excerpt blobs > 256KB

**Decision.** Mirror the `agent-memory` blob policy (agent-os D2): inline body fits in D1, anything over 256KB goes to R2.

- **Bucket reuse.** Reuse the `R2_AGENT_MEMORY` bucket from `agent-os` rather than provisioning a new one; key prefix `evidence/` namespaces from memory blobs
- **Key shape.** `evidence/{org_id}/{source_id}/{sha256}.txt` for sources; `evidence/{org_id}/excerpts/{excerpt_id}.txt` for excerpt blobs
- **Inline-or-blob decision.** Made at write time based on the byte length of the normalized body; the D1 row stores either `body_inline` or `body_blob_uri`, never both (CHECK constraint enforces XOR)
- **Read path.** A helper `loadSourceBody(source)` returns `source.body_inline ?? r2Get(source.body_blob_uri)`. Callers don't branch on storage location

**Why 256KB.** Same threshold as `agent-memory` so operators reason about one blob policy, not two. D1's per-row limit is 1MB; 256KB leaves headroom for the rest of the row's columns and SQLite page overhead.

**Alternatives considered.**
- *Always R2* — rejected: small excerpts (typical: 200–800 chars) gain nothing from R2 lookup overhead
- *Always inline* — rejected: long-form PDFs and pages routinely exceed 1MB; D1 write fails
- *New `R2_AGENT_EVIDENCE` bucket* — rejected: one more piece of infra to provision and bill; namespacing under a prefix gives the same isolation

### D11: Feature flags — umbrella + per-feature

**Decision.** Three flag entries land in this change, added to the central `src/lib/config/flags.ts`:

| Flag | Default | Purpose |
|---|---|---|
| `AGENT_EVIDENCE_ENABLED` | `false` | Umbrella; off = no extraction tasks enqueued, evidence tables stay empty (writes guarded at the kernel post-hook), read API returns empty rollups |
| `AGENT_EVIDENCE_NLI_CONFLICTS` | `false` | When off, conflict detection uses embedding-distance + rules only (D6); when on, candidate pairs also pass through Workers AI NLI |
| `AGENT_EVIDENCE_REPUTATION_LEARNING` | `false` | When off, all domain trust scores stay at their seed / default values; feedback signals are ignored. Allows reputation table to populate from seeds before learning is enabled |

```typescript
// flags.ts addition
agentEvidence: {
  enabled: env('AGENT_EVIDENCE_ENABLED', false),
  nliConflicts: env('AGENT_EVIDENCE_NLI_CONFLICTS', false),
  reputationLearning: env('AGENT_EVIDENCE_REPUTATION_LEARNING', false),
},
```

**Per-flow opt-in pattern.** A flow YAML can carry `evidence: { extract: false }` at the top level to disable extraction for that flow (e.g. a `youtube-brief` flow that doesn't deal in factual claims). Default is on when the umbrella flag is on. Per-flow flags follow the same pattern documented in `agent-flow` D13.

**Alternatives considered.** Single big flag rejected per the CLAUDE.md mandate (every advanced technique individually toggleable).

### D12: Integration with kernel `agent-access` — conflict-review approval gate

**Decision.** When conflict detection (D6) finds a high-confidence conflict that should block the run, evidence inserts a row into `agent_approval_requests` (the kernel's existing table from `agent-os` D9) and the flow runtime transitions the flow run to `paused`. The approval payload carries:

```json
{
  "reason": "evidence_conflict",
  "conflict_id": "...",
  "claim_a": { "claim_id": "...", "text": "...", "confidence": 0.82 },
  "claim_b": { "claim_id": "...", "text": "...", "confidence": 0.78 },
  "detection_method": "embedding_distance+rule",
  "supporting_sources_a": [...],
  "supporting_sources_b": [...]
}
```

The kernel's existing approval mechanism handles the gate. Approval resolutions write back to `evidence_conflicts.review_status` (`confirmed` / `dismissed`) plus mark the loser claim as `superseded_by_claim_id` when the operator picks one over the other.

**Boundary.** Evidence inserts the approval request and listens for resolution; the kernel owns the gate lifecycle. Evidence does not implement its own pause/resume flow.

**Alternatives considered.**
- *Build a conflict-specific approval table* — rejected: duplicates the kernel mechanism, splits the operator's "pending approvals" inbox
- *No human-in-the-loop for conflicts* — rejected: false positives are inevitable; auto-resolution risks silently suppressing genuine contradictions

## Risks / Trade-offs

### R1: Claim extraction quality — noise into evidence
**Risk.** LLM-extracted claims may be paraphrased imprecisely, over-segmented, or hallucinate assertions not actually in the source. Noisy claims pollute the confidence layer and create false conflicts.
**Mitigation.** Extraction prompts enforce strict structured output (claim text must be a verbatim or near-verbatim substring of the source excerpt; agent emits its own self-rating). Reject extracted claims whose embedding distance to any source excerpt > 0.45. Manual claim deletion endpoint for operator cleanup. Re-extraction pipeline (D3 on-demand) lets a future model upgrade re-run extraction against past sources without losing the human feedback ledger.

### R2: Vector dedup misses near-duplicates
**Risk.** Two paraphrases of the same claim ("Anthropic released Claude 4.5" / "Claude 4.5 was launched by Anthropic") sometimes sit far enough apart in vector space that cosine ≤ 0.15 misses them. Result: inflated source counts and confidence.
**Mitigation.** Multi-signal dedup (D3) — entity-match catches paraphrases when vectors don't. Hash check catches exact restatements. A periodic batch consolidation job (cron-triggered, gated by a flag) re-runs dedup with tighter thresholds across older claims to merge duplicates discovered after the fact (writes `superseded_by_claim_id` rather than deleting).

### R3: Reputation cold-start bias
**Risk.** First feedback events have outsized effect on trust scores (Beta(1,1) → Beta(1,2) is a big jump). A single rejected report shouldn't tank `docs.anthropic.com` to 0.33.
**Mitigation.** Cold-start prior of `Beta(2, 2)` (mean 0.5, weight=4) rather than `Beta(1, 1)` — a single signal can only move the score by ~0.1. Operator-visible "this domain has < 10 signals" warning in the reputation panel. Seed table (D5) lets an operator pre-load trusted defaults before the first run. Reputation learning is flagged off by default (D11) so operators can populate seeds and dogfood without scoring drift.

### R4: Conflict detection false positives
**Risk.** Embedding-distance + rule heuristics will flag plenty of non-contradictions ("Claude 4.5 is fast" / "Claude 4.5 latency varies by region" — both true, no contradiction). Each false positive that crosses the high-confidence threshold blocks a run.
**Mitigation.** Conservative high-confidence threshold (`>= 0.7`) with both-claims-medium-or-high band requirement (D6). Dismissed conflicts feed back into the rule calibration: the rule's confidence-coefficient is downweighted per dismissal in its (domain, entity) bucket. The NLI upgrade path (`AGENT_EVIDENCE_NLI_CONFLICTS`) is the principled fix; the heuristic v1 ships with a known-acceptable false-positive rate.

### R5: D1 write rate from per-step extraction
**Risk.** A research-heavy flow run might produce 50 sources × 5 excerpts × 2 claims-each + signals + citations = ~1000 D1 writes. At D1's 10 writes/sec/db ceiling (agent-os R1, agent-flow R8), concurrent runs starve each other.
**Mitigation.** Batch all rows produced by one extraction task into a single D1 batch transaction (Sources + Excerpts + Claims + Citations + initial ConfidenceSignals as one batch per source). Per-step batching produces ~10 batches per step instead of ~100 individual writes. Async extraction enqueue means writes are not on the agent's hot path. If still tight, route confidence signals to Analytics Engine (same escape hatch as agent-os R1 for `agent_run_events`).

### R6: R2 cost for excerpt storage
**Risk.** Long-form source pages and PDFs offloaded to R2 accumulate cost over time; old runs hold blobs indefinitely.
**Mitigation.** R2 Class A operations are negligible; storage is the cost line. v1 caps source body size at 5MB (truncate longer sources with a recorded `body_truncated_at` offset). Archive policy (Open Question Q4) decides whether evidence on runs older than N days has its blobs purged. Inline-vs-blob threshold (256KB) is tuned to keep most rows in D1, where storage is free up to row count.

### R7: Multi-tenant scope leak
**Risk.** A query missing the `org_id` filter returns evidence from a different tenant. Vectorize namespaces, Vectorize queries, or R2 keys leaking org id across the wrong boundary breach the multi-tenant constraint.
**Mitigation.** Every evidence helper function requires `orgId` as the first argument (typed, not optional). Vectorize namespace is `agent-evidence:<org_id>` — different orgs use different namespaces, queries can't accidentally cross. R2 keys are `evidence/{org_id}/...`. Vitest tests assert that a query for org A never returns rows from org B even when injected with crafted inputs (negative tests on every read API).

### R8: Extraction model drift breaks confidence
**Risk.** A model upgrade changes extraction phrasing; claims extracted under model v2 don't match the `claim_hash` of claims extracted under v1. Source counts split, confidence scores shift inexplicably.
**Mitigation.** `evidence_claims` carries `extraction_model_version` (added as a meta column in a v1.1 follow-up if drift becomes observable). Dedup uses semantic + entity-match in addition to hash, so phrasing changes are partially absorbed. Re-extraction pipeline (D3) can normalize older claims to the current model's output on demand.

## Migration Plan

Each step is a single PR, flag-gated, with a parity test on the dogfood flow.

**Step 1 — Schema + read API stubs (no extraction).**
- D1 migration `0014_agent_evidence.sql` (D2)
- `src/lib/agent-evidence/{repo,api,types}.ts` — D1 writers/readers for all six tables, typed via Zod schemas matching the SQL
- Register `AGENT_EVIDENCE_*` flag entries in `src/lib/config/flags.ts`
- Read API (D8) returns empty rollups when the umbrella flag is off
- Vitest tests for repo CRUD via in-memory backend (matches agent-os Resolution Q5 pattern)
- **Rollback.** Drop migration; delete the directory.

**Step 2 — Extraction pipeline (off behind flag).**
- `src/lib/agent-evidence/extraction/{segment,dedup,extract-claims,dedup-claims}.ts` — the four-stage pipeline (D3)
- Register `claim.extract` syscall (D3) in the central tool registry
- Vectorize namespace `agent-evidence:<org_id>` setup helper
- Unit tests for each pipeline stage with fixture inputs
- **Rollback.** Flag off → no enqueue path; pipeline code dormant.

**Step 3 — Kernel post-hook wiring.**
- Hook into `agent_tool_calls` write path: when `syscall_name` matches `search.*` or `model.invoke` (and flag on, and flow has `evidence.extract != false`), enqueue an extraction task
- Per-step trigger on `flow_step_runs` completion (mode A in D3)
- Batch backfill cron (mode B) registered at `0 4 * * *`
- On-demand endpoint `POST /api/admin/evidence/runs/:flowRunId/extract` (mode C)
- **Rollback.** Flag off → hook is a no-op.

**Step 4 — Confidence + reputation (no learning yet).**
- `src/lib/agent-evidence/scoring/{confidence,reputation}.ts` — weighted-sum (D4) + Beta-update (D5) implementations
- Reputation seed loader (D5)
- Materialize `confidence_score` and `confidence_band` after every signal write
- Feedback endpoint `POST /api/admin/evidence/claims/:claimId/feedback` writes signals; reputation update happens only if `AGENT_EVIDENCE_REPUTATION_LEARNING=true`
- **Rollback.** Reputation table holds neutral defaults; confidence scores still compute from non-feedback signals.

**Step 5 — Conflict detection (embedding-distance v1).**
- `src/lib/agent-evidence/conflicts/{detect,rules}.ts` — Vectorize topK + negation/numeric/polarity rule filter (D6)
- Post-extraction hook runs detection per new claim
- High-confidence conflicts write `agent_approval_requests` rows (D12)
- **Rollback.** Disable hook; conflicts table remains empty.

**Step 6 — Replay/audit endpoints + Evidence Bundle export.**
- `GET /api/admin/evidence/runs/:flowRunId` — run summary (uses `EvidenceQueryAPI.getRunSummary`)
- `GET /api/admin/evidence/runs/:flowRunId/bundle` — full provenance bundle (D9)
- `GET /api/admin/evidence/claims/:claimId` — claim detail with citations + signals
- `GET /api/admin/evidence/conflicts?status=pending` — pending conflict review list
- Admin auth via `requireAdmin` from `agent-foundation`
- **Rollback.** Endpoints return 404 when umbrella flag off.

**Step 7 — Parity test + dogfood on `deep-research`.**
- Run the reference `deep-research` flow (from `agent-flow` D12) with `AGENT_EVIDENCE_ENABLED=true`
- Assert: every source from the search step appears in `evidence_sources`; every numerical claim in the writer's draft has at least one supporting citation; verifier's `coverage_score` correlates with confidence distribution
- Flip `AGENT_EVIDENCE_NLI_CONFLICTS=true` only after baseline NLI cost is measured against the dogfood flow

**Pre-merge verification per step (matches agent-flow Step 7).**
- `pnpm lint` — oxlint clean
- `pnpm build` — astro check + production build
- `pnpm test` — new vitest suite + existing tests
- `pnpm check:references` — internal cross-references unchanged
- Local manual: extract once, view the run-detail evidence panel, confirm provenance chain renders

**Rollback strategy.** Every step is gated by `AGENT_EVIDENCE_ENABLED` or one of its sub-flags. Flipping the umbrella flag to `false` halts extraction; existing data is preserved and inert. D1 tables remain (no destructive operation on rollback).

## Open Questions

### Q1: Which NLI model for conflicts — Workers AI vs external?

**Trade-off.** Workers AI is on-platform (no new credentials, no external billing line, latency stays inside the Cloudflare network). External NLI services (HuggingFace Inference, OpenAI, Anthropic) offer larger / better-tuned models with calibrated confidence scores. The conflict-detection use case demands high precision (false positives block runs), and small Workers AI NLI models may not deliver it.

**Default if probe inconclusive.** Ship D6 v1 (embedding-distance + rules) with the NLI flag off. When enabling NLI, probe Workers AI's `@cf/google/gemma-*` zero-shot NLI first; if precision is unacceptable, evaluate a small external model. Document the decision in a v1.1 follow-up; never bind to a specific model in this change's schema.

### Q2: Should reputation reset on rebuild?

**Trade-off.** A fresh deployment or a major model upgrade may invalidate accumulated reputation (the feedback that built docs.anthropic.com to 0.91 came from a different extraction model and might not reflect current quality). But resetting destroys hard-won signal and demoralizes the operator who curated it.

**Default if probe inconclusive.** **Never reset automatically.** Provide a manual `POST /api/admin/evidence/reputation/reset` endpoint that requires an explicit `confirm: true` and writes an audit log entry. Document a "reset reputation when changing the extraction model materially" guideline. The signals ledger preserves all input, so reset is recoverable by replaying with new weights.

### Q3: Per-flow evidence opt-in vs always-on?

**Trade-off.** Always-on is simpler — operators don't have to remember to enable extraction. Opt-in lets flows that don't deal in factual claims (transcription, summarization of internal docs) skip extraction cost.

**Default if probe inconclusive.** Evidence is **opt-out at the flow level** — extraction runs by default when `AGENT_EVIDENCE_ENABLED=true`; a flow declares `evidence: { extract: false }` to suppress. Default-on matches the differentiator framing (every run is auditable unless explicitly waived); opt-out is the escape hatch. Revisit if extraction cost on extraction-irrelevant flows becomes a measurable percentage of total D1/Vectorize spend.

### Q4: Archive policy for evidence on old runs?

**Trade-off.** Old evidence accumulates D1 rows and R2 blobs indefinitely. After 12 months, a flow run's evidence is rarely queried but still cited by reputation calculations (the trust score "remembers" old approvals). Hard delete loses audit history; soft archive keeps rows but flags them.

**Default if probe inconclusive.** **Soft-archive after 180 days; hard-delete blobs after 365 days.**
- At day 180: a daily cron sets `archived_at` on `evidence_sources` / `evidence_claims` rows whose `flow_run_id`'s parent `flow_runs.finished_at < now - 180d`. Archived rows are excluded from the default read API; reputation calculations still reference them
- At day 365: same cron deletes R2 blobs for archived sources, sets `body_blob_uri = NULL`, sets `body_inline = '[archived]'`. D1 rows remain (provenance chain stays queryable in metadata form)
- Operator override: `evidence.retention_days` on a flow YAML extends the windows for that flow's runs
- The cron, the thresholds, and the override pattern are documented; implementation lands as a follow-up after the first 90 days of dogfood data exists to validate the policy
