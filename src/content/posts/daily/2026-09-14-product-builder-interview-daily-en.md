---
title: "Product Builder Interview Daily — 2026-09-14: Product Sense"
date: 2026-09-14
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: en
description: "Today's Product Sense practice: use the CIRCLES framework to work through a real Google PM interview question — \"You're the PM for Waymo, design a new feature\" — with a case study of how Slack grew out of the internal tool built for a failed game called Glitch."
tldr: "The most common way to fumble a Product Sense question isn't running out of feature ideas — it's skipping past \"who is this user and what are they actually stuck on\" and jumping straight to a feature list. Today we use the CIRCLES framework on a real Google PM interview question — \"You're the PM for Waymo, design a new feature\" — with the focus on the Comprehend and Identify steps: asking the right questions before proposing anything. The case study is how Slack grew out of an internal tool the team couldn't live without while building a failed game called Glitch — a demonstration that watching what users actually keep using beats asking them what they want."
series:
  name: "Product Builder 面試日練"
  order: 26
---

> 🌏 [中文版](/posts/daily/2026-09-14-product-builder-interview-daily)

## Today's Topic

A Product Sense question isn't testing whether you can dream up a clever feature — it's testing whether you've first figured out whose problem, exactly, you're solving. Most candidates hear "design a new feature for X" and immediately start brainstorming a feature list, then freeze when the interviewer interrupts with "which user's pain point is this solving?" That's the most common way this round goes sideways, and it usually happens in the first five minutes.

There's a new wrinkle in 2026: more interviewers now follow up with "if this feature were handed off to an AI to execute, how would you design the trust boundary" — even when the prompt never mentions AI. Today's practice question deliberately picks a physical-world service (self-driving cars) so you can practice staying focused on observing user behavior instead of jumping straight to technical feasibility.

## Core Framework Cheat Sheet

### CIRCLES: turning an open-ended prompt into seven controllable steps

This is the standard skeleton for Product Sense questions. The point isn't memorizing seven letters — it's forcing yourself to spend real time on the first two steps before you start listing features:

| Step | What it covers | What to actually do |
|------|------|---------|
| **C**omprehend | Clarify the situation | Pin down scope: which platform, which market, what "success" means |
| **I**dentify | Define the customer | List possible user segments, pick the one worth going deep on |
| **R**eport | Surface the needs | Name the specific pain point for that segment, and why existing alternatives fall short |
| **C**ut through | Converge priorities | Pick the one pain point most worth solving, and say why it beats the others |
| **L**ist solutions | List solutions | Propose 2-3 directionally different solutions for the converged pain point |
| **E**valuate | Weigh trade-offs | Cost, risk, and how each solution compares to the others |
| **S**ummarize | Recommend | Converge on one recommendation, with a clear metric for success |

Most candidates treat Comprehend and Identify as throat-clearing and blow through them in two sentences. In practice, these two steps should take up more than a third of your total answer time, because the quality of everything that follows depends on picking the right user and the right problem here.

## Today's Practice Question

### The Question

"You're the PM for Waymo, Google's self-driving ride-hailing service. Design a new feature."

(Source: a candidate-reported real question from Aced's, formerly Exponent's, Google Product Manager (PM) Interview Guide. Question type: Product Sense / Product Design.)

### How to Break It Down

1. **Clarify the problem**: Ask the interviewer first — is this feature meant to solve a problem for existing Waymo riders, or to pull in new users who've never tried a self-driving car? Is this for an established market like Phoenix or San Francisco, or a newly launched city?
2. **Define the user**: Split "Waymo riders" into at least three segments — solo commuters, families riding with kids or older relatives, and late-night riders (who have an unusually high need for a sense of safety). Pick one — say, late-night riders, because a self-driving car removes the human driver, and that "someone is with me" psychological safety net is a pain point unique to self-driving, not something you can just copy over from a regular taxi.
3. **Structure the analysis**: Using the Report step, get specific about the late-night rider's pain points — no driver to confirm "the car is actually going the right way," no one to react if a stranger approaches the car window mid-ride, hesitation about getting out if the drop-off point is a dark alley. These pain points are specific to the self-driving context, not something you solve by porting over taxi features.
4. **Propose solutions**: List 2-3 directionally different solutions — live video support (strong reassurance, high labor cost), an AI voice assistant that proactively narrates the route and time remaining (cheap, but weaker on psychological safety), or letting riders nudge the drop-off point toward a better-lit spot via the app (technically feasible, but requires re-planning curb access). Weigh cost, strength of the safety benefit, and engineering complexity, then pick a recommendation.
5. **Define success**: Name the metrics that would validate this feature — late-night satisfaction scores, late-night repeat ride rate, or whether emergency-button triggers drop — rather than a vague, unmeasurable claim like "riders will feel safer."

### Sample Answer (how to actually say this in an interview)

> **Converge on the user before listing features**: "Before I start brainstorming features, I'd want to check one thing first — how does Waymo's order volume and satisfaction score during late-night hours, say 11pm to 5am, compare to daytime? If late-night drop-off is meaningfully worse, I'd focus on that segment, because self-driving has a structural disadvantage at night that a regular taxi doesn't have — without a driver, riders lose that sense of 'someone is watching out for me.'"
>
> **Name specific pain points, not vague unease**: "Digging in, I'd break that unease into three concrete situations: mid-ride, riders can't quickly confirm the route looks normal; when the car stops somewhere dark, riders hesitate to get out; and if a stranger approaches the window, there's no one on board who can react. Each of these maps to a different solution — you can't bundle them all into one 'safety feature.'"
>
> **Converge on one solution and define success**: "I'd prioritize a 'dynamic drop-off' feature first — riders can nudge their drop-off point toward a well-lit, higher-foot-traffic spot via the app before arrival. It doesn't require re-planning curb rights, the engineering cost is relatively low, and it directly answers the most common late-night complaint: 'the drop-off spot was too dark to get out.' After launch, I'd track late-night satisfaction scores, next-month repeat ride rate for that time slot, and whether emergency-button triggers go down, as the signal that this feature actually solved the problem."

### Self-Check List

Use this table to check whether your answer missed anything important:

| Check item | Covered? |
|---------|---------|
| Clarified scope (market, platform, definition of success) before jumping into solutions | |
| Split users into at least 2-3 segments and explained why you picked one | |
| Pain points are specific to this context, not generic adjectives | |
| Listed 2-3 directionally different solutions with trade-offs (cost, risk, complexity) | |
| Named a measurable success metric, not something unverifiable like "users will feel happier" | |
| Bonus: proactively said how you'd adjust if the data disproved your assumption | |

## Today's Case Study

**Slack: a failed video game grew into a $28 billion workplace communication tool**

Slack's predecessor, Tiny Speck, was originally building an online game called Glitch. The game never found a market and the team shut it down in 2012. But while building it, the team had cobbled together an internal chat and search tool to coordinate a distributed team. After killing the game, founder Stewart Butterfield noticed something: the team couldn't live without that internal tool's real-time search, channel organization, and third-party integrations — features they genuinely used every day and felt they couldn't do without, not something a survey had told them users wanted. The team redirected all their resources into polishing that internal tool, opened it up publicly in 2013, and it became Slack.

**Interview angle**: this case study is a strong illustration of the Identify and Report steps — Slack's team didn't ask "what communication tool do you want," they watched which part of a tool they already used every day they couldn't bear to lose. When you get the follow-up "how do you confirm this is a real need" on a Product Sense question, this is the logic to reach for: watching behavior — what users already use and won't give up — is a more reliable source of product insight than what users say they want.

## Further Reading

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — Aced's (formerly Exponent's) full walkthrough of the Google PM interview loop, including the full context behind the Waymo question
- [How Slack co-founder Stewart Butterfield turned a failed game into a $28B workplace platform](https://www.founded.com/how-slack-co-founder-stewart-butterfield-turned-a-failed-game-into-a-28b-workplace-platform/) — the full story of how Slack grew out of Glitch's internal tool
- [Feature Prioritization Matrix for Product Teams — still valid in 2026?](https://userpilot.com/blog/feature-prioritization-matrix/) — a 2026 rethink of RICE / Must-Should-Could style prioritization frameworks, useful for the "converge on solutions" step

## References

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — source for the Waymo question in "Today's Practice Question"
- [How Slack co-founder Stewart Butterfield turned a failed game into a $28B workplace platform](https://www.founded.com/how-slack-co-founder-stewart-butterfield-turned-a-failed-game-into-a-28b-workplace-platform/) — source for how Slack grew out of Glitch in "Today's Case Study"
- [Product manager interview questions that reveal judgment, not memorized frameworks](https://www.experthire.io/blog/question-bank-product-manager) — supports why Comprehend and Identify decide the quality of the whole answer, in "Core Framework Cheat Sheet"
