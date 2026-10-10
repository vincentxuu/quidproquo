---
title: "Taiwan AI Open Courses Beyond NTU: Using TAICA's Course Lists to Find NTHU, NCCU, NCKU, and NTUT Classes"
date: 2026-09-30
category: learning
tags: [taiwan, ai-course, learning-path, open-course, nthu, nccu]
lang: en
series:
  name: "Global AI/CS Course Map"
  order: 98
type: guide
tldr: "Most public AI courses in Taiwan outside NTU come from TAICA, an alliance set up by the Ministry of Education. Each semester's course list says where every flagship course streams, and courses that stream on YouTube are usually watchable by anyone. Two courses are complete enough to self-study: Hung-Yu Kao's Natural Language Processing at NTHU (Fall 2025) and Yen-Lung Tsai's Generative AI at NCCU (Spring 2025), both A3. Wei-Ta Chu's Introduction to AI at NCKU, Ping-Hsuan Han's Human-AI Interaction at NTUT, and Min-Chun Hu's Robotic Navigation and Exploration at NTHU have full recordings but keep assignments on NTU COOL, so they rate A2. NYCU's TAICA courses are taught in English; the Deep Learning recordings are not publicly listed and Physical AI has just started, so neither made the main table."
description: "Using the TAICA (Taiwan AI College Alliance) course lists from Fall AY113 to Fall AY115 as an index, this audit covers NTHU Hung-Yu Kao's NLP, NCCU Yen-Lung Tsai's Generative AI (including the Chang Gung satellite-class page run by Chih-Yuan Yang), NCKU Wei-Ta Chu's Introduction to AI, NTUT Ping-Hsuan Han's Human-AI Interaction, NTHU Min-Chun Hu's Robotic Navigation and Exploration, and NYCU's Deep Learning and Physical AI: latest public term, public assets, school-only parts, and an A0–A3 rating."
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟", "Taiwan AI College Alliance"]
    definition: "The Taiwan AI College Alliance, set up by Taiwan's Ministry of Education. Universities with strong AI faculty run flagship courses, and students at other member schools take them through live online classes, with credit recognized by their own school."
    context: "This post uses TAICA's per-semester course lists as an index of public Taiwanese AI courses."
  - term: "mirror course"
    aliases: ["鏡像課程", "closed authorization"]
    definition: "TAICA's closed authorization: a member school opens a matching local course, students follow the flagship course, and the flagship instructor handles all assessment."
    context: "NTHU Hung-Yu Kao's Natural Language Processing is listed as a mirror course in Fall AY115."
  - term: "satellite course"
    aliases: ["衛星課程", "conditional authorization"]
    definition: "TAICA's conditional or open authorization: a co-instructor at the member school opens the course and assigns TAs, and handles exams and grading. Under conditional authorization the flagship instructor's assessment design applies; under open authorization the co-instructor can customize it."
    context: "Chih-Yuan Yang's Generative AI page at Chang Gung University is the satellite-class page for Yen-Lung Tsai's NCCU flagship course."
---

> 🌏 [中文版](/posts/learning/2026-09-30-taiwan-ai-course-map)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

The [NTU map](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) covered Hung-yi Lee, Hsuan-Tien Lin, and Yun-Nung Chen. Outside NTU, Taiwan has several more AI courses taught in Mandarin with a full semester of recordings on YouTube. They are hard to find because the materials are scattered across instructors' GitHub repos, Google Sites, lab pages, and sometimes the website of a co-instructor at another university.

This post ties them together with one official source: the course list that TAICA (Taiwan AI College Alliance) publishes every semester. Ratings follow the A0–A3 scale from the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en). A0 means only a catalog entry, A1 a syllabus, and A2 some substantive material or recordings. A3 means materials plus assignments are enough to form a coherent self-study path. The scale is this site's editorial judgment. It says nothing about credit or TA grading. NTU courses stay in the NTU post and are not repeated here. Everything below reflects checks made on **September 30, 2026**.

All courses in this post are taught in Mandarin unless noted otherwise.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [IKMLab/NTHU_Natural_Language_Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [Fall 2025](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [GenerativeAI2025](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [Introduction to Artificial Intelligence](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/index.html)
- [Lectures page](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/lectures.html)

## What TAICA is: a list that tells you where each course streams

The "Origin of the Project" section on the [TAICA homepage](https://taicatw.net/) says the alliance was set up by the Ministry of Education. It pools teaching resources through cross-university AI programs, so universities with enough AI faculty can support schools that lack them. The alliance has run since academic year (AY) 113, which began in fall 2024, and the homepage says 55 institutions had joined by the second semester of AY113. The programs cover Applied AI Exploration, Industrial Applications, Natural Language Technology, and Computer Vision, and the site menu later added a Cybersecurity Technology program.

The model is built on "flagship courses" (主導課程). One university teaches the course and streams it live; other member schools open a matching local course for their students. The [Info for Administrators](https://taicatw.net/course-info-for-admin/) page defines three authorization types:

- **Closed authorization (mirror course)**: the flagship instructor handles all assessment for member-school students.
- **Conditional authorization (satellite course)**: assessment follows the flagship instructor's design, while a co-instructor at the member school runs exams and grading.
- **Open authorization (satellite course)**: the co-instructor can customize assessment.

For outside learners, the most useful pages are the semester course lists: [Fall AY113](https://taicatw.net/fall-113/), [Spring AY113](https://taicatw.net/spring-113/), [Fall AY114](https://taicatw.net/fall-114/), [Spring AY114](https://taicatw.net/spring-114/), and [Fall AY115](https://taicatw.net/fall-115/). Each entry lists the school, instructor, language, a syllabus PDF, and an "Online Class Link." Fall AY115 (fall 2026) has 10 flagship courses from six universities.

The "Online Class Link" field works as a filter. When it points to a YouTube channel, the stream and recordings are usually open to anyone. When it points to NTU COOL, Google Meet, or Webex, recordings usually stay with enrolled students. The field is only a starting point, though, and each course needs checking:

- Hung-Yu Kao's NLP at NTHU lists NTU COOL, yet its recordings are public on YouTube and linked from the GitHub course page.
- Yen-Lung Tsai's course at NCCU lists a Facebook live-stream group and separately names a YouTube channel as the recording archive.
- Kun-Ta Chuang's Generative AI Application Systems and Engineering at NCKU (Spring AY114) listed a YouTube stream for week 1 and NTU COOL for every other week. That week-1 video is now private.

## At a glance: courses outside NTU worth self-studying

| Course and term | Rating | What outsiders can get | School-only parts or gaps |
|---|---:|---|---|
| **NTHU Hung-Yu Kao, Natural Language Processing, Fall 2025** | **A3** | Lecture and TA-session slides, 36 YouTube links in the schedule, HW1–4 PDFs, report templates, starter notebooks | Solutions, grading, term-project spec |
| NTHU Hung-Yu Kao, Natural Language Processing, Fall 2026 (in progress) | A2 | W1–W3 slides and recordings, syllabus, HW1 | Later weeks not yet posted |
| **NCCU Yen-Lung Tsai, Generative AI, Spring 2025 (1132)** | **A3** | 14 recordings, 14 slide PDFs, 12 assignment briefs with rubrics on the Chang Gung satellite page, demo notebooks | Submission and grading through each school's platform; notebook repo keeps changing |
| NCCU Yen-Lung Tsai, Generative AI, Fall 2025 (1141) | A2 | 13 lecture recordings in the channel's live section (lectures 3–15) | No public assignment page |
| **NCKU Wei-Ta Chu, Introduction to AI, Fall 2025** | **A2** | 26-video playlist, Ch0–4 slides | Course page now shows Fall 2026; later slides and assignment specs not public |
| **NTUT Ping-Hsuan Han, Human-AI Interaction, AY114-1** | **A2** | 14 lecture recordings plus midterm and final-project playlists | Assignments are short essays plus online quizzes, all on NTU COOL |
| NTUT Ping-Hsuan Han, Human-AI Interaction, AY115-1 (in progress) | A2 | Schedule spreadsheet, W1–W3 Google Slides and recordings, 5 assignment prompts | Submissions and quizzes on NTU COOL |
| **NTHU Min-Chun Hu, Robotic Navigation and Exploration, Spring 2026** | **A2** | 15 live-stream recordings (Weeks 1–13), TAICA syllabus PDF | No official public lab specs or code |

## NTHU, Hung-Yu Kao's Natural Language Processing: the most complete course outside NTU

Kao's course page is the GitHub repo [IKMLab/NTHU_Natural_Language_Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing). The front page is the 2026 edition, and earlier years sit in year folders. It is a graduate-level TAICA flagship course and has appeared on every fall list since Fall AY113. The [Fall AY115 TAICA syllabus](https://drive.google.com/file/d/1XHyNRHTGJPPpru90WbciVdDMrT-fFU7u/view) marks it as a mirror course, streamed live on Thursday mornings.

The latest complete term is [Fall 2025](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md). The schedule runs from word embeddings, language models, seq2seq and attention, Transformers, the BERT family, and decoding strategies to GPT-3, InstructGPT, RLHF, PEFT, and RAG. Each week links one or two YouTube recordings, 36 unique video links in total. The [assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md) lists four assignments: Word Analogy, Arithmetic, Multi-output learning, and RAG. Each has an explainer video, a PDF brief, a report template, and a `main.ipynb`. TA sessions add example notebooks for PyTorch, Hugging Face, and LLM APIs.

That makes Fall 2025 an A3. What you cannot get is solutions, scores, and the full term-project spec. [Fall 2026](https://github.com/IKMLab/NTHU_Natural_Language_Processing) is in progress with only W3 and HW1 posted so far, and its schedule ends with a new Reasoning/Agent unit.

This site's [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series walks through Fall 2025 week by week, and its entry post compares grading and materials across both terms.

Something to do tonight: open Assignment 1 in the 2025 folder, watch the explainer video, and run the Word Analogy `main.ipynb` once in Colab.

## NCCU, Yen-Lung Tsai's Generative AI: the fullest course page lives at Chang Gung

The course is Generative AI: Text and Image Synthesis Principles and Practice, taught by Yen-Lung Tsai of NCCU's Department of Mathematical Sciences. It is a TAICA flagship course. The [Fall AY115 list](https://taicatw.net/fall-115/) marks it as a satellite course with a two-star difficulty, one of the most beginner-friendly AI courses on the list.

Search for this course and the most complete page you find is [GenerativeAI2025](https://yangchihyuan.github.io/courses/GenerativeAI2025). It sits on the CGU AICV Lab site of Chih-Yuan Yang in Chang Gung University's Department of Artificial Intelligence, and it is the page for Chang Gung's **satellite class**. The page states the offering school is NCCU and the instructor is Yen-Lung Tsai. Yang appears under co-instructor office hours, alongside two Chang Gung TAs. So the recordings and slides come from Tsai, while Yang supports and grades the Chang Gung section. That is TAICA's normal satellite arrangement, not two instructors co-teaching one course. The Chang Gung section also changed the grading: the average of 12 assignments counts for 100% and the final project for 0%, because seniors' grades were due early. NCCU's own grading follows the [Fall AY115 syllabus](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view).

The most complete term is Spring 2025 (1132):

- The [1132 playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) has 14 recordings, running from neural networks, GANs, Transformers, LLMs, chatbots, RAG, and AI agents to VAEs, diffusion, and ControlNet.
- The 14 slide PDFs are in Tsai's [public Google Drive folder](https://yenlung.me/1132GenAI).
- The Chang Gung satellite page lists each week's assignment brief and rubric.
- Class demos live in [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo). The repo is shared across his courses and workshops and still changes after the term ends, so it is not a snapshot of 1132.

Fall 2025 (1141) was never gathered into a playlist. The live section of the [Iveai – I've AI](https://www.youtube.com/@ive-iveai/streams) channel still holds that term's lectures 3 through 15. No public assignment page exists for that term, so it rates A2. Fall 2026 (1151) is in progress, and its playlist already holds the first four lectures.

This site's [Reading NCCU Yen-Lung Tsai's Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series follows 1132 lecture by lecture.

## NCKU, Wei-Ta Chu's Introduction to AI: full recordings, half the materials

Chu's [Introduction to Artificial Intelligence](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/index.html) has been on the TAICA list since its first semester. The [Fall AY115 syllabus](https://drive.google.com/file/d/1O-LjaMceSVCnJ1uIYfptRYLzRt--M6W7/view) gives a class size of 2,850. It streams on his [YouTube channel](https://www.youtube.com/@WeiTaChu) and uses AIMA, 4th edition.

The URL is the catch. The course page path still says `2025f_AI`, but the content is now Fall 2026, and the news line reads "Sep. 9, 2026 Website online." The [Lectures page](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/lectures.html) links slides only from Lecture 0 through Chapter 4; later chapters are commented out in the HTML. The assignments page shows only HW1, a final-project proposal. The syllabus lists five assignments, including programming work, and the other four specs are not public.

The recordings are in better shape. The [2025 playlist](https://www.youtube.com/playlist?list=PLSwYd_vsn-YuOTjvLOUA7ybRg1WWwe7P6) has 26 videos: one class recording per week plus a set of unit videos on attention, Transformers, CLIP, running an LLM locally, and RAG. The [2024 playlist](https://www.youtube.com/playlist?list=PLSwYd_vsn-Yuu7Ce8FZypH1dR6aN_U7kO) has 15, and the [2024 course page](http://mmcv.csie.ncku.edu.tw/~wtchu/courses/2024f_AI/lectures.html) likewise links only Ch0–4 slides. Overall it rates A2. It works well for an AIMA-style AI intro in Mandarin, but you will need to find your own exercises.

## NTUT, Ping-Hsuan Han's Human-AI Interaction: AI as an interaction-design problem

This course takes a different angle from the others. It does not teach how to train models; it teaches how people interact with AI systems. The [course site](https://sites.google.com/view/human-ai-interaction) lists it as graduate-level, open to juniors and above, and taught in Mandarin. It streams on the [XRLab channel](https://www.youtube.com/@xrlabntut0411) of Han's lab.

The AY114-1 [lecture playlist](https://www.youtube.com/playlist?list=PL0I-in7ElVWamRM4VdMJpL1E2tISR3NqY) has 14 videos, and the channel has separate playlists for the midterm, final-project proposals, and final projects. The AY115-1 schedule lives in a public spreadsheet. The first half covers HCI basics, human-AI dialogue, human factors, and large multimodal models; the second half covers virtual humans, heuristic evaluation, and human-AI co-creation. Google Slides and recordings for the first three weeks are already linked, and the slides export straight to PDF.

The [assignments page](https://sites.google.com/view/human-ai-interaction/%E4%BD%9C%E6%A5%AD) lists five prompts, such as "When AI-generated images fall short" and "When MCP is out of my control." Each is a short personal essay plus an online quiz, both run on NTU COOL, so outside readers can only take the prompts and write on their own. It rates A2.

## NTHU, Min-Chun Hu's Robotic Navigation and Exploration: a robotics course found on the TAICA list

This course was not on the original shortlist; it turned up while scanning the [Spring AY114 list](https://taicatw.net/spring-114/). The list marks it as a Mandarin, graduate-level satellite course streaming on the [NTHU RNE channel](https://www.youtube.com/@NTHURNE-l9v). The [TAICA syllabus](https://drive.google.com/file/d/1oSYXDvDiF_CAz-qw11YIZsGCB2o3sISI/view) splits the content into three parts: SLAM, scene understanding with machine learning, and action control through path planning, navigation, and reinforcement learning. The reference texts include Probabilistic Robotics and Sutton & Barto.

The channel's live section holds 15 Spring 2026 recordings, Week 1 through Week 13. The curated [RNE 2026 playlist](https://www.youtube.com/playlist?list=PLTnMPhAPz9jZUy33snHFrckiz5ABXuLj6) stops at Week 5, so use the live section for the second half. The syllabus schedules a lab most weeks, but the only lab code online is in repos that students posted themselves. With no official lab specs or starter code, it rates A2.

## NYCU: why it is not in the main table

NYCU has run TAICA flagship courses every semester since Spring AY113. The AI courses found for this post are all taught in English, and their recordings are not open enough:

- **Deep Learning** (Wen-Hsiao Peng, Yong-Sheng Chen, Ping-Chun Hsieh; Spring 2026): the [Spring AY114 list](https://taicatw.net/spring-114/) points mainly to Google Meet and links a single YouTube video. That video is on a TA's personal channel and is unlisted, and the channel has no public videos. The only thing outsiders can rely on is the [TAICA syllabus](https://drive.google.com/file/d/13oO9d8D8VCkAr4ZmyK2nojp1vEZ3h0hW/view), so it rates A1.
- **Physical AI** (Yi-Ting Chen; Fall 2026): the [playlist](https://www.youtube.com/playlist?list=PLQBINSduGuUw) is public and currently has six videos covering Lectures 1–4, and the [syllabus](https://drive.google.com/file/d/1dgHk0w80-s-ujBbeAp1pk6O1oA0SRYp6/view) is public too. But the course is only four weeks in, and no course site or assignments turned up. It rates A2 (in progress) for now and is worth revisiting after the term.
- **Introduction to Programming (C++)** (Hung-Pin Wen): the list links a YouTube playlist, but this is a programming course rather than an AI course, and the playlist shows nine hidden videos.

## Other TAICA courses: visible, but not this site's focus

| Course | School and instructor | Language | What is public | Rating |
|---|---|---|---|---:|
| AI Ethics (Spring 2026) | Tunghai, Zhen-Rong Gan | Mandarin | 14 weeks of stream archives on the [channel](https://www.youtube.com/@AI-Ethics_2026); the [Spring 2025 playlist](https://www.youtube.com/playlist?list=PL2wUUgdSGIefCX_sNm7Mv5LcJIcr9Ruva) has 13 | A2 |
| Intelligent Manufacturing Execution Systems (Spring 2026) | NCKU, Yuh-Min Chen | Mandarin | The channel linked from the TAICA list has a full term of stream recordings, but the subject is manufacturing systems, not core AI | A2 |
| Data Mining (Fall 2026) | NTHU, Yi-Shin Chen | English | The [course page](https://www.cs.nthu.edu.tw/~yishin/courses/ISA5810/ISA5810-2026.html) is public; the [channel](https://www.youtube.com/@NTHU_ISA5810_DataMining)'s 2025 lecture playlist has only 4 videos, plus two lab playlists | A2 |
| Generative AI Application Systems and Engineering (Spring 2026) | NCKU, Kun-Ta Chuang | Mandarin | Syllabus public; the week-1 stream is now private and other weeks ran on NTU COOL | A1 |
| Large Language Models and Information Security Systems (Spring 2026) | NTUST, Jyun-Ruei Lin | English | [Syllabus](https://drive.google.com/file/d/1ZhWBgqTG31TdBkQklyYyckYNAqtAIiD7/view) public; classes run on NTU COOL. The focus is using LLMs for security analysis; only one of 16 weeks covers protecting AI itself | A1 |

## AI security courses

TAICA's [AI for Cybersecurity Technology program](https://taicatw.net/artificial_intelligence_for_cybersecurity_technology_program/) lists two advanced courses on its course map: "AI Security and Privacy Protection" and "AI Applications in Cybersecurity." Through Fall 2026 (academic year 115, first semester), only the second has actually been offered, and that is Lin's course in the table above. It teaches you to use LLMs for security work, not to defend against attacks on AI.

If you want a course on protecting AI systems themselves, such as adversarial examples, data poisoning, model stealing, or prompt injection against LLMs, you have to look outside TAICA:

| Course | School and instructor | Latest term | Level | What outsiders can get |
|---|---|---|---:|---|
| [AI Security](https://sites.google.com/view/nvlinh/teaching-awards/ai-security) | National Chung Cheng University, Van-Linh Nguyen | Spring 2026 | **A3** | Taught in English; slides, notebooks, and two assignments in a public folder |
| [Attack and Defense on AI Applications](https://class-qry.acad.ncku.edu.tw/syllabus/online_display.php?syear=0115&sem=1&co_no=NQ51100&class_code=) | NCKU cybersecurity master's program, I-Hsun Chuang | Fall 2026 | A1 | Weekly syllabus; two weeks of LLM security added from Fall 2026 |
| [Trustworthy AI](https://timetable.nycu.edu.tw/?r=main/crsoutline&Acy=114&Sem=1&CrsNo=535105&lang=zh-tw) | NYCU, Chia-Mu Yu | Fall 2026 | A1 | Weekly syllabus covering adversarial examples, backdoors, model stealing, and privacy attacks |

The Chung Cheng course has run only once, in Spring 2026, and its material links could disappear at any time, so download what you need early. At NTU, the broadest course is Shang-Tse Chen's [Security and Privacy of Machine Learning](https://www.csie.ntu.edu.tw/~stchen/teaching/spml25/), but its slides and recordings are inside NTU COOL, so outsiders only get A1, and it isn't offered in Fall 2026. For a comparison with AI security courses at top schools abroad, see [the AI security section of the overview](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Three reliable routes for outside learners

### 1. For NLP and LLM applications: NTHU Hung-Yu Kao's NLP, Fall 2025

The four assignments go from word vectors to RAG, each with a brief, template, and notebook. Its scope is close to Yun-Nung Chen's ADL at NTU, but more of its assignment material is public.

### 2. For beginners who want to build something first: NCCU Yen-Lung Tsai's Generative AI, 1132

Follow the weekly schedule on the Chang Gung satellite page: one recording and one assignment per week. It is shallower than Hung-yi Lee's courses, but most lectures come with a Colab assignment, and each one leaves you with a small working app.

### 3. For an AI survey or a different angle: NCKU Wei-Ta Chu, NTUT Ping-Hsuan Han, NTHU Min-Chun Hu

Chu's course gives you an AIMA-style tour in Mandarin, Hu's covers robotics and reinforcement learning, and Han's covers how users actually interact with AI. All three offer recordings and partial materials only, so you will need your own exercises.

The public courses outside NTU share one trait. TAICA needs thousands of students across schools to attend at once, so instructors stream to YouTube, and openness is a side effect. That is why recordings are complete while assignments and grading stay on NTU COOL. To keep up with new courses, open TAICA's latest course list at the start of each semester and read the "Online Class Link" column.

## Update log


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-05: Corrected the description of Lin's Large Language Models and Information Security Systems (its focus is using LLMs for security, not protecting AI). Added an "AI security courses" section covering the status of TAICA's cybersecurity program and AI security courses at Chung Cheng, NCKU, NYCU, and NTU.

## References

- [Global AI/CS Course Map (series overview and A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [NTU AI/ML Course Guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
- [Harvard AI/ML Course Guide](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)
- [Reading NTHU Hung-Yu Kao Natural Language Processing: series entry](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)
- [Reading NCCU Yen-Lung Tsai's Generative AI: overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)
- [TAICA homepage](https://taicatw.net/) (in Chinese, with English labels)
- [TAICA: About Alliance Institutions](https://taicatw.net/about-taica/) (in Chinese)
- [TAICA: Info for Administrators (authorization types)](https://taicatw.net/course-info-for-admin/) (bilingual)
- [TAICA course list, Fall AY113](https://taicatw.net/fall-113/) (in Chinese)
- [TAICA course list, Spring AY113](https://taicatw.net/spring-113/) (in Chinese)
- [TAICA course list, Fall AY114](https://taicatw.net/fall-114/) (bilingual)
- [TAICA course list, Spring AY114](https://taicatw.net/spring-114/) (bilingual)
- [TAICA course list, Fall AY115](https://taicatw.net/fall-115/) (bilingual)
- [IKMLab/NTHU_Natural_Language_Processing (GitHub)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [NTHU NLP 2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [NTHU NLP 2025 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [NTHU NLP Fall AY115 TAICA syllabus](https://drive.google.com/file/d/1XHyNRHTGJPPpru90WbciVdDMrT-fFU7u/view) (in Chinese)
- [Chang Gung satellite class: Generative AI 2025](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese)
- [Yen-Lung Tsai, 1132 Generative AI playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Mandarin)
- [Yen-Lung Tsai, 1132 slide folder](https://yenlung.me/1132GenAI) (in Chinese)
- [yenlung/AI-Demo (GitHub)](https://github.com/yenlung/AI-Demo)
- [Iveai – I've AI live section](https://www.youtube.com/@ive-iveai/streams) (in Mandarin)
- [NCCU Generative AI Fall AY115 syllabus](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese)
- [NCKU Wei-Ta Chu, Introduction to AI course page (currently Fall 2026)](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/index.html)
- [NCKU Wei-Ta Chu, Introduction to AI lectures](https://mmcv.csie.ncku.edu.tw/~wtchu/courses/2025f_AI/lectures.html)
- [NCKU Wei-Ta Chu, Introduction to AI 2024 lectures](http://mmcv.csie.ncku.edu.tw/~wtchu/courses/2024f_AI/lectures.html)
- [NCKU Introduction to AI Fall AY115 TAICA syllabus](https://drive.google.com/file/d/1O-LjaMceSVCnJ1uIYfptRYLzRt--M6W7/view) (in Chinese)
- [Wei-Ta Chu YouTube channel](https://www.youtube.com/@WeiTaChu) (in Mandarin)
- [Introduction to AI 2025 playlist](https://www.youtube.com/playlist?list=PLSwYd_vsn-YuOTjvLOUA7ybRg1WWwe7P6) (in Mandarin)
- [Introduction to AI 2024 playlist](https://www.youtube.com/playlist?list=PLSwYd_vsn-Yuu7Ce8FZypH1dR6aN_U7kO) (in Mandarin)
- [NTUT Human-AI Interaction course site](https://sites.google.com/view/human-ai-interaction) (in Chinese)
- [NTUT Human-AI Interaction assignments page](https://sites.google.com/view/human-ai-interaction/%E4%BD%9C%E6%A5%AD) (in Chinese)
- [XRLab NTUT YouTube channel](https://www.youtube.com/@xrlabntut0411) (in Mandarin)
- [AY114-1 Human-AI Interaction playlist](https://www.youtube.com/playlist?list=PL0I-in7ElVWamRM4VdMJpL1E2tISR3NqY) (in Mandarin)
- [NTHU Robotic Navigation and Exploration TAICA syllabus](https://drive.google.com/file/d/1oSYXDvDiF_CAz-qw11YIZsGCB2o3sISI/view) (in Chinese)
- [NTHU RNE YouTube channel](https://www.youtube.com/@NTHURNE-l9v) (in Mandarin)
- [RNE 2026 class recordings playlist](https://www.youtube.com/playlist?list=PLTnMPhAPz9jZUy33snHFrckiz5ABXuLj6) (in Mandarin)
- [NYCU Deep Learning TAICA syllabus](https://drive.google.com/file/d/13oO9d8D8VCkAr4ZmyK2nojp1vEZ3h0hW/view) (in Chinese)
- [NYCU Physical AI Fall 2026 playlist](https://www.youtube.com/playlist?list=PLQBINSduGuUw)
- [NYCU Physical AI TAICA syllabus](https://drive.google.com/file/d/1dgHk0w80-s-ujBbeAp1pk6O1oA0SRYp6/view) (in Chinese)
- [Tunghai AI Ethics stream channel](https://www.youtube.com/@AI-Ethics_2026) (in Mandarin)
- [Tunghai AI Ethics 1132 playlist](https://www.youtube.com/playlist?list=PL2wUUgdSGIefCX_sNm7Mv5LcJIcr9Ruva) (in Mandarin)
- [NTHU ISA5810 Data Mining 2026 course page](https://www.cs.nthu.edu.tw/~yishin/courses/ISA5810/ISA5810-2026.html)
- [NTHU ISA5810 YouTube channel](https://www.youtube.com/@NTHU_ISA5810_DataMining)
- [NTUST Large Language Models and Information Security Systems TAICA syllabus](https://drive.google.com/file/d/1ZhWBgqTG31TdBkQklyYyckYNAqtAIiD7/view)
- [TAICA AI for Cybersecurity Technology program](https://taicatw.net/artificial_intelligence_for_cybersecurity_technology_program/)
- [National Chung Cheng University AI Security (Van-Linh Nguyen) course page](https://sites.google.com/view/nvlinh/teaching-awards/ai-security)
- [NCKU Attack and Defense on AI Applications, Fall 2026 syllabus](https://class-qry.acad.ncku.edu.tw/syllabus/online_display.php?syear=0115&sem=1&co_no=NQ51100&class_code=)
- [NYCU Trustworthy AI, Fall 2025 syllabus](https://timetable.nycu.edu.tw/?r=main/crsoutline&Acy=114&Sem=1&CrsNo=535105&lang=zh-tw)
- [NTU Security and Privacy of Machine Learning (Shang-Tse Chen)](https://www.csie.ntu.edu.tw/~stchen/teaching/spml25/)
