---
title: "Reading CMU 10-423 Generative AI: Series Overview — All 26 Lecture Decks and Four Homeworks Are Public, the Videos Stay Behind Panopto"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 0
tldr: "CMU 10-423/623/723 is the generative AI course co-taught by Matt Gormley and Aran Nayebi. The Spring 2026 edition covers text models, image generation, adapting foundation models, multimodal models, scaling, and advanced topics in 26 lectures. The slides, the HW1–HW4 handouts and starter code, a practice exam with solutions, and the project handout are all public, which earns an A3 rating. What you cannot get: the Panopto recordings, the HW0 handout, the HW3/HW4 recitation slides, the quizzes, and Gradescope grading. The homework policy is worth a look on its own: every assignment is submitted twice, first as human-only work, then with AI allowed."
description: "Series overview for CMU 10-423/623/723 Generative AI (Spring 2026): what the course covers, prerequisites, how the three course numbers differ, grading, the Slot A / Slot B AI-use policy, a map of the 6 units and 26 lectures, the A3 access rating with a gap table, compute needs for the four homeworks, a self-study path, and related series on this site."
draft: false
glossary:
  - term: "Slot A / Slot B"
    definition: "CMU 10-423's homework submission system. Every assignment has two deadlines. Slot A accepts human-only work with no AI assistance. After grading, staff tell you which questions you missed, and three days later Slot B is due: AI assistance and full collaboration are allowed, but only the questions you got wrong in Slot A are regraded. Each question keeps the higher of the two scores."
    context: "Defined in the Homework section of the Spring 2026 syllabus; Lecture 1 also spends a slide on it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

> **Edition note**: This series follows the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/). It is the latest complete term in 2025–2026: the last schedule entry is the April 30 final report deadline, and the footer reads "Last updated April 20, 2026." `10423-f26/` returns 404, so there is no Fall 2026 site. Every fact was checked on 2026-09-30 against the course homepage, the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html) and [Previous](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html) pages, and the slide and homework files. Access rating: **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)).

**Series position**: this is the overview | Next: [L1: RNN language models and autodiff (with HW0)](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en)

CMU 10-423 is the generative AI course in Carnegie Mellon's Machine Learning Department. In Spring 2026 it was co-taught by [Aran Nayebi](https://anayebi.github.io/) and [Matt Gormley](http://www.cs.cmu.edu/~mgormley/). One class carries three course numbers, 10-423, 10-623 and 10-723. The content is identical; what you have to turn in differs.

The course description is broad. It covers how to build generative models and other large foundation models (transformers for vision and language, diffusion models), how to train them (pre-training, fine-tuning) and adapt them efficiently (adapters, in-context learning), how to scale to massive datasets (multi-GPU and distributed optimization), how to use existing models day to day (generating code, coding with a generative model in the loop), and what can go wrong (bias, hallucination, adversarial attacks, data contamination) along with ways to fight it.

This post answers three questions: what the course teaches, what an outside reader can actually get, and how to study it on your own. Lecture details come in the later posts.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## The hard facts

| Item | Spring 2026 |
|---|---|
| Instructors | Aran Nayebi, Matt Gormley |
| Meetings | MWF 2:00–3:20 PM (DH 2210); lectures on Mondays and Wednesdays, occasional recitations on Fridays |
| Prerequisites | One of 10301, 10315, 10601, 10701, 10715, 11485, 11685, 11785 |
| Textbook | None; readings are free papers and book chapters online |
| Homework language | Python |
| Past sites | Fall 2025, Spring 2025, Fall 2024, Spring 2024 (Previous page) |

The prerequisite list has two tracks: intro machine learning (10-301/315/601/701/715) or intro deep learning (11-485/685/785). Lecture 1 adds a note: deep learning and PyTorch are **not** required. Depending on which prerequisite you took and when, you may or may not have seen them, and either way is fine.

This site has guides to both tracks: [Reading CMU 10-301](/posts/learning/2026-08-22-cmu-10301-overview-en) and [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en).

## How the three course numbers differ

The syllabus is blunt: the three courses are identical in content, except that 10-623 students also do HW623 and 10-723 students do HW623 and Quiz723.

| Course | Homework | Quizzes | Programming tests | Exam | Project | Participation |
|---|---|---|---|---|---|---|
| 10-423 | 30% (5 total) | 10% (6, lowest at half weight) | 10% (2) | 20% (1) | 25% | 5% |
| 10-623 | 30% (6 total, incl. HW623) | 10% (same) | 10% | 20% | 25% | 5% |
| 10-723 | 30% (6 total) | 10% (6, equal weight) | 10% | 20% | 25% | 5% |

"5 homeworks" means HW0 through HW4. According to the homework table in Lecture 1, HW623 asks you to read and analyze a recent generative AI paper and present it on video.

Two pieces of official material disagree with each other. Go by the homepage syllabus:

- Lecture 1's "Syllabus Highlights" slide says "40% homework" with no programming tests, and its "Reminders" slide lists HW0 as out on August 27. Those look carried over from an earlier term. Lecture 2 already has the Spring 2026 dates (out January 14, due January 26), matching the schedule.
- The Coursework page says "There will be 5 quizzes," then lists Quiz 1 through Quiz 6. The syllabus says 6.

## Homework policy: yourself first, AI second

The course's most distinctive design is the two-stage homework submission. The syllabus's reasoning: the most important learning in the course happens while you struggle through hard homework problems.

- **Slot A (human work only)**: individual work with limited collaboration and no AI assistance of any kind. Staff grade it and tell you which questions you missed. Office hours and Piazza are only active during Slot A.
- **Slot B (AI assistance and full collaboration allowed)**: due three days after you get feedback. Only the questions you missed in Slot A are regraded.
- **Score**: each question keeps the higher of the two scores, with a bonus for scoring above half in Slot A.

<details>
<summary>The full formula from the syllabus</summary>

$$
s = 0.95 \times \sum_{q \in HW} \max(s_{A,q}, s_{B,q}) + 0.05 \times \mathbb{1}(s_A > 0.50)
$$

$s_{A,q}$ and $s_{B,q}$ are your scores on question $q$ in each slot, and $s_A$ is your Slot A total.

</details>

Submitting AI-assisted work to Slot A as human work counts as an academic integrity violation, with penalties up to failing the course. Late rules apply to Slot B only. Slot A accepts no late work and no grace days. Slot B loses 25% per day late, down to 25% credit on day three, and you get 6 grace days for the semester.

Lecture 1 spends several slides defending this design, including one candid concession. Yes, these problems are easy for an LLM or a coding agent. But to use a code assistant well on a problem nobody has solved, you need to read lots of generated code, spot bugs in code that looks correct, and state clearly what the problem is.

**What this means for self-learners**: nobody will grade your Slot A, but you can keep the same order. Do a full pass without AI, find your mistakes against the practice exam solutions or the unit tests, then bring in AI to fix them.

## Map of the 6 units and 26 lectures

The schedule groups the 26 lectures into 6 units, and each homework covers only the lectures before it: HW1 covers L1–L4, HW2 L5–L8, HW3 L9–L12, HW4 L12–L14. This series follows that rhythm and closes each unit with a homework post.

| Unit | Lectures | Posts in this series |
|---|---|---|
| Generative models of text | L1 RNN LMs / Autodiff; L2 Transformer LMs; L3 Learning LLMs / Decoding; L4 Pre-training, fine-tuning / Modern Transformers | [1 RNN LMs and autodiff](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en), [2 Transformer LMs and decoding](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en), [3 Modern Transformers](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en), [4 HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) |
| Generative models of images | L5 CNNs / Encoder-only Transformers / ViT; L6 GANs / PGM; L7–L8 Diffusion models | [5 CNN/BERT/ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en), [6 GANs](/posts/ai/2026-09-30-cmu10423-gans-en), [7 Diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models-en), [8 VI and VAEs](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en), [9 HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) |
| Applying and adapting foundation models | L9 VAEs; L10 Parameter-efficient fine tuning; L11 In-Context Learning / Prompt Engineering / Instruction Fine-tuning / RLHF | [10 PEFT and ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en), [11 IFT/RLHF/DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en), [12 HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en) |
| Multimodal foundation models | L12 DPO / Text-to-image / Latent diffusion; L13 Vision-language models; L14 Cross-Attention / DiT / Prompt-to-Prompt | [13 Text-to-image and VLMs](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en), [14 Cross-attention/DiT/Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en), [15 HW4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) |
| Scaling Up | L15 Querying Transformer / Scaling Laws; L16 Mixture of Experts; L17 Distributed training; L18 Flash Attention / Efficient decoding | [16 Scaling laws and MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en), [17 Distributed training and efficient inference](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en) |
| Advanced Topics | L19 Long Context; L20 Reasoning Models; L21 State Space / Hybrid Models; L22 Real-world Issues; L23 Code Generation / Autonomous Agents; L24 Audio; L25 Video; L26 Interactive World Models + Science of Alignment | [18 Long context and SSMs](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en), [19 Reasoning models](/posts/ai/2026-09-30-cmu10423-reasoning-models-en), [20 Risks and alignment](/posts/ai/2026-09-30-cmu10423-risks-alignment-en), [21 Code generation and agents](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en), [22 Audio, video and world models](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en) |

The last post, [23 Practice exam, HW623 and the final project](/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en), wraps up.

Three lecture decks span two topics: L9 is named `vae-icl`, L12 `dpo-text2img`, and L15 `querying-scaling`. This series splits each by topic across two posts, so posts and lectures do not map one to one.

## Assessment timeline

| Date (2026) | Event |
|---|---|
| 1/14 | HW0 out |
| 1/26 | HW0 Slot A due, HW1 out |
| 1/28 | Quiz 1 (L1–L4) |
| 2/9 | HW1 Slot A due, HW2 out |
| 2/16 | Quiz 2 (L5–L9) |
| 2/21 | HW2 Slot A due, HW3 out |
| 2/25 | Programming test HW1/HW2, Quiz 3 (L9–L12) |
| 3/12 | HW3 Slot A due, HW4 out |
| 3/16 | Quiz 4 (L12–L15) |
| 3/23 | HW4 Slot A due, HW623 and practice problems out |
| 3/27 | Programming test HW3/HW4 |
| 3/30 | Exam (evening) |
| 4/3, 4/13 | Project proposal and midway report due |
| 4/6, 4/20 | Quiz 5 (L16–L20) and Quiz 6 (L21–L24); HW623 due 4/20 |
| 4/26–4/30 | Project poster due, final presentations, final report due |

There are no programming homeworks after L15. The second half is assessed through Quizzes 5–6, HW623 and the project, which is done in teams of three over the last four weeks.

## Access rating: A3, with the gaps spelled out

The course rates A3 because the core self-study material is all there. You get slides for all 26 lectures (the schedule links 40 PDFs; 13 are inked versions from class, and L26 has two decks), HW1–HW4 zips (handout PDF, starter code, unit tests, LaTeX template), a read-only Overleaf template per homework, the HW623 handout, [a practice exam with solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf), and the [project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf).

The practice exam is the Spring 2026 version: 41 pages, 167 points, 13 questions, running from AutoDiff/RNN-LMs to Scaling Laws. It works well as a self-check for each unit.

What was unavailable when tested on 2026-09-30:

| Material | Status | Effect |
|---|---|---|
| Lecture and recitation recordings | On SCS Panopto; the schedule says "Andrew ID Required" and asks you to sign in through Canvas; the livestream link is on Piazza | The whole series is written from slides |
| Past recordings | The four past sites (F25, S25, F24, S24) also link only to Panopto, with no public videos | No older videos to fall back on |
| HW0 PyTorch Primer handout | Google Drive link returns 401 | Only the public HW0 recitation Colab is readable |
| HW1 recitation slides | Public Google Slides | Readable |
| HW1 Supplemental Material | Drive returns 401 | Missing |
| HW2 recitation slides | Public Google Slides | Readable |
| HW3, HW4 recitation slides | Return 401 | Flagged in the homework posts |
| Whiteboard notes | The schedule mentions a OneNote notebook, but the link is empty | Missing |
| Gradescope, 6 quizzes, 2 programming tests, the real exam, Piazza | Enrolled students only | No grading; self-assess with the practice exam solutions and unit tests |

Also, from L9 onward most schedule entries list no readings. This series leaves that as is and cites only the slides, without inventing reading lists.

## Compute needs for the four homeworks

| Homework | Topic (per Lecture 1) | Verified environment notes |
|---|---|---|
| HW0 | PyTorch Primer: image and text classifiers | Handout returns 401; the recitation Colab covers PyTorch, LSTMs, Weights & Biases and einops |
| HW1 | Large Language Models: add GQA and RoPE to a Transformer LM | Handout due 2/9, 62 points; includes setup notes for Colab (free T4) and Kaggle (30 free hours of T4/V100 per week) |
| HW2 | Image Generation: diffusion model | Checked separately in the HW2 post |
| HW3 | Adapters for LLMs: GPT-2 + LoRA | Handout due 3/12, 66 points; ships `run_in_colab.ipynb` and `wandb_api.json`; the handout notes Colab's free T4 |
| HW4 | Multimodal Foundation Models: text-to-image | Handout due 3/23, 79 points; ships `download_data.sh` and `run_in_cloud.ipynb`; the handout recommends claiming Colab Pro with a CMU email and using an A100 when available |

The Colab Pro tip for HW4 needs a CMU email, so outside readers will have to find their own GPU. Details are in each homework post.

## A self-study path

**If you only want the concepts**: read the slides in schedule order and, after each unit, attempt the matching practice exam questions. You can follow without doing the homework, but you will miss the heaviest part of the course.

**If you want to do the homework**:

1. Run the [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing) first to make sure PyTorch and W&B work for you.
2. After each unit's slides, do the matching homework: HW1 → HW2 → HW3 → HW4. Write the written parts yourself first, Slot A style, and check the programming parts with the unit tests in the zip.
3. After all four homeworks, take the practice exam, then check the solutions.
4. The second half (L15–L26) has no homework. Pick a topic and run a small project in the format of the [project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf).

**One thing to do tonight**: open the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), download the L1 slides, and run the first cell of the HW0 recitation Colab.

## Further reading

This course overlaps with several series on this site. Every post in this series stands on its own; the links below are for going deeper:

- Building language models from scratch, scaling, parallelism and inference: [Reading Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)
- Transformers, LLM training, preference tuning and agents: [Reading Stanford CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en)
- The math of diffusion and flow matching: [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)
- The systems side of LLMs (CUDA, distributed training, serving): [Reading CMU 11-868](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)
- Prerequisites: [Reading CMU 10-301](/posts/learning/2026-08-22-cmu-10301-overview-en), [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 10-423/623/723 Generative AI homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/): course description, learning outcomes, prerequisites, grading, Slot A/B policy, late rules
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): 26 lectures, 6 units, readings, homework and quiz dates, Panopto notes
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html): HW0–HW4, HW623, quiz coverage, practice exam, project milestones
- [Previous Course Homepages](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html): four past sites from Fall 2025 back to Spring 2024
- [Lecture 1 slides: Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf): homework table, prerequisite notes, the case for the homework policy
- [Lecture 2 slides: Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf): Spring 2026 HW0 dates
- [HW1 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip), [HW3 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip), [HW4 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip): due dates, point totals, compute notes
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf): Spring 2026, 41 pages, 167 points, 13 questions
- [Project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
