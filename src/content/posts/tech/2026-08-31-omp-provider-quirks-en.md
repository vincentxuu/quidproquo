---
title: "OMP Internals (8): Provider Quirks & Compat Layer — Why KDL Rules, Not TypeScript"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, oh-my-pi, coding-agent, provider-compat, kdl, harmony, reasoning-effort]
lang: en
description: "Deep dive into how OMP isolates provider-specific wire quirks via KDL rule trees: OpenAI reasoning effort ladders, Anthropic prompt cache breakpoints, Gemini manifest extensions, GPT-5 Harmony protocol leak detection and recovery."
tldr: "OMP encodes all provider-specific wire behaviors as KDL rules, compiled to JSON and applied by a pure cascade resolver — avoiding TS if-else sprawl, enabling static conflict detection at CI, and making behavior versionable."
series:
  name: "OMP Internals Deep Dive"
  order: 8
---

## TL;DR

OMP (oh-my-pi) supports dozens of LLM providers, each with unique wire contract deviations: OpenAI's reasoning effort ladders, Anthropic's `cache_control` breakpoints, Gemini's `thinkingConfig` + `systemInstruction` structure, GPT-5 Harmony protocol's control-token leak. Hardcoding these in TypeScript causes:

1. **Condition explosion**: `if (provider === "openai" && model.startsWith("gpt-5") && baseUrl.includes("api.openai.com")) …` scattered everywhere
2. **No static verification**: Rule conflicts only surface at runtime
3. **No versioning**: Provider behavior changes can't be tracked or rolled back

OMP's solution: **All provider quirks live in KDL rules**, compiled by `scripts/compat-compiler` to `rules.json`, with runtime executing a pure `resolveCascade(target)` function. Rules key on `(class, provider, family, revision, models)` — **last-write-wins with same-rank conflict detection** — catching ambiguous overlaps at CI.

---

## Context

When building a coding agent supporting:

- Official OpenAI `/v1/chat/completions` & `/v1/responses`
- Azure OpenAI (deployment name mapping, `api-version` query param)
- OpenAI-compatible gateways: OpenRouter, Groq, Cerebras, Fireworks, Together, etc.
- Anthropic Messages API (official, Bedrock, Vertex, GitHub Copilot, ZenMux)
- Google Gemini (Generative AI, Vertex AI, Cloud Code Assist)
- OpenAI Codex (ChatGPT Plus/Pro subscription, OAuth, WebSocket/SSE dual transport)
- Dozens of local inference backends (llama.cpp, vLLM, Ollama, LM Studio)

Each provider diverges subtly on **wire format**, **stream events**, **auth headers**, **tool call structure**, **reasoning params**, **prompt caching**. Examples:

| Provider | Quirk |
|----------|-------|
| OpenAI gpt-5.6+ | `reasoning_effort: "none"` rejected; must send `reasoning: { effort: "none" }` or omit entirely |
| OpenRouter | Same model runs on different backends; `reasoning_effort` support varies → needs 400 fallback |
| Anthropic | Official API takes `cache_control: { type: "ephemeral", ttl: "1h" }`; Bedrock/Vertex enforce thinking-block signatures |
| Gemini 2.5+ | `thinkingConfig: { thinkingBudget: 12000 }` (budget mode); Gemini 3 uses `thinkingLevel` |
| GPT-5 (Harmony) | Model occasionally leaks `to=functions.edit code …` (unbracketed routing tokens) into tool args |

Hardcoding `if-else` in TS becomes unmaintainable within months.

---

## Problem

### 1. How to Express OpenAI Reasoning Effort Ladders?

OpenAI officially defines `minimal | low | medium | high`, but reality:

- **GPT-5.6+** adds `xhigh`, `max` → five tiers
- **OpenRouter GLM-5.2** supports `xhigh` but clamps `max → high`
- **Kimi K3 / DeepSeek V4 Flash** only `low | high | max` (three tiers)
- **Z.ai GLM-5.2 / Umans / Baseten** only `high | max` (two tiers)
- **Fireworks / Ollama** have custom mappings

Can't hardcode — **same model behaves differently on different gateways**.

### 2. Anthropic Prompt Cache Breakpoints

Anthropic official API supports attaching `cache_control: { type: "ephemeral", ttl: "1h" }` to the last content block of the trailing two turns. But:

- **Bedrock / Vertex / Azure Foundry** proxying Anthropic **enforce thinking-block signatures** — can't freely inject cache breakpoints
- **GitHub Copilot / ZenMux / Cloudflare AI Gateway** same enforcement
- Non-official endpoints reject or ignore `cache_control`

### 3. Gemini Manifest Extensions

Gemini's `generateContent` request structure differs entirely from OpenAI:

```json
{
  "systemInstruction": { "parts": [{ "text": "..." }] },
  "tools": [{ "functionDeclarations": [...] }],
  "generationConfig": {
    "thinkingConfig": { "thinkingLevel": "HIGH" }  // or thinkingBudget
  }
}
```

- **Gemini 2.x** uses `thinkingBudget` (token count)
- **Gemini 3** uses `thinkingLevel` (`MINIMAL | LOW | MEDIUM | HIGH`)
- **Vertex AI** rejects `functionCall.id` / `functionResponse.id`
- **Cloud Code Assist** requires `includeThoughts: false` with level/budget to disable thinking

### 4. GPT-5 Harmony Leak

GPT-5 series uses Harmony protocol framing for tool calls:

```
<|start|>assistant<|channel|>commentary to=functions.edit<|message|>{ARGS}<|call|>
```

**Defect**: While generating `{ARGS}`, logit mask suppresses control tokens (`<|channel|>`, `<|message|>`, `<|call|>`), causing probability mass to "leak" onto unbracketed plain-text forms:

```
analysis to=functions.edit code above content… (mixed with Chinese gambling spam, fake tool result framing)
```

This gets written directly to files (via `edit` tool's patch DSL) or pollutes `eval` cells. Stats show gpt-5.4 at **~163 ppm** leak rate.

---

## Attempts

### Attempt 1: Centralized TS Conditionals (Failed)

Early versions stuffed `buildOpenAICompat.ts`, `buildAnthropicCompat.ts` with `if (model.id.startsWith("gpt-5"))`. Problems:

- Adding providers required touching core files
- Same model + different gateway = different behavior; model ID insufficient
- No unit testing for "rule conflicts"

### Attempt 2: JSON Schema Compat Flags (Failed)

Switched to `model.compat.supportsReasoningEffort = true` boolean flags. Problems:

- Can't express enum-valued policies like "GPT-5.6 uses `none-effort`, GPT-5.5 uses `lowest-effort`"
- Can't express **effort maps** (`minimal → low`, `xhigh → high`)
- Version boundaries (`revision >= 5.6`) stuck in code

### Attempt 3: KDL Rule Tree + Cascade Resolver (Success)

Inspired by Rust `cascade.rs`, designed **three namespaces**:

| Namespace | Purpose | Examples |
|-----------|---------|----------|
| `wire` | Request/response compat flags, effort maps, stream timeouts | `supportsReasoningEffort`, `reasoningEffortMap`, `streamIdleTimeoutMs` |
| `thinking` | Thinking control surface: mode, ladder, default level, effort map | `thinking-mode "effort"`, `thinking-efforts "low" "high" "max"` |
| `catalog` | Pricing, context window, tool type metadata | `long-context-cost`, `apply-patch-tool-type "freeform"` |

Rules live in `packages/catalog/src/compat/rules/providers/*.kdl`, compiled with validation:

- Directives must exist in `AXES` table (`packages/catalog/src/compat/axes.ts`)
- Values must match closed vocabularies (e.g., `thinking-mode` ∈ `effort | budget | google-level | anthropic-adaptive | anthropic-budget-effort`)
- Same axis contested by two same-rank rules → **CI compile-time `AmbiguousOverlapError`**

---

## Solution

### 1. How KDL Rules Are Written

Example `openai.kdl`:

```kdl
provider "openai" {
    thinking-mode "effort"
    class "unknown" {
        revision ">=5.6 <5.7" {
            reasoning-disable-mode "none-effort"
            thinking-efforts "low" "medium" "high" "xhigh" "max"
        }
        revision ">=5 <6" {
            apply-patch-tool-type "freeform"
        }
    }
    // residue: taxonomy ranks and exact globs do not isolate these models.
    models "codex-mini-latest" "gpt-realtime-2.1" {
        thinking-efforts "minimal" "low" "medium" "high" "xhigh"
    }
    class "openai" {
        family "gpt" {
            revision "=5.6" {
                reasoning-disable-mode "none-effort"
            }
        }
        revision ">=5 <6" {
            apply-patch-tool-type "freeform"
        }
    }
    models "daybreak-blue-latest" "gpt-5.6" "gpt-5.6-sol*" {
        long-context-cost {
            inputThreshold 272000
            input 10.0
            output 45.0
            cacheRead 1.0
            cacheWrite 12.5
        }
    }
}
```

**Key design points**:

- **`class` / `family` / `revision`** = structured selectors, no model ID string matching
- **`models`** = residue fallback for rolling aliases taxonomy can't classify (e.g., `daybreak-blue-latest`)
- **`thinking-mode "effort"`** declares OpenAI-style effort ladder for this provider
- **`reasoning-disable-mode`** distinguishes wire behavior when disabling reasoning:
  - `"none-effort"`: send `reasoning: { effort: "none" }` (GPT-5.6+)
  - `"lowest-effort"`: send `reasoning_effort: "minimal"` (legacy)
  - `"openrouter-enabled-false"`: send `reasoning: { enabled: false }` (OpenRouter)
  - `"zai-thinking-disabled"`: send extra body `thinking: { type: "enabled" }` to disable (Z.ai/Kimi)

### 2. How Cascade Resolver Applies Rules

`packages/catalog/src/compat/cascade.ts:188` `resolveCascade(target)`:

```typescript
function resolveCascade(target: ResolveTarget): ResolvedAxes {
  // 1. Build rule index (once at compile time)
  // 2. Score each rule: rank = (exactness, dimensions, priority)
  //    - exactness: 2=exact model match, 1=glob match, 0=no models selector
  //    - dimensions: count of selector dims (class, provider, family, revision, models)
  //    - priority: explicit KDL priority
  // 3. Same axis, same rank → throw AmbiguousOverlapError
  // 4. Return { wire, thinking, catalog } resolved assignments
}
```

**Ranking example**:

| Rule | Selectors | Exactness | Dimensions | Priority | Rank |
|------|-----------|-----------|------------|----------|------|
| `class "openai" family "gpt" revision "=5.6"` | class+family+revision | 0 | 3 | 0 | (0,3,0) |
| `models "gpt-5.6" "gpt-5.6-sol*"` | models (glob) | 1 | 1 | 0 | (1,1,0) **wins** |
| `models "gpt-5.6-cyber"` | models (exact) | 2 | 1 | 0 | (2,1,0) **wins** |

**Last-write-wins with conflict detection**: Same rank by file order, **but same-rank different-value = compile error**, forcing explicit `priority=`.

### 3. Runtime Usage

`packages/catalog/src/compat/resolve.ts:1227` `resolveModelPolicy(spec)`:

```typescript
export function resolveModelPolicy<TApi extends Api>(spec: ModelSpec<TApi>) {
  const identity = resolveIdentity(spec)        // taxonomy: class, family, revision
  const facts = new IdentityFacts(identity)     // helpers: revGte, is(), family()
  const axes = resolveCascade(buildResolveTarget(spec, identity))  // KDL results
  
  // Layer 1+2: detected baseline (URL/host-based, still in TS)
  const compat = detectOpenAICompat(spec, d)    // or detectAnthropicCompat etc.
  
  // Layer 3: KDL cascade axes override
  applyWireAxes(compat, axes.wire, api)
  applyCompatOverrides(compat, spec.compat)     // Layer 4: spec-authored overrides
  
  // Layer 5: Thinking metadata resolution
  const thinking = resolveThinkingPolicy(spec, facts, axes, compat)
  
  return { identity, compat, thinking, catalog: axes.catalog }
}
```

**Layering summary**:

| Layer | Source | Overridable? |
|-------|--------|--------------|
| 1 | API-level unconditional defaults | Yes |
| 2 | Host/URL detection (`hosts.ts`) | Yes |
| 3 | **KDL cascade (rules/)** | **Yes, highest priority** |
| 4 | Spec-authored sparse overrides (`spec.compat`) | Yes |
| 5 | Legacy builder fixups | — |

---

## Why This Design

### Why Not TypeScript `if-else`?

1. **Open-world assumption**: Provider behavior changes anytime; new gateways appear. KDL is **data** — hot-reloadable, version-controllable, greppable.
2. **Static validation**: `scripts/compat-compiler` at build time validates:
   - Unknown directives
   - Values outside closed vocabularies
   - Ambiguous overlaps (same axis, same rank conflict)
3. **Single responsibility**: `resolve.ts` is a **pure function** `identity → policy` — no side effects, trivial to test.
4. **Auditability**: `rules.json` is a complete snapshot; `git diff` shows "GPT-5.6 added xhigh tier" changes.

### Why Three Namespaces: `wire` / `thinking` / `catalog`?

- **Wire axes** map directly to transport layer (`openai-completions.ts`, `anthropic.ts`) — decide request building, stream parsing
- **Thinking axes** drive UI: which effort menu, default value, effort→wire-value mapping
- **Catalog axes** only affect `models.json` generation (pricing, context window, tool type) — **zero runtime impact**

Transport layer imports `ResolvedOpenAICompat`; **TypeScript ensures only wire axes are readable**, preventing accidental reads of `long-context-cost`.

### Why `models` Selector as Fallback, Not Primary?

Taxonomy (`packages/catalog/src/compat/taxonomy.ts`) parses **any model ID** into structured `{class, family, revision, effort, thinkingVariant}`. Rules should target **class/family/revision** because:

- New versions of same family auto-inherit rules
- Rolling aliases (`gpt-5.6-latest`) work without rule updates
- `models` handles only the few residue cases taxonomy **cannot distinguish** (e.g., Daybreak series lacking `gpt-` prefix)

---

## Lessons Learned

1. **Provider quirks are data, not code**. Encoding "GPT-5.6 uses `none-effort`" as a KDL rule is safer and more portable than `if (revision === "5.6")`.
2. **Cascade resolver = pure function + static ranking**. Eliminates runtime ordering dependencies; CI catches conflicts.
3. **Identity-based matching > string matching**. `class "openai" family "gpt" revision ">=5.6"` auto-applies to new models; `models "gpt-5.6*"` requires maintenance.
4. **Residue models need comments**. Every `models` block has a `// residue:` comment forcing the author to explain "why taxonomy can't split this" — prevents abuse.
5. **Harmony leak requires architectural defense**. Can't just handle in `edit` tool — must scan **assistant text / thinking / tool args** at the agent loop level, supporting both **truncate-resume** (hashline DSL) and **abort-retry** (JSON schema) recovery paths.

---

## References

- [oh-my-pi: compat rules (KDL)](https://github.com/xiaoxu199/oh-my-pi/tree/main/packages/catalog/src/compat/rules/providers)
- [oh-my-pi: compat resolver (resolve.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/resolve.ts)
- [oh-my-pi: cascade resolver (cascade.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/cascade.ts)
- [oh-my-pi: axes vocabulary (axes.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/axes.ts)
- [oh-my-pi: ERRATA-GPT5-HARMONY.md](https://github.com/xiaoxu199/oh-my-pi/blob/main/docs/ERRATA-GPT5-HARMONY.md)
- [oh-my-pi: harmony-leak.ts](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/ai/src/utils/harmony-leak.ts)
- [oh-my-pi: provider-quirks.md](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/docs/provider-quirks.md)
- [oh-my-pi: model-thinking.ts](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/model-thinking.ts)