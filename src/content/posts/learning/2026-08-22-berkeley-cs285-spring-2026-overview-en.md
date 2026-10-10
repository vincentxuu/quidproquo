---
title: "Berkeley CS285 Spring 2026 Guide: 25 Lectures, Five Assignments, and the Self-Study Boundary"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, deep-reinforcement-learning, self-study, ai-course]
lang: en
type: guide
difficulty: 深度
tldr: "Spring 2026 CS185/285 publishes slides for 25 lectures, nine discussion units, five assignments, and starter code; lecture recordings are public on the RAIL YouTube channel, but Ed, Gradescope, and office hours remain enrolled-only, while HW4 defaults to an H100, so this is not a zero-cost open course."
description: "A map of Berkeley CS185/285 Spring 2026: public materials, a six-part reading route, prerequisites, recording sources, and assignment compute costs."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 1
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

[Berkeley CS185/285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/) is Sergey Levine's deep reinforcement learning course. Its public page lists slides for 25 lectures, nine discussion units, five assignments, and two default final projects. The [starter-code repository](https://github.com/berkeleydeeprlcourse/homework_spring2026) is public too. That makes it an A3 material-based course, but not a fully open course.

On video, the Spring 2026 lecture recordings are public on the RAIL YouTube channel (a 27-video playlist). The official [syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/) and [course home page](https://rail.eecs.berkeley.edu/deeprlcourse/) have not caught up: they still say recordings are on bCourses and link the Fall 2023 playlist. The Fall 2023 recordings on the [resources page](https://rail.eecs.berkeley.edu/deeprlcourse/resources/) are historical substitutes, not recordings of the 2026 lectures. The 2026 slides, sections, and assignments stay canonical; match recordings by lecture number.

This series therefore treats the 2026 slides, sections, and assignments as canonical.

## Course video sources

This post is a course overview or resource map with no single corresponding lecture. Checked live on 2026-10-10: the instructor published the Spring 2026 lecture recordings on the RAIL YouTube channel (27 videos, public since 2026-08-15). The course syllabus still says recordings are on bCourses and the course site still links the Fall 2023 playlist. Pick recordings by lecture number from the playlist.

Course and recording entries:

- [Official course and recording entry](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

Checked: 2026-10-10.

## The six-part route

| Part | Official material | Guiding question |
| --- | --- | --- |
| 1 | Full map | What is public, missing, and prerequisite? |
| 2 | L1–4, Sections 1–2, HW1 | Why does imitation learning face distribution shift? |
| 3 | L5–10, Sections 3–5, HW2–3 | How do policy gradients, actor-critic, DQN, and SAC connect? |
| 4 | L11–18, Sections 6–9, HW4–5 | How do inference, LLM RL, model-based RL, and offline RL connect? |
| 5 | L19–25 | How do exploration, theory, multitask learning, and open problems reshape the map? |
| 6 | All homework and projects | What runs on CPU, and what needs a GPU budget? |

## The prerequisite is more than Python

The official prerequisite is [CS189 or equivalent machine-learning preparation](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/), plus familiarity with RL, numerical optimization, and ML. Before starting, write down how states, actions, transitions, rewards, policies, and value functions relate without consulting notes. If that fails, cover the MDP material first.

## Read the compute labels before committing

HW1 and HW2 are CPU-first. Most [HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) experiments can run locally, but the handout estimates roughly three GPU hours for each expensive MsPacman or HalfCheetah run. [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) defaults to a Modal H100 and requires four runs. An [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) run can take about six hours, before tuning across algorithms and tasks.

The course's compute support applies to enrolled students. A self-learner should run the smallest configuration locally, confirm the pipeline, and only then purchase cloud time.

## What this guide will not reconstruct

The recordings restore the instructor's spoken explanation, but an external learner still lacks Ed threads, Gradescope feedback, in-class interaction, and office hours, which live in bCourses and the enrolled-student systems. These articles explain the structure connecting public slides and assignments. They do not invent lecture remarks or relabel Fall 2023 video as Spring 2026.

A better completion criterion is an artifact: one derivation note, one implementation that succeeds on a small environment, a result table across seeds, and a failure analysis. That is closer to the course's actual work than merely “watching 25 lectures.”

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Fixed an outdated recording statement. Lecture recordings are public on the RAIL YouTube channel; what remains in bCourses is Ed, Gradescope, in-class interaction, and office hours. The tldr, description, and body were rewritten to match.
- 2026-10-10: Rechecked video status. Found the public Spring 2026 playlist on the RAIL channel and linked it; this post has no single lecture, so the status stays official entry only.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [CS185/285 resources and previous offerings](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
