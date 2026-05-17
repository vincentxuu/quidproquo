> **Status: Full proposal** — design, specs, tasks landed; awaits `agent-os` and `agent-providers` implementation before its own tasks unblock.

## Why

Today every multi-step agent task (`research`, `writer`, `freshness-review`) hard-codes its own step sequence, retry rules, and handoff logic. There is no declarative way to say "this task is plan → search → read → synthesize → verify → export". Workflow-first is the dominant 2026 pattern (Anthropic, Google ADK, Microsoft Agent Framework, LangGraph) and the Gateway Console plan (§4.2) makes `Flow` the central product abstraction. This change introduces a Flow DSL on top of the kernel.

## What Changes

- Define a **declarative Flow schema** (YAML/JSON; TypeScript-validated) with: `FlowInputSchema`, `FlowStep` (types: `agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`), `FlowEdge` (with conditions), `FlowPreset` (Quick / Standard / Deep / Enterprise variants of the same flow), `FlowVersion`
- Implement a **Flow Runtime** that compiles a flow definition into kernel agent invocations: each step becomes one or more kernel processes, edges drive scheduler transitions, state persists between steps via `agent-memory` (per-run scope)
- Ship one canonical reference flow in this change: `deep-research`, wrapping the existing `planner` → `research` → `writer` → `critic` agents as flow steps. The full Gateway Console §7 catalog remains part of the complete roadmap (quick-research, competitor-research, literature-review, source-audit, market-intelligence, engineering/business/knowledge flows), but those additional YAML definitions ship as follow-up data-only PRs after the DSL/runtime is stable.
- **Flow presets** stored as separate records that reference a base flow; let user swap preset without editing the flow
- **Step-level retry** (configurable per step), **conditional edges** (e.g. `verify → search if coverage_insufficient`), **explicit handoff** between specialist agents, **parallel and loop step types**
- **Durable execution integration** — flow runs persist state at every step boundary; resumable after worker restart, deployable on Cloudflare Workflows when long-running
- **Sub-flow composition** — a step can invoke another flow; outputs of inner flow flow into outer flow's state
- (Visual flow editor is built in `agent-console`; this change defines the DSL + runtime that the editor reads/writes)

## Capabilities

### New Capabilities

- `flow-definition`: Declarative DSL for flows (steps, edges, inputs, presets, versioning); validation + schema introspection
- `flow-runtime`: Compiler from flow definition to kernel processes; manages per-step state, edge conditions, retries, handoffs
- `flow-presets`: Named strategy bundles (Quick / Standard / Deep / Enterprise) that overlay a base flow without modifying it

## Dependencies

- `agent-os` (steps run as kernel processes; flow state lives in memory)
- `agent-providers` (steps bind to providers via the router)

## Relationship to existing `src/lib/pipelines/`

The existing pipeline layer (`src/lib/pipelines/{runner,registry,job-store,tool-registry}.ts` + `definitions/` + `modules/`) is a **linear ETL orchestrator** for curated blog-ops jobs (`freshness-review`, `youtube-brief`, `research-brief`, etc.). It overlaps significantly with `agent-flow` — both define multi-step tasks, both have a runner, both have a lifecycle table (`admin_jobs` vs `flow_runs`).

**`agent-flow` is a superset of `pipeline`** — every pipeline can be expressed as a linear flow with no edge conditions and no loops. Reverse is not true (flow has conditional edges, parallel, loop, sub-flow, human approval, presets).

**Scope split (explicit):**
- This change introduces `agent-flow` as a **new** orchestration system alongside `src/lib/pipelines/`. Existing pipelines continue to run unchanged.
- A follow-up change **`agent-pipelines-unify`** (change #8 in the roadmap) ports the existing pipeline definitions into flow YAML, deprecates `src/lib/pipelines/runner.ts`, and reconciles `admin_jobs` ↔ `flow_runs`. That change is gated on `agent-flow` shipping and proving stable in production.

This split keeps `agent-flow`'s blast radius bounded (no risk to running pipelines) and lets the migration happen as its own reviewable, reversible PR.

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.2 Flow Definition Layer
- `/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md` findings 2, 3, 7 (workflow-first, graph harness, low-code with engineering DSL underneath)
