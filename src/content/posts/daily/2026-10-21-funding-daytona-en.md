---
title: "Funding Alert｜Daytona Raises $60M Series B, Becomes a Unicorn Betting on an Agent-Native Cloud"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, funding, daily, daytona, agent-sandbox]
lang: en
description: "Daytona raised $60M Series B led by FirstMark at a $1B valuation, arguing AI agents need compute infrastructure that's fundamentally different from the cloud built for humans"
tldr: "Daytona raised $60M Series B led by FirstMark, hitting a $1B valuation. The signal: once companies start running thousands of AI agents at once, the basic unit of cloud computing stops being a 'virtual machine for a person' and becomes a 'sandbox spun up in 60 milliseconds and thrown away.'"
series:
  name: "AI Agent Funding"
  order: 97
---

> 🌏 [中文版](/posts/daily/2026-10-21-funding-daytona)

## Funding Details

| Item | Value |
|---|---|
| Company | Daytona (San Francisco, US) |
| Round | Series B |
| Amount | $60M |
| Lead | FirstMark |
| Participants | Stripe co-founder Patrick Collison, Shopify co-founder Tobi Lütke, Perplexity co-founder Aravind Srinivas, Quora co-founder Adam D'Angelo, Zoom founder Eric Yuan, plus Qualcomm Ventures, Samsung Next, and Okta Ventures |
| Valuation | $1B (unicorn; roughly $50M of this round came from existing investors doubling down) |
| Total raised | About $91M |
| Founded | 2023 |
| Headcount | Undisclosed |

## What this company does

Daytona builds a cloud made specifically for AI agents. Whenever an agent needs to write and run code, browse the web, or operate business software, it needs a computer — and Daytona's job is to spin one up, fully configured, in 60 milliseconds, and throw it away the moment the task is done.

The company started in 2023 building developer-environment automation for enterprises. Co-founders Ivan Burazin, Goran Draganić, and Vedran Jukić saw that AI agents would need the same kind of computer, so they handed their existing customer base to competitors, rebuilt the product from scratch, and relaunched it as an "agent-native cloud" with about three months of runway left. The core technical edge is speed: where traditional cloud providers like AWS, Azure, and GCP take 30 seconds to several minutes to spin up a virtual machine, Daytona pre-distributes snapshots of configured machines across physical servers, so an agent can attach compute and resume from a snapshot almost instantly — cutting boot time to 60 milliseconds. It can also clone a running machine into two, letting an agent try different approaches in parallel.

Customers already include Anthropic, OpenAI, NVIDIA, Cursor, Cognition, Meta, and Cohere. AI data company Snorkel alone has provisioned more than a million sandboxes on the platform. Daytona says its revenue run rate grew 25x between January and September, averaging 50.9% month-over-month growth.

## What this round signals

### What it means for the agent ecosystem

Daytona's pitch is that the next shift in infrastructure isn't cloud built for humans — it's cloud built for agents, which puts it in a different category from "neoclouds" like CoreWeave and Nebius that are built for GPU training and inference. Daytona's servers run ordinary CPUs, built for agents to *act*, not to *think*. Founder Ivan Burazin points to Meta's Muse, a personal assistant launched in September, as an example: if every conversation needs a computer behind it, serving 100 million users would require $2.8 billion worth of sandboxes by his rough math — a number that hints at where compute costs are heading as agent deployments scale: not just GPU-heavy, but GPU-plus-massive-CPU-sandbox-heavy.

### What the investors are betting on

FirstMark partner Matt Turck has publicly framed this as an infrastructure-level bet: "the next infrastructure shift is from human-centric cloud primitives to agent-native ones." The roster of participants is notable too — instead of typical institutional LPs, the round pulled in individual checks from the founders of Stripe, Shopify, Perplexity, Zoom, and Quora, people who've each built infrastructure at scale themselves and are personally convinced that agents need their own compute layer.

### Numbers worth tracking

- A 60-millisecond sandbox spin-up time is at least 500x faster than the 30 seconds to several minutes typical of traditional cloud providers — a direct match for the short, high-frequency nature of agent workloads
- Revenue run rate grew 25x from January to September, averaging 50.9% month-over-month — a sign agent sandbox demand is still in an early, explosive phase
- A single customer, Snorkel, has provisioned over a million sandboxes — far beyond what the "one VM per person" assumption behind traditional cloud computing was ever built for

## Watchlist status

Daytona is already on the watchlist under section B8 (Sandboxes / Execution Environments), alongside E2B, Runloop, and Cloudflare Sandboxes. Tracking notes updated: $60M Series B at a $1B valuation led by FirstMark, with customers including Anthropic, OpenAI, NVIDIA, Cursor, and Cognition, and a 60ms sandbox spin-up time as the core differentiator.

## Today's takeaway

Most people think of "agent infrastructure" as an extension of model inference, but Daytona's bet runs the other way — inference (GPUs) only handles how an agent *thinks*; actually *doing* things runs on CPU-powered sandboxes, and that layer's compute demand scales linearly, maybe faster, with every agent a company deploys. When a company can split "cloud for humans" and "cloud for agents" into two genuinely distinct infrastructure products — and get the founders of Stripe, Shopify, and Zoom to back that split with their own money — that's no longer just a technical argument. It's capital already repositioning around it.

## References

- [Exclusive: Daytona, a startup building the 'agentic cloud,' valued at $1 billion in latest funding round](https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/)
- [Daytona hits $1B valuation with $60M Series B for AI agent cloud](https://tech.eu/2026/10/20/daytona-hits-1b-valuation-with-60m-series-b-for-ai-agent-cloud)
- [Daytona Raises $60M in Series B Funding](https://www.finsmes.com/2026/10/daytona-raises-60m-in-series-b-funding.html)
