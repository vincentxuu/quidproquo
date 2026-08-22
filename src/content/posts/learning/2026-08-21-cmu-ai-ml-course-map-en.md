---
title: "CMU AI/ML Course Guide: The New 07-280 Core and a Public Self-Study Route"
date: 2026-08-21
category: learning
tags: [cmu, ai-course, machine-learning, learning-path, open-course]
lang: en
series:
  name: "Global AI and CS Course Maps"
  order: 2
type: guide
tldr: "CMU's current BSAI now runs through 07-280 and 07-380 before branching into an NLP/vision core and four AI clusters, but 07-380 does not debut until Fall 2026. The residual Spring 2026 materials for 07-280 and the complete 10-301/601 site already support self-study; retired 15-281 remains a useful legacy route."
description: "A guide to CMU's AI/ML curriculum based on the official BSAI requirements, the 2026 course redesign, actual offerings, and anonymous access tests for 07-280, 07-380, 15-281, 10-301, 10-414, 11-785, and 16-385."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-cmu-ai-ml-course-map)

CMU differs from the previous stops in this series. It has a formal Bachelor of Science in Artificial Intelligence, and it is actively rewriting that degree's foundation. **07-280 Artificial Intelligence and Machine Learning I** debuted in Spring 2026. Its sequel, **07-380**, will not be taught for the first time until Fall 2026. The old 15-281 Artificial Intelligence and 10-315 Introduction to Machine Learning for SCS are leaving the regular path.

That produces an apparent contradiction with a useful answer: **look at 07-280/380 to understand what CMU now believes an AI undergraduate should study, but use the completed Spring 2026 remains of 07-280 or the continuing 10-301/601 course if you want something executable outside CMU today.** A future Fall 2026 page is not yet a completed public course.

This guide therefore does not turn a list of the newest course numbers into a self-study plan. It first reconstructs the new BSAI core, then tests each 2025–2026 site as an anonymous visitor. The audit date is **August 21, 2026**. Fall 2026 classes have not started, so a published future schedule does not count as delivered material.

## The new BSAI core is broader than model training

CMU introduced the BSAI in Fall 2018. The current curriculum first requires a substantial mathematics, statistics, and CS foundation: 15-122, 15-150, 15-210, 15-213, 15-251, calculus, linear algebra, discrete mathematics, and probability/statistics. Its AI core can be compressed into this map:

```text
15-122 + discrete mathematics + linear algebra
              + calculus / probability
                         ↓
                07-280 AI & ML I
                         ↓
                07-380 AI & ML II
                         ↓
              11-411 NLP or 16-385 Vision
                         ↓
one from each cluster: decision/robotics | ML | perception/language | human-AI interaction
```

This is much broader than “learn ML, then choose an LLM course.” Beyond models and perception, students must cover decision making, robotics, human-AI interaction, and a separate ethics elective. 07-280 itself combines search, constraint satisfaction, probability, machine learning, reinforcement learning, and GPU fundamentals. Its projects use systems such as AlexNet, GPT-2, and AlphaZero to connect classical AI with modern deep learning.

The formal foundation for 07-280 includes 15-122, linear algebra, and a concepts/discrete-mathematics course, plus calculus and probability requirements. 07-380 then requires 07-280, Calculus II, and an approved probability course. Those rules are strict prerequisites for CMU students. An outside learner will not face a registration block, but the assignments will expose the same missing skills.

## 07-280/380 are not simple renumberings

The old route is often summarized as:

```text
15-281 Artificial Intelligence + 10-315 Machine Learning
```

The new route is:

```text
07-280 AI & ML I → 07-380 AI & ML II
```

This is not a one-to-one change of numbers. CMU integrated AI and ML, then redistributed breadth and depth across two new courses. The 07-280 FAQ also compares the course with 10-301. Both provide introductory ML preparation, but 07-280 adds search, CSPs, GPU fundamentals, and Monte Carlo tree search. 10-301 instead retains topics such as KNN, the perceptron, PAC learning, PCA, clustering, bagging and boosting, and recommender systems.

The timeline needs precise wording:

- **Fall 2025:** 15-281 still ran as a regular course.
- **Spring 2026:** 07-280 debuted. A permission-only transition section of 15-281 served students who had already taken the old 10-315 or similar ML course and still needed the old pairing.
- **Fall 2026:** 07-380 debuts. CMU plans to offer both 07-280 and 07-380 every fall and spring afterward.

Thus, “15-281 is retired” does not mean that it had no Spring 2026 section. It has left the normal entrance while a transition arrangement remained. 10-301 is different: it has not retired and continues as the Machine Learning Department's general ML introduction. A BSAI student who has completed 10-301 also cannot assume that it automatically replaces 07-280 or grants access to 07-380; the program asks those students to arrange an individual alternate path.

## Public material in 2025–2026

The table uses the editorial scale from the [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): A0 exposes only a catalog-level entry, A1 adds a syllabus, A2 includes substantive partial material, and A3 is coherent enough to organize into a self-study course. These are not CMU ratings. They do not promise credit, instructors, formal grading, peers, or free compute.

| Course and edition | Rating | What opens anonymously | Main gap |
|---|---:|---|---|
| **07-280, Spring 2026** | **A3** | Lecture PDFs/notes, recitations and solutions, written homework, and some programming notebooks | The home page now points to Fall 2026; no stable semester index, complete public video, or autograder |
| **07-280, Fall 2026** | **A2** | Full course specification, a 24-lecture topic list, and some public notes | Starts August 25; current slides, assignments, and video are not yet complete |
| **07-380, Fall 2026** | **A0** | An eleven-line specification covering description, topics, prerequisites, and assessment | First offering; no syllabus, schedule, or delivered materials yet |
| **15-281, Spring 2026** | **A3** | Slides, course notes, recitations, P0–P5, written homework, and practice exams with solutions | Some Panopto, Canvas, and Gradescope functions require CMU identity |
| **10-301/601, Spring 2026** | **A3** | 27 lectures of slides/inked slides, readings, recitations and solutions, nine homework sets with starter assets, and exam practice with solutions | Panopto, Piazza, Gradescope, and official homework solutions are restricted |
| **16-385, Spring 2026** | **A2** | 26 lectures of slides/readings, notebooks, and seven programming-assignment specifications | Accounts, submission, grading, and some starter access are restricted |
| **11-785, Spring 2026** | **A3** | 29 public YouTube lectures/slides, notes, and bootcamp/recitation notebooks | HW1–4 mostly depend on Piazza/Autolab; no anonymous CMU compute |
| **10-414/714, current site** | **A3*** | 26 lectures of slides/notebooks, official 2022 video, and implementation notebooks | `*` mixes editions; the 2025 HW0–3 repositories currently return 404, and `mugrade` is enrollment-only |
| **10-708, Spring 2026** | **A2** | Roughly 25 sets of slides and readings | Recordings are enrollment-only; four homework sets are available only through Piazza |

07-280 must be split by edition. Its home page now points to Fall 2026, which starts four days after this audit; the lecture-material column and most assignments are not yet populated, so the current offering is only an A2 preview. However, the completed Spring 2026 lecture PDFs, notes, recitation worksheets and solutions, written homework, and some AlexNet, GPT-2, and AlphaZero notebooks remain anonymously available at official CMU URLs. That is enough for A3. The problem is preservation: CMU did not retain a stable Spring 2026 semester home page, so those direct links may disappear.

07-380 is clearer. Its page usefully previews ML theory, game theory, probabilistic graphical models, planning, distributed deep learning, generative AI, RLHF, vision transformers, diffusion, and VAEs. But the first class has not happened, and the page has no syllabus or schedule. A detailed topic paragraph is not a completed public course.

## Three routes that an outside learner can actually follow

### 1. Broad AI: follow 07-280, keep 15-281 as a fallback

If you want search, planning, uncertainty, and agent foundations, start with **07-280 Spring 2026**. It is the formal entrance to the new BSAI, and its residual material covers lecture notes, recitations, written homework, and some programming notebooks. The problem is not a lack of content but the overwritten semester index: the completed edition has to be reconstructed from the current site and official direct links.

**15-281 Spring 2026** remains a fallback classical-AI route. Its public site retains notes, recitations, P0–P5, written problems, and exam practice, making it A3 as well. Do not mistake it for CMU's future sequence. It is a complete historical edition left by a transition section. Prefer it if the 07-280 links later disappear or if you specifically want its classical AI projects.

### 2. Machine learning: 10-301/601 is the stable specialist entrance

If the goal is ML, deep learning, or later research courses, **10-301/601 Spring 2026** is more practical than waiting for 07-380. It publishes slides, readings, recitations, nine homework starter packages, practice exams, and solutions. Even though the video platform and formal submission systems are restricted, the public material forms an A3 route.

10-301 and 07-280 are parallel entrances, not two halves of one sequence:

```text
Broad AI + ML in the new BSAI: 07-280 → 07-380
Focused statistical ML:         10-301/601
```

An outside learner can choose by objective rather than imitate the degree and complete both. 10-301 maps more directly into advanced ML and systems courses. 07-280 is the correct institutional answer if you want to understand how CMU's new BSAI combines search, decision making, and learning.

### 3. Go deep in one branch: vision, deep learning, or systems

Choose one branch after the foundation instead of bookmarking all three:

- **16-385 Computer Vision Spring 2026** is one of the BSAI's two NLP/vision core choices. Its slides, readings, notebooks, and seven assignment specifications support serious study, but accounts, grading, and parts of the starter workflow remain restricted, so this guide conservatively rates it A2.
- **11-785 Introduction to Deep Learning Spring 2026** publishes 29 YouTube lectures, slides, notes, and bootcamp/recitation notebooks. That is coherent enough for an A3 lecture-and-practice route, but HW1–4 mostly live in Piazza and Autolab. Here, A3 does not mean that the official graded assignment chain or GPU access is public.
- **10-414/714 Deep Learning Systems** moves from automatic differentiation through CPU/CUDA execution, CNNs, RNNs, and transformers while building a framework called Needle. The current official site is an assembled bundle: a Fall 2026 schedule, 2022 video, and assignments labeled 2025. Its lecture and implementation notebooks remain sufficient for A3 study, but the linked HW0–3 GitHub repositories now return 404. It is not accurate to call the current assignment package complete.

**10-708 Probabilistic Graphical Models Spring 2026** also has a current site with roughly 25 sets of slides and readings. Recordings are restricted to enrolled students, and all four homework sets live in Piazza, so the course lacks a public practice loop and receives A2. The historical 2019 and 2021 sites are more self-contained, but they should not be presented as 2026 material.

## What CSDIY can and cannot establish

CSDIY currently has dedicated pages for CMU **10-414/714, 11-785, and 10-708**. It does not independently list 07-280, 15-281, 10-301, or 10-315. That reveals its role: it is a community-curated self-study index, not a mirror of CMU's registrar or access state.

It is useful for finding the historical edition learners commonly use, estimating time, and discovering community solutions or supplements. By itself, it cannot establish:

- whether a Fall 2026 subject has actually begun rather than merely appearing on a future schedule;
- whether 15-281 or 10-315 has left the formal degree path;
- whether Panopto, Piazza, Autolab, Gradescope, or `mugrade` accepts an outside account;
- whether an assignment link also exposes starter code, data, local tests, and a usable evaluation path.

The reliable order is: **confirm the offering and course number through CMU's program, registrar, or current course site; anonymously open every material type; then use CSDIY for historical editions and community experience.** CSDIY alone misses courses. YouTube alone misses assignments. A future-dated course page can still lack a single delivered lecture.

## If you want to start tonight

Use ninety minutes to choose a lane instead of waiting for Fall 2026 to fill in:

1. To follow the newest BSAI core, read the 07-280 syllabus, then download one Spring 2026 written assignment and its corresponding notes. That will quickly expose missing mathematics or programming foundations.
2. For ML or LLM work, open the first 10-301/601 Spring 2026 homework and mark whether Python, linear algebra, or probability is the first blocker. Repair that shortest gap.
3. For deep-learning systems, run one 10-414 implementation notebook first. The assignment repositories are currently broken links, so do not confuse link repair with learning progress.

CMU's redesign exposes two layers that every course guide should separate: **a degree uses new courses to define the future; self-study uses material that is executable today.** Keeping both layers visible lets you follow the latest curriculum without waiting for every new course to finish publishing.

For comparison, the [MIT AI/ML Course Guide](/posts/learning/2026-08-21-mit-ai-ml-course-map-en) follows a more stable formal degree spine. The [Berkeley AI/ML Course Guide](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) builds parallel entrances without a standalone AI bachelor's degree. Together, the three schools make it clear that degree structure and public-course availability are separate questions.

## References

- [CMU SCS — BS in Artificial Intelligence](https://www.cs.cmu.edu/bs-in-artificial-intelligence/)
- [CMU SCS — BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [CMU SCS — BSAI Program Roadmap](https://www.cs.cmu.edu/bs-in-artificial-intelligence/program-roadmap)
- [07-280 Artificial Intelligence and Machine Learning I](https://www.cs.cmu.edu/~07280/)
- [07-380 Artificial Intelligence and Machine Learning II](https://www.cs.cmu.edu/~07380/)
- [15-281 Artificial Intelligence — Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU MLD — Introductory Machine Learning Classes](https://ml.cmu.edu/academics/ml-intro-classes)
- [10-301/601 Introduction to Machine Learning — Spring 2026](https://www.cs.cmu.edu/~mgormley/courses/10601/)
- [10-301/601 Spring 2026 Schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
- [10-301/601 Spring 2026 Coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
- [10-414/714 Deep Learning Systems](https://dlsyscourse.org/)
- [10-414/714 Lectures](https://dlsyscourse.org/lectures/)
- [10-414/714 Assignments](https://dlsyscourse.org/assignments/)
- [11-785 Introduction to Deep Learning — Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [16-385 Computer Vision — Spring 2026](https://16385.courses.cs.cmu.edu/spring2026/)
- [10-708 Probabilistic Graphical Models — Spring 2026](https://andrejristeski.github.io/10708S26/index.html)
- [CSDIY — CMU 10-414/714](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F/CMU10-414/)
- [CSDIY — CMU 11-785](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CMU11-785/)
- [CSDIY — CMU 10-708](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E8%BF%9B%E9%98%B6/CMU10-708/)
