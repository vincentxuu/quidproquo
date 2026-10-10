---
title: "CS234 Learning from Demonstrations: Behavioral Cloning, DAgger, Inverse RL, and MaxEnt IRL"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, imitation-learning]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 10
tldr: "When you have expert demonstrations but no reward, the second half of CS234 L7 offers three routes. Behavioral cloning copies actions with supervised learning. DAgger fixes its compounding errors by querying the expert along the learner's own path. Inverse RL instead infers what reward the expert is optimizing. Inferring rewards runs into the fact that infinitely many rewards explain the same demonstrations; feature matching and the maximum-entropy principle are two ways to pin down an answer. This material sets up the next post on RLHF: swap demonstrations for preferences and the problem keeps almost the same shape."
description: "A guide to Stanford CS234 (Winter 2026) L7 second half and the opening of L8: reward shaping, behavioral cloning and ALVINN, the εT² intuition for compounding errors, DAgger, inverse RL with linear features, feature matching (Abbeel & Ng 2004), and MaxEnt IRL (Ziebart et al. 2008). Includes timestamps for Spring 2024 videos 07 and 08."
draft: false
glossary:
  - term: "behavioral cloning"
    aliases: ["BC"]
    definition: "Treating imitation as supervised learning: train a classifier or regressor on the expert's (state, action) pairs and use it as the policy."
    context: "L7 pp.31–34; an early success was ALVINN (Pomerleau, NIPS 1989)."
  - term: "compounding errors"
    aliases: ["distribution mismatch"]
    definition: "One mistake by an imitation policy takes it to states the expert never visited, raising the error rate at every later step. L7's rough intuition: with per-step error ε, total errors grow from εT in supervised learning to about εT²."
    context: "L7 pp.36–38, citing Ross et al. 2011."
  - term: "DAgger"
    aliases: ["Dataset Aggregation"]
    definition: "Run the current learned policy, ask the expert to label the correct action at the states it actually reaches, add those labels to the dataset, retrain, and repeat."
    context: "L7 p.39; Ross, Gordon & Bagnell 2011."
  - term: "MaxEnt IRL"
    aliases: ["Maximum Entropy Inverse RL"]
    definition: "Among all trajectory distributions that match the demonstrations' expected features, pick the one with maximum entropy. Trajectory probability becomes proportional to exp(wᵀμ_τ), and the reward weights w are fit by maximum likelihood."
    context: "L7 pp.51–59; Ziebart et al., AAAI 2008."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-imitation-learning-irl)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Edition note**: this guide follows the [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 slides: [Lecture 7](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) pp.25–62 and [Lecture 8](https://web.stanford.edu/class/cs234/slides/lecture8post.pdf) pp.6–17 (PDF page numbers). The 2026 recordings are for enrolled students only. The public recordings are videos 7 and 8 of the [Spring 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX), used here only as a listening supplement, with approximate minute marks estimated from where the topics fall in the transcript. Access level **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Every fact was checked on 2026-09-30 against those PDFs and video pages.

**Series**: previous [A2: implementing REINFORCE, a baseline, and PPO](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en) | next [Learning from human preferences: Bradley-Terry, RLHF, DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

Until now the reward has always been given. The second half of L7 asks a different question. The world already has very good decision-makers: drivers, pilots, doctors. Can we learn directly from their demonstrations without writing a reward first?

The slides give the motivation in one line. Having humans provide a reward signal while the RL algorithm acts is cheap supervision, but its sample complexity is high. The alternative is **imitation learning**.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=4ngb0IZTg8I
title: from about minute 45, "Introduction to imitation learning"
```

```youtube
url: https://www.youtube.com/watch?v=IEbuJtjqtMU
title: from about minute 4
```

Original videos: [from about minute 45, "Introduction to imitation learning"](https://www.youtube.com/watch?v=4ngb0IZTg8I)、[from about minute 4](https://www.youtube.com/watch?v=IEbuJtjqtMU)

Course and recording entries:

- [Spring 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

The Winter 2026 official Lecture Materials page lists slides only and no recordings; the public YouTube playlist is Spring 2024. Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read both transcripts: Spring 2024 Lecture 7, "Policy Search 3" (about 79 minutes), spends its first part on GAE and monotonic improvement, only starts imitation learning after roughly 55% (behavior cloning, ALVINN, DAgger) and reaches IRL and feature matching in about the last 15%; Lecture 8, "Offline RL 1" (about 74 minutes), opens with an imitation-learning recap and MaxEnt IRL and turns to RLHF after roughly 70%. Every mm:ss timestamp is now an approximate value estimated from where topics fall in the transcript, the &t= links are removed, and "YouTube chapters" became "transcript"; the claim that the video is more detailed than the slides was removed because that comparison was not made.

## Slide ranges and the 2024 videos

The 2026 PDF boundaries do not match the topics, so this post cuts by topic:

| 2026 slides | Content | Spring 2024 video (approximate times) |
|---|---|---|
| L7 pp.26–30 | Learning from past decisions, reward shaping, problem setup | Video 07 [from about minute 45, "Introduction to imitation learning"](https://www.youtube.com/watch?v=4ngb0IZTg8I) |
| L7 pp.31–39 | Behavioral cloning, ALVINN, compounding errors, DAgger | Video 07 about minutes 50–64 |
| L7 pp.40–50 | Reward learning, linear-feature IRL, feature matching, ambiguity | Video 07 [from about minute 64](https://www.youtube.com/watch?v=4ngb0IZTg8I) |
| L7 pp.51–62 | MaxEnt IRL, from IRL to policies, summary | Video 08 [from about minute 4](https://www.youtube.com/watch?v=IEbuJtjqtMU) to about minute 52 |
| L8 pp.6–17 | "How Can RL Enable Transformative LLM?", DAgger and feature-reward recap, Imitation Learning Summary | Video 08 has a matching overview in its first few minutes |

Video 08 is titled "Offline RL 1" in the playlist, but its transcript shows MaxEnt IRL and the start of RLHF. The 2026 slides have no dedicated offline RL lecture, and this post does not invent 2026 content for it.

## Why learn from demonstrations

**Reward shaping** is the first motivation. Rewards that are dense in time guide an agent closely, but who supplies them? The slides list two options. You can design them by hand, which is often brittle. Or you can specify them implicitly through demonstrations. Examples include simulated highway driving (Abbeel & Ng 2004 and others) and parking-lot navigation (Abbeel, Dolgov, Ng, and Thrun, IROS 2008).

Imitation learning helps when it is easier for an expert to **demonstrate** the behavior than to write a reward that produces it, or to write the policy directly.

The problem setup (L7 p.30):

- A known state space, action space, and transition model P(s′|s, a)
- **No** reward function R
- One or more expert demonstrations (s₀, a₀, s₁, a₁, …), with actions drawn from the expert policy π*

Three questions branch off from there:

1. **Behavioral cloning**: can we learn the expert policy directly with supervised learning?
2. **Inverse RL**: can we recover R?
3. **Apprenticeship learning via inverse RL**: can we use the recovered R to produce a good policy?

## Behavioral cloning: RL as supervised learning

The recipe is direct. Fix a policy class, such as a neural network or a decision tree, and fit it on (s₀, a₀), (s₁, a₁), and so on. The slides name two early successes: Pomerleau's **ALVINN** at NIPS 1989, which learned to drive from images, and Sammut et al. at ICML 1992, who learned to fly in a flight simulator.

The slides also stress that it often works very well in practice, especially with BC-RNN. They cite Mandlekar et al., "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation" (CoRL 2021). The verdict: "Extensively used in practice."

### The catch: compounding errors

Supervised learning assumes i.i.d. (s, a) pairs and ignores temporal structure. If errors were independent in time with probability ε per step, expected total errors would be about εT.

In an MDP, training and test distributions differ:

- In training, sₜ comes from the distribution induced by the expert π*
- At test time, sₜ comes from the distribution induced by the learned policy π_θ

One mistake puts the agent in states the expert never visited, and later errors become more likely. The slides' rough intuition is E[total errors] ≲ ε(T + (T−1) + … + 1) ≈ εT². For the rigorous result they point to Theorem 2.1 of [Ross & Bagnell, AISTATS 2010](http://www.cs.cmu.edu/~sross1/publications/Ross-AIStats10-paper.pdf).

### DAgger: ask the expert where you actually go

The idea from [Ross, Gordon, and Bagnell 2011](https://arxiv.org/abs/1011.0686): collect more expert labels along the path taken by the behavior-cloned policy. The algorithm on L7 p.39:

1. Start with an empty dataset D and any π̂₁
2. In round i, let πᵢ = βᵢπ* + (1−βᵢ)π̂ᵢ and run it for T steps
3. Ask the expert for π*(s) at every visited state to get Dᵢ
4. Set D ← D ∪ Dᵢ and train π̂ᵢ₊₁ on D
5. Return the best π̂ᵢ on validation

The slides say this yields a stationary deterministic policy that performs well under **its own induced state distribution**. Then they ask: "Key limitation?" Look at step 3 for the answer. Every round needs an expert on hand to label arbitrary states on demand.

## Inverse RL: what is the expert optimizing?

Flip the question. If the expert's policy is optimal, what can we infer about R?

The quiz on L7 pp.42–43 gives the answer: **infinitely many R** make the expert's policy optimal. This ambiguity is the central difficulty of IRL.

### Linear-feature rewards

Restrict to R(s) = wᵀx(s), where x is a state-feature vector and w the weights to learn. Plug it into the value function:

V^π(s₀) = E[Σ γᵗ wᵀx(sₜ)] = wᵀ E[Σ γᵗ x(sₜ)] = wᵀμ(π)

μ(π) is the **discounted weighted feature frequency** under π. This mirrors linear value-function approximation, except that now the reward is the linear part.

If the demonstrations come from an optimal policy, finding w means finding a w* with w*ᵀμ(π*) ≥ w*ᵀμ(π) for every π ≠ π*.

### Feature matching

Abbeel & Ng (2004) observed that a policy π is guaranteed to do as well as the expert if its discounted feature expectations are close enough to the expert's. Precisely: if ‖μ(π) − μ(π*)‖₁ ≤ ε, then for every w with ‖w‖∞ ≤ 1, |wᵀμ(π) − wᵀμ(π*)| ≤ ε, by Hölder's inequality.

The result is elegant. You do not need the true w; if the features match, the performance matches.

But the ambiguity does not go away; it gains a layer. L7 p.49 notes that infinitely many rewards share the same optimal policy, and infinitely many stochastic policies can match the feature counts. Which one should you pick? The slides point to two key papers: [MaxEnt IRL by Ziebart et al. (AAAI 2008)](https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf) and [GAIL by Ho & Ermon (NeurIPS 2016)](https://arxiv.org/abs/1606.03476). The lecture continues with the first.

## MaxEnt IRL: among all matching distributions, pick the least opinionated

Keep R(s) = wᵀx(s). This time the feature count is summed over **a single trajectory**, μ_τ = Σ x(sᵢ). The slides flag that this differs slightly from the earlier definition. The average over m demonstrations is μ̃.

In a deterministic MDP with a linear reward, a policy is fully specified by its distribution over H-step trajectories. So the question becomes: given m demonstrations, which trajectory distribution should we choose?

The **principle of maximum entropy**: add no preference beyond matching the demonstrations' feature expectations. As an optimization, maximize −Σ P(τ) log P(τ) subject to Σ P(τ)μ_τ = μ̃ and Σ P(τ) = 1.

With a linear reward, this is equivalent to maximizing the likelihood of the demonstrations under an exponential-family distribution:

P(τⱼ | w) = exp(wᵀμ_τⱼ) / Z(w)

The slides' reading: a strong preference for low-cost paths, with equal-cost paths equally likely. Stochastic MDPs multiply in the transition probabilities along the trajectory.

### Learning w

Choose w to maximize the log-likelihood of the demonstrations. The gradient is a clean difference:

∇L(w) = μ̃ − Σ_τ P(τ | w)μ_τ = μ̃ − Σ_s D(s)x(s)

That is, **the demonstrations' feature counts minus the learner's expected feature counts under the current reward**. The second term can be written with state-visitation frequencies D(s). L7 p.58 gives the algorithm for D(s): a backward pass computes local action probabilities, a forward pass propagates state-visitation frequencies, and a final step sums over time.

The slides then ask whether computing this requires the transition model. L7 p.59 answers that the original formulation needs the transition model, or the ability to act in the world and sample transitions. Then comes a second question: did behavioral cloning need it? Keep this contrast in mind. BC needs only demonstrations; IRL needs demonstrations plus a model or interaction.

The slides call the maximum-entropy approach "hugely influential": it offers a principled way to choose among the many possible rewards.

## From IRL back to policies

Once you have a reward, what you usually want is a policy that matches or beats the expert. One approach on L7 p.60 is to feed the learned reward into ordinary RL. Then the slides ask whether we can learn the desired policy more directly. The lecture leaves that open, but that question is where the GAIL line of work begins.

## Summary and the bridge onward

Three points from the L7 p.61 summary are worth keeping:

- Imitation learning can greatly reduce the data needed to learn a good policy
- Combining inverse RL / learning from demonstration with online RL is an active direction
- Often we only have **preference pairs** (y₁ ≻ y₂), not demonstrations. The slides call this the "dueling bandits" setting and say it will return shortly and in Assignment 3

The opening of L8 compresses this into an "Imitation Learning Summary" slide: very powerful, many extensions, and maximum-entropy reward learning is an important idea. Before that, L8 p.6 shows a ChatGPT screenshot answering "write a program to demonstrate how RLHF works," as the bridge from robot demonstrations to LLMs.

The next post picks up there. Replace "expert demonstrations" with "a human says A is better than B," and the IRL problem turns almost unchanged into RLHF reward modeling.

## How to self-study it

1. Read L7 pp.26–39 and stop at DAgger's "Key limitation?" Write your answer down before moving on.
2. For pp.40–50, copy the three-line derivation of V^π = wᵀμ(π) onto paper. The Hölder step in feature matching is one line.
3. Pair the MaxEnt section (pp.51–59) with the part of 2024 video 08 that derives MaxEnt IRL and its gradient (about minutes 25–46, estimated from the transcript). This post has not compared how detailed the video is against the slides page by page.
4. For hands-on practice: CS234's assignments have no imitation-learning question, but [CS224R HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en) has you implement BC and DAgger.

One thing to do tonight: make a table of what BC, DAgger, and IRL each need. Do they need the transition model? An expert on call? Interaction with the environment? That table is the answer key for every "Check your understanding" in L7.

## Further reading

- The same topic in a deep RL course: [CS224R L2: imitation learning and multimodal policies](/posts/ai/2026-09-30-cs224r-imitation-learning-en)
- Another take on distribution shift: [Berkeley CS285 L1–4: imitation learning, distribution shift, and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.
- 2026-10-10: Checked the video content against its transcript. Timestamps became approximate and &t= links were removed; the unverified "more detailed than the slides" claim was dropped.

## References

- [CS234 Lecture 7 slides (post version, Winter 2026)](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) — pp.25–62: reward shaping, BC, compounding errors, DAgger, linear IRL, feature matching, MaxEnt IRL
- [CS234 Lecture 8 slides (post version, Winter 2026)](https://web.stanford.edu/class/cs234/slides/lecture8post.pdf) — pp.6–17: the LLM bridge slide and the imitation learning summary
- [CS234 course home page (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule (Week 4, "Offline RL, Imitation Learning")
- [Stanford CS234 Spring 2024 Lecture 7, "Policy Search 3"](https://www.youtube.com/watch?v=4ngb0IZTg8I) — second half covers imitation learning, DAgger, and IRL (per the transcript)
- [Stanford CS234 Spring 2024 Lecture 8, "Offline RL 1"](https://www.youtube.com/watch?v=IEbuJtjqtMU) — the transcript shows MaxEnt IRL and the start of RLHF
- [Ross & Bagnell, Efficient Reductions for Imitation Learning (AISTATS 2010)](http://www.cs.cmu.edu/~sross1/publications/Ross-AIStats10-paper.pdf) — the compounding-error theorem cited in the slides
- [Ross, Gordon & Bagnell, A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning (2011)](https://arxiv.org/abs/1011.0686) — DAgger
- [Abbeel & Ng, Apprenticeship Learning via Inverse Reinforcement Learning (ICML 2004)](https://ai.stanford.edu/~ang/papers/icml04-apprentice.pdf) — feature matching
- [Ziebart et al., Maximum Entropy Inverse Reinforcement Learning (AAAI 2008)](https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf) — MaxEnt IRL
- [Ho & Ermon, Generative Adversarial Imitation Learning (NeurIPS 2016)](https://arxiv.org/abs/1606.03476) — the other key paper named in the slides
