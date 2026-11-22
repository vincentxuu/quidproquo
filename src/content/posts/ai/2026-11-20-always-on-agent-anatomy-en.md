---
title: "How Always-On Agents Wake Themselves: Clocks, Conditions, Open-Ended Checks, and the Computer and Memory Behind Them"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, proactive-agent, openclaw, hermes-agent]
lang: en
tldr: "Always-on agents wake at one of three levels: run the question you wrote on a clock (Mistral Vibe, Doubao Work), run when a condition you set is met (Gemini's Gmail and topic monitors), or check in with your context on an open question — what needs attention? — and stay silent if nothing does (OpenClaw's Proactive check, Claude Duet's check-ins). To place a product, ask four things: who writes the question, whether it's open or fixed, whether the agent wakes with your memory, and whether it can stay quiet."
description: "The parts of an always-on agent: three triggers and a three-level ladder, how each vendor implements them, why the agent needs its own computer, where results land, whether you can see its memory, and the three settings to look for first."
series:
  name: "Always-On AI Agents"
  order: 1
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-always-on-agent-anatomy)

Say you want one thing: "Tell me if anything odd shows up on my credit card statement." Hand that to three kinds of agent and you get three very different behaviours.

- The first: you write a prompt, "Every day at 9 a.m., read my card statement and list every charge." At 9 a.m. every day it sends you the full list, odd or not.
- The second: you set a condition, "when my bank emails a statement." It runs once when the email arrives and checks for anything odd.
- The third: you once said "unexplained charges really bother me." It wakes every so often, looks at your inbox, statements and recent conversations, and only comes to you when it spots a subscription fee it hasn't seen before. If it finds nothing, it doesn't bother you.

All three "keep running after you close the app". The difference is who decides what to do on waking. The [series overview](/posts/ai/2026-11-20-always-on-agents-overview-en) wrote test 2 as "decides for itself what to do when it wakes". This post takes that apart: how a round of work starts, how the three-level ladder divides up, which computer the agent wakes on, where results go, and what it remembers.

## How a round of work starts

A chatbot has one way to start: you send a message. An always-on agent has three more that don't need you. After testing six products at the end of October 2026, Pinggy sorted them into three kinds ([Pinggy comparison](https://pinggy.io/blog/proactive_ai_agents_compared/)):

- **Clock**: run at a set time, such as 8 a.m. every day.
- **Event**: run when something happens outside, such as an email of a certain kind arriving, a new GitHub issue, or someone mentioning the agent in Slack.
- **Self-wake**: the agent decides when to look again, or runs a periodic "anything need attention?" pass.

The same comparison makes the key point: self-wake **only works if the agent can say nothing**. An agent that wakes every 30 minutes and posts "nothing to report" each time sends 48 useless messages a day, and you'll mute it within a week.

## The three-level ladder

```diagram
title: Three levels at which an always-on agent wakes
desc: From bottom to top: level one runs your fixed question on a clock and always reports; level two runs only when a condition you set is met; level three checks in with your context, decides whether to come to you, and stays quiet when nothing needs attention.
caption: A product can offer several levels at once — Gemini has both clock and condition triggers. Products are placed by the highest level they reach.
---
<svg viewBox="0 0 640 296">
  <path class="dg-axis" d="M36 256V48" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">AGENT</text>
  <text class="dg-tag" x="36" y="276" text-anchor="middle" dominant-baseline="central">YOU</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="88" rx="6"/>
  <text class="dg-tag" x="92" y="68" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="44" dominant-baseline="central">Checks in with your context, quiet if nothing</text>
  <text class="dg-sub" x="124" y="68" dominant-baseline="central">An open question: "what needs attention?"</text>
  <text class="dg-sub" x="124" y="90" dominant-baseline="central">OpenClaw Proactive check, Claude Duet, Dots</text>

  <rect class="dg-box" x="72" y="120" width="552" height="64" rx="6"/>
  <text class="dg-tag" x="92" y="152" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="140" dominant-baseline="central">Runs when a condition you set is met</text>
  <text class="dg-sub" x="124" y="164" dominant-baseline="central">Gemini Gmail/topic monitors, Hermes webhooks</text>

  <rect class="dg-box" x="72" y="192" width="552" height="64" rx="6"/>
  <text class="dg-tag" x="92" y="224" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="212" dominant-baseline="central">Runs your fixed question on a clock, always reports</text>
  <text class="dg-sub" x="124" y="236" dominant-baseline="central">Mistral Vibe scheduled tasks, Doubao Work auto tasks</text>
</svg>
```

### L1: your fixed question, on a clock

[Mistral Vibe's scheduled tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks) run once, daily, weekly, monthly or yearly, executing the prompt you wrote. The docs say triggers are time-based for now and event-based triggers "may follow". Every run's result appears in the sidebar with an unread dot. [Doubao Work's auto tasks](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks) (in Chinese) work the same way: run at a preset time, push a notification when done, and in cloud-computer mode keep running with your machine switched off.

The upside of this level is predictability: you know when it runs, what it runs and what comes back. The cost is that anything you didn't write down, it won't look at.

### L2: runs when your condition is met

[Tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) offers three kinds of schedule: time-based, Gmail monitors (run when an email matches a Gmail filter) and topic monitors (run when something specific happens in news, finance, sports, local events and more). Google's help page states the division of labour plainly: "You tell Gemini what to do and when to do it."

The same page states this level's limits: monitors are "not ideal for tracking fast-moving data or performing time-critical tasks", run times are approximate, and runs may be delayed during high traffic.

Hermes Agent's [webhooks](https://pinggy.io/blog/proactive_ai_agents_compared/) sit on the same level: a new GitHub issue arrives, its contents are dropped into the prompt you wrote, and the job runs once.

### L3: checks in with your context, stays quiet if nothing

At this level the question is open. The agent isn't told to "read the statement"; it's told to "see what needs your attention", and judges for itself.

- **OpenClaw**: first-time setup creates a [Proactive check](https://docs.openclaw.ai/gateway/heartbeat) that runs every 30 minutes by default, uses your main conversation with the agent, waits until the agent is idle, and delivers to your DM. If nothing needs attention it replies `NO_REPLY` and nothing is sent. This used to be called heartbeat; it's now an ordinary automation job you can retime, re-prompt or delete.
- **Claude Duet**: [each morning](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) it looks across your email and calendar and picks what most needs your attention; through the day it follows up on threads that have gone quiet and checks your connected accounts at set intervals. The main thread speaks up only when a task is done or needs a decision.
- **OpenAI Dots**: when you're not working with it directly, it does "[proactive research](https://learn.chatgpt.com/docs/dots/controls)" in the background, looking through your connected apps for ways to help and forming memories from them. During that research it can only use read-only tools: no sending messages, no changing app content, no controlling the browser or computer.
- **Grok Bot**: each account has a [primary Bot](https://docs.x.ai/grok-bot/bots) that checks in with you on its own and coordinates your other Bots.

Dots goes one step further. Pinggy notes that a dot decides when to pause and when to come back, so follow-ups need no fixed schedule. Even "how often to wake" is left to the agent.

## The ladder sorts questions, not products

A fair objection at this point: if I write an open prompt into an L1 tool — "look at my inbox and calendar, tell me only what needs a decision today, and don't report if nothing does" — haven't I built L3?

Pinggy did exactly that with Hermes Agent. If a Hermes cron job's final response contains `[SILENT]`, nothing is delivered ([Hermes cron docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)). So a job that says "every weekday at 8 a.m., check my inbox; if nothing needs me, reply `[SILENT]`" already behaves much like L3.

The difference is context. The Hermes docs state that cron jobs run in **fresh sessions** with no conversation history, so prompts must be self-contained; persistent memory (`MEMORY.md`, `USER.md`) still loads as usual ([Cron Internals](https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals)). So if you had it remember "unexplained charges really bother me", the scheduled run knows. If you only mentioned it in passing in a chat and it never went into memory, the run doesn't. The official guide also advises spelling out job-critical details in the prompt rather than relying on memory.

So to place a product, or a job you set up yourself, ask four questions:

| Question | L1 | L2 | L3 |
|---|---|---|---|
| Who writes the question? | You | You | Product default, which you can edit |
| Open or fixed question? | Fixed | Fixed | Open |
| What context does it wake with? | Only what's in the prompt | The prompt plus the triggering event | Main conversation, memory, connected data |
| Can it stay quiet when nothing's wrong? | Mostly no | Depends on the product | Yes |

Mistral Vibe and Doubao Work fail the last row: every run hands back a result, so even an open prompt reports every time. Hermes is different. Write an open prompt, have it reply `[SILENT]` when nothing's wrong, add the persistent memory that loads anyway, and you can assemble something close to L3 yourself; what's missing is the main conversation, and you have to set it up. OpenClaw's Proactive check ships set up by default and uses the main conversation, so it passes all four rows even though, underneath, it is also a scheduled job.

This is also why the overview said scheduled automation "isn't worse". L3's open question and memory cost you predictability about what it will do this time. The *Overreach* post later in the series shows what that cost looks like in practice.

## Which computer it wakes on

"Keeps running after you close the app" assumes there's a computer switched on when the agent wakes.

- **The vendor's cloud computer**: the Gemini help page says Gemini runs in the cloud rather than on your phone or computer, so it keeps working with your device off. Grok Bot's [FAQ](https://docs.x.ai/grok-bot/faq) likewise says closing the app, laptop or phone doesn't stop background turns or routines.
- **Your own machine**: OpenClaw's Gateway runs on your machine, and Pinggy's test puts it bluntly: when the Gateway is down, nothing fires. Same with Hermes: nothing runs until `hermes gateway run` is up. Self-hosting means owning an always-on box or a VPS.
- **Both**: a dot has its own cloud computer and can optionally connect to yours, [off by default](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot); once connected, your computer has to stay online with the ChatGPT app open.

The cloud computer also isolates: the agent opens browsers, installs tools and runs code there, out of reach of the files on your laptop. How far that isolation goes differs by vendor. Grok Bot's FAQ says every Bot on an account shares one computer, including its files, browser sessions and app logins, and warns: "Do not use separate Bots as a security boundary." The Grok Bot post on route 1 goes further into this.

## Where results land when it wakes

An always-on agent does a lot while you're away, so every vendor has an inbox of some kind for when you come back:

- **Dots**: in the desktop app, your dot's profile has Activity (work in progress, including background work) and Scheduled; tasks waiting for a decision, sign-in or approval are flagged.
- **Claude Duet**: the Tasks tab lists work in progress and highlights what needs your input; the main thread stays quiet until a task is done or needs a decision. It can suggest that a task looks finished, but only you can mark it complete.
- **Gemini**: the Scheduled page, split into active, paused and completed.
- **OpenClaw**: Proactive check results go to the owner's DM; `NO_REPLY` means no message at all.

Finding that inbox is the first step with any always-on agent: it's the only place you can see what it did while you weren't looking.

## What it remembers, and whether you can see it

Test 3 (remembering your goals across conversations) is implemented very differently, and that directly affects how well you can keep it in check:

- **Grok Bot**: a Bot [decides on its own](https://docs.x.ai/grok-bot/bots) what's worth keeping, without asking first and not always mentioning it in chat. Personal Bots have no memory screen; to see, correct or delete memories you ask in chat. The docs add a warning: memory is not a source of truth, so for consequential decisions ask the Bot to recheck the source.
- **Dots**: starts from your ChatGPT memory and also forms its own memories proactively from connected apps. [To delete a dot's own saved memories](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) you have to delete the dot. Disconnecting an app doesn't delete what the dot already obtained from it.
- **Claude Duet**: uses your Claude account's memory, skills and connectors; after you disconnect an app, what it learned from that app earlier stays in memory.

All three share one behaviour: disconnecting an app or deleting a chat **doesn't remove what's already in memory**.

## The three settings to find first

Whichever product you use, the first time you open its settings, look for these three:

1. **What it reads in the background.** Which apps does it touch when nobody asked? Dots' proactive research reads all connected apps (Enterprise admins can't turn it off separately). Duet's check-ins read your connected accounts, and background work counts toward your plan's usage.
2. **What level it wakes at, and how often.** Is there an L3 check-in? At what interval? Duet's help page notes it checks at set intervals, so something urgent can arrive between checks. OpenClaw's Proactive check can be retimed, limited to active hours, or deleted.
3. **Where the inbox is.** Find the page that shows what it did and what it's waiting on, and bookmark it.

Self-check: while doing proactive research in the background, Dots finds an email that needs a reply. Can it reply? No. Proactive research only uses read-only tools. Replying has to be work you assigned or an action your custom rules allow, and it still passes the automatic review.

The next post starts route 1 with its boundary case: why [Tasks in Gemini](/posts/ai/2026-11-20-gemini-tasks-en) stops at L2, and why that may be exactly enough for you.

## References

- [Proactive AI Agents Compared: Dots vs Muse vs Grok Bot vs Instinct vs Hermes vs OpenClaw](https://pinggy.io/blog/proactive_ai_agents_compared/) (Pinggy, 2026-10-31)
- [Schedule tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks) (Mistral Docs)
- [Using auto task mode](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks) (Doubao Work Help Center, in Chinese)
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) (Gemini Apps Help)
- [Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron), [Cron Internals](https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals), [Automate Anything with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron) (Hermes Agent Docs)
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat), [Automation](https://docs.openclaw.ai/automation) (OpenClaw Docs)
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) (Claude Help Center)
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls) (ChatGPT Learn)
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) (OpenAI Help Center)
- [Create and manage Bots](https://docs.x.ai/grok-bot/bots), [Grok Bot FAQ](https://docs.x.ai/grok-bot/faq) (SpaceXSI Docs)
- On this site: [OpenClaw Automation (1)](/posts/ai/2026-03-28-openclaw-automation-cron-webhook-en), [Hermes Agent's Gateway and Scheduling](/posts/ai/2026-08-18-hermes-agent-gateway-cron-en)
