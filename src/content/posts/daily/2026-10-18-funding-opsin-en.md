---
title: "Funding Alert｜Opsin Raises $21M New Round for Agent Security"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, funding, daily, opsin, agent-security]
lang: en
description: "Opsin raised $21M in new funding co-led by SYN Ventures and Race Capital, widening AI governance from what agents can access to what they actually do"
tldr: "Opsin raised $21M, co-led by SYN Ventures and Race Capital, bringing total funding to roughly $28M. The signal: enterprise security spend is shifting from policing what agents can access to monitoring what agents actually do. Both lead partners are former security founders, betting that agent security becomes the next infrastructure layer."
series:
  name: "AI Agent Funding"
  order: 94
---

> 🌏 [中文版](/posts/daily/2026-10-18-funding-opsin)

## Funding Details

| Item | Value |
|---|---|
| Company | Opsin (San Jose, California, US) |
| Round | $21M new round (no formal round letter disclosed; prior round was a $7M Seed) |
| Amount | $21M |
| Lead investors | SYN Ventures and Race Capital (co-led) |
| Participants | Not disclosed (only the two leads are named in public coverage) |
| Valuation | Not disclosed |
| Total raised | ~$28M ($7M Seed + this $21M) |
| Founded | 2024 |
| Headcount | ~20 (Business Insider) |

## What the company does

Opsin builds governance for AI agent behavior. As employees spin up their own agents inside Microsoft Copilot, Claude, ChatGPT Enterprise, and Gemini, Opsin gives security teams visibility into what those agents can access, what they're actually doing, and when their behavior drifts from their original purpose.

The core product is a Risk Graph: it normalizes how different platforms classify agents into a single canonical model, then connects an agent's identity, permissions, data access, tool calls, and live behavior into a continuously learning risk picture. When an agent crosses a policy boundary, Opsin can quarantine it, block the action, or notify the agent's owner — positioning itself as the second generation of enterprise AI security, moving beyond data-leak prevention into behavioral governance. Co-founders James Pham (an MIT alum) and Oz Wasserman previously worked together at Abnormal Security before leaving in 2022 and teaming up with engineering lead Jeremy Mailen to start Opsin.

The company already serves nearly 20 enterprise customers across regulated industries including healthcare, financial services, and manufacturing — among them Culligan, Barry-Wehmiller, Wellstar Health System, and UiPath. In its own analysis of customer agent activity, Opsin found that 93% of misaligned tool connections had full, unrestricted access to the systems they touched, and only 1 in 200 actions required human approval before executing — the most concrete market evidence in this funding announcement.

## What this round signals

### What it means for the agent ecosystem

The new capital goes mainly toward expanding sales and engineering and accelerating Risk Graph development. Notably, no outlet in the public coverage names a formal round letter or discloses a valuation — a contrast to many AI security peers that tout valuation multiples. Opsin instead anchors its narrative on concrete risk numbers like the 93% figure rather than the raise size itself. That choice echoes a broader shift: as companies hand more real work to agents, security budgets are moving from static permission reviews ("what can this agent access") to real-time behavioral monitoring ("what did this agent actually do") — which is exactly how Opsin frames itself as "second-generation" agent security.

### What the investors are betting on

Both lead partners are security operators, not pure financial investors. Race Capital's Alfred Chuang co-founded BEA Systems and served as its CEO, selling the company to Oracle for $8.5B in 2008 before turning to venture investing in 2020. SYN Ventures' Glenn Chisholm co-founded SaaS security company Obsidian Security and served as its CEO. Both built and exited an enterprise software or security company before becoming investors, rather than being career VCs — their bet on Opsin is effectively a wager that agent security will repeat the growth arc of SaaS security (Obsidian) or enterprise middleware (BEA): a new computing paradigm emerges (autonomous agent action), and a governance infrastructure layer grows up around it.

### Numbers worth watching

- 93% of misaligned tool connections had full, unrestricted system access, with only 1 in 200 actions requiring human approval — if this ratio holds at scale, it suggests most enterprises deploying agents aren't applying least-privilege principles at all, replicating one of security's most notorious misconfigurations at the new agent layer.
- The company went from founding in 2024 to a $21M raise in roughly two years while already landing nearly 20 enterprise customers, including Fortune 500-caliber names like UiPath and Wellstar Health System — faster traction than a typical security startup, suggesting enterprise anxiety about "agents going rogue" has already converted into real procurement budget rather than staying at the watch-and-wait stage.
- Not disclosing valuation or individual co-investors is unusually opaque compared to recent rounds covered in this series, but the operator pedigree of both lead partners (an $8.5B BEA exit, founding and exiting Obsidian Security) functions as its own kind of signal, filling the gap left by the missing financial figures.

## Watchlist status

Opsin is not yet on the watchlist. Recommend adding it to section B7 (Agent Security / Governance / Security Tech, which already tracks peers like ZenGuard), with a focus on: the Risk Graph governance model (identifying agent identity, permissions, and behavior to quarantine risk in real time), the 93% over-permissioned-tools customer data point, and the fact that this $21M round didn't disclose valuation despite lead investors with operator-level security exits.

## Today's takeaway

The most interesting part of this round isn't the amount — it's that both lead partners didn't start as investors who later learned security; they built and exited security or enterprise software companies first, then turned around to back the next generation of the same problem. In a frontier category like agent security that has no established playbook yet, the market is now trusting operators who've solved a similar problem before more than it's trusting a purely financial early-stage valuation model.

## References

- [Opsin Security Raises $21M to Secure Enterprise AI Agents (official announcement)](https://www.opsinsecurity.com/blog/opsin-raises-21m-to-expand-its-risk-protection-layer)
- [This startup raised $21 million to clean up the AI agent mess hitting companies (Business Insider)](https://www.businessinsider.com/opsin-expands-21-m-to-tackle-ai-agents-in-businesses-2026-10)
- [Opsin Raises $21 Million Led By SYN Ventures And Race Capital For AI Agent Security (Pulse2)](https://pulse2.com/opsin-raises-21-million-led-by-syn-ventures-and-race-capital-for-ai-agent-security/)
