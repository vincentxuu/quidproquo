---
title: "Strategy Interview Guide: From Market Positioning to Competitive Moats"
date: 2026-08-20
category: product
tags: [interview, product-builder, strategy, competitive-analysis]
lang: en
type: deep-dive
description: "Breaking down the Strategy interview — market positioning analysis, competitive moat assessment, market entry decision frameworks, and the ability to hold or revise strategy under follow-up pressure."
tldr: "Strategy interviews don't test whether you can recite frameworks — they test whether you can make judgments with incomplete information. Core skills: market sizing (the practical use of TAM/SAM/SOM, not rote numbers), competitive moat analysis (network effects, switching costs, brand), go/no-go decisions for new markets, and using elimination rather than addition for strategic trade-offs."
series:
  name: "Product Builder Interview Prep"
  order: 5
---

## How Strategy Interviews Work

The Strategy round is the most open round in PM interviews, and also the most likely to spiral out of control. Google's strategy round is typically 45 minutes — the interviewer throws out a big question like "Should Google enter X market," "How should YouTube compete with TikTok," or "If you were the PM for Google Maps, what's your strategy for the next year" — then watches how you decompose it in a structured way.

Unlike Product Sense, strategy isn't asking "what feature to design" but "whether to do it and why." The interviewer will push back at every judgment point: "Why do you think this market is worth entering?" "How will competitors respond?" "What if your assumptions are wrong?" Whether you can withstand the follow-ups depends not on how much industry knowledge you have, but on whether your reasoning structure has internal consistency.

Meta and Amazon also test strategy, but in different forms. Meta typically embeds strategy in the execution round ("How would you prioritize this feature's roadmap and why"), while Amazon tests strategic thinking through Leadership Principles ("Tell me about a time you had to make a decision with incomplete data"). Regardless of format, they're all testing the same underlying thing: your judgment.

## Market Positioning: TAM/SAM/SOM Isn't for Memorizing

When market size comes up in interviews, many people recite the definitions of TAM/SAM/SOM and throw out a number. This is the fastest way to get torn apart by follow-ups — the interviewer will ask "How did you calculate your TAM?" and if it's just a number you googled, the conversation is over.

The right approach is to treat market estimation as a reasoning process, not a lookup:

**Build bottom-up, not top-down.** "The global advertising market is $600 billion" has zero utility for deciding whether to build a product. In interviews, you should assemble it from concrete assumptions: "How many potential users are there? How much might each person pay per year (or contribute in ARPU)? Multiply those and that's your addressable market."

**SAM is the number that actually matters.** TAM is the ceiling, SOM is the floor — neither drives decisions. SAM — how many people your product can actually serve with current capabilities — is the key to deciding "is this worth doing." In interviews, spend your energy arguing the reasonableness of SAM, not the precision of TAM.

**Market size is a conclusion, not a premise.** First understand user needs and willingness to pay, then calculate market size. "Is this problem painful? How much would users pay for a solution? How many people have this problem?" — the answers to these three questions multiplied together give you your SAM, more persuasive than any industry report.

## Competitive Moats: Five Types and How to Assess Them

When the interviewer asks "What's this product's moat?", you need to quickly judge which type applies and then explain why it holds or doesn't.

### Network Effects

Every additional user increases the product's value for all users. Facebook, LinkedIn, and WeChat rely on this. The key follow-up in interviews: "Are your network effects direct (user to user) or indirect (user to developer)?" Indirect network effects are slower to build but harder to break.

### Switching Costs

How expensive is it for users to leave your product? Salesforce relies on enterprises having built their entire workflow on it, with extremely high data migration costs. In interviews, note: switching costs can be financial, temporal, or psychological (learning curve). The strongest switching cost is data lock-in — content and history users have accumulated on your platform can't be taken elsewhere.

### Economies of Scale

The more you produce, the lower the per-unit cost. AWS's data center scale gives it lower per-unit compute costs than any new entrant. In interviews, be able to judge: is this scale advantage linear (large volume but marginal costs don't decrease) or exponential (genuine economies of scale)?

### Brand and Trust

In certain domains, users choose not based on feature differences but on trust. Finance, healthcare, and education are all areas where brand moats are strong. In interviews, distinguish between "brand awareness" and "brand trust" — the former can be bought with marketing, while the latter requires time to accumulate and is difficult to replicate.

### Technical Barriers

Unique technical capabilities or patents. In the AI era, this moat is getting thinner — model capability gaps are measured in months, not years. In interviews, if asked about an AI product's moat, don't just answer "our model is better." Point to barriers beyond the model (data flywheel, distribution channels, user habits).

## Entering New Markets: The Go/No-Go Decision Framework

"Should we enter market X" is one of the most classic strategy round question types. Here's a reusable framework:

**Step one: Is the market structure favorable to new entrants?** If the market is highly concentrated (top two players hold 80% share) with strong network effects, new entrants have almost no chance. If the market is fragmented or undergoing a technology shift (e.g., AI replacing traditional approaches), a window exists.

**Step two: Do we have a structural advantage?** Not "we can do it too," but "why would we do it better than others." Google entering the maps market had a structural advantage (search traffic + street view technology); entering social had none (the fundamental reason Google+ failed). In interviews, honestly pointing out your structural disadvantages scores more than pretending you can do everything.

**Step three: What's the cost and opportunity cost of entering?** Engineering resources are finite — doing A means not doing B. In interviews, don't just argue "why we should do this"; argue "why doing this now is more worthwhile than doing other things." This is a point many candidates miss — they treat entering a new market as an independent decision, but interviewers want to hear how you make trade-offs with limited resources.

**Step four: What's the minimum viable validation?** Don't start by saying "go all in." Good strategic thinking first finds a low-cost validation method — can you add a feature to an existing product to test market response? Can you test in one region first? The interviewer will follow up on your validation metrics: what numbers would make you double down, and what numbers would make you pull out.

## Strategic Trade-offs: Elimination Beats Addition

The biggest trap in Strategy interviews is "do everything." When asked "How should YouTube compete with TikTok," the candidate's instinct is to list many things to do. But truly good strategic thinking uses elimination — being able to clearly state "what not to do" and "why not" is more persuasive than any number of plans.

Concretely:

1. **List 2-3 seemingly viable directions.** Not more — interview time isn't enough to analyze ten.
2. **Find a specific reason to eliminate each.** Not "doesn't feel right," but "this path requires X resources, and we don't have an advantage in X" or "this path's payoff takes 18 months to materialize, but the competitive situation demands results within 6 months."
3. **Keep one direction and explain why it's most reasonable given current constraints.** The interviewer may disagree with your conclusion, but if your elimination logic holds, they'll respect your reasoning.

This method works better than listing because: it demonstrates your judgment, not just imagination. Anyone can think of ten things to do; good strategy knows which nine not to do.

## Common Question Types and Interview Strategy

| Type | Example | What It Tests |
|------|---------|---------------|
| Enter new market | "Should Google make a gaming console" | Go/no-go decision, structural advantage analysis |
| Respond to competition | "How should Instagram respond to TikTok" | Competitive moats, differentiation strategy |
| Product direction | "You're Spotify's PM, what do you do next year" | Priority ranking, resource trade-offs |
| Market assessment | "Estimate the market size of shared electric scooters" | Structured estimation, assumption transparency |

**Interview time management**: For a 45-minute strategy round, recommended allocation is — 3 minutes clarifying the question and defining scope, 10 minutes on market and competitive analysis, 15 minutes proposing strategy and explaining trade-offs, 15 minutes answering follow-ups, 2 minutes summarizing. The most common failure is spending too long in the "analysis" phase with no time left to propose your own strategy.

**One core technique**: When the interviewer pushes back with "Why not choose B?", don't just repeat "because A is better." Articulate B's weaknesses from B's perspective — "B looks viable, but its assumption is X, and I don't believe X holds because Y." This bidirectional reasoning ability is what the strategy round most wants to see.

## Practice Question

### Question

"You're the PM at Notion. Should Notion build a standalone email product?"

**Source**: Self-designed (based on Google strategy round structure)　**Difficulty**: Advanced　**Round**: strategy round

### Solution Framework

1. **Clarify the question**: A full-featured Gmail competitor, or lightweight email integrated into Notion workspace? Is the goal to increase stickiness of existing users, or acquire new ones?
2. **Build a framework**: Use the go/no-go four-step method — market structure, structural advantage, cost and opportunity cost, minimum viable validation.
3. **Go deeper**: Key trade-off — the email market is extremely concentrated (Gmail + Outlook at 80%+), but Notion's structural advantage is that it's already users' work hub; integrating email can strengthen lock-in effects.
4. **Wrap up**: Use elimination to explain why lightweight integration rather than a standalone product, and define validation metrics.

### Sample Answer (How You'd Actually Say It in an Interview)

> **Market structure analysis.** The email market is highly concentrated — Gmail and Outlook together exceed 80% market share, and both are free. A head-on competition has almost no chance because email's network effects are extremely strong (all your contacts are on it) and switching costs are extremely high (migrating email history, updating registration emails across all services). But if we're not building a standalone email client, and instead integrating email into Notion's workspace, the logic changes — users don't need to "switch email," they just need to "also see email within Notion."
>
> **Structural advantage and solution.** Notion's structural advantage is that it's already the work hub for many knowledge workers. If received emails could directly become Notion pages or database items, email transforms from "another app to open" into "part of the workflow." My solution: don't build a standalone email product; build Gmail/Outlook integration — add an inbox view in the Notion sidebar where users can read emails, reply, and convert emails into tasks. The MVP only does Gmail integration (largest user base), not Outlook.
>
> **Elimination rationale and validation.** I eliminated "standalone email product" because its engineering cost is enormous (at least 20+ people for a year) and success probability is extremely low (no new email product has successfully challenged Gmail in the past decade). I also eliminated "email notification integration only" because it's too light and won't change user behavior. Validation metric: after launching the integration, do users who use the email integration have weekly active days 0.5+ higher than those who don't? If yes, it means email integration genuinely strengthens Notion's stickiness and is worth continued investment.

### Self-Check Checklist

| Checkpoint | Mentioned? |
|-----------|------------|
| Analyzed market structure (concentration, network effects, switching costs) | |
| Identified structural advantage (Notion as work hub) | |
| Used elimination to explain what not to do (standalone product, too-light integration) | |
| Proposed specific solution and MVP scope | |
| Defined validation metric and go/no-go threshold | |
| Bonus: Estimated opportunity cost (20+ person team vs building other features) | |

## References

- [Decode and Conquer](https://www.lewis-lin.com/decode-and-conquer) — Lewis C. Lin's classic PM interview reference, with Strategy coverage including market entry decisions, competitive analysis frameworks, and elimination-based strategic thinking
- [Exponent — Product Strategy Interview Guide](https://www.tryexponent.com/courses/product-management-interview/product-strategy) — Question type breakdowns and answer examples for Google and Meta strategy rounds
- [Hamilton Helmer — 7 Powers](https://7powers.com/) — A systematic analytical framework for competitive moats, covering network effects, economies of scale, switching costs, brand, and other strategic advantages
