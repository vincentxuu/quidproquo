---
title: "Product Builder Interview Daily — 2026-08-26: Strategy & Execution"
date: 2026-08-26
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Today's Strategy interview practice: TAM-SAM-SOM and Porter's Five Forces frameworks, plus a Perplexity-inspired breakdown — 'You have only 2% market share. How do you defend your position?'"
tldr: "Strategy questions don't test whether you can recite Porter's Five Forces — they test whether you can articulate a clear trade-off when you know you can't win on scale. Facing Google AI Overviews' 2 billion MAU and OpenAI Atlas, Perplexity chose to shut down its ad business entirely in early 2026 — a move that looks like self-inflicted revenue loss, but is exactly the kind of strategic coherence today's practice is about. Use TAM-SAM-SOM to frame the market, Five Forces to identify the battles you can't win, then answer 'What are you willing to sacrifice?'"
series:
  name: "Product Builder 面試日練"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-08-26-product-builder-interview-daily)

## Today's Topic

Strategy & Execution interviews test your "big-picture judgment" — the interviewer throws an open-ended market or competitive question at you to see whether you can quickly identify the key variables and make a recommendation that involves real trade-offs, even with incomplete information. These questions carry heavy weight in senior PM and PgM interviews because they simulate real work: your boss won't hand you a complete dataset — they'll just ask "What should we do?"

Where most candidates get stuck is turning a strategy question into a "trend analysis report" — listing a bunch of market observations without converging on a concrete recommendation, and without daring to spell out what that recommendation costs. Today's practice is about evolving from "listing the situation" to "stating a trade-off that has a price but holds up under scrutiny."

## Core Framework Quick Reference

### TAM-SAM-SOM

Used to frame "how big is this market really, and which slice can we actually capture":

| Level | Definition | Purpose |
|-------|-----------|---------|
| **TAM** (Total Addressable Market) | The theoretical global demand ceiling for this category | Determine whether this is a direction worth entering |
| **SAM** (Serviceable Addressable Market) | The portion you can actually reach after accounting for geography, regulation, and tech constraints | Narrow down to "where we can realistically compete" |
| **SOM** (Serviceable Obtainable Market) | The share you can realistically capture in the short term, given competition and your own resources | Define "a reasonable 12-month target" |

**How to use it**: For any "should we enter this market" or "how should we position" question, use TAM-SAM-SOM to converge on SOM first, then talk about how to win — interviewers dread candidates who only tell the grand TAM story but can't articulate a concrete SOM playbook.

### Porter's Five Forces (Simplified)

Used to judge "can we win this fight" — skip the academic definitions, just remember five questions:

1. **New Entrants**: Is this market easy to enter? Could a tech giant cross over into it at any time?
2. **Supplier Bargaining Power**: Does your upstream have you by the throat (e.g., model compute, key raw materials)?
3. **Buyer Bargaining Power**: Are switching costs high for users? Could they use you today and jump ship tomorrow?
4. **Threat of Substitutes**: Is there an alternative that eliminates the need for your entire category?
5. **Competitive Rivalry**: Are existing players competing on price or on differentiation?

**How to use it**: The common failure mode is giving equal airtime to all five forces. A strong answer identifies "the one or two forces that truly constrain us" and builds the entire recommendation around that bottleneck.

## Today's Practice Question

### Prompt

> "You're a PM at Perplexity. In early 2026, the company made a bold decision — completely shutting down its ad business and pivoting to subscription-first. At the same time, Google's AI Overviews already reaches roughly 2 billion MAU globally, OpenAI has launched the Atlas browser to compete head-on for 'AI-native browsing,' and Perplexity's current AI chatbot market share is only about 2%, behind ChatGPT, DeepSeek, Gemini, Grok, and Meta AI. How would you solidify Perplexity's strategic positioning over the next 12 months?"
>
> (Source: self-composed, based on Perplexity's 2026 competitive landscape, referencing gaurav-product's "30-Day PM Case Study Challenge" Day-15 Perplexity case study)

### Breakdown Approach

1. **Clarify the problem**: Ask the interviewer what "solidify positioning" means — growing absolute market share, or strengthening irreplaceability within a specific user segment? Is the 12-month horizon tactical only, or should you also outline a 3-year trajectory? Are there hard constraints on funding or org capacity (e.g., ability to raise another round, headcount limits)?
2. **Define users and company capabilities**: Inventory Perplexity's real assets — the citation-first trust-oriented UX, the Comet browser, the Sonar API, and distribution partnerships like Airtel and Samsung that deliver near-zero CAC. Honestly list the constraints too: only 2% market share, and neither funding nor model compute can match Google or OpenAI.
3. **Structured analysis**: First, use TAM-SAM-SOM to frame how large the "AI-native search/browsing" market is, which sub-market Perplexity can realistically serve, and what share is obtainable within 12 months. Then run Five Forces — the threat of new entrants is highest (Google and OpenAI can layer similar features into products that already have 2 billion users at any time), and buyer bargaining power is also high (switching apps costs users almost nothing). Core insight: Perplexity cannot win the "coverage" battle — it can only win the "trust" battle.
4. **Propose a plan**: Recommend against competing head-on with Google's distribution scale. Instead, double down on the "citation-first" differentiator — expand publisher revenue-sharing partnerships (like Comet Plus), deepen penetration among researchers, analysts, and knowledge workers who have high willingness to pay for "answer credibility," and use distribution deals like Airtel and Samsung to extend reach without diluting the trust positioning through ads. The trade-off is explicit: sacrifice short-term mass market share growth in exchange for a moat that Google can't easily replicate.
5. **Define success**: After 12 months, don't measure overall market share percentage (that number will almost certainly stagnate against Google/OpenAI). Instead, track subscription conversion rate, retention and renewal rates in the high-value user segment, and the pace of publisher partnership expansion. Allow overall market share to stay flat or even dip slightly, as long as stickiness in the target segment keeps climbing.

### Sample Answer (How to Deliver This in an Interview)

> **Frame the market first. Acknowledge what you can't win.** "Hearing this question, I wouldn't rush to say 'we need to catch up on market share,' because when you break it down with TAM-SAM-SOM, the TAM for AI-native search is massive, but the SAM has already been carved up by Google's distribution scale and OpenAI's model dominance — we can't win that part. I'd narrow my focus to SOM: the users we can realistically capture and retain are the ones who genuinely care about 'whether the answer is trustworthy and traceable to sources' — not all search users."
>
> **Use Five Forces to pinpoint the real bottleneck.** "Of the five forces, the biggest threats to us are new entrants and buyer bargaining power — Google can stuff similar features into a product that already has 2 billion users at any time, and switching apps costs users almost nothing. Since we can't win on scale, I wouldn't choose to keep subsidizing reach through ads. Instead, I'd follow the signal the company already sent by shutting down its ad business — go all-in on the citation-first differentiator, deepen publisher revenue-sharing partnerships, and turn 'trustworthy' into a position Google won't and can't replicate in the short term, because doing so would undermine their own ad model."
>
> **State the cost of the trade-off and define how to verify it.** "The cost of this strategy is that our overall market share will likely stay in the low single digits for the next 12 months, and a board that only watches that number will think we're standing still. I'd proactively redefine the success metrics to subscription conversion rate, renewal rate for the core researcher/analyst segment, and publisher partnership expansion velocity — if these three metrics show steady growth over 12 months, it validates the 'don't chase scale, chase trust' strategy. If the core segment's renewal rate also stagnates, the problem isn't distribution — we'd need to re-examine whether the trust-oriented UX itself still has differentiation."

### Self-Check Checklist

Use this table to verify your answer doesn't miss key elements:

| Checkpoint | Covered? |
|-----------|----------|
| Clarified what "solidify positioning" means — time window and who's measuring | |
| Used TAM-SAM-SOM to converge the market down to a realistic SOM | |
| Used Five Forces to identify "the one or two forces that truly constrain us" rather than covering all five equally | |
| Proposed a concrete plan with explicit trade-offs (what you're giving up, what you're gaining) | |
| Defined specific success metrics for 12-month validation | |
| Bonus: connected the plan back to an existing strategic signal (e.g., the company already shut down its ad business) | |

## Today's Case Study

**Perplexity: Shutting Down a Profitable Ad Business to Bet on a "Trustworthy" Position**

Perplexity positioned itself as an "answer engine" from its founding in 2022, using a "cite your sources" answer format to directly challenge traditional link-based search. By early 2026, the company had raised roughly $1.72 billion at a valuation of about $22.6 billion, and its product line had expanded from a single search box to a multi-product portfolio spanning the answer engine, Comet browser, Computer Agent, and Sonar API — yet its overall AI chatbot market share remained at roughly 2%, behind ChatGPT, DeepSeek, Gemini, Grok, and Meta AI. In February 2026, the company made a counterintuitive decision: completely shut down its ad business, go all-in on subscriptions, and expand publisher revenue-sharing partnerships (Comet Plus). This decision sacrificed short-term revenue but reinforced the "citation-first" core promise that had existed since day one, while distribution deals with Airtel and Samsung extended reach at near-zero acquisition cost without needing ads to dilute the trust positioning.

**Interview connection**: This case is excellent material for "strategic coherence" questions — a strong answer doesn't just explain "why this decision was smart," but points out: good strategic decisions often sacrifice a visible short-term metric (ad revenue) to protect an invisible but harder-to-replicate long-term asset (trust). When you encounter a "should this company do X" question, use this case to demonstrate how to evaluate whether a trade-off is "coherent" — does it reinforce the company's existing differentiation, or is it just chasing the current market trend?

## Further Reading

- [Product Strategy Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/product-strategy-interview-questions) — A comprehensive breakdown of how strategy questions have evolved in the AI era, including "business model fluency" and "revealed preference" techniques for reading a company's true priorities.
- [Product Strategy Questions: The PM Interview Round Where Your Answer Doesn't Matter](https://rethinksystems.substack.com/p/strategy-questions-the-pm-interview) — Uses Spotify's podcast ad expansion as a real case to demonstrate how to chain 3Cs + simplified Five Forces together.
- [Product Strategy Deep-Dive: Starbucks](https://www.mypminterview.com/p/product-strategy-deep-dive-starbucks) — Uses Starbucks' "third place" and premium positioning strategy to practice structuring brand moat analysis.

## References

- [product-management-case-studies: Day-15 Perplexity](https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-15-Perplexity) — Source material for today's case study, including Perplexity's funding, market share, and February 2026 ad business shutdown details.
- [Product Strategy Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/product-strategy-interview-questions) — Basis for the TAM-SAM-SOM framework application to strategy questions.
- [Product Strategy Questions: The PM Interview Round Where Your Answer Doesn't Matter](https://rethinksystems.substack.com/p/strategy-questions-the-pm-interview) — Reference source for the simplified Five Forces question format.
