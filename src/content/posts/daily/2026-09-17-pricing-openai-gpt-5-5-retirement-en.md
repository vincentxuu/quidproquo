---
title: "Pricing Watch | OpenAI Retires GPT-5.5 from ChatGPT/Codex on 10/14, API Untouched"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: en
description: "OpenAI is retiring GPT-5.5 from ChatGPT, ChatGPT Work, and Codex on 2026-10-14. Direct API calls to gpt-5.5 are unaffected, and the model Codex users are pushed toward, GPT-5.6 Sol, is actually cheaper."
tldr: "OpenAI announced on 2026-09-14 that GPT-5.5 will retire from ChatGPT, ChatGPT Work, and Codex on 2026-10-14 — but calling `gpt-5.5` directly through the OpenAI API is unaffected. This is a product-surface retirement, not an API sunset. On the official pricing page, gpt-5.5's short-context input/output is $5.00/$30.00 per million tokens; the officially recommended Codex replacement, GPT-5.6 Sol, is $4.00/$20.00 — cheaper on both input (↓20%) and output (↓33%). The gap between announcement and shutdown is one month, far shorter than OpenAI's own documented minimum of six months' notice for GA models."
series:
  name: "AI Pricing Watch"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-09-17-pricing-openai-gpt-5-5-retirement)

## Summary of Changes

OpenAI posted this to its official changelog on 2026-09-14, then reiterated it via the @ChatGPT account on X on 9/15: GPT-5.5 will retire from ChatGPT, ChatGPT Work, and Codex — across every plan, consumer through Enterprise and Edu — on 2026-10-14. This isn't the usual "old price → new price" story either. It's the second "product-surface retirement" this column has tracked, and it differs from the Assistants API shutdown on 8/26 in one key way: OpenAI explicitly states this retirement doesn't apply to the OpenAI API. Calling `gpt-5.5` directly with an API key keeps working exactly as before; only Codex users signed in with a ChatGPT account are forced to move. There's also a twist worth recording: the model they're pushed toward is actually cheaper than the one being retired — the opposite of what happened in August, when the forced migration made costs go up.

## Before & After

| Item | Old | New | Change | Effective |
|---|---|---|---|---|
| GPT-5.5 (short context) Input | $5.00/1M tokens | GPT-5.6 Sol: $4.00/1M tokens | ↓20% | 2026-10-14 |
| GPT-5.5 (short context) Output | $30.00/1M tokens | GPT-5.6 Sol: $20.00/1M tokens | ↓33% | 2026-10-14 |
| GPT-5.5 (short context) Cached Input | $0.50/1M tokens | GPT-5.6 Sol: $0.40/1M tokens | ↓20% | 2026-10-14 |
| GPT-5.5 (short context) Batch Input/Output | $2.50/$15.00 per 1M tokens | GPT-5.6 Sol: $2.00/$10.00 per 1M tokens | ↓20% / ↓33% | 2026-10-14 |
| Access surfaces | Available in ChatGPT, ChatGPT Work, Codex, and the API | `gpt-5.5` stays on the API only; removed from all three ChatGPT/Codex surfaces | Product-surface retirement, API unaffected | 2026-10-14 |

## Cost Estimate

**Scenario**: A coding agent run through Codex (signed in with a ChatGPT account) that hardcoded `gpt-5.5`, handling call volume equivalent to 10,000 conversations per day (average 1,500 input tokens + 500 output tokens each) — roughly 450M input tokens and 150M output tokens per month. The figures below use the official API $/token pricing to illustrate the token economics of switching models; they don't represent the actual billing mechanics of a Codex subscription.

| | GPT-5.5 (old) | GPT-5.6 Sol (official replacement) | Monthly savings |
|---|---|---|---|
| Input cost/month | $2,250 | $1,800 | $450 |
| Output cost/month | $4,500 | $3,000 | $1,500 |
| **Total** | **$6,750/mo** | **$4,800/mo** | **$1,950 (↓29%)** |

That's the opposite of August's Assistants API case, where the forced migration cost 29–129% more depending on the replacement chosen. This time the direction of the forced move happens to be toward a cheaper, newer model — developers don't need to spend extra effort hunting for a workaround just because the migration wasn't their choice.

## Impact on Developers & Enterprises

### Who's Hit Hardest

Teams that hardcoded the `gpt-5.5` model ID into Codex custom agents, scheduled tasks, or workspace defaults are the ones who need to act — OpenAI's own changelog specifically calls out checking those spots. Anything calling `gpt-5.5` directly through `/v1/chat/completions` or `/v1/responses` with an API key is completely unaffected and can keep running until OpenAI separately announces an API-level deprecation timeline for the model.

### The Gap Between Product Retirement and API Sunset Policy

OpenAI's own API documentation is explicit: GA models get at least six months' notice before retirement. Yet GPT-5.5's removal from ChatGPT and Codex gives only about a month between the announcement (2026-09-14) and the shutdown date (2026-10-14). That's not a policy violation — the six-month notice period is written specifically for API-level model deprecations and never claims to cover model removals from the ChatGPT/Codex product surface. August's Assistants API case was about a beta label slipping past the GA-grade buffer; this one is about a product-surface model removal sitting entirely outside the API deprecation policy's scope in the first place. Reading the same company's documentation side by side — where it does and doesn't make commitments — is the only way to see where the actual guarantees end. GPT-5.5 itself launched on 2026-04-23, giving it a run of under six months inside ChatGPT and Codex.

### Action Items

- If you're on Codex with ChatGPT sign-in and have `gpt-5.5` hardcoded anywhere: check workspace defaults, custom agents, scheduled tasks, and scripts now, and switch to `gpt-5.6-sol` before 10/14 — that's the path OpenAI's changelog names explicitly. Some coverage mentions GPT-6 Astra as an alternative, but the official changelog only documents the Sol migration path.
- If you're a pure API-key user: this announcement doesn't apply to you — `gpt-5.5` keeps working. But since the recommended replacement is both cheaper and newer, it's worth carving out time to run an eval pass and decide whether to upgrade proactively instead of waiting for the next deprecation notice.
- If you maintain an internal "model deprecation watch" process for your team: this case is a reminder not to rely solely on `developers.openai.com/api/docs/deprecations` for coverage — ChatGPT/Codex product-surface retirements travel through a completely separate channel (the changelog plus the official social account), so track the two separately.

## Expiration Notice

⚠️ **Shutdown date**: 2026-10-14. GPT-5.5 will be removed from ChatGPT, ChatGPT Work, and Codex across all plans (consumer, Business, Enterprise, Edu). Direct calls to `gpt-5.5` through the OpenAI API are unaffected. Codex (ChatGPT sign-in) migration guide: [GPT-5.5 retirement | ChatGPT Learn](https://learn.chatgpt.com/codex/models#gpt-55-retirement).

## Takeaway

Model deprecations used to register as a single kind of event to track. This one made clear the same company actually runs two separate deprecation regimes side by side: the API side carries a documented six-month minimum notice, while the ChatGPT/Codex product side carries no such commitment — it can retire a model on whatever timeline it chooses. And the direction of this particular forced move cuts against the usual assumption that "forced migration" means "costs more." Tracking pricing changes can't just ask "did it go up or down" — it first has to ask which layer was actually forced to move, and that answer often decides whether the cost direction matches your gut assumption at all.

## References

- [ChatGPT & Codex changelog (2026-09-14 GPT-5.5 retirement entry) | ChatGPT Learn](https://learn.chatgpt.com/docs/changelog)
- [What's new | ChatGPT Learn](https://learn.chatgpt.com/docs/whats-new)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [Deprecations | OpenAI API](https://developers.openai.com/api/docs/deprecations)
- [OpenAI retiring GPT-5.5 on October 14: you may need to update your workflow — Gizmochina](https://www.gizmochina.com/2026/09/16/openai-retiring-gpt-5-5-on-october-14-you-may-need-to-update-your-workflow/)
- [@ChatGPT on X (2026-09-15 official announcement post)](https://x.com/ChatGPT/status/2099954190600876533)
