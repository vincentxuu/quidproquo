---
title: "2025 AI Conference Review: Natural Language Processing"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2025", ai-agent, llm-evaluation]
lang: en
tldr: "NLP conference submissions nearly doubled in 2025: ACL received 8,360 papers and EMNLP 8,174. China-based first authors exceeded 51% at ACL, and DeepSeek's Native Sparse Attention won Best Paper. The deeper story was an identity crisis: an ACL president said 'ACL is not an AI conference,' a quantitative study asked 'Has ACL Lost Its Crown?', and EMNLP faced questions about what still distinguished it from ACL or NAACL."
description: "A guide to ACL, EMNLP, and NAACL 2025: doubled submissions, China-based first authors passing 50%, Native Sparse Attention and other award winners, agentic systems, multilingual research, continued ARR difficulties, and NLP's identity crisis under the LLM wave."
draft: false
series:
  name: "AI 頂會導讀"
  order: 23
glossary:
  - term: "Native Sparse Attention (NSA)"
    definition: "DeepSeek's hardware-aligned sparse-attention mechanism, which speeds long-context processing by about eleven times and extends context to one million tokens. It won an ACL Best Paper award in 2025."
    context: "One of four ACL 2025 Best Papers."
  - term: "ACL Rolling Review (ARR)"
    definition: "The shared rolling-review platform for ACL-family conferences. Papers enter a common pool before authors commit reviewed work to a specific conference. Launched in 2021, it was fully operational by 2025."
    context: "ACL 2025 used ARR throughout its review process."
  - term: "Findings"
    definition: "The ACL family's second publication tier for peer-reviewed work that meets quality standards but not the Main Track threshold. EMNLP 2025 Findings accepted 1,417 papers."
    context: "EMNLP 2025 Findings accepted almost as many papers as the Main Track's 1,811."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2025-nlp)

The most visible change at NLP conferences in 2025 was scale. ACL submissions rose 90%, from 4,407 to 8,360; EMNLP grew 34%, from 6,105 to 8,174. The deeper change concerned identity: when almost every paper relates to LLMs, where is the boundary between NLP conferences and ML venues such as NeurIPS, ICML, and ICLR?

This article reviews Best Papers, major trends, and the debate over the position of ACL, EMNLP, and NAACL in 2025.

## ACL 2025

The 63rd ACL took place in Vienna from July 27 to August 1. It received 8,360 submissions and accepted 1,699, for 20.3%. More than 6,000 people attended the largest ACL to date. The conference used ACL Rolling Review throughout.

### Best Paper Awards

ACL named four Best Papers, more than its usual one or two, expanding recognition as submissions surged.

- **Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention** — Jingyang Yuan, Huazuo Gao, Damai Dai et al. (DeepSeek / Peking University / University of Washington). NSA aligned sparse attention with hardware, making long-context processing about eleven times faster and extending context to one million tokens. DeepSeek founder Wenfeng Liang was a coauthor; it was the company's first ACL Best Paper.
- **Language Models Resist Alignment: Evidence From Data Compression** — Jiaming Ji, Kaile Wang, Tianyi Qiu et al. (Peking University / Yaodong Yang's group). A compression-based account argued that alignment changes behavior less deeply than it appears, raising questions about RLHF's real depth.
- **A Theory of Response Sampling in LLMs: Part Descriptive and Part Prescriptive** — Sarath Sivaprasad et al. (CISPA) developed a theoretical framework that both described response sampling and prescribed better practice.
- **Fairness through Difference Awareness: Measuring Desired Group Discrimination in LLMs** — Angelina Wang et al. (Stanford / Cornell Tech) challenged the assumption that fairness means treating groups identically, arguing that genuine fairness can require awareness of group differences.

### Best Social Impact Papers

- **AfriMed-QA** covered pan-African, multispecialty medical QA and filled a major resource gap.
- **The AI Gap** quantified how socioeconomic status changes interaction quality with language technology.

### Best Resource Papers

- **BRIGHTER** supplied human-annotated emotion recognition across 28 languages, the largest cross-lingual resource of its kind.
- **Are Rules Meant to be Broken? ... UniMoral** modeled cross-cultural moral reasoning.
- **Palm** offered a culturally inclusive and linguistically diverse Arabic LLM dataset.

### Best Theme Papers

- **MaCP** used hierarchical cosine projection for parameter-minimal adaptation.
- **Meta-rater** selected pretraining data across multiple dimensions.
- **SubLIME** used subset selection to reduce LLM-evaluation cost substantially.

### Outstanding Papers (26, Selected Directions)

The papers clustered into five trends. **Multilingual and low-resource language research** was the largest, including typology-guided African NLP, PARME for Middle Eastern languages, IndicSynth, and cross-lingual intervention. **Evaluation and benchmarking** covered capability salience, MiniLongBench, and mapping more than 1,000 models. **Efficiency** included Meta's Byte Latent Transformer, deterministic pushdown automata, and token recycling. **Robustness and safety** included HALoGEN, plagiarism in AI-generated research, and safety gaps under distribution shift. **Linguistics and context** included a contextual account of Zipf's law and an unusual computational attempt at a canine phonetic alphabet.

### Test-of-Time Award

**Automatic Labeling of Semantic Roles** by Daniel Gildea and Daniel Jurafsky (2000) received the 25-year award for founding semantic-role labeling as a subfield.

### TACL Best Paper

The inaugural TACL awards gave Best Paper to **Reading Subtext: Evaluating Large Language Models on Short Story Summarization with Writers** and Test of Time to **Weakly Supervised Learning of Semantic Parsers for Mapping Instructions to Actions** (2013).

## NAACL 2025

Held in Albuquerque, New Mexico, from April 29 to May 4.

### Best Paper Awards

- **The BiGGen Bench** introduced principled fine-grained evaluation of language models with language models, reflecting LLM-as-Judge's mainstream status.
- **Runner-Up: REL-A.I.** measured human reliance on language models through interaction.

### Best Theme Paper

- **WorldCuisines** built multilingual, multicultural visual QA for global cuisine.
- **Runner-Up:** multilingual speech synthesis for Ojibwe, Mi'kmaq, and Maliseet.

### Best Social Impact Award

**FLEURS-ASL** — Garrett Tanzer, a sole author, incorporated American Sign Language into large multilingual evaluation.

### Outstanding Papers (10, Selected)

- **PeerQA** built scientific QA from peer reviews.
- **IrokoBench** benchmarked African languages in the LLM era.
- **DrawEduMath** evaluated VLMs on expert-annotated student math drawings.
- **Multi3Hate** covered multimodal, multilingual, multicultural hate-speech detection.

### SAC Awards (Selected)

- **Decoding Speculative Decoding** clarified its theory.
- **In-Context Learning with Long-Context Models** examined long-context ICL.
- **Meta-Cultural Competence** studied targets for cultural awareness.

## EMNLP 2025

The 30th EMNLP took place in Suzhou from November 5 to 9. It received 8,174 submissions—another source reports 8,172—and accepted 1,811 to the Main Track (22.2%). Findings accepted 1,417 (17.3%). Together they published 3,228 papers, a 39.5% combined rate. More than 6,000 attendees made it the largest EMNLP yet. The special theme was **Interdisciplinary Recontextualization of NLP**.

### Best Paper Award

**Infini-gram mini: Exact n-gram Search at the Internet Scale with FM-Index** — Hao Xu et al. (UW / AI2) provided internet-scale exact n-gram search, complementing probabilistic generation with exact retrieval.

### Outstanding Papers (7)

- **Measuring Chain of Thought Faithfulness by Unlearning Reasoning Steps** tested whether CoT reflects internal reasoning.
- **Mind the Value-Action Gap** found systematic differences between values LLMs express and how they act.
- **LingGym** tested whether LLMs can work like field linguists.
- **Generative or Discriminative?** revisited text classification under Transformers.
- **DiscoSG** parsed discourse-level text scene graphs.
- **MiCRo** combined mixture modeling with context-aware personalized preferences.
- **Causal Interventions Reveal Shared Structure Across English Filler-Gap Constructions** uncovered shared linguistic structure.

### Best Special Theme Paper

**InterIDEAS** used LLMs to explore intertextuality among philosophical texts.

### Best Resource Paper

**Autoformalization in the Wild** evaluated LLMs on real-world mathematical definitions.

### People's Choice Award

**Randomly Removing 50% of Dimensions in Text Embeddings has Minimal Impact on Retrieval and Classification Tasks** reported a disquietingly simple result: removing half the dimensions barely changed performance.

### Keynote Speakers

- **Heng Ji:** "No more Processing. Time to Discover," on language technology and scientific discovery.
- **Hannaneh Hajishirzi:** "Open-Science AI," on OLMo and Tulu catching closed systems.
- **Jana Diesner:** NLP through computational social science.

## Overall Observations for NLP in 2025

### Explosive Scale: The Effect of Doubled Submissions

ACL grew from 4,407 to 8,360 submissions and EMNLP from 6,105 to 8,174; NAACL also grew substantially. Reviewer dilution turned peer-review quality from a private complaint into public debate.

### China-Based First Authors Passed 50%

China-based researchers accounted for 51.3% of ACL first authors, up from 30.6% in 2024. DeepSeek's NSA and Peking University's alignment paper both winning Best Paper were emblematic.

### Identity Crisis: NLP or LLM Conferences?

The fundamental question became: **where is the boundary between NLP and ML conferences?**

- Former ACL president Emily M. Bender declared at ACL 2024 that "ACL is not an AI conference."
- **Has ACL Lost Its Crown?** found that ACL still led in median citations (32.00), milestone-paper density, and the lowest uncited rate (0.89%), but Quality-Quantity Elasticity declined across conferences.
- Eduard Hovy criticized "LLM popcorn": surface observations rather than fundamental problems.
- EMNLP faced a related question about its distinction from ACL and NAACL.

### Agentic Systems Entered NLP Conferences

Agentic systems became a first-class EMNLP topic: multi-agent communication, unreliable tool preferences, lifelong adaptive agents, and LLMs as social or economic actors. NLP brought language analysis, interaction design, and evaluation to an area no longer owned only by ML venues.

### Multilingual and Cultural Inclusion Became Infrastructure

All three conferences elevated multilinguality. It was the largest group among ACL Outstanding Papers; multilingual datasets dominated Best Resources; NAACL recognized global-cuisine VQA, African benchmarks, and regional parallel corpora. EMNLP's interdisciplinary theme widened the frame.

### Evaluation Methodology Kept Evolving

NAACL formalized LLM-as-Judge; EMNLP tested CoT faithfulness by unlearning steps; HALoGEN systematized hallucination types; SubLIME lowered evaluation cost. How to evaluate became as active as how to build.

## Compared with 2024

| Dimension | 2024 | 2025 |
|---|---|---|
| ACL submissions | 4,407 | 8,360 (+90%) |
| EMNLP submissions | 6,105 | 8,174 (+34%) |
| China-based first authors at ACL | 30.6% | 51.3% |
| Agent research | Scattered | First-class EMNLP topic |
| Multilingual / low-resource | Active | Breakout, several Best Resources |
| Identity debate | Underlying | Public |

## Looking Back from 2026: Which Papers May Matter Most?

1. **Native Sparse Attention.** If DeepSeek adopts it broadly, NSA will mark a starting point for efficient long context.
2. **Language Models Resist Alignment.** Further validation could destabilize the current alignment paradigm.
3. **Infini-gram mini.** Exact n-gram search could redirect RAG and fact checking.
4. **Measuring CoT Faithfulness.** If CoT is often unfaithful, reasoning evaluation needs redesign.
5. **Has ACL Lost Its Crown?** Declining QQE could motivate conference reform.

---

## References

- [ACL 2025 Awards](https://2025.aclweb.org/program/awards/)
- [EMNLP 2025 Awards](https://2025.emnlp.org/program/awards/)
- [NAACL 2025 Best Papers](https://2025.naacl.org/blog/best-papers/)
- [EMNLP 2025 Keynotes](https://2025.emnlp.org/program/keynotes/)
- [TACL 2025 Paper Awards](https://transacl.org/index.php/tacl/announcement/view/117)
- [ACL 2025 Test-of-Time Award](https://www.aclweb.org/portal/content/announcement-2025-acl-test-time-paper-award)
- [36kr — DeepSeek and Peking University Win ACL 2025 Best Paper](https://eu.36kr.com/en/p/3401632759482502)
- [CSPaper — ACL 2025 Best Papers](https://cspaper.org/post/309)
- [Top 5 Trends in ACL 2025 Outstanding Papers](https://msukhareva.substack.com/p/top-five-trends-in-acl-2025-outstanding)
- [ACL 2025 Recap](https://msukhareva.substack.com/p/acl-2025-recap-trends-tensions-and)
- [Has ACL Lost Its Crown?](https://arxiv.org/abs/2512.04448)
- [Megagon Labs — EMNLP 2025 Highlights](https://megagon.ai/emnlp2025-highlights/)
- [EMNLP 2025 Findings Preface](https://aclanthology.org/2025.findings-emnlp.0.pdf)
- [Paper Digest — ACL 2025](https://www.paperdigest.org/2025/07/acl-2025-papers-highlights/)
- [Paper Digest — EMNLP 2025](https://www.paperdigest.org/2025/11/emnlp-2025-papers-highlights/)
- [ACL Acceptance Statistics](https://csconfstats.xoveexu.com/conferences/acl/)
- [EMNLP Acceptance Statistics](https://openaccept.org/c/ai/emnlp/)
- [Top Conference Best Papers](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
