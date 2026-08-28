---
title: "Model Card｜GLM-5.3-Flash"
date: 2026-08-28
category: daily
tags: [ai-agent, model-release, daily, zhipu, model-family-glm]
lang: en
description: "Z.ai reveals that the anonymous model that ran free for a week as 'Ox Alpha' is GLM-5.3-Flash — the GLM-5 series' first natively multimodal model, 320B total parameters with only 18B active, MIT-licensed open weights, priced at roughly a ninth of its own GLM-5.3"
tldr: "GLM-5.3-Flash: 320B total / 18B active parameters (MoE), 1M context / 131K max output, natively accepts text + image + video input, MIT-licensed weights on HuggingFace; standard pricing $0.15 input / $0.50 output per 1M tokens (50% launch discount to $0.075/$0.25 through Sept 9), roughly 90% cheaper than sibling model GLM-5.3; Terminal-Bench 2.1 hits 84.3 (just behind Opus 4.8's 85.0), DeepSWE 1.1 jumps from GLM-5.2's 46.2 to 63.4; under its 'Ox Alpha' alias it briefly took the #1 weekly token share spot on OpenRouter"
series:
  name: "AI Model Tracker"
  order: 8
glossary:
  - term: "GLM"
    def: "An open large language model family developed by Zhipu AI (international brand Z.ai)"
---

> 🌏 [中文版](/posts/daily/2026-08-28-model-zhipu-glm-5-3-flash)

## Model Information

| Field | Value |
|---|---|
| Model ID | `glm-5.3-flash` |
| Vendor | Zhipu AI (international brand Z.ai) |
| Parameters | 320B total, 18B active (MoE) |
| Context Window | 1,048,576 tokens (max output 131,072 tokens) |
| Input Pricing (USD/1M tokens) | $0.15 (cached input $0.03; 50% launch discount to $0.075 through 2026-09-09 24:00 UTC+8) |
| Output Pricing (USD/1M tokens) | $0.50 (discount period $0.25) |
| Open Source | Yes (MIT license, weights released) |
| Release Date | 2026-08-26 (its predecessor "Ox Alpha" ran anonymously and free on OpenRouter/OpenCode starting 2026-08-20) |
| Official Announcement | [Z.ai Blog: GLM-5.3-Flash](https://z.ai/blog/glm-5.3-flash) |
| HuggingFace | [zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) |
| Family | GLM 5.x (first natively multimodal model in the GLM-5 series) |

## Key Capabilities

- First natively multimodal model in the GLM-5 series: accepts text, image, and video input, produces text output; Z.ai says the multimodal capability now powers ZCode's Browser Use and Computer Use features
- Uses a hybrid KDA (linear attention) + NoPE sparse MLA architecture, which Z.ai says cuts attention compute by roughly 3x and shrinks the KV cache by roughly 4.4x
- Terminal-Bench 2.1 score of 84.3, close to Claude Opus 4.8's 85.0 and a large jump over predecessor GLM-5.2
- DeepSWE v1.1 jumps from GLM-5.2's 46.2 to 63.4, and AutomationBench jumps from 26.2 to 48.8 — the biggest gains are on agentic, multi-step tasks
- Scores 57 on the Artificial Analysis Intelligence Index v4.1.1 at just $0.045 per task (discounted tier) — Z.ai says this is "intelligence previously only available at roughly 10x the cost"

## Benchmark Results

| Benchmark | GLM-5.3-Flash | GLM-5.2 (prior) | Reference |
|---|---|---|---|
| Terminal-Bench 2.1 | 84.3 | — | Claude Opus 4.8: 85.0; GPT-5.6 Terra: 87.4 |
| DeepSWE v1.1 | 63.4 | 46.2 | — |
| AutomationBench | 48.8 | 26.2 | — |
| Z.ai Code Bench v1.0 (max) | 29.0 | — | Claude Opus 4.8: 29.5 |
| HLE (Humanity's Last Exam) | 55.3 | — | — |
| Artificial Analysis Intelligence Index v4.1.1 | 57 | — | 48.7 tokens/sec, 1.52s TTFT (measured on Z.ai's API) |

⚠️ Terminal-Bench, DeepSWE, AutomationBench, Z.ai Code Bench, and HLE are all Z.ai's own internal benchmark results. The Artificial Analysis Intelligence Index is an independent third-party evaluation and carries more weight. Z.ai does not headline vision benchmarks (BabyVision, MVBench); third-party coverage reports it trails Gemini 3.7 Flash there.

## Comparison with Predecessor/Competitors

Compared with its own text-only flagship sibling GLM-5.3 (an estimated 744B total / 40B active parameters), GLM-5.3-Flash gets native multimodality with less than half the active parameters, without a meaningful drop on Terminal-Bench. The pricing gap is even more striking: GLM-5.3 charges $1.40/$4.40 input/output, while GLM-5.3-Flash charges just $0.15/$0.50 — roughly a ninth of the price. That's multimodality, smaller active parameter count, and lower price all improving at once, which is unusual within a single model family — a "Flash" variant is typically a capability-for-speed tradeoff, but here Z.ai credits architectural efficiency (hybrid KDA + NoPE sparse MLA) rather than simply shrinking the model.

Against closed frontier models, Terminal-Bench 2.1's 84.3 trails Claude Opus 4.8's 85.0 by only about 0.7 points, and Z.ai Code Bench is within 0.5 points (29.0 vs 29.5) — but Opus 4.8 is priced at $5/$25, while GLM-5.3-Flash's discounted rate is $0.075/$0.25, a price gap of over 66x. That combination of near-frontier performance and rock-bottom pricing is the direct reason its anonymous "Ox Alpha" persona was able to take the #1 spot in weekly OpenRouter token share (roughly 19 percentage points) during its free week.

Notably, Z.ai's disclosure emphasized that the anonymous week ran entirely on domestically produced Chinese AI chips — if accurate, this would demonstrate not just training (GLM-5.1/5.2 already trained on Huawei Ascend chips) but, for the first time, that high-traffic production inference can also run entirely outside the Nvidia supply chain. This claim currently comes solely from Z.ai and has not been independently verified.

## Implications for Agent Development

Coding agents are the most direct beneficiary here: DeepSWE 1.1 (software engineering agent tasks) jumps from 46.2 to 63.4, and AutomationBench (cloud application automation) jumps from 26.2 to 48.8 — both are multi-step, tool-heavy task types, and the gains there far outpace single-turn conversational benchmarks.

- If you're building a coding agent or a tool that needs multimodal understanding (screenshots, UI element recognition) for automation: GLM-5.3-Flash's native multimodality plus low price is worth adding to your evaluation shortlist, especially if you're currently bottlenecked on Claude/GPT-tier costs
- If you're running budget-sensitive, high-throughput batch workloads: $0.15/$0.50 (or $0.075/$0.25 during the launch discount) is an order of magnitude cheaper than most models at a comparable capability tier — good for large-scale parallel agent experiments or background tasks
- Not a fit for: tasks requiring rigorous visual reasoning (third-party coverage reports it trails Gemini 3.7 Flash on vision benchmarks), or enterprise settings that need clear supply-chain compliance auditing — details on the "domestic chip" claim and data-processing locations are disclosed only sparingly

## Today's Takeaway

The "Ox Alpha" anonymous-release playbook is worth noting: ship a free, high-volume model anonymously, let the community guess who's behind it while hype builds, then reveal identity along with full technical details and pricing once discussion peaks. That flips the usual "announce, then let the community stress-test it" order — and this time, the anonymous period's high traffic doubled as evidence that domestic chips can handle production load, tying marketing narrative and technical validation into the same event.

## References

- [Z.ai Blog: GLM-5.3-Flash: Frontier Intelligence, Flash Cost](https://z.ai/blog/glm-5.3-flash)
- [Z.ai Developer Docs: Pricing Overview](https://docs.z.ai/guides/overview/pricing)
- [Z.ai Developer Docs: GLM-5.3-Flash Model Guide](https://docs.z.ai/guides/vlm/glm-5.3-flash)
- [MarkTechPost: Z.ai Releases GLM-5.3-Flash: A 320B-A18B Natively Multimodal MoE With a 1M-Token Context](https://www.marktechpost.com/2026/08/26/z-ai-releases-glm-5-3-flash-a-320b-a18b-natively-multimodal-moe-with-a-1m-token-context/)
- [Capital & Compute: GLM-5.3-Flash: Price, Specs, and Benchmarks](https://capitalandcompute.net/blog/glm-5-3-flash-pricing-benchmarks/)
- [SiliconANGLE: Z.ai open-sources 'Ox Alpha' model as GLM-5.3-Flash](https://siliconangle.com/2026/08/26/z-ai-open-sources-ox-alpha-model-as-glm-5-3-flash/)
- [OfficeChai: Ox Alpha (GLM 5.3 Flash) Was Powered By "Pure Chinese Chips", Is Priced At 1/100th Of Frontier: Z.AI Founder Jie Tang](https://officechai.com/ai/ox-alpha-glm-5-3-flash-was-powered-by-pure-chinese-chips-is-priced-at-1-100th-of-frontier-z-ai-founder-jie-tang/)
