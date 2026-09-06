---
title: "National-Team LLM Training: Apertus' Compliance Route and LLM-jp's Japanese Ecosystem"
date: 2026-09-06
category: ai
type: deep-dive
tags: [apertus, llm-jp, llm, open-source, pre-training, multilingual, training-data]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 7
tldr: "Switzerland's Apertus (8B/70B, 15T tokens, 1,000+ languages) filters opt-outs and personal data before training to satisfy the EU AI Act; Japan's LLM-jp consortium shipped LLM-jp-4 (12T tokens) in April 2026, claiming wins over GPT-4o and Qwen3-8B on standard benchmarks. Both prove that from-scratch training outside the English sphere is a data-governance problem, not a technical one — plus a note on RWKV-7 as the non-Transformer alternative."
description: "The 'Train an LLM From Scratch' series, order 7: Switzerland's Apertus and Japan's LLM-jp — national-scale from-scratch training, multilingual data curricula, compliance-driven data governance, and RWKV as an architecture contrast."
draft: false
---

> [中文版](/posts/ai/2026-09-06-national-multilingual-llm-training)

Every project in this series so far has shared one motivation: learning (MiniMind), data efficiency (YuLan-Mini), or research transparency (OLMo, LLM360). The two projects here have a different driver — **language sovereignty and regulatory compliance**. If your language is under 1% of English-sphere training data, waiting for an existing model to improve your language is unrealistic. If the EU AI Act binds you, you don't need the strongest model; you need one that can account for every training-data source.

## Apertus: fully open, built for compliance

On September 2, 2025, EPFL, ETH Zurich, and the Swiss National Supercomputing Centre (CSCS) released [Apertus](https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html) (Latin for "open") — two sizes, 8B and 70B, trained from scratch on the Alps supercomputer. 15 trillion tokens across 1,000+ languages, with 40% of training data non-English, including Swiss German and Romansh — languages nearly absent from general corpora. Weights and recipes are open, with full training details published ([paper](https://arxiv.org/pdf/2509.14233)).

Its difference from earlier series entries isn't architecture — it's **data governance**:

- **Filtering before training, not declaration after**: the corpus only takes publicly available data, and machine-readable opt-out requests from websites are honored before training — even retroactively, so a site that declares exclusion later is handled in new versions. Personal data and unwanted content are removed before training begins.
- **Regulatory alignment**: the whole pipeline is designed to meet Swiss data protection law and the EU AI Act's transparency requirements (Article 53(1)(d) requires GPAI models to publish training-content summaries). This makes Apertus the reference implementation of "compliant fully open," not just another open model.
- **Multilingual curriculum**: 1,811 natively supported languages, with low-resource language balancing as a core part of curriculum design rather than an afterthought.

On July 24, 2026, the team shipped [Apertus 1.5](https://ai.ethz.ch/news-and-events/ai-center-news/2026/07/apertus-15-building-the-next-generation-of-open-ai-infrastructure.html): image and audio understanding, better reasoning and instruction following, still Apache 2.0. Going from text-only to multimodal in ten months is itself an argument for the open-recipe route — improvements stack on top of a published training flow instead of restarting each time.

## LLM-jp: the Japanese approach

Japan's approach differs: not one university plus one supercomputer, but a **national consortium led by the research institute NII**. [LLM-jp](https://llm-jp.nii.ac.jp/en/home-en/) has shipped from-scratch pretrained Japanese model series continuously since September 2024, at a factory-like cadence:

- **March 2026, LLM-jp-3.1**: continued pretraining plus improved post-training on the 3 series, substantially boosting instruction following. The line now covers 8 dense sizes (150M, 440M, 980M, 1.8B, 3.7B, 7.2B, 13B, 172B) and 2 MoE models (8×1.8B, 8×13B).
- **April 2026, [LLM-jp-4](https://www.nii.ac.jp/en/news/release/2026/0403.html)**: 8B and 32B-A3B, on roughly 12 trillion tokens of high-quality corpus (public web data, government and Diet documents), ~65K context, officially claiming to surpass GPT-4o and Qwen3-8B on several standard benchmarks.

Two details matter. First, **the legal grade of the corpus**: LLM-jp-4's training data was collected and constructed to the Open Source AI Definition (OSAID) standard and is accessible to third parties — government documents and parliamentary records are differentiated strengths, a corpus structure commercial models struggle to obtain. Second, **the completeness of the size spectrum**: every rung from 150M to 172B gets a release, effectively publishing the capability curve of Japanese LLMs at every scale — the same spirit as K2's per-checkpoint gallery, on a different axis.

Both projects demonstrate the same lesson: outside the English sphere, the bottleneck for from-scratch training isn't technology (that's shared) — it's **corpus structure and governance decisions**. Apertus trades strict filtering for compliance; LLM-jp trades public corpora for quality and legitimacy. Different routes, but both reject the shortcut of machine-translating English data to fill quotas.

## Architecture contrast: RWKV's other road

The series intro admitted a gap: every case so far is a Transformer. The least you should know about the other road: [RWKV-7 (Goose)](https://wiki.rwkv.com/) — an RNN-style architecture with linear-complexity attention, constant memory at inference time, paper published March 2025, with community-trained open models at various scales for each version. It still trails same-size Transformers on performance, but the tradeoff — trained on 15T tokens, O(1) inference memory — is real for edge scenarios. Why it appears in this post: Apertus and LLM-jp prove multilingual data can be systematically acquired; architecture experiments (RWKV, the Mamba family) equally need open recipes to be community-verifiable.

## The takeaway

The previous post on [OLMo 3 and LLM360](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) showed the ceiling of transparency; these two projects show the same idea from the other side — **openness isn't just researcher-friendliness, it's a sovereignty strategy**. Apertus trades strict filtering for deployment legitimacy (Swisscom and the Public AI network adopt it directly); LLM-jp trades national collaboration for autonomy over the Japanese ecosystem (commercial models like [Rakuten AI 3.0](https://global.rakuten.com/corp/news/press/2026/0317_01.html) develop under the same GENIAC framework). For the series' original question — when should you train from scratch — this post adds a fourth answer: **when your requirement is sovereignty and compliance that open models can't give you**. For the decision-convergence post, see [When to Train an LLM From Scratch](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en); the next two posts add the efficiency route and the training framework.

## References

- [Apertus press release (ETH Zurich)](https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html)
- [Apertus paper (arXiv:2509.14233)](https://arxiv.org/pdf/2509.14233)
- [Apertus 1.5 release (ETH AI Center)](https://ai.ethz.ch/news-and-events/ai-center-news/2026/07/apertus-15-building-the-next-generation-of-open-ai-infrastructure.html)
- [swiss-ai/Apertus-70B (Hugging Face)](https://huggingface.co/swiss-ai/Apertus-70B-2509)
- [LLM-jp official site (NII)](https://llm-jp.nii.ac.jp/en/home-en/)
- [LLM-jp-4 release (NII press release)](https://www.nii.ac.jp/en/news/release/2026/0403.html)
- [LLM-jp-3.1 series release](https://llm-jp.nii.ac.jp/en/news/release-of-llm-jp-3-1-series-instruct4/)
- [RWKV Wiki (RWKV-7 Goose)](https://wiki.rwkv.com/)
- [Rakuten AI 3.0 (GENIAC framework)](https://global.rakuten.com/corp/news/press/2026/0317_01.html)