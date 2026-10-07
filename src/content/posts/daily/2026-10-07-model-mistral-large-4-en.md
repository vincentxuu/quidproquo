---
title: "Model Card: Mistral Large 4"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, mistral, model-family-mistral]
lang: en
description: "Mistral ships its flagship Large 4 (nicknamed Le Chonk): a 1.05T-parameter MoE model making its first big push into cybersecurity — but third-party Artificial Analysis scoring puts it 6-8 points behind Chinese open models like GLM-5.3 and Kimi K3, and the official specs for context window and active parameters contradict each other"
tldr: "Mistral Large 4 (ML4, nicknamed Le Chonk): public preview announced 2026-10-06, a 1.05T-total-parameter granular MoE multimodal model; the official active-parameter count is inconsistent (the launch post says 49B, the docs model card changed to 52B a few hours later with no explanation); list pricing is $1.36 input / $4.18 output per 1M tokens (cached $0.14), though the docs card currently shows exactly half that with no explanation; the docs card claims a 1M-token context window, but third-party trackers Artificial Analysis and Vals.ai both list 512K (524,288 tokens) with a 256K output cap; scores 93% on Cybench and 82% on Artificial Analysis Cyber Index's vulnerability-reproduction task (self-reported, the highest of any model — Claude Opus 5.5 and GPT-6 Astra score near zero by refusing); but on the independent Artificial Analysis Intelligence Index v4.3.2, it scores only 38, trailing MiMo-V2.6-Pro (46), GLM-5.3 (45), and Kimi K3 (44) by 6-8 points; Vals.ai ranks it 6th of 75 models (1st among open models) on Harvey's Legal Agent Benchmark, one of its few independently-verified strengths; open weights and a named license are still pending, expected by end of month (reporters were told October 27)"
series:
  name: "AI Model Tracker"
  order: 42
glossary:
  - term: "Mistral"
    def: "A large language model family from the French AI company Mistral AI, known for open weights and self-built European compute infrastructure"
---

> 🌏 [中文版](/posts/daily/2026-10-07-model-mistral-large-4)

## Model Details

| Field | Value |
|---|---|
| Model ID | `mistral-large-4-0` (public preview) |
| Vendor | Mistral AI |
| Parameters | 1.05T total; the official active-parameter figure is inconsistent — the launch announcement and official tweet say 49B, but the docs model card changed to 52B a few hours later with no explanation; plus a 1.6B vision encoder |
| Context Window | Officially inconsistent: Mistral's docs card claims 1M tokens, but third-party trackers Artificial Analysis and Vals.ai both list 524,288 tokens (~512K, with a 256K output cap) |
| Input Pricing (USD/1M tokens) | List price $1.36; the docs card currently shows exactly half that ($0.68) with no stated reason or expiration |
| Output Pricing (USD/1M tokens) | List price $4.18; the docs card currently shows exactly half that ($2.09) (cached input: list $0.14 / docs card $0.07) |
| Open Source | Yes, planned (open weights not yet released — the docs card labels it "Open" but names no license yet; predecessor Large 3 used Apache 2.0, but that can't be assumed to carry over to Large 4) |
| Release Date | 2026-10-06 (public preview; weights and an official license are expected by end of month — reporters were given a specific date of October 27) |
| Official Announcement | [Mistral Blog: Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4) |
| HuggingFace | Not applicable (weights not yet released; currently accessible only through the Mistral Studio public-preview API) |
| Family | Mistral Large 4.x |

## Key Capabilities

- Scores 82% on Artificial Analysis Cyber Index's vulnerability-reproduction-and-patching task (self-reported) — the highest of any model tested, while Claude Opus 5.5 and GPT-6 Astra score near zero because they refuse this category of security task outright
- Solves 93% of Cybench, 40 challenges drawn from real security competitions (self-reported); also resists 93.3% of prompt-injection attacks on the Lakera B3 benchmark, the highest among Mistral's own open-weight models to date
- Third-party tracker Vals.ai ranks it 6th of 75 models overall (1st among open models) on Harvey AI's Legal Agent Benchmark — one of the few strengths with independent, non-self-reported verification
- Edges out GPT-6 Astra 42% to 41% on the Dense 200 visual-grounding benchmark (self-reported); official demos include reading satellite imagery and engineering drawings

## Benchmark Results

| Benchmark | Mistral Large 4 | Previous (Large 3) | Best Competitor |
|---|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2 (independent composite score) | 38 | Not listed | MiMo-V2.6-Pro 46, GLM-5.3 45, Kimi K3 44 (Large 4 trails by 6–8 points) |
| Cybench (40 security-competition challenges, self-reported) | 93% | Not listed | No runner-up listed |
| Artificial Analysis Cyber Index — vulnerability reproduction + patching (self-reported) | 82% | Not listed | Claude Opus 5.5 / GPT-6 Astra near 0% (refuse the task) |
| DeepSWE v1.1 (self-reported) | 61.7% | Not listed | ~74% (GPT-6 Astra / Gemini 3.8 Flash / Claude Opus 5, per the live leaderboard) |
| AutomationBench (self-reported) | 59.9% | Not listed | Kimi K3, MiMo-V2.6-Pro, DeepSeek V4 Pro (all below 59.9%, per Mistral's own figures) |

⚠️ Except for the Artificial Analysis Intelligence Index, all figures above are Mistral's own self-reported benchmarks with no independent reproduction yet. DeepSWE v1.1 is self-reported against competitors Mistral chose itself (DeepSeek V4 Pro, Qwen3.8 Max), which makes 61.7% look competitive — but tech outlet VentureBeat checked the live DeepSWE leaderboard (each model's best currently published agent setup) and found GLM-5.3 and Kimi K3 around 69%, and GPT-6 Astra, Gemini 3.8 Flash, and Claude Opus 5 around 74%. Against the actual leading pack, Large 4 trails by over 10 points.

## vs. Previous Generation / Competitors

Compared with Mistral Large 3, the biggest shift isn't the benchmark scores — it's the release posture. Large 3 launched in December 2025 as a complete open-weight release under Apache 2.0 (675B total / 41B active parameters). Large 4 instead launched through a guardrailed public-preview API, with weights not following until end of month and no license even named yet. On the architecture side, total parameters grew from 675B to 1.05T (+56%), and training hardware moved from 3,000 H200 GPUs to 3,800 NVIDIA Grace Blackwell GPUs — Mistral's largest training run to date. But two basic specs — whether active parameters are 49B or 52B, whether the context window is 1M or 512K — already contradicted each other within hours of launch, which says this release's documentation is still catching up to the product.

Against competitors, Mistral's one differentiator that genuinely holds up is cybersecurity: most closed models (Claude Opus 5.5, GPT-6 Astra) refuse "reproduce this vulnerability"-style tasks outright under their safety policies, driving their scores on the corresponding Artificial Analysis Cyber Index test to near zero — while Large 4's different refusal calibration lets it score the highest of any model, 82%, a claim Vals.ai's independent legal-agent ranking (1st among open models) also corroborates. But on the more basic question of overall capability, the independent Artificial Analysis Intelligence Index gives it only 38, clearly behind MiMo-V2.6-Pro (46), GLM-5.3 (45), and Kimi K3 (44) by 6-8 points — meaning Mistral's "one of the strongest open models globally" framing only holds within the narrower claim of "strongest open model from the US or Europe," once Chinese labs are set aside.

Pricing leaves its own open question: list price is $1.36 input / $4.18 output, more than double predecessor Large 3's $0.50 / $1.50, yet the official docs card currently shows exactly half the list price ($0.68 / $2.09) with no explanation of whether that's a preview discount or pricing that simply hasn't been finalized. Combined with the fact that the lower-moderation, higher-cyber-capability version is reserved for vetted security partners and governments, this mirrors Google's approach with Gemini 4 Argon (covered here on 2026-10-05) — restrict access first, open up fully and finalize pricing later — a pattern that's increasingly becoming standard for frontier releases.

## What This Means for Agent Development

By packaging "lower refusal rate" as a cybersecurity feature, Large 4 has a direct implication for defensive agent design: most defensive security work — penetration testing, vulnerability validation, incident response — starts by proving a flaw is real, and that's exactly the step most closed models refuse under their safety policies.

- If you're building defensive security agents (vulnerability reproduction, patch suggestions, malware analysis): Large 4's refusal rate on these tasks is notably lower than Claude's or GPT's, and Mistral emphasizes self-hosting on private cloud or on-premises — a fit for security teams that need auditability and sovereign control. But note the license still isn't published, so the legal risk of commercial deployment can't be assessed yet
- If you're building a finance or legal knowledge-work agent: Vals.ai's Harvey Legal Agent Benchmark ranking (1st among open models) is one of the few independently-verified strengths, combined with native multimodal understanding — a fit for documents that mix text, tables, and images like financial filings and contracts
- Not a fit: anything going to production right now — the public preview is only reachable through a guardrailed API, self-hosting isn't possible until weights ship, and even Mistral itself hasn't settled on basic specs like active parameters or context window, so don't commit these numbers to an architecture doc yet. It's also not the pick if you're evaluating general reasoning capability rather than the cybersecurity vertical — the independent composite index still puts it behind Chinese open models like GLM-5.3 and Kimi K3

## Today's Takeaway

In the same launch announcement, the self-reported cybersecurity score (highest of any model) and the independent Artificial Analysis composite score (6-8 points behind Chinese open models) tell two completely different stories — a reminder that "strongest open model" always demands the follow-up question "compared to whom, and who got left out." Mistral's actual claim — "strongest open model from the US or Europe" — turns out to be precise; the launch headline just omits the qualifier that Chinese labs were excluded from that comparison. Combined with active parameters and context window contradicting each other within hours of release, the lesson for reading any new model announcement is: the competitors a vendor chooses to compare against, and the specs that still aren't settled on launch day, deserve more scrutiny than the headline score itself.

## References

- [Mistral Blog: Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4)
- [felloai: Mistral Large 4 (Le Chonk) — Specs, Benchmarks, Price and When the Weights Land](https://felloai.com/mistral-large-4)
- [OpenRouter: Mistral Large 4 — API Pricing & Providers](https://openrouter.ai/mistralai/mistral-large-4-0)
- [TechCrunch: Mistral's new 1T model aims to leapfrog closed and open rivals](https://techcrunch.com/2026/10/06/mistrals-new-1t-model-aims-to-leapfrog-closed-and-open-rivals)
- [CNBC: Mistral unveils new AI model it says rivals best open systems from China](https://www.cnbc.com/2026/10/06/mistral-ai-model-le-chonk.html)
- [Mistral Docs: Mistral Large 4 model page](https://docs.mistral.ai/models/mistral-large-4)
