---
title: "Reading CMU 11-768 L3: How Long-Context Agents Manage Memory — Hybrid Attention, RoPE Extension, Prompt Caching, and Compaction"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, long-context, kv-cache, context-engineering]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 3
tldr: "An agent resends its whole history on every call, so five calls already add up to 80K input tokens; 1,500 OpenHands sessions averaged 78K tokens, 37% of them tool results. Neubig works on two layers: at the model layer, hybrid attention (many local layers, one global) plus length curricula make million-token context possible; at the harness layer, stable prefixes earn cache reads roughly ten times cheaper, and compaction that keeps anchors and externalizes evidence gets past the limit — evaluated by how the agent continues afterwards."
description: "A guided reading of CMU 11-768 AI Agents Lecture 3, Context Management for Long-Context Agents: quadratic context growth, prefill/decode and TTFT, sliding-window, linear (DeltaNet, KDA), sparse attention and KV compression, RoPE, NoPE and YaRN, long-context training data, prompt-cache pricing with PagedAttention and RadixAttention, and compaction policy, drift, and evaluation."
draft: false
glossary:
  - term: "prefill"
    aliases: ["prefill phase"]
    definition: "The first inference phase: process the whole input prompt at once and compute keys and values for every position. Compute-bound; time grows with prompt length."
    context: "Used here to explain why longer prompts make the first token arrive later (higher TTFT)."
  - term: "TTFT"
    aliases: ["time to first token", "TPOT", "time per output token"]
    definition: "TTFT is the time from sending a request to receiving the first output token; TPOT is the gap between subsequent output tokens."
    context: "Interactive coding agents care a lot about both; an agent running overnight in the background may not care at all."
  - term: "linear attention"
    aliases: ["DeltaNet", "Gated DeltaNet", "KDA"]
    definition: "Dropping softmax lets attention be rewritten as a fixed-size state matrix updated once per step, so decoding cost no longer grows with history length. The DeltaNet family improves it with error-correcting writes and gradual forgetting."
    context: "The star of this post's model layer, and how most new open models build their local layers."
  - term: "compaction"
    aliases: ["context compaction", "context compression"]
    definition: "When the context is nearly full, replace older history with a summary or structured checkpoint so the agent can keep working."
    context: "The last piece of the harness layer here, and what Assignment 1 Part 2 asks you to implement."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management)

Lecture 3 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) (Sep 1; [slides](https://www.cmu-agents.com/slides/lecture-03-long-context.pdf), [recording](https://www.youtube.com/watch?v=AiwCCvFW1uE)) is Graham Neubig again. He says he almost titled it "context management for long-context LLMs," since most of the material is general LLM territory. But long context is critical for agents and basic LLM courses often skim it, so he goes into detail and surveys the architectures recent open models use to handle very long contexts.

The problem is easy to state: every tool call from [last lecture](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en) grows the history, and the next call sends the whole history to the model again. The lecture asks two questions: can the model **use** input this long (capacity), and can the system **afford** it (efficiency)?

**How to read this post**: the lecture has two layers. The model layer covers attention architectures, position encoding, and training data — the concern of people who build models. The harness layer covers prompt caching and compaction — what anyone writing an agent deals with every day. If you build agents but don't train models, you can skip ahead to "The harness layer." Every model-layer section opens with the intuition and tucks formulas into collapsible blocks. For background on attention and inference, the site's [CS336 Lecture 4: Attention and MoE](/en/posts/ai/2026-08-22-cs336-attention-moe-en) and [CS336 Lecture 10: Inference](/en/posts/ai/2026-08-22-cs336-inference-en) are good prerequisites.

## Course video sources

The official schedule is at the SPA route #/schedule. Groundlane and Exa did not retrieve the full schedule in this update, so the article’s direct recording sources were not reverified. Check the official schedule for the lecture recording.

Course and recording entries:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

## Why agent context grows so fast

The first slide is a quadratic. Say the fixed prefix is 1K and each call adds 5K of history: call 1 takes 6K of input, call 2 takes 11K, call 3 takes 16K, and after five calls you have processed 80K tokens in total. History grows linearly; **the total fed to the model grows quadratically**. Neubig says he has run coding-agent sessions for nearly a full day, so imagine how big that gets.

Where do the tokens come from? He analyzed 1,500 [OpenHands](https://github.com/OpenHands/OpenHands) sessions (each solving one specific issue, not multi-day runs), averaging 77,922 tokens per session:

| Component | Share |
|---|---|
| System prompt + tool descriptions | 23% |
| User messages | 9% |
| Reasoning | 9% |
| Direct replies to the user | 2% |
| Tool calls (writing and reading code) | 20% |
| Tool results (file contents and other returns) | 37% |

Two observations. OpenHands' system prompt alone is 15K to 18K tokens (Neubig says that's because they have strong views on how the agent should work; typical agents run 8K to 20K depending on how many tools are attached). And the model spends more than four times as many tokens reasoning as it does talking to the user. The biggest slice is tool results.

## Two challenges: capacity and efficiency

- **Capacity**: can the model use the evidence it needs? Shaped by architecture, position encoding, and training; measured by evaluation.
- **Efficiency**: can the system afford to serve it? Shaped by attention compute, KV memory, caching, and compaction; determines cost and latency.

The capacity problem is that advertised context and effective context are different things. The classic demonstration is Greg Kamradt's [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack): hide the sentence "The best thing to do in San Francisco is eat a sandwich and sit in Dolores Park on a sunny day" inside a pile of Paul Graham essays, then ask the model what the best thing to do in San Francisco is. As the context gets longer, weaker models start to miss it. When Neubig asked students what goes wrong in long coding-agent sessions, the answers were consistent: it forgets the initial instructions, and it does things you told it not to do. The worst story: a user said "don't delete this," and the agent deleted it anyway because it had forgotten. In agent settings users keep adding instructions mid-conversation, so this kind of forgetting hurts.

## Inference basics: prefill, decode, and four metrics

Efficiency starts with the two inference phases (the slides cite [DistServe](https://arxiv.org/abs/2401.09670)):

- **Prefill**: process the whole prompt at once, computing keys and values for every position and writing them to the KV cache. Compute-intensive; latency grows with prompt length.
- **Decode**: generate one token at a time, reading the whole KV cache and appending the new token's KV. Sequential and memory-bandwidth-bound.

A scheduler handles queueing, batching, and routing. Four metrics: **TTFT** (how long until the first token; long prompts mean higher TTFT), **TPOT** (gap between output tokens), **throughput** (completed tokens or requests over wall-clock time), and **cost** (input, cached input, and output billed separately).

Neubig pointed to OpenRouter: for the same model, output speed ranges from about three tokens per second to hundreds depending on provider, which changes the agent experience drastically. Which metric matters depends on use: interactive work in an editor makes TTFT and TPOT critical; an agent running in the background overnight may not care. His own company provides coding-agent services, and inference vendors often ask him which he cares about so they can tune for it.

---

# The model layer: fitting a million tokens

## Intuition: cap the comparisons per step

Standard attention is **global**: every token compares with every earlier token. Frontier models today sit between 256K and one million tokens, and everyone is heading for a million. A million tokens compared pairwise is 10¹² comparisons, each a large vector multiplication.

Every fix shares one idea: **put a constant cap on the number of comparisons per step**, turning O(n²) into O(wn). The w doesn't have to be a window, just a limit.

There are two roles. **Local layers** compute within a restricted range and are cheap; **global layers** can pass information across the whole sequence. Neubig says nearly every popular model today is a hybrid: several local layers, one global, several local, repeat.

| Model | Local / stateful | Global | Local : global |
|---|---|---|---|
| Qwen3.8-Flash-Next | Gated DeltaNet | sparse retrieval (QSA) | 36:12 ≈ 3:1 |
| GLM-5.3-Flash | Kimi Delta Attention | DSA + IndexPool | 34:11 ≈ 3:1 |
| Kimi K3 | Kimi Delta Attention | dense Gated MLA | 69:24 ≈ 3:1 |
| Nemotron 3 Ultra | Mamba-2 | dense GQA | 48:12 = 4:1 |
| Inkling-Small | 512-token window | dense GQA | 35:7 = 5:1 |
| DeepSeek-V4-Pro-0813 | 128-token window branch | compressed sparse / dense interleaved branches | — |

(Table from the slides. I checked it against the official pages the slides cite: mechanism names and ratios broadly match, but many layer counts appear only in Hugging Face config files, not in the official blog or report. GLM-5.3-Flash's README only says "a hybrid architecture combining sparse and linear attention"; KDA, DSA, and 34:11 all come from its config, and the name "IndexPool" appears nowhere in the sources; the config only has `index_kpool` settings. The "dense" branch in the DeepSeek row is what the paper calls HCA: dense attention over KV compressed roughly 128×, not ordinary dense attention. The paper covers the V4-Pro preview; Pro-0813 details exist only in its config. Inkling's blog 5:1 figure describes full Inkling; Small's 512-token window and 35:7 come from its config.) Four mechanisms keep recurring: sliding windows, linear attention (or recurrent models), sparse attention, and KV compression.

## Mechanism 1: sliding-window attention

**Intuition**: each token looks only at the previous w positions. Stacking layers widens the view: layer one pulls from the previous chunk or two, but at layer two those earlier chunks already carry information from their own predecessors, so the effective window grows layer by layer. The cost is that a single local layer cannot directly retrieve distant tokens.

<details>
<summary>Formula: the window mask</summary>

Same attention equation, different mask:

```
M_ij(w) = 0      if 0 ≤ i − j < w
        = −∞     otherwise
```

Work drops from O(n²) to O(nw). Source: [Longformer](https://arxiv.org/abs/2004.05150).

</details>

## Mechanism 2: the linear-attention family

**Intuition**: softmax is expensive because it exponentiates and normalizes, forcing you to compute every query-key pair. Softmax is also what makes attention good: it turns scores into weights that sum to one, letting the model focus on a few relevant tokens. **Remove softmax** and you lose expressiveness, but gain something: by associativity you can pre-sum "all past keys × values" into one fixed-size state matrix. Each new token updates the matrix once, like an RNN, and decoding goes from O(n²) straight to O(n), no w needed.

The refinements all try to make that matrix behave more like real attention:

- **DeltaNet**: read before writing. Use the current matrix to predict which value this key should map to, write only the **prediction error**, and scale by a learning rate β so updates aren't too large. Neubig likens it to online learning.
- **Gated DeltaNet**: plain linear attention has no way to stop a strange key from long ago from affecting the future, so each step first multiplies the whole matrix by a decay factor α and old content fades. Stronger decay makes the model more local. Qwen models use this.
- **Kimi Delta Attention (KDA)**: replace the single α with a per-channel decay rate, so some information persists for a long time and some fades fast. Kimi K3 (per its technical report) and GLM-5.3-Flash (per its HF config) use this version.

Mamba is similar in spirit but mathematically more involved, so the lecture skips it.

<details>
<summary>Formulas: from softmax to KDA</summary>

Notation: q, k, v are the query, key, and value rows at step t; S is a d_k × d_v state matrix.

**Softmax attention** ([Attention Is All You Need](https://arxiv.org/abs/1706.03762)): keep every past k and v and compare with all of them.

```
a_ti = exp(q_tᵀ k_i / √d_k) / Σ_j exp(q_tᵀ k_j / √d_k)
o_t  = Σ_i a_ti v_i
```

**Linear attention** ([Transformers are RNNs](https://arxiv.org/abs/2006.16236)): replace softmax with the bilinear score q_tᵀ k_i and reassociate:

```
o_t = Σ_i (q_tᵀ k_i) v_i = (Σ_i k_i v_iᵀ)ᵀ q_t = S_tᵀ q_t
S_t = S_{t−1} + k_t v_tᵀ
```

Writes are purely additive; interference is never explicitly erased.

**DeltaNet** ([Schlag et al., ICML 2021](https://arxiv.org/abs/2102.11174)): read the prediction, write only the error.

```
v̂_t = S_{t−1}ᵀ k_t
e_t = v_t − v̂_t
S_t = S_{t−1} + β_t k_t e_tᵀ        β_t ∈ [0, 1]
```

**Gated DeltaNet** ([Yang et al., 2024](https://arxiv.org/abs/2412.06464)): decay the whole state, then apply the same correction. α_t = 1 recovers DeltaNet.

```
S̃_{t−1} = α_t S_{t−1}
S_t = S̃_{t−1} + β_t k_t (v_t − S̃_{t−1}ᵀ k_t)ᵀ
```

**KDA** ([Kimi Linear](https://arxiv.org/abs/2510.26692)): α becomes a length-d_k vector, giving each channel its own memory lifetime. Equal decay across channels recovers Gated DeltaNet.

```
D_t = Diag(α_t)
S_t = (I − β_t k_t k_tᵀ) D_t S_{t−1} + β_t k_t v_tᵀ
```

</details>

## Mechanism 3: sparse attention

**Intuition**: instead of looking at the whole past, look at a subset. Two ways to choose:

- **Fixed pattern**: e.g. a local window plus a few fixed global positions. Cost is predictable but the pattern can't adapt to the query. Neubig mentioned OpenAI's sparse-attention paper from "about five years ago" as this kind, and said complexity stays quadratic but with a much smaller constant. The paper is actually the 2019 [Sparse Transformer](https://arxiv.org/abs/1904.10509) (Child et al.), which claims O(n√n) complexity.
- **Content-dependent**: first compute a very cheap approximate attention, pick the top-K keys, and run full attention only on those. [DeepSeek Sparse Attention](https://arxiv.org/abs/2512.02556) (from the DeepSeek-V3.2 paper) works this way: a "lightning indexer" with only a few heads, computed in FP8, picks 2,048 tokens per query. It adapts, but a selector mistake drops a relevant key.

Asked which similarity top-K uses, Neubig said it's usually a dot product rather than cosine; he wasn't sure whether vectors are normalized first. In the DeepSeek-V3.2 paper, the indexer score is a query–key dot product passed through ReLU and weighted per head, with no normalization.

<details>
<summary>Formulas: two kinds of sparse sets</summary>

```
Fixed:             S_i = {j ≤ i : i − j < w} ∪ (G ∩ [1, i])
Content-dependent: S_i = TopK_{j ≤ i} g(q_i, k_j)        |S_i| = K
Both renormalize over the retained set:
A_ij = softmax_{j ∈ S_i}(q_iᵀ k_j / √d_k),   o_i = Σ_{j ∈ S_i} A_ij v_j
```

G is a fixed set of global positions; g is a learned selector.

</details>

## Mechanism 4: KV compression

**Intuition**: when the KV cache is huge, a GPU can hold only a few requests. The cache stores K and V (not Q), so shrinking K and V saves memory directly.

- **GQA** ([Grouped-Query Attention](https://arxiv.org/abs/2305.13245)): several query heads share one set of K and V; head count is typically divided by 4 or 8.
- **MQA**: the extreme case, all query heads share one set.
- **MLA** ([DeepSeek-V2](https://arxiv.org/abs/2405.04434)): keep the number of heads, make each smaller. Mainly cache one low-dimensional latent and project it back to per-head K and V when needed; to stay compatible with RoPE, the paper also caches a shared "decoupled RoPE key."

The two can be combined.

<details>
<summary>Formula: MLA</summary>

```
c_t^KV = W^DKV z_t                 (this latent is cached, plus the decoupled RoPE key)
k_t^(h) = W^UK(h) c_t^KV,  v_t^(h) = W^UV(h) c_t^KV
```

W^D compresses; W^UK and W^UV recover per-head K and V.

</details>

## Training long-context models: the data isn't long enough

Architecture makes a million tokens computable; the model still has to learn to use them. The obstacle is data: few documents on the web are coherent across 128K tokens — longer than most Wikipedia articles, closer to a whole book. So the standard recipe is:

```
Short pretraining (4K–8K, abundant, cheap) → continued training (32K–128K, long documents) → long adaptation (128K+)
```

Neubig was emphatic that **packing** ten short documents into one long sequence helps efficiency but teaches no attention across documents, so it does little for long-context ability and is probably best avoided. You need genuinely coherent long data.

## Position encoding: RoPE, NoPE, and extension

**Intuition**: the model needs token order. Three mainstream approaches:

- **Absolute positional encoding**: add a vector per position (sinusoidal or a learned table) before the first layer.
- **RoPE** ([RoFormer](https://arxiv.org/abs/2104.09864)): rotate Q and K by a position-dependent angle so the score between two tokens depends only on their **relative distance**; absolute position doesn't affect whether they attend to each other. Neubig finds it mathematically elegant, and many models use it.
- **NoPE**: no positional encoding at all. It sounds wrong — transformer courses warn that without one, "cat" in "this is a cat" and "this is not a cat" would look the same. A student named the key: **the causal mask**. "Cat" at position 2 sees one prior token; at position 5 it sees four. From the first attention layer on, their representations differ. [Kazemnejad et al. (NeurIPS 2023)](https://arxiv.org/abs/2305.19466) argue autoregressive transformers don't need positional encodings. With decaying local layers like Gated DeltaNet, order information is already built in.

**The extension problem**: RoPE depends only on relative position in principle, but if you train at length L and run at sL, the model has never seen two tokens interact beyond distance L; the causal mask and other factors also matter. So you can't just run RoPE on longer sequences. Common fixes:

- **Position Interpolation** ([Chen et al., 2023](https://arxiv.org/abs/2306.15595)): divide RoPE's angle parameter by the extension factor s, squeezing new positions back into the phase range seen in pretraining.
- **YaRN** ([Peng et al., ICLR 2024](https://arxiv.org/abs/2309.00071)): similar in spirit to KDA — treat frequencies differently. Fully interpolate long-wavelength dimensions, keep short-wavelength dimensions' local distinctions, blend in between, and add an attention-temperature correction.

<details>
<summary>Formulas: absolute position, RoPE, PI, and YaRN</summary>

**Absolute (sinusoidal)**:

```
z_t = E[x_t] + p_t
p_{t,2ℓ} = sin(t / ω_ℓ),  p_{t,2ℓ+1} = cos(t / ω_ℓ),  ω_ℓ = 10000^(2ℓ/d)
```

**RoPE**: R(t) is block-diagonal 2D rotations with angles tθ_ℓ. V is not rotated.

```
q̃_i = R(i) q_i,  k̃_j = R(j) k_j
q̃_iᵀ k̃_j = q_iᵀ R(j − i) k_j        the score depends only on j − i
```

**Position Interpolation**: s = L′ / L; every dimension is stretched by the same factor.

```
R(t) → R(t / s), equivalently θ_ℓ → θ_ℓ / s
```

**YaRN**: γ_ℓ ramps from 0 at long wavelengths (full interpolation) to 1 at short wavelengths (keep original phase).

```
θ′_ℓ = (1 − γ_ℓ) θ_ℓ / s + γ_ℓ θ_ℓ
A = softmax((QKᵀ + M) / (τ √d_k)),   √(1/τ) = 0.1 ln s + 1
```

The slide writes the temperature as 1/τ = 0.1 ln s + 1; the YaRN paper (Eq. 15) has √(1/τ) = 0.1 ln s + 1, i.e. q and k are each scaled by √(1/τ). This post follows the paper. The slide notes that the τ formula was fit on LLaMA models (the paper says LLaMA 7B through 65B, and that the same values work fairly well for Llama 2): a recipe, not a universal constant. The temperature correction counteracts attention-entropy drift at larger extension scales.

</details>

How each model reaches its maximum length (from the slides):

| Model | Length training | Position method | How it reaches max context |
|---|---|---|---|
| Qwen3.8-Flash-Next | 262K native; curriculum undisclosed | partial RoPE | YaRN extension to 1M |
| DeepSeek V4 | 4K → 16K → 64K → 1M | partial RoPE | progressive training + YaRN |
| GLM-5.3-Flash | 1M native; curriculum undisclosed | NoPE in main attention | no RoPE rescaling |
| Kimi K3 | 8K → 64K → 256K → 1M | NoPE | progressive training to 1M |
| Nemotron 3 Ultra | 1M long-context CPT; SFT to 512K | implicit order in Mamba; no RoPE | trained/evaluated at long lengths |
| Inkling | 1M; curriculum undisclosed | relative position embedding | learned relative representation |

(From the slides. Notes from checking sources: the DeepSeek V4 paper doesn't mention YaRN, which appears only in its HF config; GLM-5.3-Flash's 1M context and NoPE likewise appear only in its config; in Nemotron 3 Ultra's long-context phase, 92% of iterations ran at 1M and 8% at 4K.)

Neubig's read: roughly half use (partial) RoPE and half skip positional encoding entirely.

## Long-context training data

Four sources:

- **Long documents**: books, codebases (usually coherent, and a whole repo is a lot of tokens), multi-document corpora on one topic. He has also seen people use patents, which are public in bulk and can be linked together.
- **Packed examples**: high token utilization, but boundaries and cross-example leakage matter; they teach handling of information near the end of the window, not global coherence.
- **Agent trajectories**: a major source today, since agents produce very long trajectories with little effort; they teach long-horizon recovery, state tracking, and tool use.
- **Synthetic tasks**: evidence and distractors placed at designed positions; many evaluations are built this way.

Neubig pointed out an industry reality: closed models don't even disclose their architecture; open models must, or you couldn't run them, so what they guard is data and training strategy. The shared recipe visible from public reports is **coherent long sources + tasks whose answers depend on distant evidence + progressive length growth** (e.g. Kimi K3's 8K → 64K → 256K → 1M, GLM-5's 32K → 128K → 200K).

## Context parallelism

Asked about parallelism in training, students named data parallelism and model parallelism (expert, tensor, and pipeline parallelism are all flavors of the latter). Long context needs a third: **context parallelism** ([Ring Attention](https://arxiv.org/abs/2310.01889)). Split the sequence across devices, compute K and V block by block, and pass them to the next device, overlapping communication with block attention. The slide puts it as memory per device dropping to 1/P with total work unchanged (the paper frames it as context length scaling linearly with the number of devices), and it is exact, not a sparse approximation. It matters past roughly 32K.

Neubig shared a team tension: modeling people say "I want Kimi Delta Attention," and infrastructure people say "then I need a context-parallel kernel for it that supports backprop." He once wanted context parallelism for a smaller Qwen model and found no Gated DeltaNet kernel anywhere online; he had to write one or do something else. Kernels for standard attention and sliding windows are far easier; the trouble is always non-standard attention.

---

# The harness layer: what agent builders manage every day

## Prompt caching: same prefix, no recompute

Neubig stressed this one matters even if you never implement a model and only run agents.

**Mechanics**: on call 1, input goes through prefill to produce KV, and output tokens extend the KV cache during decode. The tool result is new (the model didn't compute it) and becomes the new input for call 2, but everything before it can be reused from cache, so only the new part needs prefill. Repeat, and the reusable prefix keeps growing. By step 50, no cache means recomputing the input 50 times. [Prompt Cache](https://arxiv.org/abs/2311.04934) shows that without caching compute grows quadratically with length, and with caching it is roughly linear.

**The money gap**: the slides compile official prices (checked Aug 30, 2026; USD per 1M tokens; "cached" means a cache read, and cache creation may be billed separately):

| Model | Cached input | Regular input | Output |
|---|---|---|---|
| DeepSeek V4 Flash | 0.007–0.014 | 0.22–0.44 | 0.66–1.32 |
| GLM-5.2 | 0.26 | 1.40 | 4.40 |
| Kimi K3 | 0.30 | 3.00 | 15.00 |
| GPT-5.6 Luna | 0.02 | 0.20 | 1.20 |
| GPT-5.6 Sol | 0.40 | 4.00 | 20.00 |
| Claude Opus 5 | 0.50 | 5.00 | 25.00 |

**Rechecked against the official pages on Sep 29, 2026**: GLM-5.2, Kimi K3, GPT-5.6 Luna/Sol (Standard tier, short-context prices), and Claude Opus 5 all match the slide. DeepSeek has changed: on Sep 10 V4 Flash was retired and replaced by `deepseek-flash` (V4.1-Flash) at lower prices, now 0.003–0.006 cached, 0.15–0.30 regular input, and 0.60–1.20 output (DeepSeek ranges are off-peak to peak); the old `deepseek-v4-flash` name routes to the new model at the new price. Also, the Kimi pricing link on the slide now redirects to a consumer membership page; API prices are on the [Kimi platform pricing page](https://platform.kimi.ai/docs/pricing/chat).

Rough pattern: cached tokens are about ten times cheaper than regular input, output is typically around five times pricier than regular input, so output versus cached input is about fifty times. You need to know whether your tokens are being cached, or you'll overpay heavily for your agents. What is a good cache hit rate? Students guessed 80–90% and over 95%; Neubig's own bar is that **90–95% is quite good**. The slides also note that measured physical cost and provider API price are different quantities.

**How serving systems do it**: the two most popular open-source serving libraries were each founded on a KV-management innovation.

- **vLLM's [PagedAttention](https://arxiv.org/abs/2309.06180)**: carve GPU memory into physical blocks and map them with a block table, like OS paging, so a sequence's KV can live in blocks 7, 1, and 3. The goal is generating many sequences at once and freeing whole blocks when done.
- **SGLang's [RadixAttention](https://arxiv.org/abs/2312.07104)**: store computed prefixes in a radix tree; incoming requests match and reuse the shared prefix and append their suffix, and the least-recently-used leaf is evicted under pressure. It was built for ChatGPT-style continued conversations, and matters even more for agents, whose conversations are longer and more frequent.
- **Cache-aware routing**: across machines, send each request to the worker with the longest reusable prefix, weighed against queue length. The slide simplifies the score to "reusable prefix minus a queue penalty"; the [SGLang v0.4](https://lmsys.org/blog/2024-12-04-sglang-v0-4/) post describes keeping an approximate copy of each worker's radix tree on the router, predicting prefix hit rates, sending requests to workers with higher hit rates, and separately load-balancing to avoid imbalance.

Cache hit rates vary a lot across providers on OpenRouter (Neubig again noted Mistral at the bottom), though that may reflect workloads rather than quality. Factors include routing quality and **how long caches are retained**. Providers won't keep your cache forever; Neubig recalled Anthropic's used to be 5 minutes, and you can now pay a bit more to extend it to an hour. Per the [Anthropic prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), the default lifetime is 5 minutes, refreshed for free on each hit; a 1-hour option is also offered, with cache writes at 2× base input price (1.25× for 5-minute writes), and reads at 0.1× for most models. The bad news for users: the price is the same no matter how well or badly the provider routes and evicts.

Asked whether providers use tiered caches (GPU, CPU memory, disk), Neubig said he didn't know for sure, but GPU memory is precious and offloading to CPU is common; commercial providers' in-house systems are probably more sophisticated than open source, and that's their competitive edge.

## Don't break your own cache

The cache works only when **the entire prefix is identical**. The slide's four rules:

- **Stabilize the prefix**: instructions, tool definitions, and examples go first and stay put.
- **Append changing state**: new user turns and observations go at the end.
- **Avoid needless churn**: timestamps, reordered schemas.
- **Measure reuse**: cached tokens, TTFT, evictions.

Neubig's landmines:

- **Changing the system message every step**: means no caching at all.
- **Putting the current time in the system prompt**: a reasonable impulse so the agent knows what time it is, but the time changes every step. If you need it, put it in the last user message or a tool result.
- **Routing each step to a different model**: this step looks hard, use the strong model; the next three look easy, use a cheap one. But when you switch back, the strong model has no cache for you and you pay ten times again. If you want to save money, switch sparingly.

## Compaction: what to do when context fills up

Neubig asked how many people are happy to see "compacting context" in their daily coding agent. Nobody raised a hand. The reason is obvious: done badly, the agent starts forgetting, doing something else, or deleting your files.

The slide example: CI times out → inspect the log → a 24K-line log repeating "address already in use" → set `--workers=1` and rerun → suite passes, log saved to `/tmp/ci.log`. After compaction, only this remains:

```
Goal: fix CI timeout
Cause: port collision
Verified: --workers=1 passes
Evidence: /tmp/ci.log
Next action: open the PR with the tested worker setting
```

**Compaction as state estimation**: compress the full history H into a working state ŝ within a token budget B, so the agent's future behavior matches (or beats) what it would do with the full history, while keeping a path back to the original evidence.

<details>
<summary>Formalization: three requirements</summary>

```
ŝ_t = C(H_t; B),   |ŝ_t| ≤ B                   bounded representation
p(A_future | H_t) ≈ p(A_future | ŝ_t)         behavioral fidelity
copy exact anchors; keep pointers to source   recoverability
```

H is the full history, ŝ the compacted working state, B its token budget, A_future the future actions.

</details>

**What survives**:

| Treatment | Content |
|---|---|
| Keep exact: anchors | goal, constraints (e.g. what the user said at the very start) |
| Encode: checkpoint | decisions, progress, IDs |
| Keep exact: recent tail | the active attempt, the fresh result |
| Externalize: evidence store | 24K-line log → 3 failures + command + artifact path ([MemGPT](https://arxiv.org/abs/2310.08560)'s externalize-and-retrieve idea) |
| Discard | duplicates, superseded attempts |

Neubig added that when students complain the agent forgot the start of the session, that may be a design flaw in the tool they use; good tools deliberately avoid dropping the beginning. Also, terminal coding agents usually store the full history on disk somewhere; if you know where, you can tell the agent to go read it even after compaction lost something.

**Four policy decisions** (the slides cite [Codex](https://github.com/openai/codex), [OpenCode](https://github.com/anomalyco/opencode), [Pi](https://github.com/earendil-works/pi), [Hermes Agent](https://github.com/NousResearch/hermes-agent), and [OpenHands](https://github.com/OpenHands/OpenHands) as reference implementations):

1. **Trigger**: token threshold (e.g. compact past 200K), provider hard-limit overflow, or manual request (many tools have `/compact`); reserve room for the next output.
2. **Select**: protect the beginning, keep the recent tail, compact the older middle; cut at a valid turn or tool boundary.
3. **Replace**: a readable summary, a structured checkpoint (sometimes a required tool call that specifies which fields the summary must contain), or an opaque provider item. Neubig said that as far as he knows only OpenAI compacts into encrypted content you can't read, because they don't want their compaction algorithm stolen. [OpenAI's docs](https://developers.openai.com/api/docs/guides/compaction) do confirm that its compaction (the `/responses/compact` endpoint or server-side automatic compaction) returns an encrypted, opaque item "not intended to be human-interpretable"; "only OpenAI" and the algorithm-theft motive are the lecturer's view.
4. **Recover**: leave original history unchanged, retain searchable history, and define behavior when compaction fails (retry or reset).

What do the five reference implementations actually do? This is from opening each repo's source and docs at its 2026-09-29 commit (all defaults are configurable):

| Project | Trigger | Kept verbatim | Replaced with | Recovery and failure |
|---|---|---|---|---|
| [OpenHands](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/README.md) (the logic lives in the `software-agent-sdk` condenser) | event count above `max_size` (default 240), tokens above `max_tokens`, or an explicit user/agent request | the first `keep_first` events (default 2) and the back half of the events | the front half of the events becomes one LLM summary | the event log is append-only and a marker event records each condensation; when a request can't be served by the normal split, a hard context reset summarizes the whole view |
| [Codex](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/compact.rs) | `model_auto_compact_token_limit`, a turn-end window-percentage threshold, `/compact` | recent user messages (newest first, up to about 20K tokens) | if the provider supports remote compaction, a remote endpoint returns a `Compaction` item carrying `encrypted_content`; otherwise a handoff summary written from the ["CONTEXT CHECKPOINT COMPACTION" prompt](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/prompt.md) | on the local path the rebuilt history is just the kept user messages plus the summary, prefixed with a handoff note ("Another language model started to solve this problem") |
| [OpenCode](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/compaction.ts) | usage reaches "input limit minus a reserved buffer (default at most 20K)"; `compaction.auto` turns it off | a recent tail (2K–15K tokens depending on the model), cut at a turn boundary | a [fixed-section summary](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/core/src/session/compaction.ts): Objective, Important Details, Work State, Next Move, Relevant Files; an optional prune step clears older tool outputs | on the next compaction the previous summary is fed back to the summarizer |
| [Pi](https://github.com/earendil-works/pi/blob/1b347794e2a630e4359f2584f4eea388145d0ddf/packages/coding-agent/docs/compaction.md) | `contextTokens > contextWindow − reserveTokens` (default 16,384), a provider overflow error, `/compact [instructions]` | the latest `keepRecentTokens` (default 20K); never cut at a tool result | Goal, Constraints & Preferences, Progress, Key Decisions, Next Steps, Critical Context, plus lists of files read and modified | omitted raw entries stay in the session file; if post-overflow recovery compaction fails, no automatic retry is scheduled |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/website/docs/developer-guide/context-compression-and-caching.md) | 50% of the window by default ([raised to 75% for windows under 512K](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/agent/context_compressor.py)) | the first `protect_first_n` messages (default 3) and a token-budgeted tail, without splitting tool calls from their results | old tool outputs are first replaced with a placeholder, then an auxiliary model writes a structured summary | later compactions ask the model to *update* the previous summary; the repo also ships a recall-based [compaction eval](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/evals/compaction/README.md) |

Against the lecturer's claim: "good tools deliberately avoid dropping the beginning" is a literal setting in OpenHands and Hermes (`keep_first`, `protect_first_n`); Codex keeps recent user messages instead, and Pi and OpenCode carry the beginning forward through fixed goal and constraint fields in the summary.

**Repeated compaction drifts**: each summary inherits the previous checkpoint. "Use CUDA 12.4" → "Use CUDA 12.x" → "Use recent CUDA" → constraint missing. The remedies are the same three: copy anchors exactly, keep the recent tail, retrieve source evidence when needed. The slides cite [ReSum](https://arxiv.org/abs/2509.13313) as an example of summary-conditioned agent continuation. OpenCode, Pi, and Hermes Agent in the table above all feed the previous summary back for an incremental update, which is exactly the path along which drift accumulates, so anchors and retrievable raw history matter even more.

**Evaluate by continuation**: plant state (constraints, decisions, artifacts) → apply the production compaction policy → let the agent continue and measure later decisions. Four things to check: state recall (constraints and identifiers), task success, efficiency (tokens, latency, cost), and stability (after many compactions).

Neubig told an early OpenHands story. They believed they had built one of the first industrial-grade compaction algorithms and spent about a month tuning it on [SWE-bench](https://www.swebench.com/): no score drop, lots of tokens saved. In production it started doing silly things: opening a new pull request after every compaction because it forgot it had already opened one, so the same feature got five PRs; and forgetting instructions the user added mid-conversation, because the benchmark only had single-message tasks. The lesson: unless your benchmark truly covers every use case, test under real conditions too.

**In [A1](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en)**: Part 2 has you implement model-generated working memory in the shared `Agent` (no provider compaction endpoint): summarize only an old prefix, keep the system and task messages verbatim, retain at least the latest complete assistant action with its linked tool observations, then compare token usage with and without compaction and write up the tradeoffs.

## Q&A after class

- **Do subagents count as context management?** Yes, but that comes in a later lecture.
- **Do alternative architectures cause context-overflow problems?** Neubig said intuition suggests they might, but it isn't proven, and some work shows alternative architectures doing better.

## Readings and references

The schedule lists no required reading for this lecture, only a long reference list. The most worthwhile:

- Architecture: [Gated Delta Networks](https://arxiv.org/abs/2412.06464), [Kimi Linear](https://arxiv.org/abs/2510.26692), [DeepSeek Sparse Attention](https://arxiv.org/abs/2512.02556)
- Position: [RoFormer](https://arxiv.org/abs/2104.09864), [NoPE Length Generalization](https://arxiv.org/abs/2305.19466), [YaRN](https://arxiv.org/abs/2309.00071)
- Serving: [DistServe](https://arxiv.org/abs/2401.09670), [PagedAttention](https://arxiv.org/abs/2309.06180), [SGLang](https://arxiv.org/abs/2312.07104), [Prompt Cache](https://arxiv.org/abs/2311.04934)
- Compaction: [MemGPT](https://arxiv.org/abs/2310.08560), [LongLLMLingua](https://aclanthology.org/2024.acl-long.91/), [ReSum](https://arxiv.org/abs/2509.13313)

## Something to do tonight

**Measure your agent's cache hit rate.** Take a recent session longer than 20 steps, sum the cached-token field (cached tokens or cache read) and total input tokens across API responses, and compute the ratio. Below 90%? Open your system prompt and look for three things: timestamps, per-step state, and tool lists that get reordered. Move them to the last message.

**Write a continuation test for your compaction.** Insert a constraint at turn 3 (e.g. "don't touch the `config/` folder"), lower the threshold so compaction fires twice, then give it a task that tempts it to edit `config/`, and see whether it remembers.

## Where it sits in the course

[L2](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en) taught the agent to use tools; L3 deals with the context blowing up once it does. Next, [L4](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en) covers Skills and Memory, which Neubig describes as "an even longer context, across your entire working time."

## Further reading

- [Reading CMU 11-768: series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en): a map of the whole course and index of posts
- [CS336 Lecture 4: attention variants and MoE](/en/posts/ai/2026-08-22-cs336-attention-moe-en): prerequisite for this post's model layer
- [CS336 Lecture 10: inference is about reading less weight and KV cache](/en/posts/ai/2026-08-22-cs336-inference-en): prefill/decode and the KV cache from a systems view
- [Context Engineering: Why Your AI Agent's Problem Is Information, Not the Model](/en/posts/ai/2026-03-24-context-engineering-guide-en): practical notes for the harness layer
- [Reading Stanford CS329Z Week 4: ReAct and MemGPT](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en): another take on MemGPT's external memory

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

All sources below were opened and checked in full, or on the official page (2026-09-29):

- [CMU 11-768 AI Agents course website](https://www.cmu-agents.com/)
- [Lecture 3 slides: Context Management for Long-Context Agents](https://www.cmu-agents.com/slides/lecture-03-long-context.pdf)
- [Lecture 3 recording](https://www.youtube.com/watch?v=AiwCCvFW1uE)
- [DistServe (arXiv 2401.09670)](https://arxiv.org/abs/2401.09670)
- [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack)
- [Attention Is All You Need (arXiv 1706.03762)](https://arxiv.org/abs/1706.03762)
- [Longformer (arXiv 2004.05150)](https://arxiv.org/abs/2004.05150)
- [Generating Long Sequences with Sparse Transformers (arXiv 1904.10509)](https://arxiv.org/abs/1904.10509)
- [Transformers are RNNs (arXiv 2006.16236)](https://arxiv.org/abs/2006.16236)
- [Linear Transformers Are Secretly Fast Weight Programmers (arXiv 2102.11174)](https://arxiv.org/abs/2102.11174)
- [Gated Delta Networks (arXiv 2412.06464)](https://arxiv.org/abs/2412.06464)
- [Kimi Linear (arXiv 2510.26692)](https://arxiv.org/abs/2510.26692)
- [DeepSeek-V3.2 / DeepSeek Sparse Attention (arXiv 2512.02556)](https://arxiv.org/abs/2512.02556)
- [Grouped-Query Attention (arXiv 2305.13245)](https://arxiv.org/abs/2305.13245)
- [DeepSeek-V2 / MLA (arXiv 2405.04434)](https://arxiv.org/abs/2405.04434)
- [RoFormer (arXiv 2104.09864)](https://arxiv.org/abs/2104.09864)
- [NoPE Length Generalization (arXiv 2305.19466)](https://arxiv.org/abs/2305.19466)
- [Position Interpolation (arXiv 2306.15595)](https://arxiv.org/abs/2306.15595)
- [YaRN (arXiv 2309.00071)](https://arxiv.org/abs/2309.00071)
- [Qwen3.8-Flash-Next announcement](https://qwen.ai/blog?id=qwen3.8-flash-next)
- [GLM-5.3-Flash (Hugging Face model page and config)](https://huggingface.co/zai-org/GLM-5.3-Flash)
- [GLM-5 technical report (arXiv 2602.15763)](https://arxiv.org/abs/2602.15763)
- [Kimi K3 technical report (arXiv 2607.24653)](https://arxiv.org/abs/2607.24653)
- [NVIDIA Nemotron 3 Ultra Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf)
- [Introducing Inkling (Thinking Machines)](https://thinkingmachines.ai/news/introducing-inkling/)
- [DeepSeek V4 technical report (arXiv 2606.19348)](https://arxiv.org/abs/2606.19348)
- [Ring Attention (arXiv 2310.01889)](https://arxiv.org/abs/2310.01889)
- [Prompt Cache (arXiv 2311.04934)](https://arxiv.org/abs/2311.04934)
- [DeepSeek API pricing](https://api-docs.deepseek.com/quick_start/pricing/)
- [Z.AI API pricing](https://docs.z.ai/guides/overview/pricing)
- [Kimi platform pricing](https://platform.kimi.ai/docs/pricing/chat)
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing)
- [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI Compaction guide](https://developers.openai.com/api/docs/guides/compaction)
- [PagedAttention / vLLM (arXiv 2309.06180)](https://arxiv.org/abs/2309.06180)
- [SGLang / RadixAttention (arXiv 2312.07104)](https://arxiv.org/abs/2312.07104)
- [SGLang v0.4 cache-aware load balancing](https://lmsys.org/blog/2024-12-04-sglang-v0-4/)
- [MemGPT (arXiv 2310.08560)](https://arxiv.org/abs/2310.08560)
- [LongLLMLingua (ACL 2024)](https://aclanthology.org/2024.acl-long.91/)
- [ReSum (arXiv 2509.13313)](https://arxiv.org/abs/2509.13313)
- Compaction reference implementations (all at their 2026-09-29 commits): [OpenHands](https://github.com/OpenHands/OpenHands) with the [software-agent-sdk condenser README](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/README.md) and [`llm_summarizing_condenser.py`](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/llm_summarizing_condenser.py); [Codex `compact.rs`](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/compact.rs), [`tasks/compact.rs`](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/tasks/compact.rs), the [compact prompt](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/prompt.md), and the [summary handoff prefix](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/summary_prefix.md); [OpenCode `session/compaction.ts`](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/compaction.ts), [`overflow.ts`](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/overflow.ts), and the [summary template](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/core/src/session/compaction.ts); the [Pi compaction docs](https://github.com/earendil-works/pi/blob/1b347794e2a630e4359f2584f4eea388145d0ddf/packages/coding-agent/docs/compaction.md); the [Hermes Agent context compression docs](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/website/docs/developer-guide/context-compression-and-caching.md), [`context_compressor.py`](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/agent/context_compressor.py), and the [compaction eval](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/evals/compaction/README.md)
