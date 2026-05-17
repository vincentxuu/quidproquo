# Tasks — agent-providers

Implementation plan for the agent-providers change. 8 phases, ~108 tasks. Builds the central provider registry on top of the agent-os kernel and ports every existing LLM / search / reader / knowledge / action integration onto it.

## Pre-requisite

**Changes `agent-foundation` AND `agent-os` MUST be merged, deployed, and stable in production before Phase 1 starts.** Provider routing depends on:

- `src/lib/config/env.ts`, `src/lib/config/flags.ts` (foundation) — provider flag block extends `flags` here
- `src/lib/agent-os/kernel.ts` + `syscall` ABI (os) — every provider category exposes itself as a syscall handler the kernel mediates
- `src/lib/agent-os/storage/types.ts` + D1 backends (os) — provider credentials reuse the same backend-interface pattern (in-memory + D1 impls)
- `src/lib/agent-os/access.ts` (os) — action providers integrate with the kernel approval gate
- `src/lib/agent-os/tools/{registry,types,cost}.ts` (os) — provider handlers register as central `ToolDefinition`s
- `agent-os` per-agent flags retired (umbrella `agentOs.enabled` is the only kill-switch for the kernel itself)
- Settings tables already consolidated to `admin_settings` (foundation migration `0010_admin_settings_consolidation.sql` applied in prod)

## Invariant: legacy provider path stays intact behind flags

- Phase 2–6 ship the new registry path behind `providers.<category>.<provider>` flags defaulting to `false`; the legacy `src/lib/rag/model.ts:invokeModel` + `provider-key-store.ts` + `external-search.ts` paths remain untouched and continue serving production traffic until each per-category umbrella flag flips
- Per-task parity tests use real provider responses (recorded fixtures) — outputs must be structurally identical to the legacy path (LLM text content tolerated within fixture-defined drift bounds)
- Every per-provider flag is independently revertible without redeploy via `wrangler secret put` / `vars` redeploy
- Cleanup (deleting legacy modules) only happens in Phase 8 after the umbrella `providers.enabled` flag has been on for 7+ days with no rollback

## Flag state by phase

| Phase | `providers.enabled` | `providers.llm.*` | `providers.search.*` | `providers.reader.*` | `providers.knowledge.*` | `providers.action.*` | `providers.routing.fallback` | `providers.routing.healthChecks` | `providers.routing.loadBalance` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `false` | all `false` | all `false` | all `false` | all `false` | all `false` | `false` | `false` | `false` |
| 2 | `true` | one-at-a-time after per-provider parity | all `false` | all `false` | all `false` | all `false` | `false` | `false` | `false` |
| 3 | `true` | retired (umbrella `providers.llm` becomes kill-switch) | one-at-a-time after parity | all `false` | all `false` | all `false` | `false` | `false` | `false` |
| 4 | `true` | n/a | retired | one-at-a-time after parity | all `false` | all `false` | `false` | `false` | `false` |
| 5 | `true` | n/a | n/a | retired | one-at-a-time, individually gated; **write** providers also require `agent-access` grant | all `false` | `false` | `false` | `false` |
| 6 | `true` | n/a | n/a | n/a | n/a | one-at-a-time, every action requires `requiresApproval: true` + kernel grant | `false` | `false` | `false` |
| 7 | `true` | n/a | n/a | n/a | n/a | n/a | `true` after parity | `true` after smoke | `true` after smoke |
| 8 | `true` | n/a | n/a | n/a | n/a | n/a | `true` | `true` | `true` |

---

## Phase 1 — Schema + central registry shell (no behavior change yet)

**Goal**: Stand up the provider registry, credential store, routing/health interfaces, and D1 schema under `src/lib/agent-providers/` with `providers.enabled=false` so no production agent reads from the new registry. The registry is wired end-to-end and unit-tested in isolation; the only externally visible artifact is one new admin endpoint that returns `[]` until Phase 2 starts registering.

**Files touched**: ~22 new, 3 modified (`wrangler.jsonc` health-cron entry only — no new bindings; `src/lib/config/env.ts`; `src/lib/config/flags.ts`)
**Verification**: `pnpm vitest run src/lib/agent-providers` green; `pnpm wrangler d1 migrations apply quidproquo-db --local` applies `0012_agent_providers.sql` cleanly and `sqlite_master` shows the 3 tables + 4 indexes; `curl -b 'session=...' http://localhost:4321/api/admin/providers/registry` returns `{providers:[]}`; `providers.enabled=false` so existing RAG agents continue calling the legacy `invokeModel` path

### 1.1 Flags + env

- [ ] 1.1.1 Register the `providers` block in `src/lib/config/flags.ts` exactly per design D11 (extends the existing `agentOs` block sibling-style): `providers.enabled`, `providers.llm.{openai,anthropic,gemini,groq,openrouter}`, `providers.search.{tavily,exa,jina}`, `providers.reader.{jinaReader,firecrawl,browser,directFetch}`, `providers.knowledge.{notion,github,drive,sql}`, `providers.action.{githubIssue,githubComment,slack,notion,email}`, `providers.routing.{fallback,healthChecks,loadBalance,rateLimits}`. All default `false`; add corresponding `AGENT_PROVIDERS_*` entries to `wrangler.jsonc` `vars` block.
  - **Files**: `src/lib/config/flags.ts` (modify — append `providers` sub-object), `wrangler.jsonc` (modify — append ~30 `AGENT_PROVIDERS_*` vars), `src/lib/config/env.ts` (modify — append the 30 string fields)
  - **Pattern (D11)**: mirror `agentOs.*` flag block style from `openspec/changes/agent-os/design.md`; `'true'` strict-equals reader pattern from agent-foundation 1.2.1
  - **Verify**: `src/lib/config/flags.test.ts` extended — `flags.providers.enabled === false` when env empty, `=== true` when `AGENT_PROVIDERS_ENABLED='true'`; `pnpm wrangler types` regenerates without error

### 1.2 D1 migration `0012_agent_providers.sql`

- [ ] 1.2.1 Create migration with 3 tables and 4 indexes per design D1. Match `migrations/0011_agent_os.sql` style: `CREATE TABLE IF NOT EXISTS`, no `CHECK` constraints (enum values documented in `--` comments), `created_at`/`updated_at` as `INTEGER NOT NULL` (epoch ms via kernel `nowMs()`). Tables: (a) `provider_definitions` (`provider_id TEXT PRIMARY KEY, category TEXT NOT NULL, -- 'llm'|'search'|'reader'|'knowledge'|'action'`, `display_name TEXT NOT NULL, capability_json TEXT NOT NULL, cost_model_json TEXT NOT NULL, outbound_domains_json TEXT NOT NULL DEFAULT '[]', is_enabled INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL`), (b) `provider_credentials` (`credential_id TEXT PRIMARY KEY, provider_id TEXT NOT NULL, agent_id TEXT, -- NULL means org-wide`, `credential_type TEXT NOT NULL, -- 'api_key'|'oauth'|'service_account'`, `value_encrypted TEXT NOT NULL, scope_json TEXT NOT NULL DEFAULT '[]', expires_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL`), (c) `provider_health_snapshots` (`snapshot_id TEXT PRIMARY KEY, provider_id TEXT NOT NULL, observed_at INTEGER NOT NULL, is_healthy INTEGER NOT NULL, p50_latency_ms INTEGER, p95_latency_ms INTEGER, success_rate_pct REAL, sample_size INTEGER NOT NULL DEFAULT 0, error_json TEXT`).
  - **Files**: `migrations/0012_agent_providers.sql` (create)
  - **Pattern (D1)**: `migrations/0011_agent_os.sql` (file shape); design D1 schema; agent-foundation `0010` for `IF NOT EXISTS` idempotency
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --file=migrations/0012_agent_providers.sql` exits 0; re-running is no-op; `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'provider_%'"` returns all 3 names
- [ ] 1.2.2 Add the 4 supporting indexes in the same migration before submission: `idx_provider_credentials_provider_id`, `idx_provider_credentials_agent_id` (partial — `WHERE agent_id IS NOT NULL`), `idx_provider_health_snapshots_provider_observed (provider_id, observed_at DESC)`, `idx_provider_definitions_category`.
  - **Files**: `migrations/0012_agent_providers.sql` (modify same file)
  - **Pattern (D1)**: design D1; matching index-style of `migrations/0011_agent_os.sql`
  - **Verify**: `pnpm wrangler d1 execute quidproquo-db --local --command="SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_provider_%'"` returns all 4 names

### 1.3 Backend interfaces (Resolution Q5 adapter pattern, inherited from agent-os)

- [ ] 1.3.1 Define backend interfaces under `src/lib/agent-providers/storage/types.ts`. Required: `ProviderDefinitionStoreBackend` (CRUD over `provider_definitions`), `ProviderCredentialStoreBackend` (CRUD over `provider_credentials` with built-in encrypt/decrypt boundary), `ProviderHealthStoreBackend` (append + rolling-window query over `provider_health_snapshots`). All methods return `Promise<...>` and accept primitive params.
  - **Files**: `src/lib/agent-providers/storage/types.ts` (create)
  - **Pattern (D1)**: design D2 (one binding per concern); agent-os `src/lib/agent-os/storage/types.ts` for the interface-only pattern
  - **Verify**: `pnpm tsc --noEmit` passes; file exports exactly 3 interfaces named above
- [ ] 1.3.2 Implement D1 backends for the 3 interfaces. Each backend takes a `D1Database`; `ProviderHealthStoreBackend.append()` issues a single `INSERT`; `queryRecent({providerId, windowMs})` runs a single `SELECT ... ORDER BY observed_at DESC LIMIT ?` honoring the design D1 retention (default 7 days).
  - **Files**: `src/lib/agent-providers/storage/d1/{definitions,credentials,health}.ts` (create — 3 files)
  - **Pattern (D1)**: agent-os `src/lib/agent-os/storage/d1/event-log.ts` (single-batch helper style); proposal §"Credential storage uses kernel agent-storage (encrypted at rest)"
  - **Verify**: `src/lib/agent-providers/storage/d1/credentials.test.ts` mocks `D1Database.prepare` and asserts encryption boundary — `value_encrypted` written to D1 is NOT the same string as the plaintext input
- [ ] 1.3.3 Implement in-memory test backends for all 3 interfaces in a single file for kernel test import.
  - **Files**: `src/lib/agent-providers/storage/test/in-memory.ts` (create)
  - **Pattern (D8)**: agent-os `src/lib/agent-os/storage/test/in-memory.ts` (`makeKV` style — hand-rolled, no Miniflare)
  - **Verify**: imported by every Phase-1 registry test; `pnpm vitest run src/lib/agent-providers/storage` green

### 1.4 Central registry shell (`src/lib/agent-providers/`)

- [ ] 1.4.1 Build `types.ts` — type-only exports. `ProviderCategory` (union `'llm' | 'search' | 'reader' | 'knowledge' | 'action'`), `ProviderDefinition` (id, category, displayName, capability descriptor union, costModel from central `src/lib/tools/cost.ts`, outboundDomains, healthCheckFn), `ProviderHandler<TInput, TOutput>`, `CredentialResolution` (resolved value + source + expiresAt), `RoutingPolicy` (category-level — `order`, `fallbackOn`, `loadBalanceWeights?`, `rateLimits?`), `HealthSnapshot`.
  - **Files**: `src/lib/agent-providers/types.ts` (create)
  - **Pattern (D3)**: re-export `CostModel` from `src/lib/tools/cost.ts` (do NOT redefine); discriminated-union capability shape mirrors `SyscallDefinition` style from agent-os
  - **Verify**: `pnpm tsc --noEmit` passes; `grep "interface CostModel\|type CostModel" src/lib/agent-providers/types.ts` returns 0 (re-export only)
- [ ] 1.4.2 Build `registry.ts` — module-scoped `Map<string, ProviderDefinition>` keyed by `provider_id` (e.g. `'llm.openai'`, `'search.tavily'`). Exports `register(def)`, `unregister(id)`, `get(id)`, `listByCategory(category)`, `clear()` (test helper), `boot(env, backends)` (idempotent — reads `provider_definitions` rows on first call and rehydrates in-memory registry from D1, calling `register` for each row whose `is_enabled=1`).
  - **Files**: `src/lib/agent-providers/registry.ts` (create)
  - **Pattern (D3)**: agent-os `src/lib/agent-os/kernel.ts` registration mirror semantics; central `src/lib/tools/registry.ts` for the Map-backed shape
  - **Verify**: `src/lib/agent-providers/registry.test.ts` — register-then-get round-trip, duplicate-id throws `ProviderRegistrationError`, `clear()` empties, `boot()` is idempotent across 2 calls (no double-register)
- [ ] 1.4.3 Build `credentials.ts` — `resolveCredential({providerId, agentId, kernel})` returning `CredentialResolution`. Order of precedence: (1) agent-scoped credential row matching `agent_id`, (2) org-wide row with `agent_id IS NULL`, (3) `env` fallback via the legacy `provider-key-store.ts` allowlist (kept untouched in Phase 1 so the lookup still works). Throws `CredentialNotFound` if all 3 miss; throws `CredentialExpired` if `expires_at < nowMs()`.
  - **Files**: `src/lib/agent-providers/credentials.ts`, `src/lib/agent-providers/errors.ts` (create — `ProviderRegistrationError`, `ProviderNotFound`, `CredentialNotFound`, `CredentialExpired`, `ProviderUnhealthy`, `AllProvidersFailed`, `ProviderRateLimited`, `ProviderInputInvalid`, `ProviderHandlerTimeout`, `OutboundDomainNotGranted`)
  - **Pattern (D4)**: proposal §"OAuth + API-key + service-account credential types; per-credential scope and expiry tracking"; agent-os `errors.ts` shape
  - **Verify**: `src/lib/agent-providers/credentials.test.ts` covers all 3 precedence branches + both error paths
- [ ] 1.4.4 Build `routing.ts` — `route({category, input, kernel, ctx})` returning `{provider, response, attempts}`. Phase 1 ships the shell (single-provider passthrough): no fallback, no load balance, no health gating. Phase 7 ships the real implementation. Until then, `route()` reads `RoutingPolicy.order[0]` for the category, resolves credential via `credentials.ts`, invokes the handler with timeout, returns. Records cost+latency to `agent_tool_calls` via the kernel's `EventLogBackend.recordWithRunCounters()` (single batch).
  - **Files**: `src/lib/agent-providers/routing.ts` (create)
  - **Pattern (D6)**: design D6 routing/fallback algorithm (Phase 7 implements full logic); D12 (cost telemetry write path inherited from agent-os)
  - **Verify**: `src/lib/agent-providers/routing.test.ts` covers (a) success path writes exactly one `agent_tool_calls` row via mocked `EventLogBackend.recordWithRunCounters`, (b) handler exception surfaces as `ProviderHandlerTimeout` when over the per-handler timeout, (c) unknown category throws `ProviderNotFound`
- [ ] 1.4.5 Build `health.ts` — `recordHealth({providerId, isHealthy, latencyMs, error?})` (append-only) + `getHealth(providerId, windowMs)` returning rolling-window aggregates (`p50_latency_ms`, `p95_latency_ms`, `success_rate_pct`, `sample_size`). Pure helpers; cron-driven background sweep deferred to Phase 7.
  - **Files**: `src/lib/agent-providers/health.ts`, `src/lib/agent-providers/health-aggregate.ts` (create — pure percentile helper for unit testing)
  - **Pattern (D7)**: design D7 health-check architecture; agent-os `memory-fusion.ts` pure-helper extraction pattern
  - **Verify**: `src/lib/agent-providers/health-aggregate.test.ts` asserts known p50/p95 outputs for fixture latency arrays; `src/lib/agent-providers/health.test.ts` covers append + rolling-window round-trip
- [ ] 1.4.6 Build `index.ts` — barrel re-exporting `registry`, `credentials`, `routing`, `health`, `types`, `errors`. Single entrypoint that Phase 2+ provider files import from.
  - **Files**: `src/lib/agent-providers/index.ts` (create)
  - **Pattern (D3)**: standard barrel; `src/lib/agent-os/index.ts` style
  - **Verify**: `pnpm tsc --noEmit` green; the file is the only import path tests use

### 1.5 Minimal admin API surface

- [ ] 1.5.1 `GET /api/admin/providers/registry` — list registered providers from the in-Worker registry. Returns `{providers: []}` until Phase 2 starts populating. Reuse `requireAdmin` + `json` + `unauthorized` from agent-foundation.
  - **Files**: `src/pages/api/admin/providers/registry.ts` (create)
  - **Pattern (D13 from agent-os)**: agent-os `src/pages/api/admin/agents/index.ts:25-40`; existing `src/pages/api/admin/providers.ts` for the providers-namespace convention
  - **Verify**: `curl -b 'session=...' http://localhost:4321/api/admin/providers/registry` returns `{providers:[]}` with 200; without cookie returns 401
- [ ] 1.5.2 `GET /api/admin/providers/health?providerId=` — return rolling-window health for one provider; without query param return all providers' latest snapshot. Returns `{health:{}}` until Phase 7 populates.
  - **Files**: `src/pages/api/admin/providers/health.ts` (create)
  - **Pattern (D7)**: proposal §"Health checks + provider capability discovery; admin UI surfaces 'which providers are healthy right now'"
  - **Verify**: returns 200 with empty health map when DB empty
- [ ] 1.5.3 Add top-level disabled-guard helper `_guard.ts` for `/api/admin/providers/*` new endpoints: when `flags.providers.enabled === false`, short-circuit with 503 `{error:'providers_disabled'}`. The existing legacy `/api/admin/providers` endpoint (catalog/secret management) is NOT gated — it continues serving until Phase 8 cleanup so admins can still rotate provider keys during migration.
  - **Files**: `src/pages/api/admin/providers/_guard.ts` (create — exports `ensureProvidersEnabled(): Response | undefined`)
  - **Pattern (D11)**: agent-os `_guard.ts` umbrella flag pattern
  - **Verify**: integration test boots the dev server with `AGENT_PROVIDERS_ENABLED=false`, hits 1.5.1 + 1.5.2, asserts both return `503 {error:'providers_disabled'}`; flipping env var flips them to normal behavior

---

## Phase 2 — LLM providers

**Goal**: Port the 5 currently-shipped LLM integrations (OpenAI, Anthropic, Gemini, Groq, OpenRouter) from `src/lib/rag/provider-key-store.ts` + `src/lib/rag/model.ts:createModel` onto the new registry. Expose them via a single `model.invoke` syscall handler. The agent-os kernel's `model.invoke` syscall (created in agent-os Phase 2) gains a registry-routing implementation; the legacy `invokeModel` continues to back any caller whose flag is off.

**Files touched**: ~10 new (one provider file per LLM + `register-defaults-llm.ts` + a `legacy-bridge.ts` + parity test file), ~2 modified (`src/lib/agent-os/tools/register-defaults.ts` to swap the `model.invoke` handler when `providers.llm.<provider>` is on)
**Verification**: parity vitest per provider (registry path vs. legacy `invokeModel` on the same stage + messages → outputs structurally equal modulo LLM nondeterminism); `agent_tool_calls.cost_usd / tokens_in / tokens_out` populated for both paths via the same syscall instrumentation

### 2.1 LLM provider files (one per provider)

- [ ] 2.1.1 Register `llm.openai` provider
  - **Files**: `src/lib/agent-providers/providers/llm/openai.ts` (create — exports `openaiProvider: ProviderDefinition`); `src/lib/agent-providers/providers/llm/register-defaults.ts` (create — central place that imports every LLM provider and calls `registry.register`)
  - **Pattern (D3, D4)**: existing `createModel` openai branch at `src/lib/rag/model.ts:62-65`; cost model from OpenAI pricing page (input $5/1M, output $15/1M for `gpt-4o` as v1 baseline); `outboundDomains: ['api.openai.com']`; capability `{ supportsChat: true, supportsStreaming: true, supportsToolCalls: true, maxOutputTokens: 16384 }`
  - **Verify**: `src/lib/agent-providers/providers/llm/openai.test.ts` — handler invocation against a stubbed `ChatOpenAI.invoke` returns the LangChain response unchanged; cost is computed from `tokens_in/out` on the response's `usage_metadata`
- [ ] 2.1.2 Register `llm.anthropic` provider (NEW — not in legacy `createModel`; the legacy path only supports anthropic via OpenAI-compatible OpenRouter)
  - **Files**: `src/lib/agent-providers/providers/llm/anthropic.ts` (create); register in 2.1.1's `register-defaults.ts`
  - **Pattern (D3, D4)**: `@langchain/anthropic` `ChatAnthropic` (add as dep in this task if not present); cost model `claude-3-5-sonnet` input $3/1M, output $15/1M as v1 baseline; `outboundDomains: ['api.anthropic.com']`; capability `{ supportsChat: true, supportsStreaming: true, supportsToolCalls: true, maxOutputTokens: 8192 }`
  - **Deviation flag**: anthropic is the only provider that didn't exist in legacy `createModel`. Confirm `package.json` dependency add (`pnpm add @langchain/anthropic`) and `pnpm install --frozen-lockfile` would still succeed
  - **Verify**: handler test against a stubbed `ChatAnthropic.invoke`; documented in `design.md` as the first "registry-only" provider — no legacy parity test required because there is no legacy path
- [ ] 2.1.3 Register `llm.gemini` provider
  - **Files**: `src/lib/agent-providers/providers/llm/gemini.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: legacy `createModel` gemini branch at `src/lib/rag/model.ts:67-70`; cost model `gemini-2.0-flash` input $0.075/1M, output $0.30/1M as v1 baseline; `outboundDomains: ['generativelanguage.googleapis.com']`; capability `{ supportsChat: true, supportsStreaming: true, supportsToolCalls: true, maxOutputTokens: 8192 }`; credential resolution must honor both `GOOGLE_API_KEY` and `GEMINI_API_KEY` (legacy alias) per `provider-key-store.ts:72-80`
  - **Verify**: parity test against legacy `invokeModel(config, 'critic', messages, 512, {google: 'fake'})` — both paths reach the same `ChatGoogleGenerativeAI.invoke` stub and return identical envelope
- [ ] 2.1.4 Register `llm.groq` provider
  - **Files**: `src/lib/agent-providers/providers/llm/groq.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: legacy `createModel` groq branch at `src/lib/rag/model.ts:72-75`; cost model `llama-3.3-70b-versatile` input $0.59/1M, output $0.79/1M (Groq published rates); `outboundDomains: ['api.groq.com']`; capability `{ supportsChat: true, supportsStreaming: true, supportsToolCalls: true, maxOutputTokens: 8192 }`
  - **Verify**: parity test against legacy `invokeModel(config, 'critic', messages, 512, {groq: 'fake'})` for a deterministic system prompt
- [ ] 2.1.5 Register `llm.openrouter` provider
  - **Files**: `src/lib/agent-providers/providers/llm/openrouter.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: legacy `createModel` openrouter branch at `src/lib/rag/model.ts:82-85` (uses `createOpenAiCompatibleModel` helper); cost model `'request'` kind with `perCallUsd: 0` placeholder — OpenRouter exposes per-model rates dynamically via `/api/v1/models`; document follow-up FIXME for a v2 dynamic cost lookup; `outboundDomains: ['openrouter.ai']`; capability `{ supportsChat: true, supportsStreaming: true, supportsToolCalls: true, maxOutputTokens: 8192 }`
  - **Verify**: parity test against legacy openrouter path with a stub model name

### 2.2 Wire `model.invoke` syscall through registry

- [ ] 2.2.1 Modify the agent-os `model.invoke` syscall handler (shipped in agent-os Phase 2) so that when ANY `flags.providers.llm.<provider>` flag is on AND `flags.providers.enabled === true`, the handler routes through `agentProviders.routing.route({category:'llm', input, kernel, ctx})` instead of calling the legacy `invokeModel`. Per-provider flag check is read from the resolved route's provider id (e.g. if `route.provider === 'openai'` and `providers.llm.openai === true`, take new path; otherwise legacy).
  - **Files**: `src/lib/agent-os/tools/register-defaults.ts` (modify the `model.invoke` registration block to inject the dispatch shim); `src/lib/agent-providers/legacy-bridge.ts` (create — exports `shouldUseRegistry(category, providerId, flags): boolean` so the same shim can be reused for search/reader/etc.)
  - **Pattern (D5)**: agent-os Phase 3 `dispatchNode` shim from `src/lib/rag/graph.ts`; design D5 hybrid-routing decision
  - **Verify**: vitest covers (a) both flags off → legacy path executed (assert via spy on `invokeModel`), (b) umbrella + per-provider both on → new path executed (assert via spy on `agentProviders.routing.route`), (c) umbrella on but per-provider off → legacy path executed
- [ ] 2.2.2 Boot-time registry hydration: call `agentProviders.registry.boot(env, backends)` from the agent-os `createKernel()` factory (extends agent-os Phase 1's kernel boot). Boot must (a) read `provider_definitions` rows from D1, (b) merge with the hard-coded `register-defaults.ts` set (D1 wins for `is_enabled`, hard-coded wins for `capability_json` / `cost_model_json` so config drift is detectable), (c) emit one boot log line per registered provider for ops visibility.
  - **Files**: `src/lib/agent-os/kernel.ts` (modify — call `agentProviders.registry.boot()` after `mirrorPermissions`)
  - **Pattern (D3)**: agent-os Phase 1.4.1 boot mirror; D3 registry hydration order
  - **Verify**: kernel boot test asserts both hard-coded and D1 providers appear in `agentProviders.registry.listByCategory('llm')` after `createKernel()`

### 2.3 Parity test harness

- [ ] 2.3.1 Create `src/lib/agent-providers/providers/llm/parity-harness.ts` — test helper that runs an identical `model.invoke` syscall through both paths (`flags.providers.llm.<provider>=false` legacy then `=true` new) against stubbed provider clients, asserts response shape (`response.content`, `response.usage_metadata.input_tokens`, `..output_tokens`), and asserts `agent_tool_calls` row written with matching `tokens_in/out/cost_usd` (the registry path computes cost from the provider's cost model; the legacy path emits cost=0 placeholder, so this is the dimension where the new path is strictly better — parity test asserts `new.cost_usd > 0 AND legacy.cost_usd === 0` for paid providers)
  - **Files**: `src/lib/agent-providers/providers/llm/parity-harness.ts` (create); `src/lib/agent-providers/providers/llm/openai.parity.test.ts`, `gemini.parity.test.ts`, `groq.parity.test.ts`, `openrouter.parity.test.ts` (create — 4 files using the harness)
  - **Pattern (D5)**: agent-os 3.1.5 critic parity test shape; cost-instrumentation differential check from D12
  - **Verify**: `pnpm vitest run src/lib/agent-providers/providers/llm` green for all 4 parity tests (anthropic has no legacy path so no parity test)

### 2.4 Telemetry smoke + flag flip

- [ ] 2.4.1 In a local dev session (`pnpm dev` with `AGENT_PROVIDERS_ENABLED=true` and `AGENT_PROVIDERS_LLM_GROQ=true` only — groq is the smallest blast radius since it's the project default and rates are cheap), issue 5 `model.invoke` syscalls via a temporary admin endpoint; assert `SELECT syscall_name, provider_id, count(*), sum(cost_usd), sum(tokens_in+tokens_out) FROM agent_tool_calls WHERE run_id=? GROUP BY 1,2` returns exactly 1 row with `provider_id='llm.groq'`, `cost_usd > 0`, `tokens > 0`. Cleanup: flip both flags off.
  - **Files**: (no production code — verification gate)
  - **Pattern (D12)**: agent-os 2.4.1 telemetry smoke
  - **Verify**: SQL row matches assertion; rollback (flag off) restores legacy behavior on next request
- [ ] 2.4.2 Production rollout per provider, one at a time, in order `groq → openai → gemini → openrouter → anthropic`. For each: flip `AGENT_PROVIDERS_LLM_<PROVIDER>=true`, observe 24h on the standard 3 metrics (error rate, p95 latency, cost), gate to advance per design D5 (≤+0.5pp errors, ≤×1.2 p95, ≤×1.1 cost) — same gate as agent-os 3.x.6.
  - **Files**: `progress.txt` (modify — append one line per flip)
  - **Pattern (D5)**: agent-os Phase 3 rollout playbook
  - **Verify**: production health endpoint (created in Phase 1 1.5.2) shows `health[llm.<provider>].success_rate_pct >= 99` after each 24h window
- [ ] 2.4.3 After all 5 providers stable for ≥7 days, retire the per-provider LLM flags (`providers.llm.*` removed from `flags.ts` + `wrangler.jsonc`); umbrella `providers.llm` becomes the category-level kill-switch. Record retirement in `design.md` Resolutions.
  - **Files**: `src/lib/config/flags.ts` (modify — flatten `providers.llm.{openai,...}` to `providers.llm`), `wrangler.jsonc` (modify — remove 5 vars)
  - **Pattern (D11)**: agent-os 3.5.3 flag retirement
  - **Verify**: `grep -rn "providers.llm.openai\|providers.llm.anthropic\|providers.llm.gemini\|providers.llm.groq\|providers.llm.openrouter" src/` returns 0 lines

---

## Phase 3 — Search providers

**Goal**: Port the 3 web-search integrations (Tavily, Exa, Jina Search) currently scattered across `src/lib/tools/definitions/external-search.ts` (or its pre-move location `src/lib/rag/tools/external-search.ts`) into the registry under `search.*` provider ids. Expose them as the `search.external` syscall handler internals; the existing `external-search.ts` shrinks to a thin wrapper that calls `agentProviders.routing.route({category:'search', ...})` when `providers.search` is on.

**Files touched**: ~8 new (3 provider files + register-defaults + parity tests), ~1 modified (`src/lib/tools/definitions/external-search.ts` becomes the dispatch shim)
**Verification**: parity test per provider against the legacy `searchExternalTools(input)` path; result-set ordering preserved (or documented as intentional reorder); `agent_tool_calls.cost_usd` populated using per-provider published rates

### 3.1 Search provider files

- [ ] 3.1.1 Register `search.tavily` provider
  - **Files**: `src/lib/agent-providers/providers/search/tavily.ts` (create); `src/lib/agent-providers/providers/search/register-defaults.ts` (create)
  - **Pattern (D3, D4)**: legacy tavily branch inside `src/lib/tools/definitions/external-search.ts`; cost model `{ kind: 'request', perCallUsd: 0.008 }` (Tavily Search published rate $8/1k queries); `outboundDomains: ['api.tavily.com']`; capability `{ maxResults: 20, supportsRecencyFilter: true, supportsDomainFilter: true }`; input schema `{ query: string, maxResults?: number, includeDomains?: string[], excludeDomains?: string[] }`
  - **Verify**: parity test against legacy `searchExternalTools({query:'astro 6', providers:['tavily']})` with stubbed HTTP; assert `out.results` deep-equals legacy return value (same `SearchResult[]` shape with `title/url/snippet/score`)
- [ ] 3.1.2 Register `search.exa` provider
  - **Files**: `src/lib/agent-providers/providers/search/exa.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: legacy exa branch in `external-search.ts`; cost model `{ kind: 'request', perCallUsd: 0.005 }` (Exa neural search v1 rate); `outboundDomains: ['api.exa.ai']`; capability `{ maxResults: 25, supportsSemanticSearch: true, supportsContentExtraction: true }`; input schema includes `useAutoprompt?: boolean, contents?: boolean`
  - **Verify**: parity test with stubbed HTTP returns identical result envelope
- [ ] 3.1.3 Register `search.jina` provider (Jina Search — NOT Jina Reader; reader is Phase 4)
  - **Files**: `src/lib/agent-providers/providers/search/jina.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: legacy `search` provider in `external-search.ts` (which alias-routes JINA_SEARCH_API_KEY); cost model `{ kind: 'request', perCallUsd: 0 }` placeholder (Jina Search free tier 1M queries/month — document follow-up to switch to `{ kind: 'token' }` once Jina exposes per-query token usage); `outboundDomains: ['s.jina.ai']`; capability `{ maxResults: 10 }`; credential resolution honors both `JINA_API_KEY` and `JINA_SEARCH_API_KEY` per `provider-key-store.ts:91`
  - **Verify**: parity test; outbound-domain check passes when agent declares `'s.jina.ai'` in `outboundDomains`

### 3.2 Wire `search.external` syscall through registry

- [ ] 3.2.1 Modify `src/lib/tools/definitions/external-search.ts:searchExternalSyscall.handler` (registered in agent-os Phase 2.1.1) so that when `flags.providers.enabled && flags.providers.search.<provider>` is on for the requested provider, the handler delegates to `agentProviders.routing.route({category:'search', input, kernel, ctx})`. The internal `searchExternalTools()` function in the legacy module stays untouched until Phase 8 cleanup.
  - **Files**: `src/lib/tools/definitions/external-search.ts` (modify the syscall handler only — keep `searchExternalTools` direct export intact for backward-compat callers)
  - **Pattern (D5)**: agent-os Phase 3 dispatch shim pattern; same `shouldUseRegistry` helper from Phase 2.2.1
  - **Verify**: dispatch unit test asserts that the new path is taken iff both flags are on for the requested provider; legacy path still works for any provider whose flag is off (e.g. brave/bocha/serper/serpapi remain on legacy until they're added in a follow-up change)

### 3.3 Parity tests + telemetry + rollout

- [ ] 3.3.1 Parity tests `src/lib/agent-providers/providers/search/{tavily,exa,jina}.parity.test.ts` using a shared `search/parity-harness.ts` mirroring the LLM harness structure
  - **Files**: `src/lib/agent-providers/providers/search/parity-harness.ts`, 3 parity test files
  - **Pattern (D5)**: Phase 2.3.1 LLM harness
  - **Verify**: `pnpm vitest run src/lib/agent-providers/providers/search` green
- [ ] 3.3.2 Production rollout `tavily → exa → jina` (smallest cost blast radius first — tavily is most expensive per call so flipping it first surfaces cost regressions fastest), 24h observation per provider against the standard 3 metrics. Same gate as Phase 2.4.2.
  - **Files**: `progress.txt` (append)
  - **Pattern (D5)**: Phase 2.4.2
  - **Verify**: health endpoint `success_rate_pct >= 99` per provider after 24h
- [ ] 3.3.3 After all 3 providers stable for ≥7 days, retire `providers.search.{tavily,exa,jina}` per-provider flags; umbrella `providers.search` becomes the category kill-switch
  - **Files**: `src/lib/config/flags.ts`, `wrangler.jsonc`
  - **Pattern (D11)**: Phase 2.4.3
  - **Verify**: per-provider grep returns 0

---

## Phase 4 — Reader providers

**Goal**: Introduce a `read.url` syscall and back it with 4 reader providers (Jina Reader, Firecrawl, browser via Cloudflare Browser Rendering, direct `fetch` with HTML→Markdown conversion). The first 3 already have credential fields in `provider-key-store.ts` but no registered tool; `read.url` is a new syscall added to the agent-os tool registry (extending agent-os Phase 2's set of syscalls). Direct fetch is the universally-available fallback.

**Files touched**: ~12 new (4 provider files + register-defaults + 4 parity tests + `read.url` syscall registration in agent-os tools/definitions + a test fixture HTML file + `html-to-markdown.ts` helper if not already present)
**Verification**: parity test per provider against fixture URLs (recorded responses to avoid live network in CI); markdown extraction is byte-equal to fixture for direct-fetch; ≥95% structural similarity for the 3 hosted readers (formatting drift tolerated within fixture-defined diff bounds)

### 4.1 Add `read.url` syscall to central tool registry

- [ ] 4.1.1 Define `read.url` syscall in `src/lib/tools/definitions/read-url.ts` with input schema `{ url: string (required, format: uri), maxBytes?: number (default 256000), timeoutMs?: number (default 15000), includeMetadata?: boolean (default true) }`, output schema `{ markdown: string, title?: string, sourceUrl: string, contentType?: string, statusCode?: number, fetchedAt: string (iso) }`, cost model `{ kind: 'request', perCallUsd: 0 }` placeholder (real per-provider cost computed in handler), `requiresApproval: false` (reading public URLs is non-mutating), outbound domain hint declared per-provider in the handler closure.
  - **Files**: `src/lib/tools/definitions/read-url.ts` (create); `src/lib/agent-os/tools/register-defaults.ts` (modify — add `read.url` to the registration set)
  - **Pattern (D3)**: agent-os 2.1.1 `searchExternalSyscall` shape; `defineSyscall` helper from agent-os Phase 1.4.2
  - **Verify**: `src/lib/tools/definitions/read-url.test.ts` asserts the syscall is registered and `inputSchema` rejects non-uri strings via the kernel's JSON-Schema validator

### 4.2 Reader provider files

- [ ] 4.2.1 Register `reader.jina` provider (Jina Reader — `r.jina.ai/{url}` endpoint, returns clean markdown)
  - **Files**: `src/lib/agent-providers/providers/reader/jina.ts` (create); `src/lib/agent-providers/providers/reader/register-defaults.ts` (create)
  - **Pattern (D3, D4)**: cost model `{ kind: 'request', perCallUsd: 0 }` (Jina Reader free tier); `outboundDomains: ['r.jina.ai']` (the reader URL pattern is `https://r.jina.ai/{targetUrl}`); capability `{ supportsScreenshot: false, supportsJavaScript: true, returnsMarkdown: true, maxContentBytes: 1_000_000 }`; credential is optional (auth-less calls are rate-limited; with JINA_API_KEY higher limits)
  - **Verify**: parity test against fixture HTML — handler returns identical markdown to fixture-recorded `r.jina.ai` response
- [ ] 4.2.2 Register `reader.firecrawl` provider
  - **Files**: `src/lib/agent-providers/providers/reader/firecrawl.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: cost model `{ kind: 'request', perCallUsd: 0.0015 }` (Firecrawl scrape published rate); `outboundDomains: ['api.firecrawl.dev']`; capability `{ supportsScreenshot: true, supportsJavaScript: true, returnsMarkdown: true, maxContentBytes: 5_000_000 }`; input maps to `{ url, formats: ['markdown', 'screenshot'] }` per Firecrawl API
  - **Verify**: parity test against fixture
- [ ] 4.2.3 Register `reader.browser` provider (Cloudflare Browser Rendering)
  - **Files**: `src/lib/agent-providers/providers/reader/browser.ts` (create); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: cost model `{ kind: 'request', perCallUsd: 0.0001 }` (Cloudflare Browser Rendering per-request floor); `outboundDomains: []` (this provider talks to the bound `BROWSER` binding, not an external host — outbound check is N/A); capability `{ supportsScreenshot: true, supportsJavaScript: true, returnsMarkdown: true, maxContentBytes: 10_000_000, requiresBinding: 'BROWSER' }`; handler short-circuits with `ProviderUnhealthy` if `env.BROWSER` is unbound (preserves the kernel's graceful-degradation behavior)
  - **Deviation flag**: this provider needs a NEW Cloudflare binding `BROWSER` (Cloudflare Browser Rendering). Add to `wrangler.jsonc` as `[[browser]]` and to `src/lib/config/env.ts` as `BROWSER?: BrowserWorker` optional. Note PR body: paid feature ($5/mo seat). If account does not provision it, leave the flag off — Phase 4 still ships with the other 3 readers
  - **Verify**: parity test stubs `BROWSER.fetch({url})`; with binding absent + flag on, asserts `ProviderUnhealthy` thrown so router can fall over to next provider in Phase 7
- [ ] 4.2.4 Register `reader.directFetch` provider (no credentials — universal fallback)
  - **Files**: `src/lib/agent-providers/providers/reader/direct-fetch.ts` (create); `src/lib/utils/html-to-markdown.ts` (create if not present — wraps `turndown` or a lightweight inline converter; if `turndown` not in deps, document `pnpm add turndown @types/turndown` here); register in `register-defaults.ts`
  - **Pattern (D3, D4)**: cost model `{ kind: 'free' }`; `outboundDomains: ['*']` placeholder — the router's per-agent outbound-domain grant is what actually constrains where direct-fetch can go (this provider is the only one whose `outboundDomains` is the full agent grant set rather than a fixed host); capability `{ supportsScreenshot: false, supportsJavaScript: false, returnsMarkdown: true, maxContentBytes: 256_000 }`; handler uses `fetch(url, {signal: ctx.signal, headers: {'user-agent': 'quidproquo-reader/1.0'}})` then runs `htmlToMarkdown(text)`
  - **Verify**: parity test against a fixture HTML string in `src/lib/agent-providers/providers/reader/fixtures/sample.html` — markdown output is byte-equal to fixture-recorded expectation

### 4.3 Telemetry + rollout

- [ ] 4.3.1 Smoke test: spin up a local agent (`research`) with `reader.jina` flag on, dispatch a run with input `{question: 'summarize https://blog.cloudflare.com/...'}`; assert `agent_tool_calls` shows one `read.url` row with `provider_id='reader.jina'`, `cost_usd=0`, `latency_ms > 0`, `tokens_in/out` NULL (request-cost model — no token instrumentation)
  - **Files**: (no production code — verification gate)
  - **Pattern (D12)**: Phase 2.4.1 smoke shape
  - **Verify**: SQL row matches
- [ ] 4.3.2 Rollout order `directFetch → jina → firecrawl → browser` (cheapest + least dependencies first; browser last because it requires the paid binding). 24h per provider against standard 3 metrics, gated per Phase 2.4.2
  - **Files**: `progress.txt`
  - **Pattern (D5)**: Phase 2.4.2
  - **Verify**: per-provider health snapshot rolling-window `success_rate_pct >= 95` (lower bar than LLM because public-web flakiness baseline is higher)
- [ ] 4.3.3 Retire `providers.reader.{jinaReader,firecrawl,browser,directFetch}` per-provider flags after 7 days stable; umbrella `providers.reader` becomes category kill-switch
  - **Files**: `src/lib/config/flags.ts`, `wrangler.jsonc`
  - **Pattern (D11)**: Phase 2.4.3
  - **Verify**: grep returns 0

---

## Phase 5 — Knowledge providers (read + write)

**Goal**: Introduce knowledge integrations for Notion, GitHub, Drive, and SQL (org-local). Each ships as a pair of syscalls — `knowledge.<provider>.read` and `knowledge.<provider>.write` — both behind individual flags AND (for write) behind kernel `agent-access` grants per design D8. Write providers are mutating operations against external systems; therefore every write provider sets `requiresApproval: true` in its `ProviderDefinition` unless the agent has explicit `irreversibleActionsRequireApproval: false` AND a documented exception in `design.md`.

**Files touched**: ~28 new (8 provider files = 4 providers × {read, write}; 4 register-defaults files; 8 parity test files; 4 syscall definition files in `src/lib/tools/definitions/`; OAuth helper for Notion + Drive; GitHub App auth helper; SQL connector under `src/lib/db/external-sql.ts`)
**Verification**: read-path parity tests against fixture responses; write-path parity tests against a sandboxed test workspace/repo/database (NEVER production); approval-gate intercept test per write syscall

### 5.1 Knowledge syscall registrations

- [ ] 5.1.1 Define `knowledge.notion.read` + `knowledge.notion.write` syscalls in `src/lib/tools/definitions/knowledge-notion.ts`. Read input `{query?: string, pageId?: string, databaseId?: string, limit?: number}`, output `{items: NotionPage[]}`. Write input `{pageId?: string, parentId?: string, title: string, blocks: NotionBlock[]}`, output `{pageId: string, url: string}`. Write syscall `requiresApproval: true`. Both register in `src/lib/agent-os/tools/register-defaults.ts`.
  - **Files**: `src/lib/tools/definitions/knowledge-notion.ts` (create)
  - **Pattern (D8, D9)**: agent-os `defineSyscall` + `requiresApproval` from `src/lib/agent-os/access.ts`; proposal §"Action providers (GitHub issue/comment/Slack/Notion/email — all gated by kernel agent-access approval)"
  - **Verify**: registration test asserts both syscalls present; write syscall's `requiresApproval === true`
- [ ] 5.1.2 Define `knowledge.github.read` + `knowledge.github.write` syscalls in `src/lib/tools/definitions/knowledge-github.ts`. Read covers `repo.contents`, `repo.issues`, `repo.pulls`, `search.code` (sub-discriminator in input). Write covers `repo.contents.put` (commit a file) — note: `issues.create` and `pulls.create` live in Phase 6 action providers, not here, because they are higher-blast-radius mutations and we want them gated through a stricter approval path
  - **Files**: `src/lib/tools/definitions/knowledge-github.ts` (create)
  - **Pattern (D8)**: same as 5.1.1; GitHub REST `/repos/{owner}/{repo}/contents/{path}` for write
  - **Verify**: write input schema requires `commitMessage`, `branch?`, `sha?` (for updates)
- [ ] 5.1.3 Define `knowledge.drive.read` + `knowledge.drive.write` syscalls in `src/lib/tools/definitions/knowledge-drive.ts`. Read covers `files.list`, `files.get` (with `mimeType` filter). Write covers `files.create` and `files.update`.
  - **Files**: `src/lib/tools/definitions/knowledge-drive.ts` (create)
  - **Pattern (D8)**: same as 5.1.1; Google Drive v3 REST
  - **Verify**: write syscall `requiresApproval: true`
- [ ] 5.1.4 Define `knowledge.sql.read` + `knowledge.sql.write` syscalls in `src/lib/tools/definitions/knowledge-sql.ts`. Read input `{connectionId: string, query: string (must be SELECT-only — enforced via regex `/^\s*SELECT/i` in handler), params?: unknown[]}`. Write input same shape but allows INSERT/UPDATE/DELETE; explicit per-statement `requiresApproval: true`
  - **Files**: `src/lib/tools/definitions/knowledge-sql.ts` (create)
  - **Pattern (D8)**: SQL providers are the most-constrained — read-only SELECT enforced at handler level even before the routing layer; design D8 declarative grants
  - **Verify**: handler rejects any read input that doesn't start with `SELECT` (case-insensitive, whitespace-tolerant); rejection is `ProviderInputInvalid` not silent

### 5.2 Knowledge provider files

- [ ] 5.2.1 Register `knowledge.notion` provider with both `read` and `write` handlers
  - **Files**: `src/lib/agent-providers/providers/knowledge/notion.ts` (create — single file exports both handlers; the syscall name discriminates); `src/lib/agent-providers/providers/knowledge/register-defaults.ts` (create); `src/lib/agent-providers/oauth/notion.ts` (create — OAuth flow helper if credentialType is `'oauth'`; the `api_key` credentialType is also supported for org-wide service-account use)
  - **Pattern (D4)**: cost model `{ kind: 'request', perCallUsd: 0 }` (Notion API free); `outboundDomains: ['api.notion.com']`; capability `{ supportsRead: true, supportsWrite: true, supportsOAuth: true, supportsApiKey: true, scopes: ['read_content', 'update_content', 'insert_content'] }`
  - **Verify**: read parity test against a fixture page id; write parity test against a sandbox database id (env var `NOTION_TEST_DATABASE_ID`); if env var unset, skip write test with `it.skip` and document the skip in `design.md` as the only place secrets enter CI
- [ ] 5.2.2 Register `knowledge.github` provider — read + write handlers
  - **Files**: `src/lib/agent-providers/providers/knowledge/github.ts` (create); register in `register-defaults.ts`; `src/lib/agent-providers/auth/github-app.ts` (create — installation-token minting via GitHub App private key per design D8 — the design allows both PAT and GitHub App credentialTypes; default is GitHub App for org-wide installs because it doesn't tie to a user)
  - **Pattern (D4)**: cost model `{ kind: 'free' }` (GitHub API has rate limits but no per-call $); `outboundDomains: ['api.github.com']`; capability `{ supportsRead: true, supportsWrite: true, supportsOAuth: false, supportsGitHubApp: true, supportsPAT: true, scopes: ['contents:read', 'contents:write', 'issues:read', 'pull_requests:read'] }`
  - **Verify**: read parity for `repo.contents` against a public repo (no auth needed); write parity against env-var-gated sandbox repo, skip-when-unset
- [ ] 5.2.3 Register `knowledge.drive` provider — read + write handlers
  - **Files**: `src/lib/agent-providers/providers/knowledge/drive.ts` (create); register in `register-defaults.ts`; `src/lib/agent-providers/oauth/google-drive.ts` (create — OAuth + service-account both supported)
  - **Pattern (D4)**: cost model `{ kind: 'request', perCallUsd: 0 }` (Drive API free tier); `outboundDomains: ['www.googleapis.com']`; capability `{ supportsRead: true, supportsWrite: true, supportsOAuth: true, supportsServiceAccount: true, scopes: ['drive.readonly', 'drive.file'] }`
  - **Verify**: skipped write test when env var unset
- [ ] 5.2.4 Register `knowledge.sql` provider — read + write handlers; supports D1 (local agent-storage), HTTP-proxy SQL (e.g. Cloudflare Hyperdrive PostgreSQL), and the `quidproquo` D1 itself when explicitly granted
  - **Files**: `src/lib/agent-providers/providers/knowledge/sql.ts` (create); `src/lib/db/external-sql.ts` (create — connection registry for non-`DB` SQL connections); register in `register-defaults.ts`
  - **Pattern (D4)**: cost model `{ kind: 'free' }` for D1, `{ kind: 'request', perCallUsd: 0.000001 }` placeholder for Hyperdrive; `outboundDomains: []` for D1, `['*.hyperdrive.cloudflare.com']` for Hyperdrive; capability includes `{ supportsReadOnly: true, requiresExplicitConnectionGrant: true }`
  - **Deviation flag**: SQL provider is the most security-sensitive — even read access leaks data. Default `is_enabled=0` in `provider_definitions`; admins must explicitly enable per-connection
  - **Verify**: SELECT-only enforcement test; INSERT/DELETE blocked at read path

### 5.3 Write-path approval-gate integration test

- [ ] 5.3.1 End-to-end approval test: register a test agent with `syscalls: ['knowledge.notion.write']` and `irreversibleActionsRequireApproval: true`; dispatch a run that calls `ctx.syscall('knowledge.notion.write', {...})`; assert (a) the run pauses with status `paused_for_approval`, (b) a row appears in `agent_approval_requests` with `reason='knowledge.notion.write'`, (c) approving the request via `POST /api/admin/agents/approvals/:id/approve` resumes the run, (d) the syscall completes against the (stubbed) Notion handler, (e) `agent_tool_calls` records the call with provider_id `knowledge.notion`
  - **Files**: `src/lib/agent-providers/providers/knowledge/notion.approval.test.ts` (create)
  - **Pattern (D9)**: agent-os Phase 1.4.8 + 1.5.7 approval gate; design D9 (approval interception)
  - **Verify**: vitest passes; rejected approval rejects the syscall promise with `AgentApprovalRejected`

### 5.4 Telemetry + rollout

- [ ] 5.4.1 Per-provider rollout — read FIRST, then write. Order `sql.read → github.read → notion.read → drive.read → sql.write → github.write → notion.write → drive.write`. Each per-side observation 24h; write side requires verifying ≥1 successful approval round-trip in prod for at least one synthetic test agent.
  - **Files**: `progress.txt`
  - **Pattern (D5)**: Phase 2.4.2 + Phase 5.3.1 approval flow
  - **Verify**: per-provider health rolling-window OK
- [ ] 5.4.2 Retire `providers.knowledge.{notion,github,drive,sql}` per-provider flags after 7 days stable; umbrella `providers.knowledge` becomes category kill-switch. Note: write capability stays gated through agent-access grants even after the per-provider flag is retired — the kill-switch is umbrella-level, but per-agent write authority is permanently grant-based
  - **Files**: `src/lib/config/flags.ts`, `wrangler.jsonc`
  - **Pattern (D11)**: Phase 2.4.3 retirement; D8 declarative grants stay
  - **Verify**: grep returns 0; design.md Resolution records the per-agent-grant model

---

## Phase 6 — Action providers (kernel approval-gated)

**Goal**: Introduce 5 action providers that perform mutating operations on external systems: GitHub issue create, GitHub comment create, Slack message send, Notion page create (distinct from knowledge.notion.write — this is the "publish a new page" path that an agent reaches via a deliberate action rather than a knowledge sync), email send. EVERY action provider is `requiresApproval: true` at the syscall definition level — the kernel's `agent-access` approval gate per design D9 intercepts before the handler runs. Approval-bypass is forbidden — even agents with `irreversibleActionsRequireApproval: false` cannot skip approval for action syscalls (they remain in the agent-os `irreversibleSyscalls` reserved set extended by this phase)

**Files touched**: ~15 new (5 syscall definitions + 5 provider files + register-defaults + 5 approval-gate tests + extension of `src/lib/agent-os/tools/irreversible.ts`)
**Verification**: approval-gate intercept test per syscall; no syscall completes without resolved-approve; rejected approval surfaces `AgentApprovalRejected` to the agent; expired approval surfaces `AgentApprovalExpired`

### 6.1 Action syscall registrations

- [ ] 6.1.1 Define `action.github.create-issue` syscall in `src/lib/tools/definitions/action-github-issue.ts`. Input `{owner: string, repo: string, title: string, body?: string, labels?: string[], assignees?: string[]}`. Output `{number: number, url: string}`. `requiresApproval: true`.
  - **Files**: `src/lib/tools/definitions/action-github-issue.ts` (create); modify `src/lib/agent-os/tools/irreversible.ts` to add `'action.github.create-issue'`
  - **Pattern (D9)**: proposal §"all gated by kernel agent-access approval"; agent-os irreversible-set extension
  - **Verify**: registration test asserts in `irreversibleSyscalls` set; agent without approval grant can't call it
- [ ] 6.1.2 Define `action.github.create-comment` syscall in `src/lib/tools/definitions/action-github-comment.ts`. Input `{owner: string, repo: string, issueNumber: number, body: string}`. Output `{commentId: number, url: string}`. `requiresApproval: true`.
  - **Files**: `src/lib/tools/definitions/action-github-comment.ts` (create); extend `irreversible.ts`
  - **Pattern (D9)**: same as 6.1.1
  - **Verify**: same as 6.1.1
- [ ] 6.1.3 Define `action.slack.send-message` syscall in `src/lib/tools/definitions/action-slack-message.ts`. Input `{channel: string, text: string, blocks?: unknown[], threadTs?: string}`. Output `{messageTs: string, channelId: string}`. `requiresApproval: true`.
  - **Files**: `src/lib/tools/definitions/action-slack-message.ts` (create); extend `irreversible.ts`
  - **Pattern (D9)**: same
  - **Verify**: same
- [ ] 6.1.4 Define `action.notion.create-page` syscall in `src/lib/tools/definitions/action-notion-page.ts`. Input `{parentDatabaseId?: string, parentPageId?: string, title: string, blocks: NotionBlock[]}` (exactly one of `parentDatabaseId`/`parentPageId` required). Output `{pageId: string, url: string}`. `requiresApproval: true`.
  - **Files**: `src/lib/tools/definitions/action-notion-page.ts` (create); extend `irreversible.ts`
  - **Pattern (D9)**: same
  - **Verify**: schema xor enforcement (`oneOf` JSON Schema clause); registration test
- [ ] 6.1.5 Define `action.email.send` syscall in `src/lib/tools/definitions/action-email-send.ts`. Input `{to: string[] (1..10), from: string, subject: string, text?: string, html?: string, replyTo?: string}` (at least one of text/html required). Output `{messageId: string}`. `requiresApproval: true`.
  - **Files**: `src/lib/tools/definitions/action-email-send.ts` (create); extend `irreversible.ts`
  - **Pattern (D9)**: same; xor enforcement on text/html
  - **Verify**: schema enforces `to.length >= 1 AND to.length <= 10`; explicit `to.length` cap mitigates fan-out abuse

### 6.2 Action provider files

- [ ] 6.2.1 Register `action.github` provider (single provider, two syscall handlers — issue + comment)
  - **Files**: `src/lib/agent-providers/providers/action/github.ts` (create — reuses `auth/github-app.ts` from Phase 5.2.2); `src/lib/agent-providers/providers/action/register-defaults.ts` (create)
  - **Pattern (D4)**: cost model `{ kind: 'free' }`; `outboundDomains: ['api.github.com']`; capability `{ supportsCreateIssue: true, supportsCreateComment: true, scopes: ['issues:write'] }`
  - **Verify**: approval-gate test — agent with grant + approval can create; agent without grant gets `AgentAccessDenied`; agent with grant but no approval gets `paused_for_approval`
- [ ] 6.2.2 Register `action.slack` provider
  - **Files**: `src/lib/agent-providers/providers/action/slack.ts` (create); register in `register-defaults.ts`; `src/lib/agent-providers/auth/slack.ts` (create — bot-token resolution; OAuth flow follow-up out of scope)
  - **Pattern (D4)**: cost model `{ kind: 'request', perCallUsd: 0 }` (Slack API free); `outboundDomains: ['slack.com']`; capability `{ supportsSendMessage: true, supportsBlocks: true, scopes: ['chat:write'] }`
  - **Verify**: approval-gate test against stubbed Slack API
- [ ] 6.2.3 Register `action.notion` provider — `create-page` handler (reuses `oauth/notion.ts` from Phase 5.2.1)
  - **Files**: `src/lib/agent-providers/providers/action/notion.ts` (create); register in `register-defaults.ts`
  - **Pattern (D4)**: cost model `{ kind: 'request', perCallUsd: 0 }`; `outboundDomains: ['api.notion.com']`; capability `{ supportsCreatePage: true, scopes: ['insert_content'] }`
  - **Verify**: approval-gate test
- [ ] 6.2.4 Register `action.email` provider (via Cloudflare Email Routing for outbound or a provider like Resend — design D4 leaves the backend choice to the credential resolution)
  - **Files**: `src/lib/agent-providers/providers/action/email.ts` (create); register in `register-defaults.ts`; document in `design.md` D4 that the v1 backend is Resend (REST API `api.resend.com`) and that swapping to Mailgun/SES is a credential-only swap, not a code change
  - **Pattern (D4)**: cost model `{ kind: 'request', perCallUsd: 0.0004 }` (Resend production rate); `outboundDomains: ['api.resend.com']`; capability `{ supportsHtml: true, supportsText: true, supportsReplyTo: true, maxRecipients: 10 }`
  - **Verify**: approval-gate test; recipient cap enforced

### 6.3 Approval-gate end-to-end tests

- [ ] 6.3.1 Per-syscall E2E: for each of the 5 action syscalls, build a vitest that (a) dispatches a run that calls the syscall, (b) asserts the run enters `paused_for_approval` within 100ms, (c) asserts `agent_approval_requests` row exists with `reason='action.<provider>.<verb>'`, `context_json` containing the redacted input (per agent-access spec, sensitive fields like email body are truncated to first 100 chars), (d) approves via `kernel.access.resolveApproval({approvalId, decision:'approve', resolvedBy:'admin-user-id'})`, (e) asserts the syscall handler runs against a stubbed downstream API, (f) asserts the run completes with status `done`
  - **Files**: 5 test files alongside each provider — `src/lib/agent-providers/providers/action/{github,slack,notion,email}.approval.test.ts` (github gets one test covering both issue + comment paths)
  - **Pattern (D9)**: agent-os 1.5.7 approval resolution; spec scenarios for `AgentApprovalRejected` / `AgentApprovalExpired`
  - **Verify**: `pnpm vitest run src/lib/agent-providers/providers/action` green; ≥5 separate `paused_for_approval` rows observed across the test run

### 6.4 Telemetry + rollout

- [ ] 6.4.1 Production rollout order `slack → email → github.comment → github.issue → notion.create-page` (Slack and email are reversible-ish via deletion; GitHub issue and Notion page create persistent artifacts that are visible to others — so order them last). Each provider's per-flag flip requires (a) one synthetic test agent successfully completes the approval round-trip in prod, (b) 24h observation
  - **Files**: `progress.txt`
  - **Pattern (D5)**: Phase 2.4.2 rollout; D9 approval round-trip gate
  - **Verify**: per-provider rolling-window health OK AND `SELECT count(*) FROM agent_approval_requests WHERE status='approved' AND reason LIKE 'action.<provider>.%'` returns >= 1
- [ ] 6.4.2 Per-provider flags stay (do NOT retire) — action providers' blast radius warrants keeping the granular kill-switch even after stable rollout. Document this deviation from Phase 2/3/4/5 retirement pattern in `design.md` Resolutions as "Q-action-flags-permanent — action provider flags are NOT retired after the 7-day stabilization period because the blast radius (external user-visible artifacts) makes per-provider rollback a permanent requirement; the umbrella `providers.action` flag is the catastrophic-failure switch, but per-provider flags are the per-target rollback path"
  - **Files**: `design.md` (modify — Resolutions section)
  - **Pattern (D11)**: divergence from Phase 2.4.3 retirement; documented
  - **Verify**: design.md contains the resolution; flags remain in `flags.ts` after 7-day window

---

## Phase 7 — Routing features

**Goal**: Activate the design-D6 routing layer: fallback chains, periodic health checks, and load balancing weighted by latency / cost / success rate, plus per-provider rate limit enforcement. Phase 1's `routing.ts` shipped a single-provider passthrough; this phase replaces it with the full implementation.

**Files touched**: ~9 new (`routing-fallback.ts`, `routing-loadbalance.ts`, `routing-ratelimit.ts`, `health-cron.ts`, 4 unit-test files, 1 admin endpoint extension), ~3 modified (`routing.ts`, `wrangler.jsonc` cron entry, `kernel.ts` to register the cron hook)
**Verification**: chaos tests (kill provider A, observe failover to B within p95 budget) for each category; load-balance distribution matches declared weights within ±5% over 1000 simulated calls; rate-limit enforcement returns `ProviderRateLimited` when budget exceeded

### 7.1 Fallback chain implementation

- [ ] 7.1.1 Implement `src/lib/agent-providers/routing-fallback.ts` exporting `routeWithFallback({category, input, policy, kernel, ctx})`. Algorithm: (a) materialize candidate list from `policy.order` filtered by current `health.getHealth(providerId)` (drop providers whose `success_rate_pct < policy.minSuccessRate ?? 80` OR `is_healthy=false`), (b) attempt providers in order; if a provider throws a fallback-eligible error (`ProviderUnhealthy`, `ProviderRateLimited`, `CredentialNotFound`, `CredentialExpired`, fetch-network errors), record health failure and try next, (c) if a provider throws a non-fallback error (`ProviderInputInvalid`, `OutboundDomainNotGranted`, `AgentApprovalRejected`), surface immediately without trying others, (d) if all candidates fail, throw `AllProvidersFailed` with the per-attempt error chain
  - **Files**: `src/lib/agent-providers/routing-fallback.ts` (create)
  - **Pattern (D6)**: design D6 fallback decision tree; proposal §"Fallback chains declared per provider category (e.g. search.order: [tavily, exa, jina]); router auto-falls-back on failure or quota exhaustion"
  - **Verify**: `src/lib/agent-providers/routing-fallback.test.ts` covers (a) primary healthy → only primary attempted, (b) primary unhealthy → secondary attempted with `attempts.length === 2`, (c) all unhealthy → `AllProvidersFailed`, (d) input-invalid on primary → no fallback (immediate surface)
- [ ] 7.1.2 Modify `src/lib/agent-providers/routing.ts:route()` to delegate to `routeWithFallback` when `flags.providers.routing.fallback === true`, else preserve the Phase 1 single-provider passthrough behavior
  - **Files**: `src/lib/agent-providers/routing.ts` (modify)
  - **Pattern (D5)**: dispatch shim
  - **Verify**: routing test with flag off goes single-provider; with flag on uses fallback; existing Phase 1 tests still pass

### 7.2 Health check cron

- [ ] 7.2.1 Implement `src/lib/agent-providers/health-cron.ts` exporting `runHealthSweep({kernel, providers})`. For each registered provider whose category is in `['llm','search','reader']` (knowledge + action are not actively probed — too expensive / mutating), invoke the provider's declared `healthCheckFn` (each provider file declares a cheap probe, e.g. for `llm.openai` it's `models.list`; for `search.tavily` it's `POST /search {query:'health-check', limit:1}`; for `reader.directFetch` it's `fetch('https://example.com', {method:'HEAD'})`), record the result via `health.recordHealth()`. Sweep runs every 5 minutes via a new cron entry; per-sweep budget cap of 100ms per provider so a stuck probe doesn't blow the cron timeout
  - **Files**: `src/lib/agent-providers/health-cron.ts` (create); `wrangler.jsonc` (modify — add `*/5 * * * *` to `triggers.crons`); `scripts/create-cron-entry.mjs` (modify — extend generated `scheduled()` handler to dispatch this cron to `runHealthSweep`)
  - **Pattern (D7)**: design D7 health-check cadence + budget cap; agent-os Phase 4 cron orchestrator wiring
  - **Verify**: `src/lib/agent-providers/health-cron.test.ts` — fake-timers 5min tick, asserts `health.recordHealth` called once per registered provider in the 3 active categories; provider whose `healthCheckFn` rejects records `is_healthy=false`
- [ ] 7.2.2 Extend `GET /api/admin/providers/health` (created in Phase 1.5.2) to return real rolling-window aggregates per provider rather than empty map; also include `last_observed_at` per provider so the dashboard can show staleness
  - **Files**: `src/pages/api/admin/providers/health.ts` (modify)
  - **Pattern (D13)**: agent-os health endpoint shape
  - **Verify**: after one cron tick, curl returns non-empty `health` map with `success_rate_pct` for each probed provider

### 7.3 Load balancing

- [ ] 7.3.1 Implement `src/lib/agent-providers/routing-loadbalance.ts` exporting `chooseWithWeights({candidates, policy, health})`. Weight formula per design D6: `weight = (1 / cost_proxy) × success_rate × (latency_baseline / observed_p50)`. When `policy.loadBalanceWeights` provides static weights, multiply through. Weighted random selection; reseed with `crypto.getRandomValues(new Uint8Array(1))[0] / 255` per call so distribution is stochastic
  - **Files**: `src/lib/agent-providers/routing-loadbalance.ts` (create)
  - **Pattern (D6)**: design D6 weighted load-balance formula; proposal §"Load balancing across healthy providers in a category (weighted by latency / cost / success rate)"
  - **Verify**: `src/lib/agent-providers/routing-loadbalance.test.ts` — 1000 simulated calls with stub `crypto.getRandomValues` returning a sweep across [0,1) — distribution matches declared weights within ±5%
- [ ] 7.3.2 Wire load-balance selection into `routing-fallback.ts`: when `flags.providers.routing.loadBalance === true` AND ≥2 healthy candidates exist, use `chooseWithWeights` to reorder the candidate list before fallback iteration; otherwise preserve the static `policy.order` ordering
  - **Files**: `src/lib/agent-providers/routing-fallback.ts` (modify)
  - **Pattern (D6)**: hybrid load-balance + fallback per design D6
  - **Verify**: fallback test extended — with flag on + 3 healthy candidates and stub weights `[0.7, 0.2, 0.1]`, the primary attempt distribution across 100 runs matches weights within ±10%

### 7.4 Rate limit enforcement

- [ ] 7.4.1 Implement `src/lib/agent-providers/routing-ratelimit.ts` exporting `checkRateLimit({providerId, policy, kvBackend})`. Uses the existing rate-limit KV pattern from `src/lib/auth/rate-limit.ts` — per-provider sliding-window counter keyed `provider:rate:{providerId}:{minuteBucket}`. Per-provider rate from `policy.rateLimits[providerId]` (e.g. `{ perMinute: 60, perDay: 1000 }`). When exceeded, throw `ProviderRateLimited` with `retryAfterSeconds` populated so the fallback layer can take action
  - **Files**: `src/lib/agent-providers/routing-ratelimit.ts` (create)
  - **Pattern (D6)**: existing `src/lib/auth/rate-limit.ts` shape; design D6 rate-limit slot
  - **Verify**: `src/lib/agent-providers/routing-ratelimit.test.ts` — 61 calls in a minute, 61st throws `ProviderRateLimited`
- [ ] 7.4.2 Wire rate-limit check into `routing.ts:route()` immediately before invoking the provider handler when `flags.providers.routing.rateLimits === true`. On `ProviderRateLimited`, surface to fallback layer (treated as fallback-eligible per 7.1.1)
  - **Files**: `src/lib/agent-providers/routing.ts` (modify)
  - **Pattern (D6)**: routing pipeline order — rate-limit check is the last gate before handler invocation
  - **Verify**: integration test asserts that flipping `providers.routing.rateLimits=true` causes the 61st call to a single provider in a minute to fall over to the next provider in the chain (when fallback is also on)

### 7.5 Telemetry + rollout

- [ ] 7.5.1 Flip `AGENT_PROVIDERS_ROUTING_HEALTH_CHECKS=true` in prod first (lowest-risk, observation-only); after 24h of green health-snapshot writes, flip `AGENT_PROVIDERS_ROUTING_FALLBACK=true`; after 24h flip `AGENT_PROVIDERS_ROUTING_LOAD_BALANCE=true`; after 24h flip `AGENT_PROVIDERS_ROUTING_RATE_LIMITS=true`. Each step requires the standard 3 metrics + a new metric: `count(distinct provider_id)` chosen per category should rise after load-balance flips on (proves the selector isn't pinning to one provider)
  - **Files**: `progress.txt`
  - **Pattern (D5)**: Phase 2.4.2 rollout cadence; D6 ordering
  - **Verify**: per-flag health snapshot OK; new metric SQL `SELECT category, count(distinct provider_id) FROM agent_tool_calls WHERE started_at > unixepoch()-86400 GROUP BY category` returns >=2 per category for `llm` and `search`

---

## Phase 8 — Verification + dogfood + archive

**Goal**: Per-RAG-agent end-to-end parity check (`critic`, `writer`, `research`, `planner` from agent-os Phase 3 — verify that each agent's outputs are identical whether routed via legacy `invokeModel` + `searchExternalTools` OR via the registry). Cost telemetry sanity. Flip the umbrella `providers.enabled` flag, retire legacy modules, archive the OpenSpec change.

**Files touched**: 1 new endpoint extension + `docs/agent-providers-runbook.md` + cleanup deletions + `progress.txt`
**Verification**: 4-agent parity sweep green; 7-day production dashboard green for each provider category; OpenSpec strict-validate passes; legacy `provider-key-store.ts` + `external-search.ts` (the standalone modules) removed and replaced by registry-backed equivalents

### 8.1 RAG agent parity sweep

- [ ] 8.1.1 For each of the 4 RAG agents (`critic`, `writer`, `research`, `planner`), run a fixture-driven parity sweep: legacy path = all `providers.*` flags off; new path = all on. Same 5-fixture set per agent as agent-os Phase 3 (`critic.parity.test.ts`, `writer.parity.test.ts`, `research.parity.test.ts`, `planner.parity.test.ts`). Assert structural equality of agent outputs allowing the LLM-text drift bounds defined in each agent's parity test. NEW assertion: `agent_tool_calls.cost_usd > 0` on the new path for all paid providers; legacy path has `cost_usd = 0` placeholder (this is the differential the new path delivers — accurate cost telemetry per agent run)
  - **Files**: `src/lib/agent-providers/parity/{critic,writer,research,planner}.parity.test.ts` (create — 4 files, each importing the corresponding agent-os parity fixture set)
  - **Pattern (D5)**: agent-os Phase 3.x.5 parity tests; D12 cost differential
  - **Verify**: all 4 sweeps green; cost differential assertion holds
- [ ] 8.1.2 Production parity dashboard query: `SELECT date(started_at/1000,'unixepoch') d, agent_id, sum(total_cost_usd) cost, avg(total_cost_usd) avg_cost FROM agent_runs WHERE started_at > unixepoch()-86400*7 GROUP BY 1,2 ORDER BY 1 DESC` — compare to baseline week captured before `providers.enabled=true` was flipped. Assert per-agent average cost drift within ±10% (proves provider cost accounting is consistent across paths)
  - **Files**: `docs/agent-providers-runbook.md` (create — append SQL query here for ongoing ops use)
  - **Pattern (D12)**: cost telemetry sanity; agent-os Phase 6.2.2 SQL recipe style
  - **Verify**: baseline + post-flip dashboards captured in `.omc/research/agent-providers-cost-drift.md`; ±10% drift target met

### 8.2 Runbook + alerting

- [ ] 8.2.1 Create `docs/agent-providers-runbook.md` with sections: "Rotate a provider credential (D1 vs env var precedence)", "Force a provider unhealthy (cron sweep override)", "Add a new provider (file checklist)", "Diagnose `AllProvidersFailed` (event log spelunking)", "Approve a knowledge.write or action.* request", "Disable a provider category in an emergency (umbrella flag flip)"
  - **Files**: `docs/agent-providers-runbook.md` (extend from 8.1.2)
  - **Pattern (D13)**: agent-os Phase 6.2.1 runbook structure
  - **Verify**: `wc -l docs/agent-providers-runbook.md` >= 120 lines
- [ ] 8.2.2 Add alerting hooks in `src/lib/agent-providers/observability/alerts.ts`: `checkProviderHealth()` called from the daily `0 3 * * *` cron that logs WARN when (a) any provider category's `count(distinct provider_id healthy)` drops to 0, (b) `AllProvidersFailed` count in last hour > 5, (c) `agent_approval_requests` for `action.*` with `status='pending'` and age > 6h > 0 (faster threshold than knowledge writes because action visibility window is shorter)
  - **Files**: `src/lib/agent-providers/observability/alerts.ts` (create)
  - **Pattern (D13)**: agent-os Phase 6.2.4 alerting; same observability sink
  - **Verify**: alert function tested with synthetic D1 state showing each of the 3 conditions

### 8.3 Umbrella flag flip + legacy cleanup

- [ ] 8.3.1 Flip `AGENT_PROVIDERS_ENABLED=true` in production (this is the moment the registry path becomes the default for every agent whose per-category flag is on; per-category flags retired in Phases 2.4.3, 3.3.3, 4.3.3, 5.4.2 mean every category is registry-routed at this point). Observe 7 days; if any rollback is needed during the window, flip umbrella back to `false` (which short-circuits every registry-routed syscall back to legacy via the dispatch shims)
  - **Files**: `progress.txt`
  - **Pattern (D11)**: umbrella kill-switch from agent-os
  - **Verify**: 7-day window passes with `success_rate_pct >= 99` per category; daily health endpoint snapshot recorded in `.omc/research/agent-providers-day-{1..7}.json`
- [ ] 8.3.2 Delete legacy `src/lib/rag/model.ts:createModel` + `invokeModel` exports (keep the module for `resolveModelRoute` if any caller still reads it, OR delete the file entirely after a grep proves zero callers). Delete `src/lib/rag/provider-key-store.ts:loadProviderKeyOverrides` + `resolveProviderApiKeys` and replace any remaining caller with `agentProviders.credentials.resolveCredential(...)`. Keep `PROVIDER_SECRET_FIELDS` + `UNIQUE_PROVIDER_KEYS` + `isWhitelistedProviderKey` exports for the legacy admin `/api/admin/providers` settings UI (which is itself out of scope for this change — UI overhaul is a follow-up)
  - **Files**: `src/lib/rag/model.ts` (modify or delete), `src/lib/rag/provider-key-store.ts` (modify), `src/lib/tools/definitions/external-search.ts` (modify — internal `searchExternalTools` may also collapse into the registry now)
  - **Pattern (D5)**: agent-os Phase 3.5 cleanup
  - **Verify**: `grep -rn "invokeModel\|createModel\|loadProviderKeyOverrides\|resolveProviderApiKeys" src/ | grep -v "agent-providers\|test"` returns 0 lines (only registry-internal references and tests remain); `pnpm vitest run && pnpm exec astro check && pnpm build` all green
- [ ] 8.3.3 Bump `version: 2` on all `defineAgent` calls that newly depend on registry-routed providers (declares the upgrade in `agent_processes.updated_at`); confirm `agent_permissions` mirror update lands per agent-os Phase 1.4.8
  - **Files**: `src/lib/rag/agents/{critic,writer,research,planner}.ts` (modify)
  - **Pattern (D8)**: agent-os Phase 3.5.2 version bump
  - **Verify**: `SELECT agent_id, version FROM agent_processes` shows v2 for all four

### 8.4 Validate + archive

- [ ] 8.4.1 Run `pnpm lint && pnpm exec astro check && pnpm vitest run && pnpm check:references && pnpm build` — all must complete without errors
  - **Files**: (verification gate)
  - **Pattern**: zero-regression invariant
  - **Verify**: each command exits 0; captured to `.omc/research/agent-providers-phase8-suite.log`
- [ ] 8.4.2 Run `openspec validate agent-providers --strict` and fix any drift between proposal/tasks/specs and shipped behavior. Confirm each capability (`provider-registry`, `provider-credentials`, `provider-routing`) has a spec file under `openspec/changes/agent-providers/specs/`
  - **Files**: (verification gate)
  - **Pattern**: OpenSpec strict-validate flow
  - **Verify**: command exits 0 with no warnings
- [ ] 8.4.3 Update `progress.txt` at repo root: `agent-providers: complete — 5 LLM + 3 search + 4 reader + 4 knowledge + 5 action providers live behind central registry; routing fallback+health+load-balance+rate-limit enabled; archived YYYY-MM-DD`
  - **Files**: `progress.txt` (modify)
  - **Pattern**: project convention
  - **Verify**: `tail -1 progress.txt` matches; commit via `format-commit` skill per `CLAUDE.md`
- [ ] 8.4.4 Run `openspec archive agent-providers` to move the change to `openspec/changes/archive/YYYY-MM-DD-agent-providers/` and fold delta specs into main specs
  - **Files**: OpenSpec archival
  - **Pattern**: agent-os Phase 6.3.5
  - **Verify**: change directory moved; main specs updated
- [ ] 8.4.5 Open follow-up issues for deferred items: dynamic OpenRouter cost lookup (Phase 2.1.5 FIXME), Brave/Bocha/BrightData/Serper/SerpAPI search providers (out of scope for v1, credentials exist but no provider files), Mailgun/SES email backend swap (Phase 6.2.4), Slack OAuth flow (Phase 6.2.2), provider settings UI overhaul on `/api/admin/providers` (legacy endpoint preserved but UI is unchanged), per-credential scope enforcement at runtime (the schema supports `scope_json` but the routing layer does not yet check scopes — only category + provider grant)
  - **Files**: (no new files — issue creation gate)
  - **Pattern**: agent-os Phase 6.3.6 follow-up issue pattern
  - **Verify**: at least 6 issues filed referencing this change as parent
