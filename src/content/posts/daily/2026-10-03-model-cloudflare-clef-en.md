---
title: "Model Card: Clef (Cloudflare)"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, model-release, daily, cloudflare, model-family-clef]
lang: en
description: "Cloudflare open-sources Clef and Clef-flash, decision models that score probabilities in a single forward pass instead of generating text — beating Typesafe's Jev on BFCL, BANKING77 and more, the third vendor to ship a 'decision model' in one week"
tldr: "Clef (27B, post-trained from Qwen3.8-27B) and Clef-flash (9B, post-trained from Qwen3.5-9B): 64K context window, image/video input support, Clef priced at $0.24/1M input tokens (Clef-flash $0.09, no separate output pricing); 98.5% on BFCL case-exact, 94.2% macro-F1 on BANKING77, 97.4% macro-F1 on CLINC150+OOS — all ahead of Typesafe's Jev. Architecturally it replaces token-by-token generation with a prefill-only scoring pass. It's the third 'decision model' to ship in a single week, after Typesafe Jev, OpenAI's Decisions API, and Amazon's Strands Decider 2B"
series:
  name: "AI Model Tracker"
  order: 38
glossary:
  - term: "Clef"
    def: "Cloudflare's open-source decision model family, post-trained on a Qwen backbone with a non-autoregressive architecture that scores probabilities for multiple typed questions in a single forward pass"
---

> 🌏 [中文版](/posts/daily/2026-10-03-model-cloudflare-clef)

## Model Details

| Item | Value |
|---|---|
| Model ID | `@cf/cloudflare/clef` (plus a lighter `@cf/cloudflare/clef-flash`) |
| Vendor | Cloudflare (Workers AI team) |
| Parameters | Clef: 27B (post-trained from Qwen/Qwen3.8-27B); Clef-flash: 9B (post-trained from Qwen/Qwen3.5-9B) |
| Context Window | 65,536 tokens |
| Input Pricing (USD/1M tokens) | Clef $0.24; Clef-flash $0.09 |
| Output Pricing (USD/1M tokens) | Not applicable — the model doesn't generate text, only per-option probabilities; Cloudflare publishes no separate output rate |
| Open Source | Yes (Apache-2.0, weights and inference code both public) |
| Release Date | 2026-10-01 |
| Official Announcement | [Cloudflare Blog: Introducing Clef](https://blog.cloudflare.com/clef-decision-models) |
| HuggingFace | [Cloudflare/clef](https://huggingface.co/Cloudflare/clef), [Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash) |
| Family | Clef (Cloudflare's first in-house ML model family) |

## Key Capabilities

- **Drops autoregressive generation entirely**: Clef runs a single prefill pass through a Qwen backbone, then a separate "joint schema head" scores every valid option in parallel — no intermediate text generation, no output parsing step
- **Native multimodal input**: accepts text, JSON, up to 4 images, and video — the main differentiator versus Jev (text-only). Cloudflare's own test case, domain threat classification via Browser Rendering, finished fetch + render + classify in 2.2 seconds, more than 2x faster than its own fastest general-purpose LLM, gpt-oss-120b (4.7 seconds, and only returning two categories)
- **Beats Jev on most classification benchmarks**: BANKING77 macro-F1 94.2% (Jev 79.7%), CLINC150+OOS macro-F1 97.4% (Jev 89.3%), home-appliance simulator case-exact accuracy 83.0% / Clef-flash 97.7% (Jev 52.3%)
- **Hosted on Cloudflare's edge GPUs**: deployed via Workers AI, which Cloudflare says keeps network latency low enough to put Clef in an agent's decision hot path, paired with another Workers AI-hosted LLM to actually take action

## Benchmark Results

| Benchmark | Clef | Clef-flash | Best competitor (Jev) |
|---|---|---|---|
| BFCL (case-exact accuracy) | 98.5% | **98.8%** | 95.8% |
| BANKING77 (macro-F1) | **94.2%** | 90.9% | 79.7% |
| CLINC150+OOS (macro-F1) | **97.4%** | 66.8% | 89.3% |
| ToolRet (nDCG@10) | **69.2** | 66.4 | 65.3 |
| Median latency (ms, lower is better) | 209.3 | **38.8** | 524.1 |

⚠️ All figures are from Cloudflare's own internal run of its Decision Index 0.2.1 suite; there's no independent third-party reproduction yet. On benchmarks that require deeper reasoning — GPQA Diamond, MMLU-Pro, BBH — Clef falls noticeably behind Jev (e.g. BBH: Clef 73.7% vs Jev 92.9%), suggesting Clef trades some general reasoning capability for classification speed and precision.

## Comparison to Prior / Competing Models

Clef is Cloudflare's first in-house ML model, so there's no predecessor to compare against — only its place in the new "decision model" category. Against the only competitor with public benchmarks, Typesafe's Jev, Clef leads decisively on classification-heavy tasks (BANKING77, CLINC150, the home-appliance simulator) but loses by double digits on tasks requiring deeper reasoning judgment (BBH, MMLU-Pro, GPQA Diamond). That split tracks back to backbone choice: Jev's architecture is undisclosed, while Clef is post-trained directly on top of Qwen3.8-27B / Qwen3.5-9B, inheriting Qwen's classification strengths along with its weaknesses on certain reasoning benchmarks.

On pricing, Clef ($0.24/1M input) costs nearly 6x more than Jev ($0.042/1M input), but Clef is open-weight while Jev remains API-only early access; Clef also adds image/video input, which Jev doesn't support yet.

The timing is notable: the same day Cloudflare announced Clef, Amazon shipped its own decision model, Strands Decider 2B, and OpenAI's Decisions API had gone into limited preview just two days earlier. Three major platform vendors shipping "decision models" within a single week suggests this has moved from one startup's (Typesafe's) proof of concept to a product category the incumbents now see as worth claiming.

## Implications for Agent Development

Clef positions itself as a routing layer inside an agent workflow, not a replacement for generative LLMs.

- If you're building agents on Cloudflare Workers: Clef is already native to Workers AI (`env.AI.run("@cf/cloudflare/clef", ...)`), no third-party integration needed, and the API is Jev/SystemOne-compatible so the two are drop-in swappable for testing
- If your agent needs to classify or route based on images or video (support-ticket attachments by priority, compliance screening of uploaded media): this is currently the only decision model that's open-weight, multimodal, and Jev-API-compatible at the same time — Jev can't do this yet
- If you're already using an LLM for plain-text classification (sentiment tagging, ticket routing, intent detection): BANKING77 and CLINC150 both show Clef clearly ahead of Jev in accuracy, and because it's open-weight you can fine-tune it yourself (Cloudflare's companion RL fine-tuning service) to match your own label taxonomy
- Not a fit: workflows that need deep multi-step reasoning to reach a judgment (legal causal analysis, complex financial-statement review) — the BBH/GPQA Diamond gap shows Clef's speed comes at the cost of deep reasoning ability. Also not a fit for teams already committed to the Jev ecosystem with no need for image input — on plain-text classification the two trade wins benchmark by benchmark, so the migration cost may not be worth it

## Today's Takeaway

Four vendors — Typesafe, OpenAI, Amazon, and Cloudflare — each shipped a "decision model" within the same week, but Clef's own benchmark numbers expose the shared trade-off in this category: classification scores go up across the board, while deep-reasoning scores go down across the board. The lesson is that evaluating a "decision model" can't stop at the classification accuracy a vendor highlights — you need to know which kind of judgment your agent workflow actually requires before picking the model that's strong at it.

## References

- [Cloudflare Blog: Introducing Clef: our open-source decision models, and new RL fine-tuning platform](https://blog.cloudflare.com/clef-decision-models)
- [HuggingFace: Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [HuggingFace: Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Cloudflare Workers AI docs: clef model page (pricing/parameters)](https://developers.cloudflare.com/workers-ai/models/clef)
- [Cloudflare Workers AI docs: clef-flash model page (pricing/parameters)](https://developers.cloudflare.com/workers-ai/models/clef-flash)
- [Clef Decision Index live benchmark demo](https://clef-evals.workers-ai-mle.workers.dev/)
- [flaviocopes.com: A deep dive into Clef, Cloudflare's decision model](https://flaviocopes.com/clef)
- [AI Weekly: Cloudflare Open-Sources Clef, Beats Jev Latency on Edge GPUs](https://aiweekly.co/alerts/cloudflare-open-sources-clef-beats-jev-latency-on-edge-gpus)
- [Our model card: Jev (TypeSafe AI)](/posts/daily/2026-09-19-model-typesafe-ai-jev) (zh-TW only)
