> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until `agent-os`, `agent-flow`, and `agent-evidence` are stable enough to provide run lineage and claim traceability.

## Why

A flow run's output should not be "a chat message" — it should be a typed, versioned, exportable, regeneratable artifact. The Gateway Console plan (§4.7) lists eight initial artifact types (Markdown report, JSON evidence bundle, Notion page, Slack draft, GitHub issue / PR review summary, CSV, PDF, PPT). Without an artifact layer, flow outputs are stuck in run logs, can't be regenerated from a specific step, can't be diffed, can't be approved before delivery.

## What Changes

- Add an **Artifact Registry** with typed schemas per artifact kind, covering the eight types in Gateway Console §4.7: `markdown_report`, `evidence_bundle` (JSON, references `agent-evidence` rows), `notion_page`, `slack_draft`, `github_issue`, `github_pr_review`, `csv_spreadsheet`, `pdf_export`, `pptx_export`
- **Versioning** — every artifact has `version_id`; new run on the same flow + inputs produces a new version, not a destructive overwrite; `parent_version_id` enables `git`-like history
- **Source traceability** — every artifact section can be linked to the flow step + claims/citations that produced it (consumes `agent-evidence`)
- **Regenerate-from-step** — re-run a single step (with different policy or provider) and patch the affected sections of the artifact, instead of regenerating the whole thing
- **Diff view** — surface line-level differences between two versions of the same artifact
- **Exporters** as a pluggable interface — one per destination (file, Notion, Slack, GitHub, PDF generator, PPTX generator, CSV writer); exporters that perform external writes are gated by `agent-access` approval (irreversible action)
- **Approval status** per artifact (`draft`, `approved`, `rejected`, `published`); approval can be partial (per-section)

## Capabilities

### New Capabilities

- `artifact-registry`: Typed schemas for all nine artifact kinds (markdown_report, evidence_bundle, notion_page, slack_draft, github_issue, github_pr_review, csv_spreadsheet, pdf_export, pptx_export); per-kind validation
- `artifact-versioning`: Version chain per (flow, inputs) pair; parent-version linkage; line-level diff between versions
- `artifact-regeneration`: Re-run a single step and patch the affected artifact sections instead of full regenerate
- `artifact-exporters`: Pluggable exporters covering all nine destinations (file / Notion / Slack / GitHub issue / GitHub PR / CSV / PDF / PPTX); external writes gated by `agent-access` approval

## Dependencies

- `agent-os` (uses storage + access manager for export approval)
- `agent-flow` (artifacts produced by flow steps of type `artifact`)
- `agent-evidence` (artifact sections trace to evidence rows)

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.7 Artifact System
