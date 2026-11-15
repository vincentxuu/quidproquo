---
title: "Funding Alert: Mercor Raises $750M Series D at $20B Valuation (NVIDIA, Salesforce Join)"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, funding, daily, mercor, agent-evaluation]
lang: en
description: "AI data and evaluation company Mercor raised a $750M Series D, doubling its valuation from $10B to $20B in a year, with NVIDIA, Salesforce, and Benchmark among participants, as it shifts from supplying human data for frontier-model training to helping enterprises evaluate and train their own AI agents"
tldr: "Mercor raised a $750M Series D, doubling its valuation from $10B a year ago to $20B, with NVIDIA, Salesforce, Benchmark, and General Catalyst among participants. The signal: the buyer base for AI evaluation and training infrastructure is spreading from frontier labs to ordinary enterprises, and Mercor wants to turn itself from 'the company that finds labelers for OpenAI and Anthropic' into the infrastructure layer every company uses to train its own agents."
series:
  name: "AI Agent Funding"
  order: 137
---

> 🌏 [中文版](/posts/daily/2026-11-15-funding-mercor)

## Funding Details

| Item | Value |
|---|---|
| Company | Mercor (US, San Francisco) |
| Round | Series D |
| Amount | $750M |
| Lead | No single named lead; multiple institutions participated |
| Participants | Benchmark, Felicis, Fundomo, funds affiliated with Apollo, G Squared, General Catalyst, Glade Brook Capital, NVIDIA, Salesforce, Sapphire Ventures, StepStone Group, XTX Ventures, Zoom |
| Valuation | $20B (up from $10B at the prior Series C, doubling within a year) |
| Total raised | Not fully disclosed (known: Series C $350M + this round $750M, at least $1.1B) |
| Founded | 2023 |
| Employees | 700 (per Tech Funding News) |

## What the company does

Mercor supplies AI training and evaluation data — using a network of more than five million domain experts to help frontier AI labs and enterprises train and evaluate models and agents.

Its core logic is that every industry will need its own agents, and judging whether an agent performs well in that industry requires real experts from that industry. Mercor's original business connected AI companies with domain professionals who supplied the knowledge used to train frontier models. This year it acquired Deeptune — a team that spent two years rebuilding hundreds of enterprise applications as agent-training environments — to extend that capability into building custom evaluation benchmarks for ordinary enterprises, based on their own actual workflows, to judge whether an AI agent is actually good enough against a specific company's systems, policies, and quality bar.

Its customer base now spans frontier labs, large tech companies, open-model developers, and Fortune 500 enterprises. In July, the company disclosed an annualized revenue run rate above $2B (though roughly 60–70% of that is shared out to the contracted experts, putting estimated net revenue at $600M–$800M). This year it also opened offices in New York and London beyond San Francisco. In the AI data/evaluation market, its main rivals are Scale AI (in which Meta holds a 49% stake, at roughly a $14B valuation) and Surge AI, which is reportedly in talks for a valuation above $25B.

## What this round signals

### What it means for the agent ecosystem

The narrative behind this round clearly shifts from "supplier of training data for model companies" to "infrastructure layer every enterprise uses to train and evaluate its own agents." Mercor's bet is that as open models keep getting stronger, enterprises no longer need to train models from scratch — they post-train a sufficiently capable open model instead. What becomes genuinely scarce at that point isn't compute or the model itself, but the custom evaluation capability to answer "is this agent actually good at my company's workflow" — exactly the position Mercor wants to own.

### What the investors are betting on

The list of participants — NVIDIA, Salesforce, Zoom — is itself a signal. They aren't just financial investors; they look more like potential customers and ecosystem partners, using the investment to lock in a future relationship where they use Mercor to evaluate their own agent products. Sapphire Ventures president Jai Das said "Mercor has built something hard to replicate," and Mercor co-founder Adarsh Hiremath put the logic more directly: "every company deploying AI needs to know whether it works, and the answer is different for each one" — a statement that is itself a pitch for why customized evaluation is a necessary business.

### Numbers worth watching

```diagram
title: Mercor's valuation over the past year
desc: From $10B at Series C to $20B at Series D — doubling in roughly a year.
caption: Figures from Mercor's official blog (2026-11-10) and Tech Funding News reporting.
---
<svg viewBox="0 0 640 220">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">Valuation ($B)</text>
  <line class="dg-grid" x1="306" y1="40" x2="306" y2="192"/>
  <text class="dg-small" x="306" y="206" text-anchor="middle">10</text>

  <rect class="dg-bar dg-bar--soft dg-c-muted" x="160" y="46" width="146" height="40"/>
  <rect class="dg-bar dg-c-accent" x="160" y="118" width="292" height="40"/>
  <line class="dg-axis" x1="160" y1="40" x2="160" y2="192"/>

  <text class="dg-sub" x="314" y="66" dominant-baseline="central">$10B (2025-10, Series C)</text>
  <text class="dg-label dg-text--accent" x="460" y="138" dominant-baseline="central">$20B (2026-11, Series D)</text>
</svg>
```

- The valuation doubled from $10B to $20B in roughly a year — faster than most AI infrastructure companies' valuation growth, showing investors treat "agent evaluation" as a scarce resource on par with the models themselves
- Gross annualized revenue of $2B, net of the 60–70% paid out to experts, puts estimated net revenue at $600M–$800M — implying a valuation-to-net-revenue multiple of roughly 25–33x, higher than the multiple Scale AI commanded when Meta invested
- Rival Surge AI is reportedly in talks for a valuation above $25B — higher than Mercor's current $20B — showing the valuation race in this subsector is far from settled

## Watchlist status

Mercor is already tracked in watchlist section D3, where the recorded focus — "AI recruiting platform, $350M Series C, $2B valuation" — is now outdated. We'd recommend updating it to "AI evaluation/post-training infrastructure, $750M Series D, $20B valuation (doubled in a year)," and repositioning it from a simple recruiting/labeling platform to an infrastructure layer for enterprise agent evaluation and post-training.

## Today's takeaway

The most interesting signal in this round isn't the doubled valuation itself — it's that Mercor is demonstrating a path for repackaging a human-labeling business into enterprise infrastructure. As models themselves become increasingly commoditized, the scarce, billable thing shifts from "who can train the strongest model" to "who can prove this agent actually works in my workflow." Mercor is betting that the latter is the business of the next decade.

## References

- [Organizing human intelligence for the entire economy](https://www.mercor.com/blog/series-d/)
- [Mercor doubles valuation to $20B with $750M Series D to train and test AI agents for enterprises](https://techfundingnews.com/mercor-doubles-valuation-to-20b-with-750m-series-d-to-train-and-test-ai-agents-for-enterprises/)
- [Mercor raises $750m at a $20bn valuation to train AI on every job](https://thenextweb.com/news/mercor-750m-series-d-20bn-valuation)
