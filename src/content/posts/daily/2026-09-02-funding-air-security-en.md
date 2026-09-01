---
title: "Funding Brief｜AIR Security Two Seed Rounds Totaling $50M"
date: 2026-09-02
category: daily
tags: [ai-agent, funding, daily, air-security, agent-security]
lang: en
description: "Agent supply-chain security startup AIR Security exits stealth with $50M across two seed rounds, led separately by Sequoia and Greenoaks"
tldr: "AIR Security exited stealth with two seed rounds totaling $50M — $10M led by Sequoia, then $40M led by Greenoaks. This is VC money betting directly on founder pedigree and timing in the unproven 'AI agent supply-chain security' niche, rather than waiting for a Series-A-grade growth curve first."
series:
  name: "AI Agent Funding"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-02-funding-air-security)

## Funding Details

| Field | Value |
|---|---|
| Company | AIR (AIR Security, Israel / United States) |
| Round | Seed (two rounds disclosed together) |
| Amount | $50M ($10M first round + $40M second round) |
| Lead investor | Sequoia Capital (first round), Greenoaks (second round) |
| Follow-on | Swish, Netz, and angel investors Zach Frankel (president of Cognition), Yinon Costica (co-founder of Wiz), Ofir Erlich (co-founder of Eon), Anne Neuberger, Omer Adam, Varun Anand (co-founder of Clay) |
| Valuation | Not disclosed |
| Total raised | $50M (the company's first disclosed outside capital, coming out of stealth) |
| Founded | Roughly early 2026 (CTech describes the company as "six months old") |
| Headcount | ~40 |

## What This Company Does

AIR builds security for the AI agent supply chain — as companies give agents access to more systems, skills, plugins, and MCP servers, AIR positions itself as the gatekeeper for that chain, catching malicious tools or content before they ever reach an agent's context.

The platform works in three layers. First, visibility: it discovers every agent actually running across a company's environment, and flags employees using AI tools that IT hasn't approved or that run on personal accounts. Second, a real-time firewall: it intercepts and analyzes each action an agent takes — loading a skill, fetching content from a URL — and blocks anything that doesn't meet security criteria. Third, a continuously re-verified allowlist: AIR maintains its own list of vetted skills and plugins, because a previously approved skill can turn risky later if a package it depends on changes or its developer's account is compromised. CEO Yair Saban says the platform currently filters out about 27% of the skills and add-ons it scans.

Co-founders Yair Saban (CEO) and Niv Hoffman (CTO) both come from offensive cybersecurity work at Israel's Unit 8200. The company already has more than 20 customers, roughly a quarter of them large enterprises, with the strongest demand coming from financial services and pharmaceutical companies — industries that are already unusually sensitive to whether their tool chains can be trusted.

## What This Funding Signals

### Implications for the Agent Ecosystem

AIR isn't attacking "is the agent itself safe" — it's attacking "is the agent's tool chain safe." Skills, plugins, and MCP servers are the components that connect agents to the outside world, and together they're forming a new kind of software supply chain that still lacks anything like the code-signing checks operating systems require of drivers. Sequoia partner Bogomil Balkansky frames the problem as infrastructure before it's security: continuously re-verifying every skill, plugin, MCP server, and sub-agent that touches an enterprise's entire agent fleet, in real time, is a much bigger engineering problem than writing a better scanner.

### What Investors Are Betting On

Notably, this round skipped the usual Series A validation gate entirely — the company was still in stealth when Sequoia funded the first seed round, and Greenoaks piled on with a second a few weeks later. Both funds are betting on founder pedigree (offensive security experience from Unit 8200) and market timing (the window where agents are moving into production at scale), not a proven revenue curve. Zenity, in the same space, just closed a $125M Series C a month earlier (tracked in quidproquo's watchlist section B7), and Noma Security raised a $100M Series B last year. AIR pulling in top-tier fund money at a pre-Series-A stage suggests this category has shifted from competing on validation to competing on who claims the position first.

### Numbers Worth Watching

- $50M across two seed rounds is well above typical seed-stage sizing — peers like Zenity and Noma didn't hit $100M+ until Series B/C — suggesting the valuation floor for agent-security startups is already rising.
- More than 20 customers, roughly 25% of them large enterprises, means the product has moved past pure proof-of-concept into paying enterprise accounts.
- The claimed 27% filter-out rate on scanned skills and plugins is also the core evidence AIR uses to argue the supply-chain risk is real, not hypothetical.

## Watchlist Status

AIR is not yet tracked in the watchlist. Recommend adding it to section B7 (agent security / governance / cybersecurity technology) alongside already-tracked Zenity and Noma Security — AIR differentiates by protecting the input side of an agent's context with a real-time firewall, rather than Zenity's governance-and-posture-management approach. Worth watching which architecture produces clearer retention numbers first.

## Today's Takeaway

AIR landing Sequoia and Greenoaks — funds that usually show up at later stages — before even reaching Series A, sitting next to Zenity closing a similarly sized round on a mature Series C a month earlier, shows two entirely different funding logics running in parallel in agent security right now: wait for the revenue curve and write a big check (Zenity's path), or bet on founder pedigree and timing and write a late-stage-sized check at the seed stage (AIR's path). The market hasn't converged on which architecture wins — capital is betting on who claims position first instead.

## References

- [AIR raises $50M to help companies vet the skills and add-ons AI agents use](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use) — TechCrunch
- [Six-month-old AIR Security raises $50 million to build inline firewall for AI agents](https://www.calcalistech.com/ctechnews/article/r13apdnugg) — CTech (Calcalistech)
