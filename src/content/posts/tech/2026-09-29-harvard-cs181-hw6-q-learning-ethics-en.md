---
title: "Harvard CS181 HW6 (Part 4): Q-learning Swingy Monkey and Embedded EthiCS"
date: 2026-09-29
category: tech
tags: [harvard, cs181, q-learning, reinforcement-learning, ai-ethics, homework]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 14
type: guide
tldr: "HW6 Problem 3 (20 pts) has you write a tabular Q-learning agent for Swingy Monkey, a Flappy Bird-like game. The minimum bar is scoring over 50 at least once within 100 epochs, plus one improvement of your choice. Problem 5 (10 pts) is a 250-word ethics question: assuming a social platform's users grow more politically extreme, use RL concepts to explain how the choice of reward function might have contributed."
description: "A guide to Harvard CS1810 Spring 2026 HW6 Problems 3 and 5: Swingy Monkey's state, actions, and the reward values actually in the game code; the three agent classes in the starter notebook and the traps in them; Q-learning and ε-greedy (against Lecture 22 and Section 10); and a framework and access limits for the Embedded Ethics question."
draft: false
glossary:
  - term: "Q-learning"
    definition: "A model-free RL algorithm: after each step, nudge Q(s, a) toward 'reward received + γ × the best Q-value at the next state'. Because the target uses the best next action rather than the one actually taken, it is off-policy."
    context: "HW6 Problem 3 requires your own implementation, with no outside RL code."
  - term: "ε-greedy"
    aliases: ["epsilon-greedy"]
    definition: "Pick the action with the highest current Q-value with probability 1−ε and a random action with probability ε, trading off exploitation and exploration."
    context: "The problem especially recommends decaying ε over time."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics)

**Video status: The schedule mentions a recording, but no public link has been obtained.** [Source details](#course-video-sources)

> ⚠️ **Version and access**: Based on [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6) (`hw6_release.tex/pdf/ipynb`, `p3src/`, due 2026-05-01), the [Section 10 notes](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf), and the 2026 [Lecture 22](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view) and [Lecture 23](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view) slides, all opened on 2026-09-29. The slide links come from topic cells in the [official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) (visible only in the xlsx export). The course as a whole is **A3**, but the April 23 Embedded EthiCS session appears on the schedule only as "see recording", with no public link, and no 2026 slides or module page could be found. That session is **A0**: this post does not guess at what it covered.

This is part 14 of the [Harvard CS181 weekly guide](/en/posts/tech/2026-08-27-harvard-cs181-overview-en). The previous part, [HW6 (Part 3)](/en/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning-en), planned in a Gridworld with known transitions. This part drops "known": the agent learns while it plays.

## Course video sources

The Spring 2026 schedule does not list public videos for MDP/RL, but April 23 Embedded EthiCS explicitly says “see recording.” In the public schedule HTML retrieved here, that cell contains text without an openable recording link. A recording is referenced, but its public viewing link and permissions remain unconfirmed; this is not evidence that no video exists.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## Where it sits in the term

Per the [2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ):

| Date | What |
|---|---|
| Apr 16 (Thu) | Reinforcement Learning I (Lecture 22: learning from unknown environments) |
| Apr 17 (Fri) | HW6 released |
| Apr 21 (Tue) | Reinforcement Learning II (Lecture 23: scaling up with deep RL); Section 10 MDPs and RL |
| Apr 23 (Thu) | Embedded EthiCS (see recording) |
| May 1 (Fri) | HW6 due |

This post covers two HW6 problems: Problem 3 Reinforcement Learning (20 pts) and Problem 5 Embedded Ethics (10 pts).

## From planning to trial and error

In the previous problem you had `get_transition_prob` and could compute the expectation inside the Bellman equation directly. [Lecture 22](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view) removes that premise at the outset: you are dropped into a world, don't know its rules, and have to use trial and error. Data becomes a stream of `(s_t, a_t, r_t, s_{t+1})`.

The slides offer two routes: estimate a transition model from experience and then plan (model-based), or skip the model and learn value functions directly (model-free). Q-learning is the latter. [Section 10](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf) explains why you learn Q rather than V: without a transition model, V alone can't tell you where each action leads, whereas with Q you just take `argmax_a Q(s, a)`.

## Swingy Monkey: what the problem says and what the code says

The [problem](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex) opens with *Flappy Bird*, which took the world by storm in 2013. In Swingy Monkey you control a monkey swinging on vines and dodging tree trunks, with two actions per time step: `0` swings down on the current vine, `1` jumps to a new one.

Each step the agent receives a state dictionary, in screen pixels:

```text
{ 'score': <current score>,
  'tree':   { 'dist': <pixels to next tree trunk>,
              'top':  <height of top of tree trunk gap>,
              'bot':  <height of bottom of tree trunk gap> },
  'monkey': { 'vel':  <current monkey y-axis speed>,
              'top':  <height of top of monkey>,
              'bot':  <height of bottom of monkey> } }
```

The problem lists the sources of randomness: jump heights vary, the tree gaps shift vertically, gravity changes from game to game, and tree spacing varies. Open [`p3src/SwingyMonkeyNoAnimation.py`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/p3src/SwingyMonkeyNoAnimation.py) for the concrete settings:

| Item | Value in the code |
|---|---|
| Gravity | chosen at random from {1, 4} each game |
| Jump | initial speed drawn from a Poisson with mean 15 |
| Passing a trunk | reward +1 |
| Hitting a trunk | reward −5, game over |
| Falling off the bottom or jumping off the top | reward −10, game over |
| Any other step | reward 0 |

One sentence in the problem text is easy to misread: "You get points for successfully passing tree trunks without hitting them, falling off the bottom of the screen, or jumping off the top." Per the code, leaving the screen costs 10 and ends the game; it doesn't score points.

## Structure of the starter notebook

The Problem 3 part of [`hw6_release.ipynb`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.ipynb) has three agent classes:

- **`RandomJumper`**: jumps 10% of the time; useful for seeing the interface. It already demonstrates `discretize_state`: divide the horizontal distance to the trunk by 200 and "top of trunk gap minus top of monkey" by 100, and use the integer parts as two grid indices. Its Q table has shape `(2, 1400 // 200, 900 // 100)`, i.e. 2 actions × 7 × 9.
- **`Learner`**: the class you write. `action_callback` already lists three steps: discretize the current state, do the Q-learning update from the last and current step, and pick the next action ε-greedily.
- **`GravityLearner`**: marked "more advanced agent, don't need this for full credit". It already contains a complete Q-learning update, and it estimates the game's gravity from how far the monkey falls in the first time step, adding gravity to the state.

The final `run_games(agent, hist, 100, 100)` runs 100 games by default, calls `learner.reset()` after each, and stores the scores in `hist`.

**Requirements** have two parts:

1. Implement Q-learning with an ε-greedy policy yourself, tuning the learning rate α, discount γ, and exploration rate ε. No outside RL code.
2. Improve performance further with a method of your choice. The problem's examples: infer gravity each epoch, change the reward function, decay ε (especially recommended), or change the state features.

The minimum bar is **scoring over 50 at least once before the 100th epoch**. The write-up explains in one or two paragraphs how the agent performed and why you made your choices, and must include at least one plot or table comparing parameters, such as score versus epoch for different settings. The problem also notes that discretizing states and actions and running Q-learning is enough; no neural networks needed.

## The Q-learning update, and how it differs from SARSA

The update from Section 10 and Lecture 22:

```text
Q(s, a) ← Q(s, a) + α · [ r + γ · max_{a'} Q(s', a') − Q(s, a) ]
```

Lecture 22 contrasts SARSA and Q-learning on one example: `γ = 0.9`, `α = 0.5`; from `S1` you go Up, get 0, and land in `S2`; `Q(S2, Left) = 2`, `Q(S2, Right) = 10`, `Q(S1, Up) = 5`; and the policy will pick Left next.

- SARSA uses the Left you'll actually take: the target is `0 + 0.9 × 2 = 1.8`, so `Q(S1, Up) = 5 + 0.5 × (1.8 − 5) = 3.4`.
- Q-learning uses the best next action, Right: the target is `0 + 0.9 × 10 = 9`, so `Q(S1, Up) = 5 + 0.5 × (9 − 5) = 7`.

As Section 10 puts it, SARSA learns "the value of what I actually do" while Q-learning learns "the value of the best thing I could do next", which is why, under suitable conditions, Q-learning converges to the optimal Q-function even while the agent keeps exploring. The same example is Section 10's Exercise 3.3.

**Setting ε**: Lecture 22 calls ε-greedy the simplest exploration method but notes it is not very effective at finding action sequences whose reward comes far in the future. A common schedule decays ε over time: start at 1 (pure random exploration) and end at 0 or 0.01.

## Things worth checking when you write `Learner`

These are details noticed while reading the starter code and worth verifying yourself; they are not official guidance:

- **Updates lag by one step**: when `action_callback` is called you receive the *new* state, while `reward_callback` delivered the reward for the previous action. So you update `Q[last_action][last_state]`, using the new state in the target. `GravityLearner` shows one way to do it.
- **The final step of a game**: in `SwingyMonkeyNoAnimation.py`, on hitting a trunk or leaving the screen the game calls `reward_callback` with the penalty and then calls `action_callback` once more. That gives you a chance to fold the last penalty into the Q table.
- **You must add `reset()`**: `run_games` calls `learner.reset()` after every game, but the `Learner` template has no such method. Follow `RandomJumper` and set `last_state`, `last_action`, and `last_reward` back to `None`, then handle "there is no previous step" on the first step of the next game.
- **Negative grid indices**: when the top of the monkey is above the top of the trunk gap, `rel_y` is negative. NumPy doesn't raise on negative indices; it counts from the end of the array, which can make two completely different states share one cell.
- **The last code cell**: `agent = RandomJumper()`, `agent = Learner()`, and `agent = GravityLearner()` are all uncommented, so running it as-is runs `GravityLearner`, the last assignment.
- **Scores are noisy**: gravity, trunk positions, and jump heights are all random, and the code sets no random seed. When comparing parameters, several runs per setting are more reliable than one.
- **Watching the animation**: the default import is the animation-free `SwingyMonkeyNoAnimation`, which is much faster; import `p3src.SwingyMonkey` to see the game. The environment needs `pygame`, pinned at 2.6.1 in [`requirements.txt`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/requirements.txt). The problem also links a [video of the staff Q-learner](https://youtu.be/xRD6xBQbauw).

## The limit of tables

[Lecture 23](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view) then explains why tabular methods break down: if the state is a camera image, the number of possible states exceeds the number of atoms in the universe. The fixes are approximating Q with a neural network (DQN, with experience replay and a target network) or optimizing the policy directly (policy gradients, actor-critic). Swingy Monkey works with a table only because you've already chopped continuous pixel distances into a handful of bins. When the problem suggests "changing the features in the state space", you are choosing a point on that trade-off: finer bins can express more, but each bin is visited less often, so learning is slower.

## Problem 5: Embedded Ethics (10 pts)

You answer in **at most 250 words**: social media platforms like Facebook, TikTok, and X make extensive use of reinforcement learning, and many scholars argue these platforms have contributed to political polarization, where users with a particular political leaning develop more extreme views over time. Assuming a platform's users do become more extreme, use what you've learned about RL to propose a possible explanation of how the platform's chosen reward function may have contributed. The answer should show careful thought about the socio-technical context but need not be comprehensive.

The prompt opens by referring to a class session on "Fairness in Model Selection". No lecture by that name appears on the 2026 schedule; the only ethics session is April 23's "Embedded EthiCS – see recording", but the public schedule HTML checked here does not provide an openable recording link; this does not establish that the recording does not exist or must be private.

**Official material you can build a framework from** (course RL concepts, not an answer to this question):

- **Reward is a proxy**: what a platform really cares about is revenue or long-term use; what it can measure is clicks, dwell time, and comments. The 2024 term's [Lecture 21 scribe notes](https://harvard-ml-courses.github.io/cs181-web/static/lec21/21-scribe-notes.pdf) have a section, "Reward Design: Story in the World", on exactly this: dwell time and comment counts get used as signals of engaging content, yet people often linger on traumatic or extreme posts and comment more on controversial ones, so more divisive posts get promoted. Those are 2024 notes and don't show that the 2026 class used the same example.
- **Policies shape the state distribution**: in discussing agent–environment interaction, Section 10 notes that policy choices shape the distribution of future states and rewards. In a recommender, the user's preferences are part of the state, and the recommendation itself changes them.
- **Discounting and long-term goals**: γ sets how much the agent cares about distant rewards. A system whose reward counts only immediate engagement and one that accounts for a user's long-term wellbeing may learn very different policies.
- **Exploration versus exploitation**: always exploiting "whatever currently seems to hold your attention best" means never trying anything else.

In the [Embedded EthiCS @ Harvard](https://embeddedethics.seas.harvard.edu/cs-181-spring-2023/) module repository, the CS 181 module pages run through Spring 2023 (topic: bias in machine learning design, built around racial bias in a healthcare algorithm). That module is from an earlier term and a different topic from 2026's RL-and-polarization question; treat it only as a sense of the program's style.

## Further reading

Posts on this site that approach the same ideas from another angle; they don't replace this one:

- [CS221 Lecture 8: MDPs II: Learning Q-Values Without a Transition Model](/en/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en)
- [CS188 MDPs and Reinforcement Learning: From Value Iteration to Q-Learning](/en/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning-en)
- [CMU 07-280 Lecture 22: Q-learning When Dynamics Are Unknown](/en/posts/ai/2026-08-22-cmu-07280-lecture-22-reinforcement-learning-en)
- [Deep Reinforcement Learning: Putting RLHF Back in the RL Framework](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf) (CS230, picks up Lecture 23's deep RL; zh-TW only)

## Next

HW6 is the last homework. The next part, [Final Checkpoint and Series Wrap-up](/en/posts/tech/2026-09-29-harvard-cs181-final-checkpoint-en), uses the official final checklist and practice problems to consolidate the second half of the term.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS1810 Spring 2026 HW6 problem set (hw6_release.tex)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)
- [CS1810 Spring 2026 HW6 notebook (hw6_release.ipynb)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.ipynb)
- [HW6 Swingy Monkey game code (p3src/)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6/p3src)
- [CS1810 2026 official schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS1810 2026 Lecture 22: Reinforcement Learning 1 slides](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view)
- [CS1810 2026 Lecture 23: Reinforcement Learning 2 slides](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view)
- [Section 10: Markov Decision Processes and Reinforcement Learning](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf) ([solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf))
- [CS181 2024 Lecture 21 scribe notes (Reward Design)](https://harvard-ml-courses.github.io/cs181-web/static/lec21/21-scribe-notes.pdf)
- [Embedded EthiCS @ Harvard: CS 181 Spring 2023 module](https://embeddedethics.seas.harvard.edu/cs-181-spring-2023/)
- [Sutton & Barto, 2018. Reinforcement Learning: An Introduction (2nd ed.)](http://incompleteideas.net/book/RLbook2020.pdf) (listed on the course [Resources page](https://harvard-ml-courses.github.io/cs181-web/resources))
