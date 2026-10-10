---
title: "Reading CS234, Part 16: Planning Plus Learning: MCTS, UCT, and AlphaGo/AlphaZero"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mcts, alphazero]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 16
tldr: "Until now, CS234 has computed one policy for the whole state space. Lectures 13 and 14 ask a different question: if I only care about the move in front of me, can extra local computation make that one decision better? The path runs from simple Monte Carlo search through the expectimax tree to MCTS, and treating each tree node as a bandit gives UCT. AlphaZero ties MCTS to a single network that predicts both policy and value, and self-play pushes both forward. The slides borrow figures from Silver et al. 2017 to answer three questions: how much architecture matters, how much MCTS adds, and whether human data is needed."
description: "A guide to Lectures 13–14, \"Monte Carlo Tree Search,\" of Stanford CS234 Reinforcement Learning (Winter 2026): planning only for the current state, simple MC search, the expectimax tree and its (|S||A|)^H cost, MCTS, UCT, AlphaZero's PUCT move selection and self-play, the policy/value network, and the architecture, MCTS, and human-data ablation figures. Mapped to 2024 public video 14, \"Multi-Agent Game Playing.\""
draft: false
glossary:
  - term: "MCTS (Monte Carlo Tree Search)"
    definition: "Build a search tree rooted at the current state, run K simulated episodes with a model to expand the tree and update its value estimates, then pick the root action with the highest value. It only needs samples from the model, not a solution to the whole MDP."
    context: "CS234 L13–L14; the search backbone of AlphaGo and AlphaZero."
  - term: "UCT (Upper Confidence Tree)"
    aliases: ["Upper Confidence bounds applied to Trees"]
    definition: "An MCTS action-selection rule: treat each node where you choose an action as a multi-armed bandit, add a UCB-style confidence bonus to each action's mean return, and simulate the action with the highest upper bound."
    context: "CS234 L13 presents it as where bandits (part 13) meet planning."
  - term: "expectimax tree"
    definition: "A forward search tree rooted at the current state that alternates action nodes (take the max) and transition nodes (take the expectation). It computes the exact optimal Q values at the current state, but its size is (|S||A|)^H."
    context: "CS234 L13 uses it to motivate the sampled version, MCTS."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-mcts-alphazero)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 version.** It is part 16 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series.

**Series**: previous [Data efficiency III: PAC for MDPs, MBIE-EB, PSRL, strategic exploration](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration-en) | next [Value alignment: aligned to whom, aligned to what](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

Official materials used: the [Lecture 13 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture13post.pdf) (13 pages, simulation-based search only) and the [Lecture 14 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) (30 pages, AlphaZero). Both are titled "Monte Carlo Tree Search," and the lecture materials page files them under "Monte Carlo Tree Search and Conquering Go." For listening, the matching video is [video 14, "Multi-Agent Game Playing"](https://www.youtube.com/watch?v=UgANzoWc0nc) in the [public 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Its YouTube chapters line up with the 2026 slides; see the section on the 2024 video below.

Access grade **A3 (enough to self-study)**, as defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): both decks are public. The gap is that 2026 recordings are on Canvas only. The decks' Class Structure slides also show that in 2026 MCTS shared its sessions with guest lectures (Lecture 13 with Shane Gu's world-models talk, Lecture 14 with part 2 of the ethics and society guest lecture), which is why both PDFs are shorter than usual.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=UgANzoWc0nc
title: Stanford CS234 Spring 2024 video 14, "Multi-Agent Game Playing"
```

```youtube
url: https://www.youtube.com/watch?v=FOlPpjNbHjE
title: the first 15 minutes of video 15
```

Original videos: [Stanford CS234 Spring 2024 video 14, "Multi-Agent Game Playing"](https://www.youtube.com/watch?v=UgANzoWc0nc)、[the first 15 minutes of video 15](https://www.youtube.com/watch?v=FOlPpjNbHjE)

Course and recording entries:

- [public 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

The Winter 2026 official Lecture Materials page lists slides only and no recordings; the public YouTube playlist is Spring 2024. Checked: 2026-10-10.

## A different question: plan only for this move

Slide 5 of Lecture 13 states the turn in one line. So far the course has computed a policy for the **whole state space**. The key idea now: use extra **local computation** to make a better decision **right now**.

The difference is where the effort goes. Value iteration backs up every state; DQN wants one network that's accurate everywhere. In a board game you only need to know how to play this position in this game. Concentrating compute around the current state is the starting point for the whole MCTS family.

The slides open with AlphaZero: it played a big part in one of the greatest AI achievements of the past decade, becoming a better Go player than any human, and it combines several interesting ideas.

## Three steps to MCTS

### Step one: simple Monte Carlo search

Given a model $M_v$ and a simulation policy $\pi$:

1. For each action $a$, simulate $K$ episodes starting from the current real state $s_t$
2. Estimate $Q(s_t, a) = \frac{1}{K}\sum_k G_t^k$ by mean return; this approaches $q_\pi(s_t, a)$
3. Pick $\arg\max_a Q(s_t, a)$

The slides' verdict: this is essentially **one step of policy improvement**. It beats $\pi$ by only one step, because after the first action it just follows $\pi$.

### Step two: the expectimax tree

Can we do better than one step of policy improvement? With an MDP model, build an expectimax tree rooted at $s_t$: take the max at action nodes and the expectation at transition nodes, looking ahead as far as you can. This gives the **optimal** $Q(s,a)$ at the current state, and you only solve the sub-MDP starting now, not the whole MDP.

The cost: the tree has $(|S||A|)^H$ nodes, exponential in the horizon $H$.

### Step three: MCTS

MCTS replaces full expansion with **sampling**:

- Build the tree rooted at the current state $s_t$
- Sample actions and next states instead of expanding all of them
- Run $K$ simulated episodes from the root, expanding and updating the tree after each
- When the search ends, pick $\arg\max_a Q(s_t, a)$ in the real world

One question is left: how do you choose actions inside the tree during a simulation?

## UCT: every node is a bandit

UCT borrows from the bandit literature. Each node $i$ where you choose an action is a multi-armed bandit, and each action is an arm:

$$
Q(s, a, i) = \frac{1}{N(i,a)} \sum_{k=1}^{N(i,a)} G_k(i,a) + c\sqrt{\frac{O(\log N(i))}{N(i,a)}}
$$

- $N(i,a)$: how many times arm $a$ was chosen at node $i$
- $G_k(i,a)$: the discounted return after the $k$-th time $a$ was chosen at node $i$
- On simulated episode $k$, node $i$ picks the action with the highest upper bound and uses it to expand or evaluate the tree

The first term is the mean; the second is the UCB confidence width from [part 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en). The slides flag one consequence: the simulation policy changes from episode to episode, because counts and means change after every run.

Lecture 13 ends with the advantages of MCTS: highly selective best-first search, dynamic evaluation of states, sampling to break the curse of dimensionality, it works with "black-box" models that only give samples, and it's computationally efficient, anytime, and parallelizable.

### A question worth pausing on

An optional Check Your Understanding slide in Lecture 14 asks why UCT is slightly strange. The hint: UCB was a good idea because it balances exploration and exploitation. Is there really an exploration/exploitation trade-off during **simulated** episodes?

The next slide's quiz answers: "this may be useful because it prioritizes actions that lead to good later rewards" is True. "UCB minimizes regret, so UCT minimizes regret within the tree's rollouts" is also True, but the slide asks you to think about whether that's a good idea. Mistakes in simulation cost nothing real. What you want is to pick the right real move after searching, not to collect the most return during the search. The slides link this to metalevel reasoning and cite Hay, Russell, Tolpin & Shimony (2012), "Selecting Computations: Theory and Applications."

Another quiz asks which MDPs suit MCTS. The answer is F, F, T:

| Setting | Good fit for MCTS? |
|---|---|
| Short horizon, few states and actions | No (just solve it) |
| Long horizon, large action space, small state space | No |
| Long horizon, large state space, small action space | Yes |

The reason goes back to the design: MCTS handles many next states by sampling, but every node still keeps statistics for every action.

## AlphaZero: search and network pushing each other

### Why Go is hard

Lecture 14's case study slide: Go is 2,500 years old, the hardest classic board game, a grand challenge task (John McCarthy), and traditional game-tree search failed on it. The slide asks whether playing Go involves learning to decide in a world where the dynamics and reward model are unknown, and doesn't answer on that page.

### Choosing one move

Using figures from [Silver et al. (Nature 2017), "Mastering the game of Go without human knowledge"](https://www.nature.com/articles/nature24270), the slides walk through choosing one move in a single game. It's inspired by UCT but changes a lot, and selection uses PUCT:

1. **Start at the root**: select actions with PUCT on the way down
2. **Expand repeatedly** until reaching a leaf
3. **Use the network's action probabilities** when selecting moves
4. **At the leaf, plug in the network's value prediction** instead of rolling out to the end of the game
5. **Update ancestors** by backing the value up
6. **Repeat many times**, then compute the root policy from visit counts, $\pi(s) \propto N(s,a)^{1/\tau}$

The slides point out that inside the network the opponent and the agent take turns "maximizing" value, so the tree mimics a min-max tree.

### Self-play

After choosing a move, play it according to the root policy, then run the whole search again from the new position until the game ends and you see a win or a loss. The slides list two advantages of self-play:

- The only bottleneck is computation; no humans are needed
- The opponent is always evenly matched

The quiz asks how this helps policy training and what the reward density is. Answer: because both sides are evenly matched, rewards are fairly dense, which gives a form of curriculum learning.

Then the network is trained to predict policies and values. The paper's abstract puts it this way: the network learns to predict AlphaGo's own move choices and the winners of its own games. A stronger network makes the tree search stronger, and a stronger search makes the next round of self-play better.

The slides sum up AlphaGo/AlphaZero in six phrases: self play, strategic computation, highly selective best-first search, power of averaging, local computation, and learn and update heuristics.

## Three evaluation questions

The slides pose three questions and answer each with a figure from the paper. The numbers below are approximate, read by eye from the bar charts and curves on the slides; see the paper for exact values.

**How much does architecture matter?** The figure compares four networks: policy and value share one network (dual) or are separate (sep), and the trunk is residual (res) or plain convolutional (conv). dual-res has the highest Elo (above roughly 4,300), sep-conv the lowest (about 3,100), and the other two sit in between. Each change helps on its own; together they help most.

**How much does MCTS add?** On that chart, the "Raw network" with no search sits around 3,000 Elo; AlphaGo Zero with MCTS is around 5,200, above AlphaGo Master, AlphaGo Lee, AlphaGo Fan, and the programs Crazy Stone, Pachi, and GnuGo. Search alone accounts for a large share of the gap.

**Is human data needed?** The "Overall performance" and "Need for Human Data?" slides show the same curve. The 40-block AlphaGo Zero starts from scratch, passes AlphaGo Lee's level within a few days, and over 40 days of training catches and passes AlphaGo Master. The abstract states the conclusion: with no human data, starting from the rules alone, AlphaGo Zero beat the earlier champion-defeating AlphaGo 100–0.

## Beyond Go

Lecture 14's last content slide says these ideas are useful beyond Go: chess, shogi, and other games; discovering faster matrix multiplication (AlphaTensor); and discovering faster sorting algorithms (AlphaDev). In the slide's words, RL can vastly speed up problems you can represent as (extremely large) search problems.

A final refresher quiz ties together the second half of the course:

- Upper confidence bounds balance exploration with using acquired information to earn high reward: True
- These algorithms work in bandits and MDPs: True
- If the reward model is known, UCB-style algorithms give no benefit: it depends. In bandits, no extra gain; in RL, if the dynamics model is unknown, there is still a gain

## How the 2024 video maps

Video 14 of 2024 is titled "Multi-Agent Game Playing," and its YouTube chapters show it covers exactly 2026's L13–L14: [from 7:47](https://www.youtube.com/watch?v=UgANzoWc0nc&t=467s), simulation-based search and expectimax trees; [19:00](https://www.youtube.com/watch?v=UgANzoWc0nc&t=1140s), MCTS, then UCT at 24:45; [from 35:10](https://www.youtube.com/watch?v=UgANzoWc0nc&t=2110s), AlphaGo, the rules of Go, self-play, and the neural networks. The AlphaZero wrap-up is in [the first 15 minutes of video 15](https://www.youtube.com/watch?v=FOlPpjNbHjE) (5:13, "AlphaZero mechanism review"; 8:55, "AlphaZero technical details").

## How to self-study this

1. Make sure you can write the UCB formula from [part 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en). UCT just puts it in every tree node.
2. Put simple MC search, expectimax, and MCTS in one table with columns for "what model it needs," "what it computes," and "cost."
3. As you read AlphaZero's six-step flow, ask at each step: search, network, or both?
4. Finally, work out UCT's "strangeness": why minimizing regret during simulation isn't necessarily the best search objective.

One thing to try tonight: write MCTS for tic-tac-toe, with UCT for selection and random rollouts to evaluate leaves. After a few hundred simulations per move, check whether it plays to at least a draw, then raise and lower $c$ and watch how the tree's shape changes.

## Further reading

- Another course that goes from MDPs and Q-learning to AlphaZero: [CMU 07-280 Stage Review III: From MDPs and Q-learning to AlphaZero](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero-en)
- Other uses of planning and models in deep RL: [CS224R L11: Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en)
- The world-models guest lecture later in this series: [Guest lecture: Shane Gu, "World of World Modeling"](/posts/ai/2026-09-30-cs234-guest-world-models-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.

## References

- [CS234 Lecture 13 slides (Winter 2026, post-class)](https://web.stanford.edu/class/cs234/slides/lecture13post.pdf) — simulation-based search, expectimax, MCTS, UCT
- [CS234 Lecture 14 slides (Winter 2026, post-class)](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) — Go case study, PUCT move selection, self-play, the three evaluation questions, quizzes
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — "Monte Carlo Tree Search and Conquering Go" unit
- [CS234 course home page (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule: Week 8, "RL and MCTS"
- [Stanford CS234 Spring 2024 video 14, "Multi-Agent Game Playing"](https://www.youtube.com/watch?v=UgANzoWc0nc) — public recording; chapters cover MCTS, UCT, and AlphaGo
- [Silver et al., Mastering the game of Go without human knowledge (Nature 2017)](https://www.nature.com/articles/nature24270) — source of every AlphaZero figure in the slides; the 100–0 result in the abstract
