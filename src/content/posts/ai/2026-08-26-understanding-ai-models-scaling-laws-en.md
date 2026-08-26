---
title: "Scaling Laws: How Big Should a Model Be, and Why Bigger Isn't Always Better"
date: 2026-08-26
category: ai
type: deep-dive
tags: [scaling-laws, chinchilla, compute-optimal, training, ai-model, llm]
lang: en
series:
  name: "認識 AI 模型"
  order: 8
tldr: "Scaling laws show that loss decreases predictably with more parameters, data, and compute — following power-law relationships. The Chinchilla paper's key finding: most models were too large and undertrained. Given the same compute budget, training a smaller model on more data produces better results. This reshaped the entire industry's training strategy."
description: "An introduction to Scaling Laws: Kaplan's power laws, Chinchilla's compute-optimal discovery, how to read log-log plots, and how these laws influenced the design of Llama 3 and MoE architectures."
draft: false
glossary:
  - term: "Scaling Laws"
    def: "Predictable power-law relationships between model performance and parameters, data, or compute"
  - term: "Compute-Optimal"
    def: "The best allocation of a fixed compute budget between model size and training data"
  - term: "Chinchilla"
    def: "DeepMind's 2022 paper proving most models were too large and undertrained — smaller models trained on more data perform better"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-scaling-laws)

GPT-4 reportedly has over a trillion parameters. Llama 3.1 comes in 8B, 70B, and 405B sizes. Why so many sizes? Why not just build the biggest one?

Because "bigger is better" assumes you have infinite compute. In the real world, you don't. Scaling laws tell us how to spend a limited compute budget wisely.

## Power Laws: Predictable Progress

In 2020, Kaplan et al. at OpenAI published a landmark paper discovering that language model loss follows **power-law relationships** with three variables:

- **N**: number of model parameters
- **D**: amount of training data (in tokens)
- **C**: training compute (in FLOPs)

A power law means that loss decreases **smoothly and predictably** as these variables increase. Not randomly, not in steps — along a clean curve.

<details>
<summary>The math behind scaling laws</summary>

The empirical formulas Kaplan et al. found look roughly like:

$$L(N) \approx \left(\frac{N_c}{N}\right)^{\alpha_N}$$

$$L(D) \approx \left(\frac{D_c}{D}\right)^{\alpha_D}$$

where $\alpha_N \approx 0.076$, $\alpha_D \approx 0.095$, and $N_c$, $D_c$ are constants. Loss is linear with respect to the logarithm of parameters and data — that's what makes it a power law.

</details>

Why does this matter? Because it means you can **predict** outcomes: if I scale the model by 10x, how much will loss drop? You don't need to spend hundreds of millions of dollars training it to find out.

### How to Read a Log-Log Plot

Scaling laws papers are full of log-log plots. If you haven't seen them before, here's a quick primer.

On a regular plot, both axes are linear: 1, 2, 3, 4… **On a log-log plot, both axes use logarithmic scales**: 1, 10, 100, 1000… Each tick mark represents not "plus one" but "times ten."

Why use logarithmic scales? Because scaling laws span enormous ranges — from thousands of parameters to hundreds of billions. A linear axis simply can't fit that.

The key insight: **on a log-log plot, a power law appears as a straight line**. If you see a straight diagonal line, that's a power law at work. A steeper slope means faster improvement as you scale up.

So when you see those clean straight lines in scaling laws papers, they're not just aesthetically pleasing — they're saying: **this relationship is predictable and can be extrapolated**.

## The Chinchilla Reversal: Most Models Were Undertrained

In 2022, Hoffmann et al. at DeepMind published *Training Compute-Optimal Large Language Models* — commonly known as the Chinchilla paper. It overturned the industry's consensus.

Kaplan's paper had an implicit conclusion: bigger models are better, and data matters less. So between 2020 and 2022, labs focused on **stacking parameters** — GPT-3 at 175B, PaLM at 540B — while using "just enough" training data.

The Chinchilla paper said: **you've got it backwards**.

Hoffmann et al. systematically trained over 400 models of different sizes on different amounts of data, then measured which combination performed best at a given compute budget. The conclusion:

> For a fixed compute budget, model parameters and training tokens should be **scaled equally**.

<details>
<summary>The compute-optimal rule of thumb</summary>

A simplified takeaway from the Chinchilla paper: **training tokens should be roughly 20 times the number of parameters**.

That means a 10B-parameter model should be trained on about 200B tokens to be compute-optimal.

They validated this by training Chinchilla — a 70B-parameter model on 1.4T tokens. Despite having the same compute budget, Chinchilla outperformed the 280B-parameter Gopher (trained on only 300B tokens).

Four times smaller, yet better. The difference? Chinchilla consumed far more data.

</details>

In one sentence: **most large language models were too big and undertrained**. Given the same compute budget, training a smaller model on more data yields better results.

### Why This Matters

This isn't just an academically interesting finding. It directly impacts:

1. **Training costs**: Smaller models are cheaper to train and faster and cheaper to run at inference time.
2. **Data requirements**: The industry shifted from "build bigger models" to "find more high-quality data."
3. **Deployment feasibility**: A 70B model is far easier to deploy than a 280B model.

## Connecting to Real-World Models

After Chinchilla, the industry's strategy shift becomes clearly visible.

**Llama 3** (2024) is the best example. The Llama 3 70B model was trained on over 15 trillion (15T) tokens — far exceeding Chinchilla's 20x rule. Meta's reasoning: inference cost is the dominant long-term expense. A model that's "overtrained" by Chinchilla's standard but smaller is more cost-effective to deploy than a compute-optimal but larger model.

This is an extension of the Chinchilla insight: **if you care about inference cost, not just training cost, it makes sense to train a smaller model for longer**.

**Llama 4 Scout** takes yet another direction: Mixture of Experts (MoE). MoE architectures give a model a large total parameter count, but only activate a subset during each inference pass. This is another innovation driven by scaling laws — maximizing learned knowledge while keeping inference efficient.

## Limitations of Scaling Laws

Scaling laws are powerful, but they're not the whole story. A few important caveats:

1. **They predict loss, not capabilities**. Loss decreases smoothly, but model "abilities" often emerge suddenly — so-called emergent abilities. A model might be completely unable to do a task below a certain scale, then suddenly succeed above it.
2. **Data quality isn't in the formula**. Scaling laws assume constant data quality. In practice, a small model trained on high-quality data can outperform a larger model trained on low-quality data.
3. **Architecture improvements shift the curve**. Post-Transformer innovations (MoE, State Space Models) can change the power law's exponent itself.

## Further Reading

- Kaplan et al. (2020). *Scaling Laws for Neural Language Models*. [arXiv:2001.08361](https://arxiv.org/abs/2001.08361)
- Hoffmann et al. (2022). *Training Compute-Optimal Large Language Models*. [arXiv:2203.15556](https://arxiv.org/abs/2203.15556)
- Stanford CS336 Lectures 9–11 cover scaling laws theory and practice in depth
- Meta (2024). *The Llama 3 Herd of Models*. [arXiv:2407.21783](https://arxiv.org/abs/2407.21783)

## References

- Kaplan, J. et al. (2020). [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361). arXiv:2001.08361.
- Hoffmann, J. et al. (2022). [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556). arXiv:2203.15556.
- Grattafiori, A. et al. (2024). [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783). arXiv:2407.21783.
