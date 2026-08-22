---
title: "OpenRouter：一把 API Key 串起多模型與多供應商的 LLM 路由層"
date: 2026-08-22
category: ai
type: deep-dive
tags: [openrouter, llm-routing, llm-inference, openai-compatible, api-gateway]
lang: zh-TW
tldr: "OpenRouter 用 OpenAI 相容 API 統一多家模型與推論端點，並把供應商排序、故障切換、BYOK 與零資料保留政策放進同一套路由規則。"
description: "深入介紹 OpenRouter 的統一 API、模型與供應商雙層路由、fallback、BYOK、成本與隱私控制，以及它適合和不適合的專案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-openrouter-model-routing-en)

[OpenRouter](https://openrouter.ai/) 是介於應用程式與模型供應商之間的雲端路由層。你的程式只接一個 API，背後可以選 OpenAI、Anthropic、Google，以及不同推論業者提供的開放權重模型；同一個模型若有多家供應商，也能依價格、速度、可用性與資料政策挑端點。

它不是新的基礎模型，也不是自己租 GPU 的推論平台。OpenRouter 真正賣的是「統一介面加上路由控制」：少管幾套 SDK、API key 與錯誤格式，同時保留切換模型和供應商的空間。官方 [Quickstart](https://openrouter.ai/docs/quickstart) 把它描述為一個可連到數百種模型的端點，並自動處理 fallback。

## 第一層：用同一個介面換模型

最直接的用法是沿用 OpenAI SDK，只替換 `baseURL`、API key 與模型名稱：

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const response = await client.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: '用三點整理這份會議記錄' }],
});

console.log(response.choices[0].message.content);
```

模型 ID 採 `供應商/模型` 的命名方式。換模型通常只需改一個字串，對要做模型評測、A/B test 或逐步替換供應商的團隊很實用。OpenRouter 也統一了 streaming、tool calling 與 structured outputs 等常見能力；不過「介面相同」不代表「能力相同」。以 structured outputs 為例，官方文件明確說支援狀態以端點為準，同一模型的不同供應商未必都有相同保證，因此正式環境應加上 `require_parameters: true`，避免請求被送到缺少必要功能的端點（[Structured Outputs 文件](https://openrouter.ai/docs/guides/features/structured-outputs)）。

這層解決的是整合成本，不會抹平模型差異。各家對 system prompt、reasoning、快取與工具呼叫的細節仍不同；如果產品深度依賴某家原生 API 的新功能，統一介面可能反而讓功能晚一拍。

## 第二層：模型不變，選擇實際供應商

一個容易忽略的差別是「模型」和「端點」不是同一件事。同一個開放權重模型可能由多家推論業者供應，即使是閉源模型，也可能透過第一方 API、AWS Bedrock、Google Vertex AI 或 Azure 等端點取得。OpenRouter 預設會在可用端點之間分配請求，以提高可用性；也能在 `provider` 物件中指定順序、是否允許 fallback，以及資料與功能限制（[Provider Routing 文件](https://openrouter.ai/docs/guides/routing/provider-selection)）。

```ts
const response = await client.chat.completions.create({
  model: 'meta-llama/llama-3.3-70b-instruct',
  messages: [{ role: 'user', content: 'Extract the invoice fields.' }],
  extra_body: {
    provider: {
      order: ['groq', 'together'],
      allow_fallbacks: true,
      require_parameters: true,
      zdr: true,
    },
  },
});
```

這讓「我要 Llama」與「我要哪一家跑 Llama」分開決定。延遲敏感的聊天產品可優先選快端點，批次工作可按價格排序，受規範資料則只走符合政策的端點。想先理解 Groq 這類專用推論平台，可以延伸看[Groq Console 介紹](/posts/ai/2026-05-06-groq-console-introduction)；想攤開更多業者的價格，再看[LLM 推論服務免費額度與定價整理](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)。

路由也帶來新的除錯問題：模型輸出變差時，原因可能是模型版本、供應端點、參數轉譯或 fallback。正式上線時不要只記模型名稱，也要把實際回應中的 provider、model、token 用量與延遲寫進追蹤資料。

## 第三層：在供應商故障時換模型

供應商 fallback 處理「同一模型換端點」；model fallback 則是「連模型一起換」。OpenRouter 的 `models` 陣列會依序嘗試候選模型，遇到限流、停機、內容審核拒絕或 context length 錯誤時再往下走，並依最後實際使用的模型計費（[Model Fallbacks 文件](https://openrouter.ai/docs/guides/routing/model-fallbacks)）。

這很適合「先求有答案，再求指定模型」的客服摘要或背景批次工作。不適合把品質差異很大的模型隨意串在一起：備援模型可能有不同 context window、工具格式與安全政策，成功回傳不代表語意品質合格。今晚能做的最小驗證，是拿正式流量中十筆代表性輸入，手動切斷第一順位，確認第二順位的格式、品質與成本仍在可接受範圍。

如果需求是讓 Claude Code、Cursor 等本機工具利用既有訂閱與多組帳號，OpenRouter 這種雲端 gateway 未必是同一題；[9Router 介紹](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)談的是本機 OAuth、帳號輪替與三層 fallback，部署位置和信任邊界都不同。

## 費用與 BYOK：省管理，不一定省錢

OpenRouter 以預付 credits 支付推論費用。官方 [FAQ](https://openrouter.ai/docs/faq) 表示，推論價格依底層供應商牌價轉付，不另外加價，但購買 credits 會收平台費；這些費率與方案可能變動，採購前應直接看當下的 [Pricing](https://openrouter.ai/pricing)，不要把舊文章的百分比寫進預算表。

若公司已和供應商簽約，也可以使用 [BYOK](https://openrouter.ai/docs/guides/overview/auth/byok)：把自有 provider key 加進 OpenRouter，控制使用自有額度的優先序，失敗後再切到 OpenRouter 共用容量。這保留統一介面與 fallback，但請求仍會經過 OpenRouter，而且 BYOK 超過方案內免收費額度後仍可能產生平台費。若需求是完全移除中介方，就應直接接供應商，或評估自架 LiteLLM 類 gateway。

## 隱私控制不是一句「不訓練」

多一層路由，就多一個需要審查的資料處理者。依 OpenRouter 的[資料收集文件](https://openrouter.ai/docs/guides/privacy/data-collection)，prompt 與回應內容的保存預設為 opt-in，但請求的 token、延遲等 metadata 會保留。底層供應商則各有自己的保留與訓練政策。

對敏感工作負載，應啟用 [Zero Data Retention](https://openrouter.ai/docs/guides/features/zdr) 限制。`zdr: true` 只把推論請求送往標示為零資料保留的端點；官方也特別提醒，這項限制不涵蓋另外啟用的 web search、plugin 或其他第三方工具。實際動作是：先列出資料類別，再用 provider allowlist、ZDR 與必要參數建立 guardrail，最後確認沒有合格端點時系統會失敗關閉，而不是偷偷放寬規則。

## 適合與不適合的情境

OpenRouter 適合需要快速試多模型、希望一套 API 管理多家端點、或要在應用層加入價格與可用性 fallback 的小型團隊。它也很適合作為原型期的選擇權：先量測哪些模型真的符合品質與延遲，再決定是否直接和主要供應商簽約。

它不適合把單一供應商的所有原生功能吃到最深、要求網路路徑只能留在既有雲端邊界，或無法接受中介服務成為共同故障點的系統。大規模用量也要比較直接合約、批次折扣與平台費，不能只看模型頁上的 token 單價。

整體來說，OpenRouter 的核心價值不是「模型比較便宜」，而是把模型選擇與供應商選擇變成可設定的路由策略。原型期用它換取速度和選擇權很划算；進入正式環境後，則要把可觀測性、資料政策、備援品質與退出方案一起設計，才不會只是把多家 vendor lock-in 換成一家 gateway lock-in。

## 參考資料

- [OpenRouter Quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter Provider Routing](https://openrouter.ai/docs/guides/routing/provider-selection)
- [OpenRouter Model Fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)
- [OpenRouter Structured Outputs](https://openrouter.ai/docs/guides/features/structured-outputs)
- [OpenRouter BYOK](https://openrouter.ai/docs/guides/overview/auth/byok)
- [OpenRouter Data Collection](https://openrouter.ai/docs/guides/privacy/data-collection)
- [OpenRouter Zero Data Retention](https://openrouter.ai/docs/guides/features/zdr)
- [OpenRouter Pricing](https://openrouter.ai/pricing)
- [站內：Groq Console 介紹](/posts/ai/2026-05-06-groq-console-introduction)
- [站內：9Router 介紹](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)
- [站內：LLM 推論服務免費額度與定價](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
