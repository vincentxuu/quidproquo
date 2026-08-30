---
title: "What AI Conferences Published in 2021: Transformers Spread, Self-Supervised Learning, and the Start of Diffusion"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2021", topic-analysis, transformer, self-supervised-learning, diffusion-model, graph-neural-network]
lang: en
tldr: "2021 was a dividing line for major AI conferences. Transformers spread from NLP throughout computer vision and time-series research, self-supervised learning became the most common cross-conference theme, and a diffusion model won an ICLR Outstanding Paper award before anyone realized it would displace GANs. Meanwhile, GNNs and federated learning reached historic peaks in paper volume before beginning to decline."
description: "A topic-level retrospective on award winners and paper trends across NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ICCV, and AAAI in 2021: which areas were exploding, emerging, or saturated, and which research bets delivered the highest returns by 2026."
draft: false
series:
  name: "AI 頂會導讀"
  order: 9
glossary:
  - term: "Diffusion Model"
    definition: "A class of generative models that creates data by gradually adding noise and then learning to remove it. A diffusion paper won an ICLR Outstanding Paper award in 2021; from 2022 onward, the approach swept through image generation."
    context: "In 2021, diffusion models were still discussed mainly within academia and had not entered public awareness."
  - term: "Self-Supervised Learning"
    definition: "A learning method that requires no human annotation. The model learns representations from the structure of the data itself, for example by predicting masked portions of its input."
    context: "ICML, CVPR, and ICCV all published substantial volumes of self-supervised learning research in 2021, making it the year’s most prominent cross-domain keyword."
  - term: "Vision Transformer (ViT)"
    definition: "An application of the Transformer architecture from text sequences to images, dividing an image into patches and processing them as tokens."
    context: "Google introduced ViT at the end of 2020, and Transformer-based vision models immediately proliferated across computer vision conferences in 2021."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2021-topics)

The leading AI conferences of 2021 occupied a distinctive moment. GPT-3 had appeared the year before, but ChatGPT did not exist. Stable Diffusion did not exist either, and RLHF was a niche topic studied by only a few researchers. Yet the award winners and accepted-paper keywords from 2021 contain clear signals of every direction that would explode from 2022 through 2024: diffusion models, multimodality, and large-language-model alignment. Instead of organizing the year conference by conference, this article asks what research topics nine leading AI conferences were publishing.

## The Hottest Trend: Transformers Spread from NLP into Every Domain

The most visible cross-conference trend of 2021 was the **spread of the Transformer architecture throughout the field**. The Transformer originated in NLP in 2017. At the end of 2020, Google introduced ViT, the Vision Transformer, which divided images into patches, treated them as tokens, and matched CNN performance on ImageNet. 2021 was the year the computer vision community broadly accepted that paradigm.

**The ICCV 2021 Best Paper, or Marr Prize, went to Swin Transformer.** Ze Liu and colleagues at Microsoft Research Asia introduced a hierarchical Vision Transformer whose shifted-window mechanism enabled it to process high-resolution images. It became one of the most cited computer vision backbones over the following two years. The award itself sent a signal: the Vision Transformer was no longer an import borrowed from NLP, but a core architecture of computer vision.

The **CVPR 2021 Best Paper Honorable Mention went to Exploring Simple Siamese Representation Learning** by Xinlei Chen and Kaiming He, which also explored the role of Transformers in self-supervised learning. **One of the AAAI 2021 Outstanding Papers was Informer**, an efficient Transformer from a Beihang University team designed for long-sequence time-series forecasting. It showed that Transformers had expanded beyond NLP and computer vision into time series.

A keyword analysis of 80,814 main-track papers from five major AI conferences—ACL, CVPR, ICLR, ICML, and NeurIPS—between 2017 and 2025 found a **clear acceleration point for Transformer-related papers in 2021** (Khanbayov et al., arXiv:2606.12828). The increase was not linear; it occurred simultaneously across conferences. That pattern contrasted sharply with the steady linear growth of reinforcement learning.

## Self-Supervised Learning: The Year’s Common Denominator

If one direction had to represent the dense flow of submissions across machine learning, computer vision, and NLP in 2021, it would be **self-supervised learning (SSL)**.

One of the **ICML 2021 Outstanding Paper Honorable Mentions was Understanding Self-Supervised Learning Dynamics without Contrastive Pairs** by Yuandong Tian, Xinlei Chen, and Surya Ganguli. It analyzed why self-supervised approaches such as BYOL could learn good representations without negative examples, one of the year’s central open questions.

**Exploring Simple Siamese Representation Learning at CVPR 2021**, the Best Paper Honorable Mention noted above, likewise pursued a minimal design for self-supervised learning. **ICCV 2021** featured many papers combining Transformers with self-supervision. Among accepted papers at **NeurIPS 2021**, self-supervised learning was one of the most frequent keywords.

The practical force behind self-supervised learning’s broad appeal in 2021 was simple: labeled data was expensive, while pretrained models had already shown that unsupervised or self-supervised representation learning could replace a large amount of manual annotation. BERT in 2018 and the GPT family had established the pattern in NLP. In 2021, computer vision and multimodal research followed in full.

## Emerging: A Diffusion Model Won an ICLR Outstanding Paper Award

The emerging direction most worth revisiting from 2021 is the **diffusion model**.

**One of ICLR 2021’s eight Outstanding Papers was Score-Based Generative Modeling through Stochastic Differential Equations** by Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, and Ben Poole. The paper unified score-based models and denoising diffusion models through stochastic differential equations, establishing a foundational theoretical framework for diffusion models.

Earlier that year, Dhariwal and Nichol published Diffusion Models Beat GANs on Image Synthesis, the first work to beat a GAN’s FID score on ImageNet with a diffusion model. At the end of the year, Nichol and colleagues published GLIDE and demonstrated text-guided diffusion image generation.

Diffusion models in 2021 had one important feature: **they had not yet broken out of research circles**. The year’s diffusion papers appeared primarily at ICLR and NeurIPS. There were few of them, but their quality was exceptionally high, including an Outstanding Paper. According to the cross-conference topic analysis above, diffusion paper volume remained at a low base in 2021. The true explosion came only after Stable Diffusion and DALL·E 2 were released in 2022.

This is a classic signal before a phase transition: a direction wins a conference’s highest honor while its overall paper count remains small. Review committees have recognized its importance, but most researchers have not yet followed. Only one year separated the ICLR Outstanding Paper of 2021 from the broad diffusion boom of 2022.

## Emerging: Multimodal Learning and the CLIP Effect

At the beginning of 2021, OpenAI released **CLIP**, or Contrastive Language–Image Pre-training, and **DALL·E**, pushing joint representations of text and images to a new level. These papers were not themselves published at top conferences (CLIP appeared at ICML 2021, while DALL·E was released as a technical report), but their effect on the year’s conferences was immediate.

**The EMNLP 2021 Best Long Paper was a multimodal paper:** Visually Grounded Reasoning across Languages and Cultures by Fangyu Liu and colleagues. It introduced a cross-lingual, cross-cultural visual-reasoning benchmark that asked whether multimodal models truly understood image content or merely fit data from English-language settings. The award reflected an important turn in multimodal research: away from merely building a model that paired text and images, and toward testing whether it remained effective outside English-speaking and Western contexts.

Another effect of CLIP was the rapid appearance of **zero-shot and open-vocabulary** research at computer vision conferences. If CLIP could classify categories it had never seen, could other vision tasks such as detection and segmentation do the same? Researchers began studying that question intensively in 2021, and it became a mainstream computer vision direction in 2022–2023.

## At Their Peak: GNNs and Federated Learning

Two directions reached historic peaks in paper volume in 2021, then began to decline or plateau:

**Graph Neural Networks (GNNs)** remained a major topic across ML conferences. One ICLR 2021 Outstanding Paper, Learning Mesh-Based Simulation with Graph Networks by Tobias Pfaff and colleagues at DeepMind, used graph networks for physical simulation. NeurIPS 2021 likewise included many GNN papers. Cross-conference paper-volume trends place GNN frequency at ICLR, ICML, and NeurIPS near its peak around 2021. The field did not disappear afterward; it changed from an independent hot topic into a tool absorbed by other directions.

**Federated Learning** was also near its peak in 2021. One ICML 2021 Outstanding Paper Honorable Mention, Optimal Complexity in Decentralized Training, studied the theoretical lower bound of decentralized training. NeurIPS 2021 also had one of its largest yearly volumes of federated-learning papers. As with GNNs, paper volume began leveling off after 2021–2022, partly because researchers had already examined many of the core theoretical questions, leaving more work at the engineering and application layers.

## Still Growing Steadily: Reinforcement Learning

**Reinforcement learning (RL)** remained a core direction at NeurIPS and ICML in 2021, but its growth differed from Transformers and diffusion. RL paper volume grew **steadily and linearly**, without a sudden boom or sharp decline.

One NeurIPS 2021 Outstanding Paper, Deep Reinforcement Learning at the Edge of the Statistical Precipice by Rishabh Agarwal and colleagues, directly challenged evaluation practice in RL. It showed that many papers used only three to five random seeds before claiming an algorithm beat a baseline, leaving the result statistically unsupported. Another Outstanding Paper, On the Expressivity of Markov Reward, examined the expressive capacity of MDP reward functions from a theoretical perspective.

AAAI 2021’s other Outstanding Paper, Exploration-Exploitation in Multi-Agent Learning: Catastrophe Theory Meets Game Theory, brought catastrophe theory into the analysis of multi-agent learning.

The defining feature of RL in 2021 was **deeper theory** rather than **broader applications**. Core questions in exploration, evaluation, and multi-agent learning received more rigorous treatment, but RL had not yet found a breakthrough use case comparable to the later application of RLHF.

## Gaining Attention: Fairness, Bias, and Ethics

AI ethics and fairness research became visibly more prominent at major conferences in 2021.

**The ACL 2021 Best Theme Paper was Including Signed Languages in Natural Language Processing**, which directly argued that the NLP community had long neglected signed languages as visual forms of language. NeurIPS 2021 introduced a systematic Ethics Review process for the first time and required every submission to include a broader-impact statement. AAAI 2021 established a special AI for Social Impact track, whose Outstanding Paper was Mitigating Political Bias in Language Models through Reinforced Calibration.

The ACL 2021 Outstanding Papers also included fairness research, including methods for measuring and mitigating gender bias in language models.

The number of fairness, bias, and ethics papers increased substantially in 2021. Unlike Transformers or self-supervised learning, however, much of the growth was **institutionally driven**: conference organizers actively created ethics review, social-impact tracks, theme papers, and related mechanisms that encouraged submissions.

## Award-Winning Papers from 2021 at a Glance

The table below collects the major award winners from nine conferences for quick reference:

| Conference | Award | Paper | Area |
|---|---|---|---|
| ICLR | Outstanding Paper | Score-Based Generative Modeling through SDEs | Diffusion Model |
| ICLR | Outstanding Paper | Learning Mesh-Based Simulation with Graph Networks | GNN / Physical Simulation |
| ICLR | Outstanding Paper | EigenGame: PCA as a Nash Equilibrium | Theory / Game Theory |
| ICLR | Outstanding Paper | Beyond Fully-Connected Layers with Quaternions | Model Compression |
| ICML | Outstanding Paper | Unbiased Gradient Estimation in Unrolled Computation Graphs with PES | Optimization / Meta-Learning |
| ICML | Honorable Mention | Understanding Self-Supervised Learning Dynamics without Contrastive Pairs | Self-Supervised Learning |
| ICML | Honorable Mention | Optimal Complexity in Decentralized Training | Decentralized / FL |
| NeurIPS | Outstanding Paper | A Universal Law of Robustness via Isoperimetry | Theory / Robustness |
| NeurIPS | Outstanding Paper | MAUVE: Measuring the Gap Between Neural Text and Human Text | Text-Generation Evaluation |
| NeurIPS | Outstanding Paper | Deep RL at the Edge of the Statistical Precipice | RL Evaluation Methodology |
| CVPR | Best Paper | GIRAFFE: Compositional Generative Neural Feature Fields | 3D Generation / NeRF |
| CVPR | Honorable Mention | Exploring Simple Siamese Representation Learning | Self-Supervised Learning |
| ICCV | Best Paper | Swin Transformer | Vision Transformer |
| ICCV | Honorable Mention | Mip-NeRF | 3D / NeRF |
| ACL | Best Paper | Vocabulary Learning via Optimal Transport for NMT | Machine Translation |
| ACL | Best Theme | Including Signed Languages in NLP | Language Diversity |
| EMNLP | Best Long Paper | Visually Grounded Reasoning across Languages and Cultures | Multimodal / Multilingual |
| AAAI | Outstanding Paper | Informer: Beyond Efficient Transformer for Long Sequence Forecasting | Transformer / Time Series |
| AAAI | Outstanding Paper | Exploration-Exploitation in Multi-Agent Learning | Multi-Agent / Game Theory |

## Looking Back from 2026: Which Bets Produced the Highest Returns?

If a researcher chose a direction at the beginning of 2021, the return by 2026—measured by citations, follow-up work, and industry impact—varied enormously.

**Highest-return directions:**

- **Diffusion models:** Researchers who entered in 2021 gained a first-mover advantage. After Stable Diffusion and DALL·E 2 broke out in 2022, foundational work from 2021, including score-based SDEs and classifier guidance, became highly cited. Yang Song’s ICLR 2021 Outstanding Paper had accumulated more than 4,000 citations by 2026.
- **Vision Transformers:** Swin Transformer became the most widely used computer vision backbone over the following two years and accumulated more than 15,000 citations. Researchers studying ViT variants in 2021 caught the wave.
- **Multimodal learning:** The vision-language direction driven by CLIP continued to expand from 2022 through 2025 and became a foundation for multimodal models such as GPT-4V and Gemini.

**Stable without an explosion:**

- **Self-supervised learning:** After 2022, the approach of pretraining large models directly on vast datasets partly displaced the independent self-supervised-learning narrative. The direction did not vanish; it was absorbed into the broader story of foundation models.
- **Reinforcement learning:** RL continued to grow steadily, but its breakthrough application—RLHF for ChatGPT—did not arrive until InstructGPT in 2022. How much researchers working on RL theory in 2021 benefited depended on whether they followed the RLHF branch.

**Already past their peak:**

- **GNNs:** 2021 was the peak, after which paper volume leveled off. The direction did not die, but it ceased to be an independent hot track and increasingly became a tool for applications such as molecular modeling and recommender systems.
- **Federated learning:** Like GNNs, most theoretical questions had been explored by the end of 2021, leaving work that leaned more toward engineering and deployment.
- **Traditional GAN improvements:** Once diffusion models showed they could beat GANs, the volume of papers devoted solely to improving GAN architectures declined visibly.

**The conclusion is direct:** the ICLR 2021 Outstanding Paper on diffusion models and the ICCV 2021 Best Paper on Swin Transformer proved to be the starting points for two of the most influential directions of the next four years. In these two cases, the award committees judged accurately. The winning papers were not merely strong work in their year; they were signals with predictive power for subsequent research.

---

## References

- [ICLR 2021 Outstanding Paper Awards (official announcement on ICLR’s Medium)](https://iclr-conf.medium.com/announcing-iclr-2021-outstanding-paper-awards-9ae0514734ab)
- [NeurIPS 2021 Award Recipients (official announcement)](https://blog.neurips.cc/2021/11/30/announcing-the-neurips-2021-award-recipients/)
- [ICML 2021 Awards (official page)](https://icml.cc/virtual/2021/awards_detail)
- [CVPR 2021 Paper Awards (official page)](https://cvpr2021.thecvf.com/node/329)
- [ICCV 2021 Paper Awards (official page)](https://iccv2021.thecvf.com/iccv-2021-paper-awards)
- [ACL 2021 Paper Awards (official page)](https://2021.aclweb.org/program/accept)
- [EMNLP 2021 Best Long Paper: Visually Grounded Reasoning across Languages and Cultures (ACL Anthology)](https://aclanthology.org/2021.emnlp-main.818)
- [AAAI 2021 Outstanding and Distinguished Papers (official page)](https://aaai.org/conference/aaai/aaai-21/aaai-outstanding-and-distinguished-papers/)
- [Khanbayov et al. (2026), "Topical Phase Transitions in Artificial Intelligence Research: Large-Scale Evidence and an Early-Warning Signature for Emerging Topics" (arXiv:2606.12828; cross-conference topic analysis of 80,814 main-track papers)](https://arxiv.org/abs/2606.12828)
- [SarahRastegar/Best-Papers-Top-Venues (GitHub compilation of Best Papers by conference and year)](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Dhariwal & Nichol (2021), "Diffusion Models Beat GANs on Image Synthesis" (NeurIPS 2021)](https://arxiv.org/abs/2105.05233)
- [Radford et al. (2021), "Learning Transferable Visual Models From Natural Language Supervision" (CLIP, ICML 2021)](https://arxiv.org/abs/2103.00020)
