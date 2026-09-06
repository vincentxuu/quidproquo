---
title: "YuLan-Mini: Squeezing a 2.4B Flagship-Scale Small Model Out of 1.08T Tokens"
date: 2026-09-06
category: ai
type: deep-dive
tags: [yulan-mini, llm, pre-training, training, open-source, data-curation, annealing]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 4
tldr: "YuLan-Mini is a 2.4B open-source model from Renmin University's AI Box lab, trained on 48 A800 GPUs with only 1.08T tokens — scoring 37.8 on MATH-500 and 64.0 on HumanEval, beating Qwen2/Qwen2.5 peer models trained on 7T–18T tokens at math and code. What's public isn't a slogan: per-phase data mixes, pre-annealing optimizer states, and even W&B logs of the ablation studies."
description: "A deep dive into YuLan-Mini: the data cleaning pipeline and curriculum design, training stability engineering, annealing-stage data selection and long-context training, and how small teams squeeze performance from limited compute."
draft: false
---

> [中文版](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining)

If the previous [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) post answered "can one person on one GPU walk through the full training pipeline," [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini) answers a different question: **can a university lab with a few dozen GPUs train a model close to industrial quality**. The answer is yes — 2.42B parameters, pre-trained on only 1.08T tokens, scoring 37.8 on MATH-500, 68.5 on GSM8K, and 64.0 on HumanEval pass@1. Compared against Qwen2-1.5B (7T tokens) and Llama3.2-3B (9T tokens), YuLan-Mini actually leads on math and code (per the [technical report](https://arxiv.org/abs/2412.17743)'s own evaluation). The paper was later accepted as an ACL 2025 Main Conference Oral.

"Data efficiency" here isn't an adjective — it's three separable things: **where to spend the 1.08T-token budget** (data cleaning, synthesis, and curriculum design), **how to keep the run from blowing up** (stability engineering), and **how to sprint through the final 80B tokens** (annealing-stage data selection and long context). Item by item.

## Positioning: serious training, not a teaching toy

First, how it differs from MiniMind — the two are often lumped together as "small open-source model projects," but they are not the same kind of thing:

- **MiniMind's 64M model is unusable on any real task**; its value is making every line of code readable. YuLan-Mini's goal is "top-tier performance among models of the same scale," with every design decision aimed at benchmarks.
- **Three orders of magnitude more compute**: MiniMind is one 3090 for 2 hours; YuLan-Mini ran over 1T tokens on 56 A800s (later reduced to 48). The paper admits resources were tight enough that 28K context was the ceiling.
- Yet both share the same ethos: **release everything**. MiniMind publishes its training datasets; YuLan-Mini goes further — per-phase data composition for all 27 curriculum phases, intermediate checkpoints, optimizer states from before annealing, and even [W&B training logs](https://wandb.ai/yiwen_hu/YuLan-Mini) for six ablation studies (including per-module hidden states and weights). Code, weights, and optimizer states are all MIT-licensed.

It didn't invent its techniques from scratch either. The WSD learning-rate schedule comes from MiniCPM, the 8% annealing-ratio estimate from Tissue et al.'s scaling-law work, and annealing data selection builds on the LESS method. YuLan-Mini's increment is combining these existing techniques into a **complete executable recipe under limited compute**, with every trade-off written down. For the underlying logic of how data volume and model size trade off against performance, start with this site's [Scaling Laws primer](/en/posts/ai/2026-08-26-understanding-ai-models-scaling-laws-en) — YuLan-Mini's entire strategy is essentially optimization under the constraints of a scaling-law budget table.

## The data pipeline: where 1.08T tokens go

The 1.08T-token total breaks down (paper Table 4) as: web pages 559.76B, code 202.44B, general knowledge 121.87B, math 85B, books 52.13B, encyclopedias 14.8B, open-source instruction data 11.64B, plus self-made synthetic data at 8.76B (pre-training) and 23.52B (instruction). All sources are public datasets — FineWeb-Edu, the-stack-v2, OpenWebMath, Chinese-FineWeb-Edu, and more — plus their own synthetic portion. Nothing behind an NDA; that's the precondition for "reproducible in a university lab."

The cleaning pipeline has six steps; the two most distinctive:

- **Topic recall**: fasttext and TinyBERT classifiers mine FineWeb-Edu and DCLM web corpora for math (10.4B tokens), code (1.11B), and reasoning (1.01B) text — used both directly in training and as seeds for synthetic data.
- **Quality scoring**: they reuse FineWeb-Edu's official fineweb-edu-scorer to score web and math text, dropping scores of 1–2 and heuristically ordering 3–5. One detail worth stealing: the scoring models deliberately recognize only elementary- and middle-school-level content, to avoid favoring "sophisticated-looking" but low-information text like arXiv abstracts.

**Curriculum design** is the pipeline's backbone: training splits into 27 consecutive curriculum phases of 40B tokens each. Math and code data are ordered by increasing difficulty (scored by education level, where lower scores mean harder specialized content); web data, in contrast, is **not** curriculum-ordered — experiments showed level-based staging badly distorted its original distribution. At each phase boundary, the next phase's data ratios are nudged based on benchmark performance, but adjacent-phase changes are forced within 3% to avoid distribution shifts spiking the loss. Across all of stable training, instruction data stays under 5% — build the foundation first, leave instruction-style data for later.

## Synthetic data: o1-style long thoughts and formal math

The most consequential increment inside the 1.08T is the 32B tokens of synthetic data they made themselves. Three categories stand out:

- **o1-style long thoughts**: starting from harder math problems (NuminaMath, etc.), QwQ-32B-Preview — a slow-thinking model — distills long-form reasoning chains, drawn from the team's own o1-reproduction project "Slow thinking with LLMs." Note this long-thought data enters at the **pre-training stage**, not as a post-training afterthought.
- **Formal math**: Lean theorem-proving data (DeepSeek-Prover tactics, Lean-GitHub, Lean-Workbook), augmented with three reasoning primitives inspired by LIME — deduction, abduction, induction — so the model learns "from proof state to tactic" rather than memorizing proofs.
- **Reflection data**: deliberately take the model's wrong answers, use Qwen2.5-Math-7B-Instruct to locate the first error, truncate everything after it, then generate error analysis and transition sentences — turning the whole "wrong → correct → right" trajectory into a training sample. The base model itself learns self-correction patterns rather than getting them injected only in post-training.

On the code side, they expand LeetCode problems via ICL and generate real-world tasks via OSS-Instruct; scientific reasoning pulls hard problems from college entrance exams and camel-ai, distilled through QwQ the same way. All synthetic data and generation prompts are open-sourced on the [HuggingFace collection](https://huggingface.co/collections/yulan-team/yulan-mini-676d214b24376739b00d95f3).

## Stability: making a 0.01 learning rate survivable

YuLan-Mini runs an aggressive setting: a global learning rate of 0.01, several times the common value. The rationale is the paper's core judgment — **a model trained with a large learning rate has more headroom during annealing**. But at 0.01, loss spikes are almost guaranteed, so they treated stability as a systems-engineering problem:

1. **The monitoring signal is hidden states, not loss.** Proxy-model experiments at 0.2B showed that hidden-state variance and gradient norms keep climbing during phases where loss still looks normal — by the time loss spikes, it's too late.
2. **μP-style initialization + WeSaR re-parametrization.** μP lets hyperparameters transfer from small proxy models without retuning (already validated by CerebrasGPT and MiniCPM); WeSaR adds a learnable scale parameter to each weight matrix, decoupling gradient norm from gradient direction to suppress drift under sustained large-LR updates.
3. **Discard what doesn't pay.** QK LayerNorm demonstrably suppresses attention-logit explosions but costs 34% more training time — since the other methods already sufficed, they skipped it. That record of "verified but not used" trade-offs is more useful than papers reporting only wins.

Supporting choices: embedding tying (they found sharing the embedding and output matrices speeds convergence), dropping AdamW's eps from the default 10⁻⁸ to 10⁻¹⁵ (to avoid abnormal embedding-layer gradients), and an extra-long 10B-token warmup.

## Annealing: the sprint through the final 80B tokens

Under the WSD schedule, stable training takes 990B tokens and annealing only 80B — **8% of the budget, yet the main battlefield for performance**. GSM8K jumps from 29.9 and HumanEval from 34.1 at the pre-annealing checkpoint to 68.5 and 64.0 after. Four concrete moves:

- **Annealing function: 1-sqrt**, which beat linear and cosine in their tests, decaying the learning rate from 10⁻² to 5.22×10⁻⁵.
- **Data selection**: the annealing mix is completely different — instruction data rises to 19.19% (code 11%, math 7%, general 1%), with gradient-based data selection (an accelerated LESS + InsTag) picking high-quality samples. The curriculum deliberately holding instruction data under 5% earlier is precisely what lets the model absorb this shift.
- **Long context**: RoPE base frequency goes from 10,000 to 490,000, extending context from 4K to 28K. Masked cross-document attention prevents interference across documents, and upsampling books plus concatenated GitHub code as long texts preserves short-text ability.
- **Checkpoint merging**: following Llama 3, they average the last few annealing checkpoints — some single metrics (like GSM8K) dip slightly, but the model is more well-rounded overall.

Annealing data selection rests on the observation that **as the learning rate falls, the model learns new material fastest** — so the same data fed early is waste, fed late is leverage. To reproduce this yourself, they even released the full optimizer state from before annealing, so you can resume from that checkpoint and run annealing with **your own data**.

## Overall

What YuLan-Mini proves: 1.08T tokens, public data, and university-lab-scale compute can produce a base model at MATH-500 37.8 and HumanEval 64 — while peer industrial models used 7–18× the data. The costs are in the paper too: mediocre long-context ability (RULER 51.5, clearly behind Qwen2.5's 68.3) and general knowledge (MMLU 49.1) below Qwen2.5-1.5B's 60.7. It bet its limited budget on math and code; that's a trade-off, not magic.

The practical lesson for small teams: **when compute is scarce, the leverage is on the data side, not the model side** — cleaning pipelines, curriculum design, synthetic data, and annealing-stage selection all cost zero extra GPUs. And what's open-sourced isn't just the endpoint: intermediate checkpoints paired with their training data enable research into when capabilities emerge; the pre-annealing checkpoint with optimizer states is a ready-made starting point for your own experiments.

This "data efficiency against compute disadvantage" line continues in the next post's [OLMo 3 and LLM360](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en), which looks at the problem from the fully-open angle; for how the Chinese open-source community approaches small-model training, read back to [Chinese community small-LLM training](/en/posts/ai/2026-09-06-chinese-community-small-llm-training-en).

## References

- [YuLan-Mini GitHub (RUC-GSAI)](https://github.com/RUC-GSAI/YuLan-Mini)
- [YuLan-Mini: An Open Data-efficient Language Model (arXiv:2412.17743)](https://arxiv.org/abs/2412.17743)
- [YuLan-Mini HuggingFace collection (models, datasets, classifiers)](https://huggingface.co/collections/yulan-team/yulan-mini-676d214b24376739b00d95f3)
- [Ablation study W&B training logs](https://wandb.ai/yiwen_hu/YuLan-Mini)
- [MiniMind: Train an LLM From Scratch for 3 RMB (this series, order 1)](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)
- [Scaling Laws: How Big Should a Model Be (this site)](/en/posts/ai/2026-08-26-understanding-ai-models-scaling-laws-en)
