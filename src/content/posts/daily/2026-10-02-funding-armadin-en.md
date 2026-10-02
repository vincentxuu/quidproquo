---
title: "Funding Brief｜Armadin Raises $255.5M Series B to Pit AI Agents Against AI Agents"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, funding, daily, armadin, agent-security]
lang: en
description: "Armadin, founded by Mandiant's Kevin Mandia, closed a $255.5M Series B co-led by a16z and Accel, pushing its valuation past $2.5B. It uses swarms of autonomous AI agents to act as attackers, and has now raised $445M in seven months."
tldr: "Armadin raised a $255.5M Series B co-led by Andreessen Horowitz and Accel, at a valuation above $2.5B. The signal: as AI compresses the time between vulnerability discovery and working exploits, using AI agents to attack in order to train AI agents to defend is moving from proof-of-concept to a category capital is willing to bet big on."
series:
  name: "AI Agent Funding"
  order: 61
---

> 🌏 [中文版](/posts/daily/2026-10-02-funding-armadin)

## Funding Details

| Field | Value |
|---|---|
| Company | Armadin (United States) |
| Round | Series B |
| Amount | $255.5M |
| Lead | Andreessen Horowitz (a16z) and Accel (co-led) |
| Participants | Bain Capital Ventures, Redpoint (new investors); 8VC, Ballistic Ventures, Google Ventures, In-Q-Tel, Kleiner Perkins, Menlo Ventures (returning investors) |
| Valuation | Above $2.5B (its March 2026 public launch round raised $189.9M with no disclosed valuation) |
| Total raised | $445M |
| Founded | 2025 (founded by Kevin Mandia in September 2025; raised a $24M seed in late 2025; publicly launched in March 2026) |
| Headcount | About 60+ at launch (per CNBC, March 2026 figure; not updated since) |

## What the company does

Armadin builds autonomous offensive security. Instead of sending human red-teamers to periodically test a customer's systems, it runs a swarm of autonomous AI agents that continuously probe a customer's attack surface, 24/7, looking for and chaining together vulnerabilities.

The core product is that agent swarm: it reasons the way a skilled attacker would, stringing together individually low-severity weaknesses into complete kill chains — from unauthenticated remote code execution at the perimeter, through lateral movement, to full control of a cloud environment. Enterprise and government security teams get to see the exact attack paths an adversary could use right now, and their blast radius, so they can close them before anyone else does. Founder Kevin Mandia previously founded Mandiant, sold it to FireEye for $1B in 2014, and FireEye/Mandiant was later acquired by Google for $5.4B in 2022.

Customers include multiple Fortune 500 companies and government agencies. Seven months after launch, Armadin is already running agentic attack campaigns in production.

## What this round signals

### What it means for the agent ecosystem

The notable part isn't the amount — it's that this round marks a new category taking shape: using AI agents to attack, in order to train AI agents to defend. As frontier models keep shrinking the gap between a vulnerability becoming public and a working exploit existing, periodic penetration tests and scanners that score each finding in isolation can no longer keep up. Armadin's bet is that the only defense fast enough to keep pace is one trained daily against the best offense available. That puts it in sharp contrast with agent-security peers like Zenity and Lakera, which take a defensive, governance-focused route — Armadin chose offense instead.

### What investors are betting on

a16z partner David George put it plainly: "Every major platform shift creates a new generation of security leaders, and AI is the biggest shift we've seen." What they're really betting on is Kevin Mandia's own track record — he has handled some of history's most consequential breaches firsthand, and successfully sold Mandiant to Google. Accel's Ping Li, who has backed the company since its Series A, is betting that "AI-powered offensive security" as a category can set the standard before larger incumbents move in.

### Numbers worth watching

- From founding in September 2025, to a $24M seed in late 2025, to $189.9M at launch in March 2026, to this $255.5M Series B — reaching $445M in total funding took roughly a year, far faster than typical for a security startup
- Seven months ago, at public launch, Armadin hadn't disclosed a valuation at all; this Series B jumps straight to $2.5B, a textbook case of valuation chasing narrative
- For comparison, ZenGuard — another agent-security Series B in our funding brief sample — raised just $50M at a $400M valuation; Armadin's amount and valuation both run more than 5x higher, suggesting the market is pricing "offensive" agent-security narratives at a much steeper premium than "defensive" ones

## Watchlist status

Armadin is not yet on the watchlist. Recommend adding it to section B7 (Agent Security / Governance), while flagging how it differs from the section's existing companies (Zenity, Lakera, Noma Security and others, which focus on defense and governance) — Armadin runs autonomous offensive security instead. Tracking focus: whether this "attack your own systems with agents to improve defense" model triggers regulatory or liability questions, since customers are effectively authorizing a swarm of autonomous agents to keep launching real attacks against their own infrastructure.

## Today's takeaway

This round is a reminder of something easy to miss: most of the current narrative in agent security is about how to contain agents that go rogue. Armadin is doing the opposite — deliberately running agents at that same edge to find its own holes first. Once both offense and defense start fighting with agents, the old assumption that "defense is always a step behind attack" might get rewritten into "whichever agent swarm reasons faster, and more like a real attacker, wins."

## References

- [AI cybersecurity startup Armadin valued at over $2.5 billion after new funding round](https://www.reuters.com/legal/transactional/ai-cybersecurity-startup-armadin-valued-over-25-billion-after-new-funding-round-2026-10-01)
- [Exclusive | AI Cyber Startup Armadin Raises $255.5 Million Amid Funding Surge](https://www.wsj.com/pro/cybersecurity/ai-cyber-startup-armadin-raises-255-million-f5e8f52a)
- [Armadin Raises $255.5 Million Series B to Scale Effective Autonomous Security](https://www.prnewswire.com/news-releases/armadin-raises-255-5-million-series-b-to-scale-effective-autonomous-security-302895278.html)
- [Kevin Mandia raised $190 million Armadin after prior sale to Google](https://www.cnbc.com/2026/03/10/kevin-mandia-raised-190-million-armadin-after-prior-sale-to-google.html)
