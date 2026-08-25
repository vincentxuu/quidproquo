---
title: "跟成熟 coding agent 學設計（22）：Gateway 模式——把任何 provider 變成 OpenAI 相容端點"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 22
tags: [coding-agent, harness-engineering, llm-api, api-gateway, openai-compatible, llm-agents]
lang: zh-TW
description: "拆解 pi、OMP、OpenCode、Codex、Claude Code 五家如何處理 OpenAI 相容端點問題——native 多方言、protocol translator、受控 egress proxy 三種形態——並對照 rivumi 純 ASGI gateway 的翻譯邊界與 event loop 生命週期細節。"
tldr: "生態系都把 /v1/chat/completions 當共通語，但你手上的 provider 不一定講這個方言。五家的答案分三派：pi 和 OpenCode 讓 client 本身講多種方言所以不做 gateway；OMP 做了真正的 protocol translator（foreign wire → 中立 context → provider adapter，禁止 raw passthrough）；Codex 和 Claude Code 的 proxy 不翻譯，只負責強制流量管控。rivumi 抄 OMP 的邊界但收斂成一進一出：只收 OpenAI Chat，嚴格解析成 canonical contract，後面接任何 ModelProvider——順便踩掉一個 cross-event-loop client close bug，教訓是 provider 的生命週期必須交給 ASGI lifespan。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-gateway-pattern-en)

## 設計問題

LLM 生態系有個不成文的共識：大家都講 OpenAI 方言。Ollama、vLLM、LM Studio 提供 `/v1/chat/completions` 相容端點，eval 工具、IDE 外掛、agent 框架全部預設這個介面。[LiteLLM](https://docs.litellm.ai/) 這類專案甚至整個存在的意義就是把一百多家 provider 統一成 OpenAI 格式。

但你的 agent 內部未必如此。上一篇文章講過，wire protocol 和 provider 身分應該分離——你的 harness 可能內建 Anthropic Messages、Gemini、Workers AI 各種 adapter，唯獨外面那圈工具只會打 `/v1/chat/completions`。反過來也可能成立：你的 agent 只講一種方言，但使用者想接的引擎講別種。

所以真正的設計問題有兩層。第一，**要不要做 gateway**——如果 client 端本來就能講多種方言，gateway 是多餘的。第二，如果做，**它是翻譯器還是管制站**——把外來請求解析重編，還是原封不通放行但強制走受控路徑？這個選擇決定了你的安全邊界長什麼樣。

## 五家怎麼做

### pi：不做 gateway，client 自己講多種方言

pi 的立場最直接：provider 層已經支援 `openai-completions`、`openai-responses`、`anthropic-messages` 等多種 protocol，要接 Ollama、LM Studio、vLLM 就在 models.json 加一筆 custom provider（`pi-mono/packages/coding-agent/docs/providers.md` 的 Custom Providers 段）。細節照顧到什麼程度？連 Ollama 特有的 context overflow 錯誤字串（"prompt too long; exceeded max context length by X tokens"）都收進了 overflow 偵測 regex（`pi-mono/packages/ai/src/utils/overflow.ts`）。既然 client 什麼方言都會講，gateway 自然不需要。

### OpenCode：custom baseURL 是 client routing，不是 gateway

OpenCode 同樣不做 gateway。它的彈性來自設定層：provider 可以帶 `baseURL`（`opencode/packages/core/src/v1/config/provider.ts`），通用的 OpenAI 相容端點直接映射到 `@ai-sdk/openai-compatible`（`opencode/packages/core/src/v1/config/provider-options.ts`）。真正特殊的 provider（Codex 訂閱之類）靠客製 fetch plugin 重寫 URL 和 header。本質上是「換 base URL」而不是「開一個新服務」。

### OMP：唯一做了真正 protocol translator 的

OMP 的 `omp auth-gateway serve`（`oh-my-pi/packages/coding-agent/src/commands/auth-gateway.ts#AuthGateway`）是五家中唯一的真 gateway。核心在 `oh-my-pi/packages/ai/src/auth-gateway/server.ts#startAuthGateway`，原始碼開頭註解就把管線寫死了：「foreign wire → omp Context → pi-ai stream() → omp events → foreign wire」——**純協議翻譯，沒有 raw passthrough**。路由表收三種外來格式（`server.ts#handleFormatEndpoint`）：`/v1/chat/completions`、`/v1/messages`、`/v1/responses`，每種對應一個 FormatModule，例如 `oh-my-pi/packages/ai/src/providers/openai-chat-server.ts#parseRequest` 用 strict schema 解析外來請求、`#encodeResponse` 把中立結果編回 OpenAI 格式。憑證由 auth broker 注入，client 永遠拿不到 provider token。預設綁 `127.0.0.1:4000`（`oh-my-pi/packages/ai/src/auth-gateway/types.ts#DEFAULT_AUTH_GATEWAY_BIND`），bearer token 用 timing-safe 比對（`oh-my-pi/packages/ai/src/auth-gateway/http.ts#isAuthorized`）。

### Codex：proxy 不翻譯，只強制流量管控

`codex/codex-rs/responses-api-proxy/src/lib.rs#forward_request` 是另一個極端：這個本地 proxy **只准** `POST /v1/responses`，其他 method 和路徑一律回 403。它不解析 body，只做四件事——綁死 loopback（`lib.rs#bind_listener`）、auth header 從 stdin 讀進來不經過 argv 和環境變數（`codex/codex-rs/responses-api-proxy/src/read_api_key.rs#read_auth_header_from_stdin`）、注入上游時把 header 標記為 sensitive、可選擇把整個 exchange dump 到磁碟（`--dump-dir`）。以 `codex responses-api-proxy` 子命令形式啟動（`codex/codex-rs/cli/src/main.rs#ResponsesApiProxy`）。它的價值不在相容性，在於**讓子程序的模型流量只有一條受控路徑**——政策、觀察、關停都有單一著力點。

### Claude Code：egress proxy，第三種概念

Claude Code 的 `src/upstreamproxy` 又不一樣：它是容器端的出口管制。`claude-code-source/src/upstreamproxy/upstreamproxy.ts#initUpstreamProxy` 在 CCR session 容器內啟動一個 CONNECT→WebSocket relay（`claude-code-source/src/upstreamproxy/relay.ts#startUpstreamProxyRelay`），然後 `upstreamproxy.ts#getUpstreamProxyEnv` 把 `HTTPS_PROXY`、`NO_PROXY`、自訂 CA bundle 塞給所有 agent 子程序。`NO_PROXY_LIST` 白名單排除 loopback、RFC1918、IMDS 和套件 registry。token 甚至用 `prctl(PR_SET_DUMPABLE, 0)` 防 ptrace 抓 heap。這不是協議翻譯——是「本地代理當作強制流量控制點」的極致版本。

三種形態整理：**native 多方言**（pi、OpenCode——不做）、**protocol translator**（OMP）、**受控 egress**（Codex、Claude Code）。前者的成本在 client 端維護所有方言，後兩者的成本在多跑一個本地服務。

## rivumi 的選擇與差異

rivumi 需要的是第一種場景：讓只講 OpenAI 方言的工具打到 canonical `ModelProvider` 後面的任何 provider。所以抄的是 OMP 的邊界，但收斂得更狠。

`rivumi/src/rivumi/gateway.py#ModelGateway` 是純 ASGI translator，模組 docstring 開宗明義：翻譯外來 wire 成 `ConversationItem` 再叫 provider，「不是任意 HTTP passthrough，因此不能用來指定上游 URL」。和 OMP 三進三出不同，rivumi 一進一出：只收 OpenAI Chat Completions，吐回 OpenAI Chat 格式；`/healthz` 和 `/v1/models` 是唯二的輔助端點，`stream=true` 直接拒絕（`gateway.py#_parse_chat_request`）。

嚴格度上比 OMP 的 schema 解析更囉嗦：tool message 必須引用先前出現過的 `tool_call_id` 且 ID 全域唯一（`gateway.py#_parse_messages`），tool call 的 `arguments` 必須是合法 JSON object 不是字串（`gateway.py#_parse_tool_calls`）。model 固定為建構時那一顆，其他 model id 一律 404——這不是彈性缺口，是把 gateway 釘死在單一 configured provider 上。安全細節包括 1 MiB 請求上限（`gateway.py#_read_json`）、`hmac.compare_digest` 的 bearer 檢查（`gateway.py#_authorize`），以及一條刻意的規則：未預期的例外一律回籠統的 502，因為 SDK 例外字串可能含 request header 或憑證。loopback-only binding 則在 CLI 層強制（`rivumi/src/rivumi/cli.py#serve_gateway`）。

M2 實測留下一個值得寫下來的教訓：第一次 Ctrl-C shutdown 時，httpx client 在錯的 event loop 上被 close，直接炸掉。修法是把 provider 的生命週期整個交給 ASGI lifespan——`gateway.py#_lifespan` 收到 `lifespan.shutdown` 才呼叫 `provider.aclose()`，並以 `uvicorn.run(gateway, ..., lifespan="on")` 啟用（`cli.py#serve_gateway`）。第二次 shutdown 乾淨退出，同一輪實測拿到 health、model catalog 和 `GATEWAY_OK`。教訓很簡單：async client 的生死要跟著擁有它的 event loop 走，不要跟著 signal handler 走。

## 工程依據

OpenAI Chat Completions 成為事實標準有官方背書：[Ollama 的 OpenAI compatibility 文件](https://github.com/ollama/ollama/blob/main/docs/openai.md)說明它如何伺服 `/v1/chat/completions`，[vLLM 也內建 OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html)。[OpenAI 官方 API reference](https://platform.openai.com/docs/api-reference/chat) 就是這個方言的規範源頭。但「相容」從不等於「同義」——tool call 的 `arguments` 是 JSON 字串還是物件、`finish_reason` 的取值集合、usage 欄位語意，各實作都有出入，這正是 LiteLLM 用一整個 [translation layer](https://docs.litellm.ai/) 換來的東西。OMP 的「no raw passthrough」決策和 rivumi 的嚴格解析都是同一個判斷：**翻譯邊界就是驗證邊界**，放過去的每一個欄位都以後都要還。至於 Codex 和 Claude Code 則展示了 proxy 的另一半價值：能看見所有流量，才能執行政策。

## 改善路線

1. **Streaming**。目前 `stream=true` 被拒絕，長回應的首 token 延遲全靠 client 忍。OMP 的 `oh-my-pi/packages/ai/src/providers/openai-chat-server.ts#encodeStream` 已示範 SSE chunk 的編碼形狀，可以直接參考。
2. **多 wire 進**。加 `/v1/messages` 讓 Anthropic 格式的 client 直連——OMP 的三格式路由表是現成藍圖。
3. **`/v1/models` 回報完整 catalog**。現在只回建構時那一顆 model；配合既有的 model catalog 快取可以回更多，讓 explorer 型工具有得選。
4. **Exchange dump**。Codex 的 `--dump-dir` 對 debug 和 eval 重放都好用，gateway 層加上去成本極低。
5. **從翻譯走向政策**。有了單一流量的著力點，下一步才是 rate limit、per-request budget——Claude Code 的 NO_PROXY 白名單思路說明管制點越少越好執行。

一句話總結：**Gateway 的價值不在「相容」，而在你決定讓哪些東西過不去。**

## 參考資料

- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)（`packages/ai/src/auth-gateway/server.ts`、`packages/ai/src/providers/openai-chat-server.ts`）
- [openai/codex](https://github.com/openai/codex)（`codex-rs/responses-api-proxy/src/lib.rs`）
- [anthropics/claude-code](https://github.com/anthropics/claude-code)（decompiled source：`src/upstreamproxy/upstreamproxy.ts`）
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（`packages/coding-agent/docs/providers.md`、`packages/ai/src/utils/overflow.ts`）
- [sst/opencode](https://github.com/sst/opencode)（`packages/core/src/v1/config/provider.ts`）
- [OpenAI Chat Completions API reference](https://platform.openai.com/docs/api-reference/chat)
- [LiteLLM 文件](https://docs.litellm.ai/)
- [Ollama OpenAI compatibility](https://github.com/ollama/ollama/blob/main/docs/openai.md)
- [vLLM OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html)
