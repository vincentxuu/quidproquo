---
title: "The Nous Tool Gateway: One Subscription Instead of Four Accounts, at the Cost of Concentrating Your Tool Supply Chain"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, nous-portal, tool-gateway, firecrawl, image-generation, tts]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 4
tldr: "The Tool Gateway routes four tool categories — web search (Firecrawl), image generation (nine FAL models), TTS (OpenAI), and cloud browser (Browser Use) — through Nous infrastructure, replacing four signups with one OAuth. It's per-tool rather than all-or-nothing, and `use_gateway: true` overrides any direct key in your `.env` — the precedence rule people most often get wrong."
description: "What the Nous Tool Gateway actually covers, the three ways to enable it, the per-tool precedence rules, the paid threshold and free tool pool, and the trade-off of concentrating your tool supply chain with one vendor."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-tool-gateway)

Post 4 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

Making an agent genuinely useful usually means maintaining four or five accounts: one for search, one for page extraction, one for image generation, one for voice, one for a cloud browser — each with its own signup, rate limits, billing, and quirks. The Tool Gateway is Nous's answer to that, and the tool-layer extension of the subscription strategy covered in [the previous post](/en/posts/ai/2026-08-18-hermes-agent-providers).

## The four categories

| Tool | Backend | What you get |
|---|---|---|
| Web search & extract | Firecrawl | Agent-grade search plus full-page extraction; per the docs, "no rate limits to worry about — the gateway handles scaling" |
| Image generation | FAL | Nine models behind one endpoint: FLUX 2 Klein 9B (default), FLUX 2 Pro, Z-Image Turbo, Nano Banana Pro (Gemini 3 Pro Image), GPT Image 1.5/2, Ideogram V3, Recraft V4 Pro, Qwen Image |
| Text-to-speech | OpenAI TTS | Wired into the `text_to_speech` tool; drop voice notes straight into Telegram |
| Cloud browser | Browser Use | Headless Chromium with `browser_navigate`, `browser_click`, `browser_type`, `browser_vision` — no Browserbase account |

All four bill pay-as-you-use against your Nous subscription. Upstream's own framing is "same backends the direct-key route uses — just fronted by us," so the pitch isn't better quality. It's **four fewer signups**.

## Three ways in, differing in side effects

```bash
hermes setup --portal   # Fresh install: OAuth + set Nous as provider + gateway for all tools
hermes model            # Existing install: switch to Nous Portal, then it offers to flip everything
hermes tools            # À la carte: pick "Nous Subscription" for one specific tool
```

The third path has a property that's easy to miss: **`hermes tools` doesn't require logging in first**. The Nous-managed backends are always listed, and selecting one triggers the Portal login inline. That path logs you in and enables only the tool you picked — it does **not** switch your inference provider and does **not** offer to flip every other tool. If you want "Nous for search, inference stays on my own vLLM," this is the route.

To check what's live:

```bash
hermes portal info    # auth plus gateway routing summary
hermes portal tools   # catalog with current routing per tool
hermes status         # full system status, gateway included
```

`hermes portal info` marks each tool as "active via Nous subscription" or as using your own key. That output is the only reliable source of truth — a config file that looks right doesn't mean the routing is right.

## The rule people get wrong: precedence

Every tool's config block takes a `use_gateway` boolean:

```yaml
web:
  backend: firecrawl
  use_gateway: true
image_gen:
  use_gateway: true
tts:
  provider: openai
  use_gateway: true
browser:
  cloud_provider: browser-use
  use_gateway: true
```

Precedence, in upstream's words:

> `use_gateway: true` routes through Nous **regardless of any direct keys in `.env`**. `use_gateway: false` (or absent) uses direct keys if available and only falls back to the gateway when none exist.

In plain terms: **with the gateway on, your `FIRECRAWL_API_KEY` might as well not exist.** It is not "use mine first, fall back to the gateway." Flip the flag off and your keys become the source again, so there's no reason to delete them when switching. `hermes tools` clears the flag automatically when you choose a non-gateway provider, so most people never edit this by hand.

The classic confusion this produces: "I pay for Firecrawl — why is everything still billing to Nous?" Because `use_gateway: true` wins on that row.

## Mixing is the intended use

The docs are explicit that the gateway is per-tool, not all-or-nothing, and list three common shapes: everything through Nous; web and images through the gateway while keeping your own ElevenLabs voice; or "I already pay for Browserbase but don't want a Firecrawl account."

The stated positioning is that this is a shortcut rather than lock-in. The way to test such a claim is to ask what switching back costs — here it's one boolean, which is honest.

## Eligibility: paid, with a possible free pool

The Tool Gateway is a **paid-subscription feature**. Free Nous accounts can use Portal for inference but get no managed tools. The docs also mention a **free tool pool** on some accounts — a small managed-tool allowance the gateway surfaces with an opt-in prompt on first use.

One boundary that gets misread: **Modal, the serverless terminal backend, is not part of the Tool Gateway bundle.** It's an optional add-on under the Nous subscription, configured through `hermes setup terminal` or `config.yaml`. [Post 5](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends) covers that.

If your subscription lapses, gateway-routed tools stop working until you renew or swap direct keys back in via `hermes tools`; Hermes surfaces an error pointing at the portal. Usage breaks down per tool in the Portal dashboard.

## Self-hosting and enterprise

Running your own Nous-compatible gateway means overriding endpoints in `~/.hermes/.env`:

```bash
TOOL_GATEWAY_DOMAIN=your-domain.example.com
TOOL_GATEWAY_SCHEME=https
TOOL_GATEWAY_USER_TOKEN=your-token
FIRECRAWL_GATEWAY_URL=https://...   # override a single endpoint
```

The docs frame these as knobs for enterprise deployments and dev environments that regular subscribers never touch. Worth noting that a single endpoint can be overridden on its own — this layer is separable, not a black box.

## How to weigh it

The upside is unambiguous: one bill, one signup, one key — and because the gateway operates at the **tool-execution layer** rather than in the CLI, every interface benefits transparently, including Telegram, Discord, and the API server.

The cost is equally clear, and upstream won't state it for you: **you concentrate four tool supply chains into one vendor.** If Nous has an outage, rate-limits you, changes pricing, or changes the model list, your search, image generation, voice, and browser degrade together — whereas four separate accounts fail independently. The nine-model image list will also move (the docs say "The set evolves"), so prompts pinned to a specific model ID travel with it.

My recommendation is to tier by criticality: **keep your own key as a fallback for tools whose failure blocks your work, and route the nice-to-haves (image generation, TTS) through the gateway.** Since switching costs one boolean, that mixed strategy carries almost no maintenance burden.

Next: [the seven terminal backends](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends) — whose machine your commands actually run on.

## References

- [Hermes Agent — Nous Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway)
- [Hermes Agent — Nous Portal integration](https://hermes-agent.nousresearch.com/docs/integrations/nous-portal)
- [Nous Portal subscription management](https://portal.nousresearch.com/manage-subscription)
- [Firecrawl](https://firecrawl.dev/)
- [FAL](https://fal.ai/)
- [Browser Use](https://browser-use.com/)
