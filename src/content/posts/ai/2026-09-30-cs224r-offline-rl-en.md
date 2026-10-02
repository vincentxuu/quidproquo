---
title: "CS224R Lecture 7: Offline RL, or Why Q-Learning Breaks When You Can't Collect More Data"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, offline-rl]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 9
tldr: "Lecture 7 of CS224R (Spring 2026) asks how to learn a policy better than your data when all you have is a fixed dataset someone else collected. Running an off-policy algorithm like SAC on that data fails: the Q-function makes up values for actions the data never contains, and the policy goes looking for exactly those overestimated actions. The slides give two families of fixes. One trains the policy only on actions in the data (filtered BC, AWR, AWAC). The other uses an asymmetric expectile loss to estimate the value of a policy better than the data without ever querying out-of-data actions (IQL). Both can do something imitation learning can't: stitch good pieces of different trajectories together."
description: "A guide to Stanford CS224R (Spring 2026) Lecture 7, based on the official 07_cs224r_offline_rl_2026 slides: why offline RL, the data-stitching example, why off-policy methods overestimate Q-values on a static dataset, filtered BC and advantage-weighted regression, AWAC, and IQL with expectile regression. The Spring 2025 Lecture 7 recording is listed as a supplement."
draft: false
glossary:
  - term: "offline RL"
    aliases: ["batch RL"]
    definition: "Training a policy only on a fixed, previously collected dataset, with no new interaction with the environment during training."
    context: "The CS224R Lecture 7 setting: data comes from an unknown behavior policy πβ, and the goal is to maximize expected reward under the learned πθ."
  - term: "behavior policy"
    aliases: ["πβ"]
    definition: "The policy (or mixture of policies) that generated an offline dataset. Usually unknown."
    context: "The slides list human-collected data, hand-designed controllers, previous RL runs, or a mix as sources."
  - term: "data stitching"
    aliases: ["trajectory stitching"]
    definition: "Combining good segments from different trajectories in a dataset into a better path that never appears in full in the data."
    context: "CS224R Lecture 7 uses it to explain how offline RL can beat imitation learning."
  - term: "expectile regression"
    aliases: ["expectile loss"]
    definition: "An asymmetric squared loss that pulls the estimate toward the high or low end of a distribution instead of its mean."
    context: "IQL uses it to estimate the value of the better in-support actions without querying out-of-data actions."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-offline-rl)

> **Source term**: Based on the Spring 2026 [07_cs224r_offline_rl_2026 slides](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf) (scheduled 2026-04-22). The companion video is the [Spring 2025 Lecture 7 recording (supplement)](https://www.youtube.com/watch?v=lRDaXnPIzks). The title matches, but the split differs: the [2025 Lecture 7 slides](https://cs224r.stanford.edu/spring_2025/slides/07_cs224r_offline_rl_2025.pdf) presented "implicit policy constraint" and "conservative methods" ([CQL](https://arxiv.org/abs/2006.04779)) as the two families, and the 2025 schedule listed CQL as a reading. In 2026 the second family became IQL's expectile approach, and the only listed reading is [IQL](https://arxiv.org/abs/2110.06169). Any CQL segment in the video is material the 2026 slides don't cover. This is post 9 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

Lectures 3 through 6 ([policy gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en) to [Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en)) all assume the policy can keep collecting fresh data while it learns. Lecture 7 of [CS224R](https://cs224r.stanford.edu/) drops that assumption. You have one fixed dataset and no more interaction. How do you learn?

The slides state three learning goals:

- the key challenges in offline RL
- two core techniques for offline RL, and **why they work**
- how offline RL can improve over imitation learning

The lecture is also the theory behind [HW3](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql-en). Both the AWAC slide and the IQL slide say "You will implement it in homework 3!"

## Recap: four model-free online RL algorithms

The lecture opens with a table that wraps up the first half of the course:

| | Vanilla PG | PPO-like | Off-policy actor-critic (e.g. SAC) | Q-learning |
|---|---|---|---|---|
| Data used | on-policy | technically off-policy, often called on-policy | off-policy, with replay buffer | off-policy, with replay buffer |
| How it becomes off-policy | n/a | importance weights | fit Q with TD, sample a from π | fit Q* with TD |
| Value fitted | none | V^π | Q^π | Q* |

The two right-hand columns can already reuse old data. So what makes offline RL hard? The second half of the lecture answers that.

## Why offline RL

Online RL loops: collect data, update the policy on the latest data (or all data so far), collect again. Offline RL keeps only the first half. You get a static dataset, train on it, and stop.

The slides list three reasons to want this:

1. You want to use datasets collected by people or existing systems.
2. Collecting data online may be risky or unsafe.
3. You want to reuse data from previous experiments, projects, robots, or institutions instead of collecting it again.

The slides also mention two hybrids: offline pretraining followed by online fine-tuning, and iterated offline training, called "batch online RL."

Formally, the data comes from some **unknown** behavior policy πβ, which may be a mixture of policies. The objective is expected reward under the **learned** policy πθ. Those are different distributions, and that gap is distribution shift. The data might come from humans, a hand-designed controller, previous RL runs, or a mix.

## Stitching: where offline RL beats imitation

The slides illustrate this with a nine-state graph. The data contains two partial good behaviors: s1 → s3 and s7 → s9. Reaching s9 gives +1, reaching s6 gives −1. Can you learn a policy that goes from s1 all the way to s9?

Two questions go to the class:

1. What will a policy learned with vanilla imitation do?
2. What should a policy learned with RL be able to do? Does it depend on whether the value function is learned with TD or Monte Carlo?

The slide's conclusions come in three lines:

- Imitation methods can't outperform the policy that collected the data.
- Offline RL can use reward information to outperform the behavior policy.
- Good offline RL methods can **stitch** good behaviors together.

The slide doesn't spell out the answer to the second question. My reading: TD uses the estimated value of the next state as its target, so when two trajectories pass through the same state, the high value from the later trajectory flows back into the earlier one. Monte Carlo only sums rewards actually collected within one trajectory, so the value can't cross over. Later, the AWR slide notes that "Monte Carlo estimation is noisy," and IQL switches to TD. Read those two together.

## Why not just run an off-policy algorithm?

Off-policy actor-critics like SAC already learn from a replay buffer. What happens if the buffer is a fixed dataset?

The problem sits in the critic target r + γ·E_{a′~πθ}[Q(s′, a′)]. The action a′ is sampled from the **policy being learned**, so it may never appear in the data. It's out of distribution (OOD). The slide draws a randomly initialized Q(s′, a′) curve that has only been trained inside the data support. Outside that range, its values are arbitrary. Then the failure compounds:

- The Q-function is unreliable on OOD actions.
- The policy seeks out actions where the Q-function is over-optimistic.
- After the policy update, Q-values become substantially overestimated.

The slides offer a second view: the learned policy deviates too far from the behavior policy. The recap at the start of Lecture 8 adds the key contrast. In online RL, data from the new policy corrects these errors in later iterations. Offline RL gets no new data, so it has to be more conservative.

The slide puts it bluntly: **mitigating overestimation is the core goal of offline RL methods.**

## Technique 1: train the policy only on actions in the data

### Filtered behavior cloning

If you have reward labels, the simplest idea is to imitate only the good trajectories:

1. Rank trajectories by return.
2. Keep the top k%.
3. Run behavior cloning on what's left, maximizing log πθ(a | s).

The slides call this "a very primitive approach," which makes it a good baseline. HW3's PointMass problem uses it as the comparison.

### Advantage-weighted regression (AWR)

A finer approach weights each transition by how good its action is. The measure of "how good" is the advantage function from Lecture 4:

```text
θ ← argmax_θ  E_{(s,a)~D} [ log πθ(a | s) · exp(A(s, a)) ]
```

This is still imitation, with each sample reweighted. A side note on the slide says this advantage-weighted objective approximates maximizing Q subject to KL(π‖πβ) < ε, citing Peters et al. (REPS) and Rawlik et al. ("psi-learning"). Weighted imitation on dataset actions therefore implicitly keeps the policy near πβ.

The remaining question is how to estimate the advantage. [AWR (Peng et al., 2019)](https://arxiv.org/abs/1910.00177) takes the simplest route: fit V^πβ with Monte Carlo, and use the empirical return minus V as the advantage. The full algorithm has two steps: fit the value function, then do imitation weighted by exp(advantage / α), where α is a hyperparameter.

The slide's pros and cons:

| Pros | Cons |
|---|---|
| Simple | Monte Carlo estimation is noisy |
| Never queries or trains on OOD actions | It estimates πβ's advantage, which is weaker than πθ's |

The slide also leaves a question worth pausing on: what do you learn if πβ is deterministic?

### AWAC: estimate the advantage with TD

To get the advantage of the **current** policy πθ, fit Q^πθ with TD instead, take the advantage as Q(s, a) − E_{ā~πθ}[Q(s, ā)], and plug it into the AWR update. The slides call this "advantage-weighted actor-critic," or [AWAC](https://arxiv.org/abs/2006.09359).

| Pros | Cons |
|---|---|
| Gives a Q estimate for the current πθ, not πβ | The TD target queries Q on OOD actions |
| The policy is still trained only on dataset actions | |

The slide also notes an alternative: sample a′ from the dataset (a′ ~ D) in the TD target. That leads to the lecture's key question: **can we estimate the advantage of a policy better than πβ without querying Q on OOD actions?**

## Technique 2: better values without OOD queries

### The idea: an asymmetric loss

If a′ in the TD target comes from the data, you get Q^πβ, the behavior policy's value. The slide shows a histogram of values for one state: different dataset actions have higher and lower Q-values. A plain L2 loss recovers the mean, E_{a~πβ}[Q(s, a)]. What we want is the value of the best policy within the data support, the upper end of that distribution.

The tool is **expectile regression**. It makes the L2 loss asymmetric: errors on one side get weight λ, errors on the other side get 1 − λ. Changing λ moves the estimate toward the high or low end instead of leaving it at the mean.

### The full IQL algorithm

[Implicit Q-Learning (Kostrikov, Nair, Levine, ICLR 2022)](https://arxiv.org/abs/2110.06169) has three steps on the slide:

1. **Fit V**: apply the expectile loss to V(s) − Q̂(s, a), with a small λ < 0.5.
2. **Update Q**: plain MSE with target r + γ·V̂(s′).
3. **Extract the policy**: AWR with weights exp((Q̂(s, a) − V̂(s)) / α).

> **Watch the sign convention.** The slide writes the loss on V − Q, so it uses a *small* λ. The IQL paper and the HW3 PDF write it on Q − V and use a value above 0.5. Both aim for an upper expectile of V. Don't mix up the direction when you do HW3.

The pros listed on the slide:

- Never needs to query OOD actions.
- The policy is still trained only on actions in the data.
- Actor and critic training are decoupled, which makes it computationally fast.

The name is explained on the slide too: policy improvement happens **implicitly** through the expectile, hence implicit Q-learning.

## Summary: three techniques

The final summary slide:

- **Why offline RL**: online data is expensive, and reusing offline data is good.
- **Key challenge**: overestimated Q-values caused by the shift between πβ and πθ.
- **Techniques**:
  1. Filtered or weighted imitation learning is a simple baseline.
  2. Supervising only on dataset actions implicitly constrains the policy to πβ.
  3. An asymmetric loss estimates the value of policies better than πβ.
- **Trajectory stitching** lets offline RL improve over imitation.

Lecture 8 opens with a one-slide recap of these two key ideas, plus a real robot post-training example.

## Something to try tonight

Draw the nine-state graph on paper. Suppose the data holds only two trajectories: s1 → s2 → s3 → s4 → s6 (ending at −1) and s7 → s8 → s3 → s5 → s9 (ending at +1). I made these two up for practice; they are not the slide's actual data. Compute V(s3) and V(s2) once with Monte Carlo and once with TD, and see which one tells a policy starting at s1 to head for s9. Then reread the filtered BC section: if you keep only the highest-return trajectory, what does it learn?

## Further reading

- [Berkeley CS285: Inference and Offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en): another course's take on the same topic, with more conservative methods
- [CS224R Lecture 6: Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en): where this lecture's TD targets and target networks come from

**Series navigation**: Previous: [HW2: Online RL](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en) | Next: [Lecture 8: Where Rewards Come From](/posts/ai/2026-09-30-cs224r-reward-learning-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R course homepage and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 7 slides: Offline Reinforcement Learning (2026)](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)
- [Spring 2025 Lecture 7: Offline RL (YouTube, supplement)](https://www.youtube.com/watch?v=lRDaXnPIzks)
- [CS224R Spring 2025 archive (schedule and readings)](https://cs224r.stanford.edu/spring_2025/)
- [Kostrikov, Nair, Levine. Offline Reinforcement Learning with Implicit Q-Learning (arXiv 2110.06169)](https://arxiv.org/abs/2110.06169)
- [Peng, Kumar, Zhang, Levine. Advantage-Weighted Regression (arXiv 1910.00177)](https://arxiv.org/abs/1910.00177)
- [Nair, Gupta, Dalal, Levine. AWAC: Accelerating Online Reinforcement Learning with Offline Datasets (arXiv 2006.09359)](https://arxiv.org/abs/2006.09359)
- [Kumar et al. Conservative Q-Learning for Offline Reinforcement Learning (arXiv 2006.04779, 2025 reading)](https://arxiv.org/abs/2006.04779)
