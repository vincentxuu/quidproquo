---
title: "Model Card｜GLM-5.3"
date: 2026-08-25
category: daily
tags: [ai-agent, model-release, daily, zhipu, model-family-glm]
lang: en
description: "Z.ai releases GLM-5.3 — same GLM-5.2 base model, pure post-training scaling pushes Terminal-Bench 3.0 from 4.6% to 28.3%, CyberGym vulnerability discovery score overtakes every listed closed-source frontier model for the first time"
tldr: "GLM-5.3: same GLM-5.2 base model, pure post-training gains, 1M context / 128K max output, pricing unchanged at $1.4 input / $4.4 output (per 1M tokens), Terminal-Bench 3.0 jumps from 4.6% to 28.3% (open-source SOTA), CyberGym vulnerability discovery 84.5% surpasses every listed closed-source frontier model. Zhipu delayed weight release until safety evaluation completes (~8/28)"
series:
  name: "AI Model Tracker"
  order: 5
glossary:
  - term: "GLM"
    def: "Open-source large language model family developed by Zhipu AI (Z.ai)"
---

> 🌏 [中文版](/posts/daily/2026-08-25-model-zhipu-glm-5-3)

## Model Information

| Field | Value |
|---|---|
| Model ID | `glm-5.3` |
| Vendor | Zhipu AI (international brand: Z.ai) |
| Parameters | Not officially disclosed; shares GLM-5.2 base model (third-party estimates ~744B total / ~40B active parameters) |
| Context Window | 1,000,000 tokens (max output 128,000 tokens) |
| Input pricing (USD/1M tokens) | $1.40 (cached input $0.26) |
| Output pricing (USD/1M tokens) | $4.40 |
| Open-source | Not yet — Zhipu announced weight release within two weeks of launch (~2026-08-28), pending safety evaluation and hardening |
| Release date | 2026-08-14 |
| Official announcement | [Z.ai Blog: GLM-5.3](https://z.ai/blog/glm-5.3) |
| HuggingFace | `zai-org/GLM-5.3` (page shows Coming Soon, not yet downloadable) |
| Family | GLM 5.x (shares the same base model as GLM-5.2) |

## Key Capabilities

- Terminal-Bench 3.0 jumps from GLM-5.2's 4.6% to 28.3%, achieving open-source model SOTA
- Z.ai Code Bench (internal benchmark) improves 50% over GLM-5.2; Zhipu calls it "the strongest open-weight code model to date"
- CyberGym vulnerability discovery score of 84.5% — the highest among all models in the official comparison table, including closed-source frontier models
- Collaborated with multiple security teams on real-world targets, uncovering 2,436 vulnerabilities, of which 1,097 were medium-to-high severity
- No base model retraining whatsoever — all improvements come from post-training scaling (more task environments + more compute)

## Benchmark Results

| Benchmark | GLM-5.3 | GLM-5.2 | Best competitor |
|---|---|---|---|
| Terminal-Bench 3.0 | 28.3% | 4.6% | GPT-5.6 Sol 34.6% |
| CyberGym (vulnerability discovery) | 84.5% | 77.2% | Claude Fable 5 83.8% |
| ExploitBench (exploitation) | 54.4% | 24.4% | Claude Fable 5 78.0% |
| DeepSWE v1.1 | 66.9% | 46.2% | GPT-5.6 Sol 72.7% |

⚠️ All results above are self-reported by Z.ai; independent third-party reproductions are not yet available.

## Comparison with Predecessor and Competitors

GLM-5.3 shares the exact same base model as GLM-5.2 — there was zero pre-training this time around. Every improvement comes from post-training scaling, which is literally the first sentence of the official blog post: "Scaling post-training is all we did for GLM-5.3." Terminal-Bench 3.0 jumped from 4.6% to 28.3%, a 6x leap. While it still trails GPT-5.6 Sol's 34.6% and Claude Fable 5's 33.7%, it is now the highest-scoring open-source model.

The CyberGym result stands out: GLM-5.3's 84.5% not only beats GLM-5.2's 77.2%, it also surpasses every closed-source frontier model in the official comparison table, including Claude Fable 5 (83.8%) and GPT-5.6 Sol (83.6%). This is a rare case of an open-source model overtaking closed-source frontier models in security vulnerability discovery. ExploitBench (one step deeper into the exploitation chain) also doubled, though the absolute score (54.4%) still clearly trails Claude Fable 5 (78.0%).

Pricing stays completely unchanged at GLM-5.2's $1.4 / $4.4 (per 1M tokens) — with substantially improved capabilities, this amounts to an implicit price cut. However, weight release has been delayed until "safety evaluation and hardening are complete," a departure from GLM-5.2's day-one open-source MIT release. Zhipu is effectively acknowledging through action that the leap in cybersecurity capabilities brings new risk assessment obligations.

## What This Means for Agent Development

The CyberGym / ExploitBench scores are the most noteworthy signal here: an open-source model's vulnerability discovery and exploitation capabilities have caught up to — and in some cases surpassed — closed-source frontier models, meaning the barrier to automated security testing (or conversely, automated attacks) is dropping fast.

- If you're building coding agents or automated PR review: The open-source SOTA score on Terminal-Bench 3.0 means local deployment (once weights are released) can deliver solid terminal operation and long-horizon task capabilities — worth adding to your self-hosting evaluation list
- If you're building DevSecOps or automated vulnerability scanning tools: GLM-5.3's CyberGym / ExploitBench performance is best-in-class, making it a strong fit for white-box code auditing and automated discovery of known vulnerability patterns — but plan access controls in parallel, to prevent the same capabilities from being used offensively
- Not suitable for: There is no public API or downloadable weights yet — access is only through the GLM Coding Plan subscription. If you need immediate offline inference or custom fine-tuning, you'll need to wait roughly one week (~8/28) for the weight release

## Takeaway

The conventional wisdom was that open-source models needed bigger base models or full retraining to catch up to frontier capabilities. GLM-5.3 used the same GLM-5.2 base model, relying purely on post-training scaling, to boost Terminal-Bench 3.0 by 6x and even overtake every closed-source frontier model in security vulnerability discovery. This suggests that "post-training craft" — the scale and sophistication of the post-training pipeline and task environments — is becoming a more valuable moat than pre-training scale itself. And the cybersecurity spillover from this approach has already forced the vendor to delay its own open-source timeline for risk assessment.

## References

- [Z.ai Blog: GLM-5.3 — Frontier Coding with Emergent Cyber Capabilities](https://z.ai/blog/glm-5.3)
- [Z.ai Docs: GLM-5.3 Overview](https://docs.z.ai/guides/llm/glm-5.3)
- [Z.ai Docs: Pricing](https://docs.z.ai/guides/overview/pricing)
- [ai-tldr.dev: GLM-5.3 specs, benchmarks, availability](https://ai-tldr.dev/models/glm-5-3/)
- [MoClaw Blog: GLM-5.3 Is Live. The API Isn't Yet.](https://moclaw.ai/blog/glm-5-3-api-availability)
- [VentureBeat: GLM-5.3 is here with advanced cyber capabilities](https://venturebeat.com/technology/glm-5-3-is-here-with-advanced-cyber-capabilities-and-reportedly-already-found-a-serious-vulnerability-in-cursor)
