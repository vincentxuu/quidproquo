---
title: "Rivumi 的 ModelProvider 多閘道：多個 protocol 共用一個 canonical contract"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, model-provider, openai, anthropic, gemini, workers-ai]
lang: zh-TW
tldr: "Rivumi 把『打哪家的模型 API』抽象成一個 Protocol:OpenAI-compatible(Ollama / vLLM / 官方 / custom endpoint)、OpenAI Responses、Anthropic Messages API、Gemini generateContent、Cloudflare Workers AI,加上一個 scripted deterministic adapter。Protocol 只有四個屬性 + 一個 `complete()` 方法,內部把所有 SDK 特定的例外、HTTP status code、Workers AI 的 7505 / 7502 等錯誤碼,全部收斂成五個 `ProviderErrorKind`:RETRYABLE / AUTH / RATE_LIMIT / INVALID_REQUEST / PROVIDER。同一個 provider adapter 還能透過 `rivumi gateway` 暴露 `/healthz`、`/v1/models` 與非 streaming `/v1/chat/completions`,讓外部 client 也能用 Rivumi 已經驗證過的 transport。"
description: "深入 Rivumi 的 ModelProvider 多閘道設計：OpenAI-compatible / OpenAI Responses / Anthropic / Gemini / Workers AI / Scripted adapter 怎麼翻譯成 canonical ModelTurn;ProviderErrorKind 五類錯誤收斂;ModelGateway 純 ASGI 怎麼把同一個 adapter 暴露成 OpenAI-compatible HTTP endpoint。"
series:
  name: "Rivumi 架構拆解"
  order: 6
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-model-provider-multigateway-en)

上一篇拆 ExternalCodingRunner,這篇回到 Rivumi 自家 loop——看 `ModelProvider` Protocol 怎麼把多個 protocol adapter 收斂成同一個介面,以及同一個 adapter 怎麼被 `ModelGateway` 開成對外服務。

這個收斂是必要的:AgentRunner 的 `_complete_model_or_cancel` 只看到 `ModelProvider` Protocol,從頭到尾不知道下游是 OpenAI SDK、Anthropic SDK、httpx、還是 Workers AI 的 REST。**所有 provider-specific 的差異——SDK 例外型別、HTTP status code、Workers AI 的自定義 error code、reasoning token 怎麼算——都必須在 adapter 內部被消化掉**。失敗的時候 AgentRunner 看到的是 `ProviderError(kind=..., status_code=..., retryable=...)`,而不是 `openai.APIStatusError` 或 `httpx.HTTPStatusError`。

## 多個 protocol,一個 contract

`src/rivumi/models.py:64-79` 是整個抽象的核心:

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

四個屬性加一個方法。`provider_name` 是身份標籤(`openai-compatible` / `openai-responses` / `anthropic` / `gemini` / `workers-ai` / `scripted`),`model_id` 是具體模型(`gpt-4o` / responses-only model / `claude-sonnet-4.5` / `gemini-2.5-pro` / `@cf/meta/llama-3.3-70b-instruct-fp8-fast` / scripted fixture 名)。`protocol` 是 wire protocol,跟 provider 身份解耦——同樣是 OpenAI 來源,可以走 `OPENAI_CHAT`(一般 chat completions)或 `OPENAI_CODEX_RESPONSES`(Responses API),Protocol 允許未來加新 wire format 而不破壞既有 adapter。

`capabilities` 是 `ModelCapabilities(tool_calling=..., streaming=..., structured_output=...)`——目前只有 `tool_calling` 真的會被 loop 用到(`AgentRunner.run()` 開頭會拒絕不支援 tool calling 的 provider),其兩個保留給未來。**AgentRunner 預設不啟用 streaming**——`complete()` 回的是一次性 `ModelTurn`,delta 在 loop 內部用 `bounded_text()` 統一截斷,而不是讓每個 adapter 自己處理 streaming chunk。

`complete()` 的輸入是 canonical `ConversationItem`(上一篇文章提到的 `Message | ToolObservation`),不是 provider-specific 的 message 物件。輸出是 canonical `ModelTurn(content, tool_calls, usage, finish_reason)`。**Provider 在邊界上消失**——下游可以是任何東西,只要能裝進這四個欄位。

## Adapter 的關鍵差異

`models.py` 裡各個 adapter 各自用不同的底層 SDK / HTTP client:

| Adapter | 底層 | 主要 transport |
|---|---|---|
| `OpenAICompatibleModel` | `openai.AsyncOpenAI` SDK | `/chat/completions` |
| OpenAI Responses adapter | OpenAI Responses wire | `/responses` |
| `AnthropicModel` | `httpx.AsyncClient`(line 469-479 `_HttpModel`) | `/v1/messages` |
| `GeminiModel` | `httpx.AsyncClient` | `/v1beta/models/{model}:generateContent` |
| `WorkersAIModel` | `httpx.AsyncClient` | `/accounts/{id}/ai/run/{model}` |
| `ScriptedModel` | 純 Python deque | 從 fixture 讀 queued turn |

`ScriptedModel` 是 contract test 跟 offline demo fixture 用的,沒有真實 API call——`complete()` 從內部 deque 取下一個 scripted `ModelTurn`,沒有時 raise `ProviderError(kind=PROVIDER, ...)`。這個 adapter 是「**寫測試時不需要 mock SDK,直接餵 canned response**」的實踐。

四個真實 adapter 的差別主要在三件事:**(a) message 翻譯**(Anthropic 的 `system` 必須是獨立欄位、Gemini 的 `system_instruction` 是另一個欄位、Workers AI 跟 OpenAI 都吃 OpenAI-style `messages` array)、**(b) tool 翻譯**(Anthropic 的 `input_schema` 跟 OpenAI 的 `parameters` 結構接近但不完全一樣、Gemini 的 `function_declarations` 結構又不同)、**(c) response 翻譯**(Anthropic 的 `content` 是 `[{type: "text", text: ...}, {type: "tool_use", ...}]` 陣列、Gemini 的 `candidates[0].content.parts` 是另一種結構)。

每個 adapter 內部都有 `_xxx_messages()`、`_xxx_tools()`、`_xxx_tool_call()` 三個翻譯函數,把 canonical 翻成 provider wire,然後把 provider wire 翻回 canonical。這層翻譯是 adapter 唯一的職責——adapter **不知道 AgentRunner 在幹嘛**,也 **不知道 disposable clone / SafePathPolicy 存在**,它只看 `messages + tools` 進、`ModelTurn` 出。

## ProviderErrorKind:五類錯誤吃掉所有 SDK 例外

`models.py:27-61`:

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

五個 kind 涵蓋 AgentRunner 會做的所有決策:

- **`AUTH`** — 401 / 403 / Workers AI 10000 / 9106 / 9109。AgentRunner 看到會立刻 terminal fail,terminal reason = `provider_auth`。
- **`RATE_LIMIT`** — 429 / Workers AI 7505。`retryable=True`,但目前 AgentRunner 不自動 retry,改成把這次 call 的失敗塞回 conversation,讓模型自己決定要不要繼續。
- **`INVALID_REQUEST`** — 400 / 404 / 405 / 409 / 415 / 422 / Workers AI 7502 / 7504 / 7506。表示 schema 不對或參數錯,**絕對不能 retry**(retry 一百次也一樣),AgentRunner 直接 terminal fail。
- **`RETRYABLE`** — 5xx / 連線錯誤 / timeout。`retryable=True`,但 AgentRunner 也不自動 retry,理由在後面。
- **`PROVIDER`** — 其他無法分類的錯誤(例如 response 沒有 choices、JSON 解析失敗)。預設 fail-closed。

為什麼 AgentRunner 不自動 retry 即使 `retryable=True`?在 `AgentRunner.run()` 裡 retry 是用「**讓模型看到失敗訊息,模型自己決定怎麼辦**」的方式實作的:把 `ProviderError` 的訊息塞進 user message,讓模型在下一輪自己決定要不要嘗試別的 tool。這跟 sandbox / security literature 的「**讓模型成為 retry 決策者**」思路對齊——自動 retry 可能讓 prompt injection 的副作用被放大,而人類可以介入這個循環。

HTTP status → `ProviderErrorKind` 的對應在 `_error_kind()`(line 140-149):

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

Workers AI 不走 HTTP status code,而是用 `errors[0].code` 的 numeric code——這個映射在 `_workers_envelope_error()`(line 872-905):

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

`ProviderError` 還帶 `request_id`(`x-request-id` header 或 `body.request_id` / `body.ray_id` / `result_info.request_id`)跟 `retry_after_seconds`(解析 `Retry-After` header),這兩個欄位是**讓 agent 失敗時可以給使用者 actionable feedback**——「OpenAI 報 429,建議 30 秒後重試」這種 hint 是 `terminal_reason` + `ProviderError.retry_after_seconds` + `RunResult.error` 拼出來的。

## OpenAI-compatible 的特殊位置

`OpenAICompatibleModel` 不是「OpenAI 專用」,而是所有走 `/v1/chat/completions` wire 的 adapter——Ollama、vLLM、LM Studio、OpenAI 官方與 custom OpenAI-compatible URL 都吃這個 wire。Responses-only 模型則走獨立的 Responses protocol adapter,不把兩種 wire format 硬塞進同一個 class。`__init__` 裡特別的設計:

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

兩個關鍵:**(a) loopback base URL(`127.0.0.1` / `localhost`)可以無 api_key**——Ollama 不需要 auth,Rivumi 不該強迫使用者設定假 key;**(b) 非 loopback 必須有 api_key**——避免「user 寫了個奇怪的 base URL → 以為是本地端 → 不小心打到某個 endpoint」的意外。`_is_loopback_base_url` 嚴格判斷 hostname + port,不會把 `0.0.0.0` 當成 loopback。

這個 adapter 同時還支援 `extra_body` 跟 `user_message_prefix`:前者讓使用者注入 provider-specific 欄位(例如 `reasoning_effort`、`safety_settings`),後者讓使用者給每則 user message 加上 prefix(例如「all responses in JSON」)。`extra_body` 的 validator 拒絕覆寫 `model` / `messages` / `tools` 三個 canonical 欄位——避免使用者不小心把整個 transport 搞壞。

## ModelGateway:同一個 adapter 開成對外 HTTP

`src/rivumi/gateway.py` 的 `ModelGateway` 是一個 pure-ASGI application,把 `ModelProvider` 暴露成 OpenAI-compatible HTTP endpoint——意思是任何 OpenAI SDK client(包括 Cursor、Aider、其他 coding agent)都能直接打 Rivumi gateway。

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

關鍵設計:

- **Loopback 預設**:docstring 寫「bind to a loopback address by default」——gateway 不是設計給對外服務的,而是讓本地其他工具透過 127.0.0.1 借用 Rivumi 的 transport。如果要對外,`bearer_token` 是必填。
- **`/healthz` 不需要 auth**:liveness probe 用,M2 文件裡寫的 `rivumi gateway` 驗證命令(`curl /v1/chat/completions` 拿 `GATEWAY_OK`)就靠這個。
- **`max_request_bytes = 1 MiB` 預設**:防止「巨型 request 灌爆記憶體」——所有 request body 必須在這個限制內,超過就 413。
- **`_provider_status()` 把 `ProviderErrorKind` 翻回 HTTP status**(line 392-401):`AUTH → 502`、`RATE_LIMIT → 429`、其他 → `500`。這是 reverse mapping,把 AgentRunner 內部的錯誤分類塞回外部 HTTP 語意。

`_encode_turn()` 把 `ModelTurn` 翻成 OpenAI chat completion response shape,`_parse_chat_request()` 把 OpenAI request 翻回 `(ConversationItem, ToolDefinition)` tuple。**gateway 完全不引入新的 protocol 概念**——它只是「OpenAI wire 跟 Rivumi canonical 之間的轉接器」。

這個 gateway 在 M2 階段的具體用途是「驗證同一個 adapter 能服務外部 client」:跑 `rivumi gateway` 在背景,用 `curl` 打 `/v1/chat/completions`,確認 response 真的是 OpenAI shape。如果 gateway 不能服務外部 client,代表 adapter 內部有「只有 AgentRunner 用得到」的特殊假設,contract 就破了。

## 為什麼不直接支援 streaming

`ModelCapabilities.streaming` 欄位存在但所有 adapter 都設 `False`(預設)。原因不是技術做不到——OpenAI SDK / Anthropic SDK 都原生支援 streaming——而是**streaming 在 Rivumi 的定位不明確**:

- AgentRunner 每次只處理一個 `ModelTurn`,streaming delta 要在 loop 內部累積成 `ModelTurn`,這層邏輯目前用 `bounded_text(turn.content, 2_000)` 直接截斷,沒設計成 partial update。
- 互動 CLI 想要「看著 token 一個一個出來」的體驗,這是 UI 層的事;UI 可以從 `EventWriter.append` 拿 streaming event,但模型本身還是回 `ModelTurn`,只是 EventSink 多一個 streaming event type。
- ExternalCodingRunner 完全不在乎 streaming——backend 回的是 `ExternalAgentResult`,沒有 delta 概念。

所以 streaming 預設關閉,**未來如果要開,是加一個 `ModelCapabilities.streaming=True` + 一個 `complete_stream()` async generator method**,不是改 `complete()` 的回傳型別。這層 backwards-compatibility 預留是 Protocol 設計時的一個取捨。

## 整體來說

`ModelProvider` Protocol 是 Rivumi 把「模型」當成元件的具體表現:**四個欄位 + 一個方法 + 五類錯誤**,各個 protocol adapter(OpenAI-compatible / OpenAI Responses / Anthropic / Gemini / Workers AI / Scripted)各自負責把 provider-specific 的 wire format 跟錯誤碼翻譯進來,AgentRunner 從頭到尾只看到 canonical 介面。

這個抽象的代價顯而易見:寫 adapter 的人要懂兩邊——canonical contract 跟 provider wire,而且每次 provider 改 wire(Anthropic 加新欄位、Gemini 換 response shape、OpenAI 新增 responses-only 模型)都要跟著改。但回報也同樣清楚:**同樣的 AgentRunner、同樣的 disposable clone、同樣的 verification 閘,接多個 protocol 不需要改 loop 一行**;同樣的 transport 還能透過 `ModelGateway` 服務外部 client;`rivumi gateway` 目前的公開面維持在 `/healthz`、`/v1/models`、非 streaming `/v1/chat/completions`,可選 `RIVUMI_GATEWAY_TOKEN`,不是任意 URL passthrough。同樣的 `ProviderErrorKind` 分類讓 retry 跟 fail-closed 決策統一。

下一篇拆 TUI 跟 CLI 人因工程——互動模式怎麼把 AgentRunner 的純 async 流程變成 daily-driver UX,approval flow 怎麼不被 spam、resume 怎麼不被 panic、wide/narrow 終端機怎麼都被支援。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M2 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m2-interactive-cli-provider-gateway.md)——provider boundary decision 跟 gateway 的官方里程碑
- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)——`OpenAICompatibleModel` 的 wire 對象
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)——`AnthropicModel` 的 wire 對象
- [Google Gemini generateContent](https://ai.google.dev/api/generate-content)——`GeminiModel` 的 wire 對象
- [Cloudflare Workers AI REST API](https://developers.cloudflare.com/workers-ai/)——`WorkersAIModel` 的 wire 對象跟 7505 / 10000 error code
- [Ollama OpenAI-compatible API](https://github.com/ollama/ollama/blob/main/docs/openai.md)——`OpenAICompatibleModel` 的 loopback 典型用戶
- [Pydantic v2 — Protocol 與 runtime_checkable](https://docs.pydantic.dev/latest/concepts/types/#protocols)——`@runtime_checkable` 怎麼讓 Protocol 可以 isinstance 檢查
- [ASGI 規範](https://asgi.readthedocs.io/en/latest/)——`ModelGateway` 的 pure-ASGI 設計依據
