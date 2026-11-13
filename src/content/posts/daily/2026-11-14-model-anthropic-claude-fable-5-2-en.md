---
title: "Model Card｜Claude Fable 5.2"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: en
description: "Anthropic ships Claude Fable 5.2 and Claude Mythos 5.2 — same weights, 30% faster output, and a 20% API price cut to $8/$40 — while FrontierSWE v2 jumps to 69.9%, ahead of the predecessor and every competitor Anthropic tested"
tldr: "Claude Fable 5.2 (API ID: claude-fable-5-2) replaced Fable 5.1 on 2026-11-09: 1,000,000-token context, 128,000 max output tokens, input $8.00 / output $40.00 per 1M tokens (down 20% from the predecessor), closed-source; FrontierSWE v2 (agentic coding) hits 69.9%, 13.6 points above Fable 5.1's 56.3%, and RoboDojo Sim robot control jumps from 27.6% to 64.9%. The restricted Claude Mythos 5.2 variant finds 10.2% more vulnerabilities than Opus 5.5 on CVE Rediscovery."
series:
  name: "AI Model Tracker"
  order: 72
glossary:
  - term: "Claude"
    def: "Anthropic's large language model family; Fable/Mythos is its newest flagship tier above Opus"
---

> 🌏 [中文版](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2)

## Model Information

| Field | Value |
|---|---|
| Model ID | `claude-fable-5-2` |
| Vendor | Anthropic |
| Parameters | Not disclosed |
| Context Window | 1,000,000 tokens (128,000 max output tokens) |
| Input pricing (USD/1M tokens) | $8.00 (cache read $0.20, 5m cache write $10.00, 1h cache write $16.00) |
| Output pricing (USD/1M tokens) | $40.00 |
| Open source | No |
| Release date | 2026-11-09 |
| Official announcement | [Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2) |
| Family | Claude 5.x (Fable/Mythos tier; predecessor: Fable 5.1 / Mythos 5.1) |

## Highlights

- FrontierSWE v2 (agentic coding) hits 69.9%, up 13.6 points from predecessor Fable 5.1's 56.3%, and ahead of GPT-6 Astra's 65.5%
- RoboDojo Sim (simulated robot control) jumps from the predecessor's 27.6% to 64.9% — more than double, and ahead of Anthropic's own Opus 5.5 (39.4%)
- Output generation is 30% faster than Fable 5.1 (fast mode adds another 2.5x), while pricing drops 20%, from $10/$50 to $8/$40
- The restricted Mythos 5.2 variant finds 10.2% more vulnerabilities than Opus 5.5 and 14.4% more than predecessor Mythos 5.1 on CVE Rediscovery, while the safety classifiers' false-block rate drops 55%

## Benchmark Results

| Benchmark | Fable 5.2 | Predecessor (Fable 5.1) | Best competitor |
|---|---|---|---|
| FrontierSWE v2 (agentic coding) | 69.9% | 56.3% | GPT-6 Astra: 65.5% |
| Terminal-Bench-Science 0.1 (agentic scientific research) | 74.6% (Mythos 5.2: 75.3%) | 52.6% | GPT-6 Astra: 68.1% |
| OSWorld 2.1 (computer use, offline set) | 89.3% | 83.5% | Opus 5.5: 87.2% |
| Humanity's Last Exam (with tools) | 74.2% | 65.6% | Opus 5.5: 67.7% |
| RoboDojo Sim (robot control, internal eval) | 64.9% | 27.6% | Opus 5.5: 39.4% |

⚠️ All figures come from Anthropic's own hand-picked benchmark suite in its official announcement. The "best competitor" scores for GPT-6 Astra and Opus 5.5 were also run by Anthropic itself and may use a different methodology from OpenAI's or Google's own self-reported numbers — treat them as reference points only.

## Comparison with Predecessor/Competitors

Compared with Fable 5.1, the biggest gains land in tasks requiring long-running autonomous execution and physical control: RoboDojo Sim jumps from 27.6% to 64.9% (more than double), Remote Labor Index rises from 17.9% to 41.3% (2.3x), and Terminal-Bench-Science 0.1 gains 22 points — this release continues Fable 5.1's trajectory of pushing agentic execution capability rather than broad knowledge.

Against same-generation competitors, Fable 5.2 leads Opus 5.5, GPT-6 Astra, and Gemini 4 Carbon on most of Anthropic's own benchmark suite, but not every one: it loses to Gemini 4 Carbon on AutomationBench (enterprise workflow automation, 51.4% vs. 53.9%) and on Chartography (visual chart recognition, 73.4% vs. 72.5%, a narrow margin), and also trails GPT-6 Astra on Chartography (71.0%). On pricing, Fable 5.2's $8/$40 is 20% below its predecessor and still above Anthropic's own Opus 5.5 ($4/$20, exactly half), but it now opens a 20% price gap against GPT-6 Astra, which holds its $10/$50 sticker price.

## Implications for Agent Development

Fable 5.2 and Mythos 5.2 continue the Fable 5.1 pattern: the same underlying weights, differing only in the safeguard tier applied at inference. Anthropic positions Fable 5.2 for "the most ambitious, open-ended technical work," while recommending most coding and knowledge tasks start with Opus 5.5 and scale up to Fable or down to Sonnet/Haiku as complexity demands. Fable 5.2 can also act as an Advisor (consulted by smaller models on harder problems) or an Orchestrator (delegating simpler tasks to smaller models).

- If you're building multi-agent, long-running systems (research, planning, cross-tool automation): Fable 5.2 is well-suited as an orchestrator or advisor — Anthropic's own case study shows a team of 1,000 agents formalizing a proof of Fermat's Last Theorem in 30 hours, down from the 11 days a manual research effort previously took. Coordination capability is the core selling point of this release
- If you're building hardware or robotics applications: the jump in RoboDojo Sim (27.6% → 64.9%) and Anthropic's own circuit-board design demos are worth a look — "the model directing the physical world" hasn't historically been a Claude strength, and this release marks a clear inflection point
- Not a fit: workloads requiring zero data retention (ZDR) — Fable 5.2 requires 30-day data retention unless Anthropic grants an explicit exception. Also not a fit for distilling Claude's outputs into smaller custom models — this release ships Anthropic's strongest-ever anti-distillation protections (cutting data harvested by distillers 90-99%), and preserved thinking now applies to all accounts, closing off the path of editing prior context to extract reasoning transcripts

## Today's Takeaway

One counterintuitive detail in this release: Anthropic shipped its strongest-ever anti-distillation protections while simultaneously cutting the safety classifiers' false-block rate by 55% (60% fewer false blocks in cybersecurity, 40% fewer in biology). It's easy to assume "stricter safeguards" and "fewer false positives on legitimate use" trade off against each other, but this classifier update achieved both at once — a reminder that the real bottleneck on guardrail quality usually isn't a single "loose vs. strict" dial, it's how accurate the classifier itself is. Treating those as two separate axes, rather than one, is what reveals the room still left to optimize.

## References

- [Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Claude Platform Docs: Claude Fable 5.2 Overview](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic: Claude Fable 5.2 and Mythos 5.2 System Card](https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card)
- [This site: Pricing Tracker｜Claude Fable 5.2 replaces 5.1, API price cut 20%](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut-en)
- [This site: Benchmark Shift｜Arena Agent and CursorBench reshuffle in the same week](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2-en)
- [This site: Model Card｜Claude Fable 5.1 (predecessor)](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1-en)
