---
title: "AI Agent GitHub Digest — 2026-09-26"
date: 2026-09-26
category: daily
tags: [ai-agent, github, open-source, daily, decision-model, agent-orchestration, agent-tools]
lang: en
description: "TypeSafe's 'silent' decision model Jev spread into native integrations in Pydantic AI and DSPy within a week, and Nokia's applied research team open-sourced a training-free compatibility layer, AnyJev"
tldr: "Nokia's applied research team open-sourced AnyJev, which uses cyclic shifts plus batch prior correction to turn any open LLM into a calibrated decision model with no training — raising auto-decidable traffic from 7.7% to 52.0% in their own benchmark. DSPy 3.4.0 added a TypeSafe client integration with two breaking changes. Pydantic AI v2.50.0 promoted last week's `TypeSafeModel` into a formal `DecisionModel` base class. Also trending: golive-skill, which hands a coding agent the last step of actually shipping to production; magpie, which turns swapping a coding agent's backend model into a menu-bar click; and sno-station, which pairs Claude Code and Codex on one machine and lets them rewrite their own skills."
series:
  name: "AI Agent GitHub Digest"
  order: 42
---

> 🌏 [中文版](/posts/daily/2026-09-26-ai-agent-github-digest)

## Today's Highlight

The word popping up everywhere this week is Jev — the "silent" decision model TypeSafe shipped last week. Instead of text, it outputs structured decisions: Choice, Score, or Noul (a true/false probability). Today shows exactly how fast it's spreading: Pydantic AI v2.50.0 promoted last week's `TypeSafeModel` into a formal `DecisionModel` base class, DSPy 3.4.0 added a TypeSafe client integration the same day, and Nokia's applied research team open-sourced AnyJev, letting teams still stuck on the waitlist wrap any open LLM into the same calibrated decision layer without training it. A primitive that was public for barely a week is now infrastructure for three independent camps.

## Trending Repos

### nokia-applied-research/AnyJev ⭐ 662 (created 09-21, within 5 days, ~132/day average)

[GitHub](https://github.com/nokia-applied-research/AnyJev)　·　Python　·　Apache-2.0

- **What it is**: A Python library from Nokia's applied research team that turns any open LLM into a calibrated decision model without additional training, using cyclic shifts (showing the option list in every rotation and taking the geometric mean to cancel out position bias) plus batch prior correction.
- **Why it matters**: Reading decisions straight off next-token logits has two known flaws — the answer flips when you reorder the options, and the raw probabilities aren't calibrated. AnyJev fixes both in two tiers: L0 needs no labeled data, L1 adds temperature scaling from 100–500 labeled examples. On Qwen3-8B/BANKING77, Nokia's own benchmark raised the share of traffic that's "auto-decidable within 5% error" from 7.7% to 52.0%, and cut the order-flip rate from 0.230 to 0.073. It's a rare case of a telecom-equipment R&D team shipping an open-source alternative for a paradigm that's barely a week old.
- **Tech stack**: Python + Hugging Face Transformers / vLLM inference backends + shared-prefix batch scoring
- **Getting started**: Medium — `pip install anyjev[hf]` runs out of the box, but getting correct probabilities requires understanding the L0/L1 calibration tiers and picking the right question type

---

### mikehasa/golive-skill ⭐ 942 (created 09-23, within 3 days, ~314/day average)

[GitHub](https://github.com/mikehasa/golive-skill)　·　TypeScript　·　MIT

- **What it is**: An Agent Skill usable by Claude Code or Codex that picks up where most coding agents stop — actually taking the app they just built live.
- **Why it matters**: Most coding agents stop once the code compiles; wiring up hosting, a database, a domain, email, and payments is still manual. golive-skill runs a detect→plan→approve→apply→verify pipeline straight against your own Vercel/Netlify/Supabase/Neon/Cloudflare accounts, with no backend of its own and no telemetry — the deployment still happens on your own accounts, not through another managed layer in between.
- **Tech stack**: TypeScript + zero-dependency Node CLI + each hosting/DB/DNS provider's own API
- **Getting started**: Low — drop it into your agent's skill directory and the agent decides which provider to call

---

### yetone/magpie ⭐ 791 (created 09-23, within 3 days, ~264/day average)

[GitHub](https://github.com/yetone/magpie)　·　Go　·　MIT

- **What it is**: A macOS menu-bar utility that turns "run Codex on DeepSeek, run Claude Code on Kimi" into a two-click operation.
- **Why it matters**: Coding-agent shells (Claude Code, Codex) are decoupling from their backend models fast, but switching providers today usually means editing config files or reconciling API formats. magpie sits in as a routing layer that absorbs those protocol differences, addressing a very concrete pain point developers are already solving by hand.
- **Tech stack**: Go + local routing daemon + compatibility adapters for each LLM API
- **Getting started**: Low — pick the model combination from the menu bar; no changes needed to the agent itself

---

### sno-ai/sno-station ⭐ 212 (created 09-19, within 7 days, ~30/day average)

[GitHub](https://github.com/sno-ai/sno-station)　·　TypeScript　·　Apache-2.0

- **What it is**: A local multi-agent coordination layer that lets Claude Code and Codex work as a squad on the same machine, sharing encrypted memory and messaging each other.
- **Why it matters**: Most multi-agent frameworks are built for agents in the cloud calling each other. sno-station instead targets the much more concrete case of one person's two different coding-agent brands dividing up work, and adds a nightly loop — gated on human approval — that lets the agents rewrite their own skills. That "self-rewriting" step is rarer than the usual "self-remembering" one, and deserves more caution.
- **Tech stack**: TypeScript + a local encrypted messaging layer (Reach) + no daemon, no cloud required
- **Getting started**: Medium — the concept is novel enough that you'll want to understand "squad skills" and the approval flow before letting it run unattended

---

### mitkox/esf ⭐ 148 (created 09-19, within 7 days, ~21/day average)

[GitHub](https://github.com/mitkox/esf)　·　Go　·　MIT

- **What it is**: A self-hosted "engineering software factory" that wraps sandboxed coding agents in Temporal workflows, leaving a verifiable audit trail at every step.
- **Why it matters**: Most coding-agent projects care whether the code got written; esf cares how it got written — whether the run can be replayed and audited. That's the direction that pushes coding agents from personal toys toward a pipeline a team can actually trust in production, with Temporal guaranteeing failed steps retry instead of silently vanishing.
- **Tech stack**: Go + Temporal workflow engine + the CubeSandbox execution sandbox
- **Getting started**: High — you need to self-host a Temporal cluster; this is aimed at teams building an internal agent-development pipeline, not individual developers

## Notable Releases

### DSPy 3.4.0

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0)

- **What changed**: Added a TypeSafe client integration that calls Jev directly for typed `Noul`/`Choice`/`Score` decision outputs; added a `ReAnchor` optimizer that recalibrates decision thresholds against your own scoring function; the native `dspy.lm15` LM engine replaces the execution path that previously depended entirely on LiteLLM, and opens up registering custom HTTP providers; added a persistent, non-sandboxed `LocalInterpreter` (for RLM/Flex) and an async `ReActV2`.
- **Breaking Changes**: `RLM`'s `interpreter_factory` parameter is now keyword-only; the old experimental LM types from 3.3 have been removed entirely.
- **What it means for you**: If your code calls `interpreter_factory` positionally, or still relies on 3.3's old experimental LM types, upgrading will break immediately until you rewrite against the new interface.

---

### Pydantic AI v2.50.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.50.0)

- **What changed**: Added a `DecisionModel` base class, promoting last week's `TypeSafeModel` (from v2.49.0) into a formal "Decisions protocol" model family that routes by named labels; added `gemini-3.8-live`/`gemini-3.8-live-extended-thinking` realtime voice support; every `DecisionModel` request now emits its own `decide` tracing span; fixed several billing bugs around Anthropic's one-hour cache pricing, realtime-voice image pricing, and audio-duration billing.
- **Breaking Changes**: None — this release is mostly new features and billing/streaming bug fixes.
- **What it means for you**: If you're using Anthropic's one-hour cache or Gemini Live voice features, this release fixes billing bugs that directly affect your invoice — worth upgrading to check.

## Today's Takeaway

I used to think "model capability" was mostly a race over whose text generation was more accurate and faster. Jev offers a different answer this week: strip language out entirely and leave only structured decisions and probabilities that ordinary code can consume directly. What's more striking is how fast it spread — a model that went public barely a week ago, still on a waitlist, already has native support in two mainstream frameworks (DSPy and Pydantic AI), and Nokia's applied research team has already shipped a training-free compatibility layer for it. Framework maintainers are now treating "decision models" as a category parallel to text-generation models, rather than squeezing them into the existing LLM call interface.

## References

- [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev)
- [mikehasa/golive-skill](https://github.com/mikehasa/golive-skill)
- [yetone/magpie](https://github.com/yetone/magpie)
- [sno-ai/sno-station](https://github.com/sno-ai/sno-station)
- [mitkox/esf](https://github.com/mitkox/esf)
- [DSPy 3.4.0 — Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0)
- [Pydantic AI v2.50.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.50.0)
- [Nokia Open-Sources AnyJev — MarkTechPost](https://www.marktechpost.com/2026/09/23/nokia-open-sources-anyjev-a-training-free-layer-that-turns-any-open-llm-into-a-calibrated-decision-model/)
