# agent-artifact — deferred follow-ups (Phase 10.4.5)

Built in this session: phases 1, 2, 3, 5, 6, 7, plus 8 (regeneration), 9 (admin endpoints), and
4.1.1 (D1 section store). 74/89 tasks; 141 tests green; `AGENT_ARTIFACT_ENABLED` defaults false.

## Blocked — needs agent-evidence (currently 0% built, no source/migration)
- **4.3.1 / 4.3.2 — section-level traceability** (`reconstructSectionProvenance`). Requires the
  `evidence_claims / evidence_citations / evidence_excerpts / evidence_sources` tables and
  agent-evidence's `getProvenanceChain`. The `artifact_sections.claim_ids_json` column + section
  persistence are already in place — only the cross-module provenance JOIN is blocked. Resume when
  agent-evidence ships.
- `evidence_bundle` kind is built as a self-contained schema but is NOT populated from live evidence
  rows yet (same dependency).

## Flow-runtime integration seams (built as injected interfaces; need wiring when env is threaded)
- **2.4.2** `ctx.artifact` — orchestrator must inject the artifact runner into `StepExecutionContext`
  (env/backends threading in run-flow). Adapter `runArtifactStep` + the seam are done + tested.
- **8.2.1** `ReRunStep` — regeneration takes an injected flow-step re-run fn; the admin regenerate
  endpoint returns 501 until it is wired.
- **6.x export approval** — exporters take a structural `ArtifactExportKernel` (requestApproval +
  invokeProvider). Production must adapt the real agent-os kernel + agent-providers routing to it.
  Admin export endpoint returns 501 (no kernel) until wired.

## Deferred binary generation (Phase 7)
- **PDF / PPTX** ship behind their flags as document-model kinds + generator-seam exporters that
  throw `ArtifactExporterDenied('… not configured')` until a Workers-compatible binary `BinaryGenerator`
  (lib or external render service) is injected. Evaluate `@cloudflare/puppeteer` / Browserless (PDF)
  and a PPTX path; then store bytes to R2.

## Ops / production (operator, not code)
- **6.1.2 / 10.2.1** — flip `AGENT_ARTIFACT_R2_OFFLOAD` / `AGENT_ARTIFACT_NOTION` etc. in prod env +
  redeploy, observing the per-exporter rollout order in `.omc/research/agent-artifact-exporter-rollout.md`
  (notion→slack→github_issue→github_pr[1wk]→email). 6.1.1 bucket creation SUPERSEDED — reuse `R2_AGENT_MEMORY`.
- **10.1.x** — opt `flows/deep-research.yaml` into artifact materialization + wire per-flow opt-in in
  the agent-flow runtime.
- **10.3.x** — 7-day dogfood snapshots; **10.4.4** — `openspec archive agent-artifact` ONLY after
  evidence integration + dogfood land. Do NOT archive yet.

## Schema/flag divergences accepted (see agent-artifact-reconciliation.md)
- Followed tasks.md flatter per-exporter flag model over design D11's two-axis (kind × exporter) model.
- Reused `R2_AGENT_MEMORY` (`artifact/` prefix) instead of a new bucket (design D4).
