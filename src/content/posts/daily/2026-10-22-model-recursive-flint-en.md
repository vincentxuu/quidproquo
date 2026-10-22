---
title: "Model Card: Recursive Flint"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, model-release, daily, recursive, model-family-flint]
lang: en
description: "A one-year-old startup valued at $4.65B just shipped its first model, Flint — 40B total parameters with only 2.5B active, nearly twice as fast as comparable models on a MacBook Pro, and built almost entirely by the company's own automated research system, 'Eureka Machine.'"
tldr: "Recursive Flint: a 40B-parameter MoE model (256 routed experts plus 1 shared expert, 6 routed experts active per token, ~2.5B active parameters), 262,144-token native context (official guidance caps practical use at 256K), Apache 2.0 license, released 2026-10-21 and covered by both TechCrunch and Wired. It scores 74.2% on SWE-bench Verified (edging out Qwen3.6-35B-A3B's own-reported 73.4%), 89.7% on SWE-bench Pro v2, 54.9% on Terminal-Bench 2.1, and 80.3% on LiveCodeBench v6 — the best self-reported scores among MoE models under 50B parameters. On a MacBook Pro M4 Pro it hits 131 tokens/s, nearly double the 58–69 tokens/s of comparable models like Gemma 4 and NVIDIA's Nemotron 3.5 Lightning, and tops 150 tokens/s on an RTX Spark. Quantizing to NVFP4 costs only 0.7 points versus the 16-bit checkpoint. There's no official paid API — Flint is a download-and-run open-weight model, though OpenRouter currently lists a free promotional hosted version. Recursive is led by Richard Socher, Salesforce's former chief scientist, and emerged from stealth in May 2026 with $650M raised at a $4.65B valuation. Flint is the company's first public model, and its headline claim is that almost the entire build pipeline — architecture search, quantization recipe, inference kernels — was handled by Recursive's own automated R&D system, the Eureka Machine, with a small team shipping it in under four months."
series:
  name: "AI Model Tracker"
  order: 55
glossary:
  - term: "Flint"
    def: "Recursive's first public model — a 40B-total/2.5B-active-parameter MoE model for agentic coding, positioned as a local coding-agent backbone that runs on an ordinary laptop"
  - term: "Eureka Machine"
    def: "Recursive's in-house automated AI research system, which proposes ideas, implements them, runs experiments, and decides what to try next; the company says it drove nearly the entire Flint build pipeline — architecture search, quantization recipe, inference kernels"
---

> 🌏 [中文版](/posts/daily/2026-10-22-model-recursive-flint)

## Model Overview

| Item | Value |
|---|---|
| Model ID | `RecursiveSI/flint` |
| Vendor | Recursive (AI startup; CEO Richard Socher, Salesforce's former chief scientist) |
| Parameters | 39.8B total / ~2.5B active (including the output head; the active body alone is ~2.2B. MoE: 256 routed experts + 1 shared expert, 6 routed experts selected per token) |
| Context Window | 262,144 tokens (documented configuration; official guidance recommends staying within 256K, with the blog mentioning extension up to 512K) |
| Input Price (USD/1M tokens) | N/A — open-weight, local-only model with no official paid API; OpenRouter currently offers a free promotional hosted version |
| Output Price (USD/1M tokens) | N/A (same as above) |
| Open Source | Yes (Apache 2.0) |
| Release Date | 2026-10-21 |
| Official Announcement | [Recursive Blog: Introducing Flint](https://recursive.com/updates/introducing-recursive-flint) |
| HuggingFace | [RecursiveSI/flint](https://huggingface.co/RecursiveSI/flint) |
| Family | Flint (Recursive's first public model; no predecessor) |

## Key Capabilities

- 74.2% on SWE-bench Verified — Recursive's own benchmarking edges out Qwen3.6-35B-A3B's self-reported 73.4%, the best score Recursive claims among MoE models under 50B total parameters
- With only ~2.5B active parameters (40B total), Flint hits 131 tokens/s on a MacBook Pro M4 Pro using Recursive's own inference engine — nearly double the 58–69 tokens/s of comparable models like Gemma 4 and NVIDIA's Nemotron 3.5 Lightning; it tops 150 tokens/s on an NVIDIA RTX Spark
- Quantizing to NVFP4 costs just 0.7 points versus the 16-bit checkpoint. The approach: quantize the output layer (lm_head) to 4 bits too — unusual in practice — then run offline distillation where the quantized model trains on its own sampled responses, cutting training steps nearly in half versus standard quantization-aware training
- Recursive says almost the entire build pipeline — architecture search, quantization recipe, inference kernel optimization — was handled by its own automated research system, the Eureka Machine, with a small team building Flint from scratch in under four months

## Benchmark Performance

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| SWE-bench Verified | 74.2% | First release (Recursive's debut model, no predecessor) | Qwen3.6-35B-A3B: 73.4% (self-reported on Qwen's own model card) |
| SWE-bench Pro v2 | 89.7% | First release | Only shown as an aggregate ranking chart; no matching per-benchmark competitor score published |
| Terminal-Bench 2.1 | 54.9% | First release | Same as above |
| LiveCodeBench v6 | 80.3% | First release | Same as above |

⚠️ All figures above are Recursive's own self-reported results from the model card and blog (temperature 1.0, top-p 0.95, top-k 20; agentic tasks averaged over at least 5 attempts, pass@1), with no independent third-party reproduction yet. In Recursive's aggregate ranking across six tests — Terminal-Bench 2.1, SWE-Bench Pro v2, SWE-Bench Verified, LiveCodeBench v6, IFBench, and IFEval — only Alibaba's Qwen3.8-27B (a dense model with all 27B parameters active) scored higher than Flint; Recursive's blog doesn't break out Qwen3.8-27B's individual per-benchmark scores.

## Versus Predecessors and Competitors

Flint is Recursive's first public model, so there's no predecessor to compare against — the relevant yardstick is "sub-50B coding models that run on consumer hardware." In that bracket, Flint's position is clear: it beats the comparable MoE model (Qwen3.6-35B-A3B) using only 2.5B active parameters, and it's faster too — 131 tokens/s versus the 58–69 tokens/s of Gemma 4 and NVIDIA Nemotron 3.5 Lightning, nearly double. Against larger dense models, Recursive itself concedes that Qwen3.8-27B (dense, all 27B parameters active) still beats Flint on the six-test average — but Qwen3.8-27B lacks MoE's inference efficiency and runs far slower in practice.

Compared with Meta's Muse Spark Open, which also launched last week with a local-deployment pitch, the two aren't remotely in the same weight class: Muse Spark Open has 816B total parameters and needs terabyte-scale memory, while Flint's 39.8B total parameters run on a MacBook with 48GB of memory — a more than 20x size gap. Flint targets "local development on an ordinary laptop," not "high-end workstation or cloud-scale deployment."

Pricing also breaks from how most model-card comparisons work: Flint has no official API service at all — it's a download-and-run open-weight model with no per-token fee. OpenRouter currently lists it as a free hosted option, but that's a promotional listing, not a long-term pricing commitment from Recursive.

## Implications for Agent Development

Flint's real significance isn't just another model release — it's a public case study for "building a model with an automated research system." Recursive says nearly the entire architecture search, quantization recipe, and inference kernel optimization were handled by the Eureka Machine, and the company's stated long-term goal is for each model generation to make the Eureka Machine a better researcher, which in turn builds the next model faster.

- **If you're building a local, privacy-sensitive coding agent**: Flint may be a solid pick in this weight class right now — no API key, code never leaves the machine, and it runs on a single consumer GPU or Apple Silicon laptop while leading its class on SWE-bench Verified (74.2%).
- **If you're building an agent that needs long, autonomous planning**: Recursive itself warns that Flint needs more guidance than larger closed-source models and recommends breaking tasks into smaller steps with explicit instructions — a sign it's less reliable than Claude or Codex at long-horizon planning and error recovery. The agentic benchmarks themselves cap task timeouts at 5 hours.
- **Not a fit**: for workloads needing very large context — Flint's documented ceiling is 262,144 tokens, with official guidance recommending no more than 256K, far below million-token-class models — or multimodal input, since Flint is text-only in and out. It's also not a fit for teams that need vendor SLAs and a ready-made paid API, since Flint has no hosted service and anyone wanting a stable production deployment has to handle their own hosting and monitoring.

## Today's Takeaway

The interesting part here isn't the benchmark numbers — it's that Recursive made "building a model with an AI research system" the headline, not a footnote. The company's name itself is Recursive (Recursive Superintelligence), and its stated goal is recursive self-improvement: each model generation makes the Eureka Machine — the system doing the research — better, which then builds the next model faster. That's the reverse of how most vendors frame a launch, where the automation tooling gets a passing mention after the model's numbers. Flint's actual performance numbers read more like a demonstration of that pipeline than the main event.

## References

- [RecursiveSI/flint · Hugging Face](https://huggingface.co/RecursiveSI/flint)
- [Recursive Blog: Introducing Flint](https://recursive.com/updates/introducing-recursive-flint)
- [TechCrunch: Recursive launches Flint, a laptop coding model it says was largely built by AI](https://techcrunch.com/2026/10/21/recursive-launches-flint-a-laptop-coding-model-it-says-was-largely-built-by-ai)
- [tech.eu: Recursive Superintelligence emerges from stealth with $650M raise](https://tech.eu/2026/05/13/recursive-superintelligence-emerges-from-stealth-with-650m-raise/)
- [r/LocalLLaMA: RecursiveSI/flint (40B A2.5B) · Hugging Face](https://www.reddit.com/r/LocalLLaMA/comments/1xbqik0/recursivesiflint_40b_a25b_hugging_face/)
