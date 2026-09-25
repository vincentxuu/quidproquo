---
title: "Funding Brief｜Snorkel AI Raises $350M Series E, Valuation Nearly Triples, Selling the 'Data Factory' Behind Agent Training"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, funding, daily, snorkel-ai, training-data]
lang: en
description: "AI training data company Snorkel AI closed a $350M Series E co-led by Insight Partners and S32, with its valuation nearly tripling from $1.3B to $3.5B in 17 months and annualized revenue up 18x — selling custom training datasets and reinforcement learning environments to AI labs"
tldr: "Snorkel AI raised a $350M Series E co-led by Insight Partners and S32, nearly tripling its valuation from $1.3B (Series D) 17 months ago to $3.5B, with annualized recurring revenue growing 18x in 12 months to $375M. The signal here is that the training bottleneck for frontier models has shifted from 'do we have enough compute' to 'do we have refined enough training data and reinforcement learning environments' — and the data supply chain itself is becoming an infrastructure layer that can raise huge rounds on its own."
series:
  name: "AI Agent Funding"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-09-26-funding-snorkel-ai)

## Funding Details

| Field | Value |
|---|---|
| Company | Snorkel AI (USA) |
| Round | Series E |
| Amount | $350M |
| Lead investors | Insight Partners and S32 (Section 32), co-leading |
| Follow-on | Addition, Lightspeed, Greylock, GV, Wells Fargo, Third Point, March, Blumberg, Allegis, Standard VC, Frontline |
| Valuation | $3.5B (up from $1.3B at its Series D 17 months earlier, nearly a 3x jump) |
| Total raised | Not fully disclosed (Series D was $100M, plus $350M this round) |
| Founded | Commercially launched in 2019, following 4 years of research at a Stanford AI lab |
| Headcount | Not disclosed |

## What the company does

Snorkel AI builds training data for AI models — supplying AI labs and enterprises with the high-quality datasets they need to train models, so customers don't have to build their own data-labeling teams from scratch.

The company originally sold data-labeling automation software, then pivoted in 2025 to "data-as-a-service": rather than just selling tools, it delivers finished datasets directly. Its approach is hybrid — not a pure human-labor marketplace, but software and models that generate data synthetically, paired with domain experts who review and correct it. More recently it has expanded into reinforcement learning (RL) environments and evaluation environments — exactly the kind of data needed to train AI agents that act autonomously and need to be corrected by reward signals across multi-step tasks.

Because Snorkel sells finished datasets and RL environments rather than raw human hours, payments to domain experts are booked as cost of goods sold rather than counted in headline revenue — unlike peer "AI data lab" companies such as Mercor ($2B annualized revenue), Handshake ($1B), and Micro1 ($500M), which pass 60-70% of top-line revenue straight through to contractors. That makes Snorkel's revenue growth a closer proxy for actual gross profit contribution.

## What this round signals

### What it means for the agent ecosystem

The frontier of model capability is shifting toward "can the data keep up": bigger models and more compute alone don't move the needle on complex, multi-step tasks without refined training data and reinforcement learning environments that mirror real-world tasks. Snorkel is spinning this layer out as infrastructure you can simply procure — turning "how do we prepare the data needed to train an agent" from something every AI lab figures out on its own into a specialized link in the supply chain.

### What investors are betting on

Insight Partners and S32 co-led on a straightforward thesis: as long as the frontier model race continues, AI labs' demand for high-quality training data will keep outpacing supply, and Snorkel's software-plus-human-expert hybrid produces data quality and scale that's harder to replicate than a pure labeling marketplace. Mercor, Handshake, and Micro1 are all scaling revenue fast in the same "AI data lab" category at the same time — a sign this isn't one company's isolated story, but an entire data supply-chain category getting repriced.

### Numbers worth watching

- Annualized recurring revenue grew 18x in 12 months to $375M — a growth rate far above most enterprise software companies, reflecting explosive demand for training data from AI labs rather than gradual customer expansion
- Valuation nearly tripled from $1.3B to $3.5B in 17 months, with most of that gain concentrated in the last year — right when demand for reinforcement learning environments and agent training took off
- Peers Mercor ($2B annualized revenue), Handshake (over $1B), and Micro1 ($500M) post much bigger headline numbers, but those figures include 60-70% passed straight through to contractors — Snorkel's $375M, under a different pricing model, sits much closer to real net revenue

## Watchlist status

Snorkel AI is not yet tracked in the watchlist. There's currently no dedicated "AI training data / RL environments" category — it overlaps partly with section B6 (Agent Observability / Evaluation), since Snorkel also provides evaluation environments, but its core business is the training data supply chain rather than observability tooling. Recommend tracking it under B6 for now, and splitting out a dedicated category if more companies (Mercor, Handshake, Micro1) enter the agent training data space.

## Today's takeaway

I used to file "data labeling" as a low-level, easily automated corner of the AI supply chain, but this round reframed it: as the training target shifts from "a model that answers questions" to "an agent that autonomously executes multi-step tasks," the complexity of the data jumps a level too — it's no longer simple labels, but full reinforcement learning environments with designed reward signals, exactly the kind of work that needs software and human experts working together, and exactly why it's worth $350M to go after this market.

## References

- [Snorkel AI triples valuation to $3.5B as demand for AI training data booms](https://techcrunch.com/2026/09/22/snorkel-ai-triples-valuation-to-3-5b-as-demand-for-ai-training-data-booms/)
- [Snorkel AI Raises $350M to Scale the Data Factory for Frontier AI](https://www.prnewswire.com/news-releases/snorkel-ai-raises-350m-to-scale-the-data-factory-for-frontier-ai-302886796.html)
- [Snorkel AI Raises $350 Million At $3.5 Billion Valuation To Expand Agentic Data Factory](https://pulse2.com/snorkel-ai-raises-350-million-at-3-5-billion-valuation-to-expand-agentic-data-factory/)
