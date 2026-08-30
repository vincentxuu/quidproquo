---
title: "2021 AI Conference Guide: Natural Language Processing"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2021", prompt-tuning, parameter-efficient]
lang: en
tldr: "2021 marked NLP’s shift from fine-tuning an entire model to adapting only a small fraction of its parameters. Prefix-Tuning at ACL, LoRA on arXiv, and Prompt Tuning at EMNLP all appeared that year; ACL Rolling Review launched; and the Findings track established itself as a second publication channel."
description: "A guide to the Best Papers, influential research, and defining trends from ACL-IJCNLP, EMNLP, and NAACL in 2021: the birth of parameter-efficient fine-tuning, the launch of ACL Rolling Review, the role of Findings, and changes in submission volume and peer review."
draft: false
series:
  name: "AI 頂會導讀"
  order: 7
glossary:
  - term: "parameter-efficient fine-tuning"
    definition: "Adapting a pretrained model to downstream tasks by tuning only a small set of added or low-rank parameters instead of updating every model parameter. Prefix-Tuning, LoRA, and Prompt Tuning in 2021 were foundational papers in this direction."
    context: "The NLP conference trend from 2021 with the greatest long-term influence."
  - term: "ACL Rolling Review (ARR)"
    definition: "A shared rolling-review platform for ACL-family conferences. Papers enter a common review pool first; after review, authors choose a specific conference to commit them to. It opened for submissions for the first time in May 2021."
    context: "ACL 2021 itself did not use ARR, but EMNLP 2021 began piloting an ARR submission path."
  - term: "Findings"
    definition: "A second publication channel for ACL-family conferences. Papers pass peer review and meet a quality standard but do not reach the main-track acceptance threshold. EMNLP introduced it in 2020; by 2021 it was a regular mechanism at ACL, EMNLP, and NAACL."
    context: "Findings of EMNLP 2021 accepted 419 papers."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2021-nlp)

The leading NLP conferences of 2021 shared a subtle but profoundly influential theme: **stop fine-tuning the entire model**. Prefix-Tuning, LoRA, and Prompt Tuning all appeared that year. Each became part of the standard toolkit for parameter-efficient adaptation. ACL Rolling Review also launched in 2021, beginning a change in how NLP papers were submitted and reviewed.

This article covers the Best Papers, most influential work, and research trends from ACL-IJCNLP, EMNLP, and NAACL in 2021.

## ACL-IJCNLP 2021

ACL 2021 and IJCNLP 2021 were held jointly as the fully online ACL-IJCNLP 2021 from August 1–6. The conference received 3,350 submissions, accepted 710, and had a 21.2% acceptance rate.

### Best Paper Awards

**Best Paper**

- **Vocabulary Learning via Optimal Transport for Neural Machine Translation**  
  Jingjing Xu and Hao Zhou (ByteDance AI Lab), Chun Gan (UW–Madison), Zaixiang Zheng (Nanjing University), and Lei Li (UCSB)  
  The paper reframed vocabulary construction for machine translation as an optimal transport problem. Its VOLT algorithm found effective vocabularies without expensive trial training and ran 100 times faster than traditional methods.

**Best Theme Paper**

- **Including Signed Languages in Natural Language Processing**  
  Kayo Yin, Amit Moryossef, Julie Hochgesang, Yoav Goldberg (Bar-Ilan / AI2), and Malihe Alikhani  
  The authors argued that the NLP community should include signed languages within its research scope, analyzing their distinctive linguistic structures and the shortcomings of existing NLP tools.

### Selected Outstanding Papers

- **All That's 'Human' Is Not Gold: Evaluating Human Evaluation of Generated Text**  
  Elizabeth Clark, Tal August, Sofia Serrano, Nikita Haduong, Suchin Gururangan, and Noah A. Smith (University of Washington / AI2)  
  The paper showed that human evaluators often could not distinguish human-written from machine-generated text. The quality of human evaluation itself should not be assumed to be a gold standard.

- **Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning**  
  Armen Aghajanyan, Sonal Gupta, and Luke Zettlemoyer (Meta)  
  The authors found that fine-tuning pretrained language models works because task adaptation requires movement only within a low-dimensional subspace. This observation directly supported later low-rank methods such as LoRA.

- **UnNatural Language Inference**  
  Koustuv Sinha, Prasanna Parthasarathi, Joelle Pineau, and Adina Williams (McGill / Mila / FAIR)  
  NLI models still scored well on “unnatural” sentences with scrambled word order, suggesting that they may have exploited surface features such as lexical overlap instead of truly understanding meaning.

- **Scientific Credibility of Machine Translation Research: A Meta-Evaluation of 769 Papers**  
  Benjamin Marie, Atsushi Fujita, and Raphael Rubino (NICT)  
  A systematic review of experimental methodology in 769 machine-translation papers found serious shortcomings in statistical significance testing, baseline comparisons, and reproducibility across a large portion of the literature.

### The Most Enduringly Influential ACL 2021 Papers

Several ACL 2021 papers accumulated far more citations and practical influence than the Best Paper winners. They set the direction for the following years:

- **Prefix-Tuning: Optimizing Continuous Prompts for Generation**  
  Xiang Lisa Li and Percy Liang (Stanford)  
  Instead of fine-tuning the model, Prefix-Tuning learned a set of prefix vectors inserted before the keys and values at every Transformer layer. It became a foundational paper in parameter-efficient fine-tuning and inspired P-Tuning, P-Tuning v2, and related methods.

- **On the Effectiveness of Adapter-based Tuning for Pretrained Language Model Adaptation**  
  Ruidan He et al. (ACL 2021 Long Paper)  
  A systematic comparison of inserting adapter modules at different positions in a Transformer, establishing experimental baselines for later adapter-based methods.

- **Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in Natural Language Processing**  
  Pengfei Liu, Weizhe Yuan, Jinlan Fu, Zhengbao Jiang, Hiroaki Hayashi, and Graham Neubig (CMU)  
  Released around ACL 2021, with the formal version later appearing in ACM Computing Surveys, this was the first large-scale survey of prompt-based learning. It defined the terminology of the new “pre-train, prompt, predict” paradigm.

## EMNLP 2021

EMNLP was held in a hybrid online and in-person format in Punta Cana, Dominican Republic, from November 7–11. It received 3,600 submissions, accepted 840 main-track papers (23.3%), and accepted another 419 papers to Findings (11.6%). EMNLP 2021 was also the first conference to pilot an ACL Rolling Review submission path. Seventeen papers were submitted through ARR, six of which reached the main track.

### Best Paper Awards

**Best Long Paper**

- **Visually Grounded Reasoning across Languages and Cultures**  
  Fangyu Liu (Cambridge), Emanuele Bugliarello (Copenhagen), Edoardo Maria Ponti (Mila / McGill), Siva Reddy (Mila / McGill), Nigel Collier (Cambridge), and Desmond Elliott (Copenhagen)  
  The MaRVL dataset made visual reasoning genuinely cross-lingual and cross-cultural: native speakers selected the images and descriptions instead of translating them from English. Existing multilingual multimodal models suffered sharp performance drops in non-English cultural contexts.

**Best Short Paper**

- **CHoRaL: Collecting Humor Reaction Labels from Millions of Social Media Users**  
  Zixiaofan Yang, Shayan Hooshmand, and Julia Hirschberg (Columbia)  
  CHoRaL collected humor labels from large-scale user reactions on social media rather than from a small pool of annotators, proposing a low-cost, high-diversity annotation methodology.

### Selected Outstanding Papers

- **Mindcraft: Theory of Mind Modeling for Situated Dialogue in Collaborative Tasks**  
  Cristian-Paul Bara, Sky CH-Wang, and Joyce Chai (Michigan / Columbia)  
  The work modeled theory of mind in situated dialogue for collaborative tasks, enabling an agent to infer another person’s intentions and beliefs.

- **When Attention Meets Fast Recurrence: Training Language Models with Reduced Compute**  
  Tao Lei (ASAPP)  
  An architecture that combined fast recurrence with attention to greatly reduce training compute while maintaining performance.

- **SituatedQA: Incorporating Extra-Linguistic Contexts into QA**  
  Michael Zhang and Eunsol Choi (UT Austin)  
  SituatedQA showed that question-answering systems must account for context such as the time and place of a question because the same question can have entirely different answers in different situations.

### The Most Enduringly Influential EMNLP 2021 Papers

- **The Power of Scale for Parameter-Efficient Prompt Tuning**  
  Brian Lester, Rami Al-Rfou, and Noah Constant (Google)  
  The paper showed that prompt-only tuning approaches full fine-tuning as models grow. On the 11-billion-parameter T5-XXL, the gap nearly disappeared. Together with Prefix-Tuning at ACL, it established the parameter-efficient direction.

- **Finetuned Language Models Are Zero-Shot Learners (FLAN)**  
  Jason Wei et al. (Google Brain)  
  FLAN fine-tuned a language model on instruction templates from many NLP tasks, allowing it to perform unseen tasks zero-shot. It directly inspired the line of instruction-following models that included InstructGPT and ChatGPT. Although the formal paper appeared at ICLR 2022, its arXiv preprint and community discussion centered on the second half of 2021 around EMNLP.

## NAACL 2021

NAACL was held online from June 6–11 instead of at its planned venue in Mexico City. It received 1,797 submissions and accepted 499 papers.

### Best Paper Awards

**Best Long Paper**

- **Video-aided Unsupervised Grammar Induction**  
  Songyang Zhang, Linfeng Song, Lifeng Jin, Kun Xu, Dong Yu, and Jiebo Luo (Rochester / Tencent AI Lab)  
  The paper used video as an additional signal for unsupervised grammar induction. Without linguistic annotations, visual grounding from video helped the model learn better grammatical structure.

**Selected Outstanding Long Paper**

- **It's Not Just Size That Matters: Small Language Models Are Also Few-Shot Learners**  
  Timo Schick and Hinrich Schütze (LMU Munich)  
  Small models combined with carefully designed prompts and pattern-exploiting training, or PET, matched or exceeded large models in few-shot settings, challenging the assumption that few-shot learning required enormous models.

**Best Short Paper**

- **Learning How to Ask: Querying LMs with Mixtures of Soft Prompts**  
  Guanghui Qin and Jason Eisner (Johns Hopkins)  
  The authors queried language models with learned mixtures of soft prompts instead of hand-designed prompts, an important early contribution to soft prompting.

### Other Notable NAACL 2021 Papers

- **Factual Probing Is [MASK]: Learning vs. Learning to Recall**  
  Zexuan Zhong, Dan Friedman, and Danqi Chen (Princeton)  
  The paper questioned the reliability of the common practice of probing language-model knowledge with cloze-style prompts, arguing that the model might simply learn to recall surface patterns from training data.

## Highly Influential NLP Papers from 2021 That Were Not Yet Formally Published at a Top Conference

Some papers appeared as arXiv preprints in 2021 and were formally published in 2022 or later, yet their influence was already spreading that year:

- **LoRA: Low-Rank Adaptation of Large Language Models**  
  Edward J. Hu et al. (Microsoft)  
  LoRA added a low-rank bypass alongside a Transformer’s weight matrix and trained only the pair of small matrices. It appeared on arXiv in June 2021 and was formally published at ICLR 2022. By 2026 it had accumulated more than 14,000 citations, the most of any parameter-efficient fine-tuning paper, and had become a standard practice for deploying large models in industry.

- **Multitask Prompted Training Enables Zero-Shot Task Generalization (T0)**  
  Victor Sanh et al. (Hugging Face / BigScience)  
  A parallel effort contemporary with FLAN, T0 also fine-tuned across tasks with natural-language instructions, but released both the model and dataset, including T0 and the P3 prompt collection. It had a lasting effect on the open-source LLM ecosystem and was formally published at ICLR 2022.

## Overall Observations on NLP in 2021

### The Birth Year of Parameter-Efficient Fine-Tuning

2021 was the first year of PEFT. Prefix-Tuning at ACL, Prompt Tuning at EMNLP, LoRA on arXiv and later at ICLR 2022, and P-Tuning on arXiv and later at ACL 2022 appeared almost simultaneously. They shared one observation: adapting a pretrained model to a task requires movement only in a low-dimensional subspace, as Aghajanyan et al.’s intrinsic-dimensionality paper explained theoretically. This was not a gradual trend. Before 2020, full-model fine-tuning was nearly the only approach. After 2021, tuning only a small fraction became an active research direction and an industry standard.

### The Starting Point for Instruction Tuning

FLAN and T0, two parallel efforts published at nearly the same time, independently found the same result: fine-tuning a language model with natural-language instructions enables it to generalize to unseen tasks. That finding led directly to InstructGPT in 2022, ChatGPT at the end of 2022, and the broader instruction-following LLM ecosystem. The path began in 2021.

### The Reliability of Human Evaluation Came Under Question

ACL 2021’s Outstanding Paper All That's 'Human' Is Not Gold, together with related NAACL work, showed that human evaluators may be far worse than expected at distinguishing human-written from machine-generated text. That was particularly important in 2021, when GPT-3 could already produce high-quality prose. If people could not tell the difference, the gold standard of human evaluation itself required renewed scrutiny.

### ACL Rolling Review Officially Launched

ACL Rolling Review opened its first submission cycle in May 2021. It represented a major change in NLP peer review: independent review at each conference gave way to a shared rolling-review process across conferences. EMNLP 2021 was the first pilot, receiving 17 papers through ARR. By 2024, ACL, EACL, NAACL, and EMNLP had all adopted ARR as their only submission system.

### The Findings Track Became Established

EMNLP introduced Findings in 2020. By 2021 it had become a regular mechanism at ACL and EMNLP. Findings of EMNLP 2021 accepted 419 papers, or 11.6% of submissions, while the main track accepted 840, or 23.3%. Across both channels, more than one-third of submissions received some form of publication. The second channel’s role remained contested because it had a higher acceptance rate and lower prestige. It nevertheless reduced pressure from falling main-track acceptance rates and gave solid work that was not considered sufficiently “top-tier” a formal, peer-reviewed publication path.

### Submission Volume Was Still Manageable

The 2021 submission counts—3,350 for ACL, 3,600 for EMNLP, and 1,797 for NAACL—look modest today. By 2025, ACL submissions had risen to 8,360, up 150%, and EMNLP reached 8,174, up 127%. 2021 was the eve of the submission explosion; the immense pressure created by the LLM boom did not arrive in full until 2023–2024.

---

## References

- [ACL-IJCNLP 2021 Paper Awards (official)](https://2021.aclweb.org/program/accept)
- [NAACL 2021 Best Paper Awards (official)](https://2021.naacl.org/blog/best-paper-awards)
- [EMNLP 2021 Conference Handbook (ACL Anthology PDF)](https://aclanthology.org/2021.emnlp.handbook.pdf)
- [EMNLP 2021 Best Papers—Awesome Award-Winning Papers (GitHub)](https://github.com/Aiah/Awesome-Award-Winning-Papers)
- [ACL Rolling Review official blog](http://aclrollingreview.org/blog)
- [ACL Admin Wiki—2022Q1 Reports: ACL Rolling Review (statistics for the first ten ARR cycles)](https://www.aclweb.org/adminwiki/index.php/2022Q1_Reports:_ACL_Rolling_Review)
- [OpenAccept.org—historical EMNLP submission and acceptance statistics, including Findings](https://openaccept.org/c/ai/emnlp)
- [The best NLP papers of 2021](https://thebestnlppapers.com/nlp/papers/2021)
- [NAACL 2021 Conference Structure (official)](https://2021.naacl.org/blog/conference-structure)
- [EMNLP 2021: latest trends in NLP—Frank Schilder, Medium](https://medium.com/@schilderf/emnlp-2021-latest-trends-in-nlp-bacd163cce0d)
- [Quality of ACL "Findings": analysis of citations—KInIT](https://kinit.sk/quality-of-acl-findings-analysis-of-citations)
