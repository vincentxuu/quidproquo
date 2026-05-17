## Context

Today, four LangGraph agent nodes (`src/lib/rag/agents/{planner,research,writer,critic}.ts`) each call `invokeModel` and the tools in `src/lib/rag/tools/*` directly. There is no shared lifecycle, no persistent state across runs, no per-agent permission model, no observability beyond per-call logs, and no scheduler for recurring runs. The `src/lib/pipelines/` layer adds a higher-level runner and tool-registry, but those are pipeline-specific (job-store + runner + modules) and not generalizable to "any agent on this platform".

The AIOS paper (Rutgers, COLM 2025) and the industry 6-layer consensus both name the same six kernel modules — **Scheduler, Context Manager, Memory Manager, Storage Manager, Tool Manager, Access Manager**. This kernel must run on the existing Cloudflare Workers stack with the bindings already in `wrangler.jsonc`:

| Binding | Type | Used today | Used by Agent OS |
|---|---|---|---|
| `DB` | D1 | content, RAG telemetry | + 7 new tables |
| `SESSION`, `RATE` | KV | auth sessions, rate limits | unchanged |
| `DEEP_RESEARCH_KV` | KV | deep-research storage | unchanged |
| `VECTORIZE_INDEX` | Vectorize | post embeddings | + agent memory namespaces |
| `AI` | Workers AI | embedding model | unchanged |
| `R2_IMAGES` | R2 | OG images | + new `R2_AGENT_MEMORY` bucket for blobs |
| `triggers.crons` | 4 weekly/daily | post sync, RAG maintenance | + per-agent cron entries |
| (none) | Queues | — | **new `AGENT_QUEUE` binding** |

The kernel is the substrate for six follow-up changes (`agent-providers`, `agent-flow`, `agent-evidence`, `agent-policy`, `agent-artifact`, `agent-console`); every architectural decision below is evaluated against "does this hold up when those layers consume it?"

## Goals / Non-Goals

**Goals:**
- Implement the six AIOS kernel modules under `src/lib/agent-os/`, with a single `kernel.ts` entrypoint
- Map every kernel concept to an existing Cloudflare binding (or to a single new binding); no new infra layer
- Define a typed, MCP-compatible syscall ABI so external MCP tools and our internal tools share one contract
- Wrap (not rewrite) the four existing LangGraph agents behind per-agent feature flags
- Day-1 instrumentation: every tool/model call writes a structured `agent_tool_calls` row with tokens, cost, latency
- Hard per-run tool-call ceiling (`agent_runs.tool_call_limit`) enforced at the syscall boundary
- Cooperative cancellation that works inside Workers' execution model
- Approval gate mechanism (irreversible-action interception) that downstream `agent-policy` + `agent-console` can hook into

**Non-Goals:**
- Replacing LangGraph or rewriting any agent's prompts / step logic
- Absorbing the RAG domain into the kernel. RAG remains the site-knowledge / retrieval capability layer under `src/lib/rag/`; the kernel wraps it through syscalls and lifecycle management.
- Building the Flow DSL, Policy Engine, Evidence Store, Artifact System, Provider Router, or Run Console UI (each is its own change)
- Multi-tenant isolation beyond the existing admin auth (single org for now)
- A2A protocol or cross-organization agent messaging
- Generic durable execution engine (Temporal/Inngest) — Cloudflare Workflows is the path, evaluated in `agent-flow`
- Visual flow editor surface (lives in `agent-console`)
- Production-ready admin UI — kernel ships a minimal inspect surface only; full Run Console is `agent-console`

## Decisions

### D0: Layer boundary — RAG is a domain capability, not part of the kernel

**Decision:** Keep `src/lib/rag/` as the domain capability layer for quidproquo's site knowledge and retrieval behavior. `agent-os` owns runtime concerns only: lifecycle, scheduling, context, memory, storage, syscall mediation, access checks, and telemetry.

The dependency direction is:

```text
agent-flow
  -> agent-os
  -> tools/syscalls
  -> rag
  -> DB / Vectorize / Workers AI bindings
```

Provider/vendor routing is also not RAG-owned after `agent-providers` lands:

```text
rag retrieval logic          stays in src/lib/rag/
cross-cutting tool wrappers  live in src/lib/tools/definitions/
vendor routing/credentials   live in src/lib/agent-providers/
runtime/kernel concerns      live in src/lib/agent-os/
```

**Boundary rules.**
- RAG-specific retrieval over this site's corpus (`hybrid-search`, `search-posts`, `search-docs`, `pageindex`, abstract index search) stays under `src/lib/rag/`.
- Cross-cutting tools that are useful outside RAG (`external-search`, `get-post-detail`, `model.invoke`) live under `src/lib/tools/definitions/` and may call into RAG or providers internally.
- `agent-os` may register RAG-backed syscalls and run RAG agents, but it must not import RAG internals as kernel primitives.
- `agent-flow`, `agent-evidence`, and `agent-console` consume RAG output through syscall results, run events, and evidence rows rather than importing `src/lib/rag/**` directly.

**Alternatives considered:**
- *Move RAG agents and retrieval into `src/lib/agent-os/`*: Rejected — that makes the kernel domain-specific and turns every future retrieval change into a runtime change.
- *Move all RAG tools into `src/lib/tools/definitions/`*: Rejected — RAG-specific types and retrieval heuristics would leak into the generic tool layer.
- *Keep provider routing in `src/lib/rag/model.ts`*: Rejected — model/vendor selection is cross-agent provider infrastructure, not site-knowledge retrieval.

**Rationale:** RAG is a capability the kernel runs; it is not the operating system. Keeping this boundary explicit prevents the kernel from becoming a catch-all folder and keeps retrieval changes reviewable as domain work.

### D1: Adopt AIOS 6 modules verbatim as the capability split

**Decision:** Use the AIOS paper's six kernel modules (Scheduler / Context Manager / Memory Manager / Storage Manager / Tool Manager / Access Manager) as the six capabilities in this change.

**Alternatives considered:**
- *Invent custom module names* (e.g. `agent-runtime`, `agent-syscalls`): Rejected — AIOS is well-cited and matches the industry 6-layer consensus; using its names makes the design instantly legible to anyone who has read the references
- *Collapse Context Manager into Memory Manager*: Rejected — context window lifecycle (pruning, summarization, handoff) is a per-run concern; memory is a cross-run concern. Different access patterns, different storage backends
- *Add a 7th "Cost Manager"*: Rejected — cost is telemetry that lives on the `agent_tool_calls` table written by the Tool Manager; it doesn't deserve its own module

**Rationale:** Pre-existing vocabulary > invented vocabulary. Six is also the right number — Tool Manager would be overloaded if Access Manager merged into it; Scheduler would be overloaded if Context Manager merged in.

### D2: Cloudflare primitive mapping (one binding per kernel concern)

**Decision:** Map each AIOS module to a specific Cloudflare primitive:

| AIOS module | Backing primitive | Why |
|---|---|---|
| **Scheduler** | D1 (`agent_processes`, `agent_runs`) + Cron Triggers + new `AGENT_QUEUE` | D1 for the process table (strongly consistent reads), Cron for time-based fan-out, Queues for long-running and queued runs |
| **Context Manager** | In-Worker memory + D1 (`agent_run_events`) | Context window is per-run, ephemeral; persistence is the event log for replay |
| **Memory Manager** | Workers AI embedding backend + KV (hot, small) + Vectorize (semantic) + D1 (BM25 + entity index) + R2 (blobs) | Multi-signal retrieval needs text-to-vector plus storage backends; see D5 |
| **Storage Manager** | D1 (primary) + KV (hot config) + R2 (`R2_AGENT_MEMORY` new bucket) | D1 is the source of truth; KV/R2 are caches/blobs |
| **Tool Manager** | TypeScript registry + D1 (`agent_tool_calls`) | Registry is code; telemetry is rows |
| **Access Manager** | TypeScript declarations + D1 (`agent_permissions`, `agent_approval_requests`) | Grants are part of agent definition; runtime denials and approvals are persisted events |

**Alternatives considered:**
- *Durable Objects for the process table*: Rejected for v1 — D1 is sufficient for the run rates we expect (≤100 runs/day initially), and Durable Objects add billing complexity + a new mental model. Reconsider if scheduler contention shows up.
- *External Qdrant for semantic memory*: Rejected — Vectorize is native, already configured, and one less service to operate. Re-evaluate if Vectorize's per-namespace limits become a problem.
- *KV-only memory*: Rejected — KV is eventually consistent and not searchable; impossible to do multi-signal retrieval on it.

### D3: D1 schema — 7 new tables (one migration: `0011_agent_os.sql`)

```sql
-- Process registry: one row per registered agent definition (lives in code; this is the index)
CREATE TABLE agent_processes (
  agent_id TEXT PRIMARY KEY,           -- e.g. "research", "freshness-review"
  version INTEGER NOT NULL,            -- bumps when permissions/syscalls change
  display_name TEXT NOT NULL,
  description TEXT,
  schedule TEXT,                       -- cron expression, NULL if manual/queue-only
  tool_call_limit INTEGER NOT NULL,    -- hard ceiling per run
  timeout_seconds INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- One row per invocation
CREATE TABLE agent_runs (
  run_id TEXT PRIMARY KEY,             -- UUID
  agent_id TEXT NOT NULL REFERENCES agent_processes(agent_id),
  agent_version INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN
    ('pending','running','paused','done','failed','cancelled')),
  trigger TEXT NOT NULL CHECK (trigger IN ('manual','cron','queue','sub-agent')),
  parent_run_id TEXT,                  -- when this run was spawned by another agent
  input_json TEXT NOT NULL,
  output_json TEXT,
  error_json TEXT,
  cancel_signal INTEGER DEFAULT 0,     -- set to 1 to request cancellation (cooperative)
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0,
  total_tool_calls INTEGER DEFAULT 0
);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_agent_id_started ON agent_runs(agent_id, started_at DESC);

-- Structured event log for replay and observability
CREATE TABLE agent_run_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  kind TEXT NOT NULL,                  -- 'started','step','syscall','memory_read','memory_write','denied','approval_requested','cancelled','finished','failed'
  step_id TEXT,                        -- optional, when event belongs to a named step
  payload_json TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX idx_agent_run_events_run ON agent_run_events(run_id, event_id);

-- Tool/syscall telemetry (the "ProviderCall" referenced by downstream changes)
CREATE TABLE agent_tool_calls (
  call_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  syscall_name TEXT NOT NULL,          -- e.g. "search.external"
  input_json TEXT NOT NULL,
  output_json TEXT,
  error TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0,
  latency_ms INTEGER NOT NULL,
  started_at INTEGER NOT NULL
);
CREATE INDEX idx_agent_tool_calls_run ON agent_tool_calls(run_id);
CREATE INDEX idx_agent_tool_calls_syscall ON agent_tool_calls(syscall_name, started_at DESC);

-- Per-agent declarative grants (rebuilt from code on each deploy; this table is the live snapshot)
CREATE TABLE agent_permissions (
  agent_id TEXT PRIMARY KEY REFERENCES agent_processes(agent_id),
  syscalls_json TEXT NOT NULL,         -- JSON array of allowed syscall names
  memory_scopes_json TEXT NOT NULL,    -- JSON array of allowed scope strings
  secrets_json TEXT NOT NULL,          -- JSON array of allowed secret names
  outbound_domains_json TEXT NOT NULL, -- JSON array of allowed domain globs
  irreversible_actions_require_approval INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

-- Approval gate (consumed by agent-policy and agent-console)
CREATE TABLE agent_approval_requests (
  approval_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  reason TEXT NOT NULL,                -- e.g. "irreversible: slack.post"
  context_json TEXT NOT NULL,          -- what is being approved
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected','expired')),
  resolved_by TEXT,
  resolved_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_agent_approval_requests_pending ON agent_approval_requests(status, created_at);

-- Memory index for BM25 + entity lookup (semantic vectors live in Vectorize)
CREATE TABLE agent_memory_items (
  item_id TEXT PRIMARY KEY,
  scope_key TEXT NOT NULL,             -- composite: "org:1|user:xiaoxu|agent:research|session:abc"
  memory_type TEXT NOT NULL CHECK (memory_type IN ('working','episodic','semantic','procedural')),
  body_text TEXT NOT NULL,             -- searchable
  body_json TEXT,                      -- structured payload
  entities_json TEXT,                  -- extracted entities for entity-match retrieval
  vector_id TEXT,                      -- matching id in Vectorize
  importance REAL DEFAULT 0,
  written_at INTEGER NOT NULL,
  expires_at INTEGER,
  last_read_at INTEGER
);
CREATE INDEX idx_agent_memory_items_scope ON agent_memory_items(scope_key, memory_type, written_at DESC);
CREATE VIRTUAL TABLE agent_memory_fts USING fts5(
  body_text, entities, content='agent_memory_items', content_rowid='rowid'
);
```

**Alternatives considered:**
- *One mega "agent_events" table for everything*: Rejected — querying lifecycle vs. tool-calls vs. memory writes from one table is a pain; index design becomes a fight
- *Use Cloudflare D1 vector type for semantic*: Rejected — Vectorize is the dedicated path; D1 vector support is too new and untested in production
- *Skip FTS5*: Rejected — multi-signal retrieval is in scope from day 1 per refs

### D4: MCP-compatible syscall ABI

**Decision:** Tool inputs and outputs follow MCP's `Tool` schema (JSON-Schema-based). Internal tools wrap to the same contract; external MCP servers (added later under `agent-providers`) plug into the same registry.

```typescript
// src/lib/agent-os/tools/types.ts
export interface SyscallDefinition<TIn, TOut> {
  name: string                          // "search.external", "post.get-detail", etc.
  description: string                   // human + LLM consumable
  inputSchema: JSONSchema7              // MCP-compatible
  outputSchema: JSONSchema7
  handler: SyscallHandler<TIn, TOut>
  costModel?: CostModel                 // optional per-call cost estimator
  requiresApproval?: boolean            // irreversible action flag
}

export type SyscallHandler<TIn, TOut> = (
  ctx: SyscallContext,
  input: TIn
) => Promise<TOut>

export interface SyscallContext {
  runId: string
  agentId: string
  scope: MemoryScope                    // { orgId, userId, agentId, sessionId }
  signal: AbortSignal                   // cancellation
  memory: MemoryAPI                     // see D5
  emit: (kind: string, payload: unknown) => Promise<void>  // structured event
}
```

The kernel exposes one helper:

```typescript
syscall<TName extends SyscallName>(
  name: TName,
  input: SyscallInputOf<TName>
): Promise<SyscallOutputOf<TName>>
```

Every call is mediated. The kernel enforces: `permissions.syscalls.includes(name)`, `runs.total_tool_calls < runs.tool_call_limit`, `permissions.outbound_domains` covers any URL in input, `permissions.irreversible_actions_require_approval` short-circuits to an `ApprovalRequest`.

**Alternatives considered:**
- *Internal-only TypeScript-typed ABI (no MCP)*: Rejected — refs strongly recommend MCP as the industry standard; deferring it means rewriting the ABI later when external MCP tools land
- *Function-as-a-value tools (just import and call)*: Rejected — bypasses all kernel mediation (permissions, telemetry, cancellation)

### D5: Memory — 4 types × 4 scopes, backed by KV + Vectorize + D1 FTS5 + R2

**Decision:** Memory has two axes — **type** (Working / Episodic / Semantic / Procedural per AIOS) and **scope** (`org_id` / `user_id` / `agent_id` / `session_id`). Composite scope keys (e.g. `org:1|user:xiaoxu|agent:research|session:abc`) define access boundaries.

| Type | Lifetime | Backing | Read API |
|---|---|---|---|
| **Working** | Per-run, ≤ context window | In-Worker `Map<string, unknown>` | sync get/set |
| **Episodic** | Persistent; ages out via TTL | D1 (`agent_memory_items` + FTS5) | semantic + BM25 + entity, time-ranked |
| **Semantic** | Persistent; distilled from episodic | Vectorize + D1 (entity index) | semantic + entity, importance-ranked |
| **Procedural** | Persistent; rarely changes | KV (hot) + D1 (durable) | direct key get |

```typescript
interface MemoryAPI {
  recall(opts: {
    type: MemoryType
    scope: Partial<MemoryScope>         // narrower than agent's full scope
    query?: string
    entities?: string[]
    k?: number
  }): Promise<MemoryItem[]>

  write(opts: {
    type: MemoryType
    scope: Partial<MemoryScope>
    body: string
    bodyStructured?: unknown
    entities?: string[]
    importance?: number
    ttlSeconds?: number
  }): Promise<{ itemId: string }>

  distill(opts: { scope: Partial<MemoryScope> }): Promise<{ promoted: number }>
}
```

Multi-signal retrieval algorithm (D5.1):
1. Generate an embedding for `opts.query` via an injected `EmbeddingBackend` (production: Workers AI; tests: deterministic in-memory fake)
2. Issue all three queries in parallel: semantic (Vectorize topK=20), BM25 (D1 FTS5 topK=20), entity match (D1 LIKE on `entities_json`, topK=20)
3. Fuse via Reciprocal Rank Fusion (RRF, k=60); ties broken by `importance` then recency
4. Truncate to `opts.k` (default 5)
5. Update `last_read_at` for retrieved rows (cheap signal for future importance scoring)

Embedding is a backend boundary, not memory-module inline binding access:

```typescript
interface EmbeddingBackend {
  embed(texts: string[]): Promise<number[][]>
}
```

**Alternatives considered:**
- *Single KV namespace, vector-only retrieval*: Rejected — refs explicitly recommend multi-signal over pure vector; retrofit cost is high
- *External mem0 or Zep service*: Rejected for v1 — adds an external dependency and another billing line; revisit if our implementation hits scaling issues
- *Skip Procedural memory*: Rejected — agents need to remember "I always use Tavily for X" without re-deciding every run

### D6: Scheduler — three triggers, one state machine

**Decision:** Three trigger surfaces, all producing rows in `agent_runs`:

| Trigger | Mechanism | Use |
|---|---|---|
| **Manual** | `POST /api/admin/agents/:id/run` | dev, ad-hoc invocation |
| **Cron** | Cloudflare Cron Triggers handler dispatches to scheduler | recurring agents |
| **Queue** | Cloudflare Queues consumer dispatches to scheduler | long-running, batched, retry-on-failure |

Lifecycle state machine:

```
       ┌─────────┐
       │ pending │
       └────┬────┘
            ▼
       ┌─────────┐  cancel signal   ┌───────────┐
       │ running │ ───────────────▶ │ cancelled │
       └────┬────┘                  └───────────┘
            │ approval needed
            ▼
       ┌─────────┐  approved
       │ paused  │ ──────────────┐
       └────┬────┘               │
            │ rejected           │
            ▼                    ▼
       ┌────────┐           ┌──────┐
       │ failed │           │ done │
       └────────┘           └──────┘
```

Cancellation is cooperative (D9 below). Timeout is enforced by a `setTimeout` in the dispatching Worker; expiry flips `cancel_signal=1` and surfaces the AbortSignal to the agent.

**Alternatives considered:**
- *Cron-only*: Rejected — long-running agents can't fit in a single Worker invocation
- *Durable Objects per run for state*: Rejected for v1 — D1 row is simpler and sufficient; revisit if D1 contention shows up

### D7: Cancellation — cooperative via KV-backed signal

**Decision:** Cancellation is cooperative. A `cancel` request:
1. Writes `cancel_signal=1` to `agent_runs` row
2. Writes the same flag to KV (`agent:cancel:{runId}` with 10-min TTL) for fast read from the running Worker
3. The running Worker polls the KV key every syscall (already happening when telemetry writes) and aborts when set
4. The `SyscallContext.signal` is an `AbortSignal` that fires when the KV check flips

**Alternatives considered:**
- *Preemptive kill via Durable Object terminate*: Rejected — Workers has no preempt primitive
- *Polling D1 every loop iteration*: Rejected — D1 read latency adds up; KV is faster

### D8: Access Manager — declarative grants in code, runtime denial logged

**Decision:** Each agent declares its grants in TypeScript at definition time (single source of truth in code). On deploy, the grant set is mirrored into `agent_permissions` for runtime enforcement and admin visibility.

```typescript
export const researchAgent = defineAgent({
  id: 'research',
  version: 2,
  syscalls: ['search.external', 'post.get-detail', 'memory.read', 'memory.write'],
  memoryScopes: ['agent', 'session'],
  secrets: ['TAVILY_API_KEY', 'EXA_API_KEY'],
  outboundDomains: ['*.tavily.com', '*.exa.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: true,
  async run(ctx) { /* ... */ }
})
```

A denied syscall emits an `agent_run_events` row with `kind='denied'` and the run continues (the syscall promise rejects with `AgentAccessDenied`; the agent decides whether to give up or try a permitted alternative).

**Alternatives considered:**
- *D1-stored grants editable at runtime*: Rejected — code-declared grants are reviewable in PR; runtime editing is a footgun

### D9: Approval gates — interception inside the syscall layer

**Decision:** When `definition.requiresApproval === true` (or the agent's `irreversibleActionsRequireApproval` is true and the syscall is in a registered irreversible set), the kernel:
1. Inserts an `agent_approval_requests` row
2. Transitions the run to `paused`
3. Returns a promise that resolves when the row's `status` becomes `approved` (poll via Queues consumer wake-up) or rejects when `rejected`/`expired`

The minimal admin surface (`POST /api/admin/agents/approvals/:approvalId/approve`) lives in this change; the rich UI lives in `agent-console`.

**Alternatives considered:**
- *Synchronous blocking via long-poll inside Worker*: Rejected — Workers has CPU/wall-clock limits; long-poll wastes both

### D10: LangGraph wrapping — kernel hooks, not replacement

**Decision:** Existing LangGraph agents keep their node functions and graph compilation. The kernel wraps the graph runner: it injects `SyscallContext` into each node call, redirects model/tool calls through the syscall ABI, and writes lifecycle events. Agent author changes are minimal — switch from importing `invokeModel` directly to using `ctx.syscall('model.invoke', ...)`.

**Alternatives considered:**
- *Rewrite agents without LangGraph*: Rejected — the four existing agents work; rewriting risks regressions for no immediate gain
- *Run LangGraph entirely outside the kernel*: Rejected — defeats the point of having a kernel

### D11: Feature flag scheme — umbrella + per-agent + per-capability

**Decision:**

| Flag | Default | Purpose |
|---|---|---|
| `agentOs.enabled` | `false` | umbrella; off = whole kernel is dark |
| `agentOs.planner` / `.research` / `.writer` / `.critic` | `false` | per-agent migration; legacy path is the fallback when off |
| `agentOs.memory.r2` | `false` | enable R2-backed blob memory |
| `agentOs.tools.mcpExternal` | `false` | accept registrations of external MCP servers (off until trust model lands) |
| `agentOs.scheduler.queues` | `false` | enable Queue trigger (off until `AGENT_QUEUE` binding is live in prod) |

Flag source: **new** `src/lib/config/flags.ts` (no central flag module exists in the repo today — see Resolution Q1). Backed by Wrangler env vars; this is the single flag reader the entire `agent-*` change series will use.

**Alternatives considered:**
- *Single big flag*: Rejected — violates project rule "all advanced techniques individually toggleable"

### D12: Cost telemetry write path

**Decision:** Every syscall handler returns `{ data, tokensIn?, tokensOut?, costUsd?, latencyMs }`; the kernel writes the `agent_tool_calls` row and updates `agent_runs.{total_tokens,total_cost_usd,total_tool_calls}` in a single D1 batch per call. No per-provider math in agent code — providers (later) supply a `CostModel` that the kernel evaluates.

### D13: Minimal admin surface in `agent-os`

**Decision:** Ship just enough HTTP under `src/pages/api/admin/agents/` to dogfood the kernel:
- `GET /api/admin/agents` — list registered agents
- `POST /api/admin/agents/:id/run` — manual invoke
- `GET /api/admin/agents/runs?status=` — list runs
- `GET /api/admin/agents/runs/:runId` — run detail with events
- `POST /api/admin/agents/runs/:runId/cancel` — cancel
- `GET /api/admin/agents/approvals?status=pending` — pending approvals
- `POST /api/admin/agents/approvals/:approvalId/{approve,reject}` — resolve approval

No Astro pages in this change — pages live in `agent-console`. Existing admin auth gate applies.

## Risks / Trade-offs

### R1: D1 write throughput for `agent_run_events` and `agent_tool_calls`
**Risk:** Long, chatty agents can produce hundreds of events per run. D1 write rate limits (10 writes/sec/db at the low end) become the bottleneck.
**Mitigation:** Batch events per syscall (one D1 write per call combining the run-counter update and the event row). When throughput exceeds D1's headroom, move event log to Cloudflare Analytics Engine (designed for high-cardinality writes) while keeping the structured tables for queries.

### R2: KV eventual consistency for cancellation signal
**Risk:** Cancellation has up to ~60s propagation lag in KV; an agent could continue running briefly after a cancel request.
**Mitigation:** Acceptable for v1 — agents check the signal at syscall boundaries (every few seconds at most). For lower latency, mirror the flag to a Durable Object as a follow-up.

### R3: Vectorize per-namespace limits
**Risk:** Vectorize has per-namespace vector-count caps. Heavy episodic memory could overflow.
**Mitigation:** Partition by `org_id` first; episodic→semantic distillation reduces vector count by ~5x; if still tight, archive cold episodic vectors to R2 and lazy-rehydrate.

### R4: Cooperative cancellation only — runaway loop in a node still runs to completion
**Risk:** An agent's compute-only loop without await points won't see the signal.
**Mitigation:** Hard tool-call ceiling (`tool_call_limit`) bounds any tool-driven loop. Pure CPU loops are an agent-author bug; the timeout (Worker-level) still kills them.

### R5: MCP spec is still evolving
**Risk:** Pinning to MCP today may need migration as spec changes.
**Mitigation:** Pin to a specific MCP spec version in the syscall types file; treat external MCP server support as a flagged-off feature until spec stabilizes (currently `agentOs.tools.mcpExternal=false`).

### R6: Migration churn for the four existing agents
**Risk:** Each agent migration is a non-trivial refactor; bugs could regress live RAG behavior.
**Mitigation:** Per-agent feature flag with full legacy fallback; migrate `critic` first (smallest, lowest blast radius — it scores already-generated drafts), then `writer`, then `research`, then `planner`. Each migration includes a parity test (run both paths on the same input, diff outputs).

### R7: New `AGENT_QUEUE` binding requires Cloudflare Queues paid feature
**Risk:** Queues require Workers Paid plan and per-message pricing.
**Mitigation:** Confirm billing implication before merging the wrangler change. Until enabled, scheduler runs in `manual + cron` mode only; flagged `agentOs.scheduler.queues=false`.

### R8: Approval gate poll loop wastes resources at scale
**Risk:** The Queues-consumer wake-up pattern for paused runs polls D1 for status changes.
**Mitigation:** Only poll runs in `paused` status; approval action enqueues an immediate wake-up message. Future: switch to Durable Object alarm for sub-second wake.

## Migration Plan

**Pre-requisite: `agent-foundation` change #0 ships first.** That change establishes the central `Env` type (`src/lib/config/env.ts`), feature-flag module (`src/lib/config/flags.ts`), shared tool registry (`src/lib/tools/registry.ts` + `types.ts` + `cost.ts`), admin auth helper (`src/lib/auth/admin.ts`), scheduled (cron) auth helper (`src/lib/auth/scheduled-auth.ts`), JSON response helpers (`src/lib/api/response.ts`), date utilities (`src/lib/utils/dates.ts`), and the settings-store consolidation. Every step below imports from those locations rather than re-creating them.

1. **Land kernel modules** (no behavior change yet)
   - Register `AGENT_OS_*` flag entries in the central `src/lib/config/flags.ts` (module already exists from agent-foundation)
   - `src/lib/agent-os/{kernel,scheduler,context,memory,storage,tools,access}.ts` — kernel modules consuming the central tool registry and Env
   - Backend interface + production impl + in-memory test impl for each binding-touching module (per Resolution Q5)
   - D1 migration `0011_agent_os.sql`
   - Wrangler: add `AGENT_QUEUE` binding (kept off via `AGENT_OS_SCHEDULER_QUEUES=false`), add `R2_AGENT_MEMORY` bucket, add `AGENT_OS_*` env vars defaulting to false; update the central `Env` type in `src/lib/config/env.ts` to include the new bindings
   - Add minimal admin API routes (D13) using `requireAdmin` from agent-foundation
   - Vitest tests for pure logic + each module in isolation via its test backend

2. **Wrap existing tools as syscalls** (no agent changes yet)
   - Wrap `src/lib/rag/tools/{external-search,get-post-detail,hybrid-search,page-index,search-abstract-index,search-docs,search-posts}.ts` with MCP-compatible definitions
   - Keep direct imports working so legacy agent paths still function
   - Add syscall telemetry to verify telemetry writes correctly

3. **Migrate agents one at a time, each behind its own flag**
   - **a.** `critic` (smallest, lowest risk) — register, run parity tests, flip `agentOs.critic=true` in production, monitor for 1 week
   - **b.** `writer`
   - **c.** `research`
   - **d.** `planner`

4. **Enable scheduler trigger surfaces**
   - Cron-trigger fan-out enabled with first migrated agent
   - `agentOs.scheduler.queues=true` after the `AGENT_QUEUE` binding is provisioned in prod

5. **Enable memory tier expansion**
   - Working + Episodic + Procedural live from the start (D1 + KV + Vectorize)
   - `agentOs.memory.r2=true` only after R2 bucket is provisioned and an agent has a >256KB write case

**Rollback strategy:** every migration step is gated by a feature flag. Flipping the agent flag back to `false` returns the agent to its legacy execution path without code changes. The D1 tables and KV namespaces remain populated but inert; no data loss on rollback.

## Resolutions

(Open questions resolved during design; recorded here so the rationale is preserved.)

### Q1 → Build a flag module in this change

**Investigation:** No central feature-flag mechanism exists in the repo today (grep for `featureFlag` / `FEATURE_FLAG` / `isFeatureEnabled` returns nothing; `wrangler.jsonc` only defines `LLM_PROVIDER`). CLAUDE.md mandates feature flags but the mechanism is missing.

**Resolution:** The flag module is created by **change #0 `agent-foundation`** at `src/lib/config/flags.ts` (project-level, not kernel-internal — every `agent-*` change reuses it). This change adds the `AGENT_OS_*` entries:

```typescript
// flags.ts
export const flags = {
  agentOs: {
    enabled: env('AGENT_OS_ENABLED', false),
    planner: env('AGENT_OS_PLANNER', false),
    research: env('AGENT_OS_RESEARCH', false),
    writer: env('AGENT_OS_WRITER', false),
    critic: env('AGENT_OS_CRITIC', false),
    memory: { r2: env('AGENT_OS_MEMORY_R2', false) },
    tools: { mcpExternal: env('AGENT_OS_TOOLS_MCP_EXTERNAL', false) },
    scheduler: { queues: env('AGENT_OS_SCHEDULER_QUEUES', false) }
  }
}
```

Backed by Wrangler env vars (booleans parsed from strings). D1-backed runtime overrides deferred — env vars + redeploy is sufficient for single-developer ops. Migration Plan step 1 now explicitly includes this file.

### Q2 → Add `CostModel` discriminated union to syscall types

**Resolution:** Define the type in `src/lib/agent-os/tools/types.ts` in this change so `agent-providers` can implement variants without ABI churn:

```typescript
export type CostModel =
  | { kind: 'token'; inputPerKToken: number; outputPerKToken: number }
  | { kind: 'request'; perCallUsd: number }
  | { kind: 'custom'; estimate: (input: unknown, output: unknown) => number }
```

The kernel reads `definition.costModel` after each call, computes `cost_usd`, writes it to `agent_tool_calls`. If `costModel` is absent, `cost_usd = 0` (telemetry stays consistent).

### Q3 → Use literal `'system'` user id for non-user-driven runs

**Resolution:** Cron-triggered and queue-triggered runs (no human in the loop) set `scope.userId = 'system'`. Avoids ambiguity of wildcards in scope-key composition (`org:1|user:system|agent:research|session:cron-2026-05-17`). The `'system'` user is a reserved id; admin auth rejects any login attempt with that id. Documented in `defineAgent` API doc.

### Q4 → 24h approval TTL, per-agent override

**Resolution:**
- Default: `approvalTtlSeconds = 86400` (24h) — set on `agent_approval_requests` insert
- Per-agent override: `defineAgent({ approvalTtlSeconds: ... })`
- On expiry: scheduler flips run status to `failed` with `error_json = {reason: 'approval_expired', approvalId}`; the run can be re-triggered manually (a new run, not a resume — approvals don't survive across runs)
- Expiry sweep: piggybacks on existing daily cron `0 3 * * *`

### Q5 → Vitest + adapter-pattern; no Miniflare

**Investigation:** Repo uses `vitest run` (script in `package.json`); ~10 test files exist (`session.test.ts`, `rate-limit.test.ts`, `graph.test.ts`, etc.); no Miniflare configured.

**Resolution:** Match the existing pattern.
- **Pure logic** (RRF fusion, lifecycle state machine, permission resolver, cost computation): direct vitest unit tests
- **Binding-touching code** (D1 writers, KV cancel signal, Vectorize calls): define a backend interface (e.g. `EventLogBackend`, `MemoryBackend`), production impl uses bindings, test impl is in-memory. Kernel code depends on the interface
- **No Miniflare** in this change — keeps test infra unchanged. Re-evaluate only if a class of bug emerges that can only be caught with end-to-end binding behavior
