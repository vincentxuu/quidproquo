---
title: "Looplane 的 ModelProvider 多閘道：多個 protocol 共用一個 canonical contract"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, model-provider, openai, anthropic, gemini, workers-ai]
lang: zh-TW
tldr: "Looplane 把 OpenAI-compatible、Responses、Anthropic、Gemini、Workers AI、scripted 與 experimental Codex OAuth adapter 收斂成同一個 `ModelProvider` contract。Codex OAuth transport 讀 SSE，但仍在 adapter 內累積成一次性的 canonical `ModelTurn`；AgentRunner 不直接消費 token delta。"
description: "深入 Looplane 的 ModelProvider 多閘道設計：七種 adapter 如何翻譯成 canonical ModelTurn，Codex OAuth 的 SSE transport 如何維持非串流 loop contract，以及 ProviderErrorKind 與 ModelGateway 的邊界。"
series:
  name: "Looplane 架構拆解"
  order: 5
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-looplane-model-provider-multigateway-en)

上一篇追完 Looplane 自家的 native loop；這篇往下一層看 `ModelProvider` Protocol 怎麼把多種 protocol adapter 收斂成同一個介面，以及同一個 adapter 怎麼被 `ModelGateway` 開成對外服務。

這個收斂是必要的:AgentRunner 的 `_complete_model_or_cancel` 只看到 `ModelProvider` Protocol,從頭到尾不知道下游是 OpenAI SDK、Anthropic SDK、httpx、還是 Workers AI 的 REST。**所有 provider-specific 的差異——SDK 例外型別、HTTP status code、Workers AI 的自定義 error code、reasoning token 怎麼算——都必須在 adapter 內部被消化掉**。失敗的時候 AgentRunner 看到的是 `ProviderError(kind=..., status_code=..., retryable=...)`,而不是 `openai.APIStatusError` 或 `httpx.HTTPStatusError`。

## 多個 protocol,一個 contract

`src/looplane/models.py:64-79` 是整個抽象的核心:

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

四個屬性加一個方法。`provider_name` 是身份標籤，例如 `openai-compatible`、`anthropic`、`gemini`、`workers-ai`、`scripted` 或 `openai-codex`；`model_id` 是具體模型。`protocol` 是 wire protocol，跟 provider 身份解耦——同樣是 OpenAI 系列來源，可以走一般 chat completions、Responses wire，或 experimental Codex OAuth Responses SSE。

`capabilities` 是 `ModelCapabilities(tool_calling=..., streaming=..., structured_output=...)`。`AgentRunner` 目前會強制檢查 `tool_calling`；`complete()` 的 canonical 回傳仍是一個完整 `ModelTurn`。`OpenAICodexResponsesModel` 例外地宣告 `streaming=True`，因為它的 transport 讀 SSE，但 adapter 會先收集 events 再組成 `ModelTurn`，loop 並不直接消費 token delta。

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
| `OpenAICodexResponsesModel` | `httpx.AsyncClient` + app-owned OAuth | Codex Responses SSE |

`ScriptedModel` 是 contract test 跟 offline demo fixture 用的,沒有真實 API call——`complete()` 從內部 deque 取下一個 scripted `ModelTurn`,沒有時 raise `ProviderError(kind=PROVIDER, ...)`。這個 adapter 是「**寫測試時不需要 mock SDK,直接餵 canned response**」的實踐。

六個 network-backed adapter 的差別主要在三件事：message 翻譯、tool 翻譯與 response 翻譯。Anthropic、Gemini、OpenAI-family 與 Workers AI 的 system 欄位、tool schema 和 response shape 各不相同；Codex OAuth 還多了 credential refresh 與 SSE event reduction，但最後仍回到相同的 canonical turn。

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

五個 kind 把不同 transport 的失敗壓成固定語彙：

- **`AUTH`** — 401 / 403 / Workers AI 10000 / 9106 / 9109。代表 credential 或權限失敗。
- **`RATE_LIMIT`** — 429 / Workers AI 7505。保留 `retry_after_seconds`，讓上層知道 provider 建議的等待時間。
- **`INVALID_REQUEST`** — 400 / 404 / 405 / 409 / 415 / 422 / Workers AI 7502 / 7504 / 7506。代表 schema 或參數錯誤，重送同一份 request 沒有意義。
- **`RETRYABLE`** — 5xx / 連線錯誤 / timeout。只表達 transport failure 的性質，不在 adapter 內決定重試次數。
- **`PROVIDER`** — 其他無法分類的錯誤(例如 response 沒有 choices、JSON 解析失敗)。預設 fail-closed。

這一層只負責正規化，不決定該 retry 幾次、何時換模型，也不做價格或健康度路由。上層可以依 `kind`、`retryable` 與 `retry_after_seconds` 做決策，而不用認識每套 SDK 的例外類別；實際的 retry、fallback、cache hint 與 estimated cost 留到下一篇處理。

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

兩個關鍵:**(a) loopback base URL(`127.0.0.1` / `localhost`)可以無 api_key**——Ollama 不需要 auth,Looplane 不該強迫使用者設定假 key;**(b) 非 loopback 必須有 api_key**——避免「user 寫了個奇怪的 base URL → 以為是本地端 → 不小心打到某個 endpoint」的意外。`_is_loopback_base_url` 嚴格判斷 hostname + port,不會把 `0.0.0.0` 當成 loopback。

這個 adapter 同時還支援 `extra_body` 跟 `user_message_prefix`:前者讓使用者注入 provider-specific 欄位(例如 `reasoning_effort`、`safety_settings`),後者讓使用者給每則 user message 加上 prefix(例如「all responses in JSON」)。`extra_body` 的 validator 拒絕覆寫 `model` / `messages` / `tools` 三個 canonical 欄位——避免使用者不小心把整個 transport 搞壞。

## ModelGateway:同一個 adapter 開成對外 HTTP

`src/looplane/gateway.py` 的 `ModelGateway` 是一個 pure-ASGI application,把 `ModelProvider` 暴露成 OpenAI-compatible HTTP endpoint——意思是任何 OpenAI SDK client(包括 Cursor、Aider、其他 coding agent)都能直接打 Looplane gateway。

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

- **Loopback 預設**:docstring 寫「bind to a loopback address by default」——gateway 不是設計給對外服務的,而是讓本地其他工具透過 127.0.0.1 借用 Looplane 的 transport。如果要對外,`bearer_token` 是必填。
- **`/healthz` 不需要 auth**:liveness probe 用,M2 文件裡寫的 `looplane gateway` 驗證命令(`curl /v1/chat/completions` 拿 `GATEWAY_OK`)就靠這個。
- **`max_request_bytes = 1 MiB` 預設**:防止「巨型 request 灌爆記憶體」——所有 request body 必須在這個限制內,超過就 413。
- **`_provider_status()` 把 `ProviderErrorKind` 翻回 HTTP status**(line 392-401):`AUTH → 502`、`RATE_LIMIT → 429`、其他 → `500`。這是 reverse mapping,把 AgentRunner 內部的錯誤分類塞回外部 HTTP 語意。

`_encode_turn()` 把 `ModelTurn` 翻成 OpenAI chat completion response shape,`_parse_chat_request()` 把 OpenAI request 翻回 `(ConversationItem, ToolDefinition)` tuple。**gateway 完全不引入新的 protocol 概念**——它只是「OpenAI wire 跟 Looplane canonical 之間的轉接器」。

這個 gateway 在 M2 階段的具體用途是「驗證同一個 adapter 能服務外部 client」:跑 `looplane gateway` 在背景,用 `curl` 打 `/v1/chat/completions`,確認 response 真的是 OpenAI shape。如果 gateway 不能服務外部 client,代表 adapter 內部有「只有 AgentRunner 用得到」的特殊假設,contract 就破了。

## Transport streaming 不等於 loop streaming

多數 adapter 的 `streaming` 預設是 `False`，但 `OpenAICodexResponsesModel` 已設為 `True`：它送出 `stream: true`、逐行讀 SSE，再由 `_turn_from_events()` 收斂成完整 `ModelTurn`。這證明的是 transport 能處理 stream，不是 `AgentRunner` 或 TUI 已有 token-by-token projection。

- AgentRunner 每次只處理一個 `ModelTurn`,streaming delta 要在 loop 內部累積成 `ModelTurn`,這層邏輯目前用 `bounded_text(turn.content, 2_000)` 直接截斷,沒設計成 partial update。
- 互動 CLI 想要 token-by-token 顯示，還需要明確的 delta event contract 與 UI projection；現有 `complete()` 不會把部分內容逐步交給 loop。
- ExternalCodingRunner 完全不在乎 streaming——backend 回的是 `ExternalAgentResult`,沒有 delta 概念。

因此要談「Looplane 支援 streaming」必須說清層級：Codex OAuth adapter 的 transport 已串流讀取；canonical loop 與 UI 仍以完整 turn 為單位。未來若要公開 delta，不應只看 capability flag，還要新增不破壞 `complete()` contract 的增量介面與事件語意。

## 整體來說

`ModelProvider` Protocol 是 Looplane 把「模型」當成元件的具體表現：四個欄位、一個方法與五類錯誤。七種 adapter（OpenAI-compatible、Responses、Anthropic、Gemini、Workers AI、Scripted、experimental Codex OAuth）各自翻譯 wire format、認證與錯誤碼，AgentRunner 從頭到尾只看到 canonical 介面。

這個抽象的代價顯而易見:寫 adapter 的人要懂兩邊——canonical contract 跟 provider wire,而且每次 provider 改 wire(Anthropic 加新欄位、Gemini 換 response shape、OpenAI 新增 responses-only 模型)都要跟著改。但回報也同樣清楚:**同樣的 AgentRunner、同樣的 disposable clone、同樣的 verification 閘,接多個 protocol 不需要改 loop 一行**;同樣的 transport 還能透過 `ModelGateway` 服務外部 client;`looplane gateway` 目前的公開面維持在 `/healthz`、`/v1/models`、非 streaming `/v1/chat/completions`,可選 `LOOPLANE_GATEWAY_TOKEN`,不是任意 URL passthrough。同樣的 `ProviderErrorKind` 分類也讓上層能用一致的失敗語彙做決策。

[下一篇](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost)沿著 model request 往上追：model role 如何選定候選、失敗後怎麼 retry 或 fallback，以及 cache trace 與 estimated cost 能證明什麼、不能當成什麼。

---

## 參考資料

- [Looplane 官方 repo](https://github.com/vincentxuu/looplane)——本文所有引用來源的 ground truth
- [Looplane M2 文件](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m2-interactive-cli-provider-gateway.md)——provider boundary decision 跟 gateway 的官方里程碑
- [Looplane `codex_oauth.py`](https://github.com/vincentxuu/looplane/blob/main/src/looplane/codex_oauth.py)——experimental app-owned OAuth 與 SSE reduction 實作
- [OpenAI Chat Completions API](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)——`OpenAICompatibleModel` 的 wire 對象
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)——`AnthropicModel` 的 wire 對象
- [Google Gemini generateContent](https://ai.google.dev/api/generate-content)——`GeminiModel` 的 wire 對象
- [Cloudflare Workers AI REST API](https://developers.cloudflare.com/workers-ai/)——`WorkersAIModel` 的 wire 對象跟 7505 / 10000 error code
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)——`OpenAICompatibleModel` 的 loopback 典型用戶
- [Pydantic v2 — Protocol 與 runtime_checkable](https://docs.pydantic.dev/latest/concepts/types/#protocols)——`@runtime_checkable` 怎麼讓 Protocol 可以 isinstance 檢查
- [ASGI 規範](https://asgi.readthedocs.io/en/latest/)——`ModelGateway` 的 pure-ASGI 設計依據
