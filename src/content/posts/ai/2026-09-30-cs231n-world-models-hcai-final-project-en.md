---
title: "CS231N Wrap-Up: World Modeling / Robot Learning, Human-Centered AI and the Final Project"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, world-model, embodied-ai, human-centered-ai, research-project]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 20
tldr: "The last two lectures of CS231N Spring 2026 have no public slides. The schedule lists L17 only as \"World Modeling\" with guest lecturer Gordon Wetzstein, and L18 only as \"Human-Centered AI.\" Outside readers get 2025 substitutes: that year's L17 was a different topic, Robot Learning (Yunzhu Li, slides and video), and L18 is a Fei-Fei Li recording with no slides. This post labels each year separately and never presents 2025 content as 2026. The second half covers the final project: 35% of the grade, two tracks (Applications and Models), pixels required, and deliverables of a one-paragraph proposal, three milestone check-ins, a 6–8 page report and a poster."
description: "The closing post of the Stanford CS231N guide: 2026 L17 World Modeling and L18 Human-Centered AI survive only as schedule entries; the 2025 L17 Robot Learning slides and video (RL, model-based planning, imitation learning, robotic foundation models, world models); the three-part structure of Fei-Fei Li's 2025 L18 recording; and the Spring 2026 final project's two tracks, weights, three milestones, report rubric, generative AI policy, and the three patterns of successful projects from the section 3 slides."
draft: false
glossary:
  - term: "world model"
    definition: "A model that predicts how the environment will change after an action. The 2025 L17 slides define it as action-conditioned future prediction."
    context: "The 2025 L17 ends by moving from foundation policies to foundation world models; the 2026 L17 is titled World Modeling but has no public slides."
  - term: "Vision-Language-Action model"
    aliases: ["VLA"]
    definition: "A large model that takes images and a language instruction and outputs robot actions directly. The 2025 L17 slides also call these robotic foundation models or large behavior models."
    context: "The slides list RT-1, RT-2, OpenVLA, Pi-Zero and others."
  - term: "milestone check-in"
    definition: "A project checkpoint new in CS231N Spring 2026: a 10-minute discussion in TA office hours, with 2–5 slides submitted to Gradescope beforehand."
    context: "Three of them, 3% each, covering the problem and related work, the technical approach, and preliminary results."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Which year**: The years in this post are the messiest in the series, so here they are up front.
>
> - **2026 L17 "World Modeling" and L18 "Human-Centered AI"**: only entries on the [Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html), with no slide links. On 2026-09-30, both `slides/2026/lecture_17.pdf` and `lecture_18.pdf` returned 404. The 2026 recordings are on Canvas only.
> - **2025 L17 "Robot Learning"**: [slides](https://cs231n.stanford.edu/slides/2025/lecture_17.pdf) (103 pages) and a [recording](https://www.youtube.com/watch?v=XSfmOH_xVSU) (about 1h18m), lecturer Yunzhu Li. **A different topic from 2026.**
> - **2025 L18 "Human-Centered AI"**: a [recording](https://www.youtube.com/watch?v=g8UaBfj6Sh8) only (about 1h05m), lecturer Fei-Fei Li; the slide URL also returns 404. The L18 summary below comes from the video's English captions.
> - **Final project**: the Spring 2026 [project page](https://cs231n.stanford.edu/project.html) and [section 3 slides](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf).
>
> This is post 20, the last one, in the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series.

**Series**: previous [L15: 3D Vision](/posts/ai/2026-09-30-cs231n-3d-vision-en) | [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

The last two lectures stop teaching new algorithms. They push what came before outward: how vision models connect to action, and whom they should serve. Meanwhile, the heaviest thing on enrolled students' plates is the final project, worth 35% of the grade.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=XSfmOH_xVSU
title: CS231N Spring 2025 Lecture 17 recording
```

```youtube
url: https://www.youtube.com/watch?v=g8UaBfj6Sh8
title: CS231N Spring 2025 Lecture 18 recording: Human-Centered AI (Fei-Fei Li)
```

Original videos: [CS231N Spring 2025 Lecture 17 recording](https://www.youtube.com/watch?v=XSfmOH_xVSU)、[CS231N Spring 2025 Lecture 18 recording: Human-Centered AI (Fei-Fei Li)](https://www.youtube.com/watch?v=g8UaBfj6Sh8)

Course and recording entries:

- [CS231N Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## 2026 L17: World Modeling, one line on the schedule

For May 28, 2026, the schedule has two lines: "Lecture 17: World Modeling" and "Guest Lecturer: Prof. Gordon Wetzstein." No subtopics, no slides, no suggested readings. A3 is due the same day.

That is everything an outside reader can confirm. **This post doesn't guess what the lecture covered.** The 2025 Robot Learning lecture below is a different topic with a different speaker. Treat it only as a reference for how the course once ended at this point.

## 2025 L17: Robot Learning (Yunzhu Li)

In 2025 this slot went to guest lecturer Yunzhu Li from Columbia. The schedule lists Deep Reinforcement Learning, Model Learning and Robotic Manipulation. The slides have seven parts: problem formulation, robot perception, reinforcement learning, model learning and model-based planning, imitation learning, robotic foundation models, and remaining challenges.

### From supervised learning to agents that act

The opening places the whole course in one frame. So far you've seen supervised learning (x and y) and self-supervised learning (x only). Now an agent takes actions in an environment and receives rewards, and the goal is to learn actions that maximize reward. Examples run from cart-pole, robot locomotion, Atari and Go to text generation, chatbots, and a cloth-folding robot.

The slides then explain how robot vision differs from the computer vision in earlier lectures: it is **embodied, active and situated**. The robot has a body, so its actions feed back into its own sensing immediately. It knows why it wants to look and chooses what to perceive. The lecture's key challenge fits in one line: close the perception–action loop.

### Why RL differs from supervised learning

The slides give four reasons. Rewards and state transitions may be random. The reward may not depend directly on the current action (credit assignment). The world isn't differentiable, so you can't backprop through it. And what the agent sees depends on how it acts (nonstationarity). Case studies run from DQN on Atari and the AlphaGo line to quadruped locomotion and a robot hand solving a Rubik's Cube.

Model-free RL's problems are listed plainly: trial and error, lots of interaction, safety concerns, little interpretability. The response is **model learning and model-based planning**. Learn a dynamics model of the world, plan through it, execute the first action, observe the new state, and re-optimize. The key question is what form the state should take. The slides compare pixel, keypoint and particle dynamics, including RoboCook, which manipulates elasto-plastic objects with diverse tools using particle dynamics.

### Imitation learning and robotic foundation models

Imitation learning is supervised learning from demonstrations. The slides list behavior cloning, iterative collection of expert demonstrations, inverse RL, implicit behavior cloning, and diffusion policies.

Next come robotic foundation models: a policy that maps (observation, goal) straight to action, with no explicit states or transition functions, also called VLAs or large behavior models. The slides give a timeline from RT-1 (December 2022) through Pi-Zero, OpenVLA, Gemini Robotics, GR00T and others, and use Physical Intelligence's Pi-Zero to show pre-training and post-training on cross-embodiment data.

### Pointing toward world models

Two points from the challenges section are worth keeping. First, evaluation: it happens mostly in the real world, which is costly and noisy, and training loss correlates only weakly with real-world success; simulation has its own sim-to-real gap. Second, one slide titled "Foundation Policy → Foundation World Models," where the speaker defines a world model as **action-conditioned future prediction**, with examples like 1X World Models, DayDreamer and NVIDIA Cosmos.

The 2026 L17 happens to be titled World Modeling. That is a connection I see between the two schedules and the 2025 slides. **It doesn't mean the 2026 lecture covered this material.**

## L18: Human-Centered AI (2025 recording only)

The 2026 L18, on June 2, is just a title on the schedule. In 2025, Fei-Fei Li gave this lecture. There are no public slides, but the recording is complete. What follows is based on its captions.

She opens by saying this lecture teaches no new algorithms. It's a talk about long-term research evolution and the human perspective, titled "What we see and what we value: AI with the human perspective." It has three parts:

1. **Building AI to see what humans see.** From the origin of vision 540 million years ago and the 1960s summer vision project to three waves of object recognition: part-based models inspired by psychology, then statistical machine learning, then ImageNet, CNNs and GPUs converging in 2012. After that come relationships (scene graphs, Visual Genome), image captioning and dense captioning, and still-unsolved multi-actor activity understanding in video. Her conclusion: the field has always drawn on cognitive science and neuroscience, and it will keep doing so.
2. **Building AI to see what humans don't see.** On one side, superhuman ability, such as fine-grained recognition of bird species and car models, and using Street View car models to study social patterns. On the other, human limits, such as limited attention leading to medical errors, with AI counting gauze during surgery (she stresses this is a demo, not a deployed system). Then bias: human vision is biased, so is data, and AI can amplify both. And privacy: some things shouldn't be seen, illustrated by a hardware–software approach that recognizes actions while protecting privacy.
3. **Building AI to see what humans want to see.** Starting from labor anxiety, she argues for augmenting rather than replacing people. Her examples are ambient intelligence in health: depth-only sensors that monitor hand hygiene, track ICU patient mobility, and help seniors age in place. Finally, robots: using LLMs and VLMs to plan actions from open-ended instructions, and the BEHAVIOR benchmark, which first asked about 1,400 people which household tasks they want robots to do and then built simulation environments around them. She says they tested three BEHAVIOR tasks with current robot algorithms, and without privileged information, performance was zero.

Her closing message: AI should be a tool that augments people, not one that replaces them.

## The final project: 35% of the grade

The [project page](https://cs231n.stanford.edu/project.html) frames the project as applying what you learned to a problem you care about. **The one hard rule is that it must involve pixels in some form.** A pure NLP project doesn't qualify even if it uses ConvNets; related areas that vision conferences accept, like shape analysis, are allowed.

### Two tracks

| Track | Official description |
|---|---|
| Applications | Bring your background (biology, engineering, physics) and apply the course's vision models to a real problem in your domain |
| Models | Build a new model or a variant of an existing one for vision tasks; harder, and sometimes publishable |

Teams have up to 3 people, and solo work is allowed. The page says 3-person teams should deliver a more impressive write-up and results. It also warns that the baseline requirements for a complete paper have historically been hard for individuals without prior experience.

### Deliverables and weights

| Deliverable | Weight | Due (2026) | Late days |
|---|---|---|---|
| Project Proposal | 1% | Apr 23 | Yes |
| Milestone 1: Problem + Related Work | 3% | May 15 | Yes |
| Milestone 2: Technical Approach | 3% | May 22 | Yes |
| Milestone 3: Preliminary Results | 3% | May 29 | Yes |
| Final Report | 20% | Jun 5 | No |
| Poster session (in person) + poster PDF and code | 5% | Poster Jun 10; PDF and code Jun 9 | No |

Some details:

- **The proposal** is one paragraph of 200–400 words: the problem, the reading, the data, the method, and how you'll evaluate.
- **The three milestone check-ins are new in 2026.** Each is a 10-minute discussion in TA office hours. You submit 2–5 slides first, present for about 5 minutes, and take questions for the rest; all members attend. Each 3% splits into Progress, Clarity and Robustness at 1% each. Milestone 1 requires discussing at least 3 related papers.
- **The final report** is 6–8 pages in the CVPR template. The rubric weights Introduction 10%, Related Work 10%, Data 10%, Methods 30%, Experiments 30%, Conclusion 5%, and Writing/Formatting 5%.
- **The report must cite any base code you used**, including CS231N assignment code. A project shared with another class has to state which part counts for CS231N, and you can't submit the same PDF to both.

### Generative AI policy

Using generative AI to produce project code follows the same rules as using public sources, and all use must be documented explicitly: plans, prompts, transcripts, and a marker on every AI-generated artifact. **Using generative AI to write the final report violates the Honor Code.** It may be used only for editing and formatting.

### Section 3 slides: what counts as a good project

The [section 3 slides](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf) (13 pages) add criteria the project page doesn't spell out. You don't need strict novelty or a state-of-the-art result. You do need real effort, and you should interpret results from several angles, not just plot a loss curve.

They describe weaker projects in two ways: spending weeks collecting and cleaning data without testing any hypothesis, or cloning a repo and stitching it together with no real contribution.

They sort recent successful projects into three patterns:

1. **Domain adaptation**: apply a strong vision model or VLM to a meaningful new problem, with real task-specific data and evaluation. Examples include medical imaging, remote sensing, scientific imaging and sign language.
2. **Method improvement**: start from a recognized baseline and make a technically meaningful change, such as a new loss, module or training method.
3. **Reproduction**: rebuild a proprietary or hard-to-reproduce capability, where the implementation itself is the contribution.

The slides also advise on reading papers. Don't read linearly on the first pass: read the abstract word for word, then skim the figures and captions. If it's still relevant, read methods and results. Read the whole paper only when the detail genuinely helps.

### How a self-learner can borrow this

Grading, TA check-ins and the poster session belong to enrolled students. But the structure works for self-study: [past reports](https://cs231n.stanford.edu/2025/reports.html) are public, and the proposal questions and report rubric are on the page.

1. Pick a direction using one of the three section 3 patterns, and write a 200–400 word proposal that answers each of the five official questions.
2. Set yourself three checkpoints, with 2–5 slides each, following the Milestone 1–3 requirements.
3. Write the report against the rubric's seven sections. Methods and Experiments are 60% of it, so budget your time the same way.

One thing to do tonight: open the [Spring 2025 report list](https://cs231n.stanford.edu/2025/reports.html), pick three reports, and decide which section 3 pattern each one fits.

## End of the series

That completes this series: the public L1–L16 slides of CS231N Spring 2026, all three assignments, and L17 and L18, which survive only as schedule entries and 2025 recordings. The [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en) has the full self-study plan and where each post fits.

## Further reading

- A full course on reinforcement learning and robot learning: [Reading Berkeley CS285](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)
- General deep learning and another take on course projects: [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [CS231N Spring 2025 Lecture 17 slides: Robot Learning (Yunzhu Li)](https://cs231n.stanford.edu/slides/2025/lecture_17.pdf)
- [CS231N Spring 2025 Lecture 17 recording](https://www.youtube.com/watch?v=XSfmOH_xVSU)
- [CS231N Spring 2025 Lecture 18 recording: Human-Centered AI (Fei-Fei Li)](https://www.youtube.com/watch?v=g8UaBfj6Sh8)
- [CS231N Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231N Spring 2026 final project page](https://cs231n.stanford.edu/project.html)
- [CS231N Spring 2026 Section 3: Final Project Overview slides](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf)
- [CS231N Spring 2025 final project reports](https://cs231n.stanford.edu/2025/reports.html)
- [CS231N course home page (grading, late policy, recording policy)](https://cs231n.stanford.edu/)
