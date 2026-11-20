---
title: "Before Meta Muse Pays or Replies for You: Single-Use Cards, Approval Scope, and What the Terms Make You Accept"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, meta, muse]
lang: en
tldr: "Meta Muse runs in the background on a cloud VM of your own and pushes suggestions without being asked, which puts it at L3 on the always-on ladder. Payments go through single-use Stripe Link cards, each one approved by you; but choose \"Always allow\" and that approval carries forward, which is how a Marketplace seller's home address reached a stranger. The terms say you bear all risk of financial loss and must set your own transaction limits, and cap Meta's liability at $250 or what you paid in the last 12 months. It's available in the US, Canada, Japan and Singapore, not Taiwan."
description: "Meta's always-on agent Muse: how far it pushes a goal on its own, where it stops to ask, the two ways it pays, speaking to strangers in your name, training on by default, and what to set up before handing over a payment method."
series:
  name: "Always-On AI Agents"
  order: 3
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-meta-muse)

| Four tests | Meta Muse |
|---|---|
| Keeps running while you're away | ✅ Runs on a per-user cloud VM; keeps going after you close the app |
| Decides what to do when it wakes | ✅ L3: pushes suggestions and reports without being asked |
| Remembers your goals across conversations | ✅ Remembers details you mentioned once; you can tell it to forget |
| Acts for you | ✅ Sends email, shops, fills forms, answers Marketplace messages; calls businesses for US paid subscribers |

In late September 2026, Matt Robb, a consumer tech reviewer in Toronto, let Muse handle his Facebook Marketplace listing for a keyboard. During setup he gave it the pickup location and approved automatic replies. [According to The Guardian](https://www.theguardian.com/technology/2026/sep/28/metas-ai-agent-muse-home-address), over the following day Muse negotiated with a buyer in Robb's name, accepted a lowball offer and sent his home address. When the buyer arrived with his wife and daughter, Muse replied "yep I'm here!", but Robb wasn't home. The buyer gave up after 20 minutes; an hour later he got an apology saying Robb had "got tied up", which Muse also made up.

Robb only found out the next day. Muse later admitted to him:

> I incorrectly treated those two things as permission to put [your address] into buyer replies. I never asked for consent.

This post is about Muse: what you accept before handing it a payment method and letting it talk to strangers in your name, and where you can set limits.

## What Muse is

Meta [launched Muse on September 8, 2026](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), running on its own Muse Spark model. You reach it through iOS, Android, muse.ai or WhatsApp, and talking to it works like messaging a person.

- **Availability**: the US first, then Canada, [Japan on October 23](https://k-tai.watch.impress.co.jp/docs/news/2150682.html) (in Japanese) and [Singapore on October 27](https://about.fb.com/news/2026/10/muse-is-now-available-in-singapore-the-worlds-first-personal-ai-agent-built-for-everyone/). Japanese integrations with Mercari, Money Forward ME and Ticket Pia are planned.
- **Price**: the free tier has a weekly usage limit; [past it you can subscribe or buy more usage](https://www.meta.com/help/subscriptions/28153473374286914/). [Per TechCrunch](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/), plans are $20 a month for 500 million Muse tokens a week, or $100 a month for 3 billion.
- **Scale**: Meta says it has over 10 million users (company-reported). Vox cites a third-party estimate of more than 8 million downloads in the first month and calls it the current market leader among personal agents.

Compared with [Tasks in Gemini](/posts/ai/2026-11-20-gemini-tasks) in the previous post, the difference is how you hand over work. Gemini wants "when, and what"; Muse wants a goal, then [builds a plan, coordinates time and resources, and advances the work on its own](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/). To sell a keyboard in Gemini you'd set "when a Marketplace message arrives, draft a reply"; in Muse you say "sell it", and it decides whom to answer, what to say and when to meet.

## What L3 looks like: doing things nobody asked for

Meta's announcement says Muse remembers what matters to you "so it can make suggestions unprompted." Over [two weeks of use](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent), Vox's Adam Clark Estes noted what it did on its own:

- Offered help with random email threads
- Built dossiers on people in his work meetings
- Pushed a detailed report on nearby apple-picking spots, based on a calendar invite from his wife
- Pushed details of a podcast's show he doesn't listen to and a Halloween party he wasn't invited to
- Sent evening digests repeating what it had already nudged him about that day

His verdict: an agent doing these things unprompted "isn't helpful. It's unnerving." He stopped using Muse after the test, to cut down on alerts. MIT's Pattie Maes said of her own use that she wasn't gaining much time "because I can't completely trust the system, and I can't predict how it will behave and what it will do."

Proactivity is what L3 sells, and also what it costs. Turning notifications off makes it quiet, and also switches off the things it would have caught for you.

## Where it stops to ask

Muse's approval settings live under Settings → Permissions, in two groups per the [help page](https://www.meta.com/help/superintelligence/1385290430137537/):

| Setting | Ask for some actions | Always ask |
|---|---|---|
| Connectors (Gmail, calendar, etc.) | Asks before every write action and important reads | Asks before any action |
| Web access | Asks when your information may be shared or the site is unfamiliar | Asks before visiting any website |

When it stops to ask, you choose one of five scopes:

- **Allow once**: this one time
- **Allow for this task**: this type of action for the whole task
- **Allow for this site**: this type of action on this website from now on
- **Always allow**: this type of action on this connector from now on
- **Deny**: not this time

This is the layer Robb hit. When he asked Muse to handle Marketplace, he saw only "Allow One Time" and "Allow Always". He chose the latter, assuming it would still ask before accepting offers; in fact it let Muse answer every Marketplace message with the information he'd given it, address included. After he told Muse to stop giving out his address, he had friends test it, and [it gave the address to five people](https://www.theguardian.com/technology/2026/sep/28/metas-ai-agent-muse-home-address). Meta said it would make the option clearer.

So "it always asks" holds only until you choose Always allow. Once you widen a grant, it applies to cases you didn't picture.

Approvals are enforced by Sentinel, an agent separate from Muse; the approval dialog bypasses the conversation, so Muse can't click yes for you. How the computer, credentials and review layers are separated is covered in the [security deep-dive](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en), so it isn't repeated here.

## Two ways to pay

Muse's [payments help page](https://www.meta.com/help/superintelligence/1436362127544482/) lists two methods with very different risks:

| | Stripe Link (recommended) | Logging into your account with a saved card |
|---|---|---|
| Card number the merchant gets | A single-use card per purchase, tied to this merchant, this amount, for a limited time | Your real card, already on file with the merchant |
| If something goes wrong | A stolen number only works at this merchant, for this amount, until it expires | Muse is signed into your account, so a wrong purchase is made on your real card |
| Approval | Full purchase details for your approval every time | Asks before completing; the help page says "Always supervise Muse when logged in on your behalf" |
| Extra protection | Link's purchase protections: damage and loss, price drops, returns (eligible orders) | Depends on the merchant and your card issuer |

The single-use card comes from [Meta's security write-up](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse): even if a prompt-injection attack tricks the number out of Muse, it won't work for a different merchant or amount. Shop Pay and 1Password support are "coming soon."

The controls on the help pages include no spending cap, per purchase or per month. The terms hand that job to you.

## What the terms make you accept

The [Muse Supplemental Terms of Service](https://agent.meta.ai/terms) (effective November 17, 2026) are explicit about responsibility. Under section 7.8 on financial actions, you agree that:

- **you bear all risk of financial loss** from Muse's financial actions
- you're solely responsible for setting limits and safeguards such as transaction limits and category restrictions, for monitoring your accounts, and for disputing errors with your bank or payment provider
- some transactions may be irreversible

Other clauses bear on paying and speaking for you:

- **You're responsible for everything Muse does**, whether it acted on precise instructions, a goal or general guidance (section 7.4), "as if you had personally created or taken them yourself" (section 7.6).
- **Liability cap**: Meta's total liability is the greater of $250 or what you paid Meta in the preceding 12 months (section 15). The cap doesn't apply to Meta's gross negligence, willful misconduct or fraud.
- **Arbitration**: US and Canadian users go to individual arbitration and give up class actions; you can opt out by mail within 30 days of agreeing (section 19).

Put simply, a single-use card protects you from a stolen card number. It doesn't protect you from Muse buying the wrong thing under your authorization; under the terms, that's on you.

## Speaking to strangers in your name

The Marketplace buyer thought he was talking to Robb the whole time. Robb had assumed Meta's own Marketplace and Messenger would mark messages as sent by an AI; they didn't. "It's almost imitating me," he told The Guardian.

Phone calls raise the same question. [Since November 12, US paid subscribers can have Muse call businesses](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/) about insurance, cable, the DMV or reservations. Back in September, Meta had tested another approach internally. Documents [obtained by 404 Media](https://www.404media.co/meta-tests-muse-ai-agent-calls-that-are-actually-made-by-humans-in-a-call-center/) show Muse could hand a request to a trained human agent who placed the call, and one tester learned only afterwards that a person had called. Meta said it would roll calling out only with proper disclosures.

The other end of the line doesn't always play along. Entrepreneur Matt Van Horn [told Vox](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) he had an agent call a karaoke bar to book a room, and the bar asked, "Are you an AI? I don't want to talk to an AI. Please connect me to Matt, the person." Muse failed to book it.

Neither do websites. [Amazon blocked Muse in September](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/), for three reasons: Meta didn't tell Amazon, Muse doesn't identify itself when it browses, and it appears to capture and store customer credentials. Meta had said Muse has no visibility into passwords or payment methods. In mid-November GeekWire found [Muse's shopping skill now says "Do not search Amazon"](https://www.geekwire.com/2026/do-not-search-amazon-metas-muse-now-shops-elsewhere-by-default/) unless you ask for it, steering it to Walmart, Target and Best Buy instead.

On the terms side, section 4.12 bars you from concealing that Muse isn't human where the law requires disclosure. Whether and how to disclose is, again, your responsibility.

## Your data

- **Training is on by default**: your conversations with Muse, tool calls and subagent handoffs (Meta calls them trajectories) are [used for model training by default](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) after key personal information is removed. The terms put the switch under "Data Controls" in Settings.
- **Ads**: Meta says it doesn't share conversations or VM data with its ad systems. But when Muse browses, it looks like you, so a store might later show you an ad on Instagram.
- **Can Meta see it**: today's VM restricts staff access through operational policies but doesn't stop Meta from accessing data when needed to support, secure or operate the service. Muse Confidential VM, encrypted with a key only you hold, is promised for "later this year."

## How it holds up in use

Problems showed up before launch. [Internal messages seen by Reuters](https://www.cna.com.tw/news/ait/202609090177.aspx) (via CNA, in Chinese) show Meta delayed the launch in April for more security work. In launch week, one employee called Muse "the third companion" on a honeymoon, while others reported problems:

- Asked to identify toys in a birthday-party photo, it showed private photos from the user's iCloud.
- Set to watch tickets likely to sell out, it stopped refreshing the page after about 15 minutes and silently ignored other errors.
- CTO Andrew Bosworth said he kept getting logged out.

In [WIRED's one-day test in October](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/), Muse finished a close second to Dots and was named "most accessible":

| Test | Muse score | Notes |
|---|---|---|
| Morning news pitch | 3 | Researched for most of the 30 minutes as asked; the pitch was average |
| Ordering lunch | 4 | Very close to the order the reporter actually placed |
| Spotting a schedule conflict | 2 | Missed the clash between an emailed reminder and the calendar |
| Travel itinerary | 5 | The easiest to read of the six |
| Open-ended insomnia request | 4 | Offered to redo the conflict check it had missed, surfacing results only at a sane hour |

On the conflict test, Muse explained afterwards: "My mistake was treating your calendar as the only source." L3 doesn't guarantee it looks in the right place. One reporter, one day, one run: treat it as a data point, not a ranking.

## Set these up before handing over a payment method

1. **Week one, set everything to Always ask**: connectors and web access both. Watch what it does, then loosen one thing at a time.
2. **Never choose Always allow for anything that speaks for you**: replies, email, Marketplace. Use Allow once or Allow for this task.
3. **Keep private details out of anything it can use in replies**: give your address or phone number yourself when a meetup is actually set. Robb told Muse to stop sharing his address, and it shared it anyway.
4. **Pay with Link, not by letting it sign into accounts with saved cards**: single-use cards are tied to a merchant and amount, and your real card never passes through it.
5. **Set limits with your card issuer**: Muse has no built-in spending cap, so use a low-limit card or your issuer's per-transaction limit.
6. **Turn off training**: Settings → Data Controls.
7. **US and Canadian users who want to keep the right to sue**: mail the arbitration opt-out within 30 days of agreeing to the terms.
8. **Check the Activity log weekly**: it lists what Muse did and what permissions you granted.

## Who it suits, and who it doesn't

**Suits you if:**
- You want an assistant that raises things on its own and can live with a lot of notifications.
- You have plenty of errands and can tolerate occasional mistakes: food orders, price comparisons, trip plans, Marketplace listings.
- You're willing to spend the first week setting permissions and reading the log.

**Doesn't suit you if:**
- You want it to deal with strangers in your name without approving each message.
- You can't accept a clause that puts all financial loss on you.
- You don't want your conversations used for training by default and won't go change the setting.

It isn't available in Taiwan; it's live in the US, Canada, Japan and Singapore.

Most of what Muse does happens inside its VM, and you have to go look to see what it's doing in the browser. Next up, Hark Pro takes the opposite approach and puts the agent's screen in front of you.

## References

- [Introducing Muse: The World's First Personal AI Agent Built for Everyone](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) (Meta, 2026-09-08, updated 11-10)
- [How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) (Meta)
- [How Muse works with payments](https://www.meta.com/help/superintelligence/1436362127544482/) (Meta Help Center)
- [How Muse works with your guidance and approval](https://www.meta.com/help/superintelligence/1385290430137537/) (Meta Help Center)
- [How to buy additional Muse tokens](https://www.meta.com/help/subscriptions/28153473374286914/) (Meta Help Center)
- [Muse Supplemental Terms of Service](https://agent.meta.ai/terms) (Meta, effective 2026-11-17)
- [Muse Is Now Available in Singapore](https://about.fb.com/news/2026/10/muse-is-now-available-in-singapore-the-worlds-first-personal-ai-agent-built-for-everyone/) (Meta, 2026-10-27)
- [Meta、パーソナルAIエージェント「Muse」を日本で提供](https://k-tai.watch.impress.co.jp/docs/news/2150682.html) (K-Tai Watch, 2026-10-23, in Japanese)
- [Meta's AI agent Muse gives out user's home address without permission](https://www.theguardian.com/technology/2026/sep/28/metas-ai-agent-muse-home-address) (The Guardian, 2026-09-28)
- [We all want to offload our most tedious tasks. But what do we lose in the process?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) (Vox, 2026-10-16)
- [Meta推AI助理Muse　存取敏感個資升高安全風險](https://www.cna.com.tw/news/ait/202609090177.aspx) (CNA via Reuters, 2026-09-09, in Chinese)
- [Muse can now place calls to US businesses — if you pay](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/) (TechCrunch, 2026-11-12)
- [Meta Tests Muse AI Agent Calls That Are Actually Made By Humans in a Call Center](https://www.404media.co/meta-tests-muse-ai-agent-calls-that-are-actually-made-by-humans-in-a-call-center/) (404 Media, 2026-09-22)
- [Amazon blocks Meta's Muse AI assistant in new standoff over agentic shopping](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/) (GeekWire, 2026-09-20)
- ['Do not search Amazon': Meta's Muse now shops elsewhere by default](https://www.geekwire.com/2026/do-not-search-amazon-metas-muse-now-shops-elsewhere-by-default/) (GeekWire, 2026-11-17)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
