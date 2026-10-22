---
title: "Funding Alert｜Mave Raises $34M to Let AI Agents Take Over Incident Investigation"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, funding, daily, mave, agent-security]
lang: en
description: "Mave raised $34M (including a $28M Series A) led by Red Dot Capital Partners, using AI agents to query a company's existing security tools in their native languages and investigate 100% of alerts within minutes, without centralizing data"
tldr: "Mave raised $34M, including a $28M Series A led by Red Dot Capital Partners. The signal: the next battleground in SecOps isn't buying more security tools — it's letting an agent run the investigation across the tools you already have. Mave's ARR grew more than 4x in a year, proof that enterprises are already paying for agents to take over incident investigation, not just piloting a concept."
series:
  name: "AI Agent Funding"
  order: 103
---

> 🌏 [中文版](/posts/daily/2026-10-23-funding-mave)

## Funding Details

| Item | Value |
|---|---|
| Company | Mave (Tel Aviv, Israel) |
| Round | Series A (figure below is the combined total with the earlier seed) |
| Amount | $34M total ($28M Series A, plus an earlier $6M seed) |
| Lead | Red Dot Capital Partners (Series A lead) |
| Participants | Lumir Growth Partners (Series A); existing investors Dell Technologies Capital and Emerge Ventures (original seed leads, doubling down) |
| Valuation | Undisclosed |
| Total raised | $34M |
| Founded | 2025 |
| Headcount | ~20–30 (company states 30+, with plans to more than double after this round) |

## What this company does

Mave builds what it calls an "agentic SecOps" system — AI agents that connect an enterprise's existing, fragmented security tools to automatically detect, investigate, and respond to threats, without requiring the company to centralize its data into a single, expensive database.

Its agents query each connected tool in that tool's native language, pulling live context — identity state, asset ownership, current system configuration — that a traditional SIEM never captures. It reconciles that into a single, coherent account of an incident, investigates 100% of alerts within minutes, filters out false positives, flags related attack activity, and carries out approved response actions (isolating a system, disabling a compromised identity) under rules the security team has set in advance. Underneath, purpose-built workflows combine fine-tuned small language models with frontier LLMs, and every query, decision, and action is logged for audit.

Customers already include Fortune 50 companies and global MSSPs, with the platform deployed across more than 200 security operations centers, including regulated financial and healthcare environments. ARR has grown more than 400% over the past year, with several seven-figure deals signed.

## What this round signals

### What it means for the agent ecosystem

Mave's pitch gets at a real limitation of traditional SIEM architecture: a SIEM only sees the data fed into it, while the context that actually matters — identity state, asset ownership, live configuration — lives elsewhere. Instead of asking enterprises to migrate their data, Mave has agents "ask" each existing tool directly. That points to an emerging architectural consensus in agent security/SecOps: rather than forcing enterprises to rebuild a new data layer for agents, build agents that adapt to the fragmented tooling enterprises already run. This complements rather than competes with companies that monitor whether an enterprise's own agents are misbehaving — Mave is about using agents to catch attackers, while that other category is about watching whether your own agents go rogue.

### What the investors are betting on

Red Dot Capital Partners' Atad Peled put the thesis bluntly: "The SecOps market is overdue for reinvention. Incumbent platforms and the startups that tried to replace them share the same flaw: coverage is a budget decision, not a security one, and neither was built for a world run by AI agents." The investment logic here is that the pay-by-data-volume or pay-by-seat model of traditional SIEM/SOC vendors is obsolete in an environment where AI has accelerated attack speed — Red Dot is betting that decoupling security judgment from the data layer is itself the moat, not any single detection accuracy number. Both founders came out of Israel's Unit 8200; the CEO previously led go-to-market at Wing Security, and the CTO was Alterya's first employee and later VP of R&D before its acquisition by Chainalysis — a security-veteran pedigree that's also clearly part of what early backers Dell Technologies Capital and Emerge Ventures were betting on.

### Numbers worth tracking

- ARR up more than 4x in a year, with several seven-figure deals already signed — against a comparatively modest $28M Series A (the same day, Flapping Airplanes raised $1B), Mave is taking the "prove it with revenue, then raise" path rather than pricing a round off narrative
- The platform runs in 200+ SOCs with only 20–30 employees — an unusually high ratio of deployments per employee, pointing to strong unit economics from heavy automation
- The seed was just $6M; the Series A jumped to $28M, nearly 5x — with no valuation disclosed, that jump in dollar amount is the only comparable signal available right now

## Watchlist status

Mave is not yet on the watchlist. Recommend adding it under section B7 (Agent Security / Governance / Infosec), alongside Zenity, Protect AI, and Lakera for comparison. Track its "agent queries existing tools" architecture versus a data-centralization approach, and whether the 400% ARR growth rate holds up.

## Today's takeaway

"Agent security" has mostly meant preventing agents from doing something harmful — behavioral monitoring, guardrails. Mave represents the opposite direction: using agents to catch the attackers. Once attacks themselves are AI-accelerated down to the minute, a defense that still relies on a human manually stitching together evidence across systems will only fall further behind. Mave's bet is that agentic defense isn't a luxury — it's table stakes for keeping pace with attack speed, which tracks with the broader reality that security budgets keep growing while control failures still cost US businesses an estimated $30 billion a year.

## References

- [Mave Raises $34 Million to Build the Agentic SecOps System for the Modern Enterprise](https://www.prnewswire.com/news-releases/mave-raises-34-million-to-build-the-agentic-secops-system-for-the-modern-enterprise-302916859.html)
- [Mave Raises $28M Series A, Bringing Total Funding to $34M for Agentic SecOps](https://www.unite.ai/mave-raises-28m-series-a-34m-funding-agentic-secops/)
- [Mave raises $34M to help enterprises detect and stop cyberattacks using AI agents](https://techstartups.com/2026/10/22/mave-raises-34m-to-help-enterprises-detect-and-stop-cyberattacks-using-ai-agents/)
