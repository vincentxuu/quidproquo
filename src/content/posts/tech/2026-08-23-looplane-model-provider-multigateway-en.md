---
title: "Looplane's ModelProvider multi-gateway: multiple protocols, one canonical contract"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, model-provider, openai, anthropic, gemini, workers-ai]
lang: en
tldr: "Looplane collapses OpenAI-compatible, Responses, Anthropic, Gemini, Workers AI, scripted, and experimental Codex OAuth adapters into one `ModelProvider` contract. The Codex OAuth transport reads SSE but still reduces it inside the adapter into one canonical `ModelTurn`; AgentRunner does not consume token deltas."
description: "A deep dive into Looplane's seven ModelProvider adapters, how Codex OAuth SSE preserves the non-streaming loop contract, and where ProviderErrorKind and ModelGateway sit."
series:
  name: "Looplane Architecture Notes"
  order: 5
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-model-provider-multigateway)

The previous article followed Looplane's native loop. This one moves down a layer: how `ModelProvider` collapses multiple protocol adapters into one interface, and how the same adapter can be exposed as an external service through `ModelGateway`.

That collapse is necessary because `AgentRunner._complete_model_or_cancel` sees only the `ModelProvider` Protocol. It does not know whether the lower layer uses the OpenAI SDK, Anthropic's wire format, `httpx`, or Workers AI REST. **All provider-specific differences must be consumed inside the adapter.** On failure, `AgentRunner` sees `ProviderError(kind=..., status_code=..., retryable=...)`, not `openai.APIStatusError` or `httpx.HTTPStatusError`.

## Multiple protocols, one contract

The core abstraction is in `src/looplane/models.py:64-79`:

```python
@runtime_checkable
class ModelProvider(Protocol):
    """Canonical, non-streaming provider boundary consumed by the agent loop."""

    provider_name: str
    model_id: str
    protocol: ModelProtocol
    capabilities: ModelCapabilities

    async def complete(
        self,
        messages: Sequence[ConversationItem],
        tools: Sequence[ToolDefinition] = (),
    ) -> ModelTurn: ...

    async def aclose(self) -> None: ...
```

Four attributes and one method. `provider_name` is an identity label such as `openai-compatible`, `anthropic`, `workers-ai`, `scripted`, or `openai-codex`; `model_id` is the concrete model; and `protocol` names the wire. The same OpenAI family may use chat completions, Responses wire, or the experimental Codex OAuth Responses SSE path.

`capabilities` advertises tool calling, streaming, and structured output. The loop enforces `tool_calling`, while canonical `complete()` still returns one complete `ModelTurn`. `OpenAICodexResponsesModel` advertises `streaming=True` because its transport reads SSE; the adapter collects those events before returning the turn, so the loop does not consume token deltas.

`complete()` accepts canonical `ConversationItem` values and returns a canonical `ModelTurn(content, tool_calls, usage, finish_reason)`. The provider disappears at the boundary.

## Adapter differences

The adapters in `models.py` use different lower-level transports:

| Adapter | Lower layer | Transport |
|---|---|---|
| `OpenAICompatibleModel` | `openai.AsyncOpenAI` SDK | `/chat/completions` |
| OpenAI Responses adapter | OpenAI Responses wire | `/responses` |
| `AnthropicModel` | `httpx.AsyncClient` | `/v1/messages` |
| `GeminiModel` | `httpx.AsyncClient` | `/v1beta/models/{model}:generateContent` |
| `WorkersAIModel` | `httpx.AsyncClient` | `/accounts/{id}/ai/run/{model}` |
| `ScriptedModel` | Python deque | queued fixture turns |
| `OpenAICodexResponsesModel` | `httpx.AsyncClient` + app-owned OAuth | Codex Responses SSE |

`ScriptedModel` is for contract tests and offline demos. It pops queued `ModelTurn`s from an internal deque and raises a canonical provider error when the script is exhausted. Tests do not need to mock SDKs; they feed canned canonical turns.

The six network-backed adapters differ in message translation, tool translation, and response translation. Anthropic, Gemini, the OpenAI family, and Workers AI use different system fields, tool schemas, and response shapes. Codex OAuth additionally owns credential refresh and SSE event reduction, but still returns the same canonical turn.

Each adapter owns helper functions such as `_xxx_messages()`, `_xxx_tools()`, and `_xxx_tool_call()`. That is the adapter's job: translate canonical values into provider wire format, call the provider, then translate the result back into canonical values. The adapter does not know what `AgentRunner`, disposable clones, or `SafePathPolicy` do.

## ProviderErrorKind: five failure classes

`models.py:27-61` defines the canonical error surface:

```python
class ProviderErrorKind(StrEnum):
    RETRYABLE = "retryable"
    AUTH = "auth"
    RATE_LIMIT = "rate_limit"
    INVALID_REQUEST = "invalid_request"
    PROVIDER = "provider"


class ProviderError(RuntimeError):
    def __init__(
        self,
        message: str,
        *,
        kind: ProviderErrorKind,
        provider_name: str,
        status_code: int | None = None,
        retry_after_seconds: float | None = None,
        provider_code: str | int | None = None,
        request_id: str | None = None,
    ) -> None:
        ...
    @property
    def retryable(self) -> bool:
        return self.kind in {ProviderErrorKind.RETRYABLE, ProviderErrorKind.RATE_LIMIT}
```

The five kinds give different transports a stable failure vocabulary:

- `AUTH`: 401, 403, or provider-specific auth codes. This identifies a credential or authorization failure.
- `RATE_LIMIT`: 429 or Workers AI 7505. `retry_after_seconds` preserves the provider's suggested delay.
- `INVALID_REQUEST`: 400, 404, 405, 409, 415, 422, or Workers AI invalid-request codes. Resending the same schema cannot repair it.
- `RETRYABLE`: 5xx, connection errors, and timeouts. The adapter classifies the transport failure but does not choose a retry budget.
- `PROVIDER`: malformed responses or unclassified failures.

HTTP status mapping lives in `_error_kind()`:

```python
def _error_kind(status_code: int | None) -> ProviderErrorKind:
    if status_code in {401, 403}:
        return ProviderErrorKind.AUTH
    if status_code == 429:
        return ProviderErrorKind.RATE_LIMIT
    if status_code in {400, 404, 405, 409, 415, 422}:
        return ProviderErrorKind.INVALID_REQUEST
    if status_code is not None and status_code >= 500:
        return ProviderErrorKind.RETRYABLE
    return ProviderErrorKind.PROVIDER
```

Workers AI uses envelope error codes instead of relying only on HTTP status:

```python
if numeric_code == 7505:
    kind = ProviderErrorKind.RATE_LIMIT
elif numeric_code in {7502, 7504, 7506}:
    kind = ProviderErrorKind.INVALID_REQUEST
elif numeric_code in {10000, 9106, 9109}:
    kind = ProviderErrorKind.AUTH
else:
    kind = ProviderErrorKind.PROVIDER
```

`ProviderError` also stores `request_id` and `retry_after_seconds`, so the layer above can act without receiving provider-specific exception objects. The adapter stops there: it does not decide the retry count, select a fallback model, or route by price or provider health. The next article covers retry, fallback, cache hints, and estimated cost as a separate operational concern.

## OpenAI-compatible as a shared wire, not an OpenAI-only path

`OpenAICompatibleModel` is not just for OpenAI. It is the adapter for anything that speaks `/v1/chat/completions`: Ollama, vLLM, LM Studio, official OpenAI, and custom OpenAI-compatible URLs. Responses-only models use a separate Responses protocol adapter rather than forcing both wires into one class.

The constructor handles local loopback carefully:

```python
validated_base_url = _validated_openai_base_url(base_url)
if not supplied_api_key and client is None and not is_loopback:
    raise ValueError("key or api_key is required when client is not supplied")
is_loopback = (
    validated_base_url is not None
    and _is_loopback_base_url(validated_base_url)
)
...
self._client = client or AsyncOpenAI(
    api_key=supplied_api_key or "local-openai-compatible",
    base_url=validated_base_url,
)
```

Loopback base URLs such as `127.0.0.1` and `localhost` can run without a real API key, because Ollama does not need one. Non-loopback URLs require a key, avoiding accidental unauthenticated calls to arbitrary endpoints. `_is_loopback_base_url` checks the hostname and does not treat `0.0.0.0` as loopback.

The adapter also supports `extra_body` and `user_message_prefix`, but validators prevent overriding canonical fields such as `model`, `messages`, and `tools`.

## ModelGateway: exposing the same adapter over HTTP

`src/looplane/gateway.py` implements a pure-ASGI `ModelGateway` that exposes a configured `ModelProvider` as an OpenAI-compatible HTTP endpoint:

```python
class ModelGateway:
    """Minimal pure-ASGI model gateway for one configured provider/model.

    The containing server should bind to a loopback address by default.  When
    ``bearer_token`` is configured, every ``/v1`` request must authenticate;
    ``/healthz`` intentionally remains usable as a non-sensitive liveness probe.
    """

    def __init__(
        self,
        provider: ModelProvider,
        *,
        bearer_token: str | None = None,
        max_request_bytes: int = 1_048_576,
    ) -> None: ...
```

Key choices:

- **Loopback by default**: the gateway is designed for local clients such as Aider, Cursor, or other agents, not as an open internet service.
- **`/healthz` unauthenticated**: liveness probes stay simple and non-sensitive.
- **1 MiB request cap**: giant request bodies are rejected before they hit the provider.
- **Reverse error mapping**: `_provider_status()` turns canonical provider errors back into HTTP status codes for the client.

`_parse_chat_request()` converts OpenAI-style messages and tools into canonical values; `_encode_turn()` converts `ModelTurn` back into OpenAI chat-completion response shape. The gateway introduces no new model protocol. It is just another translator around the same canonical contract.

## Transport streaming is not loop streaming

Most adapters default `streaming` to `False`, but `OpenAICodexResponsesModel` already sets it to `True`: it sends `stream: true`, reads SSE lines, and reduces them through `_turn_from_events()` into a complete `ModelTurn`. That proves transport-level streaming, not token-by-token projection in `AgentRunner` or the TUI.

- `AgentRunner` consumes one `ModelTurn` at a time. Streaming deltas would have to be accumulated into a turn anyway.
- Interactive token-by-token display still needs a delta-event contract and UI projection; current `complete()` does not expose partial content to the loop.
- `ExternalCodingRunner` deals in `ExternalAgentResult`, not model deltas.

Claims about "streaming support" therefore need a layer qualifier. The Codex OAuth adapter streams its transport today; the canonical loop and UI remain full-turn consumers. Exposing deltas would require an incremental interface and event semantics that do not break `complete()`.

## The trade-off

`ModelProvider` is Looplane's concrete expression of "the model is a component": four fields, one method, and five error kinds. Seven adapters—OpenAI-compatible, Responses, Anthropic, Gemini, Workers AI, Scripted, and experimental Codex OAuth—translate wire format, authentication, and error codes into that contract while `AgentRunner` stays provider-blind.

The cost is adapter work. The author has to understand both the canonical contract and each provider's wire. When providers change response shapes or add new fields, adapters must be maintained. The return is that **the same `AgentRunner`, disposable clone, and verification gate can support multiple protocols without changing the loop**. The same transport can serve outside clients through `ModelGateway`; `looplane gateway` remains limited to `/healthz`, `/v1/models`, and non-streaming `/v1/chat/completions`, with optional `LOOPLANE_GATEWAY_TOKEN`, not arbitrary URL passthrough.

The [next article](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost-en) follows a model request upward: how model roles choose candidates, what happens on retry or fallback, and what cache traces and estimated cost can and cannot prove.

---

## References

- [Looplane official repo](https://github.com/vincentxuu/looplane) -- the ground truth for all code references in this article
- [Looplane M2 docs](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m2-interactive-cli-provider-gateway.md) -- provider-boundary and gateway milestone notes
- [Looplane `codex_oauth.py`](https://github.com/vincentxuu/looplane/blob/main/src/looplane/codex_oauth.py) -- experimental app-owned OAuth and SSE reduction
- [OpenAI Chat Completions API](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) -- the wire target for `OpenAICompatibleModel`
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) -- the wire target for `AnthropicModel`
- [Google Gemini generateContent](https://ai.google.dev/api/generate-content) -- the wire target for `GeminiModel`
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) -- the wire target and error-code source for `WorkersAIModel`
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility) -- a common loopback user of `OpenAICompatibleModel`
- [Pydantic v2 protocols](https://docs.pydantic.dev/latest/concepts/types/#protocols) -- background for runtime-checkable Protocol typing
- [ASGI specification](https://asgi.readthedocs.io/en/latest/) -- the basis for `ModelGateway`
