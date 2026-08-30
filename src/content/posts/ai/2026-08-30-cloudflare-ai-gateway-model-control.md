---
title: "Cloudflare AI Gateway 怎麼用：Logging、Cache、Rate Limit 與 Fallback"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, cloudflare-ai-gateway, cloudflare-workers-ai, llm, observability, model-routing]
lang: zh-TW
tldr: "AI Gateway 解的是 AI 呼叫的控制問題：同一層處理 logs、analytics、cache、rate limit、retry/fallback、BYOK 與 Unified Billing。Workers 內可用 env.AI.run(..., { gateway })，外部 SDK 則改 baseURL 或 provider-native endpoint。"
description: "從 Workers binding、REST API、provider-native endpoint 到 cache、rate limiting、dynamic routing、BYOK 與 Unified Billing，拆解 Cloudflare AI Gateway 適合放在 AI app 哪一層，以及哪些限制要先知道。"
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 4
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 20
---

> 🌏 [English version](/posts/ai/2026-08-30-cloudflare-ai-gateway-model-control-en)

你把第一個 [Workers AI](https://developers.cloudflare.com/workers-ai/) demo 跑起來後，下一個問題通常會從「模型會不會回」變成「這些 LLM 呼叫出了事要怎麼查、爆量要怎麼擋、成本要怎麼看、換 provider 時程式要不要大改」。[Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) 就放在這裡：它是 AI app 的模型呼叫控制層，幫你把 logs、analytics、cache、rate limit、retry/fallback、provider key 與 billing 放到同一個入口。

這篇不把它當成「多一個模型 API」介紹。比較準確的看法是：你的 Worker、Agent、後端服務或前端 SDK 仍然呼叫模型，但請求先經過 AI Gateway。Gateway 記錄這次呼叫、套用快取與限制、必要時改走備援模型，最後再把結果回傳。

## 放在哪一層

AI Gateway 最適合放在「應用程式邏輯」和「模型 provider」中間。

```txt
Client / Cron / Queue
        |
        v
Cloudflare Worker or Agent
        |
        v
AI Gateway
        |
        +--> Workers AI
        +--> OpenAI / Anthropic / Google AI Studio / Groq / Mistral / ...
```

這層解的問題很實際：

- **觀測**：看每次 request 的 provider、model、token、cost、latency、status code。
- **成本控制**：用 cache、rate limit、budget limit 和 dynamic route 擋掉失控流量。
- **provider 管理**：同一個 gateway 可接 [Workers AI](https://developers.cloudflare.com/workers-ai/)、OpenAI、Anthropic、Google AI Studio、Groq、Mistral、OpenRouter、Perplexity 等 [provider](https://developers.cloudflare.com/ai-gateway/usage/providers/)。
- **金鑰集中管理**：用 [BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/) 把 provider API key 放在 Cloudflare 端，程式不用直接帶第三方金鑰。
- **帳務整合**：用 [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) 透過 Cloudflare credits 呼叫支援的 provider。

如果你只有一個內部腳本、每天打十次模型，直接 call provider API 就好。AI Gateway 開始有價值的時間點，是你有使用者、有多個模型、有 production logs 要查，或你希望把 AI 成本限制寫成平台規則。

## 三種接法

### 1. Workers AI binding

在 Worker 裡用 [AI Gateway Workers binding](https://developers.cloudflare.com/ai-gateway/usage/worker-binding-methods/) 是最順的路。你仍然呼叫 `env.AI.run()`，只是在第三個參數加上 `gateway`。

```ts
export default {
  async fetch(request, env) {
    const result = await env.AI.run(
      "@cf/zai-org/glm-5.3-flash",
      {
        messages: [
          { role: "system", content: "Reply in Traditional Chinese." },
          { role: "user", content: "用三句話解釋 AI Gateway。" },
        ],
      },
      {
        gateway: {
          id: "default",
          cacheTtl: 300,
          metadata: {
            app: "blog-demo",
            feature: "summary",
          },
        },
      },
    );

    return Response.json({ result, logId: env.AI.aiGatewayLogId });
  },
};
```

這種寫法的好處是 Worker 內部不需要自己組 AI Gateway URL，也能拿到 `env.AI.aiGatewayLogId`，之後用 `env.AI.gateway("default").getLog(logId)` 或 `patchLog()` 補 metadata。要注意一個細節：第三方模型也可以透過 AI binding 呼叫，但官方文件要求走 AI Gateway 與 Unified Billing；如果你要用非 `default` 的 BYOK alias，得改走 provider-native endpoint 並加 `cf-aig-byok-alias`。

### 2. REST API

如果你只用 Cloudflare 的 REST API，最少要有 Account ID、API token，權限包含 `AI Gateway - Read`、`AI Gateway - Edit` 與 `Workers AI - Read`。Workers AI 的 chat completions 可用 `/ai/v1/chat/completions`，並在 header 帶 `cf-aig-gateway-id`。

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/v1/chat/completions" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "cf-aig-gateway-id: default" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "@cf/zai-org/glm-5.3-flash",
    "messages": [
      { "role": "user", "content": "Summarize this issue." }
    ]
  }'
```

Cloudflare 會自動建立 `default` gateway。這對快速驗證很好，但 production 建議自己建立具名 gateway，之後 analytics、rate limit、routes 和 log retention 才不會全部混在一起。

### 3. Provider-native endpoint

如果你已經用 OpenAI SDK、Anthropic SDK 或 Vercel AI SDK，通常不想重寫呼叫格式。AI Gateway 的 [provider-specific endpoint](https://developers.cloudflare.com/ai-gateway/get-started/) 可以保留原本的 payload，只改 `baseURL`：

```ts
import OpenAI from "openai";

export default {
  async fetch(request, env) {
    const gateway = env.AI.gateway("production");

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: gateway.getUrl("openai"),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Draft a release note." }],
    });

    return Response.json(response);
  },
};
```

Provider-native endpoint 適合現有 app 漸進導入：先把 base URL 換到 Gateway，看 logs 與成本，再慢慢加 cache、rate limit、BYOK 或 dynamic routing。

## Logging 與 Analytics：先知道錢花去哪

[AI Gateway analytics](https://developers.cloudflare.com/ai-gateway/observability/analytics/) 會整理 requests、token usage、cost、errors、cached responses 等指標。Dashboard 可以看，GraphQL 也能查。對一個 AI app 來說，這比「我大概知道模型很貴」有用得多，因為你可以照 feature、user、team、tenant 或 experiment 分組。

[Logging](https://developers.cloudflare.com/ai-gateway/observability/logging/) 更細：單次 request 會記 provider、timestamp、status、token、cost、duration、user agent，也可記 prompt 與 response。這裡要先決定隱私策略。Logs 預設啟用；如果不想收 raw payload，可以在單次 request 用 `cf-aig-collect-log-payload: false`，保留 metadata 但不存 prompt/response。若整筆 log 都不想收，才用 `cf-aig-collect-log: false`。

實務上我會把 metadata 當成必填：

```ts
gateway: {
  id: "production",
  metadata: {
    app: "support-copilot",
    tenant: tenantId,
    feature: "answer-draft",
    experiment: "rerank-v2",
  },
}
```

這樣出問題時可以直接問：「是哪個 tenant 的哪個 feature 花最多錢？」而不是只看到一串模型呼叫。

## Cache：便宜，但只吃完全相同的請求

[AI Gateway caching](https://developers.cloudflare.com/ai-gateway/features/caching/) 適合重複 prompt、固定分類、文件摘要、evaluation fixture 這類情境。它支援文字與圖片 response，預設關閉。命中狀態會出現在 `cf-aig-cache-status: HIT` 或 `MISS`。

最大的限制是「完全相同」。預設 cache key 會看 provider、endpoint、model、provider auth header 和完整 request body。只要 messages、tools、temperature、metadata 或任一參數不同，就會是另一筆 cache。這點對聊天式 app 很重要：使用者多輪對話通常每次 context 都不同，cache 命中率不會自然變高。

可調參數有三個：

- `cf-aig-skip-cache`：單次跳過 cache。
- `cf-aig-cache-ttl`：設定 TTL，官方限制最短 60 秒、最長一個月。
- `cf-aig-cache-key`：自訂 cache key；一旦用了 custom key，就等於這次 request 選擇進 cache。

Workers binding 對應到 `skipCache`、`cacheTtl`、`cacheKey`。我會把它用在「輸入可穩定 canonicalize」的地方，例如同一份文件同一版號的摘要：

```ts
const digest = await env.AI.run(model, payload, {
  gateway: {
    id: "production",
    cacheKey: `doc-summary:${docId}:${docVersion}`,
    cacheTtl: 24 * 60 * 60,
  },
});
```

不要把 cache 當成免費的 semantic cache。AI Gateway 是 exact request cache；如果你要相似問題命中同一份答案，需要另外做 embedding、retrieval 或應用層 canonicalization。

## Rate limit、budget 與 dynamic routing

[Rate limiting](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/) 可以在 gateway 層設定固定或 sliding window。超過就回 `429 Too Many Requests`。最基本的設定是每個 gateway 每分鐘最多多少 requests；更實用的做法，是搭配 metadata 或 route，把免費使用者、付費使用者、內部 job 分開。

更進一步是 [Dynamic Routing](https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/)。你可以在 Dashboard 或 JSON 裡定義 route flow：條件判斷、百分比分流、模型節點、rate limit、budget limit、fallback。常見用法：

- 免費方案走便宜模型，付費方案走高品質模型。
- 某個 team 每天預算用完後，改走小模型或直接拒絕。
- 新模型先 5% 流量 A/B，穩定後再放大。
- 主要 provider 失敗時，fallback 到另一個 provider。

這個功能有兩個現階段限制要記：Dynamic Routing 需要 authenticated gateway 與 BYOK；官方文件也明講，目前 dynamic routes 要走 OpenAI-compatible `/compat/chat/completions` endpoint，還沒有放到一般 REST API。也就是說，若你只是單模型呼叫，REST API 是新路；若你要 route flow，暫時仍要照 dynamic routing 文件的 compat endpoint 走。

## BYOK、Unified Billing 與 Secrets Store

AI Gateway 處理 provider key 有三種優先順序（見 [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)）：request 直接帶 provider key、Gateway 內的 BYOK default alias、最後才是 Unified Billing。

[BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/) 的主要價值在 key 管理，不在折扣。Cloudflare 會把 provider key 存在 [Secrets Store](https://developers.cloudflare.com/secrets-store/)，程式呼叫 Gateway 時帶 Cloudflare 的 gateway authorization，Gateway 再替你附上 provider key。命名慣例是 `{gateway_id}_{provider_slug}_{alias}`，例如 `production_openai_default`。

Unified Billing 則是另一種帳務模型：你先買 AI Gateway credits，Cloudflare 代你對支援的 provider 付費，provider token 價格照轉，購買 credits 時收 5% fee。這適合想把 Workers AI、OpenAI、Anthropic、Google AI Studio 等費用收到同一張 Cloudflare 帳單的團隊。要注意兩件事：Workers AI 要切到 Unified billing 才會吃 AI Gateway credits；Unified Billing 有每 gateway `200 requests / 60s` 的 rate limit，BYOK 流量不算在這個限制內。

選法很簡單：

- 已經有 provider 合約、需要控 key rotation：用 BYOK。
- 想少管 provider 帳號與付款：用 Unified Billing。
- 仍在開發測試、量很小：先直接帶 provider key 也可以，但 production 前要回頭整理。

## 在 AI app 裡怎麼搭

如果把 Cloudflare AI Stack 拆成應用層，AI Gateway 通常不是第一個服務，卻是最早該補上的橫切層：

```txt
Workers / Agents        request orchestration
AI Gateway              logs, cache, limits, routes, keys, billing
Workers AI              inference on Cloudflare
Vectorize / AI Search   retrieval
D1 / Durable Objects    app state, sessions, coordination
R2                      files, datasets, eval artifacts
Queues / Workflows      async jobs and long-running steps
```

幾個具體建議：

- **RAG app**：embedding 與 rerank 可以走 Workers AI；生成模型經 AI Gateway。把 `corpus_id`、`retrieval_version`、`tenant` 放到 metadata，之後才看得出哪版 retrieval 花錢但沒品質。
- **Agent app**：每次 tool loop 內的模型呼叫都經 Gateway。用 rate limit 或 budget limit 保護單一 session，不讓壞 prompt 或 bug 把預算燒完。
- **內容生成 app**：摘要、分類、標籤這類可重複任務加 cache key；長文生成不一定有 cache 命中，重點放 logs 與 fallback。
- **多 provider app**：先用 provider-native endpoint 讓既有 SDK 維持原樣，再用 Dynamic Routing 做 A/B 與 fallback。

AI Gateway 不會替你解 prompt quality、RAG chunking、模型評測或資料權限隔離。那些仍然要在應用層、AI Search/Vectorize 層、D1/DO 狀態層處理。它補上的，是 production AI app 最容易晚一步才想到的控制面。

## 先做的檢查清單

導入 AI Gateway 前，我會先把這幾件事定下來：

- 每個 app / env / tenant 要共用 gateway，還是分開 gateway。
- metadata schema：至少包含 app、env、feature、tenant 或 user tier。
- logging 策略：是否存 prompt/response；敏感資料是否只留 metadata。
- cache 策略：哪些任務有穩定 cache key，TTL 多久。
- limit 策略：免費、付費、內部 job 的 request/budget 上限。
- key 策略：直接帶 provider key、BYOK，或 Unified Billing。
- fallback 策略：哪些錯誤可以重試，哪些要換模型，哪些要直接失敗。

AI Gateway 的好處不在讓 demo 變快；它讓 demo 進 production 後還看得懂、控得住。只要你的 AI app 開始有真使用者，這一層就該早點放進架構圖。

## 參考資料

- [Cloudflare AI Gateway — Overview](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare AI Gateway — Get started](https://developers.cloudflare.com/ai-gateway/get-started/)
- [Cloudflare AI Gateway — Workers binding methods](https://developers.cloudflare.com/ai-gateway/usage/worker-binding-methods/)
- [Cloudflare AI Gateway — Providers](https://developers.cloudflare.com/ai-gateway/usage/providers/)
- [Cloudflare AI Gateway — Caching](https://developers.cloudflare.com/ai-gateway/features/caching/)
- [Cloudflare AI Gateway — Rate limiting](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/)
- [Cloudflare AI Gateway — Dynamic routing](https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/)
- [Cloudflare AI Gateway — Analytics](https://developers.cloudflare.com/ai-gateway/observability/analytics/)
- [Cloudflare AI Gateway — Logging](https://developers.cloudflare.com/ai-gateway/observability/logging/)
- [Cloudflare AI Gateway — Bring your own keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)
- [Cloudflare AI Gateway — Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)
- [Cloudflare AI Gateway — Limits](https://developers.cloudflare.com/ai-gateway/reference/limits/)
- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
