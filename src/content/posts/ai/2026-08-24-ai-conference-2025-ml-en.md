---
title: "2025 AI Conference Review: Machine Learning"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2025", machine-learning, reasoning, ai-agent, scaling-law]
lang: en
tldr: "ML conferences broke every submission record in 2025 and pushed peer review to its limit. NeurIPS received 21,575 papers and used more than 20,000 reviewers; ICML passed 12,000 for the first time, and ICLR reached 11,565. Reasoning and agents were the strongest trends. One NeurIPS runner-up, the conference's only perfect-score paper, challenged whether RLVR creates new reasoning ability. Awards for Alibaba Qwen's Gated Attention and a mechanistic theory of neural scaling laws showed a community moving from scaling at all costs toward understanding why scaling works."
description: "A guide to award-winning and influential work at NeurIPS, ICML, ICLR, AAAI, and IJCAI 2025, including Gated Attention, the RLVR challenge, 1,000-layer RL networks, diffusion generalization, superposition-based scaling laws, CollabLLM, and shallow safety alignment."
draft: false
series:
  name: "AI 頂會導讀"
  order: 22
glossary:
  - term: "RLVR"
    definition: "Reinforcement Learning from Verifiable Rewards uses objectively checkable signals, such as correct mathematics answers, to train reasoning models. It is central to systems such as DeepSeek R1 and OpenAI o1."
    context: "The only perfect-score NeurIPS 2025 paper questioned whether RLVR creates genuinely new reasoning ability."
  - term: "Gated Attention"
    definition: "A per-head sigmoid gate added after standard Scaled Dot-Product Attention. This small architectural change improves training stability and scaling while eliminating attention sinks."
    context: "Alibaba's Qwen team won a NeurIPS 2025 Best Paper award for it."
  - term: "attention sink"
    definition: "The tendency for the first few tokens to absorb a large share of attention during LLM inference regardless of their meaning, a known but difficult attention-allocation bias."
    context: "The sigmoid gate in Gated Attention can eliminate the effect."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2025-ml)

> The 2025 machine-learning installment of the [AI Conference Review](/posts/ai/2026-08-23-what-is-ai-top-conference) series (zh-TW only), covering NeurIPS, ICML, ICLR, AAAI, and IJCAI.

2025 set scale records across ML conferences. NeurIPS submissions jumped 37.6%, from 15,671 to 21,575; ICML rose 27.8%, from 9,473 to 12,107; and ICLR rose 58.3%, from 7,304 to 11,565. All three recorded their fastest growth in five years. Review capacity reached its limit: NeurIPS used 20,518 reviewers, 1,663 Area Chairs, and 199 Senior Area Chairs—a reviewer pool comparable to the entire academic staff of a midsize university.

Two changes defined the research. First, more award-winning work tried to explain why existing methods work: mechanisms behind scaling laws, diffusion generalization, and the limits of RLVR. Second, agent papers coalesced into a mature research direction, with more than 367 agent-related NeurIPS acceptances.

## NeurIPS 2025

21,575 submissions, 5,290 acceptances, 24.5%. Held in San Diego in December 2025.

### Best Paper Awards (4)

**Gated Attention for Large Language Models: Non-linearity, Sparsity, and Attention-Sink-Free**  
Zihan Qiu, Zekun Wang, Bo Zheng et al. (Alibaba Qwen)

A per-head sigmoid gate after attention added less than 2% inference latency but improved training stability, supported larger learning rates, and eliminated attention sinks. Qwen tested more than thirty 15B MoE and 1.7B dense models on 3.5 trillion training tokens. The change entered Qwen3-Next in September 2025—an example of validating a small architectural insight at industrial scale.

**1000 Layer Networks for Self-Supervised RL: Scaling Depth Can Enable New Goal-Reaching Capabilities**  
Kevin Wang, Ishaan Javali, Michał Bortkiewicz, Tomasz Trzciński, Benjamin Eysenbach (Princeton / Warsaw University of Technology)

RL policy networks usually have two to five layers. This work scaled Contrastive RL to 1,024 layers using residual connections, LayerNorm, and Swish, improving unsupervised goal-reaching by 20–50 times. Humanoid agents developed navigation strategies for complex mazes without hand-designed rewards. Depth mattered far more in RL than expected, but self-supervised learning was necessary to unlock it.

**Why Diffusion Models Don't Memorize: The Role of Implicit Dynamical Regularization in Training**  
Tony Bonnaire, Raphaël Urfin, Giulio Biroli, Marc Mézard (ENS / Sorbonne / Bocconi)

The paper identified two training timescales: an early point at which high-quality samples emerge and a later point at which memorization begins. Between them, training dynamics provide an implicit regularization window, explaining why diffusion models can generalize from limited data.

**Artificial Hivemind: The Open-Ended Homogeneity of Language Models (and Beyond)**  
Liwei Jiang, Yuanjun Chai, Margaret Li et al. (D&B Track)

Infinity-Chat—26,000 queries and 31,000 human annotations—supported a study of output homogenization across more than 70 state-of-the-art LLMs. As models converge on similar answers, diversity disappears. The D&B award highlighted a particularly acute problem in the 2025 ecosystem.

### Runner-Up Papers (3)

**Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?**  
Yang Yue, Zhiqi Chen, Rui Lu et al. (Tsinghua)

This was NeurIPS 2025's only paper with four perfect scores. It challenged RLVR, central to DeepSeek R1 and OpenAI o1. RLVR models outperformed their bases at small k, but base models caught up or surpassed them as k grew. The result suggested improved sampling efficiency rather than new reasoning patterns: "RLVR does not expand the reasoning boundary of the base model." That contrarian conclusion drew attention in a year dominated by R1 and o1.

**Optimal Mistake Bounds for Transductive Online Learning** — Zachary Chase, Steve Hanneke, Shay Moran, Jonathan Shafer resolved a 30-year open problem by tightly bounding the quadratic gap between transductive and standard online learning.

**Superposition Yields Robust Neural Scaling** — Yizhou Liu, Ziming Liu, Jeff Gore proposed representation superposition as the mechanism behind neural scaling laws. Under strong superposition, loss is inversely proportional to model dimension; open LLMs operate in this regime, consistent with Chinchilla laws.

### Test of Time Award

**Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks** — Shaoqing Ren, Kaiming He, Ross Girshick, Jian Sun (2015), with more than 98,000 citations. Region Proposal Networks made proposals nearly free and influenced Mask R-CNN, YOLO, and a generation of detectors. Ren, now chief scientist for autonomous driving at NIO, became the first first author based in China to receive the award.

### Influential Papers Outside the Awards

- **Agents:** more than 367 accepted papers covered benchmarking, tool use, reasoning, collaboration, and safety, marking the move from concept to systematic research.
- **Test-time compute:** many papers tested whether more inference computation could keep improving results; evidence suggested both theoretical and practical limits were approaching.
- **Architecture versus scale:** attention shifted from "bigger is better" toward architecture, training strategy, and evaluation as the real constraints.

## ICML 2025

12,107 submissions, 3,260 accepted, 26.9%. There were 120 Orals (1.0%) and 313 Spotlight Posters (2.6%). Held in Vancouver in July.

### Outstanding Paper Awards (6 Main Track + 2 Position Papers)

**Score Matching with Missing Data** — Josh Givens, Song Liu, Henry Reeve (Bristol / Nanjing) developed theory for score matching with missing observations.

**Conformal Prediction as Bayesian Quadrature** — Jake Snell, Thomas Griffiths reframed conformal prediction as Bayesian quadrature, connecting two fields theoretically.

**CollabLLM: From Passive Responders to Active Collaborators** — Shirley Wu, Michel Galley, Baolin Peng et al. (Microsoft Research / Stanford) taught models when to ask questions and how to adapt communication. Multiturn-aware Rewards used an LLM user simulator to estimate long-term effects. In a 201-person study, satisfaction rose 17.6% and completion time fell 10.4%, signaling a shift from good answers toward good interaction.

**Train for the Worst, Plan for the Best: Understanding Token Ordering in Masked Diffusions** — Jaeyeon Kim et al. analyzed token ordering and training dynamics in masked diffusion.

**Roll the Dice & Look Before You Leap: Going Beyond the Creative Limits of Next-Token Prediction** — Vaishnavh Nagarajan et al. formally argued that next-token prediction limits algorithmic creativity and that multi-token methods can exceed it.

**The Value of Prediction in Identifying the Worst-Off** — Unai Fischer Abaigar et al. studied predictive identification of the most disadvantaged while avoiding amplification of bias.

**Position Paper: AI Safety should prioritize the Future of Work** — Sanchaita Hazra et al. argued that safety agendas should center the future of work alongside alignment and misuse.

**Position Paper: The AI Conference Peer Review Crisis Demands Author Feedback and Reviewer Rewards** — Jaeho Kim et al. called for author feedback and reviewer incentives in response to submission growth and declining review quality. Its award showed that the community took the crisis seriously.

### Test of Time Award

**Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift** — Sergey Ioffe, Christian Szegedy (2015). Honorable Mentions went to **Trust Region Policy Optimization** and **Variational Inference with Normalizing Flows**, both still influential after a decade.

## ICLR 2025

11,565 submissions, 3,710 accepted, 32.1%. Held in Singapore in April. Submissions grew 58.3%, fastest among the five major ML conferences. Its acceptance rate reflects ICLR's historically different 30–40% review culture and should not be compared directly with NeurIPS or ICML's 20–28% range.

### Outstanding Papers (3)

**Safety Alignment Should be Made More Than Just a Few Tokens Deep** — Xiangyu Qi et al. (Princeton) showed that current systems can pass safety tests by changing only the first few generated-token distributions. This "shallow safety alignment" is easily bypassed or damaged by fine-tuning, motivating deeper methods.

**Learning Dynamics of LLM Finetuning** — Yi Ren, Danica J. Sutherland (UBC) formalized what models learn and forget during fine-tuning.

**AlphaEdit: Null-Space Constrained Model Editing for Language Models** — Junfeng Fang et al. (USTC / NUS) projected parameter updates into the null space of retained knowledge. One projection line improved locate-then-edit methods by 36.7% on average without damaging old knowledge.

### Honorable Mentions (3)

- **Data Shapley in One Training Run** — Jiachen T. Wang et al. reduced data-contribution valuation from many training runs to one.
- **SAM 2: Segment Anything in Images and Videos** — Nikhila Ravi et al. (Meta FAIR) extended segmentation from images to real-time video.
- **Faster Cascades via Speculative Decoding** — Harikrishna Narasimhan et al. (Google) accelerated multi-model cascades without sacrificing quality.

## AAAI 2025 (Additional Coverage)

12,957 submissions, 3,032 accepted, 23.4%. Held in Philadelphia in February–March.

### Best Paper

**Revelations: A Decidable Class of POMDPs with Omega-Regular Objectives** — Marius Belly et al. identified a decidable class of partially observable Markov decision processes that can be solved exactly under omega-regular objectives, a rare positive theoretical result for POMDPs.

### Outstanding Papers

- **Every Bit Helps: Achieving the Optimal Distortion with a Few Queries** — Soroush Ebadian, Nisarg Shah contributed to social-choice theory with optimal distortion under few queries.
- **Efficient Rectification of Neuro-Symbolic Reasoning Inconsistencies by Abductive Reflection** — Wen-Chao Hu et al. (Nanjing) used abductive reasoning to correct neuro-symbolic inconsistencies.

### AISI Track Outstanding Paper

**DivShift: Exploring Domain-Specific Distribution Shifts in Large-Scale, Volunteer-Collected Biodiversity Datasets** — Elena Sierra et al. exposed systematic bias in volunteer-collected biodiversity data.

### Classic Paper Award

**Toward an Architecture for Never-Ending Language Learning** — Tom Mitchell, Andrew Carlson et al. (2010) anticipated the central problems of continual learning.

## IJCAI 2025 (Additional Coverage)

5,806 submissions and 1,023 Main Track acceptances (17.6%), plus 136 special-track, 52 survey, 17 journal, and 12 sister-conference papers. Held in Montreal in August.

### Distinguished Papers

- **Combining MORL with Restraining Bolts to Learn Normative Behaviour** — Emery A. Neufeld et al. combined multi-objective RL with constraints for normative behavior.
- **Boost Embodied AI Models with Robust Compression Boundary** — Chong Yu et al. improved embodied-model efficiency through a robust compression boundary.
- **Speeding Up Hyper-Heuristics With Markov-Chain Operator Selection and the Only-Worsening Acceptance Operator** — Abderrahim Bendahi et al. advanced the theory and implementation of hyper-heuristic acceleration.

## Overall Observations for 2025

### Peer Review Reached Its Limit

NeurIPS used more than 20,000 reviewers, yet submissions grew faster than the pool. ICML gave an Outstanding award to a paper titled "The AI Conference Peer Review Crisis." A conference publishing a critique of whether its own publication mechanism can function is itself a signal. Pangram Labs' later analysis of the ICLR 2026 cycle estimated that roughly 21% of reviews might be AI-generated, putting unprecedented pressure on trust.

### From Scaling Up to Understanding Why It Works

Award-winning work focused less on larger models and benchmark gains than on explanations: why diffusion avoids memorization, what causes scaling laws, whether RLVR creates ability, and where next-token prediction fundamentally fails. ML was moving from an engineering-led scale race toward theory-led understanding.

### Reasoning and Agents Were the Two Strongest Trends

DeepSeek R1 and OpenAI o1 sparked a reasoning-model boom, but academia responded critically: NeurIPS's only perfect-score paper questioned RLVR. Agent work became systematic, with more than 367 NeurIPS papers across benchmarking, tools, multi-agent systems, and safety. CollabLLM offered another direction—not more autonomous agents, but LLMs that collaborate better with people.

### What Changed from 2024

- **Submission growth accelerated:** NeurIPS +37.6%, ICML +27.8%, ICLR +58.3%.
- **More theoretical work won awards:** methodological innovation dominated 2024, while 2025 favored more pure-theory and theory-driven explanations.
- **Position Papers gained influence:** ICML's track began in 2024; two won Outstanding awards in 2025, including one that influenced discussion of conference reform.
- **Chinese institutions won more densely:** Alibaba Qwen, Tsinghua, USTC, and Nanjing University all appeared among major awards.

### In Hindsight: Which Papers May Matter Most?

1. **Gated Attention** was already integrated into Qwen3-Next and may change the default attention implementation.
2. **The RLVR critique** could directly redirect reasoning-model training if its conclusion holds.
3. **The depth of safety alignment** made shallow alignment a standard safety concept.
4. **CollabLLM** shifted attention from answering well to interacting well, with potential implications for product design.
5. **Superposition Yields Robust Neural Scaling** could change how model capability is understood and forecast if superposition truly underlies scaling laws.

---

## References

- [NeurIPS 2025 Best Paper Awards](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards/)
- [NeurIPS 2025 Test of Time Award](https://blog.neurips.cc/2025/11/26/announcing-the-test-of-time-paper-award-for-neurips-2025/)
- [NeurIPS 2025 Fact Sheet](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [Alibaba Qwen wins NeurIPS 2025 Best Paper](https://www.alizila.com/alibaba-qwen-wins-neurips-2025-best-paper-award-for-breakthrough-in-attention-mechanisms/)
- [The Only Perfect Score Paper at NeurIPS 2025](https://mail.bycloud.ai/p/the-only-perfect-score-paper-at-neurips-2025)
- [NeurIPS 2025: 45 Computer-Use Agent Papers](https://cua.ai/blog/neurips-2025-cua-papers)
- [ICML 2025 Awards](https://icml.cc/virtual/2025/awards_detail)
- [CollabLLM — Microsoft Research](https://www.microsoft.com/en-us/research/blog/collabllm-teaching-llms-to-collaborate-with-users/)
- [ICML 2025 Acceptance Rate](https://csconfstats.xoveexu.com/conferences/icml/2025/)
- [ICLR 2025 Outstanding Paper Awards](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025/)
- [ICLR 2025 Fact Sheet](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Fact_Sheet.pdf)
- [ICLR 2025 Acceptance Rate](https://csconfstats.xoveexu.com/conferences/iclr/2025/)
- [AAAI 2025 Outstanding Paper Winners](https://aihub.org/2025/03/01/congratulations-to-the-aaai2025-outstanding-paper-award-winners/)
- [AAAI 2025 Best Paper — LaBRI](https://www.labri.fr/en/actualites/best-paper-award-aaai-2025-conference)
- [AAAI 2025 Acceptance Rate](https://csconfstats.xoveexu.com/conferences/aaai/2025/)
- [IJCAI 2025 Distinguished Paper Winners](https://aihub.org/2025/08/20/congratulations-to-the-ijcai2025-distinguished-paper-award-winners/)
- [IJCAI 2025 award for TU Wien](https://www.vcla.at/2025/08/ijcai-2025-distinguished-paper-award-for-tu-wien-researchers/)
- [IJCAI 2025 Main Track acceptance](https://x.com/IJCAIconf/status/1957803857347490245)
- [Kim, Lee & Lee (2025), "The AI Conference Peer Review Crisis"](https://proceedings.mlr.press/v267/kim25am.html)
- [AlphaEdit — ICLR 2025 Proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/88be023075a5a3ff3dc3b5d26623fa22-Abstract-Conference.html)
