## Context

After the previous six `agent-*` changes ship — `agent-foundation` (#0), `agent-os` (#1), `agent-providers` (#2), `agent-flow` (#3), `agent-evidence` (#6), `agent-policy` (#5), `agent-artifact` (#7) — the platform has a kernel, a provider router, a flow DSL with conditional edges, a five-entity evidence graph, a six-category policy engine, and a versioned artifact store. **None of it is operable by a human without `curl`.** The only UI surface that exists is the minimal admin inspect API from `agent-os` D13 (list runs, cancel, approve) which renders no pages.

The existing admin surface at `src/pages/admin/` already follows a clean pattern: each top-level concern is one Astro page under a shared `AdminLayout.astro` (sidebar nav grouped by section — `Monitor / Content / Insight / AI / System` — with `qp` brand mark, sticky header, and section-scoped color tokens from `src/styles/admin-tokens.css`). The current `AI` section already lists `RAG`, `模型供應商`, `Agent Skills`, `追蹤紀錄`, `Deep Research`; the console is the natural successor that **subsumes** the ad-hoc `traces.astro` and `deep-research.astro` pages into one navigable Run Console, plus seven new sibling pages. There are no client-side React islands today — pages are server-rendered Astro with `<script>` islands for interactive controls (see `traces.astro` filter bar). The existing component primitives in `src/components/admin/` (`AdminPanel`, `AdminBadge`, `AdminButton`, `AdminField`, `AdminMetric`, `AdminState`, `AdminTable`) define the visual vocabulary the console must match.

**Why now.** The Gateway Console plan §5 frames the Run Console as the product's primary surface: "users should not face a blank chat — they should pick a flow, fill inputs, watch the timeline, review evidence, approve the artifact." Without it, every flow run requires `curl`-ing `/api/admin/flows/.../run`, polling `flow_runs` with SQL, and reading `evidence_claims.claim_text` rows in the terminal. This change makes the kernel + flow + evidence + artifact layers usable.

**Stakeholders.**
- **Admin operator** (primary) — picks a flow, fills inputs, watches the timeline, reviews evidence, approves artifacts. Wants one URL for everything.
- **Approval reviewer** (could be the same operator on phone) — gets pinged when a flow pauses on `human_approval`; needs a one-tap approve/reject from a phone screen with enough context (action + payload + supporting evidence) to decide.
- **Platform engineer** — edits flow YAML in a PR or in the visual editor; needs lossless YAML ↔ DAG round-trip so the source of truth stays one file.
- **Future RBAC author** — adds users, assigns roles, audits "who ran X, who approved Y" without writing SQL.

**Constraints.**
1. **No regression of existing admin pages.** `/admin`, `/admin/rag`, `/admin/providers` (existing), `/admin/jobs`, `/admin/traces`, `/admin/deep-research`, `/admin/content-pipelines`, `/admin/agent-skills`, `/admin/settings` all keep working. The console adds new routes under `/admin/console/` — no path conflicts, no shared state outside auth.
2. **Match existing visual vocabulary.** Same `AdminLayout.astro`, same `AdminPanel`/`AdminBadge`/`AdminTable` primitives, same color tokens, same nav group conventions. No alternative design system; no Tailwind, no shadcn — those are not in the repo.
3. **Cloudflare Workers compatibility.** Every page renders SSR; client islands are small (≤ 200 KB gzipped per page) and lazy-loaded; SSE works through the Workers runtime; no Node-only libraries in the client bundle.
4. **Bounded blast radius.** Umbrella flag `AGENT_CONSOLE_ENABLED=false` makes every console route return 404; per-page flags (`AGENT_CONSOLE_FLOW_EDITOR`, `AGENT_CONSOLE_RBAC`, `AGENT_CONSOLE_COST_DASHBOARD`, etc.) allow phased rollout. Read-only views land before mutation actions; RBAC and visual editor ship last (D14).
5. **Builds on, never duplicates, prior changes.** The console is a thin presentation layer over the admin APIs already shipped by `agent-os` D13, plus new read-only aggregations added here. No new business logic about runs/evidence/artifacts/policies/providers — those rules live in their owning change.

## Goals / Non-Goals

**Goals**
- Eight pages under `src/pages/admin/console/` matching the eight capabilities in the proposal — full route table in D1
- Real-time run timeline via SSE over the Cloudflare Workers runtime; reconnect strategy; documented event types
- Visual flow editor that round-trips YAML losslessly (preserves comments, key ordering, and anchor references) — React Flow as the canvas library, integrated as an Astro client island
- RBAC schema (users / roles / permissions / audit log) layered onto the existing session auth without breaking it; per-flow / per-policy / per-provider grants
- Cost dashboard combining pre-aggregated nightly rollups with a live last-24h overlay
- Evidence viewer that renders the full claim → citation → excerpt → source chain from the `agent-evidence` D9 single-query bundle; surfaces conflicts and confidence bands
- Artifact viewer with version diff, approve / reject / edit-and-approve, and export action gated by the kernel approval mechanism
- Streaming UX for long-running runs (partial output rendered as it arrives, cancel always available)
- Mobile-responsive enough for approval taps from a phone; WCAG 2.1 AA keyboard nav and screen-reader labels
- zh-TW primary + en mirror under `/admin/console/en/...` matching the existing i18n pattern
- Feature flags layered as umbrella + per-page so partial rollout is the default

**Non-Goals**
- New business logic about runs, evidence, artifacts, policies, or providers (each lives in its owning change; the console is presentation only)
- Replacing the existing admin pages outside `/admin/console/*` — `/admin/traces`, `/admin/deep-research`, `/admin/jobs`, `/admin/rag` keep working unchanged
- Multi-tenant UI (single org for now; RBAC is intra-org)
- Native mobile apps — responsive web only
- Offline mode for approvals (Open Question Q3)
- Rich text artifact editing inside the console (artifact bodies are display-only with side-by-side diff; edit-and-approve modifies metadata + applies a small text patch, not a full WYSIWYG)
- A separate component library extracted as an npm package — primitives stay in `src/components/admin/` and are project-local
- Per-page theming or operator-customizable dashboards
- Real-time collaborative editing of flow YAML

## Decisions

### D1: Astro routes under `src/pages/admin/console/` — eight pages mirroring the eight capabilities

**Decision.** Eight Astro routes (plus an English mirror under `/admin/console/en/`) ship in this change, each backed by one or more API endpoints under `src/pages/api/admin/console/`. The route table:

| Route | Capability | Purpose | Data source |
|---|---|---|---|
| `/admin/console` | `console-flow-selector` | Pick a flow + preset, fill inputs, view strategy summary, launch run | `GET /api/admin/flows`, `GET /api/admin/flow-presets` |
| `/admin/console/runs` | `console-run-timeline` | List all flow runs with status / cost / duration filters | `GET /api/admin/flow-runs?status=&flow=&from=&to=` |
| `/admin/console/runs/[runId]` | `console-run-timeline` | Step-by-step timeline, provider calls, current state, cancel / retry-step / approve | `GET /api/admin/flow-runs/:runId` + SSE `/api/admin/flow-runs/:runId/events` |
| `/admin/console/runs/[runId]/evidence` | `console-evidence-viewer` | Source → excerpt → claim → citation graph for the run; conflict tray | `GET /api/admin/evidence/runs/:runId/bundle` (from `agent-evidence` D9) |
| `/admin/console/runs/[runId]/artifacts/[artifactId]` | `console-artifact-viewer` | Render artifact, version history, diff view, approve / export | `GET /api/admin/artifacts/:artifactId`, `GET /api/admin/artifacts/:artifactId/versions` |
| `/admin/console/flows` | `console-flow-editor` + `console-management-pages` | Flow CRUD; visual editor for `[flowId]`; YAML / DAG toggle | `GET /api/admin/flows`, `PUT /api/admin/flows/:flowId` |
| `/admin/console/providers` | `console-management-pages` | Provider health dashboard, credential management, fallback chain editor | `GET /api/admin/providers`, `GET /api/admin/providers/health` |
| `/admin/console/policies` | `console-management-pages` | Policy library; create / edit / clone; violation viewer | `GET /api/admin/policies`, `GET /api/admin/policy-violations` |
| `/admin/console/cost` | `console-cost-dashboard` | Per-flow / per-policy / per-user spend over time | `GET /api/admin/cost/rollups?dim=&range=` |
| `/admin/console/rbac` | `console-rbac` | Users / roles / permissions / audit log | `GET /api/admin/rbac/users`, `GET /api/admin/rbac/audit?...` |

(Cost dashboard and RBAC are listed separately because they have distinct routes even though they belong to two of the eight capabilities; `console-flow-selector` and `console-management-pages` overlap on the flows page.)

The console is added to the existing sidebar nav (`src/layouts/AdminLayout.astro:26-39`) as a new `Agent Console` section above the current `AI` section, with one top-level entry "Console" pointing to `/admin/console` (the flow selector). The eight pages are linked from the selector / run-list / detail pages, not as separate sidebar items — keeps the sidebar from doubling in length.

**Alternatives considered.**
- *Single SPA mounted at `/admin/console/*` with client-side routing*. Rejected — breaks the existing Astro SSR pattern; doubles bundle size; harms first-paint; conflicts with the existing AdminLayout server-render flow.
- *Subdomain (e.g. `console.quidproquo.cc`)*. Rejected — splits auth, splits deploy unit, adds a Workers route for no gain; the console is admin, not public.
- *Replace `/admin/traces` and `/admin/deep-research` with console routes*. Rejected for this change — keeps the migration small; deprecation of the legacy pages is a follow-up after the console proves stable. Both pages can coexist; the sidebar order signals which is canonical.

**Rationale.** Pages-as-routes matches the existing admin pattern; eight pages match the eight capabilities; the sidebar gets one new entry, not eight. The English mirror reuses the same Astro pages with locale switching via `Astro.url.pathname.startsWith('/admin/console/en')` (see D13).

### D2: SSE for run timeline streaming — Workers-native, with reconnect and typed event envelope

**Decision.** The run timeline (`/admin/console/runs/[runId]`) subscribes to `GET /api/admin/flow-runs/:runId/events` which returns `Content-Type: text/event-stream`. The endpoint is a Cloudflare Workers handler that opens a `ReadableStream`, polls D1 for new `agent_run_events`, `flow_step_runs`, and `agent_tool_calls` rows since the last sent cursor (initial cursor = `?since=<event_id>`), pushes them as SSE frames, and keeps the stream open until the run reaches a terminal state (`done` / `failed` / `cancelled`) or the client disconnects.

Workers SSE constraints handled:
- Workers handlers can hold a stream open up to the `wall_clock_limit` (default 30s for HTTP; configurable via `compatibility_flags` / Durable Object alarm patterns). The endpoint **rotates** every 25s — the server sends a `retry: 1500` field and closes; the client (using the standard `EventSource` API) automatically reconnects with `Last-Event-ID` set to the last event id it received. The endpoint reads `Last-Event-ID` from headers and resumes from that cursor.
- Each SSE frame includes `id: <event_id>` and `event: <kind>` so the client can dedupe on reconnect and dispatch by type without parsing the JSON payload first.

Event types emitted (consumed by the timeline UI):

| `event:` field | Source | Payload shape |
|---|---|---|
| `step_started` | `flow_step_runs.status='running'` | `{ stepId, stepType, attempt, startedAt }` |
| `step_finished` | `flow_step_runs.status in ('done','failed','skipped')` | `{ stepId, status, durationMs, outputSummary }` |
| `tool_call` | New `agent_tool_calls` row for this run | `{ callId, syscallName, providerId, tokensIn, tokensOut, costUsd, latencyMs }` |
| `state_snapshot` | New `flow_run_state` row | `{ stepBoundary, sizeBytes, writtenAt }` (full state via `GET /api/admin/flow-runs/:runId/state` to keep SSE frames small) |
| `approval_requested` | New `agent_approval_requests` row | `{ approvalId, reason, payloadSummary }` |
| `approval_resolved` | `agent_approval_requests.status` changes | `{ approvalId, status, resolvedBy }` |
| `evidence_emitted` | New `evidence_claims` row for this run | `{ claimId, claimText, confidenceBand }` (capped at 100/sec; backpressure surfaces a counter banner if exceeded) |
| `conflict_detected` | New `evidence_conflicts` row | `{ conflictId, claimAId, claimBId, confidence, reviewStatus }` |
| `run_finished` | `flow_runs.status in ('done','failed','cancelled')` | `{ status, finishedAt, totalCostUsd, errorJson }` — server closes the stream after this |

**Reconnect strategy.** Client uses native `EventSource` (built-in to all evergreen browsers). On disconnect (network blip, 25s rotation, idle 1h), `EventSource` auto-reconnects after the `retry:` interval. The client tracks `lastEventId` from the last `id:` field; the reconnect request sends it via `Last-Event-ID`. Server resumes from that cursor; events emitted between disconnect and reconnect are replayed (D1 query is `WHERE event_id > ?`, so no duplicates and no gaps). After 5 failed reconnects in 60s, the client surfaces a banner "Live updates paused" with a manual reconnect button.

**Alternatives considered.**
- *WebSockets via Durable Objects*. Rejected for v1 — introduces a Durable Object dependency for one feature; SSE is simpler, browser-native, server-push-only (which is all we need; client → server is via separate POST endpoints for cancel/approve/retry), and works through corporate proxies that block WebSocket upgrades.
- *Polling every 2s*. Rejected — UX is choppy; D1 cost balloons under many open run views; battery cost on mobile is noticeable.
- *Server-Sent Events without rotation, relying on Workers Durable Objects to hold stream*. Considered, deferred — adds Durable Objects to the dependency graph for marginal benefit; the 25s rotation + `Last-Event-ID` resume is invisible to users.
- *Cloudflare's `WebSocketPair` directly on Workers*. Rejected for the same reason as WebSockets via DO.

**Rationale.** SSE + `EventSource` + `Last-Event-ID` cursor is the lowest-complexity path that meets Workers' execution model. Every browser supports it; reconnect is transparent; the cursor protocol guarantees no missed events.

### D3: Visual flow editor — React Flow as the canvas library, Astro island integration

**Decision.** The visual flow editor (on `/admin/console/flows/[flowId]?view=visual`) uses **React Flow** (`@xyflow/react`, current stable line) as the DAG rendering canvas, mounted as a `client:only="react"` Astro island. The page server-renders a YAML / Visual toggle bar, the YAML side, and the loading shell; the visual side hydrates lazily when the toggle flips. The page also ships an Astro `client:visible` script for the YAML editor (CodeMirror 6, the same flavor used by upstream Cloudflare projects; bundled inside the page island).

```
┌─────────────────────────────────────────────────────────┐
│ Toolbar  [YAML | Visual]   Save  Validate  History     │
├──────────────────┬──────────────────────────────────────┤
│  YAML            │  Visual (React Flow)                 │
│  ────            │  ┌───┐    ┌──────┐    ┌──────┐       │
│  id: deep-...    │  │pln│──▶│ srch │──▶│  syn │       │
│  steps:          │  └───┘    └──────┘    └──────┘       │
│    - id: plan    │             │                        │
│    - id: search  │             ▼                        │
│  edges: ...      │           ┌──────┐                   │
│                  │           │verify│                   │
│                  │           └──────┘                   │
└──────────────────┴──────────────────────────────────────┘
```

**Why React Flow over alternatives.**

| Library | Bundle (min+gz) | DAG ergonomics | Astro island fit | Verdict |
|---|---|---|---|---|
| **React Flow** (`@xyflow/react`) | ~70 KB core + 30 KB controls | First-class for DAG editors; node/edge types are React components; built-in pan/zoom/minimap; mature ecosystem | Works as a `client:only="react"` island; React is the only runtime dep | **Chosen** |
| Cytoscape.js | ~280 KB core + 60 KB plugins | Excellent for graph visualization; less ergonomic for *interactive* node editing (custom React node panels need manual integration) | Plain JS, easy to mount; no React dep | Rejected — DAG editing UX in Cytoscape requires more glue code than React Flow ships out of the box |
| D3 + custom SVG | tiny | Total control | Total work — pan/zoom/minimap/connection lines all DIY | Rejected — engineering cost is 4–6x React Flow for an inferior result |
| Mermaid | ~200 KB | Render-only; no editing | Static diagrams, not editor | Rejected — wrong tool for the job |
| `dagre` (layout-only) | ~60 KB | Computes layouts; doesn't render | Pairs with one of the above | Used internally by React Flow for auto-layout; not a standalone choice |

**Bundle-size budget.** The flow editor route's client island is the largest in the console at ~150 KB gzipped (React + React Flow + CodeMirror 6 core); other pages stay under 50 KB. The editor page is the only route to pull React into the client bundle (rest of the console is plain Astro + small vanilla `<script>` islands); this trade-off is paid only when an operator opens the editor.

**Integration with Astro.** The editor is a single React component (`FlowEditor.tsx`) imported via `client:only="react"` on the flow detail page. React itself is added as a dependency under `package.json` `devDependencies` for the build; no other page imports React. The YAML <-> AST bridge runs in the browser (the same Zod schema from `agent-flow` is published as a tree-shakeable ESM build).

**Alternatives considered.**
- *Server-side render of the DAG as SVG, edit by clicking nodes that POST patches back*. Rejected — every edit costs a roundtrip; pan/zoom/drag-to-connect cannot be server-driven.
- *Vue Flow or Svelte Flow*. Rejected — adds a second framework runtime to the bundle (no Vue/Svelte anywhere else in the project); React Flow's API parity is sufficient.

**Rationale.** React Flow is the de facto choice for DAG editors in the web ecosystem (n8n, LangGraph Studio, Flowise all use it or a fork). The bundle cost is paid only on the editor page; the rest of the console stays Astro-native and ≤ 50 KB.

### D4: YAML ↔ visual round-trip — `yaml` package AST mode preserves comments and ordering

**Decision.** The YAML ↔ DAG bridge uses the `yaml` package (eemeli/yaml) in **AST mode** (`parseDocument`), not the simpler `parse`/`stringify` JSON-style API. `parseDocument` returns a `Document` whose `contents` is a `YAMLMap` of `Pair`s; each `Pair` carries `key`, `value`, `commentBefore`, `comment`, and source-range info. Editing operations mutate the AST in place; serialization preserves comments, key order, anchor references, block vs flow style, and indentation.

**Round-trip operations.**

| Visual edit | YAML AST mutation | Preservation |
|---|---|---|
| Drag a node to reposition | None (node positions are editor-only metadata; see below) | All YAML preserved |
| Add a step | Insert a new `Pair` at the end of `steps` `YAMLSeq` | Comments above other steps preserved |
| Delete a step | Remove the matching `Pair` from `steps` and any edge referencing it | Comments attached to the deleted step are lost (only comments on the removed node) |
| Rename a step id | Modify the `id` scalar; rewrite every `from:` / `to:` referencing it | Comments preserved |
| Add an edge | Append a new `Pair` to `edges` `YAMLSeq` | Existing edges preserved with comments |
| Change a step param | Mutate the nested scalar | Comments preserved |
| Reorder steps | Reorder `Pair`s in the `steps` `YAMLSeq` | Comments stay attached to their original step (move with the step) |

**Node positions are not in YAML.** React Flow needs `(x, y)` per node; flow YAML has no such field. Two-tier storage:
1. **YAML stays canonical.** Positions are not added to YAML. If the YAML changes outside the editor (PR edit, hand edit), the editor recomputes positions on load using `dagre` auto-layout.
2. **Per-user position cache.** When the editor saves positions, they are written to a separate `console_flow_editor_layouts` row keyed by `(user_id, flow_id, flow_version)`. The next open restores the user's saved layout if present; otherwise auto-layout. The YAML round-trips losslessly because positions never enter it.

**Bidirectional consistency.** Three guard rails:
1. **Compile-on-save.** Every save invokes the agent-flow compiler (D10 of `agent-flow`); a compile error aborts the save with the same error the CLI `pnpm flow:lint` would produce.
2. **Diff preview.** Before save, the editor shows a unified diff between current YAML on disk and proposed YAML; the operator confirms.
3. **No re-render on save.** After save, the visual canvas is **not** re-laid-out from the new YAML — the user keeps their positions; only structural changes (added/removed/renamed nodes) update.

**Edge cases that break the round-trip and how we handle them.**

| Case | Outcome | Mitigation |
|---|---|---|
| Anchor / alias (`&foo` / `*foo`) inside YAML | `parseDocument` preserves them; visual editor renders the referenced node once with a "linked" badge | Documented in editor help: "alias steps are read-only in visual mode; edit the source node" |
| Custom YAML tags (`!!str`, etc.) | Preserved by `yaml` AST; visual editor ignores the tag | No UI affordance; YAML edit retains the tag |
| Comment inside a flow scalar (rare) | Preserved by `yaml` AST | No visual surface; survives round-trip |
| User adds a step type unknown to the editor (e.g. a future `notification` type) | Editor renders it as a generic node with raw JSON params panel | Forward-compat: never silently drop unknown fields |

**Alternatives considered.**
- *Plain `js-yaml.load` + `dump`*. Rejected — `dump` rewrites the file from scratch; comments lost, key order normalized; round-trip is destructive.
- *Roundtrip via JSON intermediate*. Rejected — JSON has no comments; YAML → JSON → YAML loses every comment and idiom. Operators specifically cite comments as the reason they hand-edit.
- *Store visual layout inline in YAML under `x-editor:` keys*. Rejected — pollutes the canonical source; PR diffs flood with layout changes after every drag.

**Rationale.** The `yaml` package AST mode is the only library in the JS ecosystem that round-trips YAML losslessly. Per-user position cache decouples cosmetic state from canonical state.

### D5: RBAC schema — users / roles / permissions, additive over existing session auth

**Decision.** Three new D1 tables + one migration `0018_agent_console_rbac.sql` (slots after `agent-artifact` 0016 and the rollups migration 0017). The existing session auth (`src/lib/auth/session.ts` + `src/pages/api/auth/login.ts`) stays intact; RBAC adds a `user_id` to each session and a permission check on the new console routes. Legacy admin routes (`/admin/traces`, etc.) keep using `isLoggedIn` only (any session = full access — current behavior); console routes layer a permission predicate.

```sql
-- 0018_agent_console_rbac.sql
CREATE TABLE console_users (
  user_id TEXT PRIMARY KEY,                 -- stable id (email-hash or uuid)
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','disabled')) DEFAULT 'active',
  created_at INTEGER NOT NULL,
  last_login_at INTEGER
);

CREATE TABLE console_roles (
  role_id TEXT PRIMARY KEY,                 -- 'admin', 'operator', 'reviewer', 'viewer', custom
  display_name TEXT NOT NULL,
  description TEXT,
  is_system INTEGER NOT NULL DEFAULT 0,     -- system roles cannot be deleted
  created_at INTEGER NOT NULL
);

CREATE TABLE console_user_roles (
  user_id TEXT NOT NULL REFERENCES console_users(user_id),
  role_id TEXT NOT NULL REFERENCES console_roles(role_id),
  granted_at INTEGER NOT NULL,
  granted_by TEXT REFERENCES console_users(user_id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE console_role_permissions (
  role_id TEXT NOT NULL REFERENCES console_roles(role_id),
  permission_key TEXT NOT NULL,             -- e.g. 'flow:deep-research:run', 'policy:*:edit'
  PRIMARY KEY (role_id, permission_key)
);

CREATE TABLE console_audit_log (
  audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES console_users(user_id),
  action TEXT NOT NULL,                     -- 'run.start', 'run.cancel', 'approval.approve', 'flow.edit', 'rbac.grant'
  resource_kind TEXT NOT NULL,              -- 'flow', 'run', 'policy', 'provider', 'artifact'
  resource_id TEXT,
  metadata_json TEXT,                       -- {targetVersion, oldStatus, newStatus, ...}
  at INTEGER NOT NULL
);
CREATE INDEX idx_console_audit_log_user ON console_audit_log(user_id, at DESC);
CREATE INDEX idx_console_audit_log_resource ON console_audit_log(resource_kind, resource_id, at DESC);
```

**Permission key format.** `<resource>:<id-or-wildcard>:<action>`. Wildcards: `*` matches any segment. Examples:
- `flow:*:view` — view all flows
- `flow:deep-research:run` — run only the `deep-research` flow
- `policy:*:edit` — edit any policy
- `console:cost:view` — view the cost dashboard
- `rbac:*:*` — full RBAC admin (typically only on the `admin` role)

**System roles (seeded by migration).**
| Role | Permissions |
|---|---|
| `admin` | `*:*:*` — every permission, including RBAC management |
| `operator` | `flow:*:run`, `flow:*:view`, `run:*:view`, `run:*:cancel`, `approval:*:resolve`, `evidence:*:view`, `artifact:*:view`, `artifact:*:approve`, `policy:*:view`, `provider:*:view`, `cost:*:view` |
| `reviewer` | `run:*:view`, `evidence:*:view`, `artifact:*:view`, `artifact:*:approve`, `approval:*:resolve` |
| `viewer` | `*:*:view` — read-only across the console |

**Integration with existing session auth.** The session record is extended (KV `SESSION` namespace value) with a `userId` field at login time; the existing login flow (`/api/auth/login`) populates `user_id` by looking up `console_users.email`. First-deploy bootstrap: a CLI command `pnpm rbac:bootstrap-admin <email>` creates a `console_users` row with the `admin` role; if no admin exists at login time, the user is granted `admin` automatically (single-user mode) and an audit row is written. This avoids a chicken-and-egg lockout and matches the project's single-developer ops reality.

**Permission check helper.** A new `src/lib/auth/rbac.ts` exports `requirePermission(session, permission)` that throws `RbacForbiddenError` on miss; each console API route calls it before doing work. Permission resolution is cached per-request (one D1 query per request, joined across `user_roles` + `role_permissions`).

**Audit log.** Every mutating action through a console API route writes a `console_audit_log` row before returning (best-effort; failure to write doesn't fail the action but emits a structured warning). The audit log is queryable on the RBAC page.

**Alternatives considered.**
- *Reuse `agent_permissions` (kernel)*. Rejected — that table is per-agent (kernel-side) grants for syscalls; reusing it for console RBAC conflates two different permission models. Separate tables, separate code path.
- *Cloudflare Access for RBAC*. Rejected — Access is for routing; doesn't support per-resource permissions, doesn't integrate with the existing session cookie.
- *Single binary admin/non-admin flag*. Rejected — the proposal explicitly calls out "per-flow / per-policy / per-provider permissions"; binary fails immediately.
- *Casbin or similar policy engine*. Rejected — adds a dependency for what is a 50-line permission resolver against a 5-table schema.

**Rationale.** Additive over existing auth (no behavior change for legacy `/admin/*` pages); wildcards keep permission keys short; system roles cover the four user archetypes the proposal names; the bootstrap-on-empty rule prevents lockout.

### D6: Cost dashboard data — nightly pre-aggregated rollups + live last-24h overlay

**Decision.** The cost dashboard (`/admin/console/cost`) reads from two sources:
1. **`console_cost_rollups`** — a new D1 table populated by a nightly cron (`0 2 * * *`) that aggregates `agent_tool_calls` (and the columns added in `agent-providers` D7: `provider_id`, `provider_category`) into bucketed sums per `(date, flow_id, agent_id, provider_id, policy_id, user_id)`. Each row stores `total_cost_usd`, `total_tokens_in`, `total_tokens_out`, `total_calls`, `total_runs`, `failed_runs`. Live read latency: O(date range) rows, typically < 100 ms for a 30-day view.
2. **Live overlay for last 24h** — for the most recent 24h (which the nightly rollup hasn't yet covered), the dashboard runs the same aggregation query directly against `agent_tool_calls` for the requested dimensions, scoped to `WHERE started_at >= now - 24h`. Live query is bounded by the index on `started_at` so cost stays predictable even as `agent_tool_calls` grows.

```sql
CREATE TABLE console_cost_rollups (
  rollup_id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_bucket TEXT NOT NULL,                -- ISO date YYYY-MM-DD
  dim_flow_id TEXT,
  dim_agent_id TEXT,
  dim_provider_id TEXT,
  dim_policy_id TEXT,
  dim_user_id TEXT,
  total_cost_usd REAL NOT NULL,
  total_tokens_in INTEGER NOT NULL,
  total_tokens_out INTEGER NOT NULL,
  total_calls INTEGER NOT NULL,
  total_runs INTEGER NOT NULL,
  failed_runs INTEGER NOT NULL,
  computed_at INTEGER NOT NULL,
  UNIQUE (date_bucket, dim_flow_id, dim_agent_id, dim_provider_id, dim_policy_id, dim_user_id)
);
CREATE INDEX idx_console_cost_rollups_date ON console_cost_rollups(date_bucket DESC);
CREATE INDEX idx_console_cost_rollups_flow ON console_cost_rollups(dim_flow_id, date_bucket DESC);
```

The cron task is registered alongside the existing daily crons in `wrangler.jsonc` (`triggers.crons`); the handler in `src/lib/agent-console/cost/rollup.ts` is idempotent (UNIQUE constraint allows safe re-run).

**Dashboard panels (initial).**
- Spend over time (per-day line chart, 30 / 90 / 365 day windows)
- Top 10 by `flow_id` / `provider_id` / `policy_id` / `user_id` (selectable dimension)
- Today's live spend (always uses the overlay query, refreshes every 60s)
- Failed-run cost (rollup of `failed_runs * avg(total_cost_usd)`; surfaces "wasted spend" trends)
- Provider mix (stacked area by `provider_id` over time)

**Why rollup + overlay.** Pure live query against `agent_tool_calls` (which grows with every call) becomes slow as the table grows; pure rollup misses today's data until tomorrow. The hybrid gives <100 ms reads for historical and <500 ms for live last-24h.

**Alternatives considered.**
- *Pure live query*. Rejected — D1 scan over millions of `agent_tool_calls` rows is unacceptable; pre-aggregation is standard for any analytics surface.
- *Cloudflare Analytics Engine*. Considered — would be ideal for high-cardinality time-series writes, but adds a separate query API and a second source-of-truth shape. Deferred: revisit if D1 rollup performance shows limits.
- *Rebuild rollup from scratch every night*. Rejected — incremental computation (compute today, append) is faster and cheaper; the UNIQUE constraint allows safe re-run if a day needs recomputation.

**Rationale.** Pre-aggregation is the standard pattern for any analytics dashboard; the live overlay closes the "today's data" gap without scanning the entire raw table. Both shapes use the same dimensions, so panel queries are uniform.

### D7: Evidence viewer rendering — claim → excerpt navigation, sanitized HTML source preview

**Decision.** The evidence viewer (`/admin/console/runs/[runId]/evidence`) consumes the Evidence Bundle from `GET /api/admin/evidence/runs/:runId/bundle` (defined in `agent-evidence` D9) — one HTTP request returns the entire chain. The page renders three panels stitched together:

1. **Claim list (left).** Sortable / filterable by `confidence_band` and conflict status. Each row shows the claim text (truncated to 2 lines) with confidence-band color (high = green, medium = amber, low = red, disputed = orange-with-conflict-icon).
2. **Claim detail (centre).** When a claim is selected, shows full text, all citations (excerpt text + source title + retrieval timestamp), and the per-signal confidence breakdown (from `evidence_confidence_signals`).
3. **Source preview (right).** When an excerpt is clicked, renders the surrounding context (the `surrounding_context` column from `evidence_excerpts`). For HTTP sources, an "Open original" link opens the source URL in a new tab. **No iframe**: source previews are server-side fetched and rendered as sanitized HTML using `DOMPurify` in the SSR layer, then served as static HTML inside the panel. This avoids the iframe sandbox dance and the CSP fight with arbitrary third-party CSS.

**Conflict surface.** Conflicts (rows from `evidence_conflicts` in the bundle) appear as a banner at the top of the page ("3 unresolved conflicts in this run"); clicking expands a list with both claims side-by-side and the detection method (`embedding_distance` / `nli` / `rule`). Pending conflicts that hit the kernel approval gate (agent-evidence D12) get an "Approve / Reject" button inline, posting to `POST /api/admin/agents/approvals/:approvalId/{approve,reject}` (kernel endpoint from agent-os D13).

**Navigation from artifact to evidence.** The artifact viewer (D8) links each claim citation to `/admin/console/runs/:runId/evidence#claim-:claimId`; the evidence page scrolls and highlights that claim. This closes the loop "artifact says X → why → source S retrieved at T".

**Why no iframe.** Three reasons:
1. **CSP conflict.** Many third-party domains set `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`, so the iframe fails silently.
2. **CSS bleed.** Iframe content runs in its own origin; styling, dark mode, link colors all diverge from the rest of the console.
3. **Sanitized HTML is sufficient.** The evidence layer already stored excerpt text + surrounding context; we don't need to re-fetch and render the original page. The "Open original" link covers the rare case where the operator wants the full source.

**Sanitization.** Source bodies stored in `evidence_sources.body_inline` (or fetched from R2 via `body_blob_uri`) pass through `DOMPurify` server-side; only a safe-list of tags survives (`p`, `h1-h6`, `ul`, `ol`, `li`, `a`, `strong`, `em`, `code`, `pre`, `blockquote`, `img` with `src` allow-listed). Scripts, iframes, inline event handlers stripped.

**Alternatives considered.**
- *Iframe with sandbox attribute*. Rejected — see CSP / styling issues above.
- *Render only the excerpt + offset; no source preview*. Rejected — the proposal calls out source preview as a primary feature; "why this claim?" needs visible source context.
- *Open every source in a new tab, no in-app preview*. Rejected — context-switch tax on every claim; defeats the point of having a viewer.

**Rationale.** Sanitized HTML in-app is fast, predictable, and styled consistently; iframes lose to CSP and CSS bleed; in-app preview keeps the operator's attention on the run.

### D8: Artifact viewer rendering — markdown renderer reused, PDF inline viewer, diff via `diff` package

**Decision.** The artifact viewer (`/admin/console/runs/[runId]/artifacts/[artifactId]`) renders different artifact kinds (from `agent-artifact` registry: `markdown_report`, `evidence_bundle`, `notion_page`, `slack_draft`, `github_issue`, `github_pr_review`, `csv_spreadsheet`, `pdf_export`, `pptx_export`) with kind-specific renderers, sharing one chrome (version selector, approval bar, export menu).

| Kind | Rendering |
|---|---|
| `markdown_report` | Reuse the existing post-rendering Markdown pipeline (`src/lib/markdown.ts`-equivalent — the same one that renders `src/content/posts/*.md` posts) for parity with the public site |
| `evidence_bundle` | Pretty-printed JSON tree with collapsible nodes; "Open in evidence viewer" link to `/admin/console/runs/:runId/evidence` |
| `notion_page` | Render the Notion blocks as the same Markdown pipeline (Notion blocks → markdown via the agent-artifact exporter, then through the renderer) |
| `slack_draft` | Slack-style preview (sender avatar placeholder + blocks); export button posts via the action provider after approval |
| `github_issue` / `github_pr_review` | Markdown body + a header showing target repo + labels + assignees |
| `csv_spreadsheet` | Tabular view with sticky header and column virtualization for > 1k rows (off-the-shelf `react-virtual` or vanilla intersection-observer pagination — pick at implementation time based on actual row counts) |
| `pdf_export` | Inline viewer via the browser's native `<embed type="application/pdf">` (works on all evergreen browsers); fallback link "Download PDF" for browsers that don't support inline rendering |
| `pptx_export` | Download-only (no inline preview); thumbnail of slide 1 generated server-side via the exporter |

**Diff view.** Version diff uses the `diff` package (jsdiff), which produces a unified diff array; the page renders it as a side-by-side or unified view (toggle). For markdown_report and notion_page, diff is computed on the markdown source (not the rendered HTML — diffs of rendered HTML are unreadable). For evidence_bundle, diff is computed on the canonicalized JSON.

**Approval workflow.** A bar at the top shows current status (`draft` / `approved` / `rejected` / `published`). Buttons render based on RBAC permission (`artifact:<id>:approve`):
- **Approve** — `POST /api/admin/artifacts/:artifactId/approve` writes status; audit row.
- **Reject** — same with a required reason text area.
- **Edit-and-approve** — opens a modal with the markdown source in a CodeMirror editor; on submit, writes a new artifact version + approves it in one transaction.
- **Export** — opens a destination picker (Notion / Slack / GitHub / file / PDF); the chosen exporter goes through the kernel approval gate (agent-artifact D9 + agent-os D9) as an `irreversible` action; the page polls the approval status and surfaces "Awaiting approval" until resolved.

**Alternatives considered.**
- *Render PDF via PDF.js*. Rejected — adds ~600 KB to the bundle; native `<embed>` works everywhere we care about; PDF.js was the only option when browsers didn't support inline PDFs, which is no longer true.
- *Show rendered HTML diff*. Rejected — see above; markdown source diff is human-readable.
- *Diff library: `diff-match-patch`*. Considered — Google's library has better word-level diffs but the `diff` package is sufficient for line-level and is half the size.

**Rationale.** Reuse existing markdown pipeline = parity with the public site and zero new dependencies for the most-common artifact kind. Native PDF embed = zero bundle cost. The `diff` package = standard, small, well-tested.

### D9: Approval UI workflow — single inbox, three actions, kernel-mediated

**Decision.** All pending approvals (from `agent_approval_requests`, kernel-owned) appear in a dedicated inbox at `/admin/console/runs/approvals` (also surfaced as a badge in the main `/admin/console` header). The inbox row format:

```
[reason]  flow_run_id  requested_at  [Approve] [Reject] [Edit & Approve] [View context]
```

`reason` is the kernel's `agent_approval_requests.reason` field (`irreversible: slack.post`, `evidence_conflict`, `human_approval_step`, etc.) — the type of approval drives the layout of the context panel.

**Three actions.** All three post to existing kernel endpoints (no new business logic):
- **Approve** → `POST /api/admin/agents/approvals/:approvalId/approve` (agent-os D13)
- **Reject** → `POST /api/admin/agents/approvals/:approvalId/reject` with optional reason in body
- **Edit-and-approve** → kernel doesn't have this endpoint; this change adds `POST /api/admin/agents/approvals/:approvalId/approve-with-edit` which atomically updates the approval's `context_json` (the payload the agent will execute) before approving. The kernel re-reads the (now mutated) context on wake-up.

**Race condition handling.** Two approvers click "Approve" simultaneously:
- The kernel's approval endpoint is idempotent on `status='pending'` (only the first request flips it; the second returns `409 Conflict` with the current status).
- The console catches the 409 and refreshes the row; the second approver sees "already approved by <user>".
- Audit log captures both attempts.

**Mobile layout.** The inbox is the primary surface that needs to work on phone (D11). Row collapses to a card with the three action buttons stacked, sized for thumb taps (≥ 44×44 px per Apple HIG / Material spec).

**Streaming wake-up.** When an approval resolves, the SSE stream on the corresponding run timeline emits `approval_resolved`; the run page automatically un-pauses without a refresh.

**Alternatives considered.**
- *Approve inline from anywhere (every page has a pending-approvals tray)*. Considered, deferred — the badge in the header is enough; one centralized inbox keeps the mental model simple.
- *Approve via email link*. Rejected for v1 — requires SMTP credentials; the badge + push-style banner is sufficient for a single-developer org. Revisit when multi-user RBAC sees real use.

**Rationale.** One inbox, three actions, mediated by the kernel = no new state machine. Edit-and-approve is the only new endpoint and it composes existing pieces (update context + approve in one transaction).

### D10: Streaming UX — partial output rendered, cancel always available, optimistic action UI

**Decision.** The run timeline subscribes to SSE (D2) and renders incrementally:
- Steps appear as they start (skeleton card) and fill in as they complete (output summary + cost + duration).
- The current step shows a live spinner and a "Cancel" button that POSTs to `POST /api/admin/agents/runs/:runId/cancel` (kernel endpoint from agent-os D13). The cancel button is **always available** when the run status is in `(pending, running, paused)` — even during a `paused` approval wait. Cancelling a paused run also rejects any open approval requests (kernel-side cascade).
- Provider call rows stream into a "Provider calls" pane as `tool_call` SSE events arrive; the pane is virtualized after 100 rows.
- Partial output: for `agent` steps where the underlying provider supports streaming (LLM token streams), the kernel forwards token deltas as a `step_token_delta` SSE event (added to the type table in D2 as a follow-up at agent-providers integration time — kept off in the initial console ship if the kernel doesn't emit it yet; the page falls back to "output appears on step finish").

**Optimistic UI.** Clicking Cancel immediately marks the step "cancelling…" in the UI; the server confirms via the next SSE event. If the server rejects (e.g. run already finished), the UI rolls back and shows the actual state.

**Retry-step.** When a step is in `failed` status, a "Retry step" button appears next to it. The button POSTs to `POST /api/admin/flow-runs/:runId/steps/:stepId/retry` which the flow runtime resumes from that step (state snapshot restored from `flow_run_state`, see agent-flow D11). The SSE stream picks up the new step events without page reload.

**Cancel guarantees.** Cancel is cooperative (kernel agent-os D7); the UI shows "Cancel requested" until the run actually stops. If a run continues past 60s after cancel, a "Force cancel?" affordance escalates to a hard timeout (sets the run row's `cancel_signal` again with a TTL-bypass flag — Open Question Q3 covers semantics).

**Alternatives considered.**
- *Polling for updates*. Rejected — see D2.
- *Block UI during in-flight action*. Rejected — bad UX for cancel; the operator must always be able to abort.

**Rationale.** SSE + optimistic UI + always-available cancel matches the streaming-chat mental model users already have from other AI tools; the cancel guarantee is the differentiator from "watch a black box".

### D11: Mobile responsive — phone-readable approval taps

**Decision.** The console inherits the existing `AdminLayout.astro` mobile breakpoint (`@media (max-width: 768px)` collapses the sidebar to icons-only). Page-specific responsive rules:

| Page | Mobile adaptation |
|---|---|
| `/admin/console` (flow selector) | Single column; flow cards stack; "Run" button full-width |
| `/admin/console/runs` (list) | Cards instead of table; key fields surfaced (flow + status + cost + time) |
| `/admin/console/runs/[runId]` (timeline) | Step list stacks vertically; provider calls collapse behind a "View calls" disclosure; cancel button sticks to the bottom on scroll |
| `/admin/console/runs/[runId]/evidence` | Three-pane → one-pane swipe deck; claim → tap → detail → tap → source |
| `/admin/console/runs/[runId]/artifacts/[artifactId]` | Markdown renders single-column; diff view falls back to unified (not side-by-side) |
| `/admin/console/flows/[flowId]` | Visual editor is **desktop only** — a banner on mobile says "Open on desktop to edit visually"; YAML view stays available read-only |
| `/admin/console/providers` | Cards |
| `/admin/console/policies` | Cards |
| `/admin/console/cost` | Charts scale to viewport; tables become cards; top-N stays as a list |
| `/admin/console/rbac` | Read-only on mobile; mutations (grant role, edit permissions) gated behind a "Open on desktop" notice for the dangerous actions |

**Approval inbox** (D9) is the explicit mobile target: card layout, 48×48 px action buttons, no horizontal scroll, no modal traps. Test budget: every PR must verify the inbox on a 375×667 viewport (iPhone SE baseline).

**Alternatives considered.**
- *Build a separate mobile app*. Rejected — see Non-Goals.
- *Mobile-first design from scratch*. Rejected — the existing admin chrome is desktop-first; matching it is the constraint.

**Rationale.** Match existing pattern (already mobile-handled in AdminLayout); upgrade the approval-critical path to genuine phone usability; gate desktop-only flows (visual editor, RBAC mutations) behind a clear notice.

### D12: Accessibility — WCAG 2.1 AA, keyboard nav everywhere, ARIA labels

**Decision.** Target WCAG 2.1 AA across all console pages. Concrete commitments:

- **Keyboard navigation.** Every action reachable via keyboard. Tab order matches visual order. Custom widgets (React Flow canvas, CodeMirror editor) expose keyboard shortcuts documented in a `?` overlay.
- **Focus visible.** Inherit `--admin-focus` from `admin-tokens.css` (existing focus ring); never remove it.
- **Color contrast.** Audit on the existing token palette; the brand palette already meets 4.5:1 for body text and 3:1 for large text per its design — confirm via the `web-design-guidelines` skill's automated check before merge.
- **Screen reader labels.** Every icon-only button has `aria-label` (the existing sidebar already does this — `title={item.label}` in `AdminLayout.astro:77`; console reuses this convention). SSE event live regions use `aria-live="polite"` for non-disruptive updates; `aria-live="assertive"` only for run-failed banners.
- **Semantic HTML.** Use real `<button>` / `<a>` / `<table>` / `<form>` — no `div` with onClick. React Flow nodes get `role="button"` + `aria-pressed` + `aria-label`.
- **Reduced motion.** Honor `prefers-reduced-motion` (existing global rule in AdminLayout `@media (prefers-reduced-motion: reduce)` already does this; console inherits).
- **Skip link.** Add a "Skip to main content" link at the top of each console page (currently missing from AdminLayout; this change adds it).

**Audit cost.** Manual screen-reader pass (VoiceOver on macOS, NVDA on Windows) per page before flag-on; automated axe-core check in CI as a pre-merge gate. Issues that block AA are blockers; AAA is aspirational.

**Alternatives considered.**
- *AA on critical pages only, no commitment elsewhere*. Rejected — the proposal commits to accessibility; partial coverage is harder to maintain than uniform commitment.
- *Defer to a follow-up*. Rejected — accessibility retrofit is consistently more expensive than building in; the design wins are small per page and decisive at the program level.

**Rationale.** AA is the industry baseline for any admin tool; the existing AdminLayout already covers most of it; the console inherits and tops up where needed.

### D13: Internationalization — zh-TW primary, en mirror under `/admin/console/en/...`

**Decision.** zh-TW is the primary; English is a mirror at `/admin/console/en/<page>` matching the existing site i18n (`src/pages/en/` mirrors `src/pages/`). The console reuses the existing i18n helpers (`src/i18n/utils.ts`, `src/i18n/ui.ts`) by extending the `ui.ts` translation map with a new `console.*` namespace.

```typescript
// src/i18n/ui.ts (extended)
export const ui = {
  'zh-TW': {
    'console.flow-selector.title': '選擇流程',
    'console.run-timeline.cancel': '取消執行',
    'console.evidence.confidence.high': '高',
    // ...
  },
  en: {
    'console.flow-selector.title': 'Select Flow',
    'console.run-timeline.cancel': 'Cancel Run',
    'console.evidence.confidence.high': 'High',
    // ...
  }
}
```

Locale is resolved from `Astro.url.pathname` (matches the existing pattern). The sidebar `AdminLayout.astro` nav labels stay zh-TW (existing admin doesn't English-mirror today); only the console pages get the English variant — operators who set their browser to English navigate to `/admin/console/en/...` directly or via a language toggle in the page header.

**Per-page mirrors.** Each console page has an English twin (`/admin/console/en/runs/[runId].astro`); the twins import the same component bodies and pass `lang='en'`. Astro's file-based routing handles the URLs.

**Alternatives considered.**
- *Locale negotiation via `Accept-Language` header*. Considered — works for the public site; for admin, explicit path is more predictable (operators sometimes want zh on en account).
- *Defer English to a follow-up*. Rejected — the proposal commits to i18n; deferring would require revisiting every translation later.

**Rationale.** Match the existing i18n pattern; reuse helpers; no new locale machinery.

### D14: Feature flags — umbrella + per-page, default-off, staged rollout matches migration plan

**Decision.** One umbrella + eight per-page flags added to `src/lib/config/flags.ts` (the central flag module from `agent-foundation` D2):

| Flag | Default | Purpose |
|---|---|---|
| `AGENT_CONSOLE_ENABLED` | `false` | Umbrella; off = every `/admin/console/*` route returns 404, every `/api/admin/console/*` endpoint returns 404 |
| `AGENT_CONSOLE_FLOW_SELECTOR` | `false` | Enables `/admin/console` + flow launch |
| `AGENT_CONSOLE_RUN_TIMELINE` | `false` | Enables `/admin/console/runs/*` + SSE |
| `AGENT_CONSOLE_EVIDENCE_VIEWER` | `false` | Enables `/admin/console/runs/:id/evidence` |
| `AGENT_CONSOLE_ARTIFACT_VIEWER` | `false` | Enables `/admin/console/runs/:id/artifacts/*` |
| `AGENT_CONSOLE_FLOW_EDITOR` | `false` | Enables `/admin/console/flows/*` (visual editor) — React Flow island lazy-loaded only when on |
| `AGENT_CONSOLE_RBAC` | `false` | Enables `/admin/console/rbac` and the permission check on console routes (off = legacy session-only check) |
| `AGENT_CONSOLE_COST_DASHBOARD` | `false` | Enables `/admin/console/cost` + the rollup cron |
| `AGENT_CONSOLE_MANAGEMENT_PAGES` | `false` | Enables `/admin/console/providers`, `/admin/console/policies` |

```typescript
// flags.ts addition
agentConsole: {
  enabled: boolEnv('AGENT_CONSOLE_ENABLED', false),
  flowSelector: boolEnv('AGENT_CONSOLE_FLOW_SELECTOR', false),
  runTimeline: boolEnv('AGENT_CONSOLE_RUN_TIMELINE', false),
  evidenceViewer: boolEnv('AGENT_CONSOLE_EVIDENCE_VIEWER', false),
  artifactViewer: boolEnv('AGENT_CONSOLE_ARTIFACT_VIEWER', false),
  flowEditor: boolEnv('AGENT_CONSOLE_FLOW_EDITOR', false),
  rbac: boolEnv('AGENT_CONSOLE_RBAC', false),
  costDashboard: boolEnv('AGENT_CONSOLE_COST_DASHBOARD', false),
  managementPages: boolEnv('AGENT_CONSOLE_MANAGEMENT_PAGES', false),
},
```

**Flag resolution order.** A per-page flag enables that page **only if** the umbrella flag is also on; this avoids accidentally exposing one page when the rest of the console is dark. The check is `flags.agentConsole.enabled && flags.agentConsole.<page>`.

**Alternatives considered.**
- *Single big flag*. Rejected — CLAUDE.md mandate.
- *Per-route file-system gate (delete the page to disable it)*. Rejected — non-reversible without a redeploy.

**Rationale.** Nine flags is the minimum that supports phased rollout in the migration plan order (read views first, mutations second, RBAC + visual editor last).

## Risks / Trade-offs

### R1: React Flow bundle size impact on Workers cold-start and client load
**Risk.** React + React Flow + CodeMirror together push the flow editor page's client bundle to ~150 KB gzipped — large relative to the rest of the console. On Workers, the SSR Worker doesn't ship React (rendered as `client:only`), so cold-start is unaffected; client cold-load over slow mobile networks could feel sluggish.
**Mitigation.** (a) The editor is the only page that loads React; every other console page stays under 50 KB. (b) `client:only="react"` lazy-loads the island only when the editor route is visited. (c) `client:idle` for non-critical parts of the editor (minimap, controls panel) defers their hydration. (d) A "Loading editor…" skeleton avoids layout shift while the bundle arrives. (e) Documented in operator guide: "Editor is a richer surface; expect ~2s load on slow connections. YAML edit in your IDE is always available as the lightweight alternative."

### R2: SSE compatibility with Cloudflare Workers' 30s wall-clock limit
**Risk.** Workers HTTP handlers have a wall-clock limit (default 30s; longer with `compatibility_flags` but still bounded); a long-running flow run can outlast a single SSE stream. The 25s-rotation pattern (D2) handles this but adds reconnect complexity; clients that lose `Last-Event-ID` (e.g. tab discarded) miss events between disconnect and reconnect.
**Mitigation.** (a) The rotation is invisible to the user (browser auto-reconnects via `EventSource`). (b) `Last-Event-ID` is preserved by the browser across rotation. (c) For lost-cursor cases (tab discarded), the client falls back to a full-state refetch (`GET /api/admin/flow-runs/:runId`) on reconnect; D1-stored events ensure no information loss, only latency in catch-up. (d) Documented: SSE is best-effort streaming; the canonical state is D1.

### R3: RBAC migration breaking existing admin auth
**Risk.** Adding `user_id` to the session shape, or layering permission checks on existing routes, breaks the production login flow.
**Mitigation.** (a) RBAC is dark by default (`AGENT_CONSOLE_RBAC=false`); legacy routes are unchanged, console routes fall back to legacy "any session = full access" mode. (b) Session shape change is additive (`userId?: string`); old sessions without it still validate (and resolve to the bootstrap admin under the empty-RBAC rule). (c) The migration `0018_agent_console_rbac.sql` creates empty tables; no data migration on first deploy. (d) `pnpm rbac:bootstrap-admin <email>` is the one-shot setup; until run, RBAC remains permissive even when flagged on. (e) Roll-back: flip the flag off; tables stay populated but unused.

### R4: Visual editor loses YAML comments / ordering despite AST mode
**Risk.** `yaml` AST mode preserves most idioms but edge cases (round-tripping through certain operations, edits to anchored/aliased keys, edits that change the line range of preserved comments) can drop comments or reorder lines.
**Mitigation.** (a) Every save shows a unified diff preview (D4) before write; the operator visually confirms no unintended changes. (b) Auto-save is disabled — explicit save action only. (c) Pre-commit warning if any comment is missing in the saved YAML vs the loaded YAML (CI test against fixture flows that exercise every YAML idiom we support). (d) Documented escape hatch: complex YAML stays editable in any text editor; the visual surface is for common edits.

### R5: Cost dashboard query performance as `agent_tool_calls` grows
**Risk.** The live last-24h overlay query scans `agent_tool_calls` over 24 hours of data; at 10k calls/day, this is fast; at 1M calls/day, it becomes a hot query.
**Mitigation.** (a) Index on `started_at` already in place (from agent-os D3). (b) The overlay query is bounded by an `INNER JOIN` on `flow_runs.started_at >= now - 24h` (small set of recent runs), then aggregated — the cost is proportional to the calls in the last 24h, not the total table size. (c) Cache the overlay result for 60s in KV (per-dimension). (d) Promotion path: if D1 still struggles, move rollups to Cloudflare Analytics Engine (agent-os R1 escape hatch).

### R6: Approval UI race conditions across concurrent reviewers
**Risk.** Two reviewers click "Approve" on the same approval at the same time; or one approves while another is editing (edit-and-approve modal open).
**Mitigation.** (a) Kernel endpoint is idempotent on `status='pending'`; second approver gets 409 with current status (D9). (b) Edit-and-approve takes a row lock (D1 `UPDATE ... WHERE status='pending'`); concurrent edit attempts get a 409 with the current `context_json`. (c) The approval inbox uses SSE to push status changes from other clients; the row updates live, removing the second approver's button before they click. (d) Audit log captures both attempts so race incidents are auditable after the fact.

### R7: Mobile rendering of complex DAGs in the visual editor
**Risk.** A 50-step flow with complex edges is unusable on a phone screen (≤ 375 px wide); pan/zoom on small touchscreens is fiddly.
**Mitigation.** (a) Visual editor is explicitly desktop-only on mobile (D11); the banner directs to YAML view. (b) YAML view on mobile is read-only with line wrapping. (c) For viewing-only on mobile (not editing), an auto-zoomed-to-fit DAG is available as a static preview image generated server-side; the operator can tap a node to see its detail in a card. This preview ships as a v1.1 enhancement, not v1.

### R8: Accessibility audit cost — manual screen-reader pass per page is non-trivial
**Risk.** Eight pages × two locales × multiple states (loading, success, error, empty, mobile) = many states to audit; manual SR testing time is substantial.
**Mitigation.** (a) axe-core in CI as the automated baseline. (b) Per-PR axe-core report posted as a comment. (c) Manual SR pass is required only for first ship of each page (gated to flag-on); subsequent edits use axe-core unless the structure changes. (d) The `fixing-accessibility` skill (already in the repo's skill registry) is invoked as part of the verification checklist before flag-on. (e) Pages designed using the existing primitives (`AdminPanel`, `AdminTable`, etc.) inherit their accessibility properties; only new widgets (React Flow editor, evidence three-pane) need bespoke audits.

## Migration Plan

The plan ships **read-only views first**, then **mutation actions**, then **visual editor + RBAC** last. Each step is one PR, flag-gated, with a documented rollback. The umbrella flag stays `false` until Step 6.

**Step 1 — Console chrome + flow selector (read-only launch).**
- New directory `src/pages/admin/console/` with `index.astro` (flow selector) + English mirror under `src/pages/admin/console/en/index.astro`
- New API endpoints under `src/pages/api/admin/console/` for flow listing (wraps existing `agent-flow` admin endpoints with permission checks)
- Register `AGENT_CONSOLE_*` flag block in `src/lib/config/flags.ts`
- Add "Agent Console" section to `AdminLayout.astro` sidebar (only shows when umbrella flag on)
- Vitest tests for the permission resolver scaffolding (still in passthrough mode; RBAC flag off)
- **Rollback.** Set `AGENT_CONSOLE_ENABLED=false`; routes 404, sidebar entry hidden.

**Step 2 — Run timeline (read-only, SSE).**
- `runs/index.astro` (list) + `runs/[runId].astro` (timeline) + English mirrors
- SSE endpoint `/api/admin/flow-runs/:runId/events` with 25s rotation + `Last-Event-ID` resume (D2)
- Client-side `EventSource` consumer in a small `<script>` island (no React)
- Cancel button surfaced but disabled until Step 4
- **Rollback.** `AGENT_CONSOLE_RUN_TIMELINE=false` returns 404 for run pages; SSE endpoint dark.

**Step 3 — Evidence viewer + artifact viewer (read-only).**
- `runs/[runId]/evidence.astro` consuming `GET /api/admin/evidence/runs/:runId/bundle` (agent-evidence D9)
- `runs/[runId]/artifacts/[artifactId].astro` with markdown / JSON / PDF rendering (D8); diff view via `diff` package
- Sanitized source preview via `DOMPurify` server-side (D7)
- Approval bar in artifact viewer renders status read-only (no buttons yet)
- **Rollback.** Per-page flags off.

**Step 4 — Mutation actions (cancel / approve / retry-step / approve-with-edit).**
- Wire cancel button (Step 2) to `POST /api/admin/agents/runs/:runId/cancel` (kernel endpoint already exists)
- Approval inbox at `/admin/console/runs/approvals` consuming the kernel's pending-approvals endpoint (D9)
- New endpoint `POST /api/admin/agents/approvals/:approvalId/approve-with-edit` (the only new mutation endpoint added in this change; everything else reuses kernel APIs)
- Retry-step endpoint `POST /api/admin/flow-runs/:runId/steps/:stepId/retry` (added in this change; calls into the flow runtime's existing resume-from-step capability)
- Audit log writes on every mutation
- **Rollback.** Mutation endpoints return 404 when respective per-page flags off.

**Step 5 — Management pages (providers, policies) + cost dashboard.**
- `providers.astro` (read-only health + credential listing; credential editing via existing `agent-providers` admin endpoints)
- `policies.astro` (read-only listing + clone; edit via existing `agent-policy` admin endpoints)
- `cost.astro` + `console_cost_rollups` table + nightly cron registration in `wrangler.jsonc` (D6)
- **Rollback.** Per-page flags off; cron handler exits early when flag off.

**Step 6 — Umbrella flag on for production read-only + mutation surface.**
- Flip `AGENT_CONSOLE_ENABLED=true` in production with Steps 1–5 flags on
- 1-week soak before continuing
- **Rollback.** Flip umbrella back to `false`; console disappears.

**Step 7 — RBAC.**
- `0018_agent_console_rbac.sql` migration + seeded system roles (D5)
- `src/lib/auth/rbac.ts` permission resolver
- `console/rbac.astro` users + roles + audit log UI
- `pnpm rbac:bootstrap-admin <email>` CLI script
- Per-route permission checks turned on as `AGENT_CONSOLE_RBAC=true` flips (until then, every console route falls back to legacy "any session = full access")
- **Rollback.** Flag off → legacy auth resumes; tables remain.

**Step 8 — Visual flow editor.**
- `flows/index.astro` (list) + `flows/[flowId].astro` (YAML / visual toggle)
- React + React Flow + CodeMirror added to `package.json`
- `FlowEditor.tsx` React island; `yaml` AST round-trip (D4)
- `console_flow_editor_layouts` table for per-user node positions
- Pre-save diff preview UI
- **Rollback.** `AGENT_CONSOLE_FLOW_EDITOR=false`; YAML view still available read-only via the flows list.

**Pre-merge verification per step (matches `agent-flow` Step 7 pattern).**
- `pnpm lint` — oxlint clean
- `pnpm build` — astro check + production build (verify React added only to editor route bundle)
- `pnpm test` — new vitest suite + existing tests
- `pnpm check:references` — internal cross-references unchanged
- Manual smoke on the page added in the step, both zh-TW and en
- axe-core on the new page; SR pass before flipping the page's flag in production
- For Step 2+: SSE smoke test (open a run, observe events, force a reconnect)
- For Step 7: bootstrap admin → login → permission check exercises (create role, grant, deny, audit)
- For Step 8: round-trip test on every fixture flow YAML (load → no-op save → byte-identical to source)

## Open Questions

### Q1: Which existing UI library / CSS framework does the console match?
**Probe.** Inspected `src/layouts/AdminLayout.astro` (single file, scoped styles + `:global()` overrides + tokens from `src/styles/admin-tokens.css`), `src/components/admin/` (Astro components only — no React, no Vue, no shadcn/ui), `package.json` (no Tailwind, no React on the runtime side, no UI framework). The project uses plain Astro components + scoped CSS + a brand token palette.

**Default if probe inconclusive.** **Match the existing pattern.** No new UI library added except for the visual editor's React island (D3). The console primitives live in `src/components/admin/` alongside the existing ones (extend, don't fork): `AdminPanel`, `AdminBadge`, `AdminTable`, `AdminButton`, `AdminField`, `AdminMetric`, `AdminState`. Any new primitive (e.g. `AdminTimeline`, `AdminEvidenceCard`) lands here. No Tailwind, no shadcn, no design-system overhaul; the brand tokens win.

### Q2: Dark mode support?
**Discussion.** The existing admin chrome doesn't ship a dark theme; all tokens are light. Operators working late at night have asked for dark mode informally, but it's not in any commit history. Adding dark mode means defining a second token palette and auditing every page for contrast in both themes — non-trivial but small per page.

**Default if probe inconclusive.** **Defer to a follow-up.** v1 ships light-only. Tokens are already structured to be theme-swappable (CSS custom properties on `:root`), so the change is one file (`admin-tokens.css` adds `[data-theme="dark"]` overrides) plus a toggle. Revisit when an operator actively asks; document in the operator guide that the theme is light-only for now and that `prefers-color-scheme: dark` is not yet honored.

### Q3: Offline mode for approvals — should approvals queue locally and sync when reconnected?
**Discussion.** Mobile approvals on flaky connections fail today (POST returns network error; the action is lost). A service-worker queue could record the intent and retry on reconnect; this also enables the "approve from train wifi blip" scenario the proposal mentions in passing.

**Default if probe inconclusive.** **Defer to a follow-up.** v1 ships online-only with clear error messaging on POST failure ("Network error, retry"); a retry button stays on the row. Offline queueing would require a service worker, IndexedDB queue, and reconciliation logic for "approval already resolved by someone else while you were offline" — out of scope for v1. Re-evaluate after observing actual offline-failure frequency in dogfood.

### Q4: Force-cancel semantics — when does a 60s-stuck cancel escalate?
**Discussion.** D10 hints at a "Force cancel?" affordance when the cooperative cancel doesn't take. The kernel today (agent-os D7) only supports cooperative cancel via the KV signal; a true force-cancel would require terminating the Worker invocation, which Workers doesn't expose.

**Default if probe inconclusive.** **No true force-cancel in v1.** The escalation affordance sets the KV cancel signal again with a `force=1` flag that the kernel reads as "the next syscall (any syscall) returns AbortError unconditionally"; this short-circuits the agent's loop on its next await. If a run still doesn't stop, it's a CPU-only infinite loop (already R4 of agent-os) and the Worker timeout will kill it. Document the limit in the operator guide; revisit when Workers exposes a preempt primitive.

### Q5: Should the visual editor allow editing sub-flow targets, or only the parent flow's wiring?
**Discussion.** A `sub_flow` step has `flow_id: deep-research` pointing at another flow file. The editor could either treat the sub-flow as a black box (single node) or expand into the parent canvas. Both have ergonomic costs.

**Default if probe inconclusive.** **Black-box rendering with a "Open sub-flow" link.** Double-clicking a sub_flow node navigates to that flow's editor (with a "← back to parent" breadcrumb). This keeps each canvas single-flow-scoped, matches the flow-versioning model in `agent-flow` D5, and avoids the explosion of nodes in deeply nested compositions. Inline expansion can ship as a v2 enhancement if operators ask for it.

## Resolutions

### Q-per-page-flags-retired (2026-05-23, Phase 9.4.3)
Per-page feature flags (`flowSelector`, `runTimeline`, `evidenceViewer`, `artifactViewer`, `management`, `costDashboard`, `flowEditor`, `rbac`) retired from `flags.ts`, `env.ts`, and `wrangler.jsonc`. The umbrella `agentConsole.enabled` remains the single kill-switch. `isPageEnabled()` in `_guard.ts` now always returns `true` when the umbrella is on. All 8 console pages are fully enabled when `AGENT_CONSOLE_ENABLED=true`.
