---
title: "Kimi——From a 200K Long-Context Tool to a 2.8T Open-Source Frontier, and K3's Architectural Leap"
date: 2026-08-24
type: project
category: ai
tags: [kimi, moonshot-ai, llm, long-context, reasoning, ai-model, moe, open-source]
lang: en
series:
  name: "AI 模型家族"
  order: 9
draft: false
glossary:
  - term: "Agent Swarm"
    definition: "Kimi K2.5's architecture: a router dispatches up to 100 sub-agents in parallel on different subtasks, then another router merges the results"
  - term: "Kimi Delta Attention"
    aliases: ["KDA"]
    definition: "The attention mechanism adopted in Kimi K3, providing efficient long-sequence mixing with periodically interleaved Gated MLA layers to preserve global interaction"
  - term: "Attention Residuals"
    aliases: ["AttnRes"]
    definition: "Lets each layer selectively attend to representations of all preceding layers, improving information flow across model depth"
  - term: "Stable LatentMoE"
    definition: "K3's sparse MoE framework, expanding the routed expert space to 896 with 16 activated per token, stabilized at extreme sparsity via normalization and SiTU-GLU"
  - term: "MoonViT-V2"
    definition: "K3's vision encoder, trained from scratch with next-token prediction (no SigLIP initialization), 401M parameters"
---

In 2023, while the world chased OpenAI, a Chinese startup called Moonshot AI (月之暗面) made a different bet — instead of rushing a "Chinese ChatGPT," it wagered on the **ultra-long context window**. In July 2026 that path reached its extreme: **Kimi K3** — the world's first open-source 3T-class model, 2.8T parameters, 104B active, 1M context, scoring 60 on the Artificial Analysis Intelligence Index, tied with GLM-5.3 for open-source #1. This post traces Kimi's full evolution from long-context tool to open-source frontier, and K3's architectural leap.

For how to read the benchmark numbers cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is the ninth family deep-dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Released | Key facts |
|---|---|---|
| Kimi Chat | 2023-10 | 200K Chinese-character context, long-context origin |
| Kimi K1.5 | 2025-01 | RL reasoning, Long CoT, multimodal reasoning |
| Kimi-VL | 2025-04 | 16B MoE (3B active) open vision-language model |
| Kimi-Dev | 2025-06 | 72B code-specialized model, SWE-bench Verified open SOTA |
| Kimi K2 | 2025-07 | 1T MoE (32B active), 384 experts, MuonClip optimizer |
| K2 Thinking | 2025-11 | 256K context, 200–300 consecutive tool calls |
| Kimi K2.5 | 2026-01 | native multimodal, Agent Swarm (100 sub-agents), Modified MIT |
| **Kimi K3** | 2026-07 | **2.8T MoE (104B active), 1M context, KDA + AttnRes, first open 3T-class** |

Three years, eight generations. The first act was "long-context differentiation"; the second is **scale and architecture advancing on two tracks at once** — K3 pushed total params to 2.8T while lifting efficiency 2.5x with a new architecture.

## Two Product Lines: Open Weights and API

To read Kimi's 2026 moves, split it into two lines:

**Open-source line** (HuggingFace `MoonshotAI`): K2.5 under Modified MIT, K3 under the **Kimi K3 License** (custom, see License Trap below). Weights fully open for download, fine-tune, self-host. This line owns ecosystem and research influence — K3 is the first open 3T-class model ever, meaningful for opening frontier scale to the community.

**Commercial line** (platform.kimi.ai API): K3 API priced at $3.00 / $15.00 per 1M tokens (cache-hit input $0.30), backed by the Mooncake disaggregated inference architecture with >90% cache hit on coding workloads. This line owns revenue.

One important date: **K2.5 and the moonshot-v1 series sunset entirely on 2026-08-31**, and new registrations can no longer select them. Kimi's product重心 has fully shifted to K3.

## Architecture: Why 2.8T Achieves 2.5x Efficiency

### Kimi Delta Attention (KDA)

K3's core architectural innovation. KDA provides efficient long-sequence mixing with periodically interleaved Gated MLA layers to preserve global interaction. It solves the fundamental problem of "how information flows effectively across 1M context" — traditional attention dilutes information at that length; KDA keeps the model effective on both sequence length and model depth.

### Attention Residuals (AttnRes)

Lets each layer selectively attend to representations of all preceding layers, not just the previous one. This improves information flow across model depth — a key reason K3 stays stable at 93 layers.

### Stable LatentMoE

K3 expands the routed expert space to **896**, activating 16 + 2 shared per token. With normalization, SiTU-GLU, and Quantile Balancing, it stabilizes optimization at extreme sparsity (~56:1). Versus K2's 384 experts / 8 active, K3 doubles both expert count and active ratio.

### MoonViT-V2: Vision Encoder Trained From Scratch

K3's vision encoder MoonViT-V2 (401M params) is trained entirely from scratch with next-token prediction, no SigLIP initialization. Moonshot found that pretrained vision encoders (e.g., SigLIP) attached to an LLM show unstable gradients and frequent spikes; MoonViT-V2 stays stable throughout and matches the baseline on vision eval — proving large multimodal models "don't need contrastive pretraining for initialization."

## Kimi K3: How to Choose

The K3 generation offers open weights and API; K2.5 is retiring:

| Item | Kimi K3 (API) | Kimi K3 (open weights) | Kimi K2.5 (old gen) |
|---|---|---|---|
| Total params | 2.8T | 2.8T | 1T |
| Active params | 104B | 104B | 32B |
| Context | 1M | 1M | 256K |
| Multimodal | text + image | text + image | text + image |
| License | closed API | **Kimi K3 License (custom)** | Modified MIT |
| Pricing | $3.00 / $15.00 (cache-hit $0.30) | free, needs multi-node cluster | retired (2026-08-31) |
| Recommended framework | Kimi Code CLI | vLLM / SGLang / TokenSpeed | — |

Pricing and specs from the [Kimi K3 official blog](https://www.kimi.ai/blog/kimi-k3) and [Kimi API model list](https://platform.kimi.ai/docs/models).

### License Trap: Kimi K3 License Is Not MIT

K2.5 shipped under Modified MIT (relatively permissive), but **K3 switched to the custom Kimi K3 License** — the same signal as Qwen3.8-Max's custom terms: flagship open weights, but the license is no longer the most permissive tier. Specific restrictions on commercial deployment and redistribution need line-by-line confirmation.

The but: **"open 3T-class" is real, but "freely commercial" depends on license details.** If your deployment needs license certainty, K3's Kimi K3 License is less clean than GLM's MIT or most of Qwen's Apache 2.0. For the most permissive license at large scale, GLM-5.3 (MIT) remains the safer pick.

### Performance Position

| Metric | Kimi K3 | Comparison |
|---|---|---|
| Artificial Analysis Intelligence Index | **60** (open-source #1, tied) | tied with GLM-5.3; Claude Fable 5 / GPT-5.6 Sol tier |
| Reasoning / Knowledge | 93.5 | Claude Fable 5 92.6 / GPT-5.6 Sol 94.1 |
| HLE (Humanity's Last Exam) | 43.5 / 56.0 | trails closed flagships |
| Coding: DeepSWE | 67.5 | Claude Fable 5 70.0 / GPT-5.6 Sol 67.0 |
| ProgramBench | 7x | near closed |
| Context | 1M tokens | among the largest open contexts |

Three honest buts: K3 ties GLM-5.3 at 60 on the Intelligence Index (open-source #1), but **overall still trails Claude Fable 5 and GPT-5.6 Sol**; the gap is clear on HLE-level difficulty; even quantized, 2.8T weights need a multi-node datacenter — individual developers can't actually run it without the API.

## Sub-lines and Ecosystem: A Table of Kimi's Model Range

Beyond the general line, Moonshot runs several sub-lines:

| Sub-line | Representative | Latest status (2026-08) |
|---|---|---|
| General mainline | K1.5 → K2 → K2.5 → **K3** | K3 flagship; K2.5 retires end of month |
| Vision-language | Kimi-VL (16B MoE) | open VL model |
| Code | Kimi-Dev (72B) | SWE-bench Verified open SOTA |
| Lightweight | Kimi Linear (48B MoE, 3B active) | KDA efficient inference |
| Reasoning | K2 Thinking | 256K context, long tool-call chains |
| Agent framework | Kimi Code CLI | terminal coding agent, pairs with K3 |
| Consumer products | Kimi.com / Kimi Work / Kimi App | multi-platform agent entry |

Two trends:

**Capability consolidates into the mainline.** Same script as Qwen, DeepSeek, GLM — Moonshot folds specialist lines back into K: K3 is natively multimodal, natively coding, no separate sub-line needed.

**Open license stratifies.** K2.5 was Modified MIT; K3 switched to the custom Kimi K3 License. Like Qwen and Llama 4, "open-source" is becoming different things at different model tiers — small models permissive, flagship conditional.

## Position Against Competitors

Place K3 in the August 2026 open-source landscape:

- **vs GLM-5.3 (744B MIT)**: both tied at 60 on the Intelligence Index (open-source #1). K3 is bigger (2.8T vs 744B), but GLM's MIT license is cleaner; Kimi's edge is 1M context and architectural efficiency
- **vs Qwen3.8-Max (2.4T)**: Qwen spans a wider size spectrum (0.8B–2.4T), but K3 is the only open 3T-class option; both flagships use custom licenses
- **vs DeepSeek V4**: DeepSeek's price ($0.28/$0.42) is an order of magnitude below K3's $3/$15, and MIT-licensed; K3's edge is scale and long context
- **vs Claude / GPT frontier**: K3 still trails Fable 5 and GPT-5.6 Sol overall, but open deployment and 1M context are what closed models can't offer

## What This Means for Agent Developers

- **Need open 3T-class model** → Kimi K3: world's first, 2.8T params + 1M context, currently the only option
- **Complex coding agent** → K3: DeepSWE 67.5, ProgramBench near closed, with Kimi Code CLI
- **Ultra-long docs / knowledge work** → K3's 1M context, fits research reports, long-doc analysis, multi-step reasoning
- **Need cheapest open API** → DeepSeek V4 Flash ($0.28/$0.42) is an order of magnitude cheaper than K3 ($3/$15)
- **Need license certainty** → GLM-5.3 (MIT) is cleaner than K3's Kimi K3 License
- **Need strongest coding** → Claude Opus 5 still leads SWE-bench

## Overall

Kimi's story is "an overlooked direction grew an open-source frontier." From the 200K long-context chatbot of 2023 to K3 of July 2026 — 2.8T params, 104B active, 1M context, the world's first open 3T-class model. In three years it went from "Chinese long-context tool" to "open-source scale benchmark."

K3's architectural upgrades (KDA + AttnRes + Stable LatentMoE) delivered a 2.5x scaling-efficiency gain. At 60 on the Intelligence Index, tied with GLM-5.3 for open-source #1, it reaches frontier level on coding, knowledge work, and reasoning.

What's worth remembering is the license: on the "open-source" spectrum, K3 sits in the "downloadable but conditional" middle — the Kimi K3 License is less clean than GLM's MIT or most of Qwen's Apache 2.0. For developers needing 3T-class scale and able to accept a custom license, K3 is currently the only open option; for those needing license certainty, GLM-5.3 remains the safer pick.

---

## References

- [Kimi K3: Open Frontier Intelligence — Official Blog](https://www.kimi.ai/blog/kimi-k3)
- [Kimi K3 — arXiv:2607.24653](https://arxiv.org/html/2607.24653v2)
- [MoonshotAI/Kimi-K3 — Hugging Face](https://github.com/MoonshotAI/Kimi-K3)
- [Kimi API Model List](https://platform.kimi.ai/docs/models)
- [Kimi K1.5 Technical Report](https://arxiv.org/abs/2501.12599)
- [Kimi K2 Technical Report](https://arxiv.org/abs/2507.20534)
- [Kimi K3 — kimi.ai/ai-models](https://www.kimi.ai/ai-models/kimi-k3)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
