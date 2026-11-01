---
title: "Model Card | GPT-6 Rosalind"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI ships GPT-6 Rosalind on the exact same weights as GPT-6 Astra — the only changes are a looser biosafety refusal boundary and a trusted-access gate, priced at 1.5x Astra"
tldr: "GPT-6 Rosalind (API ID: `gpt-6-rosalind`): OpenAI published a system card addendum on 2026-10-30, with the model landing on the official pricing page on 2026-11-01. It runs on identical weights to GPT-6 Astra — no new training data, no extra post-training. The only differences are a relaxed biosafety refusal boundary and a trusted-access gate. Pricing is $15.00 input / $75.00 output per 1M tokens (cached input $1.50; $30/$112.50 above 272K input tokens) — 1.5x Astra's $10/$50. MedChemBench v7 scores 49.6%, GeneBench Pro v13 37.7%, and LifeSciBench Gold 61.3%, all more than double GPT-Rosalind-5.5's numbers. But on the sensitive-biosecurity safety grader it only passes 79.0% of the time, well below Astra's 99.8% — the extra correct answers come from answering more, not from being smarter."
series:
  name: "AI Model Tracker"
  order: 65
glossary:
  - term: "GPT-Rosalind"
    def: "OpenAI's restricted-access model series for biology, drug discovery, and translational medicine; the current release shares weights with the matching generation's flagship model"
  - term: "Trusted Access"
    def: "OpenAI's gated access process for high-risk-capability models: applicants must pass a mission review, governance check, and access-control audit before getting the model"
---

> 🌏 [中文版](/posts/daily/2026-11-01-model-openai-gpt-6-rosalind)

## Model Info

| Item | Value |
|---|---|
| Model ID | `gpt-6-rosalind` (commercial name: GPT-Rosalind-6 Research) |
| Vendor | OpenAI |
| Parameters | Undisclosed (shares weights with GPT-6 Astra) |
| Context Window | Not published on a standalone page; since the weights match GPT-6 Astra, presumed to be the same 1,050,000 tokens |
| Input Pricing (USD/1M tokens) | $15.00 (cached input $1.50; $30.00 above 272K input tokens) |
| Output Pricing (USD/1M tokens) | $75.00 ($112.50 above 272K input tokens) |
| Open Source | No (trusted-access only; not available in general ChatGPT) |
| Release Date | 2026-10-30 (system card addendum) / 2026-11-01 (pricing page went live) |
| Official Announcement | [OpenAI: GPT-Rosalind-6 System Card Addendum](https://deploymentsafety.openai.com/gpt-rosalind-6) |
| Family | GPT-Rosalind life sciences series (predecessor GPT-Rosalind-5.5 was built on GPT-5.5; this release is built on GPT-6 Astra) |

## Highlights

- Uses **exactly the same weights** as GPT-6 Astra. OpenAI states plainly that it "did not add training data or perform additional post-training for this release" — this launch changes safety tuning and the access gate, not model capability
- All three published life-sciences benchmarks more than doubled versus predecessor GPT-Rosalind-5.5: MedChemBench v7 (medicinal chemistry) 28.9% → 49.6%, GeneBench Pro v13 (quantitative biology) 16.7% → 37.7%, LifeSciBench Gold (life sciences research) 44.0% → 61.3%
- On the biosecurity compliance suite, it fully answers "benign biology" questions 100% of the time (Astra: 91.6%) — but that gain comes mostly from refusing less, not from answering more correctly
- Ships alongside Rosalind Workbench, a research workspace inside Codex/ChatGPT with built-in next-generation sequencing workflows: FASTQ quality control, bulk RNA-seq, and single-cell RNA-seq

## Benchmark Results

| Benchmark | GPT-6 Rosalind | Predecessor (GPT-Rosalind-5.5) | Reference (GPT-6 Astra, same weights) |
|---|---|---|---|
| MedChemBench v7 (99 problems, highest reasoning budget) | 49.6% | 28.9% | Not published (not a series Astra was tested on) |
| GeneBench Pro v13 (129 problems, highest reasoning budget) | 37.7% | 16.7% | Not published (not a series Astra was tested on) |
| LifeSciBench Gold (94 problems, highest reasoning budget) | 61.3% | 44.0% | Not published (not a series Astra was tested on) |
| Biorisk knowledge test (unadjusted) | 78.3% | 79.2% | 63.3% |
| Biorisk knowledge test (refusal-adjusted) | 85.0% (refusal rate 9.4%) | Not published | 90.0% (refusal rate 29.2%) |
| Sensitive-biosecurity safety grader pass rate | 79.0% | Not published | 99.8% |

⚠️ All figures are OpenAI's own self-reported results from the system card addendum; none have been independently reproduced. GeneBench Pro used "a benchmark-specific configuration that differs from production." The refusal-adjusted biorisk score treats a refusal as if it were a correct answer, to estimate the true capability that safety training may be hiding — it's a risk-assessment tool, not a general capability ranking.

## Versus Predecessor / Competitors

Compared with GPT-Rosalind-5.5, the more-than-doubled scores on all three life-sciences benchmarks come mainly from the underlying model moving from GPT-5.5 to GPT-6 Astra, not from anything new in this release itself — in other words, this card is really quantifying how much stronger GPT-6 Astra is than GPT-5.5, repackaged as progress in the life-sciences series.

Compared with Astra on the same weights, Rosalind leads on the unadjusted biorisk knowledge test (78.3% vs 63.3%) — but mainly because its refusal rate is only 9.4% against Astra's 29.2%. Once refusals are treated as "the model knew the answer but chose not to give it" and scores are re-estimated, the ranking flips: the addendum reports Rosalind at 85.0% and Astra at 90.0%, meaning Astra's adjusted capability is actually higher. i-SCOOP's read is blunt: the apparent advantage "comes from answering more often, not from answering better." On the sensitive-biosecurity safety grader, Rosalind only passes 79.0% of the time — 20.8 points below Astra — trading more answered questions for a higher misclassification risk.

The pricing strategy is the part worth remembering. OpenAI has started tiering the price of **the same weights** by safety configuration and access program: general-access `gpt-6-astra` runs $10/$50, trusted-access `gpt-6-rosalind` with a looser refusal boundary runs $15/$75 (1.5x), and the pricing page also lists a cheaper `gpt-rosalind-research` at $5/$25 that OpenAI hasn't clearly mapped to a specific version. Run the numbers on a research-agent task of 200K input tokens and 20K output tokens: `gpt-rosalind-research` costs $1.50, Astra costs $3.00, and Rosalind 6 costs $4.50 — at 10,000 runs a month that's $15,000 versus $30,000 versus $45,000. Anthropic entering the same market with Claude Science suggests "charging a premium for a lower refusal rate" could become a standard pricing pattern for life-sciences AI in the second half of 2026.

## What This Means for Agent Development

The most direct impact on agent architecture is that "human review" has moved from a soft recommendation to a contractual obligation: the system card addendum explicitly requires customers to "apply qualified human review before model outputs inform experiments, publications, or consequential decisions." If you're building a research agent that proposes compounds or queues experiments automatically, your closed-loop design **must** include a named review checkpoint with a retained record — you can't just let the model decide on its own. OpenAI doesn't define what counts as "qualified" review or what a reviewer must sign off on, so that part is on you to spec out.

- If you already have trusted-access approval and the governance/access-control infrastructure to go with it (say, a GxP-validated environment) at a life-sciences research organization: Rosalind is worth evaluating. Astra still refuses or caveats roughly 8% of benign biology prompts, which is a real interruption risk for an agent pipeline meant to run unattended — Rosalind pushes that close to zero
- If your agent reads external or untrusted content (pulling from literature databases, collaboration messages, and the like): note that one metric in the addendum got notably worse — "unintended engagement with external agent messages" rose from 0.0% on Astra to 2.5% on Rosalind. That's the direct cost of loosening the refusal boundary, and it's a real security regression for any tool-using agent that consumes external input
- Not a fit: teams that haven't received trusted-access approval yet (you can't even apply the model without it); customer-facing products or CRO-for-hire offerings (the addendum explicitly restricts use to "approved internal research"); teams without a revocation plan or fallback model — OpenAI reserves the right to pull access at any time for "misuse" but gives no stated triggers or notice period, so a pipeline with a single point of failure on this model has no safety net

## Today's Takeaway

I used to assume "new version" meant "new training" meant "better capability." OpenAI spells out the opposite here: GPT-6 Rosalind added no new training data or post-training, and nearly all of its benchmark gains trace back to the stronger Astra base underneath it. What this release actually changes — and what it actually charges for — is how the same set of weights behaves under different safety tuning and access programs. Pricing is starting to track *willingness to answer* as much as it tracks capability. For anyone building agents, that means evaluating a model now requires looking at its refusal-rate curve and access tier alongside the benchmark scores — that's often what drives a 50% swing in your bill, not the model getting smarter.

## References

- [OpenAI: GPT-Rosalind-6 System Card Addendum](https://deploymentsafety.openai.com/gpt-rosalind-6)
- [OpenAI: Introducing GPT-Rosalind for life sciences research](https://openai.com/index/introducing-gpt-rosalind)
- [OpenAI: Introducing new capabilities to GPT-Rosalind](https://openai.com/index/introducing-new-capabilities-to-gpt-rosalind)
- [OpenAI Help Center: GPT-Rosalind for life sciences research](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research)
- [OpenAI: API Pricing](https://developers.openai.com/api/docs/pricing)
- [i-scoop: GPT-6 Rosalind shows OpenAI now sells access, not just models](https://www.i-scoop.eu/gpt-6-rosalind-trusted-access/)
- [beri.net: OpenAI Launches GPT-6 Rosalind at $15/$75 per Million Tokens](https://www.beri.net/article/gpt-6-rosalind-research-astra-weights-trusted-access-refusals-medchembench-pricing-life-sciences)
- [OpenAI: GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) (comparison baseline, released 2026-09-03)
