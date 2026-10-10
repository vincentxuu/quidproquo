---
title: "NTU AI/ML Course Guide: What Outsiders Can Actually Get from Hung-yi Lee, Hsuan-Tien Lin, and Yun-Nung Chen"
date: 2026-09-30
category: learning
tags: [ntu, ai-course, machine-learning, learning-path, open-course]
lang: en
series:
  name: "Global AI/CS Course Map"
  order: 97
type: guide
tldr: "National Taiwan University spreads its AI/ML courses across Electrical Engineering and Computer Science, and an official 'Machine Learning and AI' specialization stacks them into four levels. Hung-yi Lee's courses are the most open: ML 2026 Spring and Intro to GenAI and ML 2025 Fall publish slides, recordings, homework PDFs, and Colab notebooks, with only grading held back. Hsuan-Tien Lin's lectures are fully recorded and his Fall 2024 HW0–HW7 remain on the course page; Yun-Nung Chen's lectures are fully recorded, but most homework is public only as walkthrough videos; and since August 2025 Coursera only lets free learners watch the first module."
description: "An audit of NTU's Hung-yi Lee ML 2026 and GenAI courses, Hsuan-Tien Lin's Machine Learning Foundations/Techniques, Yun-Nung Chen's Applied Deep Learning and Foundations of AI, plus computer vision and deep RL: latest public term, public assets, NTU-only parts, and an A0–A3 access grade for each."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-30-ntu-ai-ml-course-map)

The first five school maps in this series dealt with courses taught in English. NTU is different. It is probably the school Mandarin-speaking self-learners study from most. Hung-yi Lee uploads every semester to YouTube, and Hsuan-Tien Lin's Machine Learning Foundations recordings have circulated online for a decade. Being able to watch the videos is not the same as being able to take the course. Homework specs, starter code, grading platforms, and auditor status each have their own level of openness.

This post uses the A0–A3 scale from the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en). A0 means only a catalog entry, A1 a syllabus, A2 some substantive material, and A3 enough material plus homework to form a coherent self-study path. It is this site's editorial grade, not an NTU evaluation, and it implies no credit or TA feedback. All access statuses were checked on **September 30, 2026**. Most sources below are in Mandarin.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [AI master's program](https://www.csie.ntu.edu.tw/zh_tw/Admission/Announcement13/%E4%BA%BA%E5%B7%A5%E6%99%BA%E6%85%A7%E7%A2%A9%E5%A3%AB%E7%8F%AD-%E4%B8%80%E8%88%AC%E7%94%9F-%E8%80%83%E8%A9%A6%E5%85%A5%E5%AD%B8%E8%A6%8F%E5%AE%9A-50477470)
- [NTU Course site](https://course.ntu.edu.tw/)
- [Machine Learning in fall 2024 (term 113-1)](https://course.ntu.edu.tw/courses/113-1/26214)
- [Machine Learning and Artificial Intelligence specialization](https://specom.aca.ntu.edu.tw/Domain/program?program=902002&lang=zh)
- [Machine Learning for spring 2026 (term 114-2)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696)
- [ML 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## How NTU organizes AI/ML: follow the specialization, not the department name

NTU has no undergraduate "AI department." AI/ML courses are mainly offered by Electrical Engineering (EE) and Computer Science and Information Engineering (CSIE). At the graduate level they are shared among CSIE, the Graduate Institute of Networking and Multimedia (GINM), the Graduate Institute of Communication Engineering, the Data Science degree program, and others. CSIE also runs an [AI master's program](https://www.csie.ntu.edu.tw/zh_tw/Admission/Announcement13/%E4%BA%BA%E5%B7%A5%E6%99%BA%E6%85%A7%E7%A2%A9%E5%A3%AB%E7%8F%AD-%E4%B8%80%E8%88%AC%E7%94%9F-%E8%80%83%E8%A9%A6%E5%85%A5%E5%AD%B8%E8%A6%8F%E5%AE%9A-50477470) (in Mandarin). On the [NTU Course site](https://course.ntu.edu.tw/), one course often appears under several units. Hsuan-Tien Lin's [Machine Learning in fall 2024 (term 113-1)](https://course.ntu.edu.tw/courses/113-1/26214) is listed for CSIE, the Data Science program, GINM, the Smart Healthcare program, and the national AI program alliance, with a note that it is required for the AI master's program.

The most useful official document for course sequencing is the CSIE-led [Machine Learning and Artificial Intelligence specialization](https://specom.aca.ntu.edu.tw/Domain/program?program=902002&lang=zh) (in Mandarin). It stacks courses into four levels:

```text
Prerequisites: probability, linear algebra, programming
  ↓
Level 1: Data Structures and Algorithms
  ↓
Level 2: Foundations of AI  or  Machine Learning Foundations
  ↓
Level 3–4: Machine Learning Techniques, Machine Learning,
           Applied Deep Learning, Advanced AI, Special Topics in ML
```

The chart leaves out the path outsiders take most often: Hung-yi Lee's courses in EE. His [Machine Learning for spring 2026 (term 114-2)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) (in Mandarin) is EE5184, four credits, co-taught with Pei-Yuan Wu. The syllabus says the course will not re-teach ML basics and asks students to first watch the recordings of *Introduction to Generative AI and Machine Learning*. So Lee's two courses form a two-part sequence of their own, running parallel to CSIE's Foundations → Techniques track.

## One table: nine courses and how open they are

| Course and term | Grade | What outsiders can get | NTU-only or missing |
|---|---:|---|---|
| **Hung-yi Lee, ML 2026 Spring** | **A3** | Slides (pdf/pptx), recordings, HW1–10 PDFs, Colab starters, homework walkthrough videos | Grading via JudgeBoi and NTU COOL; three guest talks have no public material |
| **Hung-yi Lee, Intro to GenAI and ML 2025 Fall** | **A3** | 10 lectures with slides and video, HW1–10 slides, Colab, walkthrough videos | Grading via JudgeBoi/NTU COOL; auditors' homework is not graded |
| **Hung-yi Lee, Intro to GenAI 2024 Spring** (archive) | **A3** | Slides, recordings, HW1–10 spec slides and Colab | Some homework needed course-issued platform accounts |
| **Hsuan-Tien Lin, ML Foundations/Techniques MOOCs** | **A2** | Two 65-video YouTube playlists, full handout slide sets | Coursera's free Preview opens only the first module (including its graded items); the rest needs payment or financial aid |
| **Hsuan-Tien Lin, Machine Learning Fall 2026** (in progress) | **A2** | Course slides, assigned pre-class videos, hw0–hw1, public livestream | Later homework released as the term goes; Gradescope and NTU COOL enrolled-only |
| **Hsuan-Tien Lin, Machine Learning Fall 2024** | **A3** (with the MOOCs) | HW0–HW7 PDFs, final project spec | No official solutions; grading platforms and the Kaggle page enrolled-only |
| **Yun-Nung Chen, Applied Deep Learning (ADL) Fall 2025** | **A2** | Per-lecture slides and recordings, HW1 spec slides, homework walkthrough videos | Submission via NTU COOL; HW2/HW3 specs not fully public |
| **Shang-Tse Chen & Yun-Nung Chen, Foundations of AI Spring 2026** (two sections) | **A2** | 33-video playlist, a syllabus for each section | No public course site; programming assignment and final project specs not public |
| **Chiou-Shann Fuh, Computer Vision I Fall 2026** | **A3** | 11 chapters of handouts, HW1–10 spec pages, test image, lecture recordings on the DCCV Lab channel | Classical computer vision only, no deep learning |
| **Chun-Yi Lee, Deep Reinforcement Learning, spring 2025 (113-2)** | **A1** | Full syllabus on the NTU course system | No public slides, recordings, or homework found |

## Hung-yi Lee: a two-course sequence, open except for grading

### ML 2026 Spring: the newest edition, centered on shaping model behavior

The [ML 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) runs from March 6 into June. Every regular lecture has a YouTube recording and pptx/pdf slides. The first half covers AI agents (using OpenClaw as the example), context engineering, and inference speedups (FlashAttention, KV cache). The second half covers positional embeddings, harness engineering, self-correction, and self-improvement.

The homework table lists HW1 through HW10. The first five are about defending against malicious instructions, using an AI agent to do coursework, faster inference, training a Transformer, and fine-tuning without forgetting. The last five are model editing, model merging, test-time scaling, flow matching, and spoken language models. Each has a PDF spec and a Colab link, and some also have a Kaggle version.

Grading is the gap. The "Platform" column points to JudgeBoi (`ml.ee.ntu.edu.tw`) or NTU COOL. The [JudgeBoi guide](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf) requires linking an NTU email address to a GitHub account to log in, and on the day of this check the site only returned a 502. Outsiders can finish every assignment but cannot see leaderboard scores or quiz answers. The guest talks listed for 5/15, 5/29, and 6/05 have titles only, with no slides or recordings.

This site's [NTU Hung-yi Lee Machine Learning 2026 Spring guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) walks through the semester lecture by lecture and assignment by assignment, in 21 posts.

### Intro to GenAI and ML 2025 Fall: the prerequisite, and the friendliest entry point

The latest notice on the [GenAI-ML 2025 Fall course page](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php) is blunt. The semester is over and no more auditors will be added to NTU COOL. Anyone who wants to audit "can get all teaching content and learning materials on this course website, including lecture videos and complete homework." The ten lectures move from how LLMs work through context engineering and evaluation to basic ML concepts. The ten assignments range from RAG and malicious-instruction defense to regression, image classification, LLM fine-tuning, diffusion models, and speech generation. Each has slides, a Colab notebook, and a walkthrough video.

The course FAQ describes its audience as beginners with no extra prerequisites. Assignments are designed so that free Colab GPUs are enough for a passing grade. The ML 2026 syllabus asks students to watch this course's [recording playlist](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) first. Following 2025 Fall → 2026 Spring is therefore the path Lee himself designed.

### Are the older editions still useful?

Lee's course menu lists [ML 2025 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2025-spring.php) and earlier Machine Learning editions, plus [Intro to Generative AI 2024 Spring](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php). There is no 2024 Machine Learning edition; `ml/2024-spring.php` does not exist. The pre-2025 editions look like this. Video counts are the YouTube links on each course page, homework walkthroughs included:

| Edition | YouTube links on page | Homework | Public homework assets | Grading platforms | Grade |
|---|---:|---|---|---|---:|
| [2023 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php) | 97 | HW1–15 | Slides and Colab code for each | 9 on Kaggle; the rest on JudgeBoi, Gradescope, NTU COOL | A3 |
| [2022 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2022-spring.php) | 154 | HW1–15 | Slides and Colab code for each | 9 on Kaggle; HW5, 6, 10, 12 on JudgeBoi | A3 |
| [2021 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2021-spring.php) | 111 (Mandarin and English) | HW1–15 | Slides and Colab code for each | 8 on Kaggle; the rest on JudgeBoi and NTU COOL | A3 |
| [2020 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2020-spring.php) | 80 | HW1–15 | Colab examples and intro slides for each | No platform listed on the page | A3 |
| [2019 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2019-spring.php) | 49 | HW1–8 | Six link to TA-run GitHub Pages spec sites; HW5 and HW8 have no link | No platform listed on the page | A2 |
| 2017 Fall, 2017 Spring, 2016 Fall | 2–35 | No homework on the page | Slides and recordings only | None | A2 |

The Kaggle competition pages from 2021 to 2023 still load, with data and leaderboards visible. JudgeBoi (`ml.ee.ntu.edu.tw`) returned 502 today, and Gradescope and NTU COOL need NTU accounts. So outsiders get every spec and starter notebook, and about half the assignments still have a Kaggle leaderboard to compare against.

These are archives. The content changes heavily every year, and the 2026 syllabus says topics covered in past years will not be repeated. For classic ML/DL material (CNNs, RNNs, self-attention, GANs, RL), the 2021 and 2022 editions are the most complete. Write the year at the top of your notes, and don't mix 2021 homework with 2026 grading rules.

What you can do tonight: open the GenAI-ML 2025 Fall course page, watch lectures 0 and 1, then run HW1 in Colab. If it runs, work through the ten assignments in order.

## Hsuan-Tien Lin: MOOC practice sits behind a paywall, and Fall 2024 homework fills the gap

Lin's [MOOC page](https://www.csie.ntu.edu.tw/~htlin/mooc/) gathers both courses in one place: Machine Learning Foundations (split into Mathematical and Algorithmic parts) and Machine Learning Techniques. Each has a full handout slide archive and a free YouTube playlist, and both are based on [Learning from Data](http://amlbook.com), which he co-authored. The [Foundations](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) and [Techniques](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) playlists each hold 65 videos. Their first videos were uploaded in December 2015 and February 2016. The theory (VC dimension, regularization, SVMs, boosting) has not aged, but there is nothing on Transformers or LLMs.

Practice problems are the gap. The Coursera pages for [Foundations part 1](https://www.coursera.org/learn/ntumlone-mathematicalfoundations), [Foundations part 2](https://www.coursera.org/learn/ntumlone-algorithmicfoundations), and [Techniques](https://www.coursera.org/learn/machine-learning-techniques) still say "Enroll for free," but each page's FAQ says that access to course materials and assignments requires purchasing the Certificate experience. In [its August 2025 announcement](https://blog.coursera.org/introducing-courseras-new-course-preview-experience/), Coursera replaced the old audit option with "Preview." According to the help center's [Enrollment options](https://www.coursera.support/s/article/learner-000001306) article, Preview opens only the first module, including that module's graded assessments, and locks every later module. A few courses also offer "Full Course, No Certificate," which unlocks all graded work without a certificate. Whether these three courses offer it is only shown in the enrollment dialog after you log in, so it can't be confirmed from the public pages. Without paying, you can still apply for Coursera financial aid. On the free route this pair is A2: videos, slides, and textbook are complete, but graded homework stops after the first module.

Lin's current on-campus course is [Machine Learning Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/), taught as a flipped classroom. Students watch the MOOC videos and course slides before class. Lectures are livestreamed publicly through TAICA, Taiwan's inter-university AI program alliance. The course page is up to hw1 so far, with later homework released as the term goes, so it rates A2 for now. The last completed run, [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/), keeps hw0 through hw7 and the final project spec on its course page; paired with the MOOC videos, that makes an A3 self-study route that lacks only official solutions and grading. This site's [Hsuan-Tien Lin ML Foundations & Techniques guide](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) uses exactly that pairing: content from the MOOCs, practice from the Fall 2024 homework.

## Yun-Nung Chen: the YouTube playlists are more complete than the course sites

Chen's YouTube channel, [陳縕儂 Vivian NTU MiuLab](https://www.youtube.com/@VivianMiuLab/playlists), belongs to her Machine Intelligence and Understanding Lab in CSIE. Its description reads "recordings of courses taught by Yun-Nung Chen." Playlists are organized by term. The ones relevant to NTU AI/ML are:

| Playlist | Videos |
|---|---:|
| 2026 Fall Applied Deep Learning (ADL, in progress) | 24 |
| 2026 Spring Foundations of AI (FAI) | 33 |
| 2025 Fall Applied Deep Learning | 77 |
| 2025 Spring Foundations of AI | 39 |
| 2024 Fall Applied Deep Learning | 91 |
| Advanced Deep Learning (AvDL, term not labeled) | 16 |

Older playlists cover ADL from 2017 to 2023, Foundations of AI in 2023 and 2024, and EE's MLDS course from fall 2017.

**ADL** (Applied Deep Learning) keeps a stable address at [adl.miulab.tw](http://adl.miulab.tw/), which currently redirects to the [Fall 2026 site](https://www.csie.ntu.edu.tw/~miulab/f115-adl/). The latest complete term is [Fall 2025](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), running from neural network basics, Transformers, and BERT through RAG, LoRA, and language agents. Every unit has PDF slides and segmented recordings. On the homework side, the HW1 spec slides (Chinese extractive QA) are public, with a Kaggle leaderboard and code and reports submitted through NTU COOL. HW2 and HW3 appear in the schedule only as walkthrough videos. The homework section at the bottom of the page still carries 2022 links, so ignore its deadlines. ADL Fall 2025 is therefore A2: the lectures are thorough, but only one homework spec is confirmed as current.

**Foundations of AI** (FAI, CSIE3005) Spring 2026 was actually two sections in the course system: [section 01 with Shang-Tse Chen](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=01&dpt_code=9020&ser_no=55080&semester=114-2&lang=CH) for odd student IDs, and [section 02 with Yun-Nung Chen](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=02&dpt_code=9020&ser_no=11206&semester=114-2&lang=CH) for even ones (both syllabi in Mandarin). Both met Wednesday mornings, but the schedules differ. Shang-Tse Chen's section runs from search, CSPs, and games through MDPs, reinforcement learning, and Bayesian networks. Yun-Nung Chen's adds propositional logic and planning and moves RL to the second half. Both use AIMA 4th edition as the main text. Yun-Nung Chen's section is graded on Python programming assignments, a midterm, a competition-style final project, and participation. The [2026 Spring playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7lTGzNejZoLHRBF4X2mJfI) has 33 videos. The first one's description reads "Lectured by Shang-Tse Chen & Yun-Nung Vivian Chen." The playlist also includes a walkthrough of the final project, a "Game Agent" for the card game 6 nimmt! (誰是牛頭王).

There is no public course site. I checked the MiuLab site (term paths such as `~miulab/s115-fai/` return 404), the Teaching page on Yun-Nung Chen's homepage (it stops at 2020), both syllabi (the course-website field is empty), TAICA's course list for spring 2026 (FAI is not on it), and the MiuLab organization on GitHub. The only GitHub repos are students' own uploads, nothing official. So FAI is graded on recordings and syllabi alone: A2.

## Other courses with meaningful public material

**Computer Vision I**: Chiou-Shann Fuh's [course site](https://cv2.csie.ntu.edu.tw/CV/) publishes 11 chapters of handouts organized around the Haralick and Shapiro textbook, most with pptx versions updated every year. The HW1–10 spec pages are also public: thresholding, morphology, Yokoi connectivity numbers, thinning, noise removal, and edge detection, plus the test image used in the assignments. Homework rules forbid ready-made libraries, so you implement every algorithm yourself. Recordings live on Fuh's lab YouTube channel, [DCCV Lab](https://www.youtube.com/@DCCVLab/playlists): the course site's footer is signed DCCV Lab and its "Videos" link points there. The channel has 43 videos in five playlists, starting in 114-1 (fall 2025): Computer Vision 114-1 (14 videos), Introduction to Computers 114-1 (10), Advanced Computer Vision 114-2 (14), and so far 3 each for Computer Vision and Introduction to Computers in 115-1. It is A3, but it teaches classical computer vision. If you want CNNs or ViTs, look elsewhere.

**Artificial Intelligence: Learning & Theory**: an EE MOOC by Tian-Li Yu on [NTU OpenCourseWare](https://ocw.aca.ntu.edu.tw/courses/mooc0016) (in Mandarin), dated June 2018, with five lecture videos on OCW. It covers VC theory, decision trees, SVMs, neural networks, and deep RL. The full assignments are on Coursera and subject to the same August 2025 Preview change, so it is A2.

**Deep Reinforcement Learning**: Chun-Yi Lee's [syllabus for spring 2025 (113-2)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=922+U4960&dpt_code=9220&semester=113-2&ser_no=10169) is detailed. It spells out prerequisites, GPU requirements, and a scope from MDPs to policy optimization. This check found no public slides or recordings, so it is A1.

## Three reliable paths for outsiders

### 1. Starting from zero and wanting current AI: Lee's two courses back to back

Do the ten lectures and ten assignments of GenAI-ML 2025 Fall, then move to ML 2026 Spring. Everything is in Mandarin and needs only Colab. Accept two things: nobody grades your work, and you won't see the leaderboard.

### 2. Building solid ML theory: Lin's Foundations → Techniques

Watch the YouTube videos with the handout slides, and practice with the Fall 2024 HW0–HW7 from the course page or the end-of-chapter problems in Learning from Data; [this site's series](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) maps each assignment to its lectures. If you want autograding, pay or apply for Coursera financial aid. Then add Lee's courses or ADL for deep learning.

### 3. Building NLP and LLM applications: Chen's ADL

Follow the Fall 2025 slides and recordings, do HW1 from the public spec, and reconstruct the other assignments from their walkthrough videos; [this site's ADL 2025 Fall guide](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) walks this route lecture by lecture. This path leans more toward engineering practice than Lee's courses. Fall 2026 is underway, so check back at the end of the term to see whether more homework goes public.

The biggest difference between NTU and the other five schools is that open material centers on individual professors, not the university. The specialization tells you how courses connect, but the material you can actually study from lives on three professors' personal sites and YouTube channels, and each opens up differently. Lee shares homework but not grading. Lin shares videos, and his practice problems are on the Fall 2024 course page. Chen shares full recordings and only part of the homework. Figure out whether you're missing videos, problems, or feedback, then pick the professor whose course fills that gap.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Global AI/CS Course Map (series overview and A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [Harvard AI/ML Course Guide](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)
- [Berkeley AI/ML Course Guide](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
- [AI Courses in 2026 (includes a Hung-yi Lee section)](/posts/ai/2026-07-10-ai-courses-2026-guide-en)
- [NTU Course site](https://course.ntu.edu.tw/) (in Mandarin)
- [NTU specialization: Machine Learning and Artificial Intelligence](https://specom.aca.ntu.edu.tw/Domain/program?program=902002&lang=zh) (in Mandarin)
- [NTU Course: Machine Learning, 113-1 (Hsuan-Tien Lin)](https://course.ntu.edu.tw/courses/113-1/26214) (in Mandarin)
- [NTU CSIE AI master's program admission rules](https://www.csie.ntu.edu.tw/zh_tw/Admission/Announcement13/%E4%BA%BA%E5%B7%A5%E6%99%BA%E6%85%A7%E7%A2%A9%E5%A3%AB%E7%8F%AD-%E4%B8%80%E8%88%AC%E7%94%9F-%E8%80%83%E8%A9%A6%E5%85%A5%E5%AD%B8%E8%A6%8F%E5%AE%9A-50477470) (in Mandarin)
- [Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Machine Learning 114-2 syllabus (EE5184)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) (in Mandarin)
- [JudgeBoi Guide (ML 2025)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [Introduction to Generative AI and Machine Learning 2025 Fall course page](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
- [Introduction to Generative AI and Machine Learning YouTube playlist](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) (in Mandarin)
- [Hung-yi Lee, Machine Learning 2025 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2025-spring.php)
- [Introduction to Generative AI 2024 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)
- [Hung-yi Lee, Machine Learning 2023 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php)
- [Hung-yi Lee, Machine Learning 2022 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2022-spring.php)
- [Hung-yi Lee, Machine Learning 2021 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2021-spring.php)
- [Hung-yi Lee, Machine Learning 2020 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2020-spring.php)
- [Hung-yi Lee, Machine Learning 2019 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2019-spring.php)
- [Hsuan-Tien Lin, MOOCs page](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (in Mandarin)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (in Mandarin)
- [Coursera: Machine Learning Foundations, Mathematical Foundations](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)
- [Coursera: Machine Learning Foundations, Algorithmic Foundations](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)
- [Coursera: Machine Learning Techniques](https://www.coursera.org/learn/machine-learning-techniques)
- [Coursera Blog: Introducing Coursera's new course preview experience (2025-08-08)](https://blog.coursera.org/introducing-courseras-new-course-preview-experience/)
- [Coursera Learner Help Center: Enrollment options](https://www.coursera.support/s/article/learner-000001306)
- [Hsuan-Tien Lin, Machine Learning, Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Hsuan-Tien Lin, Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Yun-Nung Chen, Vivian NTU MiuLab YouTube playlists](https://www.youtube.com/@VivianMiuLab/playlists)
- [Foundations of AI 2026 Spring YouTube playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7lTGzNejZoLHRBF4X2mJfI)
- [Foundations of AI 114-2 syllabus, section 01 (Shang-Tse Chen)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=01&dpt_code=9020&ser_no=55080&semester=114-2&lang=CH) (in Mandarin)
- [Foundations of AI 114-2 syllabus, section 02 (Yun-Nung Chen)](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=902%2030100&class=02&dpt_code=9020&ser_no=11206&semester=114-2&lang=CH) (in Mandarin)
- [Yun-Nung Chen, Teaching page](https://www.csie.ntu.edu.tw/~yvchen/teaching.html)
- [TAICA course list, spring semester of academic year 114](https://taicatw.net/spring-114/) (in Mandarin)
- [ADL Fall 2026 course site](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)
- [ADL Fall 2025 course site](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [Computer Vision I course site](https://cv2.csie.ntu.edu.tw/CV/) (in Mandarin)
- [DCCV Lab YouTube playlists](https://www.youtube.com/@DCCVLab/playlists) (in Mandarin)
- [NTU OpenCourseWare: Artificial Intelligence, Learning & Theory](https://ocw.aca.ntu.edu.tw/courses/mooc0016) (in Mandarin)
- [Deep Reinforcement Learning 113-2 syllabus](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=922+U4960&dpt_code=9220&semester=113-2&ser_no=10169)
