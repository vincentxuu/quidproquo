> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until `agent-os` and `agent-flow` are merged, deployed, and stable in production.

## Why

The Gateway Console plan (§4.6) identifies evidence/audit as the **single biggest product differentiator** vs. generic agent platforms: every claim in a generated report must trace back to its source, excerpt, retrieval timestamp, and confidence score. Without this, the platform degrades into "yet another report generator" and the trend-research §6 warning about ungoverned agents lands hard. This change builds the evidence layer that makes claims auditable, reproducible, and trustworthy.

## What Changes

- Add an **Evidence Store** keyed by `run_id` with five entity types: `Source` (URL, retrieved_at, content_hash, freshness_score), `Excerpt` (offset/length into source, surrounding context), `Claim` (extracted assertion, agent/step that produced it, supports/refutes relation), `Citation` (claim → excerpt linkage with provenance chain), `Conflict` (two claims that contradict, with confidence delta)
- **Multi-signal claim extraction** — semantic + entity-matching to dedupe claims across sources
- **ConfidenceScore** per claim derived from: number of independent sources, source freshness, source reputation (configurable + learned over time from approval/rejection signal), agent self-rated certainty
- **Source reputation model** — learned from human approval/rejection of artifacts; per-source-domain trust score; feeds back into ranking and confidence
- **Audit trail** — every kernel `ProviderCall` linked to the claims/excerpts it produced; full reconstruction of "how did the system arrive at this claim"
- **Evidence Bundle** as an exportable artifact (JSON), referenced by `agent-artifact` change
- **Quality-policy integration** (from `agent-policy`): policies like `citation_required: true` are enforced by checking evidence-store state at end of a flow run; missing citations fail the run with actionable error
- **Conflict review** — when conflicting claims are detected, surface as a human-approvable gate (via `agent-os` access manager)

## Capabilities

### New Capabilities

- `evidence-store`: Persistent store of Source / Excerpt / Claim / Citation / Conflict entities keyed by run; D1-backed with full audit trail
- `claim-extraction`: Multi-signal claim extraction and deduplication across sources; confidence scoring
- `evidence-verification`: Quality-policy enforcement (min_sources, citation_required, conflict_check, stale_source_check); failed checks surface as actionable run errors

## Dependencies

- `agent-os` (links to `ProviderCall` table; uses access manager for conflict-review approval gates)
- `agent-flow` (evidence lives at the flow-run level)
(Evidence is consumed by `agent-policy` for quality-policy enforcement, but does not depend on it — evidence is pure data + extraction; policy is the judgment layer above.)

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.6 Evidence / Audit Store
- `/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md` findings 4, 6 (handoff with human review, governance as first-class)
- `/Users/xiaoxu/Projects/ai/2026-05-16-agent-os.md` (multi-signal retrieval, evaluation lessons from Amazon's three-layer eval model)
