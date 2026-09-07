---
title: "Product Builder Interview Daily — 2026-09-08: Metrics & Analytics"
date: 2026-09-08
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: en
description: "Today's Metrics & Analytics practice: use a North Star Metric selection framework paired with a metric tree to work through a real Meta PM analytical thinking round prompt — \"define a north star metric for Instagram Reels\" — with a case study of how Netflix changed its north star metric three times."
tldr: "The most common way to fumble a Metrics question isn't failing to name a metric — it's naming one that sounds reasonable but you can't answer 'what does it mean when this goes up.' Today we use Lenny Rachitsky's six-category north star metric framework to narrow the candidates, then layer a metric tree on top to split the north star into output/input/guardrail, practicing the Meta PM analytical thinking prompt: 'define a north star metric for Instagram Reels, and explain the trade-off if resources tilt toward Reels at Stories' expense.' The case study is Netflix's three north star pivots — from next-day DVD delivery rate, to the share of members streaming 15+ minutes a month, to median viewing hours per month — showing how a metric should track the strategy stage."
series:
  name: "Product Builder 面試日練"
  order: 20
---

> 🌏 [中文版](/posts/daily/2026-09-08-product-builder-interview-daily)

## Today's Topic

The Metrics & Analytics round isn't testing whether you can recite AARRR or the definition of a north star metric — it's testing whether you can define a metric from scratch when the prompt gives you no options, and hold up under the follow-ups. Meta's analytical thinking round is the classic example: the interviewer gives an open-ended prompt like "define a north star metric for this product," then, once you're done, drops the real challenge — how you choose when two metrics pull against each other.

Most candidates get stuck right after picking a metric, unable to answer "what does the company actually gain when this number goes up." Today we use a north star metric selection framework to narrow the candidate pool, then use a metric tree to break "which metric" into "which levers sit underneath this metric," so the answer can survive follow-up questions.

## Core Frameworks

### North Star Metric selection framework: start by asking which category

Lenny Rachitsky surveyed employees at 40+ growth-stage companies and grouped north star metrics into six categories. Which one fits depends on the business model, not gut feel:

| Category | Representative companies | Fits |
|------|---------|------|
| Consumption growth | Airbnb (nights booked), Uber (rides) | Take-rate marketplaces where usage directly equals revenue |
| Engagement growth | Facebook, Snap (DAU) | Ad-driven, where traffic itself is the monetization source |
| Customer growth | Tinder (% paid accounts), Webflow | Subscription businesses where paid conversion matters more than engagement |
| Growth efficiency | Blue Apron, Casper (margin) | Physical goods or heavy marketing spend, where unit economics come first |
| User experience | Robinhood, Superhuman (NPS) | Products that win on experience differentiation |
| Revenue | Figma, Notion (ARR) | Mature, B2B sales-led businesses |

**Common mistake**: defaulting straight to revenue as the north star. Rachitsky points out revenue is too spiky (currency, pricing, contract cycles all interfere) and is uninspiring for teams — nobody joins a company to "make the revenue number go up."

### Metric tree: splitting the north star into Output / Input / Guardrail

A north star is rarely something a single team can move directly — it needs to be split into three layers to become actionable:

| Layer | Definition | Example (Airbnb's "nights booked") |
|------|------|------|
| Output (north star) | The company's overall success metric | Nights booked |
| Input (lever metrics) | Components each team can directly influence | Guest conversion rate, new listings added, site traffic |
| Guardrail | Prevents inputs from being over-optimized at the expense of the experience | Guest complaint rate, host cancellation rate |

When the interviewer asks "could this metric be gamed," the answer should come from the guardrail layer, not by re-explaining the north star itself.

## Today's Practice Question

### The Question

"Define a north star metric for Instagram Reels, and explain the trade-off if the company decides to prioritize resources toward Reels at the relative expense of Stories."

(Source: Aced (formerly Exponent), "Meta Product Manager (PM) Interview Guide" — a real prompt from Meta's analytical thinking round; question type: Analytical thinking round)

### How to Break It Down

1. **Clarify the scope**: First confirm what "resources" means — engineering resources, or homepage placement and exposure? Is the time frame a quarter or a year? Which company-level goal should the north star align to (user time spent, ad revenue, or the creator ecosystem)?
2. **List candidate metrics and categorize**: Applying the six-category framework, Reels fits "consumption growth" (closer to Twitch's UGC consumption model). Candidates include "time spent watching Reels per DAU," "Reels completion rate," and "number of creators publishing Reels."
3. **Use JTBD to reverse-engineer the north star**: Reels' job to be done is "scroll through short, entertaining video in spare moments," not "publish content." So a consumption-side metric (watch time) is closer to what users are actually trying to accomplish than a production-side metric (publish count) — pick "time spent watching Reels per DAU" as the north star.
4. **Name the trade-off**: Tilting homepage traffic and engineering resources toward Reels directly compresses Stories' exposure, and Stories' daily publish volume may drop. Because Reels is public distribution and Stories is private social sharing, they serve different jobs — it's not a simple zero-sum swap, so name specifically which use cases get sacrificed.
5. **Define success**: The primary metric is "time spent watching Reels per DAU"; guardrails are "Stories daily publish volume" and "total app time spent," to make sure Reels is creating new consumption rather than just pulling time users used to spend on Stories.

### Sample Answer (say it like this in the interview)

> **Clarifying the scope**: "I'd want to confirm scope first — I'll assume 'resources' here means homepage placement and recommendation-system engineering resources, over a quarter. I'd also want to ask: is the north star meant to align to user time spent, or ad revenue growth? I'll assume time spent for now, since Reels' current role looks more like holding user attention than direct monetization."
>
> **Choosing the metric**: "I'd put Reels in the consumption-growth category, close to Twitch's logic — the user's job is 'scroll through short, entertaining video in spare moments,' not 'publish content.' So I'd pick 'time spent watching Reels per DAU' as the north star rather than publish count or completion rate, because watch time is closest to what the user is actually trying to accomplish, and it's also the best predictor of retention."
>
> **Trade-off and guardrails**: "If we tilt homepage placement and recommendation-system resources toward Reels, Stories' exposure and publishing incentive get compressed, since both are competing for the same homepage real estate and user attention. That doesn't mean we shouldn't do it, but I'd set two guardrails: Stories' daily publish volume can't drop past a certain threshold, and total app time spent needs to keep growing steadily — not just Reels watch time going up — to confirm we're creating new consumption, not just moving time users used to spend on Stories."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|-----------------|----------|
| Used clarifying questions to narrow "resources," "time frame," and "alignment goal" | |
| The north star metric maps to a specific category in the six-category framework, not just a name tossed out | |
| Used JTBD or a user job to explain why this metric, not gut feel | |
| Clearly named the trade-off mechanism (why something gets sacrificed, and which use case) | |
| Success metric includes both a primary metric and a guardrail, not a single number | |
| Bonus: mentioned the risk of the metric being gamed via cannibalization | |

## Today's Case Study

**Netflix: the north star metric changed three times as the business model changed**

Netflix has changed its north star metric more times than most people can count. In the DVD-by-mail era, it watched the "next-day DVD delivery rate," because in that era the experience bottleneck was logistics reliability. Once it pivoted to streaming, that metric instantly lost meaning — streaming has no "waiting for delivery" step — so it switched to "share of members who streamed 15+ minutes of content in a month," using a deliberately low bar to first confirm members were actually using the streaming feature at all. Once the streaming business matured and most members had cleared that bar, the metric lost its discriminating power too, so Netflix switched again to "median viewing hours per month," shifting from measuring "did they use it" (binary) to measuring usage intensity.

**Interview connection**: This case is the best demonstration of "the metric should track the strategy stage" — use it directly to answer "how would you decide whether to change your north star metric" or "give an example of a company adjusting its core metric." The point isn't memorizing the three metric names — it's articulating the logic behind each switch: once an old metric loses discriminating power (most people already clear the bar, so it can no longer tell good from bad), that's the signal to consider changing it.

## Further Reading

- [Meta Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/meta-product-manager-interview) — a full breakdown of Meta's PM interview process, including real prompts and follow-up patterns from the analytical thinking round
- [Choosing Your North Star Metric](https://future.com/north-star-metrics) — Lenny Rachitsky's six-category north star metric framework and case studies, based on interviews with employees at 40+ growth-stage companies
- [What is a North Star metric?](https://mixpanel.com/blog/north-star-metric) — Mixpanel's illustrated explanation of the metric tree (output/input metric)

## References

- [Meta Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/meta-product-manager-interview) — source of "Today's Topic" and "Today's Practice Question"
- [Choosing Your North Star Metric](https://future.com/north-star-metrics) — corresponds to the six-category north star metric table in "Core Frameworks" and Netflix's metric changes in "Today's Case Study"
- [What is a North Star metric?](https://mixpanel.com/blog/north-star-metric) — corresponds to the Output/Input/Guardrail metric tree layering in "Core Frameworks"
