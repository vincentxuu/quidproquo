---
title: "2022 AI Conference Guide: Machine Learning"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2022", machine-learning, diffusion-model, scaling-laws, chain-of-thought]
lang: en
tldr: "2022 was the year diffusion models took center stage, Chinchilla scaling laws rewrote large-model training, and Chain-of-Thought turned reasoning into an ability that prompts could elicit. NeurIPS passed 10,000 submissions; three of its 13 Outstanding Papers directly concerned diffusion; and Chinchilla and data pruning both challenged the belief that bigger was always better. On the eve of ChatGPT’s release, every required piece fell into place at that year’s conferences."
description: "A guide to award-winning and influential work from NeurIPS, ICML, ICLR, AAAI, and IJCAI in 2022. It covers Chinchilla scaling laws, FlashAttention, Chain-of-Thought prompting, Imagen, the diffusion design space, and InstructGPT, then asks which papers laid the groundwork for the ChatGPT era."
draft: false
series:
  name: "AI 頂會導讀"
  order: 10
glossary:
  - term: "scaling laws"
    definition: "Empirical rules describing how model performance changes with parameter count, data volume, and compute. The 2022 Chinchilla paper revised Kaplan et al. (2020), showing that data volume should grow proportionally with model size."
    context: "The NeurIPS 2022 Outstanding Paper 'An empirical analysis of compute-optimal large language model training' is the Chinchilla paper."
  - term: "Chain-of-Thought (CoT)"
    definition: "A prompting technique that adds step-by-step reasoning to few-shot examples, encouraging a large language model to expose intermediate steps and greatly improving performance on mathematical, logical, and other reasoning tasks."
    context: "Wei et al.’s CoT paper appeared at NeurIPS 2022 and became the starting point for reasoning research after 2023."
  - term: "FlashAttention"
    definition: "An IO-aware exact-attention algorithm that uses tiling to reduce transfers between GPU high-bandwidth memory (HBM) and on-chip SRAM, greatly accelerating Transformer training without sacrificing precision."
    context: "Tri Dao and colleagues published FlashAttention at NeurIPS 2022. It later became a standard component of nearly every large-model training framework."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2022-ml)

2022 was the eve of ChatGPT. In hindsight, every piece needed for the explosion—revised scaling laws, an RLHF methodology, unlocked reasoning, and efficient attention—fell into place at that year’s leading conferences. NeurIPS exceeded 10,000 submissions for the first time and selected 13 Outstanding Papers, reflecting the extraordinary density of results. This article centers on NeurIPS, ICML, and ICLR, with highlights from AAAI and IJCAI, to review the award-winning and influential work of 2022.

## NeurIPS 2022

NeurIPS received 10,411 submissions and accepted 2,672 papers, an acceptance rate of 25.7%. It selected 13 Outstanding Main Track Papers, two Outstanding Datasets & Benchmarks Papers, and one Test of Time Award.

### Outstanding Paper Awards

The 13 Outstanding Papers spanned diffusion models, which occupied three slots; scaling laws, with two; SGD theory; causal fairness; OOD detection; automatic hyperparameter optimization; multi-distribution learning; and more:

1. **Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding** — Chitwan Saharia, William Chan, Saurabh Saxena et al. (Google Brain). Imagen combined a pretrained large language model, T5-XXL, as its text encoder with cascaded diffusion models and set a new COCO record of FID 7.27. Its central insight—that language-model quality mattered more to image generation than the image model itself—defined the architecture of later text-to-image systems.

2. **Elucidating the Design Space of Diffusion-Based Generative Models** — Tero Karras, Miika Aittala, Timo Aila, and Samuli Laine (NVIDIA). Rather than proposing a new model, the paper separated diffusion’s design space into modules such as the noise schedule, network preconditioning, and sampler, reaching FID 1.79 on CIFAR-10. It organized a messy field into a clean engineering framework and substantially lowered the barrier for newcomers.

3. **Riemannian Score-Based Generative Modelling** — Valentin De Bortoli, Emile Mathieu, Michael Hutchinson, James Thornton, Yee Whye Teh, and Arnaud Doucet (Oxford / DeepMind). This extended score-based generative models from Euclidean space to Riemannian manifolds, enabling diffusion on spheres, rotation groups, and other non-Euclidean geometries. It opened a path for domains such as earth science and protein modeling whose data naturally live on manifolds.

4. **An empirical analysis of compute-optimal large language model training** — Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch et al. (DeepMind). The **Chinchilla paper** may have been the year’s most influential work. After training more than 400 language models, it concluded that **parameter count and training-data volume should grow proportionally under a fixed compute budget**, with an optimum of roughly 20 tokens per parameter. This directly contradicted the GPT-3-era practice of large models with limited data and showed that contemporary models were severely undertrained. Chinchilla used 1.4 trillion tokens to train 70 billion parameters and beat the 280-billion-parameter Gopher on nearly every downstream task. The new consensus became: the model was not too small; it had not seen enough data.

5. **Beyond neural scaling laws: beating power law scaling via data pruning** — Ben Sorscher, Robert Geirhos, Shashank Shekhar, Surya Ganguli, and Ari Morcos (Stanford / Meta). Complementing Chinchilla, this paper showed that a good data-pruning metric could beat power-law scaling and even produce exponential improvements. Its message was that not all data were equally valuable: a carefully selected subset could do better with less.

6. **On-Demand Sampling: Learning Optimally from Multiple Distributions** — Nika Haghtalab, Michael Jordan, and Eric Zhao (UC Berkeley). The paper established optimal sample-complexity bounds for collaborative learning, group DRO, and fair federated learning, improving the best prior results by a factor of *n*. It was a theoretical contribution with direct implications for federated learning and fairness.

7. **High-dimensional limit theorems for SGD: Effective dynamics and critical scaling** — Gerard Ben Arous, Reza Gheissari, and Aukosh Jagannath (NYU / Northwestern). The authors proved trajectory-convergence theorems for SGD in the high-dimensional limit and identified a critical step-size regime. Below it, SGD’s effective dynamics matched the gradient flow of population loss; at the critical point, a new correction term altered the phase diagram. Though purely theoretical, it supplied a rigorous mathematical basis for understanding SGD in practical deep learning.

8. **Gradient Descent: The Ultimate Optimizer** — Kartik Chandra, Audrey Xie, Jonathan Ragan-Kelley, and Erik Meijer (MIT / UCL). Automatic differentiation recursively optimized an optimizer’s own hyperparameters. These hypergradients could recurse indefinitely, with deeper levels becoming less sensitive to initial hyperparameters. The idea was elegant, required only a small modification to backpropagation, and shipped with an unusually usable PyTorch implementation.

9. **A Neural Corpus Indexer for Document Retrieval** — Yujing Wang, Yingyan Hou et al. (Microsoft Research Asia). NCI was an end-to-end sequence-to-sequence network that mapped queries directly to document IDs, bypassing the traditional index-then-retrieve pipeline. It improved Recall@1 by 21.4% on NQ320k and became important early work in generative retrieval.

10. **Using natural language and program abstractions to instill human inductive biases in machines** — Sreejan Kumar, Carlos Correa et al. (Princeton). Natural-language descriptions and program-induction models instilled human inductive biases in a meta-RL agent, making its behavior more human-like. The work bridged cognitive science and AI.

11. **Is Out-of-distribution Detection Learnable?** — Zhen Fang, Yixuan Li, Jie Lu et al. (UTS / MBZUAI / Wisconsin–Madison). A PAC-learning analysis of OOD detection proved several impossibility results and supplied necessary and sufficient conditions for practical settings, strengthening the field’s theoretical foundations.

12. **Gradient Estimation with Discrete Stein Operators** — Jiaxin Shi, Yuhao Zhou, Jessica Hwang, Michalis Titsias, and Lester Mackey (Microsoft Research / Google DeepMind). The authors developed variance-reduction techniques for discrete distributions using Stein operators and significantly reduced the variance of the REINFORCE estimator when training discrete VAEs.

13. **ProcTHOR: Large-Scale Embodied AI Using Procedural Generation** — Matt Deitke, Eli VanderBilt et al. (AI2). Procedural generation created large-scale indoor environments in which embodied agents trained across more than 10,000 interactive scenes. ProcTHOR expanded the AI2 THOR ecosystem and provided infrastructure for scaling embodied AI.

### Outstanding Datasets & Benchmarks Papers

1. **LAION-5B: An open large-scale dataset for training next generation image-text models** — Christoph Schuhmann et al. Its 5.85 billion CLIP-filtered image–text pairs made it the largest open multimodal dataset at the time. It was one source of Stable Diffusion’s training data and had irreplaceable value for the open ecosystem, although controversial content later prompted extensive ethical debate.

2. **MineDojo: Building Open-Ended Embodied Agents with Internet-Scale Knowledge** — Linxi Fan, Guanzhi Wang et al. (NVIDIA / Caltech / Stanford). MineDojo built a large-scale open-ended task framework in Minecraft and connected it to an internet-scale knowledge base of videos, wikis, and forums, providing infrastructure for open-ended agent research.

### Test of Time Award

**ImageNet Classification with Deep Convolutional Neural Networks** (2012) — Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton. AlexNet was the starting point of the deep-learning revolution. It received the award at NeurIPS 2022 exactly ten years after publication.

### Highly Influential Papers That Did Not Win Awards

- **FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness** — Tri Dao, Daniel Fu, Stefano Ermon, Atri Rudra, and Christopher Ré (Stanford / University at Buffalo). FlashAttention redesigned attention around the GPU memory hierarchy, using tiling to reduce HBM transfers and accelerate GPT-2 training threefold without losing precision. It proposed no new architecture, only a systems optimization, yet became standard in PyTorch, Hugging Face, vLLM, and nearly every large-model training framework. Without it, today’s models with contexts longer than 100,000 tokens would be economically impractical.

- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** — Jason Wei, Xuezhi Wang, Dale Schuurmans et al. (Google Brain). Adding intermediate reasoning steps to few-shot examples sharply improved large models on mathematics, logic, and commonsense reasoning. CoT was an **emergent ability**: it helped only sufficiently large models and made small models worse. This paper began the post-2023 reasoning research line, the o1 family, and the broader chain-of-thought industry.

- **InstructGPT: Training Language Models to Follow Instructions with Human Feedback** — Long Ouyang et al. (OpenAI). The InstructGPT/RLHF paper had influence far beyond academia. Reinforcement Learning from Human Feedback taught language models to follow human instructions, and the 1.3-billion-parameter InstructGPT beat the 175-billion-parameter GPT-3 in human evaluations. **ChatGPT was its direct product: essentially the InstructGPT RLHF pipeline applied to GPT-3.5.**

## ICML 2022

ICML received 5,630 submissions and accepted 1,235 papers, or 21.9%, little changed from 2021. Held in Baltimore, it was among the first major conferences after the pandemic to restore large-scale in-person attendance.

### Outstanding Paper Awards

ICML selected roughly seven or eight Outstanding Papers spanning causal fairness, graph augmentation, differentiable simulation, dataset difficulty, and other topics:

1. **Understanding Dataset Difficulty with V-Usable Information** — Kawin Ethayarajh, Yejin Choi, and Swabha Swayamdipta (Stanford / Allen AI). Pointwise V-information, or PVI, measured the difficulty of datasets and individual examples for a particular model. Unlike conventional model-versus-human comparisons, PVI enabled comparisons across datasets and slices and exposed annotation artifacts in NLP benchmarks.

2. **Causal Conceptions of Fairness and their Consequences** — Hamed Nilforoshan, Johann Gaebler, Ravi Shroff, and Sharad Goel (Stanford). The authors unified two families of causal-fairness definitions, then proved theoretically and experimentally that **both almost always lead, in a measure-theoretic sense, to Pareto-dominated decisions**. An unconstrained alternative policy exists that is better for every stakeholder. In a college-admissions example, the strictest definition required admitting every applicant with equal probability regardless of academic qualifications.

3. **Do Differentiable Simulators Give Better Policy Gradients?** — Hyung Ju Suh, Max Simchowitz, Kaiqing Zhang, and Russ Tedrake (MIT). The paper tested differentiable simulators in RL and found that stiffness or discontinuities in physical systems could undermine first-order gradient estimates. Its α-order estimator combined the advantages of first- and zeroth-order methods.

4. **G-Mixup: Graph Data Augmentation for Graph Classification** — Xiaotian Han, Zhimeng Jiang, Ninghao Liu, and Xia Hu (Texas A&M / MBZUAI). G-Mixup interpolated in graphon space. Direct mixup between graphs is infeasible because their node counts and topologies differ; the graphon representation solved that problem.

5. **Stable Conformal Prediction Sets** — Eugene Ndiaye (Georgia Tech). Combining conformal prediction with algorithmic stability produced prediction sets from a single model run without data splitting, greatly reducing compute while preserving coverage guarantees.

6. **The Importance of Non-Markovianity in Maximum State Entropy Exploration** — Mirco Mutti, Riccardo De Santi, and Marcello Restelli (Politecnico di Milano). The paper proved that non-Markovian deterministic policies are necessary for maximum-state-entropy exploration with finite samples, because Markovian policies incur irreducible regret. Finding the optimal non-Markovian policy is NP-hard, so the result was theoretically important but did not yet yield a practical solution.

7. **Learning Mixtures of Linear Dynamical Systems** — Yanxi Chen and H. Vincent Poor (Princeton). The paper supplied end-to-end guarantees for learning mixtures of linear dynamical systems from unlabeled short sequences, addressing latent variables, short observations, and temporal dependence at once.

8. **Stackelberg Prediction Game via Spherically Constrained Least Squares** — Jiali Wang, Wen Huang, Rujun Jiang, Xudong Li, and Alex Wang. Reformulating the least-squares special case of a Stackelberg prediction game as spherically constrained least squares achieved computational complexity of $\tilde{O}(N/\sqrt{\epsilon})$.

### Test of Time Award

**Poisoning Attacks Against Support Vector Machines** (2012) — Battista Biggio, Blaine Nelson, and Pavel Laskov, a pioneering adversarial-ML paper from ten years earlier.

### Highly Influential Non-Award Papers

- Theoretical work including **Bayesian Flow Networks** continued to advance, but overall ICML 2022 had fewer breakthrough non-award papers than NeurIPS that year. This reflected NeurIPS’s attraction as the largest annual ML conference: the most discussed work often chose NeurIPS over ICML.

## ICLR 2022

ICLR 2022 selected seven Outstanding Papers covering diffusion theory, GNN expressivity, differentially private hyperparameter tuning, learnable stride, meta-learning, and more:

1. **Analytic-DPM: an Analytic Estimate of the Optimal Reverse Variance in Diffusion Probabilistic Models** — Fan Bao, Chongxuan Li, Jun Zhu, and Bo Zhang (Tsinghua University). Analytic-DPM derived an analytic form for the optimal reverse variance and provided a training-free inference framework with 20–80× speedups, a diffusion-theory contribution from Chinese academia.

2. **Bootstrapped Meta-Learning** — Sebastian Flennerhag, Yannick Schroecker, Tom Zahavy, Hado van Hasselt, David Silver, and Satinder Singh (DeepMind). A meta-learner learned by bootstrapping its own targets, avoiding backpropagation through every update step and setting a new state of the art for model-free agents on Atari ALE.

3. **Neural Collapse Under MSE Loss: Proximity to and Dynamics on the Central Path** — X.Y. Han, Vardan Papyan, and David Donoho (Stanford). Studying Neural Collapse under MSE, which is easier to analyze than cross-entropy, produced deeper theoretical understanding of the phenomenon.

4. **Hyperparameter Tuning with Renyi Differential Privacy** — Nicolas Papernot and Thomas Steinke (Google). The authors proved that hyperparameter searches over differentially private algorithms do leak privacy information, but that the leakage is bounded under reasonable assumptions, improving and extending Liu and Talwar (STOC 2019).

5. **Expressiveness and Approximation Properties of Graph Neural Networks** — Floris Geerts and Juan L. Reutter (KU Leuven / PUC Chile). A tensor-language view of GNN separation let designers derive WL-test equivalence bounds merely by checking the number of indices and depth of nested sums. It supplied a general toolbox without requiring intimate knowledge of WL tests.

6. **Learning Strides in Convolutional Neural Networks (DiffStride)** — Rachid Riad, Olivier Teboul, David Grangier, and Neil Zeghidour (Google Research). The first learnable downsampling layer implemented differentiable resizing by learning a crop-mask size in the Fourier domain. It maintained strong results on CIFAR-10/100 and ImageNet even from poor random initialization.

7. **Comparing Distributions by Measuring Differences that Affect Decision Making** — Shengjia Zhao, Abhishek Sinha et al. (Stanford). A new distribution-comparison measure based on decision theory.

### Highly Influential Non-Award Papers

Several non-award ICLR 2022 papers later became highly influential, although most had circulated first as arXiv preprints and were less concentrated at ICLR than comparable work at NeurIPS.

## AAAI 2022

AAAI received 9,020 submissions and accepted 1,349, an acceptance rate of 15.0%, among the lowest that year. It selected six Distinguished Papers:

1. **AlphaHoldem: High-Performance Artificial Intelligence for Heads-Up No-Limit Poker via End-to-End Reinforcement Learning** — Enmin Zhao, Renye Yan, Jinqiu Li, Kai Li, and Junliang Xing. End-to-end RL for heads-up no-limit Texas Hold’em.
2. **Certified Symmetry and Dominance Breaking for Combinatorial Optimisation** — Bart Bogaerts, Stephan Gocht, Ciaran McCreesh, and Jakob Nordström. Certification for symmetry breaking in combinatorial optimization.
3. **Online Elicitation of Necessarily Optimal Matchings** — Jannik Peters. Online preference elicitation for matching problems.
4. **Sampling-Based Robust Control of Autonomous Systems with Non-Gaussian Noise** — Thom Badings, Alessandro Abate, Nils Jansen, David Parker, Hasan Poonawala, and Marielle Stoelinga. Robust control of autonomous systems under non-Gaussian noise.
5. **Subset approximation of Pareto Regions with Bi-objective A*** — Jorge Baier, Carlos Hernández, and Nicolás Rivera. Subset approximation of Pareto regions with bi-objective A*.
6. **The SoftCumulative Constraint with Quadratic Penalty** — Yanick Ouellet and Claude-Guy Quimper. A soft cumulative constraint in constraint programming.

AAAI’s Distinguished Papers have consistently leaned toward classical AI—combinatorial optimization, constraint programming, and multi-agent decision-making—in contrast with the deep-learning emphasis of NeurIPS, ICML, and ICLR.

## IJCAI 2022

IJCAI received 4,537 submissions and accepted 679, also 15.0%. Jointly held as IJCAI-ECAI 2022 in Vienna, it selected three Distinguished Papers:

1. **Plurality Veto: A Simple Voting Rule Achieving Optimal Metric Distortion** — Fatih Kizilkaya and David Kempe. A simple voting rule that achieved optimal metric distortion.
2. **QCDCL with Cube Learning or Pure Literal Elimination – What is Best?** — Benjamin Böhm, Tomáš Peitl, and Olaf Beyersdorff. A comparison of two techniques for QBF solvers.
3. **FAIR-FATE: Fair Federated Learning with Momentum** — Teresa Salazar, Miguel Fernandes, Helder Araujo, and Pedro Henriques Abreu. Fair federated learning.

IJCAI 2022 gave the Research Excellence Award to Stuart Russell, the John McCarthy Award to Michael Littman, and the Computers and Thought Award to Bo Li.

## Overall Observations from 2022

### Three Defining Themes

**Diffusion models took center stage.** In 2021, diffusion models were challengers proving they could beat GANs. In 2022, they were the undisputed lead. Three of 13 NeurIPS Outstanding Papers directly concerned diffusion—Imagen, Karras’s design-space paper, and Riemannian SGM—and ICLR recognized Analytic-DPM. DALL-E 2 in April and Stable Diffusion in August simultaneously brought AI-generated images to public attention. Academic and product momentum moved together, and diffusion’s dominance was unquestioned by year-end.

**Scaling no longer meant only “bigger is better.”** Chinchilla trained more than 400 models to show that earlier scaling laws had the ratio wrong. Data pruning showed that curated data could beat power laws. FlashAttention made scaling more efficient at the systems layer. Together they said: do not merely add parameters; decide carefully how to spend the compute budget.

**Reasoning changed from “impossible” to “promptable.”** Chain-of-Thought prompting redirected prompt engineering. Add reasoning steps to examples, and large models could perform arithmetic, commonsense reasoning, and other tasks previously thought to require special architectures. Combined with InstructGPT’s RLHF, it formed one of ChatGPT’s two main technical pillars.

### Changes from 2021

- **Submissions** kept rising without yet exploding: NeurIPS grew from 9,122 to 10,411, up 14%; the real explosion arrived in 2024.
- **Diffusion** moved from theoretical breakthrough in 2021 to engineering and products in 2022.
- **Scaling laws** changed from Kaplan et al.’s 2020 “bigger is better” to Chinchilla’s “bigger and more data.”
- **RLHF** moved from 2021 proof-of-concept work at Anthropic and OpenAI into InstructGPT’s deployable end-to-end pipeline.
- **GNN** research continued but had passed its peak. G-Mixup represented graph learning among ICML’s Outstanding Papers, but foundation models were beginning to absorb attention.

### In Hindsight: The Most Enduring Work of 2022

Looking back from 2026, the five papers with the most lasting effects may be:

1. **Chinchilla**—directly rewrote the training strategy of every large-model team; the Llama family explicitly followed its scaling law.
2. **InstructGPT / RLHF**—the direct technical source of ChatGPT; RLHF became the baseline for alignment research.
3. **FlashAttention**—an engineering contribution whose industry impact may exceed that of any model paper.
4. **Chain-of-Thought**—opened the entire research line of reasoning as prompting, an ancestor of o1 and o3.
5. **Imagen / Karras’s design space**—the former defined the text-to-image architecture template; the latter made diffusion controllable as an engineering discipline.

---

## References

- [NeurIPS Blog—Announcing the NeurIPS 2022 Awards](https://blog.neurips.cc/2022/11/21/announcing-the-neurips-2022-awards/)
- [NeurIPS 2022 Awards—Outstanding Paper (official virtual venue)](https://neurips.cc/virtual/2022/awards_detail)
- [NeurIPS 2022 Fact Sheet (official PDF)](https://media.neurips.cc/Conferences/NeurIPS2022/NeurIPS_2022_Fact_Sheet.pdf)
- [ICML 2022 Awards (official virtual venue)](https://icml.cc/virtual/2022/awards_detail)
- [ICLR 2022 Awards (official virtual venue)](https://iclr.cc/virtual/2022/awards_detail)
- [AAAI-22 Paper Awards (official PDF)](https://aaai.org/wp-content/uploads/2023/02/AAAI-22-Paper-Awards.pdf)
- [IJCAI-ECAI 2022 Award Winners](https://ijcai-22.org/award-winners/index.html)
- [IJCAI-ECAI 2022 Distinguished Papers](https://ijcai-22.org/distinguished-papers/)
- [Top-Conference-Best-Papers (GitHub compilation)](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Hoffmann et al. (2022), "An empirical analysis of compute-optimal large language model training"—NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/c1e2faff6f588870935f114ebe04a3e5-Abstract-Conference.html)
- [Dao et al. (2022), "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"—NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html)
- [Wei et al. (2022), "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"—NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/9d5609613524ecf4f15af0f7b31abca4-Paper-Conference.pdf)
- [Ouyang et al. (2022), "Training language models to follow instructions with human feedback"—NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html)
