---
title: "Cloudflare Model Family: Choosing Clef Decision Models and Clairic Extraction Models"
date: 2026-10-22
category: tech
type: deep-dive
tags: [cloudflare, clef, clairic, clairic-flash, decision-model, extraction-model, model-family-clef, model-selection]
lang: en
tldr: "Cloudflare's own models come in two classes: the Clef family returns option probabilities (clef 27B, clef-flash 9B, clef-omni 30B-A3B), while the Clairic family returns typed values and intervals (clairic 27B, clairic-flash 9B). All five bill input tokens only ($0.038–$0.24 per million), and all ship Apache-2.0 open weights for self-hosting. On 2026-11-18 Clairic moved to a new architecture and split into two sizes; the 27B model carries a $0.10 promotional price until December 1. They beat Jev on decision benchmarks and trail it on reasoning-heavy ones."
description: "Cloudflare model family selection: the Clef, Clef-flash, Clef-omni, Clairic, and Clairic-flash matrix, pricing, self-hosting, the limits of Cloudflare's self-reported evaluations, and how to wire them into an agent."
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

> :globe: [中文版](/posts/tech/2026-10-22-ai-model-family-cloudflare)

Cloudflare's first in-house models fall into two classes: the **Clef family** (clef, clef-flash, clef-omni) returns a probability for every allowed option, and the **Clairic family** (clairic, clairic-flash) returns typed values and intervals. All five run on Workers AI, bill input tokens only, and publish Apache-2.0 weights on Hugging Face, but their modalities, context windows, and prices differ. If you want to put a cheap classification, routing, or extraction layer inside an agent, this is the selection and validation guide. Prices and versions follow the official docs as of 2026-11-23.

## Family positioning and model matrix

Cloudflare calls these "Cloudflare-trained models," meaning the Workers AI team post-trained them itself; on 2026-11-18 the team renamed itself the Workers AI superintelligence team. The dozens of third-party models on the platform are out of scope here.

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| `@cf/cloudflare/clef` | 27B decision model, accuracy first | 65,536 context; text, JSON, images, video frames; $0.24 per 1M input | Workers AI hosting; Apache-2.0 weights |
| `@cf/cloudflare/clef-flash` | 9B decision model, latency and cost first | Hosted context is only 24,576; $0.038 per 1M input; self-hosted weights trained to 256K | Same as above |
| `@cf/cloudflare/clef-omni` | 30B-A3B MoE decision model, multimodal | Adds native audio and video; 64,000 context; $0.15 per 1M input | Same as above |
| `@cf/cloudflare/clairic` | 27B extraction model, accuracy first | Returns values, spans, and uncertainty intervals; text, images, PDFs; 65,536 context; $0.24 per 1M input ($0.10 until 2026-12-01) | Workers AI hosting (labeled preview); Apache-2.0 weights |
| `@cf/cloudflare/clairic-flash` | 9B extraction model, latency and cost first | Same API and inputs; 65,536 context; $0.10 per 1M input | Workers AI hosting (labeled early research preview); Apache-2.0 weights |

Three things are easy to mix up. First, the Clef family keeps the Jev/System One `state` + `questions` API, while Clairic takes `state` + `fields`; they are not the same schema. Second, during the 2026-10-19 preview `@cf/cloudflare/clairic` was served by a 9B model; from 11-18 the same endpoint was swapped in place to the new 27B model, and the 9B moved to `clairic-flash`. Third, context and prices are a 2026-11-23 snapshot, and both Clef and Clairic changed pricing within two months of launch.

### Split by output class, then by size

- If you need to "pick one option from a list you provide" (classification, routing, review): use the Clef family. Pick clef-flash for latency, clef for accuracy or long context, and clef-omni when audio or video is involved.
- If you need to "turn input into values" (invoice fields, dates, estimates, time-series forecasts): use the Clairic family. Pick clairic for accuracy, clairic-flash for latency and cost.
- They compose: Cloudflare's own demo pipeline is Clairic extracts values → Clef decides → an LLM writes the reply. See "Agent integration and selection."

## Family evolution

| Date | Event | What it means for selection |
|---|---|---|
| 2026-10-01 | Clef and Clef-flash launch: Apache-2.0, hosted on Workers AI, Jev-compatible API; an RL fine-tuning service is announced the same day | A self-hostable decision model exists, and switching away from Jev is cheap |
| 2026-10-09 | Clef-omni arrives with audio and video; clef-flash gets cheaper but its hosted context shrinks; Clef moves to SGLang | The cheap option gets cheaper, but long inputs need clef or self-hosting |
| 2026-10-19 | Clairic preview: a new extraction-model class; the hosted endpoint ran a 9B single-forward-pass model at $0.10 per 1M input. Vendor tests: a 21-day TSA checkpoint forecast with 3.3% mean error; a three-layer pipeline at 19.3 seconds versus 61.7 seconds for all-GLM-5.3 | A new "extract values" layer is available, but it cannot be self-hosted |
| 2026-11-18 | Clairic redesigned (fields now use parallel autoregressive generation) and gains PDF input; split into 27B `clairic` and 9B `clairic-flash`, both with Apache-2.0 weights; 27B priced at $0.24, with a $0.10 promotion until 12-01 | Extraction models can now be self-hosted; the preview's single-pass architecture and evaluations become history, and the rest of this post covers the new version |

Cloudflare's own account of the Clef schedule is that the team decided to build a decision model on a Friday evening, trained over the weekend, and launched on Thursday; the omni version followed eight days later. This line is moving fast: within eight days clef-flash changed both its price and its context window, and within a month Clairic went from hosted preview to a new architecture, open weights, and two sizes. The upside is that neither line changed its API, so a model swap is a one-line change, so start with the cheap combination and revisit once the numbers settle.

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

### Clairic: typed fields, now with parallel autoregressive generation

Clairic does not use options; it uses field types: `text` (returns the source span and character offsets), `number`/`date`/`time`/`datetime`/`duration`, `boolean`, `enum`, `object`, `list`, `compute`, plus `estimate` and `forecast`.

- Base models: clairic is Qwen3.8-27B, clairic-flash is Qwen3.5-9B.
- The 2026-11-18 version no longer uses a single forward pass. Ordinary text and number fields use what Cloudflare calls parallel slot autoregressive generation: each field picks its next token from the tokens it has already written and stops at its own end marker, and all fields advance together in the serving batch. Estimates, forecasts, durations, calculated dates, and explicit arithmetic go to separately trained heads. Cloudflare says this bought extraction accuracy on text and images at a small latency cost.
- `estimate` returns a distribution: you supply `min`, `max`, and `step`, and it returns a median with an 80% interval (p10–p90); `forecast` returns a value and interval for each step of a time series.
- Every answer carries `confidence` and `p_null` (the probability that the value is not in the input); when nothing is found, it returns `null`. Text answers include source spans.
- Input can be text, up to four images, or PDFs; images and PDF pages together are capped at four, at 4 MiB per file and 8 MiB combined.
- Billing and passes: each `text` field runs its own pass, other fields share a pass, and anything that does not fit is split further. Every pass carries the full `state` and images, so those tokens are billed once per pass, and `usage.passes` reports the count. There is no cap on field count, but the more text fields you add, the closer the bill gets to "input length times number of text fields."
- During the preview Cloudflare said reading and one- or two-step calculations were reliable, while long chains of dependent calculation and cross-table aggregation were not. The new version adds arithmetic heads, but for these tasks the advice still holds: let Clairic produce values and check the arithmetic in code.

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

### Clairic (2026-11-18 release, vendor-run tests)

Cloudflare says there are no public extraction benchmarks yet; the table below is its internal evaluation, with two other extraction models as baselines (Liquid AI D1.2 paired with Apple Vision OCR, and Scaledown Extract). Numbers are correct fields over total fields:

| Eval set | Clairic preview | clairic | clairic-flash | D1.2 + OCR | Scaledown |
|---|---|---|---|---|---|
| Fresh text fields (96 requests) | 295/336 | 335/336 | 328/336 | 304/336 | 259/336 |
| Mixed-input fields (36 requests) | 207/226 | 221/226 | 213/226 | 116/226 | 156/226 |
| Tracked customer assertions (139 request shapes) | 1,033/1,263 | 1,263/1,263 | 1,263/1,263 | 973/1,263 | 653/1,263 |
| Synthetic receipt fields in text and images | 369/576 | 576/576 | 576/576 | 397/576 | 280/576 |

Latency was measured as the complete HTTP response from a self-hosted server, including every field in the request:

| Eval set | clairic p50 / p95 | clairic-flash p50 / p95 |
|---|---|---|
| Fresh text fields | 358 / 736 ms | 155 / 328 ms |
| Fresh image fields | 453 / 976 ms | 305 / 605 ms |
| Commercial leases | 691 / 803 ms | 379 / 519 ms |
| Loan pricing | 395 / 407 ms | 188 / 192 ms |
| Traffic forecasting | 532 / 585 ms | 243 / 261 ms |
| Expense audit | 632 / 742 ms | 393 / 512 ms |

Both tables are vendor-reported, and Cloudflare itself calls them directional. The preview's TSA forecast and three-layer pipeline experiments ran on the old 9B single-pass version; see Family evolution. Flash ties the 27B on two of the evals at about half the latency, which makes it a sensible first try.

### Third-party numbers

There is no independently rebuilt Decision Index yet, and no third-party evaluation of Clairic. The few non-vendor figures are community evaluations posted on Hugging Face model pages: clef-flash scores 0.71 accuracy and 0.11 Brier on typed-decisions. Their methods and coverage differ from Cloudflare's, so treat them as directional only.

## Licensing, pricing, and deployment

### Weights, hosting, and terms are separate decisions

- **Clef, Clef-flash, Clef-omni**: Apache-2.0 weights, published as standard safetensors plus loading code on Hugging Face. Self-hosting works through SGLang; Clef support landed in 0.5.22, and Cloudflare publishes H200/B200/B300 cookbooks.
- **Official test environment**: torch 2.11, transformers 5.10.2, and a single H200.
- **Clairic, Clairic-flash**: since 2026-11-18, Apache-2.0 weights on Hugging Face, with custom Transformers loading code and a `systemone` request helper; they need Python 3.11 or later and use `xgrammar` for schema constraints. The model cards list no hardware requirements.
- **Hosting terms**: both Clairic Workers AI pages are still labeled preview and carry a terms block that is blunt: AS IS, no guarantee of continued availability, and Cloudflare may discontinue it at any time without refund or compensation. Self-hosting the open weights sidesteps those hosting terms, but you own the operations.
- **Hosted endpoint**: Workers AI via `env.AI.run()` or REST. Billing is in Neurons on the backend, with 10,000 free Neurons per day; the pricing page converts that into a per-model price per million input tokens.

### Pricing (2026-11-23)

| Model | Price (USD per 1M input tokens) | Output | Notes |
|---|---|---|---|
| clef | $0.24 | Not billed | 65,536 context |
| clef-flash | $0.038 | Not billed | Cut from $0.09 on 2026-10-09; hosted context 24,576 |
| clef-omni | $0.15 | Not billed | Audio and video billed as converted tokens |
| clairic | $0.24 ($0.10 until 2026-12-01) | Not billed | Response reports `output_tokens` as 0; input billed per pass |
| clairic-flash | $0.10 | Not billed | Same as above |

The Clef family generates no output text; the new Clairic does generate tokens, but Cloudflare kept the input-only principle and absorbs the output cost. The bill varies with media, input length, and Clairic's pass count. Both lines have changed prices since launch, so check the pricing page before you commit; when the promotion ends on 2026-12-01, any workload still on clairic rather than clairic-flash pays 2.4 times the unit price.

### Two self-hosting gotchas

- Context: the official loading code defaults `max_length` to 16,384 tokens, not the 64k/24k shown on the hosted model pages. You have to raise it yourself, and clef-flash's 256k only exists when self-hosted.
- Hardware: Cloudflare has only tested and published cookbooks at the single-H200 level. Moving a 27B or 30B-A3B model into your own rack is not a download-and-run affair.

### Data policy and fine-tuning

Cloudflare promises not to read, store, or train on standard Workers AI requests and responses, unless you join the fine-tuning service. Fine-tuning is currently a forward-deployed-engineer-led engagement, with no date for self-serve. The described pipeline is: AI Gateway collects data, Workers AI generates rollouts, Containers act as the scoring sandbox, a Trainer updates the weights, and BYO Model deploys the result back to Workers AI.

## Agent integration and selection

### The three-layer split

Cloudflare's demo shape is: an extraction model turns unstructured input into values, a decision model picks the action, and an LLM handles the prose. In the support-claim example, Clairic pulls the order number, amount, and damage description; Clef picks "refund" or "repair" against policy; GLM-5.3 only receives the decision and the numbers it needs to write the reply.

There are two reasons for the split. Each step's input is cleaner than the last, and the LLM never sees the raw email, which reduces its prompt-injection surface. Do not treat that as a security guarantee, though. Our earlier write-up of HiddenLayer's tests shows decision models can be manipulated into the wrong action just the same. The same language model is still reading untrusted content ([the Jev test summary](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection-en)).

### Which one to use

| Situation | Start with | Watch out for |
|---|---|---|
| Text classification or routing with low latency | clef-flash | 24k context; notably lower accuracy than clef on some classification tasks |
| Highest accuracy or long context | clef | More than six times the price of flash |
| Decisions over audio or video | clef-omni | 2 fps video, 60-second cap; media billed as tokens |
| Turning unstructured input into values, cheap and fast first | clairic-flash | Ties the 27B on two vendor evals; about half the latency |
| Extraction accuracy first, complex documents | clairic | 2.4 times flash's price after 12-01; leave long calculations to code |
| Reasoning or explanations | None of these | GPQA/BBH trail; that is LLM work |

### Turning probabilities into thresholds

A decision model returns probabilities so you can write rules: route to a human when `confidence` falls below a threshold or `p_null` exceeds a set value. Our earlier [decisionkit](/posts/daily/2026-10-12-tool-decisionkit-en) write-up is a CLI example of that pattern (it currently targets the Decisions API and Jev); because the Clef API is Jev-compatible, the same threshold design carries over. The model only scores; which decisions may auto-approve is a policy you set.

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

- **Every evaluation is vendor-reported.** The Decision Index is Cloudflare's own harness, and the Jev numbers are Cloudflare's runs; there is no independent reproduction yet. Validate on your own data before launch.
- **The official latency numbers contradict each other.** In the same launch, the blog reports clef-omni at about 130 ms for text and about 1.5 seconds for a 21-second video, while the official changelog reports about 20 ms and about 300 ms. The two sources differ by four to six times, and neither publishes its measurement conditions. Budget for the slower figure, or measure it yourself.
- **The capability boundaries are explicit.** Deep-reasoning rows trail Jev by double digits, and clef-flash falls well below clef on some classification tasks. During the preview Cloudflare said Clairic could not yet handle long dependent calculations, cross-row aggregation, or long-horizon forecasting, and the new version publishes no evaluations for those cases; calibration holds only approximately, on the tested sets.
- **Clairic's hosted endpoints are still previews.** The weights are open, but the hosted pages say preview, the terms are AS IS, and within a month both the architecture and the model behind the endpoint changed. Have a fallback before putting it in a critical path, or self-host.
- **Work out Clairic's billing and long-input rules yourself.** Each text field runs its own pass and every pass bills the full input; the same docs page says in one place that the `state` is truncated when it exceeds the context and in another that input is never truncated and oversized requests are rejected. Control document length yourself and watch `usage.passes`.
- **The product line moves fast.** clef-flash took a price cut and a context cut within eight days; Clairic changed architecture, sizes, and pricing within a month. Good for cost, bad for a six-month plan; trust the official pages for current numbers.
- **Some information is undisclosed.** Clairic now discloses its sizes, base models, and architectural direction, but not its training data or recipe, and the Clef family describes its training data only as internally generated synthetic data with permutations. Token budgets and data scale are missing. Those gaps affect cost estimates and risk assessment.

## Update history

- 2026-11-23: Added the 2026-11-18 Clairic release: the architecture moved from a single forward pass to parallel autoregressive generation and gained PDF input, the line split into 27B `clairic` and 9B `clairic-flash`, both with Apache-2.0 weights, and the 27B price became $0.24 ($0.10 promotion until 12-01). Corrected statements that no longer held: the tldr and matrix saying Clairic was still a hosted preview with no open weights, and the field-splitting and "field count barely changes cost" billing description (the new docs run one pass per text field and bill every pass). The preview Clairic is now a historical generation; its TSA and three-layer pipeline experiments moved to Family evolution, and evaluation now uses the new vendor-reported tables. Clef family specs and prices are unchanged. English daily-card links now point to the English versions.

## References

- [Cloudflare Blog: Introducing Clef (2026-10-01)](https://blog.cloudflare.com/clef-decision-models)
- [Cloudflare Changelog: Clef and Clef-flash on Workers AI (2026-10-01)](https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/)
- [Cloudflare Blog: Clef-omni, a faster Clef, and a cheaper Clef-flash (2026-10-09)](https://blog.cloudflare.com/clef-faster-cheaper-multimodal/)
- [Cloudflare Changelog: Clef-omni joins Workers AI (2026-10-09)](https://developers.cloudflare.com/changelog/post/2026-10-09-clef-omni-workers-ai/)
- [Cloudflare Blog: Introducing Clairic (2026-10-19)](https://blog.cloudflare.com/clairic-extraction-model/)
- [Workers AI docs: clef model page](https://developers.cloudflare.com/workers-ai/models/clef/)
- [Workers AI docs: clef-flash model page](https://developers.cloudflare.com/workers-ai/models/clef-flash/)
- [Workers AI docs: clef-omni model page](https://developers.cloudflare.com/workers-ai/models/clef-omni/)
- [Cloudflare Blog: Clairic and Clairic-flash go open-weight (2026-11-18)](https://blog.cloudflare.com/open-clairic)
- [Workers AI docs: clairic model page](https://developers.cloudflare.com/workers-ai/models/clairic/)
- [Workers AI docs: clairic-flash model page](https://developers.cloudflare.com/workers-ai/models/clairic-flash/)
- [Workers AI docs: Extraction models concept page](https://developers.cloudflare.com/workers-ai/concepts/extraction-models/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Hugging Face: Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [Hugging Face: Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Hugging Face: Cloudflare/clef-omni](https://huggingface.co/Cloudflare/clef-omni)
- [Hugging Face: Cloudflare/clairic](https://huggingface.co/Cloudflare/clairic)
- [Hugging Face: Cloudflare/clairic-flash](https://huggingface.co/Cloudflare/clairic-flash)
- [Clef Decision Index demo site](https://clef-evals.workers-ai-mle.workers.dev/)
- [Typesafe Evals](https://evals.typesafe.ai/)
- [Model card: Jev (TypeSafe AI)](/posts/daily/2026-09-19-model-typesafe-ai-jev-en)
- [Model card: Clef (Cloudflare)](/posts/daily/2026-10-03-model-cloudflare-clef-en)
