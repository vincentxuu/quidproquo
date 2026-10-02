---
title: "Reading NTU Yun-Nung Chen's Applied Deep Learning 2025 Fall: Course Map, A2 Rating, and How to Read It"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, deep-learning, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 0
tldr: "Applied Deep Learning (ADL) Fall 2025, taught by Yun-Nung (Vivian) Chen in NTU's CSIE department, is a deep learning course built around NLP. It runs from neural network basics through Transformers, BERT, pretraining and prompting, post-training, LoRA, RAG, generation and evaluation, alignment issues, and language agents. Lectures L0–L11 come with slide PDFs and segmented videos, and the playlist adds videos for L12–L14. On the assignment side only the HW1 spec is public; HW2, HW3, and the final project have explainer videos only. That makes it A2."
description: "Entry point to the series on NTU Yun-Nung Chen's Applied Deep Learning Fall 2025 (114-1): course goals, prerequisites, grading, weekly schedule, the lecture and TA-recitation tracks, the A2 access rating and its gaps, how the Fall 2025 page differs from the in-progress Fall 2026 page, the extra L12–L14 videos on the playlist, and the full 19-post index."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

Applied Deep Learning (ADL) is taught by Yun-Nung (Vivian) Chen in the Department of Computer Science and Information Engineering (CSIE) at National Taiwan University. Its permanent URL is [adl.miulab.tw](http://adl.miulab.tw/). Despite the generic name, it is a deep learning course centered on natural language processing. It starts from "what is a neural network," moves through Transformers, BERT, and pretraining, and ends with RAG, alignment, and language agents.

This series reads **ADL Fall 2025 (NTU term 114-1, 2025/09/01–12/15)**, the most recent semester that has finished. This post is the entry point. It covers course structure, what outside readers can get, and a reading order. Technical content is left to the later posts.

**Sources**: the [Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), the [Course Logistics slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) (18 pages), the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o), the [HW1 spec slides](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing), and, for comparison, the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~miulab/f115-adl/). All were opened and checked on 2026-09-30. The matching video is [ADL 0: Course Introduction](https://youtu.be/RwRZVd9rLxE) (29:36). Lectures are delivered in Mandarin; the slides are in English.

## The hard facts

From the Course Logistics slides:

- **When and where**: Mondays 14:20–17:10 in room R103, with online delivery via YouTube and NTU COOL. The course page marks each week as Physical or Virtual.
- **Course goals** (p. 4): students should understand (1) how deep learning works; (2) how to frame tasks into learning problems; (3) how to use toolkits to implement designed models; (4) how to use pre-trained models; and (5) when and why specific learning techniques work for specific problems.
- **Positioning** (p. 5): the slide places ADL beside other NTU courses and says "ADL focus on NLP." The same slide lists the machine learning courses by Hsuan-Tien Lin, Chun-Yi Lee, and Hung-yi Lee, Yu-Chiang Frank Wang's Deep Learning for Computer Vision, and Hung-yi Lee's Deep Learning for Human Language Processing.
- **Prerequisites** (p. 7): college-level calculus and linear algebra are required; probability, statistics, and an intro AI course are preferred. You need to be comfortable in Python. All assignments are in Python and handed in through GitHub.
- **Grading** (p. 9): three individual assignments, 60% (GitHub code plus README, scored on code and report, 25% off per day late); a final group project, 35%; participation, 5%.
- **AI use** (pp. 9–10): you may ask LLMs such as ChatGPT or Gemini and reuse code from public repos, as long as you cite them in your report. You may not look at code or reports from past or current students.
- **HW0** (p. 17): before enrolling, students must watch the online lectures Introduction (1.1–1.3), NN Basics (2.1–2.4), and Backpropagation (2.5). The course page lists these three decks under "self-study / prerequisite," and they are posts 1 and 2 of this series.

## Two tracks: lectures and TA recitations

The course page splits every week into a Lecture column and a Recitation column. Course Logistics p. 6 spells out the division. Lectures cover DL basics, language representations, language modeling, Transformers, pretraining plus fine-tuning, pretraining plus prompting, and issues in NLP. Recitations cover dev infrastructure (Colab, GPU, PyTorch), DL workflow, Hugging Face basics, LLM architecture, evaluation, training, and inference.

The table below follows the course page. The "Tentative Schedule" on Course Logistics p. 13 orders the November weeks differently.

| Date | Lecture | Recitation | Assignment / note |
|---|---|---|---|
| Self-study | Introduction, NN Basics, Backpropagation | — | HW0 |
| 9/01 | Course Logistics, Sequence Modeling | Dev Infra & Tooling (PyTorch, Debugging) | |
| 9/08 | Attention, Transformer, Tokenization, BERT; plus a guest lecture by William Wang (UCSB) | NLP Lifecycle | HW1 |
| Optional | Word Embeddings, BERT Variants | — | |
| 9/15 | Pretraining & Prompt Learning | Underlying Logics of Projects | |
| 9/22 | Post-Training, LLM Adaptation | LLM LoRA Training | HW2 |
| 9/29, 10/06 | No class (Teachers' Day, Mid-Autumn Festival) | | |
| 10/13 | Retrieval-Augmented Generation | LLM Basics & MoE | HW3 |
| 10/20 | Midterm break | | |
| 10/27 | NLG Decoding, NLG Evaluation | LLM Inference & Evaluation | |
| 11/03 | Issues and Development in Pre-Trained Models | LLM Deployment | Final project announced |
| 11/10 | Language Agents | | |
| 11/17 | Knowledge, Multimodality (title only) | | |
| 11/24 | Personalization (title only) | | |
| 12/01 | Reasoning (title only) | | |
| 12/15 | | | Final Project Due |

The guest lecture appears on the course page with only the speaker's name: no title, slides, or video. This series does not cover it.

## What outsiders can get: A2

This site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) grades openness as A0 (schedule visible), A1 (syllabus visible), A2 (materials partly open), and A3 (enough to self-study). The [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) rates ADL Fall 2025 as A2. A fresh check for this series confirms it: the lecture side is complete, but only one assignment spec can be confirmed as this semester's version.

**What is public**

- Slide PDFs for L1–L11, plus segmented videos (most lectures split into 3 to 6 videos; Attention, Transformer, and BPE get one each).
- Videos for L12–L14 on the playlist (see the next section).
- Recitation videos and two Colab notebooks: [Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) and [NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ).
- The full HW1 spec: Chinese extractive question answering. The model first picks the relevant paragraph out of four, then finds the answer's start and end positions inside it. Scoring is Exact Match. The leaderboard is on Kaggle (due 9/29); code and report go to NTU COOL (due 10/1).
- Explainer videos for HW2, HW3, and the final project.

**Gaps**

1. **HW2 and HW3 exist only as videos.** The HW 2 and HW 3 buttons on the course page link straight to YouTube. Each video description has one line: HW2 is "LLM Tuning and Prompt Tuning for Classical Chinese Translation," and HW3 is "Retriever & Reranker Training for RAG." No written dataset, baseline, or grading scheme is public.
2. **The final project has only video titles and descriptions.** The description of [Final Project Introduction](https://youtu.be/UBe9eGPwRyg) says "Rules and Grading"; the one for [Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I) says "Jailbreaking Olympics."
3. **Submission and grading are campus-only.** Assignments go to NTU COOL, which needs an NTU account. This series did not open the HW1 Kaggle competition, so it makes no claim about whether it still accepts submissions.
4. **L12–L14 have no slides from this semester**, and L12 Reasoning has no slides at all.
5. **Some links are broken.** All five recitation decks linked from the course page (for example `w2-ProjLife.pdf`) return 404 under the f114 path. Files with the same names open under the [Fall 2024 path](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf). The BERT Variants deck likewise needs the [Fall 2024 copy](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf).

**What to do with that**: if you want to understand the NLP storyline from RNNs to LLMs, the slides and videos are enough. If you want to complete all three assignments, only HW1 is doable as specified. For HW2 and HW3 you will have to design your own data and evaluation, and you should not expect to match the official grading.

## Four things the course page doesn't make clear

**1. The playlist has three more lectures than the course page.** The [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) holds 77 videos. The course page rows for 11/17, 11/24, and 12/01 carry only titles, but the playlist has:

- **L12 Reasoning**: 12.1 What is Reasoning?, 12.2 Short CoT, 12.3 Test-Time Scaling, 12.4 Learning to Reason, 12.5 RL for Reasoning
- **L13 Conversation and tool use**: 13.1 Learning to Converse and Interact through 13.9 Conversation Evaluation, with LaMDA, BlenderBot, WebGPT, Toolformer, Plan-and-Execute, and Theory-of-Mind in between
- **L14 Beyond supervised learning**: 14.1 Beyond Supervised Learning through 14.7 Multimodality, with Auto-Encoder, VAE, Dual Learning, Self-Supervised Learning, and CLIP & DALL·E 2 in between

The Personalization row has no matching video on the playlist.

**2. The page's HTML still holds 2022 assignments.** The source of the Homework section at the bottom still contains A1_RNN, A2_BERT, A3_NLG, and 2022 due dates, but that block is commented out. What a browser shows is only the submission rules (submit via NTU COOL, no late submissions, keep your repo private). The real entry points for this semester's work are the HW 1/2/3 buttons in the schedule's Note column. Ignore old files that search engines turn up.

**3. One video is mislinked.** The "Intro" link under Word Embeddings in the optional section points to [LosffMy3BqM](https://youtu.be/LosffMy3BqM), whose actual title is "ADL 4: Gating Mechanism," a video on LSTM and GRU details. The other five links in that row are the word-embedding videos.

**4. 2.5 Backpropagation is not on the playlist.** [ADL 2.5](https://youtu.be/BHgssEwMxsY) is linked from the course page and uploaded by the same channel (陳縕儂 Vivian NTU MiuLab), but it is not among the 77 playlist videos. Watching only the playlist skips backpropagation.

## Why not Fall 2026

adl.miulab.tw now redirects to the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~miulab/f115-adl/). That semester is in progress. Only the 9/07 and 9/14 weeks have new slides (filenames starting with `2609`). From 9/21 on, rows still point to Fall 2025 filenames such as `250915_Pretraining.pdf`, which return 404 under the f115 path. The schedule changed too: Alignment moves to 11/09, and a new 11/23 Human-AI Interaction session appears.

So this series uses Fall 2025 as its baseline. Once Fall 2026 ends (the page lists 2026/12/14 as Final Project Due), we will decide whether to switch versions or add an update log.

## How this series is ordered

The series mostly follows the official order with three changes. HW1 comes right after BERT as its own post. HW2, HW3, and the final project are folded into their related lecture posts, since each has only one line of public information. The recitations are gathered into the last post, and lecture posts just link to them.

| # | Post | Official materials |
|---|---|---|
| 1 | [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) | Introduction, videos 1.1–1.3 |
| 2 | [Neural Networks and Backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en) | NN Basics, Backpropagation, videos 2.1–2.5 |
| 3 | [Word Vectors, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) | Sequence Modeling, videos 3.1–3.4 |
| 4 | [Attention and Transformers](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) | Videos 4.1–4.2 |
| 5 | [Tokenization and BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en) | Video 5.1 |
| 6 | [BERT and the BERT Family](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) | Videos 5.2–5.6 |
| 7 | [HW1: Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) | HW1 spec slides |
| 8 | [Three Families of Pretraining and Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en) | Videos 6.1–6.6 |
| 9 | [Post-Training: Instruction Tuning, RLHF, and InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en) | Videos 7.1–7.4 |
| 10 | [PEFT: Adapters, LoRA, Prompt Tuning, plus HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en) | Video 7.5, HW2 video |
| 11 | [RAG, plus HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) | Videos 8.1–8.6, HW3 video |
| 12 | [NLG: Decoding, Control, and Evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en) | Videos 9.1–9.5 |
| 13 | [Bias, Safety, Hallucination, and Alignment, plus the Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | Videos 10.1–10.3, project videos |
| 14 | [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) | Videos 11.1–11.5 |
| 15 | [Reasoning (video only)](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | Videos 12.1–12.5 |
| 16 | [Conversational AI and Tool Use](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en) | Videos 13.1–13.9, Fall 2024 slides |
| 17 | [Beyond Supervised Learning and Multimodality](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en) | Videos 14.1–14.7, Fall 2024 slides |
| 18 | [TA Recitations: From PyTorch to LLM Deployment](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en) | Recitation videos, slides, and Colabs |

Posts 15 through 17 have thinner official material: 15 has no slides, and 16 and 17 use slides from Fall 2024. Those posts mark the source semester section by section.

## How to start

1. **Check the prerequisites**: calculus and linear algebra are officially required. If Python or PyTorch is new to you, start with the Dev Infra recitation and Colab linked from post 18.
2. **Follow the official HW0**: read posts 1 and 2 alongside videos 1.1–2.5. Students must finish this before enrolling, and it is the shared vocabulary for everything after.
3. **Use HW1 as a checkpoint**: do HW1 after post 6 on BERT. It is the only assignment with a full spec, so it is the one real test of whether you can turn an NLP task into working code.

Related entry points on this site: the [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) compares ADL with the courses of Hung-yi Lee and Hsuan-Tien Lin. From the same university, the [Hung-yi Lee Machine Learning 2026 Spring guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) starts from AI agents, which complements ADL's bottom-up order. For an English-taught NLP storyline, compare with the [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en).

Next: [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en)

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — weekly schedule, slide and video links, recitations, assignment entry points, TA duties
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — goals, prerequisites, grading, collaboration policy, HW0
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (in Mandarin)
- [ADL 0: Course Introduction (YouTube)](https://youtu.be/RwRZVd9rLxE) (in Mandarin)
- [ADL 2.5: Backpropagation (YouTube, not on the playlist)](https://youtu.be/BHgssEwMxsY) (in Mandarin)
- [NTU ADL 2025 Fall HW1 spec slides](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [ADL 2025 Fall Homework 2 video](https://youtu.be/_QiIp0WTRzI)
- [ADL 2025 Fall Homework 3 video](https://youtu.be/tzjmqxw1n8M)
- [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg), [Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I)
- [Recitation Colab: Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT), [NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [NLP Lifecycle recitation slides (same-name file under the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [BERT Variants slides (Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [ADL Fall 2026 (115-1) course page](https://www.csie.ntu.edu.tw/~miulab/f115-adl/) — in progress, used only for comparison
- [陳縕儂 Vivian NTU MiuLab YouTube channel](https://www.youtube.com/@VivianMiuLab/playlists)
- On this site: [Global AI/CS course map (A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- On this site: [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
