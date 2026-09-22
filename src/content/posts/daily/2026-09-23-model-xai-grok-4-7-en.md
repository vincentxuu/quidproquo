---
title: "Model Card: Grok 4.7"
date: 2026-09-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, xai, model-family-grok]
lang: en
description: "xAI ships Grok 4.7 on a new, larger base model — official Terminal-Bench 4.0 jumps from 20.3% to 38.0%, but Artificial Analysis's independent re-test puts it at just 26%. Pricing holds at $2/$6 and GitHub Copilot support lands the same day."
tldr: "Grok 4.7 shipped 2026-09-21 as `grok-4.7`: a new, larger base model with longer RL training; 500K-token context window; API pricing unchanged at $2.00 input / $6.00 output per 1M tokens (rising to $4.00/$12.00 above 200K tokens). xAI's own Terminal-Bench 4.0 score jumps from 20.3% to 38.0%, but Artificial Analysis's independent re-test puts it at only 26% — well behind GPT-6 Astra (60%) and Claude Fable 5.1 (55%). It rolled out to all GitHub Copilot plans the same day. For agent builders, it's a 3-8x cheaper option for agentic coding, but complex autonomous terminal work still warrants independent benchmarking before you rely on it."
series:
  name: "AI Model Tracker"
  order: 29
glossary:
  - term: "Grok"
    def: "xAI's (SpaceXAI) large language model family, built around real-time integration with X (Twitter)"
  - term: "Terminal-Bench"
    def: "A benchmark that measures a model's ability to autonomously execute multi-step commands, debug, and complete tasks in a real terminal environment — widely used as a proxy for agentic coding capability"
---

> 🌏 [中文版](/posts/daily/2026-09-23-model-xai-grok-4-7)

## Model Info

| Field | Value |
|---|---|
| Model ID | `grok-4.7` |
| Vendor | xAI (SpaceXAI) |
| Parameters | ~2.1 trillion (per third-party reporting; xAI has not published an exact figure on its spec page) |
| Context Window | 500,000 tokens |
| Input pricing (USD/1M tokens) | $2.00 (< 200K prompt tokens) / $4.00 (≥ 200K) |
| Output pricing (USD/1M tokens) | $6.00 (< 200K prompt tokens) / $12.00 (≥ 200K) |
| Open source | No |
| Release date | 2026-09-21 |
| Official announcement | [xAI News: Introducing Grok 4.7](https://x.ai/news/grok-4-7) |
| Family | Grok 4.x (Grok 4.5 → Grok 4.6 → Grok 4.7, this release) |

## Highlights

- Official Terminal-Bench 4.0 score jumps from Grok 4.6's 20.3% to 38.0% (+17.7pp) — the largest gain of any benchmark in this release
- EEBench (electrical-engineering tasks) hits 64.0%, beating both the prior generation (53.0%, +11.0pp) and every competitor xAI cited: GPT-5.6 Sol Max (39.4%) and Claude Fable 5.1 Max (56.4%)
- Built on an entirely new, larger base model, with a longer reinforcement-learning run weighted toward harder, longer-horizon tasks — xAI frames the training goal as "finishing the work," not just producing a plausible-looking answer
- A rebuilt safeguard stack: on HackerBench v0.3 (malicious cyber tasks), the pass-through rate for dangerous dual-use prompts drops to just 3.3%; on LatchBio's biosafety benchmark it posts the top score of 62.4%

## Benchmarks

| Benchmark | Grok 4.7 | Previous gen (Grok 4.6) | Best competitor |
|---|---|---|---|
| CursorBench 4.0 | 46.3% | 40.4% | Claude Fable 5.1 Max 51.8% |
| DeepSWE v1.1 (high) | 71.0% | 65.2% | GPT-5.6 Sol Max 72.7% |
| Terminal-Bench 4.0 (xAI self-reported) | 38.0% | 20.3% | Claude Fable 5.1 Max 57.9% |
| EEBench | 64.0% | 53.0% | Best in field (GPT-5.6 Sol Max 39.4%) |
| Artificial Analysis Intelligence Index (independent) | 46 | No directly comparable prior score | Claude Fable 5.1 / GPT-6 tied at 53 |
| Terminal-Bench 4.0 (Artificial Analysis re-test, standardized conditions) | 26% | — | GPT-6 Astra 60%, Claude Fable 5.1 55% |

⚠️ Except for the two Artificial Analysis rows, every figure above is self-reported by xAI or the respective vendor, each run at its own highest reasoning-effort setting (high/max) — these are not apples-to-apples comparisons and await further independent replication.

## vs. Previous Generation / Competitors

Against Grok 4.6, Grok 4.7's biggest gains land in agentic coding: CursorBench 4.0 (+5.9pp), DeepSWE v1.1 (+5.8pp), and — most dramatically — a near-doubling on Terminal-Bench 4.0 (20.3% → 38.0%). xAI attributes this to swapping in a larger new base model and up-weighting training data toward difficult, hours-long tasks.

The competitive picture is more mixed. On xAI's own numbers, Grok 4.7 beats GPT-5.6 Sol Max on CursorBench 4.0 and EEBench, and edges out Claude Fable 5.1 Max on DeepSWE v1.1 — but its self-reported Terminal-Bench 4.0 score still trails Fable 5.1 Max by nearly 20 points. More notably, when Artificial Analysis re-ran Terminal-Bench 4.0 under standardized conditions, Grok 4.7 scored just 26% — 12 points below xAI's own 38.0% figure, and far behind GPT-6 Astra's 60% and Claude Fable 5.1's 55%. On that same firm's composite Intelligence Index, Grok 4.7 scores 46, seven points behind the co-leaders Claude Fable 5.1 and GPT-6 (53 each), placing it in the middle of the frontier pack.

Pricing is unchanged: $2/$6 (below 200K tokens), identical to Grok 4.5 and 4.6. That puts Grok 4.7's output pricing at a third of GPT-5.6 Sol's and an eighth of Claude Fable 5.1's — a cost advantage that compounds in agentic workloads with long reasoning chains and heavy output-token usage.

## What This Means for Agent Development

Grok 4.7's training focus — sustaining long-horizon tasks and stronger self-verification, plus native understanding of xAI's own Grok Bot harness — directly benefits teams already building on the Grok ecosystem. But the 12-point gap between xAI's self-reported Terminal-Bench 4.0 score and Artificial Analysis's independent re-test suggests the official numbers may be optimistic for real-world autonomous terminal work.

- If you're building cost-sensitive agentic coding products (e.g., a SaaS running coding agents at scale): the $2/$6 pricing, combined with scores that match or slightly beat GPT-5.6 Sol / Fable 5.1 on CursorBench and DeepSWE, makes Grok 4.7 worth evaluating as a drop-in replacement for some of your higher-cost calls — especially if you already use GitHub Copilot, Cursor, or Grok Build, where the switch is available day one
- If you're building an agent for electrical engineering or a similar vertical knowledge-work domain: the top EEBench score is a signal worth A/B testing in that specific niche
- Not a good fit: high-reliability, complex autonomous terminal work (multi-step shell commands, handling unexpected errors over long sessions) — Artificial Analysis's standardized re-test shows a real gap versus GPT-6 Astra and Claude Fable 5.1 here. Basing capacity planning on xAI's self-reported 38.0% may be overly optimistic; run your own task set through independent evaluation before betting heavily on this capability

## Today's Takeaway

Grok 4.7's Terminal-Bench 4.0 score is 38.0% by xAI's own testing, but only 26% under Artificial Analysis's standardized independent re-test — a 12-point gap on the exact same benchmark name. That's a reminder worth internalizing: a vendor's self-reported benchmark score and a third party's re-test under controlled conditions are not the same measurement, especially for agentic and terminal-operation benchmarks, where differences in tooling versions, timeout settings, and reasoning-effort levels can swing the result. When independent re-test data exists, don't stop at the vendor's own table.

## References

- [xAI News: Introducing Grok 4.7](https://x.ai/news/grok-4-7)
- [xAI Developer Docs: Grok 4.7](https://docs.x.ai/developers/grok-4-7)
- [xAI Model Card PDF: Grok 4.7 (2026-09-21)](https://media.x.ai/v1/website/4p7card-5eccc980.pdf)
- [iWeaver: Grok 4.7 Benchmarks, Specs, and Grok 4.6 Comparison](https://www.iweaver.ai/blog/grok-4-7/)
- [XenoSpectrum: xAI Launches Grok 4.7 at $2 per Million Tokens, Rolls Out Instantly to GitHub Copilot](https://xenospectrum.com/en/xai-grok-4-7-pricing-copilot/)
- [Decrypt: xAI Launches Grok 4.7. It's Bigger, But Late to the AI Frontier Party](https://decrypt.co/378824/xai-launches-grok-4-7)
