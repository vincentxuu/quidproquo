---
title: "What AI Conferences Published in 2022: The Diffusion Boom, Chain-of-Thought, and the Eve of ChatGPT"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2022", topic-analysis, diffusion-model, chain-of-thought, rlhf, scaling-laws]
lang: en
tldr: "2022 was a turning point at major AI conferences. Diffusion models moved from emerging to mainstream, with two NeurIPS Outstanding Papers; Chinchilla rewrote scaling laws; Chain-of-Thought showed that large models could reason; and InstructGPT used RLHF to teach language models to follow instructions. When ChatGPT launched at year-end, these academic topics instantly became global news."
description: "A topic-level review of award winners across NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ECCV, AAAI, and IJCAI in 2022, covering the diffusion boom, rewritten scaling laws, Chain-of-Thought reasoning, productized RLHF, and the research directions that delivered the highest returns by 2026."
draft: false
series:
  name: "AI 頂會導讀"
  order: 13
glossary:
  - term: "Chain-of-Thought (CoT)"
    definition: "A prompting technique that adds intermediate reasoning to few-shot examples so a large language model also generates a reasoning process, greatly improving mathematical and logical reasoning."
    context: "Wei et al.’s NeurIPS 2022 CoT paper was among the year’s most cited."
  - term: "RLHF (Reinforcement Learning from Human Feedback)"
    definition: "Training a reward model on human preferences, then using reinforcement learning to fine-tune a language model toward human intent. It was InstructGPT’s core technology and a key method behind ChatGPT."
    context: "In 2022, RLHF moved directly from an academic paper into a product, most visibly when ChatGPT launched at year-end."
  - term: "Scaling Laws"
    definition: "Empirical laws describing performance changes with model size, data, and compute. Kaplan et al. in 2020 prioritized larger models; the 2022 Chinchilla paper directly overturned that conclusion."
    context: "Chinchilla showed that existing large models were severely undertrained: under the same compute budget, smaller models trained on more data did better."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2022-topics)

In 2021, leading AI conferences were still exploring diffusion theory, the limits of self-supervision, and the spread of Transformers. All accelerated in 2022. What made the year a dividing line was not one breakthrough but several directions maturing and intersecting at once: diffusion became a commercial product in DALL·E 2 and Stable Diffusion, Chinchilla rewrote scaling laws, Chain-of-Thought taught language models to reason, and RLHF moved from papers into ChatGPT’s core engine.

This article organizes nine major conferences by research direction: what accelerated, what declined, and which bets produced the highest returns by 2026.

## Full-Scale Breakout: Diffusion Models Dominated Generative AI

The common denominator of AI conferences in 2022 was the **diffusion model**.

**Two of NeurIPS 2022’s 13 Outstanding Papers directly concerned diffusion**, unusual concentration at a conference accepting 2,672 papers:

- **Elucidating the Design Space of Diffusion-Based Generative Models** (Tero Karras et al., NVIDIA) organized disparate variants into one coherent framework and made subsequent development more efficient.
- **Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding** (Chitwan Saharia et al., Google Brain), the Imagen paper, showed the power of combining a separately trained large language model with an image decoder and produced then-leading image quality.

One **ICLR 2022 Outstanding Paper** was also about diffusion: Analytic-DPM by Fan Bao and colleagues at Tsinghua University, which analytically derived the optimal variance of the reverse process.

CVPR’s Best Student Paper Honorable Mention went to **Ref-NeRF** by Dor Verbin and colleagues at Google. It was NeRF rather than diffusion, but reflected the broader enthusiasm for generative 3D models. Outside conferences, DALL·E 2 launched in April and Stable Diffusion in August, turning diffusion from an academic topic into global news.

In 2021, only one diffusion paper won a top-conference award, ICLR’s Score-Based Generative Modeling through SDEs, and paper volume was low. In 2022, outstanding-level work appeared at several conferences and volume multiplied. A promising direction became something everyone pursued.

## Rewriting the Rules: Scaling Laws and Chinchilla

The **Chinchilla paper** fundamentally changed the field’s understanding of large language models.

NeurIPS Outstanding Paper **An Empirical Analysis of Compute-Optimal Large Language Model Training** by Jordan Hoffmann and colleagues at DeepMind directly overturned Kaplan et al.’s 2020 scaling laws. **Contemporary LLMs were badly undertrained.** Under the same compute budget, smaller models trained on more data worked better; parameters and training tokens should grow at roughly equal rates instead of increasing parameter count without proportional data.

DeepMind validated the result: 70B-parameter Chinchilla used the same compute as 280B-parameter Gopher, yet significantly beat Gopher on almost every downstream task, along with 175B GPT-3 and 530B Megatron-Turing NLG.

Another NeurIPS Outstanding Paper, **Beyond Neural Scaling Laws: Beating Power Law Scaling via Data Pruning** by Ben Sorscher et al. at Stanford and Meta AI, showed that intelligent pruning could beat power-law scaling and match performance with less data.

The effects endure: Chinchilla changed later training strategies, including Llama, while data quality over sheer volume became consensus.

## Language Models Learned to Reason: Chain-of-Thought and InstructGPT

Another defining line was making language models not only generate text but **reason and follow instructions**.

**Chain-of-Thought Prompting at NeurIPS 2022** by Jason Wei and colleagues at Google showed that intermediate reasoning in few-shot examples sharply improved mathematics and logic in models of at least 100B parameters. This was an **emergent ability**: CoT hurt small models and helped only large ones. PaLM 540B doubled accuracy on GSM8K with CoT. Though not an Outstanding Paper, its influence exceeded that of most winners, starting a line extending through OpenAI o1 in 2024.

**InstructGPT at NeurIPS 2022** by Long Ouyang and colleagues at OpenAI directly preceded ChatGPT. The 1.3B-parameter RLHF-tuned model **beat an untuned 175B GPT-3** in human evaluations, overcoming more than a 100-fold size gap. It also showed a low “alignment tax”: alignment caused manageable degradation on most public benchmarks.

ACL Outstanding Paper **Fantastically Ordered Prompts and Where to Find Them** by Yao Lu et al. at UCL showed that exemplar order could dramatically change few-shot results. Like CoT, it demonstrated that communicating with a large model was itself a nontrivial research problem.

## Embodied AI and Open-World Agents

Two NeurIPS awards pointed toward **Embodied AI**, in which systems act in environments rather than only processing text and images:

- **ProcTHOR** (Matt Deitke et al., AI2 / University of Washington) used procedural generation for large-scale 3D environments, allowing embodied AI to benefit from scaling as language models benefited from text.
- **MineDojo**, also from AI2 and an Outstanding Benchmarks Paper, created a Minecraft benchmark and trained agents with internet-scale knowledge from YouTube, wikis, and other sources.

The community was asking whether language-model scaling could transfer to other modalities. The answer required environments and data at corresponding scale, not only larger models.

## Core Directions by Conference

### The Three ML Conferences: NeurIPS, ICML, and ICLR

**NeurIPS 2022** covered diffusion (two Outstanding Papers), scaling laws (two), OOD detection, SGD theory, gradient estimation, embodied AI, neural retrieval, Bayesian learning, multiple distributions, and human inductive biases. LAION-5B won in Datasets & Benchmarks and supplied part of Stable Diffusion’s training data. The Test of Time Award went to **AlexNet (2012)**. In hindsight, AlexNet and Chinchilla shared a lesson: allocating data and compute well mattered more than simply enlarging a model.

**ICML 2022’s** ten Outstanding Papers leaned toward theory and methodology: V-Usable Information for dataset difficulty, the counterintuitive possibility that Bayesian marginal likelihood correlated negatively with generalization, offline RL through ATAC, scrutiny of differentiable simulators, conformal prediction, causal fairness, and non-Markovian exploration. Its tone questioned assumptions more than it showcased systems.

**ICLR 2022’s** seven Outstanding Papers included Bootstrapped Meta-Learning, private hyperparameter tuning, Analytic-DPM, Neural Collapse theory, GNN expressivity, and distribution comparison. Honorable Mention **S4**, Structured State Spaces for Long Sequences by Albert Gu et al., later developed into Mamba, one of the strongest alternatives to Transformers.

### NLP Conferences: ACL, EMNLP, and NAACL

**ACL 2022’s** Best Paper, Learned Incremental Representations for Parsing by Nikita Kitaev et al., designed maximally non-anticipatory incremental parsing. Its Special Theme winner addressed low-resource speech synthesis for language revitalization. As with ACL’s 2021 signed-language theme paper, this advanced language diversity and social impact.

**EMNLP 2022’s** Best Long Paper, Abstract Visual Reasoning with Tangram Shapes by Anya Ji et al., introduced KiloGram to study abstract visual reasoning by humans and machines.

**NAACL 2022** had five co-winners, including FNet, which replaced attention with Fourier token mixing, and NeuroLogic A*esque Decoding for constrained generation.

Prompt-based methods moved from novelty in 2021 to a default starting point, while factuality evaluation became a new focus. An ACL Outstanding Paper evaluated factuality in text simplification.

### Computer Vision Conferences: CVPR and ECCV

**CVPR 2022’s** Best Paper, Learning to Solve Hard Minimal Problems by Petr Hruby et al. at ČVUT, was theoretical geometric vision. Amid diffusion and Transformers, the top award remained with a traditional geometry problem. EPro-PnP won Best Student Paper; Ref-NeRF received its Honorable Mention.

**ECCV 2022’s** Best Paper, On the Versatile Uses of Partial Distance Correlation in Deep Learning by Xingjian Zhen et al. at UW–Madison, introduced a general correlation measure. Pose-NDF and Level Set Theory for Neural Implicit Evolution received Honorable Mentions.

NeRF and neural implicit representations exploded, CLIP-driven vision-language models kept growing, and papers on pure CNN backbones declined visibly.

### General AI Conferences: AAAI and IJCAI

**AAAI 2022’s** Outstanding Paper was Online Certification of Preference-Based Fairness for Personalized Recommender Systems by Do et al. at Meta. Distinguished Papers covered AlphaHoldem, combinatorial optimization, matching, robust control, and multi-objective search.

**IJCAI-ECAI 2022** selected Plurality Veto, QCDCL with Cube Learning, and Completeness and Diversity in Retrosynthesis. Unlike the LLM and diffusion concentration at the ML conferences, AAAI and IJCAI remained highly diverse across classical AI.

## Directions That Began Emerging in 2022

### RLHF and AI Alignment

InstructGPT appeared in 2022, but RLHF remained an early top-conference topic. ChatGPT’s November launch made it a hot track only after NeurIPS 2022 deadlines. Few 2022 papers directly addressed RLHF or alignment; volume exploded in the 2023 cycle.

### State Space Models

ICLR Honorable Mention **S4** was among the year’s most underestimated emerging directions. It replaced attention with a structured state-space model for long sequences and significantly beat Transformers on long-range dependencies. It developed into Mamba at the end of 2023, the first alternative genuinely competitive across several domains.

### AI for Science

AI for Science became more visible. ICLR invited DeepMind’s Pushmeet Kohli to keynote on “Leveraging AI for Science,” and NeurIPS hosted several workshops on scientific ML. AlphaFold2 had shown the potential in 2021; in 2022 it entered mainstream ML conferences more systematically.

## Directions That Were Saturated or Declining in 2022

### Traditional GAN Improvements

Once diffusion decisively surpassed GAN image quality, papers devoted solely to GAN architectures declined. GANs remained useful for video and 3D generation, but incremental FID improvements were no longer an attractive direction.

### Neural Architecture Search (NAS)

NAS volume began declining because standard Transformer and diffusion architectures worked well and scaled predictably, reducing the marginal return of manual or automatic architecture search.

### Federated Learning

Federated-learning volume continued leveling off. Core questions in privacy guarantees, communication efficiency, and non-IID data had been heavily studied; new work was mainly applied and struggled for top main-track scores.

## Award-Winning Papers from 2022 at a Glance

| Conference | Award | Paper | Area |
|---|---|---|---|
| NeurIPS | Outstanding Paper | Elucidating the Design Space of Diffusion-Based Generative Models | Diffusion |
| NeurIPS | Outstanding Paper | Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding | Diffusion / Text-to-Image |
| NeurIPS | Outstanding Paper | An Empirical Analysis of Compute-Optimal LLM Training (Chinchilla) | Scaling Laws |
| NeurIPS | Outstanding Paper | Beyond Neural Scaling Laws: Beating Power Law via Data Pruning | Scaling / Data Pruning |
| NeurIPS | Outstanding Paper | Is Out-of-Distribution Detection Learnable? | OOD Detection Theory |
| NeurIPS | Outstanding Paper | ProcTHOR: Large-Scale Embodied AI Using Procedural Generation | Embodied AI |
| NeurIPS | Outstanding Paper | Gradient Descent: The Ultimate Optimizer | Optimization Theory |
| NeurIPS | Outstanding D&B | LAION-5B | Open Dataset |
| NeurIPS | Outstanding D&B | MineDojo | Embodied AI Benchmark |
| NeurIPS | Test of Time | AlexNet (2012) | CNN / Origin of Deep Learning |
| ICML | Outstanding Paper | Understanding Dataset Difficulty with V-Usable Information | Data Evaluation |
| ICML | Outstanding Paper | Bayesian Model Selection, the Marginal Likelihood, and Generalization | Bayesian |
| ICML | Outstanding Paper | Do Differentiable Simulators Give Better Policy Gradients? | RL / Physical Simulation |
| ICML | Outstanding Paper | Causal Conceptions of Fairness and their Consequences | Fairness / Causal Inference |
| ICML | Outstanding Paper Runner-Up | Adversarially Trained Actor Critic for Offline RL (ATAC) | Offline RL |
| ICLR | Outstanding Paper | Analytic-DPM | Diffusion |
| ICLR | Outstanding Paper | Bootstrapped Meta-Learning | Meta-Learning |
| ICLR | Outstanding Paper | Neural Collapse Under MSE Loss | Deep Learning Theory |
| ICLR | Honorable Mention | Efficiently Modeling Long Sequences with Structured State Spaces (S4) | Sequence Modeling |
| CVPR | Best Paper | Learning to Solve Hard Minimal Problems | Geometric Vision |
| CVPR | Best Student Paper | EPro-PnP | Pose Estimation |
| CVPR | Best Student Paper HM | Ref-NeRF | NeRF |
| ECCV | Best Paper | On the Versatile Uses of Partial Distance Correlation in Deep Learning | Model Analysis |
| ACL | Best Paper | Learned Incremental Representations for Parsing | Syntactic Parsing |
| ACL | Best Theme | Low-Resource Speech Synthesis for Language Revitalization | Language Revitalization |
| ACL | Best Resource | DiBiMT: WSD Biases in Machine Translation | Translation Bias |
| EMNLP | Best Long Paper | Abstract Visual Reasoning with Tangram Shapes | Visual Reasoning |
| NAACL | Best Paper | FNet: Mixing Tokens with Fourier Transforms | Efficient Models |
| NAACL | Best Paper | NeuroLogic A*esque Decoding | Constrained Generation |
| AAAI | Outstanding Paper | Online Certification of Preference-Based Fairness | Fairness / Recommenders |
| AAAI | Distinguished | AlphaHoldem: End-to-End RL for No-Limit Poker | RL / Games |
| IJCAI | Distinguished | Plurality Veto | Voting Theory |
| IJCAI | Distinguished | Completeness and Diversity in Retrosynthesis | Search / Chemical Synthesis |

## Looking Back from 2026: Which Bets Produced the Highest Returns?

### Highest-Return Directions

- **Diffusion models:** The 2022 entrants still captured enormous upside. Karras’s design-space paper became a reference framework for later systems. From 2022–2024, diffusion spread from images to video in Sora, 3D in DreamFusion, and audio in AudioLDM.
- **Chain-of-Thought and reasoning enhancement:** CoT ignited prompt engineering and reasoning research, from Self-Consistency in 2022 and Tree-of-Thoughts in 2023 through OpenAI o1 in 2024. The line was still unfinished in 2026.
- **RLHF and alignment:** InstructGPT directly preceded ChatGPT. Researchers entering RLHF in 2022 became highly sought after after the 2023 boom, and the area continued evolving through DPO, Constitutional AI, and RLHF alternatives.
- **Scaling laws and compute-optimal training:** Chinchilla changed industry training strategy, giving researchers who understood scaling systematic advantages in the model race.

### Stable Without an Explosion

- **OOD detection and robustness:** NeurIPS recognized it, and it grew steadily from 2023–2025 without a breakthrough application.
- **Embodied AI:** ProcTHOR and MineDojo provided infrastructure, but products advanced much more slowly than language models. The field was growing in 2026 but had not exploded.

### Underestimated in Hindsight

- **S4 and state-space models:** ICLR’s Honorable Mention was widely overlooked, but its descendant Mamba became the only genuine Transformer competitor, with practical uses for long sequences and edge deployment. Researchers who entered SSMs in 2022 had a clear first-mover advantage.

### Confirmed Past Their Peak

- **GAN architecture improvements:** after 2022, almost no pure GAN improvement earned top-conference recognition.
- **NAS:** displaced by scaling with standard architectures.
- **Traditional NLP benchmark gaming:** optimizing a single benchmark lost value sharply in the presence of LLMs.

## 2022 vs. 2021: One Year of Acceleration and Decline

| Direction | 2021 | 2022 | Trend |
|---|---|---|---|
| Diffusion Model | Emerging (one Outstanding Paper) | Full breakout (multiple Outstanding Papers plus commercialization) | Rapid acceleration |
| Scaling / LLM training strategy | No dedicated research | Chinchilla rewrote the rules | From absent to established |
| Chain-of-Thought / Prompting | Did not exist | Published at NeurIPS and ignited the field | From absent to established |
| RLHF / Alignment | Studied by very few | InstructGPT published; ChatGPT launched at year-end | Niche to product |
| Self-supervised learning | Common denominator | Still active but absorbed into the foundation-model narrative | Peak to stable |
| Vision Transformer | Full breakout | Became the default, no longer a new direction | Mainstream, no longer news |
| GNN | Peak | Continued but began declining | Declining |
| Federated Learning | Peak | Continued leveling off | Saturated |
| GAN | Still many papers | Replaced by diffusion | Rapid decline |

**The central lesson of 2022:** if 2021’s keyword was the spread of Transformers across domains, 2022’s was emergent LLM capabilities—qualitative change once models became large enough, not merely linear quantitative gains. Chain-of-Thought, InstructGPT, and Chinchilla all pointed to the same conclusion: the field’s understanding of large-model capabilities changed fundamentally in 2022. ChatGPT’s year-end launch merely turned that academic realization into public fact.

---

## References

- [NeurIPS 2022 Outstanding Paper Awards (official blog)](https://blog.neurips.cc/2022/11/21/announcing-the-neurips-2022-awards/)
- [NeurIPS 2022 Awards](https://neurips.cc/virtual/2022/awards_detail)
- [Synced—NeurIPS 2022 Announces Outstanding Papers and Test of Time Award](https://syncedreview.com/2022/11/23/neurips-2022-announces-its-outstanding-main-track-papers-outstanding-dataset-benchmark-papers-and-test-of-time-award/)
- [ICML 2022 Outstanding Paper Awards—AIhub](https://aihub.org/2022/07/21/congratulations-to-the-icml2022-outstanding-paper-award-winners/)
- [ICML 2022 Awards](https://icml.cc/virtual/2022/awards_detail)
- [ICLR 2022 Outstanding Paper Awards (official blog)](https://blog.iclr.cc/2022/04/20/announcing-the-iclr-2022-outstanding-paper-award-recipients/)
- [ICLR 2022 Press Release (PDF with statistics)](https://iclr.cc/media/Press/ICLR_2022_Press_Release.pdf)
- [CVPR 2022 Paper Awards](https://cvpr2022.thecvf.com/cvpr-2022-paper-awards)
- [ECCV 2022 Awards (official PDF)](https://eccv2022.ecva.net/files/2022/10/ECCV22-Awards.pdf)
- [ACL 2022 Best Paper Awards](https://2022.aclweb.org/best-paper-awards.html)
- [EMNLP 2022 Best Long Paper—Cornell Bowers CIS](https://bowers.cornell.edu/news-stories/cornell-natural-language-processing-scholars-win-best-paper-top-conference)
- [NAACL 2022 Best Paper Awards (official blog)](https://2022.naacl.org/blog/best-papers/)
- [AAAI 2022 Awards](https://aaai-2022.virtualchair.net/awards)
- [IJCAI-ECAI 2022 Distinguished Papers—AIhub](https://aihub.org/2022/07/28/congratulations-to-the-authors-of-the-ijcai2022-distinguished-papers/)
- [Wei et al. (2022), "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (NeurIPS 2022)](https://arxiv.org/abs/2201.11903)
- [Ouyang et al. (2022), "Training Language Models to Follow Instructions with Human Feedback" (InstructGPT, NeurIPS 2022)](https://arxiv.org/abs/2203.02155)
- [Hoffmann et al. (2022), "Training Compute-Optimal Large Language Models" (Chinchilla, NeurIPS 2022)](https://arxiv.org/abs/2203.15556)
- [Gu et al. (2022), "Efficiently Modeling Long Sequences with Structured State Spaces" (S4, ICLR 2022)](https://arxiv.org/abs/2111.00396)
- [Yi Tay (2023), "2022 in Review: Top Language AI Research Papers"](https://www.yitay.net/blog/2022-best-nlp-papers)
