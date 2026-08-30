---
title: "BytePlus ModelArk Coding Plan: ByteDance's AI Coding Subscription"
date: 2026-08-25
category: ai
type: deep-dive
tags: [llm-api, agentic-coding, deepseek, claude-code, cursor, llm-pricing, coding]
lang: en
tldr: "BytePlus ModelArk Coding Plan offers Lite ($10/month) and Pro ($50/month) subscriptions covering models such as DeepSeek-V4, GLM-5.2, and Seed-2.0 in tools including Claude Code and Cursor. Lite includes about 24,000 requests per month; Pro includes five times as many."
description: "An introduction to BytePlus ModelArk Coding Plan: pricing, quotas, supported models and tools, usage restrictions, and how it differs from Anthropic Max and OpenRouter-style offerings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-byteplus-modelark-coding-plan)

BytePlus is ByteDance's international cloud-services brand, and ModelArk is its AI model inference platform. Coding Plan is ModelArk's subscription for AI-assisted development: one monthly fee covers models from several vendors and works directly in tools such as Claude Code and Cursor, without requiring you to manage multiple API keys or inference endpoints.

## Positioning: A Multi-model Pass for Developers

According to the [official BytePlus documentation](https://docs.byteplus.com/en/docs/ModelArk/1925114), Coding Plan's central proposition is “one subscription, multiple model providers.” Unlike subscriptions bought directly from Anthropic or OpenAI, which offer only their own models, Coding Plan places ByteDance's Seed family, DeepSeek, Zhipu GLM, Moonshot Kimi, and GPT-OSS in one quota pool. Developers can switch models as the task changes.

This works well if you want AI coding assistance without committing to one model provider, or if you want a lightweight model for routine completion and a reasoning model for a difficult refactor without managing several API keys.

## Plans and Pricing

Coding Plan has Lite and Pro tiers. The [official new-user page](https://docs.byteplus.com/en/docs/ModelArk/1928265) lists the following standard prices:

| Plan | Monthly price | Three months | Positioning |
|---|---|---|---|
| Lite | $10 USD | $30 USD | Moderate development use; suitable for most developers |
| Pro | $50 USD | $150 USD | Intensive work on complex projects |

One account can subscribe for no more than six consecutive months and can select only one tier. Team Plan is priced separately at $20/month for Lite and $100/month for Pro.

The early first-purchase offer for new users—$5/month for Lite and $25/month for Pro—ended on March 17, 2026. A referral program remains: referrers receive a coupon worth 10% of a friend's order, with no cap, while the referred user receives 10% off the first order.

## How Quotas Work

The quota system is the part of Coding Plan that requires the most attention. The official documentation gives Lite three overlapping limits:

| Window | Lite | Pro (5× Lite) |
|---|---|---|
| Every 5 hours | ≈ 1,900 requests | ≈ 9,500 requests |
| Weekly | ≈ 12,000 requests | ≈ 60,000 requests |
| Monthly | ≈ 24,000 requests | ≈ 120,000 requests |

BytePlus says Lite's total monthly quota is about three times that of Claude Pro. Here, however, a “request” means one model call, not one user prompt. A user prompt in Claude Code or Cursor commonly triggers 5–15 model calls for a simple Q&A task and 30 or more for a complex refactor. That puts Lite at roughly 1,600–4,800 user prompts per month.

After a quota is exhausted, it resets automatically at the next interval. The five-hour window begins with the first request; the weekly quota resets Monday at 00:00; and the monthly quota resets at 00:00 on the first day of the subscription month. Overage does not draw from another account balance or package.

## Supported Models

As of August 2026, Coding Plan includes the following models, selectable from the tool settings:

| Model | Context window | Highlights |
|---|---|---|
| Auto | — | System selects the best model and prioritizes the latest version |
| Dola-Seed-2.0-Pro | — | Long-chain reasoning for complex business scenarios |
| Dola-Seed-2.0-Lite | — | General model balancing quality and speed |
| Dola-Seed-2.0-Code | — | Front-end development with multimodal vision support |
| Kimi-K2.5 | 256k | Stronger front-end capability and multimodality |
| GLM-5.1 | 200k | Code generation and long-horizon autonomous execution |
| GLM-5.2 | 1M | Zhipu's flagship for long-running tasks |
| DeepSeek-V4-Flash | 1M | Fast and inexpensive; deep reasoning enabled by default |
| DeepSeek-V4-Pro | 1M | Stronger agent capabilities at a higher quota multiplier |
| GPT-OSS-120b | — | Reasoning and function calling |

GLM-5.2, DeepSeek-V4-Flash, and DeepSeek-V4-Pro support 1M-token context windows, which helps with long conversations over large codebases. DeepSeek-V4-Pro consumes quota at a higher multiplier, so BytePlus recommends reserving it for hard problems.

## Supported Coding Tools

All supported tools draw from the same Coding Plan quota:

- **Terminal / CLI:** Claude Code, OpenCode, Codex
- **IDEs:** Cursor, TraeCode, Cline (VS Code), Kilo Code, Roo Code
- **Self-hosted agents:** Hermes Agent, OpenClaw

Configuration is consistent: enter an API key and Base URL. BytePlus supplies two compatible endpoints:

- OpenAI-compatible: `ark.ap-southeast.bytepluses.com/api/coding/v3`
- Anthropic-compatible: `ark.ap-southeast.bytepluses.com/api/coding`

You can also select `ark-code-latest`, then change the underlying model in the ModelArk console without modifying the tool configuration.

## Usage Restrictions

Coding Plan has several important restrictions:

1. **AI coding tools only:** the quota may be used only through the supported tools above, not through direct API calls. Using the Base URL and API key in a non-coding tool may be treated as a violation and lead to subscription deactivation or account suspension.
2. **One plan per account:** an account must choose Lite or Pro; the two cannot be combined.
3. **Six-month maximum:** a single continuous subscription can cover at most six months.
4. **Regional availability:** model availability varies by region; the console is authoritative.

## Pro Add-on: ArkClaw

Pro subscribers receive ArkClaw during the subscription period. ArkClaw is an AI assistant inside Lark, the international version of Feishu. It supports models from GPT, DeepSeek, GLM, and Kimi and offers AI meeting notes, task tracking, multidimensional table management, and document generation, along with secure private deployment, high-capacity cloud storage, and skill security scanning.

## What Counts as a Request?

In Coding Plan, a request is a model call, not a prompt you type. In tools such as Claude Code or Cursor, one user prompt triggers several background calls for reading files, reasoning, generation, and verification. According to the [official documentation](https://docs.byteplus.com/en/docs/ModelArk/1925114):

| Task | Model calls per prompt |
|---|---|
| Simple Q&A / code generation | 5–15 |
| Refactoring / complex tasks | 15–30+ |

Using a median estimate of 15 calls, the effective prompt counts are:

| Plan | Monthly request quota | ≈ Effective prompts | Cost per prompt |
|---|---|---|---|
| Lite | 24,000 | ~1,600 | ~$0.006 |
| Pro | 120,000 | ~8,000 | ~$0.006 |

Embedding calls to Skylark-Embedding-Vision also consume quota. DeepSeek-V4-Pro uses a higher quota multiplier, so BytePlus recommends other models for routine tasks.

## Is It Worth It? A Cost Comparison

Coding Plan competes most directly with fixed-price offerings such as Anthropic Claude Pro / Max and Cursor Pro, not usage-priced API routers such as OpenRouter or LiteLLM. A [2026 comparison by codepick.dev](https://codepick.dev/en/compare/ai-coding-cost-comparison-2026) divides AI coding plans into fixed subscriptions with implicit caps, including Claude, Cursor, and Copilot; fixed subscriptions with rolling quota windows, including BytePlus Ark, MiniMax, and Bailian; and usage-based APIs.

| Plan | Monthly price | Models | Approximate usage | Restrictions |
|---|---|---|---|---|
| **BytePlus Lite** | $10 | 10+ providers | ~1,600 prompts | AI coding tools only |
| **BytePlus Pro** | $50 | 10+ providers | ~8,000 prompts | AI coding tools only |
| **Copilot** | $10 | GPT-4o, etc. | Unlimited completion; limited chat | GitHub ecosystem |
| **Claude Pro** | $20 | Claude only | ~1/3 of Lite (BytePlus claim) | No scenario restriction |
| **Cursor Pro** | $20 | Multiple providers | 500 fast requests | Cursor only |
| **Cursor Pro+** | $60 | Multiple providers | Larger quota | Cursor only |
| **Claude Max 5×** | $100 | Claude only | 5× Claude Pro | No scenario restriction |
| **Claude Max 20×** | $200 | Claude only | 20× Claude Pro | No scenario restriction |

### The Main Trade-off: Quantity vs. Quality

Lite's $10 price is attractive on quota alone: BytePlus says it offers about three times Claude Pro's monthly quota at half the price. Two fundamental trade-offs remain:

1. **Model capability:** Coding Plan does not include Claude Sonnet or Opus. Claude and GPT-4.1 still succeed more often than DeepSeek-V4 and GLM-5.2 at complex agentic coding tasks such as multi-step reasoning and large-codebase refactors. The offer is more volume without the very strongest models.
2. **Scenario restriction:** the quota works only in AI coding tools. You cannot use it for batch analysis, ordinary API calls, or your own application. Claude Pro / Max does not impose that restriction.

### Suggested Combinations by Usage Level

- **Light use** (a few prompts per day): BytePlus Lite at $10 is enough and is the least expensive entry point.
- **Moderate use** (50+ prompts per day): BytePlus Lite at $10 for routine work plus Claude Pro at $20 for complex tasks totals $30/month, less than Cursor Pro+ at $60 and with more model choice.
- **Heavy use** (agentic coding all day): Claude Max at $100–200 has no substitute, because the need is Claude's reasoning ability, not merely request volume.

## Who It Suits

- **Budget-conscious individual developers:** Lite offers more quota and model choice than Claude Pro for $10/month.
- **Developers who want to try Chinese models:** DeepSeek-V4 and GLM-5.2 perform well on some tasks, and Coding Plan lowers the barrier to testing them.
- **People who do not want to manage multiple API keys:** one subscription switches among several model providers.
- **Developers pairing it with Claude:** use Lite for routine work and switch to Claude for hard tasks to control the total monthly cost.

It does not suit people who need LLM APIs outside coding tools, teams that require stable subscriptions longer than six months, enterprises with model-provenance compliance requirements, or agentic-coding users who depend heavily on Claude's reasoning.

## References

- [BytePlus ModelArk Coding Plan campaign page](https://www.byteplus.com/en/activity/codingplan)
- [ModelArk Coding Plan subscription overview](https://docs.byteplus.com/en/docs/ModelArk/1925114)
- [New-user limited offer and pricing](https://docs.byteplus.com/en/docs/ModelArk/1928265)
- [Coding Plan Team overview](https://docs.byteplus.com/en/docs/ModelArk/2276791)
- [ModelArk pricing](https://docs.byteplus.com/docs/ModelArk/1099320)
- [AI Coding Tool Monthly Cost Comparison 2026 — codepick.dev](https://codepick.dev/en/compare/ai-coding-cost-comparison-2026)
