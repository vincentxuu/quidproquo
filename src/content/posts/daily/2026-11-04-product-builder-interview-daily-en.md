---
title: "Product Builder Interview Daily — 2026-11-04: Strategy & Execution"
date: 2026-11-04
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Use bottom-up TAM-SAM-SOM to size a market, then practice a portfolio allocation case: how to split 12 person-quarters of engineering capacity across reliability, activation, new-segment discovery, and two proposals you have to kill — and how to make the trade-off hold up under questioning."
tldr: "Today's point isn't reciting the letters TAM-SAM-SOM — it's practicing the bottom-up method: start from a concrete, reachable list of accounts (the beachhead) and multiply up by conversion rate and deal size, instead of starting from one huge market number and dividing by a guessed percentage. The practice question is a portfolio allocation case — splitting 12 person-quarters of capacity across reliability work, new-user activation, new-segment discovery, and a reserve, while explicitly killing two proposals that already have political momentum. Explaining exactly why you killed them and who inherits what matters more than the allocation ratio itself."
series:
  name: "Product Builder 面試日練"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-11-04-product-builder-interview-daily)

## Today's Focus

The most common way to lose points in a strategy interview isn't miscalculating market size — it's trading a scary-big number for credibility. "This is a $50 billion market" sounds weighty, but the interviewer's next question is always "so who are you going after first?" If you can't produce a concrete account list, the big number was just decoration. Today practices that exact gap with two moves: the bottom-up method for TAM-SAM-SOM, so market sizing can actually be checked, and a portfolio-allocation case where "killing a proposal" has to come with specific actions instead of a vague "we'll reprioritize."

## Core Frameworks

### Framework 1: TAM-SAM-SOM (the bottom-up version)

The three layers answer different questions, but most people get stuck doing a top-down calculation that produces a pretty number nobody believes:

| Layer | Question it answers | Method | Common mistake |
|---|---|---|---|
| **TAM** Total Addressable Market | What's the ceiling for this market | Industry reports, analyst data | Citing a market size your product can't actually serve |
| **SAM** Serviceable Addressable Market | Given current capability, who can you actually serve | Filter TAM by positioning, geography, target segment | Ignoring the product's own limitations |
| **SOM** Serviceable Obtainable Market | What can you capture in 3-5 years with current resources | Bottom-up: reachable accounts × conversion rate × deal size | Assuming conversion rate scales linearly across the whole market |
| **Beachhead** | Who do you go after on Monday | A named list of 25-100 accounts | Skipping the SOM layer entirely — a size with no names behind it |

The top-down calculation goes: "the market is $15 billion, we'll capture 1%, so revenue is $150 million" — nobody believes this, including the person saying it. The bottom-up calculation goes: "there are 45,000 companies in this vertical that match our ICP, average deal size is $8,000 a year, if we convert 3% that's $10.8 million in ARR" — that's a story an operator and an investor can both interrogate together, because every number can be pulled apart and checked.

### Framework 2: Porter's Five Forces (used well, not recited)

The five-force framework itself is textbook material. What an interviewer actually wants to see is whether you can plug it into a specific decision, not recite five nouns:

1. **Existing competitors**: who's already fighting in this market, and what keeps them alive
2. **Threat of new entrants**: how hard is it to enter this market, and is your advantage easy to copy
3. **Threat of substitutes**: if a customer doesn't buy your product, how else do they solve the same problem — including "doing nothing"
4. **Supplier bargaining power**: how much leverage do your upstream dependencies (cloud providers, data sources, key talent) have over you
5. **Buyer bargaining power**: how cheap is it for your customer to switch away from you

The box people most often skip in interviews is "substitutes," because most candidates only think about named competitors and forget that a customer's biggest competitor is often just the status quo.

## Today's Practice Question

### The Question

"A B2B workflow product has 12 person-quarters of discretionary engineering capacity next quarter. Existing customers keep bringing up reliability during renewal conversations. New admins keep getting stuck before reaching their first useful workflow. Sales is proposing a regional market push. An executive wants a premium paid dashboard. And a PM has proposed a discovery program for a new buyer segment. How would you allocate the 12 person-quarters?" (Source: PracHub fictional case, officially labeled original practice material, not a verified employer question.)

### How to Break It Down

1. **Clarify the objective — don't default to "maximize revenue."** Confirm with the interviewer that the quarter's goal is "protect existing customer value while establishing which growth direction deserves the next investment." That's deliberately narrower than "maximize revenue," because it rules out manufacturing a precise ROI to force-compare four proposals with completely different kinds of evidence behind them.
2. **List who's affected — not just "users."** Existing customers (reliability complaints), new admins (stuck at activation), sales (wants the regional push), an executive (wants the dashboard), and a new segment (still unvalidated) — these five have wildly different evidence strength, and that's the first cut that decides who even qualifies for capacity.
3. **Score on evidence quality / strategic relevance / reversibility / resource conflict — don't just run ROI.** Reliability and activation have concrete complaint logs and funnel numbers as evidence; the regional push and the dashboard currently have nothing but "sales wants it" and "an executive wants it" as reasons; new-segment discovery has no evidence at all yet. These four shouldn't be forced through the same precise ROI formula.
4. **Propose the allocation, and explicitly kill two proposals.** For example: 4 person-quarters to reliability, 4 to activation, 2 to new-segment discovery (scoped to validating interviews only, no delivery system), and 2 held in reserve. The regional push and the dashboard get zero headcount this quarter — "kill" has to mean three concrete actions: pull the staffed milestone, notify the affected stakeholders, and preserve any research that still has value (e.g. the customer interviews behind the dashboard idea) — not quietly leaving both on the roadmap with no team attached, which manufactures the appearance of progress without the substance.
5. **Define the reserve's release condition and the success metrics.** Say clearly who has authority to release the reserve and under what evidence threshold (a major incident, or discovery of a new hard constraint) — otherwise stakeholders will nibble it away through small requests until there's nothing left when real uncertainty actually shows up.

```diagram
title: Allocating 12 person-quarters of capacity
desc: Reliability and activation each get 4 person-quarters, new-segment discovery and reserve each get 2, totaling 12; the regional push and the dashboard proposal get zero headcount this quarter and are fully killed, which is why they don't appear in this chart.
caption: Illustrative numbers, adapted from PracHub's fictional practice case. Conversion: baseline y=300, 60 units per person-quarter (y=300−person-quarters×60), vertical axis starts at 0.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Person-quarters</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="228" y="60" width="64" height="240"/>
    <rect class="dg-bar dg-bar--soft" x="336" y="180" width="64" height="120"/>
    <rect class="dg-bar dg-bar--soft" x="444" y="180" width="64" height="120"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="120" y="60" width="64" height="240"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-label dg-text--accent" x="152" y="50" text-anchor="middle" dominant-baseline="central">4</text>
  <text class="dg-sub" x="260" y="50" text-anchor="middle" dominant-baseline="central">4</text>
  <text class="dg-sub" x="368" y="170" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub" x="476" y="170" text-anchor="middle" dominant-baseline="central">2</text>

  <text class="dg-label dg-text--accent" x="152" y="320" text-anchor="middle" dominant-baseline="central">Reliability</text>
  <text class="dg-sub" x="260" y="320" text-anchor="middle" dominant-baseline="central">Activation</text>
  <text class="dg-sub" x="368" y="320" text-anchor="middle" dominant-baseline="central">Discovery</text>
  <text class="dg-sub" x="476" y="320" text-anchor="middle" dominant-baseline="central">Reserve</text>
</svg>
```

### A Sample Answer (how to actually say this in the interview)

> **Define the objective before allocating anything.** "I'd first confirm with the interviewer that this quarter's goal isn't maximizing revenue — it's protecting existing customer value while establishing which growth direction deserves the next round of investment. That gives me a real reason to push two attractive-looking proposals to the back of the line, instead of feeling forced to sprinkle a little resource on everything."
>
> **Layer the evidence instead of forcing a precise ROI comparison.** "Reliability has actual renewal complaint logs, and activation has funnel numbers I can verify — I'd bucket those as protecting evidence-backed existing value. The regional push and the dashboard are both still just proposals with no customer evidence behind the scale they're claiming, and new-segment discovery is purely hypothesis-stage. I'm not going to invent a clean ROI number for the two unvalidated proposals just to compare them against the first two, because that number would be fabricated, not calculated."
>
> **Kill explicitly, and name the actions.** "I'd allocate 4 person-quarters to reliability, 4 to activation, 2 to validating interviews for the new segment, and 2 as reserve. The regional push gets killed outright this quarter — I'd pull its staffed milestone, go explain why to sales directly, and check whether there's an existing contractual obligation that still needs honoring — if there is, that's a narrow, bounded commitment, not the whole regional push getting greenlit. For the dashboard, I'd keep the customer interviews running but wouldn't commit to building the delivery system, because we still don't know which customer behavior that dashboard is actually supposed to change."

### Self-Check Checklist

Use this table to check whether your answer missed anything important:

| Check item | Covered? |
|---------|---------|
| Did you define the quarter's objective instead of defaulting to "maximize revenue" | |
| Did you separate each proposal's evidence strength instead of forcing the same ROI math on all of them | |
| Do the allocation numbers add up correctly, with a reserve held back | |
| Did "kill" come with specific actions (pulling the milestone, notifying stakeholders, preserving research) | |
| Did you name the reserve's release condition and who holds release authority | |
| Bonus: did you clarify whether you were the recommender, the approver, or just executing a decision someone above you already made | |

## Today's Case

**GitLab: writing "which features stop getting investment" into a public handbook instead of leaving it in a closed-door meeting**

GitLab's product management team publishes its entire resource-allocation and decision framework as a public online handbook — anyone, including a candidate who hasn't even joined the company yet, can see exactly why a feature got funded or got demoted in priority. That's the opposite of how most companies operate, where the strategic decision gets made in a leadership meeting and the team only receives the conclusion. GitLab chose to publish the reasoning itself, so outsiders can check whether the organization's decision logic is actually consistent — not just check the final outcome.

**Interview angle**: this case answers "how do you make a kill decision land with the team instead of looking like politics?" Most people's answer stops at "I'd communicate more," but more communication doesn't make a decision checkable. GitLab's approach shows a different answer: write the decision criteria down and publish them, so "why we killed this one" and "why we didn't kill that one last time" can be checked against the same standard. Back to today's question — if the rationale for killing the regional push only lives in your head, sales will assume you were targeting them next time. But if the four-dimension scoring (evidence quality / strategic relevance / reversibility / resource conflict) is public and reused every quarter, the argument shifts from "you're against me" to "is this quarter's evidence actually weaker."

## Further Reading

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — the source of today's practice question and breakdown, with more follow-up questions on attribution (were you the recommender or the approver).
- [Go to Market Strategy: 5 Motions, 7-Layer B2B Framework](https://www.tommasomariaricci.com/blog/go-to-market-strategy-complete-framework) — the full bottom-up TAM-SAM-SOM walkthrough and the seven-layer B2B GTM framework, backed with 2026 Gartner data on how buyer behavior has shifted.
- [GitLab Product Management Handbook](https://handbook.gitlab.com/handbook/product/product-management/) — today's case, GitLab's public product management handbook, where you can see a real company's decision criteria written down and made checkable.

## References

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — source of today's practice question (the 12 person-quarter allocation case), officially labeled fictional practice material.
- [Go to Market Strategy: 5 Motions, 7-Layer B2B Framework](https://www.tommasomariaricci.com/blog/go-to-market-strategy-complete-framework) — source of the bottom-up TAM-SAM-SOM method and the beachhead account-list concept.
- [GitLab Product Management Handbook](https://handbook.gitlab.com/handbook/product/product-management/) — the primary source for today's case on publishing decision criteria, GitLab's official product management handbook.
