## Why

The existing RAG agents (`src/lib/rag/agents/planner|research|writer|critic.ts`) each re-invent process lifecycle, context handling, persistent state, tool wiring, and permission checks. There is no shared substrate, so three structural problems block the rest of the roadmap (Agent Gateway Console — flows, policies, evidence, artifacts, run console):

1. **No memory** — agents cold-start every run; nothing persists across sessions in a typed, scoped way
2. **No coordination** — tools and providers are wired ad-hoc per agent; observability is per-agent best-effort
3. **No governance** — no per-agent capability grants, no tool-call limits, no human-approval gate for irreversible actions

Industry research (`/Users/xiaoxu/Projects/ai/2026-05-16-agent-os.md`) and trend analysis (`/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md`) both point to the same answer: introduce an **Agent OS** — an infrastructure layer, not a framework — that manages agents the way an OS manages processes. The AIOS paper (Rutgers, COLM 2025) and the industry 6-layer consensus (Bain, MindStudio, 47Billion) agree on the same six kernel modules. The downstream Agent Gateway Console plan (`/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md`) builds Flow / Policy / Evidence / Artifact / Console on top — but **none of those product layers are safe to build until the kernel exists**.

This change ships the kernel only. Product layers ship as follow-up changes.

## What Changes

- Introduce a kernel module (`src/lib/agent-os/`) implementing the six AIOS modules: **Scheduler**, **Context Manager**, **Memory Manager**, **Storage Manager**, **Tool Manager**, **Access Manager** — mapped to Cloudflare Workers primitives (D1, KV, R2, Queues, Cron Triggers)
- Define a typed **tool ABI** with MCP as the standard schema; existing `src/lib/rag/tools/*` are wrapped (not rewritten) so every call is mediated, observable, and rate-limited
- Add a **4-dimensional memory scope** (`org_id` / `user_id` / `agent_id` / `session_id`) with the four AIOS memory types (Working / Episodic / Semantic / Procedural) and **multi-signal retrieval** (semantic + BM25 + entity) — memory is designed day 1, per the production-lessons research
- Add a **process model** in D1 (`agent_processes`, `agent_runs`, `agent_run_events`) with lifecycle states `pending → running → paused → done → failed → cancelled`, cancellation signals, and per-agent timeouts
- Add a **scheduler** with three trigger surfaces: manual API, Cloudflare Cron Triggers (existing), Cloudflare Queues (new binding). Per-agent rate limits, retries with backoff, **hard tool-call ceiling per run** (production-lessons constraint)
- Add an **access manager**: each agent declares grants for syscalls, memory scopes, secrets, outbound domains, and an `irreversible_actions_require_approval` flag. Denials are logged events, never silent.
- Add **cost & token telemetry on day 1** — every tool/model call writes a `ProviderCall` row with tokens, cost, latency. Replaces "we'll add observability later".
- Migrate the existing RAG agents (`planner`, `research`, `writer`, `critic`) onto the kernel **incrementally behind per-agent feature flags** (`agentOs.planner`, `agentOs.research`, …). Legacy execution path remains as fallback until each flag is verified in production. LangGraph stays — the kernel wraps the graph runner; it does not replace it.
- **BREAKING (internal-only, behind flags)**: when an agent's flag is on, it must go through the tool ABI; direct imports of `src/lib/rag/tools/*` are denied at the syscall boundary.

**Explicitly out of scope (each becomes its own follow-up change):**

- `agent-flow` — Flow Definition Layer (YAML/JSON DSL: `FlowStep`, `FlowEdge`, `FlowPreset`, `FlowInputSchema`)
- `agent-policy` — Policy Engine (budget / provider / quality / security / human-approval / retry policies; separated from flow definition)
- `agent-evidence` — Evidence & Audit Store (`EvidenceItem`, `Source`, `Claim`, `Citation`, `Conflict`, `ConfidenceScore`)
- `agent-artifact` — Artifact System (Markdown report, JSON evidence bundle, Notion/Slack/GitHub outputs with versioning and traceability)
- `agent-providers` — Provider Router (multi-provider abstraction beyond LLMs: Search / Reader / Knowledge / Action providers; auth, quota, fallback chains)
- `agent-console` — Run Console UI (flow selector, run timeline, evidence viewer, artifact viewer)
- Absorbing `src/lib/rag/` into the kernel — RAG remains the site-knowledge / retrieval capability layer; `agent-os` wraps it through syscalls and lifecycle management.
- A2A protocol (agent-to-agent cross-org messaging) and AG-UI streaming protocol — defer until the kernel is stable

## Capabilities

### New Capabilities

- `agent-scheduler`: Process model and scheduling. Owns agent identity, the run lifecycle state machine, cancellation signals, timeout enforcement, per-agent concurrency caps, and the three trigger surfaces (manual / Cloudflare Cron Triggers / Cloudflare Queues). Anchored in AIOS Scheduler.
- `agent-context-manager`: Per-run context window lifecycle. Owns message history, context pruning/summarization between steps, structured run state passed across handoffs, and the boundary between "in-window" context and externalized memory. Anchored in AIOS Context Manager.
- `agent-memory`: Multi-signal, multi-scope memory layer. Four memory types (Working / Episodic / Semantic / Procedural) over a 4-dimensional scope (`org_id` / `user_id` / `agent_id` / `session_id`); retrieval combines semantic + BM25 keyword + entity matching with fusion. Async writes; periodic episodic→semantic distillation. Anchored in AIOS Memory Manager.
- `agent-storage`: Cross-session persistence. D1 for structured run/event tables, KV for hot config and small per-run scratch, R2 for blob outputs. Replaces ad-hoc state-stuffing inside individual agents. Anchored in AIOS Storage Manager.
- `agent-tools`: Tool registry and typed syscall ABI. MCP-compatible schemas (so external MCP tools and our internal tools share one ABI); per-call observability, **hard tool-call ceiling per run**, and capability discovery so agents can declare what they need. Anchored in AIOS Tool Manager.
- `agent-access`: Permission and approval model. Per-agent grants for tools, memory scopes, secrets, outbound domains; least-privilege default; `irreversible_actions_require_approval` gate that pauses the run and surfaces an `ApprovalRequest`. Denials are logged events. Anchored in AIOS Access Manager.

### Modified Capabilities

(none — `openspec/specs/` is empty; this is greenfield)

## Dependencies

- `agent-foundation` (change #0) — provides the central `Env` type, feature-flag reader, shared tool registry, admin auth + scheduled-auth helpers, JSON response helpers, date utilities, and settings-store consolidation that this kernel imports from. See Migration Plan in `design.md` for the per-file dependency map.

## Impact

- **New module**: `src/lib/agent-os/` with one folder per capability (`scheduler/`, `context/`, `memory/`, `storage/`, `tools/`, `access/`) plus a `kernel.ts` entrypoint
- **Refactored**: `src/lib/rag/agents/{planner,research,writer,critic}.ts` migrate to kernel-managed processes behind per-agent feature flags; legacy execution path stays as fallback. LangGraph integration kept — the kernel wraps the graph runner.
- **Refactored**: `src/lib/rag/tools/*` and `src/lib/pipelines/tool-registry.ts` exposed via the tool ABI (MCP schema); direct imports denied when the agent's flag is on.
- **D1 migrations**: `agent_processes`, `agent_runs`, `agent_run_events`, `agent_memory_items`, `agent_tool_calls` (ProviderCall), `agent_permissions`, `agent_approval_requests`
- **KV**: new namespace(s) for memory scopes and hot run config (or partitioned key prefixes inside existing KV)
- **Wrangler**: new Cloudflare Queue binding for queued/long agent runs; cron trigger entries already exist
- **R2**: optional binding for large memory blobs (initially disabled; flagged on per scope)
- **Feature flags**: `agentOs.enabled` (umbrella) + per-agent (`agentOs.planner`, `agentOs.research`, `agentOs.writer`, `agentOs.critic`) + per-capability for risky pieces (`agentOs.memory.r2`, `agentOs.tools.mcpExternal`) — matches the project rule that all advanced techniques are individually toggleable
- **Dependencies**: no new external runtime deps required for v1 kernel. MCP schema is JSON; an MCP SDK can be added later when external MCP tool support lands.
- **Risk**: substantial new substrate. Mitigated by (a) feature-flag rollout with legacy fallback, (b) shipping `agent-scheduler` + `agent-storage` + `agent-tools` first so other capabilities can land incrementally, (c) day-1 cost/token telemetry so we see runaway behavior immediately, (d) hard tool-call ceiling per run preventing infinite loops (production-lessons constraint), (e) `agent-access` ships before any irreversible-action tool is wired
- **Downstream**: every follow-up change (`agent-flow`, `agent-policy`, `agent-evidence`, `agent-artifact`, `agent-providers`, `agent-console`) consumes this kernel. The proposal here is intentionally narrower than the Gateway Console product spec so each layer can ship and validate independently.

## Roadmap

This change is the first runtime layer in the full Agent Gateway Console stack. The downstream `agent-*` changes are fully planned in `openspec/changes/`, but each remains gated on the previous layers being merged, deployed, and validated in production. The plan is intentionally complete; execution is staged by dependency and rollback gates, not by reducing scope.

| Order | Change | Layer | Depends on | Status |
|---|---|---|---|---|
| 0 | `agent-foundation` | Cross-cutting refactor (Env / flags / tool registry / admin helpers / settings store / date utils / schema audit). Zero behavior change | — | Fully planned; must land first |
| 1 | `agent-os` | Kernel (AIOS 6 modules) | `agent-foundation` | **This change** — full proposal, design, specs, tasks |
| 2 | `agent-providers` | Provider Router (LLM / Search / Reader / Knowledge / Action) | `agent-os` (uses tool ABI + access manager + storage for credentials) | Fully planned; gated on `agent-os` stability |
| 3 | `agent-flow` | Flow Definition Layer (YAML/JSON DSL, FlowStep / FlowEdge / FlowPreset) | `agent-os`, `agent-providers` | Fully planned; gated on provider routing |
| 4 | `agent-evidence` | Evidence & Audit Store (Source / Excerpt / Claim / Citation / Conflict) | `agent-os`, `agent-flow` | Fully planned; gated on flow runtime |
| 5 | `agent-policy` | Policy Engine (budget / quality / security / human-approval / retry) | `agent-os`, `agent-flow`, `agent-providers`, `agent-evidence` | Fully planned; gated on evidence checks |
| 6 | `agent-artifact` | Artifact System (Markdown / Notion / Slack / GitHub outputs, versioning) | `agent-os`, `agent-flow`, `agent-evidence` | Fully planned; gated on artifact lineage inputs |
| 7 | `agent-console` | Run Console UI (flow selector, run timeline, evidence viewer, artifact viewer) | All of the above | Fully planned; gated on stable backend APIs |
| 8 | `agent-pipelines-unify` | Port existing `src/lib/pipelines/` definitions to flow YAML; deprecate pipeline runner; reconcile `admin_jobs` → `flow_runs` | `agent-flow` (stable in production) | Fully planned; gated on production flow parity |

## Out of Platform Scope

The following items from Gateway Console plan §6.2 are explicitly **not** part of any change in this roadmap. They are excluded by intent, not by phasing:

- **Cloud sync** — multi-environment / multi-machine sync of flows / policies / runs. This platform is single-deployment per Cloudflare account; git is the cross-machine source of truth for flows and policies.
- **Marketplace** — public sharing / install / rating of flow templates. Templates are shared via git repos.
- **Auto-learning workflow** — ML that auto-recommends or auto-generates flows from run history. Requires research-grade meta-learning infra and large run corpus.
- **Complex billing** — subscription tiers, seat-based pricing, credits, invoices. Cost telemetry inside `agent-providers` is sufficient for self-hosted use; SaaS commercialization is not a goal.
- **A2A protocol** — cross-organization agent-to-agent messaging (Google A2A spec). Defer until a concrete multi-org use case exists.

## References

- `/Users/xiaoxu/Projects/ai/2026-05-16-agent-os.md` — AIOS 6-module kernel, industry 6-layer consensus, MCP/A2A/AG-UI protocols, 4-type memory model, production lessons
- `/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md` — Workflow-first stance, graph-based harness, durable execution, guardrails-as-first-class
- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` — Downstream product (Flow / Policy / Evidence / Artifact / Console) that this kernel underpins
