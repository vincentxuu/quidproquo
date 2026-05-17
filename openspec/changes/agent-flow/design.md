## Context

After `agent-foundation` (#0), `agent-os` (#1), and `agent-providers` (#2) land, the platform has:

- A kernel (`src/lib/agent-os/{kernel,scheduler,context,memory,storage,tools,access}.ts`) that runs **one agent at a time**, mediates syscalls, persists events to D1, and enforces per-agent permissions
- A provider router (`src/lib/agent-providers/`) that resolves abstract syscalls like `model.invoke` and `search.external` to a concrete vendor

What it does **not** have is a way to *compose* those agents into a multi-step task. Today, "composition" means one of two things:

1. **LangGraph agent code** — the four RAG agents (`src/lib/rag/agents/{planner,research,writer,critic}.ts`) hand off via a hard-coded graph in `src/lib/rag/graph.ts`. Adding a fifth agent or a conditional re-search loop is a TypeScript change behind a PR.
2. **Pipelines** — `src/lib/pipelines/{runner,registry,job-store}.ts` execute curated blog-ops jobs (`freshness-review`, `youtube-brief`, etc.) as linear ETL. The runner is an `if (definition.id === 'X')` switchboard (`runner.ts:121-187`), each pipeline gets its own bespoke step sequence, and there is no edge logic, no parallelism, and no sub-pipeline composition. The cost is a hard ceiling on workflow complexity and a runner that grows linearly with every new pipeline.

**Why now.** Workflow-first orchestration is the dominant 2026 pattern (Anthropic ADK, Microsoft Agent Framework, LangGraph, Google ADK). The Gateway Console plan (§4.2) makes `Flow` the central product abstraction. Code-defined graphs work for engineers; they block the admin operator who wants to ship a new workflow without a deploy. The visual flow editor that ships in `agent-console` (#4) needs a stable, round-trippable DSL to read and write.

**Stakeholders.**
- **Admin operator** (primary) — wants to compose `planner → search → read → synthesize → verify → export` flows from existing agents, swap presets (Quick / Standard / Deep), and inspect runs without writing TypeScript.
- **Platform engineer** (secondary) — maintains the four LangGraph agents; wants them callable as `agent` steps inside any flow, without re-implementing their tool calls.
- **Future visual-editor author** — needs every YAML field to round-trip losslessly through a graph editor.

**Constraints.**

1. **No regression of kernel semantics.** Every `agent` step in a flow is a kernel sub-run with the same scheduler, memory scope, access grants, and tool-call ceiling as a manually-invoked agent. The kernel is the single execution substrate.
2. **No pipeline migration.** `src/lib/pipelines/` keeps running unchanged. The DSL must be *provably* a superset of pipeline semantics (so the future `agent-pipelines-unify` change #8 can mechanically port them), but no pipeline code is touched here.
3. **Round-trip with the visual editor.** YAML emitted by the editor must parse identically to YAML hand-edited in a PR. No editor-only metadata fields.
4. **Bounded blast radius.** Flow runs are flag-gated; the entire surface is dark until `AGENT_FLOW_ENABLED=true`. Cloudflare Workflows integration is a second, independent flag.

## Goals / Non-Goals

**Goals**
- Declarative Flow DSL (YAML primary, JSON secondary) with 9 step types (`agent`, `tool_group`, `transform`, `verifier`, `artifact`, `human_approval`, `sub_flow`, `parallel`, `loop`) and conditional edges
- Flow Runtime that **compiles** each flow definition into a sequence of kernel `defineAgent` sub-runs — no parallel execution substrate
- Per-flow-run state object that carries data between steps; edge conditions evaluate against it
- Versioned flow records (`flow_definitions`, `flow_versions`) with the run row pinning the version used
- Preset overlay model (separate record; overrides provider bindings, params, retry/timeout; never structure)
- Sub-flow composition with compile-time cycle detection and runtime depth limit
- Durable execution path via Cloudflare Workflows for runs that exceed Worker CPU/wall-clock limits, flag-gated and opt-in
- Reference flow `deep-research` end-to-end, wrapping the four existing RAG agents as `agent` steps with the `verify → search if coverage_insufficient` conditional edge from Gateway Console §4.2
- Minimal admin HTTP surface to register, list, and invoke flows (rich UI lives in `agent-console`)

**Non-Goals**
- Visual flow editor — `agent-console` (#4)
- Migration of existing pipelines into flow YAML, reconciliation of `admin_jobs` ↔ `flow_runs` — `agent-pipelines-unify` (#8)
- Policy engine — `agent-policy` (#5). Flows declare **what** runs; policies declare **how** (budget, retry quotas, provider allowlists, sensitive-data redaction). A flow YAML carries no budget/quality/security fields; those overlay via policy at run time.
- Evidence store, claim-to-source linking — `agent-evidence` (#6)
- Artifact system beyond a passthrough `artifact` step type — `agent-artifact` (#7)
- Provider selection within `agent` steps — providers are resolved by `agent-providers`; flow YAML never names a vendor
- Replacing pipelines now — covered above; mentioned again because reviewers will ask

## Decisions

### D1: DSL format — YAML primary, JSON secondary, TypeScript-validated

**Decision.** Flow definitions are YAML files (`src/lib/agent-flow/definitions/*.yaml`) parsed by `js-yaml`, validated against a Zod schema, then compiled to a typed AST. JSON is a permitted equivalent (the parser accepts both); the schema and AST are identical.

```yaml
# src/lib/agent-flow/definitions/deep-research.yaml
id: deep-research
version: 1
title: Deep Research
description: Multi-source research with verification and re-search on coverage gap.
inputs:
  - id: topic
    type: string
    required: true
  - id: audience
    type: string
    required: false
  - id: freshness_days
    type: number
    default: 365
steps:
  - id: plan
    type: agent
    agent: planner
  - id: search
    type: agent
    agent: research
  - id: synthesize
    type: agent
    agent: writer
  - id: verify
    type: agent
    agent: critic
  - id: export
    type: artifact
    artifact_type: markdown_report
edges:
  - { from: plan, to: search }
  - { from: search, to: synthesize }
  - { from: synthesize, to: verify }
  - from: verify
    to: search
    condition: { "<": [{ "var": "state.verify.coverage_score" }, 0.7] }
  - from: verify
    to: export
    condition: { ">=": [{ "var": "state.verify.coverage_score" }, 0.7] }
```

**Alternatives considered.**
- *TypeScript code-defined graphs (LangGraph style)*. Rejected — defeats the primary goal of letting the admin operator add a flow without a PR; visual editor round-trip becomes "parse arbitrary TS" which is not tractable.
- *DAG-as-code libraries (Prefect, Dagster, Inngest functions)*. Rejected — pulls in a runtime model that does not align with Workers (each library assumes long-lived Python/Node workers); the cost of bridging them exceeds the cost of a 200-line custom parser.
- *Binary format (Protobuf, FlatBuffers)*. Rejected — unreviewable in PRs, no editor round-trip.

**Rationale.** YAML is the lowest common denominator across the stakeholders: hand-editable in a PR (engineer), generated by an editor (operator), readable by the AI assistant for skill execution. Zod-validated AST gives end-to-end type safety in the compiler.

### D2: Step types — exhaustive list of 9

**Decision.** The DSL supports exactly these step types. Anything outside this list is a Zod validation failure at parse time, not a runtime error.

| Type | Purpose | Compiles to |
|---|---|---|
| `agent` | Invoke a registered kernel agent (`research`, `writer`, etc.) as a child run; output becomes a state slot | One kernel `agent_runs` row with `parent_run_id = <flow_run_id>` |
| `tool_group` | Invoke one or more syscalls directly (no agent wrapping); for purely deterministic steps like "fetch 3 URLs in parallel" | One `agent_tool_calls` row per syscall, written against the flow's run id |
| `transform` | Pure data shape change — JSONPath / JMESPath / inline function over current state; no I/O, no model call | Synchronous in-runtime function; no DB row beyond the step event |
| `verifier` | Run a verifier syscall (citation check, JSON-schema check, custom test) and write a structured result into state | One `agent_tool_calls` row tagged `kind=verifier`; output goes to `state.<step_id>.passed` and `state.<step_id>.evidence` |
| `artifact` | Emit a final artifact (markdown report, JSON bundle) into the artifact store | One row in the artifact store (placeholder until `agent-artifact` lands; for now writes to `agent_run_events` as `kind='artifact'`) |
| `human_approval` | Block on an approval gate (delegates to the kernel's existing `agent_approval_requests` mechanism from `agent-os` D9) | One `agent_approval_requests` row; flow run transitions to `paused` |
| `sub_flow` | Invoke another flow with mapped inputs; outputs map back into outer state | One `flow_runs` row with `parent_flow_run_id` set; see D7 |
| `parallel` | Fan out N child steps; await all before continuing | N steps scheduled concurrently; their state writes namespaced under `state.<parallel_step_id>[i]` |
| `loop` | Iterate a single inner step over an array or while a condition holds | N sequential executions of the inner step; bounded by `max_iterations` (D14) |

```yaml
# tool_group example
- id: read_sources
  type: tool_group
  parallel: true                       # default false
  tools:
    - syscall: fetch.url
      input: { url: { var: state.search.urls[0] } }
    - syscall: fetch.url
      input: { url: { var: state.search.urls[1] } }

# transform example
- id: build_brief
  type: transform
  expression:
    map:
      topic: { var: inputs.topic }
      audience: { var: inputs.audience }
      timeframe_days: { var: inputs.freshness_days }

# verifier example
- id: verify_citations
  type: verifier
  syscall: verify.citations
  input: { claims: { var: state.synthesize.claims } }
  pass_when: { ">=": [{ "var": "result.cited_ratio" }, 0.8] }

# parallel example
- id: fan_out_search
  type: parallel
  steps:
    - { id: search_web, type: agent, agent: research }
    - { id: search_internal, type: agent, agent: internal-search }
```

**Alternatives considered.**
- *Single generic `step` type with a `kind` discriminator inside `config`*. Rejected — the YAML becomes a `config` blob with no schema enforcement; reviewing a PR requires opening the code that interprets it.
- *Collapse `verifier` into `agent`*. Rejected — verifiers are pure-function checks (`coverage_score`, `citation_ratio`), not LLM-driven agents; conflating the two encourages people to use a model where a deterministic check suffices.
- *Skip `parallel` in v1*. Rejected — Gateway Console §4.2 calls out parallel `read_sources`; adding it later means breaking changes for users who built workarounds with `tool_group`.
- *Add a tenth `condition` step type (vs putting conditions on edges)*. Rejected — edges already carry conditions; a `condition` step would split the same concept across two places.

**Rationale.** Nine types, each load-bearing for a use case present in the §7 reference flows. Every type maps to a small handful of kernel primitives, so the runtime is thin.

### D3: Edge condition language — JSON Logic with a `transform`-step escape hatch

**Decision.** Edge conditions are [JSON Logic](https://jsonlogic.com/) expressions, evaluated against a context of `{ state, inputs, result }`. JSON Logic was chosen over four alternatives:

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **JSON Logic** | Safe (no `eval`), JSON-serializable (round-trips with editor), 60+ operators, ~3 KB runtime | Verbose for complex expressions | **Chosen** |
| JMESPath | Concise queries | Built for selection, not boolean logic; awkward for `and/or/not` | Rejected |
| JavaScript via QuickJS sandbox | Maximum expressiveness | Pulls a JS interpreter (~200 KB) into the Worker bundle; sandbox escape risk | Rejected for v1 |
| Custom mini-language | Tailored | Have to write parser, docs, editor support; no off-the-shelf editor | Rejected |

```yaml
# coverage_insufficient → loop back
condition:
  "<":
    - { var: "state.verify.coverage_score" }
    - 0.7

# passed AND has citations
condition:
  and:
    - { ">=": [{ var: "state.verify.coverage_score" }, 0.7] }
    - { ">": [{ var: "state.verify.citation_count" }, 0] }
```

**What JSON Logic cannot do.** Regex matching, custom date math, complex string manipulation, calling out to a syscall. **Escape hatch:** a `transform` step that returns a boolean, then an edge that reads `state.<transform_step>.result`.

```yaml
- id: check_freshness
  type: transform
  expression:
    custom: |
      const ageDays = (Date.now() - new Date(state.synthesize.most_recent_source).getTime()) / 86400000;
      return ageDays < inputs.freshness_days;
edges:
  - from: synthesize
    to: re_search
    condition: { "==": [{ var: "state.check_freshness.result" }, false] }
```

(The `transform.expression.custom` form is allowed only when `expression.map` and `expression.jsonpath` cannot express the need; it is evaluated in a deliberately restricted scope — `state`, `inputs`, `Date`, `Math`, `JSON` only.)

**Alternatives considered.** See table above. JSON Logic was the only option that satisfied "safe + serializable + zero new bundle dependency" simultaneously.

**Rationale.** Edges are the most-edited part of a flow; the editor needs to round-trip them losslessly. JSON Logic IS the round-trip format. Power users get a documented escape via `transform`.

### D4: State propagation — single per-run state object, kernel memory `working` scope

**Decision.** Each flow run owns one state object stored in the kernel's `working` memory scope (agent-os D5: in-Worker `Map` for working, mirrored to D1 for cross-step persistence and resume). Steps read `state.<key>` and write to `state.<step_id>` (their step id is their default write key; overrideable via `output_to`).

```typescript
interface FlowRunState {
  inputs: Record<string, unknown>          // frozen at run start
  state: Record<string, unknown>           // mutable; each step writes to state[step.id]
  meta: {
    runId: string
    flowId: string
    flowVersion: number
    startedAt: number
    stepHistory: Array<{ stepId: string; status: 'ok' | 'failed' | 'skipped'; durationMs: number }>
  }
}
```

The state object is persisted on every step boundary (D11 — `flow_run_state` table). Edge conditions evaluate against `{ state, inputs }`; `result` is the most recent step output (sugar so simple expressions don't need `state.<previous_step_id>`).

```yaml
# Default: step output written to state.<step.id>
- id: plan
  type: agent
  agent: planner
  # writes to state.plan = <planner output>

# Override the write key
- id: search
  type: agent
  agent: research
  output_to: results.web_sources
  # writes to state.results.web_sources = <research output>
```

**Alternatives considered.**
- *Per-step input/output schemas declared in YAML, kernel enforces*. Rejected for v1 — adds significant Zod ceremony to every flow YAML; deferred to a follow-up once we have observed real flow authoring friction.
- *Implicit "previous step output is the next step input"*. Rejected — only works for linear flows; breaks immediately on `parallel`, `loop`, and conditional edges.

**Rationale.** Single flat namespace (`state.*`) keeps mental model simple; explicit step-id keys make the data flow auditable in the run event log.

### D5: Flow versioning — `version` field per definition, run pins version, opt-in upgrades

**Decision.** Every flow YAML has a top-level `version: N` integer (monotonic). The runtime keeps every prior version queryable. Each `flow_runs` row records `flow_version` so a run started on v3 finishes on v3 even if v4 deploys mid-run.

- New runs (manual / scheduled / via API) always pick the latest version unless an explicit `version: N` is passed in the run request
- Old in-flight runs finish on their pinned version
- A flow with no changes to YAML is **not** auto-bumped — the author owns the version field
- Deleting a version is forbidden if any run row references it (foreign key); deprecation is via a `deprecated: true` field that hides it from the run-creation UI

```yaml
id: deep-research
version: 3
# previous v1, v2 still loadable for resume
```

**Alternatives considered.**
- *Hash-based versioning (SHA of canonical YAML)*. Rejected — hashes are opaque to humans; version "3" reads better than "9f0a..." in a PR.
- *Semantic versioning (`1.2.3`)*. Rejected — flows don't have a public API surface; major/minor/patch distinction adds no value here.
- *No versioning — latest wins*. Rejected — breaks resume of in-flight runs; breaks reproducibility of historical runs.

**Rationale.** Monotonic integers match the kernel's `agent_processes.version` pattern (agent-os D3). Pinning at run start gives reproducibility; opt-in upgrade gives forward compatibility.

### D6: Preset overlay model — separate record, override leaves only

**Decision.** A preset is a separate D1 record `{ preset_id, base_flow_id, base_version, name, overrides }` where `overrides` can mutate step params, provider bindings, retry/timeout, but **never** add, remove, or reorder steps or edges. The runtime renders the *effective* flow (base + overrides) before compilation; runs always store the rendered effective YAML alongside the preset id for audit.

```yaml
# preset: deep-research.standard
preset_id: deep-research.standard
base_flow_id: deep-research
base_version: 1
name: Standard
overrides:
  steps:
    search:
      params: { max_results: 10, max_depth: 2 }
    verify:
      retry: { max: 1, backoff: linear, delay_ms: 500 }
  inputs_defaults:
    freshness_days: 365

# preset: deep-research.deep
preset_id: deep-research.deep
base_flow_id: deep-research
base_version: 1
name: Deep
overrides:
  steps:
    search:
      params: { max_results: 25, max_depth: 4 }
    verify:
      retry: { max: 3, backoff: exponential, delay_ms: 1000 }
  inputs_defaults:
    freshness_days: 180
```

The overrides schema (Zod-enforced):

```typescript
const PresetOverridesSchema = z.object({
  inputs_defaults: z.record(z.unknown()).optional(),
  steps: z.record(z.string(), z.object({
    params: z.record(z.unknown()).optional(),
    retry: RetrySchema.optional(),
    timeout_ms: z.number().int().positive().optional(),
    // NOTE: no `type`, no `agent`, no edges — structural fields forbidden
  })).optional(),
})
```

**Alternatives considered.**
- *Presets as full flow copies*. Rejected — base changes don't propagate; two versions of the same flow drift independently.
- *Presets allowed to add/remove steps*. Rejected — at that point a preset is a fork, not an overlay; users lose the "swap preset without changing flow" mental model.
- *Inline presets in the base YAML*. Rejected — coupling base to its presets makes the base YAML grow unboundedly; separate records keep the UI listing clean.

**Rationale.** Overlay-only-on-leaves makes the diff between presets reviewable; the rendered effective flow is what runs (and what the editor shows). The 3-tier list in Gateway Console §6.1 (Quick / Standard / Deep / Enterprise) is exactly this pattern.

### D7: Sub-flow composition — explicit input/output maps, compile-time cycle detection

**Decision.** A `sub_flow` step has `flow_id`, optional `version` (defaults to latest at compile time), `inputs_map` (parent state → inner flow inputs), and `outputs_map` (inner flow outputs → parent state). The compiler builds the static call graph from every flow's `sub_flow` steps; cycles fail compilation. Runtime additionally enforces `max_depth = 5` (configurable per agent-policy in a later change) to catch indirect cycles that could not be statically determined (e.g. a `sub_flow` whose target is resolved at runtime — currently disallowed, but defense in depth).

```yaml
- id: do_research
  type: sub_flow
  flow_id: deep-research
  version: 1                              # optional; omit for "latest"
  inputs_map:
    topic: { var: state.plan.research_topic }
    freshness_days: 180
  outputs_map:
    markdown_report: research_output      # state.research_output = inner state.export
```

**Compile-time cycle detection.** The compiler reads every flow definition file, builds an edge `A → B` whenever flow A has a `sub_flow` step targeting B, and runs Tarjan's algorithm. Any SCC of size > 1 fails the build with a list of cycle members.

```text
ERROR: Sub-flow cycle detected:
  deep-research → competitor-research → deep-research
Cycle members: deep-research, competitor-research
```

**Alternatives considered.**
- *Inline the sub-flow YAML at parse time*. Rejected — inflates run records, breaks separate versioning, sub-flow changes silently change parent.
- *No depth limit, trust the cycle check*. Rejected — runtime resolution of `flow_id` is a foreseeable v2 feature; a depth limit makes it safe by construction.
- *Allow dynamic `flow_id` from state*. Rejected for v1 — kills static analysis; revisit when there's a concrete use case.

**Rationale.** Sub-flows are the composition primitive that makes the 21 reference flows tractable (§7) — `pr-review` reuses `code-search`, `incident-postmortem` reuses `deep-research`. Static cycle detection is cheap insurance.

### D8: Step-level retry — declared per step, defaults at flow level

**Decision.** Each step optionally declares `retry: { max: N, backoff: 'exponential' | 'linear' | 'constant', delay_ms: D, jitter_ms?: J }`. Flow-level `defaults.retry` applies to any step that does not override. Retries are attempted only on the **transient** error class returned by the kernel (matching the pipeline runner's `isRetryableFailure` set: timeout, rate limit, 429, network, ECONNRESET, ETIMEDOUT — see `src/lib/pipelines/runner.ts:1320`); permanent errors (validation, denied permission, exhausted budget) bypass retry.

```yaml
defaults:
  retry: { max: 2, backoff: exponential, delay_ms: 500, jitter_ms: 250 }

steps:
  - id: search
    type: agent
    agent: research
    retry: { max: 5, backoff: exponential, delay_ms: 1000 }   # override; flaky external API
  - id: verify
    type: verifier
    syscall: verify.citations
    # no retry override → uses defaults.retry
  - id: write_artifact
    type: artifact
    artifact_type: markdown_report
    retry: { max: 0 }                                          # explicit no-retry on write
```

Each retry attempt writes an `agent_run_events` row (`kind='step_retry'`) so the run timeline shows attempt count and backoff.

**Alternatives considered.**
- *Single retry policy per flow, no per-step override*. Rejected — search needs more retries than artifact writes; one policy forces over-retry on the wrong steps.
- *Retry policy in the policy engine, not the flow*. Partially correct, deferred to D11 of `agent-policy`: budget caps (max total retries per run) live in policy; **operational retry shape** (how to retry a search call) stays in the flow because it's intrinsic to the step type.

**Rationale.** Two-tier (flow defaults + per-step override) matches existing pipeline `budget.maxRetries` pattern while adding granularity where it matters.

### D9: Durable execution — short runs in-Worker, long runs on Cloudflare Workflows (flag-gated)

**Decision.** Two execution paths share one compiler output:

1. **In-Worker path (default).** The runtime executes the compiled flow inside the request Worker. Step state is persisted to D1 on every boundary; the Worker holds an in-memory closure over the AST. Suitable for runs that complete within Worker CPU/wall-clock limits (50 ms CPU per request → use `ctx.waitUntil` for long-tail; 30 s wall clock for HTTP-triggered, longer for cron / queue). The pipeline runner today operates inside these limits (`budget.maxRuntimeMs ≤ 1200_000`); flow runs of similar shape work identically.
2. **Cloudflare Workflows path.** When a flow declares `durable: true` (or the runtime detects a step boundary that would exceed Worker limits — currently only via explicit declaration; auto-detection is a v2 feature), the runtime hands off to a Workflows instance. Each compiled step becomes one Workflows `step.do(...)` call. State is the Workflows engine's responsibility; D1 row sync remains the source of truth for the admin console.

```yaml
id: incident-postmortem
version: 1
durable: true              # opt-in; routes to Cloudflare Workflows
steps:
  - id: gather_logs
    type: tool_group
    # ... long-running fan-out
```

Integration adapter shape:

```typescript
// src/lib/agent-flow/runtime/durable.ts
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers'

export class FlowDurableEntrypoint extends WorkflowEntrypoint<Env, FlowDurableParams> {
  async run(event: WorkflowEvent<FlowDurableParams>, step: WorkflowStep) {
    const ast = await loadCompiledAst(event.payload.flowRunId)
    let state: FlowRunState = await loadInitialState(event.payload.flowRunId)
    for (const compiled of ast.steps) {
      state = await step.do(compiled.id, { retries: compiled.retry }, async () => {
        return runOneStep(compiled, state)   // same function the in-Worker path uses
      })
      await persistStateBoundary(event.payload.flowRunId, compiled.id, state)
    }
  }
}
```

The `runOneStep` function is shared between paths; only the surrounding driver differs.

**Alternatives considered.**
- *Temporal*. Rejected — external service, new credentials story, new billing line, requires self-hosting or Temporal Cloud signup; adds operational surface for a single-developer project.
- *Inngest*. Rejected — same external-service drawback; valuable feature set (replay, fan-out) is partially native in Workflows.
- *DIY long-poll via D1 + cron*. Rejected — exactly the path the kernel's approval-gate poll loop already takes (R8 in agent-os); doubling down on it for the whole flow runtime amplifies the resource waste.
- *Always-on Workflows (no short-run path)*. Rejected — Workflows has a per-instance overhead and pricing per step; short runs pay the cost without benefit.

**Rationale.** Cloudflare Workflows is the only durable engine that is native to the platform's binding model; the integration is a thin adapter (~150 lines) rather than a new infrastructure tier. Flag-gated rollout (`AGENT_FLOW_DURABLE_EXECUTION`) means the in-Worker path can ship and stabilize before Workflows is required.

### D10: Compilation pipeline — five-stage, every stage is a pure function

**Decision.** Compilation is `parse → validateSchema → typecheck → buildGraph → executor`. Each stage has a typed input and output; intermediate values are pure data (no closures, no env, no I/O).

```text
YAML/JSON text
    │ parse()                                    [js-yaml | JSON.parse]
    ▼
Untyped object (Record<string, unknown>)
    │ validateSchema()                           [Zod FlowDefinitionSchema]
    ▼
FlowDefinition (typed AST node tree)
    │ typecheck()                                [JSON Logic ref checks; agent registry lookup;
    │                                             input/output_to key uniqueness; sub_flow target
    │                                             existence; output_to namespace conflicts]
    ▼
TypedFlowDefinition (AST + symbol table)
    │ buildGraph()                               [topological sort over edges; cycle detection;
    │                                             parallel-set extraction; loop-bound check]
    ▼
CompiledFlow (ordered execution plan + state shape)
    │ executor()                                 [in-Worker or Workflows driver]
    ▼
FlowRun (lifecycle managed; rows in flow_runs + flow_step_runs)
```

```typescript
// src/lib/agent-flow/compiler/index.ts
export function compile(source: string, fmt: 'yaml' | 'json' = 'yaml'): CompiledFlow {
  const raw = parse(source, fmt)
  const def = validateSchema(raw)           // throws ZodError
  const typed = typecheck(def, agentRegistry, flowRegistry)
  const compiled = buildGraph(typed)
  return compiled
}
```

The graph node objects mirror `defineAgent` (`src/lib/agent-os/access.ts` registration shape from agent-os D8); each `agent` step compiles into a deferred call to the kernel's `runAgent(agentId, input, { parentRunId })`. The flow runtime is, by construction, a **specialized scheduler** for the kernel — not a parallel execution substrate.

**Alternatives considered.**
- *One-pass parse + execute*. Rejected — couples validation to execution; impossible to test stages independently; impossible to surface schema errors before any side effect.
- *Persist intermediate compiled form*. Rejected for v1 — compile is fast (< 5 ms for the deep-research flow); cache later if needed.

**Rationale.** Five small stages > one large stage. Each is independently unit-testable with vitest. The pattern matches established kernel modules in `agent-os`.

### D11: Persistence — five new D1 tables, separate from `agent_runs`, migration `0013_agent_flow.sql`

**Decision.** New tables; flow runs have their own lifecycle and link to kernel agent runs via `parent_run_id` on the kernel side.

```sql
-- 0013_agent_flow.sql

CREATE TABLE flow_definitions (
  flow_id TEXT PRIMARY KEY,                -- e.g. "deep-research"
  title TEXT NOT NULL,
  description TEXT,
  latest_version INTEGER NOT NULL,
  deprecated INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE flow_versions (
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  version INTEGER NOT NULL,
  source_yaml TEXT NOT NULL,               -- canonical YAML at publish time
  compiled_json TEXT NOT NULL,             -- cached CompiledFlow (regenerated if shape changes)
  published_at INTEGER NOT NULL,
  published_by TEXT,
  PRIMARY KEY (flow_id, version)
);

CREATE TABLE flow_presets (
  preset_id TEXT PRIMARY KEY,              -- e.g. "deep-research.standard"
  base_flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  base_version INTEGER NOT NULL,
  name TEXT NOT NULL,
  overrides_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (base_flow_id, base_version) REFERENCES flow_versions(flow_id, version)
);

CREATE TABLE flow_runs (
  flow_run_id TEXT PRIMARY KEY,            -- UUID
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  flow_version INTEGER NOT NULL,
  preset_id TEXT REFERENCES flow_presets(preset_id),
  parent_flow_run_id TEXT,                 -- for sub_flow
  status TEXT NOT NULL CHECK (status IN
    ('pending','running','paused','done','failed','cancelled')),
  trigger TEXT NOT NULL CHECK (trigger IN ('manual','cron','queue','sub_flow','api')),
  inputs_json TEXT NOT NULL,
  durable INTEGER NOT NULL DEFAULT 0,      -- 1 if routed through Workflows
  workflow_instance_id TEXT,               -- when durable=1
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  error_json TEXT,
  total_cost_usd REAL DEFAULT 0,
  FOREIGN KEY (flow_id, flow_version) REFERENCES flow_versions(flow_id, version)
);
CREATE INDEX idx_flow_runs_status ON flow_runs(status);
CREATE INDEX idx_flow_runs_flow ON flow_runs(flow_id, started_at DESC);

CREATE TABLE flow_step_runs (
  step_run_id TEXT PRIMARY KEY,            -- UUID
  flow_run_id TEXT NOT NULL REFERENCES flow_runs(flow_run_id),
  step_id TEXT NOT NULL,                   -- from YAML
  step_type TEXT NOT NULL,                 -- 'agent' | 'tool_group' | ... (D2)
  iteration INTEGER DEFAULT 0,             -- for loop / parallel children
  status TEXT NOT NULL CHECK (status IN ('pending','running','done','failed','skipped')),
  attempt INTEGER NOT NULL DEFAULT 1,
  agent_run_id TEXT,                       -- if step_type='agent', links to agent_runs
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  output_json TEXT,
  error_json TEXT
);
CREATE INDEX idx_flow_step_runs_flow ON flow_step_runs(flow_run_id, started_at);

CREATE TABLE flow_run_state (
  flow_run_id TEXT NOT NULL REFERENCES flow_runs(flow_run_id),
  step_boundary TEXT NOT NULL,             -- step_id after which this snapshot was taken
  state_json TEXT NOT NULL,                -- full FlowRunState at this boundary
  written_at INTEGER NOT NULL,
  PRIMARY KEY (flow_run_id, step_boundary)
);
```

**Why separate from `agent_runs`.** A flow run is a higher-level lifecycle that *contains* zero or more agent runs (an `agent` step spawns one); merging them creates a row whose meaning depends on whether `flow_id` or `agent_id` is set. The link is `flow_step_runs.agent_run_id → agent_runs.run_id` for `agent` steps, and `agent_runs.parent_run_id` on the kernel side carries the originating flow run id (string form `flow:<flow_run_id>`).

**Alternatives considered.**
- *Reuse `agent_runs` with a `kind` column*. Rejected — see above; the two lifecycles drift.
- *Store flow state inline on `flow_runs.state_json`*. Rejected — overwriting one row loses history; the per-step snapshot in `flow_run_state` is what powers replay and partial-retry from a step.
- *Normalize `flow_run_state` to one row per key*. Considered, deferred — see Open Question Q2.

**Rationale.** Five tables, one migration, clear ownership boundary. Migration `0013_agent_flow.sql` slots immediately after `0011_agent_os.sql`; no conflict with the foundation's `0010_admin_settings_consolidation.sql`.

### D12: Reference flow — `deep-research` with conditional re-search loop

**Decision.** Ship one reference flow end-to-end in this change: `deep-research`. Wraps the four existing RAG agents (`planner`, `research`, `writer`, `critic`) as `agent` steps. Introduces the canonical non-linear control flow: `verify → search if coverage_insufficient`, exactly as in Gateway Console §4.2.

```yaml
# src/lib/agent-flow/definitions/deep-research.yaml
id: deep-research
version: 1
title: Deep Research
description: Plan, search, synthesize, verify with re-search on low coverage.
inputs:
  - { id: topic, type: string, required: true }
  - { id: audience, type: string, required: false }
  - { id: freshness_days, type: number, default: 365 }
defaults:
  retry: { max: 2, backoff: exponential, delay_ms: 500 }
steps:
  - id: plan
    type: agent
    agent: planner
    input: { topic: { var: inputs.topic }, audience: { var: inputs.audience } }
  - id: search
    type: agent
    agent: research
    input: { questions: { var: state.plan.questions }, freshness_days: { var: inputs.freshness_days } }
  - id: synthesize
    type: agent
    agent: writer
    input: { sources: { var: state.search.sources }, topic: { var: inputs.topic } }
  - id: verify
    type: agent
    agent: critic
    input: { draft: { var: state.synthesize.draft }, sources: { var: state.search.sources } }
  - id: export
    type: artifact
    artifact_type: markdown_report
    input: { markdown: { var: state.synthesize.draft } }
edges:
  - { from: plan, to: search }
  - { from: search, to: synthesize }
  - { from: synthesize, to: verify }
  - from: verify
    to: search
    condition: { "<": [{ var: "state.verify.coverage_score" }, 0.7] }
  - from: verify
    to: export
    condition: { ">=": [{ var: "state.verify.coverage_score" }, 0.7] }
```

Plus three presets (`deep-research.quick`, `deep-research.standard`, `deep-research.deep`) overriding `search.params.max_results`, `verify.retry`, and `inputs_defaults.freshness_days`.

**Alternatives considered.**
- *Ship a simpler flow (no conditional edge) first*. Rejected — the conditional re-search is the most-cited differentiator vs the pipeline runner; shipping without it would not validate the design.
- *Ship all 21 reference flows*. Rejected as scope — see R7 and Open Question Q4.

**Rationale.** One flow, ship-end-to-end, proves the DSL + runtime + presets + conditional edges + the kernel-link path. Remaining 20 flows add nothing to the design; they are content not architecture.

### D13: Feature flags — umbrella + durable execution toggle, ready for per-flow

**Decision.** Two flag entries land in this change, added to the central `src/lib/config/flags.ts` module that agent-foundation established:

| Flag | Default | Purpose |
|---|---|---|
| `AGENT_FLOW_ENABLED` | `false` | Umbrella; off = entire DSL parser, runtime, and admin endpoints return 404 / no-op |
| `AGENT_FLOW_DURABLE_EXECUTION` | `false` | When off, `durable: true` on a flow YAML is a compile error; when on, the Workflows adapter is wired |

```typescript
// flags.ts addition
agentFlow: {
  enabled: env('AGENT_FLOW_ENABLED', false),
  durableExecution: env('AGENT_FLOW_DURABLE_EXECUTION', false),
},
```

A **per-flow flag pattern** is documented but not pre-populated: when an individual flow needs phased rollout, add a `agentFlow.flows.<flowId>` entry following the same boolEnv reader, and the runtime checks it before accepting a run request for that flow id. This avoids spamming the flag block with 21 entries up front.

**Alternatives considered.** Same single-flag rejection as agent-os D11; CLAUDE.md mandates per-capability toggles.

**Rationale.** Two flags is the minimum that respects the kill-switch + opt-in-durable boundaries; per-flow flags are a pattern, not a static enumeration.

### D14: Loop step bounds — `max_iterations` hard cap, condition OR iteration source

**Decision.** A `loop` step requires `max_iterations` (hard cap, integer > 0, ≤ 100 by default; ≤ 1000 with explicit `defaults.loop.max_iterations` at flow level). It also requires exactly one of:

- `over: { var: "state.<key>" }` — iterate an array from state (`for...of`)
- `condition: <JSON Logic>` — iterate while the condition holds (`while`)

```yaml
# for-each
- id: process_sources
  type: loop
  over: { var: state.search.sources }
  iterator_var: source
  max_iterations: 50
  step:
    id: read_one
    type: tool_group
    tools:
      - syscall: fetch.url
        input: { url: { var: source.url } }

# while
- id: keep_refining
  type: loop
  condition: { "<": [{ var: "state.last_verify.coverage_score" }, 0.85] }
  max_iterations: 5
  step:
    id: refine
    type: agent
    agent: research
```

Loop iteration count is enforced at two layers:

1. **DSL layer.** `max_iterations` cap.
2. **Kernel layer.** Each inner `agent` step still goes through `agent_runs.tool_call_limit` from agent-os D3 — defense in depth against a runaway agent that DSL-level bounds can't see.

**Alternatives considered.**
- *Unbounded `while` loops*. Rejected — every infinite-loop bug becomes a Worker timeout + a billing event; bounded by construction is safer.
- *Default `max_iterations` if omitted*. Rejected — explicit > implicit for cost-bearing operations; a missing bound is a more readable PR error than a silent default.

**Rationale.** Two layers of bounds (DSL + kernel) means no single mistake produces an unbounded run. The 100/1000 split (default cap vs raisable cap) lets common cases stay cheap to author while supporting the occasional large fan-out with explicit acknowledgment.

## Risks / Trade-offs

### R1: YAML hand-editing UX is poor for non-engineers
**Risk.** The primary stakeholder is an operator who wants to compose flows without TypeScript. YAML — significant whitespace, fragile quoting, no validation feedback in plain editors — replaces one cliff with another.
**Mitigation.** The visual editor in `agent-console` (#4) is the real UX; YAML is the round-trip format and the engineer-facing surface. This change ships the Zod schema + a CLI validator (`pnpm flow:lint <path>`) so PR authors get fast feedback. Until the editor ships, JSON Schema autocomplete in IDEs (publish the schema to `schemas/flow-definition.schema.json`) carries the load.

### R2: JSON Logic conditions are limited; users will hit the ceiling
**Risk.** Operators will try to write conditions that exceed JSON Logic's expressiveness (regex, complex date math, multi-key joins) and produce unreadable nested expressions.
**Mitigation.** The escape hatch is documented in D3: a `transform` step that returns a boolean, then an edge that reads `state.<transform>.result`. The DSL guide explicitly recommends this pattern over JSON Logic gymnastics. The visual editor presents both options.

### R3: Preset overlay creates two sources of truth
**Risk.** A user opens the preset YAML and sees `{ search: { params: { max_results: 25 } } }`; the base flow YAML for `search` says `max_results: 10`. Which value runs? Confusion + drift.
**Mitigation.** The runtime always materializes the *effective flow* (base + preset overrides) and stores it on `flow_runs.effective_flow_yaml` for audit; the admin run-detail endpoint returns this. The UI labels every overridden field with a "← from preset" marker. Documentation has a "how overrides resolve" page with worked examples.

### R4: Sub-flow infinite recursion
**Risk.** Flow A invokes flow B which invokes flow A — compile-time detection misses if `flow_id` is ever resolved dynamically.
**Mitigation.** D7 forbids dynamic `flow_id` resolution in v1; compile-time cycle detection (Tarjan's SCC over the static call graph) catches all detectable cycles. Runtime depth limit (`max_depth = 5`) provides defense in depth against accidental dynamic resolution in any future v2 feature.

### R5: Cloudflare Workflows is relatively new
**Risk.** Workflows GA'd recently; behavior under our load patterns is not extensively validated. A Workflows-only outage takes durable flows down.
**Mitigation.** The in-Worker path is the default and works for every flow with `durable: false` (which is every flow in v1 except the explicit opt-ins). `AGENT_FLOW_DURABLE_EXECUTION=false` keeps Workflows out of the runtime entirely; flipping it to true gates the integration on a flag-controlled rollout. If Workflows degrades, flip the flag back and runs queue (D6 in agent-os scheduler) instead of disappearing.

### R6: `flow_runs` ↔ `agent_runs` parent-child relationship creates two lifecycle state machines
**Risk.** A flow run can be `running` while a child agent run is `paused` (waiting for approval); reasoning about "is this flow truly making progress?" requires correlating both tables. Status drift if the kernel and the flow runtime disagree.
**Mitigation.** The mapping is one-directional: child agent run status changes propagate to the parent flow step via the kernel's event log (`agent_run_events` `kind='finished'` → flow step run `done`). The flow runtime never writes to `agent_runs.status`; the kernel never writes to `flow_step_runs.status`. Tests cover the cross-table state matrix (cancel propagation, approval propagation, error propagation).

### R7: Reference-flow scope creep — 21 flows in §7 is a lot
**Risk.** Pressure to ship more reference flows in this change to "prove" the DSL works, ballooning the diff and delaying merge.
**Mitigation.** D12 commits to one canonical reference flow (`deep-research`). The remaining 20 are explicitly out of scope; each ships in its own follow-up PR that touches no DSL or runtime code — just a YAML file and a test. This is the same "data not architecture" boundary the kernel uses for `agent_processes` rows.

### R8: State persistence on every step boundary multiplies D1 writes
**Risk.** A 30-step flow run produces ~30 `flow_run_state` writes plus event-log writes. D1's 10 writes/sec/db ceiling (agent-os R1) becomes the bottleneck under concurrent flow runs.
**Mitigation.** Same mitigation as agent-os R1: batch state-write + event-log row per step boundary (one D1 batch call). For runs under Cloudflare Workflows (D9), Workflows handles state internally; D1 sync is the audit log only and can be best-effort async.

## Migration Plan

Each step is a single PR, gated by a feature flag, with documented rollback.

**Step 1 — DSL parser + validator (no runtime, no DB).**
- Create `src/lib/agent-flow/{schema,parser,validator}.ts` with the Zod schema for `FlowDefinition`, `FlowEdge`, `FlowPreset`
- Publish JSON Schema to `schemas/flow-definition.schema.json` for IDE autocomplete
- CLI command `pnpm flow:lint <path>` that loads, parses, validates, prints errors
- Vitest tests for every step type, every edge condition shape, every input/output map case
- **Rollback.** Delete the directory; no runtime impact.

**Step 2 — Compiler + in-Worker executor (short runs only).**
- `src/lib/agent-flow/compiler/{typecheck,buildGraph,index}.ts` — the five-stage pipeline
- `src/lib/agent-flow/runtime/{driver,state,steps/*}.ts` — one file per step type
- Wire `agent` steps to the kernel's `runAgent` (agent-os D6 scheduler)
- D1 migration `0013_agent_flow.sql` (D11)
- Flag `AGENT_FLOW_ENABLED=false` blocks runtime entry points
- **Rollback.** Set flag to false; D1 tables remain but inert.

**Step 3 — Reference flow `deep-research` end-to-end via the kernel.**
- `src/lib/agent-flow/definitions/deep-research.yaml`
- Three presets (`deep-research.quick / .standard / .deep`)
- Seed migration registers them in `flow_definitions` / `flow_versions` / `flow_presets`
- Integration test: run `deep-research` against the four existing RAG agents (already wrapped by agent-os D10); assert state transitions, conditional re-search fires, final artifact produced
- Admin endpoints (D13 of agent-os admin-surface pattern): `GET /api/admin/flows`, `POST /api/admin/flows/:id/run`, `GET /api/admin/flow-runs/:flowRunId`
- **Rollback.** Set `AGENT_FLOW_ENABLED=false`; existing `pnpm research` paths via the kernel continue to work; reference YAML stays in tree but is dormant.

**Step 4 — Presets system polish.**
- `src/pages/api/admin/flow-presets/*` for CRUD
- Effective-flow rendering endpoint (returns base + overrides → resolved YAML)
- **Rollback.** Disable CRUD endpoints; presets remain in D1 unmodified.

**Step 5 — Sub-flow composition.**
- `sub_flow` step type implementation
- Compile-time cycle detection in `buildGraph`
- Runtime depth limit + nested-state isolation tests
- **Rollback.** Reject `type: sub_flow` at validation; existing flows unaffected.

**Step 6 — Cloudflare Workflows integration (durable execution).**
- `src/lib/agent-flow/runtime/durable.ts` — `FlowDurableEntrypoint` (D9)
- `wrangler.jsonc` workflow binding registration
- Auto-route runs with `durable: true` through the new path
- Flag `AGENT_FLOW_DURABLE_EXECUTION=true` enables; off → compile error if `durable: true`
- **Rollback.** Flag off; any in-flight Workflows run completes; no new ones dispatched.

**Step 7 — Remaining reference flows (parallel work, no DSL changes needed).**
- Each remaining flow from §7 ships as its own PR: one YAML, presets, integration test, no runtime change
- These can land in any order, in parallel, owned by different contributors
- **Rollback.** Per-PR revert; no cross-flow dependencies.

**Pre-merge verification per step (matches agent-foundation Step 5).**
- `pnpm lint` — oxlint clean
- `pnpm build` — astro check + production build
- `pnpm test` — new vitest suite + existing tests
- `pnpm check:references` — internal cross-references unchanged
- Manual smoke: trigger one flow per step type at least once in local dev

## Open Questions

### Q1: Does Cloudflare Workflows support the runtime version pinned in `wrangler.jsonc`?

**Probe.** Inspect `wrangler.jsonc` for `compatibility_date` and `compatibility_flags`; cross-reference with the Workflows release notes (`workflows` binding GA, `WorkflowEntrypoint` available in `cloudflare:workers`). If `compatibility_date < 2024-10-01`, Workflows is not available without a bump; bumping requires a separate compatibility audit.

**Default if probe inconclusive.** Defer Step 6 (durable execution); ship Steps 1–5 + Step 7 first. The in-Worker path covers every flow under the existing pipeline runner's runtime budget (`maxRuntimeMs ≤ 1_200_000` in `runner.ts:137`), so deferring Workflows costs no v1 capability.

### Q2: Should `flow_run_state` be a single JSON blob per snapshot or normalized rows per state key?

**Trade-off.** Single blob is simpler to write and read whole; normalized rows allow targeted queries like "show me the value of `state.search.urls` over time" without parsing JSON. The admin console (`agent-console`, #4) will need both shapes eventually.

**Default if probe inconclusive.** **Single blob per (`flow_run_id`, `step_boundary`)** for v1 — matches D11 as written. Normalize later only when the console actually requires it and we have observed query patterns. JSON1 (`json_extract`) on D1 covers ad-hoc queries in the interim.

### Q3: Preset can override `model.invoke` provider binding — but who decides the model, the flow or the policy?

**Discussion.** A preset like `deep-research.deep` overriding `verify.params.model = 'opus'` overlaps with what `agent-policy` (#5) governs. Policy is the right home for provider selection (it's where budget, allowlist, and fallback live); putting it in a preset duplicates the surface.

**Default if probe inconclusive.** Preset overrides for `params` are allowed; preset overrides for **provider selection** (`model.invoke` target vendor) are **forbidden** at schema level in this change. When `agent-policy` lands, it owns provider binding. The split is: presets shape *step behavior*; policies shape *resource selection*. Document this in the DSL guide. Reopen in `agent-policy` for ratification.

### Q4: For the 21 reference flows in Gateway Console §7, ship all of them here or only `deep-research`?

**Discussion.** Each non-`deep-research` flow needs ~50 lines of YAML, 1–2 presets, and an integration test. Total work for 20 flows is non-trivial but mechanical (no runtime change). Bundling them inflates the change to an unreviewable size; spreading them across follow-ups slows time-to-value for the operator.

**Default if probe inconclusive.** **Ship `deep-research` only in this change** (D12). Add a `TODO_FLOWS.md` under `src/lib/agent-flow/definitions/` listing the remaining 20 with their §7 reference, intended step shape, and stakeholder. Each subsequent flow ships as its own ~150-line PR after this change is merged and stable. Re-evaluate batching after the second flow ships, when authoring friction is measured rather than guessed.
