---
title: "Model Card｜Gemini Decision 1"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google ships Gemini Decision 1 and a new Decisions API — a model that doesn't generate text, scoring up to 1,000 yes/no, choice, and rubric questions in a single forward pass with zero output-token billing and 150-250ms latency"
tldr: "Gemini Decision 1 (gemini-decision-1): 262,144-token context, $0.10 per 1M input tokens, zero output billing, up to 1,000 yes/no/choice/score questions per request. Google's own benchmarks put it ahead of GPT-6 Luna (92.2% vs 90.9% on JevBench), but independent lab Artificial Analysis ranks it 9th of 18 decision models (score 66) and 4th most expensive at $345 per 1M tasks — official and third-party evaluations disagree."
series:
  name: "AI Model Tracker"
  order: 71
glossary:
  - term: "Decision Model"
    def: "A specialized model that scores a fixed set of options with calibrated probabilities instead of generating text, used for yes/no checks, classification/routing, and rubric scoring"
---

> 🌏 [中文版](/posts/daily/2026-11-13-model-google-gemini-decision-1)

## Model Info

| Item | Value |
|---|---|
| Model ID | `gemini-decision-1` |
| Vendor | Google (Google DeepMind) |
| Parameters | Undisclosed |
| Context Window | 262,144 tokens (Google rounds this to "256K"; covers the shared input plus all questions) |
| Input Price (USD/1M tokens) | $0.10 |
| Output Price (USD/1M tokens) | $0.00 (no output tokens are generated, so none are billed) |
| Open Source | No |
| Release Date | 2026-11-11 |
| Official Announcement | [Google Blog: Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) |
| Family | Gemini Decisions API (a new "decision model" category, not an extension of the Gemini 4.x chat family) |

## Capability Highlights

- **Scores options instead of generating text.** One request takes a shared multimodal input (text, image, audio, video, or PDF) plus up to 1,000 independent questions, and the model returns a probability and confidence score (0–1) for each one in a single forward pass. End-to-end latency sits at 150–250ms for contexts up to 16K tokens, holding roughly flat from 1 to 100 questions.
- **Three question types in one request.** Yes/no ("noul", returning a 0.01–0.99 probability), multiple choice ("choice", 2–255 options each with its own probability), and ordered rubric scoring ("score", 2–255 levels with per-level probabilities) — and you can mix all three against the same shared input.
- **Shared input is billed once; output is free.** Whether you ask 1 question or 1,000, the shared input tokens count only once — each extra question adds just its own instructions and criteria. Google claims this makes the model nearly 5x cheaper than running the same evaluation suite as generative Q&A on Gemini 3.5 Flash-Lite.
- **Leads Google's own benchmark suite with 92.2% on JevBench**, ahead of GPT-6 Luna's 90.9% and TypeSafe Jev 1.14's 90.0%, with the lowest calibration error (Top-1 ECE) of the four models compared.

```diagram
title: Moving classification from a generative model to a decision model
desc: The traditional approach decodes text token by token with a generative model and then parses it; Gemini Decision 1 scores multiple questions in a single forward pass and returns probabilities with confidence scores.
caption: Simplified: the three question types (yes/no, choice, score) and per-question scoring details are omitted; both sides follow Google's announcement.
---
<svg viewBox="0 0 640 476">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Before: generative model</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">After: Gemini Decision 1</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="332"/>

  <path class="dg-line" d="M116 100V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M116 244V272" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 100V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 244V272" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="52" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="116" y="78" text-anchor="middle" dominant-baseline="central">Shared input</text>

  <rect class="dg-box dg-box--ghost" x="52" y="128" width="128" height="116" rx="6"/>
  <text class="dg-label" x="116" y="152" text-anchor="middle" dominant-baseline="central">Generative model</text>
  <text class="dg-sub" x="116" y="172" text-anchor="middle" dominant-baseline="central">Decodes text token by token</text>
  <text class="dg-sub" x="116" y="190" text-anchor="middle" dominant-baseline="central">One call per question</text>
  <text class="dg-sub" x="116" y="208" text-anchor="middle" dominant-baseline="central">Shared input billed repeatedly</text>

  <rect class="dg-box" x="52" y="272" width="128" height="60" rx="6"/>
  <text class="dg-label" x="116" y="294" text-anchor="middle" dominant-baseline="central">Text / JSON output</text>
  <text class="dg-sub" x="116" y="312" text-anchor="middle" dominant-baseline="central">Must parse, no confidence score</text>

  <rect class="dg-box" x="372" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="436" y="78" text-anchor="middle" dominant-baseline="central">Shared input + up to 1,000 Qs</text>

  <rect class="dg-box dg-box--accent" x="372" y="128" width="128" height="116" rx="6"/>
  <text class="dg-label" x="436" y="152" text-anchor="middle" dominant-baseline="central">Gemini Decision 1</text>
  <text class="dg-sub" x="436" y="172" text-anchor="middle" dominant-baseline="central">Single forward pass</text>
  <text class="dg-sub" x="436" y="190" text-anchor="middle" dominant-baseline="central">Scores all questions at once</text>
  <text class="dg-sub" x="436" y="208" text-anchor="middle" dominant-baseline="central">Shared input billed once</text>

  <rect class="dg-box" x="372" y="272" width="128" height="60" rx="6"/>
  <text class="dg-label" x="436" y="294" text-anchor="middle" dominant-baseline="central">Probability + confidence</text>
  <text class="dg-sub" x="436" y="312" text-anchor="middle" dominant-baseline="central">Zero output-token billing</text>

  <g class="dg-badge"><circle cx="36" cy="186" r="10"/><text x="36" y="186" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="36" cy="302" r="10"/><text x="36" y="302" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="356" cy="186" r="10"/><text x="356" y="186" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge"><circle cx="356" cy="302" r="10"/><text x="356" y="302" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="380" dominant-baseline="central">Changes</text>
  <g class="dg-badge"><circle cx="32" cy="408" r="10"/><text x="32" y="408" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="408" dominant-baseline="central">Removed token-by-token text generation: needs parsing, no confidence score</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="432" r="10"/><text x="32" y="432" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="432" dominant-baseline="central">Added Gemini Decision 1's single forward pass: scores up to 1,000 questions at once</text>
  <g class="dg-badge"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">Added direct probability + confidence output: zero output tokens, shared input billed once</text>
</svg>
```

## Benchmark Results

| Benchmark | Gemini Decision 1 | TypeSafe Jev 1.14 | GPT-6 Luna | Gemini 3.5 Flash-Lite |
|---|---|---|---|---|
| JevBench (public split) | **92.2** | 90.0 | 90.9 | 86.6 |
| Amazon ESCI (Macro-F1) | **58.7** | 56.7 | 54.7 | 47.2 |
| Mind2Web (multimodal) | 86.2 | **86.8** | 81.8 | 78.0 |
| When2Call | 79.9 | **82.0** | 70.4 | 60.9 |
| Top-1 ECE, 7 shared evals (lower is better) | **0.0250** | 0.0494 | 0.0721 | 0.2104 |
| Total price, 7 shared evals (USD) | 0.88 | **0.68** | 0.93 | 4.14 |

⚠️ The numbers above are Google's own self-reported figures from its launch post. Independent lab Artificial Analysis, using its own Decision Index (v2.1, covering 18 decision models, overlapping with Google's launch suite on only one benchmark — When2Call), scores Gemini Decision 1 at 66 — 9th of 18, right in the middle of the pack, just ahead of GPT-6 Luna's 60 but well behind the leaders in the low 70s. On cost, Artificial Analysis measures $345 per 1M tasks, the 4th most expensive of the 18 models (median: $143). Calibration holds up well on both sides (a low Brier score), but raw accuracy comes out merely average under independent testing — a meaningful gap from Google's "leads across the suite" framing.

## Comparison with Competitors

Gemini Decision 1 has no direct predecessor — the decision model is an entirely new category — so the relevant comparison is with two others that shipped around the same time: TypeSafe's Jev 1.14 and OpenAI's Decisions API (built on GPT-6 Luna). All three price input identically at $0.10 per 1M tokens with free output, but their capability boundaries differ: Gemini Decision 1 supports five modalities (text, image, audio, video, PDF) and up to 1,000 questions per request, while OpenAI's Decisions API only takes text and inline images, capped at 400 questions. TypeSafe's Jev 1.14 actually beats Gemini on two of Google's own benchmark rows (Mind2Web and When2Call), and comes out cheaper on Google's own cost row ($0.68 versus $0.88).

That means Google's "leads across the suite" claim needs some discounting: on the 7 evaluations in its own launch post, Jev 1.14 wins 2 and costs less; and the independent Artificial Analysis ranking goes further, placing Gemini Decision 1 in the middle of the pack (9th of 18) rather than the clear lead the launch post implies. All three vendors converging on the same $0.10/1M input price point suggests decision models aren't competing on price right now — the real competition is over modality coverage, the number of questions allowed per request, and latency.

Compared with the older approach of using a general-purpose generative model for classification, Google's "nearly 5x cheaper" claim is specifically against Gemini 3.5 Flash-Lite running the Interactions API ($0.88 versus $4.14) — and that comparison holds up on its own terms. Zero output-token billing plus charging for shared input only once genuinely changes the cost structure for "ask many yes/no questions against the same input," and that advantage holds regardless of which decision model you're comparing it to.

## What This Means for Agent Development

The emergence of decision models means agent architectures can offload "bounded choice" nodes — which tool to call, whether a situation satisfies a policy, which tier a conversation should route to — from a general-purpose generative LLM onto a specialized model that returns only probabilities and confidence scores, with no token-by-token decoding delay or output-token cost. Google is already using this pattern internally: for model routing in Gemini Notebook, and for detecting adversarial behavior against MCP tools in Search.

- **If you're building a routing layer in a multi-agent system**: swapping a decision like "which sub-agent should handle this" or "which thinking level should this request use" from a generative classifier to a decision model's `choice` type should, in theory, get you lower latency and more stable confidence scores — letting your code use a confidence threshold to decide between auto-executing and escalating to a human.
- **If you're building a pipeline with heavy rule-based judgment that still wants confidence scores** (content moderation, initial insurance claim triage, support ticket routing): bundling multiple yes/no or rubric questions against the same shared input into one request, billed once for that input, is meaningfully cheaper than firing off separate generative requests against the same input.
- **Not a fit**: anything that needs generated text, tool calls, multi-turn memory, or chain-of-thought reasoning — it supports none of function calling, thinking, the Live API, or conversation-history input. It also isn't on Google Cloud/Vertex AI yet (officially listed as "coming soon"), so teams already built on Vertex can't use it today.

## Today's Takeaway

Gemini Decision 1 is the third decision model from a major vendor, following TypeSafe's Jev and OpenAI's Decisions API — a sign the industry is carving "bounded-choice judgment" out as its own model category instead of continuing to force generative models into classification work. But the more useful takeaway here is the gap between official and independent evaluation: Google's launch post, running its own benchmark suite, claims a clear lead; Artificial Analysis, running a different evaluation set, places the same model squarely in the middle of the pack. The same model goes from "clear leader" to "average" depending entirely on which test suite you run. Whenever a new model's benchmarks show up, the first question isn't how high the score is — it's whether that score comes from the vendor's own suite or an independent lab's, because the two can produce completely different rankings for the identical model.

## References

- [Google Blog: Gemini Decisions API — Fast, calibrated multimodal decisions (official announcement, full benchmark table and pricing detail)](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [Lindy: Gemini Decision 1 — What It Is, Pricing, Benchmarks (consolidates the official announcement, docs, pricing page, and Artificial Analysis figures)](https://www.lindy.ai/blog/gemini-decision-1)
- [Artificial Analysis: Gemini Decision 1 — independent Decision Index, cost, and calibration-error evaluation](https://artificialanalysis.ai/decision-models/gemini-decision-1)
- [VentureBeat: Google's Gemini Decision 1 model scores up to 1,000 questions in one API call](https://venturebeat.com/technology/googles-gemini-decision-1-model-scores-up-to-1-000-questions-in-one-api-call)
- [SiliconANGLE: Google enters decision model market with Gemini Decisions API](https://siliconangle.com/2026/11/11/google-enters-the-decision-model-market-with-gemini-decisions-api/)
