---
title: "CS224R L11: Model-Based RL, or Learn a Simulator and Don't Trust It Too Much"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, stanford, ai-course, course-guide, world-model, planning]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 15
tldr: "Model-based RL first learns a dynamics model that predicts s_{t+1}, then uses it in one of two ways: to generate extra training data (Dyna, MBPO) or to think a few steps ahead before acting (planning). The thread running through Lecture 11 of CS224R is how to avoid being dragged down by model error. Start synthetic rollouts from real states and keep them short, average errors out with an ensemble of models, and attach a value function to the tail of long-horizon plans. Whether a model is worth learning depends on whether it is easier or harder to learn than the policy."
description: "A guide to Lecture 11 of Stanford CS224R (Spring 2026), based on the official 11_cs224r_mbrl_2026 slides: the notional learned-simulator algorithm, three sources of dynamics models, data generation with Dyna and MBPO, distribution shift and short rollouts, model ensembles, sampling-based planning and receding horizons, long-horizon planning with a value function, the Nagabandi 2019 and AlphaGo examples, and when to use model-based RL. The companion video is the Spring 2025 L11 recording (supplementary)."
draft: false
glossary:
  - term: "dynamics model"
    definition: "A model p_θ(s' | s, a) that predicts which state you land in after taking action a in state s. Any RL algorithm that learns one counts as model-based RL."
    context: "The CS224R L11 slides note it goes by many names: dynamics model, simulator, world model, or just model."
  - term: "MBPO"
    definition: "Model-Based Policy Optimization (Janner et al. 2019): start short synthetic rollouts from real states in the replay buffer using an ensemble of dynamics models, and train a model-free actor-critic on the synthetic and real data together."
    context: "The assigned reading for CS224R L11; the slides call it \"Model-based RL: V2\"."
  - term: "receding horizon planning"
    definition: "Plan a whole action sequence at every step, execute only the first action, and replan from the next state."
    context: "Mentioned in the first note on sampling-based planning in CS224R L11."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-model-based-rl)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 15 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [the Default Project on RL fine-tuning for LLMs](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en) and covers Lecture 11, "Model-Based RL," on May 6, 2026.

Official sources used:

- The 35-page slide deck [11_cs224r_mbrl_2026.pdf](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf)
- The assigned reading on the schedule: [When to Trust Your Model: Model-Based Policy Optimization (Janner et al. 2019)](https://arxiv.org/abs/1906.08253)

Access level is **A3**: the slides download anonymously, and the 2026 recordings live only on Canvas.

Companion video (**supplementary**): [Spring 2025 Lecture 11: Model-Based RL](https://www.youtube.com/watch?v=PvqyGnOirgA) (about 73 minutes). The two years split the material differently. [The 2025 L11 slides](https://cs224r.stanford.edu/spring_2025/slides/11_cs224r_mbrl_2025.pdf) cover planning first, then data generation, and end with a dexterous-manipulation case study. [The 2025 L12 slides](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf) open by continuing with synthetic data generation and when to use model-based RL. So the MBPO part of the 2025 recordings may fall at the start of L12. This post follows the 2026 slides.

## The setting: ten lectures, and nobody learned the environment

Page 4 draws a map of every algorithm so far. On the offline side sit behavior cloning and the offline RL methods AWR, AWAC and IQL. On the online side sit DAgger, off-policy methods such as DQN and SAC, and on-policy methods such as PPO. Every method on this map learns a policy, a value function or both. **None of them learns how the environment responds.**

Page 6 asks whether we can learn a "simulator": a model that predicts s_{t+1} from s_t and a_t. The slide's examples span many fields:

- Robotics and physical systems: model the physics directly, or predict video conditioned on actions (the slide shows frames from Veo 2 and Sora)
- Finance: a stock market predictor
- Games: the rules of the game. You may need to model other players, which sometimes counts as dynamics and sometimes gets modeled separately (multi-agent RL). For a game like chess, whose rules are known, **you may not need to learn a model at all**.

The lecture has a single learning goal: **how to best leverage learned dynamics models**.

## Intuition: learn a simulator, then practice inside it

Page 7 writes out a notional algorithm:

1. Collect data D = {(s_t, a_t, s_{t+1})} with some policy
2. Learn the simulator by maximum likelihood, minimizing −Σ log p_θ(s_{t+1} | s_t, a_t)
3. Run your favorite RL algorithm inside the simulator, or a planning method

The slide then asks what might go wrong. Page 8 pins a warning next to each step:

- Step 1: **data coverage matters a lot**
- Step 2: modeling is domain dependent, and some domains are much easier to simulate than others
- Step 3: **even with a good simulator, this part isn't necessarily easy**, because you need to account for model inaccuracies

Most of the rest of the lecture answers the warning on step 3.

## Mechanism 1: where the dynamics model comes from (briefly)

Page 10 splits this into three cases:

- **You know it already**, as in some games
- **You approximately know it**, as with certain physical models; fit the unknown parameters with data
- **You don't know it**, which is almost every practical case. Learn it end-to-end, or learn a low-dimensional state representation first and then learn a model over it

The slide adds an easily forgotten note: **you often need to learn a reward model too**.

## Mechanism 2: use the model to generate data (Dyna → MBPO)

### Dyna: real data plus synthetic data

Page 12's key idea is to augment the data with model-simulated rollouts. The slide labels this algorithm **Dyna**:

1. Collect data with the current policy π_φ and add it to D_env
2. Update the model p_θ(s' | s, a) using D_env
3. Collect synthetic rollouts with π_φ inside the model and add them to D_model
4. Update the policy (and critic Q) using D_model ∪ D_env

The slide points out that step 4 works with a variety of model-free methods.

### How it fails: change the policy and the data goes stale

Page 13 uses a hill-climbing example. After a policy update, the new policy's state distribution p_{π_φ'}(s) differs from the old one, p_{π_φ}(s). The model is only accurate near the old data, and the new policy heads straight for places the model hasn't seen (in the slide's example, going right lets you climb higher).

The slide notes you can use the old tricks: collect data from the new policy in later iterations, or constrain the policy so it doesn't change too much. **But model-based RL gives you other options.**

### Where to start simulating, and for how long

Pages 14–15 take one real trajectory, s1 → s6, and ask how to generate synthetic data from it:

| Approach | Problem |
|---|---|
| Generate full trajectories from initial states | The model may be inaccurate over long horizons |
| Generate partial trajectories from initial states | May not cover later states well |
| **Generate partial trajectories from every state in the data** | The model doesn't need to be accurate over long horizons |

The third row is the answer the slide marks with a light bulb. Page 16 then asks how long the partial trajectories should be, and answers with a figure from the MBPO paper.

Page 17 condenses this into two ideas:

1. Use **short** model rollouts that start from real states in the replay buffer
2. Use **an ensemble of models** so the errors average out

### MBPO: the slides' "V2"

Page 18 folds both ideas back into the algorithm, which is the assigned MBPO paper:

1. Collect data with π_φ and add it to D_env
2. Update each model p_θ^i on a minibatch sampled from D_env
3. Collect **partial** rollouts with π_φ in model p_θ^i, starting from states in D_env, and add them to D_model
4. Update the policy and critic using D_model ∪ D_env

The slide ends with a question: how does this compare with PPO and SAC? The PDF gives no answer.

**Try this**: take the off-policy actor-critic you wrote for [HW2](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en) and imagine turning it into MBPO. List the three components you would have to add: a training loop for the model ensemble, a function that samples start states from the replay buffer and runs short rollouts, and a second buffer, D_model. Writing the list alone shows where the extra engineering of model-based RL lives.

## Mechanism 3: use the model to plan at test time

### Think before you act

Page 20 spells out how we have been acting so far: observe s, sample an action from π(·|s), observe the next state, and so on. What if the situation is complicated or new? The slide's rough sketch:

1. Consider some candidate actions
2. Imagine the outcome of each
3. Pick the action with the best outcome

Page 21 annotates the sketch with two sets of design questions. Which actions should you consider, how many candidates, and how long should the action sequences be? And **how do you measure whether an outcome is good**?

### Planning V1: sample, imagine, pick the best

Page 22 turns the sketch into an algorithm. With the agent at s_t:

1. Sample N action sequences a^i_{t:t+H} of length H
2. Roll each sequence out in the model p_θ to get imagined states
3. Execute the sequence with the highest total reward

The slide stresses that **there is no separate policy network: this process is the policy**.

Page 23 adds two notes:

- You can execute only the first action and replan at s_{t+1}. This is **receding horizon planning**
- You can iterate, sampling better and better action sequences

Page 24 covers the limits. With a short H, planning is myopic. It can work well on short-horizon problems, but long horizons need an accurate long-horizon model and substantial inference compute.

### Planning V2: attach a value function to the tail

Pages 25–26 change the objective to the reward summed over H steps plus V̂(s_{t+H+1}). The trade-offs:

- Extra complexity from learning a value function
- You only need V, not Q
- It applies to long-horizon problems

Page 27 assembles the full RL algorithm: collect data with the current planner and model, update the model, **optionally** update V̂ with Monte Carlo or TD learning, and **optionally** update a policy if the planner uses it to sample candidate actions.

<details>
<summary>The two examples on pages 28–29</summary>

**Nagabandi et al. 2019** ([Deep Dynamics Models for Learning Dexterous Manipulation](https://arxiv.org/abs/1909.11652)):

- Model: an ensemble of three neural networks
- Planning: short horizon with a shaped reward and no value function; actions found by iterative sampling-based optimization (the cross-entropy method)
- Algorithm: alternate between collecting 30 trajectories with the planner and updating the model

**AlphaGo**:

- Model: the known rules of the game plus the opponent's move; the opponent is itself or a pool of its past versions
- Planning: a horizon of 1 to 40 moves plus a terminal value function; a policy network narrows the action space; heuristics balance exploration and exploitation
- Algorithm: the value function is trained with Monte Carlo regression, and the policy is trained to match the actions the planner selects. The slide lists 3 weeks of training for AlphaGo and 40 days for AlphaGo Zero

</details>

## Tying it together: when to use model-based RL

Page 31 summarizes: any method that learns p_θ(s_{t+1} | s_t, a_t) is model-based RL. There are two ways to use the model:

| Use | How to keep model error down |
|---|---|
| Simulate extra data | Start from every state seen in the data; use short rollouts |
| Planning (lookahead) | Pair it with a value function for long-horizon planning |
| Both | An ensemble of models helps average out errors |

Page 33 lays out the pros and cons:

- **Upsides**: if the model is easy to learn, it is far more data efficient; the model can be trained on data without reward labels, fully self-supervised; the model is somewhat task-agnostic and can sometimes transfer across rewards
- **Downsides**: models don't optimize for task performance; they are sometimes harder to learn than a policy; they add another thing to train, more hyperparameters and more compute

The slide's one-line verdict: **whether to use a model depends on how hard it is to learn.**

Page 34 adds that p(s_{t+1} | s_t, a_t) is only one kind of model. Others include the inverse model p(a_t | s_t, s_{t+1}), multi-step inverse models, action-free future prediction p(s_{t+1:t+n} | s_t), video interpolation and the joint transition distribution p(s_t, a_t, s_{t+1}), each with its own uses. The slide doesn't go further.

**Try this**: the next time you read a paper that advertises a "world model," ask two questions. Does it use the model to generate data or to plan? How does it keep model error from compounding over long rollouts? The answers mostly tell you which cell of this lecture the paper belongs in.

The next lecture moves from learning the environment to learning many tasks at once: how to share weights and data across tasks. See [L12 Multi-Task and Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en).

## Further reading

- [Berkeley CS285 Spring 2026: inference and offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en), whose L15–16 section covers what a dynamics model lets you do
- [CMU 07-280 Stage 3: RL and AlphaZero](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero-en), for the game-search view of this lecture's AlphaGo example
- [CS224R L6: Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en), the kind of off-policy method MBPO plugs into step 4

## What this post can and cannot confirm

Confirmed: the text, algorithm steps and captions of the 2026 slides, the schedule date and assigned reading, how the 2025 slides split the lectures, and the title and length of the 2025 L11 video. Not confirmed: the detailed conclusion of the MBPO figure on page 16 (the slide shows only the figure), the in-class answer to "how does this compare to PPO and SAC" on page 18, and anything said aloud in the 2026 lecture.

Series navigation: previous [Default Project: RL fine-tuning for LLMs](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en) | next [L12 Multi-Task and Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 11 slides: Model-Based Reinforcement Learning (2026)](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf)
- [Spring 2025 Lecture 11: Model-Based RL (YouTube, supplementary)](https://www.youtube.com/watch?v=PvqyGnOirgA)
- [Spring 2025 Lecture 11 slides (archived)](https://cs224r.stanford.edu/spring_2025/slides/11_cs224r_mbrl_2025.pdf)
- [Spring 2025 Lecture 12 slides (archived; opens by continuing MBRL)](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)
- [Janner, Fu, Zhang, Levine. When to Trust Your Model: Model-Based Policy Optimization (arXiv 1906.08253, NeurIPS 2019)](https://arxiv.org/abs/1906.08253)
- [Nagabandi, Konolige, Levine, Kumar. Deep Dynamics Models for Learning Dexterous Manipulation (arXiv 1909.11652)](https://arxiv.org/abs/1909.11652)
