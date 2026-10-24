---
title: "Cloudflare Model Family: Choosing Clef Decision Models and Clairic Extraction Models"
date: 2026-10-22
category: tech
type: deep-dive
tags: [cloudflare, clef, clairic, decision-model, extraction-model, model-family-clef, model-selection]
lang: en
tldr: "Cloudflare's own models come in two classes: the Clef family returns option probabilities (clef 27B, clef-flash 9B, clef-omni 30B-A3B), while Clairic returns typed values and intervals. All four bill input tokens only ($0.038–$0.24 per million) and charge nothing for output; the three Clef models ship Apache-2.0 weights, and Clairic is still a hosted preview. They beat Jev on decision benchmarks and trail it on reasoning-heavy ones."
description: "Cloudflare model family selection: the Clef, Clef-flash, Clef-omni, and Clairic matrix, pricing, self-hosting, the limits of Cloudflare's self-reported evaluations, and how to wire them into an agent."
draft: false
series:
  name: "AI Model Families"
  order: 32
glossary:
  - term: "System One model"
    def: "The model class TypeSafe AI introduced with Jev, borrowing Kahneman's System 1 framing: a single forward pass, no text generation, outputs probabilities or typed values."
  - term: "Decision model"
    def: "Takes a state plus a set of typed questions and returns a probability distribution over every allowed option; the Clef family belongs here."
  - term: "Extraction model"
    def: "Takes a state plus a set of field definitions and returns values, source spans, and uncertainty intervals; Clairic belongs here."
---

> 🌏 [中文版](/posts/tech/2026-10-22-ai-model-family-cloudflare)

Cloudflare's first in-house models fall into two classes: the **Clef family** (clef, clef-flash, clef-omni) returns a probability for every allowed option, and **Clairic** returns typed values and intervals. All four run on Workers AI and bill input tokens only, but their modalities, context windows, and open-weight status differ. If you want to put a cheap classification, routing, or extraction layer inside an agent, this is the selection and validation guide. Prices and versions are as verified on 2026-10-22.

## Family positioning and model matrix

Cloudflare calls these "Cloudflare-trained models," meaning the Workers AI team post-trained them itself; the dozens of third-party models on the platform are out of scope here.

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| `@cf/cloudflare/clef` | 27B decision model, accuracy first | 65,536 context; text, JSON, images, video frames; $0.24 per 1M input | Workers AI hosting; Apache-2.0 weights |
| `@cf/cloudflare/clef-flash` | 9B decision model, latency and cost first | Hosted context is only 24,576; $0.038 per 1M input; self-hosted weights trained to 256K | Same as above |
| `@cf/cloudflare/clef-omni` | 30B-A3B MoE decision model, multimodal | Adds native audio and video; 64,000 context; $0.15 per 1M input | Same as above |
| `@cf/cloudflare/clairic` | Extraction model (preview) | Returns values, spans, and uncertainty intervals; 65,536 context; $0.10 per 1M input | Workers AI hosting only; weights not open yet |

Two things are easy to mix up. First, the Clef family keeps the Jev/System One `state` + `questions` API, while Clairic takes `state` + `fields`; they are not the same schema. Second, context and prices are a snapshot from the check date, and this family changed its pricing once within eight days.

### Split by output class, then by size

- If you need to "pick one option from a list you provide" (classification, routing, review): use the Clef family. Pick clef-flash for latency, clef for accuracy or long context, and clef-omni when audio or video is involved.
- If you need to "turn input into values" (invoice fields, dates, estimates, time-series forecasts): use Clairic.
- They compose: Cloudflare's own demo pipeline is Clairic extracts values → Clef decides → an LLM writes the reply. See "Agent integration and selection."

## Family evolution

| Date | Event | What it means for selection |
|---|---|---|
| 2026-10-01 | Clef and Clef-flash launch: Apache-2.0, hosted on Workers AI, Jev-compatible API; an RL fine-tuning service is announced the same day | A self-hostable decision model exists, and switching away from Jev is cheap |
| 2026-10-09 | Clef-omni arrives with audio and video; clef-flash gets cheaper but its hosted context shrinks; Clef moves to SGLang | The cheap option gets cheaper, but long inputs need clef or self-hosting |
| 2026-10-19 | Clairic preview: a new extraction-model class, hosted endpoint only | A new "extract values" layer is available, but it cannot be self-hosted |

Cloudflare's own account of the Clef schedule is that the team decided to build a decision model on a Friday evening, trained over the weekend, and launched on Thursday; the omni version followed eight days later. This line is moving fast: within eight days clef-flash changed both its price and its context window. The upside is that API compatibility makes a model swap a one-line change, so start with the cheap combination and revisit once the numbers settle.

## Architecture and training trade-offs

### Shared design: one forward pass, probabilities only

The Clef family is not an autoregressive LLM. Cloudflare freezes a Qwen backbone, trains LoRA adapters plus a joint schema head, and at inference runs a single prefill before scoring every allowed option in parallel. There is no token-by-token generation and no output parsing step.

- Backbone:
  - clef: Qwen3.8-27B.
  - clef-flash: Qwen3.5-9B.
  - clef-omni: the comprehension backbone of Qwen3-Omni-30B-A3B. The text-to-speech parts are dropped, but the Hugging Face repo still contains those unused weights.
- Training objective: label-smoothed cross-entropy plus Brier calibration. RLCD (Reinforcement Learning for Calibrated Decisions) is a secondary objective that gives partial credit to adjacent ordinal options.
- Purpose: honest probabilities. A decision marked 0.9 should roughly mean nine times out of ten.

There are three costs.

- The output is locked to the schema you supply, so the model never returns an answer you did not list.
- You get probabilities, not an explanation of why.
- Deep reasoning is not its job. The reasoning rows of the Decision Index (next section) trail Jev by a wide margin.

### Multimodal input and how it is billed

- clef and clef-flash: text, JSON, images (up to 4), and arrays of video frames.
- clef-omni: adds native audio (wav/mp3, up to 4 clips) and video (mp4/webm, up to 2 clips sampled at 2 fps). A video's soundtrack enters the model alongside its frames.

Media is converted into input tokens.

- Images cost (width/32) × (height/32) tokens, capped at 1,024 tokens each.
- Audio runs about 780 tokens per minute.
- Video costs up to roughly 15,400 tokens per minute, plus about 780 per minute when it has sound.

Media tokens count against the context window: when space runs out, the `state` text is truncated, while media that exceeds the window on its own fails the request.

### Clairic: a regression problem bounded by your schema

Clairic does not use options; it uses field types: `text` (returns the source span and character offsets), `number`/`date`/`time`/`datetime`/`duration`, `list`, plus `estimate` and `forecast`.

- `estimate` returns a distribution: you supply `min`, `max`, and `step`, and it returns a median with an 80% interval (p10–p90).
- `forecast` returns a value and interval for each step of a time series, with a horizon of up to 64 steps.
- Every answer carries `confidence` and `p_null` (the probability that the value is not in the input); when nothing is found, it returns `null`.
- There is no upper limit on field count. Fields that do not fit in a single 8,192-token pass are split across parallel passes that each see the full input and are then merged. Cloudflare describes this as asking 30 fields costing roughly the same as asking 3.
- Cloudflare admits a limit: reading and one- or two-step calculations are reliable, while long chains of dependent calculation and cross-table aggregation are not. The recommendation is to let Clairic produce values and leave arithmetic to code.

## Evaluation and alternatives

All three groups below are numbers Cloudflare ran itself, with no third-party reproduction. The harnesses and datasets differ, so do not sum across tables.

### Cloudflare's own Decision Index 0.2.1 run

| Benchmark (higher is better) | clef | clef-flash | clef-omni | Jev |
|---|---|---|---|---|
| BFCL (case exact) | 98.5 | 98.8 | 98.2 | 95.8 |
| API-Bank (accuracy) | 91.9 | 93.1 | 92.7 | 88.2 |
| BANKING77 (macro-F1) | 94.2 | 90.9 | 94.8 | 79.7 |
| CLINC150+OOS (macro-F1) | 97.4 | 66.8 | 97.7 | 89.3 |
| When2Call (accuracy) | 72.4 | 65.6 | 63.3 | 81.0 |
| Amazon ESCI (macro-F1) | 57.5 | 57.4 | 57.8 | 55.2 |

The Jev column is Cloudflare's run, not TypeSafe's self-report.

| Latency (same self-run) | clef | clef-flash | Jev |
|---|---|---|---|
| median | 209.3 ms | 38.8 ms | 524.1 ms |
| p95 | 238.6 ms | 122.4 ms | 536.0 ms |

The direction flips completely on the reasoning rows:

| Reasoning benchmark | clef | clef-flash | Jev |
|---|---|---|---|
| GPQA Diamond | 48.0 | 51.0 | 78.3 |
| BBH | 73.7 | 68.9 | 92.9 |
| MMLU-Pro | 65.9 | 65.3 | 82.7 |

What the Clef family buys you is speed and calibration on classification and tool selection, not reasoning. The gap inside the family is worth noting too: CLINC150+OOS is 97.4 for clef against 66.8 for clef-flash, so flash's lower price also shows up as lower accuracy on some tasks.

### Workflow evals (Typesafe Evals)

| Workflow (exact actions unless noted) | clef | clef-flash | clef-omni | Jev |
|---|---|---|---|---|
| Invoice processing | 64.7 | 57.1 | 60.2 | 61.8 |
| Customer service | 76.3 | 77.0 | 71.6 | 76.0 |
| Security incidents | 62.9 | 61.7 | 61.7 | 61.7 |
| Agent trace observability (primary action) | 68.5 | 69.8 | 65.8 | 71.6 |

Cloudflare ran these on the evals TypeSafe publishes; they are not TypeSafe's results for Clef. Jev still leads the agent trace observability row.

### Clairic (preview, two vendor-run tests)

- TSA airport checkpoint volume: a rolling 21-day forecast made each morning, with 3.3% mean error.
- 17 of the 21 days landed inside its own 80% interval; the misses clustered around the Columbus Day weekend, a holiday the model could not see.
- A three-layer pipeline versus running everything on GLM-5.3: 19.3 seconds versus 61.7 seconds end to end.
- The cost was $6,032 versus $11,740 per million claims. Cloudflare says the all-LLM version got the facts and the decision right; the difference was that Clairic's estimate was identical every time while GLM's varied.

Both are single experiments reported by the vendor. Clairic's weights are not public, so nobody outside Cloudflare can reproduce them.

### Third-party numbers

As of the check date there is no independently rebuilt Decision Index. The few non-vendor figures are community evaluations posted on Hugging Face model pages: clef-flash scores 0.71 accuracy and 0.11 Brier on typed-decisions. Their methods and coverage differ from Cloudflare's, so treat them as directional only.

## Licensing, pricing, and deployment

### Weights, hosting, and terms are separate decisions

- **Clef, Clef-flash, Clef-omni**: Apache-2.0 weights, published as standard safetensors plus loading code on Hugging Face. Self-hosting works through SGLang; Clef support landed in 0.5.22, and Cloudflare publishes H200/B200/B300 cookbooks.
- **Official test environment**: torch 2.11, transformers 5.10.2, and a single H200.
- **Clairic**: hosted preview only, no weights. The docs spell out the terms: AS IS, no guarantee of continued availability, and Cloudflare may discontinue it at any time without refund or compensation.
- **Hosted endpoint**: Workers AI via `env.AI.run()` or REST. Billing is in Neurons on the backend, with 10,000 free Neurons per day; the pricing page converts that into a per-model price per million input tokens.

### Pricing (checked 2026-10-22)

| Model | Price (USD per 1M input tokens) | Output | Notes |
|---|---|---|---|
| clef | $0.24 | Not billed | 65,536 context |
| clef-flash | $0.038 | Not billed | Cut from $0.09 on 2026-10-09; hosted context 24,576 |
| clef-omni | $0.15 | Not billed | Audio and video billed as converted tokens |
| clairic | $0.10 | Not billed | Response reports `output_tokens` as 0 |

None of the four generates output text, so there is no output charge; the bill varies with media and input length. The price changed once within eight days, so check the pricing page before you commit.

### Two self-hosting gotchas

- Context: the official loading code defaults `max_length` to 16,384 tokens, not the 64k/24k shown on the hosted model pages. You have to raise it yourself, and clef-flash's 256k only exists when self-hosted.
- Hardware: Cloudflare has only tested and published cookbooks at the single-H200 level. Moving a 27B or 30B-A3B model into your own rack is not a download-and-run affair.

### Data policy and fine-tuning

Cloudflare promises not to read, store, or train on standard Workers AI requests and responses, unless you join the fine-tuning service. Fine-tuning is currently a forward-deployed-engineer-led engagement, with no date for self-serve. The described pipeline is: AI Gateway collects data, Workers AI generates rollouts, Containers act as the scoring sandbox, a Trainer updates the weights, and BYO Model deploys the result back to Workers AI.

## Agent integration and selection

### The three-layer split

Cloudflare's demo shape is: an extraction model turns unstructured input into values, a decision model picks the action, and an LLM handles the prose. In the support-claim example, Clairic pulls the order number, amount, and damage description; Clef picks "refund" or "repair" against policy; GLM-5.3 only receives the decision and the numbers it needs to write the reply.

There are two reasons for the split. Each step's input is cleaner than the last, and the LLM never sees the raw email, which reduces its prompt-injection surface. Do not treat that as a security guarantee, though. Our earlier write-up of HiddenLayer's tests shows decision models can be manipulated into the wrong action just the same. The same language model is still reading untrusted content ([the Jev test summary](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)).

### Which one to use

| Situation | Start with | Watch out for |
|---|---|---|
| Text classification or routing with low latency | clef-flash | 24k context; notably lower accuracy than clef on some classification tasks |
| Highest accuracy or long context | clef | More than six times the price of flash |
| Decisions over audio or video | clef-omni | 2 fps video, 60-second cap; media billed as tokens |
| Turning unstructured input into values | clairic | Preview; arithmetic and calibration limits covered in "Evaluation and alternatives" |
| Reasoning or explanations | None of these | GPQA/BBH trail; that is LLM work |

### Turning probabilities into thresholds

A decision model returns probabilities so you can write rules: route to a human when `confidence` falls below a threshold or `p_null` exceeds a set value. Our earlier [decisionkit](/posts/daily/2026-10-12-tool-decisionkit) write-up is a CLI example of that pattern (it currently targets the Decisions API and Jev); because the Clef API is Jev-compatible, the same threshold design carries over. The model only scores; which decisions may auto-approve is a policy you set.

### The minimum validation before launch

Sample 100 to 200 entries from your own logs that already have human answers, and lay out the options in your schema.

Beyond top-1 accuracy, bucket by `confidence` and check the actual hit rate in the 0.9 bucket. Calibration is Cloudflare's headline claim, but it only holds on the data they tested.

Then measure latency yourself. The official pages disagree on the numbers (see the next section), and your own region and concurrency determine your p95.

### What a request looks like

Below is the Clef family request format from the official docs; this post did not deploy it.

```json
{
  "model": "clef-flash",
  "state": "Customer email: ...",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should handle this email?",
      "criteria": { "billing": "Invoices and refunds", "technical": "Outages and configuration" }
    },
    "urgent": { "type": "noul", "instructions": "Does this need handling today?" }
  }
}
```

Responses are grouped by question id: `choice` returns the chosen option, its `confidence`, and a probability per option; `noul` returns a probability; `score` returns an expected score with a legend. A single request can carry up to 64 questions.

## Limitations and trade-offs

- **Every evaluation is vendor-reported.** The Decision Index is Cloudflare's own harness, and the Jev numbers are Cloudflare's runs; as of the check date there is no independent reproduction. Validate on your own data before launch.
- **The official latency numbers contradict each other.** In the same launch, the blog reports clef-omni at about 130 ms for text and about 1.5 seconds for a 21-second video, while the official changelog reports about 20 ms and about 300 ms. The two sources differ by four to six times, and neither publishes its measurement conditions. Budget for the slower figure, or measure it yourself.
- **The capability boundaries are explicit.** Deep-reasoning rows trail Jev by double digits, and clef-flash falls well below clef on some classification tasks. Cloudflare itself says Clairic cannot yet handle long dependent calculations, cross-row aggregation, or long-horizon forecasting; calibration holds only approximately, on the tested sets.
- **Clairic is a preview.** No weights, AS IS terms, and it can change at any time. Have a fallback before putting it in a critical path.
- **The product line moves fast.** Within eight days there was one price cut and one context cut. Good for cost, bad for a six-month plan; trust the official pages for current numbers.
- **Some information is undisclosed.** Clairic's parameter count, architecture, and training data are not published, and the Clef family describes its training data only as internally generated synthetic data with permutations. Token budgets and data scale are missing. Those gaps affect cost estimates and risk assessment.

## References

- [Cloudflare Blog: Introducing Clef (2026-10-01)](https://blog.cloudflare.com/clef-decision-models)
- [Cloudflare Changelog: Clef and Clef-flash on Workers AI (2026-10-01)](https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/)
- [Cloudflare Blog: Clef-omni, a faster Clef, and a cheaper Clef-flash (2026-10-09)](https://blog.cloudflare.com/clef-faster-cheaper-multimodal/)
- [Cloudflare Changelog: Clef-omni joins Workers AI (2026-10-09)](https://developers.cloudflare.com/changelog/post/2026-10-09-clef-omni-workers-ai/)
- [Cloudflare Blog: Introducing Clairic (2026-10-19)](https://blog.cloudflare.com/clairic-extraction-model/)
- [Workers AI docs: clef model page](https://developers.cloudflare.com/workers-ai/models/clef/)
- [Workers AI docs: clef-flash model page](https://developers.cloudflare.com/workers-ai/models/clef-flash/)
- [Workers AI docs: clef-omni model page](https://developers.cloudflare.com/workers-ai/models/clef-omni/)
- [Workers AI docs: clairic model page](https://developers.cloudflare.com/workers-ai/models/clairic/)
- [Workers AI docs: Extraction models concept page](https://developers.cloudflare.com/workers-ai/concepts/extraction-models/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Hugging Face: Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [Hugging Face: Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Hugging Face: Cloudflare/clef-omni](https://huggingface.co/Cloudflare/clef-omni)
- [Clef Decision Index demo site](https://clef-evals.workers-ai-mle.workers.dev/)
- [Typesafe Evals](https://evals.typesafe.ai/)
- [Model card: Jev (TypeSafe AI)](/posts/daily/2026-09-19-model-typesafe-ai-jev)
- [Model card: Clef (Cloudflare)](/posts/daily/2026-10-03-model-cloudflare-clef)
