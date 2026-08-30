---
title: "Who Submits to Top AI Conferences: Labs, Companies, and the Global Map"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-lab, industry-research, academia, neurips, china-ai]
lang: en
tldr: "The institutional map of top AI conferences is being rapidly redrawn. Industry labs dominate frontier model development—nearly 90% of notable models came from industry in 2024—but academia remains the largest source of highly cited research. Chinese universities went from challengers to nearly half of NeurIPS paper volume in five years, while OpenAI and Anthropic have nearly vanished from conference author lists. The decoupling of publication volume from research capability is the defining signal."
description: "A cross-check of AIRankings, CSRankings, and the Stanford AI Index reveals who publishes at top AI conferences: the division of roles between industry and academia, Chinese universities' five-year rise, affiliations behind Best Paper awards, and why companies such as OpenAI have largely disappeared from conference proceedings."
draft: false
series:
  name: "AI 頂會導讀"
  order: 4
glossary:
  - term: "CSRankings"
    definition: "A university ranking created by UMass Amherst professor Emery Berger, based entirely on first- and corresponding-author counts in the DBLP database for top-conference papers. It does not use citations or reputation surveys."
    context: "CSRankings complements AIRankings, but excluding ICLR produces different rankings."
  - term: "AIRankings"
    definition: "An institutional ranking covering major AI conferences including NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ICCV, and ECCV, weighted by each author's fractional contribution to a paper."
    context: "Its 2024 data ranks Peking University first and Tsinghua University second."
  - term: "notable model"
    definition: "A category used in Stanford HAI's AI Index Report for AI models that Epoch AI judges worth tracking because of their technical capability, influence, or novelty."
    context: "Nearly 90% of notable models came from industry in 2024, while academia still led in highly cited papers."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-who-submits)

The [previous article](/posts/ai/2026-08-23-what-is-ai-top-conference-en) described the criteria for a "top conference" and listed the representative venues. This article asks a more concrete question: who actually writes the papers at those conferences?

The answer underwent a structural reorganization between 2021 and 2025.

## Reading the Two Ranking Systems

Two rankings are most often cited when tracking institutional affiliations in top AI conference papers:

- **AIRankings** (airankings.org) covers NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ICCV, ECCV, and others, weighting papers by each author's fractional contribution.
- **CSRankings** (csrankings.org), created by UMass Amherst professor Emery Berger, uses DBLP publication counts and includes only first and corresponding authors.

The largest methodological difference is that CSRankings's "Machine Learning" category includes only NeurIPS, ICML, and KDD, excluding ICLR just as the CCF ranking discussed in the previous article does. AIRankings includes ICLR. That difference materially changes the results because ICLR currently has the second-highest h5-index among ML conferences, behind only NeurIPS.

A third essential source is Stanford HAI's annual **AI Index Report**. It does not rank institutions, but tracks industry's and academia's shares of papers, the origin of notable models, and regional statistics. It is the most authoritative source for ecosystem-level changes.

## Institutional Rankings: Five Years of Movement by Chinese Universities

In AIRankings's cumulative data through 2025, the leading institutions by top-conference AI papers are:

| Rank | Institution | Country/region | Type |
|---|---|---|---|
| 1 | Carnegie Mellon University | United States | Academic |
| 2 | Peking University | China | Academic |
| 3 | Tsinghua University | China | Academic |
| 4 | MIT | United States | Academic |
| 5 | Stanford University | United States | Academic |
| 6 | UC Berkeley | United States | Academic |
| 7 | Zhejiang University | China | Academic |
| 8 | KAIST | South Korea | Academic |
| 9 | University of Oxford | United Kingdom | Academic |
| 10 | Chinese Academy of Sciences | China | Academic/research institute |
| 11 | Nanyang Technological University | Singapore | Academic |
| 12 | University of Maryland | United States | Academic |
| 13 | UC San Diego | United States | Academic |
| 14 | ETH Zurich | Switzerland | Academic |
| 15 | University of Toronto | Canada | Academic |
| 16 | Shanghai Jiao Tong University | China | Academic |
| 17 | University of Tokyo | Japan | Academic |
| 18 | University of Washington | United States | Academic |

Several structures stand out.

**Chinese institutions occupy five places near the top**: Peking, Tsinghua, Zhejiang, the Chinese Academy of Sciences, and Shanghai Jiao Tong. Such a share was difficult to imagine before 2020. Citing AIRankings, the South China Morning Post reported that Peking University has ranked first worldwide in annual AI paper output since 2022. The 2024 order was Peking, Tsinghua, Zhejiang, CMU, then the Chinese Academy of Sciences. The Stanford Review put the change starkly: the United States outpublished China 5:1 at ICLR in 2021, but the two were nearly even by 2025, with the same trend at NeurIPS and ICML.

**Corporate labs do not appear in this table** because AIRankings and CSRankings both count only academic institutions. Google DeepMind, Meta FAIR, and Microsoft Research publish substantial numbers of papers, but their output must be measured through NeurIPS data or third-party analyses.

## The NeurIPS 2025 Institutional Map: Companies Come into View

Late in 2025, Meta Chief AI Scientist Yann LeCun prompted broad discussion by sharing a chart of the top 50 institutions represented among accepted NeurIPS 2025 papers.

**On the US side**, the leaders included Google DeepMind, AI at Meta (FAIR), Stanford, Microsoft, CMU, and MIT. Corporate labs and elite universities alternated near the top, showing how frontier research moved from university-centered work toward corporate-lab leadership.

**On the Chinese side**, the leaders were Tsinghua, the Chinese Academy of Sciences, Peking University, Shanghai Jiao Tong, and HKUST (Guangzhou), almost entirely universities and government-supported institutes.

**China's total share approached 50%.** According to 36kr, among 5,526 accepted NeurIPS 2025 papers, Google barely retained first place at 4.84%; Tsinghua followed at 4.73%, a gap of only 0.11 points, while Peking tied for third at 3.63%.

LeCun highlighted two further points:

- Singapore, represented by NUS and NTU, and South Korea, represented by KAIST, performed exceptionally relative to their national scale.
- Europe was surprisingly faint. Only institutions in Switzerland, led by ETH Zurich, and the United Kingdom appeared in the top 50; the EU-27 was nearly absent.

## Publication Is Not Research Capability: OpenAI and Anthropic's Strategic Absence

LeCun's post also called out the "notable absence of others (OpenAI, Anthropic)." Their NeurIPS 2025 publication counts were too low to make the top 50.

This is not new. OpenAI sharply reduced top-conference publishing around 2023, and Anthropic has never emphasized volume. The scale is still worth quantifying. Stanford HAI's 2025 and 2026 AI Index Reports confirm that OpenAI remained the world's largest producer of notable models in 2025 with 20, followed by Google with 14 and Alibaba with 11.

In other words, **OpenAI publishes almost no conference papers while producing more notable AI models than any other institution.** Publication volume and research capability have become maximally decoupled at these companies.

Why? Some participants in the NeurIPS 2025 discussion put it bluntly: "silence in this industry is currently a strategic choice to protect trade secrets, whereas high publication counts from Big Tech often simply reflect a corporate strategy to flood conferences with research that serves as a recruiting tool rather than a product roadmap." Publishing recruits; silence protects trade secrets. Google and Meta continue to publish because DeepMind and FAIR retain academic missions partly independent of product teams. OpenAI and Anthropic do not carry the same institutional history.

**Supporting evidence from the Foundation Model Transparency Index:** Stanford's FMTI shows OpenAI falling from 49 in 2024 to 35 in 2025, Meta from 60 to 31, and Mistral from 55 to 18. Reduced publication is part of a wider decline in transparency.

## Industry Versus Academia: A Structural Split

Stanford HAI's AI Index Report has repeated the same headline finding for three years, from 2024 through 2026:

> Industry continues to make significant investments in AI and leads in notable AI model development, while academia leads in highly cited research.

The figures are concrete:

- **Origin of notable models:** Nearly 90% came from industry in 2024, up from 60% in 2023. Epoch AI tracked 93 industry models in 2025 and only two from academia.
- **Highly cited papers:** Academia remained the largest single source of top-100 cited papers over the preceding three years.
- **All AI papers across fields:** By region in 2023, academia produced 75.61% of US papers and industry 16.49%; in China, academia produced 84.45% and industry 8.02%. Chinese AI research is driven overwhelmingly by academia, far more than in the United States.

The split means that "Who advances frontier models?" yields Google, OpenAI, Anthropic, and Meta. "Who produces high-quality research papers?" yields CMU, Peking, Tsinghua, and Stanford. The two answers barely overlap.

## Best Papers: Dominated by Large Labs, or Open to Small Teams?

Best Paper is a conference's highest honor. NeurIPS usually selects only two to four Best Papers and two or three runners-up each year. Affiliations reveal where work judged to be of the highest quality originates.

Across NeurIPS, ICML, and ICLR from 2021 to 2025:

**NeurIPS**

- 2024: **Tsinghua + ByteDance** won Best Paper for Visual Autoregressive Modeling, the first headline NeurIPS Best Paper for Chinese institutions. Another Best Paper came from Google DeepMind and several universities.
- 2025: Best Papers came from Qwen/Alibaba for Gated Attention and Princeton + CMU for 1000 Layer Networks for Self-Supervised RL. The D&B Best Paper came from UW + AI2.
- 2023: DecodingTrust came from UT Austin + UChicago + UIUC and other universities; ClimSim was a large multi-university and national-lab collaboration.
- 2022: ProcTHOR came from UW + AI2; LAION-5B from an international open collaboration; the high-dimensional limit theory for SGD from NYU + Northwestern + Waterloo.
- 2021: Isoperimetry came from Microsoft Research, RL at the Statistical Precipice from Google Brain, and MAUVE from UW + AI2.

**ICLR**

- 2025: Safety Alignment came from Princeton + Google + multiple institutions; Learning Dynamics of LLM Finetuning from a two-person UBC team; AlphaEdit from USTC + NUS. Honorable Mentions included SAM 2 from Meta FAIR.
- 2023: DreamFusion came from a four-person Google Research team; GNN Biconnectivity from Peking University + Microsoft.

**ICML**

- 2025: Six winners included CollabLLM from Stanford + Microsoft Research, Token Ordering in Masked Diffusions from Harvard + UT Austin, and Conformal Prediction as Bayesian Quadrature from Princeton + Google.
- 2024: Winners included Probabilistic Inference in LMs via Twisted SMC from the University of Toronto and Discrete Diffusion Modeling from Stanford.
- 2023: D-Adaptation came from FAIR, Watermark for LLMs from the University of Maryland, and Logic Reasoning from EPFL + Apple.

**CVPR**

- 2025: VGGT came from Oxford VGG + Meta AI.
- 2024: Ten papers received awards, the most ever, including BioCLIP from Ohio State as Best Student Paper.

The pattern is:

1. **Large labs do not monopolize awards.** Google, Meta, and Microsoft appear, but not every year. Many winners come from university labs, including a two-person UBC team, Maryland, Princeton, and EPFL.
2. **Chinese institutions broke through.** Tsinghua + ByteDance's 2024 NeurIPS Best Paper was a milestone. ACL 2025's Best Paper, NSA (Native Sparse Attention), came from DeepSeek + Peking University.
3. **Cross-university and cross-institutional collaboration is normal.** Few Best Papers come from one institution alone. Corporate-lab papers also commonly include university coauthors.
4. **OpenAI and Anthropic are entirely absent from five years of Best Paper lists.** No submission means no award; that says nothing about research capability.

## Geography: Two Research Systems Collide

AI World's geographic analysis of NeurIPS 2025 offers a clear map.

**China and the United States are nearly level.** Their shares of author affiliations have approached 1:1. ACL 2025 went further: official statistics show more than 51.3% of first authors came from China and only 14.0% from the United States; China's share had been below 30.6% in 2024.

**The second tier** includes Singapore (NUS, NTU), South Korea (KAIST), Canada (Mila, University of Toronto), and the United Arab Emirates (MBZUAI). Each has an explicit national AI strategy and occupies top-50 positions despite a smaller national scale.

**Europe's structural weakness:** AI World finds relative European strength in Explainable AI but far lower overall publication volume than China or the United States. The top 50 contained only Oxford, ETH Zurich, EPFL, and TU Munich, all in the UK, Switzerland, or Germany; independent academic institutions from core EU countries such as France and the Netherlands were nearly invisible. Many European researchers publish under Google, Meta, or Amazon's European offices, which are counted as corporate rather than European academic output.

**Japan:** The University of Tokyo ranked 17th in AIRankings and appeared in the NeurIPS top 50. Relative to Japan's economic scale and research resources, however, its presence was not particularly strong.

## Two Models, Two Logics

NeurIPS 2025 most clearly exposed the difference between the US and Chinese research systems.

The US AI map is **industry-led**. Google DeepMind and Meta FAIR publish more than most universities. Corporate labs function like private national research laboratories, powered by overwhelming compute and engineering scale. Stanford, CMU, MIT, and other universities remain important, but increasingly serve as talent sources and suppliers of foundational theory.

The Chinese map is **academia-led**. Tsinghua, Peking, Zhejiang, and the Chinese Academy of Sciences lead. Companies contribute—Huawei published 228 papers and Tencent 197 across NeurIPS 2021-2024 according to Recorded Future—but much less than academia. Recorded Future describes a government-industry-academia collaboration model fundamentally different from the US system.

Each model has strengths and vulnerabilities. The US is unmatched in frontier model development, but its leading research is concentrated within a few companies. If those companies shift from open publication to protecting trade secrets, knowledge circulation across the field suffers. China's paper output has caught and sometimes surpassed the United States, but it still trails in notable models: 40 from the US in 2024, 15 from China, and three from Europe. Converting paper volume into engineered products remains a gap.

## What This Means for Different Readers

- **Prospective PhD students:** Use AIRankings and CSRankings to find productive labs, but inspect Best Paper affiliations too. A two-person UBC team, Maryland, and EPFL show that schools outside the top five can win. Research fit and an advisor's style matter more than institutional rank alone.
- **Industry researchers:** Your company may discourage conference submissions, following OpenAI or Anthropic. Yet the mix of corporate and academic affiliations among Best Papers shows that conferences remain an important channel for technical influence. Google and Meta continue to submit heavily for a reason.
- **Industry observers:** Publication volume ≠ research capability ≠ productization capability. China's conference paper volume has caught the United States while its notable-model count still trails. The United States leads by a wide margin in notable models, but most come from only three or four companies.

## Overall

The top-conference map changed in three ways within five years. Chinese universities went from challengers to nearly half of paper volume. Corporate labs, especially Google and Meta, displaced universities as the largest US publishers. Meanwhile, the commercially most influential companies, including OpenAI and Anthropic, nearly disappeared from conference lists. The answer to "Who submits to top conferences?" increasingly differs from "Who does the most important AI research?" That decoupling is itself the field's most important structural signal.

---

## References

- [AIRankings — Global institutional ranking for top AI conference papers](https://airankings.org)
- [CSRankings — Computer Science Rankings based on DBLP publication counts](https://csrankings.org)
- [Stanford HAI AI Index Report 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)
- [Stanford HAI AI Index Report 2026](https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf)
- [Stanford HAI AI Index Report 2024](https://hai.stanford.edu/ai-index/2024-ai-index-report)
- [Yann LeCun — NeurIPS 2025 Top 50 Contributors (LinkedIn)](https://www.linkedin.com/posts/yann-lecun_top-50-contributors-to-neurips-in-terms-of-activity-7403357935990616064-VV4J)
- [Pierre-Alexandre Balland — Who pushed the AI frontier at NeurIPS 2025? (LinkedIn analysis)](https://www.linkedin.com/posts/pierre-alexandre-balland-20b75b13_who-pushed-the-ai-frontier-at-neurips-2025-activity-7403119036496162817-vRPE)
- [AI World — The New Map of Frontier AI Research at NeurIPS 2025](https://aiworld.eu/story/the-new-map-of-frontier-ai-research-at-neurips-2025)
- [36kr — Tsinghua closes in on Google at NeurIPS as China takes nearly half](https://eu.36kr.com/en/p/3588990662394113)
- [Stanford Review — We Trained China's AI Researchers. Now We Risk Being Surpassed in AI Innovation](https://stanfordreview.org/we-trained-chinas-ai-researchers-now-we-risk-being-surpassed-in-ai-innovation)
- [Recorded Future — Measuring the US-China AI Gap](https://www.recordedfuture.com/research/measuring-the-us-china-ai-gap)
- [South China Morning Post — Chinese universities surpass US rivals in AI ranking (via PKU News)](https://newsen.pku.edu.cn/PKUmedia/14836.html)
- [NeurIPS 2025 Best Paper Awards](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards)
- [NeurIPS 2024 Best Paper Awards](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards)
- [NeurIPS 2023 Paper Awards](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards)
- [ICLR 2025 Outstanding Paper Awards](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025)
- [ICML 2025 Outstanding Papers & Test of Time Award](https://joltml.com/icml-2025/awards)
- [CVPR 2025 Best Paper Award (IEEE CS release)](https://www.newswise.com/articles/best-papers-at-cvpr-reveal-new-results-with-neural-networks-for-real-time-applications-and-novel-ways-to-manipulate-light-for-scene-recovery)
- [CVPR 2024 Best Paper Awards](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [36kr — DeepSeek and Peking University win ACL 2025 Best Paper with NSA](https://eu.36kr.com/en/p/3401632759482502)
- [GitHub — Top-Conference-Best-Papers, a community-maintained 2022-2026 award list](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Foundation Model Transparency Index 2025](https://arxiv.org/html/2512.10169v1)
- [NeurIPS 2025 Conference Summary & Trends (Intuition Labs)](https://intuitionlabs.ai/articles/neurips-2025-conference-summary-trends)
