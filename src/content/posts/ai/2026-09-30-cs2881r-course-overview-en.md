---
title: "Reading Harvard CS2881R: What Outsiders Can Get from the First Graduate AI Safety Course"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, course-guide]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 0
tldr: "Harvard CS 2881R is the graduate AI safety seminar Boaz Barak first taught in Fall 2025. That term is finished: all 12 reading lists are public, the YouTube playlist has lecture recordings for 11 of the 12 sessions, HW0 is a GitHub repo you can run yourself, and the midterm and final specs and rubrics are out. This series rates it A3 by seminar standards. The gaps are just as clear: no traditional problem sets, slides for only about half the sessions, no lecture recording for L5, and only the opening remarks for L8. Fall 2026 is in progress and is treated only as a preview."
description: "Entry point for Harvard CS 2881R AI Safety (Fall 2025): where the official site lives, why Fall 2025 is the base term, the A3 rating and its gap list, the official lecture order versus this series' reading order, prerequisites (CS 181 level), the conflict-of-interest note on the course site, and a preview of Fall 2026."
draft: false
glossary:
  - term: "emergent misalignment"
    aliases: ["EM"]
    definition: "Fine-tuning a language model on a narrow domain (for example, bad medical advice) makes it broadly misaligned on unrelated questions too."
    context: "CS 2881R's HW0 reproduces this with a 1B model."
    links:
      - label: "Model Organisms for Emergent Misalignment (arXiv 2506.11613)"
        url: "https://arxiv.org/abs/2506.11613"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: This series follows the [CS 2881R Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/). Every fact was checked against official materials on 2026-09-30. Access rating: **A3 (by seminar standards)**; the gap list is below.

**Series**: This is the entry post | Next: [L1: Why AI Safety Deserves a Graduate Course](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction-en)

[CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) is a Harvard graduate course taught by theoretical computer scientist [Boaz Barak](https://boazbarak.org). The course site describes it in two sentences: a graduate-level course on challenges in the alignment and safety of AI, covering both technical questions and societal impacts.

Head TA Roy Rinberg's [retrospective](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) calls it "Harvard's first AI safety course" in its title. For a graduate seminar, it is unusually open: lecture recordings, student-written weekly summaries, the homework repo, and the final papers and posters are all reachable from outside Harvard.

This post answers three questions: where the materials are, what you can actually get, and how to read this series. Lecture content lives in the later posts.

## Course video sources

This article covers multiple lectures; choose recordings by topic and lecture from the official index.

Course and recording entries:

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## Where the site is: an old ML theory seminar URL

The first trap is the URL. The course lives on Boaz's GitHub Pages at `boazbk.github.io/mltheoryseminar/`, the path he used for his earlier ML theory seminars. The footer still links the [Spring 2023 ML Theory Seminar](https://boazbk.github.io/mltheoryseminar/spring2023) and a Spring 2021 version.

Open the root today and you get **Fall 2026**. Fall 2025 moved to [`/fall2025/`](https://boazbk.github.io/mltheoryseminar/fall2025/), which labels itself "Fall 2025 archive." The Fall 2026 homepage confirms that last year's lecture materials, videos, notes, and experiments are preserved there.

Fall 2025 basics, all from the course site:

- **Time**: Thursdays 3:45–6:30pm Eastern. First lecture 2025-09-04, last lecture 11-20, no class 11-27 (Thanksgiving).
- **Staff**: Boaz Barak; TFs Roy Rinberg, Natalie Abreu, Hanlin Zhang, Sunny Qin.
- **Format**: the Mini Syllabus says each lecture also includes discussion and an experiment presented by a group of students. Attendance is mandatory.
- **Generative AI policy**: students are encouraged to use it as much as they can, and the site says expectations for assignments and projects will be more ambitious as a result.
- **Recording policy**: lectures are recorded and published when technically possible, by a static in-room camera, so whiteboard work and discussion may not come through well. Guest speakers who ask not to be recorded are not recorded.

## Why Fall 2025 is the base term

The Fall 2026 [homepage](https://boazbk.github.io/mltheoryseminar/) schedule runs to 12-03. As of 2026-09-30, only the four September lectures have happened. The [YouTube playlist](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) currently holds 17 videos, and Fall 2026 Lecture 1 and Lecture 3 are already mixed in.

Fall 2025 is complete. All 12 lectures happened, final papers were due 12-03, and students brought printed posters to class on 12-10 (per [Rinberg's retrospective](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)). The [student projects page](https://boazbk.github.io/mltheoryseminar/student_projects) lists 19 paper PDFs with posters.

So Fall 2025 is the main line of this series. Fall 2026 appears only as a preview in the last section of this post.

## Access rating: A3, but read the gaps first

This site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) grades openness from A0 (schedule visible) through A1 (syllabus visible) and A2 (partial materials) to A3 (enough to self-study). This series rates CS 2881R **A3 by seminar standards**. The course was never a problem-set course; its learning path is "read the paper, reproduce it, extend it," and everything that path needs is available outside Harvard:

| Material | Status |
|---|---|
| Reading lists | All 12 lectures, with pre-readings marked, on the course site |
| Lecture recordings | [Playlist](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) of 17 videos; 11 of the 12 Fall 2025 lectures have lecture video (L8 only Boaz's intro) |
| Notes | Student-written LessWrong weekly summaries under the [wikitag "CS 2881r"](https://www.lesswrong.com/w/cs-2881r) |
| Student experiments | Most sessions link slides, GitHub, or a LessWrong post |
| HW0 | [Public GitHub repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0), including the LLM-as-judge grading script |
| Midterm mini-project | [Spec slides](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew) and [rubric](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII), linked from Rinberg's retrospective |
| Final project | [Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I), [rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM), [papers and posters](https://boazbk.github.io/mltheoryseminar/student_projects), [oral presentations video](https://youtu.be/Xr9FNl0S66Q) |
| Course evaluation | Harvard's official [Q-report PDF](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) |

**Gap list** (what outside readers must supply themselves or live without):

1. **No traditional problem sets.** "Homework" means paper reproduction and open-ended research. One student critique in Rinberg's retrospective asked for optional problem sets or hands-on exercises.
2. **No lecture recording for L5 Content Policies.** The site lists only a student experiment video. The guest was Ziad Reslan of OpenAI.
3. **L8 Scheming has only Boaz's intro video.** Buck Shlegeris's and Marius Hobbhahn's guest talks are represented by slides only.
4. **Slides for only about half the sessions.** Boaz's slides for L1, L2, L4, L6, and L8 sit on Harvard SharePoint; the L7 and L8 guest slides and Neel Nanda's L10 slides have separate links. L3, L5, L9, L11, and L12 list no slides.
5. **Incomplete weekly summaries.** The wikitag's weekly summaries cover only some weeks; the other posts are student experiment write-ups.
6. **Several experiment slots say TBD.** L6 says "To be determined" plus a sketch, L7 says "TBD," L9, L10, and L11 say "To be determined," and L12's Resources say "to be determined."
7. **HW0 autograding works only for enrolled students.** GitHub Classroom runs the grader with the course's OpenAI key. Outside readers need their own API key to run `eval/judge.py`.

If your goal is to finish a set of exercises with known answers, this course cannot give you that. If your goal is to learn how to read an AI safety paper, reproduce its headline figure, and push one step further, the public materials are enough.

## Prerequisites: CS 181-level ML and the ability to train a network

The site is specific: mathematical maturity, proofs, probability, and information theory, plus undergraduate ML at the level of Harvard CS 181 or MIT 6.036. It names empirical versus population loss, gradient descent, neural networks, linear regression, and PCA. On the applied side you should write Python comfortably and be able to train a basic neural network.

On this site:

- The [Harvard CS 181 guide](/posts/tech/2026-08-27-harvard-cs181-overview-en) covers the exact course the prerequisites name.
- HW0 fine-tunes a 1B model with LoRA. If LoRA is new to you, start with the [CMU 11-868 PEFT/LoRA post](/posts/ai/2026-09-30-cmu11868-peft-lora-en).

Rinberg reports about 70 students in Fall 2025, roughly half experienced undergraduates and the rest graduate students. He also thinks the course would not have gone as well as an undergraduate course, because its structure relied on students who wanted to learn rather than chase grades.

## Conflict of interest: the site's own words

The Mini Syllabus carries an all-caps "POTENTIAL CONFLICT OF INTEREST NOTE." Its first sentence:

> In addition to his position at Harvard, Boaz is also a member of the technical staff at OpenAI.

The note goes on: the course discusses models from multiple providers, students are encouraged to use AI from multiple providers, and anyone uneasy about the conflict can contact Boaz, the other staff, or Harvard SEAS administration. It ends in Boaz's voice: he will count it a great success if graduates work in AI safety in any capacity, including academia, nonprofits, governments, and any of OpenAI's competitors.

Keep this in mind as you read. The L5 and L9 guests were an OpenAI product policy lead and OpenAI's chief economist, and both L12 guests are from OpenAI. This series reports speaker affiliations exactly as the site lists them.

## Official order versus this series' order

The official schedule interleaves technical and societal lectures. This series follows a learner's path instead: see misalignment first, then how it is trained in and broken, then how specs are written, then reproduce something yourself, then the hardest-to-detect risks and the tools for detecting them, and finally timelines and societal impact. Every title keeps the official lecture number.

| Series order | Post | Official session and date |
|---|---|---|
| 0 | This post | — |
| 1 | [L1 Introduction](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction-en) | L1, 9/4 |
| 2 | [HW0: Reproducing emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en) | Before term (due 2025-08-04) |
| 3 | [L2 Modern LLM Training](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training-en) | L2, 9/11 |
| 4 | [L3 Adversarial Robustness](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en) | L3, 9/18 |
| 5 | [L4 Model Specifications](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs-en) | L4, 9/25 |
| 6 | [L5 Content Policies](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies-en) | L5, 10/2 |
| 7 | [Midterm mini-project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en) | Midterm |
| 8 | [L8 Scheming & Deception](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en) | L8, 10/23 |
| 9 | [L10 Interpretability](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en) | L10, 11/6 |
| 10 | [L6 Recursive Self-Improvement](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en) | L6, 10/9 |
| 11 | [L7 Capabilities vs. Safety](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en) | L7, 10/16 |
| 12 | [L9 Economic Impacts](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts-en) | L9, 10/30 |
| 13 | [L11 Emotional Reliance](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance-en) | L11, 11/13 |
| 14 | [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035-en) | L12, 11/20 |
| 15 | [Final projects and retrospective](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective-en) | Paper 12/3, poster 12/10 |

HW0 sits after L1 and before L2 because it actually came before the first lecture: it was the admission filter, due a month before term. The student experiment in L1 was itself a follow-up to HW0.

## Fall 2026 preview (supplement, not the main line)

What the new term looks like. The main series does not rely on any of this:

- **New lecture topics.** The [Fall 2026 homepage](https://boazbk.github.io/mltheoryseminar/) lists Cyber Capabilities, RL for Post-Training, Open-Source Models, Alignment in the Age of RSI, and AI Biosecurity, none of which were Fall 2025 sessions. The 12-03 slot is labeled Ajeya Cotra.
- **A new HW0.** [Fall 2026 HW0](https://boazbk.github.io/mltheoryseminar/hw0-2026/) is "Relationship between J-space and model chain of thought," estimated at 4–16 hours, submitted as a roughly two-page report plus a private GitHub repo, due 2026-08-05.
- **A clearer assignment structure.** The homepage lists presenting an experiment in class, writing scribe notes, a final project, and possibly homework or mini-projects.
- **Videos already up.** The playlist has Fall 2026 Lecture 1 and Lecture 3.

The HW0 page itself says last year's lectures and notes are worth a look, but the field moves fast and this year's content will differ. Once Fall 2026 ends, this series will decide whether to write an update.

## Related reading on this site

Each post in this series stands on its own. Where it overlaps other course guides on the site, it links out rather than cutting content:

- LLM training and RLHF: [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en), [Stanford CME295 guide](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en)
- RL foundations: [Berkeley CS285 Spring 2026 guide](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)
- Interpretability: [CS224U analysis methods: probing and attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en)
- Prompt injection and agent security in practice: [The harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en)
- LLM-as-judge: [Stanford CS329Z Week 8: judges and guardrails](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)
- Other Harvard courses: [Harvard AI/ML course map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)

One thing to do tonight: open the [HW0 repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) README, read the three "Instructions" steps, and decide whether your GPU or cloud budget can handle LoRA fine-tuning of a 1B model.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS 2881R AI Safety, Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/) — description, prerequisites, Mini Syllabus, conflict-of-interest note, 12-lecture schedule and reading lists
- [CS 2881R Fall 2026 homepage](https://boazbk.github.io/mltheoryseminar/) — new schedule, assignment structure, note that last year's materials are preserved
- [CS 2881R Fall 2026 Homework Zero](https://boazbk.github.io/mltheoryseminar/hw0-2026/) — new HW0 topic, time estimate, submission requirements
- [CS 2881R YouTube playlist](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) — lecture recordings (17 videos as of 2026-09-30)
- [LessWrong wikitag: CS 2881r](https://www.lesswrong.com/w/cs-2881r) — student weekly summaries and experiment posts
- [Harvard-CS-2881/harvard-cs-2881-hw0](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) — Fall 2025 HW0 repo
- [Student Final Projects - Fall 2025](https://boazbk.github.io/mltheoryseminar/student_projects) — 19 final papers and posters
- [Final oral presentations video](https://youtu.be/Xr9FNl0S66Q)
- [Roy Rinberg, Reflections on TA-ing Harvard's first AI safety course (LessWrong, 2026-01-15)](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) — enrollment, assignment structure, final deadlines, midterm and final document links
- [CS2881 Mini-project slides](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew), [Mini Project Grading](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII)
- [cs2881 Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I), [Final Project Grading Rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)
- [Harvard Q-report (course evaluation)](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf)
- [Turner et al., Model Organisms for Emergent Misalignment (arXiv 2506.11613)](https://arxiv.org/abs/2506.11613) — the paper HW0 reproduces
