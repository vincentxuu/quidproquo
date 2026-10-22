---
title: "Choosing a Decision Model: Jev, Decider, d1-ultra, mammoth-1, and a Dozen More"
date: 2026-10-22
category: tech
type: deep-dive
tags: [decision-model, model-selection, agent-evaluation, open-weights]
lang: en
tldr: "Decision models replace an LLM's \"generate some text and you write the parser\" with \"you list the options up front and the model returns a probability for each.\" After TypeSafe proposed System One on 2026-09-15, this category went from one vendor to more than a dozen: Jev 1.14, the OpenAI Decisions API, Perplexity Decider v1.2, Microsoft-Decision-1, Liquid d1-ultra, Base Labs mammoth-1, vLLM d3, StartLux, Fastino GLiDE, Celeris-1 Decision, Inception Mercury Decide, and Cloudflare Clef. The two leaderboards disagree almost completely — the community Jev Decision Index 0.4.1 crown goes to GLiDE V1.2 (71.5), while the independent Artificial Analysis Decision Index crown goes to d1-ultra (65.2) with Jev 1.14 at only 57.1. Decision models win on classification and tool selection, lose on knowledge and reasoning, and are broadly overconfident."
description: "A decision model selection guide: the matrix of a dozen-odd models, what the Jev Decision Index and the Artificial Analysis Decision Index each measure, cost and latency, licensing and self-hosting thresholds, and the three places that actually break once a decision model is wired into an agent — including prompt injection and overconfident thresholds."
draft: false
series:
  name: "AI Model Families"
  order: 33
glossary:
  - term: "Decision model"
    definition: "Takes a state plus a set of typed questions and returns a probability for every allowed option instead of generating text. TypeSafe named the category System One in September 2026; within a month it was a category of its own."
  - term: "System One API"
    definition: "The de facto request format for decision models: POST /v1/systemone, with a state plus questions in the body, each question tagged choice, noul, or score. The answer carries a probability per option; vendors also ship their own confidence field, and those definitions do not agree."
  - term: "Calibration"
    definition: "Whether the probabilities a model reports match the rate at which it is actually right. Decision models are used to set auto-approve thresholds, so calibration matters more than average accuracy; the usual metrics are ECE (expected calibration error) and Brier score."
---

> 🌏 [中文版](/posts/tech/2026-10-22-ai-model-family-decision-models)

Decision models replace an LLM's "generate some text and you write the parser" with "you list the options up front and the model returns a probability for each." After TypeSafe proposed System One on 2026-09-15, this category went from one vendor to more than a dozen by 2026-10-21: [Jev 1.14](https://docs.typesafe.ai/models), the [OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions), [Perplexity Decider v1.2](https://huggingface.co/perplexity-ai/pplx-decider-v1.2), [Microsoft-Decision-1](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/), [Liquid d1-ultra](https://www.liquid.ai/blog/d1-ultra), [Base Labs' mammoth-1](https://huggingface.co/baselabs/mammoth-1), [vLLM's d3](https://huggingface.co/vllm-sr/d3), [StartLux-Decision](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant), [Fastino GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model), [Celeris-1 Decision](https://celeris.ai/pricing), [Inception Mercury Decide](https://docs.inceptionlabs.ai/get-started/models), and [Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models).

If what you build is a judgement over a finite set of options — which team gets this ticket, is this text spam, may this tool call run — this batch is worth a look. If you need knowledge or reasoning, the leaderboard numbers will tell you not to bother. What this piece gives you is the version matrix, what the two leaderboards that cannot be mixed actually measure, and the three places where things genuinely break once you wire one in.

## What a decision model is: swapping "generate text" for "return probabilities"

When [TypeSafe proposed System One models on 2026-09-15](https://typesafe.ai/blog/introducing-system-one-models-and-jev), the pitch was: structured program state goes in, typed probabilistic decisions come out. Jev was the first implementation, and the whole category ended up reusing the same interface.

A request looks like this — the [System One API](https://docs.typesafe.ai/models) takes a `state` plus a set of `questions`, each tagged with the `type` of answer you want:

```json
{
  "model": "jev-1.14.0",
  "state": "I was charged twice this month; please refund one of them.",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should handle this ticket?",
      "criteria": { "billing": "payments and refunds", "technical": "product faults", "other": "none of the above" }
    },
    "refund": { "type": "noul", "instructions": "Is the customer asking for a refund?" },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is it?",
      "criteria": ["can wait", "needs attention this week", "needed today"]
    }
  }
}
```

The response does not look like this:

```json
{
  "answers": {
    "team": { "type": "choice", "choice": "billing", "probabilities": { "billing": 0.8, "technical": 0.15, "other": 0.05 }, "confidence": 0.7 },
    "refund": { "type": "noul", "noul": 0.97 },
    "urgency": { "type": "score", "score": 1.7, "confidence": 0.55, "legend": { "0": "can wait", "1": "needs attention this week", "2": "needed today" }, "probabilities": { "0": 0.1, "1": 0.1, "2": 0.8 } }
  },
  "usage": { "input_tokens": 120, "output_tokens": 12 }
}
```

Three points separate this from an LLM. First, **the output is fixed fields, not free text** — there is nothing to parse and no "type mismatch" failure mode; the schema you write and the type the model returns agree by construction. And output tokens are not billed: TypeSafe says it plainly, "You pay per input token. Output tokens are free." The [OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions) likewise charges nothing for output or cache. (One common misconception deserves clearing up: that output tokens are zero. TypeSafe's own example reports `usage.output_tokens` as 12; only d3's example shows 0. The thing worth remembering is "not billed," not "zero.") Second, **every option carries a score**, so you can set a threshold: auto-approve above 0.9, hand off below it. Third, **the three question types have distinct jobs**: `choice` picks one of a finite set, `noul` is the probability that a statement is true, and `score` returns a probability-weighted position on an ordered scale (so the score can land between two levels).

**But the `confidence` field means different things at different vendors, and that is the easiest trap in this category.** At TypeSafe and Baseten, `confidence` is a normalized concentration: for `choice` the formula is `(p_max − 1/n) / (1 − 1/n)`, so the three-way example above with p_max = 0.8 gives confidence = (0.8 − 1/3) / (1 − 1/3) = 0.7. `noul` has **no** confidence field at all. For `score`, confidence measures spread (a MAD-based quantity), not probability. vLLM's [d3](https://huggingface.co/vllm-sr/d3) uses a different convention entirely: there, `confidence` simply *is* the probability of the chosen option, and its `noul` answers carry an extra `probabilities: {yes, no}`. OpenAI returns a confidence field for `choice` and `score` but does not publish the formula.

So the practical conclusion is one line: **threshold on `probabilities[choice]`, not on `confidence`.** Baseten's documentation says the same thing: "To apply a probability threshold to a choice, use `probabilities[choice]`."

Why now? [Microsoft's framing is the most direct](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/): a pipeline with twenty sequential decisions spends an extra two seconds for every extra 100 ms per decision. These "small decisions" used to require a frontier LLM, which meant paying to generate a paragraph of prose in exchange for a yes-or-no answer. Decision models cut that cost, and the price is that they only choose among a fixed set of options — they do not write reasons and they do not reason on their own.

## The dozen-odd models, and what each one is

Two lists are more useful than one big table: **the ones with weights you can host yourself**, and **the hosted-API-only ones**. The latter cost a fixed service fee; the former cost GPU.

**Open weights, self-hostable**

| Model | Base and parameters | Modalities | License | Input price | Key differences |
|---|---|---|---|---|---|
| [Decider v1.2 (27B)](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) | Qwen3.8-27B | Text + images (≤1.6MP) | Apache-2.0 | $0.02/1M | Supports joint requests: one sequence answers every question, each read out at a marker token; the model card discloses training on the official benchmark's training split (decontaminated against the test set) |
| [Decider Flash v1.2 (4B)](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) | Qwen3.5-4B | Text + images | Apache-2.0 | $0.01/1M | Distilled from the 27B, learning full probability distributions; the cheapest input price in the category |
| [d3 (Decision 3.0)](https://huggingface.co/vllm-sr/d3) | Qwen3.8-27B, including a 0.46B vision encoder | Text / JSON + images + video | Apache-2.0 | Self-hosted | Reads video (2 fps, at most 32 frames per clip, each ≤0.2MP); vLLM v0.32.0 (2026-10-18) ships `POST /v1/systemone` enabled by default and names clef-omni, d1-3B, and DiffusionGemma as runnable; d3's own merge (2026-10-14) is not on the v0.32.0 line, so running d3 still needs a nightly build |
| [StartLux-Decision v1.1](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) | 0.8B–27B, in Instant and AutoThink variants | Text (images optional) | **CC BY-NC 4.0** (commercial use needs a separate deal) | Self-hosted | AutoThink writes a short thought first when it is unsure, then re-scores; one read covers at most 26 options |
| [mammoth-1 (27B)](https://huggingface.co/baselabs/mammoth-1) | Qwen3.5-27B full fine-tune | Text | Model card says MIT (but the repo ships no LICENSE file) | One free week of Baseten hosting | The training objective includes a Brier calibration term, and the model genuinely learns to answer "I don't know"; training data undisclosed |
| [elephant-1 (9B)](https://huggingface.co/baselabs/elephant-1) | Qwen3.5-9B full fine-tune | Text | Model card says MIT (again, no LICENSE file) | One free week of Baseten hosting | The 9B tier; the author states it trained on the Decision Index train split |
| [d1-3B](https://huggingface.co/LiquidAI/d1-3B) | LFM2.5-VL-3B | Text + images | LFM Open License | Self-hosted | 16 ms for a single question at the edge (Jetson AGX Thor), 8 ms on a GPU (RTX 4090); the model card lists 16 languages including Chinese |
| [Strands Decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21) | Qwen3.5-2B + LoRA + readout head | Text (vision is an optional extra) | Apache-2.0 | Self-hosted | Training recipe, data inventory, and evaluations are all public on GitHub, which makes it a good starting point for fine-tuning; about 115 ms locally |
| [Clef family](https://blog.cloudflare.com/clef-decision-models) | 27B / 9B / 30B-A3B | Text / JSON + images + video + audio | Apache-2.0 | $0.24 / $0.038 / $0.15 | Hosted on Workers AI and open at the same time; details in the [companion piece](/posts/tech/2026-10-22-ai-model-family-cloudflare) |

**Hosted API only**

| Model | Vendor | Modalities | Input price | Key differences |
|---|---|---|---|---|
| [Jev 1.14](https://docs.typesafe.ai/models) | TypeSafe | Text | $0.042/1M | 64k per request, 32k per question; the long-context header lifts both to 262k, but the docs say it is slower and less accurate; English is the primary training language, and CJK works but not equally well |
| [gpt-6-luna (Decisions API)](https://developers.openai.com/api/docs/guides/decisions) | OpenAI | Text + images | $0.10/1M | Public beta from 2026-10-06, with this one model only; no output or cache charges; supports ZDR and HIPAA, with data residency in the United States and Europe (EEA and Switzerland) |
| [Microsoft-Decision-1](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/) | Microsoft | Text | $0.042/1M | Post-trained from Qwen3.5-9B; on OpenRouter the id is `microsoft/microsoft-decision-1`, served through the alpha decisions endpoint rather than the normal chat API; Microsoft self-reports the highest score across 36 benchmarks and nearly 150,000 blind questions and the fastest measured, and says the model will later be rebased onto MAI and OpenAI models |
| [d1-ultra](https://www.liquid.ai/blog/d1-ultra) | Liquid | Text + images | $0.042/1M | Built on a larger open-weight base with customizations; each question is billed separately (images at 1.5 tokens per 32×32 patch, so a 1024×1024 image costs 1536 tokens); API only |
| [GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model) | Fastino | Text + JSON | $0.15/1M | A thinking decision model: it computes more only when it is unsure; 40k context, and over-long requests are refused rather than truncated; base model undisclosed and weights not yet released |
| [Celeris-1 Decision](https://celeris.ai/pricing) | Celeris | Text + structured + images | $0.04/1M | Says outright that it can attach a one-sentence explanation (only if you ask for one) |
| [Mercury Decide](https://docs.inceptionlabs.ai/get-started/models) | Inception | Text / JSON / images | $0.02/1M (list $0.04) | The endpoint is Inception's own `POST /v1/decisions` with model `mercury-decide`, and it adds an `extract` question type that System One does not have (pulling exact spans out of the input); OpenRouter's page says "up to 14 decisions per second", released 2026-09-30, 66K context |

Prices are per million input tokens and output is not billed, which is the pricing structure the whole category shares: **you are buying input tokens, not the words the model writes.** The [Perplexity model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) also contains a sentence worth keeping in your selection notes: they trained on the official benchmark's training split (decontaminated against the test set) because "a model that did not would be compared unfairly." The vendor wrote it, and you should know what the comparison is actually measuring.

## Two leaderboards, nearly opposite answers

Two different things are now called a decision model leaderboard. They measure different things and produce nearly opposite rankings. **Their scores cannot be swapped, summed, or used to say who is stronger.**

**The community Jev Decision Index 0.4.1** — a [community-maintained Space on Hugging Face](https://huggingface.co/spaces/multimodalart/jev-decision-index) tracking "what open reproductions of TypeSafe's Jev turn into." The 2026-10-22 05:40 UTC data snapshot holds 226 model rows (224 of them third-party reproductions; Jev 1.13 and 1.14 are the vendor's own reference rows), 42 benchmarks (37 of which make up the public panel), five areas, 110,201 requests (109,759 of them scoreable), all on a single RTX PRO 6000. The headline Full score is 60% private same-skill tests plus 40% private new-domain tasks, mapped back onto the public scale; public benchmarks are run but not scored, and the private tests are never published. This is a community-maintained Space — **it is not official, and not Jev's own leaderboard.**

Ranks use a 0.9-point tie band, so tied models share a rank (the site renders it as `=3`, `=10`):

| Board rank | Model | Full score | Public subset |
|---|---|---|---|
| 1 | Fastino GLiDE V1.2 | 71.52 | 71.99 |
| 2 | Jeffan-31b-1710 | 69.75 | 73.13 |
| =3 | baselabs mammoth-1 (27B) | 68.44 | 75.34 |
| =3 | Perplexity Decider v1.2 (27B) | 67.98 | 67.74 |
| =3 | AutoTrust-JEV-27B v1.1 | 67.95 | 67.32 |
| =3 | StartLux-Decision v1.1 27B | 67.92 | 72.88 |
| =4 | vLLM-SR d3-turbo v1.1 (27B) | 67.31 | 71.62 |
| =4 | vLLM-SR d3 (27B) | 67.15 | 65.45 |
| =10 | baselabs elephant-1 (9B) | 60.26 | 72.24 |
| =10 | Jev 1.14 (board reference) | 60.24 | 60.70 |
| =15 | Cloudflare clef | 54.92 | 61.71 |
| =43 | Strands Decider 2B | 20.72 | 25.41 |

Two things to take from this table. First, **open reproductions as a whole now beat the original Jev** — 40 of the 226 rows score higher than Jev 1.14, and the model at the top of the board, GLiDE V1.2, is a 27.8B full fine-tune whose base model is undisclosed and whose weights are not yet public (the model repository is private; the lab ran the weights the author shared). Second, **the public subset and the Full score rank almost differently**: mammoth-1's public subset of 75.34 is the highest on the board, while its Full score drops to =3. The "Decision Index 0.3 public subset 72.83 / 68.09" figures printed on vendor model cards are simply not the same thing as a 0.4.1 Full score — [d3's card](https://huggingface.co/vllm-sr/d3), for instance, claims "66.3, first on the official text board" on version 0.3.2, which was a 2026-10-12 snapshot and means nothing once the board version moves.

**The Artificial Analysis Decision Index v1.0** — an [independent third party](https://artificialanalysis.ai/articles/artificial-analysis-decision-index), launched 2026-10-13, with four evaluations at 25% each: knowledge and hallucination (AA-Omniscience-Decision, half accuracy and half non-hallucination rate), reasoning (HLE-MultiChoice), tool selection (When2Call), and safety classification (WildGuardTest). Its population differs from the community board: it lists hosted-only models (gpt-6-luna, d1-ultra, Microsoft-Decision-1, Mercury Decide, Celeris-1 Decision) and Baseten-hosted Elephant 9B, but no StartLux, no d3, and no mammoth-1.

| Model | DI | Knowledge | Non-hallucination | Reasoning | Tools | Classification |
|---|---|---|---|---|---|---|
| d1-ultra | 65.2 | 31.6 | 84.5 | 15.0 | 92.6 | 95.4 |
| Elephant 9B | 64.7 | 11.6 | 93.2 | 18.3 | 94.8 | 93.3 |
| Jev 1.13 | 57.5 | 34.6 | 35.2 | 20.9 | 80.7 | 93.6 |
| Jev 1.14 | 57.1 | 33.8 | 37.2 | 18.9 | 80.8 | 93.1 |
| Decider v1.2 | 56.2 | 39.4 | 16.5 | 14.6 | 87.7 | 94.4 |
| Decider v1.1 27B | 53.1 | 39.8 | 13.3 | 15.4 | 76.5 | 93.8 |
| GLiDE | 53.9 | 36.4 | 16.4 | 10.5 | 83.7 | 95.1 |
| Microsoft-Decision-1 | 53.8 | 28.2 | 39.8 | 10.9 | 81.9 | 88.2 |
| Mercury Decide | 52.7 | 35.0 | 32.0 | 10.1 | 79.3 | 88.0 |
| Celeris-1 Decision | 52.3 | 37.8 | 0.0 | 13.3 | 83.7 | 93.3 |
| d1 | 50.3 | 41.0 | 1.7 | 11.5 | 77.4 | 90.9 |
| Decider Flash v1.2 | 50.2 | 35.2 | 6.5 | 12.1 | 74.4 | 93.3 |
| Clef | 48.6 | 39.0 | 4.3 | 11.1 | 71.0 | 90.7 |
| gpt-6-luna (Decisions) | 48.5 | 40.6 | 10.1 | 11.7 | 74.1 | 82.8 |
| Clef-Flash | 45.8 | 32.6 | 2.7 | 10.3 | 64.4 | 90.9 |
| Clef-Omni | 44.3 | 36.0 | 1.6 | 9.0 | 62.1 | 87.2 |
| Claude Opus 5.5 (Max) | 79.0 | 93.4 | 30.3 | 70.2 | 90.5 | 93.5 |
| Claude Haiku 5.5 (Low) | 60.6 | 52.4 | 54.6 | 23.6 | 72.6 | 92.6 |
| GPT-6 Luna (Low) | 55.2 | 66.0 | 0.0 | 22.2 | 77.0 | 88.5 |

(Knowledge and non-hallucination are percentages; the rest are accuracies or F1. 16 decision models and 15 language models; scores from the 2026-10-22 board page, and boards move.)

The gap between the two boards comes down to the questions they ask: the community board asks "how well can you reproduce a model like Jev?"; Artificial Analysis asks "what is each model actually like at classification, tool selection, knowledge QA, and safety judgement?" The third number is the vendor's own report, and it is the one that ages fastest: in [Base Labs' 2026-10-21 post](https://www.baseten.co/blog/the-best-decision-models-in-the-world-mammoth-1-and-elephant-1/) they say mammoth-1 takes first place among 208 decision models on Jev Decision Index 0.4 (71.24), and scores 65.9 on the Artificial Analysis Decision Index with elephant-1 at 65.2 and tied for first with d1-ultra. Neither board agrees on 2026-10-22: the community board now has 226 rows with GLiDE V1.2 on top and mammoth-1 down at =3, and Artificial Analysis has no mammoth-1 row at all — Elephant 9B reads 64.69 and d1-ultra 65.25, not tied. **The same model changes rank when you change the evaluation, so the only conclusion that travels is this: which evaluation you pick decides what you see.**

## Where the capability boundary sits: classification wins, knowledge loses, and everyone is overconfident

Split Artificial Analysis' four sub-evaluations apart and the shape is clear.

**Classification and tool selection: decision models win.** On safety classification (WildGuardTest), d1-ultra scores 95.4, GLiDE 95.1, Decider v1.2 94.4 — all above Claude Haiku 5.5 (Low) at 92.6 and GPT-6 Luna (Low) at 88.5. The gap on tool selection (When2Call) is larger: Elephant 9B 94.8, d1-ultra 92.6, Decider v1.2 87.7, against 72.6 for Haiku (Low) and 77.0 for Luna (Low). These two things are exactly what decision models were designed for.

**Knowledge and reasoning: decision models lose.** On the knowledge questions (AA-Omniscience-Decision) the decision models land between 11.6 and 41.0, against 52.4 for Claude Haiku 5.5 (Low), 66.0 for GPT-6 Luna (Low), and 93.4 for Claude Opus 5.5 (Max). On reasoning (HLE-MultiChoice) the best decision model is Jev 1.13 at 20.9, against 23.6 for Haiku (Low), 22.2 for Luna (Low), and 70.2 for Opus (Max). **If you need knowledge or reasoning, use an LLM.**

**And they are broadly overconfident.** This is [Artificial Analysis' own conclusion](https://artificialanalysis.ai/articles/artificial-analysis-decision-index): almost every decision model reports probabilities higher than its actual accuracy, concentrated in the knowledge and reasoning columns; tool selection and safety classification are comparatively well calibrated. The vendors know it too. [Perplexity's model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) says they calibrated with a temperature of 1.382 on held-out data, reaching ECE 0.014 and Brier 0.134 on their dev set, but an ECE of roughly 0.05 on decision data they had not seen — "the same for every model we measured." [StartLux's card](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) is blunter: a confidence value used to pick or route answers overstates its accuracy, so set thresholds on the answers your own policy returns, not on the model's confidence.

**"I don't know" is the most important development in this category right now, but you have to read the column correctly first.** AA defines it as: "the hallucination rate is the share of questions not answered correctly that were answered wrongly rather than with 'I don't know'," which means the non-hallucination rate measures **how often, among the questions a model got wrong, it admitted ignorance instead of guessing**. Convert that column and the knowledge column into absolute shares and you get three buckets — answered correctly, answered "I don't know," and **confidently wrong**. The following is this article's arithmetic, not a column AA publishes:

| Model | Answered correctly | Answered "I don't know" | Confidently wrong |
|---|---|---|---|
| d1-ultra | 31.6 | 57.8 | 10.6 |
| Elephant 9B | 11.6 | 82.4 | 6.0 |
| Jev 1.14 | 33.8 | 24.6 | 41.6 |
| Decider v1.2 | 39.4 | 10.0 | 50.6 |
| Celeris-1 Decision | 37.8 | 0.0 | 62.2 |
| d1 (Liquid) | 41.0 | 1.0 | 58.0 |
| Claude Haiku 5.5 (Low) | 52.4 | 26.0 | 21.6 |
| GPT-6 Luna (Low) | 66.0 | 0.0 | 34.0 |

Several conclusions fall straight out of that table. **Elephant 9B's high non-hallucination rate is not a skill; it is a model that gives up on 82.4% of knowledge questions** — its accuracy is 11.6, the lowest on the board. **Celeris-1 Decision's 0.0 means it never answers "I don't know" when it is wrong**, which is the same as saying 62.2% of its knowledge questions are confidently wrong; d1 is the same story, 58%. **And language models hedge too**: Claude Haiku 5.5 (Low) says "I don't know" on 26% of questions while scoring 52.4 correct, while GPT-6 Luna (Low) never hedges and scores 66.

On launch day, the board read: "Microsoft-Decision-1 leads decision models at 40%, followed by Jev 1.13 at 35% and Mercury Decide at 32%. No other decision model reaches 17%." After Jev 1.14 (37.2) landed on 10-14, d1-ultra (84.5) on 10-15, and Elephant 9B (93.2) on 10-21, that sentence stopped being true. The real reason: **some models started putting "I don't know" into the training objective.** [Base Labs' recipe](https://huggingface.co/baselabs/mammoth-1) is explicit about it: "I don't know" answers are part of the training objective, with a Brier calibration term on top of cross-entropy.

For you this is a hard selection constraint: **if you set auto-approve thresholds off a confidence value, a model that admits ignorance is an order of magnitude safer than one that answers everything.** But pick the model that admits ignorance *and* is still right — not the one that gives up on everything.

## Cost and latency: what you actually save

Artificial Analysis converts "the average cost of running its own evaluation suite per task" into dollars per million tasks. That is not the cost of your workflow, but comparing models against each other inside the same table is valid.

| Model | Per 1M tasks | Median time per task |
|---|---|---|
| Decider Flash v1.2 | $8 | 110 ms |
| Elephant 9B | $8 | 165 ms |
| Decider v1.2 | $15 | 206 ms |
| d1 | $15 | 299 ms |
| Mercury Decide | $15 | 500 ms |
| Decider v1.1 27B | $17 | 170 ms |
| Microsoft-Decision-1 | $31 | 207 ms |
| Celeris-1 Decision | $32 | 63 ms |
| d1-ultra | $32 | 93 ms |
| Clef-Flash | $32 | 298 ms |
| Jev 1.13 | $42 | 127 ms |
| Jev 1.14 | $42 | 78 ms |
| gpt-6-luna (Decisions) | $79 | 168 ms |
| GLiDE | $119 | 217 ms |
| Clef-Omni | $123 | 172 ms |
| Clef | $199 | 309 ms |
| GPT-6 Luna (Non-reasoning) | $88 | 1136 ms |
| GPT-6 Luna (Low) | $131 | 1500 ms |
| Claude Haiku 5.5 (Low) | $184 | 1434 ms |
| Gemma 4 31B (Reasoning) | $624 | 14388 ms |
| Claude Opus 5.5 (Max) | $51,295 | 3571 ms |

Three conclusions you can use directly. **First, the order of magnitude:** the cheapest decision models (Decider Flash v1.2 and Elephant 9B, $8 each) are 11× cheaper than the cheapest language-model comparator (GPT-6 Luna Non-reasoning, $88) and more than six thousand times cheaper than Opus (Max). **Second, "decision models are always cheaper" is false:** the most expensive decision model, Clef, costs $199 per million tasks — more than Claude Haiku 5.5 (Low) at $184 and more than GPT-6 Luna (Low) at $131 — and the reason is list price: Clef's $0.24/1M input is the priciest input rate on the board, while Decider Flash's $0.01/1M puts it at the bottom. **Third, latency is a clean sweep:** decision models run 63–500 ms, language models 1,136–14,388 ms.

But those two columns are not the same yardstick, and AA says so: "Decision models are billed for input tokens only, and language models for input and output tokens." The language-model rows include the cost of generating the prose, so they look more expensive than "the same decision" would.

Self-hosting costs show up elsewhere. [d3's card](https://huggingface.co/vllm-sr/d3) reports 65.4 GiB of memory per replica on an MI325X. [StartLux](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) needs one H200 for 27B BF16, but a 4-bit MLX build fits in 64 GB on an M5 Pro — at the cost of a 1,024-token prompt going from 98 ms on H200 (vLLM BF16) to 3,308 ms on the M5 Pro (MLX 4-bit), roughly 34×, and MLX's BF16 does not fit in 64 GB at all. [d1-3B](https://huggingface.co/LiquidAI/d1-3B) answers a single question in 16 ms on a Jetson AGX Thor and three questions in 20 ms, or 8 ms for one question on an RTX 4090. If your volume is "a few hundred calls a minute," a hosted API is usually still cheaper than one GPU; if it is "a few hundred a second" or the data cannot leave the machine, self-hosting wins.

## Wiring it into an agent: three implementation points

Here is the overall routing shape first. The standard way to use a decision model inside an agent is: send the state and the typed questions, get back a probability distribution per question, and then let **your own policy** decide whether to auto-approve:

```diagram
title: Threshold routing for decision models
desc: Send the state and typed questions, get back a probability distribution per question, then split on the threshold into auto-approve and human review, with both paths leaving an auditable record of the decision.
caption: Simplified: the threshold value and the conditions for human review are your application's policy, not the model's decision.
step: Send the state and typed questions
step: The model returns a probability per question
step: Compare against the threshold: above it auto-approves, below it goes to a human
step: Both paths leave an auditable record of the decision
---
<svg viewBox="0 0 640 528">
  <path class="dg-line" d="M280 34V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 104V120" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 180V196" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line dg-line--accent" d="M376 244H420" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line dg-line--warn" d="M280 288V316" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M280 376V420" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M512 272V416Q512 424 504 424H284" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M280 428V448" marker-end="url(#arrow)" data-step="4"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="52" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="70" text-anchor="middle" dominant-baseline="central">Send state + questions</text>
    <text class="dg-sub" x="280" y="90" text-anchor="middle" dominant-baseline="central">choice / noul / score</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="160" y="124" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="142" text-anchor="middle" dominant-baseline="central">Model returns the scores</text>
    <text class="dg-sub" x="280" y="162" text-anchor="middle" dominant-baseline="central">one set per question</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M280 200L376 244L280 288L184 244Z"/>
    <text class="dg-label" x="280" y="238" text-anchor="middle" dominant-baseline="central">Over threshold?</text>
    <text class="dg-sub" x="280" y="258" text-anchor="middle" dominant-baseline="central">the top option</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="424" y="216" width="176" height="52" rx="6"/>
    <text class="dg-label" x="512" y="234" text-anchor="middle" dominant-baseline="central">Auto-approve</text>
    <text class="dg-sub" x="512" y="254" text-anchor="middle" dominant-baseline="central">apply your policy</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="160" y="320" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="338" text-anchor="middle" dominant-baseline="central">Send to a human</text>
    <text class="dg-sub" x="280" y="358" text-anchor="middle" dominant-baseline="central">below the threshold</text>
  </g>

  <circle class="dg-dot" cx="280" cy="424" r="4" data-step="4"/>

  <g data-step="4">
    <rect class="dg-box" x="160" y="452" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="470" text-anchor="middle" dominant-baseline="central">Log the decision</text>
    <text class="dg-sub" x="280" y="490" text-anchor="middle" dominant-baseline="central">question, probability, gate</text>
  </g>

  <text class="dg-edge" x="398" y="232" text-anchor="middle" dominant-baseline="central" data-step="3">yes</text>
  <text class="dg-edge dg-text--warn" x="290" y="302" text-anchor="start" dominant-baseline="central" data-step="3">no</text>
</svg>
```

**One: ask every question in a single call, but do not put competing options in the same request — and that is the 27B's specialty, not a general rule.** [Perplexity's joint request](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) on the 27B is the most valuable engineering idea in this batch: all questions share one sequence, each is read out at a marker token, so asking three questions costs about as much as asking one, and the questions can see each other. The official docs give you the criterion for when to group: different facets of the same decision should be merged (officially measured SATA-Bench +11.3, ACOS +7.8, PhishNChips +5.1), while competing candidates should be sent separately (BFCL −1.1, BRIGHT −2.9, ToolRet −4.8). Put "how much should this order be refunded" and "should this order be refunded at all" in the same request and the model will contaminate one with the other. **But the 4B Flash is the other way round:** the docs say it is "more accurate with one question per request" on most multi-question tasks, its public scores agree (60.05 one-question-per-request against 58.88 joint), and multiple questions make Flash re-bill the state (three questions against a 10,000-token state cost roughly 30,000 input tokens). Send Flash one question at a time.

**Two: the threshold and the human review are your policy, not the model's.** The model only produces scores; "what counts as good enough to auto-approve" is an application decision. [Baseten's docs](https://docs.baseten.co/inference/model-apis/decision-models) give the pattern directly: option probability ≥ 0.9 means dispatch, otherwise hand it to a human.

```bash
curl -s https://inference.baseten.co/v1/systemone -H 'content-type: application/json' -d '{
  "model": "decision-models/baseten-elephant-9b-latest",
  "state": {"ticket": "I was charged twice this month; please refund one of them."},
  "questions": {
    "team": {"type": "choice", "instructions": "Which team should handle this ticket?",
             "criteria": {"billing": "payments and refunds", "technical": "product faults"}}
  }
}' | jq -r '
  .answers.team |
  if .probabilities[.choice] >= 0.9 then .choice else "manual_review" end
'
```

Note that jq keys off `probabilities[.choice]` and not `confidence` — that is the point made above.

This snippet is a rewrite of Baseten's documentation (I swapped in an English ticket and the hosted endpoint); this site has not actually deployed that request.

There is also a versioning trap: [Jev's `jev-latest` currently resolves to 1.13.0, and `jev-preview` is the one on 1.14.0](https://docs.typesafe.ai/models), and the docs warn that "an alias moves when a new release ships, so its answers can change without any change to your code" — if you tuned a threshold against a particular version, send that version's ID rather than the alias.

**Three: switching vendors is cheap, except for OpenAI.** Most vendors take the System One schema (`state` plus `questions`, with `type` set to `choice` / `noul` / `score`), so swapping models usually means changing the `model` field. OpenAI is the exception: it calls the type `predicate`, the endpoint is `/v1/decisions`, `questions` is an array where every entry needs a `name`, the state field is `input`, options are a `choices` array of `{value, description}` rather than a `criteria` map, and there is a `refusal` response type. If you want several vendors in one codebase, an adapter layer is the cheapest path.

Three capacity limits worth remembering: StartLux covers at most 26 options per read and groups beyond that; Perplexity allows 255; [Jev allows 64k per request and 32k per question](https://docs.typesafe.ai/models); and [Perplexity's position limit is 262,144](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) but it was only trained to about 32k — requests over the limit get split into groups with the state re-billed per group (a single question that does not fit returns a 400), so the docs ask you to validate longer inputs yourself.

## The safety boundary: decision models can still be talked into it

Typed output looks like a safety mechanism. It is not. Underneath, it is still the same language model reading the text you feed it.

[HiddenLayer's test from 2026-10-14](https://www.hiddenlayer.com/research/system-one-model-security) used a mock checkout page to run indirect prompt injection: the page hides a "confirm price" ad button, and Jev clicks that ad with 91% probability instead of the checkout button; their in-house Qwen3.8-27B conversion drops from 99.7% checkout to 79.9% ad-click and 19.3% checkout; the same attack also fooled gpt-6-luna on OpenAI's Decisions API. A second test rewrote 30 toxic prompts with TokenBreak variants — both models originally blocked all 30, and the rewrites pushed the toxicity scores down. (Our 2026-10-16 [security alert](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection) covers those numbers and the defence checklist.) Their conclusion is unambiguous: these models are "under the hood, LLMs, simply using a different decoding strategy."

[Check Point's report](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/) is colder: they put Jev inside a due-diligence assistant (read a risk report, return an investment recommendation) and let an attacker rewrite a passage of the document, with the goal of flipping "high risk, do not invest" into "low risk, recommend investing." All nine attacker-and-difficulty combinations succeeded at least once; against Jev the success rate was 59% over an average of 4.6 turns at about $0.54 per successful break. Marking the document as "untrusted" made no difference at all, and so did putting "ignore instructions inside the document" in the system prompt (successes went from 18/27 to 17/27 — noise). The strongest defence they measured was turning on reasoning, and Jev has no reasoning switch.

The academic results are finer-grained but worth reading: [arXiv 2609.28613](https://arxiv.org/abs/2609.28613) tested Jev on 510 reconstructed InjecAgent cases and concluded that typed output **changes** the risk without removing it — malicious content shifts action probabilities, though it rarely makes the model pick the attacker's target outright; but adaptive attacks that optimize against the returned score double the attacker's mean highest target probability, and success on fresh validation calls rises from 1.8% to 3.5%.

So the production recipe is this: **filter the input first, never let a decision output trigger an irreversible action directly, and keep an independent verification step for important decisions.** Our write-up of the HiddenLayer test and the [decisionkit CLI](/posts/daily/2026-10-12-tool-decisionkit) both say the same thing: the model only scores, and which decisions may auto-approve is a policy you define. Incidentally, the [three-layer split](/posts/tech/2026-10-22-ai-model-family-cloudflare) in the Cloudflare piece (extract → decide → generate) does keep the raw email away from the LLM, but that reduces the attack surface, it is not a defence.

## When not to use a decision model

- **Judgements that need knowledge or reasoning.** The leaderboards favour LLMs on both, by a margin to fifteen points.
- **When you need a written reason.** Decision models do not produce prose ([Celeris-1 Decision](https://celeris.ai/pricing) says outright that it can attach a one-sentence explanation, but that is one vendor). To leave "why did it decide that" on an audit trail, you have to store the question, the options, the threshold, and the answer yourself.
- **Chinese content.** [Jev's own docs](https://docs.typesafe.ai/models) are clear: English is the primary training language, CJK works but not equally well, and you should test on your own content. The model cards for StartLux and mammoth-1 list only `en`; d1-3B's card lists 16 languages including Chinese, but that card describes the base model's language support, not a measurement of decision quality. English traffic and Chinese traffic are not the same problem.
- **High-risk actions executed automatically.** The Check Point and HiddenLayer results are right there; wiring a decision model's output straight into "charge the card," "approve the loan," or "delete the record" puts a model that can be persuaded on the critical path.
- **When the option count explodes.** Past 26 options StartLux's read starts grouping; past 255 Perplexity's API refuses outright.

## Selection cheat sheet

| Your situation | Start with |
|---|---|
| High volume, cheapest possible, self-hosting is fine | Decider Flash v1.2 ($0.01/1M, $8 per million tasks), d1-3B (16 ms at the edge) |
| Ship today, no GPU to babysit | gpt-6-luna Decisions, Jev 1.14, Microsoft-Decision-1, Celeris-1 Decision ($0.04), Decider v1.2 ($0.02) |
| Your input has images or video | d3 (images + video), Decider v1.2 and d1-ultra (images), clef-omni (images + video + audio) |
| The judgement itself is hard and needs compute first | GLiDE (thinks, and $119 is the second-most-expensive in the category), StartLux AutoThink, mammoth-1 (Base Labs says it leans toward knowledge, elephant toward fast inference) |
| You set auto-approve thresholds off a confidence value | Read the "confidently wrong" column: Celeris-1 Decision at 62.2% and d1 at 58.0% never say "I don't know"; d1-ultra at 10.6% and Elephant 9B at 6.0% do — but Elephant's knowledge accuracy is only 11.6 |
| You need Apache or MIT for commercial use | d3, Decider v1.2 / Flash, Strands Decider 2B; **StartLux is CC BY-NC, so commercial use needs a separate deal**; mammoth-1 / elephant-1 say MIT on the model card but ship no LICENSE file, so confirm the license with the vendor |
| You already run someone's System One | Changing the `model` field switches vendors; OpenAI names things differently so wrap it in an adapter; with Jev an alias can be replaced by a new release, so pin the version ID |

Three things to do before you ship: **measure ECE and the non-hallucination rate on your own data** (leaderboard scores are somebody else's traffic); **set thresholds from the curve you measured, not from the generic 0.9**, and key them off `probabilities[choice]` rather than `confidence`; and **keep a human in the loop for high-risk paths**, because what you are holding is a model that can be talked into things.

## References

- [TypeSafe: Introducing System One Models & Jev (2026-09-15)](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe Docs: Models (Jev 1.14, context, the long-context header, aliases, language support)](https://docs.typesafe.ai/models)
- [TypeSafe Docs: Confidence (how each question type defines confidence)](https://docs.typesafe.ai/confidence)
- [OpenAI Docs: Decisions API (question types, pricing, threshold guidance, residency and ZDR)](https://developers.openai.com/api/docs/guides/decisions)
- [OpenAI Changelog: v1/decisions public beta on 2026-10-06](https://developers.openai.com/api/docs/changelog)
- [Perplexity Docs: Changelog (Decider v1.2 at $0.02, Flash v1.2 at $0.01)](https://docs.perplexity.ai/docs/resources/changelog)
- [Hugging Face: pplx-decider-v1.2 model card (joint requests, calibration, training-data disclosure)](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)
- [Hugging Face: pplx-decider-flash-v1.2 model card (distillation, one-question-per-request, Decision Index 0.3 public scores)](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2)
- [Microsoft: Introducing Microsoft-Decision-1 (2026-10-09)](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/)
- [OpenRouter: microsoft/microsoft-decision-1 (the alpha decisions endpoint)](https://openrouter.ai/microsoft/microsoft-decision-1)
- [Liquid AI: d1-ultra (2026-10-15)](https://www.liquid.ai/blog/d1-ultra)
- [Hugging Face Blog: Multimodal open d1 decision models for the edge (2026-10-07)](https://huggingface.co/blog/LiquidAI/open-d1)
- [Liquid AI Docs: Decision Models (question types, image billing, when to use an LLM)](https://docs.liquid.ai/lfm/models/decision-models)
- [Base Labs / Baseten: mammoth-1 model card (training recipe, Brier calibration, the "I don't know" option)](https://huggingface.co/baselabs/mammoth-1)
- [Base Labs: The top ranked decision models in the world (2026-10-21)](https://www.baseten.co/blog/the-best-decision-models-in-the-world-mammoth-1-and-elephant-1/)
- [Baseten Docs: Decision models (the threshold-routing example)](https://docs.baseten.co/inference/model-apis/decision-models)
- [vLLM Semantic Router: d3 model card (video input, vLLM support, speed, memory)](https://huggingface.co/vllm-sr/d3)
- [vLLM v0.32.0 release notes (the `/v1/systemone` endpoint)](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)
- [StartLux-Decision v1.1 model card (Instant / AutoThink, license, thresholds, latency table)](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)
- [arXiv 2610.17309: StartLux-Decision technical report](https://arxiv.org/abs/2610.17309)
- [Fastino: Introducing GLiDE (2026-09-30)](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model)
- [Fastino Docs: GLiDE (pricing, context)](https://docs.fastino.ai/concepts/glide)
- [Celeris: Pricing (Celeris-1 Decision)](https://celeris.ai/pricing)
- [Inception Docs: Models (Mercury Decide, the v1/decisions endpoint)](https://docs.inceptionlabs.ai/get-started/models)
- [Inception Docs: Decisions (the extract question type and its limits)](https://docs.inceptionlabs.ai/capabilities/decisions)
- [Strands Decider 2B model card (Apache-2.0, public training data)](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21)
- [Hugging Face Space: Jev Decision Index (the 0.4.1 community board and its data)](https://huggingface.co/spaces/multimodalart/jev-decision-index)
- [Artificial Analysis: Decision Index v1.0 (2026-10-13, method and conclusions)](https://artificialanalysis.ai/articles/artificial-analysis-decision-index)
- [Artificial Analysis: Decision Index board page (2026-10-22 scores, cost and latency definitions)](https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index)
- [Artificial Analysis: Decision Index methodology (the non-hallucination rate definition)](https://artificialanalysis.ai/methodology/decision-index)
- [HiddenLayer: Jevil in the details (2026-10-14)](https://www.hiddenlayer.com/research/system-one-model-security)
- [Check Point: A Decision Model Breaks Like Any Other Language Model (2026-09-24)](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/)
- [arXiv 2609.28613: Decision Hijacking (the injection risk of typed output)](https://arxiv.org/abs/2609.28613)
- [Cloudflare: Introducing Clef (2026-10-01)](https://blog.cloudflare.com/clef-decision-models)
- This site: [Cloudflare Model Family: Choosing Clef Decision Models and Clairic Extraction Models](/posts/tech/2026-10-22-ai-model-family-cloudflare)
- This site: [Security alert: decision model Jev is not immune to prompt injection](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)
- This site: [Tool recommendation: decisionkit](/posts/daily/2026-10-12-tool-decisionkit)
- This site: [Model card: Jev (TypeSafe AI)](/posts/daily/2026-09-19-model-typesafe-ai-jev)
