---
title: "Stanford CS224N: Open the 2019 Syllabus and Transformers Are Still Lecture 14"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224n, ai-course, stanford, nlp, transformer, llm]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 12
tldr: "CS224N has kept every course website since 2000 online. In Winter 2019, Transformers were lecture 14, taught by a guest. In Winter 2026 they are lecture 5, and every lecture after that assumes you already know them. The machine translation assignment is gone; assignment 3 now has you code a decoder-only Transformer from scratch, with pytest suites that run on your laptop."
description: "A full walkthrough of Stanford CS224N: Natural Language Processing with Deep Learning. Six archived offerings — Winter 2019, 2022, 2023, 2024, Spring 2024, Winter 2025 — compared lecture by lecture and assignment by assignment against the current Winter 2026 syllabus, plus an item-by-item account of what a self-learner can actually get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)

[CS224N: Natural Language Processing with Deep Learning](https://web.stanford.edu/class/cs224n/) is the NLP course in Stanford's CS department, and the hub of the whole NLP branch — CS224U, CS224V and CS329A all point their official prerequisite fields back at it. It teaches how to process language with neural networks, from word vectors and backpropagation through pre-training, post-training, reasoning and evaluation.

It also does something no other course manages: **the course site keeps every offering since 2000 online.** The Previous offerings block on the homepage is a long row of links, the oldest labeled Spring 2000. Which means you can open Winter 2019 and the current version side by side — same course, same slide-filename convention, same NVIDIA Auditorium — and see what got cut over seven years.

That is what this piece does. The spine is a lecture-by-lecture and assignment-by-assignment comparison across [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/), [Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/), [Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/), [Winter 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/), [Spring 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/), [Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) and the current Winter 2026. It does **not** do a close reading of individual slide decks, and it does not cover lecture transcripts — this year's recordings are locked in Canvas and non-enrolled students can't reach them.

The course site lists syllabi and assignments and nothing else. **It has never explained the reasoning behind a single change.** So everything below is what changed, not why.

## The hard facts

The current offering is Winter 2026, taught by two people: [Diyi Yang](https://cs.stanford.edu/~diyiy/) and [Yejin Choi](https://yejinc.github.io/). Tuesday and Thursday afternoons in NVIDIA Auditorium, with twenty TAs listed.

The [ExploreCourses entry for CS 224N](https://explorecourses.stanford.edu/search?q=CS+224N&view=catalog) states the prerequisites in one line: "calculus and linear algebra; CS124, CS221, or CS229." It runs in winter only, and the next one is scheduled for winter of the 2026–2027 academic year.

The course site's own prerequisite list is more detailed, splitting into four items: Python fluency, college calculus and linear algebra, basic probability and statistics, and machine learning foundations. The fourth is followed by a sentence that almost never gets quoted:

> "If you already have basic machine learning and/or deep learning knowledge, the course will be easier; however it is possible to take CS224n without it."

Machine learning is a soft gate, in other words — skipping it costs you effort, not admission. That sentence has survived from the 2019 offering to today without a word changed.

The four assignments are 48% of the grade; nearly all the rest is the final project.

**The auditing policy is the opposite of CS329A's.** CS329A flatly refuses auditors. CS224N welcomes members of the Stanford community to sit in — email the course address — and the site actively encourages auditors to do all the assignments. It also says plainly that "due to high enrollment, we cannot grade the work of any students who are not officially enrolled in the class." You can take a seat; nobody will mark your work.

## The spine: Transformers moved from lecture 14 to lecture 5

Start with the Winter 2019 syllabus. That quarter ran 20 lectures, and Transformers were **lecture 14** — not taught by Manning but as a [guest lecture](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/slides/cs224n-2019-lecture14-transformers.pdf). The speakers were Ashish Vaswani, one of the authors of Attention Is All You Need, and Anna Huang; the title was "Transformers and Self-Attention For Generative Models." It sat between ConvNets for NLP and Natural Language Generation — a new architecture worth bringing in an outsider to introduce.

Scroll up the same syllabus and the thirteen lectures before it are: two on word vectors, then word window classification and matrix calculus, backpropagation and computation graphs, dependency parsing, RNNs and language models, vanishing gradients and fancy RNNs, machine translation with seq2seq plus attention, question answering and SQuAD, ConvNets, subword models, and contextual representations and pre-training. Five more follow the Transformer lecture: NLG, coreference, multitask learning, constituency parsing and TreeRNNs, and bias and fairness.

Now open Winter 2026. Transformers are **[lecture 5](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf)**, the Tuesday of week three, taught by the instructors themselves. Ahead of it sit only three content lectures — History of NLP, Word Vectors, Backpropagation and Neural Network Basics — plus one on Language Models and RNNs. Lecture 6 is the final-project briefing; lecture 7 starts pre-training.

The offerings in between line up into a clean trajectory:

| Quarter | Transformer lecture number | Date |
|---|---|---|
| [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) | 14 (guest) | February 21 |
| [Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) | 9 | February 1 |
| [Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) | 8 | February 2 |
| [Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) | 8 | January 30 |
| [Winter 2026](https://web.stanford.edu/class/cs224n/) | 5 | January 20 |

**That line is the most useful thing in this piece, because it decides whether the earlier lectures are still worth your time.** In 2019 the first thirteen lectures were the road to the Transformer. In 2026 that road is three lectures long, and the remaining fourteen are all built on top of it.

## The half quarter that got cut

Line the 2019 and 2026 syllabi up row by row and the lectures that disappear are these: word window classification, dependency parsing, vanishing gradients and fancy RNNs, machine translation and seq2seq, question answering and SQuAD, ConvNets for NLP, subword models, natural language generation, coreference resolution, multitask learning, and constituency parsing with tree recursive neural networks.

A few of them can be dated precisely:

- **Coreference resolution** appears for the last time in week nine of Winter 2023. Neither Winter 2024 nor Spring 2024 lists it.
- **ConvNets, TreeRNNs and constituency parsing** were merged into a single lecture that survived as far as lecture 16 of Spring 2024, then vanished.
- **Machine translation** was still its own lecture in Spring 2024, titled Sequence to Sequence Models and Machine Translation, in week three. Winter 2026 has none.

The RNN contraction is just as concrete. In 2019 RNNs took two lectures, one on language models and one on vanishing gradients and LSTMs. In 2026 it is [one lecture](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf), titled Language Models and RNNs, and its suggested reading list already includes Attention Is All You Need. Word vectors likewise went from two lectures to one.

What came in: Pretraining (Scaling, Systems, Data), Post-training (RLHF, SFT, DPO), Efficient Adaptation (Prompting and PEFT), Agents/Tool Use/RAG, Benchmarking and Evaluation, two lectures on Reasoning, Tokenization and multilinguality, interpretability, multimodality, and a lecture by [John Schulman](http://joschu.net/) on Tinker and LoRA.

One thing cuts against the delete-the-old-stuff story and deserves its own line: **Winter 2026 added a History of NLP lecture, and put it first.** The site hangs two decks on it, one intro and one history, with Manning's Daedalus essay [Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning) as the suggested reading. In 2025 the first lecture was Word Vectors; this one did not exist. The course gives no reason for adding it.

## Assignments: from coding word2vec yourself to coding a Transformer yourself

The assignment list changed even more decisively than the syllabus, and every offering publishes its percentages on the web.

| Quarter | Assignments | Default final project |
|---|---|---|
| [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) | Five (54%): word vectors / word2vec derivatives and implementation / dependency parsing / NMT seq2seq with attention / NMT ConvNet with subwords | SQuAD 2.0 question answering |
| [Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) | Five (54%): first four as above, A5 replaced by Transformer self-supervision and fine-tuning | SQuAD 2.0 question answering |
| [Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) | Five (54%), same as 2022 | minBERT |
| [Winter 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/) | Five (54%), same as 2022 | minBERT |
| [Spring 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/) | Four (48%): A2 and A3 merged into "neural network basics, tensor differentiation, dependency parsing" | minBERT |
| [Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) | Four (48%): A3 is NMT, A4 is Transformer self-supervision and fine-tuning | minGPT-2 |
| [Winter 2026](https://web.stanford.edu/class/cs224n/) | Four (48%): A3 is Self-Attention and Transformers, A4 is LLM evaluation | minGPT-2 |

Two turning points stand out. **The first is Spring 2024**: five assignments became four, achieved by folding the word2vec one and the dependency parsing one together. **The second is Winter 2026**: the machine translation assignment disappears, the Transformer takes its slot, and the last assignment stops being "train a model" and becomes "evaluate a model."

All four handouts are public, downloadable straight from the course site, no login. Having read through each:

- **[A1](https://web.stanford.edu/class/cs224n/assignments_w26/a1.zip) (6%)**: a Jupyter notebook — co-occurrence matrices, SVD, playing with word vectors in gensim. A warm-up, the easiest of the four.
- **[A2](https://web.stanford.edu/class/cs224n/assignments_w26/a2.pdf) (14%)**: the handout is titled "Word2Vec and Dependency Parsing." Part one derives the partial derivatives of the naive softmax loss, part two covers Adam and dropout, part three implements a neural dependency parser in PyTorch and analyzes the error breakdown. **Note that the word2vec half is now math only** — the 2019 version asked you to write the algorithm.
- **[A3](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf) (14%)**: **this is the watershed.** The first 20 points are pen and paper: attention's copying behavior, the limits of single-head attention, and a proof that permuting the input sequence permutes the output (hence positional encodings). The remaining 30 points are "Coding a transformer from scratch" — implement a decoder-only, GPT-2-style Transformer plus a training loop. The handout's own phrasing is "code a transformer (almost) from scratch, and start training it on your laptop."
- **[A4](https://web.stanford.edu/class/cs224n/assignments_w26/a4.pdf) (14%)**: three parts. Run a standard benchmark on GSM8k with string matching and design a better prompt yourself; compute win rates on Alpaca Eval with LLM-as-judge; then red-team a model into violating its own system prompt.

A4 carries one hard limit a self-learner will hit: it expects students to **call model APIs on GCP credits**, and the handout's first question is literally "Claiming GCP Credits (0 points)," with the credits supplied by the course. You can follow along, but you pay.

## Why the other courses route back through here

CS224N is the hub of the NLP branch, and the ExploreCourses prerequisite fields say so in their own words:

- **[CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog)**: "Prerequisites: CS 224N or CS 224S (This is a smaller number of courses than previously.)" The parenthetical is Stanford's own addition, meaning the acceptable prerequisite list was trimmed.
- **[CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog)**: "Prerequisites: one of LINGUIST 180/280, CS 124, CS 224N, CS 224S, or CS 224U."
- **[CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog)**: "Prerequisites: CS224N or CS229S; Fluency in Python programming and using large language model APIs."

**Those three are strict to very different degrees, and it matters when you plan.** CS224U is effectively CS224N or nothing (the alternative is the speech course, CS224S). CS329A's other option, CS229S, hasn't been offered in two years. CS224V gives you five options, of which CS224N is only one — CS124 counts too. So "CS224N is the mandatory gateway to advanced NLP courses" is true for CS224U and false for CS224V.

The [deep-dive on CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) on this site unpacks that course's content; the ordering of the whole ladder is in the [series map](/posts/learning/2026-08-20-stanford-cs-course-map-en).

## What a self-learner actually gets

Item by item, with the available and the unavailable listed separately.

**Available: this year's slides.** Every Winter 2026 lecture deck is on the course site under `slides_w26/`, publicly linked.

**Available: this year's four assignments.** All four handouts and their code archives are public. And A3's archive ships `pytest.ini`, `tests/test_student.py` and a full set of `.npy` snapshot files — **every subproblem has a unit test you can run on your own laptop**. That is exactly what self-learners lack: a grader that tells you right from wrong without a TA. The handout says outright, "we have included unit tests for each sub problem that can run locally on your laptop." Compare with 2019: A5's code was marked "requires Stanford login" with a stripped-down public version alongside, and A4 asked you to request an Azure VM.

**Available: the 2019 recordings, lecture by lecture, matching the slides.** Every row in the archived [Winter 2019 syllabus](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) has slides, video and notes side by side, and the [public playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z) has all 20 lectures (plus two 2020 additions at the end). To see how Transformers were introduced when they first entered the syllabus, click the lecture 14 row — that one runs only 54 minutes, the shortest of the quarter.

**Available: the complete Spring 2024 recordings.** The public playlist is titled "Spring 2024 I Professor Christopher Manning," the offering Manning taught himself. Two caveats: the playlist jumps from Lecture 16 straight to Lecture 18, with the one in between never posted, and it ends with two 2023 guest lectures (Douwe Kiela on multimodality, Been Kim on interpretability).

**Unavailable: the Winter 2026 recordings.** The site's wording is "it is not possible to make these videos viewable by non-enrolled students." This year's new material — History of NLP, the two Reasoning lectures, the Agents/RAG lecture — exists as slides only.

**Unavailable: grades on assignments and projects.** Everything runs through Gradescope, which non-enrolled students can't enter. A3's unit tests are the only exception.

**Unavailable: compute for the final project.** This year's compute is sponsored by Google, Kimi, Modal and Qwen for enrolled students.

There is a gap worth writing down: **the complete public recordings are Spring 2024, while the public slides and assignments are Winter 2026 — three revisions apart.** The videos contain a dedicated machine translation lecture, ConvNets and TreeRNNs, none of which survive in the current assignments. Treat the videos as your only material and you learn a syllabus the course itself has retired.

## How to start

One thing you can do tonight: download [the A3 archive](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip), `pip install -r requirements.txt`, and run `pytest` before writing a single line. You get a wall of red, each line corresponding to one component of a Transformer — attention, MLP, decoder block, forward, loss, generate. **That wall of red is your progress bar.** Turn them green one at a time and you have a decoder-only Transformer, no GPU required.

Read part three of the handout before you start; its hint about using asserts to check tensor shapes is not a pleasantry.

If you would rather watch lectures first, the order to use is: watch lectures 1, 3 and 5 of the Spring 2024 recordings to pick up word vectors and backpropagation, then **jump straight to the Winter 2026 slides** and read from lecture 5, Transformers, onward. Skip the 2024 RNN and machine translation lectures in between — the course has already skipped them.

## Appendix: the numbers and how they were checked

- **Units and scheduling**: ExploreCourses shows CS 224N as 3–4 units, Terms: Win, with the 2026–2027 winter offering on the schedule and Hashimoto, T. and Yang, D. in the PI field. The current Winter 2026 course site lists Diyi Yang and Yejin Choi as instructors — different academic years, not a contradiction.
- **Grade weights (Winter 2026)**: assignments 48% (A1 6%, A2–A4 14% each), final project 49% (proposal 8%, milestone 6%, poster 3%, report 32%), participation 3%. In 2019 it was assignments 54% (A1 6%, A2–A5 12% each), project 43%, participation 3%.
- **Late policy**: 6 late days per person, at most 3 on any one assignment; past that, each additional day costs 1% of the overall grade. The 2019 penalty was 10% of that assignment per extra day; the switch to 1% of the overall grade came in with the 2022 offering.
- **Quarter codes in archive URLs**: `cs224n.1194` = Winter 2019, `1224` = Winter 2022, `1234` = Winter 2023, `1244` = Winter 2024, `1246` = **Spring** 2024, `1254` = Winter 2025. The final digit is 2 for autumn, 4 for winter, 6 for spring. The 2023–24 academic year had two offerings (winter and spring), which the Winter 2024 homepage notes itself.
- **Lecture counts**: the Winter 2019 syllabus lists 20 numbered lectures; Winter 2026's slide filenames run up to `lecture19`, four of them guest lectures (tokenization and multilinguality, interpretability, multimodality, Tinker and LoRA).
- **An internal contradiction in the A4 handout**: the title line on page one reads "CS 224N Winter 2025 Assignment 4," but the running header on every page says Winter 2026, and the due date (Thursday, February 19) matches the Winter 2026 syllabus. Winter 2025's A4 was Transformer self-supervision and fine-tuning, due February 13, so the title line is a leftover string from copying.
- **Not confirmed**: the course site publishes no enrollment numbers for any offering, and gives no reason for any syllabus change — "why drop machine translation" and "why add a history lecture" have no answer in the primary materials, and this piece does not speculate. I did not open the remaining archived offerings such as Winter 2020, Winter 2021 or Winter 2017, so the "last appeared in" claims above hold only within the six versions I actually compared.

## References

- [CS224N course site (Winter 2026)](https://web.stanford.edu/class/cs224n/) — current syllabus, weights for the four assignments, auditing and recording policy, index of past offerings
- [CS224N Winter 2019 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) — 20-lecture syllabus, five assignments, Transformers as guest lecture 14, A5 requiring Stanford login
- [CS224N Winter 2022 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) — Transformers moved to lecture 9, coreference and ConvNets still present, revised late penalty
- [CS224N Winter 2023 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) — the last coreference lecture, default project switched to minBERT
- [CS224N Winter 2024 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/) — the notice about two offerings in 2023–24, slide copyright note
- [CS224N Spring 2024 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/) — five assignments cut to four, machine translation and ConvNets lectures still present
- [CS224N Winter 2025 archive](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) — A3 still NMT, default project switched to minGPT-2
- [CS224N Spring 2024 public recording playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D) — playlist title names Manning as lecturer, numbering skips after Lecture 16, two 2023 guest lectures appended
- [CS224N Winter 2019 public recording playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z) — all 20 lectures, matching the archived syllabus row for row; lecture 14 is the Vaswani and Huang Transformer guest lecture
- [Winter 2026 Assignment 2 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a2.pdf) — word2vec reduced to derivations, dependency parser implementation
- [Winter 2026 Assignment 3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf) — attention written problems, positional encoding proof, decoder-only Transformer from scratch
- [Winter 2026 Assignment 3 code](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip) — includes pytest configuration and snapshot tests
- [Winter 2026 Assignment 4 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a4.pdf) — GSM8k benchmark, LLM-as-judge, red teaming, GCP credit requirement
- [ExploreCourses: CS 224N](https://explorecourses.stanford.edu/search?q=CS+224N&view=catalog) — official prerequisite wording, units, terms offered
- [ExploreCourses: CS 224U](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — prerequisite "CS 224N or CS 224S"
- [ExploreCourses: CS 224V](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — one of five options, CS224N only one of them
- [ExploreCourses: CS 329A](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — prerequisite "CS224N or CS229S"
- On this site: [Stanford CS329A deep dive](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [Reading Stanford's CS courses: the map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
