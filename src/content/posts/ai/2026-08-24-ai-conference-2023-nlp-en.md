---
title: "A Guide to the Top AI Conferences of 2023: Natural Language Processing"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, nlp, "2023", hallucination, evaluation, in-context-learning]
lang: en
tldr: "2023 was the first full academic year after ChatGPT, and LLMs rewrote the NLP conference agenda. ACL's Best Papers examined humor understanding and the propagation of political bias; an EMNLP Best Paper explained in-context learning through information flow; and the HackAPrompt competition paper also won an EMNLP Best Paper award, signaling that security research had entered the mainstream. The year's largest shift was from asking how to make models more accurate to asking how we can tell when a model is misleading us."
description: "A review of Best Papers, Outstanding Papers, and influential work from ACL, EMNLP, and EACL 2023. Topics include the mechanisms behind in-context learning, prompt injection security, the LLM evaluation crisis, the surge in hallucination research, FActScore, and how ChatGPT transformed the NLP research agenda in a single year."
draft: false
series:
  name: "AI Conference Guide"
  order: 15
glossary:
  - term: "in-context learning"
    definition: "The ability of a large language model to learn a new task from a few examples in the prompt, without updating its parameters. GPT-3 demonstrated this capability, but how it worked remained an open question in 2023."
    context: "An EMNLP 2023 Best Paper used information-flow analysis to explain the internal mechanism of in-context learning."
  - term: "prompt injection"
    definition: "The use of carefully crafted input text to induce a large language model to ignore its original instructions and perform behavior chosen by an attacker. HackAPrompt was the first large-scale prompt injection competition."
    context: "Its recognition as one of the EMNLP 2023 Best Papers signaled that security research had entered mainstream NLP."
  - term: "FActScore"
    definition: "Fine-grained Atomic Evaluation of Factual Precision in Long-form Text Generation: a framework that breaks long-form text into atomic factual claims and checks each one for supporting evidence. Sewon Min and coauthors introduced it at EMNLP 2023."
    context: "It became a standard framework for subsequent research on LLM factuality."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2023-nlp)

2023 was the first full academic year after ChatGPT. Submissions to the top NLP conferences continued to climb, but the deeper change was not the submission count: LLMs had rewritten the field's research agenda. The central question was no longer "How can we gain a few more points on a benchmark?" It had been replaced by three more fundamental ones: Why can models do these things at all, as in the mechanism behind in-context learning? When do models mislead us, as in hallucination and factual verification? And can models be compromised, as in prompt injection and security?

This article reviews the Best Papers, influential papers, and broader trends from ACL, EMNLP, and EACL 2023.

## ACL 2023

ACL 2023 took place in Toronto in July. It received 4,864 submissions and accepted 1,074, for an acceptance rate of 22.1%. The conference introduced a new awards policy that expanded the pool of Outstanding Papers to 1.5–2.5% of all submissions. In total, 39 papers received the award—several times the number in previous years.

### Best Paper Awards (3 papers)

**Do Androids Laugh at Electric Sheep? Humor "Understanding" Benchmarks from The New Yorker Caption Contest**
Jack Hessel, Ana Marasovic, Jena D. Hwang, Lillian Lee, Jeff Da, Rowan Zellers, Robert Mankoff, Yejin Choi (AI2 / Cornell / New Yorker)

The authors built a humor-understanding benchmark from The New Yorker Caption Contest. The point was not to test whether a model could "be funny," but to determine how much it understood humor that depended on commonsense reasoning, world knowledge, and cultural context. Their conclusion was that even the strongest LLMs of the time still lagged humans substantially on humor tasks requiring deeper reasoning.

**What the DAAM: Interpreting Stable Diffusion Using Cross Attention**
Raphael Tang, Linqing Liu, Akshat Pandey, Zhiying Jiang, Gefei Yang, Karun Kumar, Pontus Stenetorp, Jimmy Lin, Ferhan Ture (Waterloo / UCL / Comcast)

The paper introduced DAAM, or Diffusion Attentive Attribution Maps. It uses cross-attention to visualize which regions of a generated image each text token actually influenced in Stable Diffusion. The presence of a text-to-image paper at an NLP conference was itself a snapshot of how multimodal research was blurring disciplinary boundaries in 2023.

**From Pretraining Data to Language Models to Downstream Tasks: Tracking the Trails of Political Biases Leading to Unfair NLP Models**
Shangbin Feng, Chan Young Park, Yuhan Liu, Yulia Tsvetkov (CMU / UW)

This work traced, end to end, how political bias propagates and intensifies from pretraining data through the model and into downstream tasks. It did more than observe that "models are biased": it was the first systematic effort to locate where bias enters the NLP pipeline and where it becomes amplified.

### Special Awards (4 papers)

| Award | Paper | Authors |
|---|---|---|
| Reproduction Award | Do CoNLL-2003 Named Entity Taggers Still Work Well in 2023? | Shuheng Liu, Alan Ritter (Georgia Tech) |
| Resource Award | When Does Translation Require Context? A Data-driven, Multilingual Exploration | Patrick Fernandes et al. (CMU / IST) |
| Social Impact Award | Marked Personas: Using Natural Language Prompts to Measure Stereotypes in Language Models | Myra Cheng, Esin Durmus, Dan Jurafsky (Stanford) |
| Theme Paper Award | Weaker Than You Think: A Critical Look at Weakly Supervised Learning | Dawei Zhu et al. (Saarland) |

The Reproduction Award paper deserves special mention. Its authors reran classic NER systems on CoNLL-2003 and found that their performance dropped sharply on text from 2023. The models had not deteriorated; the language had changed over 20 years. The question of how long a benchmark remains fresh will only become more pressing in the LLM era.

### Notable Outstanding Papers (selected)

ACL 2023's 39 Outstanding Papers covered a broad range of topics. The following are several representative examples:

- **Minding Language Models' (Lack of) Theory of Mind: A Plug-and-Play Multi-Character Belief Tracker** (Melanie Sclar et al., UW / AI2)—used the SymbolicToM framework to test theory-of-mind capabilities in LLMs and found that models remained weak at tracking beliefs across multiple characters.
- **Symbolic Chain-of-Thought Distillation: Small Models Can Also "Think" Step-by-Step** (Liunian Harold Li et al., UCLA / AI2)—showed that small models need not generate natural-language chains of thought: distillation with symbolic reasoning steps worked better.
- **SCOTT: Self-Consistent Chain-of-Thought Distillation** (Peifeng Wang et al., USC / AI2)—presented another CoT distillation method, extracting reasoning chains from a large model through contrastive decoding and using a counterfactual reasoning objective to keep the distilled small model consistent.
- **World-to-Words: Grounded Open Vocabulary Acquisition through Fast Mapping in Vision-Language Models** (Ziqiao Ma et al., Michigan)—simulated the "fast mapping" learning mechanism seen in human children, enabling vision-language models to learn new concepts from a small number of examples.
- **Towards Understanding Chain-of-Thought Prompting: An Empirical Study of What Matters** (Boshi Wang et al.)—found that the presence of a reasoning structure mattered more than the correctness of the reasoning steps in CoT prompts. Even incorrect steps caused little loss in performance as long as the format was right. The result carried major implications for how we understand the nature of LLM "reasoning."

### ACL 2023 Peer Review Report

ACL 2023's Program Chairs—Anna Rogers, Jordan Boyd-Graber, and Naoaki Okazaki—published an unusually transparent report that revealed several noteworthy statistics:

- The main-track acceptance rate was significantly higher for long papers (23.5%) than for short papers (16.5%).
- Preprints scored significantly higher on Soundness, Excitement, and reviewer confidence, and reviewers recommended them for paper awards more often. The figures offer an unsettling answer to the question of whether double-blind review is truly "blind."
- Agreement among three reviewers, measured by Krippendorff's alpha, was about 0.3. That is low, but strikingly consistent with recent EACL and EMNLP conferences.

## EMNLP 2023

EMNLP 2023 took place in Singapore in December. It received 4,909 submissions and accepted 1,047, for an acceptance rate of 21.3%. The timing was telling: it was exactly one year after the release of ChatGPT.

### Best Paper Awards (5 papers)

**Label Words are Anchors: An Information Flow Perspective for Understanding In-Context Learning**
Lean Wang, Lei Li, Damai Dai, Deli Chen, Hao Zhou, Fandong Meng, Jie Zhou, Xu Sun (PKU / ByteDance / WeChat AI)

This was one of the most important mechanistic-analysis papers in NLP in 2023. The authors used an information-flow perspective to examine what happens inside a Transformer during in-context learning. They found that label words—the answer words in the examples—act as anchors: the model first aggregates semantic information into those label tokens, then retrieves information from the anchors to make a prediction. The finding was not only a theoretical insight; it also led directly to a practical improvement method.

**Ignore This Title and HackAPrompt: Exposing Systemic Vulnerabilities of LLMs Through a Global Prompt Hacking Competition**
Sander Schulhoff, Jeremy Pinto, Anaum Khan, Louis-François Bouchard, Chenglei Si et al. (Maryland / UBC et al.)

The authors organized HackAPrompt, a global prompt injection competition, and collected more than 600,000 attack attempts to classify and analyze systemic prompt injection weaknesses in LLMs. Its Best Paper award carried symbolic weight: prompt injection security had moved from the margins into mainstream NLP. The paper's title is itself an example of prompt injection.

**Faster Minimum Bayes Risk Decoding with Confidence-based Pruning**
Julius Cheng, Andreas Vlachos (Cambridge)

Minimum Bayes Risk, or MBR, decoding is theoretically better than beam search, but its computational cost had made it impractical. This paper used confidence-based pruning to reduce that cost substantially, making MBR practical for tasks such as machine translation. It was not an LLM paper, but it showed that EMNLP continued to value rigorous technical advances.

**PaperMage: A Unified Toolkit for Processing, Representing, and Manipulating Visually-Rich Scientific Documents**
Kyle Lo, Zejiang Shen et al. (AI2)

PaperMage is a unified toolkit for scientific literature, integrating PDF parsing, layout analysis, figure and table extraction, citation parsing, and related functions. The number of papers exploded in 2023, making the need to automate scientific-document processing more urgent than ever. This work arrived at exactly the right moment.

**Personalized Dense Retrieval on Global Index for Voice-enabled Conversational Systems**
Masha Belyi, Charlotte Dzialo et al. (Amazon)

This paper presented personalized dense retrieval for voice-enabled conversational systems. It ranks personal results against a global index without requiring a separate index for every user—a solid engineering contribution from industry.

### Notable Outstanding Papers (selected)

EMNLP 2023 recognized 21 Outstanding Papers. Several notable examples include:

- **LINC: A Neurosymbolic Approach for Logical Reasoning by Combining Language Models with First-Order Logic Provers** (Theo Olausson et al., MIT / Harvard)—combined the natural-language understanding of LLMs with the exact reasoning of first-order logic provers, substantially improving performance on tasks requiring rigorous logical inference.
- **Toward a Critical Toponymy Framework for Named Entity Recognition: A Case Study of Airbnb in New York City** (Mikael Brunila et al.)—received the Outstanding Paper Award for Computational Social Sciences and Cultural Analytics. It brought critical toponymy into NER to analyze cultural and class signals in the naming of Airbnb listings.
- **FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long-form Text Generation** (Sewon Min et al., UW / AI2)—introduced a framework that decomposes long-form text into atomic factual claims and checks each claim individually. Although it did not receive an award, FActScore became a standard citation in nearly all subsequent research on LLM factuality and may have been the single most influential paper of the conference.

### Influential papers that did not receive awards

Several papers from the EMNLP 2023 main track and Findings track later accumulated especially high citation counts:

- **Active Retrieval Augmented Generation**—introduced FLARE, which lets a model decide dynamically what to retrieve and when during generation, instead of retrieving only once. It was a key step in the transition from "one-shot retrieval" to "dynamic retrieval" in RAG.
- **Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection**—trained a model to decide for itself whether retrieval was needed, whether retrieved results were relevant, and whether generated output remained faithful to the retrieved material. Every decision point in RAG became something the model could reflect on.

## EACL 2023

EACL 2023 took place in Dubrovnik in May. It was smaller than ACL and EMNLP, but several award-winning papers deserve attention:

- **COMPS: Conceptual Minimal Pair Sentences for Testing Robust Property Knowledge and its Inheritance in Pre-trained Language Models** (Kanishka Misra et al.)—used minimal pairs to test whether pretrained language models truly understand conceptual properties and how those properties are inherited.
- **WINODICT: Probing Language Models for In-context Word Acquisition** (Julian Eisenschlos et al., Google)—tested whether language models could learn a completely new word from context, directly probing the limits of in-context learning.
- **LoRaLay: A Multilingual and Multimodal Dataset for Long Range and Layout-Aware Summarization** (Laura Nguyen et al.)—introduced a multilingual, multimodal dataset for summarizing long, layout-rich documents.

## The overall picture for NLP in 2023

### LLMs took over the research agenda

The most consequential change in 2023 was not any single paper, but the redefinition of an entire field's research agenda around LLMs. More than 60% of the highly cited papers among ACL 2023 submissions were directly related to LLMs. Traditional NLP subtasks—POS tagging, dependency parsing, NER, and others—continued to recede as independent research directions. That was not because those problems had been solved, but because they were reframed as dimensions for evaluating how LLMs perform.

### The evaluation crisis

One of the deepest questions raised by ChatGPT was this: **Can we trust the benchmarks used to evaluate models?** In 2023, many papers examined benchmark contamination—models seeing test sets during training—and evaluation methodology, including whether existing metrics could still distinguish between models. ACL 2023's Reproduction Award for retesting CoNLL-2003 NER after 20 years and EMNLP 2023's FActScore were both responses to this crisis.

### Hallucination grew from a bug into a research program

In 2022, hallucination was still treated mainly as a bug to fix. In 2023, it became a full research program. FActScore provided a standardized factual-verification framework, HaluEval built a hallucination dataset containing both synthetic and naturally generated examples, and FELM focused on hallucination detection across multiple domains. These tools moved hallucination research from qualitative observation to quantitative measurement.

### Prompt injection security gained legitimacy

HackAPrompt's EMNLP Best Paper award was a watershed. Before it, prompt injection research had mainly lived in the security community and on technical blogs. Afterward, it became a formal research topic at top NLP conferences. The paper's more than 600,000 attack attempts also supplied an empirical foundation that theoretical derivation alone could not provide.

### RAG became a research direction rather than a technique

In 2022, RAG was mainly an engineering technique. In 2023, it became a subject of systematic academic study. Papers such as FLARE, for dynamic retrieval, and Self-RAG, for self-reflective retrieval, decomposed and improved each stage of RAG rather than treating the system as a monolithic black box.

### Compared with 2022

| Dimension | 2022 | 2023 |
|---|---|---|
| Main theme | The emergence of InstructGPT/RLHF; the eve of ChatGPT | A wholesale rewriting of the agenda after ChatGPT |
| Research focus | How to make LLMs better | How to understand, evaluate, and constrain LLMs |
| CoT/Prompting | New discoveries (Chain-of-Thought, Self-Consistency) | Mechanistic explanations (why CoT works) + distillation (small models can use CoT too) |
| Hallucination | Treated as a bug | A systematic research program (FActScore, HaluEval) |
| Security | A marginal topic | HackAPrompt wins Best Paper and enters the mainstream |
| RAG | An engineering technique | An academic research direction (FLARE, Self-RAG) |
| ARR | First year of full deployment; pain points emerge | Gradually stabilizing, though controversy remains |
| ACL submissions | 3,378 | 4,864 (+44%) |
| EMNLP submissions | 4,190 | 4,909 (+17%) |

### In hindsight: the five papers with the greatest long-term impact

Looking back from 2026, five papers from the top NLP conferences of 2023 had the deepest long-term impact:

1. **FActScore** (EMNLP 2023)—became the standard framework for subsequent research on LLM factuality and has been cited more than 600 times.
2. **Label Words are Anchors** (EMNLP 2023 Best Paper)—a milestone in research on in-context learning mechanisms.
3. **HackAPrompt** (EMNLP 2023 Best Paper)—launched the systematic study of prompt injection.
4. **Self-RAG** (EMNLP 2023)—influenced the design of nearly every subsequent adaptive RAG system.
5. **SCOTT / Symbolic CoT Distillation** (ACL 2023)—made practical improvements to small-model reasoning possible through CoT distillation.

---

## References

- [ACL 2023 Best Papers (official page)](https://2023.aclweb.org/program/best_papers/)
- [EMNLP 2023 Best Papers (official page)](https://2023.emnlp.org/program/best_papers/)
- [EACL 2023 Best Paper Awards (official page)](https://2023.eacl.org/program/best-paper/)
- [ACL 2023 Peer Review Report (Program Chairs' report)](https://2023.aclweb.org/blog/review-report/)
- [Program Chairs' Report on Peer Review at ACL 2023 (ACL Anthology PDF)](https://aclanthology.org/2023.acl-long.report.pdf)
- [ACL 2023 Acceptance Recommendations (official blog)](https://2023.aclweb.org/blog/overall-recommendation/)
- [EMNLP 2023 proceedings preface (ACL Anthology)](https://aclanthology.org/2023.emnlp-main.0.pdf)
- [GitHub—Top-Conference-Best-Papers (award-winning papers from 2022–2026)](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [FActScore: Fine-grained Atomic Evaluation of Factual Precision (ACL Anthology)](https://aclanthology.org/2023.emnlp-main.741/)
- [World-to-Words: Grounded Open Vocabulary Acquisition (ACL Anthology)](https://aclanthology.org/2023.acl-long.31/)
- [SCOTT: Self-Consistent Chain-of-Thought Distillation (ACL Anthology)](https://aclanthology.org/2023.acl-long.304/)
- [Minding Language Models' (Lack of) Theory of Mind (ACL Anthology)](https://aclanthology.org/2023.acl-long.780/)
- [ACL 2023 Paper Picks (Megagon Labs)](https://megagonlabs.medium.com/acl-2023-paper-picks-1658115925ff)
