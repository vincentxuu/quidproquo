---
title: "CS224R HW2: Gridworld Q-learning, PPO, and the Sawyer Hammer Task"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, ppo, q-learning, stanford, ai-course, course-guide]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 8
tldr: "CS224R Spring 2026 HW2 has three parts. First, tabular Q-learning on a 5×4 gridworld shows how reward design changes the learned path. Second, GAE plus PPO clipping tackles a hammer task that pays 1 only on completion. Third, an off-policy actor-critic with BC pretraining, a critic ensemble, and a higher UTD ratio, followed by a comparison of the two learning curves. The handout, starter code, and compute guide are public, but the assignment supports only Modal, and course credits go only to enrolled students."
description: "A guide to Stanford CS224R Spring 2026 Homework 2: Problem 1's gridworld and three reward scenarios, Problem 2's PPO (GAE, clipped surrogate, reverse-KL reference policy), Problem 3's off-policy actor-critic (BC pretraining, critic ensemble, target critics, UTD experiment) and the PPO comparison question, plus the Modal and MuJoCo constraints self-learners face. No solutions."
draft: false
glossary:
  - term: "UTD ratio"
    aliases: ["update-to-data ratio", "UTD"]
    definition: "How many critic gradient updates you take per environment step. Higher UTD reuses each transition more, at a higher compute cost per step."
    context: "CS224R HW2 Problem 3 compares learning speed at UTD=1 and UTD=5."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 8 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It comes after [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) and [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en), and walks through the second assignment, "Online Reinforcement Learning."

The assignment went out on April 10, 2026 (the day of L4) and was due on Gradescope on April 24 at 9 pm Pacific. It is worth 15% of the grade. Official sources used:

- The handout [CS224R_2026_Homework_2.pdf](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf) and its [LaTeX template](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.tex)
- The starter code [hw2_starter_code.zip](https://cs224r.stanford.edu/material/hw2/hw2_starter_code.zip) (it unzips to a folder named "hw2 4/"; the name is cosmetic)
- The compute guide [CS224R_compute_guide.pdf](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)

Access level: **A3**. The handout, template, starter code, and compute guide all download anonymously. Solutions, the autograder, Gradescope, and Ed are not public. **This post explains what each problem asks you to do and gives no solutions**, including which goal each Problem 1 scenario reaches.

## The task: a hammer that pays only at the end

The star is a 4-degree-of-freedom Sawyer arm with a continuous action space. It observes environment states, not images. It has to pick up a hammer and drive a nail. The starter code's README says the environment is Meta-World's `hammer-v2`.

The handout stresses that the reward is **sparse**: 1.0 for fully completing the task and nothing in between. Its stated reason is that dense rewards are hard to design for real-world problems.

How the three problems split up:

| Problem | Environment | Algorithm | File you edit |
|---|---|---|---|
| Problem 1 | 5×4 gridworld | Tabular Q-learning | `gridworld_q_learning.py` |
| Problem 2 | Sawyer hammer | PPO (on-policy) | `on_policy.py` |
| Problem 3 | Sawyer hammer | Off-policy actor-critic | `off_policy.py` |

The README says these three files are the only ones with `### YOUR CODE HERE ###` blocks. The handout also tells you not to modify other files in Problems 2 and 3.

## Problem 1: how reward shapes the learned path

### The environment

The grid is 5×4, for 20 states. The agent always starts at (0, 0). There are two goals:

- **Goal 2** at (4, 0), 4 steps away
- **Goal 1** at (4, 3), 7 steps away

Four actions: left, right, up, down. Moving into a wall leaves the agent in place, and it still receives that step's reward.

Each step pays r_step, plus R1 or R2 when the agent enters a goal. The three scenarios:

| Scenario | r_step | R1 (far Goal 1) | R2 (near Goal 2) |
|---|---|---|---|
| 1 | −1 | 10 | 5 |
| 2 | −2 | 10 | 5 |
| 3 | +1 | 1 | 1 |

The handout initializes the Q-table to zero and updates it directly with the standard Q-learning rule. Note one typo: it says 20 states, then says the table holds "40 × 4 = 160" Q-values. For a 5×4 grid that should be 20 × 4 = 80.

### What you implement

1. `choose_action`: epsilon-greedy. With probability ε pick uniformly at random; otherwise pick the argmax of Q, breaking ties arbitrarily.
2. The inner loop of `train_q_learning`: choose an action, step to get (s', r, done), apply the Q-learning update, end the episode when done.

The starter code defaults to 5,000 episodes, learning rate α=0.2, discount γ=0.98, and ε decaying linearly from 0.4 to 0.02.

### What you report

Run `python gridworld_q_learning.py` for each scenario and report the learned trajectory and total reward: does it reach a goal, which one, and a one-sentence explanation of why it learned that path.

The point here is reward design, not code. How much each step costs, and whether a step costs or pays, changes whether the long road to the big prize beats the short road to the small one. It can even change whether ending the episode is worth it at all. Before coding, work out the total reward of both paths under each scenario on paper.

**Try this:** the file imports only `numpy` and the standard library, so it runs on a laptop with no Modal. Start here to ground the Bellman-optimality intuition from [L6](/posts/ai/2026-09-30-cs224r-q-learning-en).

## Problem 2: PPO on the hammer task

### The handout first clarifies "on-policy"

The handout includes a note. Strictly speaking, on-policy learning means each batch is used for exactly one gradient update and then discarded. This agent runs several epochs over the same batch, so it is not strictly on-policy. The handout still calls it on-policy because the data is always freshly collected under the current policy (or a recent snapshot). The contrast is Problem 3, where the data may come from an arbitrarily old policy and sits in a replay buffer.

This is exactly "one batch, many gradient steps" from [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en), and the "technically off-policy, often called on-policy" cell in L6's summary table.

### What the agent contains

The `PPOAgent` in `on_policy.py` has three parts:

- **Actor:** outputs a TruncatedNormal, a Gaussian clipped to [−1, 1] to match the environment's action bounds
- **Value function V_φ(s):** conditions only on states and feeds GAE
- **A frozen reference actor:** a snapshot of the policy after BC pretraining. PPO updates add a reverse-KL penalty against it so the policy does not drift far from its pretrained start

### What you implement

1. **`compute_gae`:** given a trajectory of length T, compute GAE advantages backward through time, plus the matching returns (the value targets). The handout writes out the recursion; watch how the episode-termination flag d_t enters it.
2. **Two blocks inside `update`:**
   - Before the epoch loop, get value estimates from the critic and call `compute_gae`, all inside `torch.no_grad()`, because the targets must stay fixed
   - Inside the minibatch loop, compute the new-to-old probability ratio ρ and write the PPO-Clip policy loss

The handout says to compute the ratio by subtracting log-probabilities and exponentiating. In high-dimensional action spaces individual probabilities can underflow, and the actor already outputs log-probabilities anyway.

### Training and the bar

Train with `modal run modal_on_policy.py` and attach a screenshot of `eval/episode success` from Wandb up to 1M steps. **You need at least a 25% success rate.**

The starter config `cfgs/on_policy_config.yaml` is worth comparing with the L5 slides:

| Setting | HW2 config | L5 slide 14 example |
|---|---|---|
| Rollout steps per batch | 4096 | ~2000 |
| Epochs per batch | 3 | ~10 |
| Minibatch | 64 | 64 |
| Clip ε | 0.1 | 0.2 |
| Total training steps | 1M | ~1M |

Other settings: GAE λ=0.99, γ=0.99, entropy coefficient 0.01, reverse-KL coefficient 0.01, 10,000 BC pretraining steps, learning rate 3e-4.

## Problem 3: off-policy actor-critic

### What the agent contains

The `ACAgent` in `off_policy.py`:

- **N critics Q_φi(s, a):** an ensemble that reduces error in the Q estimates
- **One target critic per critic:** updated more slowly, for stable Bellman targets
- **Actor π_θ**

Each observation stacks the environment states from the last two steps.

### What you implement

1. **BC pretraining (`bc`):** the handout provides 20 successful demonstrations (the starter `demos/` folder holds 20 `.npz` files). Train with the supervised loss −log π(a|s). BC updates are also interleaved during RL training for stability. The handout says this policy is "the same as the reference policy used in Problem 1"; from context it means Problem 2's reference actor.
2. **`update_critic`:**
   - Sample next actions from the policy
   - The Bellman target takes the **minimum of two randomly sampled target critics** to curb overestimation. It extends L6's Double Q and the handout's critic ensemble
   - Compute the squared error for all N critics, with a stop-gradient on the target
   - Take a gradient step, then update the target critics with an exponential moving average (the Polyak soft update from the TA handout)
3. **`update_actor`:** sample an action from the actor and maximize the mean Q across all critics, updating only the policy parameters.

The handout lists three common bugs: flat critic loss curves (the critics are not being updated), exploding critic losses (shape or broadcasting mismatches between predictions and targets), and updating only the two critics sampled for the target instead of all N.

### Training and the UTD experiment

1. **Base setting** (2 critics, UTD=1): `modal run modal_off_policy.py`. **Reach at least 90% success before 100K environment steps.**
2. **UTD experiment:** change the subprocess arguments in `modal_off_policy.py` to `agent.num_critics=10` and `utd=5`, then rerun. **Reach at least 90% success before 40K steps**, and explain the effect in one sentence. The handout warns this is much more compute-heavy: about 2 hours for 50,000 steps.

UTD (update-to-data ratio) is the number of critic gradient steps per environment step.

### The comparison question

The last question: compare Problem 2's PPO curve with Problem 3's curve (2 critics, UTD=1). In 3–5 sentences, give **at least two concrete differences** in sample efficiency and final performance, and tie each to a specific property of the algorithm.

Most of the raw material sits in L5 slide 30 and L6 slide 28. But the question asks what you see in your own curves, so you need your runs first.

## Submission and rules

- A PDF report: Problem 1 observations, training curves and answers for Problems 2 and 3
- A zip: the three `.py` files plus three CSVs downloaded from Wandb (`on_policy.csv`, `off_policy.num_critics=2,utd=1.csv`, `off_policy.num_critics=10,utd=5.csv`)
- **Using generative AI to write code for this assignment is prohibited**, so that you understand actor-critic implementation in depth
- You need a Wandb account to log training curves

## For self-learners: compute and environment

**Modal is the only supported platform.** The handout says to complete every part on Modal, and staff do not support setup anywhere else, including your own machine. You can write code locally and send runs to Modal to save credits. Add `--detach` to run long jobs in the background.

**Credits go only to enrolled students.** The compute guide says the teaching team emails students a code under the subject "Your CS224R Modal Compute Credits," with a Google Form for anyone who has not received one. Outside readers pay for Modal themselves or bring their own hardware.

Each Modal wrapper in the starter code requests its own GPU: A10 for `modal_on_policy.py` and `modal_gridworld_q_learning.py`, A100 for `modal_off_policy.py`.

**The local route is unsupported.** The handout includes `conda_env_local.yml` as a reference for Linux machines with an NVIDIA GPU, and says staff will not support it. That environment needs `mujoco_py==2.1.2.14` and Meta-World. `setup.sh` is a bootstrap script for an Ubuntu cloud machine that downloads MuJoCo 2.1.0 and installs Meta-World at a pinned commit.

The compute guide itself is public and credits the CS336 Spring 2026 Modal guide as its source. It covers authentication, defining images and apps, volumes, `.map` parallelism, GPUs, secrets, and finding logs. It is a useful primer if you have never used Modal.

**Try this:**

1. Tonight, do Problem 1. It needs only numpy and no cloud resources to show all three scenarios.
2. For Problems 2 and 3, read `PPOAgent` and `ACAgent` locally and fill in the `YOUR CODE HERE` blocks before deciding whether to pay for Modal. The starter code's `tests/test_on_policy.py` can check your Problem 2 code first.
3. On a budget, run Problem 3's base setting first. Its bar is 100K steps, an order of magnitude fewer than PPO's 1M (this post did not measure wall-clock time). The handout puts the UTD=5 run at about 2 hours for 50K steps, so run it last.

## What this post can and cannot confirm

Confirmed: the full handout text, the starter code's file list and configs, the compute guide, and the schedule's dates and grade weights. Not confirmed: official solutions and rubrics, actual success-rate curves (this post did not run the assignment), and the real Modal cost of the full assignment. Problem 1's "40 × 4 = 160" and Problem 3's "reference policy used in Problem 1" look like typos; this post reports them as written and flags them.

Related reading: the [Berkeley CS285 homework and project route](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) also includes PPO and off-policy assignments, if you want a second set of exercises.

Series navigation: previous [L6 Q-learning and How to Stabilize It](/posts/ai/2026-09-30-cs224r-q-learning-en) | next [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site, schedule, and grading policy)](https://cs224r.stanford.edu/)
- [Homework 2 handout PDF (2026)](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)
- [Homework 2 LaTeX template](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.tex)
- [Homework 2 starter code hw2_starter_code.zip](https://cs224r.stanford.edu/material/hw2/hw2_starter_code.zip)
- [CS224R Modal Compute Guide (Spring 2026)](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Lecture 5 slides: Off-Policy Actor Critic Methods](https://cs224r.stanford.edu/slides/05_cs224r_offpolicy_actor_critic_2026.pdf)
- [Lecture 6 slides: Q-Learning](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Schulman et al. 2016: Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Meta-World (Farama Foundation)](https://github.com/Farama-Foundation/Metaworld)
- [Modal](https://modal.com/)
- [Weights & Biases](https://wandb.ai/site)
