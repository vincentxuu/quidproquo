---
title: "Learning Design from Mature Coding Agents (35): Model Catalogs and Per-Role Routing — looplane's Role Aliases and Reviewer Lane"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 35
tags: [coding-agent, model-routing, llm, looplane, oh-my-pi, codex]
lang: en
tldr: "looplane now has static ModelRole/ModelRoute candidates, opt-in aliases such as --model @cheap, cross-provider fallback, and a no-tool reviewer lane that runs after verification. Role inheritance/override rules and automatic summarizer, parser, or scout routing remain open."
description: "Comparing model catalogs and per-role routing across mature coding agents, including looplane's implemented role aliases, fallback, and reviewer-lane baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-model-catalog-routing)

Halfway through part two of this series, this post covers a capability that sounds like a configuration problem but is really an architecture problem: how to manage the model catalog, and how to decide which model handles which task. Evidence sources as usual: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community-decompiled v2.1.88). Every `file#symbol` reference below was grepped from my local clones.

## The capability gap: one model for everything is an illusion

Anyone who has built an agent knows the main conversation model is not the only LLM consumer. Commit message generation, conversation titles, context summarization, subagents, second-opinion reviews — these tasks differ wildly in difficulty from the main loop, yet they often share the same most-expensive model. The result is either wasted money or degraded quality everywhere.

So "multi-provider support" is just the entry ticket. The real capabilities are two:

1. **A catalog data layer**: the system knows which providers expose which models and what each supports (context window, reasoning, vision), and that data stays fresh.
2. **Per-role routing**: strategies like "cheap fast model for commits, strong model for planning, smallest for summaries" are first-class citizens rather than hardcoded strings scattered around.

looplane has moved beyond a single "current model": catalog data, role aliases, fallback, and a reviewer lane all have first implementations. Automatic per-role routing remains partial, as detailed below.

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

## The baseline now implemented in looplane

Beyond the data layer, `provider_catalog.py` now defines `ModelRole`, `ModelRoute`, and ordered `role_candidates()`. Native CLI users can opt into aliases such as `--model @cheap` and `--fallback-model @cheap`, resolving roles to explicit provider/model pairs. Retry exhaustion can switch providers without reusing the primary model's custom API endpoint.

The first independent role lane is `--auto-review`: only after editing and verification succeed does Looplane send the patch to a no-tool reviewer model, persist `review.md`, emit `role_lane.*` events, and attribute usage/cost per lane. External runtime selectors remain owned by their runtimes rather than silently inheriting native aliases.

This is not yet a complete per-role router. Role inheritance/override rules remain unsettled, and summarizer, parser, and scout lanes are not automatically selected. The static candidate table and reviewer lane are an opt-in, testable baseline.

## References

- [looplane model roles and pricing catalog at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/provider_catalog.py)
- [looplane role-lane SDK documentation at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/docs/sdk.md)

- [FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance (Chen et al., 2023)](https://arxiv.org/abs/2305.05176)
- [RouteLLM: Learning to Route LLMs with Preference Data (Ong et al., 2024)](https://arxiv.org/abs/2406.18665)
- [OpenRouter Provider Routing docs](https://openrouter.ai/docs/features/provider-routing)
- [LiteLLM Router: multi-provider fallback design reference](https://docs.litellm.ai/docs/routing)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
