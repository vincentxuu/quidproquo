---
title: "Cohere North: Cohere's First Agentic Coding Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [cohere, north, agentic-coding, sparse-moe, programming]
lang: en
tldr: "Cohere's North series marks its first agentic coding model family. North Mini Code (30B total / 3B active sparse MoE) is purpose-built for code generation and automated development, with 256K context and free access via OpenRouter as `north-mini-code:free`."
description: "Deep dive into Cohere North's design philosophy, architecture, differences from the Command series, and how to use the free tier for coding tasks."
draft: false
series:
  name: "AI 模型家族"
  order: 27
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-cohere-north)

[Cohere](https://cohere.com/)'s **North** series, launched in 2026, adds a model line focused on **Agentic Coding**. **North Mini Code** is the family's first public model: a 30B total / 3B active parameter sparse MoE designed for code generation, testing, and automated development. It is available for free on OpenRouter as `cohere/north-mini-code:free`, giving developers direct access to Cohere's coding agent capabilities.

---

## Background: from RAG to Agentic Coding

Command and Embed serve enterprise language and embedding workloads; North Mini Code focuses on agentic coding. This product distinction does not establish that Cohere has abandoned RAG or changed its entire corporate strategy. Cohere also offers a North enterprise agent platform; the platform and North Mini Code model are separate products.

| Cohere series | Primary positioning | Representative models |
|---|---|---|
| **Command / Embed** | RAG, embeddings, general conversation | Command A, Embed |
| **North** (new) | Agentic Coding | **North Mini Code** (30B/3B sparse MoE) |

---

## North Mini Code: core specifications

| Item | Specification |
|---|---|
| **Model name** | North Mini Code |
| **Trainer** | **Cohere** |
| **Architecture** | Sparse Mixture-of-Experts |
| **Parameters** | 30B total / 3B active |
| **Context** | 256,000 tokens |
| **License / access** | OpenRouter `:free` (`cohere/north-mini-code:free`) |
| **Input modalities** | Text (code, natural language instructions, documentation) |
| **Output modalities** | Code, reasoning explanations, tool calls |

---

## Architecture and the agent loop

The official model card identifies North Mini Code as a decoder-only sparse MoE Transformer, with sliding-window and global attention. It was post-trained using supervised fine-tuning followed by reinforcement learning with verifiable rewards for agentic coding. The 3B active footprint describes computation per token; the full weights still need to fit in the deployment's memory.

The model accepts text and emits text, including reasoning and tool-call requests. Supply tool descriptions as JSON schemas. The application executes requested tools and returns their results; a model response alone cannot run a test, edit a repository, or inspect a terminal.

The model card recommends retaining the generated thinking content across agent steps. A local deployment also needs matching reasoning and tool-call parsers. Use the current official recipe rather than assuming that any OpenAI-compatible server will parse the output correctly.

## Access and a first request

OpenRouter currently lists `cohere/north-mini-code:free`. Cohere's own documentation identifies its API model as `north-mini-code-1-0`, describes free trial and production access until rate limits are reached, and points to Model Vault for production use. The open weights are available under Apache 2.0; an API's account limits and data terms are separate from the weights' license.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
response = client.chat.completions.create(
    model="cohere/north-mini-code:free",
    messages=[{"role": "user", "content": "Write a Python palindrome checker and unit tests."}],
)
print(response.choices[0].message.content)
```

This text-generation example does not execute the proposed tests. For an agent evaluation, supply a repository and sandbox, then record the diff, actual test output, number of tool turns, and elapsed time. Compare models using the same task and harness.

## Ideal use cases

| Use case | Description |
|---|---|
| **Interactive coding assistant** | Developers get real-time coding suggestions, refactoring, and test generation in the IDE |
| **Batch automated development** | Automated test generation, legacy code refactoring, documentation updates |
| **Code review & security** | Proposes security, dependency, and quality findings for independent verification |
| **Education & learning** | Learning programming languages, understanding existing codebase structure |

---

## Limits and tradeoffs

Treat coding specialization as positioning, not proof that the model underperforms every general model on chat or mathematics. Security review and successful refactoring need actual tests and human inspection. A long context window does not guarantee that every dependency is understood.

Free endpoints have account limits and changing availability. Check your provider's data-retention terms before sending private code; neither “free” nor “official platform” establishes a privacy guarantee. Local open-weight deployment gives control over execution, but requires sufficient hardware and compatible parsers.

## Update history

- 2026-10-11: Checked the official model card and API documentation; added open-weight and API access details and removed unsupported market-share, strategy, and comparative-performance claims.

## References

- [Cohere official](https://cohere.com/)
- [Cohere North Mini Code on OpenRouter](https://openrouter.ai/cohere/north-mini-code:free)
- [North Mini Code official model card](https://huggingface.co/CohereLabs/North-Mini-Code-1.0)
- [Cohere North Mini Code documentation](https://docs.cohere.com/docs/north-mini-code-1.0)
- [North enterprise agent platform](https://cohere.com/north)

---

## Related posts

- [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere-en)
- [Apodex](/posts/tech/2026-10-10-ai-model-family-apodex-en)

---

*Last updated: 2026-10-11. Cohere North is a new series; specs and free-tier policies may change with version updates. Always refer to official documentation.*
