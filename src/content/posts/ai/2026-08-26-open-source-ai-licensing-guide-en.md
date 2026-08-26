---
title: "Open-Source AI Licensing Guide: What MIT, Apache 2.0, and Llama License Actually Allow"
date: 2026-08-26
category: ai
type: deep-dive
tags: [open-source, mit, licensing, llama, qwen, gemma, code-model]
lang: en
tldr: "'Open-source' in AI doesn't mean what it means in software. MIT and Apache 2.0 let you do almost anything; the Llama License requires a separate deal above 700M MAU; old Gemma terms let Google change rules unilaterally (Gemma 4 switched to Apache 2.0). This guide maps what you can and can't do by license type."
description: "A practical guide to AI model licensing: differences between MIT, Apache 2.0, Llama Community License, and Gemma terms, plus why OSI's formal 'open-source AI' definition excludes most models."
draft: false
glossary:
  - term: "OSI"
    def: "Open Source Initiative — the nonprofit that defines open-source software standards; published OSAID 1.0 in October 2024 defining open-source AI"
  - term: "MAU"
    def: "Monthly Active Users — the Llama License uses 700M MAU as the threshold for free commercial use"
---

> 🌏 [中文版](/posts/ai/2026-08-26-open-source-ai-licensing-guide)

When an AI model calls itself "open-source," it might mean MIT-licensed do-whatever-you-want, or it might mean "weights are public but you need a separate deal above 700 million users." The gap between those two is bigger than "free" versus "paid." This guide maps the actual differences across major 2026 AI model licenses so you know where you stand before deploying.

## The Licensing Spectrum: From Fully Open to API-Only

Not all "open" is created equal. Ordered by restriction level:

| Type | Examples | What You Can Do |
|---|---|---|
| **Fully open-source** | MIT / Apache 2.0 | Commercial use, modify, redistribute, almost no restrictions |
| **Restricted open** | Llama Community License | Commercial use OK, but need separate deal above 700M MAU |
| **Open-weight** | Weights public but custom terms | Download and run, but terms may change |
| **API-only** | Claude, GPT (API) | Call via API only, no access to weights |

## License-by-License Breakdown

### MIT (Ornith, DeepSeek)

The most permissive license. You can use commercially, modify, redistribute, embed in products, and use outputs to train your own models. The only requirement: keep the copyright notice.

[Ornith 1.5](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) and DeepSeek both use MIT. For deployers, MIT means "you don't need a lawyer."

### Apache 2.0 (Qwen, Gemma 4, NousCoder)

Same permissiveness as MIT, plus a **patent grant**: contributors automatically grant you the right to use related patents. If someone sues you for patent infringement from using their model, Apache 2.0 automatically revokes that person's license.

Key update: [Gemma 4 switched from a custom license to Apache 2.0 in April 2026](https://arstechnica.com/ai/2026/04/google-announces-gemma-4-open-ai-models-switches-to-apache-2-0-license). The old Gemma 3 terms let Google unilaterally modify the license and required developers to enforce Google's prohibited-use policy downstream — widely criticized as "looks open but isn't." Gemma 4's switch acknowledges the problem.

[Qwen](https://huggingface.co/Qwen) (Alibaba) mainline models are also Apache 2.0. [NousCoder-14B](/posts/tech/2026-08-26-nous-research-hermes), built on Qwen3-14B, inherits Apache 2.0.

### Llama Community License (Llama 4)

Meta's Llama license looks permissive but has three key restrictions:

1. **700M MAU threshold**: If your products or services (including affiliates) exceed 700 million monthly active users, you must request a separate license from Meta — and Meta can approve or deny at its sole discretion. Per the [Llama 4 Community License](https://developer.meta.com/ai/llama4/license): "Meta may grant to you in its sole discretion"
2. **Branding requirements**: Must prominently display "Built with Llama" on interfaces and docs; models built with Llama must start their name with "Llama"
3. **Acceptable Use Policy (AUP)**: Meta maintains a separate prohibited-use list you must follow

For most companies (MAU well below 700M), the Llama License is functionally similar to MIT. But if you're a large platform, or if your product gets acquired by one, this clause becomes a problem.

[Nous Research's Hermes 4](/posts/tech/2026-08-26-nous-research-hermes) is built on Llama 3.1 and inherits this license. This means: **your model's license depends on its base model.**

### Custom Licenses (Old Gemma, Various Models)

The most dangerous type. Common traps:

- Publisher can **unilaterally modify terms** (old Gemma)
- **Downstream enforcement obligations**: you must make your users comply with the original terms
- Using model outputs to train other models may be prohibited
- "Non-commercial" variants (some FLUX models, certain research-only models)

## OSI's Definition: Most "Open-Source AI" Isn't Open-Source

The Open Source Initiative published [OSAID 1.0](https://opensource.org/ai/open-source-ai-definition) in October 2024, formally defining "open-source AI." Meeting this definition requires more than publishing weights:

1. **Sufficient training data information** — not the full dataset, but enough to understand and reproduce
2. **Complete training and inference code** — including data processing, training parameters, validation code
3. **Model parameters** — weights must be released under an OSI-approved license

By this standard, **most self-described "open-source" AI models don't qualify**. Ornith, DeepSeek, and Qwen publish weights and inference code, but not complete training data information.

The only family approaching the OSI definition is **OLMo** (Allen AI) — training data, code, and checkpoints all public. But it also shows how strict the standard is: very few teams are willing to go this far.

## Practical Scenario Quick Reference

| Can I... | MIT | Apache 2.0 | Llama License | Custom |
|---|---|---|---|---|
| Embed in commercial product | ✅ | ✅ | ✅ (<700M MAU) | ⚠️ Check terms |
| Fine-tune and redistribute | ✅ | ✅ | ✅ (must brand as Llama) | ⚠️ Check terms |
| Use outputs to train my own model | ✅ | ✅ | ⚠️ Disputed | ❌ Often prohibited |
| Self-host for my company | ✅ | ✅ | ✅ | ✅ (usually) |
| Skip attribution | ❌ Keep copyright | ❌ Keep copyright | ❌ Must show "Built with Llama" | ⚠️ Check terms |

## Pre-Deployment Checklist

1. **Read the LICENSE file**, not the README — READMEs often simplify
2. **Check the base model's license** — fine-tuned models inherit base model restrictions
3. **Watch for "non-commercial" variants** — the same model family may have both commercial and non-commercial versions
4. **Beware dual-licensing traps** — some models have separate academic and commercial licenses
5. **Verify export controls** — models from certain jurisdictions may have export restrictions

## The Bottom Line

The 2026 trend is toward more permissive licensing: Gemma 4 switched from custom terms to Apache 2.0, DeepSeek and Ornith use MIT. But Llama's 700M MAU threshold and branding requirements persist, and custom-licensed models haven't disappeared.

The safest approach: **spend 10 minutes reading the LICENSE file before deploying.** It's cheaper than getting sued afterward.

## References

- [OSAID 1.0 — Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition)
- [Llama 4 Community License Agreement](https://developer.meta.com/ai/llama4/license)
- [Gemma 4 Switches to Apache 2.0 — Ars Technica](https://arstechnica.com/ai/2026/04/google-announces-gemma-4-open-ai-models-switches-to-apache-2-0-license)
- [Gemma Terms of Use (Old)](https://ai.google.dev/gemma/terms)
- [What Is Open Source AI? A Practical 2026 Guide — Moesif](https://www.moesif.com/blog/technical/api-development/Open-Source-AI)
- [Llama License 700M MAU Limit Analysis — WCR.LEGAL](https://wcr.legal/llama-3-license-700m-mau-limit)
- [Ornith Model Family](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) (in Chinese)
- [Nous Research and Hermes](/posts/tech/2026-08-26-nous-research-hermes) (in Chinese)
- [MiniMax Model Family](/posts/tech/2026-08-26-minimax-model-family) (in Chinese)
