---
title: "Funding Alert: Traversal's $120M Series B for AI SRE (Kleiner Perkins, Redpoint, Khosla co-lead)"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, funding, daily, traversal, ai-sre]
lang: en
description: "AI SRE startup Traversal raised a $120M Series B at a $1B valuation, using causal-inference agents to find the real root cause of production incidents"
tldr: "Traversal raised a $120M Series B co-led by Kleiner Perkins, Redpoint Ventures, and Khosla Ventures, at a $1B valuation. The signal: AI agents are moving beyond writing code into keeping that code alive in production."
series:
  name: "AI Agent Funding"
  order: 123
---

> 🌏 [中文版](/posts/daily/2026-11-05-funding-traversal)

## Funding Snapshot

| Item | Value |
|---|---|
| Company | Traversal (New York, US) |
| Round | Series B |
| Amount | $120M |
| Lead | Kleiner Perkins, Redpoint Ventures, Khosla Ventures (co-leading) |
| Participants | Sequoia Capital, Battery Ventures (both doubling down) |
| Valuation | $1B |
| Total raised | $168M ($48M seed + Series A, plus this round) |
| Founded | 2023 |
| Headcount | Undisclosed (the team page lists engineers and PMs from Perplexity, Meta, Datadog, ServiceNow, and Citadel) |

## What the company does

Traversal builds an "AI site reliability engineer" — when a company's production system breaks, it sends a swarm of LLM agents to investigate in parallel and pull the one real root cause out of a pile of tangled, correlated alerts.

The core tech stack is a Production World Model paired with a Causal Search Engine: it continuously models a system's dependencies and incident history, then applies causal inference when something breaks to separate what merely co-occurred from what actually caused the failure — instead of dumping every alert on an engineer the way a traditional dashboard does. The product has grown into three layers: Traversal itself does root-cause analysis; Traversal Workers proactively investigate before an alert even fires; and Traversal MCP feeds real-time production evidence to coding agents, so bug fixes can draw on what actually happened in the incident.

The four co-founders — Anish Agarwal, Raaz Dwivedi, Ahmed Lone, and Raj Agrawal — all came from academia (causal machine learning, reinforcement learning) and started the company after late-night conversations following classes at Columbia University in 2023, emerging from stealth in June 2025. Customers include Nubank, Harvey, PepsiCo, American Express, Blackstone, and DigitalOcean. Per the company's announcement, monthly investigation volume grew more than 100x during 2026 — from 513 to nearly 73,000 — and roughly two-thirds of that usage has already moved past post-incident root-cause analysis into alert triage, release-risk assessment, CMDB validation, security questions, and everyday production work.

## What this round signals

### For the agent ecosystem

The signal behind this $120M round is that AI is writing code fast enough to turn operations into the new bottleneck — some of the time engineers save on writing code gets poured straight back into monitoring and troubleshooting production. Traversal's bet is to push agents from passively waiting on alerts to proactively investigating, then closing the loop by feeding production evidence back to the agents writing the code — turning the software development lifecycle from "write it, then hand it to ops" into one continuous agent-driven loop.

```diagram
title: Traversal's AI SRE loop
desc: After a production incident, causal search finds the real root cause, Traversal Workers investigate proactively and produce evidence, and Traversal MCP feeds that evidence back to the coding agent — reducing the odds of the next incident.
caption: Simplified; in practice the three product layers can run concurrently rather than in strict sequence.
step: A production incident or anomaly signal appears
step: The Production World Model and Causal Search Engine isolate the real root cause from the noise
step: Traversal Workers investigate proactively and produce fix and prevention recommendations
step: Traversal MCP feeds production evidence to the coding agent for the next round of code changes
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">Incident</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">anomaly signal</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Causal search</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">finds root cause</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">Investigate</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">Traversal Workers</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">Feed coding agent</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">Traversal MCP</text>
  </g>
</svg>
```

### What investors are betting on

The three lead VCs are playing slightly different hands. Khosla and Kleiner Perkins were already seed/Series A investors, so this round is a conviction top-up; Sequoia and Battery are doubling down in a different sense — Sequoia backed the seed round two years ago and didn't skip the Series B either. In the same niche, Resolve AI (founded by former Splunk executives) also raised a $125M Series A led by Lightspeed this year at the same $1B valuation, which suggests VCs see "AI SRE" as a category in its own right rather than a feature bolted onto observability vendors — incumbents like Datadog, Dynatrace, and Grafana Labs are adding similar capabilities too, setting up a race between startups and incumbents on the same turf.

### Numbers worth watching

- Monthly investigation volume jumped from 513 to nearly 73,000 in a year — more than 100x — the single most load-bearing usage metric in this round
- At $120M, this ranks near the 96th percentile of all-time US enterprise-software Series B rounds, reflecting high investor appetite for AI that does operational work, not just code generation
- This round is 2.5x the combined $48M seed-plus-Series-A the company announced at its stealth exit, with the valuation going from undisclosed to $1B in 15 months

## Watchlist status

Traversal is not yet on the watchlist. Recommend adding it to section B6 (Agent Observability/Evaluation), with a caveat: most existing B6 names (Arize AI, Braintrust, Langfuse, AgentOps) operate at the "observability data layer" — collecting and visualizing traces and logs. Traversal operates a level up, as an "automated root-cause-analysis agent," putting it in the same emerging "AI SRE" bucket as Resolve AI and Dash0. Worth splitting B6 into a dedicated AI SRE sub-category if more companies in this niche keep showing up.

## Today's takeaway

Traversal's three-layer product line — root-cause analysis, proactive investigation, feeding coding agents — surfaces an easy-to-miss fact: when AI writes code faster, operations doesn't automatically get easier. It becomes the new bottleneck, because nobody has time to understand how AI-written code actually interacts in production. Traversal's bet is to make "understanding production" itself a job you can outsource to an agent.

## References

- [Traversal Raises $120M to Close the Outer Loop with a Superintelligent AI SRE](https://www.traversal.com/blog/traversal-series-b-120-million-ai-sre)
- [Traversal raises $120M at $1B valuation to automate incident response](https://dealroom.co/news/169321-traversal-raises-120m-at-1b-valuation-to-automate-incident-response)
- [Traversal Raises $120M Series B at $1B Valuation to Expand AI SRE](https://www.unite.ai/traversal-raises-120m-series-b-at-1b-valuation-to-expand-ai-sre/)
