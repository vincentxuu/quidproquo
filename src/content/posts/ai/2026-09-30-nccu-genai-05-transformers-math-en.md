---
title: "NCCU Yen-Lung Tsai Generative AI L05: Transformers, Explained — Reading Q/K/V, Positional Encoding, and Residuals Through Linear Algebra"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, transformer, attention]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 5
tldr: "L05 reads the whole Transformer with two linear-algebra rules: matrix multiplication is row-times-column dot products, and a row vector times a matrix is a linear combination of the matrix's rows. With those, attention is 'dot the query with every key, softmax into weights, take a weighted average of the values,' or softmax(QKᵀ/√d_k)V in batch form. Dividing by √d_k just pulls the numbers back toward 0 so softmax doesn't become winner-take-all. Then come multi-head attention, encoder versus decoder, masking, positional encoding as a set of sin/cos clocks, and ResNet-style residuals with layer normalization. No homework this week."
description: "A guide to Lecture 5 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis (Spring 2025, term 1132): RNN neurons in matrix form, linear algebra 101, Q/K/V attention and where √d_k comes from, multi-head attention, encoder/decoder and masked attention, sin/cos positional encoding, residual connections, BatchNorm/LayerNorm/RMSNorm/DyT, and why this week has no homework."
draft: false
glossary:
  - term: "position encoding"
    aliases: ["positional encoding"]
    definition: "A vector encoding each word's position in the sentence, added to its embedding so that self-attention, which computes everything in parallel, still knows word order."
    context: "L05 explains the original paper's sin/cos encoding by analogy with the digits of a decimal number, each changing at a different frequency."
  - term: "residual connection"
    aliases: ["skip connection", "ResNet design"]
    definition: "Changing a layer's output from ℓ(z) to z + ℓ(z), so the layer only has to learn what's still missing, f(z) − z. This keeps very deep networks trainable."
    context: "L05 uses it to explain the Add & Norm blocks in the original Transformer diagram."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-05-transformers-math)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide follows the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 5 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L04 LLMs Are Simpler Than You Think](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en). The course is taught in Mandarin.

Two official sources back this post: the [Lecture 5 recording](https://www.youtube.com/watch?v=mhjegVhqb_M) (2025-03-18, 3 h 3 min) and the slide deck [GenAI05 The Mathematics of Transformers](https://drive.google.com/file/d/1Am2WvzkxWNnsXEQVLcPU5NL072GRWyR_/view) (67 pages; the cover reads "The Mathematics of RNNs and Transformers"). On the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025) this week is titled "Transformers 全攻略" ("The Complete Guide to Transformers") and the homework column says "no homework." Access level: **A3**.

> **If you'd rather skip the math**: this is the steepest stretch of the series. Read just the first paragraph of each section and skip the collapsed blocks, or jump straight to [L06 LLM Applications and Ethics](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en). The application lectures that follow won't leave you stuck.

## Course video sources

Video sources were checked against the official course page (Checked: 2026-10-10) and the lecture-to-link mapping matches, but embedded playback has not been verified for each video; if a video does not play inline, use the original video link below. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=mhjegVhqb_M
title: Lecture 05: The complete guide to Transformers (YouTube recording, 2025-03-18) (in Mandarin)
```

Original videos: [Lecture 05: The complete guide to Transformers (YouTube recording, 2025-03-18) (in Mandarin)](https://www.youtube.com/watch?v=mhjegVhqb_M)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

Checked: 2026-10-10.

## Where this week fits

L04 framed an LLM as a machine that continues text by guessing the next word, and gave Q/K/V a brief cameo. L05 goes back and finishes the job: **every component of a Transformer, taken apart, is matrix multiplication.**

The recording's structure: the first hour reviews RNNs, fills in linear algebra, and derives attention and √d_k. The second covers multi-head attention, encoder/decoder, masking, positional encoding, residuals, and normalization. The third has two student lightning talks (crop price forecasting and a tarot-reading app), and the TA session is devoted to "the mysterious √d_k inside softmax."

## Writing an RNN as matrices

Slides 3–8 use a recurrent layer with two inputs and two RNN neurons. An RNN neuron looks like a fully connected layer; the only difference is that its previous output h_{t−1} comes back in and joins the current input in deciding the current output.

Look closely and an RNN neuron is an ordinary neuron with two kinds of input: the "normal" input x_t and the previous hidden states h_{t−1}. Multiply each by a weight matrix and every neuron is computed at once. This "compute a whole batch at once" notation is the key to reading the Transformer.

<details>
<summary>RNN neurons in matrix form (slides 5–8)</summary>

```
h_t = σ( W_Xᵀ x_t + W_Hᵀ h_{t−1} + b )

Neuron 1 expanded:
h_t¹ = σ( w₁₁ˣ x_t¹ + w₂₁ˣ x_t² + w₁₁ʰ h_{t−1}¹ + w₂₁ʰ h_{t−1}² + b₁ )
```

</details>

## Linear algebra 101: two things to remember

Slides 10–14 teach exactly two points, and around minute 24 the recording labels them "the two quick linear-algebra essentials":

1. **Matrix multiplication goes row-then-column.** For C = AB, c_ij is the dot product of row i of A and column j of B. The dot product is the core operation.
2. **A row vector times a matrix is a linear combination of the matrix's rows.** Textbooks usually write Ax with column vectors, but Google loves row vectors, so the Transformer paper writes xA: each component of x is the weight on one row of A.

The second point is the most important technique in the lecture. Attention's "weighted average" later on is exactly this linear combination.

<details>
<summary>The two rules as formulas</summary>

```
Dot product: u = [a₁, …, a_p], v = [b₁, …, b_p]
             ⟨u, v⟩ = u vᵀ = a₁b₁ + a₂b₂ + … + a_p b_p

Row combination: x = [x₁, …, x_m], rows of A are a₁, …, a_m
             x A = x₁ a₁ + x₂ a₂ + … + x_m a_m
```

</details>

## Q/K/V: use a question to find the best-fitting answer

In 2017 Google published [Attention Is All You Need](https://arxiv.org/abs/1706.03762), introducing the Transformer, originally meant to replace RNNs. The slides remark that the title shows Google was aiming even higher.

The intuition on slides 17–20: you have a sequence of information x₁, …, x_T (say, a passage of text), and each x_t has two representation vectors, k_t (key) and v_t (value). A query q (a "question") arrives, and you want the representation h that best fits q given everything before it.

The recipe:

1. Compute the **relevance** between q and each x_t. Google chose the simplest option, the **dot product** q·k_t. The slides stress that relevance can "basically be computed any reasonable way."
2. Softmax all the relevance scores into weights α₁, …, α_T.
3. h = α₁v₁ + α₂v₂ + … + α_T v_T. That's the row-vector linear combination from the previous section.

**Self-attention** means each x_t also produces its own q_t, and every position takes a turn as the query. Stack all the q's into a matrix Q and you get the formula Google is so proud of.

### Why divide by √d_k

Slides 31–33 put it bluntly: using dot products for attention strength actually worked worse than alternatives (such as training a neuron to compute it), mainly because **softmax is winner-take-all** and inflates the top weights far beyond reasonable values.

The example: five scores 3.9, 3.2, 1, 0.3, 1.1 give 61%, 30%, … under plain softmax. Two scores that were close end up a factor of two apart. Divide everything by τ = √5 and they become 1.74, 1.43, 0.45, 0.13, 0.49, which softmax turns into 40%, 29%, 11%, 8%, 11%. Pull the numbers back toward 0 and the problem is solved.

The slides' view: any suitably large number works here, say √9487, and writing √d_k "is basically just to make it look sophisticated." τ can also be treated as a tunable hyperparameter. This week's TA session (recording from 2:24:15) covers the same square root.

<details>
<summary>Deriving attention (slides 21–34)</summary>

```
Single query:
  e_t = ⟨q, k_t⟩ = q k_tᵀ
  stack k_t and v_t into matrices K and V (one vector per row)
  [e₁ … e_T] = q Kᵀ
  h = softmax(q Kᵀ) V                 ← the weights linearly combine the rows of V

All queries at once:
  Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V,   d_k = dimension of the key vectors

Where the vectors come from (all W are learned; x_t is a word embedding):
  q_t = x_t W_Q,  k_t = x_t W_K,  v_t = x_t W_V
```

</details>

## Multi-head, encoder, decoder, and masking

**Multi-head attention** (slide 35): there's no reason attention should come in only one flavor, so define the n-th attention with its own learned matrices, `Attention(Q W_n, K W_n, V W_n)` (the slides' shorthand; in practice Q, K, and V each get their own matrix), and run several in parallel.

**The encoder and decoder differ** (slides 36–39):

- In the encoder, q, k, and v all come from the input vectors themselves: self-attention.
- The decoder has two attention layers. The lower one is **masked** multi-head self-attention. The middle one is the only layer that is not self-attention: **k and v come from the encoder, q comes from the decoder.**
- A Transformer outputs as many vectors as it receives words (word vectors). The decoder works the same way, except **positions not yet generated are masked**, so it can't peek at later words.

The second hour of the recording also has a segment on "why memory limits the number of words" (from 1:10:22) with no matching slide; this post doesn't expand on it.

## Positional encoding: marking order with clocks running at different speeds

An RNN genuinely reads one word at a time. A Transformer, to parallelize, runs self-attention in one shot, so **word order isn't actually taken into account**. Position information has to be added to the original word embeddings; that's position encoding (slide 41).

The intuition on slides 42–43 is elegant. Look at any positional number system, such as the decimal number 9487. The ones digit changes every step, the tens digit every 10, the hundreds every 100: **the higher the digit, the longer its period and the lower its frequency.**

We want a "fantasy number system" that is continuous, periodic, and small in magnitude (so it doesn't drown out the embedding). Sine and cosine fit. So the embedding's dimensions are grouped in pairs that share a frequency, with low-order dimensions at high frequency and high-order dimensions at low frequency.

Why use sin and cos together? Slide 48's answer: one number per digit isn't enough, and (sin, cos) is a point on the unit circle, like the hand of a clock. Low-order clocks spin fast; high-order clocks spin slowly.

The recording also stresses (at 1:28:16) that positional embeddings aren't limited to this one method; sin/cos is just the original paper's choice.

<details>
<summary>The original paper's position encoding (slides 44–49)</summary>

```
The position vector for word t, p_t = [p₀, p₁, …, p_{d−1}], is added to embedding x_t

ω_k = 1 / 10000^{2k/d}
p_{2k}   = sin(ω_k · t)
p_{2k+1} = cos(ω_k · t)
```

The slides flag two details. The original paper usually indexes from 1, but here indexing must start at 0 so that frequencies keep decreasing, ω₀ > ω₁ > …. And polar coordinates put cos first, yet (sin θ, cos θ) also traces the unit circle, with θ = 0 pointing to 12 o'clock and moving clockwise. The slides add, "though we don't know what Google had in mind."

</details>

## Keeping Transformers stable: residual connections and normalization

Back at the original architecture diagram, the piece not yet explained is Add & Norm: **residual connections** and **layer normalization**. The slides call these the best techniques of their day for making networks deeper and more stable, and say that's still roughly true.

### ResNet-style residuals: learn only what's missing

[ResNet](https://arxiv.org/abs/1512.03385) changes a layer's output from ℓ(z) to **z + ℓ(z)** (slides 52–56).

Where we once wanted ℓ(z) ≈ f(z) (with f the target), we now want z + ℓ(z) ≈ f(z), so ℓ(z) = f(z) − z: **the layer only has to learn what hasn't been learned yet.** If z is already close to the right answer, ℓ(z) barely needs to learn anything. The slides cite the loss-landscape visualizations from [Li et al., NeurIPS 2018](https://arxiv.org/abs/1712.09913): with skip connections, the loss surface is much smoother.

### From BatchNorm to DyT

- **Batch Normalization**: compute the mean and standard deviation over a batch, standardize, then scale and shift with learned γ and β; ε in the denominator prevents division by zero.
- **[Layer Normalization](https://arxiv.org/abs/1607.06450)**: the original Transformer's choice. It computes the mean and standard deviation over **a single vector's own components** instead.
- **[RMSNorm](https://arxiv.org/abs/1910.07467)**: used by Llama and other LLMs. It divides by the root mean square without subtracting the mean. Slide 62 shows Sebastian Raschka's architecture comparison from GPT-2 to Llama 3.2 in [LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch), noting that by now you can see how newer models differ.
- **Dynamic Tanh (DyT)**: the slide title reads "Meta recently said you don't need normalization!" DyT(x) = γ · tanh(αx) + β, with α initialized to something like 0.5. The paper is [Transformers without Normalization](https://arxiv.org/abs/2503.10622).

<details>
<summary>Normalization formulas (slides 58–64)</summary>

```
LayerNorm: μ = (1/n) Σ x_i,  σ = sqrt( (1/n) Σ (x_i − μ)² )
           x̂ = (x − μ) / (σ + ε),  y = γ x̂ + β      (γ, β are learned vectors; numpy-style broadcasting)

RMSNorm:   RMS(x) = sqrt( (1/n) Σ x_i² ),  RMSNorm(x) = γ · x / RMS(x)

DyT:       DyT(x) = γ · tanh(αx) + β
```

</details>

## Closing: Transformers aren't just for text

The last two slides (65–66) open the door to the rest of the course. Images, audio, and time series can all go through a Transformer. And the decoder's middle layer, with q from one side and k, v from the other, is a good way to "mix in" information. Take text-to-image AI: a randomly generated "wild idea" serves as Q, a matrix representing the text's meaning produces K and V, and the Transformer's output carries the text's meaning. That thread gets picked up in [L11 Text-to-Image](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en).

## This week's demo notebook and homework

This lecture has **no in-class demo notebook**, and the week 5 homework column on the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025) says plainly "no homework this week." It's one of two teaching weeks without homework; the other is week 15, "New Trends in Generative AI."

No homework doesn't mean you can skip it. The L04 benchmark assignment is still within its two-week window, and this week is a good time to check your explanations of LLM behavior against L05's ideas.

## Self-check

1. Why can the row-vector product xA be read as a linear combination of A's rows?
2. In one sentence each, what roles do query, key, and value play?
3. What problem does dividing by √d_k solve? Would another constant work?
4. What attention layers do the encoder and decoder each have? Which one is not self-attention?
5. Why does self-attention need positional encoding? In the sin/cos version, which dimensions have the highest frequency?
6. Why does the residual z + ℓ(z) make deep networks easier to train?

**Something to do tonight**: in a Colab, write `softmax(Q @ K.T / np.sqrt(d_k)) @ V` with numpy, using random matrices for 3 words and d_k = 4. Then remove √d_k and see whether the weights become more winner-take-all. It takes under ten lines to see the effect from slides 32–33 for yourself.

```python
import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

scores = np.array([3.9, 3.2, 1, 0.3, 1.1])
print(softmax(scores).round(2))               # [0.61 0.3  0.03 0.02 0.04]
print(softmax(scores / np.sqrt(5)).round(2))  # [0.4  0.29 0.11 0.08 0.11]
```

## Further reading

This post stands on its own. For more rigorous or more hands-on versions:

- From positional encoding to causal self-attention: [CMU 07-280 Lecture 20](/posts/ai/2026-08-22-cmu-07280-lecture-20-attention-transformers-en)
- Attention and Transformers from a deep-learning perspective: [CMU 11-785 Lecture 18](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)
- Full courses on Transformers and LLMs: [Stanford CME295 guide](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en), [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en)
- Writing a Transformer language model from scratch: [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)
- Another Mandarin-taught route: [NTU Hung-yi Lee ML 2026 guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | Previous: [L04 LLMs Are Simpler Than You Think](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en) | Next: [L06 LLM Applications and Ethics](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official schedule maps this lecture to the linked video, but embedded playback could not be verified, so status is unchanged.

## References

- [Chang Gung satellite class page: Generative AI 2025 (schedule; no week 5 homework) (in Chinese)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [Lecture 05: The complete guide to Transformers (YouTube recording, 2025-03-18) (in Mandarin)](https://www.youtube.com/watch?v=mhjegVhqb_M)
- [1132 Generative AI recordings playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI05 The Mathematics of Transformers slides (Google Drive) (in Chinese)](https://drive.google.com/file/d/1Am2WvzkxWNnsXEQVLcPU5NL072GRWyR_/view)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [Vaswani et al. 2017: Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [He et al. 2015: Deep Residual Learning for Image Recognition (ResNet)](https://arxiv.org/abs/1512.03385)
- [Li et al. 2018: Visualizing the Loss Landscape of Neural Nets](https://arxiv.org/abs/1712.09913)
- [Ba et al. 2016: Layer Normalization](https://arxiv.org/abs/1607.06450)
- [Zhang & Sennrich 2019: Root Mean Square Layer Normalization](https://arxiv.org/abs/1910.07467)
- [Zhu et al. 2025: Transformers without Normalization (DyT)](https://arxiv.org/abs/2503.10622)
- [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)
