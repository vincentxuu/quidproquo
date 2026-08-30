---
title: "2024 AI Conference Review: Natural Language Processing"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2024", llm-evaluation, rag]
lang: en
tldr: "NLP conferences redefined themselves under LLM dominance in 2024. ACL made open science its annual theme, and four of its seven Best Papers probed fundamental limits of language models. EMNLP turned toward multilingual and cross-cultural work, with Best Papers spanning speech representations and gradient interpretability. ACL and EMNLP received more than 10,000 submissions combined, but the deeper anxiety was what remains of NLP when LLMs can perform nearly every traditional NLP task."
description: "A review of award-winning papers, influential research, and trends at ACL, EMNLP, and NAACL 2024: open science, language-model capability limits, multilinguality, interpretability, visual grounding, low-resource languages, production RAG, LLM-as-Judge, and synthetic-data quality."
draft: false
series:
  name: "AI 頂會導讀"
  order: 19
glossary:
  - term: "ARR"
    definition: "ACL Rolling Review, the shared rolling-review system for ACL-family conferences. Papers enter a common review pool before authors decide which specific conference to commit them to."
    context: "ARR was fully operational in 2024, but two competing ways to calculate acceptance rates remained."
  - term: "LLM-as-Judge"
    definition: "Using a large language model instead of human evaluators to judge generation quality. It became a mainstream NLP evaluation method in 2024, while its reliability became a research topic in its own right."
    context: "Several EMNLP 2024 papers studied the biases and limits of LLM-as-Judge."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2024-nlp)

NLP's top conferences faced an unprecedented identity problem in 2024: if large language models can handle almost every traditional NLP task, what remains of NLP as an independent research field? Each conference offered a different answer. ACL chose open science as its annual theme, EMNLP dug into multilinguality and interpretability, and NAACL found new ground in visual grounding and low-resource languages.

## ACL 2024: Seven Questions About the Limits of Language Models

ACL 2024 took place in Bangkok in August. It received 4,407 Main Track submissions and accepted 940, for a 21.3% rate; another 975 entered Findings. The special theme, "Open science, open data, and open models for reproducible NLP research," received 55 submissions, with 22 accepted to the Main Track and 16 to Findings.

### Best Paper Awards (7)

ACL named seven Best Papers, far above its usual one to three. Four asked, in different ways, where the fundamental limits of language models lie.

**Mission: Impossible Language Models** — Julie Kallini, Isabel Papadimitriou, Richard Futrell, Kyle Mahowald, Christopher Potts (Stanford, UC Irvine). The authors designed "impossible languages": computationally valid grammatical rules absent from human language. Models learned them almost as well as real languages, suggesting they may not learn the linguistic universals that linguists expect.

**Why are Sensitive Functions Hard for Transformers?** — Michael Hahn, Mark Rofin (Saarland University). The paper mathematically explained why Transformers struggle with functions highly sensitive to small input changes, establishing limits on their expressive power.

**Natural Language Satisfiability: Exploring the Problem Distribution and Evaluating Transformer-based Language Models** — Tharindu Madusanka, Ian Pratt-Hartmann, Riza Batista-Navarro (Manchester). It brought formal-logic satisfiability into natural language and systematically tested genuine logical reasoning.

**Semisupervised Neural Proto-Language Reconstruction** — Liang Lu, Peirong Xie, David R. Mortensen (CMU). A semi-supervised system reconstructed ancestral forms from existing languages, applying deep learning to a core problem in historical linguistics.

**Deciphering Oracle Bone Language with Diffusion Models** — Haisu Guan et al. (HUST, University of Adelaide, Anyang Normal University, SCUT). The work reframed oracle-bone decipherment from OCR as generative modeling. Its first author was an undergraduate at HUST.

**Causal Estimation of Memorisation Profiles** — Pietro Lesci et al. (ETH Zürich, Cambridge). Causal inference quantified how much language models memorize training data, providing stricter tools for contamination and privacy risk.

**Aya Model: An Instruction Finetuned Open-Access Multilingual Language Model** — Ahmet Üstün et al. (Cohere For AI). Covering 101 languages, Aya was among 2024's most ambitious open multilingual projects.

### Best Theme Paper

**OLMo: Accelerating the Science of Language Models** — Groeneveld et al. (Allen Institute for AI). OLMo released code, data, training details, evaluation framework, logs, and intermediate checkpoints. It turned reproducibility from a slogan into an engineering practice.

### Best Resource Papers

- **Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research** — Soldaini et al. (AI2), the three-trillion-token open corpus supporting OLMo.
- **AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents** — Trivedi et al., a controlled simulated app ecosystem for testing multistep coding-agent behavior.
- **Latxa: An Open Language Model and Evaluation Suite for Basque** — Etxaniz et al., a model and evaluation suite exemplifying open infrastructure for a low-resource language.

### Best Social Impact Papers

- **How Johnny Can Persuade LLMs to Jailbreak Them** — Zeng et al. found that human-style persuasive rhetoric could defeat safety mechanisms more effectively than technical prompt injection.
- **DIALECTBENCH** — Faisal et al. created a benchmark for dialects and closely related languages overlooked by standardized evaluation.
- **Having Beer after Prayer? Measuring Cultural Bias in Large Language Models** — Naous et al. measured cultural bias, especially default assumptions about non-Western settings.

## EMNLP 2024: Multilinguality, Interpretability, and Data Detection

EMNLP took place in Miami in November. It received 6,105 submissions, accepted 1,271 to the Main Track (20.8%), and placed 1,029 in Findings (16.9%). Together, the two programs exceeded 2,300 papers.

### Best Paper Awards (5)

**An image speaks a thousand words, but can everyone listen? On image transcreation for cultural relevance** — Simran Khanuja et al. (CMU). Rather than translating text, image transcreation adapts images themselves for cultural relevance. At global deployment scale, visual assumptions can be subtler and harder to detect than linguistic ones.

**Towards Robust Speech Representation Learning for Thousands of Languages** — William Chen et al. (CMU). Robust speech representation for thousands of languages reflected language technology's expansion beyond text into multimodality.

**Backward Lens: Projecting Language Model Gradients into the Vocabulary Space** — Shahar Katz et al. (Technion, Tel Aviv University). Projecting gradients into vocabulary space reveals what drives parameter updates, a view closer to learning dynamics than attention visualization.

**Pretraining Data Detection for Large Language Models: A Divergence-based Calibration Method** — Weichao Zhang et al. (CAS, University of Amsterdam). Divergence-based calibration detected pretraining examples, addressing benchmark contamination: if a model's training data are unknown, its benchmark score is difficult to trust.

**CoGen: Learning from Feedback with Coupled Comprehension and Generation** — Mustafa Omer Gul, Yoav Artzi (Cornell). Coupling comprehension and generation let a model improve both understanding and execution from feedback.

### Best Resource Paper

**KidLM: Advancing Language Models for Children** — Mir Tafseer Nayeem, Davood Rafiei (University of Alberta). Models and evaluation for children opened a neglected intersection of AI safety and education.

### Notable Outstanding Papers

EMNLP named 20 Outstanding Papers, about 1.6% of Main Track acceptances. Two captured broader trends:

- **Fishing for Magikarp: Automatically Detecting Under-trained Tokens in Large Language Models** — Sander Land, Max Bartolo detected "glitch tokens" that behave abnormally because of uneven training-data distributions.
- **Humans or LLMs as the Judge? A Study on Judgement Bias** examined LLM-as-Judge bias and found that model and human evaluators were vulnerable to different disturbances.

## NAACL 2024: Visual Grounding and Low-Resource Languages

NAACL took place in Mexico City in June and accepted roughly 565 Main Track papers.

### Best Paper Award

**Visual Grounding Helps Learn Word Meanings in Low-Data Regimes** — Chengxu Zhuang, Evelina Fedorenko, Jacob Andreas (MIT). Visual grounding helped models learn word meaning particularly when data were scarce. The result suggested that children's multimodal language learning may confer data efficiency, rather than multimodality being intrinsically superior to text. The paper translated a cognitive-science hypothesis into a testable computational experiment.

### Outstanding Paper Award

**Evaluating the Deductive Competence of Large Language Models** — S M Seals, Valerie Shalin. Strict formal-logic tests found structural errors even in the best models on multistep deduction.

### Theme Track Award

**Grammar-based Data Augmentation for Low-Resource Languages: The Case of Guarani-Spanish Neural Machine Translation** — Agustín Lucas et al. used grammar-driven augmentation for Guarani-Spanish MT. Holding NAACL in Mexico City gave greater visibility to a topic especially important in Latin American research communities.

### Social Impact Award

**Understanding the Capabilities and Limitations of Large Language Models for Cultural Commonsense** — Siqi Shen et al. (A*STAR, UMich, SMU). Performance dropped substantially in non-Western cultural contexts, echoing ACL's Having Beer after Prayer and forming a pair of landmark 2024 studies on cultural bias.

## Cross-Conference Trends: Four Threads in 2024 NLP

### 1. The Identity Crisis: Is NLP Still NLP?

When LLMs can perform classification, summarization, translation, question answering, named-entity recognition, and nearly every other traditional task, what do NLP researchers study? ACL's awards pointed back to language itself. Mission: Impossible Language Models asked whether models understand linguistic structure; Proto-Language Reconstruction returned NLP tools to foundational linguistics; Oracle Bone Language pushed NLP into nonstandard language data. The common implication was that NLP's future lies less in applying LLMs to more tasks than in rigorously establishing what they have and have not learned.

### 2. Open Science and Reproducibility

ACL's theme was substantive: awards for both OLMo and Dolma showed that the community took it seriously. Aya's open coverage of 101 languages contrasted sharply with closed commercial systems.

The tension remained. OpenAI and Anthropic, despite their resources, published almost nothing at ACL or EMNLP that year; see [Who Submits to Top AI Conferences?](/posts/ai/2026-08-24-ai-conference-who-submits-en). Technical details of leading industrial models were increasingly absent from peer review. Open science and commercial secrecy were creating a growing information asymmetry.

### 3. RAG Moved from Concept to Engineering

RAG completed its transition from new idea to engineering discipline. EMNLP's Searching for Best Practices in Retrieval-Augmented Generation compared efficiency and effectiveness across strategies. Retrieval Augmented Generation or Long-Context LLMs introduced Self-Route, allowing a system to choose RAG or direct long-context use. ACL's FlashRAG supplied a modular research toolkit. Evaluation remained unresolved: NAACL's ARES attempted to measure whether RAG systems truly improved, but consensus was distant.

### 4. LLM-as-Judge Shifted Evaluation Itself

LLM-as-Judge became mainstream because it reduced human-labeling cost, but it also changed the method. Humans or LLMs as the Judge? found different biases: models favored longer, cleaner-formatted responses, while people emphasized substance. Replacing people with models therefore changed the reward signal, not merely evaluation efficiency. Several ACL Outstanding Papers likewise investigated whether evaluation measured what researchers thought it did.

## Multilingual and Cross-Cultural Research Became Central

Across all three conferences, multilingual and cross-cultural research intensified: Aya (101 languages), Latxa (Basque), DIALECTBENCH, culturally adapted images, speech representations for thousands of languages, Guarani translation, and cultural-commonsense testing appeared from Best Paper through Resource and Social Impact awards.

This was more than adding languages. The papers asked how cultural common sense shapes behavior, how to handle assumptions embedded in images, and how systems should model dialect-standard relationships. Global language technology cannot rely on translation alone; it requires redesign for different linguistic and cultural settings.

## Overall

NLP conferences meaningfully repositioned themselves under the shadow of LLMs. ACL returned to linguistic foundations and open science, using "what does a language model actually understand?" to redraw the field's boundary. EMNLP found research space in multilinguality and interpretability where LLMs remained weak. NAACL preserved its character at the intersection with cognitive science and low-resource languages.

ACL and EMNLP received more than 10,500 Main Track submissions combined, 51% above 2021's 6,950. More important was the qualitative shift: award-winning work that merely applied LLMs to improve a benchmark almost disappeared. Fundamental capability analysis, stricter evaluation, and broader linguistic and cultural coverage took its place. The NLP community was learning to redefine its value in the LLM era.

---

## References

- [ACL 2024 Best Paper Awards](https://2024.aclweb.org/program/best_papers/)
- [EMNLP 2024 Best Papers](https://2024.emnlp.org/program/best_papers/)
- [EMNLP 2024 Conference Overview](https://2024.emnlp.org/program/)
- [ACL Anthology — ACL 2024 Message from the Program Chairs](https://aclanthology.org/2024.acl-short.0.pdf)
- [ACL Admin Wiki — 2024Q3 General Chair Report](https://www.aclweb.org/adminwiki/index.php/2024Q3_Reports:_General_Chair)
- [ACL 2024 Acceptance Rate — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/acl/2024/)
- [EMNLP 2024 Acceptance Rates — OpenAccept](https://openaccept.org/c/ai/emnlp/2024/)
- [NAACL 2024](https://2024.naacl.org/)
- [Top-Conference-Best-Papers](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Searching for Best Practices in Retrieval-Augmented Generation](https://aclanthology.org/2024.emnlp-main.981/)
- [Humans or LLMs as the Judge? A Study on Judgement Bias](https://aclanthology.org/2024.emnlp-main.474/)
- [University of Alberta — Best Paper Award at EMNLP 2024](https://www.ualberta.ca/en/computing-science/news-and-events/news/2024/november/best-paper-award-at-emnlp-2024.html)
- [CMU LTI — Dual Best Paper Awards at EMNLP](https://www.lti.cs.cmu.edu/news-and-events/news/2024-11-21-emnlp-best-papers.html)
- [ACL 2022 Chair Blog Post — Rolling Review](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
