---
title: "GLM——From a Tsinghua Lab to a 744B Open-Source Flagship, and GLM-5.3's Cybersecurity Surge"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, glm, zhipu-ai, model-family-glm, moe, open-source, huawei-ascend, model-selection]
lang: en
type: deep-dive
tldr: "GLM is Zhipu AI (Z.ai)'s open LLM family from Tsinghua's KEG Lab. GLM-5.3 (2026/08) lifts coding +50% over the previous generation, hits 84.5% on CyberGym ahead of Anthropic Mythos 5 and OpenAI GPT-5.6 Sol, and scores 60 on the Artificial Analysis Intelligence Index tied with Kimi K3 for open-source #1. The only frontier open model trained entirely on Huawei Ascend."
description: "Complete GLM (Zhipu AI / Z.ai) model family guide: 2022→2026 evolution, dual-track open-weights vs commercial API, GLM autoregressive blank-infilling, 744B MoE, Slime RL, Huawei Ascend, GLM-5.3 security and selection guide, MIT licensing, and agent advice"
series:
  name: "AI Model Families"
  order: 8
draft: false
glossary:
  - term: "GLM"
    aliases: ["General Language Model"]
    definition: "An autoregressive blank-infilling architecture designed by Tsinghua University's KEG lab, unifying understanding and generation with a fill-in objective; the foundation of the ChatGLM and GLM-5 families"
  - term: "Slime RL"
    definition: "Zhipu AI's in-house reinforcement learning framework for agent training, whose core innovation is a process verifier that tracks tool-call correctness step by step rather than only checking the final answer"
  - term: "OpenClaw"
    definition: "Zhipu AI's Claude Code equivalent — a terminal-based AI coding agent paired with GLM-5-Turbo"
  - term: "Huawei Ascend"
    aliases: ["Ascend"]
    definition: "Huawei's self-developed AI accelerators; GLM-5 was trained entirely on Ascend chips, with zero NVIDIA GPUs"
---

> 🌏 [繁體中文版](/posts/tech/2026-08-24-ai-model-family-glm)

In August 2026, Zhipu AI released **GLM-5.3** — same base model, but pure post-training lifted coding ability by 50% and pushed CyberGym to 84.5%, beating Anthropic's Mythos 5 (83.8%) and OpenAI's GPT-5.6 Sol (83.6%). This family traces back to a Tsinghua University lab: from the 2022 GLM-130B to today's 744B open-source flagship, it is **the only frontier open-source model trained entirely on Huawei Ascend accelerators**. This post traces GLM's full evolution from academic prototype to open-source frontier, and where it stands in 2026.

For how to read the benchmark numbers cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is the eighth family deep-dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Released | Key facts |
|---|---|---|
| GLM-130B | 2022-07 | 130B dense model, ICLR 2023 paper, open-source starting point |
| ChatGLM / ChatGLM-6B | 2023-03 | Aligned version; the 6B open release ignited the community |
| ChatGLM2 / 3 | 2023 H2 | Context expansion, function calling, agent capability |
| GLM-4 series | 2024 | 10T+ tokens pretraining, All Tools autonomous tool selection |
| GLM-4.5 | 2025-07 | 355B MoE (32B active), then open-source MoE SOTA |
| **GLM-5** | 2026-02 | **744B MoE (40B active), trained on Huawei Ascend, MIT license** |
| GLM-5.1 | 2026-05 | Built for long-horizon agent tasks; runs 8 hours standalone |
| GLM-5.2 | 2026-06 | 1M lossless context, open-source coding SOTA |
| **GLM-5.3** | 2026-08 | **same base as 5.2, coding +50%, CyberGym 84.5%** |

Four years, eight generations. The first act was "academic accumulation becomes product"; the second is **open-source weights and commercial API formally splitting into two tracks** — the same dual track as Qwen, but GLM's open weights have consistently stayed on the most permissive license, MIT.

## Two Product Lines: Open Weights for Ecosystem, Commercial API for Revenue

To read GLM's 2026 moves, split it into two parallel tracks:

**Open-source line** (HuggingFace `zai-org` / `ZhipuAI`): each generation from GLM-4.5 to GLM-5.3 ships checkpoints under **MIT**, unrestricted for commercial use, fine-tuning, and self-hosting. This line owns the ecosystem — vLLM, llama.cpp, and SGLang all support it, and the fine-tuning community treats it as a trusted open base.

**Commercial line** (Z.ai / BigModel.cn API): GLM-5.3's API went live 2026-08-19, priced the same as the GLM-5.2 generation. This line owns revenue — ZCode and the GLM Coding Plan (point-based, 50% points off-peak) run on the commercial API.

One key difference: GLM-5.3's **weights open about two weeks after the API** (around 2026-08-22), and only after safety evaluation and hardening. This mirrors Qwen3.8-Max's "release first, open later"节奏, but GLM's open license is clean MIT — unlike Qwen's flagship, which switched to a custom license.

## Architecture: Why Huawei Chips Can Train a Frontier Model

### GLM Autoregressive Blank-Infilling

GLM was never a standard left-to-right language model; it uses a **blank-infilling objective** (span corruption) to unify understanding and generation. This let one model do both cloze-style comprehension and generation. The 2022 GLM-130B earned ICLR attention on this architecture, and ChatGLM and GLM-5 all inherit it.

### MoE: Only 40B Active Out of 744B

GLM-5 is a 744B total-parameter MoE that activates only 40B per inference. This serves frontier quality on a single high-end host while pushing inference cost to 1/5–1/8 of closed models. GLM-5.2/5.3 keep the same base; all capability jumps come from post-training, not scaling up the model.

### Slime RL: Making Agents Use Tools

Zhipu's agent edge is **Slime RL** — a process-verification framework. It doesn't just check the final answer; it tracks step by step whether the model's tool calls in the agent loop are correct. This drives GLM-5-Turbo's tool-call accuracy to 99.32%, a strong option for agentic scenarios.

### Huawei Ascend: Frontier Training Without NVIDIA

GLM-5 was trained entirely on **Huawei Ascend** chips — not a single NVIDIA GPU. In the context of geopolitics and supply chains, this is a signal: the training infrastructure for Chinese frontier models is decoupling. Whether Ascend's training efficiency can keep pace with NVIDIA's iterations long-term remains open, but GLM-5 already proves "non-US hardware can train a frontier model."

## GLM-5.3: How to Choose

GLM-5.3 is a post-training upgrade of one base, but Zhipu maintains several SKUs:

| Item | GLM-5.3 (API) | GLM-5.2 | GLM-5.1 | GLM-5-Turbo |
|---|---|---|---|---|
| Base | 744B MoE (40B active) | same | same | same (agent-tuned) |
| Context | 1M | 1M | 1M | 1M |
| Positioning | strongest general + coding + security | prior strongest | long-horizon agent | stable agent / low cost |
| License | commercial API | commercial API | commercial API | commercial API |
| Open weights | MIT (2 weeks later) | MIT (released) | MIT (released) | MIT (released) |
| Pricing | ~$0.42 / $2.10 per 1M tokens (same as 5.2) | same | same | lower |

Pricing is GLM-5-era commercial API reference; 5.3 explicitly inherits 5.2 pricing.

### License Trap: MIT Is Genuinely Open, But Frontier Ability Lives in the API and the Time Lag

GLM's open license is among the cleanest in the series — **MIT**, more permissive than Llama 4's Community License (700M MAU clause) and Qwen3.8-Max's custom terms. For deployments needing license certainty, this is a real advantage.

Two buts:

- **Weight release lag**: GLM-5.3 weights open ~2 weeks after the API, after safety hardening. "Latest ability today + weights in your hands" is impossible — use the API, or wait two weeks.
- **Deployment responsibility for security ability**: GLM-5.3's CyberGym ability has been used on real codebases (reportedly 2,436 vulnerabilities found). Once open-sourced, this double-edged capability is the deployer's responsibility. If your use involves red-teaming / vuln discovery, assess compliance risk yourself.

### Performance Position

| Metric | GLM-5.3 | Comparison |
|---|---|---|
| Artificial Analysis Intelligence Index | **60** (open-source #1, tied) | tied with Kimi K3; Claude Fable 5 / GPT-5.6 Sol tier |
| CyberGym | **84.5%** | Mythos 5 83.8% / GPT-5.6 Sol 83.6% (Z.ai self-reported) |
| ExploitBench | 54.4% | Mythos 5 78% / GPT-5.6 Sol 76.5% (trails) |
| Terminal-Bench 3.0 | open-source SOTA | #1 among open models |
| Agents' Last Exam | open-source SOTA | #1 among open models |
| Z.ai Code Bench | +50% vs 5.2 | internal benchmark |

Three honest buts: CyberGym / ExploitBench are Z.ai self-reported, pending independent replication; on ExploitBench (deeper into the exploitation chain) GLM-5.3 still trails closed flagships clearly; the Intelligence Index 60 ties Kimi K3, but both still trail Claude Fable 5 and GPT-5.6 Sol overall.

## Sub-lines and Ecosystem: A Table of GLM's Model Range

Beyond the general line, Zhipu runs several sub-lines:

| Sub-line | Representative | Latest status (2026-08) |
|---|---|---|
| General mainline | GLM-4.5 → GLM-5 → 5.1 → 5.2 → 5.3 | MIT open + commercial API dual track |
| Vision-language | GLM-4.5V / GLM-5V-Turbo | native multimodal, vision agent workflows |
| Lightweight | GLM-4.7-Flash (free tier) / GLM-4.6 | writing, translation, long-form |
| OCR | GLM-OCR | CogViT + GLM-0.5B encoder, cross-modal alignment |
| Agent framework | OpenClaw | terminal coding agent, pairs with GLM-5-Turbo |
| Commercial API | Z.ai / BigModel.cn / GLM Coding Plan | point-based, 50% off-peak |

Two trends:

**Capability consolidates into the mainline.** Same script as Qwen, DeepSeek — Zhipu folds specialist lines back into GLM: vision becomes native, coding handled by the flagship. Lower maintenance, one base for many scenarios.

**Open license stays permissive throughout.** Unlike Qwen's flagship moving to custom terms and Llama 4's Community License, GLM's open weights have stayed MIT. This makes it especially persuasive for enterprise deployments needing license certainty — particularly geo-sensitive, must-self-host scenarios.

## Position Against Competitors

Place GLM-5.3 in the August 2026 open-source landscape:

- **vs Kimi K3 (2.8T open weights)**: both tied at 60 on the Intelligence Index (open-source #1). K3 is bigger (2.8T vs 744B), but GLM's MIT license is cleaner and its Chinese/agent ecosystem more mature
- **vs Qwen3.8-Max (2.4T)**: Qwen spans a wider size spectrum (0.8B–2.4T), but GLM's MIT beats Qwen's custom flagship terms on certainty; the two trade open-source leadership
- **vs DeepSeek V4**: DeepSeek's price ($0.28/$0.42) and MLA cost structure are more aggressive; GLM's edge is agent tool-call accuracy (99.32%) and security benchmarks
- **vs Claude / GPT frontier**: GLM-5.3 locally surpasses on CyberGym, but trails on composite (SWE-bench, ExploitBench) while pricing 7–10x cheaper

## What This Means for Agent Developers

- **Complex coding agent** → GLM-5.3: Terminal-Bench 3.0 / Agents' Last Exam open-source SOTA, Z.ai Code Bench +50% vs 5.2
- **Security / vuln scanning** → GLM-5.3: CyberGym 84.5% open-source #1, but self-assess red-team compliance
- **High-stability tool calls** → GLM-5-Turbo: 99.32% tool-call accuracy, Chinese-native, fits long agent chains
- **Need MIT self-hosting** → entire GLM family open weights under MIT, cleaner than Llama 4 / Qwen flagship
- **Need cheapest API** → DeepSeek V4 Flash is cheaper; GLM's edge is agent stability, not pure price
- **Need ultra-long context** → Kimi K3's 1M context and 2.8T params are bigger, but GLM's 1M lossless is enough for most

## Overall

GLM's story is "an open-source frontier grown from an academic lab." From Tsinghua KEG's GLM-130B to today's 744B open-source flagship trained entirely on Huawei Ascend, Zhipu walked a different path from Silicon Valley — not NVIDIA compute, but architecture (GLM blank-infilling), training framework (Slime RL), and license (MIT) as the moat.

August 2026's GLM-5.3 is a turning point: it proves **post-training can dramatically lift a fixed base's frontier ability without scaling the model every time**. CyberGym 84.5% beating Mythos 5 and GPT-5.6 Sol turns "open-source model does security" from slogan to measurable benchmark.

What's worth remembering is the license: on the "open-source" spectrum, GLM sits at the cleanest end — MIT, commercial-use OK, fine-tune OK, self-host OK, no MAU clause, no custom restrictions. For enterprises needing license certainty (especially geo- and compliance-bound scenarios), GLM is currently among the most worry-free options in the open-source camp.

---

## References

- [GLM-5.3: Frontier Coding with Emergent Cyber Capabilities — Z.ai Blog](https://z.ai/blog/glm-5.3)
- [Z.ai Model Release Notes (GLM-5.3)](https://docs.z.ai/release-notes/new-released)
- [Zhipu launches GLM-5.3 — South China Morning Post](https://www.scmp.com/tech/big-tech/article/3364077/zhipu-launches-flagship-model-glm-53-china-seeks-mythos-level-edge-cyber-defence)
- [Zhipu's GLM-5.3 API Goes Live — Gate News](https://www.gate.com/news/detail/zhipus-glm-53-api-goes-live-tying-kimi-k3-for-the-top-spot-among-open-23548151)
- [GLM-5 Technical Report](https://arxiv.org/html/2602.15763v1)
- [ChatGLM Model Family Paper](https://arxiv.org/abs/2406.12793)
- [GLM-5 Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [Z.ai Official Site](https://www.zhipuai.cn/en)
- [BigModel.cn API Platform](https://bigmodel.cn/)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
