---
title: "OMP KDL Rule Tree & 60+ Provider Routing: Why Provider Policy Lives in KDL, Not TypeScript"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, kdl, rule-tree, provider-routing, compat-engine, architecture, typescript]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 7
tldr: "OMP expresses routing, compat, thinking, quota, and pricing policies for 60+ providers entirely in KDL (taxonomy/classes/providers/runtime), compiles to rules.json, and resolves at runtime via a typed engine. Three reasons: layered ownership, compile-time validation, and mechanical priority resolution—all three would scatter, become unverifiable, or rely on human judgment if hardcoded in TS."
description: "Deep dive into OMP's KDL rule tree architecture: taxonomy (identity classification), classes (model lineage truths), providers (deployment contracts), runtime/behavior (heuristics). Breaks down classifyModel() for identity classification and effort collapse, buildModel()/resolveModelPolicy() for KDL→rules.json compilation and cascade resolution, how the (exactness, dimensions, priority) tuple resolves rule conflicts, and how 60+ providers' routing logic is expressed in the rule tree."
draft: false
---

[OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 7. Previous posts covered the agent loop, append-only context, three-layer approval, bash tokenized approval, four compaction strategies, hashline edit noop guard, provider quirks, and session tree. This post focuses on the **compat engine's rule layer**—why routing/compat/thinking/quota policies for 60+ providers aren't written in TypeScript but centralized in a single KDL rule tree.

---

## TL;DR

- **Four-layer KDL ownership**: `taxonomy/*.kdl` (identity classification), `classes/*.kdl` (model lineage truths), `providers/*.kdl` (deployment contracts), `runtime/behavior.kdl` (heuristics)—each layer has distinct responsibilities with zero overlap
- **Why not TypeScript**: Layered ownership lets different roles (catalog maintainer vs provider integrator) edit only their layer; compile-time validation (unknown directives, duplicate axes, ambiguity errors) catches mistakes at `bun run gen:compat`; priority uses a mechanical `(exactness, dimensions, priority)` tuple comparison, not human code reading
- **`classifyModel()`**: `provider + modelId → ModelIdentity{class, family, revision, effort, thinkingVariant, logicalId}` via "reviewed override → suffix collapse → class/family/revision ranker" pipeline
- **`buildModel()` / `resolveModelPolicy()`**: KDL → `rules.json` (compilation artifact) → `resolveCascade(target)` with flat rule list + per-axis independent resolution + ambiguity checks
- **60+ provider routing**: `runtime/behavior.kdl` nodes (`api-routes`, `quota-tiers`, `exclude-models`, `model-limits`, `pricing-peer`, etc.) use `exact/prefix/substring/glob/token` matchers; `behavior.ts` exposes typed accessors (`apiRouteFor`, `quotaTierFor`, `isExcludedModel`…)

---

## Context

You're maintaining a coding agent supporting 60+ LLM providers (OpenAI, Anthropic, Google, OpenRouter, Cursor, GitHub Copilot, xAI, Bedrock, Vertex, Moonshot, DeepSeek, Qwen, GLM, MiniMax, Kimi, Ollama, LM Studio, vLLM, LiteLLM…). Each provider:

- Has its own API format (chat completions / responses / anthropic-messages / bedrock-converse / google-generative-ai…)
- Has its own model ID naming conventions (`gpt-5.6`, `claude-opus-4-6`, `gemini-3-pro`, `kimi-k3`, `deepseek-v4-flash`…)
- Has its own reasoning/thinking control surface (effort / budget / adaptive / google-level…)
- Has its own quota tiers, plan requirements, model limits, pricing, hosted default model
- Even the **same model ID** routes differently across providers (e.g., `gpt-5.6` uses Responses on OpenAI, chat completions on OpenRouter, Responses on GitHub Copilot, custom format on Cursor)

**How do you express, validate, and resolve these policies without writing 60 if-else files?**

That's exactly what OMP's KDL rule tree solves.

---

## Problem: What Happens If You Hardcode in TypeScript?

```typescript
// Hypothetical anti-pattern
function resolveCompat(provider: string, modelId: string): Compat {
  if (provider === "openai") {
    if (modelId.startsWith("gpt-5.6")) return { reasoningDisableMode: "none-effort", ... };
    if (modelId.startsWith("o3")) return { thinkingFormat: "openai", ... };
  }
  if (provider === "openrouter") {
    if (modelId.startsWith("anthropic/")) return { thinkingFormat: "openrouter", ... };
  }
  // ... 60 providers × N rules
}
```

Three categories of disaster emerge:

1. **Ownership chaos**: Catalog maintainer wants to fix `gemini` family definitions; provider integrator wants to update `google-vertex` deployment contracts. Both edit the same TS file—constant PR conflicts.
2. **Validation by eyeball**: `thinking-efforts "low" "medium" "high"` typoed to `"hign"`; same axis assigned twice in one rule; two rules with equal priority fighting over the same axis—these become runtime bugs or silent overrides in TS.
3. **Implicit priority**: Is rule A more specific than rule B? Does B cover more dimensions? In TS you only have "later overwrites earlier" or "human eyeballs the code"—no mechanically verifiable priority semantics.

---

## Solution: Four-Layer KDL Ownership

OMP splits rules into four layers, **each with a clear owner and responsibility**, validated at compile time by `bun run gen:compat`, with runtime reading only the compiled `rules.json`.

### Layer 1: `taxonomy/*.kdl` — Identity Classification Authority

**Owner**: Catalog maintainer (model identity correctness)

Defines:
- **Class membership matchers**: `exact` (rank 4) > `bounded` (3) > `namespace` (2) > `prefix` (1) > `glob` (0)
- **Product families**: `family "flash" glob="*flash*"` + optional `priority`
- **Revision extraction**: `revision prefix="claude-"`, `skip-bare "o1" "o3"`
- **Reviewed identity overrides**: Precise corrections for specific `provider + model` (`logical`, `class`, `family`, `revision`, `effort`, `thinking-variant`)
- **Suffix collapse vocabulary**: `thinking-suffix`, `effort-suffix`, `effort-lane-suffix`, `routing-variant-suffix`, `effort-family`, `variant-family`, `pair-token`, `provider-alias`
- **Discovery vocabulary**: `recover-canonical-params`, `borrow-responses-route`, `billing-variant-suffix`, `trailing-marker`, `pro-reasoning-alias`, `canonical-family-token`…

**Key files**:
- `packages/catalog/src/compat/rules/taxonomy/openai.kdl` — OpenAI class definition
- `packages/catalog/src/compat/rules/taxonomy/_collapse.kdl` — Shared collapse vocabulary
- `packages/catalog/src/compat/rules/taxonomy/_discovery.kdl` — Shared discovery vocabulary
- `packages/catalog/scripts/compat-compiler/compile-taxonomy.ts#compileTaxonomy` — Compilation entry

### Layer 2: `classes/*.kdl` — Model Lineage Truths

**Owner**: Catalog maintainer (behavior inherent to a model line)

Defines: **Inherent to a model line**, optionally scoped to providers via `on "provider-a" "provider-b"`.

Example: `classes/openai.kdl`
```kdl
class "openai" {
  family "gpt" {
    revision "<5.2" { thinking-efforts "minimal" "low" "medium" "high" }
  }
  family "codex" {
    revision "<5.2" { thinking-efforts "minimal" "low" "medium" "high" }
    revision "=5.1" { models "*codex-mini*" { thinking-efforts "medium" "high" } }
  }
  revision ">=5.2 <5.6" { thinking-efforts "low" "medium" "high" "xhigh" }
  revision ">=5.6" { thinking-efforts "low" "medium" "high" "xhigh" "max"; requires-reasoning-off-juice-instruction #true }
  family "codex" { revision ">=1" { limits-patch { context-window 272000 } } }
}
```

This layer **contains no provider-specific deployment details**—that's Layer 3.

**Key files**:
- `packages/catalog/src/compat/rules/classes/*.kdl` (20+ files)
- `packages/catalog/scripts/compat-compiler/compile-cascade.ts#compileCascade` — Same cascade compiler

### Layer 3: `providers/*.kdl` — Deployment Contracts

**Owner**: Provider integrator (provider-specific deployment behavior)

Defines: **Behavior imposed by a host**, plus per-model residue that taxonomy cannot express exactly (must carry `// residue:` comment).

Example: `providers/openai.kdl`
```kdl
provider "openai" {
  thinking-mode "effort"
  class "unknown" {
    revision ">=5.6 <5.7" { reasoning-disable-mode "none-effort"; thinking-efforts "low" "medium" "high" "xhigh" "max" }
    revision ">=5 <6" { apply-patch-tool-type "freeform" }
  }
  models "codex-mini-latest" "gpt-realtime-2.1" { thinking-efforts "minimal" "low" "medium" "high" "xhigh" }
  class "openai" {
    family "gpt" { revision "=5.6" { reasoning-disable-mode "none-effort" } }
    revision ">=5 <6" { apply-patch-tool-type "freeform" }
  }
  models "daybreak-blue-latest" "gpt-5.6" "gpt-5.6-sol*" { long-context-cost { inputThreshold 272000 input 10.0 output 45.0 cacheRead 1.0 cacheWrite 12.5 } }
}
```

**Key files**:
- `packages/catalog/src/compat/rules/providers/*.kdl` (60+ files)
- Same `compileCascade` entry

### Layer 4: `runtime/behavior.kdl` — Heuristics (Before/Outside Exact Lookup)

**Owner**: Catalog maintainer + provider integrator (joint)

Defines: **Heuristics used before or outside exact bundled-model lookup**:

| Node | Purpose | Example |
|---|---|---|
| `openai-responses-heuristic` | Does a discovered OpenAI id use Responses API? | `include-prefix "gpt-" "o1"` |
| `model-operations` | Extra operations for discovered models | `operation "generate_image"` |
| `cursor-effort` | Parse Cursor effort-suffix siblings | `family-marker="gpt-"` |
| `quota-tiers` | Provider quota scope/display tier | `tier "Flash" "gemini-2.5-flash"…` + `fallback "Flash" substring="flash"` |
| `hosted-default` | Default model for model-less hosted ops | `provider="kimi-search" model="kimi-for-coding"` |
| `exclude-models` | Non-chat/unsupported SKU exclusion | `substring="embedding" substring="tts"` |
| `api-routes` | Which wire API a discovered model id uses | `route "anthropic-messages" prefix="anthropic/" strip-prefix=#true` |
| `model-limits` | Context/max-token pins | `limits "gpt-5.6" context=272000 max-tokens=128000` |
| `plan-requirement` | Subscription tier requirement | `tier "pro" substring="-spark"` |
| `pricing-peer` | Cross-provider pricing alias | `peers="google" "google-vertex" "anthropic"` |

**Key files**:
- `packages/catalog/src/compat/rules/runtime/behavior.kdl`
- `packages/catalog/scripts/compat-compiler/compile-behavior.ts#compileBehavior`
- `packages/catalog/src/compat/behavior.ts` — Typed accessors (`apiRouteFor`, `quotaTierFor`, `isExcludedModel`, `modelLimitsFor`, `planRequirementFor`, `pricingPeerFor`, `hostedDefaultModel`, `modelOperationOverrides`, `cursorEffortSuffix`)

---

## Why KDL? (Three Reasons)

### 1. Layered Ownership

| Layer | Owner | Change Frequency | Conflict Risk |
|---|---|---|---|
| taxonomy | Catalog maintainer | Low (model identity stable) | Low |
| classes | Catalog maintainer | Medium (new model generations) | Low |
| providers | Provider integrator | High (provider API changes) | Medium |
| runtime/behavior | Joint | Medium-high (heuristics adapt to discoveries) | Medium |

**Different roles edit different folders**—PRs don't collide. `taxonomy/openai.kdl` and `providers/openai.kdl` have orthogonal responsibilities.

### 2. Compile-Time Validation (`bun run gen:compat`)

The `compat-compiler` catches at compile time:

- **Unknown directive/property** → `unknown directive \`typo-xxx\``
- **Duplicate axis in same block** → `axis \`thinking-efforts\` assigned twice in one block`
- **Ambiguous class/family match** → `ambiguous class for \`model-x\`: \`class-a\` and \`class-b\` tie`
- **Ambiguous cascade overlap** → `ambiguous overlap for \`provider/model\` on axis \`thinking-efforts\`: rules \`A\` and \`B\` tie; add an explicit priority`
- **Malformed value shape** → `directive \`thinking-efforts\` has a malformed value`
- **Missing required collapse/discovery** → `missing non-empty \`collapse\` definition`

In hardcoded TS, these only surface in code review or at runtime.

### 3. Mechanical Priority Resolution

The cascade resolver (`packages/catalog/src/compat/cascade.ts#resolveCascade`) resolves **each axis independently**, ranking by tuple:

```text
(model-selector exactness, constrained-dimension count, priority)
```

- **Exactness**: `models` selector has exact match → 2; glob/token → 1; no models selector → 0
- **Dimension count**: Number of present dimensions among class, provider/on, family, revision, models—more = more specific
- **Priority**: Block's `priority=` (default 0), **only for intentional equal-specificity overlaps**

**File order and declaration order never participate in comparison**. Two rules tying on all three components for the same axis → **compile-time error**, forcing author to add `priority=` or rewrite.

This is far more rigorous than "later wins" or "human judgment."

---

## `classifyModel()`: Identity Classification Pipeline

`packages/catalog/src/compat/taxonomy.ts#classifyModel` is the **single entry point for provider + modelId → ModelIdentity**:

```typescript
export function classifyModel(
  provider: string,
  modelId: string,
  opts?: ClassifyOptions
): ModelIdentity
```

### Three-Stage Pipeline

```
provider + modelId
       │
       ▼
┌──────────────────┐
│ 1. Reviewed      │  ── override id="..." provider="..." model="..." logical="..." class="..." family="..." revision="..." effort="..." thinking-variant=#true
│    override?     │     Precise correction; provider-specific beats agnostic; expires-at-ms can expire
└────────┬─────────┘
         │ hit
         ▼
┌──────────────────┐
│ 2. Suffix        │  ── collapseVariantId(provider, model)
│    collapse      │     thinking-suffix / effort-suffix / effort-lane-suffix / routing-variant-suffix
│                  │     Returns { logicalId, effort?, thinkingVariant }
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Class/Family/ │  ── classifyRanks(logicalId)
│    Revision      │     matcher rank: (kindRank, tokenByteLength)
│    ranker        │     family rank: (priority, nonWildcardBytes)
│                  │     revision: prefix parsing + skip-bare
└────────┬─────────┘
         │
         ▼
ModelIdentity { class, family?, revision?, effort?, thinkingVariant?, logicalId? }
```

### Matcher Rank Details (`taxonomy.ts:42-48`)

```typescript
const MATCHER_RANK = {
  exact: 4,      // bare name equals token
  bounded: 3,    // bare name equals token or token + [-_.:0-9]
  namespace: 2,  // some /-segment of full id equals token (or bounded)
  prefix: 1,     // bare name startsWith token
  glob: 0,       // anchored * wildcard
};
```

**Tiebreak**: Same rank → compare `token.length` (byte length), longer wins. Cross-class/family same rank → `AmbiguousIdentityError`.

### Concrete Example: How is `openai/gpt-5.6-luna` Classified?

1. **Override**? None
2. **Collapse**? No suffix match
3. **Class matchers** (`taxonomy/openai.kdl:3-16`):
   - `namespace "openai" bounded=#true` → rank (2, 5) ✓
   - `prefix "gpt-"` → rank (1, 4)
   - `exact "o1"` etc. no match
   → **class = "openai"**
4. **Families** (`taxonomy/openai.kdl:17-31`):
   - `family "gpt" glob="gpt-*"` priority 0, nonWildcardBytes=4
   - `family "codex" glob="*codex*"` priority 10
   - `family "o-series" glob="o1"…` priority 0
   → **family = "gpt"**
5. **Revision** (`taxonomy/openai.kdl:33-37`):
   - `revision prefix="gpt-" anywhere=#true` → extracts `5.6` from `gpt-5.6-luna` → **revision = "5.6.0"**
6. Returns: `{ class: "openai", family: "gpt", revision: "5.6.0", logicalId: "openai/gpt-5.6-luna" }`

---

## `buildModel()` / `resolveModelPolicy()`: KDL → Runtime Resolution

### Compilation Flow: `bun run gen:compat`

```bash
cd packages/catalog
bun run gen:compat
# Runs: scripts/compile-compat.ts → scripts/compat-compiler/index.ts#compileCompatRules
```

**Input**: `rules/taxonomy/*.kdl` + `rules/classes/*.kdl` + `rules/providers/*.kdl` + `rules/runtime/behavior.kdl` (103 .kdl files total)

**Output**: `src/compat/rules.json` (251KB, committed to git)

**Compilation Steps** (`compat-compiler/index.ts:39-54`):

```typescript
const [taxonomy, classes, providers, runtime] = await Promise.all([
  readGroup(rulesDir, "taxonomy"),
  readGroup(rulesDir, "classes"),
  readGroup(rulesDir, "providers"),
  readGroup(rulesDir, "runtime"),
]);
return {
  version: 1,
  files: [...].sort(),
  taxonomy: compileTaxonomy(taxonomy),      // → CompiledTaxonomy
  cascade: compileCascade([...classes, ...providers]), // → CompiledCascade (flat rule list)
  behavior: compileBehavior(behaviorSource), // → CompiledBehavior
};
```

**Key points**:
- `compileCascade` flattens nested KDL (`class → on → family → revision → models`) into a **flat rule list** (`CompiledRule[]`), each carrying `source: "file:line"` diagnostic label
- `compileTaxonomy` produces `CompiledClass[]`, `CompiledCollapse`, `CompiledDiscovery`
- `compileBehavior` produces `CompiledBehavior` (typed accessors consume this directly)

### Runtime Resolution: `resolveModelPolicy(spec)`

`packages/catalog/src/compat/resolve.ts#resolveModelPolicy` is the **single entry point for full model spec resolution**:

```typescript
export function resolveModelPolicy<TApi extends Api>(spec: ModelSpec<TApi>): ResolvedModelPolicy<TApi>
```

**Layered resolution order** (from file header comment):

1. **Unconditional per-API compat defaults** (`detectOpenAICompat` etc.)
2. **Host-derived flags**: URL/provider detection via `hosts.ts` (`modelMatchesHost`), compound host×identity branches, **keyed on ModelIdentity fields, never on model-name matching**
3. **Compat-cascade axes** compiled from `rules/` (pure identity- and provider-keyed policy lives there, not here)
4. **Spec-authored sparse overrides** (`applyCompatOverrides`), then legacy fixups

**Core flow**:

```typescript
const identity = classifyModel(spec.provider, spec.id);  // ← taxonomy
const facts = new IdentityFacts(identity);
const axes = resolveCascade(buildResolveTarget(spec, identity)); // ← cascade
const compat = resolveOpenAICompatPolicy(spec, facts, axes);     // ← per-API detector + axes
const thinking = resolveThinkingPolicy(spec, facts, axes, compat);
return { identity, compat, thinking, catalog: axes.catalog };
```

### `resolveCascade(target)`: Per-Axis Independent Resolution

`packages/catalog/src/compat/cascade.ts#resolveOverIndex`:

```typescript
function resolveOverIndex(index: IndexedRule[], target: ResolveTarget): ResolvedAxes {
  const wire: WinnerTable = {};
  const thinking: WinnerTable = {};
  const catalog: WinnerTable = {};
  let reasoning = target.reasoning;
  // ... reasoning upgrade via exact-efforts rule ...
  for (const rule of index) {
    const rank = rankRule(rule, target, revision, modelLower);
    if (!rank) continue;
    contest(wire, rule.compiled.wire, rank, rule, target);
    contest(catalog, rule.compiled.catalog, rank, rule, target);
    if (reasoning) contest(thinking, rule.compiled.thinking, rank, rule, target);
  }
  return { wire: collect(wire), thinking: collect(thinking), catalog: collect(catalog) };
}
```

**Key design**:
- **Per-axis independent**: wire/thinking/catalog have completely separate winner tables—**no cross-axis interference**
- **Rank function** (`rankRule`):
  ```typescript
  // exactness: 2=exact models match, 1=glob/token, 0=no models selector
  // dimensions: count of class + provider + family + revision + models
  // priority: rule.priority ?? 0
  return [exactness, dimensions, priority];
  ```
- **Contest** (`contest`): Same axis, same rank → `AmbiguousOverlapError` (should be caught at compile time, but runtime guards again)

---

## 60+ Provider Routing: How the Rule Tree Expresses Routing Logic

Routing logic lives in **`runtime/behavior.kdl`**, parsed by `behavior.ts` typed accessors.

### 1. API Routes: `apiRouteFor(provider, model)`

**KDL**:
```kdl
api-routes provider="cloudflare-ai-gateway" {
  route "anthropic-messages" prefix="anthropic/" strip-prefix=#true
  route "openai-completions" prefix="openai/" strip-prefix=#true
  route "openai-completions" prefix="workers-ai/" strip-prefix=#false
}
api-routes provider="github-copilot" default="openai-completions" {
  route "anthropic-messages" glob="claude-haiku-*" glob="claude-sonnet-*" glob="claude-opus-*"
  route "openai-responses" exact="grok-4.5" exact="grok-4.6" prefix="gpt-5" prefix="oswe" prefix="mai-"
}
api-routes provider="zenmux" default="openai-completions" {
  route "anthropic-messages" prefix="anthropic/"
}
```

**Runtime** (`behavior.ts:129-143`):
```typescript
export function apiRouteFor(provider: string, model: string): ApiRouteMatch | undefined {
  const table = behavior.apiRoutes.find(candidate => candidate.provider === provider);
  if (!table) return undefined;
  const lower = model.toLowerCase();
  for (const route of table.routes) {
    if (!matchesList(route.match, model, lower)) continue;
    const out: ApiRouteMatch = { api: route.api };
    if (route.stripPrefix) {
      const prefix = route.match.prefix?.find(candidate => model.startsWith(candidate));
      if (prefix) out.requestModelId = model.slice(prefix.length);
    }
    return out;
  }
  return table.default !== undefined ? { api: table.default } : undefined;
}
```

**Matcher support**: `exact`, `prefix`, `substring`, `glob`, `token` (bounded by non-alphanumeric).

### 2. Quota Tiers: `quotaTierFor(provider, model)`

**KDL**:
```kdl
quota-tiers provider="google-gemini-cli" {
  tier "3-Flash" "gemini-3-flash-preview" "gemini-3-flash" "gemini-3.5-flash"
  tier "Flash" "gemini-2.5-flash" "gemini-2.5-flash-lite" "gemini-2.0-flash" "gemini-1.5-flash"
  tier "Pro" "gemini-2.5-pro" "gemini-3-pro-preview" "gemini-3.1-pro-preview" ...
  fallback "Flash" substring="flash"
  fallback "Pro" substring="pro"
}
quota-tiers provider="openai-codex" {
  tier "spark" "gpt-5.3-codex-spark"
  tier "chat" "gpt-5.3-codex"
  fallback "spark" substring="-spark"
  fallback "chat" substring="gpt-"
}
```

**Runtime**: Exact memberships win; fallback substring preserves quota semantics for newly discovered ids.

### 3. Exclude Models: `isExcludedModel(provider, model)`

**KDL**:
```kdl
exclude-models provider="nanogpt" substring="embedding" substring="image" substring="vision" ...
exclude-models provider="aimlapi" token="audio" token="embed" token="embedding" ...
exclude-models provider="siliconflow" substring="embedding" substring="reranker" substring="bge-" ...
exclude-models provider="amazon-bedrock" prefix="ai21.jamba" prefix="amazon.titan-text-express" ...
```

**Runtime**: Same `matchesList` as `apiRouteFor`.

### 4. Model Limits: `modelLimitsFor(provider, model)`

**KDL**:
```kdl
model-limits provider="github-copilot" {
  limits "claude-opus-4.6" context=168000 max-tokens=32000
  limits "gpt-5.2" context=272000 max-tokens=128000
}
model-limits provider="alibaba-token-plan" {
  limits "qwen3.6-plus" context=1000000 max-tokens=65536
  limits "deepseek-v4-flash" context=1000000 max-tokens=384000
}
```

### 5. Pricing Peer: `pricingPeerFor(provider, model)`

**KDL**:
```kdl
pricing-peer provider="google-antigravity" peers="google" "google-vertex" "anthropic" {
  alias "gemini-3-flash" peer-id="gemini-3-flash-preview"
  alias "claude-opus-4-6" peer-id="claude-opus-4-6@default"
}
pricing-peer provider="xai-oauth" peers="xai" {
  alias "grok-4.20-multi-agent-0309" peer-id="grok-4.20-multi-agent-beta-latest"
}
```

---

## Complete Compilation & Validation Flow Diagram

```
rules/taxonomy/*.kdl (25 files)
rules/classes/*.kdl  (20 files)
rules/providers/*.kdl (60+ files)
rules/runtime/behavior.kdl
         │
         ▼
┌─────────────────────────────────────┐
│  scripts/compat-compiler/           │
│  ├── kdl-reader.ts      (parse + validation)
│  ├── compile-taxonomy.ts (→ CompiledTaxonomy)
│  ├── compile-cascade.ts  (→ CompiledCascade: flat rule list)
│  ├── compile-behavior.ts (→ CompiledBehavior)
│  └── index.ts            (compileCompatRules)
└────────────────┬────────────────────┘
                 │
                 ▼
      src/compat/rules.json (251KB, committed)
      ┌─────────────────────────────────────────────────────────┐
      │ {                                                       │
      │   version: 1,                                           │
      │   files: ["taxonomy/...", "classes/...", ...],          │
      │   taxonomy: { classes: [...], collapse: {...}, ... },   │
      │   cascade: { rules: [ { source, class?, providers?,     │
      │                            family?, revision?, models?, │
      │                            priority?, wire?, thinking?, catalog? } ] }, │
      │   behavior: { openaiResponsesHeuristic?, modelOperations│
      │               cursorEffort?, quotaTiers, hostedDefaults,│
      │               apiRoutes, modelLimits, excludeModels,    │
      │               planRequirements, pricingPeers }          │
      │ }                                                       │
      └─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Runtime (packages/catalog/src/compat/) │
│  ├── taxonomy.ts  → classifyModel(), collapseVariantId(), ... │
│  ├── cascade.ts   → resolveCascade(target)                     │
│  ├── behavior.ts  → apiRouteFor(), quotaTierFor(), ...        │
│  └── resolve.ts   → resolveModelPolicy(spec)                  │
└─────────────────────────────────────┘
```

**Validation Commands**:
```bash
bun test test/compat-compile.test.ts      # rules.json in sync with KDL?
bun test test/compat-parity.test.ts       # engine reproduces every baked models.json value?
bun test test/compat-conformance.test.ts  # rule structure consistency?
bun test test/compat-cascade.test.ts      # cascade resolver logic?
bun test test/compat-taxonomy.test.ts     # taxonomy classification logic?
```

---

## Lessons Learned

1. **KDL isn't for "pretty config files"**—it's a **schema-validated, priority-semantic DSL** where ambiguity, duplicates, unknown directives, and malformed shapes are caught at compile time
2. **Layered ownership is an architectural decision, not file organization**—taxonomy/class/provider/runtime have different owners, change frequencies, and conflict domains; merging them creates chaos
3. **Flat rule list + per-axis independent resolution**—cleaner than nested if-else or priority chains; ambiguity errors out instead of "later wins"
4. **`classifyModel` is the single source of truth for identity**—override → collapse → ranker three-stage pipeline; lenient mode only for discovery normalization, catalog compilation uses strict mode
5. **Behavior heuristics exclusively handle "before/outside exact lookup"**—responses routing, quota tiers, exclude models, api routes, pricing peers… these belong to neither "model lineage truth" nor "deployment contract"; they're discovery-time gatekeepers

---

## References

- `packages/catalog/src/compat/rules/README.md` — Complete KDL grammar, cascade grammar, behavior grammar, vendoring provenance
- `packages/catalog/scripts/compat-compiler/` — Full compiler implementation (kdl-reader, compile-taxonomy, compile-cascade, compile-behavior)
- `packages/catalog/src/compat/taxonomy.ts` — `classifyModel`, `collapseVariantId`, `stripThinkingVariantSuffix`, identity override, discovery vocabulary
- `packages/catalog/src/compat/cascade.ts` — `resolveCascade`, `rankRule`, `contest`, `AmbiguousOverlapError`
- `packages/catalog/src/compat/behavior.ts` — `apiRouteFor`, `quotaTierFor`, `isExcludedModel`, `modelLimitsFor`, `planRequirementFor`, `pricingPeerFor`, `hostedDefaultModel`, `modelOperationOverrides`, `cursorEffortSuffix`
- `packages/catalog/src/compat/resolve.ts` — `resolveModelPolicy`, layered resolution order, `IdentityFacts`, per-API detectors
- `packages/catalog/src/compat/types.ts` — `CompiledCompatRules`, `CompiledCascade`, `CompiledRule`, `CompiledTaxonomy`, `CompiledBehavior`, `ModelIdentity`, `ResolveTarget`, `ResolvedAxes`

---

*Part of [OMP Internals Deep Dive](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) series, post 7. Next: OMP session tree & subagent isolation (forthcoming)*