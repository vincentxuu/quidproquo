---
title: "2026 LLM Inference Provider Free Tiers & Pricing: 40+ Services Ranked by Tier"
date: 2026-05-09
category: ai
tags: [llm, inference, pricing, free-tier, cerebras, groq, cloudflare-workers-ai, gemini, openrouter, deepseek, nvidia-nim, modal, ollama, mistral]
lang: en
tldr: "For side projects, toy demos, and RAG prototypes, nobody wants to swipe a credit card on day one. This is a verified roundup of 40+ LLM inference providers still operating as of 2026/05, tiered by whether free resources auto-replenish or are one-time grants. Each entry notes credit-card requirements, supported models, paid starting prices, and catches. Chinese-origin providers including Zhipu GLM (permanently free), Doubao (2M tokens/day), Kimi, DashScope, and the Ollama local option are all included."
description: "Comparing free tiers and pricing across 40+ LLM inference providers including Cerebras, Groq, Cloudflare Workers AI, Google Gemini, OpenRouter, GitHub Models, Modal, NVIDIA NIM, Ollama, Mistral, Zhipu GLM, Volcengine Doubao, Moonshot Kimi, and Qwen DashScope."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)

For side projects, toy demos, and RAG prototypes, nobody wants to swipe a credit card on day one. The problem is there are too many LLM inference providers, pricing pages change too fast, formerly free options may have been killed, and formerly paid ones may have gone permanently free. This article tiers 40+ options still operating as of 2026/05 by the **nature** of their free resources, noting credit-card requirements, key supported models, paid starting prices, and the catch for each free tier.

All numbers below are cross-referenced directly from official pricing pages. Where something couldn't be verified, it's explicitly marked "unverified" -- nothing is fabricated to fill the table.

## How the Three Tiers Are Defined

The key distinction is whether free resources **auto-replenish or are one-time / hard-capped**:

- **Tier 1**: Daily/per-minute auto-resetting quotas, generous enough for **daily development** (thousands to tens of thousands of requests per day), on the provider's own inference infrastructure. **Use as your primary API**.
- **Tier 2**: Small monthly credits, one-time signup credits, or strict rate limits. **Fine for experimenting, trying models, or as a fallback; will hit walls as a daily driver**.
- **Tier 3**: Paid only, no ongoing free tier. **Focus on per-token pricing**.

Two additional standalone sections cover: **Completely Free (no SLA, experimental)** and **Chinese-origin providers (verified free tiers)**.

## Tier 1: Auto-Replenishing Daily Quotas

### [Cerebras Inference](https://inference.cerebras.ai/)

Wafer-scale LPU, 1000-3000 tps speed, tied with Groq as the "fastest + most generous free tier" in Tier 1.

- **Free quota**: 30 RPM, 900 RPH, 14,400 RPD, 60K TPM, 1M TPH, 1M TPD per model (GLM-4.7 is tighter: 10 RPM, 100 RPD)
- **No credit card required** -- sign up and get an API key
- **Popular models**: gpt-oss-120b, Qwen3-235B-Instruct, Llama 3.1 8B, ZAI GLM-4.7
- **Paid starting price (Developer tier, requires $10 deposit)**: Llama 3.1 8B $0.10/$0.10, gpt-oss-120b $0.35/$0.75, Qwen3-235B $0.60/$1.20, GLM 4.7 $2.25/$2.75
- **Highlight**: All major models get 14.4K RPD -- the most consistently generous free quotas
- **Catch**: Llama 3.1 8B and Qwen3-235B-Instruct will be **deprecated on 2026-05-27**

### [Groq](https://groq.com/)

LPU at 500-1000 tps, broadest open model lineup, most models on the free tier (including speech, moderation, and agentic).

- **Free quota** (varies by model, numbers taken directly from console.groq.com/docs/rate-limits):
  - `llama-3.1-8b-instant`: 30 RPM / **14.4K RPD** / 6K TPM / 500K TPD
  - `llama-3.3-70b-versatile`: 30 RPM / 1K RPD / 12K TPM / 100K TPD
  - `meta-llama/llama-4-scout-17b`: 30 RPM / 1K RPD / 30K TPM / 500K TPD
  - `openai/gpt-oss-120b` / `gpt-oss-20b`: 30 RPM / 1K RPD / 8K TPM / 200K TPD
  - `qwen/qwen3-32b`: 60 RPM / 1K RPD / 6K TPM / 500K TPD
  - Plus Whisper, Llama Guard, Compound (agentic), and more
- **No credit card required**
- **Paid starting price**: Llama 3.3 70B $0.59/$0.79, gpt-oss-20b $0.075/$0.30, gpt-oss-120b $0.15/$0.60, cached input 50% off
- **Highlight**: Broadest model lineup (including speech, moderation, agentic); Llama 3.1 8B at 14.4K RPD matches Cerebras
- **Catch**: Heavy models only get 1K RPD -- you'll bottleneck on volume (upgrade to Developer to unlock more)

### [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)

Broadest model catalog, included with the Workers Free plan.

- **Free quota**: 10,000 Neurons/day (available on both Free and Paid accounts)
- **No credit card required**
- **Popular models**: Llama 3.3 70B, gpt-oss-20b/120b, Qwen3-30B, DeepSeek-R1-distill, Kimi K2.6, GLM-4.7-flash, Gemma 3
- **Paid starting price**: $0.011 / 1,000 Neurons; Llama 3.3 70B fp8-fast $0.293/$2.253, gpt-oss-120b $0.35/$0.75, gpt-oss-20b $0.20/$0.30
- **Catch**: Neurons conversion means daily free volume is small (Llama 3.3 70B roughly 37K input + 5K output tokens) -- heavy models burn through it fast

### [Google AI Studio](https://aistudio.google.com/) (Gemini API)

Gemini 3 series official pipeline, 1.2M context window included.

- **Free quota**: Free tier is entirely free, no credit card required (specific RPM/RPD shown dynamically in the AI Studio UI; official public pages don't list exact numbers)
- **Popular models**: Gemini 3 Pro Preview (actual model ID: `gemini-3.1-pro-preview`), Gemini 3 Flash Preview, Gemini 2.5 Pro/Flash/Flash-Lite
- **Paid starting price**: Gemini 2.5 Flash-Lite $0.10/$0.40, 2.5 Flash $0.30/$2.50, Gemini 3 Flash Preview $0.50/$3.00, Gemini 3 Pro Preview $2/$12 (<=200K context)
- **Catch**: Free tier prompts and outputs **are used for model training** (officially documented) -- production projects should upgrade to Tier 1 (requires credit card) to disable this

## Tier 2: Small Monthly / One-Time / Strict Rate Limits

### (a) Small Monthly Credits (gone once used up that month)

**[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/pricing)**
- Free $0.10/month, PRO $2/month, Team / Enterprise $2/seat/month
- No credit card required (uses monthly credits); zero markup, routes to Cerebras / Groq / Together / Fireworks / SambaNova / Hyperbolic behind the scenes
- Catch: Free $0.10 is minuscule; PRO is where it starts being usable

**[Vercel AI Gateway](https://vercel.com/docs/ai-gateway)**
- $5/month credits (clock starts on first request)
- Standard provider pricing, BYOK also zero markup
- Catch: Once $5 is used up, you need to top up

**[Modal](https://modal.com/)**
- **Starter $30/month permanent free credits**, including 100 containers + 10 GPU concurrency
- No credit card required
- Highlight: Serverless GPU to run your own vLLM/SGLang, billed per second (H100 ~$3.95/hr)
- Catch: You deploy models yourself -- this isn't a ready-made token API

### (b) One-Time Signup Credits

**[SambaNova Cloud](https://cloud.sambanova.ai/)**
- Sign up for **$5 credits (valid 30 days)**; after credits expire, the Free tier persists (doesn't disappear)
- **Free tier** (no credit card required): DeepSeek-V3.1, Llama 3.3 70B, gpt-oss-120b each at 20 RPM / 20 RPD / 200K TPD
- RDU chip, speed on par with Groq / Cerebras
- Paid: Llama 3.3 70B $0.60/$1.20, gpt-oss-120b $0.22/$0.59, DeepSeek-V3.1 $0.15/$0.75
- Catch: Developer tier (requires credit card) to unlock 60 RPM / 12K RPD

**[Inference.net](https://inference.net/)**
- $25 one-time free credits
- Claims 90% cheaper than OpenAI
- Key models: Nemotron 3 Super $2.50/$5, Schematron series (specialized small models), Gemma 3
- Catch: Model selection skews research-oriented

**[AI21 Jamba](https://www.ai21.com/)**
- $10 / 7-day trial, no credit card required
- Jamba Mini $0.2/$0.4, Jamba Large $2/$8
- Highlight: Jamba long context, Mamba architecture
- Catch: Trial expires after 7 days

**[Baseten](https://www.baseten.co/)**
- New workspace gets **$30 one-time free credits** (per official changelog)
- Basic plan $0/month, pay-as-you-go; DeepSeek V4 $1.74/$3.48, gpt-oss-120B $0.10/$0.50, Kimi K2.6 $1.00/$3.90
- Highlight: Supports both Model API (token-based billing) and Dedicated GPU Deployment (per-minute billing, starting at T4 $0.01052/min)
- Catch: Need to top up after $30 is spent; rate limits are low (Basic unverified at 15 RPM / 100K TPM)

### (c) Strict Rate Limits (no large token quotas)

**[OpenRouter](https://openrouter.ai/)**
- `:free` models at 20 RPM; cumulative purchases <$10 -> 50 RPD; purchases >=$10 -> **1000 RPD**
- No credit card required for free models (DeepSeek-V3, Llama 3.3 70B, Qwen3, etc.)
- Paid requests forwarded at provider cost, zero markup
- Catch: `:free` models have worse context and throughput, may fall back, and prompts may be collected by providers

**[GitHub Models](https://github.com/marketplace/models)**
- Copilot Free/Pro: Low models 15 RPM / 150 RPD; High models 10 RPM / 50 RPD; Embedding 15 RPM / 150 RPD; most limited to 8K input / 4K output
- The only legitimate free channel to try GPT-5 / o3 (also includes o4-mini, Llama, Phi, Mistral, DeepSeek-R1, Grok-3)
- Catch: Quotas are very tight -- only enough to dip your toes

**[Cohere](https://cohere.com/) Trial Key**
- 1,000 calls/month; Chat 20 RPM, Embed 2,000 inputs/min, Rerank 10 RPM
- No credit card required; Command A, Embed, Rerank are well-suited for RAG
- Catch: 1,000 calls/month runs out fast

### (d) Quota Unclear but Confirmed Free Dev Tier

**[NVIDIA NIM](https://build.nvidia.com/)** (build.nvidia.com)
- Sign up for **1,000 inference credits**; providing a business email can unlock an additional 4,000 (5,000 total), along with a 90-day NVIDIA AI Enterprise free trial
- Credits don't expire; 40 RPM (can request increase to 200 RPM)
- Broadest model lineup: Nemotron-3 Super 120B, DeepSeek V4, Llama 3.3 70B, Kimi K2, Qwen3.5 122B, gpt-oss, Gemma 4, GLM-5.1
- Highlight: Official NVIDIA-optimized; enterprise version requires DGX Cloud entitlement
- Catch: Credits are for development / prototyping, not production use

**[Nebius Token Factory](https://nebius.com/services/studio-inference-service)** (the company that acquired Tavily)
- New accounts get **$1 trial credit (valid 30 days)**; credit card required to complete onboarding
- Models: gpt-oss-120B, Kimi-K2, Hermes-4-405B, GLM-4.5, Qwen3-Coder-480B, DeepSeek-R1-0528
- Highlight: Sub-second latency, SOC2/HIPAA, US/EU regions
- Catch: $1 is tiny -- basically enough for one or two requests

## Completely Free (No SLA, Experimental)

### [Pollinations.ai](https://pollinations.ai/)
- **Completely free**, pollen auto-replenishes (Seed 0.15 pollen/hr, Flower 0.4 pollen/hr)
- OpenAI-compatible API, no credit card required
- Key models: Gemma 4 26B, Seedance 2.0 video, text embedding
- Suitable for prototypes, not for SLA requirements

### [AI Horde](https://aihorde.net/)
- **Completely free + anonymous access** (API key `0000000000` works directly)
- Community volunteer GPUs, ~441 tokens/sec, NLnet/NGI0 funded
- Highlight: Contribute GPU to earn kudos for priority
- Catch: Speed depends on current volunteer count, model availability fluctuates, absolutely never use in production

### [Ollama](https://ollama.com/) (Local Inference)

Local model runner -- install it on your machine and run open-source LLMs; also offers a cloud tier for models too large for consumer hardware.

- **Local inference**: Completely free and unlimited, runs on your own GPU/CPU, supports offline use
- **Cloud free tier**: 1 concurrent model, limited GPU time (per session every 5 hours, weekly auto-reset every 7 days)
- **No credit card required** (both local and cloud free tier)
- **Paid Pro $20/month ($200/year)**: 3 concurrent cloud models, 50x more cloud usage, private model uploads
- **Paid Max $100/month**: 10 concurrent cloud models
- **Model library**: Qwen3.5, Gemma 4, DeepSeek V4, Kimi K2.6, GLM-5.1, Mistral Medium 3.5, Llama series, and hundreds more
- **OpenAI-compatible REST API**: Just change the base URL for a seamless switch from OpenAI; supports tool calling
- **Cloud-only models** (too large for local): DeepSeek V4 Pro 684B MoE, Kimi K2.6, and other massive MoE models
- **Privacy**: Neither local nor cloud prompts/responses are logged or used for training; cloud runs on NVIDIA Cloud (US/EU/Singapore), zero data retention
- **Catch**: Cloud tier is limited by GPU time rather than token count -- high concurrency requires a paid plan; only runs open models, no GPT / Claude

## Chinese-Origin Providers (Verified Free Tiers)

Chinese-origin providers generally offer ongoing free tiers or aggressive promotions, but their pricing pages are notoriously hostile to scraping from outside China. Below are the ones where specific numbers were directly verified this round:

### [iFlytek Spark Lite](https://xinghuo.xfyun.cn/sparkapi) (Xunfei)
- **Spark Lite model permanently free and unlimited**
- Individual verification grants 200K tokens; enterprise gets 1M tokens
- Paid: Spark X2 CNY 2-3/M, X2 Flash CNY 1-2/M, Ultra CNY 0.8/M, Pro CNY 5/M
- The most generous free tier among Chinese-origin providers; requires identity verification

### [Tencent Hunyuan](https://cloud.tencent.com/product/hunyuan) (Tencent)
- **First activation grants 1M tokens valid for one year** (shared across Hunyuan 2.0 Think/Instruct/T1/TurboS/a13b/Vision/embedding)
- **Hunyuan-lite completely free**
- Paid: HY 2.0 Think CNY 3.975/CNY 15.9 per M, Hunyuan-T1 CNY 1/CNY 4
- Transparent and genuine free tier from a major tech company

### [Baidu Qianfan](https://qianfan.cloud.baidu.com/)
- **Sign up for a CNY 20 voucher** (platform-wide, no minimum spend, valid for 1 month)
- **Qwen3.5-2B inference free and unlimited**; Qwen-Image-2512 temporarily free
- Comprehensive model marketplace: DeepSeek-V4, ERNIE 5.0, ERNIE 4.5 Turbo, Kimi-K2.5, MiniMax-M2.1, Qwen3-VL-32B, GLM 5.1
- Requires identity verification

### [Zhipu GLM](https://bigmodel.cn/) (Zhipu AI)

Multiple Flash models are permanently free, making this one of the most generous free tiers among Chinese-origin providers.

- **Permanently free models**: GLM-4-Flash (128K), GLM-4.7-Flash (200K), GLM-4.5-Flash, GLM-4V-Flash (multimodal vision), and more -- **no token cap**, 30 concurrent limit
- **No credit card required**; requires identity verification
- **New user bonus**: 20M tokens (GLM-4.5-Air equivalent, market value CNY 58)
- **Paid pricing** (CNY per million tokens): GLM-5.1 CNY 6/CNY 24, GLM-4.7 CNY 2/CNY 8, GLM-4.5 CNY 1/CNY 4, GLM-4.5-Air CNY 0.8/CNY 2-8, GLM-Z1-Air (reasoning) CNY 0.5/CNY 0.5
- **Highlight**: Flash series covers text, multimodal, and reasoning -- broadest permanently free coverage
- **Catch**: open.bigmodel.cn access is unstable outside China; 30 concurrent is fine for development, production should upgrade to paid

### [Volcengine Doubao](https://www.volcengine.com/product/ark) (ByteDance)

Two-layer free plan: model trial quota + 2M tokens/day collaboration reward.

- **Trial mode**: Major models each grant 500K tokens (one-time), automatically activated on login
- **Collaboration reward program**: 2M tokens/day, auto-reset (must be **manually activated** in the console; covers Doubao, Qwen, DeepSeek, Kimi, MiniMax, GLM, and more)
- **No credit card required**; requires identity verification
- **Paid pricing** (CNY per million tokens): Doubao-Seed-2.0-mini CNY 0.2/CNY 2.0, Seed-2.0-lite CNY 0.6/CNY 3.6, Seed-2.0-pro CNY 3.2/CNY 16 (<=32K context); Doubao-1.5-lite CNY 0.3/CNY 0.6, 1.5-pro CNY 0.8/CNY 2; DeepSeek-V3 CNY 2/CNY 8, R1 CNY 4/CNY 16
- **Catch**: Collaboration reward must be manually activated to take effect; Seed series pricing tiers by context length, jumping significantly above 32K

### [Qwen DashScope](https://bailian.console.aliyun.com/) (Alibaba Cloud Bailian)

New users get 1M tokens per model, valid for 90 days; the "70M tokens" figure is a marketing total, not a per-model quota.

- **New user free quota**: Approximately 70 supported models each grant 1M tokens, **valid for 90 days** (not permanent); summing these yields the "70M tokens" marketing figure
- **No credit card required**; requires identity verification (Alibaba Cloud account)
- **Paid pricing** (CNY per million tokens, <=128K input): qwen-turbo CNY 0.3/CNY 0.6 (thinking mode output CNY 3), qwen-plus CNY 0.8/CNY 2 (thinking CNY 8), qwen-max CNY 2.4/CNY 9.6, qwen3-max (<=32K) CNY 2.5/CNY 10; Batch API 50% off across the board
- **Catch**: Free quota vanishes after 90 days; pricing page is JS-rendered, requires a logged-in account from outside China to see full numbers

### [Moonshot Kimi](https://platform.kimi.com/) Open Platform

No permanent free tier; new users get a CNY 15 trial voucher; K2.6 is the current flagship, K2 series will be decommissioned on 2026-05-25.

- **New users**: CNY 15 free trial voucher (requires Chinese phone number), valid for 3 months; API returns 403 once depleted
- **K2 series (K2 0711 / K2 0905)**: **Officially decommissioned on 2026-05-25**; official migration path is K2.5 / K2.6
- **Paid pricing** (CNY per million tokens): Kimi K2.6 input CNY 6.50 (cache hit CNY 1.10) / output CNY 27 (256K context); Kimi K2.5 CNY 4.00 (cache CNY 0.70) / CNY 21; Moonshot V1 8K $0.20/$2.00 (USD)
- **Catch**: K2.6 is roughly 60% more expensive than K2.5; rate limit tiers unlock via cumulative top-ups; no ongoing free tier for international users

## Tier 3: Paid Only (Cheap Per-Token)

| Service | Free | Paid Starting Price | Notes |
|---------|------|---------------------|-------|
| [**DeepInfra**](https://deepinfra.com/) | None | Llama 3.1 8B $0.02/$0.05, Qwen3-235B-A22B-Instruct $0.071/$0.10, DeepSeek-V3.2 $0.26/$0.38 (cached $0.13) | Among the cheapest per-token in the market |
| [**Novita AI**](https://novita.ai/) | None | DeepSeek-V4-Flash $0.14/$0.28, Llama 3.3 70B $0.135/$0.4, Qwen3-235B $0.09/$0.58, GLM 4.5 Air $0.13/$0.85 | Extremely comprehensive model catalog (including audio/video), very competitive pricing |
| [**Together AI**](https://www.together.ai/) | None (minimum $5 deposit required, no automatic credits) | gpt-oss-20B $0.05/$0.20, gpt-oss-120B $0.15/$0.60, Llama 3.3 70B $0.88/$0.88, DeepSeek-V3.1 $0.60/$1.70 | Broadest model selection; Startup Accelerator offers $15K-$50K credits on application |
| [**Fireworks AI**](https://fireworks.ai/) | $1 signup credits | Cached input automatic 50% off, batch 50% off | Detailed pricing on docs.fireworks.ai subdomain |
| [**DeepSeek Platform**](https://platform.deepseek.com/) | None | v4-flash $0.14/$0.28 (cache hit $0.0028), v4-pro 75% off promotional pricing $0.435/$0.87 (**promotion ends 2026-05-31**, regular price $1.74/$3.48) | Cheapest for their own flagship models |
| [**xAI Grok**](https://x.ai/) | No fixed free tier | grok-4.3 $1.25/$2.50, grok-4-1-fast $0.20/$0.50 (**retiring 2026-05-15**), grok-4.20 $1.25/$2.50 | "Share data for $25/month" not currently mentioned on docs/models page |
| [**Perplexity Sonar**](https://www.perplexity.ai/) | None | Sonar $1/$1 (token) + Search API $5/1K req; Sonar Pro $3/$15; Deep Research $2/$8 + additional surcharges | Price includes built-in web search |
| [**Replicate**](https://replicate.com/) | No ongoing free tier | Billed per second | Not cost-effective for LLMs; primarily an image/video platform |
| [**Chutes**](https://chutes.ai/) | No true free tier (minimum $3/month subscription) | $3 (Base) / $10 (Plus) / $20 (Pro) | Decentralized, TEE confidential inference, fastest to list SOTA OSS models |
| [**Mistral La Plateforme**](https://mistral.ai/) | None (Le Chat chat UI is free, API has no free tier) | Large 3 $0.50/$1.50, Small 4 $0.15/$0.60, Codestral $0.30/$0.90, Medium 3.5 $1.50/$7.50, Magistral Medium $2/$5; batch 50% off across the board | Codestral has moved to paid (Premier); Ministral Edge series $0.10-$0.20 per M flat |
| [**Hyperbolic**](https://hyperbolic.xyz/) | None | Serverless pay-as-you-go starting ~$0.10/1M tokens; GPU on-demand starting $1.39/hr (H100/H200) | Also offers per-hour GPU rental and reserved clusters (contact sales) |
| [**MiniMax / Hailuo**](https://platform.minimax.io/) | None (subscription-based, starting $10/month) | M2.7 $0.30/$1.20, M2.7-highspeed $0.60/$2.40; Starter Token Plan $10/month (1,500 req/5hr) | Includes Hailuo 2.3 video generation (768P 6s from $0.19 Fast); Chinese model, global API |
| [**Featherless AI**](https://featherless.ai/) | None (Agent plan has 3-day trial) | Basic $10/month (<=15B models, unlimited tokens); Premium $25/month (any size); Agent $100/month+ | 30,000+ Hugging Face models, flat-rate unlimited tokens; subscription-based, not per-token |
| [**Anthropic**](https://www.anthropic.com/) / [**OpenAI**](https://platform.openai.com/) | Previous trial credit policies not verified on current pricing pages | Claude Haiku 4.5 $1/$5, GPT-5.4 mini $0.75/$4.50 | Paid only; trying via OpenRouter / Vercel Gateway is more cost-effective |

## Confirmed Shutdowns

- **01.AI Yi**: English API **shut down on 2025-08-25**; international version no longer operational

## Recommended Combinations

**Side Projects / Toy Demos**

Stack four providers as your primary setup -- all free, no credit card required:

- **Cerebras**: Run large models like Qwen3-235B, gpt-oss-120b at top speed
- **Groq**: Run Llama 3.3 70B, Kimi K2, Whisper (speech) -- broadest model lineup
- **Cloudflare Workers AI**: Run RAG / embedding, integrated with Workers / D1 / Vectorize
- **Google AI Studio**: Run Gemini 3 Flash for multimodal and long context experiments

Stack these four and it's very hard to exhaust RPM/RPD limits during daily development.

**Self-Hosted / Serverless GPU**

- **Modal**: $30/month permanent credits to run your own vLLM/SGLang
- **NVIDIA NIM**: Free for dev (exact quota unclear), broadest model catalog, official optimizations

**Fallback / Routing Convenience**

OpenRouter `:free` + HF Inference Providers PRO + Vercel AI Gateway $5/month make the backup trio.

**Production Paid (Cheapest Per-Token)**

- DeepInfra (per-token king, but no free tier)
- Novita AI (includes audio/video, extremely competitive pricing)
- Groq (best of both speed and price)
- DeepSeek's own v4-flash ($0.14/$0.28)

**China Market**

Stack four permanently free / daily free providers for minimum effort:

- **Zhipu GLM-4.7-Flash**: Permanently free, 200K context, no token cap (30 concurrent)
- **iFlytek Spark Lite**: Permanently free and unlimited
- **Volcengine Doubao Collaboration Reward**: Manually activate for 2M tokens/day auto-reset -- best for volume
- **Tencent Hunyuan-lite**: Completely free + 1M tokens on first activation

New users can additionally stack: Qwen DashScope (1M per model / 90 days) + Baidu Qianfan (CNY 20 voucher + free Qwen) + Kimi (CNY 15 voucher) for enough credits to try out models.

## Common Catches to Keep in Mind

- **Free tiers typically collect your prompts** for training / evaluation / safety analysis -- use paid keys for production projects
- **Model deprecation moves fast**: 5/15 grok-4-1-fast retiring, 5/27 Cerebras Llama 3.1 8B / Qwen3-235B, 5/31 DeepSeek v4-pro discount ending -- add these to your calendar
- **RPM/RPD caps are per API key / organization** -- using multiple accounts to circumvent limits typically violates ToS
- **"No credit card" does not equal "forever free"**: All free tiers can be adjusted without notice -- don't skip feature flags

Overall, the good news in 2026 is that free resources are far more abundant than in 2024 -- individual developers have no shortage of LLM APIs. The bad news is this market layer moves extremely fast, and any roundup from six months ago is likely already inaccurate. If you're reading this six months after publication, I recommend clicking the official links below to verify again.

---

## References

- [Cerebras Inference Rate Limits](https://inference-docs.cerebras.ai/support/rate-limits)
- [Cerebras Inference Pricing](https://inference-docs.cerebras.ai/support/pricing)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Groq Pricing](https://groq.com/pricing)
- [Cloudflare Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Google Gemini API Pricing](https://ai.google.dev/pricing)
- [Google Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [OpenRouter API Limits](https://openrouter.ai/docs/api-reference/limits)
- [GitHub Models Prototyping Limits](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models)
- [Hugging Face Inference Providers Pricing](https://huggingface.co/docs/inference-providers/pricing)
- [Vercel AI Gateway Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Cohere Rate Limits](https://docs.cohere.com/docs/rate-limits)
- [Together AI Pricing](https://www.together.ai/pricing)
- [Fireworks AI Pricing](https://fireworks.ai/pricing)
- [DeepInfra Pricing](https://deepinfra.com/pricing)
- [Novita AI Pricing](https://novita.ai/pricing)
- [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [xAI Models](https://docs.x.ai/docs/models)
- [Perplexity API Pricing](https://docs.perplexity.ai/guides/pricing)
- [SambaNova Cloud Pricing](https://cloud.sambanova.ai/plans/pricing)
- [Modal Pricing](https://modal.com/pricing)
- [NVIDIA build.nvidia.com](https://build.nvidia.com/)
- [Nebius Token Factory](https://nebius.com/services/studio-inference-service)
- [Inference.net Pricing](https://inference.net/pricing)
- [AI21 Pricing](https://www.ai21.com/pricing)
- [Pollinations.ai](https://pollinations.ai/)
- [AI Horde](https://aihorde.net/)
- [iFlytek Spark API](https://xinghuo.xfyun.cn/sparkapi)
- [Tencent Hunyuan Pricing](https://cloud.tencent.com/document/product/1729/97731)
- [Baidu Qianfan](https://qianfan.cloud.baidu.com/)
- [Ollama](https://ollama.com/)
- [Mistral La Plateforme Pricing](https://mistral.ai/pricing/)
- [Hyperbolic Docs](https://docs.hyperbolic.xyz/)
- [MiniMax Platform Pricing](https://platform.minimax.io/docs/guides/pricing-paygo)
- [Featherless AI](https://featherless.ai/)
- [Baseten Pricing](https://www.baseten.co/pricing/)
- [Zhipu GLM BigModel Pricing](https://bigmodel.cn/pricing)
- [Volcengine Doubao Free Quota](https://www.volcengine.com/docs/82379/1399514)
- [Moonshot Kimi API Pricing](https://platform.kimi.com/docs/pricing/)
- [Qwen DashScope Model Pricing](https://help.aliyun.com/zh/model-studio/model-pricing)
