---
title: "CS224R L12: Multi-Task and Goal-Conditioned RL, Sharing Weights and Sharing Data"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, stanford, ai-course, course-guide, multi-task-learning]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 16
tldr: "Multi-task RL treats which task you are on as part of the state, s = (s̄, z_i), so the problem is still an ordinary MDP and standard RL algorithms still apply. Lecture 12 of CS224R covers two kinds of sharing: weight sharing, where one network conditioned on z_i does every task, and data sharing via hindsight relabeling, where data collected for task A gets relabeled as data for task B. Goal-conditioned RL is the special case where the task is a goal state; relabeling with the state you actually reached eases the exploration problem of sparse rewards. Data sharing has three prerequisites: consistent dynamics across tasks, a reward you can evaluate, and an off-policy algorithm."
description: "A guide to Lecture 12 of Stanford CS224R (Spring 2026), based on the official 12_cs224r_mtrl_gcrl_2026 slides: why multi-task RL, how to formalize tasks, three forms of task identifier z_i, stratified sampling, task conditioning in BC-Z, OpenVLA and π0.5, reward design for goal-conditioned RL, and the hindsight relabeling (HER) algorithm and its prerequisites. The follow-up exercise is Part 1 of the archived Spring 2025 HW4; the companion video is the Spring 2025 L12 recording (supplementary)."
draft: false
glossary:
  - term: "hindsight relabeling"
    definition: "Take a trajectory collected for one task or goal, relabel it as data for another task (for example, the goal of the state actually reached), recompute the rewards, and store it in the replay buffer too."
    context: "The data-sharing technique in CS224R L12; the assigned reading is the HER paper by Andrychowicz et al."
  - term: "goal-conditioned RL"
    definition: "A special case of multi-task RL where the task identifier is a goal state s_g to reach, and the reward is usually defined by distance to the goal or by whether it was reached."
    context: "CS224R L12 uses it for the most direct application of hindsight relabeling."
  - term: "stratified sampling"
    definition: "Build each minibatch with data from every task, which lowers gradient variance."
    context: "A trick CS224R L12 borrows from multi-task supervised learning; the RL version keeps a replay buffer per task."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 16 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en) and covers Lecture 12, "Multi-Task and Goal-Conditioned RL," on May 8, 2026. HW3 was due at 9 pm the same day.

Official sources used:

- The 29-page slide deck [12_cs224r_mtrl_gcrl_2026.pdf](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf)
- The assigned reading on the schedule: [Hindsight Experience Replay (Andrychowicz et al.)](https://arxiv.org/abs/1707.01495)
- Follow-up exercise: Part 1 of [Spring 2025 HW4](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf) (**archived from 2025**; 2026 has no such assignment)

Access level is **A3**: the slides download anonymously, and the 2026 recordings live only on Canvas.

Companion video (**supplementary**): [Spring 2025 Lecture 12: Multi-Task RL](https://www.youtube.com/watch?v=qNdsI_4AQJw) (about 70 minutes). The first half of [the 2025 L12 slides](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf) is still wrapping up model-based RL (synthetic data generation and when to use model-based RL), so the start of the recording probably covers that too. This post follows the 2026 slides.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=qNdsI_4AQJw
title: Spring 2025 Lecture 12: Multi-Task RL (YouTube, supplementary)
```

Original videos: [Spring 2025 Lecture 12: Multi-Task RL (YouTube, supplementary)](https://www.youtube.com/watch?v=qNdsI_4AQJw)

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## Why learn many tasks at once

Page 6 asks whether we can train a **generalist** policy that does many "tasks" rather than one. The examples cut across fields: an LLM assistant that books travel and buys groceries, a legged robot that walks, runs and dances, a mobile manipulator that hangs up a towel and unloads a dishwasher, a music recommender personalized to many users, and a game agent that plays Flappy Bird and Pokemon. These tasks may differ in reward, dynamics and even action space.

Page 7 recaps the course so far (imitation, on-policy, off-policy and offline RL, model-free and model-based RL, reward functions) and asks: **what has been the biggest challenge? Data efficiency.** The multi-task idea is to amortize the data cost across many tasks, because much of what gets learned can be shared: grammar for an LLM assistant, balance for legged robots, similarity between users for recommenders.

The slide also gives a deeper motivation: **generalist ML systems are often more reliable and perform better than specialists.**

The learning goal: **how to share weights and data across tasks for learning efficiency.**

## Tasks are just different MDPs

### Formalizing a task

Page 8 writes a task as an MDP: T_i ≜ {S_i, A_i, p_i(s_1), p_i(s'|s, a), r_i(s, a)}, meaning state space, action space, initial state distribution, dynamics and reward. The slide notes this definition allows far more variety than the everyday meaning of "task."

Pages 9–10 practice spotting which parts vary, using four examples:

| Example | What varies |
|---|---|
| Character animation learning multiple maneuvers | r_i |
| Recommending videos to multiple users | dynamics and r_i |
| Getting dressed with different garments and initial states | initial state distribution and dynamics |
| Shirt folding across multiple robots | state space, action space, initial state distribution, dynamics |

### How to tell the policy which task it is on

Page 11 lists three kinds of task identifier z_i: a task index (task 0, task 1, …), a language description, or a video showing what to do.

Pages 12–13 offer another view: **make the task identifier part of the state**, s = (s̄, z_i). Then it is still a standard MDP, so why not apply standard RL algorithms? The slide's answer: **you can. In some cases you can do better.**

The reward in multi-task RL is the same as before. In goal-conditioned RL, z_i is the goal state s_g and the reward is r(s) = −d(s̄, s_g), where the distance d can be Euclidean or a sparse 0/1.

## Weight sharing: condition on z_i

### Start with multi-task imitation learning

Page 14 borrows a trick from multi-task supervised learning: **stratified sampling**. Put data from every task into each minibatch and the gradients have lower variance.

Pages 15–18 show how robot policies take in z_i in practice:

- [BC-Z (Jang et al., CoRL 2021)](https://arxiv.org/abs/2202.02005)
- [OpenVLA (Kim et al., CoRL 2024)](https://arxiv.org/abs/2406.09246): modern architectures pass z_i as a prompt into a (fine-tuned) LLM
- [π0.5 (Physical Intelligence, 2025)](https://arxiv.org/abs/2504.16054): the two-task example is "flatten the towel" versus "hang the towel," and the many-task example includes "put the plate in the drawer," "close the microwave" and "clean the spill"

Page 18 leaves a question open: what about high-level, long-horizon tasks like "clean the kitchen"? That waits for the lecture on hierarchy.

### The basics of multi-task RL

Page 19 is short:

- Policy: π_θ(a | s̄) becomes π_θ(a | s̄, z_i)
- Q-function: Q_φ(s̄, a) becomes Q_φ(s̄, a, z_i)
- Consider a replay buffer per task for stratified sampling

Then the slide asks the lecture's central question: **if you collect data while conditioning on z_1, can you reuse it to learn task 2?**

## Data sharing: hindsight relabeling

### The accidental good pass

Page 21 uses ice hockey. Task 1 is passing and task 2 is shooting goals. What if you try to shoot and accidentally make a good pass? Store the experience as normal, **and also** relabel it with the other task's ID and reward and store that copy. This is **hindsight relabeling**, also called hindsight experience replay (HER). The slide literally says "relabel experience with task 2 ID"; by the logic of the example, the accidental outcome is a pass, so the relabel target should be task 1 (passing). I read it by the logic and quote the original wording for comparison.

### The multi-task algorithm

Page 22:

1. Collect data D_k = {(s_{1:T}, a_{1:T}, z_i, r_{1:T})} with some policy
2. Store it in the replay buffer
3. Hindsight relabeling: relabel D_k for task T_j to get D'_k, with r'_t = r_j(s_t), and store it too
4. Update the policy using the replay buffer

Which task j should you relabel for? The slide offers two options: pick randomly, or pick tasks in which the trajectory gets high reward.

The same page asks: **in what scenarios can we apply relabeling?** The slide's answer is three conditions:

- The form of the reward function is known and can be evaluated
- Dynamics are consistent across goals or tasks
- You use an off-policy algorithm

<details>
<summary>Why it has to be off-policy (my note)</summary>

The slide lists the conditions without explaining them one by one. What follows is my inference from earlier lectures. Relabeled data was collected under the policy for task i, so for the task-j policy π(a | s̄, z_j) it is data from a different policy. On-policy methods like those in [L3 policy gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en) require data from the current policy. Off-policy methods like [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en) only need (s, a, r, s') transitions, so they can use this data directly. Consistent dynamics matter for the same reason: a transition (s, a, s') must still be one that can actually happen under task j.

</details>

### The goal-conditioned algorithm

Page 23 applies the same recipe to goal-conditioned RL:

1. Collect data D_k = {(s_{1:T}, a_{1:T}, s_g, r_{1:T})}
2. Store it in the buffer
3. Relabel **using the last state reached as the goal**: D'_k = {(s_{1:T}, a_{1:T}, s_T, r'_{1:T})}, with r'_t = −d(s_t, s_T), and store it too
4. Update the policy

Other relabeling strategies? The slide's answer: use **any future state** from the trajectory. The result: **exploration challenges are alleviated.** This part cites both Kaelbling's Learning to Achieve Goals (IJCAI 1993) and the HER paper.

**Try this**: draw a one-dimensional corridor of five cells on paper, with the goal at the right end. The reward is 0 on reaching the goal and −1 otherwise. Write down a trajectory that only makes it to cell 3, then label its rewards twice: once with the original goal and once with the last state as the goal. With the original labels every step is −1. After relabeling, at least one step is 0, and that is the moment the Q-function first gets a useful signal.

## Tying it together: what each kind of sharing needs

Pages 26–28 summarize:

- **Multi-task RL is single-task RL in a joint MDP** whose state is s = (s̄, z_i); each episode first samples a task
- **Goal-conditioned RL is a special case** with z_i = s_g, where every task means reaching some goal state. The reward is δ(s = s_g) for discrete states and δ(‖s − s_g‖ ≤ ε) for continuous states

Pros and cons of goal-conditioned RL:

- No need to define a reward (self-supervised)
- Many tasks can be framed as goal reaching
- Can be fairly hard to train

| | Weight sharing | Data sharing |
|---|---|---|
| How | Train one network to do all tasks, conditioned on z_i | Add data collected for one task to another task's buffer by relabeling the reward and task identifier |
| Requires | — | Same dynamics across tasks, evaluatable rewards, an off-policy algorithm |
| Goal-conditioned | — | Directly applicable |

The next lecture asks whether we can **adapt quickly** to a new task, in other words in-context learning for RL. See [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en).

## Follow-up exercise: Spring 2025 HW4 Part 1 (archived)

2026 had only three assignments, and none covers this lecture. **Part 1 of the 2025 HW4** matches the topic exactly. Its PDF and [starter code](https://cs224r.stanford.edu/spring_2025/material/hw4_starter_code.zip) still download anonymously, which makes it good practice for self-learners. Below are the requirements only, with no solutions.

Per the PDF, Part 1 has four steps:

1. Adapt an existing DQN to be goal-conditioned, with a Q-network that takes the concatenated state and goal
2. Run goal-conditioned DQN on two environments
3. Implement HER on top of it
4. Compare performance with and without HER

The two environments:

- **Bit flipping**: the state and goal are binary vectors of length n, and each step flips one bit. The reward is −1 when state and goal differ and 0 when they match, a sparse-reward example; the larger n is, the rarer non-negative rewards become
- **2D Sawyer reach**: move a robot arm's end effector to a goal XY position, with reward equal to negative Euclidean distance, a dense-reward example

The functions to implement live in `run_episode.py` and `trainer.py`. HER comes in three variants to implement: final, random and future (future may only pick goals from states after the current step). The analysis questions scale the bit count from 6 to 15 to 25 and compare runs with and without HER, then compare the three variants at 15 bits, and finally compare how much HER contributes in bit flipping versus Sawyer reach.

Things self-learners should watch for:

- The assignment requires AWS EC2. The PDF specifies a c4.4xlarge instance with a course-provided custom AMI and says other platforms are not supported. Readers outside the course have to set up an environment locally from the starter code's README
- The PDF prohibits using generative models to help write code for this assignment
- The autograder and Gradescope are not public, so you judge results from your own tensorboard curves

## Further reading

- [Berkeley CS285 Spring 2026: harder exploration and reuse across tasks](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- [CS224R L2 Imitation Learning](/posts/ai/2026-09-30-cs224r-imitation-learning-en), which this lecture's multi-task imitation builds on

## What this post can and cannot confirm

Confirmed: the text, algorithms and summary table of the 2026 slides, the schedule date and assigned reading, the contents and compute rules of the 2025 HW4 PDF, and the title and length of the 2025 L12 video. Not confirmed: the in-class discussion of the question on page 9, the video material on pages 15–18, and how the three relabeling prerequisites were explained aloud (the collapsible section above is my inference).

Series navigation: previous [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en) | next [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 12 slides: Multi-Task and Goal-Conditioned RL (2026)](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf)
- [Spring 2025 Lecture 12: Multi-Task RL (YouTube, supplementary)](https://www.youtube.com/watch?v=qNdsI_4AQJw)
- [Spring 2025 Lecture 12 slides (archived)](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)
- [CS224R Spring 2025 Homework 4 (archived)](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf)
- [CS224R Spring 2025 HW4 starter code (archived)](https://cs224r.stanford.edu/spring_2025/material/hw4_starter_code.zip)
- [Andrychowicz et al. Hindsight Experience Replay (arXiv 1707.01495)](https://arxiv.org/abs/1707.01495)
- [Jang et al. BC-Z: Zero-Shot Task Generalization with Robotic Imitation Learning (arXiv 2202.02005)](https://arxiv.org/abs/2202.02005)
- [Kim et al. OpenVLA: An Open-Source Vision-Language-Action Model (arXiv 2406.09246)](https://arxiv.org/abs/2406.09246)
- [Physical Intelligence. π0.5: a Vision-Language-Action Model with Open-World Generalization (arXiv 2504.16054)](https://arxiv.org/abs/2504.16054)
