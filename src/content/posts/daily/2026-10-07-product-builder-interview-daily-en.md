---
title: "Product Builder Interview Drill — 2026-10-07: Strategy & Execution"
date: 2026-10-07
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Practice a real Google Product Strategy interview question — as the Bing PM, Google dominates search, how do you grow Bing's share — using Porter's Five Forces paired with TAM-SAM-SOM. The case: Avis turned its 1960s underdog position ('We're No. 2. We try harder.') into two decades of share growth."
tldr: "The easiest way to lose points in a Strategy & Execution interview isn't failing to analyze the market structure — it's finishing the five-forces analysis and then proposing a plan that attacks the market leader head-on anyway. Today's drill is a real Google Product Strategy interview question: 'As the Bing PM, Google has overwhelming search market share — how do you grow Bing's share?' The framework starts with Porter's Five Forces to find which structural constraints actually matter in search — barrier to entry (data plus distribution) and threat of substitutes (AI chat assistants bypassing search entirely) — then uses TAM-SAM-SOM to turn 'grow market share' into 'which users, on which channel, does Bing already hold a structural edge on.' The case is Avis: as the 1960s number-two player in car rental, Avis didn't compete on fleet size or locations — it ran 'We're No. 2. We try harder,' turning a structural disadvantage straight into proof of service motivation, a positioning that carried two decades of share growth. That's the live version of what the question is testing: as a market challenger, asymmetric positioning beats a head-on fight."
series:
  name: "Product Builder Interview Daily"
  order: 49
---

> 🌏 [中文版](/posts/daily/2026-10-07-product-builder-interview-daily)

## Today's Focus

In Strategy & Execution interviews, the trap answer that sounds right but isn't is the one where a candidate correctly breaks down the market structure, picks the right framework — and then concludes "so we should out-execute the leader on the exact thing they're already best at." It sounds diligent, but it dodges the question the interviewer is actually asking: when you're the challenger with a fraction of the leader's resources and distribution, fighting symmetrically is how you lose faster.

This matters because real strategic decisions are rarely "can we build a better product" engineering questions. They're positioning questions: given this market structure, is there an asymmetric way to win? Being able to first identify where the structural advantage actually sits, then narrow your resources to the one slice where you genuinely have a shot, is a direct signal of real competitive-strategy experience — not just a feature-comparison table.

## Framework Cheat Sheet

### Porter's Five Forces

When you get a "how do we win in this market" question, break down the market structure first — don't jump straight to "what feature should we build."

| Force | Question to ask | How it maps onto search |
|------|----------|-----------------|
| **Rivalry among incumbents** | What do existing players actually compete on — price, technology, or distribution? | Search quality stopped being the deciding factor; the real fight is who gets to be the user's default |
| **Threat of new entrants** | What barrier does a new player have to clear to get in? | You need enormous behavioral data to train a ranking model, plus a channel that reaches users by default — both are nearly impossible to build from zero |
| **Threat of substitutes** | Is there something that bypasses the whole category and satisfies the same need directly? | AI chat assistants hand users an answer directly; users may skip "search, then click into a page" entirely |
| **Supplier power** | Who controls the resources your product depends on? | Advertisers and content sites are search's "suppliers" — they control content and ad-budget allocation |
| **Buyer power** | How costly is it for a user to switch to a competitor? | Switching search engines costs almost nothing — change one default setting — so buyer power is extremely high |

**How to use it in the interview**: state what your real structural disadvantage is in this market first, then state which force is actually working in your favor. That shows more market-structure understanding than jumping straight to "we'll build a better product."

### TAM-SAM-SOM

Once the five forces locate your structural strengths and weaknesses, use these three layers to turn "grow market share" from a slogan into a concrete play:

1. **TAM (Total Addressable Market)**: the entire category's total demand, regardless of who's serving it.
2. **SAM (Serviceable Available Market)**: subtract the part your capabilities or regulations can't reach at all — what's left is theoretically reachable.
3. **SOM (Serviceable Obtainable Market)**: given your actual distribution, resources, and competitive position, the slice you genuinely have a shot at winning — usually the segment the leader serves reluctantly, or structurally can't serve well, because of its own positioning.

**How to use it in the interview**: a challenger shouldn't target the TAM — that's the leader's game. Instead, point precisely at the SOM: which user segment is the leader structurally unable or unwilling to serve well, because of its own product positioning or business model. That's the slice a challenger can actually take.

## Today's Practice Question

### The Question

"As the Bing PM, Google has overwhelming search market share and Bing holds roughly 5%. What would you do to grow Bing's market share?"

(Source: Google Product Strategy interview question, [Google Product Strategy Interview Guide, aced.io (formerly Exponent)](https://www.aced.io/guides/google-product-strategy-interview))

### How to Break It Down

1. **Clarify the question**: ask the interviewer whether "market share" means query volume, revenue, or active users, and whether the time horizon is a one-year tactical push or a five-year strategic bet — the playbook differs completely depending on the answer.
2. **Define the users**: split them into "users who've never switched their default search engine" versus "users who actively compared alternatives and still stayed with Google" — the first group is about distribution and defaults, the second is about actual product differentiation.
3. **Structure the analysis**: Five Forces shows that threat of new entrants isn't really Bing's problem — Bing isn't a new entrant, and Microsoft already owns the default-channel advantage through Windows and Edge. The force worth watching is threat of substitutes: AI chat assistants are letting users bypass "searching" as an action altogether, which is actually an opportunity for Bing, since Microsoft has already folded Copilot into Windows and Office without needing to build a new AI distribution channel from scratch.
4. **Propose a plan**: don't fight Google on "search result quality," a battlefield Google has already won for two decades. Instead, narrow resources to the SOM layer of TAM-SAM-SOM — enterprise users and heavy Windows/Office users. This group already lives inside the Microsoft ecosystem, so switching costs are low (no extra install or sign-in needed), and Google's ad-revenue business model gives it weak incentive to fold search results directly into a workflow and reduce ad impressions — which is exactly the position Bing/Copilot can structurally take and Google structurally won't.
5. **Define success**: success isn't "overall search market share goes from 5% to 10%" — a metric that puts you in a head-on fight with Google. It's "the share of Windows/Office/Copilot power users who default to Bing/Copilot as their query entry point." Growth on that metric means you actually captured the SOM Google structurally can't serve, rather than buying a few points of share with marketing spend.

### Sample Answer (Say It Like This in the Interview)

> **Clarifying and framing**: "I'd first confirm what 'grow market share' means — query volume, revenue, or active users — because what Microsoft can actually monetize is getting Bing/Copilot embedded into Windows and Office workflows, not just chasing raw query volume, a number Google has owned for two decades."
>
> **Market structure analysis**: "I'd use Five Forces to rule out a common misread first — people often assume Bing's problem is 'a new entrant can't beat an incumbent,' but Bing sits behind Microsoft, which already owns the default channel through Windows and Edge. What actually deserves attention is threat of substitutes: AI chat assistants are letting users skip 'open a browser and type a query' entirely, and Microsoft has already folded Copilot into the operating system and office software — a distribution advantage that's hard for a business built on search-engine advertising to replicate."
>
> **Plan and trade-off**: "So I wouldn't propose 'how do we make Bing's search results better than Google's' — a head-on fight. I'd target the SOM in TAM-SAM-SOM that's actually reachable: enterprise and heavy Windows/Office users. Switching costs are low for this group, and Google's ad-revenue-driven business model gives it weak incentive to fold search results directly into a workflow and cut its own ad impressions — that's exactly the position Bing can structurally take and Google structurally won't. I'd measure success as 'the share of this group that defaults to Bing/Copilot as their query entry point,' not overall search share, which just puts us in a head-on fight with Google."

### Self-Check Checklist

Use this table to check whether your answer missed anything important:

| Check item | Covered? |
|---------|---------|
| Clarified what "grow market share" means — which metric, which time horizon | |
| Used Five Forces to name which force actually favors you, not just a list of disadvantages | |
| Used TAM-SAM-SOM to narrow the target to the SOM the leader structurally can't serve, not the overall market share | |
| The plan is asymmetric positioning, not competing head-on on the dimension the leader already won | |
| The success metric maps to the SOM, not the leader's own scoreboard | |
| Bonus: named why the leader's own business model gives it weak incentive on this SOM | |

## Today's Case

**Avis: "We're No. 2. We try harder." — turning a structural disadvantage into two decades of share growth**

In the 1960s, Avis was a distant second to Hertz in car rental. Instead of competing head-on on fleet size, number of locations, or price, Avis openly admitted it was No. 2 and ran "We're No. 2. We try harder." — translating "we're smaller than the leader" directly into "which is why we take care of every single customer more carefully," a trust signal built on the disadvantage itself. That positioning drove Avis's market-share growth for the next two decades.

**Interview connection**: this case runs on the exact same decision logic as today's practice question — Avis didn't try to win on the dimension Hertz had already won (scale), it repositioned the disadvantage itself as proof of differentiation. When answering "how does the market's number two win" questions like the Bing one, you can cite this case directly: "What a challenger actually needs isn't to win on the leader's home turf — it's to find a position only the challenger would dare claim, and only the challenger can actually deliver on."

## Further Reading

- [Google Product Strategy Interview Guide | Sample Questions (2026)](https://www.aced.io/guides/google-product-strategy-interview) — the source of today's practice question, with the full real question bank across every round of Google's Product Strategy interview
- [Product Positioning Examples: 15 Real Brands Analyzed (2026)](https://www.articos.com/blog/product-positioning-examples) — the full context behind Avis vs. Hertz, alongside other competitive-positioning cases like Tesla and Figma vs. Sketch
- [Market Entry Case Interview: The Complete Guide (2026)](https://www.caseinterviewhub.com/post/market-entry-case-interview) — further practice on market-structure analysis, covering the build/buy/partner trade-off for market entry

## References

- [Google Product Strategy Interview Guide | Sample Questions (2026)](https://www.aced.io/guides/google-product-strategy-interview) — source of today's practice question on growing Bing's market share as its PM
- [Product Positioning Examples: 15 Real Brands Analyzed (2026)](https://www.articos.com/blog/product-positioning-examples) — source and full context for today's case, Avis vs. Hertz's "We're No. 2. We try harder."
- [Market Entry Case Interview: The Complete Guide (2026)](https://www.caseinterviewhub.com/post/market-entry-case-interview) — source for the market-structure analysis and entry-mode trade-offs in the framework cheat sheet
