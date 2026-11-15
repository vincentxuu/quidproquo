---
title: "Funding Alert: Sentra's $150M Series C (Capital One Ventures leads, guarding what AI agents can touch)"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, funding, daily, sentra, agent-security]
lang: en
description: "Israeli security startup Sentra raised a $150M Series C led by Capital One Ventures, focused on governing what corporate data AI agents can reach"
tldr: "Sentra raised a $150M Series C led by Capital One Ventures, which also takes a board seat, bringing total funding past $260M. The signal: enterprises are treating control over what data an AI agent can reach as its own security line item, instead of cleaning up after the fact."
series:
  name: "AI Agent Funding"
  order: 124
---

> 🌏 [中文版](/posts/daily/2026-11-05-funding-sentra)

## Funding Snapshot

| Item | Value |
|---|---|
| Company | Sentra (dual HQ: Tel Aviv, Israel / New York, US) |
| Round | Series C |
| Amount | $150M |
| Lead | Capital One Ventures (also takes a board seat) |
| Participants | Bessemer Venture Partners, Zeev Ventures, Standard Investments, Munich Re Ventures, Key1 Capital (all existing investors returning) |
| Valuation | Undisclosed |
| Total raised | $260M+ |
| Founded | 2021 |
| Headcount | Undisclosed |

## What the company does

Sentra is a data-security company whose specialty is figuring out where an enterprise's sensitive data actually lives and who — including which AI agent — can reach it, instead of cleaning up after an agent has already done something wrong.

The product centers on a data-first governance model: it first classifies a customer's cloud data (PII, financial records, confidential documents), then overlays an identity map recording which human users, service accounts, and AI agents have inherited access to each dataset. When an agent's behavior looks off, the system can reconstruct exactly what data that agent could have reached at the time, handing security teams a starting point for investigation — a different emphasis from most competitors, which focus on monitoring an agent's real-time behavior as it runs. The whole process runs inside the customer's own environment, so sensitive data never leaves it. Co-founders Asaf Kochan (former commander of Israel's Unit 8200) and Yoav Regev (former head of the unit's cyber division) are both security veterans who founded the company in 2021. Revenue grew more than 300% over the past year.

## What this round signals

### For the agent ecosystem

Sentra's round fills a gap that's easy to overlook when enterprises deploy AI agents: most "agent security" startups, like Zenity and WitnessAI, watch what an agent does while it runs. Sentra works the problem from the other end — can an agent be structurally prevented from reaching data it shouldn't touch in the first place, and when something does go wrong, can the company quickly reconstruct exactly what data that agent touched. Both approaches are now attracting large rounds at the same time, which suggests enterprise buyers see them as complementary layers of defense rather than a choice between the two.

```diagram
title: Sentra's data-first governance model
desc: Before an AI agent can access enterprise data, the request is checked against an identity and permission map and only the approved minimum scope is allowed through; after an incident, the system can reconstruct exactly what data that agent touched.
caption: Simplified; actual rules are configured per customer environment and vary by deployment.
step: An AI agent sends a data-access request
step: The request is checked against the identity map and least-privilege scope
step: Access is allowed within scope, or blocked/flagged outside it
step: After an incident, the system reconstructs what data that agent touched
---
<svg viewBox="0 0 440 240">
  <rect class="dg-box" x="8" y="92" width="112" height="56" rx="6" data-step="1"/>
  <text class="dg-label" x="64" y="111" text-anchor="middle" dominant-baseline="central" data-step="1">AI agent</text>
  <text class="dg-sub" x="64" y="131" text-anchor="middle" dominant-baseline="central" data-step="1">requests access</text>

  <path class="dg-line" d="M120 120H164" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="164" y="92" width="112" height="56" rx="6" data-step="2"/>
  <text class="dg-label" x="220" y="111" text-anchor="middle" dominant-baseline="central" data-step="2">Permission map</text>
  <text class="dg-sub" x="220" y="131" text-anchor="middle" dominant-baseline="central" data-step="2">checks least privilege</text>

  <path class="dg-line" d="M276 120H320" marker-end="url(#arrow)" data-step="3"/>

  <rect class="dg-box" x="320" y="92" width="112" height="56" rx="6" data-step="3"/>
  <text class="dg-label" x="376" y="111" text-anchor="middle" dominant-baseline="central" data-step="3">Allow / block</text>
  <text class="dg-sub" x="376" y="131" text-anchor="middle" dominant-baseline="central" data-step="3">flags out-of-scope</text>

  <path class="dg-line dg-line--dashed" d="M376 148V196H64V148" marker-end="url(#arrow)" data-step="4"/>
  <text class="dg-edge" x="220" y="212" text-anchor="middle" dominant-baseline="central" data-step="4">Reconstruct access history after an incident</text>
</svg>
```

### What investors are betting on

Lead investor Capital One Ventures — the bank's own venture arm — is taking a board seat directly, which signals this isn't just a financial bet but a strategic one on how to govern what AI agents touch inside an enterprise; financial services is among the industries with the strictest data-access audit requirements. All of the existing investors — Bessemer, Zeev Ventures, and the rest — returned for this round, suggesting their confidence in the company's 300% year-over-year growth hasn't wavered. Worth noting: Zenity, often framed as a comparable company, raised its own $125M Series C led by Norwest back in August. The two companies have become near-simultaneous frontrunners in "AI agent governance," just approaching it from different angles — Zenity leans toward behavior monitoring, Sentra toward data governance.

### Numbers worth watching

- Total funding has crossed $260M, the largest round in the company's history since its 2021 founding, and it comes only about a year and a half after the previous $50M Series B in April 2025 — a visibly accelerating fundraising cadence
- Revenue growth stayed above 300% year-over-year for the second consecutive funding announcement in a row, suggesting the growth curve hasn't meaningfully slowed
- At $150M, the round ranks in roughly the 95th percentile of Series C deals among Israeli enterprise-software startups (per Dealroom), showing the market prices "AI agent data governance" no lower than the "agent behavior monitoring" side of agent security

## Watchlist status

Sentra is not yet on the watchlist. Recommend adding it to section B7 (Agent Security/Governance), with a caveat: most existing B7 names — Zenity, WitnessAI, Noma Security — approach the problem from "agent behavior monitoring." Sentra is a rarer "data-first" governance play, controlling what can be reached before worrying about what an agent does with it. Suggest tagging its tracking focus as "data-access governance" to distinguish it from the "behavior monitoring" cluster already in B7.

## Today's takeaway

Sentra and Zenity landed comparably large rounds at almost the same time with opposite solutions — a sign that "agent security" hasn't converged on a single right answer yet. The market is currently buying both "control the data first" and "control the behavior first" as live bets, rather than treating either as the loser to be phased out.

## References

- [AI Security Startup Sentra Raises $150 Million to Police Autonomous Agents](https://www.wsj.com/pro/cybersecurity/ai-security-startup-sentra-raises-150-million-to-police-autonomous-agents-4ab9da29)
- [Sentra raises $150M to control what AI agents can reach in corporate data](https://siliconangle.com/2026/11/04/sentra-raises-150m-to-control-what-ai-agents-can-reach-in-corporate-data)
- [Agentic Data Security Firm Sentra Raises $150 Million](https://www.securityweek.com/agentic-data-security-firm-sentra-raises-150-million)
