---
title: "Reading NTHU Hung-Yu Kao's Natural Language Processing: What Outsiders Can Get from a 1,200-Seat TAICA Course"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, taiwan]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 0
tldr: "Hung-Yu Kao's Natural Language Processing at National Tsing Hua University is a graduate-level flagship course in the TAICA alliance. The syllabus caps it at 1,200 students, it is taught in Mandarin, and it runs from TF-IDF and word vectors to RLHF, PEFT, and RAG. For Fall 2025, the slides, 32 class recordings, and 4 assignments with starter notebooks are all on GitHub, which rates A3. Solutions, grading, and the term-project spec are not public. Fall 2026 is in progress and only goes up to W3, so it rates A2. Grading changed to 75% assignments plus a 25% in-person midterm, and a Reasoning/Agent unit was added."
description: "Entry point to the series on NTHU Hung-Yu Kao's Natural Language Processing: the course's place in TAICA, a side-by-side of Fall 2025 and Fall 2026 (schedule, grading, materials), the trap in the 2025 README's Topics column, the A0–A3 access rating and its gaps, a 20-post series map, and three ways to read it. Based on both semesters' GitHub READMEs, W0_Syllabus.pdf, Syllabus-115.pdf, the Assignments READMEs, TAICA course lists, and the IKMLab YouTube recordings."
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟"]
    definition: "臺灣大專院校人工智慧學程聯盟, an alliance of Taiwanese universities' AI programs. Several universities offer flagship courses that students at partner schools take through live online classes; in Fall AY114, six universities offered 10 of them."
    context: "TAICA's course list files this course under the Artificial Intelligence for Natural Language Technology Program."
  - term: "mirror course"
    aliases: ["鏡像課程"]
    definition: "One TAICA format for partner schools: students follow the host school's live online class directly. The other format, a satellite course, adds co-instructors and TAs at the partner school."
    context: "TAICA listed this course as 'Closed: mirror course / Conditional: satellite course' for Fall AY114 and as 'mirror course' for Fall AY115."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

Hung-Yu Kao teaches [Natural Language Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing) in NTHU's Department of Computer Science. It is a flagship course in the [TAICA alliance](https://taicatw.net/fall-114/) of Taiwanese universities. Both semesters' syllabi list a class size of 1,200 and a graduate level, and TAICA's course list gives the language of instruction as Chinese (the lectures are in Mandarin; slides are mostly in English with many Chinese examples). It starts from why a computer cannot parse a Chinese joke about winter clothes, then works through TF-IDF, word vectors, RNNs, Transformers, and BERT, and ends with RLHF, PEFT, and RAG.

For outside readers, the unusual part is where the materials live. They are not on a university course site. They are in the lab's [GitHub repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing), where one table links each week's slides, YouTube livestream recording, assignment PDF, and notebook.

This post is the series entry point. It answers three questions: what the course is and how the two semesters differ, what outsiders can actually get, and where to start. Weekly content is left to the later posts.

**Sources**: the [repo's main README (2026 edition)](https://github.com/IKMLab/NTHU_Natural_Language_Processing), the [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md), the [2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf), the [2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf), the [2025 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md), the [2026 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md), TAICA's course lists for [Fall AY114](https://taicatw.net/fall-114/) and [Fall AY115](https://taicatw.net/fall-115/), and recordings on the [IKMLab NTHU YouTube channel](https://www.youtube.com/@IKMLabNTHU). I opened and checked all of them on 2026-09-30, and confirmed each recording is publicly playable through YouTube's oEmbed endpoint. Most materials are in Chinese or mixed Chinese and English.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## The hard facts

- **Standing**: the 2025 syllabus cover calls it "Flagship Course 5: Natural Language Processing" and notes that of the 1,200 seats, 100 are reserved for NTHU and partner schools get about 50 each on average. TAICA's list files it under the Artificial Intelligence for Natural Language Technology Program, rates its difficulty at eight stars, and marks it as a graduate course.
- **Instructor**: page one of the syllabus lists Kao as a professor of computer science at NTHU. The 2026 version adds director of NTHU's Computer and Communication Center and lists several NLP data-competition placings.
- **Goal**: both syllabi carry the same paragraph. The course covers foundational and frontier techniques in NLP and large language models, with both theory and practice.
- **What it does not teach**: the syllabus's "Not included" column lists speech, prompt usage, developing new models, and solving generative-AI problems. The 2025 version also has an "Is NOT designed for" slide. It names people who want to learn "magic chanting" (prompt incantations) and people who "want to finish assignments through collaboration because there is no exam."
- **Platform**: both semesters use [NTU COOL course 41436](https://cool.ntu.edu.tw/courses/41436), which outsiders cannot enter. Only GitHub and YouTube are public.

## Two semesters side by side: Fall 2025 and Fall 2026

The series uses Fall 2025, which has finished, as its baseline. Fall 2026 differences are collected here and in the term-project post.

| | Fall 2025 (AY114-1) | Fall 2026 (AY115-1, in progress) |
|---|---|---|
| Live online slots | Tue 13:20–15:10, Thu 13:20–14:10 | Thu 9:00–12:00 |
| TAICA format for partner schools | Closed mirror course / conditional satellite course | Mirror course |
| Grading | Assignments 70% (the syllabus says 5) + term project 30% | Assignments 75% (4) + midterm 25% |
| Project / exam | Groups of 3–4; proposal 6%, progress report 6%, poster 6%, report 12%; "No GPU provided" | Midterm in W14, in person |
| New unit | None | Syllabus adds "NLP issues in LLM era: Reasoning / Agentic AI"; W16 is Reasoning / Agent |
| Compute | Project slide says "No GPU provided" | TAICA compute subsidy: September to December, NT$90,000 in total, e.g. 100 accounts at 100 units or 40 accounts at 500 units, details to be announced |
| Grading of homework | Not stated in the syllabus | Human TAs grade, with an AI TA assisting; the slide says "Your Insight, not GPT insight" |
| Public progress | W1–W16 all linked | Up to W3 only |

Time slots and formats come from TAICA's course lists; everything else comes from the two syllabi. One detail to watch: the W0_Syllabus.pdf in the 2025 folder says "113-1 Flagship Course 5" on its cover, which is the Fall 2024 term code, while its time slots match TAICA's Fall AY114 listing. The file looks like it reuses the previous year's cover. This series cites it only as the syllabus published for 2025.

The 2026 syllabus opens with a new section, "Why Study Natural Language Processing?" It quotes Eduard Hovy's ROCLING 2024 talk "Worries in the LLM era," which splits NLP in the LLM era into three directions: engineering, applications, and research. The 2025 version does not have it.

## Do not copy the 2025 README's Topics column

The [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) has five columns: Week, Topics, Slide, Video, HW. **The Topics column is the syllabus template, and it does not match the slides actually linked in that row.** W7's Topics says "Python for text tutorial (1/2)", but the row links the decoding slides and the Hugging Face BERT tutorial. W10 says "Decoding Strategies" but links the RAG slides.

The week numbers in slide filenames are unreliable too: `W3_Transformers.pdf` sits in W4, and `W11_RAG.pdf` sits in W10. This series always goes by the slides and recordings actually linked in each row. Here is the real Fall 2025 sequence:

| Week | Materials actually linked | Series post |
|---|---|---|
| W1 | Syllabus, NLP brief | [1 Intro and classical text processing](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) |
| W2 | Word embeddings and language modeling (RNN); HW1 | [2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en), [3](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) |
| W3 | Seq2seq and attention | [4](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en) |
| W4 | PyTorch tutorial, Transformers | [5](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en), [6](/posts/ai/2026-09-30-nthu-nlp-transformers-en) |
| W5 | Sub-word tokenization; HW2 | [7](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en), [5](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) |
| W6 | BERT and its family | [8](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) |
| W7 | Decoding and evaluation, HF BERT tutorial | [10](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en), [9](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) |
| W8 | GPT-3, InstructGPT, RLHF; HW3 | [12](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en), [9](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) |
| W9 | GPT-2/T5 tutorial, PEFT | [11](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en), [13](/posts/ai/2026-09-30-nthu-nlp-peft-en) |
| W10 | RAG | [14](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) |
| W11 | Recordings only, no slides linked | [15](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en) |
| W12 | LLM API tutorial; HW4 | [16](/posts/ai/2026-09-30-nthu-nlp-llm-api-en), [17](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) |
| W13 | RAG tutorials 1 and 2 | [17](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) |
| W14 | Course summary, notes on a DeepMind reasoning talk | [18](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) |
| W15–W16 | Term-project presentation recordings | [19](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en) |

## Access: Fall 2025 is A3, Fall 2026 is currently A2

The rating uses the A0–A3 scale from this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en). A2 means materials are partly open, so a topic-by-topic guide is possible but the gaps must be listed. A3 means systematic materials plus assignments and the files they need, enough to self-study.

### Fall 2025: A3, enough to self-study

What you can get:

- **Lecture slides**: PDFs for W1–W10 and W14 are all in [2025/Slides](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Slides).
- **Recordings**: the README links 32 class recordings (W1–W16, one to three per week) plus 4 assignment walkthroughs, all public on the IKMLab NTHU channel. The W8 HF BERT tutorial's title lacks the "[Fall 2025]" prefix and reads "Week 8 Tue. [助教課]" (TA session), yet it sits in the README's W7 row.
- **Assignments**: the [assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md) lists 4: Word Analogy, Arithmetic, Multi-output learning, and RAG. Each has a walkthrough video, a spec PDF, a report template, and `main.ipynb`, and the data files are in the folders: `questions-words.csv` for HW1, `arithmetic_train.csv` and `arithmetic_eval.csv` for HW2, and `cat-facts.txt` and `questions_answers.txt` for HW4. HW3 uses the SemEval 2014 Task 1 dataset.
- **Tutorial notebooks**: [2025/Reference](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference) has notebooks for BERT, GPT-2/T5 summarization, two RAG labs, and LLM APIs.

Gaps:

- No public solutions or grading scripts. Those live in NTU COOL. The only public grade data is the 2025 grade distribution on page 46 of Syllabus-115; see [the term project and 2026 changes](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en).
- The syllabus says "5 assignments for each student," but the repo has 4. This series does not guess what the fifth was.
- The term project has only the grading breakdown in the syllabus and the presentation recordings. There is no topic list or spec.
- W11 has recordings but no slides.
- The tutorial slides carry 2024 dates on their covers, and the LLM API notebook uses 2024-era models. The relevant posts flag the material's year.

### Fall 2026: A2, in progress

The [main README](https://github.com/IKMLab/NTHU_Natural_Language_Processing) currently links W1–W3: Syllabus-115.pdf, `W1_NLP_brief_v2.pdf` (used in both W1 and W2), `W2_Word embeddings and Language Modeling (RNN)_v2.pdf` (W3), three recordings, and HW1, released in W3. The [2026 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md) has only Assignment 1, Word Analogy, with [this walkthrough video](https://youtu.be/4nktsdfU24k). The W4–W16 cells are still empty.

One easy misreading: the `2026/Slides` folder already contains files with 2025 names, such as `W3_Transformers.pdf` and `W11_RAG.pdf`, but the 2026 README does not link them. This series does not treat them as released 2026 materials.

## Series map

The series follows the real Fall 2025 order: seeing text → representing it → sequences → architecture → pretraining → generation and evaluation → LLM alignment → parameter-efficient tuning → external knowledge → reasoning. Each TA tutorial is merged with the assignment that follows it, so you learn the tool and then use it on the homework in one post.

| # | Post | Question |
|---|---|---|
| 1 | [Intro to NLP and classical text processing](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) | Before LLMs, how did text become something you can compute on? |
| 2 | [Word embeddings and language models: from n-grams to RNNs](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) | How did "predict the next word" go from counting to neural nets? |
| 3 | [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) | Do word vectors really learn "king − man + woman"? |
| 4 | [Seq2seq, LSTM, and attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en) | What if input and output lengths differ? |
| 5 | [PyTorch tutorial + HW2 arithmetic as language](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) | Can an LSTM learn arithmetic? |
| 6 | [Transformers and self-attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en) | Without an RNN, how does the model know word relations and positions? |
| 7 | [Sub-word tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en) | Why is the vocabulary made of word pieces? |
| 8 | [ELMo, BERT, T5, BART, GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) | How do encoder, encoder-decoder, and decoder differ? |
| 9 | [HF BERT tutorial + HW3 multi-output learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) | How do you design the loss when one BERT does regression and classification? |
| 10 | [Decoding strategies and NLG evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) | How do you score generated text? |
| 11 | [GPT-2/T5 Chinese summarization lab](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en) | How do decoder-only and encoder-decoder summarization differ in code? |
| 12 | [GPT-3, InstructGPT, and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en) | How does a text continuer become an assistant that follows instructions? |
| 13 | [Parameter-efficient fine-tuning](/posts/ai/2026-09-30-nthu-nlp-peft-en) | How do you fine-tune a large model without a GPU cluster? |
| 14 | [RAG (1): hallucination and retrievers](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) | What are sparse and dense vectors each good at? |
| 15 | [RAG (2): from ODQA to Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en) | Where does it still break after the retriever meets the generator? |
| 16 | [LLM API tutorial](/posts/ai/2026-09-30-nthu-nlp-llm-api-en) | How do prompts, JSON output, and few-shot work through an API? |
| 17 | [RAG tutorials + HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) | Build a cat-facts RAG two ways |
| 18 | [Course summary and notes on LLM reasoning](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) | Can a pretrained model reason without prompting? |
| 19 | [Term project and the Fall 2026 changes](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en) | Why did 2026 switch to a midterm? |

## Three ways to read

**One quick pass (8 posts)**: 1 → 2 → 6 → 8 → 12 → 13 → 14 → 18. Lectures only, skipping tutorials and homework. Good if you want to know what happened between TF-IDF and RAG.

**Follow the whole course (20 posts)**: read 0 through 19 in order. The recording links in each post are that week's livestreams. This is roughly one semester of work.

**Homework only (6 posts)**: 3 → 5 → 9 → 17, plus the two tooling posts, 11 and 16. Each lists the spec PDF, starter notebook, data files, and walkthrough video, so you can open `main.ipynb` right away. There are no public solutions to check against, and nobody grades what you submit.

**Something to do tonight**: open the [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) and click W1's Slide1 and Video1 to see what week one covers. If you would rather code, load [HW1's main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb) into Colab.

## Further reading

Where topics overlap, this series still covers them in full. These links are for readers who want a second take:

- [Reading Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en): Stanford's main NLP course in English, with syllabi compared from 2019 to 2026.
- [Reading Stanford CS224U](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en): natural language understanding, retrieval, and evaluation methods.
- [Reading NTU Hung-yi Lee's Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): also taught in Mandarin with all recordings public, but centered on AI agents and model behavior.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [IKMLab/NTHU_Natural_Language_Processing (main README, 2026 edition)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 README: Fall 2025 weekly table](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf) (in Chinese and English)
- [2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf) (in Chinese and English)
- [2025 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2026 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)
- [2025 Reference notebooks](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference)
- [TAICA course list, Fall AY114](https://taicatw.net/fall-114/) (in Chinese and English)
- [TAICA course list, Fall AY115](https://taicatw.net/fall-115/) (in Chinese and English)
- [IKMLab NTHU YouTube channel](https://www.youtube.com/@IKMLabNTHU) (in Mandarin)
- [Fall 2025 Week 1 Tue. recording](https://www.youtube.com/live/X7XJcm9wfFA) (in Mandarin)
- [Fall 2026 Week 1 recording](https://youtube.com/live/EEbwXXoVQPY) (in Mandarin)
