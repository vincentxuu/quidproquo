---
title: "CMU 10-423 L2–L3: Transformer Language Models, LLM Training and Decoding — From Forgetful RNNs to the KV Cache"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, transformer, self-attention, language-model, tokenization, decoding]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 2
tldr: "Lectures 2 and 3 of CMU 10-423 swap the RNN for attention. Lecture 2 first explains why RNNs fall short: they forget, they compute one step at a time, and their gradients can still explode. It then assembles a Transformer language model piece by piece: scaled dot-product attention, multi-head attention, layer norm, residual connections, position embeddings, and the causal mask. Lecture 3 covers training. There is no closed-form answer like n-gram counting, so you do maximum likelihood with autodiff and mini-batch SGD. It then covers padding, the KV cache and three kinds of tokenizer, and ends with greedy decoding and ancestral sampling to show how text is generated one token at a time."
description: "Guide to Lectures 2–3 of CMU 10-423/623/723 Generative AI (Spring 2026), based on the lecture2-transformer and lecture3-llms slides (including the inked version): large language models in the noisy-channel and n-gram era, why RNNs forget and what LSTMs fix, every component of a Transformer LM and its matrix implementation, maximum likelihood training for deep language models, batching and the KV cache, word/character/subword tokenizers, and greedy decoding versus ancestral sampling."
draft: false
glossary:
  - term: "causal mask"
    aliases: ["causal attention"]
    definition: "Before the softmax in attention, set the scores for every position to the right of the query (future time steps) to negative infinity, so the model cannot see the answer while predicting the next token."
    context: "Lecture 2 of CMU 10-423 writes it as a matrix M: zeros on and below the diagonal, −∞ above it."
  - term: "ancestral sampling"
    definition: "When generating from a language model, pick each next token at random according to the model's probabilities. As long as the distribution is locally normalized, the probability of drawing a whole sequence equals its total probability, so this is an exact sampling method."
    context: "Lecture 3 of CMU 10-423 contrasts it with greedy decoding, which always takes the most likely token."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

> **Edition note**: This post follows [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/), Spring 2026: Lecture 2 (2026-01-14, [lecture2-transformer](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf), 74 pages) and Lecture 3 (2026-01-21, [lecture3-llms](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf), 57 pages, plus the [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf), 59 pages). The lecturers are Aran Nayebi and Matt Gormley. Facts were checked on 2026-09-30. Lecture 2 has no inked version. The recordings are on Panopto and need a CMU account, so this post is based on the slides only.

**Series position**: Previous: [L1: RNN language models and autodiff](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) | Next: [L4: Pre-training, fine-tuning and modern Transformers](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

The [previous post](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) ended with the RNN language model: compress every previous word into one fixed-length vector, then predict the next word. These two lectures answer three questions. Why is that vector not enough? What does the model look like once attention replaces it? How do you train such a model and generate from it?

The two lectures split the work. Lecture 2 covers only the **architecture**. Lecture 3 covers **training, efficiency and decoding**. HW1 asks you to add RoPE and GQA to minGPT, and these two lectures are its foundation.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. On 2026-10-10 the anonymous Panopto folder listed no videos and prompted sign-in. The course homepage and schedule link no public (YouTube) recordings; an instructor post dated 2026-04-08 said YouTube recordings were “coming very soon”, but no such link had appeared on the official pages when checked. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

Checked: 2026-10-10.

## "Large language models" predate the Transformer

Lecture 2 opens with some history. Before 2017, the two tasks that leaned hardest on language models were speech recognition and machine translation, and both used a **noisy channel model**:

$$
\hat{y} = \arg\max_y p(y \mid x) = \arg\max_y p(x \mid y)\, p(y)
$$

$x$ is the audio signal or source sentence, $y$ the transcript or translation. $p(x \mid y)$ is the transduction model, and $p(y)$ is the language model.

According to the slides, the first truly large language models were n-gram models. Google's 2006 English n-gram release was trained on 1 trillion tokens of web text (95 billion sentences) and covered 1-grams through 5-grams; the 5-grams alone number about 1.18 billion. The slides put the model at roughly 3 billion parameters. Is that a large training set? A large model? The slides answer yes to both.

A table then compares modern LLMs. GPT-2 (2019): about 10 billion tokens, 1.5 billion parameters. GPT-3 (2020): 300 billion tokens, 175 billion parameters. LLaMA-3 (2024): 15 trillion tokens, 405 billion parameters. The GPT-4, GPT-5 and Gemini Ultra rows show question marks, with unconfirmed estimates in parentheses.

## Why RNNs fall short

Lecture 2 shows RNN forgetting with a small example: an RNN with hand-set weights that has to remember whether it has seen a 1 in both input positions. The slides trace the hidden state as it drops to 1/2, then 1/4, and by step 100 the memory is gone.

The **LSTM** was the fix of its day. Standard RNNs struggle with long-distance dependencies because of vanishing gradients. LSTMs control information flow with gates:

- **input gate**: masks out part of the standard RNN input
- **forget gate**: masks out part of the previous cell
- **cell**: stores the input/forget mixture; it is the LSTM's long-term memory
- **output gate**: masks out part of what goes into the next hidden state

The slides also cite Jozefowicz et al. 2015, who evaluated 10,000 LSTM-like architectures and found several variants that worked just as well across tasks.

So why not use LSTMs for everything? The slides say "Everyone did, for a time," and give three reasons:

1. Long-range dependencies are still hard.
2. The computation is inherently serial, so it does not parallelize well on a GPU.
3. They mostly solve vanishing gradients but can still suffer from exploding gradients.

## Building a Transformer language model, piece by piece

### Attention

Each position's new representation $x'_t$ is a weighted sum of every position's value vector, with weights from a softmax:

$$
x'_t = \sum_j a_{t,j} v_j, \quad a_t = \operatorname{softmax}(s_t)
$$

**Scaled dot-product attention** defines where those come from: each input $x_j$ is multiplied by three matrices to get a query, a key and a value.

$$
q_j = W_q^T x_j, \quad k_j = W_k^T x_j, \quad v_j = W_v^T x_j, \quad s_{t,j} = \frac{k_j^T q_t}{\sqrt{d_k}}
$$

### Multi-head attention

The slides draw an analogy to convolution: a convolution layer can have multiple channels, and an attention layer can have multiple heads. Each head gets its own parameters, and the outputs are concatenated. To keep the output the same size as the input, you usually set $d_k = d_{model} / h$.

### One Transformer layer

Each layer of a Transformer LM has four sublayers: attention, a feed-forward network, layer normalization and residual connections. The slides explain what problem each of the last two solves:

- **Layer normalization**: in a deep network, a small change in low layers can amplify into a large change in high layers (internal covariate shift). Normalizing each layer and learning an elementwise gain and bias allows higher learning rates without diverging.
- **Residual connections**: very deep networks degrade in a way overfitting does not explain (training and test error both get worse). With $b = f(a) + a$, $f$ only has to learn an **additive modification** of $a$, not a full transformation.

The slides stress one contrast: an RNN's computation graph grows **linearly** with the number of tokens, while a Transformer LM's grows **quadratically**. The language-model part is the same as an RNN-LM: each position outputs a distribution over the next word.

### Position embeddings

A classroom exercise: given some input embeddings and attention weights, compute $x'_4$. Now swap $x_2$ and $x_3$. What is the new $x'_4$? Exactly the same.

Attention is position invariant, so position information has to be added separately. Each position $t$ gets a position embedding $p_t$, which is added to the word embedding $w_t$. Position embeddings can be fixed (sines and cosines) or learned, and absolute or relative to the query's position.

### GPT is a large Transformer LM

From the slides' table: GPT (2018) has 12 layers, hidden size 768, and 117 million parameters. GPT-2 (2019) has 48 layers, size 1600, and 1,542 million parameters. GPT-3 (2020) has 96 layers, size 12288, 96 heads, and 175 billion parameters. The GPT-4o and GPT-5 rows are all question marks.

### The matrix version and the causal mask

In practice you do not compute one query at a time. You stack queries, keys and values into matrices $Q = XW_q$, $K = XW_k$, $V = XW_v$ and compute everything at once. The slides ask whether the softmax is applied column-wise or row-wise. The answer is row-wise, one row per query.

Then the slides point out a problem. If you train the model to predict the next token and attention can see tokens after the current one, that is cheating. The fix is a mask $M$ added before the softmax:

<details>
<summary>Causal attention in matrix form</summary>

$$
X' = \operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}} + M\right) V, \quad
M = \begin{bmatrix} 0 & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0 \end{bmatrix}
$$

If an input to the softmax is $-\infty$, its weight becomes 0. In practice you compute attention scores for all time steps, then mask out every position to the right of the query. The multi-head version runs this per head and concatenates: $X' = \operatorname{concat}(X'^{(1)}, \ldots, X'^{(h)})$.

</details>

## Training: from counting to autodiff

Lecture 3 opens with a recap. On the deep learning side we have autodiff and computation graphs (RNN-LM, Transformer-LM). On the language modeling side we have "condition on previous words, sample the next one." n-grams are easy to learn by counting, but nothing so far says how to learn an RNN-LM or a Transformer-LM.

The slides review the machine learning recipe: given training data, choose a decision function and a loss function, define the goal, and train with SGD by taking small steps opposite the gradient. They write out SGD and mini-batch SGD, then show how to train an Elman RNN for sequence tagging (part-of-speech tagging, handwriting recognition, phoneme recognition): compute a cross-entropy loss at each time step and sum them.

The key slide compares **maximum likelihood for n-grams and for deep language models**:

- For n-grams, counting *is* the maximum likelihood estimate. Write down the likelihood of the sentences, set the gradient to zero under the sum-to-one constraint, and the solution is the count ratios.
- Deep language models also use maximum likelihood, but there is **no closed form**. You write down the likelihood of a batch of sentences, compute its gradient with respect to the parameters by autodiff, and follow the negative gradient with mini-batch SGD (or your favorite optimizer).

The objective for a deep language model is the log-likelihood of the training data, and each sentence's log probability splits into a sum over positions:

$$
J(\theta) = \sum_i \log p_\theta(w^{(i)}), \quad \log p(w) = \sum_{t=1}^{T} \log p(w_t \mid h_t)
$$

The inked version adds a question: how do you train the model so it eventually stops generating new words? The slides' figure gives the hint with the END token at the end of each sequence, which is also a word to predict. Training a Transformer-LM is exactly the same; you just swap in a different deep language model.

## Efficiency: batching, padding and the KV cache

Why does efficiency matter? The slides use GPT-3 as a case study, citing the training compute from the paper in petaflop/s-days. Transformers can be trained very efficiently, and the slides call this arguably one of the key reasons for their success:

- **Batching**: process B sentences at once; the computation is identical for each and trivially parallel.
- **Scaled dot-product attention**: the attention scores for one time step do not depend on other time steps, so they parallelize easily.
- **Multi-head attention**: each head is computed independently, adding more parallelism.
- **Matrix multiplication**: the core of attention is matrix multiplication, which GPUs and TPUs accelerate.
- **Model parallelism**: split huge models across GPUs or machines.
- **Key-value caching**: keys and values are reused across many time steps; queries, similarity scores and attention weights do not need caching.

**Padding and truncation** are shown with 8 sentences. Set the block size (maximum sequence length) to 10, truncate sentences that are too long, pad short ones with `<PAD>`, map each token to an integer through the vocabulary, and finally turn each into a fixed-length embedding.

The **KV cache** at generation time: at each step, compute the new $k_j$ and $v_j$ for the new token and store them, and reuse all earlier keys and values. The query, scores and weights for the step are thrown away once used.

## Three kinds of tokenizer

The slides compare three ways to split "Matt is giving a lecture on transformers":

| Type | Strengths | Problems |
|---|---|---|
| Word-based | Intuitive | Hard to balance vocabulary size against compute; "transformers" and "transformer" get unrelated representations; typos become OOV (out-of-vocabulary) |
| Character-based | Much smaller vocabulary; can do well on logographic scripts such as kanji | Loses a lot of meaning; much longer sequences and heavier compute |
| Subword-based | Splits long or rare words into meaningful pieces; no OOV as long as every character is in the vocabulary | The split has to be learned first, e.g. BPE, WordPiece, SentencePiece |

## Decoding: greedy versus ancestral sampling

The last section treats generation as search. With a character-based tokenizer, each node is a partial sentence and each edge is weighted by negative log probability. The goal is the root-to-leaf path with the lowest total weight, which is the highest probability.

- **Greedy decoding**: at each node, take the edge with the lowest weight. It is a heuristic that does not guarantee the best path, and it runs in time linear in the maximum path length.
- **Ancestral sampling**: at each node, pick an edge at random according to its probability. If the distribution is locally normalized, this is exact sampling: each path is drawn with its total probability. It also runs in time linear in path length.

The L3 slides stop there. The efficiency side of decoding is scheduled for L18, "Flash Attention / Efficient decoding strategies."

## Self-check

Two questions on the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) map to these lectures:

- Question 2, "Transformers and LLMs" (30 points): true/false statements about Transformer LMs, the main reason for multi-head attention, what residual connections do, the computational cost of self-attention, and more. The last part (5 points) is about RoPE, which belongs to [L4](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en).
- Question 3, "Learning neural language models / Decoding" (8 points): four multiple-choice parts.

One thing to do tonight: redo Lecture 2's classroom exercise on paper. Write down any four 2-D embeddings, set $W_v = I$, compute $x'_4$, then swap $x_2$ and $x_3$ and compute it again. Once you have done it by hand, you will not forget why position embeddings exist.

## Further reading

- How other courses teach the Transformer: [CS224N: Transformers](/posts/ai/2026-08-22-cs224n-transformers-en), [CMU 11-785 Lecture 18: Attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en), [CME295: Transformer](/posts/ai/2026-09-29-cme295-transformer-en)
- Building a tokenizer from scratch: [CS336 Lecture 1: Overview and tokenization](/posts/ai/2026-08-22-cs336-overview-tokenization-en)
- The systems side of the KV cache and inference: [CS336: Inference](/posts/ai/2026-08-22-cs336-inference-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L2 and L3 dates and readings
- [Lecture 2 slides: Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Lecture 3 slides: Learning Large Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [Lecture 3 slides (inked)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10](http://www.deeplearningbook.org/contents/rnn.html): L2 assigns 10.10–10.12 (LSTMs and other gated RNNs)
- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Alammar (2018), The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Graves (2014), Generating Sequences With Recurrent Neural Networks](https://arxiv.org/pdf/1308.0850.pdf)
- [Mikolov et al. (2010), Recurrent neural network based language model](https://pdfs.semanticscholar.org/bba8/a2c9b9121e7c78e91ea2a68630e77c0ad20f.pdf)
- [Radford et al. (2018), Improving Language Understanding by Generative Pre-Training (GPT-1)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Radford et al. (2019), Language Models are Unsupervised Multitask Learners (GPT-2)](https://d4mucfpksywv.cloudfront.net/better-language-models/language-models.pdf)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
