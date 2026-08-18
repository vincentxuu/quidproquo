---
title: "What's Going On Inside My Model? Where You Look First When It Regresses"
date: 2026-08-16
category: ai
type: deep-dive
tags: [interpretability, scaling-laws, benchmark, evaluation, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 10
tldr: "Ask a model what a goose looks like to it and it draws a whole flock — because the labeled data tagged a flock as 'goose,' so it thinks the flock is the label. This lecture gives seven ways to open a CNN up, then says honestly: applied to transformers, even the frontier of this research only explains two layers."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 10: starting from a 200-billion-parameter checkpoint regression, working through saliency maps, occlusion sensitivity, class activation maps, gradient ascent, dataset search and deconvolution, then scaling laws, benchmark contamination detection and data diagnostics."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-inside-the-model)

> [The previous post](/posts/career/2026-08-16-cs230-career-advice-in-ai-en) was the only lecture in the series with no technical content. This is the last one, and it looks inside the model.

This post covers **[Lecture 10: What's Going On Inside My Model?](https://www.youtube.com/watch?v=Ozb1AR_F5MU)** (2025/12/02, Kian Katanforoosh, 1 hour 47 minutes, the final lecture of the term).

In 2024 this slot was "closing remarks + AI on the job," running on **2021 slides** unchanged for three years straight. Only in 2025 did it become a real interpretability lecture — and that change alone says something about how the priority shifted in the instructors' eyes.

Katanforoosh explains the rename:

> "This lecture used to be called neural network interpretability, but I **broadened the scope**, because there's now a section on frontier models, and **for the models you're playing with out there, the interpretability methods mostly haven't been figured out.**"

## Opening case: you're a model trainer at a frontier lab

The setup is well built:

> You're training a **200-billion-parameter** model. Last night a new checkpoint passed the training sanity checks, but several problems showed up: **reasoning benchmarks got worse**, **some safety evals failed**, and in agentic workflows there are **strange spikes in tool-use latency.**
>
> Your VP asks: "What happened?" **Before you touch any code or retrain, what evidence do you look at first?**

The students work through: error analysis to find **patterns** in the failures, whether the training loss is **smooth or has spikes**, whether **the last batch of training data was poisoned**, comparing checkpoints to locate when the problem appeared, hardware failure, **attention maps** ("this token has nothing to do with that one, but the model seems to think it does"), the learning rate schedule, and **comparison against scaling laws.**

He adds one nobody thought of:

> "Maybe some experts failed, or **the mixture-of-experts router keeps picking the same expert**, because it found one very good general-purpose expert and the others go unused. **Then the model isn't operating at 200 billion parameters, it's operating as a much smaller model.**"

### Four buckets

| Bucket | Contents |
|---|---|
| **Training and scaling** | Loss curves, gradients, learning rate, MoE routing, scaling laws |
| **Representations and internals** | Attention heads and maps, embeddings, neuron-level behavior (**nobody has cracked this on large models**) |
| **Data and distribution** | Benchmark contamination, train/test distribution mismatch |
| **Capability level** | Benchmarking **the language model** vs. benchmarking **the agentic workflow that uses it** |

That last one is worth recording:

> "When a frontier lab says 'our model is great at tool use,' what they mean is — this language model was tested on **upstream tasks within a workflow.** **That's a different level of capability analysis.**"

---

# Part one: opening up a CNN

The scenario: you built an animal classifier for a zoo, and they **won't use it without human supervision** because they don't understand its decision process.

## Method 1: saliency maps

Take the derivative of the "dog" class score with respect to the **input pixels**: `∂S_dog / ∂X`. Bright pixels = high gradient = changing them moves the dog score.

**A common misconception**: use the score **before softmax.**

> "The post-softmax score **depends not only on dog but on all the other scores.** You might move one pixel and it happens to change the 'panda' score (because there's a panda in the background), which contaminates what you're trying to show."

**The most practical way to read it**:

> "If you compute the gradients and the bright pixels are **scattered all over the place**, then the model probably **isn't looking at the right thing at all — it just got lucky.**"

**The drawback**: it's only pixel-level. "The model will never see a cat or a dog that differs by exactly one pixel — that's too discontinuous."

## Method 2: integrated gradients

An extension of saliency maps, more commonly used. You interpolate from a **fully black image** to the target image and integrate the gradients along the path.

The example is a retinal image: the locations integrated gradients highlights **are exactly the annotated lesion locations.**

## Method 3: occlusion sensitivity

The most intuitive: slide a dark square across the image, record how the score changes, and plot it as a probability map.

> "Very simple, but **computationally expensive** — you have to run the same image through the model a great many times."

Three examples, the third is especially interesting:

| True label | Observation |
|---|---|
| Pomeranian | The score drops when the square covers the center of the face — reasonable, since telling **breeds** apart requires the face |
| Car wheel | The score drops when the square covers the wheel |
| **Afghan hound** | The score drops when the dog is covered, **but rises when the human face on the left is covered** — "you're effectively **removing redundant distracting information**" |

## Method 4: class activation maps (requires an architecture change)

The first three are **post hoc.** For a module that **plugs into the network and runs continuously**, you have to change the architecture.

**First find the weakness** (he has the students name it): the original architecture is `conv-relu-maxpool × N → flatten → FC → FC → FC → softmax`, and the weakness is those three fully connected layers.

> "You're looking at all pixels at once and mixing everything together, three times over. After three layers the information is completely mixed and **you can no longer recover the localized information that conv and maxpool preserved.**"

**The fix**: replace `flatten + three FC layers` with **global average pooling + one FC layer.** GAP averages **each channel down to a single number.**

> "Why is that interesting? Because **we haven't lost the localized information.** We just assigned **one number** to each surviving feature map. The localized information is still there in the previous volume."

**How CAM works**: take the weights corresponding to "dog" in that final FC layer and use them to weight and sum the last feature maps. (After the architecture change, that layer has to be retrained.) The improved version is **Grad-CAM.**

A student notes the model in the video sometimes looks at meaningless things, and his answer is honest:

> "Not surprising. This is a **previous-generation** model … **that's exactly why you build this kind of visualization module — to understand that 'this network isn't actually that good.'**"

## Method 5: gradient ascent — ask the model what a dog looks like to it

A new question: **does the model actually understand what a dog is, or is it just pattern matching?**

```
maximize  S_dog(X)  +  regularizer
```

Again use the pre-softmax score (otherwise it can cheat by suppressing other classes), the regularizer keeps pixels in a sane range, and you start from a **completely random** image and do gradient **ascent.**

**The results are very instructive:**

| Class | What the model produces | What it means |
|---|---|---|
| **Dalmatian** | Black spots on a white background | "The model may not fully understand what a dog is, **but this is what it thinks**" |
| **Goose** | **A whole flock of geese** | "The model probably **always saw flocks of geese and rarely a single one.** Maybe the labeled data tagged a flock as goose, so the model thinks **the flock** is the label." |
| **Flamingo** | Also a flock | Same as above |

**This method works on any activation inside the network** — "give me the input image that maximizes this activation" — which gives you a **neuron-level** probe.

## Method 6: dataset search (the most used today)

> "This is **the most commonly used method today, because it's so simple and so intuitive.**"

Pick a feature map, sweep the whole validation set, and find the **top five (or nine) images that activate it most strongly.** All shirts → this filter learned to detect shirts; all edges → it learned to detect edges.

### Why those images are all crops: the receptive field

He gets there with a good question: "the activation you picked — **can it see the whole input image?**"

- First layer: it only sees what the filter covers
- **The deeper you go, the more of the input a single activation sees**
- The final output sees the whole image

So those images are **cropped according to what that activation actually sees in input space.**

## Method 7: deconvolution, reverse-engineering

The most math-heavy segment, but the conclusion is practical.

First establish: **a convolution is a matrix multiplication.** Write a 1D convolution as a system of equations and it becomes a weight matrix times an input vector. Then two assumptions (which he honestly labels engineering approximations): assume `W` is invertible, and assume `W` is orthogonal (so the inverse is the transpose).

> "**Maybe it doesn't always hold, but it holds well enough in deep learning to be usable. This is an engineering discipline.** That's why the literature often calls deconvolution **transposed convolution.**"

**The implementation recipe** (he says if you remember one thing, remember this):

> 1. **Flip the filter**
> 2. **Build the subpixel version of the input** (insert zeros between values, then add padding)
> 3. **Divide the stride by two**
> 4. Run it as an ordinary convolution

**Unpooling and switches**: max pooling is **not invertible** — you know 6 came from one of the four cells, **but not which one.** The fix is to record where the max occurred during the forward pass in a **very lightweight binary matrix** and use it on the way back.

**The full pipeline**: send a dog image through the network → pick a feature map → find where the maximum activation is → **zero out everything else** → invert the network → get the crop showing **exactly which pixels maximized that activation.**

## Actual visualization results

[Zeiler & Fergus](https://arxiv.org/abs/1311.2901), using 50,000 validation images:

- The first layer's filters can be **printed directly** (an edge detector printed out looks like an edge detector) — **but not past the first layer**
- From the second layer, use deconv, and you can see some filters clearly detecting circles, others specific shapes
- Third layer: "the information the filters capture is more complex. **This is the proof of what Lecture 1 said about deeper features being more complex.**"

He plays a video of [Yosinski's Deep Visualization Toolbox](https://arxiv.org/abs/1506.06579) and narrates the method names live: one neuron in the first layer responds strongly to **bright→dark** edges and its neighbor to **dark→bright**; by the fifth conv layer, "this neuron seems to respond to **faces**," and deconv shows "it cares about head and shoulders but **ignores arms and torso**," and even "**responds to cat faces to some degree.**"

---

# Part two: frontier models

## CNNs vs. modern models

| | What it processes | What you're visualizing |
|---|---|---|
| **CNN** | Localized information | Edges, textures, shapes |
| **LLM** | **Relationships** | **Relationships and meaning between concepts and tokens** |

Two handles for visualization:

1. **Attention patterns** — look at one token's relationship with others. "Each attention head learns a different pattern: **linking pronouns to nouns, tracking structure, enforcing an ordering.**" The source is [Vig's visualization work](https://arxiv.org/abs/1904.02679). His framing is easy to remember: **this is the transformer counterpart of the CNN's saliency map.**
2. **Embeddings + dimensionality reduction** — use t-SNE to see whether semantically close tokens cluster, **checking whether the model really learned a meaningful representation.**

## But interpretability isn't actually solved

> "Unfortunately, modern transformers are complex enough that — **even the frontier of the research can only explain a two-layer transformer.**"

He points to the best current results coming from Anthropic's transformer circuits series — [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) (Elhage et al., 2021) introduced the circuits notion and found that **induction heads only appear in models with at least two attention layers**; the follow-up, In-context Learning and Induction Heads (Olsson et al., 2022), addresses them specifically.

> "**Induction heads are probably the best tool we currently have for seeing what's happening inside a transformer.**"

## Training telemetry

What to watch: training loss, validation loss (**global, and per data subset**), **gradient norms**, learning rate schedule, and **hardware efficiency metrics.**

A sudden jump in loss might be a contaminated batch; "**or you perform better on it than you should, which should also raise a red flag.**"

(An aside: "I remember there used to be a blog just for people to post **their ugliest loss functions.**")

**Why you don't see any of this from the outside:**

> "Frontier labs **rarely publish these dashboards, because that's IP** — it would leak key information about their architecture. So you usually learn **a year at a time**: you learn how a model from three or four years ago was made, because they're willing to share now."

## Scaling laws and Chinchilla

The method is to **fix two of the variables and vary the third** (compute / dataset size / parameter count) and look at the power-law relationship with test loss.

[Chinchilla](https://arxiv.org/abs/2203.15556) (DeepMind, 2022) analyzed GPT-3 and concluded:

> "**GPT-3 underperforms relative to its size because it wasn't trained long enough.** If you kept training GPT-3 longer, performance would be far better. **The problem isn't model size — the model just wasn't fully utilized.**"

Concretely: **Chinchilla at 70 billion parameters vs. GPT-3 at 175 billion, and Chinchilla performs better.**

How to read the plot: **a point above the line = your model should be trained longer.**

**Why this matters (the money argument):**

> "One training run is very expensive. It's not public, but **we estimate GPT-5 is on the order of hundreds of millions of dollars.** So you want to know: **should I train this model twice as long?** That's a big financial decision. Scaling laws let you judge — **should you invest in compute, in growing the dataset, or in increasing model capacity?**"

(**That cost figure is his estimate, not public information.**)

## How to read benchmarks

This part is the most useful for anyone who reads model-release charts daily:

> "**I don't pay much attention to benchmarks published by foundation model vendors themselves.** Or rather, I look at **relative values** between models, not **absolute values.**
>
> Then you wait for the community to test it in agentic workflows, on their own tasks. For example, **it took the community a while to realize how good Claude is at coding.** You couldn't really see it in the benchmarks — everyone looked good on benchmarks. But over time people started thinking 'oh wow, this is really strong at coding.'"

(A student offers Llama 4 as an example: good benchmarks, and it didn't hold up in community testing.)

### How to detect a contaminated test set

| Method | How |
|---|---|
| **n-gram search** | Take sequences of 7 or 8 tokens and search the training set for the same n-grams from the test set |
| Hashing | Same, with hashes |
| **Embedding search** | Catches **semantic** duplicates — "maybe it isn't word-for-word identical, but it's semantically the same" |

The contamination sources are concrete: "maybe it trained on a blog post where someone introduced the benchmark; maybe it trained on some dark corner of GitHub where a text file lists part of the test set."

**The remedy**: the test set is smaller, so drop the suspect items and **replace them with fresh ones kept offline in a folder that never goes on the internet.**

### Safety evaluation and what it's really for

Stress testing (adversarial attacks, jailbreaks, social engineering), harmful content, hallucination, **privacy leakage** — and **evaluated inside agentic workflows, not just one-shot.**

The key practical line:

> "These dashboards decide the go / no-go on a release, **and they decide where the RLHF goes.** Because supervised fine-tuning and RLHF are **both expensive**, you want to spend them on **what's actually failing.** If you identify precisely which evals are failing, you can focus RLHF on that problem and **save a great deal of money and human time.**"

## Data diagnostics

**Distribution checks**: [The Pile](https://arxiv.org/abs/2101.00027) (800GB) preserves domain tags, so you can plot loss not just for the whole dataset but **per domain.**

If a domain is underrepresented, performance in that domain drops — he points back to the speech example from Lecture 6: **too many zeros and too few ones, and the model never learns the ones.**

**The online-learning risk** (a point not covered elsewhere on the site):

> "Frontier models are **learning in real time**, with data continuously fed in. Suppose **last month's batch had very little code data** — then in that final stretch of training, the coding domain's frequency is lower than other domains'. **If you're not careful, you'll see performance drop in that specific domain.**"

**The fix is smart sampling**, and he points straight back to Lecture 5:

> "Remember **experience replay** from reinforcement learning? It's that family of sampling methods, letting model vendors ensure **the data frequency across domains stays consistent through different phases of training.**"

**Token statistics**: track frequency changes for key tokens. "If the **differentiation symbol** is underrepresented, your model will be much worse when you ask it to differentiate." A real anomaly-report example: **"after the new crawl round, non-English tokens went from 12% to 19%."**

## Closing: are we running out of data?

A student asks about the future of synthetic data, and his answer is balanced:

> "Generally, using synthetic data is a good idea. **But I'd keep an eye on token frequencies** — because synthetic data is so much cheaper that if you generate a lot of it for one domain, **it crowds out the others.**
>
> Practically, I think **the returns on synthetic data plateau at some point.** The recent word is roughly: **what most domains lack now is high-quality data, not synthetic data.**"

He cites Epoch AI's research, saying low-quality text data, audio-visual data and high-quality data will be exhausted in that order over the coming years (he says himself that he forgets the exact numbers).

> **⚠️ The classroom's staging doesn't match the paper.** Epoch AI's [*Will we run out of data?*](https://epoch.ai/publications/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data) (Villalobos et al., 2024) gives a **single estimate**, not three per-modality dates: **the stock of public human text, adjusted for quality and duplication, is around 300 trillion tokens, and will be fully used between 2026 and 2032 on current trends** — sooner with overtraining (the paper mentions 5x overtraining exhausting it in 2027, 100x in 2025). The "2025 / 2027 / 2030" set of numbers from class **has no counterpart in this paper.**

**Why "we generate more data than we consume" isn't a rebuttal** — this argument is good:

> "Are we generating more data than we consume? Probably, **but that doesn't mean models don't plateau.**
>
> You go write Python, and **99% of your Python code is probably already somewhere on the internet**, so the model **doesn't learn much from it.** That's just **more** data, not **higher-quality** data.
>
> Maybe the world's best radiologist writes a research paper unique enough to be high-quality by definition — **but how much of that can we expect?**"

And AI-generated data flowing back in: "code data today is **increasingly generated and then fed back in.** Long story short: **it's much less interesting for training.**"

---

## Beyond the classroom: what this lecture gives application builders

You probably aren't training a 200-billion-parameter model. But three things here transfer directly:

**One: "scattered everywhere = it just got lucky" is a general reading principle.** The saliency-map version is scattered pixels; the LLM-application version is — when your agent gets the answer right but the sources it cites and the reasoning path look arbitrary, that "right answer" isn't reliable. **Getting the answer right isn't the same as looking in the right place.**

**Two: "goose = flock of geese" is a visualization of a labeling problem.** What the model learned is **your labeling habits**, not the concept you had in mind. This is identical for LLM-as-judge: your judge learns the literal shape of the rubric, not the quality standard in your head.

**Three: read benchmarks for relative values only.** This applies directly to reading model release announcements, and he gives the reason — not that vendors falsify, but that **contamination is hard to detect and the capability a benchmark measures may not overlap with your task.**

The last thing worth keeping is his honesty: **this whole methodology currently reaches two layers on transformers.** We understand the internals of the models we use every day far less well than we understand a 2014 convolutional network.

## References

- [Lecture 10: What's Going On Inside My Model?](https://www.youtube.com/watch?v=Ozb1AR_F5MU) — 2025/12/02, Kian Katanforoosh. Source for the seven interpretability methods, scaling laws, benchmark contamination and data diagnostics
- [Visualizing and Understanding Convolutional Networks](https://arxiv.org/abs/1311.2901) — Zeiler & Fergus. Deconvolution visualization
- [Understanding Neural Networks Through Deep Visualization](https://arxiv.org/abs/1506.06579) — Yosinski et al., 2015. The Deep Visualization Toolbox
- [Visualizing Attention in Transformer-Based Language Representation Models](https://arxiv.org/abs/1904.02679) — Vig. Attention visualization
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) — DeepMind, 2022. Chinchilla
- [The Pile: An 800GB Dataset of Diverse Text for Language Modeling](https://arxiv.org/abs/2101.00027) — the dataset that preserves domain tags
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) — Elhage et al., Anthropic, 2021. Source for the circuits notion and induction heads
- [Will we run out of data?](https://epoch.ai/publications/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data) — Villalobos et al., Epoch AI, 2024. About 300 trillion tokens, exhausted 2026–2032
- [CS230 Lecture 10 slides](https://cs230.stanford.edu/syllabus/fall_2025/10/lecture_10.pdf)

**Cited without a link**: the joint OpenAI–Anthropic safety evaluation — this post states the name without verifying a link.
