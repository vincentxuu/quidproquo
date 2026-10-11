---
title: "CS234 Assignment 3: Reward Engineering, RLHF, DPO on Hopper, and Best Arm Identification"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, rlhf, dpo]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 12
tldr: "CS234 Winter 2026 Assignment 3 has five questions worth 94 points. The first three share MuJoCo Hopper: run PPO on a hand-written reward (13), learn a reward model from 10,000 preference pairs and run PPO on it (19 + 8), then learn a policy straight from preferences with SFT + DPO without ever touching the environment (6 + 19). Q4 switches to pure theory: use Hoeffding and a union bound to count how many pulls you need to find an ε-optimal arm (25). Save it until after the next post on bandits. Q5 is stated vs. revealed preferences in a news app (4)."
description: "A guide to Stanford CS234 (Winter 2026) Assignment 3: Q1 Hopper reward engineering and early termination, Q2 Bradley-Terry preference learning and run_rlhf.py, Q3 SFT/DPO and receding horizon control, Q4 sample bounds for best arm identification, Q5 stated vs. revealed preferences. Covers points, what is actually inside the Google Drive starter code and data, pinned packages, and submission format. No solutions."
draft: false
glossary:
  - term: "Bradley-Terry model"
    aliases: ["Bradley-Terry", "BT model"]
    definition: "A pairwise comparison model that writes the probability 'A beats B' as exp(r_A) / (exp(r_A) + exp(r_B)), which is the sigmoid of the score difference. RLHF uses it to turn preference labels into a reward model trainable with cross-entropy."
    context: "Assignment 3 Q2 uses the summed reward over a trajectory segment as the score."
  - term: "receding horizon control"
    aliases: ["RHC", "model predictive control", "MPC"]
    definition: "At each step, compute a multi-step action plan, execute only the first action, and replan at the next step. Unlike open-loop control, which executes a whole action sequence, it can react to disturbances and compounding errors."
    context: "Assignment 3 Q3 uses it to carry DPO, designed for bandits, over to multi-step Hopper control."
  - term: "best arm identification"
    aliases: ["pure exploration"]
    definition: "A bandit objective that ignores reward collected along the way and only asks you to identify, with high probability, the best (or an ε-optimal) arm after a limited number of pulls."
    context: "Assignment 3 Q4 asks how many total samples 'pull each arm n_e times and pick the highest mean' needs."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Winter 2026 assignments and slides of [CS234](https://web.stanford.edu/class/cs234/). The public recordings are the [Spring 2024 offering](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Every fact was checked on 2026-09-30 against the [assignments page](https://web.stanford.edu/class/cs234/assignments.html), the [A3 question PDF](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf) (8 pages), and the [Google Drive starter code](https://drive.google.com/file/d/18HwwLiMIN9XSdK7QXqQjGyhyb_86Iz_Y/view) linked from that page, which I downloaded, unzipped, and read file by file. Access grade **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the questions, LaTeX template, starter code, and preference data are all public. What you can't get is the Gradescope autograder and official solutions.

**Series**: previous [Learning from human preferences: Bradley-Terry, the RLHF pipeline, DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo-en) | next [Data efficiency I: bandits, regret, UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

The previous post covered L8: how Bradley-Terry turns "A is better than B" into a reward model, and how DPO skips the reward model and updates the policy directly from preferences. Assignment 3 pits the two routes against each other on one robot task: MuJoCo's Hopper, a one-legged robot that has to learn to hop forward.

The PDF's introduction is direct. RLHF was a key tool behind ChatGPT's performance, but the idea came earlier and is best known from [Christiano et al., "Deep reinforcement learning from human preferences"](https://arxiv.org/abs/1706.03741). The assignment has you do RLHF by hand on a robotics task, then compare it with DPO and with supervised learning (behavior cloning).

This post covers only the question structure, points, what the starter code looks like, and what to know before you start. **No solutions.**

> **An ordering issue first**: Q4, best arm identification, uses bandit concepts that the course only teaches in L9. In this series that is the next post, [order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en). Do Q1–Q3 and Q5 first, and come back to Q4 after reading it.

## Course video sources

Official course and existing recording entries are linked below. The Winter 2026 official Lecture Materials page lists slides only and no recordings; the public YouTube playlist is Spring 2024. No public lecture matching this article's scope was found, so nothing is embedded.

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

Checked: 2026-10-10.

## Schedule, submission, and points

Per the [2026 schedule](https://web.stanford.edu/class/cs234/), Assignment 3 was released in Week 5 (Feb 2–8, the midterm week) and was due **Feb 20 at 6 pm** in Week 7, with up to 2 late days. The PDF header says "Feb 20, 2025", which doesn't match the Winter 2026 schedule year and is probably a leftover header. Go by the assignments page.

There are two grading schemes: A3 is 7% for on-campus students and 15% for off-campus students (who have no tutorials).

You submit three things on Gradescope:

1. A PDF of the writeup
2. A LaTeX zip that unpacks directly to `main.tex` and `img/`, containing `hopper.png`, `hopper_rlhf.png`, and `hopper_dpo.png`
3. A code zip produced by the starter code's `collect_submission.sh`, which packs only `run_dpo.py` and `run_rlhf.py`

| Question | Topic | Points |
|---|---|---|
| Q1 | Reward engineering | 13 (writeup) |
| Q2 | Learning from preferences | 19 (writeup) + 8 (coding) |
| Q3 | Direct preference optimization | 6 (writeup) + 19 (coding) |
| Q4 | Best Arm Identification in Multi-armed Bandit | 25 (writeup) |
| Q5 | Stated vs. Revealed Preferences | 4 (writeup) |

The total is 94. Writing is worth 67 points and code only 27, but the code takes far longer to run, as the next section explains.

## Starter code and data: know what you have

The assignments page's "Starter code can be downloaded here" links to a public Google Drive file. It unzips to a `starter_code/` folder with files dated 2026-02-13, 15 entries in all:

| File | Purpose |
|---|---|
| `ppo_hopper.py` | Q1: trains [stable-baselines3](https://stable-baselines3.readthedocs.io/) PPO on `Hopper-v4`; `--early-termination` toggles ending episodes in unhealthy states |
| `run_rlhf.py` | Q2: the `RewardModel` class has four TODOs (network setup, `forward`, `compute_reward`, `update`); the rest of the pipeline is written |
| `run_dpo.py` | Q3: `ActionSequenceModel`, `SFT.update`, and `DPO.update` are TODOs |
| `data.py` | Loads preference data, with an option to keep only strict preferences (drop ties) |
| `render.py`, `plot.py`, `util.py` | Rendering, learning curves, shared helpers |
| `data/prefs-hopper.npz` | The main preference dataset, about 100 MB |
| `data/long-prefs-hopper.npz` | Long-segment preferences for you to watch |
| `data/pretrain.pt` | Pretrained SFT weights for Q3 |

I opened both preference files with numpy:

| File | Pairs | Steps per segment | Obs dim | Action dim |
|---|---|---|---|---|
| `prefs-hopper.npz` | 10,000 | 50 | 11 | 3 |
| `long-prefs-hopper.npz` | 10 | 200 | 11 | 3 |

Each record has `obs_1`, `obs_2`, `action_1`, `action_2`, and `label`. The PDF explains the labels: 0 means the first segment was preferred, 1 the second, and 0.5 neither.

The README sets up a Python 3.10.6 virtual environment with `uv`. `requirements.txt` pins three key versions: `gymnasium[mujoco]==0.29.1`, `stable-baselines3==2.3.0`, and `torch==2.6.0`. Don't upgrade them yourself; the `Hopper-v4` environment name is tied to the gymnasium version.

One gap: a Q3 footnote says the course prepared a notebook illustrating `torch.distributions.Independent`, but the Drive zip contains no `.ipynb` at all. Outside readers will need the [PyTorch docs](https://docs.pytorch.org/docs/stable/distributions.html#independent).

## Q1: PPO on a hand-written reward

This question asks one thing: in Assignment 2 you were simply handed a reward function. Who wrote it, and how? Writing a reward is called reward engineering, and it is hard.

**Written parts (a)–(c)**:

- (a) Why is reward engineering usually hard? What are the risks of a wrong reward? Give a reward that looks adequate but may have unintended consequences.
- (b) Read the [Hopper environment description](https://gymnasium.farama.org/environments/mujoco/hopper/) and explain, in your own words, the goal and how each reward term pushes the agent toward it.
- (c) By default the episode ends when the agent leaves the set of "healthy" states. What does healthy mean? Name one advantage and one disadvantage of this early termination.

(a) is [Assignment 1 Q2's reward hacking](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) in a new setting: from traffic merging to robots.

**Coding parts (d)–(f)**:

- (d) Run `ppo_hopper.py` with 3 seeds, with and without early termination, for 6 training runs. The PDF warns that each seed can take up to 90 minutes, so start early. Plot episodic returns for both, compare training epochs and wall time, and comment on whether the standard error of the average return is high or low and how you could better estimate PPO's average performance on Hopper.
- (e) Render an evaluation rollout of one trained policy. Does the agent complete the task? The way you expected, or does it surprise you?
- (f) Render another policy, compare the two, and say which you prefer.

The starter code defaults to 1 million steps, evaluating every 10,000 steps over 10 episodes. Six runs at the worst case is 9 hours. On a single laptop, this question sets the schedule for the whole assignment.

(e) and (f) look like filler, but they set up Q2: you just compared two rollouts by eye and stated a preference, which is exactly what RLHF asks human labelers to do.

## Q2: learning a reward model from preferences

This question follows Christiano et al.'s framework: instead of writing a reward, learn one from labels saying which of two trajectory segments is better, then run PPO on it.

The PDF first defines preference: a segment is better if its per-step rewards sum higher. Then it uses Bradley-Terry to write the probability that the first segment is preferred as a softmax over the two summed rewards:

```text
P̂[σ¹ ≻ σ²] = exp(Σ r̂(o¹ₜ, a¹ₜ)) / ( exp(Σ r̂(o¹ₜ, a¹ₜ)) + exp(Σ r̂(o²ₜ, a²ₜ)) )

L(r̂) = − Σ over (σ¹, σ², μ) in D of [ μ log P̂[σ¹ ≻ σ²] + (1 − μ) log(1 − P̂[σ¹ ≻ σ²]) ]
```

Learning a reward becomes a classification problem: fit the human labels μ with cross-entropy.

**Written parts (a)(b)**: parameterize r̂ as a neural network r̂_θ and derive the gradients of log P̂ and of the loss L with respect to θ, as functions of the per-step ∇_θ r̂_θ. The hint: rewrite P̂ as sigmoid(z_θ).

**Coding and observation parts (c)–(g)**:

- (c) Use `render.py --dataset data/long-prefs-hopper.npz --idx IDX` to watch 5 long pairs. Each segment is 200 steps, an 8-second video. Note which one the dataset marks as preferred and whether you agree; estimate your agreement rate with the labeler and decide whether you'd trust a reward learned from this data.
- (d) Implement `RewardModel` in `run_rlhf.py`.
- (e) Run PPO on the learned reward with 3 seeds and plot average returns under **both the original and the learned reward**. Do they correlate?
- (f) Given enough preference pairs generated under Bradley-Terry, can you recover the original reward function?
- (g) Render the trained behavior and compare it with the Q1 policies trained on the true reward and with the demonstrations in the dataset.

The starter code reveals a few design choices. The reward model trains for 100,000 steps at batch size 64 by default, and its output is clamped to [0, 1] by default. After training, `CustomRewardEnv` swaps out Hopper's reward and hands the environment to the same stable-baselines3 PPO. During evaluation the callback records both `original_returns` and `learned_returns`; those are the two curves in (e).

A footnote points to recent work: human pairwise feedback on partial trajectories may track regret more closely, so the learned function may be better viewed as an advantage function than a reward. See [Knox et al., AAAI 2024](https://openreview.net/forum?id=euZXhbTmQ7). Think hard enough about (f) and you run into the same question.

## Q3: DPO, no reward model

Q2's route is preferences → reward model → PPO. Q3 takes another: when you have a pretrained model and preference data, update the policy directly from preferences and skip the reward model. The PDF gives the DPO loss:

```text
L_DPO(π_θ; π_ref) = − E_(x, y_w, y_l) ~ D [ log σ( β log(π_θ(y_w|x) / π_ref(y_w|x)) − β log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]
```

x is the context (state), y_w is the preferred action (in LLM terms, the response), and y_l is the other one.

The catch is that DPO was designed for bandits: one context, one response. Hopper is multi-step control. The assignment's adaptation is worth understanding before you code:

- Given an observation, the model outputs a distribution over **the next sequence of actions**, not a single action. A footnote explains why: 50 actions are only 2 seconds of video, and asking a human to rank the effect of one action is close to impossible.
- If the action sequence is as long as the whole horizon, that is open-loop control, which can't react to disturbances or compounding errors.
- So the assignment uses **receding horizon control** (also called MPC): compute a plan at each step, execute only the first action, and replan.

The PDF also mentions [Contrastive Preference Learning (CPL)](https://arxiv.org/abs/2310.13639), later work that tackles multi-step preference learning directly and shows DPO is a special case of its setting for bandits. The assignment uses DPO because it is widely used in LLM training and simple enough to show the difference between RLHF and learning policies directly from preferences.

**Coding parts (a)–(c)**, all in `run_dpo.py`:

- (a) Implement `ActionSequenceModel`: a multivariate normal per action, with mean and standard deviation predicted by a neural network.
- (b) Implement `SFT.update`: maximize the log probability of the **preferred** actions in the preference data, which is behavior cloning.
- (c) Implement `DPO.update`: minimize the DPO loss above.

**Experiments and writeup (d)(e)**: run SFT and DPO with 3 seeds each, plot returns, compare them with Q2's RLHF, and discuss the pros and cons of each method on this example. Then take the best DPO run and render 10 episodes side by side, SFT on the left and DPO on the right.

`main()` fixes several experimental conditions:

- Both algorithms start from the SFT weights in `data/pretrain.pt`. DPO is initialized from that SFT model and uses it as the reference policy.
- DPO assumes strict preferences, so the 0.5 ties are dropped when loading data.
- Defaults are `beta=0.1` and `lr=1e-5`, with 20,000 steps each for SFT and DPO, evaluating every 2,000 steps over 100 episodes.
- The environment uses `terminate_when_unhealthy=False`, unlike Q1's default.

The PDF sets expectations itself: neither policy may look great, because both train on a small amount of offline data and **never interact with the environment**. That is the fundamental difference between Q3 and Q2, and a good place to start the pros and cons in (d).

## Q4: best arm identification

The first three questions share Hopper. Q4 suddenly turns to pure theory. The setting: among several experimental drugs or website designs, identify the best one quickly for future use. This is pure exploration; reward lost along the way doesn't matter.

The PDF frames it as a multi-armed bandit with rewards in [0, 1], reminding you that a bandit is a finite-horizon MDP with one state and horizon 1, so there are exactly |A| deterministic policies. The proposed algorithm is as simple as it gets: **pull each arm n_e times and return the arm with the highest average reward**.

The PDF gives Hoeffding's inequality: for n i.i.d. variables in [0, 1], the probability that the sample mean deviates from the expectation by more than sqrt(log(2/δ) / 2n) is less than δ. Three parts:

- (a) Starting from Hoeffding, show that the probability that some arm's estimate deviates by more than that width is less than |A|δ. A tighter bound is fine if you argue why it is tighter.
- (b) To return an ε-optimal arm with probability at least 1 − δ′, how accurately must you estimate each arm, and how many total samples do you need? Express the answer in terms of the number of arms, the precision ε, and the failure probability δ′.
- (c) Optional, ungraded: assume via the central limit theorem that arm averages are normal, redo the analysis for two arms, compare sample counts, and discuss which assumption you'd pick when experiments are expensive.

(a) tests the union bound. (b) tests how small the estimation error must be to guarantee the chosen arm is within ε. Both tools come back in the next post's UCB derivation, in finer form: [order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) covers L9's sub-Gaussian confidence bounds and union bound, and L10's UCB regret proof, redone following Section 7.1 of [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf). Q4 goes much more smoothly after that.

Comparing with UCB also clarifies the question: UCB cares about regret accumulated **along the way**, while Q4 only cares about being right **at the end**. The same concentration inequalities with a different objective give a different algorithm and a different bound.

## Q5: stated vs. revealed preferences

The last 4 points are a news recommendation app. The app has two kinds of user data: the topics and formats users say they like, and interaction data (which articles they lingered on, for how long, and whom they shared with). There is also metadata: location, browser, usage frequency, whether they pay, and how likely they are to subscribe.

Four sub-questions: which data are stated preferences and which are revealed; what reward function a company might choose; the ethical considerations of prioritizing stated versus revealed preferences; and how to add exploration to test whether a user's preferences change over time.

This ties directly to the value alignment guest lecture in the second half of L10, which separates aligning to user intentions, revealed preferences, and best interests as distinct goals. In this series that is [order 17, value alignment](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en). The fourth sub-question's "add exploration" is the topic of orders 13–15.

## How to self-study it

1. **Start Q1's six training runs first.** They are the most time-consuming part. While they run in the background, write Q1 (a)–(c) and the Q2 (a)(b) derivations.
2. **Watch the 5 long pairs for Q2 (c) before you code.** Your judgment of label quality shapes how you read the curves in (e).
3. **Derive the Q2 gradient before writing `RewardModel.update`.** The derived expression is what your loss looks like; check the loss value on a small hand-computed example.
4. **In Q3, get the shape of `ActionSequenceModel`'s distribution right first.** Log probabilities must sum over every step and dimension of the action sequence, which is exactly what `torch.distributions.Independent` handles.
5. **Wait on Q4 until after [order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en).** With no autograder, you can only check the derivation yourself: plug a few numbers into your final sample-count formula and see how it grows with the number of arms and ε.

One thing you can do tonight: download the Drive zip, set up the environment, and run `render.py --dataset data/long-prefs-hopper.npz` once. Watch one 8-second pair, decide which is better without looking at the label, then check. It needs no GPU, and it shows you firsthand where RLHF data comes from and how noisy it is.

## Further reading

- The same RLHF/DPO material in CS224R (deep RL and LLM perspective): [CS224R L9: RLHF, DPO, and Preference Optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)
- Where SFT and RLHF sit in the LLM training pipeline: [CS336 Lecture 15: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en)
- Another route through exploration and open problems: [Berkeley CS285 L19–25: Exploration, RL Theory, and Open Problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked the official page and public playlist again; no matching public recording, so status unchanged.

## References

- [CS234 course homepage (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule (A3 released Week 5, due Week 7), both grading schemes
- [CS234 assignments page](https://web.stanford.edu/class/cs234/assignments.html) — A3 questions, LaTeX template, starter code link, Feb 20 6 pm deadline and 2 late days
- [CS234 Winter 2026 Assignment 3 question PDF](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf) — the five questions, points, commands, and submission format
- [A3 starter code (Google Drive)](https://drive.google.com/file/d/18HwwLiMIN9XSdK7QXqQjGyhyb_86Iz_Y/view) — `ppo_hopper.py`, `run_rlhf.py`, `run_dpo.py`, `data/prefs-hopper.npz`, and more, 15 entries
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — L8 and L9 slides and the "Data Efficient RL" module
- [CS234 Lecture 9 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf) — the opening RLHF vs. DPO quiz and the bandit basics Q4 needs
- [Christiano et al., Deep Reinforcement Learning from Human Preferences (NeurIPS 2017)](https://arxiv.org/abs/1706.03741) — the framework behind Q2 (cited in the PDF)
- [Knox et al., Learning Optimal Advantage from Preferences and Mistaking It for Reward (AAAI 2024)](https://openreview.net/forum?id=euZXhbTmQ7) — cited in a Q2 footnote
- [Hejna et al., Contrastive Preference Learning (arXiv:2310.13639)](https://arxiv.org/abs/2310.13639) — the CPL mentioned in Q3
- [Gymnasium Hopper environment docs](https://gymnasium.farama.org/environments/mujoco/hopper/) — required reading for Q1 (b)(c)
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — supplementary reading listed on the materials page, Section 7.1
- [stable-baselines3 docs](https://stable-baselines3.readthedocs.io/) — the PPO implementation used by the starter code
- [PyTorch distributions: Independent](https://docs.pytorch.org/docs/stable/distributions.html#independent) — the topic of the notebook the Q3 footnote mentions but the zip lacks
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — public recordings; video 9 is the DPO guest lecture
