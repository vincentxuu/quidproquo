---
title: "Salesforce Long-Horizon Agents Turn a Goal Into a Multi-Week Plan: When the Plan Breaks, Who Decides?"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, salesforce, agentforce]
lang: en
tldr: "Salesforce's long-horizon runtime lets Agentforce agents pursue a goal for weeks: memory keeps progress across sessions, durable execution keeps the plan running after interruptions, and dynamic steering lets you change its approach mid-run in conversation. The first agent on it is the sales agent Hunter: it turns 'rescue my at-risk deals' into a measurable goal and a multi-week plan that spells out when to check in with a human, and when an email bounces and it wants to write to someone else instead, it asks first because that departs from the plan you approved. As of mid-November, Hunter was still labeled 'Pilot now; GA November '26.'"
description: "Salesforce's long-horizon agents: what memory, durable execution and dynamic steering each solve, how Hunter turns a goal into a plan and handles departures from it, Agentforce Coworker's role, the state of general availability, and how to write 'which departures need approval' guardrails for a multi-week goal."
series:
  name: "Always-On AI Agents"
  order: 12
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-salesforce-long-horizon-agents)

| Four tests | Salesforce long-horizon agents (Hunter) |
|---|---|
| Keeps running while you're away | ✓ Durable execution keeps a plan running for days or weeks and resumes after interruptions |
| Decides what to do when it wakes | ✓ L3: works the plan, finds alternatives when things change, and checks back when it departs from the plan |
| Remembers your goals across conversations | ✓ Memory lives on account, contact and opportunity records, not in a chat window |
| Acts for you | ✓ Sends outreach from your mailbox; customer-facing actions can require rep approval |

Salesforce's [blog](https://www.salesforce.com/blog/long-horizon-agents/) introduces long-horizon agents with a scene: the quarter is ending, and an account executive has several stalled deals.

A conventional AI agent would probably offer to send the same generic email to every contact on the list. What the rep actually wants is to figure out why each deal stalled, who's worth re-engaging and what message would move each account.

The rep tells Hunter "re-engage my at-risk deals." Hunter analyzes open opportunities, pulls engagement signals from Data 360 and Slack, and rewrites the goal as something measurable: "re-engage $340k of at-risk pipeline by quarter-end." It drafts a plan spanning days, weeks or months, listing the tasks, the schedule, and the guardrails for when it checks in for human approval. The rep reviews the plan in a side panel, tweaks a few things and clicks activate.

Then one outreach email bounces: the recipient is on leave. Hunter doesn't give up. It looks across internal and external data, finds another person to contact and drafts a message. But that departs from the plan the rep approved, so it stops and asks for approval before sending the new email.

This post is about Salesforce's long-horizon agents: once a goal is broken into a multi-week plan, who decides when the plan has to change.

## Three components

Salesforce [announced the long-horizon runtime on September 11](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/), saying it lets agents pursue goals across days and weeks rather than completing only a task or interaction. It has three components:

| Component | What it solves | In Hunter's example |
|---|---|---|
| Memory | Keeps context and progress across sessions, so work doesn't stop when the conversation ends | Remembers the goal, what's been done, new engagement signals and upcoming tasks |
| Durable execution | Keeps the plan running and lets the agent resume or correct course as things change | Finds an alternate recipient when an email bounces instead of stopping |
| Dynamic steering | Changes the agent's behavior mid-run based on a user's feedback and direction | "More formal with VPs," "more casual on WhatsApp" |

Hunter's [product page](https://www.salesforce.com/sales/ai-sales-agent/outbound/) adds a detail about memory: it "lives on accounts, contacts, and opportunities, not in a chat window." So every action picks up where the last one left off.

## The plan is the guardrail

[Microsoft Autopilot](/posts/ai/2026-11-20-microsoft-autopilot-en), in the previous post, used identity to pin down "who is doing it." Salesforce's approach governs something else: "how far along is it, and when does it need to come back and ask."

The key is that Hunter's plan isn't just a to-do list. Salesforce describes it as including the tasks, the schedule, and the "guardrails governing when it checks in for human approval." The rep reviews and approves the plan before activation, so the plan itself is the scope of authorization:

- **Within the plan**: it follows the plan, and customer-facing actions follow the company's approval settings.
- **Departing from the plan**: it asks first. The example is explicit: "Since this deviates from the original user-approved plan, the agent will prompt the user for approval before sending the new email."
- **Learning from the departure**: it suggests plan updates, such as what to do with future out-of-office replies, which you approve before they're adopted.

The upside is that you don't have to anticipate every situation in advance. You approve a plan, and anything outside it comes back to you. The cost is that the vaguer the plan, the vaguer what counts as a "departure."

## What Agentforce Coworker is

Hunter isn't a standalone product. The [product page FAQ](https://www.salesforce.com/sales/ai-sales-agent/outbound/) says Hunter is a sales-specific harness built into Agentforce Coworker: Coworker provides the connected, governed environment where work happens, and Hunter adds sales context, guidance and specialized skills.

[Agentforce Coworker](https://www.salesforce.com/news/stories/agentforce-coworker-surpasses-185k-users/) is Salesforce's AI teammate. Employees start with the job they need done, and Coworker plans the steps, coordinates the right Agentforce agents and workflows, and brings back results and recommended actions for review. Salesforce says it passed 185,000 users in early November, up 21 times in three months (company-reported).

Hunter also shows up in Slack, Microsoft Teams and Claude, with the same goals, customer context and guardrails as inside Salesforce.

On permissions, the FAQ says Hunter operates within the permissions, business rules and approval settings a company configures in Salesforce. Customer-facing actions, such as sending outreach or a proposal, can require rep approval before they execute, and every action is logged. Salesforce also has Agent Script, an open-source language that mixes model reasoning with deterministic rules so certain decisions follow fixed logic.

## Is it generally available?

The signals currently conflict:

- The [September 11 announcement](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/) lists Hunter as "Pilot now; GA November '26," and in mid-November it still read that way.
- The [Sales Cloud release page](https://www.salesforce.com/sales/latest-release/) says Hunter is "available GA starting this fall in Coworker." It offers prospecting skills: researching accounts, surfacing prospects, drafting outreach and building cadences for reps to review and send.

If your company is evaluating it, ask Salesforce directly which features are generally available, whether they run on the long-horizon runtime, and which editions and licenses are required. Salesforce hasn't published the required editions, or the regions and languages Hunter supports.

## The evidence so far

[PPC Land's analysis](https://ppc.land/salesforce-agents-gain-a-runtime-that-pursues-goals-over-weeks-not-chats/) points to several gaps:

- The announcement doesn't say how guardrails are configured, how approval thresholds are set, or what happens when a long-running plan conflicts with a change in the underlying record.
- Salesforce hasn't published long-horizon performance: no error rate, no intervention rate, no figure for how often plans are abandoned or corrected.
- Salesforce's own research offers a comparison: its CRMArena-Pro benchmark, published in June 2025, found leading model agents succeeded on 58% of single-turn business tasks and 35% of multi-turn ones. That measured tasks within a conversation; stretching the horizon to weeks multiplies the turns, tool calls and state changes in between.
- The customer figures in the announcement, such as one customer building 60% of its pipeline with Hunter, are vendor-supplied, with no denominators or measurement windows.

The bounced-email example is a vendor demonstration, not a published reliability test.

## Writing guardrails for a multi-week goal

Hunter drafts its own plan and guardrails, but before you approve one you should know what you want. Use this approach to write "which departures need approval" for a multi-week goal:

**1. Write the goal in measurable form first**: Hunter does this itself ("re-engage $340k by quarter-end"); your job is to check it got it right. The number, deadline and scope are the baseline you're approving.

**2. List what it may do on its own within the plan**:

- Research accounts and compile engagement history
- Draft outreach
- Update notes on opportunities it owns

**3. List the departures that must come back to you**, thinking in four directions:

| Direction | Example | Why ask first |
|---|---|---|
| Different person | The original contact left or is on leave, so it contacts someone else | You may have history with that person, or there's internal politics at the account |
| Different channel | Switching from email to a call or WhatsApp | Some customers only accept certain channels |
| Different terms | Offering a discount, extending a trial, changing contract terms | Involves money and company policy |
| Different scope | New accounts off the list, products not in the plan | May overlap with another rep's accounts |

**4. Name the signals to stop on**: a customer explicitly asks not to be contacted, starts complaining, or the same person ignores two messages in a row. In those cases it shouldn't look for an alternative; it should report back.

**5. Review regularly**: once a week, compare the plan with what actually happened. Don't let it auto-apply the plan changes it learns from departures until you've agreed to them.

## Who it suits, and who it doesn't

**Suits you if:**
- You're a sales team already on Salesforce with a solid customer history: Hunter learns how you sell from that data.
- You have sales goals spanning weeks: rescuing stalled deals, building new pipeline, a quarter-end push.
- You want a plan you can review and approve before the agent acts.

**Doesn't suit you if:**
- Your team doesn't use Salesforce as its CRM.
- You need it live now: general availability is still unclear.
- Your organization needs public reliability data before adopting: there isn't any yet.

For Taiwan, Salesforce hasn't published which regions and languages Hunter supports.

Next, OpenClaw Enterprise takes a different angle: not one vendor's own enterprise agent, but a cross-vendor platform for managing agents in one place.

## References

- [Your Agent Can Sprint, But Can It Go the Distance?](https://www.salesforce.com/blog/long-horizon-agents/) (Salesforce, 2026-09-16)
- [Salesforce Expands Agentforce With a New Portfolio of AI Agents Built for High-Value Work](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/) (Salesforce, 2026-09-11)
- [Meet Hunter, Your New Sales Agent](https://www.salesforce.com/sales/ai-sales-agent/outbound/) (Salesforce)
- [Sales Cloud Product Releases](https://www.salesforce.com/sales/latest-release/) (Salesforce)
- [Agentforce Coworker Surpasses 185,000 Users](https://www.salesforce.com/news/stories/agentforce-coworker-surpasses-185k-users/) (Salesforce, 2026-11-04)
- [Salesforce agents gain a runtime that pursues goals over weeks, not chats](https://ppc.land/salesforce-agents-gain-a-runtime-that-pursues-goals-over-weeks-not-chats/) (PPC Land, 2026-09-12)
