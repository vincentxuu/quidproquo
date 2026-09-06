---
title: "Model Card｜Claude Fable 5.1"
date: 2026-09-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: en
description: "Anthropic ships Claude Fable 5.1 alongside the restricted Claude Mythos 5.1 — the same model at two different safeguard tiers — with a 1M context window, a 75% cache-read price cut, and the top score on the neutral Artificial Analysis Intelligence Index"
tldr: "Claude Fable 5.1 (API ID: claude-fable-5-1): released by Anthropic on 2026-09-01, 1,000,000-token context window, 128,000 max output tokens, input $10.00 / output $50.00 per 1M tokens (cache reads cut to $0.25, down 75%), closed-source; 52.6% on Terminal-Bench-Science 0.1 self-reported (up from 24.7%), 66 on the neutral Artificial Analysis Intelligence Index (up from 62, ahead of GPT-6 Astra's 61); launched alongside the restricted Claude Mythos 5.1, available only to vetted cybersecurity and life-sciences organizations"
series:
  name: "AI Model Tracker"
  order: 17
glossary:
  - term: "Claude"
    def: "Anthropic's large language model family; Fable/Mythos is its newest flagship tier above Opus"
---

> 🌏 [中文版](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1)

## Model Information

| Field | Value |
|---|---|
| Model ID | `claude-fable-5-1` |
| Vendor | Anthropic |
| Parameters | Not disclosed |
| Context Window | 1,000,000 tokens (128,000 max output tokens) |
| Input pricing (USD/1M tokens) | $10.00 (cache read $0.25, 5m cache write $12.50, 1h cache write $20.00) |
| Output pricing (USD/1M tokens) | $50.00 |
| Open source | No |
| Release date | 2026-09-01 |
| Official announcement | [Anthropic: Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) |
| Family | Claude 5.x (Fable/Mythos tier; predecessor: Fable 5 / Mythos 5) |

## Highlights

- 52.6% on Terminal-Bench-Science 0.1 (agentic scientific research), more than double predecessor Fable 5's 24.7%, and ahead of Anthropic's own Opus 5 (29.0%) and OpenAI's GPT-5.6 Sol (22.4%)
- Tops the neutral, third-party Artificial Analysis Intelligence Index at 66 (max effort), ahead of predecessor Fable 5 (62) and the same-week GPT-6 Astra (61)
- Cache-read pricing drops from $1.00 to $0.25 per 1M tokens (down 75%), cutting overall cost by roughly 25% on typical workloads and up to about 45% on highly agentic workloads dominated by repeated context reads
- The restricted Mythos 5.1 variant designed protein binders with 10x the binding affinity of the best entries in Adaptyv Bio's protein-design competitions across three targets, with a hit rate near 50% across 12 targets versus a typical industry hit rate of 10-15%

## Benchmark Results

| Benchmark | Fable 5.1 | Predecessor (Fable 5) | Best competitor |
|---|---|---|---|
| Artificial Analysis Intelligence Index (neutral, max effort) | 66 | 62 | Claude Opus 5: 63.0 (GPT-6 Astra max: 61) |
| Terminal-Bench-Science 0.1 | 52.6% | 24.7% | GPT-5.6 Sol: 22.4% (GPT-6 Astra: 64.6%, OpenAI self-reported) |
| Terminal-Bench 4.0 (agentic coding) | 55.8% (Mythos 5.1: 60.9%) | 42.0% | GPT-5.6 Sol: 37.3% |
| AutomationBench (enterprise workflow automation) | 31.4% | 17.1% | GPT-5.6 Sol: 19.6% |
| Humanity's Last Exam (with tools) | 65.0% | 63.8% | GPT-6 Astra: 57.2% (OpenAI self-reported) |

⚠️ Aside from the Artificial Analysis Intelligence Index, which is an independent third-party evaluation, all other figures are vendor self-reported (Anthropic or OpenAI). The GPT-6 Astra scores for Terminal-Bench-Science and Humanity's Last Exam are quoted from OpenAI's own announcement and use a different methodology from Anthropic's hand-picked benchmarks — treat them as reference points only.

## Comparison with Predecessor/Competitors

Compared with Fable 5, the biggest gains show up in tasks requiring multi-step, long-running autonomous execution: Terminal-Bench-Science jumps from 24.7% to 52.6%, and AutomationBench from 17.1% to 31.4% — both more than doubling. Humanity's Last Exam (pure knowledge reasoning) improves by a much smaller margin, 65.0% versus 63.8%, suggesting this release is primarily an "agentic execution" upgrade rather than a broad knowledge upgrade.

Against the same-week GPT-6 Astra, the two vendors' benchmark suites barely overlap: OpenAI leads decisively on its own hand-picked FrontierMath, ARC-AGI-3, and ExploitBench, while Anthropic leads on the neutral Artificial Analysis Intelligence Index (66 vs. 61) and Humanity's Last Exam (65.0% vs. 57.2%). Headline pricing is identical at $10/$50 per 1M tokens, but cache reads differ 4x (Fable 5.1's $0.25 vs. Astra's $1.00) — for workloads that lean heavily on prompt caching across repeated calls, Fable 5.1's real-world cost is likely lower.

On pricing strategy, Anthropic chose to hold the headline rate and cut cache-read pricing instead of an across-the-board price cut: internal data shows cache reads dominate token usage in typical agentic workloads, so this structural change tracks real usage cost more closely than a flat input/output discount — consistent with Artificial Analysis's observation that the model still costs about 20% more per task even as its per-token price falls.

## Implications for Agent Development

Fable 5.1 and Mythos 5.1 are literally the same weights — the only difference is the safeguard tier applied at inference: Fable 5.1 is generally available, while Mythos 5.1 is limited to vetted cybersecurity and life-sciences organizations through the CVP and LSVP programs. If you're building defensive security tooling (vulnerability scanning, code security review): Fable 5.1 can now help identify software vulnerabilities (though not develop exploits for them), and Anthropic's own Claude Security product is now powered by Mythos 5.1 — worth evaluating.

If you're building long-running, tool-heavy agentic applications (coding agents, research agents, cross-system automation): the 75% cache-read price cut is the most directly actionable signal here — repeatedly reading long context (system prompts, project files, conversation history) is the dominant cost driver for these workloads, and the same architecture could see bills drop 25-45%, so it's worth re-running your cost model. Adaptive thinking defaults to high effort in Claude Code and medium effort in Claude Cowork/Claude.ai; if you're latency-sensitive, try low or medium effort first — Anthropic's own charts show low/medium effort already matches or beats Fable 5's results at a lower cost.

Not a fit: teams building distillation pipelines to train smaller custom models from Claude's outputs — as of accounts created after September 1, editing prior context to preserve Claude's thinking transcript in a multi-turn conversation (a common distillation technique) is explicitly blocked. Also not a fit for teams that need genuine life-sciences R&D capability (e.g., novel drug target design) — those requests get routed to safeguard-restricted Opus models, and Mythos 5.1's full capability is limited to LSVP-invited organizations.

## Today's Takeaway

I used to assume that different safeguard tiers implied different underlying models — like a "censored" version being trained separately from a "full" one. Fable 5.1 and Mythos 5.1 break that assumption: they're the same weights, and the difference lives entirely in the safeguard layer applied at inference time. That signals safety is shifting from "a capability ceiling fixed at training time" to "a configurable access-control layer applied at deployment" — more flexible for enterprise customers who need to dial protection up or down by use case, but it also means the same model's real behavioral boundaries can vary a lot by account, so evaluating risk by "which model" alone is no longer enough.

## References

- [Anthropic: Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Anthropic: Claude Fable 5.1 / Mythos 5.1 System Card](https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card)
- [Claude Platform Docs: Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview)
- [Claude official pricing page](https://claude.com/pricing)
- [Artificial Analysis: GPT-6 Astra (max) vs Claude Fable 5.1 comparison](https://artificialanalysis.ai/models/comparisons/gpt-6-astra-vs-claude-fable-5-1)
- [OpenAI: GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)
