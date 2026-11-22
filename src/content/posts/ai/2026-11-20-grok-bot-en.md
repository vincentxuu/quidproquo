---
title: "Grok Bot Gives You a Roster of Bots: What the Division of Labor Buys, and What They Still Share"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, grok, xai]
lang: en
tldr: "Grok Bot lets one person run several named bots, each with its own conversation, memory and routines, while a primary bot checks in on its own and coordinates the rest, which puts it at L3 on the always-on ladder. But every bot on an account shares one cloud computer: files, browser sign-ins, command-line credentials and connected apps are all shared, and the docs say 'Do not use separate Bots as a security boundary.' A card saved in Vault fills in at checkout without approval each time; in November the usage pool was cut, with Musk saying serving costs were unsustainably high relative to revenue. Available in Taiwan on Premium or higher of The X Subscription."
description: "SpaceXSI and Cursor's always-on agent Grok Bot: how named bots, the primary bot, routines and teaching by recording divide the work; what each bot keeps to itself and what the whole account shares; Auto Review and Ask first rules; November's usage cut; and how to decide whether a job gets a new bot or goes to an existing one."
series:
  name: "Always-On AI Agents"
  order: 8
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-grok-bot)

| Four tests | Grok Bot |
|---|---|
| Keeps running while you're away | ✓ Runs on a cloud computer; closing the app, laptop or phone doesn't stop it |
| Decides what to do when it wakes | ✓ L3: the primary bot checks in on its own; since 1.0, bots spot work that needs doing and offer to take it |
| Remembers your goals across conversations | ✓ Each bot has its own memory; a few facts like your name and time zone are shared by all |
| Acts for you | ✓ Sends email, pays, messages, works on websites; Auto Review decides what needs your OK |

In SpaceXSI's [design write-up](https://x.ai/news/designing-grok-bot), the sidebar in the demo isn't a list of chats. It's a roster of named bots with avatars, each reporting on its own work:

- Kenny: "Need your yes on the Friday all-hands deck."
- Justin: "8 intros drafted — sitting in the CRM till you send."
- Tyler: "14 receipts in. Still missing your Uber from Tuesday."
- Keith: "Acme's wobbling. Drafted a Thursday check-in."

It looks like a small team, each member minding its own job. But the [docs](https://docs.x.ai/grok-bot/computer-and-apps) are explicit: these bots use the same computer, sharing files, browser sign-ins and command-line credentials. "Do not use separate Bots as a security boundary."

This post is about Grok Bot's roster model: what the division of labor buys, what the bots still share, and when a job deserves its own bot.

## What Grok Bot is

Grok Bot comes from SpaceXSI (formerly xAI). It went into beta in August 2026, and [version 1.0 launched on November 11](https://x.ai/news/grok-bot-1-0). It's a different product from the Grok chat app: [you sign in with a Cursor account](https://docs.x.ai/grok-bot/faq), and Cursor runs the computers and backend (SpaceX has acquired Cursor).

- **Where you use it**: desktop apps for macOS, Windows and Linux, plus iOS and Android apps. You can also chat with bots in X Chat, tag @bot on X to hand a post to your bot, and talk to a Team Bot in Slack.
- **Plans**: included with Premium, Super and Ultra on The X Subscription, and with legacy paid Cursor plans; Free and Plus don't include it.
- **Model**: there's no model picker. Grok Bot chooses a model per task, which may be first-party SpaceXSI or third-party, and doesn't show which.

The design write-up says they reduced the sprawl of agent-product vocabulary to five things you need to know:

| Object | What it is |
|---|---|
| Bots | Persistent agents with their own identity, memory, runtime and tools |
| Chats | The conversational interface to a bot |
| Prompts | Instructions; used once, saved as Skills, or triggered automatically as Routines |
| Tools | Software, APIs, connectors, the shell and computer use, for getting information and taking action |
| Artifacts | The documents, designs, code and data bots create or modify |

[OpenAI Dots](/posts/ai/2026-11-20-openai-dots-en) in the previous post is one dot per person for now, with teams of dots promised later. Grok Bot lets you run a whole roster from day one.

## What the division of labor buys

### Each bot has its own role

[A bot](https://docs.x.ai/grok-bot/bots) is "a durable AI teammate with a name, a job, its own conversation, and working context." Once you create one, your first message should give it its job, sources and approval boundaries, and ask it to remember them. To change what it does later, just tell it in chat.

The design write-up explains why roles stay separate: a legal bot may need the full history of a dispute, a finance bot years of financial records. Merging those into one large memory would make it harder to give each role what it needs. So Grok Bot puts two kinds of things at different levels:

- **Tools and skills live at the account level**: many bots need to browse, work with documents or send email.
- **Memory and Routines live at the bot level**: they reflect what that role knows and does over time.

### The primary bot coordinates

Your [primary bot](https://docs.x.ai/grok-bot/bots) is your main point of contact: it checks in with you on its own and coordinates with your other bots. The design write-up notes that once people had several bots, some created a "Chief of Staff" bot to coordinate specialists, giving direction to one bot instead of checking and routing each task themselves.

Work that crosses roles happens in group chats: designer, engineer, PM and data-scientist bots hand off to each other in one thread while keeping their own memories. The practical limits are roughly 50 bots per account and six per group chat.

### Routines and teaching it a task

- **Routines**: on a schedule (every day at 8 a.m., every 30 minutes) or triggered by an event (a PR opened, new messages in a Slack channel, a webhook POST).
- **Teach a task**: record up to ten minutes of a browser workflow from the computer view, and the bot turns it into a draft skill for you to review and test. The docs advise testing a skill on a real one-time task before turning it into a routine.

Version 1.0 adds initiative: bots monitor ongoing projects, offer to take on work they notice, follow up on unfinished tasks and bring people in when a decision needs judgment.

## What they still share

This is the part of Grok Bot most worth getting straight. From the docs:

| Each bot keeps its own | Every bot on the account shares |
|---|---|
| Name, avatar, role | One cloud computer |
| Conversation history | Files on that computer |
| Its own memory (mostly) | Browser cookies and signed-in sessions |
| Its own routines | Command-line credentials |
| Its own screen on the computer | Connected apps (account-wide) |
| | Tools and skills |
| | A few facts about you, like name and time zone |
| | The weekly usage pool |

A few places people trip:

- **Sign in once and every bot is signed in**: the browser is shared, so a session you open for one bot is available to the others.
- **Screens aren't boundaries**: the docs say "The screens are separate work surfaces, not separate security boundaries."
- **Connected apps are account-wide**: connect Gmail and every bot can use it. Gmail connects one mailbox at a time; if a bot shouldn't use it, disconnect it entirely.
- **Deleting a bot doesn't clean the computer**: it erases the bot's conversations, memory and routines, but files and sign-ins it left on the shared computer can remain and need separate cleanup.
- **Team Bots share the owner's things**: apps, secrets, skills and files the owner adds to a Team Bot work in every teammate's chat.

Isolation between users is strict: each person's computer is dedicated and hardware-isolated. The issue is only within one account.

## Approvals: Auto Review and your rules

[Auto Review is on by default](https://docs.x.ai/grok-bot/approvals-security-and-privacy) and checks every action before it runs. Most go ahead on their own; when one needs your OK, an approval card appears in the chat.

- **Three buttons**: Allow once does it this time; Always allow does it and saves an "allow automatically" rule so similar actions run without asking; Deny skips it.
- **Two kinds of custom rule**: Allow automatically and Ask first, up to 20 of each, up to 1,000 characters each. If both match, Ask first wins. The docs' example: "Ask first before sending any external email."
- **Only your words count**: Auto Review considers what you asked in your own messages; text in an email or web page doesn't count as your request.
- **Background approvals expire**: cards from work you started in chat wait for you. Cards raised by a routine, an incoming message or other background work expire after 30 minutes, and the action doesn't run.
- **Routine email waits as a draft**: when a bot sends from its own address, email from a routine or other background work waits as a draft until you press Send.

One payment detail matters: **a card saved in Vault fills in at checkout without a separate approval each time.** If you want to approve every payment, don't save the card; leave "Securely save to Bot's vault" unchecked when you enter it.

Turn Auto Review off and bots run actions without checking, and your custom rules are hidden and unused.

## The usage pool and November's cut

Grok Bot draws from the same weekly usage pool as Cursor and the Grok apps, [metered](https://docs.x.ai/grok-bot/faq) by agent steps and tokens, not by how many messages you send. One big task can use a lot.

[TechCrunch reported](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/) that over Halloween weekend some users woke to find their weekly usage had jumped from 50% to 100%, even though they hadn't been using it. Musk replied on X that it wasn't a glitch:

> The cost of serving Grok Bot was unsustainably high relative to revenue

When the story ran, Musk hadn't said how limits would change going forward.

For an always-on agent that's a real risk: everything it does for you in the background draws from the same pool, and when the vendor changes pricing, your routines can suddenly stall. To control extra charges, turn Auto Top-up off or set a monthly additional-usage limit at grok.com/dashboard. The cap doesn't stop a task mid-run, so it can go slightly over.

## How it holds up in use

[WIRED's one-day test in October](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/):

| Test | Grok Bot score | Notes |
|---|---|---|
| Morning news pitch | 1 | Old news |
| Ordering lunch | 4 | A sensible cart |
| Spotting a schedule conflict | 2 | Missed it; afterwards said it would check self-sent reminder emails too |
| Travel itinerary | 4 | Easy to read, practical tips |
| Open-ended insomnia request | 5 | Offered to remind him later in the morning to check on his mom, so he could let it go |

One reporter on one day, testing a single bot rather than a multi-bot setup.

## New bot, or an existing one?

The rule of thumb that falls out of all this: **create a new bot to separate roles and context, not to separate permissions.**

**A new bot makes sense when:**
- It's a standing responsibility, not a one-off task: monthly reconciliation, tracking one client.
- It needs its own history, and mixing it with other work would get in the way: don't put a legal dispute and a marketing campaign in one bot.
- It has its own cadence: every morning, every Friday, whenever some event fires.
- You want to manage it with different boundaries: this one may tidy data on its own, but always asks before anything outward.

**An existing bot is fine when:**
- It's a one-time task that ends when it's done.
- It overlaps an existing bot's context: the same client, the same project.
- You're just trying something. Existing bots may also suggest creating new ones; if you want a small roster, ask them to check with you first.

**What a new bot won't separate** (and what to do instead):

| What you want to isolate | Does a new bot help? | What to do |
|---|---|---|
| A website sign-in | No; the browser is shared | Sign out of that site on the shared computer when done |
| An inbox or app | No; connectors are account-wide | Don't connect it; if connected, disconnect and revoke in the source service |
| Sensitive files | No; files are shared | Delete them from `/workspace` when finished |
| Payments | No; Vault is shared | Don't save the card; enter it in a Secure Form each time |
| A fully separate identity | No | Use a separate account |

Last step: when you create each bot, use the first message to spell out its job, sources and boundaries, and ask it to remember. Then add a few narrow Ask first rules for external email, publishing, deleting and paying. Memory is only what it remembers; boundaries have to be backed by approvals and rules.

## Who it suits, and who it doesn't

**Suits you if:**
- You have several standing responsibilities and want one bot per role.
- You already use Cursor or The X Subscription.
- You want event-triggered routines, such as on PRs, Slack channels or webhooks.

**Doesn't suit you if:**
- You want separate bots to isolate sensitive accounts.
- You need predictable usage: the pool is shared and was cut in November.
- You want to choose the model.

In Taiwan, the docs list no regional restriction; Premium or higher on The X Subscription gets you access.

This is the last post on route 1, all about one person using their own agents. Next, Devin Bots opens route 2: bots that don't work for you personally, but are handed to a team and own a whole area of work.

## References

- [Introducing Grok Bot 1.0](https://x.ai/news/grok-bot-1-0) (SpaceXSI, 2026-11-11)
- [Designing Grok Bot for a world of persistent agents](https://x.ai/news/designing-grok-bot) (SpaceXSI, 2026-09-03)
- [Create and manage Bots](https://docs.x.ai/grok-bot/bots) (SpaceXSI Docs, updated 2026-11-16)
- [Frequently asked questions](https://docs.x.ai/grok-bot/faq) (SpaceXSI Docs, updated 2026-11-13)
- [Use the computer and apps](https://docs.x.ai/grok-bot/computer-and-apps) (SpaceXSI Docs)
- [Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy) (SpaceXSI Docs, updated 2026-11-13)
- [Elon Musk throttles Grok Bot limits due to 'unsustainably high' costs](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/) (TechCrunch, 2026-11-02)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
