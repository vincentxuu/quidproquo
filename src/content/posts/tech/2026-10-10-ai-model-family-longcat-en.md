---
title: "The LongCat Series: Meituan's Open Agentic Coding Model Family, with 2.5 Adding Native Vision and Long-Horizon RL"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: en
tldr: "LongCat is Meituan's open-weight MoE family. The current workhorse, LongCat-2.5 (2026-11-01), keeps 2.0's 1.6T total parameters, about 48B active, and 1M context, and adds native vision through discrete tokens plus large-scale long-horizon RL; on the official table, DeepSWE rose from 9.7 for 2.0 to 64.6. The weights are MIT-licensed, and the API's limited-time price is $0.30/$1.20 with cached input at $0.006. This post uses the official model cards and API docs to cover architecture, evaluation, deployment, and selection."
description: "The LongCat model family: LongCat-2.5 specs and pricing, the Flash→2.0→2.5 evolution, dynamic MoE, LSA sparse attention and discrete visual tokens, MIT weight licensing, deployment on domestic accelerators, and agent selection."
draft: false
series:
  name: "AI Model Families"
  order: 30
---

> :globe: [繁體中文版](/posts/tech/2026-10-10-ai-model-family-longcat)

Meituan's **LongCat** is an open-weight language model family. The Flash generation uses a dynamic MoE to allocate compute per token; 2.0 pushed toward long context and coding agents; 2.5 folds vision into the same token stream and adds agentic coding through large-scale long-horizon reinforcement learning. This post is for agent developers evaluating LongCat: which version to use today, which tasks it is strong at, and what self-hosting requires.

## Family positioning and model matrix

Compiled from the [LongCat-2.5 model card](https://huggingface.co/meituan-longcat/LongCat-2.5) and the [LongCat API docs](https://longcat.chat/platform/docs/api-pay-as-you-go), checked on 2026-11-20:

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| LongCat-2.5 | Current workhorse | 1.6T / ~48B active, 1M context, native vision, thinking can be toggled | MIT weights (plus a W4A4 quantized version); official API $0.30/$1.20 (limited-time), cached input $0.006 |
| LongCat-2.0 | Previous generation | Same scale, text-only, LSA sparse attention | MIT weights (plus FP8 and INT8 versions) |
| LongCat-Flash series | Earlier generation | 560B, ~27B dynamically active on average, 128K; includes Chat, Thinking, Omni, Lite | MIT weights |

The official API's pay-as-you-go plan currently supports only LongCat-2.5 and is compatible with OpenAI and Anthropic formats; there are also 30-day Token Packs and tiered discounts by monthly spend (up to 40% off). "Fewer active parameters" describes per-token compute and can't be used to estimate total weight storage: the 2.5 HuggingFace repo is about 3.56TB.

## Family evolution

Compiled from the [meituan-longcat HuggingFace organization](https://huggingface.co/meituan-longcat) and official announcements; months come from repo creation times and may precede public release by a few days:

| Version | Date | What changed for selection | On this site |
|---|---|---|---|
| LongCat-Flash-Chat | 2025-08 | 560B dynamic MoE allocating compute by token difficulty; non-thinking chat, code, and tools | — |
| LongCat-Flash-Thinking | 2025-09 | Adds a reasoning mode | — |
| LongCat-Flash-Omni | 2025-10 | Multimodal-input Flash variant | — |
| Flash-Thinking-2601 / Flash-Lite | 2026-01 | Reasoning update; Lite introduces N-gram Embedding | — |
| LongCat-Next | 2026-03 | Research model with discrete visual tokens, later the basis of 2.5's vision | — |
| LongCat-2.0 | 2026-07 | 1.6T / ~48B, 1M context, LSA sparse attention; shifts toward long context and codebase edits | — |
| **LongCat-2.5** | 2026-11-01 (API) / early November (weights) | Native vision + long-horizon RL, with large agentic coding gains; the API starts pay-as-you-go billing | [Model card](/posts/daily/2026-11-15-model-meituan-longcat-2-5-en) |

The turning point is a shift from "saving compute" to "finishing long tasks": Flash addressed how much compute each token deserves, 2.0 addressed the cost of 1M context, and 2.5 addresses whether the model can carry a long task through. 2.0 is now the previous generation in this post; its evaluation table remains on the [2.0 model card](https://huggingface.co/meituan-longcat/LongCat-2.0), and 2.5's comparison table also lists 2.0's scores.

## Architecture and training trade-offs

### Flash: spend compute where tokens need it

The dynamic compute mechanism on the [Flash model card](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat) uses zero-computation experts to allocate expert compute by context; Shortcut-connected MoE creates more room to overlap computation and communication. That is the core engineering issue for large MoEs: once compute is saved, cross-device communication can still become the bottleneck.

### 2.0: lowering long-context indexing cost

LongCat Sparse Attention (LSA) targets the indexing cost and fragmented memory access of sparse attention by combining three designs:

- **Streaming-aware Indexing**: combines contiguous access with dynamic token selection to improve memory reads.
- **Cross-Layer Indexing**: adjacent layers reuse index results, cutting repeated indexing.
- **Hierarchical Indexing**: coarse block-level filtering first, then token selection within candidate blocks.

These three are **internal improvements to LSA**; LSA, N-gram Embedding, and dynamic MoE should not be lumped together as three independently switchable modules. 2.0 also carries over Flash-Lite's **N-gram Embedding**, scaling parameters along a sparse dimension outside the MoE; it adds representational capacity, but it is not a search index and does not store task progress for the host program.

### 2.5: vision becomes tokens, and training shifts to long-horizon RL

Per the [LongCat-2.5 official blog](https://longcat.ai/blog/longcat-2.5/) and model card, 2.5 changes three things:

- **Discrete visual tokens**: following LongCat-Next, native-resolution image features are converted into multi-level discrete tokens via residual vector quantization (RVQ), sharing the same backbone and token stream as text. The vision encoder disappears from the training graph, and image tokens can be precomputed and cached offline, which makes data packing and load balancing easier. The cost is that visual information passes through quantization, so how much detail survives depends on the tokenizer.
- **Long-horizon RL**: training tasks and verifiable test environments are synthesized from GitHub PRs and issues, and real agent failure trajectories are turned into reproducible training tasks; environments block network access, strip git history, and use an LLM judge to audit for exploits. Training also mixes harnesses, which Meituan says improves cross-harness generalization.
- **Multi-teacher distillation**: 2.0's agent, reasoning, and interaction expert models are kept as teachers, and their capabilities are folded into the main model through full-vocabulary KL distillation with Tree Attention.

On infrastructure, 2.5 runs long-sequence training on domestic AI accelerators with under 80GB of memory per card, and Meituan reports 86% higher per-device throughput for its FSDP setup over a DDP baseline. Inference uses W4A4 (4-bit expert weights and activations), and Meituan's online stress tests show 42.77% higher decode throughput than W8A8. These are all self-reported figures.

## Evaluation and alternatives

### How to read 2.5's evaluation table

The 2.5 model card notes that scores marked `*` are cited from other models' official reports or leaderboards, while unmarked scores are Meituan's internal measurements and only indicative. Most rivals are the versions available at release (Claude Opus 5, GPT-5.6-Sol, Kimi K3, DeepSeek-V4.1-Flash), not the later Opus 5.5 or K3.1 Pro.

| Benchmark | LongCat-2.5 | LongCat-2.0 | Claude-Opus-5 | DeepSeek-V4.1-Flash |
|---|---|---|---|---|
| DeepSWE v1.1 | 64.6 | 9.7 | 68.8* | **74.2*** |
| Terminal Bench v4.0 | 38.5 | 3.0 | **53.9*** | 31.2* |
| NL2Repo | 60.5 | 40.9 | **75.3*** | 65.4* |
| SWE Atlas - Codebase QnA | 58.3 | 33.1 | **63.2*** | 55.2 |
| BrowseComp | **91.9** | 79.9 | 90.8* | 91.5 |
| MCP Atlas | 83.1 | 61.8 | **85.8*** | 84.4 |
| HLE (w/ tools) | 63.1 | 37.5 | **64.7*** | 63.9* |
| Vision2Web | 78.6 | — | **80.2*** | 79.2 |

How to read this table: 2.5's gains over 2.0 concentrate in agentic coding, with several-fold to tenfold jumps on DeepSWE and Terminal Bench v4.0; web browsing and search (BrowseComp) is the highest in the table. But most coding and tool items still trail Claude Opus 5, and DeepSWE also trails DeepSeek-V4.1-Flash. 2.0 scored only 3.0 on Terminal Bench v4.0, which means 2.0 itself is not suited to running terminal agents directly.

When choosing, check the harness, tool permissions, reasoning budget, and success criteria. More useful measurements for your product are: whether cross-file edits pass tests, whether tool arguments are correct, whether the model recovers after failures, and the total cost to complete a task.

For further comparison, see the [NVIDIA Nemotron series](/posts/tech/2026-10-10-ai-model-family-nemotron-en), the [Cohere North model family](/posts/tech/2026-10-10-ai-model-family-cohere-north-en), the [Apodex model family](/posts/tech/2026-10-10-ai-model-family-apodex-en), the [Liquid AI model family](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en), the [Dots model family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en), and the other large open-weight families [Kimi](/posts/tech/2026-08-24-ai-model-family-kimi-en) and [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek-en).

## Licensing, pricing, and deployment

### License

The 2.5, 2.0, and Flash weights are all MIT ([2.5 LICENSE](https://huggingface.co/meituan-longcat/LongCat-2.5/blob/main/LICENSE)); the 2.0 model card adds that no rights to Meituan's trademarks or patents are granted. Compared with the custom licenses from Kimi, Qwen, and MiniMax, MIT has no revenue threshold or attribution requirement beyond keeping the copyright and license notice. That is LongCat's clearest difference among large open-weight models.

### API pricing

Per the [LongCat-2.5 pricing page](https://longcat.chat/platform/docs/pricing/longcat-2.5), per 1M tokens:

| Item | Limited-time price (USD) | CNY |
|---|---|---|
| Uncached input | $0.30 | ¥2 |
| Cached input | $0.006 | ¥0.04 |
| Output | $1.20 | ¥8 |

- The official page labels these as limited-time discounted prices and says the platform and billing records are authoritative; don't assume they hold for long-term budgets.
- Only successful responses (HTTP 200) are billed; after enterprise verification, monthly spend of $75 / $300 / $1,200 / $6,000 earns 10% to 40% off ([FAQ](https://longcat.chat/platform/docs/FAQ.html)).
- Cached input is 2% of uncached input, so agent workloads that reuse long prefixes get much cheaper.

### Deployment

The 2.5 model card currently lists only an NPU deployment path (SGLang-FluentLLM); 2.0 also lists an SGLang cookbook for GPUs. Meituan's training and quantization are designed for domestic accelerators, and the W4A4 version assumes native INT4 compute. Before self-hosting 2.5 on NVIDIA GPUs, confirm inference framework support; the full weights are about 3.56TB and the W4A4 version about 1.34TB (HuggingFace repo sizes), so multiple nodes are required.

Third parties such as [OpenRouter](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints) and Vercel AI Gateway also route LongCat; supported parameters (for example, whether `response_format` is available) depend on each endpoint's current data. If you need JSON, check whether the provider supports enforced structured output, and validate the schema in your host program anyway.

## Agent integration and selection

The model produces text and tool-call requests; the host program must provide tools, execute requests, return results, and manage state, permissions, and audit logs. The 2.5 model card evaluates with harnesses such as Claude Code, mini-swe-agent, and Codex, which means those integrations have official data — not that every harness version works out of the box.

| Need | Evaluate first | What to verify |
|---|---|---|
| Low-cost coding agent with an MIT license | LongCat-2.5 | Whether cross-file edits pass tests; success rate on terminal-style tasks |
| Research and web-search agents | LongCat-2.5 | Real accuracy and cost on BrowseComp-style tasks |
| Coding from screenshots and UIs | LongCat-2.5 (thinking on) | How much detail discrete visual tokens preserve |
| Latency-sensitive general chat | LongCat-2.5 (thinking off) | Quality drop with thinking disabled |
| Self-hosted service | 2.5 W4A4 or 2.0 FP8 / INT8 | Inference framework and hardware support, full-weight and KV-cache memory |

A practical trial sequence: first ask the model to explain cross-file dependencies, then ask it to change a small feature, and finally inspect the diff, run tests, and log tool failures. With thinking on, Meituan recommends keeping historical reasoning content in multi-turn conversations (`save_history_reasoning_content`).

## Limitations and trade-offs

- **Evaluations are mostly self-run**, rivals are the versions available at release, and independent reproductions haven't appeared yet.
- **The API price is a limited-time price**, not a long-term commitment.
- **Self-hosting is demanding**: 3.56TB of weights, with official deployment paths centered on NPUs.
- **Vision is discretized**: it saves vision-encoder compute and engineering complexity, but you need to test how much image detail survives.
- **Long context doesn't mean remembering a whole codebase**: 1M context was trained, but retrieval accuracy on long inputs still needs validation on your own data.

LongCat trades a large sparse model for long-context and agent capability, and lowers the bar for commercial use with an MIT license. Start with one testable workflow before deciding whether to expand.

## Update history

- **2026-11-20**: Added the LongCat-2.5 generation. The matrix, architecture, evaluation, pricing, and selection were rewritten (LongCat-2.5 official blog, HuggingFace model card and LICENSE, LongCat API pricing and FAQ, and the HuggingFace organization's model list, read 2026-11-20); added discrete visual tokens, long-horizon RL, multi-teacher distillation, W4A4 quantization, and API billing rules. The family evolution section previously said a full release timeline had not been compiled; it now covers Flash through 2.5. LongCat-2.0 is now the previous generation; the earlier OpenRouter curl example for 2.0 was removed, replaced by a note that third-party endpoint parameters depend on current data.
- 2026-10-11: Reorganized sections to the shared family format and added a model matrix from existing data; fact-check dates carried over from earlier records.
- 2026-10-11: Rewrote architecture, deployment, and capability boundaries from official model cards and endpoint data, removed unverified dates, hardware counts, and ranking claims, and published the draft.

## References

- [Introducing LongCat-2.5 — official blog](https://longcat.ai/blog/longcat-2.5/)
- [meituan-longcat/LongCat-2.5 — HuggingFace model card](https://huggingface.co/meituan-longcat/LongCat-2.5)
- [LongCat-2.5 LICENSE (MIT) — HuggingFace](https://huggingface.co/meituan-longcat/LongCat-2.5/blob/main/LICENSE)
- [LongCat-2.5 pricing — LongCat API docs](https://longcat.chat/platform/docs/pricing/longcat-2.5)
- [LongCat API Pay-As-You-Go — LongCat API docs](https://longcat.chat/platform/docs/api-pay-as-you-go)
- [FAQ — LongCat API docs](https://longcat.chat/platform/docs/FAQ.html)
- [meituan-longcat — HuggingFace organization](https://huggingface.co/meituan-longcat)
- [LongCat-2.0 official model card and deployment entry](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [LongCat-Flash-Chat official model card](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)
- [OpenRouter LongCat-2.0 endpoint data](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints)
- [LongCat official code repository](https://github.com/meituan-longcat/LongCat-2.0)
- [Model card: LongCat-2.5](/posts/daily/2026-11-15-model-meituan-longcat-2-5-en) — this site
