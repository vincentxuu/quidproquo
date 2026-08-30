---
title: "Cloudflare Secrets Store 怎麼用：Workers secret reuse 與 AI Gateway BYOK"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, secrets-store, ai-gateway, workers, byok, security]
lang: zh-TW
tldr: "Secrets Store 是 Cloudflare 的 open beta account-level secret store，目前整合 Workers 和 AI Gateway。它適合把 provider API keys、BYOK key、跨 Worker 共用 secret 集中管理；per-Worker secret 仍可用，但治理範圍不同。"
description: "從 Cloudflare Secrets Store 的 account-level secrets、Workers binding、local/production 差異、權限、AI Gateway BYOK、key alias 與 rotation，拆解它在 Cloudflare AI Stack 裡的角色。"
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 11
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 24
---

> 🌏 [English version](/en/posts/ai/2026-08-30-cloudflare-secrets-store-ai-gateway-byok-en)

AI app 很快就會長出一堆 secret：OpenAI key、Anthropic key、Gemini key、webhook secret、GitHub token、internal API token、tenant 專用 provider key。如果每個 Worker 各自放一份，rotation、權限、環境分離和 audit 都會變得混亂。

[Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/) 提供的是 account-level secret store。官方文件標示它目前是 open beta，secret 會加密並存放在 Cloudflare data centers，目前整合 [Workers](https://developers.cloudflare.com/secrets-store/integrations/workers/) 和 [AI Gateway BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)。這篇放在 AI Stack，是因為 AI app 的 provider keys 和 BYOK 管理會很早變成 production 問題。

從 security 角度看，重點不只在「把 key 放到另一個地方」。Secrets Store 把建立、綁定、讀取、rotation、revoke 和 audit 拉到同一個治理層。

## 和 per-Worker secret 的差別

Cloudflare Workers 原本就有 Variables and Secrets，可以把 secret 綁在單一 Worker 上。Secrets Store 的不同點在於它是 account-level，可被多個 Worker 或 AI Gateway 設定重用。

| 類型 | 範圍 | 適合 |
|---|---|---|
| Workers Variables and Secrets | per Worker | 單一服務自己的 secret |
| Secrets Store | account-level | 多個 Worker 共用、AI Gateway BYOK、集中 rotation |

如果只有一個 Worker，需要一把 webhook secret，per-Worker secret 就夠。當你有多個 Workers、staging/production、多個 AI provider、或 AI Gateway 要幫你代管 provider key，Secrets Store 的治理價值才會出現。

## Workers integration：用 binding 取 secret

建立 account secret 時，需要 Super Administrator 或 Secrets Store Admin role。透過 Wrangler 建立 secret 的形式如下：

```bash
npx wrangler secrets-store secret create <STORE_ID> \
  --name OPENAI_API_KEY \
  --scopes workers \
  --remote
```

然後在 Worker 的 Wrangler config 綁定：

```jsonc
{
  "secrets_store_secrets": [
    {
      "binding": "OPENAI_KEY",
      "store_id": "<STORE_ID>",
      "secret_name": "OPENAI_API_KEY"
    }
  ]
}
```

Worker 裡要用 async `get()` 讀值：

```ts
export default {
  async fetch(request, env): Promise<Response> {
    const apiKey = await env.OPENAI_KEY.get();

    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response;
  },
} satisfies ExportedHandler;
```

這裡有兩個邊界。第一，production secrets 無法直接從 local development 讀取；local 要用沒有 `--remote` 的 `secrets-store secret` commands 建本地 secret。第二，能建立 secret、能 deploy binding、能讀 secret 的權限要分開看。官方 Workers integration 文件列出 bind account secret 到 Worker 需要 Super Administrator 或 Secrets Store Deployer。

## AI Gateway BYOK：key 不再跟 request 一起送

Secrets Store 和 AI Gateway 的關係更直接。AI Gateway 的 BYOK 功能會把 AI provider API keys 存在 Secrets Store，讓 request 不需要每次帶 provider authorization header。

傳統做法：

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai/chat/completions \
  -H "cf-aig-authorization: Bearer {CF_AIG_TOKEN}" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[]}'
```

BYOK 後：

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai/chat/completions \
  -H "cf-aig-authorization: Bearer {CF_AIG_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[]}'
```

provider key 變成 gateway configuration 裡的 secret。應用程式仍要帶 `cf-aig-authorization`，但不再直接碰 OpenAI / Anthropic / Gemini key。這會降低 key exposure，也讓 rotation 不需要改程式或 redeploy app。

AI Gateway 也支援同 provider 多把 key，用 alias 區分。預設用 `default` alias；direct provider-passthrough request 可以用 `cf-aig-byok-alias` 指定其他 key。官方文件提醒，Unified Billing endpoints 只看 `default` alias；如果 `default` key 不存在，request 會 fall through 到 Unified Billing。

## 命名和 rotation 要先設計

如果從 dashboard 加 provider key，AI Gateway 會自動建立並命名 Secrets Store secret。如果用 API，secret name 要符合：

```txt
{gateway_id}_{provider_slug}_{alias}
```

例如：

```txt
my-gateway_anthropic_default
```

官方文件也說，AI Gateway runtime lookup 不用 `secret_id`，所以 API-created secret 必須符合命名慣例。

我會把 key rotation 做成固定流程：

1. 建立新 provider key。
2. 在 Secrets Store / AI Gateway 更新 key。
3. 用 gateway test request 確認新 key 可用。
4. 看 AI Gateway logs / metrics 是否有 error spike。
5. 刪除舊 key。

不要把 rotation 做成「某個人去 dashboard 手動換一下」。AI provider key 一旦被 agent tool、browser automation、sandbox code 或 webhook 用到，錯誤會擴散到很多地方。

## 在 AI app 裡的 secret 分層

我會這樣切 secret：

- AI provider API key：Secrets Store + AI Gateway BYOK。
- Cloudflare AI Gateway auth token：Workers secret 或 Secrets Store，依是否跨 Worker 共用決定。
- tenant BYOK：需要 tenant isolation、alias、審計與刪除流程，不要混在同一把 default key。
- webhook secret：通常綁定到特定 Worker 或特定 integration。
- Sandbox / Browser tool credential：盡量不要進 sandbox；能由 Worker outbound handler 加上的 secret，就留在 Worker。
- 非敏感 config：用 Wrangler `vars`，不要塞 Secrets Store。

Secrets Store 的價值在於治理，不在於把所有變數都變成 secret。非敏感資料放進 secret store 只會讓部署和 debug 變難。

## 風險：集中管理也代表集中爆炸半徑

Account-level secret reuse 很方便，也會放大權限錯誤。幾個基本規則：

- secret name 不要包含敏感值。
- scope 只開需要的產品，例如 `workers`。
- deployer 權限和 secret admin 權限分開。
- local、staging、production 用不同 secret。
- 不在 log、Analytics Engine、R2 artifact 裡寫出 secret。
- agent tool 或 sandbox 需要外部 API 時，先問能不能由 Worker proxy。
- rotation 和 deletion 要有 runbook。

Cloudflare 文件也註明 Secrets Store 不在 Cloudflare China Network 可用。若產品需要中國網路部署，這是架構限制，不是最後再補的部署細節。

## 和 AI Gateway、Agents 的關係

在 Cloudflare AI Stack 裡，Secrets Store 通常不是第一個服務，但它會很早變重要：

1. Workers AI 可以先不用外部 provider key。
2. AI Gateway 接 OpenAI / Anthropic / Gemini 後，BYOK 開始需要 Secrets Store。
3. Agents 接 Browser、Sandbox、MCP 後，tool credential 變多。
4. 多 tenant 或 customer-owned key 出現後，secret isolation 和 audit 變成產品功能。

Secrets Store 的角色不該變成讓 agent 自己讀更多金鑰。它比較適合用來減少金鑰暴露面，讓 app、gateway、tooling 用受控方式取得必要能力。

## 什麼時候先不用

我會先不用 Secrets Store 的情境：

- 只有單一 Worker 和一兩把 per-service secret。
- 還沒有 AI Gateway BYOK。
- 團隊沒有分角色管理 secret 的需求。
- 本地開發流程還沒整理好，導致 production/local secret 混用。
- 產品還沒準備好 rotation、revoke、audit 和 tenant deletion。

一旦 AI app 開始接多個 provider、多個 Worker、多個 agent tool，Secrets Store 就從「方便」變成「需要」。它把 secret 從每個程式的環境變數，拉到 Cloudflare account 的治理層。

## 參考資料

- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
- [Secrets Store Workers integration](https://developers.cloudflare.com/secrets-store/integrations/workers/)
- [AI Gateway BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Workers Variables and Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Secrets Store access control](https://developers.cloudflare.com/secrets-store/access-control/)
