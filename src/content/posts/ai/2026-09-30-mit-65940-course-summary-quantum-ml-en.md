---
title: "MIT 6.5940 L22–L23 Course Summary and Quantum Machine Learning: Pruning, NAS, and On-Device Training on Quantum Circuits"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantum-computing, neural-architecture-search, pytorch]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 24
tldr: "The last two lectures of MIT 6.5940 Fall 2024 come in two halves. The first half of Lecture 22 is a 13-page Course-Summary.pdf that redraws the course as three blocks (inference, training, application-specific) on System and Algorithm axes, then lays out the 7-item final project rubric. The second half, Quantum ML Part I, has a recording but no slides. Lecture 23 (Hanrui Wang, 99 slides) covers parameterized quantum circuits (PQCs): data encoding, parameter-shift gradients, probabilistic gradient pruning under noise (QOC), the TorchQuantum library, and QuantumNAS, which searches with a SuperCircuit and then prunes gates. It reads like a replay of the course's supernet and magnitude pruning on quantum circuits. Fall 2026 has replaced both lectures with a guest lecture."
description: "A guide to Lectures 22 and 23 of MIT 6.5940 Fall 2024: the three-block course map in Course-Summary.pdf, related MIT courses, the Lab 0–5 list and final project rubric; then Quantum ML Part II: PQC expressivity and entangling capability, four data encodings, finite-difference, parameter-shift and backprop gradients, SPSA and barren plateaus, quantum classifiers and VQE/QAOA, QOC noise-aware on-chip training with probabilistic gradient pruning, TorchQuantum, and QuantumNAS with its SuperCircuit, noise-adaptive evolutionary search and iterative gate pruning, plus the Fall 2026 schedule change."
draft: false
glossary:
  - term: "parameterized quantum circuit"
    aliases: ["PQC", "variational quantum circuit"]
    definition: "A quantum circuit containing both fixed gates and gates with tunable parameters, usually rotation angles. The parameters can be trained on data like neural network weights. It is the shared backbone of hybrid classical–quantum methods such as VQE, quantum neural networks (QNNs), and QAOA."
    context: "MIT 6.5940 Lecture 23 slides, pages 5 and 77."
  - term: "parameter-shift rule"
    aliases: ["parameter shift"]
    definition: "A way to compute PQC gradients on quantum hardware: shift a parameter θ by a fixed amount in the positive and negative directions, run the circuit once for each, and compute the gradient from the difference. Unlike finite differences, it does not depend on a small epsilon."
    context: "MIT 6.5940 Lecture 23 slides, pages 27–31."
  - term: "barren plateau"
    aliases: ["barren plateaus"]
    definition: "The phenomenon where gradient variance drops sharply as a quantum circuit grows, so gradients all but vanish. It is the PQC version of the vanishing gradient problem."
    context: "MIT 6.5940 Lecture 23 slides, pages 41–42."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml)

> **Edition note**: This post covers Lecture 22 (2024-11-21, Course Summary + Quantum Machine Learning I) and Lecture 23 (2024-11-26, Quantum Machine Learning II) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) (13 pages), [Lec23-Quantum-ML-II.pdf](https://www.dropbox.com/scl/fi/wxpnpwkrl6pw7lb4n4vrg/Lec23-Quantum-ML-II.pdf?rlkey=21msd9zdilhry5pydlkvbn7n4&st=aoyc9pzv&dl=0) (99 pages), and the [Lecture 22](https://youtu.be/svjjD2uthhQ) and [Lecture 23](https://youtu.be/ZDk-GsyInt8) recordings. Page numbers are PDF pages. Facts were checked against the official materials on 2026-09-30. Access level is **A3**: slides and recordings are public. The gap: **Quantum ML Part I has no slides**. The Slides link for Lecture 22 points only to Course-Summary.pdf, so this post does not cover Part I's content.
>
> **Fall 2026**: On the [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940), Chapter IV is a single Guest Lecture on December 1 with no announced topic. The course summary and quantum ML lectures are gone.

**Series position**: Previous: [Lecture 21, on-device training](/posts/ai/2026-09-30-mit-65940-on-device-training-en) | This is the last post in the series | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

After 22 lectures, Song Han wraps up the course in 13 slides, then spends a lecture and a half on what looks like a detour: quantum machine learning. This post first goes through the course summary, then walks the six sections of the Lecture 23 slides. It ends with the question from the series plan: why does a course on efficiency close with this topic?

## Lecture 22, first half: a 13-page course summary

[Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) is short, but it is the only bird's-eye map of the whole course. It is worth skimming before you start the series.

**The one-line pitch (page 2).** The course introduces efficient AI computing techniques that let deep learning run on resource-constrained devices. Students implement model compression techniques and an efficient LLM inference library, and deploy Llama2-7B on a laptop.

**Three blocks, two axes (pages 3–7).** The slides build one diagram page by page:

| Block | What the slides list |
|---|---|
| Efficient Inference | pruning, quantization, neural architecture search, distillation |
| Efficient Training | distributed training, on-device learning, federated learning |
| Application-Specific Optimizations | LLM, VLM, diffusion model |

Page 6 adds System and Algorithm axes on either side, and page 7 labels three departments: EE, CS, and AI+D. The point is that the course sits on both the systems side and the algorithms side.

**Related MIT courses (page 8).** This page surrounds the three blocks with courses to take before or after. The prerequisites are Computation Structures (6.1910) and Introduction to Machine Learning (6.3900). On the EE side: Hardware Architecture for Deep Learning (6.5930) and Microcomputer Project Lab (6.2060). On the CS side: Computer System Architecture (6.5900), Software Performance Engineering (6.1060), and Mobile and Sensor Computing (6.1820). On the AI+D side: Deep Learning (6.S898) and Advances in Computer Vision (6.8300). If you are planning your own follow-up study, this page is MIT's internal roadmap.

**Lecture structure and labs (pages 9–10).** Page 9 sorts the lectures into three columns: Efficient Inference (Pruning, Quantization, NAS, Knowledge Distillation), Efficient Training (Distributed Training, On-Device Learning, TinyEngine on MCU), and Domain-Specific Optimization (LLMs, Diffusion Models, Autonomous Driving). Page 10 lists Labs 0 to 5: getting started with PyTorch, Pruning, Quantization, NAS, LLM Compression, and LLM Deployment on Laptop.

This split does not match the [course page](https://hanlab.mit.edu/courses/2024-fall-65940) exactly. The schedule uses four chapters (I Efficient Inference, II Domain-Specific Optimization, III Efficient Training, IV Advanced Topics). The summary slides use three blocks and put TinyEngine on MCU under Efficient Training. This series follows the course page's schedule; the chapter mapping is in the [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en).

**Final project (page 11).** Poster sessions ran on December 3, 5, and 10, and demos were encouraged. The poster and written report were due December 14: a PDF of at least 4 pages in the NeurIPS template, with a GitHub link to open-source code and ideally a demo video. The rubric has 7 items worth 10 points each:

| Motivation | Technical Soundness | Novelty | Evaluation | Poster Presentation | Written Report | Open Source |
|---|---|---|---|---|---|---|
| 10 | 10 | 10 | 10 | 10 | 10 | 10 |

Self-learners get no grader, but you can use this table to score your own side project. Open source counts as much as motivation.

**Scale and course evaluation (pages 12–13).** Page 12's bar chart shows enrollment growing from 26 to 89 to 222 (2022–2024) and YouTube views growing from 126,515 to 240,653. Page 13 reminds enrolled students to fill in the end-of-term subject evaluation for 4 participation bonus points. That is where the 4% bonus in the course grading comes from.

## Lecture 22, second half: Quantum ML Part I is video only

Lecture 22 is titled "Course Summary + Quantum Machine Learning I", and the [recording](https://youtu.be/svjjD2uthhQ) covers both parts. The course page only posts Course-Summary.pdf, though, so Part I has no slide deck. This post only covers content that can be checked against slides, so watch the recording for Part I. The Lecture 23 slides start at PQCs; if you need quantum computing basics first, watch the second half of the Lecture 22 recording before moving on.

## Lecture 23: Quantum ML Part II

Hanrui Wang gives Lecture 23 (the cover lists him as Incoming Assistant Professor, UCLA CS; PhD, MIT). The Lecture Plan on page 2 has six items, and this section follows them in order.

### 1. Parameterized quantum circuits (PQCs)

Page 4 splits quantum machine learning into four combinations:

| | Classical algorithm | Quantum algorithm |
|---|---|---|
| **Classical data** | CC: the previous 21 lectures | CQ: this lecture |
| **Quantum data** | QC: qubit control, calibration, readout | QQ: processing quantum information on a quantum machine |

So this lecture is about CQ: classical data, with a quantum circuit as the model.

A PQC is a circuit with both fixed gates and parameterized gates (page 5). How do you judge a PQC design? The slides give three angles:

- **Expressivity (pages 6–9)**: how much of the Hilbert space the circuit's states cover, measured by how far their distribution deviates from uniform.
- **Entangling capability (pages 10–13)**: the Meyer-Wallach measure scores how entangled a state is, from 0 (unentangled) to 1 (fully entangled). Averaged over a circuit, it gives that circuit's entangling capability. The plots for both metrics come from [Sim et al.](https://arxiv.org/abs/1905.10876)
- **Hardware efficiency (page 14)**: does the design respect qubit connectivity, and are its gates native to the hardware?

The third point echoes the whole course: fewer MACs does not mean lower latency, and a circuit that looks good on paper may not run well on a real device.

**Data encoding (pages 15–22).** Classical data has to become a quantum state first. The slides list four methods:

- **Basis encoding**: like binary, so x = 2 maps to |10⟩. It is wasteful for a single data point, but superposition lets it represent several at once.
- **Amplitude encoding**: numbers go into the amplitudes of the state vector, so N features need only log N qubits.
- **Angle encoding**: values become rotation angles of the gates.
- **Arbitrary encoding**: design your own PQC and feed the input data in as rotation angles.

### 2. Training PQCs

Training a PQC needs gradients, just like a neural network. Pages 25–32 compare three ways to get them:

- **Finite differences** (pages 25–26): work regardless of the function's structure, but accuracy depends on the choice of epsilon.
- **Parameter shift** (pages 27–31): shift θ once in each direction and run the circuit twice to get the gradient. Pages 30–31 include the proof.
- **Backpropagation** (page 32): in a simulator every operation is differentiable linear algebra, so you can backpropagate directly, but **only on a classical simulator**.

Pages 33–37 combine them into a hybrid flow. Run the quantum circuit to get f. Compute the loss classically and backpropagate to get ∂Loss/∂f. Use parameter shift (or finite differences) on the quantum circuit to get ∂f/∂θᵢ. Combine with the chain rule. The quantum device only ever runs forward passes.

<details>
<summary>Training techniques: SPSA and barren plateaus</summary>

Pages 39–40 introduce SPSA (Simultaneous Perturbation Stochastic Approximation). The slide asks how many circuit runs the original methods need; the answer is 2N (two shifts for each of N parameters). SPSA perturbs all parameters at once and converges similarly to gradient descent.

Pages 41–42 cover barren plateaus: as the circuit grows, gradient variance drops sharply, the quantum version of vanishing gradients.

</details>

### 3. Quantum classifiers

Pages 44–45 use a PQC as a quantum neural network for classification and show the training process. Page 46 adds other uses for PQCs: the Variational Quantum Eigensolver (VQE) and the Quantum Approximate Optimization Algorithm (QAOA).

### 4. Noise-aware on-chip training (QOC)

This is where things start to look familiar. The problem: on real quantum hardware, noise makes computed gradients unreliable (page 48), and **small gradients have especially large relative errors** (pages 49–51; page 51 plots the trend with data from two devices, Santiago and Casablanca).

The fix is probabilistic gradient pruning (pages 51–58), from the [QOC paper](https://arxiv.org/abs/2202.13239). Training alternates between two windows:

1. **Accumulation window**: record each parameter's accumulated gradient magnitude.
2. **Pruning window**: normalize those magnitudes into a probability distribution and skip computing some gradients according to it.

What gets skipped is mostly the small gradients, which are the least reliable ones. Page 60 reports 2%–4% higher classification accuracy and faster convergence, with training time cut in half. Page 61 shows the gap between quantum and classical simulation narrowing on VQE too, and page 63 says probabilistic pruning can give better results.

### 5. TorchQuantum

Research like this needs a good simulator. Pages 66–67 list the design goals of [TorchQuantum](https://github.com/mit-han-lab/torchquantum): fast quantum circuit simulation in PyTorch, automatic gradients for PQC training, GPU acceleration with batch mode, both density matrix and state vector simulators, a dynamic computation graph, easy hybrid classical–quantum networks, gate-level and pulse-level simulation, and converters to frameworks such as IBM Qiskit.

Pages 70–72 show state vector simulation. The state lives in a `tq.QuantumDevice` or `tq.QuantumState`, and there are several ways to apply a gate:

```python
import torchquantum as tq
import torchquantum.functional as tqf

q_dev = tq.QuantumDevice(n_wires=5)
tqf.h(q_dev, wires=1)        # functional style
h_gate = tq.H()
h_gate(q_dev, wires=3)       # module style
```

Page 73 explains that state vectors and gates use native PyTorch data structures; simulation is a gate matrix times a state vector. Page 74 shows two encoders, `tq.AmplitudeEncoder()` and `tq.PhaseEncoder()`, and page 75 converts a model into a Qiskit circuit with `tq2qiskit`.

### 6. Noise-robust quantum circuit architecture search

The last section is [QuantumNAS](https://arxiv.org/abs/2107.10845). Pages 78–79 name two challenges. First, noise means that adding parameters raises noise-free accuracy but lowers measured accuracy, so circuit architecture matters. Second, the design space of gate types, counts, and positions is large.

Page 81 breaks QuantumNAS into four steps:

1. Build and train a SuperCircuit
2. Run a noise-adaptive evolutionary co-search over SubCircuits and qubit mappings
3. Train the chosen SubCircuit
4. Prune quantum gates iteratively

The SuperCircuit is the circuit with the most gates in the design space, and every candidate SubCircuit is a subset of it (page 82). SubCircuits inherit the SuperCircuit's parameters instead of being trained one by one. The slides note that circuits ranked well with inherited parameters also turn out well when trained from scratch (pages 83 and 86). Each training step samples a subset and updates only that subset's parameters (pages 84–85). Page 87 searches for the best SubCircuit and qubit mapping on the target device.

The pruning step (pages 88–92) rests on one observation: a rotation gate with an angle near 0 barely affects the result. So small-angle gates are pruned iteratively and the remaining parameters are fine-tuned.

Pages 93–98 briefly survey other search frameworks: [QuEst](https://arxiv.org/abs/2210.16724), which uses a graph transformer to estimate circuit fidelity, plus neural predictors, reinforcement learning, and differentiable search.

## Why quantum ML comes last

The slides do not say why. What follows is my reading after comparing it with earlier posts: the last three sections of Lecture 23 reuse the course's own tools on quantum circuits.

| What Lecture 23 does | Where the course taught it |
|---|---|
| QuantumNAS's SuperCircuit, inherited parameters, evolutionary search | Once-for-All and weight inheritance in [Lecture 8, hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en); evolutionary search in [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en) |
| Prune gates with angles near 0, then fine-tune | Magnitude-based and iterative pruning in [Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) |
| Search with qubit mapping and native gates in mind | Hardware support in [Lecture 4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en); "MACs are not latency" in Lecture 8 |
| Train directly on noisy hardware, skipping unreliable gradients | [Lecture 21, on-device training](/posts/ai/2026-09-30-mit-65940-on-device-training-en): training on constrained hardware |

That makes this lecture a good final review. If you can say which earlier lecture each step of QuantumNAS comes from, you have the course's core toolkit.

## Fall 2026

The [F26 course page](https://hanlab.mit.edu/courses/2026-fall-65940) marks Chapter IV: Advanced Topics on November 30, puts Lecture 22, a Guest Lecture, on December 1, and then goes straight to final project presentations (December 3, 8, and 10). Neither the course summary nor the quantum ML lectures appear on the F26 schedule, and as of 2026-09-30 the guest speaker and topic are unannounced. For quantum ML, the F24 materials are the only source.

## What to do after these lectures

- **Tonight**: open the rubric on page 11 of [Course-Summary.pdf](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) and score a side project of yours on each item. Evaluation and Open Source are the ones people most often miss.
- If quantum ML interests you: clone [TorchQuantum](https://github.com/mit-han-lab/torchquantum), follow pages 70–72 of Lecture 23 to build a 5-wire `QuantumDevice`, apply an H gate, and print the state vector to check the result.
- To tie the whole course together again: pick one of the three reading paths in the [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en) and reread along it.

## Further reading

- Series entry point and chapter map: [Reading MIT 6.5940 overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)
- NAS search spaces and strategies: [Lecture 7, NAS Part I](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en)
- Open courses by school and the A0–A3 access levels: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 22/23 dates, slide and video links, the four-chapter schedule
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Chapter IV is now a Guest Lecture on December 1
- [Course-Summary.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) — course structure, related courses, lab list, final project rubric
- [Lec23-Quantum-ML-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/wxpnpwkrl6pw7lb4n4vrg/Lec23-Quantum-ML-II.pdf?rlkey=21msd9zdilhry5pydlkvbn7n4&st=aoyc9pzv&dl=0) — source of every Lecture 23 page number and result in this post
- [EfficientML.ai Lecture 22: Course Summary + Quantum Machine Learning Part 1 (YouTube)](https://youtu.be/svjjD2uthhQ)
- [EfficientML.ai Lecture 23: Quantum Machine Learning Part 2 (YouTube)](https://youtu.be/ZDk-GsyInt8)
- [mit-han-lab/torchquantum (GitHub)](https://github.com/mit-han-lab/torchquantum)
- [Wang et al., QuantumNAS: Noise-Adaptive Search for Robust Quantum Circuits (arXiv 2107.10845)](https://arxiv.org/abs/2107.10845)
- [Wang et al., QOC: Quantum On-Chip Training with Parameter Shift and Gradient Pruning (arXiv 2202.13239)](https://arxiv.org/abs/2202.13239)
- [Sim et al., Expressibility and entangling capability of parameterized quantum circuits for hybrid quantum-classical algorithms (arXiv 1905.10876)](https://arxiv.org/abs/1905.10876) — source of the expressivity and entanglement plots in Lecture 23
- [Wang et al., QuEst: Graph Transformer for Quantum Circuit Reliability Estimation (arXiv 2210.16724)](https://arxiv.org/abs/2210.16724)
