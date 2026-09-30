---
title: "Reading NTU ML 2026: Positional Embedding — How Models Know Token Order and Handle Very Long Inputs"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, transformer, attention, long-context]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 9
tldr: "Self-attention on its own cannot tell \"you hit me\" from \"I hit you\", so the model needs position information from somewhere else. Hung-yi Lee's lecture goes from sinusoidal absolute positions to ALiBi and T5's relative biases, then to RoPE, which Llama, Qwen and Gemma all use. The second half covers train-short-test-long: RoPE breaks when it rotates to angles it never saw in training, which led to Position Interpolation, NTK-Aware scaling, YaRN, Dynamic Scaling and LongRoPE. The final twist is NoPE: causal attention in a decoder-only model already carries position information, and you can even drop the positional embedding after training."
description: "A guide to the 3/27 lecture of NTU Machine Learning 2026 Spring (Hung-yi Lee), \"inside the model: how models handle very long inputs\", based on the 64-page pos.pdf and the lecture video: absolute/sinusoidal embeddings, ALiBi, T5 relative bias, RoPE and whether it decays with distance, train short test long, Position Interpolation, NTK-Aware, YaRN, Dynamic Scaling, LongRoPE, NoPE and DroPE."
draft: false
glossary:
  - term: "RoPE"
    aliases: ["Rotary Position Embedding"]
    definition: "Treats every pair of dimensions in the query and key vectors as a 2D plane and rotates it by an angle set by the token's position, so the dot product between two tokens depends only on their distance."
    context: "The slides note that Llama, Qwen and Gemma all use RoPE, and that it leaves the attention computation unchanged and works with the KV cache."
  - term: "Position Interpolation"
    aliases: ["PI"]
    definition: "Scales position indices beyond the training length back into the range seen during training, so RoPE never rotates to an unseen angle."
    context: "The slides point out that it \"still requires fine-tuning the model\", which motivates the frequency-based methods that only compress low-frequency dimensions."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)

**This guide follows the 3/27 materials of [NTU Machine Learning 2026 Spring by Hung-yi Lee](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 9 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The two previous lectures asked why generation is slow: [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en) deals with memory traffic, [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) deals with repeated computation, and [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en) measured both on a GPU. This lecture asks a different question. **Agents routinely feed models hundreds of thousands of tokens. How does the model know where each token sits? And why does it break on inputs longer than anything it saw in training?**

The course schedule titles this row "inside the model: how models handle very long inputs". The official materials are the slides [pos.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pdf) (64 pages, also as [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pptx)) and the video [How does a Transformer know the order of input tokens? Absolute, Relative, RoPE, and no Positional Embedding](https://youtu.be/Ll-wk8x3G_g) (in Mandarin). Access level is **A3**: slides and recording are public, and this lecture has no quiz or leaderboard.

## The problem: "you hit me" vs. "I hit you"

Slides 2–3 make the point quickly. Feed tokens A B C D into self-attention and look at D. If you reorder the first three as C B A, D's weighted sum comes out exactly the same. Yet "you hit me" and "I hit you" mean opposite things. The Transformer needs position information from somewhere.

Slide 4 splits the lecture into five parts, and this guide follows the same order:

1. Absolute Positional Embedding
2. Relative Positional Embedding
3. RoPE
4. Train short, test long
5. No Positional Embedding?!

## Absolute positions: sinusoidal and its blind spot

The first approach gives each position a vector p and adds it to the token vector x (slide 6). The sinusoidal version from [Attention Is All You Need](https://arxiv.org/abs/1706.03762) builds p from sines and cosines at different frequencies. The slides use a clock: high-frequency dimensions are the second hand and separate neighbouring positions; low-frequency dimensions are the hour hand and separate distant ones (slides 9–11).

Slides 13–14 state what we actually need: **relative position matters**. Whether "the cat ate the fish" appears at the start of the text or at token 101, the link between "cat" and "fish" should be the same. If a long stretch separates them, the link should be much weaker.

Slides 16–22 expand the attention score after adding positions. The dot product of x+p breaks into terms that depend only on content, terms that mix content and position, and terms that depend only on position. The trouble with sinusoidal embeddings is that none of these terms clearly tracks **relative** position. Slide 22 writes down the goal: the position term should depend only on relative position.

<details>
<summary>Expand: the sinusoidal formula</summary>

From the original paper, for position pos and dimension pair i:

- PE(pos, 2i) = sin(pos / 10000^(2i/d))
- PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

Small i means high frequency (the second hand) and large i means low frequency (the hour hand). The numbers 6.3, 628.3 and 54410.1 on slide 10 are how many positions it takes different dimensions to complete one full turn.

</details>

## Relative positions: ALiBi and T5

If relative position is what matters, skip p and modify the attention score directly.

- **[ALiBi](https://arxiv.org/abs/2108.12409) (slide 24)** subtracts b×(m−n) from the score, where m−n is the distance between two tokens. The slide's comment: "the farther apart, the smaller the attention. That's it!" b is set by hand, with a different value for each attention head.
- **[T5](https://arxiv.org/abs/1910.10683) (slide 26)** also adds a distance-based bias to the score, but that bias is a **trainable parameter**.

## RoPE: position as rotation

Slide 27 names [RoPE](https://arxiv.org/abs/2104.09864) as the method used by Llama, Qwen and Gemma, and stresses two advantages: it leaves the attention computation unchanged, and it works with the KV cache.

The intuition: treat every two dimensions of the query and key as an arrow on a plane, and rotate the arrow by nθ for a token at position n. When two tokens take a dot product, only the angle difference (m−n)θ survives. So "cat" and "fish" get the same score at positions 1 and 3 as at positions 101 and 103 (the example on slide 32; the rotation diagrams are on slides 29–31).

<details>
<summary>Expand: how the rotation angles are set</summary>

Each dimension pair gets a base angle θ_i = 1 / 10000^(2i/d), for i = 0, 1, …, d/2−1 (slide 49). Small-i dimensions rotate quickly and large-i dimensions rotate slowly. It is the same second-hand / hour-hand structure as the sinusoidal embedding, with rotation in place of addition.

</details>

### Does RoPE decay with distance?

A common claim is that RoPE makes attention decay with distance. Slides 39–40 cite [Round and Round We Go!](https://arxiv.org/abs/2410.06205) to push back: RoPE does **not** simply decay. The paper studies Gemma 7B and argues that decay is unlikely to be why RoPE works. The slides include a [sample Colab](https://colab.research.google.com/drive/1rWDtAkScrb2K3tcprSTzwuRQo5bGiyKJ?usp=sharing) so you can plot it yourself.

Slide 40 adds that this "is not necessarily a bad thing": a query can learn to line up with keys at a specific distance. The example is "my cat" and "his dog" (in Chinese, "我 的 貓" and "他 的 狗"), where the noun consistently attends to the word two positions back.

## Train short, test long

Slide 42 sets the scene: training sequences are all shorter than 1M tokens, but at test time the input is longer than 1M. Slide 45 explains why RoPE fails. In training, a key rotates at most Nθ. At test time it rotates 2Nθ, pointing in a direction the model has never seen.

Slide 41 lists Aman Arora's [How LLMs Scaled from 512 to 2M Context](https://amaarora.github.io/posts/2025-09-21-rope-context-extension.html) as the reference for this section. The fixes, in order:

| Method | What it does (per the slides) | Cost |
|---|---|---|
| [Position Interpolation](https://arxiv.org/abs/2306.15595) (slides 46–47) | Squeezes 1, 2, 3, 4 into 0.5, 1, 1.5, 2, scaling every position back into the training range; [kaiokendev](https://kaiokendev.github.io/context) did the same around the same time | The slides note it "still requires fine-tuning the model" |
| Frequency-based (slides 48–49) | High-frequency dimensions have already made many full turns within the training length, so going past N is harmless; leave them alone. Low-frequency dimensions never finished one turn in training, so only they need compressing | You must decide which dimensions count as high frequency |
| NTK-Aware Scaling (slides 50–51) | Multiplies dimension pair i by f(L, i) = (1/L)^(2i/(d−2)): the highest-frequency θ_0 is untouched, the lowest-frequency dimension is scaled by 1/L, with a smooth transition in between. A community chart shows LLaMA 7B running well past 2048 tokens without fine-tuning | The source is a Reddit post, not a paper |
| [YaRN](https://arxiv.org/abs/2309.00071) (slide 52) | "Yet another RoPE extensioN method", the paper version of the frequency-based idea | Still a position-scaling approach |
| Dynamic Scaling (slides 53–54) | A fixed compression ratio makes "long sequences work but short sequences get worse"; instead, compress only once a sequence exceeds the training length | The ratio changes with length |
| [LongRoPE](https://arxiv.org/abs/2402.13753) (slide 56) | Frequency-based plus dynamic, with per-dimension scaling factors found by evolutionary search | Requires a search |

## No Positional Embedding?!

The last section overturns the opening premise. Slide 59 shows two decoders fed "cat eats fish?" and "fish eats cat?". Each token can only see itself and earlier tokens. The final token sees the same set of words either way, but the middle tokens see different prefixes, and stacking layers makes the final output differ. The slide concludes: "so there's no need to add a Positional Embedding!"

Two papers back this up:

- **[NoPE](https://arxiv.org/abs/2305.19466) (slide 61)** compares length generalization in decoder-only Transformers with APE, T5 relative bias, ALiBi, Rotary, and no positional encoding at all. NoPE did best on their reasoning and math tasks.
- **[DroPE](https://arxiv.org/abs/2512.12167) (slides 62–63; the YaRN chart on slide 52 also comes from this paper)** argues that positional embeddings help training converge but are also what stops models from generalizing to longer sequences. Dropping them after pretraining, followed by a short recalibration, gives zero-shot context extension.

My reading: the role of the positional embedding shifts from "the model can't understand order without it" to "training wheels". That also explains why all the scaling tricks above hit limits. They are still wrestling with an explicit position signal.

## Back to the model: what this lecture answered

Back to the opening question. Most modern LLMs encode position with RoPE because it puts relative distance into the dot product and works with the KV cache. Stretching context from a few thousand tokens to a million does not come from retraining. It comes from rescaling RoPE's angles at inference time, with little or no fine-tuning. When a model card mentions "rope scaling", "YaRN" or "128K context", it is talking about the second half of this lecture.

**Try this**: open the `config.json` of an open-weight model you use and find `rope_theta` and `rope_scaling`. If `rope_scaling` is set, match it against the table above and work out how many times longer the advertised context is than the training length.

## What this guide can and cannot confirm

Confirmed: the structure of the 64 slides, each slide's title, the labels on the figures and the cited sources. Every paper title and abstract was checked on arXiv, and the video title and uploader were checked via YouTube oEmbed.

Not confirmed: I did not transcribe the video, so examples and numbers the lecturer only said aloud are not included. NTK-Aware and Dynamic Scaling come from Reddit posts. The slides only reuse their charts, and I did not independently verify those numbers.

## Further reading

- The Stanford CME295 guide on [Transformer tricks](/posts/ai/2026-09-29-cme295-transformer-tricks-en), which also walks from positional encoding to RoPE
- The CMU 11-785 guide on [Transformer architectures](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW3: LLM Fast Inference](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en) | Next: [HW4: Training a Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en)

## References

- [NTU Machine Learning 2026 Spring course page (Hung-yi Lee)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [pos.pdf (Positional Embedding slides)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pdf)
- [Video: How does a Transformer know the order of input tokens? Absolute, Relative, RoPE, and no Positional Embedding](https://youtu.be/Ll-wk8x3G_g) (in Mandarin)
- [Attention Is All You Need (arXiv 1706.03762)](https://arxiv.org/abs/1706.03762)
- [Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation (ALiBi, arXiv 2108.12409)](https://arxiv.org/abs/2108.12409)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5, arXiv 1910.10683)](https://arxiv.org/abs/1910.10683)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding (arXiv 2104.09864)](https://arxiv.org/abs/2104.09864)
- [Round and Round We Go! What makes Rotary Positional Encodings useful? (arXiv 2410.06205)](https://arxiv.org/abs/2410.06205)
- [Extending Context Window of Large Language Models via Positional Interpolation (arXiv 2306.15595)](https://arxiv.org/abs/2306.15595)
- [kaiokendev: Extending Context is Hard](https://kaiokendev.github.io/context)
- [YaRN: Efficient Context Window Extension of Large Language Models (arXiv 2309.00071)](https://arxiv.org/abs/2309.00071)
- [LongRoPE: Extending LLM Context Window Beyond 2 Million Tokens (arXiv 2402.13753)](https://arxiv.org/abs/2402.13753)
- [The Impact of Positional Encoding on Length Generalization in Transformers (NoPE, arXiv 2305.19466)](https://arxiv.org/abs/2305.19466)
- [Extending the Context of Pretrained LLMs by Dropping Their Positional Embeddings (DroPE, arXiv 2512.12167)](https://arxiv.org/abs/2512.12167)
- [Aman Arora: How LLMs Scaled from 512 to 2M Context: A Technical Deep Dive](https://amaarora.github.io/posts/2025-09-21-rope-context-extension.html)
- [NTK-Aware Scaled RoPE (r/LocalLLaMA post)](https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/ntkaware_scaled_rope_allows_llama_models_to_have/)
- [Dynamically Scaled RoPE (r/LocalLLaMA post)](https://www.reddit.com/r/LocalLLaMA/comments/14mrgpr/dynamically_scaled_rope_further_increases/)
