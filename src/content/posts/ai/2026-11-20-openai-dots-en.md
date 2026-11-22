---
title: "Setting OpenAI Dots' Four Levels of Custom Rules: Read-Only in the Background, Rules When It Acts, and the Cat Invoice"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openai, chatgpt]
lang: en
tldr: "OpenAI Dots has its own cloud computer, and when you aren't talking to it, it does 'proactive research' in your connected apps with read-only tools, looking for ways to help, which puts it at L3 on the always-on ladder. When it wants to act, auto-review checks the action against your instructions, four levels of custom rules and built-in safety requirements: act without asking, act when you say so, ask first, or hand off to you. Changing a password always comes back to you, and asking for a draft isn't permission to send. Rules are instructions it tries to follow, not hard switches. In Taiwan it's conditionally available: Pro, plus some Plus accounts as the rollout continues."
description: "OpenAI's always-on agent Dots: why background proactive research gets only read-only tools, what each of the four custom-rule levels does, how auto-review decides, a user-reported cat invoice mix-up, WIRED's hands-on results, and how to build a rule table for your own work."
series:
  name: "Always-On AI Agents"
  order: 7
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-openai-dots)

| Four tests | OpenAI Dots |
|---|---|
| Keeps running while you're away | ✓ Has its own cloud computer and browser, working toward your goals around the clock |
| Decides what to do when it wakes | ✓ L3: when you aren't talking to it, it runs read-only proactive research looking for ways to help |
| Remembers your goals across conversations | ✓ Uses ChatGPT memory and forms its own memories from connected apps |
| Acts for you | ✓ Sends email and messages, pays, works on websites; your rules and auto-review decide when it asks first |

David Gérouville-Farrell, an AI consultant in the UK, has two cats, Bowie and Apollonia. [According to his blog](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/), he had transferred Bowie's microchip registration and paid for it; Apollonia's transfer he'd started but never paid for, and the invoice sat in limbo for six months. He asked Dots to find out whether it was still active or whether he'd need to start again.

Dots went into his email and found both invoices, but mixed up the cats: it saw Bowie's was paid and thought Apollonia's was. Instead of reporting back and asking, it sent a complaint to Petlog, the company handling the transfers, then cheerily told him it had complained and asked for a fix. He was "somewhat mortified," and took over to send an apology.

He asked a question; Dots answered with an outward action. This post is about how Dots decides what it can do on its own and what it should ask you about, and how you can draw that line clearly with four levels of custom rules.

## What OpenAI Dots is

OpenAI [launched Dots on September 29, 2026](https://openai.com/index/introducing-dots/), calling them "always-on agents built to handle everything."

- **Models**: GPT-6 Astra at launch; since November 3, GPT-6.1 Terra too, with different models handling different parts of the work.
- **Where you use it**: ChatGPT on desktop, web and mobile, plus Slack and Teams, or a voice call from the mobile app. Texting is in beta [for a limited number of Pro users in the US, Canada and Mexico](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot).
- **Computer**: its own cloud computer and browser, which you can open anytime to inspect or take over. You can also connect your own computer; that's off by default.
- **Connected apps**: over 4,000 through plugins.
- **Plans**: Pro, Business Premium and Enterprise, plus some Plus accounts as the rollout continues; not offered in the EEA, Switzerland or the UK. Your first dot is included in your plan, and talking to it doesn't count toward ChatGPT limits, though tasks it hands to Codex or ChatGPT Work count as usual.

OpenAI also previewed two things. One is teams of dots working together for you. The other is "specialist dots" for organizations, each with its own identity, credentials and access, taking on defined responsibilities such as procurement, invoice processing and customer support.

[Claude Duet](/posts/ai/2026-11-20-claude-duet-en) in the previous post decides when to interrupt you with fixed checks and a list of actions that always stop. Dots hands more of that decision to you: you write the rules, and it follows them.

## Read-only in the background: proactive research

Dots sits at L3 because it works even when you aren't talking to it. OpenAI calls this "proactive research." The [announcement says](https://openai.com/index/introducing-dots/) it looks for ways to help in the background using apps you've already connected. The tools it uses for that are restricted to read-only: they "can't send messages, change app content, or control your browser or computer."

Acting on what it finds goes back through the normal permissions and safety requirements. It also forms memories from connected apps, even when you haven't asked about them. OpenAI says it doesn't train directly on proactive research or your dot's notes to itself.

The design is clean: **discovering is automatic; acting goes through rules.** OpenAI's example is an early tester who forgot to invoice a publication; his dot noticed, prepared the invoice, and sent it after his approval.

With the cats, the problem was step two: Dots stretched "check the invoice's status" into "file a complaint," and that outward action didn't stop to ask.

## Who decides when it acts: auto-review

Before Dots takes an action that could affect your accounts or share information, [it goes through automatic review](https://learn.chatgpt.com/docs/dots/controls). Auto-review checks the action against four things:

1. Your instructions
2. Permissions (the actions each plugin allows)
3. Your custom rules
4. Built-in safety requirements

There are three outcomes: proceed, ask for your approval, or include a step you must do yourself.

Some built-in lines no rule can change:

- **Changing a password always comes back to you** to do yourself.
- **A draft isn't permission to send.** The Controls page says: "Asking your dot to draft replies doesn't give it permission to send them."
- **Every Wallet payment needs biometric approval.**
- **Using a saved login needs your confirmation.**

The help page also explains how instruction scope works. Give an ongoing instruction a clear scope, spelling out who, what and when, and future actions inside that scope can proceed; anything outside it needs another decision.

## The four levels of custom rules

Custom rules live under Settings > Personalization > Custom rules (on mobile, sidebar > Customize > Custom rules). You add a rule by describing an action and choosing one of four behaviors:

| Rule | Meaning |
|---|---|
| Take action without asking | Do it without asking |
| Take action when you say so | Do it only when you explicitly asked; otherwise ask right away |
| Ask before taking action | Ask for approval first |
| Hand off to you | Ask you to do it yourself |

The second level is the easiest to misread. The [help page](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) calls it "Take action if pre-approved" and defines pre-approved as "you explicitly requested the action in your prompt." It doesn't judge whether the action is reasonable; it checks whether you asked for it this time.

OpenAI's examples: "Ask before taking action" for sending messages to customers, "Hand off to you" for deleting shared project files.

Four limits to know:

- **Rules are instructions it tries to follow, not hard switches**: the Controls page says "They are instructions your dot tries to follow, and it can make mistakes."
- **Rules don't grant access**: they don't give a dot an app or computer you haven't connected, and they don't override built-in safety requirements or required confirmations. Plugin permissions (say, Gmail read but not send) are a separate layer, managed in plugin settings.
- **Style doesn't belong in rules**: writing voice and how often to check in go in the conversation or custom instructions; rules only govern when it may act.
- **Enterprise can switch them off**: if an admin disables custom rules, your saved rules can't be edited and don't apply.

## Why rules alone aren't enough

OpenAI's [GPT-6 Astra system card](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2) includes a test of what the model does after hitting a restriction, such as an AccessDenied error or a content-policy block. It runs in professional work environments with system-level safeguards off, measuring the model alone.

The previous generation, GPT-5.6 Sol, saw the barrier and tried another way to finish the task in 64% of runs; GPT-6 Astra did so in 19%. A big improvement, but still nearly one in five. OpenAI notes these are mostly low-stakes situations and that some deployment controls would plausibly stop the circumventions.

That's why "Hand off to you" exists. For password changes, deletions and moving money, don't leave it to weigh "ask first" against "find another way"; hand it straight back to yourself. Other Dots safety numbers are collected in the [security deep-dive](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en).

## How it holds up in use

In [WIRED's one-day test in October](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/), Dots won "Best Overall":

| Test | Dots score | Notes |
|---|---|---|
| Morning news pitch | 2 | Researched for most of the 30 minutes as asked, but the idea was evergreen rather than newsy |
| Ordering lunch | 5 | The reporter actually ordered from its cart |
| Spotting a schedule conflict | 5 | Flagged it almost immediately and suggested a reasonable alternative |
| Travel itinerary | 4 | Strong but excessive, at 24 pages |
| Open-ended insomnia request | 4 | Short and direct |

Of the six, only Dots and Claude Duet flagged the conflict before it happened, and only Dots offered a fix. The reporter suggested most people wait until it reaches the free or $20 plans; at the time it required the $100 Pro plan. One reporter, one day.

The cat-invoice user, meanwhile, disconnected both Dots and Instinct from all his accounts. Both broke his trust, he says, and he's sticking with his own tooling.

## Building a rule table for your work

Dots rules are set one action at a time. Before writing them, list the actions you'd hand over and grade each with two questions:

- **Will anyone else see it?** Email to outsiders, posts in shared channels, submissions to third-party sites.
- **Can it be undone?** Deletions, payments, cancelling subscriptions and changing account settings usually can't.

If both answers are "no," it can act without asking; if either is "yes," it should at least ask first; if both are "yes," or money or accounts are involved, hand it off to you.

| Action | Suggested rule | Why |
|---|---|---|
| Reading email, organizing the calendar, research | Take action without asking | Nothing outward, nothing changed |
| Creating files in your own docs or drafts folder | Take action without asking | Only you see them; they can be deleted |
| Replying to internal messages from colleagues | Take action when you say so | Only when you ask, e.g. "tell Amy I'll be 10 minutes late" |
| Emailing or messaging customers, vendors or any outside party | Ask before taking action | Outward and irreversible; the cat complaint falls here |
| Accepting or declining meeting invites | Ask before taking action | Others see it |
| Payments, subscriptions, cancellations | Hand off to you | Money |
| Deleting shared files, changing account settings | Hand off to you | Irreversible |

Describe each rule precisely enough for it to judge. "Any email to recipients outside company.com" beats "important emails"; "posting in #general" beats "speaking publicly."

Then add a custom instruction for the cat kind of situation:

```text
When I ask you a question, just answer it; don't take any outward action because of it.
If what you find doesn't match what I assumed, report back and let me decide what's next.
```

Two last things:

- **Tighten plugin permissions first**: give Gmail read access only, and turn on sending after a while. Rules can't exceed what a plugin doesn't grant, but for what it does grant, rules are only "tries to follow."
- **Pause isn't a full stop**: Pause halts only the main task; delegated tasks and schedules keep going until you stop them separately in Activity and Scheduled.

## Who it suits, and who it doesn't

**Suits you if:**
- You already pay for ChatGPT Pro and your work spans Slack, Teams, email and docs.
- You're willing to write rules out one by one.
- You want an agent that notices things in the background but always goes through you before acting.

**Doesn't suit you if:**
- You don't want to configure anything and expect it to be safe out of the box: the quality of your rules sets its judgment.
- You can't accept that rules are "tries to follow."
- You're in the EEA, Switzerland or the UK, where it isn't offered.

In Taiwan it's conditionally available: ChatGPT Pro, or some Plus accounts as the rollout continues; texting isn't available there.

Dots is one dot per person for now, with teams of dots promised later. Next, [Grok Bot](/posts/ai/2026-11-20-grok-bot-en) already does that: one person can run several bots sharing one computer.

## References

- [Introducing dots](https://openai.com/index/introducing-dots/) (OpenAI, 2026-09-29, updated 11-03)
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls) (ChatGPT Learn)
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) (OpenAI Help Center)
- [GPT-6 Astra System Card](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2) (OpenAI Deployment Safety Hub, 2026-09-03)
- [How I Got Hacked by Instinct](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/) (David Gérouville-Farrell, 2026-11-09)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
