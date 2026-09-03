---
title: "Model Card｜Gemini 3.8 Flash"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google ships its third Flash model in six weeks — Gemini 3.8 Flash keeps the same price, jumps to 90.8% on Terminal-Bench 2.1, and ships alongside a cybersecurity variant gated to trusted defenders"
tldr: "Gemini 3.8 Flash (gemini-3.8-flash): launched 2026-09-02, 1,048,576 input tokens / 64,000 output tokens, $0.75 input / $3.75 output per 1M tokens (introductory rate through 2026-12-31, then $1.50/$7.50); Terminal-Bench 2.1 90.8% (up from 81.6%), DeepSWE v1.1 73.7% (up from 65.3%); ships alongside Gemini 3.8 Flash Cyber, a security variant gated behind the Fairwind Program, scoring 47.2% pass@1 on CWE-Bench and exceeding 70% on a real-world 20-language vulnerability-discovery benchmark"
series:
  name: "AI Model Tracker"
  order: 14
glossary:
  - term: "Gemini"
    def: "Google DeepMind's large language model family; Flash is the branch optimized for speed and cost efficiency"
---

> 🌏 [中文版](/posts/daily/2026-09-04-model-google-gemini-3-8-flash)

## Model Information

| Field | Value |
|---|---|
| Model ID | `gemini-3.8-flash` |
| Vendor | Google (Google DeepMind) |
| Parameters | Undisclosed |
| Context Window | 1,048,576 tokens (input) / 64,000 tokens (output) |
| Input pricing (USD/1M tokens) | $0.75 (introductory rate through 2026-12-31; reverts to $1.50 after) |
| Output pricing (USD/1M tokens) | $3.75 (introductory rate through 2026-12-31; reverts to $7.50 after) |
| Open source | No |
| Release date | 2026-09-02 |
| Official announcement | [Google Blog: Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) |
| Family | Gemini 3.x Flash (Google's third Flash release in six weeks, following 3.6 and 3.7 Flash) |

## Highlights

- Terminal-Bench 2.1 (agentic terminal operation) reaches 90.8%, up 9.2 points from predecessor Gemini 3.7 Flash's 81.6%
- DeepSWE v1.1 (long-horizon software engineering) reaches 73.7%, up 8.4 points from 65.3%; Google says it now outperforms several larger frontier models
- New tunable effort levels let the same model dial between high effort (more reasoning steps, iterative tool calls, higher accuracy) and low effort (lower token overhead) per task, instead of requiring a different model
- Ships alongside Gemini 3.8 Flash Cyber, a security variant gated to trusted defenders via the Fairwind Program: 47.2% pass@1 on CWE-Bench patching, and above 70% success on a real-world vulnerability-discovery benchmark spanning 20 programming languages
- Pricing holds at $0.75/$3.75 for a third consecutive Flash generation (3.6, 3.7, 3.8) — effectively a stealth price cut given the capability gains

## Benchmark Results

| Benchmark | Gemini 3.8 Flash | Predecessor (3.7 Flash) | Strongest competitor |
|---|---|---|---|
| Terminal-Bench 2.1 (agentic terminal ops) | 90.8% | 81.6% | GPT-5.6 Terra 87.4% |
| DeepSWE v1.1 (long-horizon SWE) | 73.7% | 65.3% | GPT-5.6 Terra 69.6% |
| SWE-Bench Pro | 61.6% | 60.4% | — |
| HLE-Verified (cross-domain expert reasoning) | 54.9% | 53.6% | GPT-5.6 Terra 51.1% |
| Humanity's Last Exam | 45.4% | 45.7% | — |
| CWE-Bench (Cyber variant, patching pass@1) | 47.2% | — (predecessor Cyber model was 3.5 Flash Cyber; no comparable figure published) | Leading frontier model 47.8% |

⚠️ All figures above are Google's own internal evaluation results (some benchmarked against other vendors' models), not third-party reproductions. CWE-Bench is an external benchmark run by Collinear; the other Cyber-related figures (CyberGym, the 20-language real-world vulnerability benchmark) are currently Google self-reported only and await independent verification. This site's earlier Gemini 3.7 Flash model card recorded a Terminal-Bench 2.1 score of 85.8%, which differs from the 81.6% shown in Google's own comparison table at the 3.8 Flash launch — likely a change in evaluation methodology or agent harness version (DeepMind disclosed that Terminal-Bench 2.1 results are now uniformly measured with the Terminus 2 harness). This article uses the figures from Google's official comparison table published at the 3.8 Flash launch.

## Comparison with Predecessor/Competitors

Against Gemini 3.7 Flash, the gains concentrate in agentic coding and long-horizon software engineering: Terminal-Bench 2.1 opens up a 9.2-point gap and DeepSWE v1.1 an 8.4-point gap, while Humanity's Last Exam is essentially flat (45.4% vs 45.7%) and SWE-Bench Pro barely moves (61.6% vs 60.4%). That means the 3.8 Flash upgrade is targeted at tasks requiring repeated tool calls and multi-step follow-through, not a general lift in reasoning ability — if your workload is open-ended reasoning or exam-style tasks, upgrading may not pay off.

Against competitors, the 90.8% on Terminal-Bench 2.1 beats GPT-5.6 Terra's 87.4% and Claude Sonnet 5's 80.4%; DeepSWE v1.1's 73.7% also beats GPT-5.6 Terra's 69.6%. But most of these comparison figures were recorded at the 3.7 Flash launch, so if rival models have since been updated, the actual gap may already be smaller — treat these as directional rather than a precise leaderboard.

The most notable pricing move is three consecutive generations without a price increase: 3.6, 3.7, and 3.8 Flash all hold at $0.75/$3.75 (introductory rate through 2026-12-31), which undercuts GPT-5.6 Sol's roughly $5/$30 and Claude Fable 5.1's $10/$50 by over 85% on input price. Rather than following the "new model means higher price" convention, Google shifted the cost of the upgrade onto the effort-levels knob — the more effort you dial up, the more tokens you burn — leaving it to developers to decide whether the extra accuracy is worth paying for.

## Implications for Agent Development

Effort levels are the most direct architectural change here: instead of choosing between a cheap-but-mediocre model and an expensive-but-smart one, the same model ID now adjusts per task — dial effort up for high-stakes, multi-step work, dial it down for latency-sensitive, high-throughput work, without maintaining two separate model-switching code paths.

- If you're building a coding or SWE agent: Terminal-Bench 2.1 at 90.8% plus DeepSWE v1.1 at 73.7% means you can run long-horizon code automation at near-predecessor-frontier quality at Flash pricing ($0.75/$3.75), and with three Flash generations holding the same price, you can lock in your cost model early in the agent's architecture
- If you're building a finance or legal knowledge-work agent: Google reports gains over 3.7 Flash and some frontier models on Vals Finance Agent V2 and Harvey's Legal Agent Benchmark, suiting contract review and financial-report analysis workflows that need dependable multi-step reasoning
- If you're building code security tooling (vulnerability discovery plus automated patching): 3.8 Flash Cyber collapses "find the bug, then write the fix" into a single model call, but access currently runs only through case-by-case approval in the Fairwind Program, not a self-serve API — near-term this fits only organizations with an existing security team that can clear the vetting process
- Not a fit: open-ended knowledge reasoning or exam-style tasks (Humanity's Last Exam barely moved), where staying on 3.7 Flash or a larger model makes more sense than spending extra tokens to chase the new release; also not a fit for on-premises deployment or workloads that can't tolerate a closed-weights API dependency

## Today's Insight

I'd assumed the only lever vendors have for passing along the cost of a model upgrade is raising the per-token price. Gemini 3.8 Flash shows a different approach: hold the sticker price flat across three generations, and route the cost of the upgrade through the effort-levels knob instead — how much extra token spend you're willing to burn for higher accuracy becomes the user's choice, not the vendor's. That also explains the seemingly contradictory pattern in this release — most benchmarks improve markedly while a token-usage warning ships in the same announcement: performance gains and cost increases have been split into two independently adjustable dials.

## References

- [Google Blog: Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
- [Gemini 3.8 Flash — Model Card (Google DeepMind)](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
- [Gemini API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [DataCamp: Gemini 3.8 Flash — Features, Benchmarks, and Pricing](https://www.datacamp.com/blog/gemini-3-8-flash-cyber)
- [Shattered.io: Gemini 3.8 Flash Cyber — Google Gates Access, 2.6x Patches](https://shattered.io/gemini-3-8-flash-cyber-fairwind-program-2026/)
- [This site's earlier post: Model Card｜Gemini 3.7 Flash](/en/posts/daily/2026-08-16-model-google-gemini-3-7-flash-en)
