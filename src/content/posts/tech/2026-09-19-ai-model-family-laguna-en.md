---
title: "Laguna: From a 33B Local Workhorse to 118B Long-Horizon Reasoning, Poolside's Three-Releases-in-Three-Months Bet"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, poolside, model-family-laguna, moe, open-source, agentic-coding, model-selection]
lang: en
tldr: "Laguna is Poolside's agentic coding model family: XS 2.1 packs 33B-A3B into a 36GB Mac, while S 2.1 brings 118B-A8B with 1M context to 70.2% on Terminal-Bench 2.1 and 40.4% on DeepSWE, both open under OpenMDW-1.1."
description: "Complete guide to the Poolside Laguna model family: evolution from April to July 2026, architecture and training differences between XS 2.1 and S 2.1, selection matrix for 118B-A8B vs 33B-A3B, OpenMDW-1.1 open weights and deployment ecosystem, and a selection guide for agent builders"
series:
  name: "AI 模型家族"
  order: 21
draft: false
glossary:
  - term: "Laguna"
    definition: "Poolside's agentic coding model family. Current lineup is XS 2.1 (33B) and S 2.1 (118B), succeeding M.1 and XS.2, all text-to-text MoE models."
  - term: "DFlash"
    definition: "Draft model Poolside trains for Laguna speculative decoding. Paired with the main model it roughly doubles local inference throughput."
  - term: "preserved thinking"
    definition: "Keeping prior assistant reasoning blocks in message history for the next steps. The recommended way to run Laguna in agent settings; dropping them stops further reasoning."
---

> 🌏 [中文版](/posts/tech/2026-09-19-ai-model-family-laguna)

On July 21, 2026, [Poolside](https://www.poolside.ai/models) released [Laguna S 2.1](https://poolside.ai/blog/introducing-laguna-s-2-1) — a 118B-total, 8B-active MoE with 1M context, scoring 70.2% on [Terminal-Bench 2.1](https://trajectories.poolside.ai/) and 40.4% on [DeepSWE](https://trajectories.poolside.ai/?benchmark=deep-swe). It went from the start of training to the launch post in under nine weeks, on exactly the same pre-training data as the small model from two months earlier. This is the twenty-first family deep-dive in the "AI 模型家族" series, tracing Laguna from the [M.1 / XS.2](https://poolside.ai/blog/introducing-laguna-s-2-1) dual release through XS 2.1 to S 2.1.

For how to read benchmark numbers in this post, see the [AI model evaluation sources guide](/en/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This post is part of the [AI model landscape overview](/en/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family timeline

| Date | Release | What mattered |
|---|---|---|
| 2025 | Malibu 2.1 / 2.2 | Previous dense agent models, 2.2 reached 128K context; the baseline M.1 was measured against |
| 2026-04-28 | Laguna M.1 / XS.2 dual release | First Laguna generation: M.1 as the 225B-A23B flagship, XS.2 as the 33B-A3B local small one |
| 2026-07-02 | Laguna XS 2.1 | XS.2 refresh: same architecture plus native reasoning, SWE-bench Multilingual from 57.7% to 63.1% |
| 2026-07-21 | Laguna S 2.1 | The full package: 118B-A8B, 1M context, same pre-training data scaled up, first RL run in FP8 |

Three models in three months. The arc is clear: **use M.1 / XS.2 to expose weaknesses in the harness, data, and training loop, validate the improved recipe on XS 2.1, then scale the whole thing to S 2.1**. The [S 2.1 launch post](https://poolside.ai/blog/introducing-laguna-s-2-1) puts it plainly: "under nine weeks from the start of training to this post", powered by the internal [Model Factory](https://poolside.ai/blog/introducing-laguna-s-2-1) platform. The next, larger Laguna had already started pre-training a week before the post.

## Two sizes, one philosophy

To understand Laguna, accept its default first: **these models are not for chatting, they are for running hundreds of steps inside an agent harness**. The docs say the same thing about [M.1](https://docs.poolside.ai/release-notes/models) and [XS.2](https://docs.poolside.ai/release-notes/models): use them inside [Poolside Agent workflows](https://docs.poolside.ai/cli/pool), not as standalone chat models. S 2.1 and XS 2.1 are no different — supported modes are Agentic + Chat, but peak results all come from the in-house [pool](https://poolside.ai/get-started) terminal coding agent.

**XS line (runs locally)**: [XS 2.1](https://poolside.ai/blog/introducing-laguna-xs-2-1) is 33B total with 3B active and 256K context (262,144 exactly). The official line is "compact enough to run on a Mac with 36 GB of RAM", with FP8, NVFP4, and INT4 checkpoints on [Hugging Face](https://huggingface.co/poolside/Laguna-XS-2.1) plus a [DFlash](https://huggingface.co/poolside/Laguna-XS-2.1-DFlash) draft model that doubles throughput in testing. Paid pricing carries over from XS.2 at $0.10 / $0.20 / $0.05 per 1M input / output / cache-read tokens.

**S line (holds the long run)**: [S 2.1](https://huggingface.co/poolside/Laguna-S-2.1) is 118B total with 8B active and 1M context (1,048,576 exactly). The pitch is "Frontier-class reasoning at mid-size cost", small enough for a single [NVIDIA DGX Spark](https://poolside.ai/blog/introducing-laguna-s-2-1) yet strong enough to beat several 500B+ open models on Terminal-Bench 2.1. On [OpenRouter](https://openrouter.ai/poolside/laguna-s-2-1), the free endpoint offers 256K context while the dedicated paid endpoint unlocks the full 1M at $0.10 / $0.20 / $0.01 (announced July 2026).

Neither size supports vision — text in, text out only. That is deliberate, not an omission: Laguna bets all complexity on the read-repo, edit-file, run-test, verify loop.

## Architecture: one laguna recipe

S 2.1 and XS 2.1 share the same `laguna` architecture and differ only in scale. Per the [S 2.1 model card](https://huggingface.co/poolside/Laguna-S-2.1) and the [XS 2.1 model card](https://huggingface.co/poolside/Laguna-XS-2.1):

* **Routing**: token-choice router with softplus gating, 256 routed experts plus 1 shared expert; S 2.1 takes top-10 per token for about 8B active
* **Attention**: grouped-query attention with 8 KV heads, head dim 128, plus per-head softplus output gating
* **Layers**: S 2.1 has 48 layers (12 global + 36 sliding-window), XS 2.1 has 40 layers (10 global + 30 sliding-window), both at a 1:3 ratio with a 512-token sliding window
* **Vocabulary**: shared family tokenizer at 100,352 tokens
* **Reasoning**: native interleaved thinking that reasons between tool calls; keeping prior reasoning blocks in history works best

S 2.1's BF16 weights run about 236GB and need multiple GPUs; quantized variants lower the bar. XS 2.1 quantizes the KV cache to FP8 so single-GPU and Mac setups stay viable. The standard MoE trade-off applies: **total parameters set the memory floor, active parameters set the per-token cost**.

## Training: same data, different post-training

The most interesting line in the S 2.1 post is this: "trained on exactly the same pre-training data as XS 2.1". The step from XS 2.1 to S 2.1 was scale, training-code fixes, and small recipe changes — not new data. S 2.1 pre-training started May 22, 2026 on 4,096 NVIDIA H200 GPUs for 60 days, listed on the [official site](https://www.poolside.ai/models) at 30T tokens (XS 2.1 is listed at 15T). It is also Poolside's first model with RL done entirely in FP8 precision.

Most of the gap comes from post-training, in two stages. First SFT bootstraps capabilities with partly synthetic data, then RL is reserved for tasks the model still cannot solve at a high pass rate. The corpus spans 409K agentic and non-agentic environments, with 83K terminal setups and 168K standard software-engineering flows. The largest software-engineering source reproduces real commits (about 38,000 tasks across about 17,000 repositories), and S 2.1 adds agentic repository installation: given a repo, install every dependency until the test suite runs.

Three training-loop changes map directly to the "keeps going" behavior: more generous rollout budgets (longer timeouts, more tokens per turn, more turns per task), a new sandbox service (background processes, selective network blocking against reward hacking), and multi-harness rollouts (same prompts across several harnesses to avoid overfitting to one). Quoting co-head of applied research Pengming Wang in the post: "not necessarily add more intelligence, but improve the behaviors" — more verification, fewer assumptions, no early victory laps, more persistence.

The thinking toggle is the receipt: S 2.1 ships with only `off` and `max` modes (max by default), and max lifts Terminal-Bench 2.1 from 60.4% to 70.2% and DeepSWE from 16.5% to 40.4%. The cost is mean completion tokens rising from 80K to 129K (TB 2.1) and 99K to 249K (DeepSWE). The disclosed limitations are refreshingly blunt: third-party harnesses with slightly different tool schemas can trigger memorized interfaces, JSON-array arguments can break escaping, and math problems can overthink.

## Family matrix and selection

| | XS.2 (previous) | M.1 (previous) | XS 2.1 (current small) | S 2.1 (current large) |
|---|---|---|---|---|
| Total / active | 33B / 3B | 225B / 23B | 33B / 3B | 118B / 8B |
| Context | 256K | 256K | 256K | 1M |
| SWE-bench Verified | 64% | 65.4% | 70.9% | — (see Multilingual / Pro instead) |
| SWE-bench Multilingual | 60% | 57.4% | 63.1% | 78.5% |
| Terminal-Bench | 29% (2.0) | 32.7% (2.0) | 37.5% (2.0) | 70.2% (2.1) |
| Position | Fast local iteration | Large multi-step jobs | Local fast iteration plus reasoning | Long-horizon flagship |
| Local run | Mac-friendly | Multi-GPU | 36GB Mac works | Single DGX Spark |

The selection logic is blunt: **for local, fast, and cheap — XS 2.1; for 1M long runs and leaderboard scores — S 2.1**. M.1 and XS.2 are transitional now; XS.2 sunset on the in-house API a week after XS 2.1 launched and lives on only as [Baseten](https://poolside.ai/blog/introducing-laguna-xs-2-1) dedicated deployments.

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("POOLSIDE_API_KEY"),
    base_url="https://inference.poolside.ai/v1",
)
resp = client.chat.completions.create(
    model="poolside/laguna-s-2.1",
    messages=[{"role": "user", "content": "What are channels in Go?"}],
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(resp.choices[0].message.content)
```

## Open strategy and ecosystem

Both current Laguna models ship under [OpenMDW-1.1](https://openmdw.ai/), fully permissive with no extra permission needed for commercial use. S 2.1 arrived day one with BF16, FP8, INT4, and NVFP4 plus official GGUF and MLX conversions; XS 2.1 offers BF16, FP8, NVFP4, and INT4. The M.1 era used Apache 2.0, and the 2.1 generation moved wholesale to OpenMDW, following the [NVIDIA and Linux Foundation](https://poolside.ai/blog/introducing-laguna-xs-2-1) direction.

The serving ecosystem was day-one complete: [vLLM](https://github.com/vllm-project/vllm), [SGLang](https://github.com/sgl-project/sglang), [Ollama](https://ollama.com/library/laguna-s-2-1) (`ollama run laguna-s-2.1`), llama.cpp, MLX, NVIDIA [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM/pull/13559), plus [Baseten](https://www.baseten.co/library/laguna-s-21/), [OpenRouter](https://openrouter.ai/poolside/laguna-s-2-1), and [Vercel AI Gateway](https://vercel.com/ai-gateway/models?q=laguna). On the agent side it landed in [Kilo](https://kilocode.ai), [Hermes Agent](https://hermes-agent.nousresearch.com/), pi, [OpenCode](https://opencode.ai/), [OpenClaw](https://openclaw.ai/), and [Cline](https://cline.bot/). Every published score ships with full trajectories on [trajectories.poolside.ai](https://trajectories.poolside.ai/), which is more accountability than most score-only releases.

## Where it stands against rivals

Using the official July 21, 2026 table, S 2.1 is best described as "**best fighter outside its weight class**":

* Terminal-Bench 2.1 at 70.2% beats Inkling (975B-A41B, 63.8%), DeepSeek-V4-Pro-Max (1.6T-A49B, 64.0%), and Nemotron 3 Ultra (550B-A55B, 56.4%), but trails Tencent Hy3 (295B-A21B, 71.7%) — let alone flagships like Kimi K3 (2.8T, 88.3%) and Claude Fable 5 (88.0%).
* DeepSWE at 40.4% sits with GLM 5.2 (44.0%) and far below Kimi K3 (69.0%), Claude Fable 5 (70.0%), and Muse Spark 1.1 (53.3%). But it leaves its own XS 2.1 (0.3%) and DeepSeek-V4-Pro-Max (9.0%) far behind — the long-horizon gap is stark.
* SWE-bench Multilingual at 78.5% is actually a bright spot, ahead of Hy3 (75.8%) and Qwen 3.7 Max (78.3%), with SWE-Bench Pro at 59.4% only slightly behind Qwen (60.6%) and Muse Spark (61.5%).

XS 2.1 fights at the 30B level: SWE-bench Verified at 70.9% beats Cohere North Mini Code (67.6%) but trails Qwen3.6-35B-A3B (73.4%) and Claude Haiku 4.5 (73.3%); Terminal-Bench 2.0 at 37.5% beats Haiku (29.8%) but trails Qwen (51.5%) and GPT-5.4 Nano (46.3%). Same conclusion as the official one: leads its weight class, but punching up has a ceiling.

## What it means for agent builders

For **long-horizon coding agents** (multi-file edits, test runs, self-verification): S 2.1 is one of the few open models explicitly tuned for "hundreds of steps without giving up". Keep thinking on, preserve reasoning, and run it in pool or a compatible harness — otherwise DeepSWE-style tasks fall from 40.4% back to 16.5%.

For **local or low-cost agents** (laptop demos, offline setups, fast iteration): XS 2.1 is the saner starting point. It runs on a 36GB Mac, installs via one Ollama command, doubles throughput with DFlash, and its 63.1% Multilingual score is solid at 33B.

Not for: vision (the whole family is text-only), adjustable effort (S 2.1 offers only off / max, no low / mid / high), or zero-friction third-party harnesses (known schema-memory quirks need harness rejections plus retries).

## Overall

Laguna's bet is not "bigger pre-training" but "**better working behavior**" — verify, backtrack, persist. S 2.1 shows the same data with different post-training and a different training loop can jump from XS-level to challenging 500B+ leaderboard entries. The next step is already announced: a larger Laguna is in pre-training, aiming to scale both size and that persistence together.

Two things to watch: how many steps S 2.1's 1M context actually holds together in real repos outside benchmark sandboxes, and whether the OpenMDW-1.1 open strategy buys enough third-party harness adoption to fix the known tool-call rough edges.

## References

- [Poolside: Introducing Laguna S 2.1 (2026-07-21)](https://poolside.ai/blog/introducing-laguna-s-2-1)
- [Poolside: Introducing Laguna XS 2.1 (2026-07-02)](https://poolside.ai/blog/introducing-laguna-xs-2-1)
- [Poolside: Models (S 2.1 / XS 2.1 specs and pricing)](https://www.poolside.ai/models)
- [Poolside docs: Model release notes (M.1 / XS.2 / XS 2.1 / S 2.1)](https://docs.poolside.ai/release-notes/models)
- [Hugging Face: poolside/Laguna-S-2.1](https://huggingface.co/poolside/Laguna-S-2.1)
- [Hugging Face: poolside/Laguna-XS-2.1](https://huggingface.co/poolside/Laguna-XS-2.1)
- [OpenRouter: poolside/laguna-s-2.1](https://openrouter.ai/poolside/laguna-s-2-1)
- [trajectories.poolside.ai: full S 2.1 evaluation trajectories](https://trajectories.poolside.ai/)
