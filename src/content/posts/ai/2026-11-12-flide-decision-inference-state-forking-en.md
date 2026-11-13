---
title: "Serving Decision Models Fast: Flide's State Forking, Where It Wins, and Its Limits"
date: 2026-11-12
category: ai
type: deep-dive
tags: [llm-inference, vllm, sglang, decision-model, state-forking]
lang: en
tldr: "When several questions share one context, Flide computes the shared state once and forks it per question with answers identical to asking alone; up to 9.5x faster than vLLM and SGLang at best, roughly 1.3x to 3.3x on average for shared-state workloads, and only about 1x to 3x with one question per input."
description: "A guide to the decision-model inference engine Flide (arXiv:2610.42148): how ForkAttention forks state exactly on hybrid models, how much faster it measured on which workloads, and why it does not help when one question is asked of many inputs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-12-flide-decision-inference-state-forking)

[Flide](https://github.com/OmniJev/Flide) (paper: [arXiv:2610.42148](https://arxiv.org/abs/2610.42148), authors from the National University of Singapore and the University of Oxford) is an inference engine built for decision models. A decision model reads a long context, answers several multiple-choice questions about it, and outputs only a probability for each option, with no generated text. Flide computes the shared context once, then forks it into each question, and every answer matches what the model gives when asked that question alone.

The authors claim up to 9.5x faster than vLLM and SGLang, but that is the most favorable setup: the smallest model, with one long article and 18 questions. Before deciding whether to switch, look at the shape of your requests. "One input, many questions" gets the large gap; "one question, many inputs" gets little today.

## What a decision model is and who Flide serves

A decision model takes a state (a conversation, an agent trajectory, an email) and outputs probabilities over options defined in advance for each question. Typical uses are routing requests, scoring answers, and choosing an agent's next step, with the calling program applying a probability threshold such as 0.5.

TypeSafe AI introduced the category in September 2026 with [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), currently a closed, early-access service. The speed and cost figures in that post are the vendor's own, and its benchmark uses the average of large models as the reference answer. Flide serves open models compatible with Jev's `/v1/systemone` API: Open-Jev, OneJev (built by the Flide authors' own team), and general chat models such as Qwen3.5 and Gemma 4.

You need to know what a KV cache and prefix caching are to follow the rest.

## Where current engines waste work

The paper traces the problem to one mismatch: logically a request is a tree (the shared state is the trunk, each question a branch), but current engines do not execute it that way.

**Recomputation.** vLLM and SGLang treat each question as an independent prompt. vLLM has prefix caching, but hybrid models like Qwen3.5 replace most attention layers with Gated DeltaNet recurrent layers, which compress all earlier tokens into one fixed-size state. vLLM's [documentation](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/) says the cache can only resume at a block boundary, so every question recomputes the tokens past the last boundary.

**Shifted answers.** SGLang's multi-item scoring appends all questions to one shared context with a delimiter token before each, which does compute the context once. The delimiter changes each question's hidden states and shifts the probabilities: on Qwen3.5-0.8B the paper measures up to 28.9% of decisions flipping (landing on the other side of the threshold), against at most 2.3% for Flide.

Floating-point summation order also changes with batch size, so the same request can get different answers under different load. Comparing light and heavy load, up to 3.2% of answers change on vLLM, against at most 0.2% on Flide's default mode.

```diagram
title: Logical structure of a request and Flide's physical layout
desc: The shared state is the trunk and three questions are branches; Flide flattens them into one stream where each token carries a branch tag, and each question sees only the shared state and itself.
caption: Simplified from the paper's Figures 1 and 2; tag 0 is the trunk.
---
<svg viewBox="0 0 440 428">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Logical: a tree</text>
  <path class="dg-line" d="M220 104V172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 104V136H132Q124 136 124 144V172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 104V136H308Q316 136 316 144V172" marker-end="url(#arrow)"/>
  <rect class="dg-box dg-box--accent" x="156" y="52" width="128" height="52" rx="6"/>
  <text class="dg-label" x="220" y="69" text-anchor="middle" dominant-baseline="central">State</text>
  <text class="dg-sub" x="220" y="89" text-anchor="middle" dominant-baseline="central">tag 0 (trunk)</text>
  <rect class="dg-box" x="84" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="124" y="193" text-anchor="middle" dominant-baseline="central">Q1</text>
  <text class="dg-sub" x="124" y="213" text-anchor="middle" dominant-baseline="central">tag 1</text>
  <rect class="dg-box" x="180" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="220" y="193" text-anchor="middle" dominant-baseline="central">Q2</text>
  <text class="dg-sub" x="220" y="213" text-anchor="middle" dominant-baseline="central">tag 2</text>
  <rect class="dg-box" x="276" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="316" y="193" text-anchor="middle" dominant-baseline="central">Q3</text>
  <text class="dg-sub" x="316" y="213" text-anchor="middle" dominant-baseline="central">tag 3</text>
  <line class="dg-rule" x1="20" y1="252" x2="420" y2="252"/>
  <text class="dg-heading" x="20" y="280" dominant-baseline="central">Physical: one stream, one pass</text>
  <rect class="dg-box dg-box--accent" x="20" y="300" width="124" height="52" rx="6"/>
  <text class="dg-label" x="82" y="317" text-anchor="middle" dominant-baseline="central">State</text>
  <text class="dg-sub" x="82" y="337" text-anchor="middle" dominant-baseline="central">tag 0</text>
  <rect class="dg-box" x="152" y="300" width="80" height="52" rx="6"/>
  <text class="dg-label" x="192" y="317" text-anchor="middle" dominant-baseline="central">Q1</text>
  <text class="dg-sub" x="192" y="337" text-anchor="middle" dominant-baseline="central">tag 1</text>
  <rect class="dg-box" x="240" y="300" width="80" height="52" rx="6"/>
  <text class="dg-label" x="280" y="317" text-anchor="middle" dominant-baseline="central">Q2</text>
  <text class="dg-sub" x="280" y="337" text-anchor="middle" dominant-baseline="central">tag 2</text>
  <rect class="dg-box" x="328" y="300" width="80" height="52" rx="6"/>
  <text class="dg-label" x="368" y="317" text-anchor="middle" dominant-baseline="central">Q3</text>
  <text class="dg-sub" x="368" y="337" text-anchor="middle" dominant-baseline="central">tag 3</text>
  <text class="dg-sub" x="20" y="380" dominant-baseline="central">Attention: a visibility rule hides siblings</text>
  <text class="dg-sub" x="20" y="404" dominant-baseline="central">DeltaNet: each Q forks from the state's end</text>
</svg>
```

## How Flide does it

**One stream, with the tree kept as GPU data.** Flide flattens a round of requests into a token sequence of the form `[state | question 1 | question 2 ...]`, and each token carries three indices: request, branch, and position. Question positions continue from the end of the state, so the rotary embedding matches what the question would get when asked alone.

**ForkAttention uses a different trick in each layer type.** Full-attention layers use a visibility rule: a token sees only its own request's trunk and its own branch, and nothing in the future. Gated DeltaNet layers have no attention matrix to mask, so each layer runs two calls: the first processes every request's state and saves the recurrent state at its end; the second processes all questions at once, and each question starts from its own request's saved state through an index, without copying anything. The paper proves that in exact arithmetic every question's hidden state equals what you get processing `state + question` in isolation; in floating point the difference stays at rounding level.

**A few CUDA graphs serve every request mix.** Request lengths and question counts live in GPU buffers, and CUDA graphs are indexed only by stream length, so no graph is needed per combination. A decision request takes just a few milliseconds of GPU time, so the saved kernel-launch overhead is why Flide is faster even with one question per state.

**Agent histories can resume.** At each step Flide saves a checkpoint slightly before the end of the state, and the next step computes only the new tokens and a short tail. On SWE-agent trajectories, each extra 1k tokens of history adds about 1 millisecond per step.

**Bitwise determinism is optional.** With `--batch-invariant`, a request returns the same bits under any load, at a cost of at most 10% throughput at 64 clients.

## A concrete example: ten thousand emails, eight questions each

The README's email-triage demo asks eight questions of each of 10,000 emails and tags them, using OneJev on one H200: the whole batch runs 4.1x faster than the fastest other engine, and a single email 3.5x faster.

The call looks like this (from the README):

```bash
uv venv -p 3.12 && source .venv/bin/activate
uv pip install flide torchvision
flide serve --model OmniJev/OneJev1.6-0.8B

curl http://localhost:8000/v1/systemone -H "Content-Type: application/json" -d '{
  "state": "Order #1182 arrived with a cracked screen. The customer asks for a refund and attached two photos.",
  "questions": {
    "action": {"type": "choice", "instructions": "What should support do next?",
               "criteria": {"refund": "refund the order", "replace": "send a replacement", "escalate": "ask a human"}},
    "urgent": {"type": "noul", "instructions": "Does this need a reply within the hour?"}
  }
}'
```

Following this example, put everything shared into `state` and send all questions about one input in a single request. For continuous agent decisions, add `--session-cache-gb 40` so the next step reads only what is new.

## Measured: how much faster in which setting

The comparison in the table below is against the faster of the two baselines in each setting (vLLM or SGLang unless noted), measured in the paper on a single H200.

| Setting | Flide's gap | Conditions |
|---|---|---|
| One long article, 18 questions | 9.5x lower latency, 8.5x throughput | Qwen3.5-0.8B, single client, the best cell |
| One 2k-token state, 64 questions | 12.7x faster (vs vLLM) | Qwen3.5-4B |
| Shared-state workloads, averaged over four model sizes | about 1.3x to 3.3x | Ratios of the averages row in the paper's Table 3; varies by model family and dataset |
| One question per state | about 1x to 3x | Largest for small models on short inputs; near tie for 27B on long inputs |
| An image plus 11 questions | 5.0x to 7.5x | GQA, Qwen3.5 0.8B to 9B |
| Continuous agent decisions | 4.4x to 7.2x steps per second | SWE-agent trajectories |
| Against vllm-jev, the engine written for Open-Jev | about 3x on short inputs, up to 1.7x on long | Open-Jev-2B and 9B |

On accuracy, Flide stays within 1.2 percentage points of vLLM, and its answers are closest to the float32 reference in total variation distance among the engines compared.

## Limits and where it does not help

- **All numbers come from the authors' own tests**: a single H200, a pre-release vLLM, SGLang at default settings, and no third-party reproduction yet. Before relying on it, run the `flide verify` command mentioned in the README on your own model and requests.
- **One question over many inputs gets little.** A Hacker News commenter pointed out this shape is more common in practice; the author replied that the current setup does not help much there and that a future version might put the question first so all states share it.
- **Bidirectional-attention models speed up less.** Models that read the whole prompt both ways, even for the question (the paper's Appendix H lists Jeffan, StartLux, and Lychee), run each question as its own sequence inside the stream. The author said on HN that GLiDE uses bidirectional attention and is not yet supported.
- **The gap is smaller on full-attention models.** On Gemma 4, Flide is 1.1x to 2.9x faster than vLLM, which already caches the shared state. A Hacker News commenter said they modified vLLM and got similar results on such models, without sharing numbers.
- **Exactness holds only to rounding level in floating point.** Bit-identical output needs `--batch-invariant`.
- **Platform.** Prebuilt kernels cover the A40, A10, H100, H200, and the RTX 30 through 50 series. The authors tested only on Linux; on Windows you need WSL2.

## In the end

Flide's trade is simple: it hands the "one state, many questions" structure of decision tasks to the engine, in exchange for computing the shared state once while keeping each answer identical to asking alone. If your workload asks several questions about one email, conversation, or agent trajectory, it is worth running on your own data; if it asks one question about many different inputs, or the model reads bidirectionally, the gain is small today.

The decision-model category is still new: Jev's performance claims come from the vendor, and Flide's speed claims come from its authors. Both have public code to try, but independent third-party numbers are still to come.

## References

- [Flide: Accelerating Decision Inference with Exact State Forking (arXiv:2610.42148)](https://arxiv.org/abs/2610.42148)
- [OmniJev/Flide (GitHub, Apache-2.0)](https://github.com/OmniJev/Flide)
- [Flide project page](https://flide.org/)
- [Introducing System One Models & Jev (TypeSafe AI)](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Automatic Prefix Caching (vLLM documentation)](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/)
- [Show HN: Flide (Hacker News thread)](https://news.ycombinator.com/item?id=50421155)
- Related on this site: [vLLM: From PagedAttention to a Production LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine-en)
