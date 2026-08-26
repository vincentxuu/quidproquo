---
title: "LLM API 怎麼買最划算：直連、聚合、雲端三條路的實際價差"
date: 2026-08-26
category: ai
type: deep-dive
tags: [llm, api, pricing, openrouter, bedrock, together-ai, fireworks-ai, cost-optimization]
lang: zh-TW
tldr: "同一個模型透過不同管道存取，價差可以到 2-5 倍。直連最簡單、聚合器（OpenRouter）最靈活、雲端平台（Bedrock/Vertex）最適合企業。這篇用 2026 年 8 月實際價格做橫向比較，附選擇決策樹。"
description: "LLM API 路由比價指南：直連 vs OpenRouter vs Bedrock vs Vertex vs Together AI vs Fireworks AI，用 Claude Sonnet 5、GPT-5.6 Sol、DeepSeek V4 的實際價格做橫向對比。"
draft: false
glossary:
  - term: "MTok"
    def: "百萬 token（Million Tokens），LLM API 計價的標準單位"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-llm-api-routing-cost-comparison-en)

你想用 Claude Sonnet 5 寫程式。直接打 Anthropic API 是 $2/$10 per MTok。但同一個模型在 [OpenRouter](https://openrouter.ai) 上可能更便宜，在 [AWS Bedrock](https://aws.amazon.com/bedrock/) 上有量折扣，在某些第三方可能有快取優惠。這篇整理 2026 年 8 月的實際價差，幫你選最適合的管道。

## 六種管道一覽

### 1. 直連官方 API

直接向 Anthropic、OpenAI、Google 等模型供應商購買。價格透明、延遲最低、文件最完整。缺點是每家各一組 API key、各自的 SDK、各自的帳單。

適合：只用一兩家模型、需要最低延遲、有直接商業關係需求。

### 2. OpenRouter——聚合路由

[OpenRouter](/posts/ai/2026-08-22-openrouter-model-routing) 把幾十家供應商的模型統一成一個 OpenAI 相容 API。核心賣點是**即時最低價路由**——同一個模型可能有多家供應商提供，OpenRouter 自動選最便宜的那個。

依 [OpenRouter 官方定價頁](https://openrouter.ai/models)，2026 年 8 月的 Claude Sonnet 5 標價是 $2/$10（跟直連一樣），但部分供應商會有促銷價。OpenRouter 的商業模式是在供應商報價上加一層很薄的 margin。

適合：需要同時存取多家模型、想一個 API key 搞定、快速切換模型做評估。

### 3. AWS Bedrock——企業級

[Bedrock](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) 提供 Claude、Llama、Mistral 等模型。依 [modelgrep 統計](https://modelgrep.com/llm-api-providers)，2026 年 8 月 Bedrock 上架約 30 個模型，包含 Claude Opus 5 和 Fable 5。

Bedrock 的定價跟直連幾乎相同（Claude Sonnet 5 同為 $2/$10），但提供 **Provisioned Throughput**（保證吞吐量，按月承諾折扣）和 **Cross-Region Inference Profile**（跨區負載平衡）。企業的隱性價值是統一帳單到 AWS、符合既有合規框架、不用另開帳號。

適合：已在 AWS 生態系、需要 SLA 與合規、大量穩定用量。

### 4. Google Vertex AI——另一個企業選擇

[Vertex AI](/posts/ai/2026-08-22-vertex-ai-model-platform) 類似 Bedrock 的 Google 版本。提供 Gemini 原生模型加上第三方模型（Claude、Llama 等）。透過 Google Cloud 帳單統一支付，有承諾折扣。

適合：已在 GCP 生態系、主用 Gemini 系列模型。

### 5. Together AI——開源模型專家

[Together AI](/posts/ai/2026-08-22-together-ai-inference-platform) 專注在開源模型的代管推論。依 [modelgrep](https://modelgrep.com/llm-api-providers)，Together 上架 21 個模型，包含 Kimi K3、Qwen3.8、DeepSeek V4 Pro。

開源模型在 Together 上的價格通常比直連閉源模型便宜一個數量級。例如 DeepSeek V4 Flash 在 Together 上約 $0.20/$0.60 per MTok——是 Claude Sonnet 5 的十分之一。

適合：大量使用開源模型、需要 fine-tuning 代管、成本敏感。

### 6. Fireworks AI——速度導向

[Fireworks AI](/posts/ai/2026-08-22-fireworks-ai-inference-platform) 主打推論速度，用 speculative decoding 等技術壓低延遲。依 modelgrep 統計有 9 個模型上架。

適合：延遲敏感的 agentic 應用、需要高吞吐量。

## 價格對比表（2026 年 8 月）

以下價格取自各平台公開定價頁與 [CloudZero 彙整](https://www.cloudzero.com/blog/llm-api-pricing-comparison)（2026-08-20 查證）。單位：$/MTok（百萬 token）。

| 模型 | 直連 (input/output) | OpenRouter | Bedrock | Together AI |
|---|---|---|---|---|
| Claude Sonnet 5 | $2 / $10 | $2 / $10 | $2 / $10 | — |
| Claude Opus 5 | $5 / $25 | $5 / $25 | $5 / $25 | — |
| GPT-5.6 Sol | $2.50 / $15 | $2.50 / $15 | 有上架 | — |
| GPT-5.6 Luna | $0.20 / $1.20 | $0.20 / $1.20 | — | — |
| DeepSeek V4 Pro | 直連約 $0.50 / $2.00 | 多家供應商競價 | 有上架 | ✅ 有上架 |
| Llama 4 Maverick | 免權重費 | $0.20 / $0.50 | 有上架 | ✅ 有上架 |
| Kimi K3 | $3 / $15 | 有上架 | — | ✅ 有上架 |

**關鍵觀察**：

- **閉源模型**（Claude、GPT）在各管道的價格幾乎一樣——供應商控制定價，聚合器沒什麼議價空間
- **開源模型**（DeepSeek、Llama、Kimi）才是比價的主戰場——不同代管商的推論效率不同，價差可以到 2-3 倍
- Bedrock 和 Vertex 的隱藏價值在**承諾折扣**和**統一帳單**，牌面價跟直連一樣但量大有談判空間

## 怎麼選：決策樹

```
你需要用幾家模型？
├── 只用一家 → 直連官方 API（最簡單、延遲最低）
└── 多家
    ├── 你在 AWS/GCP 嗎？
    │   ├── AWS → Bedrock（統一帳單、合規）
    │   └── GCP → Vertex AI
    └── 不在雲端 / 獨立開發者
        ├── 主要用閉源模型 → OpenRouter（一個 key 搞定）
        └── 主要用開源模型
            ├── 在意速度 → Fireworks AI
            └── 在意價格 → Together AI
```

## 別忘了的隱藏成本

1. **Prompt caching**：Anthropic 的 prompt caching 可以省 90% 輸入成本（OpenAI 是 50%）。如果你的應用有大量重複 system prompt，直連 Anthropic 反而可能比用聚合器便宜
2. **Batch API**：OpenAI 和 Anthropic 都有 batch API（非即時），價格打對折。但不是所有聚合器都支援
3. **Rate limit**：直連通常有較高的 rate limit。聚合器的 rate limit 是共享的
4. **Gateway 工具**：[LiteLLM](/posts/ai/2026-08-22-litellm-gateway) 和 [Portkey](/posts/ai/2026-08-22-portkey-ai-gateway) 不是供應商，而是讓你自己搭路由閘道。用你自己的 API key，但統一介面、自動 fallback、可觀測性

## 整體來說

2026 年的 LLM API 市場已經高度商品化——**閉源模型沒什麼好比價的，各管道價格幾乎一樣**。真正的價差在開源模型的代管推論。如果你是獨立開發者或小團隊，OpenRouter 的一站式體驗最省事；如果你是企業，Bedrock/Vertex 的統一帳單和合規框架是真正的賣點，不是價格。

## 參考資料

- [LLM API Pricing Comparison — CloudZero](https://www.cloudzero.com/blog/llm-api-pricing-comparison)（2026-08-20）
- [LLM API Providers Compared — modelgrep](https://modelgrep.com/llm-api-providers)（2026-08 即時更新）
- [LLM API Pricing Comparison — CostGoat](https://costgoat.com/compare/llm-api)
- [OpenRouter 介紹](/posts/ai/2026-08-22-openrouter-model-routing) — 本站
- [AWS Bedrock 介紹](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) — 本站
- [Google Vertex AI 介紹](/posts/ai/2026-08-22-vertex-ai-model-platform) — 本站
- [Together AI 介紹](/posts/ai/2026-08-22-together-ai-inference-platform) — 本站
- [Fireworks AI 介紹](/posts/ai/2026-08-22-fireworks-ai-inference-platform) — 本站
- [LiteLLM Gateway 介紹](/posts/ai/2026-08-22-litellm-gateway) — 本站
- [Portkey AI Gateway 介紹](/posts/ai/2026-08-22-portkey-ai-gateway) — 本站
