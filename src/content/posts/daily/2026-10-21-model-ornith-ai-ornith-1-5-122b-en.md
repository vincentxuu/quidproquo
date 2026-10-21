---
title: "Model Card: Ornith-1.5-122B"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, ornith-ai, model-family-ornith]
lang: en
description: "DeepReinforce quietly uploaded a new 122B size to the Ornith-1.5 family on HuggingFace — MIT license, runs on a single 80GB GPU, 84.5% SWE-bench Verified — trained with a self-improvement loop where the model generates its own tasks, scaffolds, and rollouts"
tldr: "Ornith-1.5-122B: 122B total parameters (MoE, active parameter count undisclosed), 262,144-token native context (extendable to roughly 1M with YaRN scaling factor 4.0), MIT license, deployable on a single 80GB GPU; uploaded to HuggingFace on 2026-10-16 with no accompanying blog post, surfacing instead through community coverage and HF trending; scores 84.5% on SWE-bench Verified (non-hack) and 80.0% on CyberGym, both ahead of the similarly sized Qwen3.8-Flash-Next (125B); the training method carries over Ornith-1.0's self-improvement loop but extends it from optimizing scaffolds and rollouts alone to jointly optimizing task generation, scaffold construction, and rollouts; no official or third-party hosted API pricing exists yet."
series:
  name: "AI Model Tracker"
  order: 54
glossary:
  - term: "Ornith"
    def: "An open-weight agentic coding model family from the DeepReinforce research team, whose core idea is having the model generate its own training tasks and scaffolds during reinforcement learning; the 1.5 generation spans 397B, 122B, 35B, and 9B sizes"
  - term: "DeepReinforce"
    def: "The research team behind the Ornith model family, which first open-sourced Ornith-1.0 in June 2026"
---

> 🌏 [中文版](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b)

## Model Info

| Field | Value |
|---|---|
| Model ID | `ornith-ai/Ornith-1.5-122B` |
| Vendor | DeepReinforce (the team behind Ornith; HuggingFace org name is ornith-ai) |
| Parameters | 122B total (MoE; active parameter count not disclosed) |
| Context Window | 262,144 tokens native; extendable to roughly 1,000,000 tokens with YaRN scaling factor 4.0 |
| Input Pricing (USD/1M tokens) | N/A (open-weight release only; no official or third-party hosted API yet) |
| Output Pricing (USD/1M tokens) | N/A (open-weight release only; no official or third-party hosted API yet) |
| Open Source | Yes (MIT) |
| Release Date | 2026-10-16 (HuggingFace repo creation date; no corresponding company blog post) |
| Official Announcement | [ornith-ai/Ornith-1.5-122B on Hugging Face](https://huggingface.co/ornith-ai/Ornith-1.5-122B) |
| HuggingFace | [ornith-ai/Ornith-1.5-122B](https://huggingface.co/ornith-ai/Ornith-1.5-122B) |
| Family | Ornith 1.5 (alongside the 397B, 35B-A3B, and 9B sizes) |

## Highlights

- Scores 84.5% on SWE-bench Verified (non-hack), ahead of the similarly sized Qwen3.8-Flash-Next (125B, 82.8%) and Qwen3.8-27B (76.8%)
- Trained with a "self-improvement loop": the model generates its own training tasks, builds the matching agent scaffold (tools, decomposition strategy, orchestration), then produces solution rollouts for reinforcement learning — without relying on a fixed set of human-curated tasks or hand-designed harnesses
- The 122B MoE architecture is built to run on a single 80GB GPU, requiring far less hardware than Beam-1.0 (501B) or DeepSeek-V4-Flash-0731 (284B) in the same comparison table
- A quantized Ornith-1.5-122B-Mobile variant is also available for edge devices such as phones

## Benchmark Results

| Benchmark | Score | Previous Generation | Best Competitor |
|---|---|---|---|
| SWE-bench Verified (non-hack) | 84.5 | No comparable score at this scale | Qwen3.8-Flash-Next (125B): 82.8 |
| CyberGym | 80.0 | No comparable score at this scale | Qwen3.8-Flash-Next (125B): 78.0 |
| Terminal-Bench 2.1 (Claude Code) | 81.2 | No comparable score at this scale | DeepSeek-V4-Flash-0731 (284B): 82.7 (ahead) |
| BrowseComp | 78.5 | No comparable score at this scale | Beam-1.0 (501B): 80.2 (ahead) |
| HLE (with tools) | 48.0 | No comparable score at this scale | Beam-1.0 (501B): 51.1 (ahead) |

⚠️ All figures are from the official model card's own evaluations (SWE-bench scores use the OpenHands harness, Terminal-Bench uses the Claude Code harness, HLE uses Claude 4.6 Opus as the judge model), and none have been independently reproduced yet. Ornith-1.0 never shipped a 122B size, so there is no same-scale predecessor score to compare against.

## Comparison with Predecessor and Competitors

Ornith-1.0 (released June 2026) came in four sizes — 9B, 31B, 35B MoE, and 397B MoE. When Ornith-1.5 formally launched in August 2026, it announced only three sizes: 397B, 35B, and 9B. The 122B size appeared directly on HuggingFace in mid-October with no corresponding blog post, and only came to attention through HF trending and community write-ups. On the training side, 1.5 extends 1.0's approach of "optimizing scaffolds and rollouts" into a fuller self-improvement loop that jointly optimizes task generation, scaffold construction, and rollouts.

Against the similarly sized Qwen3.8-Flash-Next (125B), Ornith-1.5-122B leads on SWE-bench Verified and CyberGym, but trails on Terminal-Bench 2.1, scoring 81.2% against Qwen3.8-Flash-Next's 83.4%. Against Beam-1.0 (501B, which we covered in our [2026-10-18 model card](/posts/daily/2026-10-18-model-reflection-beam-1-0-en)), Ornith-1.5-122B has only a quarter of the total parameters yet edges it out on SWE-bench Verified at 84.5% (Beam's own card doesn't list this exact metric, but Beam scores 57.0% on SWE-bench Pro against Ornith's 76.9%, a clear gap). It falls behind Beam, though, on tasks that demand heavy tool use and long-horizon search, such as BrowseComp and HLE with tools — suggesting Ornith's self-improvement training is highly effective for code-repair-style tasks but hasn't yet caught up to larger models on open-ended web research.

The business models differ entirely: Ornith is a pure open-weight release with no official hosted API, so using it means self-hosting. DeepSeek-V4.1-Flash is also MIT-licensed and open, but DeepSeek additionally offers a metered, pay-as-you-go API — so beyond the shared "open weights" label, the two aren't competing on the same commercial axis.

## What This Means for Agent Development

If you're building a self-hosted, single-GPU coding agent: the 122B size runs on one 80GB GPU, far cheaper in hardware than Beam (501B) or DeepSeek (284B), and it leads similarly sized competitors on SWE-bench Verified and CyberGym — worth evaluating as a candidate base model for a self-hosted coding agent.

If you're building multi-agent systems or anything with heavy tool calling or MCP: Ornith scores 74.6 on MCP-Atlas, matching the 501B Beam, and 78.5 on BrowseComp, which shows a model at this size can already handle a meaningful share of agentic tool-calling workloads. The training method itself — having the model generate its own tasks and scaffolds before running RL — is worth studying on its own merits, not just treating this as an off-the-shelf model.

Where it doesn't fit: DeepReinforce hasn't published a full training methodology paper or an arXiv link, so the details of the self-improvement loop have to be pieced together from partial descriptions in the official blog post. There's also no official hosted API or vendor SLA, so teams that want a stable production service will need to handle deployment, monitoring, and security hardening themselves — unlike DeepSeek or MiniMax, which offer ready-to-integrate, pay-as-you-go APIs.

## Today's Takeaway

The lesson here is that a model family can quietly add a new size after the fact: Ornith-1.5 only announced 397B, 35B, and 9B when it formally launched in August, and the 122B size showed up directly on HuggingFace in mid-October with no accompanying blog post — it only got noticed through HF trending and community write-ups. That's a reminder that an official announcement isn't a prerequisite for a model being worth tracking in this ecosystem; watching HuggingFace trending itself is a signal source you can't afford to skip when following new releases.

## References

- [ornith-ai/Ornith-1.5-122B on Hugging Face](https://huggingface.co/ornith-ai/Ornith-1.5-122B)
- [Ornith-1.5: From Self-Scaffolding to Self-Improvement (official Ornith blog)](https://ornith.ai/ornith_1_5.html)
- [MarkTechPost: DeepReinforce Releases Ornith-1.0](https://www.marktechpost.com/2026/06/25/deepreinforce-releases-ornith-1-0-an-open-source-coding-model-family-that-learns-its-own-rl-scaffolds/)
- [explainx.ai: Ornith-1.5-122B — 84.5 SWE-bench Verified on One GPU?](https://explainx.ai/blog/ornith-1-5-122b-open-weights-mit-single-80gb-gpu-swe-bench-verified-84-5-claimed-vs-verified-2026)
- [Medium (Mehul Gupta): Ornith-1.5–122B Is Here: Self Improving LLM](https://medium.com/data-science-in-your-pocket/ornith-1-5-122b-is-here-self-improving-llm-5ad05d8de8cc)
