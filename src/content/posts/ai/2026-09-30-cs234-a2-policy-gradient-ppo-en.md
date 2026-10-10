---
title: "CS234 Assignment 2: Implementing REINFORCE, a Baseline, and PPO, Plus Policy-Induced Distributions"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, policy-gradient, ppo]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 9
tldr: "CS234 Winter 2026 Assignment 2 is worth 102 points across four questions: DQN written questions (8); REINFORCE, a neural-network baseline, and clipped PPO on three PyBullet environments, CartPole, Pendulum, and HalfCheetah (54 coding + 21 write-up); proofs about policy-induced state distributions and the performance difference lemma (14); and a Belmont Report review of an RL experiment that learns on real students (5). The coding question turns the equations from L5–L7 into code that produces 21 learning curves."
description: "A guide to Stanford CS234 (Winter 2026) Assignment 2: Q1 DQN written questions, Q2 REINFORCE, baseline, and PPO on CartPole, Pendulum, and Cheetah with target scores, Q3 discounted state distributions and the performance difference lemma, and Q4 research ethics for RL experiments. Covers point values, submission format, starter-code files, and hyperparameters. Explains what each question trains; no solutions."
draft: false
glossary:
  - term: "advantage normalization"
    definition: "Subtracting the batch mean from estimated advantages and dividing by their standard deviation, so they have mean 0 and standard deviation 1. Centering is another constant baseline; rescaling multiplies the learning rate by 1/σ."
    context: "The second variance-reduction trick in A2 §2.3; enabled by default in the starter config."
  - term: "performance difference lemma"
    aliases: ["relative policy performance identity"]
    definition: "The value gap between two policies equals 1/(1−γ) times the expected advantage of one policy, taken under the other policy's state distribution. It lets you estimate how much better a new policy is using data from the old one."
    context: "L6 p.33 states outright that \"In CS234 HW2 we ask you to prove\" it; it is A2 Q3 (d)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Edition note**: this guide follows the [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 assignments and slides. The public recordings are the [Spring 2024 edition](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Every fact was checked on 2026-09-30 against the [assignments page](https://web.stanford.edu/class/cs234/assignments.html), the [A2 question PDF](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf) (11 pages), and the [starter-code zip](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip). Access level **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): questions, LaTeX template, and starter code are public. Gradescope grading, TA answers on Ed, and official solutions are not.

**Series**: previous [Advanced policy gradients: performance bounds, KL, PPO, GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en) | next [Learning from demonstrations: BC, DAgger, IRL, MaxEnt IRL](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

The last three posts took value-based methods up to [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en), then switched to differentiating the policy directly: [REINFORCE and baselines](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en), then PPO, which limits step size with clipping. Assignment 2 wraps that whole arc into one package. There is a short DQN question and a coding project where you build the policy gradient family yourself. A proof question derives the identity behind PPO. The last question asks how you should run an experiment when a learn-as-you-go algorithm acts on real people.

On the 2026 schedule, A2 goes out in Week 2 and is **due Sunday, February 1, 2026 at 6:00 PM PST**. That week (Week 4) lectures cover Policy Search and imitation learning, so the code is due right after the PPO lecture.

This guide covers what each question trains, which lecture tools it needs, and where people get stuck. **It gives no solutions.**

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Submission and points

You submit three parts:

1. A PDF of the written part
2. A zip of the written part's LaTeX source, built from the official [LaTeX template](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_template.zip). It must unpack directly to `main.tex` plus `img/results-cheetah.png`, `img/results-pendulum.png`, and `img/results-cartpole.png`, with no enclosing folder.
3. The code: run `bash collect_submission.sh`, which zips only `network_utils.py`, `policy.py`, `policy_gradient.py`, `baseline_network.py`, and `ppo.py` into `assignment2.zip`

| Question | Topic | Points | Format |
|---|---|---|---|
| Q1 | Deep Q-Networks (DQN) | 8 | Written, 3 + 2 + 3 |
| Q2 | Policy Gradient Methods | 75 | 54 coding + 21 write-up |
| Q3 | Distributions induced by a policy | 14 | Written proofs, 3 + 1 + 5 + 5 |
| Q4 | Ethical concerns with Policy Gradients | 5 | Written, 4 + 1 |

The total is 102 points. On the [course home page](https://web.stanford.edu/class/cs234/), A2 counts for 7% for on-campus students (who also have 24% for tutorials) and 15% for off-campus students. You may use at most 2 late days per assignment and 5 in total.

## Q1: three DQN questions

The question prints the DQN pseudocode: replay buffer D, network weights θ, target-network weights θ⁻ synced every C steps. Then it asks:

- (a) Which lines would you change to recover tabular Q-learning, and to what? (3 pts)
- (b) Going back to the Mars Rover example from lecture 2, what changes would make tabular Q-learning perform extremely poorly, so that you would need something like DQN? (2 pts)
- (c) Why is the replay buffer beneficial? (3 pts)

All three review the [DQN post](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en). For (a), go line by line: which lines exist only because of function approximation (the network, the target network, the minibatch)? Once they are gone, is the remaining update the Q-learning rule from L4? For (b), think about when a table stops fitting or stops learning, not about when DQN looks impressive.

## Q2: build the policy gradient family

Sections 2.1–2.4 of the PDF lay out four equations, and the code fills them in:

1. **REINFORCE**: use sampled returns Gₜ as unbiased estimates of Q^π(s, a). The objective averages log π_θ(aₜ|sₜ)·Gₜ over every timestep of every trajectory.
2. **Baseline**: subtract a learned b_φ(s), which is fit to Gₜ with an MSE loss.
3. **Advantage normalization**: normalize Âₜ = Gₜ − b_φ(sₜ) to mean 0 and standard deviation 1. The PDF explains why this leaves the gradient direction alone: centering is another constant baseline, and rescaling multiplies the learning rate by 1/σ.
4. **PPO**: the ratio z_θ = π_θ(a|s) / π_θold(a|s), and the objective min(z·Â, clip(z, 1−ε, 1+ε)·Â). Here V_φ is called the critic and is trained like the baseline. Collect a batch with π_θold, take K updates on that batch, then set π_θold to π_θ.

The PDF stresses that REINFORCE is on-policy: one batch buys one update, and then the data is discarded. PPO wants to "squeeze" more information out of each batch. Clipping blocks the oversized updates that stale data could otherwise cause. The PDF also notes that this connects to importance sampling, covered in detail later. That material sits at the end of the L7 PDF, pp.63–69.

### Starter-code files

`assignment2_starter_code.zip` unpacks to a `code/` directory plus `README.md`, `requirements.txt`, and `collect_submission.sh`:

| File | What you do |
|---|---|
| `network_utils.py` | Implement `build_mlp` |
| `policy.py` | Implement `BasePolicy.act`, `CategoricalPolicy.action_distribution`, `GaussianPolicy.__init__`, `GaussianPolicy.std`, `GaussianPolicy.action_distribution` |
| `policy_gradient.py` | Implement `PolicyGradient.init_policy`, `get_returns`, `normalize_advantage`, `update_policy`; sampling, the training loop, and evaluation are provided |
| `baseline_network.py` | Implement `BaselineNetwork.__init__`, `forward`, `calculate_advantage`, `update_baseline` |
| `ppo.py` | Implement `PPO.update_policy`; `PPO` subclasses `PolicyGradient` and also stores `old_logprobs` during sampling |
| `config.py` | Hyperparameters for the three environments (no changes needed) |
| `main.py`, `plot.py`, `general.py` | Entry point, plotting, logger and progress-bar utilities |

The README requires **Python 3.9**. The environments come from the open-source physics engine [PyBullet](https://github.com/bulletphysics/bullet3). `requirements.txt` pins `gym==0.21`, `pybullet==3.2.6`, and `numpy==1.23.0`, plus torch, matplotlib, and scipy. Both the README and the PDF say to run `pip install pip==23.0` first if installation fails, because newer pip is incompatible with `gym==0.21.0`.

### Environments and hyperparameters

In `config.py` all three environments are the PyBullet versions:

| Parameter | cartpole | pendulum | cheetah |
|---|---|---|---|
| Env ID | `CartPoleBulletEnv-v1` | `InvertedPendulumBulletEnv-v0` | `HalfCheetahBulletEnv-v0` |
| Batches | 100 | 100 | 200 |
| Steps per batch | 2000 | 10000 | 10000 |
| Max episode length | 200 | 1000 | 1000 |
| γ | 1.0 | 1.0 | 0.9 |
| Network | 1 layer × 64 | 1 layer × 64 | 2 layers × 64 |
| PPO ε (`eps_clip`) | 0.2 | 0.2 | 0.1 |
| Updates per batch (`update_freq`) | 5 | 20 | 10 |

The learning rate is 3e-2 everywhere, and advantage normalization is on by default. Note that γ is 1 for cartpole and pendulum and only cheetah discounts, so compute Gₜ with `self.config.gamma` rather than a hard-coded value.

### Things to settle before you code

- **Shapes.** The PDF says every function's batch size is ΣTᵢ, because the starter code already flattens observations, actions, and rewards across episodes. Tips 1 and 2 are both about shapes: call `self(observations)` to invoke forward instead of calling the inner network.
- **Discrete vs. continuous.** The `init_policy` docstring tells you to check `self.discrete`: build a `CategoricalPolicy` for discrete actions and a `GaussianPolicy` for continuous ones, then create an Adam optimizer. For `GaussianPolicy.std`, decide how a learned standard deviation stays positive.
- **The PPO ratio.** Tip 3 suggests exponentiating the difference of log-probabilities instead of dividing probabilities.
- **What gets a gradient.** PPO's `old_logprobs` are numbers saved at sampling time. Write-up question (c) comes back to this.

### Sanity checks and target scores

The PDF lists debugging checks that hold across most seeds. They are not a full test:

- Pendulum, no baseline: average reward around 100 by iteration 10
- Pendulum, with baseline: around 700 by iteration 20
- Pendulum, PPO: 200 by iteration 20
- Every method should reach 200 on CartPole, 1000 on Pendulum, and 200 on Cheetah at some point

The reference performance for the write-up: CartPole should hit the maximum of 200 and Pendulum the maximum of 1000, though neither may stay there. Cheetah should reach at least 200 and could go as high as 900. Curves oscillate, so the PDF suggests averaging over several seeds.

### Write-up questions (21 pts)

| Part | Content | Points |
|---|---|---|
| (a) | Computing every Gₜ naively takes O(T²); explain how to do it in O(T) | 3 |
| (b) | When is the gradient of the clipped PPO loss zero? Write the cases mathematically and explain why PPO behaves this way | 3 |
| (c) | The sampling method also returns the action's log-probability. Why does PPO need to cache it while REINFORCE does not? If it had not been collected during rollout, how would the PPO update code change? | 3 |
| (d) | Run every experiment, plot the results, and comment on each method | 12 |

For (d), run `python main.py --env-name ENV --seed SEED --METHOD`, where METHOD is `baseline`, `no-baseline`, or `ppo`. Run seeds 1, 2, 3 on CartPole and Pendulum. Cheetah only requires seed 1 because it is expensive, though more seeds are encouraged. Across the three methods that makes at least 21 runs. Plot each environment with `python plot.py --env-name ENV --seeds 1,2,3` and put one figure per environment in the write-up.

(b) repays the most time. Draw the Â > 0 and Â < 0 cases separately and mark where min and clip take over and where the slope is zero. Once you have drawn it, you can see how PPO's "proximal" behavior comes from vanishing gradients. You can also see how it blocks the "big step, collapse" failure from the previous post.

## Q3: distributions induced by a policy

This question has you derive the identity behind PPO from scratch. The setting is an infinite-horizon MDP with stochastic policies and a fixed start state s₀:

| Part | Task | Points |
|---|---|---|
| (a) | Write ρ^π(τ), the probability of sampling trajectory τ when running π | 3 |
| (b) | Express p^π(sₜ = s), the probability of being in s at step t, using ρ^π | 1 |
| (c) | With d^π(s) = (1−γ) Σₜ γᵗ p^π(sₜ = s), prove that for any f(s, a) the expected discounted sum Σ γᵗ f along trajectories equals 1/(1−γ) times the expectation of f under d^π | 5 |
| (d) | Prove V^π′(s₀) − V^π(s₀) = 1/(1−γ) · E_{s∼d^π′, a∼π′}[A^π(s, a)] | 5 |

The hints are concrete. For (c), first consider an f that is 1 at a single (s, a) and 0 elsewhere, which is a discounted visitation count. For (d), add and subtract Σ γᵗ⁺¹ V^π(sₜ₊₁), then use the tower property and the partial trajectory τₜ.

[L6 slide 33](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf) names (d): the **performance difference lemma**, with the line "In CS234 HW2 we ask you to prove". The PDF's closing paragraph explains why it matters. When π is your current network and π′ is the updated one, the identity lets you estimate π′ from data collected by π. It is where the previous post's relative performance bounds and PPO's limited updates start.

<details>
<summary>Tools to have ready before Q3</summary>

- ρ^π(τ) is a product of the start state, policy probabilities, and transition probabilities. Get it right and (b)(c) are mostly a change in summation order.
- Σₜ γᵗ = 1/(1−γ), so d^π really is a probability distribution; that is where the 1/(1−γ) in (c) comes from.
- A^π(s, a) = Q^π(s, a) − V^π(s), and Q^π(s, a) can be written as r(s, a) + γ E[V^π(s′)].
- In (d), track **whose** state distribution and **whose** advantage appear on each side. Swapping them is the most common mistake.

</details>

## Q4: running RL experiments on people

The scenario: a Stanford CS course wants an RL-trained chatbot for office hours. For each assignment, some students get only human CAs, some only the chatbot, and some a mix. The reward is students' assignment grades. The chatbot keeps learning, so at any point it may be better or worse than a randomly chosen human CA. Everyone is graded to the same standard.

The question cites the three principles of the [Belmont Report](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html): respect for persons, beneficence, and justice.

- (a) In 4–6 sentences, propose two experimental-design or research choices and say which principle each one serves (4 pts). The PDF gives an example: let students advised by the chatbot revise after submission with human help. Otherwise the risk of bad advice falls unevenly, which violates justice.
- (b) If you ran this experiment at Stanford, what process would you follow for IRB clearance: whom would you email, and where would you upload a protocol? (1 pt) The PDF links the [Stanford Research Compliance human-subjects page](https://researchcompliance.stanford.edu/panels/hs/forms/for-researchers#need) for you to read.

This echoes A1's reward-hacking question. There the reward was wrong. Here the reward is fine, but **exploration itself** can cause harm. Before a policy gradient method learns anything, it has to collect data with a policy that is not yet good. In a simulator that costs nothing. In a classroom or a clinic it is an ethics question.

## How to self-study it

1. Rewrite the score-function derivation from the [REINFORCE post](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en) yourself before opening `policy.py`. `act` and `action_distribution` are that derivation in code.
2. Work in order: `network_utils.py` → `policy.py` → `policy_gradient.py` → `baseline_network.py` → `ppo.py`, running Pendulum against the sanity checks after each file.
3. CartPole is fastest, so use it to confirm all three methods run. Cheetah is slowest; leave it for last and finish at least seed 1.
4. Do Q3 after the code. The performance difference lemma carries more weight once you have written PPO and seen "estimate the new policy with old data" in practice.
5. There is no autograder. All you can check are the sanity checks, the reference scores, and whether the three methods compare sensibly.

One thing to do tonight: sketch the clipped PPO objective as a function of z, one plot for Â > 0 and one for Â < 0, and shade the regions where the gradient is zero. That sketch is the starting point for Q2 (b).

## Further reading

- The same policy gradient material in another course: [CS224R L3: Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en), [CS224R L5: the shared skeleton of PPO and SAC](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en)
- Berkeley's version: [CS285 L5–10: Policy Gradient, Actor-Critic, DQN, and SAC](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234 course home page (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule (A2 released Week 2, due Week 4), grade weights, late-day rules
- [CS234 assignments page](https://web.stanford.edu/class/cs234/assignments.html) — links to the A2 questions, LaTeX template, and starter code
- [CS234 Winter 2026 Assignment 2 question PDF](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf) — question text, points, submission format, sanity checks, and reference scores
- [A2 starter-code zip](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip) — files in `code/`, README, `requirements.txt`, `config.py` hyperparameters
- [A2 LaTeX template](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_template.zip) — typesetting template for the written part
- [CS234 Lecture 6 slides (post version)](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf) — p.33, the performance difference lemma, flagged as an A2 proof
- [CS234 Lecture 7 slides (post version)](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) — clipped PPO, GAE, and the importance-sampling appendix on pp.63–69
- [Belmont Report (HHS)](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html) — the three research-ethics principles cited in Q4
- [Stanford Research Compliance: Human Subjects](https://researchcompliance.stanford.edu/panels/hs/forms/for-researchers#need) — the IRB process page linked from Q4 (b)
- [Bullet Physics / PyBullet (GitHub)](https://github.com/bulletphysics/bullet3) — the physics engine behind the three environments
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — public recordings; videos 5–7, "Policy Search 1–3", cover what A2 needs
