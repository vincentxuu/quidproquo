---
title: "NCCU Yen-Lung Tsai Generative AI L13: Reinforcement Learning, from AlphaGo to the RLHF That Makes LLMs Bluff Less"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, reinforcement-learning, q-learning, policy-gradient, rlhf]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 13
tldr: "Every model in the first 12 lectures learned from training data that people prepared. L13 asks a different question: when there is no right answer, only a signal of how well you did, how does a computer learn? Tsai starts from AlphaGo and Breakout and splits the field in two. Value-based methods learn a Q function that scores each action (Deep Q-Learning, TD, experience replay, ε-greedy); policy-based methods learn the action directly (policy gradient, actor-critic). The second half returns to LLMs: ChatGPT trains a reward model from human rankings and then runs RLHF with PPO, while DeepSeek has the computer check math answers automatically and uses that as the reward. Week 13 homework is the final project proposal."
description: "A guide to lecture 13 of NCCU Professor Yen-Lung Tsai's 'Generative AI: Text and Image Synthesis Principles and Practice' (Spring 2025, term 1132): agent, state, action, and reward; the AlphaGo timeline; policy-based versus value-based methods; where Deep Q-Learning gets its training data (Monte-Carlo and temporal-difference); experience replay and ε-greedy; policy gradient and actor-critic; the three steps of RLHF and the reward model loss; DeepSeek's automatic rewards; and the week 13 final project proposal from the Chang Gung satellite section."
draft: false
glossary:
  - term: "experience replay"
    definition: "Let the computer play while storing every step as (state, action, reward, next state), then sample from that pile of experience as training data for updating the Q function."
    context: "L13 uses it to explain where Deep Q-Learning's training data comes from: every step played yields one example."
    links:
      - label: "Mnih et al. 2015 (Nature)"
        url: "https://www.nature.com/articles/nature14236"
  - term: "ε-greedy"
    aliases: ["epsilon-greedy", "ε-Greedy Policy"]
    definition: "Each time an action is needed, draw a random number between 0 and 1. If it is greater than ε, pick the highest-scoring action under the current Q function; otherwise pick at random. Start with a large ε so the computer explores more."
    context: "L13 uses it to answer 'the Q function is still terrible at first, so what rule should the computer play by?'"
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 13 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L12: ControlNet and Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en).

I used three official sources: the [lecture 13 recording](https://www.youtube.com/watch?v=xG8ccKlW_Cc) (2025-05-13, 3 h 3 min), the slide deck [GenAI12 強化學習與生成式 AI 綜合應用](https://drive.google.com/file/d/1uPDkwB4uu183yKczp0lcxyIcQC08XdaR/view) (73 slides, in Chinese), and the week 13 assignment on the [Chang Gung satellite section page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese). Note that the slide file is numbered 12, but it is the deck for lecture 13; its footer reads "13 強化學習與生成式 AI 綜合應用." Access level is **A3**: recordings, slides, and the assignment are public. There is no matching demo notebook this week.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=xG8ccKlW_Cc
title: 【生成式 AI】13. 強化學習與生成式 AI 綜合應用 (YouTube recording, 2025-05-13)
```

Original videos: [【生成式 AI】13. 強化學習與生成式 AI 綜合應用 (YouTube recording, 2025-05-13)](https://www.youtube.com/watch?v=xG8ccKlW_Cc)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits in the course

The course has treated AI as a "function-learning machine" throughout: decide what goes in and what comes out, prepare training data, and let a neural network do the rest. L13 faces a case where **we simply don't know the right answer**. At each moment in Breakout, should the paddle go left or right? Where should this Go stone go? Nobody can label that. All we know is whether things turned out well.

Reinforcement learning is built for exactly this situation. The lecture has two jobs in the course arc. First, it adds a third way of learning that doesn't depend on labels. Second, it answers a question left open since L04 and L06: why did LLMs that only guess the next word become more obedient and less prone to bluffing? The answer is RLHF.

The deck has three parts: reinforcement learning (slides 2–41), "making the bluffer bluff less" (slides 42–53), and applications of generative AI (from slide 54). The third part is nearly identical to the last section of the L14 deck, so it is covered in [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en).

## Reinforcement learning: the magic behind AlphaGo

### Two famous examples

The first is DeepMind's 2015 Nature paper [Human-level control through deep reinforcement learning](https://www.nature.com/articles/nature14236), which essentially taught a computer to play Atari games using Deep Q-Learning.

The second is AlphaGo. Tsai shows a photo from the 2017 Taiwan AI Annual Conference, where the speaker was **Dr. Aja Huang (黃士傑)**, one of AlphaGo's creators. The slide notes that Erica, the program he developed during his PhD, won a computer Go world championship. Slide 7 lays out AlphaGo's development as a timeline:

| Date | Version | What the slide says |
|---|---|---|
| 2016.3 | AlphaGo Lee | Beat world champion Lee Sedol 4:1 |
| 2016.12.29–2017.1.4 | AlphaGo Master | A mysterious online player with 60 straight wins |
| 2017.5 | Wuzhen Go summit, China | Played Ke Jie; collaboration between AI and humans |
| 2017.10 | AlphaGo Zero | Fully self-taught AI that beat the earlier versions |

### What reinforcement learning does

The diagram on slide 8 is the skeleton of the whole lecture. The agent (the computer) sees the environment's **state** Sₜ, chooses an **action** aₜ, the environment returns a **reward** rₜ, and the world moves to the next state. **The goal is to collect as much reward as possible.**

Tsai then returns to the course's refrain: the "dopey AI robot" we want to build is a function-learning machine f_θ, and all we need is to know what the input is and what the output looks like. So which function does reinforcement learning learn? Using Breakout as the example, there are two main ideas: **policy based** and **value based**.

### Policy based: learn what action to take

The most natural choice is to learn a **policy function** π that takes the current game screen Sₜ and outputs left, right, or stay.

The problem, as noted earlier, is that training data for this function is hard to come by. Nobody knows the correct move for every screen.

### Value based: score every action

The other route is to learn a **value function** Q that takes a state plus an action and outputs a score (usually an estimate of how much reward will follow).

If Q is learned well, the best action follows directly: plug every action into Q and see which scores highest.

<details>
<summary>The value-based decision as a formula</summary>

π(S) = argmax_{a∈𝒜} Q_θ(S, a)

𝒜 is the set of possible actions (left, right, stay in Breakout). **Deep Q-Learning**, the most common form of deep reinforcement learning, uses a neural network to learn the Q function.

</details>

## Deep Q-Learning: where does the training data come from?

Switching to a Q function doesn't make the question go away: where does the training data come from? Tsai's answer is: **let the computer play by itself.** It plays badly at first and its Q values may be useless, but along the way some Q values can be computed. Use those as training data and let deep learning fill in the full Q function. The slides joke that since the model learns from training data it generates itself, this should really be called self-supervised learning.

### Two ways to compute Q values

**Monte-Carlo (MC)**: add up every reward from now until the game ends. Usually each reward is multiplied by a discount γ so the distant future counts less, both so the series converges and because the future is less certain. The downside is that you must finish a whole playthrough (an episode) before you can compute anything.

**Temporal-difference (TD)**: could one step of play produce one training example? Think about it: this step's Q value is basically the immediate reward rₜ plus the next step's Q value (assuming optimal play afterward). So recording the short tuple (Sₜ, aₜ, rₜ, Sₜ₊₁) is enough to update Q.

<details>
<summary>The MC and TD formulas</summary>

MC: Q(Sₜ, aₜ) = rₜ + γ·rₜ₊₁ + ⋯ + γ^(T−t)·r_T

TD: Q(Sₜ, aₜ) = rₜ + γ · max_{a∈𝒜} Q(Sₜ₊₁, a)

γ is a discount you choose, usually between 0 and 1.

</details>

### Experience replay: learning from yourself

The TD approach leads to **experience replay**: let the computer keep playing, collect (Sₜ, aₜ, rₜ, Sₜ₊₁) at every step, and store it as training data.

Look closely and this is a process of "learning from yourself." The slides call the previous parameters θ⁻ (old version) and the ones being updated θ (new version). For each experience (Sₜ, aₜ, rₜ, Sₜ₊₁), the old Q computes rₜ + γ·max Q_θ⁻(Sₜ₊₁, a) as the target for (Sₜ, aₜ), which is then used for gradient descent on the new Q_θ.

### Greedy and ε-greedy

Once Q is learned, always picking its highest-scoring action is called a **greedy policy**.

Training raises one more question: what rule should the computer play by at the start? Picking the top action under the current Q works in principle, but at this point Q is still dreadful. The fix is **ε-greedy**: each time an action is needed, draw a random number r between 0 and 1. If r > ε, let Q decide; if r ≤ ε, play randomly. Start with a large ε.

Q-Learning has one more weakness: if there are infinitely many possible actions (continuous actions, for example), it becomes hard to use. The slides are careful to say the Q function itself can still be trained; the trouble is using it to pick the best action.

## Policy gradient: can't we learn the policy directly?

Back to the policy function. We don't know the right answer for any situation, but we still want to learn this function. "Uh-oh, that sentence sounds familiar." Tsai's turn: our goal is actually clear, which is to maximize reward. Can we put that goal straight into the objective function?

That is **policy gradient**: design an objective J(θ) that depends on π and maximize it. The most direct definition is π's state value, but that value can't be computed.

The workaround is to take an actual playthrough, a trajectory τ, and compute its total score R(τ). The total score doesn't depend on π by itself, so the idea shifts: if the network took the same actions as this trajectory, it would earn this many points, so higher-scoring trajectories should be imitated more closely.

<details>
<summary>Policy gradient and actor-critic losses</summary>

τ = {S₁, a₁, r₁, S₂, a₂, r₂, …, S_T, a_T, r_T}, R(τ) = Σₜ rₜ

Policy gradient minimizes, for each trajectory:

R(τ) · Σₜ −log π_θ(aₜ | Sₜ)

and sums over several actual trajectories. The scoring can be made finer, and you can even train a separate value function to replace R(τ). That is **actor-critic**:

Σₜ −Q_θ′(Sₜ, aₜ) · log π_θ(aₜ | Sₜ)

</details>

Slide 41 sums up: both Deep Q-Learning and policy gradient let the computer learn by itself without human-prepared training data. **We can learn even without knowing the answer.**

## Making the bluffer bluff less: RLHF

Part two returns to LLMs. Generative models are fun, but after a while people found that a model that only bluffs isn't much use. How do you straighten out the bluffer? The slides break ChatGPT's approach into three steps:

**Step 1. Teach by example.** Real people answer questions, and those answers are used to fine-tune GPT. But conversations can go in so many directions that no amount of human examples is enough.

**Step 2. Build a scoring system (reward function).** Have ChatGPT produce several answers to the same question (bluffs A, B, C) and let humans rank them, for example A > B = C. Use the rankings to train a scoring model r_φ that takes a question x and an answer y and outputs a score.

<details>
<summary>The reward model loss</summary>

Suppose that for question x ChatGPT gave two answers, y_w and y_ℓ, and a human marked y_w as better:

ℓ(φ) = −log( σ( r_φ(x, y_w) − r_φ(x, y_ℓ) ) )

y_w should score higher and y_ℓ lower. When the scores point the right way, the sigmoid approaches 1 and its log approaches 0.

</details>

**Step 3. Apply reinforcement learning.** Let ChatGPT find ways to earn high scores from r_φ. Reinforcement learning from human feedback is called **RLHF**, and it is commonly trained with **PPO** (Proximal Policy Optimization). The three-step recipe comes from OpenAI's [InstructGPT paper](https://arxiv.org/abs/2203.02155); for PPO itself, see [Schulman et al. 2017](https://arxiv.org/abs/1707.06347).

### DeepSeek: can we skip r_φ?

The slides end with DeepSeek. DeepSeek focuses on producing good thoughts (the reasoning inside `<think>`) rather than answering directly. RLHF still works here, but you'd have to wait for lots of human feedback to know whether the output is any good.

Can we skip learning r_φ? Yes: if the task is a math problem, correctness can be **checked automatically**. A correct answer gets r = 1, a wrong one r = −1, and that is used directly as the reward for reinforcement learning.

The slides stop there and don't go into the specific algorithm DeepSeek uses. For how this "verifiable reward" route works, see the CS336 RLVR post under further reading.

## The week 13 assignment (Chang Gung satellite version)

This week's assignment is the **final project proposal**. Summarized from the [Chang Gung satellite page](https://yangchihyuan.github.io/courses/GenerativeAI2025); the deadline was 2025-05-26:

- Purpose: get students thinking about the final project early and give TAs a chance to guide them
- Describe what you expect your final project to look like; if you've already started, attach links or screenshots
- If a TA thinks the topic needs adjusting, they reply in the comments

Rubric: 0 for not submitting, 2 for a token effort, and 7–10 depending on how completely you explain what the project is meant to show. The more fully you express your idea, the higher the score.

The rules for the final project itself (a Gather Town online conference) are in [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en). For self-study, pick one or two things you built in the first 12 lectures (chatbot, RAG, agent, image web app), combine them, and write a one-page proposal: whose problem it solves, which lectures' techniques it uses, and what the demo will look like.

## Self-check

1. In Breakout, what are the state, action, and reward?
2. Why is the policy-based idea "natural" yet hard to train with supervised learning?
3. What is the key difference between computing Q with MC and with TD?
4. Why should ε start large in ε-greedy?
5. In Step 2 of RLHF, why do humans rank answers instead of writing the ideal answer?

<details>
<summary>Suggested answers</summary>

1. The state is the current game screen, the action is left, right, or stay, and the reward is the points for breaking bricks.
2. Nobody can label the "correct move" for every screen, so the training data can't be prepared.
3. MC waits for the whole episode to finish and adds up every later reward; TD needs only this step's reward and the next state, so it can update after a single step.
4. At first the Q function is bad, and following it strictly would repeat bad decisions. Playing randomly more often lets the agent discover better actions.
5. Step 1 already showed that human examples are never enough. Comparing two answers is much easier than writing a good one from scratch, so rankings can be collected at scale.

</details>

## Further reading

This post stands on its own. To dig deeper:

- Full derivations of policy gradient, actor-critic, and DQN: [Berkeley CS285 L5–10: Policy Gradient, Actor-Critic, DQN, and SAC](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)
- RLHF and DPO: [CME295 Lecture 5: RLHF and DPO](/posts/ai/2026-09-29-cme295-preference-tuning-en), [NTHU NLP guide: GPT-3, InstructGPT, and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en)
- DeepSeek's verifiable-reward route: [CS336 Lecture 16: RLVR](/posts/ai/2026-08-22-cs336-rlvr-en)

Series navigation: [series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | previous, [L12: ControlNet and Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en) | next, [L14: New Trends in Generative AI and the Final Project](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Chang Gung satellite section page: 生成式AI：文字與圖像生成的原理與實務 2025 (schedule, week 13 assignment and rubric)](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese)
- [【生成式 AI】13. 強化學習與生成式 AI 綜合應用 (YouTube recording, 2025-05-13)](https://www.youtube.com/watch?v=xG8ccKlW_Cc) (in Chinese)
- [1132 Generative AI recording playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Chinese)
- [GenAI12 強化學習與生成式 AI 綜合應用 slides (Google Drive, the lecture 13 deck)](https://drive.google.com/file/d/1uPDkwB4uu183yKczp0lcxyIcQC08XdaR/view) (in Chinese)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [Mnih et al. 2015: Human-level control through deep reinforcement learning (Nature)](https://www.nature.com/articles/nature14236)
- [Silver et al. 2017: Mastering the game of Go without human knowledge (AlphaGo Zero, Nature)](https://www.nature.com/articles/nature24270)
- [Ouyang et al. 2022: Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
