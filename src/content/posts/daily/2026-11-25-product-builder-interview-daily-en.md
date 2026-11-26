---
title: "Product Builder Interview Daily — 2026-11-25: Strategy & Execution"
date: 2026-11-25
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Strategy & Execution practice: use Helmer's seven powers to audit what you can actually defend, redraw competitors and target customers with April Dunford's five positioning components, and break down a threat question where a foundation-model vendor ships an overlapping feature. The case is Webflow's CEO on choosing a customer segment and building where the labs won't."
tldr: "When a foundation-model company ships an overlapping feature, don't jump to differentiation. Audit honestly which of the seven powers you hold, use the five positioning components to turn rivals into the alternatives customers really compare you with and narrow to the customers who care most about your value. The case is Webflow's CEO betting on marketing teams at larger companies and on what happens after AI builds version one."
series:
  name: "Product Builder 面試日練"
  order: 98
---

> :globe: [中文版](/posts/daily/2026-11-25-product-builder-interview-daily)

## Today's Topic

A common Strategy-round format hands you a product under threat and asks, "What do you do now?" Most candidates leap to a roadmap, but the interviewer is looking at the step before it: can you say why this product is defensible, and which customers you are defending it for? Today's scenario matches a worry common in AI product circles: your product sits on top of a foundation model, and the model vendor suddenly ships a native feature that overlaps yours.

## Core Frameworks

**Framework 1: The seven powers (adapted from Helmer's *7 Powers*)**

YC's Lightcone podcast ran Hamilton Helmer's seven powers against AI startups, and said that in the earliest days speed is the best moat, with the other seven mattering once you have built something people want. Helmer's definition hinges on a power having both a benefit and a barrier that stops others from copying or neutralizing it. Missing either one means it isn't a power.

| Power | In one line | AI-product example (as cited in the Lightcone episode) |
|---|---|---|
| Process power | Doing something more efficiently in a way rivals can't easily copy | Honing an agent through the last stretch to reliable operation, such as bank KYC and loan origination |
| Cornered resource | Exclusive access to a vital resource | Qualifying to serve regulated customers such as the Department of Defense |
| Switching costs | Customers can't leave without a significant cost | Deeply customized workflows that are painful to rebuild after go-live |
| Counter-positioning | Your model hurts an incumbent if it copies you | Pricing by work completed against incumbents that price per seat |
| Branding | The brand itself attracts and retains customers | ChatGPT's daily users outnumbering Gemini's |
| Network economies | More users make the product more valuable | A data flywheel feeding usage back into models |
| Scale economies | Scale lowers per-unit cost | Frontier-model training and web crawling, which have high fixed costs |

On Lenny's Podcast, Helmer also notes that tech startups commonly move in an order: counter-positioning first to survive incumbents, then scale economies, then switching costs, and finally network economies. Brand, process power, and cornered resources are usually rare for young companies. That episode also has a chapter titled "Why moving fast is not a power," which sits alongside YC's treatment of speed as the first moat. In an interview, name the difference yourself.

**Framework 2: April Dunford's five positioning components**

In *Obviously Awesome*, Dunford breaks positioning into five interdependent components, and the order matters:

1. **Competitive alternatives**: what customers would do if your product didn't exist (it may be a spreadsheet, or nothing at all)
2. **Differentiated capabilities**: what you have that the alternatives don't
3. **Value for customers**: what those capabilities mean to the customer
4. **Target customer segmentation**: the customers who care a lot about that value
5. **Market category**: the frame of reference that makes your value obvious to them

She stresses that step one is the alternatives your customers see, not every competitor you can imagine.

## Today's Practice Question

### Question

You are the product lead at an AI contract-review startup built on a third-party foundation model. This morning the model vendor launches a native "document review" feature: drop a contract into the chat interface and it flags risky clauses. Your team estimates it overlaps about 60% of your product's use cases. Your board asks: is this an existential threat to us, and what is our strategy?

(Source: self-written, adapted from the "will the model labs absorb your product" worry discussed in the Lightcone episode; numbers are hypothetical.)

### Breakdown

1. **Clarify the problem**: Ask which layer overlaps. Is it only "flag risk," or does it include review workflow, version comparison, and integration with legal systems? What share of revenue sits in that 60%?
2. **Redraw the alternatives**: Use Dunford's first step to list the model's native feature as a formal alternative, then ask what customers are actually comparing when they weigh us against it.
3. **Audit the powers**: Go through the seven and ask whether we have a benefit and a barrier for each. Admit what we lack (brand, scale) rather than forcing a fit.
4. **Narrow customers and value**: Find the customers who care most about our differentiated value, give up the rest, and put resources behind that group.
5. **Define success**: Measure retention, renewals, and workflow depth per customer, not just new logos.

### Sample Answer (how you might say it in the interview)

> **Judge the layer of the threat first**: "I wouldn't call this existential or not until I know which layer overlaps. If it only flags risky clauses in a chat window, that is the top slice of our value chain. Customers now have one more alternative to weigh us against, and we have to answer again why they wouldn't just use it."
>
> **Take stock of what we hold**: "I'd audit honestly against the seven powers. We have no brand and no scale economies, so I wouldn't argue those. What we might have is switching costs, meaning the rebuild cost once a customer has wired in review workflows, clause libraries, and internal sign-off, and process power, meaning the last stretch from demo accuracy to something legal teams will put in production. Both need evidence, like onboarding time and renewal rate. If there's none, we don't have it."
>
> **Narrow the customer**: "A native model feature will eat people who just want to glance at one contract now and then. I wouldn't fight for them. I'd put resources behind legal teams that collaborate, need sign-offs, and need audit trails, because that's where a general chat interface is unlikely to focus soon. Next quarter I'd measure two things: renewal in that group, and how much of their review workflow moves onto us."

### Self-Check List

Use this table to check whether your answer missed any key points:

| Check item | Covered? |
|---------|---------|
| Clarify which layer overlaps before claiming differentiation | |
| List the model's native feature as a competitive alternative | |
| Audit each power and admit the ones you lack | |
| Narrow to a specific customer segment and say which you give up | |
| Concrete success metrics (renewal, workflow depth), not just new logos | |
| Bonus: separate powers you hold now from ones you must build | |

## Today's Case

**Webflow: betting on marketing teams at larger companies, and on what happens after AI builds version one**

Aakash Gupta published his interview with Webflow CEO Linda Tong on November 10, 2026. Tong's starting point is that AI is very good at version one of a website, but most of Webflow's business happens after publish. In her words: "The majority of our business sits after you hit publish."

On customers, Webflow looked back at who used it and found designers, developers, and product managers, but the work they were actually doing was marketing. The target became marketing teams at larger companies, where dozens to hundreds of people work on one site. According to the write-up, Tong described going all in as terrifying, but her rule is to build for the target customer first and let adjacent users follow. She also said: "As a vertical solution, I do think it puts us in a space where I don't see a frontier lab directly coming after us. Maybe they will eventually."

The article lays out a test for finding your own buyer: pull usage by the job people do with the product, put job titles next to each job, treat the job many titles share as your buyer, and list what the labs won't build for that buyer, such as governance and collaboration. Note that this last step is the article author's method, not Tong's own words.

**Interview angle**: borrow this structure when asked "what do you do when a big player moves in?" Against Dunford, AI site builders are the customer's alternative and marketing teams at larger companies are the target segment. Against Helmer, it is a search for a need a general tool is unlikely to prioritize soon. That mapping is this article's reading; Tong herself did not use those frameworks.

## Further Reading

- [The 7 Most Powerful Moats For AI Startups - Y Combinator (YouTube)](https://www.youtube.com/watch?v=bxBzsSsqQAM) — the original Lightcone episode, with chapters on each moat as it applies to AI startups
- [A Quickstart Guide to Positioning - April Dunford](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning) — the author's own primer on the five positioning components, with a Siebel competitor example
- [Business strategy with Hamilton Helmer - Lenny's Newsletter](https://www.lennysnewsletter.com/p/business-strategy-with-hamilton-helmer) — Helmer on the seven powers, benefit and barrier, in summary form

## References

- [How SaaS Companies Can Survive AI: Webflow CEO's Playbook - Aakash Gupta](https://www.news.aakashg.com/p/can-saas-survive-the-ai-era) — source for the interview date, quotes, and customer-finding test in "Today's Case"
- [The 7 Most Powerful Moats For AI Startups - Y Combinator](https://www.youtube.com/watch?v=bxBzsSsqQAM) — source for speed and the seven moats in "Core Frameworks," plus the video chapters and description
- [Barbarians at the Prompt - YesPress](https://yespress.io/seven-powers-how-ai-startups-build-moats) — summary of the episode behind the AI-product examples in the table (third-party summary)
- [Business strategy with Hamilton Helmer - Lenny's Newsletter](https://www.lennysnewsletter.com/p/business-strategy-with-hamilton-helmer) — source for the seven definitions, benefit and barrier, and the order of powers
- [A Quickstart Guide to Positioning - April Dunford](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning) — source for the five positioning components and starting from the customer's alternatives
