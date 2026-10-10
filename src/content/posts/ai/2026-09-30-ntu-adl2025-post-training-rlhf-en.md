---
title: "NTU ADL 2025 Lecture 7: Post-Training — Instruction Tuning, RLHF, and InstructGPT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, nlp, llm, post-training, instruction-tuning, rlhf, dpo]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 9
tldr: "A pre-trained model can continue text, but that does not mean it follows instructions. The Post-Training slides of NTU ADL Fall 2025 fix this in two steps. Instruction tuning (FLAN, T0) teaches the model to read task descriptions. RLHF then pulls its outputs toward human preference. Three limits of instruction tuning connect the two steps, a reward model and pairwise comparisons solve two practical RL problems, and InstructGPT's SFT → reward model → PPO pipeline ties it all together. ChatGPT runs the same pipeline on multi-turn dialogue."
description: "A guide to the Post-Training slides and videos 7.1–7.4 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025: specialists vs. generalists, FLAN and T0, Super-NaturalInstructions, three limits of instruction tuning, a quick policy-gradient refresher, reward models and pairwise data, Stiennon et al. 2020, DPO and KTO, InstructGPT's three steps and PPO-ptx, and the multi-turn ChatGPT version."
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback: train a reward model on human preference data, then tune the language model with reinforcement learning (often PPO) so its outputs earn higher reward."
    context: "The second half of the ADL Post-Training slides."
  - term: "DPO"
    definition: "Direct Preference Optimization (Rafailov et al., 2023): tune the model directly on better/worse response pairs, with no separate RL loop. The slides call it removing the RL from RLHF."
    context: "ADL Post-Training slides, p.38."
  - term: "InstructGPT"
    definition: "The model and method of Ouyang et al. 2022: starting from GPT-3, run supervised fine-tuning, reward-model training, and PPO reinforcement learning in sequence."
    context: "The case study the ADL Post-Training slides use to tie the whole pipeline together."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)

**Video status: Videos included.** [Source details](#course-video-sources)

This is post 9 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). The course is ADL Fall 2025 (NTU semester 114-1, 2025/09/01–12/15). This lecture ran on 9/22, on the same day as LLM Adaptation (the next post) and the LoRA TA recitation.

**Sources**: the [Post-Training slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf) (55 pages) and four videos: [7.1 Post-Training](https://youtu.be/G5O93KOsBCs) (16:50), [7.2 Instruction Tuning / SFT](https://youtu.be/PfSybChNSNc) (27:46), [7.3 RLHF](https://youtu.be/4Md8Y0zAXUE) (33:30), and [7.4 InstructGPT & ChatGPT](https://youtu.be/-hchhJoH3YE) (13:58). I checked the slides and video metadata on 2026-09-30. The videos are taught in Mandarin; the slides are in English. Page numbers below refer to the slide PDF. Many pages are figures only, so this post covers only what the slide text supports.

**Series position**: previous [Pre-Training Families and Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en) | next [PEFT: Adapter, LoRA, Prompt Tuning, and HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The lecture answers one question: a pre-trained model already continues text well, so why train it again? The slides answer in two layers. First, make the model understand task descriptions. Second, make its outputs match human preference.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=G5O93KOsBCs
title: ADL 7.1: Post-Training (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=PfSybChNSNc
title: ADL 7.2: Instruction Tuning / SFT (YouTube, in Mandarin)
```

Original videos: [ADL 7.1: Post-Training (YouTube, in Mandarin)](https://www.youtube.com/watch?v=G5O93KOsBCs)、[ADL 7.2: Instruction Tuning / SFT (YouTube, in Mandarin)](https://www.youtube.com/watch?v=PfSybChNSNc)、[ADL 7.3: RLHF (YouTube, in Mandarin)](https://www.youtube.com/watch?v=4Md8Y0zAXUE)、[ADL 7.4: InstructGPT & ChatGPT (YouTube, in Mandarin)](https://www.youtube.com/watch?v=-hchhJoH3YE)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Both transcripts (7.1 and 7.2) were read. 7.1: specialists vs generalists, GPT compared against WMT translation systems, unifying tasks as QA (2018), pretrain + prompting vs pretrain + fine-tuning, emergent ability, and post-training being needed because future tasks are unknown. 7.2: how FLAN and T0 work and their zero-shot results, instructions needing detailed descriptions, the effect of the number of prompts, Super-NaturalInstructions, and the three limits of instruction tuning (paired data is expensive, open-ended tasks have no single answer, and token-level objectives differ from human objectives). All match the article's "From specialists to generalists" and "Step one" sections. 7.3 and 7.4 are not embedded, and the RLHF, DPO and InstructGPT sections were not compared against transcripts.

## From specialists to generalists

The slides open with a contrast (pp.3–10):

- **Specialists** master a single task: one model for summarization, another for translation.
- **Generalists** are good at many tasks. A prompt or instruction tells them what to do right now.

Two pieces of evidence sit in between. GPT models can now be compared with WMT systems on machine translation (p.5 cites Jiao et al. and Hendy et al., 2023). decaNLP casts many tasks as question answering (p.7, McCann et al., 2018). Page 9 compares the two routes: "pre-train + fine-tune" needs annotated data for each task, while "pre-train + prompt" just adds a prompt and does no further learning.

Page 11 draws the map for the whole lecture. A good generalist starts with large pre-training data and a large model (emergent ability). Further improvement then takes one of two roads:

1. **Do well on known tasks**: prompt tuning/engineering, or tune the LM itself.
2. **Do well on unseen tasks**: collect human annotation and feedback across diverse tasks.

The second road is this lecture. The slides call it post-training: instruction tuning plus RLHF.

## Step one: instruction tuning

### The idea: read the task description

Page 13 uses a Jolin Tsai concert to show the difference. A plain LM sees "I went to Jolin's concert last night... It was ___" and does sentence completion. Instruction tuning wraps the same sentence in an explicit task, "Decide the sentiment of the following sentences", with positive/negative/neutral options.

### FLAN and T0

- **[FLAN](https://arxiv.org/abs/2109.01652)** (Wei et al., 2022; pp.14–18) fine-tunes an LM on instruction data from other tasks so it understands task descriptions better. Page 15 trains on instruction-formatted tasks such as commonsense reasoning, then tests on an unseen translation instruction. Page 16 shows the task clusters. Pages 17–18 show zero-shot results and flag two observations: FLAN combines with prompt tuning, and it needs a large enough model.
- **[T0](https://arxiv.org/abs/2110.08207)** (Sanh et al., 2022; pp.19–23) is multitask prompted training. The slides cover its task clusters, prompt templates, results, and the effect of the number of prompts.
- **[Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)** (p.24): the slide says the dataset has over 1.6K tasks and 3M+ examples.

### Three limits that lead to RLHF

Page 25 is the turning point. Instruction tuning has three problems:

1. Paired (problem, answer) data is expensive to collect.
2. Open-ended tasks have no single correct answer.
3. LM training penalizes every token-level mistake equally, but some mistakes are worse than others.

The slide's conclusion: the LM objective and the human objective do not match. The fix is to optimize whole responses, which means optimizing human preference.

## Step two: RLHF

### A little RL first

Pages 27–30 give a four-page RL refresher. One episode is a trajectory τ. An actor's quality is its expected reward, and policy gradient updates the parameters step by step. Page 29 stresses one point: the update uses the cumulative reward R(τⁿ) of the whole trajectory, not the immediate reward of one step.

<details>
<summary>The policy-gradient formulas (standard form, following the slides' structure)</summary>

The slides show the formulas as images. This is the usual way to write the same derivation.

Expected reward:

```text
R̄(θ) = Σ_τ R(τ) · P(τ | θ)  ≈  (1/N) Σ_{n=1..N} R(τⁿ)
```

Here τ¹…τᴺ come from playing N times with π_θ. The gradient:

```text
∇R̄(θ) ≈ (1/N) Σ_{n=1..N} Σ_t  R(τⁿ) · ∇ log p(aₜⁿ | sₜⁿ, θ)
```

The intuition: if τⁿ earns positive total reward, tune θ to make "take aₜⁿ when seeing sₜⁿ" more likely. If the reward is negative, make it less likely. Page 30 draws this as a "collect data → update model" loop, where each update needs fresh data from the new parameters.

</details>

### Problem 1: humans in the loop are expensive → a reward model

Page 31: asking humans to score every output costs too much, so you train a reward model (RM) to simulate human preference (the slide cites Knox & Stone, 2009). The example is two sentences describing Taiwan, which the RM scores 7.5 and 6.0.

The most direct use of an RM is to generate several candidates and show the highest-scoring one (p.32). The slide marks this as slow and expensive. Page 33 instead uses the RM score to tune the LLM with RL. The input is "Who is Taiwan's team captain?" in Chinese, and the model answers with the baseball player Chen Chieh-hsien. The RM gives a high score, so the model raises that response's probability. At inference time it generates once.

### Problem 2: human scores are noisy → pairwise comparisons

Page 34: raw human scores are noisy and miscalibrated. Asking "which of two responses is better" is more reliable (the slide cites Phelps et al., 2015, and Clark et al., 2018). The training target becomes: the winning sample should get a higher reward than the losing one.

Pages 35–37 cover the RLHF work of [Stiennon et al., 2020](https://arxiv.org/abs/2009.01325). Page 35 notes that the RM itself needs evaluation, and that a large enough RM can approach the preference of a single human labeler.

### Removing RL: DPO and KTO

- **[DPO](https://arxiv.org/abs/2305.18290)** (Rafailov et al., 2023; p.38) optimizes human preference directly from better/worse pairs and avoids RL. The slide's tagline is "removing RL from RLHF".
- **[KTO](https://arxiv.org/abs/2402.01306)** (Ethayarajh et al.; p.39): paired responses for the same input are hard to get, so KTO aligns with responses that carry only a binary good/bad label. The slide calls it a practical approach to preference tuning.

<details>
<summary>The DPO objective (from the DPO paper; not written out as text in the slides)</summary>

```text
L_DPO = − E_(x, y_w, y_l) [ log σ( β·log(π_θ(y_w|x) / π_ref(y_w|x)) − β·log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]
```

y_w is the preferred response, y_l the worse one, π_ref a reference model (usually the SFT model), and β controls how far the model may drift from it. There is no separate reward model to train and no PPO sampling loop.

</details>

## Putting both steps together: InstructGPT

Pages 40–50 use [InstructGPT](https://arxiv.org/abs/2203.02155) (Ouyang et al., 2022) to chain everything into one pipeline:

| Step | What happens | What the slides stress |
|---|---|---|
| 1. Supervised fine-tuning | Sample a prompt (e.g. "Explain the moon landing to a 6 year old kid"), have a human write the desired output, fine-tune GPT-3 on it | p.41 marks "30K tasks!" and states SFT = instruction tuning |
| 2. Reward-model training | Generate several outputs for the same prompt; a human ranks them, e.g. D > C > A = B | p.43: learn to estimate rewards, and normalize the RM with a bias to zero mean |
| 3. RL with PPO | Generate a response for a new prompt (e.g. "write a story about dinosaurs"), score it with the RM, update the policy with PPO | p.44: diverse tasks improve generalization; p.45: PPO-ptx mixes pre-training gradients into the PPO gradients to reduce regressions on NLP datasets |

<details>
<summary>The step-2 RM loss (from the InstructGPT paper)</summary>

For two responses to the same prompt x, where y_w is the one humans preferred:

```text
L_RM = − E_(x, y_w, y_l) [ log σ( r_θ(x, y_w) − r_θ(x, y_l) ) ]
```

Only the score difference matters, so shifting every score by a constant leaves the loss unchanged. That is why p.43 adds a separate bias to normalize rewards to zero mean.

</details>

Evaluation (pp.46–50): the slides list existing datasets for truthfulness and harmlessness, plus a human-annotation sheet on the API prompt distribution. Page 47 groups its fields into three sets, each a binary flag. "Useful" covers failing to follow the instruction and whether constraints are met. "Honest" covers hallucination. "Potentially harmful" covers being inappropriate for a customer assistant, sexual or violent content, denigrating a protected class, harmful advice, and so on. A 1–7 Likert scale rates overall quality. Page 49 compares overall quality against other instruction-following models, and p.50 shows qualitative examples.

## ChatGPT: the same pipeline, now multi-turn

Pages 51–54 walk through the three steps again. What changes is the shape of the data:

1. SFT demonstrations become human-written multi-turn conversations (the slide notes "w/ model-written suggestions"). The example keeps asking about Jolin Tsai's career and songs.
2. RM training takes the whole conversation history as input, and humans again rank several responses.
3. The PPO stage generates the next turn given the conversation history.

Page 54 sums it up in one line: this enables multi-turn interaction.

## After this lecture you should be able to

- Say what instruction tuning solves and which three problems it leaves.
- Explain why we train a reward model, and why the data uses pairwise comparisons instead of direct scores.
- Draw InstructGPT's three steps and say where each step's data comes from.
- Say what DPO and KTO each remove: DPO removes the RL loop, KTO removes the need for paired data.

One thing to try tonight: take a prompt you use often, write two responses yourself, one good and one bad, and note why you judge them that way. That is the data unit for RLHF step 2 and for DPO. Once you have written it, p.25's point about open-ended tasks becomes concrete: you can rank the two, but you would struggle to write a single reference answer.

## Further reading

Other course guides on this site cut the same topic differently:

- [CS224N Lecture 8: From Instruction Tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en)
- [CME295 Lecture 5: SFT Can't Teach "Don't Answer Like That", So RLHF and DPO Add the Negative Signal](/posts/ai/2026-09-29-cme295-preference-tuning-en)
- [CME295 2026 Lecture 4: SFT, PPO, GRPO, and On-Policy Distillation Are One Policy Gradient](/posts/ai/2026-09-29-cme295-rl-with-llms-en)

Next: [PEFT: Adapter, LoRA, Prompt Tuning, and HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed 7.1 and 7.2 match the first two sections; 7.3 and 7.4 were not checked.

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/22 session, video and slide links
- [Post-Training slides (250922_PostTraining.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf) — source of all page numbers
- [ADL 7.1: Post-Training (YouTube, in Mandarin)](https://youtu.be/G5O93KOsBCs)
- [ADL 7.2: Instruction Tuning / SFT (YouTube, in Mandarin)](https://youtu.be/PfSybChNSNc)
- [ADL 7.3: RLHF (YouTube, in Mandarin)](https://youtu.be/4Md8Y0zAXUE)
- [ADL 7.4: InstructGPT & ChatGPT (YouTube, in Mandarin)](https://youtu.be/-hchhJoH3YE)
- [2025 Fall NTU CSIE ADL playlist (in Mandarin)](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Wei et al., Finetuned Language Models Are Zero-Shot Learners (FLAN)](https://arxiv.org/abs/2109.01652)
- [Sanh et al., Multitask Prompted Training Enables Zero-Shot Task Generalization (T0)](https://arxiv.org/abs/2110.08207)
- [Wang et al., Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)
- [Stiennon et al., Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ethayarajh et al., KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306)
- [Ouyang et al., Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
