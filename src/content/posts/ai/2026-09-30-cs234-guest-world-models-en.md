---
title: "CS234 Guest Lecture: Shane Gu's \"World of World Modeling\" — the World Model Is the Model in Model-Based RL"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, world-model, planning, guest-lecture]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 18
tldr: "The last guest deck in CS234 Winter 2026, by Shane Gu of Google DeepMind: 36 slides, no public recording. It has three threads. First, Solomonoff induction says the best predictor is the shortest program that generates the data, and prediction comes in three levels. Second, a forward model F and two inverse models, Π and Q, share one notation, which shows how shooting and direct collocation each plan with a different kind of model and why TDMs and Generalized Decision Transformers are world models at a different time scale. Third, the deck asks whether video models can become the foundation model for the physical world."
description: "A guide to guest speaker Shane Gu's \"World of World Modeling\" slides from Stanford CS234 (Winter 2026): Solomonoff induction, empowerment and three levels of prediction, forward and inverse models, shooting vs direct collocation, Temporal Difference Models, Generalized Decision Transformers, and physical vs symbolic world models. Slides only, no recording."
draft: false
glossary:
  - term: "shooting method"
    aliases: ["shooting"]
    definition: "A planning method that optimizes only over the action sequence. For each candidate sequence, a forward model rolls the states out step by step and the total reward is computed. States are not variables; they are consequences of the actions."
    context: "The first equation on p.20 of Shane Gu's slides."
  - term: "direct collocation"
    aliases: ["collocation"]
    definition: "A planning method that treats every future state (sometimes with the actions) as an optimization variable and uses the dynamics as a constraint that consecutive states must be reachable. You can relax the constraint to solve the task first, then restore the physics."
    context: "Shane Gu's slides, pp.20–22, 26, 28."
  - term: "Temporal Difference Model (TDM)"
    aliases: ["TDM", "temporal difference models"]
    definition: "A goal-conditioned Q-function from Pong et al. (ICLR 2018) with an extra input τ, the number of steps left. It estimates how far you will be from a goal state after τ steps, so it is both a value function and an implicit multi-step dynamics model."
    context: "Shane Gu's slides, pp.25–26."
    links:
      - label: "Pong et al., Temporal Difference Models (ICLR 2018)"
        url: "https://arxiv.org/abs/1802.09081"
  - term: "empowerment"
    definition: "The mutual information I(s; z) between an agent's actions z and future states s. The larger it is, the more your actions determine what the world becomes."
    context: "Shane Gu's slides use its variational lower bound on p.14 to frame three levels of prediction."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-guest-world-models)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Edition note**: This post is based on the guest slide deck [ShaneGuCS234_2026.pdf](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf) (36 pages) linked from the [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 modules page, checked page by page on 2026-09-30. Access level is **A3** (defined in the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)), with one clear gap for this lecture: **slides only, no recording**. The 2026 videos are on Canvas for enrolled students, and the public [Spring 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) does not include this talk. Many slides are images with almost no text, so this post covers only what is visible on the slides. How the speaker connected them out loud, and what he said in Q&A, is not available.

**Series position**: Previous: [Value Alignment: Aligned to Whom, and to What](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en) | This is the last post in the series | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Where this talk sits

The [modules page](https://web.stanford.edu/class/cs234/modules.html) gives this PDF its own row, "RL Guest Lecture", with the link text "Shane Gu: World of World Modeling" and no video link. The title slide is dated **February 25, 2026**. The speaker is Shane Gu, a Senior Staff Research Scientist at Google DeepMind.

One thing does not line up. On the [course homepage](https://web.stanford.edu/class/cs234/) schedule, February 25 falls in Week 8 (topics "Exploration" and "RL and MCTS"), while the week labeled "Guest Lecture" is Week 9 (March 2–8). The course does not explain the relationship. This post goes by the date on the title slide and does not invent an explanation for the schedule.

Why put it last? Most of the previous 17 posts sit on the model-free side: MC, TD, Q-learning, policy gradients, PPO, RLHF. A model only showed up in the [planning post](/posts/ai/2026-09-30-cs234-mdp-planning-en), where the transitions were given, and the [MCTS post](/posts/ai/2026-09-30-cs234-mcts-alphazero-en), where a simulator lets you roll forward. This talk goes back to a question the course never tackled head-on: **if you have to learn the model yourself, what should it look like, and how do you plan with it?**

## How the deck is organized

The outline on p.8 has three parts plus one topic that did not make it in:

| Pages | Part | What it covers |
|---|---|---|
| pp.3–7 | What is a world model | The definitional fight and landmark papers from 2015–2021 |
| pp.9–17 | What is prediction | Solomonoff induction, causality and OOD generalization, empowerment and three levels |
| pp.18–28 | Forward and inverse world models | Shooting vs collocation, TDMs, Generalized Decision Transformers |
| pp.29–35 | Physical and symbolic world models | Video models as reasoners, futures of world modeling |

The last outline line reads "(Forgot) Control as inference: e.g. particle smoothing as optimal control, MCTS vs beam search". No slides cover it. The speaker also notes on p.8 that he will not talk about Gemini, Veo, or Genie.

## 1. "World model" is a contested term (pp.3–7)

The deck opens with three views side by side:

- **Jürgen Schmidhuber**: p.3 lists his 1990 proposal of RNN-based world models for planning and his 2004–2005 use of world models for physical AI and self-healing robots, among other claims. (These are bullet points on the slide; this post did not verify them separately.)
- **Jitendra Malik**: p.4 quotes him saying control theorists already had a good term, "dynamics model", in use since 1960, and that "world models" has left people confused about which definition is meant.
- **Shane Gu**: p.5 has one line: "World model is the 'model' in model-based RL."

Then pp.6–7 trace the line through four papers: [Oh et al.'s action-conditional video prediction in Atari](https://arxiv.org/abs/1507.08750) (2015), [Finn et al.'s video prediction for robot physical interaction](https://arxiv.org/abs/1605.07157) (2016), DeepMind's [Imagination-Augmented Agents](https://arxiv.org/abs/1707.06203) (2017), and [Mastering Atari with Discrete World Models](https://arxiv.org/abs/2010.02193) (DreamerV2, 2021).

For a CS234 reader, the p.5 definition is the useful one. It ties world models back to something you already know. The P(s'|s,a) that policy iteration needs in [post 2](/posts/ai/2026-09-30-cs234-mdp-planning-en) is a model; back then it was simply given.

## 2. What does it mean to predict well? (pp.9–17)

### Solomonoff induction: the best model is the shortest program

p.10 draws the world as a program P that produces data. Running the program forward is "generation"; recovering the program from data is "induction". The example: from {1, 3, 5, 7, …} you infer D<sub>t+1</sub> = D<sub>t</sub> + 2.

p.11 writes two equations:

- Bayes' theorem over programs: p(P|D) ∝ p(D|P) p(P)
- Occam's razor as the prior: p(P) ∝ 2<sup>−|P|</sup>, so shorter programs get higher prior probability

The slide says this idea inspired Hernández-Orallo et al.'s C-Test (1998) and [Legg & Hutter's Universal Intelligence (2007)](https://arxiv.org/abs/0712.3329). p.12 quotes Ilya Sutskever: "The best prediction is inferring the shortest program that reproduces the data." From there the speaker argues that prediction equals understanding.

### Causality: understanding equals OOD generalization

p.13 cites [Invariant Risk Minimization (2019)](https://arxiv.org/abs/1907.02893): spurious, non-causal correlations in the data break a model out of distribution. The speaker's conclusion is that data drawn from many different interventions on the true causal graph lets a model generalize. He calls this "Diversity is all you need" and points to GPT-3, trained to predict everything.

### Empowerment and three levels of prediction

p.14 uses s for the future of the world and z for your actions, and shows a variational lower bound on empowerment from [Choi et al., Variational Empowerment as Representation Learning for Goal-Based RL](https://arxiv.org/abs/2106.01404), a paper the speaker co-authored:

I(s; z) ≥ E<sub>z∼p(z), s∼p(s|z)</sub>[log q<sub>φ</sub>(s|z) − log p(s)]

Then it splits "making your model predict well" into three levels:

| Level | What you do | Examples on the slides | Data distribution |
|---|---|---|---|
| Level 1 | Passively fit your model to the world | Pre-training, supervised and self-supervised learning, generative modeling | Stationary during training |
| Level 2 | Actively fit your model to the world | Post-training, DAgger, GAIL, active learning; ICM and similar novelty bonuses, VIME for the noisy-TV problem | Non-stationary during training |
| Level 3 | Actively fit the world to your model | Politicians, financial firms, X influencers | — |

p.17's verdict on Level 3: "Difficult objective. Nobody has cracked this yet at scale." The final slide, p.36, is titled "Remember the Level 3."

The table maps straight onto this series. DAgger at Level 2 appeared in the [imitation learning post](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en), and its whole point is that the data distribution shifts with your policy. The three [bandits and exploration](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) posts are also about actively collecting data that reduces uncertainty.

## 3. Forward and inverse models (pp.18–28)

This is the part of the deck closest to CS234.

### Three models, one notation

p.19 assumes a deterministic environment and writes:

- **Forward model**: s<sub>t+1</sub> = F(s<sub>t</sub>, a<sub>t</sub>)
- **Inverse model 1**: a<sub>t</sub> = Π(s<sub>t</sub>, s<sub>t+1</sub>), which tells you what action gets you from here to the next state
- **Inverse model 2**: 0 = Q(s<sub>t</sub>, a<sub>t</sub>, s<sub>t+1</sub>), a test of whether a transition is consistent

They must agree: for all s and a, a = Π(s, F(s, a)) and 0 = Q(s, a, F(s, a)). p.24 explains the symbols. Π is **a policy conditioned on s<sub>t+1</sub>**, and Q is **a Q-function conditioned on s<sub>t+1</sub>**. So the policies and Q-functions from earlier in the course become inverse world models once you feed the target state in as an input.

### Shooting vs direct collocation

p.20 writes both planning methods as optimization problems:

- **Shooting**: maximize Σ r(s<sub>i</sub>) over actions a<sub>t:t+T</sub> only, with states rolled out by s<sub>i+1</sub> = F(s<sub>i</sub>, a<sub>i</sub>). This uses the forward model.
- **Direct collocation**: maximize Σ r(s<sub>i</sub>) directly over states s<sub>t:t+T</sub>, subject to −|A| ≤ Π(s<sub>i</sub>, s<sub>i+1</sub>) ≤ |A| (the action needed between consecutive states must be legal). Or solve over states and actions together, subject to Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+1</sub>) = 0. This uses an inverse model.

pp.21–22 use Mordatch et al.'s Contact Invariant Optimization (SIGGRAPH 2012) to show why collocation helps. During planning you can relax, or in the speaker's word "hack", the dynamics constraints: **"First solve task, then fix physics."** That lets contact-rich tasks work with minimal reward shaping, because relaxing the dynamics provides the right shaping by itself. The speaker's analogy: shooting is like autoregressive video diffusion, collocation like bidirectional video diffusion.

p.23 gives the flip side: [Ghasemipour et al.'s block assembly work (2022)](https://arxiv.org/abs/2203.13733) shows that dexterity with shooting is hard.

If you just read the [MCTS post](/posts/ai/2026-09-30-cs234-mcts-alphazero-en), you can think of MCTS as sitting on the shooting side. It takes a simulator that rolls forward and expands action sequences from the current state. (That comparison is ours, not the slides'.)

### TDMs: value functions are world models at a different time scale

p.25 introduces [Temporal Difference Models (Pong et al., ICLR 2018)](https://arxiv.org/abs/1802.09081). The reward is given only when the steps-left counter τ hits 0, and it equals the negative distance from the next state to a goal s<sub>g</sub>:

r<sub>d</sub>(s<sub>t</sub>, a<sub>t</sub>, s<sub>t+1</sub>, s<sub>g</sub>, τ) = −D(s<sub>t+1</sub>, s<sub>g</sub>) · 1[τ = 0]

The Q recursion takes −D(s<sub>t+1</sub>, s<sub>g</sub>) when τ = 0 and max<sub>a</sub> Q(s<sub>t+1</sub>, a, s<sub>g</sub>, τ − 1) when τ ≠ 0. The slide makes three points. A goal-conditioned optimal policy or Q-function is an implicit, temporally extended world model. Training uses hindsight relabeling. And, in bold: **"Value functions are world models with different time scale and representation."**

p.26 connects TDMs back to collocation. Take one state every K steps as a decision variable and write the constraint as Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+K</sub>, K − 1) = 0. The result is hierarchical RL that does collocation with a goal-conditioned Q-function. It is a multi-step version of the second collocation equation on p.20.

<details>
<summary>Why can a TDM's Q serve as a constraint?</summary>

By p.25's definition, Q(s, a, s<sub>g</sub>, τ) estimates the negative distance to s<sub>g</sub> after taking a and then following the optimal policy for τ steps. If it equals 0, s<sub>g</sub> is reachable within τ+1 steps. So "Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+K</sub>, K−1) = 0" reads "starting from s<sub>i</sub>, you can reach s<sub>i+K</sub> in K steps", which is exactly the reachability condition collocation needs between decision points.
</details>

### Generalized Decision Transformers

p.27 presents the speaker's group's [Generalized Decision Transformer (Furuta, Matsuo & Gu, ICLR 2022)](https://arxiv.org/abs/2111.10364):

- Training: hindsight behavioral cloning with respect to "any future statistics"
- Test time: give it an unseen "future" and ask it to generalize

The slide's table puts many methods in one framework. They differ in the function I<sup>Φ</sup>(τ) used to summarize the future, such as the final state, a discounted return, or a return histogram. Decision Transformer uses the sum of rewards.

p.28 is explicitly marked "untested": search for a "reachable future" using the GDT policy, which is the first collocation equation on p.20 (with Π as the constraint). The slide also shows a 2022 post by the speaker that puts three ideas side by side: a world model is a **causal** predictor, a Decision Transformer is an **anti-causal** predictor, and [Hindsight Experience Replay](https://arxiv.org/abs/1707.01495) is the trick that flips the direction of causality.

## 4. Physical and symbolic world models (pp.29–35)

The last part reads more like the speaker's research outlook, with little technical detail:

- **p.30, "2022: AGI Year 0"**: "LLMs can reason" means symbolic AGI is reachable through LLMs; ImagenVideo and DreamFusion mean physical AGI is reachable through video models.
- **p.31, "2025: Video model as the missing foundation model"**: the world consists of symbols, space, and time. LLMs reason with symbols; video models reason in space and time. The contrast is Chain-of-Frames vs Chain-of-Thoughts.
- **p.32**: a 2022 post by the speaker about [Mind's Eye](https://arxiv.org/abs/2210.05359), where a language model writes code, runs it in MuJoCo, and answers a physics question using the simulation result.
- **p.33**: [Sanchez-Gonzalez et al. (2020)](https://arxiv.org/abs/2002.09405) cast particle simulation as message passing on graphs. The speaker expects that graph nets, NeRF, and similar special structures will likely not be needed; video models will do.
- **pp.34–35, "2026+"**: modeling humanity (the slide says "Simile: model 8B people") and modeling financial markets (with a flowchart from the [AIA Forecaster technical report](https://arxiv.org/abs/2511.07678)). The right half of p.34 is an image that failed to load in the PDF.

Most claims in this part are the speaker's judgment, with no experimental data on the slides behind them. Read it as one researcher's view of where things are going, not as settled results.

## How to study it

1. **Start with pp.19, 20, and 24.** Copy the F, Π, and Q equations onto one sheet, and next to them write "Π = policy conditioned on the next state" and "Q = Q-function conditioned on the next state". The technical core of the deck revolves around these three lines.
2. **Map what you already learned onto them.** Policy iteration uses a known F. MCTS does shooting with a simulated F. The Q(s, a) that DQN learns has no target-state input. Ask yourself: once s<sub>t+1</sub> or s<sub>g</sub> is added as an input, what can it do?
3. **Read the section of the TDM paper that defines TDMs** (the p.25 equations come from there), then return to the collocation equation on p.26.
4. Treat pp.9–17 and pp.29–35 as perspective. No derivations needed.

One thing to do tonight: write out the shooting and collocation equations from p.20 on paper. For each, circle the optimization variables and mark whether the model appears in the objective or in the constraints. Once that is done, it should be clear why only collocation can "first solve task, then fix physics."

## Further reading

- How another Stanford course covers model-based RL in full (learn a simulator, plan with it, and don't trust it too much): [CS224R L11: Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en)
- Goal-conditioned RL and hindsight relabeling in depth: [CS224R L12: Multi-Task and Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en)
- World models and robot learning from the computer vision side: [CS231N wrap-up: World Modeling / Robot Learning](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project-en)
- A full deep RL course route: [Berkeley CS285 Spring 2026 guide](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Shane Gu, World of World Modeling (CS234 Winter 2026 guest slides, PDF, 36 pages)](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf) — the only primary source for this post
- [CS234 modules page](https://web.stanford.edu/class/cs234/modules.html) — the "RL Guest Lecture" row, with a slide link and no recording
- [CS234 course homepage (Winter 2026)](https://web.stanford.edu/class/cs234/) — the schedule (Weeks 8 and 9) and the note that videos are for enrolled students
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — public recordings; this talk is not included
- [Pong et al., Temporal Difference Models: Model-Free Deep RL for Model-Based Control (ICLR 2018)](https://arxiv.org/abs/1802.09081) — pp.25–26
- [Furuta, Matsuo & Gu, Generalized Decision Transformer for Offline Hindsight Information Matching (ICLR 2022)](https://arxiv.org/abs/2111.10364) — pp.27–28
- [Choi et al., Variational Empowerment as Representation Learning for Goal-Based Reinforcement Learning](https://arxiv.org/abs/2106.01404) — the empowerment bound on p.14
- [Legg & Hutter, Universal Intelligence: A Definition of Machine Intelligence](https://arxiv.org/abs/0712.3329) — p.11
- [Arjovsky et al., Invariant Risk Minimization](https://arxiv.org/abs/1907.02893) — p.13
- [Oh et al., Action-Conditional Video Prediction using Deep Networks in Atari Games](https://arxiv.org/abs/1507.08750), [Finn et al., Unsupervised Learning for Physical Interaction through Video Prediction](https://arxiv.org/abs/1605.07157), [Weber et al., Imagination-Augmented Agents](https://arxiv.org/abs/1707.06203), [Hafner et al., Mastering Atari with Discrete World Models](https://arxiv.org/abs/2010.02193) — the four landmark papers on pp.6–7
- [Ghasemipour et al., Blocks Assemble! Learning to Assemble with Large-Scale Structured Reinforcement Learning](https://arxiv.org/abs/2203.13733) — p.23
- [Andrychowicz et al., Hindsight Experience Replay](https://arxiv.org/abs/1707.01495) — the trick mentioned in the p.28 post
- [Liu et al., Mind's Eye: Grounded Language Model Reasoning through Simulation](https://arxiv.org/abs/2210.05359) — p.32
- [Sanchez-Gonzalez et al., Learning to Simulate Complex Physics with Graph Networks](https://arxiv.org/abs/2002.09405) — p.33
- [AIA Forecaster: Technical Report](https://arxiv.org/abs/2511.07678) — p.35
