---
title: "Product Builder Interview Daily — 2026-11-18: Strategy & Execution"
date: 2026-11-18
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Strategy & Execution practice: use Bezos's one-way-door/two-way-door framework to judge whether a sunset decision can be undone, then work through a real Google Cloud retirement question — committing to a specific product instead of reciting a list of generic reasons."
tldr: "Today's core move is asking whether a sunset decision is a one-way or two-way door before anything else, then narrowing to one specific product with five criteria — strategic fit, overlap, usage trend, maintenance cost, and customer harm. The practice question is a Google Cloud retirement case, and today's example is how Google Cloud IoT Core was announced in 2022 and actually shut down in 2023."
series:
  name: "Product Builder 面試日練"
  order: 91
---

> 🌏 [中文版](/posts/daily/2026-11-18-product-builder-interview-daily)

## Today's Focus

When a Strategy interview asks "which product would you kill," most candidates default to reciting a list of generic reasons — low usage, high maintenance cost, overlap with another product. It sounds reasonable, but the interviewer isn't grading a checklist. They're grading whether you name one specific product and explain why it's that one and not the three other candidates that look equally cuttable. Today we close that gap two ways: Bezos's one-way-door/two-way-door framework for judging whether a decision can be undone, and a real Google Cloud retirement question for practicing how to commit to a name and defend why the other candidates survive.

## Framework Cheat Sheet

### Framework One: One-Way Doors vs. Two-Way Doors

In Amazon's 2015 letter to shareholders, Jeff Bezos split decisions into two types, and the type determines how much time and how many people a decision deserves:

| Type | Definition | How to decide | Where it shows up in a sunset call |
|---|---|---|---|
| **Type 1 (one-way door)** | Can't be undone, or undoing it is extremely costly | Slow down, gather enough data, and loop in senior people | Fully shutting down a service, deleting data, breaking existing customer integrations |
| **Type 2 (two-way door)** | Reversible, low cost if wrong | Decide fast, delegate to an individual or small team, don't wait for consensus | Freezing new signups, pulling marketing spend, moving a feature to maintenance mode |

Bezos's letter specifically warns that most organizations' real problem isn't rushing one-way-door decisions — it's dragging out two-way-door ones as if they were one-way doors. Sunset decisions get stuck here all the time: a team treats "freeze new signups and watch for three months" — something genuinely reversible — as if it carried the same weight as "shut the whole thing down," and routes it through the same approval chain. The thing that should move fast ends up moving slow too.

### Framework Two: Five Sunset Criteria

What the interviewer actually wants to hear is whether you have a consistent set of criteria you'd apply to any candidate product — not reasons improvised for this one question:

| Criterion | The question to ask | Common misjudgment |
|---|---|---|
| **Strategic fit** | Is this product still pulling in the direction the company is actually heading, or serving a bet that's already been abandoned | Substituting "is anyone still using it" for "is this direction still the right one" |
| **Overlap** | Does another product in the portfolio already cover the same use case | Judging overlap by surface-level feature similarity instead of checking whether the underlying customer base and pricing actually collide |
| **Usage trend** | Is usage, activation, or renewal rate rising, flat, or falling | Looking at one quarter's number instead of whether the trend has been falling for several consecutive periods |
| **Maintenance cost** | How much engineering, support, and compliance effort does keeping this alive actually require | Underestimating that "staying the same" also carries an ongoing opportunity cost |
| **Customer harm** | Which customers bear migration cost from the sunset, and do they have an alternative path | Only counting the cost at the moment of sunset, not the long-term trust cost to the whole portfolio |

All five have to be applied together — that's what lets you answer "why not one of the other candidates," the single most common follow-up interviewers ask.

```diagram
title: How sunset candidates converge to one name
desc: Starting from the full Google Cloud portfolio, strategic fit and overlap screen out candidates that obviously shouldn't be cut, usage trend and maintenance cost filter the rest, and the process ends by committing to one specific product with a stated reason the other candidates survived.
caption: Illustrative: layer width represents the direction of convergence, not an actual candidate count.
---
<svg viewBox="0 0 640 460">
  <path class="dg-axis" d="M24 40V440" marker-end="url(#arrow)"/>
  <text class="dg-small" x="18" y="18" dominant-baseline="central">fewer candidates going down</text>

  <polygon class="dg-box" points="40,32 600,32 552,132 88,132"/>
  <polygon class="dg-box" points="88,136 552,136 504,236 136,236"/>
  <polygon class="dg-box" points="136,240 504,240 456,340 184,340"/>
  <polygon class="dg-box dg-box--accent" points="184,344 456,344 408,444 232,444"/>

  <text class="dg-label" x="320" y="72" text-anchor="middle" dominant-baseline="central">Full portfolio</text>
  <text class="dg-sub" x="320" y="92" text-anchor="middle" dominant-baseline="central">every candidate, including obvious cuts</text>

  <text class="dg-label" x="320" y="176" text-anchor="middle" dominant-baseline="central">Strategic fit + overlap</text>
  <text class="dg-sub" x="320" y="196" text-anchor="middle" dominant-baseline="central">drop candidates that look cuttable but shouldn't be</text>

  <text class="dg-label" x="320" y="280" text-anchor="middle" dominant-baseline="central">Usage trend + maintenance cost</text>
  <text class="dg-sub" x="320" y="300" text-anchor="middle" dominant-baseline="central">drop candidates the data doesn't support</text>

  <text class="dg-label dg-text--accent" x="320" y="384" text-anchor="middle" dominant-baseline="central">One committed product</text>
  <text class="dg-sub" x="320" y="404" text-anchor="middle" dominant-baseline="central">state why the others were kept</text>
</svg>
```

## Today's Practice Question

### The Question

"Imagine you're a product manager at Google Cloud. Choose one product in the Google Cloud portfolio that you would retire, and make the case for retiring it rather than continuing to invest in it. An answer that only lists general reasons products get shut down, without committing to a specific product, does not answer the question."

(Source: an original practice question from PracHub, framed as a Google Cloud PM scenario — not a verified real employer question)

### How to Break It Down

1. **Clarify what "retire" means and your role**: confirm with the interviewer whether "retire" means freezing new signups, fully shutting the service down, or folding it into another product — the three differ by an order of magnitude in blast radius. Also confirm whether you own this product or are advising on the whole portfolio's direction; your role changes what evidence and decision authority you can draw on.
2. **Run the five sunset criteria across the whole portfolio**: strategic fit, overlap, usage trend, maintenance cost, customer harm — applied one by one to narrow down to three to five "looks cuttable" candidates, instead of picking by gut feel the one that "sounds like nobody uses it."
3. **Decide whether this is a one-way or two-way door**: fully shutting down a service is almost always a one-way door — customer integrations break, data gets deleted, and there's usually no going back. That means it needs more evidence before you commit than a two-way-door move like "freeze new signups and watch the usage trend." This step decides how much of your answer should be spent on risk and reversibility.
4. **Commit to one specific product, and explain why the other candidates survive**: name one product, score it against the five criteria, then name one or two equally-cuttable-looking candidates and explain why they were kept — usually because a small group of high-value customers depends heavily on them, or because their strategic fit is actually higher than the surface usage numbers suggest.
5. **Plan the customer migration path and define the metric to check a year out**: how much notice enterprise customers need, what the migration path and support window look like. What to track after the sunset isn't just maintenance cost saved — it's whether existing customers' renewal rate and trust score drop because of this decision. That's the real test of whether the sunset call was right.

### Sample Answer (how you'd actually say this in an interview)

> **Define the scope before applying criteria**: "I'd first confirm with the interviewer that 'retire' here means fully shutting the service down, not merging or rebranding it — that sets the risk level for everything I say next. Once that's settled, I'd run strategic fit, overlap, usage trend, maintenance cost, and customer harm across every peripheral product in the portfolio that's loosely coupled to core infrastructure, and narrow that down to a handful of candidates that all look cuttable."
>
> **Commit to a name, and explain why it's not the others**: "I'd pick the product whose usage trend has been falling for several consecutive periods, and where specialized third-party vendors already serve the same use case well — because that means retiring it isn't abandoning customers halfway, it's pointing them to an option that was already more specialized to begin with. I'd keep two other equally-low-usage candidates: one because a small number of large enterprise customers treat it as their only integration path, making a hard sunset too costly to trust; the other because its usage is low but its strategic fit is actually high — it's an early bet on the direction the company is heading, and shouldn't be judged by today's usage number alone."
>
> **State that this is a one-way door, so it needs a reversibility plan**: "Because fully shutting down a service is almost impossible to undo, I'd first check whether it can be turned into a two-way door instead — for example, freezing new signups for three months and watching how existing customers and their migrations respond before deciding whether to fully shut it down. If a hard shutdown is unavoidable, I'd give enterprise customers at least twelve months' notice and a clear migration path. A year out, what I'd check isn't how much maintenance cost was saved — it's whether that customer segment's renewal rate and NPS dropped because of this sunset. If they did, that tells me the execution was flawed, not that the decision to retire was wrong."

### Self-Check

Use this table to check whether your answer covered the key points:

| Checkpoint | Covered? |
|---------|---------|
| Clarified what "retire" means and your own role before anything else | |
| Applied the same five criteria (strategic fit / overlap / usage trend / maintenance cost / customer harm) instead of improvised reasons | |
| Committed to one specific product instead of just listing generic reasons products get retired | |
| Explained why the other cuttable-looking candidates were kept | |
| Judged whether this is a one-way or two-way door and adjusted the evidence bar accordingly | |
| Bonus: named the customer migration path and the metric to check a year later | |

## Today's Case

**Google Cloud IoT Core: shut down a full twelve months after the announcement — and still called a "sudden unplugging"**

Google Cloud announced in August 2022 that IoT Core would be retired on August 16, 2023. After that date, devices could no longer connect over the MQTT or HTTP bridges, and existing connections were cut. Google's stated reason was that customer needs could be better served by its network of partners that specialize in IoT applications and services — a strategic-fit judgment, not a usage or cost problem. Google decided it shouldn't be the one directly running this layer, not that the business had stopped being profitable. Even with a full twelve months of advance notice, tech press covering the shutdown still described it as a "sudden unplugging," showing that a reasonable notice period alone doesn't guarantee customers or the media will read the decision as well communicated.

**Interview angle**: use this case to answer the follow-up "how do you keep customers from reading this sunset as a sign that other products are at risk too?" IoT Core's story shows that notice length alone isn't enough: twelve months of advance notice is already an industry-standard length, and it still got labeled "sudden," because the announcement only said "we've decided to retire this" without also saying "here's what use cases we evaluated, and here's which ecosystem partner you should move to." Applied to today's practice question: a sunset announcement that's just "this product is shutting down" plus a date costs far more trust than one that pairs the date with a migration path and a named alternative.

## Further Reading

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — PracHub's collection of portfolio-strategy interview questions; today's practice question is adapted from one of its Google Cloud retirement questions.
- [One-Way and Two-Way Doors: What Bezos Actually Said](https://rcmlabs.io/blog/one-way-door-two-way-door-type-1-type-2-decisions/) — a full reconstruction of the original context of Bezos's one-way-door/two-way-door framework from the 2015 shareholder letter, and how it's commonly misapplied.
- [Google is killing off Google Cloud IoT Core at five-years-old](https://www.thestack.technology/google-cloud-iot-core-retired-killed-by-google/) — the original reporting on today's case, with Google's official retirement rationale in full.

## References

- [Google: Choose one Google Cloud product to retire and justify the decision](https://prachub.com/interview-questions/choose-one-google-cloud-product-to-retire-and-justify-the-decision) — source of today's practice question, with the clarifying questions and strong-answer criteria that the breakdown steps are drawn from.
- [One-Way and Two-Way Doors: What Bezos Actually Said](https://rcmlabs.io/blog/one-way-door-two-way-door-type-1-type-2-decisions/) — source of Framework One (one-way-door/two-way-door decisions).
- [Google Cloud to retire IoT Core service in 2023](https://www.itpro.com/network-internet/internet-of-things-iot/368845/google-cloud-to-retire-iot-core-service-in-2023) — source of Google's official retirement rationale quoted in today's case.
- [Google is killing off Google Cloud IoT Core at five-years-old](https://www.thestack.technology/google-cloud-iot-core-retired-killed-by-google/) — source of the "sudden unplugging" media framing, and the full announcement-to-shutdown timeline.
