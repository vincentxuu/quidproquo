---
title: "Hermes Agent 的模型供應商：訂閱制登入的帳單陷阱，以及 fallback 只會觸發一次"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, llm-providers, openrouter, anthropic, fallback, prompt-caching]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 3
tldr: "Hermes 支援 40 家以上供應商，其中「用消費者訂閱登入」的路徑最容易產生帳單意外：Anthropic OAuth 只吃 Claude Max 的加購額度、Claude Pro 根本不能用；auxiliary 任務預設 `provider: auto` 會走你的主模型，等於用貴模型做壓縮與視覺。fallback 鏈是每個 session 只觸發一次的一次性切換，不是持續重試。"
description: "Hermes Agent 的供應商層拆解：訂閱制 OAuth 的計費語意、hermes model 與 /model 的分工、auxiliary 模型的預設路由、context_length 與 max_tokens 的差別、fallback 鏈與金鑰池策略，以及一律開啟的 prompt caching。"
draft: false
---

系列第 3 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

Hermes 的供應商清單長到失去意義——官方表格光是第一方供應商就有 40 幾列，從 Nous Portal、OpenRouter、Anthropic、Gemini、Bedrock、Vertex、Azure Foundry，到 z.ai／GLM、Kimi、MiniMax、Xiaomi MiMo、騰訊 TokenHub、DeepSeek，再加上 Ollama、vLLM、SGLang、llama.cpp、LM Studio 的自架路徑。清單本身沒有討論價值（而且每個月都在長），**真正會咬人的是計費語意與 fallback 行為**。這篇只講那些。

## 用訂閱登入之前，先看清楚它扣哪一筆

現在幾家供應商都能用消費者訂閱（Claude Max、ChatGPT、SuperGrok）OAuth 登入而不是 API key。官方文件把這件事直接標成「帳單意外最常見的來源」，並列了一張很誠實的表——包括好幾格寫著「目前文件未載明」。

摘幾條會真的改變決策的：

| 路徑 | 能不能用 | 扣什麼 | 常見意外 |
|---|---|---|---|
| Anthropic — Claude Max + OAuth | ✅ 需要 Max **且**已加購 extra usage credits | 只扣你加購的 extra／overage 額度 | **Max 方案內含的額度完全不會被用到**，所有 Hermes 用量都算加購額度 |
| Anthropic — Claude Pro | ❌ 不行 | — | Pro 看起來該能用，但走不通；替代方案是 `ANTHROPIC_API_KEY` 按 token 計費 |
| OpenAI Codex — ChatGPT OAuth | ✅ 裝置碼登入 | 文件未載明 | 官方只寫認證與 token refresh，方案配額語意沒寫 |
| xAI — SuperGrok / X Premium+ OAuth | ✅ 瀏覽器登入 | 訂閱配額（X Search 明載「用訂閱配額而非 API 花費」） | 登入成功卻 `HTTP 403`——xAI 把 OAuth API 限縮在特定 SuperGrok 層級，不是 token 過期 |
| Google Gemini 消費者方案 | ❌ 無此路徑 | API key 配額 | 免費層 key 撐不了幾輪，因為 agent 一個回合可能打好幾次模型 |

最後那一行值得放大：**agent 的一個「使用者回合」不等於一次模型呼叫**。工具迴圈、壓縮、視覺分析都各自是請求，這是所有「照 chatbot 用量估算 agent 成本」都會低估的原因。

官方對這張表的態度也值得抄：標「未載明」的格子就是真的沒寫，「Don't assume — check your provider's billing dashboard, and treat these as open questions.」

## 最省錢的一個設定，多數人不知道要改

視覺分析、網頁摘要、context 壓縮、Mixture of Agents 這些側邊任務走的是所謂 **auxiliary model**。預設值是 `auxiliary.*.provider: "auto"`，而 auto 的意思是——**走你的主聊天模型**。

也就是說，如果你把主模型設成一個貴模型，那麼「把 20 萬 token 的對話壓成摘要」這件苦工也是那個貴模型在做。官方明確建議可以逐項覆寫，把這些任務丟給便宜快的模型（文件舉的例子是 OpenRouter 上的 Gemini Flash）。這是整份設定檔裡投資報酬率最高的一格。

順帶一提，auxiliary 任務可以有自己的 fallback 鏈與併發上限，跟主模型分開設定。

## `hermes model` 與 `/model` 不是同一件事

這是官方特別拉出來講的混淆點：

| 指令 | 在哪裡跑 | 做什麼 |
|---|---|---|
| `hermes model` | 終端機（session 外） | 完整設定精靈：新增供應商、跑 OAuth、輸入金鑰、設定端點 |
| `/model` | 在對話中 | 只在**已設定好的**供應商／模型之間快速切換 |

想切到還沒設定過的供應商，`/model` 幫不了你——得先離開 session 跑 `hermes model`。

## `context_length` 與 `max_tokens` 是兩件事

官方文件用一個 note 把這個經典誤解釘死：

> **`context_length`** is the **total context window** — the combined budget for input *and* output tokens… **`model.max_tokens`** is the **output cap**.

前者決定 Hermes 什麼時候該壓縮歷史，後者只管單次回應能多長。Anthropic 自己也把原生 API 的 `max_tokens` 改名成 `max_output_tokens` 來止血。

Hermes 偵測 context window 走一條九層解析鏈：設定覆寫 → 自訂供應商的 per-model 設定 → 持久快取 → 端點 `/models` → Anthropic `/v1/models` → OpenRouter → Nous Portal 後綴比對 → [models.dev](https://models.dev)（3800+ 模型、100+ 供應商）→ 家族模式預設 128K。

這條鏈之所以要這麼長，是因為**同一個模型在不同供應商手上 context 不一樣**——官方舉的例子是 `claude-opus-4.6` 在 Anthropic 直連是 1M，在 GitHub Copilot 是 128K。你以為的模型能力其實是「模型 × 供應商」的能力。

## Fallback：一次性切換，不是持續重試

```yaml
fallback_providers:
  - provider: openrouter
    model: anthropic/claude-sonnet-4
  - provider: anthropic
    model: claude-sonnet-4
```

主模型遇到限流、伺服器錯誤或認證失敗時，Hermes 會沿著這條鏈往下換，**中途換掉 model 與 provider 但不丟掉對話**。關鍵細節在官方一句話裡：

> The chain is tried entry-by-entry; activation is one-shot per session.

一個 session 只會啟動一次。所以 fallback 是「保命」不是「負載平衡」——想要後者要用 OpenRouter 的 provider routing 或 LiteLLM。

另一個相關陷阱在官方的除錯表裡：**「模型無法使用或出現奇怪的 fallback 行為」的建議解法是「先把 routing 關掉，等基礎供應商穩定再說」**。新裝機時把 routing、fallback 一起開，出事會分不清是哪一層。

同一個供應商有多把金鑰時則是另一組設定：

```yaml
credential_pool_strategies:
  openrouter: round_robin    # 平均輪替
  anthropic: least_used      # 挑用最少的
```

可選 `fill_first`（預設）、`round_robin`、`least_used`、`random`。

## Prompt caching：沒有開關，永遠開著

這點對成本影響很大而且完全不需要設定。Claude 走原生 Anthropic、OpenRouter 或 Nous Portal 時，Hermes 會在 system prompt 與 skill 區塊掛上 `cache_control` 斷點，TTL 一小時。同一小時內**跨 session、跨 fork 出去的 subagent** 都吃得到快取讀取價。

阿里雲 DashScope 上游只給 5 分鐘 TTL，Hermes 就降到 5 分鐘；Bedrock 與 Azure Foundry 回落到供應商自己的預設；xAI 用的是另一套 session-pinned conversation-id 機制。唯一的旋鈕是 `prompt_caching.cache_ttl`，只吃 `"5m"` 與 `"1h"` 兩個值，其他一律忽略。

官方講得直白：沒有關閉的開關，因為**光是 system prompt 就佔輸入 token 的可觀比例**，單輪對話也划算。

## OpenRouter 專屬的兩把刀

`provider_routing` 可以指定 `sort: "price" | "throughput" | "latency"`、白名單／黑名單／排序，以及 `data_collection: "deny"` 排除可能拿你資料訓練的供應商——最後這個對企業環境是硬需求。快捷寫法是模型名後綴 `:nitro`（吞吐）或 `:floor`（價格）。

另外還有實驗性的 `openrouter/pareto-code` 路由器，用 Artificial Analysis 的排名自動挑「達到編碼品質門檻的最便宜模型」，門檻用 `min_coding_score`（0–1，預設 0.65）控制。要注意它的選擇會隨 Pareto 前緣移動而變——同一個分數在不同日子可能給你不同模型，**這對可重現性是負面的**。

## 自架與本地

Ollama、vLLM、SGLang、llama.cpp、LM Studio 都是第一級路徑，官方也給了選型表：想單純能動用 OpenRouter 或 Nous Portal；本地簡單用 Ollama；正式 GPU 服務用 vLLM 或 SGLang；隱私最大化就全本地。WSL2 使用者要另外處理網路（文件有專節）。

自架端點最常見的失敗模式官方也寫在除錯表裡：「自訂端點『能動』但回垃圾」——base URL 錯、模型名錯，或那個端點根本不是 OpenAI 相容。**先用別的 client 驗過端點再接進來**。

## 這篇的結論

供應商層真正需要決策的只有三件事：**你的錢從哪個口袋出**（訂閱加購額度 vs API 按量 vs 統一訂閱）、**苦工任務跑在哪個模型上**（auxiliary 別留 auto）、**壞掉時退到哪裡**（fallback 是一次性保命）。其餘都是清單，會過期，看[官方 Providers 頁](https://hermes-agent.nousresearch.com/docs/integrations/providers)。

下一篇談 [Nous Tool Gateway](/posts/ai/2026-08-18-hermes-agent-tool-gateway)——用一份訂閱換掉 Firecrawl／FAL／OpenAI TTS／Browser Use 四個帳號的那個東西。

## 參考資料

- [Hermes Agent — AI Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Nous Portal](https://portal.nousresearch.com/)
- [OpenRouter — Provider Routing](https://openrouter.ai/docs/features/provider-routing)
- [OpenRouter — Pareto Router](https://openrouter.ai/docs/guides/routing/routers/pareto-router)
- [models.dev — 模型 metadata 註冊表](https://models.dev)
- [Artificial Analysis](https://artificialanalysis.ai/)
