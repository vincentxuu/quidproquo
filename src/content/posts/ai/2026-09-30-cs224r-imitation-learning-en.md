---
title: "CS224R L2: Imitation Learning and Policies That Can Represent Multimodal Distributions"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, imitation-learning, flow-matching, reinforcement-learning]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 2
tldr: "Lecture 2 of CS224R Spring 2026 tackles two ways imitation learning fails. First, when demonstrations contain several reasonable behaviors, regression learns only their average. The fix is to make the policy a generative model (Gaussian mixtures, discretization plus autoregression, diffusion or flow matching) and to add action chunking. Second, compounding errors: once the policy slips, it reaches states the demonstrations never covered. The fix is DAgger or human-gated DAgger to collect corrections. The first two parts are exactly what HW1 covers."
description: "Guide to lecture 2 of Stanford CS224R (Spring 2026), based on the official 02_cs224r_imitation_2026 slides and the assigned readings (Diffusion Policy, ALOHA/ACT): why imitation learning needs expressive policy distributions, the flow matching training and sampling loops, action chunking, compounding errors and DAgger, human-gated DAgger, and how robot demonstrations are collected. Companion video: Spring 2025 L2 (supplement)."
draft: false
glossary:
  - term: "behavior cloning"
    aliases: ["BC"]
    definition: "Training a policy by supervised learning on the (state, action) pairs in demonstration data. It is fully offline and needs no reward function."
    context: "Part 1 of CS224R L2, and the subject of HW1 Problems 1–2."
  - term: "compounding errors"
    aliases: ["covariate shift"]
    definition: "Small policy mistakes lead to states the demonstrations do not cover, where the policy is more likely to err again, so errors snowball."
    context: "The root cause is that the policy's outputs affect its next inputs, breaking the i.i.d. assumption of supervised learning."
  - term: "DAgger"
    aliases: ["dataset aggregation"]
    definition: "Run the learned policy, ask the expert what to do in the states it reaches, add those corrections to the dataset, and retrain."
    context: "CS224R L2 uses it against compounding errors; HW1 Problem 3 has you implement it."
  - term: "action chunking"
    definition: "The policy predicts the next k actions at once, executes part of them, then decides again, instead of predicting a fresh action every step."
    context: "From ALOHA/ACT and Diffusion Policy. The HW1 policy predicts 20 steps and executes the first 10."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-imitation-learning)

> **Source year**: based on the Spring 2026 [02_cs224r_imitation_2026 slides](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf) (2026-04-03). The companion video is the [Spring 2025 L2 recording (supplement)](https://www.youtube.com/watch?v=WxRDyObrm_M). The title matches, but the slides were revised for 2026, so details may differ. This is post 2 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

The [previous lecture](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en) stopped on a problem. When the same situation in the demonstrations has two reasonable responses, a policy trained with ℓ2 regression learns their average, an action no one demonstrated. This lecture starts there.

The slides split the day into three parts, and mark the first two as the topic of [HW1](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf):

1. Learning expressive policy distributions
2. Learning from online interventions
3. Time permitting: how to collect demonstrations

The learning goals are specific: how to represent distributions with neural networks, why expressive distributions matter for imitation learning, and what compounding errors are and how to address them.

The schedule lists two optional readings for this lecture: [Diffusion Policy (Chi et al.)](https://arxiv.org/abs/2303.04137v5) and [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (Zhao et al., i.e. ALOHA/ACT)](https://arxiv.org/abs/2304.13705).

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=WxRDyObrm_M
title: Spring 2025 Lecture 2: Imitation Learning (YouTube, supplement)
```

Original videos: [Spring 2025 Lecture 2: Imitation Learning (YouTube, supplement)](https://www.youtube.com/watch?v=WxRDyObrm_M)

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## Problem one: the mean is not the answer

L1 ended here: discrete actions can use a categorical distribution, which is maximally expressive. For continuous actions, a network that outputs μ and σ gives a single-peaked Gaussian, which is not expressive enough.

This lecture's fix fits in one line: **borrow generative models**. An image diffusion model learns p(image | text description). An autoregressive language model learns p(next word | words so far). Imitation learning needs p(action | observation), which has the same shape.

So **imitation learning version 1** becomes:

1. Take the expert demonstrations
2. Train a generative model of the expert's actions: minimize −E₍ₛ,ₐ₎∼𝒟[log πθ(a | s)], i.e. maximize the log probability of the demonstrated actions under the policy, with an expressive distribution π(· | s)
3. Deploy

The slides list three generative models:

| Approach | Network output | How it represents multiple modes |
|---|---|---|
| Gaussian mixture (GMM) | μ₁, σ₁, w₁, μ₂, σ₂, w₂, … | Several weighted Gaussians |
| Discretize + autoregressive | p(aₜ,₁), p(aₜ,₂ \| âₜ,₁), p(aₜ,₃ \| âₜ,₁:₂), … | Each action dimension is binned and predicted one at a time |
| Diffusion | the noise ϵₙ at each step | Start from noise and denoise repeatedly |

The slides then pose a question: how do these differ from ℓ2 regression with a bigger network? The hint is in bold:

> Neural network expressivity is often distinct from distribution expressivity.

However large the network, if its output is one number trained with ℓ2 loss, it can represent only one point, and the optimum is still the mean. To represent two peaks you have to change the **output distribution family**, not the depth.

## Flow matching: moving noise onto data

The slides spend the most pages on one kind of diffusion, flow matching. The starting point: we know how to sample from a Gaussian but not from the data distribution. Can we learn a transformation that turns Gaussian samples into data samples?

**Idea 0 (does not work)**: sample a datapoint xᵢ and noise ϵ, and train fθ(ϵ) → xᵢ. The pairing between noise and data is arbitrary, so the model has no reason to use the noise to reach different datapoints, and it collapses back to the mean.

**The real approach**: instead of predicting the endpoint directly, learn a **velocity field** vθ that pushes noise toward data in small steps.

<details>
<summary>Training and sampling loops (as on the slides)</summary>

Training:

1. Sample a datapoint x₁ ∼ D and noise x₀ ∼ 𝒩(0, I)
2. Sample a time t ∼ p(t), e.g. Unif[0, 1]
3. Interpolate linearly: xₜ = t·x₁ + (1 − t)·x₀
4. Minimize ‖vθ(xₜ, t) − (x₁ − x₀)‖²

Sampling:

1. Sample noise x₀ ∼ 𝒩(0, I)
2. For t ∈ {0, δ, 2δ, …, 1 − δ}, set xₜ₊δ ← xₜ + v(xₜ, t)·δ (Euler integration of the ODE)
3. Return x₁

</details>

The intuition: at any point on the interpolation line, the correct direction of travel is x₁ − x₀. The model sees xₜ and t and learns to predict that direction. At sampling time you start from noise and follow the learned direction from t = 0 to 1, ending at something that looks like data. Different starting noise ends at different peaks, so multimodal distributions come out naturally.

For imitation learning, the slides describe learning a **conditional** velocity field: denoise the action aₜ, conditioned on the state sₜ. They credit Peter Roelants' [flow matching intro](https://peterroelants.github.io/posts/flow_matching_intro/) for the visualization. HW1 Problem 2 has you implement this schedule and loss yourself.

**How much does it help?** The slides show two sets of results, sourced from the [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/) and [ALOHA Unleashed](https://aloha-unleashed.github.io/) project pages. On a simulated transport task with a single demonstrator, diffusion and GMM are close. With multi-human data, GMM's success rate falls below half while diffusion stays near 90%. On a real shirt-hanging task (multi-human data), diffusion also clearly beats L1 regression.

**Multi-human data is multimodal data.** That is the point of the chart, not the exact gap.

The slides then list industry examples, labeled by distribution type. In robotics, Physical Intelligence π0.6, NVIDIA GR00T and Figure Helix use diffusion, and OpenVLA uses discretization plus autoregression. In autonomous driving, Waymo EMMA and Wayve LINGO-2 both use discretization plus autoregression.

## One more trick: action chunking

So far the policy has been π(aₜ | sₜ). At 50 Hz, that means a new decision every 20 ms.

The alternative is to predict a chunk of actions aₜ:ₜ₊ₖ from sₜ and decide again only every k steps, executing the chunk open loop. The slides give two reasons:

1. It often works much better
2. It leaves more compute time for policy inference

The slides name ALOHA and Diffusion Policy as the papers that introduced action chunking, and add three follow-up analyses: [Action Chunking and Exploratory Data Collection…](https://arxiv.org/pdf/2507.09061), [Bidirectional Decoding](https://arxiv.org/pdf/2408.17355), and [Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/pdf/2506.07339).

HW1 uses this directly: the Flappy Bird policy predicts 20 target positions at once and executes only the first 10 before querying again, which the handout calls receding horizon control.

**The summary of part one** is a two-column comparison. With one consistent demonstrator, a unimodal distribution is enough. With data from multiple demonstrators, you need an expressive generative model. This approach is fully offline:

- Pros: no data needed from the policy itself (online data can be unsafe and expensive), and no reward function to define
- Cons: it may need a lot of data to perform reliably

## Problem two: errors grow on their own

In supervised learning, the input x does not depend on the model's predicted label ŷ. Supervised learning of behavior is different: **predicted actions affect the next state**. A small mistake puts the policy in a state slightly away from the demonstrations. There it is less familiar and more likely to err, so it drifts further.

The slides write this as p_expert(s) ≠ p_π(s): the states the expert visited and the states the learned policy visits are distributed differently. This is **covariate shift**, and errors compound.

There are two fixes. The first is to collect a huge amount of demonstration data and hope for the best. The second is to collect data of **corrective behavior**: how to get back on track once the policy has drifted.

### DAgger: ask the expert where the policy actually goes

The **DAgger (dataset aggregation)** loop:

1. Roll out the learned policy πθ to get s′₁, â₁, …, s′_T
2. Ask the expert for the action at each visited state: a* ∼ π_expert(· | s′)
3. Add the corrections to the dataset: 𝒟 ← 𝒟 ∪ {(s′, a*)}
4. Update the policy on the new dataset

The upside is data-efficient learning from an expert. The downside is that it can be hard for the expert to say what to do while the agent is in control. Picture sitting in the passenger seat while a not-yet-competent policy drives, and having to call out the correct steering angle at every moment.

### Human-gated DAgger: let the expert take over

The slides ask whether there is another way to collect corrections. The answer is to let the expert **take full control**:

1. Start rolling out the policy
2. When it makes a mistake, the expert intervenes at time t
3. The expert provides a (partial) demonstration s′ₜ, a*ₜ, …, s′_T
4. Add the new demonstrations from t onward to the dataset
5. Update the policy

This is **human-gated DAgger** (HG-DAgger). The upside is a much more practical interface for corrections. The downside is that in some domains it is hard to catch mistakes quickly. The slides leave an open question: could you detect automatically when an intervention is needed?

HW1 Problem 3 implements a DAgger variant that relabels with a deterministic expert; see the [HW1 post](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en) in this series.

## Where demonstrations come from

The last part is about collecting demonstrations. In some domains people already produce demonstrations you can record, such as driving or texting. Robotics is harder, and the slides compare three interfaces:

| Method | Pro | Con |
|---|---|---|
| Kinesthetic teaching (guiding the robot by hand) | Easy interface | The human is visible in the scene |
| Remote controllers | — | Ease of use varies widely; latency can be high |
| Puppeteering (driving a matching leader rig) | Easy interface | Requires double the hardware |

In some domains demonstrations are not viable at all, such as quadruped robots. Can robots learn directly from videos of people or animals? The slides point to the embodiment gap: differences in appearance, and in physical capabilities and degrees of freedom. Direct imitation is hard, but such data can guide exploration, as in [SFV by Peng et al. (2018)](https://arxiv.org/abs/1810.03599).

## The lecture's summary

The final slide puts the two parts side by side:

- **Part 1: mimic offline demonstrations**, often called behavior cloning (BC). The policy works best as a generative model over actions, and the algorithm is fully offline.
- **Part 2: improve the policy with online interventions**, often called DAgger or HG-DAgger. It needs an interface for expert intervention, and the algorithm runs the policy online.

Both share one upside: no reward function to define. Offline BC is simple and needs no data from the policy. DAgger is a possible path to reliable performance and is more data-efficient than offline BC.

Both share two limits. Reliable performance may need an impractically large amount of data. And **imitation learning offers no framework for improving on its own through practice**. That is what policy gradients, the next lecture, adds. The slides close with one line: many successful methods combine imitation learning and reinforcement learning.

## What you can do tonight

You can check "the mean is not the answer" without a GPU:

```python
import numpy as np
rng = np.random.default_rng(0)
# Two groups of demonstrators: one merges left (-2), one stays straight (0)
a = np.concatenate([rng.normal(-2, 0.2, 250), rng.normal(0, 0.2, 750)])
print("Best constant under ℓ2 regression (the mean):", a.mean())
print("Fraction of demos within ±0.2 of the mean:", np.mean(np.abs(a - a.mean()) < 0.2))
```

Almost no demonstrations sit near the mean. Then download the [HW1 starter code](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip), read the TODOs and docstrings for `FlowMatchingSchedule` in `networks.py`, and work out which lines of the training loop in the collapsed section above correspond to `interpolate` and to `sample`.

## Further reading

- [Berkeley CS285 L1–4: imitation learning, distribution shift and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en): another take on DAgger and distribution shift
- [Diffusion models: forward noising, reverse generation and the ELBO (CS229 notes ch. 14)](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models-en): the math behind diffusion
- [CME295: Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en): the same noise-and-denoise framework applied to language models

**Series navigation**: Previous: [L1: Framing decision-making as an RL problem](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en) | Next: [HW1: Imitation learning on Flappy Bird](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224R home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 2 slides: Imitation Learning (2026)](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)
- [Spring 2025 Lecture 2: Imitation Learning (YouTube, supplement)](https://www.youtube.com/watch?v=WxRDyObrm_M)
- [HW1 PDF (2026)](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [Chi et al. Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137v5)
- [Zhao et al. (2023). Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705)
- [Diffusion Policy project page](https://diffusion-policy.cs.columbia.edu/)
- [ALOHA Unleashed project page](https://aloha-unleashed.github.io/)
- [Peter Roelants, Flow Matching Intro](https://peterroelants.github.io/posts/flow_matching_intro/)
- [Action Chunking and Exploratory Data Collection Yield Exponential Improvements in Behavior Cloning for Continuous Control](https://arxiv.org/pdf/2507.09061)
- [Bidirectional Decoding: Improving Action Chunking via Guided Test-Time Sampling](https://arxiv.org/pdf/2408.17355)
- [Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/pdf/2506.07339)
- [Peng et al. (2018). SFV: Reinforcement Learning of Physical Skills from Videos](https://arxiv.org/abs/1810.03599)
