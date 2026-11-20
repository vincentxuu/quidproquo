---
title: "When Claude Duet Should Interrupt You: the Morning Brief, Checks Every Few Hours, and the 'Slightly Neurotic' Day"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, claude, anthropic]
lang: en
tldr: "Claude Duet is Anthropic's always-on agent for professionals and small business owners: a short brief each morning, then a check of your mail, calendar and connected apps every few hours, messaging you only when something needs you, which puts it at L3 on the always-on ladder. Check frequency is tied to your plan's usage limits, so something urgent can land between checks; it always stops for approval before sending, paying, signing or deleting, and won't trade securities or move money between accounts even if you agree. Testers find it useful and a little neurotic. It's a US-only waitlisted preview for Pro, Max and Ultra, not available in Taiwan."
description: "Anthropic's always-on agent Claude Duet: how the morning brief and scheduled checks decide when to interrupt you, why checks count toward usage limits, which actions always stop, hands-on results from The Verge and WIRED, research on trust in proactive help, and a 'what's worth interrupting me for' rulebook to give your assistant."
series:
  name: "Always-On AI Agents"
  order: 6
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-20-claude-duet)

| Four tests | Claude Duet |
|---|---|
| Keeps running while you're away | ✅ Has its own cloud VM and browser; your phone or laptop needn't be on |
| Decides what to do when it wakes | ✅ L3: a morning brief, then checks every few hours, deciding what to tell you |
| Remembers your goals across conversations | ✅ Carries your Claude memory, skills and connectors; can search past chats |
| Acts for you | ✅ Sends email, pays, signs documents, each one shown to you for approval first |

The Verge's Allison Johnson [tested Duet for a week](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on). One day she emailed someone she'd interviewed that the story was "likely" to go up on Tuesday and she'd send a link when it did. She filed the draft to her editors late Monday night.

Before 9 a.m. on Tuesday, Duet was "beside itself": the story was still waiting for an edit, and if she didn't get on it she couldn't send the link she'd promised. Johnson called the concern "a bit misplaced." Duet missed the nuance in her email, which implied no hard deadline, and it didn't notice that it was only 7 a.m. for her editor.

The same week, Duet caught something she'd missed: upcoming time off would leave her only a couple of working days before another big draft was due. It proposed a fix, offered to update the weekly-notes doc her editor reads, and drafted a Slack message for him.

Johnson's headline: Duet is "a little neurotic and surprisingly helpful." This post is about how Duet decides when to interrupt you, and how you can tell it.

## What Claude Duet is

Anthropic [opened a Duet research preview on October 21, 2026](https://claude.com/resources/articles/claude-duet), aimed at "professionals and small business owners."

- **Who can use it**: Claude Pro, Max and Ultra subscribers in the US, [via a waitlist or an invitation from an existing user](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet); not yet on Team or Enterprise plans.
- **Interface**: standalone iOS and Android apps plus claude.ai; you message it by typing or voice.
- **Model**: Claude Opus 5.5, not selectable; it decides how much effort each job needs.
- **What it connects to**: your Claude account's memory, skills and connectors, such as Gmail, Google Calendar, Slack, QuickBooks, HubSpot and Docusign. For sites without a connector, it uses its own cloud browser.
- **Cost**: included in your subscription, but it shares the same usage limits as the rest of Claude.

The help page lists some limits:

- You can't watch its browser or take it over.
- It doesn't make phone calls or text other people.
- It can't reach files on your computer.
- Personal Finance isn't available in Duet.

Anthropic also says plainly that it's built around work, so "personal errands, such as booking tickets, aren't quite as strong."

Compared with [Instinct](/posts/ai/2026-11-20-instinct-en) in the previous post, both go looking for things to do. Instinct is a life assistant that tries to finish whatever it finds; Duet is a work assistant that spends most of its effort deciding what needs you.

## How it decides when to interrupt you

Anthropic says Duet's value is its judgment: deciding "what needs you, what can wait, and when to check with you first." That judgment lives in a few concrete design choices.

### A fixed rhythm: brief plus checks

The [help page](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) describes the day:

- **Morning**: it looks across your email and calendar, picks what most needs your attention, sends a short brief, and can start first steps such as drafting replies.
- **During the day**: it checks your connected accounts every few hours and messages you only when something needs you; it also follows up on threads that have gone quiet.
- **A quiet main thread**: work in progress lives in the Tasks tab, and only finished tasks or decisions come back to the main thread. It can suggest a task looks done, but only you can mark it complete.

The Verge's reporter saw suggestions as a stack of cards: swipe left to dismiss, right to set Duet to work.

### Why it doesn't watch constantly

Anthropic's reason for "every few hours" is blunt: checking nonstop would use up your plan's limits much faster. The [help page says](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) background work such as the morning brief and check-ins counts toward your five-hour and weekly limits at the same rate as chat, so you may hit limits sooner than with chat alone. During the preview, Anthropic added limit resets: three for Pro, one for Max and Ultra, expiring December 15.

The cost is on the same page: "something urgent can arrive between checks." Denser checks miss fewer urgent things and burn more of your limits. For now Anthropic sets the frequency; what you can adjust is telling it what you want to hear about and how often.

### What always stops

The other kind of interruption is a request for approval. Duet reads, drafts and prepares on its own; for the following, it shows you exactly what it's about to do and waits:

- Sending a message
- Making a payment
- Signing a document
- Deleting anything

The [announcement](https://claude.com/resources/articles/claude-duet) also lists things it won't do **even with your approval**: trading securities and moving money between accounts; the help page adds accessing someone else's account.

If you can't approve right away, it finishes the rest of the task and brings the approval back later. When it gives you a number or summary, it says which email, file or spreadsheet it came from.

At launch Anthropic also added a dedicated classifier that checks each outgoing message for sensitive information. The strictest tier, such as card numbers and government IDs, is always blocked; health and personal finances go through only when you've explicitly told it to send them.

Purchases use Stripe's Link or Shopify's Shop Pay: it confirms the item with you, Link asks you to approve the spend, and it pays with a one-time virtual card. The security design is covered in the [security deep-dive](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en), so it isn't repeated here.

## How it holds up in use

**The Verge** ([Johnson, one week](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)): she connected her work email, calendar, Google Docs and Slack. Duet linked a meeting-summary email to a Slack DM, and worked out who her boss was from their shared one-on-one doc.

- **Helpful**: a morning reminder to pack something for a video shoot before her flight; catching the time-off and deadline clash and drafting the message to her editor. That message copied her all-lowercase style and went out tagged "sent with Claude."
- **Neurotic**: the Tuesday-morning story reminder above.
- **Unwanted**: it kept offering to start her drafts, which for a writer is "always a hard no."
- **Uncanny**: it can read every email, draft and Slack message she sends. She wondered whether, if she didn't need to keep her own calendar, write to-dos or pay attention in meetings, she'd end up disconnected from her workplace. "Maybe that's how CEOs live."

Her conclusion: having AI find overlooked discrepancies between emails, DMs, meetings and docs and point them out proactively is really helpful. She wants it as a backstop for her own systems, not a replacement.

**WIRED** ([one day, six agents](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)): Duet launched the night before testing and was named "Best Interface":

| Test | Duet score | Notes |
|---|---|---|
| Morning news pitch | 4 | Interesting and timely |
| Ordering lunch | 3 | Picked a place and asked DoorDash or Uber Eats; the cart ran pricey |
| Spotting a schedule conflict | 4 | Flagged it hours ahead, but offered no alternatives |
| Travel itinerary | 3 | Solid, no visuals |
| Open-ended insomnia request | 2 | Asked him, in the middle of the night, to close out the previous day's lunch and pitch |

The conflict test was the second-best result of the six, behind only Dots. The insomnia test was the opposite: awake in the night, the reporter got an offer to mark yesterday's two small tasks done. One reporter on one day, but the two tests together show both sides of "when to interrupt": the same proactive nudge rescues you at the right moment and intrudes at the wrong one.

## What the research says

In September 2026, researchers from KAIST and the University of Minnesota published [Proactivity-Gym](https://arxiv.org/abs/2609.37267) for evaluating proactive agents. They argue proactive help has to balance three things: doing useful work correctly, spending compute at the right time, and keeping the user's trust.

The 30-participant scenario study described in the paper's abstract and introduction bears directly on Duet:

- **One mistimed intervention costs a lot of trust**: after a single intervention whose depth didn't match expectations, participants' trust dropped sharply, even when the outcome was correct. Returning to aligned behavior didn't necessarily restore it.
- **Don't interrupt the task at hand**: help that competed with ongoing work was often rejected; the same help scheduled for sleep time was more acceptable, even when the output needed correcting.
- **If it's not urgent, defer**: with no resource or deadline conflict, participants preferred deferral to protect their current focus.
- **Model judges can't tell**: LLM judges' trust scores mostly tracked whether the task was done right and were relatively insensitive to mistimed or over-deep interventions.

It's a small, scenario-based study, not a test of Duet. But it explains why that Tuesday morning felt wrong: the reminder's content wasn't wrong; its timing and depth were.

## A "what's worth interrupting me for" rulebook

Anthropic says you can tell Duet "what you want to hear about and how often." Rather than waiting for it to calibrate, write it down on day one. Sort what you want it to watch into five buckets:

| Bucket | Meaning | Examples |
|---|---|---|
| Tell me now | Causes a loss and only I can handle it | A client cancels, an invoice is 30+ days overdue, tomorrow's meetings clash |
| Put it in the brief | I should know today, but not urgently | Things due this week, important unanswered email |
| Do it and leave it | No need to ask; leave it in Tasks for me to review | Meeting prep, reply drafts, a first-pass weekly report |
| Do it overnight | Not urgent; I'll look in the morning | Research, spreadsheets, a first-draft deck |
| Don't bring it up | I handle it myself, or don't want it | Drafting articles, newsletters, social notifications |

Then add a few judgment rules aimed at the kind of misread The Verge hit:

- A date with "probably" or "likely" and no firm deadline isn't a deadline.
- When other people are involved, check their time zone and working hours first.
- Remind me about the same thing at most once a day; if I don't respond, move it to tomorrow's brief.
- No messages between 10 p.m. and 8 a.m. unless it's "tell me now."

A version you can paste to Duet:

```text
From now on, use these rules to decide whether to interrupt me:
1. Tell me now: a client cancels or delays payment, a schedule clash before tomorrow.
2. Morning brief: anything due this week, client emails unanswered for more than two days.
3. Don't ask, just leave it in Tasks: meeting prep, reply drafts.
4. Don't offer to draft my articles.
5. Dates with only "probably" or "likely" aren't deadlines; check other people's time zones first.
6. Remind me about the same thing at most once a day; no messages 10 p.m.–8 a.m. except for category 1.
```

After a week, look back: which nudges felt intrusive, which things did it miss? Then revise.

## Who it suits, and who it doesn't

**Suits you if:**
- Your work is spread across email, Slack, meetings and shared docs, and you often miss the gaps between them.
- You run a small business: chasing invoices, running payroll, preparing agreements, without opening a hundred tabs.
- You already pay for Claude Pro or higher and can accept background work eating into your limits.

**Doesn't suit you if:**
- You need something watched in real time: checks run every few hours, and urgent things can fall in between.
- You mainly want help with personal errands like tickets and shopping.
- You don't want one agent reading all your work messages.

It isn't available in Taiwan: the research preview is US-only.

Duet decides when to interrupt you with fixed checks and a list of actions that always stop. Next, [OpenAI Dots](/posts/ai/2026-11-20-openai-dots-en) hands more of that decision to you, with four levels of custom rules for how far it may go.

## References

- [Introducing Claude Duet](https://claude.com/resources/articles/claude-duet) (Anthropic, 2026-10-21, updated 10-23)
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) (Claude Help Center)
- [Claude's Duet agent is a little neurotic and surprisingly helpful](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on) (The Verge, 2026-11-13)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
- [Foundations of Proactive Agents: Principles, Technical Layers, and Proactivity-Gym](https://arxiv.org/abs/2609.37267) (Oh et al., arXiv, 2026-09-29)
