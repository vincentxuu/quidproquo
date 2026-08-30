---
title: "What Topics Dominated the Top AI Conferences of 2023? The Year LLMs Rewrote the Research Agenda"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2023", topic-analysis, llm, rlhf, hallucination, agent, 3d-gaussian-splatting]
lang: en
tldr: "2023 was the first year in which LLMs comprehensively rewrote the AI research agenda. DPO received a NeurIPS Outstanding Paper Runner-Up award, ReAct became an ICLR Oral, and hallucination grew from a marginal term into a major track at every conference. Meanwhile, 3D Gaussian Splatting swept through computer vision after its SIGGRAPH debut, Mamba emerged at the end of the year to challenge the Transformer attention monopoly, and publication volume for traditional NLP pipelines began a clear decline."
description: "A review of award-winning papers and topic distributions across nine major AI conferences in 2023. It analyzes how LLMs reshaped submission patterns: the explosion of alignment and DPO, hallucination, RAG, agents, and tool use; the emergence of multimodal LLMs and 3D Gaussian Splatting; the decline of task-specific NLP and pure NeRF research; and, looking back from 2026, which directions delivered the highest returns."
draft: false
series:
  name: "AI Conference Guide"
  order: 17
glossary:
  - term: "DPO (Direct Preference Optimization)"
    definition: "An alignment method that bypasses reward-model training and optimizes a language model directly on preference data. It received an Outstanding Paper Runner-Up award at NeurIPS 2023 and became a mainstream alternative for LLM alignment starting in 2024."
    context: "RLHF was still overwhelmingly dominant when the DPO paper appeared in 2023. DPO achieved similar results through a mathematically equivalent but much simpler implementation."
  - term: "3D Gaussian Splatting (3DGS)"
    definition: "A 3D reconstruction method that represents a scene with large numbers of 3D Gaussian functions and uses differentiable rasterization for real-time rendering, challenging the dominance of NeRF's implicit representations."
    context: "Published at SIGGRAPH 2023, it immediately became a major submission topic at top computer vision conferences."
  - term: "Mamba"
    definition: "A sequence-modeling architecture based on selective state space models (Selective SSMs). It has linear-time complexity and was the first non-attention model to genuinely match Transformer quality in language modeling."
    context: "Its preprint appeared in December 2023 and became a landmark challenge to the Transformer attention monopoly."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2023-topics)

Something rare happened at the top AI conferences of 2023: a single product—ChatGPT—reordered an entire field's research agenda within a year. ChatGPT launched in November 2022, and 2023 was the first full calendar year of its influence on academia. Look through the year's award-winning papers and submission keywords, and the landscape is entirely different from 2022. LLM alignment jumped from a niche topic into the mainstream. Hallucination went from a marginal term to a major track at nearly every conference. Agents and tool use moved from concepts toward working implementations. At the same time, the volume of papers on traditional task-specific NLP pipelines began a clear decline.

## The hottest topics: LLM alignment, evaluation, and safety

The most common cluster of keywords across conferences in 2023 was **LLM alignment / RLHF / DPO**: the broad research program devoted to making large language models act according to human intent.

**DPO (Direct Preference Optimization) received a NeurIPS 2023 Outstanding Paper Runner-Up award.** The method, developed by Stanford's Rafael Rafailov, Chelsea Finn, and coauthors, bypasses reward-model training and optimizes the language model directly from preference data. DPO's mathematical insight is simple: the RLHF objective can be rewritten as a loss function that requires no explicit reward model, greatly reducing the engineering complexity of alignment training. The paper became one of the most highly cited methods in LLM alignment in 2024–2025 and directly inspired a series of variants, including SimPO, IPO, and KTO.

Another **NeurIPS Outstanding Paper, "Are Emergent Abilities of Large Language Models a Mirage?"** by Rylan Schaeffer, Sanmi Koyejo, and coauthors challenged the LLM capability narrative from the opposite direction. Through mathematical models and experiments, the authors argued that apparent "emergent abilities" might simply be artifacts of metric choice: nonlinear metrics produce apparent discontinuities, while linear metrics show smooth improvement. The paper provoked intense academic debate because it directly challenged one of the most exciting claims in the scaling-laws narrative.

**LLM evaluation and trustworthiness** were also central at NeurIPS 2023. **Outstanding Datasets and Benchmarks Paper "DecodingTrust"**, by Boxin Wang, Dawn Song, Bo Li, and coauthors, evaluated GPT-4 and GPT-3.5 across eight dimensions of trustworthiness, including toxicity, bias, adversarial robustness, and privacy leakage. It found GPT-4 more reliable on standard tests but more vulnerable than GPT-3.5 to jailbreak prompts. The paper's proposed explanation was that GPT-4 follows instructions more precisely, including misleading ones.

**ICML 2023 Outstanding Paper "A Watermark for Large Language Models,"** by the University of Maryland's John Kirchenbauer, Tom Goldstein, and coauthors, addressed LLM safety from another angle. The authors proposed a verifiable watermark for LLM-generated text that makes AI output detectable without significantly harming generation quality. That was particularly meaningful amid the flood of AI-generated content in 2023.

## Hallucination: from a marginal term to a standard track at every conference

Before 2023, hallucination at AI conferences was largely a subtopic within summarization. After 2023, it became a central problem with dedicated sessions at nearly every major conference.

**EMNLP 2023** received a large number of hallucination-related papers. FLARE, or Forward-Looking Active REtrieval Augmented Generation, was a representative example. It proposed triggering retrieval during generation whenever the model had low confidence in the next sentence, instead of retrieving only once at the beginning. The idea of dynamic retrieval during generation directly influenced later RAG system designs.

**ACL 2023** reflected the same trend. One Best Paper, "Do Androids Laugh at Electric Sheep?" by Jack Hessel, Yejin Choi, and coauthors, used The New Yorker Caption Contest to test LLM humor understanding, exposing systematic weaknesses on tasks that require commonsense reasoning and cultural background. Another Best Paper, "From Pretraining Data to Language Models to Downstream Tasks" by Shangbin Feng, Yulia Tsvetkov, and coauthors, traced how political bias travels from pretraining data into downstream models, directly engaging with questions of LLM trustworthiness.

A quantitative study by Movva et al. at NAACL 2024 modeled topics across 16,979 LLM-related arXiv papers. It found that the fastest-growing topics in 2023 were "Applications of LLMs/ChatGPT," which grew eightfold, and "Societal Implications of LLMs," which grew fourfold. Hallucination research expanded rapidly alongside them as a core subset of those topics.

## Agents and tool use: from concepts to working frameworks

2023 was the year AI agents moved from concepts toward engineering.

**ICLR 2023 selected ReAct as an Oral paper (top 5%).** ReAct, short for Reasoning + Acting, was introduced by Yao and coauthors. It lets an LLM alternate between reasoning and action: reasoning traces help the model plan and handle exceptions, while actions give it access to external tools such as the Wikipedia API. On benchmarks including HotpotQA and WebShop, ReAct substantially outperformed pure imitation-learning and RL methods. The paper became a theoretical foundation for later agent frameworks such as LangChain and AutoGPT.

The arXiv ecosystem saw a rapid succession of agent projects in 2023: AutoGPT in March, BabyAGI in April, Voyager in May as a NeurIPS 2023 submission, and Stanford's "small-town simulation," Generative Agents, which was also submitted to a 2023 conference. Many were preprints rather than formally published conference papers, but their influence spread rapidly through the open-source community. They directly changed the submission agenda for major conferences in 2024, turning agents from a "possible future direction" into a popular field with dedicated tracks or workshops at nearly every conference.

## RAG: from an academic concept to an engineering default

Lewis and coauthors at Meta introduced the original Retrieval-Augmented Generation paper in 2020, but RAG did not truly move from an academic concept to an engineering default until 2023. The immediate reason was that ChatGPT exposed the problems of LLM knowledge cutoffs and hallucination, while RAG was seen as the most practical remedy.

RAG papers at the major conferences of 2023 covered several dimensions:

- **Multi-hop retrieval:** how to retrieve effectively for questions that require several reasoning hops.
- **Active retrieval:** methods such as FLARE that decide dynamically when to retrieve during generation.
- **Retrieval-quality evaluation:** how to determine whether retrieved documents are actually useful and avoid introducing noise.

One **EMNLP 2023** Best Paper, "Label Words are Anchors: An Information Flow Perspective for Understanding In-Context Learning," by Lean Wang, Lei Li, and coauthors, explained in-context learning through information flow. It was not directly a RAG paper, but its account of how models use contextual information directly influenced prompt design in RAG systems.

## Emerging directions: multimodal LLMs, 3D Gaussian Splatting, and Mamba

### Multimodal LLMs

When GPT-4 launched in March 2023, it claimed visual-understanding capabilities. That same year saw a wave of open multimodal LLMs, including LLaVA (Visual Instruction Tuning), MiniGPT-4, and InstructBLIP. Most appeared at 2023 conferences as preprints or workshop papers; they did not enter main conference tracks at scale until 2024. Still, 2023 marked the beginning of the direction.

**ICLR 2023 Outstanding Paper "DreamFusion: Text-to-3D using 2D Diffusion,"** by Google's Ben Poole, Jonathan Barron, and coauthors, used priors from a 2D diffusion model to generate 3D objects without any 3D training data. It marked the point at which multimodal text-to-3D generation began to receive serious attention.

### 3D Gaussian Splatting

**3D Gaussian Splatting, published at SIGGRAPH 2023 in ACM TOG,** by Bernhard Kerbl, George Drettakis, and coauthors at INRIA, was one of the most important methodological breakthroughs in computer vision in 2023. It represented scenes with millions of 3D Gaussian functions and used differentiable tile-based rasterization to synthesize novel 1080p views in real time at at least 30 fps. Its quality matched Mip-NeRF 360, while training time fell from 48 hours to 35–45 minutes and rendering improved from 10 seconds per frame to real time.

3DGS was not published at a conventional top AI conference; it came through the graphics community. Its impact on computer vision conferences became fully visible in 2024, when CVPR and ECCV featured large numbers of papers based on 3DGS and the share of pure NeRF papers began a clear decline.

### Mamba and state space models

Albert Gu and Tri Dao released the **Mamba** preprint in December 2023. Based on selective state space models, or Selective SSMs, Mamba was the first linear-time sequence model to genuinely match Transformer quality in language modeling. Mamba-3B outperformed Pythia-3B on commonsense reasoning and even approached Pythia-7B, while achieving five times the inference throughput of a similarly sized Transformer.

It was a major advance after S4, or Structured State Spaces for Sequence Modeling, received an ICLR 2022 Honorable Mention. Mamba offered the first credible experimental evidence for the hypothesis that the Transformer was not the only viable option. Whether it could ultimately replace the Transformer remained fiercely debated in 2024–2025. When Mamba-2 appeared at ICML 2024, its title stated the point directly: "Transformers are SSMs."

## Computer vision: Segment Anything and ControlNet redefine foundation models

Two landmark events in computer vision in 2023 came from **ICCV 2023**.

**ControlNet**, by Lvmin Zhang and Maneesh Agrawala, received one of the ICCV 2023 **Best Paper awards (Marr Prize)**. ControlNet adds spatial conditioning—edges, depth, pose, and more—to pretrained text-to-image systems such as Stable Diffusion. It lets users control generated results precisely without retraining the large model. Its zero-convolution design ensures that fine-tuning introduces no harmful noise, and it quickly became a standard component in image-generation workflows.

**Segment Anything (SAM),** by Alexander Kirillov, Ross Girshick, and coauthors at Meta, received an ICCV 2023 **Honorable Mention**. SAM used a dataset of 11 million images and one billion masks to train a general-purpose model for zero-shot segmentation through prompts such as points, boxes, and text. Its zero-shot performance often matched or exceeded fully supervised methods. In effect, SAM extended the idea of a "foundation model" from language to visual segmentation.

The **CVPR 2023** Best Papers likewise reflected the movement of LLM ideas into computer vision. **Visual Programming**, by Tanmay Gupta at AI2, composed existing vision modules with code to perform complex visual reasoning without additional training, following the same line of thought as LLM tool use. Another Best Paper, **Planning-oriented Autonomous Driving**, by Yihan Hu, Jifeng Dai, and coauthors, reframed autonomous driving around end-to-end planning.

The CVPR 2023 Best Student Paper Honorable Mention went to **DreamBooth**, by Nataniel Ruiz at Google, which lets users fine-tune a text-to-image model on a few pictures to generate images of a specific subject. It was a defining work in personalized AI generation in 2023.

## ML theory and foundations: strong work beyond LLMs

Although LLMs dominated the media narrative in 2023, a substantial share of award-winning papers at machine learning conferences still addressed foundational theory:

- **NeurIPS 2023 Outstanding Paper "Privacy Auditing with One (1) Training Run"** by Thomas Steinke at Google DeepMind introduced a way to audit differentially private systems with a single training run. By adding or removing training examples in parallel, it reduced an audit that once required hundreds of trained models to just one.
- **ICML 2023 Outstanding Paper "Learning-Rate-Free Learning by D-Adaptation"** by Aaron Defazio at FAIR introduced an adaptive method that requires no learning-rate hyperparameter tuning.
- **ICML 2023 Outstanding Paper "Generalization on the Unseen, Logic Reasoning and Degree Curriculum"** by Emmanuel Abbe at EPFL/Apple used a degree curriculum to teach logical reasoning that generalized to unseen cases.
- **ICLR 2023 Outstanding Paper "Rethinking the Expressive Power of GNNs via Graph Biconnectivity"** by Bohang Zhang and Di He reexamined GNN expressiveness through graph biconnectivity and found that most existing GNN architectures could not learn those basic measures.
- **AAAI 2023 Outstanding Paper "Misspecification in Inverse Reinforcement Learning"** by Joar Skalse and Alessandro Abate analyzed how inverse reinforcement learning fails when the environment model is misspecified.

These papers are a useful reminder: the media attention around LLMs did not mean that all ML research had moved to LLMs. Fundamental problems in privacy, optimization theory, graph learning, and reinforcement learning continued to earn recognition at the highest level.

## Saturated or declining directions

### Traditional NLP pipelines

The clearest area of contraction in 2023 was **traditional task-specific NLP methods**. Before ChatGPT, the dominant pattern in NLP research was to define a particular task—NER, sentiment analysis, relation extraction, and so on—design a specialized model, and improve its score on a specific benchmark. After 2023, more of these tasks were shown to be solvable directly with the zero-shot or few-shot capabilities of general-purpose LLMs. The quality bar for papers in these areas rose sharply. Such work remained possible, but authors now had to show that their method was better, cheaper, or offered some other specific advantage over simply using GPT-4 on that task.

The analysis of 17,000 arXiv papers cited earlier confirmed the trend. Research topics related to BERT and task-specific architectures clearly contracted in 2023, driven by "centralization around newer models (e.g., GPT-4 and LLaMA)."

### Pure NeRF research

NeRF saw explosive growth for three years from 2020 to 2022, including more than 25 NeRF papers at ICCV 2021 alone. The arrival of 3D Gaussian Splatting in 2023 began to change the landscape. At comparable quality, 3DGS trained dozens of times faster and rendered in real time. Starting in 2024, papers that aimed to improve NeRF increasingly had to explain why they did not use 3DGS. Pure NeRF methods did not disappear, but the space for incremental NeRF improvements narrowed.

### Pure benchmark gaming

Another trend in 2023 was the acceleration of academic skepticism toward **benchmark gaming**. NeurIPS 2023's "Are Emergent Abilities a Mirage?" was emblematic: it questioned not only emergent abilities in LLMs, but the reliability of the entire research paradigm of optimizing a particular metric on a particular benchmark. ACL 2023 also featured several critical papers on evaluation methodology. That skepticism intensified in 2024 and ultimately helped produce more diverse evaluation frameworks, including HELM and MMLU-Pro.

## Overview of award-winning papers across the 2023 conferences

| Conference | Award | Paper | Area |
|---|---|---|---|
| NeurIPS | Outstanding Paper | Privacy Auditing with One Training Run | Differential privacy |
| NeurIPS | Outstanding Paper | Are Emergent Abilities of LLMs a Mirage? | LLM evaluation |
| NeurIPS | Outstanding Runner-Up | Scaling Data-Constrained Language Models | Scaling laws |
| NeurIPS | Outstanding Runner-Up | Direct Preference Optimization (DPO) | LLM alignment |
| NeurIPS | Outstanding D&B | DecodingTrust | LLM trustworthiness |
| NeurIPS | Outstanding D&B | ClimSim | AI for Science |
| NeurIPS | Test of Time | Word2Vec (2013) | Word embeddings |
| ICML | Outstanding Paper | Learning-Rate-Free Learning by D-Adaptation | Optimization |
| ICML | Outstanding Paper | A Watermark for Large Language Models | LLM safety |
| ICML | Outstanding Paper | Generalization on the Unseen | Generalization theory |
| ICML | Outstanding Paper | Adapting to Game Trees | Game theory |
| ICML | Outstanding Paper | Self-Repellent Random Walks | Sampling theory |
| ICML | Outstanding Paper | Bayesian Design Principles | Sequential learning |
| ICLR | Outstanding Paper | DreamFusion: Text-to-3D | Multimodal generation |
| ICLR | Outstanding Paper | Rethinking GNN Expressive Power | Graph neural networks |
| ICLR | Outstanding Paper | Emergence of Maps in Blind Agents | Embodied AI |
| ICLR | Outstanding Paper | Visual Token Matching | Few-shot learning |
| ICLR | Honorable Mention | Mastering No-Press Diplomacy | Multi-agent RL |
| ICLR | Honorable Mention | Contrastive vs Non-Contrastive SSL Duality | Self-supervised learning |
| CVPR | Best Paper | Visual Programming | Visual reasoning |
| CVPR | Best Paper | Planning-oriented Autonomous Driving | Autonomous driving |
| CVPR | Best Student Paper HM | DreamBooth | Personalized generation |
| ICCV | Marr Prize | Passive Ultra-Wideband Single-Photon Imaging | Computational photography |
| ICCV | Marr Prize | ControlNet | Controllable generation |
| ICCV | Honorable Mention | Segment Anything (SAM) | Vision foundation models |
| ICCV | Honorable Mention | Tracking Everything Everywhere All at Once | Video tracking |
| AAAI | Outstanding Paper | Misspecification in Inverse RL | Reinforcement learning theory |
| IJCAI | Distinguished Paper | Levin Tree Search with Context Models | Search algorithms |
| IJCAI | Distinguished Paper | SAT-Based PAC Learning of DL Concepts | Knowledge representation |

## Compared with 2022

| Dimension | 2022 | 2023 | Change |
|---|---|---|---|
| Hottest keywords | Diffusion Model, Scaling Laws | LLM Alignment, Hallucination | From "how to scale" to "how to control" |
| Emerging challengers | Chain-of-Thought, InstructGPT | Agents/Tool Use, Multimodal LLMs | From reasoning techniques to autonomous action |
| Main CV trend | Commercialization of Text-to-Image | Control and foundation models through ControlNet + SAM | From "can generate" to "can control" |
| 3D representations | Continued NeRF boom | 3DGS challenges NeRF | The paradigm shift from implicit to explicit representations begins |
| Declining directions | Diffusion replaces GANs | LLMs compress task-specific NLP | A redefinition of the entire NLP subfield |
| NeurIPS submissions | 10,411 | 12,343 (+18.6%) | Continued rapid growth |
| Academic mood | Excitement on the eve of ChatGPT | Anxiety and repositioning after ChatGPT | "Does my research direction still matter?" |

## Looking back from 2026: which directions delivered the highest returns?

1. **DPO / preference-alignment methods**—The 2023 DPO paper launched an entire research line on alignment without RL. By 2025, it had produced dozens of variants and become a standard step in LLM training. Researchers who chose this direction saw considerable submission and citation volume in 2024–2025.

2. **3D Gaussian Splatting**—From one SIGGRAPH paper in 2023 to hundreds of related papers at every major computer vision conference in 2025, 3DGS became one of the fastest-growing recent subfields in computer vision. Researchers who entered early gained substantial first-mover advantages.

3. **Agent frameworks and evaluation**—Foundational papers such as ReAct and Toolformer in 2023 helped produce an enormous ecosystem of agent benchmarks and multi-agent systems in 2024–2025. Demand from industry, which needs reliable AI agents, remains strong.

4. **Mamba / SSMs**—Mamba did not replace the Transformer in 2024–2025, but it opened a durable research line around the idea that attention was not the only option. Hybrid attention + SSM architectures became a major research topic in 2025–2026.

5. **LLM evaluation / hallucination detection**—The LLM evaluation research that surged in 2023 remained one of the easiest areas to publish in and one of the most stable sources of demand in 2026, because every new model release required a new evaluation.

By contrast, researchers who invested in "improving BERT-based task-specific models" or "incremental improvements to pure NeRF" in 2023 faced pressure to change directions in 2024–2025.

## Overall

2023 was the year an external product shock rewrote the AI research agenda. ChatGPT changed more than the public's perception of AI: it changed what researchers submitted, what reviewers expected, and how conferences organized their tracks. NeurIPS 2023 received 12,343 submissions, 18.6% more than in 2022, and the share of LLM-related papers rose sharply.

Yet the distribution of award-winning papers offers an important reminder: LLMs did not absorb all of academia's highest recognition. Privacy auditing, optimization theory, GNN expressiveness, game theory, and computational photography—foundational work with no direct connection to LLMs—continued to win top awards. The lesson for researchers in 2023 may have been that following the LLM trend made it easier to attract reviewers' attention, but a true Outstanding Paper was still judged by the depth of its problem and the elegance of its solution, not by whether it concerned ChatGPT.

---

## References

- [NeurIPS 2023 Paper Awards (official announcement)](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards/)
- [NeurIPS 2023 Press Release (official PDF, including submission and acceptance figures)](https://media.neurips.cc/Conferences/NeurIPS2023/NeurIPS2023-Press_Release.pdf)
- [ICML 2023 Awards (official page)](https://icml.cc/Conferences/2023/Awards)
- [ICLR 2023 Outstanding Paper Awards (official announcement)](https://blog.iclr.cc/2023/03/21/announcing-the-iclr-2023-outstanding-paper-award-recipients/)
- [ICLR 2023 Press Release (official PDF)](https://iclr.cc/media/Press/ICLR_2023_Press_Release.pdf)
- [ACL 2023 Best Papers (official page)](https://2023.aclweb.org/program/best_papers/)
- [EMNLP 2023 Best Papers (official page)](https://2023.emnlp.org/program/best_papers/)
- [CVPR 2023 Awards (official page)](https://cvpr.thecvf.com/Conferences/2023/Awards)
- [ICCV 2023 Best Paper (Marr Prize)—official IEEE TCPAMI record](https://tc.computer.org/tcpami/awards/iccv-paper-awards/)
- [AAAI 2023 Paper Awards (official PDF)](https://aaai-23.aaai.org/wp-content/uploads/2023/02/AAAI-23-Paper-Awards-1.pdf)
- [IJCAI 2023 Distinguished Paper Awards](https://ijcai-23.org/distinguished-paper-awards/index.html)
- [Rafailov et al. (2023), "Direct Preference Optimization: Your Language Model is Secretly a Reward Model"](https://arxiv.org/abs/2305.18290)
- [Schaeffer et al. (2023), "Are Emergent Abilities of Large Language Models a Mirage?"](https://arxiv.org/abs/2304.15004)
- [Yao et al. (2023), "ReAct: Synergizing Reasoning and Acting in Language Models"](https://arxiv.org/abs/2210.03629)
- [Kerbl et al. (2023), "3D Gaussian Splatting for Real-Time Radiance Field Rendering," ACM TOG (SIGGRAPH 2023)](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [Gu & Dao (2023), "Mamba: Linear-Time Sequence Modeling with Selective State Spaces"](https://arxiv.org/abs/2312.00752)
- [Kirillov et al. (2023), "Segment Anything"](https://arxiv.org/abs/2304.02643)
- [Zhang et al. (2023), "Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)"](https://arxiv.org/abs/2302.05543)
- [Movva et al. (2024), "Topics, Authors, and Institutions in Large Language Model Research: Trends from 17K arXiv Papers," NAACL 2024](https://aclanthology.org/2024.naacl-long.67/)
- [Jiang et al. (2023), "Active Retrieval Augmented Generation (FLARE)," EMNLP 2023](https://aclanthology.org/2023.emnlp-main.495/)
