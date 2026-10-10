---
title: "CS224R Lecture 8: Where Rewards Come From, Learned from Examples and Preferences"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, rlhf]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 10
tldr: "Lecture 8 of CS224R (Spring 2026) spends a few slides wrapping up offline RL, then asks the question the first seven lectures skipped: where does the reward come from? Games have scores. Real robots, dialogue, and driving usually don't. The slides offer two routes. The first trains a goal classifier on success examples and uses it as the reward, but RL learns to exploit the classifier's blind spots; the fix is to keep adding states the policy visits as negatives, the same structure as a GAN. The second asks people which of two trajectories is better and learns a reward with the Bradley-Terry-style objective log σ(r(τw) − r(τl)), the same method LLM RLHF uses. The lecture's number-one takeaway is one line: rewards can't be taken for granted."
description: "A guide to Stanford CS224R (Spring 2026) Lecture 8, based on the official 08_cs224r_reward_learning_2026 slides: a recap of offline RL's two key ideas with the π*0.6 example, why task specification is hard, goal classifiers and how they get exploited, VICE-style negative updates and the link to GANs, learning rewards from human preferences (Christiano 2017), the three-stage LLM RLHF pipeline, and RLAIF. The Spring 2025 Lecture 8 recording is listed as a supplement."
draft: false
glossary:
  - term: "goal classifier"
    aliases: ["success classifier"]
    definition: "A binary classifier trained on examples of successful and unsuccessful states, whose output serves as the RL reward."
    context: "The first reward-learning method in CS224R Lecture 8. A pre-trained classifier used as a fixed reward is easy for RL to exploit."
  - term: "reward hacking"
    aliases: ["exploiting the reward"]
    definition: "A policy finding states or behaviors that a learned reward scores highly without actually completing the task."
    context: "CS224R Lecture 8 uses it to explain why the goal classifier must keep updating during RL."
  - term: "Bradley-Terry model"
    aliases: ["Bradley-Terry"]
    definition: "A pairwise comparison model that writes the probability that A beats B as σ(r(A) − r(B)), where σ is the sigmoid."
    context: "CS224R Lecture 8 uses it to learn a reward from human trajectory preferences. LLM reward models use the same objective."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-reward-learning)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source term**: Based on the Spring 2026 [08_cs224r_reward_learning_2026 slides](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf) (scheduled 2026-04-24). The companion video is the [Spring 2025 Lecture 8 recording (supplement)](https://www.youtube.com/watch?v=PDIxDhA9Z6Y). The title matches, but the opening offline RL recap differs: the [2025 Lecture 8 slides](https://cs224r.stanford.edu/spring_2025/slides/08_cs224r_reward_learning_2025.pdf) are titled "Conservative Offline RL and Reward Learning" and recap conservative methods, while the 2026 version recaps Lecture 7's two key ideas and adds a π*0.6 example. The three reward-learning subsections are the same in both years. This is post 10 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

Since [Lecture 1](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en), [CS224R](https://cs224r.stanford.edu/) has treated the reward r(s, a) as given. Lecture 8 finally asks who supplies that number.

The slides give two learning goals:

- why task specification is hard (and why naive methods fail)
- methods for learning rewards from human supervision

The plan has two parts. Part one is an offline RL recap and example, marked "Part of HW3." Part two is reward learning, where the preference subsection is marked "Part of default project" and "How LLMs are supervised!"

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=PDIxDhA9Z6Y
title: Spring 2025 Lecture 8: Reward Learning (YouTube, supplement)
```

Original videos: [Spring 2025 Lecture 8: Reward Learning (YouTube, supplement)](https://www.youtube.com/watch?v=PDIxDhA9Z6Y)

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## Wrapping up offline RL

This section compresses [Lecture 7](/posts/ai/2026-09-30-cs224r-offline-rl-en) into two key ideas. The setting is unchanged: data from an unknown πβ, rewards to maximize under πθ.

The slide first adds a contrast Lecture 7 left implicit. Querying the Q-function on OOD actions causes overestimation. **In online RL, data from the new policy corrects those errors in later iterations. Offline RL has no additional data, so it has to be more conservative.**

- **Key idea 1**: train the policy only on actions sampled from the dataset, for example with advantage-weighted regression. AWR also fits the value of πβ rather than πθ, so even the value function never queries OOD actions.
- **Key idea 2**: use an asymmetric expectile loss to fit the value of a policy better than πβ, then fit Q from that V. This is what IQL does.

Then comes a real example. [π*0.6 (2025)](https://arxiv.org/abs/2511.14759) uses an "iterated offline RL" recipe for robot post-training, in three steps:

1. Collect a large batch of data with π (a mix of roll-outs and DAgger).
2. Fit V^πβ with Monte Carlo.
3. Train an advantage-conditioned policy π(aₜ | sₜ, Â(sₜ, aₜ)).

The slide goes no further than this; see the paper for details. The example ties together DAgger from Lecture 2, Monte Carlo values, and the advantage from Lecture 7.

## Where do rewards come from?

On the left, the slide shows computer games (citing Mnih et al. 2015 on Atari), which come with a score. On the right is the real world: robotics, dialogue, autonomous driving, labeled only "what is the reward?" In practice people often use a proxy.

Is there an easier way to supervise a task? The course has already covered one: **directly imitating an expert's actions**. The slide lists its limits:

- it doesn't reason about outcomes or dynamics
- the expert may have different degrees of freedom than the robot
- some tasks can't be demonstrated at all

So the question becomes: **can we reason about what the expert is trying to achieve?**

## Route 1: learn rewards from goal examples

### Goal classifiers

The most direct idea is to learn a classifier that tells goal states apart from other states. The slide's example task is "put the pencil case behind the notebook":

1. Collect examples of successful and unsuccessful states (inside and outside the goal set G).
2. Train a binary classifier with inputs sᵢ and labels 1(sᵢ ∈ G).
3. Run RL with the classifier's output as the reward.

What can go wrong? **RL seeks out states the classifier thinks are good**, and those may be states the classifier was never trained on. The policy finds the classifier's weaknesses, not a solution to the task.

### Add visited states as negatives

The fix on the slide comes from [Fu et al. 2018 (VICE)](https://arxiv.org/abs/1805.11686):

1. Collect an initial set of successful states D+ and unsuccessful states D−.
2. Update the classifier with D+ and D−, balancing each batch 50/50.
3. Collect experience with policy π.
4. Update π with the classifier-based reward.
5. Add visited states to the negatives: D− ← D− ∪ {sₜ}.

The class first discusses three questions: will the classifier be accurate, will the policy work, and what will the classifier output for successful states? The slide's answers:

- The classifier can't be exploited, because anywhere the policy goes becomes a negative.
- But what if some visited states are actually successful?
- As long as batches stay balanced, the classifier still outputs p ≥ 0.5 for successful states.

### Results on a robot

The slide cites [Sharma et al. 2023](https://arxiv.org/abs/2303.01488). They collected 50 demonstrations, used the final states as success examples, and seeded the RL replay buffer with the demos. Directly imitating the demos reached a 26% success rate. An RL policy trained with the learned classifier reached 62%. The slide adds a note: **regularizing the classifier matters**.

### This is how GANs work

A side note on the slide makes the connection: GANs follow the same recipe. Train a classifier to tell real data from generated data, then train a generator to produce data the classifier thinks is real. At convergence, the generator matches the data distribution p(x). The examples are ViT-VQGAN and Phenaki video generation.

Map it over: the policy is the generator, success examples are the real data, and the goal classifier is the discriminator.

The slide's summary of this route:

| | |
|---|---|
| Pro | A practical framework for task specification |
| Caveat | Adversarial training can be unstable (the GAN literature has many regularization tricks) |
| Con | Requires examples of desired behavior or outcomes |

One more point from that summary: with success examples you can learn a goal classifier; with full demos you can learn a full reward.

## Route 2: learn rewards from human preferences

### Comparing is easier than scoring

What if you skip demos and goal examples and ask people for feedback on policy roll-outs instead? The slide lists two ways to ask:

- "How good is this trajectory?"
- "Which trajectory is better?"

Its verdict: **relative preferences are easier to provide.**

### From preferences to a reward function

A person says τw is better than τl, written τw ≻ τl. We want a reward rθ whose sum over τw exceeds its sum over τl. τ can be a full or partial roll-out.

The slide frames it this way: humans are classifying which trajectory is better, so the reward should be discriminative too. Concretely, define σ(rθ(τa) − rθ(τb)) as the estimated probability that τa ≻ τb, then maximize the log probability:

```text
max_θ  E_{τw, τl} [ log σ( rθ(τw) − rθ(τl) ) ]
```

The complete algorithm:

1. From a dataset {τᵢ}, sample batches of k trajectories and ask humans to rank them. (For LLMs, all k share the same prompt.)
2. Compute rθ for each trajectory under the current reward model.
3. For all k-choose-2 pairs per batch, compute the gradient of the objective above.
4. Update θ with that gradient.

The slide notes that this can run inside the loop of online RL.

### Two examples

- [Christiano et al. 2017](https://arxiv.org/abs/1706.03741) learn rewards inside the online RL loop; the slide says they used 900 human preference queries.
- Sadigh et al. 2017 (RSS) learn a driving reward from preferences to weight different factors.

### Applied to LLMs: RLHF

For LLMs: given a prompt x, sample two replies y and y′, ask a human which is better, and train a reward model r(x, y) that judges how good reply y is for prompt x.

The slide places this in a three-stage LLM training pipeline:

1. Large-scale pretraining: next-token prediction on mixed-quality data.
2. Supervised fine-tuning on higher-quality (prompt, response) pairs.
3. RLHF:
   - 3a. Gather preference data.
   - 3b. Train the reward model.
   - 3c. Run RL to maximize the reward (e.g. with PPO).

### RLAIF: swap the human for an AI

The last variation replaces the human with another language model, asking it "which of these responses is less harmful?" The source is [Anthropic's Constitutional AI (2022)](https://arxiv.org/abs/2212.08073). The slide's key insight: **critique is easier than generation.**

## Summary: the tradeoff between the two routes

The first line of the summary slide: **rewards can't be taken for granted.**

| | Learning from goals and demos | Learning from human preferences |
|---|---|---|
| Pros | A practical framework for task specification | Pairwise preferences are easy to give, with no goal examples or demos needed; deployed at scale |
| Caveat | Adversarial training can be unstable | |
| Cons | Requires examples of desired behavior or outcomes | May require supervision in the RL loop, which usually takes more human time |

The slide leaves a thought exercise: what other forms of feedback or supervision might help?

The last content slide points to the whole area of "unsupervised" RL: can agents propose their own goals? The example is [asymmetric self-play (Sukhbaatar et al. 2018)](https://arxiv.org/abs/1703.05407), framed as a two-player game between a goal-setter and a goal-reacher.

## Something to try tonight

Pick an agent or LLM feature you work on and write down what its "reward" is today: human ratings, rules, an LLM judge, or user thumbs-up. Then check it against this lecture's two questions. When a policy optimizes against it, could it find outputs that score high without doing the task? If so, could you do what VICE does and keep feeding the exploited outputs back in as negatives?

## Further reading

- [CS224R Lecture 9: RLHF and Preference Optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en): the next lecture in this series, from reward model + RL to DPO
- [CME295: Preference Tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en): RLHF and DPO from the LLM side
- [CS336: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en): the post-training pipeline from the implementation side

**Series navigation**: Previous: [Lecture 7: Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en) | Next: [HW3: AWAC, IQL, and Stitching on AntMaze](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224R course homepage and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 8 slides: Recap of offline RL + Reward Learning (2026)](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf)
- [Spring 2025 Lecture 8: Reward Learning (YouTube, supplement)](https://www.youtube.com/watch?v=PDIxDhA9Z6Y)
- [Christiano et al. Deep Reinforcement Learning from Human Preferences (arXiv 1706.03741)](https://arxiv.org/abs/1706.03741)
- [Fu et al. Variational Inverse Control with Events (arXiv 1805.11686)](https://arxiv.org/abs/1805.11686)
- [Sharma et al. Self-Improving Robots: End-to-End Autonomous Visuomotor Reinforcement Learning (arXiv 2303.01488)](https://arxiv.org/abs/2303.01488)
- [Bai et al. Constitutional AI: Harmlessness from AI Feedback (arXiv 2212.08073)](https://arxiv.org/abs/2212.08073)
- [π*0.6: a VLA That Learns From Experience (arXiv 2511.14759)](https://arxiv.org/abs/2511.14759)
- [Sukhbaatar et al. Intrinsic Motivation and Automatic Curricula via Asymmetric Self-Play (arXiv 1703.05407)](https://arxiv.org/abs/1703.05407)
