---
title: "NCCU Yen-Lung Tsai Generative AI L03: GANs — How Do Two Competing Networks End Up Drawing Pictures?"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, gan, cross-entropy]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 3
tldr: "The prompt \"a cute girl\" has countless correct pictures, so training it as a function only teaches the model the average of all of them. GANs sidestep this by training two networks: a generator G turns a random latent vector into an image, a discriminator D judges real versus fake, and the two compete. L03 walks from the 2014 paper through WGAN, Progressive GAN, StyleGAN's 512-dimensional latent and AdaIN, then Pix2Pix and CycleGAN. An appendix explains cross entropy and KL divergence as a 'surprise index'. Week 3 homework: run a GAN yourself, or explain CE and KL in your own words."
description: "A guide to Lecture 3 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis (Spring 2025, term 1132): why creative AI is not a function, the generator and discriminator, the min-max loss, WGAN and mode collapse, Progressive GAN and StyleGAN, Pix2Pix and CycleGAN, the cross entropy and KL divergence appendix, and the week 3 homework and rubric as published by the Chang Gung satellite class."
draft: false
glossary:
  - term: "mode collapse"
    aliases: ["collapse"]
    definition: "When a GAN generator finds one output that reliably fools the discriminator and produces only that output regardless of the latent vector, losing diversity."
    context: "The L03 slides illustrate it on the WGAN page with a cartoon generator saying 'Whatever, I'll just draw this one every time.'"
  - term: "KL divergence"
    aliases: ["Kullback-Leibler divergence"]
    definition: "A measure of how far apart two probability distributions are: cross entropy minus the entropy of the true distribution. It is 0 when the distributions are identical."
    context: "The L03 appendix uses it to show why KL exposes differences that cross entropy hides when learning soft targets, as in knowledge distillation."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-03-gan)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide follows the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 3 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L02 Neural Networks](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en). The course is taught in Mandarin.

Three official sources back this post: the [Lecture 3 recording](https://www.youtube.com/watch?v=akt4A3OJ9h4) (2025-03-04, 2 h 45 min), the slide deck [GenAI03 GAN](https://drive.google.com/file/d/1UqnoeRSgHfNC0o6X5ENeWmLKqZNagskI/view) (91 pages), and the week 3 homework on the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025). Access level: **A3**. Recordings, slides, homework prompts, and rubrics are all public. Submission and grading run through each school's own platform, so outside readers can only self-assess.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=akt4A3OJ9h4
title: Lecture 03: GANs, once all the rage (YouTube recording, 2025-03-04) (in Mandarin)
```

Original videos: [Lecture 03: GANs, once all the rage (YouTube recording, 2025-03-04) (in Mandarin)](https://www.youtube.com/watch?v=akt4A3OJ9h4)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week fits

L02 framed a neural network as a "function-learning machine": decide what goes in and what comes out, and let it learn the rest. L03 opens with that machine's blind spot: **for creative AI, the input-output relationship is not a function at all.**

This is the course's first real generative model. On the course arc it answers "why is generation hard?" The LLM lecture (L04) and the diffusion lectures (L10–L11) both reuse the intuition built here: a generative model needs a random "idea" among its inputs.

The recording splits into three parts. The first 75 minutes cover GAN fundamentals and StyleGAN. The second hour covers This X Does Not Exist and CycleGAN, then spends nearly 50 minutes on cross entropy and KL divergence. A TA session closes the lecture.

## Why creative AI can't be trained as a function

Slides 4–9 make the point with one example. You want a machine that takes "a cute girl" and returns a picture. The same sentence has countless correct pictures.

One input mapping to many outputs is **not a function**. Force the training anyway and the model learns the **average** of all the correct answers, which probably looks like nothing in particular. Even if it happens to look acceptable, it isn't "creation."

The fix is to add one more input: a randomly generated vector z. The slides call it a **latent tensor** and compare it to a "wild idea out of the blue." The same sentence paired with a different z yields a different picture, and input and output are one-to-one again.

The new problem: how do you map each z to a decent picture? Nobody can label the "correct answer" for every z.

## GANs: train two networks and let them fight

The [2014 GAN paper by Ian Goodfellow et al.](https://arxiv.org/abs/1406.2661) has a clever answer: skip the correct answers and train two neural networks instead.

- **Generator G**: takes a random vector z and outputs an image G(z).
- **Discriminator D**: takes an image and judges whether it is real (from the data) or fake (made by G), scoring it between 0 and 1.

D wants real images near 1 and fakes near 0. G wants its fakes scored near 1. The competition forces G to draw ever more convincing images. The slides quote Yann LeCun (2016) calling adversarial training the most interesting recent development in deep learning.

Slide 18 adds a home-grown example: a font-generation GAN (Variational Grid Setting Network) by NCCU students with Tsai, which received an honorable mention in a GAN competition.

### What training looks like

Slides 29–30 reuse a figure from the original paper. At first the generator's distribution p_g sits far from the real distribution p_data, D tells them apart easily, and G gets a rough start. As training goes on, p_g moves toward p_data. Once training succeeds the two distributions overlap and D can no longer tell which images are real. In the figure, D's curve flattens into a horizontal line.

<details>
<summary>The GAN loss (slides 24–28)</summary>

Two facts first: log is increasing, and log turns multiplication into addition, `log(a·b) = log(a) + log(b)`.

The discriminator D wants both of these as large as possible:

```
E_{x~p_data}[ log D(x) ]          ← real images should score near 1
E_{z~p_z}[ log(1 − D(G(z))) ]     ← fake images should score near 0
```

The generator G only affects the second term and wants it as small as possible (pushing D(G(z)) toward 1). Together this is the paper's min-max objective:

```
min_G max_D V(D, G) = E_{x~p_data}[ log D(x) ] + E_{z~p_z}[ log(1 − D(G(z))) ]
```

Notation: p_z is the latent-vector distribution, p_data the real-world distribution, p_g the generator's distribution.

</details>

## GAN's glory days: WGAN, Progressive GAN, StyleGAN

### WGAN and mode collapse

Slides 31–32 say WGAN "truly pushed GANs to their peak" and name one problem it addressed: **mode collapse**. The cartoon generator says, "Whatever, I'll just draw this one every time. I know the teacher will accept it!" That is, once G finds an image that fools D, it produces only that image no matter what z is. The slides do not go into WGAN's math, and neither does this post.

### Progressive GAN: draw small first, then grow

[Progressive GAN](https://arxiv.org/abs/1710.10196) (Karras et al., NVIDIA, ICLR 2018) starts from a plain observation: generating 1024×1024 directly is hard, while generating low resolution is easy. So the generator begins at 4×4 and grows layer by layer to 8×8 and on up to 1024×1024, "learning from simple to fine." The resulting fake celebrity photos stunned people at the time.

### StyleGAN: can you steer the latent vector?

The next question: if z is an "idea," can you control what comes out? Slide 39 imagines that a latent vector contains a content vector, with a style vector "added" on top.

StyleGAN does something more sophisticated than addition (slides 40–44):

1. Map the 512-dimensional z to another 512-dimensional vector w.
2. Apply an affine transformation to w to get per-channel scale and shift parameters.
3. Inject those parameters into every generator layer with **AdaIN**, adding noise along the way. The generator again grows from 4×4 to 1024×1024.

The slides' metaphor: "w is like a prompt," reminding the network at every layer how to draw. Use one w for content and another for style and you get new mixtures.

<details>
<summary>AdaIN (slide 42)</summary>

For the features x_i of channel i, normalize first, then scale and shift with y = (y_s, y_b) learned from w:

```
AdaIN(x_i, y) = y_s,i · (x_i − μ(x_i)) / σ(x_i) + y_b,i
```

</details>

StyleGAN's results show up on sites like [This Person Does Not Exist](https://thispersondoesnotexist.com/) and the [This X Does Not Exist](https://thisxdoesnotexist.com/) collection. The slides also point to a Colab notebook compiled by instructor 魏澤人 that turns real faces into Disney-style cartoons ([bit.ly/colab_toonify](https://bit.ly/colab_toonify)).

## Conditional generation: Pix2Pix and CycleGAN

GANs can also turn one image into another, not just generate from noise.

- **[Pix2Pix](https://arxiv.org/abs/1611.07004)** (Isola, Jun-Yan Zhu, et al., CVPR 2017) turns satellite images into maps and rough sketches into street scenes. The key design choice: **input and output go into the discriminator together**, so D judges whether the *pair* looks real. The slides recommend Christopher Hesse's [online demo](https://affinelayer.com/pixsrv/) based on the paper; try drawing a cat. The catch is that training data must come in pairs.
- **[CycleGAN](https://arxiv.org/abs/1703.10593)** (Jun-Yan Zhu et al., ICCV 2017) **doesn't need paired data**. It uses two generators (G for A→B, F for B→A) and two discriminators. The famous example turns horses into zebras. The slides also show the failure cases the authors themselves collected.

Slide 58 sums up the era: people once believed GANs were the peak of computer creativity, **until diffusion models appeared**. Diffusion waits until L10–L11.

## Appendix: the cross entropy every AI student needs

The last third of the deck (recording from 1:32:10) is an appendix that has little to do with GANs but is tested by the week 3 homework. Its framing is easy to remember: a "surprise index."

1. **Why not MSE**: with the correct answer [1, 0, 0], model outputs [0.7, 0.19, 0.11] and [0.7, 0.3, 0] give MSE of about 0.14 and 0.18, yet both put 0.7 on the correct class. Cross entropy is 0.36 for both, because it only looks at the correct class.
2. **Information**: an unlikely event surprises us, so `−log p` works as a surprise index. Its formal name is information, `I(x) = −log P(x)`. The slides' example: in nearly rainless California, "heavy rain tomorrow" carries a lot of information, while "sunny tomorrow" is close to stating the obvious.
3. **Entropy**: the average information. With a single certain event, entropy is 0, which is why people call it "disorder."
4. **Classification cross entropy**: with a one-hot correct answer the formula reduces to `−log ŷ_i`. Put low probability on the right answer and you get penalized hard.
5. **KL divergence**: cross entropy minus the true distribution's own entropy. With the true distribution fixed, the two differ by a constant and rise and fall together, but KL shows the *scale* of the gap much more clearly.

<details>
<summary>Formulas and the slides' worked example (slides 70–88)</summary>

```
Entropy:        H(P)    = − Σ_i p_i log p_i
Cross entropy:  H(P, Q) = − Σ_i p_i log q_i      (minimized at Q = P; the minimum is H(P), not necessarily 0)
KL divergence:  D_KL(P‖Q) = H(P, Q) − H(P)       (0 when Q = P)
```

Slide 86 uses a soft target y = [0.7, 0.2, 0.1].

| Model output | Cross Entropy | KL Divergence |
|---|---|---|
| [0.75, 0.15, 0.1] | 0.81 | 0.01 |
| [0.6, 0.3, 0.1] | 0.83 | 0.03 |

The two cross entropies differ by only 0.02, while KL differs by a factor of three. Hence the slides' conclusion: **when you need to learn soft targets, consider KL divergence.** Knowledge distillation is the example. The student model learns the teacher's "reasoning" (a distribution like [0.7, 0.25, 0.05]), not just the hard label.

</details>

## This week's demo notebook

The 1132 term has **no AI-Demo notebook for this lecture**. The instructor's [AI-Demo repo](https://github.com/yenlung/AI-Demo) currently contains no GAN example. The hands-on resources the slides recommend are the Toonify Colab, the Pix2Pix online demo, and This X Does Not Exist. The last 30 minutes of the recording are a TA session whose content this post did not check segment by segment.

## Homework breakdown: week 3 (Chang Gung satellite class version)

The prompts and rubric below come from the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese). NCCU's TAs set the rubric; Chang Gung's co-instructor published it. NCCU itself and other satellite classes may weight grades differently.

**Pick one:**

- **Option 1: run a GAN.** Find a GAN model (one not covered in class is fine). Generate several images on one theme, up to five input/output sets, each merged into a single image. Link and briefly introduce the model, then discuss **why fewer people use GANs for image generation now**. Rubric: 1–2 sets earns 6 points, 3–5 sets earns 7, completing the comparison and extras earns 8, and a clear introduction of the model's source adds 2.
- **Option 2: explain cross entropy and KL divergence in your own words.** Extensions can include worked calculations, comparing the two, code experiments, or use cases. Submit a Colab or PDF. Grading is about explanation quality: a Colab that is just code with no Markdown gets 8. A well-written Markdown explanation (or a polished PDF report) gets 10. "GPT-level" or off-topic work gets 2.

**Shared rules:** omitting the instructor's "fixed four import lines" costs 1 point (see [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en)). Any help from generative AI must be disclosed with screenshots of the prompt and output, or it counts as copying the AI. Confirmed plagiarism means 0 for that assignment and 10 more points off the course total.

**For Option 1's "why fewer GANs now"**, the slides themselves give two leads: training problems like mode collapse, and slide 58's "until diffusion models appeared." Go further with your own sources rather than writing from impressions.

## Self-check

Without the slides, you should be able to answer:

1. Why can't "sentence in, picture out" be trained directly as supervised learning? What does the latent vector z fix?
2. What value does each network want D to output? What happens to D once training succeeds?
3. What is mode collapse, in one sentence?
4. What is the biggest difference between Pix2Pix and CycleGAN?
5. With the true distribution fixed, why do cross entropy and KL divergence rise and fall together?

**Something to do tonight**: paste the lines below into a Colab and confirm you get the same numbers as slide 86 (natural log). If you can add a third output and predict whether KL goes up or down before running it, you have the skeleton of Option 2.

```python
import numpy as np

y = np.array([0.7, 0.2, 0.1])          # correct answer (soft target)
H = -(y * np.log(y)).sum()             # entropy of the true distribution

for q in ([0.75, 0.15, 0.1], [0.6, 0.3, 0.1]):
    q = np.array(q)
    ce = -(y * np.log(q)).sum()        # cross entropy
    print(q, round(ce, 2), round(ce - H, 2))   # 0.81 0.01 / 0.83 0.03
```

## Further reading

This post stands on its own. To dig deeper:

- GAN training details and math: [CMU 11-785 Lecture 24: Generative Adversarial Networks](/posts/ai/2026-08-22-cmu-11785-24-gans-en)
- What autoregressive models, VAEs, and GANs each optimize: [CS231N L13: Generative Models I](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en)
- How cross entropy relates to maximum likelihood: [CMU 07-280 Lecture 16: Maximum Likelihood](/posts/ai/2026-08-22-cmu-07280-lecture-16-maximum-likelihood-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | Previous: [L02 Neural Networks](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en) | Next: [L04 LLMs Are Simpler Than You Think](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Chang Gung satellite class page: Generative AI 2025 (schedule, week 3 homework and rubric) (in Chinese)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [Lecture 03: GANs, once all the rage (YouTube recording, 2025-03-04) (in Mandarin)](https://www.youtube.com/watch?v=akt4A3OJ9h4)
- [1132 Generative AI recordings playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI03 GAN slides (Google Drive) (in Chinese)](https://drive.google.com/file/d/1UqnoeRSgHfNC0o6X5ENeWmLKqZNagskI/view)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [yenlung/AI-Demo (the instructor's demo notebook repo)](https://github.com/yenlung/AI-Demo)
- [Goodfellow et al. 2014: Generative Adversarial Networks](https://arxiv.org/abs/1406.2661)
- [Karras et al. 2018: Progressive Growing of GANs for Improved Quality, Stability, and Variation](https://arxiv.org/abs/1710.10196)
- [Isola et al. 2017: Image-to-Image Translation with Conditional Adversarial Networks (Pix2Pix)](https://arxiv.org/abs/1611.07004)
- [Zhu et al. 2017: Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks (CycleGAN)](https://arxiv.org/abs/1703.10593)
