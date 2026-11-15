---
title: "Product Builder Interview Drill — 2026-11-02: Product Sense"
date: 2026-11-02
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: en
description: "Use the CIRCLES framework to tackle a real practice question — design a product that helps elderly riders use public transit independently — then pair it with Sean Ellis's 'very disappointed' segmentation method to see how Superhuman pushed its product-market fit score from 22% to 58%."
tldr: "CIRCLES breaks the question into seven steps; Sean Ellis's 'very disappointed' segmentation decides whose feedback is worth acting on. Together they make today's real point: picking a segment isn't a throwaway line at the top of an interview answer — it's the first choice that determines which direction every later step of analysis takes. The practice question comes from a real PM mock-interview question bank: design a product that helps elderly users ride public transit independently. The walkthrough shows how to split 'elderly users' into at least two groups with genuinely different failure modes — cognitively sharp but mobility-limited, versus mobile but cognitively declining — and build a different solution and safety net for each. The case is Rahul Vohra's own account, published on First Round Review, of how Superhuman found product-market fit: only 22% of early users said they'd be 'very disappointed' if they could no longer use the product, well below Sean Ellis's 40% threshold. Instead of rushing to change the product, Vohra isolated the users who did say 'very disappointed' and studied what they had in common — that segmentation step alone, before a single feature changed, pushed the score to 32%. Running the same survey-segment-analyze-iterate loop every quarter after that moved the score to 47%, 56%, and then 58%."
series:
  name: "Product Builder Interview Daily"
  order: 75
---

> 🌏 [中文版](/posts/daily/2026-11-02-product-builder-interview-daily)

## Today's Focus

A product sense interview isn't really testing whether you know a framework — it's testing whether you pick the right group of people to serve before you start proposing solutions. Most candidates hear "design a product" and jump straight to features. What actually separates strong answers from weak ones is the step before that: given a vague user label like "elderly users" or "small business owners," can you split it into sub-groups that fail in genuinely different ways, and explain why you're serving one and letting the other go? Today's drill uses CIRCLES on a real question from a PM mock-interview bank, then closes with a case where segmentation wasn't a metaphor — it was a number pulled straight out of a user survey.

## Framework Cheat Sheet

### CIRCLES

The most common seven-step structure for product design questions. Each step constrains what the next one is allowed to answer, so you don't jump straight to a solution:

| Step | What it answers |
|---|---|
| **C**omprehend the situation | Confirm which product and context the question is set in, so the scope stays tight |
| **I**dentify the customer | List a few plausible user segments, then pick one to go deep on |
| **R**eport customer needs | What's actually blocking that segment in this context |
| **C**ut through prioritization | Needs are rarely singular — say which one you're solving first, and why |
| **L**ist solutions | Propose two or three directions aimed at the top-priority need |
| **E**valuate trade-offs | Pick one, and explain why you're giving up the others |
| **S**ummarize | One line for the recommendation, plus how you'd measure success |

### Sean Ellis's "very disappointed" segmentation

CIRCLES' "Identify the customer" step is about picking a user in an interview room. Sean Ellis's method is the same choice made with real numbers from a real product:

1. **Survey**: Ask current users one question — "How would you feel if you could no longer use this product?" Options are very disappointed, somewhat disappointed, not disappointed.
2. **Segment**: Keep only the "very disappointed" respondents. Set the rest aside — more of their feedback won't make the product better, just more cluttered.
3. **Analyze**: Ask the "very disappointed" group an open-ended follow-up — "What's the main benefit you get from this product?" — and look for how they describe themselves in common.
4. **Iterate**: Build toward what that group has in common, so more potential users move into the "very disappointed" bucket next round, pushing the score up.

These four steps loop back into another survey, and each lap is supposed to score higher than the last — which makes it a loop that compounds, not a process that just finishes:

```diagram
title: Sean Ellis's Product-Market Fit Engine
desc: Survey, segment, analyze, and iterate form a loop, with each lap pushing the accumulated "very disappointed" score higher.
caption: Simplified. Superhuman actually ran one lap per quarter; the real scores were 22%, 32%, 47%, 56%, then 58%.
step: Survey current users with the "very disappointed" question
step: Keep only the very-disappointed respondents and update the current score
step: Analyze what this group has in common in how they use the product
step: Iterate on the product for this group, then re-measure from a higher score
step: Loop back into the next survey, starting from a higher score
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">Survey</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">disappointment Q</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Segment</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">keep "very" only</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">Analyze</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">shared context</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">Iterate</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">build for them</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">PMF score</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">rises each lap</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">update</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">target</text>
</svg>
```

## Today's Practice Question

### The question

"Design a product that helps elderly users ride public transit independently."
(Source: PMMockr's PM mock-interview question bank, product design category)

### How to break it down

1. **Clarify the problem**: Ask whether "independently" means no companion at all, or just fewer times they have to ask for help each trip — this decides how much automation the solution needs. Then ask whether the scope is buses, rail, or all transit — pick one mode to go deep on rather than designing three systems at once.
2. **Identify the customer**: Split "elderly users" into at least two groups with genuinely different failure modes — one is cognitively sharp but has limited mobility or vision (afraid of being too slow getting on or off, afraid of missing the platform); the other is mobile but cognitively declining (afraid of getting off at the wrong stop, afraid of forgetting how to transfer). These two groups don't share a solution.
3. **Report customer needs**: Using CIRCLES' "R" step, lay out what's actually blocking the chosen segment. It's usually not "doesn't know how to use a phone" — it's a deeper gap in confidence, like "being afraid I won't be able to get help the moment something goes wrong."
4. **Cut through and propose a solution**: Target the top-priority need, and explain why you're setting the other segment aside. For example: serve "mobility-limited but cognitively sharp" first, because they can operate an interface themselves — real-time platform voice alerts, longer card-tap windows at boarding. Set aside "cognitively declining" users because their real need looks more like a caregiving product than a transit product, and bundling the two would slow the first version down without making it sharper.
5. **Define success**: A north star could be "share of trips completed with an independent transfer." The input metric is voice-alert usage; the counter-metric is how often the help button gets pressed — because if the independent-completion rate rises alongside a spike in help requests, users are white-knuckling it through the interface, not actually gaining confidence.

### Sample answer (how this could actually sound in the room)

> **Lead with segmentation, not the solution**: "I'd start by splitting 'elderly users' into two very different groups. The first has limited mobility or vision but normal judgment and memory — their fear is getting caught by closing doors or missing the right platform. The second has declining cognition but is still physically mobile — their fear is missing their stop or forgetting where they're going. These two need completely different products, so I'd go deep on the first group, because they can operate a phone interface themselves, which means version one can actually ship without waiting on caregiving-adjacent design work."
>
> **Move into the need and the solution**: "What's actually blocking this group isn't 'doesn't know how to use an app' — it's 'there's no one to ask the moment something goes wrong,' whether that's platform announcements going by too fast or transfer signage too small to read. Version one would be real-time voice location alerts: once the phone detects which car you're in, it uses large text plus voice to warn two stops ahead — 'next stop, please move toward the front of the train' — and automatically extends the card-tap window at boarding, since this group naturally takes longer getting on and off. I wouldn't build a 'notify family via panic button' feature first, because that solves the family's anxiety, not the independence this rider is actually asking for."
>
> **Close on metrics**: "I'd use 'share of trips completed with an independent transfer' as the north star, watch voice-alert activation rate as an input metric, and track help-button presses as a counter-metric. If independent completion goes up and help requests spike at the same time, that's a red flag that people are just white-knuckling the interface — I'd treat that as a signal to go fix the interface, not a win to celebrate."

### Self-check

| Check | Covered? |
|---------|---------|
| Did you split "elderly users" into at least two segments with different failure modes? | |
| Did you explain why you're serving one segment and setting the other aside? | |
| Does the need point to a deeper confidence gap, not just a surface-level "can't use the interface"? | |
| Is the solution aimed at the top-priority need, rather than every feature you could think of? | |
| Did you name a north star, an input metric, and a counter-metric? | |
| Bonus: does the counter-metric expose a "looks successful but is actually forced" failure mode? | |

## Today's Case

**Superhuman: turning one survey question into a number instead of a feeling**

Superhuman founder Rahul Vohra's own account, published on First Round Review, is blunt about where this started: the team was split internally on whether they were ready to scale — some thought they could push ahead, others thought it was too early, and nobody had evidence either way. He borrowed growth advisor Sean Ellis's survey method, asking current users how they'd feel if they could no longer use Superhuman. Only 22% said "very disappointed," well below the 40% threshold Ellis associates with healthy growth. Most teams seeing that number would rush to change the product. Vohra instead pulled the "very disappointed" respondents into their own group and studied only their usage context and how they described themselves — ignoring the other 78% entirely. That segmentation step alone, before a single feature changed, pushed the score from 22% to 32%. The team then turned "survey, segment, analyze, iterate" into an engine run every quarter, and the score climbed to 47%, then 56%, then 58%.

**Interview angle**: this case is a direct answer to a common follow-up — "how do you know whose feedback to act on?" Most candidates answer "do user interviews," but who you interview, and how many, is itself a segmentation question. Superhuman's approach shows a sharper answer: use one filtering question to split users into "would they miss this product" groups, go deep on only one of them, and run the same loop repeatedly so the score itself becomes the north star for whether product decisions are working. Applied to today's transit question, that's the same move as splitting elderly users into two segments and using "independent transfer completion rate" as the equivalent score, re-measured after every iteration.

## Further Reading

- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit) — Rahul Vohra's own first-hand account, the full source for today's four-step loop and the quarterly score progression
- [Product Sense Interview Prep (2026 Guide)](https://www.aced.io/blog/product-sense-interview) — covers how product sense is actually tested at Meta, Stripe, and Airbnb, and what's scored
- [Product Manager Mock Interview Practice](https://www.pmmockr.com/product-manager-interview-practice) — source of today's practice question, with more product design, metrics, and strategy questions plus answer outlines

## References

- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit) — source of the Sean Ellis four-step segmentation loop and the 22%→58% score progression
- [Product Manager Mock Interview Practice](https://www.pmmockr.com/product-manager-interview-practice) — source of the practice question, "design a product that helps elderly users ride public transit independently"
- [Product Sense Interview Prep (2026 Guide)](https://www.aced.io/blog/product-sense-interview) — source of the CIRCLES framework and product sense interview scoring criteria
