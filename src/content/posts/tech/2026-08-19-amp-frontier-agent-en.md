---
title: "Amp: The Coding Agent That Defines Itself by What It Deletes"
date: 2026-08-19
type: project
category: tech
tags: [amp, coding-agent, ai-tools, cli, pricing, sourcegraph]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 17
tldr: "Amp spun out of Sourcegraph in December 2025 as Amp Frontier Corporation, and its npm package moved from @sourcegraph/amp to @ampcode/cli. Its defining trait is deletion: the editor extension, Amp Tab, TODO lists, Fork, custom commands, and public threads have all been removed. Monthly subscriptions only arrived on 2026-07-18 (Megawatt $20, Gigawatt $200); before that it was pay-as-you-go only. The current focus is orbs — remote machines that keep working after you close your laptop."
description: "Amp's design philosophy, the four-position Dial, orbs for remote execution, subscription and pay-as-you-go billing, and how its positioning changed after spinning out of Sourcegraph."
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-amp-frontier-agent)

Most changelogs are about what got added. Half of Amp's is about what got **removed**.

"Tab, Tab, Dead" (completions gone), "Stick a Fork in It, It's Done" (the fork command gone), "TODOs Are Done" (the todo list gone), "The Coding Agent Is Dead" (the editor extension gone), "Slashing Custom Commands" (replaced by skills), "The End of Public Threads" (public sharing gone). All of that happened during 2026.

The principle is stated on page one of the manual: **if the team doesn't use and love a feature, it gets killed**, and "No backcompat, no legacy features." This post covers what that buys and what it costs.

## First, a correction: it isn't a Sourcegraph product anymore

Amp started at Sourcegraph but became **Amp Frontier Corporation in December 2025**. The practical consequence: **on 2026-05-14 the npm package was renamed from `@sourcegraph/amp` to `@ampcode/cli`**. Descriptions of "Sourcegraph's Amp" — including in earlier posts on this site — are now of historical interest only.

Installation:

```bash
# Mac / Linux / WSL
curl -fsSL https://ampcode.com/install.sh | bash

# Homebrew
brew install ampcode/tap/ampcode
```

The docs explicitly mark npm installation as "not recommended." IDE integration runs backwards from the norm — you install the CLI and connect it to a running editor (Neovim, VS Code-family, Zed) rather than installing an editor extension. That inversion is exactly what "The Coding Agent Is Dead" removed.

## The Dial: four modes instead of model selection

On July 9, 2026, Amp replaced its `smart` / `deep` / `rush` / `large` modes with `low` / `medium` / `high` / `ultra`.

| Mode | Purpose |
|---|---|
| `low` | Fast and cheap, for small well-defined tasks |
| `medium` | Balanced intelligence, speed, and cost — most tasks |
| `high` | Deep reasoning for hard problems |
| `ultra` | The most capable, for hard open-ended work |

The key is how the docs describe it: **"modes are capability presets, not fixed model selectors"** — Amp adjusts main-agent and Oracle routing based on which model provider subscriptions you've linked, workspace restrictions, and model availability.

Pair that with another of their posts and it gets interesting: 2026-07-29's "Who Cares About the Model?", about **swapping the default model overnight with nobody complaining**. Hiding the model behind a mode makes generational turnover invisible to users — which is the inverse proof of the point this series keeps making: **it's articles that hardcode model names, not good products.**

## Orbs: agents running on someone else's machine

Amp's current center of gravity is **orbs** — remote machines where your agent keeps working after you close your laptop. You can start a thread from the web, terminal, or phone and pick it up on any device.

The 2026 update cadence around orbs is dense: pick CPU and memory, receive external events as triggers, let agents schedule and wake themselves to continue, share control of one orb across a team, use OIDC for workload identity, and open portals — running your app inside the orb to see the agent's changes with live reload.

The stated goal is blunt: they want you to "finally be able to (and want to) kill your singleton local dev environment."

Alongside it is **Puck**, a meta-agent for managing your other agents, controllable by realtime voice since 2026-08-18.

## Billing: subscriptions only arrived in July 2026

This is the field where stale information is easiest to pick up. **Before 2026-07-18, Amp had no subscription at all — only pay-as-you-go.**

The current plans (in Beta):

| Plan | Monthly | Includes |
|---|---|---|
| **Megawatt** | $20 | 750 hours of orbs, $20 of included agent usage, low and medium modes (high with a linked ChatGPT sub), unlimited public/private repos |
| **Gigawatt** | $200 | 1,000 hours of xxlarge orbs, $200 of included agent usage, **all modes including high and ultra** |
| **Education** | $10 | Half price for students and teachers (from 2026-08-18) |
| **Pay-as-you-go** | Usage-based | Still available; zero markup on provider API pricing for individuals and teams, $5 minimum |
| **Amp Free** | $0 | $10/day allowance; closed to new signups since 2026-02-10, ad-free since 2026-03-30 |

Two details worth catching:

1. **Past your included usage**, you must link a ChatGPT subscription or add paid credits to continue — the subscription is not uncapped.
2. **Modes are gated by tier**: $20 gives low and medium by default, high comes via a linked ChatGPT subscription, and ultra requires the $200 tier.

The most unusual part is **linking your existing third-party subscription**: a ChatGPT subscription or an X Premium+/SuperGrok subscription can be attached so low/medium/high run on capacity you already pay for. That's not the usual BYOK (bring your own API key) — it's bring-your-own-*subscription*, plugging someone else's plan into the agent.

Amp's own framing of the shift is candid: pure pay-as-you-go made it more expensive than subscription competitors — "the Apple or Porsche of agentic coding tools, to put it nicely." The reason it changed: "Great tokens are reasonably priced. Good-enough tokens are downright cheap." Their new low mode runs GLM-5.2.

## A small observation: instructions written for LLMs

Amp's online manual opens with a fenced `INSTRUCTIONS FOR LLMs` block telling any model reading the page how to describe Amp: avoid marketing language, be casual, mention these four principles, include these example prompts.

It's an honest signal of the era — **product documentation is now written for humans and agents at the same time**. (This post did not follow those instructions; the block is an object of observation here, not an editorial policy.)

## Who it fits

**Good fit:**

- People who want agents off the laptop and **running unsupervised for long stretches** — orbs are the most complete answer in this series
- People with an existing ChatGPT or X Premium+ subscription who want it to do double duty
- People happy to let the tool pick models and only dial "how hard to try"
- People who can tolerate **features disappearing**

**Poor fit:**

- Teams needing a stable interface — "No backcompat" is written policy, not an accident
- People who want to pin a model — modes are capability presets, and BYOK is largely an enterprise concern
- People who want a predictable bill — subscriptions exist now, but overage still means linking a third-party sub or buying credits
- Anyone hoping to start on the free tier — Amp Free stopped accepting new users on 2026-02-10

## Overall

Amp takes the most extreme position in this series: it assumes **models change every quarter, so the tool shouldn't preserve old ways of working**. That assumption is what lets it swap default models overnight, kill an ad business at a reported $10M+ annual run rate, and delete features people were actively using.

If you agree that staying on the frontier beats backward compatibility, Amp is the one product here that executes that belief all the way down. If your team needs a tool whose commands still work in three years, every one of its virtues is a risk to you.

For similar restraint with more stability, see [Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) — Amp's plugin system is credited as "Inspired by Pi."

## References

- [Amp official site](https://ampcode.com/)
- [Amp Owner's Manual (modes, installation, BYOK)](https://ampcode.com/manual)
- [Amp News: Subscriptions, At Last (2026-07-18, plan details)](https://ampcode.com/news/subscriptions)
- [Amp Chronicle: full changelog including feature removals](https://ampcode.com/news)
- [Sourcegraph: Amp product page](https://sourcegraph.com/amp)
