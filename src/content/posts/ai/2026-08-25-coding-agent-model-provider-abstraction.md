---
title: "跟成熟 coding agent 學設計（6）：ModelProvider 抽象——為什麼不能直接包 SDK 就好"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 6
tags: [coding-agent, harness-engineering, llm-api, provider-abstraction, error-handling, llm-agents]
lang: zh-TW
description: "拆解 pi、OMP、OpenCode、Codex、Claude Code 五家如何設計 ModelProvider 抽象——wire protocol 與 provider 身分分離、usage 正規化、錯誤分類——並對照 rivumi 的 canonical contract 與六種 wire protocol adapter。"
tldr: "直接包 SDK 三個月就會後悔：每家的 usage 欄位、tool call 格式、錯誤語意都不一樣，換模型等於重寫迴圈。五家參考專案都把「wire protocol」從「provider 身分」裡拆出來當獨立維度；rivumi 更進一步，用 pydantic canonical contract（Message/ToolCall/Usage/ModelTurn）加六種 protocol adapter，把 OpenAI SDK 的內建 retry 關到 0，所有錯誤先分類成 ProviderErrorKind 再交給統一的重試政策。provider 表本身是跟 pi 的 packages/ai 對著抄的——這是血統，不是巧合。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-model-provider-abstraction-en)

## 設計問題

第一版 coding agent 通常長這樣：`openai.chat.completions.create(...)` 包一層函式，收工。三個月後你想加第二家 provider，就會撞上三堵牆。

第一堵是 **usage 統一**。OpenAI 的 Chat Completions 回 `prompt_tokens`/`completion_tokens`；[Anthropic Messages API](https://docs.anthropic.com/en/api/messages) 的 `input_tokens` 不含 cache read，cache read/write 是獨立欄位；Gemini 用 `usageMetadata.promptTokenCount`。你的成本追蹤、context 預算控制、token 上限判斷全部建立在這些欄位上——欄位語意不一致，數字就不能比。

第二堵是 **錯誤分類**。429 要不要重試？401 呢？timeout 算不算可重試？SDK 各自拋自己的 exception 型別（OpenAI 的 `APIStatusError`、httpx 的例外、各家 gateway 的自訂格式），agent loop 若直接 catch，重試邏輯就會被 SDK 實作細節綁死。

第三堵是 **切換成本**。Tool call 格式三家三個樣：OpenAI 把 arguments 塞成 JSON 字串、Anthropic 是 structured block、Gemini 放在 functionCall part。system message 的位置和表達方式也不同。沒有 canonical 中間表示，換一家 provider 等於改寫整個迴圈。

所以真正的問題不是「怎麼包 SDK」，而是**要把哪些東西抽成正規化契約、哪些留給 adapter 翻譯**。

## 五家怎麼做

### pi：protocol 是一等公民，auth 是 provider 的一部分

pi 的 packages/ai 是五家裡最完整的 provider 抽象庫。它先把 wire protocol 定義成封閉聯集（`pi-mono/packages/ai/src/types.ts#KnownApi`）：`openai-completions`、`openai-responses`、`anthropic-messages`、`google-generative-ai`、`bedrock-converse-stream` 等，每個 protocol 一個 API 實作。然後在 `pi-mono/packages/ai/src/models.ts#Provider` 要求每個 provider 必須宣告 id、baseUrl、auth、model 目錄和 api——注意它的文件寫得很白：「Every provider has auth semantics」連純環境變數認證也要明說。auth 解析與請求發送徹底分離（`pi-mono/packages/ai/src/models.ts#Models.getAuth`），OAuth 刷新失敗回傳帶 code 的結構化錯誤而不是炸掉 stream。正規化的 `Usage`（`pi-mono/packages/ai/src/types.ts#Usage`）把 cacheRead/cacheWrite/reasoning 全部定義清楚，甚至註明「reasoning 是 output 的子集」。`StopReason` 也收斂成七個固定值，agent loop 不用面對各家的 finish reason 方言。

### OMP：在 pi 的地基上蓋 69 家 provider 的 catalog

OMP（oh-my-pi）繼承了 pi 的抽象，把它推到極端：`oh-my-pi/packages/catalog/src/provider-models/descriptors.ts#CATALOG_PROVIDERS` 列了近 70 個 provider 條目，每條帶預設 model、env key 名稱，以及要不要動態 discovery（`dynamicModelsAuthoritative`）。另一個值得學的細節在 `oh-my-pi/packages/catalog/src/identity/classify.ts#parseKnownModel`：光看 model id 字串就能解析出家族（gemini/anthropic/openai/glm）和 variant，讓上層的規則不必依賴 provider 表也能運作。

### OpenCode：models.dev 當目錄，特殊 provider 客製 loader

OpenCode 走另一條路：model 元資料集中放在 [models.dev](https://models.dev) 這個外部目錄（`opencode/packages/opencode/src/provider/provider.ts` 開頭 import `ModelsDev`），本地只為真正特殊的 provider 寫客製 loader——azure、amazon-bedrock、google-vertex、cloudflare-workers-ai、github-copilot、snowflake-cortex 等，全掛在同一個 loader 表（`opencode/packages/opencode/src/provider/provider.ts#custom`）下。通用 case 吃目錄，特殊 case 吃程式碼，維護面積小。

### Codex：反過來，只留 Responses 一種 wire

Codex 是最有啟示的反例。它的 provider 設定（`codex/codex-rs/model-provider-info/src/lib.rs#ModelProviderInfo`）可以配 baseUrl、env key、retry 參數，看似很彈性，但 `codex/codex-rs/model-provider-info/src/lib.rs#WireApi` 直接把 chat completions 移除了——config 裡寫 `wire_api = "chat"` 會拿到一段錯誤訊息，叫你改成 `"responses"` 並附上討論區連結。單一 vendor、單一 wire protocol，抽象需求大幅縮水，換來的是 request shaping 和 SSE 解析可以做得很深。這告訴你：抽象的複雜度要跟你實際支援的 provider 數量成比例。

### Claude Code：不抽象 provider，只切換視角

Claude Code（decompiled v2.1.88）根本不做多 provider。它是 Anthropic 專屬 CLI，「provider」的維度只剩部署管道：`claude-code-source/src/utils/model/providers.ts#getAPIProvider` 用環境變數決定 firstParty、bedrock、vertex 或 foundry。model 切換則是別名解析——使用者選 opus/sonnet/haiku 別名，`claude-code-source/src/utils/model/model.ts#getMainLoopModel` 和 `firstPartyNameToCanonical` 負責對應到實際型號，另外還有 main loop 與 small-fast model 分工。訂閱路徑靠 OAuth：`claude-code-source/src/services/oauth/client.ts#refreshOAuthToken` 處理 token 刷新與 profile 同步。它證明了如果商業模式就是單一 vendor，最省的抽象是不抽象。

## rivumi 的選擇與差異

先講血統：rivumi 的 provider 表不是原創，是刻意抄 pi 的。`rivumi/src/rivumi/provider_catalog.py` 開頭註解寫明 base URL「verified against @earendil-works/pi-ai's own provider source (the package pi/omp depend on)」——pi 的 packages/ai 就是源頭，rivumi 只挑了自己要的子集。

在此之上，rivumi 的取捨有三個：

**一、canonical contract 用強型別釘死。** 所有 adapter 的輸入輸出都是同一組 pydantic model：`rivumi/src/rivumi/contracts.py#Message`（role 只有 system/user/assistant）、`contracts.py#ToolCall`（arguments 保證是 dict 不是字串）、`contracts.py#Usage`（cached input 明文定義為 input 的子集）、`contracts.py#ModelTurn`。adapter 之間不可見，迴圈只認 contract。

**二、protocol 與 provider、endpoint、credential 四者分離。** `rivumi/src/rivumi/contracts.py#ModelProtocol` 列了七種值，其中六種是真的 wire：`OPENAI_CHAT`、`OPENAI_RESPONSES`、`OPENAI_CODEX_RESPONSES`、`ANTHROPIC_MESSAGES`、`GEMINI_GENERATE_CONTENT`、`WORKERS_AI_RUN`，各自對應 `rivumi/src/rivumi/models.py` 裡的一個 adapter class（`OpenAICompatibleModel`、`ResponsesModel`、`AnthropicModel`、`GeminiModel`、`WorkersAIModel`、`OpenAICodexResponsesModel`）。同一個 Ollama 端點走 openai_chat preset、Groq/OpenRouter/NVIDIA NIM 共用 openai_chat adapter、只有特定 model 強制走 Responses（`provider_catalog.py#uses_responses_protocol`），因為它們的 `/chat/completions` passthrough 會壞。

**三、錯誤在 adapter 邊界就分類完。** `rivumi/src/rivumi/models.py#ProviderErrorKind` 只有五種：retryable、auth、rate_limit、invalid_request、provider。狀態碼到分類的映射集中在 `rivumi/src/rivumi/models.py#_error_kind`，retry-after header 和 request id 一併抽出來。關鍵細節：`OpenAICompatibleModel` 建構時把 SDK 的 `max_retries=0`（`rivumi/src/rivumi/models.py#OpenAICompatibleModel`），理由寫在註解裡——重試統一由 `rivumi/src/rivumi/loop.py#AgentRunner._complete_model_with_retry` 做，否則 SDK 內建重試會加倍上游流量還繞過 audit trail。分類的好處直接兌現：retryable/rate_limit 指數退避重試，auth 和 invalid_request 立刻放棄，`retry_after_seconds` 會抬高退避下限。

與五家相比，rivumi 比 pi 多了 URL 安全驗證（`models.py#_validated_openai_base_url`：遠端必 HTTPS、HTTP 只准 loopback、拒絕 URL 內嵌憑證），比 Claude Code/Codex 多了真多 provider，但少了 native streaming。contract 外圍則多出兩個 baseline：`provider_catalog.py#estimate_cost` 用小型靜態價格表把 canonical `Usage` 換成明標 `estimated` 的成本，未知模型就回 `None`；`#role_candidates` 提供 primary、cheap、fast、summarizer、reviewer 等靜態候選。它們已接進 run/session usage 與 SDK，但價格覆蓋很窄，role label 也不是會自行學習或自動驗證品質的 production router。

## 學術依據

Provider 抽象沒有經典論文，但各家官方 API 文件本身就是最好的「方言清單」：[Anthropic Messages API](https://docs.anthropic.com/en/api/messages) 的 usage 與 cache 欄位、[OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat) 與 [Responses API](https://platform.openai.com/docs/api-reference/responses) 並存的事實（連 OpenAI 自己都分裂出兩種 wire）、[Google Gemini generateContent](https://ai.google.dev/api/generate-content) 的 functionCall 結構、[Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) 的 REST run 介面。Codex 移除 chat wire 的決策則記錄在他們自己的[討論串 #7782](https://github.com/openai/codex/discussions/7782)。工程上的教訓一致：wire protocol 的多樣性是真實且持續增加的，抽象層的存在不是過度設計，而是把方言翻譯集中到一處的必要投資。

## 改善路線

1. **Streaming**。目前 `ModelCapabilities.streaming` 恆為 False，長任務的首 token 延遲體驗差。pi 的 event stream 設計（AssistantMessageEventStream）是可以直接參考的形狀，但要先解決 non-streaming checkpoint 與 streaming 中途取消的語意衝突。
2. **擴大成本資料但保留 estimated 語意**。成本欄位與靜態表已落地，現在只覆蓋少數明確列出的模型。下一步是來源日期、alias 與 provider 覆蓋的維護流程；表內沒有的模型繼續只顯示 token，不能猜價格。
3. **動態 model discovery 泛化並與 role route 分開**。`rivumi/src/rivumi/model_catalog.py#snapshot` 已對部分目錄型 endpoint 做 TTL 快取；`role_candidates` 則是明確的靜態 metadata。未來可以擴大 discovery，但不能把「API 列得出來」誤當成「適合 reviewer 或 summarizer」。
4. **OAuth 刷新 fencing**。Codex 訂閱路徑目前是手動登入，跨程序的 token 刷新競爭還沒處理——pi 的 `Models.getAuth` 錯誤碼設計（oauth/auth 分開、保留 credential 供重試）是现成的藍圖。

一句話總結：**ModelProvider 抽象的本質不是隱藏差異，而是把差異翻譯到你唯一需要負責的那一層——contract。**

## 參考資料

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（`packages/ai/src/types.ts`、`packages/ai/src/models.ts`）— ModelProvider、SDK 包裝與 rivumi provider contract 的主要對照來源。
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)（`packages/catalog/src/provider-models/descriptors.ts`）
- [sst/opencode](https://github.com/sst/opencode)（`packages/opencode/src/provider/provider.ts`）
- [openai/codex](https://github.com/openai/codex)（`codex-rs/model-provider-info/src/lib.rs`）
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)
- [OpenAI Chat Completions API reference](https://platform.openai.com/docs/api-reference/chat)
- [OpenAI Responses API reference](https://platform.openai.com/docs/api-reference/responses)
- [Google Gemini generateContent API](https://ai.google.dev/api/generate-content)
- [Cloudflare Workers AI 文件](https://developers.cloudflare.com/workers-ai/)
- [models.dev](https://models.dev)
- [Codex：移除 chat wire_api 的討論串 #7782](https://github.com/openai/codex/discussions/7782)
- [Rivumi provider catalog（固定 commit `2ed5efb`）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/provider_catalog.py)
