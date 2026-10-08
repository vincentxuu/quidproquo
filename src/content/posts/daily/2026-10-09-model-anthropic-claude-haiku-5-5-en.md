---
title: "Model Card: Claude Haiku 5.5"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: en
description: "Anthropic ships Claude Haiku 5.5 — its first small model with adjustable effort, averaging 75% cheaper than Haiku 4.5 while OSWorld 2.1 jumps from 15.7% to 72.4%"
tldr: "Claude Haiku 5.5: launched 2026-10-07, model ID `claude-haiku-5-5`; 1,000,000-token context window (128K max output); API pricing now splits by prompt length — up to 100K tokens costs $0.10 input / $0.50 output, over 100K costs $0.50 input / $2.50 output (prior Haiku 4.5 had one flat rate of $1.00/$5.00), averaging about 75% cheaper; OSWorld 2.1 (computer use) jumps from Haiku 4.5's 15.7% to 72.4%, and Terminal-Bench 4.0 goes from 0.0% to 39.2%, already ahead of Anthropic's own GPT-6 Luna comparison score of 16.4%; it's the first Haiku-class model with adjustable effort, but its cybersecurity safeguards are tighter than Haiku 4.5's, blocking penetration-testing-style operations"
series:
  name: "AI Model Tracker"
  order: 43
glossary:
  - term: "Claude"
    def: "Anthropic's large language model family; Haiku is the branch optimized for speed and low cost"
  - term: "OSWorld"
    def: "A benchmark that measures an AI agent's ability to operate a real computer across multi-step tasks (opening apps, clicking, filling forms); commonly used to gauge computer-use capability"
---

> 🌏 [中文版](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5)

## Model Details

| Field | Value |
|---|---|
| Model ID | `claude-haiku-5-5` |
| Vendor | Anthropic |
| Parameters | Undisclosed |
| Context Window | 1,000,000 tokens (128,000-token max output) |
| Input Pricing (USD/1M tokens) | $0.10 (prompts ≤100K) / $0.50 (prompts >100K) |
| Output Pricing (USD/1M tokens) | $0.50 (prompts ≤100K) / $2.50 (prompts >100K) |
| Open Source | No |
| Release Date | 2026-10-07 |
| Official Announcement | [Anthropic: Introducing Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5) |
| Family | Claude 5.5 (Opus 5.5 on 09/22, Sonnet 5.5 on 09/28, Haiku 5.5 on 10/07) |

## Highlights

- Computer use: OSWorld 2.1 (offline subset) jumps from Haiku 4.5's 15.7% to 72.4%, a 56.7-point gain, and for the first time beats Anthropic's own GPT-6 Luna comparison score (48.9%)
- Agentic coding: Terminal-Bench 4.0 goes from Haiku 4.5's 0.0% (essentially unable to complete tasks) to 39.2%; FrontierCode 1.1 (Main) scores 46.4%, ahead of GPT-6 Luna's 42.4%
- The first Haiku-class model with adjustable effort, letting teams trade cost against intelligence per task instead of using one fixed setting
- Averages about 75% cheaper than Haiku 4.5; for prompts under 100K tokens (which Anthropic says made up roughly 90% of prior Haiku requests), input drops to $0.10 and cache reads to $0.01 (versus $0.10 flat for Haiku 4.5)

## Benchmark Results

| Benchmark | Haiku 5.5 | Prior gen Haiku 4.5 | GPT-6 Luna (Anthropic's comparison) | Sonnet 5.5 (reference) |
|---|---|---|---|---|
| OSWorld 2.1 (computer use, offline subset) | 72.4% | 15.7% | 48.9% | 83.9% |
| Terminal-Bench 4.0 (agentic coding) | 39.2% | 0.0% | 16.4% | 70.6% |
| FrontierCode 1.1 (Main) | 46.4% | Not reported | 42.4% | 52.1% (Xhigh) |
| Humanity's Last Exam (no tools) | 45.9% | 10.2% | Not reported | 56.9% |
| Chartography (visual reasoning, no tools) | 46.4% | 6.4% | 29.1% | 61.6% |

⚠️ All figures above are Anthropic's own self-reported results (see the [Haiku 5.5 System Card](https://www.anthropic.com/claude-haiku-5-5-system-card)); no independent reproduction is available yet. Anthropic's two internal knowledge-work metrics, GDPval-AA v2.1 and AA-Briefcase v1.1, also jumped sharply (1620 and 1578, versus 735 and 614 for Haiku 4.5), but since they aren't standardized external benchmarks they're left out of the table above.

## Comparison with Prior Generation and Competitors

Compared with Haiku 4.5, the biggest gains land exactly where the prior model essentially couldn't compete at all: OSWorld 2.1 goes from 15.7% to 72.4%, and Terminal-Bench 4.0 from 0.0% to 39.2% — pulling Haiku from "only handles simple text tasks" up to "can actually carry real agent subtasks." That tracks with Anthropic's own positioning: Haiku 5.5 is built to be a subagent under Opus or Sonnet, not a standalone model for complex work.

Against GPT-6 Luna, the comparison point Anthropic chose for its own announcement, Haiku 5.5 leads across OSWorld 2.1 (72.4% vs. 48.9%), Terminal-Bench 4.0 (39.2% vs. 16.4%), FrontierCode (46.4% vs. 42.4%), and Chartography (46.4% vs. 29.1%) — signaling this generation of Haiku is aimed at winning the small-model price-to-capability ratio, not just trailing Sonnet or Opus from a distance. Worth noting: these comparison numbers are all compiled by Anthropic itself, and GPT-6 Luna may not be OpenAI's latest model in the same tier.

On pricing, Haiku 5.5 splits what was a single flat rate into two tiers: prompts under 100K tokens get a steep cut (input $1.00 → $0.10, a 90% drop), while prompts over 100K only drop to $0.50 (a 50% cut). Anthropic estimates about 90% of prior requests fell under 100K tokens, so most real-world usage should see close to that 90% discount — the company's own stated average is "about 75% cheaper." At the same time, Sonnet 5.5's cache-read price was also halved ($0.20 → $0.10). Taken together, this week's moves are about tightening the token-saving side of the lineup across the board, not repricing the models themselves.

## Implications for Agent Development

The biggest architectural signal here is that Haiku now has an effort parameter for the first time. Previously the Haiku line only had one fixed thinking intensity; now it can scale compute per task just like Opus and Sonnet — meaning a single model can serve both "fast" and "accurate" subtasks without switching to a pricier model just to get more accuracy.

- **Building multi-agent systems**: Haiku 5.5 is a good fit as a subagent behind Opus/Sonnet planning, handling high-frequency, low-complexity subtasks like compaction, summarization, classification, and database lookups. Asana's early testing reported over a 30% reduction in per-turn latency and inference up to 2.5x faster.
- **Building browser/computer automation**: OSWorld 2.1's jump from 15.7% to 72.4% is the single biggest improvement here, and pairs with a newly released beta browser-use SDK — a good match for repetitive computer-use work like form filling and data entry between apps.
- **Not a fit for**: complex, multi-step agentic coding as the primary driver — Terminal-Bench 4.0 is only 39.2%, far below Sonnet 5.5's 70.6%. Anthropic itself says Opus/Sonnet 5.5 remain the right choice for complex coding; Haiku 5.5 is positioned to unlock volume work that was previously cost-prohibitive, not to replace the main model.

One more thing worth flagging: cybersecurity safeguards got tighter. Haiku 5.5 blocks penetration-testing-style operations, stricter than Haiku 4.5 (though still looser than Sonnet 5.5). If your agent system relies on Haiku for security-related automation such as red-team simulation, this upgrade may require re-checking your access and permissions workflow.

## Today's Takeaway

Small-model upgrades usually get framed as "cheaper and faster," but Haiku 5.5's jump on OSWorld 2.1 (15.7% → 72.4%) and Terminal-Bench 4.0 (0.0% → 39.2%) shows this generation's gains are large enough to change what the model *can do*, not just what it costs. The prior Haiku essentially scored zero on these two benchmarks; this one clears the "actually usable" bar outright — that's more worth remembering than the 75% price cut.

## References

- [Anthropic: Introducing Claude Haiku 5.5 (official announcement)](https://www.anthropic.com/claude-haiku-5-5)
- [Anthropic: Claude Haiku product page and pricing](https://www.anthropic.com/claude/haiku)
- [Anthropic: Claude Haiku 5.5 System Card](https://www.anthropic.com/claude-haiku-5-5-system-card)
- [Claude Platform Docs: Models overview (context window / pricing comparison table)](https://platform.claude.com/docs/en/models/overview)
- [AWS: Introducing Claude Haiku 5.5 on AWS](https://aws.amazon.com/blogs/machine-learning/introducing-claude-haiku-5-5-on-aws)
- [GitHub Changelog: Claude Haiku 5.5 in GitHub Copilot](https://github.blog/changelog/2026-10-07-claude-haiku-5-5-in-github-copilot)
