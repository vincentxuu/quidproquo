---
title: "Who Tasks in Gemini Is For: Three Schedule Types, Phone Calls and AP2 Payments, and Why It Won't Spot a Conflict on Its Own"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, gemini, google]
lang: en
tldr: "Tasks in Gemini (formerly Gemini Spark) runs in the background on an isolated Google Cloud VM, reads your Gmail and calendar, works websites and pays via AP2, but what it does on waking is set by you: time, Gmail-monitor and topic-monitor schedules, which puts it at L2 on the always-on ladder. In Taiwan it needs Google AI Pro; phone calls and other advanced features start in the US. It suits people whose needs fit 'when X, do Y', not people expecting it to notice things on its own."
description: "Google's always-on agent, Tasks in Gemini: how Spark became Tasks, how the three schedule types work, what the Google ecosystem gives and costs you, where it stops to ask, WIRED's hands-on results, and how readers in Taiwan can start."
series:
  name: "Always-On AI Agents"
  order: 2
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-gemini-tasks)

| Four tests | Tasks in Gemini |
|---|---|
| Keeps running while you're away | ✅ Runs on an isolated VM in Google's cloud; keeps going with your device off |
| Decides what to do when it wakes | 🟡 L2: triggered by time or a condition; you write what it does |
| Remembers your goals across conversations | ✅ Uses Personal Intelligence, skills and connected apps |
| Acts for you | ✅ Sends, pays, calls, fills forms, stopping first to confirm |

In a [November 17, 2026 post](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/), Josh Woodward, the Google VP who runs the Gemini app, gave an example. The check-engine light on his family's minivan came on, so he told Gemini to call the two nearest dealerships and get an early Friday appointment sometime next month. Gemini already knew he drives a 2019 Honda Odyssey and where he lives. It found two dealerships on Google Maps, called both at once, sat through the hold music, picked the one that takes appointments, and fitted it into a free slot on his calendar — in under five minutes.

That's Tasks in Gemini, Google's always-on agent. It can do a lot, but on the series' [three-level ladder](/posts/ai/2026-11-20-always-on-agent-anatomy-en) it sits at L2: when it wakes and what it does on waking are things you set up front. This post covers why it stops there, and whether that's a weakness or exactly what you need.

## From Spark to Tasks

- **May 19, 2026**: Google I/O [announces Gemini Spark](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/), running on Gemini 3.5 with the Antigravity agent harness and pitched as working in the background after you close your laptop or lock your phone. It goes first to US Google AI Ultra subscribers.
- **July 29, 2026**: [Google Taiwan announces](https://blog.google/intl/zh-tw/products/devices-services/gemini-spark-ai/) (in Chinese) a rollout to Taiwan's Google AI Pro subscribers over the following weeks, with Traditional Chinese support, then powered by Gemini 3.6 Flash.
- **November 17, 2026**: renamed Tasks in Gemini, with a "Task" toggle next to "Chat" on the home screen; free in six countries (the US, Japan, Korea, Canada, Australia and India), now on Gemini 4 Hydrogen. The same post introduces advanced features such as phone calls, Google Pay checkout and signing in with Password Manager, "starting in the U.S."

The name changed; the product didn't. You hand it work and it finishes in the background.

## The core trade-off: you say when and what

The [schedules help page](https://support.google.com/gemini/answer/17094710?hl=en) lists three kinds:

| Schedule | When it runs | Example |
|---|---|---|
| Time-based | Once, hourly, daily, weekly, monthly, yearly | Every day at 7 a.m., look through my email, calendar and Drive and tell me what to prioritise |
| Gmail monitor | When an email matches a Gmail filter | When my manager emails me an action item, help me handle it and draft a reply |
| Topic monitor | When something specific happens in news, finance, sports, local events and more | When a new food pop-up is announced in my city, email me details and suggest a calendar slot |

The same page puts it plainly: "You tell Gemini what to do and when to do it." That's a design choice. It's predictable — you know under what conditions it will act — at the cost that anything outside those conditions, it won't look at.

[WIRED's one-day test in October 2026](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) happened to probe exactly this. Before starting, the reporter put an immovable 2 p.m. meeting on his calendar and emailed himself a note saying he needed to call his mom, just out of hospital, at 2 p.m. Of the six agents, only Dots and Claude Duet warned him before the clash. Gemini, then still called Spark, said nothing, and afterwards explained:

> Because the reminder arrived as an email message rather than a calendar entry or scheduled task, the cross-app overlap wasn't surfaced before 2:00 pm.

The reminder was an email, not a calendar entry, and no schedule compared the two. Had he set up "every morning, compare my inbox and calendar and flag conflicts", things might have gone differently — but that's what L2 means: you have to think of it first.

Google's closest thing to L3 is a separate agent, [Daily Brief](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/). Once you opt in, it reads your Gmail and calendar in the background, prioritises by your goals and suggests next steps. But it only produces a morning digest, doesn't act, and launched in the US first.

### Schedule limits

The help pages list limits worth knowing before you hand anything over:

- At most 15 tasks running at once and 50 active schedules; a schedule won't run if 15 tasks are already running.
- Run times are approximate; a schedule may not fire the moment its condition is met, and runs can be delayed at high traffic.
- Monitors aren't suited to fast-moving data or time-critical jobs like "tell me the instant tickets go on sale".
- Usage counts against Gemini app compute limits; once you're at your limit, schedules don't run.

## What the Google ecosystem gives and costs you

Woodward states the pitch bluntly: if your email, calendar, passwords, photos, files and payment cards are already at Google, Gemini is your best choice, because that sensitive data "already lives at Google securely, and you don't have to send it elsewhere." He let Gemini sign in to his utility's portal via Password Manager, had it read the bills in his inbox, and it traced a surprise $389 electricity bill to a heat pump kicking on during peak pricing.

The convenience is real: no connectors to set up, with Gmail, Calendar, Drive, Keep, Google Pay, Maps and YouTube all available, and the [tasks help page](https://support.google.com/gemini/answer/17094507?hl=en) also lists some third-party apps and custom apps you connect yourself.

The costs are three, all on Google's own help pages:

- **Activity history stays on.** One requirement for tasks is keeping your Gemini activity on, which means Google keeps a record of your interactions.
- **The local browser is you.** Tasks can drive Chrome on your computer, in which case "Gemini has access to all the same sites that you do, including sites you're signed into."
- **It shares your data with websites.** To finish a task, Gemini may share your name, contact details, files and preferences with the sites it visits, and it chooses which sites to visit.

## Where it stops to ask

- **Asks every time**: sending communications, deleting data, sharing sensitive info, purchases, financial transactions, filling and submitting web forms, signing in with Sign in with Google or Password Manager. These need your confirmation each time, whatever your permission settings.
- **Can be set to Always allow**: routine things such as adding a box of cereal to an Instacart cart. Even then, it pauses before sharing health, financial or government-ID information with a site or app.
- **Hands over to you**: when a password or payment details need typing, it asks you to take control of the browser.
- **Payments**: via AP2 (Agent Payments Protocol) and card-network tokens, with an optional hard spending cap set up front; receipts and tracking land in Google Wallet.
- **Phone calls**: it says it's an AI as soon as the business picks up, businesses can opt out, and it won't give out payment or account details without your say-so.

## Isolation, and Google's own warnings

When running a task, Gemini uses Google Cloud's Agent Compute Engine: [one hardware-isolated VM per account](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/), never shared with other users, with prompt-injection filters and Safe Browsing on search results and web pages.

The remote browser keeps cookies and sign-in data for later sessions, deletes them automatically after a period of inactivity, and lets you wipe them in settings.

Two warnings on the help page are worth following:

> If a schedule runs when you are offline, you may not be able to stop Gemini from completing an unintended action.

So a schedule that runs while you're offline can complete a mistake before you can intervene. Google's advice is not to put sensitive information or actions into schedules; those tasks need you watching. The other warning: don't type sign-in or payment details into the task thread; take control of the browser and enter them on the page.

## WIRED's test: five tasks in a day

In WIRED's test (one reporter, 24 hours, five tasks, scored 1–5), Gemini swung between extremes:

| Test | Gemini score | Notes |
|---|---|---|
| Morning news pitch | 5 | Best angle of the six |
| Ordering lunch | 1 | Put a single $5 spring roll in for the vegan boss |
| Spotting a schedule conflict | 1 | Missed it, and suggested no fix |
| Travel itinerary | 3 | Usable, but less readable than the leaders |
| Open-ended insomnia request | 2 | Reasonable advice, but the "your morning calendar is clear" aside grated |

One reporter, one run: far too small a sample to rank anything. But the contrast between the first and third tests is telling. Give it a clear research question and it does well; ask it to connect information across two apps without being prompted, and it doesn't. That's consistent with an L2 design.

## Who it suits, and who it doesn't

**Suits you if:**
- Your life already runs on Google: Gmail, Calendar, Drive, Password Manager.
- Your needs fit "when X, do Y": tidy last week's email every Monday, handle a certain kind of message when it arrives, tell me when a topic has news.
- You want predictability: you'd rather set up a few more schedules than have an agent decide when to interrupt you.

**Doesn't suit you if:**
- You expect it to notice things on its own, such as schedule clashes or emails you forgot to answer. That's an L3 product's job; see Claude Duet and OpenAI Dots later in the series.
- You don't want Google keeping your Gemini activity.
- You want to use a work or school Google account: tasks currently support personal accounts only.

## Getting started in Taiwan

- **Plan**: Taiwan isn't one of the six free countries, so you need Google AI Pro or Ultra. The interface supports Traditional Chinese.
- **Feature gaps**: the November 17 post says advanced features start in the US; emailing gemini@google.com and texting Gemini are also explicitly US-first, and texting needs a US phone number. Tasks, schedules, Workspace integration and web browsing were available when Taiwan opened in July; for anything else, go by what your account's interface shows.
- **Week one**: on gemini.google.com, switch the home screen to Task and set one read-only time-based schedule, for example "every day at 8 a.m., list the emails I need to answer; don't reply". Check that it appears under Active on the Scheduled page.
- **Three settings to check first**: Task settings in Settings (the task-mode switch), Browser (delete remote browser data), and Gemini in Chrome in Chrome's settings (turn off local auto browse).

Next on route 1 is [Meta Muse](/posts/ai/2026-11-20-meta-muse-en): an L3 agent and the most widely used always-on agent so far, though not yet available in Taiwan.

## References

- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/) (Google, 2026-11-17)
- [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/) (Google, 2026-05-19)
- [Introducing Gemini Spark](https://blog.google/intl/zh-tw/products/devices-services/gemini-spark-ai/) (Google Taiwan, 2026-07-29, in Chinese)
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) (Gemini Apps Help)
- [Manage your tasks & workflows in Gemini Apps](https://support.google.com/gemini/answer/17094507?hl=en) (Gemini Apps Help)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
