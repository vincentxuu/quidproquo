---
title: "Funding Brief｜Onyx Security Series B $113M"
date: 2026-08-29
category: daily
tags: [ai-agent, funding, daily, onyx-security, agent-security]
lang: en
description: "Onyx Security closes a $113M Series B led by Bessemer at roughly a $640M valuation — building what its lead investor calls the CrowdStrike of the agentic era"
tldr: "Just four months after coming out of stealth, Onyx Security raised a $113M Series B led by Bessemer Venture Partners at roughly a $640M valuation. The bet: a control layer that watches every step of an agent's reasoning and intercepts actions before they take effect is the next generation of security infrastructure."
series:
  name: "AI Agent Funding"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-08-29-funding-onyx-security)

## Funding Details

| Field | Value |
|---|---|
| Company | Onyx Security (New York, US / Tel Aviv, Israel) |
| Round | Series B |
| Amount | $113M |
| Lead investor | Bessemer Venture Partners |
| Follow-on | Cyberstarts, TCV, Conviction, FirstMark, Vintage Investment Partners, QuantumLight, G Squared |
| Valuation | ~$640M (Calcalist estimate; not officially disclosed — described as a "several-fold increase" from the company's valuation at stealth exit) |
| Total raised | $153M ($5M seed + $35M Series A + this $113M round) |
| Founded | 2024 (the Series B announcement described the company as "exactly two years old") |
| Headcount | Not officially disclosed; the company says the team spans business development, engineering, and marketing across the US and Israel |

## What This Company Does

Onyx Security is a "secure AI control plane" for the enterprise — when a company's AI agents start touching real systems, Onyx sits between the agent and whatever it's operating on, watching every step of the agent's reasoning in real time and intercepting, correcting, or blocking an action before it actually takes effect.

The core product uses Onyx's own proprietary models to trace an agent's full decision chain, not just filter the text going in and out. The system discovers every agent running in an environment, profiles how each one normally behaves, inspects every action in real time, and when an action deviates from that profile, a "guardian agent" decides on the spot whether to approve, rewrite, or block it — pulling in a human only when necessary. The platform currently secures more than 1.1 million agents and inspects over 66 million AI sessions in real time, with customers spanning Fortune 500 companies in banking, energy, healthcare, and insurance; Revolut is a named customer. Anthropic announced an integration with Onyx in June 2026 to help its enterprise customers adopt AI safely.

The company was co-founded by Maxim Bar Kogan and Gil Elbaz, both alumni of Israeli intelligence and Air Force units. The team numbers around 80 people across Israel, the US, and Canada.

## What This Funding Signals

### Implications for the Agent Ecosystem

The timing lands squarely inside the same wave of "agent behavior governance" funding: Zenity closed a $125M Series C in early August, Obsidian Security closed an $85M Series D in August, and Alice (formerly ActiveFence) closed $140M in August — at least four companies raised nine-figure rounds within a single month, all in the narrow lane of "watching what an agent actually does." That marks a shift in where agent security spending is going: away from stopping the model from saying the wrong thing (prompt injection, jailbreak defenses) and toward stopping the agent from doing the wrong thing (runtime permissions, behavior monitoring, kill switches) — and investors have already decided this is its own budget line, not a feature bolted onto model safety.

### What Investors Are Betting On

Bessemer's own blog post is blunt about the bet: "Every technological revolution creates a generational security company. The internet created Palo Alto Networks. The endpoint created CrowdStrike. The cloud created Wiz." They're betting AI agents are the next revolution, and that Onyx has a shot at being that generational company. Bessemer has been in cybersecurity since the '90s and has a habit of backing category leaders before they have product or revenue — this is that same playbook applied to a brand-new category: the agent control plane.

### Numbers Worth Watching

- Revenue grew fourfold in just the four months since stealth exit, a pace well ahead of typical enterprise security tool adoption — a sign of how urgent agent oversight has become for buyers.
- Total funding jumped from $40M at stealth exit ($5M seed + $35M Series A) to $153M after this Series B, with valuation climbing to roughly $640M — a several-fold jump in four months.
- The platform secures more than 1.1 million agents and inspects over 66 million sessions — a scale that implies customers are already running agents in production at volume, not just piloting them.

## Watchlist Status

Onyx Security is not yet tracked in the watchlist. Recommend adding it to section B7 (Agent Security / Governance), alongside Zenity, Protect AI, and Lakera, with tracking focus on: real-time agent reasoning-chain monitoring and action interception, the $113M Series B (led by Bessemer), and the official Anthropic integration.

## Today's Takeaway

Looking at this round alongside the same-period raises from Zenity, Obsidian, and Alice, the pattern is unmistakable: none of them are betting on a smarter filter to stop a model from saying the wrong thing. All of them are betting that intercepting the agent's *action* is the only control point that actually holds. The logic is that once an agent starts chaining together real systems at machine speed — pulling credentials, calling APIs, writing to databases — model-layer defenses are already too late; the only place left to stop the damage is the last gate before the action executes. That's also why Bessemer is comfortable comparing Onyx to CrowdStrike: CrowdStrike never bet on virus signatures, it bet on real-time behavior monitoring at the endpoint. Same logic, just with "endpoint" swapped out for "agent."

## References

- [Onyx Security Raises $113M Series B to Control Advanced AI](https://finance.yahoo.com/technology/ai/articles/onyx-security-raises-113m-series-210500945.html) — Business Wire (official press release)
- [Onyx Security: defining cybersecurity in the agentic era](https://www.bvp.com/news/onyx-security-defining-cybersecurity-in-the-agentic-era) — Bessemer Venture Partners (official announcement)
- [AI security startup Onyx raises $113 million Series B at $640 million valuation](https://www.calcalistech.com/ctechnews/article/b1fsjydszg) — Calcalist / Ctech
- [Israeli cyber startup raises $113m to secure and control autonomous AI agents](https://www.timesofisrael.com/israeli-cyber-startup-raises-113m-to-secure-and-control-autonomous-ai-agents/) — The Times of Israel
