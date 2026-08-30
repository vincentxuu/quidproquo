---
title: "A Guide to the Top AI Conferences of 2023: Machine Learning"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2023", machine-learning, dpo, llm, state-space-model]
lang: en
tldr: "In 2023, LLMs took over the machine-learning conference agenda. NeurIPS received more than 12,000 submissions; both Outstanding Papers addressed large models, while runner-up DPO became a practical alternative to RLHF within two years. DreamFusion opened the text-to-3D field, ICML spotlighted LLM watermarking and learning-rate adaptation, and the Mamba preprint emerged as the first serious architectural challenger to the Transformer."
description: "A guide to the award-winning and influential papers from NeurIPS, ICML, ICLR, AAAI, and IJCAI 2023. It covers DPO, challenges to emergent abilities, QLoRA, Tree of Thoughts, LLaVA, DreamFusion, LLM watermarking, Mamba, and the work that still shaped research in 2026."
draft: false
series:
  name: "AI Conference Guide"
  order: 14
glossary:
  - term: "DPO (Direct Preference Optimization)"
    definition: "An algorithm that optimizes a language model directly from human-preference data. It replaces the separate reward-model training and PPO reinforcement-learning stages of conventional RLHF with a simple classification loss that aligns model behavior."
    context: "A NeurIPS 2023 Outstanding Main Track Runner-Up that later became a practical alternative standard to RLHF."
  - term: "QLoRA"
    definition: "An efficient fine-tuning method that combines 4-bit quantization with LoRA (Low-Rank Adaptation). It can fine-tune a 65B-parameter language model on a single 48GB GPU while retaining performance close to full-precision fine-tuning."
    context: "A NeurIPS 2023 Oral paper that made large-model fine-tuning experiments accessible to researchers without top-tier GPU clusters."
  - term: "State Space Model (SSM)"
    definition: "A family of sequence-modeling architectures based on continuous-time state-space equations that can process long sequences in linear time. Mamba, introduced in late 2023, is a selective SSM variant that became the first serious challenge to the Transformer's dominance in language modeling."
    context: "Mamba appeared as an arXiv preprint in December 2023 and generated extensive discussion at NeurIPS 2023."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2023-ml)

GPT-4 was released, LLaMA became open source, and ChatGPT swept across the world in 2023. LLMs went from a research topic to industry infrastructure, and that shift showed up directly in submission counts and the distribution of conference topics. NeurIPS received more than 12,000 submissions for the first time, while ICML and ICLR also set records. The award slate changed just as clearly: diffusion models and scaling laws had shared the spotlight in 2022, but nearly every major theme in 2023 revolved around large language models—how to align them, evaluate them, fine-tune them efficiently, and protect privacy.

## NeurIPS 2023

NeurIPS received 12,343 submissions and accepted 3,218 papers, for a 26.1% acceptance rate and another record high. The conference retained the previous year's three award tiers: Outstanding Main Track Paper, Outstanding Main Track Runner-Up, and Outstanding Datasets & Benchmarks Paper, plus a Test of Time Award.

### Outstanding Main Track Papers

1. **Privacy Auditing with One (1) Training Run** — Thomas Steinke, Milad Nasr, and Matthew Jagielski (Google DeepMind). This paper presents a way to audit differential-privacy compliance with a single training run. It randomly inserts multiple canary samples, then uses the relationship between differential privacy and statistical generalization to estimate privacy leakage. The method is orders of magnitude more efficient than conventional audits that require many training runs.

2. **Are Emergent Abilities of Large Language Models a Mirage?** — Rylan Schaeffer, Brando Miranda, and Sanmi Koyejo (Stanford). The paper directly challenges the widespread belief that large models suddenly acquire new abilities. The authors show that observed "emergence" is largely a product of metric choice: nonlinear or discontinuous metrics make an ability appear abruptly, while linear, continuous metrics reveal smooth and gradual improvement. The argument is not that large models gain no new abilities, but that measurement has amplified the story of sudden emergence.

### Outstanding Main Track Runner-Ups

3. **Scaling Data-Constrained Language Models** — Niklas Muennighoff, Alexander Rush, Boaz Barak, Teven Le Scao, Nouamane Tazi, Aleksandra Piktus, Sampo Pyysalo, Thomas Wolf, and Colin Raffel (Hugging Face / Cornell / Harvard). This work tackles a practical constraint: high-quality text is finite. How do compute-optimal scaling laws change when training data must be repeated? The paper finds that repetition does less damage than expected and that mixing in code data can substantially reduce the harm. The result has direct engineering implications for anyone approaching a data bottleneck.

4. **Direct Preference Optimization: Your Language Model is Secretly a Reward Model** — Rafael Rafailov, Archit Sharma, Eric Mitchell, Christopher D. Manning, Stefano Ermon, and Chelsea Finn (Stanford). DPO may have been the single most influential paper of 2023. It shows that RLHF's two-stage reward-model-plus-PPO pipeline can be replaced with a simple classification loss that optimizes a policy directly from preference pairs. There is no separately trained reward model and no unstable PPO training loop. Less than two years after publication, DPO and variants including IPO, KTO, and ORPO had become mainstream alignment methods.

### Outstanding Datasets & Benchmarks Papers

5. **ClimSim: A large multi-scale dataset for hybrid physics-ML climate emulation** — Sungduk Yu, Walter Hannah, Liran Peng, and more than 30 coauthors. ClimSim was the largest hybrid physics-ML climate-simulation dataset available at the time. Its design allows models to plug directly into real climate simulators for downstream coupling. This is not an isolated ML benchmark, but an engineering artifact built to advance climate science.

6. **DecodingTrust: A Comprehensive Assessment of Trustworthiness in GPT Models** — Boxin Wang, Weixin Chen, Hengzhi Pei, et al. (UChicago / UIUC). The paper provides the most comprehensive assessment to that point of GPT-3.5 and GPT-4 trustworthiness. It covers eight dimensions, including toxicity, bias, privacy leakage, and adversarial robustness, and finds that GPT-4 can be easier than GPT-3.5 to induce into harmful output in some adversarial settings.

### Test of Time Award

**Distributed Representations of Words and Phrases and their Compositionality** — Tomas Mikolov, Ilya Sutskever, Kai Chen, Greg Corrado, and Jeffrey Dean (published in 2013). This was the second Word2Vec paper, introducing negative sampling and phrase-level embeddings, and it had received more than 40,000 citations. Word2Vec established the paradigm of representing word meaning with vectors and directly preceded later embedding methods, including the GPT family.

### Influential papers beyond the award winners

Several NeurIPS 2023 papers had enormous impact without winning an award:

- **QLoRA: Efficient Finetuning of Quantized LLMs** — Tim Dettmers et al. (University of Washington). This Oral paper combines 4-bit NormalFloat quantization, Double Quantization, and Paged Optimizers so that a 65B model can be fine-tuned with LoRA on a single 48GB GPU at performance close to full-precision fine-tuning. QLoRA directly changed fine-tuning practice across the open-source LLM community. Before it, fine-tuning a large model was largely a privilege of major companies; afterward, it could be done on one consumer GPU.

- **Tree of Thoughts: Deliberate Problem Solving with Large Language Models** — Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, and Karthik Narasimhan (Princeton / Google DeepMind). Tree of Thoughts expands LLM reasoning from a linear chain of thought into tree search. At each step, a model proposes several candidate "thoughts," evaluates them with heuristics or voting, and can backtrack. On tasks that require planning and search, such as Game of 24, it improved performance over chain-of-thought by an order of magnitude.

- **LLaVA: Visual Instruction Tuning** — Haotian Liu et al. (UW-Madison / Microsoft Research). This Oral paper uses GPT-4 to generate multimodal instruction-following data, then trains an end-to-end vision-language model. LLaVA started the open-source multimodal-model line; LLaVA-1.5 and LLaVA-NeXT remained among the field's most active research directions.

- **Fine-Tuning Language Models with Just Forward Passes (MeZO)** — Samir Yitzhak Gadre et al. (Princeton). MeZO uses a zeroth-order optimizer to fine-tune LLMs with only one-twelfth the memory required by SGD, making it suitable for severe memory constraints.

- **Jailbroken: How Does LLM Safety Training Fail?** — Alexander Wei, Nika Haghtalab, and Jacob Steinhardt (Berkeley). This paper systematically analyzes two failure modes in safety training: competing objectives, where safety and helpfulness conflict, and mismatched generalization, where safety training fails to transfer to new attack forms.

**Mamba, the biggest story outside the program:** Albert Gu and Tri Dao released "Mamba: Linear-Time Sequence Modeling with Selective State Spaces" as an arXiv preprint during NeurIPS 2023, on December 1, 2023. It was not an official NeurIPS paper, yet it may have drawn more discussion than any award winner. Mamba's selective SSM mechanism lets state-space parameters change dynamically with the input. In language modeling, it was the first such system to match comparably sized Transformers while running several times faster on long-sequence inference. It looked like the first genuinely credible challenger to the Transformer architecture since 2017.

## ICML 2023

ICML received 6,538 submissions and accepted 1,827 papers, a 27.9% acceptance rate and the first time its rate exceeded 25%. ICML 2023 selected six Outstanding Papers and also presented a Test of Time Award.

### Outstanding Paper Awards

1. **Learning-Rate-Free Learning by D-Adaptation** — Aaron Defazio and Konstantin Mishchenko (Meta FAIR / Samsung AI Center). This paper introduces an optimization algorithm that requires no manual learning-rate tuning. D-adaptation estimates the gradient's distance scale online and sets the learning rate automatically, with theoretical convergence guarantees. In practice, it performed comparably to carefully tuned Adam across several tasks. Its value is immediate for practitioners who spend substantial time on learning-rate schedules.

2. **A Watermark for Large Language Models** — John Kirchenbauer, Jonas Geiping, Yuxin Wen, Jonathan Katz, Ian Miers, and Tom Goldstein (University of Maryland). The method embeds a statistical watermark during LLM token generation. At every step, it divides the vocabulary into "green" and "red" groups and biases selection toward green tokens. A statistical test can later detect whether a specific model generated the text. The paper directly answered the urgent question of how to detect AI-generated writing after ChatGPT's sudden popularity.

3. **Generalization on the Unseen, Logic Reasoning and Degree Curriculum** — Emmanuel Abbe, Samy Bengio, Aryo Lotfi, and Kevin Rizk (EPFL / Apple). This work studies neural-network out-of-distribution generalization on Boolean functions. Training with a degree curriculum lets a model learn low-degree Boolean functions and generalize to unseen inputs of higher degree.

4. **Adapting to Game Trees in Zero-Sum Imperfect Information Games** — Côme Fiegel, Pierre Ménard, Tadashi Kozuno, Rémi Munos, Vianney Perchet, and Michal Valko (ENSAE / ENS Lyon / Omron Sinic X / DeepMind / CRITEO). The paper presents an algorithm for imperfect-information games that adapts to game-tree structure. Its regret bound depends on the size of the game tree rather than the worst-case action space.

5. **Self-Repellent Random Walks on General Graphs** — Vishwaraj Doshi, Jie Hu, and Do Young Eun (IQVIA / NC State). The authors use nonlinear Markov chains to implement self-repellent random walks and achieve minimum sampling variance on general graphs, addressing a foundational problem in graph-sampling efficiency.

6. **Bayesian Design Principles for Frequentist Sequential Learning** — Yunbei Xu and Assaf Zeevi (Columbia University). This work establishes theoretical foundations for Bayesian design principles in frequentist sequential learning and proves the optimality of Bayesian methods for sequential decision problems.

### Test of Time Award

**Learning Fair Representations** — Rich Zemel, Yu Wu, Kevin Swersky, Toni Pitassi, and Cynthia Dwork (published in 2013). The method learns fair representations of data so that downstream classifiers using them inherit fairness properties. It started the now-mature subfield of ML fairness.

## ICLR 2023

ICLR received 4,966 submissions and accepted approximately 1,574 papers, for a 31.8% acceptance rate. Among them were 91 Oral papers, the top 1.6%, and 280 Spotlight papers, the top 8%. ICLR 2023 selected four Outstanding Papers and five Honorable Mentions; complete details for a sixth paper were absent from some sources.

### Outstanding Paper Awards

1. **DreamFusion: Text-to-3D using 2D Diffusion** — Ben Poole, Ajay Jain, Jonathan T. Barron, and Ben Mildenhall (Google Research / UC Berkeley). DreamFusion introduces Score Distillation Sampling (SDS). It needs no 3D training data: a pretrained 2D image diffusion model directly guides NeRF optimization to generate a 3D object from a text description. DreamFusion opened the entire text-to-3D field, and later systems including Magic3D, ProlificDreamer, and MVDream built on SDS or improved versions of it.

2. **Rethinking the Expressive Power of GNNs via Graph Biconnectivity** — Bohang Zhang, Shengjie Luo, Liwei Wang, and Di He (Peking University / Microsoft Research Asia). The authors redefine the framework for understanding graph neural-network expressiveness. Graph biconnectivity becomes a new theoretical tool, producing a more fine-grained hierarchy of GNN capabilities than the Weisfeiler-Leman hierarchy.

3. **Universal Few-shot Learning of Dense Prediction Tasks with Visual Token Matching** — Donggyun Kim, Jinwoo Kim, Seongwoong Cho, Chong Luo, and Seunghoon Hong (KAIST / Microsoft Research Asia). This unified few-shot method handles several dense-prediction tasks, including semantic segmentation, depth estimation, and surface normals. Its central mechanism replaces task-specific head designs with visual-token matching.

4. **Emergence of Maps in the Memories of Blind Navigation Agents** — Erik Wijmans, Manolis Savva, Irfan Essa, Stefan Lee, Ari S. Morcos, and Dhruv Batra (Georgia Tech / Simon Fraser / Meta AI). The researchers train a completely blind navigation agent equipped only with proprioception and find that a spatial map emerges spontaneously in its internal memory. It is an elegant experiment in emergent structure that connects directly to cognitive-science research on internal spatial cognition.

### Outstanding Paper Honorable Mentions

- **Towards Understanding Ensemble, Knowledge Distillation and Self-Distillation in Deep Learning** — Zeyuan Allen-Zhu and Yuanzhi Li (Microsoft Research / CMU)
- **Mastering the Game of No-Press Diplomacy via Human-Regularized Reinforcement Learning and Planning** — Anton Bakhtin, David J. Wu, et al. (Meta FAIR). The technical paper behind CICERO uses human-regularized reinforcement learning to reach human-expert performance in Diplomacy without communication.
- **On the Duality between Contrastive and Non-contrastive Self-supervised Learning** — Quentin Garrido, Yubei Chen, Adrien Bardes, Laurent Najman, and Yann LeCun (Meta FAIR / ESIEE Paris). The paper proves that contrastive and non-contrastive self-supervised learning are algebraically equivalent under limited assumptions.
- **Conditional Antibody Design as 3D Equivariant Graph Translation** — Xiangzhe Kong, Wenbing Huang, and Yang Liu (Tsinghua University). The work models antibody design as a 3D-equivariant graph-translation problem.
- **Disentanglement with Biological Constraints: A Theory of Functional Cell Types** — James C. R. Whittington, Will Dorrell, Surya Ganguli, and Timothy Behrens (Oxford / Stanford / UCL)

## AAAI 2023

AAAI received 8,777 submissions and accepted 1,721 papers, for a 19.6% acceptance rate. Its award structure was broader: one Outstanding Paper, one Outstanding Student Paper, and 12 Distinguished Papers.

### Outstanding Paper

**Misspecification in Inverse Reinforcement Learning** — Joar Skalse and Alessandro Abate (Oxford). The paper studies how inverse reinforcement learning fails when the assumed reward-function space does not match the real reward. This question became especially important in the RLHF era because reward-model misspecification is a core risk in alignment failure.

### Outstanding Student Paper

**Decorate the Newcomers: Visual Domain Prompt for Continual Test Time Adaptation** — Yulu Gan, Yan Bai, Yihang Lou, Xianzheng Ma, Renrui Zhang, Nian Shi, and Lin Luo. This work uses visual domain prompts for continual test-time adaptation, addressing how a deployed model can adapt as domain distributions keep changing.

### Distinguished Papers (12 total; selected representative directions)

- **DropMessage: Unifying Random Dropping for Graph Neural Networks** — extends the idea of dropout to message passing in GNNs
- **CowClip: Reducing CTR Prediction Model Training Time from 12 hours to 10 minutes on 1 GPU** — an engineering paper that cuts recommender-system training from 12 hours to 10 minutes on one GPU
- **XRand: Differentially Private Defense against Explanation-Guided Attacks** — uses differential privacy to defend against explanation-guided adversarial attacks
- **Clustering What Matters: Optimal Approximation for Clustering with Outliers** — gives an optimal approximation algorithm for clustering with outliers
- **Robust Average-Reward Markov Decision Processes** — develops theory for robust average-reward MDPs

## IJCAI 2023

IJCAI received 4,566 submissions and accepted 643 papers, maintaining its characteristically low acceptance rate at 14.1%.

### Distinguished Paper Awards

1. **Levin Tree Search with Context Models** — Laurent Orseau, Marcus Hutter, and Levi H. S. Lelis (DeepMind / ANU / University of Alberta). The method combines Levin tree search with context models for program synthesis and search problems.

2. **SAT-Based PAC Learning of Description Logic Concepts** — Balder ten Cate, Maurice Funk, Jean Christoph Jung, and Carsten Lutz (University of Amsterdam / University of Bremen). The paper uses SAT solvers for PAC learning of description-logic concepts.

3. **Safe Reinforcement Learning via Probabilistic Logic Shields** — a KU Leuven team. Probabilistic logic shields prevent an agent from taking unsafe actions during training and deployment.

## The big picture in 2023: three defining themes

**Theme 1: LLMs took over the agenda.** The top ML conferences of 2022 still divided attention among diffusion models, scaling laws, and chain of thought. In 2023, nearly every focal point involved LLMs: alignment with DPO; evaluation through Emergent Abilities and DecodingTrust; efficient fine-tuning with QLoRA and MeZO; privacy auditing; watermark-based detection; multimodality with LLaVA; and reasoning with Tree of Thoughts. This was more than an increase in LLM papers. LLMs became the default infrastructure for other subfields. Even 3D generation—where DreamFusion distilled knowledge from a 2D diffusion model—and climate science through ClimSim were engaging with the foundation-model approach.

**Theme 2: From capability demonstrations to safety and alignment.** The central question in 2022 was what large models could do, represented by Chinchilla, chain of thought, and Imagen. In 2023, it became how large models should be controlled. DPO addressed the engineering of alignment training. Jailbroken analyzed why safety training fails. DecodingTrust provided a broad trustworthiness evaluation. Watermark tackled detection. The transition directly reflected the urgency around AI safety in academia and industry after ChatGPT's launch.

**Theme 3: The Transformer's first challenger.** Mamba was not an official NeurIPS 2023 paper, but it may have attracted more discussion at the conference than any award winner. Selective SSMs offered a route to linear-complexity inference on long sequences, posing a structural challenge to the Transformer's O(n²) attention. After 2023, nearly every new sequence-modeling architecture had to compare itself with Mamba, even as the Transformer remained dominant.

### Compared with 2022

| Dimension | 2022 | 2023 |
|---|---|---|
| Central theme | Diffusion models + scaling laws + CoT | LLM alignment + safety + efficient fine-tuning |
| NeurIPS submissions | 10,411 | 12,343 (+18.6%) |
| Industry vs. academia among award winners | Roughly balanced | Dominated by Google, Stanford, and Meta |
| Greatest industry impact | Chinchilla (changed the training paradigm) | DPO (changed alignment training) |
| Biggest surprise | The impact of InstructGPT/RLHF | Challenges to emergent abilities |
| Emerging architectures | — | Mamba / SSM |

### With hindsight: the five works from 2023 with the most lasting impact

1. **DPO:** became a new standard for alignment training and produced an entire family of methods, including IPO, KTO, ORPO, and SimPO
2. **QLoRA:** democratized fine-tuning experiments for the open-source LLM community
3. **LLaVA:** started the open-source multimodal-model research line
4. **DreamFusion / SDS:** defined the methodological framework for text-to-3D
5. **Mamba:** even with the Transformer still dominant, SSMs became a mandatory baseline for every new architecture paper

---

## References

- [Announcing the NeurIPS 2023 Paper Awards — NeurIPS Blog](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards/)
- [NeurIPS 2023 Outstanding Papers — AIhub](https://aihub.org/2023/12/12/neurips2023-outstanding-papers/)
- [NeurIPS 2023: Top Papers and Award Winners — The Decoder](https://the-decoder.com/neurips-2023-these-are-the-top-papers-and-award-winners-at-the-largest-ai-conference/)
- [A Guide to NeurIPS 2023 — 7 Research Areas and 10 Spotlight Papers — Zeta Alpha](https://www.zeta-alpha.com/post/a-guide-to-neurips-2023-7-research-areas-and-10-spotlight-papers-to-read)
- [ICML 2023 Awards — Official Page](https://icml.cc/Conferences/2023/Awards)
- [ICML 2023 Test of Time Award — Official Page](https://icml.cc/Conferences/2023/Test-of-Time)
- [Announcing the ICLR 2023 Outstanding Paper Award Recipients — ICLR Blog](https://blog.iclr.cc/2023/03/21/announcing-the-iclr-2023-outstanding-paper-award-recipients/)
- [ICLR 2023 Fact Sheet (official PDF)](https://media.iclr.cc/Conferences/ICLR2023/ICLR2023-Fact_Sheet.pdf)
- [AAAI-23 Paper Awards (official PDF)](https://aaai-23.aaai.org/wp-content/uploads/2023/02/AAAI-23-Paper-Awards-1.pdf)
- [AAAI 2023 Best Paper Winners — AIhub](https://aihub.org/2023/02/11/congratulations-to-the-aaai2023-best-paper-winners/)
- [IJCAI 2023 Distinguished Paper Awards (official page)](https://ijcai-23.org/distinguished-paper-awards/)
- [Distinguished Paper Award at IJCAI 2023 — University of Alberta](https://www.ualberta.ca/en/computing-science/news-and-events/news/2023/september/distinguished-paper-award-at-ijcai-2023.html)
- [DPO — NeurIPS 2023 Proceedings](https://papers.nips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html)
- [Are Emergent Abilities a Mirage? — NeurIPS 2023 Proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/adc98a266f45005c403b8311ca7e8bd7-Abstract-Conference.html)
- [Mamba: Linear-Time Sequence Modeling with Selective State Spaces — arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- [LLaVA: Visual Instruction Tuning — GitHub](https://github.com/haotian-liu/llava)
- [Top-Conference-Best-Papers — GitHub](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [CS Conf Stats — ICLR 2023](https://csconfstats.xoveexu.com/conferences/iclr/2023/)
