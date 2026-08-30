---
title: "What Top AI Conferences Accepted in 2025: The Agent Breakout and Reasoning Revolution"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2025", topic-analysis, ai-agent, reasoning, world-model, rlhf, diffusion-model]
lang: en
tldr: "The two strongest signals at AI conferences in 2025 were reasoning papers jumping from 47 to 216, a 4.6-fold rise, and agent-related terms exceeding 150 papers with 4.3–11-fold growth. Diffusion moved from breakout topic to infrastructure; RAG became a mainstream enterprise architecture with unusual coverage across all five conferences; state-space models and world models began tracing the early 2020–2021 path of Vision Transformers. Pure prompt-engineering papers encountered reviewer fatigue."
description: "Using topic distributions from more than 80,000 papers accepted between 2017 and 2025, this article analyzes what NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, AAAI, IJCAI, and ICCV accepted in 2025: breakouts, emerging fields, saturated topics, and the strongest bets in hindsight from 2026."
draft: false
series:
  name: "AI 頂會導讀"
  order: 25
glossary:
  - term: "test-time compute"
    definition: "Using extra computation during inference rather than training to improve performance. Typical techniques include chain-of-thought, tree search, and self-verification, allowing a model to reason longer before answering."
    context: "The central concept behind the 2025 reasoning-paper breakout and OpenAI's o1 family."
  - term: "RLVR"
    definition: "Reinforcement Learning with Verifiable Rewards fine-tunes models with objectively checkable signals such as correct math answers, without human preference labels."
    context: "A NeurIPS 2025 runner-up questioned whether RLVR actually teaches models new reasoning ability."
  - term: "world model"
    definition: "An internal representation of environmental dynamics that predicts the next state from the current state and an action, allowing an agent to simulate futures rather than act blindly."
    context: "An emerging direction that entered a pre-breakout stage with four-fold growth in 2025."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2025-topics)

2025 brought the largest submission volumes in top-AI-conference history: NeurIPS received 21,575 papers, CVPR 13,008, ICML 12,107, and AAAI 12,957, each a record. The more important story was the topic distribution. Khanbayov and Kurban's 2026 analysis of 80,814 Main Track papers at ACL, CVPR, ICLR, ICML, and NeurIPS from 2017 through 2025 found that AI topics undergo "topical phase transitions": years at the margin followed by simultaneous cross-conference breakout within one to three years.

At least two such transitions were underway in 2025.

## Full Breakout: Reasoning and Test-Time Compute

If one word summarizes 2025, it is **reasoning**. After o1 sparked hallway discussion in late 2024, papers containing "reasoning" rose from 47 to 216, a 4.6-fold increase and the fastest tracked keyword. Chain-of-thought and scaling laws grew 3.3–4.7 times. Several related terms accelerating together mirrored the pattern before the 2022–2023 LLM breakout.

Jay Alammar's map of roughly 5,800 NeurIPS 2025 acceptances found about 766 papers—13%—centered on reasoning. Awards reflected the same theme:

- NeurIPS runner-up **Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?** used large pass@k values to find that RLVR improved sampling efficiency rather than the capability boundary; base models became stronger at sufficiently large k. It concluded that current RLVR had not elicited genuinely novel reasoning.
- ICML Outstanding Paper **Train for the Worst, Plan for the Best** showed masked diffusion solving the most confident tokens first, raising Sudoku accuracy from 7% to 90%.
- ICML Outstanding Paper **Roll the dice & look before you leap** argued that next-token prediction intrinsically limits creativity and proposed multi-token methods and input-side seed conditioning.

These papers did not demonstrate how powerful reasoning models were. They asked where reasoning stops and why. The field moved from demos toward scientific understanding.

## Full Breakout: Agentic AI and Multi-Agent Systems

Four overlapping terms met pre-breakout criteria: "agent" grew 4.3 times, "agents" 8.3, "llm agents" 11.0, and "multi-agent system" 4.7. Together they appeared in more than 150 papers across four of five conferences.

NeurIPS alone accepted 367 agent-related papers across fifteen areas, including benchmarking, tools, reasoning, multi-agent collaboration, and safety. A synthesis described a shift from capability demonstration to critical evaluation.

- **Multi-agent collaboration failed systematically:** capable individual models lacked native social intelligence, communication protocols, theory of mind, and cooperative behavior. Agreement above 90% reduced their ability to challenge wrong answers.
- **Safety did not transfer to agentic settings:** alignment in static QA broke when systems gained tools and environmental interaction.
- ICLR Outstanding Paper **Safety Alignment Should be Made More Than Just a Few Tokens Deep** found shallow alignment concentrated in the first few token distributions, explaining vulnerability to fine-tuning, prefilling, and decoding attacks.

Native Sparse Attention addressed long-context efficiency relevant to agents. ICML's CollabLLM showed genuinely proactive collaboration, raising satisfaction 17.6% and reducing completion time 10.4%.

## Stable Mainstream: Diffusion Became Infrastructure

Diffusion was no longer emerging but infrastructure. NeurIPS Best Paper **Why Diffusion Models Don't Memorize** developed generalization theory instead of another architecture, a sign of maturity. Diffusion became a substrate for vision, audio, molecules, and 3D.

CVPR Honorable Mention **Navigation World Models** used video diffusion to predict navigational worlds, moving beyond attractive images toward dynamics. Flow matching, diffusion's continuous-time extension, grew 3.9 times to 118 papers and emerged as its technical successor.

## Stable Mainstream: Multimodality and LLMs Deepened

LLMs permeated nearly every cluster, and roughly 28% of NeurIPS papers focused on multimodality. The character of the work changed:

- **Architecture:** Qwen's Gated Attention applied precise surgery rather than merely enlarging a model.
- **Theory:** Superposition Yields Robust Neural Scaling explained scaling laws with Anthropic's toy model.
- **Knowledge editing:** AlphaEdit used null-space projection and improved editing 36.7% on average.
- **Fine-tuning theory:** Learning Dynamics of LLM Finetuning explained why excessive DPO can reduce quality.

ACL awards emphasized multilinguality, capability limits, hallucination, efficiency, and evaluation. Byte Latent Transformer and NSA reflected the move from bigger toward more efficient LLMs. EMNLP's Infini-gram mini and work on CoT faithfulness, preferences, field linguistics, and value-action gaps showed NLP diagnosing LLM problems rather than displaying capabilities.

## Emerging: World Models, RAG, and State-Space Models

These directions had 40–118 papers, 3.8–4.4-fold growth, and coverage across three to five venues: substantial, but not yet mainstream. Historical patterns suggested breakouts in 2026–2027.

| Direction | 2023 | 2024 | 2025 | Growth | Conference coverage |
|---|---:|---:|---:|---:|---:|
| Multimodal LLMs | 0 | 12 | 67 | 5.6× | 3 |
| Reasoning | – | 47 | 216 | 4.6× | 3 |
| RAG | 1 | 22 | 97 | 4.4× | **5 (all)** |
| Agent / LLM agents | 1 | 12 | 51 | 4.3× | 4 |
| Video generation | 4 | 20 | 84 | 4.2× | 4 |
| World model | 4 | 10 | 40 | 4.0× | 3 |
| Flow matching | 1 | 30 | 118 | 3.9× | 4 |
| State-space model | 3 | 11 | 42 | 3.8× | 4 |
| Mechanistic interpretability | 13 | 27 | 100 | 3.7× | 3 |

(Source: Khanbayov & Kurban, 2026; ACL/CVPR/ICLR/ICML/NeurIPS Main Tracks, 2017–2025.)

- **RAG** alone covered all five conferences, closer to active breakout than pre-breakout. It was positioned to produce retrieval-augmented reasoning and compound retrieval.
- **World models** sat at the intersection of video generation and model-based RL. Richard Sutton called directly for world models and planning.
- **State-space models**, led by Mamba, grew to 42 papers across four venues, resembling the early ViT-CNN transition.
- **Mechanistic interpretability** rose from 27 to 100 papers as understanding behavior became more urgent.

## Saturated or Declining

**Pure prompt engineering** met reviewer fatigue. Basic zero-shot, few-shot, and template tricks became engineering rather than research. A synthesis of 367 NeurIPS agent papers warned against claiming reasoning gains without verifying latent capability activation.

**Incremental gains on static benchmarks** also lost status. More than thirty NeurIPS benchmark papers and systematic critiques showed contamination, distribution shift, and simplified tasks overstating ability. D&B winner **Artificial Hivemind** created Infinity-Chat because existing benchmarks could not detect output homogenization.

**Traditional GAN architectures** had been displaced by diffusion and flow matching; almost no award paper centered on new GAN architecture.

## 2025 vs. 2024: What Changed?

| Dimension | 2024 | 2025 |
|---|---|---|
| Reasoning | o1 prompted discussion; few papers | Full breakout; 766 NeurIPS papers involved reasoning |
| Agents | Early capability demos | Critical evaluation exposed systemic weaknesses |
| Diffusion | Still expanding rapidly | Stable infrastructure; research shifted toward theory |
| LLM focus | Larger and broader | More efficient, understandable, and precise |
| Safety/alignment | Deeper RLHF | Shallow alignment exposed; agentic safety recognized as distinct |
| Evaluation | Benchmark gains | Benchmark criticism and contamination-resistant evaluation |

## Award-Winning Papers at a Glance

| Conference | Award | Paper | Direction |
|---|---|---|---|
| NeurIPS | Best Paper | Why Diffusion Models Don't Memorize | Diffusion theory |
| NeurIPS | Best Paper | 1000 Layer Networks for Self-Supervised RL | RL × scaling |
| NeurIPS | Best Paper | Gated Attention for LLMs | LLM architecture |
| NeurIPS | Best Paper (D&B) | Artificial Hivemind | LLM evaluation |
| NeurIPS | Runner-up | Does RL Really Incentivize Reasoning? | Reasoning limits |
| NeurIPS | Runner-up | Superposition Yields Robust Neural Scaling | Scaling theory |
| NeurIPS | Runner-up | Optimal Mistake Bounds for Transductive Online Learning | Learning theory |
| NeurIPS | Test of Time | Faster R-CNN (2015) | Object detection |
| ICML | Outstanding | CollabLLM | LLM collaboration |
| ICML | Outstanding | Train for the Worst, Plan for the Best | Masked diffusion |
| ICML | Outstanding | Roll the dice & look before you leap | Limits of creativity |
| ICML | Outstanding | Conformal Prediction as Bayesian Quadrature | Uncertainty |
| ICML | Outstanding | Score Matching with Missing Data | Generative theory |
| ICML | Outstanding | The Value of Prediction in Identifying the Worst-Off | ML and social policy |
| ICML | Position Paper | The AI Conference Peer Review Crisis | Peer review |
| ICML | Position Paper | AI Safety should prioritize the Future of Work | Safety and labor |
| ICML | Test of Time | TRPO and Normalizing Flows (2015) | RL / generation |
| ICLR | Outstanding | Safety Alignment: More Than a Few Tokens Deep | LLM safety |
| ICLR | Outstanding | Learning Dynamics of LLM Finetuning | Fine-tuning theory |
| ICLR | Outstanding | AlphaEdit | Knowledge editing |
| ICLR | Honorable | Data Shapley in One Training Run | Data valuation |
| ICLR | Honorable | SAM 2 | Vision segmentation |
| ICLR | Honorable | Faster Cascades via Speculative Decoding | Inference efficiency |
| ICLR | Test of Time | Adam (2014) | Optimization |
| ACL | Best Paper | Native Sparse Attention | Attention efficiency |
| ACL | Best Paper | Language Models Resist Alignment | Alignment theory |
| ACL | Best Paper | Difference Awareness | Fairness |
| ACL | 26 Outstanding | Multilinguality, hallucination, efficiency, evaluation | NLP broadly |
| EMNLP | Best Paper | Infini-gram mini | n-gram search |
| EMNLP | Outstanding | LingGym, MiCRo, CoT Faithfulness, and others | Linguistics, preference, reasoning |
| CVPR | Best Paper | VGGT | 3D vision |
| CVPR | Best Student | Neural Inverse Rendering from Propagating Light | Inverse rendering |
| CVPR | Honorable | MegaSaM, Navigation World Models, Molmo/PixMo | 3D, world models, VLMs |
| AAAI | Outstanding | Every Bit Helps, Abductive Reflection, Revelations | Theory |
| IJCAI | Distinguished | MORL with Restraining Bolts, Robust Compression, Hyper-Heuristics | RL and ethics |

## Looking Back from 2026

Based on the 2017–2025 phase-transition pattern and a typical two-year lead time:

1. **Reasoning and test-time compute** were the strongest signal and could exceed 500 cross-conference papers per year in 2026–2027.
2. **Agentic AI** had fragmented keywords beginning to consolidate, as diffusion terminology once did, suggesting sharper growth after consolidation.
3. **World models** drew momentum from both video generation and model-based RL.
4. **RAG** already covered all five conferences and was actively breaking out, likely to generate second-order fields in 2026.
5. **State-space models** could expand rapidly if competitive in multimodal and long-context settings.

The risk was equally important. NeurIPS 2025's broader story was a turn from capability display toward scientific rigor. Benchmarks, generalization, and safety alignment all faced unprecedented scrutiny. Richard Sutton said that AI, as a huge industry, had to some extent lost its way. Award-winning papers asked why methods work and where their limits lie, not merely whether they score higher. Scientific understanding and critical evaluation may therefore offer a better research return than another state-of-the-art benchmark result.

---

## References

- [Khanbayov & Kurban (2026), "Topical Phase Transitions in Artificial Intelligence Research"](https://doi.org/10.5281/zenodo.20635335) — comparison of 2024–2025 topic shifts.
- [NeurIPS 2025 Best Paper Awards](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards/)
- [NeurIPS 2025 Fact Sheet](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [Jay Alammar — Inside NeurIPS 2025](https://newsletter.languagemodels.co/p/the-illustrated-neurips-2025-a-visual)
- [ICML 2025 Outstanding Papers](https://joltml.com/icml-2025/awards/)
- [AIhub — ICML 2025 award winners](https://aihub.org/2025/07/16/congratulations-to-the-icml2025-award-winners/)
- [ICLR 2025 Outstanding Paper Awards](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Outstanding_Paper_Awards.pdf)
- [ICLR 2025 Fact Sheet](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Fact_Sheet.pdf)
- [ICLR 2025 Blog — Outstanding Paper Awards](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025/)
- [ACL 2025 Awards](https://2025.aclweb.org/program/awards/)
- [36kr — DeepSeek NSA wins ACL 2025 Best Paper](https://eu.36kr.com/en/p/3401632759482502)
- [EMNLP 2025 Awards](https://2025.emnlp.org/program/awards/)
- [CVPR 2025 Best Papers and Best Demos](https://cvpr.thecvf.com/Conferences/2025/BestPapersDemos)
- [CVPR 2025 Awards Press Release](https://cvpr.thecvf.com/Conferences/2025/News/Awards_Press)
- [AAAI-25 Paper Awards](https://aaai.org/about-aaai/aaai-awards/aaai-25-paper-awards/)
- [AIhub — IJCAI 2025 distinguished paper winners](https://aihub.org/2025/08/20/congratulations-to-the-ijcai2025-distinguished-paper-award-winners/)
- [Top-Conference-Best-Papers](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Dendi Suhubdy — Notable Papers](https://backpropagation.ai/posts/notable-papers-icml-iclr-neurips-cvpr-emnlp-2025-2026/)
