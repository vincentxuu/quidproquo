---
title: "Model Card: Gemini 4 Neon"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google ships Gemini 4 Neon, slotted between Hydrogen and Carbon — #3 globally on the AA Intelligence Index, but Google's own comparison table only picks lower-scoring Claude Opus 5.5 and GPT-6.2 Sol as rivals"
tldr: "Gemini 4 Neon (API ID `gemini-4-neon`): released 2026-11-18, positioned between Hydrogen and Carbon, 1M-token context window, priced at $3.00 input / $15.00 output / $0.15 cache per 1M tokens; scores 61 on the AA Intelligence Index v5.0.1 — third globally — but Google's comparison table only pits it against Claude Opus 5.5 (59) and GPT-6.2 Sol (57), leaving out the higher-scoring Claude Fable 5.2 (65) and GPT-6.2 Astra (62); its AA-Omniscience hallucination rate (13.9–14.4%) is actually higher than its own family — Carbon (11.4%), Hydrogen (8.5%), Argon (4.3%)"
series:
  name: "AI Model Tracker"
  order: 77
glossary:
  - term: "Gemini"
    def: "Google DeepMind's large language model family; Neon is the Gemini 4.x branch positioned between Hydrogen and Carbon"
---

> 🌏 [中文版](/posts/daily/2026-11-20-model-google-gemini-4-neon)

## Model Info

| Item | Value |
|---|---|
| Model ID | `gemini-4-neon` (confirmed via the official Google AI Studio link; the Gemini API pricing page had no standalone entry as of publication) |
| Vendor | Google DeepMind |
| Parameters | Undisclosed |
| Context Window | 1,000,000 tokens (official figure); third parties (DataCamp, MindStudio) measured an output cap of roughly 64,000 tokens per response, which Google has not confirmed separately |
| Input Price (USD/1M tokens) | $3.00 (cache-hit input $0.15, a stated 95% discount) |
| Output Price (USD/1M tokens) | $15.00 |
| Open Source | No (closed, proprietary to Google) |
| Release Date | 2026-11-18 |
| Official Announcement | [Google Blog: Introducing Gemini 4 Neon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/) |
| HuggingFace | Not applicable (closed model) |
| Family | Gemini 4.x (the fourth branch shipped within a month, after Argon, Carbon and Hydrogen; positioned between Hydrogen — fast, everyday — and Carbon — flagship, long-horizon) |

## Key Capabilities

- Scores 61 on the Artificial Analysis Intelligence Index v5.0.1 at its xhigh thinking level, third globally — but Google's own comparison table only measures it against Claude Opus 5.5 (59) and GPT-6.2 Sol (57); the independent leaderboard also shows Claude Fable 5.2 (65) and GPT-6.2 Astra (62) ahead of Neon, and neither makes Google's table
- Ranks #2 globally on the Vals Index (70.9%) and takes the top spot on both the Legal Research Bench and Tax Agent Bench; ranks #1 on Zapier's AutomationBench at the XHigh level (56.32%) at $1.69 per run, undercutting its own family's Carbon at High (53.88% / $2.12)
- Ranks #1 globally on the Artificial Analysis Coding Agent Index (58.6) and scores 65.2% on Terminal-Bench 4.1; on the third-party KingBench 4 six-project coding benchmark (out of 60), it scores 37.9 (63.2%) for second place, ahead of Claude Opus 5.5 (34.7), GPT-6.2 Astra (33.9) and GPT-6.1 Sol (33.0), trailing only Claude Fable 5.2 (42)
- Advances on three security benchmarks at once: state-of-the-art 76% on AutoBaxBench's hard tier, state-of-the-art 51.26% on WebExploitBench at half the cost of competitors, and 90.5% on SEC-bench Pro (vulnerability discovery)

## Benchmark Results

| Benchmark | Gemini 4 Neon | Same-Generation Comparison | Best Competitor |
|---|---|---|---|
| AA Intelligence Index v5.0.1 | 61 (xhigh) | Carbon 60 (high, same-generation flagship) | Claude Fable 5.2 — 65 |
| Zapier AutomationBench (XHigh, cost per run) | 56.32% / $1.69 | Carbon High — 53.88% / $2.12 | GPT-6.2 Astra Max — 52.36% / $0.83 |
| KingBench 4 (third-party six-project coding benchmark, out of 60) | 37.9 (63.2%) | Google states it beats Argon/Carbon but gives no specific score | Claude Fable 5.2 — 42 (1st); Claude Opus 5.5 — 34.7 |
| AA-Omniscience v1.1 hallucination rate (lower is better) | 13.9–14.4% | Carbon 11.4% / Hydrogen 8.5% / Argon 4.3% | Claude Opus 5.5 — 50.3% / GPT-6.2 Sol — 55.4% |

⚠️ The AA Intelligence Index, Vals Index, and AA-Omniscience figures are independently measured by Artificial Analysis / Vals AI; AutomationBench is independently measured by Zapier; KingBench 4 is a third-party benchmark built by MindStudio, not an official Google number. Google's own comparison table picks Claude Opus 5.5 and GPT-6.2 Sol as rivals — not the highest-scoring models on the market.

## Comparison with Predecessor/Competitors

Neon isn't a direct successor to any single model — it's the fourth branch Google wedged in after shipping Argon, Carbon and Hydrogen within a month, sitting between Hydrogen (fast, cheap, everyday) and Carbon (strongest, most expensive, long-horizon work). Google's own framing is that it "balances depth and efficiency." Against same-generation flagship Carbon, Neon ties on the AA Intelligence Index at the High tier (60 points each) but at 32% lower cost, and beats competing frontier models by 36%+ at the xhigh tier. This model is selling cost-efficiency, not a higher intelligence ceiling.

Against competitors, the issue is who Google's own comparison table picks as rivals: it only measures against Claude Opus 5.5 and GPT-6.2 Sol, winning 16 of 19 listed benchmarks — but on Artificial Analysis's public leaderboard, Claude Fable 5.2 (65) and GPT-6.2 Astra (62) both rank above Neon (61). Those are the real flagship-tier rivals, and Google's table picks the weaker pair instead. On pricing, Neon ($3 input / $15 output) costs 50% more than GPT-6.2 Sol ($2/$10), but only 37.5% of GPT-6.2 Astra's price ($8/$40) — so sitting in the middle is a deliberate product choice.

One notable regression: Neon's AA-Omniscience hallucination rate is 13.9–14.4%, higher than its own family's Carbon (11.4%), Hydrogen (8.5%), and the earlier Argon (4.3%) — though still far below Claude Opus 5.5 (50.3%) and GPT-6.2 Sol (55.4%). Chasing speed and cost efficiency came at the expense of factual accuracy here, not a steady improvement across the board.

## Implications for Agent Development

Google explicitly positions Neon as an "orchestrator" in multi-agent architectures: inside Google Antigravity, Neon can run standalone, or act as a fast, high-judgment orchestrator directing parallel Hydrogen subagents. That's Google pushing a tiered agent pattern — expensive model makes the decisions, cheap model does the execution — rather than one model handling everything.

- If you're building enterprise knowledge-work agents (mixed spreadsheet, PDF, chart, audio and video input): Neon's 1M-token context window plus its double win on Legal Research and Tax Agent benches makes it a reasonable fit for cross-document analysis and structured output
- If you're building a multi-agent orchestration setup: Google's own layered pattern is worth copying — Neon for judgment, Hydrogen for parallel execution — rather than routing every subtask to the same expensive model
- Not a fit: scenarios that can't tolerate hallucination — Neon's 13.9–14.4% rate is the highest in its own family; also not ideal for pure coding-ceiling work, since it loses to Claude Opus 5.5 on both Terminal-Bench 4.1 and FrontierCode 2.0

## Today's Takeaway

Google's "wins 16 of 19" comparison table picks Claude Opus 5.5 and GPT-6.2 Sol as rivals — neither is the strongest model on the current leaderboard. The independent Artificial Analysis Intelligence Index ranks Neon third globally, behind Claude Fable 5.2 and GPT-6.2 Astra — the actual competitors Neon has to answer to, and the ones missing from the official comparison table. The first move with any vendor's "we beat X" chart is always to check who it left out.

## References

- [Google Blog: Introducing Gemini 4 Neon (official announcement, 2026-11-18)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Artificial Analysis Evaluates Gemini 4 Neon as a Fast, Cost-Competitive Mid-Tier Contender (OODAloop, citing Artificial Analysis test results)](https://oodaloop.com/briefs/technology/artificial-analysis-evaluates-gemini-4-neon-as-a-fast-cost-competitive-mid-tier-contender-across-reasoning-and-multimodal-benchmarks/)
- [Gemini 4 Neon benchmarks, specs, pricing and comparisons (kingy.ai, compiling AutomationBench and other third-party figures)](https://kingy.ai/blog/gemini-4-neon/)
- [Gemini 4 Neon vs Claude Opus 5.5 vs GPT-6.2: Coding Compared (MindStudio, KingBench 4 benchmark)](https://www.mindstudio.ai/blog/gemini-4-neon-vs-claude-opus-gpt-6-2)
- [Gemini 4 Neon vs Carbon, Claude Opus 5.5 and GPT-6.2 Sol (ahmetbalaman.com, AA-Omniscience hallucination-rate comparison)](https://ahmetbalaman.com/en/blog/gemini-4-neon-vs-carbon-vs-claude-opus-5-5-vs-gpt-6-2-sol-en/)
- [Gemini 4 Neon Beats Claude Opus 5.5, GPT 6.2 Sol On Most Benchmarks (officechai, detail on the official 16/19 comparison table)](https://officechai.com/ai/gemini-4-neon-benchmarks/)
