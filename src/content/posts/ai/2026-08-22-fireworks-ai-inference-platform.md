---
title: "Fireworks AI：從 Serverless API 到客製模型部署的推論平台"
date: 2026-08-22
category: ai
tags: [fireworks-ai, llm, inference, model-serving, fine-tuning, openai-compatible]
lang: zh-TW
type: deep-dive
tldr: "Fireworks AI 把開放權重模型的試用、專用 GPU 部署與 LoRA 客製化放在同一套 API 後面；Serverless 適合低流量起步，On-demand 適合穩定高流量與自有模型，保留容量則換取企業級的容量保證。"
description: "深入介紹 Fireworks AI 的 Serverless、On-demand 專用部署、保留容量、OpenAI 相容 API 與 LoRA 模型客製化，並比較 Groq、Together AI 和自架 vLLM 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-fireworks-ai-inference-platform-en)

[Fireworks AI](https://fireworks.ai/) 是替開放權重模型提供訓練與推論的平台。它不是另一個只轉送請求的模型聚合器：同一個模型可以先走共享的 Serverless API 驗證需求，再搬到專用 GPU，最後接上微調或自行上傳的權重。應用程式仍使用近似相同的呼叫方式，改變的是背後的容量、計費與控制權。

理解 Fireworks 最重要的一件事，是先把名稱拆清楚。官方目前只有兩種推論部署：共享的 **Serverless**，以及使用專用 GPU 的 **Dedicated deployment**；「On-demand」是專用部署按 GPU 秒使用的取得方式，不是第三種部署。企業另外可以購買 **reserved capacity**，替專用部署預留容量。這篇依這三個營運層級介紹，避免把產品名稱誤讀成三套互不相干的 API。

## Serverless：先用 token 計費驗證工作負載

[Serverless inference](https://docs.fireworks.ai/serverless/overview) 是多租戶服務。Fireworks 先把熱門模型部署好，使用者挑模型、送出 token，無須決定 GPU 型號、replica 數量或 autoscaling。它按 token 計費，適合流量低、尖峰不固定，或還在比較模型的階段。

這層的優點是開始成本低。官方同時提供 OpenAI 與 Anthropic 相容介面；既有應用通常只要換 API key、endpoint 與模型名稱。以下使用 OpenAI JavaScript SDK：

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

const response = await client.chat.completions.create({
  model: "accounts/fireworks/models/<MODEL_ID>",
  messages: [{ role: "user", content: "用三點摘要這份文件" }],
});

console.log(response.choices[0].message.content);
```

程式碼容易搬，不代表模型行為完全可互換。工具呼叫、結構化輸出、context 上限與 prompt 模板仍要逐模型驗證；正式上線前，應把自己的評測資料跑過候選模型，而不是只確認 API 回傳成功。

Serverless 也有清楚邊界。模型必須出現在帶有 Serverless 標籤的清單中，自有 base model 與 LoRA adapter 不能放在這一層。共享容量也不適合拿來承諾固定延遲；官方的[模型概念文件](https://docs.fireworks.ai/models/overview)明確把它描述為 best-effort，模型下架會預先通知，但需要長期鎖定版本的正式服務仍應考慮專用部署。

## On-demand：專用 GPU 才是 Fireworks 的分水嶺

[On-demand deployments](https://docs.fireworks.ai/guides/ondemand-deployments) 會替帳號配置專用 GPU，按 GPU 秒計費。此時吞吐上限取決於自己選的硬體、replica 與模型設定，不再跟其他 Serverless 使用者共享；也能設定 autoscaling、量化、部署區域與多 GPU replica。

這不是「流量一大就一定比較便宜」的自動答案。專用 GPU 的經濟性取決於使用率：若請求零碎，閒置容量會吃掉省下的 token 費；若工作負載長時間維持高利用率，GPU 時間計費才可能優於逐 token 付費。最實際的做法是先從 Serverless 匯出一週流量，記錄尖峰並行數、輸入／輸出 token 與延遲，再用相同模型做負載測試。

On-demand 真正不可替代的地方是控制權：要部署清單外但架構受支援的模型、固定模型版本、選擇硬體，或服務自己的 LoRA，都得進這一層。官方也提醒部署區域在建立時決定，不能直接就地更改；有資料落地或災難復原要求時，區域策略應在建立部署前決定。

## Reserved capacity：不是另一套 API，而是容量承諾

若正式服務不能接受擴容時剛好沒有 GPU，可以在專用部署之上購買[保留容量](https://docs.fireworks.ai/deployments/reservations)。它提供保證容量、較高 quota 與較低 GPU 時間價格，但企業帳號通常要承諾一年；即使沒有用滿，合約期間仍會持續計費。

所以三層的選法很直白：不確定流量時用 Serverless；流量可預測或需要自有模型時開 On-demand；只有容量不足會直接造成業務事故，而且使用率能支撐承諾時，才談 reserved capacity。保留容量解的是供應保證，不會自動改善模型品質，也不會替團隊做好 autoscaling。

## 模型客製：從上傳權重到 LoRA 服務

Fireworks 把「模型」與「deployment」分開。模型是權重與 metadata，deployment 是承載模型的運算資源。你可以從 Hugging Face、本機、S3 或 Azure Blob Storage [上傳自有模型](https://docs.fireworks.ai/models/uploading-custom-models)，通過驗證後再建立專用部署；不是任何架構都能直接上傳，動手前應先核對官方支援清單與必要檔案。

微調則有 Managed Fine-Tuning 與可自行寫訓練迴圈的 Training API。對一般產品團隊，先從 SFT 或偏好最佳化的 managed workflow 開始比較合理；只有需要自訂 loss、reward、rollout 或 optimizer loop 時，才值得接手較多訓練基礎設施。Fireworks 的訓練資料可沿用 OpenAI chat completion 的 `messages` 格式，降低既有資料集搬遷成本。

LoRA 完成後只能部署到專用環境。[官方提供兩種 serving 方式](https://docs.fireworks.ai/fine-tuning/deploying-loras)：live merge 在部署時把單一 adapter 合進 base model，推論效能與 base model 相同；multi-LoRA 則讓多個 adapter 共用一個 base deployment，以部分效能負擔換取較低的多版本服務成本。單一正式模型優先考慮 live merge；需要 A/B test 或同時服務許多客戶版本，再考慮 multi-LoRA。

## 與 Groq、Together 和自架 vLLM 的差別

| 選項 | 核心取向 | 比較適合 |
|---|---|---|
| [Fireworks AI](https://fireworks.ai/) | Serverless、專用 GPU、訓練與自有權重在同一平台 | 從 API 原型一路走到客製模型正式服務 |
| [Groq](/posts/ai/2026-05-06-groq-console-introduction) | 以 LPU 主打低延遲的託管推論 | 模型在清單內，而且互動延遲是第一優先 |
| [Together AI](https://docs.together.ai/docs/inference-overview) | 廣泛模型目錄，加上推論與 fine-tuning | 想快速比較多種開放模型與平台功能 |
| [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) | 自行掌控開放原始碼 serving engine | 已有 GPU 與維運能力，且需要底層控制 |

Fireworks 的定位介於單純模型 API 與自架推論之間。它替你管理硬體與 serving stack，卻保留上傳模型、選 GPU、量化與 LoRA 的空間。代價是你仍受平台支援架構、區域容量與計費方式約束；若只需要偶爾呼叫熱門模型，這些能力反而是多餘複雜度。

## 整體來說

Fireworks 最適合「今天先呼叫開放模型，明天可能要把自己的權重推上線」的團隊。先用 Serverless 建立品質與流量基準，確認瓶頸後才建立 On-demand deployment；容量承諾放到最後，模型微調則必須由評測結果驅動。這條路徑讓基礎設施跟需求一起升級，不必在原型階段就猜未來需要幾張 GPU。

如果需求只是跨 OpenAI、Claude 與 Gemini 做供應商路由，Fireworks 並不是完整答案；那是 OpenRouter、LiteLLM 或 Portkey 這類 gateway 的工作。Fireworks 的強項更靠近資料平面：把開放權重模型訓練好、部署好，並用同一套相容 API 送到產品裡。

## 延伸閱讀

- [Groq Console：用 LPU 推論開源模型的開發者平台](/posts/ai/2026-05-06-groq-console-introduction)
- [vLLM：從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)
- [40+ 家 LLM 推論服務免費額度與價格比較](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)

## 參考資料

- [Fireworks Serverless Inference Overview](https://docs.fireworks.ai/serverless/overview)
- [Fireworks On-demand Deployments](https://docs.fireworks.ai/guides/ondemand-deployments)
- [Fireworks Reserved Capacity](https://docs.fireworks.ai/deployments/reservations)
- [Fireworks OpenAI Compatibility](https://docs.fireworks.ai/tools-sdks/openai-compatibility)
- [Fireworks Custom Models](https://docs.fireworks.ai/models/uploading-custom-models)
- [Fireworks Training Overview](https://docs.fireworks.ai/fine-tuning/finetuning-intro)
- [Fireworks Deploying Fine-Tuned Models](https://docs.fireworks.ai/fine-tuning/deploying-loras)
