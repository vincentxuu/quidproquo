---
title: "MIT 6.5940 L12 Transformer and LLM: The Architecture Seen Through an Efficiency Lens"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, transformer, llm, kv-cache]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 14
tldr: "In Lecture 12, 6.5940 switches from CNNs to Transformers. The lecture doesn't dwell on theory. It points to where memory and compute go. Attention is O(N²). If Llama-2-70B used MHA, its KV cache at batch 16 and length 4096 would take 160GB. GQA shrinks that 8x and MQA shrinks it 64x. MoE adds total parameters while keeping per-token compute flat. This post bridges into Lecture 13 on LLM deployment."
description: "A guide to Lecture 12 of MIT 6.5940 Fall 2024, Transformer and LLM, read only for efficiency: tokenizers and O(N²) attention, pre-norm and the FFN, the three architecture families (T5, BERT, GPT), absolute vs. relative position encoding (ALiBi, RoPE, position interpolation), the KV cache memory formula and MQA/GQA, SwiGLU, the design choices of OPT, LLaMA, Llama 2, Llama 3, and Mistral, Chinchilla vs. inference cost, and Flamingo, PaLM-E, and MoE."
draft: false
glossary:
  - term: "GQA"
    aliases: ["grouped-query attention"]
    definition: "Queries have N heads while keys/values have only G heads, each shared by several query heads. KV cache size shrinks in proportion to the number of kv-heads. The Lecture 12 slides say G is typically N/8; MQA is the extreme case G=1."
    context: "MIT 6.5940 Lecture 12 slides, pages 55–57, as a way to shrink the KV cache for long contexts."
  - term: "Chinchilla law"
    aliases: ["Chinchilla scaling law"]
    definition: "The finding of Hoffmann et al. 2022: for a fixed training compute budget, scale model size and training data together to get the best compute vs. accuracy trade-off. Lecture 12 notes that this is the training-side optimum. Once inference cost counts, training a smaller model longer (as LLaMA did) pays off."
    context: "MIT 6.5940 Lecture 12 slides, page 73."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)

> **Version note**: This post is based on Lecture 12 (2024-10-17) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec12-Transformers-and-LLM.pdf](https://www.dropbox.com/scl/fi/4o87goykb0aoyopps02t4/Lec12-Transformers-and-LLM.pdf?rlkey=k97sdf3ls3xxz4fgvte6px279&dl=0) (90 pages) and the [lecture recording](https://youtu.be/EV6xb4xY708). Page numbers refer to PDF pages. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides and video are public. This lecture has no matching lab.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) puts the same lecture on October 22. As of 2026-09-30 its slide and video links are still empty.

**Series**: previous [L11 TinyEngine and Parallel Computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) | next [L13 LLM Deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

Up to Lecture 11, nearly every example in 6.5940 is a CNN: pruning VGG, quantizing ResNet, squeezing MobileNetV2 onto an MCU. The F24 schedule inserts a "Chapter II: Domain-Specific Optimization" divider before Lecture 12. Everything after it (LLM deployment, post-training, long context, ViT, diffusion) is built on the Transformer. Lecture 12's job is to lay out that architecture so the later lectures share a vocabulary.

This post takes only the **efficiency view**: which design choices cost memory, which cost compute, and what each later variant saves. For the full theory, the site has better starting points: [CS224N Lecture 5: from recurrence to Transformers](/posts/ai/2026-08-22-cs224n-transformers-en), [CME295 Lecture 1](/posts/ai/2026-09-29-cme295-transformer-en) and [Lecture 2](/posts/ai/2026-09-29-cme295-transformer-tricks-en), and [CS336 on architectures and hyperparameters](/posts/ai/2026-08-22-cs336-architectures-hyperparameters-en).

The Lecture Plan on page 6 has four parts: Transformer basics, design variants, LLMs, and advanced topics (multimodal LLMs).

## Transformer basics: where the cost hides

### Why move away from RNNs and CNNs

Pages 9–13 first review the two approaches before the Transformer. RNNs struggle with long-range relationships: for two tokens to interact, information has to travel O(seq_len) steps. And since state n depends on the previous n−1 states, training is hard to parallelize. CNNs have no dependency between tokens and scale well, but their context is limited and their modeling power weaker. The slides also point out a difference between domains: images have locality, language doesn't necessarily.

### What each component means for efficiency

Page 14 lists the Transformer's parts: tokenizer, embedding, Multi-Head Attention (MHA), Feed-Forward Network (FFN), LayerNorm, residual connections, positional encoding, and the final linear head. For efficiency, a few points are worth noting:

- **Tokenizer** (page 16): one word can split into several tokens. The slide's example turns 110 words into 162 tokens. When we compute KV cache or attention cost later, the length N is the token count.
- **Self-attention** (page 21): multiplying Q by K gives an N×N attention weight matrix, so **attention compute is O(N²)**. The slides explain Q/K/V with a YouTube search analogy: the query is the text in the search box, the keys are video titles and descriptions, and the values are the videos themselves.
- **FFN** (page 27): attention handles relationships between tokens but has no elementwise nonlinearity, so a two-layer MLP follows, with the hidden layer expanded to 4d. The slides call it an inverted bottleneck. Lecture 11's MobileNetV2 inverted residual block, which expands channels 6x, has the same shape.
- **LayerNorm and pre-norm** (pages 29–30): Transformers use LayerNorm rather than the BatchNorm common in CNNs, normalizing each token's embedding separately. The slides note that pre-norm now beats post-norm in popularity because it trains more stably.
- **Positional encoding** (pages 31–32): attention and the FFN don't distinguish order on their own. They treat a sentence as a set, so position information has to be added. The original design used absolute positional encoding.

The result on page 34: the original Transformer beat earlier models on machine translation at a fraction of the training cost.

## Design variants: each one saves something

Page 36 lists four main groups of variants after the original paper:

1. Encoder-decoder (T5), encoder-only (BERT), decoder-only (GPT)
2. Absolute positional encoding → relative positional encoding
3. KV cache optimization: MHA → MQA → GQA
4. FFN → GLU

### Three architecture families

Pages 38–41 cover these briefly. [T5](https://arxiv.org/abs/1910.10683) casts every NLP task as text-to-text: the prompt goes into the encoder and the decoder generates the answer. BERT is encoder-only, pre-trained with a masked language model objective (randomly masking 15% of tokens) and next sentence prediction. GPT is decoder-only, pre-trained to predict the next word. Smaller models (GPT-2) get fine-tuned afterward; larger ones can work zero-shot or few-shot.

### Relative positional encoding: train short, test long

Page 43 compares the two approaches. Absolute positional encoding fuses position into the input embedding, so it affects Q, K, and V and propagates through the whole network. Relative positional encoding affects only the attention scores (by adding a bias or modifying Q and K) and leaves V alone. The upside is possible generalization to lengths not seen in training: "train short, test long." The slide adds that this doesn't always hold.

- **[ALiBi](https://arxiv.org/abs/2108.12409)** (page 44): adds an offset based on relative distance directly to the attention matrix, instead of to the token embeddings.
- **[RoPE](https://arxiv.org/abs/2104.09864)** (pages 45–46): the approach LLaMA uses. Split the d-dimensional embedding into d/2 pairs, treat each pair as a 2D coordinate, and rotate it according to position m. The phase difference in the inner product of two vectors is then m−n, which depends only on relative position.

RoPE's efficiency payoff is on page 47. LLMs have a length limit set in training (LLaMA 2k, Llama 2 4k, GPT-4 8k) and break past it. Applying [position interpolation](https://arxiv.org/abs/2306.15595) to RoPE (using a smaller θ) extends LLaMA's context from 2k to 32k. This is the starting point for [Lecture 15 on long context](/posts/ai/2026-09-30-mit-65940-long-context-llm-en).

### KV cache: the first thing to blow up at long context

Pages 49–51. When a GPT-style model generates token by token, each step needs only the current token's query, but it has to attend over the keys and values of **every previous token**. Storing those K and V tensors for reuse is the KV cache.

Page 52 gives the formula:

KV cache size = batch size × layers × kv-heads × head dimension × length N × 2 (K and V) × 2 bytes (FP16)

Plugging in real models:

| Model | KV cache per token, per batch item |
|---|---|
| Llama-2-7B (32 layers × 32 heads × 128) | 512KB |
| Llama-2-13B (40 layers × 40 heads × 128) | 800KB |
| Llama-2-70B, assuming MHA (80 layers × 64 heads × 128) | 2.5MB |

Page 53 scales up the 70B figure. Batch 1 at length 512 needs 1.25GB. Length 4096 needs 10GB. Batch 16 at length 4096 needs 160GB, which takes two A100s. The chart on page 54 shows that at length 2048, the KV cache quickly outgrows the model weights themselves as batch size increases.

This table is the page of this lecture that matters most for what follows. KV cache quantization, H2O, and PagedAttention in [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), and StreamingLLM and DuoAttention in [Lecture 15](/posts/ai/2026-09-30-mit-65940-long-context-llm-en), all attack this number.

### MQA and GQA: store fewer heads

Pages 55–57 fix it by reducing the number of kv-heads:

- **MHA**: N query heads, N key/value heads.
- **[MQA](https://arxiv.org/abs/1911.02150)**: N query heads, a single key/value head.
- **[GQA](https://arxiv.org/abs/2305.13245)**: N query heads, G key/value heads. The slide says G is typically N/8.

At Llama-2-70B's size (64 heads), GQA with 8 kv-heads makes the KV cache 8x smaller, and MQA with 1 makes it 64x smaller. Page 57 cites an experiment from the Llama 2 paper: at large enough model sizes, GQA matches MHA's accuracy. Page 70 also notes that Llama 2's 70B model uses exactly 64 heads and 8 kv-heads.

### GLU: replacing the FFN

Pages 59–60: swapping the original FFN for a [GLU variant](https://arxiv.org/abs/2002.05202) (such as SwiGLU, a Swish activation plus an elementwise multiplicative gate) improves Transformer perplexity.

## LLMs: design choices at scale

Pages 62–63 explain that an LLM is a Transformer scaled up and trained on a large corpus (natural language, code, and more). The slides plot model size against GPU memory on the same chart. Models grow much faster than single-GPU memory, which is one reason this course exists. Scaling also brings "emergent" abilities: some tasks only work once the model is big enough.

Pages 64–66 use GPT-3 (175B) to show in-context learning. With no fine-tuning, the model handles new tasks from a task description (zero-shot) or a few demonstrations (few-shot), and larger models make better use of the demonstrations.

Pages 68–72 list the design choices of several open models. For an efficiency reader, the takeaway is that most of these choices have converged:

| Model | Design choices listed on the slides |
|---|---|
| [OPT](https://arxiv.org/abs/2205.01068) | decoder-only, pre-norm (the 350M model is the exception with post-norm), ReLU in the FFN; nine sizes from 125M to 175B |
| [LLaMA](https://arxiv.org/abs/2302.13971) | decoder-only, pre-norm, SwiGLU, RoPE; 7B to 65B; context 2048 |
| Llama 2 | context 2k → 4k; training tokens up from 1T/1.4T to 2T; GQA in the larger models; plus Llama-2-chat |
| Llama 3 | 15.6T training tokens; 50x Llama 2's compute; 405B flagship; 8K context for base, 128K for instruct; post-training with SFT, rejection sampling, and DPO |
| Mistral-7B | GQA (8 kv-heads), 8k context, sliding window attention (dropped from v2 on); the 7B model beats Llama-2-13B |

### Chinchilla and inference cost

Page 73 cites [Chinchilla](https://arxiv.org/abs/2203.15556): for a fixed training compute budget, scale model size and data together to get the best compute vs. accuracy trade-off. Then the slide adds a note that only an efficiency course would make:

> Note: the trade-off is different if we consider the inference computation trade-off

If you care about inference cost, train a smaller model for longer, as LLaMA did. The slide points out that Llama-2 7B was trained on 2T tokens, far more than Chinchilla recommends. For deployment this is good news: a model of the same capability can be smaller.

## Advanced topics: multimodality and MoE

### Two ways to let an LLM see

Page 76 splits vision-language models into two groups:

- **Inject visual information with cross-attention** ([Flamingo](https://arxiv.org/abs/2204.14198) style, pages 77–81): freeze the LLM and insert cross-attention layers between its layers. A Perceiver Resampler uses a small set of learned queries to compress image features of varying size into a fixed number of visual tokens. Gated cross-attention uses a tanh gate to control how much visual information flows in. The gate starts at 0, so at first it doesn't disturb the original LLM.
- **Feed visual tokens directly as input** ([PaLM-E](https://arxiv.org/abs/2303.03378) style, pages 82–83): images, robot states, and other modalities are all turned into tokens for the LLM. RT-2 goes further and outputs control signals directly.

The Perceiver Resampler is itself an efficiency choice: the fewer visual tokens, the shorter the sequence the LLM has to process. This thread continues with multimodal LLMs in [Lecture 14 on post-training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en).

### MoE: more parameters, same compute per token

Pages 86–89 (citing [Switch Transformers](https://arxiv.org/abs/2101.03961)): MoE has each token use only part of the parameters. A router assigns tokens to different experts. More experts means more total parameters and lower loss, while per-token inference cost stays the same.

Page 88 explains the capacity factor C with a small example: 6 tokens, 3 experts. With C = 1, each expert handles at most 2 tokens, so one token gets skipped. With C = 1.5 the cap rises to 3, leaving experts 2 and 3 some slack. This parameter decides whether an unbalanced load drops tokens or reserves extra room.

## What to do after this lecture

- **Tonight**: pick an open model you use and read the layer count, kv-head count, and head dimension from its config. Use the formula on page 52 to compute the KV cache at batch 1 and length 8192, then compare it with the size of the weights. That ratio tells you whether your bottleneck is the weights or the KV cache.
- Then read [Lecture 13 on LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) to see how quantization, sparsity, and serving each deal with these numbers.

## Further reading

- Transformer theory: [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en), [Stanford CME295 guide](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en)
- Another take on inference cost: [CS336 Lecture 10: LLM inference](/posts/ai/2026-08-22-cs336-inference-en)
- KV cache and serving systems: [CMU 11-868 serving at scale: prefill/decode disaggregation and the KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en)
- MoE and model parallelism: [CMU 11-868 L16–L17](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940): L12 date, the Chapter II divider, slide and video links
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940): L12 scheduled for October 22, materials not yet released
- [Lec12-Transformers-and-LLM.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/4o87goykb0aoyopps02t4/Lec12-Transformers-and-LLM.pdf?rlkey=k97sdf3ls3xxz4fgvte6px279&dl=0): source of every page number, KV cache figure, and model spec in this post
- [EfficientML.ai Lecture 12 - Transformer and LLM (YouTube)](https://youtu.be/EV6xb4xY708)
- [Vaswani et al., Attention Is All You Need (2017)](https://arxiv.org/abs/1706.03762)
- [Raffel et al., T5 (2019)](https://arxiv.org/abs/1910.10683)
- [Press et al., ALiBi: Train Short, Test Long (2021)](https://arxiv.org/abs/2108.12409)
- [Su et al., RoFormer: Rotary Position Embedding (2021)](https://arxiv.org/abs/2104.09864)
- [Chen et al., Extending Context Window of LLMs via Positional Interpolation (2023)](https://arxiv.org/abs/2306.15595)
- [Shazeer, Fast Transformer Decoding: One Write-Head is All You Need (2019)](https://arxiv.org/abs/1911.02150): MQA
- [Ainslie et al., GQA (2023)](https://arxiv.org/abs/2305.13245)
- [Shazeer, GLU Variants Improve Transformer (2020)](https://arxiv.org/abs/2002.05202)
- [Zhang et al., OPT (2022)](https://arxiv.org/abs/2205.01068)
- [Touvron et al., LLaMA (2023)](https://arxiv.org/abs/2302.13971)
- [Hoffmann et al., Training Compute-Optimal Large Language Models (2022)](https://arxiv.org/abs/2203.15556): Chinchilla
- [Alayrac et al., Flamingo (2022)](https://arxiv.org/abs/2204.14198)
- [Driess et al., PaLM-E (2023)](https://arxiv.org/abs/2303.03378)
- [Fedus et al., Switch Transformers (2021)](https://arxiv.org/abs/2101.03961)
