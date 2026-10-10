---
title: "CS224R HW1: Regression BC, Flow Matching, and DAgger on Flappy Bird"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, homework, flow-matching]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 3
tldr: "Homework 1 of CS224R Spring 2026 tests imitation learning on a custom Flappy Bird environment. The policy predicts 20 future target heights at once and executes only the first 10. You implement MSE-regression behavior cloning, a flow matching policy, and DAgger, then compare them in easy and hard modes. The PDF, LaTeX template, and starter code are all public, and a CPU is enough to run it. Solutions, the autograder, and Gradescope are not public. This guide covers what each problem asks you to build and answer. It does not give solutions."
description: "A guide to Homework 1 of Stanford CS224R Deep Reinforcement Learning (Spring 2026): the Flappy Bird environment and action chunking (predict 20 steps, execute 10), easy and hard modes, the functions and experiment questions in Problems 1–3, the intuition behind flow matching, the training and evaluation settings in the starter code, and the file mismatches and limits a self-learner will run into."
draft: false
glossary:
  - term: "action chunking"
    definition: "A policy predicts a sequence of future actions at once, executes only the first few, and then queries the policy again."
    context: "CS224R HW1 sets ACTION_CHUNK=20 and EXECUTE_STEPS=10. The PDF calls this way of executing receding horizon control."
  - term: "DAgger"
    aliases: ["Dataset Aggregation"]
    definition: "An imitation learning method that repeatedly rolls out the current learned policy, has an expert relabel the states it visits, merges them with the original demonstrations, and retrains."
    context: "CS224R HW1 Problem 3 uses it to improve regression BC in hard mode."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Source term**: This post is based on the Spring 2026 [Homework 1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf), [LaTeX template](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.tex), and [starter code hw1_starter_code.zip](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip) for [CS224R](https://cs224r.stanford.edu/). I downloaded and read all three anonymously on 2026-09-30. There is no video for this assignment.

This is part 3 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L2 on imitation learning](/posts/ai/2026-09-30-cs224r-imitation-learning-en), which covered three ideas: why a policy needs to represent multimodal distributions, action chunking, and online interventions with DAgger. HW1 puts all three into one small game so you can see for yourself what problem each one solves.

The course schedule says HW1 went out on Friday, April 3, the day of L2, and was due April 10 at 9 pm Pacific. It is worth 10% of the course grade.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## How much is public

On this site's [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) scale, this assignment is **A3 (enough to self-study)**. The problems, template, and full starter code are public, and you don't need cloud compute.

What you can't get:

- Solutions, the autograder, and the Gradescope submission pages
- Clarifications and errata posted on Ed
- TA office hours

Also note the AI-tool rule in the HW1 PDF itself. To make sure students really understand how these imitation learning methods are implemented, the assignment **prohibits** using generative models to help write code. That is stricter than the general policy on the course homepage, which allows discussing problems with AI tools but requires you to write solutions independently. Self-learners aren't bound by the honor code, but the rule tells you what the assignment is for. None of the three algorithms is long, and you learn from writing them yourself.

## The environment: a bird driven by a PD controller

This isn't the original Flappy Bird. Here is how the PDF and the starter code README describe it:

- **Action**: one number between 0 and 1, the bird's *target height*. Inside the environment, a PD controller turns the target into thrust, so the bird has momentum and the policy has to anticipate.
- **Observation**: 4-D and normalized. It holds the horizontal distance to the next pipe, the height of gap 1, the height of gap 2, and the bird's current height. In easy mode, gap 2 equals gap 1.
- **Easy mode**: each pipe has one opening.
- **Hard mode**: single-opening and double-opening pipes alternate.
- **Success**: survive all 1000 steps. Hitting a pipe or the screen edge ends the episode.

The demonstrations come from `Expert` in `expert.py`, which is read-only. Its docstring spells out how it behaves in hard mode. While the pipe is still far away, it hovers midway between the two openings. Once it gets within a set distance (`commit_dist`, default 0.18), it **randomly** picks one opening and targets it until the next pipe appears. Its actions are also smoothed with an EMA.

Read all of `expert.py` before you start. What happens in the three problems traces back to how this expert generates data.

## Action chunking: predict 20, execute 10

The PDF says the policy outputs `ACTION_CHUNK=20` future target heights at once. During a rollout, only the first `EXECUTE_STEPS=10` run before the policy is queried again. The PDF calls this receding horizon control. It notes that most robot learning policies today work this way and that it usually performs much better.

The L2 slides cover the same idea. They list papers that introduced action chunking, including [Diffusion Policy](https://arxiv.org/abs/2303.04137v5), which is also an assigned reading on the schedule.

In code, this means the BC policy's output has 20 dimensions, not 1. In `networks.py`, `BCPolicy` defaults to `state_dim=4, action_dim=20, hidden=256`.

## The code you write: seven TODOs

Every TODO raises `NotImplementedError`. The PDF suggests this order:

| Order | File::function | Problem | Spec from the PDF |
|---|---|---|---|
| 1 | `networks.py::BCPolicy` | Problem 1 | 3-layer MLP: Linear → ReLU → Linear → ReLU → Linear → Sigmoid |
| 2 | BC loss in `losses.py` | Problem 1 | MSE between predicted and expert actions |
| 3 | `networks.py::FlowMatchingSchedule.interpolate`, `.sample` | Problem 2 | See the flow matching section below |
| 4 | `losses.py::flow_matching_loss` | Problem 2 | Tip: call `schedule.interpolate` |
| 5 | `dagger.py::DeterministicExpert.act` | Problem 3 | Same logic as hard-mode `Expert.act`, but pick a strategy that resolves the ambiguity |
| 6 | `dagger.py::rollout_episode` | Problem 3 | Reset the environment, use the policy's action chunks, return state-action pairs |
| 7 | `dagger.py::rollout_and_relabel` | Problem 3 | Roll out with `rollout_episode`, then relabel with `DeterministicExpert` |

`main.py`, `visualization.py`, `flappy_bird_env.py`, and `expert.py` are all marked read-only. The network for flow matching, a 1-D conditional U-Net called `ConditionalUnet1D`, is already written. You only write the schedule and the loss.

## Problem 1: Regression BC (2 points)

Start with the simplest version: an MLP maps the state straight to a 20-step action chunk, trained with MSE against the expert.

Experiments and questions:

1. Run `python main.py --method bc_reg --env easy` and report the mean and standard deviation of episode length over 50 evaluation episodes.
2. Run `python main.py --method bc_reg --env hard` and report the same. No new code is needed.
3. In 2–3 sentences, explain how MSE regression performs in hard mode and why.

Question 3 is the turning point of the whole assignment. Think back to how the expert picks an opening in hard mode, and to why L2 stressed that a policy needs to represent multimodal distributions. This guide won't write those 2–3 sentences for you. Answer with the numbers you got.

## Problem 2: Flow Matching (2 points)

### Intuition: learn a velocity field that flows from noise to the answer

Regression BC gives one answer per state. Flow matching instead learns a **generative model**. Given a state, it starts from random noise and pushes that noise, step by step, into a plausible action chunk.

Training is simple:

1. Take a real action chunk from the dataset and draw Gaussian noise of the same shape.
2. Draw a random time τ between 0 and 1 and take the point that far along the straight line from the noise to the real action. The closer τ is to 1, the more that point looks like the real action.
3. Show the network the state, this in-between point, and τ, and have it predict which way to move. The correct answer is the direction "real action minus noise."

At inference, start from pure noise and take n small steps in the direction the network predicts. The starter code defaults to 20 steps (`NUM_DIFFUSION_ITERS = 20`). The result is an action chunk. Because each run starts from different noise, the same state can produce different action sequences.

The PDF says flow matching is similar to diffusion but simpler to implement, and it usually performs as well or better.

<details>
<summary>Formulas from the PDF (interpolation, loss, Euler integration)</summary>

Let $a_t$ be an action chunk from the demonstrations and $a_{t,0} \sim \mathcal{N}(0, I)$ noise of the same shape. Sample $\tau \sim U(0,1)$ and define the interpolation

$$a_{t,\tau} = \tau a_t + (1-\tau) a_{t,0}$$

Train a network $v_\theta$ to predict the velocity that moves $a_{t,\tau}$ toward $a_t$:

$$\mathcal{L}_{FM}(\theta) = \frac{1}{|\mathcal{D}|}\sum_{(s_t, a_t)\in\mathcal{D}} \left\| v_\theta(s_t, a_{t,\tau}, \tau) - (a_t - a_{t,0}) \right\|_2^2$$

At inference, start from $a_{t,0} \sim \mathcal{N}(0,I)$ and integrate $\frac{da_{t,\tau}}{d\tau} = v_\theta(s_t, a_{t,\tau}, \tau)$ from $\tau=0$ to $\tau=1$. The simplest method is Euler:

$$a_{t,\tau+\frac{1}{n}} = a_{t,\tau} + \frac{1}{n} v_\theta(s_t, a_{t,\tau}, \tau)$$

Repeat n times to get $a_{t,1}$, the action chunk that gets executed. The PDF says `sample` must clamp its result to [0, 1]. The starter code docstring calls this schedule conditional optimal-transport flow matching.

</details>

### What to implement and answer

- `FlowMatchingSchedule.interpolate`: given a clean action chunk and τ, sample noise and return the interpolated point and the target velocity.
- `FlowMatchingSchedule.sample`: start from Gaussian noise, run `num_steps` Euler steps, and clamp the result to [0, 1].
- `flow_matching_loss`: implement the loss above.
- Run `python main.py --method bc_flow --env hard`, report the mean and standard deviation, and explain its hard-mode performance in 2–3 sentences.

If you want the math behind flow matching from the ground up, this site's [MIT 6.S184 flow matching lecture guide](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) starts from ODEs. For this assignment, the intuition above and the three equations in the fold are enough.

## Problem 3: DAgger (2 points)

Problem 3 takes a different route. It keeps the model, the MSE regression policy from Problem 1, and changes the **data** instead.

Here is how the PDF describes it. Repeatedly roll out the current policy, collect the states it visits, and have the expert relabel each state with its action, giving $\mathcal{D}_{DAgger} = \{(s, \pi_{expert}(s)) \mid s \sim \mathcal{D}_\pi\}$. Merge this with the original data and retrain with the same regression objective. This eases the distribution shift between the expert and the learned policy. The policy reaches states the demonstrations never covered, and DAgger fills in expert labels there.

The expert here is not the original `Expert` but the `DeterministicExpert` you write. The PDF asks for the same logic as hard-mode `Expert.act`, but with a strategy that resolves the ambiguity from the earlier problems, so that the MSE regression policy can succeed.

Experiments and questions:

1. Run `python main.py --method dagger --env hard` with the default 5 rounds. Plot a learning curve with the round on the x-axis and mean episode length with standard-deviation error bars on the y-axis. Draw the Problem 1 regression result as a horizontal line on the same plot.
2. **Comparison** (0.5 points): compare regression, flow matching, and DAgger (final round) in hard mode with a bar chart or table. `python main.py --plot` plots the latest run in `results/`.
3. Answer in 3–4 sentences (0.5 points): why does DAgger improve over rounds? What role does the deterministic expert play? How does this approach fix the problem MSE regression ran into earlier?

Problems 2 and 3 are two different fixes. One makes the model able to represent several answers. The other makes the data contain only one. Putting both results on one chart is where this assignment most rewards your time.

## What you submit

- **Written**: a PDF report with results for Problems 1–3, submitted to "Homework 1 (Written Part)" on Gradescope.
- **Code**: a zip submitted to "Homework 1 (Programming Part)". It holds the `hw1/` folder (with the TODOs in `networks.py`, `losses.py`, `expert.py`, and `dagger.py` filled in) plus four result files: `bc_reg_easy.txt`, `bc_reg_hard.txt`, `bc_flow_hard.txt`, and `dagger_hard.txt`.

## Training settings in the starter code

`main.py` shows the settings that actually run. They affect how you read your results, so it helps to know them up front:

| Item | Setting |
|---|---|
| Expert demos | 500 episodes per mode, cut into action-chunk training data |
| Regression BC | 100 epochs, learning rate 1e-5, batch size 2048 |
| Flow matching | 50 epochs, batch size 2048, 20 integration steps at inference |
| BC and flow evaluation | 50 episodes |
| DAgger | 5 rounds, 30 rollout episodes per round, 50 evaluation episodes per round; a final 100-episode evaluation is saved to the result file |

The device is picked automatically in the order CUDA → MPS (Apple Silicon) → CPU. The README says a GPU isn't required but speeds training up a lot. `colab_instructions.md` gives steps for Colab with a T4 GPU.

## File mismatches you'll hit when self-studying

These are small gaps between the PDF and the starter code. They don't change the assignment, but they are confusing on a first read:

- **The BC loss name**: the PDF says `bc_loss`, while `losses.py` and the README call the function `mse_loss`. Use the name in the code.
- **Problem numbers**: code comments label the flow matching loss "Problem 3" and the DAgger TODOs "Problem 4". The PDF has only three problems: flow matching is Problem 2 and DAgger is Problem 3. Go by the PDF.
- **References to things that aren't there**: comments in `networks.py` and `losses.py` tell you to "compare with `DDPMSchedule`" and "compare with `diffusion_loss`", but neither exists in this version of the starter code.
- **requirements.txt**: the README's folder map lists `requirements.txt`, but the zip doesn't include it. Install with the pip command in `installation.md` instead, which lists `torch gymnasium pygame matplotlib "imageio[ffmpeg]" "numpy==2.2.4"`.
- **Too many hints**: the docstrings at the top of `main.py` and `dagger.py` state outright what happens in Problem 1 and how `DeterministicExpert` should be designed. If you want to work it out yourself, read the PDF and `expert.py` first and those two file headers last.
- **A typo**: the PDF's hard-mode description spells double as "doulbe".

## Something to do tonight

Download the starter code, set up the environment with `installation.md`, write only `BCPolicy` and the BC loss, and run easy mode. It runs on a CPU. Once you have your first numbers, switch to hard mode with the same command and see how far the result drops. Both later problems start from that gap.

## Further reading

- [L2: Imitation Learning](/posts/ai/2026-09-30-cs224r-imitation-learning-en): the theory behind this assignment
- [Berkeley CS285: Imitation Learning and RL Basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en): another course's take on DAgger through distribution shift
- [MIT 6.S184 Flow Matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en): the full flow matching derivation
- [CME295 Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en): diffusion-style methods applied to language models

**Series navigation**: Previous [L2: Imitation Learning](/posts/ai/2026-09-30-cs224r-imitation-learning-en) | Next [L3: Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 homepage and schedule)](https://cs224r.stanford.edu/)
- [CS224R Spring 2026 Homework 1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [Homework 1 LaTeX template](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.tex)
- [hw1_starter_code.zip](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip)
- [L2 Imitation Learning slides (2026)](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)
- [Chi et al. 2024: Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137v5)
- [Zhao et al. 2023: Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705)
