---
title: "2021 AI Conference Guide: Machine Learning"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2021", machine-learning, diffusion-model, self-supervised-learning, reinforcement-learning]
lang: en
tldr: "2021 was the year diffusion models surpassed GANs, self-supervised learning made theoretical breakthroughs, and reinforcement learning confronted weaknesses in its evaluation methodology. NeurIPS received a then-record 9,122 submissions, ICLR’s Score-Based Generative Modeling paper became a theoretical foundation for the diffusion ecosystem, and ICML delivered substantial work on optimization theory and the dynamics of self-supervised learning."
description: "A guide to the award-winning and influential papers and defining trends from NeurIPS, ICML, ICLR, AAAI, and IJCAI in 2021. It covers the rise of diffusion models, the theorization of self-supervised learning, methodological scrutiny of RL evaluation, and architectural experiments such as MLP-Mixer and Decision Transformer, with a retrospective on which papers changed subsequent research."
draft: false
series:
  name: "AI 頂會導讀"
  order: 6
glossary:
  - term: "diffusion model"
    definition: "A class of generative models that gradually adds noise to training data in a forward process, then learns a denoising network that reverses noise back into data. In 2021, diffusion models surpassed GANs in image-generation quality."
    context: "Diffusion Models Beat GANs at NeurIPS 2021 and Score-Based Generative Modeling through SDEs at ICLR 2021 are two foundational papers of the diffusion ecosystem."
  - term: "self-supervised learning"
    definition: "Learning representations without human labels by designing pretraining tasks from the structure of the data itself, such as masked prediction or contrastive learning. In 2021, the research emphasis shifted from whether it worked to why it worked."
    context: "The DirectPred paper at ICML 2021 was the first to use nonlinear learning dynamics to explain why non-contrastive SSL methods such as BYOL and SimSiam do not collapse."
  - term: "GAN (generative adversarial network)"
    definition: "A generative model trained through competition between a generator and discriminator. GANs dominated image generation after their introduction in 2014, until diffusion models surpassed them on FID in 2021."
    context: "The title Diffusion Models Beat GANs was itself a declaration of a change in eras."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2021-ml)

2021 was a turning point for machine learning conferences. Submission volume had not yet reached the explosive levels of 2024–2025, but it was rising rapidly. More importantly, several directions that would define the field—diffusion models, the theory of self-supervised learning, and evaluation methodology in reinforcement learning—produced pivotal papers at that year’s top conferences. This article centers on NeurIPS, ICML, and ICLR, with highlights from AAAI and IJCAI. It reviews award-winning and influential work from 2021 and, with hindsight, asks which papers truly changed the direction of subsequent research.

## NeurIPS 2021

NeurIPS received 9,122 submissions and accepted 2,334 papers, an acceptance rate of 25.6%. It was the conference’s largest submission pool at the time, although the record fell in 2022. The largest industry contributors were Google with 177 papers, Microsoft with 116, and DeepMind with 81; MIT with 142, Stanford with 139, and CMU with 117 led academia.

### Outstanding Paper Awards

NeurIPS 2021 selected six Outstanding Papers. NeurIPS had already established the convention of using “Outstanding Paper” rather than “Best Paper”:

1. **A Universal Law of Robustness via Isoperimetry** — Sébastien Bubeck and Mark Sellke (Microsoft Research / Stanford). The paper proved a universal law: making interpolation sufficiently smooth, or robust, requires *d* times as many parameters as interpolation alone, where *d* is the data dimension. This offered a theoretical explanation for why deep learning in practice consistently requires substantial over-parameterization.

2. **Deep Reinforcement Learning at the Edge of the Statistical Precipice** — Rishabh Agarwal, Max Schwarzer, Pablo Samuel Castro, Aaron Courville, and Marc Bellemare (Google Brain / Mila). The authors showed that deep RL papers commonly ran only a few random seeds and then compared means or medians, a practice with little statistical support. They introduced the `rliable` toolkit and advocated interval estimates and performance profiles. Its effect on the RL community exceeded that of any single new algorithm because it changed how every algorithm was evaluated.

3. **On the Expressivity of Markov Reward** — David Abel, Will Dabney, Anna Harutyunyan, Mark Ho, Michael Littman, Doina Precup, and Satinder Singh (DeepMind / Brown / Princeton). The paper explored the expressive limits of Markov reward functions and proved that some reasonable definitions of a task cannot be captured by any Markov reward. It was a rare axiomatic theoretical contribution to reward design.

4. **MAUVE: Measuring the Gap Between Neural Text and Human Text using Divergence Frontiers** — Krishna Pillutla, Swabha Swayamdiha, Rowan Zellers, John Thickstun, Sean Welleck, Yejin Choi, and Zaid Harchaoui (University of Washington / AI2). MAUVE used divergence frontiers to compare the distributions of generated and human text, reflecting open-ended generation quality more effectively than existing metrics such as BLEU and perplexity.

5. **Moser Flow: Divergence-based Generative Modeling on Manifolds** — Noam Rozen, Aditya Grover, Maximilian Nickel, and Yaron Lipman (Weizmann / Meta). This new approach to continuous normalizing flows on manifolds avoided an ODE solver and substantially improved training efficiency. Lipman’s later Flow Matching work can be viewed as an extension of this research line.

6. **Continuized Accelerations of Deterministic and Stochastic Gradient Descents, and of Gossip Algorithms** — Mathieu Even, Raphaël Berthier, Francis Bach et al. (INRIA / ETH Zürich). The work rederived Nesterov acceleration in a continuous-time framework, producing a cleaner convergence analysis and the first rigorously accelerated asynchronous gossip algorithm.

### Datasets & Benchmarks Track Best Papers

2021 was the first year NeurIPS offered a Datasets & Benchmarks Track:

- **MAUVE**, which also received an Outstanding Paper award, as described above.
- **Benchmarking Multimodal AutoML for Tabular Data with Text Fields** — Xingjian Shi et al. (Amazon).

### Test of Time Award

The award went to the NeurIPS 2010 paper **Online Learning for Latent Dirichlet Allocation** by Matthew Hoffman, David Blei, and Francis Bach. It pioneered stochastic variational inference, made LDA practical on large text corpora, and gave rise to an entire research direction in stochastic variational inference.

### Papers That Were Not Award Winners but Proved Highly Influential

Several non-award papers at NeurIPS 2021 ultimately had more influence than most of the winners:

- **Diffusion Models Beat GANs on Image Synthesis** — Prafulla Dhariwal and Alexander Nichol (OpenAI). The title states the result: classifier guidance allowed a diffusion model to beat BigGAN on ImageNet FID. The paper has long ranked first for 2021 in Paper Digest’s list of the most influential NeurIPS papers. It did not invent diffusion models—that distinction belongs to DDPM in 2020—but it showed that they could replace GANs in practical image quality after GANs had dominated image generation for seven years.

- **SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers** — Enze Xie et al. (HKU / NVIDIA). A Transformer encoder and lightweight MLP decoder established a new baseline on ADE20K and became a frequent reference for later vision Transformer work.

- **MLP-Mixer: An all-MLP Architecture for Vision** — Ilya Tolstikhin et al. (Google Brain). MLP-Mixer deliberately removed convolution and attention, using only token-mixing and channel-mixing MLPs to reach competitive ImageNet accuracy. Its importance was experimental rather than a new state of the art: it showed that attention was not the only viable path and prompted the community to reconsider the necessity of inductive bias.

- **Decision Transformer: Reinforcement Learning via Sequence Modeling** — Lili Chen et al. (UC Berkeley). The paper reframed RL as sequence modeling. A Transformer consumed sequences of returns, states, and actions, then generated actions conditioned on a desired return. Its performance was not the strongest, but its framing of “RL as sequence modeling” inspired a research line combining offline RL and foundation models.

- **NeuS: Learning Neural Implicit Surfaces by Volume Rendering for Multi-view Reconstruction** — Peng Wang et al. (HKU / Zhejiang University). NeuS used a signed distance function with volume rendering for multi-view 3D reconstruction, becoming an important step toward neural implicit surfaces after NeRF.

## ICML 2021

ICML received 5,513 submissions and accepted 1,184 papers, an acceptance rate of 21.5%. Its submission count was about 60% of NeurIPS’s, but its acceptance rate was stricter. Google remained the largest contributor with more than 100 papers, while Stanford, UC Berkeley, and MIT led academia.

### Outstanding Paper Award

- **Unbiased Gradient Estimation in Unrolled Computation Graphs with Persistent Evolution Strategies** — Paul Vicol, Luke Metz, and Jascha Sohl-Dickstein (Google Brain / University of Toronto). The paper addressed gradient estimation in unrolled computation graphs, such as training learned optimizers or tuning hyperparameters. Persistent Evolution Strategies divided the graph into truncated unrolls, applied an ES update after each one, and removed truncation bias with an accumulated correction term. It combined low bias, low memory use, and frequent updates.

### Outstanding Paper Honorable Mentions

- **Oops I Took A Gradient: Scalable Sampling for Discrete Distributions** — Will Grathwohl, Kevin Swersky, Milad Hashemi, David Duvenaud, and Chris Maddison (Google Brain / University of Toronto). The work used likelihood gradients for discrete distributions to propose Metropolis–Hastings updates, substantially outperforming general-purpose samplers in difficult settings including Ising models, RBMs, and high-dimensional discrete images.

- **Understanding Self-Supervised Learning Dynamics without Contrastive Pairs** — Yuandong Tian, Xinlei Chen, and Surya Ganguli (Meta AI / Stanford). This was the first nonlinear learning-dynamics analysis of why non-contrastive self-supervised methods such as BYOL and SimSiam do not collapse into trivial representations. It introduced DirectPred, which set a linear predictor directly from input statistics instead of training it with gradients. Its theoretical predictions matched ImageNet ablations.

- **Optimal Complexity in Decentralized Training** — Yucheng Lu and Christopher De Sa (Cornell). The paper established a tight lower bound for decentralized stochastic non-convex optimization, exposed the theoretical gap in existing algorithms such as D-PSGD, and introduced DeTAG to attain the bound.

- **Solving High-Dimensional PDEs with Latent Spectral Models** — Lorenz Richter, Leon Sallandt, and Nikolas Nüsken (TU Berlin / Bielefeld). The method combined the tensor-train format with backward SDEs, matching neural-network accuracy on high-dimensional PDEs with greater computational efficiency.

### Notable Papers Beyond the Award List

- **Learning Transferable Visual Models From Natural Language Supervision (CLIP)** — Alec Radford et al. (OpenAI). Although its arXiv preprint appeared in January 2021, CLIP was formally included in the ICML 2021 proceedings. Contrastive pretraining on 400 million image–text pairs learned visual representations that transferred zero-shot. CLIP became a core component of later text-to-image systems including DALL-E 2 and Stable Diffusion. If one paper had to represent 2021, CLIP would be among the strongest candidates.

- **Improved Denoising Diffusion Probabilistic Models** — Alexander Quinn Nichol and Prafulla Dhariwal (OpenAI). A few simple changes to DDPM, including a learned variance schedule and cosine schedule, made diffusion models competitive on log-likelihood as well as sample quality.

- **Zero-Shot Text-to-Image Generation (DALL-E)** — Aditya Ramesh et al. (OpenAI). DALL-E used a Transformer to autoregressively model text and image tokens. Its image quality is dated today, but it demonstrated that treating image generation as token prediction was viable and inspired subsequent autoregressive image-generation work.

- **Training Data-Efficient Image Transformers & Distillation Through Attention (DeiT)** — Hugo Touvron et al. (Facebook AI Research / Sorbonne). DeiT showed that Vision Transformers did not require Google-scale data such as JFT-300M. ImageNet-1K and knowledge distillation were enough. It turned ViT from something “only Google could run” into something any lab with eight GPUs could run.

- **EfficientNetV2: Smaller Models and Faster Training** — Mingxing Tan and Quoc Le (Google). EfficientNetV2 combined progressive resizing and NAS on top of EfficientNet, training 5–11 times faster. It was among the last major waves of improvement from the ConvNet camp as ViTs rose.

## ICLR 2021

ICLR received 3,014 submissions according to Paper Copilot and accepted 860 papers, an acceptance rate of 28.5%. It had the highest acceptance rate among the three major ML conferences, reflecting its smaller submission pool at the time. Eight papers received Outstanding Paper Awards.

### Outstanding Paper Awards

1. **Score-Based Generative Modeling through Stochastic Differential Equations** — Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, and Ben Poole (Stanford / Google Brain). The paper established a unified SDE framework for score-based generative models. It placed apparently different methods such as SMLD and DDPM in the same continuous-time diffusion process and provided exact likelihood computation. It became a foundation of diffusion-model theory; nearly all later theoretical analyses of diffusion models began with this SDE framework.

2. **Learning Mesh-Based Simulation with Graph Networks** — Tobias Pfaff, Meire Fortunato, Alvaro Sanchez-Gonzalez, and Peter Battaglia (DeepMind). Graph neural networks learned mesh-based physical simulations of fluids and cloth, outperforming traditional GNN simulators in accuracy and generalization.

3. **EigenGame: PCA as a Nash Equilibrium** — Ian Gemp, Brian McWilliams, Claire Vernade, and Thore Graepel (DeepMind). EigenGame reformulated PCA as a game in which each eigenvector was a player and the Nash equilibrium corresponded to the PCA solution. It enabled distributed PCA on datasets as large as 195 TB.

4. **Beyond Fully-Connected Layers with Quaternions: Parameterization of Hypercomplex Multiplications with 1/n Parameters** — Aston Zhang et al. (AWS / NTU / ETH Zürich / Mila). The paper generalized quaternion fully connected layers to arbitrary *n*-dimensional hypercomplex numbers, achieving comparable performance with 1/*n* as many parameters.

5. **Complex Query Answering with Neural Link Predictors** — Erik Arakelyan, Daniel Daza, Pasquale Minervini, and Michael Cochez (UCL / VU Amsterdam). Neural link predictors answered complex knowledge-graph queries involving existential quantification, conjunction, and disjunction without embedding the entire graph into vector space.

6. **Rethinking Architecture Selection in Differentiable NAS** — Ruochen Wang et al. (UCLA). The paper identified a fundamental flaw in architecture selection for differentiable NAS methods such as DARTS: weight sharing in the supernet made architecture rankings inconsistent with rankings after independent training. It also proposed a correction.

7. **Neural Synthesis of Binaural Speech from Mono Audio** — Alexander Richard et al. (Facebook Reality Labs). A neural network synthesized binaural audio from mono speech and head-related transfer functions for spatial audio in VR and AR.

8. **Optimal Rates for Averaged Stochastic Gradient Descent under Neural Tangent Kernel Regime** — Atsushi Nitanda and Taiji Suzuki (University of Tokyo / RIKEN). The work established the optimal convergence rate for averaged SGD in the NTK regime, filling a theoretical gap.

### Notable Non-Award Paper

- **How Neural Networks Extrapolate: From Feedforward to Graph Neural Networks** — Reportedly the highest-rated paper at ICLR 2021. It systematically studied extrapolation across architectures and found that ReLU networks tend to extrapolate linearly outside the training distribution.

## AAAI 2021 (Additional Highlights)

AAAI received 7,911 submissions and accepted 1,692 papers, an acceptance rate of 21.4%. Its submission count trailed only NeurIPS, while its acceptance rate was lower.

### Outstanding Paper Awards

- **Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting** — Haoyi Zhou et al. (Beihang University / UC Berkeley / Rutgers). Informer targeted long-sequence time-series forecasting with an efficient Transformer architecture. ProbSparse self-attention reduced complexity from O(n²) to O(n log n), and the model substantially outperformed baselines on several long-sequence forecasting benchmarks. It became the most cited AAAI 2021 award paper and an early representative of time-series Transformers.

- **Exploration-Exploitation in Multi-Agent Learning: Catastrophe Theory Meets Game Theory** — Stefanos Leonardos and Georgios Piliouras (SUTD). The paper applied catastrophe theory to exploration–exploitation dynamics in multi-agent learning and proved that catastrophic transitions exist.

### Distinguished Papers

- **On the Tractability of SHAP Explanations** — Guy Van den Broeck et al. (UCLA). An analysis of the computational complexity of SHAP explanations.
- **Mitigating Political Bias in Language Models through Reinforced Calibration** — Ruibo Liu et al. (Dartmouth). The paper also received the Outstanding Paper award in the AI for Social Impact special track.
- **Self-Attention Attribution: Interpreting Information Interactions Inside Transformer** — Yaru Hao, Li Dong, Furu Wei, and Ke Xu (Microsoft Research Asia / Beihang University).

## IJCAI 2021 (Additional Highlights)

IJCAI received 4,204 submissions and accepted 587 papers, an acceptance rate of 14.0%, the lowest among major AI conferences.

### Distinguished Paper Awards

IJCAI-21 selected only three Distinguished Papers from its 587 accepted papers:

- **Keep Your Distance: Land Division With Separation** — Edith Elkind (Oxford), Erel Segal-Halevi (Ariel University), and Warut Suksompong (NUS). A new variant of fair division requiring a minimum separation between allocated plots of land.
- **On the Relation Between Approximation Fixpoint Theory and Justification Theory** — A VUB team connected two theoretical frameworks in knowledge representation.

### Other Major Awards

- **Research Excellence Award:** Richard Sutton (Alberta), honoring his lifetime contributions to the foundations of reinforcement learning.
- **Computers and Thought Award** for an outstanding young scientist: Fei Fang (CMU), recognizing her work on security games and AI for social good.

## Overall Observations from 2021

### Three Themes That Defined the Year

**1. Diffusion models broke through from theory to evidence**

The DDPM paper in 2020 showed that diffusion models could generate high-quality images, but they had not yet beaten GANs. Three developments together changed the picture in 2021. ICLR’s Score-Based Generative Modeling through SDEs established a unified theoretical framework; ICML’s Improved DDPM addressed log-likelihood; and NeurIPS’s Diffusion Models Beat GANs ended GAN dominance on FID. By the end of the year, the generative-model community’s center of gravity had shifted from GANs to diffusion. DALL-E 2 and Stable Diffusion made that shift irreversible in 2022.

**2. Self-supervised learning became theoretical**

BYOL and SimSiam in 2020 had shown that self-supervised learning could work without negative pairs, but nobody could clearly explain why the models did not collapse. ICML’s DirectPred paper provided the first explanation based on nonlinear learning dynamics in 2021. At the same time, ICLR’s EigenGame used game theory to reinterpret representation learning from another direction. Self-supervised learning began moving from “empirically works but theoretically mysterious” toward a theoretical foundation.

**3. RL evaluation experienced a methodological awakening**

NeurIPS’s RLiable paper, Deep RL at the Edge of the Statistical Precipice, was one of the year’s least conventional yet most influential top-conference papers. It proposed no new algorithm. Instead, it argued that the community’s previous methods for comparing algorithms were statistically inadequate. Together with On the Expressivity of Markov Reward challenging the expressive power of reward functions from the theoretical side, 2021 became the year the RL community began seriously examining its methodology.

### Key Changes from 2020

- **Transformers spread from NLP throughout computer vision:** ViT, released on arXiv in 2020 and published at ICLR 2021, opened the door. DeiT at ICML 2021 made the architecture accessible, SegFormer at NeurIPS 2021 extended it to semantic segmentation, and MLP-Mixer questioned whether attention was necessary at all. Computer vision conferences were dominated by ConvNets in 2020; by 2021, ViTs defined the landscape.

- **Submission volume began accelerating:** NeurIPS declined slightly from 9,467 submissions in 2020 to 9,122 in 2021, yet the broader trend was clear. Submissions were expanding rapidly and the review system was coming under strain, pressure that developed into a full crisis in 2024–2025.

- **The culture of “open-source everything” strengthened:** CLIP and DALL-E code and model weights—or community reproductions—became available soon after publication, accelerating subsequent research. That contrasted with GPT-3 in 2020, which exposed an API but not the weights.

### In Hindsight: Which 2021 Papers Had the Most Lasting Impact?

If only five papers could be selected from the three major ML conferences in 2021 as the ones that proved most important, the list would likely be:

1. **Score-Based Generative Modeling through SDEs** (ICLR)—the theoretical foundation of diffusion models.
2. **CLIP** (ICML)—the paradigm for multimodal pretraining.
3. **Diffusion Models Beat GANs on Image Synthesis** (NeurIPS)—the final push in the generative-model paradigm shift.
4. **Deep RL at the Edge of the Statistical Precipice** (NeurIPS)—changed evaluation standards across the RL community.
5. **Decision Transformer** (NeurIPS)—its “RL as sequence modeling” framing inspired the research line of foundation models for RL.

This list overlaps only partly with the awards announced at the time. Awards reflect a committee’s judgment at publication; influence is an outcome observed later. It is natural for the two to differ.

---

## References

- [NeurIPS 2021 Award Recipients (official announcement)](https://blog.neurips.cc/2021/11/30/announcing-the-neurips-2021-award-recipients)
- [NeurIPS 2021 Awards](https://nips.cc/virtual/2021/awards_detail)
- [NeurIPS 2021 Fact Sheet (official PDF)](https://neurips.cc/media/Press/NeurIPS_2021-Fact_Sheet.pdf)
- [ICML 2021 Awards](https://icml.cc/virtual/2021/awards_detail)
- [ICLR 2021 Outstanding Paper Awards (official announcement)](https://iclr-conf.medium.com/announcing-iclr-2021-outstanding-paper-awards-9ae0514734ab)
- [AAAI-21 Outstanding and Distinguished Papers (official page)](https://aaai.org/conference/aaai/aaai-21/aaai-outstanding-and-distinguished-papers)
- [IJCAI-21 Awards](https://ijcai-21.org/awards/index.html)
- [IJCAI 2021 Best Paper Award Winners—AIhub](https://aihub.org/2021/08/24/congratulations-to-the-ijcai2021-best-paper-award-winners)
- [NeurIPS 2021—6 Outstanding Papers, 2 D&B Best Papers, Test of Time Award—Synced](https://syncedreview.com/2021/12/01/deepmind-podracer-tpu-based-rl-frameworks-deliver-exceptional-performance-at-low-cost-156)
- [AAAI 2021 Best Papers Announced—Synced](https://syncedreview.com/2021/02/04/aaai-2021-best-papers-announced)
- [Most Influential NIPS Papers—Paper Digest](https://www.paperdigest.org/2024/09/most-influential-nips-papers-2024-09)
- [Most Influential ICML Papers—Paper Digest](https://www.paperdigest.org/2023/09/most-influential-icml-papers-2023-09)
- [ML and NLP Research Highlights of 2021—Sebastian Ruder](https://www.ruder.io/ml-highlights-2021)
- [An Overview of ICML 2021's Publications—VinAI](https://www.vinai.io/an-overview-of-icml-2021s-publications)
- [SarahRastegar/Best-Papers-Top-Venues—GitHub compilation by year](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Edith Elkind distinguished paper at IJCAI-21—Oxford CS News](https://www.cs.ox.ac.uk/news/1963-full.html)
