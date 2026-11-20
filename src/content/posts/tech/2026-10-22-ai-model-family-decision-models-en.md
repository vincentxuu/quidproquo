---
title: "Choosing a Decision Model: Gemini Decision 1, d1.2-ultra, Drex, Decider, and Twenty-Odd Others"
date: 2026-10-22
category: tech
type: deep-dive
tags: [decision-model, model-selection, agent-evaluation, open-weights]
lang: en
tldr: "Decision models replace an LLM's \"generate some text and you parse it\" with \"you list the options and the model returns a probability for each.\" Within two months of TypeSafe proposing System One on 2026-09-15, the category grew to more than twenty vendors, and Google launched Gemini Decision 1 on 11-11. In November Artificial Analysis rebuilt its leaderboard as v2, scoring with a Decision Score that weighs both correctness and confidence. On the v2.1 board as of 2026-11-20, the top decision model is Liquid d1.2-ultra (74.8) and Gemini Decision 1 scores 66.0 — but once language models also return probabilities, Claude Haiku 5.5 (Max) scores 76.5, above every decision model, at 47× the cost per million tasks and about 150× the latency. Decision models win on speed, cost, and tool selection, and lose on knowledge and reasoning."
description: "A decision model selection guide: a version matrix for twenty-odd models, how the Artificial Analysis Decision Index v2.1 and the community Jev Decision Index differ, cost and latency, licensing and self-hosting, and the three places things break once you wire one into an agent — including prompt injection and setting thresholds on overconfident models."
draft: false
series:
  name: "AI Model Families"
  order: 33
glossary:
  - term: "Decision model"
    definition: "Takes a state and a set of typed questions and returns a probability for every legal option instead of generating text. TypeSafe named it the System One model class in September 2026, and within two months it became a category of its own."
  - term: "System One API"
    definition: "The de facto request format for decision models: POST /v1/systemone, with a body of state plus questions, each with a type of choice, noul, or score, and answers as probabilities per option. Each vendor also has its own confidence field, and the definitions don't match."
  - term: "Calibration"
    definition: "Whether the probabilities a model gives match how often it is actually right. Decision models are used to set auto-approve thresholds, so calibration matters more than average accuracy; common metrics are ECE (expected calibration error) and the Brier score."
  - term: "Decision Score"
    definition: "The headline metric of the Artificial Analysis Decision Index v2: each question scores 50 × (1 + c − (p − c)²), where p is the probability the model gives its chosen answer and c is whether it is right. Right answers land between 50 and 100 and wrong ones between 0 and 50, with confident mistakes penalized more; overall it equals 50 × (1 + accuracy − Brier score)."
---

> 🌏 [中文版](/posts/tech/2026-10-22-ai-model-family-decision-models)

Decision models replace an LLM's "generate some text and you write the parser" with "you list the options up front and the model returns a probability for each." After TypeSafe proposed System One on 2026-09-15, this category went from one vendor to more than twenty by 2026-11-20: [Jev 1.14](https://docs.typesafe.ai/models), [Google Gemini Decision 1](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/), the [OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions), [Perplexity Decider v1.3](https://docs.perplexity.ai/docs/decisions/quickstart), [Microsoft-Decision-1.1](https://commandline.microsoft.com/microsoft-decision-model-ga/), [Liquid d1.2-ultra](https://www.liquid.ai/blog/d1-2), [Nace.AI Drex](https://www.nace.ai/drex/decision-index), [Subquadratic SubQ Snap](https://docs.subq.ai/using-the-api/models/), [Base Labs' mammoth-1](https://huggingface.co/baselabs/mammoth-1), [vLLM's d3](https://huggingface.co/vllm-sr/d3), [StartLux-Decision](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant), [Fastino GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model), [Celeris-1.1 Decision](https://celeris.ai/pricing), [Inception Mercury Decide](https://docs.inceptionlabs.ai/get-started/models), and [Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models).

If what you build is a judgement over a finite set of options — which team gets this ticket, is this text spam, may this tool call run — this batch is worth a look. If you need knowledge or reasoning, the leaderboard numbers will tell you not to bother. What this piece gives you is the version matrix, what the two leaderboards that cannot be mixed actually measure, and the three places where things genuinely break once you wire one in.

This piece was first written on 10-22; the 11-20 revision replaces the version matrix, leaderboards, and costs with November data. The old October numbers, and why they were replaced, are in the update history at the end.

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


## Twenty-odd decision models, and what each one is

Two buckets are more useful than one big table: **models whose weights you can host yourself**, and **models you can only reach through a hosted API**. The latter cost a fixed service fee; the former cost GPUs. Many vendors do both — open weights plus a hosted API — so the tables below split by whether you can self-host. Prices are list prices per million input tokens read from each vendor's official page on 2026-11-20; output is never billed.

**Open weights, self-hostable**

| Model | Base and size | Modality | License | Hosted input price | Key difference |
|---|---|---|---|---|---|
| [Decider v1.3 (27B)](https://docs.perplexity.ai/docs/decisions/quickstart) | Qwen3.8-27B | Text + images | Apache-2.0 | $0.02/1M | Released 11-09; adds a `locate` question type (find the spans of `state` matching a description); 256K context; `pplx-decider-latest` now points to 1.3 |
| [Decider Flash v1.3 (4B)](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.3) | 4B | Text + images | Apache-2.0 | $0.01/1M | The lowest input price among decision models; for v1.2 Perplexity said one question per request was more accurate, while 1.3 can group questions |
| [d3 (Decision 3.0)](https://huggingface.co/vllm-sr/d3) | Qwen3.8-27B with a 0.46B vision tower | Text/JSON + images + video | Apache-2.0 | Self-host | Reads video (2 fps, up to 32 frames per clip, ≤0.2MP per frame); vLLM v0.32.0 ships a built-in `/v1/systemone` endpoint; the family also has d3-ultra, turbo, flash, mini, and other sizes |
| [GLiDE 27B](https://huggingface.co/fastino/GLiDE-27B) | Full fine-tune of a Qwen base | Text + JSON | fastino-community (custom) | Fastino API | A thinking decision model that spends extra compute only when unsure; its weights weren't out in October and have been on HuggingFace since 10-19 |
| [Drex v2.0](https://huggingface.co/nace-ai/drex-v2.0) | Qwen3.6-35B-A3B | Text | Nace.AI Open RAIL-M (custom, with use restrictions) | $0.03/1M | Nace also has a Drex Max v1 weights repo; the current Drex Max v1.1 is hosted, see below |
| [StartLux-Decision v1.1](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) | 0.8B–27B, Instant and AutoThink | Text (images optional) | **CC BY-NC 4.0** (commercial use needs a separate deal) | Self-host | AutoThink writes a thought first and rescores when unsure; at most 26 options per read |
| [mammoth-1 (27B)](https://huggingface.co/baselabs/mammoth-1) | Full fine-tune of Qwen3.5-27B | Text | Model card says MIT (but no LICENSE file in the repo) | Hosted on Baseten | Training objective includes a Brier calibration term and actually teaches the model to answer "I don't know"; training data undisclosed |
| [elephant-1 (9B)](https://huggingface.co/baselabs/elephant-1) | Full fine-tune of Qwen3.5-9B | Text | Model card says MIT (no LICENSE file either) | Hosted on Baseten | 9B class; the authors say training used the Decision Index train split |
| [d1-2B / d1-Omni-2B](https://huggingface.co/LiquidAI/d1-2B) | LFM3-1.7B backbone | Text + images (Omni adds audio) | LFM Open License (commercial use above US$10M annual revenue needs a separate deal) | Self-host | Released 10-24 with LFM3, replacing the earlier d1-3B; see the [Liquid AI family post](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en) |
| [Strands Decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21) | Qwen3.5-2B + LoRA + readout head | Text (vision is an optional add-on) | Apache-2.0 | Self-host | Training recipe, data list, and evals are all on GitHub, a good starting point for modifying a model; about 115 ms locally |
| [Clef family](https://blog.cloudflare.com/clef-decision-models) | 27B / 9B / 30B-A3B | Text/JSON + images + video + audio | Apache-2.0 | $0.24 / $0.038 / $0.15 | Hosted on Workers AI and also open-sourced; see [the other post](/posts/tech/2026-10-22-ai-model-family-cloudflare-en) |

**Hosted API only**

| Model | Vendor | Modality | Input price | Key difference |
|---|---|---|---|---|
| [Gemini Decision 1](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) | Google | Text + images + audio + video + PDF | $0.10/1M | Launched 11-11; up to 1,000 questions per request, shared input billed once, 256K input limit; free tier in AI Studio; the request field is `input`, not `state` |
| [d1.2-ultra / d1.2](https://docs.liquid.ai/lfm/models/d1) | Liquid | Text + images + audio | $0.042 / $0.02 | Launched 11-16 with five new question types (read a value, find passages, locate objects, estimate a number, multi-select); d1-ultra, d1.1, and d1 are deprecated |
| [Drex Max v1.1](https://www.nace.ai/drex/decision-index) | Nace.AI | Text | $0.03/1M | Artificial Analysis notes its cost reflects a temporary launch price that roughly doubles at the standard price |
| [SubQ Snap 1.2](https://docs.subq.ai/using-the-api/models/) | Subquadratic | Text + images | $0.04/1M | 384K context, pitched at long-context decisions; version 1.1 shut down on 11-11 |
| [Microsoft-Decision-1.1](https://commandline.microsoft.com/microsoft-decision-model-ga/) | Microsoft | Text + images | $0.042/1M (Global) | GA on 11-17, more than twice as fast as 1.0 and now accepts images; US/EU/APAC data zones cost more; also on OpenRouter and Vercel |
| [Jev 1.14](https://docs.typesafe.ai/models) | TypeSafe | Text + images | $0.042/1M | 64k per request, 32k per question; the long-context header raises both to 262k but is slower and less accurate; 1.14 adds a `box` question type; English is the main training language |
| [gpt-6-luna (Decisions API)](https://developers.openai.com/api/docs/guides/decisions) | OpenAI | Text + images | $0.10/1M | Public beta since 10-06; no output or cache charges; supports ZDR and HIPAA, with data residency in the US and Europe |
| [Celeris-1.1 Decision](https://docs.celeris.ai/pricing) | Celeris | Text + structured + images | $0.004/1M | The lowest list price among hosted decision models; can attach a one-sentence explanation for free |
| [Mercury Decide](https://docs.inceptionlabs.ai/get-started/models) | Inception | Text / JSON / images | $0.02/1M (list $0.04) | Uses Inception's own `POST /v1/decisions` endpoint, with an extra `extract` question type beyond System One |
| [GLiDE (hosted)](https://docs.fastino.ai/concepts/glide) | Fastino | Text + JSON | $0.15/1M | 40k context; over-long requests are rejected, not truncated |

Prices are per million input tokens with output unbilled — the pricing structure the whole category shares: **you're buying input tokens, not the words the model writes**. But list price isn't cost per question: how questions are grouped, how images are counted, and whether there's a long-context premium all differ by vendor, so the cost section below compares Artificial Analysis's cost per million tasks.

[Perplexity's model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) also contains a line worth noting in any selection table: they trained on the official benchmarks' training split (decontaminated against the test set), on the grounds that "models that don't would be unfairly disadvantaged on the leaderboard." That's the vendor's own disclosure; you should know what it's competing on.

## Two leaderboards that measure different things

Two things are both called "the decision model leaderboard," and they measure different things and don't agree on rankings. **Their scores can't be swapped, added, or used to say who is "stronger."**

**Artificial Analysis Decision Index v2.1** — an [independent third party](https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index) that runs every model itself. v1.0, launched 10-13, had only four evaluations; [v2 on 11-08](https://artificialanalysis.ai/articles/decision-index-v2) rebuilt it, raising the share of private datasets from 25% to 45% to guard against benchmark gaming:

| Evaluation | What it measures | Weight |
|---|---|---|
| AA-Paperclip (private) | 1,500 resumes, receipts and invoices, and papers, each with 5 decisions + 10 extractions; a document counts only if all 15 answers are right | 30% |
| EvalSafe-O*NET-AA | Judgements about workplace documents | 15% |
| When2Call | Whether to call a tool | 10% |
| AA-Omniscience-Decision v1.1 (private) | Knowledge and hallucination, with "I don't know" worded ten ways | 15% |
| HLE-MultiChoice v1.1 | Reasoning, with an option to decline | 15% |
| AA-Symmetry v1.1 | Whether answers and probabilities hold when options are reordered or reworded, or the question is negated | 15% |

The headline metric changed too: v2 uses the **Decision Score**, 50 × (1 + c − (p − c)²) per question, so right answers land between 50 and 100, wrong answers between 0 and 50, and confident mistakes lose the most. It folds accuracy and calibration into one number that maps directly onto how decision models are used — act when confidence clears a threshold, route to a person otherwise. v2 also dropped the saturated WildGuardTest and has language models return a probability for every option, so the two kinds of model can be compared on the same score for the first time.

The 18 current decision models and 4 language-model references read from the leaderboard page on 2026-11-20 (sub-scores are Decision Scores; AA-Symmetry is the Symmetry Score):

| Model | Vendor | DI | Paperclip | O*NET | When2Call | Knowledge | Reasoning | Symmetry |
|---|---|---|---|---|---|---|---|---|
| d1.2-ultra | Liquid | **74.8** | **75.8** | 89.5 | **96.5** | 60.8 | 46.4 | 86.3 |
| Drex Max v1.1 | Nace.AI | 72.6 | 72.8 | 88.3 | 95.3 | 60.3 | 46.6 | 79.8 |
| SubQ Snap 1.2 | Subquadratic | 72.6 | 71.6 | 88.6 | 96.1 | 61.0 | 45.6 | 81.4 |
| GLiDE v1.2 | Fastino | 72.5 | 71.4 | 89.7 | 95.1 | 60.9 | 44.6 | 82.1 |
| Mammoth 27B | Base Labs | 71.4 | 64.2 | 88.8 | 95.8 | 58.9 | 47.4 | **88.2** |
| Decider v1.3 | Perplexity | 70.4 | 68.7 | 89.1 | 94.6 | 58.9 | 42.9 | 77.9 |
| d1.2 | Liquid | 68.7 | 62.6 | 86.6 | 96.1 | 60.9 | 44.7 | 76.5 |
| Microsoft-Decision-1.1 | Microsoft | 67.8 | 58.7 | 88.8 | 95.1 | 60.5 | 46.1 | 75.7 |
| Elephant 9B | Base Labs | 66.4 | 52.4 | 87.4 | 95.5 | 56.0 | 45.8 | 84.9 |
| Jev 1.14 | TypeSafe | 66.2 | 57.5 | **91.1** | 84.4 | 60.1 | 44.5 | 74.5 |
| Gemini Decision 1 | Google | 66.0 | 56.8 | 87.1 | 80.5 | **66.3** | **48.7** | 70.5 |
| Decider Flash v1.3 | Perplexity | 64.1 | 53.2 | 84.1 | 90.1 | 55.4 | 40.7 | 80.4 |
| Mercury Decide | Inception | 62.1 | 56.9 | 86.6 | 81.4 | 56.7 | 34.8 | 67.6 |
| Celeris-1.1 Decision | Celeris | 62.0 | 54.5 | 84.6 | 88.7 | 57.6 | 40.3 | 62.5 |
| Drex 2.0 | Nace.AI | 61.6 | 51.9 | 81.9 | 88.7 | 60.5 | 47.1 | 58.1 |
| Clef | Cloudflare | 60.3 | 54.4 | 85.7 | 77.2 | 57.1 | 42.6 | 56.6 |
| gpt-6-luna (Decisions) | OpenAI | 60.2 | 52.9 | 85.2 | 79.5 | 60.2 | 42.6 | 54.9 |
| Clef-Omni | Cloudflare | 57.8 | 50.6 | 81.0 | 70.7 | 56.8 | 42.4 | 56.4 |
| Claude Haiku 5.5 (Max) | Anthropic | 76.5 | 82.7 | — | 84.3 | 74.4 | 54.9 | 68.5 |
| GPT-6 Luna (Max) | OpenAI | 75.7 | 86.9 | — | 82.5 | 66.4 | 44.7 | 72.3 |
| GPT-6 Luna (Low) | OpenAI | 68.8 | 72.9 | — | 81.2 | 67.9 | 34.5 | 69.5 |
| Claude Haiku 5.5 (Low) | Anthropic | 67.2 | 68.7 | — | 76.6 | 68.3 | 46.7 | 63.7 |

(This post didn't read O*NET numbers for the language models, shown as "—". The leaderboard moves; Drex Max v1.1 and SubQ Snap 1.2 both round to 72.6, with Drex slightly ahead before rounding.)

Three takeaways from this table:

- **Language models now rank first in v2.** Once Claude Haiku 5.5 and GPT-6 Luna also return probabilities, both at maximum reasoning effort score above every decision model, winning mainly on the Paperclip document task (82.7 and 86.9 versus d1.2-ultra's 75.8) and on knowledge. Decision models' selling point isn't being more accurate; it's the speed and cost in the next section.
- **Google's new model isn't near the top.** Gemini Decision 1 has the highest knowledge (66.3) and reasoning (48.7) scores among decision models, but tool selection (80.5) and Symmetry (70.5) pull its total down to 11th. Google's blog says it "leads across the suite with the lowest calibration error" on Google's own benchmark selection, which doesn't match the independent board.
- **A high Symmetry score may just mean saying "I don't know" a lot.** [Artificial Analysis itself notes](https://artificialanalysis.ai/articles/decision-index-v2) that Base Labs' two models lead on Symmetry largely because they often answer "I don't know" with high confidence, and keep answering "I don't know" when questions are reworded, which is naturally consistent.

**Community Jev Decision Index 0.4.1** — a [community-maintained Space on Hugging Face](https://huggingface.co/spaces/multimodalart/jev-decision-index) that tracks "what open reproductions of TypeSafe's Jev can do." **It's not TypeSafe's, and not an official Jev leaderboard.** The headline Full score is 60% private same-skill tests plus 40% private new-domain tasks; public benchmarks are run but don't count, and everything runs on a single RTX PRO 6000. The 2026-11-19 data snapshot has 326 scoreable models, 70 of which score above Jev 1.14's 60.24; the top is karpo-decision-31B (73.86), with GLiDE 27B (73.37) close behind.

| Model | Full score | Public subset |
|---|---|---|
| karpo-decision-31B | 73.86 | 75.05 |
| GLiDE 27B | 73.37 | 72.49 |
| vLLM-SR d3-ultra (27B) | 70.18 | 71.57 |
| baselabs mammoth-1 (27B) | 68.44 | 75.34 |
| Perplexity Decider v1.2 (27B) | 67.98 | 67.74 |
| StartLux-Decision v1.1 27B | 67.92 | 72.88 |
| Perplexity Decider v1.3 (27B) | 67.67 | 69.72 |
| baselabs elephant-1 (9B) | 60.26 | 72.24 |
| Jev 1.14 (reference row) | 60.24 | 60.70 |
| Cloudflare clef | 54.92 | 61.71 |
| Strands Decider 2B | 20.72 | 25.41 |

Two observations: this board only includes models whose weights can be obtained or reproduced, so hosted models such as Gemini, d1.2-ultra, and Drex Max aren't on it; and here Decider v1.3's Full score is slightly below v1.2's, the opposite of Artificial Analysis, where v1.3 beats v1.2. **The same model gets a different rank on a different evaluation, so the one conclusion to take away is that the evaluation you pick decides what you see.** Leaderboard scores quoted in vendor announcements also go stale fastest; check the board's own date and version before citing them.

## Where the capability boundary sits: tool selection wins, documents and knowledge lose, and confident mistakes remain

**Tool selection: decision models win.** On When2Call Decision Scores, the leading decision models sit between 94 and 96.5, while the language-model references range from 76.6 to 84.3. This is decision models' most reliable strength.

**Documents, knowledge, and reasoning: the best language models still win.** Paperclip requires all 15 answers per document to be right, and [Artificial Analysis's write-up](https://artificialanalysis.ai/articles/decision-index-v2) notes that Drex Max v1.1 gets 97% of individual answers right, close to Claude Haiku 5.5 (Max)'s 99%, yet passes only 63% of documents against Haiku's 92%; decision models mostly lose on the decisions rather than the extractions. On knowledge Decision Scores, the best decision model is Gemini Decision 1 at 66.3, while Claude Haiku 5.5 (Max) scores 74.4. **If you need knowledge or fully correct answers over long documents, use an LLM or put retrieval in front of the decision model.**

**"I don't know" is the most important variable in this category, but first understand what that column means.** Artificial Analysis defines the non-hallucination rate as: of the questions a model got wrong, the share where it answered "I don't know" rather than giving a wrong answer. Combining it with knowledge accuracy gives three buckets in absolute terms: right, "I don't know," and **confidently wrong** — this is this post's own calculation; the leaderboard doesn't publish that column:

| Model | Knowledge right | "I don't know" | Confidently wrong |
|---|---|---|---|
| Gemini Decision 1 | 44.8 | 27.4 | 27.8 |
| Decider v1.3 | 40.6 | 4.0 | 55.4 |
| Microsoft-Decision-1.1 | 33.2 | 33.0 | 33.8 |
| Jev 1.14 | 31.6 | 32.6 | 35.8 |
| d1.2-ultra | 23.6 | 64.0 | 12.4 |
| SubQ Snap 1.2 | 20.6 | 71.0 | 8.4 |
| Mammoth 27B | 15.4 | 81.4 | 3.2 |
| Elephant 9B | 13.2 | 74.6 | 12.2 |
| Clef-Omni | 37.0 | 1.2 | 61.8 |
| Claude Haiku 5.5 (Max) | 57.2 | 27.4 | 15.4 |
| GPT-6 Luna (Max) | 41.2 | 50.2 | 8.6 |

Several conclusions follow directly. **Mammoth 27B and Elephant 9B are rarely confidently wrong because they give up on 70–80% of knowledge questions**, with accuracy of only 15.4 and 13.2. **Decider v1.3 and Clef-Omni almost never say they don't know**, so more than half of their knowledge answers are confidently wrong. The leader, d1.2-ultra, sits in between: its accuracy isn't high, but when it's wrong it usually admits it.

**And most decision models are still overconfident.** That was Artificial Analysis's conclusion at the v1.0 launch: the probabilities models give are generally higher than their actual accuracy, concentrated in knowledge and reasoning. The v2.1 calibration data shows it too — for example, on Gemini Decision 1's overall calibration curve, every confidence bin from 0.4 to 0.8 has actual accuracy 1 to 9 points below the probability it gave. Vendors know this: [Perplexity's model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) says they calibrated with temperature scaling and got ECE 0.014 on the dev set, but about 0.05 on unseen decision data — "the same for every model we measured." [StartLux's card](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) is blunter: confidence used for picking or routing overstates accuracy, so set thresholds on the answers your own policy returns.

For you this is a hard selection criterion: **if you'll use confidence to set an auto-approve threshold, pick a model that admits when it doesn't know and still gets answers right — not one that answers everything, and not one that says "I don't know" to everything.**

## Cost and latency: what you actually save

Artificial Analysis converts "average cost per question across the Decision Index" into dollars per million tasks and lists median latency per task. That isn't your workflow's cost, but comparisons within the same table are valid. v2 changed the questions (it now includes whole documents), so cost per task can't be compared with the v1.0 numbers.

| Model | DI | Per million tasks | Median time per task |
|---|---|---|---|
| Celeris-1.1 Decision | 62.0 | $14 | 61 ms |
| Decider Flash v1.3 | 64.1 | $34 | 178 ms |
| d1.2 | 68.7 | $63 | 150 ms |
| Decider v1.3 | 70.4 | $68 | 289 ms |
| Mercury Decide | 62.1 | $70 | 245 ms |
| Elephant 9B | 66.4 | $92 | 79 ms |
| Drex Max v1.1 | 72.6 | $103 (temporary launch price) | 283 ms |
| d1.2-ultra | 74.8 | $133 | 218 ms |
| SubQ Snap 1.2 | 72.6 | $137 | 162 ms |
| Microsoft-Decision-1.1 | 67.8 | $140 | 123 ms |
| Jev 1.14 | 66.2 | $156 | 92 ms |
| Drex 2.0 | 61.6 | $200 | 255 ms |
| Mammoth 27B | 71.4 | $264 | 106 ms |
| gpt-6-luna (Decisions) | 60.2 | $339 | 206 ms |
| Gemini Decision 1 | 66.0 | $345 | 211 ms |
| Clef-Omni | 57.8 | $529 | 192 ms |
| GLiDE v1.2 | 72.5 | $780 | 284 ms |
| Clef | 60.3 | $863 | 354 ms |
| GPT-6 Luna (Low) | 68.8 | $485 | 4,445 ms |
| Claude Haiku 5.5 (Low) | 67.2 | $861 | 3,013 ms |
| GPT-6 Luna (Max) | 75.7 | $1,548 | 11,360 ms |
| Claude Haiku 5.5 (Max) | 76.5 | $6,218 | 32,323 ms |

Three conclusions you can use directly. **First, the order-of-magnitude gap**: the top decision model, d1.2-ultra (74.8), is only 1.7 points behind the top language model, Claude Haiku 5.5 (Max) (76.5), but 47× cheaper per million tasks and about 150× faster per task. If you can accept those 1.7 points, a decision model is the right choice. **Second, list price isn't cost per task**: Gemini Decision 1 and gpt-6-luna's $0.10 input price is five times Decider's, and so is their cost per million tasks; GLiDE and Clef have high list prices to begin with ($0.15, $0.24) and cost more per million tasks than the language model GPT-6 Luna (Low). **Third, latency is a clean sweep**: decision models take 61–354 ms, language models 3,013–32,323 ms.

The two groups aren't billed on exactly the same basis, as Artificial Analysis notes: decision models are billed for input tokens only, and language models' cost includes output tokens. Also, Drex Max v1.1's $103 is marked as a temporary launch price; a third-party analysis estimates about $206 at the standard price, so don't pin a budget to today's number.

Self-hosting costs show up elsewhere. [d3's card](https://huggingface.co/vllm-sr/d3) says a single replica uses 65.4 GiB of VRAM on an MI325X; [StartLux](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)'s 27B in BF16 needs an H200, and the 4-bit MLX version runs on a 64 GB M5 Pro, but for the same 1,024-token prompt, vLLM BF16 on an H200 takes 98 ms while MLX 4-bit on the M5 Pro takes 3,308 ms (about 34×). If your volume is "a few hundred per minute," a hosted API bill is usually still cheaper than a GPU; at "a few hundred per second," or when data can't leave the machine, self-hosting pays off.

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

**One: ask every question in a single call, but do not put competing options in the same request — and that is the 27B's specialty, not a general rule.** [Perplexity's joint request](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) on the 27B is the most valuable engineering idea in this batch: all questions share one sequence, each is read out at a marker token, so asking three questions costs about as much as asking one, and the questions can see each other. The official docs give you the criterion for when to group: different facets of the same decision should be merged (officially measured SATA-Bench +11.3, ACOS +7.8, PhishNChips +5.1), while competing candidates should be sent separately (BFCL −1.1, BRIGHT −2.9, ToolRet −4.8). Put "how much should this order be refunded" and "should this order be refunded at all" in the same request and the model will contaminate one with the other. **But the 4B Flash v1.2 is the other way round:** the docs say it is "more accurate with one question per request" on most multi-question tasks, its public scores agree (60.05 one-question-per-request against 58.88 joint), and multiple questions make Flash v1.2 re-bill the state (three questions against a 10,000-token state cost roughly 30,000 input tokens). [Perplexity's Decisions API docs](https://docs.perplexity.ai/docs/decisions/quickstart) mark "answers each question on its own" as Flash v1.2 behavior, and Flash v1.3 can group questions; if you're still on Flash v1.2, send one question at a time. Google's Gemini Decision 1 goes the other direction: up to 1,000 questions per request, shared input billed once, each question scored independently without seeing the others' answers.

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

There is also a versioning trap: aliases move with new releases. [Jev's `jev-latest` pointed to 1.13.0 in October and now points to 1.14.0](https://docs.typesafe.ai/models); Perplexity's `pplx-decider-latest` has also moved from 1.2 to 1.3, and [its docs](https://docs.perplexity.ai/docs/decisions/quickstart) warn that a newer model can return different probabilities for the same request. If you tuned a threshold against a particular version, send that version's ID rather than the alias.

**Three: switching vendors is cheap, except for OpenAI, Google, and Inception.** Most vendors take the System One schema (`state` plus `questions`, with `type` set to `choice` / `noul` / `score`), so swapping models usually means changing the `model` field. There are three exceptions: OpenAI calls the type `predicate`, the endpoint is `/v1/decisions`, `questions` is an array where every entry needs a `name`, the state field is `input`, options are a `choices` array of `{value, description}` rather than a `criteria` map, and there is a `refusal` response type; [Google's Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) uses question types and `criteria` close to System One, but the state field is `input` and content uses Gemini's `Content` block format; Inception uses its own `/v1/decisions` with an extra `extract` question type. The question types vendors have added also don't carry across: Jev 1.14's `box`, Decider v1.3's `locate`, and d1.2's value reading and object boxes. If you want several vendors in one codebase, an adapter layer is the least effort.

Three capacity limits worth remembering: StartLux covers at most 26 options per read and groups beyond that; Perplexity allows 255; [Jev allows 64k per request and 32k per question](https://docs.typesafe.ai/models); and [Perplexity's position limit is 262,144](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) but it was only trained to about 32k — requests over the limit get split into groups with the state re-billed per group (a single question that does not fit returns a 400), so the docs ask you to validate longer inputs yourself.

## The safety boundary: decision models can still be talked into it

Typed output looks like a safety mechanism. It is not. Underneath, it is still the same language model reading the text you feed it.

[HiddenLayer's test from 2026-10-14](https://www.hiddenlayer.com/research/system-one-model-security) used a mock checkout page to run indirect prompt injection: the page hides a "confirm price" ad button, and Jev clicks that ad with 91% probability instead of the checkout button; their in-house Qwen3.8-27B conversion drops from 99.7% checkout to 79.9% ad-click and 19.3% checkout; the same attack also fooled gpt-6-luna on OpenAI's Decisions API. A second test rewrote 30 toxic prompts with TokenBreak variants — both models originally blocked all 30, and the rewrites pushed the toxicity scores down. (Our 2026-10-16 [security alert](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection) covers those numbers and the defence checklist.) Their conclusion is unambiguous: these models are "under the hood, LLMs, simply using a different decoding strategy."

[Check Point's report](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/) is colder: they put Jev inside a due-diligence assistant (read a risk report, return an investment recommendation) and let an attacker rewrite a passage of the document, with the goal of flipping "high risk, do not invest" into "low risk, recommend investing." All nine attacker-and-difficulty combinations succeeded at least once; against Jev the success rate was 59% over an average of 4.6 turns at about $0.54 per successful break. Marking the document as "untrusted" made no difference at all, and so did putting "ignore instructions inside the document" in the system prompt (successes went from 18/27 to 17/27 — noise). The strongest defence they measured was turning on reasoning, and Jev has no reasoning switch.

The academic results are finer-grained but worth reading: [arXiv 2609.28613](https://arxiv.org/abs/2609.28613) tested Jev on 510 reconstructed InjecAgent cases and concluded that typed output **changes** the risk without removing it — malicious content shifts action probabilities, though it rarely makes the model pick the attacker's target outright; but adaptive attacks that optimize against the returned score double the attacker's mean highest target probability, and success on fresh validation calls rises from 1.8% to 3.5%.

So the production recipe is this: **filter the input first, never let a decision output trigger an irreversible action directly, and keep an independent verification step for important decisions.** Our write-up of the HiddenLayer test and the [decisionkit CLI](/posts/daily/2026-10-12-tool-decisionkit) both say the same thing: the model only scores, and which decisions may auto-approve is a policy you define. Incidentally, the [three-layer split](/posts/tech/2026-10-22-ai-model-family-cloudflare) in the Cloudflare piece (extract → decide → generate) does keep the raw email away from the LLM, but that reduces the attack surface, it is not a defence.

## When not to use a decision model

- **Judgements that need knowledge or reasoning.** The leaderboards favour LLMs on both, by a margin to fifteen points.
- **When you need a written reason.** Decision models do not produce prose ([Celeris-1.1 Decision](https://celeris.ai/pricing) can attach a one-sentence explanation for free, but that's rare). To leave "why did it decide that" on an audit trail, you have to store the question, the options, the threshold, and the answer yourself.
- **Chinese content.** [Jev's own docs](https://docs.typesafe.ai/models) are clear: English is the primary training language, CJK works but not equally well, and you should test on your own content. The model cards for StartLux and mammoth-1 list only `en`; d1-3B's card lists 16 languages including Chinese, but that card describes the base model's language support, not a measurement of decision quality. English traffic and Chinese traffic are not the same problem.
- **High-risk actions executed automatically.** The Check Point and HiddenLayer results are right there; wiring a decision model's output straight into "charge the card," "approve the loan," or "delete the record" puts a model that can be persuaded on the critical path.
- **When the option count explodes.** Past 26 options StartLux's read starts grouping; past 255 Perplexity's API refuses outright.

## Selection cheat sheet

| Your situation | Start with |
|---|---|
| High volume, cheapest possible | Celeris-1.1 Decision ($0.004/1M, $14 per million tasks), Decider Flash v1.3 ($0.01/1M, $34), d1.2 ($0.02/1M, $63) |
| Highest score while staying cheap and fast | d1.2-ultra (DI 74.8, $133 per million tasks), Drex Max v1.1 (72.6, watch the launch price), SubQ Snap 1.2 (72.6, 384K long context) |
| Ship today without running GPUs | The above plus Gemini Decision 1, gpt-6-luna Decisions, Microsoft-Decision-1.1, Jev 1.14 |
| Input includes images, video, or audio | Gemini Decision 1 (text / images / audio / video / PDF), the d1.2 family (images + audio), d3 (images + video), clef-omni (images + video + audio) |
| The judgement itself is hard or needs knowledge | Gemini Decision 1 has the highest knowledge and reasoning scores among decision models, but still below Claude Haiku 5.5 (Max); if you really need knowledge, add retrieval or use an LLM |
| You'll set auto-approve thresholds on confidence | Check the "confidently wrong" column first: Decider v1.3 at 55.4% and Clef-Omni at 61.8% almost never say they don't know; d1.2-ultra at 12.4% and SubQ Snap 1.2 at 8.4% do, but with lower accuracy |
| Commercial license must be Apache or MIT | Decider v1.3 / Flash v1.3, d3, Strands Decider 2B, Clef; **StartLux is CC BY-NC**; GLiDE's and Drex's open weights use custom licenses; mammoth-1 / elephant-1 model cards say MIT but the repos have no LICENSE file; the d1-2B family uses the LFM Open License |
| Already on one vendor's System One | Switching is a change to `model`; OpenAI, Google, and Inception name fields differently, so wrap an adapter; aliases move with new versions, so pin version IDs |

Three things to do before going live: **measure calibration and the non-hallucination rate on your own data** (leaderboard scores reflect someone else's traffic); **set thresholds from the curve you measure, not a generic 0.9**, and hang them on `probabilities[choice]`, not `confidence`; and **keep human review on high-risk paths**, because what you have is a model that can be talked into things.

## Update history

- **2026-11-20**: The version matrix, leaderboards, capability boundary, cost, and selection now use November data (each vendor's official pricing and model pages, Google's Gemini Decisions API announcement, the Artificial Analysis Decision Index v2 announcement and v2.1 leaderboard page data, and the community Jev Decision Index 11-19 data snapshot, read 2026-11-20). Added Gemini Decision 1, Liquid d1.2 / d1.2-ultra, Nace.AI Drex, Subquadratic SubQ Snap, Perplexity Decider v1.3, Microsoft-Decision-1.1, Celeris-1.1 Decision, and the Liquid d1-2B family; Liquid d1-ultra, d1.1, and d1 are deprecated, and d1-3B is succeeded by the d1-2B family. The Artificial Analysis board moved from v1.0 (four evaluations, scored on accuracy) to v2.1 (six evaluations, scored on the Decision Score); the v1.0 score table, cost table, and "three buckets" calculation were removed and recalculated with v2.1 numbers, since v1.0 figures such as d1-ultra's leading 65.2 and Jev 1.14's 57.1 no longer map onto v2. Corrections: Jev 1.14 was described as text-only, but its docs now list text and images; `jev-latest` was said to point to 1.13 and now points to 1.14; GLiDE's weights were said to be unreleased but have been on HuggingFace since 10-19; the "one question per request" advice for Decider Flash applies only to v1.2.
- 2026-10-22: First version.

## References

- [Google: Gemini Decisions API (2026-11-11)](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [Artificial Analysis: Introducing the Decision Index v2 (2026-11-08)](https://artificialanalysis.ai/articles/decision-index-v2)
- [Perplexity Docs: Decisions API (Decider v1.3, pricing, locate questions)](https://docs.perplexity.ai/docs/decisions/quickstart)
- [Liquid AI: d1.2 (2026-11-16)](https://www.liquid.ai/blog/d1-2)
- [Liquid AI Docs: d1.2](https://docs.liquid.ai/lfm/models/d1)
- [Microsoft: Microsoft-Decision-1.1 GA (2026-11-17)](https://commandline.microsoft.com/microsoft-decision-model-ga/)
- [Nace.AI: Drex Max on the Decision Index](https://www.nace.ai/drex/decision-index)
- [Hugging Face: nace-ai/drex-v2.0](https://huggingface.co/nace-ai/drex-v2.0)
- [Subquadratic Docs: Models (SubQ Snap 1.2)](https://docs.subq.ai/using-the-api/models/)
- [Celeris Docs: Pricing (Celeris-1.1 Decision)](https://docs.celeris.ai/pricing)
- [Hugging Face: fastino/GLiDE-27B](https://huggingface.co/fastino/GLiDE-27B)
- [Hugging Face: LiquidAI/d1-2B](https://huggingface.co/LiquidAI/d1-2B)
- [Hugging Face: pplx-decider-flash-v1.3](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.3)
- This site: [Model card: Gemini Decision 1](/posts/daily/2026-11-13-model-google-gemini-decision-1-en)
- This site: [Liquid AI model family](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)
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
