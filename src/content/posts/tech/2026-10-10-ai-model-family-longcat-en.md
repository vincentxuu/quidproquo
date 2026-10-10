---
title: "LongCat Series: Meituan's Open Agentic Coding Model Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: en
tldr: "LongCat is Meituan's open-source LLM family. LongCat-2.0 (released 2026-06-30) has 1.6T total parameters, ~48B active, 1M context with LongCat Sparse Attention and N-gram Embedding, purpose-built for long-context reasoning, agentic coding, and repo-level understanding. MIT licensed."
description: "Deep dive into LongCat's architecture evolution (Flash → 2.0), LongCat Sparse Attention, N-gram Embedding module, integration with mainstream agent harnesses, performance benchmarks, and comparisons with peer models."
draft: true
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-longcat)

[Meituan](https://www.meituan.com/)'s **LongCat** series is one of the most closely watched open-weight model families today. From **LongCat-Flash (560B)** to **LongCat-2.0 (1.6T)**, LongCat is purpose-built for long-context reasoning, agentic coding, repo-level understanding, and automated task execution. LongCat-2.0 was released under the MIT license on 2026-06-30, after previously being quietly tested on OpenRouter under the codename "**Owl Alpha**," where its usage briefly topped the leaderboard.

---

## Family overview

| Version | Total parameters | Active parameters | Context | Core positioning | Release date |
|---|---|---|---|---|---|
| **LongCat-Flash** | 560B | ~27B (18.6B–31.3B) | 128K | Efficient agentic coding | 2025 |
| **LongCat-2.0** | 1.6T | ~48B (33B–56B) | 1M (native) | Long-context reasoning + agentic coding | 2026-06-30 |

> ⚠️ LongCat-2.0's 1M context window is **native** — trained from the ground up, not achieved through extrapolation. Training data included 30T+ tokens, with hundreds of billions of tokens at the 1M-token context length.

---

## Architecture evolution: from Flash to 2.0

LongCat-2.0 introduces three **orthogonal** architectural improvements on top of LongCat-Base, each independently enabled or disabled:

### 1. LongCat Sparse Attention (LSA)

LSA is an evolution of DeepSeek Sparse Attention, designed to make 1M-context training and inference feasible on real hardware:

- **Lighter indexer** accelerates long-context processing without sacrificing model quality
- Resolves the quadratic scoring costs and memory fragmentation that plague fine-grained sparse mechanisms
- Unlike LongCat-Flash's Multi-head Latent Attention (MLA), LSA is purpose-built for extreme-length contexts

### 2. N-gram Embedding module

- Extends the embedding space along dimensions **completely orthogonal** to the MoE expert layout
- Adds approximately **135 billion parameters** via a 5-gram token combination framework
- Expands the embedding space by roughly **100×**, improving the model's ability to represent rare tokens and long-range dependencies

### 3. Dynamic token-level compute allocation

- The MoE layout is purpose-built for **coding, reasoning, and interactive tasks** — not generic chatbot performance
- Each token dynamically receives different compute allocation, improving parameter efficiency

---

## Core capabilities

The model generates text and tool-call requests. The host application must provide tools, execute requests, return results, and manage state, audit logs, and concurrency. Workflow examples below describe applications built around the model; a standalone chat request does not execute those workflows.

| Capability | Description |
|---|---|
| **Agentic Coding** | Deeply integrated with mainstream agent harnesses (Claude Code, OpenClaw, Hermes); strong performance on code understanding, repo-level edits, automated task execution, and agentic workflows |
| **Long-context reasoning** | 1M native context, suitable for processing entire codebases, long research reports, legal documents |
| **Repo-level understanding** | Cross-file dependency analysis, large codebase structural comprehension |
| **Tool calling** | Supports `tools` and `tool_choice` function calling; does not support `response_format` (JSON output is not enforced) |
| **Multilingual** | Chinese and English code and natural language processing |

---

## Performance benchmarks

LongCat-2.0's performance on agentic coding and general agent benchmarks:

| Benchmark | LongCat-2.0 | Gemini 3.1 Pro | GPT-5.5 | Claude Opus 4.6 | Claude Opus 4.8 |
|---|---|---|---|---|---|
| **Terminal-Bench 2.1** | 70.8 | 70.7 | 73.8 | — | 78.9 |
| **SWE-bench Pro** | 59.5 | 54.2 | 58.6 | 57.3 | 69.2 |
| **SWE-bench Multilingual** | 77.3 | 76.9 | — | 77.8 | 84.8 |
| **FORTE** | 73.2 | 70.3 | 77.8 | 73.2 | 77.2 |
| **BrowseComp** | 79.9 | 85.9 | 84.4 | 84.0 | 84.3 |

Other benchmarks: IFEval 90.0, GPQA-diamond 88.9, RWSearch 78.8.

> 💡 LongCat-2.0 scores 77.3 on SWE-bench Multilingual, above Gemini 3.1 Pro (76.9) and below Claude Opus 4.6 (77.8). The source lists no comparable GPT-5.5 score. LongCat scores are vendor evaluations; competitor scores in these coding rows are cited from their official reports.

---

## Training hardware: domestic chip cluster

LongCat-2.0's pre-training and large-scale deployment were completed entirely on a **50,000-card domestic AI ASIC superpod cluster**:

- This is the largest known LLM trained entirely on Chinese domestic chips
- Training stability was a key challenge: keeping a large-scale cluster stable enough to finish pre-training, not merely launching a single large run
- LongCat-Flash inference, by contrast, uses H800 GPUs

---

## License and access

| Item | Details |
|---|---|
| **License** | MIT (subject to its license terms) |
| **OpenRouter** | `meituan/longcat-2.0`, $0.30/M input, $1.20/M output; Cache Read $0.006/M |
| **Hugging Face** | `meituan-longcat/LongCat-2.0` (FP8 / INT8 versions available) |
| **API** | [longcat.chat](https://longcat.chat/) offers Token Pack flash-sale pricing |
| **Local deployment** | Requires large GPU clusters (1.6T MoE); FP8/INT8 versions reduce hardware requirements |

> 💡 OpenRouter lists $0.30/M input, $1.20/M output, and $0.006/M cache reads at the time of this check; provider pricing can change.

---

## Version comparison and selection guide

| Need | Recommended version | Reason |
|---|---|---|
| Strongest agentic coding + 1M context | **LongCat-2.0** | 1.6T total params, LSA, N-gram Embedding, native 1M context |
| High-throughput everyday coding | **LongCat-Flash** | 560B is lighter; 128K context suffices for most scenarios |
| Extreme context (entire book / entire repo) | **LongCat-2.0** | 1M native training, not extrapolated |

---

## Ideal use cases

| Use case | Description |
|---|---|
| **Repo-level editing** | Analyze an entire codebase within 1M context, perform cross-file modifications |
| **Agentic coding agent** | Integrated with Claude Code / OpenClaw / Hermes for multi-step development tasks |
| **Long-document analysis** | Process complete research reports, legal documents, technical specifications |
| **Multilingual code** | Chinese and English code understanding and generation |
| **Automated tasks** | Tool calling + multi-step reasoning |

---

## Limitations and caveats

- **JSON output not enforced**: `response_format` is not supported; JSON output must be ensured through prompt formatting
- **Local deployment barrier**: 1.6T MoE requires large GPU clusters; recommend using OpenRouter or Hugging Face hosted versions
- **Community validation ongoing**: LongCat-2.0 was released less than half a year ago; architecture and performance claims still need validation outside Meituan's own environment
- **Chip supply chain risk**: Heavy reliance on Chinese domestic AI chips; future supply may be affected by policy changes

---

## Related posts

- [Cohere North: Cohere's First Agentic Coding Family](/posts/tech/2026-10-10-ai-model-family-cohere-north-en)
- [NVIDIA Nemotron Series](/posts/tech/2026-10-10-ai-model-family-nemotron-en)
- [Apodex: Long-horizon Research Model](/posts/tech/2026-10-10-ai-model-family-apodex-en)
- [Liquid AI: Compact Reasoning Model](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)
- [Dots Studio Dots: Open-weight MoE Model Family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

---

## References

- [LongCat-2.0 official announcement](https://longcat.chat/blog/longcat-2.0)
- [Hugging Face: meituan-longcat/LongCat-2.0](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [OpenRouter: LongCat 2.0](https://openrouter.ai/meituan/longcat-2.0)
- [Reuters: China's Meituan says new AI model trained on domestic chips](https://www.reuters.com/world/china/chinas-meituan-says-new-ai-model-trained-domestic-chips-2026-06-30/)
- [Geopolitechs: LongCat-2.0 — China's Most Unexpected AI Model](https://www.geopolitechs.org/p/longcat-20-chinas-most-unexpected)
- [VentureBeat: Meituan open sources LongCat-2.0](https://venturebeat.com/technology/meituan-open-sources-longcat-2-0-the-1-6t-near-frontier-agentic-coding-model-thats-been-leading-openrouter-trained-entirely-on-chips)
- [MarkTechPost: Meituan Releases LongCat-2.0](https://www.marktechpost.com/2026/07/05/meituan-releases-longcat-2-0-a-1-6t-parameter-open-moe-model-with-native-1m-context-and-longcat-sparse-attention)

---

*Last updated: 2026-10-10. LongCat-2.0 is a newly released model; specs and policies may change. Always refer to official documentation.*
