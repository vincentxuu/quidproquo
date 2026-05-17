> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until all earlier `agent-*` layers expose stable APIs. A minimal admin inspect surface (`/admin/agents` list, run, cancel, logs) ships inside `agent-os` itself; this change builds the full Run Console UI on top.

## Why

The previous six changes build infrastructure that humans need to drive. Without a UI, every flow run requires `curl`-ing an API and reading raw D1 rows. Gateway Console plan (§4.1, §5) makes the Run Console the product's primary surface: "users should not face a blank chat — they should pick a flow, fill inputs, watch the timeline, review evidence, approve the artifact." This change builds that UI on top of the now-stable kernel + flow + policy + evidence + artifact layers.

## What Changes

- Add Astro routes under `src/pages/admin/console/`:
  - `/admin/console` — flow selector (lists available flows + presets; matches Gateway Console §5.1 step 1–3)
  - `/admin/console/runs/[id]` — run timeline (step-by-step progress, provider calls, token cost, current state)
  - `/admin/console/runs/[id]/evidence` — evidence viewer (sources, excerpts, claims, citations, conflicts; consumes `agent-evidence`)
  - `/admin/console/runs/[id]/artifacts/[artifactId]` — artifact viewer + version diff + approve/export actions
  - `/admin/console/flows` — flow management (list, view, edit YAML/JSON)
  - `/admin/console/providers` — provider health + cost dashboard
  - `/admin/console/policies` — policy library
- **Run-time interactions**: cancel a run, retry a single step (without rerunning the whole flow), approve a paused approval-gate, edit policy before next retry
- **Streaming run timeline** via SSE (Cloudflare Workers supports SSE natively); each kernel event surfaces in real-time
- **Visual flow editor** — drag/drop DAG builder that round-trips with the YAML/JSON DSL defined in `agent-flow`; same source of truth, two views
- **Team RBAC** — users, roles, per-flow / per-policy / per-provider permissions; audit log of who ran/approved what
- **Cost dashboard** — per-flow, per-policy, per-user spend breakdown over time
- **Polished, not prototype** — uses existing project UI conventions, accessible, mobile-readable

## Capabilities

### New Capabilities

- `console-flow-selector`: UI for picking flow + preset + filling inputs + viewing strategy summary before launch
- `console-run-timeline`: Streaming run timeline (steps, provider calls, costs, current state); supports cancel / retry-step / approve actions
- `console-evidence-viewer`: Browse sources / excerpts / claims / citations / conflicts for a run; navigate from claim to source
- `console-artifact-viewer`: Render artifacts with version history, diff view, approve / export actions
- `console-flow-editor`: Visual DAG editor that round-trips with the YAML/JSON DSL; same source of truth, two views
- `console-rbac`: Users, roles, per-flow / per-policy / per-provider permissions, audit log
- `console-cost-dashboard`: Per-flow / per-policy / per-user spend over time
- `console-management-pages`: CRUD for flows, providers, policies; provider health dashboard

## Dependencies

- All of `agent-os`, `agent-providers`, `agent-flow`, `agent-policy`, `agent-evidence`, `agent-artifact`

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.1 Web Console, §5 Agent UX, §6.1 MVP scope
