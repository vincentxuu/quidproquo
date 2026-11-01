---
title: "Funding Alert｜Infisical Raises $40M Series B — Elad Gil Leads for the Second Round Straight, Betting on Agent Credential Security"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, funding, daily, infisical, agent-security]
lang: en
description: "Open-source secrets management platform Infisical raised a $40M Series B at a $600M valuation, led again by Elad Gil — the pitch is letting AI agents access enterprise systems without ever holding the actual password"
tldr: "Infisical raised a $40M Series B at a $600M valuation, led by Elad Gil for the second round in a row, with Gradient and Y Combinator participating. The signal: as AI agents become a new class of enterprise user, the old model of just handing them a password is itself the vulnerability — Infisical is betting that secrets management graduates from a developer tool into required agent-security infrastructure."
series:
  name: "AI Agent Funding"
  order: 110
---

> 🌏 [中文版](/posts/daily/2026-10-28-funding-infisical)

## Funding Details

| Item | Value |
|---|---|
| Company | Infisical (San Francisco, US) |
| Round | Series B |
| Amount | $40M |
| Lead | Elad Gil |
| Participants | Gradient, Y Combinator |
| Valuation | $600M (Series A valuation undisclosed, so no multiple can be calculated) |
| Total raised | ~$59.3M ($19.3M before this round + this $40M) |
| Founded | 2022 |
| Headcount | ~20 (Pitchbook) |

## What the company does

Infisical is a security infrastructure company for secrets management — it helps enterprises centralize API keys, certificates, and database passwords, and injects those secrets securely into development workflows, CI/CD pipelines, and cloud infrastructure, so credentials no longer get hardcoded into config files or copy-pasted everywhere.

The core product is an open-source secrets management platform that has expanded into certificate management and SSH key management in recent years. Its new focus is "Agent Vault": letting enterprises grant AI agents access to critical systems without ever handing over the real password — swapping permanent keys for revocable, scope-limited dynamic credentials, so that even if an agent is compromised or misused, it can't leak credentials to other tools or LLM providers.

Infisical now serves more than 1,300 customers and 300,000 developers, its open-source project has passed 30,000 GitHub stars, and it secures 10 billion secrets a day. Customers include Airbus, Volkswagen, Hugging Face, OpenRouter, and Wise.

## What this round signals

### What it means for the agent ecosystem

AI agents are becoming a new class of enterprise user — they need access to source code, databases, and cloud infrastructure to do their jobs, but they can't be trusted with an actual password the way a human employee can. Infisical's Agent Vault is built to close exactly that gap: separating "what an agent can access" from "what an agent is handed." The new capital goes toward growing engineering and go-to-market teams, and extending its existing secrets-management infrastructure further into an agent-specific credential layer.

### What investors are betting on

Elad Gil has now led two rounds in a row for Infisical — the $16M Series A, and this $40M Series B. His stated thesis is that "AI agents are becoming an entirely new class of enterprise user, and securing their access will be one of the biggest cybersecurity challenges of the next decade." Unlike agent-security startups building the story from scratch, Infisical had already proven developer-tool demand (30,000+ stars, 300,000 developers) before pivoting that distribution toward agents — the kind of "validated market pull plus an AI angle" bet Elad Gil tends to favor.

### Numbers worth watching

- 30,000+ GitHub stars, 1,300+ customers, 300,000 developers, 10 billion secrets secured daily — this is a project with large-scale distribution already in place pivoting into agent security, not a cold start building a user base from zero
- Less than a year and a half between the Series A (June 2025, $16M) and this Series B, with the same lead investor doubling down both times — a sign of sustained conviction in execution, not a one-off bet

## Watchlist status

Infisical isn't on the watchlist yet. Recommend adding it under section B7 (Agent Security / Governance / Security Tech), tracking: agent credential/secrets management (Agent Vault), and Elad Gil's back-to-back lead investments.

## Today's takeaway

Most agent-security startups start from "monitor what the agent does." Infisical's angle goes a level deeper: "the agent should never have the password in the first place." That's really using an already-mature category — secrets management — to redraw where the boundary of agent security sits, rather than stacking another monitoring layer on top of the agent runtime.

## References

- [Infisical Raises $40 Million at $600 Million Valuation to Secure the AI Agent Economy](https://www.prnewswire.com/news-releases/infisical-raises-40-million-at-600-million-valuation-to-secure-the-ai-agent-economy-302920994.html)
- [This $600 Million Startup Is Helping Keep Company Secrets Away From AI Agents](https://www.forbes.com/sites/rashishrivastava/2026/10/27/this-600-million-startup-is-helping-keep-company-secrets-away-from-ai-agents/)
