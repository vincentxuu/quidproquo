---
title: "Portkey：把 LLM 路由、觀測與治理收進同一個 AI Gateway"
date: 2026-08-22
category: ai
type: deep-dive
tags: [portkey, ai-gateway, llm-routing, observability, guardrails, openai-compatible]
lang: zh-TW
tldr: "Portkey 是放在應用程式與模型供應商之間的 AI Gateway：用一個 OpenAI 相容端點統一路由、fallback、用量紀錄、預算與 guardrails，也能自行架設開放原始碼 gateway。"
description: "介紹 Portkey AI Gateway 的定位、路由設定、觀測與治理能力，以及它和 OpenRouter、LiteLLM、9Router 的差別與適用情境。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-portkey-ai-gateway-en)

[Portkey](https://portkey.ai/docs/product/ai-gateway) 是放在應用程式與模型供應商之間的 AI Gateway。它不訓練模型，也不是另一家賣 token 的推論服務；它接住原本要送往 OpenAI、Anthropic、Google 或自架模型的請求，在中間處理路由、重試、fallback、用量紀錄、預算與安全規則。

這個定位很重要。OpenRouter 解決的是「用一組帳號購買並呼叫多家模型」，Portkey 解決的則是「團隊已經有多家供應商帳號，怎麼用一致的政策管理流量」。兩者都提供統一 API，責任邊界卻不一樣。

## 核心不是轉送，而是控制平面

直接呼叫一家 LLM API 時，程式只需要 endpoint、API key 與 model name。接到第二家之後，問題開始變多：429 要不要換供應商、逾時要重試幾次、哪個團隊花了多少錢、敏感內容能不能送出、切模型後能不能沿用同一套追蹤欄位。

Portkey 把這些跨供應商的問題集中在 gateway。官方文件列出的能力包括條件路由、負載平衡、fallback、重試、circuit breaker、快取、rate limit、budget limit 與 canary testing。應用程式送出一次請求，gateway 依一份 config 決定實際去向；政策改動不必散落在每個服務的程式碼裡。

資料流可以簡化成這樣：

```text
Web / API / Agent
        │ OpenAI-compatible request
        ▼
Portkey AI Gateway
  ├─ route / retry / fallback
  ├─ budget / rate limit / guardrail
  └─ logs / traces / cost attribution
        │
        ├── OpenAI
        ├── Anthropic
        ├── Google
        └── private model endpoint
```

它帶來的代價也在這張圖裡：gateway 成為新的關鍵路徑。要採用它，就要決定用 Portkey 託管端點、自行架設開放原始碼 gateway，或購買企業部署方案；同時確認 prompt、response、log 與金鑰各自會經過哪個資料平面。

## 用 OpenAI 相容介面接入

[Portkey 的相容性指南](https://portkey.ai/docs/integrations/libraries/openai-compatible)把最小改動縮成兩個設定：將 base URL 改成 `https://api.portkey.ai/v1`，API key 換成 Portkey key。供應商與模型可以用 `@provider-slug/model-name` 表示。

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.portkey.ai/v1',
  apiKey: process.env.PORTKEY_API_KEY,
});

const response = await client.chat.completions.create({
  model: '@openai-prod/gpt-4o',
  messages: [{ role: 'user', content: '把這份事件紀錄整理成三點。' }],
});

console.log(response.choices[0].message.content);
```

這個範例只完成「請求經過 Portkey」。正式環境更有價值的做法，是先在 Model Catalog 建立供應商整合，再把路由政策做成 config。如此一來，應用程式不必持有各家原始金鑰，也不需要知道 fallback 順序。

## Fallback 是一棵策略樹

[Fallback 文件](https://portkey.ai/docs/product/ai-gateway/fallbacks)允許你排出有優先順序的模型或供應商，也能指定只在 429、503 等狀態碼出現時切換。每個 target 還能嵌套 load balancer、conditional router 或另一組 fallback。

```json
{
  "strategy": {
    "mode": "fallback",
    "on_status_codes": [429, 503]
  },
  "targets": [
    { "override_params": { "model": "@openai-prod/gpt-4o" } },
    { "override_params": { "model": "@anthropic-prod/claude-sonnet" } }
  ]
}
```

這比在應用程式裡寫一串 `try/catch` 更容易統一維護，但「API 格式相容」不代表「模型行為相同」。兩個模型的 tool calling、結構化輸出、context window 與安全拒答可能不同。fallback 上線前，至少要用同一組 golden prompts 跑過主模型和備援模型；如果輸出會被程式解析，也要對 schema 做自動驗證。

## 觀測、成本與治理是另一半產品

Portkey 會記錄每次請求的 token、延遲與成本，並讓團隊以 trace 或 config 追查一次 fallback 鏈中的多次嘗試。這比只看供應商帳單多一層應用脈絡：你能知道哪個功能、環境或團隊造成花費，而不只是知道某支 API key 花了多少。

成本控制不能只看功能名稱。[Budget Limits 文件](https://portkey.ai/docs/product/ai-gateway/virtual-keys/budget-limits)指出，部分預算功能只供 Enterprise 與特定 Pro 使用者使用；如果某個模型沒有價格資料，成本欄顯示為零時也不會計入金額型上限。正式採購前要逐項確認方案權限，不能把「產品支援 budget」直接理解為「目前方案一定能硬性阻擋超支」。

安全面也是同一個原則。Guardrails 可以把 PII、內容過濾或組織政策放進共同入口，但它不會自動證明你的系統合規。你仍要確認 log 保存期限、資料位置、RBAC、原始供應商政策，以及自行架設時誰負責升級與事件處理。

## 跟 OpenRouter、LiteLLM、9Router 怎麼分

| 工具 | 主要角色 | 金鑰與帳務 | 最適合的情境 |
|---|---|---|---|
| [Portkey](https://portkey.ai/docs/product/ai-gateway) | 託管或自架的 gateway 與治理平台 | 可集中管理既有供應商整合 | 團隊要路由、觀測、預算與政策 |
| [OpenRouter](https://openrouter.ai/docs/quickstart) | 多模型聚合 API | 向 OpenRouter 儲值並用一組 key | 想最快取得多家模型，不想逐家開帳號 |
| [LiteLLM](https://docs.litellm.ai/) | 開放原始碼 SDK 與 proxy | 通常使用自己的供應商 key | 想自行掌握相容層與部署 |
| [9Router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction) | 本機 coding CLI router | 本機管理 API key 與部分訂閱 token | 個人同時使用 Claude Code、Cursor、Codex 等工具 |

如果只是要試十種模型，先用聚合 API 通常比較快。如果已經有 AWS、Google Cloud 與 OpenAI 的企業合約，問題是權限、成本歸屬與故障切換，Portkey 的控制平面才開始顯出價值。如果團隊明確要求所有資料與控制元件都留在自己的環境，LiteLLM 或 Portkey 的自行架設選項值得做一輪部署與維運成本比較。

## 整體來說

Portkey 適合的不是「第一次呼叫 LLM API」，而是「同一家公司已經有很多地方在呼叫」。當模型、金鑰、團隊與環境變多，散落在各服務裡的重試和成本紀錄會變成維運負債；gateway 能把它們收回一個可觀測、可套政策的入口。

最小驗證方式很具體：挑一條非關鍵流量，先只改 base URL 並開啟紀錄；確認延遲與資料處理邊界後，再加入一組只對 429／503 生效的 fallback。不要第一天就把所有模型、guardrail 與預算規則一次搬進去，否則出錯時很難知道是模型、政策還是 gateway 本身造成的。

想比較實際模型費率，可以接著看[本站整理的 40+ 家 LLM 推論服務定價](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)；如果用途只限本機 coding agent，則先看 [9Router 介紹](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)。

## 參考資料

- [Portkey AI Gateway](https://portkey.ai/docs/product/ai-gateway)
- [Portkey：任何 OpenAI 相容專案的接入方式](https://portkey.ai/docs/integrations/libraries/openai-compatible)
- [Portkey Fallbacks](https://portkey.ai/docs/product/ai-gateway/fallbacks)
- [Portkey Budget Limits](https://portkey.ai/docs/product/ai-gateway/virtual-keys/budget-limits)
- [Portkey AI Gateway GitHub](https://github.com/Portkey-AI/gateway)
- [站內：9Router 本地三層 fallback 路由器](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)
- [站內：40+ 家 LLM 推論服務免費額度與定價](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
