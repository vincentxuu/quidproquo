---
title: "What Top AI Conferences Accepted in 2024: The Year of Agents and the Scaling Debate"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2024", topic-analysis, ai-agent, scaling-law, multimodal]
lang: en
tldr: "The defining conference keywords of 2024 were agents, alignment, multimodal LLMs, and inference-time compute. The LLM share at five major conferences doubled again after its sharp 2023 rise; agent-related terms grew 4.3 times; and diffusion models graduated from an emerging topic to a second generative-AI pillar alongside LLMs. Traditional task-oriented NLP continued to contract, while GANs almost disappeared from top venues."
description: "A topic-level review of award-winning papers and research distributions across NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ECCV, AAAI, and IJCAI 2024: what broke out, what emerged, what saturated, and which bets looked strongest from 2026."
draft: false
series:
  name: "AI 頂會導讀"
  order: 21
glossary:
  - term: "DPO"
    definition: "Direct Preference Optimization, an alignment method that directly optimizes a language model on preference data without training a separate reward model. Its training process is simpler than PPO-based RLHF."
    context: "DPO and its variants became mainstream alternatives in alignment research during 2024."
  - term: "inference-time compute"
    definition: "Additional computation during inference—such as chain-of-thought, tree search, or self-verification—used to improve answers without a larger pretrained model."
    context: "OpenAI's release of o1 at the end of 2024 moved the topic from academic research into the center of industry attention."
  - term: "3D Gaussian Splatting"
    definition: "A real-time rendering technique that represents a scene with many 3D Gaussian distributions. It runs orders of magnitude faster than NeRF and appeared throughout computer-vision conferences in 2024."
    context: "CVPR 2024 Best Student Paper Mip-Splatting belonged to this line of work."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2024-topics)

2024 was the year AI research became thoroughly "LLM-ified." A longitudinal analysis of roughly 80,000 accepted papers at ACL, CVPR, ICLR, ICML, and NeurIPS found another steep rise in LLM papers, 4.3-fold growth in agent-related keywords, and diffusion models joining LLMs as the two central pillars of generative AI. This article examines both awards and topic distributions to ask what the major AI conferences actually accepted in 2024.

## Award-Winning Papers in 2024

Awards provide a rough signal of which directions program committees considered most important that year.

### The Three Major ML Conferences

**NeurIPS 2024** (15,671 submissions / 4,037 accepted / 25.8%)

| Award | Paper | Team | Direction |
|---|---|---|---|
| Best Paper | Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction | Keyu Tian et al. (Peking University / ByteDance) | Visual generation |
| Best Paper | Stochastic Taylor Derivative Estimator | Zekun Shi et al. (NUS) | Scientific computing / PDEs |
| Runner-up | Not All Tokens Are What You Need for Pretraining | Zhenghao Lin et al. (Tsinghua / Microsoft) | LLM training efficiency |
| Runner-up | Guiding a Diffusion Model with a Bad Version of Itself | Tero Karras et al. (NVIDIA) | Diffusion inference |
| D&B Best Paper | The PRISM Alignment Dataset | Hannah Rose Kirk et al. (Oxford / Meta) | LLM alignment |
| Test of Time | Generative Adversarial Nets (2014) | Goodfellow et al. | — |
| Test of Time | Sequence to Sequence Learning (2014) | Sutskever et al. | — |

The two Best Papers covered visual generation and scientific computing; the runners-up addressed training efficiency and diffusion inference; the D&B winner was an alignment dataset. Together they spanned three of 2024's largest directions.

**ICML 2024** (9,473 submissions / 2,609 accepted / 27.5%)

Ten Best Papers came from more than 9,400 submissions:

- **Scaling Rectified Flow Transformers for High-Resolution Image Synthesis** (Stability AI / Robin Rombach et al.) supplied the technology behind Stable Diffusion 3 and established rectified flow as a successor to DDPM training.
- **Genie: Generative Interactive Environments** (Google DeepMind) learned an interactive world model from unlabeled web video, with an 11B-parameter foundation model.
- **Debating with More Persuasive LLMs Leads to More Truthful Answers** (Anthropic / NYU / UCL) used LLM debate for alignment, allowing a weaker, non-expert judge to identify answers by observing stronger models debate.
- **Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution** (Stanford) connected discrete and continuous generation.
- **Position: Considerations for Differentially Private Learning with Large-Scale Public Pretraining** (ETH / Google DeepMind / Waterloo) challenged the privacy assumptions behind public-data pretraining followed by DP fine-tuning.
- **Position: Measure Dataset Diversity, Don't Just Claim It** (Sony AI) proposed a framework for measuring dataset diversity.

Two Position Papers among the winners showed growing respect for conceptual contributions that challenge assumptions. Genie and the debate paper foreshadowed larger breakouts in world models and LLM alignment during 2025.

**ICLR 2024** (7,262 submissions / 2,260 accepted / 31.1%)

Five Outstanding Papers and eleven Honorable Mentions included:

- **Vision Transformers Need Registers** (Meta FAIR), which fixed high-norm artifacts in ViT feature maps with register tokens.
- **Learning Interactive Real-World Simulators (UniSim)** (UC Berkeley / Google DeepMind), another interactive world model trained on multiple data sources.
- **Never Train from Scratch**, which reevaluated SSM-Transformer comparisons with self-supervised pretraining and found Transformers had been substantially underestimated.
- **Protein Discovery with Discrete Walk-Jump Sampling**, whose antibody-design samples expressed and purified successfully at rates of 97–100%.
- **Generalization in Diffusion Models Arises from Geometry-Adaptive Harmonic Representations**, a theory of diffusion-model generalization.

Notable Honorable Mentions covered adaptive KV-cache compression, black-box test-set contamination, robust agents learning causal world models, and flow matching on general geometries. The inaugural Test of Time awards went to VAE (Kingma & Welling, 2014) and Adversarial Examples (Szegedy et al., 2014).

### NLP Conferences

**ACL 2024** (4,407 submissions / 940 accepted / 21.3%) expanded awards into Outstanding Papers covering no more than 2.5% of acceptances. The 102 nominees included work on hallucination-aware abstention, multi-agent safety, long-context evaluation, political-value evaluation, speech translation with foundation models, multilingual code generation, and causally guided LLM debiasing.

Nearly every Outstanding Paper directly involved LLMs. Independent methods for traditional tasks such as parsing, semantic-role labeling, and machine translation had become marginal in the award list.

**EMNLP 2024** (6,105 submissions / 1,271 accepted / 20.8%) named five Best Papers: culturally relevant image transcreation; speech representations for thousands of languages; Backward Lens for LLM interpretability; detection of LLM pretraining data; and CoGen's coupled comprehension and generation. Speech, vision, and interpretability made this list more varied than ACL's, although LLM interpretation and data detection remained central.

### Computer-Vision Conferences

**CVPR 2024** (11,532 submissions / 2,719 accepted / 23.6%) gave a record ten paper awards. Best Papers covered Generative Image Dynamics and Rich Human Feedback for Text-to-Image Generation; Best Student Papers were Mip-Splatting and BioCLIP; Honorable Mentions covered event cameras, pixelSplat, 3D shape matching, super-resolution GNNs, stochastic geometry, and Transformer-CNN decision mechanisms. Two 3DGS papers won, while Rich Human Feedback showed that alignment had entered computer vision.

**ECCV 2024** (8,585 submissions / 2,387 accepted / 27.8%) gave Best Paper to **Minimalist Vision with Freeform Pixels**, a return to sensor-level physics rather than LLMs, diffusion, or 3DGS. Honorable and Outstanding work included concept arithmetic for diffusion safeguards, rasterized edge gradients, SEA-RAFT, Sapiens, PointLLM, and PathMMU. LLM-vision work still occupied a substantial share of the broader award slate.

### Broad AI Conferences

**AAAI 2024** (9,862 submissions / 2,342 accepted / 23.8%) awarded GxVAEs for molecule generation, Reliable Conflictive Multi-view Learning, and proportional preference aggregation. None focused directly on LLMs.

**IJCAI 2024** (5,651 submissions / 791 accepted / 14.0%) awarded work on online combinatorial optimization under fairness constraints, epistemic policies for controlled query evaluation, and online learning of capacity-based preference models. Like AAAI, it emphasized established AI questions—fairness, knowledge representation, and preference learning—rather than following the ML conferences' LLM wave.

## The Hottest Research Directions

### LLM Agents and Tool Use

2024 was the first year agents moved from a concept into systematic research. Agent-related keywords grew 4.3 times, from 12 to 51 papers; including variants such as "LLM agents" and "multi-agent system" made the rise steeper, with "LLM agents" growing eleven-fold.

ICML accepted GPTSwarm for computational-graph optimization of agent architectures and TravelPlanner as a planning benchmark. ACL's PsySafe studied multi-agent attacks and defenses; ICLR recognized Robust Agents Learn Causal World Models. Claude Computer Use and commercial coding agents accelerated the field again late in the year.

### LLM Alignment: DPO and Its Variants

InstructGPT and RLHF established the basic paradigm in 2022–2023. The 2024 theme was simpler, more stable alternatives. DPO and variants including IPO, KTO, ORPO, and SimPO became one of the busiest subfields. PRISM won the NeurIPS D&B award; ICML's debate paper explored debate-based alignment; and a NeurIPS Oral used iterative DPO to improve chain-of-thought reasoning.

### Multimodal LLMs

Multimodal LLM papers grew 5.6 times, from 12 to 67. GPT-4V and Gemini moved vision-language models into products; conferences saw open MLLMs such as LLaVA, Cambrian-1, and InternVL alongside new benchmarks. PointLLM, PathMMU, and multiple CVPR papers fused language and vision. EMNLP awards for image transcreation and speech representations showed NLP venues embracing multimodality too.

### Inference-Time Compute and Reasoning

OpenAI o1 made additional inference compute the year's most visible late-breaking topic, although the signal was already present at midyear conferences. Chain-of-thought research remained active; NeurIPS featured iterative preference optimization for CoT, and ICLR recognized KV-cache compression. The keyword "reasoning" would grow 4.6 times from 2024 to 2025, from 47 to 216 papers.

### Diffusion Models and Flow Matching

Diffusion had become stable infrastructure. The more important new signal was flow matching. ICML Best Paper Scaling Rectified Flow Transformers established rectified flow as a next-generation training paradigm; ICLR recognized Flow Matching on General Geometries. Flow matching grew 3.9 times and was positioned to displace conventional DDPMs further in 2025–2026. NeurIPS runners-up included diffusion autoguidance, while VAR represented an autoregressive challenge to diffusion in vision.

### 3D Gaussian Splatting

3DGS was computer vision's signature breakout. From the original late-2023 paper, the field grew to hundreds of related CVPR 2024 papers. Mip-Splatting and pixelSplat won awards, and 3DGS largely displaced NeRF in real-time 3D rendering.

### AI for Science

Protein Discovery at ICLR, molecule-generating GxVAEs at AAAI, and NeurIPS Best Paper STDE for physical-simulation PDEs showed AI for Science moving beyond mere representation into the award tier. Protein design, molecular generation, and PDE solving all produced prize-level work.

## Emerging Directions

### World Models

ICML's Genie and ICLR's UniSim both won awards. World-model papers grew four-fold, from 10 to 40, and appeared poised for a larger 2026–2028 breakout. The central question was whether video could yield an interactive simulator in which an agent could train.

### Mechanistic Interpretability

Mechanistic interpretability grew 3.7 times, from 27 to 100 papers. EMNLP Best Paper Backward Lens projected gradients into vocabulary space; ICLR also recognized mechanistic analysis of in-context learning. A niche became a substantial independent subfield.

### State-Space Models

SSMs, especially Mamba, grew 3.8 times. ICLR Outstanding Paper Never Train from Scratch concluded that Transformers had been underestimated, but the SSM-Transformer comparison was important enough to merit the award. Mamba 2 and Jamba advanced the line through year-end, though Transformers remained dominant.

### Test-Set Contamination and Data Provenance

ICLR Honorable Mention Proving Test Set Contamination and EMNLP Best Paper Pretraining Data Detection independently asked what LLMs had seen. The parallel work reflected mounting concern about trustworthy evaluation and would intensify in 2025–2026.

## Saturated or Declining Directions

### GANs

Giving NeurIPS's Test of Time award to the original 2014 GAN paper felt like a symbolic farewell. Architectural GAN work had nearly disappeared, replaced by diffusion and flow matching. The few remaining papers used diffusion to improve GANs or analyzed GAN theory rather than introducing new GAN architectures.

### Traditional Task-Oriented NLP

LLMs occupied almost the entire ACL Outstanding list. Standalone models for named entities, relation extraction, and dependency parsing disappeared from awards. Cross-conference statistics confirmed the continued relative decline of task-oriented NLP as it was absorbed into the LLM paradigm.

### Pure Prompt Engineering

After the 2022–2023 boom, papers whose main contribution was a better prompt template began facing reviewer fatigue. Reviewers increasingly expected systematic theory or large-scale empirical validation, not gains on a handful of benchmarks.

### NeRF

3DGS rapidly displaced NeRF. Some NeRF improvements remained, but new 3D-representation research largely moved to 3DGS. CVPR Honorable Mention pixelSplat demonstrated its growing advantage in generalization.

## Compared with 2023

| Dimension | 2023 | 2024 |
|---|---|---|
| LLM share | Rising rapidly, with many non-LLM papers remaining | Dominant across almost every subfield |
| Agents | Concept stage; few papers | Systematic research breakout, up 4.3× |
| Diffusion | Became mainstream | Stable mainstream plus rising flow matching |
| 3DGS | Original paper had just appeared | Hundreds of CVPR papers and two awards |
| Alignment | Primarily RLHF | A proliferation of DPO variants |
| World models | Scattered exploration | Two award winners, Genie and UniSim |
| Position Papers | Occasional | Two ICML Best Papers; conceptual challenges gained status |

## Looking Back from 2026

Which 2024 topic choices aged best?

1. **Inference-time compute and reasoning.** After o1, the field broke out and became one of 2025's largest submission topics, growing 4.6 times. Researchers already positioned there gained a head start.
2. **Systematic AI-agent research.** Agent architecture, tool use, and multi-agent systems became independent subfields, while coding- and browser-agent demand grew commercially.
3. **Flow matching.** Its 3.9-fold 2024 growth continued; Stable Diffusion 3 and Flux adopted rectified flow, and academia followed quickly.
4. **Mechanistic interpretability.** Growth continued as Anthropic, Google DeepMind, and others invested heavily, making it a pillar of alignment research in 2025–2026.
5. **World models.** Genie 2, Sora, and related products sustained both academic and industrial interest, although how much physical understanding these systems learn remained open.

By contrast, pure prompt engineering required deeper theory by 2025, and the track for incremental GAN architecture work had effectively closed.

## Overall

The 2024 topic distribution had three structural features: **LLMs permeated every field**, from NLP into vision, speech, and scientific computing; **generative AI developed two pillars**, LLMs alongside diffusion/flow; and research moved **from capability toward governance**, with alignment, contamination detection, and dataset diversity winning major awards.

AAAI and IJCAI's resistance was equally notable. Their award programs kept distance from the LLM wave and continued to recognize fairness, knowledge representation, and decision theory. That need not be conservatism; amid an LLM frenzy, it may have preserved the field's intellectual diversity.

---

## References

- [NeurIPS 2024 Best Paper Awards](https://media.neurips.cc/Conferences/NeurIPS2024/NeurIPS2024_Best_Paper_Awards.pdf)
- [NeurIPS Blog — Announcing the NeurIPS 2024 Best Paper Awards](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards/)
- [ICML 2024 Awards](https://icml.cc/virtual/2024/awards_detail)
- [AIHub — ICML 2024 award winners](https://aihub.org/2024/07/25/congratulations-to-the-icml2024-award-winners/)
- [ICLR 2024 Outstanding Paper Awards](https://blog.iclr.cc/2024/05/06/iclr-2024-outstanding-paper-awards/)
- [ICLR 2024 Fact Sheet](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024-Fact_Sheet.pdf)
- [ICLR 2024 Press Release](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024_Press_Release.pdf)
- [ACL 2024 Best Paper Awards](https://2024.aclweb.org/program/best_papers/)
- [ACL Anthology — ACL 2024 Proceedings Preface](https://aclanthology.org/2024.acl-long.0.pdf)
- [EMNLP 2024 Best Papers](https://2024.emnlp.org/program/best_papers/)
- [CMU LTI — Dual Best Paper Awards at EMNLP](https://www.lti.cs.cmu.edu/news-and-events/news/2024-11-21-emnlp-best-papers.html)
- [CVPR 2024 Best Paper Awards](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [IEEE Computer Society — CVPR 2024 Best Paper Award Winners](https://www.computer.org/press-room/cvpr-2024-announces-best-paper-award-winners)
- [ECCV 2024 Awards](https://eccv.ecva.net/Conferences/2024/Awards)
- [AAAI-24 Paper Awards](https://aaai.org/about-aaai/aaai-awards/aaai-24-paper-awards/)
- [AIHub — IJCAI 2024 distinguished paper award winners](https://aihub.org/2024/08/07/congratulations-to-the-ijcai2024-distinguished-paper-award-winners/)
- [Khanbayov & Kurban (2026), "Topical Phase Transitions in Artificial Intelligence Research"](https://doi.org/10.5281/zenodo.20635335)
- [Matej Gazda — Paper Map: NeurIPS / CVPR / ICLR / ICML 2024–2025](https://matejgazda.com/posts/paper-map.html)
- [Zeta Alpha — A Guide to NeurIPS 2024](https://www.zeta-alpha.com/post/a-guide-to-neurips-2024)
- [State of AI Report 2024](https://www.stateof.ai/2024)
