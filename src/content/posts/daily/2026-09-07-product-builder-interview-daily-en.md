---
title: "Product Builder Interview Daily — 2026-09-07: Product Sense"
date: 2026-09-07
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: en
description: "Today's Product Sense practice: use the CIRCLES framework paired with JTBD (Jobs-to-be-Done) to work through a real Google product manager interview prompt — \"design a product for airport travelers\" — with a case study of how Superhuman raised its product-market fit score from 22% to 58% with a four-question survey."
tldr: "The most common way to fumble a Product Sense question isn't running out of ideas — it's segmenting too broadly and getting stuck on vague statements like 'all travelers want a smoother experience.' Today we use CIRCLES to scope the question, then layer JTBD (Jobs-to-be-Done) on top so pain points get written as 'situation + motivation + what's missing from the current workaround,' practicing the 'design a product for airport travelers' prompt that shows up in Google's product sense screen. The case study is Rahul Vohra's four-question survey — 'how would you feel if you could no longer use this product?' — which took Superhuman's product-market fit score from 22% to 58%, demonstrating how concrete segmentation beats gut-feel guessing."
series:
  name: "Product Builder 面試日練"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-07-product-builder-interview-daily)

## Today's Topic

Google names its product sense round "product insight" for a reason: it's not testing whether you can come up with features, it's testing whether you can take an open-ended prompt and converge on a defensible direction within 45 minutes. Aced's (formerly Exponent) Google PM interview guide describes this round as "structured, consulting-influenced" — a clear framework and logical sequence matter more than freewheeling brainstorming.

Most candidates don't get stuck for lack of a framework — they get stuck because their segmentation stays too broad, stopping at something like "users want a smoother experience," which reads as a template rather than genuine understanding. Today we layer JTBD (Jobs-to-be-Done) on top of CIRCLES, forcing pain points into concrete situations instead of adjectives.

## Core Frameworks

### CIRCLES: the skeleton that holds the whole answer together

| Step | Content | Common mistake |
|------|---------|-----------------|
| **C**omprehend | Clarify the scope (product, platform, definition of success) | Diving in without clarifying the scope |
| **I**dentify customers | Split into 2-3 user segments | Segments too broad, overlapping each other |
| **R**eport needs | Name a concrete pain point for each segment | Pain points written as vague adjectives, no situation |
| **C**ut through prioritization | Pick one segment + pain point, set the rest aside | Reluctant to narrow, trying to cover everything |
| **L**ist solutions | List multiple solutions for the chosen pain point | Only one solution comes to mind, and the answer stops there |
| **E**valuate trade-offs | Compare benefit, cost, and risk across solutions | Only mentioning upside, never the cost |
| **S**ummarize | Converge to a single-sentence recommendation | Ending vaguely, without a clear stance |

### JTBD: turning "Report needs" into a concrete job

CIRCLES' "R" step is the easiest one to leave as an empty phrase. The Job Story format forces you to fill in a fixed structure:

| Element | Question | Example (airport traveler) |
|---------|----------|------|
| Situation | What specific moment does the user hit this problem? | 40 minutes left to connect, and still has to clear security |
| Motivation | What job is the user actually trying to get done? | Confirm whether they can make the next boarding gate in time |
| What the current workaround is missing | How do they solve it today, and why isn't that enough? | They check the airport screen for boarding time, but the screen never shows "how many minutes it takes to walk from here to the gate" |

Filling in these three cells means that when the interviewer asks "why this pain point," you can point straight back to a concrete situation instead of talking from a gut feeling.

## Today's Practice Question

### The Question

"Design a product for airport travelers."

(Source: Aced (formerly Exponent), "Google Product Manager (PM) Interview Guide" — a real prompt from Google's product sense screen; question type: Product sense round)

### How to Break It Down

1. **Clarify the scope**: First ask what's in scope — is this a brand-new product or a single feature? Which airport moment are we focusing on (domestic connection, international customs, or waiting at the gate)? How is success defined (satisfaction, or a concrete behavioral metric)?
2. **Define the user**: Don't stop at "airport travelers" — segment by behavior instead, for example: travelers with a tight connection worried about missing the next flight; travelers with kids or elderly companions who move slower and need more buffer time; frequent business travelers who know the process well but resent wasted waiting time.
3. **Write the job with JTBD**: For the chosen segment, write the pain point as situation + motivation + what the current workaround is missing. For a connecting traveler, the job is "figure out, with the time remaining, whether I can safely make the next gate." The current airport screen only shows the boarding time and gate number — it never tells you how long the walk plus the security line will actually take. That information gap is the real pain point.
4. **Propose a solution**: Design a solution around this job — for example, a countdown that combines airport-map positioning, live security-line length, and distance to the gate to compute "remaining buffer time" in real time. Also list at least one alternative (for example, having gate staff proactively page high-risk travelers) and state the trade-off.
5. **Define success**: The primary metric could be "share of connecting travelers who make their originally scheduled flight." A guardrail metric would be the number of complaints caused by travelers misjudging their time or missing a page, to avoid the algorithm overestimating walking time too optimistically.

### Sample Answer (say it like this in the interview)

> **Clarifying the scope and segmenting**: "I'd want to confirm scope first — I'll focus this on the connecting-flight scenario, not the trip from home to the airport. Within connecting travelers, I'd split into three groups: travelers with a tight connection worried about missing the next flight; travelers with kids or elderly companions who need more buffer time; and frequent business travelers who already know the process well. I'd focus on the first group first, since their pain point is the most urgent and the easiest to get overlooked by existing products."
>
> **Framing the job**: "Using Jobs-to-be-Done, this group's job isn't 'know the boarding time' — it's 'figure out, with the time I have left, whether I can safely make the next gate.' Right now the airport screen only shows boarding time and gate number; it never tells you how long it actually takes to walk there from where you are, plus wait through security. That information gap — not a lack of information, but information that hasn't been turned into something they can act on immediately — is where they're genuinely stuck."
>
> **Solution and trade-off**: "I'd propose a 'remaining buffer time' countdown that combines airport-map positioning, live security-line length, and distance to the gate — more directly actionable than just showing the boarding time. The cost is that it needs live queue data from the airport, and accuracy depends on the quality of that data source; overestimating the buffer would actually be more dangerous. My primary metric would be 'share of connecting travelers who make their originally scheduled flight,' with a guardrail on complaints caused by the system misjudging time. I'd pilot this at one or two major connecting hubs first and validate data accuracy before expanding."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|-----------------|----------|
| Used clarifying questions to narrow the scope (situation, metric, constraints) | |
| Segmentation is behavior-driven, not a generic "all travelers" | |
| Pain point written as "situation + motivation + what the current workaround is missing," not an adjective | |
| Solution explains "why this job," not just a feature list | |
| Success metric includes both a primary metric and a guardrail, not a single number | |
| Bonus: mentioned data-source limitations or the need for a pilot to validate | |

## Today's Case Study

**Superhuman: raising product-market fit from 22% to 58% with four survey questions**

In 2017, Superhuman founder Rahul Vohra faced a classic product sense problem: the team felt the product was solid, but had no number to back up "users genuinely can't live without it." He designed a four-question survey, with the core question being "how would you feel if you could no longer use this product?" — using the share of users who answered "very disappointed" as a baseline product-market-fit score. The first survey came back at 22%, well below the 40% threshold he'd set. Rather than rushing to add features, he segmented responses by role and use case, identified what the "very disappointed" segment specifically cared about, and directed resources there — deliberately slowing down efforts to please every other segment. This "survey, segment, analyze, improve" loop ran for four quarters, pushing the score from 22% all the way to 58%.

**Interview connection**: This case is an excellent demonstration of JTBD-style segmentation — rather than asking a vague "are users satisfied," Superhuman first split users into "very disappointed" versus "doesn't care," then dug deep only into the former group's specific job and situation. Use it to answer questions like "how would you validate that what you're building is what users actually want" or "give an example of using data to back up a product direction." The key point to emphasize is the sequence — segment first, then go deep on a single segment — rather than trying to satisfy everyone at once.

## Further Reading

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — the full structure and grading criteria for Google's product sense screen
- [Pinterest Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/pinterest-product-manager-interview) — a different product sense prompt logic: designing new features starting from a company's existing assets
- [Feature Prioritization Matrix for Product Teams - still valid in 2026?](https://userpilot.com/blog/feature-prioritization-matrix) — further reading on CIRCLES' "Cut through prioritization" step, on why prioritization matrices tend to go wrong

## References

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — source of "Today's Topic" and "Today's Practice Question"
- [Pinterest Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/pinterest-product-manager-interview) — corresponds to the alternate product sense prompt logic in "Further Reading"
- [The Ultimate Guide to Product Management Prioritization Frameworks](https://www.productplan.com/learn/product-management-frameworks) — corresponds to the CIRCLES table in "Core Frameworks"
- [Superhuman Product Market Fit Case Study](https://www.hustlebadger.com/what-do-product-teams-do/superhuman-product-market-fit-case-study) — corresponds to the four-question survey and score progression in "Today's Case Study"
