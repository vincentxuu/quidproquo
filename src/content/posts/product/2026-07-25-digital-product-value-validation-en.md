---
title: "Value Validation for Digital Products: From Assumption Maps to the M3 Retention Baseline for AI"
date: 2026-07-25
category: product
type: deep-dive
tags: [value-validation, product-market-fit, product-discovery, experimentation, pricing, product-management, ai-product]
lang: en
tldr: "The unit of validation is an assumption, not an idea. Kohavi's data shows the industry median experiment success rate is ~10%, which means roughly 22% of 'winning' experiments at p<0.05 are false positives. Sean Ellis's 40% threshold has no publicly available dataset. AI product retention should be baselined at M3 rather than M0, and GRR splits from 23% below $50/mo to 70% above $250/mo."
description: "A breakdown of value validation for digital products: Cagan's four risks, the evidence-strength ladder, the two-directional bias in WTP surveys, the failure modes of the 40% test and retention curves, the math of experiment false positives, and the three things AI products change."
draft: false
glossary:
  - term: "fake door"
    aliases: ["painted door", "fake door test"]
    definition: "Placing an entry point for a feature that looks usable but doesn't exist yet, using click-through rate as a demand signal."
    advanced: "It measures curiosity, not commitment — a click doesn't prove the user will change their workflow or pay. The one irreplaceable use case is deep integrations or infrastructure-level features where prototyping costs months. The success threshold must be set before launch, or the test degrades into a confirmation-bias machine."
    context: "Used in product discovery to get a demand signal before building, at a real cost to user trust."
  - term: "concierge MVP"
    aliases: ["concierge test"]
    definition: "Delivering the value entirely by hand to a small number of customers to see whether they value the outcome and come back."
    advanced: "It tests desirability: whether the outcome is what customers actually care about. Because delivery is fully manual, it proves nothing about scalability — cost and effort are not representative of the final product."
    context: "Fits brand-new products where customers have no price or experience reference point for this kind of service."
  - term: "Wizard of Oz"
    aliases: ["Wizard of Oz MVP"]
    definition: "The user sees an automated product, but a human operates it manually behind the scenes."
    advanced: "The difference from concierge is what's being tested: concierge asks whether customers want the outcome, Wizard of Oz asks whether your proposed delivery mechanism and experience actually work. Use it once you know the outcome is wanted."
    context: "Common in early AI products — have humans stand in for the model first, confirm the experience works, then invest in automation."
  - term: "HXC"
    aliases: ["high-expectation customer"]
    definition: "The most demanding customers for this category — if they're satisfied, ordinary users usually are too."
    advanced: "Superhuman derived the HXC profile from its 'very disappointed' group, then recalculated the PMF score against only those users. That step alone moved the score from 22% to 33% without changing a line of the product. Conversely, building something average people tolerate is a much weaker position than building something demanding people love."
    context: "Used for segmentation in PMF measurement, and for defining the target market and roadmap priorities."
---

> 🌏 [中文版](/posts/product/2026-07-25-digital-product-value-validation)

When most teams say "we validated it," what they usually mean is "we interviewed 20 people and they all said they wanted it." That statement carries almost zero information, and it isn't cheap. Per Ronny Kohavi's long-running experiment data at Microsoft, even ideas that survived layers of internal review before being built improved the metrics they were designed to improve only about one third of the time. In a well-optimized domain like Bing, the success rate drops to 10–20%.

This post breaks down **value validation** for digital products: what it actually tests, which methods exist, how to judge whether something is "validated," and how unreliable those methods themselves are. The last section covers the three things AI products change.

## What Value Validation Actually Tests: The First of Four Risks

Value validation isn't an activity. It's **evidence gathering aimed at one specific class of risk**. Marty Cagan splits product risk into four categories in [The Four Big Risks](https://www.svpg.com/four-big-risks/):

> 1. value risk (whether customers will buy it or users will choose to use it)
> 2. usability risk (whether users can figure out how to use it)
> 3. feasibility risk (whether our engineers can build what we need with the time, skills and technology we have)
> 4. business viability risk (whether this solution also works for the various aspects of our business)

In [Product Risk Taxonomy](https://www.svpg.com/product-risk-taxonomies/), Cagan explains how the taxonomy evolved: the first edition of *INSPIRED* (2008) had only three risks — value, usability, feasibility. The second edition (2018) split "valuable to customers" from "viable for the business." He acknowledges three is easier to remember than four, but argues the cost of burying viability was too high.

Value validation targets the **first** category only. That definition alone excludes a large amount of activity commonly mislabeled as validation: usability testing tests usability, a technical spike tests feasibility, a legal review tests viability. None of them tell you whether anyone actually wants this. And Cagan repeatedly argues that value risk is usually the hardest of the four.

The real dividing line comes from a single sentence by Teresa Torres in [Discovering Solutions](https://www.producttalk.org/discovering-solutions/):

> Interviewing is generative. Assumption testing is evaluative. We need both.

Interviews **generate opportunities**; assumption tests **evaluate solutions**. Blur the two and you produce conclusions like "everyone said they wanted it" — unfalsifiable and unactionable.

There's a deeper point: the unit of validation is not an "idea" but an **assumption**. The bottom row of an [Opportunity Solution Tree](https://www.producttalk.org/opportunity-solution-trees/) is assumption tests, not A/B tests. Torres has explained the design intent — giving experiments their own row forces teams to think of multiple ways to test the same solution, rather than over-relying on A/B tests to evaluate an entire solution at once.

Pair this with assumption mapping's 2×2 (importance × existing evidence) and the picture is complete. The cell that matters is **high importance × low evidence** — the leap-of-faith assumptions, the ones where being wrong kills the solution and where you currently know nothing. The real value of the tool is that it forces an uncomfortable admission: most teams test the assumptions they find **comfortable** to test (engineers test technical feasibility, designers test usability) rather than the ones that would **kill the idea**.

## Evidence Strength Runs on One Axis

[Testing Business Ideas](https://www.strategyzer.com/library/testing-business-ideas-book) by Osterwalder and David Bland catalogs 40-odd experiment types (the official page says 43, the official book excerpt says 44), organized along three dimensions: cost, time, and strength of evidence. The ordering logic behind it is a single line:

**Opinions < stated intentions < actual behavior.**

One signed letter of intent beats a hundred "we'd be interested" replies. Bland divides experiments into discovery (open-ended, directional, cheap) and validation (involving a **real value exchange**, expensive, slow), building on Steve Blank's customer discovery and validation phases. Most teams get stuck in the discovery layer, because discovery always offers the excuse of "we could interview a few more people." The real threshold is whether a real value exchange has occurred.

The same axis explains the core of [The Mom Test](https://www.momtestbook.com/). Rob Fitzpatrick's book is often misread as a book of interview technique, but its actual claim is that **compliments are social lubrication; commitments are evidence**. And commitment comes in three currencies, ordered by weight: time (agreeing to a follow-up meeting, testing a prototype) < reputation (a named introduction, an internal recommendation) < money (a deposit, a pre-order, an LOI).

The implication is uncomfortable but clean: an interview that ends in "let's keep in touch" or "let me think about it" is not a neutral result. It's a **weakly negative** one. The other party spent none of the three currencies, so you got no data.

In practice, method selection looks roughly like this:

| What you're testing | Fitting experiment | Evidence strength | Main limitation |
|---|---|---|---|
| Does the customer have this problem | Customer interviews (Mom Test rules) | Medium | No commitment means no data |
| Do they care enough to act | Landing page / signup form | Medium-high | Measures curiosity |
| Will B2B customers actually adopt | Letter of intent / paid pilot | High | Needs a real decision-maker |
| Do customers value the outcome | Concierge MVP (manual delivery) | High | Proves nothing about scalability |
| Does the proposed delivery mechanism work | Wizard of Oz (automated front, manual back) | High | Expensive |
| Will they actually pay | Pre-sale / pre-order | Very high | Highest commitment cost, hardest to get |

Fake door (painted door) testing deserves its own note, because it's the most abused. What it measures is **CTR — curiosity, not commitment**. A click doesn't prove the user will change their workflow, pay more, or keep using the feature. It carries two real costs: trust (a user who discovers they were lured into a nonexistent feature has a negative experience that never shows up in your CTR report) and interpretability (it tells you *what*, never *why*).

There's exactly one scenario where fake door is irreplaceable: **deep integrations or infrastructure-level features where prototyping costs months**. There you trade hours of cost for a demand signal. Conversely, it's wrong for multi-step complex features (a single CTA can't represent a flow), very early products (one badly handled reveal destroys trust that hasn't formed yet), and segments that have already been tested.

One more discipline: **set the threshold before you launch.** A fake door test without a pre-defined success bar isn't an experiment — it's a confirmation-bias machine. Decide what counts as success after the data arrives and you will always decide it succeeded.

## Willingness to Pay: Every Survey Is Biased, Just in Different Directions

There are four common methods for measuring willingness to pay (WTP), each with its own place:

| Method | Output | Fits | Known problems |
|---|---|---|---|
| [Van Westendorp PSM](https://www.relevantinsights.com/articles/van-westendorp-price-sensitivity-meter/) | Acceptable price **range** | Brand-new product, no reference point | No theoretical foundation, ignores competition, unstable results |
| Gabor-Granger | Demand curve, **revenue-optimal price** | Known price band, price changes | Requires predefined price points; sequential version has anchoring bias |
| Conjoint / discrete choice | **Feature-level WTP** + competitive simulation | Designing tiers and packaging | Highest sample size and cost |
| Direct question | Mean / median WTP | Rough direction only | Least reliable |

The academic literature is unambiguous: **all hypothetical methods are biased.** Schmidt and Bijmolt's 2020 meta-analysis in the *Journal of the Academy of Marketing Science* found that hypothetical and actual WTP differ by roughly **21%**, and that hypothetical bias is **larger** for indirect methods such as conjoint.

Here's the point most often gotten wrong in practice — **two opposite biases exist simultaneously, acting on different methods**:

- **Asking directly, "how much would you pay?"** → respondents have a strategic incentive to **understate**. Lipovetsky et al. put it as "respondents often overstate their price sensitivity" in [Pricing Models in Marketing Research](https://content.scirp.org/pdf/iim20110500007_64675493.pdf).
- **Hypothetical purchase-intent or choice tasks** (contingent valuation, non-incentive-aligned conjoint) → **overstate** purchase intent and WTP, because the answer carries no consequence for the respondent.

So "do surveys overstate or understate WTP?" has no single answer — it depends on which method you used. Conflate the two and you'll apply the correction in the wrong direction.

There is a fix, and almost nobody uses it. A [2025 meta-analysis in Marketing Letters](https://doi.org/10.1007/s11002-025-09764-8) (134 effect sizes, 34 articles, N = 12,980) found that tying respondent payout to their choices (incentive alignment) increases conjoint's predictive validity by **12%**. The same paper cites Pachali et al.: **96% of conjoint studies run by market research firms are purely hypothetical**.

On Van Westendorp specifically, practitioner Michaela Mora's critique is blunt: no theoretical foundation, direct price questions invite lowballing, no competitive context, no track record of predictive success, and no way to optimize revenue or profit. She cites her own case where the PSM-derived "optimal price" came out **$10 below** the product's actual selling price, with the real price falling entirely outside the PSM's recommended "acceptable range." Lipovetsky et al. add the technical critique: results are unstable, and small changes in the sample produce large shifts in the price curves.

In fairness, there's a genuinely strong case for VW worth putting on the table: [Kloss and Kunter (2016)](https://iabe.org/IABE-DOI/article.aspx?DOI=EJM-16-2.4) found that VW's optimal pricing point reproduces the measurements from the **BDM mechanism** — a design where respondents have real money at stake, generally treated as the closest available proxy for true WTP. If that holds, a two-to-three-minute survey buys you something near the accuracy of an incentive-aligned experiment.

But the authors' own caveat is the more instructive part: the agreement **may be two biases cancelling out** — hypothetical bias pushing the price up while the PSM's focus on minimum customer resistance pushes it down — and the finding comes from a single product. In other words, there is currently no way to distinguish VW being *right* from VW being *accidentally right*. A tool that is accurate because two errors offset has no reason to stay accurate in a different product category.

**The actionable conclusion: use surveys to narrow the search space, and use pre-sales, paid pilots, and LOIs to make the decision.** This also explains why even people arguing that painted door tests should be retired concede that behavioral testing beats surveys specifically on price points — survey respondents have a strong incentive to pick the cheapest option.

## What Counts as "Validated": The Sean Ellis 40% Test

The most widely circulated criterion is Sean Ellis's 40% test. [In his own words](https://medium.com/growthhackers/using-product-market-fit-to-drive-sustainable-growth-58e9124ee8db):

> In my experience, it becomes possible to sustainably grow a product when it reaches around 40% of users who try it that would be "very disappointed" if they could no longer use it.

He also specifies sample requirements: a minimum of 30 responses to be directionally useful, 100+ for confidence. And it must be asked only of people who have **recently experienced real usage** of the core product — his example is that Uber should survey people who took a ride, not people who downloaded the app.

The famous application is Superhuman. Rahul Vohra documented the trajectory in [First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/): **22% → 33% → 58%**. The first run came back at 22%; simply narrowing the sample to the high-expectation customer segment lifted it to 33% (**without changing a line of the product**), and three quarters of systematic iteration took it to 58%. His roadmap split was half strengthening what the "very disappointed" group loved, half removing blockers for the "somewhat disappointed" users who matched the HXC profile — ignoring the "not disappointed" group entirely.

The tool is useful, but four failure modes need stating:

1. **Survivorship bias is designed in.** It surveys current users only; churned users are excluded by definition. A metric that can't see churn has a hard time claiming to detect fit.
2. **The question is negatively framed.** "How would you feel if you could no longer use it" can trigger loss aversion, habit, and switching friction rather than a value judgment. A user who is indifferent and actively shopping alternatives can still answer "very disappointed" at the prospect of abrupt removal.
3. **Above 40% produces false positives.** Tristan Kromer documented his own case: [StartupSquare scored above 40% and clearly had no PMF](https://kromatic.com/blog/false-positives-and-product-market-fit/) — respondents were reacting to the *promise* of a solution rather than the product, which barely did anything. His conclusion: below 40% probably means no PMF, but above 40% doesn't guarantee it.
4. **The number 40 itself has no public validation.** It comes from Ellis benchmarking roughly a hundred startups, but this research (covering Ellis's own writing, the Superhuman article, Reforge material, and multiple critiques) found no publicly available dataset, peer-reviewed study, or independently reproducible analysis behind it. **If you know of a public source, tell me and I'll update this section.**

So the reasonable use is: **treat it as a diagnostic gauge for tracking your own change over time, not as a cross-company go/no-go gate.** Dropping from 47% to 31% this quarter means something broke, and the signal is extremely cheap to obtain. That's where its value lies.

Supporting evidence from practice: Nubank CPO Jag Duggal noted on [Lenny's Podcast](https://www.lennysnewsletter.com/p/be-fundamentally-different-jag-duggal) that they run the 40% test on every feature they intend to launch, but raised the bar to **50%** because Brazilians are culturally more upbeat and agreeable than the global average. A number that has to be recalibrated per culture was never suited to being a universal pass mark.

## The B2B Criterion Is Different: Six Reference Customers

The 40% test has a more fundamental limitation — it was designed for B2C. Cagan's criterion for B2B products is entirely different: [at least six live reference customers](https://www.svpg.com/the-power-of-reference-customers/), counted separately for each vertical market (six in financial services first, then six in manufacturing, and so on).

His definition of a "reference customer" is strict, and all four conditions must hold:

1. **A real customer** — not friends, family, or insiders
2. **Running your product in production** — not a trial, not a POC
3. **Has paid real money** — not given away to entice them to use it
4. **Willing to tell others how much they love your product, voluntarily and sincerely**

The fourth is the hardest and the most important. The first three can be manufactured with sales discounts; the fourth cannot — it requires the customer to stake their own reputation on you. Back on the evidence-strength axis, that's the highest grade of the "reputation" currency.

Cagan himself says six [isn't meant to be statistically significant — it's meant to instill confidence](https://www.svpg.com/product-market-fit/). The more valuable takeaway is his inference: **don't turn on the sales and marketing machine until you have those six**, because you don't yet have evidence that you can make customers successful, and scaling acquisition at that point only scales the failure.

## The Behavioral Criterion: Retention Curves

The behavioral criterion is retention curve flattening. Casey Winters is specific about it in [Casey's Guide to Finding Product/Market Fit](https://www.caseyaccidental.com/p/caseys-guide-to-finding-product-market-fit): the y-axis of the cohort analysis should be the **key action** of the product (saving a piece of content for Pinterest, ordering food for Grubhub), and the x-axis should be the product's **natural frequency** (weekly for Pinterest, once or twice a month for Grubhub). Get those two axes wrong and the curve is meaningless.

But the full criterion is a **conjunction of three conditions**, not any single one:

> A flattened retention curve of your key action at the designated frequency plus month over month growth in new customers is the best way I have found to measure true product/market fit.

Add the third condition from his other post — being able to acquire customers within an acceptable payback period — and the definition is complete. Missing any one of them means it doesn't count.

One frequently overlooked detail: **the shape of the curve matters more than the absolute number.** In Casey's words, "where the retention graph flattens is more important to me than the six month retention rate." An e-commerce product flattening at 8% is healthier than a SaaS product still declining at 20%.

As for the benchmark numbers everyone wants — the [2020 compilation by Lenny Rachitsky and Casey Winters](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29) (six-month user retention): consumer social 25% (good) / 45% (great), consumer transactional 30/50, consumer SaaS 40/70, SMB and mid-market SaaS 60/80, enterprise SaaS 70/90.

**These numbers have a shelf-life problem.** Three things to know before using them: it's a compilation of practitioner interviews rather than a public dataset, it was published in 2020, and that predates AI products entirely. Fine as a coordinate system; be very careful using it as a pass mark.

## Compute Your Base Rate: Why a "Win" Has a 22% Chance of Being Fake

This is the most overlooked and most counterintuitive part of value validation.

Kohavi's long-run data in [Online Experimentation at Microsoft](https://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf): roughly 1/3 of ideas were positive and statistically significant, 1/3 flat, 1/3 negative and statistically significant. His [2014 MIT talk](https://exp-platform.com/Documents/2014-10-11MITCodeKohaviExP.pdf) puts it more bluntly:

> Features are built because teams believe they are useful. But most experiments show that features fail to move the metrics they were designed to improve.

In a well-optimized domain like Bing, the failure rate climbs to 80–90%. And for Bing's holy-grail metric, sessions/user, **1 out of 5,000 experiments improves it**. The 2020 [cross-company paper](https://doi.org/10.1186/s13063-020-4084-y) in *Trials* by Kohavi, Tang, Xu, Hemkens, and Ioannidis establishes this as the shared experience of Google, LinkedIn, and Microsoft.

The lethal inference comes next: **the lower your success rate, the higher the probability that a statistically significant result at p<0.05 is a false positive.**

| Company | Experiment success rate | Probability a p<0.05 result is a false positive |
|---|---|---|
| Microsoft | 33% | 5.9% |
| Bing | 15% | 15% |
| Booking.com / Google Ads / Netflix | 10% | 22% |
| Airbnb Search | 8% | 26.4% |

([Compiled by GrowthBook](https://www.growthbook.io/blog/designing-a-b-testing-experiments-for-long-term-growth) from Kohavi 2009/2014, Manzi 2012, Thomke 2020)

An industry median success rate around 10% means **roughly 1 in 5 "winning" experiments is a false positive**. Most teams assume p<0.05 means a 5% error rate. Mathematically it doesn't — that holds only if your ideas were 50/50 to begin with. The worse your base rate, the less a given p-value is worth.

And data quality problems are more common than statistical ones. A few from Kohavi's list: A/A test failure rates run far above the expected 5% (up to **30%** on new sites), most often from carryover effects; sample ratio mismatch (a 50/50 design producing 49/51) is the most common signal that something is badly wrong; over half of Bing's traffic is bot-generated.

He also documents what happens when you *don't* experiment: Office Online changed its rating system from yes/no to 5 stars and **lost over 80% of responses. It took eight months to detect, analyze, and revert.** In his words, the odds that anyone discovers a 3% metric drop and starts a project to roll back a feature they proudly launched are miniscule.

## AI Products Change Three Things

First, what doesn't change: the four-risk taxonomy, the evidence-strength ladder, the Mom Test, and the math of false positives.

**(1) The pricing unit now has value validation built into it.**

[Intercom Fin](https://fin.ai/pricing) charges **$0.99 per outcome**, and only when Fin actually delivers a result — the [official documentation](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes) states plainly, "You will never be charged for an outcome that didn't happen," with at most one outcome billed per conversation. In March 2026 they expanded the billing unit from resolution to outcome; [their reasoning](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/) is that a configured handoff is also value delivered, and shouldn't be uncounted just because a human got involved.

The contrast is [Salesforce Agentforce](https://www.salesforce.com/agentforce/pricing/): $2 per conversation, or Flex Credits ($500 per 100k credits, a standard action costing 20 credits ≈ $0.10) — **billed regardless of whether the issue is resolved**.

Zendesk takes a third path: [$1.50 per automated resolution](https://www.zendesk.com/blog/ai/productivity/cost-per-resolution/), billed only when the AI resolves the issue on its own without escalating to a human. The interesting part is how "resolved" gets established — [official documentation](https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents) states that conversations flagged as resolved are verified by an LLM, paired with a quiet period (the customer has to not reopen the conversation for it to count). In other words, **once outcome becomes the billing unit, whether the outcome actually happened becomes a judgment that itself needs evaluating** — a thread that runs straight into the evals section below.

The implication for value validation is bigger than it looks: when the billing unit equals the value unit, **revenue itself becomes the value metric** and you don't need to design a proxy. The cost is that viability risk shifts entirely to gross margin — every unpaid attempt still burned tokens.

**(2) Retention distribution is extremely bimodal, and the median will mislead you.**

This is the set of numbers requiring the most care in this research, because three sources appear to contradict each other:

- [RevenueCat's 2026 State of Subscription Apps](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) (median across all subscription apps): AI apps show **41%** higher annual realized LTV ($30.16 vs $21.37) and **52%** better trial-to-paid conversion, but 12-month annual-plan retention of only **21.1%** (vs 30.7% for non-AI) and 20% higher refund rates (4.2% vs 3.5%).
- [Kyle Poyar's analysis of 3,500 companies](https://www.growthunhinged.com/p/the-ai-churn-wave): AI-native median GRR of just **40%** and NRR of 48% — worse than B2C SaaS.
- [a16z's Retention Is All You Need](https://a16z.com/ai-retention-benchmarks/) (companies above $1M ARR): strong retention, including the rare smiling curve.

They don't contradict each other — the **samples are different**. And once Poyar splits by price, the "AI churn problem" cleaves into two distinct worlds:

| Price band | GRR | NRR |
|---|---|---|
| < $50 / month | 23% | 32% |
| $50–249 / month | 45% | 61% |
| > $250 / month | **70%** | **85%** |

That last row is essentially indistinguishable from healthy B2B SaaS. In Poyar's framing: AI products aren't inherently doomed to churn — **consumer-facing AI wrappers are**. (He notes each bucket holds roughly 50 companies, making the data directional rather than statistically bulletproof.)

Which means "is AI product retention good or bad?" is a question guaranteed to produce a misleading answer. The question to ask is: within my price band and my customer type, where does the retention distribution land?

a16z's methodological correction is worth adopting directly: **rebase retention from M0 to M3**. The reasoning is that the first three months are contaminated by "AI tourists" — people who pay $20 to try something for a month and leave — and the real customer base only emerges after M3. They then use **M12/M3** as an early predictor of long-term retention quality, observing that curves typically begin flattening around M3.

**(3) Evals add a validation layer that didn't previously exist.**

[Hamel Husain's position](https://hamel.dev/blog/posts/evals-faq/) is counterintuitive — **don't practice eval-driven development** (writing evaluators before implementing features):

> Unlike traditional software where failure modes are predictable, LLMs have infinite surface area for potential failures. You can't anticipate what will break.

The correct order starts with error analysis: manually review 20–50 traces, accumulate at least 100, and continue until roughly 20 traces stop surfacing new failure categories (theoretical saturation). **Write evaluators only for errors you actually observed.**

The architecture is three levels: L1 assertions (run on every code change) → L2 human and model eval (on a set cadence) → L3 A/B tests (after significant changes), with cost L3 > L2 > L1.

LLM-as-judge itself also needs validating. The method is a gold set of ~100 human-labeled examples, measured on **TPR/TNR rather than agreement** — because if a failure occurs only 10% of the time, a judge that always answers "pass" scores 90% accuracy. Hamel calls agreement the trap metric outright.

The most important line comes last: **offline eval scores are only a proxy for user happiness, and you must periodically verify that the proxy holds.** If offline metrics improve 30% while online user behavior doesn't move, that isn't a win — it's a signal to go back to error analysis.

Conceptually this is value validation pushed into the interior of AI products. You're not only validating whether users want the feature; you're validating whether the ruler you use to measure that feature is measuring value at all.

## Overall

Eight things worth taking away:

1. **The unit of value validation is an assumption, not an idea.** Do assumption mapping first, and test the one that kills you if you're wrong — not the one that's comfortable to test.
2. **Evidence strength runs on one axis: opinions < intentions < behavior.** Compliments aren't data; commitments are. The currencies, by weight: time < reputation < money.
3. **Set the criterion before you launch**, or the experiment degrades into a confirmation-bias machine.
4. **Surveys narrow the range; behavior makes the decision.** Every WTP survey is biased, and the direction depends on the method — direct questions get lowballed, hypothetical choices get inflated. If you can calibrate with a pre-sale, calibrate.
5. **Compute your base rate.** At a 10% success rate, a p<0.05 "win" has roughly a 22% chance of being fake. Skip this and you'll mistake noise for product insight.
6. **Use the 40% test as a diagnostic gauge, not a gate.** Tracking your own change over time works; the cross-company pass mark has no public evidence behind it, and even Nubank had to shift it to 50% for cultural reasons. It's also a B2C tool — **B2B should use six reference customers**, where the hardest condition is that they'll recommend you by name, unprompted.
7. **The behavioral PMF criterion is a conjunction of three things**: the curve flattens + new-customer cohorts grow + you can acquire within your payback period. Missing one means it doesn't count.
8. **Three corrections for AI products**: rebase retention to M3; use price band rather than "is it AI" to pick your comparison group; treat evals as the inner layer of value validation, and periodically verify that the eval is a good proxy.

If only one line survives: **validation isn't there to prove you right, it's there to make being wrong cheaper.** A process that always validates successfully has only proven that it isn't validating.

## Changelog

- 2026-07-25: Added the section "The B2B Criterion Is Different: Six Reference Customers" (Cagan's four conditions for a reference customer, and the inference not to turn on sales before you have six); added Nubank's cultural recalibration of the 40% threshold to 50%; added Zendesk's $1.50 per automated resolution and its LLM verification mechanism to the AI pricing section; added Kloss & Kunter (2016) as positive evidence for Van Westendorp along with the authors' own "two biases cancelling out" caveat, since the section previously presented only the critical side.

## References

**Frameworks and definitions**

- [The Four Big Risks — Marty Cagan / SVPG](https://www.svpg.com/four-big-risks/)
- [Product Risk Taxonomy — Marty Cagan / SVPG](https://www.svpg.com/product-risk-taxonomies/)
- [Planning Product Discovery — Marty Cagan / SVPG](https://www.svpg.com/planning-product-discovery/)
- [Opportunity Solution Trees — Teresa Torres / Product Talk](https://www.producttalk.org/opportunity-solution-trees/)
- [Discovering Solutions — Teresa Torres / Product Talk](https://www.producttalk.org/discovering-solutions/)

**Experiment methods**

- [Testing Business Ideas — Strategyzer (Osterwalder & Bland, 2019)](https://www.strategyzer.com/library/testing-business-ideas-book)
- [How to Select the Next Best Test from the Experiment Library — David Bland / Strategyzer](https://www.strategyzer.com/library/how-to-select-the-next-best-test-from-the-experiment-library)
- [Testing Business Ideas official book excerpt (PDF) — Wiley](https://catalogimages.wiley.com/images/db/pdf/9781119551447.excerpt.pdf)
- [The Mom Test — Rob Fitzpatrick](https://www.momtestbook.com/)
- [Is Fake Door Testing Still Worth Doing in The Vibe-Coding Era? — Userpilot](https://userpilot.com/blog/fake-door-testing/)

**Pricing and willingness to pay**

- [Incentive alignment in conjoint analysis: a meta-analysis on predictive validity — Marketing Letters, 2025](https://doi.org/10.1007/s11002-025-09764-8)
- [Pricing Models in Marketing Research — Lipovetsky, Magnan, Zanetti-Polzi](https://content.scirp.org/pdf/iim20110500007_64675493.pdf)
- [Making the Case Against the Van Westendorp Price Sensitivity Meter — Michaela Mora](https://www.relevantinsights.com/articles/van-westendorp-price-sensitivity-meter/)
- [The Van Westendorp Price-Sensitivity Meter As A Direct Measure Of Willingness-To-Pay — Kloss & Kunter, 2016](https://iabe.org/IABE-DOI/article.aspx?DOI=EJM-16-2.4)

**PMF criteria**

- [Using Product/Market Fit to Drive Sustainable Growth — Sean Ellis](https://medium.com/growthhackers/using-product-market-fit-to-drive-sustainable-growth-58e9124ee8db)
- [How Superhuman Built an Engine to Find Product Market Fit — Rahul Vohra / First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)
- [Casey's Guide to Finding Product/Market Fit — Casey Winters](https://www.caseyaccidental.com/p/caseys-guide-to-finding-product-market-fit)
- [Product-Market Fit Requires Arbitrage — Casey Winters](https://www.caseyaccidental.com/p/product-market-fit-arbitrage)
- [What is good retention — Lenny Rachitsky × Casey Winters](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29)
- [Product Market Fit Survey: Why the 40% Test Gives False Positives — Tristan Kromer / Kromatic](https://kromatic.com/blog/false-positives-and-product-market-fit/)
- [PMF: Product/Market Folklore — Ian Reppel](https://ianreppel.org/product-market-folklore/)
- [The Power of Reference Customers — Marty Cagan / SVPG](https://www.svpg.com/the-power-of-reference-customers/)
- [Product Market Fit — Marty Cagan / SVPG](https://www.svpg.com/product-market-fit/)
- [Be fundamentally different, not incrementally better — Jag Duggal (Nubank) / Lenny's Podcast](https://www.lennysnewsletter.com/p/be-fundamentally-different-jag-duggal)

**Experiment validity**

- [Online Experimentation at Microsoft — Kohavi, Crook, Longbotham](https://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf)
- [Lessons from Running Thousands of A/B Tests — Ronny Kohavi](https://exp-platform.com/Documents/2014-10-11MITCodeKohaviExP.pdf)
- [Online randomized controlled experiments at scale — Kohavi, Tang, Xu, Hemkens, Ioannidis / Trials, 2020](https://doi.org/10.1186/s13063-020-4084-y)
- [Designing A/B testing experiments for long-term growth — GrowthBook](https://www.growthbook.io/blog/designing-a-b-testing-experiments-for-long-term-growth)

**AI products**

- [Fin AI Agent Pricing — Intercom](https://fin.ai/pricing)
- [Fin AI Agent outcomes — Intercom official docs](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
- [From resolutions to outcomes — Intercom Blog](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/)
- [Agentforce Pricing — Salesforce](https://www.salesforce.com/agentforce/pricing/)
- [Cost per resolution — Zendesk](https://www.zendesk.com/blog/ai/productivity/cost-per-resolution/)
- [About automated resolutions for AI agents — Zendesk official docs](https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents)
- [Retention Is All You Need — a16z](https://a16z.com/ai-retention-benchmarks/)
- [The AI churn wave? — Kyle Poyar / Growth Unhinged](https://www.growthunhinged.com/p/the-ai-churn-wave)
- [State of Subscription Apps 2026 — RevenueCat](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026)
- [LLM Evals: Everything You Need to Know — Hamel Husain & Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/)
- [Your AI Product Needs Evals — Hamel Husain](https://hamel.dev/blog/posts/evals/)

**Related posts on this site**

- [Dissecting Anthropic's Founder's Playbook: Four Stages, Three Moats, and One Cowork Compliance Pitfall](/posts/ai/2026-05-18-anthropic-founders-playbook-en)
- [Product Builder: As AI Enables Anyone to Build from 0 to 1, Product Roles Are Being Reorganized](/posts/product/2026-07-25-product-builder-hybrid-role-en)
