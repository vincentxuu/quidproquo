---
title: "Apodex: A Reasoning-First Model for Long-Horizon Research and Prediction"
date: 2026-10-10
category: tech
type: deep-dive
tags: [apodex, reasoning, research-agent, long-horizon, moe, verifiable-ai]
lang: en
tldr: "Apodex is a reasoning-first Mixture-of-Experts model family built by the Apodex team for complex long-horizon research, forecasting, and verifiable reasoning tasks. An agent runtime supplies file, data, code, and tool execution; the core API accepts text only."
description: "Apodex model architecture, long context, function calling, and the distinction between core-model APIs and hosted research agents."
draft: false
series:
  name: "AI Model Families"
  order: 26
---

> :globe: [中文版](/posts/tech/2026-10-10-ai-model-family-apodex)

[Apodex](https://apodex.ai/) is a **reasoning-first** model family developed by the **Apodex** team. The official model card positions Apodex for **long-horizon research, forecasting, and verifiable reasoning** — the official agent service emphasizes verifiable deliverables; reproducibility still depends on the tools, data, and execution records.

The current generation is Apodex 1.1: the flagship **Apodex 1.1** (397B) is API-only, while **Apodex 1.1 Mini** (35B, Mixture-of-Experts) is available both through the official API and as Apache 2.0 open weights. Both have a 262,144-token context window. Mini's official API price is $0.10 input and $1.00 output per million tokens; OpenRouter no longer has a working Apodex endpoint.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| Apodex 1.1 Mini | Long-horizon research, forecasting, high-volume work | 35B MoE; 262,144 tokens | Apache 2.0 open weights; official API `apodex-1.1-mini` |
| Apodex 1.1 | Hard reasoning, quality-critical work | 397B; 262,144 tokens | Official API `apodex-1.1` (Hugging Face hosts Mini weights only) |
| Deep Research service | Research agents | Search, sandbox, MCP, and agent runtime | Official Apodex platform |

### Models and the agent service are separate layers

The official model card describes Apodex as reasoning-first and documents native function calling. It also describes AgentOS, an asynchronous Agent Team, and Statement Review as parts of the agent system. Those system features are not automatically included in a raw model call.

The core-model API documentation makes the boundary explicit: `apodex-1.1` and `apodex-1.1-mini` accept text, with no server-side planning loop, search, or tool execution. The deep research service supplies web search, URL fetching, a code sandbox, and MCP servers. Choose the product layer before selecting a model.

## Family evolution

This article focuses on Apodex 1.1 Mini and distinguishes the core API from the research-agent service; it does not compile a full release history or generation-by-generation performance progression.

## Architecture and training trade-offs

### Architecture and key specs

| Item | Specification |
|------|---------------|
| **Architecture** | Mixture-of-Experts (MoE) |
| **Context Window** | 262,144 tokens |
| **Parameter count** | Mini 35B; flagship Apodex 1.1 is 397B (official API docs) |
| **Trainer** | **Apodex** |
| **Access / licensing** | Mini weights are Apache 2.0; hosted access goes through the official Apodex API |
| **Input modalities** | Text, including code and data represented as text; core API file content parts are not supported |
| **Output modalities** | Text, reasoning content, tool-call requests; artifacts are produced by the runtime |

> :warning: The model and the hosted agent service are separate layers. AgentOS and Agent Team provide the execution workflow; a raw model API requires tool schemas and a host loop to execute calls. Mini can also be deployed locally.

## Evaluation and alternatives

This article does not verify candidates for research and forecasting under a single evaluation setup. Model versions, benchmarks, harnesses, tool permissions, and inference budgets must be aligned before ranking them; use the task checks below to evaluate your workflow.

For related selection questions, compare [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere-en), [North Mini Code](/posts/tech/2026-10-10-ai-model-family-cohere-north-en).

## Licensing, pricing, and deployment

### Deployment and access options

#### Official Apodex API

Core models are served over the OpenAI-compatible `https://api.apodex.ai/v1/chat/completions`, and also over the Anthropic Messages format (`/v1/messages`) at the same prices.

| Model ID | Parameters | Input / cached input / output (per million tokens) |
|---|---|---|
| `apodex-1.1` | 397B | $0.30 / $0.03 / $3.00 |
| `apodex-1.1-mini` | 35B | $0.10 / $0.01 / $1.00 |

- Requests with more than 200K input tokens are billed at 2x for the entire request (input, cached input, and output).
- Non-streaming requests cap `max_tokens` at 32,768, and reasoning tokens count toward it; turn on `stream` for longer outputs.
- Deep Research 1.1 ($5 / $20) and Deep Solve 1.1 ($5 / $25) are agent tasks with per-use fees for search, fetch, and sandbox tools; Deep Discover 1.1 Preview requires an access request. These are research-agent services, not core models.

```python
import os
import openai
client = openai.OpenAI(
    api_key=os.environ["APODEX_API_KEY"],
    base_url="https://api.apodex.ai/v1"
)
resp = client.chat.completions.create(
    model="apodex-1.1-mini",
    messages=[{"role": "user", "content": "..."}]
)
```

The earlier free OpenRouter route `apodex/apodex-1.1-mini:free` no longer has a working endpoint, so do not use it as an entry point.

#### Apodex official platform
- The official hosted agent service provides AgentOS and Agent Team workflows.

#### Local / private deployment
- **Apodex-1.1-mini open weights are available**; the official model card documents local SGLang and vLLM deployment under Apache 2.0
- Confirm enterprise pricing and private deployment options directly with Apodex.

## Agent integration and selection

### Building a research workflow

The model card documents a host loop: supply schemas in `tools`, execute the returned requests, append `role="tool"` results, and repeat until the model answers without tool calls. The application must also manage state, logs, and permissions.

For example, a data-analysis application could supply a CSV reader, a Python sandbox, and a report writer. These are proposed tools, not a verified list of built-in Apodex connectors. File formats, database access, network access, and persistent kernels depend on the environment you configure.

The hosted Agent Team describes task decomposition, parallel subagents, and delivery review. When reproducing such a workflow yourself, preserve completed work and intermediate evidence, and independently check calculations and citations. Model reasoning text alone is not an audit trail of actions actually executed.

### Ideal use cases

These are application directions to evaluate, not measured accuracy claims for each task category.

| Scenario | Description |
|----------|-------------|
| **Academic / industry research** | Literature review, hypothesis generation, experimental design, data analysis, report writing — end to end |
| **Financial / economic forecasting** | Multi-source data fusion, backtesting, scenario simulation, risk-factor attribution |
| **Scientific computation and modeling** | Differential equation solving, parameter estimation, uncertainty quantification, visualization |
| **Complex data pipeline auditing** | ETL verification, data quality checks, lineage tracking, compliance reporting |
| **Agentic system core** | Serves as the "plan + verify" core, directing downstream execution models |

### A workflow to evaluate

Start with a reproducible data-analysis task rather than an unrestricted financial forecast. Give the agent a public CSV, a data dictionary, and a question such as: “Compare monthly revenue across two years, flag missing months, and attach the analysis script.” Supply a read-only file tool and a sandbox, then verify that the output matches an independent calculation.

This is an application design example, not a tested performance result. Record the input snapshot, tool calls, script, and final figures. A plausible explanation alone is insufficient evidence that the task succeeded.

## Limitations and trade-offs

A long context window can hold more material, but does not guarantee correct retrieval or analysis. Tool access, state persistence, concurrency, and attachments are runtime responsibilities. Mini's suitability for a specific task should be measured with your own data; the sources do not establish that it is uniformly poor at chat or that the larger model is always required.

The model card describes local SGLang and vLLM deployment and Apache 2.0 licensing. Local deployment still needs adequate memory and matching reasoning/tool parsers. The hosted API is billed per token; check account quotas and data-retention terms before production use, and watch the 2x billing for inputs above 200K tokens.

## Update history

- 2026-11-23: OpenRouter's `apodex/apodex-1.1-mini:free` no longer has a working endpoint, so the introduction, model matrix, spec table, and deployment section now point to the official Apodex API. Added the official price table (1.1 and 1.1 Mini), parameter counts (397B / 35B), and the 2x billing above 200K input tokens; the matrix now includes the flagship Apodex 1.1. The model generation is unchanged (still 1.1).
- 2026-10-11: Reorganized the article into the common family structure and added a model matrix using existing material; factual verification dates remain unchanged.
- 2026-10-11: Verified model and API documentation before publication; separated core models from the agent service and removed unsupported IDE, deployment, and comparative-performance claims.

*Last updated: 2026-11-23. Model specs, pricing, and access options may change; always verify against the official docs.*

## References

- [Apodex-1.1-mini official model card and local deployment](https://huggingface.co/apodex/Apodex-1.1-mini)

- [Apodex official site](https://apodex.ai/)
- [Apodex API pricing](https://platform.apodex.ai/docs/pricing)
- [Apodex core-model API documentation](https://platform.apodex.ai/docs/models)
- [Apodex model configuration](https://huggingface.co/apodex/Apodex-1.1-mini/raw/main/config.json)
