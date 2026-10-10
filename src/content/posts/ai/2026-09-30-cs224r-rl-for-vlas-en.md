---
title: "CS224R L17: RL for Robot Foundation Models (VLAs)"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, embodied-ai, vision-language-model]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 20
tldr: "VLAs trained only with imitation learning often plateau around 80% success, while autonomous robots often need 99%+. Lecture 17 of CS224R splits \"how do you improve a VLA with RL on a real robot\" into three routes: recast RL as supervised learning (iterated offline RL), learn a small separate policy on the VLA's representation or diffusion noise, or learn a small policy that edits the VLA's actions. The slides call this an open research problem and describe the content as recent themes plus the speaker's opinion."
description: "A guide to Lecture 17 of Stanford CS224R (Spring 2026), \"RL for Robots: RL for VLAs\": what a VLA and its action expert look like, why imitation plateaus around 80%, two reasons VLAs are hard to train with RL, online vs. iterated offline RL, whether plain PPO works, π*0.6's advantage-conditioned supervised learning, DSRL's diffusion-noise steering, EXPO's edit policy and on-the-fly policy, and the speaker's outlook. New in 2026, with no public recording."
draft: false
glossary:
  - term: "VLA"
    definition: "Vision-language-action model. The most common form of robot foundation model: start from a pretrained vision-language model, train on a mix of robot demonstrations, VLM tasks, and human video, and often attach an action expert that outputs continuous actions with diffusion or flow matching."
    context: "The subject of CS224R L17."
  - term: "diffusion steering"
    definition: "Leave the VLA's weights alone, treat the initial noise of its diffusion process as an action space, and train a small RL policy to output noise that denoises into good actions. CS224R L17 illustrates it with DSRL (Wagenmaker et al., CoRL 2025), trained with SAC."
    context: "Version A of key theme #2 in CS224R L17."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-rl-for-vlas)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 20 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L16 Sim-to-Real Robot Learning](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en) and covers Lecture 17, "RL for Robots: RL for VLAs," on May 27, 2026 (Wednesday of week 9). The slide deck's cover title is "RL for Robot Foundation Models."

Official materials used:

- The 2026 slides, [17_cs224r_rl_vlas_2026.pdf](https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf) (34 pages)
- The schedule **lists no reading** for this lecture; every paper below is one the slides cite

Access level is **A3**: the slides download anonymously, and the 2026 recordings live on Canvas.

**There is no companion video.** This lecture is new in 2026, with no counterpart on the [Spring 2025 archive](https://cs224r.stanford.edu/spring_2025/) or the [2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL). This post relies on the slides alone and does not fill in what the figures and videos leave unsaid.

Slide 4 also sets expectations: **this is an open, active research problem**, and the lecture covers some recent themes plus the speaker's opinion on the area. Read it as a research map, not settled knowledge.

## Course video sources

Official course and existing recording entries are linked below. The Spring 2026 lecture recordings sit behind Stanford sign-in on Canvas/Panopto; the public YouTube playlist is Spring 2025. No public lecture matching this article's scope was found, so nothing is embedded.

Course and recording entries:

- [2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Official course / lecture source](https://cs224r.stanford.edu/)

Checked: 2026-10-10.

## Setting: from simulation to pretrained models

Slide 3 connects this lecture to the last:

- Last lecture: can we do RL on **simulated** robots and transfer behaviors to the real world?
- Today: how do we do RL on **real** robots with **pretrained foundation models**?

### What a VLA looks like

Slides 5–6 describe the most common robot foundation model, the vision-language-action (VLA) model:

- It starts from a pretrained vision-language model (VLM); an alternative design starts from a generative video model.
- The training mixture often includes robot demonstrations (imitation learning), VLM tasks (question answering, captioning, detection), and human video (motion prediction).
- It often includes a diffusion-based **action expert** that:
  - predicts continuous actions with diffusion or flow matching
  - attends to all activations of the LLM backbone
  - is designed to avoid multiple forward passes through the whole backbone
  - often does not pass gradients to the backbone

You implemented flow matching in [HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en). For more intuition, see the [MIT 6.S184 flow matching and diffusion guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en).

### The problem: stuck at 80%

Slide 7: VLAs trained with imitation learning **often plateau around 80%**. The figure shows π0.5 in unseen rooms.

- This mirrors how LLMs get better with RL after SFT (see [L9 RLHF and Preference Optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)).
- Robots acting autonomously often need **99%+** reliability.
- So this is a natural use case for RL fine-tuning, and a pretrained VLA can serve as an effective initialization.

The slide also notes that DAgger helps and is often used alongside RL.

## Why RL for VLAs is hard

Slide 8 gives two reasons.

**1. VLAs are large, so gradient updates are expensive**

- You often want to train in the cloud while robot rollouts run on a local computer.
- Each experiment takes longer to iterate.
- Extensive hyperparameter tuning is expensive and slow.

**2. VLAs are pretrained with imitation learning**

- There is no pretrained value function or critic.
- They are often trained with diffusion or flow matching, which makes off-the-shelf RL algorithms harder to apply.
- They are often trained with action chunking, also an uncommon choice for RL.

### Online or iterated offline

Slide 9 compares the two loops:

| | Online RL (e.g. SAC) | (Iterated) offline RL |
|---|---|---|
| Data per round | 1 timestep | 1k episodes |
| Gradient steps per round | 1 | 10k |
| When there's a bug or a bad hyperparameter | Rerun the experiment and recollect data | Rerun training on the existing dataset |

The slide's conclusion: offline is **much simpler for large models**. Learning rate, number of epochs, gradient clipping: when you get these wrong offline, you just retrain. Offline RL basics are in [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en).

**Try this**: if you're deciding whether to RL-fine-tune a robot or agent model, first estimate how much time and labor one round of data collection costs. The bigger that number, the more you should start with iterated offline RL.

## Tool 1: can we just use PPO?

Slide 11 answers "yes, but." Two examples:

- Fine-tuning OpenVLA with RL: Li et al., [SimpleVLA-RL](https://arxiv.org/abs/2509.09674) (2025)
- Fine-tuning π0.5 with RL: Chen et al., πRL (2026)

The two limits:

- It requires a **massive number of online policy rollouts**, and many papers don't even report the sample count.
- Results are **limited to simulation-based training**.

## Tool 2: iterated offline RL as supervised learning

Slide 12 introduces **key theme #1**: can we build a method on supervised learning? If so, it may scale more easily to large models and datasets.

Two parts:

1. **Learn a value function**: fit V with Monte Carlo.
2. **Use it to get a better policy**: supervise the policy to take the actions V thinks are better.

The slides use Physical Intelligence's [π*0.6](https://arxiv.org/abs/2511.14759) (2025):

- **Value function** (slide 13): fit a multi-task, language-conditioned V on a large demonstration dataset. It uses a pretrained VLM, is conditioned on current images, the language prompt, and episode metadata, and **predicts time to go**.
- **Policy** (slide 14): advantage-conditioned supervised learning.
  - Estimate the advantage A(s, a) from predicted values.
  - Binarize the advantage to tell the policy whether the action was good or bad.
  - Fine-tune the policy with supervised learning, conditioned on the binarized advantage.
- **Full algorithm** (slide 15): collect a large batch of rollouts and interventions → update the value function to predict time-to-go → update the VLA with advantage-conditioned supervised learning, and repeat.

Slide 16's headline: RL post-training gives **2x the throughput** of IL post-training. Slide 17's videos show a robot making a latte with a person and making lattes reliably through 13 hours of operation.

<details>
<summary>Why conditioning on a binarized advantage improves the policy</summary>

This is my addition; the slides don't spell it out. During training the policy sees actions tagged "good" and "bad" and learns the action distribution under each tag. At inference you always pass "good," so it samples only from the good-action distribution. The whole loop stays supervised, with no policy gradient, which sidesteps slide 8's problem that diffusion and flow matching resist standard RL. The idea is close to the advantage-weighted methods from L7: both use the advantage to filter or weight the supervision signal.

</details>

### Is this the best recipe?

Slide 18 lists the speaker's own reservations:

1. TD updates should be able to beat Monte Carlo value learning, even at large scale.
2. The method should also benefit from more powerful policy improvement.
3. Online RL should be more data efficient and reach higher performance by seeking out failure modes and ruling out new strategies faster, at the cost of more infrastructure.

## Tool 3: online RL by reducing dimensionality

Slide 20 introduces **key theme #2**: instead of fine-tuning the VLA end to end, **learn a separate Gaussian policy using the VLA's representation**. Two versions:

- **Version A**: treat the VLA's diffusion noise as an action space and train an RL policy to control it (Wagenmaker et al., DSRL, 2025).
- **Version B**: compress the VLA's visual representation and do RL on top of it (Xu et al., RLT, 2026).

A side note on the slide: after RL, you can **distill the policy's data back into the VLA**.

### DSRL: a policy that picks the noise

Slides 21–23 expand version A, from [Steering Your Diffusion Policy with Latent Space Reinforcement Learning (Wagenmaker, Nakamoto, Zhang et al., CoRL 2025)](https://arxiv.org/abs/2506.15799). The intuition: different noise vectors denoise into different actions, so train a policy to output noise that leads to good actions.

Sampling:

1. Sample w_t ∼ π_steer(· | s_t; θ).
2. Denoise an action chunk a_{t:t+h} = π_VLA(s_t, w_t).
3. Run a_{t:t+h} in the environment and observe s_{t+h}.

Training:

1. Collect a rollout (s_1, w_1, r_1, …, s_T) and add it to the buffer.
2. Sample a minibatch of transitions from the buffer.
3. Update Q_ϕ(s_t, w_t) and π_steer(w_t | s_t; θ) with **SAC**.

Slide 23's numbers: 65 online episodes, about 10k steps, and **roughly O(100x) more efficient than PPO**.

Note that Q takes the noise w as input, not the actual action a. The VLA is frozen and treated as part of the environment, so SAC only has to handle a low-dimensional Gaussian policy. That sidesteps both of slide 8's problems at once: the model's size and diffusion's resistance to RL. SAC is covered in [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en).

## Tool 4: online RL with a small policy that edits actions

Slide 25 introduces **key theme #3**: learn a small Gaussian policy that **edits** the (diffusion) VLA's actions. Two versions:

- **Version A**: an actor-critic algorithm, then distill back into the VLA (Xiao et al., Probe-Learn-Distill, 2025)
- **Version B**: an actor-critic algorithm plus best-of-N sampling at test time (Dong et al., EXPO-FT, 2026)

### EXPO: an edit policy plus sampling

Slides 26–30 walk through [EXPO: Stable Reinforcement Learning with Expressive Policies (Dong, Li, Sadigh, Finn, ICLR 2026)](https://arxiv.org/abs/2507.07986). The basic recipe:

1. Optimize a smaller Gaussian **edit policy** to maximize Q-values, like typical RL.
2. Train the base policy with imitation on all successes.

The slide warns that on its own this **may not be stable**: the edit policy naturally lags behind the Q-function, and it could collapse.

The stabilizer is to **maximize the latest Q-function on the fly via sampling** (slide 27):

1. Sample multiple a from π_base.
2. Sample multiple ã from π_edit(ã | s, a).
3. Pick the one in {a_1, …, a_n, ã_1, …, ã_n} with the highest Q.

This reduces lag behind the Q-function and is resilient to edit-policy collapse. The speaker asks whether it can be viewed as a form of **test-time scaling**.

Slide 28 carries a "!!" note: when fitting Q, how do you pick a′ in the Bellman backup? **Use the on-the-fly policy**, the same sample-then-pick-highest-Q procedure.

Slide 30's ablations:

- No edit policy: value maximization is significantly hindered.
- No on-the-fly policy in the Bellman backup: poor performance in some environments.

Slide 29 shows real-robot results from EXPO-FT (Dong, Hung, Gao, Sadigh, Finn, 2026, Sample-Efficient RL Fine-Tuning for VLAs):

- Higher reliability than SFT and DAgger
- Trained on 19 minutes of experience on average, about 11k steps
- Learns more efficiently and effectively than DSRL and HIL-SERL

**Try this**: if all you have is a frozen VLA, or any frozen generative policy, this lecture gives you two entry points that leave its weights alone: control its input noise, or add a small corrector on its output. Start with whichever interface your stack exposes most easily.

## Tying it together: summary and outlook

Slide 32's summary:

- **Challenges**: VLAs are large, so gradient updates are expensive; VLAs are pretrained with imitation learning.
- **Three themes**:
  - #1: build on supervised learning for scalability (offline RL)
  - #2: learn a separate Gaussian policy on the VLA's representation (online RL)
  - #3: learn a small Gaussian policy that edits the (diffusion) VLA's actions (online RL)

Slide 33 is the speaker's outlook, in two parts:

1. **Exciting progress**: evidence that RL can substantially improve the performance and speed of state-of-the-art VLAs, and evidence of reaching the performance needed for real-world deployment.
2. **No satisfying solution yet**: online RL should be more efficient and effective than offline, and needing residual policies or dropping to a latent space **seems unsatisfying** compared with doing RL directly on the VLA's weights.

This closes the loop on slide 41 of [L15 Hierarchical RL and Imitation Learning](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il-en), which called RL fine-tuning of large (hierarchical) robot systems an open and important research direction.

The final lecture covers a summary, open problems, and how to do RL research. See [L18 Frontiers and How to Do Research](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research-en).

Further reading on this site:

- [Berkeley CS285: inference and offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en)
- [CS336 RLVR](/posts/ai/2026-08-22-cs336-rlvr-en), the LLM-side counterpart of "RL after SFT"

## What this post can and cannot confirm

Confirmed: the text, algorithm steps, numbers (80%, 99%, 2x, 13 hours, 65 episodes / ~10k steps, O(100x), 19 minutes / ~11k steps), and paper labels in the 2026 slides; the schedule's date and the absence of a reading; and that neither the 2025 archive nor the playlist has a matching lecture. Not confirmed: who gave this lecture (the slides name no one and just say "my opinion"); the specific values, baselines, and setups behind each figure; and the full papers for πRL, RLT, Probe-Learn-Distill, and EXPO-FT, which I did not find or open and cite only from the slide labels.

Series navigation: previous [L16 Sim-to-Real Robot Learning](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en) | next [L18 Frontiers and How to Do Research](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked the official page and public playlist again; no matching public recording, so status unchanged.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 17 slides: RL for Robot Foundation Models (2026)](https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf)
- [CS224R Spring 2025 archive (no matching lecture)](https://cs224r.stanford.edu/spring_2025/)
- [Physical Intelligence 2025: π*0.6: a VLA That Learns From Experience](https://arxiv.org/abs/2511.14759)
- [Wagenmaker et al. 2025: Steering Your Diffusion Policy with Latent Space Reinforcement Learning (DSRL)](https://arxiv.org/abs/2506.15799)
- [Dong et al. 2025: EXPO: Stable Reinforcement Learning with Expressive Policies](https://arxiv.org/abs/2507.07986)
- [Li et al. 2025: SimpleVLA-RL: Scaling VLA Training via Reinforcement Learning](https://arxiv.org/abs/2509.09674)
- [Luo et al. 2024: Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning (HIL-SERL)](https://arxiv.org/abs/2410.21845)
- [Physical Intelligence 2025: π0.5](https://arxiv.org/abs/2504.16054)
