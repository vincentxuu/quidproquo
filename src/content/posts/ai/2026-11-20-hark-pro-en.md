---
title: "Hark Pro Shows You the Screen: a Self-Trained Handoff Model, Approvals That Default to Consent, and the Free-Pizza Night"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, hark, computer-use]
lang: en
tldr: "Hark Pro uses Handoff, a computer-use model Hark trained itself, to run up to six browsers on a cloud computer and do errands for you, and it surfaces Action Buttons on its own, which puts it at L3 on the always-on ladder. It shows the agent's browser in a small window, but October's free-pizza promotion showed that seeing every step isn't seeing a payment go wrong: a few hundred people thought the pizza was free and were charged in full. The terms say Hark takes merchant referral fees, caps liability at $100, and doesn't train on your data. It's on the Taiwan App Store, though official demos are almost all US sites."
description: "Brett Adcock's Hark Pro: what a self-trained Handoff model buys and costs, whether showing the agent's screen actually builds trust, how approvals thin out with use, Secured by Hark and Hark Card, what went wrong on the free-pizza night, and how readers in Taiwan can try it."
series:
  name: "Always-On AI Agents"
  order: 4
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-hark-pro)

| Four tests | Hark Pro |
|---|---|
| Keeps running while you're away | ✅ Each task gets a cloud virtual computer with a browser, file system and terminal |
| Decides what to do when it wakes | ✅ L3: lays out Action Buttons from what it knows about you; scheduled tasks too |
| Remembers your goals across conversations | ✅ Persistent memory you can tell to forget; not offered in the EEA, UK or Switzerland |
| Acts for you | ✅ Logs into sites, orders, fills forms, sends email; asks before spending or messaging others unless you've told it not to |

On October 16, 2026, Hark announced it would give away $1 million worth of pizza. You downloaded Hark Pro and typed "order a free pizza" into the chat. It would claim a DoorDash gift card worth about $30, then log in, order and check out. The promotion ended in under nine hours, and [Hark says it delivered nearly 20,000 pizzas](https://foodondemand.com/11042026/harks-1m-agentic-pizza-promo-delivers-growing-pains/).

For a few hundred people, though, it went like this: the screen showed a $30 credit, they watched the agent place the order, the pizza arrived, and then they found the full price on their own card. A Hark spokesperson blamed a payment workflow built just for the promotion: the checkout button showed $0, but the gift cards didn't apply in time. Everyone charged got a $100 gift card.

The incident lands right on Hark Pro's most distinctive design choice: it shows the agent's web browsing in a small window so you can watch it work. This post is about what Hark gets from training its own model and putting the process in front of you, and which mistakes "being able to see it" actually helps you catch.

## What Hark Pro is

Hark is the company Figure AI founder Brett Adcock started in late 2025. [Hark Pro launched on October 6, 2026](https://hark.com/articles/introducing-hark-pro) on web, iOS and Android; since November you can also message it over iMessage and RCS. Hark calls it "the operating system for your life," and [plans its own hardware for 2027](https://www.bloomberg.com/news/articles/2026-10-06/ai-startup-hark-debuts-proactive-hark-pro-app-ahead-of-2027-hardware-launch).

It has three parts:

- **Handoff**: Hark's own computer-use model, which outputs cursor coordinates and keystrokes and [can run up to six browsers at once](https://hark.com/articles/introducing-hark-pro). Outside the browser it connects to Google and Outlook via APIs and reads external data over MCP.
- **Memory**: it remembers that you don't like mayo and always pick the window seat, and forgets on request.
- **Proactivity**: Action Buttons on the Home screen list to-dos based on what it knows; tap one and it does the job end to end. Hark's own example: it noticed a student's lunch card running low and flagged it for a top-up before the week was out.

On price, every feature is free and [paying only raises usage](https://hark.com/articles/introducing-hark-pro): $20 a month for 2x, $100 for 10x, and the App Store also lists a $200 Pro⁴. Hark doesn't publish concrete limits for the free tier.

Compared with [Meta Muse](/posts/ai/2026-11-20-meta-muse-en) in the previous post, both give each user a cloud computer, raise things on their own and ask before paying. Two things differ: Hark runs a model it trained specifically to operate websites, and it puts the agent's screen right in front of you.

## What a self-trained model buys

Hark's premise is that to run errands for people, an agent has to use a browser. Its [research preview](https://hark.com/articles/introducing-hark-handoff) says users spend about 75% of screen time in a browser, while fewer than one in a thousand websites offer a public API. DoorDash, Target, OpenTable and LinkedIn have no consumer API at all. So Hark started with post-training, using reinforcement learning to let the model try, fail and improve on real websites.

Hark's own numbers (all company-reported, mostly run in Hark's own harness):

| Item | What Hark says |
|---|---|
| First version, August | Top of the Online-Mind2Web human-evaluation leaderboard; across three benchmarks, 8 points above GPT 5.4 and 2 above Opus 4.8 on average |
| Cost | An order of magnitude cheaper per token than frontier models |
| [Handoff²](https://hark.com/articles/introducing-hark-handoff-now-2x-faster), November | On an internal set of 478 tasks across 238 sites, completion rose from 73% to 82%; twice as fast on average, within 5 points of Opus 5.5 max |
| Asking at the right time | Internal alignment benchmark (e.g. never checking out without approval, asking only when truly ambiguous) up from 90.3% to 93.8% |
| Usage | Over 5.6 million browsing sessions and more than $20 million in purchases since the October launch |

[TechCrunch points out](https://techcrunch.com/2026/10/06/hark-releases-an-ai-personal-assistant-with-a-focus-on-privacy/) that the trade-off is still open: a model trained specifically for computer use is faster and cheaper at those tasks. How much of a frontier LLM's broader knowledge it gives up isn't yet clear. [Incrypted's review](https://incrypted.com/en/hark-pro-review-private-ai-assistant/) adds that Hark doesn't say which base model Handoff was trained from, and that most benchmark results lack independent verification.

## Putting the screen in front of you

TechCrunch's reporter watched a demo by Abidur Chowdhury, Hark's head of design and a former Apple designer. The reporter noted that Hark Pro shows how the agent navigates the web in a small window. Chowdhury said the point is to build trust that the agent is doing the right thing. Hark's [security page](https://hark.com/security) calls this an "open kitchen": you can watch the agent work, and there's always a button to cancel. In iMessage, it uses "Using Computer", "Cancelled" and "Completed" stickers to tell you when it's operating its computer.

Meta's security write-up says Muse users can also watch its browser and take over at any time; TechCrunch's observation is that most assistants don't surface this in the app, while Hark shows it by default.

What watching helps you catch are mistakes you can see: the wrong site, the wrong item, the wrong date. The pizza-night mistake wasn't on screen. Every step was right and the checkout button said $0; what broke was who actually paid. [Axios's reporter](https://www.axios.com/2026/10/20/hark-ai-agent-startup-free-pizza-doordash) tried several times without getting an order through; one user's brother was charged $27.70; investor Sheel Mohnot said the order took him 20 minutes.

So seeing the screen helps trust only up to a point. It lets you supervise the actions, but whether a payment applied, or how much of your inbox it read, never appears in that window. For those you need your card statement and its data export.

## Approvals thin out with use

Hark's approval rule is in section 4.j of its [terms](https://hark.com/terms). It asks before spending your money, sending communications to others, or sharing your personal information with a third party, "unless you have chosen to let Hark act without confirmation for that type of task." The security page describes this as "A doorman who knows your name":

- Tasks start by defaulting to consent
- Over time, Hark remembers the actions you want it to take
- Convenience never compromises safety

That's the same direction as [Muse's Always allow](/posts/ai/2026-11-20-meta-muse-en): approvals widen as you go. The terms spell out the consequence: once you grant standing permission for a category of transactions, every transaction in that category counts as authorized by you (section 4.h). Messages and email Hark sends on your instructions go out in your name, and you're responsible for them as if you'd sent them yourself (section 4.j).

Two more clauses matter before you shop:

- **It earns referral fees**: some merchants pay Hark a referral fee, and Hark uses a referral link or code so the merchant knows the purchase came through Hark. Hark picks the merchant by default; you can ask for a different one (section 4.h).
- **Liability cap**: the total liability of Hark and its providers is the greater of what you paid Hark in the preceding 12 months or $100 (section 12). US disputes go to arbitration, with an opt-out within 30 days of creating your account.

## Where the money and passwords live

**Secured by Hark** is an encrypted vault for passwords and card numbers. [Hark says](https://hark.com/articles/introducing-hark-pro) even it can't see inside, and passwords stay encrypted all the way to the site; the terms add that passwords never appear in logs or memory and are never shown to the AI models. Over iMessage, when you need to sign in or save a card, it texts you a Secured by Hark link to enter it there. Incrypted's review notes the vault hasn't been independently audited.

**Hark Card**, [launched November 16](https://hark.com/articles/hark-card), is a digital prepaid card, US-only and invite-only for the first 10,000 people:

- Each transaction pulls the exact amount from your linked debit card or bank account
- Each merchant gets a different card number, so a breached retailer never sees your real card
- You can't overspend and there's no APR
- Subscribers get 5% back on most purchases, with a monthly cap ($1,000 on Pro², $5,000 on Pro³)

It serves the same purpose as the single-use Stripe Link cards Muse uses: the card number the agent handles isn't your real one.

**Data**: the terms say Hark doesn't train models on your content, memory, connected-account data or actions, except feedback you choose to send. Third-party model providers it uses are contractually barred from training on your content too. That differs from Muse, where training is on by default. But for proactive suggestions you still have to connect your inbox and calendar. When the Axios reporter connected Gmail, Google raised a critical security alert about a sign-in attempt, and the Google permissions Hark requests include reading, composing and sending email.

## Who it suits, and who it doesn't

**Suits you if:**
- You want to watch the agent work and be able to hit cancel.
- Your errands are mostly on the web: food, reservations, price comparisons, returns, forms.
- You don't want your conversations used for training.

**Doesn't suit you if:**
- Your life runs on phone calls: at launch it couldn't call or text ([Incrypted](https://incrypted.com/en/hark-pro-review-private-ai-assistant/), October 19).
- You rely heavily on Taiwanese websites: official demos are almost all US services.
- You don't want it earning referral fees and choosing merchants for you.

## Trying it in Taiwan

Hark Pro is [listed on the Taiwan App Store](https://apps.apple.com/tw/app/hark-pro/id6772362941), with Traditional Chinese among its languages and subscriptions at NT$690 (Pro²), NT$2,990 (Pro³) and NT$6,990 (Pro⁴) a month. Hark hasn't published which countries' sites it supports, and its Hark Card and iMessage announcements mention only the US.

A first week might look like this:

1. **Don't connect your inbox or cards yet**: Incrypted's review notes that memory, Projects, Panels built from public data and Handoff search all work without linked accounts. Start there.
2. **Try Handoff on a Taiwanese site**: ask it to compare prices on something, open the small window and watch how it handles a Chinese-language site.
3. **Read the permission screen when connecting Gmail**: it asks to read, compose and send email. Only accept if you're comfortable with that.
4. **Don't grant standing "no confirmation" permission for paying or messaging others.**
5. **Export your data after a while**: see what it remembers about you, and tell it to forget what you don't want kept.

Muse and Hark both have their own apps. Next up, [Instinct](/posts/ai/2026-11-20-instinct-en) has none: it works only through texts and phone calls. The more an interface feels like messaging a person, the easier it is for a casual grant of permission to be read too broadly.

## References

- [Introducing Hark Pro](https://hark.com/articles/introducing-hark-pro) (Hark, 2026-10-06)
- [Introducing Hark Handoff](https://hark.com/articles/introducing-hark-handoff) (Hark, 2026-08-05)
- [Introducing Hark Handoff², now 2x faster](https://hark.com/articles/introducing-hark-handoff-now-2x-faster) (Hark, 2026-11)
- [Hark arrives on iMessage and RCS](https://hark.com/articles/hark-arrives-on-imessage-and-rcs) (Hark, 2026-11-09)
- [Meet Hark Card, the world's first intelligent card](https://hark.com/articles/hark-card) (Hark, 2026-11-16)
- [Security at Hark](https://hark.com/security) (Hark)
- [Terms of Service](https://hark.com/terms) (Hark, updated 2026-10-27)
- [Hark Pro](https://apps.apple.com/tw/app/hark-pro/id6772362941) (App Store Taiwan)
- [Hark releases an AI personal assistant with a focus on privacy](https://techcrunch.com/2026/10/06/hark-releases-an-ai-personal-assistant-with-a-focus-on-privacy/) (TechCrunch, 2026-10-06)
- [Startup Hark Debuts AI Agent Ahead of 2027 Hardware Launch](https://www.bloomberg.com/news/articles/2026-10-06/ai-startup-hark-debuts-proactive-hark-pro-app-ahead-of-2027-hardware-launch) (Bloomberg, 2026-10-06)
- [Hark Pro Review: a Private AI Assistant From the Founder of Figure AI](https://incrypted.com/en/hark-pro-review-private-ai-assistant/) (Incrypted, 2026-10-19)
- [Pizza giveaway exposes AI agent growing pains](https://www.axios.com/2026/10/20/hark-ai-agent-startup-free-pizza-doordash) (Axios, 2026-10-20)
- [Hark's $1M Agentic Pizza Promo Delivers Growing Pains](https://foodondemand.com/11042026/harks-1m-agentic-pizza-promo-delivers-growing-pains/) (Food On Demand, 2026-11-04)
