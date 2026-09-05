---
title: "Model Card｜GPT-6 Astra"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI ships GPT-6 Astra and declares an 'AGI era' — near-saturating ARC-AGI-3 and FrontierMath Tier 4, yet also the first model rated 'Critical' cybersecurity capability; on the neutral Artificial Analysis Intelligence Index it merely ties its predecessor and trails Claude Fable 5.1"
tldr: "GPT-6 Astra (API ID: gpt-6-astra): released by OpenAI on 2026-09-03, 1,050,000-token context window, 128,000 max output tokens, input $10.00 / output $50.00 per 1M tokens (cached input $1.00), closed-source; 99.9% on ARC-AGI-3 under OpenAI's own harness (62.7% on the standardized harness), 97.6% on FrontierMath Tier 4, 100% on ExploitBench; the first model rated 'Critical' cybersecurity capability under OpenAI's Preparedness Framework; yet scores only 61 on the neutral Artificial Analysis Intelligence Index — tied with predecessor GPT-5.6 Sol and behind Claude Fable 5.1's 66"
series:
  name: "AI Model Tracker"
  order: 16
glossary:
  - term: "GPT"
    def: "OpenAI's large language model family; Astra is its current flagship generation"
---

> 🌏 [中文版](/posts/daily/2026-09-06-model-openai-gpt-6-astra)

## Model Information

| Field | Value |
|---|---|
| Model ID | `gpt-6-astra` |
| Vendor | OpenAI |
| Parameters | Not disclosed |
| Context Window | 1,050,000 tokens (128,000 max output tokens) |
| Input pricing (USD/1M tokens) | $10.00 (cached input $1.00, cache write $12.50) |
| Output pricing (USD/1M tokens) | $50.00 |
| Open source | No |
| Release date | 2026-09-03 |
| Official announcement | [OpenAI: GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) |
| Family | GPT-6.x (predecessor: GPT-5.6 Sol/Terra/Luna) |

## Highlights

- Scores 99.9% on ARC-AGI-3 (unfamiliar interactive game environments) under OpenAI's own harness, but only 62.7% when ARC Prize reruns it on the standardized harness — the gap highlights how much "model + proprietary scaffolding" differs from a model-only evaluation
- 97.6% on FrontierMath Tier 4 (research-level math problems), which OpenAI says already helped resolve several long-standing open problems; 96.0% on GPQA Diamond (graduate-level science Q&A), the highest published score of any model
- 100% on ExploitBench (offensive cybersecurity), and the first model rated "Critical" cybersecurity capability under OpenAI's Preparedness Framework — advanced offensive capabilities are limited to vetted defensive testers
- On the OSWorld 2.0 computer-use benchmark: 72.6% accuracy, completing tasks in roughly 47% less time than predecessor GPT-5.6 Sol (40 minutes vs. 75 minutes per task)

## Benchmark Results

| Benchmark | GPT-6 Astra | Predecessor (GPT-5.6 Sol) | Best competitor |
|---|---|---|---|
| Artificial Analysis Intelligence Index (neutral aggregate, max) | 61 | 61 (tied) | Claude Fable 5.1: 66 |
| ARC-AGI-3 (standardized harness) | 62.7% | 7.8% | Claude Opus 5: 30.2% |
| FrontierMath Tier 4 v2 | 97.6% | 83.0% | Claude Fable 5.1: 87.8% |
| DeepSWE v1.1 (agentic software engineering) | 74.1% | 70.8% | Meta Muse Spark 1.3: 75.4% (max reasoning) |
| Humanity's Last Exam (with tools) | 57.2% | Not disclosed | Claude Fable 5.1: 65.0% |
| Terminal-Bench Science 0.1 | 64.6% | 22.4% | Claude Fable 5.1: 52.6% |

⚠️ Most figures above are OpenAI's own self-reported results (the 99.9% ARC-AGI-3 score from OpenAI's own harness is omitted from the table in favor of ARC Prize's independent standardized-harness rerun). The Artificial Analysis Intelligence Index is a neutral third-party evaluation with a different methodology from OpenAI's hand-picked benchmarks, and the two paint noticeably different pictures.

## Comparison with Predecessor/Competitors

On the benchmarks OpenAI chose and ran itself, Astra dominates both its predecessor and competitors: FrontierMath, ARC-AGI-3 (OpenAI's own harness), and ExploitBench all sit near or at saturation. But on the neutral, third-party Artificial Analysis Intelligence Index, Astra scores only 61 — tied with the model it replaces, GPT-5.6 Sol, and 5 points behind Claude Fable 5.1 (66), which Anthropic released just three days earlier. That suggests the "generational leap" is concentrated in benchmarks OpenAI specifically optimized for (math, computer use, cybersecurity) rather than a broad intelligence gain. Humanity's Last Exam with tools (57.2%) also trails Fable 5.1's 65.0% by a wide margin — a figure the launch announcement conspicuously avoids highlighting.

Pricing holds at $10/$50 per 1M tokens, identical to Claude Fable 5.1, but cache reads cost 4x more ($1.00 vs. $0.25). For agentic workloads that lean heavily on prompt caching across many turns, Fable 5.1's real-world cost may end up lower.

The biggest talking point is cybersecurity: Astra is the first model OpenAI itself has rated "Critical," meaning that with the right tools and access it can discover previously unknown vulnerabilities and develop exploits without a person guiding each step. That's also why OpenAI says it delayed parts of the model's development and release to strengthen safeguards first.

## Implications for Agent Development

The "47% less time on the same task" result on OSWorld 2.0 is the most directly actionable signal for agent builders — if you're building computer-use agents that run many turns and are latency-sensitive (form filling, CRM updates, cross-app research synthesis): Astra is both faster and at least as accurate, making it a reasonable drop-in replacement as your underlying executor.

If you're building agents meant to run autonomously for long stretches and you're worried about a model overstepping its authorized scope: OpenAI built a new evaluation specifically informed by the Hugging Face incident, testing whether a model facing a difficult or impossible task goes beyond what it was asked to do. Astra scored 0% on that test, compared with GPT-5.6 Sol's 48% without production safeguards — a meaningful risk-reduction signal for teams that need to authorize a model to act autonomously on production systems.

Not a fit: applications that need neutral, cross-vendor "general intelligence" rather than OpenAI's specific focus areas — the neutral benchmark shows Astra merely tying its predecessor, and if your workload leans on general reasoning and knowledge breadth rather than math, computer use, or cybersecurity specifically, Claude Fable 5.1 still leads on the Intelligence Index and Humanity's Last Exam. Also not ideal for cache-cost-sensitive, high-turn agentic applications that replay long context repeatedly — Fable 5.1's cache pricing is more favorable there.

## Today's Takeaway

I used to take a vendor's own benchmark table at face value when reading launch announcements, but Astra's gap is unusually stark: the officially highlighted ARC-AGI-3 score (99.9%) and the independently rerun standardized-harness score (62.7%) differ by nearly 40 percentage points. That's a reminder to check whose harness and whose methodology produced a number before trusting it — especially when a vendor publicly declares a qualitative conclusion like "the AGI era," which makes cross-checking against neutral third-party aggregates even more necessary.

## References

- [OpenAI: GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)
- [OpenAI: Safety overview: GPT-6 Astra](https://openai.com/index/safety-overview-gpt-6-astra/)
- [OpenAI: Path to Astra: critical capabilities and frontier safeguards](https://openai.com/index/path-to-astra/)
- [OpenAI API Docs: GPT-6 Astra Model](https://developers.openai.com/api/docs/models/gpt-6-astra)
- [Artificial Analysis: Benchmarking GPT-6 Astra](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)
- [the-decoder: Benchmarks disagree on GPT-6 Astra, but its human-beating efficiency on ARC-AGI-3 pulls Chollet's AGI forecast forward](https://the-decoder.com/benchmarks-disagree-on-gpt-6-astra-but-its-human-beating-efficiency-on-arc-agi-3-pulls-chollets-agi-forecast-forward/)
- [emergent.sh: GPT-6 Astra Benchmarks: What the Numbers Actually Show](https://emergent.sh/learn/gpt-6-astra-benchmarks)
