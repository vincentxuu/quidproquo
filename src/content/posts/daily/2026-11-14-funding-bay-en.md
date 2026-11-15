---
title: "Funding Alert: Bay Raises $37M Series A (Total $50M, Led by Battery Ventures)"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, funding, daily, bay, agent-security]
lang: en
description: "Tel Aviv-based AI agent security startup Bay emerged from stealth with a combined $37M Series A and a previously undisclosed $13M seed, totaling $50M, led by Battery Ventures, betting on sub-5-minute deployment and millisecond-level action control"
tldr: "Bay disclosed a $37M Series A (led by Battery Ventures) together with a previously undisclosed $13M seed, for $50M total, with a 35-person team less than a year old. Customers include Micron, Peloton, ClickUp, and Wix. The signal: agent security is already a crowded field, and Bay is competing on a 'no extra endpoint agent, 5-minute deployment' technical bet."
series:
  name: "AI Agent Funding"
  order: 133
---

> 🌏 [中文版](/posts/daily/2026-11-14-funding-bay)

## Funding Details

| Item | Value |
|---|---|
| Company | Bay (Israel, Tel Aviv) |
| Round | Series A (disclosed together with a previously undisclosed seed round) |
| Amount | $37M (Series A) + $13M (seed) = $50M |
| Lead | Battery Ventures (Series A); YL Ventures, Striker Venture Partners (seed) |
| Participants | Micron Ventures, M12 (Microsoft's venture fund), Assaf Rappaport (Wiz CEO, personal investment in the Series A) |
| Valuation | Not disclosed |
| Total raised | $50M |
| Founded | 2026 (nine months old at announcement) |
| Employees | ~35, mostly in Israel (per Pomegra) |

## What the company does

Bay secures AI agents at the point of execution — its pitch is that enterprises don't lack the will to let agents do work; they lack a layer that can stop an agent before it does something wrong. The company's origin story is an internal incident: engineers watched a coding agent try to expose a cloud environment to the public internet while running a test. The agent hadn't been compromised — it was simply using legitimate permissions to pursue a legitimate goal in a dangerous way.

The product evaluates every action an agent proposes in the context of its full session, deciding in milliseconds whether to allow it, block it, or escalate it to a human, across employee devices, cloud infrastructure, and SaaS apps. Bay claims deployment takes under 5 minutes and requires no additional persistent endpoint agent, kernel driver, or network proxy. Customers already include Micron, Peloton, ClickUp, and Wix. The company also claims Fortune 100 customers tripled their autonomous agent usage after adopting the platform — a figure that comes from Bay itself and hasn't been independently verified.

All three founders have intelligence or security backgrounds: CEO Yuval Zacharia led a 50-person department in Israel's Unit 8200 before moving into offensive cybersecurity and later serving as Director of Research and AI at Hunters. CPO Aner Morag was an early employee at Noname Security, rising to VP of Product. VP of R&D Boris Danilovich previously led a 90-engineer team at CrowdStrike, where he was a key leader on the company's endpoint-security product line.

## What this round signals

### What it means for the agent ecosystem

Agent security is no longer an empty category in 2026 — Zenity's $125M Series C, Straiker's $64M Series A, NeuralTrust's $20M seed, and Asymptote Labs' $5.5M seed are all competing for similar positioning (per Pomegra's tally). In an already-crowded field, Bay's chosen differentiator is minimizing adoption friction — no extra endpoint agent, 5-minute setup — against competitors that typically rely on persistent endpoint proxies or network-level agents. The goal is to grab early adoption slots before enterprises settle on a fixed security-procurement standard.

### What the investors are betting on

Battery Ventures general partner Dharmesh Thakker's reasoning is straightforward: Bay was already winning enterprise customers at an early stage with a differentiated technical approach. YL Ventures managing partner Yoav Leitersdorf was more direct: "We evaluated a crowded field of companies addressing AI agent security, and Bay stood out because it can understand and control individual agent actions, from the endpoint to the cloud, while fitting into infrastructure enterprises already use" — and said he expects Bay to become "as fundamental to enterprise AI adoption as the network firewall was to the internet era." Wiz founder Assaf Rappaport joined the Series A as a personal investor, a peer endorsement that carries weight in Israel's security community even though it isn't institutional capital.

### Numbers worth watching

```diagram
title: Cumulative funding across five agent-security startups
desc: Bay's $50M sits between Asymptote Labs' $5.5M seed and Zenity's $125M Series C — a mid-pack position.
caption: Figures compiled by Pomegra (2026-11-13) from each company's public funding announcements. Conversion: baseline x = 160, roughly 2.93 units per $1M (k = 440 ÷ 150), x-axis starts at 0.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">Total raised ($M)</text>
  <line class="dg-grid" x1="307" y1="40" x2="307" y2="312"/>
  <line class="dg-grid" x1="453" y1="40" x2="453" y2="312"/>
  <text class="dg-small" x="307" y="326" text-anchor="middle">50</text>
  <text class="dg-small" x="453" y="326" text-anchor="middle">100</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="160" y="46" width="367" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="102" width="188" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="214" width="59" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="270" width="16" height="28"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="160" y="158" width="147" height="28"/>
  <line class="dg-axis" x1="160" y1="40" x2="160" y2="312"/>

  <text class="dg-sub" x="535" y="60" dominant-baseline="central">$125M</text>
  <text class="dg-sub" x="356" y="116" dominant-baseline="central">$64M</text>
  <text class="dg-label dg-text--accent" x="315" y="172" dominant-baseline="central">$50M</text>
  <text class="dg-sub" x="227" y="228" dominant-baseline="central">$20M</text>
  <text class="dg-sub" x="184" y="284" dominant-baseline="central">$5.5M</text>

  <text class="dg-sub" x="148" y="60" text-anchor="end" dominant-baseline="central">Zenity</text>
  <text class="dg-sub" x="148" y="116" text-anchor="end" dominant-baseline="central">Straiker</text>
  <text class="dg-label dg-text--accent" x="148" y="172" text-anchor="end" dominant-baseline="central">Bay</text>
  <text class="dg-sub" x="148" y="228" text-anchor="end" dominant-baseline="central">NeuralTrust</text>
  <text class="dg-sub" x="148" y="284" text-anchor="end" dominant-baseline="central">Asymptote Labs</text>
</svg>
```

- Disclosing two rounds together at the nine-month mark for a combined $50M, with a team of only ~35, shows fundraising pace running well ahead of headcount growth — VCs rushing in matters more here than the company proving out team or product maturity first
- Among the five comparable companies, Bay's $50M ranks third — still trailing Straiker ($64M) and Zenity ($125M), but ahead of NeuralTrust and Asymptote Labs, two earlier-stage peers
- The "Fortune 100 customers tripled usage" claim comes from Bay's own press release, with no third-party audit or named customer backing it — a common growth narrative for sub-one-year-old companies that readers should weigh separately from the confirmed customer list (Micron, Peloton, ClickUp, Wix)

## Watchlist status

Bay is not yet tracked in the watchlist. We'd recommend adding it to section B7 (Agent security / governance / security technology), alongside competitors like Zenity, Protect AI, Lakera, and WitnessAI, with a focus on whether its "5-minute deployment, no extra endpoint" claim holds up once enterprises actually roll it out.

## Today's takeaway

The most notable thing about Bay isn't the dollar amount — it's that the company disclosed its seed and Series A together, with the seed round's size never having been public before. That kind of "stay quiet, then reveal two rounds at once" move isn't a sign the technology has matured enough to showcase; it's a bet that a single, bigger reveal creates more buzz than staging two smaller announcements in an already-crowded agent-security field.

## References

- [Bay raises $50m for AI agent security after nine months in stealth](https://thenextweb.com/news/bay-50m-ai-agent-security-stealth-battery-ventures)
- [Bay Emerges From Stealth With $50M After Fortune 100 Companies Used Its Platform to Triple Autonomous AI Agent Use](https://finance.yahoo.com/technology/ai/articles/bay-emerges-stealth-50m-fortune-130000718.html)
- [Bay Raises $50M to Police Enterprise AI Agents in 2026](https://pomegra.io/startups/bay-raises-50m-to-police-enterprise-ai-agents-in-2026-2026-11-13)
- [Israeli AI security startup Bay emerges from stealth with $50M in funding to stop rogue AI agents before they cause damage](https://techstartups.com/2026/11/10/israeli-ai-security-startup-bay-emerges-from-stealth-with-50m-in-funding-to-stop-rogue-ai-agents-before-they-cause-damage/)
