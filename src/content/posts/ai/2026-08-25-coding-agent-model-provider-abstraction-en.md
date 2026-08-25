---
title: "Learning Design from Mature Coding Agents (6): The ModelProvider Abstraction — Why Wrapping an SDK Is Not Enough"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 6
tags: [coding-agent, harness-engineering, llm-api, provider-abstraction, error-handling, llm-agents]
lang: en
description: "How pi, OMP, OpenCode, Codex, and Claude Code design their ModelProvider abstraction — separating wire protocol from provider identity, normalizing usage, classifying errors — compared with rivumi's canonical contracts and six wire-protocol adapters."
tldr: "Wrapping an SDK directly buys you three walls within months: usage fields that don't agree, error semantics tied to SDK exception types, and tool-call formats that change per provider. All five reference projects separate 'wire protocol' from 'provider identity' as independent dimensions. Rivumi goes further with pydantic canonical contracts (Message/ToolCall/Usage/ModelTurn) plus six protocol adapters, forces the OpenAI SDK's built-in retries to zero, and routes every failure through a classified ProviderErrorKind before any retry policy sees it. Its provider table is deliberately copied from pi's packages/ai — lineage, not coincidence."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-model-provider-abstraction)

## The design problem

The first version of a coding agent usually looks like this: wrap `openai.chat.completions.create(...)` in a function, ship it. Three months later you want a second provider, and you hit three walls.

Wall one is **usage normalization**. OpenAI Chat Completions returns `prompt_tokens`/`completion_tokens`; the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) excludes cache reads from `input_tokens` and reports cache read/write as separate fields; Gemini uses `usageMetadata.promptTokenCount`. Your cost tracking, context budgeting, and token-limit logic all sit on these fields — if the semantics disagree, the numbers can't be compared.

Wall two is **error classification**. Should a 429 be retried? A 401? Does a timeout count as retryable? Every SDK throws its own exception types (OpenAI's `APIStatusError`, httpx's exceptions, custom formats from gateways). If the agent loop catches them directly, your retry policy is welded to SDK implementation details.

Wall three is **switching cost**. Tool calls come in three shapes across three vendors: OpenAI packs arguments into a JSON string, Anthropic uses structured blocks, Gemini puts them in functionCall parts. System messages live in different places. Without a canonical intermediate representation, switching providers means rewriting the loop.

So the real question isn't "how do we wrap the SDK" — it's **which things get promoted into a normalized contract, and which are left to adapters to translate**.

## What the five do

### pi: protocol as a first-class citizen, auth as part of the provider

pi's packages/ai is the most complete provider abstraction among the five. It defines wire protocols as a closed union (`pi-mono/packages/ai/src/types.ts#KnownApi`): `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`, `bedrock-converse-stream`, and more — one API implementation per protocol. Then `pi-mono/packages/ai/src/models.ts#Provider` requires every provider to declare id, baseUrl, auth, model catalog, and api. Note how blunt its own docs are: "Every provider has auth semantics" — even ambient env-var credentials must be explicit. Auth resolution is fully separated from request dispatch (`pi-mono/packages/ai/src/models.ts#Models.getAuth`), returning structured errors with codes when OAuth refresh fails instead of blowing up mid-stream. The normalized `Usage` type (`pi-mono/packages/ai/src/types.ts#Usage`) pins down cacheRead/cacheWrite/reasoning precisely, including the comment that reasoning is a subset of output. `StopReason` collapses to seven fixed values, so the agent loop never faces each vendor's finish-reason dialects.

### OMP: building a 69-provider catalog on pi's foundation

OMP (oh-my-pi) inherits pi's abstraction and pushes it to the extreme: `oh-my-pi/packages/catalog/src/provider-models/descriptors.ts#CATALOG_PROVIDERS` lists nearly 70 provider entries, each carrying a default model, env key names, and whether dynamic discovery is authoritative (`dynamicModelsAuthoritative`). Another detail worth stealing lives in `oh-my-pi/packages/catalog/src/identity/classify.ts#parseKnownModel`: the model id string alone parses into a family (gemini/anthropic/openai/glm) plus variant, so upper-layer rules work even without consulting the provider table.

### OpenCode: models.dev as the catalog, custom loaders for the weird ones

OpenCode takes a different route: model metadata lives centrally in the external [models.dev](https://models.dev) catalog (imported at the top of `opencode/packages/opencode/src/provider/provider.ts`), and locally it only writes bespoke loaders for genuinely special providers — azure, amazon-bedrock, google-vertex, cloudflare-workers-ai, github-copilot, snowflake-cortex, all hung off one loader table (`opencode/packages/opencode/src/provider/provider.ts#custom`). Common cases eat the catalog; special cases eat code. Small maintenance surface.

### Codex: the opposite pole — one wire only

Codex is the most instructive counterexample. Its provider config (`codex/codex-rs/model-provider-info/src/lib.rs#ModelProviderInfo`) accepts baseUrl, env keys, and retry parameters — looks flexible — but `codex/codex-rs/model-provider-info/src/lib.rs#WireApi` removed chat completions outright: writing `wire_api = "chat"` in config returns an error message telling you to switch to `"responses"`, with a link to their discussion thread. Single vendor, single wire protocol, so the abstraction shrinks dramatically — and in exchange, request shaping and SSE parsing can go deep. The lesson: abstraction complexity should scale with the number of providers you actually support.

### Claude Code: no provider abstraction at all, just perspective switches

Claude Code (decompiled v2.1.88) doesn't do multi-provider. As an Anthropic-only CLI, the "provider" dimension reduces to deployment channel: `claude-code-source/src/utils/model/providers.ts#getAPIProvider` picks firstParty, bedrock, vertex, or foundry from environment variables. Model switching is alias resolution — users pick opus/sonnet/haiku, and `claude-code-source/src/utils/model/model.ts#getMainLoopModel` plus `firstPartyNameToCanonical` map aliases to concrete models, with a separate main-loop vs small-fast split. The subscription path rides OAuth: `claude-code-source/src/services/oauth/client.ts#refreshOAuthToken` handles token refresh and profile sync. Its existence proves that if your business model is a single vendor, the cheapest abstraction is none.

## rivumi's choice, and where it differs

First, the lineage: rivumi's provider table is not original — it is deliberately copied from pi. The header comment in `rivumi/src/rivumi/provider_catalog.py` states its base URLs are "verified against @earendil-works/pi-ai's own provider source (the package pi/omp depend on)". pi's packages/ai is the source of truth; rivumi keeps only the subset it needs.

On top of that, three decisions:

**One, the canonical contract is pinned down with strong types.** Every adapter's input and output is the same set of pydantic models: `rivumi/src/rivumi/contracts.py#Message` (roles limited to system/user/assistant), `contracts.py#ToolCall` (arguments guaranteed to be a dict, never a string), `contracts.py#Usage` (cached input explicitly defined as a subset of input), `contracts.py#ModelTurn`. Adapters are invisible to each other; the loop only knows the contract.

**Two, protocol is separated from provider, endpoint, and credential.** `rivumi/src/rivumi/contracts.py#ModelProtocol` enumerates seven values, six of which are real wires: `OPENAI_CHAT`, `OPENAI_RESPONSES`, `OPENAI_CODEX_RESPONSES`, `ANTHROPIC_MESSAGES`, `GEMINI_GENERATE_CONTENT`, `WORKERS_AI_RUN` — each backed by an adapter class in `rivumi/src/rivumi/models.py` (`OpenAICompatibleModel`, `ResponsesModel`, `AnthropicModel`, `GeminiModel`, `WorkersAIModel`, `OpenAICodexResponsesModel`). An Ollama endpoint runs as an openai_chat preset; Groq/OpenRouter/NVIDIA NIM share the openai_chat adapter; only specific models are forced onto Responses (`provider_catalog.py#uses_responses_protocol`) because their `/chat/completions` passthrough breaks.

**Three, errors are fully classified at the adapter boundary.** `rivumi/src/rivumi/models.py#ProviderErrorKind` has exactly five kinds: retryable, auth, rate_limit, invalid_request, provider. The status-code-to-kind mapping lives in one place, `rivumi/src/rivumi/models.py#_error_kind`, which also extracts retry-after headers and request ids. The crucial detail: `OpenAICompatibleModel` constructs the SDK with `max_retries=0` (`rivumi/src/rivumi/models.py#OpenAICompatibleModel`), and the comment explains why — retries belong to `rivumi/src/rivumi/loop.py#AgentRunner._complete_model_with_retry`; otherwise built-in SDK retries would multiply upstream requests and bypass the audit trail. The classification pays off immediately: retryable/rate_limit errors get exponential backoff, auth and invalid_request fail fast, and `retry_after_seconds` raises the backoff floor.

Compared to the five: rivumi adds URL safety validation that pi lacks (`models.py#_validated_openai_base_url` — remote requires HTTPS, HTTP allowed only for loopback, embedded URL credentials rejected), has more real providers than Claude Code or Codex, but lacks streaming and dynamic OAuth refresh — a deliberate scope cut, since non-streaming makes checkpoint semantics far simpler for the harness.

## Evidence base

There is no classic paper on provider abstraction, but the vendors' own API documentation doubles as the best dialect inventory: [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) usage and cache fields, the coexistence of [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat) and the [Responses API](https://platform.openai.com/docs/api-reference/responses) (OpenAI itself forked into two wires), [Google Gemini generateContent](https://ai.google.dev/api/generate-content) functionCall structure, and [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)'s REST run interface. Codex's removal of the chat wire is documented in their own [discussion #7782](https://github.com/openai/codex/discussions/7782). The engineering consensus is consistent: wire-protocol diversity is real and growing, so an abstraction layer isn't over-engineering — it's the necessary investment of centralizing dialect translation in one place.

## What could improve

1. **Streaming**. `ModelCapabilities.streaming` is currently always False, hurting time-to-first-token for long tasks. pi's event-stream shape (AssistantMessageEventStream) is directly referenceable, but the semantic conflict between non-streaming checkpoints and mid-stream cancellation must be resolved first.
2. **Cost inside the contract**. pi's Usage carries cost fields and OMP ships an openai-pricing module; rivumi accumulates tokens only, with no price tables yet.
3. **Generalizing dynamic model discovery**. `rivumi/src/rivumi/model_catalog.py#snapshot` already caches catalog-style endpoints like OpenRouter with a 24-hour TTL, but coverage is narrow; OMP's `dynamicModelsAuthoritative` taxonomy (which providers' lists are trustworthy) is worth copying too.
4. **OAuth refresh fencing**. The Codex subscription path is manual login today, with cross-process token-refresh races unhandled — pi's `Models.getAuth` error-code design (oauth/auth split, credentials preserved for retry) is a ready-made blueprint.

One-line summary: **the essence of the ModelProvider abstraction is not hiding differences, but translating them into the one layer you're responsible for — the contract.**

## References

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (`packages/ai/src/types.ts`, `packages/ai/src/models.ts`)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (`packages/catalog/src/provider-models/descriptors.ts`)
- [sst/opencode](https://github.com/sst/opencode) (`packages/opencode/src/provider/provider.ts`)
- [openai/codex](https://github.com/openai/codex) (`codex-rs/model-provider-info/src/lib.rs`)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)
- [OpenAI Chat Completions API reference](https://platform.openai.com/docs/api-reference/chat)
- [OpenAI Responses API reference](https://platform.openai.com/docs/api-reference/responses)
- [Google Gemini generateContent API](https://ai.google.dev/api/generate-content)
- [Cloudflare Workers AI docs](https://developers.cloudflare.com/workers-ai/)
- [models.dev](https://models.dev)
- [Codex discussion #7782: chat wire_api removal](https://github.com/openai/codex/discussions/7782)
