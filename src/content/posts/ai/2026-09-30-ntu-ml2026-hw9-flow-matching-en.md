---
title: "Reading NTU ML 2026: HW9 Flow Matching — From VAE to MeanFlow, Then Counting Inference Steps on a Swiss Roll"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, flow-matching, diffusion-model, generative-models]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 19
tldr: "HW9 has 19 questions worth 10 points, answered only on NTU COOL with no code submission. The first 16 cover four papers — DDPM, Flow Matching, Rectified Flow, and MeanFlow — ending with questions that compare their training signals and few-step generation. The last 3 require the Colab: train two small MLPs on a 2D Swiss roll, one Flow Matching model that learns instantaneous velocity (always evaluated with 50 Euler steps, converged at Histogram JS ≤ 0.10) and one MeanFlow model that learns average velocity (always one-step, ≤ 0.40). Then compare 1 step vs 1 step, Flow Matching across Euler step counts, and Euler vs RK4 at equal steps and at similar compute. The PDF includes a generative-modeling tutorial that skips most of the math, and every question is published in Chinese and English. Outside readers miss only the COOL grading and answers."
description: "A guide to HW9 \"Flow Matching\" in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw9.pdf, the homework Colab, and the TA video: three prerequisite videos, the PDF's generative-modeling tutorial (VAE → Diffusion → Score-based → Flow Matching → MeanFlow), how the 19 questions split and what each paper is tested on, the Colab's Swiss roll data, FlowNet and MeanFlowNet, MeanFlow's JVP training target, the Histogram JS metric and convergence standards, Euler vs RK4 compute comparisons, and the limits for self-learners."
draft: false
glossary:
  - term: "NFE"
    aliases: ["number of function evaluations"]
    definition: "How many times the neural network is called to generate one sample. Euler calls it once per step; RK4 about four times."
    context: "HW9 uses it to frame the quality/efficiency trade-off of diffusion and flow models, and to set up the fair comparison of 20 Euler steps vs 5 RK4 steps."
  - term: "MeanFlow"
    aliases: ["Mean Flows", "average velocity field"]
    definition: "Instead of the velocity at one instant, learn the average velocity u(z, r, t) over an interval [r, t], which allows jumping from noise to data in one step."
    context: "The HW9 Colab uses a JVP to get the time derivative of u and builds the target v − (t − r)·du/dt."
  - term: "Histogram JS"
    aliases: ["Jensen-Shannon divergence", "JSD"]
    definition: "Bin both the target and generated point clouds on the same 64×64 grid, normalize the counts into probability distributions, and compute the Jensen-Shannon divergence. Lower is better."
    context: "HW9 convergence standards: Flow Matching ≤ 0.10, MeanFlow one-step ≤ 0.40."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching)

**This post follows HW9 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 19 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous post covers the last regular lecture, [Can AI Improve Itself? (Part 2)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en). This homework doesn't map to any lecture this semester; the generative-modeling background comes from prerequisite videos.

Official materials used: the homework slides [hw9.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw9.pdf) (the first 23 pages explain the task; the rest are the questions in Chinese and English), the [homework Colab](https://colab.research.google.com/drive/1R1CNujj6-kVPkl53RQLt5kE7tYVS-Zmp?usp=sharing) (57 cells), and the TA video listed on the course page, [ML 2026 Spring HW9 - Flow Matching](https://youtu.be/wAAeuMQ9r5c). The course page lists 5/22 as the release date; the deadline is 2026/06/11 23:59:59 (UTC+8), no late submissions, with grades out by 2026/06/14. The TAs are 林育正, 吳岳霖, 林禹融, 蘇炳揚, 陳品睿, and 江履方.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=wAAeuMQ9r5c
title: TA video: ML 2026 Spring HW9 - Flow Matching
```

Original videos: [TA video: ML 2026 Spring HW9 - Flow Matching](https://www.youtube.com/watch?v=wAAeuMQ9r5c)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Access level: A3, but no official answers

- **Available**: the homework PDF, the Colab starter code, and all 19 questions, printed in the PDF in both Chinese and English.
- **Not available**: answers are submitted on NTU COOL, which needs an NTU account, so outside readers get no grading and no answer key. This post gives no answers to any question.
- **Hardware**: the Colab asks you to enable a T4 or another GPU. The data is 2D points and the models are small MLPs, so the load is light.

## Prerequisites: three older videos

PDF pages 3–5 ask you to watch three of Lee's videos first (all in Mandarin); there is no new lecture on this topic this semester:

1. [Flow-based Generative Model](https://www.youtube.com/watch?v=uXY18nzdSsM) (ML2019 Spring)
2. [【生成式AI】Diffusion Model 原理剖析](https://www.youtube.com/watch?v=ifCDXFdeaaM) (how diffusion models work)
3. [【生成式人工智慧與機器學習導論2025】第 9 講](https://www.youtube.com/watch?v=ccqCDD9LqCA) (GenAI & ML Intro 2025, lecture 9: generation strategies for images and audio)

English-language alternatives on this site: [MIT 6.S184 L2: Flow matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) goes from conditional paths to the marginal vector field, and [CMU 11-785 Lecture 23: Diffusion models](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en) covers the DDPM side.

## The PDF's tutorial: one line from VAE to MeanFlow

PDF page 6 states the goal: learn the popular generative models built on diffusion and flow, then **compare their inference-time efficiency**. It recommends four papers for an overview: [DDPM](https://arxiv.org/abs/2006.11239), [Flow Matching](https://arxiv.org/abs/2210.02747), [Rectified Flow](https://arxiv.org/abs/2209.03003), and [MeanFlow](https://arxiv.org/abs/2505.13447). Pages 7–16 then give a tutorial that "skips much of the math". Its order is a readable path on its own:

1. **The goal of generative modeling** (p. 7): learn to transport an easy-to-sample distribution (such as a Gaussian) to the data distribution.
2. **VAE** (p. 8): learn a latent close to a Gaussian and decode it back to data. The ELBO derivation is skipped; the PDF points to [problem P4 of ML 2025 Fall HW4](https://ntueemlta2025.github.io/homeworks/hw4/ml-2025fall-hw4-math.pdf) and to [Tutorial on Diffusion Models for Imaging and Vision](https://arxiv.org/abs/2403.18103).
3. **From VAE to diffusion** (pp. 9–11): one-step encoding is too hard for the model, so add noise gradually and let a scheduler replace the encoder. Adding noise is the forward process; what you learn is the step-by-step denoising reverse process. Each step can be read as predicting the clean image and then estimating the next, less noisy state; see DDPM and [DDIM](https://arxiv.org/abs/2010.02502) for why that works.
4. **Score-based** (p. 12): push the number of steps to infinity, the model becomes continuous and connects to a stochastic differential equation ([Score-Based Generative Modeling through SDEs](https://arxiv.org/abs/2011.13456)). The PDF notes this paper isn't covered in the homework.
5. **Flow Matching** (pp. 13–14): from this view, the denoising path can drift from the conditional optimal transport path and make diffusion sampling overshoot. Why not build a linear transport path and regress its velocity? After training, integrate the velocity field with an ODE solver such as Euler. Cites [Flow Matching Guide and Code](https://arxiv.org/abs/2412.06264).
6. **MeanFlow** (pp. 15–16): diffusion and flow models call the network many times, so NFE is high and quality trades off against speed. Learn the **average velocity** instead and few-step generation becomes possible; the MeanFlow Identity gives a training objective for exact few-step inference.

## How the 19 questions split

PDF page 17: **19 questions, 10 points total**.

| Part | Questions | Points | Content |
|---|---|---|---|
| Part 1: Paper Reading | Q1–Q16 | 0.5 each | The four papers |
| Part 2: Coding | Q17–Q19 | 0.5 / 0.5 / 1.0 | Run the Colab, read the results |

You only complete the quiz on NTU COOL; no code submission. There's no attempt limit and the highest score counts. The PDF suggests working through the Colab before the paper questions.

From the question text, Part 1 breaks down roughly like this:

- **Q1–Q3, Flow Matching**: the core idea (a time-dependent velocity field, the link to continuous normalizing flows), why the paper discusses the Optimal Transport path, and when Flow Matching's quality or efficiency is limited.
- **Q4–Q6, MeanFlow**: why instantaneous velocity isn't the most natural target for one-step generation, how MeanFlow differs from other fast-sampling methods such as distillation, and which deployment settings favor it.
- **Q7–Q9, DDPM**: the original paper's core contribution, the noise-prediction view, and what progressive lossy decompression means.
- **Q10–Q12, Rectified Flow**: why straight paths relate to sampling efficiency, what reflow does, and where the method fits (for example transport between two empirical distributions).
- **Q13–Q16, cross-paper comparison**: four angles on all four papers — training signal, few-step generation, how to explain "bad at 1 step but good at 50", and what a method must report when it claims to be faster than DDPM.

Think about Q16 before you start, because it is really the theme of the whole homework. Saying a method is "faster" means comparing NFE at equal quality, quality at equal NFE, whether distillation or extra training cost was used, and the solver settings.

## The Colab: two small MLPs turn Gaussian noise into a Swiss roll

The Colab says you'll train two flow-based generative models that turn Gaussian noise into a 2D **Swiss roll**, use the results to answer the COOL questions, and "please do not change the evaluation settings".

**Data**: `make_swiss_roll` avoids sklearn. It samples angles from 1.5π to 4.5π to draw a spiral, adds Gaussian noise with std 0.15, centers and standardizes it, and scales it to sit roughly within [-4, 4]: 20,000 points in total. Batch size is 512.

**Check the direction of the path first**: in this Colab, **t = 0 is data and t = 1 is noise**. The path is x_t = (1 − t)·x_0 + t·x_1 and the target velocity is v = x_1 − x_0. Generation starts from noise at t = 1 and integrates back to t = 0. When you read the papers, note that they don't all use the same time direction.

**Both networks** are MLPs with hidden size 128 and three SiLU layers, outputting a 2D vector that means "which way this point should move". Time goes through a sinusoidal embedding, which the Colab says is similar to positional embeddings in Transformers (covered in this series' [Positional Embedding post](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en)).

| | FlowNet (Flow Matching) | MeanFlowNet (MeanFlow) |
|---|---|---|
| Input | Point x_t, time t | Point z, interval start r, end t |
| Output | Instantaneous velocity | Average velocity over [r, t] |
| Evaluation setting | Euler, fixed 50 steps | Fixed 1 step |
| Convergence standard | Histogram JS ≤ 0.10 | Histogram JS ≤ 0.40 |

**Training** uses AdamW (lr 1e-3, weight decay 1e-4) and MSE loss, with 50 epochs by default. The Flow Matching target is simple: sample x_t at a random t and predict x_1 − x_0. MeanFlow is more interesting because it needs the derivative of the model's output along the time direction.

<details>
<summary>Expand: how the Colab builds MeanFlow's training target</summary>

Each batch samples two times and sorts them so r ≤ t, then sets z = (1 − t)·x_0 + t·x_1 and v = x_1 − x_0.

Next, `torch.func.jvp` computes both the model output u = u(z, r, t) and its directional derivative du/dt along the tangent (v, 0, 1). That tangent means: z moves with velocity v, r stays fixed, t advances at rate 1.

The target is

u_target = v − (t − r) · du/dt

The loss is MSE(u, u_target), and the target is `detach()`ed so it acts as a fixed label. Gradient clipping (max norm 1.0) is applied as well.

At generation time, one step jumps straight from t = 1 to r = 0: z_0 = z_1 − (1 − 0)·u(z_1, 0, 1). Multiple steps split [0, 1] into intervals and repeat.

</details>

**Tuning rules**: if Flow Matching misses the standard, raise `FLOW_EPOCHS` and retrain; **don't change the 50 inference steps** to game the score. Same for MeanFlow: raise `MEANFLOW_EPOCHS`, don't add inference steps. The Colab also tells you to look at the plots, not just the number, because plots catch obvious failures the number can miss.

**Histogram JS**: lay a 64×64 grid over the square [-4, 4], count which cell each target and generated point lands in, normalize to probability distributions, and compute the Jensen-Shannon divergence. A spiral that's blurry, too thick, or missing an arm gets penalized. The standards depend on model size, sample count, and grid size, so they only mean something inside this homework.

## Q17–Q19: three comparisons

**Q17** asks for a screenshot of the Colab's Summary Histogram JS Table, valid only if both values meet their convergence standards.

**Q18** is multiple choice based on the training curves and intermediate samples: what the two loss curves look like, whether loss fluctuations mean quality is getting worse, whether MeanFlow is harder to optimize, whether loss alone is enough, and whether more training always helps. The Colab plots both losses on one chart and periodically draws the current samples; those are your evidence.

**Q19** (1 point) is a 100–200 word short answer based on the Colab's Final Inference Comparison. It must discuss at least two of these:

1. **1 step vs 1 step**: Flow Matching with one Euler step vs MeanFlow with one step. This comparison shows what MeanFlow contributes.
2. **Euler step sweep**: Flow Matching at 1, 5, 10, 20, and 50 steps.
3. **Equal steps**: 20 Euler steps vs 20 RK4 steps.
4. **Similar compute**: 20 Euler steps vs 5 RK4 steps. RK4 calls the model about four times per step, so 20 RK4 steps cost about as much as 80 Euler steps. Comparing only at equal step counts is unfair to Euler, so the Colab table lists both approximate model calls and measured sampling time.

The question says not to report exact metric values; base the answer on what the samples look like and explain how inference steps, solver choice, and compute budget affect quality. MeanFlow sits out the solver and step sweeps, because its role in this homework is one-step generation.

## Rules and resources

- No plagiarism; cite any resources you use. Don't share code or prediction files with anyone (the PDF says "any living creatures"). A first violation means 0 on that homework and the semester grade × 0.9; more than one means an F.
- Post questions in the NTU COOL HW9 discussion board first. Email subjects must start with `[ML 2026 Spring HW9]`. TA hours are before and after class on Fridays, in room 博理 112.
- PDF page 2 also links a [PyTorch Tutorial](https://youtu.be/6dEp6oRN2NE) (in Mandarin).

## Going further

- **What to read first**: if you only have time for one paper, read [MeanFlow](https://arxiv.org/abs/2505.13447). Its abstract introduces the identity between average and instantaneous velocity, which makes the `u_target` in the expandable section above click.
- **Something to try tonight**: after running the Colab, put Flow Matching's 1-step, 5-step, and 50-step plots side by side and trace the spiral with your finger. You'll see directly why large Euler steps drift off a curved path, which is exactly why Rectified Flow tries to straighten it.
- **Related reading**: the site's full flow-matching course guide is the [MIT 6.S184 series](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en); the [CME295 Diffusion LLM guide](/posts/ai/2026-09-29-cme295-diffusion-llms-en) moves diffusion to text; and [Berkeley CS189 HW2](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en) has a flow-matching problem you can work alongside this one.

## What this post could and couldn't verify

Verified: the full text and embedded links of hw9.pdf; the Colab's markdown and code (data generation, network structure, training target, convergence standards, comparison settings); the release date and TA list on the course page; the titles and uploaders of the TA video and the three prerequisite videos (YouTube oEmbed); and the titles of the four assigned papers and the papers the PDF cites (arXiv API). The PDF links Flow Matching, Rectified Flow, and MeanFlow on OpenReview; this post links the same papers' arXiv pages instead.

Not verified: the TA video has no captions to pull, so this post doesn't transcribe it and any extra hints in it are missing. The saved Colab contains some execution output; this post deliberately quotes none of those values so they don't become answers. No official answers have been released.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Can AI Improve Itself? (Part 2)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en) | Next: [HW10: Spoken Language Model](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [hw9.pdf (ML 2026 Spring HW9: Flow Matching)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw9.pdf)
- [HW9 Colab starter code](https://colab.research.google.com/drive/1R1CNujj6-kVPkl53RQLt5kE7tYVS-Zmp?usp=sharing)
- [TA video: ML 2026 Spring HW9 - Flow Matching](https://youtu.be/wAAeuMQ9r5c)
- [Prerequisite: Flow-based Generative Model (ML2019)](https://www.youtube.com/watch?v=uXY18nzdSsM) (in Mandarin)
- [Prerequisite: 【生成式AI】Diffusion Model 原理剖析](https://www.youtube.com/watch?v=ifCDXFdeaaM) (in Mandarin)
- [Prerequisite: GenAI & ML Intro 2025, lecture 9](https://www.youtube.com/watch?v=ccqCDD9LqCA) (in Mandarin)
- [Denoising Diffusion Probabilistic Models (arXiv 2006.11239)](https://arxiv.org/abs/2006.11239)
- [Flow Matching for Generative Modeling (arXiv 2210.02747)](https://arxiv.org/abs/2210.02747)
- [Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow (arXiv 2209.03003)](https://arxiv.org/abs/2209.03003)
- [Mean Flows for One-step Generative Modeling (arXiv 2505.13447)](https://arxiv.org/abs/2505.13447)
- [Denoising Diffusion Implicit Models (arXiv 2010.02502)](https://arxiv.org/abs/2010.02502)
- [Score-Based Generative Modeling through Stochastic Differential Equations (arXiv 2011.13456)](https://arxiv.org/abs/2011.13456)
- [Flow Matching Guide and Code (arXiv 2412.06264)](https://arxiv.org/abs/2412.06264)
- [Tutorial on Diffusion Models for Imaging and Vision (arXiv 2403.18103)](https://arxiv.org/abs/2403.18103)
- [Auto-Encoding Variational Bayes (arXiv 1312.6114)](https://arxiv.org/abs/1312.6114)
- [ML 2025 Fall HW4 math problems (NTU EE ML TA)](https://ntueemlta2025.github.io/homeworks/hw4/ml-2025fall-hw4-math.pdf)
- [ML 2023 PyTorch Tutorial](https://youtu.be/6dEp6oRN2NE) (in Mandarin)
