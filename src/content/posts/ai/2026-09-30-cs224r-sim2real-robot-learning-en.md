---
title: "CS224R L16: Sim-to-Real Robot Learning"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, embodied-ai, sim-to-real]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 19
tldr: "Simulators are cheap, fast, and safe, and they hand you labels the real world never will, but they never match reality exactly. In Lecture 16 of CS224R, CMU's Guanya Shi sorts the ways to close that gap into three families: domain randomization trains one policy that works across many physical parameters; teacher-student trains a teacher on privileged information and then has a student that sees only real sensors imitate it; real2sim2real uses real data to make the simulator more faithful. The advanced topics are defining tasks from human motion data and choosing RL algorithms suited to sim2real."
description: "A guide to Lecture 16 of Stanford CS224R (Spring 2026), a guest lecture by Guanya Shi (CMU / Amazon FAR): physics simulators vs. frameworks, the general sim2real recipe and two kinds of mismatch, domain randomization, learning to adapt and teacher-student, RMA and asymmetric actor-critic, system ID and actuator nets, retargeting from human data, RL algorithms for sim2real, and the arc from Sim2Real 1.0 to 4.0, plus the assigned reading, Tan et al. 2018."
draft: false
glossary:
  - term: "domain randomization"
    definition: "Randomize environment parameters e in simulation (mass, friction, sensor delay, appearance, and so on) and train a single policy π(x) that succeeds across them, so it is robust to the unknown real-world parameters. The speaker likens it to robust control."
    context: "The first family of methods for closing the sim2real gap in CS224R L16."
  - term: "privileged teacher"
    definition: "First train a teacher policy π(x, e) in simulation using privileged information only the simulator has (contacts, terrain, friction, disturbances), then train a student policy that sees only real-world-available observations to imitate the teacher, and deploy the student. The second stage is an imitation learning problem."
    context: "The general learning-to-adapt pipeline in CS224R L16."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 19 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L15 Hierarchical RL and Imitation Learning](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il-en) and covers Lecture 16, "RL for Robots: Sim-to-Real Transfer," on May 22, 2026 (Friday of week 8). It is a guest lecture by [Guanya Shi](https://lecar-lab.github.io/), listed on the slides as Assistant Professor at the CMU Robotics Institute and Amazon Scholar at Amazon Frontier AI & Robotics (FAR).

Official materials used:

- The 2026 slides, [16_cs224r_sim2real_robot_learning_2026.pdf](https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf) (46 pages, titled "Sim2Real Robot Learning: A Holistic Overview")
- The assigned reading on the schedule: [Sim-to-Real: Learning Agile Locomotion For Quadruped Robots (Tan et al. 2018)](https://arxiv.org/abs/1804.10332)

Access level is **A3**: the slides download anonymously, and the 2026 recordings live on Canvas.

**A caveat about the companion video.** 2025 split this material differently. The 2025 L16 was "RL for Robots: Autonomous Learning," and sim-to-real moved to 2025 L17, a guest lecture the archive credits to Ashish Kumar. On YouTube it is titled [Lecture 17: Advancing Robot Intelligence](https://www.youtube.com/watch?v=Hp1WBWghrak) (about 50 minutes). With a different speaker, it cannot stand in for the 2026 lecture and is background at most. This post relies only on the 2026 slides.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=Hp1WBWghrak
title: Spring 2025 Lecture 17: Advancing Robot Intelligence (YouTube; different speaker, background only)
```

Original videos: [Spring 2025 Lecture 17: Advancing Robot Intelligence (YouTube; different speaker, background only)](https://www.youtube.com/watch?v=Hp1WBWghrak)

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

The Spring 2026 lecture recordings sit behind Stanford sign-in on Canvas/Panopto; the public YouTube playlist is Spring 2025. Checked: 2026-10-10.

## Setting: why learn in simulation

The previous lecture ended by promising two lectures on robot-specific considerations. The first question: real robots are expensive, slow, and break. Can we learn in simulation and then move the behavior out?

The speaker opens with caveats (slide 2). Sim2real is a big topic, so the lecture favors breadth. The papers are a small subset, and the selection is **heavily biased toward his own group**. Every selected paper is open source. He also points to [holosoma](https://github.com/amazon-far/holosoma), his team's humanoid sim2real framework covering retargeting, policy training, and deployment.

### Simulators are not frameworks

Slides 5–6:

- The lecture covers **physics-based simulators**, where explicit physical laws govern the simulation. There are also non-physics-based simulators, such as world models.
- **A simulator is not a framework.** IsaacSim is a simulator; IsaacLab is a robot learning framework on top of it.
- The MuJoCo family includes MuJoCo (CPU), MuJoCo XLA (MJX) on JAX, MuJoCo Warp, and mjlab. The slide's equation is mjlab = MuJoCo Warp + IsaacLab − IsaacSim: an IsaacLab-style API on MuJoCo Warp.

For a full comparison the slide points to [Simulately's comparison table](https://simulately.wiki/docs/comparison).

### The general recipe

Slide 7 draws the pipeline: a physics simulator (optionally with real2sim) → massively parallel training environments with disturbance forces and terrain randomization → policy optimization with RL (PPO in the figure) → real-world deployment.

### What simulated data buys you

Slides 8–10:

- Cheap, fast, and scalable. Slide 9's example trained for 18 seconds on a 2020 M1 MacBook Pro using RLtools.
- Safe.
- **Labeled**: you get "oracle" or ground-truth access. Slide 10 shows ground truth in PyBullet and cites Joonho Lee et al.'s Science Robotics paper on quadrupedal locomotion over challenging terrain.
- No wear and tear on the robot.

## The problem: two kinds of mismatch

Slides 11–14: sim2real is never easy because the real world is hard to replicate. The gap comes in two kinds:

| | Parametric mismatch | Non-parametric mismatch |
|---|---|---|
| Meaning | The simulator uses different parameters from reality | The simulator ignores some effects entirely |
| Examples | Robot mass and inertia, friction | Complex aerodynamics, fluid dynamics, tire dynamics, imperfect modeling of links |

Slide 11 flags another big challenge: **how do you design rewards or define tasks in simulation?** The speaker defers it to the human-data section.

**Try this**: for the robot task you care about, make a two-column list. Left: parameters you know exist but can't pin down. Right: effects the simulator probably doesn't model at all. The left column suits domain randomization and system ID below; the right column usually needs residual models or real data.

## Mechanism 1: domain randomization

Slide 16 writes it as one equation. The dynamics are x_{t+1} = f_sim(x_t, u_t, e). **Randomize e** and train a **single** policy π(x) that works for many e. The speaker's one-line summary: this is essentially **robust control**.

The slide notes that the original paper focused on perception, but the idea is now used everywhere in simulation: perception, dynamics, sensor input, delay. The slide does not name the original paper.

Both examples come from the speaker's team:

- Slides 17–18: [Agile But Safe](https://agile-but-safe.github.io/)
- Slides 19–20: RPL (Learning Robust Humanoid Perceptive Locomotion on Challenging Terrains, Zhang et al.), done at Amazon FAR

## Mechanism 2: learning to adapt and teacher-student

Slide 22 also randomizes e but trains an **adaptive** policy π(x, e). The analogy: **adaptive control**. It doesn't conflict with domain randomization; you can do both, which gives robust adaptive control.

The catch: π(x, e) needs e, and **e is often unknown in the real world**. So the common pipeline learns from a privileged teacher:

1. **Sim**: train a teacher policy π(x, e) with privileged information.
2. **Sim**: train a student policy π'(x, info available in the real world) to learn from the teacher.
3. **Real**: deploy the student π'.

The slide stresses that **step 2 is an imitation learning problem**. Compare [L2 Imitation Learning](/posts/ai/2026-09-30-cs224r-imitation-learning-en): the teacher is an expert you can query at any time.

Slide 24's locomotion example adds details:

- Privileged information contains almost everything the simulator has: contacts, terrain, friction, disturbances.
- The teacher is trained with PPO.
- The student sees only proprioceptive history (IMU, joint angles, and so on).

### Two variants

- **The student need not learn in action space** (slide 25): [RMA](https://arxiv.org/abs/2107.04034) learns in latent space.
- **Asymmetric actor-critic** (slide 26): one-stage training. The "student" is the actor π'(x, real-world info), and the "teacher" is the critic V(x, e). The example is FALCON (humanoid loco-manipulation, L4DC'26): the actor sees current proprioception plus a 4-step history, and the critic also sees root velocity and end-effector force.

<details>
<summary>Why the critic may see privileged information but the actor may not</summary>

This is my addition; the slide doesn't say it. Deployment needs only the actor. The critic exists during training to estimate value and reduce policy gradient variance (see [L4 Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic-en)). So whatever the critic sees has no effect on deployment, and seeing more usually makes its value estimates better.

</details>

## Mechanism 3: real2sim2real

The third family goes the other way: use real data to make the simulator more faithful.

- **System ID** (slide 28): [SPI-Active](https://lecar-lab.github.io/spi-active_/) does sampling-based system ID with active exploration, collecting data with the policy that maximizes Fisher information (Sobanbabu, He et al., CoRL'25).
- **Learned perception or dynamics residuals** (slide 29): use real data to "augment" the simulator, train deep RL in simulation, then deploy.
- **Actuator nets** (slides 30–31): learning an actuator model needs torque labels. To make it "unsupervised," use RL to train a residual torque model that matches the real trajectory.

## Advanced topic 1: defining tasks with human data

Slide 33 returns to the deferred problem: defining tasks and rewards in simulation can be very tricky. It is relatively simple for locomotion and hard for loco-manipulation and dexterous manipulation.

So why not use human data? **No free lunch**, says the slide: there is a "physics gap" between human intents and robot actions, and **simulation can bridge it**. The speaker calls this physics grounding.

Slide 34's two steps:

1. Motion retargeting (typically at the kinematics level)
2. Policy learning in simulation

Whole-body tracking examples include BeyondMimic (August 2025) and [ASAP](https://agile.human2humanoid.com/) (February 2025, RSS'25).

Three more examples:

- [OmniRetarget](https://omniretarget.github.io/) (ICRA'26, slides 35–36): you must **consider the object and the robot jointly**, so it uses interaction-mesh-based retargeting. In the video the robot relies only on proprioception; slide 35 labels a wall flip with a maximum angular rate of 890 degrees per second.
- [Perceptive Humanoid Parkour](https://php-parkour.github.io/) (RSS'26, slide 37): extends this to perceptive settings, chaining dynamic human skills via motion matching.
- SPIDER (slide 38): **dynamics-level** retargeting, posed as an optimal control problem and solved with sampling-based methods. The slide says every demo is a direct open-loop replay of the retargeted action trajectories on the real robot.

## Advanced topic 2: which RL algorithm for sim2real

Slides 40–42:

- **On-policy PG methods like PPO are very effective.** PPO is covered in [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en).
- Making better use of massively parallel environments: SAPG (split and aggregate policy gradient)
- Off-policy methods for sim2real: FastTD3 and FastSAC
- Policy gradients for flow matching policies: FPO and FPO++
- Unsupervised RL with forward-backward representations: BFM-Zero (ICLR'26), which can optimize any user-specified reward at test time

The slides list these by name only, and this post doesn't fill in their details.

## Tying it together: Sim2Real 1.0 to 4.0

Slide 44 reminds us that the control community has done sim2real for decades. **Sim2Real 1.0** used reduced-order models such as an inverted pendulum or a single rigid body as the "simulator," paired with online model predictive control. What the speaker finds fascinating, and strange: no "pretraining" at all, relying 100% on very fast (over 100 Hz) online reasoning.

Slide 45 plots the progression on two axes: when "learning" happens (online reasoning → offline training → both) and simulator fidelity and diversity:

| Version | Approach | Model |
|---|---|---|
| Sim2Real 1.0 | NMPC | Reduced-order model |
| Sim2Real 2.0 | RL | Full simulator |
| Sim2Real 3.0 | RL++ | Sim + real2sim |
| Sim2Real 4.0 | Better model, better RL algorithm, better online reasoning | Generative sim, world models, … |

Slide 46 lists topics the lecture skipped: sim and real co-training, simulation for policy evaluation, and differentiable simulation.

**Try this**: to get started, follow the speaker's hint and pick one open-source paper. Run slide 7's pipeline end to end in holosoma or IsaacLab/mjlab. Add only domain randomization first, then teacher-student, and watch how each step changes robustness in simulation.

## Assigned reading: Tan et al. 2018

The schedule lists [Tan et al. 2018](https://arxiv.org/abs/1804.10332), though the 2026 slides don't cite it directly. Going by the abstract, it is a compact version of the lecture's first half:

- Deep RL learns quadruped locomotion from scratch with simple rewards; users can add an open-loop reference when they want more control over the gait.
- Two moves narrow the reality gap: **improve the simulator** (system identification, an accurate actuator model, simulated latency) and **learn robust policies** (randomized physical environments, perturbations, a compact observation space).
- A real quadruped performs both trotting and galloping.

In this lecture's terms, the first move is real2sim and the second is domain randomization.

The next lecture asks the opposite question: if you already have a pretrained robot foundation model, how do you improve it with RL directly on a real robot? See [L17 RL for Robot Foundation Models (VLAs)](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en).

Further reading on this site:

- [Berkeley CS285 Spring 2026 overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)

## What this post can and cannot confirm

Confirmed: the text, equations, and paper labels in the 2026 slides; the schedule's date, speaker, and reading; the 2025 archive's lecture split and the 2025 video's title and length; and that every project URL on the slides loads. Not confirmed: the content of the many videos and figures, including what task the 18-second training run on slide 9 solved and any real-robot numbers; the details of SAPG, FastTD3/FastSAC, FPO/FPO++, and BFM-Zero; and the content of the 2025 L17 recording, which this post does not rely on.

Series navigation: previous [L15 Hierarchical RL and Imitation Learning](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il-en) | next [L17 RL for Robot Foundation Models (VLAs)](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 16 slides: Sim2Real Robot Learning: A Holistic Overview (Guanya Shi, 2026)](https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf)
- [CS224R Spring 2025 archive](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 17: Advancing Robot Intelligence (YouTube; different speaker, background only)](https://www.youtube.com/watch?v=Hp1WBWghrak)
- [Tan et al. 2018: Sim-to-Real: Learning Agile Locomotion For Quadruped Robots](https://arxiv.org/abs/1804.10332)
- [Kumar et al. 2021: RMA: Rapid Motor Adaptation for Legged Robots](https://arxiv.org/abs/2107.04034)
- [holosoma: Amazon FAR's humanoid sim2real framework](https://github.com/amazon-far/holosoma)
- [LeCAR Lab (Guanya Shi's group)](https://lecar-lab.github.io/)
- [Simulately: robot simulator comparison](https://simulately.wiki/docs/comparison)
- [Agile But Safe](https://agile-but-safe.github.io/)
- [SPI-Active](https://lecar-lab.github.io/spi-active_/)
- [ASAP](https://agile.human2humanoid.com/)
- [OmniRetarget](https://omniretarget.github.io/)
- [Perceptive Humanoid Parkour](https://php-parkour.github.io/)
