---
title: "Funding Brief｜Raindrop Raises $35M Series A to Catch Agents Failing Silently in Production"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, funding, daily, raindrop, agent-observability]
lang: en
description: "Agent monitoring startup Raindrop closed a $35M Series A led by CRV, bringing total funding to $50M, and launched Simulations to test agent changes against production traffic before they ship"
tldr: "Raindrop raised a $35M Series A led by CRV, bringing total funding to $50M. The round signals that investors now treat agent observability as a requirement, not a nice-to-have — once an agent runs for hours and calls thousands of tools, no human can watch every step, so someone needs a system built to catch the moments an agent quietly does the wrong thing."
series:
  name: "AI Agent Funding"
  order: 43
---

> 🌏 [中文版](/posts/daily/2026-09-20-funding-raindrop)

## Funding Details

| Field | Value |
|---|---|
| Company | Raindrop (San Francisco, US) |
| Round | Series A |
| Amount | $35M |
| Lead investor | CRV |
| Follow-on | Lightspeed Venture Partners, Y Combinator, plus senior researchers from OpenAI, Anthropic, and Thinking Machines joining as individual angels |
| Valuation | Not disclosed |
| Total raised | $50M ($15M raised before this Series A) |
| Founded | 2023 |
| Headcount | About 9 (per Y Combinator's company page, pre-round) |

## What the company does

Raindrop monitors AI agents in production. It calls itself "Sentry for AI Agents," built specifically to catch the moments an agent quietly does the wrong thing — before a user ever has to complain.

The core product reads an agent's full execution trajectory in production and applies semantic-level anomaly detection to catch hallucinated answers, tool misuse, or behavior that silently shifts after a model upgrade. When an anomaly surfaces, engineering teams see what changed, when it started, and which users it affected, backed by real examples rather than an abstract error rate. Alongside this round, Raindrop launched Simulations: it replays real production traffic and existing test cases against a proposed agent change, then runs anomaly detection on the results — giving ordinary teams access to the kind of pre-release testing that frontier labs like OpenAI and Anthropic already use on their own models, so they can see "what this change will change" before it ships.

Current customers include Vercel, Framer, Clay, and several Fortune 100 enterprises. Co-founder and CEO Zubin Koticha is a repeat founder — he and co-founder Alexis Gauba previously built Opyn, a DeFi options platform later acquired by Coinbase that had processed over $15 billion in trading volume. Ben Hylak rounds out the founding team; the company was founded in San Francisco in 2023.

## What this round signals

### What it means for the agent ecosystem

The new capital goes toward scaling anomaly-detection research, pushing the product to more enterprise customers, and moving Simulations from research preview to general availability. Raindrop cites METR research showing that the length of tasks agents can complete independently roughly doubles every seven months, with a single run now spanning days and thousands of tool calls — meaning the old model of "a human watches every step" can no longer keep pace, and teams need a dedicated system that turns execution trajectories into something reviewable and traceable.

### What investors are betting on

CRV's lead, backed by continued investment from Lightspeed and Y Combinator plus individual angel checks from senior researchers at OpenAI, Anthropic, and Thinking Machines, points to a shared read: agent observability isn't a downstream need that only shows up once models get better — it's the methodology model labs already use internally, now being commoditized into its own market layer. CEO Koticha put it directly: "Agents now run for hours, call thousands of tools, and handle real money, real health data, and real customers. When an agent fails, it does the wrong thing convincingly at scale until someone happens to notice" — that's precisely the gap Raindrop is built to fill.

### Numbers worth watching

- Total funding of $50M, with this Series A alone accounting for $35M — a clear step-up in investor conviction on the agent-observability category across successive rounds
- The customer list already includes Vercel, Framer, and Clay — companies that are themselves heavy agent operators, so the product has been validated by the buyers who best understand the risk it addresses
- A team of roughly 9 people has already landed Fortune 100-scale customers, an unusually low headcount-to-customer-tier ratio that points to a direct, low-friction value proposition

## Watchlist status

Raindrop is not yet tracked in the watchlist. Recommend adding it under section B6 (Agent Observability / Evaluation), alongside Arize AI, Braintrust, LangSmith, and Galileo AI, with tracking focus on: semantic anomaly detection over production agent trajectories, and Simulations, which tests proposed changes against real production traffic before release.

## Today's takeaway

Agent observability is easy to file away as "logging bolted onto an LLM app," but Raindrop's Simulations points to something more fundamental: as agent task length doubles roughly every seven months and a single run spans multiple days, the cost of "finding out about a problem after it ships" is rising exponentially. Testing against production traffic before release stops being a nice-to-have QA step and becomes infrastructure at the same tier frontier labs use to train their own models — which is also why researchers at OpenAI and Anthropic are personally writing checks into this category.

## References

- [Raindrop Announces Series A and $50M in Total Funding Led by CRV to Protect the World from AI Agent Failures](https://finance.yahoo.com/technology/ai/articles/raindrop-announces-series-50m-total-190300152.html)
- [Raindrop Raises Series A](https://www.thesaasnews.com/news/raindrop-series-a/)
- [Raindrop Series A takes it to $50m for agent monitoring](https://thenextweb.com/news/raindrop-series-a-50m-crv-agent-failures-simulations)
- [Raindrop: Sentry for AI Agents | Y Combinator](https://www.ycombinator.com/companies/raindrop)
