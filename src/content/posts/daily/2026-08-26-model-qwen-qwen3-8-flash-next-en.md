---
title: "Model Card｜Qwen3.8-Flash-Next"
date: 2026-08-26
category: daily
type: digest
tags: [ai-agent, model-release, daily, qwen, model-family-qwen]
lang: en
description: "Alibaba's Qwen team releases Qwen3.8-Flash-Next — the first public preview of the Qwen4 architecture, 125B parameters with only 6B active, using QSA sparse attention and N-gram Embedding to cut long-context agent inference cost while training at roughly a ninth of Qwen3.7-Plus's cost"
tldr: "Qwen3.8-Flash-Next: open-weight preview of the Qwen4 architecture, 125B total parameters with only 6B active (plus a 51B N-gram embedding), 262K native context extensible to 1M, Qwen Community License 1.0 (not Apache 2.0). Official benchmarks show it beating both its own 27B dense model and the 397B Qwen3.7-Plus on agentic coding (DeepSWE 1.1: 58.7) and scoring highest on CoWorkBench long-horizon office tasks (73.9) — but no official API pricing or independent third-party testing exists yet"
series:
  name: "AI Model Tracker"
  order: 7
glossary:
  - term: "Qwen"
    def: "A large language model family developed by Alibaba's Tongyi Qianwen (Qwen) team"
---

> 🌏 [中文版](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next)

## Model Information

| Field | Value |
|---|---|
| Model ID | `Qwen/Qwen3.8-Flash-Next` |
| Vendor | Alibaba (Qwen team) |
| Parameters | 125B total, 6B active; plus a 51B N-gram embedding and a 4B MTP layer (BF16 weights total ≈ 180B) |
| Context Window | 262,144 tokens native, extensible to 1,000,000 tokens |
| Input Pricing (USD/1M tokens) | No official API pricing yet (open-weight preview; no Qwen Cloud hosted endpoint at time of writing) |
| Output Pricing (USD/1M tokens) | No official API pricing yet (same as above; the production counterpart Qwen3.8-Flash is listed at roughly $0.16 input / $0.47 output, but Alibaba hasn't confirmed the two share an identical architecture) |
| Open Source | Yes (Qwen Community License 1.0, not Apache 2.0; third-party quantized repacks carry their own separate terms) |
| Release Date | 2026-08-26 |
| Official Announcement | [Qwen3.8-Flash-Next Model Card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| HuggingFace | [Qwen/Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| Family | Qwen4 architecture preview (a technical roadmap release, not a direct derivative of the current Qwen3.x generation) |

## Key Capabilities

- First public release of the Qwen4-generation architecture: Qwen Sparse Attention (QSA), which operates at the micro-block level rather than selecting individual tokens, replaces Gated Attention in the previous Gated DeltaNet + Gated Attention pairing — Alibaba says this significantly cuts long-context latency
- Adds a Gated Residual mechanism that modulates widened residual streams via per-branch read/write gates, improving expressiveness across deep layers while preserving training stability with low inference overhead
- Introduces a 51B-parameter N-gram Embedding (indexed by bigrams/trigrams), shifting part of the parameter scaling onto an axis that's cheaper computationally than MoE and friendlier to offloading on memory-constrained hardware
- Alibaba states training cost is roughly one-ninth of Qwen3.7-Plus's, yet the model matches or beats the 397B-parameter Qwen3.7-Plus on multiple coding/agent benchmarks

## Benchmark Performance

| Benchmark | Qwen3.8-Flash-Next | Qwen3.8-27B (own dense model) | Qwen3.7-Plus (predecessor, 397B) | Strongest competitor (DeepSeek-V4-Flash-0731 / Claude-Opus-4.6) |
|---|---|---|---|---|
| Agentic coding (DeepSWE 1.1) | 58.7 | 42.2 | 16.5 | DeepSeek-V4-Flash-0731 54.4 |
| Agentic coding (SWE-bench Pro) | 62.5 | 61.7 | 55.8 | Claude-Opus-4.6 53.4 |
| Long-horizon office tasks (CoWorkBench) | 73.9 | 70.7 | 65.1 | Claude-Opus-4.6 68.2 |
| Real-world tool use (Toolathlon Verified Pass@1) | 73.5 | 67.1 | 50.6 | DeepSeek-V4-Flash-0731 70.3 |
| Frontier agentic tasks (Agents' Last Exam Pass@1) | 24.3 | 20.4 | 13.2 | DeepSeek-V4-Flash-0731 25.2 |

⚠️ All figures above are from Qwen's own official model card (some evaluated via third-party harnesses like Claude Code / mini-SWE-agent, but run and compiled by the Qwen team). No independent third-party reproduction or standardized leaderboard listing exists as of publication.

## Comparison with Predecessors and Competitors

Against its own 397B-parameter Qwen3.7-Plus, Qwen3.8-Flash-Next needs only 6B active parameters to score far higher on agent-oriented benchmarks like DeepSWE 1.1 (58.7 vs. 16.5) and CoWorkBench (73.9 vs. 65.1). This isn't simple parameter stacking — it's the "architectural efficiency" path Alibaba emphasizes: for the same compute budget, QSA sparse attention and Gated Residual trade for better long-context utilization. Notably, it even beats its own 27B dense model, Qwen3.8-27B, on most metrics, suggesting the MoE + sparse attention combination isn't just cheaper — it may be a genuine capability gain for agent tasks.

Against closed-source frontier models, Qwen3.8-Flash-Next leads or matches on real-world tool use (Toolathlon: 73.5 vs. DeepSeek-V4-Flash-0731's 70.3, Claude-Opus-4.6 unlisted) and CoWorkBench (73.9 vs. Claude-Opus-4.6's 68.2), but still trails on more frontier, general-reasoning-heavy tasks like Agents' Last Exam (24.3 vs. DeepSeek's 25.2) — suggesting the architectural efficiency gains show up mainly in execution on known task types, not a wholesale leap in general reasoning.

Pricing is the biggest open question right now: as an open-weight architecture preview, Flash-Next itself has no published Qwen Cloud hosting price. The only published figure belongs to the "production counterpart," Qwen3.8-Flash (default 1M context, built-in tools), listed at ¥1/¥3 per million tokens (roughly $0.16/$0.47) — but Alibaba hasn't clarified whether the two share the exact same architecture and parameter count, so they shouldn't be treated as equivalent.

## Implications for Agent Development

The QSA sparse attention plus Gated DeltaNet combination is clearly aimed at cutting latency and cost for long-context agent workloads — a real pain point for most agent frameworks today, where longer contexts compound latency and cost with every tool call. The N-gram Embedding shifts part of the model's knowledge capacity onto a computationally cheaper axis, which in theory gives smaller teams a shot at running near-frontier agent capability on limited hardware.

- If you're building long-horizon, multi-tool-call agents (e.g., office automation tasks like CoWorkBench): Qwen3.8-Flash-Next's official scores are currently the strongest in its weight class, worth adding to your self-hosted or private-deployment evaluation shortlist
- If you're doing local/private deployment and care about memory footprint: 6B active parameters plus an offload-friendly N-gram Embedding design should, in theory, fit more easily on constrained hardware than a comparable dense model — though the total BF16 weight size is still roughly 180B, so high-end hardware or quantization is still required in practice
- Not suitable for: production lines needing an immediately stable API service — right now there are only open weights and community endpoints, no official SLA, and Alibaba itself labels this "an experimental architecture preview," distinct from the production Qwen3.8-Flash service

## Takeaway

I used to read "Qwen4 architecture preview" as marketing language, but this time the Qwen team shipped the full architectural detail (QSA, Gated Residual, the exact N-gram Embedding configuration) together with official benchmarks in one release — rarer than the usual "tease first, document later" pattern. It's also a verification lesson: Flash-Next (the open-weight architecture preview) and Qwen3.8-Flash (the Qwen Cloud–hosted production version) have near-identical names, but Alibaba hasn't confirmed they share the same architecture — so their pricing, SLA, and even capabilities can't be assumed interchangeable. When writing a model card, "same name, different thing" cases need to be handled separately rather than assumed equivalent just because the names look alike.

## References

- [Qwen3.8-Flash-Next Model Card — Hugging Face](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Unite.AI: Qwen3.8-Flash-Next Previews Qwen4 Architecture With 6B Active Parameters](https://www.unite.ai/qwen3-8-flash-next-previews-qwen4-architecture-with-6b-active-parameters/)
- [Startup Fortune: Alibaba's Qwen3.8-Flash-Next Gives Builders An Early Look At Qwen4](https://startupfortune.com/alibabas-qwen38-flash-next-gives-builders-an-early-look-at-qwen4/)
- [byteiota: Qwen 3.8-Flash-Next: Inside the Qwen4 Architecture Preview](https://byteiota.com/qwen-38-flash-next-qwen4-architecture-preview/)
- [OrcaRouter: Qwen3.8-Flash-Next Is Out — Qwen4 Architecture Confirmed (includes Qwen3.8-Flash production pricing)](https://www.orcarouter.ai/blog/qwen-3-8-flash-next-leak)
- [Baekpica/Qwen3.8-Flash-Next-GGUF (confirms Qwen Community License 1.0 terms)](https://huggingface.co/Baekpica/Qwen3.8-Flash-Next-GGUF)
