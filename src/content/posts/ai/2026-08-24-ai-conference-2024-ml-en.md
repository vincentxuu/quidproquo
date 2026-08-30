---
title: "2024 AI Conference Review: Machine Learning"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2024", machine-learning, inference-scaling, diffusion-model]
lang: en
tldr: "ML conference submissions exploded in 2024: NeurIPS received a record 15,671 papers, while ICML and ICLR passed 9,000 and 7,000. Research shifted from training ever-larger models toward spending inference compute more intelligently, making test-time compute scaling the year's defining new direction. VAR beat diffusion with next-scale image prediction, Rectified Flow became the theoretical foundation for Stable Diffusion 3, and ICLR gave its inaugural Test of Time Award to the original VAE paper."
description: "A guide to award-winning and influential work from NeurIPS, ICML, ICLR, AAAI, and IJCAI 2024. It covers test-time compute scaling, Rectified Flow, the rise of AI-agent frameworks, mainstream Mixture-of-Experts systems, and the strain that record submissions placed on peer review."
draft: false
series:
  name: "AI 頂會導讀"
  order: 18
glossary:
  - term: "test-time compute"
    definition: "Using additional computation during inference to improve model performance—for example, allowing more reasoning steps or generating and selecting among several candidate answers. It is a different scaling axis from increasing parameter count during training."
    context: "Several 2024 papers showed that additional inference compute could outperform an equivalent investment in pretraining scale."
  - term: "rectified flow"
    definition: "A generative-model training framework that connects data and noise along straight paths, allowing high-quality generation with fewer sampling steps. It underpins Stable Diffusion 3."
    context: "One ICML 2024 Best Paper studied how rectified flow scales."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2024-ml)

> Part of the [AI Conference Review series](/tags/ai-conference). See [What Is a Top AI Conference?](/posts/ai/2026-08-23-what-is-ai-top-conference) (zh-TW only) for the overview.

2024 was the most crowded year in the history of the major ML conferences. NeurIPS submissions passed 15,000 for the first time, ICML approached 10,000, and ICLR reached a new high above 7,400. The more consequential change was intellectual: attention moved from training larger models to spending compute more intelligently at inference time. Test-time compute scaling became the year's defining new topic.

## NeurIPS 2024

15,671 submissions / 4,037 accepted (25.8%). Submissions grew 27% from 12,343 in 2023 while acceptance stayed nearly flat, moving the entire additional burden onto peer review.

### Best Paper Awards

NeurIPS split its awards between the Main Track and Datasets & Benchmarks Track. The Main Track named two Best Papers and two runners-up.

**Best Paper (Main Track)**

1. **Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction** — Keyu Tian, Yi Jiang, Zehuan Yuan, Bingyue Peng, Liwei Wang (Peking University / ByteDance)

   Visual AutoRegressive modeling (VAR) replaces next-token, pixel-by-pixel image generation with next-scale prediction across resolutions. On ImageNet it beat diffusion-model FID while running 20 times faster. Its central insight was that weak autoregressive image generation came from token ordering, not autoregression itself.

2. **Stochastic Taylor Derivative Estimator: Efficient Amortization for Arbitrary Differential Operators** — Zekun Shi, Zheyuan Hu, Min Lin, Kenji Kawaguchi (NUS / Sea AI Lab)

   STDE solved million-dimensional partial differential equations on one GPU in minutes, where previous methods required clusters for days. Stochastic Taylor expansion amortized gradient computation, reducing the cost of differential operators from O(n) to O(1).

**Best Paper Runner-Up (Main Track)**

3. **Not All Tokens Are What You Need for Pretraining** — Zhenghao Lin et al. (Tsinghua / Microsoft Research)

   Rho-1 trains only on "valuable" tokens selected by a reference model's perplexity. It improved few-shot mathematical reasoning by 30% while substantially reducing training compute.

4. **Guiding a Diffusion Model with a Bad Version of Itself** — Tero Karras et al. (NVIDIA)

   A weaker version of the same model—undertrained or architecturally smaller—can supply guidance instead of an extra classifier. It matched conventional methods, improved quality without sacrificing diversity, and set a new ImageNet record.

**Best Paper (Datasets & Benchmarks Track)**

5. **The PRISM Alignment Dataset: What Participatory, Representative and Individualised Human Feedback Reveals About the Subjective and Multicultural Alignment of Large Language Models** — Hannah Rose Kirk et al. (Oxford / Cohere)

   PRISM collected alignment feedback from 1,500 participants in 75 countries, showing how existing RLHF methods overlook cultural differences and individual preferences. It was the first genuinely large-scale, cross-cultural alignment dataset.

### Test of Time Award

Two papers from 2014 received the award:

- **Generative Adversarial Nets** by Ian Goodfellow et al., cited more than 85,000 times, launched the GAN era.
- **Sequence to Sequence Learning with Neural Networks** by Ilya Sutskever, Oriol Vinyals, and Quoc V. Le used LSTMs for sequence-to-sequence translation and laid groundwork for modern NMT and the later Transformer.

### Influential Papers Outside the Awards

- **Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters** (Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar; Google DeepMind) directly showed that spending more compute at inference—letting the model reason for longer—could beat an equivalent increase in pretraining scale. It helped define the year's turn in ML research.
- **Large Language Models Must Be Taught to Know What They Don't Know** improved uncertainty calibration with only 1,000 fine-tuning examples, helping models distinguish what they know from what they do not.
- **The Mamba in the Llama: Distilling and Accelerating Hybrid Models** distilled large Transformers into Transformer-SSM hybrids, substantially accelerating inference while preserving conversational ability. State-space models such as Mamba remained the strongest Transformer alternative in 2024.
- **You Don't Need Domain-Specific Data Augmentations When Scaling Self-Supervised Learning** found that, at sufficient scale, simple cropping could reach the state of the art without elaborate domain-specific augmentation.
- **Why Do We Need Weight Decay in Modern Deep Learning?** developed a theory of weight decay and found fundamentally different mechanisms in vision and language models.

## ICML 2024

9,473 submissions / 2,609 accepted (27.5%). Held in Vienna from July 21 to 27, it named ten Best Papers.

### Best Paper Awards

1. **Scaling Rectified Flow Transformers for High-Resolution Image Synthesis** — Patrick Esser et al. (Stability AI). The theoretical basis of Stable Diffusion 3 improved rectified-flow noise sampling toward perceptually relevant scales. A 450M-to-8B scaling study showed that rectified flow with an MMDiT backbone outperformed conventional diffusion formulations for high-resolution text-to-image generation, with no sign that the scaling curve had saturated.

2. **Debating with More Persuasive LLMs Leads to More Truthful Answers** — Akbir Khan et al. (Anthropic / UCL / NYU). LLM debate improved truthfulness: even with more persuasive debaters, human judges reached more accurate decisions after debate. For scalable oversight, this offered a way to assess AI answers without requiring the human judge to know the answer independently.

3. **Position: Considerations for Differentially Private Learning with Large-Scale Public Pretraining** — Florian Tramèr, Gautam Kamath, Nicholas Carlini (ETH Zürich / Waterloo / Google DeepMind). This position paper challenged DP-SGD after public-data pretraining: if pretraining data already contain sensitive information that a large model memorizes, what exactly does private fine-tuning protect?

4. **Genie: Generative Interactive Environments** — Jake Bruce et al. (Google DeepMind). Genie learned interactive 2D game environments from web video. It did more than generate video: it accepted actions and produced corresponding next frames, moving world models from observation to interaction.

5. **Position: Measure Dataset Diversity, Don't Just Claim It** — Dora Zhao et al. (Sony AI). The paper argued that many datasets claim diversity without quantitative support and proposed a measurement framework.

6. **Stealing Part of a Production Language Model** — Nicholas Carlini et al. (Google DeepMind / ETH Zürich). With only a few dollars of API calls, the authors reverse-engineered internal details of production language models, including embedding dimension and exact final-layer weights—a direct challenge to model-as-a-service security assumptions.

7. **VideoPoet: A Large Language Model for Zero-Shot Video Generation** — Dan Kondratyuk et al. (Google Research). One unified LLM architecture handled text-to-video, image-to-video, and video editing. Contemporary with Sora, it pursued LLM tokenization rather than diffusion.

8. **Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution** — Aaron Lou, Chenlin Meng, Stefano Ermon (Stanford). It extended diffusion from continuous spaces to discrete data such as text by estimating ratios of the data distribution rather than the distribution itself.

9. **Probabilistic Inference in Language Models via Twisted Sequential Monte Carlo** — Stephen Zhao et al. Twisted SMC enabled precise probabilistic inference and sampling from constrained language-model distributions, such as text satisfying both stylistic and factual constraints.

10. **Information Complexity of Stochastic Convex Optimization: Applications to Generalization, Memorization, and Tracing** — Idan Attias et al. An information-theoretic account unified generalization, memorization, and data tracing under one information-complexity measure.

### Test of Time Award

**DeCAF: A Deep Convolutional Activation Feature for Generic Visual Recognition** (Jeff Donahue et al.; ICML 2014) showed, before CNNs were widely trusted, that freezing a pretrained AlexNet and training only a final linear layer could greatly improve many vision tasks. It became the prototype for transfer learning and feature extraction.

## ICLR 2024

7,401 submissions / 2,261 accepted (30.5%). This was the first year ICLR presented a Test of Time Award.

### Outstanding Paper Awards (5)

1. **Generalization in Diffusion Models Arises from Geometry-Adaptive Harmonic Representations** — Zahra Kadkhodaie et al. (NYU / Flatiron) gave the most rigorous account yet of why diffusion models generalize: they learn geometry-adaptive harmonic representations of the data manifold rather than merely memorizing training examples.
2. **Learning Interactive Real-World Simulators** — Sherry Yang et al. (Google DeepMind / MIT / Berkeley) introduced UniSim, which generated interactive real-world simulations from text and action instructions. It went beyond Genie by modeling physical scenes.
3. **Never Train from Scratch: Fair Comparison of Long-Sequence Models Requires Data-Driven Priors** — Ido Amos, Jonathan Berant, Ankit Gupta challenged comparisons based on training every long-sequence model from scratch; transfer from pretrained models could reverse their conclusions.
4. **Protein Discovery with Discrete Walk-Jump Sampling** — Nathan C. Frey et al. (Prescient Design / NYU) used discrete walk-jump sampling for protein design and outperformed prior antibody-design methods.
5. **Vision Transformers Need Registers** — Timothée Darcet et al. (Meta FAIR / Inria) identified artifact tokens that ViTs use as scratch registers rather than image content. Explicit register tokens removed the artifact and improved downstream performance—a simple, elegant, and influential result.

### Honorable Mentions (selected from 11)

- **Model Tells You What to Discard: Adaptive KV Cache Compression for LLMs** introduced FastGen, reducing inference memory by adapting compression to attention patterns without losing quality.
- **Proving Test Set Contamination in Black-Box Language Models** provided a rigorous statistical test for whether an API-only model had trained on a given test set.
- **Robust Agents Learn Causal World Models** proved that an agent robust out of distribution must learn a causal world model rather than statistical correlations alone.
- **Amortizing Intractable Inference in Large Language Models** used GFlowNets for precise LLM probabilistic inference, paralleling ICML's twisted-SMC paper.
- **Flow Matching on General Geometries** extended flow matching beyond Euclidean space, supporting generative models for proteins, molecules, and other non-flat data.

### Test of Time Award (inaugural)

**Auto-Encoding Variational Bayes** by Diederik P. Kingma and Max Welling introduced the Variational Autoencoder and the reparameterization trick, joining deep learning with scalable variational inference. Program Chairs reviewed both the 2013 and 2014 ICLR programs to select this paper for the first award.

## AAAI 2024

9,862 submissions / 2,342 accepted (23.8%).

### Outstanding Paper Awards (3)

1. **Reliable Conflictive Multi-view Learning** — Cai Xu et al. proposed reliable fusion when views in multi-view learning conflict.
2. **GxVAEs: Two Joint VAEs Generate Hit Molecules from Gene Expression Profiles** — Chen Li, Yoshihiro Yamanishi used two joint VAEs to generate drug candidates from gene-expression profiles.
3. **Proportional Aggregation of Preferences for Sequential Decision Making** — Nikhil Chandak et al. studied proportional aggregation of stakeholder preferences in sequential decisions, bridging AI and social-choice theory.

### Classic Paper Award

**Maximum Entropy Inverse Reinforcement Learning** by Brian Ziebart et al. (AAAI 2008) applied the maximum-entropy principle to inverse RL and became foundational to IRL and imitation learning.

## IJCAI 2024

5,651 submissions / 791 accepted (14.0%), traditionally the lowest rate among the major AI conferences.

### Distinguished Paper Awards (3)

1. **Online Combinatorial Optimization with Group Fairness Constraints** — Negin Golrezaei et al. introduced fairness constraints into online combinatorial optimization.
2. **Enhancing Controlled Query Evaluation Through Epistemic Policies** — Gianluca Cima et al. used epistemic policies to strengthen confidentiality in controlled query evaluation.
3. **Online Learning of Capacity-Based Preference Models** — Margot Herin et al. learned preference models based on non-additive set functions.

All three leaned toward theory and formal methods rather than the year's dominant LLM and generative-model topics, illustrating IJCAI's different remit as a broad AI conference.

## Overall Observations for 2024

### Submission Volume Exploded

All five conferences set records. NeurIPS grew 27% in one year, from 12,343 to 15,671 submissions; ICML grew 45%, from 6,538 to 9,473. The causes were straightforward: the post-ChatGPT boom expanded the global AI research population and drew researchers from outside ML into these venues. Peer review neared a breaking point; NeurIPS 2024 used more than 20,000 reviewers.

### From Pretraining Scale to Inference-Time Scale

The year's clearest shift moved scaling laws from more data and compute for larger training runs toward additional inference compute. Charlie Snell et al. showed that inference-time scaling could beat an equivalent amount of pretraining scaling. The result suggested future gains might come from smarter inference strategies rather than indefinitely larger models. OpenAI's o1 provided product-level evidence at the end of 2024.

### Diffusion and Autoregression Competed on Two Fronts

- Rectified Flow, an ICML Best Paper and the basis of Stable Diffusion 3, showed that flow-based high-resolution generation could replace conventional DDPMs.
- VAR, a NeurIPS Best Paper, beat diffusion on ImageNet with next-scale prediction while running 20 times faster.

Both approaches delivered strong results. Whether one would win, or the two would converge, remained open.

### World Models and Interactive Environments

Genie (ICML) and UniSim (ICLR) both learned interactive worlds from observations. This is harder and more useful than generating video: an agent acting in the real world needs to imagine the consequences of actions, not merely make attractive clips. In 2024, world models moved from an idea to a concrete technical program.

### AI-Agent Frameworks Broke Out

Agent papers were not numerous among Best Papers, but their density rose sharply in posters and workshops. Researchers expanded 2023 foundations such as ReAct and Toolformer into multi-agent architectures, memory systems, and evaluation benchmarks. "Robust Agents Learn Causal World Models" supplied a theoretical anchor: a robust agent necessarily learns a causal model.

### Compared with 2023

| Dimension | 2023 | 2024 |
|---|---|---|
| Hottest topic | LLM alignment / RLHF / instruction tuning | Test-time compute / inference scaling |
| Image generation | Diffusion dominated | Diffusion and AR advanced in parallel |
| Efficiency | LoRA, QLoRA, and fine-tuning efficiency | KV-cache compression and selective-token training |
| Safety/privacy | Mostly alignment | Model stealing, the DP contradiction, dataset diversity |
| Submission scale | NeurIPS ~12K, ICML ~6.5K | NeurIPS ~15.7K, ICML ~9.5K |

### In Hindsight: The Most Enduring 2024 Papers

Looking back from 2026, five papers stand out:

1. **Test-Time Compute Scaling** (NeurIPS) supplied theoretical grounding for reasoning models such as o1 and o3.
2. **Scaling Rectified Flow Transformers** (ICML) became the architecture behind Stable Diffusion 3, Flux, and other mainstream image generators.
3. **VAR** (NeurIPS) reopened autoregressive image generation; GPT-4o's image capability followed that direction.
4. **Vision Transformers Need Registers** (ICLR) was a simple finding that influenced the training of nearly every later ViT.
5. **Robust Agents Learn Causal World Models** (ICLR) pointed toward a theoretical foundation for agent research in 2025–2026.

---

## References

- [NeurIPS Blog — Announcing the NeurIPS 2024 Best Paper Awards](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards/)
- [NeurIPS Blog — Announcing the NeurIPS 2024 Test of Time Paper Awards](https://blog.neurips.cc/2024/11/27/announcing-the-neurips-2024-test-of-time-paper-awards/)
- [NeurIPS 2024 Fact Sheet](https://media.neurips.cc/Conferences/NeurIPS2024/press/NeurIPS2024_Fact_Sheet.pdf)
- [ICML 2024 Best Paper Awards](https://icml.cc/virtual/2024/38324)
- [ICML 2024 Fact Sheet](https://media.icml.cc/Conferences/ICML2024/ICML2024_Fact_Sheet.pdf)
- [ICML 2024 Test of Time Award: DeCAF](https://joltml.com/icml-2024/test-of-time-decaf/)
- [ICLR 2024 Outstanding Paper Awards — ICLR Blog](https://blog.iclr.cc/2024/05/06/iclr-2024-outstanding-paper-awards/)
- [ICLR 2024 Test of Time Award — ICLR Blog](https://blog.iclr.cc/2024/05/07/iclr-2024-test-of-time-award/)
- [ICLR 2024 Press Release](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024_Press_Release.pdf)
- [AIhub — AAAI 2024 outstanding paper winners](https://aihub.org/2024/02/26/congratulations-to-the-aaai2024-outstanding-paper-winners/)
- [AIhub — IJCAI 2024 distinguished paper award winners](https://aihub.org/2024/08/07/congratulations-to-the-ijcai2024-distinguished-paper-award-winners/)
- [Turing Post — 12 Remarkable Research Papers from NeurIPS 2024](https://www.turingpost.com/p/neurips-2024-papers)
- [Amplify Partners — NeurIPS 2024: Main Themes and Takeaways](https://www.amplifypartners.com/blog-posts/neurips-2024-main-themes-and-takeaways)
- [GitHub — Top-Conference-Best-Papers](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Stanford AI News — ICML 2024 Best Paper Award](https://ai.stanford.edu/news/congratulations-to-aaron-lou-chenlin-meng-and-stefano-ermon-for-an-icml-2024-best-paper-award)
- [University of Waterloo — Gautam Kamath and colleagues win ICML 2024 Best Paper](https://uwaterloo.ca/computer-science/news/gautam-kamath-and-international-colleagues-win-best-paper-at-icml-2024)
