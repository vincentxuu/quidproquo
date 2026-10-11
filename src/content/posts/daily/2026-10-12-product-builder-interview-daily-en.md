---
title: "Product Builder Interview Drill — 2026-10-12: Product Sense"
date: 2026-10-12
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: en
description: "Practicing a Product Sense trap question — 'a high-frequency, high-spend segment isn't automatically underserved' — using a user-problem framework paired with a Reach × Underserved Degree matrix on an Instacart scenario, plus the full story of Airbnb Categories, from 56 niche lodging themes in 2022 to being retired in 2025."
tldr: "The easiest trap in a Product Sense interview is seeing a user segment with great-looking numbers and immediately jumping to 'what should we build for them,' without first asking whether that segment is well-served or just stuck with no better option. Today's practice question: Instacart data shows that subscriber households aged 35-44 with kids order more frequently and spend more per order than other segments, but the app has no interface built specifically for them. The answer runs on a user-problem framework (current state → pain point → root cause → opportunity) that separates 'high frequency and high spend' from 'needs are actually met,' then uses a Reach × Underserved Degree matrix to judge where this segment really sits on the priority list — so a segment that already looks strong doesn't get mistaken for one with a big open opportunity. The case study is Airbnb Categories: in 2022, Airbnb rebuilt its homepage search around 56 niche lodging themes — treehouses, castles, private islands — using ML plus human review to sort four million of its six million listings into them, successfully surfacing demand nobody knew to search for. But after Airbnb expanded into Homes, Experiences, and Services as three separate product lines starting in 2023, Category search's single-product assumption stopped holding, and Airbnb retired it in September 2025, reverting to a traditional search box plus three tabs."
series:
  name: "Product Builder Interview Daily"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-12-product-builder-interview-daily)

## Today's Focus

One of interviewers' favorite Product Sense traps is handing you a segment with great-looking numbers — usage frequency, order value, or retention well above average — and asking "as the PM, what would you do?" Most candidates start brainstorming new features immediately, without stopping to ask the more fundamental question: do these numbers look good because the segment's needs are already met, or because they simply have no better option?

This matters because in real product work, resources should go where there's an actual gap — not where things already look fine and safe. Interviewers aren't grading whether you can spot a segment with nice numbers. They're grading whether you can tell the difference between "this segment is doing well" and "this segment still has unmet opportunity," because those are two entirely different things.

## Framework Cheat Sheet

### User-Problem Framework (Current State → Pain Point → Root Cause → Opportunity)

When a question hands you a segment with standout numbers, run it through four steps to pull the discussion back from "the numbers look good" to "what does this segment actually lack":

| Step | The question to answer | The common mistake |
|------|------------------------|---------------------|
| **Current state** | What's this segment's actual behavior pattern? How exactly is this metric defined and measured? | Accepting the number as given, without asking how it was scoped |
| **Pain point** | Where in the product experience is this segment still doing manual work, spending effort, or hesitating? | Treating "the number looks good" as "there's no pain point" |
| **Root cause** | Why does this behavior pattern exist — because the need is genuinely met, or because they're staying due to a lack of alternatives? | Skipping root-cause analysis and assuming "good numbers mean this is replicable elsewhere" |
| **Opportunity** | If the root cause holds, what concrete product direction improves this segment further, or lets this pattern get replicated elsewhere? | Proposing a solution that doesn't actually map back to the root cause you found |

**How to use it live**: "root cause" is the step candidates skip most often, jumping straight from "current state" to "opportunity." That's exactly where the gap between candidates shows up — whether you stop to ask whether good-looking numbers mean satisfaction or lock-in.

### Segment Selection Matrix: Reach × Underserved Degree

Once you've picked a candidate segment, don't just look at how many people are in it — place it in a simple 2×2 matrix to judge priority:

| | Low Underserved Degree (need already met) | High Underserved Degree (clear gap remains) |
|---|---|---|
| **High Reach** (large segment) | Maintain the status quo; avoid overinvesting just because it "looks like an opportunity" | The most worthwhile quadrant to invest in — large and clearly underserved |
| **Low Reach** (small segment) | Usually not worth a standalone initiative | A possible future acquisition channel, but validate whether it can actually scale first |

**How to use it live**: in today's practice question, the "high frequency, high spend" segment makes it tempting to drop it straight into "worth investing in." This matrix forces you to first answer whether that segment's Underserved Degree is actually high or low, instead of concluding from Reach alone.

## Today's Practice Question

### The Question

"You're the PM at Instacart. Internal data shows that subscriber households aged 35-44 with kids have the strongest brand associations with 'feeding the family on a busy weekend' and 'skip the grocery store,' and also order more frequently and spend more per order than other segments — but the app has no interface or flow built specifically for them. As the PM, what would you do?"

(Source: adapted from real Instacart user-segment data, as reported in Morning Consult's brand-strategy report "Why Instacart Wins Grocery Delivery — but Struggles in Meal Moments")

### How to Break It Down

1. **Clarify the problem**: Ask the interviewer how the "35-44, households with kids" label was actually derived — self-reported survey data, inferred from order contents, or third-party data? Is the business goal to push this segment's order frequency even higher, or to use their behavior pattern to acquire more similar new customers?
2. **Describe the current state**: This segment's behavior is already "high frequency, high spend, strong brand recall" — using the first step of the user-problem framework, acknowledge this is already a strong-performing segment rather than rushing to find a problem.
3. **Check the root cause before jumping to conclusions**: Ask whether they order frequently and spend a lot because Instacart genuinely solves their core pain point, or because restocking groceries is inherently a repeat need and they simply have no better alternative. If it's the latter, this segment's Underserved Degree is actually low — they're not a "big opportunity" segment, they're a "doing fine, don't break it" segment.
4. **Use the matrix to judge priority**: Place this segment in the Reach × Underserved Degree matrix — high Reach (subscriber households are Instacart's core user base), but likely low Underserved Degree (core need already met). That points toward a strategy of "reinforce and reduce friction" rather than "redesign aggressively to chase a new opportunity," while reserving some resources to look for segments that are actually in the high-Underserved-Degree quadrant.
5. **Propose a solution and define success**: Focus on "reducing the weekly effort of repeat decisions" — for example, a restocking list that auto-suggests quantities based on household size, or converting order history into a one-tap repeat-purchase module — rather than inventing an entirely new "family-only" feature. Measure success by whether the repeat-purchase list's usage rate goes up and the average number of steps from order to checkout goes down, while watching complaint and return rates to make sure automated suggestions aren't creating waste.

### Sample Answer (how to actually say it in an interview)

> **Clarifying the problem and framing**: "I'd first confirm how this '35-44, households with kids' label was actually derived, and what the business goal behind this question is — pushing this segment's order frequency even higher, or using their behavior pattern to acquire more similar new customers — because those two goals point to very different solutions."
>
> **Root-cause analysis and priority judgment**: "Next, instead of jumping straight to new features, I'd ask: do they order frequently and spend a lot because Instacart genuinely solves their core pain point, or because restocking groceries is inherently repetitive and they simply have no better alternative? If it's the latter, their Underserved Degree is actually low — in the Reach × Underserved matrix, that's the 'large segment, no clear gap' quadrant. The right move there is to reinforce the existing experience and reduce friction, not redesign aggressively."
>
> **Proposing a solution and defining success**: "So I'd focus on 'reducing the weekly effort of repeat decisions' — auto-suggesting restock quantities based on household size, or turning past orders into a one-tap repeat purchase. I'd measure success by whether the repeat-purchase list's usage rate rises and the average number of steps from order to checkout drops, while closely watching complaint and return rates — if the auto-suggested quantities are often wrong, this segment ends up feeling annoyed rather than served."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checkpoint | Covered? |
|------------|----------|
| Asked about the segment label's data definition and the business goal, instead of taking it at face value | |
| Separated "the current numbers look good" from "the need is actually met" | |
| Used the Reach × Underserved Degree matrix to judge this segment's real priority | |
| Mapped the proposed solution back to the root-cause conclusion, instead of inventing a feature on gut feel | |
| Defined the specific metric to watch after launch, and what a failure signal would look like | |
| Bonus: distinguished how a "reinforcement" play and an "expansion" play should be resourced differently | |

## Today's Case Study

**Airbnb Categories: making niche lodging demand visible, then retiring it as the product expanded**

In May 2022, Airbnb rebuilt its homepage search around Categories — adding 56 lodging themes, from A-frame cabins and castles to private islands, treehouses, and even a "bowling alley" category, letting users browse by "what kind of place I want to stay in" instead of starting with a destination. Airbnb used machine learning plus human review to sort four million of its six million listings into these themes. The logic behind this decision maps directly onto the Reach × Underserved Degree matrix's "Reach looks fragmented, but Underserved Degree is high" quadrant — the number of people who specifically want a treehouse or a castle looks small on its own, but this kind of "I didn't know I wanted this until it was shown to me" demand was completely unaddressed by a traditional destination-first search box. Starting in 2023, Airbnb expanded into Homes, Experiences, and Services as three separate product lines, and Category search's underlying assumption — a single product with a single entry point — stopped holding. In September 2025, Airbnb formally retired the Category homepage, reverting to a traditional search box plus three category tabs.

**Interview angle**: this case supports two different arguments at once — how to judge whether a segment is worth investing in, and why a segment strategy isn't a one-time decision. For any question about whether a segment is worth pursuing, you can cite Airbnb's underlying logic — first check whether this group's needs are actually unmet by existing options. For "how do you know the solution worked" questions, you can add: segment-driven designs need to be revisited as the company's stage changes, not treated as a build-once, works-forever decision.

## Further Reading

- [The Definitive Guide to Mastering Product Sense Interviews](https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering) — Lenny's Newsletter's full Product Sense interview methodology; the original source for today's Segment Selection Matrix
- [Airbnb is rolling out a new design to encourage travel discovery](https://thenextweb.com/news/airbnb-redesign-travel-discovery-brian-chesky-interview) — reporting from Airbnb Categories' 2022 launch, with listing-categorization numbers
- [Airbnb's Categories Were Meant to Reinvent the Search Box — Now They're Gone](https://skift.com/2025/09/25/airbnbs-categories-were-meant-to-reinvent-the-search-box-now-theyre-gone/) — the full context behind Categories being retired in 2025

## References

- [Why Instacart Wins Grocery Delivery — but Struggles in Meal Moments](https://morningconsult.com/articles/instacart-grocery-essentials-strategy) — source of the family-segment order-frequency and brand-association data used in today's practice question
- [The Definitive Guide to Mastering Product Sense Interviews](https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering) — source of the methodology behind the Reach × Underserved Degree matrix in the Framework Cheat Sheet
- [Airbnb is rolling out a new design to encourage travel discovery](https://thenextweb.com/news/airbnb-redesign-travel-discovery-brian-chesky-interview) — listing-categorization numbers referenced in today's case study, for Categories' 2022 launch
- [Airbnb's Categories Were Meant to Reinvent the Search Box — Now They're Gone](https://skift.com/2025/09/25/airbnbs-categories-were-meant-to-reinvent-the-search-box-now-theyre-gone/) — full context referenced in today's case study, for Categories being retired in 2025
