---
title: "CS224R HW3: AWAC, IQL, and Stitching on AntMaze"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, offline-rl, homework]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 11
tldr: "HW3 in CS224R (Spring 2026) has you fill in two offline RL algorithms, AWAC and IQL, and compare them on D4RL's AntMaze. Problem 1 runs AWAC on antmaze-umaze and antmaze-medium-diverse. Problem 2 compares IQL expectiles ζ = 0.2 and 0.9, runs the better value on medium-diverse, and then tests whether IQL can stitch a better path out of a PointMass dataset whose best return is only −46, against a filtered BC baseline that keeps the top 10% of trajectories. The PDF, LaTeX template, and starter code are public, but the assignment is meant to run on Modal, and course credits go only to enrolled students. This post covers the tasks and setup only, with no solutions."
description: "A guide to Stanford CS224R (Spring 2026) Homework 3, based on the official HW3 PDF and hw3_starter_code: AWAC and IQL losses, the TODO files, the AntMaze and PointMass environments, the three experiments, the autograder's CSV rules, and what self-learners need to know about Modal compute, wandb, and the old D4RL dependency stack. No solutions."
draft: false
glossary:
  - term: "AWAC"
    aliases: ["Advantage-Weighted Actor-Critic"]
    definition: "An offline RL algorithm that learns Q with TD and updates the policy by weighting the log-likelihood of dataset actions with exp(advantage / λ)."
    context: "CS224R HW3 Problem 1 has you implement it, with a clipped double-Q critic."
  - term: "IQL"
    aliases: ["Implicit Q-Learning"]
    definition: "An offline RL algorithm that fits V with expectile regression, fits Q with V as the TD target, and extracts a policy with advantage-weighted imitation. It never queries out-of-data actions during training."
    context: "CS224R HW3 Problem 2 has you implement it and tune the expectile ζ."
  - term: "D4RL"
    aliases: ["Datasets for Deep Data-Driven Reinforcement Learning"]
    definition: "A standard suite of offline RL datasets and environments, including AntMaze."
    context: "antmaze-umaze-v0 and antmaze-medium-diverse-v0 in CS224R HW3 both come from D4RL."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Source term**: Based on the Spring 2026 [HW3 PDF](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf), [LaTeX template](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.tex), and [hw3_starter_code.zip](https://cs224r.stanford.edu/material/hw3/hw3_starter_code.zip). The schedule shows HW3 released on 2026-04-24 and due 5/8 at 9 pm Pacific. This is post 11 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. **No solutions here**, and no hints about what numbers you should get.

The three [CS224R](https://cs224r.stanford.edu/) homeworks make up 40% of the grade, and HW3 is 15% of that. It pairs with [Lecture 7: Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en). Both the AWAC slide and the IQL slide say "You will implement it in homework 3!"

The PDF lists three objectives:

1. Implement AWAC and IQL, train them on AntMaze tasks, and compare them.
2. Experiment with key offline RL hyperparameters and analyze how they affect performance.
3. On a PointMass task with suboptimal data, check whether IQL's policy can compose trajectories better than any in the data.

One rule to know up front: the PDF **prohibits using generative models to write code for this assignment**.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## Environments and data

| | AntMaze | PointMass |
|---|---|---|
| Action space | continuous | discrete (gridworld) |
| Task | an ant robot navigates a maze to a goal | navigate a gridworld to a goal |
| Variants | antmaze-umaze (U-shaped, bottom-left to top-left); antmaze-medium (bottom-left to top-right, longer-horizon planning) | PointmassMedium-v0 |
| Data | D4RL's antmaze-umaze-v0 and antmaze-medium-diverse-v0, downloaded automatically at run time | pointmass_stitching_dataset.npz, shipped with the starter code |

Rewards are sparse in both: 0 for reaching the goal, −1 for every other step. So average return closer to 0 is better, and an episode that never reaches the goal ends near −episode_length.

[D4RL](https://arxiv.org/abs/2004.07219) is the standard offline RL dataset suite. The PointMass dataset was built for this homework to test stitching.

## Problem 1: AWAC (2 points)

### The losses

The actor uses an advantage-weighted negative log-likelihood:

```text
Lπ(ψ) = −E_{(s,a)~D} [ log πψ(a | s) · exp( A^{πk}(s, a) / λ ) ]
```

A^{πk} is computed with the current policy under a stop gradient, and λ is a temperature.

The critic uses a TD loss where the next action a′ is sampled from the current policy. To reduce overestimation, the PDF requires **clipped double Q**: keep two Q-networks with their own target networks, take the minimum of the two target Qs in the TD target, and regress both Qs onto it.

### TODOs to fill in

| File | TODO (from the starter code comments) |
|---|---|
| `cs224r/policies/MLP_policy.py` | compute exponential weights from the advantage and `lambda_awac` |
| `cs224r/critics/awac_critic.py` | compute the loss for updating both Q-networks |
| `cs224r/agents/awac_agent.py` | compute A(s, a) = Q(s, a) − V(s); sample a′ ~ π(·\|s′) from the current actor; update the actor |

### Experiments

1. Train AWAC on antmaze-umaze-v0. The PDF estimates about 1 hour.
2. Train on the harder antmaze-medium-diverse-v0, about 1.5 hours.

For both, report the mean and standard deviation of `Eval_AverageReturn` at the final checkpoint across 3 seeds. The PDF stresses that you take one scalar per seed and aggregate across seeds, not within a single run.

## Problem 2: IQL (5 points)

### The expectile

The PDF defines the expectile ζ as the value that minimizes the asymmetric squared loss |ζ − 1{μ ≤ 0}|·μ². For ζ > 0.5, samples below the estimate get less weight and samples above it get more.

IQL's two critic losses:

- **V loss**: the expectile loss applied to Q_target(s, a) − V(s)
- **Q loss**: plain squared error with target r + γ·V(s′)

The actor update works like AWAC's, with advantage weighting. The PDF also names what makes IQL different: the critic only ever updates on actions that appear in the dataset, never on sampled out-of-distribution actions.

> **Watch the sign when you compare with the slides.** The Lecture 7 slides write the expectile loss on V − Q and use a λ below 0.5. The HW3 PDF writes it on Q − V with ζ. The two parameters run in opposite directions, so don't copy numbers straight from the slides.

### TODOs to fill in

| File | TODO (from the starter code comments) |
|---|---|
| `cs224r/critics/iql_critic.py` | define the value function; implement the expectile loss; compute the V loss; compute the loss for both Q-networks |
| `cs224r/agents/iql_agent.py` | estimate the advantage; update the actor |

### Three experiments

**Part 1 (2 points): tune ζ.** Train on antmaze-umaze-v0 with ζ = 0.2 and ζ = 0.9 (about 1 hour each), report mean and standard deviation for both, and explain in 2–3 sentences which is better and why. The PDF's definition section already says which side of the distribution IQL wants to learn. Use that to predict the result, then let the experiment check you.

**Part 2 (2 points): a harder maze.** Train on antmaze-medium-diverse-v0 with the better ζ from Part 1 (about 1.5 hours). Then build a table of AWAC's and IQL's final average return on both mazes, and discuss in 3 sentences which algorithm does better on the longer-horizon, larger map, explaining why in terms of how each handles OOD actions and value estimation. That is the argument in the second half of the Lecture 7 slides, so compare against the pros and cons tables there.

**Part 3 (1 point): stitching.** The dataset `pointmass_stitching_dataset.npz` is deliberately suboptimal. The PDF gives a max return of −46 and an average of −104. Train two agents on it:

- IQL with the better ζ from Part 1, about 15 minutes
- Filtered BC using only the top 10% highest-return trajectories, about 10 minutes

Report mean and max return across 3 seeds for both, attach one trajectory visualization for each, and analyze: does IQL beat −46? How does it compare with filtered BC? Does it combine segments from different trajectories into a better path?

This is the hands-on version of Lecture 7's nine-state stitching diagram. Filtered BC is the method Lecture 7 called "very primitive" and a good baseline.

## Submission and the autograder

- Fill answers into the `answer{}` tags in the LaTeX template and submit the PDF.
- Zip a folder with your code and runs: `csv_data/` for the autograder CSVs and `cs224r/` with all .py files, keeping the original names and structure.
- The autograder covers both parts of Problem 1 and the first two parts of Problem 2. Export CSVs from the wandb plot named **exactly** `Eval_AverageReturn`, one file per seed, exactly 3 per part.
- For Problem 2 Part 1, submit CSVs only for the best-performing ζ.

The PDF spells out the directory layout in detail (paths like `P1/1/awac_umaze_seed1.csv`). Check yours against it before submitting.

## Notes for self-learners

**Compute.** The PDF says to run every section on Modal and doesn't support setup on your own machine or any other platform. You can write code locally and send training to Modal. The starter code's `modal_config.py` gives each container one T4 GPU and a 4-hour timeout, and `modal_train_para.py` launches 3 containers at once, one per seed. Course credits are redeemed through a link in the class email, so outside readers either pay for Modal themselves or port the code to run elsewhere.

Adding up the PDF's per-run time estimates, the whole assignment is 7 configurations × 3 seeds, roughly 19 T4 GPU-hours. That's my own sum of the PDF's estimates, not an official figure, and debugging reruns will push it higher. The PDF suggests debugging with a single seed via `modal_train.py` first.

**Old dependencies.** `requirements.txt` pins gym 0.23.1, torch 1.13.1, and mujoco-py 2.1.2.14, pins D4RL to a specific commit, and the conda environment uses Python 3.10.19. To run anywhere other than Modal, you'll need to reproduce that old stack yourself.

**wandb.** You need your own wandb account and login. If Modal can't find your API key, the PDF gives a `modal secret create` command to fix it. The autograder CSVs come from wandb too.

**What isn't public.** Solutions, the autograder, and Gradescope are all closed, so you have to judge on your own whether your numbers make sense. Useful reference points are the arguments in the Lecture 7 slides and the experiments in the IQL and AWAC papers.

**Where results go.** Training outputs (logs, checkpoints, evaluation videos) land in a Modal Volume named `cs224r-hw3-results`; download them with `modal volume get`. Part 3's trajectory plots are there too.

## Something to try tonight

If you're not ready to spend compute, do something free first. Open the expectile loss TODO in `iql_critic.py`, and following the PDF's definition, sketch the loss curves for ζ = 0.2 and ζ = 0.9 on paper (the PDF's Figure 3 is this plot). Then answer: for one state where the dataset actions have a spread of Q-values, where does each ζ put V? Once that's clear, you'll know where the Part 1 explanation is headed.

## Further reading

- [Berkeley CS285: Inference and Offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en): another course's treatment of offline RL
- [Berkeley CS285: Homework and Project Route](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en): compare how the two courses design their assignments

**Series navigation**: Previous: [Lecture 8: Where Rewards Come From](/posts/ai/2026-09-30-cs224r-reward-learning-en) | Next: [Lecture 9: RLHF and Preference Optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224R course homepage and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [CS224R Spring 2026 Homework 3 PDF](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)
- [Homework 3 LaTeX template](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.tex)
- [hw3_starter_code.zip](https://cs224r.stanford.edu/material/hw3/hw3_starter_code.zip)
- [CS224R Compute Guide (Modal)](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Lecture 7 slides: Offline Reinforcement Learning (2026)](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)
- [Nair, Gupta, Dalal, Levine. AWAC (arXiv 2006.09359)](https://arxiv.org/abs/2006.09359)
- [Kostrikov, Nair, Levine. Offline Reinforcement Learning with Implicit Q-Learning (arXiv 2110.06169)](https://arxiv.org/abs/2110.06169)
- [Fu et al. D4RL: Datasets for Deep Data-Driven Reinforcement Learning (arXiv 2004.07219)](https://arxiv.org/abs/2004.07219)
