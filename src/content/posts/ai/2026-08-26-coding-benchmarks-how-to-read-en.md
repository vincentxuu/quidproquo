---
title: "How to Read 2026 Coding Benchmarks: SWE-bench, Terminal-Bench, DeepSWE, Aider Explained"
date: 2026-08-26
category: ai
type: deep-dive
tags: [benchmark, agentic-coding, code-model, llm-evaluation, open-source]
lang: en
tldr: "The same model can score 20 points apart on different harnesses, 32% of SWE-bench Pro verifier judgments were found to be wrong, and DeepSWE's 113 tasks make most models score zero. This guide decodes six major coding benchmarks — what they test, which are easy to game, and which ones you should care about."
description: "A 2026 decoder guide for six major coding benchmarks: SWE-bench Verified/Pro, Terminal-Bench 2.1, DeepSWE, Aider Polyglot, LiveCodeBench, and HumanEval — covering harness differences, gaming techniques, and practical selection advice."
draft: false
glossary:
  - term: "Harness"
    def: "The external framework that runs a benchmark — the same model paired with different harnesses (e.g., Terminus-2 vs Claude Code) can produce different scores because the harness controls how the model interacts with the environment"
  - term: "Pass@1"
    def: "The percentage of problems solved correctly on the first attempt with no retries — stricter than Pass@5 or Best-of-N"
---

> 🌏 [中文版](/posts/ai/2026-08-26-coding-benchmarks-how-to-read)

Every new model launch comes with a wall of numbers: SWE-bench 86%, Terminal-Bench 68.5%, DeepSWE 56. But what do these numbers actually mean? Why does the same model get different scores in different reports? Which benchmarks are easy to game? This guide is for anyone who wants to read model announcements without wading through papers.

## SWE-bench: The Most Cited Coding Benchmark

[SWE-bench](https://www.swebench.com/) is the most widely cited coding benchmark. It tests models on real GitHub issues: given an issue description and a code repository, the model must write a patch that passes the tests.

### Three Versions, Very Different

**Original SWE-bench** (2023): 2,294 tasks from 12 Python repos. Many tasks had vague issue descriptions or incomplete test cases.

**SWE-bench Verified** (2024): OpenAI funded 93 professional engineers to manually review and curate 500 high-quality tasks. Per [CodingFleet's analysis](https://codingfleet.com/blog/swe-bench-pro-explained-the-new-standard-for-ai-coding-benchmarks-2026), OpenAI themselves publicly abandoned Verified in February 2026 — 500 tasks was too few for statistical power, and it only covered Python. Yet it remains the most cited version because it has the most historical scores.

**SWE-bench Pro** (2025): Built by Scale AI — 1,865 tasks across 41 repos and 123 languages. A ground-up redesign that reflects polyglot reality. Per the same analysis, a [DeepSWE audit](https://deepswe.datacurve.ai/) found 32% of Pro's verifier judgments were wrong — a number that illustrates how hard it is to build a correct benchmark.

### What to Watch For

- **Verified is nearly saturated**: top models cluster at 80–86%, differences fall within confidence intervals
- **Pro is the future**: multilingual, larger task pool, but less historical data for comparison
- **Harness matters**: the model only provides reasoning; an agent harness (e.g., mini-SWE-agent) handles file operations and command execution. Different harnesses produce different scores

## Terminal-Bench 2.1: Testing Agents in the Terminal

[Terminal-Bench](https://www.tbench.ai/) tests a model's ability to operate as a terminal agent — not just writing code, but system administration, data processing, and environment configuration.

Per the [Terminal-Bench 2.1 announcement](https://www.tbench.ai/news/terminal-bench-2-1), version 2.1 fixed 28 of 89 tasks from 2.0 (external dependency drift, insufficient resource budgets, misspecified instructions). After the fix, Claude Code + Opus 4.6 jumped 12.1%.

### Harness-Dependent Score Differences

This is the easiest source of misreadings. Take [Ornith 1.5-35B](/en/posts/ai/2026-08-26-ornith-deepreinforce-model-family-en) as an example:

| Harness | Terminal-Bench 2.1 Score |
|---|---|
| Terminus-2 | 67.8 |
| Claude Code harness | 68.5 |

A 0.7 gap is small, but some models differ by 10–20 points across harnesses. When reading Terminal-Bench scores, always check which harness was used. [Artificial Analysis](https://artificialanalysis.ai/evaluations/terminalbench-v2-1) standardizes on Terminus 2 with 3 runs averaged.

## DeepSWE: The Hardest Benchmark — Most Models Score Zero

[DeepSWE](https://deepswe.datacurve.ai/), released by Datacurve in May 2026, is a "long-horizon software engineering" benchmark. 113 tasks across 91 repos and 5 languages, every task written from scratch rather than adapted from existing commits.

Key differences from SWE-bench:

- **Contamination-free**: all tasks are original — no model could have seen solutions during pretraining
- **Genuinely hard**: prompts are ~half the length of SWE-bench Pro's, yet solutions require 5.5× more code and ~2× more output tokens
- **Behavioral verification**: tests check software behavior rather than implementation details

Per the official DeepSWE leaderboard (2026-08-20), the top score is Claude Opus 5 at 74%. [MiniMax M2.5](/en/posts/ai/2026-08-26-minimax-model-family-en) scores 22%, [Ornith 1.5-35B](/en/posts/ai/2026-08-26-ornith-deepreinforce-model-family-en) also 22% — while same-class models Qwen3.6-35B and Gemma 4-31B score zero. DeepSWE's discrimination power far exceeds saturated benchmarks.

## Aider Polyglot: The Most Practical Benchmark

[Aider](https://aider.chat/docs/leaderboards)'s Polyglot benchmark uses 225 Exercism exercises across C++, Go, Java, JavaScript, Python, and Rust, testing coding ability in a pair-programming context.

Aider's unique feature is **cost tracking**. Per the official leaderboard, GPT-5 (high) scores 88% but costs $29.08 per run, while DeepSeek V3.2 scores 70.2% at just $0.88 — a 33× cost difference for 18 points. This enables cost-effectiveness analysis rather than pure score chasing.

### Why Aider Is More "Real-World" Than SWE-bench

SWE-bench tests "here's a bug report, fix it." Aider tests "given existing code, follow instructions to write new features or refactor" — closer to how developers actually work with AI. But Aider's tasks are exercise-level, not real-repo complexity.

## LiveCodeBench: Competitive Programming ≠ Software Engineering

[LiveCodeBench](https://livecodebench.github.io/) uses LeetCode/Codeforces-level competitive programming problems. [Nous Research's NousCoder-14B](/en/posts/ai/2026-08-26-nous-research-hermes-en) scored 67.87% Pass@1 on LiveCodeBench v6.

**Key caveat**: competitive programming and software engineering are different skills. Competitive programming tests algorithm design and edge-case handling; software engineering tests understanding large codebases, cross-file modifications, and test framework interaction. A model strong on LiveCodeBench but weak on SWE-bench is entirely possible.

## HumanEval / MBPP: Legacy Benchmarks Past Their Expiry Date

HumanEval (164 tasks) and MBPP (974 tasks) were the first coding benchmarks. Top models exceed 95% on HumanEval — effectively saturated. They're still cited for one reason only: the longest historical record, useful for cross-era comparison.

**In 2026, don't use HumanEval to judge model quality** — it's like using elementary school math to evaluate PhD candidates.

## Spotting Benchmark Gaming

| Technique | How to Detect |
|---|---|
| **Self-reported scores** | No independent third-party run. Check for verification on [Artificial Analysis](https://artificialanalysis.ai/) or [SWE-bench official](https://www.swebench.com/) |
| **Cherry-picking harness** | Same model on different harnesses, only reporting the highest score. Proper practice: standardize harness or report all |
| **Version cherry-picking** | Reporting SWE-bench Verified but not Pro, or Terminal-Bench 2.0 but not 2.1. Usually because the newer version scores lower |
| **Training set contamination** | Model saw benchmark solutions during pretraining. DeepSWE was created specifically to counter this |
| **Best-of-N** | Running many times and reporting the best instead of Pass@1. Proper benchmarks report Pass@1 with the number of runs averaged |

## Which Benchmark Should You Care About?

| Your Need | Look At | Why |
|---|---|---|
| Evaluating bug-fixing agents | SWE-bench Pro | Largest multilingual real-issue test set |
| Evaluating terminal agent capability | Terminal-Bench 2.1 | Only benchmark specifically for terminal agents |
| Evaluating on the hardest tasks | DeepSWE | Contamination-free, long-horizon, highest discrimination |
| Evaluating pair-programming cost-effectiveness | Aider Polyglot | Only benchmark that tracks cost alongside scores |
| Evaluating algorithmic ability | LiveCodeBench | Most current competitive programming benchmark |
| Cross-era comparison (2023–2026) | HumanEval | Longest historical record, but saturated |

One final piece of advice: **never judge a model by a single benchmark**. A model with high SWE-bench scores but zero on DeepSWE likely saw SWE-bench solutions during training. Cross-referencing multiple benchmarks is the correct approach.

## References

- [SWE-bench Official Leaderboard](https://www.swebench.com/)
- [SWE-bench Pro Explained — CodingFleet](https://codingfleet.com/blog/swe-bench-pro-explained-the-new-standard-for-ai-coding-benchmarks-2026)
- [Terminal-Bench Official Site & Leaderboard](https://www.tbench.ai/)
- [Terminal-Bench 2.1 Announcement](https://www.tbench.ai/news/terminal-bench-2-1)
- [Terminal-Bench Paper — arXiv:2601.11868](https://arxiv.org/abs/2601.11868)
- [DeepSWE Official Leaderboard](https://deepswe.datacurve.ai/)
- [DeepSWE Paper — arXiv:2607.07946](https://arxiv.org/abs/2607.07946)
- [Aider Polyglot Leaderboard](https://aider.chat/docs/leaderboards)
- [Artificial Analysis Terminal-Bench 2.1 Evaluation](https://artificialanalysis.ai/evaluations/terminalbench-v2-1)
- [Ornith Model Family Deep Dive](/en/posts/ai/2026-08-26-ornith-deepreinforce-model-family-en)
- [MiniMax Model Family Deep Dive](/en/posts/ai/2026-08-26-minimax-model-family-en)
- [Nous Research Model Family Deep Dive](/en/posts/ai/2026-08-26-nous-research-hermes-en)
