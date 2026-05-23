## Context

After `agent-foundation` (#0) and `agent-os` (#1) land, every external service call by every agent flows through `ctx.syscall(name, input)` on the kernel's MCP-compatible tool ABI (agent-foundation D3, agent-os D4). The kernel mediates permissions, telemetry, cost, and cancellation — but it has nothing to say about **which vendor backs a given capability**. The four RAG agents today resolve provider choice locally:

| Surface | Today | Pain |
|---|---|---|
| LLM routing | `src/lib/rag/model.ts` `createModel(route)` — 9 if-branches, one per vendor (`openai`, `gemini`, `groq`, `cloudflare`, `openrouter`, `nvidia`, `cerebras`, `ollama_cloud`, `ollama`) | Each new vendor edits this file; no shared health/cost/latency surface; per-call fallback is single-shot try/catch (`invokeModel`) |
| Search | `src/lib/rag/tools/external-search.ts` calls Tavily/Exa/Jina directly with `if (provider === X)` branches; one secret resolver per tool | Cannot swap `tavily → exa` without code edit; quota exhaustion = silent 429 |
| Credentials | `src/lib/rag/provider-key-store.ts` (~140 lines) — flat `env_var → string` table with hard-coded alias normalization (`GOOGLE_API_KEY ↔ google ↔ gemini`); D1 overrides via `settings` table prefixed `provider_key:` | Aliases baked into TypeScript; no scope / expiry; no service-account / OAuth path |
| Action providers | none — write operations to Slack / Notion / GitHub do not exist yet but are listed in the Gateway Console plan | Greenfield, but blast radius is real; needs approval-gate integration from kernel D9 |
| Health / cost / fallback | none — `invokeModel` does `try { primary } catch { fallback }` once; no per-vendor success-rate tracking; cost is computed nowhere | Cannot answer "which provider degraded this morning?" |

This change is the **provider substrate** every downstream change consumes. `agent-flow` (#3) `agent` and `tool_group` steps invoke `ctx.syscall('model.invoke', …)` and `ctx.syscall('search.external', …)` without naming a vendor; routing is here. `agent-policy` (#5) declares allowlists and budgets that this router enforces. `agent-console` (#4) reads the `provider_health_snapshots` and `agent_tool_calls` tables this change writes/extends.

**Stakeholders.**
- **Admin operator** — wants to add an API key in the UI and have every agent that needs that capability immediately use it; wants to see "Tavily down, fell back to Exa" in the run timeline.
- **Platform engineer** — wants to plug a new provider (e.g. Brave Search) by writing one adapter file, not 6 if-branches across the codebase.
- **Future visual flow editor** — needs the provider catalog as data so a step config dropdown can list "available LLM providers".

**Constraints.**
1. **No RAG regression.** The four agents must continue to work through their existing call paths until each is migrated to the kernel via agent-os D10; the legacy `createModel` path stays available behind a flag.
2. **Credential migration is reversible.** Existing `provider_key:` rows in `admin_settings` must keep working; the new credential store reads them as a fallback during the transition.
3. **Day-1 cost telemetry.** Every provider call writes a row consumable by the kernel's `agent_tool_calls` table (agent-os D3) — providers do not invent their own telemetry shape.
4. **Bounded blast radius.** Umbrella flag `AGENT_PROVIDERS_ENABLED` defaults off; per-category flags (`...LLM`, `...SEARCH`, `...READER`, `...KNOWLEDGE`, `...ACTION`) layer on top. Action providers stay dark behind `AGENT_PROVIDERS_ACTION` until approval-gate integration is validated.

## Goals / Non-Goals

**Goals**
- Typed provider registry under `src/lib/agent-providers/` covering five categories (LLM, Search, Reader, Knowledge, Action) — each category has its own capability interface, its own router, its own metrics tags
- Adapter pattern: each concrete provider lives in `src/lib/agent-providers/<category>/<provider>.ts` and exports a factory `createXProvider(creds)` returning a typed object — no class hierarchy
- Encrypted credential store using kernel storage (agent-os D2) — `provider_credentials` D1 table with AES-GCM payloads sealed by a Worker-secret-derived key
- Declarative fallback chain per category with three trigger modes (failure-class, quota-exhausted, latency-budget) and four selection algorithms (priority-order, weighted-round-robin, EWMA-latency, P2C-success-rate)
- Health snapshots — both passive (per-call rolling success/latency) and active (cron-driven ping for high-priority providers) — written to `provider_health_snapshots`
- Cost telemetry — extend the kernel's `agent_tool_calls` row with provider-specific columns (NOT a separate table) so cross-agent dashboards stay single-source
- Action providers gated through the kernel approval mechanism (`agent_approval_requests`) — any provider whose definition has `irreversible: true` short-circuits to an approval before the syscall executes
- OAuth credential flow with refresh-token rotation (interactive grant via admin UI; service-account variant via env-injected JSON)
- Migration: existing `LLM_PROVIDER` env var + `provider-key-store.ts` continues to work; the new registry reads it as a v0 source until each RAG agent is migrated

**Non-Goals**
- Multi-tenancy of credentials (single org for now; matches agent-os non-goals)
- Per-user provider preference (`scope.userId` reserved for v2)
- A2A protocol or federated provider discovery
- Replacing `provider-key-store.ts` synchronously — it stays as the v0 backend until every RAG agent is on the kernel path
- Visual provider-catalog editor — `agent-console` (#4) owns the UI
- BYO-MCP-server registration as a "provider" — that path is `agentOs.tools.mcpExternal` from agent-os D11; this change only wraps first-party HTTP APIs and SDKs
- Cost optimization heuristics (e.g. "always pick cheapest LLM that passes quality bar") — the policy engine (#5) owns that decision; this change only exposes per-call cost so the policy has data to act on

## Decisions

### D1: Five typed registries, not one unified registry

**Decision.** Keep one registry **per category** — `llmRegistry`, `searchRegistry`, `readerRegistry`, `knowledgeRegistry`, `actionRegistry` — each parameterized by its own capability interface. A thin `providerRegistry` module re-exports all five for discovery, but the routing functions live in their category-specific modules.

```typescript
// src/lib/agent-providers/llm/types.ts
export interface LLMProvider {
  readonly id: string                           // 'openai', 'anthropic', 'gemini', ...
  readonly category: 'llm'
  invoke(input: LLMInvokeInput): Promise<LLMInvokeOutput>
  estimateCost(input: LLMInvokeInput, output: LLMInvokeOutput): number
  healthPing?(): Promise<{ ok: boolean; latencyMs: number }>
}

// src/lib/agent-providers/search/types.ts
export interface SearchProvider {
  readonly id: string                           // 'tavily', 'exa', 'jina', ...
  readonly category: 'search'
  search(input: SearchInput): Promise<SearchOutput>
  estimateCost(input: SearchInput, output: SearchOutput): number
  healthPing?(): Promise<{ ok: boolean; latencyMs: number }>
}
// reader, knowledge, action follow the same shape
```

**Alternatives considered.**
- *One unified `Provider<TIn, TOut>` interface*. Rejected — LLM invoke and Slack `chat.postMessage` share no input shape; collapsing them forces `unknown` everywhere and loses type safety at every call site. The router would have to discriminate by `category` field at runtime.
- *Class hierarchy (`AbstractProvider` → `AbstractLLMProvider` → `OpenAIProvider`)*. Rejected — TypeScript inheritance buys nothing here; the duck-typed factory pattern (D2) is simpler and matches the rest of the codebase.

**Rationale.** Each category has a different ABI because each backs a different syscall (`model.invoke`, `search.external`, `fetch.url`, `knowledge.query`, `action.execute`). Typing them separately makes the syscall handler a single dispatch table, not a switch with `as unknown as`.

### D2: Factory functions returning frozen objects — no classes, no DI container

**Decision.** Each concrete provider exports `createXProvider(opts: { credentials: ResolvedCredential, config?: ProviderConfig })` that returns a frozen object implementing the category interface. No class instances, no inheritance, no DI container.

```typescript
// src/lib/agent-providers/llm/openai.ts
import OpenAI from 'openai'
import type { LLMProvider } from './types'
import type { ResolvedCredential } from '../credentials/types'

export function createOpenAIProvider(opts: {
  credentials: ResolvedCredential
  config?: { baseURL?: string; defaultModel?: string }
}): LLMProvider {
  const client = new OpenAI({ apiKey: opts.credentials.apiKey, baseURL: opts.config?.baseURL })
  return Object.freeze({
    id: 'openai',
    category: 'llm' as const,
    async invoke(input) { /* ... */ },
    estimateCost(input, output) { /* token math from input/output usage */ },
    async healthPing() {
      const t = Date.now()
      try { await client.models.list(); return { ok: true, latencyMs: Date.now() - t } }
      catch { return { ok: false, latencyMs: Date.now() - t } }
    },
  })
}
```

Registration is plain TypeScript at module load time:

```typescript
// src/lib/agent-providers/llm/index.ts
import { createOpenAIProvider } from './openai'
import { createAnthropicProvider } from './anthropic'
// ...
export const LLM_PROVIDER_FACTORIES = {
  openai: createOpenAIProvider,
  anthropic: createAnthropicProvider,
  gemini: createGeminiProvider,
  openrouter: createOpenRouterProvider,
} as const
```

**Alternatives considered.**
- *Class hierarchy*. Rejected for the same reason as D1 — no shared behavior worth inheriting; mocks are harder; `class` adds `new` ceremony.
- *Decorator-based registration (NestJS style)*. Rejected — requires `experimentalDecorators` + reflect-metadata, neither configured today.
- *Service registry with `register(id, factory)` calls at module init*. Rejected — silently fragile when import order changes; an exported const object enumerates everything in one file.

**Rationale.** Frozen factory objects are the most TypeScript-idiomatic of these options, give us identity (you can `===`-compare provider singletons), and let mocks be one-liners (`{ ...realProvider, invoke: vi.fn() }`).

### D3: Credentials — encrypted at rest in D1; AES-GCM with Worker-secret-derived key

**Decision.** Credentials live in a new D1 table `provider_credentials`. Payloads are AES-GCM encrypted using a key derived (HKDF-SHA256) from a Worker secret `PROVIDER_KEY_ENCRYPTION_KEY` (a 32-byte secret bound via `wrangler secret put`). KV is **not** used (eventual consistency creates a stale-credential failure mode; secret bindings can't be enumerated). Cloudflare Worker Secret Bindings are still supported as a v0 read-through source (matches existing `OPENAI_API_KEY` style envs).

**Backend layering** (read order; first hit wins):
1. **D1 `provider_credentials`** (encrypted; admin-managed; this is the new canonical store)
2. **`admin_settings` `provider_key:*` rows** (legacy from `provider-key-store.ts` — read-through for migration window; written-through with deprecation log line)
3. **Worker secret bindings** (env vars like `OPENAI_API_KEY` — v0 backstop; never written from the new store)

```sql
-- 0012_agent_providers.sql (excerpt; full schema in D12)
CREATE TABLE provider_credentials (
  credential_id TEXT PRIMARY KEY,                -- UUID
  provider_id TEXT NOT NULL,                     -- 'openai', 'tavily', 'notion', ...
  credential_kind TEXT NOT NULL CHECK (credential_kind IN
    ('api_key','oauth','service_account')),
  label TEXT NOT NULL,                           -- human label e.g. "Personal OpenAI"
  payload_ciphertext BLOB NOT NULL,              -- AES-GCM(plaintext)
  payload_iv BLOB NOT NULL,                      -- 12-byte IV per row
  scope_json TEXT,                               -- {"agents": ["research"], "envs": ["prod"]}
  expires_at INTEGER,                            -- unix seconds; null = no expiry
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_used_at INTEGER
);
CREATE INDEX idx_provider_credentials_provider ON provider_credentials(provider_id, expires_at);
```

```typescript
// src/lib/agent-providers/credentials/crypto.ts
const KEY_INFO = new TextEncoder().encode('agent-providers/v1/credential')
export async function deriveCredentialKey(secret: string): Promise<CryptoKey> {
  const ikm = new TextEncoder().encode(secret)
  const baseKey = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: KEY_INFO },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}
```

**Alternatives considered.**
- *KV-backed credential store*. Rejected — eventual consistency means a key-rotation can be invisible for ~60s; admin operator expects "I saved it, next call uses it"; D1's strong consistency wins.
- *Cloudflare Secret Bindings exclusively (no D1 table)*. Rejected — Workers Secrets are bound at deploy time and not enumerable from inside the Worker; adding a credential requires a `wrangler secret put` + redeploy. The admin UI cannot manage these.
- *Plaintext D1 column*. Rejected — credentials are the highest-blast-radius data in this change; at-rest encryption is a hard requirement.
- *Per-provider encryption key*. Rejected for v1 — one HKDF root suffices; per-provider derivation buys nothing against a Worker-secret compromise (the attacker has root).

**Rationale.** D1 + AES-GCM + Worker-secret HKDF root is the right balance: enumerable from admin UI, encrypted at rest, single secret to rotate (rotating re-encrypts every row in one migration), and no new infrastructure tier.

### D4: Fallback chain — three triggers, declared per category, semantics are "next on chain"

**Decision.** A fallback chain is an ordered list of provider IDs declared per category in `admin_settings` (key `providers:chain:<category>`). The router tries each in order; **only the three documented triggers** advance to the next entry:

| Trigger | Detection | Example |
|---|---|---|
| **Failure-class** | Response error matches one of: `429` rate-limit, `5xx`, network timeout, `ETIMEDOUT`, `ECONNRESET`, AbortError. Same retryable-error set as agent-flow D8. | Tavily returns 503 → fall to Exa |
| **Quota-exhausted** | Response error explicitly signals quota (provider-specific predicates registered with the adapter: `OpenAI: 'insufficient_quota'`; `Tavily: 'quota_exceeded'`). Marks the provider unhealthy for `quotaCoolDownSeconds` (default 1h). | Anthropic returns `quota_exceeded` → fall to Gemini, hold Anthropic out for 1h |
| **Latency-budget** | Per-call wall-clock exceeds `latencyBudgetMs` (configurable per category; default 30s for LLM, 15s for Search/Reader, 60s for Knowledge). Abort + try next. | OpenAI takes >30s → abort, try Anthropic |

Triggers **do not** include: bad-input errors (4xx other than 429), authentication failures (the chain stops with `AuthError`; falling through would mask a misconfigured key), or denied permissions (kernel access-manager rejection).

```typescript
// src/lib/agent-providers/llm/router.ts
export async function invokeLLM(ctx: SyscallContext, input: LLMInvokeInput): Promise<LLMInvokeOutput> {
  const chain = await getChain('llm')               // ['openai', 'anthropic', 'gemini']
  let lastError: unknown
  for (const providerId of chain) {
    if (isQuotaCooledDown(providerId)) continue
    const provider = await resolveProvider('llm', providerId)
    try {
      const result = await withLatencyBudget(provider.invoke(input), getBudget('llm'))
      await recordSuccess(ctx, providerId, result)
      return result
    } catch (err) {
      if (!shouldAdvanceChain(err)) throw err       // auth/validation/permission → no fallback
      if (isQuotaError(provider, err)) markQuotaCooled(providerId)
      await recordFailure(ctx, providerId, err)
      lastError = err
    }
  }
  throw new AllProvidersFailedError(chain, lastError)
}
```

**Alternatives considered.**
- *Fallback on any error*. Rejected — masks misconfiguration (a wrong API key would silently route to the next, billing on the wrong account).
- *Per-syscall fallback override in the call site*. Rejected — defeats the point of centralized routing; agents would re-implement chain logic.
- *Circuit-breaker pattern (Hystrix-style)*. Considered, deferred — for v1, simple cool-down on quota errors is sufficient; full circuit breaker is a v2 addition when we have real failure-rate data to tune from.

**Rationale.** Three explicit triggers (failure / quota / latency) cover the observable degradation modes without conflating "real bug" (auth/validation) with "transient ops" (timeout/rate-limit). Quota cool-down prevents thrashing.

### D5: Health checks — passive default, active opt-in per provider

**Decision.** **Passive** health is always on: every router call updates a rolling EWMA of `successRate` (window: last 50 calls) and `latencyMs` (window: last 20 calls) per provider in KV. **Active** health is opt-in per provider via `healthPing?()` on the adapter; when present and the provider declares `activeHealthCheck: { intervalSeconds: 60 }`, a cron-driven sweep (piggybacks on agent-os's existing cron infra) pings the provider and writes a row to `provider_health_snapshots`.

| Signal | Source | Write cadence | Read use |
|---|---|---|---|
| **Per-call success/failure** | Router instrumentation | Every call (batched with `agent_tool_calls` write) | EWMA update; cool-down arming |
| **Rolling EWMA (success rate, latency)** | Computed in KV (`provider:ewma:<id>`) | Updated per call | Load balancing (D6); admin "is X healthy?" |
| **Active ping snapshot** | Cron handler calls `healthPing()` | Configurable (default 60s for opt-in providers) | Pre-emptive cool-down before user-visible failure; admin status page |

**Degrade vs. hard-fail.** Two thresholds (configurable in `admin_settings`):
- `degradedSuccessRateThreshold` (default 0.85): below this, the provider is **deprioritized** in load balancing (D6) but still receives traffic via fallback chain
- `unhealthySuccessRateThreshold` (default 0.50): below this, the provider is **skipped** in the chain for `unhealthyCoolDownSeconds` (default 5 min); next call re-evaluates

Active-ping failures count toward the EWMA (with a configurable weight, default 0.5 — half the weight of a real call so a flaky ping doesn't kill a working provider).

**Alternatives considered.**
- *Active-only health (constant pings)*. Rejected — burns quota for providers that are working fine for real traffic; many APIs (Slack, GitHub) don't have a free "ping" endpoint.
- *Passive-only*. Rejected — first call after a long quiet period gets the failure; active ping for high-priority providers catches degradation before user impact.
- *External monitor (Better Uptime, Cronitor)*. Rejected — another billing line for a problem we can solve in-Worker; revisit if active-ping CPU cost shows up.

**Rationale.** Passive default keeps cost zero; active opt-in for the 2–3 providers where pre-emptive detection matters (LLM primary, primary search) catches the common "vendor degraded silently for 5 min" pattern.

### D6: Load balancing — priority-order default; three algorithms behind a per-category flag

**Decision.** Within a fallback chain, **the chain is a strict priority order** by default (first healthy provider gets the call). Three alternative selection algorithms are available per category via `admin_settings` key `providers:selection:<category>`:

| Algorithm | When to use | Cost to implement |
|---|---|---|
| **Priority order** (default) | Stable preference; "use OpenAI unless it's down" | Trivial — current behavior |
| **Weighted round-robin** | Spread cost across two roughly-equivalent providers | Per-provider weight integer; modular counter in KV |
| **EWMA latency** | Latency-sensitive paths (interactive deep-research) | Reads `provider:ewma:<id>` from KV; picks lowest |
| **P2C success rate** (Power-of-Two-Choices on success rate EWMA) | High-throughput paths where load is real | Pick 2 random from healthy set; choose higher success rate |

Selection algorithm is per-category, not per-provider, so a category can be "always prefer first" while another is "spread across all". The fallback chain (D4) still governs failure behavior **after** the selection algorithm picks a provider.

**Alternatives considered.**
- *Single hard-coded algorithm (priority order only)*. Rejected for v1 — Gateway Console §4.5 explicitly calls out cost-balanced LLM routing as a feature; locking to priority would force every downstream user to wait for a follow-up change.
- *Full Hedge-style speculation (issue to two, take the faster)*. Rejected — doubles cost; reserve for v2 if a use case appears.
- *EWMA on cost (cheapest-first)*. Folded into policy (#5) — operational selection is fast (latency, success rate); cost-optimal selection is a quality/budget trade-off and belongs upstream of the router.

**Rationale.** Priority-order is the right default (predictable, debuggable); having three alternative algorithms gated by config means we can flip behavior without code change when we measure a real need.

### D7: Cost telemetry — extend kernel `agent_tool_calls`, no new table

**Decision.** Add three nullable columns to `agent_tool_calls` (migration `0012` includes the ALTER) instead of creating a separate `provider_calls` table:

```sql
-- in 0012_agent_providers.sql
ALTER TABLE agent_tool_calls ADD COLUMN provider_id TEXT;
ALTER TABLE agent_tool_calls ADD COLUMN provider_category TEXT;
ALTER TABLE agent_tool_calls ADD COLUMN fallback_index INTEGER;  -- 0=primary, 1=first fallback, ...
CREATE INDEX idx_agent_tool_calls_provider ON agent_tool_calls(provider_id, started_at DESC);
```

The router populates these on every write; non-provider syscalls (e.g. `memory.read`) leave them NULL. The existing `cost_usd`, `latency_ms`, `tokens_in/out` columns from agent-os D3 carry the same data they always did — `estimateCost()` on the adapter feeds the kernel's `computeCost()` (agent-foundation D4) when a `CostModel` is registered.

**Alternatives considered.**
- *Separate `provider_calls` table*. Rejected — joins for every dashboard query; kernel and provider telemetry tell the same story per call; single table = single timeline.
- *Provider telemetry in KV (counters)*. Rejected — loses per-call detail; can't answer "show me the actual prompt that cost $0.40".
- *Don't track which fallback was used*. Rejected — without `fallback_index`, "Tavily fell to Exa" is invisible to the admin console.

**Rationale.** One table, one query, one source of truth for cost per agent / per provider / per category. The schema delta is three nullable columns + one index — cheap and additive.

### D8: OAuth flow — interactive grant via admin UI; refresh tokens stored encrypted alongside access tokens

**Decision.** OAuth credentials (Notion, GitHub, Google Drive, Slack) use the standard authorization-code flow. The admin UI initiates `POST /api/admin/providers/oauth/:provider/start` which returns the authorization URL; the user authorizes; the provider redirects to `GET /api/admin/providers/oauth/:provider/callback?code=...`; the handler exchanges the code for `{ access_token, refresh_token, expires_in }` and writes one `provider_credentials` row (`credential_kind='oauth'`) with the encrypted payload `{ accessToken, refreshToken, expiresAt, scopes, providerSpecific }`.

Refresh logic: when the router resolves an OAuth credential and `expiresAt - now < refreshThresholdSeconds` (default 300s), it triggers a refresh **before** the call; the refreshed payload is written back atomically (UPDATE with `last_used_at = now`). If the refresh itself returns `invalid_grant`, the credential is marked expired (`expires_at = now`, `last_used_at = now` plus an `agent_run_events` entry `kind='credential_invalid'`) and the call falls through the chain.

**Service-account variant.** GitHub App private keys, Google service-account JSON, and Slack bot tokens (which don't expire) use `credential_kind='service_account'`. The payload is the raw service-account JSON / private key, encrypted the same way. No refresh logic. The admin UI accepts these as file upload or paste.

**Alternatives considered.**
- *Defer OAuth to v2*. Rejected — Notion / GitHub / Slack action providers are listed in the proposal; without OAuth we can't ship them.
- *Cloudflare Access for OAuth*. Rejected — Access is for protecting Workers endpoints, not for relaying user OAuth to third-party APIs; wrong primitive.
- *Per-user OAuth tokens*. Rejected for v1 — single-org constraint; tokens are organization-level service identities. Per-user lands when multi-tenancy lands.

**Rationale.** Standard OAuth code flow is one well-understood pattern. Refresh-on-resolve (not on a schedule) avoids the "refresh fires while the token is in flight" race; the threshold gives headroom for slow networks.

### D9: Action providers — kernel approval gate is the only write-path mediator

**Decision.** Any provider in the **Action** category MUST mark its definition `irreversible: true`. The router checks this flag before executing; if set, it constructs an `agent_approval_requests` row (agent-os D9) with `reason='action.<provider>.<operation>'` and the input payload as `context_json`, then transitions the calling run to `paused` until the approval row resolves. The agent's `defineAgent` declaration controls whether approvals are required globally (`irreversibleActionsRequireApproval: true|false`); for action providers, the provider-side `irreversible` flag is the floor (cannot be turned off by the agent — adding an exception requires a `approvalBypass: ['action.slack.post']` field on `defineAgent`, which is auditable in PR review).

```typescript
// src/lib/agent-providers/action/slack.ts
export function createSlackProvider(opts): ActionProvider {
  return Object.freeze({
    id: 'slack',
    category: 'action' as const,
    operations: {
      'chat.postMessage': {
        irreversible: true,                       // posts to channel; cannot recall
        approvalScope: 'channel',                 // approvals are per-channel, not per-message
        async execute(input) { /* ... */ },
      },
      'conversations.history': {
        irreversible: false,                      // read-only; no approval
        async execute(input) { /* ... */ },
      },
    },
  })
}
```

The kernel's existing approval poll (agent-os D9, R8) wakes the paused run when the approval row flips to `approved`. On `rejected` or `expired`, the syscall rejects with `ActionRejected` / `ActionApprovalExpired` and the agent decides what to do (typically: log + halt).

**Alternatives considered.**
- *Approval gate inside each action provider*. Rejected — duplicates the kernel mechanism; every new action provider would re-implement approval rows.
- *Allow agents to bypass approvals via flag at runtime*. Rejected — `approvalBypass` on `defineAgent` is the only escape; it's declarative in code (PR-reviewable) and per-operation, not a global runtime switch.

**Rationale.** Action providers are the highest-blast-radius surface in this change. Routing every write through the kernel's existing approval gate (agent-os D9) means there is exactly one code path for "did a human OK this?", and the visual run timeline already knows how to render it.

### D10: Migration path — additive backstop, per-RAG-agent flag, zero behavior change on first deploy

**Decision.** The new registry ships **alongside** `provider-key-store.ts` and `createModel()`, not replacing them. Migration sequence:

1. **Deploy registry, dark** (`AGENT_PROVIDERS_ENABLED=false`). New tables exist; new code paths exist; nothing calls them yet. RAG agents continue through `createModel()` and `provider-key-store.ts`.
2. **Provider definitions registered, credentials migrated.** Existing `provider_key:*` rows in `admin_settings` are read by the new credential store as a backstop (D3 layering). Admin can start managing credentials in the new UI; the legacy path keeps reading from `admin_settings` so the RAG agents are unaffected.
3. **Per-RAG-agent flag flip.** Each RAG agent (`critic`, then `writer`, then `research`, then `planner`) is migrated to call `ctx.syscall('model.invoke', …)` instead of `invokeModel(...)` directly (matches agent-os D10 sequence). When `agentOs.<agent>=true` AND `agentProviders.llm=true`, the syscall routes through the new registry; otherwise legacy path. Each migration includes a parity test (same input through both paths → diff outputs).
4. **Deprecate legacy paths.** Once all four agents are migrated and stable for 4 weeks, `createModel()` is marked deprecated; new code must use the registry. The function stays as a thin shim that calls the registry until cleanup in a follow-up.
5. **Drop legacy `provider_key:*` rows.** After deprecation window, a migration moves remaining rows from `admin_settings` into `provider_credentials` and removes the `provider-key-store.ts` reader. This is the only destructive step; gated on a documented checklist.

**Rollback per step.** Each step toggles a flag (`AGENT_PROVIDERS_*` or per-RAG `agentOs.<agent>`); flipping back restores the legacy path. The destructive step 5 has a documented restore procedure (re-insert from D1 backup taken before the migration; covered in agent-foundation D6 split-migration pattern).

**Rationale.** The four RAG agents are the production payload of the blog; a single bad deploy that breaks them breaks the site. Additive ship + per-agent flag + parity test is the same pattern agent-os uses for D10, repeated here because the failure mode is identical.

### D11: Feature flags — umbrella, per-category, plus per-provider for action category

**Decision.** Six new entries in the central `src/lib/config/flags.ts` (module from agent-foundation D2):

| Flag | Default | Purpose |
|---|---|---|
| `AGENT_PROVIDERS_ENABLED` | `false` | Umbrella; off = entire router is dark, syscalls fall through to legacy |
| `AGENT_PROVIDERS_LLM` | `false` | Route `model.invoke` through registry |
| `AGENT_PROVIDERS_SEARCH` | `false` | Route `search.external` through registry |
| `AGENT_PROVIDERS_READER` | `false` | Route `fetch.url` through registry |
| `AGENT_PROVIDERS_KNOWLEDGE` | `false` | Enable knowledge providers (Notion, GitHub, Drive, SQL reads) |
| `AGENT_PROVIDERS_ACTION` | `false` | Enable action providers (writes); blocked until approval-gate integration validated |

```typescript
// flags.ts additions
agentProviders: {
  enabled: boolEnv('AGENT_PROVIDERS_ENABLED', false),
  llm: boolEnv('AGENT_PROVIDERS_LLM', false),
  search: boolEnv('AGENT_PROVIDERS_SEARCH', false),
  reader: boolEnv('AGENT_PROVIDERS_READER', false),
  knowledge: boolEnv('AGENT_PROVIDERS_KNOWLEDGE', false),
  action: boolEnv('AGENT_PROVIDERS_ACTION', false),
},
```

**Per-action-provider flag pattern** (documented, not pre-populated, same approach as agent-flow D13): when an individual action provider needs phased rollout (e.g. `slack` rolls before `notion`), add `AGENT_PROVIDERS_ACTION_<PROVIDER>` that the router checks before accepting that provider id; default each new action provider to off until vetted.

**Rationale.** Six flags matches the CLAUDE.md mandate "all advanced techniques individually toggleable". Action category gets the extra per-provider pattern because individual write providers have different blast radii (Slack post < GitHub issue create < Notion page write < GitHub commit).

### D12: D1 schema — three new tables (one migration `0012_agent_providers.sql`)

**Decision.** Migration `0012` adds three tables plus the ALTER on `agent_tool_calls` from D7. Slots immediately after `0011_agent_os.sql`; no overlap with agent-foundation `0010` or downstream `0013_agent_flow.sql`.

```sql
-- 0012_agent_providers.sql

-- One row per registered provider definition (code is the source; this is the queryable index)
CREATE TABLE provider_definitions (
  provider_id TEXT PRIMARY KEY,                  -- 'openai', 'tavily', 'notion', ...
  category TEXT NOT NULL CHECK (category IN ('llm','search','reader','knowledge','action')),
  display_name TEXT NOT NULL,
  capabilities_json TEXT NOT NULL,               -- declared operations + flags (e.g. {"irreversible": true})
  default_config_json TEXT,                      -- default model name, base URL, etc.
  active_health_check_seconds INTEGER,           -- null = passive only
  registered_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Credentials — schema in D3 (repeated here as part of the migration view)
CREATE TABLE provider_credentials (
  credential_id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES provider_definitions(provider_id),
  credential_kind TEXT NOT NULL CHECK (credential_kind IN ('api_key','oauth','service_account')),
  label TEXT NOT NULL,
  payload_ciphertext BLOB NOT NULL,
  payload_iv BLOB NOT NULL,
  scope_json TEXT,
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_used_at INTEGER
);
CREATE INDEX idx_provider_credentials_provider ON provider_credentials(provider_id, expires_at);

-- Active-ping snapshots (passive EWMA lives in KV)
CREATE TABLE provider_health_snapshots (
  snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id TEXT NOT NULL REFERENCES provider_definitions(provider_id),
  source TEXT NOT NULL CHECK (source IN ('active_ping','passive_rollup','manual_test')),
  ok INTEGER NOT NULL,                           -- 0 = failure, 1 = success
  latency_ms INTEGER,
  error TEXT,
  snapshot_at INTEGER NOT NULL
);
CREATE INDEX idx_provider_health_snapshots_provider ON provider_health_snapshots(provider_id, snapshot_at DESC);

-- Extension to kernel telemetry from D7
ALTER TABLE agent_tool_calls ADD COLUMN provider_id TEXT;
ALTER TABLE agent_tool_calls ADD COLUMN provider_category TEXT;
ALTER TABLE agent_tool_calls ADD COLUMN fallback_index INTEGER;
CREATE INDEX idx_agent_tool_calls_provider ON agent_tool_calls(provider_id, started_at DESC);
```

**Alternatives considered.**
- *Embed health snapshots in `agent_tool_calls`*. Rejected — active pings aren't tool calls (no run id); conflating breaks the foreign-key shape.
- *Keep provider definitions in code only, no D1 mirror*. Rejected — admin UI needs to list registered providers without booting all factory functions; the mirror is the API.

**Rationale.** Three tables track three distinct lifecycles (definitions, credentials, health). The ALTER on `agent_tool_calls` keeps cost telemetry on one timeline. One migration, additive, reversible via `DROP TABLE` + `ALTER ... DROP COLUMN` (D1 supports column drops via the SQLite-emulated path).

## Risks / Trade-offs

### R1: Credential leak through logs, errors, or telemetry rows
**Risk.** A misconfigured provider adapter could log a credential, write it to `agent_run_events.payload_json`, or include it in a returned error message. One leak compromises the entire provider account.
**Mitigation.** (a) Credentials are typed as `ResolvedCredential` with no `toString`/`toJSON` — accidental concatenation produces `[object Object]`, not the secret. (b) The router's error-path serializer (`src/lib/agent-providers/errors.ts`) explicitly strips known credential field names before writing any event row. (c) An oxlint rule (custom or pattern-based) flags any log/throw statement in `src/lib/agent-providers/**` that touches `.apiKey`, `.accessToken`, `.refreshToken`, `.privateKey`. (d) Pre-merge: a vitest test scans the entire `agent_run_events` and `agent_tool_calls` write paths for any code path that could include a credential field; failing test blocks merge.

### R2: Cascade failure — primary degrades, fallback also overloaded
**Risk.** If primary search vendor goes down, every active flow falls to the secondary simultaneously, overloading it (thundering herd).
**Mitigation.** (a) Quota cool-down (D4) prevents thrashing back to the failed primary. (b) Per-provider rate limit at the router (D11 in policy will own caps; v1 default is a per-provider semaphore at `concurrentRequestLimit` from `default_config_json`). (c) Active-ping (D5) on the primary lets the router pre-emptively skip before user traffic hits the failure mode. (d) Documented runbook: when EWMA across all chain entries for a category drops below 0.5, the umbrella flag for that category is the kill switch; flipping it falls back to the legacy `createModel()` path.

### R3: Quota burn — agent loop drains an API key
**Risk.** A loop step (agent-flow D14) or a runaway LangGraph cycle calls the same provider hundreds of times before any limit fires.
**Mitigation.** (a) Kernel `agent_runs.tool_call_limit` (agent-os D3) is the first ceiling — every provider call is a tool call. (b) Per-provider per-run counter in the router; when a single run exceeds `perRunProviderCallLimit` (default 100), the syscall rejects with `ProviderRunLimitExceeded`. (c) Daily per-provider spend cap stored in `admin_settings` (`providers:dailyCapUsd:<provider>`); the router reads the day's accumulated `cost_usd` for that provider from `agent_tool_calls` (with a 1-min cache to avoid hammering D1) and rejects with `ProviderDailyCapExceeded` when crossed. (d) Cost-cap policy lives long-term in `agent-policy` (#5); v1 default is a hard $50/day per provider with admin override.

### R4: OAuth refresh-token rotation race
**Risk.** Two concurrent calls both see "token expires in 100s", both fire refresh, one's refresh returns `invalid_grant` because the other already rotated it.
**Mitigation.** (a) Refresh-on-resolve takes a row-level lock via D1 (`UPDATE provider_credentials SET refresh_in_progress = 1 WHERE credential_id = ? AND refresh_in_progress = 0`); if zero rows affected, another worker is refreshing — wait + reread the row. (b) Refresh-in-progress flag has a 30s TTL; stale lock self-clears. (c) Refresh failure marks the credential expired (D8) and falls through the chain; the next call attempts a fresh OAuth flow only if no admin intervention occurs first.

### R5: Action provider blast radius — wrong approval gate misfire
**Risk.** A bug in the approval gate allows an action through without human OK; the action is irreversible (Slack message, GitHub commit).
**Mitigation.** (a) Action providers stay flag-gated (`AGENT_PROVIDERS_ACTION=false`) until D9 integration has been exercised in dev with at least three distinct providers. (b) Per-action-provider flag (D11) — Slack rolls before Notion before GitHub. (c) Every action invocation writes an `agent_run_events` row `kind='action_executed'` with the approval_id; admin dashboard surfaces "actions executed in last 24h" with the approval trail. (d) Dry-run mode per provider (`config.dryRun: true`) — provider logs the intended call but does not execute; used for staging.

### R6: Migration breaks the four RAG agents
**Risk.** The new router has a subtle behavioral difference from `createModel()` (e.g. different default `maxTokens`, different error class, different streaming shape) and one of the four agents regresses on production traffic.
**Mitigation.** (a) Per-agent feature flag with legacy fallback (D10, matches agent-os D11). (b) Parity test per agent: same fixture input through legacy + new path, deep-equal output (allowing diffs only in fields explicitly enumerated in a per-agent allowlist e.g. `latency`). (c) Stagger: critic → writer → research → planner; 1-week soak between each. (d) Shadow-traffic mode (`AGENT_PROVIDERS_LLM_SHADOW=true`): legacy path runs and returns the answer; new path runs in parallel and writes results to a `provider_shadow_results` debug table for offline diff. No user-visible behavior change while we collect data.

### R7: Encryption-key rotation is a full table re-encrypt
**Risk.** Rotating `PROVIDER_KEY_ENCRYPTION_KEY` requires decrypting every row with the old key and re-encrypting with the new key; if rotation is interrupted, the table is half-decrypted and unreadable.
**Mitigation.** (a) Add `key_version` column to `provider_credentials` (deferred to v2 when first rotation is needed; v1 single key is fine for solo-dev). (b) Documented rotation procedure: pause writes, snapshot D1, run re-encrypt script as a one-shot Worker, verify row count, swap secret. (c) Until rotation lands, the secret is treated as long-lived (matches Cloudflare Worker secret lifecycle norms).

## Migration Plan

**Pre-requisite.** `agent-foundation` ships `flags.ts`, central `Env`, tool registry, `requireAdmin`. `agent-os` ships kernel, `agent_tool_calls`, approval gate, `defineAgent`. This change extends both — no rework required.

**Step 1 — Land registry, credential store, schema (dark).**
- `src/lib/agent-providers/{credentials,llm,search,reader,knowledge,action}/` directory tree; each category gets `types.ts`, `index.ts` (factory map), one or two adapter files
- `src/lib/agent-providers/credentials/{crypto,store,resolver}.ts` — AES-GCM helpers + D1 read/write + 3-layer fallback (D3)
- `src/lib/agent-providers/router/{base,health,metrics}.ts` — shared router scaffolding consuming kernel `SyscallContext`
- D1 migration `0012_agent_providers.sql` (D12) — three tables + ALTER
- Register `AGENT_PROVIDERS_*` flag block in `src/lib/config/flags.ts`
- Wrangler: add `PROVIDER_KEY_ENCRYPTION_KEY` as a documented secret (not bound until step 2)
- Admin endpoints: `GET /api/admin/providers` (list registered + health snapshot), `POST /api/admin/providers/credentials` (CRUD), `POST /api/admin/providers/test` (manual ping)
- Unit tests per adapter, crypto, router scaffolding, chain advancement triggers
- **Rollback.** Flag stays off; D1 tables remain inert; flip `AGENT_PROVIDERS_ENABLED=true` only when ready.

**Step 2 — Wire LLM category through registry (shadow mode first).**
- Provision `PROVIDER_KEY_ENCRYPTION_KEY` via `wrangler secret put` in prod
- Migrate existing `provider_key:*` rows to `provider_credentials` (one-shot script; legacy rows untouched as backstop)
- Enable shadow mode: `AGENT_PROVIDERS_LLM_SHADOW=true` for one week; both paths run, results diff'd into `provider_shadow_results` debug table
- Review diffs; fix any divergence in adapter behavior
- **Rollback.** Set shadow flag off; shadow rows continue to accumulate harmlessly until the table is dropped in cleanup.

**Step 3 — Per-RAG-agent flag flip for LLM routing.**
- Order: `critic` → `writer` → `research` → `planner` (matches agent-os D10)
- Each agent: flip its `agentOs.<agent>=true` (already a prerequisite from agent-os) AND ensure `agentProviders.llm=true`
- 1-week soak between agents; parity test pass required to advance
- **Rollback per agent.** Flip that agent's `agentOs.<agent>=false`; legacy `createModel` path returns.

**Step 4 — Enable Search, Reader, Knowledge categories.**
- Each category gets its own week-long shadow + parity gate before flag-on
- Search: Tavily, Exa, Jina adapters first; Brave, Serper later
- Reader: Jina Reader, Firecrawl, direct fetch
- Knowledge: read-only adapters first (Notion read, GitHub read, Drive read, SQL select)
- **Rollback.** Per-category flag flip; legacy direct-call paths in `src/lib/rag/tools/*` remain available throughout.

**Step 5 — Action providers (separate gate, separate audit).**
- Validate approval-gate integration (D9) with one no-op test action (`test.echo` that logs but does not call out)
- Roll Slack first (smallest blast — channel scope, recallable in practice), then Notion, then GitHub
- Each action provider behind its own `AGENT_PROVIDERS_ACTION_<PROVIDER>` flag (D11 pattern); `AGENT_PROVIDERS_ACTION` umbrella stays off until all three are validated in dev
- Dry-run mode (R5) for each provider's first production use
- **Rollback.** Per-action-provider flag off; action invocation rejects at the router with `ActionProviderDisabled`.

**Step 6 — Deprecate legacy paths.**
- After 4 weeks of all four RAG agents + all five categories stable, mark `createModel()`, `invokeModel()`, and `provider-key-store.ts` deprecated (JSDoc `@deprecated`, lint warning)
- Migration script moves any remaining `provider_key:*` rows from `admin_settings` to `provider_credentials`; reader removed
- Drop `provider_shadow_results` debug table from Step 2
- **Rollback.** This is the destructive step; D1 backup taken before migration; documented restore procedure mirrors agent-foundation D6 pattern (re-INSERT from backup, re-enable reader via revert).

**Pre-merge verification per step.** Matches agent-foundation Step 5 / agent-flow pre-merge: `pnpm lint`, `pnpm build` (with `astro check`), `pnpm test`, `pnpm check:references`, plus manual smoke of the affected provider category in local dev with a real key.

## Open Questions

### Q1: Which OAuth provider should back blog-author login (when multi-tenancy lands)?

**Discussion.** Notion / GitHub / Google all show up on the action-provider list; one could double as SSO when per-user provider preferences arrive (v2 non-goal). Picking now influences the OAuth client-id / redirect-URI choices baked into D8.

**Default.** **Defer entirely.** D8 ships single-org service identities only. The callback handler is parameterized by provider so adding a "login" callback is additive. Re-open with multi-tenancy.

### Q2: Where do per-provider concurrent-request limits live — `default_config_json` or `admin_settings`?

**Discussion.** Concurrent-request caps are runtime-tunable; `default_config_json` is per-row but needs admin UI; `admin_settings` rows (`providers:concurrency:<id>`) reuse the existing settings UI.

**Default.** **`admin_settings` key per provider** (`providers:concurrency:<id>`, default 10) for v1 — reuses settings store from agent-foundation D6. Move into `default_config_json` when a per-provider config UI ships in `agent-console`. Document the key in `src/lib/config/settings-keys.ts`.

### Q3: Default retry policy values per category — what numbers, and where do they live?

**Default.** Defaults baked into router scaffolding per category, overridable via `admin_settings` (`providers:retry:<category>`):

| Category | maxAttempts | backoff | initialDelayMs | maxDelayMs | latencyBudgetMs |
|---|---|---|---|---|---|
| llm | 2 | exponential | 500 | 4000 | 30000 |
| search | 3 | exponential | 250 | 2000 | 15000 |
| reader | 3 | exponential | 500 | 8000 | 60000 |
| knowledge | 2 | linear | 200 | 1000 | 10000 |
| action | 1 | constant | 0 | 0 | 10000 |

Action category retries exactly once because irreversible operations should not retry on ambiguous failures (the call may have succeeded mid-flight).

### Q4: Per-action-operation irreversibility classification — who maintains the list?

**Discussion.** Slack `chat.postMessage` is irreversible; `conversations.history` is read-only. The adapter (D9) carries the boolean per operation, but the canonical list needs a reviewable home.

**Default.** **Co-located with the adapter** — each action provider exports an `OPERATIONS` const where each entry has `irreversible: boolean` and a one-line justification. The access manager reads from this at registration time (`provider_definitions.capabilities_json` mirrors the const). A markdown table at `docs/action-providers-irreversibility.md` is auto-generated from the consts (CI check); manual edits fail the check.

### Q5: Do we need a "fallback chain dry-run" admin endpoint before flipping a category live?

**Default.** **Defer to admin-console.** The router exposes a `simulateChain(category, input)` function that returns the chain plan + per-provider latency EWMA + health snapshot without executing; surface it as an endpoint only when `agent-console` (#4) needs it.

## Resolutions

**Q-action-flags-permanent** — Action provider flags are NOT retired after the 7-day stabilization period because the blast radius (external user-visible artifacts: Slack messages, GitHub issues, emails) makes per-provider rollback a permanent requirement. The umbrella `AGENT_PROVIDERS_ENABLED` flag is the catastrophic-failure kill-switch; per-provider action flags (`AGENT_ARTIFACT_SLACK`, `AGENT_ARTIFACT_GITHUB_ISSUE`, `AGENT_ARTIFACT_EMAIL`, `AGENT_PROVIDERS_ACTION_*`) are the per-target rollback path and remain indefinitely.
