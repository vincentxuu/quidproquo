---
title: "Reading CS234, Part 6: DQN — the Deadly Triad, Experience Replay, and Fixed Q-Targets"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, deep-reinforcement-learning]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 6
tldr: "Q-learning converges with a table but can diverge once you add function approximation. CS234 blames the deadly triad: bootstrapping, function approximation, and off-policy learning all at once. DQN holds things together with two tricks. Experience replay breaks the correlation between consecutive samples, and fixed Q-targets keep the target still for C steps. In the Atari ablation table the slides show, Breakout goes from 3 with a linear model and 3 with a plain deep network to 317 with both tricks; replay alone reaches 241."
description: "A guide to the first half of Lecture 5 of Stanford CS234 Reinforcement Learning (Winter 2026): a recap of the TD target under value function approximation, why the deadly triad destabilizes Q-learning, DQN's experience replay and fixed Q-targets, the full pseudocode, the Atari setup and ablation results, and what the three DQN written questions in A2 Q1 are testing."
draft: false
glossary:
  - term: "deadly triad"
    definition: "When bootstrapping, function approximation, and off-policy learning occur together, value learning can oscillate or fail to converge."
    context: "CS234 L5 uses it to explain why Q-learning can diverge with function approximation; see Baird's counterexample in Sutton & Barto, 2nd ed."
    links:
      - label: "Sutton & Barto 2nd ed."
        url: "http://incompleteideas.net/book/the-book-2nd.html"
  - term: "experience replay"
    aliases: ["replay buffer"]
    definition: "Store past (s, a, r, s') transitions in a buffer and update on random minibatches drawn from it, instead of only on the step that just happened."
    context: "DQN's first trick, used to break the correlation between consecutive samples."
  - term: "fixed Q-targets"
    aliases: ["target network"]
    definition: "Compute the TD target with a separate set of weights w⁻, copied from the weights being updated every C steps, so the target stays fixed in between."
    context: "DQN's second trick, aimed at targets that move every time the network is updated."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 videos.** It is Part 6 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series and follows [model-free control: ε-greedy, GLIE, SARSA/Q-learning, and function approximation](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en).

Official materials used: pages 5–21 of the [Lecture 5 slides (post version)](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf), Question 1 of the [A2 handout](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf) (8 written points), and [video 04, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8), from the [public 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Per its YouTube chapters, the 2024 DQN material is the last 20 minutes of that video: [58:04, "Instabilities and DQN"](https://www.youtube.com/watch?v=b_wvosA70f8&t=3484s) and 1:05:39, "DQN implementation." Video 05, "Policy Search 1," is entirely about policy search and has no DQN.

Access level is **A3 (enough for self-study)**: the slides and the A2 handout are public. The gaps: the 2026 recordings are on Canvas only, and the Gradescope autograder is not public, so you can only check your A2 Q1 answers against the slides yourself.

Lecture 5 is titled "Policy Gradient I", but its first 21 pages finish off function approximation and cover DQN. This series splits by topic, so this post covers only that first half. The policy gradient half is in the [next post](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en).

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=b_wvosA70f8
title: video 04, "Q learning and Function Approximation"
```

Original videos: [video 04, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8)

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Back to the last equation of the previous post

At the end of the previous post, the table no longer fit, so we approximated Q with a function $\hat{Q}(s, a; w)$ parameterized by $w$. Page 5 lines up three methods. They differ only in what they use as a stand-in for the true Q:

- **Monte Carlo** uses the actual return $G_t$.
- **SARSA** uses $r + \gamma \hat{Q}(s', a'; w)$, where $a'$ is the next action actually taken.
- **Q-learning** uses $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$.

The update always has the same shape:

$$\Delta w = \alpha \big(\text{target} - \hat{Q}(s, a; w)\big) \nabla_w \hat{Q}(s, a; w)$$

If gradient descent on parameters is still new to you, read the [deep learning chapter](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning-en) of the [CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) first. This post swaps $\hat{Q}$ for a convolutional network, but the update itself does not change.

## The problem: tables converge, function approximation can diverge

Page 9 states the conclusion first. Q-learning with a tabular representation converges to the optimal $Q^*$, but **with function approximation it can diverge**.

Page 6 explains why in two layers. The Bellman operator itself is a contraction ([Part 2](/posts/ai/2026-09-30-cs234-mdp-planning-en) proves this), so each backup shrinks the error. But after each backup we also have to "fit" the result back into some feature representation, and that fitting step **can be an expansion**. Shrink, then stretch, and convergence is no longer guaranteed.

The slides call the dangerous combination the **deadly triad**. When all three show up together, you can get oscillation or no convergence at all:

1. **Bootstrapping**: using an *estimate* of the next state's value instead of the true value. The poll on page 3 checks exactly this definition.
2. **Function approximation**: a parameterized function instead of a table.
3. **Off-policy learning**: Q-learning, for example, updates with a $\max$ that differs from the policy actually choosing actions.

Page 6 points you to Baird's counterexample in Sutton & Barto, the classic construction of this failure.

### Two concrete symptoms for DQN

Page 9 boils the trouble with "Q-learning plus a neural network" down to two problems:

- **Correlated samples**: consecutive transitions come from the same trajectory. They are highly correlated, which breaks SGD's assumption of independent samples.
- **Non-stationary targets**: the target $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$ also uses $w$. Every update to $w$ moves the target.

DQN has one trick for each symptom.

## Trick 1: experience replay

Page 10: store past experience in a dataset $D$, called the **replay buffer**. For each update:

1. Sample one $(s, a, r, s')$ from $D$ at random.
2. Compute the target $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$.
3. Update $w$ with SGD.

Random sampling breaks the temporal correlation. Page 11 then names what is left. The target is treated as a scalar in this step, but once $w$ changes in the next round, the same transition's target changes too. That leads to the second trick.

## Trick 2: fixed Q-targets

Page 12: compute the target with a **separate set of weights** $w^-$, while still updating $w$.

$$y = r + \gamma \max_{a'} \hat{Q}(s', a'; w^-)$$

$w^-$ stays fixed across many updates, so the target stops chasing the network for a while. The poll on pages 14–15 asks whether the extra weights double compute time or double memory. The slides' answer: **they double memory**.

## The full DQN pseudocode

The version on page 13, step by step:

1. Input $C$ and $\alpha$. Set $D = \{\}$, initialize $w$, set $w^- = w$ and $t = 0$
2. Get the initial state $s_0$
3. Loop:
   - Pick action $a_t$ with an ε-greedy policy over the current $\hat{Q}(s_t, a; w)$
   - Observe reward $r_t$ and next state $s_{t+1}$
   - Store $(s_t, a_t, r_t, s_{t+1})$ in $D$
   - Sample a random minibatch from $D$
   - For each tuple in the minibatch: if the episode ended at the next step, $y_i = r_i$; otherwise $y_i = r_i + \gamma \max_{a'} \hat{Q}(s_{i+1}, a'; w^-)$. Then take one gradient step on $(y_i - \hat{Q}(s_i, a_i; w))^2$
   - $t = t + 1$; every $C$ steps set $w^- \leftarrow w$

A note under the pseudocode warns that there are many hyperparameters and design choices here: the network architecture, the learning rate, how often to update the target network. The replay buffer usually has a fixed size, so you also choose how big it is and how to fill it.

## Setup and results on Atari

Page 17 describes the Atari setup from [Mnih et al. 2015, "Human-level control through deep reinforcement learning"](https://www.nature.com/articles/nature14236):

- $Q(s, a)$ is learned end to end from pixels
- The input state is a stack of raw pixels from the **last 4 frames**
- The output is $Q(s, a)$ for each of the **18** joystick/button positions
- The reward is the change in score for that step
- A CNN is used, with **the same architecture and hyperparameters for every game**

Pages 18–19 show the paper's architecture figure and per-game results. The text layer of the slides has no numbers for them, so I do not restate them here.

### Ablation: which trick matters more

Page 20 has a table comparing five settings on five games:

| Game | Linear | Deep network | DQN w/ fixed Q | DQN w/ replay | DQN w/ replay and fixed Q |
|---|---|---|---|---|---|
| Breakout | 3 | 3 | 10 | 241 | 317 |
| Enduro | 62 | 29 | 141 | 831 | 1006 |
| River Raid | 2345 | 1453 | 2868 | 4102 | 7447 |
| Seaquest | 656 | 275 | 1003 | 823 | 2894 |
| Space Invaders | 301 | 302 | 373 | 826 | 1089 |

The slides conclude that **replay is hugely important**. Two things are worth noticing:

- Switching to a deep network with neither trick does no better than the linear model, and sometimes worse (Enduro 62 → 29, Seaquest 656 → 275).
- Fixed Q alone helps a little, replay alone helps a lot, and both together do best. Seaquest is the exception: replay alone (823) scores below fixed Q alone (1003), yet the two together jump to 2894.

Page 20 ends with an open question: beyond breaking correlations, what else does replay do? The slides do not answer it directly. One direction to think about: each transition gets sampled many times, so **the same data is reused for many updates**. That is the same motivation behind PPO's "take several steps on one batch", which you will meet [two posts from now](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en).

## Page 21: a checklist for the model-free unit

Page 21 lists what you should be able to do after the model-free lectures:

- Implement TD(0) and MC for on-policy evaluation
- Implement Q-learning and MC control
- List the three sources of instability (function approximation, bootstrapping, off-policy learning) and describe the problems qualitatively
- Know the key DQN design choices (experience replay, fixed targets)

**Something to do tonight**: go through this list item by item. If you cannot answer the third item, reread the deadly triad section above. If you are stuck on the first two, go back to [Part 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en) and [Part 5](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en).

## A2 Q1: what the three DQN written questions test

A2 opens with 8 written points on DQN. The handout includes its own DQN pseudocode, written slightly differently from the slides: episodes form the outer loop, the two weight sets are $\theta$ and $\theta^-$, and line 20 resets $\theta^- = \theta$ every $C$ steps. The three parts:

| Part | Points | What it asks | Where to look in this post |
|---|---|---|---|
| (a) | 3 | Which lines of the pseudocode must change to recover tabular Q-learning, and what do they change to? | Recall that tabular Q-learning has no buffer and no target network, and updates a single cell directly |
| (b) | 2 | How could the Mars Rover example from Lecture 2 be changed so that tabular Q-learning performs extremely poorly (so that something like DQN is needed)? | Think about when a table cannot hold or cannot learn the problem |
| (c) | 3 | Explain why the replay buffer helps | The "Trick 1" section and the ablation table |

This series does not give answers. The other three questions of A2 (policy gradient coding, distributions induced by a policy, and an ethics question) come together in the [A2 post](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en), after the [next post](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en) and [Part 8](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en). Note that A2's coding part has no DQN: the files in the [starter code](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip) are `policy_gradient.py`, `ppo.py`, `baseline_network.py`, and so on. In this assignment, DQN appears only in the written questions.

## Further reading

- [Reading CS224R: Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en): how another Stanford RL course covers Q-learning and replay
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en): the same material in Berkeley's version
- [CS229 notes, Chapter 19: reinforcement learning](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en): the prerequisite course's treatment of MDPs and value iteration

**Series navigation**: previous [Part 5: model-free control](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en) | next [Part 7: policy gradients — REINFORCE, baselines, actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en) | [series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS234: Reinforcement Learning (Winter 2026 course home page)](https://web.stanford.edu/class/cs234/)
- [CS234 modules page](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 5: Policy Gradient I slides (Winter 2026, post version)](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)
- [CS234 assignments page](https://web.stanford.edu/class/cs234/assignments.html)
- [Assignment 2 handout (Winter 2026)](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Assignment 2 starter code](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip)
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 4: Q learning and Function Approximation (Spring 2024, YouTube)](https://www.youtube.com/watch?v=b_wvosA70f8&t=3484s) — DQN from 58:04
- [Mnih et al. 2015: Human-level control through deep reinforcement learning (Nature)](https://www.nature.com/articles/nature14236)
- [Sutton & Barto: Reinforcement Learning: An Introduction, 2nd ed.](http://incompleteideas.net/book/the-book-2nd.html)
