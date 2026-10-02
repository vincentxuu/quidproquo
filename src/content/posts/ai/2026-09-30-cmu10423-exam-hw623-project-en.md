---
title: "CMU 10-423 Wrap-up: The Practice Exam, the HW623 Paper Presentation, and the Final Project — How the Course Checks Learning, and How to Check Yourself"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, exam-prep, paper-reading, research-project, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 23
tldr: "Beyond its four homework assignments, CMU 10-423 checks learning four ways: 6 in-class quizzes, 2 programming tests, one comprehensive exam, and a three-person final project worth 25%. 10-623/723 students also do HW623, a paper presentation. Outside CMU you can get the practice exam with solutions (13 sections, 167 points), the HW623 handout with its 33-paper list, and the 12-page project handout. This post lays out their structure and rules and gives a self-check routine that works without peeking at the answers."
description: "The wrap-up post for CMU 10-423/623/723 Generative AI (Spring 2026): section weights and question types on the Spring 2026 practice exam, scope and rules for quizzes and programming tests, the HW623 role-playing paper presentation (6 roles, 33 papers, recording and submission, AI-use rules), the final project's milestones, grading, replication requirement, and AI Assistance Policy, plus a self-check routine for self-learners. Exam answers are not reproduced."
draft: false
glossary:
  - term: "role-playing paper presentation"
    aliases: ["role-playing seminar"]
    definition: "Instead of just summarizing a paper, the presenter takes on an assigned role (peer reviewer, archaeologist, researcher, industry practitioner, private investigator, social impact assessor) and analyzes the paper from that role's point of view."
    context: "CMU 10-423's HW623 uses this method, which comes from Colin Raffel and Alec Jacobson."
    links:
      - label: "Colin Raffel: Role-Playing Paper-Reading Seminars"
        url: "https://colinraffel.com/blog/role-playing-seminar.html"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)

**This post is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is the last post (part 23) of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and follows [L24–L26: audio, video generation, and interactive world models](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en). The four homework guides ([HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en), [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en), [HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en), [HW4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en)) covered the programming assignments. This one covers everything else the course uses to check learning.

Official materials used: the [syllabus on the course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/), the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html), the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) (41 pages) and its [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf) (44 pages), the [HW623 handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) (4 pages), and the [project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf) (12 pages). The course's access grade is **A3** (definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Still, the real exam, the quiz and programming-test questions, Gradescope grading, and Piazza announcements covered here are all private. Outsiders get only the practice materials and the rules.

The question for this post: **beyond homework, how does a course decide you've learned the material, and how can an outside reader check themselves with only the public materials?**

## Assessment at a glance

The syllabus lists weights for three course numbers. Content is identical; 10-623 adds HW623, and 10-723 adds Quiz723 on top of that:

| Component | 10-423 | 10-623 | 10-723 |
|---|---|---|---|
| Homework | 30% (5 assignments) | 30% (6, adds HW623) | 30% (6) |
| In-class quizzes | 10% (6, lowest counts half) | 10% (same) | 10% (6, equal weight) |
| Programming tests | 10% (2) | 10% | 10% |
| Exam | 20% (1) | 20% | 20% |
| Project | 25% | 25% | 25% |
| Participation | 5% | 5% | 5% |

The timeline from the schedule:

| Date (2026) | Event |
|---|---|
| 1/28 | Quiz 1 (L1–L4) |
| 2/16 | Quiz 2 (L5–L9) |
| 2/25 | Programming Test HW1/HW2; Quiz 3 (L9–L12) |
| 3/13 | Project team formation due (2pm) |
| 3/16 | Quiz 4 (L12–L15) |
| 3/23 | HW623 out; practice problems out |
| 3/27 | Programming Test HW3/HW4 |
| 3/30 | Exam (evening; details announced on Piazza) |
| 4/3 | Project proposal due |
| 4/6 | Quiz 5 (L16–L20) |
| 4/13 | Project midway report due |
| 4/20 | HW623 due; Quiz 6 (L21–L24) |
| 4/26 | Project poster due |
| 4/28 | Final project presentations (5:30–8:30pm, GHC 6121 and 6115) |
| 4/30 | Project final report due |

## Rules for quizzes, programming tests, and the exam

What the syllabus says about each:

- **Quizzes**: closed-book unless noted, held in class on a Monday, Wednesday, or Friday, and meant as a lower-stakes assessment than the exam.
- **Programming tests**: focused on the programming skills built in the homework, closed-book, attendance required.
- **Exam**: closed-book and comprehensive, held in class, with the date set on the schedule.

The official materials disagree in two places, listed here as found:

1. The coursework page says "There will be 5 quizzes" and then lists Quiz 1 through Quiz 6. The syllabus and schedule both say 6.
2. The syllabus says the second programming test covers "HW4/HW5," but this term only has HW1–HW4, and the schedule says "Programing Test HW3/HW4." This post follows the schedule.

None of these questions are public. The practice exam is the only thing outsiders can compare against.

## The practice exam: 13 sections, 167 points

The practice exam is titled "Spring 2026 Practice Questions," dated 03/30/26, with the time limit listed as "NA." The cover rules forbid electronic devices during the exam. The coursework page files it under "Midterm Exam," next to the solutions.

| Section | Topic | Points | In this series |
|---|---|---|---|
| 1 | AutoDiff / RNN-LMs | 11 | [part 1](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) |
| 2 | Transformers and LLMs | 30 | [part 2](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en) |
| 3 | Learning neural language models / Decoding | 8 | [part 2](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en) |
| 4 | Pre-training, fine-tuning / Modern Transformers | 17 | [part 3](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) |
| 5 | Vision Transformers | 14 | [part 5](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en) |
| 6 | GANs | 9 | [part 6](/posts/ai/2026-09-30-cmu10423-gans-en) |
| 7 | VAEs | 8 | [part 8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en) |
| 8 | Diffusion Models | 8 | [part 7](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) |
| 9 | In-context Learning | 8 | [part 10](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en) |
| 10 | RLHF / DPO | 12 | [part 11](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en) |
| 11 | Text-to-image Models and VLMs | 19 | [part 13](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en) |
| 12 | Prompt2Prompt | 19 | [part 14](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en) |
| 13 | Scaling Laws | 4 | [part 16](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en) |

Three things stand out:

- **The scope stops at Scaling Laws.** The exam fell on March 30, the same day as L20, so distributed training, long context, reasoning models, agents, and audio/video (L17 onward) are absent.
- **The text unit weighs the most.** The first four sections total 66 points, close to 40% of the exam.
- **Multimodal gets drilled in detail.** Sections 11 and 12 total 38 points, and Prompt2Prompt alone takes 19.

Most questions are multiple choice, split into Select one, Select all that apply, and True/False, with a good number of short-answer items, such as explaining a design's pros and cons or the intuition behind the two terms of a training objective. Some questions tie directly to homework; the first item in section 11 opens with "In Homework 4…". There are a few rough edges: item 7.1 is worth 0 points, and section 13 totals 4 points while only two of its items carry point values.

The solutions version is 3 pages longer and marks the correct choices and short answers inline. This post does not reproduce the answers.

## HW623: the role-playing paper presentation

HW623 is only for students registered in 10-623/723. The syllabus says it focuses on "understanding, explaining, and evaluating key topics from the recent literature on generative AI." The handout says it goes out 3/30/26 and is due 4/20/26 (the schedule lists the release as 3/23).

### What you do

Read a recent generative AI paper and record a short presentation using [Colin Raffel and Alec Jacobson's role-playing method](https://colinraffel.com/blog/role-playing-seminar.html). Pick one of six roles:

| Role | Task |
|---|---|
| Scientific peer reviewer | Write a full review following the NeurIPS reviewer guidelines, answering Questions 1–10 on the Review Form and assigning an overall score |
| Archaeologist | Find a prior paper that substantially influenced this one and a more recent paper that cites it |
| Academic researcher | Propose an imaginary follow-up project, pretend it succeeded, and present it in the style of a paper introduction using a five-point structure |
| Industry practitioner | Describe an application or product of your choice in detail and pitch why you should be paid to apply the paper's method to it |
| Private investigator | Run a background check on one author: where they worked, what they studied, which earlier projects led here, what motivated them |
| Social impact assessor | Identify how the paper self-assesses its impact, then add positive impacts it left out and negative impacts it overlooked |

A few rules:

- Whatever the role, the presentation must start with a summary of the paper.
- You can record with the webcam off (Khan Academy style).
- You make slides and submit them with the recording.
- After submission, all HW623 videos are shared with the class on Piazza.
- **AI use**: you may use AI to help understand the paper, but everything you create and submit must be your own, with no AI assistance.

The handout is inconsistent about length. Section 1 says "5–10 minutes," while the recording steps say to present for 7–10 minutes and that going over 11 minutes is penalized. You record to the cloud from a Zoom personal meeting, paste the sharing info into Gradescope, and upload the slides as a PDF.

### The paper list

The list has 33 papers. To present a paper not on it, send a private Piazza note to the instructors explaining why. Grouped roughly by this series' units:

| Unit | Examples from the list |
|---|---|
| Text LLMs and architecture | [Mamba](https://arxiv.org/abs/2312.00752), [The Era of 1-bit LLMs](https://arxiv.org/abs/2402.17764), [Transformers without Normalization](https://arxiv.org/abs/2503.10622), [Overtrained Language Models Are Harder to Fine-Tune](https://arxiv.org/abs/2503.19206) |
| Alignment and reasoning | [Constitutional AI](https://arxiv.org/abs/2212.08073), [DPO](https://arxiv.org/abs/2305.18290), [Tree of Thoughts](https://arxiv.org/abs/2305.10601), [DeepSeekMath](https://arxiv.org/abs/2402.03300) |
| Image and video generation | [DiT](https://arxiv.org/abs/2212.09748), [ControlNet](https://arxiv.org/abs/2302.05543), [Video Diffusion Models](https://arxiv.org/abs/2204.03458), [HART](https://arxiv.org/abs/2410.10812), [NeRF](https://arxiv.org/abs/2003.08934) |
| Multimodal | [BLIP-2](https://arxiv.org/abs/2301.12597), [Visual Instruction Tuning](https://arxiv.org/abs/2304.08485), [ImageBind](https://arxiv.org/abs/2305.05665), [RT-2](https://arxiv.org/abs/2307.15818) |
| Agents and tools | [ToolLLM](https://arxiv.org/abs/2307.16789), [AutoGen](https://arxiv.org/abs/2308.08155), [WebArena](https://arxiv.org/abs/2307.13854), [CRITIC](https://arxiv.org/abs/2305.11738), [Mixture-of-Agents](https://arxiv.org/abs/2406.04692) |
| Risk and interpretability | [Progress measures for grokking](https://arxiv.org/abs/2301.05217), [Extracting memorized pieces of (copyrighted) books](https://arxiv.org/abs/2505.12546) |

For all 33, see [pages 2–3 of the handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf).

## The final project: teams of three, replication required

The coursework page says the project is done in the last 4 weeks of the course. The [project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf) (compiled April 15, 2026) opens with four steps: identify a generative modeling problem on a real-world dataset, establish a baseline with appropriate metrics, design experiments comparing multiple algorithms in a controlled setting, and report findings through the milestones.

### Milestones and grading

| Milestone | Due | Length | Weight |
|---|---|---|---|
| Team formation (3 people, Google form) | 3/13, 2pm | — | 2.5% |
| Proposal | 4/3 | 2–3 pages | 15% |
| Liaison meeting 1 | 4/5–4/9 | — | — |
| Midway Executive Summary | 4/13 | 3–4 pages | 20% |
| Liaison meeting 2 | 4/21–4/26 | — | — |
| Final Poster | PDF upload 4/26 | 9 slides in a 3×3 grid with a 3×1 header | 20% |
| Final Executive Summary | 4/30 | 5–6 pages, appendices allowed | 32.5% |
| Code Upload | With the final report | — | 10% |

Teams with a size other than 3 get reassigned. The proposal and midway report allow no appendices; the final report does, but going over 6 pages is penalized. The poster presentation is 9 minutes plus 3 minutes of questions.

### What gets graded

Several points in the handout directly shape how you should pick a project:

- **Not judged against state-of-the-art**: results aren't graded relative to the best reported numbers, so when choosing a baseline you can favor fast code, simple layout, and familiar libraries like PyTorch.
- **Your starting point is taken into account**: a team that built from scratch with fewer experiments and a team that started from existing code with more experiments can both score well. Either way, document where the time went.
- **Novelty is encouraged, not required**: reimplementing a method that has no public implementation can be the main contribution.
- **You must replicate at least one prior result**: include a table with the original paper's number next to yours. Replication doesn't have to match exactly; the original says 92.3 and you get 91.9, which is common. The handout separates replication (reproducing a result) from reimplementation (writing new code for a method).
- **Scaling down is fine**: use a data subset or a smaller model, as long as you document the decision and why.

Both the midway and final reports include a "Thought-Experiment on Compute" section: how many GPU/TPU hours you actually used, of what type, and their dollar equivalent, plus what you'd have done differently with $1,000 of cloud GPU credits. The final report also needs a "Research Log" that explains the meandering path and the obstacles; the handout calls it "arguably the most important part of this document."

### AI Assistance Policy

You may use AI in the project, but the team is responsible for everything submitted, and there must be meaningful human work behind it. The midway report, the poster, and the final report must each state clearly:

1. Which parts of the project used AI assistance
2. Which AI tools were used
3. How they were used
4. Which parts were done primarily by humans
5. How you checked that the resulting code, analysis, or writing was correct or trustworthy

The midway report must also say how you expect to use AI for the rest of the project. The handout notes that course staff may ask you to explain your code, experiments, and design choices in your own words during liaison meetings and poster Q&A, and that undisclosed AI use or being unable to explain core parts will lower the project grade. It follows the same logic as the homework's [Slot A/Slot B system](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en): first show that you understand it yourself, then use AI for speed.

## How outside readers can check themselves

You can't get the real questions, but the practice exam, HW623, and the project handout are enough to build a self-check routine:

1. **Write first, check later.** Print the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), finish one section without notes, then open the solutions. That's the course's own Slot A/Slot B order.
2. **Use scores to find weak spots.** Fill your per-section score into the mapping table above. For any section under half, reread the matching series post and slides.
3. **Short answers must explain "why."** Getting a multiple-choice item right doesn't mean you understand it. If you can't write two sentences of reasoning for a short-answer item, count it as missed.
4. **Write your own questions for L17 onward.** The practice exam doesn't cover the back half. Use the Quiz 5 and 6 scopes (L16–L20, L21–L24) and take two "Question / Answer" slides from each lecture as prompts.
5. **Read one paper through an HW623 role.** Pick a paper from the 33 that relates to your weakest unit, choose the archaeologist or reviewer role, and record a talk under 10 minutes for yourself.
6. **Shrink the project to a weekend.** Pick one generation task and do just two things: reproduce one paper's number and write a one-page Thought-Experiment on Compute. Those are the two things the handout cares about most.

**Try this tonight**: do only section 4 of the practice exam (17 points, Modern Transformers), with a 25-minute limit and no notes, then check the solutions. It covers LoRA, RoPE, and autoencoders, which spans the first third of the series.

## What this post can and cannot confirm

Confirmed: the syllabus weights, schedule dates, the coursework page's lists, the structure of the practice exam and its solutions, and the contents of the HW623 and project handouts. Not confirmed: the real exam's questions and scope (only the practice exam exists publicly, and the syllabus says only that the exam is comprehensive), the questions and format of quizzes and programming tests, what Quiz723 contains, grading rubrics, and follow-up announcements on Piazza. For the three inconsistencies flagged above (number of quizzes, scope of the second programming test, HW623 talk length), this post can't tell which version is final.

Further reading: to compare how other courses run projects and exams, see [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en) (also on this course's prerequisite list) and [Reading Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en).

Series navigation: previous [L24–L26: audio, video generation, and interactive world models](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en) | this is the last post | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page and syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (quizzes, programming tests, exam, project timeline)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Coursework page (homework, quiz scopes, practice exam links)](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Spring 2026 Practice Exam Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Homework 623: Paper Presentation](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
- [Course Project handout (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [Colin Raffel: Role-Playing Paper-Reading Seminars](https://colinraffel.com/blog/role-playing-seminar.html)
