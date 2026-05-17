## Context

After `agent-foundation` (#0), `agent-os` (#1), `agent-providers` (#2), `agent-flow` (#3), and `agent-evidence` (#4) ship, the platform has a kernel that mediates every syscall, a router that picks vendors, a flow runtime that orchestrates multi-step work, and an evidence layer that stores per-claim provenance. What it does **not** have is a runtime authority that says **"this particular run is or is not allowed to do that"**.

Today, "policy" is scattered:
- Cost / token ceilings live on `agent_processes.tool_call_limit` and `agent_runs.timeout_seconds` (agent-os D3) — declared per-agent-definition, frozen at deploy
- Provider allowlist is implicit in `provider_credentials.scope_json` (agent-providers D3) and the fallback chain order (agent-providers D4) — declared per-deploy, not per-run
- Retry behavior is split between per-step `retry` blocks (agent-flow D8) and per-category `admin_settings` (agent-providers Open Q3) — no single source of truth for "this run gets up to N retries total"
- Quality enforcement (`citation_required`, `min_sources`) is named in `agent-evidence` D8 but explicitly **delegated** to this change
- Human approval gates exist in `agent_approval_requests` (agent-os D9) and conflict-review uses them (agent-evidence D12); declaring **when** to require approval lives nowhere
- Sensitive-data handling has no home at all

The Gateway Console plan §4.3 and KPMG agentic-AI risk guidance both insist these are **separate** concerns from flow shape. The same `deep-research` flow should run cheap-and-fast under `research-quick`, normal under `research-standard`, and locked-down under `research-enterprise` — without forking the flow. This change adds the **Policy registry** that binds those constraints at *run time* and the **policy enforcement** layer that the kernel scheduler and downstream layers consult.

**Stakeholders.**
- **Admin operator** (primary) — wants to attach `research-standard` to a manually-triggered flow run, or `research-enterprise` to a customer-deliverable run, without editing flow YAML
- **Compliance reviewer** (secondary) — wants `human` approval gates, sensitive-data redaction, and tool allowlists declared as data, reviewable in PR
- **Platform engineer** — wants every kernel/flow/provider/evidence cross-cut concern to consult one policy resolver, not five ad-hoc config readers

**Constraints.**
1. **No regression of kernel, flow, providers, evidence.** Policy is additive — when no policy is bound, behavior matches today. Existing `tool_call_limit`, fallback chains, retry blocks continue to work as floor defaults
2. **Policy attaches at run creation, never at flow-definition time.** The flow YAML carries no budget/quality/security/human fields; those are policy
3. **Effective policy is frozen at run start.** Mid-run policy edits do not affect in-flight runs; reproducibility wins over live-tuning
4. **Bounded blast radius.** Umbrella flag `AGENT_POLICY_ENABLED=false` keeps the entire enforcement layer dark; per-category flags layer on top. Each category can ship independently

## Goals / Non-Goals

**Goals**
- Typed policy schema across **six categories** (Budget / Provider / Quality / Security / Human / Retry), each typed separately; top-level `Policy` is a union
- Run-time binding: same flow runs under different policies for different use cases
- Live budget enforcement via kernel scheduler — token/cost/iteration/runtime ceilings kill the run at threshold; partial output preserved
- Provider policy delegated to `agent-providers` (allowlist/denylist/fallback/region constraints passed downstream)
- Quality policy delegated to `agent-evidence` `verifyFlowRun` (min-sources / citation_required / conflict_check / stale_source_check)
- Security policy — sensitive-data redaction (regex + entity-based), tool allowlist (intersection with agent grants), least-privilege scope enforcement
- Human policy — wires into kernel `agent-access` approval gate; supports per-step, batch, and edit-on-approval modes
- Retry policy — per-step retry budget overlay on flow-runtime step retry; skips/fails on exhaustion configurable
- Policy inheritance — base → flow-level override → run-level override; effective policy materialized at run creation and **frozen**
- Three reference policies shipped: `research-quick`, `research-standard`, `research-enterprise`
- D1 schema: `policy_definitions`, `policy_bindings`, `policy_violations` (audit) in migration `0015_agent_policy.sql`
- Feature flags: umbrella + per-category

**Non-Goals**
- Visual policy editor UI — `agent-console` (#6); this change ships only minimal admin HTTP CRUD
- Policy authoring DSL or visual graph — YAML/JSON only, validated via Zod
- Multi-tenant policy isolation beyond `org_id` denormalization (single-org for now, matches agent-os non-goals)
- ML-based sensitive-data classification — regex + named-entity rules in v1; classifier upgrade path documented
- Cross-org policy sharing / marketplace
- Policy diff UI ("what changed from v1 to v2") — Open Question Q3
- Adaptive policies (auto-tune ceilings from past runs) — deferred; would consume telemetry the platform already has, but the decision logic lives in a follow-up

## Decisions

### D1: Policy schema — six categories, each typed separately, top-level Policy is a union of optional fields

**Decision.** A `Policy` is a typed record with six optional category sub-objects. Each category is typed independently with its own Zod schema. Top-level Policy is the union "any subset of categories may be present"; missing categories mean "no constraint from this policy on that axis" (falls back to either the inherited parent policy or, ultimately, the kernel/flow/provider defaults).

```typescript
// src/lib/agent-policy/types.ts
export interface Policy {
  policyId: string
  version: number
  name: string
  description?: string
  // Six optional categories — any subset
  budget?: BudgetPolicy
  provider?: ProviderPolicy
  quality?: QualityPolicy
  security?: SecurityPolicy
  human?: HumanPolicy
  retry?: RetryPolicy
}

export interface BudgetPolicy {
  maxCostUsd?: number             // total USD ceiling for the run
  maxTokens?: number              // total tokens (in + out) for the run
  maxIterations?: number          // total syscall count (aliases tool_call_limit at run scope)
  maxParallelUnits?: number       // concurrent in-flight syscalls per run
  maxRuntimeSeconds?: number      // wall-clock for the whole run
  onExceeded: 'kill_run' | 'pause_for_approval'   // default: kill_run
}

export interface ProviderPolicy {
  llm?: { allowlist?: string[]; denylist?: string[]; fallbackOrder?: string[]; region?: string[] }
  search?: { allowlist?: string[]; denylist?: string[]; fallbackOrder?: string[] }
  reader?: { allowlist?: string[]; denylist?: string[]; fallbackOrder?: string[] }
  knowledge?: { allowlist?: string[]; denylist?: string[] }
  action?: { allowlist?: string[]; denylist?: string[] }
  dataResidency?: { allowedRegions: string[]; onViolation: 'fail' | 'fall_back' }
}

export interface QualityPolicy {
  minSourcesPerSubquestion?: number
  citationRequired?: boolean
  conflictCheck?: { enabled: boolean; blockOnUnresolved: boolean }
  staleSourceCheck?: { maxAgeDays: number; failOnViolation: boolean }
  minClaimConfidence?: number     // claims below this band trigger run failure
}

export interface SecurityPolicy {
  sensitiveDataRedaction?: {
    regexPatterns?: string[]      // named regex set keys; resolved server-side
    entityKinds?: ('email'|'phone'|'ssn'|'credit_card'|'api_key'|'jwt')[]
    onMatch: 'redact' | 'block_step' | 'fail_run'
  }
  toolAllowlist?: string[]        // syscall names; intersected with agent grants
  outboundDomainsAllowlist?: string[]   // tighter than agent's grant
  leastPrivilegeScope?: boolean   // if true, drop unused grants for this run
}

export interface HumanPolicy {
  approvalRequiredBeforeExternalWrite?: boolean
  approvalRequiredBeforeActions?: string[]     // syscall names that require approval
  riskThreshold?: 'low' | 'medium' | 'high'    // delegated to action provider classification
  mode?: 'per_step' | 'batch' | 'edit_on_approval'
  approvers?: string[]            // user ids; intersected with admin auth allowlist
  approvalTtlSeconds?: number     // overrides kernel default (agent-os Q4)
  reminderCadenceSeconds?: number // open question Q2
}

export interface RetryPolicy {
  maxRetriesPerStep?: number      // overlay on flow-runtime step retry (agent-flow D8)
  maxTotalRetriesPerRun?: number  // hard cap across all steps
  onExhausted: 'fail_run' | 'skip_step' | 'continue_with_partial'
  exponentialBaseMs?: number
  jitterMs?: number
}
```

**Alternatives considered.**
- *Single flat `Policy` record with all fields top-level*. Rejected — six unrelated concerns flattened into one shape forces every policy to declare every field (or accept "absent = unlimited", which is dangerous). Separate categories let `research-quick` declare only Budget + Retry while `research-enterprise` declares all six
- *Class hierarchy (`AbstractPolicy` → `BudgetPolicy` extends ...)*. Rejected — same reasoning as agent-providers D2; duck-typed records win
- *Policy as JSON Logic expressions (one expression per rule)*. Rejected — operator-facing readability is critical; JSON Logic is fine for edge conditions (where computation is the point) but wrong for declarative caps and allowlists

**Rationale.** Six categories matches the proposal exactly. Each category has a different enforcement boundary (Budget → scheduler; Provider → router; Quality → evidence verifier; Security → kernel access manager + redactor; Human → approval gate; Retry → flow runtime). Typing them independently means each enforcement site reads only its own slice — no over-fetching, no cross-coupling.

### D2: Run-time binding — policy attaches at flow run creation, not flow definition

**Decision.** The flow YAML carries **no policy fields**. Policy attaches at run-creation time via three mechanisms, in resolution order:

1. **Run-create request body** — `POST /api/admin/flows/:flowId/run` accepts `{ inputs, policyId?, policyOverrides? }`. The caller picks a registered policy by id and may overlay a per-run patch
2. **Flow-level default** — if no `policyId` is on the request, look up `policy_bindings` for `(flow_id, default=true)`; if present, use that policy id
3. **System default** — falls through to `policies:default:flow_run` in `admin_settings` (typically `research-standard`)

The resolved policy is **materialized** (base + flow-level binding + run-level overrides → effective policy record) and stored on `flow_runs.effective_policy_json` plus `flow_runs.policy_id` and `flow_runs.policy_version`. Mid-run policy edits never affect in-flight runs.

```typescript
// src/lib/agent-policy/resolve.ts
export async function resolveEffectivePolicy(opts: {
  flowId: string
  policyIdOnRequest?: string
  overridesOnRequest?: Partial<Policy>
  env: Env
}): Promise<EffectivePolicy> {
  const base = await loadPolicy(opts.policyIdOnRequest ?? await loadFlowDefaultPolicyId(opts.flowId) ?? loadSystemDefaultPolicyId())
  const flowOverlay = await loadFlowLevelOverride(opts.flowId, base.policyId)  // may be null
  const runOverlay = opts.overridesOnRequest                                    // may be null
  const effective = mergePolicies(base, flowOverlay, runOverlay)                // see D10
  return {
    ...effective,
    materializedAt: Date.now(),
    resolutionChain: [base.policyId, flowOverlay?.policyId, '<run-overrides>'].filter(Boolean),
  }
}
```

**Why not on the flow YAML.** The same `deep-research` flow runs for blog-author dogfood (`research-quick`) and for customer deliverable (`research-enterprise`). Embedding policy in YAML forces a fork or a YAML-as-template approach that breaks the visual editor round-trip (agent-flow D1). Separating concerns is the whole point of having a Policy registry.

**Alternatives considered.**
- *Policy at flow definition time, override at run time*. Rejected — implies "policy is part of the flow's identity", which contradicts the proposal premise
- *Policy id in flow YAML as a hint, not binding*. Rejected — splits truth between two files
- *Multiple policies stacked at run time*. Rejected for v1 — one effective policy per run is reasoned about and audited; stacking is a v2 feature when a real use case emerges

**Rationale.** Bind-at-run is the Gateway Console §4.3 model and the KPMG-aligned compliance shape. Materializing the effective policy at run start gives perfect reproducibility — three months later, the audit log shows exactly which caps were active for run X.

### D3: D1 schema — three new tables (migration `0015_agent_policy.sql`)

**Decision.** Migration `0015` adds three tables. Slots after `0014_agent_evidence.sql`; no overlap with downstream `0016` / `0017`.

```sql
-- 0015_agent_policy.sql

-- The registered policies (versioned, immutable per version)
CREATE TABLE policy_definitions (
  policy_id TEXT NOT NULL,                  -- e.g. 'research-standard'
  version INTEGER NOT NULL,                 -- monotonic per policy_id
  org_id TEXT NOT NULL,                     -- multi-tenant scope
  name TEXT NOT NULL,
  description TEXT,
  schema_json TEXT NOT NULL,                -- full Policy JSON (Zod-validated at write)
  created_at INTEGER NOT NULL,
  created_by TEXT,
  deprecated INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (policy_id, version)
);
CREATE INDEX idx_policy_definitions_org ON policy_definitions(org_id, policy_id);

-- Per-flow default policy bindings (flow_id → policy_id) and per-run overrides cache
CREATE TABLE policy_bindings (
  binding_id TEXT PRIMARY KEY,              -- UUID
  org_id TEXT NOT NULL,
  flow_id TEXT NOT NULL,                    -- references flow_definitions.flow_id (logical FK)
  policy_id TEXT NOT NULL,
  policy_version INTEGER NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,    -- 1 = this is the flow's default policy binding
  overrides_json TEXT,                      -- flow-level overrides on top of base policy
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, flow_id, policy_id, is_default),
  FOREIGN KEY (policy_id, policy_version) REFERENCES policy_definitions(policy_id, version)
);
CREATE INDEX idx_policy_bindings_flow ON policy_bindings(org_id, flow_id, is_default);

-- Audit log: every policy enforcement decision that blocked / killed / approved / failed
CREATE TABLE policy_violations (
  violation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flow_run_id TEXT NOT NULL,                -- logical FK to flow_runs.flow_run_id
  agent_run_id TEXT,                        -- when violation originates inside an agent step
  org_id TEXT NOT NULL,
  policy_id TEXT NOT NULL,
  policy_version INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN
    ('budget','provider','quality','security','human','retry')),
  rule TEXT NOT NULL,                       -- e.g. 'maxCostUsd', 'minSourcesPerSubquestion'
  outcome TEXT NOT NULL CHECK (outcome IN
    ('blocked','killed','redacted','approved','rejected','expired','warned')),
  detail_json TEXT NOT NULL,                -- context: observed value, threshold, syscall name, etc.
  at INTEGER NOT NULL,
  FOREIGN KEY (policy_id, policy_version) REFERENCES policy_definitions(policy_id, version)
);
CREATE INDEX idx_policy_violations_run ON policy_violations(flow_run_id, at);
CREATE INDEX idx_policy_violations_policy ON policy_violations(policy_id, policy_version, at DESC);

-- Extension: flow_runs gets policy materialization columns (added by 0014, not a separate migration)
ALTER TABLE flow_runs ADD COLUMN policy_id TEXT;
ALTER TABLE flow_runs ADD COLUMN policy_version INTEGER;
ALTER TABLE flow_runs ADD COLUMN effective_policy_json TEXT;
```

**Why three tables.**
- `policy_definitions` is the registry; versioned so historical runs reproduce
- `policy_bindings` is the link table (flow → policy) plus flow-level overrides; small, frequently read at run-create
- `policy_violations` is append-only audit; every block/kill/approval is one row, queryable by run and by policy version

**Alternatives considered.**
- *Embed policy on `flow_runs` only, no registry*. Rejected — every run would copy the full policy JSON; no way to query "all runs that used `research-enterprise` v3"
- *Use `admin_settings` for policy definitions*. Rejected — `admin_settings` is flat key-value; policies are versioned typed records
- *Inline violations into `agent_run_events`*. Rejected — policy decisions span flow + agent + provider scopes; one dedicated table simplifies the audit query

**Rationale.** Three tables, additive ALTER on `flow_runs`. Migration drops cleanly via reverse migration if needed.

### D4: Budget enforcement — live, via kernel scheduler, killed at threshold

**Decision.** Budget caps (`maxCostUsd` / `maxTokens` / `maxIterations` / `maxRuntimeSeconds` / `maxParallelUnits`) are enforced **live** by the kernel scheduler. Every `agent_tool_calls` write (which already updates `agent_runs.total_cost_usd`, `total_tokens`, `total_tool_calls` per agent-os D12) is followed by a policy check against the effective policy of the parent `flow_run`. When any threshold is crossed:

1. Write a `policy_violations` row (`category='budget'`, `rule=<which threshold>`, `outcome='killed'`)
2. Set `flow_runs.error_json = { reason: 'budget_exceeded', rule: ..., observed: ..., threshold: ... }`
3. Cooperative cancellation via the kernel cancel-signal path (agent-os D7) — sets `cancel_signal=1` on the running agent_run + KV mirror
4. Flow runtime sees the kill, transitions `flow_runs.status='failed'`
5. **Partial output preserved** — `state_json` snapshot, all completed step outputs, all `agent_tool_calls` rows, and (if evidence enabled) all already-extracted claims remain in their tables. The run is failed-with-data, not deleted

For `onExceeded: 'pause_for_approval'`, instead of killing, the kernel inserts an `agent_approval_requests` row with `reason='budget_exceeded_request_continuation'` and pauses the flow run. The approver may resolve `approve` (raises the cap by a documented delta and continues) or `reject` (kills with same error_json shape).

```typescript
// src/lib/agent-policy/enforcement/budget.ts (called from kernel after each syscall write)
export async function checkBudget(opts: {
  flowRunId: string
  effectivePolicy: EffectivePolicy
  observed: { totalCostUsd: number; totalTokens: number; totalToolCalls: number; runtimeMs: number; parallelUnits: number }
}): Promise<BudgetCheckResult> {
  const b = opts.effectivePolicy.budget
  if (!b) return { ok: true }
  const violations: { rule: string; observed: number; threshold: number }[] = []
  if (b.maxCostUsd != null && opts.observed.totalCostUsd >= b.maxCostUsd)
    violations.push({ rule: 'maxCostUsd', observed: opts.observed.totalCostUsd, threshold: b.maxCostUsd })
  if (b.maxTokens != null && opts.observed.totalTokens >= b.maxTokens)
    violations.push({ rule: 'maxTokens', observed: opts.observed.totalTokens, threshold: b.maxTokens })
  if (b.maxIterations != null && opts.observed.totalToolCalls >= b.maxIterations)
    violations.push({ rule: 'maxIterations', observed: opts.observed.totalToolCalls, threshold: b.maxIterations })
  if (b.maxRuntimeSeconds != null && opts.observed.runtimeMs / 1000 >= b.maxRuntimeSeconds)
    violations.push({ rule: 'maxRuntimeSeconds', observed: opts.observed.runtimeMs / 1000, threshold: b.maxRuntimeSeconds })
  if (b.maxParallelUnits != null && opts.observed.parallelUnits > b.maxParallelUnits)
    violations.push({ rule: 'maxParallelUnits', observed: opts.observed.parallelUnits, threshold: b.maxParallelUnits })
  if (violations.length === 0) return { ok: true }
  return { ok: false, violations, action: b.onExceeded ?? 'kill_run' }
}
```

**Alternatives considered.**
- *Pre-flight estimation only (no live enforcement)*. Rejected — LLM cost is impossible to predict pre-call; estimation misses 30%+ of overruns
- *Background cron sweep*. Rejected — kill latency on the order of minutes; budget overrun could 10x before the sweep
- *Hard timeout via Cloudflare Worker only*. Rejected — kills the whole Worker invocation; doesn't capture token/cost dimensions

**Rationale.** Live enforcement is the differentiator. The kernel already writes per-syscall telemetry (agent-os D12), so the policy check is a O(1) read + O(N) comparison at zero new infra cost.

### D5: Provider policy — constraint passed downstream to `agent-providers` router

**Decision.** Provider policy (allowlist / denylist / fallback order / region) is **delegated** to the provider router (`agent-providers` D4 / D10). The kernel attaches the effective policy's `provider` slice to every `SyscallContext` it constructs for that flow run; the router intersects the policy's allowlist with its own configured fallback chain before selecting a provider.

```typescript
// src/lib/agent-providers/router/llm.ts (extended from agent-providers D4)
export async function invokeLLM(ctx: SyscallContext, input: LLMInvokeInput): Promise<LLMInvokeOutput> {
  const rawChain = await getChain('llm')
  const policySlice = ctx.policy?.provider?.llm
  const effectiveChain = applyProviderPolicy(rawChain, policySlice)  // intersect allowlist, reorder by fallbackOrder, exclude denylist
  if (effectiveChain.length === 0) {
    await recordPolicyViolation(ctx, 'provider', 'allowlist_empty', { rawChain, policySlice, outcome: 'blocked' })
    throw new PolicyBlockedNoProviderError('llm', rawChain, policySlice)
  }
  // ... rest of agent-providers D4 logic, but iterating effectiveChain
}
```

Region / data-residency works the same — the router's adapter declares each provider's region; the policy declares allowed regions; the router filters before selection.

**Alternatives considered.**
- *Policy enforces provider selection directly in the kernel*. Rejected — duplicates the router's chain / health / quota logic; tangles two changes
- *Build a new "policy-aware router"*. Rejected — same problem; one router with a policy slice is simpler than two routers

**Rationale.** Provider routing is a single concern owned by `agent-providers`. Policy supplies a constraint; the router applies it. The boundary is one struct (`ProviderPolicy['llm']`) passed through `SyscallContext`.

### D6: Quality policy — delegated to `agent-evidence` `verifyFlowRun`

**Decision.** Quality policy (`minSourcesPerSubquestion` / `citationRequired` / `conflictCheck` / `staleSourceCheck` / `minClaimConfidence`) is **enforced after** the flow run completes its main steps but **before** it transitions to `done`. The flow runtime calls `verifyFlowRun(flowRunId, qualityPolicy)` on the evidence read API (agent-evidence D8 `EvidenceQueryAPI`); the verifier returns pass/fail with per-rule details.

```typescript
// src/lib/agent-policy/enforcement/quality.ts
export async function verifyFlowRun(opts: {
  flowRunId: string
  qualityPolicy: QualityPolicy
  evidenceAPI: EvidenceQueryAPI
}): Promise<QualityVerdict> {
  const summary = await opts.evidenceAPI.getRunSummary(opts.flowRunId)
  const failures: QualityFailure[] = []

  if (opts.qualityPolicy.citationRequired && summary.uncitedClaims.length > 0)
    failures.push({ rule: 'citation_required', detail: { uncitedClaims: summary.uncitedClaims } })

  if (opts.qualityPolicy.minSourcesPerSubquestion != null) {
    // Per-subquestion source counts come from evidence per-claim citations grouped by step
    const insufficient = await opts.evidenceAPI.findSubquestionsBelowSourceFloor(
      opts.flowRunId, opts.qualityPolicy.minSourcesPerSubquestion
    )
    if (insufficient.length > 0) failures.push({ rule: 'min_sources', detail: { insufficient } })
  }

  if (opts.qualityPolicy.conflictCheck?.enabled && opts.qualityPolicy.conflictCheck.blockOnUnresolved
      && summary.unresolvedConflicts.length > 0) {
    failures.push({ rule: 'conflict_check', detail: { unresolvedConflicts: summary.unresolvedConflicts } })
  }

  if (opts.qualityPolicy.staleSourceCheck?.failOnViolation) {
    const overAge = summary.staleSources.filter(s => s.ageDays > opts.qualityPolicy.staleSourceCheck!.maxAgeDays)
    if (overAge.length > 0) failures.push({ rule: 'stale_source_check', detail: { staleSources: overAge } })
  }

  if (opts.qualityPolicy.minClaimConfidence != null) {
    const lowConf = summary.confidenceDistribution.low + summary.confidenceDistribution.disputed
    if (lowConf > 0) failures.push({ rule: 'min_claim_confidence', detail: { lowConfidenceCount: lowConf } })
  }

  return { ok: failures.length === 0, failures }
}
```

On `verdict.ok === false`, the flow runtime writes a `policy_violations` row per failure (`category='quality'`) and transitions `flow_runs.status='failed'` with `error_json.reason='quality_failed'`. Conflict blocking integrates with the existing approval flow (agent-evidence D12); unresolved conflicts that violate policy generate an additional `policy_violations` row but reuse the existing `agent_approval_requests` row id.

**Alternatives considered.**
- *Quality check inline in evidence layer*. Rejected — explicit in `agent-evidence` D8: evidence stores data, policy applies judgment
- *Quality as a YAML verifier step*. Rejected for policy concerns — verifier steps (agent-flow D2) handle in-flow quality checks; this hook is the post-run policy gate, separate concern
- *Synchronous mid-run quality enforcement*. Considered, deferred — quality is hard to evaluate before all sources are collected; post-run hook is the simplest correct boundary for v1

**Rationale.** Boundary respected: evidence owns data, policy owns judgment. The verifier reuses the read API evidence already exposes; no new evidence query shapes invented here.

### D7: Security policy — sensitive-data redaction + tool allowlist + least-privilege

**Decision.** Three independent mechanisms under the security category:

**(a) Sensitive-data redaction.** A regex set + entity-kind classifier is applied to syscall outputs before they hit `agent_tool_calls.output_json`, `agent_run_events.payload_json`, evidence excerpts, and artifact bodies. The redactor is a kernel post-hook that runs before any write that includes user-visible content.

```typescript
// src/lib/agent-policy/enforcement/redact.ts
const NAMED_REGEX_SETS: Record<string, RegExp[]> = {
  pii_basic: [
    /\b\d{3}-\d{2}-\d{4}\b/g,                    // SSN
    /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g,             // email
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,        // US phone
  ],
  credentials: [
    /\b(sk-|pk-|api[-_]?key[-_]?)[\w-]{20,}\b/gi,
    /\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g,            // JWT
    /\b[A-Za-z0-9]{32,}\b/g,                     // generic high-entropy token (warn-only)
  ],
}

export function redactPayload(opts: {
  payload: string
  security: SecurityPolicy['sensitiveDataRedaction']
}): { redacted: string; matchCount: number; matchedRules: string[] } {
  if (!opts.security) return { redacted: opts.payload, matchCount: 0, matchedRules: [] }
  let out = opts.payload
  let matches = 0
  const matched: string[] = []
  for (const key of opts.security.regexPatterns ?? []) {
    for (const re of NAMED_REGEX_SETS[key] ?? []) {
      out = out.replace(re, (m) => { matches++; matched.push(key); return '[REDACTED]' })
    }
  }
  // entity-based (NER) redaction is a v1.1 addition; v1 ships regex only — see R3
  return { redacted: out, matchCount: matches, matchedRules: [...new Set(matched)] }
}
```

`onMatch: 'redact'` (default) replaces in-place; `'block_step'` causes the syscall to reject; `'fail_run'` kills the run with `error_json.reason='sensitive_data_detected'`.

**(b) Tool allowlist.** The effective policy's `toolAllowlist` is **intersected** with the agent's declared `permissions.syscalls_json` (agent-os D8); only syscalls in both are permitted at runtime. The intersection is computed once at run start and stored on `flow_runs.effective_policy_json`. A denied syscall writes `policy_violations` (`category='security'`, `rule='tool_allowlist'`).

**(c) Outbound domain allowlist + least-privilege scope.** `outboundDomainsAllowlist` is intersected with the agent's `outbound_domains_json` (same pattern). `leastPrivilegeScope: true` instructs the kernel to drop unused memory scopes from the run's effective grant set (agent-os memory scopes D5); a syscall touching a dropped scope raises `MemoryScopeDenied`.

**Alternatives considered.**
- *ML-based DLP classifier from v1*. Rejected — Workers AI NER quality and cost not yet validated for this use; flag-gated upgrade in v1.1 (Open Q1)
- *Redact only on read, not write*. Rejected — leaves sensitive data in tables, exposed to every downstream read path
- *Per-syscall allowlist instead of global*. Rejected — global tool allowlist is intersected with per-agent grants which are already per-syscall; the global cap is what policy adds

**Rationale.** Three small mechanisms, each well-bounded, each with a clear escape hatch (`onMatch` modes, intersection semantics, opt-in least-privilege).

### D8: Human policy — wires into kernel `agent-access` approval gate

**Decision.** Human policy declares **when** approvals are required; the kernel's existing `agent_approval_requests` mechanism (agent-os D9) handles the gate lifecycle. Three trigger modes layered on the kernel mechanism:

| Mode | Trigger | Behavior |
|---|---|---|
| `per_step` (default) | Every step matching `approvalRequiredBeforeActions` syscall list, or any action provider call when `approvalRequiredBeforeExternalWrite: true` | One approval row per qualifying step; flow pauses per gate |
| `batch` | All qualifying syscalls in one flow step accumulate; one approval row for the batch with the full list as `context_json` | Reduces approval fatigue on high-volume action steps (e.g. 20 Slack posts) |
| `edit_on_approval` | When the approver resolves, they may include a modified `context_json` payload; the runtime applies the modification before continuing | Reviewer-as-editor; the modified inputs are passed to the underlying syscall |

`riskThreshold` ('low' | 'medium' | 'high') delegates to action provider classification (agent-providers D9 `OPERATIONS` const carries `irreversible: boolean` per op; v1.1 adds `riskLevel: 'low'|'medium'|'high'` to the same struct). The policy says "approve on `medium+`"; the kernel checks each action op's level before deciding whether to insert an approval row.

```typescript
// src/lib/agent-policy/enforcement/human.ts (called from kernel before any action syscall)
export async function checkHumanApprovalRequired(opts: {
  flowRunId: string
  syscall: string
  input: unknown
  policy: HumanPolicy
  actionMeta?: { irreversible: boolean; riskLevel?: 'low'|'medium'|'high' }
}): Promise<HumanCheckResult> {
  // approvalRequiredBeforeExternalWrite — covers any action provider syscall
  if (opts.policy.approvalRequiredBeforeExternalWrite && opts.syscall.startsWith('action.'))
    return { required: true, mode: opts.policy.mode ?? 'per_step', reason: 'external_write' }

  // explicit syscall allowlist
  if (opts.policy.approvalRequiredBeforeActions?.includes(opts.syscall))
    return { required: true, mode: opts.policy.mode ?? 'per_step', reason: 'explicit_syscall' }

  // riskThreshold — compare action's classified level to policy threshold
  const RISK_ORDER = { low: 0, medium: 1, high: 2 } as const
  if (opts.policy.riskThreshold && opts.actionMeta?.riskLevel
      && RISK_ORDER[opts.actionMeta.riskLevel] >= RISK_ORDER[opts.policy.riskThreshold])
    return { required: true, mode: opts.policy.mode ?? 'per_step', reason: 'risk_threshold' }

  return { required: false }
}
```

`approvers` (user-id list) is intersected with admin auth (`requireAdmin` from agent-foundation); a reviewer not in both is rejected at approval-resolve time. `approvalTtlSeconds` overrides the kernel's agent-os Q4 default (24h). `reminderCadenceSeconds` (Open Q2) configures when reminders fire.

**Alternatives considered.**
- *Build a parallel approval table for policy approvals*. Rejected — duplicates kernel mechanism; admin inbox splits across two tables
- *Synchronous approval inside the syscall call*. Rejected — Workers CPU/wall-clock limits forbid long-poll inside a single call (agent-os D9 R8)
- *Policy as the source of approval gate (not just trigger)*. Rejected — policy decides when, kernel handles how; collapsing both into policy duplicates lifecycle code

**Rationale.** Policy supplies "when"; kernel owns "how". The three modes (per-step / batch / edit-on-approval) cover the documented use cases without a new gate mechanism.

### D9: Retry policy — overlay on flow-runtime step retry, with exhaustion behavior

**Decision.** Retry policy overlays on flow-runtime per-step retry (agent-flow D8). Each step's effective retry count is `min(stepRetry.max, policy.maxRetriesPerStep ?? Infinity)` and a per-run counter caps total retries at `maxTotalRetriesPerRun`. When a step exhausts its retries, the policy's `onExhausted` decides what happens next:

| `onExhausted` | Behavior |
|---|---|
| `fail_run` (default) | Step fails permanently; flow runtime transitions `flow_runs.status='failed'` with `error_json.reason='step_exhausted_no_continuation'` |
| `skip_step` | Step marked `skipped` in `flow_step_runs`; flow continues to the next step on the edge graph; downstream steps see the missing state slot and may fail their own preconditions |
| `continue_with_partial` | Step marked `done` with `output_json.partial=true` and any partial output captured; downstream steps proceed but the run's final status is `done_with_partial` (a new sub-status documented in this change) |

Each retry attempt writes `policy_violations` (`category='retry'`, `rule='step_retry'`, `outcome='warned'`) so the audit trail shows policy-driven retry behavior distinct from flow-level retry decisions.

```typescript
// src/lib/agent-policy/enforcement/retry.ts (called from flow runtime when a step fails retryable)
export async function shouldRetryStep(opts: {
  flowRunId: string
  stepId: string
  stepRetryConfig: { max: number; backoff: string; delayMs: number }
  policyRetry: RetryPolicy | undefined
  observed: { thisStepAttempts: number; runTotalRetries: number }
}): Promise<RetryDecision> {
  const stepCap = Math.min(opts.stepRetryConfig.max, opts.policyRetry?.maxRetriesPerStep ?? Infinity)
  const runCap = opts.policyRetry?.maxTotalRetriesPerRun ?? Infinity
  if (opts.observed.thisStepAttempts >= stepCap || opts.observed.runTotalRetries >= runCap) {
    return { retry: false, onExhausted: opts.policyRetry?.onExhausted ?? 'fail_run' }
  }
  return { retry: true, backoffMs: computeBackoff(opts.stepRetryConfig, opts.observed.thisStepAttempts, opts.policyRetry) }
}
```

**Alternatives considered.**
- *Retry policy replaces flow-step retry*. Rejected — flow-step retry encodes step-intrinsic knowledge ("search needs 5 retries; artifact write needs 0"); policy supplies budget cap on top
- *Per-step `onExhausted` instead of global*. Considered, deferred — global is sufficient for v1; per-step adds YAML complexity without observed need

**Rationale.** Two-tier (flow step config + policy cap) matches agent-flow D8's reasoning. The three exhaustion modes cover "fail safely", "best effort", "partial delivery" — the three patterns observed in pipeline runs today.

### D10: Policy inheritance + overrides — three layers, resolution order explicit, frozen at run start

**Decision.** Effective policy is built from up to three layers, in this order (later layers override earlier):

1. **Base policy** (from `policy_definitions` by `policyId + version`)
2. **Flow-level override** (from `policy_bindings.overrides_json` for `(flow_id, policy_id, is_default=true)`)
3. **Run-level override** (from the run-create request body's `policyOverrides`)

Merge semantics: **deep merge by category**. Within a category, sub-objects merge recursively; primitive fields and arrays are **replaced wholesale** (no array-append semantics). This avoids ambiguity around "did adding to the allowlist mean union or replace?".

```typescript
// src/lib/agent-policy/merge.ts
export function mergePolicies(...layers: (Partial<Policy> | null | undefined)[]): EffectivePolicy {
  const result: any = {}
  for (const layer of layers) {
    if (!layer) continue
    for (const category of ['budget', 'provider', 'quality', 'security', 'human', 'retry'] as const) {
      if (layer[category] === undefined) continue
      if (layer[category] === null) { delete result[category]; continue }   // explicit-null clears
      result[category] = deepMergeOneLevel(result[category] ?? {}, layer[category])
    }
  }
  return result as EffectivePolicy
}
```

Once merged, the effective policy is **frozen** (Object.freeze + JSON.stringify written to `flow_runs.effective_policy_json`) at run-create. Subsequent edits to `policy_definitions` or `policy_bindings` do not affect this run. Mid-run policy changes are explicitly out of scope (Open Q4).

```yaml
# Worked example
# Base: research-standard
budget: { maxCostUsd: 1.00, maxTokens: 100000 }
quality: { citationRequired: true, minSourcesPerSubquestion: 3 }
provider: { llm: { allowlist: ['openai', 'anthropic'] } }

# Flow-level override on deep-research (lower minSources for blog-author dogfood)
quality: { minSourcesPerSubquestion: 2 }

# Run-level override (this one run needs more budget)
budget: { maxCostUsd: 5.00 }

# Effective policy materialized at run-create:
budget: { maxCostUsd: 5.00, maxTokens: 100000 }
quality: { citationRequired: true, minSourcesPerSubquestion: 2 }
provider: { llm: { allowlist: ['openai', 'anthropic'] } }
```

**Alternatives considered.**
- *Single layer (no overrides)*. Rejected — operator can't tune a single run without forking the policy
- *N-layer inheritance with named parents*. Rejected — three layers covers documented use; deeper inheritance turns into a chase-the-pointer nightmare for audits
- *Array-append merge for allowlists*. Rejected — easy to accidentally widen access; explicit "replace" forces operator awareness when widening

**Rationale.** Three layers maps directly to "registry / flow default / one-off" — the three places operators actually want to express a policy choice. Freezing at run-create is the reproducibility guarantee that audits depend on.

### D11: Reference policies shipped — `research-quick`, `research-standard`, `research-enterprise`

**Decision.** Ship three reference policies as part of this change, registered into `policy_definitions` via a seed migration. Matches Gateway Console §4.3 example + §5.1 presets.

```yaml
# src/lib/agent-policy/reference/research-quick.yaml
policyId: research-quick
version: 1
name: Quick Research
description: Cheap, fast, low-stakes; suitable for dogfooding and exploration.
budget:
  maxCostUsd: 0.50
  maxTokens: 50000
  maxIterations: 50
  maxRuntimeSeconds: 300
  onExceeded: kill_run
retry:
  maxRetriesPerStep: 1
  maxTotalRetriesPerRun: 5
  onExhausted: continue_with_partial

# src/lib/agent-policy/reference/research-standard.yaml
policyId: research-standard
version: 1
name: Standard Research
description: Default policy for production research runs.
budget:
  maxCostUsd: 2.00
  maxTokens: 200000
  maxIterations: 200
  maxRuntimeSeconds: 1200
  onExceeded: kill_run
provider:
  llm: { allowlist: ['openai', 'anthropic', 'gemini'] }
  search: { allowlist: ['tavily', 'exa'], fallbackOrder: ['tavily', 'exa'] }
quality:
  minSourcesPerSubquestion: 3
  citationRequired: true
  staleSourceCheck: { maxAgeDays: 365, failOnViolation: false }
retry:
  maxRetriesPerStep: 3
  maxTotalRetriesPerRun: 20
  onExhausted: fail_run

# src/lib/agent-policy/reference/research-enterprise.yaml
policyId: research-enterprise
version: 1
name: Enterprise Research
description: Customer-deliverable; locked-down, audited, conflict-blocking.
budget:
  maxCostUsd: 10.00
  maxTokens: 1000000
  maxIterations: 500
  maxRuntimeSeconds: 3600
  onExceeded: pause_for_approval
provider:
  llm: { allowlist: ['anthropic'], region: ['us', 'eu'] }
  search: { allowlist: ['tavily', 'exa'] }
  dataResidency: { allowedRegions: ['us', 'eu'], onViolation: fail }
quality:
  minSourcesPerSubquestion: 5
  citationRequired: true
  conflictCheck: { enabled: true, blockOnUnresolved: true }
  staleSourceCheck: { maxAgeDays: 180, failOnViolation: true }
  minClaimConfidence: 0.6
security:
  sensitiveDataRedaction:
    regexPatterns: ['pii_basic', 'credentials']
    entityKinds: ['email', 'phone', 'api_key', 'jwt']
    onMatch: redact
  leastPrivilegeScope: true
human:
  approvalRequiredBeforeExternalWrite: true
  riskThreshold: medium
  mode: per_step
  approvalTtlSeconds: 86400
retry:
  maxRetriesPerStep: 5
  maxTotalRetriesPerRun: 50
  onExhausted: fail_run
```

Seed migration writes these three rows on first deploy; the seed is idempotent (`INSERT OR IGNORE`).

**Alternatives considered.**
- *Ship only one reference policy*. Rejected — proposal explicitly names three; demonstrates the spectrum
- *Ship 10+ reference policies*. Rejected — same "data not architecture" scope boundary as agent-flow D12 / Open Q4

**Rationale.** Three policies span the cost / strictness axis; each exercises a different subset of the six categories (Quick: budget+retry; Standard: + provider + quality; Enterprise: all six). Dogfooding `deep-research` with `research-standard` validates the most-common path end-to-end.

### D12: Feature flags — umbrella + per-category

**Decision.** Seven new entries in the central `src/lib/config/flags.ts`:

| Flag | Default | Purpose |
|---|---|---|
| `AGENT_POLICY_ENABLED` | `false` | Umbrella; off = no policy resolution, no enforcement, no `policy_violations` writes |
| `AGENT_POLICY_BUDGET` | `false` | Live budget enforcement (D4) — when off, budget caps are ignored |
| `AGENT_POLICY_PROVIDER` | `false` | Provider constraints (D5) — when off, router uses raw chain |
| `AGENT_POLICY_QUALITY` | `false` | Quality verification (D6) — when off, post-run verifier is skipped |
| `AGENT_POLICY_SECURITY` | `false` | Sensitive-data + tool allowlist + least-privilege (D7) — when off, intersection step is a no-op |
| `AGENT_POLICY_HUMAN` | `false` | Approval gate triggers (D8) — when off, no policy-driven approvals (kernel's own irreversible-action approvals still fire) |
| `AGENT_POLICY_RETRY` | `false` | Retry overlay (D9) — when off, flow-runtime step retry is the only authority |

```typescript
// flags.ts addition
agentPolicy: {
  enabled: boolEnv('AGENT_POLICY_ENABLED', false),
  budget: boolEnv('AGENT_POLICY_BUDGET', false),
  provider: boolEnv('AGENT_POLICY_PROVIDER', false),
  quality: boolEnv('AGENT_POLICY_QUALITY', false),
  security: boolEnv('AGENT_POLICY_SECURITY', false),
  human: boolEnv('AGENT_POLICY_HUMAN', false),
  retry: boolEnv('AGENT_POLICY_RETRY', false),
},
```

The umbrella flag short-circuits all category checks — when `AGENT_POLICY_ENABLED=false`, no enforcement code path is reached, no `policy_violations` rows are written, and `flow_runs.effective_policy_json` stays NULL. The per-category flags layer on top: even with umbrella on, an off category is treated as "no policy on that axis".

**Alternatives considered.** Single big flag rejected per CLAUDE.md mandate.

**Rationale.** Seven flags matches the seven independent enforcement surfaces. Each can ship and stabilize independently — Budget first (highest user value, simplest correctness story), then Quality (validates `agent-evidence` integration), then the rest.

## Risks / Trade-offs

### R1: Budget enforcement race condition — kill mid-syscall

**Risk.** Budget check runs *after* `agent_tool_calls` write. A long-running syscall (e.g. 30s LLM call) can blow through `maxCostUsd` before the check fires; the kill arrives mid-next-syscall, having already paid for the overrun. Worst case, parallel syscalls in flight all complete and bill before the kill arrives.

**Mitigation.** (a) `maxParallelUnits` cap reduces blast radius — at most N concurrent syscalls can be in flight when the kill fires. (b) Soft pre-flight check: every syscall handler calls `checkBudget(observed = current + estimatedCost)` *before* executing; the estimate is the provider's `costModel` applied to the input. Conservative estimates (round up by 20%) reduce overrun probability. (c) Documented behavior in the run-failed audit log: the `error_json.actual_cost_at_kill` field shows the overrun and the operator can decide whether to retry with a higher cap. (d) Per-provider per-run call cap (agent-providers R3) acts as the hard floor when budget enforcement is off or misconfigured.

### R2: Policy inheritance complexity — three layers + per-category merge

**Risk.** Three layers × six categories × array-replace-vs-deep-merge semantics produces an effective policy that surprises operators. "Why did this run use `maxTokens: 100000` when I set 50000 in the run override?" — answer involves chasing through three records and remembering that primitives replace.

**Mitigation.** (a) `effective_policy_json` is always available on `flow_runs` — every run detail page shows the resolved policy verbatim. (b) An additional `resolution_chain_json` column (added in 0014) records the three layer ids and override paths that contributed, so the operator sees "value came from run override → flow binding → base policy `research-standard` v3". (c) A `POST /api/admin/policies/preview` endpoint takes a `(policyId, flowId?, overrides?)` triple and returns the effective policy without creating a run — operators can dry-run their policy changes. (d) Documentation page with worked examples; the three-layer model is the same as Kubernetes admission controllers, a known pattern.

### R3: Sensitive-data regex false negatives

**Risk.** Regex patterns miss obfuscated PII (Unicode look-alikes, base64-encoded secrets, novel API key formats). False negatives leak sensitive data into `agent_tool_calls.output_json`, `evidence_excerpts.body_text`, and artifact outputs. False positives over-redact benign text.

**Mitigation.** (a) Regex set is **named** (`pii_basic`, `credentials`) and centrally maintained at `src/lib/agent-policy/redaction/patterns.ts`; new patterns are PR-reviewable. (b) Match counts written to `policy_violations.detail_json` give visibility into how often each pattern fires — high false-positive rate triggers pattern refinement. (c) `entityKinds`-based redaction (NER) is the v1.1 upgrade path (Open Q1) — when Workers AI NER quality is validated, the same `onMatch` mode applies. (d) The redaction layer is a **defense-in-depth** layer, not the primary control — agents that handle sensitive data should also have their grants narrowed (`outboundDomainsAllowlist`, `leastPrivilegeScope`) and run under policies that don't write user-visible artifacts. (e) Operators can ship custom regex sets by adding entries to the centrally-maintained map; failing closed (`onMatch: 'block_step'`) is the recommended setting for sensitive flows.

### R4: Human approval bottleneck

**Risk.** Enterprise policy with `mode: per_step` plus an action-heavy flow creates 20+ approval requests per run. Approver fatigue → either rubber-stamp (defeats the gate) or backlog (flow runs pile up paused, never finish). The system effectively blocks on the slowest human.

**Mitigation.** (a) `mode: batch` collapses multiple approvals into one per step — recommended for action-heavy flows. (b) `mode: edit_on_approval` lets the reviewer modify-and-approve in one motion, useful when the action needs small tweaks. (c) Reminder cadence (Open Q2) escalates stale approvals; default 4h initial reminder, 24h re-reminder, 48h escalation to a documented backup approver. (d) `approvalTtlSeconds` failsafe — approvals not resolved by TTL transition to `expired`, and the policy's `onExceeded` (for budget) / `onExhausted` (for retry) decides whether to fail or continue. (e) Per-run human-policy metrics surface in the admin console: "average time to approval per policy"; operators can adjust `riskThreshold` upward if a category is too noisy.

### R5: Quality policy vs LLM nondeterminism

**Risk.** A flow run that passes quality verification on attempt 1 might fail on attempt 2 with the same inputs — different LLM samples produce different claim sets, different source counts, different conflict candidates. `citationRequired` could fail randomly even on a well-functioning flow.

**Mitigation.** (a) Quality verification runs **after** evidence extraction completes; extraction itself uses temperature-low structured-output prompts (agent-evidence R1), reducing variance. (b) `minSourcesPerSubquestion` is the most variance-sensitive rule; conservative default (3 for standard, 5 for enterprise) leaves headroom for LLM jitter. (c) Failed-quality runs are inspectable — operators see exactly which claims lacked citations and can adjust either the policy threshold or the flow (e.g. add a research pass). (d) Documented guidance: quality policy is a **floor**, not a target. If an operator sets `minSourcesPerSubquestion: 10` and runs fail 30% of the time, the policy is mistuned; the system surfaces the mistuning via `policy_violations` aggregates per policy version.

### R6: Policy version drift mid-run

**Risk.** Policy is edited mid-run-execution. The kernel's per-syscall enforcement reads the policy fresh each time (cheap KV read), so caps could change mid-flight; budgets get tighter/looser, allowlists shrink, approvals start firing on steps that already executed without them.

**Mitigation.** Effective policy is **materialized and frozen** at run-create (D10). Every enforcement check reads from `flow_runs.effective_policy_json` (one read at run start, cached for the run's duration), not from the live `policy_definitions` table. Policy edits via admin API only affect **new** runs created after the edit. The audit log records the policy version pinned to each run; reproducibility is total.

### R7: Over-restrictive denylist

**Risk.** Operator adds a domain to `outboundDomainsAllowlist` denylist, forgets that the `research` agent depends on it, every subsequent flow run fails at first search. The denial path is correct (D7), but the user sees "all flows broken" without an obvious cause.

**Mitigation.** (a) Policy validation at write time — Zod schema rejects an allowlist that excludes a domain declared in the system's seed-data critical-domain list (e.g. removing `*.tavily.com` from the default research policy raises a warning at write). (b) Policy preview endpoint (R2 mitigation) lets operators see what would change before they save. (c) `policy_violations` rows with `outcome='blocked'` are surfaced in the admin dashboard; a single blocked syscall raises a visible alert. (d) Quick rollback: every policy version is immutable; rolling back to v(N-1) is one PATCH to the `flow_bindings` row. (e) System-default policy is the floor — if a custom policy breaks everything, deleting the binding falls back to `research-standard` automatically.

### R8: Policy enforcement points scattered across five subsystems

**Risk.** Budget enforcement in kernel, provider enforcement in router, quality in evidence-verifier, security in kernel-post-hook, human in approval gate, retry in flow runtime — six enforcement sites means six places that can drift, six places where a regression breaks policy.

**Mitigation.** (a) Single source of truth — every enforcement site imports from `src/lib/agent-policy/enforcement/{budget,provider,quality,security,human,retry}.ts`; the policy types and merge logic live in one module. (b) Integration tests: one test per category, using the reference `deep-research` flow with each reference policy, asserting the expected enforcement outcomes (e.g. `research-quick` kills at `maxCostUsd: 0.50`; `research-enterprise` blocks on unresolved conflict). (c) `policy_violations` table is the cross-cutting audit — a single query shows every enforcement decision regardless of which subsystem made it. (d) The boundary doc: each downstream change's design file calls out where it consumes policy (already done for agent-evidence D8); this change's spec mirrors that contract.

## Migration Plan

Each step is a single PR, gated by per-category flags, with a parity test on the dogfood flow. Ordered so highest-value categories ship first and downstream layers stay stable.

**Step 1 — Schema, types, registry (dark).**
- D1 migration `0015_agent_policy.sql` (D3) — three tables + ALTER on `flow_runs`
- `src/lib/agent-policy/types.ts` — six category schemas + top-level `Policy` Zod definition
- `src/lib/agent-policy/{repo,resolve,merge}.ts` — D1 writers/readers, three-layer resolution, deep-merge logic
- Register `AGENT_POLICY_*` flag block in `src/lib/config/flags.ts`
- Admin endpoints: `GET /api/admin/policies`, `POST /api/admin/policies` (create new version), `GET /api/admin/policies/:id/:version`, `POST /api/admin/policies/preview` (R2 dry-run)
- Vitest tests for resolve / merge / Zod validation
- **Rollback.** Drop migration; delete the directory.

**Step 2 — Ship reference policies as seed data.**
- `src/lib/agent-policy/reference/{research-quick,research-standard,research-enterprise}.yaml` (D11)
- Seed migration `0015_agent_policy_seed.sql` (or seed script run at deploy) inserts the three rows idempotently
- Bind `research-standard` as the system default in `admin_settings` (`policies:default:flow_run`)
- Vitest: load each reference policy, validate against schema, verify expected enforcement boundaries
- **Rollback.** Delete seed rows; system default falls through to "no policy".

**Step 3 — Budget enforcement (first live category).**
- `src/lib/agent-policy/enforcement/budget.ts` (D4)
- Hook into kernel post-syscall: after each `agent_tool_calls` write, check budget against `flow_runs.effective_policy_json`
- Wire `onExceeded: 'kill_run'` to cooperative cancel (agent-os D7); `onExceeded: 'pause_for_approval'` to `agent_approval_requests`
- Dogfood: run `deep-research` with `research-standard` (default cost cap 2 USD); verify expected behavior
- Flip `AGENT_POLICY_ENABLED=true` and `AGENT_POLICY_BUDGET=true` in production after 1-week soak in dev
- **Rollback.** Flip `AGENT_POLICY_BUDGET=false`; budget caps ignored; existing kernel `tool_call_limit` is the floor.

**Step 4 — Quality enforcement (validates evidence integration).**
- `src/lib/agent-policy/enforcement/quality.ts` (D6)
- Hook into flow runtime post-run: call `verifyFlowRun` against evidence API after the final step
- Extend `EvidenceQueryAPI` with `findSubquestionsBelowSourceFloor` (one helper, agent-evidence change ratifies)
- Wire failures to `policy_violations` + `flow_runs.status='failed'`
- Dogfood: enable `AGENT_POLICY_QUALITY=true`; verify `citation_required` rejects a run with a manually-uncited claim
- **Rollback.** Flag off; post-run verifier is skipped; runs reach `done` without verification.

**Step 5 — Provider, Retry, Human (parallel rollout).**
- `src/lib/agent-policy/enforcement/{provider,retry,human}.ts` (D5, D9, D8)
- Each wires into its existing subsystem (router / flow runtime / kernel approval gate)
- Per-category flag flip after dev validation
- Per-category integration test: confirm the appropriate `policy_violations` row + flow outcome
- **Rollback.** Per-category flag off; subsystem behavior reverts to its pre-policy default.

**Step 6 — Security (last; highest false-positive risk).**
- `src/lib/agent-policy/enforcement/{redact,toolAllowlist,scope}.ts` (D7)
- Redact runs as kernel post-hook before any user-visible payload write
- Tool allowlist + least-privilege computed at run-create, written into `flow_runs.effective_policy_json`
- Dogfood with `research-enterprise` policy; verify redaction fires on a seeded PII fixture, tool allowlist denies a syscall not in the intersection
- **Rollback.** Flag off; no redaction, no allowlist intersection (agent grants are the only ceiling).

**Step 7 — Dogfood + policy console foundations.**
- Manually trigger `deep-research` under each of the three reference policies; verify cost / quality / approval behaviors match the policy
- Admin dashboard skeleton: list policies, list bindings, list recent `policy_violations`
- Document the policy authoring guide
- The rich policy editor UI lives in `agent-console` (#6); this step ships only the data-listing endpoints

**Pre-merge verification per step.** Matches the established pattern: `pnpm lint`, `pnpm build` (with `astro check`), `pnpm test`, `pnpm check:references`, plus manual smoke on the affected enforcement path in local dev with the dogfood flow.

**Rollback strategy.** Every step is gated by `AGENT_POLICY_ENABLED` or one of its per-category flags. Flipping the umbrella flag to `false` halts all enforcement; the seven category flags layer on top. D1 tables remain after rollback (no destructive operations); the reference policies remain registered but unused.

## Open Questions

### Q1: Sensitive-data classifier — regex vs ML (NER)?

**Discussion.** Regex (v1) is cheap, deterministic, and reviewable, but misses obfuscated PII and produces false positives on benign text containing digit-heavy strings. Workers AI NER models (`@cf/google/gemma-*` zero-shot, or a small fine-tuned PII detector) catch more cases but add per-call cost and latency; their precision on PII categories is unmeasured for our content domain.

**Default if probe inconclusive.** Ship D7 v1 with regex-only (`entityKinds` field declared in schema but unimplemented; trying to use it raises `NotImplemented`). When sensitive-data flows become important enough to justify the cost, run a precision/recall probe on Workers AI NER against a labelled fixture set; gate behind `AGENT_POLICY_SECURITY_NER=true`. Reopen in v1.1.

### Q2: Approval reminder cadence?

**Discussion.** Stale approvals choke the flow runtime — once a flow is `paused` waiting for approval, it stays paused until resolution or TTL expiry. No reminders means approvers forget; too many reminders is spam.

**Default if probe inconclusive.** **First reminder at 4h, second at 24h, escalation to backup approver at 48h, expiry at TTL (default 24h, overridable per-policy).** Reminders are kernel-driven (cron sweep over `agent_approval_requests` where `status='pending' AND created_at < now - reminder_threshold`). v1 ships with reminders **disabled** behind a `AGENT_POLICY_HUMAN_REMINDERS=false` flag; cadence values configurable per-policy when enabled. Reopen with `agent-console` UI design.

### Q3: Policy versioning UI?

**Discussion.** This change persists every policy version (`policy_definitions.version`), but no UI exposes "what changed between v2 and v3 of `research-standard`". Operators need this to safely roll forward a tightened policy without breaking in-flight expectations.

**Default if probe inconclusive.** **Defer to `agent-console` (#6).** This change ships `GET /api/admin/policies/:id/:version` and `GET /api/admin/policies/:id` (lists all versions); the console builds a side-by-side diff view on top. v1 operators use `git diff` against the YAML files checked into `src/lib/agent-policy/reference/` for built-in policies; custom policies stored only in D1 lack diff UI until the console ships. Workaround: export endpoint returns the full policy JSON, diffable in any editor.

### Q4: Per-category disable mid-run vs at run start?

**Discussion.** D10 freezes the full policy at run-create. But there's a finer-grained question: should an operator be able to disable a single category (e.g. lift the budget cap) on an in-flight run without killing it?

**Default if probe inconclusive.** **No mid-run policy mutations in v1.** A run's effective policy is immutable for the run's lifetime. The escape hatch is `budget.onExceeded: 'pause_for_approval'` — when the cap is hit, the run pauses and the approver can effectively raise the cap by approving continuation. Other categories (provider, quality, security, human, retry) have no such pause-and-continue path; the only way to relax a constraint mid-run is to cancel the run and restart with new overrides (which forfeits partial progress). This is a documented limitation; reopen if operators report it as a frequent pain point.
