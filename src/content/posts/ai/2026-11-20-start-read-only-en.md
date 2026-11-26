---
title: "Start Read-Only: Which Always-On Agents Readers in Taiwan Can Use Now, and How to Open Up Permissions Week by Week"
date: 2026-11-20
category: ai
type: guide
tags: [ai-agent, always-on-agent, gemini, openai, openclaw]
lang: en
tldr: "Always-on agents available in Taiwan now: Tasks in Gemini (requires Google AI Pro or Ultra), OpenAI Dots (Pro, or some Plus accounts as it rolls out), Grok Bot (X Subscription Premium and up), Hark Pro, and self-hosted OpenClaw and Hermes. Pick the one you already pay for, and turn on only one. In week one, let it only read and report; in week two, let it draft, but you press send and pay; from week three, open one category of write actions at a time, and approve every payment individually on a low-limit card. Each product has one setting to turn off first: Grok Bot's Vault card storage and \"always allow,\" Gemini's Always allow, Dots' local computer access, and OpenClaw's allow-all tools."
description: "The final post in the Always-On AI Agents series: choosing a product based on Taiwan availability and the subscriptions you already have, a read-only first week, drafts in week two and category-by-category write access from week three, which settings to turn off and on first in Tasks in Gemini, Dots, Grok Bot, Hark Pro, OpenClaw and Hermes, and when not to start yet."
series:
  name: "Always-On AI Agents"
  order: 24
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-start-read-only)

| Your situation | Try first | Conditions (checked November 24) |
|---|---|---|
| Already paying for Google AI Pro or Ultra | Tasks in Gemini | Taiwan requires a paid plan; the six free countries don't include Taiwan |
| Already paying for ChatGPT Pro | OpenAI Dots | Rolling out gradually to Plus; you may not have it yet |
| Already paying for X Premium or above | Grok Bot | The docs list no regional restrictions |
| Want to try on an iPhone without paying first | Hark Pro | Listed in Taiwan's App Store; demos are mostly US sites |
| Can run a server and want to pick your own model | OpenClaw or Hermes | You handle the machine, patches and model costs |
| None of the above | Wait | Muse and Claude Duet aren't available in Taiwan yet |

In [the same TechCrunch article](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/) about US banks changing their terms, there's a mention of the personal finance tool Anthropic launched this month. Its design is spelled out in its description: read-only, and it "can't move, manage, or invest your money."

A company that can build an agent capable of sending email and making payments chose, when it came to money, to let it only look. This post follows the same thinking: start read-only, and open up permissions week by week.

This is the final post in the series: which one readers in Taiwan can use now, and how to open up permissions step by step.

## Step zero: pick just one

The availability details for Taiwan are in [the overview](/posts/ai/2026-11-20-always-on-agents-overview-en); use the table above to choose. Two principles:

- **Pick the one you already pay for**: as [order 21](/posts/ai/2026-11-20-who-pays-for-always-on-en) covered, most products fold background work into your existing usage pool, so there's no extra charge, and it's easier to see how much it uses.
- **Turn on only one at a time**: with two running, you can't tell which did what, and two agents reading the same inbox can trigger each other.

I rechecked two vendors' help pages this week. [Tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) is free in Australia, Canada, India, Japan, South Korea and the US. Everywhere else Gemini is supported, it requires Google AI Pro or Ultra, excluding the EEA, Nigeria, Switzerland and the UK. [Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) is available to Pro users and is rolling out gradually to some Plus users, excluding the EEA, the UK and Switzerland. OpenAI says support can't enable it for you early, and switching from Pro to Plus means losing your dot.

## Week one: let it only read

The goal is to see what it notices, without letting it do anything.

**What to do:**

1. **Connect only one or two data sources**: for example, your work email and calendar. Don't connect your cloud drive, Slack and bank all on day one.
2. **Don't set up a payment method**: no saved card, no wallet.
3. **Give it a report-only job**: for example, "Every day at 8 am, tell me which emails need replies today and whether my schedule has conflicts. Only report; don't reply to emails or change my calendar."
4. **Spend five minutes a day checking**: was it right, what did it miss, what extra did it report. This is the one-week evaluation from [order 20](/posts/ai/2026-11-20-evaluating-always-on-agents-en): make your own answer key first.

**At the end of week one, ask yourself:**

- How much of what it noticed would you have noticed anyway? Did it catch anything you missed?
- How much extra did it report?
- How far did the usage bar move?

If it often misses what it should notice, don't go on to week two; this product isn't useful for this task.

## Week two: let it draft

The goal is to see whether it does the work right, while you press the button on every outgoing action.

**What to do:**

1. **Let it draft replies and schedule changes, but not send or modify anything**: it hands you the drafts, and you send them yourself.
2. **Put rules in settings, not just in conversation**: as [order 17](/posts/ai/2026-11-20-overreaching-agents-en) covered, an "ask me first" written in conversation can get lost in a long task. Whatever you can block with settings, block with settings.
3. **Note how much you change its drafts**: the kinds you barely need to edit are candidates for letting go in week three.

**At the end of week two, ask yourself:**

- Which kind of draft do you barely need to change?
- Which kind needs heavy rewriting every time? Keep that kind for yourself.

## From week three: open one category of writes at a time

The goal is to let go category by category, opening one more kind of action at a time and watching it for a week before opening the next.

**Suggested order**, starting with what's easiest to clean up if it goes wrong:

1. Things that only affect you and can be undone: adding events to your own calendar, organizing labels.
2. Outgoing actions that can be fixed: replying to routine emails. Set them to "ask first," so they're sent only when you press the button.
3. Anything involving money: open these last, always approve each transaction, and use a single-use or low-limit card. As [order 23](/posts/ai/2026-11-20-who-is-liable-en) covered, vendor terms and banks put the loss on you.

**Never open:**

- Giving your online banking credentials to an agent.
- Choosing "always allow" for anything involving money.
- Automatic execution of irreversible actions like deleting shared files or changing account passwords.

## What to turn off and on first in each product

| Product | Turn off on day one | Turn on on day one |
|---|---|---|
| Tasks in Gemini | Don't choose Always allow for any type | Keep the default: sending, buying, submitting forms and signing in to sites ask every time |
| OpenAI Dots | Local computer access (off by default; leave it off) | Custom rules: set messages to outside parties to "Ask before taking action" and deleting shared files to "Hand off to you" |
| Grok Bot | Don't save your card in Vault; turn off Auto Top-up | Keep Auto Review on; add an Ask first rule for sending external email |
| Hark Pro | Don't choose "no confirmation for this type of task" | Read the permission screen carefully before connecting Gmail |
| OpenClaw | Allow-all tools (change scheduled jobs' `toolsAllow` to an allow-list) | The sandbox (off by default; turn it on yourself); enable the Proactive check yourself if you want it |
| Hermes Agent | Don't turn on YOLO mode or `approvals.mode: off` | Keep the default `smart` approvals; scheduled jobs deny dangerous commands by default |

The details of these settings are in each product's post: [Gemini](/posts/ai/2026-11-20-gemini-tasks-en), [Dots](/posts/ai/2026-11-20-openai-dots-en), [Grok Bot](/posts/ai/2026-11-20-grok-bot-en), [Hark Pro](/posts/ai/2026-11-20-hark-pro-en), and [self-hosted OpenClaw and Hermes](/posts/ai/2026-11-20-self-hosted-always-on-agents-en).

One thing to watch with Grok Bot: as [order 8](/posts/ai/2026-11-20-grok-bot-en) covered, every bot on an account shares one computer and every login on it. Sign one bot in to a site and the others can use that session. In week one, run just one bot.

## Check back every two to four weeks

[Order 19](/posts/ai/2026-11-20-human-side-of-agents-en) covered matching your trust to the agent's track record. Once permissions are open, ask regularly:

1. When did you last catch it making a mistake? If you can't remember, you may not be looking.
2. Do you still read before pressing "approve"? If not, cut down what needs your confirmation.
3. Are usage and spending within what you expected?
4. Does its activity log match your card statement and sent mail?
5. Is any permission open but barely used? If so, turn it off.

## When not to start yet

- **You don't have five minutes a day to check it**: the week-one comparison is the foundation of the whole approach; skip it and nothing after it has a basis.
- **What you want it to handle is something you can't afford to get wrong and can't check**: for example, investments or legal documents you don't know well.
- **Your work data is restricted by company policy**: ask your company's IT team first. Taiwan's FSC consultation paper also notes that agents able to send things externally or write to systems need separate assessment.
- **You want a tool you can install and forget**: always-on agents can't do that yet.

## Series recap

This series started with [the overview](/posts/ai/2026-11-20-always-on-agents-overview-en) and [the three-level wake ladder](/posts/ai/2026-11-20-always-on-agent-anatomy-en), then went through four routes:

- **Route 1, the vendor's cloud computer**: Gemini, Muse, Hark, Instinct, Duet, Dots, Grok Bot.
- **Route 2, teams and enterprises**: Devin Bots, Perplexity teammates, Microsoft Autopilot, Salesforce, OpenClaw Enterprise.
- **Route 3, your own machine**: self-hosted OpenClaw and Hermes, and China's Claw family.
- **Route 4, inside super apps**: LINE, Kakao, Naver.

The posts after that dealt with questions that cut across every product: overreaching, the five security layers, the human side, evaluation, who pays, the other end, and who is liable.

These products are changing fast: limits change, regions open up, defaults shift. The settings table and availability here reflect what I found on November 24; before you start, check each vendor's help pages again.

## References

- [More banks say customers using AI agents are on their own — even if they get hacked](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/) (TechCrunch, 2026-11-18)
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) (Gemini Apps Help, checked 2026-11-24)
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) (OpenAI Help Center, checked 2026-11-24)
- [Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy) (xAI Grok Bot docs)
- [Hark Terms of Service](https://hark.com/terms) (Hark)
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) (OpenClaw docs)
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat) (OpenClaw docs)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) (Hermes Agent docs)
