---
title: "Who Pays for Always-On: How Vendors Charge for a Computer That Runs 24 Hours a Day, and Why the Limits Keep Changing"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, pricing, openclaw, grok]
lang: en
tldr: "Always-on agents are charged in three ways: a shared usage pool inside a subscription (Duet, Grok Bot, Gemini, Muse, Hark, Dots), per-task credits or budgets (Perplexity, Devin Bots, Kimi Claw), or self-hosting where you pay for the server and the model (OpenClaw, Hermes). What they share is that background work keeps drawing from the same pool: Grok Bot cut its limits in November, with Musk saying serving costs were unsustainably high relative to revenue, and Claude Duet states plainly that its check-in frequency is constrained by usage limits. What drives cost most is how often the agent wakes and how much context it carries each time: checking every 30 minutes while carrying the whole main conversation can mean 4.8 million tokens a day; switching to a clean isolated job, or skipping the model when nothing has changed, can cut that by one or two orders of magnitude."
description: "The three ways always-on agents are charged and how each vendor's usage pools, credits and budgets work, how Grok Bot's limits were cut, the trade-off between Claude Duet's check-in frequency and usage limits, the cost structure and cost-saving settings for self-hosted OpenClaw and Hermes, how QClaw handled subscriptions when it shut down, and a way to estimate what one routine task costs under each charging model."
series:
  name: "Always-On AI Agents"
  order: 21
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-who-pays-for-always-on)

| Charging model | Products | How background work is counted | How to control it |
|---|---|---|---|
| Shared usage pool in a subscription | Claude Duet, Grok Bot, Tasks in Gemini, Muse, Hark Pro, Dots | Shares one pool with your regular conversations | Change plans, turn off extra purchases |
| Per-task credits or budgets | Perplexity teammates, Devin Bots, Kimi Claw | Credits per job; a cloud host charged daily | Monthly caps, per-bot budgets |
| Self-hosted | OpenClaw, Hermes Agent | Monthly server rent plus tokens for every model call | Frequency, context size, cheaper models |

According to [TechCrunch](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/), over Halloween weekend some Grok Bot users woke up to find their weekly usage had jumped from 50% to 100%, even though they hadn't used it all weekend.

They assumed it was a bug. Musk replied on X that it wasn't:

> The cost of serving Grok Bot was unsustainably high relative to revenue

When the article ran, Musk hadn't said how the limits would be set going forward.

This post is about the money behind always-on agents: how vendors charge for a computer that runs 24 hours a day, and why the limits keep changing.

## Why always-on is especially expensive

A chatbot costs money only when you send a message. An always-on agent is different: [order 1](/posts/ai/2026-11-20-always-on-agent-anatomy-en) covered its three ways of waking up, and whichever one it uses, every wake is at least one model call, made while you're not there.

[Order 17](/posts/ai/2026-11-20-overreaching-agents-en) gave an extreme example. A dot tested by AI governance company Geordie had only read-only permissions, yet within a day it produced 155 activity traces on its own and used about 307,000 tokens, without a single word from the user. That's the product working as designed, not a bug.

So vendors face a problem: they collect a fixed subscription each month, but how much each user's agent runs in the background varies enormously. Their answers differ, but they point the same way: count background work against some kind of usage limit.

## Model 1: a shared usage pool inside a subscription

Most consumer products don't charge separately; background work shares the same allowance as your regular conversations.

- **Claude Duet**: [the help page states](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) that morning briefs and check-ins count toward your five-hour and weekly limits, the same as ordinary chats. Why "every few hours" rather than constant watching? The official reason is blunt: checking constantly would use up your plan's limits too fast. The cost is on the same page: "something urgent can arrive between checks."
- **Grok Bot**: shares a weekly pool with Cursor and the Grok app, [counted](https://docs.x.ai/grok-bot/faq) by how many steps the agent takes and how many tokens it uses, not how many messages you send. [AIMultiple quotes Cursor's warning](https://aimultiple.com/always-on-agents) that an hourly routine, or a trigger on a busy Slack channel, "can use a week of usage in a day."
- **Tasks in Gemini**: counted against the Gemini app's compute allowance; when it runs out, scheduled tasks don't run.
- **Muse**: the free tier has a weekly cap; [the paid plans TechCrunch describes](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/) are $20 a month for 500 million Muse tokens a week, or $100 for 3 billion. Meta doesn't say what a "Muse token" measures.
- **Hark Pro**: every feature is free, and [paying only raises the limits](https://hark.com/articles/introducing-hark-pro); the free tier's exact allowance isn't published.
- **Dots**: your first dot is included in plans like Pro, and chatting with it doesn't count toward ChatGPT usage, but tasks it hands to Codex or ChatGPT Work count as usual.

This is the simplest model for users, but it carries two risks:

- **Background work crowds out your own usage**: Duet's help page warns outright that you may hit your limit sooner than if you only chatted.
- **The vendor can resize the pool at any time**: Grok Bot is the example. Routine jobs you've set up may suddenly stop running one day.

## Model 2: per-task credits, or a budget per agent

The other approach converts work directly into credits, so you can see what each job costs.

- **Perplexity teammates**: [the help center says](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity) 100 credits equal $1, ordinary searches cost nothing, and only Computer work is charged. Looking up a fact costs 15 to 70 credits, a multi-step research report 350 to 950, and a data dashboard 2,400 to 9,800. The Max plan includes 10,000 credits a month; extra purchases have a monthly cap, $200 by default, and when it's reached, running tasks pause.
- **Devin Bots**: [usage is paid by the bot's creator](https://docs.devin.ai/work-with-devin/bots/usage-limits), and Teams and Enterprise plans can set a dollar or ACU cap for each bot. On Enterprise, the budget feature has to be turned on before the cap actually blocks anything.
- **Kimi Claw**: a deployed cloud host [deducts about 0.6% of membership credits every day](https://www.kimi.com/en/help/membership/membership-pricing), even when no tasks are running, because the host and its data stay in place. When you're not using it, Kimi recommends saving your memory and workspace files and then deleting the host.

This model is transparent, but you have to do the math yourself. Perplexity's numbers show why: a multi-step research job run once a day comes to 10,500 to 28,500 credits a month, more than the Max plan's monthly allowance.

## Model 3: self-hosting, paying for the server and the model

Open-source OpenClaw and Hermes are free, and the money goes to two places.

**Server**: you need a machine that stays on. [As AIMultiple notes](https://aimultiple.com/always-on-agents), OpenClaw's own setup guide uses a 1 GB cloud server at about $6 a month. That cost is fixed and predictable.

**Model**: every wake that calls a model costs tokens, and this is the big expense. AIMultiple's estimate: if OpenClaw's periodic check runs in the main conversation, it resends the whole conversation history each time. With a 100,000-token history and a check every 30 minutes, that's 4.8 million input tokens a day; at Claude Opus 5.5's list price without caching, about $19.

The test numbers are close: in AIMultiple's nine-day test, OpenClaw's model usage cost about $11 a day, whether or not it produced a report that day. For Hermes, they estimated about $20 a day at API prices, which is why they ran it through a ChatGPT plan instead.

The upside of self-hosting is that every cost-saving dial is in your hands:

- **Use a clean isolated job, not the main conversation**: [OpenClaw's docs](https://docs.openclaw.ai/automation/cron-jobs/payloads/) say an isolated job starts each run with fresh context and doesn't read old conversations. Most of those 4.8 million tokens are resent history.
- **Use a cheaper model for routine work**: the same docs recommend lighter models for routine jobs like summaries, classification and status checks. Each run is cheaper and faster, and across a schedule it adds up.
- **Skip the model when nothing has changed**: OpenClaw can use a condition trigger or a script to decide whether there's anything to do, skipping the model if not. Hermes's [monitor mode](https://pinggy.io/blog/proactive_ai_agents_compared/) follows the same idea: run a cheap check first, and don't call the model at all if the output hasn't changed.
- **Limit the hours**: OpenClaw's [`activeHours`](https://docs.openclaw.ai/gateway/heartbeat) restricts checks to the hours you're awake.

## When a product shuts down, what happens to your subscription

Charging has another side that's easy to overlook: what happens when the product goes away. [Order 15](/posts/ai/2026-11-20-china-claw-family-en) covered Tencent's QClaw, which stops operating on December 24, 2026. [The announcement](https://news.qq.com/rain/a/20260924A0DF5T00) (in Chinese) set out:

- From the announcement, new registrations and subscription purchases and renewals stopped; auto-renewals stop automatically.
- Unused subscriptions or credit packs can be refunded.
- Data can be migrated to WorkBuddy, and users who complete the migration get 1,000 credits.

That's one of the more careful examples. Before subscribing to an always-on agent, check what its terms say about refunds and data export if the service ends.

## Estimating what one routine task costs

Work it out with a task you actually want to hand off, for example "check my inbox every 30 minutes and notify me only when something needs a reply."

**1. Count how many times a day it wakes**

| Frequency | Times a day |
|---|---|
| Every 30 minutes | 48 |
| Every 30 minutes, 8 am to 10 pm only | 28 |
| Every 2 hours | 12 |
| Once a day | 1 |

**2. Estimate the cost of each wake**

- Subscription pool: there's no published conversion; run it for a few days and watch how fast the usage bar moves.
- Credit-based: use the official reference table. A simple check is close to "looking up a fact"; a check that needs summarizing is close to "multi-step research."
- Self-hosted: tokens per wake ≈ context carried in + what it reads this time + its answer. Carrying the whole main conversation can mean tens of thousands to over a hundred thousand tokens of context; an isolated job carrying only its instructions is usually a few thousand.

**3. Multiply, and compare across the three models**

Taking self-hosting as an example, using AIMultiple's price assumption above ($4 per million input tokens, no caching), here's my own rough arithmetic:

| Approach | Input tokens a day | Roughly a day |
|---|---|---|
| Every 30 minutes, carrying a 100,000-token main conversation | 4.8 million | $19 |
| Every 30 minutes, isolated job, about 5,000 each | 240,000 | $1 |
| 8 am to 10 pm only, isolated job | 140,000 | $0.60 |
| Skip the model when nothing changed; actually called 5 times a day | 25,000 | $0.10 |

The same task, done differently, can differ in cost by two orders of magnitude. Subscriptions and credits hide the tokens, but the principle is the same: the more often it wakes and the more it carries each time, the faster the pool drains.

**4. Find the setting that saves the most**

Ranked by effect, usually:

1. Skip the model when nothing has changed (monitor mode, condition triggers).
2. Don't carry the whole main conversation; use an isolated job.
3. Limit the hours so it doesn't run at night.
4. Use a cheaper model for routine checks.
5. Lower the frequency last, because frequency directly affects whether you'll miss something urgent; that's exactly the trade-off Duet's help page describes.

Subscription products mostly don't let you adjust these. What you can do is tell it what you want to hear about and what you don't, so it does less useless work, and turn off extra purchases or set a monthly cap.

## Who each suits, and what to watch for

**A subscription pool suits:**
- People already paying for Claude, ChatGPT or an X subscription who can accept background work using part of that allowance.
- People who don't want to think about tokens and just want a fixed monthly fee.

**Credits or budgets suit:**
- People and teams who want to see clearly what each job costs.
- Teams that need to control spending per agent, such as setting a budget for each Devin bot.

**Self-hosting suits:**
- People willing to tune settings who want to run lots of routine work at the lowest cost.
- People who need to choose their own model, including local ones.

**Watch out for:**
- When the pool is shared with your main work, background tasks can push you into the limit at a critical moment.
- When self-hosting with default settings, carrying the main conversation and checking frequently, the bill can exceed a subscription.

In Taiwan, Grok Bot, Tasks in Gemini and Hark can be subscribed to directly, priced in US dollars; self-hosted OpenClaw and Hermes are billed at whatever rates your chosen model API charges.

The user pays, but where an always-on agent gets stuck is often not on your end. Next, the other end: how websites and businesses deal with agents, and why agents so often stall at the last step.

## References

- [Elon Musk throttles Grok Bot limits due to 'unsustainably high' costs](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/) (TechCrunch, 2026-11-02)
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) (Claude Help Center)
- [Grok Bot FAQ](https://docs.x.ai/grok-bot/faq) (xAI)
- [Always-On Agents: Claude Duet vs Dots vs Grok Bot](https://aimultiple.com/always-on-agents) (AIMultiple, 2026-11-16)
- [Muse can now place calls to US businesses, if you pay](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/) (TechCrunch, 2026-11-12)
- [Introducing Hark Pro](https://hark.com/articles/introducing-hark-pro) (Hark)
- [How credits work on Perplexity](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity) (Perplexity Help Center)
- [Bot usage limits](https://docs.devin.ai/work-with-devin/bots/usage-limits) (Devin Docs)
- [Membership Pricing and Plan Overview](https://www.kimi.com/en/help/membership/membership-pricing) (Kimi Help Center)
- [Automation payloads](https://docs.openclaw.ai/automation/cron-jobs/payloads/) (OpenClaw docs)
- [Proactive AI Agents Compared](https://pinggy.io/blog/proactive_ai_agents_compared/) (Pinggy, 2026-10-31)
- [腾讯QClaw宣布将关停](https://news.qq.com/rain/a/20260924A0DF5T00) (iHeima via Tencent News, 2026-09-24, in Chinese)
