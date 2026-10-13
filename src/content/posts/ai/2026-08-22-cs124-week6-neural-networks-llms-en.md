---
title: "Neural Networks and LLMs: From Units and Backpropagation to Decoder-Only Models | Stanford CS124 Week 6"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, neural-network, llm, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 7 }
tldr: "Week 6 has two halves. The pre-recorded material teaches neural networks: how one unit computes, why hidden layers are needed, the softmax, classification and language modeling with word vectors, and backpropagation. The live lecture introduces large language models: what they are, the three architectures, why so many tasks can be recast as continuing text, how to sample, how pretraining works, and how a model becomes an assistant."
description: "A guide to Stanford CS124 Winter 2026 Week 6: how a neural unit computes and its activation functions, why XOR needs a hidden layer, a hand-worked softmax, feedforward networks for sentiment classification and language modeling, backpropagation on a computation graph; the definition of an LLM, decoder/encoder/encoder-decoder, conditional generation, prompts, temperature sampling, the pretraining loss and teacher forcing, training data, and instruction tuning. Based on the 2026 public slides."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms)

This is Week 6 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). The parts from the first five weeks come together here: stack Week 3's logistic regression into layers, feed it Week 5's word vectors, train it on Week 2's objective of predicting the next word, and the result is a neural language model.

The week has two parts:

- **Pre-recorded material**: the basics of neural networks, paired with PA5.
- **The live lecture "LLMs and Transformers!"**: Dan Jurafsky's introduction to large language models. The lecture was not recorded, and its slides are public. How a Transformer works inside is covered in [next week's post](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en), together with PA6a, which implements it.

**This week's material**: the [Neural Networks slides](https://web.stanford.edu/class/cs124/lec/7_NN.pdf), the [Introduction to Large Language Models slides](https://web.stanford.edu/class/cs124/lec/llm_cs124_26.pdf) and [PA5](https://github.com/cs124/pa5-neural-networks). The assigned reading is [Chapter 6](https://web.stanford.edu/~jurafsky/slp3/old_aug25/6.pdf) of the August 2025 release of the textbook.

## Part one: neural networks

### A single unit

A neural unit does what Week 3's logistic regression does: take a weighted sum of the inputs, add a bias, and pass the result through a function.

z = w·x + b, with output a = f(z)

The slides' example: w = [0.2, 0.3, 0.9], b = 0.5, and input x = [0.5, 0.6, 0.1].

z = 0.2×0.5 + 0.3×0.6 + 0.9×0.1 + 0.5 = 0.87

With the sigmoid as f, the output is σ(0.87) ≈ 0.70.

f is called the **activation function**. Besides the sigmoid, the slides introduce two more:

- **tanh**: shaped like the sigmoid, with outputs between −1 and 1.
- **ReLU**: outputs z unchanged when it is above 0, and 0 when it is below. Written max(z, 0). It is the most commonly used today.

### Why one unit is not enough: XOR

The slides use a classic example to show the limit of a single unit. Consider three logical functions of two inputs that are each 0 or 1:

| x₁ | x₂ | AND | OR | XOR |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

AND and OR can each be computed by one unit: plot the four points on a plane and one straight line separates the points with output 0 from those with output 1. XOR cannot. The two points with output 1 sit on one diagonal and the two with output 0 on the other, and no straight line separates them. The decision boundary of a single unit is a straight line, so it cannot compute XOR.

The fix is another layer. The slides give a two-layer network with two hidden units using ReLU:

- h₁ = ReLU(x₁ + x₂)
- h₂ = ReLU(x₁ + x₂ − 1)
- y = h₁ − 2×h₂

Plug in the four inputs:

| x₁ | x₂ | h₁ | h₂ | y = h₁ − 2h₂ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 2 | 1 | 0 |

Look at the h₁ and h₂ columns. The four points that could not be separated have been moved to new positions in the hidden layer, and the inputs (0,1) and (1,0) both become (1,0), landing on top of each other. In this new space a straight line does the job. **The hidden layer turns the input into a representation that is easier to separate.** The weights in this example were designed by hand. A real network learns such a representation through training.

The nonlinear activation in the middle is essential. Without the ReLU, two layers of linear operations combine into one linear operation, which is the same as adding no layer.

### Feedforward networks and the softmax

Arrange many units into a layer, stack a few layers, and let each layer's output be the next layer's input: that is a **feedforward network**. A two-layer network is written:

- h = f(Wx + b) (the hidden layer)
- z = Uh (the scores at the output layer)
- y = softmax(z)

W and U are weight matrices. The slides describe it as just adding a hidden layer to logistic regression.

When the output has many classes, the sigmoid is replaced by the **softmax**: exponentiate each score and divide by the sum of all of them, giving probabilities that add up to 1. The slides' example:

z = [0.6, 1.1, −1.5, 1.2, 3.2, −1.1]

| z | 0.6 | 1.1 | −1.5 | 1.2 | 3.2 | −1.1 |
|---|---|---|---|---|---|---|
| e to the z | 1.82 | 3.00 | 0.22 | 3.32 | 24.53 | 0.33 |
| divided by the sum, 33.23 | 0.055 | 0.090 | 0.007 | 0.100 | 0.738 | 0.010 |

(The slides print the third and fourth values as 0.006 and 0.099, with the last digit truncated.) The largest score, 3.2, takes 74% of the probability. The softmax widens gaps: 3.2 is only 2 more than 1.2, and its probability is more than seven times as large.

### Applying it to text

The slides show two uses.

**Sentiment classification.** In Week 3 the features were hand-picked (the number of positive words, whether there is an exclamation mark). Now each word is replaced by its word vector, the vectors of all the words in a sentence are pooled into one (by taking the mean, or the element-wise max), and that goes into a feedforward network. Nobody designs the features. The network learns them.

**Language modeling.** The input is the vectors of the previous few words, concatenated and fed to the network. The output layer is a softmax over the whole vocabulary, giving the probability of the next word. Because the network's input has a fixed length, a window of fixed size slides to the right.

The slides give an example of how this beats an n-gram model. The training data contains "the cat gets fed" and never "the dog gets fed." An n-gram model has not seen what follows "dog gets" and has nothing to go on. In a neural language model the vectors for cat and dog are close, and the network gives similar outputs for similar inputs, so it predicts "fed" even though it never saw that sequence. The problem left open at the end of Week 2 (the larger n is, the more the model can only copy) is solved here.

### Backpropagation

Training still uses gradient descent, which needs the gradient of the loss with respect to every weight. Logistic regression has one layer and the gradient can be written down directly. In a multi-layer network, the weights in the early layers affect the loss only through several later layers.

The method is to draw the whole computation as a **computation graph** in which each node is one simple operation. First compute the value of every node from left to right (the forward pass). Then, from right to left, use the chain rule to pass the gradient back one step at a time (the backward pass).

The slides' example is L(a, b, c) = c × (a + 2b), with inputs a = 3, b = 1 and c = −2. Split it into three steps.

**Forward:**

- d = 2 × b = 2
- e = a + d = 5
- L = c × e = −10

**Backward:** starting from L, each step needs only the derivative of a node with respect to its direct inputs.

- L = c × e, so ∂L/∂e = c = −2 and ∂L/∂c = e = 5
- e = a + d, so ∂e/∂a = 1 and ∂e/∂d = 1. By the chain rule, ∂L/∂a = −2 × 1 = −2 and ∂L/∂d = −2 × 1 = −2
- d = 2 × b, so ∂d/∂b = 2. By the chain rule, ∂L/∂b = −2 × 2 = −4

The result: ∂L/∂a = −2, ∂L/∂b = −4, ∂L/∂c = 5.

You can check it. Change b from 1 to 1.1 and L becomes −2 × (3 + 2.2) = −10.4, a drop of 0.4, exactly −4 × 0.1.

Note that the backward pass used values computed in the forward pass (e = 5 became ∂L/∂c). So training always runs forward first and backward second, and the intermediate results of the forward pass have to be kept. Frameworks like PyTorch build this graph and run the backward pass automatically.

## Part two: large language models

### What one is

The slides' definition is short: a large language model is a neural network whose **input is a context and whose output is a probability distribution over the next word**.

That is the same job as Week 2's n-gram model. The differences are that it computes the distribution with a neural network (a Transformer) and that it is trained on an enormous amount of text. The slides' central argument is that text contains a huge amount of knowledge, and learning to guess the next word forces the model to pick that knowledge up. They list examples in which finishing each sentence correctly takes something different:

- "With roses, dahlias, and peonies, I was surrounded by ___" (flowers): knowing which words are kinds of which.
- "The room wasn't just big it was ___" (enormous): knowing degree.
- "The square root of 4 is ___": arithmetic.
- "The author of 'A Room of One's Own' is ___": a fact.

### Three architectures

| Architecture | Examples | How it is trained | Main use |
|---|---|---|---|
| **Decoder** | GPT, Claude, Llama, DeepSeek, Mistral | Predict the next token, left to right | Generating text. This is what people usually mean by LLM |
| **Encoder** | The BERT family | Mask some words and predict them from the context on both sides | Contextual embeddings; finetuned for classification |
| **Encoder-decoder** | Flan-T5, Whisper | Map one sequence to another | Machine translation, speech recognition |

The BERT used in Week 5's PA4 to get contextual embeddings is an encoder. From here the lecture covers only decoders. They go by several other names that mean the same thing: causal, autoregressive, left-to-right.

### Every task is continuing text

A decoder does one thing: look at the context, generate the next token, append it to the context, and generate the next. This is **conditional generation**.

The slides call the following the key historical intuition: many NLP tasks can be recast in this form.

- **Sentiment analysis**: give the model the text `The sentiment of the sentence "I like Jackie Chan" is:` and compare whether "positive" or "negative" has the higher probability as the next word.
- **Question answering**: give the model `Q: Who wrote the book 'The Origin of Species'? A:` and see what it continues with.

In Week 3 a classifier had to be trained specifically for sentiment. Now the same model does a different task when you change the text in front of it.

That text is the **prompt**. The slides add three points: a prompt can contain a few demonstrations for the model to follow; real products automatically prepend a **system prompt** the user never sees; and a system prompt can be long.

At this point the slides offer a reminder: we instinctively think of this as having a conversation, but the model is just doing conditional generation.

### Sampling: how the next word is chosen

The model outputs a probability distribution over the whole vocabulary, and one word still has to be picked from it.

**Always taking the most probable word** (greedy decoding) seems reasonable, but it is not what is done: the text it produces is too predictable, generic and repetitive.

**Drawing at random according to the probabilities** (random sampling) has a problem too. The vocabulary holds a great many odd words with very low probability. Each is tiny, but together they make up a sizable share of the distribution, so they get drawn often enough to send a sentence off course.

There is a trade-off between the two. Favoring high-probability words gives text that is more accurate and coherent but dull. Giving middle- and low-probability words more of a chance gives text with more variety but more errors.

**Temperature sampling** controls this trade-off with one parameter. Before the softmax, divide every score by a temperature τ.

Here are some numbers made up for this post. Three words have the scores [2, 1, 0].

| Temperature τ | After dividing by τ | Probabilities after softmax |
|---|---|---|
| 1 | [2, 1, 0] | 0.67, 0.24, 0.09 |
| 0.5 | [4, 2, 0] | 0.87, 0.12, 0.02 |
| 2 | [1, 0.5, 0] | 0.51, 0.31, 0.19 |

A temperature below 1 widens the gaps between scores and concentrates probability on the top word, approaching always picking the top one. A temperature above 1 narrows the gaps and evens the probabilities out. As τ approaches 0 this becomes greedy decoding. The Lab 2 question in Week 3 about dividing z by a number before the sigmoid was a preview of this.

### Pretraining: teach it only to guess the next word

The slides use one figure to split LLM training into three stages: pretraining, instruction tuning and preference alignment. This lecture covers the first two, and preference alignment waits for the final lecture in Week 10.

The pretraining algorithm is a few lines:

1. Take a large corpus of text.
2. At every position, ask the model to predict the next word.
3. Use gradient descent to adjust the weights so the prediction is less wrong.

This is **self-supervised**: no human labels are needed, because the next word in the text is the answer.

The loss is the negative log of the probability the model gave to the correct next word: −log p(correct word). It is the same thing as Week 3's cross-entropy. The correct distribution is 1 on the right word and 0 everywhere else, so only one term of the cross-entropy sum survives.

Training has a detail called **teacher forcing**. At position t the model sees the **correct** first t words and the loss for word t+1 is computed. At position t+1, whatever the model just guessed, the word appended to the context is the correct one. During training the model is never led astray by its own wrong guesses.

### Training data

The main source is the web. The slides' examples: Common Crawl is a snapshot of the whole web, with billions of pages, produced regularly by a non-profit; the 2025 FineWeb corpus distills 18.5 trillion English tokens from 96 Common Crawl dumps dating from 2013 to 2024.

The data is filtered first: boilerplate and porn are removed, duplicates are eliminated at the level of URLs, documents and even lines, and toxicity is detected.

What about other languages? There are more than seven thousand in the world. The slides say the answer is surprisingly simple: throw the data for all languages into one big file and pretrain on it. FineWeb2 covers a thousand languages and five billion documents. Week 2 mentioned what this costs: tokens are allocated mostly to English, and other languages get cut into smaller pieces.

### Instruction tuning: turning a text continuer into an assistant

A model that has only been pretrained cannot yet serve as an assistant. It is a text predictor and does not know you want it to answer. The slides give two examples:

- Prompted with "Explain the moon landing to a six year old in a few sentences," it continues with "Explain the theory of gravity to a 6 year old." It treats your sentence as the first item in a list of prompts and writes another one.
- Prompted with "Translate to French: The small dog," it continues with "The small dog crossed the road." It finished the sentence and did not translate.

The solution is **instruction tuning**, also called supervised fine-tuning (SFT): take the pretrained model and continue training it on a large dataset of instructions paired with correct responses. The data spans many tasks: question answering, translation, classification, summarization, writing. Training works exactly as in pretraining, still predicting the next word, with the data now in this format. One multilingual dataset the slides mention, Aya, has more than 500 million instructions in 114 languages.

This is different from putting demonstrations in a prompt. With demonstrations the model's weights do not change and only the context differs. Instruction tuning actually changes the weights by gradient descent.

### Evaluation and safety

Language models are still evaluated with Week 2's perplexity: the probability of the test text normalized by length, lower being better, and comparable only between models that use the same tokenization. The slides list three more things to look at: model size, the energy used in training, and fairness.

The last section of the live lecture is on safety and ethics. The slides start from Frankenstein: what Mary Shelley wrote in 1816 is a story about creating something that can act without taking responsibility for its actions. For LLMs specifically, the slides list these problems: models say things that are false, because the training objective asks only for text that is coherent and predictable and nothing enforces that it be true; models can suggest dangerous or illegal actions; much of the training data is copyrighted text, and whether that use is legal remains an open question around the world; website owners have not necessarily consented to being scraped; and the data is disproportionately written by authors from the US, which skews topics and viewpoints.

## PA5

**[PA5](https://github.com/cs124/pa5-neural-networks)** is a notebook in three stretches: first see why logistic regression is not enough; then write a network's initialization, forward pass, backward pass and prediction yourself; finally use word vectors as input to classify Yelp reviews, and answer ethics questions. One habit helps while writing it: before every matrix operation, write down the shapes of its input and output. With a batch of m examples of d dimensions each and a hidden layer of h units, X is m×d, W is d×h, and the hidden layer's output is m×h. Most mistakes are a matrix the wrong way round, and checking shapes catches them.

## Self-check

1. Take the slides' unit (w = [0.2, 0.3, 0.9], b = 0.5) and switch the activation to ReLU. What is the output for x = [0.5, 0.6, 0.1]? What if b is changed to −1? Answer: z = 0.87 and ReLU outputs 0.87. With b = −1, z = −0.63 and ReLU outputs 0.
2. Remove every ReLU from the XOR network. What does the input (1, 1) give? Answer: h₁ = 2, h₂ = 1, y = 2 − 2 = 0, which happens to still be right. But for the input (0, 0), h₂ = −1 and y = 0 − 2×(−1) = 2, which is wrong. Without ReLU cutting negatives off at 0, the network breaks.
3. In the computation-graph example, if c changes from −2 to −1.9, roughly how much does L change? Answer: ∂L/∂c = 5, so raising c by 0.1 raises L by about 0.5, from −10 to −9.5. Computing it directly: −1.9 × 5 = −9.5.
4. A model's distribution over the next word is "cat" 0.5, "dog" 0.3, "fish" 0.2, and the correct answer is "fish." What is the loss at this position? Answer: −ln(0.2) ≈ 1.61.
5. Three words have the scores [2, 1, 0] and the temperature is set to 0.1. What happens? Answer: after dividing by 0.1 the scores are [20, 10, 0], and the first word's probability is above 0.9999, practically greedy decoding.

## How this week connects to later ones

- This week treats the Transformer as a black box: context in, probability distribution out. Next week opens it up to see how attention lets each token draw on the tokens before it.
- Next week's PA6a has you write this week's sampling and loss yourself.
- The third stage of training, preference alignment, comes in Week 10.

**Series navigation**: previous, [Week 5: Embeddings and Social NLP](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en) | next, [Week 7: Transformers and Speech Processing](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en)

## Update Log

- 2026-10-13: Rewritten from the 2026 public slides. The source for the live lecture changed from an old 2025 file to the 2026 version the official schedule now links; added hand-worked examples for the unit, XOR, the softmax and the computation graph, new sections on conditional generation, temperature sampling, pretraining, training data, instruction tuning and safety, and a self-check.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Neural Networks slides](https://web.stanford.edu/class/cs124/lec/7_NN.pdf) — the unit example, XOR, the softmax example, applications of feedforward networks, computation graphs
- [Introduction to Large Language Models slides](https://web.stanford.edu/class/cs124/lec/llm_cs124_26.pdf) — the definition of an LLM, the three architectures, conditional generation, sampling, pretraining, training data, instruction tuning, evaluation and safety
- [CS124 PA5](https://github.com/cs124/pa5-neural-networks)
- [Speech and Language Processing, August 2025 release, Chapter 6](https://web.stanford.edu/~jurafsky/slp3/old_aug25/6.pdf)
