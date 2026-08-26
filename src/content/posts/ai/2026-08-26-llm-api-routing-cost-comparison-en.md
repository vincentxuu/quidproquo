---
title: "LLM API Routing: Direct, Aggregator, or Cloud — A Price Comparison"
date: 2026-08-26
category: ai
type: deep-dive
tags: [llm, api, pricing, openrouter, bedrock, together-ai, fireworks-ai, cost-optimization]
lang: en
series:
  name: "認識 AI 模型"
  order: 16
tldr: "The same model can cost 2-5× more depending on the channel. Direct API is simplest, aggregators (OpenRouter) are most flexible, cloud platforms (Bedrock/Vertex) suit enterprises. This post compares actual August 2026 prices across six channels with a decision tree."
description: "LLM API routing comparison guide: Direct vs OpenRouter vs Bedrock vs Vertex vs Together AI vs Fireworks AI, with real prices for Claude Sonnet 5, GPT-5.6 Sol, and DeepSeek V4."
draft: false
glossary:
  - term: "MTok"
    def: "Million Tokens — the standard pricing unit for LLM APIs"
---

> 🌏 [中文版](/posts/ai/2026-08-26-llm-api-routing-cost-comparison)

You want to use Claude Sonnet 5 for coding. Hitting the Anthropic API directly costs $2/$10 per MTok. But the same model might be cheaper on [OpenRouter](https://openrouter.ai), have volume discounts on [AWS Bedrock](https://aws.amazon.com/bedrock/), or offer caching benefits through third parties. This post maps the actual price differences as of August 2026 and helps you pick the right channel.

## Six Channels at a Glance

### 1. Direct Official API

Buy directly from Anthropic, OpenAI, Google, etc. Transparent pricing, lowest latency, best documentation. The downside: separate API keys, SDKs, and billing for each provider.

Best for: using only one or two providers, needing lowest latency, requiring a direct commercial relationship.

### 2. OpenRouter — Aggregated Routing

[OpenRouter](/posts/ai/2026-08-22-openrouter-model-routing) unifies dozens of providers behind a single OpenAI-compatible API. The core feature is **real-time cheapest-provider routing** — when multiple providers offer the same model, OpenRouter picks the cheapest.

Per the [OpenRouter pricing page](https://openrouter.ai/models), Claude Sonnet 5 lists at $2/$10 as of August 2026 (same as direct), but some providers run promotions. OpenRouter's business model adds a thin margin on top of provider prices.

Best for: accessing multiple models, one API key for everything, rapid model evaluation.

### 3. AWS Bedrock — Enterprise Grade

[Bedrock](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) offers Claude, Llama, Mistral, and more. Per [modelgrep](https://modelgrep.com/llm-api-providers), Bedrock hosts about 30 models as of August 2026, including Claude Opus 5 and Fable 5.

Bedrock's list pricing matches direct (Claude Sonnet 5 at $2/$10), but offers **Provisioned Throughput** (guaranteed capacity with monthly commitment discounts) and **Cross-Region Inference Profiles** (load balancing across regions). The hidden value for enterprises is unified AWS billing, existing compliance frameworks, and no separate vendor accounts.

Best for: already on AWS, need SLAs and compliance, high steady-state volume.

### 4. Google Vertex AI — The GCP Alternative

[Vertex AI](/posts/ai/2026-08-22-vertex-ai-model-platform) is Google's equivalent to Bedrock. Offers native Gemini models plus third-party models (Claude, Llama, etc.). Unified billing through Google Cloud with commitment discounts.

Best for: already on GCP, primarily using Gemini models.

### 5. Together AI — Open-Source Model Specialists

[Together AI](/posts/ai/2026-08-22-together-ai-inference-platform) focuses on managed inference for open-source models. Per [modelgrep](https://modelgrep.com/llm-api-providers), Together hosts 21 models including Kimi K3, Qwen3.8, and DeepSeek V4 Pro.

Open-source models on Together typically cost an order of magnitude less than direct closed-source models. For example, DeepSeek V4 Flash on Together runs about $0.20/$0.60 per MTok — one-tenth of Claude Sonnet 5.

Best for: heavy open-source model usage, managed fine-tuning, cost-sensitive workloads.

### 6. Fireworks AI — Speed-Optimized

[Fireworks AI](/posts/ai/2026-08-22-fireworks-ai-inference-platform) focuses on inference speed, using techniques like speculative decoding to minimize latency. Per modelgrep, they host 9 models.

Best for: latency-sensitive agentic applications, high-throughput requirements.

## Price Comparison Table (August 2026)

Prices sourced from each platform's public pricing pages and [CloudZero's compilation](https://www.cloudzero.com/blog/llm-api-pricing-comparison) (checked 2026-08-20). Unit: $/MTok (million tokens).

| Model | Direct (input/output) | OpenRouter | Bedrock | Together AI |
|---|---|---|---|---|
| Claude Sonnet 5 | $2 / $10 | $2 / $10 | $2 / $10 | — |
| Claude Opus 5 | $5 / $25 | $5 / $25 | $5 / $25 | — |
| GPT-5.6 Sol | $2.50 / $15 | $2.50 / $15 | Listed | — |
| GPT-5.6 Luna | $0.20 / $1.20 | $0.20 / $1.20 | — | — |
| DeepSeek V4 Pro | ~$0.50 / $2.00 direct | Multi-provider bidding | Listed | ✅ Listed |
| Llama 4 Maverick | Free weights | $0.20 / $0.50 | Listed | ✅ Listed |
| Kimi K3 | $3 / $15 | Listed | — | ✅ Listed |

**Key observations**:

- **Closed-source models** (Claude, GPT) cost nearly the same across all channels — providers control pricing and aggregators have little room to negotiate
- **Open-source models** (DeepSeek, Llama, Kimi) are where the real price competition happens — different hosting providers have different inference efficiency, with 2-3× price spreads
- Bedrock and Vertex's hidden value lies in **commitment discounts** and **unified billing** — list prices match direct, but volume deals are negotiable

## How to Choose: Decision Tree

```
How many model providers do you need?
├── Just one → Direct official API (simplest, lowest latency)
└── Multiple
    ├── Are you on AWS/GCP?
    │   ├── AWS → Bedrock (unified billing, compliance)
    │   └── GCP → Vertex AI
    └── Not on cloud / indie developer
        ├── Mostly closed-source models → OpenRouter (one key for everything)
        └── Mostly open-source models
            ├── Latency-sensitive → Fireworks AI
            └── Cost-sensitive → Together AI
```

## Hidden Costs to Watch

1. **Prompt caching**: Anthropic's prompt caching saves 90% on input costs (OpenAI offers 50%). For applications with repeated system prompts, direct Anthropic API might be cheaper than an aggregator
2. **Batch API**: Both OpenAI and Anthropic offer non-realtime batch APIs at half price. Not all aggregators support this
3. **Rate limits**: Direct APIs generally have higher rate limits. Aggregator limits are shared
4. **Gateway tools**: [LiteLLM](/posts/ai/2026-08-22-litellm-gateway) and [Portkey](/posts/ai/2026-08-22-portkey-ai-gateway) are not providers — they let you build your own routing gateway. You bring your own API keys but get a unified interface, automatic fallbacks, and observability

## Bottom Line

The 2026 LLM API market is highly commoditized — **there's little to compare on closed-source model pricing across channels**. The real price differences are in open-source model hosting. If you're an indie developer or small team, OpenRouter's one-stop experience saves the most hassle. If you're an enterprise, Bedrock/Vertex's unified billing and compliance frameworks are the actual selling point, not the price.

## References

- [LLM API Pricing Comparison — CloudZero](https://www.cloudzero.com/blog/llm-api-pricing-comparison) (2026-08-20)
- [LLM API Providers Compared — modelgrep](https://modelgrep.com/llm-api-providers) (August 2026, live-updated)
- [LLM API Pricing Comparison — CostGoat](https://costgoat.com/compare/llm-api)
- [OpenRouter Deep Dive](/posts/ai/2026-08-22-openrouter-model-routing) — this site (in Chinese)
- [AWS Bedrock Deep Dive](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) — this site (in Chinese)
- [Google Vertex AI Deep Dive](/posts/ai/2026-08-22-vertex-ai-model-platform) — this site (in Chinese)
- [Together AI Deep Dive](/posts/ai/2026-08-22-together-ai-inference-platform) — this site (in Chinese)
- [Fireworks AI Deep Dive](/posts/ai/2026-08-22-fireworks-ai-inference-platform) — this site (in Chinese)
- [LiteLLM Gateway](/posts/ai/2026-08-22-litellm-gateway) — this site (in Chinese)
- [Portkey AI Gateway](/posts/ai/2026-08-22-portkey-ai-gateway) — this site (in Chinese)
