---
title: "Reading Stanford CS224R: A Guide to the Spring 2026 Deep Reinforcement Learning Course"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, course-guide]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 0
tldr: "CS224R is Chelsea Finn's deep reinforcement learning course at Stanford. It runs from imitation learning to RL for LLMs and robot foundation models. For Spring 2026, all 17 slide decks, the three homework handouts with starter code, and the default project spec with starter code can be downloaded without logging in, so this series rates it A3 (enough to self-study). The gaps: the 2026 recordings are Canvas-only, the midterm and its solutions are not public, and HW2 and HW3 require Modal. The public recordings are from Spring 2025, so this series uses them as a supplement and flags the differences lecture by lecture."
description: "Series overview for Stanford CS224R Deep Reinforcement Learning (Spring 2026), built from the official home page, schedule, homework PDFs, default project spec, the Spring 2025 archive, and the YouTube playlist: what the course covers, prerequisites, grading and the AI tools policy, what outside readers can get, how the 2026 and 2025 offerings differ, and the reading arc for the whole series."
draft: false
glossary:
  - term: "A3 enough to self-study"
    definition: "One of the access tiers on this site's course map: structured materials plus homework and the files needed to do it are public, so you can work through the course in order."
    context: "CS224R Spring 2026 is rated A3, but its public recordings are from Spring 2025."
  - term: "default project"
    definition: "The final project option where the course supplies the task and starter code. In CS224R 2026 it means fine-tuning an LLM with RL, plus a research extension of your choice."
    context: "The alternative is a custom project on a topic you define."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-course-overview)

> **Source years**: slides, homework, project specs and grading are from Spring 2026 (2026-04-01 to 2026-06-08). The public recordings are from Spring 2025 (YouTube). They are only a supplement, and the differences are flagged below. This is post 0 of the Reading Stanford CS224R series and its entry point.

[CS224R: Deep Reinforcement Learning](https://cs224r.stanford.edu/) is [Chelsea Finn](https://ai.stanford.edu/~cbfinn/)'s deep RL course at Stanford. In Spring 2026 it met Wednesdays and Fridays at 9:30 am in NVIDIA Auditorium. The home page also carries one line about the future: the next offering moves to Fall 2027, and there is no Spring 2027. So as of September 2026, Spring 2026 is both the latest complete offering and the last one for a while.

This post answers four questions: what the course teaches, what outside readers can actually get, how the 2026 offering differs from the 2025 one that has public recordings, and how to read this series.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [CS224R Spring 2025 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Official course / lecture source](https://cs224r.stanford.edu/)

## What the course teaches

The course description opens with this idea: humans, animals and robots have to make decisions in the world, and those decisions change the world they live in. The course is about algorithms that learn behavior from experience. It focuses on practical methods that use deep neural networks to learn from high-dimensional observations.

The listed topics are learning from demonstrations, model-based and model-free deep RL, learning from offline datasets, and advanced multi-task techniques such as goal-conditioned RL and meta-RL. Examples come from robotics, visual navigation and control. The home page calls the course complementary to [CS234](https://web.stanford.edu/class/cs234/): neither is a prerequisite for the other, and CS224R is the more applied, deep-learning-heavy of the two, with an emphasis on robotics and language models.

The [first lecture's slides](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf) put the core goal in one sentence: be able to understand and implement existing and emerging methods. For theory and other applications, the slides point you to CS234.

## Prerequisites: the course assumes you know MDPs

The home page lists three layers:

| Prerequisite | What the course says | On this site |
|---|---|---|
| Machine learning | CS229 or equivalent: SGD, cross-validation, probability, multivariable calculus, linear algebra | [Reading CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) |
| Deep learning | Backprop, CNNs, sequence models such as transformers; homework is in PyTorch, with a PyTorch review session in week 1 | [Reading CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) (transformers) |
| Reinforcement learning | Some familiarity with RL basics; for intro material see [CS221's MDP and RL modules](https://stanford-cs221.github.io/autumn2022/modules/) or chapters 3–4 of [Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf) | [Reading CS221](/posts/ai/2026-08-21-stanford-cs221-ai-principles-en), [CS221 L7 on MDPs](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en) |

The third layer is the one people skip. Lecture 1's slides say "We will go quickly over the basics," so MDPs get only a quick pass. If value functions and the Bellman equation are new to you, read chapters 3–4 of Sutton & Barto first. The [L1 post](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en) in this series adds some MDP intuition, but it does not replace those chapters.

## Grading, the midterm, and late days

Spring 2026 grading comes from the home page and the lecture 1 slides:

| Component | Weight | Details |
|---|---|---|
| Homework | 40% | HW1 imitation learning 10%, HW2 online RL 15%, HW3 offline RL 15% |
| Final project | 35% | Teams of 1–3; proposal 4%, milestone 5%, poster 8%, report 18% |
| Midterm | 25% | In class on May 15, covering lectures through May 8 |
| Extra credit | up to 2% | Outstanding projects or outstanding Ed participation |

You get 5 late days for homework, the proposal and the milestone, with at most 2 on any one assignment. They do not apply to the poster or the final report. After the 5 days run out, each extra late day costs 2% of the final course grade.

These rules changed from 2025. The [Spring 2025 archive](https://cs224r.stanford.edu/spring_2025/) lists four homeworks at 50%, a project at 50%, no exam, and 6 late days. The 2026 offering dropped one homework and added a midterm.

There are two kinds of final project. The **default project** uses a Qwen model on the Countdown arithmetic reasoning task. You implement three stages: SFT warm-start, DPO/IPO-style preference optimization, and RLOO with a rule-based verifier reward. Then you add a research extension of your choice (see the [Default Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)). The **custom project** is a topic you define (see the [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)). The home page notes that the default project has changed since Spring 2025, so the [2025 project examples](https://cs224r.stanford.edu/spring_2025/projects/cs224r_final_projects.html) are only a guide to direction.

## The AI tools policy is stricter than the home page suggests

The home page's honor code section says you may work through problems with classmates and AI tools, but you must write up solutions and code on your own. Help from AI counts the same as help from another person. Copying, referring to, or looking at solutions from other students, AI tools, or past offerings is an honor code violation, **and that includes code autocomplete**. Posting your solutions publicly, for example in a public git repo, is also a violation.

The homework PDFs go further:

- [HW1](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf), [HW2](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf) and [HW3](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf) each state that, for the sake of deeper understanding, **using generative models to write code for the assignment is prohibited**.
- The default project spec says you may not work with AI tools such as GitHub Copilot or ChatGPT on **any** part of the default project, with the extension as the only exception.

For self-learners these rules carry no enforcement, but they show what the course intends: the value of the homework is filling in the TODOs yourself. The homework posts in this series cover the task, the functions to implement and the experiment questions. They do not give solutions.

## What outside readers can get: A3, with four gaps

Using the tiers on this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), CS224R Spring 2026 rates **A3, enough to self-study**. On September 30, 2026, all of the following opened without a login:

- 17 slide decks for the term (01–13 and 15–18 on the schedule; slot 14 was the midterm and has no slides)
- HW1–HW3 handouts, LaTeX templates and starter code zips
- The [compute guide](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf), a Modal how-to that says it is adapted from the CS336 Spring 2026 guide
- The default project spec and [starter code](https://cs224r.stanford.edu/material/default_proj.zip), and the custom project spec
- The Q-learning [TA section handout](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf) (the filename really is spelled "Tutotial") and the midterm [review deck](https://cs224r.stanford.edu/material/CS224R_Exam_Review_Session_Riya.pptx)
- The [2026 final project list](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)

There are four gaps, and every post in the series flags them:

1. **The 2026 recordings are not public.** The home page says they live in Canvas's Panopto tab, visible only to enrolled students. The public recordings are from Spring 2025.
2. **The midterm and its solutions are not public.** Only the review deck is. Homework solutions, autograders, Ed and Gradescope are also closed.
3. **HW2 and HW3 require Modal.** Both say to complete "all sections on Modal instances" and that other platforms are not supported. The default project spec says each enrolled student gets $500 in Modal credits. Outside readers do not, so bring your own compute. HW1 also ships Colab instructions.
4. **Some guest-lecture slides have very little text.** L10 is a guest lecture by Noam Brown, and its slides are mostly images. That post only covers claims visible on the slides.

## Why the Spring 2025 recordings are a supplement

With no public 2026 recordings, [Stanford Online's Spring 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL) is the closest official video: L1–L18 plus one Q-learning tutorial, 19 videos in total. The home page's "Previous Offerings" section links this playlist next to Spring 2025.

Most lecture titles and their order match across the two years, so every post in this series lists its video as "Spring 2025 recording (supplement)". A few lectures do not line up:

| 2026 lecture | 2025 video | Difference |
|---|---|---|
| L1–L9, L11–L13, L15, L18 | Same number | Same title; the slides were revised for 2026, so details may differ |
| L10 RL for LLMs: Reasoning (guest: Noam Brown) | [2025 L10 RL for LLM Reasoning](https://www.youtube.com/watch?v=O2VpNnwB4lM) (the archive lists Aviral Kumar as speaker) | **Different speaker**; use the video as background only |
| L16 RL for Robots: Sim-to-Real Transfer (guest: Guanya Shi) | 2025 L16 was Autonomous Learning; sim-to-real was 2025 L17, which the archive lists as Ashish Kumar (the [video](https://www.youtube.com/watch?v=Hp1WBWghrak) is titled "Advancing Robot Intelligence") | Different speaker and a different split |
| L17 RL for Robots: RL for VLAs | None | New in 2026, no public recording |
| None (slot 14 is the midterm) | [2025 L14 Exploration](https://www.youtube.com/watch?v=4tlSKdi8teU) | Dropped in 2026; the Meta-RL post mentions it as optional viewing |

The homework changed too. 2025 had four assignments, and [2025 HW4](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf) had two parts: goal-conditioned DQN with hindsight experience replay, and black-box meta-RL versus DREAM. 2026 cut this to three. This series lists 2025 HW4 only as an "extra exercise (2025 archive)" in the multi-task and Meta-RL posts.

## The series arc

The official lecture order already follows a sensible learning order, so this series keeps it and inserts each homework post right after the lectures it depends on:

```text
Representing behavior (L1 MDPs, L2 imitation) ── HW1
   │
On-policy gradients (L3 PG → L4 Actor-Critic)
   │
Off-policy (L5 PPO/SAC → L6 Q-learning) ── HW2
   │
When you can't interact anymore (L7 Offline RL → L8 Where rewards come from) ── HW3
   │
Applying it to LLMs (L9 RLHF/DPO → L10 Reasoning) ── Default Project
   │
Learning the world and many tasks (L11 MBRL → L12 Multi-task/GCRL → L13 Meta-RL → L15 Hierarchy)
   │
Applying it to robots (L16 Sim-to-Real → L17 VLAs)
   │
L18 Frontiers and how to do research
```

The target reader knows ML/DL basics and PyTorch and wants to go from imitation learning all the way to RL for LLMs and robot foundation models, whether as an engineer or a grad student.

| Post | Topic | Official material |
|---|---|---|
| 1 | [L1: Framing decision-making as an RL problem](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en) | 01_intro_2026 |
| 2 | [L2: Imitation learning and policies that can represent multimodal distributions](/posts/ai/2026-09-30-cs224r-imitation-learning-en) | 02_imitation_2026 |
| 3 | [HW1: Imitation learning on Flappy Bird](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en) | HW1 |
| 4–7 | [Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en), [Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic-en), [Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en), [Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en) | L3–L6 |
| 8 | [HW2: Online RL](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en) | HW2 |
| 9–10 | [Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en), [Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning-en) | L7–L8 |
| 11 | [HW3: Offline RL](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql-en) | HW3 |
| 12–13 | [RLHF and preference optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en), [RL for LLM reasoning](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning-en) | L9–L10 |
| 14 | [Default Project: RL fine-tuning for LLMs](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en) | Default Project |
| 15–18 | [Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en), [Multi-task and GCRL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en), [Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en), [Hierarchical RL and IL](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il-en) | L11–L13, L15 |
| 19–20 | [Sim-to-Real](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en), [RL for VLAs](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en) | L16–L17 |
| 21 | [Frontiers and how to do research](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research-en) | L18 |

## What you can do tonight

1. Open the [course home page](https://cs224r.stanford.edu/) and read the schedule top to bottom, noting each lecture's optional reading.
2. If value functions and Q-functions are still unfamiliar, read chapter 3 of [Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf).
3. Download the [HW1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf) and [starter code](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip) and set up the environment with installation.md. HW1 does not need Modal; a laptop or Colab is enough to start.
4. Watch the [2025 L1 recording](https://www.youtube.com/watch?v=EvHRQhMX7_w) alongside the 2026 lecture 1 slides, then read [post 1 of this series](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en).

## Further reading

These series on the site overlap with CS224R. This series does not cut anything because of them; they are linked here only:

- [Reading Berkeley CS285 Spring 2026](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en): another graduate deep RL course with fuller derivations. Related posts: [imitation and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en), [policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en), [inference and offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en), [exploration and open problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en), [homework and project route](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en)
- CS336: [SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en) and [RLVR](/posts/ai/2026-08-22-cs336-rlvr-en), RL seen from the LLM training pipeline
- CME295: [preference tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en), [RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en), [LLM reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning-en)
- [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): where the A0–A3 tiers are defined

**Series navigation**: Next: [L1: Framing decision-making as an RL problem](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224R home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 1 slides: Course Intro + Start of MDPs & Imitation (2026)](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)
- [CS224R Spring 2025 archive](https://cs224r.stanford.edu/spring_2025/)
- [CS224R Spring 2025 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [HW1 PDF (2026)](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [HW2 PDF (2026)](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)
- [HW3 PDF (2026)](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)
- [CS224R Compute Guide (Modal)](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Default Project Guidelines (2026)](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)
- [Custom Project Guidelines (2026)](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [2025 HW4: Goal-Conditioned RL & Meta-RL](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf)
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.)](http://incompleteideas.net/book/RLbook2020.pdf)
- [CS221 Autumn 2022 modules](https://stanford-cs221.github.io/autumn2022/modules/)
