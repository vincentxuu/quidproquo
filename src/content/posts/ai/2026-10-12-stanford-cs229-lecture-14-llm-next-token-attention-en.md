---
title: "Large Language Models: Next-Token Loss and How Attention Is Computed | Stanford CS229 Lecture 14"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, llm, transformer, attention]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 14
tldr: "This lecture takes a large language model apart in three layers: tokenization turns text into token IDs, the chain rule splits the probability of a whole text into a sequence of next-token conditionals, and training sums the cross-entropy at every position. The second half opens up the Transformer: inner products of queries and keys go through a softmax to give weights, the weights average the values, and a causal mask blocks future positions. The cost of a single attention layer grows with the square of the sequence length T."
description: "A guide to Lecture 14 of Stanford CS229 (Spring 2026): tokenization, the autoregressive factorization, next-token cross-entropy, temperature and top-k sampling, single-head and multi-head attention, the causal mask, and the T² cost of attention, with numerical examples you can work by hand."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 14 recording published by Stanford Online, with notation checked against the first half of Chapter 17 (Large language models) of the 2026 main notes. I did not see the board, so the formulas on it are reconstructed from what the transcript says aloud and from the notes.

This is the first lecture of the large language model unit in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), and it follows [Lecture 13](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en). The lecturer, Tengyu Ma, opens by saying the next three or four lectures are all about large language models, with a bit of reinforcement learning mixed in, because you can't talk about today's reasoning models without it.

You need three prerequisites: softmax and cross-entropy (from the multiclass classification lectures), maximum likelihood estimation, and matrix multiplication. After reading, you should be able to write down the loss function of a language model yourself, compute one row of attention output by hand, and explain why doubling the sequence length quadruples the cost of attention.

One thing up front: the YouTube title says "Transformers, In-Context Learning", but this recording never gets to in-context learning. Its 78 minutes go to tokenization, autoregressive modeling, the training loss, and the definition of attention, with the last few minutes touching on residual connections, normalization, and compute cost.

```youtube
url: https://www.youtube.com/watch?v=pwQ0l4hFCVI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning
captions: en
```

## Tokenization: what is the smallest unit the model reads

(Recording 01:30–10:20)

A Transformer consumes numbers, so text first has to be cut into small units and numbered. The first decision is how big the smallest unit should be. The lecture compares three choices:

- **Characters**: the vocabulary is tiny, but a sentence takes many steps, so sequences get too long.
- **Whole words**: sequences are short, but every rare long word stands alone. The lecturer's example is internationalization: as a single unit it has nothing to do with internationalized or nation, and what the model learns about one of them does not help with the others.
- **Subwords**: in between the two, and what people use today.

The lecturer uses a word from the notes that probably nobody used before 2020, LLMification, to show why subwords help. As a single unit, the model would have to see the word many times before understanding it. Split into LLM and ification, both pieces are ones the model has seen many times, and it can understand the combination. Biomedical terms and long German words work the same way.

So tokenization is this: there is a vocabulary fixed in advance, made of subwords, each with an ID. Once a text is cut up, it becomes a sequence of IDs. The notes' example is `A dog runs.`, cut roughly into the four tokens `A`, `dog`, `runs`, `.`; in class the lecturer tossed out IDs like 1, 356, 250 and said the numbers were made up. A less common word such as unhappiness might be cut into `un`, `h`, `appiness`, and glioblastoma into `glio`, `blast`, `oma`. For these two splits, both the lecturer and the notes only say "roughly like this"; the actual result depends on the tokenizer.

A few facts mentioned in class:

- The vocabulary size is usually on the order of $10^5$. The notes' example is Qwen3.5, whose vocabulary has 248,320 tokens. Around 05:50 the lecturer says "250 tokens", dropping a "thousand"; a little later (10:22) he says 250,000.
- The algorithm that does this is called a tokenizer. Each model usually has its own, and companies do it differently. How many tokens a given text turns into directly affects cost: the finer the cut, the more tokens you pay for on the same text.
- For where the vocabulary comes from, the keyword is **BPE (Byte-Pair Encoding)**. The lecturer only says it is a greedy algorithm that picks out common pieces and puts them in the vocabulary, without details. The notes are more precise: start from very small pieces such as bytes or characters, and repeatedly merge the pair of adjacent pieces that occurs most often in the corpus into a new token. After enough merges, common suffixes and even whole common words become single tokens, while rare words can still be spelled out of small pieces.

From here on, "a text" is a sequence of tokens:

$$
x = (x_1, x_2, \ldots, x_T), \qquad x_t \in V
$$

$V$ is the vocabulary, and each $x_t$ is an ID in it.

## Splitting the probability of a whole text into "the next token"

(Recording 10:20–13:30)

A language model describes the probability distribution $p(x_1, \ldots, x_T)$ over these token sequences. First count how many outcomes that distribution has: each position has $\lvert V\rvert$ choices and the length is $T$, so there are $\lvert V\rvert^T$ in total.

To see how large that is, work one out (the numbers below are made up for this article, not from the lecture): with $\lvert V\rvert = 250{,}000$ and $T = 10$,

$$
250{,}000^{10} = (2.5\times 10^5)^{10} = 2.5^{10}\times 10^{50} \approx 9.5\times 10^{53}
$$

Ten tokens already give $10^{53}$ possible sentences. Treating this as an ordinary categorical distribution, with one probability parameter per sentence, is impossible to store.

The fix is the chain rule of conditional probability. It holds for any joint distribution and makes no assumptions:

$$
p(x_1,\ldots,x_T) = p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)\cdots p(x_T\mid x_1,\ldots,x_{T-1})
$$

The benefit is in each factor on the right. $p(x_t\mid x_1,\ldots,x_{t-1})$ is the distribution of "which token comes next, given the text so far", and it has only $\lvert V\rvert$ possible outcomes. The problem changes from "describe $\lvert V\rvert^T$ numbers" to "given the preceding text, output a probability vector of dimension $\lvert V\rvert$". The latter has exactly the shape of multiclass classification: output $\lvert V\rvert$ logits and apply one softmax.

The difficulty has not gone away; it has moved. The preceding text in the condition varies in length and can be very long. That is what the Transformer in the second half of the lecture handles.

Autoregressive refers to exactly this structure: tokens are produced one at a time, and each new token depends on all the tokens before it. In the opening, the lecturer says this wave of large language models roughly began when OpenAI released GPT-3 and adopted the autoregressive paradigm. The lecture covers only the autoregressive version and skips the earlier, non-autoregressive Transformers.

## The Transformer as a black box: embeddings in, logits out

(Recording 13:30–25:50)

Set the inside of the Transformer aside for now and look only at inputs and outputs.

**The input side.** Token IDs are discrete, so they first have to become vectors. Each token has an embedding of dimension $d$, and stacking all of them gives a matrix:

$$
E = \begin{pmatrix} e_1 \\ e_2 \\ \vdots \\ e_{\lvert V\rvert} \end{pmatrix} \in \mathbb{R}^{\lvert V\rvert \times d}
$$

The embedding of token 5 is row 5 of $E$, a table lookup. These numbers are unknown at the start and are trained along with all the other parameters. A student asks whether the embedding depends on later tokens. The lecturer says no: the embedding is determined by the token alone. For token 10 you read row 10, and there is no other dependence.

One notational convention runs through the whole chapter: **all vectors are row vectors**, written horizontally, and matrices always multiply on the right. The reason is that this is how vectors are stored in code. The lecturer finds it awkward himself:

> "It looks a bit weird to me actually from a mathematical perspective." (15:30)

The lecturer also warns that many papers use column vectors, written vertically. One sentence added in this article: in that convention the matrix multiplies on the left, and the same formula looks like the transpose of the one here. For example, $hW$ here would appear in a paper as something like $W^\top h^\top$. When comparing, swap rows and columns.

**The special token at the start.** A common practice is to put a fixed beginning-of-sentence token at the very front of the sequence, written $x_0$. The lecturer says this is not required and some models leave it out. He says the vocabulary usually reserves one thousand to a few thousand slots for special-purpose tokens of this kind.

**The output side.** Feed $(e_{x_0}, e_{x_1}, \ldots)$ into the Transformer, and each position emits a vector of dimension $\lvert V\rvert$ called the logits. The $t$-th output is written

$$
u_t = f_\theta(x_0, x_1, \ldots, x_{t-1}) \in \mathbb{R}^{\lvert V\rvert}
$$

$u_t$ and $f_\theta(\cdots)$ are two ways of writing the same thing. A student asks about this in class, and the lecturer explains that the first gives the vector a name while the second spells out which inputs it is a function of. Spelling it out matters because $u_t$ may depend only on $x_0$ through $x_{t-1}$, never on later tokens. At the black-box stage, take this property as a requirement; how it is guaranteed becomes clear when the mask comes up later.

Applying softmax to the logits gives the conditional distribution of the next token:

$$
p_\theta(x_t = j \mid x_1,\ldots,x_{t-1}) = \mathrm{softmax}(u_t)_j = \frac{\exp(u_{t,j})}{\sum_{k=1}^{\lvert V\rvert}\exp(u_{t,k})}
$$

The $\lvert V\rvert$ numbers softmax outputs are all nonnegative and sum to 1. The $j$-th one is the probability, under this model, that token $j$ follows the preceding text. In particular, $p_\theta(x_1) = \mathrm{softmax}(f_\theta(x_0))$: the first token has no preceding text and sees only the fixed start token.

The probability model is now complete. For any token sequence, you can compute each conditional probability and multiply them to get the probability of the whole sequence.

## Generation: sample one at a time and feed it back in

(Recording 25:50–35:55)

Suppose the model is already trained. How do you produce text? Follow the order of the factorization:

1. Sample $x_1$ from $\mathrm{softmax}(f_\theta(x_0))$.
2. Append $x_1$ to the input and sample $x_2$ from $\mathrm{softmax}(f_\theta(x_0, x_1))$.
3. Keep repeating.

Each generated token becomes input to the next step, which is what "autoregressive" means at generation time. The lecturer contrasts two situations. When computing a likelihood, the whole text is already in hand, and you only ask the model "what is the probability of seeing this sequence". When generating, you have nothing in hand and must grow the text one step at a time.

Generation does not have to start from nothing. If $x_1,\ldots,x_k$ are given first (a question or an instruction, that is, a prompt), the model continues from $x_{k+1}$: sample from $\mathrm{softmax}(f_\theta(x_0,\ldots,x_k))$ first, then carry on.

### Temperature: the numerical example from class

At generation time you don't have to sample exactly from the model's distribution. The most common adjustment divides the logits by a temperature $\tau$ before the softmax:

$$
x_{t+1} \sim \mathrm{softmax}\big(f_\theta(x_0,\ldots,x_t)/\tau\big)
$$

Dividing by a positive number does not change the ordering; the large ones stay large. What changes is the gaps. The lecture uses the three-dimensional logits $(2, 1, -1)$ as an example, and below I finish the numbers the lecturer only sketched aloud.

**The original distribution ($\tau = 1$).**

$$
e^{2} \approx 7.389,\quad e^{1} \approx 2.718,\quad e^{-1} \approx 0.368,\quad \text{sum} \approx 10.475
$$

$$
\mathrm{softmax}(2,1,-1) \approx (0.705,\ 0.259,\ 0.035)
$$

The lecturer had no calculator in class and estimated the first as "about 0.7" and the second as "about 0.3"; the actual values are 0.705 and 0.259. The first token is the most likely, but the other two together still have close to a 30% chance of being drawn.

**A very small temperature.** The lecturer scales the logits up to $(200, 100, -100)$, which corresponds to $\tau = 0.01$. The probability of the second token is

$$
\frac{e^{100}}{e^{200}+e^{100}+e^{-100}} \approx \frac{e^{100}}{e^{200}} = e^{-100} \approx 3.7\times 10^{-44}
$$

In the denominator, $e^{100}$ and $e^{-100}$ are negligible next to $e^{200}$, so the distribution is almost exactly $(1, 0, 0)$.

**What this means.** The lower the temperature, the sharper the distribution, and the closer sampling gets to "always take the most probable one". The lecturer says you can choose the temperature in an API; setting it to 0 means taking the most likely token at every step, so the output is deterministic (the notes write this as the limit $\tau \to 0$ and call it greedy decoding). A temperature above 1 flattens the distribution, so tokens in the long tail are drawn more easily. That suits cases where you want diversity, and the lecturer mentions that reinforcement learning sometimes requires it.

### top-k

Another adjustment keeps only the $k$ most probable tokens, discards the rest, and renormalizes what remains to sum to 1 before sampling. The vocabulary has over two hundred thousand dimensions, and this keeps the extremely unlikely tokens in the tail from ever being drawn. The lecture covers only top-k. The notes also have top-p (nucleus sampling): sort tokens from most to least probable, keep the smallest set whose cumulative probability reaches at least $p$, and renormalize.

## Training: sum the cross-entropy at every position

(Recording 35:55–38:50)

Training uses maximum likelihood estimation: given a data sequence $(x_1,\ldots,x_T)$, make the probability the model assigns to it as large as possible, which is equivalent to making the negative log-likelihood as small as possible. The derivation takes three steps.

Step one, substitute the chain-rule factorization:

$$
-\log p_\theta(x_1,\ldots,x_T) = -\log \prod_{t=1}^{T} p_\theta(x_t\mid x_1,\ldots,x_{t-1})
$$

Step two, the log turns the product into a sum:

$$
= -\sum_{t=1}^{T} \log p_\theta(x_t\mid x_1,\ldots,x_{t-1})
$$

Step three, replace each conditional probability with one component of the softmax:

$$
= -\sum_{t=1}^{T} \log\, \mathrm{softmax}\big(f_\theta(x_0,\ldots,x_{t-1})\big)_{x_t}
$$

The subscript $x_t$ means: softmax gives a probability for every token, and we take only the probability of the token that actually appears in the data. Each term is a scalar, and it is exactly the cross-entropy between the logits $u_t$ and the correct answer $x_t$. So training a language model means doing one $\lvert V\rvert$-class classification at every position, where the answer is the next token.

A student in class assumes the loss is computed only at the last position, and the lecturer corrects this: the sum runs from $t=1$ to $T$, and every position counts. Seen another way (this sentence is an addition in this article): one forward pass over a text of length $T$ yields $T$ training signals at once, with no need to go step by step as in generation.

The notes divide by an extra $T$ to take the per-token average; the lecture does not. The two differ only by a constant, and the minimizer is the same. Optimization hands this loss straight to SGD or Adam. The lecturer says Adam is not taught in this course and can be used as a black box; the notes say AdamW.

### Numerical example: the loss for two tokens

The following example is made up for this article, not from the lecture. The vocabulary has only 3 tokens, and the data is $(x_1, x_2) = (1, 2)$. Suppose the logits the model outputs at the two positions are

$$
u_1 = (2, 1, -1), \qquad u_2 = (0, 1, 1)
$$

- Position 1: $\mathrm{softmax}(u_1) \approx (0.705, 0.259, 0.035)$. The correct answer is token 1, so the loss is $-\log 0.705 \approx 0.349$.
- Position 2: $e^0 = 1$ and $e^1 \approx 2.718$, with sum $\approx 6.437$, so $\mathrm{softmax}(u_2) \approx (0.155, 0.422, 0.422)$. The correct answer is token 2, so the loss is $-\log 0.422 \approx 0.862$.

The negative log-likelihood of the whole sequence is $0.349 + 0.862 = 1.211$, an average of $0.606$ per token. As a baseline: if the model had learned nothing and gave every token $1/3$, the loss at each position would be $\log 3 \approx 1.099$. $0.606$ is below $1.099$, so this model beats random guessing. The loss at position 2 is higher than at position 1 because the model split its probability evenly between two candidates there.

## Opening the black box: attention and MLP alternate

(Recording 38:50–43:00)

The large-scale structure of the Transformer is two kinds of layers stacked in alternation. The input is the sequence of embeddings. It goes through an **attention** layer, then an **MLP**, then attention again, then an MLP again, many times over, and finally outputs $u_1,\ldots,u_T$.

One detail about dimensions is written out in neither the lecture nor the notes (an addition in this article): the vectors going in and out of every middle layer have dimension $d$, while the logits have dimension $\lvert V\rvert$. So after the last layer there is one more multiplication by a $d\times\lvert V\rvert$ matrix, turning the $d$-dimensional vector at each position into $\lvert V\rvert$ logits. This step is a single matrix multiplication and does not affect the discussion of attention below.

The division of labor between the two layers is clear:

- **MLP**: a small neural network of two or three layers. Each position goes through the same MLP on its own, with shared parameters. Positions do not look at one another at all, so this runs in parallel.
- **attention**: takes in a sequence of vectors and outputs a sequence of vectors. It is the only place in the whole model where information from different positions mixes.

A student asks whether the whole thing is trained as one system. The lecturer says yes: once the architecture is fixed, the whole thing is treated as one giant neural network and trained end to end with automatic differentiation. The conclusion from the earlier backpropagation lecture still applies. As long as the forward pass is composed of basic operations, the backward pass can be computed automatically, and attention and the MLP are just many matrix multiplications.

## Single-head attention: query, key, value

(Recording 43:00–52:55)

Start with the types: the input is a sequence of vectors $h^{\text{in}}_1,\ldots,h^{\text{in}}_T$, and the output is a sequence of vectors $h^{\text{out}}_1,\ldots,h^{\text{out}}_T$. Each $h^{\text{in}}_t \in \mathbb{R}^{1\times d}$.

**Step one: compute three vectors at each position.** There are three matrices to train, $W^Q, W^K, W^V \in \mathbb{R}^{d\times d_h}$, where $d_h$ is a dimension you choose. Because the vectors are row vectors, the matrices multiply on the right:

$$
q_t = h^{\text{in}}_t W^Q, \qquad k_t = h^{\text{in}}_t W^K, \qquad v_t = h^{\text{in}}_t W^V
$$

All three lie in $\mathbb{R}^{1\times d_h}$ and are called the query, key, and value.

**Step two: take the inner product of position $t$'s query with every position's key.**

$$
q_t k_1^\top,\ q_t k_2^\top,\ \ldots,\ q_t k_T^\top
$$

$q_t$ is horizontal and $k_j^\top$ is vertical, so their product is a scalar, and this is $T$ real numbers. In practice each inner product is also divided by a scaling constant $c$, which the lecturer says you can ignore for now.

**Step three: apply softmax to these $T$ numbers.**

$$
(p_{t,1},\ldots,p_{t,T}) = \mathrm{softmax}\big(q_t k_1^\top/c,\ \ldots,\ q_t k_T^\top/c\big)
$$

The result is a probability vector over the $T$ positions: each $p_{t,j}\ge 0$ and $\sum_j p_{t,j} = 1$. A large $p_{t,j}$ means the inner product of $q_t$ and $k_j$ is high relative to the other positions, so position $t$ should "attend" more to position $j$.

**Step four: use these weights to take a weighted average of the values.**

$$
h^{\text{out}}_t = \sum_{j=1}^{T} p_{t,j}\, v_j
$$

A position with a large weight contributes a larger share of its value to the output.

You can remember the roles of the three vectors this way (this is how the notes put it): the query is "what information am I looking for", the key is "what information do I have here", and the value is the content that actually gets passed along when a match succeeds. The lecturer's intuition in class is more cautious. He first admits:

> "Nobody really knows exactly how it works." (45:40)

Only then does he give the rough idea: positions must interact, or every time step would be computed on its own; and the form the interaction takes is that, when processing one position, you find which positions hold relevant information and look at them a bit more.

A student asks how the keys are decided. The answer is that training decides: $W^Q$, $W^K$, and $W^V$ are all parameters, and who should attend to whom is learned.

> "So you only give a template in some sense." (52:06)

The architecture supplies only a template. With all weights at 0 it is still a valid neural network, just one with a bad loss, and the training algorithm adjusts the $W$ matrices until this mechanism does the right thing.

**Why the scaling constant $c$ is $\sqrt{d_h}$** (the lecture skips this; it comes from the notes). Suppose that at initialization the components of $q$ and $k$ are mutually independent with mean 0 and variance 1. In the inner product $q\cdot k = \sum_{i=1}^{d_h} q_i k_i$, each term has mean 0 and variance $\mathbb{E}[q_i^2]\,\mathbb{E}[k_i^2] = 1$. Adding $d_h$ independent terms gives variance $d_h$ and standard deviation $\sqrt{d_h}$. Without scaling, a larger $d_h$ means larger logits, and the softmax becomes extremely sharp, as in the low-temperature example above, with very small gradients. Dividing by $\sqrt{d_h}$ brings the variance of the logits back to about 1. The notes themselves flag this as only a heuristic argument, since actual queries and keys are not independent. The lecturer comes back to where this $c$ comes from in class in [Lecture 16](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en); for now it is enough to know that it keeps the softmax from getting too sharp.

## Why not just use one big MLP

(Recording 52:55–57:40)

A student asks: why is this structure needed, and can't an MLP do it on its own? The lecturer answers by splitting the question into two versions.

**Version one: keep only the per-position MLP and remove attention.** Then positions do not interact at all. That amounts to breaking a sentence into separate words and processing each alone, which cannot understand the sentence.

**Version two: concatenate the vectors of all positions into one long vector and feed it to a giant MLP.** This does give interaction, but it has two problems:

1. Too many parameters. Sequence lengths sometimes reach a million, and the MLP would contain a million-by-million matrix.
2. The parameter count changes with the sequence length. Train at length 1,000 and test at length 1,001, and the model no longer has the same shape.

Attention has neither problem. Looking back at the definition, the only parameters are $W^Q$, $W^K$, and $W^V$, of size $d\times d_h$, independent of $T$. $T$ affects only how many queries take inner products with how many keys.

Another student sums the idea up: we know a large enough MLP could do it in theory, but we can't afford the computation, so we add some structure to make it efficient. The lecturer agrees and adds the extreme at the other end: if the rule were "just take the average", there would be no parameters at all, and a rule that rigid does not work either.

> "So it's like you strike a balance between how much structure you introduce and how much flexibility you give the models to figure out." (56:12)

The lecturer also mentions that there have been other ways to handle sequences, such as convolutional networks that look at one fixed-size window at a time. He says this approach is not bad and papers still pursue it, but it does not work as well as attention.

## Matrix form and the causal mask

(Recording 57:40–1:05:40)

### Writing the four steps in one line

The per-position notation is messy, so the convention is to stack all queries into a matrix $Q\in\mathbb{R}^{T\times d_h}$ (row $t$ is $q_t$) and stack the keys and values into $K$ and $V$ the same way. Then

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\big(QK^\top/c\big)\,V
$$

Matching this back: $QK^\top$ is a $T\times T$ matrix whose $(t,j)$ entry is $q_t k_j^\top$, that is, all the inner products of step two. $\mathrm{softmax}_{\text{row}}$ applies a softmax to each row separately, so row $t$ becomes $(p_{t,1},\ldots,p_{t,T})$. Finally, multiplying by $V$ makes row $t$ equal to $\sum_j p_{t,j} v_j$. This is not a new model, only another way of writing the same thing. Its advantage is that all the inner products can be computed in parallel at once.

### The definition so far violates the autoregressive requirement

Here the lecturer says he "cheated a step" earlier. By the formula above, $h^{\text{out}}_t$ is a weighted sum of all of $v_1,\ldots,v_T$, including $v_T$, and $v_T$ is a function of the last input. So the output at position $t$ can see future tokens, which violates the requirement that $u_t$ depend only on $x_0,\ldots,x_{t-1}$.

Why can this requirement not be dropped? The lecturer's reason is generation: when the current token is being generated, future tokens do not exist yet, so each position can depend only on what comes before it. The same rule has to hold in training, or the loss would not be computing the conditional probabilities in the factorization (the second half of this sentence is an addition in this article).

### The fix: delete the future terms and renormalize

Conceptually, for each $t$, delete every term with $j > t$ from the weighted sum and renormalize the remaining weights to sum to 1. The output is still a convex combination of $v_1,\ldots,v_t$.

In implementation, a mask matrix $M\in\mathbb{R}^{T\times T}$ is added before the softmax:

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\big(QK^\top/c + M\big)\,V,\qquad
M_{t,j} = \begin{cases} 0 & j\le t \\ -\infty & j>t \end{cases}
$$

The upper triangle of $M$ (excluding the diagonal) is all $-\infty$. Any number plus $-\infty$ is still $-\infty$, and $e^{-\infty} = 0$, so after the softmax the weights at those positions are exactly 0 and the weights at the other positions are automatically normalized to sum to 1. "Add $-\infty$, then softmax" and "delete, then renormalize" are the same thing, and the example below verifies it.

### Numerical example: masked attention over three positions

The following example is made up for this article, not from the lecture. Take $T = 3$, $d_h = 2$, $c = 1$, and specify the queries, keys, and values directly (in reality they come from multiplying $h^{\text{in}}$ by the three matrices):

$$
Q = \begin{pmatrix} 1 & 1 \\ 0 & 1 \\ 1 & 0 \end{pmatrix},\qquad
K = \begin{pmatrix} 2 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix},\qquad
V = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix}
$$

**The inner-product matrix.** The $(t,j)$ entry is the inner product of $q_t$ and $k_j$. For example, in row 3: $q_3 = (1,0)$ against $k_1,k_2,k_3$ gives $2, 0, 1$.

$$
QK^\top = \begin{pmatrix} 2 & 1 & 2 \\ 0 & 1 & 1 \\ 2 & 0 & 1 \end{pmatrix}
\quad\xrightarrow{\ +M\ }\quad
\begin{pmatrix} 2 & -\infty & -\infty \\ 0 & 1 & -\infty \\ 2 & 0 & 1 \end{pmatrix}
$$

**Row-wise softmax.**

- Row 1 has only one finite value left, so the weights are $(1, 0, 0)$.
- Row 2: $e^0 = 1$ and $e^1\approx 2.718$, with sum $3.718$, giving weights $(0.269, 0.731, 0)$.
- Row 3: $e^2\approx 7.389$, $e^0 = 1$, and $e^1\approx 2.718$, with sum $11.107$, giving weights $(0.665, 0.090, 0.245)$.

**Multiply by $V$.**

$$
\begin{aligned}
h^{\text{out}}_1 &= 1\cdot(1,0) = (1,\ 0)\\
h^{\text{out}}_2 &= 0.269\,(1,0) + 0.731\,(0,1) = (0.269,\ 0.731)\\
h^{\text{out}}_3 &= 0.665\,(1,0) + 0.090\,(0,1) + 0.245\,(1,1) = (0.910,\ 0.335)
\end{aligned}
$$

**What these results mean.** Position 1 can see only itself, so its output is $v_1$. Position 3's query matches $k_1$ best (inner product 2), so two-thirds of its output comes from $v_1$.

Now look at what the mask does. Without the mask, position 2's three inner products $(0, 1, 1)$ have softmax $(0.155, 0.422, 0.422)$, and the output becomes $0.155\,(1,0) + 0.422\,(0,1) + 0.422\,(1,1) = (0.578, 0.845)$, with position 3's value mixed in. Following "delete, then renormalize", drop the third term, and the first two become $0.155/(0.155+0.422) = 0.269$ and $0.422/(0.155+0.422)=0.731$, identical to the weights obtained by adding $-\infty$.

## Multi-head attention: run several copies in parallel, then combine

(Recording 1:05:40–1:11:55)

What was defined above is single-head attention, which the notes write as $\mathrm{att1h}$. The attention layer used in practice has $n_h$ of these running in parallel, each called a head.

- Every head takes **the same input** $h^{\text{in}}_1,\ldots,h^{\text{in}}_T$.
- Every head has **its own** $W^Q$, $W^K$, and $W^V$. The lecturer stresses that these are not literal copies; with identical weights they would be useless.
- Every head outputs its own sequence of vectors.

To merge $n_h$ sequences of vectors into one: at each position $t$, concatenate the outputs of all heads at that position into one long vector $z_t$ (of length $n_h\cdot d_h$), then multiply by a projection matrix $W^O\in\mathbb{R}^{(n_h d_h)\times d}$:

$$
\mathrm{att}(h_1,\ldots,h_T)_t = z_t\, W^O
$$

The output is back in $d$ dimensions, so the whole attention layer is "$T$ vectors of dimension $d$ in, $T$ vectors of dimension $d$ out", and layers can be chained one after another. The notes add that in practice one usually chooses $n_h\cdot d_h = d$.

The point of multiple heads is to let one layer attend in several ways at once. The lecturer's intuition: one head might be finding which entity in the preceding text relates to me, another might be looking at which part of the sentiment in the preceding text relates to me, and at the end these different kinds of information are gathered into one vector.

A student asks whether the second head's input is the first head's output. The answer is no: all heads in a layer run in parallel, and only after they are combined does the result go to the next layer, which again has its own set of parallel heads. As for the number of heads, the lecturer says the maximum is on the order of a hundred or so and depends on model size, and he says he is not sure of the exact numbers.

## Residual connections and normalization

(Recording 1:12:00–1:13:30)

The lecturer spends two or three minutes adding that a real Transformer does not connect attention and the MLP directly. In between are normalization layers (usually RMSNorm, mentioned in the earlier neural network unit) and residual connections, which work like the residual networks covered earlier: add the input back to the output. There are two arrangements for where the normalization goes, pre-norm and post-norm; see the notes for the details.

In the notes, one pre-norm layer is written as (the following is from the notes; the lecture does not write out the formula):

$$
r_t = h^{\ell}_t + \big[\mathrm{att}(\mathrm{LN}(h^{\ell}_1),\ldots,\mathrm{LN}(h^{\ell}_T))\big]_t,\qquad
h^{\ell+1}_t = r_t + \mathrm{MLP}(\mathrm{LN}(r_t))
$$

Normalize first, then go into attention, and add the result back to the original $h^\ell_t$; the MLP half is handled the same way. The notes say today's large language models mostly use pre-norm and replace layer norm with RMSNorm.

## Compute and memory: why T squared

(Recording 1:13:30–1:17:15)

The last few minutes set up the next session, a guest lecture on the systems side. The lecturer says the dependence on the other quantities (dimension, parameter count) is linear and multiplicative, which is simple; what matters is the dependence on the sequence length $T$.

**Compute.** Each position's query takes inner products with $T$ keys, and there are $T$ positions, so that is $T^2$ inner products. Each inner product multiplies two $d_h$-dimensional vectors and costs $d_h$ multiply-adds. Altogether, each head costs

$$
T^2 \cdot d_h \ \text{operations}
$$

You can also read this off the matrix: $QK^\top$ is itself $T\times T$. At $T = 10^6$ that is $10^{12}$ inner products, which the lecturer calls prohibitive. He connects this to the long-context problem: chat or coding tools say they need to compress the context once a conversation gets long, and one reason is that without shortening it the computation is too inefficient.

He adds a caveat: real production systems are not necessarily $T^2$ and may be closer to linear, because various Transformer variants reduce the dependence on $T$. As for which one each company actually uses, he says he does not know either.

**Memory.** At first glance it needs $T^2$, because the matrix $QK^\top$ has $T^2$ entries. But you don't have to compute and store the whole matrix before multiplying by $V$. You can compute part of the matrix, multiply it by the corresponding part of $V$, discard that part, and move on to the next. This idea is called **FlashAttention**.

**The trade-off.** Changing the architecture to reduce the dependence on $T$ usually makes the model less expressive and may cost some performance. These variants are left for later lectures.

## Self-check

**1. The logits are $(2, 1, -1)$. What is the sampling distribution at temperature $\tau = 2$? What changed compared with $\tau = 1$?**

Dividing by 2 gives $(1, 0.5, -0.5)$. $e^{1}\approx 2.718$, $e^{0.5}\approx 1.649$, $e^{-0.5}\approx 0.607$, with sum $\approx 4.974$, so the distribution is $\approx (0.547, 0.331, 0.122)$. The ordering is unchanged, but first place drops from 0.705 to 0.547 and third place rises from 0.035 to 0.122: a temperature above 1 flattens the distribution, and the tail is drawn more easily.

**2. Using the masked attention example above, change $q_3$ to $(0, 1)$. What is $h^{\text{out}}_3$?**

The inner products are $q_3 k_1^\top = 0$, $q_3 k_2^\top = 1$, and $q_3 k_3^\top = 1$. Position 3 is the last position, so nothing is masked. softmax$(0,1,1) \approx (0.155, 0.422, 0.422)$, and the output is $0.155\,(1,0)+0.422\,(0,1)+0.422\,(1,1) = (0.578, 0.845)$. Criterion: the weights sum to 1, and $k_2$ and $k_3$ have the same inner product, so they get the same weight.

**3. One multi-head attention layer has $d = 512$, $n_h = 8$, $d_h = 64$. How many parameters does it have? When the sequence length goes from 1,000 to 2,000, by what factor do the parameter count and the number of inner products change?**

Each head has three $512\times 64$ matrices, for $3\times 32{,}768 = 98{,}304$; 8 heads give $786{,}432$. $W^O$ is $(8\times 64)\times 512 = 262{,}144$. The total is $1{,}048{,}576$ (not counting bias terms). The parameter count is independent of $T$ and stays at 1×; the number of inner products is $T^2$, going from $10^6$ to $4\times 10^6$, which is 4×.

**4. In training the whole text is already in hand. Why is the causal mask still needed?**

Criterion: the answer must mention the definition of the loss. The $t$-th term of the loss is $-\log p_\theta(x_t\mid x_1,\ldots,x_{t-1})$, which requires $u_t$ to be computed from $x_0,\ldots,x_{t-1}$ alone. Without the mask, the position that produces $u_t$ can read the answer $x_t$ directly from the later inputs. The training loss would be very low, but what the model learns is not "predict the next token from the preceding text". At generation time the future tokens do not exist, and the model has nothing to use.

**5. Why not concatenate the embeddings of all positions and throw them into one big MLP? Give two reasons.**

The parameter count explodes with $T$ (a length of a million produces a million-by-million matrix); and the shape of the parameters is tied to one particular $T$, so they cannot be used at another length. Attention's parameters are just a few matrices of size $d\times d_h$, independent of $T$.

## Corresponding reading

Chapter 17 of the main notes, Large language models. This lecture corresponds to 17.1 through 17.3:

- **17.1 Tokenization** (pp.202–203): tokenization, BPE, vocabulary size.
- **17.2 Autoregressive models and next-token prediction loss** (pp.203–207): the chain-rule factorization (Eq. 17.1), the embedding matrix (17.2), the softmax output (17.3), generation and temperature (17.4–17.11), the loss (17.12–17.13).
- **17.3 Transformer architecture** (pp.207–213): single-head attention (17.14–17.20), the mask (17.21–17.24), multi-head (17.25), pre-norm and post-norm (17.28–17.31), compute and memory.

Where the lecture and the notes differ, or what the lecture leaves out:

- **Whether the loss is divided by $T$**: the notes take the average; the lecture writes only the sum.
- **How LLMification is split**: in class it is split aloud into the two pieces LLM and ification; the notes write `LL`+`M`+`ification` and say the actual split is whatever the learned tokenizer produces.
- **The reason for the scaling constant $c=\sqrt{d_h}$**: skipped in class; the notes give the variance argument.
- **top-p sampling, AdamW**: only in the notes.
- **KV cache**: Section 17.3 of the notes has a passage on storing the keys and values already computed during generation so they are not recomputed. This lecture does not cover it; Lecture 16 covers it at the start.
- **Positional encoding**: never mentioned in class. A footnote in the notes explains that self-attention by itself cannot tell the order of tokens and that positional information must be added in practice, but this version of the notes has not written that part yet. If by this point you feel that "attention doesn't seem to know who comes first", you are right, and this is the missing piece.
- **In-context learning**: it is in the video title but not in this lecture; the notes have it in 17.6, and the lectures get to it in Lecture 16.

## Next lecture

In the opening, the lecturer says that besides large language models and reinforcement learning, the rest of the course has two guest lectures. The one that comes right after this is given by Simran on systems ML, about running Transformers efficiently on GPUs. That session is Lecture 15 and has no public recording; in the Stanford Online playlist, Lecture 14 is followed directly by Lecture 16.

So the next article in this series is [Lecture 16: attention variants, MoE, and prompting](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en). It picks up from the compute problem at the end of this lecture: first the KV cache during generation, then variants such as grouped-query attention that bring the cost down, then Mixture of Experts, and only at the end the in-context learning from the video title, along with zero-shot prompting and supervised fine-tuning.

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning](https://www.youtube.com/watch?v=pwQ0l4hFCVI)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article was compared section by section with the English transcript of this recording (about 78 minutes), and the time ranges under each section heading come from the transcript timestamps. I did not watch the board; the formulas are reconstructed by comparing what is said aloud with Chapter 17 of the main notes. The transcript marks student questions as inaudible in many places, so I used only the parts that can be established from the lecturer's answers.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning (YouTube)](https://www.youtube.com/watch?v=pwQ0l4hFCVI): the main source for this article. The order of the lecture, the lecturer's statements, and the quotes all come from the English transcript of this recording.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 17, Sections 17.1–17.3 (pp.202–213), used to reconstruct the board formulas and notation and to fill in what the lecture leaves out: how BPE works, the reason for the $\sqrt{d_h}$ scaling, the pre-norm formula, top-p, and the KV cache.
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): confirms the lecture numbering of the public recordings; Lecture 14 is followed by Lecture 16.
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the overview and reading route for this series.
