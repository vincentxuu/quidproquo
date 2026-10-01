---
title: "Reading CS234, Part 15: Data Efficiency III: PAC for MDPs, MBIE-EB, PSRL, and Strategic Exploration"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 15
tldr: "The previous two posts covered UCB and Thompson sampling, which only handle one-step decisions. CS234 Lecture 12 carries the same two ideas into MDPs, where states matter. First it swaps the yardstick: PAC bounds the number of steps where you act badly, not total regret. Then it covers the optimistic approach (MBIE-EB: counts plus an exploration bonus) and the sampling approach (PSRL: draw one MDP per episode and solve it). When states are too many to count, the bonus moves into the Q-learning target, which is what beat ε-greedy DQN on Montezuma's Revenge. The last section asks whether exploration itself can be learned; one answer is the Decision-Pretrained Transformer."
description: "A guide to Lecture 12, \"Fast RL Continued,\" of Stanford CS234 Reinforcement Learning (Winter 2026): the PAC definition, MBIE-EB and the simulation lemma, Bayesian model-based RL and PSRL, linear contextual bandits, count-based bonuses in deep RL and Montezuma's Revenge, Bootstrapped DQN, and learning to explore with the Decision-Pretrained Transformer. Mapped to 2024 public video 13, \"Exploration 3.\""
draft: false
glossary:
  - term: "PAC (probably approximately correct)"
    aliases: ["PAC RL"]
    definition: "A criterion for RL algorithms: with probability at least 1 − δ, the action chosen is ε-optimal on all but a polynomial number of time steps. Polynomial in |S|, |A|, 1/(1 − γ), 1/ε, and 1/δ."
    context: "CS234 L12 contrasts it with regret: regret measures total loss, PAC counts the non-small mistakes."
  - term: "MBIE-EB"
    aliases: ["Model-Based Interval Estimation with Exploration Bonus"]
    definition: "A tabular model-based algorithm by Strehl & Littman (2008): estimate transitions and rewards from counts, add an exploration bonus proportional to 1/√n(s,a) inside the Bellman backup, and act greedily on the resulting optimistic Q."
    context: "The PAC RL example algorithm in CS234 L12."
  - term: "PSRL"
    aliases: ["Posterior Sampling for Reinforcement Learning"]
    definition: "Thompson sampling for MDPs: at the start of each episode, sample one MDP from the posterior over transitions and rewards, solve it, follow its optimal policy for the episode, then update the posterior."
    context: "Osband, Russo & Van Roy (NeurIPS 2013); the Bayesian MDP section of CS234 L12."
    links:
      - label: "Osband et al. 2013"
        url: "https://arxiv.org/abs/1306.0940"
  - term: "simulation lemma"
    definition: "Bounds how far values computed under an imperfect model can drift from the true values: if reward error is at most ε_R and the L1 error of the transition distributions is at most ε_T, the value gap for a fixed policy is at most (ε_R + γ V_max ε_T)/(1 − γ)."
    context: "CS234 L12 calls it one of the key ideas behind MBIE-EB being PAC."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 version.** It is part 15 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series.

**Series**: previous [Data efficiency II: Bayesian bandits, Thompson sampling, Gittins, PAC](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits-en) | next [Planning plus learning: MCTS, UCT, AlphaGo/AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

Official materials used: the [Lecture 12 slides (post-class version), "Fast RL Continued"](https://web.stanford.edu/class/cs234/slides/lecture12post.pdf). The PDF has 54 pages; the slides number themselves up to 52, with two extra pages of Decision-Pretrained Transformer figures. For listening, the matching video is [video 13, "Exploration 3"](https://www.youtube.com/watch?v=pc7oayCSZmQ) in the [public 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Per its YouTube chapters, it covers MBIE-EB, PAC analysis, the simulation lemma, Bayesian MDPs and PSRL, concurrent RL, and seed sampling.

Access grade **A3 (enough to self-study)**, as defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): the slides are public. The gaps: 2026 recordings are on Canvas only, and the Winter 2023 problem session PDFs the simulation lemma slide cites (`sessions/CS234_Win23_ProblemSession2.pdf` and its solutions) both returned 404 when I checked on 2026-09-30.

## What this lecture is for

UCB in [part 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) and Thompson sampling in the [previous post](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits-en) only handle bandits: each decision stands alone. MDPs add a harder problem. Where you go today decides what data you see tomorrow. Lecture 12's "Check Your Understanding" turns this into a wrong answer: "exploration doesn't really matter in MDPs because the data distribution is independent of the policy." The answer is False.

The slides organize the whole "Fast RL" unit into three layers:

| Layer | Contents |
|---|---|
| Settings | bandits (single decisions), MDPs |
| Frameworks (evaluation criteria) | empirical performance, asymptotic convergence, regret; this lecture adds **PAC** |
| Approaches (algorithm families) | greedy, ε-greedy, optimism, Thompson sampling |

The lecture's thread: both bandit ideas, optimism and sampling, have MDP counterparts, and both fit a new yardstick.

## A new yardstick: PAC

A regret bound tells you how total loss grows with time T. The slides point out what it hides: the same regret can come from many small mistakes or a few big ones. If you care about the number of non-small mistakes, use PAC (probably approximately correct).

A PAC algorithm must:

- pick an ε-optimal action $a$ on each step, meaning $Q(a) \ge Q(a^*) - \epsilon$
- do so with probability at least $1 - \delta$
- fail on at most a **polynomial** number of steps, polynomial in $|S|$, $|A|$, $1/(1-\gamma)$, $1/\epsilon$, and $1/\delta$

One in-class question tests the last condition: if the guarantee says the number of bad steps is below an **exponential** function, is that PAC? No. It has to be polynomial.

The slides also note that most PAC algorithms build on optimism or Thompson sampling, and some optimistic ones simply initialize every value to a high, problem-specific number.

## The optimistic approach: MBIE-EB

The first MDP algorithm is MBIE-EB from [Strehl & Littman (2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767). That paper is also where the RiverSwim environment of [Assignment 1](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) comes from. The algorithm has four steps:

1. **Count**: track how often each $(s,a)$ was tried, $n(s,a)$, and how often each $(s,a,s')$ occurred
2. **Estimate the model**: use the average reward as $\hat{R}(s,a)$ and $n(s,a,s')/n(s,a)$ as $\hat{T}(s' \mid s,a)$
3. **Optimistic Bellman backup**: iterate until convergence

$$
\tilde{Q}(s,a) = \hat{R}(s,a) + \gamma \sum_{s'} \hat{T}(s' \mid s,a) \max_{a'} \tilde{Q}(s',a') + \frac{\beta}{\sqrt{n(s,a)}}
$$

4. **Act**: take the argmax of $\tilde{Q}$

Details worth noticing:

- Every $\tilde{Q}$ starts at $1/(1-\gamma)$, the largest possible value when rewards lie in $[0,1]$, so every action looks best at first
- The bonus $\beta/\sqrt{n(s,a)}$ has the same shape as a UCB confidence width: fewer tries, bigger bonus
- $\beta = \frac{1}{1-\gamma}\sqrt{0.5 \ln(2|S||A|m/\delta)}$, where $m$ is an input parameter
- Each step re-solves an (approximate) MDP, which costs far more than a Q-learning update

The slides then state "MBIE-EB is a PAC RL Algorithm" without a full proof in class, and pick out one key tool.

### The simulation lemma: a slightly wrong model, how wrong a value?

MBIE-EB works with an estimated model, not the true one. To argue its decisions are good, you first need to know how much value error a small model error causes. That is the simulation lemma.

For a fixed policy, if two models' rewards differ by at most $\epsilon_R$ (infinity norm) and their transition distributions differ by at most $\epsilon_T$ (L1 norm), then:

$$
\max_s |V_1^\pi(s) - V_2^\pi(s)| \le \frac{\epsilon_R + \gamma V_{\max} \epsilon_T}{1 - \gamma}
$$

<details>
<summary>Proof sketch (slide 16)</summary>

Let $\Delta = \max_s |V_1^\pi(s) - V_2^\pi(s)|$. Expand $|Q_1^\pi(s,a) - Q_2^\pi(s,a)|$:

- the reward difference contributes at most $\epsilon_R$
- add and subtract a term in the transition part, splitting it into $\sum_{s'} T_1(s' \mid s,a)(V_1^\pi(s') - V_2^\pi(s'))$ and $\sum_{s'} (T_1 - T_2)(s' \mid s,a) V_2^\pi(s')$
- the first is at most $\gamma\Delta$, the second at most $\gamma V_{\max} \epsilon_T$

So $\Delta \le \epsilon_R + \gamma\Delta + \gamma V_{\max}\epsilon_T$, and rearranging gives $(1-\gamma)\Delta \le \epsilon_R + \gamma V_{\max}\epsilon_T$.

It's the same move as [Assignment 1 Q3](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en): insert a zero term, apply the triangle inequality, move the shared quantity to the left.

</details>

The bound connects estimating the model to making decisions: once every frequently visited $(s,a)$ has been tried enough, model error is small, value error is small, and the chosen action is near optimal.

## The sampling approach: Bayesian model-based RL and PSRL

The slides first review Bernoulli bandits. The Beta distribution is conjugate to the Bernoulli; after observing $r \in \{0,1\}$, the posterior moves from $\text{Beta}(\alpha, \beta)$ to $\text{Beta}(r + \alpha, 1 - r + \beta)$. Thompson sampling draws parameters from the posterior each round and acts greedily on the draw.

In an MDP, the posterior covers the whole model: the joint posterior $p[P, R \mid h_t]$ over transitions and rewards. Thompson sampling for MDPs goes:

1. Update $p[P, R \mid h_t]$ with Bayes' rule
2. Sample one MDP from the posterior
3. Solve it with your favorite planner (for example value iteration from [part 2](/posts/ai/2026-09-30-cs234-mdp-planning-en)) to get $Q^*$
4. In the real state, pick $\arg\max_a Q^*(s_t, a)$

[PSRL (Osband, Russo & Van Roy, NeurIPS 2013)](https://arxiv.org/abs/1306.0940) samples once per episode. At the start of each episode it samples a transition model and a reward model for every $(s,a)$, solves that MDP for $Q^*_M$, follows it for $H$ steps, then updates the posterior.

The in-class quiz on PSRL asks three things, and the answers sum up its character:

| Statement | Answer | Why |
|---|---|---|
| Sampling only rewards and using empirical averages for dynamics performs the same | False | Uncertainty in the dynamics has to be sampled too, or you lose half the exploration |
| It can re-plan every time the posterior updates | True for the algorithm shown | Other variants are possible |
| Its per-step compute always matches Q-learning | False | It solves a sampled MDP each time |

The slides also mention seed sampling and concurrent PSRL by Dimakopoulou & Van Roy (ICML 2018), giving only authors, venue, and a demo video. The paper itself ([Coordinated Exploration in Concurrent Reinforcement Learning](https://arxiv.org/abs/1802.01282)) is about coordinating exploration when several agents learn at the same time in a shared environment.

## Too many states to count: generalization plus exploration

MBIE-EB and PSRL are tabular. The slides are frank: combining generalization with strategic exploration is still an active research area, but most methods rest on the same two principles, optimism and Thompson sampling.

### Bandits first: linear contextual bandits

A contextual bandit adds a context (state) $s$, so the reward distribution becomes $R_{a,s}(r) = P[r \mid a, s]$. With many states or actions, a linear model is common:

$$
r = \theta^\top \phi(s, a) + \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, \sigma^2)
$$

The disjoint linear model gives each arm its own parameter $\theta_a$: $r(s,a) = \theta_a^\top \phi(s) + \varepsilon$. The slides leave a question: can the shared-$\theta$ form represent the disjoint one? (Hint: think about how you design $\phi(s,a)$.)

Earlier we drew a Hoeffding confidence interval around a scalar reward. Now we need an uncertainty set around the vector $\theta$. The slides say this can be done tractably and point to [Li et al.'s news recommendation paper (WWW 2010)](https://arxiv.org/abs/1003.0146) and chapter 19 of [Lattimore & Szepesvári, *Bandit Algorithms*](https://tor-lattimore.com/downloads/book/book.pdf). They show the book's Figure 19.1: as the number of arms $k$ grows, regret for a contextual method that generalizes grows more slowly.

### Then MDPs: swap counts for a bonus

MBIE-EB's bonus depends on counts $n(s,a)$. In continuous or huge state spaces you'll see most states once, so counts stop helping.

The slides go back to Q-learning with function approximation from [part 5](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en) and add a term to the TD target:

$$
\Delta w = \alpha \left( r(s) + r_{\text{bonus}}(s,a) + \gamma \max_{a'} \hat{Q}(s', a'; w) - \hat{Q}(s,a;w) \right) \nabla_w \hat{Q}(s,a;w)
$$

$r_{\text{bonus}}$ should reflect how uncertain future reward from $(s,a)$ still is. The slides list deep RL methods that estimate visit counts or visit densities: Bellemare et al. (NIPS 2016), Ostrovski et al. (ICML 2017), and Tang et al. (NIPS 2017). One implementation trap to remember: the bonus is computed at visit time and can go stale in a replay buffer.

The showcase is Montezuma's Revenge. The slides use a figure from [Bellemare et al., "Unifying Count-Based Exploration and Intrinsic Motivation"](https://arxiv.org/abs/1606.01868), with a one-line verdict: enormously better than standard DQN with ε-greedy.

### Scaling up the sampling approach

The Bayesian view has inspired several methods. The slides list them in order:

| Method | Idea | The slides' verdict |
|---|---|---|
| Mandel, Liu, Brunskill, Popović (IJCAI 2016) | Thompson sampling over both representation and parameters | — |
| [Bootstrapped DQN (Osband et al., NIPS 2016)](https://arxiv.org/abs/1602.04621) | Train C DQN agents on bootstrapped samples; act on the highest Q value across the C agents | Some gain, less effective than reward bonuses |
| [Bayesian DQN (Azizzadenesheli & Anandkumar, 2017)](https://arxiv.org/abs/1802.04412) | Bayesian linear regression on the last layer of a deep network, optimistic with respect to that posterior | Very simple; empirically much better than plain last-layer linear regression or Bootstrapped DQN, but sometimes worse than reward bonuses |

The slides name the hard part: a model-free version wants to sample from a posterior over possible $Q^*$, and that isn't easy.

## Can exploration itself be learned?

The last section changes angle. Often what we really want is an agent that learns across many tasks. Can an agent **learn how to explore**? The slides give two examples: DREAM (Liu et al.) and the [Decision-Pretrained Transformer (Lee, Xie et al., NeurIPS 2023)](https://arxiv.org/abs/2306.14892), which Brunskill co-authored.

The two DPT pages boil down to one idea: training a model to predict the optimal action $a^*$ makes it behave like Thompson sampling, but it can capture a much richer set of priors. The figure's headline says it can learn and use (unknown) task structure to speed up exploration a lot. This ties straight back to the previous post. TS uses a prior you write by hand, like a Beta distribution; DPT's "prior" is learned from pretraining data across many tasks.

## Where the theory stands

The last two content slides are a map for readers who want to go deeper:

- **Tabular MDPs**: minimax regret and PAC results that are tight in the dominant term now exist, for example Azar, Osband & Munos (ICML 2017, regret) and Dann, Li, Wei & Brunskill (ICML 2019, PAC). There are also instance-dependent bounds, such as Zanette & Brunskill (ICML 2019) and Simchowitz & Jamieson (NeurIPS 2019)
- **Function approximation**: still active. The slides cite Jin, Yang, Wang & Jordan (COLT 2020) on linear function approximation. A separate line of work measures what makes a problem hard, for example eluder dimension (Russo & Van Roy) and Bellman rank (Jiang et al.)

## What you should know after this unit

The slide "Summary: What You Are Expected to Know" is the checklist for the whole Fast RL unit (parts 13–15):

1. Explain the exploration-exploitation tension and why it doesn't arise in supervised or unsupervised learning
2. Define and compare criteria for "good" performance: empirical, convergence, asymptotic, regret, PAC
3. Map the algorithms covered in detail to the criteria they satisfy
4. Understand the UCB proof sketch
5. For students doing the default project: implement UCB and TS for a linear contextual bandit

As of 2026-09-30 the project page showed no public details of the default project, so outside readers can treat item 5 as a self-set exercise.

## How to self-study this

1. Before reading this lecture, make sure you can state UCB and TS from parts 13 and 14 in one sentence each. Every algorithm here is an MDP version of one of them.
2. Write MBIE-EB's four steps next to UCB on one sheet: counts for counts, $\beta/\sqrt{n}$ for the confidence width, "greedy on $\tilde{Q}$" for "greedy on the upper bound."
3. Derive the simulation lemma yourself. It's shorter than Assignment 1 Q3 but uses the same moves.
4. When you reach "generalization plus exploration," ask of each method: optimistic or sampling?

One thing to try tonight: take `riverswim.py` from Assignment 1, wrap a counter around value iteration, add $\beta/\sqrt{n(s,a)}$ to the backup, and see whether the agent reaches the upstream end sooner than with ε-greedy. That's a minimal MBIE-EB.

## Further reading

- How another deep RL course covers exploration and RL theory: [Berkeley CS285 L19–25: Exploration, RL Theory, Multitask Learning, and Open Problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- Learning to explore in the meta-RL setting: [CS224R L13: Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en)

## References

- [CS234 Lecture 12 slides (Winter 2026, post-class), "Fast RL Continued"](https://web.stanford.edu/class/cs234/slides/lecture12post.pdf) — source for every algorithm, quiz answer, and citation list in this post
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — Data Efficient RL unit (L9–L12) and the additional reading, Bandit Algorithms §7.1
- [CS234 course home page (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule: Weeks 7–8 are Exploration
- [CS234 project page](https://web.stanford.edu/class/cs234/project.html) — project specification
- [Stanford CS234 Spring 2024 video 13, "Exploration 3"](https://www.youtube.com/watch?v=pc7oayCSZmQ) — public recording; chapters cover MBIE-EB and PSRL
- [Strehl & Littman, An analysis of model-based Interval Estimation for Markov Decision Processes (JCSS 2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767) — MBIE-EB
- [Osband, Russo & Van Roy, (More) Efficient Reinforcement Learning via Posterior Sampling (NeurIPS 2013)](https://arxiv.org/abs/1306.0940) — PSRL
- [Dimakopoulou & Van Roy, Coordinated Exploration in Concurrent Reinforcement Learning (ICML 2018)](https://arxiv.org/abs/1802.01282) — seed sampling
- [Li et al., A Contextual-Bandit Approach to Personalized News Article Recommendation (WWW 2010)](https://arxiv.org/abs/1003.0146) — linear contextual bandits
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — chapter 19, linear bandits
- [Bellemare et al., Unifying Count-Based Exploration and Intrinsic Motivation (NIPS 2016)](https://arxiv.org/abs/1606.01868) — count-based bonus on Montezuma's Revenge
- [Osband et al., Deep Exploration via Bootstrapped DQN (NIPS 2016)](https://arxiv.org/abs/1602.04621)
- [Azizzadenesheli & Anandkumar, Efficient Exploration through Bayesian Deep Q-Networks](https://arxiv.org/abs/1802.04412)
- [Lee, Xie et al., Supervised Pretraining Can Learn In-Context Reinforcement Learning (NeurIPS 2023)](https://arxiv.org/abs/2306.14892) — Decision-Pretrained Transformer
