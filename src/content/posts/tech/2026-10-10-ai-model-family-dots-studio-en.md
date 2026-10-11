---
title: "Dots Studio Dots: Long-Context MoE, Multimodal Input, and Tool Workflows"
date: 2026-10-10
category: tech
type: deep-dive
tags: [dots-studio, dots3, moe, long-context, reasoning, open-weight]
lang: en
tldr: "OpenRouter lists long context, image input, and tools for Dots3-Note Preview; verified weight access and licensing remain necessary for self-hosting."
description: "Dots3-Note Preview specifications, MoE tradeoffs, document workflows, and an API example with clear evidence boundaries."
series:
  name: "AI Model Families"
  order: 28
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-dots-studio)

Dots3-Note Preview is a MoE model in the Dots 3 family. This guide uses [OpenRouter’s model page](https://openrouter.ai/dots-studio/dots-3-note-preview:free) as a verifiable access point and separates its long-context, multimodal, and tool interfaces from the document workflow an application must build.

Checked on October 11, 2026. Specifications below are platform descriptions, not our measurements. The available evidence does not establish a complete family timeline, training recipe, or weight license.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| Dots3-Note Preview | Long documents, multimodal tool workflows | 280B total / 16B active; 512,000 tokens; image input | OpenRouter `:free`; weight license unconfirmed |

### Positioning and specifications

| Item | OpenRouter listing |
|---|---|
| Model | Dots3-Note Preview |
| Organization | Dots Studio |
| Architecture | Mixture-of-Experts (MoE) |
| Parameters | 280B total / 16B active |
| Context | 512,000 tokens |
| Modalities | Text and image input; text output |
| Tool interface | `tools`, `tool_choice`, JSON Schema structured output |
| API ID | `dots-studio/dots-3-note-preview:free` |

OpenRouter describes it as the lightest Dots 3 member, positioned for reasoning, coding, multimodal understanding, long context, and multi-step agent workflows. That positioning does not establish superiority on every workload.

## Family evolution

This article covers the platform information for Dots3-Note Preview rather than a full Dots 3 release history or predecessor comparison. The Preview name alone does not establish an upgrade path.

## Architecture and training trade-offs

### MoE: active parameters are not deployment memory

MoE uses a subset of experts for each computation while retaining a larger set of weights. The active parameter figure describes computation; it is not a promise that only those weights need to fit in memory. Self-hosting also requires the checkpoint format, quantization, supported runtime, and context memory requirements.

The architecture label also does not tell us that particular experts specialize in law, semantics, or mathematics. That would require architecture or training documentation.

## Evaluation and alternatives

This article does not verify candidates for long-document and image workflows under a single evaluation setup. Model versions, benchmarks, harnesses, tool permissions, and inference budgets must be aligned before ranking them; use the task checks below to evaluate your workflow.

## Licensing, pricing, and deployment

We did not establish an official Dots3 weight repository or full license. We therefore preserve OpenRouter’s open-weight description without asserting an unrestricted open-source license, commercial permission, or a verified local deployment route. Resolve access and terms before choosing self-hosting.

### API example

OpenRouter exposes an OpenAI-compatible interface. This example sends a text request; it does not parse files or execute tools:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
response = client.chat.completions.create(
    model="dots-studio/dots-3-note-preview:free",
    messages=[{"role": "user", "content": "Summarize this text and cite the source passage for each conclusion: ..."}],
    max_tokens=1024,
)
print(response.choices[0].message.content)
```

The current `:free` endpoint is subject to rate limits and availability. The model page also shows an endpoint retirement notice. Check its current state and prepare an alternative before integrating it into a long-lived service. Free access is not an SLA or a promise of permanent availability.

## Agent integration and selection

### Long context and RAG

Cross-section summaries, comparisons across documents, and evidence extraction are useful evaluation tasks. These are proposed experiments, not measured capabilities. A large window does not guarantee that every detail is found or every citation is correct.

Putting complete documents in context avoids some retrieval design, but still requires processing the input on each request. RAG delegates selection to an index and retriever. Compare both routes on the same questions: source grounding, missed conditions, and waiting time determine whether full-document prompting helps.

### Tool calls and a document workflow

The model proposes calls; the host executes search, SQL, file access, and writes. An example case-document workflow is:

1. Parse files in the host, retaining page numbers and document IDs.
2. Send text or relevant images and request specific fields.
3. Run similar-case retrieval in the host and return its results.
4. Ask for a comparison table, then validate fields and citations against originals.

This is an application design example, not a workflow tested here. It does not promise automatic OCR, vector search, or legal judgment. Evaluate known-answer documents and retain human review.

### How to compare candidates

| Need | What to test |
|---|---|
| Cross-document comparison | Missed evidence and traceable citations |
| Scanned tables and charts | Image input plus separate OCR and page handling |
| Multi-step tool tasks | Tool selection, arguments, and failure recovery |
| Fast short answers | End-to-end latency against smaller candidates |
| Commercial self-hosting | Verified weights, license, and deployment documentation |

Dots3 belongs on a candidate list for long-document and multimodal tool workflows. Choose using your own data and endpoint measurements. Without tests, there is no basis here for saying it is always slower, always better, or suitable only for batches.

## Limitations and trade-offs

Image input is also different from complete PDF handling. Your application must extract text, render scanned pages as images, or use an OCR service. The model page confirms image input; it does not implement file parsing for your application.

## Update history

- 2026-10-11: Reorganized the article into the common family structure and added a model matrix using existing material; factual verification dates remain unchanged.
- 2026-10-11: Checked full platform content, corrected the text-only claim, removed unverified site, repository, training, and deployment assertions, and published with application responsibilities clarified.

## References

- [OpenRouter: Dots Studio Dots3-Note Preview specifications, modalities, and API](https://openrouter.ai/dots-studio/dots-3-note-preview:free)
- [OpenRouter API quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter free models and rate limits](https://openrouter.ai/docs/api-reference/limits)

- [AI model evaluation sources — reading benchmark evidence](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
