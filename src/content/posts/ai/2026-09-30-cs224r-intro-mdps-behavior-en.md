---
title: "CS224R L1: Framing Decision-Making as an RL Problem"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, mdp]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 1
tldr: "The first lecture of CS224R Spring 2026 does three things: covers logistics, explains why deep RL is worth learning, and turns 'behavior' into something you can learn. The core is a set of definitions (state, action, trajectory, reward, policy) and one objective: maximize expected total reward. It ends on an example: fit ℓ2 regression to drivers where some change lanes and some go straight, and the policy learns their average, a half lane change nobody demonstrated. That problem is where L2 starts."
description: "Guide to lecture 1 of Stanford CS224R (Spring 2026), based on the official 01_cs224r_intro_2026 slides: the course goal, how deep RL differs from supervised learning, MDP and POMDP definitions, policies and the expected-reward objective, the trade-offs behind five families of RL algorithms, and why imitation learning version 0 learns the mean. Companion video: Spring 2025 L1 (supplement)."
draft: false
glossary:
  - term: "MDP"
    aliases: ["Markov decision process"]
    definition: "A mathematical framework for sequential decisions: states, actions, a reward function, an initial state distribution, and transition probabilities that depend only on the current state and action."
    context: "CS224R L1 defines it through state, action, reward and dynamics; when observations are incomplete it becomes a POMDP."
  - term: "policy"
    aliases: ["π"]
    definition: "The rule that picks actions from states or observations, usually written as a conditional distribution π(a | s). It is what RL learns."
    context: "CS224R parameterizes the policy with a neural network, πθ(a | s)."
  - term: "Markov property"
    definition: "The next state depends only on the current state and action, not on earlier history."
    context: "Observations usually lack this property, which is why the policy needs memory."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Source year**: based on the Spring 2026 [01_cs224r_intro_2026 slides](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf) (2026-04-01). The companion video is the [Spring 2025 L1 recording (supplement)](https://www.youtube.com/watch?v=EvHRQhMX7_w). The title matches, but the slides were revised for 2026, so details may differ. This is post 1 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

On the [CS224R](https://cs224r.stanford.edu/) schedule, lecture 1 is called "Course Intro + Start of MDPs & Imitation". The slides list three learning goals: how to represent behavior, how to formulate a reinforcement learning problem, and the basics of imitation learning.

The logistics (grading, late days, the AI tools policy) are covered in the [series overview](/posts/ai/2026-09-30-cs224r-course-overview-en). This post covers only the content.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=EvHRQhMX7_w
title: Spring 2025 Lecture 1: Class Intro (YouTube, supplement)
```

Original videos: [Spring 2025 Lecture 1: Class Intro (YouTube, supplement)](https://www.youtube.com/watch?v=EvHRQhMX7_w)

Content check: verified against the video transcript (2026-10-10): sampled the beginning, middle and end of the Spring 2025 L1 Class Intro transcript and searched keywords (not a word-by-word comparison). The video is the lecture it is labeled as, the speaker is Chelsea Finn, and the topic matches this post. The transcript runs through course goals and logistics, why study deep RL, MDPs and POMDPs, and imitation learning as a first way to model behavior, matching the post's structure. This post follows the 2026 slides; the video is supplementary only.

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

The Spring 2026 lecture recordings sit behind Stanford sign-in on Canvas/Panopto; the public YouTube playlist is Spring 2025. Checked: 2026-10-10.

## First, what an MDP is

The official prerequisites assume some familiarity with RL, and the slides say MDPs will get a quick pass. If you have never seen one, this intuition is enough to start:

> An agent sees the **state** of the world, picks an **action**, the world moves to a new state as a result, and the agent gets a **reward**. Then it repeats.

An MDP writes that loop down as math. Its key assumption is that the next step depends only on the present. Given the current state and action, you know the distribution over the next state, with no need for anything earlier.

For fuller background, the course recommends two entry points: chapters 3–4 of [Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf), or the MDP and RL modules from CS221. On this site, [CS221 L7: MDPs I](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en) and [L8: MDPs II](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en) cover exactly this.

## What deep RL means

The slides define it in two halves. The problems are **sequential decision-making problems**: a system makes many decisions based on a stream of information, observing, acting, observing again, acting again. The solutions include imitation learning, offline and online RL, RL for LLMs, model-free and model-based RL, multi-task and meta RL, and RL for robots. "Deep" means the emphasis is on methods that scale to deep neural networks.

One comparison table on the slides shows how it differs from supervised learning:

| | Supervised learning | Reinforcement learning |
|---|---|---|
| What you learn | Given labeled data {(xᵢ, yᵢ)}, learn f(x) ≈ y | Learn behavior π(a \| s) |
| Feedback | Told directly what to output | From experience, indirect |
| Data distribution | Inputs x are i.i.d. | Not i.i.d.: actions affect future observations |

The last row is the one the course keeps returning to. In RL, the model's outputs change the data it sees next. Compounding errors in L2 and offline RL in L7 both grow out of this.

The slides' examples of behavior are motor control, chatbots, game playing, driving and web agents.

## Why study it

The slides give four reasons:

1. **Going beyond (x, y) supervision.** Model predictions have consequences. When direct supervision is not available, RL can learn from any objective, including ones that are not differentiable and not just accuracy. Systems that interact with people (chatbots, recommenders) and systems whose deployment changes future observations (the slides call these feedback loops) fall here.
2. **It is widely deployed.** The examples are legged robots, robot manipulation, "Move 37" in AlphaGo's match against Lee Sedol, traffic control, making image generation models follow prompts, and Google's RL for TPU chip design. The slides add that nearly all modern language models use some form of RL in post-training, especially for advanced reasoning.
3. **Learning from experience looks fundamental to intelligence.** The example is robot research by Levine, Finn and colleagues from 2015–2016: robots getting better with practice, first "with its eyes closed", then with vision.
4. **There are plenty of open research problems.**

The slide for the fourth point is the most useful, because it maps each research question to a later lecture:

| Research question | Lecture |
|---|---|
| How does a robot learn what is good or bad for the task? | Reward learning (L8) |
| How do you use large, diverse datasets? | Offline RL (L7) |
| How do you transfer from other tasks and goals? | Multi-task RL, meta-RL (L12–L13) |
| Can RL learn long-horizon tasks like cooking a meal? | Hierarchy, reasoning (L15, L10) |
| Can robots practice fully autonomously? | RL for robots (L16–L17) |

Between these sits a photo titled "Behind the scenes of RL": a robot practicing, with an arrow pointing to a person in the background, Yevgen. The caption reads "Yevgen is doing more work than the robot!" and adds that collecting lots of data this way is not practical. That photo is why later lectures cover offline RL and autonomous practice.

## Turning experience into data

This is the heart of the lecture. The slides start with four definitions:

- **state sₜ**: the state of the world at time t
- **action aₜ**: the decision taken at time t
- **trajectory τ**: the sequence of states and actions (s₁, a₁, …, s_T, a_T), which can have length 1
- **reward r(s, a)**: how good this s, a is

Add unknown dynamics p(sₜ₊₁ | sₜ, aₜ). The next state is a function of only the current state and action (plus randomness), independent of sₜ₋₁. That is the Markov property.

**What if you cannot see the full state?** The slides give two options: treat sensor readings as an approximation (camera images with good visibility are often close enough), or model partial observability explicitly with an observation oₜ. The cost is that observations are not Markov. Once you marginalize out the states, the next observation depends on all past observations: p(oₜ₊₁ | o₁:ₜ, a₁:ₜ) ≠ p(oₜ₊₁ | oₜ, aₜ).

Two examples on the slides make the definitions concrete:

| | Robot hanging a towel | Chatbot |
|---|---|---|
| State / observation | state: RGB images, joint positions and velocities | observation: the user's latest message |
| Action | commanded next joint position | the chatbot's next message |
| Trajectory | 10 seconds at 20 Hz, T = 200 | a conversation of variable length |
| Reward | 1 if the towel is on the hook, else 0 | 1 for an upvote, -10 for a downvote, 0 for no feedback |

The class then does a think-pair-share: define the state, action, trajectory and reward for autonomous driving, a web agent, or a poker player. It is worth actually doing, and the exercise at the end of this post builds on it.

## Representing behavior with a neural network

A **policy** πθ(a | s) is a neural network that takes a state and outputs a distribution over actions. At run time you observe sₜ, sample an action aₜ from πθ(· | sₜ), and the world produces sₜ₊₁ from its unknown dynamics. Repeat, and the resulting trajectory is also called a roll-out or an episode.

If you only have observations o, the slides suggest giving the policy memory: πθ(aₜ | oₜ₋ₘ, …, oₜ).

## The RL objective: expected total reward

The obvious objective is to maximize the sum of rewards Σₜ r(sₜ, aₜ). But that quantity is not deterministic. The slides ask where the variability comes from. Two places: the world is stochastic, and the same policy may not make the same decision every time.

So a trajectory is itself a distribution:

```text
pθ(τ) = p(s₁) · ∏ₜ πθ(aₜ | sₜ) · p(sₜ₊₁ | sₜ, aₜ)
```

and the RL objective is to maximize the **expected** total reward:

```text
max_θ  E_{τ ~ pθ(τ)} [ Σₜ r(sₜ, aₜ) ]
```

**Why stochastic policies?** The slides give two reasons. To learn from your own experience you have to try different things (exploration). And existing data already shows varied behavior. The second point sets something up: we can borrow tools from generative modeling and treat the policy as a generative model of actions given states. All of L2 is about that.

**How good is a policy?** Two functions:

- **value function V^π(s)**: expected future reward starting at s and following π
- **Q-function Q^π(s, a)**: expected future reward starting at s, taking a, then following π

## Five algorithm families, five sets of trade-offs

For the same objective, the slides list five kinds of solution. Together they are the table of contents for the first half of the course:

| Family | Idea | In this series |
|---|---|---|
| Imitation learning | Mimic a policy that gets high reward | [L2](/posts/ai/2026-09-30-cs224r-imitation-learning-en) |
| Policy gradients | Differentiate the objective directly | [L3](/posts/ai/2026-09-30-cs224r-policy-gradients-en) |
| Actor-critic | Estimate the current policy's value and use it to improve the policy | [L4](/posts/ai/2026-09-30-cs224r-actor-critic-en), [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) |
| Value-based | Estimate the optimal policy's value | [L6](/posts/ai/2026-09-30-cs224r-q-learning-en) |
| Model-based | Learn a dynamics model and use it for planning or policy improvement | [L11](/posts/ai/2026-09-30-cs224r-model-based-rl-en) |

Why so many? The slides' answer: each makes different trade-offs and works best under different assumptions. The questions to ask:

- How easy and cheap is it to collect data with the policy? (A simulator, or by hand?)
- Which supervision is cheaper: demonstrations or detailed rewards?
- How much do stability and ease of use matter?
- How high-dimensional is the action space? Continuous or discrete?
- Is the dynamics model easy to learn?

These five questions are a good lens for every later lecture.

## Imitation learning version 0: why it learns the mean

The last dozen slides start on imitation learning, which they describe as both a subroutine in some RL algorithms and a strong approach on its own.

The setup: given expert demonstrations (from some unknown π_expert), learn a πθ that performs as well as the expert. The example is a dataset of human drivers, sensor readings plus steering commands.

**Version 0** is the most direct: a deterministic policy, trained by supervised regression on the expert's actions to minimize ‖a − â‖², where â = πθ(s). Then deploy it.

The slides then ask what a policy trained with ℓ2 regression will do. The picture is a highway, and the demonstrations contain two steering commands: some drivers merge left (around -2) and others stay straight (around 0). Together that is two peaks, but ℓ2 regression learns **the mean of the data**, around -0.5. That value sits between the peaks: a half-merge nobody demonstrated. The slides say this happens "All the time!", especially when data is collected by multiple people.

So the question becomes how to represent more than the mean. The slides give two starting points:

- **Discrete actions**: the network outputs a probability for each action, a categorical distribution, which is maximally expressive
- **Continuous actions**: the network outputs μ and σ, a Gaussian, which is **not very expressive**

A Gaussian has one peak and cannot represent "left" and "straight" at once. How to represent multimodal continuous distributions with a neural network is the next lecture's topic.

## What you can do tonight

Pick a system you know well (a support bot, a recommender, an agent you wrote) and write four lines, following L1's think-pair-share:

```text
state or observation:
action:
trajectory length:
reward:
```

Then ask two questions. Is your observation Markov? If not, how much history does the policy need? And if you had a batch of human demonstrations where the same situation has two reasonable responses, what would ℓ2 regression learn?

## Further reading

- [Berkeley CS285 L1–4: imitation learning, distribution shift and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en): another telling of the same material
- [Reinforcement learning: MDPs, value iteration and continuous states (CS229 notes ch. 19)](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en): the full math of MDPs
- [Reading CS221](/posts/ai/2026-08-21-stanford-cs221-ai-principles-en): the RL prerequisite the course recommends

**Series navigation**: Previous: [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en) | Next: [L2: Imitation learning and policies that can represent multimodal distributions](/posts/ai/2026-09-30-cs224r-imitation-learning-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.
- 2026-10-10: Checked the video content against its transcript. The video is Spring 2025 L1 and the topic matches; nothing needed correcting.

## References

- [CS224R home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 1 slides: Course Intro + Start of MDPs & Imitation (2026)](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)
- [Spring 2025 Lecture 1: Class Intro (YouTube, supplement)](https://www.youtube.com/watch?v=EvHRQhMX7_w)
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.), chapters 3–4](http://incompleteideas.net/book/RLbook2020.pdf)
- [CS221 Autumn 2022 modules (MDPs, RL)](https://stanford-cs221.github.io/autumn2022/modules/)
