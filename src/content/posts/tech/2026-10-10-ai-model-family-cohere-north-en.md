---
title: "Cohere North: A Purpose-Built Model Line That Starts with North Mini Code for Agentic Coding"
date: 2026-10-10
category: tech
type: deep-dive
tags: [cohere, north, agentic-coding, sparse-moe, programming]
lang: en
tldr: "North is Cohere's line of purpose-built models, currently three: North Mini Code for agentic coding (30B total / 3B active MoE, 256K context, Apache 2.0), North Small Translate for translation (218B / 25B, CC BY-NC), and the 2.4B vision-language model North Micro Vision (Apache 2.0, weights only). This article focuses on Mini Code: `north-mini-code-1.0` on the Cohere API is free until rate limits are reached, production use goes through Model Vault, and OpenRouter no longer has an endpoint for it."
description: "An introduction to Cohere's North model line (North Mini Code, North Small Translate, North Micro Vision) and their license differences, plus North Mini Code's architecture, access through the Cohere API and Model Vault, and how to evaluate a coding agent."
draft: false
series:
  name: "AI Model Families"
  order: 27
---

> :globe: [中文版](/posts/tech/2026-10-10-ai-model-family-cohere-north)

[Cohere](https://cohere.com/)'s **North** series, launched in 2026, adds a model line focused on **Agentic Coding**. **North Mini Code** is the family's first public model: a 30B total / 3B active parameter sparse MoE designed for code generation, testing, and automated development. North later added the translation model North Small Translate and the small vision-language model North Micro Vision, making it a line of single-purpose models. Mini Code can be tried for free through the Cohere API (`north-mini-code-1.0`) until rate limits are reached, or self-hosted from its Apache 2.0 weights.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| North Mini Code | Agentic coding | 30B total / 3B active; 256K context, 64K output | Apache 2.0 weights; Cohere API `north-mini-code-1.0`; Model Vault |
| North Small Translate | Machine translation, 50+ languages | 218B total / 25B active; 16K context | CC BY-NC 4.0 weights; Cohere API `north-small-translate-1.0` (free tier) |
| North Micro Vision | Small vision-language model | 2.4B (2B language model + 400M vision encoder); no tool calling | Apache 2.0 weights; not in the Cohere API model list |
| Command / Embed | Enterprise language, RAG, embeddings | Different role from the coding model | Cohere model products |
| North platform | Enterprise agents | Separate from the North Mini Code model | Cohere enterprise platform |

### North Mini Code: core specifications

| Item | Specification |
|---|---|
| **Model name** | North Mini Code |
| **Trainer** | **Cohere** |
| **Architecture** | Sparse Mixture-of-Experts |
| **Parameters** | 30B total / 3B active |
| **Context** | 256K tokens; max output 64K tokens |
| **License / access** | Apache 2.0 weights; Cohere API `north-mini-code-1.0` (free until rate limits), production via Model Vault |
| **Input modalities** | Text (code, natural language instructions, documentation) |
| **Output modalities** | Code, reasoning explanations, tool calls |

## Family evolution

### Background: from RAG to Agentic Coding

Command and Embed serve enterprise language and embedding workloads; North Mini Code focuses on agentic coding. This product distinction does not establish that Cohere has abandoned RAG or changed its entire corporate strategy. Cohere also offers a North enterprise agent platform; the platform and North Mini Code model are separate products.

| Cohere series | Primary positioning | Representative models |
|---|---|---|
| **Command / Embed** | RAG, embeddings, general conversation | Command A, Embed |
| **North** (new) | Purpose-built models: coding, translation, small vision | **North Mini Code** (30B/3B), North Small Translate, North Micro Vision |

### North model line timeline

| Date | Model | What changed for selection |
|---|---|---|
| 2026-06 | North Mini Code 1.0 | Cohere's first coding-specific model, with commercially usable Apache 2.0 weights |
| 2026-08-12 | North Micro Vision Instruct | A 2.4B vision-language model positioned as a small base for fine-tuning, not a chat assistant |
| 2026-09-10 | North Small Translate 1.0 | Translation becomes a dedicated model; weights are CC BY-NC, so commercial use goes through the API or Cohere |
| 2026-10-05 | North 2 (platform) | A redesign of the enterprise agent platform, not a new model; it shares the North name, so keep the two apart |

North Small Translate's evaluations, hardware requirements, and license details are covered in the [Cohere family article](/posts/tech/2026-08-24-ai-model-family-cohere-en) and are not repeated here. North Micro Vision's model card states that it is not a reasoning model, has limited math and coding ability, does not support tool calling or agent workflows, and was validated only up to an 8K multimodal context. For narrow tasks such as document OCR or chart understanding, plan to fine-tune it on your own data.

## Architecture and training trade-offs

### Architecture and the agent loop

The official model card identifies North Mini Code as a decoder-only sparse MoE Transformer, with sliding-window and global attention. It was post-trained using supervised fine-tuning followed by reinforcement learning with verifiable rewards for agentic coding. The 3B active footprint describes computation per token; the full weights still need to fit in the deployment's memory.

The model accepts text and emits text, including reasoning and tool-call requests. Supply tool descriptions as JSON schemas. The application executes requested tools and returns their results; a model response alone cannot run a test, edit a repository, or inspect a terminal.

The model card recommends retaining the generated thinking content across agent steps. A local deployment also needs matching reasoning and tool-call parsers. Use the current official recipe rather than assuming that any OpenAI-compatible server will parse the output correctly.

## Evaluation and alternatives

This article does not verify candidates for coding agents under a single evaluation setup. Model versions, benchmarks, harnesses, tool permissions, and inference budgets must be aligned before ranking them; use the task checks below to evaluate your workflow.

For related selection questions, compare [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere-en), [Apodex](/posts/tech/2026-10-10-ai-model-family-apodex-en).

## Licensing, pricing, and deployment

### Access and a first request

The Cohere API model ID is `north-mini-code-1.0`, callable through Chat V2, Chat V1, or the OpenAI-compatible Chat Completions endpoint. The official docs state that both trial and production keys are free until rate limits are reached; the limits are 20 requests per minute on trial keys and 500 per minute on production keys, and trial keys are also capped at 1,000 calls per month. Production deployment points to Model Vault, Cohere's dedicated inference environment. The open weights are available under Apache 2.0; an API's account limits and data terms are separate from the weights' license.

The earlier OpenRouter routes `cohere/north-mini-code` and `:free` no longer have working endpoints, so do not use them as an entry point.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["COHERE_API_KEY"],
    base_url="https://api.cohere.ai/compatibility/v1",
)
response = client.chat.completions.create(
    model="north-mini-code-1.0",
    messages=[{"role": "user", "content": "Write a Python palindrome checker and unit tests."}],
)
print(response.choices[0].message.content)
```

This text-generation example does not execute the proposed tests. For an agent evaluation, supply a repository and sandbox, then record the diff, actual test output, number of tool turns, and elapsed time. Compare models using the same task and harness.

## Agent integration and selection

### Ideal use cases

| Use case | Description |
|---|---|
| **Interactive coding assistant** | Developers get real-time coding suggestions, refactoring, and test generation in the IDE |
| **Batch automated development** | Automated test generation, legacy code refactoring, documentation updates |
| **Code review & security** | Proposes security, dependency, and quality findings for independent verification |
| **Education & learning** | Learning programming languages, understanding existing codebase structure |

## Limitations and trade-offs

Treat coding specialization as positioning, not proof that the model underperforms every general model on chat or mathematics. Security review and successful refactoring need actual tests and human inspection. A long context window does not guarantee that every dependency is understood.

The Cohere API's free usage has rate limits and a monthly call cap, and the policy may change. Check your provider's data-retention terms before sending private code; neither “free” nor “official platform” establishes a privacy guarantee. Local open-weight deployment gives control over execution, but requires sufficient hardware and compatible parsers.

## Update history

- 2026-11-23: OpenRouter's `cohere/north-mini-code` and `:free` no longer have working endpoints, so the tldr, introduction, matrix, spec table, and access section now point to the Cohere API (`north-mini-code-1.0`, free until rate limits) and Model Vault. The code example now uses Cohere's OpenAI-compatible endpoint, and the rate limits and 64K max output were added. Fixed the model ID: it was written as `north-mini-code-1-0`; the official ID is `north-mini-code-1.0`. Added North Small Translate (2026-09-10) and North Micro Vision (2026-08-12) from the same North model line, with a timeline that separates them from the North 2 platform; Small Translate's details stay in the Cohere family article.
- 2026-10-11: Reorganized the article into the common family structure and added a model matrix using existing material; factual verification dates remain unchanged.
- 2026-10-11: Checked the official model card and API documentation; added open-weight and API access details and removed unsupported market-share, strategy, and comparative-performance claims.

*Last updated: 2026-11-23. Cohere North is a new series; specs and free-tier policies may change with version updates. Always refer to official documentation.*

## References

- [Cohere official](https://cohere.com/)
- [Cohere models overview (North model IDs and status)](https://docs.cohere.com/docs/models)
- [Cohere API rate limits](https://docs.cohere.com/docs/rate-limits)
- [Cohere OpenAI-compatible API](https://docs.cohere.com/docs/compatibility-api)
- [North Mini Code official model card](https://huggingface.co/CohereLabs/North-Mini-Code-1.0)
- [Cohere North Mini Code documentation](https://docs.cohere.com/docs/north-mini-code-1.0)
- [North enterprise agent platform](https://cohere.com/north)
- [Introducing North Small Translate (2026-09-10, Cohere blog)](https://cohere.com/blog/north-small-translate)
- [North Small Translate documentation](https://docs.cohere.com/docs/north-small-translate-1.0)
- [North-Micro-Vision-Instruct model card](https://huggingface.co/CohereLabs/North-Micro-Vision-Instruct)
- [Meet North Micro Vision (2026-08-12, Hugging Face blog)](https://huggingface.co/blog/CohereLabs/meet-north-micro-vision-instruct)
- [Cohere family article](/posts/tech/2026-08-24-ai-model-family-cohere-en) — this site
