# Tasks — agent-console

Implementation plan for the Run Console UI on top of the kernel + flow + provider + policy + evidence + artifact stack. 9 phases, ~130 tasks. This is the **largest** change in the agent-* sequence: it builds the human surface the Gateway Console plan §5 requires.

`src/pages/admin/` (existing pages: `index.astro`, `content-pipelines.astro`, `rag.astro`, `providers.astro`, `agent-skills.astro`, `deep-research.astro`, `traces.astro`, etc.) and `src/layouts/AdminLayout.astro` define the conventions every new page must follow — top-nav with grouped sections, `requireAdmin`/session redirect, `src/components/admin/Admin*.astro` primitives, `admin-tokens.css` design tokens. Reuse aggressively; do not introduce a parallel component system.

## Pre-requisite

**All of the following must be shipped and stable in production before Phase 1 starts:**

- `agent-foundation` (change #0) — central `Env`, `flags`, `requireAdmin`, `json`/`unauthorized`/`badRequest`, `nowMs/nowIso`, `settings-store`, central `ToolDefinition` + `CostModel`
- `agent-os` (change #1) — kernel (`defineAgent`, `syscall`, `agent-memory`, `agent-scheduler`, `agent-access`, `agent-storage`), `agent_runs`/`agent_run_events`/`agent_tool_calls`/`agent_approval_requests` D1 tables, admin run/cancel/approve endpoints from Phase 1.5
- `agent-providers` (change #2) — `model.invoke` syscall + `search.*` provider routing + `provider_health` rows for the dashboard
- `agent-flow` (change #3) — `flow_definitions`/`flow_versions`/`flow_presets`/`flow_runs`/`flow_step_runs` tables, `runFlow`, durable execution, preset resolver, admin endpoints from agent-flow Phase 3 + 6
- `agent-evidence` (change #4) — sources / excerpts / claims / citations / conflicts tables and read APIs
- `agent-policy` (change #5) — policy library (`policies`, `policy_assignments`) and runtime gates
- `agent-artifact` (change #6) — artifact storage, versioning, approval workflow, export connectors

## Flag state by phase (per-page flags)

Every console page ships behind a dedicated flag so half-built surfaces never go live; the umbrella `agentConsole.enabled` is the master kill-switch.

| Phase | umbrella `agentConsole.enabled` | `console.flowSelector` | `console.runTimeline` | `console.evidenceViewer` | `console.artifactViewer` | `console.management` | `console.costDashboard` | `console.flowEditor` | `console.rbac` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `true` (shell only — no pages yet) | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| 2 | `true` | `true` | `true` | `true` | `true` | `false` | `false` | `false` | `false` |
| 3 | `true` | `true` | `true` | `true` | `true` | `false` | `false` | `false` | `false` |
| 4 | `true` | `true` | `true` | `true` | `true` | `true` | `false` | `false` | `false` |
| 5 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `false` | `false` |
| 6 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `false` |
| 7 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` (admin-only roles seeded) |
| 8 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` |
| 9 | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` | `true` |

Per-page flags retire after Phase 9 archival; the umbrella flag remains the single kill-switch.

---

## Phase 1 — Layout + navigation shell (no functional pages)

**Goal**: Stand up `/admin/console` URL space with the shared layout, top-nav, auth redirect, and 8 placeholder sections — all returning "coming soon" stubs gated by per-page flags so navigation works end-to-end before any feature ships. Reuse `AdminLayout.astro`'s session check pattern and `admin-tokens.css` design language; do not duplicate either.

**Files touched**: ~10 new (`AdminConsoleLayout.astro`, 8 placeholder pages, `_guard.ts`), ~3 modified (`wrangler.jsonc`, `src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm dev` then visit `/admin/console` and the 7 sibling routes — every page renders the shell with the section-active state in the top-nav; unauthenticated users redirect to `/login?next=...`; per-page flag off renders the documented stub.

### 1.1 Flags + env

- [x] 1.1.1 Add `AGENT_CONSOLE_ENABLED`, `AGENT_CONSOLE_FLOW_SELECTOR`, `AGENT_CONSOLE_RUN_TIMELINE`, `AGENT_CONSOLE_EVIDENCE_VIEWER`, `AGENT_CONSOLE_ARTIFACT_VIEWER`, `AGENT_CONSOLE_MANAGEMENT`, `AGENT_CONSOLE_COST_DASHBOARD`, `AGENT_CONSOLE_FLOW_EDITOR`, `AGENT_CONSOLE_RBAC` to `wrangler.jsonc` `vars` block all defaulting to `"false"` except `AGENT_CONSOLE_ENABLED="true"` (shell is harmless without page flags). Extend central `Env` type. Register `agentConsole` sub-block in `src/lib/config/flags.ts` with one field per env var.
  - **Files**: `wrangler.jsonc` (modify — vars block), `src/lib/config/env.ts` (modify — add 9 fields), `src/lib/config/flags.ts` (modify — append `agentConsole` sub-object)
  - **Pattern (design D-flags)**: agent-os Phase 1.1.2; agent-flow Phase 1.1.1 (sibling per-feature flag block)
  - **Verify**: `pnpm wrangler types` regenerates clean; `src/lib/config/flags.test.ts` extended to assert `flags.agentConsole.enabled === true` when env empty (defaults shipped on) and per-page flags default `false`

### 1.2 Layout shell

- [x] 1.2.1 Create `src/layouts/AdminConsoleLayout.astro` mirroring `AdminLayout.astro` structure — same session check via `verifySession`, same redirect-to-login pattern, same `<head>` block, same `admin-tokens.css` import. Top-nav lists the 8 console sections grouped: **Operate** (Flow Selector, Runs), **Inspect** (Evidence, Artifacts), **Manage** (Flows, Providers, Policies), **Observe** (Cost), **Admin** (RBAC). Active-section highlight by matching `Astro.url.pathname.startsWith(section.href)`. Accepts `<Props>` `{ title, section, breadcrumb? }`.
  - **Files**: `src/layouts/AdminConsoleLayout.astro` (create)
  - **Pattern (design D-shell)**: `src/layouts/AdminLayout.astro:1-50` (verbatim session check + redirect); `src/components/Icons.astro` reuse for nav icons
  - **Verify**: Playwright test `tests/console/layout.spec.ts` — boot dev server, navigate to `/admin/console` while logged in, assert 8 nav items render with the correct `[aria-current="page"]` on Flow Selector; while logged out, assert redirect to `/login?next=/admin/console`
- [x] 1.2.2 Add breadcrumb component `src/components/admin/ConsoleBreadcrumb.astro` rendered inside `AdminConsoleLayout` slot when `breadcrumb` prop provided — array of `{ label, href? }`; last item is the current page (no link). Use existing `admin-tokens.css` typography scale.
  - **Files**: `src/components/admin/ConsoleBreadcrumb.astro` (create)
  - **Pattern (design D-shell)**: existing `AdminTable.astro` / `AdminPanel.astro` Astro-component style (server-rendered, no client JS)
  - **Verify**: snapshot test `src/components/admin/ConsoleBreadcrumb.test.ts` — given 3 crumbs returns 2 anchors + 1 `<span aria-current="page">`; **screenshot** at `tests/console/screenshots/breadcrumb.png` exercised in Phase 8

### 1.3 Per-page guard + stub helper

- [x] 1.3.1 Create `src/pages/admin/console/_guard.ts` exporting `ensureConsoleEnabled(pageFlag: keyof FlagsConsole): Response | undefined` — short-circuits with the documented 503 stub Astro response when umbrella `agentConsole.enabled === false` OR `flags.agentConsole[pageFlag] === false`. Mirrors the agent-os `_guard.ts` pattern from agent-os Phase 1.5.8.
  - **Files**: `src/pages/admin/console/_guard.ts` (create)
  - **Pattern (design D-shell)**: agent-os `src/pages/api/admin/agents/_guard.ts`
  - **Verify**: unit test `src/pages/admin/console/_guard.test.ts` — flag off returns a stub Response with the documented "Feature coming in Phase N" body; flag on returns `undefined` so the page renders

### 1.4 8 placeholder pages

- [x] 1.4.1 Create `src/pages/admin/console/index.astro` — Flow Selector placeholder; guard with `console.flowSelector`. Body: `<AdminConsoleLayout title="Flow Console" section="flow-selector"><AdminState kind="empty" message="Flow selector ships in Phase 2.1"/></AdminConsoleLayout>` when flag off.
  - **Files**: `src/pages/admin/console/index.astro` (create)
  - **Pattern (design D-shell)**: `src/pages/admin/index.astro` page-shell style; `AdminState.astro` empty-state primitive
  - **Verify**: Playwright — visit `/admin/console`, assert the layout renders + the empty-state shows the Phase-2.1 message
- [x] 1.4.2 Create `src/pages/admin/console/runs/index.astro` — Runs list placeholder; guard with `console.runTimeline`. Same stub pattern.
  - **Files**: `src/pages/admin/console/runs/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — `/admin/console/runs` renders shell with Runs nav active
- [x] 1.4.3 Create `src/pages/admin/console/evidence/index.astro` placeholder; guard with `console.evidenceViewer`.
  - **Files**: `src/pages/admin/console/evidence/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Evidence nav active
- [x] 1.4.4 Create `src/pages/admin/console/artifacts/index.astro` placeholder; guard with `console.artifactViewer`.
  - **Files**: `src/pages/admin/console/artifacts/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Artifacts nav active
- [x] 1.4.5 Create `src/pages/admin/console/flows/index.astro` placeholder; guard with `console.management`.
  - **Files**: `src/pages/admin/console/flows/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Flows nav active
- [x] 1.4.6 Create `src/pages/admin/console/providers/index.astro` placeholder; guard with `console.management`.
  - **Files**: `src/pages/admin/console/providers/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Providers nav active
- [x] 1.4.7 Create `src/pages/admin/console/policies/index.astro` placeholder; guard with `console.management`.
  - **Files**: `src/pages/admin/console/policies/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Policies nav active
- [x] 1.4.8 Create `src/pages/admin/console/cost/index.astro` placeholder; guard with `console.costDashboard`.
  - **Files**: `src/pages/admin/console/cost/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — Cost nav active
- [x] 1.4.9 Create `src/pages/admin/console/rbac/index.astro` placeholder; guard with `console.rbac`.
  - **Files**: `src/pages/admin/console/rbac/index.astro` (create)
  - **Pattern (design D-shell)**: 1.4.1
  - **Verify**: Playwright route test — RBAC nav active

### 1.5 Shell smoke gate

- [ ] 1.5.1 Run `pnpm dev` and click through every nav item in a real browser; capture a baseline screenshot `tests/console/screenshots/shell-baseline.png` for Phase 8 regression diff.
  - **Files**: `tests/console/screenshots/shell-baseline.png` (create — checked into git as the baseline)
  - **Pattern (design D-shell)**: shell-only baseline
  - **Verify**: screenshot exists; `pnpm exec astro check` clean; `pnpm lint` clean

---

## Phase 2 — Read-only viewers (Flow Selector → Run Timeline → Evidence → Artifact)

**Goal**: Ship the four core read-only surfaces end-to-end with SSE for the run timeline. Every page reads through existing kernel/flow/evidence/artifact APIs — no new backend endpoints. Each page is an Astro server-render shell with a single React (or vanilla) island for the interactive piece (SSE stream, filter chips). Per-page flags flip ON one-at-a-time after smoke.

**Files touched**: ~24 new (4 page shells, 4 islands, 4 component sets, fixtures, parity tests, an SSE endpoint), ~0 modified
**Verification**: each of the 4 surfaces renders against a seeded D1 (run a `deep-research` flow via the agent-flow admin endpoint, then navigate the new pages); Run Timeline shows live updates within ≤2s of a step transition; Playwright spec per surface asserts the documented DOM shape.

### 2.1 Flow Selector page (`/admin/console`)

- [x] 2.1.1 Replace the Phase 1 stub at `src/pages/admin/console/index.astro` with a server-rendered list of flows from `GET /api/admin/flows` (shipped by agent-flow Phase 3.6.1). For each flow render a card showing `name`, `description`, available presets, last-run summary (status + timestamp from `flow_runs` LIMIT 1). Cards link to `/admin/console/runs/launch?flowId=...`.
  - **Files**: `src/pages/admin/console/index.astro` (modify); `src/components/admin/ConsoleFlowCard.astro` (create)
  - **Pattern (design D-selector)**: Gateway Console §5.1 step 1; existing `src/pages/admin/content-pipelines.astro` list-of-pipelines layout
  - **Verify**: Playwright `tests/console/flow-selector.spec.ts` — seed 2 flows, assert 2 cards render with the documented data attributes (`[data-flow-id]`)
- [x] 2.1.2 Build the launch sub-page at `src/pages/admin/console/runs/launch.astro` — given `?flowId=`, render the flow's `FlowInputSchema` as a form via a small React island (`src/components/admin/console/LaunchForm.tsx`). Preset selector populated from `GET /api/admin/flows/:id/presets`. Submit POSTs to `/api/admin/flows/:id/run` and redirects to the new run timeline.
  - **Files**: `src/pages/admin/console/runs/launch.astro` (create); `src/components/admin/console/LaunchForm.tsx` (create — React island)
  - **Pattern (design D-selector)**: Gateway Console §5.1 step 2–3; existing `src/pages/admin/content-pipelines.astro` form pattern; React island via `client:load` directive
  - **Verify**: Playwright — fill the form for `deep-research` with `{topic: "x"}`, click submit, assert redirect to `/admin/console/runs/<id>` and the resulting `flow_runs` row exists in D1
- [x] 2.1.3 Strategy summary panel — when a preset is selected, fetch the preset payload and render a side panel showing `providerRouting`, `retryPolicy`, `budget` deltas vs. the base flow definition. Pure render, no state changes.
  - **Files**: `src/components/admin/console/StrategySummary.tsx` (create — React island)
  - **Pattern (design D-selector)**: Gateway Console §5.1 step 3
  - **Verify**: Playwright — switch between `quick` and `deep` presets, assert the panel rerenders with different model names

### 2.2 SSE backend for live run events

- [x] 2.2.1 Create `GET /api/admin/agents/runs/:runId/events/stream` at `src/pages/api/admin/agents/runs/[runId]/events/stream.ts` — returns `text/event-stream` Response per Cloudflare Workers SSE pattern (`new Response(stream, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' } })`). On open: yield every existing `agent_run_events` row for the run; then poll D1 every 1s with `event_id > lastSeen` and yield deltas. Closes when the run status reaches a terminal state (`done`/`failed`/`cancelled`).
  - **Files**: `src/pages/api/admin/agents/runs/[runId]/events/stream.ts` (create)
  - **Pattern (design D-timeline)**: Cloudflare Workers SSE pattern; agent-os Phase 1.5.4 (`EventLogBackend.listForRun`)
  - **Verify**: vitest mocks `EventLogBackend.listForRun` to return a growing array across polls; integration test connects via `EventSource` polyfill and asserts events arrive in order; Playwright e2e in 2.3.3
- [x] 2.2.2 Create `GET /api/admin/flows/:id/runs/:runId/events/stream` at `src/pages/api/admin/flows/[id]/runs/[runId]/events/stream.ts` — same pattern but joins `flow_step_runs` (status transitions) with `agent_run_events` (per `agent_run_id` from the migration in agent-flow 1.2.3). Yields a unified stream where each event carries `{ kind, stepId?, agentRunId?, payload }`.
  - **Files**: `src/pages/api/admin/flows/[id]/runs/[runId]/events/stream.ts` (create)
  - **Pattern (design D-timeline)**: 2.2.1; cross-table join via agent-flow Phase 1.2.3 lineage column
  - **Verify**: vitest — seed a flow run with 3 step rows and 5 agent events, assert stream emits all 8 events in chronological order

### 2.3 Run Timeline page (`/admin/console/runs/:id`)

- [x] 2.3.1 Build `src/pages/admin/console/runs/[id].astro` — server-renders initial state by calling `GET /api/admin/flows/:id/runs/:runId` (agent-flow Phase 3.6.2) for shell + step list + artifacts, then mounts a React island that opens the SSE stream from 2.2.2.
  - **Files**: `src/pages/admin/console/runs/[id].astro` (create); `src/components/admin/console/RunTimeline.tsx` (create — React island)
  - **Pattern (design D-timeline)**: Gateway Console §5.2; React island for SSE (`client:load`)
  - **Verify**: Playwright `tests/console/run-timeline.spec.ts` — load a `done` run, assert all 10 steps render with their final status badges
- [x] 2.3.2 RunTimeline island renders each step as a row showing: `step_id`, `type`, `status` (badge with kernel color tokens), `latency_ms`, `attempt` number (from agent-flow 2.6.2), expand chevron. Expanding reveals: `inputs_json`, `outputs_json` (collapsible JSON), per-syscall `agent_tool_calls` rows (joined via `agent_run_id`), and any `agent_run_events` for that step.
  - **Files**: `src/components/admin/console/RunTimeline.tsx` (modify); `src/components/admin/console/StepRow.tsx` (create)
  - **Pattern (design D-timeline)**: Gateway Console §5.2 timeline shape; agent-os event-log structure
  - **Verify**: Playwright — expand a step, assert `[data-testid="step-detail"]` contains both `inputs_json` and `outputs_json` text
- [ ] 2.3.3 Live SSE smoke — Playwright test that launches a flow run via the admin API, immediately navigates to its timeline, and asserts that the in-progress step's status transitions to `done` in the DOM within 5s of completing (verifies the SSE stream is wired and the React island re-renders).
  - **Files**: `tests/console/run-timeline-live.spec.ts` (create)
  - **Pattern (design D-timeline)**: live-update gate
  - **Verify**: test runs <30s, asserts `await expect(page.locator('[data-step="plan"][data-status="done"]')).toBeVisible({ timeout: 5000 })`
- [x] 2.3.4 Cost/token rollup header — top of the timeline shows the run's accumulated `tokens_in`/`tokens_out`/`cost_usd` from `SELECT sum(...) FROM agent_tool_calls WHERE run_id IN (...subrun ids...)`. Updates from SSE deltas.
  - **Files**: `src/components/admin/console/RunCostHeader.tsx` (create)
  - **Pattern (design D-timeline)**: Gateway Console §5.2 cost line
  - **Verify**: Playwright — assert header text contains `$0.` and `tokens` after run completes

### 2.4 Runs list page

- [x] 2.4.1 Build `src/pages/admin/console/runs/index.astro` — paginated table of all flow runs (across all flows) joining `flow_runs` + `flow_definitions` for the name. Columns: started_at, flow name, preset, status (badge), duration, cost, dispatched by. Filters: status (chips), flow id (dropdown), date range. Cursor pagination via `?cursor=`.
  - **Files**: `src/pages/admin/console/runs/index.astro` (modify — replace stub); `src/components/admin/console/RunsTable.astro` (create); `src/components/admin/console/RunsFilters.tsx` (create — React island for interactive filters)
  - **Pattern (design D-timeline)**: `AdminTable.astro` reuse; agent-flow Phase 3.6.3 list endpoint
  - **Verify**: Playwright — seed 25 runs, assert 20 rows on page 1 + a `Next` link to `?cursor=...`

### 2.5 Evidence Viewer page (`/admin/console/runs/:id/evidence`)

- [x] 2.5.1 Build `src/pages/admin/console/runs/[id]/evidence.astro` — reads through `GET /api/admin/evidence/runs/:runId` (agent-evidence change). Layout: left rail = source list grouped by domain with conflict count badge; main panel = selected source's excerpts with each excerpt's claims+citations; right rail = conflicts panel.
  - **Files**: `src/pages/admin/console/runs/[id]/evidence.astro` (create); `src/components/admin/console/EvidenceSourceList.astro` (create); `src/components/admin/console/EvidenceExcerptPanel.tsx` (create — island for navigation)
  - **Pattern (design D-evidence)**: Gateway Console §5.3 evidence panel
  - **Verify**: Playwright — seed a run with 3 sources, 8 excerpts, 2 conflicts; assert left rail shows 3 source rows with conflict badge on the conflicted one
- [x] 2.5.2 Claim → source navigation — clicking a citation in the excerpt panel scrolls to and highlights the source row in the left rail; clicking a source row replaces the excerpt panel with that source's excerpts. State persisted in URL `?source=<id>`.
  - **Files**: `src/components/admin/console/EvidenceExcerptPanel.tsx` (modify)
  - **Pattern (design D-evidence)**: Gateway Console §5.3 navigation; URL-driven state for shareability
  - **Verify**: Playwright — click citation `[data-citation-id="..."]`, assert URL updates to `?source=<id>` and the right source highlights
- [x] 2.5.3 Conflicts panel — render each `claim_conflicts` row as a card showing the two conflicting claims side-by-side with their source citations + verdict (`unresolved`/`resolved-by-evidence`/`resolved-by-policy`). No actions yet — read-only.
  - **Files**: `src/components/admin/console/EvidenceConflictsPanel.astro` (create)
  - **Pattern (design D-evidence)**: agent-evidence conflict shape
  - **Verify**: Playwright — assert 2 conflict cards render when 2 conflicts exist in the fixture

### 2.6 Artifact Viewer page (`/admin/console/runs/:id/artifacts/:artifactId`)

- [x] 2.6.1 Build `src/pages/admin/console/runs/[id]/artifacts/[artifactId].astro` — reads `GET /api/admin/artifacts/:artifactId` (agent-artifact change). Renders the artifact based on `kind`: `markdown_report` via remark to HTML inside an `<article class="prose">`; `evidence_bundle` as a structured table; `json_payload` as syntax-highlighted JSON.
  - **Files**: `src/pages/admin/console/runs/[id]/artifacts/[artifactId].astro` (create); `src/components/admin/console/ArtifactRenderer.astro` (create — dispatches by kind)
  - **Pattern (design D-artifact)**: Gateway Console §5.4; reuse existing remark pipeline from `src/plugins/`
  - **Verify**: Playwright — assert `markdown_report` artifact renders as HTML with at least 1 `<h1>` and 1 `<a>`
- [x] 2.6.2 Version history dropdown — `GET /api/admin/artifacts/:artifactId/versions` returns the artifact's version list; render as a dropdown that, on selection, navigates to `?version=N` and re-fetches the body.
  - **Files**: `src/components/admin/console/ArtifactVersionSwitcher.tsx` (create — React island)
  - **Pattern (design D-artifact)**: agent-artifact versioning
  - **Verify**: Playwright — seed 3 versions, assert dropdown has 3 entries, selecting v2 updates `?version=2` and body changes
- [x] 2.6.3 Diff view — when both `?version=N` and `?diff=M` query params present, render a unified diff between version M and N using `diff` package (already a transitive dep) wrapped in `<pre class="diff">` with `.diff-add`/`.diff-del` CSS classes from `admin-tokens.css`.
  - **Files**: `src/components/admin/console/ArtifactDiff.astro` (create); `src/styles/admin-tokens.css` (modify — add `.diff-add` / `.diff-del`)
  - **Pattern (design D-artifact)**: Gateway Console §5.4 diff view
  - **Verify**: Playwright — assert the diff shows added/removed lines for a fixture with known textual delta

### 2.7 Phase gate

- [ ] 2.7.1 Flip per-page flags `console.flowSelector`, `console.runTimeline`, `console.evidenceViewer`, `console.artifactViewer` to `true` in production env vars one-at-a-time after each page's Playwright spec passes; observe 24h per page before flipping the next. Capture screenshots at `tests/console/screenshots/phase2-{selector,timeline,evidence,artifact}.png` for the Phase 8 visual baseline.
  - **Files**: `tests/console/screenshots/phase2-*.png` (create — 4 baselines)
  - **Pattern (design D-shell)**: per-page gradual rollout
  - **Verify**: production smoke after each flip — load the page as a real admin user, assert no console errors, screenshot stored

---

## Phase 3 — Action buttons (cancel run / retry step / approve / reject)

**Goal**: Wire the four user-initiated actions into existing kernel API endpoints. No new backend endpoints — every action calls a route already shipped by agent-os Phase 1.5 (cancel, approve, reject) or a new thin retry-step endpoint. Optimistic UI with rollback on error; toast notifications for confirmation.

**Files touched**: ~8 new (4 action components, 1 toast system, 1 retry-step endpoint, 2 tests), ~2 modified (RunTimeline.tsx, StepRow.tsx)
**Verification**: Playwright clicks each button and asserts (a) the API call fires with correct payload, (b) UI updates within 1s, (c) D1 reflects the change.

### 3.1 Toast system

- [x] 3.1.1 Create `src/components/admin/console/Toast.tsx` — single React context provider mounted in `AdminConsoleLayout.astro`; exposes `useToast()` with `success(msg)`, `error(msg)`, `info(msg)`. Auto-dismisses after 5s; stacked top-right with `aria-live="polite"`.
  - **Files**: `src/components/admin/console/Toast.tsx` (create); `src/layouts/AdminConsoleLayout.astro` (modify — mount provider)
  - **Pattern (design D-actions)**: standard React context toast pattern
  - **Verify**: unit test asserts `success()` adds a toast and removes after 5s with fake timers; **screenshot** baseline `tests/console/screenshots/toast.png`

### 3.2 Cancel run

- [x] 3.2.1 Add Cancel button to `RunCostHeader.tsx` — visible when `run.status === 'running'` or `'paused'`. Click calls `POST /api/admin/flows/:id/runs/:runId/cancel` (shipped by agent-flow Phase 5.3.1). Optimistic UI: flip status to `cancelling`, disable button, show toast on success; revert + error toast on 409 (terminal) or 500.
  - **Files**: `src/components/admin/console/RunCostHeader.tsx` (modify); `src/components/admin/console/CancelRunButton.tsx` (create)
  - **Pattern (design D-actions)**: agent-os Phase 1.5.5 cancel endpoint; optimistic UI
  - **Verify**: Playwright `tests/console/cancel-run.spec.ts` — start a run, click cancel, assert `flow_runs.status` reaches `cancelled` within 10s and the timeline shows the `cancelled` badge

### 3.3 Retry step

- [x] 3.3.1 Create `POST /api/admin/flows/:id/runs/:runId/steps/:stepRunId/retry` at `src/pages/api/admin/flows/[id]/runs/[runId]/steps/[stepRunId]/retry.ts` — re-dispatches a single step against the same run state without restarting the flow. Server: read `flow_step_runs` row, re-invoke the step executor with current state snapshot, write a new `flow_step_runs` row with `attempt = max+1`. Reject if step is not in `failed`/`cancelled` (409); reject if downstream steps have already run (409). Gated by `requireAdmin`.
  - **Files**: `src/pages/api/admin/flows/[id]/runs/[runId]/steps/[stepRunId]/retry.ts` (create); `src/lib/agent-flow/runtime/retry-step.ts` (create — pure retry helper invoked by the endpoint)
  - **Pattern (design D-actions)**: agent-flow Phase 2.6 retry pattern reused at the API surface; agent-os Phase 1.5.x endpoint shape
  - **Verify**: vitest covers (a) retry a failed step → new `flow_step_runs` row with incremented `attempt`, (b) retry a `done` step → 409, (c) retry when downstream `done` exists → 409 with explanatory message
- [x] 3.3.2 Add Retry button to `StepRow.tsx` — visible only when step status is `failed` or `cancelled` AND no downstream step has succeeded. Click POSTs to the 3.3.1 endpoint; on success the SSE stream surfaces the new attempt and the row re-renders.
  - **Files**: `src/components/admin/console/StepRow.tsx` (modify)
  - **Pattern (design D-actions)**: optimistic UI; SSE-driven re-render
  - **Verify**: Playwright — force a step failure in a fixture flow, click Retry, assert a new attempt row appears within 5s

### 3.4 Approve / reject pending approvals

- [x] 3.4.1 Add `src/components/admin/console/ApprovalCard.tsx` rendered inline in the timeline when a `human_approval` step is in `pending` status. Card shows `reason`, `context`, `ttlSeconds` remaining (live countdown), and Approve / Reject buttons. Approve POSTs to `/api/admin/agents/approvals/:approvalId/approve` (agent-os Phase 1.5.7); Reject to `/reject`.
  - **Files**: `src/components/admin/console/ApprovalCard.tsx` (create); `src/components/admin/console/RunTimeline.tsx` (modify — render `ApprovalCard` inline)
  - **Pattern (design D-actions)**: agent-os Phase 1.5.7; agent-flow Phase 4.3 human-approval semantics
  - **Verify**: Playwright `tests/console/approve.spec.ts` — fixture flow with human_approval step, click Approve, assert step status reaches `done` within 5s and SSE drives the timeline re-render
- [x] 3.4.2 Pending Approvals widget on `/admin/console` index — adds a top banner listing the count of all `pending` approvals from `GET /api/admin/agents/approvals?status=pending` (agent-os Phase 1.5.6); each row links directly to the run timeline anchored at the approval step.
  - **Files**: `src/pages/admin/console/index.astro` (modify); `src/components/admin/console/PendingApprovalsBanner.astro` (create)
  - **Pattern (design D-actions)**: operator landing-page visibility
  - **Verify**: Playwright — seed 3 pending approvals, assert banner reads "3 pending approvals" with a link
- [x] 3.4.3 Bulk-resolve modal — banner has a "Resolve all" button that opens a modal listing all pending approvals with per-row Approve/Reject. Submits as parallel POSTs; partial failures surface per-row toasts.
  - **Files**: `src/components/admin/console/BulkApprovalModal.tsx` (create)
  - **Pattern (design D-actions)**: bulk-action UX
  - **Verify**: Playwright — seed 5 pending, open modal, approve 3 + reject 2 in one submit, assert 5 D1 rows updated and 5 toasts surfaced

### 3.5 Phase exit smoke

- [ ] 3.5.1 Run all Phase 3 Playwright specs against staging; record video for the cancel/retry/approve flows at `tests/console/screenshots/phase3-actions.webm`; update `progress.txt`.
  - **Files**: `tests/console/screenshots/phase3-actions.webm` (create); `progress.txt` (modify — append phase line)
  - **Pattern (design D-actions)**: end-to-end action audit
  - **Verify**: video exists; `tail -1 progress.txt` matches `agent-console Phase 3 complete: cancel/retry/approve actions live`

---

## Phase 4 — Management pages (Flows CRUD / Providers + health / Policies library)

**Goal**: Operators can list, create, edit, and disable flows/providers/policies entirely from the UI without touching YAML files or D1 directly. CRUD calls existing admin endpoints. Provider health card shows live provider state from `provider_health` table populated by agent-providers.

**Files touched**: ~14 new (3 page sets with index + detail + editor, provider health card, policy assignment UI), ~0 modified
**Verification**: each page renders against seeded D1; create/edit/delete round-trips reflected in D1; Playwright spec per page.

### 4.1 Flows management

- [x] 4.1.1 Replace stub at `src/pages/admin/console/flows/index.astro` with table of all flows from `GET /api/admin/flows` (agent-flow Phase 3.6.1). Columns: id, name, current version, # active runs, last run timestamp, status (enabled/disabled). Actions: View, Edit, Disable.
  - **Files**: `src/pages/admin/console/flows/index.astro` (modify); `src/components/admin/console/FlowsTable.astro` (create)
  - **Pattern (design D-management)**: `AdminTable.astro` reuse; existing `src/pages/admin/content-pipelines.astro` style
  - **Verify**: Playwright `tests/console/flows-list.spec.ts` — seed 2 flows, assert 2 rows with all columns populated
- [x] 4.1.2 Flow detail page at `src/pages/admin/console/flows/[id].astro` — shows full version history (`flow_versions` rows), inputs schema, current YAML in a read-only Monaco editor (or `<pre>` fallback). Tabs for `Versions` / `Presets` / `Runs` (last 50 runs scoped to this flow via agent-flow Phase 3.6.3).
  - **Files**: `src/pages/admin/console/flows/[id].astro` (create); `src/components/admin/console/FlowVersionList.astro` (create); `src/components/admin/console/FlowPresetList.astro` (create); `src/components/admin/console/FlowYamlPreview.tsx` (create — Monaco island, lazy-loaded)
  - **Pattern (design D-management)**: Gateway Console §5.5
  - **Verify**: Playwright — seed a flow with 3 versions + 2 presets, assert all 3 tabs render expected counts
- [x] 4.1.3 YAML editor page at `src/pages/admin/console/flows/[id]/edit.astro` — Monaco editor pre-filled with current `definition_yaml`; live validation calls `POST /api/admin/flows/validate` (new endpoint) which runs `loadFlow → validateFlowSchema → validateEdges → detectSubFlowCycles` and returns `{ errors: [{path, line, column, message}] }`. Save POSTs to `POST /api/admin/flows/:id/version` (new endpoint) which calls `upsertFlowDefinition` and creates a new `flow_versions` row.
  - **Files**: `src/pages/admin/console/flows/[id]/edit.astro` (create); `src/components/admin/console/FlowYamlEditor.tsx` (create — Monaco island with `client:visible`); `src/pages/api/admin/flows/validate.ts` (create); `src/pages/api/admin/flows/[id]/version.ts` (create — `POST` only)
  - **Pattern (design D-management)**: agent-flow Phase 1.4.3 validator; agent-flow Phase 1.7.1 upsert
  - **Verify**: Playwright — open editor, type invalid YAML, assert error decorations appear with line+column; type valid YAML, save, assert new `flow_versions` row in D1
- [x] 4.1.4 New flow creation at `src/pages/admin/console/flows/new.astro` — empty Monaco editor with a starter template; save creates a brand-new `flow_definitions` row.
  - **Files**: `src/pages/admin/console/flows/new.astro` (create)
  - **Pattern (design D-management)**: agent-flow Phase 1.7.1
  - **Verify**: Playwright — type the Gateway Console §4.2 example, save, assert `flow_definitions` row exists with id `deep-research`

### 4.2 Providers + health dashboard

- [x] 4.2.1 Replace stub at `src/pages/admin/console/providers/index.astro` with table of all providers from `GET /api/admin/providers` (agent-providers change). Columns: provider id, kind (`model` / `search`), routing weight, status (healthy/degraded/down — derived from latest `provider_health` row), p50 latency 24h, error rate 24h, cost 24h.
  - **Files**: `src/pages/admin/console/providers/index.astro` (modify); `src/components/admin/console/ProvidersTable.astro` (create)
  - **Pattern (design D-management)**: Gateway Console §5.6; existing `src/pages/admin/providers.astro` style for rows
  - **Verify**: Playwright `tests/console/providers-list.spec.ts` — seed 3 providers with mixed health, assert badges (`healthy` green, `degraded` yellow, `down` red)
- [x] 4.2.2 Provider detail page at `src/pages/admin/console/providers/[id].astro` — sparkline of latency + error rate over 7 days from `provider_health` rows; recent failure event log; API-key health (masked, last-rotated timestamp). Rotate-key action calls `POST /api/admin/providers/:id/rotate-key` (agent-providers).
  - **Files**: `src/pages/admin/console/providers/[id].astro` (create); `src/components/admin/console/ProviderSparkline.tsx` (create — small canvas-based island, no heavy chart lib)
  - **Pattern (design D-management)**: Gateway Console §5.6
  - **Verify**: Playwright — assert sparkline renders + "Rotate key" button is visible + clicking it triggers POST and surfaces success toast
- [x] 4.2.3 Provider health summary widget on `/admin/console` index — adds a compact 3-line panel showing count of providers per status; failures in last hour. Mirrors the Pending Approvals banner placement.
  - **Files**: `src/pages/admin/console/index.astro` (modify); `src/components/admin/console/ProviderHealthSummary.astro` (create)
  - **Pattern (design D-management)**: operator landing-page visibility
  - **Verify**: Playwright — seed 1 degraded + 2 healthy, assert widget shows "2 healthy · 1 degraded · 0 down"

### 4.3 Policies library

- [x] 4.3.1 Replace stub at `src/pages/admin/console/policies/index.astro` with table of all policies from `GET /api/admin/policies` (agent-policy change). Columns: policy id, kind (`coverage`/`citation`/`freshness`/`budget`/`safety`), version, # assignments. Filter by kind chips.
  - **Files**: `src/pages/admin/console/policies/index.astro` (modify); `src/components/admin/console/PoliciesTable.astro` (create)
  - **Pattern (design D-management)**: agent-policy library spec
  - **Verify**: Playwright `tests/console/policies-list.spec.ts` — seed 4 policies of mixed kinds, assert filter chip "Budget" narrows to budget rows only
- [x] 4.3.2 Policy detail + edit at `src/pages/admin/console/policies/[id].astro` — read-only summary tabs `Definition` / `Assignments` / `Recent decisions`. Edit creates a new version (policies are immutable per agent-policy spec).
  - **Files**: `src/pages/admin/console/policies/[id].astro` (create); `src/components/admin/console/PolicyAssignmentList.astro` (create)
  - **Pattern (design D-management)**: agent-policy versioning
  - **Verify**: Playwright — assert 3 tabs render with assignment count matching D1
- [x] 4.3.3 Assign-to-flow UI — within Policy Assignments tab, a button opens a modal listing all flows; checking a row creates a `policy_assignments` D1 row via `POST /api/admin/policies/:id/assignments`.
  - **Files**: `src/components/admin/console/PolicyAssignmentModal.tsx` (create — React island)
  - **Pattern (design D-management)**: agent-policy assignment shape
  - **Verify**: Playwright — assign a policy to `deep-research`, refresh, assert assignment row visible in the list

### 4.4 Phase gate

- [ ] 4.4.1 Flip `console.management` to `true` in production after all 4.1–4.3 specs pass; capture baselines `tests/console/screenshots/phase4-{flows,providers,policies}.png`; update `progress.txt`.
  - **Files**: 3 screenshot baselines; `progress.txt` (modify)
  - **Pattern (design D-management)**: per-page rollout
  - **Verify**: production smoke; baselines committed

---

## Phase 5 — Cost dashboard (rollup migration + cron + live overlay)

**Goal**: Operators see per-flow, per-policy, per-user spend over time without slow ad-hoc SQL. Pre-aggregate via a nightly cron into rollup tables; show live last-24h overlay on top via the same `agent_tool_calls` queries already used by the run timeline.

**Files touched**: ~9 new (migration, cron handler, dashboard page, chart island, alert config), ~2 modified (`wrangler.jsonc`, `scripts/create-cron-entry.mjs` scheduled handler)
**Verification**: cron populates rollup table; dashboard renders 30-day trend within <500ms; live overlay refreshes every 60s.

### 5.1 Rollup migration `0017_agent_console_rollups.sql`

- [x] 5.1.1 Create migration with 3 tables: `cost_rollup_daily` (`day INTEGER`, `dimension TEXT`, `dimension_value TEXT`, `tokens_in INTEGER`, `tokens_out INTEGER`, `cost_usd REAL`, `run_count INTEGER`, PRIMARY KEY `(day, dimension, dimension_value)`), `cost_rollup_hourly` (same shape, 7-day retention), `cost_rollup_meta` (`last_built_day INTEGER`). `dimension` enum: `flow_id`, `agent_id`, `policy_id`, `user_id`, `preset_id`, `provider_id`. Match house style: no `CHECK`, inline `--` enum doc.
  - **Files**: `migrations/0017_agent_console_rollups.sql` (create)
  - **Pattern (design D-cost)**: `migrations/0011_agent_os.sql` style; existing rollup patterns in `migrations/`
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0017_agent_console_rollups.sql` exits 0; re-run is no-op; introspection test asserts all 3 tables present with composite PK

### 5.2 Nightly cron handler

- [x] 5.2.1 Add `"0 3 * * *"` entry to `wrangler.jsonc` `triggers.crons` with handler key `console.rollup.daily`. Extend the generated Worker entry in `scripts/create-cron-entry.mjs` to dispatch to `runConsoleRollupDaily(env)`.
  - **Files**: `wrangler.jsonc` (modify); `scripts/create-cron-entry.mjs` (modify)
  - **Pattern (design D-cost)**: existing cron registry in `scripts/create-cron-entry.mjs`
  - **Verify**: `wrangler deploy --dry-run` lists the new cron; manually trigger via `wrangler tail` after deploy
- [x] 5.2.2 Build `src/lib/agent-console/cost/rollup.ts` exporting `runConsoleRollupDaily(env)` — for each dimension, run aggregate SQL like `SELECT day, dimension, value, sum(tokens_in), ... FROM agent_tool_calls JOIN agent_runs ON ... WHERE day = ? GROUP BY day, dimension, value` and `INSERT OR REPLACE` into `cost_rollup_daily`. Walk forward from `cost_rollup_meta.last_built_day + 1` to yesterday; idempotent.
  - **Files**: `src/lib/agent-console/cost/rollup.ts` (create); `src/lib/agent-console/cost/dimensions.ts` (create — dimension config)
  - **Pattern (design D-cost)**: nightly rollup pattern; agent-os `EventLogBackend` SQL style
  - **Verify**: vitest `src/lib/agent-console/cost/rollup.test.ts` — seed 100 `agent_tool_calls` rows across 7 days + 3 flows; run rollup; assert `cost_rollup_daily` has 21 rows (7 days × 3 flow_id dims) with correct sums
- [x] 5.2.3 Manual backfill endpoint `POST /api/admin/console/cost/backfill` (admin only) with body `{ fromDay, toDay }` — invokes the rollup for a specific date range; used for first deploy + recovery from gaps.
  - **Files**: `src/pages/api/admin/console/cost/backfill.ts` (create)
  - **Pattern (design D-cost)**: admin recovery endpoint
  - **Verify**: vitest asserts backfill writes the expected rollup rows; integration test calls endpoint with `{fromDay: 19500, toDay: 19510}` and confirms 11 days of rows

### 5.3 Cost dashboard page

- [x] 5.3.1 Replace stub at `src/pages/admin/console/cost/index.astro` with dashboard layout: top row = 4 metric tiles (total spend 24h / 7d / 30d / month-to-date) reusing `AdminMetric.astro`; main = stacked area chart of cost by flow over 30 days from `cost_rollup_daily`; right rail = top-10 costliest runs in last 24h from `agent_runs` direct query.
  - **Files**: `src/pages/admin/console/cost/index.astro` (modify); `src/components/admin/console/CostMetricsRow.astro` (create); `src/components/admin/console/CostByFlowChart.tsx` (create — uses small library e.g. `chart.js` or hand-rolled SVG); `src/components/admin/console/TopRunsByCost.astro` (create)
  - **Pattern (design D-cost)**: Gateway Console §5.7; `AdminMetric.astro` primitive reuse
  - **Verify**: Playwright `tests/console/cost-dashboard.spec.ts` — seed rollup with 30 days × 3 flows, assert chart has 3 series + 4 metric tiles with non-zero values
- [x] 5.3.2 Dimension switcher — dropdown above the chart lets the user re-pivot by `agent_id`, `policy_id`, `user_id`, `preset_id`, `provider_id`. State in URL `?dimension=`. Each dimension fetches `GET /api/admin/console/cost?dimension=&range=30d`.
  - **Files**: `src/components/admin/console/CostDimensionSwitcher.tsx` (create); `src/pages/api/admin/console/cost/index.ts` (create — read endpoint)
  - **Pattern (design D-cost)**: Gateway Console §5.7
  - **Verify**: Playwright — switch dimension, assert chart re-renders with new legend
- [x] 5.3.3 Live last-24h overlay — small badge on the latest day's bar showing "Live · updates every 60s" plus a delta vs. yesterday. Background poll every 60s to `GET /api/admin/console/cost?dimension=&range=24h&live=true` which bypasses the rollup and aggregates directly.
  - **Files**: `src/components/admin/console/CostByFlowChart.tsx` (modify)
  - **Pattern (design D-cost)**: live-overlay UX
  - **Verify**: Playwright with `vi.useFakeTimers` — assert poll fires after 60s and chart updates

### 5.4 Alert hooks

- [x] 5.4.1 Add `checkCostThresholds(env)` to the existing daily 0 3 cron — flags when 24h spend exceeds a configurable threshold (env var `AGENT_CONSOLE_COST_ALERT_USD_24H`, default 50). Writes a WARN via the existing observability path and surfaces a banner on the dashboard.
  - **Files**: `src/lib/agent-console/cost/alerts.ts` (create); `src/components/admin/console/CostAlertBanner.astro` (create)
  - **Pattern (design D-cost)**: agent-os Phase 6.2.4 alerts pattern
  - **Verify**: vitest asserts alert fires when seeded spend exceeds threshold

### 5.5 Phase gate

- [ ] 5.5.1 Run rollup backfill for the last 90 days against production via the 5.2.3 endpoint; flip `console.costDashboard` to `true`; capture baseline `tests/console/screenshots/phase5-cost.png`.
  - **Files**: screenshot; `progress.txt` (modify)
  - **Pattern (design D-cost)**: production rollout
  - **Verify**: dashboard loads in <500ms in production; baseline committed

---

## Phase 6 — Visual flow editor (React Flow + YAML round-trip)

**Goal**: Operators can edit flows visually as a DAG; save round-trips through the YAML DSL so the source of truth is identical to text edits from Phase 4.1.3. New saves create a new `flow_versions` row identical to the YAML editor path. Same validation pipeline — visual edits cannot bypass DSL guards.

**Files touched**: ~10 new (React Flow integration, YAML↔DAG converter, palette, validation panel), ~2 modified (`flows/[id]/edit.astro` adds a toggle, `package.json` for `@xyflow/react`)
**Verification**: Playwright drags a step from the palette, connects edges, saves, asserts the resulting YAML matches a hand-written equivalent; round-trip test asserts `yaml → dag → yaml` is byte-identical for fixtures.

### 6.1 React Flow dependency + canvas

- [x] 6.1.1 Add `@xyflow/react` (v12) to `package.json`; document in PR body the bundle-size hit (~80KB gzipped, lazy-loaded so it does not affect non-editor pages).
  - **Files**: `package.json` (modify); `pnpm-lock.yaml` (regenerate)
  - **Pattern (design D-editor)**: bundle-size justification
  - **Verify**: `pnpm install` exits 0; lazy import works in 6.1.2
- [x] 6.1.2 Build `src/components/admin/console/FlowEditor.tsx` — React island lazy-loaded via `client:only="react"`. Renders a React Flow canvas with custom node types for each of the 9 step types (different colors + icons). Edges are React Flow edges; edge labels render JSON Logic conditions.
  - **Files**: `src/components/admin/console/FlowEditor.tsx` (create); `src/components/admin/console/flow-editor/nodes/{agent,tool-group,transform,verifier,artifact,human-approval,sub-flow,parallel,loop}.tsx` (create — 9 node components)
  - **Pattern (design D-editor)**: React Flow custom-node pattern (see Context7 docs for `@xyflow/react` if needed)
  - **Verify**: Playwright — open editor, assert canvas renders with N nodes matching the loaded flow's step count
- [x] 6.1.3 Node palette sidebar — left rail with draggable cards for each step type; drop onto canvas creates a new node with default config.
  - **Files**: `src/components/admin/console/flow-editor/Palette.tsx` (create)
  - **Pattern (design D-editor)**: standard drag-and-drop pattern
  - **Verify**: Playwright — drag "Transform" from palette, drop, assert new node appears

### 6.2 YAML ↔ DAG round-trip

- [x] 6.2.1 Build `src/lib/agent-flow/dsl/yaml-to-dag.ts` — `yamlToDag(yaml: string): { nodes, edges }` parses via `loadFlow` from agent-flow Phase 1.3.2 and maps each step to a React Flow node + each edge to a React Flow edge. Position computed via dagre auto-layout.
  - **Files**: `src/lib/agent-flow/dsl/yaml-to-dag.ts` (create); add `dagre` dep
  - **Pattern (design D-editor)**: agent-flow DSL reuse for parsing
  - **Verify**: vitest `src/lib/agent-flow/dsl/yaml-to-dag.test.ts` — Gateway Console §4.2 fixture converts to 10 nodes + correct edge count
- [x] 6.2.2 Build `src/lib/agent-flow/dsl/dag-to-yaml.ts` — `dagToYaml(nodes, edges, meta): string` serializes back to canonical YAML using `yaml` package's stringify with sorted keys; preserves original `meta` (id, name, version, inputs).
  - **Files**: `src/lib/agent-flow/dsl/dag-to-yaml.ts` (create)
  - **Pattern (design D-editor)**: canonical YAML output
  - **Verify**: vitest — fixture `yaml → dag → yaml` is byte-identical for the deep-research flow (after running through the same canonicalizer once on input to neutralize hand-formatting drift)
- [x] 6.2.3 Round-trip integration test — for each fixture under `openspec/changes/agent-flow/fixtures/`, assert `yamlToDag(load) → dagToYaml() → loadFlow(again) → validateFlowSchema()` produces a structurally equal `FlowDefinition`.
  - **Files**: `src/lib/agent-flow/dsl/round-trip.test.ts` (create)
  - **Pattern (design D-editor)**: invariant gate
  - **Verify**: vitest exits clean for all fixtures

### 6.3 Live validation in editor

- [x] 6.3.1 Validation panel — runs `POST /api/admin/flows/validate` (from 4.1.3) on every canvas change with 500ms debounce; renders errors in a bottom panel with per-step `[data-step-id]` highlights on the canvas.
  - **Files**: `src/components/admin/console/flow-editor/ValidationPanel.tsx` (create)
  - **Pattern (design D-editor)**: live validation UX
  - **Verify**: Playwright — drop an invalid `loop` step (maxIterations=0), assert error appears in panel within 1s

### 6.4 Editor toggle + save

- [x] 6.4.1 Toggle on `src/pages/admin/console/flows/[id]/edit.astro` — switches between Monaco YAML editor and React Flow visual editor; state preserved across switches via the YAML↔DAG round-trip.
  - **Files**: `src/pages/admin/console/flows/[id]/edit.astro` (modify); `src/components/admin/console/EditorModeSwitcher.tsx` (create)
  - **Pattern (design D-editor)**: dual-editor pattern
  - **Verify**: Playwright — switch from YAML to Visual back to YAML, assert YAML content unchanged
- [x] 6.4.2 Save from visual editor invokes the same `POST /api/admin/flows/:id/version` endpoint as the YAML path (4.1.3) — flows through `dagToYaml` first. Visual edits cannot bypass DSL validation.
  - **Files**: `src/components/admin/console/FlowEditor.tsx` (modify)
  - **Pattern (design D-editor)**: single save path
  - **Verify**: Playwright — make a visual change, save, assert new `flow_versions` row with the serialized YAML

### 6.5 Phase gate

- [ ] 6.5.1 Flip `console.flowEditor` to `true`; capture baseline `tests/console/screenshots/phase6-editor.png`; record a Playwright video showing drag-drop → save → reload as visual proof.
  - **Files**: screenshot + video; `progress.txt` (modify)
  - **Pattern (design D-editor)**: visual artifact gate
  - **Verify**: production smoke

---

## Phase 7 — RBAC (users / roles / permissions / audit log)

**Goal**: Multi-user safety — operators ≠ admins ≠ approvers ≠ readers. Per-flow, per-policy, per-provider permissions enforced at every admin endpoint. Audit log records who ran/approved/edited what. Migration `0018_agent_console_rbac.sql` adds users/roles/permissions/audit tables; auth middleware reads roles before allowing access.

**Files touched**: ~14 new (migration, middleware, 3 RBAC pages, audit page, role assignment UI, fixtures, tests), ~widespread modifications (every admin endpoint adds a permission check)
**Verification**: Playwright — create a "viewer" user, attempt to cancel a run (forbidden), attempt to view a run (allowed); audit log shows all four scenarios.

### 7.1 RBAC migration `0018_agent_console_rbac.sql`

- [x] 7.1.1 Create migration with 5 tables: `console_users` (`user_id`, `email`, `created_at`, `disabled_at?`), `console_roles` (`role_id`, `name`, `description`), `console_user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`), `console_permissions` (`role_id`, `resource_kind` enum: `flow|policy|provider|run|approval|artifact|cost|rbac`, `resource_id` nullable for `*`, `action` enum: `view|invoke|edit|delete|approve|reject|cancel|export`), `console_audit_log` (`audit_id`, `user_id`, `action`, `resource_kind`, `resource_id`, `payload_json`, `created_at`).
  - **Files**: `migrations/0018_agent_console_rbac.sql` (create)
  - **Pattern (design D-rbac)**: house migration style
  - **Verify**: migration applies clean; introspection test
- [x] 7.1.2 Seed default roles in a migration step: `admin` (full grants), `operator` (view+invoke+cancel on flows/runs/approvals), `approver` (view+approve+reject on approvals only), `viewer` (view-only on all read resources). Existing admin sessions get the `admin` role auto-assigned via a backfill insert keyed on email.
  - **Files**: `migrations/0018_agent_console_rbac.sql` (modify — append seed inserts)
  - **Pattern (design D-rbac)**: principle-of-least-privilege defaults
  - **Verify**: seeded data visible after migration: `SELECT name FROM console_roles` returns 4 names

### 7.2 Permission middleware

- [x] 7.2.1 Build `src/lib/agent-console/rbac/permissions.ts` — `requirePermission({ session, kind, id?, action }): Promise<void>` joins `console_user_roles` + `console_permissions`, throws `PermissionDenied` (403) when no grant matches. Default-deny on flag-on; bypass entirely when `flags.agentConsole.rbac === false` (Phases 1-6 behavior preserved).
  - **Files**: `src/lib/agent-console/rbac/permissions.ts` (create); `src/lib/agent-console/rbac/errors.ts` (create)
  - **Pattern (design D-rbac)**: agent-os access pattern (see `src/lib/agent-os/access.ts`)
  - **Verify**: vitest covers (a) admin role passes all checks, (b) viewer role denied for `action='invoke'`, (c) flag off bypasses entirely
- [x] 7.2.2 Wire `requirePermission` into every console admin endpoint shipped in Phases 2–6: cancel run (`action='cancel'`), retry step (`action='invoke'`), approve (`action='approve'`), reject (`action='reject'`), edit flow (`action='edit'`), create flow (`action='edit'` on `kind='flow'`, id=null), policy assignment, provider rotate-key, etc.
  - **Files**: ~12 admin endpoint files (modify — add 1 line each)
  - **Pattern (design D-rbac)**: defense at every endpoint
  - **Verify**: integration test per endpoint — viewer call returns 403, operator call returns 200; full matrix in `src/lib/agent-console/rbac/permission-matrix.test.ts`
- [x] 7.2.3 Wrap every audit-worthy action in `auditLog({ session, action, kind, id, payload })` — writes one `console_audit_log` row asynchronously via `ctx.waitUntil`. Standard audit events: `flow.run.cancel`, `flow.run.invoke`, `flow.step.retry`, `approval.approve`, `approval.reject`, `flow.edit`, `policy.assign`, `provider.rotate-key`.
  - **Files**: `src/lib/agent-console/rbac/audit.ts` (create); ~12 admin endpoint files (modify)
  - **Pattern (design D-rbac)**: audit-at-action site
  - **Verify**: integration test asserts each tested action produces exactly one `console_audit_log` row with the correct payload

### 7.3 RBAC pages

- [x] 7.3.1 Replace stub at `src/pages/admin/console/rbac/index.astro` — tabs `Users` / `Roles` / `Audit log`. Users tab lists `console_users` with assigned roles; row click → user detail.
  - **Files**: `src/pages/admin/console/rbac/index.astro` (modify); `src/components/admin/console/UsersTable.astro` (create)
  - **Pattern (design D-rbac)**: management page style
  - **Verify**: Playwright — seed 3 users, assert table renders
- [x] 7.3.2 User detail at `src/pages/admin/console/rbac/users/[id].astro` — role assignment UI (multi-select checkboxes for the 4 roles, plus custom roles); disable user toggle; last-login timestamp.
  - **Files**: `src/pages/admin/console/rbac/users/[id].astro` (create); `src/components/admin/console/UserRolesEditor.tsx` (create)
  - **Pattern (design D-rbac)**: assignment UX
  - **Verify**: Playwright — assign `operator` role to a viewer user, assert `console_user_roles` row exists in D1
- [x] 7.3.3 Role detail at `src/pages/admin/console/rbac/roles/[id].astro` — list of permissions, "Add permission" form with resource-kind + action dropdowns. Editing existing roles requires confirmation modal.
  - **Files**: `src/pages/admin/console/rbac/roles/[id].astro` (create); `src/components/admin/console/RolePermissionsEditor.tsx` (create)
  - **Pattern (design D-rbac)**: role-management UX
  - **Verify**: Playwright — add a permission, assert `console_permissions` row exists
- [x] 7.3.4 Audit log page at `src/pages/admin/console/rbac/audit.astro` — paginated table of `console_audit_log` with filters by user/action/kind/date range. Each row expandable to show `payload_json`.
  - **Files**: `src/pages/admin/console/rbac/audit.astro` (create); `src/components/admin/console/AuditLogTable.astro` (create); `src/components/admin/console/AuditLogFilters.tsx` (create)
  - **Pattern (design D-rbac)**: audit-trail UX
  - **Verify**: Playwright — seed 50 audit rows, assert 20 rows on page 1 + filter by `action='approval.approve'` narrows correctly

### 7.4 Phase gate

- [ ] 7.4.1 Flip `console.rbac` to `true` ONLY after the permission matrix test in 7.2.2 is fully green; backfill admin role assignment for every existing admin session via the seed in 7.1.2. Document rollout in `docs/agent-console-runbook.md` with the "Assign role to new user" recipe.
  - **Files**: `docs/agent-console-runbook.md` (create with this section); `progress.txt` (modify)
  - **Pattern (design D-rbac)**: cautious RBAC rollout
  - **Verify**: production smoke — log in as the seeded admin and confirm full access; create a viewer user and confirm read-only behavior

---

## Phase 8 — Polish (accessibility / mobile / i18n / performance)

**Goal**: Move the console from "functional" to "polished". WCAG AA pass on all 8 sections. Mobile-readable at 375px viewport (operator may approve from a phone). Every UI string flows through `src/i18n/` with zh-TW + en. Performance budget: every page LCP <2s on `pnpm dev` with seeded D1.

**Files touched**: ~widespread (a11y fixes across ~25 files), ~3 new (i18n console namespace, lighthouse-ci config, perf budget tests)
**Verification**: `axe-core` Playwright scan passes on all 8 sections; lighthouse-ci budget enforced in CI; visual diff against Phase-2/4/5/6 baselines stays within 1% pixel delta.

### 8.1 Accessibility audit

- [x] 8.1.1 Add `@axe-core/playwright` to dev deps; create `tests/console/a11y.spec.ts` that visits each of the 8 sections + key detail pages (run timeline, flow editor) and runs `injectAxe` + `checkA11y` with `wcag2aa` tag. Failing rules block CI.
  - **Files**: `tests/console/a11y.spec.ts` (create); `package.json` (modify)
  - **Pattern (design D-polish)**: axe-core integration
  - **Verify**: spec runs across all 8 sections; 0 violations
- [ ] 8.1.2 Fix every reported violation from 8.1.1 — most likely: missing `aria-label` on icon-only buttons (cancel, retry, approve), insufficient color contrast in status badges, missing `<label for>` on form inputs, missing `role="status"` on the toast region.
  - **Files**: ~15 component files (modify)
  - **Pattern (design D-polish)**: WCAG AA
  - **Verify**: 8.1.1 spec passes; manual screen-reader spot-check via VoiceOver records a note in `.omc/research/agent-console-a11y-notes.md`
- [x] 8.1.3 Keyboard navigation — every action button reachable via Tab; modals trap focus; SSE stream pauses on `prefers-reduced-motion`. Playwright keyboard-only test walks the cancel/retry/approve flows with `page.keyboard.press('Tab')` and assertions.
  - **Files**: `tests/console/keyboard.spec.ts` (create); some component focus-management fixes
  - **Pattern (design D-polish)**: WCAG 2.1.1 keyboard
  - **Verify**: spec passes

### 8.2 Mobile responsive

- [ ] 8.2.1 Visual responsive pass on all 8 sections at 375px viewport — top-nav collapses to a hamburger menu; tables become card lists; the flow editor falls back to a read-only YAML view (the visual canvas is desktop-only with a banner).
  - **Files**: ~widespread CSS in `src/styles/admin-tokens.css` and component-level styles
  - **Pattern (design D-polish)**: mobile-first reuse of existing breakpoints
  - **Verify**: Playwright per page with `await page.setViewportSize({ width: 375, height: 812 })`; screenshots saved as `tests/console/screenshots/mobile-{section}.png`; **screenshot expectation** = no horizontal scroll, hamburger visible, primary action accessible
- [x] 8.2.2 Touch-target audit — every interactive element ≥44×44pt per Apple HIG. Auto-checked via a small Playwright helper that measures button bounding boxes.
  - **Files**: minor padding tweaks; `tests/console/touch-targets.spec.ts` (create)
  - **Pattern (design D-polish)**: HIG compliance
  - **Verify**: spec passes for all 8 sections

### 8.3 i18n strings

- [x] 8.3.1 Extract every literal string in console pages/components into `src/i18n/console.ts` (new file) keyed by component. Add zh-TW + en translations for all keys. Components consume via existing `useTranslations()` (or its Astro equivalent — confirm what `src/i18n/` exposes).
  - **Files**: `src/i18n/console.ts` (create with both lang trees); ~30 component/page files (modify — replace literals)
  - **Pattern (design D-polish)**: existing `src/i18n/` conventions
  - **Verify**: `grep -rn "console.flow" src/i18n/console.ts` returns matching keys for both langs; Playwright loads `/en/admin/console` and asserts strings are English (or document if console is admin-only zh-TW)

### 8.4 Performance

- [x] 8.4.1 Add `@lhci/cli` to dev deps; configure `.lighthouserc.json` with budgets: LCP <2s, TBT <300ms, CLS <0.1 per Phase-2/4/5/6 baseline pages. Run lhci on `pnpm dev` server in CI.
  - **Files**: `.lighthouserc.json` (create); `package.json` (modify); GitHub Actions workflow (create or modify)
  - **Pattern (design D-polish)**: lhci integration
  - **Verify**: lhci passes for all 8 sections + the run timeline detail page
- [x] 8.4.2 Heavy islands (Monaco editor, React Flow editor, Chart.js) confirmed lazy-loaded — verify via `pnpm build` bundle analysis that the base console route does not import them. Document any leakage in `.omc/research/agent-console-bundle.md` and split if found.
  - **Files**: `.omc/research/agent-console-bundle.md` (create); possible component-level `client:visible` adjustments
  - **Pattern (design D-polish)**: code-splitting
  - **Verify**: base route bundle <100KB gzipped; editor route allowed >300KB

### 8.5 Visual regression

- [x] 8.5.1 Playwright visual-regression spec compares each Phase-2/4/5/6 baseline screenshot against the current render; tolerates <1% pixel delta. Update baselines via `--update-snapshots` when changes are intentional.
  - **Files**: `tests/console/visual-regression.spec.ts` (create)
  - **Pattern (design D-polish)**: visual diff gate
  - **Verify**: spec passes; any drift flagged

---

## Phase 9 — Dogfood + archive

**Goal**: Use the console for real work — operator runs every reference flow (one per change in the agent-* series), observes approvals, exports artifacts. Capture findings in the runbook. Pass `openspec validate agent-console --strict`. Archive.

**Files touched**: ~3 (runbook updates, dogfood report, `progress.txt`)
**Verification**: 21 reference-flow runs visible in D1; runbook has copy-paste recipes for every operator workflow; `openspec archive agent-console` succeeds.

### 9.1 Reference-flow dogfood

- [ ] 9.1.1 Confirm the full reference-flow library is registered (target 21 flows spanning the 7 prior agent-* changes — e.g. `deep-research`, `content-pipeline-migrated`, `policy-audit`, `evidence-bundle`, `artifact-export-notion`, plus per-agent variants). If <21 exist after Phases 1-8 of the agent-* series, list the gap in `.omc/research/agent-console-dogfood-gap.md` and proceed with what's available.
  - **Files**: `.omc/research/agent-console-dogfood-gap.md` (create if gap)
  - **Pattern (design D-dogfood)**: reality check
  - **Verify**: `SELECT count(*) FROM flow_definitions` confirms the count
- [ ] 9.1.2 Run every available reference flow from the console UI (Flow Selector → Launch → Run Timeline → approve any human_approval gates → view evidence → export artifact). Record start time, end time, status, cost, and any UX friction in `.omc/research/agent-console-dogfood-log.md`.
  - **Files**: `.omc/research/agent-console-dogfood-log.md` (create)
  - **Pattern (design D-dogfood)**: end-to-end operator simulation
  - **Verify**: log has one section per flow with `status: done` and timestamps; D1 shows `flow_runs` rows for each
- [ ] 9.1.3 Triage friction notes from 9.1.2 — bugs filed as GitHub issues with `agent-console-followup` label; doc gaps fixed in `docs/agent-console-runbook.md`; UX papercuts captured as a "Phase 9 polish backlog" section.
  - **Files**: `docs/agent-console-runbook.md` (modify); GitHub issues
  - **Pattern (design D-dogfood)**: triage discipline
  - **Verify**: every entry in the dogfood log has either a fix commit, a runbook entry, or an issue link

### 9.2 Approval round-trip observation

- [ ] 9.2.1 During 9.1.2, intentionally pause on every `human_approval` step for ≥10 minutes to exercise the live SSE stream and the pending-approval banner. Capture screenshots of the banner refreshing as new approvals arrive (`tests/console/screenshots/dogfood-approvals.png`).
  - **Files**: screenshot
  - **Pattern (design D-dogfood)**: approval UX validation
  - **Verify**: SSE updates within 2s of new approval insert; screenshot shows updated count

### 9.3 Runbook completion

- [x] 9.3.1 Complete `docs/agent-console-runbook.md` with sections: "Launch a flow", "Cancel a run", "Approve / reject an action", "Retry a failed step", "Edit a flow visually vs YAML", "Add a new user / assign roles", "Read the cost dashboard", "Backfill cost rollups", "Diagnose a slow page".
  - **Files**: `docs/agent-console-runbook.md` (modify — flesh out remaining sections)
  - **Pattern (design D-dogfood)**: agent-os Phase 6.2 runbook style
  - **Verify**: `grep -c "^## " docs/agent-console-runbook.md` shows ≥9 sections

### 9.4 Final cleanup + archive

- [ ] 9.4.1 Run `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build && pnpm exec playwright test tests/console/`; capture output to `.omc/research/agent-console-phase9-suite.log`. Fix any drift.
  - **Files**: log
  - **Pattern (design D-dogfood)**: zero-regression gate
  - **Verify**: every command exits 0
- [ ] 9.4.2 Run `openspec validate agent-console --strict`; reconcile spec drift. Confirm the 8 capability specs (one per page area) live under `openspec/changes/agent-console/specs/`.
  - **Files**: verification gate
  - **Pattern (design D-dogfood)**: OpenSpec strict gate
  - **Verify**: command exits 0
- [x] 9.4.3 Retire per-page flags from `flags.ts` and `wrangler.jsonc` (umbrella `agentConsole.enabled` remains the kill-switch). Document retirement in `design.md` Resolutions section.
  - **Files**: `src/lib/config/flags.ts` (modify); `wrangler.jsonc` (modify)
  - **Pattern (design D-flags)**: dead-flag cleanup; agent-os Phase 3.5.3 mirror
  - **Verify**: `grep -rn "AGENT_CONSOLE_FLOW_SELECTOR" .` returns no hits
- [x] 9.4.4 Append to `progress.txt`: `agent-console: complete — 8 sections live, RBAC live, visual editor live, cost dashboard live, dogfooded across N reference flows, archived YYYY-MM-DD`.
  - **Files**: `progress.txt` (modify)
  - **Pattern (design D-dogfood)**: lightweight session memory
  - **Verify**: `tail -1 progress.txt` matches
- [ ] 9.4.5 Run `openspec archive agent-console` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-console/`; fold delta specs into main specs.
  - **Files**: openspec archive move
  - **Pattern (design D-dogfood)**: OpenSpec lifecycle
  - **Verify**: directory move successful
- [x] 9.4.6 Open follow-up issues for deferred items: (a) public read-only console for selected flows (no login required), (b) per-user dashboard customization (saved filters, pinned flows), (c) Slack/email digest of overnight runs, (d) chat-style alternative to the form-based launcher per Gateway Console §5.8.
  - **Files**: GitHub issues
  - **Pattern (design D-dogfood)**: end-of-change followups; agent-os Phase 6.3.6 mirror
  - **Verify**: 4 issues filed and linked from `progress.txt`
