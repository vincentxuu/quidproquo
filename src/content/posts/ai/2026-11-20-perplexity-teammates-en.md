---
title: "Perplexity Teammates Take On Multi-Week Knowledge Work: When to Hand It to a Teammate, and When One Computer Task Will Do"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, perplexity]
lang: en
tldr: "Perplexity teammates are always-on agents for knowledge work: they remember project goals, past work and shared files, watch for changes and follow up on their own, then bring results back for your review, which puts them at L3 on the always-on ladder. Built on Perplexity Computer, a teammate coordinates Computer sessions and other teammates, and each one runs in its own environment with its own browser sessions. For now they're web-only for Max subscribers. In multi-week knowledge work the feedback signal is your review, so whether a job suits a teammate depends on whether you have time to review what it hands back."
description: "Perplexity's always-on agent teammates: how Comet, Computer and Personal Computer led to teammates, how a teammate remembers work across weeks and hands off to other teammates, how credits are spent, and whether a job belongs with a teammate, a one-off Computer task, or Personal Computer on your own Mac."
series:
  name: "Always-On AI Agents"
  order: 10
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-perplexity-teammates)

| Four tests | Perplexity teammates |
|---|---|
| Keeps running while you're away | ✓ Runs in Perplexity's environment, advancing one project across many runs |
| Decides what to do when it wakes | ✓ L3: watches ongoing work and investigates and follows up when things change, without waiting for a new query |
| Remembers your goals across conversations | ✓ Remembers project goals, past work and shared files, and applies your feedback to later work |
| Acts for you | ✓ Prepares outreach, quotes and ads, takes work in Slack; uses the tools and permissions you give it and brings results back for review |

In its [teammates announcement](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work), Perplexity gives a sales example: a regular customer stops ordering.

A sales teammate notices, reviews the customer's order history and support issues, and investigates what changed. Then it prepares an offer for that customer, or flags issues to resolve before reaching out. It keeps sharing progress updates and approval requests until the work is done.

A smaller example: tell an operations teammate that an agency needs two weeks' notice, and it factors that lead time into every future project schedule.

This post is about Perplexity teammates: how a long-running agent for knowledge work takes over a project that spans weeks, and when a job is worth handing to one.

## From Comet to teammates

Teammates are the latest layer in more than a year of building:

- **July 2025, Comet**: Perplexity's AI browser, which [Perplexity calls](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work) the first web-capable AI assistant, used for booking restaurants and shopping.
- **February 2026, Perplexity Computer**: a "digital worker" that [orchestrates 20 frontier models](https://www.perplexity.ai/hub/blog/everything-is-computer), understands a goal, moves across tools and keeps working after you step away.
- **Announced March 11, launched April 16, 2026, Personal Computer**: Computer on your own Mac, with access to local files and native apps. [Perplexity recommends](https://www.perplexity.ai/hub/blog/personal-computer-is-here) running it on a Mac mini left on 24/7; from May 7, [TechCrunch reported](https://techcrunch.com/2026/05/07/perplexitys-personal-computer-is-now-available-everyone-on-mac/), it was available to Pro and Max subscribers in the new Mac app.
- **November 4, 2026, teammates**: built on Computer, for taking over long-running, ongoing work.

Perplexity's framing: Computer can handle complex projects, but setting up an agent to own ongoing work used to require planning it yourself. Teammates are built for that.

## How a teammate takes over work that spans weeks

### It coordinates Computer rather than replacing it

A teammate coordinates Computer sessions, and can work with other teammates, to keep projects moving. It plans the work, checks results along the way and brings completed work back for your review. You can inspect and redirect it at any time.

It uses three things Computer already has:

| Piece | What a teammate uses it for |
|---|---|
| Projects | Project data and goals, such as existing account research and sales targets |
| Skills | Written methods, such as how to write outreach |
| Automations | Recurring work, such as a weekly pipeline review |

Perplexity's sales example combines all three: identify stalled conversations, prepare follow-ups for review, and apply the results to the next week's work.

### What it remembers

- Project goals, task history and shared files, across runs. Each new task builds on the work already done.
- Your feedback, applied to future tasks, as with the agency's two weeks' notice.

### Whom it hands off to

- **Colleagues**: add a teammate to a Slack channel and colleagues can hand it work or ask for updates.
- **Other teammates**: one teammate finds bugs on a website and passes its findings to another to prepare fixes.

### Where it runs

Each teammate runs in a separate environment, with browser sessions kept apart from other teammates. Saved credentials are encrypted and entered securely, and permissions follow Computer's existing tool and Project permissions. You can review completed work, take over the desktop, or redirect a teammate as it works.

That differs from [Grok Bot in post 8](/posts/ai/2026-11-20-grok-bot-en), where every bot on an account shares one computer and browser; Perplexity says each teammate's browser sessions are separate.

## The feedback signal shifts from tests to your review

[Devin Bots](/posts/ai/2026-11-20-devin-bots-en), in the previous post, own code, and the feedback signal is clear: do the tests pass, is CI green, did performance regress? The bot can run those checks itself to judge whether it got things right.

Teammates do knowledge work: market research, marketing campaigns, customer outreach, operations schedules. Most of that has no automated test. Whether a competitive analysis is any good, or an outreach email strikes the right tone, ultimately takes a person. Perplexity describes it the same way: teammates "present results for review" and send approval requests along the way.

That creates a practical limit: **how much a teammate can take on depends on how much you can review.** If it hands back three reports, ten draft emails and an ad proposal a week and you don't have time to look, they just pile up.

Each of Perplexity's four example uses has a review point:

| Use | What the teammate does | What you review |
|---|---|---|
| Marketing | Manages social posts, email, ads and SEO; watches performance and competitors' promotions, drafts fixes when results slip | New ads and responses to competitors' price changes |
| Sales | Finds opportunities in inquiries, past orders and unfinished conversations; prepares outreach and quotes, follows up on replies | Outreach and quotes before they go out |
| Customer support | Summarizes the previous day's complaint trends, flags cases needing a personal reply from the CEO and drafts them | The replies the CEO sends personally |
| Operations | Tracks deadlines, checklists, vendors and paperwork; follows up on missing items 72 hours before a deadline | Follow-ups to vendors and internal teams |

## Credits

Teammates spend Computer credits. [Perplexity's help page](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity) says 100 credits currently equal $1; ordinary searches are free, and only Computer work spends credits.

| Task type | Typical cost (credits) |
|---|---|
| A quick fact or definition | 15–70 |
| A multi-step research report | 350–950 |
| A data dashboard | 2,400–9,800 |
| An entire app or multi-day build | 15,000+ |

Max includes 10,000 credits a month, and unused credits don't roll over. So a single data dashboard can use up nearly a whole month. A teammate is long-running work: every weekly check and every follow-up spends credits, so estimate how much it will do in a month before you start.

Controls to know:

- **Auto-refill is off by default**: without it, active tasks pause (not cancel) when credits run out and resume automatically once you buy more or your monthly credits reset.
- **Spending cap**: Max accounts have a monthly cap on credit purchases, $200 by default and adjustable up to $5,000. At the cap, active tasks pause.
- **Per-task cost**: the Usage dropdown in a task shows how many credits it used; the Usage page breaks usage down by session.

## The evidence so far

Teammates are a little over two weeks old, and there's no independent hands-on review yet; coverage such as PCMag's mostly restates the announcement. The figure Perplexity cites is for Computer: it says internal teams used Computer on more than 16,000 queries and, against benchmarks from consulting firms and universities, saved $1.6 million in labor. That's company-reported, and it's Computer, not teammates.

## A teammate, a one-off Computer task, or Personal Computer?

Perplexity now offers three ways to work, differing in how long the work runs and what it needs to touch:

| | One-off Computer task | Teammate | Personal Computer |
|---|---|---|---|
| Length of work | Done in one go | Ongoing, across weeks | Work that needs a machine always on |
| Remembers prior work | Within that task only | Project goals, task history, files and your feedback | Runs on your Mac with your local context |
| Who triggers it | You | You, colleagues, other teammates, or it notices a change | You, or a schedule you set |
| What it can reach | Connectors, the web | Connectors, the web, Slack, Projects | Local files, native Mac apps, connectors, the web |
| Where it runs | Perplexity's cloud sandbox | A separate Perplexity environment | Your own computer |

To decide whether a job belongs with a teammate, ask four questions:

1. **Will it last more than two weeks?** A competitive report that's done once is a one-off Computer task. "Update me weekly on competitors and alert me when one cuts prices" needs a teammate.
2. **Does it need to remember what came before?** If you'd have to re-explain the background every time, a teammate that remembers is worth it.
3. **Is the trigger a change in the outside world?** A customer stops ordering, ad performance slips, a deadline is 72 hours out: someone has to keep watching, which is what teammates are for.
4. **Do you have time to review what it hands back?** If not, don't start one yet.

If the work needs files on your computer or native apps, like sorting a Downloads folder or comparing local files against the web, that's Personal Computer territory, not a teammate's.

## Who it suits, and who it doesn't

**Suits you if:**
- You already pay for Perplexity Max and use Computer for research.
- You have multi-week knowledge work that needs watching: marketing performance, customer outreach, project deadlines.
- Your team uses Slack and wants colleagues to hand work to the same agent.

**Doesn't suit you if:**
- You don't have time to review the output: you're the feedback signal, and without your review it can't tell whether it got things right.
- Your work involves lots of dashboards or builds: credits run out fast.
- You want independent reviews before deciding: there aren't any yet.

The announcement says teammates launch first on the web for Max subscribers, with iOS coming soon, and doesn't mention regional restrictions.

With Devin Bots and teammates, the team itself decides what an agent can touch. Next, [Microsoft Autopilot](/posts/ai/2026-11-20-microsoft-autopilot-en) takes a different approach: the agent gets its own identity in the company directory, managed by IT, with a named human accountable for it.

## References

- [Teammates are agents for complex, ongoing work](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work) (Perplexity, 2026-11-04)
- [Everything is Computer](https://www.perplexity.ai/hub/blog/everything-is-computer) (Perplexity, 2026-03-11)
- [Personal Computer is here](https://www.perplexity.ai/hub/blog/personal-computer-is-here) (Perplexity, 2026-04-16)
- [How credits work on Perplexity](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity) (Perplexity Help Center)
- [Perplexity's Personal Computer is now available to everyone on Mac](https://techcrunch.com/2026/05/07/perplexitys-personal-computer-is-now-available-everyone-on-mac/) (TechCrunch, 2026-05-07)
