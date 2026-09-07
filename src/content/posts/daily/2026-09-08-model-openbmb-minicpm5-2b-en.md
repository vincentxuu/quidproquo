---
title: "Model Card｜MiniCPM5-2B"
date: 2026-09-08
category: daily
type: digest
tags: [ai-agent, model-release, daily, openbmb, model-family-minicpm]
lang: en
description: "OpenBMB quietly ships MiniCPM5-2B — a 2.6B dense model with 131K context, fully open under Apache-2.0 — topping the neutral Artificial Analysis benchmark among open-weights models under 4B parameters"
tldr: "MiniCPM5-2B (openbmb/MiniCPM5-2B): quietly published to Hugging Face by OpenBMB on 2026-09-06 with no official blog announcement; 2.6B dense parameters, 131,072-token context window, fully open under Apache-2.0. Scores 15 on the neutral, third-party Artificial Analysis Intelligence Index v4.2 — the highest of any open-weights model under 4B parameters (next best, Granite 4.2 3B, scores 11). Leads the set on GDPval-AA v2 (real-world work tasks) with an Elo of 831. Already deployed day-zero across 9 AI chips via FlagOS, including Huawei Ascend and NVIDIA."
series:
  name: "AI Model Tracker"
  order: 18
glossary:
  - term: "MiniCPM"
    def: "A family of lightweight on-device models from OpenBMB (ModelBest), built for local deployment on phones, PCs, and in-vehicle systems"
---

> 🌏 [中文版](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b)

## Model Information

| Field | Value |
|---|---|
| Model ID | `openbmb/MiniCPM5-2B` |
| Vendor | OpenBMB (ModelBest) |
| Parameters | 2.6B dense (exact: 2,516,756,480; non-embedding: 1,981,982,720) |
| Context Window | 131,072 tokens |
| Input pricing (USD/1M tokens) | No official API pricing (open weights only, self-hosted) |
| Output pricing (USD/1M tokens) | No official API pricing (open weights only, self-hosted) |
| Open source | Yes (Apache-2.0) |
| Release date | 2026-09-06 (Hugging Face repo went live directly, no official blog announcement) |
| Official announcement | [Hugging Face: openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) |
| Hugging Face | [openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) |
| Family | MiniCPM5 series (second model, following MiniCPM5-1B released 2026-05-19) |

## Highlights

- Scores 15 on the neutral, third-party Artificial Analysis Intelligence Index v4.2 — the highest of any open-weights model under 4B parameters, 4 points ahead of Granite 4.2 3B (11), and level with Qwen3.5 9B (Reasoning, estimated 15) at roughly 4x its size
- Leads the comparison set on GDPval-AA v2 (real-world work tasks scored against a human baseline) with an Elo of 831, ahead of Ling 3.0 Tiny (718, ~3x the parameters) and Granite 4.2 8B (647); joint-first with Ling 3.0 Tiny on τ³-Bench Banking (agentic tool use) at 21%, far ahead of the next best, Granite 4.2 8B, at 8%
- Token-efficient for a reasoning model: uses only 19k output tokens per Intelligence Index task (11k of them reasoning tokens), among the lowest in the set — Ling 3.0 Tiny spends 56k tokens for just 1 more point
- Fully open under Apache-2.0, released alongside its training datasets — UltraX, UltraData-Code, the 500K-sample agent training set UltraData-SFT-Agent-2609, and the 80K+-sample UltraData-RL-2609

## Benchmark Results

| Benchmark | Score | Predecessor (MiniCPM5-1B) | Best competitor (<4B open weights) |
|---|---|---|---|
| Artificial Analysis Intelligence Index v4.2 (neutral) | 15 | N/A (1B not in this version's comparison set) | Granite 4.2 3B: 11 |
| GDPval-AA v2 Elo (neutral, real-world work) | 831 | N/A | Ling 3.0 Tiny: 718 |
| τ³-Bench Banking (neutral, agentic tool use) | 21% (joint-first with Ling 3.0 Tiny) | N/A | Granite 4.2 8B: 8% |
| SWE-bench Verified ⚠️ (vendor self-reported) | 46.4% | N/A | Qwen3.5-4B: 33.6% (best in the 4B comparison group) |
| Humanity's Last Exam (neutral) | 9% | N/A | Gemma 4 12B (Reasoning): 16% |

⚠️ Except where noted, all figures are from independent Artificial Analysis testing. SWE-bench Verified is OpenBMB's own self-reported number (from the Hugging Face model card) and has not been independently reproduced. MiniCPM5-1B and MiniCPM5-2B were evaluated against different comparison sets (1B against Qwen3-0.6B, etc.; 2B against Qwen3.5-2B, etc.), so there are no directly comparable numbers — hence the "Predecessor" column is left blank.

## Comparison with Predecessor/Competitors

Compared with MiniCPM5-1B, parameters grow from 1.08B to 2.6B (about 2.3x), while the context window stays at 131,072 tokens. The two versions were tested against different comparison sets, so there's no directly comparable score, but OpenBMB positions both the same way — "open-source SOTA within its size class" — and the training recipe (SFT → RL → On-Policy Distillation) carries over unchanged.

Against similarly-sized competitors, MiniCPM5-2B's edge is concentrated in agentic tasks: it beats models with 3-4x the parameters on GDPval-AA v2 and τ³-Bench Banking. But it clearly trails on knowledge breadth and long-context understanding — Humanity's Last Exam (9% vs. Gemma 4 12B's 16%) and Terminal-Bench v2.1 (9% vs. Qwen3.5 9B's 29%) both lose out, and it scores 0% on CritPt. This is a narrow-but-deep agent-optimized model, not a generalist.

On pricing strategy, MiniCPM5-2B is fully open with no official API, and it shipped as a quiet drop — the Hugging Face repo went live on September 6 with no blog post and no social media push, in contrast to the launch fanfare around MiniCPM5-1B or GLM-5.3. The only public confirmation so far comes from Artificial Analysis's independent evaluation and after-the-fact third-party blog coverage.

## Implications for Agent Development

If you're building agents for phones, PCs, or in-vehicle systems: at 2.6B parameters it uses only 19k output tokens per task (11k reasoning tokens) — among the lowest in its class — and ships under Apache-2.0, making it the highest agentic-capability-density option currently available among open-weights models under 4B parameters. FlagOS has already ported it to 9 AI chips (including Huawei Ascend, NVIDIA, and Metax), giving teams that need to deploy across heterogeneous hardware a ready-made path.

If you're building something that needs broad factual knowledge or long-context understanding: it loses to larger models on Humanity's Last Exam, AA-LCR, and Terminal-Bench v2.1 — this size class still hits a ceiling on knowledge breadth, so don't reach for it as the backbone of a general-purpose RAG or long-document QA system.

Not a fit: use cases needing vision or multimodal input (MiniCPM5-2B is text-only, unlike the vision-capable MiniCPM-V line in the same family); also don't treat the self-reported "46.4% on SWE-bench Verified" as a production-ready guarantee of coding-agent capability — that number hasn't been independently reproduced yet.

## Today's Takeaway

I used to assume open small models compete mainly on overall intelligence score at a given parameter count. MiniCPM5-2B matches Qwen3.5-9B's (roughly 4x the parameters) Intelligence Index score at 2.6B parameters — but pays for it with a clear gap on knowledge-heavy evaluations (HLE, long-context). That suggests what actually determines "can this be an agent" is agentic-specific evaluation (GDPval-AA, τ-bench), not overall intelligence score: small models can already match larger ones on agentic tasks, but the knowledge-breadth gap isn't closed yet.

## References

- [Hugging Face: openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B)
- [Hugging Face: openbmb/MiniCPM5-1B](https://huggingface.co/openbmb/MiniCPM5-1B)
- [Artificial Analysis: OpenBMB releases MiniCPM5-2B](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b)
- [Artificial Analysis: MiniCPM5-2B model page](https://artificialanalysis.ai/models/minicpm5-2b)
- [GitHub: OpenBMB/MiniCPM](https://github.com/OpenBMB/MiniCPM)
- [orcarouter: MiniCPM5-2B open weights are live](https://www.orcarouter.ai/blog/minicpm5-2b-open-weights-release)
