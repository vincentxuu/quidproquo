## ADDED Requirements

### Requirement: Declarative fallback chains per category

The router SHALL accept a per-category routing config of shape `{ order: string[], strategy?: 'priority' | 'weighted' | 'cost-optimal' | 'latency-optimal' }`. The `order` array MUST contain provider ids in preference order; `strategy` defaults to `'priority'`. Config SHALL be loaded from `src/lib/agent-providers/routing.config.ts` at boot and SHALL be hot-reloadable via the admin surface without restarting the kernel.

#### Scenario: Default strategy is priority

- **WHEN** the config `{ search: { order: ['tavily', 'exa', 'jina'] } }` is loaded and an agent issues `syscall('search.query', ...)`
- **THEN** the router SHALL attempt `tavily` first, then `exa`, then `jina`, and SHALL stop at the first success

#### Scenario: Hot reload updates routing

- **WHEN** an admin updates `search.order` from `['tavily', 'exa', 'jina']` to `['exa', 'tavily', 'jina']` via the routing config surface
- **THEN** the next `search.query` SHALL attempt `exa` first and the kernel SHALL NOT require a restart

### Requirement: Per-call routing decision based on health, cost, latency

For each syscall, the router SHALL evaluate every provider in `order` and SHALL skip providers whose health state is `down` or whose 1-minute rate-limit counter has reached its quota. When `strategy === 'cost-optimal'` the router SHALL select the cheapest healthy provider by `costModel`; when `strategy === 'latency-optimal'` the router SHALL select the provider with the lowest EWMA p50 latency from the last 100 calls; when `strategy === 'weighted'` the router SHALL select probabilistically with weights inversely proportional to a `cost * latency` score.

#### Scenario: Cost-optimal skips healthy-but-expensive

- **WHEN** strategy is `'cost-optimal'`, both `openai` and `gemini` are healthy, and `gemini`'s `costModel` evaluates to a lower per-call cost for the input
- **THEN** the router SHALL select `gemini` even if `openai` appears first in `order`

#### Scenario: Down provider skipped

- **WHEN** `tavily` health is `down` and `exa` is `healthy`, with `order: ['tavily', 'exa']`
- **THEN** the router SHALL NOT call `tavily` and SHALL go directly to `exa`

### Requirement: Health check protocol (passive and active)

The router SHALL maintain a health state machine per provider with states `{ healthy, degraded, down }`. **Passive** signals: a single hard failure SHALL move `healthy → degraded`; three consecutive failures within 60 seconds SHALL move any state to `down`; a single success from `degraded` SHALL move back to `healthy`. **Active** signals: an admin-configurable ping (default every 30 seconds) SHALL probe each registered provider's lightweight health endpoint or capability call; a successful ping SHALL move `down → degraded`, and a second consecutive successful ping SHALL move `degraded → healthy`.

#### Scenario: Three consecutive failures trigger down

- **WHEN** a provider currently `healthy` returns errors on three calls within 60 seconds
- **THEN** the router SHALL transition the provider to `down`, SHALL emit a `provider_health_changed` event with `to='down'`, and SHALL skip the provider for subsequent calls

#### Scenario: Active ping recovers degraded provider

- **WHEN** a `down` provider responds successfully to two consecutive active health pings
- **THEN** the router SHALL transition to `healthy` and SHALL resume sending traffic on the next syscall

### Requirement: Per-call telemetry to provider_calls

After every routed syscall (success or failure), the router SHALL write one row to the `provider_calls` table containing `{ id, providerId, category, syscall, agentId, runId, tokens_in, tokens_out, cost_usd, latency_ms, status, error_code?, attempted_providers, fallback_count, atMs }`. The same row SHALL also be projected into the kernel `agent_tool_calls` table so existing per-agent dashboards see provider activity without schema changes.

#### Scenario: Success row carries token + cost fields

- **WHEN** a `llm.complete` call to `openai` returns `{tokens_in: 1000, tokens_out: 500}` in 1200 ms
- **THEN** exactly one `provider_calls` row SHALL be written with `providerId='openai'`, `tokens_in=1000`, `tokens_out=500`, `cost_usd` computed from the openai `costModel`, `latency_ms=1200`, `status='success'`, `fallback_count=0`

#### Scenario: Failure row records error and attempts

- **WHEN** a `search.query` falls back from `tavily` (timeout) to `exa` (success) after one retry
- **THEN** the persisted row SHALL have `providerId='exa'`, `status='success'`, `attempted_providers=['tavily','exa']`, `fallback_count=1`, and a separate `provider_calls` row SHALL exist for the `tavily` attempt with `status='failure'` and `error_code='timeout'`

### Requirement: Rate limit enforcement per provider per minute

Each `ProviderDefinition` MAY declare `rateLimits: { perMinute: number, perDay?: number }`. The router SHALL maintain a sliding-window counter per `(providerId, window)` and SHALL refuse outbound calls that would exceed the declared limit. Refused calls SHALL be treated as routing failures (i.e. trigger fallback to the next provider in `order`) and SHALL emit a `provider_rate_limited` event but SHALL NOT count against the provider's health failure counters.

#### Scenario: Per-minute quota refuses without health penalty

- **WHEN** `tavily` declares `rateLimits.perMinute = 60` and 60 calls have completed in the last 60 seconds
- **THEN** the next call SHALL be refused locally with no network request, SHALL emit `provider_rate_limited`, SHALL NOT increment the consecutive-failure counter, and SHALL trigger fallback to the next provider in `order`

#### Scenario: Quota resets with sliding window

- **WHEN** 60 calls landed between t-90s and t-30s and at t=0 the sliding window has only 0 calls in the most recent 60 seconds
- **THEN** the next call SHALL be admitted

### Requirement: Failover triggers

The router SHALL fall back to the next provider in `order` on any of: (a) hard failure (network error, 5xx, parsing failure, handler throw); (b) provider-reported rate-limit response (HTTP 429 or provider-specific quota error code); (c) latency budget exceeded — when `requestOptions.latencyBudgetMs` is set and the current attempt exceeds it. Fallback SHALL NOT be triggered on 4xx client errors other than 429 (the request itself is invalid and retrying another provider is unsafe).

#### Scenario: Hard failure falls back

- **WHEN** `tavily` throws a `fetch` network error and `exa` is healthy
- **THEN** the router SHALL invoke `exa` and SHALL return the `exa` result to the caller

#### Scenario: 4xx (not 429) does NOT fall back

- **WHEN** `tavily` returns HTTP 400 with `{ error: 'invalid_query' }`
- **THEN** the router SHALL NOT fall back to `exa` and SHALL surface the 400 error to the agent; the routing decision SHALL emit `payload_json.reason='client_error_no_fallback'`

#### Scenario: Latency budget exceeded triggers fallback

- **WHEN** a call sets `requestOptions.latencyBudgetMs = 500` and the first provider takes longer than 500 ms without responding
- **THEN** the router SHALL abort the in-flight call, SHALL move to the next provider in `order`, and SHALL record the aborted attempt with `status='failure'`, `error_code='latency_budget_exceeded'`

### Requirement: Region and data residency constraint enforcement

Every `ProviderDefinition` SHALL declare `regions: string[]` (ISO 3166-1 alpha-2 codes or `'global'`). The router SHALL accept per-call or per-agent `residency: { allowedRegions: string[] }` constraints; providers whose `regions` does not intersect `allowedRegions` SHALL be skipped during routing. If no provider in `order` satisfies the constraint, the router SHALL throw `NoProviderMeetsResidency` and SHALL NOT silently fall back to a non-compliant provider.

#### Scenario: EU-only constraint filters providers

- **WHEN** a call passes `residency.allowedRegions = ['EU']`, and `tavily.regions = ['US']`, `exa.regions = ['US','EU']`
- **THEN** the router SHALL skip `tavily` and SHALL invoke `exa`

#### Scenario: No compliant provider denies the call

- **WHEN** `residency.allowedRegions = ['EU']` and all providers in `order` declare `regions = ['US']`
- **THEN** the router SHALL throw `NoProviderMeetsResidency`, SHALL NOT invoke any provider, and SHALL emit `payload_json={reason:'residency_denied', requested:['EU'], available:['US']}`
