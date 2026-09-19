---
title: "Model Card｜Ling-3.0-flash-Fin"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, ant-group, model-family-ling, finance, moe]
lang: en
description: "Ant Group's first finance-enhanced model, Ling-3.0-flash-Fin: 124B total / 5.1B active parameters, MIT open-source, purpose-built for financial research, valuation modeling, and report generation"
tldr: "Ling-3.0-flash-Fin (Ant Group): Released at the 2026 Inclusion·Conference on the Bund (2026-09-09), 124B total parameters with 5.1B active, 256K context (scalable to 1M), MIT open-source; built on Ling-3.0-flash's MoE architecture and long-context capabilities with continued financial-domain pretraining, tested across seven financial benchmarks including FinFIRST, FinSearchComp Verified, FinCRAFT, Finance Agent, APEX-Agents, SpreadsheetBench, and τ³-Banking; AA Intelligence Index v4.1.1 improved from 38 to 41; weights available on Hugging Face and ModelScope, OpenRouter offers a one-month free API"
series:
  name: "AI Model Tracker"
  order: 25
glossary:
  - term: "Ling"
    def: "Ant Group's Ling model family, including general-purpose and domain-specific variants, built on MoE architecture for efficient inference"
  - term: "FinFIRST"
    def: "A financial evaluation benchmark co-developed by Ant Group and CICC, designed by 50+ finance professionals, assessing answer accuracy and traceability across results, process, and evidence dimensions"
---

> 🌏 [中文版](/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin)

## Model Information

| Field | Value |
|---|---|
| Model ID | `Ling-3.0-flash-Fin` |
| Publisher | Ant Group, co-developed with CICC and domain experts |
| Parameters | 124B total, 5.1B active per token |
| Context Window | 256K tokens, extensible to 1M tokens |
| Architecture | Native hybrid reasoning MoE, KDA + MLA interleaved (5:1), 1/64 expert activation ratio |
| Open Source | Yes, MIT License (weights released) |
| Release Date | 2026-09-09 (announced open-source at Inclusion·Conference on the Bund) |
| Weights | [Hugging Face](https://huggingface.co/inclusionAI/Ling-3.0-flash-Fin) · [ModelScope](https://modelscope.ai/models/inclusionAI/Ling-3.0-flash-Fin) |
| API | [OpenRouter](https://openrouter.ai/inclusionai/ling-3.0-flash-fin:free) (one-month free tier) · Vercel AI Gateway |
| Family | Ling 3.0 series (Ling-3.0-flash, Ling-3.0-tiny, Ling-3.0-flash-Fin) |
| Base Model | Ling-3.0-flash (124B / 5.1B, released 2026-07-27) |
| License | MIT |

## Key Capabilities

- **Finance-domain specialization**: Continued pretraining on high-quality financial data and domain-specific post-training on top of Ling-3.0-flash, optimized for annual reports, financial workbooks, and multi-document research materials while maintaining deployment efficiency
- **End-to-end research pipeline**: Connects information retrieval → evidence review → calculation → modeling → report generation as a unified workflow rather than isolated tasks
- **Source-grounded financial search**: Prioritizes authoritative primary sources for accurate, complete, and traceable answers; the [FinFIRST](https://huggingface.co/datasets/inclusionAI/FinFIRST) benchmark is open-sourced alongside the model to enable transparent evaluation
- **Multi-document financial reasoning**: Reconciles reporting periods, definitions, assumptions, and conflicting figures across annual reports, earnings releases, regulatory filings, and research materials
- **Valuation and spreadsheet workflows**: Understands formulas, actual-vs-estimate updates, cross-sheet dependencies, balance checks, scenario analysis, and delivers editable financial models
- **AA Intelligence Index v4.1.1**: Improved from 38 (general-purpose version) to **41**, demonstrating that domain enhancement does not come at the cost of general capabilities

## Benchmark Performance

Ling-3.0-flash-Fin was evaluated across the following financial agent benchmarks. Official results are described qualitatively as "competitive with similarly sized models and substantially larger general-purpose models, with particular strength in source selection and tool-intensive financial tasks." FinFIRST will be open-sourced shortly to provide a transparent evaluation standard.

| Benchmark | Focus Area |
|---|---|
| **FinFIRST** | Source-grounded retrieval (50+ finance professionals designed, evaluates results/process/evidence) |
| **FinSearchComp Verified** | Financial search verification |
| **FinCRAFT** | Financial task execution |
| **Finance Agent** | Finance agent workflows |
| **APEX-Agents** | Financial agent evaluation |
| **SpreadsheetBench** | Spreadsheet operations and valuation modeling |
| **τ³-Banking** | Banking workflow applications |

⚠️ The only publicly quantified metric is the AA Intelligence Index v4.1.1 score of 41 (up from 38 in the general Ling-3.0-flash). Full benchmark score tables are not yet released by Ant Group.

## Comparison Within the Ling 3.0 Family

| Spec | Ling-3.0-tiny | Ling-3.0-flash | Ling-3.0-flash-Fin |
|---|---|---|---|
| Total Parameters | 7.9B | 124B | 124B |
| Active Parameters | 1.3B | 5.1B | 5.1B |
| Positioning | Local offline tasks | Production agent execution node | Finance-enhanced agent |
| Context | N/A | 256K → 1M | 256K → 1M |
| Open Source | Yes | Yes | Yes (MIT) |
| Specialization | Resource-sensitive deployment | Hybrid reasoning, 1/64 sparse MoE | Financial domain fine-tuning |

Compared to the base Ling-3.0-flash, flash-Fin shares the same architecture and context capabilities; the main difference is financial domain adaptation. For general-purpose tasks (coding, search, general reasoning), Ling-3.0-flash remains the better fit.

## Architecture Details

Ling-3.0-flash-Fin retains Ling-3.0-flash's core architecture:

- **Native hybrid linear attention**: KDA (Kimi Delta Attention) and MLA layers alternate at a 5:1 ratio. KDA evolved from Lightning Attention with fine-grained diagonal gating in Delta Rule state updates, retaining critical information more precisely when processing long documents and extensive codebases
- **1/64 sparse MoE**: Expert activation ratio compressed from 1/32 in the previous generation, yielding significantly higher "efficiency leverage"
- **256K → 1M context**: Natively supports 256K, seamlessly scalable to 1M tokens
- **TTFT optimization**: Cluster-level hierarchical caching (SGLang HiCache + Mooncake) eliminates redundant recomputation, reducing Time-to-First-Token by 60–80% in long-input scenarios

## Implications for Agent Development

If you are building agents for financial research, investment analysis, earnings interpretation, or valuation modeling: Ling-3.0-flash-Fin is currently one of the best open-source options available — the MIT license means you can self-host, the 124B/5.1B profile makes it potentially runnable on consumer hardware (see the Edge0 framework running a 35B MoE on Mac mini M4 Pro with only 2.9 GiB), and OpenRouter's free tier lets you validate quickly without commitment.

If you are building general-purpose agents (coding, search, general reasoning): Ling-3.0-flash or Ling-3.0-tiny may be more appropriate — the financial domain fine-tuning advantages of flash-Fin won't materialize in non-financial scenarios.

Not recommended for: Production financial decision-making requiring 100% certainty — the official documentation explicitly states that "key assumptions, valuation results, and investment conclusions require professional review and do not constitute investment advice." As the first finance-enhanced release, it still requires further validation in complex long-horizon workflows.

## Takeaways

What stands out here is the "finance-enhanced model" category being opened up properly. Rather than slapping a financial API on top of a general model, Ant Group released the full model weights (MIT) alongside a dedicated evaluation benchmark (FinFIRST). This is consistent with the Ling 3.0 family's "planning-execution separation" philosophy: Ling-3.0-flash handles high-speed execution, and flash-Fin layers domain depth on top. The key thing to watch is whether FinFIRST becomes a de facto standard in financial AI once it is open-sourced.

## References

- [Ant Group Official Press Release: Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Hugging Face: inclusionAI/Ling-3.0-flash-Fin](https://huggingface.co/inclusionAI/Ling-3.0-flash-Fin)
- [ModelScope: Ling-3.0-flash-Fin](https://modelscope.ai/models/inclusionAI/Ling-3.0-flash-Fin)
- [BusinessWire: Ant Group Unveils Ling-3.0-Flash Delivering Top-Tier Performance at a Fraction of the Parameter Scale (2026-07-27)](https://www.businesswire.com/news/home/20260726584441/en/)
- [FinFIRST (Hugging Face Dataset)](https://huggingface.co/datasets/inclusionAI/FinFIRST)
- [OpenRouter: Ling-3.0-flash-Fin:free](https://openrouter.ai/inclusionai/ling-3.0-flash-fin:free)
- [developer.ant-ling.com: Ling-3.0-flash Release Announcement](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [IT之家: 蚂蚁百灵推出金融增强模型 Ling-3.0-flash-Fin](https://www.ithome.com/0/995/464.htm)
