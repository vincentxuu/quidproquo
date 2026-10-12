---
title: "Attention Variants, MoE, and Prompting: What to Do When the KV Cache Is Too Big | Stanford CS229 Lecture 16"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, attention, moe, fine-tuning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 15
tldr: "During generation, every head has to keep the keys and values of all past positions in GPU memory, and this KV cache caps the batch size. GQA lets τ query heads share one set of keys and values, shrinking the cache to 1/τ; sliding window attention cuts the T² compute down to T·w; MoE runs only 8 of 128 experts for each token. The second half covers how to use a trained model: few-shot and zero-shot prompting leave the parameters alone, SFT changes them, and its loss is computed only on the answer tokens."
description: "A guide to Lecture 16 of Stanford CS229 (Spring 2026): the grouping formula of grouped-query attention, where the √d_h normalization comes from, sliding window attention, QK-Norm, routing and weighting in Mixture-of-Experts, and in-context learning, zero-shot prompting, and the loss for supervised fine-tuning."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 [Lecture 16 recording](https://www.youtube.com/watch?v=hHC-SF3utxg) published by Stanford Online, with formula notation checked against Chapter 17 of the 2026 main notes; I did not see the board. The topic in the YouTube title (Basic Concept in RL, Policy Gradient) does not match the content: the video contains no reinforcement learning at all, and what follows is organized around what the lecture actually covers.

This lecture closes the large language model unit in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en). [Lecture 14](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) finished writing down the attention formula. This one goes back and asks two things: where this architecture is expensive and how people modify it, and how you use a trained model for the task you actually have. The lecturer is Tengyu Ma. He says at the start that the second half is a string of small topics, "pretty almost trivial," but that he still has to go through them one by one to get the terminology straight.

Between Lecture 14 and this one there was a guest lecture with no public recording (Lecture 15). This lecture assumes you already know the following from Lecture 14:

- Tokens, autoregressive models, and the next-token loss: the probability of a sequence factored into a product of conditional probabilities.
- The hidden vector at each position is multiplied by a projection matrix to give the query $q_t$, the key $k_t$, and the value $v_t$.
- Single-head attention in matrix form, $\mathrm{softmax}_{\text{row}}(QK^\top/c + M)\,V$, where $M$ is the causal mask that lets position $t$ see only positions $1$ through $t$.
- Multi-head attention is several copies of the same structure side by side, each with its own weights.

The guest lecture was about the GPU systems side. This lecture borrows only one conclusion from it, and the first section below fills in the part you need. After reading this article you should be able to compute how much memory a model's KV cache takes and how much GQA saves, work through MoE routing and weighting by hand, and say clearly which of few-shot, zero-shot, and SFT changes the parameters and which tokens the loss is computed on.

```youtube
url: https://www.youtube.com/watch?v=hHC-SF3utxg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient
captions: en
```

## Review: the cost of attention and the KV cache

(Recording 00:00–07:23)

Start by redrawing the picture from last time. There are $T$ positions along the time axis, and each position has a query, a key, and a value. Because the model is autoregressive, $q_1$ looks only at $k_1$, $q_2$ looks at $k_1, k_2$, and $q_T$ looks at everything before it. Draw "who looks at whom" as a $T\times T$ matrix and only half the cells are filled. Compute the attention scores, multiply by the values, and you have this head's output:

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\left(\frac{QK^\top}{c} + M\right)V
$$

Row $t$ of $Q$, $K$, and $V$ is $q_t$, $k_t$, and $v_t$ respectively. $M$ holds $-\infty$ at the positions that should not be seen, so after the softmax those positions get weight 0. Multi-head attention makes $n_h$ copies of the whole thing, each with its own weights, so we need one more subscript: $q_{t,j}$ is the query of head $j$ at position $t$.

This structure has two costs.

**Compute**: $Q K^\top$ takes $T\times T$ inner products, so the cost is at least proportional to $T^2$.

**Memory**: during generation the model emits one token at a time. Computing the output at position $t$ needs $q_t$ and all the earlier $k_1,\dots,k_t$ and $v_1,\dots,v_t$. Those earlier keys and values do not change when more tokens are appended, so you compute them once, store them, and reuse them at the next step. What you store is called the **KV cache**. Queries do not need to be stored: the attention of $q_{t-1}$ over all the keys was finished at the previous step, and it is never needed again. So memory use is proportional to $T$, and every layer and every head keeps its own copy of the keys and values.

The lecture then explains why this memory is a problem. GPU memory is limited, and the KV cache of a single sequence can take up most of it. That limits how many sequences fit in a batch at once, maybe 10, maybe 100. With a small batch the GPU cannot parallelize by "computing many sequences together," and the compute sits idle waiting on memory. The lecture ties this to arithmetic intensity, which the guest lecture had covered, and to the utilization metric that measures how much of a GPU's compute is actually used: the GPU is stuck on memory while the compute side waits for work. The conclusion: shrinking the KV cache is worth changing the architecture for.

The following is an example made up for this article, not from the lecture, to give a feel for the scale. Suppose the model has 32 layers, $n_h = 32$ heads per layer, head dimension $d_h = 128$, and numbers stored as 16-bit floats (2 bytes each). For one token, one layer stores $2 \times 32 \times 128 = 8{,}192$ numbers of keys plus values, 32 layers store $262{,}144$ numbers, and that is $524{,}288$ bytes, about 0.52 MB. With a context length of $T = 100{,}000$, the KV cache of one sequence is $524{,}288 \times 100{,}000 \approx 5.24\times10^{10}$ bytes, about 52 GB, and that is just one sequence.

## Grouped-query attention: queries as before, keys and values shared

(Recording 07:23–14:48, questions 17:53–25:40)

Since keys and values are the expensive part, store fewer sets of them. **Grouped-query attention (GQA)** keeps $n_h$ sets of queries but only $n_g$ sets of keys and values, with $n_g < n_h$. Usually $n_g$ divides $n_h$, and we let

$$
\tau = \frac{n_h}{n_g}
$$

Every $\tau$ query heads share the same set of keys and the same set of values. The picture drawn in the lecture has $n_g = 2$. A student asked what $\tau$ is then, and the answer was that it depends on $n_h$: with $n_h = 100$, $\tau = 50$, and every 50 heads map to the same set of keys.

To write this as a formula we need a map that says which set of keys query head $j$ uses:

$$
g(j) = \left\lfloor \frac{j-1}{\tau} \right\rfloor + 1 \in \{1,\dots,n_g\}
$$

The $j-1$ is there to count from 0, dividing by $\tau$ and taking the floor gives "which bundle," and the final plus 1 converts back to numbering from 1. Check it with $n_h = 8$, $n_g = 2$, $\tau = 4$: for $j=4$, $\lfloor 3/4 \rfloor + 1 = 1$, and for $j=5$, $\lfloor 4/4 \rfloor + 1 = 2$. So heads 1 through 4 use set 1 and heads 5 through 8 use set 2, as expected.

Next, stack each head's vectors into matrices. Row $t$ of $Q_j$ is $q_{t,j}$ ($j = 1,\dots,n_h$); row $t$ of $K_s$ and $V_s$ is $k_{t,s}$ and $v_{t,s}$ ($s = 1,\dots,n_g$). The output of head $j$ is:

$$
H_j^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\left(\frac{Q_j K_{g(j)}^\top}{c} + M\right)V_{g(j)}
$$

Compared with the original formula, the only change is that the subscript on $K$ and $V$ goes from $j$ to $g(j)$. The output still has $n_h$ heads; some of them now share the same keys and values. Setting $n_g = n_h$ recovers standard multi-head attention.

Back to the made-up example from the previous section: set $n_g$ to 8 ($\tau = 4$) and the KV cache drops from about 52 GB to about 13 GB; set it to 1 and it is about 1.6 GB. Nothing is saved on the query side, in parameters or in compute.

The questions in this part covered several places where people tend to get stuck.

**Why cut keys and values rather than queries?** Because during generation you only keep the current query, while keys and values have to be kept for the whole sequence, so the savings are very different. You could of course cut all three, but that is just reducing the number of heads. During training and prefilling (feeding in the whole prompt at once) all the queries have to be computed; the discussion here is about the generation phase.

**How do you choose $\tau$?** Apart from the requirement that $n_h = \tau\, n_g$ holds, it is found by trial. The extreme case is $\tau = n_h$, $n_g = 1$, where all heads share a single set of keys and values and memory is smallest. This is called multi-query attention (MQA). The lecture says the historical order was that the MQA paper came first, and later people felt that keeping just one set was too aggressive and stored too little information about the past, so they added $n_g$ back. The notes cite Shazeer (2019) for MQA and Ainslie et al. (2023) for GQA. When introducing GQA in the lecture, what the lecturer said aloud was that it was "introduced by" the Qwen (the transcript has "Quinn") and DeepSeek models, without mentioning a paper; for attribution, go by the citations in the notes. As for what $n_g$ actually is in practice, he said he had not memorized it and you would have to check the code.

**Does it matter which query is paired with which set of keys?** No. The keys are learned, and if you permute the mapping, training adjusts accordingly. But the mapping has to be hard-coded, because it must compile into a program that runs fast on a GPU and cannot keep changing dynamically. The lecturer guessed that in practice a set of keys and its queries are probably also placed on the same GPU, to reduce transfers between GPUs.

## Why that c is √d_h

(Recording 14:48–17:53)

While writing the GQA formula, the lecturer went back and filled in where the denominator $c$ comes from. Each entry of $QK^\top$ is the inner product of two $d_h$-dimensional vectors. Suppose every component of the vectors $a$ and $b$ is on the order of $\pm 1$, and they look random relative to each other. Then the inner product $a^\top b$ is on the order of $\sqrt{d_h}$. The lecture just states this conclusion. Section 17.3 of the notes explains the same thing with a variance argument, which the [Lecture 14 guide](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) already walked through following the notes. Here is the calculation written out in full:

Let all the components $a_1,\dots,a_{d_h}, b_1,\dots,b_{d_h}$ of $a$ and $b$ be mutually independent with mean 0 and variance 1. Then

$$
\mathbb{E}[a^\top b] = \sum_{i=1}^{d_h}\mathbb{E}[a_i]\,\mathbb{E}[b_i] = 0,\qquad
\mathrm{Var}(a^\top b) = \sum_{i=1}^{d_h}\mathbb{E}[a_i^2]\,\mathbb{E}[b_i^2] = d_h
$$

The second equation takes two steps. Each term $a_i b_i$ has mean 0, so its variance is $\mathbb{E}[a_i^2 b_i^2] = \mathbb{E}[a_i^2]\,\mathbb{E}[b_i^2] = 1$. The terms $a_i b_i$ are mutually independent, so the variances add term by term, and $d_h$ terms add up to $d_h$. The standard deviation is therefore $\sqrt{d_h}$. Take $c$ to be $\sqrt{d_h}$, and after dividing, the numbers going into the softmax are back on the order of 1, regardless of the dimension.

Why does this matter? Look at some numbers (made up for this article): with $d_h = 256$ the standard deviation of the inner product is 16. If the scores of two keys differ by 16 and you do not divide, the softmax gives them weights in the ratio $e^{16} \approx 8.9\times10^{6}$ to 1, which amounts to looking at one position only. After dividing by 16 the gap is 1 and the weight ratio is $e \approx 2.72$ to 1, about 0.73 versus 0.27, so both positions still carry weight. The point is that changing $d_h$ should not force you to retune the whole architecture.

The lecturer is cautious about how much this derivation is worth. He calls it "a very heuristic kind of calculation": if $a$ and $b$ are not actually random and already point in similar directions, the right constant to divide by is different (by the calculation above, the inner product of two perfectly aligned vectors is on the order of $d_h$; this sentence is an addition in this article). Different theories give slightly different recommendations, and $\sqrt{d_h}$ is one choice that has been found to work in practice. In his words:

> "So you have some intuitions, you have some heuristics, and then you try it and empirically it works. Then that's your choice." (17:53)

## Sliding window attention: look only at the most recent w positions

(Recording 25:40–30:13, questions 31:40–32:40)

GQA deals with memory; this variant deals with compute. When $T$ reaches a million, $T^2$ is $10^{12}$, which is not feasible. The lecturer starts with a disclaimer:

> "We don't know exactly how the frontier labs are doing this." (26:03)

One approach in the open-source community is simply not to compute all of the attention. **Sliding window attention** says $q_t$ looks only at the keys of the most recent $w$ positions, $q_{t-1}$ likewise looks at the $w$ positions counting back from itself, and the window slides along with the position of the query. The notes write it as a mask (Eq. 17.35):

$$
M_{t,j} = \begin{cases} 0, & \max(1,\,t-w+1) \le j \le t \\ -\infty, & \text{otherwise} \end{cases}
$$

Each query computes only $w$ inner products, so the total compute goes from $T\times T$ to $T\times w$, which is linear in $T$. $w$ is a hyperparameter you choose, usually much smaller than $T$. The lecture uses $w = 1{,}000$: no matter how large $T$ is, the cost is $T \times 1{,}000$. With $T = 10^6$, $T\cdot w = 10^9$, one thousandth of $T^2 = 10^{12}$.

The price is that the model cannot see far, though not as near as the definition literally suggests. The query at position $t$ in the top layer sees only the most recent $w$ keys, but those keys are projected from the hidden vectors output by the layer below, and those hidden vectors have themselves looked at the $w$ positions before them. Push this down layer by layer, and a model with $L$ layers can look back about $L \times w$ tokens at most:

> "You can at most look back for l times w tokens." (29:11)

Counting it once with small numbers makes it more concrete (an example made up for this article): $w = 3$, two layers. Position $t$ in the upper layer sees $t-2, t-1, t$ in the lower layer; position $t-2$ in the lower layer in turn sees inputs $t-4, t-3, t-2$. So position $t$ in the upper layer is influenced by inputs as far back as $t-4$, 4 steps back. Counting exactly, each layer extends the reach by $w-1$ steps, for $L(w-1)$ steps over $L$ layers; the $L\times w$ stated in the lecture is the same order of magnitude.

Tokens beyond this range have no effect at all on the current output, so when $T$ is large enough the model is guaranteed to forget the beginning. That is why the lecturer says this trick cannot be used on its own. Quite a few papers study sparse attention that does not forget the past, and it is not yet known which is best.

## QK-Norm: normalize before taking the inner product

(Recording 30:13–31:30)

The $\sqrt{d_h}$ derivation assumes every component of the query and key is on the order of 1, but nothing in training guarantees that, and the vectors may grow or shrink as training goes on. One fix is to normalize the query and the key separately before taking the inner product:

$$
\frac{q_{t,j}\,k^\top}{c}\quad\longrightarrow\quad \frac{\mathrm{RMSNorm}(q_{t,j})\,\mathrm{RMSNorm}(k)^\top}{c}
$$

Here $k$ is any key that $q_{t,j}$ is compared against. RMSNorm divides a vector by the root mean square of its own components (Eq. 7.51 in the notes: $\mathrm{RMSNorm}(z) = \gamma\cdot z\big/\sqrt{\tfrac{1}{m}\sum_i z_i^2}$, where $\gamma$ is a learnable scale parameter). After dividing, the root mean square of the components is fixed, so the assumption of the previous section holds and the inner products do not drift during training. The lecture again stresses that this is a heuristic and says only that some open-source models use it; the notes call it QK-Norm and give Qwen3 and OLMo 2 as examples.

## Mixture of Experts: many parameters, only a small part computed each time

(Recording 32:40–50:55)

Besides attention, each Transformer layer has an MLP applied to every position separately (the lecture says MLP, FFN, and fully connected network are the same thing). The most direct way to make the model bigger is to raise the MLP dimension, but the matrices are $d\times d$, so doubling $d$ quadruples both the number of matrix entries and the number of multiplications. If you want more parameters, every token pays for them in compute.

**Mixture of Experts (MoE)** grows the model in a different way: put $m$ MLPs in one layer, call each one an expert, and write them $E_1,\dots,E_m$. Each input is sent to only a few of them, and the experts not selected take no part in the computation this time. This decouples parameter count from compute. The numbers in the lecture are 128 experts in total with 8 active each time: all 128 sit in memory, but a token pays the compute of only 8.

Open-source model names reflect this too. The example in the lecture is `30B-A3B`: 30B total parameters, and the A stands for active, with 3B actually used in each inference pass.

### How routing is computed

(Recording 41:39–46:08; this part answers a student's question about how exactly the selection is made)

The input is the hidden vector $h$ at some position in the Transformer. A small routing module first computes a weight for each expert:

$$
r = \sigma(h\,W^R) \in \mathbb{R}^m
$$

$W^R$ is the routing matrix, which projects $h$ to $m$ dimensions. $\sigma$ can be a softmax over the $m$ experts or an elementwise sigmoid. Entry $s$ of $r$ represents the relative importance of expert $s$ for this input.

Then take the $k$ largest entries of $r$. Their indices form the set $S$, and $|S| = k$ is the number of active experts. Run $E_s(h)$ for just these $k$ experts and take the weighted sum:

$$
\mathrm{MoE}(h) = \sum_{s\in S}\alpha_s\,E_s(h),\qquad \alpha_s = \frac{r_s}{\sum_{j\in S} r_j}
$$

$\alpha$ renormalizes $r$ over the selected entries so that they sum to 1. The lecturer made a point of correcting the denominator: the sum runs only over $S$, not over all $m$ entries. The output is then a convex combination of a few experts' outputs, and its scale does not shift with how many were selected.

The following is an example made up for this article. Let $m = 4$, $k = 2$, and suppose routing gives $r = (0.5,\ 0.1,\ 0.3,\ 0.1)$. The two largest entries are the 1st and the 3rd, so $S = \{1, 3\}$. Renormalize: $\alpha_1 = 0.5/0.8 = 0.625$, $\alpha_3 = 0.3/0.8 = 0.375$. Suppose $E_1(h) = (2, 0)$ and $E_3(h) = (0, 4)$. Then

$$
\mathrm{MoE}(h) = 0.625\,(2,0) + 0.375\,(0,4) = (1.25,\ 1.5)
$$

$E_2$ and $E_4$ are never executed, which saves half the MLP compute at this step. If you forgot to renormalize and used $0.5$ and $0.3$ directly as weights, you would get $(1.0, 1.2)$, the whole output scaled down by a factor of 0.8. Change the number of active experts $k$ and the scale of the output changes with it, which is exactly what renormalization is meant to prevent.

### Do the experts really specialize?

The original motivation for MoE had nothing to do with systems: imagine expert 1 handles math, expert 2 physics, expert 3 general English, and expert 4 code, so that small specialized networks reach the same quality with fewer parameters. A student asked whether you then train each expert separately on specialized data. The answer is no:

> "You don't really train them to be specialized explicitly, but they could possibly naturally become specialized, because that's the most efficient way to do it." (37:30)

The lecturer said he had read a few papers claiming that specialization is fairly pronounced, but the conclusion depends on how you define specialization. He then cleared up a common misunderstanding: routing is not decided once for the whole sequence. It is decided separately at **every position and every layer**. A sequence that is all math does not go through the same set of "math experts" from start to finish. Empirically, a single sequence does use fewer experts than the total, but the boundaries are not that sharp.

As for deliberately training them separately, he said people have tried it, it works worse than end-to-end training, and it is hard to do: what data each expert should get and whether there is enough of it are both open problems. With only 8 experts and 1 selected each time you can just about imagine it; with 256 experts and 8 selected, assigning them one by one in advance is very hard.

### Shared experts and load balancing

(Recording 46:08–50:55)

Some designs keep a **shared expert** that is always active at every position and every layer, with routing choosing only among the rest. The lecture's example is DeepSeek-V3. As the lecturer recalls it, the reason given in the paper is that the shared expert handles common knowledge about language that every token needs; he added that some models do not adopt this design. The numbers in the notes are that each MoE layer of DeepSeek-V3 has 256 routed experts, 8 of them active for each token, plus 1 shared expert.

The lecture does not go into the details of training an MoE. It says only that they are subtle and points out one key thing: training usually adds regularization so that routing spreads as evenly as possible across the experts. There are two reasons. If routing always goes to the same two experts, the others take up memory without being used, and the effective size of the model is smaller than its nominal size. Also, the experts sit on different GPUs, and if their usage is too uneven some GPUs sit idle and inference becomes less efficient. This can also be handled on the deployment side by giving popular experts more GPUs. The lecturer mentioned that a DeepSeek paper or blog post describes adjusting the allocation dynamically by time of day, and added that he was not sure whether all models do this.

The last question came back to what this actually saves. It saves compute, not memory: all the parameters still have to be loaded. The comparison in the lecture is that a trillion-parameter model without MoE is almost impossible to serve, because latency is too long and cost too high. With a trillion parameters but only 30B active each time, the serving cost is closer to that of a 30B model, while the model still benefits from having more parameters.

## In-context learning: write the examples into the prompt

(Recording 51:18–59:30)

The remaining twenty minutes change the subject: the model is already pretrained, so how do you use it on a downstream task? Suppose you have a few examples $(x_1, y_1),\dots,(x_n, y_n)$ of the downstream task and want the model to predict $y$ for a new $x_{\text{test}}$.

**In-context learning** concatenates these examples into a piece of text in some format, appends $x_{\text{test}}$, and lets the model continue generating. The example from the lecture (the same one as in Section 17.6 of the notes):

```text
Q: 2 ~ 3 = ?
A: 5
Q: 6 ~ 7 = ?
A: 13
Q: 15 ~ 2 = ?
A:
```

The first two pairs are the so-called "training" examples, and the last line is the test. A person reading this would probably guess that `~` means plus: $2+3=5$ and $6+7=13$ both fit, so the answer is $15 + 2 = 17$. That is the "learning" part, learning what a symbol means from two examples. A language model reading this prompt is also most likely to generate `17` next.

A more practical use is classification. The version in the lecture is deliberately harder: the model is told only to "classify messages into three classes A, B, C," with no word on what the three classes are, then given a few examples of the form "message → A" and "message → B," and finally a new message whose output it has to fill in. From the examples the model can tell that A is roughly billing issues and B is roughly technical issues, and give the right label. Normally you would not hide the labels. Write billing and technical directly and the model learns more easily. Even with the names written out, examples still help: the boundary of "what counts as a billing email" is sometimes subtle, and a few examples are clearer than a paragraph of definition. The lecturer's analogy is that this is like teaching a person: show them examples and they generalize on their own. A student remarked that it looks like you can teach anything this way, and the answer was that in principle anything that can be taught by example can, and that the approach in the next section is even less work.

The most important sentence of this section:

> "One very important thing is that you are not updating the parameters of the model." (57:44)

The examples are just a string of text in the context, and not a single weight of the model has changed. From this the lecturer infers a ceiling on capability: if you believe the model's capability comes from its parameters, then in-context learning cannot do much to raise fundamental capability, and is more like learning style and simple definitions. His counterexample is medical imaging: give the model a few scans as examples and ask it to decide whether something is cancer. He does not think that would work, and you would still have to tune the parameters.

## Zero-shot: no examples at all

(Recording 59:30–1:04:00)

A more extreme approach gives no examples and only writes a task description: classify messages into categories such as billing and technical, explain in words as clearly as you can what each label means, and let the model generate the answer directly. This is called **zero-shot**. The task description can be long, and it can specify the output format, for example by asking for JSON. The lecturer says this is roughly how everyone uses ChatGPT day to day, and that outside of special cases few people still provide few-shot examples.

He puts this in historical context. The few-shot and zero-shot abilities were among the biggest findings of the GPT-3 paper, and they were a surprise at the time:

> "it's very shocking because we thought that you have to actually train your models on the new tasks, a little bit at least." (1:00:49)

The largest effect was on how models are deployed in industry. To solve a problem for an insurance company, the process used to be: collect data in that domain, label it, split off training and validation sets, train from some initial checkpoint while tuning hyperparameters, and finally deploy a dedicated model whose parameters have been changed. For another company you redid the whole thing, and each company maintained its own model. Now everyone uses the same off-the-shelf model and writes their own prompt: a task description, occasionally a few examples, and some scaffolding for agent-style tasks. He gave one more example: a new hire gets an onboarding document describing the workflow, and if you hand that document directly to the model, the model follows it.

A student asked how large a model has to be to have this ability. The answer was that three or four years ago this was a hot topic called the emergent properties of models: abilities appear only once scale and data volume pass some threshold, and that still holds today. But small models can now have these abilities too, first because they can be distilled from large models, and second because the training data itself has changed and already contains data of this "instruction plus answer" form. That remark leads straight into the last topic.

## SFT and instruction tuning: training this ability into the parameters

(Recording 1:04:00–1:13:00)

The zero-shot and in-context learning abilities originally emerged on their own; nobody trained for them specifically. Later people wanted to strengthen them, and the method is direct: collect a large number of pairs $(x^{(i)}, y^{(i)})$, where $x^{(i)}$ is the instruction (the task description) and $y^{(i)}$ is the answer, and continue training from an existing checkpoint.

Let $x^{(i)}$ have $L_i$ tokens and $y^{(i)}$ have $T_i$ tokens. $x$ is treated as a condition that has already been seen and does not need to be predicted; only $y$ is predicted. The goal is to make the probability of "seeing this answer given the instruction" as large as possible, that is, to minimize the negative log likelihood:

$$
\min_\theta\ \frac{1}{n}\sum_{i=1}^{n} -\log p_\theta\!\left(y^{(i)}_{1:T_i}\,\middle|\,x^{(i)}\right)
$$

$y$ is a sequence of tokens, so use the same move as in Lecture 14: factor the joint probability with the chain rule into a product of step-by-step conditional probabilities, which becomes a sum after taking the log:

$$
\log p_\theta\!\left(y^{(i)}_{1:T_i}\,\middle|\,x^{(i)}\right) = \sum_{t=1}^{T_i}\log p_\theta\!\left(y^{(i)}_t\,\middle|\,x^{(i)},\,y^{(i)}_{<t}\right)
$$

Each term means: given the whole instruction and the first $t-1$ tokens of the answer, predict token $t$. Substituting back gives Eq. (17.36) of the notes. This has the same form as the pretraining loss, and the only difference is the range of the sum: the $L_i$ instruction positions do not count toward the loss.

The following is an example made up for this article. The instruction is the sentence "classify this message," and the answer has only two tokens. After reading the instruction, the model assigns probability 0.5 to the first answer token; after also seeing the first token, it assigns probability 0.25 to the second. The loss for this example is

$$
-(\ln 0.5 + \ln 0.25) = 0.693 + 1.386 = 2.079
$$

which equals $-\ln(0.5\times 0.25) = -\ln 0.125$, the negative log of the probability of the whole answer. How well the model predicts each token of the instruction itself has no effect on this number. Training pushes 0.5 and 0.25 toward 1 and the loss toward 0.

The lecture mentions that there is a small detail about normalization and tells everyone to read the notes. What the notes do (Eq. 17.37) is concatenate the instruction and the answer into one sequence $z^{(i)}$, use a separate loss mask to mark which positions are answer (1) and which are instruction (0), and then divide by the total number of answer tokens in the whole minibatch rather than by the number of examples $n$. If the example above formed a batch on its own, that would be $2.079 / 2 \approx 1.04$. The notes also point out that the loss mask and the causal mask of attention are two different things: answer tokens can still attend to the instruction.

How the terms relate: anything that "takes an initial checkpoint and continues training on data with answers $y$ using a loss of this form" is called **supervised fine-tuning (SFT)**; when the data happens to be of the "instruction plus answer" kind, it is called **instruction tuning**.

The last few questions are worth writing down.

**Does this loss just force the model to do things the human way?** The lecturer said the concern is valid, but you first have to be clear about what the instruction is. An instruction usually specifies the task and preferences, such as which problem to solve and what form the answer should take. It generally does not specify "which equation to solve it with."

**What if $y$ contains a chain of thought?** Then the problem really does arise. Human-written reasoning forces the human's solution method onto the model. The lecturer describes this as "too much micromanagement," and ideally the reasoning should be produced by the model itself. His assessment:

> "some micromanagement could be better than nothing" (1:10:02)

But it is probably not as good as the RL approach covered later.

**Does this change the weights?** Yes. Instruction tuning happens during training, and the ChatGPT you get has already been through this step; typing in the chat box does not modify the model on the fly. It usually comes as a second stage after pretraining, though the lecturer said he cannot be sure how the various labs do it now, and this kind of data may also be mixed directly into pretraining.

**When there is not much fine-tuning data, can you tune only some of the experts or a few layers?** This was the last question before class ended. The lecturer said he had not heard of fine-tuning only some of the experts, though perhaps a paper has done it; his guess is that tuning all the experts together is still better.

## Self-check

1. A model has $n_h = 12$ heads per layer and switches to GQA with $n_g = 3$. Which set of keys does the 7th query head use? What fraction of its original size does this layer's KV cache become?
   **Answer**: $\tau = 4$, $g(7) = \lfloor 6/4\rfloor + 1 = 2$, so it uses set 2. Keys and values go from 12 sets to 3, so the KV cache is 1/4 of the original.

2. Explain in your own words: why does GQA reduce the number of sets of keys and values but keep all the queries?
   **Criterion**: the answer has to say that during generation only the current step's query is needed and can be discarded once used, while keys and values must be kept for the whole sequence for every later step, so the memory pressure comes from K and V. Answering only "to save memory" is not complete.

3. For a sliding window model with $w = 4{,}096$, $L = 24$ layers, and context $T = 200{,}000$, can the output at the last position be influenced by the 1st token? Compared with full causal attention, how many fewer inner products are computed per layer per head?
   **Answer**: the farthest look-back is about $L\times w = 98{,}304$ tokens, less than 200,000, so no. The number of inner products is about $T\cdot w \approx 8.2\times10^{8}$, while full causal attention takes about $T^2/2 = 2\times10^{10}$, so it is roughly 1/24.

4. An MoE layer has 4 experts with 2 active each time, and routing outputs $r = (0.2,\ 0.6,\ 0.1,\ 0.1)$. Write down the selected experts and their weights $\alpha$.
   **Answer**: experts 1 and 2 are selected. $\alpha_1 = 0.2/0.8 = 0.25$, $\alpha_2 = 0.6/0.8 = 0.75$, which sum to 1.

5. Of few-shot prompting, zero-shot prompting, and instruction tuning, which change the model parameters? On which part of the sequence is the instruction tuning loss computed?
   **Answer**: only instruction tuning changes the parameters. The loss is computed only on the tokens of the answer $y$; the tokens of the instruction $x$ serve as the condition and are not counted.

## Corresponding reading

The second half of Chapter 17, Large language models, in the [CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) (August 2026 edition):

- End of Section 17.3, Memory and compute (p.213): the $O(T^2 d_h)$ compute and the memory of the KV cache.
- 17.4 Variants of Attention (pp.214–215): MQA, GQA, sliding window, QK-Norm.
- 17.5 Mixture-of-Experts Layers (pp.215–216).
- 17.6 In-context learning (pp.216–217), 17.7 Zero-shot learning / prompting (pp.217–218), 17.8 Supervised Finetuning (pp.218–219).

Where the lecture and the notes differ:

- **In the notes, not covered in the lecture**: FlashAttention making attention memory linear in $T$ during training; the loss-mask formulation of SFT and the minibatch normalization (Eq. 17.37); the JSON classification prompt in which the in-context examples also demonstrate the output format; the speed-of-light example for zero-shot.
- **In the lecture, not written in the notes**: the case where $c$ should perhaps be a different constant (when the vectors are already aligned; the variance argument for $\sqrt{d_h}$ and the caveat that it is "only a heuristic" are both in Section 17.3 of the notes); that a sliding window can look back about $L\times w$ tokens after $L$ layers; that routing is decided per position and per layer; the `30B-A3B` naming; regularization for routing load balance and GPU allocation; how zero-shot changed deployment in industry; the problem with human-written chain of thought as an SFT target.
- **Presented differently**: for the motivation of sliding window, the lecture stresses saving compute ($T^2 \to T\cdot w$), while the notes stress that keys and values outside the window need not stay in the KV cache. For the origin of GQA, the lecture names the Qwen and DeepSeek models aloud, while the notes cite the original papers. For the third class in the classification example, the lecture says accounting and the notes write account.

**Series navigation**: Previous: [Lecture 14: large language models, the next-token loss, and how attention is computed](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) (Lecture 15 was a guest lecture with no public recording) | Next: [Lecture 18: reinforcement learning basics and policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en) (Lecture 17 was also a guest lecture with no public recording)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient](https://www.youtube.com/watch?v=hHC-SF3utxg)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the English transcript of the whole video (73 minutes) segment by segment, and checked the time ranges of each section and the quotations back against it. The formulas are reconstructed from what is said in the transcript, checked against Chapter 17 of the main notes. Student questions are mostly inaudible in the transcript, so the questions in this article are inferred from the answers.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 16 (YouTube)](https://www.youtube.com/watch?v=hHC-SF3utxg): the main source for this article. The lecture's explanations, examples, and quotations all come from this video's English transcript.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Sections 17.3–17.8 of Chapter 17, used to reconstruct the formula notation for GQA, the sliding window mask, MoE, and SFT, as well as the DeepSeek-V3 expert counts and the name of QK-Norm and the models that use it; the RMSNorm definition in Eq. (7.51) of Chapter 7.
- [Stanford CS229 Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm where this video sits among the public recordings and which lectures come before and after it.
- [CS229 course website](https://cs229.stanford.edu/): course identity and the entry point to the notes.
