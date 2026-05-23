# Tasks — agent-os

Implementation plan for the agent-os change. 6 phases, ~97 tasks, strict order.

## Pre-requisite

**Change #0 `agent-foundation` MUST be merged and deployed before Phase 1 starts.** That change provides every central module the kernel imports from:

- `src/lib/config/env.ts` — `Env` type (already includes `AGENT_QUEUE`, `R2_AGENT_MEMORY` declarations)
- `src/lib/config/flags.ts` — feature-flag reader (this change adds the `AGENT_OS_*` entries)
- `src/lib/tools/{registry,types,cost}.ts` — central tool registry the kernel `agent-tools` module consumes
- `src/lib/auth/admin.ts` — `requireAdmin(cookies)`
- `src/lib/auth/scheduled-auth.ts` — session-OR-`X-Crawl-Secret` cron auth helper
- `src/lib/api/response.ts` — `json()`, `unauthorized()`, `forbidden()`, `badRequest()`
- `src/lib/utils/dates.ts` — `nowMs()`, `nowIso()`
- `src/lib/db/settings-store.ts` — settings CRUD (if the kernel needs persisted config)

## Flag state by phase

| Phase | `agentOs.enabled` | per-agent (`critic`/`writer`/`research`/`planner`) | `scheduler.queues` | `memory.r2` |
|---|---|---|---|---|
| 1 | `false` | all `false` | `false` | `false` |
| 2 | `true` (for 2.4 telemetry smoke only; back to `false` after) | all `false` | `false` | `false` |
| 3.1 → 3.4 | `true` | flip ON one-at-a-time after parity | `false` | `false` |
| 3.5 | `true` | all `true`, then **flags retired** (umbrella becomes the kill-switch) | `false` | `false` |
| 4 | `true` | n/a (retired) | `true` after smoke | `false` |
| 5 | `true` | n/a | `true` | `true` after non-regression smoke |
| 6 | `true` | n/a | `true` | `true` |

---

## Phase 1 — Land kernel modules (no behavior change yet)

**Goal**: Stand up the six AIOS kernel modules under `src/lib/agent-os/` with backing D1 schema, Wrangler bindings, feature flags, and a minimal admin API — wired end-to-end and unit-tested in isolation, but with `agentOs.enabled=false` so no production agent path executes against the kernel.

**Files touched**: ~32 new, 3 modified (`wrangler.jsonc`, `src/lib/config/env.ts`, `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-os` is green; `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0011_agent_os.sql` cleanly and `sqlite_master` shows the 7 tables + `agent_memory_fts`; `curl -b 'session=...' http://localhost:4321/api/admin/agents` returns the empty registry; `agentOs.enabled=false` so existing RAG agents are untouched.

### 1.1 Wrangler + flags

- [x] 1.1.1 Add `AGENT_QUEUE` queue producer binding and `R2_AGENT_MEMORY` R2 bucket to `wrangler.jsonc`; add `AGENT_OS_ENABLED`, `AGENT_OS_PLANNER`, `AGENT_OS_RESEARCH`, `AGENT_OS_WRITER`, `AGENT_OS_CRITIC`, `AGENT_OS_MEMORY_R2`, `AGENT_OS_TOOLS_MCP_EXTERNAL`, `AGENT_OS_SCHEDULER_QUEUES` to `vars` block all defaulting to `"false"`. Do NOT add the queue consumer entry yet (Phase 4) and do NOT add per-agent cron entries yet.
  - **Files**: `wrangler.jsonc:15-69` (modify — add `queues.producers[]`, `r2_buckets[]`, `vars`)
  - **Pattern**: D2 binding mapping; R7 (Queues paid-feature note in PR body); existing `r2_buckets` entry at `wrangler.jsonc:64-68`
  - **Verify**: `pnpm wrangler types` regenerates without error; `wrangler dev` boots and `console.log(env.AGENT_OS_ENABLED)` prints `"false"`
- [x] 1.1.2 Extend the central `Env` type to expose new bindings and the eight `AGENT_OS_*` env vars; register the `agentOs` block in `src/lib/config/flags.ts` exactly as specified in Resolution Q1.
  - **Files**: `src/lib/config/env.ts` (modify — add `AGENT_QUEUE: Queue<AgentQueueMessage>`, `R2_AGENT_MEMORY: R2Bucket`, eight env-var fields), `src/lib/config/flags.ts` (modify — append the `agentOs` sub-object from D11)
  - **Pattern**: D11 flag table; Resolution Q1 code block (lines 487-498 of design.md)
  - **Verify**: New unit test `src/lib/config/flags.test.ts` asserts `flags.agentOs.enabled === false` when env is empty and `=== true` when `AGENT_OS_ENABLED='true'`

### 1.2 D1 migration `0011_agent_os.sql`

- [x] 1.2.1 Create migration with 7 tables, 6 indexes, and the `agent_memory_fts` FTS5 virtual table per design D3. Match `migrations/0009_deep_research_reports.sql` style: `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, inline comment per table, no `CHECK` constraints (use TEXT enums with inline `--` comment listing allowed values), `created_at`/`updated_at` as `INTEGER NOT NULL` (epoch ms — kernel writes via `nowMs()`).
  - **Files**: `migrations/0011_agent_os.sql` (create)
  - **Pattern**: `migrations/0009_deep_research_reports.sql:3-32`; design D3 schema (lines 74-180) — drop the `CHECK (status IN ...)` clauses per house style and document allowed values in the `--` comment
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0011_agent_os.sql` exits 0; re-running is a no-op; `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'agent_%'"` returns all 7 names plus `agent_memory_fts`
- [x] 1.2.2 Add a `max_concurrent INTEGER NOT NULL DEFAULT 1` column to `agent_processes` (per scheduler spec — "Per-agent concurrency cap" requirement, not in original D3 schema), and an `approval_ttl_seconds INTEGER NOT NULL DEFAULT 86400` column to `agent_processes` (per access spec + Resolution Q4).
  - **Files**: `migrations/0011_agent_os.sql` (modify the same migration before submission)
  - **Pattern**: agent-scheduler spec "Per-agent concurrency cap"; Resolution Q4
  - **Verify**: schema introspection test (1.4.1) confirms both columns present with declared defaults

### 1.3 Storage backends (per Resolution Q5 adapter pattern)

- [x] 1.3.1 Define the backend interfaces every kernel module depends on — one file per concern, all under `src/lib/agent-os/storage/`. Required interfaces: `ProcessRegistryBackend`, `RunStoreBackend`, `EventLogBackend`, `ToolCallLogBackend`, `PermissionsBackend`, `ApprovalStoreBackend`, `MemoryBackend`, `CancelSignalBackend`, `BlobBackend`, `VectorBackend`, `EmbeddingBackend`.
  - **Files**: `src/lib/agent-os/storage/types.ts` (create)
  - **Pattern**: design D2 (one binding per concern); agent-storage spec "Storage backend interface"; Resolution Q5
  - **Verify**: `pnpm tsc --noEmit` passes; file exports exactly 11 interfaces named above
- [x] 1.3.2 Implement production D1 backends for the four D1-backed interfaces. Each backend takes a `D1Database` and exposes the methods declared in `types.ts`. Implement `EventLogBackend.recordWithRunCounters()` as the single-batch helper required by agent-storage "D1 write batching" (one `db.batch([...])` per syscall covering the `agent_tool_calls` insert AND the `agent_runs` counter update).
  - **Files**: `src/lib/agent-os/storage/d1/{process-registry,run-store,event-log,tool-call-log,permissions,approval-store,memory}.ts` (create — 7 files)
  - **Pattern**: agent-storage spec "D1 write batching"; D12 (cost telemetry write path)
  - **Verify**: `src/lib/agent-os/storage/d1/event-log.test.ts` mocks `D1Database.batch` and asserts it is called exactly once per `recordWithRunCounters()` call with both statements in the array
- [x] 1.3.3 Implement production KV cancel-signal backend writing/reading `agent:cancel:{runId}` with `expirationTtl: 600`; implement R2 blob backend writing `memory/{scope_key}/{item_id}` (no-op stub when `flags.agentOs.memory.r2 === false`); implement Vectorize backend wrapping `VECTORIZE_INDEX` upsert/query.
  - **Files**: `src/lib/agent-os/storage/kv/cancel.ts`, `src/lib/agent-os/storage/r2/blob.ts`, `src/lib/agent-os/storage/vectorize/index.ts` (create — 3 files)
  - **Pattern**: D7 (KV cancel signal); agent-memory spec "R2 blob storage behind flag"; D2 binding table
  - **Verify**: unit test on R2 backend asserts that with flag off, `put()` throws `MemoryBodyTooLarge`; with flag on, calls `R2Bucket.put` with the documented key shape
- [x] 1.3.4 Implement in-memory test backend for every interface in 1.3.1 (11 classes). All test backends live in a single file for easy import from kernel tests.
  - **Files**: `src/lib/agent-os/storage/test/in-memory.ts` (create)
  - **Pattern**: `src/lib/auth/rate-limit.test.ts:4-10` (`makeKV` style — small, hand-rolled, no Miniflare); Resolution Q5
  - **Verify**: imported and used by every kernel test in 1.4; `pnpm vitest run src/lib/agent-os/storage` is green

### 1.4 Kernel modules — `src/lib/agent-os/`

- [x] 1.4.1 Build `kernel.ts` — the single entrypoint that wires the six modules together. Exports `createKernel(env, backends)` returning `{ scheduler, context, memory, storage, tools, access, defineAgent, syscall }`. Performs boot-time registry mirror (every `defineAgent` call upserts `agent_processes` + `agent_permissions` rows via the backends, per agent-scheduler spec "Agent registration" and agent-access spec "Grants mirrored on boot"). Throws `AgentRegistrationError` on duplicate id and `PermissionsChangedWithoutVersionBump` per agent-access spec.
  - **Files**: `src/lib/agent-os/kernel.ts`, `src/lib/agent-os/errors.ts` (create — `AgentRegistrationError`, `PermissionsChangedWithoutVersionBump`, `AgentAccessDenied`, `AgentCancelled`, `SyscallNotFound`, `SyscallInputInvalid`, `SyscallLimitExceeded`, `AgentApprovalRejected`, `AgentApprovalExpired`, `MemoryBodyTooLarge`, `InvalidMemoryType`)
  - **Pattern**: D1 (six-module split); agent-scheduler "Agent registration"; agent-access "Grant change requires version bump"
  - **Verify**: `src/lib/agent-os/kernel.test.ts` asserts (a) duplicate `defineAgent({id:'x'})` throws, (b) mismatched grants without version bump throws, (c) clean boot mirrors both rows in the in-memory backends
- [x] 1.4.2 Build `tools/types.ts` — `SyscallDefinition`, `SyscallContext`, `SyscallHandler`, `CostModel`, `MemoryScope`, `MemoryAPI`, `MemoryItem`, `MemoryType` types. Re-export the central `ToolDefinition` and `CostModel` from `src/lib/tools/{types,cost}.ts` (do NOT redefine).
  - **Files**: `src/lib/agent-os/tools/types.ts` (create)
  - **Pattern**: D4 (lines 191-216); Resolution Q2 (CostModel discriminated union)
  - **Verify**: `pnpm tsc --noEmit` passes; grep `src/lib/agent-os/tools/types.ts` does NOT contain `interface CostModel` or `interface ToolDefinition` (they are re-exports only)
- [x] 1.4.3 Build `tools/syscall.ts` — the mediated `syscall<TName>(name, input)` helper. Performs (in order, all per agent-tools spec): permission check (`syscalls` array), tool-call ceiling check, input JSON-Schema validation, outbound-domain check on any `url` field in input, approval-gate interception (if `requiresApproval` or agent's `irreversibleActionsRequireApproval` + reserved irreversible set), handler invocation with `AbortSignal`, cost evaluation, `EventLogBackend.recordWithRunCounters()` single-batch write.
  - **Files**: `src/lib/agent-os/tools/syscall.ts`, `src/lib/agent-os/tools/irreversible.ts` (create — list of reserved syscall names treated as irreversible by default; start with `[]`, populated in Phase 2)
  - **Pattern**: D4 enforcement list (line 227); D9 (approval interception); D12 (cost write); agent-tools spec — all 7 requirements
  - **Verify**: `src/lib/agent-os/tools/syscall.test.ts` covers each denial reason (`syscall_not_granted`, `outbound_domain_not_granted`, `unknown_syscall`, `tool_call_limit`), schema-validation pass and fail, cost computation for both `token` and `request` `CostModel` variants
- [x] 1.4.4 Build `scheduler.ts` — `dispatchRun({agentId, trigger, input, parentRunId?, userId?})` returns `{runId}`. Inserts `agent_runs` row, enforces `max_concurrent` (HTTP 429 surface returns `concurrency_exceeded` per agent-scheduler spec), wires per-run `setTimeout(timeout_seconds * 1000)` that flips `cancel_signal=1`, owns the `pending→running→done|failed|cancelled|paused→running` state machine. Cron/queue dispatch helpers (`dispatchFromCron`, `dispatchFromQueue`) exist as exported functions but their HTTP/queue-consumer wiring is deferred to Phase 4 — for now they are unit-testable pure functions.
  - **Files**: `src/lib/agent-os/scheduler.ts`, `src/lib/agent-os/state-machine.ts` (create — pure state transition table + `transition(from, to): Result`)
  - **Pattern**: D6 lifecycle diagram; agent-scheduler spec all 6 requirements; Resolution Q3 (system user id for cron/queue)
  - **Verify**: `src/lib/agent-os/state-machine.test.ts` covers every legal and illegal transition; `src/lib/agent-os/scheduler.test.ts` covers concurrency 429, timeout flip, parent_run_id propagation for `trigger='sub-agent'`
- [x] 1.4.5 Build `context.ts` — `createRunContext(run, kernel)` returning the in-Worker `RunContext` with `messages`, `stepOutputs`, `input`, `beginStep`, `endStep`, `emit`. Default context pruner: keep system prompt + most-recent N messages, summarize the rest. `replayContext(runId)` reconstructs from `EventLogBackend`.
  - **Files**: `src/lib/agent-os/context.ts`, `src/lib/agent-os/context-pruner.ts` (create)
  - **Pattern**: agent-context-manager spec — all 5 requirements
  - **Verify**: `src/lib/agent-os/context.test.ts` covers (a) fresh context per run isolation between two concurrent runs of the same agent, (b) pruning emits `context_pruned` event when token estimate exceeds threshold, (c) `replayContext` reconstructs identical `stepOutputs` from a recorded event stream
- [x] 1.4.6 Build `memory.ts` — `MemoryAPI` impl with `recall`, `write`, `distill`. `recall` runs the 3 retrieval signals in parallel, fuses via RRF k=60 (extract `fuseRRF()` into a pure helper for unit testing), updates `last_read_at` fire-and-forget. `write` returns once D1 row is inserted; Vectorize indexing is `ctx.waitUntil`-style. `distill` is the manually-invocable + cron-driven episodic→semantic op (cron wiring deferred to Phase 4; the function itself ships here).
  - **Files**: `src/lib/agent-os/memory.ts`, `src/lib/agent-os/memory-fusion.ts` (create — pure RRF function)
  - **Pattern**: D5 (4 types × 4 scopes); D5.1 (RRF algorithm); agent-memory spec — all 7 requirements
  - **Verify**: `src/lib/agent-os/memory-fusion.test.ts` asserts known RRF outputs for fixture inputs; `src/lib/agent-os/memory.test.ts` covers (a) cross-scope read throws `AgentAccessDenied` with `reason='cross_agent_memory_scope'`, (b) partial-failure fallback emits `memory_partial`, (c) `'system'` user substitution on cron-triggered writes
- [x] 1.4.7 Build `storage.ts` — thin facade re-exporting backend types and the `createBackends(env)` factory that wires production backends from `Env` bindings. Single entrypoint kernel boot uses.
  - **Files**: `src/lib/agent-os/storage.ts` (create)
  - **Pattern**: agent-storage spec "Storage backend interface"
  - **Verify**: covered indirectly by 1.4.1 kernel boot test
- [x] 1.4.8 Build `access.ts` — `defineAgent(definition)` validator + grant-hash computer + `mirrorPermissions(definition)` writer + `checkSyscall(agentId, syscall)` / `checkMemoryScope(agentId, scope)` / `checkOutboundDomain(agentId, url)` runtime checks. Approval-gate path: `requestApproval({runId, reason, context, ttlSeconds})` inserts row + pauses run, `resolveApproval({approvalId, decision})` updates row + resumes/rejects awaited promise. Daily expiry sweep (`expireStaleApprovals(now)`) is a pure function callable from a cron handler in Phase 4.
  - **Files**: `src/lib/agent-os/access.ts`, `src/lib/agent-os/approval-queue.ts` (create — in-memory promise registry keyed by `approvalId`; resolves on store-write notification; per design D9 + R8, polling integration with Queues is Phase 4)
  - **Pattern**: D8 (declarative grants); D9 (approval interception); Resolution Q4 (24h TTL + per-agent override)
  - **Verify**: `src/lib/agent-os/access.test.ts` covers (a) declared `'system'` login attempt rejected, (b) grant-hash change without version bump throws, (c) `expireStaleApprovals` flips a 25h-old `pending` row to `expired` and rejects the awaiting promise with `AgentApprovalExpired`

### 1.5 Minimal admin API surface (D13)

- [x] 1.5.1 `GET /api/admin/agents` — list registered agents from the in-Worker registry (returns `[]` until Phase 3 migrations). Reuse `requireAdmin` + `json` + `unauthorized` from agent-foundation.
  - **Files**: `src/pages/api/admin/agents/index.ts` (create)
  - **Pattern**: `src/pages/api/admin/pipelines.ts:39-49` (GET handler shape); D13
  - **Verify**: `curl -b 'session=<valid>' http://localhost:4321/api/admin/agents` returns `{agents:[]}` with 200; without cookie returns 401
- [x] 1.5.2 `POST /api/admin/agents/:id/run` — manual invoke; calls `scheduler.dispatchRun({agentId, trigger:'manual', input, userId: 'admin'})`. `requireAdmin` from `agent-foundation` only proves an admin session and does not expose per-user identity yet; `agent-console` RBAC later replaces this reserved `'admin'` actor with real `console_users.user_id`. Returns 404 if agent unknown, 429 if concurrency cap hit (per scheduler spec).
  - **Files**: `src/pages/api/admin/agents/[id]/run.ts` (create)
  - **Pattern**: `src/pages/api/admin/pipelines.ts:51-69` (POST shape, body parse, error→status mapping); agent-scheduler "Three trigger surfaces"
  - **Verify**: with `agentOs.enabled=false` returns 503 `{error:'agent_os_disabled'}`; with flag on + unknown id returns 404; smoke test via a stub agent registered in a vitest fixture returns 200 with `{runId}`
- [x] 1.5.3 `GET /api/admin/agents/runs?status=&agentId=` — paginated list from `RunStoreBackend.list({status, agentId, limit, cursor})`.
  - **Files**: `src/pages/api/admin/agents/runs/index.ts` (create)
  - **Pattern**: D13; existing index/list pattern in `src/pages/api/admin/pipelines.ts:43-49`
  - **Verify**: returns `{runs:[], cursor:null}` when DB empty; `status=running` filter is honored against an in-memory backend
- [x] 1.5.4 `GET /api/admin/agents/runs/:runId` — run detail including events (last 200 from `EventLogBackend.listForRun(runId, {limit:200})`).
  - **Files**: `src/pages/api/admin/agents/runs/[runId]/index.ts` (create)
  - **Pattern**: D13; agent-context-manager "Replay reconstruction"
  - **Verify**: 404 for unknown runId; 200 with `{run, events}` for a fixture run
- [x] 1.5.5 `POST /api/admin/agents/runs/:runId/cancel` — writes `cancel_signal=1` via `CancelSignalBackend.signal(runId)` + `RunStoreBackend.markCancelRequested(runId)`. Returns 409 if run already terminal (per agent-scheduler "Cancellation on terminal status").
  - **Files**: `src/pages/api/admin/agents/runs/[runId]/cancel.ts` (create)
  - **Pattern**: D7 (KV cancel signal); agent-scheduler spec "Cooperative cancellation" + "Cancellation on terminal status"
  - **Verify**: vitest asserts 409 when run status is `done`; 200 + KV `put` called with `agent:cancel:{runId}` and `expirationTtl:600` when run is `running`
- [x] 1.5.6 `GET /api/admin/agents/approvals?status=pending` — list pending approvals from `ApprovalStoreBackend.listByStatus('pending')`.
  - **Files**: `src/pages/api/admin/agents/approvals/index.ts` (create)
  - **Pattern**: D13; agent-access "Approval resolution"
  - **Verify**: returns `{approvals:[]}` when none pending; default `status=pending` when query param omitted
- [x] 1.5.7 `POST /api/admin/agents/approvals/:approvalId/{approve,reject}` — single route file using dynamic segment; calls `access.resolveApproval({approvalId, decision, resolvedBy: 'admin'})` until `agent-console` RBAC introduces real user ids. Returns 409 if approval already resolved/expired.
  - **Files**: `src/pages/api/admin/agents/approvals/[approvalId]/[action].ts` (create — validates `action ∈ {'approve','reject'}`)
  - **Pattern**: agent-access "Approval resolution"
  - **Verify**: vitest covers (a) `approve` resumes the awaiting syscall promise with the handler's return value, (b) `reject` rejects it with `AgentApprovalRejected`, (c) double-approve returns 409
- [x] 1.5.8 Add a top-level disabled-guard helper used by all 7 endpoints: when `flags.agentOs.enabled === false`, short-circuit with 503 `{error:'agent_os_disabled'}`. This is the "no behavior change" enforcement — the routes exist and respond, but cannot mutate anything until the umbrella flag is flipped.
  - **Files**: `src/pages/api/admin/agents/_guard.ts` (create — exports `ensureAgentOsEnabled(): Response | undefined`)
  - **Pattern**: D11 umbrella flag `agentOs.enabled`; "no behavior change yet" goal for this phase
  - **Verify**: integration test boots the dev server with `AGENT_OS_ENABLED=false`, hits all 7 endpoints with a valid admin session, and asserts every response is `503 {error:'agent_os_disabled'}`; flipping the env var to `true` flips them to their normal 200/404/409 behavior

---

## Phase 2 — Wrap existing tools as syscalls

**Goal**: Register every current RAG/pipeline tool in `src/lib/tools/registry.ts` as an MCP-compatible `ToolDefinition` so that when Phase 3 migrates agents through the syscall ABI, there is something for them to call — without touching any agent code or breaking any existing direct-import caller.
**Files touched**: ~10 new (`register-defaults.ts`, 7 wrapper modules with co-located parity tests), ~2 modified (the two `src/lib/tools/definitions/*.ts` files moved by `agent-foundation` gain `defineSyscall` exports; the pipeline adapter is verified).
**Verification**: parity vitest per tool (syscall path vs. legacy direct-import on the same input → outputs structurally equal); legacy direct-import sites unchanged (`pnpm lint && pnpm test` green); telemetry smoke check confirms `agent_tool_calls` rows are written with `cost_usd`, `tokens_in/out`, `latency_ms` populated.

### 2.1 Wrap shared tools (from `src/lib/tools/definitions/`)

- [x] 2.1.1 Register `search.external` syscall around `searchExternalTools`
  - **Files**: `src/lib/tools/definitions/external-search.ts` (add `export const searchExternalSyscall = defineSyscall({...})` alongside existing function; do **not** change `searchExternalTools` signature or callers); `src/lib/agent-os/tools/register-defaults.ts` (new — central place that imports every syscall definition and calls `registry.register`)
  - **Input schema** (sketch): `{ query: string (required), limit?: number (default 5), timeoutMs?: number (default 8000), providers?: string[] (enum of jina|cloudflare|posts|docs|tavily|firecrawl|exa|linkup|brave|bocha|brightdata|serper|serpapi), apiKeys?: Record<string,string> }`
  - **Output schema** (sketch): `{ results: SearchResult[] }` — wrap the array so the JSON Schema has a stable object root; handler maps `searchExternalTools(input)` → `{ results }`
  - **Cost model**: `{ kind: 'request', perCallUsd: 0 }` placeholder — real per-provider rates land in `agent-providers`
  - **Outbound domain hint**: handler declares the set of hosts hit per provider so the kernel's outbound-domain check has data when agents narrow `outboundDomains`
  - **Verify**: `src/lib/tools/definitions/external-search.test.ts` — call `searchExternalSyscall.handler(ctx, input)` and `searchExternalTools(input)` with `providers: ['posts']` (deterministic, no network) and assert `out.results` deep-equals legacy return value

- [x] 2.1.2 Register `post.get-detail` syscall around `getPostDetail`
  - **Files**: `src/lib/tools/definitions/get-post-detail.ts` (add `defineSyscall`; keep existing LangChain `tool()` export so any direct importer still works); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ slug: string (required, pattern: ^[a-z0-9-/]+$) }`
  - **Output schema** (sketch): `{ markdown: string, found: boolean }` — wraps the legacy `string` return into a structured object; handler returns `{ markdown: legacyReturn, found: !legacyReturn.startsWith('Post "') }`
  - **Cost model**: `{ kind: 'request', perCallUsd: 0 }` (pure D1 read)
  - **Awkwardness flag**: legacy export is a LangChain `tool(...)` with Zod schema, not a plain function. The wrapper invokes the underlying handler directly (the closure passed to `tool()`), bypassing LangChain's tool-call envelope, so the syscall returns the raw post markdown rather than a LangChain ToolMessage
  - **Verify**: `src/lib/tools/definitions/get-post-detail.test.ts` — seed D1 with a known post, call both paths with the same slug, assert `syscallOut.markdown === legacyOut` (legacy is a bare string)

- [x] 2.1.3 Register `model.invoke` syscall around `invokeModel` (thin pass-through wrapper; `agent-providers` later replaces with the typed multi-provider router)
  - **Files**: `src/lib/tools/definitions/model-invoke.ts` (create — `export const modelInvokeSyscall = defineSyscall({...})` that calls the existing `invokeModel` from `src/lib/rag/model.ts` unchanged); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ stage: 'planner'|'research'|'writer'|'critic'|string, messages: BaseMessageLike[], maxTokens?: number, apiKeys?: Record<string,string>, skillInstructions?: string }`
  - **Output schema** (sketch): `{ response: AIMessage, route: { provider: string, model: string }, tokens?: { input: number, output: number } }` — mirrors what `invokeModel` already returns; preserves token counters for telemetry
  - **Cost model**: `{ kind: 'token', inputPerKToken: 0, outputPerKToken: 0 }` placeholder — real per-provider rates land in `agent-providers` Phase 2 when it replaces this handler with the typed router
  - **Why this exists**: Phase 3 agent migrations (`critic`, `writer`, `research`, `planner`) all call `ctx.syscall('model.invoke', ...)` but `agent-providers` (which ships the proper handler) is change #2 ordered AFTER `agent-os`. This thin wrapper lets agent-os complete its full migration before `agent-providers` lands; the underlying call still goes to `invokeModel`, so there is zero behavior change for v1 of the syscall
  - **Verify**: `src/lib/tools/definitions/model-invoke.test.ts` — stub `invokeModel` to return a known shape; call `modelInvokeSyscall.handler(ctx, input)` and the original `invokeModel(...)` with the same input, assert outputs deep-equal; confirm `agent_tool_calls` row is written with `syscall_name='model.invoke'` and non-zero `latency_ms`

### 2.2 Wrap RAG-specific tools (stay in `src/lib/rag/tools/`)

- [x] 2.2.1 Register `search.posts` syscall around `searchBlogPosts`
  - **Files**: `src/lib/rag/tools/search-posts.ts` (add `defineSyscall` next to existing function; existing callers — `external-search.ts`, `src/lib/rag/agents/research.ts` — unchanged); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ query: string (required), category?: string, lang?: 'zh-TW'|'en', limit?: number (default 8), shortCircuit?: boolean (default true) }`
  - **Output schema** (sketch): `{ results: SearchResult[], metrics?: SearchMetrics }` — promote the non-enumerable `metrics` property attached by `attachSearchMetrics` into an explicit output field so it survives JSON round-tripping
  - **Cost model**: `{ kind: 'token', inputPerKToken: 0, outputPerKToken: 0 }` — Workers AI BGE embedding call (`@cf/baai/bge-large-en-v1.5`) consumes tokens but is currently free on the bound `AI` plan; placeholder `0`/`0` keeps the row shape correct, real numbers come from `agent-providers`
  - **Verify**: `src/lib/rag/tools/search-posts.test.ts` — call both with seeded `posts`/`post_chunks` fixtures and `shortCircuit: true` (deterministic, no Vectorize call), assert `syscallOut.results` deep-equals legacy array and `syscallOut.metrics` equals `getSearchMetrics(legacy)`

- [x] 2.2.2 Register `search.docs` syscall around `searchDocs`
  - **Files**: `src/lib/rag/tools/search-docs.ts` (add `defineSyscall`); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ query: string (required), source_name?: string, limit?: number (default 8), shortCircuit?: boolean (default true) }`
  - **Output schema** (sketch): `{ results: SearchResult[], metrics?: SearchMetrics }` — same `metrics` lift as 2.2.1
  - **Cost model**: same as `search.posts` — `{ kind: 'token', inputPerKToken: 0, outputPerKToken: 0 }` placeholder
  - **Verify**: `src/lib/rag/tools/search-docs.test.ts` — seed `doc_chunks` + `chunks_fts`, call both with `shortCircuit: true`, assert structural equality of results and metrics

- [x] 2.2.3 Register `search.abstract-index` syscall around `searchAbstractIndex`
  - **Files**: `src/lib/rag/tools/search-abstract-index.ts` (add `defineSyscall`); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ query: string (required), limit?: number (default 5) }`
  - **Output schema** (sketch): `{ results: SearchResult[] }`
  - **Cost model**: `{ kind: 'token', inputPerKToken: 0, outputPerKToken: 0 }` placeholder (one BGE embedding call per invocation)
  - **Conditional registration**: handler should short-circuit to `{ results: [] }` when `VECTORIZE_ABSTRACT` is unbound (legacy behavior) so the parity test doesn't require the binding
  - **Verify**: `src/lib/rag/tools/search-abstract-index.test.ts` — with `VECTORIZE_ABSTRACT` undefined, assert both paths return `[]`; with a stub Vectorize backend, assert results match

- [x] 2.2.4 Register `search.pageindex` syscall around `pageIndexSearch`
  - **Files**: `src/lib/rag/tools/pageindex.ts` (add `defineSyscall`); register in `register-defaults.ts`
  - **Input schema** (sketch): `{ query: string (required), seed: SearchResult (required, JSON-Schema object — see awkwardness below), maxSteps?: number (default 5), limit?: number (default 3) }`
  - **Output schema** (sketch): `{ results: SearchResult[] }`
  - **Cost model**: `{ kind: 'request', perCallUsd: 0 }` (D1-only neighborhood fetch)
  - **Awkwardness flag**: `seed` is a full `SearchResult` object with ~10 fields including a polymorphic `type` discriminator (`'post' | 'doc' | 'abstract' | 'custom'`) and conditional `slug` / `title`. Expressing this as JSON Schema requires either (a) a verbose `oneOf` per type, or (b) a permissive `additionalProperties: true` shape with `chunk_id` + `type` + `source_url` marked required and the rest loosely typed. Recommend (b) for v1 — the agent always passes a value previously returned by another `search.*` syscall, so the shape is implicitly validated upstream; document this decision in the schema's `description`
  - **Verify**: `src/lib/rag/tools/pageindex.test.ts` — seed both `post_chunks` and `doc_chunks` neighborhoods, call both paths with a known seed of each `type`, assert structural equality

### 2.3 Pipeline registry adapter verification

- [x] 2.3.1 Confirm `src/lib/pipelines/tool-registry.ts` adapter (introduced by `agent-foundation`) surfaces every Phase-2 syscall under the legacy `{id, title, kind, runtime, description}` shape via `listTools()` / `getToolDefinition(id)`
  - **Files**: `src/lib/pipelines/tool-registry.test.ts` (new) — call `listTools()` and assert each of the 7 syscall names registered in 2.1–2.2 appears in the adapter output; assert `validateToolAllowlist()` still passes for every existing pipeline definition in `src/lib/pipelines/definitions/*.ts`
  - **Mapping rule**: adapter derives `kind` from a heuristic — `search.*` → `'api'`, `post.get-detail` → `'cloud_read'`, anything with `requiresApproval: true` → `'artifact'`; pipeline tool ids that do not exist in the central registry (e.g. `write_draft_artifact`, `run_content_ops`) stay declared locally in the adapter as "pipeline-only" entries so the pipeline runner is undisturbed
  - **Verify**: `pnpm test src/lib/pipelines/tool-registry.test.ts` green; `pnpm session:start` (lint) clean

### 2.4 Telemetry smoke check

- [x] 2.4.1 In a local dev session (`pnpm dev` with `AGENT_OS_ENABLED=true` temporarily), issue 5 syscalls covering each cost model and storage backend — one each of `search.external` (request cost, network fetch), `post.get-detail` (request cost, D1 read), `search.posts` (token cost placeholder, hybrid D1+Vectorize), `search.abstract-index` (token cost placeholder, Vectorize-only), `search.pageindex` (request cost, pure D1) — via a temporary admin endpoint or vitest harness that spins up a real run via the kernel
  - **Verify**: `SELECT syscall_name, count(*), avg(latency_ms), sum(cost_usd), sum(tokens_in), sum(tokens_out) FROM agent_tool_calls WHERE run_id = ? GROUP BY syscall_name` returns exactly 5 rows, each with `count = 1`, non-null `latency_ms > 0`, `cost_usd = 0` (placeholder rates), and `tokens_in/out` populated for the two `search.*` rows that call `AI.run`
  - **Cleanup**: delete the temporary harness/endpoint after the assertion; flip `AGENT_OS_ENABLED` back to `false`; this task ships no production code, only confirms instrumentation works end-to-end before Phase 3 starts flipping agent flags

---

## Phase 3 — Migrate agents (one per flag, strict order)

**Goal**: Port the four LangGraph nodes (`critic`, `writer`, `research`, `planner`) to run on the agent-os kernel via `defineAgent` + syscall ABI, keeping the legacy path fully intact behind per-agent feature flags so every flip is reversible without a redeploy.
**Order**: critic → writer → research → planner (smallest blast radius first — critic only scores existing drafts; planner gates the entire graph entry point)
**Per-agent flag gate**: each migration ships with `AGENT_OS_<AGENT>=false` default; flip ON in production after parity tests pass; observe 1 week before next agent
**Pre-req for entire phase**: `AGENT_OS_ENABLED=true` in production (the umbrella flag must be on for any agent migration to take effect)
**Files touched**: ~6 per agent (agent file + flag entry + graph dispatch line + parity test + telemetry query notes + design.md Resolution), ~25 total + the dispatch shim + cleanup
**Verification**: parity tests (structural diff allowing LLM text nondeterminism) + 1-week production parity observation per agent (`agent_runs` error rate, p50/p95 latency, token cost vs legacy baseline from `model_usage`)

### 3.0 Graph dispatch shim

- [x] 3.0.1 Modify `src/lib/rag/graph.ts:buildGraph()` so each of the four migrated nodes dispatches to legacy or kernel path based on `flags.agentOs.<agentId>`
  - **Files**: `src/lib/rag/graph.ts` (modify node registrations at lines 46, 47, 49, 51)
  - **Pattern**: introduce `dispatchNode(agentId, legacyFn, kernelFn)` helper that reads `flags.agentOs[agentId]` once at node entry and routes; both paths receive the same `GraphState` and return `Partial<GraphState>`. Default to legacy when flag is `false` or kernel registration is missing.
  - **Why**: keeps `buildGraph()` topology, channels, conditional edges (`shouldRetry`, `shouldDegrade`) and `runPipeline` streaming behavior unchanged — only the per-node executor swaps
  - **Verify**: `pnpm build` succeeds; `pnpm vitest run src/lib/rag/graph.test.ts` passes; existing critic-routing tests still green
- [x] 3.0.2 Add a kernel-side `runAgentNode(agentId, state, options)` adapter in `src/lib/agent-os/langgraph-adapter.ts` that: (a) opens an `agent_runs` row with `trigger='sub-agent'` and `parent_run_id=state.thread_id`, (b) builds `SyscallContext` from `GraphState` (`scope={orgId:'1',userId:'system',agentId,sessionId:state.thread_id}`, `signal` from kernel cancel KV check), (c) invokes the registered agent's `run`, (d) maps the agent's return into `Partial<GraphState>` (preserving `token_usage`, `model_usage`, `iteration` semantics)
  - **Verify**: unit test confirms the adapter writes `agent_run_events` for `started` / `finished` and propagates errors through to LangGraph as the legacy shape

### 3.1 Migrate `critic` (smallest, lowest risk — scores already-generated drafts, no state mutation outside `critique` channel)

- [x] 3.1.1 Add `AGENT_OS_CRITIC: env('AGENT_OS_CRITIC', false)` to `src/lib/config/flags.ts` under `flags.agentOs.critic`; surface the env var in `wrangler.jsonc` `vars` block
- [x] 3.1.2 Wrap the existing critic logic in `src/lib/rag/agents/critic.ts` with `defineAgent`:
  - `id: 'critic'`, `version: 1`
  - `syscalls: ['model.invoke', 'memory.read']`
  - `memoryScopes: ['agent']`
  - `secrets: []` (provider API keys flow via existing `ProviderApiKeys` plumbing → routed through `model.invoke`)
  - `outboundDomains: []` (critic makes no direct HTTP)
  - `toolCallLimit: 5`, `timeoutSeconds: 60`, `irreversibleActionsRequireApproval: false`
  - **Deviation flag**: critic does not write memory (it only emits `critique` back into `GraphState`); confirms playbook grants are correct
- [x] 3.1.3 Replace `import { invokeModel } from '../model'` with a call inside `run`:
  ```ts
  const { response, route } = await ctx.syscall('model.invoke', {
    stage: 'critic', messages, maxTokens, apiKeys: ctx.input.apiKeys
  })
  ```
  Keep the JSON-parse → `Critique` mapping and `token_usage` / `model_usage` accumulation identical so downstream `shouldRetry` / `shouldDegrade` see the same shape
- [x] 3.1.4 Register `criticAgent` in `src/lib/agent-os/registry.ts` and wire `dispatchNode('critic', criticNode, runCriticKernel)` in `graph.ts`
- [x] 3.1.5 Add parity test `src/lib/rag/agents/critic.parity.test.ts`:
  - Fixture: 3 canned `GraphState` snapshots (one passing, one with ungrounded claim, one with drift)
  - Stub `model.invoke` to return a deterministic JSON response for both legacy and kernel paths
  - Assert structural equality of returned `critique.{drift_detected, ungrounded_claims, gaps}`, `model_usage` length, and `token_usage` deltas; allow `confidence` / `answer_relevance` / `intent_alignment` to differ by ≤0.01
  - Run `shouldRetry` / `shouldDegrade` on both outputs and assert identical routing decision
- [ ] 3.1.6 Deploy with `AGENT_OS_CRITIC=false`; smoke-test `/api/rag` to confirm legacy path untouched, then flip `AGENT_OS_CRITIC=true` in production via `wrangler secret put` (or `vars` redeploy) and observe 1 week
  - **Metrics queries** (run against D1):
    ```sql
    -- error rate
    SELECT date(started_at/1000,'unixepoch') d, status, count(*) FROM agent_runs WHERE agent_id='critic' GROUP BY 1,2;
    -- p50 / p95 latency
    SELECT round(avg(latency_ms)) avg_ms, max(latency_ms) max_ms FROM agent_tool_calls WHERE syscall_name='model.invoke' AND run_id IN (SELECT run_id FROM agent_runs WHERE agent_id='critic' AND started_at > strftime('%s','now','-7 days')*1000);
    -- token cost vs legacy baseline (compare against prior week's rag_telemetry critic stage)
    SELECT sum(total_tokens), sum(total_cost_usd) FROM agent_runs WHERE agent_id='critic' AND started_at > strftime('%s','now','-7 days')*1000;
    ```
  - **Gate to advance**: error rate ≤ legacy + 0.5pp, p95 latency ≤ legacy × 1.2, token cost ≤ legacy × 1.1; otherwise rollback (`AGENT_OS_CRITIC=false`) and record a Resolution in `design.md`

### 3.2 Migrate `writer`

- [x] 3.2.1 Add `AGENT_OS_WRITER` flag entry to `flags.ts` + wrangler vars
- [x] 3.2.2 Wrap `writerNode` in `src/lib/rag/agents/writer.ts` with `defineAgent`:
  - `id: 'writer'`, `version: 1`
  - `syscalls: ['model.invoke', 'memory.read', 'search.docs']`
  - `memoryScopes: ['agent', 'session']`
  - `toolCallLimit: 10`, `timeoutSeconds: 180`, `irreversibleActionsRequireApproval: false`
  - **Deviation flag**: today's `writer.ts` does NOT call `search.docs` (it only consumes `state.search_results` populated upstream); grant is forward-looking for the post-migration "writer self-recalls examples" use case but should be flagged as unused at code-review time. Suggest narrowing to `['model.invoke', 'memory.read']` until a real use case appears.
- [x] 3.2.3 Replace `invokeModel(state.config, 'writer', ...)` with `ctx.syscall('model.invoke', { stage: 'writer', messages, maxTokens, apiKeys })`; preserve `draft` / `final_response` / `iteration` write-back exactly (writer's `iteration` increment drives `shouldRetry`)
- [x] 3.2.4 Register `writerAgent` in registry; wire `dispatchNode('writer', writerNode, runWriterKernel)` in `graph.ts`
- [x] 3.2.5 Parity test `src/lib/rag/agents/writer.parity.test.ts`:
  - 3 fixture states (factual / recommendation intent / low-confidence requiring disclaimer)
  - Stub `model.invoke` to return canned Markdown; assert structural fields (`iteration` increment, `model_usage[-1].stage === 'writer'`, `final_response === draft`, `token_usage` deltas) match across paths
  - Treat `draft` text content as a soft-check (length within ±10%, contains expected citation markers) since LLM stub equality is brittle
- [ ] 3.2.6 Deploy flag-off, then flip `AGENT_OS_WRITER=true`; observe 1 week using the same SQL queries with `agent_id='writer'`; additional check: validate `validation.passed` rate has not regressed (writer output drives `deterministic_validation` node)

### 3.3 Migrate `research` (most syscalls, highest blast radius — touches all retrieval tools)

- [x] 3.3.1 Add `AGENT_OS_RESEARCH` flag entry to `flags.ts` + wrangler vars
- [x] 3.3.2 Wrap `researchNode` in `src/lib/rag/agents/research.ts` with `defineAgent`:
  - `id: 'research'`, `version: 1`
  - `syscalls: ['model.invoke', 'memory.read', 'memory.write', 'search.external', 'search.posts', 'search.abstract-index', 'search.docs', 'search.pageindex', 'post.get-detail']`
  - `memoryScopes: ['agent', 'session']`
  - `secrets: ['TAVILY_API_KEY', 'EXA_API_KEY']` (currently passed in via `apiKeys`; the kernel will resolve them from the secrets allowlist instead)
  - `outboundDomains: ['*.tavily.com', '*.exa.ai']`
  - `toolCallLimit: 20`, `timeoutSeconds: 300`, `irreversibleActionsRequireApproval: false`
  - **Deviation flag**: playbook lists `search.docs` and `search.page-index` separately from `search.posts` (both used at lines 143-149 + 170-179 of `research.ts`); ensure Phase 2 tool wrapping registered all 6 syscall names exactly so the grant matches the registry. The playbook in the brief omitted `search.docs` and `search.page-index` — flag this for the reviewer.
- [x] 3.3.3 Replace the 3 `invokeModel` call sites (`generateQueryAlternatives`, `generateHydeQuery`, plus the `model_usage` push at line 189) with `ctx.syscall('model.invoke', { stage: 'research', ... })`; replace every direct tool import (`searchBlogPosts`, `searchAbstractIndex`, `searchDocs`, `pageIndexSearch`, `searchExternalTools`) with the matching `ctx.syscall(...)`; preserve `mergeUniqueResults` and `Promise.all` parallelism
- [x] 3.3.4 Register `researchAgent`; wire `dispatchNode('research', researchNode, runResearchKernel)` in `graph.ts`
- [x] 3.3.5 Parity test `src/lib/rag/agents/research.parity.test.ts`:
  - 4 fixtures: simple factual (no HyDE, no multi-query, no page-index), complex with HyDE on, complex with multi-query, complex with page-index enabled
  - Stub all 6 syscalls deterministically; assert `search_results` length, unique `chunk_id` set, `retrieval_metrics.length`, and `model_usage` are structurally identical (LLM-driven query rewrites tolerated within ±1 query count)
- [ ] 3.3.6 Deploy flag-off, then flip `AGENT_OS_RESEARCH=true`; observe 1 week; additional metric beyond the standard 3:
  ```sql
  -- per-syscall fan-out (research has the biggest tool budget — watch for runaway)
  SELECT syscall_name, count(*) calls, round(avg(latency_ms)) avg_ms FROM agent_tool_calls WHERE run_id IN (SELECT run_id FROM agent_runs WHERE agent_id='research' AND started_at > strftime('%s','now','-7 days')*1000) GROUP BY 1 ORDER BY 2 DESC;
  -- tool_call_limit hit rate (should be ~0)
  SELECT count(*) FROM agent_runs WHERE agent_id='research' AND error_json LIKE '%tool_call_limit%';
  ```

### 3.4 Migrate `planner` (smallest grants but highest blast radius — gates entry to whole graph)

- [x] 3.4.1 Add `AGENT_OS_PLANNER` flag entry to `flags.ts` + wrangler vars
- [x] 3.4.2 Wrap `plannerNode` in `src/lib/rag/agents/planner.ts` with `defineAgent`:
  - `id: 'planner'`, `version: 1`
  - `syscalls: ['model.invoke', 'memory.read']`
  - `memoryScopes: ['agent']`
  - `toolCallLimit: 5`, `timeoutSeconds: 30`, `irreversibleActionsRequireApproval: false`
  - **Deviation flag**: planner is on the critical path — a kernel-side error breaks the entire RAG pipeline. Lower the timeout from the playbook's 30s only if the legacy p99 is well under it; otherwise keep 30s
- [x] 3.4.3 Replace `invokeModel(state.config, 'planner', ...)` with `ctx.syscall('model.invoke', { stage: 'planner', messages: [new HumanMessage(prompt)], maxTokens, apiKeys })`; preserve JSON parsing → `Plan` mapping and the `language` extraction
- [x] 3.4.4 Register `plannerAgent`; wire `dispatchNode('planner', plannerNode, runPlannerKernel)` in `graph.ts`
- [x] 3.4.5 Parity test `src/lib/rag/agents/planner.parity.test.ts`:
  - 5 fixtures covering all 7 intents (factual, summary, code, comparison, exploratory, recommendation, off-topic) and `needs_clarification=true`
  - Stub `model.invoke` to return canned JSON; assert `plan.intent`, `plan.complexity`, `plan.needs_clarification`, `language`, `model_usage[-1].stage === 'planner'` match exactly across both paths
  - Critical: verify the conditional edge `planner → END | research` (line 57-59 of `graph.ts`) takes the same branch for both paths
- [ ] 3.4.6 Deploy flag-off, then flip `AGENT_OS_PLANNER=true`; observe 1 week; additional check beyond the standard 3: confirm `plan.intent` distribution matches the prior week's distribution within ±5pp per intent class (planner drift here cascades into every downstream stage)

### 3.5 Cleanup

- [ ] 3.5.1 Remove legacy direct-import fallback paths for migrated agents (only after all 4 have been ON in prod for ≥1 week with no rollback)
  - **Files**: delete or simplify `src/lib/rag/agents/{critic,writer,research,planner}.ts` legacy bodies (keep only the `defineAgent`-wrapped form); remove the `dispatchNode` shim from `src/lib/rag/graph.ts` and inline the kernel adapter call
  - **Verify**:
    - `grep -r "from '../model'" src/lib/rag/agents/` returns no hits
    - `grep -rn "import.*invokeModel" src/lib/rag/agents/` returns no hits
    - `pnpm vitest run` all green
    - `pnpm build && pnpm check:references` succeed
- [ ] 3.5.2 Bump `version: 2` on all four agents in `defineAgent` (Phase 2 had them at 1) and let the deploy-time mirror update `agent_permissions.updated_at`; confirm the migration trail is visible in `agent_processes`
- [ ] 3.5.3 Remove the per-agent flags from `flags.ts` and `wrangler.jsonc` (umbrella `agentOs.enabled` still gates the kernel itself); document the removal in `design.md` Resolutions section as "Q6 → per-agent flags retired YYYY-MM-DD after 4× 1-week observation windows"
  - **Why**: keeping dead flags rots the config; the umbrella flag is the new kill-switch

---

## Phase 4 — Enable scheduler trigger surfaces

**Goal**: Turn on cron-trigger HTTP fan-out and Cloudflare Queues consumer paths so the kernel can dispatch runs from all three trigger sources (`manual`, `cron`, `queue`) end-to-end in production.
**Pre-req**: Phase 3 has at least `critic` migrated and stable in prod (`AGENT_OS_CRITIC=true` for 7 consecutive days with zero parity drift)
**Files touched**: ~6 new, ~4 modified
**Verification**: cron-triggered run appears in `agent_runs` with `trigger='cron'`; queue-triggered run appears with `trigger='queue'`; `denied: queues disabled` event recorded when flag is off

### 4.1 Cron trigger HTTP endpoint

- [x] 4.1.1 Create `src/lib/agent-os/scheduler/cron-registry.ts` exporting `scheduledAgentEntries: ScheduledAgentEntry[]` (mirror the shape of `scheduledPipelineEntries` in `src/pages/api/admin/pipelines.ts:24-37`); each entry carries `{ agentId, cron, label?, input?, timezone? }` and is the single source of truth for which agents fire on which cron
- [x] 4.1.2 Create `src/pages/api/admin/agents/scheduled.ts` mirroring `src/pages/api/admin/pipelines/scheduled.ts` exactly — `export const prerender = false`, dual-auth via `verifySession(cookies)` OR `X-Crawl-Secret` header (import the shared helper `getRequestSource` from `src/lib/auth/scheduled-auth.ts` shipped by agent-foundation rather than re-implementing)
- [x] 4.1.3 Endpoint body parses `{ agentId?: string; cronExpression?: string; input?: Record<string, unknown> }`; if `agentId` provided dispatch that one entry, else look up all entries whose `cron === cronExpression` and dispatch them; reject with HTTP 400 if neither matches
- [x] 4.1.4 For each dispatched entry call `kernel.scheduler.dispatch({ agentId, trigger: 'cron', scope: { userId: 'system', sessionId: \`cron-${isoDate}\` }, input })` and collect `{ runId, status }` into the response body
- [x] 4.1.5 Extend `GET /api/admin/agents` (created in Phase 1) to include `schedules: scheduledAgentEntries` in the response payload so operators can see which crons are wired

### 4.2 Queues binding + consumer

- [x] 4.2.1 Run `wrangler queues create agent-queue --message-retention-period 345600` (4-day retention) and capture the queue id; add `[[queues.producers]]` (binding `AGENT_QUEUE`) AND `[[queues.consumers]]` (queue `agent-queue`, `max_batch_size: 1`, `max_batch_timeout: 5`, `max_retries: 3`, `dead_letter_queue: agent-queue-dlq`) to `wrangler.jsonc`; create the DLQ with `wrangler queues create agent-queue-dlq`
- [x] 4.2.2 Astro's Cloudflare adapter exposes the default Worker via the build output but does not natively forward `queue()` handlers — create `src/server/queue.ts` exporting `async function handleQueueBatch(batch, env, ctx)` and document in `src/server/queue.ts` header that this is invoked from the generated deploy entry written by `scripts/create-cron-entry.mjs` (record this architectural choice in `docs/agent-os-runbook.md` since the adapter has no convention)
- [x] 4.2.3 Inside `handleQueueBatch`, for each message: parse `{ agentId, input, parentRunId? }`; if `flags.agentOs.scheduler.queues === false` call `msg.ack()` after writing one `agent_run_events` row with `kind='denied'`, `payload_json={reason:'queues_disabled'}` (per spec scenario "Queues disabled by flag"); otherwise dispatch via `kernel.scheduler.dispatch({ agentId, trigger: 'queue', input, parentRunId })` and `msg.ack()` on success, `msg.retry({ delaySeconds: 30 })` on transient error
- [x] 4.2.4 Add admin helper `POST /api/admin/agents/:id/enqueue` (session-auth only) that calls `env.AGENT_QUEUE.send({ agentId, input })` so operators can hand-test the queue path without a real producer

### 4.3 External cron orchestrator wiring + smoke tests

- [x] 4.3.1 Decision: Cloudflare Cron Triggers fire the Worker's `scheduled()` handler, NOT arbitrary HTTP endpoints — register one new cron entry `"*/15 * * * *"` in `wrangler.jsonc` `triggers.crons`, and extend the generated `dist/cron-entry.js` from `scripts/create-cron-entry.mjs` to iterate `scheduledAgentEntries` and for each whose `cron` matches the current tick (use the `event.cron` string equality) POST to `/api/admin/agents/scheduled` with the `X-Crawl-Secret` header — document this in `docs/agent-os-runbook.md` and note third-party alternatives (GitHub Actions cron, Upstash QStash) for users who need finer-grained schedules than Cron Triggers supports
- [ ] 4.3.2 Cron smoke test: manually `curl -X POST https://quidproquo.cc/api/admin/agents/scheduled -H "X-Crawl-Secret: $CRAWL_SECRET" -d '{"cronExpression":"0 4 * * SUN"}'`, then verify `SELECT run_id, trigger, status FROM agent_runs WHERE trigger='cron' ORDER BY started_at DESC LIMIT 1;` returns the new row within 60s
- [ ] 4.3.3 Queue smoke test: `curl -X POST https://quidproquo.cc/api/admin/agents/critic/enqueue -b "session=..." -d '{"input":{...}}'`, then verify `SELECT run_id, trigger FROM agent_runs WHERE trigger='queue' ORDER BY started_at DESC LIMIT 1;` returns the new row; confirm `wrangler queues consumer status agent-queue` shows zero backlog
- [ ] 4.3.4 Flip `AGENT_OS_SCHEDULER_QUEUES=true` in production env vars (Cloudflare dashboard → Worker settings → Variables) ONLY after both smoke tests pass and `critic` is still stable; redeploy with `pnpm deploy`; update `progress.txt` with `Phase 4 complete: scheduler triggers live (cron+queue)`

---

## Phase 5 — Enable R2 memory tier

**Goal**: Provision the `R2_AGENT_MEMORY` bucket and flip `AGENT_OS_MEMORY_R2=true` so memory writes >256KB transparently offload to R2 while small writes stay inline in D1.
**Pre-req**: Phase 3 complete for at least one agent that performs large writes (`research` is the recommended candidate — it stores full search-result payloads that routinely exceed 256KB)
**Files touched**: ~2 new, ~2 modified
**Verification**: R2 bucket contains objects under `memory/{scope_key}/{itemId}` after a large write; `agent_memory_items.body_json` contains `r2Key`; small (<256KB) writes still have `body_text` populated and `body_json.r2Key` is absent (no regression)

### 5.1 Provision R2 bucket and binding

- [x] 5.1.1 Run `wrangler r2 bucket create quidproquo-agent-memory` (production); verify with `wrangler r2 bucket list` that the bucket appears
- [x] 5.1.2 Add R2 binding to `wrangler.jsonc` `r2_buckets[]` alongside the existing `R2_IMAGES` entry: `{ "binding": "R2_AGENT_MEMORY", "bucket_name": "quidproquo-agent-memory" }`; deploy with `pnpm deploy` and confirm via `wrangler tail` that the Worker boots without binding errors (per agent-storage spec "Binding present, flag off" scenario, no R2 traffic should occur yet)
- [x] 5.1.3 Verify the central `Env` type at `src/lib/config/env.ts` (shipped by agent-foundation) already includes `R2_AGENT_MEMORY: R2Bucket`; if missing, add it and re-run `pnpm lint` + `pnpm exec astro check`

### 5.2 Flip the flag and verify both paths

- [x] 5.2.1 Audit `src/lib/agent-os/memory.ts` — confirm the `write()` path checks `Buffer.byteLength(body, 'utf8') > inline_max_bytes` (default 256KB from spec) AND `flags.agentOs.memory.r2` before invoking `R2_AGENT_MEMORY.put(\`memory/${scope_key}/${item_id}\`, body)`; small writes MUST take the inline branch unchanged
- [ ] 5.2.2 Flip `AGENT_OS_MEMORY_R2=true` in production env (Cloudflare dashboard); redeploy via `pnpm deploy`
- [ ] 5.2.3 Large-write smoke: trigger a `research` run on a topic with 10+ search results; query `SELECT item_id, length(body_text) AS inline_len, json_extract(body_json, '$.r2Key') AS r2_key FROM agent_memory_items WHERE memory_type='episodic' ORDER BY written_at DESC LIMIT 5;` — at least one row MUST have `r2_key` populated and `inline_len < 100` (since body offloaded)
- [ ] 5.2.4 Confirm the object exists: `wrangler r2 object get quidproquo-agent-memory memory/{scope_key}/{item_id} --file /tmp/recall.txt` and `wc -c /tmp/recall.txt` shows >256KB
- [ ] 5.2.5 Small-write non-regression smoke: trigger a `critic` run (which writes short scores ~1KB); query the same SQL and confirm those rows have `r2_key IS NULL` AND `inline_len > 0` — proves the inline path is preserved for typical writes
- [x] 5.2.6 Recall round-trip: call `memory.recall()` against the large item, assert the abstraction layer transparently fetches from R2 and returns the full body (the agent code MUST NOT see the R2 indirection)
- [ ] 5.2.7 Negative test (rollback safety): temporarily flip flag back to `false`, attempt a >256KB write, confirm `MemoryBodyTooLarge` is thrown (per spec "Large write with R2 disabled"); re-flip to `true`; update `progress.txt` with `Phase 5 complete: R2 memory tier live for research`

---

## Phase 6 — Verification & dogfood

**Goal**: Ship a kernel-health endpoint, write an operator runbook with copy-paste SQL/curl recipes, wire alerting hooks, and archive the OpenSpec change once the 7-day production dashboard is green.
**Pre-req**: Phases 1–5 done; at least one agent (`critic`) has been on the kernel for 7+ days with parity and stability proven
**Files touched**: 1 new endpoint + `docs/agent-os-runbook.md` + 1 small alerting module
**Verification**: 7-day production health dashboard green (no failed runs >5%, p95 latency within SLO, zero unresolved approvals >24h, D1 write rate <50% of cap); `openspec validate agent-os --strict` passes; `openspec archive agent-os` succeeds

### 6.1 Health endpoint

- [x] 6.1.1 Create `src/pages/api/admin/agents/health.ts` with `export const prerender = false` and `GET` handler gated by `requireAdmin` (from agent-foundation `src/lib/auth/admin.ts`); response shape: `{ processes: number, runs: { running: number, queued: number, failed_24h: number }, cost: { avg_usd_per_run_24h: number, total_usd_24h: number }, approvals: { pending: number, pending_over_24h: number }, memory: { items_total: number, r2_bytes: number | null } }`
- [x] 6.1.2 Implement queries as a single `DB.batch([...])` for efficiency: see SQL in 6.2.2 for exact statements; `memory.r2_bytes` returns `null` when `flags.agentOs.memory.r2 === false`, else sums `length(body_text)` for rows where `r2_key IS NOT NULL` (cheap proxy without R2 list call)
- [x] 6.1.3 Smoke: `curl https://quidproquo.cc/api/admin/agents/health -b "session=..."` returns 200 with non-zero `processes` (matches `SELECT COUNT(*) FROM agent_processes`)

### 6.2 Runbook + dashboards

- [x] 6.2.1 Create `docs/agent-os-runbook.md` with sections: "Trigger surfaces (manual / cron / queue)", "Cancel a runaway run", "Approve / reject a pending action", "Inspect a failed run's event log", "Rollback a migrated agent", "R2 memory disable", "Cron orchestrator wiring (the chosen `scheduled()` handler shim)"
- [x] 6.2.2 In the runbook, include verbatim SQL recipes:
  - `SELECT status, COUNT(*) FROM agent_runs WHERE started_at > unixepoch()-86400 GROUP BY status;`
  - `SELECT agent_id, AVG(total_cost_usd) AS avg_cost, AVG((finished_at-started_at)/1000.0) AS avg_sec FROM agent_runs WHERE finished_at IS NOT NULL AND started_at > unixepoch()-86400 GROUP BY agent_id;`
  - `SELECT run_id, kind, payload_json FROM agent_run_events WHERE run_id=? ORDER BY event_id;`
  - `SELECT approval_id, run_id, reason, created_at FROM agent_approval_requests WHERE status='pending' AND created_at < unixepoch()-86400;`
- [x] 6.2.3 In the runbook, include curl recipes: cancel (`curl -X POST .../api/admin/agents/runs/$RUN_ID/cancel -b "session=..."`), approve (`curl -X POST .../api/admin/agents/approvals/$APPROVAL_ID/approve -b "session=..."`), enqueue (`curl -X POST .../api/admin/agents/$AGENT_ID/enqueue -b "session=..." -d '{"input":{...}}'`), and the cron smoke from 4.3.2
- [x] 6.2.4 Add alerting hooks in `src/lib/agent-os/observability/alerts.ts`: a `checkKernelHealth()` function called from the daily `0 3 * * *` cron that logs WARN to existing observability when (a) D1 writes in last hour exceed 50% of rate cap, (b) `pending_over_24h` approvals > 0, (c) `failed_24h / total_24h > 0.05`; reuse whatever console/logging mechanism existing crons use (no new infra)

### 6.3 Final cleanup + archive

- [ ] 6.3.1 Run the 7-day dashboard watch: each day for 7 consecutive days `curl .../api/admin/agents/health` and record the JSON in `.omc/research/agent-os-health-day-{1..7}.json`; abort archive and open a follow-up if any day shows red metrics
- [ ] 6.3.2 Run `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references` — all must pass clean
- [ ] 6.3.3 Run `openspec validate agent-os --strict` and fix any drift between `specs/*/spec.md` and shipped behavior
- [x] 6.3.4 Update `progress.txt` at repo root with `agent-os: complete — kernel live, 4 agents migrated, scheduler+R2 enabled, archived YYYY-MM-DD`
- [ ] 6.3.5 Run `openspec archive agent-os` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-os/` and fold delta specs into main specs
- [x] 6.3.6 Open follow-up issues for deferred items surfaced during dogfood: any FIXMEs marked `// TODO(agent-os-followup)` in code, R8 mitigation (Durable Object alarm for approval wake-up), R3 mitigation (Vectorize archive-to-R2)
