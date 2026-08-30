---
title: "2022 AI Conference Guide: Natural Language Processing"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2022", chain-of-thought, instruction-tuning, rlhf]
lang: en
tldr: "2022 marked NLP’s shift from demonstrating model capabilities toward aligning and controlling them. InstructGPT brought RLHF into the mainstream, Chain-of-Thought showed that prompts could unlock reasoning, and Flan 2022 matured instruction-tuning methodology. ACL and NAACL adopted ARR as their sole review path, exposing infrastructure and reviewer-load problems. ChatGPT launched at year-end and rewrote the rules of NLP research."
description: "A guide to the Best Papers and defining trends from ACL, EMNLP, and NAACL in 2022: the academic impact of InstructGPT and RLHF, Chain-of-Thought reasoning, mature instruction tuning, the pain of fully adopting ARR, and ChatGPT’s impact on NLP research."
draft: false
series:
  name: "AI 頂會導讀"
  order: 11
glossary:
  - term: "chain-of-thought prompting"
    definition: "A prompting technique that asks a large language model to produce intermediate reasoning steps before its final answer. Jason Wei and colleagues at Google published it at NeurIPS 2022, showing large gains on mathematical and commonsense reasoning."
    context: "One of the most influential methodological innovations in NLP in 2022."
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback: training a reward model on human preferences, then fine-tuning a language model with a reinforcement-learning algorithm such as PPO. InstructGPT was the first large-scale validation of the pipeline and became the technical basis of ChatGPT."
    context: "InstructGPT at NeurIPS 2022 turned RLHF from an academic idea into production technology."
  - term: "instruction tuning"
    definition: "Fine-tuning a language model across many NLP tasks in an instruction-plus-input-to-output format so it can infer new tasks from their descriptions. FLAN and T0 established the direction in 2021; Flan 2022 systematized mixed zero-shot, few-shot, and CoT training."
    context: "2022 was the key year in which instruction-tuning methodology matured."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2022-nlp)

NLP in 2022 had two worlds: before year-end and after it. Before December, academia still focused on conventional benchmark gains and methodological improvements. After ChatGPT launched in December, almost everyone reconsidered what NLP research could still contribute. In retrospect, however, ChatGPT’s foundations—RLHF, instruction tuning, and chain-of-thought—were already in place in the year’s top-conference papers.

This article reviews the Best Papers, most influential work, and research trends from ACL, EMNLP, and NAACL in 2022.

## ACL 2022

The 60th ACL Annual Meeting ran May 22–27 in Dublin in hybrid form. About 50% of attendees joined in person, the first return to a physical venue since 2019. ACL received 3,378 submissions and accepted 701 papers—604 long and 98 short—for a 20.8% acceptance rate. Findings accepted another 332.

It was the **first ACL to use ACL Rolling Review as its sole submission path**. Authors submitted to ARR, received reviews, and then committed to ACL 2022. The later section on ARR covers the transition’s difficulties.

### Best Paper Awards

**Best Paper**

- **Learned Incremental Representations for Parsing**  
  Nikita Kitaev, Thomas Lu, and Dan Klein (UC Berkeley / Microsoft Semantic Machines)  
  The authors designed a maximally non-anticipatory incremental representation for parsing, allowing a parser to make structural decisions as each word arrived instead of waiting for the complete sentence. The idea drew on cognitive science: human language comprehension is immediate and incremental.

**Best Special Theme Paper**

- **Requirements and Motivations of Low-Resource Speech Synthesis for Language Revitalization**  
  Aidan Pine, Dan Wells, Nathan Brinklow, Patrick William Littell, and Korin Richmond  
  The researchers used qualitative interviews in endangered-language communities to identify their real needs for speech synthesis instead of judging success with standard NLP metrics. The communities’ constraints and goals did not match developers’ common assumption that simply gathering more data was sufficient.

**Best Resource Paper**

- **DiBiMT: A Novel Benchmark for Measuring Word Sense Disambiguation Biases in Machine Translation**  
  Niccolò Campolungo, Federico Martelli, Francesco Saina, and Roberto Navigli (Sapienza University of Rome)  
  DiBiMT was the first benchmark dedicated to word-sense-disambiguation bias in machine translation: how often a system chooses the wrong meaning when the contextually correct sense of an ambiguous word is not its most common one.

**Best Linguistic Insight Paper**

- **KinyaBERT: a Morphology-aware Kinyarwanda Language Model**  
  Antoine Nzeyimana and Andre Niyongabo Rubungo  
  KinyaBERT incorporated morphology at tokenization for Kinyarwanda, whose rich inflection loses substantial linguistic structure under ordinary BPE segmentation. It significantly outperformed a direct application of multilingual BERT on downstream tasks.

### Outstanding Papers

ACL also selected seven Outstanding Papers across a broader range of topics:

- **Fantastically Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity** (Yao Lu et al., UCL) exposed a basic fragility: reordering exemplars could move the same model from near-random to near-state-of-the-art performance. It proposed automatic selection of a good ordering.
- **Evaluating Factuality in Text Simplification** (Ashwin Devaraj et al., UT Austin / Northeastern) showed that simplification models introduced factual errors ignored by mainstream metrics.
- **Inducing Positive Perspectives with Text Reframing** (Caleb Ziems et al., Georgia Tech / NUS) reframed negative descriptions positively while preserving factual accuracy.
- **Ditch the Gold Standard: Re-evaluating Conversational Question Answering** (Huihan Li, Tianyu Gao et al., Princeton) questioned benchmark gold answers and found greater disagreement among annotators than between models and the gold standard.
- **Compression of Generative Pre-trained Language Models via Quantization** (Chaofan Tao et al.) quantized generative models such as GPT-2, anticipating later work on efficient large-model inference.

### Influential ACL Papers from 2022 Beyond the Award Winners

Findings accepted 332 papers, some ultimately more influential than many main-track papers. Yet most of 2022’s most influential NLP work appeared at NeurIPS or as arXiv preprints. ACL’s main-track awards leaned toward linguistics, resources, and low-resource languages. That was not a quality issue, but a structural gap: leading large-model teams then preferred NeurIPS or ICML to ACL.

## NAACL 2022

NAACL ran July 10–15 in Seattle in hybrid form. It also used ARR exclusively. ARR received 2,103 papers in its December and January rounds; 1,073 were committed to NAACL, and 442 were accepted—358 long and 84 short. Acceptance was 21.0% against all ARR submissions or 41.2% against commitments. Findings accepted another 209.

### Best Paper Awards

NAACL’s winners touched the year’s central themes of efficiency, updating, and constrained generation more directly than ACL’s.

**Best New Task Papers (tie)**

- **Automatic Correction of Human Translations** — Jessy Lin, Geza Kovacs, Aditya Shastry, Joern Wuebker, and John DeNero. The apparently counterintuitive task used machines not to replace translators but to catch subtle omissions and inconsistent terminology in real workflows. It also received an Honorable Mention for Human-Centered NLP.
- **FRUIT: Faithfully Reflecting Updated Information in Text** — Robert L. Logan IV, Alexandre Passos, Sameer Singh, and Ming-Wei Chang (UC Irvine / Google). FRUIT defined and benchmarked the task of revising existing text when a fact changes, such as a country’s population, while leaving everything else intact.

**Best Efficient NLP Paper**

- **FNet: Mixing Tokens with Fourier Transforms** — James Lee-Thorp, Joshua Ainslie, Ilya Eckstein, and Santiago Ontanon (Google Research). FNet replaced Transformer self-attention with a simple Fourier transform, greatly increasing speed with little performance loss and inspiring later alternatives to attention.

**Best New Method Paper**

- **NeuroLogic A*esque Decoding: Constrained Text Generation with Lookahead Heuristics** — Ximing Lu, Sean Welleck, Peter West et al. (University of Washington / AI2, Yejin Choi’s group). A*-style lookahead during decoding let the model account for future constraints—required or forbidden words, for example—instead of modifying output afterward.

**Best Paper on the Human-Centered NLP Special Theme**

- **User-Driven Research of Medical Note Generation Software** — Tom Knoll, Francesco Moramarco et al. The study evaluated automated medical-note software through real clinical use and feedback rather than ROUGE.

### Outstanding Papers

- **NewsEdits: A Dataset of News Article Revision Histories and a Novel Document-Level Reasoning Challenge** (Alexander Spangher et al., USC / Nanyun Peng’s group), an Honorable Mention for Resources, enabled research on how articles evolve over time.
- **Balanced Data Approach for Evaluating Cross-Lingual Transfer** (Dan Malkin et al.), an Honorable Mention for Methods.

## EMNLP 2022

EMNLP ran December 7–11 in Abu Dhabi in hybrid form. It received 4,190 submissions and accepted 829, a 19.8% rate—the lowest among the three conferences. Findings accepted 549 more, 66% as many as the main track. Gary Marcus, Neil Cohn, and Mona Diab of Meta Responsible AI delivered the three keynotes.

The timing was exceptional: ChatGPT launched on November 30. Many attendees first tried it while preparing to travel to Abu Dhabi, making EMNLP the last meeting at which the NLP community followed its old routine before absorbing the shock.

### Best Paper Awards

**Best Long Paper**

- **Abstract Visual Reasoning with Tangram Shapes**  
  Anya Ji, Noriyuki Kojima, Noah Rush, Alane Suhr, Wai Keen Vong (NYU), Robert Hawkins (Princeton), and Yoav Artzi (Cornell)  
  KiloGram used tangram shapes to study abstract visual reasoning in humans and machines. Like MaRVL, EMNLP’s 2021 Best Paper, it sat at the vision-language boundary. Pretrained multimodal models reasoned poorly in the abstract, but improved substantially after fine-tuning, especially with joint visual-language encoding. The result informed later thinking about multimodal generalization.

**Best Short Paper**

- **Topic-Regularized Authorship Representation Learning**  
  Jitkapat Sawatphol, Nonthakit Chaiwong, Can Udomcharoenchaikit, and Sarana Nutanong (VISTEC, Thailand)  
  Authorship attribution often learns topics instead of style when train and test topics differ. Authorship Representation Regularization—also abbreviated ARR, unrelated to ACL Rolling Review—used distillation to learn topic-independent author representations.

### Influential 2022 NLP Papers Outside the EMNLP Award List

Most of the year’s pivotal NLP papers did not appear at ACL, EMNLP, or NAACL.

**Key NeurIPS 2022 papers:**

- **Training Language Models to Follow Instructions with Human Feedback (InstructGPT)** (Long Ouyang et al., OpenAI) aligned GPT-3 with user intent through RLHF. The 1.3B model beat the 175B GPT-3 in human evaluation. Its findings—that preference tuning could let a small model beat a large one and that public NLP benchmarks did not reflect real use—became ChatGPT’s technical basis.
- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** (Jason Wei et al., Google Brain), among the year’s most cited NeurIPS papers, showed that intermediate reasoning sharply improved mathematics and commonsense tasks. CoT emerged only above roughly 100B parameters and led to Self-Consistency, Tree-of-Thought, and a family of reasoning methods.
- **Self-Consistency Improves Chain-of-Thought Reasoning in Language Models** (Xuezhi Wang et al., Google Brain) sampled multiple reasoning paths for one problem and selected the answer by majority vote, substantially increasing CoT reliability.

**Influential arXiv preprints:**

- **Scaling Instruction-Finetuned Language Models (Flan 2022 / Flan-PaLM / Flan-T5)** (Hyung Won Chung et al., Google) systematized instruction tuning. Mixing zero-shot, few-shot, and chain-of-thought templates beat training in only one setting across reasoning tasks. Flan-T5 became one of the open-source community’s most widely used instruction-tuned base models.
- **Training Compute-Optimal Large Language Models (Chinchilla)** (Jordan Hoffmann et al., DeepMind) overturned the intuition that larger was always better. Under fixed compute, allocating half the resources to more data was more effective than spending it on more parameters, changing how the field calculated optimal model size.
- **PaLM: Scaling Language Modeling with Pathways** (Aakanksha Chowdhery et al., Google) scaled to 540B parameters and was the first to surpass supervised state of the art few-shot on many reasoning benchmarks. Many Chain-of-Thought experiments ran on PaLM.

## ARR’s Full Launch: Growing Pains in 2022

2022 was the first year ARR served as the only submission path for both ACL and NAACL, exposing the gap between a pilot and full operation.

**Infrastructure:** ARR ran on OpenReview, designed for conferences with one deadline and one reviewer pool. ARR had monthly deadlines, pools continuing across months, and resubmission histories, none natively supported. The team had to build the engine while flying the plane, including conflict detection, automated assignment, and reminders.

**Reviewer load:** Only about 75% of reviews arrived within the one-month cycle, so ARR increased reviewers per paper from three to four, further burdening the community. Official reports noted that many qualified senior researchers—at least five relevant papers, with the latest within five years—performed no reviews.

**Confusing acceptance rates:** Decoupling review from acceptance produced two denominators: all ARR submissions, which yielded a low rate, or papers committed to a conference, which yielded a high one. NAACL’s rates were 21.0% and 41.2%, nearly double. ACL’s General Chair highlighted the issue in the handbook.

**Community pushback:** An ACL reviewing-committee survey in May–June received extensive criticism: inconsistent review quality; incomparable meta-reviews across 64 action editors; inability to freely request a new reviewer set even when authors wanted one; and an opaque process. Later changes introduced soft tracks, default approval of requests for new reviewers and a new AE on resubmission, and work on reviewer evaluation.

## Overall Observations on NLP in 2022

### From Prompting to Alignment: The Shift in Research Focus

In 2021, NLP asked how to use large models more efficiently through PEFT and prompt tuning. In 2022 it asked how to make them do the right thing. InstructGPT’s RLHF, Chain-of-Thought guidance, and Flan’s instruction-tuning methodology all addressed the same underlying issue: raw capabilities were strong, but how could they be directed toward what users actually needed?

### The Gap Between Large-Model Research and ACL-Family Conferences

Nearly all of 2022’s most influential NLP papers appeared at NeurIPS or as arXiv preprints. Best Papers at ACL, EMNLP, and NAACL concentrated on linguistic analysis, low-resource languages, benchmarks, and morphology. Traditional NLP remained important, but Google Brain, OpenAI, and DeepMind preferred NeurIPS and ICML for core large-model work, leaving ACL-family conferences searching for their role in the LLM era.

### ChatGPT’s Impact

ChatGPT launched on November 30, 2022, built technically on the InstructGPT RLHF pipeline. Its direct effects on academia included:

- **A reshuffling of research:** ChatGPT was already “good enough” at many traditional tasks such as sentiment analysis, NER, and text classification, sharply reducing the marginal value of another benchmark point.
- **An evaluation crisis:** As outputs became too good for automatic metrics to distinguish, human evaluation grew more important and more expensive.
- **Changed publication strategy:** InstructGPT appeared as a preprint in March, was formally published at NeurIPS in November, and ChatGPT launched in December. Researchers saw that the submission–review–publication–impact pipeline was too slow; impact could precede acceptance.

### Submission Growth

Main-track submissions were 3,378 for ACL, 2,103 for NAACL under the ARR denominator, and 4,190 for EMNLP. ACL was nearly flat from 2021, up 0.8%; EMNLP grew 16.4%. NAACL grew 17.0% from 1,797 in 2021, although its ARR denominator made the numbers not directly comparable.

### In Hindsight: Which 2022 Work Had the Deepest Impact?

Looking back from 2026, the five most influential NLP developments were:

1. **InstructGPT / RLHF**—directly produced ChatGPT and moved the AI industry into large-model products.
2. **Chain-of-Thought Prompting**—opened a full line of prompting-based reasoning: Self-Consistency, Tree-of-Thought, ReAct, and Chain-of-Thought with Self-Correction.
3. **Chinchilla scaling laws**—rewrote training strategy, shifting industry from the largest possible model to the optimal amount of training data.
4. **Flan 2022 / instruction-tuning methodology**—Flan-T5 became a standard open-source base, and mixed training templates were widely adopted.
5. **ChatGPT itself**—not a paper, but it changed the social context of NLP and moved alignment from an academic interest to a public concern.

Only one of the five, InstructGPT, was formally published at NeurIPS. The others were preprints or a product release. That fact itself shows how NLP publishing was changing in 2022.

---

## References

- [ACL 2022 Best Paper Awards (official announcement)](https://2022.aclweb.org/best-paper-awards.html)
- [ACL 2022 Conference Handbook (General Chair preface)](https://aclanthology.org/2022.acl.handbook.pdf)
- [ACL Anthology—ACL 2022 proceedings (604 long papers, 98 short papers, 332 Findings)](https://aclanthology.org/events/acl-2022/)
- [NAACL 2022 Best Paper Awards (official announcement)](https://2022.naacl.org/blog/best-papers/)
- [NAACL 2022 Main Conference Review Process (official Program Chair statistics)](https://2022.naacl.org/blog/review-process/)
- [ACL Anthology—NAACL 2022 proceedings (443 main-track papers, 210 Findings)](https://aclanthology.org/events/naacl-2022/)
- [ACL Anthology—EMNLP 2022 proceedings (829 main-track papers, 549 Findings)](https://aclanthology.org/events/emnlp-2022/)
- [EMNLP 2022 Proceedings Preface (PDF; Best Paper Committee explanation)](https://aclanthology.org/2022.emnlp-main.0.pdf)
- [AISB—Conference Report: EMNLP 2022 (Best Paper confirmation)](https://aisb.org.uk/conference-reports-empirical-methods-in-natural-language-processing-emnlp-2022/)
- [Ouyang et al. (2022), "Training Language Models to Follow Instructions with Human Feedback" (InstructGPT), NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/b1efde53be364a73914f58805a001731-Paper-Conference.pdf)
- [Wei et al. (2022), "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models," NeurIPS 2022](https://proceedings.neurips.cc/paper/2022/file/9d5609613524ecf4f15af0f7b31abca4-Paper-Conference.pdf)
- [Longpre et al. (2023), "The Flan Collection: Designing Data and Methods for Effective Instruction Tuning," ICML 2023](https://proceedings.mlr.press/v202/longpre23a/longpre23a.pdf)
- [Google Research Blog—"The Flan Collection: Advancing open source methods for instruction tuning"](https://research.google/blog/the-flan-collection-advancing-open-source-methods-for-instruction-tuning/)
- [Yi Tay (2023), "2022 in Review: Top language AI research papers + interesting trends"](https://www.yitay.net/blog/2022-best-nlp-papers)
- [ACL Rolling Review—Changes Based on the ACL Reviewing Survey (August 2022)](http://aclrollingreview.org/changes-based-on-the-ACL-reviewing-survey/)
- [ACL Admin Wiki—2022Q1 Reports: ACL Rolling Review](https://www.aclweb.org/adminwiki/index.php/2022Q1_Reports:_ACL_Rolling_Review)
- [ACL Rolling Review—Status Report (October 2021)](http://aclrollingreview.org/status-report/)
- [ACL 2022 Chair Blog Post—Rolling Review (official explanation of two acceptance-rate calculations)](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [FeijiangHan/Top-Conference-Best-Papers (GitHub compilation)](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
