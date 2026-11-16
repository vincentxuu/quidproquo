---
title: "Funding Alert｜Corma Series A $125M (NEA leads, unicorn three months out of stealth)"
date: 2026-11-17
category: daily
type: digest
tags: [ai-agent, funding, daily, corma, agent-security]
lang: en
description: "Corma, which trains its own foundation models for defensive cybersecurity, raised a $125M Series A at a $1B valuation just three months after coming out of stealth, led by NEA"
tldr: "Corma raised a $125M Series A led by NEA, with Sequoia, Khosla and Coatue returning, at a $1B valuation and $185M in total funding. The signal: in the wake of 'Black October,' investors are confident enough in the offense-defense intelligence gap narrative to take a company three months out of stealth straight to unicorn status."
series:
  name: "AI Agent Funding"
  order: 140
---

> 🌏 [中文版](/posts/daily/2026-11-17-funding-corma)

## Funding details

| Item | Value |
|---|---|
| Company | Corma (Tel Aviv, Israel / San Francisco, US) |
| Round | Series A |
| Amount | $125M |
| Lead | NEA |
| Participants | Sequoia Capital, Khosla Ventures, Coatue (all existing investors) |
| Valuation | $1B (the first disclosed valuation, three months after the seed round — no prior figure to compare against) |
| Total raised | $185M (including the $60M seed round in August 2026) |
| Founded | 2025 (founder Alon Pluda, a veteran of Israel's Unit 8200) |
| Headcount | ~25 (per Calcalist) |

## What the company does

Corma trains its own foundation models for "defensive cybersecurity" — its thesis is that every model on the market has been optimized for writing code and for attack, and none was ever built specifically to defend.

The core product isn't a traditional security tool. It's an AI workforce powered by Corma's own foundation model that plugs into a company's existing security stack, autonomously investigating threats and carrying out defensive tasks across the full spectrum of security work with no human in the loop. The company's argument: the better coding models get, the better they also get at finding vulnerabilities — but defense requires a completely different set of capabilities, digging weak signals out of massive volumes of logs, security events and network traffic, correlating across systems and long time horizons, and staying consistent across thousands of sequential decisions. None of that is what a coding model was ever trained for.

Corma's customers span healthcare, financial services, energy and critical infrastructure, retail and telecommunications. In the three months since coming out of stealth, demand has scaled from Fortune 100 to Fortune 500 to Fortune Global 500 enterprises, forcing the company to expand its server capacity 24x just to keep up.

## What this funding signals

### What it means for the agent ecosystem

This round landed right after "Black October" — a wave of critical vulnerabilities and breaches hitting some of the world's most widely used software in October. The timing itself is the signal: attackers have already turned advances in coding models directly into offensive capability, while defenders are still waiting for an equivalent tool, and VCs are moving fast to fill that gap. The capital will go toward expanding compute capacity and continued model training, with the company's stated goal being to push toward what it calls "superintelligence for defensive cybersecurity."

### What investors are betting on

NEA partner Aaron Jacobson's framing is that "Corma is the only company tackling this in a way that's scalable" — the logic being that offense and defense have become an "intelligence vs. intelligence" fight that human security teams alone can't keep pace with. Sequoia, Khosla and Coatue, all seed investors three months ago, chose to double down rather than let new money dilute their stakes — a strong vote of confidence in both the team (which combines frontier AI research pedigree from Google DeepMind with hands-on security experience from Israel's Unit 8200) and the early demand signal.

### Numbers worth watching

```diagram
title: Corma's valuation and funding pace from stealth to Series A
desc: Seed to Series A in three months, with valuation jumping straight to $1B from an undisclosed starting point.
caption: Figures from Corma's official announcement (BusinessWire, 2026-11-16) and Calcalist reporting (2026-11-16).
---
<svg viewBox="0 0 640 220">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">Total funding ($M)</text>
  <line class="dg-grid" x1="160" y1="40" x2="160" y2="176"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="160" y="60" width="96" height="36"/>
    <text class="dg-sub" x="264" y="78" dominant-baseline="central">$60M seed (2026-08, valuation undisclosed)</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="160" y="120" width="296" height="36"/>
    <text class="dg-label dg-text--accent" x="464" y="138" dominant-baseline="central">$185M total / $1B valuation (2026-11)</text>
  </g>

  <line class="dg-axis" x1="160" y1="40" x2="160" y2="176"/>
</svg>
```

- A 24x expansion in server capacity is the single most concrete demand-pressure indicator in the announcement — harder to inflate than a customer count or revenue figure, since capacity expansion actually costs money and takes time.
- Going from stealth to a $1B valuation in three months prompted Dealroom to call this round "the 99th percentile of Series A deals for Israeli enterprise software startups by size" — in other words, this isn't a normal-paced Series A, it's capital racing to catch a narrative window.
- A team of just ~25 people is backing a $1B valuation, or roughly $40M per employee — far above most security startups at this stage. The real risk is that this valuation is a bet on team pedigree (DeepMind plus Unit 8200) and narrative, not on proven revenue scale; the next round will be a much harder test.

## Watchlist status

Corma is not yet on the watchlist. Recommend adding it under section B7 (Agent Security / Governance / Security Technology), tracking: self-trained defensive cybersecurity foundation models, autonomous AI workforce, $125M Series A led by NEA, $1B valuation.

## Today's takeaway

Corma went from stealth to unicorn in three months not on proven customer retention or revenue curves, but because its "offense-defense intelligence gap" narrative happened to collide with a real event, "Black October." It's a reminder that valuation pace in the security sector is sometimes driven by the timing window of a public event, rather than by a company's own growth curve.

## References

- [Corma Raises $125M Series A at $1B Valuation to Scale Its Frontier Foundation Model for Cyber Defense as Fortune 500 Adoption of Its Models Surges](https://www.financialcontent.com/article/bizwire-2026-11-16-corma-raises-125m-series-a-at-1b-valuation-to-scale-its-frontier-foundation-model-for-cyber-defense-as-fortune-500-adoption-of-its-models-surges)
- [Cyber startup Corma goes from stealth to unicorn in just three months with $125 million Series A - CTech (Calcalist)](https://www.calcalistech.com/ctechnews/article/bjiqapu0me)
- [Defensive AI agents co Corma raises $125m at $1b valuation - Globes](https://en.globes.co.il/en/article-defensive-ai-agents-co-corma-raises-125-million-at-1b-valuation-1001563580)
