---
title: "Learning Design from Mature Coding Agents (35): Model Catalogs and Per-Role Multi-Provider Routing — a capability all five have and rivumi doesn't"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 35
tags: [coding-agent, model-routing, llm, rivumi, oh-my-pi, codex]
lang: en
tldr: "omp splits 'which model' into ten roles, each with a cross-provider fallback chain; codex ships its model catalog from the server, versioned together with the system prompt; opencode and claude-code both have dedicated resolution paths for small models. rivumi has a static provider catalog and disk-cached model listings, but the whole program only knows 'the current model' — role routing and fallback chains are the next most cost-effective gap on the improvement roadmap."
description: "Comparing the catalog data layer and per-role routing strategies of pi, omp, opencode, codex, and claude-code, with a design draft for rivumi."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-model-catalog-routing)

Halfway through part two of this series, this post covers a capability that sounds like a configuration problem but is really an architecture problem: how to manage the model catalog, and how to decide which model handles which task. Evidence sources as usual: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community-decompiled v2.1.88). Every `file#symbol` reference below was grepped from my local clones.

## The capability gap: one model for everything is an illusion

Anyone who has built an agent knows the main conversation model is not the only LLM consumer. Commit message generation, conversation titles, context summarization, subagents, second-opinion reviews — these tasks differ wildly in difficulty from the main loop, yet they often share the same most-expensive model. The result is either wasted money or degraded quality everywhere.

So "multi-provider support" is just the entry ticket. The real capabilities are two:

1. **A catalog data layer**: the system knows which providers expose which models and what each supports (context window, reasoning, vision), and that data stays fresh.
2. **Per-role routing**: strategies like "cheap fast model for commits, strong model for planning, smallest for summaries" are first-class citizens rather than hardcoded strings scattered around.

rivumi currently has half of each — details below.

## What the five do

### pi: the catalog is data, the provider is an interface

Post #5 covered pi's ModelProvider abstraction; here I only add the data layer. `pi-mono/packages/ai/src/models.ts#Provider` defines `getModels()` returning the full catalog synchronously, with an optional `refreshModels()` for dynamic providers — synchronous reads always get the last refreshed snapshot, network refreshes are async and allowed to fail (one dead provider doesn't drag down the rest). One notable fact: pi itself has **no** role concept; that grew after the omp fork.

### omp: catalog as a standalone package, role routing as a resolution pipeline

omp extracted the catalog into its own package, `packages/catalog`, in three layers:

- **Discovery**: `oh-my-pi/packages/catalog/src/discovery/openai-compatible.ts#DEFAULT_OPENAI_COMPATIBLE_DISCOVERY_TIMEOUT_MS` bounds `/models` probes at 10 seconds; the comment states plainly that without this bound a stalled endpoint blocked startup's awaited discovery pass indefinitely.
- **Identity classification**: `oh-my-pi/packages/catalog/src/identity/classify.ts#ParsedModel` parses any model id into a family/kind/version structure (gemini/anthropic/openai/glm families). Everything downstream — thinking-level caps, tokenizer choice — builds on the classification instead of string comparison.
- **Model equivalence**: the same logical model appears under different ids across providers (`X`/`X-thinking` pairs, aggregator date-suffix variants). `oh-my-pi/packages/catalog/src/variant-collapse.ts#collapseEffortVariants` collapses effort-tier variants into one logical model — but price-divergent twins stay separate, because, in the comment's words, "billing attribution never lies." The crudest equivalence check lives in `oh-my-pi/packages/catalog/src/models.ts#modelsAreEqual`: same id AND same provider, or it's a different model.

Role routing lives in the coding-agent package. `oh-my-pi/packages/coding-agent/src/config/model-roles.ts#MODEL_ROLES` defines ten built-in roles: default, smol (fast), slow (thinking), vision, plan, designer, commit, tiny, task, advisor. Each can be overridden by settings; unconfigured roles fall through the candidate chains in `oh-my-pi/packages/coding-agent/src/priority.json` — the smol chain runs from cerebras GLM down through every vendor's flash/haiku/mini, the slow chain is all gpt-5.x and opus.

The resolution entry point, `oh-my-pi/packages/coding-agent/src/config/model-resolver.ts#resolveModelRoleValue`, expands a role into an ordered pattern list and tries them in order; the first match against an available model wins. Three engineering details worth stealing:

- **The provider lock**: `model-resolver.ts#isProviderLockedCrossMatch` handles a nasty case — you type `anthropic/claude-opus-5` but the anthropic provider has no credentials, so the raw-id fallback silently re-routes you onto the same-named model on OpenRouter, billed at OpenRouter's list prices. omp's fix: if the named provider carries exactly that id in the bundled catalog, fail instead of shadowing.
- **Aggregator upstream routing**: `model-resolver.ts#splitUpstreamRouting` supports syntax like `openrouter/z-ai/glm-4.7@cerebras`, pinning requests to a specific upstream.
- **Fallback chains follow the role**: `oh-my-pi/packages/coding-agent/src/task/executor.ts#installSubagentRetryFallbackChain` shows that spawning a subagent carries its own role's `retry.fallbackChains` chain along, with a comment warning that deriving the two halves separately "is how they drift apart" — routing identity and retry chain must share one source.

### opencode: three-stage small-model resolution

`opencode/packages/opencode/src/provider/provider.ts#getSmallModel` is a clean minimal example: check the user's configured `small_model` first, then give plugins an `experimental.provider.small_model` interception hook, then pick by `smallModelFamilyPriority` family preference within that provider's models. The stage ordering IS the extensibility ordering: user > plugin > heuristic.

### codex: the catalog comes from the server, prompts version-controlled with it

codex takes a completely different path: `codex-rs/models-manager/models.json` describes each model's slug, context window, truncation policy, and tool mode, while `codex-rs/models-manager/src/manager.rs#ModelsEndpointClient` defines a remote refresh interface — the catalog can update from a backend API, with local models.json as just the cache seed. `manager.rs#RefreshStrategy` distinguishes Online/Offline/OnlineIfUncached, and the disk cache TTL is 300 seconds.

The most interesting part: prompts are bound to the catalog too. `codex-rs/models-manager/src/model_info.rs#BASE_INSTRUCTIONS` uses `include_str!` to compile `prompt.md` into the binary, and `codex-rs/models-manager/src/config.rs#base_instructions` allows per-model overrides. The insight: the system prompt is part of a model's capability surface — a new model may need new base instructions, and that coupling shouldn't hide in deployment scripts.

### claude-code: the env var is the escape hatch

The simplest, most pragmatic entry in the decompiled source: `claude-code/src/utils/model/model.ts#getSmallFastModel` is one line — use `ANTHROPIC_SMALL_FAST_MODEL` if set, otherwise the default Haiku. Main-model resolution (same file's `getUserSpecifiedModelSetting`) has the full priority order: in-session override > CLI flag > env var > settings. claude-code has nothing like omp's ten-role system, but the "small tasks go to the small model" boundary exists too — expressed via env var instead of config tables.

## Why this design: engineering rationale

Model routing is not premature optimization. [FrugalGPT](https://arxiv.org/abs/2305.05176) demonstrated back in 2023 that cascade-style routing cuts cost substantially while preserving quality; [RouteLLM](https://arxiv.org/abs/2406.18665) turned "which queries don't need the strongest model" into a learnable problem. None of the five implement learned routing — they use a more conservative version: **hand-curated role → candidate chains, plus runtime health-based elimination**. That's sound engineering judgment: a coding agent's task types are few and enumerable (commit, summary, planning, main loop), static chains beat black-box routers on predictability and debuggability, and fallback chains already capture most of the savings. OpenRouter's own [provider routing docs](https://openrouter.ai/docs/features/provider-routing) follow the same philosophy: declare a preference order, let the runtime handle failover.

## Design draft for rivumi

First, the honest current state. The data layer has two pieces:

- `src/rivumi/provider_catalog.py#OPENAI_COMPATIBLE_BASE_URLS`: fixed endpoints for nine OpenAI-compatible providers, plus `RESPONSES_PROTOCOL_MODELS` handling protocol split-off for models that only speak the Responses API (`uses_responses_protocol`).
- `src/rivumi/model_catalog.py#CatalogSnapshot`: per-provider disk cache of model listings, one-day TTL, stale-while-revalidate, keyed by credential fingerprint. `default_model()` picks defaults via family preferences in `_PROVIDER_BRAND_PATTERNS`.

The routing layer does not exist. The TUI's Ctrl+L (the `ctrl+l` binding in `src/rivumi/tui.py`) offers bounded choices for switching, defaulting to the runtime-first Automatic — external CLI backends let the runtime choose the model. The entire native path has only "the current model": no roles, no chains. The concrete gaps: auxiliary tasks like summaries and titles would be forced onto the main model; when the main model hits 429s or rate limits, the native path has only the single-provider retry from post #6 — no cross-provider escape route.

If built, the draft:

**Step one: a role table, not a router.** Add `src/rivumi/model_roles.py` defining just four roles: `main`, `aux` (summaries/titles and similar helper tasks), `fast`, `fallback`. Follow omp's priority.json shape: an ordered pattern list per role (`provider/model-id` format, bare ids allowed); resolution picks the first candidate whose credentials exist and whose provider is reachable. Skip fuzzy matching and globs initially — omp's five-stage `matchModel` pipeline was forced into existence by hundreds of providers; nine providers only need exact matching.

**Step two: hang fallback chains off the existing retry policy.** Post #6's NVIDIA NIM retry hardening already classifies errors; wire the "retries exhausted" exit to the next candidate in the role's chain. No new mechanism needed. Key discipline from omp: the chain's identity follows the role — carry the whole chain along when spawning subagents or opening conversations, so the main model never switches while its fallback still points at the old one.

**Step three: start equivalence checks at the crudest level.** Copy `modelsAreEqual`: provider + exact id equality, nothing more. Leave `X-thinking` pair collapsing until it actually hurts — today's free-model lists haven't produced that pain yet.

**What not to do**: learned routing, dynamic cost optimization, server-delivered catalogs (codex's approach needs a backend; rivumi has none). External CLI backends, per M13 convention, get explicitly marked "model selection owned by the runtime"; role routing covers only the native path.

## Fitting into the existing architecture

This cell has high ROI precisely because the foundations exist: provider abstraction was post #5, retry and error classification post #6, the disk-cache pattern validated in the startup-performance piece — role routing just stitches those three together with one settings table. The genuinely new work is two things: admitting "different tasks deserve different models" as a first-class concept, and changing "current model" from a single value to a role mapping without breaking the existing Ctrl+L UX (what Ctrl+L switches is really the `main` role; other roles start hidden in user config).

The lesson from all five compresses into one sentence: **the value of a routing strategy is not cleverness — it is predictable behavior when things fail.** omp's provider lock, codex's prompt-catalog binding, opencode's three-stage resolution: all exist so that "which model took this request" has an answer at every moment.

## References

- [FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance (Chen et al., 2023)](https://arxiv.org/abs/2305.05176)
- [RouteLLM: Learning to Route LLMs with Preference Data (Ong et al., 2024)](https://arxiv.org/abs/2406.18665)
- [OpenRouter Provider Routing docs](https://openrouter.ai/docs/features/provider-routing)
- [LiteLLM Router: multi-provider fallback design reference](https://docs.litellm.ai/docs/routing)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
