---
title: "Reading NTU Hung-yi Lee's Machine Learning 2026 Spring: An Agent-First Course That Is Open Except for Grading"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, machine-learning, ai-agent]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 0
tldr: "Hung-yi Lee's Spring 2026 Machine Learning course at National Taiwan University opens with OpenClaw. The first half takes apart AI agents, context engineering, inference speed-ups, and positional embeddings. The second half covers harness engineering, self-correction, and self-improving AI. Slides and recordings for all 8 lectures, plus PDFs and Colab notebooks for all 10 assignments, are public, so it rates A3. What's missing is grading: JudgeBoi returned 502 on 2026-09-30, NTU COOL is campus-only, and the three guest talks have no materials at all."
description: "Entry point to the series on NTU Hung-yi Lee's Machine Learning 2026 Spring: course structure and arc, A0–A3 access rating and gaps, the ten-assignment schedule from policy.pdf and how work splits across NTU COOL, JudgeBoi, and model training, grading and auditing rules, the Colab/Kaggle/PyTorch/JudgeBoi tutorials, and the Teaching Monster Arena bonus."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-course-overview)

**Video status: Videos included.** [Source details](#course-video-sources)

[Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) is this year's machine learning course from Hung-yi Lee in NTU's Department of Electrical Engineering. It does not start with gradient descent. The first lecture dissects a "little lobster": the open-source AI agent [OpenClaw](/posts/ai/2026-03-28-openclaw-overview-en). The syllabus puts it plainly: this year AI "doesn't just talk, it has started to act," so the whole semester takes the AI-agent point of view and focuses on "how to influence and adjust model behavior."

This post is the series entry point. It covers the course structure, what outside readers can get, how assignments are graded, and where to start. Lecture content is left to the later posts. The course is taught in Mandarin, and all official materials linked here are in Chinese unless noted.

**Sources**: the [course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php), the [policy slides, policy.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf) (22 slides), the [NTU course catalog syllabus for 114-2](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696), and the [bonus assignment slides, bonus.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf). I opened and checked all of them on 2026-09-30. The matching video is the [ML 2026 course introduction](https://youtu.be/gl-BdDjNPVI).

## Course video sources

This is a course overview with no single corresponding lecture. The official course page publicly lists the course introduction video (checked live on 2026-10-10); find the other lecture videos through the official entry.

```youtube
url: https://www.youtube.com/watch?v=gl-BdDjNPVI
title: 機器學習 2026 課程簡介
```

Original video: [機器學習 2026 課程簡介](https://www.youtube.com/watch?v=gl-BdDjNPVI)

Course and recording entry:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): video gl-BdDjNPVI (26:46, course introduction) was read in full. Checked the class schedule and format (Friday 14:20, about an hour of lecture plus TA homework walkthrough, floating end time, recordings online on Monday), the prerequisite of last semester's introductory course (10 lectures of about two hours each), ten assignments worth 10 points each, free Colab being enough to pass (C-, 60 points), the add-on quota of about 700 and priority order, auditing versus enrolled differences, no Python syntax teaching, and the Teaching Monster bonus; all match the transcript. The transcript does not cover policy.pdf page numbers, the assignment date table, the JudgeBoi/NTU COOL breakdown or the academic-integrity rules, which come from the slides and course page and cannot be verified from the video. The video was recorded early in the term and announces two guest talks (Appier, Chen Wei), whereas this post lists three based on the course page; the post follows the course page.

## The hard facts

- **Course number and credits**: EE5184, 4 credits, elective, Fridays 14:20–18:20 in room 博理 112. The catalog notes it is co-taught with 吳沛遠.
- **Format**: slide 9 of policy.pdf says Lee lectures for about an hour, then TAs walk through assignments. Everything is recorded and expected online the following Monday. End time varies.
- **Prerequisite**: the syllabus requires you to watch the recordings of the Fall 2025 course *Introduction to Generative AI and Machine Learning* ([playlist](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT), ten lectures of about two hours each). It also says anything Lee already covered on YouTube won't be repeated. Slide 8 draws the two courses as a staircase: Fall 2025 is the introduction, Spring 2026 covers frontier techniques not taught before.
- **Programming**: all assignments use Python, but the course doesn't teach the language. Colab is enough; you don't need your own hardware.
- **Status**: the last news item on the course page is "6/1 HW10 released," and the last deadline was 06/18/2026. The semester is over.

## The arc: the visible agent → the invisible model → how to educate a model

The course page's content table has 11 rows. Eight have slides and recordings:

| Date | Unit | Post in this series |
|---|---|---|
| 3/6 | AI Agent (1): dissecting the lobster | [Part 1](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) |
| 3/13 | AI Agent (2): context engineering, agent-to-agent interaction, impact on academic research | [Part 3](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en), [Part 4](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en) |
| 3/20 | Speeding up generation: Flash Attention, KV Cache | [Part 6](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en), [Part 7](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) |
| 3/27 | Handling very long inputs: Positional Embedding | [Part 9](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en) |
| 4/10 | Educating the model (1): Harness Engineering | [Part 11](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en) |
| 4/24 | Educating the model (2): Self-Correction | [Part 13](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en) |
| 5/8 | Self-improvement (1): Self-Improving | [Part 15](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) |
| 5/22 | Self-improvement (2): Self-Improving -2 | [Part 18](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en) |

The other three rows are guest talks, covered under gaps below.

The order is already a good learning path. You first see what an agent does on your computer (visible). Then you ask why its input is limited and why generation is slow (inside the model, invisible). Finally you come back to the harness, which makes a model stronger without touching its weights, and to whether a model can fix its own mistakes and improve itself. This series **follows the official order**, with each assignment placed after the lecture it was released with.

The plan from the first week doesn't fully match what happened. Slide 7 of policy.pdf scheduled a talk by Professor 陳暐 of NTU Agricultural Economics on 5/29 and "Unit 5: generation strategies (Flow Matching in detail)" on 6/05. The actual course page has the Spoken LM TALK on 5/29 and Professor 陳暐's talk on 6/05. Flow Matching never got a lecture; only HW9 remains. If you're reading old notes, trust the course page.

## Access rating: A3, except the grading chain

The rating follows the definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) (A0 schedule visible, A1 syllabus visible, A2 materials partly open, A3 enough to self-study). This course is **A3**. All 8 lectures have pdf and pptx slides and full recordings. All 10 assignments have a problem PDF, a publicly accessible Colab starter, and a TA walkthrough video.

What outside readers can't get (each assignment post repeats this):

1. **JudgeBoi**: `ml.ee.ntu.edu.tw` returned 502 on 2026-09-30. For assignments submitted to JudgeBoi (per policy.pdf: HW1, 2, 4, 5, 7, 10), you can't get a score or see the leaderboard and private baselines.
2. **NTU COOL** requires an NTU account. The quizzes for HW3, 6, 8, and 9 are answered on COOL, and the HW10 PDF also says to submit on NTU COOL. You can read the questions in the PDFs but not the answers.
3. **The three guest talks have no materials**: the Appier Research team talk on 5/15, the Spoken LM TALK by students 楊書文 and 楊智凱 on 5/29, and Professor 陳暐's talk on 6/05. The course page lists titles only, with no slides or recordings. This series doesn't give them posts.
4. **HTML comments don't count**: the page source hides rows such as an AI Cup info session, a TA session on training large models across multiple GPUs, and "Reasoning." They don't render on the page, so this series doesn't treat them as public course material for this semester.

Slide 20 of policy.pdf has the key line: "The only difference between taking the course and auditing it is that TAs don't grade auditors' homework." A self-learner is essentially an auditor, except that now even the self-service submission route is closed.

## Ten assignments: schedule and platforms

The table on slide 11 of policy.pdf marks each assignment with three properties: answered on NTU COOL, "graded by an AI TA" on JudgeBoi, and needs time to train a model. The dates below match the course page and each assignment PDF:

| HW | Topic | Released | Due | NTU COOL | JudgeBoi | Training | Series post |
|---|---|---|---|---|---|---|---|
| HW1 | LLM Malicious Instruction Defense | 03/06 | 03/26 | | O | | [Part 2](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en) |
| HW2 | AI Agent as an AI Engineer | 03/13 | 04/02 | O | O | O | [Part 5](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en) |
| HW3 | LLM Fast Inference | 03/20 | 04/09 | O | | | [Part 8](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en) |
| HW4 | Training Transformer | 03/27 | 04/16 | O | O | O | [Part 10](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en) |
| HW5 | Finetuning without Forgetting | 04/10 | 04/30 | | O | O | [Part 12](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en) |
| HW6 | Model Editing | 04/24 | 05/14 | O | | | [Part 14](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en) |
| HW7 | Model Merging | 05/08 | 05/28 | O | O | | [Part 16](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en) |
| HW8 | Test-Time Scaling | 05/15 | 06/04 | O | | | [Part 17](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en) |
| HW9 | Flow Matching | 05/22 | 06/11 | O | | O | [Part 19](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en) |
| HW10 | Spoken Language Model | 05/29 | 06/18 | | O | O | [Part 20](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model-en) |

All deadlines are 23:59 (UTC+8). HW10 is the one row that doesn't agree: policy.pdf marks JudgeBoi, while the course page's platform column and hw10.pdf both say submit on NTU COOL. Go with the assignment PDF. Slides 12–13 also warn you up front that some assignments may need hours of training, and that "anxiously waiting for training results and tuning hyperparameters in a daze is the true flavor of training AI."

One trap: the **text layer** of slides 10–11 swaps the HW4 and HW5 dates (HW4 04/16–04/30, HW5 03/27–04/10), but the table **as rendered** on the slide is correct. If you scrape it with `pdftotext`, you'll hit this. Trust the rendered slide and the course page.

## Grading, auditing, and asking for help

- **Grading**: slide 14 says "10 assignments × 10 points = 100 points," and no grade-adjustment requests to the instructor at the end of the semester.
- **Enrollment agreement** (slides 17–18): you accept that an AI TA grades assignments, with appeals allowed for errors; you accept randomness, so your training results may differ from the TAs' even if you follow instructions; Colab has usage limits, but free resources are guaranteed to reach a passing grade (C-, 60 points); extra compute makes high scores easier, but the course doesn't provide it.
- **Add codes and auditing** (slides 15–16): total enrollment, including students already registered, is capped at around 700. Students in the EECS college and related programs come first, then students who took or applied to the 2025 *Introduction to Generative AI and Machine Learning*. Auditors are welcome but must fill in the form too.
- **Help** (slide 19): use the NTU COOL forum, TA office hours (twice a week), or email. Don't DM the professor or TAs.
- **Academic integrity** (course page, homework section): no plagiarism, no hand-editing prediction files, no sharing code or predictions. A first violation multiplies your final grade by 0.9 and zeroes that assignment; repeated violations mean an F.

## Three tutorials and the bonus

The top of the homework table has three tutorials released on 3/6, all reused from earlier years:

- **Colab and Kaggle**: the [2025 Colab/Kaggle tutorial video](https://www.youtube.com/watch?v=kibL4oJbzy4), the [Colab Tutorial slides](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf), a [sample Colab](https://colab.research.google.com/drive/14CEwML9XSpxSvZoHfvZTB1h8ZWC8CYyT?usp=sharing), and a [Kaggle tutorial notebook](https://www.kaggle.com/code/walkerhsu/kaggle-tutorial).
- **PyTorch**: the [2023 PyTorch Tutorial video](https://youtu.be/6dEp6oRN2NE) and two slide decks ([Part 1](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf), [Part 2](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_2.pdf)).
- **JudgeBoi**: the [JudgeBoi Guide video from the 113-2 semester](https://www.youtube.com/watch?v=sNX3iKzxAPs) and [slides](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf). The platform itself is down, so this is reference only.

**Bonus: Teaching Monster Arena** (TA 許筠曼, [walkthrough video](https://youtu.be/Xk_utjmoK5A); the bonus slides are in English). The task is to enter [Teaching Monster](https://teaching.monster/), a competition run by NTU's AI Center of Research Excellence (NTU AI-CoRE): build a fully automated AI teaching system that receives a `course_requirement` and a `student_persona` over an API and returns a download link to a teaching video within 30 minutes. Topics are physics, biology, computer science, and math for ages 12–18, benchmarked against IB and AP. Videos are mainly in English, at most 30 minutes long, with no human scriptwriting, editing, or voiceover allowed.

Scoring in bonus.pdf is per team: +2 for participating, +10 for the top 30%, +20 for the top three, +30 for the champion. Points are split among team members and added directly to the semester grade. There are two versions of the deadline: the course page says 05/15/2026 19:59, bonus.pdf says 2026/5/15 23:59:59. The organizers also released a [baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released). `teaching.monster` returned 521 on 2026-09-30, so the competition site is currently unreachable.

## How to start

1. **Do the prerequisite first**: if you haven't watched the Fall 2025 introduction, watch it. The syllabus requires it; it isn't a suggestion.
2. **Read in this series' order**: one lecture, then one assignment. Assignment posts cover the task, the starter code structure, and which grading parts you can't reach from outside.
3. **Set your own acceptance criteria**: with JudgeBoi gone, copy the baselines and grading rules from the assignment PDF before you start, and write a small evaluation script as your feedback loop.

Related on this site: the [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) compares this course with the rest of NTU's offerings, and the Hung-yi Lee section of [Which AI Courses to Take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide-en) places it among other courses.

Next: [Dissecting the Lobster: How AI Agents Work, Using OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official course page publicly lists a "Machine Learning 2026 course introduction" video; embedded it and set status to Videos included.
- 2026-10-10: Checked the video content against its transcript. The rules described in the introduction video match the post; no body text needed changing.

## References

- [Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Chinese) — content table, homework table, platforms, deadlines, integrity rules
- [ML 2026 policy slides (policy.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf) (in Chinese) — assignment schedule and platform split, grading, enrollment agreement, add codes and auditing, semester plan
- [ML 2026 course introduction (YouTube)](https://youtu.be/gl-BdDjNPVI) (in Mandarin)
- [NTU course catalog: Machine Learning 114-2 syllabus](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) (in Chinese) — course number, credits, time and place, overview and FAQ
- [Introduction to Generative AI and Machine Learning 2025 playlist](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) (in Mandarin) — the required prerequisite recordings
- [ML 2026 Spring Bonus: Teaching Monster Arena (bonus.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf)
- [ML2026 Bonus HW walkthrough video](https://youtu.be/Xk_utjmoK5A)
- [Teaching Monster baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released)
- [Teaching Monster competition site](https://teaching.monster/) (returned 521 on 2026-09-30)
- [Colab Tutorial slides (ML 2025)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf)
- [2025 Colab/Kaggle tutorial video](https://www.youtube.com/watch?v=kibL4oJbzy4)
- [PyTorch Tutorial 1 slides (ML 2023)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf)
- [PyTorch Tutorial video (ML 2023)](https://youtu.be/6dEp6oRN2NE)
- [JudgeBoi Guide slides](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [JudgeBoi platform](https://ml.ee.ntu.edu.tw/home) (returned 502 on 2026-09-30)
- On this site: [Global AI/CS course map (A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- On this site: [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
- On this site: [Which AI Courses to Take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide-en)
