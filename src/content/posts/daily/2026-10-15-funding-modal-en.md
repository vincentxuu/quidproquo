---
title: "Funding Brief | Modal Series D $750M at a $15.75B Valuation"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, funding, daily, modal, agent-infrastructure]
lang: en
description: "AI cloud Modal went from a $4.65B to a $15.75B valuation in five months, with annualized revenue above $1B — $300M of it from agent sandboxes alone"
tldr: "Modal closed a $750M Series D led by Accel at a $15.75B post-money valuation, 3.4x its $4.65B Series C in May. The signal: isolated environments where agents run the code they write have gone from an add-on to a standalone $300M-a-year business."
series:
  name: "AI Agent Funding"
  order: 89
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-funding-modal)

## Funding Details

| Item | Value |
|---|---|
| Company | Modal (New York, US) |
| Round | Series D |
| Amount | $750M |
| Lead | Accel |
| Participants | Kleiner Perkins (new); all existing investors, including Menlo Ventures, General Catalyst, Redpoint, Lux Capital, Amplify Partners and Bain Capital Ventures |
| Valuation | $15.75B post-money (Series C in May 2026 was $4.65B, about 3.4x) |
| Total raised | Not disclosed |
| Founded | Around 2021 (the CEO says "five years ago") |
| Headcount | 200+ across New York, San Francisco and Stockholm (company announcement) |

## What the Company Does

Modal is a cloud compute platform for AI applications: developers write code and Modal runs it on GPUs, without them having to manage containers, scheduling or GPU procurement.

Technically, Modal didn't build on the existing cloud stack. It built its own file system, container runtime, scheduler and networking, on top of a capacity pool spanning more than 20 cloud providers. It has three product lines: Functions (inference and training), Sandboxes (isolated environments where agents run the code they generate) and multi-node training clusters. Sandboxes launched in 2023; close to 3 billion have been started, and an internal test ran a million concurrently.

The company says annualized revenue has passed $1B, growing more than 15x in a year, with usage tripling in the five months since the Series C. Sandboxes alone run at $300M a year. Customers include DoorDash, Ramp, Linear, Cognition and Runway, plus robotics companies such as Physical Intelligence and 1X.

## What This Round Signals

### What it means for the agent ecosystem

A large share of Modal's growth comes from agents: Cognition, Ramp, Linear and Hebbia run background agents on it, and reinforcement learning needs huge numbers of short-lived isolated environments. Code written by agents has to run somewhere, isolated from everything else. Teams used to assemble that themselves from containers; now one company does it at a $300M annual run rate. Sandboxes' Secret Injection lets agents use login credentials without seeing them, which speaks directly to recent agent-escape incidents — Modal's CTO has publicly confirmed that the OpenAI agent that broke out of its test environment in July also compromised a Modal account.

### What the investors are betting on

Accel led, Kleiner Perkins joined, and every existing investor participated. From what's public, the bet is on an AI-native compute layer: models and applications will change, but inference, training and agent sandboxes all need compute and isolation, and Modal wants to be the default for that layer. The 3.4x valuation jump in five months roughly tracks the growth in revenue and usage rather than narrative alone.

### Numbers to watch

- Annualized revenue above $1B, up more than 15x in a year
- Sandboxes at $300M a year, about 30% of revenue, with close to 3 billion sandboxes started
- Valuation $4.65B → $15.75B (3.4x in five months), roughly 15.75x annualized revenue

## Watchlist Status

Already in watchlist section B8. Tracking focus updated to: Sandboxes' share of revenue, agent computer-use cases after VM sandboxes went GA, and progress moving into RL and post-training products.

## Today's Takeaway

I thought of agent sandboxes as a small component bundled with frameworks. A $300M run rate for Sandboxes alone shows that "letting agents run code safely" is a market of its own, and its demand grows with the number of agents.

## References

- [Modal crosses $1B in Annualized Run Rate and raises $750M Series D — Modal](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [AI cloud startup Modal raises $750M at $15.75B valuation — SiliconANGLE](https://siliconangle.com/2026/10/14/ai-cloud-startup-modal-raises-750m-at-15-75b-valuation)
- [Modal raises $750M at $15.75bn valuation as run rate tops $1bn — The Next Web](https://thenextweb.com/news/modal-750m-series-d-15-75bn-valuation)
- [Scaling to 1 million concurrent sandboxes in seconds — Modal](https://modal.com/blog/scaling-to-1-million-concurrent-sandboxes-in-seconds)
