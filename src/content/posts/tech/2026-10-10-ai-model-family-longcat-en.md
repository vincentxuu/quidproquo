---
title: "LongCat Series: Meituan's Open Agentic Coding Model Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: en
tldr: "LongCat-Flash and LongCat-2.0 are Meituan open-weight MoE models. This guide explains dynamic compute, LSA, long context, tool use, and the difference between model specifications and hosted endpoints."
description: "LongCat family guide: Flash and 2.0 architecture, MIT weight licensing, agent responsibilities, endpoint parameters, and deployment tradeoffs."
draft: false
series:
  name: "AI 模型家族"
  order: 30
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-longcat)

Meituan's **LongCat** is an open-weight language model family. LongCat-Flash allocates computation dynamically through MoE; LongCat-2.0 emphasizes long context, code understanding, and multi-step tool use. Model specifications, hosted endpoint limits, and application behavior are separate parts of the selection decision.

## From Flash to 2.0

The following specifications come from the [official Flash model card](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat) and [2.0 model card](https://huggingface.co/meituan-longcat/LongCat-2.0), checked on October 11, 2026.

| Model | Total parameters | Active parameters per token | Official context | Focus |
|---|---|---|---|---|
| LongCat-Flash-Chat | 560B | About 27B on average, dynamically allocated | 128K | Non-thinking chat, coding, and tool use |
| LongCat-2.0 | 1.6T | About 48B | 1M | Long context, repository edits, and agent workflows |

Active parameters describe computation per token, not the storage required for the full model. Deploying a 1.6T MoE still requires planning for all weights, expert placement, context caches, and concurrent requests.

The 2.0 card states that training includes 1M-context data. That supports the claim of long-context training; it does not guarantee complete recall of an entire repository or unchanged accuracy on every long document.

## Why the architecture looks this way

### Flash: allocate computation where it is needed

Flash uses zero-computation experts to vary the compute budget with context. Shortcut-connected MoE creates more room to overlap computation and communication. Communication can remain a bottleneck even after sparse computation reduces arithmetic work.

### 2.0: reduce long-context indexing costs

LongCat Sparse Attention (LSA) addresses expensive sparse-attention indexing and fragmented memory access through three designs:

- **Streaming-aware Indexing** combines contiguous access with dynamic token selection.
- **Cross-Layer Indexing** reuses indexing results across neighboring layers.
- **Hierarchical Indexing** filters blocks before selecting individual tokens from candidates.

These are three improvements **within LSA**. LSA, N-gram Embedding, and dynamic MoE should not be presented as the official three independently switchable modules.

2.0 also inherits **N-gram Embedding** from Flash-Lite, expanding parameters in sparse dimensions outside MoE. Its role is representation capacity. It is neither a search index nor persistent task memory for the host application.

## Model capabilities and the agent's responsibilities

The official card describes integration with harnesses such as Claude Code, OpenClaw, and Hermes, alongside code understanding, repository-level edits, and automated tasks. This describes the integration direction; it does not establish compatibility with every harness version or project.

The model generates text and tool-call requests. The host must provide tools, execute requests, return results, and manage state, permissions, and audit logs. A coding workflow needs file-reading, editing, and test tools, followed by validation on a real repository.

Start by asking the model to explain dependencies across files. Next, request a small feature change, review the diff, run tests, and record tool failures. Loading a repository into context cannot replace these checks.

## Reading performance reports

The 2.0 card lists Terminal-Bench, SWE-bench, and BrowseComp results. Meituan states that unstarred scores were measured in-house, while starred comparison scores were taken from other models' official reports. This is not an independently rerun leaderboard with identical settings for every model.

Check the harness, tool permissions, reasoning budget, and success criteria before drawing comparisons. For a product, measure passing repository edits, correct tool arguments, recovery from failures, and total task cost. The vendor table does not establish an across-the-board win over other families.

## Licensing, endpoints, and an example

The Flash card places weights and source code under MIT. The 2.0 card places model weights under MIT and states that it grants no rights to Meituan trademarks or patents. Retain the notices required by the license; MIT does not mean there are no obligations.

At this check, [OpenRouter's 2.0 endpoint data](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints) lists `meituan/longcat-2.0`, `tools`, and `tool_choice`, but not `response_format`. That describes the endpoint's supported parameters at the time, rather than a permanent restriction on every deployment. Check live endpoint data for pricing.

This minimal HTTP example requires your own API key. No paid inference call was made for this article:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"meituan/longcat-2.0","messages":[{"role":"user","content":"Explain the dependency between these two modules."}]}'
```

If JSON is required, check whether the provider supports enforced structured output. Asking for JSON in a prompt cannot guarantee its format. The host still needs parsing, schema validation, and error handling.

## Deployment and selection

The 2.0 card provides GPU and NPU deployment paths: SGLang's cookbook for GPU, and SGLang-FluentLLM for NPU. It also states that training and large-scale deployment use AI ASIC superpods. That does not restrict users to the same hardware or establish a market conclusion about chip supply chains.

| Need | Starting candidate | What to validate |
|---|---|---|
| Existing Flash tool workflow | LongCat-Flash-Chat | Chat template, tool parsing, and sufficient context |
| Long documents and cross-file changes | LongCat-2.0 | Retrieval accuracy under long input and passing edits |
| Self-hosting | Official deployment guides | Full weights, memory, concurrency, and framework support |

LongCat trades a large sparse model for long-context and agent capabilities. Hosted APIs reduce the self-hosting burden, but endpoint support and task success still require validation. Start with a testable workflow before expanding adoption.

## Related posts

- [NVIDIA Nemotron family](/posts/tech/2026-10-10-ai-model-family-nemotron-en)
- [Cohere North family](/posts/tech/2026-10-10-ai-model-family-cohere-north-en)
- [Apodex family](/posts/tech/2026-10-10-ai-model-family-apodex-en)
- [Liquid AI family](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)
- [Dots family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

## Update history

- 2026-10-11: Reworked architecture, deployment, and capability boundaries using official cards and endpoint data; removed unverified dates, hardware counts, and ranking conclusions; published the draft.

## References

- [Official LongCat-Flash-Chat model card](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)
- [Official LongCat-2.0 model card and deployment links](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [OpenRouter LongCat-2.0 endpoint data](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints)
- [Official LongCat repository](https://github.com/meituan-longcat/LongCat-2.0)
